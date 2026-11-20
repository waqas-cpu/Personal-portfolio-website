import type { ReactNode } from "react";
import { AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalloutProps {
  title: string;
  children: ReactNode;
  variant?: "info" | "caution";
  className?: string;
}

export function Callout({ title, children, variant = "info", className }: CalloutProps) {
  const isCaution = variant === "caution";
  const Icon = isCaution ? AlertTriangle : Info;

  return (
    <aside
      aria-label={title}
      className={cn(
        "rounded-sm border p-4 text-sm leading-relaxed",
        isCaution
          ? "border-amber-800/30 bg-amber-50/70 text-amber-950"
          : "border-border bg-subtle text-ink-secondary",
        className
      )}
    >
      <div className="flex items-start gap-2.5">
        <Icon
          className={cn("mt-0.5 h-4 w-4 shrink-0", isCaution ? "text-amber-800" : "text-accent")}
          aria-hidden="true"
        />
        <div className="space-y-1">
          <p className="font-mono text-xs font-semibold uppercase tracking-wide text-ink">
            {title}
          </p>
          <div>{children}</div>
        </div>
      </div>
    </aside>
  );
}
