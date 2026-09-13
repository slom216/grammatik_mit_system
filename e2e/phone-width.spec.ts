import { expect, test } from '@playwright/test';

// Wide lesson tables and the settings controls once pushed a 390px page to
// 430–506px, so the whole page scrolled sideways.
test.use({ viewport: { width: 390, height: 844 } });

for (const path of ['/settings', '/chapter/31/learn', '/chapter/82/learn']) {
  test(`${path} does not scroll horizontally at phone width`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.waitForLoadState('networkidle');

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}
