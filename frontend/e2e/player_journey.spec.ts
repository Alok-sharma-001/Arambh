import { test, expect } from '@playwright/test';

test.describe('Player Journey E2E Flow', () => {
  test('should load landing page and display hero text', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Arambh/i);
  });

  test('should render login page with desk lamp and form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText(/Welcome Back/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Sign In/i })).toBeVisible();
  });

  test('should render registration page with join guild heading', async ({ page }) => {
    await page.goto('/register');
    await expect(page.getByText(/Join the Guild/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Create Character/i })).toBeVisible();
  });
});
