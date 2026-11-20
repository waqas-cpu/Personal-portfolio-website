import type { PortfolioProject } from "@/lib/schemas";

export const transactionRiskEngineProject: PortfolioProject = {
  slug: "transaction-risk-engine",
  title: "Transaction Risk Engine (Rust Prototype)",
  summary:
    "Ownership-aware Rust domain model and deterministic rule-evaluation engine for screening financial transactions with explicit decision traces.",
  domains: ["FinTech", "Systems Engineering", "Rust"],
  status: "in-progress",
  visibility: "published",
  ownerApproved: true,
  featured: true,
  lastUpdated: "2026-11-20",
  publicationNotice:
    "Prototype notice: Implemented as an engineering and Rust systems-modeling project using deterministic rules and synthetic scenarios; not benchmarked against live payment rails.",
  overview:
    "A systems-oriented prototype exploring how Rust's type system, ownership semantics, and explicit error handling can model transaction validation, velocity/threshold rules, and auditable risk decisions without hidden mutable state.",
  problemContext:
    "Transaction screening systems must enforce strict invariants: decisions should be explainable, money representations cannot rely on lossy floats, and policy updates should not introduce ambiguous fallback behavior when evaluating edge-case payloads.",
  scopeAndStatus: {
    implemented: [
      "Strongly typed domain primitives (integer minor-unit amounts, currency tags, transaction states)",
      "Composable deterministic rule evaluators producing structured Pass / Review / Reject reasons",
      "State-window tracking abstraction for per-account velocity checks",
      "Unit test suite covering boundary amounts, invalid transitions, and rule composition",
    ],
    prototypeOrPlanned: [
      "Persistent storage adapter beyond in-memory state store",
      "HTTP/gRPC transport wrapper with backpressure and rate controls",
      "Property-based fuzzing and realistic load harness",
    ],
    statusRationale:
      "Marked In progress as an active Rust systems build: core domain types and evaluation semantics are in development while persistence and network service boundaries are not yet finalized.",
  },
  constraints: [
    {
      category: "Correctness & Determinism",
      detail:
        "Given the same transaction event and account window state, the engine must emit identical risk outcomes and reason codes.",
    },
    {
      category: "Financial Arithmetic",
      detail:
        "Reject IEEE-754 floating-point values for currency arithmetic; use checked integer minor units to prevent rounding drift and silent overflow.",
    },
    {
      category: "Explainability",
      detail:
        "Compliance and operations teams require structured evidence explaining which rules fired—never an opaque boolean.",
    },
  ],
  systemModel: {
    actors: [
      "Upstream Payment / Ledger Adapter (submits normalized transaction events)",
      "Risk Policy Author (defines threshold, velocity, and sanction/watchlist rules)",
      "Operations Reviewer (inspects flagged Review decisions and reason traces)",
    ],
    components: [
      "Domain Input Parser & Checked Currency Validator",
      "In-Memory Sliding Window State Store",
      "Deterministic Rules Evaluation Pipeline",
      "Structured Decision & Audit Trace Emitter",
    ],
    boundaries: [
      "Transport Boundary: untrusted input payloads parsed into validated Rust domain structs",
      "Evaluation Boundary: pure rule functions read immutable snapshots of state windows",
      "Action Boundary: caller enforces hold/reject downstream based on emitted decision record",
    ],
    dependencies: [
      "Rust standard library and deterministic time/integer crates",
      "Structured serialization for rule configuration and audit traces",
    ],
  },
  architecture: {
    summary:
      "A pure core evaluation loop wrapped by explicit parsing and state-lookup boundaries, preventing invalid currency states from reaching rule evaluation.",
    diagramId: "transaction-risk-engine",
    diagramCaption:
      "Boundary-validated Rust evaluation loop separating state lookup from pure deterministic policy rules.",
    diagramTextAlternative:
      "Raw transaction events cross the validation boundary into typed Rust structs. The coordinator fetches recent account history from a state window store and invokes pure policy rules (amount limits, velocity windows, counterparty checks). Control flow aggregates triggered rules into a deterministic Allow, Review, or Block decision alongside an audit trace.",
    layers: [
      {
        name: "Input Normalization & Newtype Layer",
        responsibility:
          "Enforces non-zero minor units, valid ISO-style currency tags, and monotonic timestamps at construction.",
      },
      {
        name: "Windowed Context Layer",
        responsibility:
          "Supplies bounded historical counters (e.g., rolling window sums) without exposing mutable globals to rules.",
      },
      {
        name: "Pure Rule Evaluation Layer",
        responsibility:
          "Applies independent checks returning explicit RuleOutcome variants with severity and human-readable rationale.",
      },
      {
        name: "Decision Aggregator",
        responsibility:
          "Combines rule outcomes via conservative precedence (Reject > Review > Allow) into an inspectable verdict.",
      },
    ],
  },
  dataFlow: [
    {
      stage: "1. Parse & Construct",
      description:
        "Incoming payload is validated into owned domain structs; malformed amounts or timestamps fail immediately.",
    },
    {
      stage: "2. Context Enrichment",
      description:
        "Engine retrieves an immutable slice of recent account activity for velocity and cumulative limit checks.",
    },
    {
      stage: "3. Rule Pass",
      description:
        "Each active rule evaluates the transaction + context pair and appends any triggered finding to a trace vector.",
    },
    {
      stage: "4. Verdict Output",
      description:
        "Outputs final disposition plus ordered list of triggered rules for downstream logging or human review.",
    },
  ],
  controlFlow: [
    {
      stage: "1. Parse Gate",
      description:
        "Invalid domain invariants short-circuit before rule evaluation so rules never branch on unvalidated data.",
    },
    {
      stage: "2. Conservative Precedence",
      description:
        "Any hard-block rule overrides lower-severity review flags; rules execute without early exit so full audit context is preserved.",
    },
    {
      stage: "3. Overflow Protection",
      description:
        "Checked addition prevents integer wrap-around on cumulative window amounts; overflow escalates to Review/Reject rather than wrapping.",
    },
  ],
  decisions: [
    {
      decision: "Evaluate all active rules rather than short-circuiting on the first flag",
      alternatives: "Return immediately on first failed check to save CPU cycles",
      rationale:
        "Investigators inspecting a blocked transaction need the complete set of contributing factors, not only whichever rule ran first.",
      tradeoff:
        "Slightly more work per transaction in exchange for complete decision auditability.",
    },
    {
      decision: "Encode invariants in Rust newtypes and enums instead of runtime string checks",
      alternatives: "Pass raw primitive integers and string maps through internal functions",
      rationale:
        "Compile-time separation between unvalidated input and verified domain types eliminates entire classes of currency-mixing or negative-amount bugs.",
      tradeoff: "Higher upfront boilerplate at serialization boundaries.",
    },
  ],
  securityAndFailures: [
    {
      threatOrMode: "Out-of-order timestamps distorting rolling velocity windows",
      trustBoundary: "Upstream Event Producer -> Window Store",
      mitigation:
        "Track explicit watermark rules and flag clock-skew anomalies rather than silently discarding events.",
      residualRisk:
        "In-memory prototype state does not survive process restarts without an external WAL/store.",
    },
    {
      threatOrMode: "Arithmetic overflow in cumulative high-value aggregation",
      trustBoundary: "Window Aggregator",
      mitigation:
        "Use `checked_add` / saturating bounds and escalate saturation to an explicit manual-review signal.",
      residualRisk:
        "Rule thresholds themselves depend on accurate policy authoring by domain operators.",
    },
  ],
  implementation: {
    technologies: ["Rust", "Cargo", "Type-Driven Domain Modeling", "Deterministic Unit Testing"],
    ownerContribution:
      "Authored the domain type hierarchy, checked-arithmetic abstractions, composable rule trait design, and decision trace structure.",
    structureNotes:
      "Core library crate kept independent of HTTP or database crates to maximize testability.",
  },
  validation: [
    {
      method: "Cargo unit tests on rule precedence and arithmetic edge cases",
      status: "Local synthetic test cases",
      scopeAndResult:
        "Tested overflow handling, mixed-currency rejection, and multi-rule aggregation; latency benchmarks have not yet been published.",
    },
  ],
  limitations: [
    "In-memory window tracking only; durable distributed state and idempotency keys across replicas are not yet implemented.",
    "No verified throughput/latency benchmark suite published yet.",
    "Sanction/watchlist matching is modeled structurally rather than integrated with live regulatory lists.",
  ],
  nextSteps: [
    "Add Criterion microbenchmarks and publish reproducible measurement methodology.",
    "Implement durable append-only event log persistence and idempotency deduplication.",
    "Clean up and publish the Rust crate on GitHub once documentation and tests are reviewed.",
  ],
  links: [
    {
      label: "GitHub: financial-transaction-risk-mlp",
      url: "https://github.com/waqas-cpu/financial-transaction-risk-mlp",
      kind: "github",
      approved: true,
    },
    {
      label: "GitHub: Financial-order-matching-engine-",
      url: "https://github.com/waqas-cpu/Financial-order-matching-engine-",
      kind: "github",
      approved: true,
    },
    {
      label: "GitHub: Compute-token",
      url: "https://github.com/waqas-cpu/Compute-token",
      kind: "github",
      approved: true,
    },
  ],
};
