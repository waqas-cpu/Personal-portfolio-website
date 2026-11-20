import type { PortfolioProject } from "@/lib/schemas";

export const distributedSystemsSimulatorProject: PortfolioProject = {
  slug: "distributed-systems-simulator",
  title: "Discrete-Event Distributed Systems Simulator",
  summary:
    "In-process deterministic simulation environment modeling network latency, message reordering, packet drops, and node partitions to inspect protocol behavior.",
  domains: ["Systems Engineering", "Distributed Systems"],
  status: "research",
  visibility: "published",
  ownerApproved: true,
  featured: true,
  lastUpdated: "2026-11-20",
  publicationNotice:
    "Simulation boundary: Models multi-node message passing, partitions, and clocks deterministically inside a single controlled simulation process—not a production distributed runtime.",
  overview:
    "A research and learning simulator built to make distributed failure modes observable and reproducible by replacing wall-clock time and real sockets with a seeded discrete-event queue.",
  problemContext:
    "Distributed systems bugs—such as split-brain assumptions, non-idempotent retries, and clock-drift timeouts—often appear intermittently on real networks and resist conventional unit tests. Deterministic simulation lets an engineer replay exact fault sequences from a single seed.",
  scopeAndStatus: {
    implemented: [
      "Seeded discrete-event scheduler ordering message delivery, node ticks, and fault injection deterministically",
      "Simulated network model supporting configurable delay distributions, message drops, duplication, and partition matrices",
      "Structured event trace log capturing send/receive causality across virtual nodes",
    ],
    prototypeOrPlanned: [
      "Expanded invariant checker for linearizability or quorum-intersection assertions across more protocols",
      "Visual timeline scrubber exporting trace JSON for post-mortem inspection",
    ],
    statusRationale:
      "Marked Research because the simulator is a deterministic experimental environment for exploring protocol failure modes rather than an operational infrastructure service.",
  },
  constraints: [
    {
      category: "Determinism",
      detail:
        "Given identical initial state and PRNG seed, two simulation runs must produce byte-for-byte identical event histories.",
    },
    {
      category: "Observability",
      detail:
        "Every dropped message, timeout expiration, and state transition must emit structured trace events without altering timing behavior.",
    },
    {
      category: "Realism Boundaries",
      detail:
        "Virtual nodes must not share hidden global memory; communication is strictly restricted to serialized messages across the simulated network.",
    },
  ],
  systemModel: {
    actors: [
      "Scenario Author (defines node topology, protocol handlers, and fault schedule)",
      "Virtual Nodes (isolated state machines reacting to timers and messages)",
      "Invariant Observer (inspects global virtual state for safety violations)",
    ],
    components: [
      "Deterministic Priority-Queue Event Scheduler",
      "Seeded Fault-Injecting Network Fabric",
      "Isolated Virtual Node Actors & Logical Timers",
      "Causality Trace Logger & Invariant Verifier",
    ],
    boundaries: [
      "Simulation Harness Boundary: owns virtual clock and seeded randomness",
      "Node Isolation Boundary: nodes interact solely through message queues, never direct method calls",
      "Reality Boundary: abstracts OS scheduling pauses, disk corruption, and real TCP congestion dynamics unless explicitly modeled",
    ],
    dependencies: [
      "Deterministic PRNG seeded per run",
      "Discrete priority queue and structured trace serialization",
    ],
  },
  architecture: {
    summary:
      "An event-driven simulation loop where a single global virtual clock steps from event to event, mediating every message and timer through a fault-injecting network layer.",
    diagramId: "distributed-systems-simulator",
    diagramCaption:
      "Deterministic single-process simulation boundary isolating virtual nodes behind a seeded fault-injecting fabric.",
    diagramTextAlternative:
      "A Scenario Config and Seed initialize the Discrete-Event Scheduler. Control flow pops the earliest scheduled event and dispatches it either as a Timer tick to a Virtual Node or as a Message passing through the Fault-Injecting Network (which applies latency, drops, duplicates, or partitions). Node outputs enqueue new future events, while an Observer reads immutable trace logs to check safety invariants.",
    layers: [
      {
        name: "Event Queue & Virtual Clock",
        responsibility:
          "Advances logical simulation time to the next scheduled timestamp without wall-clock sleeps.",
      },
      {
        name: "Fault-Injecting Network Model",
        responsibility:
          "Applies partition rules, packet loss probabilities, jitter, and duplicate delivery deterministically.",
      },
      {
        name: "Virtual Node State Machines",
        responsibility:
          "Processes incoming messages and timers strictly via deterministic handlers.",
      },
      {
        name: "Trace & Invariant Checker",
        responsibility:
          "Records causal step logs and evaluates safety assertions after each transition.",
      },
    ],
  },
  dataFlow: [
    {
      stage: "1. Scenario Initialization",
      description:
        "Seed, topology, and initial client workload events populate the discrete priority queue.",
    },
    {
      stage: "2. Message Dispatch",
      description:
        "Outbound messages from a node enter the network fabric, where latency and partition policies determine delivery timestamp or drop.",
    },
    {
      stage: "3. Trace Recording",
      description:
        "Every state transition and network fault writes an immutable simulation event record.",
    },
  ],
  controlFlow: [
    {
      stage: "1. Monotonic Event Pop",
      description:
        "Scheduler pops the lowest-timestamp event; ties are broken deterministically via sequence ID.",
    },
    {
      stage: "2. Fault Interception",
      description:
        "Network policy drops, delays, or duplicates packets according to active partition state before enqueueing receive events.",
    },
    {
      stage: "3. Post-Step Assertion",
      description:
        "Invariant observer checks protocol guarantees after state updates and halts immediately with the reproducing seed if violated.",
    },
  ],
  decisions: [
    {
      decision: "Single-threaded discrete-event loop over multi-process OS containers",
      alternatives: "Run Docker/network-namespace chaos tests with real timers",
      rationale:
        "OS container tests are non-deterministic and slow to reproduce rare timing windows; seeded discrete simulation gives instant deterministic replay.",
      tradeoff:
        "Does not capture kernel socket buffer quirks, real serialization CPU pressure, or true concurrent race conditions across threads.",
    },
  ],
  securityAndFailures: [
    {
      threatOrMode: "Accidental non-determinism via hash-map iteration order or wall-clock calls",
      trustBoundary: "Node Handler -> Simulation Harness",
      mitigation:
        "Ban direct system clock/randomness calls inside node handlers and enforce deterministic ordered collections.",
      residualRisk:
        "Any external library call inside a node handler that reads system entropy can break replay.",
    },
    {
      threatOrMode: "False confidence from simplified network assumptions",
      trustBoundary: "Simulation Model <-> Real Production Network",
      mitigation:
        "Document explicitly which real-world failures (e.g., partial disk writes, asymmetric gray failures) are omitted from a given scenario.",
      residualRisk: "Passing a simulation only falsifies bugs within the modeled fault classes.",
    },
  ],
  implementation: {
    technologies: [
      "Systems Simulation",
      "Discrete-Event Scheduling",
      "Fault Injection",
      "State Machines",
    ],
    ownerContribution:
      "Designed the seeded discrete-event harness, partition matrix abstraction, and causal trace output format.",
    structureNotes:
      "Keeps protocol node implementations strictly decoupled from the simulation clock and fault engine.",
  },
  validation: [
    {
      method: "Seed-replay determinism verification",
      status: "Experimental test runs",
      scopeAndResult:
        "Verified repeated runs under identical seeds reproduce exact fault sequences and invariant failure points.",
    },
  ],
  limitations: [
    "Models virtual message passing and logical clocks rather than real socket I/O, disk fsync durability, or Byzantine adversaries.",
    "Not a production distributed system or orchestration tool.",
  ],
  nextSteps: [
    "Add structured trace export compatible with timeline inspection.",
    "Test additional protocol scenarios including idempotent retries and lease-expiration races.",
    "Prepare a clean, documented repository on GitHub for public review.",
  ],
  links: [
    {
      label: "GitHub: Distributed-system-",
      url: "https://github.com/waqas-cpu/Distributed-system-",
      kind: "github",
      approved: true,
    },
    {
      label: "GitHub: Operating-system",
      url: "https://github.com/waqas-cpu/Operating-system",
      kind: "github",
      approved: true,
    },
    {
      label: "GitHub: distributed-ai-networking",
      url: "https://github.com/waqas-cpu/distributed-ai-networking",
      kind: "github",
      approved: true,
    },
  ],
};
