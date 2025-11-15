import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/login');
  await page.locator('#email').fill('admin@pressup.com');
  await page.locator('#password').fill('admin123');
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForURL('**/dashboard');
});

test('Navigation: main routes load and chrome renders', async ({ page }) => {
  const routes = ['/dashboard', '/dashboard/posts', '/dashboard/products', '/dashboard/media', '/dashboard/users', '/dashboard/settings'];
  for (const r of routes) {
    await page.goto(r);
    await expect(page).toHaveURL(new RegExp(r.replace('/', '\\/')));
    // App chrome
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    // No console errors
    const logs: string[] = [];
    page.on('console', msg => { if (msg.type() === 'error') logs.push(msg.text()); });
    await page.waitForTimeout(200);
    expect(logs.length).toBe(0);
    await page.screenshot({ path: `tests/.artifacts${r.replaceAll('/', '_')}.png`, fullPage: true });
  }
});

test('Settings: update and reflect immediately', async ({ page }) => {
  await page.goto('/dashboard/settings');
  await page.getByRole('button', { name: /general/i }).click();
  const siteName = page.locator('input').first();
  await siteName.fill('QA Site');
  await page.getByRole('button', { name: /save changes/i }).click();
  await page.waitForTimeout(400);
  // Re-enter general to ensure value persisted on re-fetch
  await page.getByRole('button', { name: /appearance/i }).click();
  await page.getByRole('button', { name: /general/i }).click();
  await expect(siteName).toHaveValue(/QA Site/);
});

test('Users: Add User enabled for owner', async ({ page }) => {
  await page.goto('/dashboard/users');
  const addBtn = page.getByRole('button', { name: /add user/i });
  await expect(addBtn).toBeEnabled();
});
