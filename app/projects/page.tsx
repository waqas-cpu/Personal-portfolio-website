import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { GitHubRepoGrid } from "@/components/projects/GitHubRepoGrid";
import { ProjectDirectory } from "@/components/projects/ProjectDirectory";
import { Callout } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  getApprovedGitHubRepos,
  getProfile,
  getVisibleProjects,
  isDraftPreviewEnabled,
} from "@/lib/content";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Projects",
  description:
    "Evidence-led engineering case studies across FinTech, LegalTech, AI, and distributed systems.",
  path: "/projects",
});

export default function ProjectsPage() {
  const projects = getVisibleProjects();
  const githubRepos = getApprovedGitHubRepos();
  const draftPreview = isDraftPreviewEnabled();
  const profile = getProfile();

  return (
    <Container className="py-12 sm:py-16">
      <header className="max-w-3xl space-y-3 border-b border-border pb-8">
        <p className="font-mono text-xs uppercase tracking-wider text-accent">
          01 / Evidence Index
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Projects &amp; Engineering Case Studies
        </h1>
        <p className="text-base leading-relaxed text-ink-secondary">
          Architecture case studies documenting system boundaries, design trade-offs, verification
          status, and technical constraints across FinTech, LegalTech, AI, and distributed systems.
        </p>
      </header>

      <div className="mt-8">
        {projects.length > 0 ? (
          <ProjectDirectory projects={projects} showDraftBadge={draftPreview} />
        ) : (
          <Callout title="No Publicly Published Case Studies Yet">
            <p>
              All candidate case studies remain gated behind owner publication approval. Once{" "}
              {profile.displayName} confirms exact project statuses, claims, and allowlisted
              repository URLs, approved case studies will appear here automatically. Meanwhile,
              visit{" "}
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-accent underline underline-offset-2 hover:text-accent-hover"
              >
                GitHub (@{profile.githubHandle})
              </a>{" "}
              or review{" "}
              <Link
                href="/now"
                className="font-medium text-accent underline underline-offset-2 hover:text-accent-hover"
              >
                current exploration areas
              </Link>
              .
            </p>
          </Callout>
        )}
      </div>

      <section
        id="github-repositories"
        aria-labelledby="github-repositories-heading"
        className="mt-16 border-t border-border pt-12"
      >
        <SectionHeader
          index="02"
          title="Important GitHub Repositories"
          headingId="github-repositories-heading"
          description="Allowlisted repositories from github.com/waqas-cpu with verified repository descriptions, technical highlights, and primary languages."
        />

        <GitHubRepoGrid repositories={githubRepos} />

        <div className="mt-8 flex justify-start">
          <a
            href={`${profile.githubUrl}?tab=repositories`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-border-strong bg-surface px-4 py-2.5 font-mono text-xs font-medium text-ink transition-colors hover:border-accent hover:text-accent"
          >
            <span>Browse all repositories on GitHub (@{profile.githubHandle})</span>
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sr-only">(opens in new tab)</span>
          </a>
        </div>
      </section>
    </Container>
  );
}
