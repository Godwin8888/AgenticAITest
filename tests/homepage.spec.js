const { test, expect } = require('@playwright/test');

const SITE_URL = 'https://godwin8888.github.io/AgenticAITest/';

test.describe('SureWinTotoIT Website', () => {
  test('hero section loads with correct content', async ({ page }) => {
    await page.goto(SITE_URL);

    // Check main headline
    const heading = page.locator('h1');
    await expect(heading).toContainText('Reliable IT, without the guesswork');

    // Check subheadline
    const subheading = page.locator('.hero-sub');
    await expect(subheading).toBeVisible();

    // Check CTA buttons
    const consultBtn = page.locator('text=Get a Free Consultation');
    const servicesBtn = page.locator('text=Our Services');
    await expect(consultBtn).toBeVisible();
    await expect(servicesBtn).toBeVisible();
  });

  test('services grid displays 4 cards', async ({ page }) => {
    await page.goto(SITE_URL);

    const cards = page.locator('.service-card');
    const count = await cards.count();
    expect(count).toBe(4);

    // Check service titles
    await expect(page.locator('text=Managed IT Support')).toBeVisible();
    await expect(page.locator('text=Cloud Migration')).toBeVisible();
    await expect(page.locator('text=Cybersecurity')).toBeVisible();
    await expect(page.locator('text=Network Infrastructure')).toBeVisible();
  });

  test('testimonials section exists with 3 quotes', async ({ page }) => {
    await page.goto(SITE_URL);

    const testimonials = page.locator('.testimonial');
    const count = await testimonials.count();
    expect(count).toBe(3);

    // Check at least one testimonial quote
    await expect(page.locator('text=SureWinTotoIT cut our ticket')).toBeVisible();
  });

  test('form exists and has required fields', async ({ page }) => {
    await page.goto(SITE_URL + '#enquiry');

    const form = page.locator('#enquiryForm');
    await expect(form).toBeVisible();

    // Check required fields exist
    await expect(page.locator('#name')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#phone')).toBeVisible();
    await expect(page.locator('#message')).toBeVisible();
  });

  test('form validation: empty submission shows errors', async ({ page }) => {
    await page.goto(SITE_URL + '#enquiry');

    // Click submit without filling
    await page.click('#submitBtn');

    // Check error messages appear
    const nameError = page.locator('#name-error');
    const emailError = page.locator('#email-error');
    const phoneError = page.locator('#phone-error');

    await expect(nameError).toContainText('Please enter your full name');
    await expect(emailError).toContainText('Please enter your email');
    await expect(phoneError).toContainText('Please enter a phone number');
  });

  test('form validation: invalid email rejected', async ({ page }) => {
    await page.goto(SITE_URL + '#enquiry');

    // Fill with invalid email
    await page.fill('#email', 'not-an-email');
    await page.click('#submitBtn');

    // Check error
    const emailError = page.locator('#email-error');
    await expect(emailError).toContainText('valid email');
  });

  test('form validation: invalid phone rejected', async ({ page }) => {
    await page.goto(SITE_URL + '#enquiry');

    // Fill with invalid phone
    await page.fill('#phone', 'abc');
    await page.click('#submitBtn');

    // Check error
    const phoneError = page.locator('#phone-error');
    await expect(phoneError).toContainText('valid phone');
  });

  test('mobile: hamburger menu works', async ({ page }) => {
    // Mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(SITE_URL);

    // Menu toggle should be visible
    const toggle = page.locator('#navToggle');
    await expect(toggle).toBeVisible();

    // Click to open
    await toggle.click();

    // Menu should be visible
    const menu = page.locator('#navMenu');
    const ariaExpanded = await toggle.getAttribute('aria-expanded');
    expect(ariaExpanded).toBe('true');
  });

  test('mobile: no horizontal scroll at 320px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto(SITE_URL);

    // Get viewport dimensions
    const pageWidth = await page.evaluate(() => document.documentElement.clientWidth);
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);

    // No overflow
    expect(scrollWidth).toBeLessThanOrEqual(pageWidth);
  });

  test('anchor links navigate correctly', async ({ page }) => {
    await page.goto(SITE_URL);

    // Click "Services" link
    await page.click('text=Services');

    // Wait for navigation
    await page.waitForURL(SITE_URL + '#services');

    // Check we're at services section
    const servicesSection = page.locator('#services');
    await expect(servicesSection).toBeInViewport();
  });

  test('footer displays current year', async ({ page }) => {
    await page.goto(SITE_URL);

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Check year is displayed
    const year = new Date().getFullYear();
    const yearSpan = page.locator('#year');
    await expect(yearSpan).toContainText(year.toString());
  });
});
