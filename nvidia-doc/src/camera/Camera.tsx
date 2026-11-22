import React, {createContext, useContext} from 'react';

// Flat-set camera: always level, square to the back wall. Depth comes from layers
// with different parallax factors spreading apart as the camera pushes or pans.
export type Cam = {x: number; y: number; zoom: number; rot?: number};
const CamCtx = createContext<Cam>({x: 960, y: 540, zoom: 1});

export const W = 1920;
export const H = 1080;

export const Scene: React.FC<{cam: Cam; children: React.ReactNode; bg?: string}> = ({cam, children, bg = '#000'}) => (
	<CamCtx.Provider value={cam}>
		<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0, background: bg}}>
			<g transform={cam.rot ? `rotate(${cam.rot},960,540)` : undefined}>{children}</g>
		</svg>
	</CamCtx.Provider>
);

// p = parallax: 1 = cast plane, <1 further back, >1 foreground.
export const Layer: React.FC<{p?: number; blur?: number; children: React.ReactNode}> = ({p = 1, blur = 0, children}) => {
	const c = useContext(CamCtx);
	const z = 1 + (c.zoom - 1) * p;
	const fx = W / 2 + (c.x - W / 2) * p;
	const fy = H / 2 + (c.y - H / 2) * p;
	return (
		<g transform={`translate(${W / 2},${H / 2}) scale(${z}) translate(${-fx},${-fy})`} style={blur ? {filter: `blur(${blur}px)`} : undefined}>
			{children}
		</g>
	);
};

// Camera move helpers -------------------------------------------------------
import {clamp, easeInOut, easeOut, lerp} from '../lib';

export type Move =
	| {kind: 'creep'} // constant speed for the whole shot
	| {kind: 'settle'} // finish in first third, then hold
	| {kind: 'punch'; at: number; dur?: number} // slow creep then +punch landing on frame `at` (local)
	| {kind: 'still'};

export const camAt = (f: number, len: number, a: Cam, b: Cam, m: Move, punchAmt = 0.12): Cam => {
	let t = 0;
	let extra = 0;
	switch (m.kind) {
		case 'creep':
			t = clamp(f / len);
			break;
		case 'settle':
			t = easeOut(f / (len / 3));
			break;
		case 'punch': {
			t = clamp(f / len) * 0.6;
			const d = m.dur ?? 12;
			extra = easeOut((f - (m.at - d)) / d) * punchAmt;
			break;
		}
		case 'still':
			t = 0;
			break;
	}
	// tiny hand-held drift so still moments stay alive
	const dx = Math.sin(f / 37) * 1.5;
	const dy = Math.cos(f / 43) * 1.2;
	return {x: lerp(a.x, b.x, t) + dx, y: lerp(a.y, b.y, t) + dy, zoom: lerp(a.zoom, b.zoom, t) * (1 + extra), rot: a.rot};
};

export const smooth = easeInOut;
