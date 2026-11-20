# Deployment & Domain Readiness Guide

This portfolio uses **Next.js App Router** with both static-first pages and server-side API endpoints (`/api/health`, `/api/profile`, `/api/projects`, `/api/projects/[slug]`, and `/api/contact`). Because `/api/*` routes execute on the server, deploy to a platform that supports Next.js Route Handlers rather than a pure static-file-only host.

---

## 1. Recommended Hosting Platforms

| Platform                            | Fit for this Architecture                                                                                        | Free / Starter Tier                                    | Notes                                                                                                      |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| **Vercel (Recommended)**            | Native Next.js 16 App Router, zero-config SSR + `/api/*` serverless routes, automatic HTTPS, preview URLs per PR | Hobby tier free for personal non-commercial portfolios | Best operational simplicity; handles `next/image` optimization and custom domains cleanly.                 |
| **Netlify**                         | Supports Next.js App Router & serverless functions via OpenNext adapter                                          | Starter tier available                                 | Good alternative if you already manage DNS/sites on Netlify.                                               |
| **Cloudflare (Workers / OpenNext)** | Edge/Workers runtime via `@opennextjs/cloudflare`                                                                | Generous free tier                                     | Requires testing Node-specific APIs (`Buffer`, `AbortSignal.timeout`) under Workers compatibility.         |
| **Railway**                         | Full Node.js container (`npm run start`) with persistent process memory                                          | Usage-based starter                                    | Good when you want a single long-lived Node process (so in-memory rate limiting persists across requests). |

> **Rate-limiting note on serverless vs. container hosts:** The built-in sliding-window limiter in `lib/rate-limit.ts` works per server instance without external Redis dependencies. On serverless hosts (Vercel/Netlify), add platform-level WAF/rate limiting or Upstash Redis if public traffic volume grows.

---

## 2. Appropriate Domain Considerations

Your portfolio sits at the intersection of **FinTech, LegalTech, AI, and Systems Engineering**—domains where engineering leads and compliance-minded teams notice domain trust signals immediately.

### Recommended TLDs

1. **`.dev` (Strongest technical & security fit)**
   - Signals engineering focus cleanly.
   - **Preloaded HSTS by Google Registry:** browsers strictly enforce HTTPS automatically (aligned with trust-sensitive work).
   - Reasonably priced annual renewal compared to `.ai` or `.io`.
2. **`.com` (Strongest broad & recruiter/LegalTech fit)**
   - Highest familiarity among non-engineering FinTech/LegalTech stakeholders, HR teams, and institutional reviewers.
   - Lowest risk of someone misremembering the extension.
3. **`.ai` / `.io` (Use cautiously)**
   - Recognizable in AI/startup circles, but significantly higher annual renewal costs (~3–6× a `.dev` or `.com`) and less grounded for LegalTech/regulatory positioning.

### TLDs to Avoid

- Avoid `.xyz`, `.click`, `.top`, `.tk`, or novelty Web3/speculative extensions (`.crypto`, `.web3`)—corporate email filters and enterprise security proxies frequently flag or distrust them, which undercuts credibility in FinTech and LegalTech.

### Naming Patterns (Confirm Exact Public Name Before Purchasing)

Wait until you confirm your exact public display name before registering:

- `<firstname><lastname>.dev` or `<firstname><lastname>.com` (most professional and durable)
- `<firstinitial><lastname>.dev` (if your full name `.com`/`.dev` is taken)
- Avoid hyphens, numbers, or buzzwords (e.g., avoid `waqas-ai-web3-expert.xyz`).

### Domain Security & Email Deliverability Checklist

Once you register a domain:

1. Enable **registrar 2FA**, **domain transfer lock**, and **WHOIS privacy** (default on most modern registrars).
2. Enable **DNSSEC** if supported by your registrar and DNS provider.
3. Redirect `www.<domain>` → `<domain>` (or vice versa) with HTTP `308` so canonical URLs stay consistent.
4. Set `NEXT_PUBLIC_SITE_URL=https://<your-domain>` in your host's environment variables so `<link rel="canonical">`, Open Graph URLs, `robots.txt`, and `sitemap.xml` reference the exact verified origin.
5. Before sending contact notifications from a custom domain via `RESEND_API_KEY` + `CONTACT_FROM_EMAIL`, verify your domain in Resend and add **SPF**, **DKIM**, and **DMARC** (`p=quarantine` or `p=reject`) DNS records.

---

## 3. Pre-Launch Publication Gate Checklist

Production builds (`NODE_ENV=production`) enforce strict filtering automatically:

- Candidate projects remain hidden (`404` on `/projects/[slug]` and excluded from `/api/projects` and `sitemap.xml`) until **both** `visibility: "published"` and `ownerApproved: true` are set in `content/projects/<slug>.ts`.
- Unapproved external links (`approved: false`) are stripped from both HTML pages and JSON APIs.
- Unapproved contact placeholders (`email`, `linkedin`) in `content/profile.ts` are omitted until `approved: true` and verified `href` values are set.

Before making the site public:

1. Confirm `displayName` and `displayNameConfirmed: true` in `content/profile.ts`.
2. Review each case study in `content/projects/` and publish at least **two** verified projects by setting `ownerApproved: true` and `visibility: "published"` (plus allowlisted GitHub links with `approved: true`).
3. Verify `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run test`, and `npm.cmd run build` all pass locally.

---

## 4. Deployment Steps (GitHub + Vercel)

1. **Initialize Git & push to GitHub** (review `git status` to ensure no `.env*` secrets are staged):
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio application"
   # Push to a private or public repository under https://github.com/waqas-cpu
   ```
2. **Connect Repository to Vercel**:
   - Sign in at Vercel, import your portfolio repository, and keep framework preset as **Next.js**.
   - Leave Root Directory as `.` and Build Command as `npm run build`.
3. **Configure Environment Variables (Production + Preview)**:
   - `NEXT_PUBLIC_SITE_URL`: `https://<your-confirmed-domain>` (omit until domain is live, or set after domain binding).
   - `RESEND_API_KEY`: server-side API key from Resend (for `POST /api/contact`).
   - `CONTACT_TO_EMAIL`: destination inbox receiving inquiries (never exposed in browser JS).
   - `CONTACT_FROM_EMAIL`: verified sender (e.g. `Portfolio Contact <contact@yourdomain.dev>`).
4. **Attach Custom Domain**:
   - In Vercel Project Settings → Domains, add `<yourdomain>` and follow the DNS `A` / `CNAME` instructions at your registrar.
5. **Post-Deployment Smoke Verification**:
   - `GET https://<domain>/api/health` → expect `200`, `status: "ok"`, `contactDeliveryConfigured: true`.
   - `GET https://<domain>/api/profile` → verify public profile JSON and zero placeholder hints.
   - `GET https://<domain>/api/projects` → verify only published projects appear.
   - Open `/`, `/projects`, `/about`, `/now`, `/contact`, `/robots.txt`, and `/sitemap.xml` across desktop and mobile viewports.

---

## 5. Rollback & Recovery

- **Instant deployment rollback:** In the Vercel Deployments tab, promote the previous known-good deployment back to Production immediately (takes seconds without waiting for a rebuild).
- **Content-level rollback:** Revert the commit or flip `ownerApproved: false` / `visibility: "draft"` in the affected `content/projects/<slug>.ts` file and redeploy.
- **Abuse mitigation:** If spam hits `/api/contact`, temporarily remove `RESEND_API_KEY` / `CONTACT_WEBHOOK_URL` in host environment variables to fail-safe to `503 DELIVERY_NOT_CONFIGURED` while keeping the rest of the portfolio online.
