import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DraftBadge, StatusBadge } from "@/components/ui/StatusBadge";
import type { PortfolioProject } from "@/lib/schemas";
import { formatIsoDate } from "@/lib/utils";

interface ProjectCardProps {
  project: PortfolioProject;
  showDraftBadge?: boolean;
}

export function ProjectCard({ project, showDraftBadge = false }: ProjectCardProps) {
  return (
    <article className="group flex h-full flex-col justify-between rounded-sm border border-border bg-surface p-6 transition-colors hover:border-border-strong">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={project.status} />
            {showDraftBadge ? (
              <DraftBadge visibility={project.visibility} ownerApproved={project.ownerApproved} />
            ) : null}
          </div>
          <time dateTime={project.lastUpdated} className="font-mono text-xs text-ink-muted">
            Updated {formatIsoDate(project.lastUpdated)}
          </time>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold tracking-tight text-ink">
            <Link
              href={`/projects/${project.slug}`}
              className="transition-colors hover:text-accent"
            >
              {project.title}
            </Link>
          </h3>
          <p className="text-sm leading-relaxed text-ink-secondary">{project.summary}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <ul className="flex flex-wrap gap-1.5" aria-label="Domains">
          {project.domains.map((domain) => (
            <li
              key={domain}
              className="rounded-sm bg-subtle px-2 py-0.5 font-mono text-[11px] text-ink-secondary"
            >
              {domain}
            </li>
          ))}
        </ul>

        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex min-h-10 items-center gap-1.5 font-mono text-xs font-medium text-accent transition-colors hover:text-accent-hover sm:min-h-0"
        >
          <span>Inspect case study</span>
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  );
}
