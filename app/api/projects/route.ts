import { NextResponse } from "next/server";
import {
  getApprovedGitHubRepos,
  getApprovedLinks,
  getVisibleProjects,
  isDraftPreviewEnabled,
} from "@/lib/content";
import { ProjectStatusSchema } from "@/lib/schemas";

export function GET(request: Request) {
  const url = new URL(request.url);
  const domainParam = url.searchParams.get("domain")?.trim();
  const statusParam = url.searchParams.get("status")?.trim();
  const featuredParam = url.searchParams.get("featured")?.trim();

  if (statusParam) {
    const parsedStatus = ProjectStatusSchema.safeParse(statusParam);
    if (!parsedStatus.success) {
      return NextResponse.json(
        {
          error: "Invalid status filter",
          allowedStatuses: ProjectStatusSchema.options,
        },
        {
          status: 400,
          headers: {
            "Cache-Control": "no-store",
            "X-Content-Type-Options": "nosniff",
          },
        }
      );
    }
  }

  let projects = getVisibleProjects();

  if (domainParam) {
    const lowerDomain = domainParam.toLowerCase();
    projects = projects.filter((project) =>
      project.domains.some((domain) => domain.toLowerCase() === lowerDomain)
    );
  }

  if (statusParam) {
    projects = projects.filter((project) => project.status === statusParam);
  }

  if (featuredParam === "true") {
    projects = projects.filter((project) => project.featured);
  } else if (featuredParam === "false") {
    projects = projects.filter((project) => !project.featured);
  }

  const sanitized = projects.map((project) => ({
    ...project,
    links: getApprovedLinks(project),
  }));

  const previewMode = isDraftPreviewEnabled();

  const repositories = getApprovedGitHubRepos();

  return NextResponse.json(
    {
      count: sanitized.length,
      previewMode,
      projects: sanitized,
      repositories,
    },
    {
      status: 200,
      headers: {
        "Cache-Control": previewMode
          ? "no-store"
          : "public, max-age=300, stale-while-revalidate=600",
        "X-Content-Type-Options": "nosniff",
      },
    }
  );
}
