"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import type { PortfolioProject } from "@/lib/schemas";
import { cn } from "@/lib/utils";

interface ProjectDirectoryProps {
  projects: PortfolioProject[];
  showDraftBadge: boolean;
}

export function ProjectDirectory({ projects, showDraftBadge }: ProjectDirectoryProps) {
  const [selectedDomain, setSelectedDomain] = useState<string>("All");

  const domains = useMemo(() => {
    const unique = new Set<string>();
    for (const project of projects) {
      for (const domain of project.domains) {
        unique.add(domain);
      }
    }
    return ["All", ...Array.from(unique)];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (selectedDomain === "All") {
      return projects;
    }
    return projects.filter((project) => project.domains.includes(selectedDomain));
  }, [projects, selectedDomain]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div role="group" aria-label="Filter projects by domain" className="flex flex-wrap gap-2">
          {domains.map((domain) => {
            const active = selectedDomain === domain;
            return (
              <button
                key={domain}
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedDomain(domain)}
                className={cn(
                  "min-h-10 rounded-sm border px-3 py-1.5 font-mono text-xs transition-colors",
                  active
                    ? "border-accent bg-accent text-white"
                    : "border-border-strong bg-surface text-ink-secondary hover:border-accent hover:text-ink"
                )}
              >
                {domain}
              </button>
            );
          })}
        </div>

        <p aria-live="polite" className="font-mono text-xs text-ink-muted">
          Showing {filteredProjects.length} of {projects.length}{" "}
          {projects.length === 1 ? "project" : "projects"}
        </p>
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} showDraftBadge={showDraftBadge} />
          ))}
        </div>
      ) : (
        <div className="rounded-sm border border-border bg-surface p-8 text-center text-sm text-ink-secondary">
          No projects match the selected domain filter.
        </div>
      )}
    </div>
  );
}
