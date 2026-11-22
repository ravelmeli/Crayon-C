import React from 'react';
import {Composition} from 'remotion';
import {CharacterSheet} from './scenes/CharacterSheet';
import {CastSheetIT} from './scenes/CastSheetIT';
import {Video} from './scenes/Video';
import {VideoIT} from './scenes/VideoIT';
import {TOTAL} from './lib';

export const RemotionRoot: React.FC = () => (
	<>
		<Composition id="CharacterSheet" component={CharacterSheet} durationInFrames={1} fps={30} width={2400} height={1800} />
		<Composition id="CastSheetIT" component={CastSheetIT} durationInFrames={1} fps={30} width={2400} height={1800} />
		<Composition id="Video" component={Video} durationInFrames={TOTAL} fps={30} width={1920} height={1080} defaultProps={{muted: false}} />
		<Composition id="VideoIT" component={VideoIT} durationInFrames={TOTAL} fps={30} width={1920} height={1080} defaultProps={{muted: false}} />
	</>
);
