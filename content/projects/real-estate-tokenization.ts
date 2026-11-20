import type { PortfolioProject } from "@/lib/schemas";

export const realEstateTokenizationProject: PortfolioProject = {
  slug: "real-estate-tokenization",
  title: "Real-Estate Tokenization Platform Prototype",
  summary:
    "Architecture and compliance-gated transfer prototype modeling fractional real-estate representation, off-chain identity checks, and legal-technical trust boundaries.",
  domains: ["FinTech", "LegalTech", "DLT"],
  status: "in-progress",
  visibility: "published",
  ownerApproved: true,
  featured: true,
  lastUpdated: "2026-11-20",
  publicationNotice:
    "Prototype boundary notice: On-chain tokens in this model represent technical ledger state only and do not create legally enforceable property ownership rights. Legal validity depends on jurisdiction, governing legal instruments, custodial/SPV structure, and applicable securities and property regulations.",
  overview:
    "An engineering and systems-modeling exploration of how permissioned digital asset representations can integrate KYC/KYB eligibility rules, transfer restrictions, and auditability without conflating smart-contract execution with legal title transfer.",
  problemContext:
    "Real-estate interests are illiquid, jurisdiction-bound, and governed by formal title registries and investor eligibility rules. Naive tokenization prototypes often assume deploying a token contract establishes legal ownership or satisfies compliance obligations automatically—creating dangerous mismatches between ledger state and enforceable rights.",
  scopeAndStatus: {
    implemented: [
      "Domain model separating legal entity/SPV wrapper metadata from on-chain unit accounting",
      "Compliance-gated transfer workflow concept with explicit allowlist eligibility checks",
      "Smart-contract state machine design for minting, frozen holds, and restricted transfers",
      "Off-chain vs. on-chain trust boundary and data-minimization flow specification",
    ],
    prototypeOrPlanned: [
      "Full end-to-end testnet deployment artifact linking an allowlisted repository and test trace",
      "Integration with external third-party KYC provider webhooks",
      "Jurisdiction-specific legal documentation templates (out of software scope)",
    ],
    statusRationale:
      "Marked In progress because the domain model, compliance gating logic, and contract structure have been designed and iteratively tested as a prototype, while external identity integrations and formal legal wrappers remain out of production scope.",
  },
  constraints: [
    {
      category: "Legal & Regulatory",
      detail:
        "Smart contracts cannot unilaterally confer statutory title or bypass transfer-agent, securities, or anti-money-laundering rules across jurisdictions.",
    },
    {
      category: "Privacy & Data Protection",
      detail:
        "Personal identity documents and KYC records must stay off-chain; publishing PII onto an immutable ledger violates data-minimization and erasure obligations.",
    },
    {
      category: "Operational & Recovery",
      detail:
        "Lost keys or court-ordered freezes require controlled administrative recovery mechanisms rather than purely irreversible bearer transfers.",
    },
  ],
  systemModel: {
    actors: [
      "Prospective Investor (identity-verified participant)",
      "Issuer / Asset Custodian (initiates issuance and off-chain asset records)",
      "Compliance / Verification Service (issues eligibility attestations)",
      "Governance / Transfer Admin (executes freeze or recovery under documented policy)",
    ],
    components: [
      "Off-Chain Onboarding & KYC/KYB Verification Gateway",
      "Identity Registry / Attestation Issuer Service",
      "Restricted Token Smart Contract & Transfer Compliance Module",
      "Audit Event Indexer & Reconciliation Log",
    ],
    boundaries: [
      "Public/Testnet Ledger Boundary: stores pseudonymous wallet eligibility flags and token balances only",
      "Off-Chain Regulated Data Boundary: stores investor identity, tax status, and legal subscription agreements",
      "Legal Enforceability Boundary: external SPV/custodial agreements govern actual beneficial rights",
    ],
    dependencies: [
      "Wallet signature verification and EVM-compatible execution environment",
      "Off-chain identity attestation signing service",
      "Deterministic event indexing for reconciliation against off-chain cap-table state",
    ],
  },
  architecture: {
    summary:
      "A two-plane architecture separating confidential off-chain compliance/legal records from deterministic on-chain transfer enforcement, linked only by minimal signed eligibility claims.",
    diagramId: "real-estate-tokenization",
    diagramCaption:
      "Two-plane architecture isolating off-chain KYC/legal records from on-chain transfer gates.",
    diagramTextAlternative:
      "Off-chain onboarding collects KYC/KYB evidence inside a private boundary, computes an eligibility status, and writes only a non-PII allowlist attestation to an on-chain identity registry. When an investor initiates a transfer on the restricted token contract, control flow queries the compliance module and identity registry before permitting ledger state transition, emitting events back to an off-chain reconciliation audit log.",
    layers: [
      {
        name: "Off-Chain Legal & Onboarding Plane",
        responsibility:
          "Collects identity evidence, maps investor jurisdiction constraints, stores legal subscription agreements, and avoids writing PII on-chain.",
      },
      {
        name: "Attestation & Identity Registry Layer",
        responsibility:
          "Maps approved wallet addresses to minimal boolean/jurisdiction-code claims with explicit expiry timestamps.",
      },
      {
        name: "On-Chain Transfer Compliance Layer",
        responsibility:
          "Intercepts mint, burn, and transfer calls to verify sender/recipient eligibility, hold periods, and freeze flags.",
      },
      {
        name: "Reconciliation & Audit Plane",
        responsibility:
          "Consumes ledger events to detect discrepancies against the authoritative off-chain share/unit register.",
      },
    ],
  },
  dataFlow: [
    {
      stage: "1. Off-Chain Intake",
      description:
        "Investor submits KYC/KYB documentation into an isolated off-chain service; raw documents never touch blockchain storage.",
    },
    {
      stage: "2. Attestation Projection",
      description:
        "A signed minimal claim (wallet address, eligibility flag, expiry) is registered without exposing identity attributes.",
    },
    {
      stage: "3. Ledger Mutation",
      description:
        "Approved mint or transfer updates unit balances and emits structured Transfer/ComplianceCheck events.",
    },
    {
      stage: "4. Reconciliation",
      description:
        "Off-chain indexer ingests events to maintain a synchronized mirror against legal cap-table records.",
    },
  ],
  controlFlow: [
    {
      stage: "1. Eligibility Pre-Check",
      description:
        "Compliance module verifies both sender and receiver hold active, non-expired allowlist status before balance changes.",
    },
    {
      stage: "2. Policy & Hold Enforcement",
      description:
        "Transfer rules reject transfers during lockup windows, paused states, or frozen-account flags.",
    },
    {
      stage: "3. Fail-Closed Default",
      description:
        "If attestation lookup is missing, expired, or unverified, the state transition reverts explicitly.",
    },
    {
      stage: "4. Controlled Recovery",
      description:
        "Administrative freeze/re-issuance paths require explicit role separation and leave immutable event logs for review.",
    },
  ],
  decisions: [
    {
      decision: "Keep all PII strictly off-chain and store only minimal allowlist claims on-chain",
      alternatives: "Store encrypted identity hashes or verifiable credentials directly on ledger",
      rationale:
        "Immutable ledgers conflict with privacy regulations and key-rotation lifecycle; minimal boolean/expiry flags avoid leaking correlateable identity traits.",
      tradeoff:
        "Requires trusted off-chain attestation governance and reliable synchronization between off-chain revocation and on-chain status.",
    },
    {
      decision: "Modular compliance hook separate from core token accounting",
      alternatives: "Hardcode jurisdiction and lockup rules directly inside transfer functions",
      rationale:
        "Regulatory transfer rules change more often than balance arithmetic; isolating policy checks simplifies verification and reduces coupling.",
      tradeoff:
        "Adds indirection and gas overhead on transfers, requiring strict upgrade/governance controls on the policy module.",
    },
  ],
  securityAndFailures: [
    {
      threatOrMode: "Stale eligibility after KYC revocation",
      trustBoundary: "Off-chain Compliance -> On-chain Registry",
      mitigation:
        "Attach short claim expiry timestamps and prioritize immediate on-chain revocation calls upon status downgrade.",
      residualRisk:
        "A propagation window remains between off-chain status change and on-chain revocation confirmation.",
    },
    {
      threatOrMode: "Centralized admin key compromise",
      trustBoundary: "Governance Role -> Token Contract",
      mitigation:
        "Model multi-signature role separation and time-delayed administrative actions instead of single-EOA control.",
      residualRisk:
        "Key custody procedures remain an operational risk outside smart-contract logic.",
    },
    {
      threatOrMode: "Divergence between ledger balances and legal ownership registry",
      trustBoundary: "On-chain State <-> Off-chain Legal SPV Register",
      mitigation:
        "Treat off-chain legal records as authoritative for dispute resolution and run deterministic event reconciliation.",
      residualRisk:
        "Disputes require manual legal intervention; code cannot resolve contested off-chain title claims.",
    },
  ],
  implementation: {
    technologies: ["Solidity", "TypeScript", "Smart-Contract Testing", "Compliance Modeling"],
    ownerContribution:
      "Designed the end-to-end two-plane architecture, compliance rule state machine, threat boundary analysis, and prototype transfer-gating implementation.",
    structureNotes:
      "Structured around explicit separation between ledger accounting, policy evaluation, and off-chain legal disclaimers.",
  },
  validation: [
    {
      method: "Unit & negative-path transfer scenario checks",
      status: "Prototype test coverage (not third-party audited)",
      scopeAndResult:
        "Verified allowlisted transfers succeed while unverified, expired, or frozen accounts fail closed in local test runs.",
    },
    {
      method: "Threat & legal-boundary review",
      status: "Documented design review",
      scopeAndResult:
        "Explicitly separated technical prototype claims from legal title enforceability; no production deployment or security audit performed.",
    },
  ],
  limitations: [
    "No third-party smart-contract security audit has been conducted; not production-ready.",
    "Does not include live licensed KYC/KYB vendor integration or jurisdiction-specific legal filings.",
    "Admin recovery models introduce governance trust assumptions that must match real legal custody.",
  ],
  nextSteps: [
    "Publish an allowlisted GitHub repository with reproducible local test suites after cleanup and review.",
    "Add property-based fuzz tests covering lockup edge cases and revocation race windows.",
    "Document concrete multi-sig governance thresholds and pause-recovery runbooks.",
  ],
  links: [
    {
      label: "GitHub: real-estate-token",
      url: "https://github.com/waqas-cpu/real-estate-token",
      kind: "github",
      approved: true,
    },
    {
      label: "GitHub: web3-compliance-platform-",
      url: "https://github.com/waqas-cpu/web3-compliance-platform-",
      kind: "github",
      approved: true,
    },
    {
      label: "GitHub: Ai-startup-funding-",
      url: "https://github.com/waqas-cpu/Ai-startup-funding-",
      kind: "github",
      approved: true,
    },
  ],
};
