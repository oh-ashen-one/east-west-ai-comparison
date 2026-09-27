import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT_BODY, FONT_DISPLAY, label} from '../theme';
import {Eyebrow, Rule} from '../components/Bits';
import {DECISIONS, T} from '../data';
import {isNarrow, useTier} from '../useLayout';

/**
 * Section 05 — Verdict.
 *
 * The conclusion this data actually supports: there is no winner, and the
 * interesting output is the decision guide rather than a trophy.
 */
export const Verdict: React.FC = () => {
	const frame = useCurrentFrame();
	const start = T.verdict.in;
	const narrow = isNarrow(useTier());

	const lead = interpolate(frame, [start - 20, start + 14], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.16, 1, 0.3, 1),
	});

	const ruleIn = interpolate(frame, [start - 4, start + 40], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.16, 1, 0.3, 1),
	});

	// The two halves of the closing statement resolve from the centre out.
	const split = interpolate(frame, [start + 4, start + 34], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.16, 1, 0.3, 1),
	});

	// Pull back as the footer arrives, so the ending breathes.
	const pull = interpolate(
		frame,
		[T.verdict.out - 90, T.verdict.out + 40],
		[1, 0.9],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
			easing: Easing.bezier(0.4, 0, 0.2, 1),
			output: 'perceptual-scale',
		},
	);

	return (
		<AbsoluteFill style={{scale: pull}}>
			{narrow ? (
				<PhoneVerdict start={start} ruleIn={ruleIn} />
			) : (
				<div
					style={{
						position: 'absolute',
						inset: 0,
						display: 'flex',
						justifyContent: 'center',
						padding: '5vh 6vw',
					}}
				>
					<DesktopVerdict
						start={start}
						lead={lead}
						ruleIn={ruleIn}
						split={split}
					/>
				</div>
			)}
		</AbsoluteFill>
	);
};

/** The conclusion and the decision-guide lead. */
const Lead: React.FC<{opacity: number; compact?: boolean}> = ({
	opacity,
	compact,
}) => (
	<div
		style={{
			opacity,
			translate: `0px ${interpolate(opacity, [0, 1], [24, 0])}px`,
			display: 'flex',
			flexDirection: 'column',
			gap: compact ? 8 : 16,
			alignItems: 'center',
			textAlign: 'center',
		}}
	>
		<Eyebrow color={C.faint} size={compact ? 9 : 10}>
			Section 05 — Verdict
		</Eyebrow>
		<h2
			style={{
				margin: 0,
				fontFamily: FONT_DISPLAY,
				fontWeight: 400,
				fontSize: compact ? 30 : 'clamp(34px, 4.6vw, 74px)',
				lineHeight: 0.98,
				letterSpacing: '-0.024em',
				color: C.text,
				maxWidth: 1000,
			}}
		>
			<span
				style={{
					background: `linear-gradient(96deg, ${C.eastHi} 4%, ${C.east} 22%, #FFF4EE 40%, #FFFFFF 50%, #EDF3FF 60%, ${C.west} 78%, ${C.westHi} 96%)`,
					backgroundClip: 'text',
					WebkitBackgroundClip: 'text',
					color: 'transparent',
				}}
			>
				It depends what you value.
			</span>
		</h2>
		<p
			style={{
				margin: 0,
				fontFamily: FONT_BODY,
				fontSize: compact ? 10.5 : 'clamp(13px, 1.25vw, 16px)',
				fontWeight: 300,
				lineHeight: 1.6,
				color: C.dim,
				maxWidth: 700,
			}}
		>
			There is no winner here, and the framing itself is now out of date. The
			strongest model on this page is American; the best open-weights model in
			the world is Chinese; the fifth-best model belongs to neither camp’s
			stereotype. What follows is not a ranking. It is the shortest honest answer
			to “which one should I use?”
		</p>
	</div>
);

const DecisionRow: React.FC<{d: (typeof DECISIONS)[number]; i: number; start: number; compact?: boolean}> = ({
	d,
	i,
	start,
	compact,
}) => {
	const frame = useCurrentFrame();
	const at = start + i * 6;
	const p = interpolate(frame, [at, at + 24], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.16, 1, 0.3, 1),
	});
	return (
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: 'auto 1fr',
				gap: compact ? 10 : 16,
				padding: compact ? '0.9vh 0' : '1.2vh 0',
				borderTop: `1px solid ${C.ruleSoft}`,
				opacity: p,
				translate: `0px ${interpolate(p, [0, 1], [18, 0])}px`,
			}}
		>
			<span style={{...label(9), color: C.faint, paddingTop: 3}}>
				{String(i + 1).padStart(2, '0')}
			</span>
			<div style={{display: 'flex', flexDirection: 'column', gap: compact ? 4 : 6}}>
				<span
					style={{
						fontFamily: FONT_BODY,
						fontSize: compact ? 9.5 : 11.5,
						fontWeight: 300,
						color: C.faint,
						lineHeight: 1.45,
					}}
				>
					{d.pick}
				</span>
				<span
					style={{
						fontFamily: FONT_DISPLAY,
						fontSize: compact ? 15 : 'clamp(17px, 1.5vw, 23px)',
						lineHeight: 1.15,
						color: C.text,
						letterSpacing: '-0.01em',
					}}
				>
					{d.then}
				</span>
				<span
					style={{
						fontFamily: FONT_BODY,
						fontSize: compact ? 9 : 11,
						fontWeight: 300,
						lineHeight: 1.5,
						color: C.dim,
						opacity: 0.85,
						maxWidth: 460,
					}}
				>
					{d.because}
				</span>
			</div>
		</div>
	);
};

/** The one question the evidence cannot settle, stated plainly. */
const Unsettled: React.FC<{start: number; compact?: boolean}> = ({start, compact}) => {
	const frame = useCurrentFrame();
	return (
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: compact ? '1fr' : 'minmax(120px, 13%) 1fr',
				gap: compact ? 10 : 26,
				paddingTop: '1.4vh',
				opacity: interpolate(frame, [start, start + 26], [0, 1], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
					easing: Easing.bezier(0.16, 1, 0.3, 1),
				}),
			}}
		>
			<Eyebrow color={C.text} size={9.5}>
				Still unsettled
			</Eyebrow>
			<p
				style={{
					margin: 0,
					fontFamily: FONT_BODY,
					fontSize: compact ? 9 : 'clamp(12px, 1.05vw, 14px)',
					fontWeight: 300,
					lineHeight: 1.6,
					color: C.text,
					opacity: 0.86,
					maxWidth: 900,
				}}
			>
				One question this page cannot answer honestly, because the evidence runs
				in both directions. A Tongji University study of 2,303 questions across
				twenty models found the gap between US and Chinese models “smaller than
				commonly assumed”, with five of eleven international models still meeting
				Chinese compliance thresholds. A separate minimal-pair study found Chinese
				models refusing 80.2% of China-referent collective-action prompts against
				10.8% for Western models. A model can score 45% on FreedomBench and 97% on
				regulatory compliance at the same time — because answering with the official
				line is compliance, and is not truth.
			</p>
		</div>
	);
};

const DesktopVerdict: React.FC<{
	start: number;
	lead: number;
	ruleIn: number;
	split: number;
}> = ({start, lead, ruleIn, split}) => (
	<div style={{display: 'flex', flexDirection: 'column', gap: '2.6vh'}}>
		<Lead opacity={lead} />

		<Rule progress={ruleIn} />

		<div
			style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(2, 1fr)',
				gap: '1.5vh 3vw',
				scale: interpolate(split, [0, 1], [0.975, 1], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
					easing: Easing.bezier(0.16, 1, 0.3, 1),
					output: 'perceptual-scale',
				}),
			}}
		>
			{DECISIONS.map((d, i) => (
				<DecisionRow key={d.pick} d={d} i={i} start={start + 20} />
			))}
		</div>

		<Unsettled start={start + 70} />
	</div>
);

/**
 * On a phone the conclusion and the guide do not share a viewport, so the
 * section spends its frame budget on two sub-pages rather than shrinking the
 * type past the point of reading.
 */
const PhoneVerdict: React.FC<{start: number; ruleIn: number}> = ({
	start,
	ruleIn,
}) => {
	const frame = useCurrentFrame();
	const half = (T.verdict.out - T.verdict.in) / 2;
	const mid = start + half;

	const first = interpolate(frame, [start - 18, start + 24, mid - 20, mid + 8], [0, 1, 1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.16, 1, 0.3, 1),
	});
	const second = interpolate(
		frame,
		[mid - 20, mid + 10, T.verdict.out - 30, T.verdict.out + 18],
		[0, 1, 1, 0],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
			easing: Easing.bezier(0.16, 1, 0.3, 1),
		},
	);

	const box = (children: React.ReactNode) => (
		<div
			style={{
				position: 'absolute',
				inset: 0,
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				gap: '1.6vh',
				padding: '4vh 6vw',
			}}
		>
			{children}
		</div>
	);

	return (
		<>
			<div style={{...boxStyle, opacity: first}}>
				{box(
					<>
						<Lead opacity={1} compact />
						<Rule progress={ruleIn} />
						<div style={{display: 'flex', flexDirection: 'column'}}>
							{DECISIONS.slice(0, 3).map((d, i) => (
								<DecisionRow key={d.pick} d={d} i={i} start={start + 14} compact />
							))}
						</div>
					</>,
				)}
			</div>

			<div style={{...boxStyle, opacity: second}}>
				{box(
					<>
						<Eyebrow color={C.faint} size={9}>
							Section 05 — Decision guide, continued
						</Eyebrow>
						<Rule progress={second} />
						<div style={{display: 'flex', flexDirection: 'column'}}>
							{DECISIONS.slice(3).map((d, i) => (
								<DecisionRow key={d.pick} d={d} i={i + 3} start={mid + 14} compact />
							))}
						</div>
						<Unsettled start={mid + 48} compact />
					</>,
				)}
			</div>
		</>
	);
};

const boxStyle = {
	position: 'absolute' as const,
	inset: 0,
	display: 'flex' as const,
	flexDirection: 'column' as const,
	justifyContent: 'center' as const,
	gap: '1.6vh',
	padding: '4vh 6vw',
};