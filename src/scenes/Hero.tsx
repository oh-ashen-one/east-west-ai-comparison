import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT_BODY, FONT_DISPLAY, label} from '../theme';
import {Eyebrow} from '../components/Bits';
import {T} from '../data';

/**
 * Section 01 — Hero.
 *
 * IMPORTANT: this composition is scroll-driven, not playing. `useCurrentFrame()`
 * inside a `<Player>` with no playback is frozen at 0 and only advances when the
 * reader scrolls. So every element here is fully composed at frame 0 — the
 * resting state of the page must be the finished hero, not an empty stage.
 *
 * The one-time entrance is therefore a CSS animation (`data-rise`, defined in
 * index.html) that runs once on mount. Scroll-driven motion — the camera
 * pull-back, the seam, the ambient breathing — stays on the frame axis.
 */
export const Hero: React.FC = () => {
	const frame = useCurrentFrame();

	// Camera pull-back as the scroll begins. Genuinely scroll-driven.
	const pull = interpolate(
		frame,
		[T.hero.out - 150, T.hero.out + 60],
		[1, 0.82],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
			easing: Easing.bezier(0.4, 0, 0.2, 1),
			output: 'perceptual-scale',
		},
	);

	const lift = interpolate(frame, [T.hero.out - 150, T.hero.out + 60], [0, -46], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.4, 0, 0.2, 1),
	});

	// The seam is already open at rest and widens slightly as you scroll away.
	const seamOpen = interpolate(frame, [0, 40], [0.8, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.16, 1, 0.3, 1),
	});

	// A slow breathing scale so the hero is never fully static.
	const breathe = 1 + Math.sin(frame / 46) * 0.006;

	return (
		<AbsoluteFill
			style={{
				justifyContent: 'center',
				alignItems: 'center',
				scale: pull * breathe,
				translate: `0px ${lift}px`,
			}}
		>
			{/* Two fields meeting at a hairline seam */}
			<AbsoluteFill
				style={{
					translate: `${interpolate(seamOpen, [0, 1], [0, -50])}% 0px`,
					background: `linear-gradient(100deg, rgba(226,72,61,0.10) 0%, rgba(226,72,61,0.02) 38%, transparent 49%)`,
				}}
			/>
			<AbsoluteFill
				style={{
					translate: `${interpolate(seamOpen, [0, 1], [0, 50])}% 0px`,
					background: `linear-gradient(260deg, rgba(91,141,239,0.10) 0%, rgba(91,141,239,0.02) 38%, transparent 49%)`,
				}}
			/>

			{/* The centre seam itself */}
			<div
				style={{
					position: 'absolute',
					top: '14%',
					bottom: '14%',
					width: 1,
					background: `linear-gradient(180deg, transparent, ${C.rule} 22%, ${C.rule} 78%, transparent)`,
					opacity: seamOpen,
				}}
			/>

			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					textAlign: 'center',
					gap: 30,
					padding: '0 6vw',
					maxWidth: 1180,
				}}
			>
				<div data-rise style={{'--d': 40} as React.CSSProperties}>
					<Eyebrow color={C.dim} size={10.5}>
						An evidence-based comparison · 27 September 2026
					</Eyebrow>
				</div>

				{/* The premise, in one line. */}
				<div data-rise style={{'--d': 130} as React.CSSProperties}>
					<h1
						style={{
							margin: 0,
							fontFamily: FONT_DISPLAY,
							fontWeight: 400,
							fontSize: 'clamp(46px, 7.4vw, 116px)',
							lineHeight: 0.9,
							letterSpacing: '-0.026em',
							color: C.text,
						}}
					>
						<span
							style={{
								background: `linear-gradient(96deg, ${C.eastHi} 4%, ${C.east} 26%, #FFF6F0 44%, #FFFFFF 50%, #EEF4FF 56%, ${C.west} 74%, ${C.westHi} 96%)`,
								backgroundClip: 'text',
								WebkitBackgroundClip: 'text',
								color: 'transparent',
							}}
						>
							East vs West
						</span>
					</h1>
				</div>

				<div
					data-rise
					style={{display: 'flex', alignItems: 'center', gap: 18, '--d': 250} as React.CSSProperties}
				>
					<div style={{width: 64, height: 1, background: C.rule}} />
					<div
						style={{
							fontFamily: FONT_BODY,
							fontSize: 'clamp(14px, 1.5vw, 19px)',
							fontWeight: 300,
							letterSpacing: '0.02em',
							color: C.text,
							opacity: 0.9,
						}}
					>
						Ten frontier models, seven axes, no scorecards.
					</div>
					<div style={{width: 64, height: 1, background: C.rule}} />
				</div>

				{/* The three-word thesis */}
				<div
					data-rise
					style={{
						display: 'flex',
						gap: 34,
						flexWrap: 'wrap',
						justifyContent: 'center',
						'--d': 360,
					} as React.CSSProperties}
				>
					{[
						['Reasoning', 'where the West leads'],
						['Openness', 'where the East leads'],
						['Censorship', 'where neither wins'],
					].map(([k, v]) => (
						<div
							key={k}
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								gap: 6,
							}}
						>
							<span style={{...label(10), color: C.text}}>{k}</span>
							<span
								style={{
									fontFamily: FONT_BODY,
									fontSize: 11.5,
									fontWeight: 300,
									color: C.faint,
									letterSpacing: '0.02em',
								}}
							>
								{v}
							</span>
						</div>
					))}
				</div>
			</div>

			{/* Scroll cue — a hairline that draws itself downward as you scroll */}
			<div
				data-rise
				style={{
					position: 'absolute',
					bottom: '5.2%',
					left: '50%',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 12,
					translate: '-50% 0px',
					'--d': 470,
					opacity: interpolate(frame, [96, 150], [1, 0], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					}),
				} as React.CSSProperties}
			>
				<Eyebrow size={9.5}>Scroll</Eyebrow>
				<div
					style={{
						width: 1,
						height: 52,
						background: C.rule,
						position: 'relative',
						overflow: 'hidden',
					}}
				>
					<div
						style={{
							position: 'absolute',
							inset: 0,
							background: C.text,
							translate: `0px ${interpolate(
								frame,
								[0, 40],
								['0%', '100%'],
								{
									extrapolateRight: 'clamp',
									easing: Easing.bezier(0.4, 0, 0.2, 1),
								},
							)}`,
						}}
					/>
				</div>
			</div>
		</AbsoluteFill>
	);
};
