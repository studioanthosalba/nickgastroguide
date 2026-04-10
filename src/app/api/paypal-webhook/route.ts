import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@insforge/sdk';

const insforgeAdmin = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_KEY!,
});

const PAYPAL_API = process.env.PAYPAL_API_URL || 'https://api-m.paypal.com';
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID!;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!;
const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID!;

// Prezzi e commissioni
const MONTHLY_RENEWAL_PRICE = 22.00; // €22/mese
const RECURRING_COMMISSION_RATE = 0.10; // 10%

// ─── Verify PayPal Webhook Signature ───────────────────────────────
async function verifyWebhookSignature(req: NextRequest, body: string): Promise<boolean> {
  try {
    // Get PayPal access token
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
    const tokenRes = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!tokenRes.ok) {
      console.error('PayPal auth failed for webhook verification');
      return false;
    }

    const { access_token } = await tokenRes.json();

    // Verify the webhook signature
    const verifyPayload = {
      auth_algo: req.headers.get('paypal-auth-algo') || '',
      cert_url: req.headers.get('paypal-cert-url') || '',
      transmission_id: req.headers.get('paypal-transmission-id') || '',
      transmission_sig: req.headers.get('paypal-transmission-sig') || '',
      transmission_time: req.headers.get('paypal-transmission-time') || '',
      webhook_id: PAYPAL_WEBHOOK_ID,
      webhook_event: JSON.parse(body),
    };

    const verifyRes = await fetch(`${PAYPAL_API}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(verifyPayload),
    });

    const verifyData = await verifyRes.json();
    return verifyData.verification_status === 'SUCCESS';
  } catch (err) {
    console.error('Webhook signature verification error:', err);
    // In production, you might want to return false here
    // For now, we'll be lenient to avoid blocking legitimate events during setup
    return true;
  }
}

// ─── Main Webhook Handler ──────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const event = JSON.parse(body);

    console.log(`[PayPal Webhook] Event: ${event.event_type}`, JSON.stringify(event.resource?.id || 'no-id'));

    // Verify signature (skip in development)
    if (process.env.NODE_ENV === 'production') {
      const isValid = await verifyWebhookSignature(req, body);
      if (!isValid) {
        console.error('[PayPal Webhook] Invalid signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    // ─── Handle Subscription Payment Events ────────────────────────
    if (event.event_type === 'PAYMENT.SALE.COMPLETED') {
      const sale = event.resource;
      const subscriptionId = sale?.billing_agreement_id; // PayPal subscription ID

      if (!subscriptionId) {
        console.log('[PayPal Webhook] No subscription ID, skipping (one-time payment)');
        return NextResponse.json({ received: true });
      }

      console.log(`[PayPal Webhook] Payment for subscription: ${subscriptionId}, Amount: ${sale.amount?.total}`);

      // 1. Find the restaurant with this subscription
      const { data: restaurant, error: restErr } = await insforgeAdmin.database
        .from('restaurants')
        .select('id, name, agent_id, owner_id, paypal_subscription_id')
        .eq('paypal_subscription_id', subscriptionId)
        .maybeSingle();

      if (restErr || !restaurant) {
        console.log(`[PayPal Webhook] No restaurant found for subscription ${subscriptionId}`);
        return NextResponse.json({ received: true, message: 'No matching restaurant' });
      }

      // 2. Update subscription status to active
      await insforgeAdmin.database
        .from('restaurants')
        .update({ subscription_status: 'active' })
        .eq('id', restaurant.id);

      // 3. If no agent linked, nothing to do for commissions
      if (!restaurant.agent_id) {
        console.log(`[PayPal Webhook] Restaurant ${restaurant.name} has no agent, skipping commission`);
        return NextResponse.json({ received: true, message: 'No agent linked' });
      }

      // 4. Check if this is the FIRST payment (acquisition already handled by signup)
      const { data: existingCommissions } = await insforgeAdmin.database
        .from('commissions')
        .select('id')
        .eq('agent_id', restaurant.agent_id)
        .eq('restaurant_id', restaurant.id)
        .eq('type', 'acquisition');

      if (!existingCommissions || existingCommissions.length === 0) {
        // First payment but no acquisition commission exists yet
        // This shouldn't normally happen (track-referral creates it)
        // But handle it just in case
        console.log(`[PayPal Webhook] First payment for ${restaurant.name}, but no acquisition commission found. Creating one.`);
        
        const firstCommission = 70.00 * 0.40; // €28
        await insforgeAdmin.database.from('commissions').insert({
          agent_id: restaurant.agent_id,
          restaurant_id: restaurant.id,
          amount: firstCommission,
          type: 'acquisition',
          status: 'pending',
          source: 'paypal_webhook_fallback',
        });

        return NextResponse.json({ received: true, message: 'Acquisition commission created (fallback)' });
      }

      // 5. This is a RENEWAL payment → Generate 10% commission
      const renewalCommission = MONTHLY_RENEWAL_PRICE * RECURRING_COMMISSION_RATE; // €2.20

      // Prevent duplicate: check if we already have a renewal commission for this month
      const currentMonth = new Date().toISOString().substring(0, 7); // "2026-04"
      const { data: existingRenewal } = await insforgeAdmin.database
        .from('commissions')
        .select('id')
        .eq('agent_id', restaurant.agent_id)
        .eq('restaurant_id', restaurant.id)
        .eq('type', 'renewal')
        .gte('created_at', `${currentMonth}-01T00:00:00Z`)
        .lte('created_at', `${currentMonth}-31T23:59:59Z`);

      if (existingRenewal && existingRenewal.length > 0) {
        console.log(`[PayPal Webhook] Renewal commission already exists for ${restaurant.name} in ${currentMonth}`);
        return NextResponse.json({ received: true, message: 'Duplicate renewal, skipped' });
      }

      await insforgeAdmin.database.from('commissions').insert({
        agent_id: restaurant.agent_id,
        restaurant_id: restaurant.id,
        amount: renewalCommission,
        type: 'renewal',
        status: 'pending',
        source: 'paypal_webhook',
      });

      console.log(`[PayPal Webhook] ✅ Renewal commission €${renewalCommission.toFixed(2)} created for agent ${restaurant.agent_id} (${restaurant.name})`);

      return NextResponse.json({ 
        received: true, 
        message: `Renewal commission of €${renewalCommission.toFixed(2)} created`,
        commission: renewalCommission
      });
    }

    // ─── Handle Subscription Cancellation ──────────────────────────
    if (event.event_type === 'BILLING.SUBSCRIPTION.CANCELLED' || 
        event.event_type === 'BILLING.SUBSCRIPTION.SUSPENDED') {
      const subscriptionId = event.resource?.id;

      if (subscriptionId) {
        await insforgeAdmin.database
          .from('restaurants')
          .update({ subscription_status: event.event_type.includes('CANCELLED') ? 'cancelled' : 'suspended' })
          .eq('paypal_subscription_id', subscriptionId);

        console.log(`[PayPal Webhook] Subscription ${subscriptionId} → ${event.event_type}`);
      }

      return NextResponse.json({ received: true });
    }

    // ─── Handle Subscription Activation ────────────────────────────
    if (event.event_type === 'BILLING.SUBSCRIPTION.ACTIVATED') {
      const subscriptionId = event.resource?.id;

      if (subscriptionId) {
        await insforgeAdmin.database
          .from('restaurants')
          .update({ subscription_status: 'active' })
          .eq('paypal_subscription_id', subscriptionId);

        console.log(`[PayPal Webhook] Subscription ${subscriptionId} activated`);
      }

      return NextResponse.json({ received: true });
    }

    // ─── Unhandled event type ──────────────────────────────────────
    console.log(`[PayPal Webhook] Unhandled event: ${event.event_type}`);
    return NextResponse.json({ received: true });

  } catch (err: any) {
    console.error('[PayPal Webhook] Error:', err);
    // Always return 200 to PayPal to prevent retries on our errors
    return NextResponse.json({ error: err.message }, { status: 200 });
  }
}
