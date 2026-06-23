# IFRS/IAS Compliance Assistant

A React + Vite app with an AI-powered backend (Gemini) for IFRS/IAS compliance
checking and an advisory chat, deployed as a single Cloudflare Worker (static
assets + API in one deployment).

## Architecture

- **Frontend**: React 19 + Tailwind, built with Vite, in `src/`.
- **Backend**: a native Cloudflare Worker (`worker/`) — **not** Express/Node —
  that calls the Gemini REST API directly via `fetch()`. This replaces an
  earlier Express server that could not run on the Workers V8 isolate runtime.
- **Bundling/deploy**: the [`@cloudflare/vite-plugin`](https://developers.cloudflare.com/workers/vite-plugin/)
  ties Vite's build directly to Wrangler, so one `vite build` produces both
  the client assets and the Worker bundle.

## Run locally

**Prerequisites:** Node.js, a [Gemini API key](https://aistudio.google.com/app/apikey).

1. Install dependencies:
   ```
   npm install
   ```
2. Copy `.dev.vars.example` to `.dev.vars` and add your Gemini API key:
   ```
   cp .dev.vars.example .dev.vars
   ```
3. Run the app (this runs the Worker locally too, via the Vite plugin):
   ```
   npm run dev
   ```
4. Optional: validate the production build runs correctly in the Workers
   runtime before deploying:
   ```
   npm run build
   npm run preview
   ```

## Deploy to Cloudflare Workers

1. Log in once (opens a browser to authorize):
   ```
   npx wrangler login
   ```
2. Set the production secret (do this once per environment — it is **not**
   stored in any file in this repo):
   ```
   npx wrangler secret put GEMINI_API_KEY
   ```
3. Build and deploy:
   ```
   npm run deploy
   ```

`wrangler.toml` is the input configuration; `vite build` produces an output
config snapshot pointing at the built assets, which is what `wrangler deploy`
actually uses.

## API

- `GET /api/health` — `{ status, timestamp, apiConfigured }`
- `POST /api/compliance/check` — structured IFRS/IAS compliance report (JSON)
- `POST /api/advisor/query` — conversational technical accounting advisor

All three are handled in `worker/index.ts` / `worker/handlers.ts`. Static
assets (everything else) are served directly by Cloudflare without invoking
the Worker, per the `run_worker_first = ["/api/*"]` setting in `wrangler.toml`.
