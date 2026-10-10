const { GoogleGenerativeAI } = require('@google/generative-ai');
const { kv } = require('@vercel/kv');
const fs = require('fs');
const path = require('path');
import { rateLimit, getClientIp } from './lib/rate-limit.js';

// Gemini 1.5 Flash is no longer a current production model. Keep the model configurable
// while using the stable low-latency default for new deployments.
const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';

// Rate limit: 30 requests per minute per IP (prevents bot abuse / key burn).
const CHAT_RATE_LIMIT = { prefix: 'chat', limit: 30, windowSec: 60 };

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting (fail-open if KV unavailable).
  const rl = await rateLimit({ ...CHAT_RATE_LIMIT, key: getClientIp(req) });
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

  try {
    const { messages } = req.body || {};

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Input hardening: reject oversized payloads before spending any model tokens.
    if (messages.length > 40) {
      return res.status(400).json({ error: 'Conversation is too long (max 40 messages)' });
    }
    let totalChars = 0;
    for (const msg of messages) {
      if (!msg || (msg.role !== 'user' && msg.role !== 'assistant' && msg.role !== 'model')) {
        return res.status(400).json({ error: 'Each message needs a valid role' });
      }
      if (typeof msg.content !== 'string' || msg.content.length > 4000) {
        return res.status(400).json({ error: 'Each message must be text (max 4000 characters)' });
      }
      totalChars += msg.content.length;
    }
    if (totalChars > 20000) {
      return res.status(413).json({ error: 'Conversation is too large' });
    }

    // Get the latest user message
    const lastMessage = messages[messages.length - 1].content;
    if (!lastMessage || typeof lastMessage !== 'string') {
      return res.status(400).json({ error: 'The latest message must contain text' });
    }
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ error: 'GEMINI_API_KEY is not configured in Vercel' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Load base resume
    const resumePath = path.join(process.cwd(), 'Unknown', 'src', 'components', 'PortfolioAssistant', 'base-resume.txt');
    let baseResume = '';
    try {
      baseResume = fs.readFileSync(resumePath, 'utf8');
    } catch (e) {
      console.error('Failed to read base resume:', e);
      baseResume = 'Name: Gopichand Dandimeni\nRole: Cybersecurity & Digital Forensics Expert';
    }

    // Load dynamic facts from KV
    let dynamicFacts = [];
    try {
      if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        dynamicFacts = await kv.lrange('dynamic_knowledge', 0, -1) || [];
      }
    } catch (e) {
      console.error('Failed to fetch from KV:', e);
    }

    // Construct the strict system prompt
    const systemPrompt = `You are the personal AI assistant for Gopichand Dandimeni. 
Your ONLY job is to answer questions about their skills, experience, portfolio, and contact info. 
If a user asks about anything unrelated (like coding help, general knowledge, jokes, etc.), you MUST politely decline and steer the conversation back to Gopichand.
Be concise, professional, and helpful.

FORMATTING RULES:
- Use bullet points (- or *) for lists of skills, projects, or experiences.
- Use bold text (**text**) to highlight key terms, roles, or project names.
- When presenting multiple related items (like contact details or project links), use simple Markdown tables.
- Keep paragraphs short and readable.
- Do not use raw JSON or complex markdown elements that might break a simple chat UI.

BASE KNOWLEDGE:
${baseResume}

DYNAMIC KNOWLEDGE (recently added facts):
${dynamicFacts.join('\n')}
`;

    // Setup Gemini model
    const model = genAI.getGenerativeModel({ 
      model: MODEL_NAME,
      systemInstruction: systemPrompt
    });

    // Format history for Gemini
    const history = messages.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const chat = model.startChat({ history });

    // Stream the response
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const result = await chat.sendMessageStream(lastMessage);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        // Format as SSE (Server-Sent Events)
        res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
      }
    }
    
    res.write('data: [DONE]\n\n');
    res.end();

  } catch (error) {
    console.error('Chat API Error:', error);
    const reason = error && typeof error.message === 'string' ? error.message : '';
    const safeReason = /api key|permission|quota|model|not found|invalid|available/i.test(reason)
      ? reason.slice(0, 240)
      : 'The AI provider did not return a response';
    if (!res.headersSent) {
      res.status(500).json({ error: safeReason });
    } else {
      res.write(`data: ${JSON.stringify({ error: safeReason })}\n\n`);
      res.end();
    }
  }
};
