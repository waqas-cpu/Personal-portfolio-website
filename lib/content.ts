import { focusAreasContent } from "@/content/focus-areas";
import { githubRepositoriesContent } from "@/content/github-projects";
import { nowContent } from "@/content/now";
import { profileContent } from "@/content/profile";
import { allProjects } from "@/content/projects";
import {
  FocusAreaSchema,
  GitHubRepositorySchema,
  NowContentSchema,
  PortfolioProjectSchema,
  ProfileSchema,
  type ContactChannel,
  type FocusArea,
  type GitHubRepository,
  type NowContent,
  type PortfolioProject,
  type ProfileContent,
  type ProjectLink,
  type ProjectStatus,
} from "@/lib/schemas";
import { z } from "zod";

export interface ContentGateOptions {
  nodeEnv?: string;
  strictPublic?: string;
}

export const PROJECT_STATUS_META: Record<
  ProjectStatus,
  { label: string; summary: string; marker: "square" | "half" | "ring" | "triangle" | "dashed" }
> = {
  built: {
    label: "Built",
    summary: "Implemented and verified against documented checks.",
    marker: "square",
  },
  "in-progress": {
    label: "In progress",
    summary: "Core architecture and modules actively under implementation.",
    marker: "half",
  },
  research: {
    label: "Research",
    summary: "Experimental model, simulation, or architectural investigation.",
    marker: "ring",
  },
  learning: {
    label: "Learning",
    summary: "Focused study project prioritizing systems comprehension.",
    marker: "triangle",
  },
  proposed: {
    label: "Proposed",
    summary: "Structured design and evaluation plan awaiting implementation.",
    marker: "dashed",
  },
};

function validateContent(): {
  profile: ProfileContent;
  focusAreas: FocusArea[];
  now: NowContent;
  projects: PortfolioProject[];
  githubRepositories: GitHubRepository[];
} {
  const profile = ProfileSchema.parse(profileContent);
  const focusAreas = z.array(FocusAreaSchema).min(1).parse(focusAreasContent);
  const now = NowContentSchema.parse(nowContent);
  const projects = z.array(PortfolioProjectSchema).parse(allProjects);
  const githubRepositories = z.array(GitHubRepositorySchema).parse(githubRepositoriesContent);

  const slugs = new Set<string>();
  for (const project of projects) {
    if (slugs.has(project.slug)) {
      throw new Error(`Duplicate project slug detected: "${project.slug}"`);
    }
    slugs.add(project.slug);
  }

  const repoSlugs = new Set<string>();
  for (const repo of githubRepositories) {
    if (repoSlugs.has(repo.slug)) {
      throw new Error(`Duplicate repository slug detected: "${repo.slug}"`);
    }
    repoSlugs.add(repo.slug);
  }

  return { profile, focusAreas, now, projects, githubRepositories };
}

const validatedContent = validateContent();

/**
 * Draft previews are strictly forbidden in production builds/runtimes.
 * In development, draft content and placeholders render with explicit badges
 * unless PORTFOLIO_STRICT_PUBLIC="true" is set to simulate production output.
 */
export function isDraftPreviewEnabled(options?: ContentGateOptions): boolean {
  const nodeEnv = options?.nodeEnv ?? process.env.NODE_ENV;
  if (nodeEnv === "production") {
    return false;
  }
  const strictPublic = options?.strictPublic ?? process.env.PORTFOLIO_STRICT_PUBLIC;
  return strictPublic !== "true";
}

/**
 * Publication gate: a project is public ONLY when explicitly marked
 * visibility === "published" AND ownerApproved === true.
 */
export function isProjectPublic(project: PortfolioProject): boolean {
  return project.visibility === "published" && project.ownerApproved === true;
}

/**
 * Link allowlist gate: only approved https:// links may render publicly.
 */
export function getApprovedLinks(project: PortfolioProject): ProjectLink[] {
  return project.links.filter((link) => link.approved === true && link.url.startsWith("https://"));
}

/**
 * Returns strictly public, owner-approved projects.
 * Used for production rendering, generateStaticParams, and sitemap.xml.
 */
export function getPublicProjects(): PortfolioProject[] {
  return validatedContent.projects.filter(isProjectPublic);
}

/**
 * Returns projects visible to the current runtime mode.
 * Production always returns getPublicProjects().
 */
export function getVisibleProjects(options?: ContentGateOptions): PortfolioProject[] {
  if (isDraftPreviewEnabled(options)) {
    return validatedContent.projects;
  }
  return getPublicProjects();
}

export function getFeaturedVisibleProjects(options?: ContentGateOptions): PortfolioProject[] {
  return getVisibleProjects(options).filter((project) => project.featured);
}

export function getVisibleProjectBySlug(
  slug: string,
  options?: ContentGateOptions
): PortfolioProject | null {
  const project = validatedContent.projects.find((item) => item.slug === slug);
  if (!project) {
    return null;
  }
  if (!isProjectPublic(project) && !isDraftPreviewEnabled(options)) {
    return null;
  }
  return project;
}

export function getProfile(): ProfileContent {
  return validatedContent.profile;
}

export function getFocusAreas(): FocusArea[] {
  return validatedContent.focusAreas;
}

export function getNowContent(): NowContent {
  return validatedContent.now;
}

export function getPublicContactChannels(): ContactChannel[] {
  return validatedContent.profile.contact.channels.filter(
    (channel) => channel.approved === true && Boolean(channel.href)
  );
}

export function getVisibleContactChannels(options?: ContentGateOptions): ContactChannel[] {
  if (isDraftPreviewEnabled(options)) {
    return validatedContent.profile.contact.channels;
  }
  return getPublicContactChannels();
}

export function getApprovedGitHubRepos(): GitHubRepository[] {
  return validatedContent.githubRepositories.filter((repo) => repo.approved === true);
}

export function getFeaturedGitHubRepos(): GitHubRepository[] {
  return getApprovedGitHubRepos().filter((repo) => repo.featured);
}
