import { generateContent, GeminiConfigError, type GeminiContent } from "./gemini";
import type { Env } from "./index";

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

function errorResponse(error: unknown, fallback: string): Response {
  const message = error instanceof Error ? error.message : fallback;
  const isConfigError = error instanceof GeminiConfigError;
  console.error(fallback, error);
  return jsonResponse({ error: message, isConfigError }, isConfigError ? 503 : 500);
}

async function readJsonBody(request: Request): Promise<any> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export function handleHealth(env: Env): Response {
  return jsonResponse({
    status: "ok",
    timestamp: new Date().toISOString(),
    apiConfigured: !!env.GEMINI_API_KEY,
  });
}

// ---------------------------------------------------------------------------
// Compliance Check
// ---------------------------------------------------------------------------

const COMPLIANCE_SYSTEM_PROMPT = `You are an elite Accounting Compliance Officer and Senior Technical IFRS Advisory Partner.
Your objective is to inspect the accountant's description of a transaction, accounting policy, ledger figures, or financial disclosures, and perform an exhaustive compliance audit against standard IFRS and IAS regulations.

Identify specifically which standards are involved (e.g. IFRS 15 for Revenue from Contracts with Customers, IFRS 16 for Leases, IAS 2 for Inventories, IAS 36 for Impairment of Assets, etc.).
Flag compliance gaps, detail audit verification tests that should be conducted, suggest remedial journal journal entries (debits and credits), and outline disclosure requirements.

You must respond in a strict JSON format matching the schema provided. Be highly professional, rigorous, and reference exact section numbers or paragraph references of the relative IFRS/IAS standard where possible for authoritative grounding.`;

// Gemini REST schema shape: uppercase string type names (not the @google/genai `Type` enum).
const COMPLIANCE_SCHEMA = {
  type: "OBJECT",
  required: ["standardsCited", "complianceScore", "status", "summary", "findings", "disclosureChecklist", "accountingAdvice"],
  properties: {
    standardsCited: {
      type: "ARRAY",
      items: { type: "STRING" },
      description: "Array of IFRS or IAS standard codes cited, e.g. ['IFRS 15', 'IAS 36']",
    },
    complianceScore: {
      type: "INTEGER",
      description: "An overall compliance alignment score from 0 (completely non-compliant/unsupported) to 100 (fully verified compliant)",
    },
    status: {
      type: "STRING",
      description: "Can be one of: 'Fully Compliant', 'Partially Compliant', 'Non-Compliant', or 'Urgent Action Required'",
    },
    summary: {
      type: "STRING",
      description: "A professional, executive summary of the evaluation.",
    },
    findings: {
      type: "ARRAY",
      description: "Full list of specific regulatory gaps, valuation anomalies, or auditing friction points identified.",
      items: {
        type: "OBJECT",
        required: ["title", "description", "standardRef", "impact", "auditTest", "correctiveAction", "suggestedJournalEntry"],
        properties: {
          title: { type: "STRING", description: "Finding title, e.g. Missing contract modification assessment" },
          description: { type: "STRING", description: "Detailed accounting analysis of what fails to adhere to IFRS rules." },
          standardRef: { type: "STRING", description: "Specific paragraph or criteria from IFRS/IAS, e.g. IFRS 15 Paragraph 18-20" },
          impact: { type: "STRING", description: "Critical, High, Medium, or Low" },
          auditTest: { type: "STRING", description: "Verification procedure for auditors (e.g. Inspect client delivery notes, review credit-control history)" },
          correctiveAction: { type: "STRING", description: "Actionable technical remedy for the preparation team." },
          suggestedJournalEntry: { type: "STRING", description: "Exact recommended accounting entry, e.g. 'Dr Revenue $150K, Cr Deferred Revenue $150K' or 'No correction required'." },
        },
      },
    },
    disclosureChecklist: {
      type: "ARRAY",
      description: "Standard checklist of required disclosures for the matching accounting topics.",
      items: {
        type: "OBJECT",
        required: ["requirement", "isPresent", "recommendation"],
        properties: {
          requirement: { type: "STRING", description: "Required disclosure line, e.g. Significant judgments in determining lease terms" },
          isPresent: { type: "BOOLEAN", description: "Does the provided draft disclosure cover this?" },
          recommendation: { type: "STRING", description: "Guidance on how to draft or complete this disclosure text." },
        },
      },
    },
    accountingAdvice: {
      type: "STRING",
      description: "A thorough markdown treatise with authoritative professional counseling, citing source standards.",
    },
  },
} as const;

export async function handleComplianceCheck(request: Request, env: Env): Promise<Response> {
  const body = await readJsonBody(request);
  if (!body) {
    return jsonResponse({ error: "Invalid or missing JSON request body." }, 400);
  }

  const { transactionDescription, accountingPolicy, selectedStandards, accountsData, financialDisclosures } = body;

  if (!transactionDescription && !accountingPolicy) {
    return jsonResponse(
      { error: "Please provide either a transaction description or an accounting policy excerpt for analysis." },
      400,
    );
  }

  const instructions = `Analyze the following accounting treatment:
- **Transaction/Policy Description**: ${transactionDescription || "None provided"}
- **Proposed Accounting Policy**: ${accountingPolicy || "None provided"}
- **Selected Target Standard(s)**: ${Array.isArray(selectedStandards) && selectedStandards.length ? selectedStandards.join(", ") : "All applicable standard(s)"}
- **Accompanying Financial Detail/GL Balances**: ${accountsData ? JSON.stringify(accountsData) : "None provided"}
- **Draft Financial Disclosures**: ${financialDisclosures || "None provided"}

Provide the findings, compliance rating, corrective manual ledger adjustments (Dr/Cr) and step-by-step auditing validation logic.`;

  try {
    const rawText = await generateContent({
      apiKey: env.GEMINI_API_KEY || "",
      contents: instructions,
      systemInstruction: COMPLIANCE_SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: COMPLIANCE_SCHEMA as unknown as Record<string, unknown>,
    });

    let cleaned = (rawText || "{}").trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```[a-zA-Z]*\n/, "").replace(/\n```$/, "").trim();
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("Compliance check: failed to parse model JSON. Raw prefix:", cleaned.slice(0, 500));
      throw new Error("Failed to parse compliance check response as structured JSON. Please try again.");
    }

    return jsonResponse(parsed);
  } catch (error) {
    return errorResponse(error, "An unexpected error occurred during compliance analysis.");
  }
}

// ---------------------------------------------------------------------------
// Advisor Query (conversational drill-down)
// ---------------------------------------------------------------------------

interface HistoryMessage {
  role: string;
  content?: string;
}

function buildAdvisorContents(
  history: HistoryMessage[] | undefined,
  standardId: string | undefined,
  transactionContext: string | undefined,
  query: string,
): GeminiContent[] {
  let historyTurns: GeminiContent[] = (history || [])
    .map((msg) => ({
      role: msg.role === "user" ? ("user" as const) : ("model" as const),
      parts: [{ text: msg.content || "" }],
    }))
    .filter((turn) => turn.parts[0].text.trim() !== "");

  // History must start with a "user" turn.
  while (historyTurns.length > 0 && historyTurns[0].role !== "user") {
    historyTurns.shift();
  }

  // Combine consecutive same-role turns so roles strictly alternate.
  const cleanedHistory: GeminiContent[] = [];
  for (const turn of historyTurns) {
    const last = cleanedHistory[cleanedHistory.length - 1];
    if (last && last.role === turn.role) {
      last.parts[0].text += "\n" + turn.parts[0].text;
    } else {
      cleanedHistory.push({ role: turn.role, parts: [{ text: turn.parts[0].text }] });
    }
  }

  const lastUserTurn: GeminiContent = {
    role: "user",
    parts: [
      {
        text: `Context: Active standard is ${standardId || "General IFRS/IAS guidance"}. Other transaction details: ${transactionContext || "None"}. Question: ${query}`,
      },
    ],
  };

  const contents: GeminiContent[] = [];
  if (cleanedHistory.length > 0) {
    if (cleanedHistory[cleanedHistory.length - 1].role === "user") {
      // History ended on "user" — merge it into the active query so roles alternate.
      const lastHist = cleanedHistory.pop()!;
      lastUserTurn.parts[0].text = lastHist.parts[0].text + "\n" + lastUserTurn.parts[0].text;
    }
    contents.push(...cleanedHistory);
  }
  contents.push(lastUserTurn);

  return contents;
}

export async function handleAdvisorQuery(request: Request, env: Env): Promise<Response> {
  const body = await readJsonBody(request);
  if (!body) {
    return jsonResponse({ error: "Invalid or missing JSON request body." }, 400);
  }

  const { query, standardId, transactionContext, history } = body;

  if (!query) {
    return jsonResponse({ error: "Query is required" }, 400);
  }

  const systemInstruction = `You are a Senior Accounting Director and expert on IAS and IFRS standards. 
You provide concrete, technical answers to practical questions on how to structure, value, record, and disclose transactions.
If the standard is specified (e.g., standardId: '${standardId || "general"}'), tailor your context around this.
Keep your answers highly structured (using Markdown):
1. **Authoritative Citation**: Direct paragraph levels from the official standards (e.g., IAS 38.21).
2. **Practical Accounting Advice**: Clear explanations of concepts (e.g. fair value measurement steps, revaluation models, cash-generating units).
3. **Illustrative double entry journal entries**: Dr and Cr templates showing debit and credit accounts, as well as calculations.
4. **Disclosure impact**: What needs to be in the notes to the financial statements.

Be supportive, technical, and precise. Avoid casual filler.`;

  const contents = buildAdvisorContents(history, standardId, transactionContext, query);

  try {
    const rawText = await generateContent({
      apiKey: env.GEMINI_API_KEY || "",
      contents,
      systemInstruction,
      temperature: 0.2,
    });

    return jsonResponse({ text: rawText || "Could not retrieve advice." });
  } catch (error) {
    return errorResponse(error, "An unexpected error occurred on the advisor query.");
  }
}
