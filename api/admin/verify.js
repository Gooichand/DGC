const crypto = require('crypto');
import { rateLimit, getClientIp } from '../lib/rate-limit.js';

// Constant-time comparison so response timing can't be used to guess the password.
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const ha = crypto.createHash('sha256').update(a).digest();
  const hb = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

// Rate limit: 10 attempts/min/IP to harden against brute force.
const ADMIN_RATE_LIMIT = { prefix: 'admin', limit: 10, windowSec: 60 };

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting (fail-open if KV unavailable).
  const rl = await rateLimit({ ...ADMIN_RATE_LIMIT, key: getClientIp(req) });
  if (!rl.ok) {
    res.setHeader('Retry-After', rl.retryAfter);
    res.setHeader('X-RateLimit-Limit', rl.limit);
    res.setHeader('X-RateLimit-Remaining', rl.remaining);
    res.setHeader('X-RateLimit-Reset', rl.reset);
    return res.status(429).json({ error: rl.message, retryAfter: rl.retryAfter });
  }
  res.setHeader('X-RateLimit-Limit', rl.limit);
  res.setHeader('X-RateLimit-Remaining', rl.remaining);
  res.setHeader('X-RateLimit-Reset', rl.reset);

  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return res.status(500).json({ error: 'Admin password not configured on server' });
  }

  if (safeEqual(password, adminPassword)) {
    return res.status(200).json({ success: true });
  } else {
    return res.status(401).json({ error: 'Invalid password' });
  }
};
