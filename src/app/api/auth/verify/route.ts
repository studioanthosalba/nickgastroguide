import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { insforge } from '@/lib/insforge';

export async function POST(req: Request) {
  try {
    const { email, code, newPassword } = await req.json();
    if (!email || !code || !newPassword) return NextResponse.json({ error: 'Email, codice e nuova password obbligatori' }, { status: 400 });

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Verify code
    const { data: resetData, error: fetchError } = await insforge.database
      .from('password_reset_codes')
      .select('*')
      .eq('email', normalizedEmail)
      .eq('code', code)
      .single();

    if (fetchError || !resetData) {
      return NextResponse.json({ error: 'Codice non valido o scaduto' }, { status: 400 });
    }

    if (new Date(resetData.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Codice scaduto' }, { status: 400 });
    }

    // 2. Reset password using SQL Function
    const { data: rpcData, error: rpcError } = await insforge.database.rpc('reset_user_password', {
      p_email: normalizedEmail,
      p_new_password: newPassword
    });

    if (rpcError) throw new Error("RPC Error: " + rpcError.message);
    
    // 3. Send confirmation via Hostinger SMTP
    try {
      const transporter = nodemailer.createTransport({
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
        to: normalizedEmail,
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
    }

    // 4. Cleanup
    await insforge.database.from('password_reset_codes').delete().eq('email', normalizedEmail);

    return NextResponse.json({ success: true, message: "Password updated successfully" });

  } catch (err: any) {
    console.error("NextJS Email Verify Error:", err.message || err);
    return NextResponse.json({ error: err.message || 'Errore interno' }, { status: 400 });
  }
}
