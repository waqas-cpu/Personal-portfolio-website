import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-sans/700.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { DraftPreviewBanner } from "@/components/navigation/DraftPreviewBanner";
import { SiteHeader } from "@/components/navigation/SiteHeader";
import { getProfile } from "@/lib/content";
import { getConfiguredSiteUrl, getMetadataBase } from "@/lib/metadata";

const profile = getProfile();
const configuredUrl = getConfiguredSiteUrl();

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: `${profile.displayName} — ${profile.workingTitle}`,
    template: `%s · ${profile.displayName}`,
  },
  description: profile.hero.supportingCopy,
  ...(configuredUrl ? { alternates: { canonical: configuredUrl } } : {}),
  openGraph: {
    title: `${profile.displayName} — ${profile.workingTitle}`,
    description: profile.hero.supportingCopy,
    type: "website",
    siteName: `${profile.displayName} — Engineering Portfolio`,
    ...(configuredUrl ? { url: configuredUrl } : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.displayName} — ${profile.workingTitle}`,
    description: profile.hero.supportingCopy,
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-canvas text-ink">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <DraftPreviewBanner />
        <SiteHeader />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
