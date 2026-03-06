import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    
    const apiKey = "AIzaSyBfNppeNwkIaEa1ZFlatqgmJnRUs3-pehE"; 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

    const systemPrompt = `
      Context: You are "Ahmar Luxe AI", the elite concierge for AHMAR LUXE.
      Personality: Sophisticated, elite, and professional.
      
      Our Inventory:
      - Premium Laptops (Elite Pro Edition #3, Master Workstations)
      - Luxury Mobiles (Elite Edition #25, Diamond Series)
      - High-end Watches (Royal Gold, Limited Editions)
      
      Rules:
      1. Always start or end with a luxury welcome.
      2. For pricing/buying, NEVER use brackets [] or (). 
      3. ALWAYS provide the link exactly like this:
         "For exclusive pricing, contact our VIP Concierge: https://wa.me/923456187264"
      4. Keep the text clean and premium.
    `;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `${systemPrompt}\n\nCustomer Message: ${prompt}` }]
        }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ text: `Google Response: ${data.error?.message || "Check Key"}` });
    }

    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      let aiText = data.candidates[0].content.parts[0].text;
      
      // Is line se brackets hat jayenge agar AI ne galti se laga diye hon
      aiText = aiText.replace(/[\[\]\(\)]/g, ""); 
      
      // Link ke sath green dot lagana
      aiText = aiText.replace("https://wa.me/923456187264", "🟢 CLICK TO WHATSAPP: https://wa.me/923456187264");
      
      return NextResponse.json({ text: aiText });
    } else {
      return NextResponse.json({ text: "Our luxury servers are being polished. Please try again." });
    }

  } catch (error: any) {
    return NextResponse.json({ text: "Connection Error: " + error.message }, { status: 500 });
  }
}