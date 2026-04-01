import { NextResponse } from "next/server";
import { isTouristQuery, callGemini, callDeepSeek, callGroq } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastUserMessage = messages[messages.length - 1].content;
    const touristMode = isTouristQuery(lastUserMessage);

    const baseSystemPrompt = `
      Oggi è ${new Date().toLocaleDateString('it-IT')}.
      Sei l'Oste dell'Osteria Romana, un ristorante autentico a Trastevere, Roma. 
      Tono: Verace, simpatico, professionale.
      Usa **grassetto** per i piatti e vini.
      
      MENU DELL'OSTERIA ROMANA:
      Antipasti: Supplì (8€), Bruschetta (6€), Crostini (7€), Fritto misto (10€)
      Primi: Carbonara (12€), Amatriciana (12€), Cacio e pepe (10€), Tortellini (14€)
      Secondi: Coda alla vaccinara (18€), Pollo cacciatora (16€), Bistecca (20€), Trippa (18€)
      Dolci: Tiramisù (8€), Panna cotta (7€), Cannoli (10€)
    `;

    if (touristMode) {
      console.log("DEMO-CHAT Modalità: TURISTICA (Gemini 1.5 Flash Grounding First)");
      const touristPrompt = `
        ${baseSystemPrompt}
        [GROUNDING RESEARCH MODE]: Hai il superpotere della ricerca Google in tempo reale. 
        Se il cliente chiede cosa fare/visitare o mostre, devi assolutamente informarti tramite il tuo tool di ricerca Google. 
        Sii una guida turistica aggiornata al minuto per oggi ${new Date().toLocaleDateString('it-IT')}.
      `;
      
      const formattedMessages = [
        { role: "system", content: touristPrompt },
        ...messages
      ];

      try {
        const text = await callGemini(formattedMessages, true);
        return NextResponse.json({ response: text });
      } catch {
        try {
          const text = await callDeepSeek(formattedMessages, 'deepseek-reasoner');
          return NextResponse.json({ response: text });
        } catch {
          const text = await callGroq(formattedMessages);
          return NextResponse.json({ response: text });
        }
      }
    } else {
      console.log("DEMO-CHAT Modalità: RISTORANTE (DeepSeek V3 First)");
      const salesPrompt = `${baseSystemPrompt}\n\n[ISTRUZIONE VENDITA]: Vendi i piatti del menu! Proponi abbinamenti vino-piatto. Tono verace trasteverino.`;
      
      const formattedMessages = [
        { role: "system", content: salesPrompt },
        ...messages
      ];

      try {
        const text = await callDeepSeek(formattedMessages, 'deepseek-chat', 0.8);
        return NextResponse.json({ response: text });
      } catch {
        try {
          const text = await callGemini(formattedMessages, false);
          return NextResponse.json({ response: text });
        } catch {
          const text = await callGroq(formattedMessages);
          return NextResponse.json({ response: text });
        }
      }
    }

  } catch (error: any) {
    console.error("Demo Chat Error:", error);
    return NextResponse.json(
      { response: "Aho! C'è un po' di confusione in cucina, riprova tra un attimo che l'oste arriva!" },
      { status: 500 }
    );
  }
}
