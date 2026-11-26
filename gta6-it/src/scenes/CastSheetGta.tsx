import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Character, View} from '../rig/Character';
import {COP, DAN, DANA, DEV95, EXEC, GAMER, INK, JASON, KURTAJ, LUCIA, MARCO, Outfit, PALETTE, RAY, SAM, UNIONIST} from '../rig/outfits';
import {GameBox, TVConsole} from '../sets/Sets4';
import {CAPS, Fonts, HAND} from '../ui/Fonts';

const CAST: [Outfit, string][] = [
	[SAM, 'Sam Houser - beard, black tee'],
	[DAN, 'Dan Houser - glasses, shirt'],
	[DEV95, 'DMA developer, 1995 (generic)'],
	[KURTAJ, 'Arion Kurtaj - grey hoodie'],
	[JASON, 'game couple: "Jason" (generic)'],
	[LUCIA, 'game couple: "Lucia" (generic)'],
	[COP, 'police officer (generic)'],
	[UNIONIST, 'union worker (generic)'],
	[EXEC, 'publisher exec (generic)'],
	[GAMER, 'gamer (generic)'],
	[MARCO, 'Marco (recurring)'],
	[DANA, 'Dana (recurring)'],
	[RAY, 'Ray (recurring)'],
];
export const CastSheetGta: React.FC = () => {
	const views: View[] = ['3q', 'side', 'back'];
	return (
		<AbsoluteFill style={{background: PALETTE.paper}}>
			<Fonts />
			<svg width={2400} height={1800} viewBox="0 0 2400 1800">
				<text x={40} y={66} fontFamily={CAPS} fontSize={46} fill={INK}>CAST SHEET</text>
				<text x={380} y={66} fontFamily={HAND} fontWeight={700} fontSize={38} fill="#444">Il videogioco che ha incassato 3,8 miliardi in un giorno - 10 min, IT</text>
				{CAST.map(([o, n], i) => {
					const col = i % 4;
					const row = Math.floor(i / 4);
					const x = 130 + col * 520;
					const y = 470 + row * 400;
					return (
						<g key={o.name}>
							<rect x={x - 110} y={y - 380} width={500} height={390} rx={14} fill="#EAE4D6" stroke={INK} strokeWidth={3} />
							<Character outfit={o} x={x} y={y - 40} scale={0.6} expression="happy" />
							{views.map((v, k) => (
								<Character key={v} outfit={o} view={v} x={x + 150 + k * 100} y={y - 40} scale={0.4} shadow={0.2} />
							))}
							<text x={x + 140} y={y - 6} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={24} fill={INK}>{n}</text>
						</g>
					);
				})}
				<g>
					<rect x={1650} y={1290} width={720} height={480} rx={14} fill="#1A1A22" stroke={INK} strokeWidth={3} />
					<GameBox x={1820} y={1520} s={1.2} glow={0.6} />
					<TVConsole x={2160} y={1700} s={0.6} />
					<text x={2010} y={1340} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={26} fill="#E8E2C4">hero objects: the box + the console (no real game art)</text>
				</g>
			</svg>
		</AbsoluteFill>
	);
};
