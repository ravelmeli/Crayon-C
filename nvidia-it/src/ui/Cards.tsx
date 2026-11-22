import React from 'react';
import {AbsoluteFill} from 'remotion';
import {clamp, easeOut, prog} from '../lib';
import {PALETTE} from '../rig/outfits';
import {CAPS, HAND} from './Fonts';

// Black text card: pure black, one line of white handwriting typed on at ~19 chars/s.
export const BlackCard: React.FC<{text: string; f: number; startTyping?: number; cps?: number}> = ({text, f, startTyping = 0, cps = 19}) => {
	const n = Math.max(0, Math.floor(((f - startTyping) / 30) * cps));
	const shown = text.slice(0, Math.min(text.length, n));
	return (
		<AbsoluteFill style={{background: '#000', alignItems: 'center', justifyContent: 'center'}}>
			<div style={{fontFamily: HAND, fontWeight: 700, fontSize: Math.min(118, 1750 / (text.length * 0.46)), color: '#fff', whiteSpace: 'nowrap', position: 'relative'}}>
				<span style={{visibility: 'hidden'}}>{text}</span>
				<span style={{position: 'absolute', left: 0, top: 0}}>{shown}</span>
			</div>
		</AbsoluteFill>
	);
};

// Silent chapter card, shown complete.
export const ChapterCard: React.FC<{text: string}> = ({text}) => (
	<AbsoluteFill style={{background: '#000', alignItems: 'center', justifyContent: 'center'}}>
		<div style={{fontFamily: HAND, fontWeight: 700, fontSize: 96, color: '#F4F1EA'}}>{text}</div>
		<div style={{width: 160, height: 5, background: PALETTE.accent, marginTop: 18, borderRadius: 3}} />
	</AbsoluteFill>
);

// Title over the live scene: cream brushed caps, lines arriving ~0.33 s apart, one line in accent.
export const TitleOverlay: React.FC<{f: number; lines: {t: string; accent?: boolean}[]}> = ({f, lines}) => (
	<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.45), rgba(0,0,0,0) 70%)'}}>
		{lines.map((l, i) => {
			const t = easeOut(prog(f, i * 10, i * 10 + 6));
			return (
				<div
					key={i}
					style={{
						fontFamily: CAPS,
						fontSize: l.accent ? 150 : 110,
						lineHeight: 1.05,
						color: l.accent ? PALETTE.accent : '#F4EBD4',
						opacity: t > 0 ? 1 : 0,
						transform: `translateY(${(1 - t) * -40}px)`,
						textShadow: '0 6px 0 rgba(0,0,0,0.55)',
						letterSpacing: 2,
					}}
				>
					{l.t}
				</div>
			);
		})}
	</AbsoluteFill>
);

// Small level dark strip in a corner with accent bar, typed on in half a second.
export const CornerStrip: React.FC<{f: number; text: string; corner?: 'tl' | 'tr'; hold?: number}> = ({f, text, corner = 'tl', hold = 70}) => {
	if (f < 0 || f > hold + 8) return null;
	const n = Math.floor(clamp(f / 15) * text.length);
	const out = f > hold ? 1 - (f - hold) / 8 : 1;
	return (
		<div style={{position: 'absolute', top: 54, [corner === 'tl' ? 'left' : 'right']: 64, opacity: out, display: 'flex', alignItems: 'stretch', height: 50, filter: 'drop-shadow(0 4px 0 rgba(0,0,0,0.35))'}}>
			<div style={{width: 10, background: PALETTE.accent}} />
			<div style={{background: '#1B222B', color: '#F4F1EA', fontFamily: CAPS, fontSize: 32, padding: '6px 20px 0', whiteSpace: 'nowrap', minWidth: 40}}>{text.slice(0, n)}</div>
		</div>
	);
};

// Yellow tag hanging from a string at a top corner; drops in and swings like a damped pendulum.
export const StampTag: React.FC<{f: number; text: string; x?: number}> = ({f, text, x = 1640}) => {
	if (f < 0) return null;
	const drop = easeOut(f / 7);
	const ang = 14 * Math.exp(-f / 18) * Math.cos(f / 3.2);
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
			<g transform={`translate(${x},0) rotate(${ang}) translate(0,${(drop - 1) * 200})`}>
				<path d="M 0 0 L 0 120" stroke="#222" strokeWidth={3} />
				<g transform="translate(0,120)">
					<rect x={-100} y={0} width={200} height={78} rx={8} fill="#F2C744" stroke="#111" strokeWidth={4} />
					<circle cx={0} cy={14} r={6} fill="#fff" stroke="#111" strokeWidth={2.5} />
					<text x={0} y={62} textAnchor="middle" fontFamily={CAPS} fontSize={36} fill="#111">
						{text}
					</text>
				</g>
			</g>
		</svg>
	);
};

// Vignette: clear to 45% of half-diagonal, reaching `corner` black at the corners.
export const Vignette: React.FC<{corner?: number}> = ({corner = 0.35}) => (
	<AbsoluteFill style={{background: `radial-gradient(ellipse 110% 110% at center, rgba(0,0,0,0) 45%, rgba(0,0,0,${corner}) 100%)`, pointerEvents: 'none'}} />
);

// Location grade, applied over characters too.
export const Grade: React.FC<{color: string; opacity?: number; mode?: 'multiply' | 'soft-light' | 'overlay' | 'color'}> = ({color, opacity = 0.35, mode = 'multiply'}) => (
	<AbsoluteFill style={{background: color, opacity, mixBlendMode: mode, pointerEvents: 'none'}} />
);

// Counter value: covers 60% of value in first third, holds.
export const countValue = (f: number, len: number, from: number, to: number) => {
	const t = clamp(f / len);
	const e = t < 1 / 3 ? (t * 3) * 0.6 : 0.6 + 0.4 * (1 - Math.pow(1 - (t - 1 / 3) * 1.5, 2));
	return from + (to - from) * clamp(e);
};
