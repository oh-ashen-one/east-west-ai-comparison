import {Player, type PlayerRef} from '@remotion/player';
import {StrictMode, useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {EastWest} from './EastWest';
import {DURATION, FPS, PX_PER_FRAME} from './theme';

/**
 * Scroll engine.
 *
 * The page is a real scroll runway. Native scroll position maps to a frame
 * index; a rAF loop eases the rendered frame toward the target so the motion
 * is smoothed by the same clock as everything else, and the <Player> is seeked
 * to that frame. Every animation in the composition is therefore driven by
 * useCurrentFrame(), as Remotion intends — there is no CSS transition anywhere.
 */

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

const Stage: React.FC = () => {
	const playerRef = useRef<PlayerRef>(null);
	const stageRef = useRef<HTMLDivElement>(null);

	const [size, setSize] = useState(() => measure());
	const target = useRef(0);
	const smooth = useRef(0);
	const reduced = useRef(false);

	// Live viewport size → the composition is genuinely responsive rather than
	// a fixed 16:9 canvas letterboxed into the window.
	useEffect(() => {
		const onResize = () => setSize(measure());
		window.addEventListener('resize', onResize);
		window.addEventListener('orientationchange', onResize);
		return () => {
			window.removeEventListener('resize', onResize);
			window.removeEventListener('orientationchange', onResize);
		};
	}, []);

	/**
	 * The runway gives the document its scrollable height. It must be one
	 * viewport taller than the last frame, otherwise the maximum scrollTop
	 * is short of the final frame and the end of the page is unreachable.
	 */
	useEffect(() => {
		const runway = document.getElementById('runway');
		if (runway) {
			runway.style.height = `${Math.round((DURATION - 1) * PX_PER_FRAME) + window.innerHeight}px`;
		}
	}, [size.height]);

	useEffect(() => {
		reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	}, []);

	// Read scroll, and ease the frame toward it.
	useEffect(() => {
		let raf = 0;
		let last = -1;

		const onScroll = () => {
			target.current = clamp(window.scrollY / PX_PER_FRAME, 0, DURATION - 1);
		};

		const tick = () => {
			const t = target.current;
			// Critically-damped-feeling approach: fast catch-up, soft landing.
			smooth.current += (t - smooth.current) * (reduced.current ? 1 : 0.19);

			if (Math.abs(t - smooth.current) < 0.004) {
				smooth.current = t;
			}

			const f = Math.round(smooth.current);
			if (f !== last) {
				last = f;
				playerRef.current?.seekTo(f);
			}
			raf = requestAnimationFrame(tick);
		};

		onScroll();
		smooth.current = target.current;
		playerRef.current?.seekTo(Math.round(target.current));

		window.addEventListener('scroll', onScroll, {passive: true});
		raf = requestAnimationFrame(tick);

		return () => {
			window.removeEventListener('scroll', onScroll);
			cancelAnimationFrame(raf);
		};
	}, []);

	// Keep the seek loop in step if the player is remounted on resize.
	useEffect(() => {
		playerRef.current?.seekTo(Math.round(smooth.current));
	}, [size.width, size.height]);

	return (
		<div
			ref={stageRef}
			style={{
				position: 'absolute',
				inset: 0,
				display: 'flex',
			}}
		>
			<Player
				ref={playerRef}
				component={EastWest}
				durationInFrames={DURATION}
				fps={FPS}
				compositionWidth={size.width}
				compositionHeight={size.height}
				controls={false}
				loop={false}
				clickToPlay={false}
				acknowledgeRemotionLicense
				style={{
					width: '100%',
					height: '100%',
				}}
			/>
		</div>
	);
};

const measure = () => ({
	width: Math.max(320, window.innerWidth),
	height: Math.max(320, window.innerHeight),
});

const stage = document.getElementById('stage');
if (stage) {
	createRoot(stage).render(
		<StrictMode>
			<Stage />
		</StrictMode>,
	);
}
