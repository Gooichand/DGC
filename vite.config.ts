import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  // The standalone Creative portfolio is served as a folder on the same host
  // (e.g. https://gooichand.github.io/Creative/ — see Creative/vite.config.js).
  // In local dev this prefix is proxied to the Creative dev server so that
  // clicking the "Creative" profile actually opens it instead of falling back
  // to this app's own SPA index. Override with CREATIVE_DEV_URL in .env.local.
  const creativeDevUrl = env.CREATIVE_DEV_URL || 'http://localhost:5173';

  // The standalone Unknown portfolio is a static site (no build step) served
  // from ./Unknown via scripts/serve-unknown.mjs. Override with UNKNOWN_DEV_URL.
  // Its /api/* serverless backend runs on Vercel; set UNKNOWN_API_URL to proxy
  // those calls there during local dev.
  const unknownDevUrl = env.UNKNOWN_DEV_URL || 'http://localhost:5175';
  const unknownApiUrl = env.UNKNOWN_API_URL;

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/Creative': { target: creativeDevUrl, changeOrigin: true, ws: true },
        '/Unknown': {
          target: unknownDevUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/Unknown/, '') || '/',
        },
        ...(unknownApiUrl ? { '/api': { target: unknownApiUrl, changeOrigin: true } } : {}),
      },
    },
    build: {
      target: 'es2020',
      rollupOptions: {
        output: {
          manualChunks: { motion: ['framer-motion'], react: ['react', 'react-dom'] },
        },
      },
    },
  };
});
