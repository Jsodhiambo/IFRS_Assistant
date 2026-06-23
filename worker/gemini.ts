/**
 * Minimal Gemini REST client built on native `fetch`.
 *
 * We deliberately avoid the `@google/genai` Node SDK here: it's designed for a
 * Node.js runtime and is not guaranteed to behave correctly inside the
 * Cloudflare Workers V8 isolate (no Node net/http internals). The REST API
 * itself is simple enough that a direct fetch() call is more reliable and
 * keeps the Worker bundle small.
 */

const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export interface GeminiContent {
  role: "user" | "model";
  parts: { text: string }[];
}

export interface GenerateOptions {
  apiKey: string;
  contents: GeminiContent[] | string;
  systemInstruction?: string;
  temperature?: number;
  responseMimeType?: string;
  // Uses the Gemini REST schema shape: uppercase string types
  // (e.g. "OBJECT", "STRING", "ARRAY"), not the @google/genai `Type` enum.
  responseSchema?: Record<string, unknown>;
}

/** Thrown specifically when the API key is missing/misconfigured, so callers
 * can surface a distinct "configuration problem" state to the client. */
export class GeminiConfigError extends Error {}

export async function generateContent(opts: GenerateOptions): Promise<string> {
  if (!opts.apiKey) {
    throw new GeminiConfigError(
      "GEMINI_API_KEY is not configured on this Worker. Set it with: wrangler secret put GEMINI_API_KEY",
    );
  }

  const contents: GeminiContent[] =
    typeof opts.contents === "string"
      ? [{ role: "user", parts: [{ text: opts.contents }] }]
      : opts.contents;

  const body: Record<string, unknown> = { contents };

  if (opts.systemInstruction) {
    body.systemInstruction = { parts: [{ text: opts.systemInstruction }] };
  }

  const generationConfig: Record<string, unknown> = {};
  if (opts.temperature !== undefined) generationConfig.temperature = opts.temperature;
  if (opts.responseMimeType) generationConfig.responseMimeType = opts.responseMimeType;
  if (opts.responseSchema) generationConfig.responseSchema = opts.responseSchema;
  if (Object.keys(generationConfig).length > 0) {
    body.generationConfig = generationConfig;
  }

  let res: Response;
  try {
    res = await fetch(GEMINI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": opts.apiKey,
      },
      body: JSON.stringify(body),
    });
  } catch (networkErr: any) {
    throw new Error(`Could not reach Gemini API: ${networkErr?.message || networkErr}`);
  }

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    let detail = errText;
    try {
      const parsed = JSON.parse(errText);
      detail = parsed?.error?.message || errText;
    } catch {
      // not JSON, use raw text
    }
    if (res.status === 400 && /API key not valid/i.test(detail)) {
      throw new GeminiConfigError("GEMINI_API_KEY is set but was rejected by Google as invalid.");
    }
    throw new Error(`Gemini API error (${res.status}): ${detail || res.statusText}`);
  }

  const data: any = await res.json();
  const candidate = data?.candidates?.[0];
  const parts = candidate?.content?.parts || [];
  const text = parts.map((p: any) => (typeof p.text === "string" ? p.text : "")).join("");

  if (!text && candidate?.finishReason && candidate.finishReason !== "STOP") {
    throw new Error(`Gemini did not return content (finishReason: ${candidate.finishReason}).`);
  }

  return text;
}
