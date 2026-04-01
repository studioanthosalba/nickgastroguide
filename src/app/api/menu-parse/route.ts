import { NextResponse } from "next/server";
import OpenAI from "openai";

const deepseekClient = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: Request) {
  let text = "";
  try {
    const body = await req.json();
    text = body.text;
    const restaurantId = body.restaurantId;
    
    const prompt = `
      Sei un esperto di gastronomia italiana e data scientist.
      Analizza questo testo sconnesso (preso da un menù) e strutturalo **esattamente** nel formato prescelto.
      DEVI restituire ESCLUSIVAMENTE un oggetto JSON valido. Nessuna riga di testo, né prima né dopo.
      
      Struttura esatta richiesta:
      {
        "categories": [
          {
            "name": "Nome Categoria (es. Antipasti, Primi)",
            "items": [
              {
                "name": "Nome Piatto",
                "description": "Descrizione/Ingredienti",
                "price": "Prezzo (es. 12.50 - solo numero/stringa pulita)",
                "allergens": ["Allergeni"]
              }
            ]
          }
        ]
      }

      Testo del menù da analizzare:
      ${text}
    `;

    const completion = await deepseekClient.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: 'deepseek-chat',
      response_format: { type: 'json_object' },
      temperature: 0.2, // Bassa temperatura per task di strutturazione dati e JSON deterministico
    });

    const responseText = completion.choices[0].message.content || "{}";
    
    // Safety clean
    const cleanJson = responseText.replace(/```json|```/g, "").trim();
    const parsedData = JSON.parse(cleanJson);

    return NextResponse.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error("AI Parse Menu Error (DeepSeek):", error);
    
    // Minimal Groq Fallback per il parsing (opzionale ma utile)
    try {
      if (!process.env.GROQ_API_KEY) throw new Error("No GROQ");
      
      const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "system", content: "Extract JSON: {\"categories\": [{\"name\": \"\", \"items\": [{\"name\": \"\", \"description\": \"\", \"price\": \"0\", \"allergens\":[]}]}]}" }, { role: "user", content: text }],
          response_format: { type: "json_object" },
          temperature: 0.1
        })
      });
      const groqData = await groqResponse.json();
      const parsedData = JSON.parse(groqData.choices[0].message.content);
      return NextResponse.json({ success: true, data: parsedData });
    } catch (fallbackErr) {
      console.error("Groq fallback menu parse failed:", fallbackErr);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  }
}
