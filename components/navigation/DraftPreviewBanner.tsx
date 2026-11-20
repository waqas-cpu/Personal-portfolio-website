import { Container } from "@/components/ui/Container";
import { isDraftPreviewEnabled } from "@/lib/content";

export function DraftPreviewBanner() {
  if (!isDraftPreviewEnabled()) {
    return null;
  }

  return (
    <div
      role="status"
      aria-label="Development draft preview notice"
      className="border-b border-amber-800/25 bg-amber-50/90 py-2 text-xs text-amber-950"
    >
      <Container className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono leading-snug">
          <strong className="font-semibold">DEV PREVIEW:</strong> Draft projects and unconfirmed
          contact placeholders are displayed locally for review. Production builds publish only
          owner-approved entries.
        </p>
      </Container>
    </div>
  );
}
