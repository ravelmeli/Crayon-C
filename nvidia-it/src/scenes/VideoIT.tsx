import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Fonts} from '../ui/Fonts';
import {BEATS_IT} from './BeatsIT';
import {TEMPLATES} from './Tpl';

const Host: React.FC<{i: number}> = ({i}) => {
	const f = useCurrentFrame();
	const b = BEATS_IT[i];
	const C = TEMPLATES[b.tpl];
	return <C f={f} len={b.to - b.at} abs={b.at + f} p={b.p ?? {}} />;
};

export const VideoIT: React.FC<{muted?: boolean}> = ({muted}) => (
	<AbsoluteFill style={{background: '#000'}}>
		<Fonts />
		{BEATS_IT.map((b, i) => (
			<Sequence key={b.id} from={b.at} durationInFrames={Math.max(1, b.to - b.at)}>
				<Host i={i} />
			</Sequence>
		))}
		{!muted && <Audio src={staticFile('vo_it.wav')} />}
	</AbsoluteFill>
);
