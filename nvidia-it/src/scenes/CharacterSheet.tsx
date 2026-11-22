import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Character, Expression, Pose, View} from '../rig/Character';
import {COOK_A, COOK_B, DANA, EXTRAS, INK, JENSEN, Outfit, PALETTE, RAY} from '../rig/outfits';
import {HeroJacket} from '../props/Jacket';
import {CAPS, Fonts, HAND} from '../ui/Fonts';

const W = 2400;
const H = 1800;

const Label: React.FC<{x: number; y: number; children: React.ReactNode; size?: number; anchor?: 'start' | 'middle'; color?: string}> = ({x, y, children, size = 30, anchor = 'middle', color = INK}) => (
	<text x={x} y={y} textAnchor={anchor} fontFamily={HAND} fontWeight={700} fontSize={size} fill={color}>
		{children}
	</text>
);

const Panel: React.FC<{x: number; y: number; w: number; h: number; title: string}> = ({x, y, w, h, title}) => (
	<g>
		<rect x={x} y={y} width={w} height={h} rx={18} fill="#EAE4D6" stroke={INK} strokeWidth={3} />
		<path d={`M ${x + 20} ${y + 56} L ${x + w - 20} ${y + 56}`} stroke={INK} strokeWidth={1.5} opacity={0.25} />
		<text x={x + 24} y={y + 42} fontFamily={CAPS} fontSize={28} fill={INK}>
			{title}
		</text>
	</g>
);

const HeadCrop: React.FC<{o: Outfit; expression: Expression; x: number; y: number; size: number; marks?: any[]}> = ({o, expression, x, y, size, marks = []}) => (
	<svg x={x} y={y} width={size} height={size} viewBox="-115 -440 230 230" overflow="hidden">
		<Character outfit={o} expression={expression} shadow={0} marks={marks} />
	</svg>
);

const Turnaround: React.FC<{o: Outfit; x: number; y: number; big: number; small: number; gap: number}> = ({o, x, y, big, small, gap}) => {
	const views: View[] = ['3q', 'side', 'back'];
	return (
		<g>
			<Character outfit={o} x={x} y={y} scale={big} expression="neutral" />
			{views.map((v, i) => (
				<Character key={v} outfit={o} view={v} x={x + gap * 0.9 + i * gap} y={y} scale={small} shadow={0.2} />
			))}
			<Label x={x} y={y + 40} size={28}>
				front
			</Label>
			{views.map((v, i) => (
				<Label key={v} x={x + gap * 0.9 + i * gap} y={y + 40} size={24}>
					{v === '3q' ? '3/4' : v}
				</Label>
			))}
		</g>
	);
};

const Swatch: React.FC<{x: number; y: number; c: string; name: string}> = ({x, y, c, name}) => (
	<g>
		<rect x={x} y={y} width={62} height={62} rx={8} fill={c} stroke={INK} strokeWidth={3} />
		<Label x={x + 31} y={y + 88} size={20}>
			{name}
		</Label>
		<Label x={x + 31} y={y + 110} size={17} color="#555">
			{c}
		</Label>
	</g>
);

const Chip: React.FC = () => (
	<g>
		<rect x={-30} y={-26} width={60} height={46} rx={4} fill="#2B2F36" stroke={INK} strokeWidth={3} />
		<rect x={-16} y={-14} width={32} height={22} fill={PALETTE.accent} stroke={INK} strokeWidth={2} />
		{[-22, -11, 0, 11, 22].map((px) => (
			<path key={px} d={`M ${px} 20 L ${px} 28 M ${px} -26 L ${px} -34`} stroke="#C9C9C9" strokeWidth={3} />
		))}
	</g>
);

export const CharacterSheet: React.FC = () => {
	const exprs: Expression[] = ['neutral', 'happy', 'surprised', 'concerned', 'deadpan', 'panic', 'thinking', 'angry', 'sad'];
	const poses: Pose[] = ['talking', 'pointing', 'holding', 'shrugging', 'cheering', 'walking'];
	return (
		<AbsoluteFill style={{backgroundColor: PALETTE.paper}}>
			<Fonts />
			<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
				{/* paper grid */}
				{Array.from({length: 40}).map((_, i) => (
					<path key={i} d={`M ${i * 64} 0 L ${i * 64} ${H}`} stroke="#000" opacity={0.035} />
				))}
				<text x={48} y={78} fontFamily={CAPS} fontSize={50} fill={INK}>
					CAST SHEET
				</text>
				<text x={380} y={78} fontFamily={HAND} fontWeight={700} fontSize={40} fill="#444">
					Why Nvidia Would Fail Without Jensen Huang - 1 min
				</text>

				{/* ---------- Protagonist ---------- */}
				<Panel x={30} y={110} w={1180} h={640} title="JENSEN HUANG - signature: black leather jacket" />
				<Turnaround o={JENSEN} x={190} y={650} big={1.12} small={0.8} gap={250} />
				{/* name plate */}
				<g transform="translate(920,180)">
					<rect width={240} height={40} rx={4} fill="#2C3E50" stroke={INK} strokeWidth={2.5} />
					<rect width={10} height={40} fill={PALETTE.accent} />
					<text x={24} y={29} fontFamily={CAPS} fontSize={22} fill="#F4F1EA">
						JENSEN HUANG
					</text>
				</g>

				{/* expressions */}
				<Panel x={30} y={770} w={1180} h={330} title="EXPRESSIONS" />
				{exprs.map((e, i) => (
					<g key={e}>
						<HeadCrop o={JENSEN} expression={e} x={52 + i * 128} y={840} size={126} marks={e === 'panic' ? ['sweat'] : e === 'angry' ? ['anger'] : e === 'happy' ? ['sparkles'] : []} />
						<Label x={115 + i * 128} y={1000} size={24}>
							{e}
						</Label>
					</g>
				))}
				<Label x={60} y={1060} size={24} anchor="start" color="#444">
					talking mouths:
				</Label>
				{(['closed', 'smallO', 'tallO', 'wide', 'smile'] as const).map((m, i) => (
					<svg key={m} x={250 + i * 90} y={1020} width={80} height={70} viewBox="-60 -330 120 105">
						<Character outfit={JENSEN} mouth={m} shadow={0} />
					</svg>
				))}
				<Label x={760} y={1060} size={24} anchor="start" color="#444">
					blink every ~3.2 s
				</Label>
				<svg x={960} y={1020} width={80} height={70} viewBox="-60 -360 120 105">
					<Character outfit={JENSEN} blink shadow={0} />
				</svg>

				{/* poses */}
				<Panel x={30} y={1120} w={1180} h={440} title="POSES" />
				<Panel x={30} y={1580} w={1180} h={190} title="PALETTE" />
				{poses.map((p, i) => (
					<g key={p}>
						<Character outfit={JENSEN} pose={p} x={140 + i * 190} y={1500} scale={0.72} view={p === 'walking' ? 'side' : 'front'} walkPhase={0.9} expression={p === 'cheering' ? 'happy' : p === 'shrugging' ? 'concerned' : 'neutral'} mouth={p === 'talking' ? 'wide' : undefined} held={<Chip />} />
						<Label x={140 + i * 190} y={1540} size={26}>
							{p}
						</Label>
					</g>
				))}

				{/* ---------- Supporting cast ---------- */}
				<Panel x={1230} y={110} w={1140} h={640} title="SKIT 1 - Dana (finance) + Ray (engineer), generic staff" />
				<Turnaround o={DANA} x={1330} y={440} big={0.62} small={0.42} gap={120} />
				<Turnaround o={RAY} x={1880} y={440} big={0.62} small={0.42} gap={120} />
				{/* skit facing check: Dana faces right, Ray faces left */}
				<Character outfit={DANA} view="3q" x={1500} y={715} scale={0.48} expression="deadpan" pose="talking" mouth="closed" />
				<Character outfit={RAY} view="3q" mirror x={1660} y={715} scale={0.48} expression="concerned" marks={['sweat']} />
				<Character outfit={RAY} view="back" x={2000} y={715} scale={0.48} pose="talking" />
				<Character outfit={DANA} view="3q" mirror x={2190} y={715} scale={0.54} expression="deadpan" mouth="smallO" />
				<Label x={2100} y={740} size={24} color="#444">
					over-the-shoulder
				</Label>
				<Label x={1590} y={740} size={24} color="#444">
					skit staging: facing each other
				</Label>

				<Panel x={1230} y={770} w={1140} h={500} title="SKIT 2 - kitchen line cooks" />
				<Turnaround o={COOK_A} x={1330} y={1215} big={0.62} small={0.42} gap={120} />
				<Turnaround o={COOK_B} x={1880} y={1215} big={0.62} small={0.42} gap={120} />

				{/* extras */}
				<Panel x={1230} y={1290} w={600} h={480} title="EXTRAS" />
				{EXTRAS.map((o, i) => (
					<g key={o.name}>
						<Character outfit={o} x={1290 + i * 92} y={1660} scale={0.5} view={i % 2 ? '3q' : 'front'} />
						<text x={1290 + i * 92} y={1700 + (i % 2) * 26} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={19} fill={INK}>
							{o.name}
						</text>
					</g>
				))}

				{/* hero object */}
				<Panel x={1850} y={1290} w={520} h={480} title="HERO OBJECT" />
				<rect x={1870} y={1360} width={480} height={330} fill="#1A1E2A" />
				<HeroJacket x={2110} y={1660} scale={0.62} label="1993-2026" />
				<Label x={2110} y={1740} size={24}>
					the empty jacket - glow #8FD23F
				</Label>

				{/* palette */}
				{[
					[PALETTE.accent, 'accent'],
					[PALETTE.accentBody, 'accent body'],
					[PALETTE.red, 'red'],
					[PALETTE.teal, 'teal'],
					[PALETTE.wood, 'wood'],
					[PALETTE.slate, 'slate'],
					[PALETTE.night, 'night'],
					[PALETTE.sepia, 'sepia'],
				].map(([c, n], i) => (
					<Swatch key={n} x={330 + i * 108} y={1600} c={c} name={n} />
				))}
			</svg>
		</AbsoluteFill>
	);
};
