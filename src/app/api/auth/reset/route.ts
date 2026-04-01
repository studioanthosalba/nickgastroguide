import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { insforge } from '@/lib/insforge';
import { ADMIN_EMAILS } from '@/lib/constants';

export async function POST(req: Request) {
  try {
    const { email, isAdminRecovery } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email mancante' }, { status: 400 });

    const normalizedEmail = email.toLowerCase().trim();

    // 0. Se è un recupero admin, verifica i permessi
    if (isAdminRecovery) {
       if (!ADMIN_EMAILS.includes(normalizedEmail)) {
          return NextResponse.json({ 
            error: 'Accesso negato: questa email non è autorizzata al recupero amministrativo.' 
          }, { status: 403 });
       }
    }

    // 1. Verifica se l'utente esiste nel database
    const { data: userExists, error: checkError } = await insforge.database
      .from('users')
      .select('id')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (checkError) {
      console.error("Errore verifica utente:", checkError);
      return NextResponse.json({ error: 'Errore durante la verifica dell\'account' }, { status: 500 });
    }

    if (!userExists) {
      return NextResponse.json({ 
        error: 'L\'email inserita non è registrata nel nostro sistema. Verifica l\'indirizzo o registrati.' 
      }, { status: 404 });
    }

    // 1. Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins

    // 2. Clear old codes and insert new
    await insforge.database.from('password_reset_codes').delete().eq('email', normalizedEmail);
    const { error: dbError } = await insforge.database.from('password_reset_codes').insert([{
      email: normalizedEmail,
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

    const mailOptions = {
      from: '"Nick GastroGuide" <info@nickgastroguide.it>',
      to: normalizedEmail,
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
          <p style="font-size: 10px; color: #eee; text-align: center;">Sent via Next.js API / Hostinger</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Email sent" });

  } catch (err: any) {
    console.error("NextJS Email API Error:", err.message || err);
    return NextResponse.json({ error: err.message || 'Errore interno' }, { status: 400 });
  }
}
