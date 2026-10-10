// Tiny shared rate limiter using Vercel KV (Upstash Redis).
// No external deps beyond @vercel/kv which is already in the project.
//
// Usage in an API route:
//   import { rateLimit } from '../lib/rate-limit.js';
//   const rl = rateLimit({ prefix: 'chat', limit: 30, windowSec: 60, key: ip });
//   if (!rl.ok) return res.status(429).json({ error: rl.message, retryAfter: rl.retryAfter });
//
// Returns { ok: boolean, limit, remaining, reset, retryAfter?, message? }.

import { kv } from '@vercel/kv';

export async function rateLimit({ prefix, limit, windowSec, key }) {
  if (!key) return { ok: true, limit, remaining: limit, reset: 0 };
  const redisKey = `rl:${prefix}:${key}`;
  try {
    const current = await kv.incr(redisKey);
    if (current === 1) {
      await kv.expire(redisKey, windowSec);
    }
    const ttl = await kv.ttl(redisKey);
    const remaining = Math.max(0, limit - current);
    const ok = current <= limit;
    return {
      ok,
      limit,
      remaining,
      reset: Math.floor(Date.now() / 1000) + (ttl > 0 ? ttl : windowSec),
      retryAfter: ok ? undefined : (ttl > 0 ? ttl : windowSec),
      message: ok ? undefined : `Rate limit exceeded. Try again in ${ttl > 0 ? ttl : windowSec}s.`
    };
  } catch (e) {
    // Fail open: if KV is misconfigured or down, don't block legitimate traffic.
    console.error('[rate-limit] KV error, failing open:', e);
    return { ok: true, limit, remaining: limit, reset: 0 };
  }
}

// Convenience: extract client IP from Vercel request headers.
export function getClientIp(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    'unknown'
  );
}