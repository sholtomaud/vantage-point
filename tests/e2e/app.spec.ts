import { test, expect } from '@playwright/test';

test.describe('Vantage Point App', () => {
  test('should load the home page and match snapshot', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the app to be ready (e.g., check for the main title)
    await expect(page.locator('h1')).toContainText('VANTAGE POINT');
    
    // Take a snapshot for regression testing
    await expect(page).toHaveScreenshot('home-page.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.05,
    });
  });

  test('should navigate to Loom view', async ({ page }) => {
    await page.goto('/');
    
    // Click on Loom navigation item
    await page.click('text=Loom');
    
    // Check if Loom view is active
    await expect(page.locator('h2')).toContainText('Strategic Loom');
  });

  test('mobile menu should toggle', async ({ page, isMobile }) => {
    if (!isMobile) return;

    await page.goto('/');
    
    // Check if menu is hidden initially
    const sidebar = page.locator('aside');
    await expect(sidebar).toHaveClass(/ -translate-x-full/);
    
    // Click menu button
    await page.click('button:has-text("menu")');
    
    // Check if menu is visible
    await expect(sidebar).toHaveClass(/ translate-x-0/);
    
    // Click close button
    await page.click('button:has-text("close")');
    
    // Check if menu is hidden again
    await expect(sidebar).toHaveClass(/ -translate-x-full/);
  });
});
