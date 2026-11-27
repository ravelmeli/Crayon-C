import React from 'react';
import {Composition} from 'remotion';
import {VideoPml} from './scenes/VideoPml';
import {TOTAL} from './lib';

export const RemotionRoot: React.FC = () => (
	<>
		<Composition id="VideoPml" component={VideoPml} durationInFrames={TOTAL} fps={30} width={1920} height={1080} defaultProps={{muted: false}} />
	</>
);
