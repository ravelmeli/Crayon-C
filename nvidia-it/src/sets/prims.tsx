import React from 'react';
import {INK, PALETTE} from '../rig/outfits';
import {HAND, CAPS} from '../ui/Fonts';

const O = {stroke: INK, strokeWidth: 4.5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};

// shade a hex colour (k<1 darker)
export const shade = (hex: string, k: number) => {
	const n = parseInt(hex.slice(1), 16);
	const r = Math.min(255, Math.round(((n >> 16) & 255) * k));
	const g = Math.min(255, Math.round(((n >> 8) & 255) * k));
	const b = Math.min(255, Math.round((n & 255) * k));
	return `rgb(${r},${g},${b})`;
};

export type Pattern = 'panels' | 'brick' | 'tiles' | 'dots' | 'planks' | 'stone' | 'checker' | 'stripes' | 'wood';

// A patterned rectangle: fill + drawn pattern one tone darker.
export const Patterned: React.FC<{x: number; y: number; w: number; h: number; fill: string; pattern: Pattern; cell?: number}> = ({x, y, w, h, fill, pattern, cell = 80}) => {
	const line = shade(fill, 0.82);
	const els: React.ReactNode[] = [];
	const cols = Math.ceil(w / cell) + 1;
	const rows = Math.ceil(h / (cell / 2)) + 1;
	if (pattern === 'panels') {
		for (let i = 0; i < cols; i++) {
			els.push(<rect key={i} x={x + i * cell * 2 + 14} y={y + 30} width={cell * 2 - 28} height={h - 60} rx={6} fill="none" stroke={line} strokeWidth={4} />);
		}
		els.push(<rect key="rail" x={x} y={y + h * 0.62} width={w} height={14} fill={shade(fill, 0.9)} stroke={line} strokeWidth={3} />);
	} else if (pattern === 'brick') {
		for (let r = 0; r < rows; r++) {
			const yy = y + r * (cell / 2);
			els.push(<path key={`h${r}`} d={`M ${x} ${yy} L ${x + w} ${yy}`} stroke={line} strokeWidth={3} />);
			for (let c = 0; c < cols; c++) {
				const xx = x + c * cell + (r % 2 ? cell / 2 : 0);
				els.push(<path key={`v${r}-${c}`} d={`M ${xx} ${yy} L ${xx} ${yy + cell / 2}`} stroke={line} strokeWidth={3} />);
			}
		}
	} else if (pattern === 'tiles' || pattern === 'checker') {
		for (let r = 0; r < Math.ceil(h / cell) + 1; r++)
			for (let c = 0; c < cols; c++) {
				const alt = (r + c) % 2 === 0;
				els.push(<rect key={`${r}-${c}`} x={x + c * cell} y={y + r * cell} width={cell} height={cell} fill={pattern === 'checker' && alt ? shade(fill, 0.75) : 'none'} stroke={line} strokeWidth={3} />);
			}
	} else if (pattern === 'dots') {
		for (let r = 0; r < Math.ceil(h / cell) + 1; r++)
			for (let c = 0; c < cols; c++) els.push(<circle key={`${r}-${c}`} cx={x + c * cell + (r % 2 ? cell / 2 : 0)} cy={y + r * cell + 20} r={6} fill={line} />);
	} else if (pattern === 'planks' || pattern === 'wood') {
		for (let r = 0; r < rows; r++) {
			const yy = y + r * (cell / 2);
			els.push(<path key={`h${r}`} d={`M ${x} ${yy} L ${x + w} ${yy}`} stroke={line} strokeWidth={3} />);
			const off = ((r * 137) % 5) * 60;
			for (let c = 0; c < Math.ceil(w / 300) + 1; c++) els.push(<path key={`v${r}-${c}`} d={`M ${x + c * 300 + off} ${yy} L ${x + c * 300 + off} ${yy + cell / 2}`} stroke={line} strokeWidth={3} />);
		}
	} else if (pattern === 'stone') {
		for (let r = 0; r < rows; r++) {
			const yy = y + r * (cell * 0.6);
			els.push(<path key={`h${r}`} d={`M ${x} ${yy} L ${x + w} ${yy}`} stroke={line} strokeWidth={4} />);
			for (let c = 0; c < cols; c++) els.push(<path key={`v${r}-${c}`} d={`M ${x + c * cell * 1.4 + (r % 2) * 50} ${yy} L ${x + c * cell * 1.4 + (r % 2) * 50} ${yy + cell * 0.6}`} stroke={line} strokeWidth={4} />);
		}
	} else if (pattern === 'stripes') {
		for (let c = 0; c < cols * 2; c++) els.push(<rect key={c} x={x + c * cell} y={y} width={cell / 2} height={h} fill={line} opacity={0.5} />);
	}
	return (
		<g>
			<rect x={x} y={y} width={w} height={h} fill={fill} />
			<svg x={x} y={y} width={w} height={h} viewBox={`${x} ${y} ${w} ${h}`} overflow="hidden">
				{els}
			</svg>
		</g>
	);
};

// Window with a view and diagonal light bands thrown on the wall.
export const Window: React.FC<{x: number; y: number; w: number; h: number; sky?: string; night?: boolean; bands?: boolean; view?: 'city' | 'trees'}> = ({x, y, w, h, sky = '#BFD8E0', night, bands = true, view = 'city'}) => (
	<g>
		{bands && (
			<g opacity={0.18} fill="#FFF6D8">
				{[0, 1, 2].map((i) => (
					<path key={i} d={`M ${x + w + 40 + i * 70} ${y + h + 10} l 60 0 l 140 260 l -60 0 Z`} />
				))}
			</g>
		)}
		<rect x={x} y={y} width={w} height={h} fill={night ? '#1A2751' : sky} />
		{view === 'city' &&
			[0, 1, 2, 3, 4].map((i) => {
				const bw = w / 5;
				const bh = h * (0.35 + ((i * 37) % 30) / 60);
				return (
					<g key={i}>
						<rect x={x + i * bw + 4} y={y + h - bh} width={bw - 8} height={bh} fill={night ? '#0E1430' : '#8FA3AE'} stroke={INK} strokeWidth={2} />
						{[0, 1, 2].map((k) => (
							<rect key={k} x={x + i * bw + 14} y={y + h - bh + 14 + k * 26} width={10} height={12} fill={night ? '#F2C744' : '#DDE7EA'} opacity={night ? (k + i) % 2 ? 0.9 : 0.3 : 0.8} />
						))}
					</g>
				);
			})}
		{view === 'trees' && [0, 1, 2].map((i) => <circle key={i} cx={x + 40 + i * (w / 3)} cy={y + h - 20} r={50} fill="#6E8B4E" stroke={INK} strokeWidth={2} />)}
		<rect x={x} y={y} width={w} height={h} fill="none" stroke="#F4F1EA" strokeWidth={14} />
		<rect x={x} y={y} width={w} height={h} fill="none" {...O} />
		<path d={`M ${x + w / 2} ${y} L ${x + w / 2} ${y + h} M ${x} ${y + h / 2} L ${x + w} ${y + h / 2}`} stroke="#F4F1EA" strokeWidth={9} />
		<rect x={x - 16} y={y + h} width={w + 32} height={16} fill="#E6DFCF" {...O} strokeWidth={3} />
	</g>
);

export const LightDisc: React.FC<{cx: number; cy: number; r: number; color?: string; o?: number}> = ({cx, cy, r, color = '#FFE9B0', o = 0.35}) => (
	<g>
		<defs>
			<radialGradient id={`ld${Math.round(cx)}_${Math.round(cy)}_${Math.round(r)}`}>
				<stop offset="0" stopColor={color} stopOpacity={o} />
				<stop offset="1" stopColor={color} stopOpacity={0} />
			</radialGradient>
		</defs>
		<ellipse cx={cx} cy={cy} rx={r} ry={r * 0.75} fill={`url(#ld${Math.round(cx)}_${Math.round(cy)}_${Math.round(r)})`} />
	</g>
);

export const WallClock: React.FC<{x: number; y: number; r?: number; t?: number}> = ({x, y, r = 40, t = 0}) => (
	<g transform={`translate(${x},${y})`}>
		<circle r={r} fill="#F4F1EA" {...O} />
		{Array.from({length: 12}).map((_, i) => {
			const a = (i / 12) * Math.PI * 2;
			return <path key={i} d={`M ${Math.cos(a) * r * 0.78} ${Math.sin(a) * r * 0.78} L ${Math.cos(a) * r * 0.9} ${Math.sin(a) * r * 0.9}`} stroke={INK} strokeWidth={2.5} />;
		})}
		<path d={`M 0 0 L 0 ${-r * 0.6}`} stroke={INK} strokeWidth={4} transform={`rotate(${t * 0.5})`} />
		<path d={`M 0 0 L ${r * 0.45} 0`} stroke={INK} strokeWidth={4} transform={`rotate(${t * 6 - 90})`} />
	</g>
);

export const Frame: React.FC<{x: number; y: number; w: number; h: number; art?: string; c?: string}> = ({x, y, w, h, art = 'mountain', c = '#8FA3AE'}) => (
	<g>
		<rect x={x} y={y} width={w} height={h} fill="#6E4726" {...O} />
		<rect x={x + 10} y={y + 10} width={w - 20} height={h - 20} fill={c} stroke={INK} strokeWidth={2.5} />
		{art === 'mountain' && <path d={`M ${x + 10} ${y + h - 10} L ${x + w * 0.4} ${y + h * 0.35} L ${x + w * 0.6} ${y + h * 0.6} L ${x + w * 0.75} ${y + h * 0.45} L ${x + w - 10} ${y + h - 10} Z`} fill="#4A6B6E" stroke={INK} strokeWidth={2} />}
		{art === 'chart' && <path d={`M ${x + 20} ${y + h - 24} L ${x + w * 0.4} ${y + h * 0.6} L ${x + w * 0.6} ${y + h * 0.65} L ${x + w - 20} ${y + 22}`} stroke={PALETTE.accentBody} strokeWidth={5} fill="none" />}
		{art === 'portrait' && (
			<g>
				<circle cx={x + w / 2} cy={y + h * 0.42} r={w * 0.2} fill="#D8B898" stroke={INK} strokeWidth={2} />
				<path d={`M ${x + w * 0.2} ${y + h - 10} Q ${x + w / 2} ${y + h * 0.5} ${x + w * 0.8} ${y + h - 10} Z`} fill="#2C3E50" stroke={INK} strokeWidth={2} />
			</g>
		)}
	</g>
);

export const Plant: React.FC<{x: number; y: number; s?: number; sway?: number}> = ({x, y, s = 1, sway = 0}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		<g transform={`rotate(${sway},0,-60)`}>
			{[-40, -15, 10, 35].map((a, i) => (
				<path key={i} d={`M 0 -60 Q ${a} -140 ${a * 1.6} -190 Q ${a * 0.6} -130 0 -60`} fill={i % 2 ? '#5E8A45' : '#6FA052'} {...O} strokeWidth={3} />
			))}
		</g>
		<path d="M -40 -70 L 40 -70 L 30 0 L -30 0 Z" fill="#B5643C" {...O} />
		<rect x={-46} y={-80} width={92} height={16} fill="#C8744A" {...O} strokeWidth={3} />
	</g>
);

export const Calendar: React.FC<{x: number; y: number; top: string; big: string; w?: number; c?: string}> = ({x, y, top, big, w = 140, c = PALETTE.red}) => (
	<g transform={`translate(${x},${y})`}>
		<rect x={-w / 2} y={0} width={w} height={w * 1.15} fill="#F4F1EA" {...O} />
		<rect x={-w / 2} y={0} width={w} height={w * 0.3} fill={c} {...O} />
		<text x={0} y={w * 0.24} textAnchor="middle" fontFamily={CAPS} fontSize={w * 0.2} fill="#fff">
			{top}
		</text>
		<text x={0} y={w * 0.95} textAnchor="middle" fontFamily={CAPS} fontSize={w * 0.52} fill={INK}>
			{big}
		</text>
		<circle cx={-w * 0.25} cy={0} r={6} fill="#888" stroke={INK} strokeWidth={2} />
		<circle cx={w * 0.25} cy={0} r={6} fill="#888" stroke={INK} strokeWidth={2} />
	</g>
);

export const Lamp: React.FC<{x: number; y: number; on?: boolean; floor?: number}> = ({x, y, on = true, floor}) => (
	<g>
		{on && <LightDisc cx={x} cy={y + 40} r={230} o={0.45} />}
		{on && floor !== undefined && <ellipse cx={x} cy={floor} rx={300} ry={50} fill="#FFE9B0" opacity={0.22} />}
		<path d={`M ${x} ${y - 400} L ${x} ${y}`} stroke={INK} strokeWidth={3} />
		<path d={`M ${x - 50} ${y + 40} L ${x - 26} ${y} L ${x + 26} ${y} L ${x + 50} ${y + 40} Z`} fill="#2C3E50" {...O} strokeWidth={3.5} />
		{on && <ellipse cx={x} cy={y + 42} rx={22} ry={8} fill="#FFF3C4" />}
	</g>
);

export const Desk: React.FC<{x: number; y: number; w?: number; c?: string}> = ({x, y, w = 420, c = '#6E4726'}) => (
	<g>
		<rect x={x - w / 2} y={y} width={w} height={26} fill={shade(c, 1.15)} {...O} />
		<rect x={x - w / 2 + 14} y={y + 26} width={w * 0.38} height={120} fill={c} {...O} />
		{[0, 1, 2].map((i) => (
			<g key={i}>
				<path d={`M ${x - w / 2 + 14} ${y + 26 + i * 40} L ${x - w / 2 + 14 + w * 0.38} ${y + 26 + i * 40}`} stroke={INK} strokeWidth={3} />
				<rect x={x - w / 2 + 14 + w * 0.15} y={y + 40 + i * 40} width={w * 0.08} height={8} rx={3} fill="#C9A94A" stroke={INK} strokeWidth={2} />
			</g>
		))}
		<rect x={x + w / 2 - 30} y={y + 26} width={16} height={120} fill={c} {...O} />
	</g>
);

export const Sign: React.FC<{x: number; y: number; text: string; w?: number; bg?: string; fg?: string; size?: number; font?: 'hand' | 'caps'}> = ({x, y, text, w = 220, bg = '#2C3E50', fg = '#F4F1EA', size = 34, font = 'caps'}) => (
	<g transform={`translate(${x},${y})`}>
		<rect x={-w / 2} y={-size * 0.9} width={w} height={size * 1.5} rx={6} fill={bg} {...O} strokeWidth={3.5} />
		<text x={0} y={size * 0.25} textAnchor="middle" fontFamily={font === 'caps' ? CAPS : HAND} fontWeight={700} fontSize={size} fill={fg}>
			{text}
		</text>
	</g>
);

export const CastShadow: React.FC<{x: number; y: number; w?: number; o?: number}> = ({x, y, w = 110, o = 0.3}) => <ellipse cx={x} cy={y} rx={w} ry={w * 0.16} fill="#000" opacity={o} />;

export {O as OUTLINE};
