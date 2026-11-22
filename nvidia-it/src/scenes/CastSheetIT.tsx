import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Character, View} from '../rig/Character';
import {ALEX, CHRIS, CURTIS, GAMER, IGER, INK, JOBS, JONES, KRESS, MARCO, Outfit, PALETTE, SCIENTIST, WAITRESS} from '../rig/outfits';
import {CAPS, Fonts, HAND} from '../ui/Fonts';

const W = 2400, H = 1800;
const CAST: [Outfit, string][] = [
	[CHRIS, 'co-founder 1993 - curly hair, round glasses'],
	[CURTIS, 'co-founder 1993 - knit sweater, square glasses'],
	[WAITRESS, "Denny's waitress - apron (generic)"],
	[ALEX, 'researcher 2012 - grey sweater'],
	[GAMER, 'skit CUDA - headset (generic)'],
	[SCIENTIST, 'skit CUDA - lab coat (generic)'],
	[JOBS, 'Apple 1985/1997 - black turtleneck, round glasses'],
	[IGER, 'Disney 2022 - silver hair, grey suit'],
	[KRESS, 'interim CEO - burgundy blazer, long blond hair'],
	[JONES, 'board chair - green tie, square glasses'],
	[MARCO, 'Italian viewer (generic) - green zip jacket'],
];

const Cell: React.FC<{o: Outfit; note: string; x: number; y: number}> = ({o, note, x, y}) => {
	const views: View[] = ['3q', 'side', 'back'];
	return (
		<g>
			<rect x={x} y={y} width={770} height={400} rx={16} fill="#EAE4D6" stroke={INK} strokeWidth={3} />
			<g transform={`translate(${x + 20},${y + 14})`}>
				<rect width={330} height={40} rx={4} fill="#2C3E50" stroke={INK} strokeWidth={2.5} />
				<rect width={10} height={40} fill={PALETTE.accent} />
				<text x={22} y={29} fontFamily={CAPS} fontSize={22} fill="#F4F1EA">{o.name.toUpperCase()}</text>
			</g>
			<text x={x + 370} y={y + 42} fontFamily={HAND} fontWeight={700} fontSize={24} fill="#444">{note}</text>
			<Character outfit={o} x={x + 130} y={y + 370} scale={0.68} expression="neutral" pose={o === MARCO ? 'holding' : 'idle'} held={o === MARCO ? <g><rect x={-22} y={-36} width={44} height={70} rx={8} fill="#222" stroke={INK} strokeWidth={3} /><rect x={-16} y={-28} width={32} height={50} fill={PALETTE.accent} /></g> : undefined} />
			{views.map((v, i) => (
				<Character key={v} outfit={o} view={v} x={x + 300 + i * 125} y={y + 370} scale={0.5} shadow={0.2} />
			))}
			<Character outfit={o} view="front" x={x + 690} y={y + 370} scale={0.5} expression={o === KRESS || o === JONES ? 'deadpan' : o === JOBS ? 'thinking' : 'happy'} shadow={0.2} />
		</g>
	);
};

export const CastSheetIT: React.FC = () => (
	<AbsoluteFill style={{background: PALETTE.paper}}>
		<Fonts />
		<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
			<text x={40} y={70} fontFamily={CAPS} fontSize={48} fill={INK}>CAST SHEET 2</text>
			<text x={420} y={70} fontFamily={HAND} fontWeight={700} fontSize={38} fill="#444">Perché Nvidia fallirebbe senza Jensen Huang - 5 min, IT - new characters (main cast unchanged)</text>
			{CAST.map(([o, n], i) => (
				<Cell key={o.name} o={o} note={n} x={20 + (i % 3) * 790} y={100 + Math.floor(i / 3) * 420} />
			))}
			{/* Italian on-screen text samples */}
			<g transform="translate(1600,1360)">
				<rect width={770} height={400} rx={16} fill="#0A0C18" stroke={INK} strokeWidth={3} />
				<text x={385} y={60} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={26} fill="#AAA">on-screen text in Italian</text>
				<text x={385} y={140} textAnchor="middle" fontFamily={CAPS} fontSize={46} fill="#F4EBD4">PERCHÉ NVIDIA</text>
				<text x={385} y={196} textAnchor="middle" fontFamily={CAPS} fontSize={46} fill="#F4EBD4">FALLIREBBE SENZA</text>
				<text x={385} y={262} textAnchor="middle" fontFamily={CAPS} fontSize={60} fill={PALETTE.accent}>JENSEN HUANG</text>
				<text x={385} y={350} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={44} fill="#fff">Poi, in una settimana, sparisce.</text>
			</g>
		</svg>
	</AbsoluteFill>
);
