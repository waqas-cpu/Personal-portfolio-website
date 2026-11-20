export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export interface RateLimiter {
  check: (key: string, nowMs?: number) => RateLimitResult;
  reset: () => void;
}

export function createRateLimiter({
  windowMs,
  maxRequests,
}: {
  windowMs: number;
  maxRequests: number;
}): RateLimiter {
  const hits = new Map<string, number[]>();

  function pruneExpired(nowMs: number) {
    for (const [key, timestamps] of hits.entries()) {
      const valid = timestamps.filter((ts) => nowMs - ts < windowMs);
      if (valid.length === 0) {
        hits.delete(key);
      } else {
        hits.set(key, valid);
      }
    }
  }

  return {
    check(key: string, nowMs = Date.now()): RateLimitResult {
      if (hits.size > 1000) {
        pruneExpired(nowMs);
      }

      const existing = hits.get(key) ?? [];
      const active = existing.filter((ts) => nowMs - ts < windowMs);

      if (active.length >= maxRequests) {
        const oldest = active[0] ?? nowMs;
        const retryAfterMs = Math.max(1000, windowMs - (nowMs - oldest));
        hits.set(key, active);
        return {
          allowed: false,
          remaining: 0,
          retryAfterSeconds: Math.ceil(retryAfterMs / 1000),
        };
      }

      active.push(nowMs);
      hits.set(key, active);

      return {
        allowed: true,
        remaining: Math.max(0, maxRequests - active.length),
        retryAfterSeconds: 0,
      };
    },
    reset() {
      hits.clear();
    },
  };
}

export const contactRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 5,
});

export function resetContactRateLimiter(): void {
  contactRateLimiter.reset();
}

export function extractClientIp(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor
      .split(",")
      .map((part) => part.trim())
      .find((part) => part.length > 0 && part.length <= 64);
    if (first) {
      return first;
    }
  }

  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp && realIp.length <= 64) {
    return realIp;
  }

  return "unknown";
}
