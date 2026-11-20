import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { getProfile } from "@/lib/content";

export function SiteFooter() {
  const profile = getProfile();

  return (
    <footer className="mt-20 border-t border-border bg-subtle/60 py-12">
      <Container>
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
          <div className="max-w-md space-y-2">
            <div className="flex items-center gap-3">
              <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-border-strong bg-ink">
                <Image
                  src={profile.logo.src}
                  alt={profile.logo.alt}
                  width={profile.logo.width}
                  height={profile.logo.height}
                  className="h-full w-full object-cover"
                />
              </span>
              <div>
                <p className="font-semibold tracking-tight text-ink">{profile.displayName}</p>
                <p className="font-mono text-xs text-ink-muted">{profile.workingTitle}</p>
              </div>
            </div>
            <p className="pt-1 text-xs leading-relaxed text-ink-secondary">
              FinTech, LegalTech, AI, and distributed systems engineering portfolio.
            </p>
          </div>

          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-ink-muted">
                Routes
              </span>
              <Link href="/" className="text-ink-secondary hover:text-ink">
                Home
              </Link>
              <Link href="/projects" className="text-ink-secondary hover:text-ink">
                Projects
              </Link>
              <Link href="/about" className="text-ink-secondary hover:text-ink">
                About
              </Link>
              <Link href="/now" className="text-ink-secondary hover:text-ink">
                Now
              </Link>
              <Link href="/contact" className="text-ink-secondary hover:text-ink">
                Contact
              </Link>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-ink-muted">
                Public Code
              </span>
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-ink-secondary hover:text-accent"
              >
                <span>GitHub (@{profile.githubHandle})</span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="sr-only">(opens in new tab)</span>
              </a>
            </div>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 font-mono text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <span>Static-first · Typed content &amp; explicit publication gate</span>
          <span>No client telemetry or third-party tracking</span>
        </div>
      </Container>
    </footer>
  );
}
