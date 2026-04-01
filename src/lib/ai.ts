import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Inizializzazione Client
const deepseekClient = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY || "", 
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// 2. Helper per individuare la modalità
export const isTouristQuery = (text: string) => {
  return /(visitare|vedere|fare|museo|musei|monumento|chiesa|piazza|storia|turismo|città|eventi|raggiungere|tour|attrazioni|itinerario|dove si trova|cosa c'è|passeggiata|dintorni|mostre|programma|stasera|oggi|domani)/i.test(text.toLowerCase());
};

// 3. Funzioni di chiamata AI
export async function callGemini(messages: any[], useGrounding: boolean) {
  try {
    const modelName = "gemini-1.5-flash"; // Estrema velocità + Grounding
    const modelOptions: any = { model: modelName };
    
    if (useGrounding) {
      modelOptions.tools = [{ googleSearch: {} }];
    }
    
    const systemMessage = messages.find(m => m.role === 'system')?.content || "";
    const chatHistory = messages.filter(m => m.role !== 'system');
    
    const model = genAI.getGenerativeModel({
      ...modelOptions,
      systemInstruction: {
        role: "system",
        parts: [{ text: systemMessage }]
      }
    });

    const geminiHistory = chatHistory.slice(0, -1).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));
    
    const lastMsg = chatHistory[chatHistory.length - 1].content;
    const chat = model.startChat({ 
      history: geminiHistory,
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      }
    });

    const result = await chat.sendMessage(lastMsg);
    const response = result.response;
    return response.text();
  } catch (err) {
    console.error("Gemini Error:", err);
    throw err;
  }
}

export async function callDeepSeek(messages: any[], modelName: string, temperature = 0.7) {
  try {
    const apiPayload: any = {
      messages,
      model: modelName,
    };
    if (modelName !== 'deepseek-reasoner') {
      apiPayload.temperature = temperature;
    }

    const completion = await deepseekClient.chat.completions.create(apiPayload);
    return completion.choices[0].message.content;
  } catch (err) {
    console.error("DeepSeek Error:", err);
    throw err;
  }
}

export async function callGroq(messages: any[]) {
  try {
    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey) throw new Error("GROQ_API_KEY missing");

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${groqKey}`,
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages,
        temperature: 0.6
      })
    });

    if (!response.ok) throw new Error(`Groq HTTP Error: ${response.status}`);
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (err) {
    console.error("Groq Error:", err);
    throw err;
  }
}
