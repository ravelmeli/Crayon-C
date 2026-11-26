import React from 'react';
import {Composition} from 'remotion';
import {CastSheetGta} from './scenes/CastSheetGta';
import {VideoGta} from './scenes/VideoGta';
import {TOTAL} from './lib';

export const RemotionRoot: React.FC = () => (
	<>
		<Composition id="CastSheetGta" component={CastSheetGta} durationInFrames={1} fps={30} width={2400} height={1800} />
		<Composition id="VideoGta" component={VideoGta} durationInFrames={TOTAL} fps={30} width={1920} height={1080} defaultProps={{muted: false}} />
	</>
);
