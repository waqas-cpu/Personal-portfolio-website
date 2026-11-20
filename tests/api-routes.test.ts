import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST as postContact } from "@/app/api/contact/route";
import { GET as getHealth } from "@/app/api/health/route";
import { GET as getProfileRoute } from "@/app/api/profile/route";
import { GET as getProjectBySlugRoute } from "@/app/api/projects/[slug]/route";
import { GET as getProjectsRoute } from "@/app/api/projects/route";
import { CONTACT_TOPICS, deliverContactMessage } from "@/lib/contact-delivery";
import { resetContactRateLimiter } from "@/lib/rate-limit";

describe("portfolio API routes", () => {
  beforeEach(() => {
    resetContactRateLimiter();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("GET /api/health returns readiness summary without caching", async () => {
    const response = getHealth();
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");

    const body = (await response.json()) as {
      status: string;
      service: string;
      publishedProjects: number;
      contactDeliveryConfigured: boolean;
    };

    expect(body.status).toBe("ok");
    expect(body.service).toBe("waqas-portfolio");
    expect(body.publishedProjects).toBe(4);
    expect(body.contactDeliveryConfigured).toBe(false);
  });

  it("GET /api/profile returns public profile and excludes unapproved contact placeholders", async () => {
    const response = getProfileRoute();
    expect(response.status).toBe(200);

    const body = (await response.json()) as {
      displayName: string;
      contactChannels: Array<{ id: string }>;
      focusAreas: unknown[];
    };

    expect(body.displayName).toBe("Waqas");
    expect(body.focusAreas.length).toBeGreaterThanOrEqual(4);
    expect(body.contactChannels.map((c) => c.id)).toEqual(["github"]);
  });

  it("GET /api/projects enforces publication gate in production and filters cleanly in dev", async () => {
    const invalidStatus = getProjectsRoute(
      new Request("http://localhost:3000/api/projects?status=invalid")
    );
    expect(invalidStatus.status).toBe(400);

    vi.stubEnv("NODE_ENV", "production");
    const prodResponse = getProjectsRoute(new Request("http://localhost:3000/api/projects"));
    expect(prodResponse.status).toBe(200);
    const prodBody = (await prodResponse.json()) as {
      count: number;
      previewMode: boolean;
      projects: Array<{ slug: string }>;
      repositories: Array<{ slug: string }>;
    };
    expect(prodBody.previewMode).toBe(false);
    expect(prodBody.count).toBe(4);
    expect(prodBody.projects.some((p) => p.slug === "financial-document-forensics")).toBe(false);
    expect(prodBody.repositories).toHaveLength(12);

    vi.stubEnv("NODE_ENV", "development");
    const devRust = getProjectsRoute(new Request("http://localhost:3000/api/projects?domain=Rust"));
    expect(devRust.status).toBe(200);
    const devRustBody = (await devRust.json()) as {
      count: number;
      previewMode: boolean;
      projects: Array<{ slug: string }>;
    };
    expect(devRustBody.previewMode).toBe(true);
    expect(devRustBody.count).toBe(1);
    expect(devRustBody.projects[0]?.slug).toBe("transaction-risk-engine");
  });

  it("GET /api/projects/[slug] returns 404 for draft slugs in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const draftProdResponse = await getProjectBySlugRoute(
      new Request("http://localhost:3000/api/projects/financial-document-forensics"),
      { params: Promise.resolve({ slug: "financial-document-forensics" }) }
    );
    expect(draftProdResponse.status).toBe(404);

    const publishedProdResponse = await getProjectBySlugRoute(
      new Request("http://localhost:3000/api/projects/real-estate-tokenization"),
      { params: Promise.resolve({ slug: "real-estate-tokenization" }) }
    );
    expect(publishedProdResponse.status).toBe(200);

    vi.stubEnv("NODE_ENV", "development");
    const devResponse = await getProjectBySlugRoute(
      new Request("http://localhost:3000/api/projects/financial-document-forensics"),
      { params: Promise.resolve({ slug: "financial-document-forensics" }) }
    );
    expect(devResponse.status).toBe(200);

    const missingResponse = await getProjectBySlugRoute(
      new Request("http://localhost:3000/api/projects/does-not-exist"),
      { params: Promise.resolve({ slug: "does-not-exist" }) }
    );
    expect(missingResponse.status).toBe(404);
  });

  it("POST /api/contact validates media type, payload size, fields, honeypot, and rate limits", async () => {
    const nonJson = await postContact(
      new Request("http://localhost:3000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: "hello",
      })
    );
    expect(nonJson.status).toBe(415);

    const oversized = await postContact(
      new Request("http://localhost:3000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "a".repeat(9000) }),
      })
    );
    expect(oversized.status).toBe(413);

    const invalid = await postContact(
      new Request("http://localhost:3000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": "203.0.113.10",
        },
        body: JSON.stringify({
          name: "A",
          email: "not-an-email",
          topic: CONTACT_TOPICS[0],
          message: "short",
        }),
      })
    );
    expect(invalid.status).toBe(400);
    const invalidJson = (await invalid.json()) as {
      code: string;
      fieldErrors?: Record<string, string[]>;
    };
    expect(invalidJson.code).toBe("VALIDATION_ERROR");
    expect(invalidJson.fieldErrors?.name).toBeDefined();
    expect(invalidJson.fieldErrors?.email).toBeDefined();

    const honeypot = await postContact(
      new Request("http://localhost:3000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": "203.0.113.11",
        },
        body: JSON.stringify({
          name: "Spam Bot",
          email: "bot@example.com",
          topic: CONTACT_TOPICS[0],
          message: "This submission triggers the anti-spam honeypot input.",
          website: "https://spam.example.com",
        }),
      })
    );
    expect(honeypot.status).toBe(200);

    const unconfigured = await postContact(
      new Request("http://localhost:3000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": "203.0.113.12",
        },
        body: JSON.stringify({
          name: "Hiring Lead",
          email: "lead@example.com",
          topic: CONTACT_TOPICS[0],
          message: "Interested in discussing systems engineering work and architecture.",
        }),
      })
    );
    expect(unconfigured.status).toBe(503);

    // Exhaust 5 requests on a fresh IP to verify 429 rate-limit enforcement
    for (let i = 0; i < 5; i += 1) {
      await postContact(
        new Request("http://localhost:3000/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-forwarded-for": "203.0.113.50",
          },
          body: JSON.stringify({
            name: "Reviewer",
            email: "reviewer@example.com",
            topic: CONTACT_TOPICS[1],
            message: "Testing rate-limiter enforcement with a valid message body.",
          }),
        })
      );
    }

    const rateLimited = await postContact(
      new Request("http://localhost:3000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": "203.0.113.50",
        },
        body: JSON.stringify({
          name: "Reviewer",
          email: "reviewer@example.com",
          topic: CONTACT_TOPICS[1],
          message: "Sixth attempt from the same IP should be rate limited.",
        }),
      })
    );
    expect(rateLimited.status).toBe(429);
    expect(rateLimited.headers.get("retry-after")).toBeTruthy();
  });

  it("deliverContactMessage forwards via Resend or webhook and handles upstream failure safely", async () => {
    const validSubmission = {
      name: "Engineering Lead",
      email: "lead@example.com",
      topic: CONTACT_TOPICS[0],
      message: "Would like to schedule an introductory engineering conversation.",
    };

    const resendFetch = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(JSON.stringify({ id: "email_123" }), { status: 200 }));
    const resendResult = await deliverContactMessage(
      validSubmission,
      {
        RESEND_API_KEY: "re_test_placeholder",
        CONTACT_TO_EMAIL: "owner@example.com",
      },
      resendFetch
    );
    expect(resendResult).toEqual({ ok: true, provider: "resend" });
    expect(resendFetch).toHaveBeenCalledTimes(1);

    const webhookFetch = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response("ok", { status: 202 }));
    const webhookResult = await deliverContactMessage(
      validSubmission,
      {
        CONTACT_WEBHOOK_URL: "https://hooks.example.com/portfolio",
      },
      webhookFetch
    );
    expect(webhookResult).toEqual({ ok: true, provider: "webhook" });

    const failedFetch = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response("error", { status: 500 }));
    const failedResult = await deliverContactMessage(
      validSubmission,
      {
        CONTACT_WEBHOOK_URL: "https://hooks.example.com/portfolio",
      },
      failedFetch
    );
    expect(failedResult).toEqual({ ok: false, code: "DELIVERY_FAILED" });
  });
});
