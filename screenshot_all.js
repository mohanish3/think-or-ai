const { chromium } = require('playwright');

async function shot(browser, name, width, isDark, demo) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const url = demo ? 'http://localhost:3000?demo=1' : 'http://localhost:3000';
  await page.goto(url, { waitUntil: 'networkidle' });
  if (isDark) {
    await page.evaluate(() => document.documentElement.classList.add('dark'));
    await page.waitForTimeout(150);
  }
  if (demo) await page.waitForSelector('text=% confidence', { timeout: 10000 });
  await page.screenshot({ path: `screenshot_${name}.png`, fullPage: true });
  console.log(`✓ ${name}`);
  await page.close();
}

(async () => {
  const browser = await chromium.launch();
  for (const w of [375, 768, 1440]) {
    await shot(browser, `light_empty_${w}`, w, false, false);
    await shot(browser, `dark_empty_${w}`, w, true, false);
    await shot(browser, `light_result_${w}`, w, false, true);
    await shot(browser, `dark_result_${w}`, w, true, true);
  }
  await browser.close();
  console.log('\nAll done!');
})().catch(e => { console.error(e.message); process.exit(1); });
