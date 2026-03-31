import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text, restaurantId } = await req.json();
    
    // Recovery: Use local env or provided key
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Sei un esperto di gastronomia italiana e data scientist.
      Analizza questo testo di un menù di un ristorante e strutturalo in un formato JSON pulito.
      Ritorna SOLO il JSON con questa struttura:
      {
        "categories": [
          {
            "name": "Nome Categoria (es. Antipasti, Primi)",
            "items": [
              {
                "name": "Nome Piatto",
                "description": "Descrizione/Ingredienti",
                "price": "Prezzo (solo numero)",
                "allergens": ["Allergeni"]
              }
            ]
          }
        ]
      }
      Testo del menù:
      ${text}
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean up generic AI markdown if present
    const cleanJson = responseText.replace(/```json|```/g, "").trim();
    const parsedData = JSON.parse(cleanJson);

    return NextResponse.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error("AI Parse Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
