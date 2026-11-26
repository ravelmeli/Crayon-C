import React, {useId} from 'react';
import {INK, Outfit} from './outfits';

// ---------------------------------------------------------------------------
// One 2D cut-out rig. Local coordinates: feet centre at (0,0), up is -y.
// Figure is ~410 units tall: legs 95, torso egg 176, head circle r=70.
// ---------------------------------------------------------------------------

export type View = 'front' | '3q' | 'side' | 'back';
export type Expression =
	| 'neutral'
	| 'happy'
	| 'surprised'
	| 'thinking'
	| 'concerned'
	| 'angry'
	| 'sad'
	| 'deadpan'
	| 'panic';
export type Pose = 'idle' | 'talking' | 'pointing' | 'holding' | 'walking' | 'cheering' | 'shrugging';
export type Mouth = 'closed' | 'smallO' | 'tallO' | 'wide' | 'smile';
export type Mark = 'sweat' | 'anger' | 'sparkles' | 'dizzy' | 'puff';

export interface CharacterProps {
	outfit: Outfit;
	view?: View;
	mirror?: boolean; // true = faces screen-left
	expression?: Expression;
	pose?: Pose;
	mouth?: Mouth; // talking override
	blink?: boolean;
	tilt?: number; // head tilt in degrees
	walkPhase?: number; // radians
	breath?: number; // 0..1 bob
	marks?: Mark[];
	x?: number;
	y?: number;
	scale?: number;
	shadow?: number; // 0 = none, else opacity (0.25 day, 0.42 dim)
	held?: React.ReactNode; // drawn at hands for 'holding'
	gestureT?: number; // 0..1 for talking arm gesture amount
}

const LW = 3.5; // outline weight ~2.5% of head diameter
const HEAD_Y = -322;
const HEAD_R = 70;
const TORSO_Y = -170;
const TORSO_RY = 88;

const facingOf = (v: View) => (v === 'front' ? 0 : v === '3q' ? 0.55 : v === 'side' ? 1 : 0);

const cleanId = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, '');

// ---------------- Hair ----------------
const HairBack: React.FC<{o: Outfit; back: boolean; fx: number}> = ({o, back, fx}) => {
	if (o.hair === 'long') {
		const sx = -fx * 14;
		return (
			<path
				d={`M ${sx - 72} -10 C ${sx - 82} 40 ${sx - 74} 95 ${sx - 52} 112 L ${sx + 52} 112 C ${sx + 74} 95 ${sx + 82} 40 ${sx + 72} -10 Z`}
				fill={o.hairColor}
				stroke={INK}
				strokeWidth={LW}
				strokeLinejoin="round"
			/>
		);
	}
	if (o.hair === 'bun' && back) return null;
	return null;
};

const HairFront: React.FC<{o: Outfit; back: boolean; fx: number}> = ({o, back, fx}) => {
	const s = {stroke: INK, strokeWidth: LW, strokeLinejoin: 'round' as const};
	const sx = -fx * 10; // hair mass drifts toward the back of the head in 3q/side
	const strand = {stroke: INK, strokeWidth: 1.8, fill: 'none', opacity: 0.55, strokeLinecap: 'round' as const};
	const hi = {stroke: o.hairHighlight, strokeWidth: 6, fill: 'none', opacity: 0.85, strokeLinecap: 'round' as const};

	if (back) {
		if (o.hair === 'bald') {
			return <path d="M -68 8 C -60 40 60 40 68 8" fill="none" stroke={o.hairColor} strokeWidth={10} opacity={0.9} />;
		}
		if (o.hair === 'toque') return <Toque o={o} />;
		return (
			<g>
				<path d="M -70 0 C -74 -60 -36 -78 0 -78 C 36 -78 74 -60 70 0 C 60 30 -60 30 -70 0 Z" fill={o.hairColor} {...s} />
				<path d="M -30 -60 C -20 -20 -22 10 -26 22 M 4 -70 C 8 -30 6 0 4 26 M 34 -58 C 30 -20 32 6 28 20" {...strand} />
				<path d="M -40 -56 C -15 -70 15 -70 40 -56" {...hi} />
				{o.hair === 'bun' && <circle cx={0} cy={-80} r={22} fill={o.hairColor} {...s} />}
			</g>
		);
	}

	switch (o.hair) {
		case 'swept':
			return (
				<g transform={`translate(${sx},0)`}>
					<path d="M -67 -18 C -74 -74 -30 -104 16 -100 C 60 -96 80 -62 70 -14 C 66 -36 54 -48 36 -52 C 12 -58 -16 -54 -36 -46 C -50 -40 -60 -30 -67 -18 Z" fill={o.hairColor} {...s} />
					<path d="M -44 -48 C -30 -76 4 -90 44 -78 M -22 -54 C -6 -72 26 -80 60 -62 M 0 -56 C 18 -66 42 -66 66 -44" {...strand} />
					<path d="M -50 -60 C -28 -88 12 -98 46 -84" {...hi} />
					<path d="M -40 -46 C -52 -78 -20 -112 18 -106 C -6 -98 -22 -80 -24 -54 Z" fill={o.hairColor} {...s} />
					<path d="M -34 -60 C -30 -84 -10 -100 10 -104" {...hi} strokeWidth={4} />
				</g>
			);
		case 'sidepart':
			return (
				<g transform={`translate(${sx},0)`}>
					<path d="M -70 -2 C -74 -56 -40 -84 0 -84 C 44 -84 74 -56 70 -4 C 66 -30 50 -40 26 -40 C 4 -40 -18 -46 -30 -60 C -40 -40 -56 -24 -70 -2 Z" fill={o.hairColor} {...s} />
					<path d="M -30 -60 C -10 -46 20 -42 52 -36 M -36 -50 C -46 -36 -58 -24 -64 -10" {...strand} />
					<path d="M -10 -74 C 14 -78 40 -70 56 -54" {...hi} />
				</g>
			);
		case 'bun':
			return (
				<g transform={`translate(${sx},0)`}>
					<circle cx={0} cy={-82} r={22} fill={o.hairColor} {...s} />
					<path d="M -70 -4 C -74 -58 -38 -80 0 -80 C 38 -80 74 -58 70 -4 C 56 -38 30 -48 0 -48 C -30 -48 -56 -38 -70 -4 Z" fill={o.hairColor} {...s} />
					<path d="M -40 -60 C -20 -50 -10 -50 0 -48 M 40 -60 C 20 -50 10 -50 0 -48" {...strand} />
					<path d="M -36 -66 C -12 -76 14 -76 38 -66" {...hi} />
				</g>
			);
		case 'long':
			return (
				<g transform={`translate(${sx},0)`}>
					<path d="M -72 10 C -78 -56 -40 -84 0 -84 C 40 -84 78 -56 72 10 C 66 -24 50 -44 20 -50 C 0 -40 -30 -36 -50 -30 C -62 -20 -68 -6 -72 10 Z" fill={o.hairColor} {...s} />
					<path d="M 20 -50 C 6 -66 -14 -72 -34 -70 M -50 -30 C -60 -10 -64 6 -66 20" {...strand} />
					<path d="M -40 -64 C -14 -78 16 -78 44 -64" {...hi} />
				</g>
			);
		case 'curly': {
			const bumps = [-60, -42, -22, 0, 22, 42, 60];
			return (
				<g transform={`translate(${sx},0)`}>
					<path d="M -70 -10 C -74 -60 -38 -84 0 -84 C 38 -84 74 -60 70 -10 C 50 -38 -50 -38 -70 -10 Z" fill={o.hairColor} {...s} />
					{bumps.map((bx, i) => (
						<circle key={i} cx={bx} cy={-74 + Math.abs(bx) * 0.35} r={15} fill={o.hairColor} stroke={INK} strokeWidth={LW * 0.8} />
					))}
					<path d="M -30 -80 C -10 -88 14 -88 34 -80" {...hi} />
				</g>
			);
		}
		case 'short':
			return (
				<g transform={`translate(${sx},0)`}>
					<path d="M -68 -14 C -70 -60 -36 -80 0 -80 C 36 -80 70 -60 68 -14 C 54 -40 -54 -40 -68 -14 Z" fill={o.hairColor} {...s} />
					<path d="M -40 -56 C -30 -46 -20 -42 -10 -40 M 10 -42 C 22 -46 34 -52 42 -58" {...strand} />
					<path d="M -36 -66 C -12 -74 14 -74 38 -66" {...hi} />
				</g>
			);
		case 'toque':
			return <Toque o={o} />;
		case 'bald':
			return (
				<g>
					<path d="M -70 -2 C -72 -20 -66 -30 -60 -36" fill="none" stroke={o.hairColor} strokeWidth={12} strokeLinecap="round" />
					<path d="M 70 -2 C 72 -20 66 -30 60 -36" fill="none" stroke={o.hairColor} strokeWidth={12} strokeLinecap="round" />
					<path d="M -30 -58 C -10 -66 12 -66 30 -60" fill="none" stroke="#fff" strokeWidth={5} opacity={0.5} strokeLinecap="round" />
				</g>
			);
	}
	return null;
};

const Toque: React.FC<{o: Outfit}> = ({o}) => (
	<g>
		<path d="M -56 -52 L -50 -96 L 50 -96 L 56 -52 Z" fill={o.hairColor} stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
		<path d="M -54 -96 C -84 -100 -80 -150 -46 -144 C -40 -176 0 -180 10 -156 C 26 -180 70 -168 62 -138 C 90 -132 84 -96 54 -96 Z" fill={o.hairColor} stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
		<path d="M -20 -100 L -18 -134 M 14 -100 L 16 -136" stroke={INK} strokeWidth={1.8} opacity={0.4} />
		<rect x={-58} y={-62} width={116} height={14} rx={4} fill="#E4DED0" stroke={INK} strokeWidth={LW * 0.8} />
	</g>
);

// ---------------- Hats ----------------
const Hat: React.FC<{kind: string; c: string}> = ({kind, c}) => {
	const s = {stroke: INK, strokeWidth: LW, strokeLinejoin: 'round' as const};
	switch (kind) {
		case 'kepi':
			return (
				<g>
					<path d="M -58 -48 L -52 -104 L 52 -104 L 58 -48 Z" fill={c} {...s} />
					<rect x={-60} y={-56} width={120} height={12} fill="#C9A94A" stroke={INK} strokeWidth={2} />
					<path d="M -60 -46 Q -20 -30 30 -40 L 70 -46 Z" fill="#111" {...s} />
				</g>
			);
		case 'bowler':
			return (
				<g>
					<path d="M -84 -40 Q 0 -60 84 -40 Q 0 -30 -84 -40 Z" fill={c} {...s} />
					<path d="M -56 -44 Q -60 -118 0 -118 Q 60 -118 56 -44 Z" fill={c} {...s} />
					<path d="M -56 -54 L 56 -54" stroke="#555" strokeWidth={6} />
				</g>
			);
		case 'beret':
			return <path d="M -76 -40 Q -90 -100 -10 -104 Q 70 -104 74 -50 Q 20 -30 -76 -40 Z" fill={c} {...s} />;
		case 'top':
			return (
				<g>
					<path d="M -88 -46 Q 0 -66 88 -46 Q 0 -36 -88 -46 Z" fill={c} {...s} />
					<rect x={-52} y={-170} width={104} height={122} fill={c} {...s} />
					<rect x={-52} y={-70} width={104} height={14} fill="#444" />
				</g>
			);
		case 'flatcap':
			return <path d="M -72 -36 Q -76 -92 0 -94 Q 70 -92 72 -50 L 104 -40 Q 40 -30 -72 -36 Z" fill={c} {...s} />;
		case 'redcap':
			return <path d="M -74 -30 Q -80 -100 0 -104 Q 80 -100 74 -30 Q 0 -50 -74 -30 Z" fill={c} {...s} />;
		case 'helmet':
			return (
				<g>
					<path d="M -74 -30 Q -74 -110 0 -110 Q 74 -110 74 -30 Z" fill={c} {...s} />
					<path d="M -86 -30 L 86 -30" stroke={INK} strokeWidth={8} strokeLinecap="round" />
					<rect x={-10} y={-108} width={20} height={70} fill="#E0B43A" stroke={INK} strokeWidth={2} />
				</g>
			);
		case 'crown':
			return <path d="M -60 -50 L -60 -100 L -30 -76 L 0 -110 L 30 -76 L 60 -100 L 60 -50 Z" fill={c} {...s} />;
	}
	return null;
};

// ---------------- Face ----------------
const Face: React.FC<{
	expression: Expression;
	mouth?: Mouth;
	blink: boolean;
	fx: number;
	glasses?: 'round' | 'square';
}> = ({expression, mouth, blink, fx, glasses}) => {
	const cx = fx * 34; // features slide toward the facing side
	const half = 22 * (1 - 0.5 * fx);
	const side = fx > 0.9;
	const eyes = side ? [cx + 12] : [cx - half, cx + half];
	const ey = -4;
	const ink = {fill: INK};
	const line = {stroke: INK, strokeWidth: 3, fill: 'none', strokeLinecap: 'round' as const};

	// eyes
	const eyeEls = eyes.map((ex, i) => {
		const far = !side && fx > 0.2 && i === 0; // far eye a touch smaller in 3q
		const k = far ? 0.85 : 1;
		if (blink) return <path key={i} d={`M ${ex - 7} ${ey} Q ${ex} ${ey + 3} ${ex + 7} ${ey}`} {...line} />;
		switch (expression) {
			case 'happy':
				return <path key={i} d={`M ${ex - 8} ${ey + 3} Q ${ex} ${ey - 8} ${ex + 8} ${ey + 3}`} {...line} />;
			case 'surprised':
			case 'panic':
				return (
					<g key={i}>
						<circle cx={ex} cy={ey} r={10 * k} fill="#fff" stroke={INK} strokeWidth={2.5} />
						<circle cx={ex} cy={ey} r={4.5 * k} {...ink} />
					</g>
				);
			case 'deadpan':
				return (
					<g key={i}>
						<ellipse cx={ex} cy={ey + 2} rx={6 * k} ry={6 * k} {...ink} />
						<path d={`M ${ex - 9} ${ey - 1} L ${ex + 9} ${ey - 1}`} stroke={INK} strokeWidth={3.5} />
					</g>
				);
			case 'angry':
				return <ellipse key={i} cx={ex} cy={ey + 1} rx={6 * k} ry={7 * k} {...ink} />;
			default:
				return <ellipse key={i} cx={ex} cy={ey} rx={6 * k} ry={9 * k} {...ink} />;
		}
	});

	// brows
	const browY = ey - 22;
	const browFor = (ex: number, i: number) => {
		const inner = (side ? 1 : i === 0 ? 1 : -1) * 1; // +1 means inner side is to the right
		const ix = ex + inner * 8;
		const ox = ex - inner * 8;
		switch (expression) {
			case 'surprised':
			case 'panic':
				return `M ${ox} ${browY - 8} Q ${ex} ${browY - 16} ${ix} ${browY - 8}`;
			case 'angry':
				return `M ${ox} ${browY - 6} L ${ix} ${browY + 5}`;
			case 'sad':
			case 'concerned':
				return `M ${ox} ${browY + 3} L ${ix} ${browY - 7}`;
			case 'deadpan':
				return `M ${ox} ${browY} L ${ix} ${browY}`;
			case 'thinking':
				return i === 0 ? `M ${ox} ${browY - 8} Q ${ex} ${browY - 14} ${ix} ${browY - 6}` : `M ${ox} ${browY + 1} L ${ix} ${browY + 1}`;
			default:
				return `M ${ox} ${browY} Q ${ex} ${browY - 6} ${ix} ${browY}`;
		}
	};

	// mouth
	const mx = cx + (side ? 20 : 0);
	const my = 30;
	let mouthEl: React.ReactNode;
	const shape: string = mouth ?? expression;
	switch (shape) {
		case 'smallO':
			mouthEl = <ellipse cx={mx} cy={my} rx={6} ry={5} {...ink} />;
			break;
		case 'tallO':
		case 'surprised':
			mouthEl = <ellipse cx={mx} cy={my + 2} rx={7} ry={11} {...ink} />;
			break;
		case 'wide':
			mouthEl = <path d={`M ${mx - 16} ${my - 4} Q ${mx} ${my - 2} ${mx + 16} ${my - 4} Q ${mx + 12} ${my + 16} ${mx} ${my + 16} Q ${mx - 12} ${my + 16} ${mx - 16} ${my - 4} Z`} {...ink} />;
			break;
		case 'smile':
		case 'happy':
			mouthEl = (
				<g>
					<path d={`M ${mx - 18} ${my - 4} Q ${mx} ${my + 18} ${mx + 18} ${my - 4} Z`} fill={INK} />
					<path d={`M ${mx - 9} ${my + 6} Q ${mx} ${my + 11} ${mx + 9} ${my + 6}`} stroke="#D86A6A" strokeWidth={4} fill="none" />
				</g>
			);
			break;
		case 'closed':
		case 'neutral':
			mouthEl = <path d={`M ${mx - 12} ${my} Q ${mx} ${my + 8} ${mx + 12} ${my}`} {...line} />;
			break;
		case 'thinking':
			mouthEl = <path d={`M ${mx - 10} ${my + 2} L ${mx + 8} ${my - 2}`} {...line} />;
			break;
		case 'concerned':
			mouthEl = <path d={`M ${mx - 12} ${my + 4} Q ${mx - 4} ${my - 2} ${mx} ${my + 2} Q ${mx + 6} ${my + 6} ${mx + 12} ${my}`} {...line} />;
			break;
		case 'angry':
			mouthEl = <path d={`M ${mx - 14} ${my + 6} Q ${mx} ${my - 6} ${mx + 14} ${my + 6}`} {...line} />;
			break;
		case 'sad':
			mouthEl = <path d={`M ${mx - 12} ${my + 6} Q ${mx} ${my - 4} ${mx + 12} ${my + 6}`} {...line} />;
			break;
		case 'deadpan':
			mouthEl = <path d={`M ${mx - 11} ${my + 2} L ${mx + 11} ${my + 2}`} {...line} />;
			break;
		case 'panic':
			mouthEl = (
				<g>
					<rect x={mx - 17} y={my - 6} width={34} height={16} rx={4} fill="#fff" stroke={INK} strokeWidth={3} />
					<path d={`M ${mx - 17} ${my + 2} L ${mx + 17} ${my + 2} M ${mx - 6} ${my - 6} L ${mx - 6} ${my + 10} M ${mx + 6} ${my - 6} L ${mx + 6} ${my + 10}`} stroke={INK} strokeWidth={2} />
				</g>
			);
			break;
		default:
			mouthEl = <path d={`M ${mx - 12} ${my} Q ${mx} ${my + 8} ${mx + 12} ${my}`} {...line} />;
	}

	// glasses
	let glassesEl: React.ReactNode = null;
	if (glasses) {
		const g = {fill: 'rgba(255,255,255,0.12)', stroke: INK, strokeWidth: 3};
		const frames = eyes.map((ex, i) =>
			glasses === 'round' ? <circle key={i} cx={ex} cy={ey} r={15} {...g} /> : <rect key={i} x={ex - 16} y={ey - 12} width={32} height={24} rx={5} {...g} />
		);
		glassesEl = (
			<g>
				{frames}
				{eyes.length === 2 && <path d={`M ${eyes[0] + 15} ${ey - 2} Q ${(eyes[0] + eyes[1]) / 2} ${ey - 8} ${eyes[1] - 15} ${ey - 2}`} stroke={INK} strokeWidth={3} fill="none" />}
				{side && <path d={`M ${eyes[0] - 16} ${ey - 4} L ${-30} ${ey - 8}`} stroke={INK} strokeWidth={3} />}
			</g>
		);
	}

	return (
		<g>
			{eyeEls}
			{eyes.map((ex, i) => (
				<path key={`b${i}`} d={browFor(ex, i)} stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" />
			))}
			{glassesEl}
			{mouthEl}
		</g>
	);
};

// ---------------- Marks (emotion symbols) ----------------
export const Marks: React.FC<{marks: Mark[]}> = ({marks}) => (
	<g>
		{marks.includes('sweat') && (
			<g transform="translate(62,-30)">
				<path d="M 0 -18 C 10 -2 12 6 0 12 C -12 6 -10 -2 0 -18 Z" fill="#9FD3F0" stroke={INK} strokeWidth={2.5} />
				<path d="M -3 2 C -3 6 0 8 2 8" stroke="#fff" strokeWidth={2} fill="none" />
			</g>
		)}
		{marks.includes('anger') && (
			<g transform="translate(58,-62)" stroke={INK} strokeWidth={2.5} fill="#E04A3F">
				<path d="M -14 -4 Q -6 -6 -4 -14 Q 4 -14 4 -4 Q 14 -4 14 4 Q 4 6 4 14 Q -4 14 -4 4 Q -14 6 -14 -4 Z" />
			</g>
		)}
		{marks.includes('sparkles') &&
			[
				[-88, -60, 1],
				[86, -76, 0.8],
				[92, 10, 0.6],
			].map(([x, y, k], i) => (
				<path key={i} transform={`translate(${x},${y}) scale(${k})`} d="M 0 -14 Q 2 -2 14 0 Q 2 2 0 14 Q -2 2 -14 0 Q -2 -2 0 -14 Z" fill="#FFF3A8" stroke={INK} strokeWidth={2} />
			))}
		{marks.includes('dizzy') &&
			[0, 1, 2].map((i) => {
				const a = (i / 3) * Math.PI * 2;
				return (
					<path
						key={i}
						transform={`translate(${Math.cos(a) * 60},${-86 + Math.sin(a) * 12}) scale(0.8)`}
						d="M 0 -12 L 3.5 -4 L 12 -4 L 5 2 L 8 11 L 0 6 L -8 11 L -5 2 L -12 -4 L -3.5 -4 Z"
						fill="#FFE066"
						stroke={INK}
						strokeWidth={2}
					/>
				);
			})}
		{marks.includes('puff') && (
			<g transform="translate(-70,330)" fill="#E8E2D4" stroke={INK} strokeWidth={2.5}>
				<circle cx={0} cy={0} r={14} />
				<circle cx={-18} cy={4} r={10} />
				<circle cx={14} cy={6} r={9} />
			</g>
		)}
	</g>
);

// ---------------- Arms ----------------
type ArmPose = {near: [number, number][]; far: [number, number][]};

const armsFor = (pose: Pose, walkPhase: number, g: number): ArmPose | null => {
	const L: [number, number] = [-58, -226];
	const R: [number, number] = [58, -226];
	switch (pose) {
		case 'idle':
			return {near: [R, [72, -170], [70, -122]], far: [L, [-72, -170], [-70, -122]]};
		case 'talking': {
			const hx = 86 + g * 14;
			const hy = -206 - g * 26;
			return {near: [R, [88, -176], [hx, hy]], far: [L, [-72, -170], [-70, -122]]};
		}
		case 'pointing':
			return {near: [R, [112, -230], [170, -236]], far: [L, [-72, -170], [-70, -122]]};
		case 'holding':
			return {near: [R, [74, -168], [26, -156]], far: [L, [-74, -168], [-26, -156]]};
		case 'cheering':
			return {near: [R, [92, -286], [98, -344]], far: [L, [-92, -286], [-98, -344]]};
		case 'shrugging':
			return {near: [R, [94, -186], [112, -238]], far: [L, [-94, -186], [-112, -238]]};
		case 'walking': {
			const s = Math.sin(walkPhase) * 34;
			return {near: [R, [62 + s * 0.4, -172], [60 + s, -124]], far: [L, [-62 - s * 0.4, -172], [-60 - s, -124]]};
		}
	}
};

const Hand: React.FC<{p: [number, number]; prev: [number, number]; skin: string; point?: boolean}> = ({p, prev, skin, point}) => {
	const ang = (Math.atan2(p[1] - prev[1], p[0] - prev[0]) * 180) / Math.PI;
	return (
		<g transform={`translate(${p[0]},${p[1]}) rotate(${ang})`}>
			{point && <path d="M 8 -2 L 26 -2" stroke={INK} strokeWidth={6} strokeLinecap="round" />}
			{point && <path d="M 8 -2 L 25 -2" stroke={skin} strokeWidth={2.5} strokeLinecap="round" />}
			<ellipse cx={4} cy={0} rx={12} ry={10} fill={skin} stroke={INK} strokeWidth={3} />
			<ellipse cx={2} cy={-9} rx={4.5} ry={5.5} fill={skin} stroke={INK} strokeWidth={2.5} />
		</g>
	);
};

const Arm: React.FC<{pts: [number, number][]; skin: string; point?: boolean}> = ({pts, skin, point}) => (
	<g>
		<polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
		<Hand p={pts[2]} prev={pts[1]} skin={skin} point={point} />
	</g>
);

// ---------------- Torso clothing ----------------
const Torso: React.FC<{o: Outfit; fx: number; back: boolean; clip: string}> = ({o, fx, back, clip}) => {
	const rx = back ? 66 : 66 - fx * 18;
	const cx = back ? 0 : fx * 20; // centre line of the garment front
	const egg = `M 0 ${TORSO_Y - TORSO_RY} C ${rx * 0.95} ${TORSO_Y - TORSO_RY} ${rx * 1.06} ${TORSO_Y + 20} ${rx * 0.96} ${TORSO_Y + 52} C ${rx * 0.8} ${TORSO_Y + TORSO_RY} ${-rx * 0.8} ${TORSO_Y + TORSO_RY} ${-rx * 0.96} ${TORSO_Y + 52} C ${-rx * 1.06} ${TORSO_Y + 20} ${-rx * 0.95} ${TORSO_Y - TORSO_RY} 0 ${TORSO_Y - TORSO_RY} Z`;
	const neck = TORSO_Y - TORSO_RY + 6;
	const detail = {stroke: INK, strokeWidth: 2.5, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};

	return (
		<g>
			<defs>
				<clipPath id={clip}>
					<path d={egg} />
				</clipPath>
			</defs>
			<path d={egg} fill={o.body} />
			<g clipPath={`url(#${clip})`}>
				{/* shade on the side away from the key light (light from screen-left) */}
				<ellipse cx={rx * 0.9} cy={TORSO_Y + 10} rx={rx * 0.55} ry={TORSO_RY * 1.2} fill={o.bodyShade} opacity={0.8} />
				{/* hem band */}
				<rect x={-100} y={TORSO_Y + TORSO_RY - 24} width={200} height={40} fill={o.hem} />
				<path d={`M -100 ${TORSO_Y + TORSO_RY - 24} L 100 ${TORSO_Y + TORSO_RY - 24}`} {...detail} />

				{!back && o.collar === 'zip' && (
					<g>
						<path d={`M ${cx - 16} ${neck} L ${cx} ${neck + 26} L ${cx + 16} ${neck} Z`} fill={o.inner} stroke={INK} strokeWidth={2.5} />
						<path d={`M ${cx - 4} ${neck + 18} L ${cx - 4} ${TORSO_Y + TORSO_RY}`} stroke="#555" strokeWidth={4} />
						{Array.from({length: 14}).map((_, i) => (
							<path key={i} d={`M ${cx - 8} ${neck + 26 + i * 11} L ${cx} ${neck + 26 + i * 11}`} stroke="#777" strokeWidth={2} />
						))}
						{/* moto collar flaps */}
						<path d={`M ${cx - 16} ${neck} L ${cx - 46} ${neck + 8} L ${cx - 30} ${neck + 40} L ${cx - 6} ${neck + 30} Z`} {...detail} fill={o.body} />
						<path d={`M ${cx + 16} ${neck} L ${cx + 46} ${neck + 8} L ${cx + 32} ${neck + 40} L ${cx + 6} ${neck + 30} Z`} {...detail} fill={o.bodyShade} />
						<circle cx={cx - 30} cy={neck + 34} r={3} fill="#B8B8B8" />
						<circle cx={cx + 32} cy={neck + 34} r={3} fill="#B8B8B8" />
					</g>
				)}
				{!back && o.collar === 'lapel' && (
					<g>
						<path d={`M ${cx - 24} ${neck - 4} L ${cx} ${neck + 64} L ${cx + 24} ${neck - 4} Z`} fill={o.inner} stroke={INK} strokeWidth={2.5} />
						{o.tie && <path d={`M ${cx - 6} ${neck + 6} L ${cx + 6} ${neck + 6} L ${cx + 9} ${neck + 52} L ${cx} ${neck + 62} L ${cx - 9} ${neck + 52} Z`} fill={o.tie} stroke={INK} strokeWidth={2} />}
						<path d={`M ${cx - 24} ${neck - 4} L ${cx - 40} ${neck + 30} L ${cx - 24} ${neck + 34} L ${cx} ${neck + 64}`} {...detail} fill={o.body} />
						<path d={`M ${cx + 24} ${neck - 4} L ${cx + 40} ${neck + 30} L ${cx + 24} ${neck + 34} L ${cx} ${neck + 64}`} {...detail} fill={o.bodyShade} />
					</g>
				)}
				{!back && o.collar === 'shirt' && (
					<g>
						<path d={`M ${cx - 20} ${neck} L ${cx} ${neck + 18} L ${cx + 20} ${neck} L ${cx + 22} ${neck + 16} L ${cx} ${neck + 24} L ${cx - 22} ${neck + 16} Z`} fill={o.inner} stroke={INK} strokeWidth={2.5} />
						<path d={`M ${cx} ${neck + 22} L ${cx} ${TORSO_Y + TORSO_RY}`} {...detail} />
					</g>
				)}
				{o.collar === 'turtle' && <rect x={-30} y={neck - 10} width={60} height={26} rx={10} fill={o.body} stroke={INK} strokeWidth={2.5} />}
				{!back && o.accessory === 'labcoat' && (
					<g>
						<path d={`M ${-rx} ${neck} L ${cx - 24} ${neck - 4} L ${cx - 6} ${TORSO_Y + TORSO_RY} L ${-rx} ${TORSO_Y + TORSO_RY} Z`} fill="#FBFAF5" stroke={INK} strokeWidth={2.5} />
						<path d={`M ${rx} ${neck} L ${cx + 24} ${neck - 4} L ${cx + 6} ${TORSO_Y + TORSO_RY} L ${rx} ${TORSO_Y + TORSO_RY} Z`} fill="#E6E2D6" stroke={INK} strokeWidth={2.5} />
					</g>
				)}
				{!back && o.accessory === 'apron' && <path d={`M ${cx - 40} ${TORSO_Y - 10} L ${cx + 40} ${TORSO_Y - 10} L ${cx + 48} ${TORSO_Y + TORSO_RY} L ${cx - 48} ${TORSO_Y + TORSO_RY} Z`} fill="#F4F1EA" stroke={INK} strokeWidth={2.5} />}
				{!back && o.collar === 'crew' && <path d={`M ${cx - 26} ${neck - 2} Q ${cx} ${neck + 22} ${cx + 26} ${neck - 2}`} stroke={o.inner} strokeWidth={9} fill="none" />}
				{!back && o.collar === 'chef' && (
					<g>
						<rect x={cx - 26} y={neck - 6} width={52} height={14} rx={4} fill={o.body} stroke={INK} strokeWidth={2.5} />
						<path d={`M ${cx + 18} ${neck + 8} C ${cx + 4} ${neck + 60} ${cx + 6} ${neck + 110} ${cx + 20} ${TORSO_Y + TORSO_RY}`} {...detail} />
					</g>
				)}
				{!back && o.buttons &&
					(o.collar === 'chef'
						? [0, 1, 2, 3].map((i) => (
								<g key={i}>
									<circle cx={cx - 12} cy={neck + 28 + i * 24} r={4} fill="#F8F4EA" stroke={INK} strokeWidth={2} />
									<circle cx={cx + 30} cy={neck + 28 + i * 24} r={4} fill="#F8F4EA" stroke={INK} strokeWidth={2} />
								</g>
						  ))
						: [0, 1].map((i) => <circle key={i} cx={cx + 2} cy={neck + 80 + i * 26} r={4} fill={o.bodyShade} stroke={INK} strokeWidth={2} />))}
				{!back && o.pockets && (
					<g>
						<path d={`M ${cx - 46} ${TORSO_Y + 30} L ${cx - 16} ${TORSO_Y + 30}`} {...detail} />
						<path d={`M ${cx + 16} ${TORSO_Y + 30} L ${cx + 44} ${TORSO_Y + 30}`} {...detail} />
						<path d={`M ${cx - 44} ${TORSO_Y + 30} L ${cx - 42} ${TORSO_Y + 52} M ${cx + 42} ${TORSO_Y + 30} L ${cx + 40} ${TORSO_Y + 52}`} {...detail} opacity={0.6} />
					</g>
				)}
				{!back && o.badge && (
					<g transform={`translate(${cx - 38},${neck + 52})`}>
						<path d="M 6 -18 L 6 -2" stroke={INK} strokeWidth={1.5} />
						<rect x={-2} y={-2} width={18} height={24} rx={3} fill="#F4F1EA" stroke={INK} strokeWidth={2} />
						<rect x={1} y={2} width={12} height={5} fill={o.badge} />
					</g>
				)}
				{o.leather && (
					<g stroke="#FFFFFF" strokeLinecap="round" fill="none" opacity={0.7}>
						<path d={`M ${-rx * 0.62} ${TORSO_Y - 40} Q ${-rx * 0.7} ${TORSO_Y} ${-rx * 0.6} ${TORSO_Y + 40}`} strokeWidth={3} />
						<path d={`M ${-rx * 0.45} ${TORSO_Y - 62} L ${-rx * 0.38} ${TORSO_Y - 46}`} strokeWidth={2} />
						<path d={`M ${-rx * 0.4} ${TORSO_Y + 20} Q ${-rx * 0.44} ${TORSO_Y + 36} ${-rx * 0.38} ${TORSO_Y + 50}`} strokeWidth={2} />
						<path d={`M ${rx * 0.5} ${TORSO_Y - 30} L ${rx * 0.56} ${TORSO_Y - 10}`} strokeWidth={1.5} opacity={0.5} />
					</g>
				)}
				{o.stripes && Array.from({length: 7}).map((_, i) => <rect key={`st${i}`} x={-100} y={TORSO_Y - 70 + i * 24} width={200} height={10} fill={o.stripes} />)}
				{o.knit && (
					<g stroke={INK} strokeWidth={1.6} fill="none" opacity={0.3}>
						<path d={`M -40 ${TORSO_Y - 10} Q -30 ${TORSO_Y} -20 ${TORSO_Y - 6}`} />
						<path d={`M 10 ${TORSO_Y + 20} Q 22 ${TORSO_Y + 30} 34 ${TORSO_Y + 22}`} />
						<path d={`M -30 ${TORSO_Y + 40} Q -16 ${TORSO_Y + 48} -4 ${TORSO_Y + 40}`} />
					</g>
				)}
				{back && <path d={`M 0 ${neck + 10} L 0 ${TORSO_Y + TORSO_RY - 24}`} {...detail} opacity={0.5} />}
				{back && <path d={`M -26 ${neck - 2} Q 0 ${neck + 8} 26 ${neck - 2}`} {...detail} />}
			</g>
			<path d={egg} fill="none" stroke={INK} strokeWidth={LW} />
		</g>
	);
};

// ---------------- Character ----------------
export const Character: React.FC<CharacterProps> = ({
	outfit: o,
	view = 'front',
	mirror = false,
	expression = 'neutral',
	pose = 'idle',
	mouth,
	blink = false,
	tilt = 0,
	walkPhase = 0,
	breath = 0,
	marks = [],
	x = 0,
	y = 0,
	scale = 1,
	shadow = 0.25,
	held,
	gestureT = 1,
}) => {
	const id = cleanId(useId());
	const back = view === 'back';
	const fx = facingOf(view);
	const bob = Math.sin(breath * Math.PI * 2) * 2;
	const arms = armsFor(pose, walkPhase, gestureT);
	const legSwing = pose === 'walking' ? Math.sin(walkPhase) * 16 : 0;
	const legX = view === 'side' ? [-4, 8] : view === '3q' ? [-14, 22] : [-20, 20];

	const head = (
		<g transform={`translate(${fx * 6},${HEAD_Y + bob}) rotate(${tilt},0,${-HEAD_Y - 255})`}>
			<defs>
				<radialGradient id={`${id}-hg`} cx="0.42" cy="0.4" r="0.62">
					<stop offset="0.6" stopColor={o.skin} />
					<stop offset="1" stopColor={o.skinShade} />
				</radialGradient>
				<clipPath id={`${id}-hc`}>
					<circle r={HEAD_R} />
				</clipPath>
			</defs>
			<HairBack o={o} back={back} fx={fx} />
			<circle r={HEAD_R} fill={o.skinShade} />
			<g clipPath={`url(#${id}-hc)`}>
				<circle cx={-12} cy={-10} r={HEAD_R} fill={`url(#${id}-hg)`} />
			</g>
			<path d={`M ${-HEAD_R * 0.62} ${-HEAD_R * 0.5} A ${HEAD_R - 8} ${HEAD_R - 8} 0 0 1 ${-HEAD_R * 0.1} ${-HEAD_R + 8}`} stroke="#FFFFFF" strokeWidth={3.5} fill="none" opacity={0.7} strokeLinecap="round" />
			<circle r={HEAD_R} fill="none" stroke={INK} strokeWidth={LW} />
			{!back && o.facial === 'longbeard' && <path d={`M ${fx * 30 - 60} 10 Q ${fx * 30 - 50} 150 ${fx * 30} 160 Q ${fx * 30 + 50} 150 ${fx * 30 + 60} 10 Q ${fx * 30} 60 ${fx * 30 - 60} 10 Z`} fill={o.facialColor} stroke={INK} strokeWidth={3} />}
			{!back && o.facial === 'beard' && <path d={`M ${fx * 30 - 50} 10 Q ${fx * 30 - 44} 74 ${fx * 30} 80 Q ${fx * 30 + 44} 74 ${fx * 30 + 50} 10 Q ${fx * 30} 56 ${fx * 30 - 50} 10 Z`} fill={o.facialColor} stroke={INK} strokeWidth={3} />}
			{!back && <Face expression={expression} mouth={mouth} blink={blink} fx={fx} glasses={o.glasses} />}
			{!back && o.facial && o.facial !== 'longbeard' && o.facial !== 'beard' ? <path d={`M ${fx * 34 + (fx > 0.9 ? 20 : 0) - 26} 22 Q ${fx * 34 + (fx > 0.9 ? 20 : 0) - 12} 8 ${fx * 34 + (fx > 0.9 ? 20 : 0)} 18 Q ${fx * 34 + (fx > 0.9 ? 20 : 0) + 12} 8 ${fx * 34 + (fx > 0.9 ? 20 : 0) + 26} 22 Q ${fx * 34 + (fx > 0.9 ? 20 : 0)} 20 ${fx * 34 + (fx > 0.9 ? 20 : 0) - 26} 22 Z`} fill={o.facialColor} stroke={INK} strokeWidth={2.5} /> : null}
			{!back && (o.facial === 'beard' || o.facial === 'longbeard') && <path d={`M ${fx * 34 - 22} 20 Q ${fx * 34} 10 ${fx * 34 + 22} 20`} stroke={o.facialColor} strokeWidth={8} fill="none" strokeLinecap="round" />}
			<HairFront o={o} back={back} fx={fx} />
			{o.hat && <Hat kind={o.hat} c={o.hatColor ?? '#222'} />}
			{o.accessory === 'headset' && (
				<g>
					<path d="M -72 0 C -76 -96 76 -96 72 0" fill="none" stroke={INK} strokeWidth={8} />
					<rect x={-84} y={-12} width={22} height={34} rx={8} fill="#2B2B2B" stroke={INK} strokeWidth={3} />
					<rect x={62} y={-12} width={22} height={34} rx={8} fill="#2B2B2B" stroke={INK} strokeWidth={3} />
					{!back && <path d="M -74 18 Q -60 44 -20 40" fill="none" stroke={INK} strokeWidth={3} />}
				</g>
			)}
			{o.accessory === 'visor' && <path d="M -72 -30 Q 0 -60 72 -30 L 90 -20 L -90 -20 Z" fill={o.badge ?? '#C33631'} stroke={INK} strokeWidth={3} />}
			<Marks marks={marks} />
		</g>
	);

	const legs = (
		<g>
			{legX.map((lx, i) => {
				const sw = i === 0 ? legSwing : -legSwing;
				return (
					<g key={i}>
						<path d={`M ${lx} -96 L ${lx + sw} -8`} stroke={o.legs} strokeWidth={13} strokeLinecap="round" />
						<path d={`M ${lx} -96 L ${lx + sw} -8`} stroke={INK} strokeWidth={13} strokeLinecap="round" opacity={0.25} />
						<ellipse cx={lx + sw + (view === 'side' ? 8 : 0)} cy={-5} rx={view === 'side' ? 17 : 14} ry={8} fill={o.shoes} stroke={INK} strokeWidth={2} />
					</g>
				);
			})}
		</g>
	);

	return (
		<g transform={`translate(${x},${y}) scale(${scale * (mirror ? -1 : 1)},${scale})`}>
			{shadow > 0 && <ellipse cx={44} cy={0} rx={86} ry={15} fill="#000" opacity={shadow} />}
			{legs}
			{arms && (back || view === 'side') && <Arm pts={arms.far} skin={o.skin} />}
			{arms && back && <Arm pts={arms.near} skin={o.skin} point={pose === 'pointing'} />}
			<g transform={`translate(0,${bob * 0.5})`}>
				<Torso o={o} fx={fx} back={back} clip={`${id}-tc`} />
			</g>
			{arms && !back && view !== 'side' && <Arm pts={arms.far} skin={o.skin} />}
			{pose === 'holding' && held && <g transform="translate(0,-158)">{held}</g>}
			{arms && !back && <Arm pts={arms.near} skin={o.skin} point={pose === 'pointing'} />}
			{head}
		</g>
	);
};
