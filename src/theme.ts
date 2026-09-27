/**
 * Design tokens for the East vs West comparison.
 * Two accent families (warm "East" / cool "West") over a near-black ink base.
 */

export const FPS = 60;

/** Total scroll-driven length of the piece, in frames. */
export const DURATION = 2400;

/** Pixels of vertical scroll per frame of animation. */
export const PX_PER_FRAME = 2.6;

export const C = {
	ink: '#08090B',
	ink2: '#0C0E11',
	panel: '#101317',
	panelHi: '#161A1F',

	/** Warm family — "East" */
	east: '#E2483D',
	eastLo: '#8C1D18',
	eastHi: '#FF6B57',
	eastWash: 'rgba(226, 72, 61, 0.14)',

	/** Cool family — "West" */
	west: '#5B8DEF',
	westLo: '#1B3A6B',
	westHi: '#9CC0FF',
	westWash: 'rgba(91, 141, 239, 0.14)',

	text: '#F2F0EC',
	dim: '#9AA0A8',
	faint: '#5C636D',
	rule: 'rgba(242, 240, 236, 0.11)',
	ruleSoft: 'rgba(242, 240, 236, 0.06)',
} as const;

export const FONT_DISPLAY = 'Instrument Serif';
export const FONT_BODY = 'Inter';

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** Small-caps tracking label used for eyebrows and axis numbers. */
export const label = (size: number): React.CSSProperties => ({
	fontFamily: FONT_BODY,
	fontSize: size,
	fontWeight: 500,
	letterSpacing: '0.18em',
	textTransform: 'uppercase',
	fontVariantNumeric: 'tabular-nums',
});
