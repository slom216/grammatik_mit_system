import { expect, test } from '@playwright/test';

/**
 * The service worker is what makes the app usable without a connection. These
 * run in their own Playwright project, since every other spec blocks service
 * workers to keep caching out of its way.
 */
test('the app keeps working offline after a first visit', async ({ page, context }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeVisible();

  // The worker installs on the first visit but only takes control from the next
  // navigation on — it deliberately does not claim open pages, so a running
  // practice session never has its chunks swapped underneath it.
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);

  // Visited while controlled, so the lesson and its chapter chunk are cached.
  await page.goto('/chapter/1/learn');
  await expect(page.getByRole('table', { name: /subject pronouns/i })).toBeVisible();

  await context.setOffline(true);

  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Personal Pronouns',
  );
  await expect(page.getByRole('table', { name: /subject pronouns/i })).toBeVisible();

  await page.getByRole('link', { name: 'Chapters', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Chapter catalogue');

  await context.setOffline(false);
});
