import React from 'react';
import {Layer} from '../camera/Camera';
import {INK, PALETTE} from '../rig/outfits';
import {CAPS, HAND} from '../ui/Fonts';
import {Calendar, Frame, Lamp, LightDisc, OUTLINE as O, Patterned, Plant, Sign, Window, WallClock, shade} from './prims';
import {FLOOR} from './Sets';
import {rng} from '../lib';

// Generic game box (no real artwork): dark box with "GTA VI" lettering and neon stripe
export const GameBox: React.FC<{x: number; y: number; s?: number; rot?: number; glow?: number}> = ({x, y, s = 1, rot = 0, glow = 0}) => (
	<g transform={`translate(${x},${y}) scale(${s}) rotate(${rot})`}>
		{glow > 0 && <circle r={190} fill={PALETTE.accent} opacity={0.25 * glow} />}
		<rect x={-90} y={-120} width={180} height={240} rx={8} fill="#1C1C24" {...O} />
		<rect x={-90} y={-120} width={180} height={40} fill="#E04A8A" stroke={INK} strokeWidth={3} />
		<path d="M -90 40 L 90 -10 L 90 30 L -90 80 Z" fill="#F2A13A" opacity={0.9} />
		<text x={0} y={-12} textAnchor="middle" fontFamily={CAPS} fontSize={52} fill="#F4F1EA">
			GTA VI
		</text>
	</g>
);

export const TVConsole: React.FC<{x: number; y: number; s?: number; on?: number; screen?: React.ReactNode}> = ({x, y, s = 1, on = 1, screen}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		{on > 0 && <LightDisc cx={0} cy={-200} r={520} color="#9FD3F0" o={0.35 * on} />}
		<rect x={-300} y={-380} width={600} height={340} rx={12} fill="#111" {...O} strokeWidth={8} />
		<rect x={-280} y={-362} width={560} height={304} fill={on > 0 ? '#2A6A9A' : '#0A0A10'} />
		{on > 0 && screen}
		<rect x={-30} y={-40} width={60} height={30} fill="#222" {...O} />
		<rect x={-240} y={-12} width={480} height={30} fill="#5A3A22" {...O} />
		<rect x={140} y={-60} width={70} height={50} rx={6} fill="#F4F1EA" {...O} strokeWidth={3} />
	</g>
);

// ---------------- Living room at night (console launch) ----------------
export const LivingBack: React.FC<{f: number; screen?: React.ReactNode}> = ({f, screen}) => (
	<>
		<Layer p={0.75}>
			<Patterned x={-800} y={-400} w={3500} h={FLOOR + 400} fill="#2A3048" pattern="dots" cell={70} />
			<Window x={1380} y={140} w={340} h={280} night view="city" bands={false} />
			<Calendar x={360} y={160} top="NOV" big="19" w={130} c={PALETTE.red} />
			<WallClock x={600} y={220} t={f + 10800} />
			<Frame x={1180} y={200} w={140} h={110} art="mountain" c="#5A6A7A" />
			<TVConsole x={880} y={FLOOR - 40} on={1} screen={screen} />
			<Plant x={1820} y={FLOOR} sway={Math.sin(f / 30) * 2} />
		</Layer>
		<Layer p={0.85}>
			<Patterned x={-800} y={FLOOR} w={3500} h={700} fill="#3A2E3E" pattern="planks" cell={80} />
			<ellipse cx={880} cy={FLOOR + 80} rx={600} ry={70} fill="#9FD3F0" opacity={0.12} />
		</Layer>
	</>
);

// ---------------- Cinema (box office) ----------------
export const CinemaBack: React.FC<{f: number; marquee?: string}> = ({f, marquee = 'PRIMO WEEKEND'}) => (
	<>
		<Layer p={0.7}>
			<rect x={-800} y={-400} width={3500} height={1200} fill="#2A1218" />
			<Patterned x={-800} y={-400} w={3500} h={FLOOR + 400} fill="#4A1A22" pattern="stripes" cell={110} />
			<rect x={400} y={60} width={1120} height={200} rx={14} fill="#1A0A0E" stroke="#F2C744" strokeWidth={10} />
			{Array.from({length: 22}).map((_, i) => (
				<circle key={i} cx={430 + i * 50} cy={80} r={8} fill="#F2C744" opacity={(i + Math.floor(f / 4)) % 3 ? 1 : 0.3} />
			))}
			<text x={960} y={200} textAnchor="middle" fontFamily={CAPS} fontSize={74} fill="#F2C744">
				{marquee}
			</text>
			<rect x={700} y={330} width={520} height={360} fill="#6E2A2A" {...O} />
			<rect x={760} y={380} width={400} height={180} fill="#CFE3EA" opacity={0.5} stroke={INK} strokeWidth={3} />
			<Sign x={960} y={620} text="BIGLIETTERIA" w={320} bg="#F2C744" fg={INK} size={32} />
		</Layer>
		<Layer p={0.85}>
			<Patterned x={-800} y={FLOOR} w={3500} h={700} fill="#5A1A22" pattern="checker" cell={110} />
		</Layer>
	</>
);

// ---------------- Dundee studio, 1995 (rainy) ----------------
export const StudioBack: React.FC<{f: number}> = ({f}) => {
	const r = rng(8);
	const drops = Array.from({length: 30}).map(() => [r() * 300, r() * 260, 14 + r() * 8]);
	return (
		<>
			<Layer p={0.75}>
				<Patterned x={-800} y={-400} w={3500} h={FLOOR + 400} fill="#7A7468" pattern="brick" cell={100} />
				<rect x={1400} y={150} width={320} height={280} fill="#4A5A6E" {...O} />
				<svg x={1400} y={150} width={320} height={280} viewBox="0 0 320 280" overflow="hidden">
					{drops.map(([x, y, s], i) => (
						<path key={i} d={`M ${x} ${(y + f * s) % 300 - 20} l -3 14`} stroke="#B8C8D8" strokeWidth={3} />
					))}
				</svg>
				<rect x={1400} y={150} width={320} height={280} fill="none" stroke="#E6DFCF" strokeWidth={12} />
				<Sign x={760} y={110} text="DMA DESIGN" w={340} bg="#2C3E50" size={36} />
				<Calendar x={360} y={150} top="1995" big="APR" w={140} c="#4A6B6E" />
				{/* desks with beige CRTs */}
				{[500, 980].map((x) => (
					<g key={x}>
						<rect x={x - 200} y={480} width={400} height={26} fill="#8A6A44" {...O} />
						<path d={`M ${x - 80} 480 L ${x - 64} 360 L ${x + 64} 360 L ${x + 80} 480 Z`} fill="#D8D0B8" {...O} />
						<rect x={x - 56} y={372} width={112} height={84} rx={10} fill="#1A3A2A" stroke={INK} strokeWidth={3} />
						<rect x={x - 40} y={398} width={18} height={10} fill={PALETTE.accent} />
						<rect x={x + 10} y={420} width={14} height={8} fill="#F2C744" />
					</g>
				))}
			</Layer>
			<Layer p={0.85}>
				<Patterned x={-800} y={FLOOR} w={3500} h={700} fill="#5A544A" pattern="tiles" cell={100} />
			</Layer>
		</>
	);
};

// ---------------- Top-down city (1997 style), cars as colored rectangles ----------------
export const TopDown: React.FC<{f: number; cop?: boolean}> = ({f, cop = true}) => {
	const blocks: [number, number, number, number, string][] = [];
	for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) blocks.push([-200 + i * 400, -100 + j * 340, 300, 240, ['#8A6A54', '#6E7A6A', '#7A6A8A', '#9A8A6A'][(i + j) % 4]]);
	const carX = ((f * 9) % 2400) - 300;
	return (
		<g>
			<rect x={-400} y={-400} width={2800} height={1900} fill="#4A4A4A" />
			{blocks.map(([x, y, w, h, c], i) => (
				<g key={i}>
					<rect x={x} y={y} width={w} height={h} fill={c} {...O} />
					<rect x={x + 20} y={y + 20} width={w - 40} height={h - 40} fill={shade(c, 1.12)} stroke={INK} strokeWidth={2} />
				</g>
			))}
			{Array.from({length: 12}).map((_, i) => (
				<rect key={i} x={-300 + i * 220} y={555} width={100} height={10} fill="#F2C744" />
			))}
			<rect x={carX} y={520} width={110} height={56} rx={8} fill={PALETTE.red} {...O} />
			{cop && (
				<g>
					<rect x={carX - 260} y={520} width={110} height={56} rx={8} fill="#F4F1EA" {...O} />
					<rect x={carX - 230} y={532} width={20} height={14} fill={(f % 8) < 4 ? '#3A6AE0' : PALETTE.red} />
				</g>
			)}
		</g>
	);
};

// ---------------- Hotel room 2022 (TV, phone, fire stick) ----------------
export const Hotel22Back: React.FC<{f: number}> = ({f}) => (
	<>
		<Layer p={0.75}>
			<Patterned x={-800} y={-400} w={3500} h={FLOOR + 400} fill="#5A5A6E" pattern="stripes" cell={100} />
			<Window x={200} y={160} w={320} h={260} night view="city" bands={false} />
			<rect x={1200} y={500} width={600} height={190} fill="#E8E1D3" {...O} />
			<rect x={1180} y={430} width={40} height={260} fill="#3A2A20" {...O} />
			<rect x={1220} y={480} width={160} height={50} rx={14} fill="#F4F1EA" {...O} strokeWidth={3} />
			<Lamp x={1000} y={300} />
			<Sign x={760} y={90} text="HOTEL" w={220} bg="#2C3E50" size={36} />
		</Layer>
		<Layer p={0.85}>
			<Patterned x={-800} y={FLOOR} w={3500} h={700} fill="#4A3A4A" pattern="checker" cell={100} />
		</Layer>
	</>
);

// ---------------- Sunny neon beach city (generic, not a recreation) ----------------
export const BeachBack: React.FC<{f: number}> = ({f}) => (
	<>
		<Layer p={0.55}>
			<rect x={-800} y={-400} width={3500} height={1200} fill="#F0B789" />
			<rect x={-800} y={-400} width={3500} height={500} fill="#E04A8A" opacity={0.45} />
			<rect x={-800} y={-400} width={3500} height={250} fill="#48296A" opacity={0.55} />
			<circle cx={1400} cy={300} r={120} fill="#FFE2A8" />
			{[0, 1, 2, 3, 4, 5, 6].map((i) => (
				<g key={i}>
					<rect x={-300 + i * 360} y={200 - (i % 3) * 60} width={180} height={500 + (i % 3) * 60} fill="#F4D8C8" {...O} />
					{[0, 1, 2, 3, 4].map((k) => (
						<rect key={k} x={-280 + i * 360} y={240 - (i % 3) * 60 + k * 80} width={140} height={20} fill={(k + i) % 2 ? '#5ACFD0' : '#E04A8A'} opacity={0.8} />
					))}
				</g>
			))}
		</Layer>
		<Layer p={0.8}>
			<rect x={-800} y={560} width={3500} height={140} fill="#5ACFD0" />
			{[-300, 300, 1500, 2100].map((x, i) => (
				<g key={x} transform={`rotate(${Math.sin(f / 25 + i) * 2},${x},690)`}>
					<path d={`M ${x} 690 Q ${x + 20} 500 ${x + 10} 320`} stroke="#6E4726" strokeWidth={22} fill="none" />
					{[-1, -0.4, 0.4, 1].map((k) => (
						<path key={k} d={`M ${x + 10} 320 q ${k * 120} -40 ${k * 200} 40`} stroke="#3E8A4A" strokeWidth={26} fill="none" strokeLinecap="round" />
					))}
				</g>
			))}
		</Layer>
		<Layer p={0.85}>
			<Patterned x={-800} y={FLOOR} w={3500} h={700} fill="#E8D8A8" pattern="dots" cell={90} />
		</Layer>
	</>
);

// ---------------- Game store at midnight ----------------
export const StoreBack: React.FC<{f: number}> = ({f}) => (
	<>
		<Layer p={0.7}>
			<rect x={-800} y={-400} width={3500} height={1200} fill="#13192B" />
			<rect x={300} y={100} width={1320} height={590} fill="#2C3E50" {...O} />
			<rect x={360} y={260} width={1200} height={430} fill="#FFF3C4" opacity={0.85} {...O} />
			{Array.from({length: 8}).map((_, i) => (
				<GameBox key={i} x={460 + i * 145} y={430} s={0.55} />
			))}
			<g transform="translate(960,170)">
				<rect x={-300} y={-50} width={600} height={100} rx={12} fill="#E04A8A" {...O} />
				<text x={0} y={22} textAnchor="middle" fontFamily={CAPS} fontSize={54} fill="#fff" opacity={0.8 + 0.2 * Math.sin(f / 3)}>
					VIDEOGIOCHI
				</text>
			</g>
			<Sign x={1500} y={330} text="00:00" w={180} bg={PALETTE.red} size={40} />
		</Layer>
		<Layer p={0.85}>
			<Patterned x={-800} y={FLOOR} w={3500} h={700} fill="#3A3A44" pattern="tiles" cell={110} />
		</Layer>
	</>
);

// ---------------- Union protest outside a studio ----------------
export const ProtestBack: React.FC<{f: number}> = ({f}) => (
	<>
		<Layer p={0.7}>
			<rect x={-800} y={-400} width={3500} height={1200} fill="#B8C8D0" />
			<rect x={200} y={80} width={1520} height={610} fill="#8A8F98" {...O} />
			{Array.from({length: 18}).map((_, i) => (
				<rect key={i} x={240 + (i % 9) * 165} y={120 + Math.floor(i / 9) * 180} width={120} height={130} fill="#CFE3EA" stroke={INK} strokeWidth={3} />
			))}
			<Sign x={960} y={60} text="STUDIO" w={240} bg="#2C3E50" size={34} />
			<Sign x={960} y={520} text="UFFICI" w={200} bg="#2C3E50" size={28} />
		</Layer>
		<Layer p={0.85}>
			<Patterned x={-800} y={FLOOR} w={3500} h={700} fill="#7A7A7A" pattern="brick" cell={90} />
		</Layer>
	</>
);

// ---------------- Trading floor / stock screen ----------------
export const StocksBack: React.FC<{f: number; up?: boolean}> = ({f, up = true}) => {
	const pts = Array.from({length: 16}).map((_, i) => `${520 + i * 56},${520 - (up ? i * 16 : -i * 10) + Math.sin(i * 1.7) * 26}`);
	return (
		<>
			<Layer p={0.75}>
				<Patterned x={-800} y={-400} w={3500} h={FLOOR + 400} fill="#1E2A38" pattern="panels" cell={90} />
				<rect x={460} y={140} width={1000} height={480} rx={10} fill="#0E1420" {...O} strokeWidth={8} />
				<polyline points={pts.slice(0, Math.max(2, Math.floor((f / 40) * 16))).join(' ')} fill="none" stroke={up ? PALETTE.accent : PALETTE.red} strokeWidth={8} />
				<text x={500} y={200} fontFamily={CAPS} fontSize={44} fill="#E8E2C4">
					TAKE-TWO
				</text>
				<text x={1400} y={200} textAnchor="end" fontFamily={CAPS} fontSize={44} fill={up ? PALETTE.accent : PALETTE.red}>
					{up ? '▲' : '▼'}
				</text>
			</Layer>
			<Layer p={0.85}>
				<Patterned x={-800} y={FLOOR} w={3500} h={700} fill="#2A3238" pattern="checker" cell={110} />
			</Layer>
		</>
	);
};

export {FLOOR};
