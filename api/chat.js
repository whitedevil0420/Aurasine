// /api/chat.js
// Vercel Serverless Function — proxies chat messages to the Gemini API.
// The Gemini key is read from process.env.GEMINI_API_KEY (set in Vercel
// dashboard -> Project -> Settings -> Environment Variables). It is never
// sent to, or visible from, the browser.

const MODEL = "gemini-flash-latest"; // Google's rolling alias for the current recommended Flash model
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const SYSTEM_CONTEXT = `
You are the customer support assistant embedded on the AuraSine website (aurasine.com).
AuraSine manufactures lithium-ion, pure sine wave inverters/batteries for home and business power backup.

FACTS YOU CAN SHARE (do not invent anything beyond this):
- Technology: Lithium-ion battery cells + pure sine wave output (same clean waveform as grid electricity, unlike cheaper "modified square wave" inverters).
- Why it matters: pure sine wave is safe for motors, medical equipment, chargers and other sensitive electronics; modified square wave can make them run hot, noisy, or wear out faster.
- Lithium-ion vs old lead-acid: charges in 2-3 hours (vs 8-10 hours), lasts 8-10 years (vs 3-5 years), usable depth of discharge up to 90% (vs ~50%), about a third of the weight, sealed and maintenance-free (no water top-up).
- Product range (these are the ONLY configurations currently manufactured — do not suggest others):
  • 100 Ah — available in 12V
  • 200 Ah — available in 12V and 24V
  • 500 Ah — available in 12V, 24V and 48V
- Warranty: 5 years standard on the battery, rated for 3000+ charge cycles.
- Pricing: not published on the site — always tell the user pricing is shared on enquiry / WhatsApp, and never guess a number.
- Contact: WhatsApp / phone +91 63763 09311, email yogeshdhaka311@gmail.com.

HOW TO BEHAVE:
- Answer only questions related to AuraSine, its products, inverter/battery technology, warranty, or how to buy/become a dealer. For anything unrelated (general knowledge, coding, other brands, etc.), politely say you can only help with AuraSine-related questions.
- If the user wants to place an order, needs an exact price/quote, wants installation, has a warranty/service issue, or asks to speak to a person — tell them to tap the WhatsApp button in this chat window to continue with our team.
- Keep answers short and clear (2-4 sentences), suitable for a small chat bubble on mobile.
- Reply in the same language/style the user writes in — Hindi, Hinglish, or English.
- Never invent specifications, prices, addresses, or warranty terms beyond what's listed above.
`.trim();

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error:
        "Server is missing GEMINI_API_KEY. Add it in Vercel → Project → Settings → Environment Variables, then redeploy.",
    });
    return;
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  const message = (body && body.message ? String(body.message) : "").slice(0, 800);
  const history = Array.isArray(body && body.history) ? body.history : [];

  if (!message.trim()) {
    res.status(400).json({ error: "Missing message" });
    return;
  }

  // Build the conversation for Gemini: system context, then last 8 turns, then the new message.
  const contents = [
    { role: "user", parts: [{ text: SYSTEM_CONTEXT }] },
    {
      role: "model",
      parts: [{ text: "Understood — I'll answer only as the AuraSine support assistant, based on those facts." }],
    },
    ...history.slice(-8).map((turn) => ({
      role: turn && turn.role === "assistant" ? "model" : "user",
      parts: [{ text: String((turn && turn.text) || "").slice(0, 800) }],
    })),
    { role: "user", parts: [{ text: message }] },
  ];

  try {
    const geminiRes = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents,
        generationConfig: { temperature: 0.4, maxOutputTokens: 350 },
      }),
    });

    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      console.error("Gemini API error:", data);
      res.status(502).json({ error: "AI service is temporarily unavailable. Please try WhatsApp instead." });
      return;
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("").trim() ||
      "Sorry, I couldn't generate a reply just now. Please try WhatsApp instead.";

    res.status(200).json({ reply });
  } catch (err) {
    console.error("Chat function error:", err);
    res.status(500).json({ error: "Something went wrong. Please try WhatsApp instead." });
  }
};
