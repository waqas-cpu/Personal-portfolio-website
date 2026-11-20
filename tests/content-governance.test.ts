import { describe, expect, it } from "vitest";
import { allProjects } from "@/content/projects";
import {
  getApprovedGitHubRepos,
  getApprovedLinks,
  getFeaturedGitHubRepos,
  getFocusAreas,
  getNowContent,
  getProfile,
  getPublicContactChannels,
  getPublicProjects,
  getVisibleContactChannels,
  getVisibleProjectBySlug,
  getVisibleProjects,
  isDraftPreviewEnabled,
  isProjectPublic,
} from "@/lib/content";
import { PortfolioProjectSchema } from "@/lib/schemas";

describe("content governance & publication gate", () => {
  it("validates profile, focus areas, now content, and all candidate projects", () => {
    const profile = getProfile();
    const focusAreas = getFocusAreas();
    const now = getNowContent();

    expect(profile.displayName).toBe("Waqas");
    expect(focusAreas.length).toBeGreaterThanOrEqual(4);
    expect(now.items.length).toBeGreaterThanOrEqual(3);
    expect(allProjects.length).toBe(5);

    for (const project of allProjects) {
      expect(() => PortfolioProjectSchema.parse(project)).not.toThrow();
    }
  });

  it("requires BOTH visibility === 'published' AND ownerApproved === true", () => {
    const base = allProjects[0];
    expect(base).toBeDefined();
    if (!base) return;

    expect(isProjectPublic({ ...base, visibility: "draft", ownerApproved: false })).toBe(false);
    expect(isProjectPublic({ ...base, visibility: "draft", ownerApproved: true })).toBe(false);
    expect(isProjectPublic({ ...base, visibility: "approved", ownerApproved: true })).toBe(false);
    expect(isProjectPublic({ ...base, visibility: "published", ownerApproved: false })).toBe(false);
    expect(isProjectPublic({ ...base, visibility: "published", ownerApproved: true })).toBe(true);
  });

  it("never enables draft previews when NODE_ENV === 'production'", () => {
    expect(isDraftPreviewEnabled({ nodeEnv: "production" })).toBe(false);
    expect(isDraftPreviewEnabled({ nodeEnv: "production", strictPublic: "false" })).toBe(false);
    expect(isDraftPreviewEnabled({ nodeEnv: "development" })).toBe(true);
    expect(isDraftPreviewEnabled({ nodeEnv: "development", strictPublic: "true" })).toBe(false);
  });

  it("hides all unapproved/draft projects in production mode", () => {
    const prodProjects = getVisibleProjects({ nodeEnv: "production" });
    expect(prodProjects).toHaveLength(4);
    expect(getPublicProjects()).toHaveLength(4);
    expect(prodProjects.some((p) => p.slug === "financial-document-forensics")).toBe(false);
    expect(
      getVisibleProjectBySlug("financial-document-forensics", { nodeEnv: "production" })
    ).toBeNull();
    expect(
      getVisibleProjectBySlug("real-estate-tokenization", { nodeEnv: "production" })
    ).not.toBeNull();
  });

  it("exposes drafts in development preview unless PORTFOLIO_STRICT_PUBLIC=true", () => {
    const devProjects = getVisibleProjects({ nodeEnv: "development" });
    expect(devProjects.length).toBe(allProjects.length);
    expect(
      getVisibleProjectBySlug("financial-document-forensics", { nodeEnv: "development" })
    ).not.toBeNull();

    const strictDevProjects = getVisibleProjects({
      nodeEnv: "development",
      strictPublic: "true",
    });
    expect(strictDevProjects).toHaveLength(4);
    expect(strictDevProjects.some((p) => p.slug === "financial-document-forensics")).toBe(false);
  });

  it("returns only approved GitHub repositories belonging to waqas-cpu", () => {
    const repos = getApprovedGitHubRepos();
    const featured = getFeaturedGitHubRepos();
    expect(repos).toHaveLength(12);
    expect(featured.length).toBeGreaterThanOrEqual(4);
    expect(
      repos.every((r) => r.approved && r.url.startsWith("https://github.com/waqas-cpu/"))
    ).toBe(true);
  });

  it("strips unapproved external links even on visible projects", () => {
    const base = allProjects[0];
    expect(base).toBeDefined();
    if (!base) return;

    const approved = getApprovedLinks({
      ...base,
      links: [
        {
          label: "Unapproved repo",
          url: "https://github.com/waqas-cpu/private-draft",
          kind: "github",
          approved: false,
        },
        {
          label: "Approved repo",
          url: "https://github.com/waqas-cpu/verified-demo",
          kind: "github",
          approved: true,
        },
      ],
    });

    expect(approved).toHaveLength(1);
    expect(approved[0]?.label).toBe("Approved repo");
  });

  it("rejects invalid ISO dates and non-https external links in schema validation", () => {
    const base = allProjects[0];
    expect(base).toBeDefined();
    if (!base) return;

    expect(() =>
      PortfolioProjectSchema.parse({
        ...base,
        lastUpdated: "19-11-2026",
      })
    ).toThrow();

    expect(() =>
      PortfolioProjectSchema.parse({
        ...base,
        links: [
          {
            label: "Insecure HTTP",
            url: "http://example.com/repo",
            kind: "github",
            approved: true,
          },
        ],
      })
    ).toThrow();
  });

  it("excludes unapproved contact placeholders in production mode", () => {
    const publicChannels = getPublicContactChannels();
    expect(publicChannels.every((channel) => channel.approved && Boolean(channel.href))).toBe(true);
    expect(publicChannels.some((channel) => channel.id === "github")).toBe(true);
    expect(publicChannels.some((channel) => channel.id === "email")).toBe(false);

    const prodVisible = getVisibleContactChannels({ nodeEnv: "production" });
    expect(prodVisible).toEqual(publicChannels);
  });
});
