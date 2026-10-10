// Copies the standalone portfolios into dist/ so the whole site can be deployed
// as a single folder:
//   dist/            the main app
//   dist/Creative/   the built Creative portfolio (Vite)
//   dist/Unknown/    the static Unknown portfolio
// Run with:  npm run build:all
import { cpSync, rmSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { basename, dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// --- Creative (built by Vite) ---
const creativeSource = resolve(root, 'Creative', 'dist');
const creativeTarget = resolve(root, 'dist', 'Creative');

if (!existsSync(creativeSource)) {
  console.error('Creative build not found at Creative/dist — run "npm run build:creative" first.');
  process.exit(1);
}

rmSync(creativeTarget, { recursive: true, force: true });
cpSync(creativeSource, creativeTarget, { recursive: true });
console.log(`Copied Creative build -> ${creativeTarget}`);

// --- Unknown (static — copied as-is) ---
const unknownSource = resolve(root, 'Unknown');
const unknownTarget = resolve(root, 'dist', 'Unknown');
// Dev-only / repo-only entries the deployed static copy doesn't need.
const UNKNOWN_EXCLUDE = new Set([
  'node_modules', '.git', '.opencode', '.vscode', 'api',
  'package.json', 'package-lock.json', 'opencode.json', 'AGENTS.md', '.gitignore',
  'base-resume.txt', // server-only: bundled into the /api function, never served
]);

if (!existsSync(unknownSource)) {
  console.error('Unknown portfolio not found at Unknown/');
  process.exit(1);
}

rmSync(unknownTarget, { recursive: true, force: true });
cpSync(unknownSource, unknownTarget, {
  recursive: true,
  filter: (src) => !UNKNOWN_EXCLUDE.has(basename(src)),
});
console.log(`Copied Unknown static site -> ${unknownTarget}`);
