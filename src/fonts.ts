import {loadFont as loadInstrumentSerif} from '@remotion/google-fonts/InstrumentSerif';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';

/**
 * One high-contrast editorial display face, one neutral UI face.
 * Loaded from Google's CDN at the exact weights used below, so the page
 * renders identically on every machine and needs no local font files.
 */
loadInstrumentSerif('normal', {
	weights: ['400'],
	subsets: ['latin'],
});

loadInter('normal', {
	weights: ['300', '400', '500', '600'],
	subsets: ['latin'],
});
