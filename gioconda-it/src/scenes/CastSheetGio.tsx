import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Character, Expression, Pose, View} from '../rig/Character';
import {APOLLINAIRE, BEROUD, FRANCIS, GERI, GUARD, INK, INSPECTOR, JUDGE, LEONARDO, Outfit, PALETTE, PERUGGIA, PERUGGIA_SMOCK, PICASSO, POGGI, THIEF, TOURIST, VALFIERNO} from '../rig/outfits';
import {FourHooks, Painting, Trunk} from '../props/Gioconda';
import {CAPS, Fonts, HAND} from '../ui/Fonts';

const W = 2400, H = 1800;
const Plate: React.FC<{x: number; y: number; t: string}> = ({x, y, t}) => (
	<g transform={`translate(${x},${y})`}>
		<rect width={t.length * 17 + 40} height={40} rx={4} fill="#2C3E50" stroke={INK} strokeWidth={2.5} />
		<rect width={10} height={40} fill={PALETTE.accent} />
		<text x={22} y={29} fontFamily={CAPS} fontSize={22} fill="#F4F1EA">{t}</text>
	</g>
);
const Box: React.FC<{x: number; y: number; w: number; h: number; t: string}> = ({x, y, w, h, t}) => (
	<g>
		<rect x={x} y={y} width={w} height={h} rx={16} fill="#EAE4D6" stroke={INK} strokeWidth={3} />
		<text x={x + 20} y={y + 40} fontFamily={CAPS} fontSize={26} fill={INK}>{t}</text>
	</g>
);

export const CastSheetGio: React.FC = () => {
	const views: View[] = ['3q', 'side', 'back'];
	const exprs: Expression[] = ['neutral', 'happy', 'surprised', 'concerned', 'deadpan', 'panic'];
	const poses: Pose[] = ['holding', 'walking', 'pointing', 'shrugging'];
	const cast: [Outfit, string][] = [
		[GUARD, 'Louvre guard - kepi'],
		[BEROUD, 'Louis Béroud - beret, beard'],
		[APOLLINAIRE, 'Apollinaire - bowler'],
		[PICASSO, 'Picasso - striped top'],
		[INSPECTOR, 'police - bowler, mustache'],
		[GERI, 'Alfredo Geri - round glasses'],
		[POGGI, 'Giovanni Poggi - beard'],
		[JUDGE, 'judge, Florence 1914'],
		[LEONARDO, 'Leonardo - red cap'],
		[FRANCIS, 'Francis I - crown'],
		[VALFIERNO, 'the legend (top hat)'],
		[THIEF, 'thief 2025 - hi-vis'],
		[TOURIST, 'tourist (generic)'],
	];
	return (
		<AbsoluteFill style={{background: PALETTE.paper}}>
			<Fonts />
			<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
				<text x={40} y={66} fontFamily={CAPS} fontSize={46} fill={INK}>CAST SHEET</text>
				<text x={380} y={66} fontFamily={HAND} fontWeight={700} fontSize={38} fill="#444">L'italiano che rubò la Gioconda dal Louvre - 10 min, IT</text>

				<Box x={20} y={90} w={1180} h={620} t="VINCENZO PERUGGIA - signature: mustache + white smock" />
				<Character outfit={PERUGGIA_SMOCK} x={170} y={640} scale={1.05} expression="neutral" />
				{views.map((v, i) => (
					<Character key={v} outfit={PERUGGIA_SMOCK} view={v} x={400 + i * 190} y={640} scale={0.75} />
				))}
				<Character outfit={PERUGGIA} x={1020} y={640} scale={0.75} expression="happy" />
				<text x={1020} y={690} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={24} fill="#444">street clothes</text>
				<Plate x={330} y={655} t="VINCENZO PERUGGIA" />

				<Box x={20} y={730} w={1180} h={330} t="EXPRESSIONS" />
				{exprs.map((e, i) => (
					<g key={e}>
						<svg x={40 + i * 190} y={790} width={170} height={170} viewBox="-115 -440 230 230">
							<Character outfit={PERUGGIA} expression={e} shadow={0} marks={e === 'panic' ? ['sweat'] : []} />
						</svg>
						<text x={125 + i * 190} y={1000} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={26} fill={INK}>{e}</text>
					</g>
				))}

				<Box x={20} y={1080} w={1180} h={700} t="POSES + HERO OBJECTS" />
				{poses.map((p, i) => (
					<Character key={p} outfit={PERUGGIA_SMOCK} pose={p} view={p === 'walking' ? 'side' : 'front'} walkPhase={0.8} x={120 + i * 170} y={1460} scale={0.7} held={<Painting s={0.55} frame={false} />} expression={p === 'shrugging' ? 'concerned' : 'neutral'} />
				))}
				<Painting x={880} y={1300} s={0.95} glass glow={0.6} />
				<text x={880} y={1475} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={24} fill="#444">la Gioconda (drawn, stylised) 77×53</text>
				<g>
					<rect x={760} y={1500} width={240} height={250} fill="#B8A88A" stroke={INK} strokeWidth={3} />
					<FourHooks x={880} y={1625} s={0.7} />
				</g>
				<Trunk x={330} y={1700} s={0.7} open={1} reveal={1} />
				<text x={330} y={1760} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={24} fill="#444">baule con doppio fondo</text>
				<text x={1080} y={1640} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={24} fill="#444">quattro chiodi</text>

				<Box x={1220} y={90} w={1160} h={1690} t="SUPPORTING CAST (real people = signature + name plate)" />
				{cast.map(([o, n], i) => {
					const col = i % 4;
					const row = Math.floor(i / 4);
					const x = 1300 + col * 275;
					const y = 480 + row * 400;
					return (
						<g key={o.name}>
							<Character outfit={o} x={x} y={y} scale={0.55} expression={o === VALFIERNO ? 'thinking' : o === THIEF ? 'deadpan' : 'neutral'} />
							<Character outfit={o} view="3q" x={x + 125} y={y} scale={0.4} shadow={0.2} />
							<text x={x + 60} y={y + 38} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={21} fill={INK}>{n}</text>
						</g>
					);
				})}
			</svg>
		</AbsoluteFill>
	);
};
