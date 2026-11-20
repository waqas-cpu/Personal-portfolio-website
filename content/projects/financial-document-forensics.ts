import type { PortfolioProject } from "@/lib/schemas";

export const financialDocumentForensicsProject: PortfolioProject = {
  slug: "financial-document-forensics",
  title: "Financial Document Forensics AI Pipeline",
  summary:
    "Research proposal combining document layout parsing, OCR consistency checks, image-forensics signals, and calibrated anomaly triage for trust-sensitive financial records.",
  domains: ["AI", "FinTech", "Document Intelligence"],
  status: "proposed",
  visibility: "draft",
  ownerApproved: false,
  featured: false,
  lastUpdated: "2026-11-19",
  publicationNotice:
    "Proposal status: Architecture and evaluation design only. No trained production fraud detector, accuracy metrics, or live underwriting deployment exists.",
  overview:
    "An architectural research proposal examining how multi-modal evidence—layout structure, text/numeric cross-checks, metadata integrity, and pixel-level compression artifacts—can assist human reviewers flagging potentially altered financial statements or invoices.",
  problemContext:
    "Verification teams reviewing uploaded PDFs or scanned bank statements face manipulated totals, spliced font regions, or inconsistent arithmetic. Relying on a single opaque classifier risks both missed tampering and false fraud accusations against legitimate applicants who simply re-saved a document.",
  scopeAndStatus: {
    implemented: [
      "Problem framing, multi-signal pipeline specification, and evaluation criteria design",
      "Identification of failure modes and false-positive pitfalls (e.g., benign PDF re-compression)",
    ],
    prototypeOrPlanned: [
      "Baseline layout/OCR extraction prototype on controlled synthetic alteration benchmarks",
      "Cross-field arithmetic consistency validator",
      "Human-in-the-loop review queue preserving explainable localized evidence",
    ],
    statusRationale:
      "Marked Proposed because this work is currently at the research and system-design stage; empirical implementation and benchmark evaluation have not yet been executed.",
  },
  constraints: [
    {
      category: "High Cost of False Positives",
      detail:
        "Falsely labeling a legitimate customer document as forged harms access to financial services; outputs must act as triage signals for human review, never autonomous legal accusations.",
    },
    {
      category: "Sensitive Financial PII",
      detail:
        "Uploaded statements contain sensitive account identifiers; retention limits, redaction boundaries, and avoiding third-party external model leakage are critical.",
    },
    {
      category: "Benign Document Noise",
      detail:
        "Mobile camera scans, scanner compression, and print-then-scan workflows naturally create artifact variance that can mimic tampering.",
    },
  ],
  systemModel: {
    actors: [
      "Submitting Applicant / Document Source",
      "Automated Triage Pipeline (extracts signals without asserting final guilt)",
      "Human Compliance / Forensics Reviewer (makes final disposition)",
    ],
    components: [
      "Sanitized Ingestion & PDF/Image Canonicalizer",
      "Metadata & Font-Table Inspector",
      "Layout & OCR Numeric Consistency Analyzer",
      "Image-Forensics Feature Extractor & Calibrated Triage Scorer",
    ],
    boundaries: [
      "Untrusted Document Boundary: uploaded PDFs/images treated as adversarial inputs (parser sandboxing required)",
      "Sensitive Data Boundary: document buffers remain isolated with strict retention rules",
      "Decision Boundary: automated system emits localized anomaly cues; human reviewer owns final judgment",
    ],
    dependencies: [
      "Sandboxed PDF/image parsing and OCR engine",
      "Deterministic arithmetic cross-checking rules",
      "Calibrated anomaly scoring and explainability overlay",
    ],
  },
  architecture: {
    summary:
      "A sandboxed multi-signal pipeline that separates untrusted file parsing from independent structural, arithmetic, and visual forensic extractors, feeding an explainable human-review summary.",
    diagramId: "financial-document-forensics",
    diagramCaption:
      "Proposed sandboxed multi-signal pipeline separating parser isolation, independent extractors, and human review.",
    diagramTextAlternative:
      "Uploaded documents enter an isolated Sandbox Parser boundary to prevent malformed PDF exploits. Three parallel extractors analyze structure/metadata, OCR layout plus arithmetic totals, and image-forensics signals. Control flow aggregates calibrated anomaly cues and abstains when image quality is insufficient, passing localized findings—never an automated rejection—to a Human Reviewer.",
    layers: [
      {
        name: "Sandboxed File Canonicalization",
        responsibility:
          "Strips active scripts, enforces strict memory/timeout limits on PDF parsers, and renders normalized page rasters.",
      },
      {
        name: "Structural & Arithmetic Signal Layer",
        responsibility:
          "Inspects embedded font subsets, producer metadata anomalies, and OCR line-item vs. total math consistency.",
      },
      {
        name: "Visual Forensics Signal Layer",
        responsibility:
          "Extracts compression-history inconsistencies and bounding-box alignment deltas as weak signals.",
      },
      {
        name: "Calibrated Triage & Abstain Layer",
        responsibility:
          "Combines independent cues, checks scan-quality floors, and surfaces localized bounding boxes to reviewers.",
      },
    ],
  },
  dataFlow: [
    {
      stage: "1. Isolated Intake",
      description:
        "Untrusted document enters sandboxed parser and transforms into canonical page images and structured text/metadata.",
    },
    {
      stage: "2. Multi-Branch Feature Extraction",
      description:
        "Layout/OCR checks, arithmetic invariant checks, and visual forensic analyzers emit independent feature vectors.",
    },
    {
      stage: "3. Reviewer Evidence Packet",
      description:
        "Signals combine into an annotated evidence summary linking scores to specific page regions.",
    },
  ],
  controlFlow: [
    {
      stage: "1. Parser Resource Guard",
      description:
        "Malformed or oversized documents fail safely inside the sandbox without crashing downstream triage.",
    },
    {
      stage: "2. Quality Abstain Gate",
      description:
        "Low-DPI or heavily degraded scans bypass fragile pixel-forensic classifiers and route directly to quality-reupload or manual review.",
    },
    {
      stage: "3. Human-in-the-Loop Escalation",
      description:
        "No automated adverse action executes purely from forensic scores; threshold crossings trigger prioritized human inspection.",
    },
  ],
  decisions: [
    {
      decision:
        "Separate multi-signal triage features instead of one end-to-end black-box classifier",
      alternatives:
        "Fine-tune a single vision-language model to output binary authentic/forged labels",
      rationale:
        "Auditors and reviewers need concrete reasons (e.g., line-item sum mismatch vs. suspicious producer tag) rather than an unexplainable score.",
      tradeoff:
        "More pipeline components to calibrate and maintain, requiring disciplined evaluation per signal.",
    },
  ],
  securityAndFailures: [
    {
      threatOrMode: "Adversarial PDF parser exploits or decompression bombs",
      trustBoundary: "External Upload -> Document Parser",
      mitigation:
        "Isolate document parsing inside ephemeral resource-bounded containers with strict page and byte caps.",
      residualRisk:
        "Zero-day parser bugs remain an ongoing maintenance risk requiring prompt dependency patching.",
    },
    {
      threatOrMode: "Domain shift from unseen banking templates or legitimate scanning apps",
      trustBoundary: "Triage Scorer -> Human Reviewer",
      mitigation:
        "Include explicit abstain thresholds and track false-positive rates across benign document re-encoding benchmarks.",
      residualRisk:
        "Without a large representative validation dataset, empirical precision/recall cannot yet be claimed.",
    },
  ],
  implementation: {
    technologies: [
      "Proposed: Python",
      "Document OCR & Layout Analysis",
      "Image Forensics",
      "Evaluation Design",
    ],
    ownerContribution:
      "Authored the architectural proposal, parser isolation strategy, multi-signal combination model, and false-positive risk analysis.",
    structureNotes:
      "Maintained explicitly as a research/design specification until synthetic test fixtures and empirical evaluations are built.",
  },
  validation: [
    {
      method: "Architectural design review only",
      status: "Not yet implemented or benchmarked",
      scopeAndResult:
        "No empirical precision, recall, or latency claims are made; validation awaits construction of a synthetic and benign-recompression test corpus.",
    },
  ],
  limitations: [
    "Proposal only: no runnable codebase or trained model weights exist in this stage.",
    "Benign PDF generators and smartphone scanner enhancements easily confound naive compression-artifact detectors.",
  ],
  nextSteps: [
    "Build a reproducible synthetic tampering & benign re-compression evaluation dataset.",
    "Implement the deterministic OCR arithmetic-consistency baseline before adding visual forensic models.",
    "Measure calibration error and abstain behavior across degraded scan inputs.",
  ],
  links: [],
};
