import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@insforge/sdk';

const insforgeAdmin = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_KEY!,
});

// Prezzi reali GastroGuide
const FIRST_PURCHASE_PRICE = 70.00; // €70 primo acquisto
const MONTHLY_RENEWAL_PRICE = 22.00; // €22/mese rinnovi
const FIRST_COMMISSION_RATE = 0.40; // 40%
const RECURRING_COMMISSION_RATE = 0.10; // 10%

export async function POST(req: NextRequest) {
  try {
    const { referral_code, new_user_id, source } = await req.json();

    if (!referral_code || !new_user_id) {
      return NextResponse.json({ error: 'referral_code e new_user_id richiesti' }, { status: 400 });
    }

    // 1. Find the agent by referral code
    const { data: agent, error: agentErr } = await insforgeAdmin.database
      .from('profiles')
      .select('id, full_name, role')
      .eq('referral_code', referral_code)
      .single();

    if (agentErr || !agent) {
      return NextResponse.json({ error: 'Codice referral non valido' }, { status: 404 });
    }

    // 2. Update the new user's profile with the agent reference + source tag
    const updatePayload: any = { referred_by_agent_id: agent.id };
    if (source) {
      updatePayload.referral_source = source;
    }

    const { error: updateErr } = await insforgeAdmin.database
      .from('profiles')
      .update(updatePayload)
      .eq('id', new_user_id);

    if (updateErr) {
      console.error('Failed to update referred_by_agent_id:', updateErr);
      return NextResponse.json({ error: 'Errore nell\'assegnazione del referral' }, { status: 500 });
    }

    // 3. Check if this user has a restaurant (for immediate commission)
    const { data: restaurant } = await insforgeAdmin.database
      .from('restaurants')
      .select('id, name')
      .eq('owner_id', new_user_id)
      .maybeSingle();

    if (restaurant) {
      // 3.1 Update restaurant's agent_id
      await insforgeAdmin.database
        .from('restaurants')
        .update({ agent_id: agent.id })
        .eq('id', restaurant.id);

      // Generate 40% first-purchase commission on €70
      const commissionAmount = FIRST_PURCHASE_PRICE * FIRST_COMMISSION_RATE; // €28.00

      await insforgeAdmin.database.from('commissions').insert({
        agent_id: agent.id,
        restaurant_id: restaurant.id,
        amount: commissionAmount,
        type: 'acquisition',
        status: 'pending',
        source: source || null,
      });

      return NextResponse.json({ 
        success: true, 
        message: `Referral tracciato e commissione di €${commissionAmount.toFixed(2)} generata`,
        commission_amount: commissionAmount
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Referral tracciato con successo. La commissione verrà generata quando il ristoratore attiverà il servizio.'
    });

  } catch (err: any) {
    console.error('Track Referral Error:', err);
    return NextResponse.json({ error: err.message || 'Errore interno' }, { status: 500 });
  }
}
