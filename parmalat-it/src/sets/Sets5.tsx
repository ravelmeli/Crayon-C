import React from 'react';
import {Layer} from '../camera/Camera';
import {INK, PALETTE} from '../rig/outfits';
import {CAPS, HAND} from '../ui/Fonts';
import {Calendar, Frame, Lamp, LightDisc, OUTLINE as O, Patterned, Plant, Sign, Window, WallClock, shade} from './prims';
import {FLOOR} from './Sets';

export const Carton: React.FC<{x: number; y: number; s?: number; rot?: number}> = ({x, y, s = 1, rot = 0}) => (
	<g transform={`translate(${x},${y}) scale(${s}) rotate(${rot})`}>
		<path d="M -40 -60 L 0 -90 L 40 -60 Z" fill="#E8E8F0" {...O} strokeWidth={3} />
		<rect x={-40} y={-60} width={80} height={120} fill="#F4F4FA" {...O} strokeWidth={3} />
		<rect x={-40} y={-30} width={80} height={34} fill="#2C5AA8" />
		<text x={0} y={-6} textAnchor="middle" fontFamily={CAPS} fontSize={15} fill="#fff">
			PARMALAT
		</text>
		<path d="M -40 20 Q 0 6 40 20" stroke="#2C5AA8" strokeWidth={4} fill="none" />
	</g>
);

export const Fax: React.FC<{x: number; y: number; s?: number; paper?: number}> = ({x, y, s = 1, paper = 0}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		<rect x={-120} y={-70} width={240} height={90} rx={10} fill="#D8D4C8" {...O} />
		<rect x={-90} y={-60} width={110} height={30} fill="#3A4A3A" stroke={INK} strokeWidth={2} />
		{[0, 1, 2].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={40 + c * 22} y={-58 + r * 18} width={16} height={12} rx={3} fill="#F4F1EA" stroke={INK} strokeWidth={1.5} />))}
		<rect x={-80} y={-70 - 120 * paper} width={160} height={120 * paper} fill="#FBFAF5" stroke={INK} strokeWidth={2} />
		{paper > 0.5 && [0, 1, 2].map((k) => <path key={k} d={`M -60 ${-60 - 120 * paper + 20 + k * 20} L 60 ${-60 - 120 * paper + 20 + k * 20}`} stroke="#555" strokeWidth={4} />)}
	</g>
);

// ---------------- Dairy plant ----------------
export const DairyBack: React.FC<{f: number}> = ({f}) => {
	const off = (f * 4) % 140;
	return (
		<>
			<Layer p={0.75}>
				<Patterned x={-800} y={-400} w={3500} h={FLOOR + 400} fill="#D8E0E4" pattern="tiles" cell={80} />
				{[200, 520].map((x) => (
					<g key={x}>
						<rect x={x} y={120} width={240} height={420} rx={110} fill="#C8D0D4" {...O} />
						<rect x={x + 60} y={180} width={30} height={300} fill="#E8EEF0" opacity={0.6} />
					</g>
				))}
				{[300, 620].map((x) => (
					<path key={x} d={`M ${x} 540 L ${x} 600 L 1900 600`} stroke="#8A9298" strokeWidth={18} fill="none" />
				))}
				<Sign x={1300} y={120} text="PARMALAT · COLLECCHIO" w={560} bg="#2C5AA8" size={34} />
				<WallClock x={1700} y={250} t={f} />
			</Layer>
			<Layer p={0.85}>
				<Patterned x={-800} y={FLOOR} w={3500} h={700} fill="#A8B0B4" pattern="checker" cell={110} />
				{/* conveyor */}
				<rect x={-800} y={FLOOR - 40} width={3500} height={40} fill="#555" {...O} />
				{Array.from({length: 30}).map((_, i) => (
					<Carton key={i} x={-700 + i * 140 + off} y={FLOOR - 100} s={0.8} />
				))}
			</Layer>
		</>
	);
};

// ---------------- Family deli, 1960 ----------------
export const DeliBack: React.FC<{f: number}> = ({f}) => (
	<>
		<Layer p={0.75}>
			<Patterned x={-800} y={-400} w={3500} h={FLOOR + 400} fill="#E8D8B8" pattern="tiles" cell={70} />
			<rect x={-800} y={60} width={3500} height={16} fill="#6E4726" {...O} />
			{Array.from({length: 12}).map((_, i) => (
				<g key={i} transform={`translate(${-400 + i * 260},76) rotate(${Math.sin(f / 30 + i) * 3})`}>
					<path d="M 0 0 L 0 40" stroke={INK} strokeWidth={3} />
					<path d="M -40 40 Q -60 160 0 220 Q 60 160 40 40 Z" fill="#B85A3A" {...O} />
					<path d="M -20 70 Q 0 90 20 70" stroke="#F4D8C8" strokeWidth={6} fill="none" />
				</g>
			))}
			<Sign x={960} y={340} text="SALUMI E CONSERVE" w={460} bg="#7A2E3A" size={32} />
			<Calendar x={1700} y={280} top="1960" big="IT" w={120} c="#2E7D32" />
			<rect x={-800} y={480} width={3500} height={210} fill="#8A6A44" {...O} />
			<rect x={-800} y={470} width={3500} height={20} fill="#F4F1EA" {...O} strokeWidth={3} />
		</Layer>
		<Layer p={0.85}>
			<Patterned x={-800} y={FLOOR} w={3500} h={700} fill="#B8A88A" pattern="checker" cell={90} />
		</Layer>
	</>
);

// ---------------- Race track (F1 sponsorship) ----------------
export const TrackBack: React.FC<{f: number}> = ({f}) => {
	const carX = ((f * 26) % 3200) - 800;
	return (
		<>
			<Layer p={0.6}>
				<rect x={-800} y={-400} width={3500} height={1100} fill="#BFD8E8" />
				{/* grandstand */}
				<rect x={-800} y={200} width={3500} height={260} fill="#8A8F98" {...O} />
				{Array.from({length: 60}).map((_, i) => (
					<circle key={i} cx={-760 + i * 60} cy={260 + (i % 3) * 60} r={18} fill={['#C33631', '#2C5AA8', '#F2C744', '#3E8A4A'][i % 4]} stroke={INK} strokeWidth={2} />
				))}
				{Array.from({length: 6}).map((_, i) => (
					<g key={i}>
						<rect x={-600 + i * 600} y={440} width={420} height={70} fill="#2C5AA8" {...O} />
						<text x={-390 + i * 600} y={490} textAnchor="middle" fontFamily={CAPS} fontSize={40} fill="#fff">
							PARMALAT
						</text>
					</g>
				))}
			</Layer>
			<Layer p={0.85}>
				<rect x={-800} y={510} width={3500} height={800} fill="#4A4A4A" />
				{Array.from({length: 40}).map((_, i) => (
					<rect key={i} x={-800 + i * 90} y={510} width={45} height={20} fill={i % 2 ? '#C33631' : '#F4F1EA'} />
				))}
				<g transform={`translate(${carX},${FLOOR + 40})`}>
					<path d="M -180 0 L -150 -50 L 40 -60 L 120 -40 L 190 -20 L 190 10 L -180 10 Z" fill="#2C5AA8" {...O} />
					<rect x={-40} y={-90} width={60} height={34} rx={10} fill="#F4F1EA" {...O} strokeWidth={3} />
					<rect x={-200} y={-60} width={40} height={40} fill="#2C5AA8" {...O} strokeWidth={3} />
					<text x={10} y={-12} textAnchor="middle" fontFamily={CAPS} fontSize={26} fill="#fff">
						PARMALAT
					</text>
					{[-120, 130].map((wx) => (
						<circle key={wx} cx={wx} cy={10} r={36} fill="#111" {...O} />
					))}
				</g>
			</Layer>
		</>
	);
};

// ---------------- Football stadium ----------------
export const StadiumBack: React.FC<{f: number}> = ({f}) => (
	<>
		<Layer p={0.6}>
			<rect x={-800} y={-400} width={3500} height={1100} fill="#1A2751" />
			{[200, 1700].map((x) => (
				<g key={x}>
					<rect x={x - 6} y={-100} width={12} height={400} fill="#888" />
					<rect x={x - 80} y={-140} width={160} height={60} fill="#F4F1EA" {...O} />
					<LightDisc cx={x} cy={-60} r={300} o={0.5} />
				</g>
			))}
			<rect x={-800} y={150} width={3500} height={330} fill="#3A3A44" {...O} />
			{Array.from({length: 80}).map((_, i) => (
				<circle key={i} cx={-780 + i * 45} cy={200 + (i % 4) * 70} r={14} fill={i % 2 ? '#F2C744' : '#2C5AA8'} opacity={0.9} />
			))}
			<rect x={-800} y={440} width={3500} height={60} fill="#2C5AA8" {...O} />
			<text x={960} y={485} textAnchor="middle" fontFamily={CAPS} fontSize={44} fill="#fff">
				PARMALAT · PARMALAT · PARMALAT
			</text>
		</Layer>
		<Layer p={0.85}>
			<Patterned x={-800} y={500} w={3500} h={800} fill="#3E8A4A" pattern="stripes" cell={160} />
			<path d="M -800 700 L 2700 700" stroke="#F4F1EA" strokeWidth={8} />
		</Layer>
	</>
);

// ---------------- Bank NY (marble) with fax ----------------
export const BankBack: React.FC<{f: number; paper?: number}> = ({f, paper = 0}) => (
	<>
		<Layer p={0.75}>
			<Patterned x={-800} y={-400} w={3500} h={FLOOR + 400} fill="#D8D0C0" pattern="stone" cell={120} />
			{[200, 600, 1320, 1720].map((x) => (
				<g key={x}>
					<rect x={x - 40} y={60} width={80} height={630} fill="#E8E2D4" {...O} />
					<rect x={x - 56} y={50} width={112} height={26} fill="#C9C3AE" {...O} strokeWidth={3} />
				</g>
			))}
			<Sign x={960} y={100} text="BANK · NEW YORK" w={420} bg="#2C3E50" size={34} />
			<Window x={760} y={180} w={400} h={260} view="city" />
			<rect x={700} y={500} width={520} height={26} fill="#6E4726" {...O} />
			<Fax x={960} y={500} s={1} paper={paper} />
		</Layer>
		<Layer p={0.85}>
			<Patterned x={-800} y={FLOOR} w={3500} h={700} fill="#8A8278" pattern="checker" cell={120} />
		</Layer>
	</>
);

// ---------------- Italian bank branch (sportello) ----------------
export const BranchBack: React.FC<{f: number}> = ({f}) => (
	<>
		<Layer p={0.75}>
			<Patterned x={-800} y={-400} w={3500} h={FLOOR + 400} fill="#C9C3AE" pattern="panels" cell={90} />
			<Sign x={960} y={90} text="BANCA · SPORTELLO" w={440} bg="#2E5A3A" size={34} />
			<rect x={300} y={380} width={1320} height={310} fill="#8A6A44" {...O} />
			{[460, 960, 1460].map((x) => (
				<g key={x}>
					<rect x={x - 150} y={160} width={300} height={220} fill="#CFE3EA" opacity={0.5} stroke={INK} strokeWidth={4} />
					<Sign x={x} y={420} text={x === 960 ? 'OBBLIGAZIONI' : 'CASSA'} w={240} bg="#2C3E50" size={24} />
				</g>
			))}
			<WallClock x={1760} y={220} t={f} />
			<Plant x={160} y={690} sway={Math.sin(f / 30) * 2} />
		</Layer>
		<Layer p={0.85}>
			<Patterned x={-800} y={FLOOR} w={3500} h={700} fill="#9C8E78" pattern="tiles" cell={110} />
		</Layer>
	</>
);

// ---------------- Attic with hidden paintings ----------------
export const AtticBack: React.FC<{f: number; found?: number}> = ({f, found = 1}) => (
	<>
		<Layer p={0.75}>
			<Patterned x={-800} y={-400} w={3500} h={FLOOR + 400} fill="#6E5A44" pattern="planks" cell={80} />
			<path d="M -800 -400 L 960 -100 L 2700 -400 Z" fill="#4A3A2A" {...O} />
			<path d="M 960 -100 L -800 300 M 960 -100 L 2700 300" stroke="#3A2A1A" strokeWidth={30} />
			{found > 0 &&
				[
					[300, 380, 0],
					[620, 420, 1],
					[1250, 400, 2],
					[1560, 430, 3],
				].map(([x, y, k], i) => (
					<g key={i} transform={`rotate(${(i % 2 ? 1 : -1) * 6},${x},${y})`}>
						<rect x={x - 120} y={y - 150} width={240} height={300} fill="#B8922E" {...O} />
						<rect x={x - 104} y={y - 134} width={208} height={268} fill={['#2C4A7A', '#C9A04A', '#6E7A4A', '#8A3A2A'][k]} stroke={INK} strokeWidth={3} />
						{k === 0 && [0, 1, 2, 3, 4].map((j) => <circle key={j} cx={x - 60 + j * 30} cy={y - 60 + Math.sin(j) * 30} r={14} fill="#F2C744" />)}
						{k === 1 && <path d={`M ${x - 60} ${y + 80} L ${x - 20} ${y - 80} L ${x + 60} ${y + 80} Z`} fill="#3E8A4A" stroke={INK} strokeWidth={2} />}
						{k === 2 && <ellipse cx={x} cy={y - 30} rx={50} ry={80} fill="#E8C29E" stroke={INK} strokeWidth={2} />}
						{k === 3 && <rect x={x - 70} y={y - 70} width={140} height={140} fill="#E8D8B0" stroke={INK} strokeWidth={2} transform={`rotate(20,${x},${y})`} />}
					</g>
				))}
			<rect x={860} y={300} width={200} height={160} fill="#1A2751" {...O} />
			<LightDisc cx={960} cy={500} r={500} color="#F2C744" o={0.2} />
		</Layer>
		<Layer p={0.85}>
			<Patterned x={-800} y={FLOOR} w={3500} h={700} fill="#5A4A38" pattern="planks" cell={80} />
		</Layer>
	</>
);

// ---------------- Supermarket milk shelf ----------------
export const SuperBack: React.FC<{f: number}> = ({f}) => (
	<>
		<Layer p={0.75}>
			<Patterned x={-800} y={-400} w={3500} h={FLOOR + 400} fill="#E8EEF0" pattern="tiles" cell={100} />
			<Sign x={960} y={80} text="LATTE" w={260} bg="#2C5AA8" size={40} />
			{[180, 340, 500].map((y) => (
				<g key={y}>
					<rect x={-200} y={y + 70} width={2400} height={18} fill="#8A9298" {...O} strokeWidth={3} />
					{Array.from({length: 22}).map((_, i) => (
						<Carton key={i} x={-140 + i * 110} y={y} s={0.75} />
					))}
				</g>
			))}
		</Layer>
		<Layer p={0.85}>
			<Patterned x={-800} y={FLOOR} w={3500} h={700} fill="#C8D0D4" pattern="checker" cell={120} />
		</Layer>
	</>
);

// ---------------- Fridge (analogy) ----------------
export const FridgeInsert: React.FC<{f: number; open: number; painted: boolean}> = ({f, open, painted}) => (
	<g>
		<rect x={-400} y={-400} width={2800} height={1900} fill="#E8D8C0" />
		<Patterned x={-400} y={-400} w={2800} h={1900} fill="#E8D8C0" pattern="dots" cell={80} />
		{painted ? (
			<g>
				{/* fridge painted on the wall: flat, with a picture frame edge */}
				<rect x={700} y={140} width={520} height={800} fill="#F4F4FA" stroke={INK} strokeWidth={5} strokeDasharray="22 10" />
				{[0, 1, 2].map((k) => (
					<g key={k}>
						<rect x={740} y={220 + k * 220} width={440} height={12} fill="#AAB" />
						{[0, 1, 2, 3].map((j) => (
							<Carton key={j} x={790 + j * 110} y={170 + k * 220} s={0.6} />
						))}
					</g>
				))}
				<text x={960} y={990} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={52} fill="#7A2E3A">
					dipinto sul muro
				</text>
			</g>
		) : (
			<g>
				<rect x={700} y={140} width={520} height={800} rx={20} fill="#F4F4FA" {...O} strokeWidth={6} />
				<g transform={`translate(700,140) scale(${1 - open * 0.85},1)`}>
					<rect x={0} y={0} width={520} height={800} rx={20} fill="#E8E8F0" {...O} strokeWidth={6} />
					<rect x={440} y={340} width={24} height={140} rx={8} fill="#888" />
				</g>
				{open > 0.6 && <text x={960} y={560} textAnchor="middle" fontFamily={CAPS} fontSize={70} fill="#C33631">VUOTO</text>}
			</g>
		)}
	</g>
);

export {FLOOR};
