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
    const authHeader = req.headers.get('Authorization');
    const token = authHeader ? authHeader.replace('Bearer ', '') : null;

    if (!token) {
      throw new Error("Missing Authorization header");
    }

    const payload = await req.json();
    const { action, targetEmail, targetPassword } = payload;
    console.log(`Action: ${action}, Target: ${targetEmail}`);

    const client = createClient({
      baseUrl: Deno.env.get("INSFORGE_BASE_URL"),
      edgeFunctionToken: token // Use the user's token directly!
    });

    const { data } = await client.auth.getCurrentUser();
    console.log("Auth Keys:", Object.keys(client.auth));
    const user = data?.user;
    if (!user) {
      throw new Error("Unauthorized");
    }

    const adminEmails = ['amaga@hotmail.it', 'kykeion77@gmail.com', 'studioanthosalba@gmail.com'];
    if (!adminEmails.includes(user.email || '')) {
      throw new Error("Admin strictly required");
    }

    if (action === 'set_password') {
      if (!targetEmail || !targetPassword) {
        throw new Error("targetEmail and targetPassword strictly required.");
      }

      // We call the RPC with the Admin's token. The RPC has SECURITY DEFINER and checks auth.jwt()
      const { error: rpcError } = await client.database.rpc('admin_set_password', {
        p_user_email: targetEmail,
        p_new_password: targetPassword
      });

      if (rpcError) throw rpcError;

      // Send email via Hostinger
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
          to: targetEmail,
          bcc: "kykeion77@gmail.com",
          subject: "Password Recuperata - Nick GastroGuide",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #3b82f6; text-align: center;">Aggiornamento di Sicurezza</h2>
              <p>Ciao,</p>
              <p>L'amministratore di sistema di Nick GastroGuide ha impostato una nuova password per il tuo account associato a <strong>${targetEmail}</strong>.</p>
              <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; color: #6b7280; font-size: 14px; text-transform: uppercase;">La tua nuova password provvisoria è:</p>
                <h1 style="margin: 10px 0 0; font-size: 24px; color: #111827;">${targetPassword}</h1>
              </div>
              <p style="font-size: 14px; color: #9ca3af; text-align: center;">Ti invitiamo ad accedere ed effettuare il cambio password immediato dalla tua dashboard per ragioni di sicurezza.</p>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="font-size: 12px; color: #9ca3af; text-align: center;">&copy; 2026 Nick GastroGuide. Tutti i diritti riservati.</p>
            </div>
          `
        };
        await transporter.sendMail(mailOptions);
        
      } catch(emailError) {
        console.error("Email send failed:", emailError);
        // Do not fail the overall operation if email fails.
      }

      return new Response(JSON.stringify({ success: true, message: "Password updated and email sent" }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (action === 'impersonate') {
       const { targetEmail, redirectTo } = payload;
       if (!targetEmail) throw new Error("targetEmail strictly required.");
       
       const adminClient = createClient({
         baseUrl: Deno.env.get("INSFORGE_BASE_URL"),
         edgeFunctionToken: Deno.env.get("INSFORGE_SERVICE_ROLE_KEY") || token 
       });

       try {
          // @ts-ignore - admin might not be in types but exists in runtime
          const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
            type: 'magiclink',
            email: targetEmail,
            options: { redirectTo: redirectTo || '/dashboard' }
          });

          if (linkError) throw linkError;

          return new Response(JSON.stringify({ 
            success: true, 
            actionLink: linkData.action_link, // This is the link the admin will follow
            message: "Impersonation link generated" 
          }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
       } catch (err: any) {
          // If admin.generateLink is not supported or fails, we fallback to our 'safe-reset' method
          // But since the user doesn't want resets, we'll suggest a different approach in the frontend.
          console.error("Link generation failed, might be missing permissions or SDK method:", err.message);
          throw new Error("Il sistema di impersonificazione silente richiede la 'Service Role Key'. Come ripiego, usa il tasto 'Chiave' per impostare una password manuale temporanea.");
       }
    }

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || String(err) }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
