import { expect, test, type Page } from '@playwright/test';

/**
 * Chapter content is ~4.4 MB in total and must never be part of a page load
 * again — every chapter is its own chunk, fetched when it is opened. Before the
 * split, the first paint of the dashboard cost ~4.95 MB.
 */
function measureTransfer(page: Page): () => number {
  let bytes = 0;
  page.on('requestfinished', (request) => {
    void request
      .sizes()
      .then((sizes) => {
        bytes += sizes.responseBodySize + sizes.responseHeadersSize;
      })
      .catch(() => {
        // A request cancelled by navigation has no sizes; it transferred nothing.
      });
  });
  return () => bytes;
}

test('the dashboard loads without downloading the course', async ({ page }) => {
  const transferred = measureTransfer(page);

  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeVisible();
  await page.waitForLoadState('networkidle');

  expect(transferred()).toBeLessThan(800_000);
});

test('opening a chapter downloads only that chapter', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeVisible();
  await page.waitForLoadState('networkidle');

  const chapterRequests: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('/assets/chapters/')) chapterRequests.push(request.url());
  });

  await page.goto('/chapter/1/learn');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Personal Pronouns',
  );

  expect(chapterRequests).toHaveLength(1);
  expect(chapterRequests[0]).toContain('chapter-001');
});
