export interface SourceParagraph {
  id: string;
  citation: string;
  title: string;
  description: string;
}

export interface JournalEntry {
  description: string;
  debit: string;
  credit: string;
  amount: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  issue: string;
  scenario: string;
  analysis: string;
  journalEntries: JournalEntry[];
}

export interface AccountingStandard {
  id: string;
  code: string;
  title: string;
  effectiveDate: string;
  summary: string;
  keyConcepts: string[];
  complianceChecklist: string[];
  sourceParagraphs: SourceParagraph[];
  caseStudies: CaseStudy[];
}

export interface AuditFinding {
  title: string;
  description: string;
  standardRef: string;
  impact: "Critical" | "High" | "Medium" | "Low";
  auditTest: string;
  correctiveAction: string;
  suggestedJournalEntry: string;
}

export interface DisclosureCheck {
  requirement: string;
  isPresent: boolean;
  recommendation: string;
}

export interface ComplianceReport {
  standardsCited: string[];
  complianceScore: number; // 0 - 100
  status: "Fully Compliant" | "Partially Compliant" | "Non-Compliant" | "Urgent Action Required";
  summary: string;
  findings: AuditFinding[];
  disclosureChecklist: DisclosureCheck[];
  accountingAdvice: string; // Markdown text
}

export interface Message {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
}
