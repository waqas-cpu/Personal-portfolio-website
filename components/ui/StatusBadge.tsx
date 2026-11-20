import { PROJECT_STATUS_META } from "@/lib/content";
import type { ContentVisibility, ProjectStatus } from "@/lib/schemas";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<ProjectStatus, string> = {
  built: "border-emerald-800/25 bg-emerald-50 text-emerald-900",
  "in-progress": "border-accent/25 bg-accent-soft text-accent",
  research: "border-amber-800/25 bg-amber-50 text-amber-900",
  learning: "border-sky-800/25 bg-sky-50 text-sky-900",
  proposed: "border-border-strong bg-subtle text-ink-secondary",
};

function StatusMarker({ marker }: { marker: "square" | "half" | "ring" | "triangle" | "dashed" }) {
  switch (marker) {
    case "square":
      return (
        <svg className="h-2.5 w-2.5 shrink-0" viewBox="0 0 10 10" aria-hidden="true">
          <rect x="1.5" y="1.5" width="7" height="7" fill="currentColor" rx="1" />
        </svg>
      );
    case "half":
      return (
        <svg className="h-2.5 w-2.5 shrink-0" viewBox="0 0 10 10" aria-hidden="true">
          <circle cx="5" cy="5" r="3.75" fill="none" stroke="currentColor" strokeWidth="1.25" />
          <path d="M5 1.25 A3.75 3.75 0 0 0 5 8.75 Z" fill="currentColor" />
        </svg>
      );
    case "ring":
      return (
        <svg className="h-2.5 w-2.5 shrink-0" viewBox="0 0 10 10" aria-hidden="true">
          <circle cx="5" cy="5" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="5" cy="5" r="1.2" fill="currentColor" />
        </svg>
      );
    case "triangle":
      return (
        <svg className="h-2.5 w-2.5 shrink-0" viewBox="0 0 10 10" aria-hidden="true">
          <polygon
            points="5,1.5 8.5,8.2 1.5,8.2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
          />
        </svg>
      );
    case "dashed":
      return (
        <svg className="h-2.5 w-2.5 shrink-0" viewBox="0 0 10 10" aria-hidden="true">
          <rect
            x="1.5"
            y="1.5"
            width="7"
            height="7"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeDasharray="2 1.5"
          />
        </svg>
      );
  }
}

export function StatusBadge({ status, className }: { status: ProjectStatus; className?: string }) {
  const meta = PROJECT_STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 font-mono text-xs font-medium tracking-tight",
        STATUS_STYLES[status],
        className
      )}
    >
      <StatusMarker marker={meta.marker} />
      <span>{meta.label}</span>
    </span>
  );
}

export function DraftBadge({
  visibility,
  ownerApproved,
}: {
  visibility: ContentVisibility;
  ownerApproved: boolean;
}) {
  if (visibility === "published" && ownerApproved) {
    return null;
  }

  const label =
    visibility === "draft"
      ? "Draft · Dev preview only"
      : ownerApproved
        ? "Approved · Not published"
        : "Awaiting owner approval";

  return (
    <span className="inline-flex items-center gap-1.5 rounded-sm border border-dashed border-amber-700/40 bg-amber-50 px-2 py-0.5 font-mono text-[11px] font-medium text-amber-900">
      <span aria-hidden="true">◇</span>
      <span>{label}</span>
    </span>
  );
}
