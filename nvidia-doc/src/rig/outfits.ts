// One rig, many outfits. Each character = skin + hair + clothing layers + one signature.

export type HairStyle = 'swept' | 'sidepart' | 'bun' | 'long' | 'curly' | 'short' | 'toque' | 'bald';

export interface Outfit {
	name: string;
	skin: string;
	skinShade: string;
	hair: HairStyle;
	hairColor: string;
	hairHighlight: string;
	body: string; // main garment
	bodyShade: string;
	hem: string; // darker hem band
	inner?: string; // shirt / tee showing at the collar
	collar?: 'lapel' | 'zip' | 'shirt' | 'crew' | 'chef';
	tie?: string;
	buttons?: boolean;
	pockets?: boolean;
	badge?: string;
	leather?: boolean;
	knit?: boolean;
	glasses?: 'round' | 'square';
	legs: string;
	shoes: string;
}

export const INK = '#111111';

export const PALETTE = {
	ink: INK,
	paper: '#F4F1EA',
	teal: '#4A6B6E',
	wood: '#6E4726',
	slate: '#2C3E50',
	beige: '#D9CBB0',
	accent: '#8FD23F',
	accentBody: '#64A14B',
	red: '#C33631',
	night: '#13192B',
	sepia: '#5A4A38',
};

// The protagonist. Signature: black leather jacket + swept silver-black hair. Never a likeness.
export const JENSEN: Outfit = {
	name: 'Jensen Huang',
	skin: '#E9C39E',
	skinShade: '#C99872',
	hair: 'swept',
	hairColor: '#5C5C66',
	hairHighlight: '#B9B9C4',
	body: '#1C1C1F',
	bodyShade: '#0B0B0D',
	hem: '#050506',
	inner: '#1A1A1A',
	collar: 'zip',
	pockets: true,
	leather: true,
	legs: '#1A1A1A',
	shoes: '#0E0E0E',
};

// Skit pair, generic Nvidia staff (not real people).
export const DANA: Outfit = {
	name: 'Dana (finance)',
	skin: '#B9845C',
	skinShade: '#93623F',
	hair: 'bun',
	hairColor: '#2B1A12',
	hairHighlight: '#6A4632',
	body: '#4A6B6E',
	bodyShade: '#36504F',
	hem: '#2A3E3E',
	inner: '#F4F1EA',
	collar: 'lapel',
	buttons: true,
	pockets: true,
	badge: '#8FD23F',
	glasses: 'square',
	legs: '#24282C',
	shoes: '#111',
};

export const RAY: Outfit = {
	name: 'Ray (engineer)',
	skin: '#F1D2B6',
	skinShade: '#D2A889',
	hair: 'curly',
	hairColor: '#8A4B22',
	hairHighlight: '#C07A44',
	body: '#7C8A5A',
	bodyShade: '#5E6A43',
	hem: '#46502F',
	inner: '#D8D2C0',
	collar: 'crew',
	knit: true,
	badge: '#8FD23F',
	glasses: 'round',
	legs: '#2C3E50',
	shoes: '#1A1A1A',
};

export const COOK_A: Outfit = {
	name: 'Line cook 1',
	skin: '#8E5B3C',
	skinShade: '#6D4329',
	hair: 'toque',
	hairColor: '#FAF7EF',
	hairHighlight: '#FFFFFF',
	body: '#F2EEE3',
	bodyShade: '#CFC8B6',
	hem: '#B8B09C',
	collar: 'chef',
	buttons: true,
	legs: '#2B2B2B',
	shoes: '#111',
};

export const COOK_B: Outfit = {
	name: 'Line cook 2',
	skin: '#F0C9A5',
	skinShade: '#CFA27E',
	hair: 'short',
	hairColor: '#C9A04A',
	hairHighlight: '#E8C877',
	body: '#F2EEE3',
	bodyShade: '#CFC8B6',
	hem: '#C33631',
	collar: 'chef',
	buttons: true,
	legs: '#2B2B2B',
	shoes: '#111',
};

// Extras: board members, a 1996 Sega exec, a reporter.
export const EXTRAS: Outfit[] = [
	{name: 'Board 1', skin: '#E3BB98', skinShade: '#C0946F', hair: 'bald', hairColor: '#9C9C9C', hairHighlight: '#CFCFCF', body: '#2C3E50', bodyShade: '#1E2B38', hem: '#141D26', inner: '#F4F1EA', collar: 'lapel', tie: '#C33631', buttons: true, legs: '#1E2B38', shoes: '#111'},
	{name: 'Board 2', skin: '#C08A66', skinShade: '#9A6847', hair: 'long', hairColor: '#B9B4AE', hairHighlight: '#E2DED8', body: '#5B3A4A', bodyShade: '#432A36', hem: '#2E1C25', inner: '#E8E1D3', collar: 'lapel', buttons: true, glasses: 'round', legs: '#2A2226', shoes: '#111'},
	{name: 'Board 3', skin: '#6E4A33', skinShade: '#523522', hair: 'short', hairColor: '#1A1410', hairHighlight: '#4A3A30', body: '#3E3E46', bodyShade: '#2C2C33', hem: '#1C1C22', inner: '#F4F1EA', collar: 'lapel', tie: '#4A6B6E', buttons: true, legs: '#22222A', shoes: '#111'},
	{name: 'Sega exec, 1996', skin: '#EBC9A6', skinShade: '#C9A37E', hair: 'sidepart', hairColor: '#161616', hairHighlight: '#4A4A4A', body: '#1F3A8A', bodyShade: '#162A63', hem: '#0F1D45', inner: '#F4F1EA', collar: 'lapel', tie: '#E0B43A', buttons: true, glasses: 'square', legs: '#1A1F33', shoes: '#111'},
	{name: 'Reporter', skin: '#D9A77F', skinShade: '#B5825C', hair: 'long', hairColor: '#4A2A1A', hairHighlight: '#80503A', body: '#B9784A', bodyShade: '#93593A', hem: '#6E3F25', inner: '#F4F1EA', collar: 'shirt', pockets: true, legs: '#2C3E50', shoes: '#111'},
	{name: 'Young Jensen, 1993', skin: '#E9C39E', skinShade: '#C99872', hair: 'sidepart', hairColor: '#141414', hairHighlight: '#4A4A4A', body: '#D8D2C0', bodyShade: '#B8B09C', hem: '#9C947F', inner: '#F4F1EA', collar: 'shirt', pockets: true, glasses: 'square', legs: '#3A3A44', shoes: '#111'},
];
