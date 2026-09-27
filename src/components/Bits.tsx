import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT_BODY, FONT_DISPLAY, label} from '../theme';
import type {Side} from '../data';

export const sideColor = (side: Side) => (side === 'east' ? C.east : C.west);
export const sideHi = (side: Side) => (side === 'east' ? C.eastHi : C.westHi);
export const sideWord = (side: Side) => (side === 'east' ? 'East' : 'West');

/** Small tracked-out label. The workhorse of the whole layout. */
export const Eyebrow: React.FC<{
	children: React.ReactNode;
	color?: string;
	size?: number;
	style?: React.CSSProperties;
}> = ({children, color = C.faint, size = 11, style}) => (
	<div
		style={{
			...label(size),
			color,
			whiteSpace: 'nowrap',
			...style,
		}}
	>
		{children}
	</div>
);

/** A hairline that draws itself in from the left. */
export const Rule: React.FC<{
	progress: number;
	width?: string;
	color?: string;
	style?: React.CSSProperties;
}> = ({progress, width = '100%', color = C.rule, style}) => (
	<div
		style={{
			height: 1,
			width,
			background: color,
			scale: `${Math.max(0.0001, progress)} 1`,
			transformOrigin: 'left center',
			...style,
		}}
	/>
);

/** The pill that marks which side a model or datum belongs to. */
export const SideTag: React.FC<{side: Side; children?: React.ReactNode}> = ({
	side,
	children,
}) => {
	const col = sideColor(side);
	return (
		<div
			style={{
				display: 'inline-flex',
				alignItems: 'center',
				gap: 7,
				padding: '5px 11px 5px 9px',
				borderRadius: 999,
				border: `1px solid ${col}44`,
				background: `${col}12`,
				...label(9.5),
				color: col,
			}}
		>
			<span
				style={{
					width: 5,
					height: 5,
					borderRadius: 999,
					background: col,
					display: 'block',
				}}
			/>
			{children ?? sideWord(side)}
		</div>
	);
};

/**
 * A single comparison bar. `progress` (0–1) drives its width, and each bar
 * grows a beat after the one before it so a chart reads left-to-right.
 */
export const Bar: React.FC<{
	progress: number;
	side: Side;
	track?: string;
	style?: React.CSSProperties;
}> = ({progress, side, track = C.ruleSoft, style}) => (
	<div
		style={{
			position: 'relative',
			height: '100%',
			width: '100%',
			background: track,
			borderRadius: 2,
			overflow: 'hidden',
			...style,
		}}
	>
		<div
			style={{
				position: 'absolute',
				inset: 0,
				transformOrigin: 'left center',
				scale: `${Math.max(0.0001, Math.min(1, progress))} 1`,
				background: `linear-gradient(90deg, ${sideColor(side)} 0%, ${sideHi(side)} 100%)`,
			}}
		/>
	</div>
);

/**
 * Staggered entrance helper. `index` offsets a child inside a group reveal.
 * Returns the eased 0–1 progress for that child.
 */
export const stagger = (
	frame: number,
	index: number,
	start: number,
	step = 5,
	duration = 22,
) =>
	interpolate(frame, [start + index * step, start + index * step + duration], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.16, 1, 0.3, 1),
	});

/** A short kicker line under a section title. `width` is a percentage. */
export const Standfirst: React.FC<{
	children: React.ReactNode;
	width?: number;
	size?: number;
	style?: React.CSSProperties;
}> = ({children, width = 62, size = 15, style}) => (
	<div
		style={{
			fontFamily: FONT_BODY,
			fontSize: size,
			lineHeight: 1.62,
			fontWeight: 300,
			color: C.dim,
			maxWidth: `${width}%`,
			letterSpacing: '0.004em',
			...style,
		}}
	>
		{children}
	</div>
);

/** Display-face headline. */
export const Display: React.FC<{
	children: React.ReactNode;
	size: number;
	style?: React.CSSProperties;
}> = ({children, size, style}) => (
	<div
		style={{
			fontFamily: FONT_DISPLAY,
			fontSize: size,
			lineHeight: 0.94,
			letterSpacing: '-0.018em',
			color: C.text,
			...style,
		}}
	>
		{children}
	</div>
);

/** Live frame reader, used by the grain and any ambient loops. */
export const useT = () => useCurrentFrame() / 60;
