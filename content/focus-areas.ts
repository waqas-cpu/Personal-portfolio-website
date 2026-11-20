import type { FocusArea } from "@/lib/schemas";

export const focusAreasContent: FocusArea[] = [
  {
    id: "financial-infrastructure",
    index: "01",
    title: "Financial Infrastructure",
    summary:
      "Exploring transaction risk evaluation, financial data pipelines, digital asset models, and tokenization mechanics.",
    topics: [
      "Transaction risk engines",
      "Financial data lakehouse architecture",
      "Digital asset & ownership state models",
      "Tokenization workflow prototypes",
    ],
    framingNote: "Active area of prototyping, modeling, and systems study.",
  },
  {
    id: "ai-intelligent-systems",
    index: "02",
    title: "AI & Intelligent Systems",
    summary:
      "Investigating machine learning pipelines, financial document intelligence, agentic workflows, and rigorous evaluation boundaries.",
    topics: [
      "Document layout & OCR pipelines",
      "Forensic anomaly feature design",
      "Agentic workflow constraints",
      "Evaluation & grounded retrieval",
    ],
    framingNote: "Focused on reliability, traceability, and measurable failure modes.",
  },
  {
    id: "legal-compliance-tech",
    index: "03",
    title: "Legal & Compliance Technology",
    summary:
      "Examining how identity verification, KYC/KYB gating, data protection, and cyber-law constraints shape software architecture.",
    topics: [
      "Identity & KYC/KYB workflow concepts",
      "Jurisdiction & off-chain rights separation",
      "Data minimization & protection boundaries",
      "Regulatory-aware audit trails",
    ],
    framingNote: "Engineering prototypes framed alongside legal and operational boundaries.",
  },
  {
    id: "systems-engineering",
    index: "04",
    title: "Systems Engineering",
    summary:
      "Practicing distributed systems reasoning, Rust ownership-based design, API boundaries, observability, and security.",
    topics: [
      "Rust domain & concurrency modeling",
      "Discrete-event failure simulation",
      "Service & trust boundary design",
      "Observability & reliability patterns",
    ],
    framingNote: "Grounded in explicit failure analysis rather than production claims.",
  },
];
