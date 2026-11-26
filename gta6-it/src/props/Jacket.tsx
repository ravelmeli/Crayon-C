import React, {useId} from 'react';
import {INK, PALETTE} from '../rig/outfits';

// Hero object: the empty black leather jacket on a museum stand, behind a velvet rope.
// Origin = floor point under the stand. Jacket is ~300 units tall.
export const HeroJacket: React.FC<{
	x?: number;
	y?: number;
	scale?: number;
	glow?: number; // 0..1 halo strength
	rope?: boolean;
	label?: string;
}> = ({x = 0, y = 0, scale = 1, glow = 1, rope = true, label}) => {
	const id = useId().replace(/[^a-zA-Z0-9]/g, '');
	const s = {stroke: INK, strokeWidth: 3.5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};
	return (
		<g transform={`translate(${x},${y}) scale(${scale})`}>
			<defs>
				<radialGradient id={`${id}halo`}>
					<stop offset="0" stopColor={PALETTE.accent} stopOpacity={0.6 * glow} />
					<stop offset="0.55" stopColor={PALETTE.accent} stopOpacity={0.25 * glow} />
					<stop offset="1" stopColor={PALETTE.accent} stopOpacity={0} />
				</radialGradient>
			</defs>
			{/* halo ~ 8% of frame width at 1x on 1920 */}
			<circle cx={0} cy={-330} r={230} fill={`url(#${id}halo)`} />
			{/* plinth */}
			<rect x={-90} y={-70} width={180} height={70} fill="#3B3F46" {...s} />
			<rect x={-104} y={-84} width={208} height={18} fill="#4C525B" {...s} />
			<path d="M -80 -50 L 80 -50 M -80 -30 L 80 -30" stroke="#2A2D33" strokeWidth={2} />
			{label && (
				<g transform="translate(0,-36)">
					<rect x={-54} y={-14} width={108} height={28} fill="#C9A94A" stroke={INK} strokeWidth={2} rx={3} />
					<text x={0} y={7} textAnchor="middle" fontFamily="'Caveat', cursive" fontWeight={700} fontSize={22} fill={INK}>
						{label}
					</text>
				</g>
			)}
			{/* stand pole + crossbar */}
			<path d="M 0 -84 L 0 -170" stroke="#9AA0A8" strokeWidth={8} />
			<path d="M 0 -84 L 0 -170" stroke={INK} strokeWidth={2} opacity={0.4} />
			{/* jacket body (empty: dark gap where the neck would be) */}
			<g transform="translate(0,-330)">
				<path d="M -38 -122 C -70 -118 -102 -104 -112 -70 L -128 120 L -96 128 L -88 -10 L -84 160 L 84 160 L 88 -10 L 96 128 L 128 120 L 112 -70 C 102 -104 70 -118 38 -122 Z" fill="#1C1C1F" {...s} />
				{/* shade side */}
				<path d="M 40 -118 C 70 -114 100 -100 110 -70 L 126 118 L 98 124 L 88 -10 L 84 158 L 30 158 Z" fill="#0B0B0D" opacity={0.85} />
				{/* empty neck opening */}
				<path d="M -38 -122 C -20 -100 20 -100 38 -122 C 20 -112 -20 -112 -38 -122 Z" fill="#050505" {...s} />
				{/* collar flaps */}
				<path d="M -38 -122 L -70 -110 L -52 -60 L -12 -84 Z" fill="#232327" {...s} />
				<path d="M 38 -122 L 70 -110 L 54 -60 L 12 -84 Z" fill="#141416" {...s} />
				{/* zip */}
				<path d="M -4 -98 L -4 160" stroke="#666" strokeWidth={5} />
				{Array.from({length: 22}).map((_, i) => (
					<path key={i} d={`M -9 ${-90 + i * 11} L 1 ${-90 + i * 11}`} stroke="#888" strokeWidth={2} />
				))}
				{/* pockets */}
				<path d="M -70 50 L -24 40 M 24 40 L 70 50" stroke={INK} strokeWidth={3} />
				{/* hem band */}
				<rect x={-84} y={138} width={168} height={22} fill="#050506" stroke={INK} strokeWidth={3} />
				{/* leather streaks */}
				<g stroke="#FFFFFF" fill="none" strokeLinecap="round" opacity={0.75}>
					<path d="M -64 -60 Q -72 -10 -62 40" strokeWidth={3.5} />
					<path d="M -48 -80 L -40 -62" strokeWidth={2} />
					<path d="M -110 -40 L -116 40" strokeWidth={2.5} />
					<path d="M -50 80 Q -54 100 -48 120" strokeWidth={2} />
				</g>
				{/* accent rim on the edge facing the glow */}
				<path d="M -112 -70 L -128 120" stroke={PALETTE.accent} strokeWidth={3} opacity={0.6 * glow} />
				<path d="M 112 -70 L 128 120" stroke={PALETTE.accent} strokeWidth={3} opacity={0.6 * glow} />
			</g>
			{rope && (
				<g>
					{[-210, 210].map((px) => (
						<g key={px}>
							<rect x={px - 6} y={-150} width={12} height={150} fill="#B8962E" stroke={INK} strokeWidth={2.5} />
							<ellipse cx={px} cy={-154} rx={12} ry={9} fill="#D8B648" stroke={INK} strokeWidth={2.5} />
							<ellipse cx={px} cy={-2} rx={22} ry={7} fill="#8C6F1E" stroke={INK} strokeWidth={2.5} />
						</g>
					))}
					<path d="M -204 -140 Q 0 -60 204 -140" stroke={PALETTE.red} strokeWidth={14} fill="none" />
					<path d="M -204 -140 Q 0 -60 204 -140" stroke={INK} strokeWidth={2} fill="none" opacity={0.5} />
				</g>
			)}
		</g>
	);
};
