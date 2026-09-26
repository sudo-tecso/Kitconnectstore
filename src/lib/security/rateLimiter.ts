// Memory and IP-based rate limiter for public order tracking & OTP verification
const RATE_LIMIT_STORE = new Map<string, { count: number; windowStart: number }>();

export class RateLimiter {
  static check(key: string, maxAttempts = 5, windowMs = 15 * 60 * 1000): {
    allowed: boolean;
    remaining: number;
    resetTimeMs: number;
  } {
    const now = Date.now();
    const entry = RATE_LIMIT_STORE.get(key);

    if (!entry || now - entry.windowStart > windowMs) {
      RATE_LIMIT_STORE.set(key, { count: 1, windowStart: now });
      return { allowed: true, remaining: maxAttempts - 1, resetTimeMs: now + windowMs };
    }

    if (entry.count >= maxAttempts) {
      return {
        allowed: false,
        remaining: 0,
        resetTimeMs: entry.windowStart + windowMs,
      };
    }

    entry.count += 1;
    return {
      allowed: true,
      remaining: maxAttempts - entry.count,
      resetTimeMs: entry.windowStart + windowMs,
    };
  }

  static reset(key: string): void {
    RATE_LIMIT_STORE.delete(key);
  }
}
