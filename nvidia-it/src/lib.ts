import timings from './timings.json';

export const FPS = 30;
export const TOTAL = (timings as any).totalFrames as number;
export const LOUD: number[] = (timings as any).loudness;
export type Line = {id: number; text: string; start: number; end: number; startFrame: number; endFrame: number; words: {w: string; s: number; e: number}[]};
export const LINES: Line[] = (timings as any).lines;

export const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeOut = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
export const easeIn = (t: number) => Math.pow(clamp(t), 3);
export const easeInOut = (t: number) => {
	const x = clamp(t);
	return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
export const prog = (f: number, a: number, b: number) => clamp((f - a) / (b - a));

// frame at which a given word of a line is spoken (absolute)
export const wordFrame = (lineId: number, wordIdx: number) => Math.round(LINES[lineId].words[wordIdx].s * FPS);

// Seeded RNG
export const rng = (seed: number) => {
	let s = seed >>> 0;
	return () => {
		s = (s * 1664525 + 1013904223) >>> 0;
		return s / 4294967296;
	};
};

// Blink: about every 3.2 s, never on frame 0, 3 frames long.
export const isBlinking = (frame: number, seed: number) => {
	if (frame <= 2) return false;
	const period = 96 + (seed % 17);
	const ph = (frame + seed * 31) % period;
	return ph < 3;
};

// Lip sync: pick a mouth shape from loudness bands, hold 3 frames, never the same twice running.
const SHAPES = ['closed', 'smallO', 'tallO', 'wide', 'smile'] as const;
export type MouthShape = (typeof SHAPES)[number];
export const mouthAt = (absFrame: number, from: number, to: number): MouthShape | undefined => {
	if (absFrame < from || absFrame > to) return undefined;
	const slot = Math.floor((absFrame - from) / 3);
	let prev: MouthShape = 'closed';
	let cur: MouthShape = 'closed';
	for (let i = 0; i <= slot; i++) {
		const fr = from + i * 3;
		const l = LOUD[fr] ?? 0;
		let pick: MouthShape = l < 0.25 ? 'closed' : l < 0.45 ? 'smallO' : l < 0.6 ? 'smile' : l < 0.75 ? 'tallO' : 'wide';
		if (pick === prev) pick = SHAPES[(SHAPES.indexOf(pick) + 1 + (i % 2)) % SHAPES.length];
		prev = pick;
		cur = pick;
	}
	return cur;
};
