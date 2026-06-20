import React, { useState, useEffect } from "react";
import { 
  FileText, 
  BookOpen, 
  MessageSquare, 
  HelpCircle, 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  ArrowRight, 
  ChevronRight, 
  Database, 
  RotateCcw, 
  Info, 
  Layers, 
  Check, 
  Copy, 
  Download, 
  ExternalLink,
  ChevronDown,
  Plus,
  Trash2,
  Lock,
  Compass,
  AlertCircle,
  Briefcase
} from "lucide-react";
import { accountingStandardsList, AccountingStandard, SourceParagraph, CaseStudy, JournalEntry } from "./data/standards";

// Types for client-state evaluation
interface LedgerRow {
  account: string;
  debit: number;
  credit: number;
}

interface ComplianceReport {
  standardsCited: string[];
  complianceScore: number; // 0 to 100
  status: string; // Fully Compliant, Partially Compliant, etc.
  summary: string;
  findings: Array<{
    title: string;
    description: string;
    standardRef: string;
    impact: "Critical" | "High" | "Medium" | "Low";
    auditTest: string;
    correctiveAction: string;
    suggestedJournalEntry: string;
  }>;
  disclosureChecklist: Array<{
    requirement: string;
    isPresent: boolean;
    recommendation: string;
  }>;
  accountingAdvice: string;
}

// Preset Client Case Templates to ease exploration and instant live checks
const sampleTemplates = [
  {
    name: "Apex Custom Software Package (IFRS 15)",
    standardId: "IFRS-15",
    description: "Apex Tech sold a customized enterprise accounting software product for a package price of $500,000. Under the contract, Apex provides: (1) A software license key, (2) highly complex custom database integration modifying underlying structures, and (3) 2 years of security updates. The company wishes to recognize the entire $500,000 immediately upon delivery of the license key.",
    policy: "Customer contract revenue is recognized in full upon delivery of the digital license keys, as customization labor is provided free of charge for goodwill, and automated updates run independently over the next 24 months without human intervention.",
    ledger: [
      { account: "Trade Receivables", debit: 500000, credit: 0 },
      { account: "License Contract Revenue (P&L)", debit: 0, credit: 500000 }
    ],
    disclosures: "We recognize software revenue upon key transfer. Direct customization services are recorded under client goodwill and are not billed. Maintenance and security update costs are expensed as operational overhead."
  },
  {
    name: "Globex Lease & Rent-Free Holiday (IFRS 16)",
    standardId: "IFRS-16",
    description: "Globex Corp signed a 5-year lease of corporate office premises on Jan 1, 2026. Annual lease payments are $100,000, payable in arrears. However, the landlord granted a 1-year rent holiday (Year 1 pay is $0, Years 2-5 are $100,000). Legal fees of $15,000 were paid. Incremental borrowing rate is 6%. Due to $0 payment in Year 1, Globex has recorded zero lease assets or liabilities.",
    policy: "Leases with rent-free initial holiday periods are treated on a cash-payments basis. No lease liabilities are recognized during free-rent intervals, and subsequent outlays are charged straight-line over active years.",
    ledger: [
      { account: "Rent Expense (Operational)", debit: 0, credit: 0 },
      { account: "Cash (Legal Capitalized Fees)", debit: 15000, credit: 0 }
    ],
    disclosures: "The company rents commercial office premises under a 5-year lease. Because Year 1 is completely free of charge, no rent expenses or right-of-use asset balances are acknowledged on the balance sheet at December 31, 2026."
  },
  {
    name: "Vanguard Mining Division CGU Write-Down (IAS 36)",
    standardId: "IAS-36",
    description: "Vanguard Mining gold mine sites represents a single CGU block carrying: Goodwill ($120,000), Factory Infrastructure ($300,000), Mining Equipment ($180,000), and Land Rights ($200,000). Lower commodity prices trigger impairment checking. Recoverable value of CGU is evaluated at $550,000. (The land rights cannot be sold individually below $190,000). The CFO records all CGU assets at original cost without adjustments.",
    policy: "Global assets are evaluated for impairment only if there is a severe drop in the regional property tax rating. Since physical mine sites remain operational, carrying balances are sustained historical cost.",
    ledger: [
      { account: "Mine Division Goodwill Asset", debit: 120000, credit: 0 },
      { account: "Factory Infrastructure Building", debit: 300000, credit: 0 },
      { account: "Mining Heavy Machinery", debit: 180000, credit: 0 },
      { account: "Land Rights & Clearances", debit: 200000, credit: 0 }
    ],
    disclosures: "Our annual goodwill impairment review shows that the mining división CGU recoverable amount is $550,000 against carrying book of $800,000. No impairment write-down is recorded as operations remain profitable long-term."
  },
  {
    name: "Solomon Agri Grains Stockpile (IAS 2)",
    standardId: "IAS-2",
    description: "Solomon Agri has a stockpile of premium organic grains bought for $150,000 + $12,000 transport. General storage rent and heating monitoring was $5,000. Stockpile market price dropped to $140,000, and selling transport costs would be $8,000 with statutory sales commissions of $6,000. No adjustment has been recorded.",
    policy: "Agricultural inventories are measured at historical cost of acquisition, including storage and ongoing warehouse climate control metrics, plus physical transport outlays.",
    ledger: [
      { account: "Organic Grains Inventory (Acquisition)", debit: 167000, credit: 0 }
    ],
    disclosures: "Organic grain reserves are stated at historical purchase cost of $167,000, including all storage and handling expenses incurred on-site to preserve inventory texture."
  },
  {
    name: "Apex Global Statement Presentation (IFRS 18 Transition)",
    standardId: "IFRS-18",
    description: "Apex Global presented its draft performance statements by aggregating operating costs with investment dividend returns ($15,000) and interest outlays ($30,000) under a single list. No distinct 'Operating Profit' subtotal has been presented in the draft income statement.",
    policy: "We present all corporation income and expense transactions in a single aggregated list under IAS 1 rules, without classifying items into operating, investing, or financing subdivisions.",
    ledger: [
      { account: "General Operating Revenues", debit: 0, credit: 1000000 },
      { account: "Bundled Operating and Financing Expenses", debit: 755000, credit: 0 },
      { account: "Investment and Dividend Inflow Accounts", debit: 0, credit: 15000 }
    ],
    disclosures: "All investment gains, administrative costs, and financing interest expenses are reported in aggregate within the principal operations notes."
  },
  {
    name: "Solas Energies Research Controls (Conceptual Framework)",
    standardId: "Conceptual-Framework",
    description: "Solas Energies incurred $200,000 in deep exploratory geological seismic studies. Although the municipal government holds outright land deeds, Solas holds a 5-year exclusive commercial licence to sell, use, or lease the derived data blocks. Solas wants to assess if they conceptually control an 'Asset' under revised 2018 criteria.",
    policy: "We only capitalize physical exploration expenditures when direct property ownership or physical territorial deeds are legally registered in our name.",
    ledger: [
      { account: "Exploration & Seismic File Expenditures (P&L)", debit: 200000, credit: 0 },
      { account: "Cash", debit: 0, credit: 200000 }
    ],
    disclosures: "Historical research telemetry charges of $200,000 are expensed immediately within current-period profit or loss, as Solas does not hold legal deed titles to the physical municipal land sectors under study."
  },
  {
    name: "Global Logistics Customer Insolvency (IAS 10)",
    standardId: "IAS-10",
    description: "During early 2026, before accounts authorization, one of Global Logistics' primary regional cargo clients declared insolvency due to sustained dry spells in late 2025. Logistics carried an unpaid trade debt of $150,000 on 31 December 2025. The CFO wants to know if this requires a balance sheet adjustment or just a note disclosure.",
    policy: "Customer liquidations occurring after the reporting period are treated as non-adjusting events. Receivables are maintained at face value, with disclosures added to next period's statements.",
    ledger: [
      { account: "Trade Receivables Balance", debit: 150000, credit: 0 },
      { account: "Impairment Loss on Debtors (P&L)", debit: 0, credit: 0 }
    ],
    disclosures: "Subsequent to year-end, a regional client declared bankruptcy on 15 February 2026. Trade debtors at 31 December 2008 / 2025 continue to be carried at full recovery value as the legal insolvency occurred after the reporting period."
  },
  {
    name: "Global Logistics Land Appraisal (IFRS 13)",
    standardId: "IFRS-13",
    description: "Global Logistics possesses a tract of development land. There are no active transactions for identical tracts. Valuers use a discounted cash flow income model based on projected developer leases which requires several unobservable assumptions. The carrying value has been written up without explaining the unobservable inputs or placing the asset in the Level 3 fair value hierarchy.",
    policy: "All physical properties held for capital growth are revalued using current development projections. Inputs used in revaluations are bundled into the general property disclosures.",
    ledger: [
      { account: "Development Land Property (FVM)", debit: 50000, credit: 0 },
      { account: "Fair Value Gains on Property (P&L)", debit: 0, credit: 50000 }
    ],
    disclosures: "Our vacant land parcels are valued at $50,000 above cost based on specialized developer models using localized parameters and current capital discount frameworks."
  }
];

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<"compliance" | "library" | "advisory">("compliance");
  
  // Search query for the global library
  const [searchQuery, setSearchQuery] = useState("");
  
  // Responsive viewport / device simulation modes for marketing demo
  const [viewportMode, setViewportMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  
  // Active standard loaded in Right-Hand Drilldown sidebar
  const [activeDrilldownStandard, setActiveDrilldownStandard] = useState<AccountingStandard>(accountingStandardsList[0]);
  const [drilldownRef, setDrilldownRef] = useState<{ type: "paragraph" | "case" | "general"; id: string }>({
    type: "general",
    id: "overview"
  });

  // Client Evaluation Form state
  const [selectedStandardIds, setSelectedStandardIds] = useState<string[]>(["IFRS-15"]);
  const [transactionDesc, setTransactionDesc] = useState(
    "Apex Tech sold a customized enterprise accounting software product for a package price of $500,000. Under the contract, Apex provides: (1) A software license key, (2) highly complex custom database integration modifying underlying structures, and (3) 2 years of security updates. The company wishes to recognize the entire $500,000 immediately upon delivery of the license key."
  );
  const [accountingPolicy, setAccountingPolicy] = useState(
    "Customer contract revenue is recognized in full upon delivery of the digital license keys, as customization labor is provided free of charge for goodwill, and automated updates run independently over the next 24 months without human intervention."
  );
  const [draftDisclosures, setDraftDisclosures] = useState(
    "We recognize software revenue upon key transfer. Direct customization services are recorded under client goodwill and are not billed. Maintenance and security update costs are expensed as operational overhead."
  );

  // General Ledger input table modeling
  const [ledgerRows, setLedgerRows] = useState<LedgerRow[]>([
    { account: "Trade Receivables", debit: 500000, credit: 0 },
    { account: "License Contract Revenue (P&L)", debit: 0, credit: 500000 }
  ]);

  // UI States
  const [isCheckingCompliance, setIsCheckingCompliance] = useState(false);
  const [complianceReport, setComplianceReport] = useState<ComplianceReport | null>(null);
  const [complianceError, setComplianceError] = useState<string | null>(null);

  // Advisory assistant chat states
  const [chats, setChats] = useState<Array<{ role: "user" | "ai"; content: string }>>([
    { 
      role: "ai", 
      content: `Hello! I am your **IFRS & IAS Technical Director**. 

I can assist with:
- Authoritative interpretation lookup with direct paragraphs.
- Drafting appropriate double-entry re-adjustments and corrective journals.
- Clarifying complex interactions (e.g. IAS 12 and IAS 16 interactions).

How can I guide your accounting preparation or audit files today?` 
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isSendingChat, setIsSendingChat] = useState(false);

  // Copy-state confirmation helpers
  const [copiedTextId, setCopiedTextId] = useState<string | null>(null);

  // Trigger quick selection copy feedback
  const triggerCopyFeedback = (text: string, labelId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTextId(labelId);
    setTimeout(() => setCopiedTextId(null), 2000);
  };

  // Pre-fill fields when clicking a case study or preset template
  const loadPresetTemplate = (tpl: typeof sampleTemplates[0]) => {
    setTransactionDesc(tpl.description);
    setAccountingPolicy(tpl.policy);
    setDraftDisclosures(tpl.disclosures);
    setLedgerRows(tpl.ledger);
    setSelectedStandardIds([tpl.standardId]);
    
    // Auto find matching standard and load it as right sidebar focus
    const matched = accountingStandardsList.find(s => s.id === tpl.standardId);
    if (matched) {
      setActiveDrilldownStandard(matched);
      setDrilldownRef({ type: "general", id: "overview" });
    }
  };

  // Perform full regulatory check via server proxy
  const handleCheckCompliance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionDesc.trim()) {
      alert("Please provide some transaction description or entries to verify.");
      return;
    }

    setIsCheckingCompliance(true);
    setComplianceError(null);
    setComplianceReport(null);

    try {
      const selectedCodes = selectedStandardIds.map(
        id => accountingStandardsList.find(s => s.id === id)?.code || id
      );

      const response = await fetch("/api/compliance/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionDescription: transactionDesc,
          accountingPolicy: accountingPolicy,
          selectedStandards: selectedCodes,
          accountsData: ledgerRows,
          financialDisclosures: draftDisclosures
        }),
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || "Compliance API failure.");
      }

      const reportData: ComplianceReport = await response.json();
      setComplianceReport(reportData);

      // Scroll reference view into the primary loaded standard code if possible
      if (reportData.standardsCited && reportData.standardsCited.length > 0) {
        const primaryCode = reportData.standardsCited[0];
        const matched = accountingStandardsList.find(
          s => s.code.toLowerCase().replace(" ", "") === primaryCode.toLowerCase().replace(" ", "")
        );
        if (matched) {
          setActiveDrilldownStandard(matched);
        }
      }

    } catch (err: any) {
      console.error(err);
      setComplianceError(err.message || "Failed to contact compliance engine router.");
    } finally {
      setIsCheckingCompliance(false);
    }
  };

  // General Ledger row additions/removals
  const handleAddLedgerRow = () => {
    setLedgerRows([...ledgerRows, { account: "", debit: 0, credit: 0 }]);
  };

  const handleUpdateLedgerRow = (idx: number, field: keyof LedgerRow, val: string | number) => {
    const updated = [...ledgerRows];
    if (field === "account") {
      updated[idx].account = val as string;
    } else {
      updated[idx][field] = Number(val) || 0;
    }
    setLedgerRows(updated);
  };

  const handleRemoveLedgerRow = (idx: number) => {
    setLedgerRows(ledgerRows.filter((_, i) => i !== idx));
  };

  const ledgerDebitsSum = ledgerRows.reduce((a, b) => a + b.debit, 0);
  const ledgerCreditsSum = ledgerRows.reduce((a, b) => a + b.credit, 0);

  // Conversational Technical advisory submissions
  const handleSendQuery = async (predefinedQuery?: string) => {
    const queryToSend = predefinedQuery || chatInput;
    if (!queryToSend.trim()) return;

    const userMessageText = queryToSend;
    setChats(prev => [...prev, { role: "user", content: userMessageText }]);
    
    if (!predefinedQuery) {
      setChatInput("");
    }
    
    setIsSendingChat(true);

    try {
      const response = await fetch("/api/advisor/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: userMessageText,
          standardId: activeDrilldownStandard.code,
          transactionContext: transactionDesc,
          history: chats.slice(-6).map(c => ({
            role: c.role === "user" ? "user" : "model",
            content: c.content
          }))
        })
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || "Advisory agent failed query.");
      }

      const resJson = await response.json();
      setChats(prev => [...prev, { role: "ai", content: resJson.text }]);

    } catch (err: any) {
      console.error(err);
      setChats(prev => [
        ...prev, 
        { 
          role: "ai", 
          content: `⚠️ **Advisory Agent Error**: ${err.message || "An unexpected network disconnect occurred. Please double check that GEMINI_API_KEY is configured."}` 
        }
      ]);
    } finally {
      setIsSendingChat(false);
    }
  };

  // Standard citations quick lookup search filter
  const filteredStandards = accountingStandardsList.filter(std => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      std.code.toLowerCase().includes(q) ||
      std.title.toLowerCase().includes(q) ||
      std.summary.toLowerCase().includes(q) ||
      std.keyConcepts.some(c => c.toLowerCase().includes(q))
    );
  });

  return (
    <div className={`w-screen h-screen bg-[#060D15] text-[#2D3436] font-sans flex flex-col text-sm ${viewportMode === "desktop" ? "overflow-hidden" : "overflow-y-auto"}`} id="viewport_main_outer">
      
      {/* SaaS Marketing & Device Simulation Banner */}
      <div className="bg-[#0C1E36] text-white border-b border-[#C5A880]/30 px-4 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 shrink-0 text-xs select-none" id="viewport_simulator_banner">
        <div className="flex items-center gap-2" id="sim_left">
          <span className="bg-[#C5A880]/10 text-[#F5C77C] border border-[#C5A880]/40 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider">
            Premium SaaS
          </span>
          <span className="font-semibold text-gray-200 text-[11px] font-sans">
            IFRS Brief SaaS Workspace &mdash; Try responsive viewports & active subscription demo:
          </span>
        </div>
        
        <div className="flex flex-wrap items-center gap-4" id="sim_right">
          {/* Viewport simulation buttons */}
          <div className="flex items-center gap-1 bg-[#121F2F] p-0.5 rounded border border-slate-700" id="device_selector_tabs">
            <button
              id="dev_set_desktop"
              type="button"
              onClick={() => {
                setViewportMode("desktop");
                setLeftSidebarOpen(true);
                setRightSidebarOpen(true);
              }}
              className={`px-3 py-1 rounded text-[10px] uppercase font-bold tracking-wider transition-all ${
                viewportMode === "desktop"
                  ? "bg-[#C5A880] text-[#0B192C]"
                  : "text-gray-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              💻 Desktop Fluid
            </button>
            <button
              id="dev_set_tablet"
              type="button"
              onClick={() => {
                setViewportMode("tablet");
                setLeftSidebarOpen(false); // Collapsed for spacious layout demo
                setRightSidebarOpen(false);
              }}
              className={`px-3 py-1 rounded text-[10px] uppercase font-bold tracking-wider transition-all ${
                viewportMode === "tablet"
                  ? "bg-[#C5A880] text-[#0B192C]"
                  : "text-gray-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              📟 Tablet Shell
            </button>
            <button
              id="dev_set_mobile"
              type="button"
              onClick={() => {
                setViewportMode("mobile");
                setLeftSidebarOpen(false); // Collapsed for compact layout demo
                setRightSidebarOpen(false);
              }}
              className={`px-3 py-1 rounded text-[10px] uppercase font-bold tracking-wider transition-all ${
                viewportMode === "mobile"
                  ? "bg-[#C5A880] text-[#0B192C]"
                  : "text-gray-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              📱 Mobile Shell
            </button>
          </div>

          <div className="flex items-center gap-2" id="monetization_rates">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">Suggested Price:</span>
            <span className="bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-bold font-mono">
              $29 / mo
            </span>
            <span className="text-gray-400">or</span>
            <span className="bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-bold font-mono">
              $290 / yr
            </span>
          </div>
        </div>
      </div>

      {/* Main Container Core Box with Simulated Device Frames */}
      <div 
        className={`flex-1 flex overflow-hidden transition-all duration-300 ${
          viewportMode === "desktop"
            ? "w-full h-full animate-fade-in"
            : viewportMode === "tablet"
              ? "max-w-[768px] max-h-[1024px] w-[768px] h-[1024px] rounded-3xl border-[12px] border-slate-700 shadow-2xl mx-auto my-6 shrink-0 bg-white scale-[0.80] origin-top relative animate-fade-in"
              : "max-w-[390px] max-h-[844px] w-[390px] h-[844px] rounded-[36px] border-[12px] border-slate-800 shadow-2xl mx-auto my-6 shrink-0 bg-white scale-[0.90] origin-top relative animate-fade-in"
        }`} 
        id="main_app_wrapper"
      >
        
        {/* iOS physical Dynamic Island overlay emulation */}
        {viewportMode === "mobile" && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-center pointer-events-none" id="sim_dynamic_island">
            <div className="w-1.5 h-1.5 bg-slate-900 rounded-full mr-2"></div>
            <div className="w-10 h-1 bg-slate-950/50 rounded"></div>
          </div>
        )}

        {/* Outer Frame with Full Fluid Width and Height */}
        <div className="flex-1 flex flex-col overflow-hidden w-full h-full bg-[#F1F3F5] text-[#2D3436]" id="main_app_inner_canvas">
          
          {/* Top Header Navigation Panel */}
          <nav className="h-14 bg-white border-b border-[#DCDDE1] flex items-center justify-between px-4 shrink-0 transition-all" id="header_navbar">
            <div className="flex items-center gap-3 animate-fade-in" id="nav_brand_group">
              
              {/* Left sidebar toggle button integrated seamlessly */}
              <button
                id="lhs_sidebar_toggle_btn"
                type="button"
                onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
                className={`p-1.5 rounded border transition-colors flex items-center justify-center shrink-0 ${
                  leftSidebarOpen
                    ? "bg-slate-100 border-[#DCDDE1] text-[#0B192C]"
                    : "bg-white border-gray-200 text-gray-400 hover:text-gray-600"
                }`}
                title={leftSidebarOpen ? "Hide Left Sidebar" : "Show Left Sidebar"}
              >
                <Database className="w-3.5 h-3.5 text-[#C5A880]" />
              </button>

              <div className="flex items-center gap-2" id="brand_main">
                {/* Premium Gold/Navy Compass Emblem Logo */}
                <div className="w-8 h-8 bg-gradient-to-br from-[#0B192C] to-[#1E3E62] flex items-center justify-center rounded-lg shadow border border-[#F5C77C]/40 relative shrink-0" id="brand_graphic_box">
                  <div className="absolute inset-0.5 border border-[#F5C77C]/20 rounded-md"></div>
                  <Compass className="w-4 h-4 text-[#F5C77C] relative z-10" id="logo_emblem_graphic" />
                </div>
                
                <div className="flex flex-col justify-center select-none animate-fade-in" id="brand_title_wrapper">
                  <span className="font-sans font-black tracking-tight text-[12px] bg-gradient-to-r from-[#0B192C] via-[#1E3E62] to-[#B89047] bg-clip-text text-transparent leading-none flex items-center gap-1.5" id="brand_header_title">
                    IFRS Brief
                    <span className="text-[7px] font-sans font-bold bg-[#F5C77C]/20 text-[#B89047] border border-[#F5C77C]/30 px-1 py-0.5 rounded tracking-wide leading-none uppercase select-none">PRO</span>
                  </span>
                  <span className="text-[9px] text-[#7F8C8D] font-semibold leading-none tracking-wider uppercase mt-0.5 hidden sm:flex items-center gap-1 animate-fade-in" id="brand_guide_subtitle">
                    For Professional Accountants
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-0.5 text-[11px] font-semibold" id="nav_tabs_group">
                <button
                  id="tab_btn_compliance"
                  onClick={() => setActiveTab("compliance")}
                  className={`px-2 h-14 flex items-center gap-1 border-b-2 transition-colors ${
                    activeTab === "compliance"
                      ? "text-[#0B192C] border-[#0B192C] font-bold"
                      : "text-[#7F8C8D] border-transparent hover:text-[#0B192C]"
                  }`}
                >
                  <Layers className="w-3" />
                  <span className="hidden md:inline">Compliance Hub</span>
                  <span className="md:hidden">Hub</span>
                </button>
                <button
                  id="tab_btn_library"
                  onClick={() => setActiveTab("library")}
                  className={`px-2 h-14 flex items-center gap-1 border-b-2 transition-colors ${
                    activeTab === "library"
                      ? "text-[#0B192C] border-[#0B192C] font-bold"
                      : "text-[#7F8C8D] border-transparent hover:text-[#0B192C]"
                  }`}
                >
                  <BookOpen className="w-3" />
                  <span className="hidden md:inline">Standards Citations</span>
                  <span className="md:hidden">Citations</span>
                </button>
                <button
                  id="tab_btn_advisory"
                  onClick={() => setActiveTab("advisory")}
                  className={`px-2 h-14 flex items-center gap-1 border-b-2 transition-colors ${
                    activeTab === "advisory"
                      ? "text-[#0B192C] border-[#0B192C] font-bold"
                      : "text-[#7F8C8D] border-transparent hover:text-[#0B192C]"
                  }`}
                >
                  <MessageSquare className="w-3" />
                  <span className="hidden md:inline">Interactive Advisor</span>
                  <span className="md:hidden">Advisor</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 animate-fade-in" id="header_controls">
              <div className="relative" id="header_search_box">
                <Search className="w-3 h-3 absolute left-2.5 top-2.5 text-[#7F8C8D]" />
                <input
                  id="search_standards_input"
                  type="text"
                  placeholder="Search standards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#F1F3F5] border border-[#DCDDE1] rounded pl-7 pr-3 py-1 text-xs w-24 sm:w-32 focus:w-40 transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#0B192C]"
                />
                {searchQuery && (
                  <button 
                    id="search_clear_btn"
                    onClick={() => setSearchQuery("")} 
                    className="absolute right-2 top-1.5 hover:bg-gray-200 p-0.5 rounded"
                  >
                    <X className="w-2.5 h-2.5 text-[#7F8C8D]" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-1 bg-gray-100 py-1 px-2 rounded text-[10px] border border-[#DCDDE1] font-mono shrink-0 select-none" id="engagement_token">
                <span className="w-1 h-1 rounded-full bg-[#B89047] animate-ping"></span>
                <span className="font-semibold text-[#0B192C] hidden sm:inline">Global Logistics PLC</span>
              </div>
              
              {/* Right sidebar toggle button integrated seamlessly */}
              <button
                id="rhs_sidebar_toggle_btn"
                type="button"
                onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
                className={`p-1.5 rounded border transition-colors flex items-center justify-center shrink-0 ${
                  rightSidebarOpen
                    ? "bg-slate-100 border-[#DCDDE1] text-[#0B192C]"
                    : "bg-white border-gray-200 text-gray-400 hover:text-gray-600"
                }`}
                title={rightSidebarOpen ? "Hide Direct Core Citations Sidebar" : "Show Direct Core Citations Sidebar"}
              >
                <Compass className="w-3.5 h-3.5 text-[#C5A880]" />
              </button>
            </div>
          </nav>

      {/* Main Container Layer */}
      <div className="flex-1 flex overflow-hidden" id="workspace_split_view">
        
        {/* LEFT COLUMN: Standard Database Selector Nav sidebar */}
        <aside className={`bg-white border-r border-[#DCDDE1] flex flex-col shrink-0 overflow-y-auto transition-all duration-300 ${
          leftSidebarOpen ? "w-64 animate-fade-in" : "w-0 overflow-hidden border-r-0"
        }`} id="left_standards_aside">
          
          {/* Quick preset triggers wrapper */}
          <div className="p-4 border-b border-[#DCDDE1]" id="cases_preset_sidebar_box">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#7F8C8D] uppercase tracking-widest mb-2" id="client_files_heading">
              <span className="flex items-center gap-1"><Briefcase className="w-3 h-3 text-[#C5A880]" /> Client Pre-fills</span>
              <span className="text-[9px] lowercase font-normal bg-gray-100 text-gray-500 py-0.5 px-1.5 rounded">Quick Test</span>
            </div>
            <div className="space-y-1" id="presets_list">
              {sampleTemplates.map((tpl, i) => (
                <button
                  key={i}
                  id={`preset_tpl_btn_${i}`}
                  onClick={() => loadPresetTemplate(tpl)}
                  className="w-full text-left p-2 hover:bg-[#F1F3F5] rounded transition-all text-xs border border-transparent hover:border-[#DCDDE1]"
                >
                  <div className="font-bold text-[#0B192C] truncate">{tpl.name}</div>
                  <p className="text-[10px] text-[#7F8C8D] line-clamp-1">{tpl.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Core IFRS/IAS Standard nodes */}
          <div className="p-3 select-none flex-1" id="standards_checklist_sidebar_box">
            <h3 className="px-1 text-[10px] font-bold text-[#7F8C8D] uppercase tracking-widest mb-3 flex items-center justify-between" id="standards_index_heading">
              <span>IFRS & IAS Database</span>
              <span className="text-[9px] font-normal font-mono text-[#0B192C]/70">{filteredStandards.length} Standards</span>
            </h3>

            <div className="space-y-1" id="left_standards_item_list">
              {filteredStandards.map((std) => {
                const isActive = activeDrilldownStandard.id === std.id;
                return (
                  <div
                    key={std.id}
                    id={`lhs_std_node_${std.id}`}
                    className={`p-2.5 rounded cursor-pointer transition-all border ${
                      isActive 
                        ? "bg-[#0B192C]/5 border-[#C5A880]/40 shadow-xs border-l-4 border-l-[#C5A880]" 
                        : "hover:bg-gray-50 border-transparent"
                    }`}
                    onClick={() => {
                      setActiveDrilldownStandard(std);
                      setDrilldownRef({ type: "general", id: "overview" });
                    }}
                  >
                    <div className="flex items-center justify-between" id={`std_tag_${std.id}`}>
                      <span className="font-mono font-bold text-[#0B192C] text-xs">{std.code}</span>
                      <span className="text-[9px] text-[#7F8C8D]">{std.effectiveDate.split(" ").slice(-1)[0]}</span>
                    </div>
                    <div className="text-[11px] font-semibold text-[#0B192C] line-clamp-1 mt-0.5" id={`std_title_${std.id}`}>
                      {std.title}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* MIDDLE COLUMN: Interface content changed by activeTab state */}
        <div className="flex-1 bg-[#F8F9FA] overflow-y-auto p-5" id="center_workplace_panel">
          
          {/* TAB 1: Real-time Compliance checking interface */}
          {activeTab === "compliance" && (
            <div className="space-y-5" id="tab_view_compliance_hub">
              
              {/* Context Summary Header */}
              <div className="bg-white p-5 rounded border border-[#DCDDE1] shadow-xs flex justify-between items-center" id="hub_meta_top_panel">
                <div id="compliance_hub_header_titles">
                  <span className="text-[10px] uppercase font-bold text-[#7F8C8D] tracking-widest">Workspace</span>
                  <h1 className="text-xl font-light text-[#0B192C]">Accounting Trial & Compliance Audit</h1>
                  <p className="text-xs text-[#7F8C8D] mt-0.5">
                    Evaluate double entry records, accounting policy definitions, and drafting notes under active IFRS criteria.
                  </p>
                </div>
                {/* Visual score dial or placeholder */}
                {complianceReport ? (
                  <div className="flex items-center gap-3.5" id="final_dial_badge">
                    <div className="relative flex items-center justify-center" id="svg_gauge_container">
                      <svg className="w-14 h-14 rotate-[-90deg]">
                        <circle cx="28" cy="28" r="24" className="stroke-gray-100 fill-none" strokeWidth="4" />
                        <circle 
                          cx="28" 
                          cy="28" 
                          r="24" 
                          className="stroke-emerald-500 fill-none transition-all duration-1000" 
                          strokeWidth="4" 
                          strokeDasharray={150.7}
                          strokeDashoffset={150.7 - (150.7 * Math.min(100, Math.max(0, complianceReport.complianceScore))) / 100}
                        />
                      </svg>
                      <span className="absolute text-xs font-mono font-black text-[#0B192C]">
                        {complianceReport.complianceScore}%
                      </span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#2D3436]" id="report_metric_badge_status">{complianceReport.status}</div>
                      <span className="text-[9px] text-gray-400 capitalize">Audit Compliance Index</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-gray-50 border border-dashed border-[#DCDDE1] px-4 py-3 rounded text-[#7F8C8D]" id="untested_placeholder">
                    <Database className="w-4 h-4 text-gray-400" />
                    <span className="text-xs">No active checking run</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5" id="hub_workframe_grid">
                
                {/* LHS FORMS (Span 7) */}
                <form onSubmit={handleCheckCompliance} className="col-span-1 lg:col-span-7 space-y-4" id="compliance_inputs_form">
                  
                  {/* Standard Association Multi-check list */}
                  <div className="bg-white p-4 rounded border border-[#DCDDE1]" id="standard_selection_box">
                    <label className="block text-xs font-bold text-[#7F8C8D] uppercase tracking-wider mb-2">
                      Target Audit Reference standard(s):
                    </label>
                    <div className="flex flex-wrap gap-2" id="targets_checkbox_grid">
                      {accountingStandardsList.map((std) => {
                        const isSelect = selectedStandardIds.includes(std.id);
                        return (
                          <button
                            key={std.id}
                            type="button"
                            id={`multi_select_std_${std.id}`}
                            onClick={() => {
                              if (isSelect) {
                                // Keep at least one standard active
                                if (selectedStandardIds.length > 1) {
                                  setSelectedStandardIds(selectedStandardIds.filter(id => id !== std.id));
                                }
                              } else {
                                setSelectedStandardIds([...selectedStandardIds, std.id]);
                              }
                            }}
                            className={`px-3 py-1.5 rounded font-mono text-xs font-bold border transition-all ${
                              isSelect 
                                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                : "bg-white text-gray-600 hover:bg-gray-50 border-gray-200"
                            }`}
                          >
                            {std.code}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Transaction Description Core input */}
                  <div className="bg-white p-4 rounded border border-[#DCDDE1] space-y-1.5" id="transaction_desc_panel">
                    <div className="flex justify-between items-center" id="lbl_row_1">
                      <label htmlFor="transaction_desc_area" className="text-xs font-bold text-[#7F8C8D] uppercase tracking-wider">
                        1. Transaction Scenario Detail
                      </label>
                      <span className="text-[10px] text-gray-400">Include valuation calculations or contract boundaries</span>
                    </div>
                    <textarea
                      id="transaction_desc_area"
                      rows={5}
                      className="w-full text-xs font-sans p-3 bg-gray-50 border border-[#DCDDE1] rounded focus:outline-none focus:ring-1 focus:ring-[#2F3640] focus:bg-white"
                      placeholder="e.g. Globex Corp entered into a lease for office premises on 1 January..."
                      value={transactionDesc}
                      onChange={(e) => setTransactionDesc(e.target.value)}
                    />
                  </div>

                  {/* Accounting Policy Statement */}
                  <div className="bg-white p-4 rounded border border-[#DCDDE1] space-y-1.5" id="accounting_policy_panel">
                    <div className="flex justify-between items-center" id="lbl_row_2">
                      <label htmlFor="accounting_policy_area" className="text-xs font-bold text-[#7F8C8D] uppercase tracking-wider">
                        2. Intended Accounting Treatment & Policies
                      </label>
                      <span className="text-[10px] text-gray-400 font-mono text-gray-300">Paragraph level policies</span>
                    </div>
                    <textarea
                      id="accounting_policy_area"
                      rows={3}
                      className="w-full text-xs font-sans p-3 bg-gray-50 border border-[#DCDDE1] rounded focus:outline-none focus:ring-1 focus:ring-[#2F3640] focus:bg-white"
                      placeholder="Define the client policy text used to process this transaction, or leave description..."
                      value={accountingPolicy}
                      onChange={(e) => setAccountingPolicy(e.target.value)}
                    />
                  </div>

                  {/* Trial Balance / Journal Entry Grid */}
                  <div className="bg-white p-4 rounded border border-[#DCDDE1]" id="ledger_row_entries_block">
                    <div className="flex justify-between items-center mb-2" id="lbl_row_3">
                      <label className="text-xs font-bold text-[#7F8C8D] uppercase tracking-wider">
                        3. Pre-Adjusted General Ledger Accounts
                      </label>
                      <button
                        type="button"
                        id="add_ledger_row_btn"
                        onClick={handleAddLedgerRow}
                        className="flex items-center gap-1 text-[10px] bg-gray-100 hover:bg-gray-200 text-[#2F3640] px-2 py-1 rounded border border-[#DCDDE1] font-semibold"
                      >
                        <Plus className="w-3 h-3" /> Add Account Segment
                      </button>
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1" id="ledger_table">
                      <div className="grid grid-cols-12 gap-2 text-[10px] uppercase font-bold text-[#7F8C8D] tracking-wider sticky top-0 bg-white py-1 z-10" id="tb_table_header">
                        <div className="col-span-6">Account Ledger Line</div>
                        <div className="col-span-3">Debit ($)</div>
                        <div className="col-span-2">Credit ($)</div>
                        <div className="col-span-1 text-center">Rem</div>
                      </div>

                      {ledgerRows.map((row, idx) => (
                        <div key={idx} className="grid grid-cols-12 gap-2 items-center" id={`tb_row_${idx}`}>
                          <div className="col-span-6">
                            <input
                              id={`tb_row_account_input_${idx}`}
                              type="text"
                              value={row.account}
                              onChange={(e) => handleUpdateLedgerRow(idx, "account", e.target.value)}
                              placeholder="e.g. Deferred Contract Liability"
                              className="w-full p-1.5 text-xs bg-gray-50 border border-[#DCDDE1] rounded focus:bg-white text-[#2F3640]"
                            />
                          </div>
                          <div className="col-span-3">
                            <input
                              id={`tb_row_debit_input_${idx}`}
                              type="number"
                              value={row.debit || ""}
                              onChange={(e) => handleUpdateLedgerRow(idx, "debit", e.target.value)}
                              placeholder="0"
                              className="w-full p-1.5 text-xs font-mono bg-gray-50 border border-[#DCDDE1] rounded text-right focus:bg-white text-emerald-700"
                            />
                          </div>
                          <div className="col-span-2">
                            <input
                              id={`tb_row_credit_input_${idx}`}
                              type="number"
                              value={row.credit || ""}
                              onChange={(e) => handleUpdateLedgerRow(idx, "credit", e.target.value)}
                              placeholder="0"
                              className="w-full p-1.5 text-xs font-mono bg-gray-50 border border-[#DCDDE1] rounded text-right focus:bg-white text-amber-700"
                            />
                          </div>
                          <div className="col-span-1 text-center">
                            <button
                              id={`tb_row_remove_btn_${idx}`}
                              type="button"
                              onClick={() => handleRemoveLedgerRow(idx)}
                              className="text-red-500 hover:bg-red-50 p-1.5 rounded transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {ledgerRows.length === 0 && (
                        <div className="text-center py-4 text-xs text-gray-400 border border-dashed border-gray-200 rounded" id="no_ledger_caption">
                          No active balances entered. Use Add Account Segment above to model trial entries.
                        </div>
                      )}

                      {/* Totals Summary Row */}
                      {ledgerRows.length > 0 && (
                        <div className="grid grid-cols-12 gap-2 pt-2 border-t border-[#DCDDE1] text-xs font-mono font-bold text-[#2D3436]" id="ledger_totals_bar">
                          <div className="col-span-6 text-right uppercase text-[10px] text-[#7F8C8D]">Total Ledger Trial balance:</div>
                          <div className="col-span-3 text-right text-emerald-700 font-bold">${ledgerDebitsSum.toLocaleString()}</div>
                          <div className="col-span-2 text-right text-amber-700 font-bold">${ledgerCreditsSum.toLocaleString()}</div>
                          <div className="col-span-1 text-center">
                            {ledgerDebitsSum === ledgerCreditsSum ? (
                              <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1 rounded border border-emerald-200">BALANCED</span>
                            ) : (
                              <span className="text-[9px] text-amber-600 bg-amber-50 px-1 rounded border border-amber-200">OUT: ${(Math.abs(ledgerDebitsSum - ledgerCreditsSum)).toLocaleString()}</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Financial Disclosures Textbox */}
                  <div className="bg-white p-4 rounded border border-[#DCDDE1] space-y-1.5" id="disclosures_draft_panel">
                    <div className="flex justify-between items-center" id="lbl_row_4">
                      <label htmlFor="disclosures_draft_area" className="text-xs font-bold text-[#7F8C8D] uppercase tracking-wider">
                        4. Draft Notes Disclosures text
                      </label>
                      <span className="text-[10px] text-gray-400 text-gray-300">Will evaluate against checklist requirements</span>
                    </div>
                    <textarea
                      id="disclosures_draft_area"
                      rows={3}
                      className="w-full text-xs font-sans p-3 bg-gray-50 border border-[#DCDDE1] rounded focus:outline-none focus:ring-1 focus:ring-[#2F3640] focus:bg-white"
                      placeholder="Paste drafted notes disclosure statements for disclosure inspection..."
                      value={draftDisclosures}
                      onChange={(e) => setDraftDisclosures(e.target.value)}
                    />
                  </div>

                  {/* Action verification triggers */}
                  <div className="flex gap-3" id="hub_submit_buttons_wrapper">
                    <button
                      type="submit"
                      id="verify_compliance_submit_btn"
                      disabled={isCheckingCompliance}
                      className="flex-1 bg-[#2F3640] text-white py-3 rounded text-xs font-bold uppercase tracking-widest hover:bg-[#34495e] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isCheckingCompliance ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                          Auditing compliance via Gemini Expert...
                        </>
                      ) : (
                        <>
                          Run Compliance Verification Check
                        </>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      id="reset_hub_fields_btn"
                      onClick={() => {
                        setTransactionDesc("");
                        setAccountingPolicy("");
                        setDraftDisclosures("");
                        setLedgerRows([]);
                        setComplianceReport(null);
                        setComplianceError(null);
                      }}
                      className="px-4 bg-white border border-[#DCDDE1] hover:bg-gray-100 rounded text-gray-600 transition-all flex items-center justify-center"
                      title="Clear Inputs"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                </form>

                {/* AUDIT OUTPUT DISPLAY PANEL (Span 5) */}
                <div className="col-span-1 lg:col-span-5 space-y-4" id="compliance_report_results_column">
                  
                  {isCheckingCompliance && (
                    <div className="bg-white p-6 rounded border border-[#DCDDE1] flex flex-col items-center justify-center text-center space-y-4 h-[550px]" id="audit_checking_screen">
                      <div className="w-10 h-10 border-4 border-dashed border-[#2F3640] border-t-transparent rounded-full animate-spin" id="spin_auditor"></div>
                      <div className="space-y-1" id="spin_captions">
                        <h4 className="font-bold text-gray-700">Verifying Regulatory Alignment</h4>
                        <p className="text-xs text-[#7F8C8D] max-w-xs">
                          Evaluating transaction clauses point-by-point under selected citation guidelines.
                        </p>
                      </div>
                      <div className="w-full text-left bg-gray-50 border p-3 rounded text-[11px] font-mono text-gray-500 overflow-hidden text-ellipsis line-clamp-3" id="curr_checking_hint">
                        Target Standard context: {selectedStandardIds.join(", ")}
                      </div>
                    </div>
                  )}

                  {complianceError && (
                    <div className="bg-red-50 border border-red-200 p-5 rounded space-y-2 text-[#2D3436]" id="error-screen-box">
                      <div className="flex items-center gap-2 text-red-700 font-bold" id="err_hdr">
                        <AlertTriangle className="w-4 h-4" />
                        Audit Evaluation Incomplete
                      </div>
                      <p className="text-xs text-red-600 leading-relaxed" id="err_p">
                        {complianceError}
                      </p>
                      <p className="text-[10px] text-gray-500 bg-white/50 p-2 rounded" id="err_suggestion">
                        Please confirm your Gemini API Key configuration is saved in the Secrets panel, or verify input complexity.
                      </p>
                    </div>
                  )}

                  {!complianceReport && !isCheckingCompliance && !complianceError && (
                    <div className="bg-white p-6 rounded border border-[#DCDDE1] flex flex-col items-center justify-center text-center space-y-3 h-[550px]" id="hub_empty_prompt_screen">
                      <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center border border-[#DCDDE1]" id="empty_icon_box">
                        <Layers className="w-5 h-5 text-gray-400" />
                      </div>
                      <div id="empty_prompt_titles">
                        <h4 className="font-bold text-[#2F3640]">Awaiting Compliance Assessment</h4>
                        <p className="text-xs text-[#7F8C8D] max-w-xs mt-1">
                          Select one of the 4 client pre-fills on the left list, or fill manual transaction entries and submit to trigger a real-time Gemini compliance audit.
                        </p>
                      </div>
                    </div>
                  )}

                  {complianceReport && !isCheckingCompliance && (
                    <div className="space-y-4" id="loaded_compliance_report_scoller">
                      
                      {/* Executive Summary Card */}
                      <div className="bg-white p-4 rounded border border-[#DCDDE1] shadow-xs" id="summary_card_wrap">
                        <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100" id="sym_hdr">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Executive Summary</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            complianceReport.status.includes("Fully") 
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200" 
                              : "bg-amber-50 text-amber-800 border border-amber-200"
                          }`}>
                            {complianceReport.status}
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed text-gray-600" id="summary_txt">
                          {complianceReport.summary}
                        </p>
                        <div className="mt-3 flex items-center gap-1.5 flex-wrap" id="standards_row_wrap">
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Citations Coded:</span>
                          {complianceReport.standardsCited.map((cite, i) => (
                            <span 
                              key={i} 
                              onClick={() => {
                                // Match this code to active standards directory
                                const matched = accountingStandardsList.find(s => s.code.replace(" ", "").toLowerCase() === cite.replace(" ", "").toLowerCase());
                                if (matched) {
                                  setActiveDrilldownStandard(matched);
                                  setDrilldownRef({ type: "general", id: "overview" });
                                }
                              }}
                              className="font-mono text-[10px] font-bold bg-[#F1F3F5] text-[#2F3640] px-1.5 py-0.5 rounded cursor-pointer hover:bg-[#2F3640] hover:text-white transition-colors"
                              title="Click to drill into source"
                            >
                              {cite}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Accordion Findings list */}
                      <div className="space-y-2.5" id="report_findings_module">
                        <div className="flex items-center justify-between text-[11px] font-bold text-[#7F8C8D] uppercase tracking-wider px-1">
                          <span>Specific Audit Findings ({complianceReport.findings.length})</span>
                          <span className="text-[10px] font-mono text-gray-400">Compliance score impact</span>
                        </div>

                        {complianceReport.findings.map((f, i) => (
                          <div 
                            key={i} 
                            className={`p-3.5 rounded border bg-white shadow-xs transition-all hover:translate-x-0.5`}
                            id={`finding_card_${i}`}
                          >
                            <div className="flex items-start justify-between gap-2" id={`finding_hdr_${i}`}>
                              <div>
                                <span className="font-mono text-[9px] font-black uppercase text-amber-600 bg-amber-50 px-1 py-0.5 rounded" id={`ref_stamp_${i}`}>
                                  {f.standardRef}
                                </span>
                                <h5 className="font-bold text-[#2F3640] text-xs mt-1" id={`finding_title_${i}`}>
                                  {f.title}
                                </h5>
                              </div>
                              <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                f.impact === "Critical" || f.impact === "High"
                                  ? "bg-red-50 text-red-800 border border-red-100"
                                  : "bg-yellow-50 text-yellow-800 border border-yellow-100"
                              }`} id={`finding_impact_badge_${i}`}>
                                {f.impact}
                              </span>
                            </div>

                            <p className="text-xs text-gray-600 leading-relaxed mt-2" id={`finding_desc_${i}`}>
                              {f.description}
                            </p>

                            {/* Corrective Journal Entry snippet */}
                            {f.suggestedJournalEntry && f.suggestedJournalEntry !== "No correction required" && (
                              <div className="mt-2.5 bg-gray-50 border border-gray-200 p-2.5 rounded" id={`journal_box_${i}`}>
                                <div className="text-[9px] font-bold text-[#7F8C8D] uppercase tracking-widest flex justify-between items-center mb-1">
                                  <span>Recommended Journal Re-Entry</span>
                                  <button 
                                    type="button" 
                                    id={`copy_journal_btn_${i}`}
                                    onClick={() => triggerCopyFeedback(f.suggestedJournalEntry, `re_${i}`)} 
                                    className="hover:text-[#2F3640] transition-colors"
                                  >
                                    {copiedTextId === `re_${i}` ? "Copied!" : <Copy className="w-3 h-3" />}
                                  </button>
                                </div>
                                <div className="font-mono text-[10px] text-gray-700 leading-tight whitespace-pre-line" id={`journal_ent_${i}`}>
                                  {f.suggestedJournalEntry}
                                </div>
                              </div>
                            )}

                            {/* Audit verification advice */}
                            <div className="mt-2.5 border-t border-gray-150 pt-2 space-y-1 text-xs" id={`verification_box_${i}`}>
                              <span className="block text-[10px] font-bold uppercase text-gray-400">Auditor Testing Verification steps:</span>
                              <p className="text-gray-600 leading-relaxed italic" id={`verification_txt_${i}`}>
                                {f.auditTest}
                              </p>
                            </div>

                            <div className="mt-2 text-xs flex justify-end gap-2" id={`correction_action_trigger_box_${i}`}>
                              <button
                                type="button" 
                                id={`drill_finding_btn_${i}`}
                                onClick={() => {
                                  // Locate specific standard based on title
                                  const citeCode = f.standardRef.split(" ")[0] + " " + f.standardRef.split(" ")[1];
                                  const matched = accountingStandardsList.find(s => s.code.toLowerCase().includes(citeCode.toLowerCase()));
                                  if (matched) {
                                    setActiveDrilldownStandard(matched);
                                    // See if matching paragraph holds it
                                    const matchPara = matched.sourceParagraphs.find(p => p.citation.toLowerCase().includes(f.standardRef.toLowerCase()));
                                    setDrilldownRef({
                                      type: matchPara ? "paragraph" : "general",
                                      id: matchPara ? matchPara.id : "overview"
                                    });
                                  }
                                }}
                                className="text-[#2F3640] hover:underline flex items-center gap-0.5 font-bold text-[10px] uppercase tracking-wider"
                              >
                                Drill into source standard <ArrowRight className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Disclosure Checklist validation */}
                      <div className="bg-white p-4 rounded border border-[#DCDDE1]" id="disclosure_checklist_block">
                        <div className="border-b border-gray-100 pb-2 mb-3 flex items-center justify-between" id="disc_hdr">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Required Disclosures Compliance</span>
                          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">IFRS / IAS Notes list</span>
                        </div>
                        <div className="space-y-3" id="checklist_list_container">
                          {complianceReport.disclosureChecklist.map((item, idx) => (
                            <div key={idx} className="text-xs space-y-1.5 border-b border-gray-50 pb-2 last:border-none" id={`ch_item_${idx}`}>
                              <div className="flex items-start justify-between gap-2" id={`ch_item_hd_${idx}`}>
                                <span className="font-semibold text-gray-700 leading-relaxed" id={`ch_item_req_${idx}`}>{item.requirement}</span>
                                <span className={`shrink-0 flex items-center gap-1 text-[9px] font-bold uppercase px-1 rounded ${
                                  item.isPresent 
                                    ? "bg-emerald-50 text-emerald-800" 
                                    : "bg-red-50 text-red-800"
                                }`} id={`ch_item_status_${idx}`}>
                                  {item.isPresent ? <Check className="w-2.5 h-2.5" /> : "Absent"}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#7F8C8D] leading-relaxed italic" id={`ch_item_rec_${idx}`}>
                                Recommendation: {item.recommendation}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Copiable complete formal summary advisory transcript */}
                      <div className="bg-[#2F3640] text-gray-200 p-4 rounded border border-gray-700" id="raw_advice_box">
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-700" id="raw_hdr">
                          <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">IFRS Technical Advisory Notes</span>
                          <button
                            type="button"
                            id="copy_formal_advice_btn"
                            onClick={() => triggerCopyFeedback(complianceReport.accountingAdvice, "raw_adv")}
                            className="text-xs hover:text-white flex items-center gap-1 font-semibold"
                          >
                            {copiedTextId === "raw_adv" ? "Copied Report!" : <><Copy className="w-3.5 h-3.5" /> Copy Notes</>}
                          </button>
                        </div>
                        <div className="text-xs leading-relaxed max-h-60 overflow-y-auto font-sans prose prose-sm prose-invert whitespace-pre-wrap text-slate-300" id="formatted_advice_area">
                          {complianceReport.accountingAdvice}
                        </div>
                      </div>

                    </div>
                  )}

                </div>

              </div>

            </div>
          )}

          {/* TAB 2: Dynamic IFRS/IAS citations database browser */}
          {activeTab === "library" && (
            <div className="space-y-5" id="tab_view_library">
              
              <div className="bg-white p-5 rounded border border-[#DCDDE1] flex justify-between items-start" id="lib_search_results_top">
                <div id="lib_title_panel">
                  <span className="text-[10px] uppercase font-bold text-[#7F8C8D] tracking-widest">Digital Registry</span>
                  <h1 className="text-xl font-light text-[#2F3640]">{activeDrilldownStandard.code} — {activeDrilldownStandard.title}</h1>
                  <p className="text-xs text-[#7F8C8D] mt-1 max-w-xl">
                    Effective starting {activeDrilldownStandard.effectiveDate}. {activeDrilldownStandard.summary}
                  </p>
                </div>
                <div className="bg-gray-100 px-3 py-1.5 rounded font-mono text-xs font-bold border" id="lib_active_code_pill">
                  {activeDrilldownStandard.code}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5" id="lib_split_layout">
                
                {/* Firm Handbook study card corresponding to detailed handbook publication specifications */}
                {(activeDrilldownStandard.detailedOverview || activeDrilldownStandard.specificProvisions) && (
                  <div className="col-span-12 bg-white p-5 rounded border border-[#DCDDE1] space-y-4" id="lib_handbook_card">
                    <div className="flex justify-between items-center border-b pb-2.5">
                      <h3 className="text-xs font-bold text-[#0B192C] flex items-center gap-1.5 uppercase tracking-wide">
                        <BookOpen className="w-4 h-4 text-[#B89047]" /> IFRS Handbook Detailed Analysis
                      </h3>
                      <span className="text-[9px] bg-[#B89047]/10 text-[#B89047] uppercase font-bold border border-[#B89047]/20 px-2 py-0.5 rounded tracking-widest leading-none select-none">
                        IFRS Brief
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                      <div className="col-span-1 lg:col-span-7 space-y-4">
                        {activeDrilldownStandard.detailedOverview && (
                          <div className="space-y-1">
                            <h4 className="text-[10px] font-bold text-[#1E3E62] uppercase tracking-wide">Detailed Overview</h4>
                            <p className="text-xs text-gray-600 leading-relaxed bg-[#F8F9FA] p-3 rounded border border-gray-100 italic">
                              "{activeDrilldownStandard.detailedOverview}"
                            </p>
                          </div>
                        )}

                        {activeDrilldownStandard.specificProvisions && activeDrilldownStandard.specificProvisions.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-[10px] font-bold text-[#1E3E62] uppercase tracking-wide">Specific Provisions & Requirements</h4>
                            <div className="space-y-2.5">
                              {activeDrilldownStandard.specificProvisions.map((prov, idx) => (
                                <div key={idx} className="border-l-2 border-[#B89047] pl-3 py-0.5">
                                  <h5 className="text-[11px] font-bold text-gray-800">{prov.title}</h5>
                                  <p className="text-[11px] text-gray-600 mt-0.5 leading-normal">{prov.requirements}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="col-span-1 lg:col-span-5 space-y-4 bg-gray-50 p-4 rounded border border-gray-200">
                        {activeDrilldownStandard.interpretationsText && (
                          <div className="space-y-1">
                            <h4 className="text-[9px] font-bold text-[#7F8C8D] uppercase tracking-widest flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-[#B89047] rounded-sm"></span> IFRIC / SIC Interpretations
                            </h4>
                            <p className="text-xs text-gray-700 leading-relaxed font-serif">{activeDrilldownStandard.interpretationsText}</p>
                          </div>
                        )}
                        
                        {activeDrilldownStandard.changesEffectiveThisYear && (
                          <div className="space-y-1 pt-2 border-t border-gray-200">
                            <h4 className="text-[9px] font-bold text-[#7F8C8D] uppercase tracking-widest flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-green-600 rounded-sm"></span> Changes Effective This Year
                            </h4>
                            <p className="text-[11px] text-gray-700 leading-relaxed font-sans">{activeDrilldownStandard.changesEffectiveThisYear}</p>
                          </div>
                        )}

                        {activeDrilldownStandard.pendingChanges && (
                          <div className="space-y-1 pt-2 border-t border-gray-200">
                            <h4 className="text-[9px] font-bold text-[#7F8C8D] uppercase tracking-widest flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-blue-600 rounded-sm"></span> Pending Future Amendments
                            </h4>
                            <p className="text-[11px] text-gray-700 leading-relaxed font-sans">{activeDrilldownStandard.pendingChanges}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Authoritative Cites block (Paragraphs checklist) */}
                <div className="col-span-1 lg:col-span-6 space-y-4" id="lib_core_paragraphs">
                  <div className="bg-white p-4 rounded border border-[#DCDDE1]" id="lib_paragraphs_card">
                    <h3 className="text-xs font-bold text-[#7F8C8D] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5" /> Direct Authoritative Source Paragraphs
                    </h3>
                    
                    <div className="space-y-3" id="paragraphs_listing_box">
                      {activeDrilldownStandard.sourceParagraphs.map((para) => (
                        <div 
                          key={para.id} 
                          onClick={() => {
                            setDrilldownRef({ type: "paragraph", id: para.id });
                          }}
                          className={`p-3.5 rounded border transition-all cursor-pointer ${
                            drilldownRef.type === "paragraph" && drilldownRef.id === para.id
                              ? "bg-slate-50 border-[#2F3640] shadow-xs"
                              : "bg-white border-gray-200 hover:bg-gray-50"
                          }`}
                          id={`lh_p_block_${para.id}`}
                        >
                          <div className="flex justify-between items-center mb-1.5" id={`lh_p_meta_${para.id}`}>
                            <span className="font-mono text-xs font-bold text-[#2F3640]">{para.citation}</span>
                            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">{para.title}</span>
                          </div>
                          <p className="text-xs text-gray-600 italic leading-relaxed line-clamp-3" id={`lh_p_text_${para.id}`}>
                            “{para.description}”
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded border border-[#DCDDE1]" id="lib_concepts_card">
                    <h3 className="text-xs font-bold text-[#7F8C8D] uppercase tracking-wider mb-2">
                      Key Technical Accounting Judgements
                    </h3>
                    <ul className="space-y-1.5" id="concepts_list">
                      {activeDrilldownStandard.keyConcepts.map((concept, i) => (
                        <li key={i} className="text-xs flex items-center gap-1.5 text-gray-700" id={`concept_li_${i}`}>
                          <div className="w-1.5 h-1.5 bg-[#2F3640] rounded-sm"></div>
                          <span>{concept}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Practical Case study simulations */}
                <div className="col-span-1 lg:col-span-6 space-y-4" id="lib_case_studies">
                  <div className="bg-[#2F3640] text-gray-200 p-4 rounded border border-gray-700" id="lib_cases_card">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5" /> Technical Application Challenges & Cases
                    </h3>

                    {activeDrilldownStandard.caseStudies.length === 0 ? (
                      <div className="text-center py-8 text-gray-400 text-xs" id="no_case_notif">
                        No custom case templates uploaded for this standard node yet. Consult compliance tab.
                      </div>
                    ) : (
                      <div className="space-y-4" id="cases_loop_list">
                        {activeDrilldownStandard.caseStudies.map((cs) => (
                          <div 
                            key={cs.id}
                            className="bg-white/5 border border-white/10 rounded p-4 space-y-3"
                            id={`case_block_${cs.id}`}
                          >
                            <div className="flex justify-between items-start" id={`case_hd_${cs.id}`}>
                              <h4 className="font-bold text-white text-xs leading-tight" id={`case_title_${cs.id}`}>
                                {cs.title}
                              </h4>
                              <button
                                type="button"
                                id={`case_simulate_btn_${cs.id}`}
                                onClick={() => {
                                  // Locate preset template matches and load it
                                  const matchingPreset = sampleTemplates.find(tpl => tpl.name.includes(cs.title.split(" ")[0]));
                                  if (matchingPreset) {
                                    loadPresetTemplate(matchingPreset);
                                  } else {
                                    // Set fields manually to simulate
                                    setTransactionDesc(cs.scenario);
                                    setAccountingPolicy(cs.analysis);
                                    setDraftDisclosures(cs.issue);
                                    setLedgerRows(cs.journalEntries.map(e => ({ account: e.debit, debit: parseFloat(e.amount.replace(/[^0-9.]/g, "")) || 0, credit: 0 })));
                                    setSelectedStandardIds([activeDrilldownStandard.id]);
                                  }
                                  setActiveTab("compliance");
                                }}
                                className="shrink-0 flex items-center gap-1 bg-white text-[#2F3640] px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-gray-100"
                              >
                                Test This Scenario
                              </button>
                            </div>

                            <div className="space-y-1.5 text-xs text-slate-300" id={`case_body_${cs.id}`}>
                              <p className="leading-relaxed font-serif italic text-slate-400" id={`case_issue_${cs.id}`}>
                                <span className="font-bold text-gray-400 not-italic uppercase text-[9px] block">Accounting Issue:</span>
                                {cs.issue}
                              </p>
                              <div className="h-[1px] bg-white/5"></div>
                              <p className="leading-relaxed text-[11px]" id={`case_scenario_${cs.id}`}>
                                <span className="font-bold text-gray-400 uppercase text-[9px] block">Factual Scenario context:</span>
                                {cs.scenario}
                              </p>
                              <div className="h-[1px] bg-white/5"></div>
                              <p className="leading-relaxed text-[11px]" id={`case_analysis_${cs.id}`}>
                                <span className="font-bold text-gray-400 uppercase text-[9px] block">IFRS Paragraph Technical Analysis:</span>
                                {cs.analysis}
                              </p>
                            </div>

                            {/* Corrective ledger journal entries */}
                            <div className="bg-white/5 p-3 rounded text-xs space-y-2 font-mono text-[#DCDDE1]" id={`case_journals_list_${cs.id}`}>
                              <span className="text-[9px] uppercase font-bold text-gray-400 block tracking-wider font-sans">
                                Calculated Corrective Postings:
                              </span>
                              {cs.journalEntries.map((je, jIdx) => (
                                <div key={jIdx} className="space-y-1 border-b border-white/5 pb-1.5 last:border-none" id={`case_je_${cs.id}_${jIdx}`}>
                                  <div className="flex justify-between font-sans text-[11px] text-[#7F8C8D]" id={`case_je_desc_${cs.id}_${jIdx}`}>
                                    <span>{je.description}</span>
                                    <span className="font-mono text-emerald-400 font-bold">{je.amount}</span>
                                  </div>
                                  <div className="text-[10px]" id={`case_je_line_${cs.id}_${jIdx}`}>
                                    <span className="text-emerald-300">Dr. {je.debit}</span> | <span className="text-amber-300">Cr. {je.credit}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 3: Conversational Advisor with custom workspace focus */}
          {activeTab === "advisory" && (
            <div className="space-y-5" id="tab_view_advisory_chat">
              
              <div className="bg-white p-4 rounded border border-[#DCDDE1] flex justify-between items-center" id="advisor_chat_hdr">
                <div id="advisor_chat_titles">
                  <span className="text-[10px] uppercase font-bold text-[#7F8C8D] tracking-widest">Active Consultation</span>
                  <h1 className="text-lg font-light text-[#2F3640]">IFRS / IAS Technical Advisory Partner</h1>
                  <p className="text-xs text-[#7F8C8D]">
                    Real-time research agent grounded in the selected standard context: <span className="font-bold font-mono">{activeDrilldownStandard.code}</span>
                  </p>
                </div>
                
                <button
                  id="chat_reset_session_btn"
                  onClick={() => {
                    setChats([
                      { 
                        role: "ai", 
                        content: `Session refreshed. Active standard target initialized to **${activeDrilldownStandard.code}**. Ask me technical accounting questions about this standard.` 
                      }
                    ]);
                  }}
                  className="px-2.5 py-1 text-xs border bg-white hover:bg-slate-50 rounded transition-all text-gray-500 flex items-center gap-1 font-semibold"
                >
                  <RotateCcw className="w-3 h-3" /> Refresh Consult
                </button>
              </div>

              {/* Chat Console container */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5" id="advisor_chat_grid">
                
                {/* Visual Dialogue Column (Span 8) */}
                <div className="col-span-1 lg:col-span-8 flex flex-col h-[480px] bg-white rounded border border-[#DCDDE1] overflow-hidden" id="chat_dialogue_card">
                  
                  {/* Messages list */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gray-50/50" id="messages_stream_scroller">
                    {chats.map((msg, idx) => (
                      <div 
                        key={idx} 
                        id={`chat_message_bubble_${idx}`}
                        className={`max-w-[85%] p-3.5 rounded-lg text-xs leading-relaxed ${
                          msg.role === "user"
                            ? "bg-[#2F3640] text-slate-100 ml-auto rounded-tr-none"
                            : "bg-white text-gray-700 border border-gray-250 mr-auto rounded-tl-none prose prose-sm"
                        }`}
                      >
                        {msg.role === "ai" ? (
                          // Quick Markdown layout pre-render simulation for chat block
                          <div className="space-y-2 whitespace-pre-wrap font-sans" id={`ai_msg_inner_${idx}`}>
                            {msg.content}
                          </div>
                        ) : (
                          <div className="font-semibold whitespace-pre-wrap" id={`user_msg_inner_${idx}`}>{msg.content}</div>
                        )}
                      </div>
                    ))}
                    {isSendingChat && (
                      <div className="bg-white text-gray-500 mr-auto p-3 rounded border flex items-center gap-2" id="ai_typing_indicator">
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        <span className="text-[10px] italic">Gemini technical agent is drafting citation...</span>
                      </div>
                    )}
                  </div>

                  {/* Input form */}
                  <div className="p-3 border-t border-[#DCDDE1] bg-white flex gap-2" id="chat_bottom_input_wrapper">
                    <input
                      id="chat_text_box_input"
                      type="text"
                      className="flex-1 bg-gray-50 border border-[#DCDDE1] rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#2F3640] focus:bg-white text-[#2D3436]"
                      placeholder={`Query ${activeDrilldownStandard.code} regulatory principles, calculations, or re-adjustments...`}
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !isSendingChat) {
                          handleSendQuery();
                        }
                      }}
                    />
                    <button
                      id="chat_send_arrow_btn"
                      type="button"
                      disabled={isSendingChat || !chatInput.trim()}
                      onClick={() => handleSendQuery()}
                      className="bg-[#2F3640] text-white px-4 py-2 rounded text-xs font-bold hover:bg-[#34495e] transition-all disabled:opacity-50 shrink-0"
                    >
                      Ask Advisor
                    </button>
                  </div>

                </div>

                {/* Suggested citation queries (Span 4) */}
                <div className="col-span-1 lg:col-span-4 space-y-4" id="chat_prompts_column">
                  <div className="bg-[#2F3640] text-gray-200 p-4 rounded border border-gray-700" id="suggested_prompts_card">
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Suggested Queries</span>
                    <h3 className="font-bold text-white text-xs mt-0.5 mb-3">Instant Standard Contexts</h3>

                    <div className="space-y-2 text-xs" id="prompts_suggestions_list">
                      <button
                        type="button"
                        id="suggested_q_1"
                        onClick={() => handleSendQuery(`How does IFRS 15 define a performance obligation? Does customized database work constitute a separate performance obligation distinct from the standard license?`)}
                        className="w-full text-left bg-white/5 hover:bg-white/10 p-2.5 rounded border border-white/5 transition-all block text-slate-300"
                      >
                        Software Licensing separation under <strong>IFRS 15</strong> 
                      </button>
                      <button
                        type="button"
                        id="suggested_q_2"
                        onClick={() => handleSendQuery(`How is a lease Rent-Free holiday period treated according to IFRS 16? Provide the exact Right of Use and Liability discount double entry templates.`)}
                        className="w-full text-left bg-white/5 hover:bg-white/10 p-2.5 rounded border border-white/5 transition-all block text-slate-300"
                      >
                        Lease free holiday treatment with <strong>IFRS 16</strong>
                      </button>
                      <button
                        type="button"
                        id="suggested_q_3"
                        onClick={() => handleSendQuery(`What is the correct allocating order of impairment losses regarding Goodwills and other division equipment under IAS 36 CGUs?`)}
                        className="w-full text-left bg-white/5 hover:bg-white/10 p-2.5 rounded border border-white/5 transition-all block text-slate-300"
                      >
                        Mining goodwill CGU allocation under <strong>IAS 36</strong>
                      </button>
                      <button
                        type="button"
                        id="suggested_q_4"
                        onClick={() => handleSendQuery(`Under IAS 2, does raw inventory acquisition allow storage overhead and inwards freight loading? What are the impairment writing criteria?`)}
                        className="w-full text-left bg-white/5 hover:bg-white/10 p-2.5 rounded border border-white/5 transition-all block text-slate-300"
                      >
                        Inwards freight & NRV rule under <strong>IAS 2</strong>
                      </button>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10 text-[10px] text-gray-400 leading-relaxed" id="prompts_info_stamp">
                      Tip: Selecting a standard in the left index automatically updates the active reference background, focusing responses around your requested citation environment.
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Regulatory source drill-down panel (Drilldown Sidebar) */}
        <aside className={`bg-[#0B192C] text-white flex flex-col shrink-0 overflow-y-auto border-l border-[#C5A880]/20 relative transition-all duration-300 ${
          rightSidebarOpen ? "w-80 animate-fade-in" : "w-0 overflow-hidden border-l-0"
        }`} id="right_drilldown_aside">
          {/* Elegant Gold Accent Header Topline */}
          <div className="h-0.5 bg-[#C5A880] w-full absolute top-0 left-0"></div>
          
          <div className="p-5 border-b border-white/10 mt-0.5" id="drilldown_sidebar_header">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold flex items-center gap-1">
              <Database className="w-3 h-3 text-[#C5A880]" /> Regulatory Core Source
            </span>
            <h2 className="text-lg mt-1 font-semibold text-white truncate" id="drilldown_std_caption">
              {activeDrilldownStandard.code}
            </h2>
            <p className="text-[11px] text-gray-300 line-clamp-2 mt-0.5" id="drilldown_std_title">
              {activeDrilldownStandard.title}
            </p>
          </div>

          <div className="flex-1 p-5 space-y-5 text-xs text-gray-300" id="drilldown_sidebar_body">
            
            {/* Quick Summary Section */}
            <div className="bg-white/5 p-3.5 rounded border border-white/10" id="drilldown_overview_box">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Standard Scope</h4>
              <p className="text-[11px] leading-relaxed text-slate-300">
                {activeDrilldownStandard.summary}
              </p>
            </div>

            {/* Paragraph view details when clicked on findings */}
            <div className="space-y-3" id="drilldown_citation_paragraphs_module">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex justify-between items-center px-0.5">
                <span>Active Citations Indexed ({activeDrilldownStandard.sourceParagraphs.length})</span>
                <span className="text-[9px] lowercase font-normal italic text-slate-400">Read only database</span>
              </h4>

              <div className="space-y-2.5" id="citations_vertical_roll">
                {activeDrilldownStandard.sourceParagraphs.map((p) => {
                  const isSelected = drilldownRef.type === "paragraph" && drilldownRef.id === p.id;
                  return (
                    <div 
                      key={p.id} 
                      className={`p-3 rounded border transition-all text-xs ${
                        isSelected 
                          ? "bg-emerald-950/40 border-emerald-500 text-slate-200" 
                          : "bg-white/5 border-white/15 text-slate-300"
                      }`}
                      id={`rh_p_bubble_${p.id}`}
                    >
                      <div className="flex items-center justify-between gap-1 border-b border-white/5 pb-1 mb-1.5" id={`rh_p_meta_${p.id}`}>
                        <span className="font-mono font-bold text-emerald-400 text-[10px]" id={`p_lbl_${p.id}`}>{p.citation}</span>
                        <span className="text-[9px] text-gray-400 font-semibold" id={`p_title_lbl_${p.id}`}>{p.title}</span>
                      </div>
                      <p className="font-serif italic leading-relaxed text-[11px] text-slate-300" id={`p_desc_lbl_${p.id}`}>
                        “{p.description}”
                      </p>
                      
                      <div className="flex justify-end gap-1.5 mt-2 pt-1 border-t border-white/5" id={`p_action_row_${p.id}`}>
                        <button
                          type="button"
                          id={`p_copy_btn_${p.id}`}
                          onClick={() => triggerCopyFeedback(p.description, `cp_${p.id}`)}
                          className="text-[9px] text-slate-400 hover:text-white flex items-center gap-0.5"
                        >
                          {copiedTextId === `cp_${p.id}` ? "Copied!" : <><Copy className="w-2.5 h-2.5" /> Copy Cite</>}
                        </button>
                        <span className="text-white/10 text-[9px]">|</span>
                        <button
                          type="button"
                          id={`p_ask_btn_${p.id}`}
                          onClick={() => {
                            setActiveTab("advisory");
                            handleSendQuery(`Can you explain standard reference ${p.citation} in simple terms with a concrete commercial entity example? Include debits/credits.`);
                          }}
                          className="text-[9px] text-emerald-400 hover:underline"
                        >
                          Explain
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Standard checklist guidelines */}
            <div className="space-y-2 bg-[#06101E] p-3.5 rounded border border-white/5" id="drilldown_checklist_box">
              <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block mb-1">
                IAS Audit Validation Checklist
              </h4>
              <ul className="space-y-1.5" id="validation_ul">
                {activeDrilldownStandard.complianceChecklist.map((ch, idx) => (
                  <li key={idx} className="text-[11px] flex items-start gap-1 text-slate-300 leading-normal" id={`validation_li_${idx}`}>
                    <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{ch}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Quick interactive assistant trigger link */}
          <div className="p-4 border-t border-white/10 bg-[#06101E]" id="quick_mini_chat_link">
            <button
              type="button"
              id="mini_advisory_btn"
              onClick={() => {
                setActiveTab("advisory");
                setChatInput(`Clarify the technical accounting requirements for ${activeDrilldownStandard.code}.`);
              }}
              className="w-full bg-white text-[#0B192C] py-2.5 rounded text-[11px] font-bold uppercase tracking-wider hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5 border border-[#C5A880]/30"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#C5A880]" /> Consult on this Standard
            </button>
          </div>

        </aside>

      </div>

      {/* Footer Status Bar indicating compliance operations */}
      <footer className="h-8 bg-[#0B192C] text-gray-200 border-t border-[#C5A880]/20 flex items-center justify-between px-4 text-[10px] shrink-0" id="footer_bar">
        <div className="flex gap-4" id="footer_left">
          <span className="flex items-center gap-1 text-gray-300">
            IFRS Brief Pro: <span className="text-emerald-400 font-bold">ACTIVE</span>
          </span>
          <span className="text-gray-400">Database Sync: <span className="font-mono text-gray-300">IFRS 2026.1 Update</span></span>
        </div>
        <div className="flex items-center gap-2" id="footer_right">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
          <span className="text-gray-400 font-mono">Gemini-3.5-Flash Active (Temperature: 0.2)</span>
        </div>
      </footer>

        </div>
      </div>
    </div>
  );
}
