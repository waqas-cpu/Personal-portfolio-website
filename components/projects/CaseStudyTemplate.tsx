import Link from "next/link";
import { ArrowLeft, ArrowUpRight, FileText, Film, Globe, TerminalSquare } from "lucide-react";
import { ArchitectureDiagram } from "@/components/diagrams/ArchitectureDiagram";
import { Callout } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";
import { DraftBadge, StatusBadge } from "@/components/ui/StatusBadge";
import { getApprovedLinks, PROJECT_STATUS_META } from "@/lib/content";
import type { PortfolioProject, ProjectLink } from "@/lib/schemas";
import { formatIsoDate } from "@/lib/utils";

interface CaseStudyTemplateProps {
  project: PortfolioProject;
  showDraftBadge: boolean;
}

const CASE_STUDY_SECTIONS = [
  { id: "overview", label: "01 Overview" },
  { id: "problem-context", label: "02 Problem Context" },
  { id: "scope-status", label: "03 Scope & Status" },
  { id: "constraints", label: "04 Constraints" },
  { id: "system-model", label: "05 System Model" },
  { id: "architecture", label: "06 Architecture" },
  { id: "data-control-flow", label: "07–08 Data & Control" },
  { id: "decisions", label: "09 Decisions" },
  { id: "security-failures", label: "10 Security & Failures" },
  { id: "implementation", label: "11 Implementation" },
  { id: "validation", label: "12 Validation" },
  { id: "limitations-next", label: "13 Limitations & Next" },
  { id: "evidence-links", label: "14 Evidence Links" },
] as const;

function LinkIcon({ kind }: { kind: ProjectLink["kind"] }) {
  switch (kind) {
    case "github":
      return <TerminalSquare className="h-4 w-4 text-accent" aria-hidden="true" />;
    case "demo":
      return <Globe className="h-4 w-4 text-accent" aria-hidden="true" />;
    case "video":
      return <Film className="h-4 w-4 text-accent" aria-hidden="true" />;
    default:
      return <FileText className="h-4 w-4 text-accent" aria-hidden="true" />;
  }
}

export function CaseStudyTemplate({ project, showDraftBadge }: CaseStudyTemplateProps) {
  const approvedLinks = getApprovedLinks(project);
  const statusMeta = PROJECT_STATUS_META[project.status];

  return (
    <Container className="py-10 sm:py-14">
      <div className="mb-8">
        <Link
          href="/projects"
          className="inline-flex min-h-10 items-center gap-1.5 font-mono text-xs text-ink-secondary transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Back to all projects</span>
        </Link>
      </div>

      <header className="space-y-5 border-b border-border pb-8">
        <div className="flex flex-wrap items-center gap-2.5">
          <StatusBadge status={project.status} />
          {showDraftBadge ? (
            <DraftBadge visibility={project.visibility} ownerApproved={project.ownerApproved} />
          ) : null}
          <span className="font-mono text-xs text-ink-muted">
            Last updated:{" "}
            <time dateTime={project.lastUpdated}>{formatIsoDate(project.lastUpdated)}</time>
          </span>
        </div>

        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {project.title}
        </h1>

        <p className="max-w-3xl text-base leading-relaxed text-ink-secondary sm:text-lg">
          {project.summary}
        </p>

        <ul className="flex flex-wrap gap-2" aria-label="Project domains">
          {project.domains.map((domain) => (
            <li
              key={domain}
              className="rounded-sm border border-border bg-surface px-2.5 py-1 font-mono text-xs text-ink-secondary"
            >
              {domain}
            </li>
          ))}
        </ul>

        {project.publicationNotice ? (
          <Callout title="Scope & Boundary Notice" variant="caution" className="mt-4">
            <p>{project.publicationNotice}</p>
          </Callout>
        ) : null}
      </header>

      <div className="mt-10 grid grid-cols-1 gap-12 xl:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="hidden xl:block">
          <nav aria-label="Case study sections" className="sticky top-8 space-y-2">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
              Case Study Index
            </p>
            <ol className="space-y-1 border-l border-border pl-3">
              {CASE_STUDY_SECTIONS.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="block py-1 font-mono text-xs text-ink-secondary transition-colors hover:text-accent"
                  >
                    {section.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <article className="min-w-0 space-y-12">
          {/* 01 Overview */}
          <section
            id="overview"
            aria-labelledby="heading-overview"
            className="scroll-mt-8 space-y-3"
          >
            <h2
              id="heading-overview"
              className="font-mono text-xs font-semibold uppercase tracking-wider text-accent"
            >
              01 / Overview
            </h2>
            <p className="text-base leading-relaxed text-ink">{project.overview}</p>
          </section>

          {/* 02 Problem Context */}
          <section
            id="problem-context"
            aria-labelledby="heading-problem"
            className="scroll-mt-8 space-y-3 border-t border-border pt-8"
          >
            <h2
              id="heading-problem"
              className="font-mono text-xs font-semibold uppercase tracking-wider text-accent"
            >
              02 / Problem Context
            </h2>
            <p className="text-sm leading-relaxed text-ink-secondary sm:text-base">
              {project.problemContext}
            </p>
          </section>

          {/* 03 Scope & Status */}
          <section
            id="scope-status"
            aria-labelledby="heading-scope"
            className="scroll-mt-8 space-y-4 border-t border-border pt-8"
          >
            <h2
              id="heading-scope"
              className="font-mono text-xs font-semibold uppercase tracking-wider text-accent"
            >
              03 / Scope &amp; Status ({statusMeta.label})
            </h2>
            <p className="text-sm leading-relaxed text-ink-secondary">
              {project.scopeAndStatus.statusRationale}
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-sm border border-border bg-surface p-5">
                <h3 className="mb-3 font-mono text-xs font-semibold uppercase tracking-wide text-ink">
                  Designed or Implemented
                </h3>
                <ul className="space-y-2 text-sm text-ink-secondary">
                  {project.scopeAndStatus.implemented.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-sm border border-border bg-subtle/70 p-5">
                <h3 className="mb-3 font-mono text-xs font-semibold uppercase tracking-wide text-ink">
                  Prototype Boundaries / Planned
                </h3>
                <ul className="space-y-2 text-sm text-ink-secondary">
                  {project.scopeAndStatus.prototypeOrPlanned.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink-muted"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* 04 Constraints */}
          <section
            id="constraints"
            aria-labelledby="heading-constraints"
            className="scroll-mt-8 space-y-4 border-t border-border pt-8"
          >
            <h2
              id="heading-constraints"
              className="font-mono text-xs font-semibold uppercase tracking-wider text-accent"
            >
              04 / Constraints
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {project.constraints.map((constraint) => (
                <div
                  key={constraint.category}
                  className="rounded-sm border border-border bg-surface p-4"
                >
                  <h3 className="font-mono text-xs font-semibold text-ink">
                    {constraint.category}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                    {constraint.detail}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 05 System Model */}
          <section
            id="system-model"
            aria-labelledby="heading-model"
            className="scroll-mt-8 space-y-4 border-t border-border pt-8"
          >
            <h2
              id="heading-model"
              className="font-mono text-xs font-semibold uppercase tracking-wider text-accent"
            >
              05 / System Model
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-sm border border-border bg-surface p-5">
                <h3 className="mb-2.5 font-mono text-xs font-semibold uppercase tracking-wide text-ink">
                  Actors
                </h3>
                <ul className="space-y-1.5 text-sm text-ink-secondary">
                  {project.systemModel.actors.map((actor) => (
                    <li key={actor}>• {actor}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-sm border border-border bg-surface p-5">
                <h3 className="mb-2.5 font-mono text-xs font-semibold uppercase tracking-wide text-ink">
                  Core Components
                </h3>
                <ul className="space-y-1.5 text-sm text-ink-secondary">
                  {project.systemModel.components.map((component) => (
                    <li key={component}>• {component}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-sm border border-border bg-surface p-5">
                <h3 className="mb-2.5 font-mono text-xs font-semibold uppercase tracking-wide text-ink">
                  Trust &amp; Scope Boundaries
                </h3>
                <ul className="space-y-1.5 text-sm text-ink-secondary">
                  {project.systemModel.boundaries.map((boundary) => (
                    <li key={boundary}>• {boundary}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-sm border border-border bg-surface p-5">
                <h3 className="mb-2.5 font-mono text-xs font-semibold uppercase tracking-wide text-ink">
                  Dependencies
                </h3>
                <ul className="space-y-1.5 text-sm text-ink-secondary">
                  {project.systemModel.dependencies.map((dep) => (
                    <li key={dep}>• {dep}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* 06 Architecture */}
          <section
            id="architecture"
            aria-labelledby="heading-architecture"
            className="scroll-mt-8 space-y-5 border-t border-border pt-8"
          >
            <h2
              id="heading-architecture"
              className="font-mono text-xs font-semibold uppercase tracking-wider text-accent"
            >
              06 / Architecture
            </h2>
            <p className="text-sm leading-relaxed text-ink-secondary sm:text-base">
              {project.architecture.summary}
            </p>
            <ArchitectureDiagram
              diagramId={project.architecture.diagramId}
              caption={project.architecture.diagramCaption}
              textAlternative={project.architecture.diagramTextAlternative}
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {project.architecture.layers.map((layer) => (
                <div key={layer.name} className="rounded-sm border border-border bg-surface p-4">
                  <h3 className="text-sm font-semibold text-ink">{layer.name}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-secondary">
                    {layer.responsibility}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 07 Data Flow & 08 Control Flow */}
          <section
            id="data-control-flow"
            aria-labelledby="heading-flows"
            className="scroll-mt-8 space-y-5 border-t border-border pt-8"
          >
            <h2
              id="heading-flows"
              className="font-mono text-xs font-semibold uppercase tracking-wider text-accent"
            >
              07–08 / Data Flow &amp; Control Flow
            </h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="rounded-sm border border-border bg-surface p-5">
                <h3 className="mb-4 border-b border-border pb-2 font-mono text-xs font-semibold uppercase tracking-wide text-accent">
                  07 · Data Flow (Inputs → Persistence)
                </h3>
                <ol className="space-y-4">
                  {project.dataFlow.map((step) => (
                    <li key={step.stage} className="space-y-1">
                      <p className="font-mono text-xs font-semibold text-ink">{step.stage}</p>
                      <p className="text-sm leading-relaxed text-ink-secondary">
                        {step.description}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="rounded-sm border border-border bg-surface p-5">
                <h3 className="mb-4 border-b border-border pb-2 font-mono text-xs font-semibold uppercase tracking-wide text-amber-800">
                  08 · Control Flow (Policies → Transitions)
                </h3>
                <ol className="space-y-4">
                  {project.controlFlow.map((step) => (
                    <li key={step.stage} className="space-y-1">
                      <p className="font-mono text-xs font-semibold text-ink">{step.stage}</p>
                      <p className="text-sm leading-relaxed text-ink-secondary">
                        {step.description}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          {/* 09 Engineering Decisions */}
          <section
            id="decisions"
            aria-labelledby="heading-decisions"
            className="scroll-mt-8 space-y-4 border-t border-border pt-8"
          >
            <h2
              id="heading-decisions"
              className="font-mono text-xs font-semibold uppercase tracking-wider text-accent"
            >
              09 / Key Engineering Decisions
            </h2>
            <div className="space-y-4">
              {project.decisions.map((item) => (
                <div key={item.decision} className="rounded-sm border border-border bg-surface p-5">
                  <h3 className="text-base font-semibold text-ink">{item.decision}</h3>
                  <dl className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                    <div>
                      <dt className="font-mono text-[11px] uppercase tracking-wide text-ink-muted">
                        Alternatives considered
                      </dt>
                      <dd className="mt-1 text-ink-secondary">{item.alternatives}</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[11px] uppercase tracking-wide text-ink-muted">
                        Rationale
                      </dt>
                      <dd className="mt-1 text-ink-secondary">{item.rationale}</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[11px] uppercase tracking-wide text-ink-muted">
                        Trade-off accepted
                      </dt>
                      <dd className="mt-1 text-ink-secondary">{item.tradeoff}</dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>
          </section>

          {/* 10 Security & Failure Analysis */}
          <section
            id="security-failures"
            aria-labelledby="heading-security"
            className="scroll-mt-8 space-y-4 border-t border-border pt-8"
          >
            <h2
              id="heading-security"
              className="font-mono text-xs font-semibold uppercase tracking-wider text-accent"
            >
              10 / Security &amp; Failure Analysis
            </h2>
            <div className="space-y-4">
              {project.securityAndFailures.map((item) => (
                <div
                  key={item.threatOrMode}
                  className="rounded-sm border border-border bg-surface p-5"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-sm font-semibold text-ink">{item.threatOrMode}</h3>
                    <span className="rounded-sm bg-subtle px-2 py-0.5 font-mono text-[11px] text-ink-muted">
                      Boundary: {item.trustBoundary}
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-wide text-ink-muted">
                        Mitigation
                      </p>
                      <p className="mt-1 text-ink-secondary">{item.mitigation}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-wide text-ink-muted">
                        Residual Risk
                      </p>
                      <p className="mt-1 text-ink-secondary">{item.residualRisk}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 11 Implementation */}
          <section
            id="implementation"
            aria-labelledby="heading-implementation"
            className="scroll-mt-8 space-y-4 border-t border-border pt-8"
          >
            <h2
              id="heading-implementation"
              className="font-mono text-xs font-semibold uppercase tracking-wider text-accent"
            >
              11 / Implementation &amp; Contribution
            </h2>
            <div className="rounded-sm border border-border bg-surface p-5 space-y-4">
              <div>
                <h3 className="font-mono text-xs font-semibold uppercase tracking-wide text-ink">
                  Owner Contribution
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-secondary">
                  {project.implementation.ownerContribution}
                </p>
              </div>
              <div>
                <h3 className="font-mono text-xs font-semibold uppercase tracking-wide text-ink">
                  Structural Notes
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-secondary">
                  {project.implementation.structureNotes}
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-mono text-xs font-semibold uppercase tracking-wide text-ink">
                  Technologies &amp; Methods
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {project.implementation.technologies.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-sm border border-border bg-subtle px-2.5 py-1 font-mono text-xs text-ink"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* 12 Validation */}
          <section
            id="validation"
            aria-labelledby="heading-validation"
            className="scroll-mt-8 space-y-4 border-t border-border pt-8"
          >
            <h2
              id="heading-validation"
              className="font-mono text-xs font-semibold uppercase tracking-wider text-accent"
            >
              12 / Validation &amp; Evidence
            </h2>
            <div className="overflow-x-auto rounded-sm border border-border bg-surface">
              <table className="w-full min-w-[540px] border-collapse text-left text-sm">
                <thead className="border-b border-border bg-subtle font-mono text-xs text-ink-muted">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Verification Method
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Verification State
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Observed Scope &amp; Boundaries
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {project.validation.map((entry) => (
                    <tr key={entry.method} className="align-top">
                      <td className="px-4 py-3 font-medium text-ink">{entry.method}</td>
                      <td className="px-4 py-3 font-mono text-xs text-ink-secondary">
                        {entry.status}
                        {entry.date ? ` (${formatIsoDate(entry.date)})` : ""}
                      </td>
                      <td className="px-4 py-3 text-ink-secondary">{entry.scopeAndResult}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 13 Limitations & Next Steps */}
          <section
            id="limitations-next"
            aria-labelledby="heading-limitations"
            className="scroll-mt-8 space-y-4 border-t border-border pt-8"
          >
            <h2
              id="heading-limitations"
              className="font-mono text-xs font-semibold uppercase tracking-wider text-accent"
            >
              13 / Limitations &amp; Next Steps
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-sm border border-border bg-surface p-5">
                <h3 className="mb-3 font-mono text-xs font-semibold uppercase tracking-wide text-ink">
                  Known Limitations &amp; Honest Gaps
                </h3>
                <ul className="space-y-2 text-sm text-ink-secondary">
                  {project.limitations.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-800"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-sm border border-border bg-surface p-5">
                <h3 className="mb-3 font-mono text-xs font-semibold uppercase tracking-wide text-ink">
                  Planned Next Steps
                </h3>
                <ul className="space-y-2 text-sm text-ink-secondary">
                  {project.nextSteps.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* 14 Evidence Links */}
          <section
            id="evidence-links"
            aria-labelledby="heading-evidence"
            className="scroll-mt-8 space-y-4 border-t border-border pt-8"
          >
            <h2
              id="heading-evidence"
              className="font-mono text-xs font-semibold uppercase tracking-wider text-accent"
            >
              14 / Approved Evidence Links
            </h2>
            {approvedLinks.length > 0 ? (
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {approvedLinks.map((link) => (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-12 items-center justify-between rounded-sm border border-border bg-surface px-4 py-3 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
                    >
                      <span className="flex items-center gap-2.5">
                        <LinkIcon kind={link.kind} />
                        <span>{link.label}</span>
                      </span>
                      <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span className="sr-only">(opens in new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-sm border border-dashed border-border-strong bg-subtle/60 p-5 text-sm text-ink-secondary">
                No project-specific external repository or demo links are approved for public
                listing yet. Repositories are published on an explicit allowlist once reviewed and
                verified.
              </div>
            )}
          </section>
        </article>
      </div>
    </Container>
  );
}
