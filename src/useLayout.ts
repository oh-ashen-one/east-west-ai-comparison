import {useVideoConfig} from 'remotion';

/**
 * Layout tiers.
 *
 * The composition renders at the live viewport size, so every section can
 * branch on real available width rather than guessing with media queries.
 * Phones get a genuinely condensed layout — fewer decorative layers, stacked
 * chart rows, single-column prose — rather than a squeezed desktop.
 */
export type Tier = 'phone' | 'tablet' | 'desktop';

export const useTier = (): Tier => {
	const {width} = useVideoConfig();
	if (width < 700) return 'phone';
	if (width < 1100) return 'tablet';
	return 'desktop';
};

export const isNarrow = (t: Tier) => t === 'phone';
