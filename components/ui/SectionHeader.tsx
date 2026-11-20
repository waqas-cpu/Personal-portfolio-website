import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionHeaderProps {
  index: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
  headingId?: string;
}

export function SectionHeader({
  index,
  title,
  description,
  action,
  headingId,
}: SectionHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1.5">
        <div className="flex items-baseline gap-2.5">
          <span className="font-mono text-xs font-medium tracking-wider text-ink-muted">
            {index} /
          </span>
          <h2 id={headingId} className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
            {title}
          </h2>
        </div>
        {description ? (
          <p className="max-w-2xl text-sm leading-relaxed text-ink-secondary">{description}</p>
        ) : null}
      </div>
      {action ? (
        <Link
          href={action.href}
          className="inline-flex min-h-11 items-center gap-1.5 self-start font-mono text-xs font-medium text-accent transition-colors hover:text-accent-hover sm:min-h-0 sm:self-auto"
        >
          <span>{action.label}</span>
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      ) : null}
    </div>
  );
}
