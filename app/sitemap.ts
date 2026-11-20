import type { MetadataRoute } from "next";
import { getPublicProjects } from "@/lib/content";
import { getMetadataBase } from "@/lib/metadata";

/**
 * Generates sitemap.xml strictly from public core routes and explicitly
 * owner-approved published projects. Drafts are never listed.
 * Production builds should set NEXT_PUBLIC_SITE_URL once the domain is confirmed.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getMetadataBase().origin;
  const staticRoutes = ["", "/projects", "/about", "/now", "/contact"];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route || "/"}`,
    changeFrequency: route === "/now" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));

  const projectEntries: MetadataRoute.Sitemap = getPublicProjects().map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: project.lastUpdated,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...projectEntries];
}
