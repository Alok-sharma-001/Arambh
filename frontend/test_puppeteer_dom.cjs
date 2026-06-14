const puppeteer = require('puppeteer');
const fs = require('fs');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/lesson/6', { waitUntil: 'networkidle0' });
  const html = await page.evaluate(() => document.body.innerHTML);
  fs.writeFileSync('lesson6_dom.txt', html);
  await browser.close();
})();
