# Waqas — Personal Portfolio Website

Evidence-led engineering portfolio positioned at the intersection of **FinTech, LegalTech, AI, and Systems Engineering**.

Built with a static-first **Next.js App Router** architecture, strict **TypeScript**, **Tailwind CSS v4**, self-hosted typography (`@fontsource/ibm-plex-sans` and `@fontsource/ibm-plex-mono`), Zod-validated local content gated by an explicit owner-approval filter, and hardened REST API routes under `/api/*`.

---

## Prerequisites & Runtime

- **Node.js:** `v22.12.0` (Node 20 LTS or Node 22 LTS recommended)
- **Package manager:** `npm` (`10.x`)
  - _Windows PowerShell note:_ If your environment blocks `npm.ps1` due to script execution policy (`PSSecurityException`), invoke `npm.cmd` and `npx.cmd` instead of `npm` / `npx`.

---

## Quick Start

Install dependencies:

```bash
npm.cmd install
```

Run the local development server (includes local draft preview banner and unapproved draft case studies for review):

```bash
npm.cmd run dev
```

Preview strict production-only visibility during local development (hides drafts and unconfirmed contact placeholders):

```bash
# PowerShell
$env:PORTFOLIO_STRICT_PUBLIC="true"; npm.cmd run dev
```

---

## Available Scripts

| Command                    | Purpose                                                                                |
| -------------------------- | -------------------------------------------------------------------------------------- |
| `npm.cmd run dev`          | Start Next.js development server with draft review mode enabled                        |
| `npm.cmd run build`        | Validate content schemas and build optimized production output (`NODE_ENV=production`) |
| `npm.cmd run start`        | Serve the production build locally                                                     |
| `npm.cmd run typecheck`    | Run strict TypeScript checking (`tsc --noEmit`)                                        |
| `npm.cmd run lint`         | Run ESLint across the repository                                                       |
| `npm.cmd run test`         | Run automated unit, API, and component tests with Vitest                               |
| `npm.cmd run format`       | Format supported files with Prettier                                                   |
| `npm.cmd run format:check` | Verify formatting without modifying files                                              |

---

## Portfolio API Endpoints (`app/api/`)

All endpoints respect the same strict publication gate (`visibility === "published"` and `ownerApproved === true` in production) and strip unapproved links and private placeholders.

| Method & Route             | Purpose                                                                   | Key Safeguards                                                                                                                                                                                        |
| -------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET /api/health`          | Runtime liveness & publication readiness summary                          | `Cache-Control: no-store`; exposes counts/flags only, never secrets                                                                                                                                   |
| `GET /api/profile`         | Public positioning, focus areas, `/now` items, and approved channels      | Omits unapproved email/LinkedIn placeholders                                                                                                                                                          |
| `GET /api/projects`        | Filterable project list (`?domain=`, `?status=`, `?featured=true\|false`) | Validates `status` (`400` on invalid); returns only published projects in production                                                                                                                  |
| `GET /api/projects/[slug]` | Structured case study JSON by slug                                        | Returns `404` for drafts in production; sanitizes external links                                                                                                                                      |
| `POST /api/contact`        | Validated contact inquiry endpoint backing `/contact`                     | Enforces `application/json` (`415`), 8 KB payload limit (`413`), Zod validation (`400`), per-IP rate limit (`429`), honeypot check, and server-side Resend/webhook forwarding (`503` if unconfigured) |

---

## Repository Structure

```text
app/
├── api/
│   ├── contact/route.ts         # Hardened POST inquiry endpoint
│   ├── health/route.ts          # Health & configuration readiness endpoint
│   ├── profile/route.ts         # Public profile, focus areas, and /now API
│   └── projects/
│       ├── route.ts             # Filterable projects API
│       └── [slug]/route.ts      # Single case-study API
├── layout.tsx                   # Global shell, self-hosted fonts, skip link, header/footer
├── page.tsx                     # Homepage (hero, selected work, focus areas, approach, now, contact)
├── globals.css                  # Design tokens, Tailwind v4 theme, reduced-motion, focus rules
├── projects/page.tsx            # Approved project index + explicit status taxonomy
├── projects/[slug]/page.tsx     # 14-section evidence-led case study route
├── about/page.tsx               # Engineering perspective, intersections, and principles
├── now/page.tsx                 # Current exploration areas and open technical questions
├── contact/page.tsx             # Direct inquiry form + allowlisted contact channels
├── robots.ts                    # Robots policy
├── sitemap.ts                   # Public routes and published case-study URLs only
├── opengraph-image.tsx          # Generated social preview card
├── not-found.tsx                # 404 route
└── error.tsx                    # Client recovery error boundary
components/
├── contact/                     # ContactForm client component
├── diagrams/                    # Accessible inline SVG architecture diagrams + text walkthroughs
├── layout/                      # SiteFooter
├── navigation/                  # SiteHeader, NavLinks, MobileNav, DraftPreviewBanner
├── projects/                    # ProjectCard, ProjectDirectory, CaseStudyTemplate
└── ui/                          # Container, SectionHeader, StatusBadge, DraftBadge, Callout
content/
├── profile.ts                   # Display identity, positioning, systems-thinking model, contact channels
├── focus-areas.ts               # Principal engineering domains
├── now.ts                       # Current exploration items & open questions
└── projects/                    # Structured case-study files (all default to draft)
lib/
├── schemas.ts                   # Zod validation schemas & TypeScript types
├── content.ts                   # Content validator, publication gate, link allowlist filter
├── contact-delivery.ts          # Contact Zod schema + server-side Resend / webhook delivery
├── rate-limit.ts                # Sliding-window per-IP rate limiter
├── metadata.ts                  # Route metadata & canonical URL helper
└── utils.ts                     # UTC ISO date formatter and class-name helper
tests/
├── setup.ts
├── api-routes.test.ts
├── content-governance.test.ts
└── components.test.tsx
```

---

## Content Editing & Publication Workflow

All portfolio copy and case studies live under `content/` and are validated by Zod (`lib/schemas.ts`) when loaded or built.

### Publishing a Project Case Study

By default, every case study in `content/projects/` has `visibility: "draft"` and `ownerApproved: false`. **Production builds (`NODE_ENV=production`) exclude any project unless BOTH conditions hold:**

1. `visibility === "published"`
2. `ownerApproved === true`

To publish a reviewed case study:

1. Open the project file under `content/projects/<slug>.ts`.
2. Verify accuracy of `status` (`"built" | "in-progress" | "research" | "learning" | "proposed"`), `scopeAndStatus`, `validation`, `limitations`, and `lastUpdated` (`YYYY-MM-DD`).
3. Add verified external repository/demo links to `links` with `approved: true` and `https://` URLs.
4. Set `ownerApproved: true` and `visibility: "published"`.
5. Run `npm.cmd run test`, `npm.cmd run typecheck`, `npm.cmd run lint`, and `npm.cmd run build` before deploying.

### Adding a New Project

1. Copy an existing file in `content/projects/` (or author a new `PortfolioProject` object matching `lib/schemas.ts`) with a unique lowercase `slug` and valid `diagramId` (`components/diagrams/ArchitectureDiagram.tsx`).
2. Export and register it in `content/projects/index.ts`.
3. No page or API route edits are needed—the UI pages, JSON APIs, and sitemap pick it up automatically once published.

---

## Environment Variables

Copy `.env.example` to `.env.local` if local overrides are needed (never commit real `.env*` files):

| Variable                  | Purpose                                                                                                                      | Scope         | Required?                        |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------- | -------------------------------- |
| `NEXT_PUBLIC_SITE_URL`    | Canonical production origin (e.g. `https://waqas.dev`) for canonical tags, Open Graph URLs, `robots.txt`, and `sitemap.xml`. | Public        | Optional (recommended in prod)   |
| `PORTFOLIO_STRICT_PUBLIC` | Set to `true` during `next dev` to test strict production publication filtering locally.                                     | Server        | Optional                         |
| `RESEND_API_KEY`          | Resend API key used server-side by `POST /api/contact`.                                                                      | Server secret | Optional (for email delivery)    |
| `CONTACT_TO_EMAIL`        | Destination inbox for `POST /api/contact` messages when using Resend.                                                        | Server config | Optional (with `RESEND_API_KEY`) |
| `CONTACT_FROM_EMAIL`      | Verified sender address for Resend (defaults to Resend onboarding sender for testing).                                       | Server config | Optional                         |
| `CONTACT_WEBHOOK_URL`     | Alternative `https://` webhook endpoint if not using Resend.                                                                 | Server secret | Optional                         |

---

## Deployment & Domain Guidance

See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for:

- Hosting platform comparison (Vercel recommended for Next.js 16 + `/api/*` routes)
- Appropriate domain considerations (`.dev`, `.com`, security/HSTS, SPF/DKIM/DMARC, naming rules)
- Step-by-step GitHub + Vercel deployment, post-launch smoke checks, and rollback procedures
