import {Composition} from 'remotion';
import {EastWest} from './EastWest';
import {DURATION, FPS} from './theme';
import './fonts';

/**
 * Studio registration, so the composition can be scrubbed frame by frame
 * while building. The scroll behaviour itself lives in the Vite app.
 */
export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="EastWest"
				component={EastWest}
				durationInFrames={DURATION}
				fps={FPS}
				width={1440}
				height={900}
			/>
			<Composition
				id="EastWestTall"
				component={EastWest}
				durationInFrames={DURATION}
				fps={FPS}
				width={1080}
				height={1920}
			/>
		</>
	);
};
