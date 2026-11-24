import React from 'react';
import {Composition} from 'remotion';
import {CastSheetGio} from './scenes/CastSheetGio';

export const RemotionRoot: React.FC = () => (
	<>
		<Composition id="CastSheetGio" component={CastSheetGio} durationInFrames={1} fps={30} width={2400} height={1800} />
	</>
);
