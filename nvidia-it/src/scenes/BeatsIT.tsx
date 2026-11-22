import {LINES, TOTAL} from '../lib';
import {CHRIS, CURTIS, DANA, EXTRAS, GAMER, JENSEN, MARCO, RAY, SCIENTIST, COOK_A, COOK_B} from '../rig/outfits';
import {wf} from './Tpl';

const S = (id: number) => LINES[id].startFrame;
const E = (id: number) => LINES[id].endFrame;
// cut point in the pause before line `id`
const C = (id: number) => (id === 0 ? 0 : Math.round((E(id - 1) + S(id)) / 2));
const young = EXTRAS[5];

export type BeatIT = {at: number; tpl: string; p?: any; d: string};
type Raw = [number, string, any, string];

// local-frame helper: frame of word `sub` in line `id`, relative to beat start `at`
const L = (at: number, id: number, sub: string) => wf(id, sub) - at;

const card = (from: number, to: number, text: string): Raw => {
	const at = S(from) - 2;
	return [at, 'card', {text, typeStart: 0, typeEnd: E(to) - at}, `CARD: ${text}`];
};

const raw: Raw[] = [];
const add = (at: number, tpl: string, p: any, d: string) => raw.push([at, tpl, p, d]);

// ===================== COLD OPEN =====================
add(0, 'stage', {zoom: 1.5, strip: 'JENSEN HUANG'}, 'Jensen on stage with the glowing chip');
add(C(1), 'years', {from: 1993, to: 2026, sign: 'NVIDIA HQ'}, '33 anni: calendar 1993→2026');
add(wf(1, 'sempre') - 4, 'jacketClose', {punch: wf(1, 'giacca') - (wf(1, 'sempre') - 4)}, 'close-up on the jacket, punch on "giacca"');
raw.push(card(2, 3, 'Poi, in una settimana, sparisce.'));
add(C(4), 'walkout', {stamp: 'NOV 2026'}, 'Jensen walks out through USCITA');
add(C(5), 'papers', {heads: ['IL CAPO SE NE VA', 'INDAGINE', 'SOSPETTA SPIA'], stampAt: L(C(5), 5, 'sospettata'), stamp: 'PRESUNTA'}, 'newspapers + PRESUNTA stamp');
add(C(6), 'probe', {label: 'INDAGINE INTERNA'}, 'board probe: magnifier over folder');
add(C(7), 'rainWindow', {}, 'Jensen alone at a rainy window');
add(C(8), 'clipboard', {title: 'ACCUSE', stamp: 'NESSUNA', stampAt: L(C(8), 8, 'nulla')}, 'charges sheet: NESSUNA');
add(C(9), 'earnings', {onAt: L(C(9), 9, 'strana'), countAt: L(C(9), 10, '115'), cutAt: L(C(9), 10, 'cinque')}, 'screen on → $115,8 MLD counter + stack (hold)');
raw.push(card(12, 13, "Circa 50 milioni all'ora. Notti comprese."));
add(C(14), 'skit', {frame: 'otsA', who: 'A', line: 14}, 'skit: "Quindi va tutto bene?"');
add(C(15), 'skit', {frame: 'otsB', who: 'B', line: 15}, 'skit: "Trimestre record."');
add(C(16), 'skit', {frame: 'two', who: 'A', line: 16, exprA: 'thinking'}, 'skit: "E chi guida?"');
add(C(17), 'skit', {frame: 'closeB', who: 'B', line: 17}, 'skit close-up: "Ad interim."');
add(C(18), 'stage', {zoom: 1.6, expr: 'concerned', pose: 'idle', marks: ['sweat']}, "Huang's problem");
add(C(19), 'skit', {frame: 'two', line: 19, exprA: 'concerned', exprB: 'concerned', set: 'officeNight'}, "Nvidia's problem: staff at night");
add(C(20), 'bets', {ats: [L(C(20), 20, '33'), L(C(20), 20, 'ogni'), L(C(20), 20, 'scommessa'), L(C(20), 20, 'fatta')], plate: 'JENSEN HUANG', plateAt: L(C(20), 20, 'lui')}, 'felt: every big bet was his');
add(C(21), 'emptyChair', {}, 'empty CEO chair');
add(C(22), 'stageJacket', {z0: 1.3, z1: 1.55, y0: 470, y1: 440}, 'the jacket — remember it');
raw.push(card(24, 24, 'Nvidia può vincere senza di lui?'));
add(E(24) + 14, 'stageJacket', {title: true, z0: 1.05, z1: 1.15}, 'TITLE over the glowing jacket');
add(E(24) + 14 + 66, 'chapter', {text: "Un tavolo da Denny's"}, 'chapter 1');

// ===================== CH1: DENNY'S =====================
add(S(25) - 4, 'dennys', {stamp: 'APR 1993', strip: 'SAN JOSE, CALIFORNIA', c0: {x: 960, y: 500, zoom: 1.0}, c1: {x: 960, y: 520, zoom: 1.1}}, "Denny's establishing wide");
add(C(27), 'dennys', {c0: {x: 960, y: 560, zoom: 1.35}, c1: {x: 960, y: 560, zoom: 1.45}}, 'three engineers, one table');
add(C(28), 'dennys', {waitress: true, pour: true, c0: {x: 1200, y: 520, zoom: 1.3}, c1: {x: 1250, y: 520, zoom: 1.35}}, 'endless coffee refill');
add(C(29), 'family', {}, 'family photo, 1993');
add(C(30), 'jar', {to: 40000, at: L(C(30), 30, '40')}, 'capital jar $40.000');
add(C(31), 'skit', {set: 'dennys', A: CHRIS, B: young, frame: 'otsA', who: 'A', line: 31, exprA: 'thinking', exprB: 'happy'}, 'skit: "Che cosa costruiamo?"');
add(C(32), 'skit', {set: 'dennys', A: CHRIS, B: young, frame: 'otsB', who: 'B', line: 32, exprB: 'happy'}, 'skit: "Grafica 3D…"');
add(C(33), 'skit', {set: 'dennys', A: CURTIS, B: young, frame: 'two', who: 'A', line: 33, exprA: 'thinking', exprB: 'happy'}, 'skit: "C\'è un mercato?"');
add(C(34), 'skit', {set: 'dennys', A: CURTIS, B: young, frame: 'closeB', who: 'B', line: 34, exprB: 'deadpan'}, 'skit close-up: "Non ancora."');
add(C(35), 'flop', {label: 'NV1', slamAt: L(C(35), 35, 'sfonda')}, 'first chip: FLOP');
add(C(36), 'office96', {stamp: '1996', ripAt: L(C(36), 36, 'mese')}, '1996: days of cash rip away');
add(C(37), 'office96', {sega: true, buoyAt: L(C(37), 38, 'ciambella') - 6, ripAt: -100}, 'Sega lifebuoy $5 MLN');
add(C(39), 'skit', {set: 'office96', A: CHRIS, B: young, frame: 'otsA', who: 'A', line: 39}, 'skit: "Quanti mesi ci restano?"');
add(C(40), 'skit', {set: 'office96', A: CHRIS, B: young, frame: 'otsB', who: 'B', line: 40, exprB: 'deadpan'}, 'skit: "Uno."');
add(C(41), 'skit', {set: 'office96', A: CHRIS, B: young, frame: 'two', who: 'A', line: 41, exprA: 'panic', marksA: ['sweat']}, 'skit: "E se il prossimo chip fallisce?"');
add(C(42), 'skit', {set: 'office96', A: CHRIS, B: young, frame: 'closeB', who: 'B', line: 42, exprB: 'deadpan'}, 'skit close-up: "Zero."');
add(C(43), 'product', {label: 'RIVA 128', stamp: '1997', g: 'sepia'}, 'RIVA 128 slides in');
add(C(45), 'staff', {n: 40}, '~40 employees appear');
add(C(46), 'boxes', {}, 'boxes stack, 1.000.000 counter');
add(C(47), 'skit', {set: 'office96', A: CURTIS, B: young, frame: 'otsA', who: 'A', line: 47, exprA: 'happy'}, 'skit: "Quanti ne abbiamo venduti?"');
add(C(48), 'skit', {set: 'office96', A: CURTIS, B: young, frame: 'otsB', who: 'B', line: 48, exprB: 'happy'}, 'skit: "Un milione."');
add(C(49), 'skit', {set: 'office96', A: CURTIS, B: young, frame: 'two', who: 'A', line: 49, exprA: 'thinking'}, 'skit: "E quanti mesi…?"');
add(C(50), 'skit', {set: 'office96', A: CURTIS, B: young, frame: 'closeB', who: 'B', line: 50, exprB: 'happy', marksB: ['sparkles']}, 'skit close-up: "Parecchi."');
raw.push(card(51, 52, 'Salvi. Per questa volta.'));
add(C(53), 'exchange', {stamp: '1999'}, 'stock exchange: bell, NVDA ticker');
add(C(54), 'product', {box: 'GeForce 256', g: 'day', wall: '#2C3E50', slam: 'GPU', slamAt: L(C(54), 55, 'GPU')}, 'GeForce box + GPU sticker');
add(E(56) + 16, 'chapter', {text: 'La scommessa che nessuno capiva'}, 'chapter 2');

// ===================== CH2: CUDA =====================
add(S(57) - 4, 'lab', {stamp: '2006', exprJ: 'happy', poseJ: 'pointing'}, 'lab: the strangest bet');
add(C(58), 'lab', {glowAt: L(C(58), 58, 'CUDA'), c0: {x: 960, y: 520, zoom: 1.5}, c1: {x: 960, y: 500, zoom: 1.6}}, 'CUDA: card glows on');
add(C(59), 'split', {ats: [0, L(C(59), 59, 'calcoli')]}, 'games vs calculations panels');
add(C(60), 'skit', {set: 'lab', A: DANA, B: JENSEN, frame: 'otsA', who: 'A', line: 60, exprA: 'thinking'}, 'skit: "I giocatori lo vogliono?"');
add(C(61), 'skit', {set: 'lab', A: DANA, B: JENSEN, frame: 'two', who: 'B', line: 61, also: {who: 'A', line: 62}, exprB: 'deadpan'}, 'skit two-shot: "No." / "Gli scienziati?"');
add(C(63), 'skit', {set: 'lab', A: DANA, B: JENSEN, frame: 'otsB', who: 'B', line: 63, exprB: 'thinking'}, 'skit: "Forse."');
add(C(64), 'skit', {set: 'lab', A: DANA, B: JENSEN, frame: 'otsA', who: 'A', line: 64, exprA: 'angry'}, 'skit: "E chi paga?"');
add(C(65), 'skit', {set: 'lab', A: DANA, B: JENSEN, frame: 'closeB', who: 'B', line: 65, exprB: 'happy'}, 'skit close-up: "Noi."');
add(C(66), 'alex', {stamp: '2012'}, 'Alex Krizhevsky + two GTX 580');
add(wf(66, 'due') - 4, 'product', {label: '2 × GTX 580', g: 'tech', wall: '#1E2A30', pattern: 'tiles'}, 'two gaming cards (GTX 580)');
add(C(67), 'compare', {panels: [{at: 6, x: 1100, h: 420, label: 'PRIMA', val: '26,2%', c: '#C33631'}, {at: L(C(67), 67, 'dimezzano'), x: 1450, h: 245, label: 'ALEXNET', val: '15,3%'}], actor: 'alex'}, 'error bars: 26,2% → 15,3%');
add(C(68), 'network', {}, 'neural network grows out of the GPU');
add(C(69), 'mine', {}, 'mine cart of glowing GPUs (sentence starts over picture)');
raw.push([wf(69, 'diventa') - 2, 'card', {text: "...diventa una miniera d'oro.", typeStart: 0, typeEnd: E(69) - (wf(69, 'diventa') - 2)}, 'CARD: miniera d\'oro']);
add(C(70), 'years', {from: 2012, to: 2025, top: 'ANNO', sign: 'OTTOBRE', dur: 26, wall: '#48296A'}, 'calendar 2012 → 2025');
add(C(71), 'stairs', {stamp: 'OTT 2025', ats: [L(C(71), 71, 'prima'), L(C(71), 71, 'Apple'), L(C(71), 71, 'Microsoft')]}, 'staircase: NVIDIA $5.000 MLD > Apple > Microsoft');
add(C(72), 'skit', {frame: 'otsA', who: 'A', line: 72, exprA: 'surprised'}, 'skit: "5 mila miliardi?"');
add(C(73), 'skit', {frame: 'two', who: 'B', line: 73, also: {who: 'A', line: 74}, exprA: 'thinking'}, 'skit two-shot: "Sì." / "E la giacca?"');
add(C(75), 'skit', {frame: 'closeB', who: 'B', line: 75}, 'skit close-up: "Sempre la stessa."');
add(E(75) + 12, 'chapter', {text: 'La cucina senza chef'}, 'chapter 3');

// ===================== CH3: KITCHEN + PARALLELS =====================
add(S(76) - 4, 'kitchen', {mode: 'wide', moreAt: wf(77, 'migliaia')}, 'kitchen wide, more cooks on "migliaia"');
add(C(78), 'kitchen', {mode: 'chef'}, 'chef (Jensen in toque) points at the menu');
add(C(79), 'kitchen', {mode: 'menu', items: [['GRAFICA', L(C(79), 80, 'grafica')], ['CUDA', L(C(79), 81, 'CUDA')], ['IA', L(C(79), 82, 'intelligenza')]]}, 'menu writes on: GRAFICA, CUDA, IA');
add(C(83), 'kitchen', {mode: 'chef', pose: 'holding', expr: 'thinking'}, 'chef weighs the bet');
add(C(84), 'kitchen', {mode: 'closed'}, 'wrong bet: shutter, CHIUSO');
add(C(85), 'kitchen', {mode: 'win'}, 'right bet: the kitchen conquers the world');
add(C(86), 'skit', {set: 'kitchen', A: COOK_A, B: COOK_B, frame: 'otsA', who: 'A', line: 86}, 'skit: "Chi sceglie adesso?"');
add(C(87), 'skit', {set: 'kitchen', A: COOK_A, B: COOK_B, frame: 'otsB', who: 'B', line: 87}, 'skit: "Un comitato."');
add(C(88), 'skit', {set: 'kitchen', A: COOK_A, B: COOK_B, frame: 'otsA', who: 'A', line: 88, exprA: 'surprised'}, 'skit: "Quanto ci mette?"');
add(C(89), 'skit', {set: 'kitchen', A: COOK_A, B: COOK_B, frame: 'closeB', who: 'B', line: 89, exprA: 'sad'}, 'skit close-up: "Il prossimo trimestre."');
add(C(90), 'kitchen', {mode: 'keep', unknown: true}, 'cooks keep cooking; toque on the hook');
raw.push(card(91, 91, 'Abbiamo già visto questa mossa.'));
add(C(92), 'apple', {mode: 'out', stamp: 'SET 1985'}, 'Apple shows Jobs the door');
add(C(94), 'apple', {mode: 'collapse'}, '12 years later: falling chart');
add(C(95), 'apple', {mode: 'next'}, 'Apple buys NeXT');
add(C(96), 'apple', {mode: 'interim', slamAt: L(C(96), 96, 'Interim')}, 'CEO AD INTERIM plate');
add(C(97), 'skit', {frame: 'otsA', who: 'A', line: 97, exprA: 'surprised'}, 'skit: "Ad interim?"');
add(C(98), 'skit', {frame: 'otsB', who: 'B', line: 98}, 'skit: "Ad interim."');
add(C(99), 'skit', {frame: 'two', who: 'A', line: 99, exprA: 'thinking'}, 'skit: "Vi suona familiare?"');
add(C(100), 'skit', {frame: 'closeB', who: 'B', line: 100}, 'skit close-up: "Molto."');
add(C(101), 'disney', {stamp: 'NOV 2022', backAt: L(C(101), 103, 'richiama')}, 'Disney: successor leaves, Iger returns');
add(C(104), 'bill', {}, 'the bill arrives years later');
add(E(104) + 10, 'chapter', {text: 'Il tuo portafoglio'}, 'chapter 4');

// ===================== CH4: WALLET =====================
add(S(105) - 4, 'map', {pinAt: L(S(105) - 4, 105, 'Italia')}, 'map: USA → ITALIA');
add(C(106), 'marco', {mode: 'phone'}, 'Marco and his ETF app');
add(C(107), 'skyline', {}, '500 American companies');
add(C(108), 'pizza', {}, 'a slice of Nvidia');
add(C(109), 'coins', {}, '6 coins out of 100 turn green');
add(C(110), 'skit', {set: 'home', A: MARCO, B: DANA, frame: 'otsA', who: 'A', line: 110, exprA: 'deadpan'}, 'skit: "Io non ho azioni Nvidia."');
add(C(111), 'skit', {set: 'home', A: MARCO, B: DANA, frame: 'two', who: 'B', line: 111, also: {who: 'A', line: 112}, exprA: 'neutral'}, 'skit two-shot: "Hai un ETF?" / "Sì."');
add(C(113), 'skit', {set: 'home', A: MARCO, B: DANA, frame: 'closeB', who: 'B', line: 113, exprA: 'surprised'}, 'skit close-up: "Allora sì."');
add(E(113) + 10, 'chapter', {text: 'Il motore e la trappola'}, 'chapter 5');

// ===================== CH5: ENGINE & TRAP =====================
add(S(114) - 4, 'skit', {frame: 'two', exprA: 'happy', exprB: 'happy', line: 114, marksA: ['sparkles']}, 'the optimists');
add(C(115), 'people', {mode: 'kress', plate: 'COLETTE KRESS', strip: 'CEO AD INTERIM'}, 'Kress at the podium');
add(C(116), 'compare', {set: 'office', g: 'day', panels: [{at: 6, x: 1180, h: 300, label: 'QUESTO TRIM.', val: '$115,8 MLD'}, {at: L(C(116), 116, '130'), x: 1480, h: 340, label: 'PROSSIMO', val: '$130 MLD'}], actor: 'kress'}, 'forecast panels');
add(C(117), 'people', {mode: 'search'}, 'CERCASI CEO: inside and outside');
add(C(118), 'people', {mode: 'jones', plate: 'HARVEY JONES', strip: 'PRESIDENTE', countAt: L(C(118), 119, '30')}, 'Harvey Jones, 30+ years');
add(C(120), 'engine', {}, 'the engine runs by itself');
add(C(121), 'engine', {slow: true, tagAt: L(C(121), 121, 'prezzo')}, 'the price tag drops');
add(C(122), 'china', {stopAt: L(C(122), 122, 'H200')}, 'H200 crates stopped at the China border');
add(C(123), 'rules', {at: L(C(123), 123, 'regole')}, 'Washington rulebook slams');
add(C(124), 'skit', {frame: 'otsA', who: 'A', line: 124}, 'skit: "Vendiamo in Cina?"');
add(C(125), 'skit', {frame: 'two', who: 'B', line: 125, also: {who: 'A', line: 126}, exprA: 'sad'}, 'skit two-shot: "Non più." / "Neanche un po\'?"');
add(C(127), 'skit', {frame: 'closeB', who: 'B', line: 127}, 'skit close-up: "Neanche un chip."');
add(C(128), 'earnings', {onAt: -100, countAt: -100, cutAt: 0}, 'the numbers stay strong');
add(C(129), 'trap', {}, 'golden numbers on a mousetrap');
raw.push(card(130, 130, 'È questa la trappola.'));
add(C(131), 'bets', {ats: [0, 6, 12, 18], plate: 'JENSEN HUANG', plateAt: L(C(131), 132, 'lui')}, "today's numbers = old bets, by him");
add(C(133), 'years', {from: 2026, to: 2031, top: 'ANNO', suffix: '?', sign: 'PROSSIMA SCOMMESSA', dur: 30}, 'calendar 2026 → 2031?');
add(C(135), 'car', {mode: 'wide', who: 'A', line: 135}, 'car, empty driver seat: "Chi guida adesso?"');
add(C(136), 'car', {mode: 'close', who: 'B', line: 136}, '"Il pilota automatico."');
add(C(137), 'car', {mode: 'close', who: 'A', line: 137}, '"Fino a quando?"');
add(C(138), 'car', {mode: 'curve', who: 'B', line: 138}, 'the curve sign arrives: "Fino alla prima curva."');
add(C(139), 'stageJacket', {z0: 1.0, z1: 1.1}, 'back to the stage');
add(C(140), 'stageJacket', {z0: 1.4, z1: 1.7, y0: 470, y1: 430}, 'the jacket hangs empty');
add(C(142), 'emptyChair', {board: true, z: 1.2}, 'the board: he is not coming back');
add(C(143), 'kitchen', {mode: 'menu', unknown: true}, 'the next menu: ???');
raw.push(card(144, 144, 'E nessuno sa quale sarà la prossima scommessa.'));

// sort + to
raw.sort((a, b) => a[0] - b[0]);
export const BEATS_IT: (BeatIT & {to: number; id: number})[] = raw.map((r, i) => ({
	id: i + 1,
	at: r[0],
	to: i + 1 < raw.length ? raw[i + 1][0] : TOTAL,
	tpl: r[1],
	p: r[2],
	d: r[3],
}));
