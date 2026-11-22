import React from 'react';
import {Layer} from '../camera/Camera';
import {INK, PALETTE} from '../rig/outfits';
import {CAPS, HAND} from '../ui/Fonts';
import {Calendar, Desk, Frame, Lamp, LightDisc, OUTLINE as O, Patterned, Plant, Sign, Window, WallClock, shade} from './prims';
import {rng} from '../lib';

export const FLOOR = 690;

// ---------------- Keynote stage (dark scene) ----------------
export const StageBack: React.FC<{f: number; screen?: React.ReactNode; empty?: boolean}> = ({f, screen}) => (
	<>
		<Layer p={0.7}>
			<Patterned x={-600} y={-300} w={3200} h={FLOOR + 300} fill="#141826" pattern="panels" cell={90} />
			{/* giant screen */}
			<rect x={420} y={70} width={1080} height={480} rx={10} fill="#0A0C14" {...O} strokeWidth={9} />
			<g>{screen}</g>
			{/* truss lights */}
			<rect x={-200} y={-10} width={2320} height={30} fill="#2A2F3A" {...O} />
			{[200, 520, 1400, 1720].map((x, i) => (
				<g key={x}>
					<path d={`M ${x - 18} 20 L ${x + 18} 20 L ${x + 26} 60 L ${x - 26} 60 Z`} fill="#3A3F4A" {...O} strokeWidth={3} />
					<path d={`M ${x - 24} 60 L ${x + 24} 60 L ${960 + (x - 960) * 0.25 + 170} ${FLOOR} L ${960 + (x - 960) * 0.25 - 170} ${FLOOR} Z`} fill="#FFF3D0" opacity={0.06 + 0.02 * Math.sin(f / 20 + i)} />
				</g>
			))}
			{/* speaker stacks */}
			{[60, 1740].map((x) => (
				<g key={x}>
					<rect x={x} y={300} width={120} height={390} fill="#1E222C" {...O} />
					{[0, 1, 2].map((k) => (
						<circle key={k} cx={x + 60} cy={370 + k * 110} r={36} fill="#111" stroke="#555" strokeWidth={4} />
					))}
				</g>
			))}
		</Layer>
		<Layer p={0.9}>
			{/* stage floor */}
			<Patterned x={-600} y={FLOOR} w={3200} h={600} fill="#1E1A1C" pattern="planks" cell={70} />
			<ellipse cx={960} cy={FLOOR + 90} rx={560} ry={90} fill="#FFE9B0" opacity={0.16} />
			<rect x={-600} y={FLOOR} width={3200} height={10} fill={PALETTE.accent} opacity={0.6} />
		</Layer>
	</>
);

// ---------------- Finance office (daylight corporate) ----------------
export const OfficeBack: React.FC<{f: number; board?: React.ReactNode; night?: boolean}> = ({f, board, night}) => (
	<>
		<Layer p={0.75}>
			<Patterned x={-700} y={-300} w={3300} h={FLOOR + 300} fill={night ? '#26304A' : '#C9C3AE'} pattern="panels" cell={85} />
			<Window x={90} y={170} w={340} h={300} night={night} />
			<WallClock x={600} y={200} t={f} />
			<Calendar x={1530} y={150} top="NOV" big="17" w={130} />
			<Frame x={1680} y={170} w={150} h={120} art="chart" c="#E6DFCF" />
			{/* scoreboard / wall screen */}
			<rect x={700} y={290} width={560} height={300} rx={8} fill="#121620" {...O} strokeWidth={9} />
			<g>{board}</g>
			<Sign x={980} y={262} text="Q3 RESULTS" w={260} size={30} />
			{/* shelf with binders */}
			<rect x={1380} y={430} width={420} height={18} fill="#6E4726" {...O} />
			{['#C33631', '#4A6B6E', '#2C3E50', '#C9A94A', '#4A6B6E', '#6E4726'].map((c, i) => (
				<rect key={i} x={1400 + i * 46} y={340} width={38} height={90} fill={c} {...O} strokeWidth={3} />
			))}
			<LightDisc cx={980} cy={440} r={420} color={PALETTE.accent} o={0.12} />
		</Layer>
		<Layer p={0.85}>
			<Patterned x={-700} y={FLOOR} w={3300} h={600} fill={night ? '#2A2F3E' : '#8E8676'} pattern="tiles" cell={110} />
			<ellipse cx={980} cy={FLOOR + 80} rx={520} ry={60} fill="#FFF6D8" opacity={0.12} />
		</Layer>
	</>
);

export const OfficeFront: React.FC<{f: number}> = ({f}) => (
	<Layer p={1.6} blur={6}>
		<Plant x={1830} y={1130} s={1.6} sway={Math.sin(f / 30) * 2} />
		<Desk x={40} y={900} w={520} />
	</Layer>
);

// ---------------- 1996 office (sepia flashback) ----------------
export const Office96Back: React.FC<{f: number; calendar?: React.ReactNode}> = ({f, calendar}) => (
	<>
		<Layer p={0.75}>
			<Patterned x={-700} y={-300} w={3300} h={FLOOR + 300} fill="#B9A580" pattern="dots" cell={70} />
			<Window x={1260} y={150} w={300} h={280} view="trees" sky="#E8D8B0" />
			<g>{calendar ?? <Calendar x={420} y={160} top="1996" big="30" w={150} />}</g>
			<Frame x={700} y={180} w={170} h={130} art="mountain" c="#D8C8A0" />
			{/* filing cabinet */}
			<g>
				<rect x={1640} y={380} width={170} height={310} fill="#8A8F84" {...O} />
				{[0, 1, 2].map((k) => (
					<g key={k}>
						<rect x={1655} y={395 + k * 98} width={140} height={86} fill="#9CA196" {...O} strokeWidth={3} />
						<rect x={1705} y={425 + k * 98} width={40} height={10} rx={3} fill="#C9A94A" stroke={INK} strokeWidth={2} />
					</g>
				))}
			</g>
			<Sign x={980} y={110} text="NVIDIA" w={240} bg="#3A3324" fg="#E8D8B0" size={38} />
		</Layer>
		<Layer p={0.85}>
			<Patterned x={-700} y={FLOOR} w={3300} h={600} fill="#7A6447" pattern="planks" cell={70} />
			<ellipse cx={900} cy={FLOOR + 60} rx={420} ry={50} fill="#FFE9B0" opacity={0.2} />
		</Layer>
	</>
);

// CRT desk prop (1996)
export const CrtDesk: React.FC<{x: number; y: number; glow?: number}> = ({x, y, glow = 0}) => (
	<g>
		<Desk x={x} y={y} w={460} c="#7A5A3A" />
		<g transform={`translate(${x + 40},${y})`}>
			<path d="M -110 0 L -90 -170 L 90 -170 L 110 0 Z" fill="#D8D0B8" {...O} />
			<rect x={-80} y={-155} width={160} height={120} rx={14} fill={glow > 0 ? PALETTE.accent : '#2E3A32'} opacity={1} {...O} strokeWidth={3.5} />
			{glow > 0 && <circle cx={0} cy={-95} r={140} fill={PALETTE.accent} opacity={0.25 * glow} />}
			<rect x={-50} y={-6} width={100} height={8} fill="#BFB79F" stroke={INK} strokeWidth={2} />
		</g>
		{/* rotary phone */}
		<g transform={`translate(${x - 160},${y})`}>
			<path d="M -40 0 L -30 -36 L 30 -36 L 40 0 Z" fill={PALETTE.red} {...O} strokeWidth={3} />
			<circle cx={0} cy={-18} r={13} fill="#F4F1EA" stroke={INK} strokeWidth={2} />
			<path d="M -42 -40 Q 0 -66 42 -40" stroke={INK} strokeWidth={12} fill="none" strokeLinecap="round" />
		</g>
	</g>
);

// ---------------- Kitchen ----------------
export const KitchenBack: React.FC<{f: number; menu?: React.ReactNode}> = ({f, menu}) => (
	<>
		<Layer p={0.75}>
			<Patterned x={-700} y={-300} w={3300} h={FLOOR + 300} fill="#DCE3DE" pattern="tiles" cell={60} />
			{/* menu board */}
			<rect x={700} y={90} width={520} height={300} rx={8} fill="#1F2A24" stroke="#6E4726" strokeWidth={18} />
			<rect x={700} y={90} width={520} height={300} rx={8} fill="none" {...O} />
			<text x={960} y={150} textAnchor="middle" fontFamily={CAPS} fontSize={40} fill="#F4F1EA">
				MENU
			</text>
			<g>{menu}</g>
			{/* hanging pans */}
			<rect x={120} y={120} width={480} height={12} fill="#555" {...O} strokeWidth={3} />
			{[170, 290, 410, 530].map((x, i) => (
				<g key={x} transform={`rotate(${Math.sin(f / 25 + i) * 2},${x},130)`}>
					<path d={`M ${x} 130 L ${x} 170`} stroke={INK} strokeWidth={3} />
					<circle cx={x} cy={210} r={40 - i * 3} fill="#3A3A3A" {...O} />
					<circle cx={x} cy={210} r={26 - i * 3} fill="#4A4A4A" />
				</g>
			))}
			<WallClock x={1380} y={160} t={f} />
			<Sign x={1600} y={240} text="ORDER UP" w={240} bg={PALETTE.red} size={32} />
			{/* stove line */}
			<rect x={-700} y={480} width={3300} height={210} fill="#9DA4A6" {...O} />
			{Array.from({length: 14}).map((_, i) => (
				<g key={i}>
					<rect x={-640 + i * 240} y={520} width={200} height={140} rx={8} fill="#7E8587" {...O} strokeWidth={3} />
					<circle cx={-600 + i * 240} cy={540} r={10} fill="#222" />
					<circle cx={-520 + i * 240} cy={540} r={10} fill="#222" />
				</g>
			))}
			<rect x={-700} y={466} width={3300} height={20} fill="#C7CDCF" {...O} strokeWidth={3} />
		</Layer>
		<Layer p={0.85}>
			<Patterned x={-700} y={FLOOR} w={3300} h={600} fill="#B6BDB3" pattern="checker" cell={90} />
		</Layer>
	</>
);

// Cartoon steam puffs drifting up (in-world, behind cast).
export const Steam: React.FC<{f: number; xs: number[]; y: number}> = ({f, xs, y}) => (
	<g>
		{xs.map((x, i) =>
			[0, 1, 2].map((k) => {
				const t = ((f + i * 23 + k * 30) % 90) / 90;
				return <circle key={`${i}-${k}`} cx={x + Math.sin(t * 6 + i) * 14} cy={y - t * 220} r={14 + t * 26} fill="#FFFFFF" opacity={0.35 * (1 - t) * Math.min(1, t * 4)} />;
			})
		)}
	</g>
);

// ---------------- Boardroom (dark wood, night) ----------------
export const BoardroomBack: React.FC<{f: number}> = ({f}) => (
	<>
		<Layer p={0.75}>
			<Patterned x={-700} y={-300} w={3300} h={FLOOR + 300} fill="#3B2A20" pattern="wood" cell={90} />
			<Window x={760} y={120} w={400} h={320} night bands={false} />
			<Frame x={300} y={170} w={150} h={190} art="portrait" c="#5A4A38" />
			<Frame x={1470} y={170} w={150} h={190} art="portrait" c="#5A4A38" />
			<Lamp x={560} y={330} />
			<Lamp x={1360} y={330} />
			<Sign x={960} y={500} text="BOARD OF DIRECTORS" w={420} bg="#C9A94A" fg={INK} size={28} />
		</Layer>
		<Layer p={0.85}>
			<Patterned x={-700} y={FLOOR} w={3300} h={600} fill="#5A1E1E" pattern="checker" cell={120} />
		</Layer>
	</>
);

// ---------------- Museum hall (dark) ----------------
export const MuseumBack: React.FC<{f: number}> = ({f}) => {
	const r = rng(7);
	const dust = Array.from({length: 24}).map(() => [r() * 400 - 200, r() * 600, r() * 40 + 20, r()]);
	return (
		<>
			<Layer p={0.7}>
				<Patterned x={-700} y={-300} w={3300} h={FLOOR + 300} fill="#1B1D26" pattern="stone" cell={100} />
				{[340, 1580].map((x) => (
					<g key={x}>
						<Frame x={x - 90} y={220} w={180} h={220} art="mountain" c="#2C3E50" />
						<LightDisc cx={x} cy={330} r={200} o={0.2} />
						<Sign x={x} y={500} text={x < 960 ? 'GPU, 1999' : 'CHIP, 2026'} w={200} bg="#C9A94A" fg={INK} size={26} />
					</g>
				))}
				<Sign x={960} y={60} text="HALL OF NVIDIA" w={420} bg="#0E1016" fg="#E8D8B0" size={36} />
			</Layer>
			<Layer p={0.85}>
				<Patterned x={-700} y={FLOOR} w={3300} h={600} fill="#2A2420" pattern="checker" cell={120} />
				{/* spotlight cone + floor pool */}
				<path d="M 900 -100 L 1020 -100 L 1240 760 L 680 760 Z" fill="#FFF3D0" opacity={0.08} />
				<ellipse cx={960} cy={FLOOR + 60} rx={300} ry={50} fill="#FFF3D0" opacity={0.18} />
				{dust.map(([dx, dy, sp, ph], i) => {
					const yy = (dy + f * (sp / 30)) % 700;
					return <circle key={i} cx={960 + dx * (0.6 + yy / 900)} cy={yy} r={2.5} fill="#FFF3D0" opacity={0.35 + 0.3 * Math.sin(f / 10 + ph * 6)} />;
				})}
			</Layer>
		</>
	);
};

export {shade, HAND};
