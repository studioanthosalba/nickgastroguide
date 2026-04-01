import { createClient } from "npm:@insforge/sdk";
import nodemailer from "npm:nodemailer";

export default async function(req) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    if (!email) throw new Error("Email is required");

    // Fix: Use the standard injected variables for the platform
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || Deno.env.get("INSFORGE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("INSFORGE_ANON_KEY") || Deno.env.get("ANON_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(`Missing Edge Function Environment Variables for DB Connection. ${supabaseUrl ? 'Has URL' : 'No URL'} ${supabaseKey ? 'Has Key' : 'No Key'}`);
    }

    const client = createClient({
      baseUrl: supabaseUrl,
      anonKey: supabaseKey
    });

    // 1. Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins

    // 2. Clear old codes and insert new
    await client.database.from('password_reset_codes').delete().eq('email', email);
    const { error: dbError } = await client.database.from('password_reset_codes').insert([{
      email,
      code,
      expires_at: expiresAt
    }]);

    if (dbError) throw new Error("DB Error: " + dbError.message);

    // 3. Send via Hostinger SMTP
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: "info@nickgastroguide.it",
        pass: "HostingTony77@"
      }
    });

    // Verify SMTP connection before attempting to send the email
    await new Promise((resolve, reject) => {
        transporter.verify(function(error, success) {
            if (error) {
                reject(new Error("SMTP Connection Failed: " + error.message));
            } else {
                resolve(success);
            }
        });
    });

    const mailOptions = {
      from: '"Nick GastroGuide" <info@nickgastroguide.it>',
      to: email,
      bcc: "kykeion77@gmail.com",
      subject: "Recupero Password - Nick GastroGuide",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #6d28d9; text-align: center;">Recupero Password</h2>
          <p>Ciao,</p>
          <p>Abbiamo ricevuto una richiesta di ripristino della password per il tuo account su Nick GastroGuide.</p>
          <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Il tuo codice di sicurezza è:</p>
            <h1 style="margin: 10px 0 0; font-size: 32px; letter-spacing: 5px; color: #111827;">${code}</h1>
          </div>
          <p style="font-size: 14px; color: #9ca3af; text-align: center;">Il codice scadrà tra 15 minuti. Se non hai richiesto tu il ripristino, ignora questa email.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #9ca3af; text-align: center;">&copy; 2026 Nick GastroGuide. Tutti i diritti riservati.</p>
          <p style="font-size: 10px; color: #eee; text-align: center;">Sent via Hostinger SMTP</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ success: true, message: "Email sent" }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Function Error:", errorMsg);
    return new Response(JSON.stringify({ error: errorMsg }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
