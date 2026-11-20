import { z } from "zod";

export const CONTACT_TOPICS = [
  "Engineering role or internship",
  "FinTech / LegalTech architecture discussion",
  "AI / document intelligence collaboration",
  "Systems engineering or research inquiry",
  "General professional inquiry",
] as const;

export type ContactTopic = (typeof CONTACT_TOPICS)[number];

export const ContactSubmissionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please provide your name (at least 2 characters).")
    .max(100, "Name must be 100 characters or fewer."),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(160, "Email address must be 160 characters or fewer."),
  topic: z.enum(CONTACT_TOPICS, {
    errorMap: () => ({ message: "Please select an inquiry topic." }),
  }),
  message: z
    .string()
    .trim()
    .min(20, "Please include a brief message (at least 20 characters).")
    .max(2000, "Message must be 2000 characters or fewer."),
  website: z.string().max(200).optional(),
});

export type ContactSubmission = z.infer<typeof ContactSubmissionSchema>;

export type ContactDeliveryResult =
  | { ok: true; provider: "resend" | "webhook" }
  | { ok: false; code: "DELIVERY_NOT_CONFIGURED" | "DELIVERY_FAILED" };

export function isContactDeliveryConfigured(
  env: Record<string, string | undefined> = process.env
): boolean {
  const hasResend = Boolean(env.RESEND_API_KEY?.trim()) && Boolean(env.CONTACT_TO_EMAIL?.trim());
  const webhookUrl = env.CONTACT_WEBHOOK_URL?.trim() ?? "";
  const hasWebhook = webhookUrl.startsWith("https://");

  return hasResend || hasWebhook;
}

export async function deliverContactMessage(
  submission: ContactSubmission,
  env: Record<string, string | undefined> = process.env,
  fetchImpl: typeof fetch = fetch
): Promise<ContactDeliveryResult> {
  const resendApiKey = env.RESEND_API_KEY?.trim();
  const toEmail = env.CONTACT_TO_EMAIL?.trim();
  const fromEmail = env.CONTACT_FROM_EMAIL?.trim() || "Portfolio Contact <onboarding@resend.dev>";
  const webhookUrl = env.CONTACT_WEBHOOK_URL?.trim();

  if (resendApiKey && toEmail) {
    try {
      const response = await fetchImpl("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [toEmail],
          reply_to: submission.email,
          subject: `[Portfolio Inquiry] ${submission.topic} — ${submission.name}`,
          text: [
            `Name: ${submission.name}`,
            `Reply-To: ${submission.email}`,
            `Topic: ${submission.topic}`,
            "",
            "Message:",
            submission.message,
          ].join("\n"),
        }),
        signal: AbortSignal.timeout(8000),
      });

      if (!response.ok) {
        return { ok: false, code: "DELIVERY_FAILED" };
      }

      return { ok: true, provider: "resend" };
    } catch {
      return { ok: false, code: "DELIVERY_FAILED" };
    }
  }

  if (webhookUrl && webhookUrl.startsWith("https://")) {
    try {
      const response = await fetchImpl(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: "waqas-portfolio-contact",
          receivedAt: new Date().toISOString(),
          name: submission.name,
          email: submission.email,
          topic: submission.topic,
          message: submission.message,
        }),
        signal: AbortSignal.timeout(8000),
      });

      if (!response.ok) {
        return { ok: false, code: "DELIVERY_FAILED" };
      }

      return { ok: true, provider: "webhook" };
    } catch {
      return { ok: false, code: "DELIVERY_FAILED" };
    }
  }

  return { ok: false, code: "DELIVERY_NOT_CONFIGURED" };
}
