# Playwright Testing Guide

Browser automation testing for SureWinTotoIT website using Playwright.

## What is Playwright

Playwright is a Node.js library for automating browser testing:
- ✓ Cross-browser (Chrome, Firefox, Safari)
- ✓ Headless & headed modes
- ✓ Take screenshots & videos
- ✓ Form testing & interaction
- ✓ Network request monitoring
- ✓ Mobile device emulation

## Installation

Already installed! Check:
```bash
npm list playwright
```

## Quick Start: Create a Test

Create `tests/homepage.spec.js`:

```javascript
const { test, expect } = require('@playwright/test');

test('homepage loads correctly', async ({ page }) => {
  await page.goto('https://godwin8888.github.io/AgenticAITest/');
  
  // Check hero section
  await expect(page.locator('h1')).toContainText('Reliable IT');
  
  // Check services grid
  const cards = await page.locator('.service-card').count();
  expect(cards).toBe(4);
  
  // Check form exists
  await expect(page.locator('#enquiryForm')).toBeVisible();
});

test('form validation works', async ({ page }) => {
  await page.goto('https://godwin8888.github.io/AgenticAITest/#enquiry');
  
  // Try submitting empty
  await page.click('#submitBtn');
  
  // Check error messages
  const nameError = page.locator('#name-error');
  await expect(nameError).toContainText('Please enter your full name');
});

test('mobile menu works', async ({ page }) => {
  // Set mobile viewport
  await page.setViewportSize({ width: 375, height: 812 });
  
  await page.goto('https://godwin8888.github.io/AgenticAITest/');
  
  // Menu should be hidden
  const menu = page.locator('#navMenu');
  let isHidden = await menu.evaluate(el => 
    getComputedStyle(el).transform === 'matrix(1, 0, 0, 1, 292.65, 0)'
  );
  
  // Click hamburger
  await page.click('#navToggle');
  
  // Check menu is visible
  isHidden = await menu.evaluate(el => 
    getComputedStyle(el).transform === 'matrix(1, 0, 0, 1, 0, 0)'
  );
  expect(isHidden).toBe(false);
});
```

## Run Tests

```bash
# Run all tests
npx playwright test

# Run specific test
npx playwright test tests/homepage.spec.js

# Run with UI mode (interactive)
npx playwright test --ui

# Run in headed mode (see browser)
npx playwright test --headed

# Take screenshots
npx playwright test --update-snapshots
```

## Common Test Patterns

### Check Page Content
```javascript
await expect(page.locator('h1')).toContainText('Title');
await expect(page.locator('p')).toBeVisible();
```

### Fill & Submit Form
```javascript
await page.fill('#name', 'John Doe');
await page.fill('#email', 'john@example.com');
await page.click('#submitBtn');
await expect(page.locator('#formSuccess')).toBeVisible();
```

### Mobile Testing
```javascript
await page.setViewportSize({ width: 375, height: 812 });
await page.goto('https://...');
```

### Screenshot
```javascript
await page.screenshot({ path: 'screenshot.png' });
```

### Wait for Element
```javascript
await page.waitForSelector('#formSuccess');
await page.waitForTimeout(1000); // Wait 1 second
```

### Network Monitoring
```javascript
page.on('response', response => {
  console.log(response.status(), response.url());
});
```

## Test Suite for SureWinTotoIT

Test checklist:
- [ ] Hero section loads
- [ ] Services grid shows 4 cards
- [ ] Testimonials carousel works
- [ ] Form validation (empty, invalid email, invalid phone)
- [ ] Form submission success
- [ ] Mobile menu toggle
- [ ] No horizontal scroll at 320px
- [ ] All links navigate correctly
- [ ] Smooth scroll anchors work
- [ ] Honeypot field hidden

## CI/CD Integration

Add to `.github/workflows/test.yml`:

```yaml
name: Playwright Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install
      - run: npx playwright install
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Debugging

```bash
# Debug mode (step through tests)
npx playwright test --debug

# Trace viewer
npx playwright test --trace on
npx playwright show-trace trace.zip
```

## Resources

- Docs: https://playwright.dev/
- API: https://playwright.dev/docs/api/class-page
- Examples: https://github.com/microsoft/playwright/tree/main/examples

---

Ready to test your website with Playwright! 🎭

