import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MobileNav } from "@/components/navigation/MobileNav";
import { NavLinks } from "@/components/navigation/NavLinks";
import { Container } from "@/components/ui/Container";
import { getProfile } from "@/lib/content";

export function SiteHeader() {
  const profile = getProfile();

  return (
    <header className="relative border-b border-border bg-canvas/95">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2.5 text-ink transition-colors hover:text-accent"
        >
          <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-border-strong bg-ink">
            <Image
              src={profile.logo.src}
              alt={profile.logo.alt}
              width={profile.logo.width}
              height={profile.logo.height}
              className="h-full w-full object-cover"
              priority
            />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-tight">{profile.displayName}</span>
            <span className="hidden font-mono text-[11px] text-ink-muted sm:inline">
              Systems &amp; Engineering
            </span>
          </span>
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-3 md:flex">
          <NavLinks />
          <span className="h-4 w-px bg-border" aria-hidden="true" />
          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-10 items-center gap-1 rounded-sm border border-border-strong bg-surface px-3 py-1.5 font-mono text-xs font-medium text-ink transition-colors hover:border-accent hover:text-accent"
          >
            <span>GitHub</span>
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sr-only">(opens in new tab)</span>
          </a>
        </nav>

        <MobileNav githubUrl={profile.githubUrl} />
      </Container>
    </header>
  );
}
