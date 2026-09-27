import {chromium} from 'playwright-core';
import {mkdirSync} from 'node:fs';
mkdirSync('.qa/responsive', {recursive: true});
const b = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true, args: ['--hide-scrollbars'],
});
const sizes = [
  ['mobile', 390, 844], ['tablet', 834, 1112], ['laptop', 1280, 800], ['wide', 1920, 1080],
];
const errs = [];
for (const [name, w, h] of sizes) {
  const p = await b.newPage({viewport: {width: w, height: h}});
  p.on('pageerror', (e) => errs.push(`${name}: ${e.message}`));
  p.on('console', (m) => m.type() === 'error' && errs.push(`${name}: ${m.text()}`));
  await p.goto('http://localhost:5273/', {waitUntil: 'networkidle'});
  await p.waitForTimeout(2000);
  for (const [label, frame] of [['hero', 90], ['contenders', 500], ['axis', 974], ['proscons', 1800], ['footer', 2340]]) {
    await p.evaluate((f) => window.scrollTo(0, f * 2.6), frame);
    await p.waitForTimeout(1000);
    await p.screenshot({path: `.qa/responsive/${name}-${label}.png`});
  }
  // Overflow check: nothing should exceed the viewport width except the gallery track.
  const over = await p.evaluate(() => {
    const bad = [];
    for (const el of document.querySelectorAll('div')) {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && (r.right > window.innerWidth + 2 || r.left < -2)) {
        if (!el.closest('[data-travel]')) bad.push({t: (el.innerText||'').slice(0,30), l: Math.round(r.left), r: Math.round(r.right)});
      }
    }
    return bad.slice(0, 6);
  });
  console.log(`${name.padEnd(7)} ${w}x${h}  overflow:`, JSON.stringify(over));
  await p.close();
}
console.log('errors:', errs.length); errs.forEach((e) => console.log('  ', e));
await b.close();
