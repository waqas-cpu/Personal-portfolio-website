import { NextResponse } from "next/server";
import { ContactSubmissionSchema, deliverContactMessage } from "@/lib/contact-delivery";
import { contactRateLimiter, extractClientIp } from "@/lib/rate-limit";

const MAX_BODY_BYTES = 8192;

const JSON_HEADERS = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json(
      {
        ok: false,
        code: "UNSUPPORTED_MEDIA_TYPE",
        message: "Content-Type must be application/json.",
      },
      { status: 415, headers: JSON_HEADERS }
    );
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        code: "INVALID_BODY",
        message: "Unable to read request body.",
      },
      { status: 400, headers: JSON_HEADERS }
    );
  }

  if (Buffer.byteLength(rawBody, "utf8") > MAX_BODY_BYTES) {
    return NextResponse.json(
      {
        ok: false,
        code: "PAYLOAD_TOO_LARGE",
        message: "Request body exceeds the 8 KB limit.",
      },
      { status: 413, headers: JSON_HEADERS }
    );
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      {
        ok: false,
        code: "INVALID_JSON",
        message: "Malformed JSON request body.",
      },
      { status: 400, headers: JSON_HEADERS }
    );
  }

  const clientIp = extractClientIp(request.headers);
  const rateLimit = contactRateLimiter.check(clientIp);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        ok: false,
        code: "RATE_LIMITED",
        message: "Too many inquiries submitted. Please try again later.",
      },
      {
        status: 429,
        headers: {
          ...JSON_HEADERS,
          "Retry-After": String(rateLimit.retryAfterSeconds),
        },
      }
    );
  }

  const validation = ContactSubmissionSchema.safeParse(parsedJson);
  if (!validation.success) {
    return NextResponse.json(
      {
        ok: false,
        code: "VALIDATION_ERROR",
        message: "Please correct the highlighted fields.",
        fieldErrors: validation.error.flatten().fieldErrors,
      },
      { status: 400, headers: JSON_HEADERS }
    );
  }

  // Honeypot field: silently accept bot submissions without triggering delivery.
  if (validation.data.website && validation.data.website.trim().length > 0) {
    return NextResponse.json(
      {
        ok: true,
        accepted: true,
        message: "Thank you for your message.",
      },
      { status: 200, headers: JSON_HEADERS }
    );
  }

  const deliveryResult = await deliverContactMessage(validation.data);

  if (!deliveryResult.ok) {
    if (deliveryResult.code === "DELIVERY_NOT_CONFIGURED") {
      return NextResponse.json(
        {
          ok: false,
          code: "DELIVERY_NOT_CONFIGURED",
          message:
            "Direct form delivery is not yet configured on this deployment. Please use an approved contact channel.",
        },
        { status: 503, headers: JSON_HEADERS }
      );
    }

    return NextResponse.json(
      {
        ok: false,
        code: "DELIVERY_FAILED",
        message:
          "Unable to forward your inquiry right now. Please try again later or use an approved channel.",
      },
      { status: 502, headers: JSON_HEADERS }
    );
  }

  return NextResponse.json(
    {
      ok: true,
      delivered: true,
      message: "Your inquiry has been forwarded.",
    },
    { status: 200, headers: JSON_HEADERS }
  );
}
