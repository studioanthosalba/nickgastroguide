import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@insforge/sdk';

const insforgeAdmin = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_KEY!,
});

const PAYPAL_API = process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID!;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!;
const MIN_PAYOUT = 50; // €50 minimum

async function getPayPalAccessToken(): Promise<string> {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  
  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`PayPal auth failed: ${err}`);
  }

  const data = await res.json();
  return data.access_token;
}

export async function POST(req: NextRequest) {
  try {
    const { agent_id } = await req.json();

    if (!agent_id) {
      return NextResponse.json({ error: 'agent_id richiesto' }, { status: 400 });
    }

    // 1. Fetch agent profile
    const { data: profile, error: profileErr } = await insforgeAdmin.database
      .from('profiles')
      .select('id, full_name, paypal_email, role')
      .eq('id', agent_id)
      .single();

    if (profileErr || !profile) {
      return NextResponse.json({ error: 'Profilo agente non trovato' }, { status: 404 });
    }

    if (profile.role !== 'agent' && profile.role !== 'admin') {
      return NextResponse.json({ error: 'Solo gli agenti possono richiedere pagamenti' }, { status: 403 });
    }

    if (!profile.paypal_email) {
      return NextResponse.json({ 
        error: 'Devi configurare il tuo indirizzo PayPal nelle Impostazioni prima di richiedere un pagamento.' 
      }, { status: 400 });
    }

    // 2. Calculate available balance (pending commissions)
    const { data: pendingCommissions, error: commErr } = await insforgeAdmin.database
      .from('commissions')
      .select('id, amount')
      .eq('agent_id', agent_id)
      .eq('status', 'pending');

    if (commErr) {
      return NextResponse.json({ error: 'Errore nel recupero delle commissioni' }, { status: 500 });
    }

    const totalPending = (pendingCommissions || []).reduce(
      (sum: number, c: any) => sum + parseFloat(c.amount), 0
    );

    if (totalPending < MIN_PAYOUT) {
      return NextResponse.json({ 
        error: `Il saldo minimo per richiedere un pagamento è €${MIN_PAYOUT}. Saldo attuale: €${totalPending.toFixed(2)}` 
      }, { status: 400 });
    }

    // 3. Get PayPal access token
    const accessToken = await getPayPalAccessToken();

    // 4. Create PayPal Payout
    const senderBatchId = `NGG_${agent_id.substring(0, 8)}_${Date.now()}`;
    
    const payoutPayload = {
      sender_batch_header: {
        sender_batch_id: senderBatchId,
        email_subject: 'Pagamento Commissioni Nick GastroGuide',
        email_message: `Hai ricevuto un pagamento di €${totalPending.toFixed(2)} per le tue commissioni come agente GastroGuide.`,
      },
      items: [
        {
          recipient_type: 'EMAIL',
          amount: {
            value: totalPending.toFixed(2),
            currency: 'EUR',
          },
          receiver: profile.paypal_email,
          note: `Commissioni GastroGuide - ${new Date().toLocaleDateString('it-IT')}`,
          sender_item_id: senderBatchId,
        },
      ],
    };

    const payoutRes = await fetch(`${PAYPAL_API}/v1/payments/payouts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payoutPayload),
    });

    const payoutData = await payoutRes.json();

    if (!payoutRes.ok) {
      console.error('PayPal Payout Error:', JSON.stringify(payoutData));
      return NextResponse.json({ 
        error: 'Errore durante il pagamento PayPal. Riprova più tardi.',
        details: payoutData.message || payoutData.name 
      }, { status: 500 });
    }

    // 5. Create payout record
    const paypalBatchId = payoutData.batch_header?.payout_batch_id || senderBatchId;

    await insforgeAdmin.database.from('payouts').insert({
      agent_id,
      amount: totalPending,
      status: 'processing',
      paypal_ref: paypalBatchId,
    });

    // 6. Mark all pending commissions as paid
    const commissionIds = (pendingCommissions || []).map((c: any) => c.id);
    
    for (const cId of commissionIds) {
      await insforgeAdmin.database
        .from('commissions')
        .update({ 
          status: 'paid', 
          paid_at: new Date().toISOString(),
          transaction_id: paypalBatchId 
        })
        .eq('id', cId);
    }

    return NextResponse.json({ 
      success: true, 
      message: `Pagamento di €${totalPending.toFixed(2)} inviato a ${profile.paypal_email}`,
      payout_id: paypalBatchId,
      amount: totalPending.toFixed(2)
    });

  } catch (err: any) {
    console.error('Payout Error:', err);
    return NextResponse.json({ error: err.message || 'Errore interno del server' }, { status: 500 });
  }
}
