import type { ProfileContent } from "@/lib/schemas";

export const profileContent: ProfileContent = {
  displayName: "Waqas",
  // Must be reviewed and confirmed by the owner before public launch.
  displayNameConfirmed: false,
  workingTitle: "FinTech · LegalTech · AI & Systems Engineering",
  githubUrl: "https://github.com/waqas-cpu",
  githubHandle: "waqas-cpu",
  portrait: {
    src: "/images/waqas-portrait.webp",
    width: 512,
    height: 512,
    alt: "Portrait of Waqas",
  },
  logo: {
    src: "/images/ws-logo.webp",
    width: 256,
    height: 256,
    alt: "Waqas Sial WS monogram logo",
  },
  hero: {
    eyebrow: "FinTech · LegalTech · AI & Systems Engineering",
    headline: "Building at the intersection of FinTech, LegalTech, AI, and systems engineering.",
    supportingCopy:
      "I explore how data, intelligent software, distributed infrastructure, and legal/compliance requirements can work together to solve trust-sensitive problems.",
    primaryCtaLabel: "Explore selected work",
    secondaryCtaLabel: "View GitHub",
  },
  systemsThinking: {
    statement:
      "I approach software as a system of interacting components. I start with the problem and constraints, map the data and control flows, consider failure modes and real-world operating limits, then evaluate the architecture against security, reliability, cost, and maintainability.",
    pillars: [
      {
        index: "01",
        title: "Problem & Constraints",
        detail:
          "Identify who relies on the system, what guarantees must hold, and which technical, legal, operational, or hardware limits bound the design.",
      },
      {
        index: "02",
        title: "System Boundaries",
        detail:
          "Separate actors, trusted components, external dependencies, and off-chain or manual legal processes before selecting frameworks or protocols.",
      },
      {
        index: "03",
        title: "Data & Control Flow",
        detail:
          "Trace how inputs enter, get validated, transform, and persist separately from how policy decisions, approvals, and state transitions are enforced.",
      },
      {
        index: "04",
        title: "Failure Modes & Trade-offs",
        detail:
          "Document what breaks under latency, malformed inputs, partial state, or stale rules, and state what remains unverified or out of scope.",
      },
    ],
  },
  about: {
    headline: "Engineering for trust-sensitive and data-intensive systems.",
    intro:
      "I am an emerging engineer and builder researching and prototyping across financial infrastructure, legal and compliance technology, applied AI, and systems engineering.",
    paragraphs: [
      "Trust-sensitive systems rarely fail because of a single isolated algorithm. They break at the seams: where data pipelines meet auditability requirements, where smart contracts assume legal enforceability they cannot supply on their own, or where probabilistic models interact with deterministic compliance rules.",
      "My work focuses on understanding those seams explicitly. Rather than treating finance, law, machine learning, and systems engineering as disconnected tracks, I study how rules, telemetry, identity checks, and software boundaries fit together into inspectable architectures.",
    ],
    intersections: [
      {
        pair: "FinTech + LegalTech",
        explanation:
          "Modeling asset rights, KYC/KYB gating concepts, audit trails, and clear separation between technical ledger state and off-chain legal enforceability.",
      },
      {
        pair: "Data Infrastructure + AI",
        explanation:
          "Structuring layered ingestion and validation pipelines so risk scoring and document intelligence operate on traceable inputs rather than opaque state.",
      },
      {
        pair: "Systems Engineering + Trust",
        explanation:
          "Exploring deterministic state transitions, Rust ownership semantics, failure simulation, and bounded blast radius under partial failures.",
      },
    ],
  },
  contact: {
    headline: "Start a technical conversation.",
    invitation:
      "Open to discussing engineering roles, internships, systems research, and collaborative builds across FinTech, LegalTech, AI, and distributed systems.",
    topics: [
      "Software & systems engineering roles or internships",
      "Financial infrastructure, tokenization architecture, and compliance workflows",
      "Applied AI pipelines, document intelligence, and evaluation methodology",
      "Architecture reviews, simulations, and technical research discussions",
    ],
    channels: [
      {
        id: "github",
        label: "GitHub",
        kind: "github",
        value: "github.com/waqas-cpu",
        href: "https://github.com/waqas-cpu",
        note: "Public profile. Individual project repositories appear on case-study pages only after explicit allowlist approval.",
        approved: true,
      },
      {
        id: "email",
        label: "Direct Email",
        kind: "email",
        note: "Reserved for a confirmed professional email address.",
        approved: false,
        devPlaceholderHint:
          "Dev placeholder: Add a confirmed professional email and mailto: href in content/profile.ts, then set approved: true before public launch.",
      },
      {
        id: "linkedin",
        label: "LinkedIn",
        kind: "linkedin",
        note: "Optional professional profile link.",
        approved: false,
        devPlaceholderHint:
          "Dev placeholder: Add a verified LinkedIn profile URL in content/profile.ts and set approved: true if desired.",
      },
    ],
  },
};
