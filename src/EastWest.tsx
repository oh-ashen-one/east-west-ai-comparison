import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Atmosphere, SceneShell} from './components/Atmosphere';
import {Hero} from './scenes/Hero';
import {Contenders} from './scenes/Contenders';
import {AxisGallery} from './scenes/AxisGallery';
import {ProsCons} from './scenes/ProsCons';
import {Verdict} from './scenes/Verdict';
import {Footer} from './scenes/Footer';
import {T} from './data';
import {C, FONT_BODY, label} from './theme';
import './fonts';

/**
 * The master composition.
 *
 * Every scene is mounted at once and cross-dissolved against its neighbour, so
 * the page is one continuous camera move from the hero to the footer. Nothing
 * ever hard-cuts.
 */
export const EastWest: React.FC = () => {
	const frame = useCurrentFrame();

	// The atmosphere's colour balance travels from a 50/50 blend at the hero,
	// leans east through the contenders, splits down the middle in the gallery,
	// and settles neutral for the verdict.
	const blend = interpolate(
		frame,
		[0, T.contenders.in, T.axes.in, T.proscons.in, T.verdict.in],
		[0.5, 0.5, 0.5, 0.5, 0.5],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
			easing: Easing.bezier(0.16, 1, 0.3, 1),
		},
	);

	// A slow parallax on the glow layer, tied to scroll.
	const parallax = interpolate(frame, [0, 2400], [0, -140], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.4, 0, 0.2, 1),
	});

	// Scroll-progress hairline pinned to the right edge of the viewport.
	const progress = frame / 2400;

	return (
		<AbsoluteFill style={{backgroundColor: C.ink, overflow: 'hidden'}}>
			<Atmosphere blend={blend} parallax={parallax} />

			<AbsoluteFill>
				<SceneShell
					from={T.hero.in}
					to={T.hero.out}
					fade={34}
					zoom={0.86}
				>
					<Hero />
				</SceneShell>

				<SceneShell
					from={T.contenders.in}
					to={T.contenders.out}
					fade={30}
					zoom={0.93}
				>
					<Contenders />
				</SceneShell>

				<SceneShell
					from={T.axes.in - 26}
					to={T.axes.out + 26}
					fade={30}
					zoom={0.92}
				>
					<AxisGallery />
				</SceneShell>

				<SceneShell
					from={T.proscons.in - 20}
					to={T.proscons.out}
					fade={30}
					zoom={0.93}
				>
					<ProsCons />
				</SceneShell>

				<SceneShell
					from={T.verdict.in - 20}
					to={T.verdict.out}
					fade={30}
					zoom={0.93}
				>
					<Verdict />
				</SceneShell>

				{/*
				 * The footer holds. Its fade-out is pushed past the last frame so
				 * the sources and the date are fully legible at the end of the
				 * scroll rather than dissolving as you arrive.
				 */}
				<SceneShell
					from={T.footer.in - 10}
					to={T.footer.out + 90}
					fade={26}
					zoom={0.95}
				>
					<Footer />
				</SceneShell>
			</AbsoluteFill>

			{/* Progress hairline */}
			<div
				style={{
					position: 'absolute',
					right: 0,
					top: 0,
					bottom: 0,
					width: 2,
					background: C.ruleSoft,
				}}
			>
				<div
					style={{
						position: 'absolute',
						left: 0,
						right: 0,
						top: 0,
						height: '100%',
						background: `linear-gradient(180deg, ${C.east}, ${C.west})`,
						scale: `1 ${Math.max(0.0001, progress)}`,
						transformOrigin: 'top center',
					}}
				/>
			</div>

			{/*
			 * A running mark, set vertically on the left edge so it can never
			 * collide with a section heading no matter how tall that section is.
			 */}
			<div
				style={{
					position: 'absolute',
					left: '1.5vw',
					top: '50%',
					display: 'flex',
					alignItems: 'center',
					gap: 12,
					rotate: '-90deg',
					translate: '0 -50%',
					transformOrigin: 'left center',
					opacity: interpolate(frame, [70, 130, 2300, 2350], [0, 1, 1, 0], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					}),
				}}
			>
				<div
					style={{
						display: 'flex',
						width: 20,
						height: 4,
						borderRadius: 1,
						overflow: 'hidden',
					}}
				>
					<div style={{flex: 1, background: C.east}} />
					<div style={{flex: 1, background: C.west}} />
				</div>
				<span
					style={{
						...label(8.5),
						color: C.faint,
						fontFamily: FONT_BODY,
					}}
				>
					East vs West · 2026
				</span>
			</div>
		</AbsoluteFill>
	);
};
