import type { PortfolioProject } from "@/lib/schemas";

export const financialIntelligenceLakehouseProject: PortfolioProject = {
  slug: "financial-intelligence-lakehouse",
  title: "Financial Intelligence Lakehouse Pipeline",
  summary:
    "Databricks, Apache Spark, and Delta Lake financial intelligence lakehouse unifying batch and streaming ingestion across Bronze, Silver, and Gold layers with MLflow tracking.",
  domains: ["FinTech", "Data Engineering", "AI"],
  status: "in-progress",
  visibility: "published",
  ownerApproved: true,
  featured: true,
  lastUpdated: "2026-11-20",
  publicationNotice:
    "Scope boundary: Describes completed medallion pipeline structure and local workflow design separately from planned production streaming connectors and live model serving.",
  overview:
    "A structured data platform prototype implementing layered financial data ingestion (bronze, silver, gold) to produce traceable datasets for downstream risk analysis and model experimentation.",
  problemContext:
    "Financial analytics and risk workflows quickly lose reproducibility when raw market or ledger feeds are transformed via ad-hoc notebooks. Without schema enforcement, lineage between raw extracts and derived features, and separation between validated data and experimental signals, downstream risk outputs cannot be audited.",
  scopeAndStatus: {
    implemented: [
      "Three-layer medallion storage structure separating raw ingestion (bronze), validated/typed records (silver), and analytical aggregates (gold)",
      "Deterministic ingestion validation rules rejecting malformed records into quarantine paths",
      "Batch orchestration flow and experiment-tracking metadata schema for analytical runs",
    ],
    prototypeOrPlanned: [
      "Real-time low-latency streaming ingestion (currently modeled as scheduled/batch ingestion)",
      "Automated drift alerting connected to external incident tooling",
      "Production multi-tenant access control and cloud warehouse deployment",
    ],
    statusRationale:
      "Marked In progress because core medallion transformations, validation boundaries, and orchestration concepts are structured, while live external market feeds and production deployment remain planned.",
  },
  constraints: [
    {
      category: "Auditability & Lineage",
      detail:
        "Gold-layer risk aggregates must remain traceable back to immutable bronze raw payloads and exact transformation versions.",
    },
    {
      category: "Schema Stability",
      detail:
        "Upstream source feeds change field formats or omit optional values; silver transformations must fail safely rather than silently coercing bad numbers.",
    },
    {
      category: "Cost & Proportionate Compute",
      detail:
        "Designed to run deterministically on local or single-cluster batch tooling before introducing continuous streaming infrastructure.",
    },
  ],
  systemModel: {
    actors: [
      "Data Producer / Market & Ledger Export Sources",
      "Batch Orchestrator (schedules extraction, validation, and aggregation)",
      "Risk Analyst / Modeling Workflow (consumes gold-layer datasets)",
    ],
    components: [
      "Ingestion Connector & Raw Landing Zone (Bronze)",
      "Schema Validator, Deduplicator & Quarantine Sink (Silver)",
      "Feature & Risk Aggregation Engine (Gold)",
      "Pipeline Orchestrator & Experiment Tracking Registry",
    ],
    boundaries: [
      "Untrusted Source Boundary: raw external CSV/JSON payloads enter bronze unmodified",
      "Validated Data Boundary: only schema-checked, deduplicated records enter silver",
      "Modeling Boundary: gold features feed offline risk experiments without mutating source history",
    ],
    dependencies: [
      "Python data processing & validation libraries",
      "Columnar storage format (Parquet / lakehouse table abstraction)",
      "Workflow orchestrator and experiment parameter logging",
    ],
  },
  architecture: {
    summary:
      "A medallion lakehouse pipeline enforcing immutability in the bronze zone, strict schema contracts at the silver boundary, and reproducible feature tables in gold.",
    diagramId: "financial-intelligence-lakehouse",
    diagramCaption:
      "Bronze–silver–gold financial pipeline with explicit schema validation quarantine and orchestration control.",
    diagramTextAlternative:
      "External sources enter an immutable Bronze raw landing zone. Control flow from an Orchestrator triggers schema validation before records pass into Silver typed tables; invalid rows are routed to a Quarantine log. Aggregated Silver records flow into Gold risk-feature tables consumed by Risk Analysis and Experiment Tracking, which records dataset versions and run parameters.",
    layers: [
      {
        name: "Bronze (Immutable Raw Zone)",
        responsibility:
          "Retains raw ingested records partitioned by ingestion timestamp and source identifier for replayability.",
      },
      {
        name: "Silver (Conformed & Validated Zone)",
        responsibility:
          "Applies strict type coercion checks, currency/timestamp normalization, deduplication, and dead-letter quarantining.",
      },
      {
        name: "Gold (Analytical & Feature Zone)",
        responsibility:
          "Computes rolling risk indicators, exposure summaries, and versioned snapshots for downstream inspection.",
      },
      {
        name: "Orchestration & Tracking Plane",
        responsibility:
          "Coordinates DAG execution order, retries, and links each experiment run to exact gold snapshot IDs.",
      },
    ],
  },
  dataFlow: [
    {
      stage: "1. Raw Ingestion (Bronze)",
      description:
        "Source payloads are persisted append-only with ingestion metadata headers and checksum hashes.",
    },
    {
      stage: "2. Contract Enforcement (Silver)",
      description:
        "Records pass field-level validation; malformed entries route to a quarantine dataset instead of corrupting aggregates.",
    },
    {
      stage: "3. Feature Computation (Gold)",
      description:
        "Conformed silver tables aggregate into time-windowed financial indicators with explicit calculation timestamps.",
    },
    {
      stage: "4. Experiment Consumption",
      description:
        "Risk analysis scripts read frozen gold snapshots and log input dataset versions alongside evaluation outputs.",
    },
  ],
  controlFlow: [
    {
      stage: "1. Orchestrated Trigger",
      description:
        "Scheduler triggers stage transitions sequentially, halting downstream gold jobs if silver validation fails quality thresholds.",
    },
    {
      stage: "2. Idempotent Re-Runs",
      description:
        "Partition-scoped overwrite or merge semantics prevent duplicate row inflation when a failed batch retries.",
    },
    {
      stage: "3. Quarantine Escalation",
      description:
        "Exceeding an invalid-record ratio aborts gold publication and flags schema drift for inspection.",
    },
  ],
  decisions: [
    {
      decision: "Batch-first medallion architecture instead of immediate streaming infrastructure",
      alternatives: "Kafka + Flink streaming pipeline from day one",
      rationale:
        "Batch partitions are significantly simpler to replay, test deterministically, and debug during architecture validation.",
      tradeoff:
        "Higher end-to-end data freshness latency; unsuitable for sub-second trading execution without a future streaming tier.",
    },
    {
      decision:
        "Explicit quarantine sink instead of silent drop or pipeline crash on single bad row",
      alternatives: "Drop invalid rows silently or fail the entire job on any warning",
      rationale:
        "Financial data audits require accounting for rejected records while avoiding brittle total halts on isolated upstream anomalies.",
      tradeoff:
        "Requires operational review of quarantined payloads so rejected edge cases do not accumulate unnoticed.",
    },
  ],
  securityAndFailures: [
    {
      threatOrMode: "Silent precision loss on monetary values",
      trustBoundary: "Bronze -> Silver normalization",
      mitigation:
        "Use fixed-precision decimal representations rather than binary floating-point types during financial parsing.",
      residualRisk:
        "Upstream feeds already rounded prior to ingestion cannot recover lost precision.",
    },
    {
      threatOrMode: "Data leakage across temporal train/eval splits",
      trustBoundary: "Gold -> Risk Experimentation",
      mitigation:
        "Enforce point-in-time event timestamps separate from ingestion timestamps when slicing historical windows.",
      residualRisk:
        "Backfilled late-arriving external corrections can alter historical snapshots if not strictly versioned.",
    },
  ],
  implementation: {
    technologies: ["Python", "Databricks", "Apache Spark", "Delta Lake", "MLflow", "SQL"],
    ownerContribution:
      "Defined the medallion table contracts, quarantine logic, batch orchestration workflow, and experiment-lineage structure.",
    structureNotes:
      "Separates pure transformation functions from I/O adapters so validation rules can run in isolated unit tests.",
  },
  validation: [
    {
      method: "Schema & quarantine path testing on sample datasets",
      status: "Local pipeline verification (synthetic/sample inputs)",
      scopeAndResult:
        "Confirmed malformed timestamps, negative anomalies, and duplicate keys route deterministically without inflating silver counts.",
    },
  ],
  limitations: [
    "Currently operates on bounded sample/batch datasets rather than live institutional data feeds.",
    "Performance throughput under terabyte-scale workloads has not been benchmarked.",
    "Fine-grained column-level RBAC and PII masking for regulated customer tables remain planned.",
  ],
  nextSteps: [
    "Add automated data-quality contract assertions (row-count bounds, null thresholds) to CI.",
    "Publish sanitized pipeline modules and reproducible synthetic sample fixtures on GitHub.",
    "Benchmark storage compaction and query pruning across larger partitioned intervals.",
  ],
  links: [
    {
      label: "GitHub: Financial-intelligence-lakehouse",
      url: "https://github.com/waqas-cpu/Financial-intelligence-lakehouse",
      kind: "github",
      approved: true,
    },
    {
      label: "GitHub: Preprocessing-of-financial-data-",
      url: "https://github.com/waqas-cpu/Preprocessing-of-financial-data-",
      kind: "github",
      approved: true,
    },
  ],
};
