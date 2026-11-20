import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { GitHubRepoGrid } from "@/components/projects/GitHubRepoGrid";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Callout } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  getFeaturedGitHubRepos,
  getFeaturedVisibleProjects,
  getFocusAreas,
  getNowContent,
  getProfile,
  isDraftPreviewEnabled,
} from "@/lib/content";
import { formatIsoDate } from "@/lib/utils";

export default function HomePage() {
  const profile = getProfile();
  const focusAreas = getFocusAreas();
  const now = getNowContent();
  const featuredProjects = getFeaturedVisibleProjects();
  const featuredRepos = getFeaturedGitHubRepos();
  const draftPreview = isDraftPreviewEnabled();

  return (
    <div>
      {/* Hero */}
      <section
        aria-labelledby="hero-heading"
        className="border-b border-border bg-surface py-12 sm:py-16"
      >
        <Container>
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-8">
              <div className="flex items-center gap-3">
                <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-border-strong bg-ink">
                  <Image
                    src={profile.logo.src}
                    alt={profile.logo.alt}
                    width={profile.logo.width}
                    height={profile.logo.height}
                    priority
                    className="h-full w-full object-cover"
                  />
                </span>
                <p className="font-mono text-xs font-medium uppercase tracking-wider text-accent">
                  {profile.hero.eyebrow}
                </p>
              </div>

              <h1
                id="hero-heading"
                className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl lg:text-[2.6rem] lg:leading-[1.15]"
              >
                {profile.hero.headline}
              </h1>

              <p className="max-w-2xl text-base leading-relaxed text-ink-secondary sm:text-lg">
                {profile.hero.supportingCopy}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href="/projects"
                  className="inline-flex min-h-11 items-center gap-2 rounded-sm bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
                >
                  <span>{profile.hero.primaryCtaLabel}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>

                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-border-strong bg-canvas px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
                >
                  <span>{profile.hero.secondaryCtaLabel}</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">(opens in new tab)</span>
                </a>
              </div>
            </div>

            <div className="flex flex-col items-start lg:col-span-4 lg:items-end">
              <div className="flex flex-col items-center gap-3">
                <div className="relative h-44 w-44 overflow-hidden rounded-full border border-border-strong bg-subtle shadow-sm sm:h-52 sm:w-52">
                  <Image
                    src={profile.portrait.src}
                    alt={profile.portrait.alt}
                    width={profile.portrait.width}
                    height={profile.portrait.height}
                    priority
                    className="h-full w-full object-cover scale-[1.03]"
                  />
                </div>
                <p className="font-mono text-xs text-ink-muted">
                  {profile.displayName} · @{profile.githubHandle}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 01 / Selected Work */}
      <section aria-labelledby="selected-work-heading" className="py-14 sm:py-16">
        <Container>
          <SectionHeader
            index="01"
            title="Selected Work"
            headingId="selected-work-heading"
            description="Evidence-led case studies documenting problem boundaries, system models, trade-offs, and honest maturity."
            action={{ label: "All projects", href: "/projects" }}
          />

          {featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.slug} project={project} showDraftBadge={draftPreview} />
              ))}
            </div>
          ) : (
            <Callout title="Publication Review In Progress">
              <p>
                Project case studies are currently maintained in private review until each
                repository allowlist, status label, and technical claim is verified by{" "}
                {profile.displayName}. You can review public repositories directly on{" "}
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-accent underline underline-offset-2 hover:text-accent-hover"
                >
                  GitHub (@{profile.githubHandle})
                </a>{" "}
                or read about the engineering approach on the{" "}
                <Link
                  href="/about"
                  className="font-medium text-accent underline underline-offset-2 hover:text-accent-hover"
                >
                  About page
                </Link>
                .
              </p>
            </Callout>
          )}
        </Container>
      </section>

      {/* 02 / Important GitHub Repositories */}
      <section
        aria-labelledby="github-repos-heading"
        className="border-t border-border bg-subtle/40 py-14 sm:py-16"
      >
        <Container>
          <SectionHeader
            index="02"
            title="Important GitHub Repositories"
            headingId="github-repos-heading"
            description="Selected public implementations from github.com/waqas-cpu across data lakehouses, distributed systems, LegalTech search, and risk modeling."
            action={{ label: "All 12 repositories", href: "/projects#github-repositories" }}
          />

          <GitHubRepoGrid repositories={featuredRepos} />
        </Container>
      </section>

      {/* 03 / Focus Areas */}
      <section
        aria-labelledby="focus-areas-heading"
        className="border-t border-border py-14 sm:py-16"
      >
        <Container>
          <SectionHeader
            index="03"
            title="Focus Areas"
            headingId="focus-areas-heading"
            description="Principal areas of engineering work and study across trust-sensitive software domains."
          />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {focusAreas.map((area) => (
              <article
                key={area.id}
                className="flex flex-col justify-between rounded-sm border border-border bg-surface p-6"
              >
                <div className="space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-xs text-ink-muted">{area.index}</span>
                    <h3 className="text-lg font-semibold tracking-tight text-ink">{area.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-ink-secondary">{area.summary}</p>
                  <ul className="flex flex-wrap gap-1.5 pt-1" aria-label={`${area.title} topics`}>
                    {area.topics.map((topic) => (
                      <li
                        key={topic}
                        className="rounded-sm border border-border bg-canvas px-2.5 py-1 font-mono text-[11px] text-ink-secondary"
                      >
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="mt-5 border-t border-border pt-3 font-mono text-[11px] text-ink-muted">
                  {area.framingNote}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* 04 / Systems-Thinking Approach */}
      <section
        aria-labelledby="approach-heading"
        className="border-t border-border bg-subtle/40 py-14 sm:py-16"
      >
        <Container>
          <SectionHeader
            index="04"
            title="Systems-Thinking Approach"
            headingId="approach-heading"
            action={{ label: "About my background", href: "/about" }}
          />

          <blockquote className="mb-8 max-w-3xl border-l-2 border-accent pl-5 text-base leading-relaxed text-ink sm:text-lg">
            “{profile.systemsThinking.statement}”
          </blockquote>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {profile.systemsThinking.pillars.map((pillar) => (
              <div key={pillar.index} className="rounded-sm border border-border bg-surface p-5">
                <p className="font-mono text-xs font-medium text-accent">{pillar.index}</p>
                <h3 className="mt-2 text-sm font-semibold text-ink">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{pillar.detail}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 05 / Currently Exploring */}
      <section aria-labelledby="now-heading" className="border-t border-border py-14 sm:py-16">
        <Container>
          <SectionHeader
            index="05"
            title="Currently Exploring"
            headingId="now-heading"
            description={`Current engineering focus areas and active system builds as of ${formatIsoDate(now.lastUpdated)}.`}
            action={{ label: "Full /now log", href: "/now" }}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {now.items.slice(0, 4).map((item) => (
              <div key={item.id} className="rounded-sm border border-border bg-surface p-5">
                <span className="font-mono text-[11px] uppercase tracking-wider text-accent">
                  {item.category}
                </span>
                <h3 className="mt-2 text-base font-semibold text-ink">{item.topic}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-secondary">{item.summary}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 06 / Contact Invitation */}
      <section
        aria-labelledby="contact-heading"
        className="border-t border-border bg-subtle/40 py-14 sm:py-16"
      >
        <Container>
          <div className="flex flex-col justify-between gap-6 rounded-sm border border-border-strong bg-surface p-6 sm:p-8 md:flex-row md:items-center">
            <div className="max-w-2xl space-y-2">
              <p className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                06 / Contact
              </p>
              <h2 id="contact-heading" className="text-2xl font-semibold tracking-tight text-ink">
                {profile.contact.headline}
              </h2>
              <p className="text-sm leading-relaxed text-ink-secondary sm:text-base">
                {profile.contact.invitation}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center gap-2 rounded-sm bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
              >
                <span>Contact &amp; channels</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-1.5 rounded-sm border border-border-strong bg-canvas px-4 py-2.5 font-mono text-xs font-medium text-ink transition-colors hover:border-accent hover:text-accent"
              >
                <span>GitHub</span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="sr-only">(opens in new tab)</span>
              </a>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
