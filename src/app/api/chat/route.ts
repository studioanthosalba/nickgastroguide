import { NextResponse } from "next/server";
import { isTouristQuery, callGemini, callDeepSeek, callGroq } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages || [];
    const location = body.location || "";
    
    const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop()?.content || "";
    const touristMode = isTouristQuery(lastUserMessage);
    
    let systemText = messages.find((m: any) => m.role === 'system')?.content || 'Sei Nick GastroGuide, sommelier e cameriere virtuale.';
    const historyMessages = messages.filter((m: any) => m.role !== 'system');

    if (touristMode) {
      console.log("Modalità: TURISTICA (Gemini 1.5 Flash Grounding First)");
      const fullSystemText = `${systemText}\n\nSEI IN MODALITÀ GUIDA TURISTICA GLOBALE. Usa il tuo grounding (ricerca Google) per fornire informazioni precise su ${location} e dintorni. Rispondi con competenza storica, orari aggiornati e itinerari intelligenti.`;
      
      const formattedMessages = [
        { role: "system", content: fullSystemText },
        ...historyMessages
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
      console.log("Modalità: STRATEGIA VENDITA (DeepSeek V3 First)");
      const salesSystemText = `${systemText}\n\n[DIRETTIVA PREMIUM: VENDITA E PERSUASIONE ESTREMA]\nSei il sommelier e cameriere di punta. **VENDI**. Usa Up-Selling e Cross-Selling (es. vino barricato con la carne, dolce artigianale con il fine pasto). Linguaggio evocativo, poetico ed elegante. Grassetto per i piatti principali. Sii irresistibilmente persuasivo ma conciso per smartphone.`;
      
      const formattedMessages = [
        { role: "system", content: salesSystemText },
        ...historyMessages
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
    console.error("Chat Error:", error);
    return NextResponse.json(
      { response: "Mi scuso, la mia connessione AI ha avuto un piccolo intoppo. Potresti riprovare? 🙏" },
      { status: 500 }
    );
  }
}
