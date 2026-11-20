"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Container className="py-20">
      <div className="max-w-xl space-y-4 rounded-sm border border-border bg-surface p-8">
        <p className="font-mono text-xs uppercase tracking-wider text-amber-800">
          Application Error
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          Unable to load this view cleanly
        </h1>
        <p className="text-sm leading-relaxed text-ink-secondary">
          An unexpected rendering error occurred. Try reloading this section or navigate back to the
          portfolio index.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-11 items-center rounded-sm bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center rounded-sm border border-border-strong bg-canvas px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
          >
            Return home
          </Link>
        </div>
      </div>
    </Container>
  );
}
