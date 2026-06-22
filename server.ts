import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json({ limit: "10mb" }));

const PORT = 3000;

// Lazy-loaded Gemini AI client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!genAIClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is missing. Please configure it in the Secrets manager of your AI Studio environment.");
    }
    genAIClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAIClient;
}

// Express Router for API Endpoints to handle prefix mismatches (e.g., direct local dev vs Netlify function proxy prefix-stripping)
const apiRouter = express.Router();

// Health check
apiRouter.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    apiConfigured: !!process.env.GEMINI_API_KEY,
  });
});

// Endpoint: Evaluate Accounting Compliance
apiRouter.post("/compliance/check", async (req, res) => {
  try {
    const { 
      transactionDescription, 
      accountingPolicy, 
      selectedStandards, 
      accountsData,
      financialDisclosures 
    } = req.body;

    if (!transactionDescription && !accountingPolicy) {
      return res.status(400).json({ error: "Please provide either a transaction description or an accounting policy excerpt for analysis." });
    }

    const ai = getGenAI();

    const systemPrompt = `You are an elite Accounting Compliance Officer and Senior Technical IFRS Advisory Partner.
Your objective is to inspect the accountant's description of a transaction, accounting policy, ledger figures, or financial disclosures, and perform an exhaustive compliance audit against standard IFRS and IAS regulations.

Identify specifically which standards are involved (e.g. IFRS 15 for Revenue from Contracts with Customers, IFRS 16 for Leases, IAS 2 for Inventories, IAS 36 for Impairment of Assets, etc.).
Flag compliance gaps, detail audit verification tests that should be conducted, suggest remedial journal journal entries (debits and credits), and outline disclosure requirements.

You must respond in a strict JSON format matching the schema provided. Be highly professional, rigorous, and reference exact section numbers or paragraph references of the relative IFRS/IAS standard where possible for authoritative grounding.`;

    const instructions = `Analyze the following accounting treatment:
- **Transaction/Policy Description**: ${transactionDescription || "None provided"}
- **Proposed Accounting Policy**: ${accountingPolicy || "None provided"}
- **Selected Target Standard(s)**: ${selectedStandards ? selectedStandards.join(", ") : "All applicable standard(s)"}
- **Accompanying Financial Detail/GL Balances**: ${accountsData ? JSON.stringify(accountsData) : "None provided"}
- **Draft Financial Disclosures**: ${financialDisclosures || "None provided"}

Provide the findings, compliance rating, corrective manual ledger adjustments (Dr/Cr) and step-by-step auditing validation logic.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: instructions,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["standardsCited", "complianceScore", "status", "summary", "findings", "disclosureChecklist", "accountingAdvice"],
          properties: {
            standardsCited: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Array of IFRS or IAS standard codes cited, e.g. ['IFRS 15', 'IAS 36']",
            },
            complianceScore: {
              type: Type.INTEGER,
              description: "An overall compliance alignment score from 0 (completely non-compliant/unsupported) to 100 (fully verified compliant)",
            },
            status: {
              type: Type.STRING,
              description: "Can be one of: 'Fully Compliant', 'Partially Compliant', 'Non-Compliant', or 'Urgent Action Required'",
            },
            summary: {
              type: Type.STRING,
              description: "A professional, executive summary of the evaluation.",
            },
            findings: {
              type: Type.ARRAY,
              description: "Full list of specific regulatory gaps, valuation anomalies, or auditing friction points identified.",
              items: {
                type: Type.OBJECT,
                required: ["title", "description", "standardRef", "impact", "auditTest", "correctiveAction", "suggestedJournalEntry"],
                properties: {
                  title: { type: Type.STRING, description: "Finding title, e.g. Missing contract modification assessment" },
                  description: { type: Type.STRING, description: "Detailed accounting analysis of what fails to adhere to IFRS rules." },
                  standardRef: { type: Type.STRING, description: "Specific paragraph or criteria from IFRS/IAS, e.g. IFRS 15 Paragraph 18-20" },
                  impact: { type: Type.STRING, description: "Critical, High, Medium, or Low" },
                  auditTest: { type: Type.STRING, description: "Verification procedure for auditors (e.g. Inspect client delivery notes, review credit-control history)" },
                  correctiveAction: { type: Type.STRING, description: "Actionable technical remedy for the preparation team." },
                  suggestedJournalEntry: { type: Type.STRING, description: "Exact recommended accounting entry, e.g. 'Dr Revenue $150K, Cr Deferred Revenue $150K' or 'No correction required'." }
                }
              }
            },
            disclosureChecklist: {
              type: Type.ARRAY,
              description: "Standard checklist of required disclosures for the matching accounting topics.",
              items: {
                type: Type.OBJECT,
                required: ["requirement", "isPresent", "recommendation"],
                properties: {
                  requirement: { type: Type.STRING, description: "Required disclosure line, e.g. Significant judgments in determining lease terms" },
                  isPresent: { type: Type.BOOLEAN, description: "Does the provided draft disclosure cover this?" },
                  recommendation: { type: Type.STRING, description: "Guidance on how to draft or complete this disclosure text." }
                }
              }
            },
            accountingAdvice: {
              type: Type.STRING,
              description: "A thorough markdown treatise with authoritative professional counseling, citing source standards."
            }
          }
        }
      }
    });

    const reportText = response.text || "{}";
    let parsedData;
    try {
      let cleaned = reportText.trim();
      if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```[a-zA-Z]*\n/, "").replace(/\n```$/, "").trim();
      }
      parsedData = JSON.parse(cleaned);
    } catch (parseError) {
      console.error("JSON parse failure, falling back. Raw text was:", reportText);
      throw new Error("Failed to parse compliance check response as structured JSON. Please try again.");
    }
    res.json(parsedData);

  } catch (error: any) {
    console.error("Compliance Check Error:", error);
    res.status(500).json({ 
      error: error.message || "An unexpected error occurred during database analysis.",
      isConfigError: error.message?.includes("GEMINI_API_KEY")
    });
  }
});

// Endpoint: Conversational Technical Accounting Advisor (Drill-down Clarification)
apiRouter.post("/advisor/query", async (req, res) => {
  try {
    const { query, standardId, transactionContext, history } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const ai = getGenAI();

    const systemInstruction = `You are a Senior Accounting Director and expert on IAS and IFRS standards. 
You provide concrete, technical answers to practical questions on how to structure, value, record, and disclose transactions.
If the standard is specified (e.g., standardId: '${standardId || "general"}'), tailor your context around this.
Keep your answers highly structured (using Markdown):
1. **Authoritative Citation**: Direct paragraph levels from the official standards (e.g., IAS 38.21).
2. **Practical Accounting Advice**: Clear explanations of concepts (e.g. fair value measurement steps, revaluation models, cash-generating units).
3. **Illustrative double entry journal entries**: Dr and Cr templates showing debit and credit accounts, as well as calculations.
4. **Disclosure impact**: What needs to be in the notes to the financial statements.

Be supportive, technical, and precise. Avoid casual filler.`;

    // Process chat history if present
    const formattedHistory = (history || []).map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    }));

    const contents = [
      ...formattedHistory,
      {
        role: "user",
        parts: [{ text: `Context: Active standard is ${standardId || "General IFRS/IAS guidance"}. Other transaction details: ${transactionContext || "None"}. Question: ${query}` }]
      }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.2, // lower temperature for factual accounting precision
      }
    });

    res.json({ text: response.text || "Could not retrieve advice." });

  } catch (error: any) {
    console.error("Advisor Query Error:", error);
    res.status(500).json({ 
      error: error.message || "An unexpected error occurred on the advisor query.",
      isConfigError: error.message?.includes("GEMINI_API_KEY")
    });
  }
});

// Mount the prefix-tolerant Router under both standard API path and root path
app.use("/api", apiRouter);
app.use(apiRouter);

// Setup Vite Dev server / production serving
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    console.info("Bootstrapping development server with Vite middleware...");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.info("Bootstrapping production build serving...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`IFRS/IAS Compliance Server running at http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL && !process.env.NETLIFY && !process.env.LAMBDA) {
  bootstrap();
}

export default app;
