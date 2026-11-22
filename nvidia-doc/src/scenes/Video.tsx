import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Fonts} from '../ui/Fonts';
import {BEATS} from './Beats';

const BeatHost: React.FC<{i: number}> = ({i}) => {
	const f = useCurrentFrame();
	const b = BEATS[i];
	return <b.C f={f} len={b.to - b.from} abs={b.from + f} />;
};

export const Video: React.FC<{muted?: boolean}> = ({muted}) => (
	<AbsoluteFill style={{background: '#000'}}>
		<Fonts />
		{BEATS.map((b, i) => (
			<Sequence key={b.id} from={b.from} durationInFrames={b.to - b.from}>
				<BeatHost i={i} />
			</Sequence>
		))}
		{!muted && <Audio src={staticFile('vo_clean.wav')} />}
	</AbsoluteFill>
);
