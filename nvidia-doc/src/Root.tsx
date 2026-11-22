import React from 'react';
import {Composition} from 'remotion';
import {CharacterSheet} from './scenes/CharacterSheet';

export const RemotionRoot: React.FC = () => (
	<>
		<Composition id="CharacterSheet" component={CharacterSheet} durationInFrames={1} fps={30} width={2400} height={1800} />
	</>
);
