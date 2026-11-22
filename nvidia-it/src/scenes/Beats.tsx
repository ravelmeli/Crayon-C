import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Cam, camAt, Layer, Scene} from '../camera/Camera';
import {Character, CharacterProps} from '../rig/Character';
import {COOK_A, COOK_B, DANA, EXTRAS, INK, JENSEN, Outfit, PALETTE, RAY} from '../rig/outfits';
import {HeroJacket} from '../props/Jacket';
import {BlackCard, ChapterCard, CornerStrip, countValue, Grade, StampTag, TitleOverlay, Vignette} from '../ui/Cards';
import {CAPS, HAND} from '../ui/Fonts';
import {clamp, easeIn, easeOut, isBlinking, lerp, mouthAt, prog, rng} from '../lib';
import {BoardroomBack, CrtDesk, FLOOR, KitchenBack, MuseumBack, Office96Back, OfficeBack, OfficeFront, StageBack, Steam} from '../sets/Sets';
import {Calendar, LightDisc, OUTLINE as O, Patterned, Sign, shade} from '../sets/prims';

export type BeatProps = {f: number; len: number; abs: number};
export type Beat = {
	id: number;
	from: number;
	to: number;
	shot: string;
	set: string;
	words: string;
	camera: string;
	effect: string;
	C: React.FC<BeatProps>;
};

const FEET = FLOOR + 70;
const SKIN_SEED: Record<string, number> = {[JENSEN.name]: 3, [DANA.name]: 11, [RAY.name]: 23, [COOK_A.name]: 31, [COOK_B.name]: 41};
const young = EXTRAS[5];
const sega = EXTRAS[3];

// A character with idle life (blink + breath) and optional lip sync over an absolute window.
const Actor: React.FC<CharacterProps & {abs: number; talk?: [number, number]}> = ({abs, talk, ...p}) => {
	const seed = SKIN_SEED[p.outfit.name] ?? 5;
	const mouth = talk ? mouthAt(abs, talk[0], talk[1]) : undefined;
	const talking = talk && abs >= talk[0] && abs <= talk[1];
	const g = talking ? 0.5 + 0.5 * Math.sin((abs - talk![0]) / 4) : 0;
	return (
		<Character
			{...p}
			blink={isBlinking(abs, seed)}
			breath={(abs % 90) / 90}
			mouth={mouth ?? p.mouth}
			tilt={talking ? Math.sin((abs - talk![0]) / 6) * 7 : p.tilt ?? 0}
			gestureT={talking ? g : 1}
			pose={talking && (p.pose === undefined || p.pose === 'idle') ? 'talking' : p.pose}
			shadow={p.shadow ?? 0.42}
		/>
	);
};

const Wrap: React.FC<{children: React.ReactNode; grade?: string; gradeO?: number; vig?: number; mode?: any}> = ({children, grade, gradeO = 0.3, vig = 0.35, mode}) => (
	<AbsoluteFill>
		{children}
		{grade && <Grade color={grade} opacity={gradeO} mode={mode} />}
		<Vignette corner={vig} />
	</AbsoluteFill>
);

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

// =============================== BEATS ===============================

// 1 — Frame 0: protagonist with hero object, glow on, already moving.
const B1: React.FC<BeatProps> = ({f, len, abs}) => {
	const cam = camAt(f, len, {x: 960, y: 560, zoom: 1.5}, {x: 960, y: 550, zoom: 1.68}, {kind: 'creep'});
	return (
		<Wrap grade={PALETTE.night} gradeO={0.25} vig={0.55}>
			<Scene cam={cam} bg="#0A0C18">
				<StageBack f={abs} screen={<text x={960} y={340} textAnchor="middle" fontFamily={CAPS} fontSize={120} fill={PALETTE.accent} opacity={0.9}>NVIDIA</text>} />
				<Layer>
					<LightDisc cx={960} cy={560} r={300} color={PALETTE.accent} o={0.35} />
					<Actor abs={abs} outfit={JENSEN} x={960} y={FEET} scale={1} pose="holding" expression="happy" held={<Chip s={0.9} />} />
				</Layer>
			</Scene>
			<CornerStrip f={f - 14} text="JENSEN HUANG" hold={52} />
		</Wrap>
	);
};

// 2 — Insert: tear-off calendar counts 1993 → 2026 ("33 years").
const B2: React.FC<BeatProps> = ({f, len, abs}) => {
	const year = Math.round(countValue(f - 4, 34, 1993, 2026));
	const prev = year - 1;
	const cam = camAt(f, len, {x: 960, y: 520, zoom: 1.0}, {x: 960, y: 520, zoom: 1.12}, {kind: 'settle'});
	const tearT = ((f - 4) % 4) / 4;
	return (
		<Wrap vig={0.35}>
			<Scene cam={cam} bg="#5A2A22">
				<Layer p={0.8}>
					<Patterned x={-300} y={-200} w={2600} h={1500} fill="#8C3A2E" pattern="brick" cell={110} />
					<LightDisc cx={960} cy={480} r={520} o={0.35} />
				</Layer>
				<Layer>
					<Calendar x={960} y={230} top="YEAR" big={String(year)} w={460} c="#2C3E50" />
					{f > 4 && year < 2026 && (
						<g transform={`translate(${960 + tearT * 160},${230 + tearT * tearT * 500}) rotate(${tearT * 70})`}>
							<rect x={-230} y={138} width={460} height={390} fill="#F4F1EA" {...O} opacity={1 - tearT} />
							<text x={0} y={440} textAnchor="middle" fontFamily={CAPS} fontSize={240} fill={INK} opacity={1 - tearT}>
								{prev}
							</text>
						</g>
					)}
					<Sign x={960} y={860} text="NVIDIA HQ" w={300} bg="#C9A94A" fg={INK} size={36} />
				</Layer>
			</Scene>
		</Wrap>
	);
};

// 3 — Earned close-up on the jacket ("same black leather jacket"), punch on "jacket".
const B3: React.FC<BeatProps> = ({f, len, abs}) => {
	const cam = camAt(f, len, {x: 960, y: 600, zoom: 3.4}, {x: 960, y: 595, zoom: 3.6}, {kind: 'punch', at: 29, dur: 10}, 0.12);
	return (
		<Wrap grade={PALETTE.night} gradeO={0.22} vig={0.55}>
			<Scene cam={cam} bg="#0A0C18">
				<StageBack f={abs} />
				<Layer>
					<LightDisc cx={960} cy={560} r={300} color={PALETTE.accent} o={0.35} />
					<Actor abs={abs} outfit={JENSEN} x={960} y={FEET} scale={1} expression="neutral" />
				</Layer>
			</Scene>
		</Wrap>
	);
};

// 4 — Black card.
const B4: React.FC<BeatProps> = ({f}) => <BlackCard text="Then, in one week, he was gone." f={f} startTyping={0} cps={14} />;

// 5 — Jensen walks out of the office door; NOV 2026 tag.
const B5: React.FC<BeatProps> = ({f, len, abs}) => {
	const walkX = lerp(760, 1470, easeIn(prog(f, 4, len)) * 0.6 + prog(f, 4, len) * 0.4);
	const cam = camAt(f, len, {x: 900, y: 560, zoom: 1.25}, {x: 1180, y: 560, zoom: 1.25}, {kind: 'creep'});
	const doorOpen = clamp((walkX - 1300) / 120);
	return (
		<Wrap grade="#ACBAB7" gradeO={0.25} vig={0.35}>
			<Scene cam={cam} bg="#C9C3AE">
				<OfficeBack f={abs} board={<text x={980} y={470} textAnchor="middle" fontFamily={CAPS} fontSize={64} fill="#3A4A3A">CLOSED</text>} />
				<Layer p={0.75}>
					{/* doorway */}
					<rect x={1830} y={300} width={230} height={390} fill="#FFF6D8" {...O} />
					<path d={`M 1830 300 L ${1830 + 230 * (1 - doorOpen)} ${300 + 20 * doorOpen} L ${1830 + 230 * (1 - doorOpen)} ${690 - 20 * doorOpen} L 1830 690 Z`} fill="#6E4726" {...O} />
					<Sign x={1945} y={270} text="EXIT" w={120} bg="#2E7D32" size={28} />
				</Layer>
				<Layer>
					<Actor abs={abs} outfit={JENSEN} view="side" x={walkX} y={FEET} pose="walking" walkPhase={abs / 3.2} expression="deadpan" />
				</Layer>
				<OfficeFront f={abs} />
			</Scene>
			<StampTag f={f - 6} text="NOV 2026" x={1660} />
		</Wrap>
	);
};

// 6 — Top-down table: papers slide in, red ALLEGED stamp slams.
const B6: React.FC<BeatProps> = ({f, len, abs}) => {
	const cam = camAt(f, len, {x: 960, y: 540, zoom: 1.0}, {x: 960, y: 540, zoom: 1.12}, {kind: 'creep'});
	const papers = [
		{at: 0, x: 560, y: 470, r: -8, head: 'NVIDIA BOSS QUITS'},
		{at: 8, x: 1330, y: 430, r: 6, head: 'BOARD PROBE'},
		{at: 16, x: 960, y: 640, r: -2, head: 'SPY REPORT'},
	];
	const stampAt = 14 + 8;
	const st = f - stampAt;
	return (
		<Wrap vig={0.4}>
			<Scene cam={cam} bg="#5A3A22">
				<Layer>
					<Patterned x={-200} y={-200} w={2400} h={1500} fill="#7A4E2E" pattern="planks" cell={160} />
					<LightDisc cx={960} cy={540} r={700} o={0.25} />
					{papers.map((p, i) => {
						const t = easeOut((f - p.at) / 5);
						if (f < p.at) return null;
						return (
							<g key={i} transform={`translate(${lerp(p.x < 960 ? -500 : 2400, p.x, t)},${p.y}) rotate(${p.r})`}>
								<rect x={-260} y={-180} width={520} height={360} fill="#F1ECDD" {...O} />
								<text x={0} y={-110} textAnchor="middle" fontFamily={CAPS} fontSize={44} fill={INK}>
									{p.head}
								</text>
								<path d="M -230 -86 L 230 -86" stroke={INK} strokeWidth={3} />
								<rect x={-230} y={-66} width={170} height={130} fill="#C9C3AE" stroke={INK} strokeWidth={2.5} />
								{[0, 1, 2, 3, 4, 5].map((k) => (
									<path key={k} d={`M -40 ${-56 + k * 24} L 230 ${-56 + k * 24}`} stroke="#999" strokeWidth={6} />
								))}
								<text x={-200} y={150} fontFamily={HAND} fontWeight={700} fontSize={28} fill="#555">
									Nov. 2026
								</text>
							</g>
						);
					})}
					{st >= 0 && (
						<g transform={`translate(1000,610) rotate(-7) scale(${st < 6 ? lerp(1.7, 1, easeOut(st / 6)) : 1})`}>
							<rect x={-220} y={-62} width={440} height={124} rx={10} fill="none" stroke={PALETTE.red} strokeWidth={10} />
							<text x={0} y={34} textAnchor="middle" fontFamily={CAPS} fontSize={96} fill={PALETTE.red}>
								ALLEGED
							</text>
						</g>
					)}
					{/* coffee cup prop */}
					<g transform="translate(1600,820)">
						<circle r={70} fill="#E8E2D4" {...O} />
						<circle r={50} fill="#4A2A1A" />
						<path d="M 66 -10 Q 110 0 66 20" stroke={INK} strokeWidth={10} fill="none" />
					</g>
				</Layer>
			</Scene>
		</Wrap>
	);
};

// 7 — Insert: charge sheet on a clipboard; NONE stamp on "charged".
const B7: React.FC<BeatProps> = ({f, len}) => {
	const cam = camAt(f, len, {x: 960, y: 540, zoom: 1.05}, {x: 960, y: 520, zoom: 1.15}, {kind: 'creep'});
	const st = f - 25;
	return (
		<Wrap vig={0.35} grade="#ACBAB7" gradeO={0.2}>
			<Scene cam={cam} bg="#4A6B6E">
				<Layer p={0.8}>
					<Patterned x={-300} y={-300} w={2600} h={1700} fill="#4A6B6E" pattern="stripes" cell={90} />
				</Layer>
				<Layer>
					<rect x={660} y={150} width={600} height={800} rx={20} fill="#8A5A34" {...O} />
					<rect x={700} y={210} width={520} height={710} fill="#F4F1EA" {...O} />
					<rect x={860} y={120} width={200} height={70} rx={12} fill="#AFAFAF" {...O} />
					<text x={960} y={300} textAnchor="middle" fontFamily={CAPS} fontSize={52} fill={INK}>
						CHARGES
					</text>
					{[0, 1, 2, 3, 4].map((k) => (
						<g key={k}>
							<rect x={740} y={360 + k * 100} width={40} height={40} fill="none" stroke={INK} strokeWidth={3} />
							<path d={`M 800 ${395 + k * 100} L 1180 ${395 + k * 100}`} stroke="#BBB" strokeWidth={3} strokeDasharray="10 10" />
						</g>
					))}
					{st >= 0 && (
						<g transform={`translate(960,600) rotate(8) scale(${st < 6 ? lerp(1.7, 1, easeOut(st / 6)) : 1})`}>
							<rect x={-180} y={-70} width={360} height={140} rx={12} fill="none" stroke={PALETTE.red} strokeWidth={10} />
							<text x={0} y={36} textAnchor="middle" fontFamily={CAPS} fontSize={104} fill={PALETTE.red}>
								NONE
							</text>
						</g>
					)}
				</Layer>
			</Scene>
		</Wrap>
	);
};

// 8 — "But here's the strange part" → earnings: back-view reveal, screen switches on, counter to $115B, stack build.
const MoneyStack: React.FC<{f: number; n: number; x: number; y: number; times: number[]}> = ({f, x, y, times}) => (
	<g>
		{times.map((t, i) => {
			if (f < t) return null;
			const d = easeOut((f - t) / 6);
			const yy = y - i * 34;
			return (
				<g key={i} transform={`translate(${x},${lerp(yy - 500, yy, d)})`}>
					<rect x={-90} y={-30} width={180} height={34} rx={4} fill={PALETTE.accentBody} {...O} strokeWidth={3.5} />
					<rect x={-30} y={-30} width={60} height={34} fill="#E8E2C4" stroke={INK} strokeWidth={2} />
					<text x={0} y={-6} textAnchor="middle" fontFamily={CAPS} fontSize={20} fill={INK}>
						$
					</text>
				</g>
			);
		})}
	</g>
);

const B8: React.FC<BeatProps> = ({f, len, abs}) => {
	const onAt = 486 - 462; // "strange"
	const on = f >= onAt;
	const countFrom = 583 - 462;
	const val = f < countFrom ? 0 : countValue(f - countFrom, 34, 0, 115.8);
	// camera: back-view push to screen, then pull back + crane up with the stack
	let cam: Cam;
	if (f < 66) cam = camAt(f, 66, {x: 980, y: 520, zoom: 1.35}, {x: 980, y: 480, zoom: 1.55}, {kind: 'creep'});
	else cam = camAt(f - 66, len - 66, {x: 1100, y: 560, zoom: 1.12}, {x: 1150, y: 470, zoom: 1.2}, {kind: 'settle'});
	const stackTimes = [130, 140, 145, 148, 151, 154, 156, 158, 160, 162];
	const surprised = f > countFrom + 10;
	return (
		<Wrap grade="#D4D0BF" gradeO={0.2} vig={0.35}>
			<Scene cam={cam} bg="#C9C3AE">
				<OfficeBack
					f={abs}
					board={
						<g>
							{on && <rect x={712} y={302} width={536} height={276} fill="#16231A" />}
							{on && f - onAt < 3 && <rect x={680} y={270} width={600} height={340} fill="none" stroke={PALETTE.accent} strokeWidth={6} opacity={0.8} />}
							{on && (
								<text x={980} y={480} textAnchor="middle" fontFamily={CAPS} fontSize={96} fill={PALETTE.accent}>
									${val.toFixed(1)}B
								</text>
							)}
							{on && (
								<text x={980} y={370} textAnchor="middle" fontFamily={CAPS} fontSize={34} fill="#CFE8B8">
									SALES, 3 MONTHS
								</text>
							)}
						</g>
					}
				/>
				<Layer>
					{on && <LightDisc cx={980} cy={500} r={460} color={PALETTE.accent} o={0.25} />}
					<MoneyStack f={f} n={10} x={1500} y={FEET - 10} times={stackTimes} />
					<Actor abs={abs} outfit={DANA} view={f < 66 ? 'back' : '3q'} x={f < 66 ? 980 : 560} y={FEET + (f < 66 ? 150 : 0)} scale={f < 66 ? 1.25 : 1} expression={surprised ? 'surprised' : 'neutral'} />
					{f >= 66 && <Actor abs={abs} outfit={RAY} view="3q" x={760} y={FEET} expression={surprised ? 'surprised' : 'neutral'} marks={surprised ? ['sparkles'] : []} />}
				</Layer>
				<OfficeFront f={abs} />
			</Scene>
			<CornerStrip f={f - 66} text="NOV 17, 2026" hold={60} />
		</Wrap>
	);
};

// 9 — Black card.
const B9: React.FC<BeatProps> = ({f}) => <BlackCard text="About fifty million an hour." f={f} startTyping={4} cps={20} />;

// Skit room (office, over-the-shoulder / reverse / two-shot / close-up)
type SkitCfg = {talkA?: [number, number]; talkB?: [number, number]; frame: 'otsA' | 'otsB' | 'two' | 'closeB'; exprA?: any; exprB?: any; marksA?: any[]};
const OfficeSkit: React.FC<BeatProps & SkitCfg> = ({f, len, abs, talkA, talkB, frame, exprA = 'concerned', exprB = 'deadpan', marksA = []}) => {
	// A = Ray (asks), B = Dana (answers)
	let cam: Cam = {x: 960, y: 520, zoom: 1.4};
	let a: Partial<CharacterProps> = {};
	let b: Partial<CharacterProps> = {};
	if (frame === 'otsA') {
		cam = {x: 1060, y: 470, zoom: 1.55};
		b = {view: 'back', x: 700, y: FEET + 220, scale: 1.55};
		a = {view: '3q', mirror: true, x: 1220, y: FEET};
	} else if (frame === 'otsB') {
		cam = {x: 860, y: 470, zoom: 1.55};
		a = {view: 'back', x: 1230, y: FEET + 220, scale: 1.55};
		b = {view: '3q', x: 700, y: FEET};
	} else if (frame === 'two') {
		cam = {x: 960, y: 500, zoom: 1.45};
		a = {view: 'side', mirror: true, x: 1150, y: FEET};
		b = {view: 'side', x: 770, y: FEET};
	} else {
		cam = {x: 760, y: 410, zoom: 2.7};
		b = {view: '3q', x: 760, y: FEET};
		a = {view: 'side', mirror: true, x: 1400, y: FEET};
	}
	const c = camAt(f, len, cam, cam, {kind: 'still'});
	return (
		<Wrap grade="#D4D0BF" gradeO={0.2} vig={0.35}>
			<Scene cam={c} bg="#C9C3AE">
				<OfficeBack f={abs} board={<text x={980} y={480} textAnchor="middle" fontFamily={CAPS} fontSize={96} fill={PALETTE.accent}>$115.8B</text>} />
				<Layer>
					<LightDisc cx={980} cy={500} r={460} color={PALETTE.accent} o={0.2} />
					{frame === 'otsB' || frame === 'closeB' ? (
						<>
							<Actor abs={abs} outfit={DANA} talk={talkB} expression={exprB} {...(b as any)} />
							<Actor abs={abs} outfit={RAY} talk={talkA} expression={exprA} marks={marksA} {...(a as any)} />
						</>
					) : (
						<>
							<Actor abs={abs} outfit={RAY} talk={talkA} expression={exprA} marks={marksA} {...(a as any)} />
							<Actor abs={abs} outfit={DANA} talk={talkB} expression={exprB} {...(b as any)} />
						</>
					)}
				</Layer>
			</Scene>
		</Wrap>
	);
};

const B10: React.FC<BeatProps> = (p) => <OfficeSkit {...p} frame="otsA" talkA={[749, 766]} exprA="concerned" />;
const B11: React.FC<BeatProps> = (p) => <OfficeSkit {...p} frame="otsB" talkB={[779, 801]} exprB="deadpan" />;
const B12: React.FC<BeatProps> = (p) => <OfficeSkit {...p} frame="two" talkA={[826, 844]} exprA="thinking" exprB="deadpan" />;
const B13: React.FC<BeatProps> = (p) => <OfficeSkit {...p} frame="closeB" talkB={[861, 871]} exprB="deadpan" />;

// 14 — Return to the opening image: the stage, but the jacket hangs empty on a stand. Title lands over it.
const StageJacket: React.FC<BeatProps & {from: Cam; to: Cam; title?: boolean; titleF?: number}> = ({f, len, abs, from, to, title, titleF = 0}) => {
	const cam = camAt(f, len, from, to, {kind: 'creep'});
	return (
		<Wrap grade={PALETTE.night} gradeO={0.25} vig={0.6}>
			<Scene cam={cam} bg="#0A0C18">
				<StageBack f={abs} screen={<text x={960} y={340} textAnchor="middle" fontFamily={CAPS} fontSize={120} fill={PALETTE.accent} opacity={0.35}>NVIDIA</text>} />
				<Layer>
					<HeroJacket x={960} y={FEET + 10} scale={1.05} glow={1} />
				</Layer>
				<Layer p={1.5} blur={5}>
					{/* audience heads foreground */}
					{[-120, 200, 520, 1400, 1720, 2040].map((x, i) => (
						<g key={i}>
							<circle cx={x} cy={1130} r={110} fill="#0B0C12" stroke="#000" strokeWidth={4} />
						</g>
					))}
				</Layer>
			</Scene>
			{title && (
				<TitleOverlay
					f={titleF}
					lines={[{t: 'WHY NVIDIA'}, {t: 'WOULD FAIL WITHOUT'}, {t: 'JENSEN HUANG', accent: true}]}
				/>
			)}
		</Wrap>
	);
};
const B14: React.FC<BeatProps> = (p) => <StageJacket {...p} from={{x: 960, y: 500, zoom: 1.05}} to={{x: 960, y: 470, zoom: 1.18}} />;
const B15: React.FC<BeatProps> = (p) => <StageJacket {...p} from={{x: 960, y: 470, zoom: 1.18}} to={{x: 960, y: 465, zoom: 1.24}} title titleF={p.f} />;
const B16: React.FC<BeatProps> = () => <ChapterCard text="The Man Who Bet Everything" />;

// 17 — 1996 flashback: calendar pages rip (30, 29, 28 …) accelerating on "a month of cash left".
const B17: React.FC<BeatProps> = ({f, len, abs}) => {
	const cam = camAt(f, len, {x: 900, y: 520, zoom: 1.12}, {x: 760, y: 470, zoom: 1.3}, {kind: 'creep'});
	const gaps = [10, 5, 3, 3, 3, 2, 2, 2, 2, 2];
	let t0 = 1141 - 1077; // "month"
	const rips: number[] = [];
	gaps.forEach((g) => {
		rips.push(t0);
		t0 += g;
	});
	const ripped = rips.filter((r) => f >= r).length;
	const day = 30 - ripped;
	const lastRip = ripped > 0 ? rips[ripped - 1] : -99;
	const tt = clamp((f - lastRip) / 10);
	return (
		<Wrap grade="#5A4A38" gradeO={0.35} vig={0.4}>
			<Scene cam={cam} bg="#B9A580">
				<Office96Back
					f={abs}
					calendar={
						<g>
							<Calendar x={420} y={160} top="DAYS LEFT" big={String(day)} w={170} c="#7A3A2A" />
							{ripped > 0 && tt < 1 && (
								<g transform={`translate(${420 + tt * 80},${160 + 50 + tt * tt * 520}) rotate(${tt * 120})`} opacity={1 - tt * 0.5}>
									<rect x={-85} y={0} width={170} height={140} fill="#F4F1EA" {...O} />
									<text x={0} y={100} textAnchor="middle" fontFamily={CAPS} fontSize={80} fill={INK}>
										{day + 1}
									</text>
								</g>
							)}
						</g>
					}
				/>
				<Layer>
					<CrtDesk x={1000} y={FEET - 190} />
					<Actor abs={abs} outfit={young} view="3q" mirror x={700} y={FEET} expression={f > 70 ? 'panic' : 'concerned'} marks={f > 70 ? ['sweat'] : []} />
				</Layer>
			</Scene>
			<StampTag f={f - 2} text="1996" x={1640} />
		</Wrap>
	);
};

// 18 — Sega deal: life ring "$5M" drops on "$5 million".
const B18: React.FC<BeatProps> = ({f, len, abs}) => {
	const cam = camAt(f, len, {x: 960, y: 500, zoom: 1.3}, {x: 960, y: 480, zoom: 1.42}, {kind: 'creep'});
	const dropAt = 1236 - 1196;
	const d = easeIn(clamp((f - dropAt) / 7));
	const landed = f >= dropAt + 7;
	const puff = f - (dropAt + 7);
	return (
		<Wrap grade="#5A4A38" gradeO={0.35} vig={0.4}>
			<Scene cam={cam} bg="#B9A580">
				<Office96Back f={abs} calendar={<Calendar x={420} y={160} top="DAYS LEFT" big="20" w={170} c="#7A3A2A" />} />
				<Layer>
					{/* table */}
					<rect x={760} y={FEET - 170} width={400} height={24} fill="#8A6A44" {...O} />
					<path d={`M 800 ${FEET - 146} L 800 ${FEET} M 1120 ${FEET - 146} L 1120 ${FEET}`} stroke={INK} strokeWidth={10} />
					<g transform={`translate(1100,${FEET - 170})`}>
						<path d="M 0 0 L 0 -70" stroke={INK} strokeWidth={3} />
						<rect x={0} y={-70} width={70} height={40} fill="#1F3A8A" stroke={INK} strokeWidth={2.5} />
						<text x={35} y={-42} textAnchor="middle" fontFamily={CAPS} fontSize={20} fill="#fff">
							SEGA
						</text>
					</g>
					<Actor abs={abs} outfit={young} view="3q" x={600} y={FEET} expression={landed ? 'happy' : 'concerned'} pose={landed ? 'cheering' : 'talking'} />
					<Actor abs={abs} outfit={sega} view="3q" mirror x={1320} y={FEET} expression={landed ? 'neutral' : 'thinking'} pose={landed ? 'pointing' : 'idle'} />
					{f >= dropAt && (
						<g transform={`translate(960,${lerp(-200, FEET - 250, d)})`}>
							<circle r={95} fill="none" stroke="#E8E2D4" strokeWidth={46} />
							{[0, 1, 2, 3].map((k) => (
								<path key={k} d={`M ${Math.cos((k * Math.PI) / 2 + 0.4) * 72} ${Math.sin((k * Math.PI) / 2 + 0.4) * 72} L ${Math.cos((k * Math.PI) / 2 + 0.4) * 118} ${Math.sin((k * Math.PI) / 2 + 0.4) * 118}`} stroke={PALETTE.red} strokeWidth={30} />
							))}
							<circle r={118} fill="none" {...O} />
							<circle r={72} fill="none" {...O} />
							<text x={0} y={22} textAnchor="middle" fontFamily={CAPS} fontSize={64} fill={PALETTE.accentBody} stroke={INK} strokeWidth={2}>
								$5M
							</text>
						</g>
					)}
					{landed && puff < 8 &&
						[-1, 0, 1].map((k) => <circle key={k} cx={960 + k * 90 * (1 + puff / 8)} cy={FEET - 140} r={24} fill="#E8E2D4" opacity={1 - puff / 8} />)}
				</Layer>
			</Scene>
		</Wrap>
	);
};

// 19 — Top-down green felt: all the poker chips pushed onto the NEXT CHIP square.
const B19: React.FC<BeatProps> = ({f, len, abs}) => {
	const cam = camAt(f, len, {x: 900, y: 600, zoom: 1.15}, {x: 960, y: 540, zoom: 1.3}, {kind: 'punch', at: 1318 - 1296, dur: 10}, 0.08);
	const push = easeOut(prog(f, 1306 - 1296, 1320 - 1296));
	const r = rng(5);
	const chips = Array.from({length: 22}).map(() => [r() * 260 - 130, r() * 160 - 80, r() > 0.5 ? PALETTE.red : r() > 0.5 ? '#F4F1EA' : '#2C3E50']);
	const chipLand = f > 1330 - 1296;
	return (
		<Wrap vig={0.45} grade="#5A4A38" gradeO={0.25}>
			<Scene cam={cam} bg="#1E4D2E">
				<Layer>
					<rect x={-300} y={-300} width={2600} height={1700} fill="#22603A" />
					<Patterned x={-300} y={-300} w={2600} h={1700} fill="#22603A" pattern="dots" cell={60} />
					<rect x={-300} y={-300} width={2600} height={160} fill="#6E4726" {...O} />
					<rect x={740} y={340} width={440} height={300} rx={14} fill="none" stroke="#F4F1EA" strokeWidth={8} strokeDasharray="22 14" />
					<text x={960} y={700} textAnchor="middle" fontFamily={CAPS} fontSize={56} fill="#F4F1EA">
						NEXT CHIP
					</text>
					<LightDisc cx={960} cy={500} r={520} o={0.25} />
					{chips.map(([cx, cy, c], i) => (
						<g key={i} transform={`translate(${lerp(360 + (cx as number), 960 + (cx as number) * 0.6, push)},${lerp(860 + (cy as number), 490 + (cy as number) * 0.6, push)})`}>
							<circle r={34} fill={c as string} {...O} strokeWidth={3.5} />
							<circle r={22} fill="none" stroke="#fff" strokeWidth={4} strokeDasharray="8 8" />
						</g>
					))}
					{/* the pushing hands (mittens) */}
					<g transform={`translate(${lerp(120, 650, push)},${lerp(950, 620, push)}) rotate(-30)`}>
						<path d="M -400 0 L 0 0" stroke={INK} strokeWidth={8} />
						<ellipse cx={20} cy={0} rx={40} ry={32} fill={young.skin} {...O} />
					</g>
					{chipLand && (
						<g transform={`translate(960,${lerp(200, 490, easeOut((f - 34) / 6))})`}>
							<Chip glow={0} s={1.3} />
						</g>
					)}
				</Layer>
			</Scene>
		</Wrap>
	);
};

// 20 — "It worked." Glow switch-on, young Jensen cheers.
const B20: React.FC<BeatProps> = ({f, len, abs}) => {
	const onAt = 1375 - 1368;
	const on = f >= onAt;
	const ring = f - onAt;
	const cam = camAt(f, len, {x: 900, y: 470, zoom: 1.4}, {x: 900, y: 470, zoom: 1.4}, {kind: 'still'});
	return (
		<Wrap grade="#5A4A38" gradeO={on ? 0.2 : 0.35} vig={0.4}>
			<Scene cam={cam} bg="#B9A580">
				<Office96Back f={abs} calendar={<Calendar x={420} y={160} top="1997" big="OK!" w={170} c={PALETTE.accentBody} />} />
				<Layer>
					{on && <LightDisc cx={1040} cy={FEET - 280} r={420} color={PALETTE.accent} o={0.45} />}
					<CrtDesk x={1000} y={FEET - 190} glow={on ? 1 : 0} />
					{on && ring < 3 && <circle cx={1040} cy={FEET - 285} r={90 * (1 + ring * 0.035)} fill="none" stroke={PALETTE.accent} strokeWidth={5} />}
					<Actor abs={abs} outfit={young} view="3q" mirror x={700} y={FEET} expression={on ? 'happy' : 'surprised'} pose={on ? 'cheering' : 'idle'} marks={on ? ['sparkles'] : []} />
				</Layer>
			</Scene>
		</Wrap>
	);
};

// Kitchen helpers
const cookRow = (abs: number, n: number, x0: number, dx: number, y: number, s: number) =>
	Array.from({length: n}).map((_, i) => (
		<Actor key={i} abs={abs + i * 7} outfit={i % 2 ? COOK_B : COOK_A} view="back" x={x0 + i * dx} y={y} scale={s} pose={(Math.floor(abs / 12) + i) % 2 ? 'holding' : 'idle'} shadow={0.3} />
	));

// 21 — Kitchen establishing wide; travel pan along the line; more cooks on "thousands".
const B21: React.FC<BeatProps> = ({f, len, abs}) => {
	const cam = camAt(f, len, {x: 700, y: 540, zoom: 1.0}, {x: 1220, y: 540, zoom: 1.0}, {kind: 'creep'});
	const more = abs >= 1454;
	return (
		<Wrap grade="#ACBAB7" gradeO={0.15} vig={0.3}>
			<Scene cam={cam} bg="#DCE3DE">
				<KitchenBack f={abs} />
				<Layer p={0.85}>
					<Steam f={abs} xs={[-400, -160, 80, 320, 560, 800, 1040, 1280, 1520, 1760, 2000, 2240]} y={470} />
					{more && cookRow(abs, 14, -560, 240, FEET - 60, 0.6)}
				</Layer>
				<Layer>{cookRow(abs, 10, -300, 300, FEET + 30, 0.85)}</Layer>
			</Scene>
		</Wrap>
	);
};

// 22 — One chef picks the menu: Jensen in a toque, hero low angle, menu writes on.
const B22: React.FC<BeatProps> = ({f, len, abs}) => {
	const cam = camAt(f, len, {x: 1150, y: 520, zoom: 1.6}, {x: 1150, y: 500, zoom: 1.7}, {kind: 'settle'});
	const items = ['CHIPS', 'MORE CHIPS', 'BIG BETS'];
	const chef: Outfit = {...JENSEN, hair: 'toque', hairColor: '#FAF7EF', hairHighlight: '#FFFFFF'};
	return (
		<Wrap grade="#ACBAB7" gradeO={0.15} vig={0.35}>
			<Scene cam={cam} bg="#DCE3DE">
				<KitchenBack
					f={abs}
					menu={
						<g>
							{items.map((t, i) => {
								const at = 1505 - 1476 + i * 6;
								const n = Math.floor(clamp((f - at) / 8) * t.length);
								return (
									<text key={i} x={760} y={220 + i * 60} fontFamily={HAND} fontWeight={700} fontSize={50} fill="#F4F1EA">
										{t.slice(0, n)}
									</text>
								);
							})}
						</g>
					}
				/>
				<Layer>
					<Actor abs={abs} outfit={chef} view="3q" x={1340} y={FEET + 40} scale={1.1} pose={abs >= 1490 ? 'pointing' : 'idle'} mirror expression="neutral" />
				</Layer>
			</Scene>
		</Wrap>
	);
};

// Kitchen skit: A = cook 1 asks, B = cook 2 answers.
const KitchenSkit: React.FC<BeatProps & SkitCfg> = ({f, len, abs, talkA, talkB, frame, exprA = 'concerned', exprB = 'deadpan'}) => {
	let cam: Cam;
	let a: any;
	let b: any;
	if (frame === 'otsA') {
		cam = {x: 1060, y: 470, zoom: 1.55};
		b = {view: 'back', x: 700, y: FEET + 220, scale: 1.55};
		a = {view: '3q', mirror: true, x: 1220, y: FEET};
	} else if (frame === 'otsB') {
		cam = {x: 860, y: 470, zoom: 1.55};
		a = {view: 'back', x: 1230, y: FEET + 220, scale: 1.55};
		b = {view: '3q', x: 700, y: FEET};
	} else {
		cam = {x: 760, y: 395, zoom: 2.7};
		b = {view: '3q', x: 760, y: FEET};
		a = {view: 'side', mirror: true, x: 1400, y: FEET};
	}
	const c = camAt(f, len, cam, cam, {kind: 'still'});
	const B = <Actor abs={abs} outfit={COOK_B} talk={talkB} expression={exprB} {...b} />;
	const A = <Actor abs={abs} outfit={COOK_A} talk={talkA} expression={exprA} {...a} />;
	return (
		<Wrap grade="#ACBAB7" gradeO={0.15} vig={0.35}>
			<Scene cam={c} bg="#DCE3DE">
				<KitchenBack f={abs} menu={<text x={960} y={260} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={70} fill="#F4F1EA">???</text>} />
				<Layer p={0.85}>
					<Steam f={abs} xs={[80, 560, 1040, 1520]} y={470} />
				</Layer>
				<Layer>{frame === 'otsA' ? <>{A}{B}</> : <>{B}{A}</>}</Layer>
			</Scene>
		</Wrap>
	);
};
const B23: React.FC<BeatProps> = (p) => <KitchenSkit {...p} frame="otsA" talkA={[1542, 1560]} exprA="concerned" />;
const B24: React.FC<BeatProps> = (p) => <KitchenSkit {...p} frame="otsB" talkB={[1577, 1589]} exprB="deadpan" />;
const B25: React.FC<BeatProps> = (p) => <KitchenSkit {...p} frame="otsA" talkA={[1605, 1626]} exprA="surprised" />;
const B26: React.FC<BeatProps> = (p) => <KitchenSkit {...p} frame="closeB" talkB={[1636, 1670]} exprB="deadpan" exprA="sad" />;

// 27 — The cooks keep cooking; the chef's toque hangs on a hook.
const B27: React.FC<BeatProps> = ({f, len, abs}) => {
	const cam = camAt(f, len, {x: 960, y: 540, zoom: 1.05}, {x: 960, y: 540, zoom: 1.12}, {kind: 'creep'});
	return (
		<Wrap grade="#ACBAB7" gradeO={0.15} vig={0.3}>
			<Scene cam={cam} bg="#DCE3DE">
				<KitchenBack f={abs} menu={<text x={960} y={260} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={70} fill="#F4F1EA">???</text>} />
				<Layer p={0.85}>
					<Steam f={abs} xs={[80, 320, 560, 800, 1040, 1280, 1520, 1760]} y={470} />
				</Layer>
				<Layer>
					{cookRow(abs, 7, 60, 300, FEET + 30, 0.85)}
					{/* toque on a hook */}
					<g transform="translate(1560,420)">
						<path d="M 0 -60 L 0 -20" stroke={INK} strokeWidth={5} />
						<g transform="translate(0,90) scale(0.6)">
							<path d="M -56 -52 L -50 -96 L 50 -96 L 56 -52 Z" fill="#FAF7EF" {...O} />
							<path d="M -54 -96 C -84 -100 -80 -150 -46 -144 C -40 -176 0 -180 10 -156 C 26 -180 70 -168 62 -138 C 90 -132 84 -96 54 -96 Z" fill="#FAF7EF" {...O} />
						</g>
					</g>
				</Layer>
			</Scene>
		</Wrap>
	);
};

// 28 — Next quarter $130B: sliding comparison panels in the office; then "numbers will be great" with paper slips.
const B28: React.FC<BeatProps> = ({f, len, abs}) => {
	const p1 = 1745 - 1740;
	const p2 = 1778 - 1740;
	const flip = 1842 - 1740; // "The numbers will be great"
	const cam = f < flip ? camAt(f, flip, {x: 1000, y: 520, zoom: 1.15}, {x: 1000, y: 500, zoom: 1.25}, {kind: 'creep'}) : camAt(f - flip, len - flip, {x: 960, y: 520, zoom: 1.05}, {x: 960, y: 520, zoom: 1.05}, {kind: 'still'});
	const v2 = f < p2 ? 0 : countValue(f - p2, 30, 0, 130);
	const panel = (at: number, x: number, label: string, val: string, h: number) => {
		const d = easeOut((f - at) / 17);
		if (f < at) return null;
		return (
			<g transform={`translate(${x},${lerp(-700, 0, d)})`}>
				<rect x={-130} y={FEET - 40 - h} width={260} height={h} fill={PALETTE.accentBody} {...O} />
				{Array.from({length: Math.floor(h / 40)}).map((_, k) => (
					<path key={k} d={`M -130 ${FEET - 40 - k * 40} L 130 ${FEET - 40 - k * 40}`} stroke={INK} strokeWidth={2.5} opacity={0.5} />
				))}
				<rect x={-110} y={FEET - 110 - h} width={220} height={60} rx={6} fill="#1B222B" {...O} strokeWidth={3} />
				<text x={0} y={FEET - 66 - h} textAnchor="middle" fontFamily={CAPS} fontSize={40} fill={PALETTE.accent}>
					{val}
				</text>
				<text x={0} y={FEET - 5} textAnchor="middle" fontFamily={CAPS} fontSize={30} fill={INK}>
					{label}
				</text>
			</g>
		);
	};
	const slips = f >= flip;
	const r = rng(9);
	return (
		<Wrap grade="#D4D0BF" gradeO={0.2} vig={0.35}>
			<Scene cam={cam} bg="#C9C3AE">
				<OfficeBack f={abs} board={<text x={980} y={480} textAnchor="middle" fontFamily={CAPS} fontSize={96} fill={PALETTE.accent}>{slips ? '+12%' : 'Q4'}</text>} />
				<Layer>
					{slips && f - flip < 2 && <rect x={-500} y={-500} width={3000} height={2000} fill="#FFFFFF" opacity={0.4} />}
					{panel(p1, 1180, 'THIS QTR', '$115.8B', 300)}
					{panel(p2, 1480, 'NEXT QTR', `$${Math.round(v2)}B`, 340)}
					<Actor abs={abs} outfit={DANA} view="3q" x={520} y={FEET} expression={slips ? 'happy' : 'neutral'} pose={slips ? 'cheering' : 'idle'} />
					<Actor abs={abs} outfit={RAY} view="3q" x={780} y={FEET} expression={slips ? 'happy' : 'neutral'} pose={slips ? 'cheering' : 'idle'} />
					{slips &&
						Array.from({length: 12}).map((_, i) => {
							const t = (f - flip) / 30;
							const sx = 300 + r() * 1300;
							const vy = 18 + r() * 10;
							return <rect key={i} x={sx + Math.sin(t * 4 + i) * 30} y={FEET - 200 - vy * t * 30 + 9.8 * (t * 30) * (t * 30) * 0.03} width={22} height={14} fill={i % 2 ? '#F4F1EA' : PALETTE.accent} stroke={INK} strokeWidth={1.5} transform={`rotate(${t * 300 + i * 30},${sx},${FEET - 200})`} />;
						})}
				</Layer>
				<OfficeFront f={abs} />
			</Scene>
		</Wrap>
	);
};

// 29 — Black card.
const B29: React.FC<BeatProps> = ({f}) => <BlackCard text="That's the trap." f={f} startTyping={2} cps={20} />;

// 30 — Boardroom: group stays wide and still; empty chair at the head.
const B30: React.FC<BeatProps> = ({f, len, abs}) => {
	const cam = camAt(f, len, {x: 960, y: 560, zoom: 1.35}, {x: 960, y: 560, zoom: 1.35}, {kind: 'still'});
	return (
		<Wrap grade="#13192B" gradeO={0.3} vig={0.55}>
			<Scene cam={cam} bg="#2A1D15">
				<BoardroomBack f={abs} />
				<Layer>
					{[540, 960, 1380].map((x, i) => (
						<Actor key={i} abs={abs + i * 13} outfit={EXTRAS[i]} view="front" x={x} y={FEET - 40} scale={0.85} expression="deadpan" talk={i === 1 ? [1927, 1975] : undefined} />
					))}
					{/* long table */}
					<rect x={260} y={FEET - 120} width={1400} height={40} fill="#4A2E1E" {...O} />
					<rect x={300} y={FEET - 80} width={1320} height={170} fill="#3A2416" {...O} />
					{/* empty CEO chair in front */}
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

// 31 — Museum: the jacket hangs empty; push in, then pull out on the final question.
const B31: React.FC<BeatProps> = ({f, len, abs}) => {
	const split = 2034 - 1985;
	const cam = f < split ? camAt(f, split, {x: 960, y: 470, zoom: 1.35}, {x: 960, y: 440, zoom: 1.6}, {kind: 'creep'}) : camAt(f - split, len - split, {x: 960, y: 450, zoom: 1.5}, {x: 960, y: 520, zoom: 1.02}, {kind: 'settle'});
	return (
		<Wrap grade={PALETTE.night} gradeO={0.3} vig={0.6}>
			<Scene cam={cam} bg="#0A0C18">
				<MuseumBack f={abs} />
				<Layer>
					<HeroJacket x={960} y={FEET + 10} scale={1} glow={1} label="1993-2026" />
				</Layer>
			</Scene>
		</Wrap>
	);
};

// =============================== TABLE ===============================
export const BEATS: Beat[] = [
	{id: 1, from: 0, to: 76, shot: 'Story (hero)', set: 'Keynote stage, dark', words: 'This is Jensen Huang,', camera: 'push-in creep', effect: 'stage light flicker (quiet)', C: B1},
	{id: 2, from: 76, to: 132, shot: 'Insert: build (counter)', set: 'Brick wall + calendar', words: '33 years running Nvidia,', camera: 'settle', effect: 'none', C: B2},
	{id: 3, from: 132, to: 196, shot: 'Object close-up', set: 'Keynote stage', words: 'same black leather jacket.', camera: 'creep + punch on "jacket"', effect: 'none', C: B3},
	{id: 4, from: 196, to: 275, shot: 'Black card', set: '-', words: 'Then, in one week, he was gone.', camera: 'still', effect: 'none', C: B4},
	{id: 5, from: 275, to: 345, shot: 'Story (walk out)', set: 'Nvidia office, day', words: 'He quit after reports', camera: 'travel pan with walker', effect: 'window light bands', C: B5},
	{id: 6, from: 345, to: 406, shot: 'Table-top: side-slide + slam', set: 'Wood table top-down', words: 'linked him to an alleged Chinese spy.', camera: 'push-in creep', effect: 'none', C: B6},
	{id: 7, from: 406, to: 462, shot: 'Insert: slam sticker', set: 'Striped wall + clipboard', words: "He hasn't been charged.", camera: 'push-in creep', effect: 'none', C: B7},
	{id: 8, from: 462, to: 680, shot: 'Back-view reveal → counter + stack build (HOLD 7.3 s)', set: 'Nvidia office, day', words: "But here's the strange part. Five days later, Nvidia reported $115 billion in sales,", camera: 'push-in, cut-in-camera reframe, crane up with stack', effect: 'screen glow', C: B8},
	{id: 9, from: 680, to: 742, shot: 'Black card (twist)', set: '-', words: 'about $50 million an hour.', camera: 'still', effect: 'none', C: B9},
	{id: 10, from: 742, to: 778, shot: 'Skit OTS', set: 'Office', words: "- We're fine?", camera: 'locked', effect: 'none', C: B10},
	{id: 11, from: 778, to: 818, shot: 'Skit OTS reverse', set: 'Office', words: '- Record quarter.', camera: 'locked', effect: 'none', C: B11},
	{id: 12, from: 818, to: 856, shot: 'Skit two-shot profile', set: 'Office', words: "- Who's driving?", camera: 'locked', effect: 'none', C: B12},
	{id: 13, from: 856, to: 900, shot: 'Skit close-up (punchline)', set: 'Office', words: '- Interim.', camera: 'locked', effect: 'none', C: B13},
	{id: 14, from: 900, to: 960, shot: 'Hero object (return to opening image)', set: 'Keynote stage, jacket on stand', words: 'So can Nvidia win without him?', camera: 'push-in creep', effect: 'accent glow, light flicker', C: B14},
	{id: 15, from: 960, to: 1014, shot: 'Title card over live scene', set: 'Keynote stage', words: '(title)', camera: 'creep', effect: 'same', C: B15},
	{id: 16, from: 1014, to: 1077, shot: 'Chapter card 2.1 s', set: '-', words: '(silent)', camera: 'still', effect: 'none', C: B16},
	{id: 17, from: 1077, to: 1196, shot: 'Story + calendar rip build', set: '1996 office, sepia', words: 'In 1996, Nvidia had about a month of cash left.', camera: 'push-in creep to calendar', effect: 'none', C: B17},
	{id: 18, from: 1196, to: 1296, shot: 'Literal metaphor: lifeline drop', set: '1996 office, sepia', words: 'Huang talked Sega into a $5 million lifeline.', camera: 'push-in creep', effect: 'dust puff on landing', C: B18},
	{id: 19, from: 1296, to: 1368, shot: 'Table-top pun: all chips on NEXT CHIP', set: 'Green felt top-down', words: 'Then he bet it all on the next chip.', camera: 'creep + punch on "all"', effect: 'none', C: B19},
	{id: 20, from: 1368, to: 1412, shot: 'Glow switch-on', set: '1996 office', words: 'It worked.', camera: 'still', effect: 'screen glow', C: B20},
	{id: 21, from: 1412, to: 1476, shot: 'Establishing wide, travel pan', set: 'Kitchen', words: 'Think of a kitchen. Thousands of cooks.', camera: 'travel pan', effect: 'steam (main)', C: B21},
	{id: 22, from: 1476, to: 1536, shot: 'Hero low angle + menu writes on', set: 'Kitchen', words: 'One chef picks the menu.', camera: 'settle', effect: 'none', C: B22},
	{id: 23, from: 1536, to: 1572, shot: 'Skit OTS', set: 'Kitchen', words: '- Who picks now?', camera: 'locked', effect: 'steam (quiet)', C: B23},
	{id: 24, from: 1572, to: 1604, shot: 'Skit OTS reverse', set: 'Kitchen', words: '- A committee.', camera: 'locked', effect: 'steam (quiet)', C: B24},
	{id: 25, from: 1604, to: 1636, shot: 'Skit OTS', set: 'Kitchen', words: '- How fast?', camera: 'locked', effect: 'steam (quiet)', C: B25},
	{id: 26, from: 1636, to: 1692, shot: 'Skit close-up (punchline)', set: 'Kitchen', words: '- ...Next quarter.', camera: 'locked', effect: 'steam (quiet)', C: B26},
	{id: 27, from: 1692, to: 1740, shot: 'Story wide', set: 'Kitchen, toque on hook', words: 'The cooks can keep cooking.', camera: 'push-in creep', effect: 'steam (main)', C: B27},
	{id: 28, from: 1740, to: 1882, shot: 'Sliding comparison panels → state flip', set: 'Office', words: 'Next quarter, Nvidia expects $130 billion. The numbers will be great.', camera: 'creep, then locked wide', effect: 'paper slips', C: B28},
	{id: 29, from: 1882, to: 1925, shot: 'Black card', set: '-', words: "That's the trap.", camera: 'still', effect: 'none', C: B29},
	{id: 30, from: 1925, to: 1985, shot: 'Group wide (still)', set: 'Boardroom, night', words: "The board says he isn't coming back.", camera: 'still (group)', effect: 'lamp glow', C: B30},
	{id: 31, from: 1985, to: 2081, shot: 'Hero object: push in, then pull out', set: 'Museum hall, dark', words: 'The jacket hangs empty. So who picks the next bet?', camera: 'push-in → pull-out', effect: 'dust in spotlight (main)', C: B31},
];
