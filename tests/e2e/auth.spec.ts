import { test, expect } from '@playwright/test';

test.describe('Authentication E2E Flow', () => {
  test('should render login page correctly', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h2')).toContainText('Welcome Back');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should navigate between login and signup', async ({ page }) => {
    await page.goto('/login');
    await page.click('text=Sign up');
    await expect(page).toHaveURL('/signup');
    await expect(page.locator('h2')).toContainText('Create Your Account');
  });

  test('should navigate to reset password', async ({ page }) => {
    await page.goto('/login');
    await page.click('text=Forgot password?');
    await expect(page).toHaveURL('/reset-password');
    await expect(page.locator('h2')).toContainText('Reset Your Password');
  });
});
