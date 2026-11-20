import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { getProfile } from "@/lib/content";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "About",
  description:
    "Background, engineering direction, and cross-domain synthesis across FinTech, LegalTech, AI, and systems engineering.",
  path: "/about",
});

export default function AboutPage() {
  const profile = getProfile();

  return (
    <Container className="py-12 sm:py-16">
      <header className="grid grid-cols-1 items-center gap-8 border-b border-border pb-10 md:grid-cols-12">
        <div className="space-y-4 md:col-span-9">
          <p className="font-mono text-xs uppercase tracking-wider text-accent">
            02 / Engineering Background
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {profile.about.headline}
          </h1>
          <p className="text-base leading-relaxed text-ink-secondary sm:text-lg">
            {profile.about.intro}
          </p>
        </div>

        <div className="flex justify-start md:col-span-3 md:justify-end">
          <div className="relative h-32 w-32 overflow-hidden rounded-full border border-border-strong bg-subtle shadow-sm sm:h-36 sm:w-36">
            <Image
              src={profile.portrait.src}
              alt={profile.portrait.alt}
              width={profile.portrait.width}
              height={profile.portrait.height}
              className="h-full w-full object-cover scale-[1.03]"
            />
          </div>
        </div>
      </header>

      <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-12">
        <section aria-labelledby="perspective-heading" className="space-y-4 lg:col-span-7">
          <h2
            id="perspective-heading"
            className="font-mono text-xs font-semibold uppercase tracking-wider text-accent"
          >
            Engineering Perspective
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-ink-secondary">
            {profile.about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section aria-labelledby="intersections-heading" className="space-y-4 lg:col-span-5">
          <h2
            id="intersections-heading"
            className="font-mono text-xs font-semibold uppercase tracking-wider text-accent"
          >
            Domain Intersections
          </h2>
          <div className="space-y-3">
            {profile.about.intersections.map((item) => (
              <div key={item.pair} className="rounded-sm border border-border bg-surface p-4">
                <h3 className="font-mono text-xs font-semibold text-ink">{item.pair}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-secondary">
                  {item.explanation}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link
          href="/projects"
          className="inline-flex min-h-11 items-center gap-2 rounded-sm bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          <span>Inspect case studies</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <Link
          href="/contact"
          className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-border-strong bg-surface px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
        >
          <span>Contact details</span>
        </Link>
      </div>
    </Container>
  );
}
