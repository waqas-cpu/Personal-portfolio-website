import { NextResponse } from "next/server";
import { isContactDeliveryConfigured } from "@/lib/contact-delivery";
import { getPublicProjects } from "@/lib/content";

export function GET() {
  return NextResponse.json(
    {
      status: "ok",
      service: "waqas-portfolio",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV ?? "development",
      publishedProjects: getPublicProjects().length,
      contactDeliveryConfigured: isContactDeliveryConfigured(),
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    }
  );
}
