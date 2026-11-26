import {LINES, TOTAL} from '../lib';
import timings from '../timings.json';
import {wf} from './Tpl';

const S = (id: number) => LINES[id].startFrame;
const E = (id: number) => LINES[id].endFrame;
const C = (id: number) => (id === 0 ? 0 : Math.round((E(id - 1) + S(id)) / 2));
const L = (at: number, id: number, sub: string) => wf(id, sub) - at;
const GAPS: {label: string; at: number; len: number}[] = (timings as any).gaps;
const gap = (label: string) => {
	const g = GAPS.find((x) => x.label === label)!;
	return {from: Math.round(g.at * 30) + 2, to: Math.round((g.at + g.len) * 30)};
};
// split a merged skit line at word `sub`: [first half window, second half window]
const split = (id: number, sub: string): [[number, number], [number, number]] => {
	const k = wf(id, sub);
	return [[S(id), k - 3], [k, E(id)]];
};

type Raw = [number, string, any, string];
const raw: Raw[] = [];
const add = (at: number, tpl: string, p: any, d: string) => raw.push([at, tpl, p, d]);
const a = (o: string, x: number, more: any = {}) => ({o, x, ...more});
const sc = (at: number, set: string, A: any[], more: any, d: string) => add(at, 'scene', {set, A, ...more}, d);
const card = (from: number, to: number, text: string) => {
	const at = S(from) - 2;
	add(at, 'card', {text, typeStart: 0, typeEnd: E(to) - at}, `CARD: ${text}`);
};
const chapter = (label: string, text: string) => add(gap(label).from + (label === 'TITLE+CH1' ? 66 : 0), 'chapter', {text}, `chapter: ${text}`);
const sk = (id: number, set: string, A: string, B: string, frame: string, who: 'A' | 'B', more: any = {}) =>
	add(C(id), 'skit', {set, A, B, frame, who, line: id, ...more}, `skit (${set}): "${LINES[id].text}"`);
const pair = (id: number, set: string, A: string, B: string, frame: string, more: any = {}) =>
	add(C(id), 'skit', {set, A, B, frame, who: 'A', line: id, also: {who: 'B', line: id + 1}, ...more}, `skit pair (${set}): "${LINES[id].text}" / "${LINES[id + 1].text}"`);
const cnt = (at: number, items: any[], d: string, more: any = {}) => add(at, 'counters', {items, bg: '#1E2A38', pattern: 'panels', g: 'none', ...more}, d);

// ===================== COLD OPEN =====================
sc(0, 'living', [a('GA', 560, {v: 'back', s: 1.2, y: 120, e: 'happy'})], {st: {screen: 'loading'}, cam: [880, 470, 1.15], cam2: [880, 440, 1.3], stamp: '19 NOV 2026'}, 'millions switch on the console');
sc(C(2), 'store', [a('GA', 500, {e: 'happy', pose: 'cheering'}), a('M', 800, {e: 'happy', pose: 'holding', held: 'phone'}), a('D', 1100, {e: 'happy'}), a('R', 1400, {e: 'happy', pose: 'cheering'})], {cam: [960, 500, 1.05]}, 'all for the same game');
card(3, 3, 'In un solo giorno, 3,8 miliardi di dollari.');
sc(C(4), 'stocks', [a('EX', 1500, {e: 'happy', pose: 'pointing', v: '3q', m: true})], {cam: [1000, 460, 1.15], strip: 'TAKE-TWO'}, 'the figure announced by Take-Two');
cnt(C(5), [{at: L(C(5), 5, '40'), to: 43866, pre: '$', label: 'AL SECONDO, PER 24 ORE', dur: 30}], 'over $40,000 per second');
sc(C(6), 'cinema', [a('V1', 600, {v: 'back'}), a('V2', 1300, {v: 'back'})], {cam: [960, 400, 1.05], cam2: [960, 380, 1.15], st: {marquee: 'AVENGERS: ENDGAME'}}, 'the strange part: Hollywood');
sc(C(8), 'cinema', [a('V1', 960, {v: 'back', s: 1.2, y: 120})], {st: {marquee: 'AVENGERS: ENDGAME'}, cam: [960, 300, 1.6]}, 'first film over a billion on opening weekend');
cnt(C(9), [{at: L(C(9), 9, 'miliardo'), to: 1200, pre: '$', suf: ' MLN', label: 'PRIMO WEEKEND, 3 GIORNI', dur: 30}], 'Endgame: ~$1.2B in 3 days', {bg: '#4A1A22', pattern: 'stripes'});
card(11, 11, 'Un videogioco ha fatto il triplo. In un giorno.');
pair(12, 'home', 'M', 'D', 'otsA', {eA: 'thinking'});
pair(14, 'home', 'M', 'D', 'two', {eA: 'surprised'});
pair(16, 'home', 'M', 'D', 'closeB', {eA: 'thinking'});
sc(C(18), 'living', [a('GA', 960, {e: 'happy', pose: 'cheering', y: 40})], {cam: [900, 470, 1.25]}, 'the players’ record');
sc(C(19), 'stocks', [a('EX', 760, {e: 'thinking', v: '3q'})], {cam: [960, 470, 1.25]}, 'where does the money go?');
sc(C(21), 'office', [a('D', 960, {e: 'concerned', pose: 'shrugging'})], {st: {board: '???'}, cam: [960, 460, 1.4]}, 'why could the record be a problem?');
card(22, 22, 'Come fa un gioco a battere Hollywood?');
add(gap('TITLE+CH1').from, 'scene', {set: 'living', A: [], props: [{k: 'box', x: 880, y: 380, s: 1.4, glow: 1}], title: true, titleLines: [{t: 'IL VIDEOGIOCO CHE HA'}, {t: 'INCASSATO 3,8 MILIARDI', accent: true}, {t: 'IN UN GIORNO'}], cam: [880, 440, 1.1], cam2: [880, 420, 1.2]}, 'TITLE over the glowing box');
chapter('TITLE+CH1', 'Una volante del 1995');

// ===================== CH1: 1995 =====================
sc(S(23) - 4, 'studio', [a('DV', 760, {v: '3q', e: 'happy', pose: 'pointing'})], {cam: [800, 470, 1.15], cam2: [760, 460, 1.3], stamp: 'DUNDEE 1995', strip: 'DMA DESIGN'}, 'Dundee, DMA Design');
add(C(26), 'topdown', {}, "Race'n'Chase: you are the police");
pair(28, 'studio', 'DV', 'V3', 'otsA', {eA: 'thinking'});
pair(30, 'studio', 'DV', 'V3', 'two', {eA: 'neutral'});
pair(32, 'studio', 'DV', 'V3', 'closeB', {eA: 'thinking'});
sc(C(34), 'studio', [a('SH', 0, {walk: [-200, 620]}), a('DH', 0, {walk: [-400, 400]}), a('DV', 1300, {v: '3q', m: true, e: 'surprised'})], {cam: [800, 470, 1.15], strip: 'SAM E DAN HOUSER'}, 'the Houser brothers at BMG');
sc(C(35), 'studio', [a('SH', 700, {v: '3q', pose: 'pointing', e: 'happy'}), a('DH', 960, {v: '3q', e: 'happy'})], {props: [{k: 'sign', x: 1400, y: 300, text: "RACE'N'CHASE", w: 360, bg: '#C33631'}], cam: [1000, 470, 1.25], slam: 'GTA', slamAt: L(C(35), 36, 'nome'), slamX: 1400, slamY: 300}, 'they rename it');
add(C(37), 'clipboard', {title: "CAPO D'ACCUSA", stamp: "FURTO D'AUTO", stampAt: L(C(37), 38, 'furto')}, "Grand Theft Auto: 'furto d’auto aggravato'");
add(C(40), 'topdown', {}, 'a city seen from above; cars are rectangles');
sc(C(44), 'studio', [a('SH', 700, {pose: 'cheering', e: 'happy'}), a('DH', 1000, {pose: 'cheering', e: 'happy'})], {props: [{k: 'sign', x: 860, y: 110, text: 'ROCKSTAR GAMES', w: 420, bg: '#E0B43A', fg: '#111'}], cam: [860, 430, 1.25], strip: 'ROCKSTAR NORTH'}, 'Rockstar Games; Dundee becomes Rockstar North');
sc(C(47), 'studio', [a('DV', 960, {e: 'thinking', pose: 'pointing'})], {cam: [960, 460, 1.5]}, 'remember this detail');
add(C(48), 'topdown', {}, 'at first you were the cop');
sc(C(49), 'studio', [a('DV', 760, {e: 'happy', pose: 'shrugging'}), a('V3', 1200, {e: 'surprised', v: '3q', m: true})], {cam: [960, 470, 1.3]}, 'then the game switched sides');
add(C(50), 'topdown', {}, 'since then the police chase the player');
chapter('CH2', 'Tredici anni di attesa');

// ===================== CH2: 13 YEARS =====================
sc(S(51) - 4, 'store', [a('GA', 0, {walk: [200, 800]}), a('M', 0, {walk: [-100, 500]})], {cam: [800, 480, 1.1], stamp: 'SET 2013'}, 'September 2013: GTA V');
cnt(C(52), [{at: L(C(52), 52, '800'), to: 800, pre: '$', suf: ' MLN', label: 'PRIMO GIORNO', dur: 26}], '~$800M on day one');
cnt(C(53), [{at: L(C(53), 53, '230'), to: 230, suf: ' MLN', label: 'COPIE (STIME)', dur: 26}], '230+ million copies');
card(54, 54, 'Poi, per tredici anni, nessun nuovo capitolo.');
pair(55, 'living', 'GA', 'D', 'two', {eA: 'thinking'});
pair(57, 'living', 'GA', 'D', 'closeB', {eA: 'concerned'});
sc(C(59), 'hotel22', [a('K', 900, {v: 'back', s: 1.1, y: 60})], {props: [{k: 'sign', x: 1450, y: 300, text: 'ROCKSTAR', w: 260, bg: '#E0B43A', fg: '#111'}], cam: [1000, 470, 1.2], stamp: 'SET 2022', strip: 'ARION KURTAJ'}, 'a British teenager breaks into Rockstar');
cnt(C(62), [{at: L(C(62), 62, '90'), to: 90, label: 'VIDEO PUBBLICATI', dur: 20}], '~90 leaked videos', {bg: '#5A5A6E'});
sc(C(63), 'hotel22', [a('K', 760, {pose: 'holding', held: 'phone', e: 'deadpan', v: '3q'}), a('CP', 1450, {v: '3q', m: true, e: 'neutral'})], {cam: [1000, 470, 1.2]}, 'under police protection, in a hotel');
sc(C(66), 'hotel22', [a('K', 600, {pose: 'holding', held: 'phone', e: 'happy'})], {props: [{k: 'sign', x: 1150, y: 360, text: 'TV + FIRE STICK', w: 380, bg: '#111'}], cam: [880, 470, 1.4], cam2: [940, 460, 1.6]}, 'the room TV, a phone and an Amazon Fire Stick');
pair(67, 'hotel22', 'CP', 'K', 'otsA', {eA: 'surprised'});
add(C(69), 'skit', {set: 'hotel22', A: 'CP', B: 'K', frame: 'two', twA: split(69, 'una')[0], twB: split(69, 'una')[1], eA: 'thinking', eB: 'deadpan'}, 'skit: "E poi?" / "Una chiavetta."');
sk(70, 'hotel22', 'CP', 'K', 'otsA', 'A', {eA: 'surprised'});
sk(71, 'hotel22', 'CP', 'K', 'closeB', 'B', {eB: 'deadpan'});
cnt(C(72), [{at: L(C(72), 72, '5'), to: 5, pre: '$', suf: ' MLN', label: 'DANNO STIMATO DA ROCKSTAR', dur: 18}], 'Rockstar: $5M damage');
sc(C(73), 'court', [a('JU', 960, {e: 'deadpan', y: -60}), a('K', 1640, {e: 'concerned', s: 0.9})], {g: 'day', cam: [1100, 460, 1.1], stamp: '2023'}, 'indefinite secure hospital order');
sc(C(74), 'court', [a('K', 1640, {e: 'sad', s: 0.9})], {g: 'day', cam: [1600, 440, 1.8], slam: 'COLPEVOLE', slamAt: L(C(74), 74, 'colpevole'), slamX: 1400}, 'days before launch: he pleads guilty');
sc(C(75), 'living', [a('GA', 560, {v: 'back', s: 1.2, y: 120, e: 'surprised'})], {cam: [880, 420, 1.6], stamp: 'DIC 2023'}, 'December 2023');
add(C(77), 'views', {at: L(C(77), 77, '90'), to: 90000000, dur: 30}, 'first trailer: 90M views in 24h');
sc(C(78), 'living', [a('GA', 600, {v: '3q', e: 'surprised', pose: 'holding', held: 'phone'})], {cam: [800, 460, 1.25], strip: 'GUINNESS DEI PRIMATI'}, 'Guinness record');
add(C(79), 'skit', {set: 'living', A: 'GA', B: 'D', frame: 'two', twA: [S(79), wf(79, 'in') - 3], twB: [wf(79, 'in'), wf(79, 'per') - 3], eA: 'surprised', eB: 'deadpan'}, 'skit: "Novanta milioni?" / "In un giorno."');
add(wf(79, 'per') - 4, 'skit', {set: 'living', A: 'GA', B: 'D', frame: 'closeB', twA: [wf(79, 'per'), wf(79, 'di') - 3], twB: [wf(79, 'di'), E(79)], eB: 'deadpan'}, 'skit: "Per un trailer?" / "Di due minuti."');
chapter('CH3', 'Jason e Lucia');

// ===================== CH3: JASON & LUCIA =====================
sc(S(80) - 4, 'beach', [], {cam: [960, 460, 1.0], cam2: [960, 480, 1.12], strip: 'UNA CITTÀ IN STILE MIAMI'}, 'a Miami-like city');
sc(C(81), 'beach', [a('JA', 0, {walk: [200, 760]}), a('LU', 0, {walk: [400, 960]})], {cam: [800, 480, 1.2]}, 'two protagonists, a couple on the run');
pair(85, 'beach', 'JA', 'LU', 'otsA', {eA: 'thinking'});
pair(87, 'beach', 'JA', 'LU', 'two', {eA: 'neutral'});
pair(89, 'beach', 'JA', 'LU', 'closeB', {eA: 'concerned'});
add(C(91), 'delays', {dates: [['2025', L(C(91), 92, '2025')], ['26 MAG 2026', L(C(91), 93, '26')], ['19 NOV 2026', L(C(91), 94, '19')]]}, 'the delays');
pair(95, 'office', 'R', 'D', 'two', {eA: 'surprised', st: {board: 'RINVIO'}});
pair(97, 'office', 'R', 'D', 'closeB', {eA: 'thinking', st: {board: 'RINVIO'}});
sc(C(99), 'protest', [a('UN', 600, {pose: 'cheering', e: 'angry'}), a('V2', 900, {e: 'angry'}), a('V3', 1200, {e: 'angry', pose: 'pointing'})], {cam: [960, 480, 1.1], stamp: 'NOV 2025'}, 'November 2025: a controversy');
sc(C(100), 'protest', [a('UN', 760, {pose: 'pointing', e: 'angry'})], {props: [{k: 'sign', x: 1250, y: 380, text: '30–40 LICENZIATI', w: 420, bg: '#C33631'}], cam: [960, 480, 1.3]}, '30 to 40 staff fired in the UK and Canada');
sc(C(101), 'protest', [a('UN', 960, {pose: 'talking', e: 'angry'})], {props: [{k: 'sign', x: 1350, y: 380, text: 'SINDACATO', w: 300, bg: '#C33631'}], cam: [1000, 450, 1.6]}, 'the union: union-busting');
sc(C(102), 'stocks', [a('EX', 960, {pose: 'talking', e: 'deadpan'})], {cam: [960, 460, 1.5], strip: "VERSIONE DELL'AZIENDA"}, 'the company: confidential leaks');
sc(C(103), 'court', [a('UN', 1640, {e: 'neutral', s: 0.9}), a('EX', 1300, {e: 'deadpan', s: 0.9, v: '3q', m: true})], {g: 'day', cam: [1300, 460, 1.3], slam: 'AZIONE LEGALE', slamAt: 8, slamX: 900, slamColor: '#2C3E50'}, 'legal action');
card(104, 104, 'Il gioco più atteso del mondo arriva con le ferite addosso.');
chapter('CH4', 'La febbre dei pre-ordini');

// ===================== CH4: PRE-ORDERS =====================
sc(S(105) - 4, 'store', [a('GA', 600, {e: 'happy', pose: 'holding', held: 'phone'}), a('M', 900, {e: 'happy', pose: 'holding', held: 'phone'}), a('R', 1200, {e: 'happy'})], {cam: [960, 500, 1.1]}, 'pre-orders open');
sc(C(106), 'store', [a('GA', 760, {e: 'happy', pose: 'holding', held: 'phone'})], {cam: [800, 470, 1.4]}, 'first week of pre-orders');
cnt(wf(106, 'valgono') - 6, [{at: 6, to: 180, pre: '$', suf: ' MLN', label: 'PRE-ORDINI, 1ª SETTIMANA', dur: 26}], '~$180M in week one');
sc(C(107), 'store', [a('GA', 500, {e: 'happy', pose: 'holding', held: 'phone'}), a('M', 800, {e: 'happy', pose: 'holding', held: 'phone'}), a('R', 1100, {e: 'happy', pose: 'holding', held: 'phone'}), a('D', 1400, {e: 'happy', pose: 'holding', held: 'phone'})], {cam: [960, 480, 1.15]}, 'the race accelerates');
add(C(108), 'years', {from: 18, to: 19, top: 'NOVEMBRE', sign: 'VIGILIA', dur: 10, wall: '#2C3E50'}, 'the day before launch');
cnt(wf(108, 'stima') - 6, [{at: 6, to: 1650, pre: '$', suf: ' MLN', label: "PRE-VENDITE, VIGILIA D'USCITA", dur: 30}], '$1.65B pre-sales (Sensor Tower)');
pair(109, 'store', 'M', 'GA', 'two', {eA: 'surprised'});
pair(111, 'store', 'M', 'GA', 'closeB', {eA: 'thinking'});
sc(C(113), 'stocks', [a('V4', 1450, {e: 'thinking', v: '3q', m: true})], {cam: [960, 460, 1.2], strip: 'ANALISTI'}, 'some analysts');
cnt(wf(113, 'tra') - 6, [{at: 6, to: 3, pre: '$', suf: ' MLD', label: 'PREVISIONE MIN', dur: 12}, {at: 18, to: 5, pre: '$', suf: ' MLD', label: 'PREVISIONE MAX', dur: 12}], 'forecast: $3–5B in week one');
sc(C(114), 'living', [a('GA', 600, {v: 'back', s: 1.2, y: 120})], {st: {screen: 'loading'}, cam: [880, 460, 1.2], slam: 'PREVISIONE', slamAt: 4, slamColor: '#2C3E50', slamX: 1400}, 'a forecast; 19 November is the test');
chapter('CH5', 'Tre numeri, un giorno');

// ===================== CH5: THREE NUMBERS =====================
sc(S(116) - 4, 'office', [a('D', 560, {v: '3q', pose: 'pointing', e: 'neutral'})], {st: {board: '1 · 2 · 3'}, cam: [960, 460, 1.2]}, 'three numbers, not one');
sc(C(120), 'office', [a('D', 960, {e: 'neutral', pose: 'talking'})], {st: {board: 'MATTINA'}, cam: [960, 450, 1.45]}, 'number 1 arrives in the morning');
cnt(C(121), [{at: L(C(121), 121, 'miliardo'), to: 1840, pre: '$', suf: ' MLN', label: 'SENSOR TOWER, MATTINA', dur: 26}, {at: L(C(121), 121, '19'), to: 19, suf: ' MLN', label: 'COPIE', dur: 18}], 'number 1: Sensor Tower morning');
sc(C(123), 'office', [a('D', 960, {e: 'neutral', pose: 'talking'})], {st: {board: 'SERA'}, cam: [960, 450, 1.45]}, 'number 2 arrives in the evening');
cnt(C(124), [{at: L(C(124), 124, '2'), to: 2360, pre: '$', suf: ' MLN', label: 'SENSOR TOWER, SERA', dur: 26}], 'number 2: Sensor Tower evening');
sc(C(125), 'living', [a('GA', 760, {pose: 'holding', held: 'phone', e: 'thinking', v: '3q'})], {cam: [880, 470, 1.3], strip: 'SOLO PLAYSTATION E XBOX'}, 'only PlayStation and Xbox pre-orders');
sc(C(126), 'stocks', [a('EX', 960, {pose: 'talking', e: 'happy'})], {cam: [960, 460, 1.4], strip: 'TAKE-TWO'}, 'number 3: the official one');
cnt(wf(127, 'annuncia') - 4, [{at: 8, to: 3790, pre: '$', suf: ' MLN', label: 'VENDITE AL DETTAGLIO, 1° GIORNO', dur: 30}], 'Take-Two: $3.79B retail, day one');
cnt(C(128), [{at: L(C(128), 128, '32'), to: 32.5, dec: 1, suf: ' MLN', label: "COPIE PRIMA DELL'USCITA", dur: 18}], '32.5M copies before release');
pair(129, 'office', 'R', 'D', 'otsA', {eA: 'thinking'});
pair(131, 'office', 'R', 'D', 'closeB', {eA: 'surprised'});
sc(C(133), 'office', [a('D', 960, {pose: 'pointing', e: 'neutral'})], {cam: [960, 450, 1.5]}, 'the point nobody explains');
sc(C(135), 'home', [a('M', 960, {pose: 'holding', held: 'phone', e: 'happy'})], {cam: [960, 450, 1.5]}, 'a pizza ordered on an app');
add(C(137), 'pizzaSplit', {parts: [['APP', '#4A6B6E', L(C(137), 137, 'app')], ['FATTORINO', '#C9A94A', L(C(137), 137, 'fattorino')], ['PIZZERIA', '#64A14B', L(C(137), 138, 'pizzeria')]]}, 'pizza by app: who takes a slice');
add(C(139), 'pizzaSplit', {parts: [['SONY', '#2C4A7A', L(C(139), 140, 'Sony')], ['MICROSOFT', '#3E8A4A', L(C(139), 140, 'Microsoft')], ['NEGOZI', '#7A2E3A', L(C(139), 141, 'negozi')], ['ROCKSTAR', '#64A14B', L(C(139), 141, 'negozi') + 18]]}, 'same for GTA: Sony, Microsoft, shops');
card(142, 143, 'Il record è il prezzo pagato. Non il guadagno.');
pair(144, 'office', 'R', 'D', 'two', {eA: 'thinking'});
pair(146, 'office', 'R', 'D', 'closeB', {eA: 'surprised'});
chapter('CH6', "L'abbiamo già visto");

// ===================== CH6: WE'VE SEEN IT =====================
sc(S(148) - 4, 'cinema', [a('V1', 700, {v: 'back'}), a('V2', 1250, {v: 'back'})], {st: {marquee: 'AVENGERS: ENDGAME'}, cam: [960, 420, 1.1], stamp: 'APR 2019'}, 'April 2019: Endgame');
cnt(C(150), [{at: L(C(150), 150, '640'), to: 640, pre: '$', suf: ' MLN', label: 'RECORD PRECEDENTE', dur: 18}, {at: L(C(150), 151, 'raddoppia'), to: 1200, pre: '$', suf: ' MLN', label: 'ENDGAME', dur: 18}], '$640M → $1.2B', {bg: '#4A1A22', pattern: 'stripes'});
sc(C(152), 'store', [a('GA', 760, {pose: 'cheering', e: 'happy'})], {cam: [900, 480, 1.2], stamp: 'SET 2013'}, 'September 2013 again');
cnt(C(153), [{at: L(C(153), 153, '800'), to: 800, pre: '$', suf: ' MLN', label: '1 GIORNO', dur: 18}], 'GTA V: $800M day one');
cnt(C(154), [{at: L(C(154), 154, 'miliardo'), to: 1000, pre: '$', suf: ' MLN', label: '3 GIORNI (DIVERSE FONTI)', dur: 18}], '~$1B in 3 days (several sources)');
sc(C(156), 'stocks', [a('EX', 600, {pose: 'cheering', e: 'happy'})], {st: {up: true}, cam: [960, 460, 1.15]}, 'every record: the industry thinks it will be normal');
card(158, 159, 'Ma i record non diventano normali. Diventano aspettative.');
pair(160, 'office', 'R', 'D', 'two', {eA: 'thinking', st: {board: 'GTA 7?'}});
add(C(162), 'skit', {set: 'office', st: {board: 'GTA 7?'}, A: 'R', B: 'D', frame: 'two', twA: split(162, 'sarà')[0], twB: split(162, 'sarà')[1], eA: 'concerned', eB: 'deadpan'}, 'skit: "E se non ci riesce?" / "Sarà un fallimento."');
sk(163, 'office', 'R', 'D', 'otsA', 'A', {eA: 'surprised', st: {board: 'GTA 7?'}});
sk(164, 'office', 'R', 'D', 'closeB', 'B', {eB: 'deadpan', st: {board: 'GTA 7?'}});
chapter('CH7', 'Il tuo portafoglio');

// ===================== CH7: WALLET =====================
sc(S(165) - 4, 'home', [a('M', 960, {pose: 'holding', held: 'phone', e: 'surprised'})], {cam: [960, 460, 1.4]}, 'and you? in Italy');
cnt(wf(165, 'costa') - 4, [{at: 8, to: 79.99, dec: 2, pre: '€', label: 'STANDARD (ITALIA)', dur: 20}], 'Italy: €79.99 standard', {bg: '#2E5A3A'});
cnt(C(166), [{at: 0, from: 79.99, to: 79.99, dec: 2, pre: '€', label: 'STANDARD', dur: 2}, {at: L(C(166), 166, '99'), to: 99.99, dec: 2, pre: '€', label: 'ULTIMATE', dur: 18}], '€99.99 Ultimate', {bg: '#2E5A3A'});
cnt(C(167), [{at: L(C(167), 167, 'pizza'), to: 8, label: 'PIZZE (DUE MESI)', dur: 20}], '80 euro ≈ a pizza a week for two months', {bg: '#7A4E2E', pattern: 'checker'});
pair(169, 'home', 'M', 'D', 'two', {eA: 'thinking'});
pair(171, 'home', 'M', 'D', 'closeB', {eA: 'surprised'});
add(C(173), 'skit', {set: 'home', A: 'M', B: 'D', frame: 'closeB', twA: split(173, 'allora')[0], twB: split(173, 'allora')[1], eA: 'happy', eB: 'happy'}, 'skit: "E se ci gioco mille ore?" / "Allora è un affare."');
sc(C(174), 'office', [a('D', 960, {pose: 'pointing', e: 'neutral'})], {st: {board: '1 VOLTA vs ANNI'}, cam: [960, 450, 1.35]}, "that's the industry's math");
sc(C(175), 'cinema', [a('V1', 960, {v: 'back'})], {st: {marquee: 'UNA VOLTA'}, cam: [960, 420, 1.2]}, 'a film: once');
sc(C(176), 'living', [a('GA', 600, {v: 'back', s: 1.2, y: 120, e: 'happy'})], {cam: [880, 460, 1.2], strip: 'PER ANNI'}, 'a GTA: for years');
sc(C(177), 'living', [a('GA', 600, {v: 'back', s: 1.2, y: 120})], {cam: [880, 400, 1.5], slam: 'ONLINE: DOPO', slamAt: L(C(177), 177, 'online'), slamX: 880, slamY: 220, slamColor: '#2C3E50'}, 'online mode: not at launch');
chapter('CH8', 'Il record e la trappola');

// ===================== CH8: THE RECORD AND THE TRAP =====================
sc(S(180) - 4, 'stocks', [a('EX', 600, {pose: 'cheering', e: 'happy'}), a('D', 1450, {e: 'happy', v: '3q', m: true})], {st: {up: true}, cam: [960, 460, 1.1]}, 'the optimists');
sc(C(182), 'living', [a('GA', 960, {pose: 'cheering', e: 'happy', y: 40})], {cam: [900, 470, 1.2]}, 'the game exists; biggest numbers ever');
sc(C(183), 'stocks', [], {st: {up: true}, cam: [960, 380, 1.4], strip: 'TAKE-TWO ▲'}, 'Take-Two shares rise');
card(185, 185, 'Ma il record del primo giorno nasconde una trappola.');
cnt(C(186), [{at: L(C(186), 186, '32'), to: 32.5, dec: 1, suf: ' MLN', label: "COPIE PRIMA DELL'USCITA", dur: 20}], '32.5M copies sold before launch');
sc(C(187), 'stocks', [a('D', 1450, {e: 'concerned', v: '3q', m: true})], {st: {up: false}, cam: [960, 460, 1.15]}, 'analysts: sales may slow faster');
sc(C(189), 'living', [a('GA', 600, {v: 'back', s: 1.2, y: 120, e: 'happy'})], {cam: [880, 460, 1.2]}, 'whoever wanted it, has it');
sc(C(190), 'store', [a('GA', 400, {e: 'happy'}), a('M', 640, {e: 'happy'}), a('R', 880, {e: 'happy'}), a('D', 1120, {e: 'happy'}), a('V2', 1360, {e: 'happy'}), a('V4', 1600, {e: 'happy'})], {cam: [960, 500, 1.05]}, 'one night: all of the first year’s customers');
sc(C(192), 'store', [], {cam: [960, 500, 1.05], cam2: [960, 500, 1.15]}, 'but the day after?');
pair(193, 'store', 'EX', 'D', 'otsA', {eA: 'thinking'});
add(C(195), 'skit', {set: 'store', A: 'EX', B: 'D', frame: 'two', twA: split(195, 'se')[0], twB: split(195, 'se')[1], eA: 'surprised', eB: 'neutral'}, 'skit: "Ancora?" / "Se il gioco è bello."');
sk(196, 'store', 'EX', 'D', 'otsA', 'A', {eA: 'concerned'});
sk(197, 'store', 'EX', 'D', 'closeB', 'B', {eB: 'deadpan'});
card(198, 199, "Il primo giorno lo decide l'attesa. Il resto lo decide il gioco.");
add(C(201), 'topdown', {}, 'recap: born as a police chase');
cnt(C(202), [{at: 2, to: 13, label: 'ANNI DI ATTESA', dur: 14}], 'recap: 13 years');
add(C(203), 'views', {at: 2, to: 90000000, dur: 14}, 'recap: a record trailer');
sc(C(204), 'hotel22', [a('K', 960, {pose: 'holding', held: 'phone', e: 'deadpan'})], {cam: [960, 470, 1.4]}, 'recap: a leak from a hotel room');
add(C(205), 'delays', {dates: [['2025', 0], ['26 MAG 2026', 4], ['19 NOV 2026', 8]]}, 'recap: two delays');
sc(C(206), 'protest', [a('UN', 960, {pose: 'cheering', e: 'angry'})], {cam: [960, 470, 1.3]}, 'recap: contested firings');
cnt(C(207), [{at: 6, to: 3790, pre: '$', suf: ' MLN', label: 'PRIMO GIORNO', dur: 20}], 'recap: $3.8B day one');
sc(C(208), 'living', [a('GA', 560, {v: 'back', s: 1.2, y: 120})], {st: {screen: 'loading'}, cam: [880, 470, 1.15], cam2: [880, 420, 1.45]}, 'back to 19 November');
sc(C(210), 'living', [], {props: [{k: 'box', x: 1500, y: 560, s: 1.1, glow: 1}], cam: [1200, 470, 1.2], cam2: [1400, 470, 1.45]}, 'the record is in the books; the real bill is years away');
pair(212, 'living', 'GA', 'D', 'two', {eA: 'thinking'});
pair(214, 'living', 'GA', 'D', 'closeB', {eA: 'concerned'});


// ---- extra cuts for pace ----
sc(C(1), 'living', [], {st: {screen: 'loading'}, cam: [880, 380, 2.2], cam2: [880, 370, 2.4]}, 'the loading bar');
sc(C(10), 'cinema', [a('V1', 500, {v: 'back'}), a('V2', 800, {v: 'back'}), a('V4', 1100, {v: 'back'}), a('V5', 1400, {v: 'back'})], {st: {marquee: 'AVENGERS: ENDGAME'}, cam: [960, 480, 1.05]}, 'in 3 days, worldwide');
sc(C(24), 'studio', [], {cam: [1560, 300, 2.0], cam2: [1560, 290, 2.2]}, 'rain on Dundee');
sc(C(25), 'studio', [a('DV', 500, {v: 'back', s: 1.2, y: 140})], {cam: [560, 420, 1.9]}, 'a chase game on a beige computer');
sc(C(39), 'court', [a('JU', 960, {e: 'deadpan', y: -60, pose: 'pointing'})], {g: 'day', cam: [960, 360, 1.6]}, 'sounds like a criminal charge');
sc(C(42), 'studio', [a('DV', 960, {e: 'happy', marks: ['sparkles'], pose: 'cheering'})], {cam: [960, 450, 1.5]}, 'but the idea is already there');
sc(C(43), 'beach', [], {cam: [960, 470, 1.0], cam2: [1100, 470, 1.05]}, 'a whole city where you can do anything');
sc(C(46), 'studio', [], {props: [{k: 'sign', x: 760, y: 300, text: 'ROCKSTAR NORTH', w: 440, bg: '#E0B43A', fg: '#111'}], cam: [760, 320, 1.9]}, 'Dundee becomes Rockstar North');
sc(C(61), 'hotel22', [a('K', 960, {pose: 'holding', held: 'phone', e: 'deadpan'})], {cam: [960, 430, 1.8], strip: 'GRUPPO LAPSUS'}, 'part of the Lapsus group');
sc(C(65), 'hotel22', [a('CP', 1450, {v: '3q', m: true, e: 'neutral'}), a('K', 700, {v: '3q', e: 'happy'})], {cam: [1100, 470, 1.4]}, 'under police protection');
sc(wf(66, 'cellulare') - 4, 'hotel22', [a('K', 960, {pose: 'holding', held: 'phone', e: 'deadpan'})], {cam: [960, 590, 2.6]}, 'a phone');
sc(C(76), 'living', [a('GA', 560, {v: 'back', s: 1.2, y: 120, e: 'surprised'})], {cam: [880, 440, 1.3]}, 'the first official trailer');
sc(C(83), 'beach', [a('JA', 760, {v: '3q', e: 'happy'}), a('LU', 1100, {v: '3q', m: true, e: 'happy'})], {cam: [930, 470, 1.6]}, 'a couple, always on the run');
sc(C(118), 'office', [a('D', 960, {pose: 'cheering', e: 'happy'})], {st: {board: '3'}, cam: [960, 450, 1.5]}, 'not one, three');
sc(C(122), 'living', [a('GA', 760, {pose: 'holding', held: 'phone', e: 'happy', v: '3q'})], {cam: [880, 470, 1.4]}, 'pre-orders included');
sc(C(134), 'living', [a('GA', 760, {pose: 'holding', held: 'phone', e: 'happy', v: '3q'})], {props: [{k: 'box', x: 1250, y: 560, s: 0.9}], cam: [960, 470, 1.3]}, 'what players paid');
sc(C(149), 'cinema', [], {st: {marquee: 'AVENGERS: ENDGAME'}, cam: [960, 160, 1.9]}, 'first film over $1B in an opening weekend');
sc(C(155), 'store', [a('GA', 600, {e: 'surprised'}), a('M', 1000, {e: 'surprised'})], {cam: [960, 480, 1.2]}, 'it looked impossible');
sc(C(157), 'stocks', [], {st: {up: true}, cam: [960, 380, 1.5]}, 'the industry thinks it will be normal');
sc(C(178), 'stocks', [a('EX', 600, {pose: 'pointing', e: 'happy'})], {st: {up: true}, cam: [960, 460, 1.2]}, 'it comes later');
sc(C(179), 'living', [a('GA', 600, {v: 'back', s: 1.2, y: 120, e: 'happy'})], {cam: [880, 450, 1.35], strip: 'NEGLI ANNI'}, 'over the years');
sc(C(188), 'stocks', [], {st: {up: false}, cam: [960, 380, 1.5]}, 'sales that slow faster');
sc(C(191), 'store', [a('M', 760, {e: 'happy', pose: 'cheering'}), a('R', 1100, {e: 'happy', pose: 'cheering'})], {cam: [930, 460, 1.5]}, 'a record night');
sc(C(168), 'home', [a('M', 960, {e: 'thinking'})], {cam: [960, 430, 1.8]}, 'for a single game');
sc(wf(149, 'superare') - 4, 'cinema', [a('V1', 600, {v: 'back'}), a('V2', 900, {v: 'back'}), a('V4', 1200, {v: 'back'})], {st: {marquee: 'AVENGERS: ENDGAME'}, cam: [960, 480, 1.05]}, 'first over a billion');
sc(C(209), 'living', [], {st: {screen: 'loading'}, cam: [880, 380, 2.2]}, 'millions of consoles');
sc(C(211), 'stocks', [a('EX', 1450, {e: 'thinking', v: '3q', m: true})], {st: {up: true}, cam: [960, 460, 1.15]}, 'the real bill: the next years');

raw.sort((x, y) => x[0] - y[0]);
// punch-in cuts: split long scene beats at a line boundary with a tighter framing of the same scene
{
	const extra: Raw[] = [];
	raw.forEach((r, i) => {
		const to = i + 1 < raw.length ? raw[i + 1][0] : TOTAL;
		if (r[1] !== 'scene' || to - r[0] < 120) return;
		const mid = LINES.map((l, k) => (k > 0 ? C(k) : -1)).filter((c) => c > r[0] + 45 && c < to - 45);
		if (!mid.length) return;
		const cut = mid.reduce((best, c) => (Math.abs(c - (r[0] + to) / 2) < Math.abs(best - (r[0] + to) / 2) ? c : best), mid[0]);
		const p = r[2];
		const c0 = p.cam ?? [960, 540, 1.2];
		const tight = [c0[0], c0[1] - 20, c0[2] * 1.4];
		extra.push([cut, 'scene', {...p, cam: tight, cam2: [tight[0], tight[1], tight[2] * 1.05], stamp: undefined, strip: undefined, title: false, slam: p.slam && p.slamAt > cut - r[0] ? p.slam : undefined, slamAt: p.slamAt !== undefined ? p.slamAt - (cut - r[0]) : undefined}, r[3] + ' (punch-in)']);
	});
	raw.push(...extra);
	raw.sort((x, y) => x[0] - y[0]);
}
export const BEATS_GTA = raw.map((r, i) => ({id: i + 1, at: r[0], to: i + 1 < raw.length ? raw[i + 1][0] : TOTAL, tpl: r[1], p: r[2], d: r[3]}));
