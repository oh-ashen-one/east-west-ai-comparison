import {
	AbsoluteFill,
	Easing,
	interpolate,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {C, FONT_BODY, FONT_DISPLAY, label} from '../theme';
import {Eyebrow, Rule, Standfirst, sideColor, sideHi, sideWord} from '../components/Bits';
import {AXES, T, type Axis} from '../data';
import {isNarrow, useTier} from '../useLayout';

/** Frames spent on each axis panel. */
const SEG = (T.axes.out - T.axes.in) / AXES.length;

/**
 * Hold windows inside each segment: the panel sits still, then travels, then
 * sits still again. This is what makes a sideways gallery feel deliberate
 * rather than like a scrollbar.
 */
const HOLD_IN = 0.1;
const HOLD_OUT = 0.9;

const easeHold = (local: number) => {
	const c = Math.max(0, Math.min(1, local));
	return interpolate(c, [0, HOLD_IN, HOLD_OUT, 1], [0, 0, 1, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.42, 0, 0.16, 1),
	});
};

/**
 * Section 03 — Head-to-head axes.
 *
 * A horizontal gallery: vertical scroll is converted into sideways travel
 * through six axis panels, each with a full-width chart, a verdict, and the
 * methodology note that makes the number defensible.
 */
export const AxisGallery: React.FC = () => {
	const frame = useCurrentFrame();
	const {width} = useVideoConfig();

	const raw = (frame - T.axes.in) / SEG;
	const idx = Math.max(0, Math.min(AXES.length - 1, Math.floor(raw)));
	const local = Math.max(0, Math.min(1, raw - idx));
	const travelled = idx + easeHold(local);

	// The whole track slides sideways. transform only — no layout work.
	const x = -travelled * width;

	// The gallery itself breathes in from small and hands off at the end.
	const inScale = interpolate(
		frame,
		[T.axes.in - 30, T.axes.in + 70],
		[0.9, 1],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
			easing: Easing.bezier(0.16, 1, 0.3, 1),
			output: 'perceptual-scale',
		},
	);

	const railIn = interpolate(frame, [T.axes.in + 10, T.axes.in + 70], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.16, 1, 0.3, 1),
	});

	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			{/* Section chrome, fixed above the track */}
			<AbsoluteFill
				style={{
					justifyContent: 'space-between',
					padding: '5vh 5vw 4vh',
					pointerEvents: 'none',
				}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'flex-end',
						justifyContent: 'space-between',
						gap: 24,
						opacity: railIn,
					}}
				>
					<div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
						<Eyebrow color={C.faint} size={10}>
							Section 03 — Head to head
						</Eyebrow>
						<h2
							style={{
								margin: 0,
								fontFamily: FONT_DISPLAY,
								fontWeight: 400,
								fontSize: 'clamp(26px, 2.9vw, 44px)',
								lineHeight: 1,
								letterSpacing: '-0.02em',
								color: C.text,
							}}
						>
							Seven axes, one scroll
						</h2>
					</div>

					<TravelHint travelled={travelled} />
				</div>

				<Rule progress={railIn} />

				<AxisRail
					travelled={travelled}
					progress={railIn}
				/>
			</AbsoluteFill>

			{/*
			 * The travelling track. An absolutely positioned child ignores its
			 * wrapper's padding, so the insets that keep the panel clear of the
			 * section chrome are set on the track itself.
			 */}
			<AbsoluteFill style={{scale: inScale}}>
				{/*
				 * The track needs an explicit width: an absolutely positioned
				 * flex row with only `left: 0` shrink-to-fits to the containing
				 * block, which collapses the panels instead of overflowing them.
				 * `data-travel` exposes the current offset for the verify script.
				 */}
				<div
					data-travel={x}
					style={{
						position: 'absolute',
						top: isNarrow(useTier()) ? '17vh' : '20vh',
						bottom: isNarrow(useTier()) ? '9vh' : '11vh',
						left: 0,
						width: width * AXES.length,
						display: 'flex',
						translate: `${x}px 0px`,
						willChange: 'transform',
					}}
				>
					{AXES.map((axis, i) => (
						<div
							key={axis.id}
							style={{
								position: 'relative',
								width,
								height: '100%',
								flexShrink: 0,
							}}
						>
							<Panel axis={axis} index={i} distance={i - idx} />
						</div>
					))}
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

/** The little "keep scrolling, this moves sideways" affordance. */
const TravelHint: React.FC<{travelled: number}> = ({travelled}) => {
	const frame = useCurrentFrame();
	const bob = Math.sin(frame / 22) * 4;
	const fade = interpolate(
		frame,
		[T.axes.in + 16, T.axes.in + 84],
		[0, 1],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
			easing: Easing.bezier(0.16, 1, 0.3, 1),
		},
	);

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 12,
				opacity: fade,
			}}
		>
			<span style={{...label(9.5), color: C.faint}}>Travel sideways</span>
			<div
				style={{
					position: 'relative',
					width: 64,
					height: 1,
					background: C.rule,
					translate: `${bob}px 0px`,
				}}
			>
				<div
					style={{
						position: 'absolute',
						inset: 0,
						background: C.dim,
						transformOrigin: 'left center',
						scale: `${Math.max(0, Math.min(1, (travelled % 1) * 3))} 1`,
					}}
				/>
			</div>
			<div
				style={{
					width: 6,
					height: 6,
					borderRight: `1px solid ${C.dim}`,
					borderTop: `1px solid ${C.dim}`,
					rotate: '45deg',
					translate: `${bob + 6}px 0px`,
				}}
			/>
		</div>
	);
};

/** A progress rail of the six axes, pinned to the bottom of the viewport. */
const AxisRail: React.FC<{travelled: number; progress: number}> = ({
	travelled,
	progress,
}) => (
	<div
		style={{
			display: 'flex',
			alignItems: 'center',
			gap: 10,
			opacity: progress,
		}}
	>
		{AXES.map((a, i) => {
			const active = Math.abs(travelled - i) < 0.5;
			const passed = travelled > i;
			return (
				<div
					key={a.id}
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 10,
						opacity: active ? 1 : 0.42,
						transition: undefined,
					}}
				>
					<div
						style={{
							width: active ? 34 : 18,
							height: 1,
							background: active
								? C.text
								: passed
									? C.dim
									: C.rule,
						}}
					/>
					<span
						style={{
							...label(9),
							color: active ? C.text : C.faint,
						}}
					>
						{a.number}
					</span>
				</div>
			);
		})}
		<span style={{...label(9), color: C.faint, marginLeft: 6}}>
			{AXES[Math.round(travelled)]?.title}
		</span>
	</div>
);

/**
 * One axis panel. `distance` is the signed distance from the panel to the
 * viewport centre, which drives the per-panel zoom and the slide-in offset.
 */
const Panel: React.FC<{axis: Axis; index: number; distance: number}> = ({
	axis,
	index,
	distance,
}) => {
	const frame = useCurrentFrame();
	const narrow = isNarrow(useTier());
	// The entrance begins well before this panel reaches the centre of the
	// viewport, so it is fully composed by the time it settles and holds.
	const at = T.axes.in + index * SEG - 70;

	const enter = interpolate(frame, [at, at + 36], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.16, 1, 0.3, 1),
	});

	// Panels zoom as they reach the centre of the viewport.
	const zoom = interpolate(
		Math.abs(distance),
		[0, 1, 2],
		[1, 0.93, 0.86],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
			easing: Easing.bezier(0.16, 1, 0.3, 1),
			output: 'perceptual-scale',
		},
	);

	// Rows are ordered by value so each chart reads as a ranking.
	const rows = [...axis.rows].sort((a, b) => b.value - a.value);

	// Charts whose values are clustered in a narrow high band (Arena scores)
	// are read against a zoomed scale, or every bar would be the same length.
	const values = rows.map((r) => r.value);
	const lo = Math.min(...values);
	const hi = Math.max(...values);
	const zoomed = lo > 100;
	const norm = (v: number) =>
		zoomed
			? interpolate(v, [lo - (hi - lo) * 0.6, hi], [0, 1], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				})
			: interpolate(v, [0, hi], [0, 1], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				});

	const verdictCol =
		axis.verdictSide === 'split' ? C.text : sideColor(axis.verdictSide);

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'flex-start',
				height: '100%',
				gap: narrow ? '1.1vh' : '2.2vh',
				padding: `0 ${narrow ? '6vw' : '5vw'}`,
				opacity: enter,
				scale: zoom,
				translate: `${interpolate(enter, [0, 1], [70, 0])}px 0px`,
			}}
		>
			{/* Panel head */}
			<div
				style={{
					display: 'flex',
					flexDirection: narrow ? 'column' : 'row',
					alignItems: narrow ? 'flex-start' : 'flex-end',
					justifyContent: 'space-between',
					gap: narrow ? 10 : 40,
				}}
			>
				<div style={{display: 'flex', alignItems: 'baseline', gap: narrow ? 12 : 22}}>
					<span
						style={{
							fontFamily: FONT_DISPLAY,
							fontSize: narrow ? 30 : 'clamp(40px, 5.2vw, 88px)',
							lineHeight: 0.82,
							color: C.rule,
							fontVariantNumeric: 'tabular-nums',
						}}
					>
						{axis.number}
					</span>
					<h3
						style={{
							margin: 0,
							fontFamily: FONT_DISPLAY,
							fontWeight: 400,
							fontSize: narrow ? 25 : 'clamp(30px, 3.6vw, 60px)',
							lineHeight: 0.95,
							letterSpacing: '-0.022em',
							color: C.text,
						}}
					>
						{axis.title}
					</h3>
				</div>
				<Standfirst width={narrow ? 100 : 44} size={narrow ? 12 : 15}>
						{axis.standfirst}
					</Standfirst>
			</div>

			<Rule progress={enter} />

			{/* Chart — absorbs the panel's spare height and spreads into it */}
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					flex: 1,
					minHeight: 0,
					padding: '0.6vh 0',
				}}
			>
				{rows.map((r, i) => {
					const bat = at + 6 + i * 4;
					const p = interpolate(frame, [bat, bat + 20], [0, 1], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
						easing: Easing.bezier(0.16, 1, 0.3, 1),
					});
					const col = sideColor(r.side);
					return (
						<div
							key={r.label}
							style={{
								display: 'grid',
								gridTemplateColumns: narrow
									? '1fr auto'
									: 'minmax(140px, 18%) 1fr minmax(168px, 18%)',
								gridTemplateRows: narrow ? 'auto auto' : 'auto',
								gridTemplateAreas: narrow
									? '"label value" "bar bar"'
									: undefined,
								alignItems: 'center',
								columnGap: 20,
								rowGap: narrow ? 5 : 0,
								opacity: interpolate(p, [0, 0.5, 1], [0, 0.85, 1]),
							}}
						>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: 9,
									minWidth: 0,
									gridArea: narrow ? 'label' : undefined,
								}}
							>
								<span
									style={{
										width: 6,
										height: 6,
										borderRadius: 1,
										background: col,
										flexShrink: 0,
										opacity: 0.9,
									}}
								/>
								<span
									style={{
										fontFamily: FONT_BODY,
										fontSize: narrow ? 10.5 : 12.5,
										fontWeight: 400,
										color: C.text,
										whiteSpace: 'nowrap',
										overflow: 'hidden',
										textOverflow: 'ellipsis',
									}}
								>
									{r.label}
								</span>
							</div>

							<div
								style={{
									height: narrow ? 7 : 11,
									position: 'relative',
									gridArea: narrow ? 'bar' : undefined,
								}}
							>
								<div
									style={{
										position: 'absolute',
										inset: 0,
										background: C.ruleSoft,
										borderRadius: 1,
									}}
								/>
								<div
									style={{
										position: 'absolute',
										left: 0,
										top: 0,
										bottom: 0,
										width: `${norm(r.value) * 100}%`,
										background: `linear-gradient(90deg, ${col} 0%, ${sideHi(r.side)} 100%)`,
										borderRadius: 1,
										scale: `${Math.max(0.0001, p)} 1`,
										transformOrigin: 'left center',
									}}
								/>
							</div>

							<div
								style={{
									display: 'flex',
									alignItems: 'baseline',
									justifyContent: 'flex-end',
									gap: 8,
									textAlign: 'right',
									gridArea: narrow ? 'value' : undefined,
								}}
							>
								<span
									style={{
										fontFamily: FONT_BODY,
										fontSize: narrow ? 11 : 13,
										fontWeight: 500,
										color: col,
										fontVariantNumeric: 'tabular-nums',
										letterSpacing: '0.01em',
									}}
								>
									{r.display}
								</span>
								{r.note && !narrow ? (
									<span
										style={{
											...label(8),
											color: C.faint,
											maxWidth: 130,
											lineHeight: 1.4,
											whiteSpace: 'normal',
											textAlign: 'right',
										}}
									>
										{r.note}
									</span>
								) : null}
							</div>
						</div>
					);
				})}
			</div>

			{/* Verdict */}
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: narrow ? '1fr' : 'minmax(120px, 13%) 1fr',
					gap: narrow ? 10 : 26,
					paddingTop: '1.4vh',
					borderTop: `1px solid ${C.rule}`,
					opacity: interpolate(frame, [at + 34, at + 58], [0, 1], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
						easing: Easing.bezier(0.16, 1, 0.3, 1),
					}),
				}}
			>
				<div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
					<Eyebrow color={verdictCol} size={9.5}>
						Verdict
					</Eyebrow>
					<span
						style={{
							...label(9),
							color: C.faint,
						}}
					>
						{axis.verdictSide === 'split'
							? 'Split decision'
							: `${sideWord(axis.verdictSide)} leads`}
					</span>
				</div>
				<p
					style={{
						margin: 0,
						fontFamily: FONT_BODY,
						fontSize: narrow ? 10.5 : 'clamp(13px, 1.15vw, 16px)',
						fontWeight: 300,
						lineHeight: 1.5,
						color: C.text,
						opacity: 0.9,
						maxWidth: 880,
					}}
				>
					{axis.verdict}
				</p>
			</div>

			{/* Methodology — the thing that makes the number defensible */}
			<div
				style={{
					display: 'flex',
					gap: 16,
					opacity: interpolate(frame, [at + 48, at + 76], [0, 1], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
						easing: Easing.bezier(0.16, 1, 0.3, 1),
					}),
				}}
			>
				<div
					style={{
						width: 1,
						background: C.rule,
						flexShrink: 0,
					}}
				/>
				<p
					style={{
						margin: 0,
						fontFamily: FONT_BODY,
						fontSize: narrow ? 7.8 : 10.5,
						fontWeight: 300,
						lineHeight: 1.45,
						color: C.faint,
						maxWidth: 940,
					}}
				>
					{axis.method}
				</p>
			</div>
		</div>
	);
};
