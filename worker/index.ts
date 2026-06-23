import { handleHealth, handleComplianceCheck, handleAdvisorQuery } from "./handlers";

export interface Env {
  // Set via: wrangler secret put GEMINI_API_KEY (or .dev.vars for local dev)
  GEMINI_API_KEY?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Cloudflare serves any request matching a static asset (the React
    // build output) directly, without ever invoking this Worker. Since
    // /api/* paths don't correspond to any built file, and our frontend
    // calls them via fetch() (not page navigation), they always fall
    // through to here. Everything else — page loads, client-side routes —
    // is handled automatically per `not_found_handling` in wrangler.jsonc.
    try {
      if (url.pathname === "/api/health" && request.method === "GET") {
        return handleHealth(env);
      }

      if (url.pathname === "/api/compliance/check" && request.method === "POST") {
        return await handleComplianceCheck(request, env);
      }

      if (url.pathname === "/api/advisor/query" && request.method === "POST") {
        return await handleAdvisorQuery(request, env);
      }
    } catch (err: any) {
      console.error("Unhandled Worker error:", err);
      return new Response(
        JSON.stringify({ error: err?.message || "Unexpected server error.", isConfigError: false }),
        { status: 500, headers: { "Content-Type": "application/json; charset=utf-8" } },
      );
    }

    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  },
} satisfies ExportedHandler<Env>;
