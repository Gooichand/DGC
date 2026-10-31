'use strict';

import { Resend } from 'resend';
import { kv } from '@vercel/kv';

// Built lazily so importing this module never throws when the key is absent.
const resendClient = () => new Resend(process.env.RESEND_API_KEY);

const MAX_PAYLOAD_BYTES = Number(process.env.VISITOR_ALERT_MAX_PAYLOAD_BYTES || 25000);
const MAX_NAME_LENGTH = Number(process.env.VISITOR_ALERT_MAX_NAME_LENGTH || 80);
const DEFAULT_COOLDOWN = Number(process.env.VISITOR_ALERT_COOLDOWN_SECONDS || 1800);
const DAILY_LIMIT = Number(process.env.VISITOR_ALERT_DAILY_LIMIT || 250);

const hasRedis = Boolean(
  process.env.KV_REST_API_URL &&
  process.env.KV_REST_API_TOKEN
);

function text(value, limit = 240) {
  if (value === null || value === undefined) return 'Unavailable';
  return String(value).replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, limit) || 'Unavailable';
}

function html(value, limit = 240) {
  return text(value, limit)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function list(value, limit = 12) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, limit).map((item) => text(item, 120));
}

function bool(value) {
  return value === true ? 'Yes' : value === false ? 'No' : 'Unavailable';
}

function rows(entries) {
  return entries.map(([label, value]) => `
    <tr><th>${html(label)}</th><td>${html(value)}</td></tr>
  `).join('');
}

function section(title, entries) {
  return `
    <h2>${html(title)}</h2>
    <table>${rows(entries)}</table>
  `;
}

function getRequestIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) return text(String(forwarded).split(',')[0], 80);
  return text(req.headers['x-real-ip'] || req.headers['cf-connecting-ip'], 80);
}

function safeKey(value) {
  return text(value, 96).replace(/[^a-zA-Z0-9._:-]/g, '_') || 'unknown';
}

function hasUsableIp(ip) {
  return Boolean(ip && ip !== 'Unavailable' && !/^(unknown|unavailable|127\.|0\.0\.0\.0|::1|10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/i.test(ip));
}

function header(req, name) {
  const value = req.headers?.[name];
  return Array.isArray(value) ? value[0] : value;
}

function vercelGeo(req) {
  const geo = {
    city: text(header(req, 'x-vercel-ip-city')),
    region: text(header(req, 'x-vercel-ip-country-region')),
    country: text(header(req, 'x-vercel-ip-country')),
    countryName: text(header(req, 'x-vercel-ip-country-name')),
    postalCode: text(header(req, 'x-vercel-ip-postal-code')),
    latitude: text(header(req, 'x-vercel-ip-latitude')),
    longitude: text(header(req, 'x-vercel-ip-longitude')),
    timezone: text(header(req, 'x-vercel-ip-timezone')),
    isp: 'Unavailable',
    asn: text(header(req, 'x-vercel-ip-asn')),
    vpn: 'Unavailable',
    tor: 'Unavailable',
    proxy: 'Unavailable',
    hosting: 'Unavailable',
    provider: 'Vercel edge geolocation'
  };
  return Object.values(geo).some((value) => value !== 'Unavailable' && value !== 'Vercel edge geolocation') ? geo : null;
}

async function lookupIpGeo(ip, req) {
  const edgeGeo = vercelGeo(req);
  if (!hasUsableIp(ip) || process.env.VISITOR_ALERT_GEO_ENABLED === 'false') {
    return edgeGeo || {
      city: 'Unavailable', region: 'Unavailable', country: 'Unavailable', countryName: 'Unavailable',
      postalCode: 'Unavailable', latitude: 'Unavailable', longitude: 'Unavailable', timezone: 'Unavailable',
      isp: 'Unavailable', asn: 'Unavailable', vpn: 'Unavailable', tor: 'Unavailable', proxy: 'Unavailable', hosting: 'Unavailable', provider: 'Unavailable'
    };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4500);
    const response = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, {
      headers: { Accept: 'application/json', 'User-Agent': 'Portfolio visitor alert geolocation' },
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!response.ok) throw new Error(`Geo lookup failed: ${response.status}`);
    const result = await response.json();
    if (result.success === false) throw new Error('Geo lookup returned no result');
    const lookup = {
      city: text(result.city),
      region: text(result.region),
      country: text(result.country_code),
      countryName: text(result.country),
      postalCode: text(result.postal),
      latitude: text(result.latitude),
      longitude: text(result.longitude),
      timezone: text(result.timezone?.id),
      isp: text(result.connection?.isp),
      asn: text(result.connection?.asn),
      vpn: bool(result.security?.vpn),
      tor: bool(result.security?.tor),
      proxy: bool(result.security?.proxy),
      hosting: bool(result.security?.hosting),
      provider: edgeGeo ? 'Vercel + ipwho.is (approximate)' : 'ipwho.is (approximate)'
    };
    return edgeGeo ? {
      ...edgeGeo,
      ...lookup,
      city: lookup.city !== 'Unavailable' ? lookup.city : edgeGeo.city,
      region: lookup.region !== 'Unavailable' ? lookup.region : edgeGeo.region,
      country: lookup.country !== 'Unavailable' ? lookup.country : edgeGeo.country,
      countryName: lookup.countryName !== 'Unavailable' ? lookup.countryName : edgeGeo.countryName,
      postalCode: lookup.postalCode !== 'Unavailable' ? lookup.postalCode : edgeGeo.postalCode,
      latitude: lookup.latitude !== 'Unavailable' ? lookup.latitude : edgeGeo.latitude,
      longitude: lookup.longitude !== 'Unavailable' ? lookup.longitude : edgeGeo.longitude,
      timezone: lookup.timezone !== 'Unavailable' ? lookup.timezone : edgeGeo.timezone
    } : lookup;
  } catch (_) {
    return {
      city: 'Unavailable', region: 'Unavailable', country: 'Unavailable', countryName: 'Unavailable',
      postalCode: 'Unavailable', latitude: 'Unavailable', longitude: 'Unavailable', timezone: 'Unavailable',
      isp: edgeGeo?.isp || 'Unavailable', asn: edgeGeo?.asn || 'Unavailable', vpn: edgeGeo?.vpn || 'Unavailable', tor: edgeGeo?.tor || 'Unavailable', proxy: edgeGeo?.proxy || 'Unavailable', hosting: edgeGeo?.hosting || 'Unavailable', provider: edgeGeo ? 'Vercel edge geolocation only' : 'Lookup unavailable'
    };
  }
}

function redisEnabled() {
  return hasRedis && typeof kv?.get === 'function' && typeof kv?.set === 'function';
}

async function reserveSlot(sessionId) {
  if (!redisEnabled()) return { allowed: true, reason: 'redis-not-configured' };

  const cooldown = Math.max(60, Math.min(DEFAULT_COOLDOWN, 86400));
  const day = new Date().toISOString().slice(0, 10);
  const sessionKey = `visitor-alert:cooldown:${safeKey(sessionId)}`;
  const dailyKey = `visitor-alert:daily:${day}`;

  const existing = await kv.get(sessionKey);
  if (existing) return { allowed: false, reason: 'cooldown' };

  const count = Number(await kv.incr(dailyKey));
  if (count === 1) await kv.expire(dailyKey, 172800);
  if (count > Math.max(1, DAILY_LIMIT)) return { allowed: false, reason: 'daily-limit' };

  await kv.set(sessionKey, '1', { ex: cooldown });
  return { allowed: true, reason: 'reserved', sessionKey };
}

function normalizePayload(body, req) {
  const source = body && typeof body === 'object' ? body : {};
  const visit = source.visit && typeof source.visit === 'object' ? source.visit : {};
  const browser = source.browser && typeof source.browser === 'object' ? source.browser : {};
  const display = source.display && typeof source.display === 'object' ? source.display : {};
  const activity = source.activity && typeof source.activity === 'object' ? source.activity : {};
  const performance = source.performance && typeof source.performance === 'object' ? source.performance : {};

  return {
    name: text(source.name || 'Guest', MAX_NAME_LENGTH),
    sessionId: text(source.sessionId, 96),
    anonymousId: text(source.anonymousId, 96),
    visit: {
      observedAtUtc: text(visit.observedAtUtc, 80),
      localTime: text(visit.localTime, 120),
      landingUrl: text(visit.landingUrl, 600),
      currentUrl: text(visit.currentUrl, 600),
      pagePath: text(visit.pagePath, 240),
      pageTitle: text(visit.pageTitle, 240),
      referrer: text(visit.referrer, 600),
      hash: text(visit.hash, 120),
      utmSource: text(visit.utmSource, 120),
      utmMedium: text(visit.utmMedium, 120),
      utmCampaign: text(visit.utmCampaign, 120),
      utmTerm: text(visit.utmTerm, 120),
      utmContent: text(visit.utmContent, 120)
    },
    display: {
      screen: text(display.screen, 80),
      viewport: text(display.viewport, 80),
      availableScreen: text(display.availableScreen, 80),
      outerWindow: text(display.outerWindow, 80),
      pixelRatio: text(display.pixelRatio, 40),
      colorDepth: text(display.colorDepth, 40),
      orientation: text(display.orientation, 80),
      orientationAngle: text(display.orientationAngle, 40),
      colorGamut: text(display.colorGamut, 40),
      hdr: bool(display.hdr)
    },
    browser: {
      userAgent: text(browser.userAgent, 600),
      vendor: text(browser.vendor, 160),
      platform: text(browser.platform, 160),
      language: text(browser.language, 80),
      languages: list(browser.languages).join(', ') || 'Unavailable',
      timezone: text(browser.timezone, 100),
      timezoneOffset: text(browser.timezoneOffset, 40),
      cookies: bool(browser.cookies),
      localStorage: bool(browser.localStorage),
      sessionStorage: bool(browser.sessionStorage),
      indexedDb: bool(browser.indexedDb),
      online: bool(browser.online),
      doNotTrack: text(browser.doNotTrack, 40),
      globalPrivacyControl: bool(browser.globalPrivacyControl),
      touch: bool(browser.touch),
      maxTouchPoints: text(browser.maxTouchPoints, 40),
      pointer: text(browser.pointer, 40),
      hover: text(browser.hover, 40),
      colorScheme: text(browser.colorScheme, 40),
      reducedMotion: text(browser.reducedMotion, 40),
      highContrast: text(browser.highContrast, 40),
      forcedColors: text(browser.forcedColors, 40),
      webgl: bool(browser.webgl),
      webglRenderer: text(browser.webglRenderer, 180),
      cpuCores: text(browser.cpuCores, 40),
      deviceMemory: text(browser.deviceMemory, 40),
      saveData: bool(browser.saveData),
      connectionType: text(browser.connectionType, 40),
      effectiveType: text(browser.effectiveType, 40),
      downlink: text(browser.downlink, 40),
      rtt: text(browser.rtt, 40)
    },
    activity: {
      firstSection: text(activity.firstSection, 120),
      sectionsViewed: list(activity.sectionsViewed, 30).join(', ') || 'None recorded',
      scrollDepth: text(activity.scrollDepth, 80),
      timeOnPage: text(activity.timeOnPage, 80),
      galleryActions: list(activity.galleryActions, 12).join(', ') || 'None recorded',
      profileViewed: bool(activity.profileViewed),
      educationViewed: bool(activity.educationViewed),
      contactOpened: bool(activity.contactOpened),
      cvDownloaded: bool(activity.cvDownloaded),
      chatOpened: bool(activity.chatOpened),
      entryChoice: text(activity.entryChoice, 80)
    },
    performance: {
      domInteractive: text(performance.domInteractive, 60),
      domContentLoaded: text(performance.domContentLoaded, 60),
      firstPaint: text(performance.firstPaint, 60),
      largestContentfulPaint: text(performance.largestContentfulPaint, 60),
      cumulativeLayoutShift: text(performance.cumulativeLayoutShift, 60),
      firstInputDelay: text(performance.firstInputDelay, 60),
      failedAssets: text(performance.failedAssets, 60),
      javascriptErrors: text(performance.javascriptErrors, 60),
      networkRequests: text(performance.networkRequests, 60),
      webglStartup: text(performance.webglStartup, 80)
    },
    requestIp: getRequestIp(req),
    request: {
      method: text(req.method, 20),
      protocol: text(header(req, 'x-forwarded-proto'), 40),
      host: text(header(req, 'x-forwarded-host') || header(req, 'host'), 240),
      vercelId: text(header(req, 'x-vercel-id'), 160),
      vercelRegion: text(header(req, 'x-vercel-ip-country-region'), 80),
      cloudflareRay: text(header(req, 'cf-ray'), 120),
      forwardedFor: text(header(req, 'x-forwarded-for'), 240),
      realIpHeader: text(header(req, 'x-real-ip') || header(req, 'cf-connecting-ip'), 80)
    },
    geo: null
  };
}

function buildEmail(data) {
  const subject = `PORTFOLIO VISITOR DETECTED — ${data.name} — ${data.visit.localTime}`;
  const htmlBody = `<!doctype html><html><head><meta charset="utf-8"><style>
    body{margin:0;background:#071014;color:#dff8f2;font:14px Arial,sans-serif}main{max-width:760px;margin:0 auto;padding:28px;background:#0b171c;border:1px solid #1b514c}h1{margin:0;color:#00ff41;font-size:24px}h2{margin:28px 0 8px;color:#61e7ff;font-size:14px;letter-spacing:1px;text-transform:uppercase}p{color:#a9c7c1}table{width:100%;border-collapse:collapse;background:#071014}th,td{padding:9px 10px;border:1px solid #17353a;text-align:left;vertical-align:top}th{width:32%;color:#00ff41;font-weight:700}td{color:#dff8f2;word-break:break-word}.status{margin:14px 0;padding:12px;border-left:4px solid #00ff41;background:#10261d;color:#b7ffd1}.notice{margin-top:26px;color:#88aaa5;font-size:12px}</style></head><body><main>
    <h1>PORTFOLIO VISITOR DETECTED</h1>
    <div class="status">SESSION STATUS: MONITORING<br>VISITOR-PROVIDED IDENTITY: DISPLAY NAME ONLY<br>NETWORK DATA: SERVER-OBSERVED / APPROXIMATE</div>
    ${section('Subject Profile', [['Display Name', data.name], ['Session ID', data.sessionId], ['Anonymous ID', data.anonymousId], ['Observed UTC', data.visit.observedAtUtc], ['Visitor Local Time', data.visit.localTime]])}
    ${section('Page Context', [['Landing URL', data.visit.landingUrl], ['Current URL', data.visit.currentUrl], ['Page Path', data.visit.pagePath], ['Page Title', data.visit.pageTitle], ['Entry Referrer', data.visit.referrer], ['URL Hash', data.visit.hash], ['UTM Source', data.visit.utmSource], ['UTM Medium', data.visit.utmMedium], ['UTM Campaign', data.visit.utmCampaign], ['UTM Term', data.visit.utmTerm], ['UTM Content', data.visit.utmContent]])}
    ${section('Display Metrics', [['Screen', data.display.screen], ['Viewport', data.display.viewport], ['Available Screen', data.display.availableScreen], ['Outer Window', data.display.outerWindow], ['Pixel Ratio', data.display.pixelRatio], ['Color Depth', data.display.colorDepth], ['Orientation', data.display.orientation], ['Orientation Angle', data.display.orientationAngle], ['Color Gamut', data.display.colorGamut], ['HDR', data.display.hdr]])}
    ${section('Browser & System', [['User Agent', data.browser.userAgent], ['Vendor', data.browser.vendor], ['Platform', data.browser.platform], ['Language', data.browser.language], ['Languages', data.browser.languages], ['Timezone', data.browser.timezone], ['Timezone Offset', data.browser.timezoneOffset], ['Cookies', data.browser.cookies], ['Local Storage', data.browser.localStorage], ['Session Storage', data.browser.sessionStorage], ['IndexedDB', data.browser.indexedDb], ['Online Status', data.browser.online], ['Do Not Track', data.browser.doNotTrack], ['Global Privacy Control', data.browser.globalPrivacyControl], ['Touch Support', data.browser.touch], ['Maximum Touch Points', data.browser.maxTouchPoints], ['Pointer', data.browser.pointer], ['Hover', data.browser.hover], ['Color Scheme', data.browser.colorScheme], ['Reduced Motion', data.browser.reducedMotion], ['High Contrast', data.browser.highContrast], ['Forced Colors', data.browser.forcedColors], ['WebGL', data.browser.webgl], ['WebGL Renderer', data.browser.webglRenderer], ['CPU Cores', data.browser.cpuCores], ['Device Memory', data.browser.deviceMemory], ['Save Data', data.browser.saveData], ['Connection Type', data.browser.connectionType], ['Effective Type', data.browser.effectiveType], ['Downlink', data.browser.downlink], ['RTT', data.browser.rtt]])}
    ${section('Visit Activity', [['First Section', data.activity.firstSection], ['Sections Viewed', data.activity.sectionsViewed], ['Scroll Depth', data.activity.scrollDepth], ['Time on Page', data.activity.timeOnPage], ['Gallery Actions', data.activity.galleryActions], ['Profile Viewed', data.activity.profileViewed], ['Education Viewed', data.activity.educationViewed], ['Contact Opened', data.activity.contactOpened], ['CV Downloaded', data.activity.cvDownloaded], ['AI Assistant Opened', data.activity.chatOpened], ['Entry Choice', data.activity.entryChoice]])}
    ${section('Server & Network', [['Server-observed Request IP', data.requestIp], ['Geolocation Provider', data.geo.provider], ['City', data.geo.city], ['Region / State', data.geo.region], ['Country', data.geo.countryName !== 'Unavailable' ? `${data.geo.countryName} (${data.geo.country})` : data.geo.country], ['Postal Code', data.geo.postalCode], ['Coordinates', data.geo.latitude !== 'Unavailable' && data.geo.longitude !== 'Unavailable' ? `${data.geo.latitude}, ${data.geo.longitude}` : 'Unavailable'], ['Timezone', data.geo.timezone], ['ISP', data.geo.isp], ['ASN', data.geo.asn], ['VPN Detected', data.geo.vpn], ['Tor Detected', data.geo.tor], ['Proxy Detected', data.geo.proxy], ['Hosting / Datacenter', data.geo.hosting]])}
    ${section('Performance', [['DOM Interactive', data.performance.domInteractive], ['DOM Content Loaded', data.performance.domContentLoaded], ['First Paint', data.performance.firstPaint], ['Largest Contentful Paint', data.performance.largestContentfulPaint], ['Cumulative Layout Shift', data.performance.cumulativeLayoutShift], ['First Input Delay', data.performance.firstInputDelay], ['Failed Assets', data.performance.failedAssets], ['JavaScript Errors', data.performance.javascriptErrors], ['Network Requests', data.performance.networkRequests], ['WebGL Startup', data.performance.webglStartup]])}
    <p class="notice">Values are visitor-provided, browser-reported, or server-observed and may be approximate. This notification does not verify a visitor's real identity or physical location.</p>
  </main></body></html>`;

  const plain = [
    'PORTFOLIO VISITOR DETECTED',
    `Display Name: ${data.name}`,
    `Session ID: ${data.sessionId}`,
    `Anonymous ID: ${data.anonymousId}`,
    `Observed UTC: ${data.visit.observedAtUtc}`,
    `Visitor Local Time: ${data.visit.localTime}`,
    `Current URL: ${data.visit.currentUrl}`,
    `Referrer: ${data.visit.referrer}`,
    `Screen: ${data.display.screen}`,
    `Viewport: ${data.display.viewport}`,
    `User Agent: ${data.browser.userAgent}`,
    `Timezone: ${data.browser.timezone}`,
    `Sections Viewed: ${data.activity.sectionsViewed}`,
    `Time on Page: ${data.activity.timeOnPage}`,
    `Server-observed Request IP: ${data.requestIp}`,
    `Geolocation Provider: ${data.geo.provider}`,
    `Location: ${data.geo.city}, ${data.geo.region}, ${data.geo.countryName} (${data.geo.country})`,
    `Postal Code: ${data.geo.postalCode}`,
    `Coordinates: ${data.geo.latitude}, ${data.geo.longitude}`,
    `Timezone: ${data.geo.timezone}`,
    `ISP: ${data.geo.isp}`,
    `ASN: ${data.geo.asn}`,
    `VPN Detected: ${data.geo.vpn}`,
    `Tor Detected: ${data.geo.tor}`,
    `Proxy Detected: ${data.geo.proxy}`,
    `Hosting / Datacenter: ${data.geo.hosting}`,
    `Request Protocol: ${data.request.protocol}`,
    `Request Host: ${data.request.host}`,
    `Vercel Request ID: ${data.request.vercelId}`,
    `Vercel Region: ${data.request.vercelRegion}`,
    `Cloudflare Ray ID: ${data.request.cloudflareRay}`,
    `Forwarded-For Chain: ${data.request.forwardedFor}`
  ].join('\n');

  return { subject, html: htmlBody, text: plain };
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  if (process.env.VISITOR_ALERT_ENABLED !== 'true') {
    return res.status(503).json({ ok: false, error: 'Visitor alerts are not configured' });
  }

  if (!process.env.RESEND_API_KEY || !process.env.ALERT_EMAIL) {
    return res.status(503).json({ ok: false, error: 'Visitor alerts are not configured' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (_) { body = null; }
  }
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ ok: false, error: 'Invalid request body' });
  }

  const approximateSize = Buffer.byteLength(JSON.stringify(body), 'utf8');
  if (approximateSize > MAX_PAYLOAD_BYTES) {
    return res.status(413).json({ ok: false, error: 'Request too large' });
  }

  const data = normalizePayload(body, req);
  if (!data.sessionId || data.sessionId === 'Unavailable') {
    return res.status(400).json({ ok: false, error: 'Session ID is required' });
  }

  let slot;
  try {
    data.geo = await lookupIpGeo(data.requestIp, req);
    slot = await reserveSlot(data.sessionId);
    if (!slot.allowed) {
      return res.status(200).json({ ok: true, sent: false, reason: slot.reason });
    }

    const message = buildEmail(data);

    const emailResult = await resendClient().emails.send({
      from: 'Portfolio Alert <onboarding@resend.dev>',
      to: [process.env.ALERT_EMAIL],
      subject: `🚨 Visitor Alert: ${data.name}`,
      html: message.html,
      text: message.text,
    });

    return res.status(200).json({ ok: true, sent: true, data: emailResult });
  } catch (error) {
    if (slot?.sessionKey && redisEnabled() && typeof kv.del === 'function') {
      try { await kv.del(slot.sessionKey); } catch (_) {}
    }
    console.error('Visitor alert delivery failed:', error?.message || error);
    return res.status(502).json({ ok: false, error: 'Visitor alert delivery failed' });
  }
};
