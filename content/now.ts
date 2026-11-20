import type { NowContent } from "@/lib/schemas";

export const nowContent: NowContent = {
  lastUpdated: "2026-11-19",
  intro:
    "Current engineering priorities and active system builds across FinTech, LegalTech, applied AI, and distributed systems.",
  items: [
    {
      id: "rust-systems",
      topic: "Rust & Ownership-Aware Systems Design",
      category: "Systems Engineering",
      summary:
        "Practicing state-machine modeling, zero-cost domain types, and deterministic rule evaluation where memory safety and explicit error types clarify control flow.",
    },
    {
      id: "transaction-risk",
      topic: "Transaction-Risk Engine Architecture",
      category: "FinTech / Systems",
      summary:
        "Structuring ingest, rule evaluation, and decision audit trails so compliance policies can be inspected and tested independently of transport layers.",
    },
    {
      id: "distributed-failures",
      topic: "Distributed Systems Failure & Latency Modeling",
      category: "Systems Engineering",
      summary:
        "Studying how message reordering, network partitions, and timeout miscalibration surface in simulated multi-node protocols.",
    },
    {
      id: "digital-asset-boundaries",
      topic: "Digital-Asset Infrastructure & Legal Boundaries",
      category: "FinTech / LegalTech",
      summary:
        "Mapping where smart-contract transfer restrictions stop and where off-chain identity, custodial records, and governing legal instruments must operate.",
    },
    {
      id: "doc-intelligence-eval",
      topic: "Document Intelligence & Evaluation Rigor",
      category: "AI Systems",
      summary:
        "Designing multi-signal extraction and anomaly-check pipelines with explicit abstain thresholds instead of over-trusting end-to-end model outputs.",
    },
  ],
};
