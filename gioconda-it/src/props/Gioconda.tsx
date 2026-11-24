import React from 'react';
import {INK, PALETTE} from '../rig/outfits';

const O = {stroke: INK, strokeWidth: 4, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};

// Hero object: a drawn, stylised panel of a woman in a landscape (not a reproduction).
// Origin = centre of the panel. Panel 77×53 cm drawn at 3 px per cm → 159×231 units at s=1.
export const Painting: React.FC<{x?: number; y?: number; s?: number; frame?: boolean; glass?: boolean; glow?: number; smile?: number}> = ({x = 0, y = 0, s = 1, frame = true, glass = false, glow = 0, smile = 1}) => {
	const w = 159;
	const h = 231;
	return (
		<g transform={`translate(${x},${y}) scale(${s})`}>
			{glow > 0 && <circle r={220} fill={PALETTE.accent} opacity={0.3 * glow} />}
			{frame && <rect x={-w / 2 - 26} y={-h / 2 - 26} width={w + 52} height={h + 52} rx={4} fill="#A8822E" {...O} />}
			{frame && <rect x={-w / 2 - 12} y={-h / 2 - 12} width={w + 24} height={h + 24} fill="#7A5A1E" stroke={INK} strokeWidth={2} />}
			{/* poplar panel */}
			<rect x={-w / 2} y={-h / 2} width={w} height={h} fill="#6E7A4A" stroke={INK} strokeWidth={3} />
			{/* hazy landscape */}
			<rect x={-w / 2} y={-h / 2} width={w} height={h * 0.45} fill="#9AAE8A" />
			<path d={`M ${-w / 2} ${-h * 0.05} Q ${-w / 4} ${-h * 0.2} 0 ${-h * 0.08} Q ${w / 4} ${-h * 0.22} ${w / 2} ${-h * 0.1} L ${w / 2} ${h / 2} L ${-w / 2} ${h / 2} Z`} fill="#5E6A3E" />
			<path d={`M ${-w / 2 + 10} ${-h * 0.15} Q ${-w / 3} ${-h * 0.25} ${-w / 4} ${-h * 0.12}`} stroke="#C9B48A" strokeWidth={3} fill="none" />
			{/* body: dark dress */}
			<path d={`M ${-w * 0.42} ${h / 2} Q ${-w * 0.4} ${h * 0.05} ${-w * 0.12} ${-h * 0.02} L ${w * 0.12} ${-h * 0.02} Q ${w * 0.4} ${h * 0.05} ${w * 0.42} ${h / 2} Z`} fill="#2A2418" stroke={INK} strokeWidth={2.5} />
			<path d={`M ${-w * 0.12} ${-h * 0.02} Q 0 ${h * 0.08} ${w * 0.12} ${-h * 0.02}`} fill="#C9A06A" stroke={INK} strokeWidth={2} />
			{/* folded hands */}
			<ellipse cx={w * 0.05} cy={h * 0.36} rx={w * 0.16} ry={h * 0.05} fill="#D8B088" stroke={INK} strokeWidth={2} />
			{/* hair + veil */}
			<path d={`M ${-w * 0.2} ${-h * 0.3} Q 0 ${-h * 0.46} ${w * 0.2} ${-h * 0.3} L ${w * 0.22} ${-h * 0.02} L ${-w * 0.22} ${-h * 0.02} Z`} fill="#2A1A10" />
			{/* face */}
			<ellipse cx={0} cy={-h * 0.22} rx={w * 0.14} ry={h * 0.12} fill="#D8B088" stroke={INK} strokeWidth={2.5} />
			<ellipse cx={-w * 0.05} cy={-h * 0.24} rx={2.5} ry={3.2} fill={INK} />
			<ellipse cx={w * 0.05} cy={-h * 0.24} rx={2.5} ry={3.2} fill={INK} />
			<path d={`M ${-w * 0.045} ${-h * 0.165} Q 0 ${-h * (0.165 - 0.02 * smile)} ${w * 0.05} ${-h * 0.17}`} stroke={INK} strokeWidth={2} fill="none" />
			{glass && <rect x={-w / 2 - 14} y={-h / 2 - 14} width={w + 28} height={h + 28} fill="#CFE3EA" opacity={0.25} stroke="#E8F4F8" strokeWidth={3} />}
			{glass && <path d={`M ${-w / 2} ${-h / 3} L ${-w / 4} ${-h / 2}`} stroke="#FFFFFF" strokeWidth={5} opacity={0.6} />}
		</g>
	);
};

// The empty wall: four iron hooks, a paler rectangle where the painting hung.
export const FourHooks: React.FC<{x?: number; y?: number; s?: number; glow?: number}> = ({x = 0, y = 0, s = 1, glow = 0}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		{glow > 0 && <circle r={200} fill={PALETTE.accent} opacity={0.25 * glow} />}
		<rect x={-106} y={-142} width={212} height={284} fill="#FFFFFF" opacity={0.16} stroke="#FFFFFF" strokeOpacity={0.25} strokeWidth={2} strokeDasharray="10 8" />
		{[
			[-80, -120],
			[80, -120],
			[-80, 120],
			[80, 120],
		].map(([hx, hy], i) => (
			<g key={i} transform={`translate(${hx},${hy})`}>
				<circle r={9} fill="#3A3A3A" {...O} strokeWidth={3} />
				<path d={hy < 0 ? 'M 0 0 L 0 18 L 10 18' : 'M 0 0 L 0 -18 L 10 -18'} stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />
			</g>
		))}
	</g>
);

// Trunk with a false bottom; open = 0..1 lid; reveal shows the painting lying inside.
export const Trunk: React.FC<{x?: number; y?: number; s?: number; open?: number; reveal?: number}> = ({x = 0, y = 0, s = 1, open = 0, reveal = 0}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		<rect x={-200} y={-150} width={400} height={150} rx={10} fill="#6E4726" {...O} />
		{[-120, 0, 120].map((bx) => (
			<rect key={bx} x={bx - 8} y={-150} width={16} height={150} fill="#3A2410" stroke={INK} strokeWidth={2} />
		))}
		<rect x={-24} y={-120} width={48} height={30} rx={4} fill="#C9A94A" stroke={INK} strokeWidth={2.5} />
		{reveal > 0 && (
			<g opacity={reveal}>
				<rect x={-180} y={-150 - 18} width={360} height={20} fill="#3A2410" />
				<g transform="translate(0,-175) rotate(-90) scale(0.8)">
					<Painting frame={false} />
				</g>
			</g>
		)}
		{open < 1 ? (
			<path d={`M -200 -150 L 200 -150 L ${200 - open * 20} ${-150 - 90 * (1 - open) - 10} L ${-200 + open * 20} ${-150 - 90 * (1 - open) - 10} Z`} fill="#7E5530" {...O} />
		) : (
			<rect x={-200} y={-330} width={400} height={180} rx={10} fill="#7E5530" {...O} />
		)}
		{open > 0 && open < 1 && null}
		{open >= 1 &&
			[0, 1, 2].map((k) => <rect key={k} x={-160 + k * 110} y={-300 + (k % 2) * 30} width={90} height={60} rx={8} fill={['#F4F1EA', '#C9C3AE', '#E8E1D3'][k]} stroke={INK} strokeWidth={2.5} />)}
	</g>
);
