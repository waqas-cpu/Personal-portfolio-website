import Link from "next/link";
import { ArrowRight, ArrowUpRight, GitBranch } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { GitHubRepository } from "@/lib/schemas";
import { formatIsoDate } from "@/lib/utils";

interface GitHubRepoGridProps {
  repositories: GitHubRepository[];
  showCaseStudyLink?: boolean;
}

export function GitHubRepoGrid({ repositories, showCaseStudyLink = true }: GitHubRepoGridProps) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {repositories.map((repo) => (
        <article
          key={repo.slug}
          className="flex h-full flex-col justify-between rounded-sm border border-border bg-surface p-6 transition-colors hover:border-border-strong"
        >
          <div className="space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={repo.status} />
                <span className="rounded-sm border border-border bg-subtle px-2 py-0.5 font-mono text-[11px] font-medium text-ink-secondary">
                  {repo.language}
                </span>
              </div>
              <time dateTime={repo.updatedAt} className="font-mono text-xs text-ink-muted">
                Pushed {formatIsoDate(repo.updatedAt)}
              </time>
            </div>

            <div className="space-y-2">
              <h3 className="flex items-center gap-2 font-mono text-base font-semibold tracking-tight text-ink">
                <GitBranch className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all transition-colors hover:text-accent"
                >
                  {repo.name}
                  <span className="sr-only"> (opens GitHub repository in new tab)</span>
                </a>
              </h3>
              <p className="text-sm leading-relaxed text-ink-secondary">{repo.description}</p>
            </div>

            <ul className="space-y-1.5 pt-1 text-xs leading-relaxed text-ink-secondary">
              {repo.highlights.map((item) => (
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

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <ul className="flex flex-wrap gap-1.5" aria-label={`${repo.name} domains`}>
              {repo.domains.map((domain) => (
                <li
                  key={domain}
                  className="rounded-sm bg-subtle px-2 py-0.5 font-mono text-[11px] text-ink-secondary"
                >
                  {domain}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center gap-3">
              {showCaseStudyLink && repo.relatedCaseStudySlug ? (
                <Link
                  href={`/projects/${repo.relatedCaseStudySlug}`}
                  className="inline-flex min-h-9 items-center gap-1 font-mono text-xs font-medium text-ink-secondary transition-colors hover:text-accent"
                >
                  <span>Case study</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              ) : null}

              <a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-9 items-center gap-1 font-mono text-xs font-medium text-accent transition-colors hover:text-accent-hover"
              >
                <span>GitHub repo</span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="sr-only">(opens in new tab)</span>
              </a>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
