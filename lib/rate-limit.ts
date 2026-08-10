interface RateLimitStore {
  [ip: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export function checkRateLimit(ip: string, limit = 10, windowMs = 60 * 1000): { success: boolean; remaining: number } {
  const now = Date.now();
  const record = store[ip];

  if (!record || now > record.resetTime) {
    store[ip] = {
      count: 1,
      resetTime: now + windowMs,
    };
    return { success: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0 };
  }

  record.count += 1;
  return { success: true, remaining: limit - record.count };
}
