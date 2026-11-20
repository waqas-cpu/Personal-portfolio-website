import type { Metadata } from "next";
import { ArrowUpRight, Lock, Mail, TerminalSquare } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { Callout } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";
import { isContactDeliveryConfigured } from "@/lib/contact-delivery";
import { getProfile, getVisibleContactChannels, isDraftPreviewEnabled } from "@/lib/content";
import { buildPageMetadata } from "@/lib/metadata";
import type { ContactChannel } from "@/lib/schemas";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description:
    "Approved public contact channels, direct inquiry form, and collaboration topics for discussing engineering roles, internships, or research.",
  path: "/contact",
});

function ChannelIcon({ kind }: { kind: ContactChannel["kind"] }) {
  switch (kind) {
    case "github":
      return <TerminalSquare className="h-4 w-4 text-accent" aria-hidden="true" />;
    case "email":
      return <Mail className="h-4 w-4 text-accent" aria-hidden="true" />;
    default:
      return <ArrowUpRight className="h-4 w-4 text-accent" aria-hidden="true" />;
  }
}

export default function ContactPage() {
  const profile = getProfile();
  const channels = getVisibleContactChannels();
  const draftPreview = isDraftPreviewEnabled();
  const deliveryConfigured = isContactDeliveryConfigured();

  return (
    <Container className="py-12 sm:py-16">
      <header className="max-w-3xl space-y-3 border-b border-border pb-8">
        <p className="font-mono text-xs uppercase tracking-wider text-accent">
          04 / Professional Contact
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {profile.contact.headline}
        </h1>
        <p className="text-base leading-relaxed text-ink-secondary">{profile.contact.invitation}</p>
      </header>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
        <section aria-labelledby="inquiry-form-heading" className="space-y-4 lg:col-span-7">
          <h2
            id="inquiry-form-heading"
            className="font-mono text-xs font-semibold uppercase tracking-wider text-ink-muted"
          >
            Send a Message
          </h2>
          <ContactForm deliveryConfigured={deliveryConfigured} />
        </section>

        <div className="space-y-8 lg:col-span-5">
          <section aria-labelledby="channels-heading" className="space-y-4">
            <h2
              id="channels-heading"
              className="font-mono text-xs font-semibold uppercase tracking-wider text-ink-muted"
            >
              Approved Channels
            </h2>

            <div className="space-y-4">
              {channels.map((channel) => {
                const isApproved = channel.approved && Boolean(channel.href);

                if (isApproved && channel.href) {
                  const isExternal = channel.href.startsWith("https://");
                  return (
                    <div
                      key={channel.id}
                      className="rounded-sm border border-border bg-surface p-5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <ChannelIcon kind={channel.kind} />
                          <h3 className="text-base font-semibold text-ink">{channel.label}</h3>
                        </div>
                        <a
                          href={channel.href}
                          target={isExternal ? "_blank" : undefined}
                          rel={isExternal ? "noopener noreferrer" : undefined}
                          className="inline-flex min-h-10 items-center gap-1.5 rounded-sm border border-border-strong bg-canvas px-3 py-1.5 font-mono text-xs font-medium text-accent transition-colors hover:border-accent hover:text-accent-hover"
                        >
                          <span>{channel.value ?? channel.label}</span>
                          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                          {isExternal ? <span className="sr-only">(opens in new tab)</span> : null}
                        </a>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-ink-secondary">
                        {channel.note}
                      </p>
                    </div>
                  );
                }

                if (!draftPreview) {
                  return null;
                }

                return (
                  <div
                    key={channel.id}
                    className="rounded-sm border border-dashed border-amber-700/40 bg-amber-50/40 p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-amber-800" aria-hidden="true" />
                        <h3 className="text-base font-semibold text-ink">{channel.label}</h3>
                      </div>
                      <span className="rounded-sm bg-amber-100 px-2 py-0.5 font-mono text-[11px] font-medium text-amber-900">
                        Unapproved placeholder · Hidden in production
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-ink-secondary">
                      {channel.devPlaceholderHint ?? channel.note}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          <section aria-labelledby="topics-heading" className="space-y-4">
            <h2
              id="topics-heading"
              className="font-mono text-xs font-semibold uppercase tracking-wider text-ink-muted"
            >
              Topics Welcome
            </h2>
            <div className="rounded-sm border border-border bg-surface p-6">
              <ul className="space-y-3 text-sm leading-relaxed text-ink-secondary">
                {profile.contact.topics.map((topic) => (
                  <li key={topic} className="flex items-start gap-2.5">
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                      aria-hidden="true"
                    />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <Callout title="Privacy & Data Minimization">
            <p>
              This site avoids client analytics and does not store contact messages in a database.
              Only channels explicitly approved by {profile.displayName} appear publicly.
            </p>
          </Callout>
        </div>
      </div>
    </Container>
  );
}
