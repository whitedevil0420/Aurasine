# AuraSine — Website

Static site (HTML + CSS + JS) with one small serverless function for the AI support chat. Built for Vercel — no build step needed.

## Files
- `index.html` — page structure (hero, products, contact, chat widget) + SEO meta tags & structured data
- `styles.css` — all styling + animations
- `script.js` — animations, product catalog, contact form, chat widget logic
- `api/chat.js` — **serverless function** that talks to Gemini on the server side, so your API key is never exposed to visitors
- `favicon.svg` — browser tab icon
- `robots.txt` — tells search engines & AI crawlers what they can read
- `sitemap.xml` — page map for search engine submission
- `llms.txt` — plain-text summary of the site for AI assistants

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

## SEO — what's done, what you need to do, and an honest expectation

**What's already in the code:**
- Proper `<title>` and meta description with real keywords (LiFePO4, pure sine wave, inverter capacities).
- Open Graph + Twitter Card tags, so links look good when shared on WhatsApp/social.
- **Structured data (JSON-LD)**: an `Organization` schema with your contact details, and an `FAQPage` schema answering common questions (chemistry, capacities, Bluetooth, warranty, pricing). This is what helps Google show rich results, and helps AI search tools (ChatGPT, Perplexity, Gemini, etc.) pull accurate facts about AuraSine when someone asks about you.
- `robots.txt` — explicitly allows Google, Bing, and known AI crawlers (GPTBot, Google-Extended, PerplexityBot, ClaudeBot, etc.) to read your site.
- `sitemap.xml` — the map search engines use to find your page(s).
- `llms.txt` — a plain-text summary of AuraSine for AI systems. This is a new, informal convention (not every AI reads it yet), but it's free to include.

**You need to do 3 things after deploying:**
1. **Set your real domain.** Every file above has `YOUR-DOMAIN-HERE.vercel.app` as a placeholder (in `index.html`'s `<head>`, `sitemap.xml`, and `robots.txt`). Find-and-replace it with your actual live URL once you know it — these tags don't work correctly with a placeholder.
2. **Submit to Google Search Console** (free, ~5 minutes): go to [search.google.com/search-console](https://search.google.com/search-console), add your domain, verify ownership (Google gives you a meta tag — paste it into the commented line near the top of `index.html`'s `<head>`), then submit `sitemap.xml` under Sitemaps. Do the same on [Bing Webmaster Tools](https://www.bing.com/webmasters) — it also feeds Bing's AI ("Copilot") search.
3. **Create a free Google Business Profile** ([business.google.com](https://business.google.com)) with your phone number and service area. For a business like this, local searches ("inverter dealer near me", "LiFePO4 battery [your city]") often matter more than generic Google ranking, and this is what makes you show up on Google Maps too.

**The honest part:** none of this — not from me, not from any SEO agency — guarantees a #1 ranking. Google's ranking depends on things outside the code too: how old and trusted your domain is, how many other sites link to yours, customer reviews, and how often the site is updated with real content. What this setup *does* guarantee is that your site is technically correct and fully readable by every search engine and AI crawler — nothing is hidden or broken. Ranking well after that is an ongoing process (reviews, backlinks, maybe a blog/updates page later), not a one-time fix.

## Editing later
- **Prices**: edit the `<span class="price">Price on enquiry</span>` line inside `batteryCard()` / `inverterCard()` in `script.js`, or hardcode per-model prices there once decided.
- **Phone / WhatsApp number**: search `916376309311` across `index.html`, `script.js`, and `api/chat.js`.
- **Email**: search `yogeshdhaka311@gmail.com` in `index.html`.
- **Battery range**: edit the `CATALOG` object near the top of `script.js`.
- **Inverter range (VA ratings)**: edit the `INVERTERS` array right below `CATALOG` in `script.js`.
- **What the AI chatbot knows**: edit `SYSTEM_CONTEXT` at the top of `api/chat.js` — that's the only place its facts about AuraSine come from. (The actual Gemini API call, headers, and key handling below it should not need to change.)
- **Chatbot model**: `api/chat.js` uses `gemini-flash-latest`, Google's alias that always points to their current recommended fast model, so it won't go stale.

## Notes on this update
- Battery chemistry corrected to **LiFePO4** (Lithium Iron Phosphate) throughout the site and the chatbot's facts.
- Added a **Complete Inverters** product line (1500VA / 2500VA / 5000VA) with Bluetooth app monitoring, alongside the existing battery-only packs.
- Site restyled to a **light theme** across all sections (hero, technology, contact) — dark ink is now used only as an accent (buttons, nav pill, footer, chat header).
- Scroll animations are slower and slightly 3D (`rotateX` tilt) for a smoother "pop-in" feel.
- The intro/preloader now stays visible for a minimum ~2 seconds so its animated logo draw is actually seen, instead of flashing past on a fast connection.
