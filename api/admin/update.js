const crypto = require('crypto');
const { kv } = require('@vercel/kv');

// Constant-time comparison so response timing can't be used to guess the password.
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const ha = crypto.createHash('sha256').update(a).digest();
  const hb = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password, fact } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return res.status(500).json({ error: 'Admin password not configured on server' });
  }

  if (!safeEqual(password, adminPassword)) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  if (!fact || typeof fact !== 'string' || fact.trim() === '') {
    return res.status(400).json({ error: 'Valid fact text is required' });
  }

  if (fact.length > 2000) {
    return res.status(400).json({ error: 'Fact is too long (max 2000 characters)' });
  }

  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return res.status(500).json({ error: 'Vercel KV is not configured on server' });
  }

  try {
    // Append the new fact to the list
    await kv.rpush('dynamic_knowledge', fact.trim());
    return res.status(200).json({ success: true, message: 'Knowledge updated successfully' });
  } catch (error) {
    console.error('KV Update Error:', error);
    return res.status(500).json({ error: 'Failed to update knowledge base' });
  }
};
