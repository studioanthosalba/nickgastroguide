require("dotenv").config({ path: ".env.local" });
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testGroq() {
  const groqKey = process.env.GROQ_API_KEY;
  console.log("Using key:", groqKey);
  
  try {
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${groqKey}`,
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: "Test" },
          { role: "user", content: "Hello" }
        ]
      })
    });

    console.log("Status:", groqResponse.status);
    const data = await groqResponse.json();
    console.log("Data:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error:", err);
  }
}

testGroq();
