import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Cam, camAt, Layer, Move, Scene} from '../camera/Camera';
import {Character, CharacterProps} from '../rig/Character';
import {ALEX, CHRIS, COOK_A, COOK_B, CURTIS, DANA, EXTRAS, GAMER, IGER, INK, JENSEN, JOBS, JONES, KRESS, MARCO, Outfit, PALETTE, RAY, SCIENTIST, WAITRESS} from '../rig/outfits';
import {HeroJacket} from '../props/Jacket';
import {BlackCard, ChapterCard, CornerStrip, countValue, Grade, StampTag, TitleOverlay, Vignette} from '../ui/Cards';
import {CAPS, HAND} from '../ui/Fonts';
import {clamp, easeIn, easeOut, isBlinking, lerp, LINES, mouthAt, prog, rng} from '../lib';
import {BoardroomBack, CrtDesk, FLOOR, KitchenBack, MuseumBack, Office96Back, OfficeBack, OfficeFront, StageBack, Steam} from '../sets/Sets';
import {AppleBack, Booth, Car, CastleBack, DennysBack, ExchangeBack, Gear, GpuCard, LabBack, MapChina, MapUsItaly, MineBack, MineCart, Mousetrap, RoadBack} from '../sets/Sets2';
import {Calendar, LightDisc, OUTLINE as O, Patterned, Plant, Sign, Window, WallClock} from '../sets/prims';

export type TP = {f: number; len: number; abs: number; p: any};
export const FEET = FLOOR + 70;
const young = EXTRAS[5];

// word frame helper: first word in line `id` that contains `sub`
export const wf = (id: number, sub: string) => {
	const w = LINES[id].words.find((x) => x.w.toLowerCase().includes(sub.toLowerCase()));
	return Math.round((w ? w.s : LINES[id].start) * 30);
};

// ---------------- shared ----------------
const SEEDS: Record<string, number> = {};
export const Actor: React.FC<CharacterProps & {abs: number; talk?: [number, number]}> = ({abs, talk, ...p}) => {
	const seed = (SEEDS[p.outfit.name] ??= Object.keys(SEEDS).length * 13 + 5);
	const mouth = talk ? mouthAt(abs, talk[0], talk[1]) : undefined;
	const talking = !!talk && abs >= talk[0] && abs <= talk[1];
	return (
		<Character
			{...p}
			blink={isBlinking(abs, seed)}
			breath={(abs % 90) / 90}
			mouth={mouth ?? p.mouth}
			tilt={talking ? Math.sin((abs - talk![0]) / 6) * 7 : p.tilt ?? 0}
			gestureT={talking ? 0.5 + 0.5 * Math.sin((abs - talk![0]) / 4) : 1}
			pose={talking && (p.pose === undefined || p.pose === 'idle') ? 'talking' : p.pose}
			shadow={p.shadow ?? 0.42}
		/>
	);
};

const GRADES: Record<string, [string, number, number]> = {
	night: [PALETTE.night, 0.25, 0.55],
	day: ['#D4D0BF', 0.2, 0.35],
	sepia: ['#5A4A38', 0.35, 0.4],
	diner: ['#7B3A1A', 0.22, 0.45],
	tech: ['#1A2751', 0.2, 0.5],
	triumph: ['#48296A', 0.15, 0.4],
	none: ['#000', 0, 0.35],
};
export const Wrap: React.FC<{g?: string; children: React.ReactNode}> = ({g = 'day', children}) => {
	const [c, o, v] = GRADES[g];
	return (
		<AbsoluteFill>
			{children}
			{o > 0 && <Grade color={c} opacity={o} />}
			<Vignette corner={v} />
		</AbsoluteFill>
	);
};

const cam = (f: number, len: number, a: Cam, b: Cam, m: Move = {kind: 'creep'}) => camAt(f, len, a, b, m);
const Slam: React.FC<{f: number; at: number; x: number; y: number; text: string; rot?: number; size?: number; color?: string}> = ({f, at, x, y, text, rot = -7, size = 96, color = PALETTE.red}) => {
	const st = f - at;
	if (st < 0) return null;
	const w = text.length * size * 0.62 + 60;
	return (
		<g transform={`translate(${x},${y}) rotate(${rot}) scale(${st < 6 ? lerp(1.7, 1, easeOut(st / 6)) : 1})`}>
			<rect x={-w / 2} y={-size * 0.7} width={w} height={size * 1.3} rx={10} fill="none" stroke={color} strokeWidth={10} />
			<text x={0} y={size * 0.33} textAnchor="middle" fontFamily={CAPS} fontSize={size} fill={color}>
				{text}
			</text>
		</g>
	);
};
const NamePlate: React.FC<{x: number; y: number; text: string; f?: number}> = ({x, y, text, f = 99}) => {
	const n = Math.floor(clamp(f / 12) * text.length);
	return (
		<g transform={`translate(${x},${y})`}>
			<rect x={-text.length * 11 - 24} y={-26} width={text.length * 22 + 48} height={50} rx={5} fill="#2C3E50" stroke={INK} strokeWidth={3} />
			<rect x={-text.length * 11 - 24} y={-26} width={10} height={50} fill={PALETTE.accent} />
			<text x={0} y={12} textAnchor="middle" fontFamily={CAPS} fontSize={30} fill="#F4F1EA">
				{text.slice(0, n)}
			</text>
		</g>
	);
};
const Chip: React.FC<{glow?: number; s?: number}> = ({glow = 1, s = 1}) => (
	<g transform={`scale(${s})`}>
		<circle r={90} fill={PALETTE.accent} opacity={0.25 * glow} />
		<rect x={-40} y={-34} width={80} height={62} rx={5} fill="#2B2F36" {...O} />
		<rect x={-22} y={-18} width={44} height={30} fill={PALETTE.accent} stroke={INK} strokeWidth={2.5} />
		{[-28, -14, 0, 14, 28].map((px) => (
			<path key={px} d={`M ${px} 28 L ${px} 40 M ${px} -34 L ${px} -46`} stroke="#C9C9C9" strokeWidth={4} />
		))}
	</g>
);
const Panel: React.FC<{f: number; at: number; x: number; h: number; label: string; val: string; c?: string}> = ({f, at, x, h, label, val, c = PALETTE.accentBody}) => {
	if (f < at) return null;
	const d = easeOut((f - at) / 17);
	return (
		<g transform={`translate(${x},${lerp(-800, 0, d)})`}>
			<rect x={-130} y={FEET - 40 - h} width={260} height={h} fill={c} {...O} />
			{Array.from({length: Math.floor(h / 40)}).map((_, k) => (
				<path key={k} d={`M -130 ${FEET - 40 - k * 40} L 130 ${FEET - 40 - k * 40}`} stroke={INK} strokeWidth={2.5} opacity={0.5} />
			))}
			<rect x={-120} y={FEET - 110 - h} width={240} height={60} rx={6} fill="#1B222B" {...O} strokeWidth={3} />
			<text x={0} y={FEET - 66 - h} textAnchor="middle" fontFamily={CAPS} fontSize={40} fill={PALETTE.accent}>
				{val}
			</text>
			<text x={0} y={FEET - 5} textAnchor="middle" fontFamily={CAPS} fontSize={28} fill={INK}>
				{label}
			</text>
		</g>
	);
};
const fmtIt = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

// ---------------- SET picker for skits & story scenes ----------------
const SetBack: React.FC<{set: string; abs: number; board?: React.ReactNode}> = ({set, abs, board}) => {
	switch (set) {
		case 'office':
			return <OfficeBack f={abs} board={board ?? <text x={980} y={480} textAnchor="middle" fontFamily={CAPS} fontSize={96} fill={PALETTE.accent}>$115,8 MLD</text>} />;
		case 'officeNight':
			return <OfficeBack f={abs} night board={board ?? <text x={980} y={480} textAnchor="middle" fontFamily={CAPS} fontSize={96} fill={PALETTE.accent}>$115,8 MLD</text>} />;
		case 'dennys':
			return <DennysBack f={abs} />;
		case 'office96':
			return <Office96Back f={abs} calendar={<Calendar x={420} y={160} top="GIORNI" big={abs > 3200 ? '∞' : '20'} w={170} c="#7A3A2A" />} />;
		case 'lab':
			return <LabBack f={abs} />;
		case 'kitchen':
			return <KitchenBack f={abs} menu={<text x={960} y={260} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={70} fill="#F4F1EA">???</text>} />;
		case 'home':
			return <Home abs={abs} />;
		case 'stage':
			return <StageBack f={abs} />;
		case 'boardroom':
			return <BoardroomBack f={abs} />;
		case 'apple':
			return <AppleBack f={abs} />;
	}
	return null;
};
const SET_BG: Record<string, string> = {office: '#C9C3AE', officeNight: '#26304A', dennys: '#C98F5A', office96: '#B9A580', lab: '#1E2A30', kitchen: '#DCE3DE', home: '#E8D8C0', stage: '#0A0C18', boardroom: '#2A1D15', apple: '#D8D0C0'};
const SET_GRADE: Record<string, string> = {office: 'day', officeNight: 'night', dennys: 'diner', office96: 'sepia', lab: 'tech', kitchen: 'none', home: 'none', stage: 'night', boardroom: 'night', apple: 'day'};

const Home: React.FC<{abs: number}> = ({abs}) => (
	<>
		<Layer p={0.75}>
			<Patterned x={-700} y={-300} w={3300} h={FLOOR + 300} fill="#E3C9A0" pattern="dots" cell={70} />
			<Window x={1250} y={150} w={380} h={300} view="trees" sky="#BFD8E0" />
			<WallClock x={760} y={200} t={abs} />
			<g transform="translate(420,150)">
				<rect x={-120} y={-10} width={240} height={150} fill="#6E4726" {...O} />
				<rect x={-104} y={6} width={208} height={118} fill="#2E8B57" />
				<rect x={-34} y={6} width={70} height={118} fill="#F4F1EA" />
				<rect x={36} y={6} width={68} height={118} fill={PALETTE.red} />
			</g>
			{/* sofa */}
			<rect x={300} y={520} width={520} height={170} rx={30} fill="#4A6B6E" {...O} />
			<rect x={300} y={470} width={520} height={80} rx={30} fill="#5A7B7E" {...O} />
			<Plant x={1780} y={690} sway={Math.sin(abs / 30) * 2} />
		</Layer>
		<Layer p={0.85}>
			<Patterned x={-700} y={FLOOR} w={3300} h={600} fill="#A87A4A" pattern="planks" cell={70} />
		</Layer>
	</>
);

// ============================== TEMPLATES ==============================
const T: Record<string, React.FC<TP>> = {};

T.card = ({f, len, p}) => {
	const chars = p.text.length;
	const typeLen = Math.max(8, (p.typeEnd ?? len - 12) - (p.typeStart ?? 0));
	return <BlackCard text={p.text} f={f} startTyping={p.typeStart ?? 0} cps={(chars * 30) / typeLen} />;
};
T.chapter = ({p}) => <ChapterCard text={p.text} />;

// Jensen on the keynote stage with the glowing chip
T.stage = ({f, len, abs, p}) => {
	const z = p.zoom ?? 1.5;
	const c = cam(f, len, {x: 960, y: p.y ?? 560, zoom: z}, {x: 960, y: (p.y ?? 560) - 10, zoom: z * 1.12}, p.punch ? {kind: 'punch', at: p.punch} : {kind: 'creep'});
	return (
		<Wrap g="night">
			<Scene cam={c} bg="#0A0C18">
				<StageBack f={abs} screen={<text x={960} y={340} textAnchor="middle" fontFamily={CAPS} fontSize={120} fill={PALETTE.accent} opacity={0.9}>NVIDIA</text>} />
				<Layer>
					<LightDisc cx={960} cy={560} r={300} color={PALETTE.accent} o={0.35} />
					<Actor abs={abs} outfit={JENSEN} x={960} y={FEET} pose={p.pose ?? 'holding'} expression={p.expr ?? 'happy'} held={<Chip s={0.9} />} marks={p.marks ?? []} />
				</Layer>
			</Scene>
			{p.strip && <CornerStrip f={f - 10} text={p.strip} hold={60} />}
		</Wrap>
	);
};

// Empty jacket on the stage (title / return)
T.stageJacket = ({f, len, abs, p}) => {
	const c = cam(f, len, {x: 960, y: p.y0 ?? 500, zoom: p.z0 ?? 1.05}, {x: 960, y: p.y1 ?? 470, zoom: p.z1 ?? 1.2});
	return (
		<Wrap g="night">
			<Scene cam={c} bg="#0A0C18">
				<StageBack f={abs} screen={<text x={960} y={340} textAnchor="middle" fontFamily={CAPS} fontSize={120} fill={PALETTE.accent} opacity={0.35}>NVIDIA</text>} />
				<Layer>
					<HeroJacket x={960} y={FEET + 10} scale={1.05} glow={1} />
				</Layer>
				<Layer p={1.5} blur={5}>
					{[-120, 200, 520, 1400, 1720, 2040].map((x, i) => (
						<circle key={i} cx={x} cy={1130} r={110} fill="#0B0C12" stroke="#000" strokeWidth={4} />
					))}
				</Layer>
			</Scene>
			{p.title && <TitleOverlay f={f} lines={[{t: 'PERCHÉ NVIDIA'}, {t: 'FALLIREBBE SENZA'}, {t: 'JENSEN HUANG', accent: true}]} />}
		</Wrap>
	);
};

T.jacketClose = ({f, len, abs, p}) => {
	const c = cam(f, len, {x: 960, y: 600, zoom: 3.4}, {x: 960, y: 595, zoom: 3.6}, p.punch ? {kind: 'punch', at: p.punch, dur: 10} : {kind: 'creep'});
	return (
		<Wrap g="night">
			<Scene cam={c} bg="#0A0C18">
				<StageBack f={abs} />
				<Layer>
					<LightDisc cx={960} cy={560} r={300} color={PALETTE.accent} o={0.35} />
					<Actor abs={abs} outfit={JENSEN} x={960} y={FEET} expression="neutral" />
				</Layer>
			</Scene>
		</Wrap>
	);
};

// Tear-off calendar counter
T.years = ({f, len, p}) => {
	const year = Math.round(countValue(f - 4, p.dur ?? 34, p.from, p.to));
	const c = cam(f, len, {x: 960, y: 520, zoom: 1.0}, {x: 960, y: 520, zoom: 1.12}, {kind: 'settle'});
	const tearT = ((f - 4) % 4) / 4;
	return (
		<Wrap g="none">
			<Scene cam={c} bg="#5A2A22">
				<Layer p={0.8}>
					<Patterned x={-300} y={-200} w={2600} h={1500} fill={p.wall ?? '#8C3A2E'} pattern="brick" cell={110} />
					<LightDisc cx={960} cy={480} r={520} o={0.35} />
				</Layer>
				<Layer>
					<Calendar x={960} y={230} top={p.top ?? 'ANNO'} big={String(year) + (p.suffix && year === p.to ? p.suffix : '')} w={460} c="#2C3E50" />
					{f > 4 && year !== p.to && (
						<g transform={`translate(${960 + tearT * 160},${230 + tearT * tearT * 500}) rotate(${tearT * 70})`}>
							<rect x={-230} y={138} width={460} height={390} fill="#F4F1EA" {...O} opacity={1 - tearT} />
						</g>
					)}
					{p.sign && <Sign x={960} y={860} text={p.sign} w={360} bg="#C9A94A" fg={INK} size={36} />}
				</Layer>
			</Scene>
		</Wrap>
	);
};

// Jensen walks out through the EXIT door
T.walkout = ({f, len, abs, p}) => {
	const walkX = lerp(760, 1470, easeIn(prog(f, 4, len)) * 0.6 + prog(f, 4, len) * 0.4);
	const c = cam(f, len, {x: 900, y: 560, zoom: 1.25}, {x: 1180, y: 560, zoom: 1.25});
	const doorOpen = clamp((walkX - 1300) / 120);
	return (
		<Wrap g="day">
			<Scene cam={c} bg="#C9C3AE">
				<OfficeBack f={abs} board={<text x={980} y={470} textAnchor="middle" fontFamily={CAPS} fontSize={64} fill="#3A4A3A">CHIUSO</text>} />
				<Layer p={0.75}>
					<rect x={1830} y={300} width={230} height={390} fill="#FFF6D8" {...O} />
					<path d={`M 1830 300 L ${1830 + 230 * (1 - doorOpen)} ${300 + 20 * doorOpen} L ${1830 + 230 * (1 - doorOpen)} ${690 - 20 * doorOpen} L 1830 690 Z`} fill="#6E4726" {...O} />
					<Sign x={1945} y={270} text="USCITA" w={160} bg="#2E7D32" size={28} />
				</Layer>
				<Layer>
					<Actor abs={abs} outfit={p.who === 'jobs' ? JOBS : JENSEN} view="side" x={walkX} y={FEET} pose="walking" walkPhase={abs / 3.2} expression="deadpan" />
				</Layer>
				<OfficeFront f={abs} />
			</Scene>
			{p.stamp && <StampTag f={f - 6} text={p.stamp} x={1660} />}
		</Wrap>
	);
};

// Top-down table with newspapers + slam stamp
T.papers = ({f, len, p}) => {
	const c = cam(f, len, {x: 960, y: 540, zoom: 1.0}, {x: 960, y: 540, zoom: 1.12});
	const papers = [
		{at: 0, x: 560, y: 470, r: -8},
		{at: 8, x: 1330, y: 430, r: 6},
		{at: 16, x: 960, y: 640, r: -2},
	];
	return (
		<Wrap g="none">
			<Scene cam={c} bg="#5A3A22">
				<Layer>
					<Patterned x={-200} y={-200} w={2400} h={1500} fill="#7A4E2E" pattern="planks" cell={160} />
					<LightDisc cx={960} cy={540} r={700} o={0.25} />
					{papers.map((pp, i) => {
						if (f < pp.at) return null;
						const t = easeOut((f - pp.at) / 5);
						return (
							<g key={i} transform={`translate(${lerp(pp.x < 960 ? -500 : 2400, pp.x, t)},${pp.y}) rotate(${pp.r})`}>
								<rect x={-260} y={-180} width={520} height={360} fill="#F1ECDD" {...O} />
								<text x={0} y={-110} textAnchor="middle" fontFamily={CAPS} fontSize={40} fill={INK}>
									{p.heads[i]}
								</text>
								<path d="M -230 -86 L 230 -86" stroke={INK} strokeWidth={3} />
								<rect x={-230} y={-66} width={170} height={130} fill="#C9C3AE" stroke={INK} strokeWidth={2.5} />
								{[0, 1, 2, 3, 4, 5].map((k) => (
									<path key={k} d={`M -40 ${-56 + k * 24} L 230 ${-56 + k * 24}`} stroke="#999" strokeWidth={6} />
								))}
								<text x={-200} y={150} fontFamily={HAND} fontWeight={700} fontSize={28} fill="#555">
									nov. 2026
								</text>
							</g>
						);
					})}
					<Slam f={f} at={p.stampAt} x={1000} y={610} text={p.stamp} />
				</Layer>
			</Scene>
		</Wrap>
	);
};

// Clipboard on a striped wall + stamp
T.clipboard = ({f, len, p}) => {
	const c = cam(f, len, {x: 960, y: 540, zoom: 1.05}, {x: 960, y: 520, zoom: 1.15});
	return (
		<Wrap g="day">
			<Scene cam={c} bg="#4A6B6E">
				<Layer p={0.8}>
					<Patterned x={-300} y={-300} w={2600} h={1700} fill="#4A6B6E" pattern="stripes" cell={90} />
				</Layer>
				<Layer>
					<rect x={660} y={150} width={600} height={800} rx={20} fill="#8A5A34" {...O} />
					<rect x={700} y={210} width={520} height={710} fill="#F4F1EA" {...O} />
					<rect x={860} y={120} width={200} height={70} rx={12} fill="#AFAFAF" {...O} />
					<text x={960} y={300} textAnchor="middle" fontFamily={CAPS} fontSize={52} fill={INK}>
						{p.title}
					</text>
					{[0, 1, 2, 3, 4].map((k) => (
						<g key={k}>
							<rect x={740} y={360 + k * 100} width={40} height={40} fill="none" stroke={INK} strokeWidth={3} />
							<path d={`M 800 ${395 + k * 100} L 1180 ${395 + k * 100}`} stroke="#BBB" strokeWidth={3} strokeDasharray="10 10" />
						</g>
					))}
					<Slam f={f} at={p.stampAt} x={960} y={600} text={p.stamp} rot={8} size={92} />
				</Layer>
			</Scene>
		</Wrap>
	);
};

// Board probe: folder under a magnifying glass in the boardroom
T.probe = ({f, len, abs, p}) => {
	const c = cam(f, len, {x: 960, y: 560, zoom: 1.2}, {x: 960, y: 600, zoom: 1.45});
	const mx = 960 + Math.sin(f / 10) * 60;
	return (
		<Wrap g="night">
			<Scene cam={c} bg="#2A1D15">
				<BoardroomBack f={abs} />
				<Layer>
					{[560, 1360].map((x, i) => (
						<Actor key={i} abs={abs + i * 9} outfit={EXTRAS[i * 2]} view="3q" mirror={i === 1} x={x} y={FEET - 40} scale={0.9} expression="thinking" />
					))}
					<rect x={360} y={FEET - 120} width={1200} height={40} fill="#4A2E1E" {...O} />
					<rect x={400} y={FEET - 80} width={1120} height={170} fill="#3A2416" {...O} />
					<g transform={`translate(960,${FEET - 150})`}>
						<rect x={-150} y={-40} width={300} height={60} rx={6} fill="#E8C66A" {...O} />
						<text x={0} y={2} textAnchor="middle" fontFamily={CAPS} fontSize={26} fill={INK}>
							{p.label}
						</text>
					</g>
					<g transform={`translate(${mx},${FEET - 210})`}>
						<circle r={70} fill="#CFE3EA" opacity={0.4} {...O} strokeWidth={8} />
						<path d="M 50 50 L 120 120" stroke="#6E4726" strokeWidth={22} strokeLinecap="round" />
					</g>
				</Layer>
			</Scene>
		</Wrap>
	);
};

// Jensen alone at a window in the rain (loss tone effect)
T.rainWindow = ({f, len, abs}) => {
	const c = cam(f, len, {x: 960, y: 520, zoom: 1.25}, {x: 960, y: 500, zoom: 1.4});
	const r = rng(4);
	const drops = Array.from({length: 40}).map(() => [r() * 700, r() * 400, r() * 10 + 18]);
	return (
		<Wrap g="night">
			<Scene cam={c} bg="#13192B">
				<Layer p={0.75}>
					<Patterned x={-700} y={-300} w={3300} h={FLOOR + 300} fill="#26304A" pattern="panels" cell={85} />
					<rect x={610} y={110} width={700} height={460} fill="#1A2751" {...O} />
					<svg x={610} y={110} width={700} height={460} viewBox="0 0 700 460" overflow="hidden">
						{[0, 1, 2, 3, 4, 5].map((i) => (
							<rect key={i} x={20 + i * 115} y={460 - (120 + ((i * 53) % 200))} width={90} height={300} fill="#0E1430" />
						))}
						{drops.map(([x, y, s], i) => (
							<path key={i} d={`M ${x} ${(y + abs * s) % 480 - 20} l -4 18`} stroke="#9FB8D8" strokeWidth={3} strokeLinecap="round" />
						))}
					</svg>
					<rect x={610} y={110} width={700} height={460} fill="none" stroke="#F4F1EA" strokeWidth={14} />
					<path d="M 960 110 L 960 570" stroke="#F4F1EA" strokeWidth={9} />
					<rect x={594} y={570} width={732} height={18} fill="#E6DFCF" {...O} />
				</Layer>
				<Layer p={0.85}>
					<Patterned x={-700} y={FLOOR} w={3300} h={600} fill="#2A2F3E" pattern="tiles" cell={110} />
				</Layer>
				<Layer>
					<Actor abs={abs} outfit={JENSEN} view="back" x={960} y={FEET + 40} scale={1.05} expression="sad" />
				</Layer>
			</Scene>
		</Wrap>
	);
};

// Earnings reveal (office): back-view → screen on → counter → stack
T.earnings = ({f, len, abs, p}) => {
	const on = f >= p.onAt;
	const val = f < p.countAt ? 0 : countValue(f - p.countAt, 34, 0, 115.8);
	const c = f < p.cutAt ? cam(f, p.cutAt, {x: 980, y: 520, zoom: 1.35}, {x: 980, y: 480, zoom: 1.55}) : cam(f - p.cutAt, len - p.cutAt, {x: 1100, y: 560, zoom: 1.12}, {x: 1150, y: 470, zoom: 1.2}, {kind: 'settle'});
	const stack = [0, 10, 15, 18, 21, 24, 26, 28, 30, 32].map((t) => t + p.countAt + 10);
	const surprised = f > p.countAt + 10;
	return (
		<Wrap g="day">
			<Scene cam={c} bg="#C9C3AE">
				<OfficeBack
					f={abs}
					board={
						<g>
							{on && <rect x={712} y={302} width={536} height={276} fill="#16231A" />}
							{on && <text x={980} y={480} textAnchor="middle" fontFamily={CAPS} fontSize={92} fill={PALETTE.accent}>${val.toFixed(1).replace('.', ',')} MLD</text>}
							{on && <text x={980} y={370} textAnchor="middle" fontFamily={CAPS} fontSize={34} fill="#CFE8B8">VENDITE, 3 MESI</text>}
						</g>
					}
				/>
				<Layer>
					{on && <LightDisc cx={980} cy={500} r={460} color={PALETTE.accent} o={0.25} />}
					{stack.map((t, i) => {
						if (f < t) return null;
						const d = easeOut((f - t) / 6);
						const yy = FEET - 10 - i * 34;
						return (
							<g key={i} transform={`translate(1500,${lerp(yy - 500, yy, d)})`}>
								<rect x={-90} y={-30} width={180} height={34} rx={4} fill={PALETTE.accentBody} {...O} strokeWidth={3.5} />
								<rect x={-30} y={-30} width={60} height={34} fill="#E8E2C4" stroke={INK} strokeWidth={2} />
							</g>
						);
					})}
					<Actor abs={abs} outfit={DANA} view={f < p.cutAt ? 'back' : '3q'} x={f < p.cutAt ? 980 : 560} y={FEET + (f < p.cutAt ? 150 : 0)} scale={f < p.cutAt ? 1.25 : 1} expression={surprised ? 'surprised' : 'neutral'} />
					{f >= p.cutAt && <Actor abs={abs} outfit={RAY} view="3q" x={760} y={FEET} expression={surprised ? 'surprised' : 'neutral'} marks={surprised ? ['sparkles'] : []} />}
				</Layer>
				<OfficeFront f={abs} />
			</Scene>
			<CornerStrip f={f - p.cutAt} text="17 NOV 2026" hold={60} />
		</Wrap>
	);
};

// Generic skit: A asks, B answers. frame: otsA | otsB | two | closeA | closeB
T.skit = ({f, len, abs, p}) => {
	const A: Outfit = p.A ?? RAY;
	const B: Outfit = p.B ?? DANA;
	const set = p.set ?? 'office';
	let c: Cam = {x: 960, y: 520, zoom: 1.4};
	let a: any = {};
	let b: any = {};
	switch (p.frame) {
		case 'otsA':
			c = {x: 1060, y: 470, zoom: 1.55};
			b = {view: 'back', x: 700, y: FEET + 220, scale: 1.55};
			a = {view: '3q', mirror: true, x: 1220, y: FEET};
			break;
		case 'otsB':
			c = {x: 860, y: 470, zoom: 1.55};
			a = {view: 'back', x: 1230, y: FEET + 220, scale: 1.55};
			b = {view: '3q', x: 700, y: FEET};
			break;
		case 'two':
			c = {x: 960, y: 500, zoom: 1.45};
			a = {view: 'side', mirror: true, x: 1150, y: FEET};
			b = {view: 'side', x: 770, y: FEET};
			break;
		case 'closeA':
			c = {x: 1160, y: 410, zoom: 2.7};
			a = {view: '3q', mirror: true, x: 1160, y: FEET};
			b = {view: 'side', x: 520, y: FEET};
			break;
		default:
			c = {x: 760, y: 410, zoom: 2.7};
			b = {view: '3q', x: 760, y: FEET};
			a = {view: 'side', mirror: true, x: 1400, y: FEET};
	}
	const cc = cam(f, len, c, c, {kind: 'still'});
	const line = LINES[p.line];
	const talk: [number, number] = [line.startFrame, line.endFrame];
	const also = p.also ? LINES[p.also.line] : null;
	const alsoTalk: [number, number] | undefined = also ? [also.startFrame, also.endFrame] : undefined;
	const talkFor = (w: string) => (p.who === w ? talk : p.also?.who === w ? alsoTalk : undefined);
	const aEl = <Actor key="a" abs={abs} outfit={A} talk={talkFor('A')} expression={p.exprA ?? 'concerned'} marks={p.marksA} {...a} />;
	const bEl = <Actor key="b" abs={abs} outfit={B} talk={talkFor('B')} expression={p.exprB ?? 'deadpan'} marks={p.marksB} {...b} />;
	const front = p.frame === 'otsA' ? [aEl, bEl] : [bEl, aEl];
	return (
		<Wrap g={SET_GRADE[set]}>
			<Scene cam={cc} bg={SET_BG[set]}>
				<SetBack set={set} abs={abs} />
				{set === 'kitchen' && (
					<Layer p={0.85}>
						<Steam f={abs} xs={[80, 560, 1040, 1520]} y={470} />
					</Layer>
				)}
				<Layer>
					{set === 'dennys' && <Booth y={FEET + 130} cups={2} />}
					{front}
				</Layer>
			</Scene>
		</Wrap>
	);
};

// Boardroom with the empty CEO chair
T.emptyChair = ({f, len, abs, p}) => {
	const c = cam(f, len, {x: 960, y: 560, zoom: p.z ?? 1.35}, {x: 960, y: 600, zoom: (p.z ?? 1.35) * 1.15});
	return (
		<Wrap g="night">
			<Scene cam={c} bg="#2A1D15">
				<BoardroomBack f={abs} />
				<Layer>
					{(p.board ?? true) &&
						[540, 960, 1380].map((x, i) => <Actor key={i} abs={abs + i * 13} outfit={EXTRAS[i]} view="front" x={x} y={FEET - 40} scale={0.85} expression="deadpan" />)}
					<rect x={260} y={FEET - 120} width={1400} height={40} fill="#4A2E1E" {...O} />
					<rect x={300} y={FEET - 80} width={1320} height={170} fill="#3A2416" {...O} />
					<LightDisc cx={960} cy={FEET + 30} r={260} o={0.3} />
					<g transform={`translate(960,${FEET + 230})`}>
						<rect x={-110} y={-300} width={220} height={260} rx={30} fill="#1C1C1F" {...O} />
						<rect x={-130} y={-60} width={260} height={40} rx={10} fill="#232327" {...O} />
						<path d="M 0 -20 L 0 60 M -60 70 L 60 70" stroke={INK} strokeWidth={10} />
						<rect x={-50} y={-250} width={100} height={30} rx={4} fill="#C9A94A" stroke={INK} strokeWidth={2.5} />
						<text x={0} y={-228} textAnchor="middle" fontFamily={CAPS} fontSize={22} fill={INK}>
							CEO
						</text>
					</g>
				</Layer>
			</Scene>
		</Wrap>
	);
};

// Felt table: bets on years (chips pushed in sequence)
T.bets = ({f, len, abs, p}) => {
	const c = cam(f, len, {x: 960, y: 560, zoom: 1.2}, {x: 960, y: 560, zoom: 1.26});
	const squares: [string, string][] = p.squares ?? [
		['1993', '3D'],
		['1997', 'RIVA'],
		['2006', 'CUDA'],
		['2012', 'IA'],
	];
	return (
		<Wrap g="none">
			<Scene cam={c} bg="#1E4D2E">
				<Layer>
					<Patterned x={-300} y={-300} w={2600} h={1700} fill="#22603A" pattern="dots" cell={60} />
					<LightDisc cx={960} cy={500} r={620} o={0.25} />
					{squares.map(([y, l], i) => {
						const x = 360 + i * 400;
						const at = (p.ats ?? [0, 8, 16, 24])[i];
						const d = easeOut((f - at) / 8);
						return (
							<g key={y}>
								<rect x={x - 160} y={340} width={320} height={260} rx={14} fill="none" stroke="#F4F1EA" strokeWidth={7} strokeDasharray="20 12" />
								<text x={x} y={660} textAnchor="middle" fontFamily={CAPS} fontSize={48} fill="#F4F1EA">
									{y}
								</text>
								<text x={x} y={720} textAnchor="middle" fontFamily={CAPS} fontSize={34} fill={PALETTE.accent}>
									{l}
								</text>
								{f >= at &&
									[0, 1, 2, 3, 4].map((k) => (
										<g key={k} transform={`translate(${lerp(x, x + (k - 2) * 26, d)},${lerp(1100, 470 - k * 12, d)})`}>
											<circle r={40} fill={k % 2 ? PALETTE.red : '#F4F1EA'} {...O} strokeWidth={3.5} />
											<circle r={26} fill="none" stroke={k % 2 ? '#fff' : PALETTE.red} strokeWidth={4} strokeDasharray="8 8" />
										</g>
									))}
							</g>
						);
					})}
				</Layer>
			</Scene>
			{p.plate && <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}><NamePlate x={960} y={110} text={p.plate} f={f - (p.plateAt ?? 0)} /></svg>}
		</Wrap>
	);
};

// Denny's wide / booth story scene
T.dennys = ({f, len, abs, p}) => {
	const c = cam(f, len, p.c0 ?? {x: 960, y: 540, zoom: 1.0}, p.c1 ?? {x: 960, y: 560, zoom: 1.15});
	const pour = p.pour ? clamp((f - 6) / 30) : 0;
	return (
		<Wrap g="diner">
			<Scene cam={c} bg="#C98F5A">
				<DennysBack f={abs} />
				<Layer>
					<Actor abs={abs} outfit={CHRIS} view="3q" x={640} y={FEET} expression="happy" />
					<Actor abs={abs} outfit={young} view="front" x={960} y={FEET} expression={p.exprJ ?? 'happy'} pose={p.poseJ ?? 'idle'} held={p.held} />
					<Actor abs={abs} outfit={CURTIS} view="3q" mirror x={1280} y={FEET} expression="neutral" />
					<Booth y={FEET + 130} coffee={p.pour ? 0.3 + 0.7 * pour : 1} />
					{p.waitress && (
						<g>
							<Actor abs={abs} outfit={WAITRESS} view="3q" mirror x={1560} y={FEET + 40} pose="holding" expression="happy" held={<g transform="rotate(-30)"><path d="M -40 -40 L 40 -40 L 30 40 L -30 40 Z" fill="#E8E2D4" {...O} /><rect x={-30} y={-10} width={60} height={40} fill="#4A2A1A" /></g>} />
							{pour > 0 && pour < 1 && <path d={`M 1500 ${FEET - 200} Q 1400 ${FEET - 150} 1360 ${FEET - 30}`} stroke="#4A2A1A" strokeWidth={8} fill="none" />}
							<g transform={`translate(1640,${FEET - 520})`}>
								<rect x={-80} y={-30} width={160} height={56} rx={8} fill="#F4F1EA" {...O} strokeWidth={3} />
								<text x={0} y={10} textAnchor="middle" fontFamily={CAPS} fontSize={30} fill={INK}>
									REFILL ×{1 + Math.floor(f / 8)}
								</text>
							</g>
						</g>
					)}
				</Layer>
			</Scene>
			{p.stamp && <StampTag f={f - 4} text={p.stamp} x={1660} />}
			{p.strip && <CornerStrip f={f - 16} text={p.strip} hold={60} />}
		</Wrap>
	);
};

// Insert: framed family photo on the booth table
T.family = ({f, len, abs}) => {
	const c = cam(f, len, {x: 960, y: 540, zoom: 1.0}, {x: 960, y: 520, zoom: 1.15}, {kind: 'settle'});
	const fam = [JENSEN, KRESS, COOK_B, CHRIS];
	return (
		<Wrap g="diner">
			<Scene cam={c} bg="#8A3A2A">
				<Layer p={0.8}>
					<Patterned x={-300} y={-300} w={2600} h={1700} fill="#C98F5A" pattern="planks" cell={70} />
				</Layer>
				<Layer>
					<rect x={560} y={160} width={800} height={600} rx={12} fill="#6E4726" {...O} />
					<rect x={600} y={200} width={720} height={520} fill="#BFD8E0" stroke={INK} strokeWidth={3} />
					<rect x={600} y={560} width={720} height={160} fill="#7CA05A" />
					{[740, 900, 1040, 1160].map((x, i) => (
						<Character key={i} outfit={i === 0 ? {...young, glasses: undefined} : i === 1 ? {...EXTRAS[4]} : {...COOK_B, hair: 'short', collar: 'crew', body: i === 2 ? '#C33631' : '#4A6B6E', hem: '#333'}} x={x} y={690} scale={i < 2 ? 0.95 : 0.6} shadow={0.15} expression="happy" blink={isBlinking(abs, i * 7 + 3)} />
					))}
					<text x={960} y={820} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={48} fill="#F4F1EA">
						famiglia, 1993
					</text>
				</Layer>
			</Scene>
		</Wrap>
	);
};

// Insert: money jar counter
T.jar = ({f, len, p}) => {
	const v = countValue(f - (p.at ?? 4), 30, 0, p.to);
	const c = cam(f, len, {x: 960, y: 540, zoom: 1.0}, {x: 960, y: 540, zoom: 1.1}, {kind: 'settle'});
	const fill = clamp(v / p.to);
	return (
		<Wrap g={p.g ?? 'diner'}>
			<Scene cam={c} bg="#3A4A5A">
				<Layer p={0.8}>
					<Patterned x={-300} y={-300} w={2600} h={1700} fill={p.wall ?? '#4A6B6E'} pattern="dots" cell={70} />
					<LightDisc cx={960} cy={500} r={500} o={0.3} />
				</Layer>
				<Layer>
					<rect x={760} y={260} width={400} height={520} rx={60} fill="#CFE3EA" opacity={0.5} {...O} />
					<rect x={780} y={780 - 480 * fill} width={360} height={480 * fill} rx={40} fill={PALETTE.accentBody} opacity={0.9} />
					{Array.from({length: Math.floor(fill * 10)}).map((_, i) => (
						<rect key={i} x={800 + ((i * 53) % 260)} y={740 - i * 44} width={90} height={36} fill="#9CCB6A" stroke={INK} strokeWidth={2} />
					))}
					<rect x={740} y={220} width={440} height={50} rx={10} fill="#C9A94A" {...O} />
					<g transform="translate(960,900)">
						<rect x={-230} y={-50} width={460} height={90} rx={8} fill="#1B222B" {...O} />
						<text x={0} y={22} textAnchor="middle" fontFamily={CAPS} fontSize={60} fill={PALETTE.accent}>
							${fmtIt(v)}
						</text>
					</g>
				</Layer>
			</Scene>
		</Wrap>
	);
};

// Insert: a chip that flops (FLOP slam)
T.flop = ({f, len, p}) => {
	const c = cam(f, len, {x: 960, y: 540, zoom: 1.0}, {x: 960, y: 540, zoom: 1.12});
	const d = easeIn(clamp(f / 7));
	return (
		<Wrap g="sepia">
			<Scene cam={c} bg="#5A4A38">
				<Layer p={0.8}>
					<Patterned x={-300} y={-300} w={2600} h={1700} fill="#8A7A5A" pattern="brick" cell={110} />
				</Layer>
				<Layer>
					<rect x={560} y={700} width={800} height={30} fill="#6E4726" {...O} />
					<g transform={`translate(960,${lerp(-100, 640, d)}) rotate(${f > 7 ? 8 : 0})`}>
						<GpuCard x={0} y={0} label={p.label ?? 'NV1'} />
					</g>
					{f > 7 && f < 16 && [-1, 0, 1].map((k) => <circle key={k} cx={960 + k * 130 * (1 + (f - 7) / 8)} cy={700} r={26} fill="#E8E2D4" opacity={1 - (f - 7) / 9} />)}
					<Slam f={f} at={p.slamAt ?? 14} x={960} y={360} text={p.slam ?? 'FLOP'} rot={-8} />
				</Layer>
			</Scene>
			{p.stamp && <StampTag f={f - 2} text={p.stamp} x={1660} />}
		</Wrap>
	);
};

// 1996 office: calendar rips / lifebuoy / glow
T.office96 = ({f, len, abs, p}) => {
	const c = cam(f, len, {x: 900, y: 520, zoom: 1.12}, {x: 800, y: 480, zoom: 1.28});
	const gaps = [10, 5, 3, 3, 3, 2, 2, 2, 2, 2];
	let t0 = p.ripAt ?? 9999;
	const rips: number[] = [];
	gaps.forEach((g) => {
		rips.push(t0);
		t0 += g;
	});
	const ripped = rips.filter((r) => f >= r).length;
	const day = 30 - ripped;
	const drop = p.buoyAt !== undefined ? easeIn(clamp((f - p.buoyAt) / 7)) : 0;
	return (
		<Wrap g="sepia">
			<Scene cam={c} bg="#B9A580">
				<Office96Back f={abs} calendar={<Calendar x={420} y={160} top="GIORNI" big={String(day)} w={170} c="#7A3A2A" />} />
				<Layer>
					<CrtDesk x={1000} y={FEET - 190} />
					<Actor abs={abs} outfit={young} view="3q" mirror x={700} y={FEET} expression={drop >= 1 ? 'happy' : ripped > 4 ? 'panic' : 'concerned'} pose={drop >= 1 ? 'cheering' : 'idle'} marks={ripped > 4 && drop < 1 ? ['sweat'] : []} />
					{p.buoyAt !== undefined && f >= p.buoyAt && (
						<g transform={`translate(1240,${lerp(-200, FEET - 250, drop)})`}>
							<circle r={95} fill="none" stroke="#E8E2D4" strokeWidth={46} />
							{[0, 1, 2, 3].map((k) => (
								<path key={k} d={`M ${Math.cos((k * Math.PI) / 2 + 0.4) * 72} ${Math.sin((k * Math.PI) / 2 + 0.4) * 72} L ${Math.cos((k * Math.PI) / 2 + 0.4) * 118} ${Math.sin((k * Math.PI) / 2 + 0.4) * 118}`} stroke={PALETTE.red} strokeWidth={30} />
							))}
							<circle r={118} fill="none" {...O} />
							<circle r={72} fill="none" {...O} />
							<text x={0} y={22} textAnchor="middle" fontFamily={CAPS} fontSize={60} fill={PALETTE.accentBody} stroke={INK} strokeWidth={2}>
								$5 MLN
							</text>
						</g>
					)}
					{p.sega && (
						<g>
							<Actor abs={abs} outfit={EXTRAS[3]} view="3q" mirror x={1560} y={FEET} expression="neutral" pose={drop >= 1 ? 'pointing' : 'idle'} />
							<Sign x={1560} y={FEET - 470} text="SEGA" w={160} bg="#1F3A8A" size={30} />
						</g>
					)}
				</Layer>
			</Scene>
			{p.stamp && <StampTag f={f - 2} text={p.stamp} x={1660} />}
		</Wrap>
	);
};

// GPU card product shot (RIVA 128 / GeForce) on a patterned wall; optional slam label
T.product = ({f, len, p}) => {
	const c = cam(f, len, {x: 960, y: 540, zoom: 1.0}, {x: 960, y: 520, zoom: 1.15}, p.punch ? {kind: 'punch', at: p.punch} : {kind: 'creep'});
	const d = easeOut(clamp(f / 6));
	return (
		<Wrap g={p.g ?? 'sepia'}>
			<Scene cam={c} bg="#2C3E50">
				<Layer p={0.8}>
					<Patterned x={-300} y={-300} w={2600} h={1700} fill={p.wall ?? '#4A6B6E'} pattern={p.pattern ?? 'panels'} cell={90} />
					<LightDisc cx={960} cy={500} r={520} o={0.35} />
				</Layer>
				<Layer>
					{p.box ? (
						<g transform={`translate(${lerp(2300, 960, d)},560)`}>
							<rect x={-260} y={-300} width={520} height={480} rx={10} fill="#1C1C1F" {...O} />
							<rect x={-260} y={-300} width={520} height={90} fill={PALETTE.accentBody} {...O} />
							<text x={0} y={-238} textAnchor="middle" fontFamily={CAPS} fontSize={56} fill="#F4F1EA">
								{p.box}
							</text>
							<GpuCard x={0} y={20} s={1.2} glow={0.6} />
						</g>
					) : (
						<g transform={`translate(${lerp(2300, 960, d)},540)`}>
							<GpuCard x={0} y={0} s={1.8} glow={1} label={p.label} />
						</g>
					)}
					{p.slam && <Slam f={f} at={p.slamAt} x={960} y={880} text={p.slam} rot={-4} size={80} color={p.slamColor ?? PALETTE.accentBody} />}
				</Layer>
			</Scene>
			{p.stamp && <StampTag f={f - 2} text={p.stamp} x={1660} />}
		</Wrap>
	);
};

// Grow a crowd of tiny employees (accelerating), with counter
T.staff = ({f, len, abs, p}) => {
	const n = p.n ?? 40;
	const c = cam(f, len, {x: 960, y: 560, zoom: 1.0}, {x: 960, y: 560, zoom: 1.08});
	const times = Array.from({length: n}).map((_, i) => Math.round(4 + 50 * Math.sqrt(i / n)));
	const shown = times.filter((t) => f >= t).length;
	const outs = [CHRIS, CURTIS, young, RAY, DANA, COOK_B, ALEX, GAMER];
	return (
		<Wrap g="sepia">
			<Scene cam={c} bg="#B9A580">
				<Office96Back f={abs} />
				<Layer>
					{Array.from({length: shown}).map((_, i) => {
						const row = Math.floor(i / 10);
						const col = i % 10;
						return <Character key={i} outfit={outs[i % outs.length]} x={330 + col * 140 + (row % 2) * 70} y={FEET + 20 + row * 60 - 120} scale={0.36} shadow={0.2} expression="happy" blink={isBlinking(abs, i)} />;
					})}
					<g transform="translate(960,1000)">
						<rect x={-150} y={-46} width={300} height={80} rx={8} fill="#1B222B" {...O} />
						<text x={0} y={18} textAnchor="middle" fontFamily={CAPS} fontSize={52} fill={PALETTE.accent}>
							{shown}
						</text>
					</g>
				</Layer>
			</Scene>
		</Wrap>
	);
};

// Boxes stack + counter to 1.000.000
T.boxes = ({f, len, abs, p}) => {
	const v = countValue(f - 6, 40, 0, 1000000);
	const c = cam(f, len, {x: 960, y: 620, zoom: 1.1}, {x: 960, y: 400, zoom: 1.0}, {kind: 'creep'});
	const k = Math.floor(clamp((f - 6) / 50) * 24);
	return (
		<Wrap g="sepia">
			<Scene cam={c} bg="#B9A580">
				<Office96Back f={abs} />
				<Layer>
					{Array.from({length: k}).map((_, i) => {
						const col = i % 4;
						const row = Math.floor(i / 4);
						return (
							<g key={i} transform={`translate(${720 + col * 160},${FEET - 60 - row * 100})`}>
								<rect x={-70} y={-50} width={140} height={100} fill="#C9A06A" {...O} />
								<text x={0} y={10} textAnchor="middle" fontFamily={CAPS} fontSize={22} fill={INK}>
									RIVA 128
								</text>
							</g>
						);
					})}
					<Actor abs={abs} outfit={young} view="3q" x={420} y={FEET} expression="happy" pose="pointing" />
					<g transform={`translate(1500,${FEET - 560})`}>
						<rect x={-200} y={-50} width={400} height={90} rx={8} fill="#1B222B" {...O} />
						<text x={0} y={22} textAnchor="middle" fontFamily={CAPS} fontSize={54} fill={PALETTE.accent}>
							{fmtIt(v)}
						</text>
					</g>
					<Calendar x={1500} y={FEET - 420} top="MESI" big={String(Math.min(4, 1 + Math.floor(f / 25)))} w={130} c="#7A3A2A" />
				</Layer>
			</Scene>
		</Wrap>
	);
};

// Stock exchange 1999 (bell rings, ticker)
T.exchange = ({f, len, abs, p}) => {
	const c = cam(f, len, {x: 960, y: 520, zoom: 1.0}, {x: 960, y: 540, zoom: 1.2});
	const ring = f > 10 ? Math.sin(f * 1.4) * 10 * Math.exp(-(f - 10) / 20) : 0;
	return (
		<Wrap g="day">
			<Scene cam={c} bg="#3A4A5A">
				<ExchangeBack f={abs} />
				<Layer>
					<g transform={`rotate(${ring},960,430)`} />
					<Actor abs={abs} outfit={young} view="3q" x={760} y={FEET} expression="happy" pose="cheering" />
					<Actor abs={abs} outfit={CHRIS} view="3q" x={540} y={FEET} expression="happy" pose={f > 10 ? 'cheering' : 'idle'} />
					<Actor abs={abs} outfit={CURTIS} view="3q" mirror x={1200} y={FEET} expression="happy" pose={f > 14 ? 'cheering' : 'idle'} />
					{f > 10 && [0, 1, 2].map((k) => <path key={k} d={`M ${1040 + k * 30} ${440 - k * 20} q 30 -10 40 -40`} stroke="#F2C744" strokeWidth={6} fill="none" opacity={1 - ((f - 10) % 12) / 12} />)}
				</Layer>
			</Scene>
			{p.stamp && <StampTag f={f - 2} text={p.stamp} x={1660} />}
		</Wrap>
	);
};

// CUDA lab story: GPU on table, board writes, optional glow
T.lab = ({f, len, abs, p}) => {
	const c = cam(f, len, p.c0 ?? {x: 960, y: 540, zoom: 1.1}, p.c1 ?? {x: 960, y: 500, zoom: 1.3});
	const glow = p.glowAt !== undefined ? (f >= p.glowAt ? 1 : 0) : 0.3;
	return (
		<Wrap g="tech">
			<Scene cam={c} bg="#1E2A30">
				<LabBack f={abs} />
				<Layer>
					<rect x={660} y={FEET - 170} width={600} height={26} fill="#7A7F86" {...O} />
					<path d={`M 700 ${FEET - 144} L 700 ${FEET} M 1220 ${FEET - 144} L 1220 ${FEET}`} stroke={INK} strokeWidth={10} />
					<GpuCard x={960} y={FEET - 230} s={0.8} glow={glow} />
					{p.glowAt !== undefined && f >= p.glowAt && f - p.glowAt < 3 && <circle cx={960} cy={FEET - 230} r={160 * (1 + (f - p.glowAt) * 0.035)} fill="none" stroke={PALETTE.accent} strokeWidth={5} />}
					<Actor abs={abs} outfit={JENSEN} view="3q" x={480} y={FEET} expression={p.exprJ ?? 'happy'} pose={p.poseJ ?? 'pointing'} />
					{p.crowd && (
						<>
							<Actor abs={abs} outfit={GAMER} view="3q" mirror x={1440} y={FEET} expression="concerned" />
							<Actor abs={abs} outfit={SCIENTIST} view="3q" mirror x={1640} y={FEET} expression="thinking" />
						</>
					)}
				</Layer>
			</Scene>
			{p.stamp && <StampTag f={f - 2} text={p.stamp} x={1660} />}
		</Wrap>
	);
};

// Triptych-style split: games vs calculations (panels slide in)
T.split = ({f, len, p}) => {
	const items: {t: string; c: string; draw: (k: number) => React.ReactNode}[] = [
		{t: 'GIOCHI', c: '#C33631', draw: () => <g><rect x={-120} y={-60} width={240} height={120} rx={50} fill="#2B2B2B" {...O} /><circle cx={-60} cy={0} r={18} fill="#F4F1EA" /><circle cx={60} cy={-20} r={14} fill={PALETTE.accent} /><circle cx={80} cy={14} r={14} fill="#F2C744" /></g>},
		{t: 'CALCOLI', c: '#2C3E50', draw: () => <text x={0} y={20} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={70} fill="#F4F1EA">∑ x·w = ?</text>},
	];
	return (
		<Wrap g="tech">
			<AbsoluteFill style={{background: '#111'}}>
				<svg width={1920} height={1080}>
					{items.map((it, i) => {
						const at = (p.ats ?? [0, 30])[i];
						const d = easeOut((f - at) / 8);
						if (f < at) return null;
						return (
							<g key={i} transform={`translate(${i * 960 + 480},${lerp(-600, 540, d)})`}>
								<rect x={-470} y={-530} width={940} height={1060} fill={it.c} stroke="#000" strokeWidth={12} />
								<g transform="translate(0,-60) scale(1.6)">{it.draw(i)}</g>
								<text x={0} y={300} textAnchor="middle" fontFamily={CAPS} fontSize={72} fill="#F4F1EA">
									{it.t}
								</text>
								<GpuCard x={0} y={120} s={0.7} glow={0.5} />
							</g>
						);
					})}
				</svg>
			</AbsoluteFill>
		</Wrap>
	);
};

// Alex at his desk with two gaming GPUs
T.alex = ({f, len, abs, p}) => {
	const c = cam(f, len, {x: 960, y: 520, zoom: 1.15}, {x: 1000, y: 500, zoom: 1.35});
	return (
		<Wrap g="tech">
			<Scene cam={c} bg="#1E2A30">
				<LabBack f={abs} />
				<Layer>
					<rect x={640} y={FEET - 170} width={760} height={26} fill="#6E4726" {...O} />
					<path d={`M 680 ${FEET - 144} L 680 ${FEET} M 1360 ${FEET - 144} L 1360 ${FEET}`} stroke={INK} strokeWidth={10} />
					<GpuCard x={880} y={FEET - 230} s={0.6} glow={0.7} label="GTX 580" />
					<GpuCard x={1160} y={FEET - 230} s={0.6} glow={0.7} label="GTX 580" />
					<Actor abs={abs} outfit={ALEX} view="3q" x={480} y={FEET} expression="thinking" pose="pointing" />
				</Layer>
			</Scene>
			<svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
				<NamePlate x={420} y={110} text="ALEX KRIZHEVSKY" f={f - 6} />
			</svg>
			{p.stamp && <StampTag f={f - 2} text={p.stamp} x={1660} />}
		</Wrap>
	);
};

// Sliding comparison panels (error rates / forecasts)
T.compare = ({f, len, abs, p}) => {
	const c = cam(f, len, {x: 1000, y: 520, zoom: 1.15}, {x: 1000, y: 500, zoom: 1.25});
	return (
		<Wrap g={p.g ?? 'tech'}>
			<Scene cam={c} bg={p.set === 'office' ? '#C9C3AE' : '#1E2A30'}>
				{p.set === 'office' ? <OfficeBack f={abs} board={<text x={980} y={480} textAnchor="middle" fontFamily={CAPS} fontSize={96} fill={PALETTE.accent}>Q4</text>} /> : <LabBack f={abs} />}
				<Layer>
					{p.panels.map((pn: any, i: number) => (
						<Panel key={i} f={f} at={pn.at} x={pn.x} h={pn.h} label={pn.label} val={pn.val} c={pn.c} />
					))}
					{p.actor && <Actor abs={abs} outfit={p.actor === 'kress' ? KRESS : ALEX} view="3q" x={480} y={FEET} expression="happy" pose="pointing" />}
				</Layer>
			</Scene>
		</Wrap>
	);
};

// Neural network growing out of the GPUs
T.network = ({f, len, abs}) => {
	const c = cam(f, len, {x: 960, y: 560, zoom: 1.0}, {x: 960, y: 480, zoom: 1.15});
	const layers = [3, 5, 5, 2];
	const nodes = layers.map((n, li) => Array.from({length: n}).map((_, k) => [460 + li * 330, 540 + (k - (n - 1) / 2) * 120]));
	const t = clamp(f / 40);
	return (
		<Wrap g="tech">
			<Scene cam={c} bg="#0E1420">
				<Layer>
					<Patterned x={-300} y={-300} w={2600} h={1700} fill="#121A2A" pattern="dots" cell={80} />
					{nodes.slice(0, -1).map((L, li) =>
						L.map(([x, y], a) =>
							nodes[li + 1].map(([x2, y2], b) => {
								const show = clamp(t * 4 - li);
								return <path key={`${li}-${a}-${b}`} d={`M ${x} ${y} L ${lerp(x, x2, show)} ${lerp(y, y2, show)}`} stroke={PALETTE.accent} strokeWidth={3} opacity={0.5} />;
							})
						)
					)}
					{nodes.map((L, li) =>
						L.map(([x, y], k) => {
							const s = clamp(t * 4 - li + 0.5);
							return <circle key={`${li}-${k}`} cx={x} cy={y} r={34 * s} fill={li === nodes.length - 1 ? PALETTE.accent : '#2C3E50'} stroke={INK} strokeWidth={4} />;
						})
					)}
					<GpuCard x={960} y={980} s={0.8} glow={1} />
					<text x={1520} y={300} fontFamily={CAPS} fontSize={60} fill="#F4F1EA">
						IA
					</text>
				</Layer>
			</Scene>
		</Wrap>
	);
};

// Gold mine with a cart full of glowing GPUs
T.mine = ({f, len, abs}) => {
	const c = cam(f, len, {x: 800, y: 540, zoom: 1.2}, {x: 1100, y: 540, zoom: 1.2});
	return (
		<Wrap g="night">
			<Scene cam={c} bg="#2A1D15">
				<MineBack f={abs} />
				<Layer>
					<MineCart x={lerp(500, 1200, clamp(f / len))} y={FEET + 70} />
					<Actor abs={abs} outfit={JENSEN} view="side" x={lerp(260, 960, clamp(f / len))} y={FEET + 40} pose="walking" walkPhase={abs / 3.2} expression="happy" />
				</Layer>
			</Scene>
		</Wrap>
	);
};

// Rivals as a staircase of blocks
T.stairs = ({f, len, abs, p}) => {
	const c = cam(f, len, {x: 960, y: 600, zoom: 1.1}, {x: 1060, y: 420, zoom: 1.15});
	const blocks = [
		{x: 560, h: 380, at: p.ats[2], label: 'MICROSOFT', c: '#4A6B6E'},
		{x: 960, h: 400, at: p.ats[1], label: 'APPLE', c: '#8A8F84'},
		{x: 1360, h: 560, at: p.ats[0], label: 'NVIDIA', c: PALETTE.accentBody},
	];
	const v = countValue(f - p.ats[0], 30, 0, 5000);
	return (
		<Wrap g="triumph">
			<Scene cam={c} bg="#48296A">
				<Layer p={0.6}>
					<rect x={-700} y={-400} width={3300} height={1500} fill="#48296A" />
					<rect x={-700} y={200} width={3300} height={700} fill="#DB747A" opacity={0.6} />
					<rect x={-700} y={500} width={3300} height={500} fill="#F0B789" opacity={0.7} />
				</Layer>
				<Layer p={0.85}>
					<Patterned x={-700} y={FLOOR + 100} w={3300} h={600} fill="#6E5A8A" pattern="stone" cell={110} />
				</Layer>
				<Layer>
					{blocks.map((b, i) => {
						if (f < b.at) return null;
						const g = easeOut((f - b.at) / 10);
						const h = b.h * g;
						return (
							<g key={i}>
								<rect x={b.x - 180} y={FEET + 100 - h} width={360} height={h} fill={b.c} {...O} />
								<text x={b.x} y={FEET + 60} textAnchor="middle" fontFamily={CAPS} fontSize={40} fill="#F4F1EA">
									{b.label}
								</text>
							</g>
						);
					})}
					{f >= p.ats[0] + 10 && <Actor abs={abs} outfit={JENSEN} view="front" x={1360} y={FEET + 100 - 560} scale={0.75} expression="happy" pose="cheering" />}
					{f >= p.ats[0] && (
						<g transform={`translate(1360,${FEET + 100 - 600 - 360})`}>
							<rect x={-240} y={-50} width={480} height={90} rx={8} fill="#1B222B" {...O} />
							<text x={0} y={22} textAnchor="middle" fontFamily={CAPS} fontSize={50} fill={PALETTE.accent}>
								${fmtIt(v)} MLD
							</text>
						</g>
					)}
				</Layer>
			</Scene>
			{p.stamp && <StampTag f={f - 2} text={p.stamp} x={300} />}
		</Wrap>
	);
};

// Kitchen story scenes
const cookRow = (abs: number, n: number, x0: number, dx: number, y: number, s: number) =>
	Array.from({length: n}).map((_, i) => (
		<Actor key={i} abs={abs + i * 7} outfit={i % 2 ? COOK_B : COOK_A} view="back" x={x0 + i * dx} y={y} scale={s} pose={(Math.floor(abs / 12) + i) % 2 ? 'holding' : 'idle'} shadow={0.3} />
	));
T.kitchen = ({f, len, abs, p}) => {
	const mode = p.mode ?? 'wide';
	const c =
		mode === 'wide'
			? cam(f, len, {x: 700, y: 540, zoom: 1.0}, {x: 1220, y: 540, zoom: 1.0})
			: mode === 'chef'
			? cam(f, len, {x: 1150, y: 520, zoom: 1.6}, {x: 1150, y: 500, zoom: 1.7}, {kind: 'settle'})
			: mode === 'menu'
			? cam(f, len, {x: 960, y: 260, zoom: 2.2}, {x: 960, y: 250, zoom: 2.35})
			: cam(f, len, {x: 960, y: 540, zoom: 1.05}, {x: 960, y: 540, zoom: 1.12});
	const chef: Outfit = {...JENSEN, hair: 'toque', hairColor: '#FAF7EF', hairHighlight: '#FFFFFF'};
	const items: [string, number][] = p.items ?? [];
	const dark = mode === 'closed';
	const shutter = dark ? easeIn(clamp((f - 6) / 10)) : 0;
	return (
		<Wrap g={dark ? 'night' : mode === 'win' ? 'triumph' : 'none'}>
			<Scene cam={c} bg="#DCE3DE">
				<KitchenBack
					f={abs}
					menu={
						<g>
							{items.map(([t, at], i) => {
								const n = Math.floor(clamp((f - at) / 8) * t.length);
								return (
									<text key={i} x={760} y={220 + i * 60} fontFamily={HAND} fontWeight={700} fontSize={50} fill="#F4F1EA">
										{t.slice(0, n)}
									</text>
								);
							})}
							{p.unknown && <text x={960} y={260} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={70} fill="#F4F1EA">???</text>}
						</g>
					}
				/>
				<Layer p={0.85}>
					<Steam f={abs} xs={[-400, -160, 80, 320, 560, 800, 1040, 1280, 1520, 1760, 2000, 2240]} y={470} />
					{mode === 'wide' && abs >= (p.moreAt ?? 0) && cookRow(abs, 14, -560, 240, FEET - 60, 0.6)}
				</Layer>
				<Layer>
					{(mode === 'wide' || mode === 'keep' || mode === 'win' || mode === 'closed') && cookRow(abs, mode === 'wide' ? 10 : 7, mode === 'wide' ? -300 : 60, 300, FEET + 30, 0.85)}
					{mode === 'chef' && <Actor abs={abs} outfit={chef} view="3q" mirror x={1340} y={FEET + 40} scale={1.1} pose={p.pose ?? 'pointing'} expression={p.expr ?? 'neutral'} held={p.pose === 'holding' ? <Chip s={0.8} /> : undefined} />}
					{mode === 'keep' && (
						<g transform="translate(1560,420)">
							<path d="M 0 -60 L 0 -20" stroke={INK} strokeWidth={5} />
							<g transform="translate(0,90) scale(0.6)">
								<path d="M -56 -52 L -50 -96 L 50 -96 L 56 -52 Z" fill="#FAF7EF" {...O} />
								<path d="M -54 -96 C -84 -100 -80 -150 -46 -144 C -40 -176 0 -180 10 -156 C 26 -180 70 -168 62 -138 C 90 -132 84 -96 54 -96 Z" fill="#FAF7EF" {...O} />
							</g>
						</g>
					)}
					{mode === 'win' && (
						<g transform={`translate(960,${FEET - 560}) rotate(${f * 3})`}>
							<circle r={110} fill="#5A9FD0" {...O} />
							<path d="M -60 -50 q 40 -20 60 10 q 20 30 -10 50 q -40 10 -50 -60 Z M 20 30 q 40 -10 50 20 q -10 30 -50 10 Z" fill="#7CA05A" stroke={INK} strokeWidth={3} />
						</g>
					)}
					{dark && <rect x={-700} y={-300} width={3300} height={(FLOOR + 600) * shutter} fill="#4A4F55" {...O} />}
					{dark && Array.from({length: 40}).map((_, i) => (-300 + i * 34 < -300 + (FLOOR + 600) * shutter ? <path key={i} d={`M -700 ${-300 + i * 34} L 2600 ${-300 + i * 34}`} stroke="#2E3236" strokeWidth={6} /> : null))}
					{dark && <LightDisc cx={960} cy={540} r={500} color="#FFE9B0" o={0.15} />}
					{dark && shutter > 0.9 && <Sign x={960} y={540} text="CHIUSO" w={360} bg={PALETTE.red} size={64} />}
				</Layer>
			</Scene>
		</Wrap>
	);
};

// Apple story scenes: push-out (Jobs walks out), collapse chart, NeXT box, interim plate
T.apple = ({f, len, abs, p}) => {
	const mode = p.mode;
	const c = cam(f, len, {x: 960, y: 540, zoom: 1.15}, {x: 1000, y: 520, zoom: 1.3});
	const walkX = lerp(1100, 1880, clamp(f / len));
	return (
		<Wrap g={mode === 'collapse' ? 'night' : 'day'}>
			<Scene cam={c} bg="#D8D0C0">
				<AppleBack f={abs} night={mode === 'collapse'} />
				<Layer>
					{mode === 'out' && (
						<>
							<Actor abs={abs} outfit={EXTRAS[0]} view="3q" x={560} y={FEET} pose="pointing" expression="angry" />
							<Actor abs={abs} outfit={JOBS} view="side" x={walkX} y={FEET} pose="walking" walkPhase={abs / 3.2} expression="sad" />
						</>
					)}
					{mode === 'collapse' && (
						<g>
							<rect x={560} y={220} width={800} height={420} rx={8} fill="#121620" {...O} strokeWidth={8} />
							<polyline points={Array.from({length: 12}).map((_, i) => `${600 + i * 65},${300 + i * 25 + Math.sin(i) * 20}`).slice(0, 1 + Math.floor(clamp(f / 30) * 11)).join(' ')} fill="none" stroke={PALETTE.red} strokeWidth={8} />
							<Calendar x={1600} y={160} top="ANNO" big={String(Math.round(countValue(f, 24, 1985, 1997)))} w={160} c="#2C3E50" />
							<Actor abs={abs} outfit={EXTRAS[0]} view="3q" mirror x={1500} y={FEET} expression="panic" marks={['sweat']} />
						</g>
					)}
					{mode === 'next' && (
						<g>
							<Actor abs={abs} outfit={JOBS} view="3q" x={560} y={FEET} expression="happy" />
							<g transform={`translate(${lerp(2300, 1100, easeOut(clamp(f / 6)))},${FEET - 160}) rotate(-8)`}>
								<rect x={-130} y={-130} width={260} height={260} fill="#141414" {...O} />
								<text x={0} y={16} textAnchor="middle" fontFamily={CAPS} fontSize={64} fill="#F4F1EA">
									NeXT
								</text>
							</g>
							<g transform={`translate(1100,${FEET - 340})`}>
								<rect x={-110} y={-30} width={220} height={56} rx={6} fill="#F2C744" {...O} strokeWidth={3} />
								<text x={0} y={10} textAnchor="middle" fontFamily={CAPS} fontSize={30} fill={INK}>
									$429 MLN
								</text>
							</g>
						</g>
					)}
					{mode === 'interim' && (
						<g>
							<Actor abs={abs} outfit={JOBS} view="front" x={960} y={FEET} expression="neutral" />
							<Slam f={f} at={p.slamAt ?? 10} x={960} y={FEET - 520} text="CEO AD INTERIM" rot={-4} size={62} color={PALETTE.accentBody} />
						</g>
					)}
				</Layer>
			</Scene>
			{p.stamp && <StampTag f={f - 2} text={p.stamp} x={1660} />}
		</Wrap>
	);
};

// Disney 2022: successor leaves, Iger returns
T.disney = ({f, len, abs, p}) => {
	const c = cam(f, len, {x: 960, y: 540, zoom: 1.05}, {x: 960, y: 560, zoom: 1.2});
	const out = clamp(f / (p.backAt ?? len));
	const iger = p.backAt !== undefined ? clamp((f - p.backAt) / 30) : 0;
	return (
		<Wrap g="night">
			<Scene cam={c} bg="#2A2A5A">
				<CastleBack f={abs} />
				<Layer>
					<Actor abs={abs} outfit={EXTRAS[2]} view="side" mirror x={lerp(960, 200, out)} y={FEET} pose="walking" walkPhase={abs / 3.2} expression="sad" />
					{iger > 0 && <Actor abs={abs} outfit={IGER} view="front" x={960} y={lerp(FEET - 40, FEET + 40, iger)} scale={lerp(0.7, 1, iger)} expression="happy" />}
				</Layer>
			</Scene>
			{p.stamp && <StampTag f={f - 2} text={p.stamp} x={1660} />}
		</Wrap>
	);
};

// The bill that arrives years later (Denny's waitress unrolls a long bill)
T.bill = ({f, len, abs}) => {
	const c = cam(f, len, {x: 960, y: 540, zoom: 1.1}, {x: 960, y: 600, zoom: 1.3});
	const roll = easeOut(clamp((f - 8) / 30));
	return (
		<Wrap g="diner">
			<Scene cam={c} bg="#C98F5A">
				<DennysBack f={abs} />
				<Layer>
					<Booth y={FEET + 130} cups={0} />
					<Actor abs={abs} outfit={WAITRESS} view="3q" x={720} y={FEET} expression="deadpan" pose="holding" held={<rect x={-30} y={-10} width={60} height={20} fill="#F4F1EA" stroke={INK} strokeWidth={2} />} />
					<rect x={690} y={FEET - 160} width={80} height={420 * roll} fill="#FBFAF5" {...O} strokeWidth={3} />
					{Array.from({length: Math.floor(roll * 10)}).map((_, i) => (
						<path key={i} d={`M 700 ${FEET - 130 + i * 40} L 760 ${FEET - 130 + i * 40}`} stroke="#999" strokeWidth={4} />
					))}
					<text x={730} y={FEET - 180} textAnchor="middle" fontFamily={CAPS} fontSize={34} fill={INK}>
						IL CONTO
					</text>
					<HeroJacket x={1300} y={FEET + 40} scale={0.6} rope={false} glow={0.7} />
				</Layer>
			</Scene>
		</Wrap>
	);
};

// Map USA -> Italy
T.map = ({f, len, p}) => {
	const routeT = easeInOut0(clamp((f - 6) / 30));
	const c = {x: lerp(600, 1300, routeT), y: 420, zoom: 1.2 + 0.2 * routeT};
	return (
		<Wrap g="none">
			<Scene cam={camAt(f, len, c, c, {kind: 'still'})} bg="#BFD8E8">
				<Layer>
					<MapUsItaly f={f} routeT={routeT} pinT={easeOut(clamp((f - (p.pinAt ?? 36)) / 7))} />
				</Layer>
			</Scene>
		</Wrap>
	);
};
const easeInOut0 = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Marco at home with the ETF app
T.marco = ({f, len, abs, p}) => {
	const mode = p.mode ?? 'phone';
	const c = mode === 'phone' ? cam(f, len, {x: 960, y: 540, zoom: 1.2}, {x: 1000, y: 470, zoom: 1.45}) : cam(f, len, {x: 960, y: 540, zoom: 1.0}, {x: 960, y: 540, zoom: 1.1});
	return (
		<Wrap g="none">
			<Scene cam={c} bg="#E8D8C0">
				<Home abs={abs} />
				<Layer>
					<Actor abs={abs} outfit={MARCO} view="front" x={960} y={FEET} pose="holding" expression={p.expr ?? 'neutral'} held={<g><rect x={-26} y={-44} width={52} height={84} rx={8} fill="#222" stroke={INK} strokeWidth={3} /><rect x={-20} y={-36} width={40} height={64} fill={PALETTE.accent} /><text x={0} y={2} textAnchor="middle" fontFamily={CAPS} fontSize={11} fill={INK}>ETF</text></g>} />
					<g transform={`translate(1400,${FEET - 520})`}>
						<rect x={-150} y={-50} width={300} height={80} rx={10} fill="#F4F1EA" {...O} strokeWidth={3} />
						<text x={0} y={4} textAnchor="middle" fontFamily={CAPS} fontSize={34} fill={INK}>
							ETF S&P 500
						</text>
					</g>
				</Layer>
			</Scene>
			{p.strip && <CornerStrip f={f - 6} text={p.strip} hold={60} />}
		</Wrap>
	);
};

// 500 buildings skyline growing (S&P 500)
T.skyline = ({f, len}) => {
	const r = rng(11);
	const bs = Array.from({length: 60}).map((_, i) => [i * 34 + 10, 120 + r() * 380, r()]);
	const c = cam(f, len, {x: 960, y: 560, zoom: 1.0}, {x: 960, y: 520, zoom: 1.1});
	return (
		<Wrap g="day">
			<Scene cam={c} bg="#BFD8E0">
				<Layer>
					<rect x={-300} y={-300} width={2600} height={1500} fill="#BFD8E0" />
					{bs.map(([x, h, k], i) => {
						const g = easeOut(clamp((f - k * 30) / 10));
						const nv = i === 31;
						return <rect key={i} x={x} y={900 - h * g} width={30} height={h * g} fill={nv ? PALETTE.accentBody : i % 3 ? '#8FA3AE' : '#6E8594'} stroke={INK} strokeWidth={2.5} />;
					})}
					<rect x={-300} y={900} width={2600} height={400} fill="#5E6A6E" />
					<Sign x={960} y={980} text="500 AZIENDE USA" w={480} bg="#C9A94A" fg={INK} size={40} />
					{f > 40 && <circle cx={31 * 34 + 25} cy={600} r={90} fill={PALETTE.accent} opacity={0.35} />}
				</Layer>
			</Scene>
		</Wrap>
	);
};

// Pizza slice glowing (a piece of Nvidia)
T.pizza = ({f, len}) => {
	const c = cam(f, len, {x: 960, y: 540, zoom: 1.0}, {x: 960, y: 520, zoom: 1.15}, {kind: 'settle'});
	const pull = easeOut(clamp((f - 8) / 14));
	return (
		<Wrap g="none">
			<Scene cam={c} bg="#7A4E2E">
				<Layer>
					<Patterned x={-300} y={-300} w={2600} h={1700} fill="#B53A2A" pattern="checker" cell={120} />
					<g transform="translate(900,560)">
						<circle r={330} fill="#E8C070" {...O} />
						<circle r={290} fill="#D84A2A" />
						{Array.from({length: 8}).map((_, i) => (
							<path key={i} d={`M 0 0 L ${Math.cos((i * Math.PI) / 4) * 330} ${Math.sin((i * Math.PI) / 4) * 330}`} stroke={INK} strokeWidth={3} />
						))}
					</g>
					<g transform={`translate(${900 + pull * 220},${560 - pull * 120})`}>
						<path d="M 0 0 L 330 0 A 330 330 0 0 1 233 233 Z" fill={PALETTE.accentBody} {...O} />
						<circle cx={160} cy={60} r={160} fill={PALETTE.accent} opacity={0.3 * pull} />
						<text x={190} y={90} textAnchor="middle" fontFamily={CAPS} fontSize={40} fill="#F4F1EA">
							NVIDIA
						</text>
					</g>
				</Layer>
			</Scene>
		</Wrap>
	);
};

// 100 coins, 6 turn green
T.coins = ({f, len}) => {
	const c = cam(f, len, {x: 960, y: 520, zoom: 1.0}, {x: 960, y: 520, zoom: 1.08});
	const flips = [14, 24, 29, 32, 35, 37];
	return (
		<Wrap g="none">
			<Scene cam={c} bg="#2C3E50">
				<Layer>
					<Patterned x={-300} y={-300} w={2600} h={1700} fill="#2C3E50" pattern="panels" cell={90} />
					{Array.from({length: 100}).map((_, i) => {
						const x = 510 + (i % 10) * 100;
						const y = 110 + Math.floor(i / 10) * 86;
						const k = [42, 43, 44, 52, 53, 54].indexOf(i);
						const green = k >= 0 && f >= flips[k];
						return (
							<g key={i} transform={`translate(${x},${y})`}>
								<circle r={36} fill={green ? PALETTE.accent : '#C9A94A'} stroke={INK} strokeWidth={3.5} />
								<text x={0} y={12} textAnchor="middle" fontFamily={CAPS} fontSize={30} fill={INK}>
									€
								</text>
							</g>
						);
					})}
					<g transform="translate(1600,540)">
						<rect x={-150} y={-60} width={300} height={110} rx={10} fill="#1B222B" {...O} />
						<text x={0} y={22} textAnchor="middle" fontFamily={CAPS} fontSize={60} fill={PALETTE.accent}>
							{flips.filter((t) => f >= t).length} / 100
						</text>
					</g>
				</Layer>
			</Scene>
		</Wrap>
	);
};

// Kress at a podium (hero low angle) / Jones / search door
T.people = ({f, len, abs, p}) => {
	const mode = p.mode;
	const c = mode === 'search' ? cam(f, len, {x: 960, y: 540, zoom: 1.05}, {x: 960, y: 540, zoom: 1.15}) : cam(f, len, {x: 960, y: 600, zoom: 1.5}, {x: 960, y: 580, zoom: 1.62}, {kind: 'settle'});
	return (
		<Wrap g={mode === 'search' ? 'day' : 'night'}>
			<Scene cam={c} bg="#0A0C18">
				{mode === 'search' ? <OfficeBack f={abs} board={<text x={980} y={480} textAnchor="middle" fontFamily={CAPS} fontSize={80} fill={PALETTE.accent}>CEO ?</text>} /> : <StageBack f={abs} />}
				<Layer>
					{mode === 'kress' && (
						<>
							<LightDisc cx={960} cy={520} r={300} o={0.3} />
							<Actor abs={abs} outfit={KRESS} view="front" x={960} y={FEET} expression="neutral" pose="talking" gestureT={0.5} />
							<rect x={860} y={FEET - 200} width={200} height={200} fill="#2C3E50" {...O} />
							<rect x={840} y={FEET - 220} width={240} height={30} fill="#3E5568" {...O} />
						</>
					)}
					{mode === 'jones' && (
						<>
							<LightDisc cx={960} cy={520} r={300} o={0.3} />
							<Actor abs={abs} outfit={JONES} view="3q" x={900} y={FEET} expression="neutral" />
							<g transform={`translate(1300,${FEET - 300})`}>
								<rect x={-130} y={-80} width={260} height={160} rx={8} fill="#C9A94A" {...O} />
								<text x={0} y={-10} textAnchor="middle" fontFamily={CAPS} fontSize={60} fill={INK}>
									{Math.round(countValue(f - (p.countAt ?? 30), 24, 0, 30))}+
								</text>
								<text x={0} y={50} textAnchor="middle" fontFamily={CAPS} fontSize={34} fill={INK}>
									ANNI
								</text>
							</g>
						</>
					)}
					{mode === 'search' && (
						<>
							<rect x={1560} y={300} width={230} height={390} fill="#FFF6D8" {...O} />
							<path d="M 1560 300 L 1690 320 L 1690 670 L 1560 690 Z" fill="#6E4726" {...O} />
							<Sign x={1675} y={250} text="CERCASI CEO" w={300} bg={PALETTE.red} size={34} />
							<Sign x={1300} y={420} text="← DENTRO" w={220} bg="#2C3E50" size={28} />
							<Sign x={1900} y={420} text="FUORI →" w={200} bg="#2C3E50" size={28} />
							{[0, 1, 2, 3].map((i) => (
								<Actor key={i} abs={abs + i * 11} outfit={[RAY, EXTRAS[1], EXTRAS[2], DANA][i]} view="side" x={lerp(-200, 520 + i * 200, easeOut(clamp((f - i * 6) / 20)))} y={FEET} pose={f - i * 6 < 20 ? 'walking' : 'idle'} walkPhase={abs / 3.2} expression="neutral" />
							))}
						</>
					)}
				</Layer>
			</Scene>
			{p.plate && (
				<svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
					<NamePlate x={960} y={110} text={p.plate} f={f - 4} />
				</svg>
			)}
			{p.strip && <CornerStrip f={f - 20} text={p.strip} hold={60} corner="tr" />}
		</Wrap>
	);
};

// Engine running by itself; optional price tag drop
T.engine = ({f, len, abs, p}) => {
	const c = cam(f, len, {x: 960, y: 540, zoom: 1.05}, {x: 960, y: 540, zoom: 1.15});
	const sp = p.slow ? Math.max(0.2, 1 - f / 40) : 1;
	const a = abs * 3 * sp;
	const tag = p.tagAt !== undefined ? easeIn(clamp((f - p.tagAt) / 7)) : 0;
	return (
		<Wrap g="tech">
			<Scene cam={c} bg="#1E2A30">
				<Layer>
					<Patterned x={-300} y={-300} w={2600} h={1700} fill="#24323A" pattern="brick" cell={110} />
					<LightDisc cx={960} cy={500} r={600} o={0.2} />
					<Gear x={760} y={500} r={180} a={a} c={PALETTE.accentBody} />
					<Gear x={1080} y={360} r={120} a={-a * 1.5 + 10} />
					<Gear x={1120} y={680} r={140} a={-a * 1.28} c="#8A8F84" />
					<g transform="translate(760,500)">
						<text x={0} y={14} textAnchor="middle" fontFamily={CAPS} fontSize={40} fill="#F4F1EA">
							NVIDIA
						</text>
					</g>
					{tag > 0 && (
						<g transform={`translate(1400,${lerp(-200, 500, tag)}) rotate(${12 * Math.cos(f / 3) * Math.exp(-(f - (p.tagAt ?? 0)) / 20)})`}>
							<path d="M 0 -140 L 0 -60" stroke={INK} strokeWidth={4} />
							<path d="M -110 -60 L 80 -60 L 130 0 L 80 60 L -110 60 Z" fill="#F2C744" {...O} />
							<circle cx={90} cy={0} r={10} fill="#fff" stroke={INK} strokeWidth={3} />
							<text x={-20} y={14} textAnchor="middle" fontFamily={CAPS} fontSize={40} fill={INK}>
								PREZZO
							</text>
						</g>
					)}
				</Layer>
			</Scene>
		</Wrap>
	);
};

// Map with China export stop
T.china = ({f, len, p}) => {
	const c = cam(f, len, {x: 900, y: 540, zoom: 1.05}, {x: 900, y: 560, zoom: 1.2});
	return (
		<Wrap g="none">
			<Scene cam={c} bg="#14202E">
				<Layer>
					<MapChina f={f} stopT={easeOut(clamp((f - (p.stopAt ?? 20)) / 6))} />
				</Layer>
			</Scene>
		</Wrap>
	);
};

// Washington rulebook slam
T.rules = ({f, len, p}) => {
	const c = cam(f, len, {x: 960, y: 540, zoom: 1.0}, {x: 960, y: 520, zoom: 1.12});
	const d = easeIn(clamp((f - (p.at ?? 10)) / 7));
	return (
		<Wrap g="day">
			<Scene cam={c} bg="#BFD8E0">
				<Layer p={0.7}>
					<rect x={-400} y={-300} width={2700} height={1600} fill="#BFD8E0" />
					<g transform="translate(960,620)">
						<rect x={-420} y={-60} width={840} height={60} fill="#E8E2D4" {...O} />
						{Array.from({length: 9}).map((_, i) => (
							<rect key={i} x={-380 + i * 95} y={-260} width={30} height={200} fill="#F4F1EA" {...O} strokeWidth={3} />
						))}
						<rect x={-400} y={-290} width={800} height={40} fill="#E8E2D4" {...O} />
						<path d="M -220 -290 Q -220 -520 0 -540 Q 220 -520 220 -290 Z" fill="#F4F1EA" {...O} />
						<rect x={-10} y={-600} width={20} height={70} fill="#F4F1EA" {...O} strokeWidth={3} />
					</g>
					<Sign x={960} y={720} text="WASHINGTON" w={420} bg="#2C3E50" size={36} />
				</Layer>
				<Layer>
					{f >= (p.at ?? 10) && (
						<g transform={`translate(1450,${lerp(-300, 640, d)}) rotate(-10)`}>
							<rect x={-170} y={-220} width={340} height={440} rx={10} fill="#7A2E3A" {...O} />
							<rect x={-150} y={-200} width={20} height={400} fill="#5E202C" />
							<text x={10} y={-80} textAnchor="middle" fontFamily={CAPS} fontSize={48} fill="#F4F1EA">
								REGOLE
							</text>
							<text x={10} y={-20} textAnchor="middle" fontFamily={CAPS} fontSize={30} fill="#F2C744">
								CHIP IA
							</text>
							<text x={10} y={30} textAnchor="middle" fontFamily={CAPS} fontSize={26} fill="#F4F1EA">
								ACCESSO REMOTO
							</text>
						</g>
					)}
					{f >= (p.at ?? 10) + 7 && f < (p.at ?? 10) + 15 && [-1, 0, 1].map((k) => <circle key={k} cx={1450 + k * 160 * (1 + (f - (p.at ?? 10) - 7) / 8)} cy={860} r={30} fill="#E8E2D4" opacity={1 - (f - (p.at ?? 10) - 7) / 9} />)}
				</Layer>
			</Scene>
		</Wrap>
	);
};

// Mousetrap with the golden numbers
T.trap = ({f, len, p}) => {
	const c = cam(f, len, {x: 1000, y: 690, zoom: 1.9}, {x: 1060, y: 700, zoom: 2.1});
	return (
		<Wrap g="night">
			<Scene cam={c} bg="#1B1D26">
				<Layer p={0.8}>
					<Patterned x={-300} y={-300} w={2600} h={1700} fill="#26304A" pattern="planks" cell={90} />
				</Layer>
				<Layer>
					<LightDisc cx={1060} cy={640} r={400} color="#F2C744" o={0.3} />
					<Mousetrap x={960} y={760} snapT={p.snapAt !== undefined && f >= p.snapAt ? 1 : 0} />
				</Layer>
			</Scene>
		</Wrap>
	);
};

// Autopilot car on the road
T.car = ({f, len, abs, p}) => {
	const mode = p.mode ?? 'wide';
	const c = mode === 'wide' ? cam(f, len, {x: 960, y: 520, zoom: 1.0}, {x: 960, y: 520, zoom: 1.05}) : mode === 'curve' ? cam(f, len, {x: 1100, y: 520, zoom: 1.0}, {x: 1300, y: 520, zoom: 0.95}) : cam(f, len, {x: p.who === 'A' ? 640 : 760, y: 660, zoom: 3.0}, {x: p.who === 'A' ? 640 : 760, y: 660, zoom: 3.0}, {kind: 'still'});
	const line = LINES[p.line];
	const talk: [number, number] = [line.startFrame, line.endFrame];
	return (
		<Wrap g="triumph">
			<Scene cam={c} bg="#F0B789">
				<RoadBack f={abs} curve={mode === 'curve' ? clamp(f / 30) : 0} />
				<Layer>
					<Car x={900} y={FEET + 60} f={abs}>
						<g>
							<Actor abs={abs} outfit={RAY} view="3q" x={-265} y={0} scale={0.5} talk={p.who === 'A' ? talk : undefined} expression={mode === 'curve' ? 'panic' : 'concerned'} shadow={0} />
							<Actor abs={abs} outfit={DANA} view="3q" mirror x={-135} y={0} scale={0.5} talk={p.who === 'B' ? talk : undefined} expression={mode === 'curve' ? 'surprised' : 'deadpan'} shadow={0} />
						</g>
					</Car>
				</Layer>
			</Scene>
		</Wrap>
	);
};

export const TEMPLATES = T;
export {fmtIt};
