import type { Metadata } from "next";
import { getProfile } from "@/lib/content";

/**
 * Returns the verified canonical base URL only when explicitly configured via
 * NEXT_PUBLIC_SITE_URL with an http(s) scheme. Never invents a public domain.
 */
export function getConfiguredSiteUrl(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) {
    return undefined;
  }
  try {
    const parsed = new URL(raw);
    if (parsed.protocol === "https:" || parsed.protocol === "http:") {
      return parsed.origin;
    }
    return undefined;
  } catch {
    return undefined;
  }
}

export function getMetadataBase(): URL {
  const configured = getConfiguredSiteUrl();
  return new URL(configured ?? "http://localhost:3000");
}

interface BuildPageMetadataInput {
  title: string;
  description: string;
  path: string;
}

export function buildPageMetadata({ title, description, path }: BuildPageMetadataInput): Metadata {
  const profile = getProfile();
  const configuredUrl = getConfiguredSiteUrl();
  const fullTitle = `${title} · ${profile.displayName}`;

  return {
    title,
    description,
    ...(configuredUrl ? { alternates: { canonical: `${configuredUrl}${path}` } } : {}),
    openGraph: {
      title: fullTitle,
      description,
      type: "website",
      siteName: `${profile.displayName} — Engineering Portfolio`,
      ...(configuredUrl ? { url: `${configuredUrl}${path}` } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}
