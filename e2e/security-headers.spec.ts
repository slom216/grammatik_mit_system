import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

// The preview server does not serve public/_headers, so the CSP cannot be
// exercised in a browser here; this at least keeps the script hash honest.
test('the CSP allows the inline theme script in index.html', () => {
  const html = readFileSync('index.html', 'utf8');
  const script = /<script>([\s\S]*?)<\/script>/.exec(html)?.[1];
  expect(script).toBeDefined();
  const hash = createHash('sha256').update(script!).digest('base64');
  expect(readFileSync('public/_headers', 'utf8')).toContain(`'sha256-${hash}'`);
});
