import { NextResponse } from 'next/server';
import { createClient } from '@insforge/sdk';

const insforgeAdmin = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_KEY!,
});

export async function POST(req: Request) {
  try {
    const { slug, restaurant_id } = await req.json();

    if (!slug) {
      return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
    }

    // Se non abbiamo restaurant_id, lo cerchiamo dal slug
    let rid = restaurant_id;
    if (!rid) {
      const { data } = await insforgeAdmin.database
        .from('restaurants')
        .select('id')
        .eq('slug', slug)
        .single();
      rid = data?.id;
    }

    if (!rid) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    const { error } = await insforgeAdmin.database
      .from('review_clicks')
      .insert({ restaurant_id: rid, slug });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Track review click error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
