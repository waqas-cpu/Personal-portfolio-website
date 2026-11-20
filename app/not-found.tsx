import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";

export default function NotFoundPage() {
  return (
    <Container className="py-20">
      <div className="max-w-xl space-y-4 rounded-sm border border-border bg-surface p-8">
        <p className="font-mono text-xs uppercase tracking-wider text-ink-muted">404 / Not Found</p>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          Page or Case Study Not Available
        </h1>
        <p className="text-sm leading-relaxed text-ink-secondary">
          The requested route does not exist, or the referenced project case study is currently in
          private review and not publicly published.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-sm bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Return home</span>
          </Link>
          <Link
            href="/projects"
            className="inline-flex min-h-11 items-center rounded-sm border border-border-strong bg-canvas px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
          >
            Browse projects
          </Link>
        </div>
      </div>
    </Container>
  );
}
