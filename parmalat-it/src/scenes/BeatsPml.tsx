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
const pair = (id: number, set: string, A: string, B: string, frame: string, more: any = {}, first: 'A' | 'B' = 'A') =>
	add(C(id), 'skit', {set, A, B, frame, who: first, line: id, also: {who: first === 'A' ? 'B' : 'A', line: id + 1}, ...more}, `skit pair (${set}): "${LINES[id].text}" / "${LINES[id + 1].text}"`);
const cnt = (at: number, items: any[], d: string, more: any = {}) => add(at, 'counters', {items, bg: '#1E2A38', pattern: 'panels', g: 'none', ...more}, d);

// ===================== COLD OPEN =====================
sc(0, 'bank', [a('V4', 1350, {v: '3q', m: true, e: 'deadpan'})], {st: {paper: 0}, cam: [960, 470, 1.15], stamp: 'DIC 2003', strip: 'BANK OF AMERICA'}, 'December 2003: a US bank');
sc(C(1), 'bank', [], {st: {paper: 0.6}, cam: [960, 440, 2.2], cam2: [960, 420, 2.4]}, 'a fax to Parmalat’s auditors');
sc(C(2), 'bank', [], {st: {paper: 1}, cam: [960, 400, 2.6]}, 'a few lines');
card(3, 3, 'In quelle righe spariscono quasi 4 miliardi di euro.');
sc(C(4), 'bank', [a('V4', 960, {pose: 'shrugging', e: 'deadpan'})], {cam: [960, 460, 1.4], slam: 'NON ESISTE', slamAt: L(C(4), 4, 'esiste'), slamColor: '#C33631'}, 'the account does not exist');
add(C(5), 'letter', {lines: ['BANK OF AMERICA', 'Conto Bonlat:', '€ 3.950.000.000'], slam: 'FALSO', slamAt: L(C(5), 6, 'scanner')}, 'the letter: homemade, with a scanner');
sc(C(7), 'dairy', [], {cam: [960, 480, 1.05]}, 'the strange part');
cnt(C(9), [{at: L(C(9), 9, '14'), to: 14, pre: '€', suf: ' MLD', label: 'IL BUCO TOTALE', dur: 26}], 'a €14 billion hole', {bg: '#2C5AA8'});
card(10, 10, 'Circa 240 euro per ogni italiano. Neonati compresi.');
pair(11, 'office', 'TZ', 'EX', 'otsA', {eA: 'happy', eB: 'neutral', st: {board: 'PARMALAT'}});
pair(13, 'office', 'TZ', 'EX', 'two', {eA: 'thinking', st: {board: 'PARMALAT'}});
pair(15, 'office', 'TZ', 'EX', 'closeB', {eA: 'concerned', eB: 'deadpan', mB: ['sweat'], st: {board: 'PARMALAT'}});
sc(C(17), 'office', [a('TZ', 960, {e: 'concerned', pose: 'shrugging'})], {st: {board: 'PARMALAT'}, cam: [960, 450, 1.5], strip: 'CALISTO TANZI'}, "Calisto Tanzi's problem");
sc(C(18), 'branch', [a('PE', 600, {v: 'back'}), a('SV', 960, {v: 'back'}), a('M', 1320, {v: 'back'})], {cam: [960, 460, 1.1]}, 'the Italians’ problem');
cnt(C(19), [{at: L(C(19), 19, '100'), to: 100000, pre: '> ', label: 'PICCOLI RISPARMIATORI', dur: 26}], '100,000+ small savers', {bg: '#2E5A3A'});
cnt(C(20), [{at: L(C(20), 20, '135'), to: 135000, label: 'SECONDO ALCUNE STIME', dur: 20}], 'some estimates: 135,000', {bg: '#2E5A3A'});
card(21, 21, 'Come si nasconde un buco così, vendendo latte?');
add(gap('TITLE+CH1').from, 'scene', {set: 'super', A: [], props: [{k: 'carton', x: 960, y: 560, s: 2.6}], title: true, titleLines: [{t: 'IL BUCO DA'}, {t: '14 MILIARDI', accent: true}, {t: 'CHE NESSUNO VEDEVA'}], cam: [960, 460, 1.1], cam2: [960, 440, 1.2]}, 'TITLE over the milk shelf');
chapter('TITLE+CH1', 'Il ragazzo di Collecchio');

// ===================== CH1 =====================
sc(S(22) - 4, 'collecchio', [a('TY', 960, {e: 'happy'})], {cam: [960, 460, 1.0], cam2: [960, 500, 1.15], stamp: '1938'}, 'Collecchio, near Parma');
sc(C(23), 'deli', [a('V3', 700, {e: 'happy', pose: 'holding'}), a('V2', 1250, {e: 'happy', v: '3q', m: true})], {cam: [960, 470, 1.2]}, 'the family sells hams and preserves');
sc(C(24), 'collecchio', [a('TY', 0, {walk: [200, 1100]})], {cam: [800, 500, 1.2], stamp: '1960'}, 'door to door');
sc(C(27), 'dairy', [a('TY', 600, {e: 'happy', pose: 'pointing', v: '3q'})], {cam: [900, 470, 1.15], stamp: '1961'}, 'a small milk plant');
sc(C(28), 'dairy', [a('TY', 960, {e: 'happy', marks: ['sparkles'], pose: 'cheering'})], {cam: [960, 450, 1.5]}, 'an idea that changes everything');
sc(C(29), 'dairy', [], {props: [{k: 'carton', x: 960, y: 440, s: 2.4}], cam: [960, 420, 1.4], strip: 'LUNGA CONSERVAZIONE'}, 'long-life milk');
sc(C(30), 'dairy', [], {cam: [330, 330, 1.9], strip: 'ALTISSIMA TEMPERATURA'}, 'heated to a very high temperature');
add(C(31), 'fridge', {openAt: 999}, 'months, without a fridge');
pair(33, 'deli', 'V2', 'TY', 'otsA', {eA: 'surprised', eB: 'happy'});
pair(35, 'deli', 'V2', 'TY', 'two', {eA: 'thinking', eB: 'happy'});
pair(37, 'deli', 'V2', 'TY', 'closeB', {eA: 'concerned', eB: 'deadpan', mA: ['sweat']}, 'A');
sc(C(39), 'dairy', [], {cam: [700, 520, 1.0], cam2: [1300, 520, 1.0]}, 'long-life milk travels far');
sc(C(40), 'office', [a('TZ', 960, {pose: 'pointing', e: 'happy'})], {st: {board: 'MARCHIO = STAR'}, cam: [960, 450, 1.4]}, 'a brand sells like a star');
sc(C(42), 'track', [a('LA', 1500, {e: 'happy', v: '3q', m: true})], {cam: [960, 480, 1.05], stamp: '1976', strip: 'NIKI LAUDA'}, 'Formula 1 with Niki Lauda');
sc(C(43), 'track', [], {cam: [960, 520, 1.3], strip: 'BRABHAM'}, 'main sponsor of Brabham');
sc(C(44), 'track', [a('LA', 960, {e: 'happy', pose: 'cheering'})], {cam: [960, 470, 1.4]}, 'Lauda retires, Parmalat keeps paying');
sc(C(45), 'track', [a('LA', 960, {e: 'deadpan'})], {cam: [960, 250, 2.6], cam2: [960, 240, 2.8]}, 'always the Parmalat cap');
pair(47, 'track', 'EX', 'TZ', 'otsA', {eA: 'thinking', eB: 'happy'});
pair(49, 'track', 'EX', 'TZ', 'closeB', {eA: 'surprised', eB: 'happy'});
sc(C(51), 'stadium', [], {cam: [960, 460, 1.0], cam2: [960, 440, 1.1], stamp: '1987'}, 'then football: Parma');
sc(C(53), 'stadium', [a('V3', 700, {pose: 'cheering', e: 'happy'}), a('V4', 1200, {pose: 'cheering', e: 'happy'})], {cam: [960, 480, 1.2]}, 'the team grows, the brand on TV');
card(55, 56, 'Da Collecchio al mondo. Con un cartone di latte.');
chapter('CH2', 'La foto del frigorifero');

// ===================== CH2 =====================
sc(S(57) - 4, 'office', [a('TZ', 960, {e: 'thinking'})], {st: {board: 'CRESCITA'}, cam: [960, 450, 1.3]}, 'a big company needs money');
sc(C(58), 'branch', [a('SV', 600, {v: 'back'}), a('PE', 1000, {v: 'back'})], {cam: [960, 420, 1.2]}, 'loans: banks and savers, with bonds');
add(C(59), 'letter', {lines: ['OBBLIGAZIONE', 'Prestito: € 1.000', 'Interessi: sì'], slam: 'SE ESISTE', slamAt: L(C(59), 62, 'esiste'), slamColor: '#C33631'}, 'a bond is a loan… if the company still exists');
sc(C(63), 'stocks', [a('TZ', 1450, {e: 'concerned', v: '3q', m: true, marks: ['sweat']})], {st: {up: true}, cam: [960, 460, 1.15], strip: 'DEBITI ▲'}, 'debts grow faster than milk');
sc(C(64), 'office', [a('AU', 700, {e: 'thinking', v: '3q'}), a('TZ', 1250, {e: 'happy', v: '3q', m: true})], {st: {board: 'CONTI'}, cam: [960, 470, 1.25]}, 'according to investigators, the accounts start to lie');
sc(C(65), 'beach', [], {props: [{k: 'sign', x: 960, y: 520, text: 'SOCIETÀ LONTANE', w: 400, bg: '#2C3E50'}], cam: [960, 470, 1.1]}, 'debts hidden in faraway companies');
sc(C(66), 'office', [a('EX', 960, {e: 'deadpan', pose: 'shrugging'})], {st: {board: '€ ???'}, cam: [960, 450, 1.5]}, 'cash on paper, not in the bank');
sc(C(67), 'dairy', [], {cam: [960, 520, 1.2]}, 'debt is normal for a big company');
sc(C(68), 'office', [a('TZ', 960, {e: 'happy', pose: 'cheering'})], {st: {board: 'RICCHEZZA?'}, cam: [960, 450, 1.4]}, 'debt disguised as wealth');
add(C(69), 'fridge', {}, 'the balance sheet = a photo of the fridge');
add(C(70), 'fridge', {}, 'lenders see a full fridge');
add(C(71), 'fridge', {painted: true}, 'Parmalat photographs a fridge painted on the wall');
pair(72, 'office', 'AU', 'TZ', 'otsA', {eA: 'thinking', eB: 'happy', st: {board: 'FRIGO PIENO'}});
pair(74, 'office', 'AU', 'TZ', 'closeB', {eA: 'surprised', eB: 'deadpan', st: {board: 'FRIGO PIENO'}});
sc(C(76), 'beach', [], {cam: [960, 460, 1.0], cam2: [960, 470, 1.1], stamp: 'ISOLE CAYMAN', strip: 'BONLAT'}, 'Bonlat, in the Cayman Islands');
cnt(C(79), [{at: L(C(79), 79, 'quattro'), to: 3950, pre: '€', suf: ' MLN', label: 'SULLA CARTA, NEW YORK', dur: 30}], 'on paper: ~€4B at BoA New York', {bg: '#2C5AA8'});
sc(C(80), 'office', [a('V4', 960, {e: 'thinking'})], {st: {board: '?'}, cam: [960, 450, 1.5]}, 'something does not add up');
sc(C(81), 'branch', [a('TZ', 960, {pose: 'holding', held: 'letter', e: 'happy'})], {cam: [960, 450, 1.4], slam: 'ALTRI PRESTITI?', slamAt: L(C(81), 82, 'prestiti'), slamColor: '#2C3E50'}, 'billions in the bank, but still borrowing?');
sc(C(83), 'stocks', [a('V4', 700, {e: 'surprised', v: '3q'}), a('V2', 1250, {e: 'concerned', v: '3q', m: true})], {st: {up: false}, cam: [960, 470, 1.15], stamp: '2003'}, 'investors wonder');
add(C(84), 'letter', {lines: ['Promessa:', 'niente nuovo debito'], slam: 'NUOVO DEBITO', slamAt: L(C(84), 85, 'emette')}, 'promised no new debt… then issued more');
card(86, 86, 'Chi ha la cassa piena non bussa alla porta delle banche.');
chapter('CH3', 'Il fax di dicembre');

// ===================== CH3 =====================
sc(S(87) - 4, 'office', [a('AU', 960, {e: 'thinking', pose: 'holding', held: 'letter'})], {st: {board: 'REVISIONE'}, cam: [960, 460, 1.3], stamp: 'DIC 2003'}, 'the auditors ask the simplest question');
sc(C(89), 'bank', [a('V4', 1350, {e: 'neutral', v: '3q', m: true})], {st: {paper: 0}, cam: [960, 470, 1.2]}, 'confirm this account?');
sc(C(91), 'bank', [], {st: {paper: 0.8}, cam: [960, 440, 2.2]}, 'the answer, by fax');
sc(C(92), 'bank', [a('V4', 960, {e: 'deadpan', pose: 'shrugging'})], {cam: [960, 450, 1.5], slam: 'NON ESISTE', slamAt: L(C(92), 92, 'esiste')}, 'the account does not exist');
add(C(93), 'letter', {lines: ['CONFERMA', 'Conto Bonlat'], slam: 'FALSO', slamAt: L(C(93), 93, 'falso')}, 'the confirmation is a fake');
sc(C(94), 'office', [a('AU', 960, {e: 'sad'})], {st: {board: 'BONLAT 2002'}, cam: [960, 450, 1.5]}, 'Bonlat’s auditors had certified 2002 on that fake');
sc(C(97), 'stocks', [a('EX', 1450, {e: 'deadpan', v: '3q', m: true})], {st: {up: false}, cam: [960, 460, 1.15], strip: 'SEC (USA)'}, 'the SEC also charges Parmalat');
cnt(C(99), [{at: L(C(99), 99, '3'), to: 3950, pre: '≥ €', suf: ' MLN', label: 'ATTIVI 2002 GONFIATI (SEC)', dur: 30}], 'SEC: 2002 assets overstated by at least €3.95B', {bg: '#2C3E50'});
pair(100, 'bank', 'V4', 'AU', 'otsA', {eA: 'thinking', eB: 'neutral'});
add(C(102), 'skit', {set: 'bank', A: 'V4', B: 'AU', frame: 'two', twA: split(102, 'con')[0], twB: split(102, 'con')[1], eA: 'surprised', eB: 'neutral'}, 'skit: "E come?" / "Con una lettera."');
pair(103, 'bank', 'V4', 'AU', 'closeB', {eA: 'thinking', eB: 'deadpan'});
pair(105, 'bank', 'AU', 'V4', 'otsA', {eA: 'thinking', eB: 'neutral'});
pair(107, 'bank', 'AU', 'V4', 'closeB', {eA: 'surprised', eB: 'deadpan'});
sc(C(109), 'office', [a('TZ', 960, {e: 'sad'})], {st: {board: 'CONTI GONFIATI'}, cam: [960, 450, 1.4], stamp: '19 DIC 2003'}, '19 December: Parmalat admits it');
sc(C(111), 'dairy', [], {cam: [960, 480, 1.05], slam: 'AMMINISTRAZIONE STRAORDINARIA', slamAt: 10, slamSize: 50, slamY: 180}, 'special administration');
sc(C(112), 'parisNight', [a('GF', 700, {v: '3q', pose: 'pointing', e: 'deadpan'}), a('TZ', 1250, {v: '3q', m: true, e: 'panic', marks: ['sweat']})], {cam: [960, 480, 1.2], stamp: '27 DIC 2003', strip: 'MILANO'}, 'Tanzi arrested, in a Milan street, in the evening');
card(114, 115, 'Il latte è vero. Sono i soldi a essere finti.');
sc(C(116), 'bank', [a('SA', 960, {e: 'neutral', v: '3q'})], {cam: [960, 450, 1.4], strip: 'LUCA SALA'}, 'a former Bank of America employee, then Parmalat consultant');
sc(C(119), 'bank', [a('V4', 960, {e: 'deadpan', pose: 'shrugging'})], {cam: [960, 450, 1.4]}, 'the bank says it had no part');
chapter('CH4', 'I risparmiatori');

// ===================== CH4 =====================
sc(S(120) - 4, 'branch', [a('PE', 600, {v: 'back'}), a('SV', 960, {v: 'back'}), a('M', 1320, {v: 'back'})], {cam: [960, 460, 1.1]}, 'back to the Italians');
sc(C(121), 'branch', [a('PE', 700, {e: 'happy', pose: 'holding', held: 'letter'}), a('SV', 1250, {e: 'happy', v: '3q', m: true})], {cam: [960, 470, 1.2]}, 'pensioners, employees, families');
sc(C(123), 'branch', [a('V2', 960, {e: 'happy', pose: 'talking'})], {cam: [960, 380, 1.6]}, 'at the local bank counter');
pair(124, 'branch', 'PE', 'V2', 'otsA', {eA: 'thinking', eB: 'happy'});
pair(126, 'branch', 'PE', 'V2', 'two', {eA: 'surprised', eB: 'happy'});
sk(128, 'branch', 'PE', 'V2', 'closeA', 'A', {eA: 'happy'});
cnt(C(129), [{at: 4, from: 100, to: 20, suf: '%', label: 'VALORE OBBLIGAZIONI, GEN 2004', dur: 30}], 'bonds worth about a fifth', {bg: '#5A1A22'});
cnt(C(130), [{at: L(C(130), 130, '7'), to: 7, pre: '€', suf: ' MLD', label: 'RISPARMI PERSI (IRISH TIMES)', dur: 22}], 'savers lose ~€7B (Irish Times)', {bg: '#5A1A22'});
sc(C(131), 'court', [a('PE', 500, {v: 'back'}), a('SV', 800, {v: 'back'}), a('M', 1100, {v: 'back'}), a('JU', 960, {y: -60, e: 'deadpan'})], {g: 'day', cam: [960, 470, 1.05], strip: '33.000 PARTI CIVILI'}, '33,000 civil complainants in Parma');
cnt(C(132), [{at: L(C(132), 132, '40'), to: 40, pre: '€', suf: ' MLN', label: 'A 35.000 INVESTITORI', dur: 20}], '~€40M to 35,000', {bg: '#2E5A3A'});
cnt(C(133), [{at: L(C(133), 134, '1'), to: 1143, pre: '€', label: 'A TESTA (CIRCA)', dur: 20}], 'just over €1,000 each', {bg: '#2E5A3A'});
card(135, 136, '14 miliardi di buco. Poco più di mille euro a testa di risarcimento.');
chapter('CH5', 'Il processo e il tesoro');

// ===================== CH5 =====================
sc(S(137) - 4, 'court', [a('JU', 960, {y: -60, e: 'deadpan'}), a('TZ', 1640, {e: 'sad', s: 0.9})], {g: 'day', cam: [1100, 460, 1.1]}, 'two trials');
sc(C(138), 'court', [a('TZ', 1640, {e: 'concerned', s: 0.9})], {g: 'day', cam: [1600, 440, 1.8], strip: 'MILANO: AGGIOTAGGIO'}, 'Milan: market manipulation');
cnt(C(139), [{at: L(C(139), 139, '10'), to: 10, label: 'ANNI', dur: 10}, {at: L(C(139), 139, '8'), from: 10, to: 8, label: 'CASSAZIONE: 8 ANNI E 1 MESE', dur: 14}], '10 years, cut to 8 years 1 month', {bg: '#5A4A38'});
cnt(C(140), [{at: L(C(140), 141, '18'), to: 18, label: 'ANNI (PARMA)', dur: 18}], 'Parma: 18 years', {bg: '#5A4A38'});
pair(142, 'court', 'PE', 'GF', 'otsA', {eA: 'surprised', eB: 'deadpan', g: 'day'});
pair(144, 'court', 'PE', 'GF', 'two', {eA: 'thinking', eB: 'deadpan', g: 'day'});
pair(146, 'court', 'PE', 'GF', 'closeB', {eA: 'surprised', eB: 'deadpan', g: 'day'});
sc(C(148), 'room', [a('TZ', 960, {e: 'neutral'})], {cam: [960, 470, 1.3], strip: 'ARRESTI DOMICILIARI'}, 'just over two years in prison, then house arrest');
sc(C(150), 'attic', [], {cam: [960, 460, 1.0], cam2: [960, 440, 1.1], stamp: 'DIC 2009'}, 'one last twist');
sc(C(152), 'attic', [a('GF', 700, {e: 'surprised', pose: 'pointing'}), a('GF', 1250, {e: 'surprised', v: '3q', m: true})], {cam: [960, 470, 1.15], strip: 'GUARDIA DI FINANZA'}, '19 hidden works');
sc(C(153), 'attic', [], {cam: [450, 380, 2.0], cam2: [1400, 400, 2.0], strip: 'VAN GOGH · PICASSO · MODIGLIANI · CÉZANNE', stripHold: 90}, 'Van Gogh, Picasso, Modigliani, Cézanne');
cnt(C(155), [{at: L(C(155), 155, '100'), to: 100, pre: '€', suf: ' MLN', label: 'VALORE STIMATO', dur: 22}], '~€100M', {bg: '#4A3A2A'});
sc(C(156), 'room', [a('V3', 960, {e: 'neutral', v: '3q'})], {cam: [960, 470, 1.3], strip: 'TV + SOFFIATA'}, 'a TV show and a tip; the son-in-law talks');
sc(C(158), 'attic', [], {cam: [450, 380, 2.4], slam: 'VENDUTI 2019', slamAt: 10, slamColor: '#2E5A3A', slamY: 180}, 'two Van Goghs sold in 2019');
pair(159, 'attic', 'GF', 'V3', 'otsA', {eA: 'thinking', eB: 'deadpan'});
pair(161, 'attic', 'GF', 'V3', 'two', {eA: 'surprised', eB: 'deadpan'});
pair(163, 'attic', 'GF', 'V3', 'closeB', {eA: 'surprised', eB: 'deadpan'});
sc(C(165), 'collecchio', [], {cam: [960, 420, 1.1], cam2: [960, 400, 1.2], stamp: '1 GEN 2022'}, 'Tanzi dies at 83, in Parma');
sc(C(168), 'dairy', [], {cam: [960, 480, 1.05], strip: '1961 → 2003'}, 'he ran Parmalat for 40+ years');
chapter('CH6', 'Il latte sopravvive');

// ===================== CH6 =====================
sc(S(169) - 4, 'super', [], {cam: [960, 460, 1.05], cam2: [960, 440, 1.15]}, 'the milk survives');
sc(C(170), 'office', [a('BO', 960, {e: 'neutral', pose: 'talking'})], {st: {board: 'COMMISSARIO'}, cam: [960, 450, 1.4], strip: 'ENRICO BONDI'}, 'commissioner Enrico Bondi');
sc(C(171), 'court', [a('BO', 700, {pose: 'pointing', e: 'angry', s: 0.9}), a('V4', 1300, {e: 'concerned', s: 0.9, v: '3q', m: true})], {g: 'day', cam: [960, 470, 1.2]}, 'he sues the big banks');
sc(C(172), 'dairy', [a('BO', 700, {e: 'happy', pose: 'cheering'})], {cam: [960, 480, 1.15]}, 'plants, brands, products');
sc(C(173), 'stocks', [a('EX', 1400, {e: 'happy', v: '3q', m: true})], {st: {up: true}, cam: [960, 460, 1.15], stamp: '2011', strip: 'LACTALIS'}, 'French group Lactalis');
cnt(C(174), [{at: L(C(174), 174, '29'), to: 29, suf: '%', label: 'QUOTA LACTALIS', dur: 18}], '~29% stake, then a bid', {bg: '#2C3E50'});
sc(C(176), 'office', [a('EX', 960, {e: 'happy', pose: 'cheering'})], {st: {board: 'CONTROLLO'}, cam: [960, 450, 1.4], slam: 'NUOVE REGOLE', slamAt: 6, slamColor: '#2E5A3A'}, 'Rome passes new rules; Lactalis takes control');
pair(177, 'home', 'M', 'D', 'otsA', {eA: 'thinking'});
pair(179, 'home', 'M', 'D', 'two', {eA: 'surprised', eB: 'happy'});
pair(181, 'home', 'M', 'D', 'closeB', {eA: 'thinking', eB: 'happy'});
chapter('CH7', "L'abbiamo già visto");

// ===================== CH7 =====================
add(S(183) - 4, 'papers', {heads: ["LA ENRON D'EUROPA", 'PARMALAT CRAC', 'BUCO DA 14 MLD'], stampAt: L(S(183) - 4, 184, 'Europa'), stamp: '2003'}, "'Europe's Enron'");
sc(C(186), 'stocks', [], {st: {up: false}, cam: [960, 460, 1.1], stamp: 'GIU 2020', strip: 'WIRECARD'}, 'June 2020: Wirecard');
cnt(C(189), [{at: L(C(189), 189, 'miliardo'), to: 1.9, dec: 1, pre: '€', suf: ' MLD', label: 'DA TROVARE', dur: 20}], 'auditors look for €1.9B', {bg: '#2C3E50'});
sc(C(190), 'bank', [a('V4', 700, {e: 'deadpan', pose: 'shrugging'}), a('V2', 1250, {e: 'deadpan', v: '3q', m: true, pose: 'shrugging'})], {cam: [960, 470, 1.15], strip: 'FILIPPINE', slam: 'NON È NOSTRA CLIENTE', slamAt: L(C(190), 191, 'cliente'), slamSize: 50}, 'two Philippine banks: not our client');
sc(C(192), 'office', [a('V4', 960, {e: 'sad'})], {st: {board: '€ 0'}, cam: [960, 450, 1.4]}, 'the money probably does not exist');
sc(C(193), 'court', [a('JU', 960, {y: -60, e: 'deadpan'})], {g: 'day', cam: [960, 420, 1.4]}, 'insolvency');
card(194, 194, 'Diciassette anni dopo, un altro conto fantasma.');
pair(195, 'office', 'R', 'D', 'otsA', {eA: 'thinking', st: {board: 'WIRECARD'}});
pair(197, 'office', 'R', 'D', 'two', {eA: 'surprised', st: {board: 'WIRECARD'}});
pair(199, 'office', 'R', 'D', 'closeB', {eA: 'thinking', eB: 'deadpan', st: {board: 'WIRECARD'}});
chapter('CH8', 'Il tuo portafoglio');

// ===================== CH8 =====================
sc(S(201) - 4, 'home', [a('M', 960, {e: 'surprised', pose: 'holding', held: 'phone'})], {cam: [960, 460, 1.4]}, 'and you?');
sc(C(203), 'branch', [a('M', 960, {e: 'thinking'})], {cam: [960, 450, 1.4]}, 'the right question was simple');
sc(C(205), 'branch', [a('M', 700, {v: '3q', e: 'thinking', pose: 'pointing'}), a('TZ', 1250, {v: '3q', m: true, e: 'happy', pose: 'holding', held: 'letter'})], {cam: [960, 470, 1.2], slam: 'PERCHÉ ME LI CHIEDE?', slamAt: L(C(205), 207, 'chiede'), slamSize: 54, slamColor: '#2C3E50'}, 'if it has billions, why ask me?');
sc(C(208), 'branch', [a('V2', 960, {e: 'happy', pose: 'holding', held: 'letter'})], {cam: [960, 400, 1.6]}, 'Parmalat bonds at the trusted bank');
sc(C(209), 'super', [], {cam: [960, 300, 1.8]}, 'a familiar name is not a guarantee');
sc(C(210), 'branch', [a('SV', 0, {walk: [200, 700]}), a('PE', 0, {walk: [-100, 400]}), a('M', 0, {walk: [-400, 100]})], {cam: [700, 470, 1.15]}, 'in line with all the other creditors');
pair(212, 'branch', 'PE', 'V2', 'otsA', {eA: 'thinking'});
pair(214, 'branch', 'PE', 'V2', 'two', {eA: 'concerned'});
pair(216, 'branch', 'PE', 'V2', 'closeB', {eA: 'sad', eB: 'deadpan'});
pair(218, 'branch', 'SV', 'D', 'otsA', {eA: 'happy', eB: 'happy'});
pair(220, 'branch', 'SV', 'D', 'two', {eA: 'thinking', eB: 'thinking'});
sk(222, 'branch', 'SV', 'D', 'closeA', 'A', {eA: 'deadpan'});
chapter('CH9', 'Il latte vero, i soldi finti');

// ===================== CH9 =====================
sc(S(223) - 4, 'dairy', [], {cam: [960, 460, 1.0], cam2: [1100, 470, 1.1]}, 'the industrial story: real plants');
sc(C(225), 'dairy', [a('V3', 960, {e: 'happy', pose: 'holding'})], {cam: [960, 480, 1.3]}, 'real trucks, good milk');
sc(C(227), 'super', [a('SV', 960, {e: 'happy', pose: 'holding'})], {cam: [960, 470, 1.2]}, 'still on the shelves');
sc(C(228), 'office', [a('D', 960, {e: 'concerned', pose: 'pointing'})], {st: {board: 'TRAPPOLA'}, cam: [960, 450, 1.4]}, "that's the trap");
add(C(230), 'fridge', {painted: true}, 'the more familiar the carton, the less anyone opens the fridge');
card(231, 232, 'Il latte era vero. Per questo nessuno controllava i soldi.');
sc(C(233), 'bank', [], {st: {paper: 1}, cam: [960, 430, 2.0], cam2: [960, 410, 2.3]}, 'back to the December fax');
add(C(235), 'letter', {lines: ['BANK OF AMERICA', 'Conto Bonlat'], slam: 'FALSO', slamAt: 8}, 'a letter through a scanner');
sc(C(236), 'branch', [a('PE', 500, {v: 'back'}), a('SV', 800, {v: 'back'}), a('M', 1100, {v: 'back'}), a('V2', 1400, {v: 'back'})], {cam: [960, 470, 1.05]}, '100,000+ families');
card(237, 238, 'Il latte è ancora lì. I 14 miliardi no.');

sc(C(61), 'branch', [a('V2', 960, {e: 'happy', pose: 'holding', held: 'letter'})], {cam: [960, 420, 1.6]}, 'the company promises to repay with interest');
sc(C(185), 'stocks', [], {st: {up: false}, cam: [960, 460, 1.15], strip: 'ENRON (USA)'}, 'like the US energy giant');
raw.sort((x, y) => x[0] - y[0]);
for (let pass = 0; pass < 3; pass++) {
	const extra: Raw[] = [];
	raw.forEach((r, i) => {
		const to = i + 1 < raw.length ? raw[i + 1][0] : TOTAL;
		if (r[1] !== 'scene' || r[2].title || to - r[0] < 100) return;
		let mid = LINES.map((l, k) => (k > 0 ? C(k) : -1)).filter((c) => c > r[0] + 36 && c < to - 36);
		if (!mid.length && to - r[0] >= 130) mid = LINES.flatMap((l) => l.words.map((w) => Math.round(w.s * 30) - 2)).filter((c) => c > r[0] + 45 && c < to - 45);
		if (!mid.length) return;
		const cut = mid.reduce((best, c) => (Math.abs(c - (r[0] + to) / 2) < Math.abs(best - (r[0] + to) / 2) ? c : best), mid[0]);
		const p = r[2];
		const c0 = p.cam ?? [960, 540, 1.2];
		const tighter = (pass + i) % 2 === 0;
		const nc = tighter ? [c0[0], c0[1] - 20, c0[2] * 1.35] : [c0[0] + (i % 2 ? 120 : -120), c0[1], Math.max(1.0, c0[2] * 0.85)];
		extra.push([cut, 'scene', {...p, cam: nc, cam2: [nc[0], nc[1], nc[2] * 1.05], mv: 'creep', stamp: undefined, strip: undefined, slam: p.slam && p.slamAt > cut - r[0] ? p.slam : undefined, slamAt: p.slamAt !== undefined ? p.slamAt - (cut - r[0]) : undefined}, r[3].replace(/ \((punch-in|reframe)\)/g, '') + (tighter ? ' (punch-in)' : ' (reframe)')]);
	});
	raw.push(...extra);
	raw.sort((x, y) => x[0] - y[0]);
}
export const BEATS_PML = raw.map((r, i) => ({id: i + 1, at: r[0], to: i + 1 < raw.length ? raw[i + 1][0] : TOTAL, tpl: r[1], p: r[2], d: r[3]}));
