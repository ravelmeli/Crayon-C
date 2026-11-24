import React from 'react';
import {Layer} from '../camera/Camera';
import {INK, PALETTE} from '../rig/outfits';
import {CAPS, HAND} from '../ui/Fonts';
import {Calendar, Frame, Lamp, LightDisc, OUTLINE as O, Patterned, Plant, Sign, Window, WallClock, shade} from './prims';
import {FLOOR} from './Sets';
import {rng} from '../lib';

// ---------------- Denny's diner, 1993 (warm period grade) ----------------
export const DennysBack: React.FC<{f: number}> = ({f}) => (
	<>
		<Layer p={0.75}>
			<Patterned x={-700} y={-300} w={3300} h={FLOOR + 300} fill="#C98F5A" pattern="planks" cell={70} />
			<rect x={-700} y={-300} width={3300} height={330} fill="#8A3A2A" />
			<Window x={180} y={150} w={420} h={300} view="trees" sky="#3A4A7A" night bands={false} />
			<Window x={1320} y={150} w={420} h={300} view="city" night bands={false} />
			{/* neon sign */}
			<g transform="translate(960,120)">
				<rect x={-200} y={-56} width={400} height={100} rx={20} fill="#F2C744" {...O} />
				<text x={0} y={18} textAnchor="middle" fontFamily={CAPS} fontSize={58} fill={PALETTE.red} opacity={0.85 + 0.15 * Math.sin(f / 3)}>
					DENNY'S
				</text>
			</g>
			<WallClock x={960} y={280} t={f} r={36} />
			<Frame x={760} y={230} w={110} h={90} art="mountain" c="#E8D8B0" />
			<Frame x={1050} y={230} w={110} h={90} art="mountain" c="#E8D8B0" />
			<Lamp x={560} y={330} />
			<Lamp x={1360} y={330} />
			{/* counter + stools */}
			<rect x={-700} y={520} width={3300} height={170} fill="#B85A3A" {...O} />
			<rect x={-700} y={500} width={3300} height={26} fill="#E6DFCF" {...O} strokeWidth={3} />
			{[-200, 40, 1880, 2120].map((x) => (
				<g key={x}>
					<ellipse cx={x} cy={600} rx={50} ry={14} fill={PALETTE.red} {...O} strokeWidth={3} />
				</g>
			))}
		</Layer>
		<Layer p={0.85}>
			<Patterned x={-700} y={FLOOR} w={3300} h={600} fill="#2C2C2C" pattern="checker" cell={90} />
			<ellipse cx={960} cy={FLOOR + 60} rx={500} ry={60} fill="#FFE9B0" opacity={0.18} />
		</Layer>
	</>
);

// Booth: table + red seats; cast stands/sits behind it at FEET.
export const Booth: React.FC<{x?: number; y: number; cups?: number; coffee?: number}> = ({x = 960, y, cups = 3, coffee = 1}) => (
	<g>
		<rect x={x - 330} y={y - 160} width={660} height={30} fill="#E8E2D4" {...O} />
		<path d={`M ${x} ${y - 130} L ${x} ${y}`} stroke={INK} strokeWidth={12} />
		<rect x={x - 380} y={y - 140} width={60} height={140} rx={12} fill={PALETTE.red} {...O} />
		<rect x={x + 320} y={y - 140} width={60} height={140} rx={12} fill={PALETTE.red} {...O} />
		{Array.from({length: cups}).map((_, i) => (
			<g key={i} transform={`translate(${x - 200 + i * 200},${y - 160})`}>
				<path d="M -26 -40 L 26 -40 L 20 0 L -20 0 Z" fill="#F4F1EA" {...O} strokeWidth={3} />
				<rect x={-22} y={-38} width={44} height={8} fill="#4A2A1A" opacity={coffee} />
				<path d="M 26 -30 Q 42 -20 24 -10" stroke={INK} strokeWidth={4} fill="none" />
			</g>
		))}
		{/* napkin with a chip sketch */}
		<g transform={`translate(${x + 110},${y - 172}) rotate(-6)`}>
			<rect x={-50} y={-10} width={100} height={20} fill="#FBFAF5" stroke={INK} strokeWidth={2} />
		</g>
	</g>
);

// ---------------- Stock exchange 1999 ----------------
export const ExchangeBack: React.FC<{f: number; price?: string}> = ({f, price = '$12'}) => {
	const r = rng(3);
	const tick = ['NVDA', 'AAPL', 'MSFT', 'INTC', 'IBM', 'CSCO'];
	const off = (f * 6) % 1200;
	return (
		<>
			<Layer p={0.75}>
				<Patterned x={-700} y={-300} w={3300} h={FLOOR + 300} fill="#3A4A5A" pattern="stone" cell={110} />
				<rect x={200} y={80} width={1520} height={340} rx={10} fill="#0E1420" {...O} strokeWidth={8} />
				<svg x={210} y={300} width={1500} height={110} viewBox="0 0 1500 110" overflow="hidden">
					{[0, 1].map((k) =>
						tick.map((t, i) => (
							<text key={`${k}${i}`} x={i * 200 + k * 1200 - off} y={70} fontFamily={CAPS} fontSize={44} fill={t === 'NVDA' ? PALETTE.accent : '#E8E2C4'}>
								{t} {t === 'NVDA' ? price : '▲'}
							</text>
						))
					)}
				</svg>
				<text x={960} y={200} textAnchor="middle" fontFamily={CAPS} fontSize={96} fill="#E8E2C4">
					BORSA
				</text>
				{[300, 1620].map((x) => (
					<g key={x}>
						<rect x={x - 40} y={440} width={80} height={250} fill="#C9C3AE" {...O} />
						<rect x={x - 56} y={430} width={112} height={24} fill="#E6DFCF" {...O} strokeWidth={3} />
					</g>
				))}
				{/* the bell */}
				<g transform="translate(960,480)">
					<path d="M -70 60 Q -70 -40 0 -50 Q 70 -40 70 60 Z" fill="#C9A94A" {...O} />
					<circle cx={0} cy={70} r={14} fill="#8C6F1E" {...O} strokeWidth={3} />
				</g>
			</Layer>
			<Layer p={0.85}>
				<Patterned x={-700} y={FLOOR} w={3300} h={600} fill="#5A4A3A" pattern="wood" cell={80} />
				{Array.from({length: 18}).map((_, i) => (
					<rect key={i} x={r() * 2400 - 200} y={FLOOR + 20 + r() * 300} width={22} height={14} fill="#F4F1EA" opacity={0.6} transform={`rotate(${r() * 90})`} />
				))}
			</Layer>
		</>
	);
};

// GPU card prop
export const GpuCard: React.FC<{x: number; y: number; s?: number; glow?: number; label?: string}> = ({x, y, s = 1, glow = 0, label}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		{glow > 0 && <circle r={170} fill={PALETTE.accent} opacity={0.25 * glow} />}
		<rect x={-150} y={-60} width={300} height={110} rx={10} fill="#2B2F36" {...O} />
		<circle cx={-70} cy={-5} r={36} fill="#1A1C20" stroke="#666" strokeWidth={4} />
		<circle cx={50} cy={-5} r={36} fill="#1A1C20" stroke="#666" strokeWidth={4} />
		<rect x={-150} y={50} width={220} height={14} fill="#C9A94A" stroke={INK} strokeWidth={2} />
		<rect x={-150} y={-60} width={300} height={10} fill={PALETTE.accent} opacity={0.6 + 0.4 * glow} />
		{label && (
			<text x={0} y={-70} textAnchor="middle" fontFamily={CAPS} fontSize={34} fill={INK}>
				{label}
			</text>
		)}
	</g>
);

// ---------------- CUDA lab (tech, dim) ----------------
export const LabBack: React.FC<{f: number}> = ({f}) => (
	<>
		<Layer p={0.75}>
			<Patterned x={-700} y={-300} w={3300} h={FLOOR + 300} fill="#1E2A30" pattern="tiles" cell={80} />
			{/* blackboard with formulas */}
			<rect x={560} y={100} width={800} height={340} rx={8} fill="#1F3A2E" stroke="#6E4726" strokeWidth={16} />
			<text x={600} y={190} fontFamily={HAND} fontWeight={700} fontSize={54} fill="#E8E8E0">
				y = Σ wᵢ · xᵢ
			</text>
			<text x={620} y={280} fontFamily={HAND} fontWeight={700} fontSize={48} fill="#E8E8E0">
				1 GPU = 1000 calcoli
			</text>
			<text x={980} y={380} fontFamily={HAND} fontWeight={700} fontSize={44} fill={PALETTE.accent}>
				CUDA
			</text>
			{/* server rack with blinking lights */}
			{[160, 1620].map((x, k) => (
				<g key={x}>
					<rect x={x} y={220} width={170} height={470} fill="#2B2F36" {...O} />
					{Array.from({length: 9}).map((_, i) => (
						<g key={i}>
							<rect x={x + 14} y={240 + i * 50} width={142} height={36} fill="#1A1C20" stroke="#444" strokeWidth={2} />
							<circle cx={x + 140} cy={258 + i * 50} r={5} fill={(f + i * 7 + k * 3) % 20 < 10 ? PALETTE.accent : '#2A4A1A'} />
						</g>
					))}
				</g>
			))}
			<LightDisc cx={960} cy={300} r={500} color="#9FD3F0" o={0.12} />
		</Layer>
		<Layer p={0.85}>
			<Patterned x={-700} y={FLOOR} w={3300} h={600} fill="#2A3238" pattern="checker" cell={100} />
		</Layer>
	</>
);

// ---------------- Gold mine (literal metaphor) ----------------
export const MineBack: React.FC<{f: number}> = ({f}) => (
	<>
		<Layer p={0.7}>
			<rect x={-700} y={-300} width={3300} height={1500} fill="#2A1D15" />
			<Patterned x={-700} y={-300} w={3300} h={FLOOR + 300} fill="#4A3426" pattern="stone" cell={120} />
			{/* timber frames */}
			{[300, 960, 1620].map((x) => (
				<g key={x}>
					<rect x={x - 220} y={80} width={40} height={610} fill="#6E4726" {...O} />
					<rect x={x + 180} y={80} width={40} height={610} fill="#6E4726" {...O} />
					<rect x={x - 240} y={60} width={480} height={40} fill="#7E5530" {...O} />
					<Lamp x={x} y={150} />
				</g>
			))}
			{/* gold veins */}
			{[
				[200, 300],
				[700, 420],
				[1300, 260],
				[1750, 480],
			].map(([x, y], i) => (
				<path key={i} d={`M ${x} ${y} l 40 -20 l 30 26 l 50 -10`} stroke="#F2C744" strokeWidth={10} fill="none" strokeLinecap="round" />
			))}
		</Layer>
		<Layer p={0.85}>
			<Patterned x={-700} y={FLOOR} w={3300} h={600} fill="#3A2A20" pattern="planks" cell={90} />
			{/* rails */}
			<path d={`M -700 ${FLOOR + 90} L 2600 ${FLOOR + 90} M -700 ${FLOOR + 140} L 2600 ${FLOOR + 140}`} stroke="#888" strokeWidth={10} />
			{Array.from({length: 30}).map((_, i) => (
				<rect key={i} x={-700 + i * 120} y={FLOOR + 80} width={30} height={70} fill="#5A3A22" />
			))}
		</Layer>
	</>
);

export const MineCart: React.FC<{x: number; y: number; glow?: number}> = ({x, y, glow = 1}) => (
	<g transform={`translate(${x},${y})`}>
		<circle cx={0} cy={-170} r={220} fill={PALETTE.accent} opacity={0.22 * glow} />
		{[-70, -10, 50].map((dx, i) => (
			<g key={i} transform={`translate(${dx},${-150 - (i % 2) * 20}) rotate(${(i - 1) * 12}) scale(0.4)`}>
				<rect x={-150} y={-60} width={300} height={110} rx={10} fill="#2B2F36" {...O} strokeWidth={8} />
				<rect x={-150} y={-60} width={300} height={14} fill={PALETTE.accent} />
			</g>
		))}
		{[-90, -40, 20, 80].map((dx, i) => (
			<circle key={i} cx={dx} cy={-112 - (i % 2) * 14} r={22} fill="#F2C744" {...O} strokeWidth={3} />
		))}
		<path d="M -140 -110 L 140 -110 L 110 -20 L -110 -20 Z" fill="#7A7F86" {...O} />
		<path d="M -120 -80 L 120 -80" stroke={INK} strokeWidth={3} opacity={0.5} />
		<circle cx={-70} cy={-10} r={26} fill="#3A3A3A" {...O} />
		<circle cx={70} cy={-10} r={26} fill="#3A3A3A" {...O} />
	</g>
);

// ---------------- Apple garage-office 1985/1997 ----------------
export const AppleBack: React.FC<{f: number; night?: boolean}> = ({f, night}) => (
	<>
		<Layer p={0.75}>
			<Patterned x={-700} y={-300} w={3300} h={FLOOR + 300} fill={night ? '#3A3448' : '#D8D0C0'} pattern="stripes" cell={110} />
			<Window x={180} y={160} w={360} h={280} view="trees" night={night} />
			<g transform="translate(960,150)">
				<rect x={-170} y={-50} width={340} height={100} rx={12} fill="#F4F1EA" {...O} />
				<text x={0} y={20} textAnchor="middle" fontFamily={CAPS} fontSize={60} fill={INK}>
					APPLE
				</text>
			</g>
			<Frame x={1400} y={170} w={170} h={140} art="chart" c="#E6DFCF" />
			{/* beige computer on desk */}
			<rect x={1300} y={470} width={420} height={26} fill="#C9A982" {...O} />
			<g transform="translate(1500,470)">
				<rect x={-80} y={-170} width={160} height={170} rx={10} fill="#E4DCC4" {...O} />
				<rect x={-60} y={-150} width={120} height={90} rx={6} fill="#2E3A32" stroke={INK} strokeWidth={3} />
			</g>
			<Plant x={680} y={690} s={1} sway={Math.sin(f / 30) * 2} />
			{/* door */}
			<rect x={1780} y={300} width={220} height={390} fill="#FFF6D8" {...O} />
		</Layer>
		<Layer p={0.85}>
			<Patterned x={-700} y={FLOOR} w={3300} h={600} fill={night ? '#3A3038' : '#9C8E78'} pattern="planks" cell={80} />
		</Layer>
	</>
);

// ---------------- Disney-style hall (2022) ----------------
export const CastleBack: React.FC<{f: number}> = ({f}) => (
	<>
		<Layer p={0.7}>
			<rect x={-700} y={-300} width={3300} height={1300} fill="#2A2A5A" />
			{/* stars */}
			{Array.from({length: 30}).map((_, i) => (
				<circle key={i} cx={(i * 137) % 2600 - 300} cy={(i * 71) % 300 - 100} r={3} fill="#FFF3C4" opacity={0.5 + 0.5 * Math.sin(f / 9 + i)} />
			))}
			{/* castle silhouette */}
			<g fill="#5A4A8A" stroke={INK} strokeWidth={4}>
				<rect x={660} y={240} width={600} height={450} />
				{[620, 840, 1040, 1220].map((x, i) => (
					<g key={x}>
						<rect x={x} y={140 + (i % 2) * 60} width={80} height={550} />
						<path d={`M ${x - 10} ${140 + (i % 2) * 60} L ${x + 40} ${40 + (i % 2) * 60} L ${x + 90} ${140 + (i % 2) * 60} Z`} fill={PALETTE.red} />
					</g>
				))}
			</g>
			<path d="M 900 690 L 900 560 Q 960 500 1020 560 L 1020 690 Z" fill="#FFE9B0" {...O} />
			<Sign x={960} y={460} text="DISNEY" w={260} bg="#F2C744" fg={INK} size={40} />
		</Layer>
		<Layer p={0.85}>
			<Patterned x={-700} y={FLOOR} w={3300} h={600} fill="#4A4A6A" pattern="stone" cell={110} />
			<path d="M 900 690 L 1020 690 L 1300 1100 L 620 1100 Z" fill="#FFE9B0" opacity={0.15} />
		</Layer>
	</>
);

// ---------------- Flat map: USA → Italy (light style) ----------------
export const MapUsItaly: React.FC<{f: number; routeT: number; pinT: number}> = ({f, routeT, pinT}) => {
	const us = 'M 140 330 L 300 250 L 520 240 L 640 280 L 700 340 L 690 420 L 600 470 L 520 520 L 420 500 L 300 480 L 200 440 Z';
	const eu = 'M 1180 260 L 1320 210 L 1480 220 L 1600 260 L 1640 340 L 1580 400 L 1460 430 L 1340 420 L 1240 380 L 1190 320 Z';
	const it = 'M 1400 340 L 1430 330 L 1450 360 L 1470 400 L 1510 430 L 1540 460 L 1530 475 L 1505 465 L 1490 480 L 1470 470 L 1480 445 L 1450 420 L 1425 385 L 1405 360 Z';
	const p0 = [520, 360];
	const p1 = [1470, 410];
	const N = 40;
	const pts = Array.from({length: N + 1}).map((_, i) => {
		const t = (i / N) * routeT;
		const x = p0[0] + (p1[0] - p0[0]) * t;
		const y = p0[1] + (p1[1] - p0[1]) * t - Math.sin(Math.PI * t) * 260;
		return `${x},${y}`;
	});
	return (
		<g>
			<rect x={-400} y={-300} width={2800} height={1700} fill="#BFD8E8" />
			{Array.from({length: 12}).map((_, i) => (
				<path key={i} d={`M ${-400 + i * 260} ${700 + Math.sin(f / 20 + i) * 6} q 40 -14 80 0`} stroke="#9CC0D8" strokeWidth={4} fill="none" />
			))}
			<path d={us} fill="#E8DCC0" {...O} />
			<path d={eu} fill="#E8DCC0" {...O} />
			<path d={it} fill="#2E8B57" {...O} strokeWidth={3.5} />
			<text x={420} y={390} textAnchor="middle" fontFamily={CAPS} fontSize={34} fill={INK}>
				USA
			</text>
			<text x={1300} y={300} textAnchor="middle" fontFamily={CAPS} fontSize={30} fill={INK}>
				EUROPA
			</text>
			<text x={1560} y={520} textAnchor="middle" fontFamily={CAPS} fontSize={32} fill={INK}>
				ITALIA
			</text>
			<polyline points={pts.join(' ')} fill="none" stroke="#fff" strokeWidth={8} strokeDasharray="18 12" strokeLinecap="round" />
			{pinT > 0 && (
				<g transform={`translate(${p1[0]},${p1[1] - (1 - pinT) * 200})`}>
					<path d="M 0 0 C -30 -40 -30 -70 0 -80 C 30 -70 30 -40 0 0 Z" fill={PALETTE.red} {...O} strokeWidth={3} />
					<circle cx={0} cy={-56} r={10} fill="#fff" />
				</g>
			)}
		</g>
	);
};

// ---------------- Map: China border with blocked crates (dark style) ----------------
export const MapChina: React.FC<{f: number; stopT: number}> = ({f, stopT}) => (
	<g>
		<rect x={-400} y={-300} width={2800} height={1700} fill="#14202E" />
		<path d="M 900 120 L 1500 100 L 1760 300 L 1700 640 L 1300 800 L 950 700 L 860 400 Z" fill="#3A2A2A" {...O} />
		<path d="M -200 200 L 600 160 L 700 500 L 500 900 L -200 900 Z" fill="#2A3A4A" {...O} />
		<text x={1300} y={420} textAnchor="middle" fontFamily={CAPS} fontSize={60} fill="#E8C0B0">
			CINA
		</text>
		<text x={250} y={420} textAnchor="middle" fontFamily={CAPS} fontSize={50} fill="#B0C8E0">
			NVIDIA
		</text>
		{/* glowing front line */}
		<path d="M 780 80 L 780 980" stroke={PALETTE.red} strokeWidth={10} strokeDasharray="30 18" opacity={0.7 + 0.3 * Math.sin(f / 5)} />
		{/* crates sliding toward border */}
		{[0, 1, 2].map((i) => {
			const x = Math.min(640, 260 + ((f * 6 + i * 140) % 520));
			return (
				<g key={i} transform={`translate(${x},${560 + i * 90})`}>
					<rect x={-60} y={-40} width={120} height={80} fill="#B8864A" {...O} />
					<text x={0} y={12} textAnchor="middle" fontFamily={CAPS} fontSize={28} fill={INK}>
						H200
					</text>
				</g>
			);
		})}
		{stopT > 0 && (
			<g transform={`translate(780,600) scale(${stopT < 1 ? 1.7 - 0.7 * stopT : 1}) rotate(-6)`}>
				<path d="M -80 -33 L -33 -80 L 33 -80 L 80 -33 L 80 33 L 33 80 L -33 80 L -80 33 Z" fill={PALETTE.red} stroke="#fff" strokeWidth={8} />
				<text x={0} y={16} textAnchor="middle" fontFamily={CAPS} fontSize={44} fill="#fff">
					STOP
				</text>
			</g>
		)}
	</g>
);

// ---------------- Road for the autopilot skit ----------------
export const RoadBack: React.FC<{f: number; curve?: number}> = ({f, curve = 0}) => {
	const off = (f * 22) % 400;
	return (
		<>
			<Layer p={0.6}>
				<rect x={-700} y={-300} width={3300} height={1000} fill="#F0B789" />
				<rect x={-700} y={-300} width={3300} height={500} fill="#DB747A" opacity={0.5} />
				<rect x={-700} y={-300} width={3300} height={250} fill="#48296A" opacity={0.6} />
				<circle cx={1500} cy={420} r={110} fill="#FFE2A8" opacity={0.9} />
				{[0, 1, 2, 3, 4, 5].map((i) => (
					<path key={i} d={`M ${-300 + i * 520 - (off * 0.3) % 520} 560 l 140 -180 l 160 140 l 120 -90 l 200 130 Z`} fill="#6E5A8A" opacity={0.8} />
				))}
			</Layer>
			<Layer p={0.85}>
				<rect x={-700} y={560} width={3300} height={700} fill="#5E8A4A" />
				<rect x={-700} y={640} width={3300} height={260} fill="#3A3A40" />
				{Array.from({length: 12}).map((_, i) => (
					<rect key={i} x={-700 + i * 400 - off} y={760} width={180} height={14} fill="#F2C744" />
				))}
				{curve > 0 && (
					<g transform={`translate(${2300 - curve * 700},600)`}>
						<rect x={-8} y={0} width={16} height={130} fill="#888" {...O} strokeWidth={3} />
						<path d="M -70 -60 L 0 -130 L 70 -60 L 0 10 Z" fill="#F2C744" {...O} />
						<path d="M -20 -30 Q -20 -80 20 -80" stroke={INK} strokeWidth={9} fill="none" />
						<path d="M 10 -92 L 30 -80 L 10 -66" fill={INK} />
					</g>
				)}
			</Layer>
		</>
	);
};

export const Car: React.FC<{x: number; y: number; f: number; children?: React.ReactNode}> = ({x, y, f, children}) => {
	const b = Math.sin(f / 3) * 2;
	return (
		<g transform={`translate(${x},${y + b})`}>
			<path d="M -420 -40 L -380 -170 Q -360 -220 -300 -230 L 200 -230 Q 270 -226 300 -170 L 380 -120 L 440 -100 L 440 -10 L -420 -10 Z" fill={PALETTE.teal} {...O} />
			{/* windows (cut-outs) */}
			<path d="M -365 -120 L -320 -205 L -60 -205 L -60 -120 Z" fill="#CFE3EA" {...O} strokeWidth={3} />
			<path d="M -30 -120 L -30 -205 L 190 -205 Q 250 -200 285 -120 Z" fill="#CFE3EA" {...O} strokeWidth={3} />
			<defs>
				<clipPath id="carwin">
					<path d="M -365 -120 L -320 -205 L -60 -205 L -60 -120 Z" />
				</clipPath>
			</defs>
			<g clipPath="url(#carwin)">{children}</g>
			<path d="M -420 -40 L 440 -40" stroke={INK} strokeWidth={3} />
			{[-260, 280].map((wx) => (
				<g key={wx} transform={`translate(${wx},-10) rotate(${f * 20})`}>
					<circle r={60} fill="#222" {...O} />
					<circle r={26} fill="#AAA" stroke={INK} strokeWidth={3} />
					<path d="M -26 0 L 26 0 M 0 -26 L 0 26" stroke={INK} strokeWidth={3} />
				</g>
			))}
			{/* empty steering wheel in the front window */}
			<g transform="translate(150,-160)">
				<circle r={26} fill="none" stroke={INK} strokeWidth={6} />
				<path d="M -26 0 L 26 0 M 0 0 L 0 26" stroke={INK} strokeWidth={4} />
			</g>
		</g>
	);
};

// ---------------- Mousetrap (literal metaphor: the trap) ----------------
export const Mousetrap: React.FC<{x: number; y: number; snapT: number; label?: string}> = ({x, y, snapT, label = '$130 MLD'}) => (
	<g transform={`translate(${x},${y})`}>
		<rect x={-300} y={-60} width={600} height={60} rx={8} fill="#C9A06A" {...O} />
		<path d="M -300 -40 L 300 -40" stroke={INK} strokeWidth={2} opacity={0.4} />
		<g transform={`rotate(${-170 + snapT * 170},-120,-60)`}>
			<rect x={-120} y={-64} width={380} height={8} fill="#9A9A9A" stroke={INK} strokeWidth={2} />
		</g>
		<g transform="translate(130,-64)">
			<circle r={70} fill="#F2C744" {...O} />
			<circle r={52} fill="none" stroke="#C9A12E" strokeWidth={5} />
			<text x={0} y={12} textAnchor="middle" fontFamily={CAPS} fontSize={30} fill={INK}>
				{label}
			</text>
		</g>
	</g>
);

// ---------------- Engine (gears turning by themselves) ----------------
export const Gear: React.FC<{x: number; y: number; r: number; a: number; c?: string}> = ({x, y, r, a, c = '#7A7F86'}) => {
	const teeth = Math.round(r / 10);
	return (
		<g transform={`translate(${x},${y}) rotate(${a})`}>
			{Array.from({length: teeth}).map((_, i) => (
				<rect key={i} x={-10} y={-r - 18} width={20} height={30} fill={c} {...O} strokeWidth={3} transform={`rotate(${(i / teeth) * 360})`} />
			))}
			<circle r={r} fill={c} {...O} />
			<circle r={r * 0.35} fill={shade(c, 0.7)} {...O} strokeWidth={3} />
		</g>
	);
};

export {FLOOR};
