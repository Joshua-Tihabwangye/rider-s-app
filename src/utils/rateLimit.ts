/**
 * Rate limiting utilities to prevent abuse
 */

class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const record = this.attempts.get(key);

    if (!record || now > record.resetTime) {
      // Reset or create new record
      this.attempts.set(key, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (record.count >= this.maxAttempts) {
      return false;
    }

    record.count++;
    return true;
  }

  getRemainingAttempts(key: string): number {
    const record = this.attempts.get(key);
    if (!record || Date.now() > record.resetTime) {
      return this.maxAttempts;
    }
    return Math.max(0, this.maxAttempts - record.count);
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}

// Global rate limiters for common operations
export const authRateLimiter = new RateLimiter(5, 300000); // 5 attempts per 5 minutes
export const apiRateLimiter = new RateLimiter(10, 60000); // 10 attempts per minute

export function checkRateLimit(limiter: RateLimiter, key: string, operation: string): boolean {
  if (!limiter.isAllowed(key)) {
    console.warn(`Rate limit exceeded for ${operation} on key: ${key}`);
    return false;
  }
  return true;
}