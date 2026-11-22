import React from 'react';
import {Composition} from 'remotion';
import {CharacterSheet} from './scenes/CharacterSheet';
import {Video} from './scenes/Video';
import {TOTAL} from './lib';

export const RemotionRoot: React.FC = () => (
	<>
		<Composition id="CharacterSheet" component={CharacterSheet} durationInFrames={1} fps={30} width={2400} height={1800} />
		<Composition id="Video" component={Video} durationInFrames={TOTAL} fps={30} width={1920} height={1080} defaultProps={{muted: false}} />
	</>
);
