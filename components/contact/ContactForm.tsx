"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { Callout } from "@/components/ui/Callout";
import { CONTACT_TOPICS, type ContactTopic } from "@/lib/contact-delivery";
import { cn } from "@/lib/utils";

interface ContactFormProps {
  deliveryConfigured: boolean;
}

interface FieldErrors {
  name?: string[];
  email?: string[];
  topic?: string[];
  message?: string[];
}

export function ContactForm({ deliveryConfigured }: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<ContactTopic>(CONTACT_TOPICS[0]);
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitState, setSubmitState] = useState<
    { kind: "idle" } | { kind: "success"; message: string } | { kind: "error"; message: string }
  >({ kind: "idle" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setFieldErrors({});
    setSubmitState({ kind: "idle" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          topic,
          message,
          website,
        }),
      });

      const payload = (await response.json()) as {
        ok?: boolean;
        message?: string;
        fieldErrors?: FieldErrors;
      };

      if (!response.ok || !payload.ok) {
        if (payload.fieldErrors) {
          setFieldErrors(payload.fieldErrors);
        }
        setSubmitState({
          kind: "error",
          message:
            payload.message ??
            "Unable to submit your inquiry right now. Please try an approved contact channel.",
        });
        return;
      }

      setSubmitState({
        kind: "success",
        message: payload.message ?? "Your inquiry has been forwarded.",
      });
      setName("");
      setEmail("");
      setTopic(CONTACT_TOPICS[0]);
      setMessage("");
      setWebsite("");
    } catch {
      setSubmitState({
        kind: "error",
        message: "Network error while sending your message. Please try again later.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-5 rounded-sm border border-border bg-surface p-6">
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-ink">Direct Inquiry Form</h3>
        <p className="text-sm text-ink-secondary">
          Validated server-side via <code className="font-mono text-xs">POST /api/contact</code>.
          Submissions are forwarded directly without retaining visitor conversation logs in a
          database.
        </p>
      </div>

      {!deliveryConfigured ? (
        <Callout title="Server Delivery Pending Configuration">
          <p>
            Form validation and rate limiting are active, and forwarding will activate automatically
            once <code className="font-mono text-xs">RESEND_API_KEY</code> +{" "}
            <code className="font-mono text-xs">CONTACT_TO_EMAIL</code> (or{" "}
            <code className="font-mono text-xs">CONTACT_WEBHOOK_URL</code>) are set on the hosting
            environment.
          </p>
        </Callout>
      ) : null}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="contact-name" className="block font-mono text-xs font-medium text-ink">
              Name
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              minLength={2}
              maxLength={100}
              value={name}
              onChange={(event) => setName(event.target.value)}
              aria-invalid={Boolean(fieldErrors.name?.length)}
              aria-describedby={fieldErrors.name?.length ? "contact-name-error" : undefined}
              className={cn(
                "w-full rounded-sm border bg-canvas px-3 py-2.5 text-sm text-ink transition-colors focus:border-accent focus:outline-none",
                fieldErrors.name?.length ? "border-amber-800" : "border-border-strong"
              )}
              placeholder="Your full name"
            />
            {fieldErrors.name?.[0] ? (
              <p id="contact-name-error" role="alert" className="text-xs text-amber-900">
                {fieldErrors.name[0]}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="contact-email" className="block font-mono text-xs font-medium text-ink">
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={160}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={Boolean(fieldErrors.email?.length)}
              aria-describedby={fieldErrors.email?.length ? "contact-email-error" : undefined}
              className={cn(
                "w-full rounded-sm border bg-canvas px-3 py-2.5 text-sm text-ink transition-colors focus:border-accent focus:outline-none",
                fieldErrors.email?.length ? "border-amber-800" : "border-border-strong"
              )}
              placeholder="you@organization.com"
            />
            {fieldErrors.email?.[0] ? (
              <p id="contact-email-error" role="alert" className="text-xs text-amber-900">
                {fieldErrors.email[0]}
              </p>
            ) : null}
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="contact-topic" className="block font-mono text-xs font-medium text-ink">
            Topic
          </label>
          <select
            id="contact-topic"
            name="topic"
            value={topic}
            onChange={(event) => setTopic(event.target.value as ContactTopic)}
            aria-invalid={Boolean(fieldErrors.topic?.length)}
            aria-describedby={fieldErrors.topic?.length ? "contact-topic-error" : undefined}
            className="w-full rounded-sm border border-border-strong bg-canvas px-3 py-2.5 text-sm text-ink transition-colors focus:border-accent focus:outline-none"
          >
            {CONTACT_TOPICS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {fieldErrors.topic?.[0] ? (
            <p id="contact-topic-error" role="alert" className="text-xs text-amber-900">
              {fieldErrors.topic[0]}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <label
              htmlFor="contact-message"
              className="block font-mono text-xs font-medium text-ink"
            >
              Message
            </label>
            <span className="font-mono text-[11px] text-ink-muted">{message.length} / 2000</span>
          </div>
          <textarea
            id="contact-message"
            name="message"
            required
            minLength={20}
            maxLength={2000}
            rows={5}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            aria-invalid={Boolean(fieldErrors.message?.length)}
            aria-describedby={
              fieldErrors.message?.length ? "contact-message-error" : "contact-message-hint"
            }
            className={cn(
              "w-full rounded-sm border bg-canvas px-3 py-2.5 text-sm text-ink transition-colors focus:border-accent focus:outline-none",
              fieldErrors.message?.length ? "border-amber-800" : "border-border-strong"
            )}
            placeholder="Share context on the role, project, or engineering question (minimum 20 characters)."
          />
          <p id="contact-message-hint" className="text-xs text-ink-muted">
            Avoid sharing confidential credentials, private keys, or regulated personal records.
          </p>
          {fieldErrors.message?.[0] ? (
            <p id="contact-message-error" role="alert" className="text-xs text-amber-900">
              {fieldErrors.message[0]}
            </p>
          ) : null}
        </div>

        {/* Anti-spam honeypot field hidden from human visitors and assistive tech */}
        <div className="sr-only" aria-hidden="true">
          <label htmlFor="contact-website">Leave this field blank</label>
          <input
            id="contact-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
          />
        </div>

        {submitState.kind === "success" ? (
          <div
            role="status"
            aria-live="polite"
            className="rounded-sm border border-emerald-800/30 bg-emerald-50 p-3.5 text-sm text-emerald-950"
          >
            {submitState.message}
          </div>
        ) : null}

        {submitState.kind === "error" ? (
          <div
            role="alert"
            className="rounded-sm border border-amber-800/30 bg-amber-50 p-3.5 text-sm text-amber-950"
          >
            {submitState.message}
          </div>
        ) : null}

        <div className="pt-1">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex min-h-11 items-center gap-2 rounded-sm bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-65"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            <span>{submitting ? "Sending inquiry..." : "Send inquiry"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
