# East vs West

A scroll-driven, single-page editorial comparison of leading Chinese and American
frontier AI models. Built with [Remotion](https://www.remotion.dev/) — every
animation on the page is driven by `useCurrentFrame()`, and the browser's scroll
position is what sets the frame.

It is not selling anything. It is an evidence-based comparison piece, and the
data behind it was verified on **27 September 2026**.

---

## Run it

```bash
npm install
npm run dev
```

Then open **http://localhost:5273**.

That is the whole experience. Scroll.

### Other commands

| Command | What it does |
| --- | --- |
| `npm run dev` | The scroll page on `localhost:5273` — this is the deliverable |
| `npm run studio` | Remotion Studio on `localhost:3333`, for scrubbing frame by frame |
| `npm run build` | Production bundle into `dist/` |
| `npm run typecheck` | `tsc --noEmit` |
| `node scripts/verify.mjs` | Drives the real page in Chrome and asserts the scroll behaviour |

---

## How the scroll works

The page is not a normal scrolling document. It is a fixed, viewport-locked
`<Player>` sitting on top of an empty scroll runway.

1. The runway is `durationInFrames × 2.6px` tall (`src/main.tsx`).
2. `window.scrollY / 2.6` is the target frame.
3. A `requestAnimationFrame` loop eases the current frame toward that target
   (a 0.19 lerp) and calls `playerRef.seekTo()`.
4. The composition re-renders at the new frame.

Because the smoothing happens on the frame axis rather than in CSS, a fast
flick of the wheel decelerates exactly the way the rest of the motion does.
There is not a single CSS `transition` or `@keyframes` rule in the project.

The runway is deliberately one viewport taller than the last frame — otherwise
the maximum `scrollTop` falls short of the final frame and the footer is
unreachable. `scripts/verify.mjs` asserts this.

### Layout

The composition renders at the **live viewport size** rather than a fixed
16:9 canvas, so it is genuinely responsive instead of letterboxed. Sections
branch on real available width via `src/useLayout.ts`:

- **≥ 1100px** — the full layout. The contenders grid is two columns, the axis
  chart is a three-column row, pros/cons is a 2×2 grid.
- **700–1100px** — the same layout at tighter type sizes.
- **< 700px** — a genuinely condensed variant, not a squeezed desktop. Cards
  drop their stat chips, axis rows stack label-above-bar, and the two densest
  sections (pros/cons and the verdict) each spend **two sub-pages of their own
  frame budget** rather than shrinking type past the point of reading. No
  content is dropped on a phone.

---

## The sections

| # | Section | Frames | What moves |
| --- | --- | --- | --- |
| 01 | Hero | 0–330 | Load-in, then a camera pull-back that hands over with no seam |
| 02 | The contenders | 300–660 | 10 cards, each springing up from small on a per-card zoom |
| 03 | Head to head | 660–1560 | **Horizontal gallery** — vertical scroll becomes sideways travel through 6 axis panels |
| 04 | Where each side is right | 1560–1980 | Two families, 6 strengths and 6 failures each, staggered |
| 05 | Verdict | 1980–2280 | A conclusion and a decision guide, resolving outward from the centre |
| 06 | Footer | 2270–2400 | Sources, flags, date, signature |

Every section is mounted simultaneously and cross-dissolved against its
neighbour through `SceneShell` (`src/components/Atmosphere.tsx`), which
interpolates both opacity and scale. Nothing hard-cuts.

### The horizontal segment

Section 03 converts vertical scroll into horizontal translation. Each of the six
panels gets `SEG = 150` frames, and within a segment the position is held at
both ends and eased across the middle:

```
0 ──── hold ──── travel ──── hold ──── 1
     0.10          eased         0.90
```

So the panel sits still, travels sideways, and sits still again — which is what
makes a sideways gallery feel deliberate rather than like a scrollbar. The track
carries an explicit `width` for a reason worth knowing: an absolutely positioned
flex row with only `left: 0` shrink-to-fits to its containing block, which
collapses the panels instead of overflowing them.

---

## The data

`src/data.ts` holds every model, axis, decision and source. It was compiled from
a research pass on 27 September 2026 against primary sources and independently
operated evaluations. The short version of what the research found:

- **The frontier has moved.** The models most people still discuss (Kimi K2,
  DeepSeek V3/R1, Qwen 3, GPT-5, Claude 4) are all two or more generations old.
- **The "US vs China" framing is partly obsolete.** Meta's Muse Spark 1.3 is
  fifth in the world and closed; Xiaomi's MiMo-V2.6-Pro is the best
  open-weights model in the world and MIT-licensed. Neither fits the stereotype.
- **Benchmarks disagree with each other.** On the Artificial Analysis
  Intelligence Index v4.3 the top ten slots are all Anthropic and OpenAI, and
  the best Chinese model is thirteenth. On the Arena text board two Chinese
  models are in the top ten — but Kimi K3's rank rests on 3,600 votes at ±10,
  which cannot be separated from ranks three through seven. Both facts are on
  the page, with the vote counts shown.

Where a figure is vendor-reported, introductory, or measured on a fallback
model, it is marked. Where the permissiveness scale is an ordinal judgement
rather than a measurement, the methodology note says so.

**Censorship is the axis where the evidence is most interesting and least
reported.** The headline numbers point opposite ways: a minimal-pair study
(arXiv 2609.07507) finds Chinese models refusing 80.2% of China-referent
collective-action prompts against 10.8% for Western models, while a Tongji
study (arXiv 2609.19989) finds five of eleven international models still meeting
Chinese compliance thresholds. Both are presented, because a model can score
45% on FreedomBench and 97% on regulatory compliance simultaneously.

### A caveat worth stating plainly

Leaderboards move daily, and the selection of ten models is the author's. A
different ten would produce a different mean. The page says this in its footer
rather than implying the set is canonical.

---

## Design

Dark editorial, two accent families, one display face and one body face.

| Token | Value | Role |
| --- | --- | --- |
| `ink` | `#08090B` | Base |
| `east` | `#E2483D` | China-based models, warm family |
| `west` | `#5B8DEF` | US-based models, cool family |
| `text` | `#F2F0EC` | Warm off-white |
| Display | Instrument Serif | Headlines, model names, figures |
| Body | Inter | Everything else, tabular numerals throughout |

Both faces load from Google's CDN via `@remotion/google-fonts` at the exact
weights used, so there are no local font files to keep in sync.

Motion is transform and opacity only — `scale`, `translate`, `rotate` as
independent CSS properties, never a composed `transform` string. Easing is
`Easing.bezier(0.16, 1, 0.3, 1)` throughout, and scale animations use
`output: 'perceptual-scale'`.

---

## Verification

`scripts/verify.mjs` launches real Chrome against the dev server and asserts the
things that are easy to break and hard to see:

- the runway is tall enough for the final frame to be reachable
- the horizontal track offset decreases monotonically with vertical scroll
- the track travels exactly five panel-widths, bringing the last panel flush
- each of the six axis panels sits flush at a distinct scroll position
- **zero console errors and zero console warnings**

`scripts/responsive.mjs` repeats the sweep at 390×844, 834×1112, 1280×800 and
1920×1080 and writes screenshots to `.qa/responsive/`.

Both require the dev server to be running.

---

## Layout of the source

```
src/
  main.tsx              The scroll engine: runway, rAF easing, <Player>
  EastWest.tsx          Master composition; mounts and cross-dissolves all six
  root.tsx              Studio composition registrations
  studio.tsx            registerRoot() entry point
  data.ts               Every model, axis, decision and source
  theme.ts              Design tokens, timeline constants
  useLayout.ts          Layout tier from live viewport width
  fonts.ts              Google Fonts loading
  components/
    Atmosphere.tsx      Background, glows, grain, and the SceneShell cross-fade
    Bits.tsx            Eyebrow, Rule, Bar, Standfirst, Display
  scenes/
    Hero.tsx            Section 01
    Contenders.tsx      Section 02
    AxisGallery.tsx     Section 03 — the horizontal segment
    ProsCons.tsx        Section 04
    Verdict.tsx         Section 05
    Footer.tsx          Section 06
scripts/
  verify.mjs            Behavioural verification in real Chrome
  responsive.mjs        Multi-viewport sweep
  probe-gallery.mjs     Narrow DOM probe for the axis track
```

---

## Licence

Code: MIT. The underlying research belongs to its sources, all linked in the
page footer. Figures are a snapshot of 27 September 2026 and will drift.
