import React from 'react';
import {CAVEAT, MARKER} from './fontData';

// Fonts are embedded as base64 so no render tab waits on a network font load.
export const Fonts: React.FC = () => (
	<style>{`
@font-face{font-family:'Caveat';font-weight:700;src:url(data:font/woff2;base64,${CAVEAT}) format('woff2');}
@font-face{font-family:'Marker';font-weight:400;src:url(data:font/woff2;base64,${MARKER}) format('woff2');}
`}</style>
);

export const HAND = "'Caveat', cursive";
export const CAPS = "'Marker', 'Caveat', cursive";
