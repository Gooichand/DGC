// Minimal dependency-free static server for developing the standalone Unknown
// portfolio. The main dev server proxies /Unknown -> this (see vite.config.ts),
// mirroring how /Creative -> Creative's Vite dev server.
//
//   node scripts/serve-unknown.mjs [port] [dir]
//
// Defaults: port 5175, dir ./Unknown
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';

const port = Number(process.argv[2] || 5175);
const root = resolve(process.argv[3] || 'Unknown');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.avif': 'image/avif',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.eot': 'application/vnd.ms-fontobject',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.pdf': 'application/pdf',
  '.wasm': 'application/wasm',
  '.map': 'application/json; charset=utf-8',
};

const send = (res, status, body, headers = {}) => {
  res.writeHead(status, headers);
  res.end(body);
};

const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    // Map the URL path onto the served root, refusing traversal outside it.
    const target = normalize(join(root, pathname));
    if (target !== root && !target.startsWith(root + sep)) {
      return send(res, 403, 'Forbidden');
    }

    let info;
    try {
      info = await stat(target);
    } catch {
      // Mirror GitHub Pages: serve 404.html for unknown paths.
      try {
        return send(res, 404, await readFile(join(root, '404.html')), {
          'Content-Type': MIME['.html'],
        });
      } catch {
        return send(res, 404, 'Not found');
      }
    }

    if (info.isDirectory()) {
      if (!pathname.endsWith('/')) {
        return send(res, 301, '', { Location: pathname + '/' });
      }
      return send(res, 200, await readFile(join(target, 'index.html')), {
        'Content-Type': MIME['.html'],
      });
    }

    send(res, 200, await readFile(target), {
      'Content-Type': MIME[extname(target).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
  } catch (err) {
    send(res, 500, 'Server error');
  }
});

server.listen(port, () => {
  console.log(`Unknown static server: http://localhost:${port}  (root: ${root})`);
});
