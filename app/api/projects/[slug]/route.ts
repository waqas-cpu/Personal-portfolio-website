import { NextResponse } from "next/server";
import { getApprovedLinks, getVisibleProjectBySlug, isDraftPreviewEnabled } from "@/lib/content";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const project = getVisibleProjectBySlug(slug);

  if (!project) {
    return NextResponse.json(
      { error: "Project not found" },
      {
        status: 404,
        headers: {
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
        },
      }
    );
  }

  const previewMode = isDraftPreviewEnabled();

  return NextResponse.json(
    {
      previewMode,
      project: {
        ...project,
        links: getApprovedLinks(project),
      },
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
