import { createClient } from "npm:@insforge/sdk";

export default async function(req: Request) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const { email, code, newPassword } = await req.json();
    if (!email || !code || !newPassword) throw new Error("Email, code and newPassword are required");

    const client = createClient({
      baseUrl: Deno.env.get("INSFORGE_BASE_URL"),
      anonKey: Deno.env.get("ANON_KEY")
    });

    // 1. Verify code
    const { data: resetData, error: fetchError } = await client.database
      .from('password_reset_codes')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .single();

    if (fetchError || !resetData) {
      throw new Error("Codice non valido o scaduto");
    }

    if (new Date(resetData.expires_at) < new Date()) {
      throw new Error("Codice scaduto");
    }

    // 2. Reset password using SQL Function
    const { data: rpcData, error: rpcError } = await client.database.rpc('reset_user_password', {
      p_email: email,
      p_new_password: newPassword
    });

    if (rpcError) throw rpcError;
    
    // 3. Send confirmation via Hostinger SMTP
    try {
      const nodemailer = await import("npm:nodemailer");
      const transporter = nodemailer.default.createTransport({
        host: "smtp.hostinger.com",
        port: 465,
        secure: true,
        auth: {
          user: "info@nickgastroguide.it",
          pass: "HostingTony77@"
        }
      });

      const mailOptions = {
        from: '"Nick GastroGuide" <info@nickgastroguide.it>',
        to: email,
        bcc: "kykeion77@gmail.com",
        subject: "Password Modificata con Successo - Nick GastroGuide",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #10b981; text-align: center;">Password Aggiornata</h2>
            <p>Ciao,</p>
            <p>La password per il tuo account su Nick GastroGuide è stata modificata correttamente.</p>
            <p>Se non hai effettuato tu questa modifica, contatta immediatamente il supporto a <a href="mailto:info@nickgastroguide.it">info@nickgastroguide.it</a>.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #9ca3af; text-align: center;">&copy; 2026 Nick GastroGuide. Tutti i diritti riservati.</p>
          </div>
        `
      };
      await transporter.sendMail(mailOptions);
    } catch (mailErr) {
      console.error("Failed to send confirmation email:", mailErr);
      // Don't fail the whole request if email fail
    }

    // 4. Cleanup
    await client.database.from('password_reset_codes').delete().eq('email', email);

    return new Response(JSON.stringify({ success: true, message: "Password updated successfully" }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (err) {
    const error = err as any;
    return new Response(JSON.stringify({ error: error.message || String(error) }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
