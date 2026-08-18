# AuraSine — Website

Static site (HTML + CSS + JS) with one small serverless function for the AI support chat. Built for Vercel — no build step needed.

## Files
- `index.html` — page structure (hero, products, contact, chat widget)
- `styles.css` — all styling + animations
- `script.js` — animations, product catalog, contact form, chat widget logic
- `api/chat.js` — **serverless function** that talks to Gemini on the server side, so your API key is never exposed to visitors
- `favicon.svg` — browser tab icon

## ⚠️ About the Gemini API key — read this first

Your key is **not** in any file in this project, on purpose. A static site's JS/HTML is fully visible to anyone (View Source), so a key hardcoded there gets copied and misused within hours — people scrape sites for exactly this. Instead, the key is read on the server from an **environment variable**, which stays private to your Vercel account.

**You must add the key in Vercel before the chat will work:**
1. Go to your project on vercel.com → **Settings → Environment Variables**.
2. Add a variable:
   - Name: `GEMINI_API_KEY`
   - Value: *(paste your Gemini key)*
   - Environments: check Production, Preview, and Development.
3. Save, then **redeploy** (Deployments tab → ⋯ → Redeploy) so it picks up the new variable.

**One more thing:** you pasted your key in plain text in our chat. Treat it as potentially exposed — it's quick to swap for a fresh one in [Google AI Studio](https://aistudio.google.com/apikey) before you go live, just so the only copy that ever existed is the one sitting privately in Vercel.

## Deploy to Vercel

**Option A — Vercel CLI**
1. Unzip this folder, open a terminal inside it.
2. Run:
   ```
   npm i -g vercel
   vercel
   ```
3. Follow the prompts (Enter for defaults — it auto-detects the static site + `/api` function).
4. Add `GEMINI_API_KEY` as described above, then run `vercel --prod`.

**Option B — Vercel Dashboard (drag-and-drop)**
1. vercel.com → **Add New → Project → Deploy without Git** (or drag the folder in).
2. Framework preset: **Other**. Leave Build Command / Output Directory empty.
3. Add `GEMINI_API_KEY` under Environment Variables (you can also do this before the first deploy, in the same screen).
4. Deploy.

**Option C — GitHub (best for future updates)**
1. Push this folder to a GitHub repo (the included `.gitignore` keeps any local `.env` files out of it).
2. Vercel → **Add New → Project → Import Git Repository**.
3. Add `GEMINI_API_KEY` in Environment Variables, then deploy. Every future `git push` auto-redeploys.

## Testing locally
Opening `index.html` directly in a browser won't run the chat (the `/api` function needs Vercel's server). To test locally:
```
npm i -g vercel
vercel dev
```
Create a file named `.env.local` in this folder with:
```
GEMINI_API_KEY=your_key_here
```
`vercel dev` will pick it up automatically. This file is already excluded via `.gitignore` — never commit it.

## Editing later
- **Prices**: edit `<span class="price">Price on enquiry</span>` in `script.js` (`renderProducts` function), or hardcode per-model prices there once decided.
- **Phone / WhatsApp number**: search `916376309311` across `index.html`, `script.js`, and `api/chat.js`.
- **Email**: search `yogeshdhaka311@gmail.com` in `index.html`.
- **Product range**: edit the `CATALOG` object at the top of `script.js`.
- **What the AI chatbot knows**: edit `SYSTEM_CONTEXT` at the top of `api/chat.js` — that's the only place its facts about AuraSine come from.
- **Chatbot model**: `api/chat.js` uses `gemini-flash-latest`, Google's alias that always points to their current recommended fast model, so it won't go stale.
