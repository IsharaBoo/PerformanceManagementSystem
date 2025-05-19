const { test, expect } = require('@playwright/test');

test('renders Performance Management System title', async ({ page }) => {
  await page.goto('http://localhost:3000');
  const titleElement = await page.getByText(/Performance Management System/i);
  await expect(titleElement).toBeVisible();
});