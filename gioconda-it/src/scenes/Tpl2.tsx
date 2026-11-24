import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Cam, camAt, Layer, Move, Scene} from '../camera/Camera';
import {CharacterProps} from '../rig/Character';
import * as OUT from '../rig/outfits';
import {INK, Outfit, PALETTE} from '../rig/outfits';
import {FourHooks, Painting, Trunk} from '../props/Gioconda';
import {CornerStrip, countValue, StampTag, TitleOverlay} from '../ui/Cards';
import {CAPS, HAND} from '../ui/Fonts';
import {clamp, easeIn, easeOut, lerp, LINES, rng} from '../lib';
import {OfficeBack} from '../sets/Sets';
import {AmboiseBack, ApollonBack, ArchiveBack, CourtBack, FLOOR, HotelBack, ModernRoomBack, ParisBack, RoomBack, SalonBack, ShopBack, TicketBack, UffiziBack, VillageBack, WorkshopBack} from '../sets/Sets3';
import {LightDisc, OUTLINE as O, Patterned, Sign} from '../sets/prims';
import {Actor, TEMPLATES, TP, Wrap} from './Tpl';

export const FEET = FLOOR + 70;
const CAST: Record<string, Outfit> = {
	P: OUT.PERUGGIA,
	PS: OUT.PERUGGIA_SMOCK,
	G: OUT.GUARD,
	B: OUT.BEROUD,
	AP: OUT.APOLLINAIRE,
	PI: OUT.PICASSO,
	I: OUT.INSPECTOR,
	GE: OUT.GERI,
	PO: OUT.POGGI,
	J: OUT.JUDGE,
	L: OUT.LEONARDO,
	F: OUT.FRANCIS,
	V: OUT.VALFIERNO,
	T: OUT.THIEF,
	TO: OUT.TOURIST,
	D: OUT.DANA,
	R: OUT.RAY,
	M: OUT.MARCO,
	V1: OUT.EXTRAS[0],
	V2: OUT.EXTRAS[4],
	V3: OUT.EXTRAS[2],
	V4: OUT.EXTRAS[3],
	V5: OUT.EXTRAS[1],
};

// ---------------- set picker ----------------
const SETS: Record<string, {bg: string; g: string; C: React.FC<{f: number; st?: any}>}> = {
	salon: {bg: '#7A2E2E', g: 'sepia', C: ({f, st}) => <SalonBack f={f} state={st?.state ?? 'glass'} crowd={st?.crowd ?? 0} glow={st?.glow ?? 0} />},
	salonNight: {bg: '#3A2226', g: 'night', C: ({f, st}) => <SalonBack f={f} night state={st?.state ?? 'glass'} />},
	paris: {bg: '#C9D8E0', g: 'sepia', C: ({f}) => <ParisBack f={f} />},
	parisNight: {bg: '#1A2751', g: 'night', C: ({f}) => <ParisBack f={f} night />},
	room: {bg: '#B8A88A', g: 'sepia', C: ({f, st}) => <RoomBack f={f} trunkOpen={st?.open ?? 0} reveal={st?.reveal ?? 0} />},
	roomNight: {bg: '#4A4038', g: 'night', C: ({f, st}) => <RoomBack f={f} night trunkOpen={st?.open ?? 0} reveal={st?.reveal ?? 0} />},
	archive: {bg: '#5A5A4A', g: 'sepia', C: ({f}) => <ArchiveBack f={f} />},
	village: {bg: '#BFD8E8', g: 'day', C: ({f}) => <VillageBack f={f} />},
	workshop: {bg: '#9C8E78', g: 'sepia', C: ({f}) => <WorkshopBack f={f} />},
	hotel: {bg: '#C9A06A', g: 'sepia', C: ({f}) => <HotelBack f={f} />},
	shop: {bg: '#6E4726', g: 'sepia', C: ({f}) => <ShopBack f={f} />},
	uffizi: {bg: '#E8E1D3', g: 'sepia', C: ({f}) => <UffiziBack f={f} />},
	court: {bg: '#5A4A38', g: 'sepia', C: ({f}) => <CourtBack f={f} />},
	amboise: {bg: '#9C8E78', g: 'sepia', C: ({f}) => <AmboiseBack f={f} />},
	apollon: {bg: '#2A2218', g: 'night', C: ({f, st}) => <ApollonBack f={f} broken={st?.broken ?? 0} lift={st?.lift ?? 0} />},
	ticket: {bg: '#BFD8E8', g: 'day', C: ({f}) => <TicketBack f={f} />},
	modern: {bg: '#2C3E50', g: 'night', C: ({f, st}) => <ModernRoomBack f={f} crowd={st?.crowd ?? 1} />},
	office: {bg: '#C9C3AE', g: 'day', C: ({f}) => <OfficeBack f={f} board={<text x={980} y={480} textAnchor="middle" fontFamily={CAPS} fontSize={80} fill={PALETTE.accent}>LOUVRE 2025</text>} />},
	home: {bg: '#E8D8C0', g: 'none', C: ({f}) => <OfficeBack f={f} board={<text x={980} y={480} textAnchor="middle" fontFamily={CAPS} fontSize={80} fill={PALETTE.accent}>€22 / €32</text>} />},
};

// ---------------- props ----------------
const Prop: React.FC<{k: string; x: number; y: number; s?: number; f: number; p?: any}> = ({k, x, y, s = 1, f, p = {}}) => {
	switch (k) {
		case 'painting':
			return <Painting x={x} y={y} s={s} frame={p.frame ?? true} glass={p.glass} glow={p.glow ?? 0} />;
		case 'hooks':
			return <FourHooks x={x} y={y} s={s} glow={p.glow ?? 0} />;
		case 'trunk':
			return <Trunk x={x} y={y} s={s} open={p.open ?? 0} reveal={p.reveal ?? 0} />;
		case 'glass':
			return (
				<g transform={`translate(${x},${y}) scale(${s})`}>
					<rect x={-120} y={-160} width={240} height={320} fill="#CFE3EA" opacity={0.45} stroke={INK} strokeWidth={4} />
					<path d="M -90 -120 L -40 -160 M -60 -100 L -10 -150" stroke="#fff" strokeWidth={6} opacity={0.7} />
				</g>
			);
		case 'frameEmpty':
			return (
				<g transform={`translate(${x},${y}) scale(${s}) rotate(${p.rot ?? 0})`}>
					<rect x={-106} y={-142} width={212} height={284} fill="none" stroke="#A8822E" strokeWidth={26} />
					<rect x={-106} y={-142} width={212} height={284} fill="none" stroke={INK} strokeWidth={3} />
				</g>
			);
		case 'letter':
			return (
				<g transform={`translate(${x},${y}) scale(${s}) rotate(-4)`}>
					<rect x={-140} y={-100} width={280} height={200} fill="#F4ECD8" {...O} />
					{[0, 1, 2, 3].map((i) => (
						<path key={i} d={`M -110 ${-60 + i * 30} L 110 ${-60 + i * 30}`} stroke="#8A7A6A" strokeWidth={4} />
					))}
					<text x={60} y={80} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={36} fill="#3A2A20">
						Leonardo
					</text>
				</g>
			);
		case 'crown':
			return (
				<g transform={`translate(${x},${y}) scale(${s}) rotate(${p.rot ?? 0})`}>
					<path d="M -80 40 L -80 -30 L -40 0 L 0 -60 L 40 0 L 80 -30 L 80 40 Z" fill="#F2C744" {...O} />
					{[-50, 0, 50].map((cx) => (
						<circle key={cx} cx={cx} cy={20} r={10} fill={cx ? '#2E8B57' : PALETTE.red} stroke={INK} strokeWidth={2} />
					))}
					{p.broken && <path d="M -20 -20 L 0 10 L -10 40" stroke={INK} strokeWidth={4} fill="none" />}
				</g>
			);
		case 'sign':
			return <Sign x={x} y={y} text={p.text} w={p.w ?? 300} bg={p.bg ?? '#2C3E50'} fg={p.fg} size={p.size ?? 34} />;
		case 'table':
			return (
				<g>
					<rect x={x - 220} y={y - 160} width={440} height={26} fill="#6E4726" {...O} />
					<path d={`M ${x - 190} ${y - 134} L ${x - 190} ${y} M ${x + 190} ${y - 134} L ${x + 190} ${y}`} stroke={INK} strokeWidth={10} />
				</g>
			);
	}
	return null;
};

// ---------------- generic scene ----------------
type ActorSpec = {o: string; x: number; y?: number; s?: number; v?: any; m?: boolean; e?: any; pose?: any; talk?: number; walk?: [number, number]; held?: string; marks?: any[]};
const heldEl = (h?: string) => (h === 'painting' ? <Painting s={0.55} frame={false} /> : h === 'letter' ? <g transform="scale(0.5)"><Prop k="letter" x={0} y={0} f={0} /></g> : h === 'phone' ? <g><rect x={-26} y={-44} width={52} height={84} rx={8} fill="#222" stroke={INK} strokeWidth={3} /><rect x={-20} y={-36} width={40} height={64} fill="#9FD3F0" /></g> : undefined);

const ActorFromSpec: React.FC<{a: ActorSpec; f: number; len: number; abs: number}> = ({a, f, len, abs}) => {
	const line = a.talk !== undefined ? LINES[a.talk] : null;
	const x = a.walk ? lerp(a.walk[0], a.walk[1], clamp(f / len)) : a.x;
	return (
		<Actor
			abs={abs}
			outfit={CAST[a.o]}
			x={x}
			y={(a.y ?? 0) + FEET}
			scale={a.s ?? 1}
			view={a.walk ? 'side' : a.v}
			mirror={a.walk ? a.walk[1] < a.walk[0] : a.m}
			expression={a.e ?? 'neutral'}
			pose={a.walk ? 'walking' : a.pose}
			walkPhase={abs / 3.2}
			held={heldEl(a.held)}
			marks={a.marks}
			talk={line ? [line.startFrame, line.endFrame] : undefined}
		/>
	);
};

const T2: Record<string, React.FC<TP>> = {};

T2.scene = ({f, len, abs, p}) => {
	const S = SETS[p.set];
	const c0: Cam = {x: p.cam?.[0] ?? 960, y: p.cam?.[1] ?? 540, zoom: p.cam?.[2] ?? 1.2};
	const c1: Cam = p.cam2 ? {x: p.cam2[0], y: p.cam2[1], zoom: p.cam2[2]} : {...c0, zoom: c0.zoom * 1.1};
	const mv: Move = p.mv === 'settle' ? {kind: 'settle'} : p.mv === 'still' ? {kind: 'still'} : p.mv === 'punch' ? {kind: 'punch', at: p.pAt ?? len - 10} : {kind: 'creep'};
	const c = camAt(f, len, c0, c1, mv);
	return (
		<Wrap g={p.g ?? S.g}>
			<Scene cam={c} bg={S.bg}>
				<S.C f={abs} st={p.st} />
				<Layer>
					{(p.props ?? []).map((pr: any, i: number) => (
						<Prop key={i} k={pr.k} x={pr.x} y={pr.y} s={pr.s} f={f} p={pr} />
					))}
					{(p.A ?? []).map((a: ActorSpec, i: number) => (
						<ActorFromSpec key={i} a={a} f={f} len={len} abs={abs} />
					))}
				</Layer>
			</Scene>
			{p.stamp && <StampTag f={f - 3} text={p.stamp} x={p.stampX ?? 1660} />}
			{p.strip && <CornerStrip f={f - 10} text={p.strip} hold={p.stripHold ?? 60} corner={p.corner ?? 'tl'} />}
			{p.slam && (
				<svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
					<Slam f={f} at={p.slamAt ?? 6} x={p.slamX ?? 960} y={p.slamY ?? 200} text={p.slam} rot={-5} size={p.slamSize ?? 70} color={p.slamColor ?? PALETTE.red} />
				</svg>
			)}
			{p.title && <TitleOverlay f={f} lines={[{t: "L'ITALIANO CHE"}, {t: 'RUBÒ LA GIOCONDA', accent: true}, {t: 'DAL LOUVRE'}]} />}
		</Wrap>
	);
};

// Skit in any set: A asks, B answers. frame: otsA | otsB | two | closeA | closeB
T2.skit = ({f, len, abs, p}) => {
	const S = SETS[p.set];
	let c: Cam;
	let a: any;
	let b: any;
	switch (p.frame) {
		case 'otsA':
			c = {x: 1060, y: 470, zoom: 1.55};
			b = {v: 'back', x: 700, y: 220, s: 1.55};
			a = {v: '3q', m: true, x: 1220, y: 0};
			break;
		case 'otsB':
			c = {x: 860, y: 470, zoom: 1.55};
			a = {v: 'back', x: 1230, y: 220, s: 1.55};
			b = {v: '3q', x: 700, y: 0};
			break;
		case 'two':
			c = {x: 960, y: 500, zoom: 1.45};
			a = {v: 'side', m: true, x: 1150, y: 0};
			b = {v: 'side', x: 770, y: 0};
			break;
		case 'closeA':
			c = {x: 1160, y: 410, zoom: 2.7};
			a = {v: '3q', m: true, x: 1160, y: 0};
			b = {v: 'side', x: 520, y: 0};
			break;
		default:
			c = {x: 760, y: 410, zoom: 2.7};
			b = {v: '3q', x: 760, y: 0};
			a = {v: 'side', m: true, x: 1400, y: 0};
	}
	const cc = camAt(f, len, c, c, {kind: 'still'});
	const tl = (id?: number) => (id !== undefined ? id : undefined);
	const specA: ActorSpec = {o: p.A, ...a, e: p.eA ?? 'concerned', talk: tl(p.who === 'A' ? p.line : p.also?.who === 'A' ? p.also.line : undefined), marks: p.mA, held: p.hA};
	const specB: ActorSpec = {o: p.B, ...b, e: p.eB ?? 'deadpan', talk: tl(p.who === 'B' ? p.line : p.also?.who === 'B' ? p.also.line : undefined), marks: p.mB, held: p.hB};
	const els = [<ActorFromSpec key="a" a={specA} f={f} len={len} abs={abs} />, <ActorFromSpec key="b" a={specB} f={f} len={len} abs={abs} />];
	return (
		<Wrap g={p.g ?? S.g}>
			<Scene cam={cc} bg={S.bg}>
				<S.C f={abs} st={p.st} />
				<Layer>{p.frame === 'otsA' ? els : [els[1], els[0]]}</Layer>
			</Scene>
		</Wrap>
	);
};

// ---------------- inserts ----------------
const Panel2: React.FC<{children: React.ReactNode; bg?: string; pattern?: any; g?: string; cam?: Cam; cam2?: Cam; f: number; len: number}> = ({children, bg = '#2C3E50', pattern = 'panels', g = 'none', cam, cam2, f, len}) => {
	const c0 = cam ?? {x: 960, y: 540, zoom: 1.0};
	const c = camAt(f, len, c0, cam2 ?? {...c0, zoom: c0.zoom * 1.1}, {kind: 'creep'});
	return (
		<Wrap g={g}>
			<Scene cam={c} bg={bg}>
				<Layer p={0.8}>
					<Patterned x={-400} y={-400} w={2800} h={1900} fill={bg} pattern={pattern} cell={90} />
					<LightDisc cx={960} cy={500} r={620} o={0.3} />
				</Layer>
				<Layer>{children}</Layer>
			</Scene>
		</Wrap>
	);
};
const Slam: React.FC<{f: number; at: number; x: number; y: number; text: string; rot?: number; size?: number; color?: string}> = ({f, at, x, y, text, rot = -7, size = 90, color = PALETTE.red}) => {
	const st = f - at;
	if (st < 0) return null;
	const w = text.length * size * 0.62 + 60;
	return (
		<g transform={`translate(${x},${y}) rotate(${rot}) scale(${st < 6 ? lerp(1.7, 1, easeOut(st / 6)) : 1})`}>
			<rect x={-w / 2} y={-size * 0.7} width={w} height={size * 1.3} rx={10} fill="rgba(244,241,234,0.85)" stroke={color} strokeWidth={10} />
			<text x={0} y={size * 0.33} textAnchor="middle" fontFamily={CAPS} fontSize={size} fill={color}>
				{text}
			</text>
		</g>
	);
};
const Counter: React.FC<{x: number; y: number; v: string; label?: string; w?: number}> = ({x, y, v, label, w = 520}) => (
	<g transform={`translate(${x},${y})`}>
		<rect x={-w / 2} y={-70} width={w} height={130} rx={12} fill="#1B222B" {...O} />
		<text x={0} y={30} textAnchor="middle" fontFamily={CAPS} fontSize={84} fill={PALETTE.accent}>
			{v}
		</text>
		{label && (
			<text x={0} y={110} textAnchor="middle" fontFamily={CAPS} fontSize={40} fill="#F4F1EA">
				{label}
			</text>
		)}
	</g>
);
const fmt = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

// one or two big counters (data as objects on a wall)
T2.counters = ({f, len, p}) => {
	const items: any[] = p.items;
	return (
		<Panel2 f={f} len={len} bg={p.bg ?? '#2C3E50'} pattern={p.pattern ?? 'panels'} g={p.g ?? 'none'}>
			{items.map((it, i) => {
				const v = f < it.at ? 0 : countValue(f - it.at, it.dur ?? 30, it.from ?? 0, it.to);
				const x = items.length === 1 ? 960 : 560 + i * 800;
				return <Counter key={i} x={x} y={480} v={(it.pre ?? '') + fmt(v) + (it.suf ?? '')} label={it.label} w={it.w ?? 600} />;
			})}
			{p.slam && <Slam f={f} at={p.slamAt} x={960} y={820} text={p.slam} rot={-4} size={70} color={p.slamColor ?? PALETTE.red} />}
		</Panel2>
	);
};

// threat letter 1910 / Peruggia's letter
T2.letter = ({f, len, p}) => {
	const n = Math.floor(clamp((f - 14) / 20) * (p.sign?.length ?? 0));
	return (
		<Panel2 f={f} len={len} bg="#6E4726" pattern="wood" g="sepia">
			<g transform="translate(960,520) rotate(-3)">
				<rect x={-420} y={-320} width={840} height={620} fill="#F4ECD8" {...O} />
				{p.lines?.map((t: string, i: number) => (
					<text key={i} x={-360} y={-220 + i * 80} fontFamily={HAND} fontWeight={700} fontSize={56} fill="#3A2A20">
						{t.slice(0, Math.max(0, Math.floor(clamp((f - 4 - i * 10) / 14) * t.length)))}
					</text>
				))}
				{p.sign && (
					<text x={200} y={240} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={70} fill="#3A2A20">
						{p.sign.slice(0, n)}
					</text>
				)}
			</g>
			{p.slam && <Slam f={f} at={p.slamAt} x={1380} y={860} text={p.slam} rot={-8} size={70} color={p.slamColor ?? PALETTE.red} />}
		</Panel2>
	);
};

// fingerprint on the glass, magnifier sweeps
T2.print = ({f, len, p}) => {
	const reveal = clamp(f / 30);
	const mx = 860 + Math.sin(f / 12) * 140;
	return (
		<Panel2 f={f} len={len} bg="#1E2A30" pattern="tiles" g="night">
			<rect x={560} y={140} width={800} height={800} fill="#CFE3EA" opacity={0.3} stroke="#E8F4F8" strokeWidth={8} />
			<g transform="translate(960,540)" opacity={reveal}>
				{Array.from({length: 11}).map((_, i) => (
					<ellipse key={i} cx={0} cy={i * 4} rx={30 + i * 22} ry={44 + i * 26} fill="none" stroke="#E8D8B0" strokeWidth={7} strokeDasharray={i % 3 ? '60 14' : '30 10'} />
				))}
			</g>
			{p.label && <Sign x={960} y={1000} text={p.label} w={460} bg="#C9A94A" fg={INK} size={36} />}
			<g transform={`translate(${mx},500)`}>
				<circle r={130} fill="#CFE3EA" opacity={0.25} stroke="#6E4726" strokeWidth={16} />
				<path d="M 90 90 L 220 220" stroke="#6E4726" strokeWidth={34} strokeLinecap="round" />
			</g>
			{p.slam && <Slam f={f} at={p.slamAt} x={1350} y={300} text={p.slam} rot={6} size={64} />}
		</Panel2>
	);
};

// phone book sorted by height (the analogy)
T2.phonebook = ({f, len, p}) => {
	const rows = ['1,58 m  ....  ?', '1,59 m  ....  ?', '1,60 m  ....  ?', '1,61 m  ....  ?', '1,62 m  ....  ?', '1,63 m  ....  ?', '1,64 m  ....  ?'];
	const scroll = f * 3;
	return (
		<Panel2 f={f} len={len} bg="#4A6B6E" pattern="stripes" g="none">
			<rect x={420} y={120} width={1080} height={840} rx={20} fill="#C33631" {...O} />
			<rect x={460} y={150} width={500} height={780} fill="#F4F1EA" {...O} strokeWidth={3} />
			<rect x={960} y={150} width={500} height={780} fill="#EFEAE0" {...O} strokeWidth={3} />
			<text x={710} y={220} textAnchor="middle" fontFamily={CAPS} fontSize={44} fill={INK}>
				ELENCO
			</text>
			<text x={1210} y={220} textAnchor="middle" fontFamily={CAPS} fontSize={36} fill={INK}>
				PER ALTEZZA
			</text>
			<svg x={460} y={260} width={1000} height={640} viewBox={`0 ${scroll % 120} 1000 640`} overflow="hidden">
				{Array.from({length: 24}).map((_, i) => (
					<text key={i} x={i % 2 ? 540 : 40} y={60 + Math.floor(i / 2) * 60} fontFamily={HAND} fontWeight={700} fontSize={46} fill="#3A2A20">
						{rows[Math.floor(i / 2) % rows.length]}
					</text>
				))}
			</svg>
			{p.slam && <Slam f={f} at={p.slamAt} x={960} y={540} text={p.slam} rot={-6} size={80} />}
		</Panel2>
	);
};

// map with route points (light style)
T2.map = ({f, len, p}) => {
	const pts: [number, number, string][] = p.pts;
	const segs = pts.length - 1;
	const t = clamp((f - 6) / (p.dur ?? 40)) * segs;
	const done = Math.floor(t);
	const cur = t - done;
	const path: string[] = [];
	for (let i = 0; i <= Math.min(done, segs - 1); i++) {
		const [x0, y0] = pts[i];
		const [x1, y1] = pts[i + 1];
		const k = i < done ? 1 : cur;
		const N = 20;
		for (let j = 0; j <= N; j++) {
			const u = (j / N) * k;
			path.push(`${lerp(x0, x1, u)},${lerp(y0, y1, u) - Math.sin(Math.PI * u) * 80}`);
		}
	}
	const head = done < segs ? [lerp(pts[done][0], pts[done + 1][0], cur), lerp(pts[done][1], pts[done + 1][1], cur)] : [pts[segs][0], pts[segs][1]];
	const c = camAt(f, len, {x: head[0] * 0.3 + 960 * 0.7, y: head[1] * 0.3 + 540 * 0.7, zoom: 1.15}, {x: head[0] * 0.3 + 960 * 0.7, y: head[1] * 0.3 + 540 * 0.7, zoom: 1.15}, {kind: 'still'});
	return (
		<Wrap g="none">
			<Scene cam={c} bg="#BFD8E8">
				<Layer>
					<rect x={-400} y={-400} width={2800} height={1900} fill="#BFD8E8" />
					{/* France + Italy (stylised) */}
					<path d="M 300 120 L 760 60 L 980 220 L 940 520 L 800 760 L 420 780 L 260 560 L 220 300 Z" fill="#E8DCC0" {...O} />
					<path d="M 980 260 L 1160 240 L 1240 330 L 1300 470 L 1420 600 L 1560 700 L 1600 760 L 1540 800 L 1480 760 L 1430 820 L 1380 790 L 1400 720 L 1320 640 L 1220 560 L 1120 470 L 1030 380 Z" fill="#2E8B57" {...O} />
					<text x={560} y={420} textAnchor="middle" fontFamily={CAPS} fontSize={48} fill={INK}>
						FRANCIA
					</text>
					<text x={1300} y={420} textAnchor="middle" fontFamily={CAPS} fontSize={44} fill="#F4F1EA">
						ITALIA
					</text>
					{path.length > 1 && <polyline points={path.join(' ')} fill="none" stroke="#fff" strokeWidth={9} strokeDasharray="20 12" strokeLinecap="round" />}
					{pts.map(([x, y, name], i) => {
						const shown = i <= done + (cur > 0.95 ? 1 : 0);
						return shown ? (
							<g key={i}>
								<circle cx={x} cy={y} r={14} fill={PALETTE.red} {...O} strokeWidth={3} />
								<text x={x + 24} y={y - 18} fontFamily={CAPS} fontSize={34} fill={INK}>
									{name}
								</text>
							</g>
						) : null;
					})}
					{p.icon === 'train' && (
						<g transform={`translate(${head[0]},${head[1] - 40})`}>
							<rect x={-50} y={-30} width={100} height={50} rx={8} fill="#2C3E50" {...O} strokeWidth={3} />
							<circle cx={-24} cy={24} r={12} fill="#111" />
							<circle cx={24} cy={24} r={12} fill="#111" />
						</g>
					)}
					{p.icon === 'painting' && (
						<g transform={`translate(${head[0]},${head[1] - 70})`}>
							<Painting s={0.3} />
						</g>
					)}
				</Layer>
			</Scene>
			{p.stamp && <StampTag f={f - 3} text={p.stamp} x={1660} />}
		</Wrap>
	);
};

// six identical copies slide in (the legend)
T2.copies = ({f, len, p}) => (
	<Panel2 f={f} len={len} bg="#3A3448" pattern="dots" g="night">
		{Array.from({length: 6}).map((_, i) => {
			const at = [0, 6, 10, 13, 15, 17][i];
			if (f < at) return null;
			const d = easeOut((f - at) / 6);
			return (
				<g key={i} transform={`translate(${lerp(2400, 210 + i * 300, d)},470)`}>
					<Painting s={1.15} />
				</g>
			);
		})}
		{p.slam && <Slam f={f} at={p.slamAt} x={960} y={860} text={p.slam} rot={-6} size={80} />}
	</Panel2>
);

// balance scale: hero vs thief
T2.scale = ({f, len, p}) => {
	const tilt = p.side === 'L' ? -8 : p.side === 'R' ? 8 : 0;
	const a = easeOut(clamp(f / 20)) * tilt;
	const items: string[] = p.items ?? [];
	return (
		<Panel2 f={f} len={len} bg="#5A4A38" pattern="stone" g="sepia">
			<rect x={940} y={360} width={40} height={560} fill="#B8922E" {...O} />
			<rect x={800} y={900} width={320} height={40} fill="#8A6A2A" {...O} />
			<g transform={`rotate(${a},960,360)`}>
				<rect x={460} y={350} width={1000} height={24} fill="#C9A94A" {...O} />
				{[520, 1400].map((x, i) => (
					<g key={x}>
						<path d={`M ${x} 374 L ${x - 120} 640 M ${x} 374 L ${x + 120} 640`} stroke={INK} strokeWidth={4} />
						<path d={`M ${x - 160} 640 Q ${x} 720 ${x + 160} 640 Z`} fill="#C9A94A" {...O} />
						<text x={x} y={600} textAnchor="middle" fontFamily={CAPS} fontSize={40} fill="#F4F1EA">
							{i === 0 ? p.left : p.right}
						</text>
					</g>
				))}
			</g>
			{items.map((t, i) => {
				const at = (p.ats ?? [])[i] ?? i * 12;
				if (f < at) return null;
				const d = at < 0 ? 1 : easeIn(clamp((f - at) / 7));
				const x = p.side === 'L' ? 520 : 1400;
				return (
					<g key={i} transform={`translate(${x + (i - 1) * 40},${lerp(-100, 560 - i * 50, d)})`}>
						<rect x={-130} y={-24} width={260} height={48} rx={6} fill="#F4F1EA" {...O} strokeWidth={3} />
						<text x={0} y={12} textAnchor="middle" fontFamily={CAPS} fontSize={28} fill={INK}>
							{t}
						</text>
					</g>
				);
			})}
		</Panel2>
	);
};

// long queue of tourists outside the pyramid
T2.queue = ({f, len, abs}) => {
	const c = camAt(f, len, {x: 600, y: 540, zoom: 1.05}, {x: 1300, y: 540, zoom: 1.05}, {kind: 'creep'});
	const outs = [CAST.TO, CAST.M, CAST.D, CAST.R, CAST.V2, CAST.TO, CAST.V4];
	return (
		<Wrap g="day">
			<Scene cam={c} bg="#BFD8E8">
				<TicketBack f={abs} />
				<Layer>
					{Array.from({length: 22}).map((_, i) => (
						<Actor key={i} abs={abs + i * 5} outfit={outs[i % outs.length]} view="side" mirror x={-300 + i * 130} y={FEET + (i % 2) * 30} scale={0.62} expression={i % 3 ? 'neutral' : 'happy'} pose={i % 4 === 0 ? 'holding' : 'idle'} held={heldEl('phone')} shadow={0.3} />
					))}
				</Layer>
			</Scene>
		</Wrap>
	);
};

export const TEMPLATES2: Record<string, React.FC<TP>> = {...TEMPLATES, ...T2};
