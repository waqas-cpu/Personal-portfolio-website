import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { getNowContent } from "@/lib/content";
import { buildPageMetadata } from "@/lib/metadata";
import { formatIsoDate } from "@/lib/utils";

export const metadata: Metadata = buildPageMetadata({
  title: "Now",
  description:
    "Current technical focus areas and active engineering work across FinTech, LegalTech, AI, and distributed systems.",
  path: "/now",
});

export default function NowPage() {
  const now = getNowContent();

  return (
    <Container className="py-12 sm:py-16">
      <header className="max-w-3xl space-y-3 border-b border-border pb-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-mono text-xs uppercase tracking-wider text-accent">
            03 / Current Focus
          </p>
          <p className="font-mono text-xs text-ink-muted">
            Last updated: <time dateTime={now.lastUpdated}>{formatIsoDate(now.lastUpdated)}</time>
          </p>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          What I Am Exploring Now
        </h1>
        <p className="text-base leading-relaxed text-ink-secondary">{now.intro}</p>
      </header>

      <section aria-labelledby="active-topics-heading" className="mt-10">
        <h2
          id="active-topics-heading"
          className="mb-5 font-mono text-xs font-semibold uppercase tracking-wider text-ink-muted"
        >
          Current Engineering Focus
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {now.items.map((item) => (
            <article key={item.id} className="rounded-sm border border-border bg-surface p-5">
              <span className="font-mono text-[11px] uppercase tracking-wider text-accent">
                {item.category}
              </span>
              <h3 className="mt-2.5 text-base font-semibold text-ink">{item.topic}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{item.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="mt-10">
        <Link
          href="/contact"
          className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-border-strong bg-surface px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
        >
          <span>Discuss any of these topics</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </Container>
  );
}
