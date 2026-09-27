import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT_BODY, FONT_DISPLAY, label} from '../theme';
import {Eyebrow, Rule, sideColor, sideHi} from '../components/Bits';
import {MODELS, T, type Model, type Side} from '../data';
import {isNarrow, useTier} from '../useLayout';

const ALSO = [
	['MiniMax-M3', 'index 29 · MIT-style community licence, commercially restricted'],
	['Step 5 Preview', 'index 44 · weights promised 15 Oct 2026, no licence published'],
	['Doubao Seed 2.1', 'closed · ¥6 / ¥30 · the most-censored model in the literature'],
	['ERNIE 5.1', 'closed · #1 on Arena Search among Chinese models'],
	['Ling 3.0 Flash', 'index 25 · 339–373 t/s, the fastest Chinese model outright'],
	['Tencent Hy3', 'index 25 · $0.07 per task, 86.7% on FreedomBench'],
];

/**
 * Section 02 — The Contenders.
 *
 * A two-column grid, one column per family. Each card scales up from small as
 * the scroll reaches it, on a spring, and the whole grid carries a slow
 * continuous zoom underneath so the section reads as one camera move.
 */
export const Contenders: React.FC = () => {
	const frame = useCurrentFrame();
	const start = T.contenders.in;
	const narrow = isNarrow(useTier());

	// Continuous grid zoom: pushes in across the section, releases at the end.
	const gridZoom = interpolate(
		frame,
		[start, start + 200, T.contenders.out - 70, T.contenders.out + 40],
		[0.9, 1, 1.03, 0.96],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
			easing: Easing.bezier(0.16, 1, 0.3, 1),
			output: 'perceptual-scale',
		},
	);

	const headerIn = interpolate(frame, [start - 14, start + 16], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.16, 1, 0.3, 1),
	});

	const ruleIn = interpolate(
		frame,
		[start, start + 44],
		[0, 1],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
			easing: Easing.bezier(0.16, 1, 0.3, 1),
		},
	);

	const columns: {side: Side; models: Model[]}[] = [
		{side: 'east', models: MODELS.filter((m) => m.side === 'east')},
		{side: 'west', models: MODELS.filter((m) => m.side === 'west')},
	];

	const eastAvg =
		MODELS.filter((m) => m.side === 'east').reduce((a, m) => a + m.index, 0) / 5;
	const westAvg =
		MODELS.filter((m) => m.side === 'west').reduce((a, m) => a + m.index, 0) / 5;

	return (
		<AbsoluteFill
			style={{
				justifyContent: 'center',
				padding: '5vh 5vw',
				scale: gridZoom,
			}}
		>
			{/* Section header */}
			<div
				style={{
					display: 'flex',
					alignItems: 'flex-end',
					justifyContent: 'space-between',
					gap: 32,
					marginBottom: '3.2vh',
					opacity: headerIn,
					translate: `0px ${interpolate(headerIn, [0, 1], [18, 0])}px`,
					flexWrap: 'wrap',
				}}
			>
				<div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
					<Eyebrow color={C.faint} size={10}>
						Section 02 — The field
					</Eyebrow>
					<h2
						style={{
							margin: 0,
							fontFamily: FONT_DISPLAY,
							fontWeight: 400,
							fontSize: 'clamp(30px, 3.4vw, 52px)',
							lineHeight: 1,
							letterSpacing: '-0.02em',
							color: C.text,
						}}
					>
						The contenders
					</h2>
				</div>

				<div
					style={{
						display: 'flex',
						gap: narrow ? 26 : 40,
						alignItems: 'flex-end',
					}}
				>
					{columns.map((col) => (
						<div
							key={col.side}
							style={{
								display: 'flex',
								flexDirection: 'column',
								gap: 7,
								alignItems: 'flex-end',
							}}
						>
							<Eyebrow color={sideColor(col.side)} size={9.5}>
								{col.side === 'east' ? 'China-based' : 'US-based'}
							</Eyebrow>
							<span
								style={{
									fontFamily: FONT_DISPLAY,
									fontSize: 30,
									lineHeight: 1,
									color: sideHi(col.side),
									fontVariantNumeric: 'tabular-nums',
								}}
							>
								{(col.side === 'east' ? eastAvg : westAvg).toFixed(1)}
							</span>
							<span
								style={{
									...label(8.5),
									color: C.faint,
								}}
							>
								Mean index
							</span>
						</div>
					))}
				</div>
			</div>

			<Rule progress={ruleIn} style={{marginBottom: '2.4vh'}} />

			{/* The grid */}
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: '1fr 1fr',
					gap: '1.1vh 1.6vw',
					flex: 1,
					minHeight: 0,
				}}
			>
				{columns.map((col) => (
					<div
						key={col.side}
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: '1.1vh',
							minHeight: 0,
						}}
					>
						{col.models.map((m, i) => (
							<Card
								key={m.id}
								model={m}
								index={i}
								start={start + 20}
								narrow={narrow}
							/>
						))}
					</div>
				))}
			</div>

			{/* Also on the board */}
			<div
				style={{
					marginTop: '2.2vh',
					opacity: interpolate(
						frame,
						[start + 44, start + 74],
						[0, 1],
						{
							extrapolateLeft: 'clamp',
							extrapolateRight: 'clamp',
							easing: Easing.bezier(0.16, 1, 0.3, 1),
						},
					),
				}}
			>
				<Rule progress={ruleIn} style={{marginBottom: '1.6vh'}} />
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: narrow ? '1fr' : 'repeat(3, 1fr)',
						gap: '0.4vh 1.6vw',
					}}
				>
					{ALSO.map(([n, d]) => (
						<div
							key={n}
							style={{
								display: 'flex',
								gap: 10,
								alignItems: 'baseline',
								fontFamily: FONT_BODY,
								fontSize: 10.5,
								fontWeight: 300,
								color: C.faint,
							}}
						>
							<span
								style={{
									color: C.dim,
									fontWeight: 500,
									whiteSpace: 'nowrap',
								}}
							>
								{n}
							</span>
							<span>{d}</span>
						</div>
					))}
				</div>
			</div>
		</AbsoluteFill>
	);
};

const Card: React.FC<{
	model: Model;
	index: number;
	start: number;
	narrow: boolean;
}> = ({model, index, start, narrow}) => {
	const frame = useCurrentFrame();
	const at = start + index * 6;
	const col = sideColor(model.side);

	// Zoom-in-on-scroll entrance: from small, springing to full.
	const p = interpolate(frame, [at, at + 24], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.16, 1, 0.3, 1),
	});

	// A slow, continuous per-card scale-up as the scroll travels through the
	// section, so cards keep growing even after they have landed.
	const travel = interpolate(frame, [at, at + 150], [0.86, 1.03], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.16, 1, 0.3, 1),
		output: 'perceptual-scale',
	});

	if (p <= 0.001) {
		return null;
	}

	return (
		<div
			style={{
				position: 'relative',
				flex: 1,
				minHeight: 0,
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				gap: narrow ? 4 : 7,
				padding: narrow ? '0.9vh 0.9vw' : '1.1vh 1.1vw',
				borderRadius: 3,
				border: `1px solid ${C.ruleSoft}`,
				background: `linear-gradient(135deg, ${col}0E 0%, rgba(16,19,23,0.55) 42%, rgba(12,14,17,0.5) 100%)`,
				overflow: 'hidden',
				opacity: p,
				scale: (0.9 + (travel - 0.86) * 0.9) * (0.97 + p * 0.03),
				translate: `0px ${interpolate(p, [0, 1], [22, 0])}px`,
			}}
		>
			{/* A hairline of the family's colour along the leading edge */}
			<div
				style={{
					position: 'absolute',
					left: 0,
					top: 0,
					bottom: 0,
					width: 2,
					background: `linear-gradient(180deg, ${col}, transparent)`,
					opacity: 0.7,
				}}
			/>

			<div
				style={{
					display: 'flex',
					alignItems: 'baseline',
					justifyContent: 'space-between',
					gap: 12,
				}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'baseline',
						gap: 10,
						minWidth: 0,
					}}
				>
					<span
						style={{
							fontFamily: FONT_DISPLAY,
							fontSize: narrow ? 14 : 'clamp(17px, 1.55vw, 25px)',
							lineHeight: 1.05,
							letterSpacing: '-0.012em',
							color: C.text,
							whiteSpace: 'nowrap',
						}}
					>
						{model.name}
					</span>
					{model.flag ? (
						<span style={{color: col, fontSize: 13, ...label(11)}}>
							{model.flag}
						</span>
					) : null}
				</div>

				<span
					style={{
						fontFamily: FONT_DISPLAY,
						fontSize: 'clamp(19px, 1.75vw, 28px)',
						lineHeight: 1,
						color: col,
						fontVariantNumeric: 'tabular-nums',
						flexShrink: 0,
					}}
				>
					{model.index}
				</span>
			</div>

			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					gap: 12,
					fontFamily: FONT_BODY,
					fontSize: narrow ? 8.5 : 9.5,
					fontWeight: 300,
					color: C.faint,
					letterSpacing: '0.03em',
				}}
			>
				<span style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
					{narrow ? model.license : model.vendor}
				</span>
				<span style={{color: C.faint, whiteSpace: 'nowrap'}}>
					{narrow ? model.params : model.license}
				</span>
			</div>

			{/* Stat strip — desktop and tablet only */}
			{narrow ? null : <div
				style={{
					display: 'flex',
					gap: 6,
					flexWrap: 'wrap',
					opacity: interpolate(p, [0.3, 1], [0, 1], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					}),
				}}
			>
				<Chip label="ctx" value={model.ctxShort} />
				<Chip
					label="$/M"
					value={`${model.priceIn} · ${model.priceOut}`}
				/>
				<Chip label="t/s" value={String(model.tps)} />
			</div>}
		</div>
	);
};

const Chip: React.FC<{label: string; value: string}> = ({label: l, value}) => (
	<span
		style={{
			display: 'inline-flex',
			alignItems: 'baseline',
			gap: 5,
			padding: '3px 7px',
			borderRadius: 2,
			background: 'rgba(242,240,236,0.045)',
			fontFamily: FONT_BODY,
			fontSize: 8.5,
			fontWeight: 400,
			letterSpacing: '0.06em',
			color: C.faint,
			whiteSpace: 'nowrap',
		}}
	>
		<span style={{opacity: 0.62}}>{l}</span>
		<span
			style={{
				color: C.dim,
				fontVariantNumeric: 'tabular-nums',
				letterSpacing: '0.02em',
			}}
		>
			{value}
		</span>
	</span>
);
