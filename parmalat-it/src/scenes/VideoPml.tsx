import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Fonts} from '../ui/Fonts';
import {BEATS_PML} from './BeatsPml';
import {TEMPLATES2} from './Tpl2';

const Host: React.FC<{i: number}> = ({i}) => {
	const f = useCurrentFrame();
	const b = BEATS_PML[i];
	const C = TEMPLATES2[b.tpl];
	return <C f={f} len={b.to - b.at} abs={b.at + f} p={b.p ?? {}} />;
};

export const VideoPml: React.FC<{muted?: boolean}> = ({muted}) => (
	<AbsoluteFill style={{background: '#000'}}>
		<Fonts />
		{BEATS_PML.map((b, i) => (
			<Sequence key={b.id} from={b.at} durationInFrames={Math.max(1, b.to - b.at)}>
				<Host i={i} />
			</Sequence>
		))}
		{!muted && <Audio src={staticFile('vo.wav')} />}
	</AbsoluteFill>
);
