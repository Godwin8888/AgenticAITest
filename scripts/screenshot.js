const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://godwin8888.github.io/AgenticAITest/';

async function takeScreenshots() {
  const browser = await chromium.launch();

  // Create screenshots directory
  const screenshotDir = path.join(__dirname, '..', 'screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  try {
    // Desktop screenshot
    console.log('Taking desktop screenshot...');
    const desktopContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const desktopPage = await desktopContext.newPage();
    await desktopPage.goto(SITE_URL);
    await desktopPage.screenshot({ path: path.join(screenshotDir, 'desktop.png') });
    await desktopContext.close();
    console.log('✓ Desktop screenshot saved');

    // Tablet screenshot
    console.log('Taking tablet screenshot...');
    const tabletContext = await browser.newContext({ viewport: { width: 768, height: 1024 } });
    const tabletPage = await tabletContext.newPage();
    await tabletPage.goto(SITE_URL);
    await tabletPage.screenshot({ path: path.join(screenshotDir, 'tablet.png') });
    await tabletContext.close();
    console.log('✓ Tablet screenshot saved');

    // Mobile screenshot
    console.log('Taking mobile screenshot...');
    const mobileContext = await browser.newContext({ viewport: { width: 375, height: 812 } });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto(SITE_URL);
    await mobilePage.screenshot({ path: path.join(screenshotDir, 'mobile.png') });
    await mobileContext.close();
    console.log('✓ Mobile screenshot saved');

    // Full page screenshot
    console.log('Taking full-page screenshot...');
    const fullContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const fullPage = await fullContext.newPage();
    await fullPage.goto(SITE_URL);
    await fullPage.screenshot({ path: path.join(screenshotDir, 'fullpage.png'), fullPage: true });
    await fullContext.close();
    console.log('✓ Full-page screenshot saved');

  } finally {
    await browser.close();
  }

  console.log('\n✅ All screenshots saved to screenshots/');
}

takeScreenshots().catch(console.error);
