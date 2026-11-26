import React from 'react';
import {Layer} from '../camera/Camera';
import {INK, PALETTE} from '../rig/outfits';
import {CAPS, HAND} from '../ui/Fonts';
import {Calendar, Frame, Lamp, LightDisc, OUTLINE as O, Patterned, Plant, Sign, Window, WallClock, shade} from './prims';
import {FLOOR} from './Sets';
import {FourHooks, Painting, Trunk} from '../props/Gioconda';
import {rng} from '../lib';

// Gilded frame with a simple painted subject (background paintings in galleries)
export const GalleryFrame: React.FC<{x: number; y: number; w: number; h: number; k?: number}> = ({x, y, w, h, k = 0}) => {
	const fills = ['#4A6B6E', '#7A5A3A', '#5A4A6E', '#6E7A4A', '#8A4A3A'];
	return (
		<g>
			<rect x={x - 12} y={y - 12} width={w + 24} height={h + 24} fill="#B8922E" {...O} />
			<rect x={x} y={y} width={w} height={h} fill={fills[k % 5]} stroke={INK} strokeWidth={2.5} />
			{k % 3 === 0 && <path d={`M ${x} ${y + h} L ${x + w * 0.35} ${y + h * 0.45} L ${x + w * 0.6} ${y + h * 0.7} L ${x + w} ${y + h * 0.35} L ${x + w} ${y + h} Z`} fill={shade(fills[k % 5], 0.7)} />}
			{k % 3 === 1 && <circle cx={x + w / 2} cy={y + h * 0.42} r={Math.min(w, h) * 0.18} fill="#D8B088" stroke={INK} strokeWidth={2} />}
			{k % 3 === 2 && <path d={`M ${x + 10} ${y + h * 0.7} Q ${x + w / 2} ${y + h * 0.3} ${x + w - 10} ${y + h * 0.7}`} stroke="#E8D8B0" strokeWidth={6} fill="none" />}
		</g>
	);
};

// ---------------- Salon Carré (Louvre, 1911) ----------------
// state: 'painting' | 'empty' | 'glass' (painting with protective glass)
export const SalonBack: React.FC<{f: number; state?: string; night?: boolean; crowd?: number; glow?: number}> = ({f, state = 'glass', night, crowd = 0, glow = 0}) => {
	const r = rng(21);
	return (
		<>
			<Layer p={0.75}>
				<Patterned x={-800} y={-400} w={3500} h={FLOOR + 400} fill={night ? '#3A2226' : '#7A2E2E'} pattern="dots" cell={60} />
				{/* skylight band */}
				<rect x={-800} y={-400} width={3500} height={180} fill={night ? '#1A1418' : '#E8D8B0'} />
				<rect x={-800} y={-220} width={3500} height={26} fill="#B8922E" {...O} />
				{/* light from skylight */}
				{!night && [0, 1, 2, 3].map((i) => <path key={i} d={`M ${-200 + i * 700} -194 l 140 0 l 220 700 l -140 0 Z`} fill="#FFF6D8" opacity={0.08} />)}
				<GalleryFrame x={-560} y={80} w={360} h={260} k={0} />
				<GalleryFrame x={-120} y={20} w={240} h={320} k={1} />
				<GalleryFrame x={1460} y={40} w={300} h={300} k={2} />
				<GalleryFrame x={1880} y={80} w={360} h={260} k={3} />
				<GalleryFrame x={300} y={360} w={180} h={140} k={4} />
				<GalleryFrame x={1460} y={400} w={200} h={150} k={0} />
				{/* the spot of the Gioconda */}
				{state === 'empty' ? <FourHooks x={960} y={300} s={1.05} glow={glow} /> : <Painting x={960} y={300} s={1.05} glass={state === 'glass'} frame />}
				<rect x={-800} y={FLOOR - 30} width={3500} height={30} fill="#5A1E1E" {...O} />
			</Layer>
			<Layer p={0.85}>
				<Patterned x={-800} y={FLOOR} w={3500} h={700} fill={night ? '#3A2A20' : '#8A5A34'} pattern="wood" cell={80} />
				{/* guard bench */}
				<rect x={1380} y={FLOOR + 40} width={300} height={40} fill="#5A3A22" {...O} />
				<rect x={1400} y={FLOOR + 80} width={20} height={60} fill="#3A2410" />
				<rect x={1640} y={FLOOR + 80} width={20} height={60} fill="#3A2410" />
				{crowd > 0 &&
					Array.from({length: Math.round(crowd * 14)}).map((_, i) => (
						<circle key={i} cx={200 + r() * 1500} cy={FLOOR + 170 + r() * 110} r={56 + r() * 16} fill={['#2C3E50', '#5A3A2A', '#3A3A44', '#6E4726'][i % 4]} stroke={INK} strokeWidth={3} />
					))}
			</Layer>
		</>
	);
};

// ---------------- Paris street, 1911 (Louvre facade, gas lamps) ----------------
export const ParisBack: React.FC<{f: number; night?: boolean}> = ({f, night}) => (
	<>
		<Layer p={0.6}>
			<rect x={-800} y={-400} width={3500} height={1200} fill={night ? '#1A2751' : '#C9D8E0'} />
			{[0, 1, 2].map((i) => (
				<ellipse key={i} cx={((i * 700 + f * 0.6) % 3000) - 600} cy={60 + i * 50} rx={160} ry={34} fill="#FFFFFF" opacity={night ? 0.08 : 0.6} />
			))}
		</Layer>
		<Layer p={0.7}>
			{/* Louvre facade */}
			<rect x={-700} y={120} width={3300} height={FLOOR - 120} fill="#D8CCB0" {...O} />
			<rect x={-700} y={100} width={3300} height={40} fill="#C9BC9C" {...O} />
			{Array.from({length: 26}).map((_, i) => (
				<g key={i}>
					<rect x={-660 + i * 128} y={180} width={60} height={110} rx={28} fill={night ? '#F2C744' : '#5A6A7A'} opacity={night ? 0.7 : 1} stroke={INK} strokeWidth={3} />
					<rect x={-660 + i * 128} y={360} width={60} height={110} fill={night ? '#F2C744' : '#5A6A7A'} opacity={night ? 0.5 : 1} stroke={INK} strokeWidth={3} />
					<rect x={-606 + i * 128} y={150} width={14} height={FLOOR - 150} fill="#C9BC9C" />
				</g>
			))}
			<Sign x={960} y={80} text="MUSÉE DU LOUVRE" w={460} bg="#3A3324" fg="#E8D8B0" size={34} />
		</Layer>
		<Layer p={0.85}>
			<Patterned x={-800} y={FLOOR} w={3500} h={700} fill="#7A7468" pattern="brick" cell={70} />
			{[200, 1720].map((x) => (
				<g key={x}>
					<rect x={x - 8} y={FLOOR - 380} width={16} height={380} fill="#2A2A2A" {...O} strokeWidth={3} />
					<path d={`M ${x - 30} ${FLOOR - 420} L ${x + 30} ${FLOOR - 420} L ${x + 20} ${FLOOR - 380} L ${x - 20} ${FLOOR - 380} Z`} fill="#F2C744" {...O} strokeWidth={3} />
					{night && <LightDisc cx={x} cy={FLOOR - 400} r={200} o={0.5} />}
				</g>
			))}
		</Layer>
	</>
);

// ---------------- Peruggia's room (attic) ----------------
export const RoomBack: React.FC<{f: number; night?: boolean; trunkOpen?: number; reveal?: number}> = ({f, night, trunkOpen = 0, reveal = 0}) => (
	<>
		<Layer p={0.75}>
			<Patterned x={-800} y={-400} w={3500} h={FLOOR + 400} fill={night ? '#4A4038' : '#B8A88A'} pattern="stripes" cell={70} />
			{/* sloped ceiling */}
			<path d="M -800 -400 L 2700 -400 L 2700 -60 L 1500 200 L 400 200 L -800 -60 Z" fill={night ? '#2A241E' : '#8A7A5E'} {...O} />
			<Window x={820} y={220} w={280} h={220} night={night} view="city" bands={!night} />
			<Calendar x={400} y={260} top="1912" big="?" w={120} c="#7A3A2A" />
			<Frame x={1360} y={280} w={120} h={100} art="mountain" c="#E8D8B0" />
			{/* bed */}
			<rect x={1340} y={520} width={460} height={110} fill="#E8E1D3" {...O} />
			<rect x={1320} y={470} width={40} height={220} fill="#5A3A22" {...O} />
			<rect x={1340} y={500} width={120} height={40} rx={12} fill="#F4F1EA" {...O} strokeWidth={3} />
			{/* washstand */}
			<rect x={140} y={480} width={180} height={210} fill="#6E4726" {...O} />
			<ellipse cx={230} cy={480} rx={80} ry={18} fill="#F4F1EA" {...O} strokeWidth={3} />
			{night && <Lamp x={640} y={300} />}
		</Layer>
		<Layer p={0.85}>
			<Patterned x={-800} y={FLOOR} w={3500} h={700} fill={night ? '#3A2A20' : '#7A5A3A'} pattern="planks" cell={70} />
		</Layer>
		<Layer>
			<Trunk x={1040} y={FLOOR + 120} s={0.9} open={trunkOpen} reveal={reveal} />
		</Layer>
	</>
);

// ---------------- Police archive (Bertillon) ----------------
export const ArchiveBack: React.FC<{f: number}> = ({f}) => (
	<>
		<Layer p={0.75}>
			<Patterned x={-800} y={-400} w={3500} h={FLOOR + 400} fill="#5A5A4A" pattern="panels" cell={80} />
			{/* drawers wall */}
			{Array.from({length: 7}).map((_, c) =>
				Array.from({length: 6}).map((_, r) => (
					<g key={`${c}-${r}`}>
						<rect x={200 + c * 220} y={80 + r * 96} width={200} height={84} fill="#8A6A44" stroke={INK} strokeWidth={3} />
						<rect x={260 + c * 220} y={112 + r * 96} width={80} height={22} fill="#F4F1EA" stroke={INK} strokeWidth={2} />
						<text x={300 + c * 220} y={129 + r * 96} textAnchor="middle" fontFamily={CAPS} fontSize={14} fill={INK}>
							{150 + c * 5 + r} CM
						</text>
					</g>
				))
			)}
			<Sign x={960} y={40} text="ARCHIVIO BERTILLON" w={460} bg="#2C3E50" size={32} />
			{/* measuring chart */}
			<g transform="translate(1800,120)">
				<rect x={0} y={0} width={110} height={560} fill="#F4F1EA" {...O} />
				{Array.from({length: 12}).map((_, i) => (
					<path key={i} d={`M 0 ${40 + i * 44} L ${i % 2 ? 40 : 70} ${40 + i * 44}`} stroke={INK} strokeWidth={3} />
				))}
			</g>
			<Lamp x={960} y={250} />
		</Layer>
		<Layer p={0.85}>
			<Patterned x={-800} y={FLOOR} w={3500} h={700} fill="#4A4038" pattern="tiles" cell={100} />
		</Layer>
	</>
);

// ---------------- Dumenza (village above Lago Maggiore) ----------------
export const VillageBack: React.FC<{f: number}> = ({f}) => (
	<>
		<Layer p={0.55}>
			<rect x={-800} y={-400} width={3500} height={1100} fill="#BFD8E8" />
			<path d="M -800 360 L -300 60 L 200 300 L 700 20 L 1200 320 L 1700 40 L 2200 300 L 2700 100 L 2700 700 L -800 700 Z" fill="#7A8AA0" {...O} />
			<path d="M -500 160 L -300 60 L -150 130 Z M 550 100 L 700 20 L 850 110 Z M 1550 120 L 1700 40 L 1850 130 Z" fill="#F4F1EA" />
		</Layer>
		<Layer p={0.7}>
			<rect x={-800} y={480} width={3500} height={140} fill="#5A9FD0" />
			{Array.from({length: 10}).map((_, i) => (
				<path key={i} d={`M ${-700 + i * 360 + Math.sin(f / 20 + i) * 10} 540 q 30 -10 60 0`} stroke="#9CC0D8" strokeWidth={5} fill="none" />
			))}
			<Sign x={960} y={440} text="LAGO MAGGIORE" w={340} bg="#2C3E50" size={28} />
		</Layer>
		<Layer p={0.85}>
			<rect x={-800} y={560} width={3500} height={700} fill="#6E8B4E" />
			{/* houses + bell tower */}
			{[200, 520, 1300, 1600].map((x, i) => (
				<g key={x}>
					<rect x={x} y={460 - (i % 2) * 30} width={220} height={200 + (i % 2) * 30} fill={['#E8C9A0', '#D8A878', '#E8D8B0', '#C98F5A'][i]} {...O} />
					<path d={`M ${x - 20} ${460 - (i % 2) * 30} L ${x + 110} ${380 - (i % 2) * 30} L ${x + 240} ${460 - (i % 2) * 30} Z`} fill="#A8452E" {...O} />
					<rect x={x + 80} y={540} width={50} height={60} fill="#4A3A2A" stroke={INK} strokeWidth={3} />
				</g>
			))}
			<g>
				<rect x={900} y={260} width={120} height={400} fill="#E8D8B0" {...O} />
				<path d="M 880 260 L 960 170 L 1040 260 Z" fill="#A8452E" {...O} />
				<rect x={930} y={300} width={60} height={70} rx={30} fill="#2A2A2A" />
			</g>
			<Sign x={960} y={700} text="DUMENZA" w={260} bg="#C9A94A" fg={INK} size={36} />
		</Layer>
	</>
);

// ---------------- Glazier workshop ----------------
export const WorkshopBack: React.FC<{f: number}> = ({f}) => (
	<>
		<Layer p={0.75}>
			<Patterned x={-800} y={-400} w={3500} h={FLOOR + 400} fill="#9C8E78" pattern="brick" cell={100} />
			<Window x={160} y={160} w={360} h={280} view="city" />
			{[700, 820, 940, 1060].map((x, i) => (
				<g key={x} transform={`rotate(${-6 + i * 2},${x},690)`}>
					<rect x={x} y={300} width={100} height={390} fill="#CFE3EA" opacity={0.6} stroke={INK} strokeWidth={3} />
					<path d={`M ${x + 20} 340 L ${x + 60} 300`} stroke="#fff" strokeWidth={5} />
				</g>
			))}
			<Sign x={1500} y={150} text="VETRERIA" w={300} bg="#4A6B6E" size={34} />
			<WallClock x={1700} y={300} t={f} />
			<rect x={1300} y={480} width={500} height={26} fill="#6E4726" {...O} />
		</Layer>
		<Layer p={0.85}>
			<Patterned x={-800} y={FLOOR} w={3500} h={700} fill="#6E6458" pattern="planks" cell={80} />
		</Layer>
	</>
);

// ---------------- Florence: hotel room / antique shop / Uffizi / court ----------------
export const HotelBack: React.FC<{f: number}> = ({f}) => (
	<>
		<Layer p={0.75}>
			<Patterned x={-800} y={-400} w={3500} h={FLOOR + 400} fill="#C9A06A" pattern="dots" cell={70} />
			<g>
				<rect x={760} y={150} width={400} height={320} fill="#BFD8E8" {...O} />
				{/* Duomo silhouette */}
				<path d="M 860 470 L 860 360 Q 960 250 1060 360 L 1060 470 Z" fill="#C98F5A" stroke={INK} strokeWidth={3} />
				<rect x={950} y={260} width={20} height={40} fill="#C98F5A" stroke={INK} strokeWidth={2} />
				<rect x={1100} y={300} width={30} height={170} fill="#E8D8B0" stroke={INK} strokeWidth={2} />
				<rect x={760} y={150} width={400} height={320} fill="none" stroke="#F4F1EA" strokeWidth={14} />
			</g>
			<Sign x={960} y={90} text="ALBERGO TRIPOLI-ITALIA" w={520} bg="#7A2E3A" size={30} />
			<rect x={1400} y={520} width={420} height={110} fill="#E8E1D3" {...O} />
			<rect x={1380} y={460} width={40} height={230} fill="#5A3A22" {...O} />
			<Lamp x={400} y={300} />
		</Layer>
		<Layer p={0.85}>
			<Patterned x={-800} y={FLOOR} w={3500} h={700} fill="#A8452E" pattern="tiles" cell={90} />
		</Layer>
	</>
);

export const ShopBack: React.FC<{f: number}> = ({f}) => (
	<>
		<Layer p={0.75}>
			<Patterned x={-800} y={-400} w={3500} h={FLOOR + 400} fill="#6E4726" pattern="wood" cell={80} />
			{[160, 330, 500].map((y) => (
				<g key={y}>
					<rect x={-200} y={y} width={2300} height={18} fill="#4A2E1A" {...O} />
					{Array.from({length: 14}).map((_, i) => (
						<path key={i} d={`M ${-120 + i * 160} ${y} q -30 -60 0 -110 q 30 50 0 110 Z`} fill={['#C9A94A', '#4A6B6E', '#C33631', '#E8D8B0'][i % 4]} stroke={INK} strokeWidth={3} />
					))}
				</g>
			))}
			<Sign x={960} y={60} text="ANTICHITÀ GERI" w={420} bg="#C9A94A" fg={INK} size={36} />
		</Layer>
		<Layer p={0.85}>
			<Patterned x={-800} y={FLOOR} w={3500} h={700} fill="#7A3A2A" pattern="checker" cell={100} />
		</Layer>
	</>
);

export const UffiziBack: React.FC<{f: number; crowd?: boolean}> = ({f}) => (
	<>
		<Layer p={0.7}>
			<rect x={-800} y={-400} width={3500} height={1200} fill="#E8E1D3" />
			{Array.from({length: 9}).map((_, i) => (
				<g key={i}>
					<path d={`M ${-500 + i * 380} 690 L ${-500 + i * 380} 260 Q ${-310 + i * 380} 100 ${-120 + i * 380} 260 L ${-120 + i * 380} 690`} fill="#D8CCB0" stroke={INK} strokeWidth={4} />
					<rect x={-440 + i * 380} y={300} width={260} height={180} fill="#B8922E" stroke={INK} strokeWidth={3} />
					<rect x={-424 + i * 380} y={316} width={228} height={148} fill={['#6E7A4A', '#5A4A6E', '#7A5A3A'][i % 3]} />
				</g>
			))}
			<Sign x={960} y={60} text="GALLERIA DEGLI UFFIZI" w={520} bg="#2C3E50" size={32} />
		</Layer>
		<Layer p={0.85}>
			<Patterned x={-800} y={FLOOR} w={3500} h={700} fill="#B8A88A" pattern="checker" cell={110} />
		</Layer>
	</>
);

export const CourtBack: React.FC<{f: number}> = ({f}) => (
	<>
		<Layer p={0.75}>
			<Patterned x={-800} y={-400} w={3500} h={FLOOR + 400} fill="#5A4A38" pattern="panels" cell={90} />
			<Sign x={960} y={90} text="LA LEGGE È UGUALE PER TUTTI" w={640} bg="#C9A94A" fg={INK} size={30} />
			{/* judge bench */}
			<rect x={560} y={360} width={800} height={330} fill="#6E4726" {...O} />
			<rect x={540} y={340} width={840} height={30} fill="#7E5530" {...O} />
			{/* cage for the accused */}
			<g>
				{Array.from({length: 9}).map((_, i) => (
					<rect key={i} x={1480 + i * 40} y={300} width={8} height={390} fill="#3A3A3A" />
				))}
				<rect x={1470} y={290} width={350} height={16} fill="#3A3A3A" />
			</g>
			<Lamp x={300} y={260} />
		</Layer>
		<Layer p={0.85}>
			<Patterned x={-800} y={FLOOR} w={3500} h={700} fill="#4A3A2A" pattern="wood" cell={90} />
		</Layer>
	</>
);

// ---------------- Amboise, 1516 ----------------
export const AmboiseBack: React.FC<{f: number}> = ({f}) => (
	<>
		<Layer p={0.75}>
			<Patterned x={-800} y={-400} w={3500} h={FLOOR + 400} fill="#9C8E78" pattern="stone" cell={110} />
			{/* tapestry */}
			<rect x={200} y={120} width={400} height={460} fill="#1F3A8A" {...O} />
			{Array.from({length: 12}).map((_, i) => (
				<path key={i} d={`M ${240 + (i % 4) * 100} ${170 + Math.floor(i / 4) * 140} l 14 24 l -14 24 l -14 -24 Z`} fill="#F2C744" />
			))}
			{/* fireplace */}
			<rect x={1300} y={360} width={420} height={330} fill="#7A6A54" {...O} />
			<rect x={1360} y={460} width={300} height={230} fill="#2A1D15" {...O} />
			{[0, 1, 2].map((i) => (
				<path key={i} d={`M ${1440 + i * 60} 690 q -20 -${60 + 20 * Math.sin(f / 4 + i)} 10 -${90 + 30 * Math.sin(f / 5 + i)} q 30 50 20 90 Z`} fill="#F2A13A" opacity={0.9} />
			))}
			<LightDisc cx={1510} cy={600} r={300} color="#F2A13A" o={0.35} />
			<Window x={760} y={160} w={280} h={300} view="trees" />
		</Layer>
		<Layer p={0.85}>
			<Patterned x={-800} y={FLOOR} w={3500} h={700} fill="#6E5A44" pattern="checker" cell={110} />
		</Layer>
	</>
);

// ---------------- Galerie d'Apollon, 2025 (night) ----------------
export const ApollonBack: React.FC<{f: number; broken?: number; lift?: number}> = ({f, broken = 0, lift = 0}) => (
	<>
		<Layer p={0.75}>
			<rect x={-800} y={-400} width={3500} height={1200} fill="#3E3222" />
			{/* gilded ceiling */}
			<rect x={-800} y={-400} width={3500} height={260} fill="#5A4A2A" />
			{Array.from({length: 10}).map((_, i) => (
				<ellipse key={i} cx={-600 + i * 380} cy={-260} rx={140} ry={70} fill="#8A6A2A" stroke="#C9A94A" strokeWidth={8} />
			))}
			<Patterned x={-800} y={-140} w={3500} h={FLOOR + 140} fill="#54442C" pattern="panels" cell={90} />
			<LightDisc cx={960} cy={300} r={700} color="#F2C744" o={0.18} />
			{/* the window with the lift outside */}
			<rect x={1480} y={100} width={300} height={420} fill="#13192B" {...O} strokeWidth={8} />
			{lift > 0 && (
				<g transform={`translate(1630,${lerpN(700, 380, lift)})`}>
					<rect x={-120} y={-30} width={240} height={60} fill="#F2C744" {...O} />
					<path d="M -60 30 L -60 300 M 60 30 L 60 300" stroke="#888" strokeWidth={10} />
				</g>
			)}
			{broken > 0 && <path d="M 1500 140 L 1560 230 L 1520 300 L 1600 380" stroke="#CFE3EA" strokeWidth={4} fill="none" />}
			<Sign x={700} y={60} text="GALERIE D'APOLLON" w={440} bg="#C9A94A" fg={INK} size={30} />
		</Layer>
		<Layer p={0.85}>
			<Patterned x={-800} y={FLOOR} w={3500} h={700} fill="#4A3A2A" pattern="wood" cell={90} />
			{/* display cases */}
			{[500, 960, 1420].map((x, i) => (
				<g key={x}>
					<rect x={x - 130} y={FLOOR - 120} width={260} height={220} fill="#3A2E1E" {...O} />
					<rect x={x - 120} y={FLOOR - 300} width={240} height={180} fill="#CFE3EA" opacity={broken > 0 && i > 0 ? 0.1 : 0.35} stroke={INK} strokeWidth={4} />
					{(broken === 0 || i === 0) && (
						<g transform={`translate(${x},${FLOOR - 200})`}>
							<path d="M -50 30 L -50 -10 L -25 10 L 0 -30 L 25 10 L 50 -10 L 50 30 Z" fill="#F2C744" {...O} strokeWidth={3} />
							<circle cx={0} cy={-34} r={8} fill="#C33631" />
						</g>
					)}
					{broken > 0 && i > 0 && <path d={`M ${x - 100} ${FLOOR - 280} L ${x - 40} ${FLOOR - 200} L ${x + 20} ${FLOOR - 260} L ${x + 90} ${FLOOR - 140}`} stroke="#CFE3EA" strokeWidth={4} fill="none" />}
				</g>
			))}
		</Layer>
	</>
);
const lerpN = (a: number, b: number, t: number) => a + (b - a) * t;

// ---------------- Louvre pyramid + ticket booth (2026) ----------------
export const TicketBack: React.FC<{f: number}> = ({f}) => (
	<>
		<Layer p={0.6}>
			<rect x={-800} y={-400} width={3500} height={1200} fill="#BFD8E8" />
			<path d="M 560 690 L 960 200 L 1360 690 Z" fill="#CFE3EA" opacity={0.85} stroke={INK} strokeWidth={5} />
			{Array.from({length: 6}).map((_, i) => (
				<path key={i} d={`M ${560 + i * 66} 690 L 960 200`} stroke="#8FA3AE" strokeWidth={3} />
			))}
			{Array.from({length: 5}).map((_, i) => (
				<path key={i} d={`M ${640 + i * 0} ${590 - i * 80} L ${1280 - i * 0} ${590 - i * 80}`} stroke="#8FA3AE" strokeWidth={3} />
			))}
			<rect x={-800} y={300} width={1300} height={390} fill="#D8CCB0" {...O} />
			<rect x={1420} y={300} width={1300} height={390} fill="#D8CCB0" {...O} />
		</Layer>
		<Layer p={0.85}>
			<Patterned x={-800} y={FLOOR} w={3500} h={700} fill="#C9C3AE" pattern="tiles" cell={120} />
		</Layer>
	</>
);

// ---------------- Modern Mona Lisa room (thick glass, rope, crowd with phones) ----------------
export const ModernRoomBack: React.FC<{f: number; crowd?: number}> = ({f, crowd = 1}) => {
	const r = rng(33);
	return (
		<>
			<Layer p={0.75}>
				<rect x={-800} y={-400} width={3500} height={FLOOR + 400} fill="#2C3E50" />
				<Patterned x={-800} y={-400} w={3500} h={FLOOR + 400} fill="#2C3E50" pattern="panels" cell={110} />
				<rect x={640} y={60} width={640} height={540} fill="#1E2B38" {...O} />
				<Painting x={960} y={320} s={0.95} glass frame glow={0.4} />
				<rect x={700} y={100} width={520} height={460} fill="#CFE3EA" opacity={0.15} stroke="#E8F4F8" strokeWidth={6} />
				<path d="M 300 640 Q 960 700 1620 640" stroke={PALETTE.red} strokeWidth={12} fill="none" />
				{[300, 1620].map((x) => (
					<rect key={x} x={x - 8} y={560} width={16} height={130} fill="#B8962E" stroke={INK} strokeWidth={3} />
				))}
			</Layer>
			<Layer p={0.85}>
				<Patterned x={-800} y={FLOOR} w={3500} h={700} fill="#8A8278" pattern="tiles" cell={120} />
			</Layer>
			<Layer p={1.25}>
				{Array.from({length: Math.round(16 * crowd)}).map((_, i) => {
					const x = -200 + r() * 2300;
					const y = FLOOR + 260 + r() * 160;
					const up = (f / 20 + i) % 6 < 4;
					return (
						<g key={i}>
							<circle cx={x} cy={y} r={80} fill={['#2C3E50', '#5A3A2A', '#3A3A44', '#6E4726', '#C33631'][i % 5]} stroke={INK} strokeWidth={3} />
							{up && (
								<g>
									<path d={`M ${x + 40} ${y - 40} L ${x + 60} ${y - 180}`} stroke={INK} strokeWidth={5} />
									<rect x={x + 36} y={y - 250} width={50} height={80} rx={8} fill="#111" stroke={INK} strokeWidth={3} />
									<rect x={x + 42} y={y - 242} width={38} height={60} fill="#9FD3F0" />
								</g>
							)}
						</g>
					);
				})}
			</Layer>
		</>
	);
};

export {FLOOR};
