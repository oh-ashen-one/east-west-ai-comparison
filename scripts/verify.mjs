/**
 * Verification harness.
 *
 * Drives the real page in Chrome: asserts the console is clean, confirms the
 * scroll runway maps to frames, proves the horizontal axis segment actually
 * translates as vertical scroll advances, and screenshots specific frames.
 *
 * Usage: node scripts/verify.mjs [outDir]
 */
import {chromium} from 'playwright-core';
import {mkdirSync} from 'node:fs';

const URL = process.env.URL ?? 'http://localhost:5273/';
const OUT = process.argv[2] ?? '.qa/shots';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PX_PER_FRAME = 2.6;

mkdirSync(OUT, {recursive: true});

const browser = await chromium.launch({
	executablePath: CHROME,
	headless: true,
	args: ['--hide-scrollbars'],
});
const page = await browser.newPage({
	viewport: {width: 1512, height: 945},
	deviceScaleFactor: 1,
});

const errors = [];
const warnings = [];
page.on('console', (m) => {
	if (m.type() === 'error') errors.push(m.text());
	if (m.type() === 'warning') warnings.push(m.text());
});
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
page.on('requestfailed', (r) =>
	errors.push(`requestfailed: ${r.url()} ${r.failure()?.errorText}`),
);

await page.goto(URL, {waitUntil: 'networkidle'});
await page.waitForTimeout(2500);

const meta = await page.evaluate(() => ({
	runway: document.getElementById('runway')?.getBoundingClientRect().height,
	docHeight: document.documentElement.scrollHeight,
	vh: window.innerHeight,
	vw: window.innerWidth,
	fontsLoaded: document.fonts.status,
}));
console.log('page:', JSON.stringify(meta));

/** Scroll to an exact composition frame and let the easing settle. */
async function toFrame(f, settle = 1100) {
	await page.evaluate(
		([frame, px]) => {
			window.scrollTo(0, frame * px);
		},
		[f, PX_PER_FRAME],
	);
	await page.waitForTimeout(settle);
}

const STOPS = [
	['00-hero', 60],
	['01-hero-handover', 240],
	['02-contenders-in', 380],
	['03-contenders', 500],
	['04-axes-01', 674],
	['05-axes-02', 824],
	['06-axes-03', 974],
	['07-axes-04', 1124],
	['08-axes-05', 1274],
	['09-axes-06', 1424],
	['10-proscons-in', 1620],
	['11-proscons', 1800],
	['12-verdict-in', 2040],
	['13-verdict', 2180],
	['14-footer', 2360],
];

for (const [name, f] of STOPS) {
	await toFrame(f);
	await page.screenshot({path: `${OUT}/${name}.png`});
}

// ── Assertions ────────────────────────────────────────────────────────

const fail = [];
const ok = (cond, msg, extra) => {
	console.log(`${cond ? '  ✓' : '  ✗'} ${msg}`, extra ?? '');
	if (!cond) fail.push(msg);
};

console.log('\n--- scroll runway ---');
const runway = await page.evaluate(() =>
	document.getElementById('runway')?.getBoundingClientRect().height,
);
ok(
	Math.abs(runway - (Math.round((2400 - 1) * PX_PER_FRAME) + 945)) < 2,
	'runway is tall enough for the last frame to be reachable',
	`${runway}px`,
);

// The decisive check: can the browser actually scroll to the final frame?
const lastFrame = await page.evaluate(
	([px]) => {
		window.scrollTo(0, document.documentElement.scrollHeight);
		return Math.round(
			(document.documentElement.scrollHeight - window.innerHeight) / px,
		);
	},
	[PX_PER_FRAME],
);
ok(lastFrame >= 2399, 'scrolling to the bottom reaches the final frame', `frame ${lastFrame}`);

console.log('\n--- horizontal axis segment (vertical wheel → sideways travel) ---');
const travel = [];
for (const f of [660, 810, 960, 1110, 1260, 1410]) {
	await toFrame(f);
	const x = await page.evaluate(
		() => document.querySelector('[data-travel]')?.getAttribute('data-travel') ?? null,
	);
	travel.push({frame: f, x: Math.round(Number(x))});
}
console.log('  ', JSON.stringify(travel));
const xs = travel.map((t) => t.x);
ok(
	xs.every((v, i) => i === 0 || v < xs[i - 1]),
	'track offset decreases monotonically as vertical scroll advances',
);
// Six panels means five panel-widths of travel to bring the last one flush.
ok(
	Math.abs(xs[0]) < 4 && Math.abs(xs[5] + 5 * 1512) < 4,
	'track travels exactly five panel-widths, last panel flush left',
	`${xs[0]} → ${xs[5]} (expected 0 → ${-5 * 1512})`,
);
// The tell-tale of a real sideways gallery: content moves horizontally while
// the scrollbar position is purely vertical.
const panelVisible = [];
for (const f of [674, 824, 974, 1124, 1274, 1424]) {
	await toFrame(f);
	const head = await page.evaluate(() => {
		const track = document.querySelector('[data-travel]');
		if (!track) return [];
		return [...track.children]
			.map((c) => {
				const r = c.getBoundingClientRect();
				return {
					title: c.innerText.split('\n')[1] ?? '?',
					left: Math.round(r.left),
					w: Math.round(r.width),
				};
			})
			.filter((x) => Math.abs(x.left) < 4 && x.w > 0);
	});
	panelVisible.push({frame: f, panel: head.map((h) => h.title)});
}
console.log('  ', JSON.stringify(panelVisible, null, 1).replace(/\n\s*/g, ' '));
ok(
	panelVisible.every((p) => p.panel.length === 1),
	'exactly one axis panel sits flush at each of six scroll positions',
	panelVisible.map((p) => p.panel[0] ?? 'none').join(' · '),
);
ok(
	new Set(panelVisible.map((p) => p.panel[0])).size === 6,
	'all six axis panels are visited, each at a distinct scroll position',
);

console.log('\n--- section scale interpolation (no hard cuts) ---');
for (const [name, f] of [
	['hero', 60],
	['contenders', 500],
	['axes', 1000],
	['proscons', 1800],
	['verdict', 2180],
	['footer', 2360],
]) {
	await toFrame(f);
	const s = await page.evaluate(() => {
		const el = [...document.querySelectorAll('div')].find(
			(d) => {
				const cs = getComputedStyle(d);
				return cs.opacity !== '1' && cs.opacity !== '0' && d.innerText.length > 40;
			},
		);
		return el ? getComputedStyle(el).opacity : null;
	});
	console.log(`   ${name.padEnd(11)} interpolated opacity ${s}`);
}

console.log('\n--- console ---');
ok(errors.length === 0, `no console errors (${errors.length})`);
errors.forEach((e) => console.log('     ✗', e));
console.log(`   warnings: ${warnings.length}`);
warnings.slice(0, 10).forEach((w) => console.log('     !', w));

console.log(`\n=== ${fail.length ? `FAILED (${fail.length})` : 'ALL CHECKS PASSED'}`);
fail.forEach((f) => console.log('  -', f));
await browser.close();
process.exit(fail.length ? 1 : 0);
