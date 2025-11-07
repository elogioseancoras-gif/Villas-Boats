import { test, expect } from '@playwright/test';

test.describe('Booking Flow', () => {
  test('should complete full booking inquiry flow', async ({ page }) => {
    // Navigate to boat detail page
    await page.goto('/en/boats/luxury-catamaran-algarve');

    // Wait for page to load
    await expect(page).toHaveTitle(/Villas Boats/);

    // Scroll to booking widget
    await page.locator('[data-testid="booking-widget"]').scrollIntoViewIfNeeded();

    // Fill start date (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const startDate = tomorrow.toISOString().split('T')[0];
    await page.fill('input[name="startDate"]', startDate);

    // Fill end date (day after tomorrow)
    const endDate = new Date(tomorrow);
    endDate.setDate(endDate.getDate() + 1);
    await page.fill('input[name="endDate"]', endDate.toISOString().split('T')[0]);

    // Fill start time
    await page.fill('input[name="startTime"]', '10:00');

    // Fill end time
    await page.fill('input[name="endTime"]', '18:00');

    // Fill guest count
    await page.fill('input[name="guestCount"]', '4');

    // Toggle captain option if needed
    await page.click('button[role="switch"]');

    // Fill contact information
    await page.fill('input[name="fullName"]', 'E2E Test User');
    await page.fill('input[name="email"]', 'e2etest@example.com');
    await page.fill('input[name="phone"]', '+351912345678');

    // Fill optional notes
    await page.fill('textarea[name="customerNotes"]', 'This is an automated e2e test booking');

    // Submit the form
    await page.click('button[type="submit"]');

    // Wait for navigation to confirmation page
    await page.waitForURL(/\/booking\/confirmation\/.+/);

    // Verify confirmation page elements
    await expect(page.locator('h1')).toContainText(/Thank You|Obrigado|Gracias/);

    // Verify booking reference is displayed
    await expect(page.locator('text=/BK[0-9]+/')).toBeVisible();

    // Verify "What Happens Next" section exists
    await expect(page.locator('text=/What Happens Next|O Que Acontece|Qué Sucede/')).toBeVisible();

    // Take screenshot for verification
    await page.screenshot({ path: 'e2e/screenshots/booking-confirmation.png', fullPage: true });
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/en/boats/luxury-catamaran-algarve');

    // Scroll to booking widget
    await page.locator('[data-testid="booking-widget"]').scrollIntoViewIfNeeded();

    // Try to submit without filling required fields
    await page.click('button[type="submit"]');

    // Should show validation errors (form should not submit)
    await expect(page).toHaveURL(/\/boats\//);
  });

  test('should work in all supported languages', async ({ page }) => {
    const languages = ['en', 'pt-BR', 'pt-PT', 'es'];

    for (const lang of languages) {
      await page.goto(`/${lang}/boats/luxury-catamaran-algarve`);

      // Verify page loaded in correct language
      await expect(page).toHaveURL(new RegExp(`/${lang}/`));

      // Verify booking widget is present
      await expect(page.locator('[data-testid="booking-widget"]')).toBeVisible();
    }
  });

  test('should calculate correct pricing with/without captain', async ({ page }) => {
    await page.goto('/en/boats/luxury-catamaran-algarve');

    // Scroll to booking widget
    await page.locator('[data-testid="booking-widget"]').scrollIntoViewIfNeeded();

    // Fill dates for 1 day
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await page.fill('input[name="startDate"]', tomorrow.toISOString().split('T')[0]);
    await page.fill('input[name="endDate"]', tomorrow.toISOString().split('T')[0]);
    await page.fill('input[name="startTime"]', '10:00');
    await page.fill('input[name="endTime"]', '18:00');

    // Get price without captain
    const priceWithoutCaptain = await page.locator('[data-testid="total-price"]').textContent();

    // Toggle captain option
    await page.click('button[role="switch"]');

    // Get price with captain (should be higher)
    const priceWithCaptain = await page.locator('[data-testid="total-price"]').textContent();

    // Verify prices are different
    expect(priceWithoutCaptain).not.toBe(priceWithCaptain);
  });
});
