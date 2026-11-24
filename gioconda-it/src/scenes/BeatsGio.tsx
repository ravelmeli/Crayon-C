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

type Raw = [number, string, any, string];
const raw: Raw[] = [];
const add = (at: number, tpl: string, p: any, d: string) => raw.push([at, tpl, p, d]);
const a = (o: string, x: number, more: any = {}) => ({o, x, ...more});
const sc = (at: number, set: string, A: any[], more: any, d: string) => add(at, 'scene', {set, A, ...more}, d);
const card = (from: number, to: number, text: string, d = `CARD: ${text}`) => {
	const at = S(from) - 2;
	add(at, 'card', {text, typeStart: 0, typeEnd: E(to) - at}, d);
};
const chapter = (label: string, text: string) => add(gap(label).from + (label === 'TITLE+CH1' ? 66 : 0), 'chapter', {text}, `chapter: ${text}`);
// skit line helper
const sk = (id: number, set: string, A: string, B: string, frame: string, who: 'A' | 'B', more: any = {}) =>
	add(C(id), 'skit', {set, A, B, frame, who, line: id, ...more}, `skit (${set}): "${LINES[id].text}"`);

// ===================== COLD OPEN =====================
sc(0, 'paris', [a('PS', 0, {walk: [700, 1350], e: 'neutral'})], {cam: [960, 560, 1.25], cam2: [1150, 560, 1.3], stamp: '21 AGO 1911'}, 'a man in a white smock leaves the Louvre');
sc(C(1), 'paris', [a('PS', 0, {walk: [1000, 1500], e: 'deadpan'})], {cam: [1250, 480, 1.7], cam2: [1300, 470, 1.8]}, 'out of the Louvre');
sc(C(2), 'paris', [a('PS', 960, {pose: 'holding', held: 'painting', e: 'deadpan'})], {cam: [960, 600, 2.6], cam2: [960, 590, 2.8], mv: 'punch', pAt: L(C(2), 2, 'Gio')}, 'under the smock: the Gioconda');
card(3, 3, 'E per più di due anni, nessuno lo trova.');
sc(C(4), 'room', [a('I', 600, {v: '3q', e: 'concerned', pose: 'pointing'}), a('P', 1300, {v: '3q', m: true, e: 'happy'})], {cam: [960, 520, 1.3]}, 'police question him in his room');
sc(C(5), 'room', [a('P', 600, {v: '3q', e: 'neutral'})], {cam: [1000, 620, 1.5], cam2: [1040, 680, 2.0]}, 'the trunk is right there');
sc(C(7), 'room', [], {st: {open: 1, reveal: 1}, cam: [1040, 650, 2.3], cam2: [1040, 640, 2.5], mv: 'settle'}, 'under the shirts: the painting');
sc(C(8), 'salon', [a('V1', 600, {v: '3q', e: 'happy'}), a('V2', 1320, {v: '3q', m: true, e: 'neutral'})], {cam: [960, 480, 1.15]}, 'Salon Carré: the Gioconda before the theft');
sc(C(9), 'salon', [a('V1', 760, {v: 'back', e: 'happy'})], {cam: [960, 360, 1.6], cam2: [960, 340, 1.8]}, 'an admired painting');
add(C(10), 'papers', {heads: ['LA JOCONDE VOLÉE', 'MONA LISA STOLEN', 'RUBATA LA GIOCONDA'], stampAt: L(C(10), 10, 'pianeta'), stamp: 'MONDO'}, 'front pages everywhere');
card(11, 11, 'La gente fa la fila per guardare un muro vuoto.');
sk(12, 'salon', 'V1', 'V2', 'otsA', 'A', {st: {state: 'empty'}, eA: 'happy'});
sk(13, 'salon', 'V1', 'V2', 'otsB', 'B', {st: {state: 'empty'}});
sk(14, 'salon', 'V1', 'V2', 'two', 'A', {st: {state: 'empty'}, eA: 'surprised'});
sk(15, 'salon', 'V1', 'V2', 'closeB', 'B', {st: {state: 'empty'}});
sc(C(16), 'paris', [a('P', 960, {pose: 'shrugging', e: 'concerned'})], {cam: [960, 520, 1.45]}, 'not a criminal mastermind');
sc(C(17), 'village', [a('P', 960, {e: 'happy', pose: 'talking'})], {cam: [960, 500, 1.1], strip: 'DUMENZA (VARESE)'}, 'an Italian worker from Varese');
sc(C(18), 'workshop', [a('PS', 760, {pose: 'holding', e: 'happy'})], {props: [{k: 'glass', x: 1200, y: 560, s: 1.2}], cam: [960, 520, 1.3]}, 'he knew the painting');
sc(C(19), 'salon', [a('PS', 760, {pose: 'pointing', e: 'happy', v: '3q'})], {cam: [960, 360, 1.5], cam2: [960, 320, 1.7], mv: 'punch', pAt: L(C(19), 19, 'montato')}, 'the glass was his work');
card(20, 20, 'Come fa un vetraio a rubare la Gioconda?');
add(gap('TITLE+CH1').from, 'scene', {set: 'salon', st: {state: 'empty'}, A: [], title: true, cam: [960, 380, 1.15], cam2: [960, 360, 1.25]}, 'TITLE over the four hooks');
chapter('TITLE+CH1', 'Il ragazzo di Dumenza');

// ===================== CH1: DUMENZA =====================
sc(S(21) - 4, 'village', [a('P', 960, {e: 'happy'})], {cam: [960, 460, 1.0], cam2: [960, 520, 1.15], stamp: '1881'}, 'Dumenza above Lago Maggiore');
add(C(22), 'map', {pts: [[1180, 300, 'DUMENZA'], [560, 260, 'PARIGI']], icon: 'train', dur: 40}, 'to France for work');
sc(C(23), 'paris', [a('P', 760, {pose: 'holding', e: 'neutral', v: '3q'})], {props: [{k: 'sign', x: 1300, y: 420, text: 'DECORAZIONI', w: 320}], cam: [960, 520, 1.3]}, 'decorator and house painter in Paris');
add(C(24), 'letter', {lines: ['......  ........', '..... ......', '...........'], slam: 'MINACCIA', slamAt: L(C(24), 25, 'lettera')}, '1910: a threat letter');
add(C(26), 'counters', {items: [{at: L(C(26), 26, 'dozzina'), to: 12, label: 'QUADRI SOTTO VETRO', dur: 20}], bg: '#7A2E2E', pattern: 'dots', g: 'sepia'}, 'a dozen paintings under glass');
sc(C(27), 'salon', [], {cam: [960, 320, 1.8], cam2: [960, 310, 2.1], mv: 'settle', stamp: '1910'}, 'among them, the Gioconda');
sc(C(28), 'workshop', [a('V3', 600, {v: '3q', e: 'neutral', pose: 'pointing'}), a('PS', 1240, {v: '3q', m: true, e: 'happy'})], {cam: [960, 520, 1.25]}, 'the glaziers, and Peruggia');
sc(C(29), 'workshop', [a('PS', 960, {pose: 'shrugging', e: 'thinking'})], {cam: [960, 520, 1.4]}, 'sources disagree');
sc(C(30), 'salon', [a('PS', 700, {v: '3q', pose: 'holding', e: 'neutral'}), a('G', 1350, {v: '3q', m: true, e: 'neutral'})], {cam: [960, 450, 1.2]}, 'he knows the room and its habits');
sk(31, 'salon', 'G', 'V3', 'otsA', 'A', {eA: 'thinking', eB: 'happy'});
sk(32, 'salon', 'G', 'V3', 'otsB', 'B', {eB: 'happy'});
sk(33, 'salon', 'G', 'V3', 'two', 'A', {also: {who: 'B', line: 33}, eB: 'happy'});
sk(34, 'salon', 'G', 'V3', 'otsA', 'A', {eA: 'neutral'});
sk(35, 'salon', 'G', 'V3', 'closeB', 'B', {eB: 'sad'});
add(C(36), 'print', {}, 'remember that glass: a fingerprint');
add(C(38), 'counters', {items: [{at: 4, to: 1, label: 'IMPRONTA', dur: 8}], bg: '#1E2A30', pattern: 'tiles', g: 'night', slam: 'VALE UNA FORTUNA', slamAt: L(C(38), 38, 'fortuna'), slamColor: '#8FD23F'}, 'worth a fortune');
chapter('CH2', 'Il lunedì perfetto');

// ===================== CH2: THE PERFECT MONDAY =====================
sc(S(39) - 4, 'paris', [], {props: [{k: 'sign', x: 960, y: 560, text: 'CHIUSO', w: 260, bg: '#C33631'}], cam: [960, 460, 1.0], cam2: [960, 500, 1.15], stamp: 'LUN 21 AGO 1911'}, 'Monday: closed to the public');
sc(C(40), 'salon', [a('V3', 0, {walk: [300, 900]}), a('V5', 0, {walk: [1700, 1200]}), a('G', 1500, {v: '3q', m: true, e: 'deadpan'})], {cam: [960, 480, 1.1]}, 'only workers, cleaners, a few guards');
add(C(41), 'counters', {items: [{at: L(C(41), 41, '150'), to: 150, label: 'GUARDIANI', dur: 20}, {at: L(C(41), 41, 'quarto'), to: 250000, label: 'OGGETTI', dur: 26}], bg: '#7A2E2E', pattern: 'dots', g: 'sepia'}, 'fewer than 150 guards vs 250.000 objects');
sc(C(42), 'paris', [a('PS', 960, {e: 'thinking'})], {cam: [960, 520, 1.6], cam2: [960, 500, 1.75]}, 'how does he get in?');
sc(C(44), 'paris', [a('V3', 0, {walk: [-100, 700], s: 0.95}), a('PS', 0, {walk: [-300, 520]}), a('V5', 0, {walk: [-500, 340], s: 0.95})], {cam: [700, 520, 1.15], cam2: [800, 520, 1.15]}, 'version 1: in the morning with the workers');
sc(C(45), 'salonNight', [a('PS', 1500, {v: '3q', m: true, e: 'concerned', s: 0.9})], {cam: [1300, 480, 1.4], cam2: [1350, 470, 1.5]}, 'version 2: a night in a storeroom');
sc(C(46), 'salon', [a('PS', 560, {e: 'happy'}), a('PS', 960, {e: 'happy'}), a('PS', 1360, {e: 'happy'})], {cam: [960, 480, 1.15]}, 'everyone agrees: a white smock');
sc(C(48), 'salon', [a('PS', 960, {e: 'deadpan'})], {cam: [960, 590, 2.5], cam2: [960, 580, 2.7]}, 'the same smock as the museum workers');
card(49, 49, "Al Louvre, un camice bianco è un mantello dell'invisibilità.");
sc(C(50), 'salon', [], {cam: [960, 420, 1.0], cam2: [960, 400, 1.1]}, 'the salon is empty');
sc(C(51), 'salon', [a('PS', 0, {walk: [300, 860]})], {cam: [900, 450, 1.2]}, 'he walks to the Gioconda');
sc(C(52), 'salon', [a('PS', 960, {pose: 'holding', held: 'painting', e: 'neutral'})], {st: {state: 'empty'}, cam: [960, 420, 1.6], cam2: [960, 420, 1.7]}, 'off the four iron hooks');
sc(C(53), 'salon', [a('PS', 1300, {pose: 'holding', held: 'painting', e: 'neutral', v: '3q', m: true})], {st: {state: 'empty'}, props: [{k: 'frameEmpty', x: 600, y: 640, s: 0.8, rot: -8}, {k: 'glass', x: 860, y: 640, s: 0.7}], cam: [960, 520, 1.3]}, 'frame and glass left behind');
add(C(54), 'counters', {items: [{at: L(C(54), 55, '77'), to: 77, suf: ' CM', label: 'ALTEZZA', dur: 18}, {at: L(C(54), 55, '53'), to: 53, suf: ' CM', label: 'LARGHEZZA', dur: 18}], bg: '#6E7A4A', pattern: 'planks', g: 'sepia'}, 'a poplar panel 77 × 53');
sc(C(56), 'salon', [a('PS', 960, {pose: 'holding', held: 'painting', e: 'happy'})], {st: {state: 'empty'}, cam: [960, 560, 2.0]}, 'like a large tray');
sk(57, 'salon', 'PS', 'PS', 'otsA', 'A', {st: {state: 'empty'}, eA: 'concerned', hB: 'painting'});
sk(58, 'salon', 'PS', 'PS', 'otsB', 'B', {st: {state: 'empty'}, hB: 'painting'});
sk(59, 'salon', 'PS', 'PS', 'two', 'A', {st: {state: 'empty'}, eA: 'thinking', hB: 'painting'});
sk(60, 'salon', 'PS', 'PS', 'closeB', 'B', {st: {state: 'empty'}, hB: 'painting', eB: 'deadpan'});
sc(C(61), 'paris', [a('PS', 0, {walk: [800, 1500]}), a('G', 400, {v: 'back', e: 'neutral'})], {cam: [1000, 520, 1.2], cam2: [1200, 520, 1.2]}, 'out. Nobody stops him');
chapter('CH3', 'Quattro chiodi');

// ===================== CH3: FOUR HOOKS =====================
sc(S(64) - 4, 'salon', [a('B', 0, {walk: [200, 700]})], {st: {state: 'empty'}, cam: [800, 480, 1.15], strip: 'LOUIS BÉROUD'}, 'the next day: painter Louis Béroud');
sc(C(66), 'salon', [a('B', 700, {pose: 'pointing', e: 'happy', v: '3q'})], {st: {state: 'empty'}, cam: [880, 450, 1.3]}, 'he wants to paint the room');
sc(C(67), 'salon', [], {st: {state: 'empty'}, cam: [960, 320, 1.9], cam2: [960, 310, 2.2], mv: 'punch', pAt: L(C(67), 67, 'chiodi')}, 'only four hooks');
sc(C(68), 'salon', [a('B', 640, {v: '3q', e: 'concerned', pose: 'pointing'}), a('G', 1300, {v: '3q', m: true, pose: 'shrugging', e: 'happy'})], {st: {state: 'empty'}, cam: [960, 480, 1.25]}, 'the guards are not worried');
sc(C(70), 'salon', [a('G', 960, {pose: 'talking', e: 'happy'})], {st: {state: 'empty'}, props: [{k: 'sign', x: 1400, y: 300, text: 'FOTOGRAFO →', w: 320, bg: '#6E4726'}], cam: [1100, 450, 1.4]}, 'it must be at the photographer');
sk(72, 'salon', 'B', 'G', 'otsA', 'A', {st: {state: 'empty'}});
sk(73, 'salon', 'B', 'G', 'otsB', 'B', {st: {state: 'empty'}, eB: 'happy'});
sk(74, 'salon', 'B', 'G', 'two', 'A', {st: {state: 'empty'}, eA: 'surprised'});
sk(75, 'salon', 'B', 'G', 'closeB', 'B', {st: {state: 'empty'}, eB: 'deadpan'});
sc(C(76), 'salon', [a('G', 1520, {e: 'deadpan', v: '3q', m: true})], {st: {state: 'empty'}, cam: [1300, 480, 1.3], cam2: [1350, 470, 1.4]}, 'hours pass');
sc(C(77), 'paris', [a('G', 0, {walk: [400, 1300]})], {props: [{k: 'sign', x: 1550, y: 360, text: 'FOTOGRAFO', w: 300, bg: '#6E4726'}], cam: [1000, 500, 1.2], slam: 'NON C\'È', slamAt: L(C(77), 78, 'non'), slamY: 220}, 'the photographer does not have it');
card(79, 79, 'La Gioconda è sparita.');
sc(C(80), 'paris', [a('G', 960, {e: 'panic', marks: ['sweat']})], {props: [{k: 'sign', x: 960, y: 300, text: 'CHIUSO 1 SETTIMANA', w: 480, bg: '#C33631'}], cam: [960, 480, 1.2]}, 'the Louvre closes for a week');
add(C(81), 'papers', {heads: ['LA JOCONDE A DISPARU', 'MONA LISA GONE', 'RUBATA!'], stampAt: 18, stamp: 'EUROPA E AMERICA'}, 'front pages in Europe and America');
add(C(82), 'papers', {heads: ['DOV\'È?', 'CHI L\'HA PRESA?', 'IL SORRISO SPARITO'], stampAt: 22, stamp: 'COLAZIONE'}, 'her face on every breakfast table');
sc(C(83), 'salon', [], {st: {state: 'empty', crowd: 1}, cam: [960, 460, 1.05], cam2: [960, 440, 1.15]}, 'the museum reopens');
sc(C(84), 'salon', [a('V1', 600, {v: 'back'}), a('V2', 1300, {v: 'back'})], {st: {state: 'empty', crowd: 1.4}, cam: [960, 380, 1.3]}, 'crowds come to see the empty space');
sc(C(85), 'salon', [], {st: {state: 'empty', crowd: 2}, cam: [960, 520, 1.0], cam2: [960, 500, 1.08], slam: 'SECONDO UNA FONTE', slamAt: L(C(85), 85, 'persone'), slamColor: '#2C3E50', slamSize: 56}, 'more visitors than the year before (one source)');
sk(86, 'salon', 'V1', 'V2', 'two', 'A', {also: {who: 'B', line: 87}, st: {state: 'empty', crowd: 0.5}, eA: 'happy'});
sk(88, 'salon', 'V1', 'V2', 'closeA', 'A', {st: {state: 'empty', crowd: 0.5}, eA: 'happy', mA: ['sparkles']});
sc(C(89), 'archive', [a('I', 0, {walk: [300, 900]})], {cam: [900, 480, 1.1]}, 'the police search everywhere');
sc(C(90), 'archive', [a('I', 900, {pose: 'pointing', e: 'angry'})], {cam: [960, 480, 1.4]}, 'and pick the wrong suspects');
sc(C(91), 'paris', [a('I', 700, {v: '3q', pose: 'pointing', e: 'angry'}), a('AP', 1250, {v: '3q', m: true, e: 'surprised'})], {cam: [960, 500, 1.3], stamp: '7 SET 1911', strip: 'GUILLAUME APOLLINAIRE'}, 'Apollinaire arrested');
sc(C(92), 'archive', [a('I', 700, {v: '3q', e: 'concerned'}), a('PI', 1250, {v: '3q', m: true, e: 'concerned'})], {cam: [960, 500, 1.3], strip: 'PABLO PICASSO'}, 'Picasso questioned');
sc(C(94), 'archive', [a('I', 960, {pose: 'holding', held: 'letter', e: 'thinking'})], {cam: [960, 520, 1.5]}, 'the motive: earlier statuette thefts');
sc(C(96), 'paris', [a('AP', 700, {e: 'happy', pose: 'cheering'}), a('PI', 1200, {e: 'happy'})], {cam: [960, 500, 1.25], slam: 'SCAGIONATI', slamAt: L(C(96), 97, 'scagionati'), slamColor: '#2E8B57'}, 'both cleared');
chapter('CH4', 'Il pollice sul vetro');

// ===================== CH4: THE THUMB ON THE GLASS =====================
add(S(98) - 4, 'print', {}, 'the print on the abandoned case');
sc(C(100), 'archive', [a('I', 700, {v: '3q', pose: 'pointing', e: 'neutral'})], {props: [{k: 'sign', x: 1300, y: 300, text: 'PERUGGIA ×2', w: 300, bg: '#C33631'}], cam: [960, 450, 1.3]}, 'his prints are already on file');
sc(C(102), 'archive', [a('I', 960, {e: 'thinking', pose: 'shrugging'})], {cam: [960, 480, 1.5]}, 'so why not?');
sc(C(103), 'archive', [], {cam: [500, 360, 1.3], cam2: [1500, 360, 1.3], strip: 'ALPHONSE BERTILLON'}, 'cards sorted by body measurements');
sc(wf(103, 'misure') - 6, 'archive', [], {cam: [1100, 300, 2.0], cam2: [1300, 300, 2.0]}, 'drawers by height in cm');
add(C(104), 'print', {slam: 'SINISTRA', slamAt: L(C(104), 105, 'sinistra')}, 'one source: the left hand');
sc(C(106), 'archive', [a('I', 960, {pose: 'shrugging', e: 'sad'})], {cam: [960, 480, 1.6]}, 'the cards did not help');
add(C(107), 'phonebook', {}, 'analogy: a phone book sorted by height');
sk(108, 'archive', 'I', 'V4', 'two', 'A', {also: {who: 'B', line: 109}, eA: 'happy'});
sk(110, 'archive', 'I', 'V4', 'otsA', 'A', {eA: 'neutral'});
sk(111, 'archive', 'I', 'V4', 'two', 'B', {eB: 'thinking'});
sk(112, 'archive', 'I', 'V4', 'closeA', 'A', {eA: 'deadpan', mA: ['sweat']});
sc(C(113), 'room', [a('I', 600, {v: '3q', pose: 'pointing', e: 'neutral'}), a('P', 1300, {v: '3q', m: true, e: 'neutral'})], {cam: [960, 500, 1.25]}, 'police question Peruggia');
sc(C(114), 'room', [a('P', 960, {pose: 'shrugging', e: 'happy'})], {cam: [960, 480, 1.6]}, 'he knows nothing');
sc(C(115), 'room', [a('P', 960, {e: 'concerned', marks: ['dizzy']})], {cam: [960, 420, 2.0]}, 'he had been drinking');
sc(C(116), 'room', [a('I', 960, {e: 'happy', pose: 'talking'})], {cam: [960, 480, 1.6]}, 'they believe him');
sc(C(117), 'room', [], {cam: [1040, 640, 1.8], cam2: [1040, 660, 2.2]}, 'the painting is right there');
sc(C(119), 'room', [], {st: {open: 1, reveal: 1}, cam: [1040, 650, 2.3], mv: 'settle'}, 'a trunk with a false bottom');
sk(120, 'room', 'I', 'P', 'otsA', 'A', {eA: 'thinking', eB: 'happy'});
sk(121, 'room', 'I', 'P', 'otsB', 'B', {eB: 'happy'});
sk(122, 'room', 'I', 'P', 'two', 'A', {eB: 'happy'});
sk(123, 'room', 'I', 'P', 'closeB', 'B', {eB: 'deadpan'});
add(C(124), 'counters', {items: [{at: 4, to: 28, label: 'MESI', dur: 34}], bg: '#B8A88A', pattern: 'stripes', g: 'sepia'}, '28 months under the shirts');
chapter('CH5', 'Firenze, dicembre 1913');

// ===================== CH5: FLORENCE =====================
sc(S(125) - 4, 'roomNight', [a('P', 960, {e: 'thinking'})], {cam: [960, 500, 1.4], stamp: 'NOV 1913'}, 'Peruggia decides');
sc(C(127), 'shop', [a('GE', 960, {e: 'neutral', v: '3q'})], {cam: [960, 480, 1.3], strip: 'ALFREDO GERI'}, 'a Florence antique dealer');
add(C(128), 'letter', {lines: ['Egregio signore,', '...la Gioconda...'], sign: 'Leonardo'}, 'signed "Leonardo"');
add(C(129), 'counters', {items: [{at: L(C(129), 129, '500'), to: 500000, label: 'LIRE', dur: 26}], bg: '#6E4726', pattern: 'wood', g: 'sepia'}, '500.000 lire');
sk(130, 'shop', 'V2', 'GE', 'otsA', 'A', {eA: 'surprised'});
sk(131, 'shop', 'V2', 'GE', 'otsB', 'B', {eB: 'neutral'});
sk(132, 'shop', 'V2', 'GE', 'two', 'A', {also: {who: 'B', line: 133}, eA: 'surprised', eB: 'deadpan'});
sk(134, 'shop', 'V2', 'GE', 'two', 'A', {eA: 'thinking'});
sk(135, 'shop', 'V2', 'GE', 'closeB', 'B', {eB: 'happy'});
sc(C(136), 'uffizi', [a('GE', 0, {walk: [200, 760]}), a('PO', 0, {walk: [-100, 460]})], {cam: [700, 480, 1.15], strip: 'GIOVANNI POGGI'}, 'Geri brings the Uffizi director');
sc(C(137), 'hotel', [a('GE', 520, {v: '3q', e: 'neutral'}), a('PO', 760, {v: '3q', e: 'thinking'}), a('P', 1450, {v: '3q', m: true, e: 'happy'})], {props: [{k: 'trunk', x: 1080, y: 790, s: 0.8}], cam: [960, 480, 1.1], stamp: 'FIRENZE'}, 'Hotel Tripoli-Italia');
sc(C(138), 'hotel', [a('P', 1450, {v: '3q', m: true, e: 'happy', pose: 'pointing'})], {props: [{k: 'trunk', x: 1080, y: 790, s: 0.8, open: 1}], cam: [1150, 560, 1.6]}, 'he opens the trunk');
sc(C(139), 'hotel', [], {props: [{k: 'trunk', x: 1080, y: 790, s: 0.8, open: 1}], cam: [1080, 660, 2.6]}, 'the clothes come out');
sc(C(141), 'hotel', [], {props: [{k: 'trunk', x: 1080, y: 790, s: 0.8, open: 1, reveal: 1}, {k: 'painting', x: 1080, y: 560, s: 0.6, frame: false, glow: 1}], cam: [1080, 640, 2.4], mv: 'settle'}, 'and there she is');
card(142, 143, 'Poggi la guarda e capisce: è vera.');
sc(C(144), 'uffizi', [a('PO', 960, {pose: 'holding', held: 'painting', e: 'happy'})], {cam: [960, 480, 1.35]}, 'to the Uffizi for checks');
sc(C(145), 'hotel', [a('I', 640, {v: '3q', pose: 'pointing', e: 'angry'}), a('P', 1250, {v: '3q', m: true, e: 'panic', marks: ['sweat']})], {cam: [960, 500, 1.3], stamp: 'DIC 1913'}, 'arrested at the hotel');
add(C(146), 'years', {from: 11, to: 12, top: 'DICEMBRE', sign: '11 O 12?', dur: 14, wall: '#A8452E'}, 'mid-December: the 11th or the 12th');
add(C(148), 'map', {pts: [[1180, 470, 'FIRENZE'], [1330, 600, 'ROMA'], [1080, 300, 'MILANO']], icon: 'painting', dur: 70}, 'a tour of Italy: Florence, Rome, Milan');
sc(C(150), 'salon', [a('V1', 600, {v: 'back'}), a('V2', 1300, {v: 'back'})], {st: {crowd: 1}, cam: [960, 400, 1.2], cam2: [960, 360, 1.35], stamp: '4 GEN 1914'}, 'back at the Louvre');
chapter('CH6', 'Il patriota con il prezzo');

// ===================== CH6: THE PATRIOT WITH A PRICE =====================
sc(S(151) - 4, 'court', [a('J', 960, {e: 'deadpan', y: -60}), a('P', 1640, {e: 'concerned', s: 0.9})], {cam: [1100, 460, 1.1], stamp: 'GIU 1914'}, 'the trial in Florence');
sc(C(152), 'court', [a('P', 1640, {e: 'happy', pose: 'talking', s: 0.9})], {cam: [1620, 440, 1.8]}, 'he did it for Italy');
add(C(153), 'map', {pts: [[560, 260, 'PARIGI'], [1180, 470, 'FIRENZE']], icon: 'painting', dur: 40}, 'he believes Napoleon stole it: bring her home');
sc(C(155), 'court', [a('J', 960, {e: 'deadpan', y: -60, pose: 'pointing'})], {cam: [960, 360, 1.6], slam: 'NAPOLEONE? NO', slamAt: L(C(155), 156, 'non'), slamY: 200}, 'Napoleon has nothing to do with it');
card(157, 157, "La Gioconda in Francia l'aveva portata Leonardo.");
sc(C(158), 'amboise', [a('L', 0, {walk: [300, 760], held: 'painting'}), a('F', 1300, {v: '3q', m: true, e: 'happy', pose: 'pointing'})], {cam: [900, 480, 1.15], stamp: '1516', strip: 'AMBOISE, FRANCIA'}, 'Leonardo moves to France, invited by Francis I');
add(C(160), 'map', {pts: [[1300, 590, 'ROMA'], [520, 380, 'AMBOISE']], icon: 'painting', dur: 40}, 'the painting almost certainly travels with him');
sc(C(161), 'amboise', [a('F', 960, {pose: 'holding', held: 'painting', e: 'happy'})], {cam: [960, 480, 1.4]}, 'after his death: the king’s collection');
sk(162, 'amboise', 'F', 'L', 'otsA', 'A', {eA: 'thinking'});
sk(163, 'amboise', 'F', 'L', 'otsB', 'B');
sk(164, 'amboise', 'F', 'L', 'otsA', 'A', {eA: 'surprised'});
sk(165, 'amboise', 'F', 'L', 'two', 'B', {also: {who: 'A', line: 166}, eA: 'thinking', eB: 'neutral'});
sk(167, 'amboise', 'F', 'L', 'closeB', 'B', {eB: 'deadpan'});
sc(C(168), 'court', [a('J', 960, {e: 'happy', y: -60})], {cam: [960, 400, 1.5]}, 'the court is lenient');
add(C(169), 'counters', {items: [{at: 2, to: 1, label: 'ANNO', dur: 8}, {at: 8, to: 15, label: 'GIORNI', dur: 14}], bg: '#5A4A38', pattern: 'panels', g: 'sepia'}, '1 year and 15 days');
add(C(170), 'counters', {items: [{at: 2, to: 12, label: 'MESI', dur: 4}, {at: 10, from: 12, to: 7, label: 'IN APPELLO', dur: 20}], bg: '#5A4A38', pattern: 'panels', g: 'sepia'}, 'on appeal: about 7 months');
sc(C(171), 'paris', [a('P', 0, {walk: [500, 1100]})], {cam: [800, 500, 1.2], stamp: 'ESTATE 1914'}, 'released in summer 1914');
add(C(172), 'papers', {heads: ['GUERRA!', "L'EUROPA IN ARMI", 'MOBILITAZIONE'], stampAt: 14, stamp: '1914'}, 'just as Europe goes to war');
add(C(173), 'scale', {left: 'EROE', right: 'LADRO', side: 'L', items: ['ITALIANI'], ats: [6]}, 'a hero for many Italians');
add(C(174), 'scale', {left: 'EROE', right: 'LADRO', side: 'R', items: ['FRANCESI'], ats: [6]}, 'a thief for the French');
add(C(175), 'scale', {left: 'EROE', right: 'LADRO', side: 'N'}, 'not mutually exclusive');
add(C(176), 'counters', {items: [{at: L(C(176), 177, '500'), to: 500000, label: 'LIRE', dur: 24}], bg: '#6E4726', pattern: 'wood', g: 'sepia', slam: 'IL PREZZO DEL PATRIOTA', slamAt: 4}, 'the patriot had a price');
sc(C(178), 'salonNight', [a('V', 960, {e: 'thinking', pose: 'pointing'})], {cam: [960, 480, 1.4], strip: 'LA LEGGENDA'}, 'a legend: an Argentine con man');
add(C(179), 'copies', {}, 'six fake copies for six collectors');
sc(C(180), 'salonNight', [a('V', 960, {e: 'happy', pose: 'cheering'})], {cam: [960, 460, 1.5]}, 'a nice story');
add(C(181), 'copies', {slam: 'LEGGENDA', slamAt: L(C(181), 181, 'inventata')}, 'almost certainly invented');
chapter('CH7', 'Lo abbiamo già visto');

// ===================== CH7: WE'VE SEEN IT =====================
card(182, 182, 'Il Louvre non ha imparato del tutto la lezione.');
sc(C(183), 'apollon', [], {cam: [960, 400, 1.0], cam2: [960, 420, 1.12], stamp: '19 OTT 2025'}, "Galerie d'Apollon, 2025");
sc(C(184), 'apollon', [a('T', 1630, {s: 0.55, y: -330, e: 'deadpan'})], {st: {lift: 1}, cam: [1500, 380, 1.5]}, 'thieves come up on a lift');
sc(C(185), 'apollon', [a('T', 0, {walk: [1500, 1100]}), a('T', 0, {walk: [1700, 1300]})], {st: {lift: 1, broken: 0}, cam: [1200, 480, 1.25]}, 'in through a window');
sc(C(186), 'apollon', [a('T', 960, {pose: 'pointing', e: 'deadpan'}), a('T', 1420, {pose: 'holding', e: 'deadpan', v: '3q', m: true})], {st: {lift: 1, broken: 1}, cam: [1100, 500, 1.3]}, 'they smash the cases');
add(C(187), 'counters', {items: [{at: L(C(187), 187, 'minuti'), to: 8, pre: '< ', label: 'MINUTI', dur: 14}, {at: L(C(187), 187, 'gioielli'), to: 8, label: 'GIOIELLI', dur: 14}], bg: '#2A2218', pattern: 'panels', g: 'night'}, 'under 8 minutes, 8 jewels');
add(C(188), 'counters', {items: [{at: L(C(188), 188, '88'), to: 88, pre: '€', suf: ' MLN', label: 'VALORE STIMATO', dur: 26}], bg: '#2A2218', pattern: 'panels', g: 'night'}, '€88 million');
sk(189, 'office', 'R', 'D', 'otsA', 'A', {eA: 'surprised'});
sk(190, 'office', 'R', 'D', 'otsB', 'B');
sk(191, 'office', 'R', 'D', 'otsA', 'A', {eA: 'thinking'});
sk(192, 'office', 'R', 'D', 'otsB', 'B', {eB: 'neutral'});
sk(193, 'office', 'R', 'D', 'closeA', 'A', {eA: 'deadpan'});
sc(C(194), 'apollon', [], {st: {broken: 1}, props: [{k: 'crown', x: 960, y: 720, s: 1.4, rot: 18, broken: true}], cam: [960, 640, 1.8], strip: "CORONA DELL'IMPERATRICE EUGENIA", stripHold: 90}, "Empress Eugénie's crown, dropped and damaged");
sc(C(195), 'apollon', [], {st: {broken: 1}, cam: [960, 520, 1.2], slam: '???', slamAt: L(C(195), 196, 'mai'), slamY: 240}, 'the rest of the loot never resurfaced');
add(C(197), 'years', {from: 1911, to: 2025, top: 'ANNO', sign: 'LOUVRE', dur: 30, wall: '#3A2E1E'}, '114 years');
sc(C(198), 'apollon', [], {st: {broken: 1, lift: 1}, cam: [1630, 320, 2.0], cam2: [1630, 300, 2.3], mv: 'punch', pAt: L(C(198), 198, 'finestra')}, 'a window is still a window');
chapter('CH8', 'Il prezzo di un sorriso');

// ===================== CH8: THE PRICE OF A SMILE =====================
sc(S(199) - 4, 'home', [a('M', 960, {pose: 'holding', held: 'phone', e: 'surprised'})], {cam: [960, 480, 1.4]}, 'and you?');
sc(C(201), 'ticket', [a('TO', 0, {walk: [200, 700], s: 0.8}), a('M', 0, {walk: [1700, 1250], s: 0.8})], {cam: [960, 480, 1.05], stamp: 'GEN 2026'}, 'the Louvre ticket, January 2026');
add(C(202), 'counters', {items: [{at: L(C(202), 203, '22'), to: 22, pre: '€', label: 'RESIDENTI UE / SEE', dur: 18}], bg: '#2E5A3A', pattern: 'panels', g: 'none'}, 'EEA residents: €22');
add(C(204), 'counters', {items: [{at: 0, from: 22, to: 22, pre: '€', label: 'UE / SEE', dur: 2}, {at: L(C(204), 204, '32'), to: 32, pre: '€', label: 'USA', dur: 18}], bg: '#2C3E50', pattern: 'panels', g: 'none'}, 'an American tourist: €32');
sk(205, 'ticket', 'M', 'D', 'otsA', 'A', {eA: 'thinking'});
sk(206, 'ticket', 'M', 'D', 'otsB', 'B');
sk(207, 'ticket', 'M', 'D', 'otsA', 'A', {eA: 'surprised'});
sk(208, 'ticket', 'M', 'D', 'closeB', 'B', {eB: 'happy', mB: ['sparkles']});
add(C(209), 'counters', {items: [{at: L(C(209), 209, '30'), to: 30000, label: 'PERSONE AL GIORNO', dur: 26}], bg: '#2C3E50', pattern: 'panels', g: 'none'}, 'max 30.000 a day');
add(C(210), 'counters', {items: [{at: L(C(210), 210, '9') , to: 9000000, label: 'VISITATORI 2024', dur: 30}], bg: '#2C3E50', pattern: 'panels', g: 'none'}, 'about 9 million in 2024');
sc(wf(210, 'governo') - 6, 'ticket', [], {props: [{k: 'sign', x: 960, y: 760, text: 'COUR CARRÉE: SALA GIOCONDA', w: 640, bg: '#C9A94A', fg: '#111'}], cam: [960, 500, 1.1], cam2: [960, 560, 1.3]}, 'a room of her own under the Cour Carrée');
add(C(211), 'years', {from: 2026, to: 2031, top: 'APERTURA', sign: 'SALA GIOCONDA', dur: 24, wall: '#2C3E50'}, 'opening planned: 2031');
add(C(212), 'queue', {}, 'that queue was born one August morning');
sc(C(213), 'paris', [a('PS', 960, {e: 'deadpan'})], {cam: [960, 520, 2.2]}, 'a white smock');
sc(C(214), 'salon', [], {st: {state: 'empty'}, cam: [960, 320, 2.0], cam2: [960, 310, 2.3]}, 'four empty hooks');
chapter('CH9', 'Ladro o padre della leggenda?');

// ===================== CH9: THIEF OR FATHER OF THE LEGEND? =====================
add(S(215) - 4, 'scale', {left: 'PRO', right: 'CONTRO', side: 'L', items: ['NON DISTRUTTO', 'NON VENDUTO', 'INTATTO'], ats: [L(S(215) - 4, 216, 'distrutto'), 9999, 9999]}, 'defenders: not destroyed');
add(C(217), 'scale', {left: 'PRO', right: 'CONTRO', side: 'L', items: ['NON DISTRUTTO', 'NON VENDUTO', 'INTATTO'], ats: [-99, L(C(217), 217, 'venduto'), 9999]}, 'not sold abroad');
add(C(218), 'scale', {left: 'PRO', right: 'CONTRO', side: 'L', items: ['NON DISTRUTTO', 'NON VENDUTO', 'INTATTO'], ats: [-99, -99, L(C(218), 218, 'intatto')]}, 'kept intact, wanted it in Italy');
add(C(219), 'scale', {left: 'PRO', right: 'CONTRO', side: 'R', items: ['HA RUBATO', 'HA MENTITO', '500.000 LIRE'], ats: [L(C(219), 220, 'rubato'), 9999, 9999]}, 'accusers: he stole');
add(C(221), 'scale', {left: 'PRO', right: 'CONTRO', side: 'R', items: ['HA RUBATO', 'HA MENTITO', '500.000 LIRE'], ats: [-99, L(C(221), 221, 'mentito'), L(C(221), 221, 'chies')]}, 'lied, asked half a million');
card(222, 223, 'Ma il vero colpo di Peruggia non è il furto. È la fama.');
sc(C(224), 'salon', [a('V1', 700, {v: 'back'})], {cam: [960, 400, 1.3], stamp: 'PRIMA DEL 1911'}, 'before 1911: a masterpiece among many');
sc(C(226), 'modern', [], {st: {crowd: 1.3}, cam: [960, 480, 1.05], cam2: [960, 450, 1.15]}, 'after: a celebrity');
add(C(227), 'map', {pts: [[560, 260, 'PARIGI'], [1180, 470, 'FIRENZE'], [560, 260, 'PARIGI']], icon: 'painting', dur: 34}, 'he wanted to bring her home…');
add(C(228), 'queue', {}, '…instead he made her everyone’s');
sk(229, 'modern', 'M', 'L', 'otsA', 'A', {eA: 'thinking', st: {crowd: 0.6}});
sk(230, 'modern', 'M', 'L', 'otsB', 'B', {eB: 'happy', st: {crowd: 0.6}});
sk(231, 'modern', 'M', 'L', 'otsA', 'A', {eA: 'surprised', st: {crowd: 0.6}});
add(C(232), 'scene', {set: 'modern', st: {crowd: 0.6}, A: [a('L', 640, {v: '3q', pose: 'pointing', e: 'happy', talk: 232}), a('PS', 1280, {v: '3q', m: true, e: 'happy', pose: 'cheering'})], cam: [960, 470, 1.35]}, '"…and a glazier from Dumenza"');
sc(C(233), 'modern', [], {cam: [960, 420, 1.0], cam2: [960, 380, 1.12]}, 'back to the Louvre today');
sc(C(234), 'modern', [], {cam: [960, 330, 1.7], cam2: [960, 320, 1.9], mv: 'punch', pAt: L(C(234), 234, 'vetro')}, 'thick glass');
sc(C(235), 'modern', [], {st: {crowd: 1.5}, cam: [960, 560, 1.15]}, 'a rope and a crowd');
sc(C(236), 'modern', [], {st: {crowd: 2}, cam: [960, 760, 1.6], cam2: [960, 740, 1.8]}, 'thousands of phones held up');
sc(C(237), 'salon', [], {st: {state: 'empty', glow: 1}, cam: [960, 400, 1.2], cam2: [960, 310, 2.1]}, 'for two years the world stared at four hooks');
card(238, 239, 'Il furto è finito nel 1913. La fila non è mai finita.');

raw.sort((x, y) => x[0] - y[0]);
export const BEATS_GIO = raw.map((r, i) => ({id: i + 1, at: r[0], to: i + 1 < raw.length ? raw[i + 1][0] : TOTAL, tpl: r[1], p: r[2], d: r[3]}));
