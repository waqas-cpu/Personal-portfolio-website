import type { MetadataRoute } from "next";
import { getConfiguredSiteUrl } from "@/lib/metadata";

export default function robots(): MetadataRoute.Robots {
  const configuredUrl = getConfiguredSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    ...(configuredUrl ? { sitemap: `${configuredUrl}/sitemap.xml` } : {}),
  };
}
