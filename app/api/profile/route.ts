import { NextResponse } from "next/server";
import { getFocusAreas, getNowContent, getProfile, getPublicContactChannels } from "@/lib/content";

export function GET() {
  const profile = getProfile();
  const focusAreas = getFocusAreas();
  const now = getNowContent();
  const contactChannels = getPublicContactChannels().map((channel) => ({
    id: channel.id,
    label: channel.label,
    kind: channel.kind,
    value: channel.value,
    href: channel.href,
    note: channel.note,
  }));

  return NextResponse.json(
    {
      displayName: profile.displayName,
      workingTitle: profile.workingTitle,
      githubUrl: profile.githubUrl,
      githubHandle: profile.githubHandle,
      hero: {
        eyebrow: profile.hero.eyebrow,
        headline: profile.hero.headline,
        supportingCopy: profile.hero.supportingCopy,
      },
      focusAreas,
      now,
      contactChannels,
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
        "X-Content-Type-Options": "nosniff",
      },
    }
  );
}
