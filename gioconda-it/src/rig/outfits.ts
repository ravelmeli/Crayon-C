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
	collar?: 'lapel' | 'zip' | 'shirt' | 'crew' | 'chef' | 'turtle';
	accessory?: 'headset' | 'apron' | 'visor' | 'labcoat';
	facial?: 'mustache' | 'beard' | 'longbeard';
	facialColor?: string;
	hat?: 'kepi' | 'bowler' | 'beret' | 'top' | 'flatcap' | 'redcap' | 'helmet' | 'crown';
	hatColor?: string;
	stripes?: string;
	accent2?: string;
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

// ---------------- Italian 5-min cast (real people = signature + name plate, never a likeness) ----------------
export const CHRIS: Outfit = {name: 'Chris Malachowsky', skin: '#EFCBA8', skinShade: '#CDA07C', hair: 'curly', hairColor: '#5A3A22', hairHighlight: '#8A5A3A', body: '#6E8FA8', bodyShade: '#55718A', hem: '#3E5568', inner: '#F4F1EA', collar: 'shirt', pockets: true, glasses: 'round', legs: '#2C3E50', shoes: '#111'};
export const CURTIS: Outfit = {name: 'Curtis Priem', skin: '#F2D3B5', skinShade: '#D0A988', hair: 'short', hairColor: '#B88A4A', hairHighlight: '#D8B070', body: '#8A6A4A', bodyShade: '#6E5236', hem: '#4E3A26', inner: '#E8E1D3', collar: 'crew', knit: true, glasses: 'square', legs: '#3A3A44', shoes: '#111'};
export const WAITRESS: Outfit = {name: "Waitress (Denny's)", skin: '#C9946C', skinShade: '#A6714C', hair: 'bun', hairColor: '#3A2418', hairHighlight: '#6A4632', body: '#E8C547', bodyShade: '#C9A42E', hem: '#A8861E', inner: '#F4F1EA', collar: 'shirt', accessory: 'apron', badge: '#C33631', legs: '#2C2C2C', shoes: '#111'};
export const ALEX: Outfit = {name: 'Alex Krizhevsky', skin: '#F0D0B0', skinShade: '#CFA685', hair: 'short', hairColor: '#2A2018', hairHighlight: '#5A4A3A', body: '#4A5A6E', bodyShade: '#36445A', hem: '#24303F', inner: '#9AA6B4', collar: 'crew', knit: true, legs: '#2C3E50', shoes: '#111'};
export const GAMER: Outfit = {name: 'Gamer', skin: '#D9A77F', skinShade: '#B5825C', hair: 'curly', hairColor: '#1A1410', hairHighlight: '#4A3A30', body: '#C33631', bodyShade: '#9A2622', hem: '#6E1A16', inner: '#2B2B2B', collar: 'crew', accessory: 'headset', legs: '#2C3E50', shoes: '#111'};
export const SCIENTIST: Outfit = {name: 'Scientist', skin: '#8E5B3C', skinShade: '#6D4329', hair: 'long', hairColor: '#1A1410', hairHighlight: '#4A3A30', body: '#F4F1EA', bodyShade: '#D2CCBC', hem: '#B8B09C', inner: '#4A6B6E', collar: 'lapel', accessory: 'labcoat', pockets: true, glasses: 'round', legs: '#2C3E50', shoes: '#111'};
export const JOBS: Outfit = {name: 'Steve Jobs', skin: '#EBC9A6', skinShade: '#C9A37E', hair: 'short', hairColor: '#3A3530', hairHighlight: '#6A6560', body: '#141414', bodyShade: '#050505', hem: '#000000', inner: '#141414', collar: 'turtle', glasses: 'round', legs: '#4A5A78', shoes: '#B9B4AE'};
export const IGER: Outfit = {name: 'Bob Iger', skin: '#EBC4A0', skinShade: '#C99E79', hair: 'sidepart', hairColor: '#B9B4AE', hairHighlight: '#E2DED8', body: '#3E4654', bodyShade: '#2C333E', hem: '#1C2128', inner: '#F4F1EA', collar: 'lapel', tie: '#2C3E50', buttons: true, legs: '#2C333E', shoes: '#111'};
export const KRESS: Outfit = {name: 'Colette Kress', skin: '#F0CDAD', skinShade: '#CFA685', hair: 'long', hairColor: '#C9A86A', hairHighlight: '#E8CF94', body: '#7A2E3A', bodyShade: '#5E202C', hem: '#40141E', inner: '#F4F1EA', collar: 'lapel', buttons: true, badge: '#8FD23F', legs: '#2A2226', shoes: '#111'};
export const JONES: Outfit = {name: 'Harvey Jones', skin: '#E6C09C', skinShade: '#C39874', hair: 'bald', hairColor: '#D8D4CE', hairHighlight: '#EEE', body: '#2C3E50', bodyShade: '#1E2B38', hem: '#141D26', inner: '#F4F1EA', collar: 'lapel', tie: '#8FD23F', buttons: true, glasses: 'square', legs: '#1E2B38', shoes: '#111'};
export const MARCO: Outfit = {name: 'Marco (Italian saver)', skin: '#E4B992', skinShade: '#C1916B', hair: 'sidepart', hairColor: '#2A1A10', hairHighlight: '#5A3A2A', body: '#2E6B4A', bodyShade: '#225238', hem: '#163826', inner: '#F4F1EA', collar: 'zip', pockets: true, legs: '#2C3E50', shoes: '#6E4726'};

// ---------------- Gioconda cast (1911) ----------------
export const PERUGGIA: Outfit = {name: 'Vincenzo Peruggia', skin: '#E4BC94', skinShade: '#C1946C', hair: 'sidepart', hairColor: '#1E1612', hairHighlight: '#4A3A30', facial: 'mustache', facialColor: '#1E1612', body: '#3A3430', bodyShade: '#2A2420', hem: '#1A1612', inner: '#E8E1D3', collar: 'shirt', legs: '#2A2622', shoes: '#111'};
export const PERUGGIA_SMOCK: Outfit = {...PERUGGIA, name: 'Peruggia (white smock)', body: '#F2EEE3', bodyShade: '#D2CCBC', hem: '#B8B09C', accessory: 'labcoat', pockets: true};
export const GUARD: Outfit = {name: 'Louvre guard', skin: '#E6C09C', skinShade: '#C39874', hair: 'short', hairColor: '#4A3A30', hairHighlight: '#6A5A50', facial: 'mustache', facialColor: '#5A4A40', hat: 'kepi', hatColor: '#1E2A44', body: '#1E2A44', bodyShade: '#141D30', hem: '#0E1422', inner: '#1E2A44', collar: 'lapel', buttons: true, badge: '#C9A94A', legs: '#141D30', shoes: '#111'};
export const BEROUD: Outfit = {name: 'Louis Béroud', skin: '#EBC9A6', skinShade: '#C9A37E', hair: 'short', hairColor: '#6A5A4A', hairHighlight: '#8A7A6A', facial: 'beard', facialColor: '#6A5A4A', hat: 'beret', hatColor: '#2C2C3A', body: '#6E4726', bodyShade: '#55361C', hem: '#3A2410', inner: '#E8E1D3', collar: 'shirt', pockets: true, legs: '#2A2622', shoes: '#111'};
export const APOLLINAIRE: Outfit = {name: 'Guillaume Apollinaire', skin: '#EFCBA8', skinShade: '#CDA07C', hair: 'short', hairColor: '#2A2018', hairHighlight: '#5A4A3A', hat: 'bowler', hatColor: '#1A1A1A', body: '#4A4A54', bodyShade: '#36363E', hem: '#22222A', inner: '#F4F1EA', collar: 'lapel', tie: '#7A2E3A', buttons: true, legs: '#2A2A30', shoes: '#111'};
export const PICASSO: Outfit = {name: 'Pablo Picasso', skin: '#D9A77F', skinShade: '#B5825C', hair: 'sidepart', hairColor: '#0E0A08', hairHighlight: '#3A2A20', body: '#F4F1EA', bodyShade: '#D2CCBC', hem: '#1E2A44', stripes: '#1E2A44', collar: 'crew', inner: '#F4F1EA', legs: '#3A3A44', shoes: '#111'};
export const INSPECTOR: Outfit = {name: 'Police inspector', skin: '#E6C09C', skinShade: '#C39874', hair: 'short', hairColor: '#3A2A20', hairHighlight: '#5A4A40', facial: 'mustache', facialColor: '#3A2A20', hat: 'bowler', hatColor: '#2A2A2A', body: '#3E3A34', bodyShade: '#2C2924', hem: '#1C1A16', inner: '#F4F1EA', collar: 'lapel', buttons: true, legs: '#2A2622', shoes: '#111'};
export const GERI: Outfit = {name: 'Alfredo Geri', skin: '#E8C29E', skinShade: '#C59A76', hair: 'bald', hairColor: '#5A4A40', hairHighlight: '#8A7A70', facial: 'mustache', facialColor: '#5A4A40', body: '#6E5A3A', bodyShade: '#55452C', hem: '#3A2E1C', inner: '#F4F1EA', collar: 'lapel', tie: '#C33631', buttons: true, glasses: 'round', legs: '#3A3026', shoes: '#111'};
export const POGGI: Outfit = {name: 'Giovanni Poggi', skin: '#EBC4A0', skinShade: '#C99E79', hair: 'short', hairColor: '#4A4A4A', hairHighlight: '#7A7A7A', facial: 'beard', facialColor: '#4A4A4A', body: '#2C3E50', bodyShade: '#1E2B38', hem: '#141D26', inner: '#F4F1EA', collar: 'lapel', tie: '#2E5A3A', buttons: true, glasses: 'square', legs: '#1E2B38', shoes: '#111'};
export const JUDGE: Outfit = {name: 'Judge (Florence)', skin: '#E3BB98', skinShade: '#C0946F', hair: 'bald', hairColor: '#CFCFCF', hairHighlight: '#EEE', facial: 'beard', facialColor: '#CFCFCF', hat: 'top', hatColor: '#111', body: '#141414', bodyShade: '#050505', hem: '#000', inner: '#F4F1EA', collar: 'lapel', legs: '#141414', shoes: '#111'};
export const LEONARDO: Outfit = {name: 'Leonardo da Vinci', skin: '#E8C29E', skinShade: '#C59A76', hair: 'long', hairColor: '#D8D4CE', hairHighlight: '#F4F1EA', facial: 'longbeard', facialColor: '#D8D4CE', hat: 'redcap', hatColor: '#7A2E3A', body: '#7A2E3A', bodyShade: '#5E202C', hem: '#40141E', inner: '#C9A94A', collar: 'crew', legs: '#3A2A20', shoes: '#111'};
export const FRANCIS: Outfit = {name: 'Francis I', skin: '#EBC9A6', skinShade: '#C9A37E', hair: 'short', hairColor: '#3A2418', hairHighlight: '#6A4632', facial: 'beard', facialColor: '#3A2418', hat: 'crown', hatColor: '#F2C744', body: '#1F3A8A', bodyShade: '#162A63', hem: '#C9A94A', inner: '#F4F1EA', collar: 'crew', buttons: true, legs: '#1F3A8A', shoes: '#111'};
export const VALFIERNO: Outfit = {name: 'Valfierno (legend)', skin: '#E4BC94', skinShade: '#C1946C', hair: 'sidepart', hairColor: '#1E1612', hairHighlight: '#4A3A30', facial: 'mustache', facialColor: '#1E1612', hat: 'top', hatColor: '#111', body: '#141414', bodyShade: '#050505', hem: '#000', inner: '#F4F1EA', collar: 'lapel', tie: '#F4F1EA', buttons: true, legs: '#141414', shoes: '#111'};
export const THIEF: Outfit = {name: 'Thief 2025', skin: '#D9A77F', skinShade: '#B5825C', hair: 'short', hairColor: '#1A1410', hairHighlight: '#4A3A30', hat: 'helmet', hatColor: '#F2C744', body: '#F2C744', bodyShade: '#C9A42E', hem: '#A8861E', inner: '#2B2B2B', collar: 'zip', stripes: '#D8D8D8', legs: '#2B2B2B', shoes: '#111'};
export const TOURIST: Outfit = {name: 'Tourist (generic)', skin: '#F0CDAD', skinShade: '#CFA685', hair: 'short', hairColor: '#C9A86A', hairHighlight: '#E8CF94', hat: 'flatcap', hatColor: '#C33631', body: '#5A9FD0', bodyShade: '#457FAA', hem: '#2E5A7A', inner: '#F4F1EA', collar: 'crew', legs: '#C9B48A', shoes: '#F4F1EA'};
