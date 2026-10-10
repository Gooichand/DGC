// Security regression check for the assistant Markdown renderer.
// Run: npm test
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const render = require('../Unknown/src/components/PortfolioAssistant/safe-markdown.js');

// Malicious model/stored output must never reach the DOM as live markup.
assert.ok(!render('[click](javascript:alert(1))').includes('javascript:'), 'javascript: URL leaked');
assert.ok(!render('[click](x" onmouseover="alert(1))').includes('onmouseover'), 'attribute injection leaked');
assert.ok(!render('<script>alert(1)</script>').includes('<script'), 'script tag leaked');
assert.ok(!render('<img src=x onerror=alert(1)>').includes('<img'), 'img tag leaked');
assert.ok(!render("[x](data:text/html,<script>alert(1)</script>)").includes('<script'), 'data: URL leaked');
assert.ok(!render("**bold** <b onmouseover=alert(1)>hi</b>").includes('<b'), 'raw tag leaked');
assert.ok(!/<[a-z][^>]*\son\w+\s*=/i.test(render('<b onmouseover=alert(1)>hi</b>')), 'inline handler leaked');

// Legitimate formatting must still work.
assert.ok(render('**bold**').includes('<strong>bold</strong>'), 'bold lost');
assert.ok(render('[safe](https://example.com)').includes('href="https://example.com"'), 'safe link lost');
assert.ok(render('[mail](mailto:a@b.com)').includes('href="mailto:a@b.com"'), 'mailto link lost');

console.log('safe-markdown: all checks passed');
