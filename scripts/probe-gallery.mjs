import {chromium} from 'playwright-core';

const browser = await chromium.launch({
	executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
	headless: true,
	args: ['--hide-scrollbars'],
});
const page = await browser.newPage({viewport: {width: 1512, height: 945}});
page.on('pageerror', (e) => console.log('PAGEERROR', e.message));
await page.goto('http://localhost:5273/', {waitUntil: 'networkidle'});
await page.waitForTimeout(2000);

await page.evaluate(() =>
	window.scrollTo(0, (document.documentElement.scrollHeight - window.innerHeight) * 0.375),
);
await page.waitForTimeout(1200);

const info = await page.evaluate(() => {
	const wide = [...document.querySelectorAll('div')].filter(
		(d) => d.getBoundingClientRect().width > 1400,
	);
	const track =
		wide.find((d) => d.children.length === 6) ??
		wide.find((d) => getComputedStyle(d).translate !== 'none');
	const out = {wideCount: wide.length, track: null, children: []};
	out.candidates = wide
		.slice(0, 12)
		.map((d) => ({
			w: Math.round(d.getBoundingClientRect().width),
			l: Math.round(d.getBoundingClientRect().left),
			kids: d.children.length,
			tr: getComputedStyle(d).translate,
		}));
	if (track) {
		const r = track.getBoundingClientRect();
		out.track = {
			rect: [Math.round(r.left), Math.round(r.top), Math.round(r.width)],
			translate: getComputedStyle(track).translate,
			transform: getComputedStyle(track).transform,
			position: getComputedStyle(track).position,
			childCount: track.children.length,
		};
		for (const ch of track.children) {
			const cr = ch.getBoundingClientRect();
			const cs = getComputedStyle(ch);
			const inner = ch.firstElementChild;
			const ics = inner ? getComputedStyle(inner) : null;
			out.children.push({
				rect: [Math.round(cr.left), Math.round(cr.top), Math.round(cr.width), Math.round(cr.height)],
				opacity: cs.opacity,
				scale: cs.scale,
				innerOpacity: ics?.opacity,
				innerDisplay: ics?.display,
				innerPad: ics?.padding,
				innerRect: inner
					? (() => {
							const ir = inner.getBoundingClientRect();
							return [Math.round(ir.left), Math.round(ir.top), Math.round(ir.width), Math.round(ir.height)];
						})()
					: null,
				text: (ch.innerText || '').slice(0, 70).replace(/\n/g, ' | '),
			});
		}
	}
	return out;
});

console.log(JSON.stringify(info, null, 2));
await browser.close();
