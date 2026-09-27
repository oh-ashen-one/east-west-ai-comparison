/**
 * Arrival audit.
 *
 * The composition is scroll-driven, so `useCurrentFrame()` is frozen until the
 * reader scrolls. The failure this catches: content gated behind frames the
 * reader only reaches by scrolling *past* it, so a section is half-built at the
 * moment they arrive.
 *
 * For each section, measure how much of its text is actually visible at the
 * frame the reader arrives, and again shortly after.
 */
import {chromium} from 'playwright-core';

const PX = 2.6;

/**
 * Each section is sampled at the frame where it becomes the dominant thing on
 * screen (past its cross-dissolve), and again 60 frames later. A section that
 * is still building at that point is one the reader scrolls past half-finished.
 */
const ARRIVALS = [
	['hero', 40, 100],
	['contenders', 360, 420],
	['axes/panel-1', 700, 760],
	['axes/panel-2', 850, 910],
	['axes/panel-3', 1000, 1060],
	['axes/panel-4', 1150, 1210],
	['axes/panel-5', 1300, 1360],
	['axes/panel-6', 1450, 1510],
	['proscons', 1620, 1680],
	['verdict', 2050, 2110],
	['footer', 2330, 2390],
];

const browser = await chromium.launch({
	executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
	headless: true,
	args: ['--hide-scrollbars'],
});
const page = await browser.newPage({viewport: {width: 1512, height: 945}});
await page.goto('http://localhost:5273/', {waitUntil: 'networkidle'});
await page.waitForTimeout(2500);

const measure = () =>
	page.evaluate(() => {
		const out = {total: 0, visible: 0, dim: []};
		const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
		const seen = new Set();
		let n;
		while ((n = walker.nextNode())) {
			const txt = (n.textContent ?? '').trim();
			if (txt.length < 4) continue;
			const el = n.parentElement;
			if (!el || seen.has(el)) continue;
			seen.add(el);
			// Off-screen panels of the horizontal gallery are not "dim", they are
			// simply not on screen. Exclude anything not actually in the viewport.
			if (el.closest('[data-travel]')) continue;
			const r = el.getBoundingClientRect();
			if (r.width < 2 || r.height < 2) continue;
			if (r.bottom < 0 || r.top > window.innerHeight) continue;
			if (r.right < 0 || r.left > window.innerWidth) continue;
			let o = 1;
			let e = el;
			while (e && e !== document.body) {
				o *= parseFloat(getComputedStyle(e).opacity);
				e = e.parentElement;
			}
			out.total++;
			// Body copy in this design sits at a deliberate 0.82 opacity, so 0.75
			// is the floor for "legible". Anything below that is a stuck or
			// half-played entrance animation, which is what this audit is for.
			if (o > 0.75) out.visible++;
			else if (out.dim.length < 4) out.dim.push({t: txt.slice(0, 34), o: +o.toFixed(2)});
		}
		return out;
	});

let bad = 0;
for (const [name, at, after] of ARRIVALS) {
	const rows = [];
	for (const f of [at, after]) {
		await page.evaluate((y) => window.scrollTo(0, y), f * PX);
		await page.waitForTimeout(1000);
		const m = await measure();
		const pct = m.total ? Math.round((m.visible / m.total) * 100) : 100;
		rows.push({f, pct, dim: m.dim});
	}
	const arrival = rows[0];
	const ok = arrival.pct >= 88 && rows[1].pct >= 95;
	if (!ok) bad++;
	console.log(
		`${ok ? '✓' : '✗'} ${name.padEnd(14)} dominant@${String(at).padStart(4)}: ${String(arrival.pct).padStart(3)}% legible` +
			`   +60: ${rows[1].pct}%`,
	);
	if (!ok) {
		for (const d of arrival.dim) console.log(`      dim: ${d.o}  "${d.t}"`);
	}
}

console.log(`\n=== ${bad ? `FAILED (${bad})` : 'EVERY SECTION IS LEGIBLE ON ARRIVAL'}`);
await browser.close();
process.exit(bad ? 1 : 0);
