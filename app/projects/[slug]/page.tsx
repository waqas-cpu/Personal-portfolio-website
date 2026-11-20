import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyTemplate } from "@/components/projects/CaseStudyTemplate";
import { getPublicProjects, getVisibleProjectBySlug, isDraftPreviewEnabled } from "@/lib/content";
import { buildPageMetadata } from "@/lib/metadata";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams(): Array<{ slug: string }> {
  return getPublicProjects().map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getVisibleProjectBySlug(slug);
  if (!project) {
    return {
      title: "Case Study Not Found",
      description: "The requested project case study is not publicly available.",
    };
  }
  return buildPageMetadata({
    title: project.title,
    description: project.summary,
    path: `/projects/${project.slug}`,
  });
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getVisibleProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return <CaseStudyTemplate project={project} showDraftBadge={isDraftPreviewEnabled()} />;
}
