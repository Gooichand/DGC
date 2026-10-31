import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression';
import * as babel from '@babel/core';
import { generateSeoHtml } from './seo-plugin.js';

// The Creative portfolio is served as a folder on the same host as the main
// "THE SERIES" site, e.g. https://gooichand-github-io.vercel.app/Creative/. Everything in
// this app references public assets with root-absolute paths ("/textures/..."),
// which only work at a domain root. The plugin below rewrites those literals to
// be base-aware so they keep working under the /Creative/ base. Override with
// CREATIVE_BASE if you deploy somewhere else (use "/" for a root/subdomain).
const BASE_PATH = process.env.CREATIVE_BASE ?? '/Creative/';

const ASSET_SEGMENTS = 'textures|images|sounds|fonts|videos|audio';
const ABS_ASSET_RE = new RegExp(`^/(?:${ASSET_SEGMENTS})/`);
const HAS_ASSET_RE = new RegExp(`/(?:${ASSET_SEGMENTS})/`);
const CSS_URL_RE = new RegExp(`(url\\(\\s*['"]?)/(${ASSET_SEGMENTS}/)`, 'g');

function baseExpr(t) {
  return t.memberExpression(
    t.memberExpression(
      t.memberExpression(t.identifier('import'), t.identifier('meta')),
      t.identifier('env')
    ),
    t.identifier('BASE_URL')
  );
}

function basePublicAssets() {
  return {
    name: 'base-public-assets',
    enforce: 'pre',
    transform(code, id) {
      if (id.includes('node_modules')) return null;
      const file = id.split('?')[0];

      // Stylesheet url() references to public assets.
      if (/\.(css|scss|sass|less|styl)$/.test(file)) {
        if (!HAS_ASSET_RE.test(code)) return null;
        const out = code.replace(CSS_URL_RE, `$1${BASE_PATH}$2`);
        return out === code ? null : { code: out, map: null };
      }

      if (!/\.(jsx?|tsx?|mjs)$/.test(file)) return null;
      if (!HAS_ASSET_RE.test(code)) return null;

      const plugin = () => ({
        visitor: {
          // '/textures/x.webp'  ->  import.meta.env.BASE_URL + 'textures/x.webp'
          StringLiteral(path) {
            const value = path.node.value;
            if (typeof value === 'string' && ABS_ASSET_RE.test(value)) {
              const expr = babel.types.binaryExpression(
                '+',
                baseExpr(babel.types),
                babel.types.stringLiteral(value.slice(1))
              );
              // JSX attributes only accept a StringLiteral or an expression container.
              if (path.parentPath?.isJSXAttribute()) {
                path.parentPath.node.value = babel.types.jsxExpressionContainer(expr);
              } else {
                path.replaceWith(expr);
              }
            }
          },
          // `/textures/${name}.webp`  ->  import.meta.env.BASE_URL + `textures/${name}.webp`
          TemplateLiteral(path) {
            const first = path.node.quasis[0];
            if (first?.value && typeof first.value.raw === 'string' && ABS_ASSET_RE.test(first.value.raw)) {
              first.value.raw = first.value.raw.slice(1);
              if (typeof first.value.cooked === 'string') first.value.cooked = first.value.cooked.slice(1);
              path.replaceWith(babel.types.binaryExpression('+', baseExpr(babel.types), path.node));
            }
          },
        },
      });

      const result = babel.transformSync(code, {
        filename: file,
        babelrc: false,
        configFile: false,
        compact: false,
        retainLines: true,
        sourceMaps: false,
        parserOpts: { plugins: ['jsx', 'typescript'], sourceType: 'module' },
        plugins: [plugin],
      });
      return result?.code ? { code: result.code, map: null } : null;
    },
  };
}

// The standalone /start landing page is a static file under /public. Under the
// /Creative/ base it is reached at /Creative/start/; rewrite both the base-less
// and base-prefixed variants to the actual index.html file.
const START_PAGE_PATHS = new Set([
  '/start', '/start/',
  `${BASE_PATH}start`, `${BASE_PATH}start/`,
]);

function rewriteStartPage(req, _res, next) {
  const [pathname, query = ''] = req.url.split('?');

  if (START_PAGE_PATHS.has(pathname)) {
    const prefix = pathname.startsWith(BASE_PATH) ? BASE_PATH : '';
    req.url = `${prefix}start/index.html${query ? `?${query}` : ''}`;
  }

  next();
}

function serveStaticStartPage() {
  return {
    name: 'serve-static-start-page',
    configureServer(server) {
      server.middlewares.use(rewriteStartPage);
    },
    configurePreviewServer(server) {
      server.middlewares.use(rewriteStartPage);
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: BASE_PATH,
  plugins: [basePublicAssets(), serveStaticStartPage(), react(), viteCompression(), generateSeoHtml()],
  server: {
    proxy: {
      '/sanity-cdn': {
        target: 'https://cdn.sanity.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sanity-cdn/, '')
      }
    }
  }
})
