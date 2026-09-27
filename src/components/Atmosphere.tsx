import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C} from '../theme';

/**
 * The persistent atmosphere: a near-black ink field, two accent glows that
 * blend through the centre, a hairline grid, and film grain.
 *
 * The glows drift slowly with the frame so no two moments of the scroll look
 * identical, and the whole layer parallaxes at a fraction of the scroll rate.
 */

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='260' height='260'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='260' height='260' filter='url(%23n)'/%3E%3C/svg%3E")`;

export const Atmosphere: React.FC<{
	/** 0 = east-weighted, 1 = west-weighted. Drives the glow balance. */
	blend?: number;
	/** Vertical parallax offset in px, applied to the glow layer. */
	parallax?: number;
}> = ({blend = 0.5, parallax = 0}) => {
	const frame = useCurrentFrame();
	const t = frame / 60;

	// Slow, non-repeating-feeling drift on the glow centres.
	const eastX = interpolate(
		Math.sin(t * 0.11),
		[-1, 1],
		[-14, 14],
	);
	const westX = interpolate(
		Math.cos(t * 0.09),
		[-1, 1],
		[14, -14],
	);
	const breathe = 1 + Math.sin(t * 0.16) * 0.06;

	// The centre seam glows where the two families meet.
	const seam = Math.sin((blend * Math.PI)) ** 0.6;

	return (
		<AbsoluteFill style={{backgroundColor: C.ink}}>
			{/* Base vertical wash */}
			<AbsoluteFill
				style={{
					background: `linear-gradient(180deg, ${C.ink} 0%, ${C.ink2} 45%, ${C.ink} 100%)`,
				}}
			/>

			{/* Warm family glow */}
			<AbsoluteFill
				style={{
					translate: `${eastX}px ${parallax * 0.6}px`,
					scale: breathe,
					background: `radial-gradient(60% 55% at ${18 + (1 - blend) * 8}% 42%, ${C.eastWash} 0%, rgba(226,72,61,0.05) 42%, transparent 72%)`,
				}}
			/>

			{/* Cool family glow */}
			<AbsoluteFill
				style={{
					translate: `${westX}px ${parallax * 0.45}px`,
					scale: breathe,
					background: `radial-gradient(60% 55% at ${82 - blend * 8}% 58%, ${C.westWash} 0%, rgba(91,141,239,0.05) 42%, transparent 72%)`,
				}}
			/>

			{/* The seam where the two families meet */}
			<AbsoluteFill
				style={{
					translate: `0px ${parallax * 0.3}px`,
					opacity: seam * 0.5,
					background: `radial-gradient(30% 40% at 50% 50%, rgba(242,240,236,${0.055 * seam}) 0%, transparent 70%)`,
				}}
			/>

			{/* Hairline column grid — the editorial substrate */}
			<AbsoluteFill
				style={{
					opacity: 0.5,
					backgroundImage: `linear-gradient(90deg, ${C.ruleSoft} 1px, transparent 1px)`,
					backgroundSize: '12.5% 100%',
					translate: `0px ${parallax * 0.22}px`,
				}}
			/>

			{/* Vignette */}
			<AbsoluteFill
				style={{
					background:
						'radial-gradient(120% 90% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)',
				}}
			/>

			{/* Film grain */}
			<AbsoluteFill
				style={{
					backgroundImage: GRAIN,
					backgroundSize: '260px 260px',
					opacity: 0.038,
					mixBlendMode: 'overlay',
					translate: `${(frame * 0.7) % 260}px ${(frame * 0.4) % 260}px`,
				}}
			/>
		</AbsoluteFill>
	);
};

/**
 * A scene that cross-dissolves and scale-interpolates in and out of the page,
 * so no section ever hard-cuts against its neighbour.
 */
export const SceneShell: React.FC<{
	from: number;
	to: number;
	fade?: number;
	/** Scale at the moment the scene is fully invisible, on entry and exit. */
	zoom?: number;
	style?: React.CSSProperties;
	children: React.ReactNode;
}> = ({from, to, fade = 26, zoom = 0.94, style, children}) => {
	const frame = useCurrentFrame();

	const opacity = interpolate(
		frame,
		[from - fade, from + fade, to - fade, to + fade],
		[0, 1, 1, 0],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
			easing: Easing.bezier(0.16, 1, 0.3, 1),
		},
	);

	// Scale dips at both ends: the camera pushes in on arrival and pulls back
	// on exit, which is what reads as a continuous move rather than a cut.
	const scale = interpolate(
		frame,
		[from - fade, from + fade * 2, to - fade * 2, to + fade],
		[zoom, 1, 1, 1 + (1 - zoom) * 0.6],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
			easing: Easing.bezier(0.16, 1, 0.3, 1),
			output: 'perceptual-scale',
		},
	);

	if (opacity <= 0.001) {
		return null;
	}

	return (
		<AbsoluteFill style={{opacity, scale, ...style}}>{children}</AbsoluteFill>
	);
};
