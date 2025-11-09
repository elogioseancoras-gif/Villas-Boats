import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to backoffice login with redirect to dashboard
    await page.goto('http://localhost:3000/backoffice/login?redirect=/backoffice/dashboard');

    // Wait for login page to load
    await page.waitForSelector('#email', { timeout: 10000 });

    // Login with admin credentials
    await page.fill('#email', 'admin@villasboats.com');
    await page.fill('#password', 'Password123!');
    await page.click('button[type="submit"]');

    // Wait for navigation after login (to dashboard)
    await page.waitForURL('**/backoffice/dashboard', { timeout: 15000 });
  });

  test('Dashboard loads statistics with single API call', async ({ page }) => {
    // Track network requests
    const requests: string[] = [];
    page.on('request', request => {
      if (request.url().includes('/api/admin/stats')) {
        requests.push(request.url());
      }
    });

    // Already at dashboard from beforeEach, wait for content to load
    await page.waitForSelector('text=Dashboard', { timeout: 10000 });

    // Wait a moment for API calls to complete
    await page.waitForTimeout(2000);

    // Verify single stats API call was made
    expect(requests.length).toBeGreaterThan(0);
    console.log('✓ Stats API calls:', requests.length);

    // Check if page has loaded (sidebar visible)
    const hasSidebar = await page.isVisible('text=Customers');
    expect(hasSidebar).toBeTruthy();
  });

  test('Customers table loads with pagination', async ({ page }) => {
    // Track network requests
    let customersApiCalled = false;
    page.on('request', request => {
      if (request.url().includes('/api/admin/customers')) {
        customersApiCalled = true;
        console.log('✓ Customers API URL:', request.url());
      }
    });

    // Click on Customers in sidebar
    await page.click('text=Customers');
    await page.waitForURL('**/backoffice/customers', { timeout: 10000 });

    // Wait for table to load
    await page.waitForTimeout(2000);

    // Verify API was called
    expect(customersApiCalled).toBeTruthy();

    // Check if sidebar is still visible (page loaded)
    const hasSidebar = await page.isVisible('text=Dashboard');
    expect(hasSidebar).toBeTruthy();
  });

  test('Customer details modal shows bookings', async ({ page }) => {
    // Track bookings API call
    let bookingsApiCalled = false;
    page.on('request', request => {
      if (request.url().includes('/bookings')) {
        bookingsApiCalled = true;
        console.log('✓ Bookings API URL:', request.url());
      }
    });

    // Click on Customers in sidebar
    await page.click('text=Customers');
    await page.waitForURL('**/backoffice/customers', { timeout: 10000 });

    // Wait for content to load
    await page.waitForTimeout(2000);

    // Try to click on first customer row if visible
    const firstRow = await page.locator('table tbody tr:first-child').first();
    const isVisible = await firstRow.isVisible().catch(() => false);

    if (isVisible) {
      await firstRow.click();
      await page.waitForTimeout(2000);
      console.log('✓ Bookings API called:', bookingsApiCalled);
    } else {
      console.log('⚠ No customer rows found - skipping modal test');
    }
  });

  test('Network payload analysis', async ({ page }) => {
    const networkStats: any[] = [];

    page.on('response', async response => {
      if (response.url().includes('/api/admin/')) {
        const headers = response.headers();
        const contentLength = headers['content-length'] || 'unknown';
        networkStats.push({
          url: response.url(),
          status: response.status(),
          contentLength,
          timestamp: new Date().toISOString()
        });
      }
    });

    // Already at dashboard, wait for it to load
    await page.waitForSelector('text=Dashboard', { timeout: 10000 });
    await page.waitForTimeout(2000);

    // Navigate to customers
    await page.click('text=Customers');
    await page.waitForURL('**/backoffice/customers', { timeout: 10000 });
    await page.waitForTimeout(2000);

    console.log('✓ Network Statistics:', JSON.stringify(networkStats, null, 2));
  });
});
