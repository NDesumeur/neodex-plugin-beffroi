// Beffroi : on monte les étages d'un clocher en courant et en sautant, plus haut quand on court vite, avant que le clocher ne nous rattrape.
// Jeu NeoDex en pixel art dessiné à la main (police bitmap, cadres et boutons en pixels). Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Beffroi</span><span class="hint">← → ou QD pour courir · Espace ou ↑ pour sauter · P : pause</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="bfCanvas" width="144" height="192" role="img" aria-label="Beffroi"></canvas></div>
    <div class="gSide">
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="bfStats"></div></div>
      <div class="row"><button class="btn main" id="bfNew">NOUVELLE PARTIE</button></div>
      <div class="hint">Plus tu cours vite, plus tu sautes haut : la jauge en haut montre ta vitesse. Les murs te renvoient sans freiner, profites-en pour prendre de l'élan. Dès le 5e étage, le clocher défile tout seul, de plus en plus vite : s'il te rattrape, c'est perdu. Enchaîne les sauts de 2 étages ou plus pour un combo : il rapporte le carré des étages gagnés.</div>
    </div></div>
</div>`;
const CSS = `.gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:0 0 auto;position:relative}
.gameBox canvas{height:min(72vh,768px);width:auto;aspect-ratio:144/192;image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none}
.gSide{display:flex;flex-direction:column;gap:14px;flex:1;min-width:250px;max-width:420px}
.gSide .sysCard{display:flex;flex-direction:column}
.gStats{display:grid;grid-template-columns:1fr auto;gap:4px 14px}
.gStats b{text-align:right}`;
/* ---------- l'habillage pixel art, dessiné à la main : police bitmap (accents compris), cadres, boutons, icônes ----------
   Tout est en pixels pleins, agrandis par 2 sans lissage : aucun dégradé, aucune ombre floue. */
const PXK = (() => {
  // chaque lettre : ses lignes, de haut en bas, à partir de la ligne 2 de la case (0-1 : accents des majuscules, 9-10 : jambages)
  const S = {
    A: '.###. #...# #...# ##### #...# #...# #...#', B: '####. #...# #...# ####. #...# #...# ####.', C: '.###. #...# #.... #.... #.... #...# .###.',
    D: '####. #...# #...# #...# #...# #...# ####.', E: '##### #.... #.... ####. #.... #.... #####', F: '##### #.... #.... ####. #.... #.... #....',
    G: '.###. #...# #.... #.### #...# #...# .####', H: '#...# #...# #...# ##### #...# #...# #...#', I: '### .#. .#. .#. .#. .#. ###',
    J: '..### ...#. ...#. ...#. #..#. #..#. .##..', K: '#...# #..#. #.#.. ##... #.#.. #..#. #...#', L: '#.... #.... #.... #.... #.... #.... #####',
    M: '#...# ##.## #.#.# #.#.# #...# #...# #...#', N: '#...# ##..# #.#.# #..## #...# #...# #...#', O: '.###. #...# #...# #...# #...# #...# .###.',
    P: '####. #...# #...# ####. #.... #.... #....', Q: '.###. #...# #...# #...# #.#.# #..#. .##.#', R: '####. #...# #...# ####. #.#.. #..#. #...#',
    S: '.#### #.... #.... .###. ....# ....# ####.', T: '##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..', U: '#...# #...# #...# #...# #...# #...# .###.',
    V: '#...# #...# #...# #...# #...# .#.#. ..#..', W: '#...# #...# #...# #.#.# #.#.# ##.## #...#', X: '#...# #...# .#.#. ..#.. .#.#. #...# #...#',
    Y: '#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..', Z: '##### ....# ...#. ..#.. .#... #.... #####',
    a: '..... ..... .###. ....# .#### #...# .####', b: '#.... #.... ####. #...# #...# #...# ####.', c: '..... ..... .###. #.... #.... #.... .###.',
    d: '....# ....# .#### #...# #...# #...# .####', e: '..... ..... .###. #...# ##### #.... .###.', f: '..## .#.. #### .#.. .#.. .#.. .#..',
    g: '..... ..... .#### #...# #...# #...# .#### ....# .###.', h: '#.... #.... ####. #...# #...# #...# #...#', i: '.#. ... ##. .#. .#. .#. ###',
    'ı': '... ... ##. .#. .#. .#. ###', j: '...# .... ..## ...# ...# ...# ...# #..# .##.', k: '#... #... #..# #.#. ##.. #.#. #..#',
    l: '##. .#. .#. .#. .#. .#. ###', m: '..... ..... ##.#. #.#.# #.#.# #.#.# #...#', n: '..... ..... ####. #...# #...# #...# #...#',
    o: '..... ..... .###. #...# #...# #...# .###.', p: '..... ..... ####. #...# #...# #...# ####. #.... #....', q: '..... ..... .#### #...# #...# #...# .#### ....# ....#',
    r: '.... .... #.## ##.. #... #... #...', s: '..... ..... .#### #.... .###. ....# ####.', t: '.#.. .#.. #### .#.. .#.. .#.. ..##',
    u: '..... ..... #...# #...# #...# #..## .##.#', v: '..... ..... #...# #...# #...# .#.#. ..#..', w: '..... ..... #...# #...# #.#.# #.#.# .#.#.',
    x: '..... ..... #...# .#.#. ..#.. .#.#. #...#', y: '..... ..... #...# #...# #...# #...# .#### ....# .###.', z: '..... ..... ##### ...#. ..#.. .#... #####',
    0: '.###. #...# #..## #.#.# ##..# #...# .###.', 1: '..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.', 2: '.###. #...# ....# ...#. ..#.. .#... #####',
    3: '####. ....# ....# .###. ....# ....# ####.', 4: '...#. ..##. .#.#. #..#. ##### ...#. ...#.', 5: '##### #.... ####. ....# ....# #...# .###.',
    6: '.###. #.... #.... ####. #...# #...# .###.', 7: '##### ....# ...#. ..#.. .#... .#... .#...', 8: '.###. #...# #...# .###. #...# #...# .###.',
    9: '.###. #...# #...# .#### ....# ....# .###.',
    '.': '. . . . . . #', ',': '.. .. .. .. .. .# .# #.', ':': '. . # . . . #', ';': '.. .. .# .. .. .# .# #.', '!': '# # # # # . #',
    '?': '.###. #...# ....# ...#. ..#.. ..... ..#..', "'": '# # . . . . .', '"': '#.# #.# ... ... ... ... ...', '-': '... ... ... ### ... ... ...',
    '+': '..... ..#.. ..#.. ##### ..#.. ..#.. .....', '/': '....# ...#. ...#. ..#.. .#... .#... #....', '(': '.# #. #. #. #. #. .#', ')': '#. .# .# .# .# .# #.',
    '%': '##..# ##.#. ...#. ..#.. .#... .#.## #..##', '·': '. . . # . . .', '×': '..... ..... #...# .#.#. ..#.. .#.#. #...#',
    '<': '...# ..#. .#.. #... .#.. ..#. ...#', '>': '#... .#.. ..#. ...# ..#. .#.. #...', '=': '.... .... #### .... #### .... ....',
    '_': '..... ..... ..... ..... ..... ..... #####', '#': '.#.#. .#.#. ##### .#.#. ##### .#.#. .#.#.', '&': '.##.. #..#. #.#.. .#... #.#.# #..#. .##.#',
    '…': '..... ..... ..... ..... ..... ..... #.#.#', '«': '..... ..#.# .#.#. #.#.. .#.#. ..#.# .....', '»': '..... #.#.. .#.#. ..#.# .#.#. #.#.. .....',
    '◀': '...# ..## .### #### .### ..## ...#', '▶': '#... ##.. ###. #### ###. ##.. #...', '→': '..... ..#.. ...#. ##### ...#. ..#.. .....',
    '←': '..... ..#.. .#... ##### .#... ..#.. .....', '↑': '..#.. .###. #.#.# ..#.. ..#.. ..#.. ..#..', '↓': '..#.. ..#.. ..#.. ..#.. #.#.# .###. ..#..',
    '*': '..... #.#.# .###. ##### .###. #.#.# .....', '[': '## #. #. #. #. #. ##', ']': '## .# .# .# .# .# ##', '|': '# # # # # # #',
    '@': '.###. #...# #.### #.#.# #.### #.... .###.', '€': '..### .#... ####. .#... ####. .#... ..###', '$': '..#.. .#### #.#.. .###. ..#.# ####. ..#..',
    '°': '.#. #.# .#. ... ... ... ...', '~': '..... ..... .#..# #.##. ..... ..... .....', '♪': '..##. ..#.# ..#.. ..#.. .##.. ###.. .#...',
  };
  const ACC = { a: ['..#', '.#.'], g: ['#..', '.#.'], c: ['.#.', '#.#'], d: ['...', '#.#'], t: ['.#.#', '#.#.'], z: ['.#.', '##.'] };  // aigu, grave, circonflexe, tréma, tilde, cédille
  const COMP = { é: 'ea', è: 'eg', ê: 'ec', ë: 'ed', á: 'aa', à: 'ag', â: 'ac', ä: 'ad', í: 'ıa', ì: 'ıg', î: 'ıc', ï: 'ıd', ó: 'oa', ò: 'og', ô: 'oc', ö: 'od',
    ú: 'ua', ù: 'ug', û: 'uc', ü: 'ud', ÿ: 'yd', ñ: 'nt', ç: 'cz', É: 'Ea', È: 'Eg', Ê: 'Ec', Ë: 'Ed', Á: 'Aa', À: 'Ag', Â: 'Ac', Ä: 'Ad', Í: 'Ia', Î: 'Ic', Ï: 'Id',
    Ó: 'Oa', Ô: 'Oc', Ö: 'Od', Ú: 'Ua', Ù: 'Ug', Û: 'Uc', Ü: 'Ud', Ñ: 'Nt', Ç: 'Cz' };
  const SUB = { 'œ': 'oe', 'Œ': 'OE', '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-', ' ': ' ', ' ': ' ', '•': '·', '✓': 'v', 'ᐸ': '<', 'ᐳ': '>', '＜': '<', '＞': '>', '｜': '|', '／': '/', '！': '!', '？': '?', '（': '(', '）': ')', '：': ':', '　': ' ' };  // ᐸ ᐳ : les < > des titres YouTube
  const H = 11, glyphs = new Map(); let raster;
  function glyph(ch) {
    let g = glyphs.get(ch); if (g) return g;
    const px = [], add = (rows, ox, oy) => rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === '#') px.push([ox + x, oy + y]); });
    const c = COMP[ch], src = S[c ? c[0] : ch]; let w = 3;
    if (src) {
      const rows = src.split(' '); w = Math.max(...rows.map(r => r.length)); add(rows, 0, 2);
      if (c) { const a = ACC[c[1]]; add(a, Math.floor((w - a[0].length) / 2), c[1] === 'z' ? 9 : /[A-Z]/.test(c[0]) ? 0 : 1); }
    } else if (ch !== ' ') {  // japonais, emoji… : la lettre du système, réduite à des pixels nets (sans lissage) sur la même hauteur que la police
      const q = (raster ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })), RW = 16;
      q.canvas.width = RW; q.canvas.height = H; q.font = '11px "MS Gothic", "Yu Gothic UI", Meiryo, "Segoe UI Symbol", sans-serif'; q.fillStyle = '#000'; q.fillText(ch, 0, 10);
      const d = q.getImageData(0, 0, RW, H).data; let mx = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < RW; x++) if (d[(y * RW + x) * 4 + 3] > 110) { px.push([x, y]); mx = Math.max(mx, x + 1); }
      w = mx || 3;
      if (!px.length) { w = 5; add(['#####', '#...#', '#...#', '#...#', '#...#', '#...#', '#####'], 0, 2); }  // vraiment inconnue : une petite case
    }
    g = { w, px }; glyphs.set(ch, g); return g;
  }
  function layout(text) {
    let x = 0; const items = [];
    for (const ch of String(text)) for (const c of SUB[ch] ?? ch) { const g = glyph(c); items.push([g, x]); x += g.w + 1; }
    return { w: Math.max(0, x - 1), items };
  }
  function draw(g, text, x, y, color, s = 1) {  // (x, y) : coin haut gauche de la case
    const L = layout(text); g.fillStyle = color;
    for (const [gl, ox] of L.items) for (const [px, py] of gl.px) g.fillRect(x + (ox + px) * s, y + py * s, s, s);
    return L.w * s;
  }
  const bmp = new Map();
  function sprite(text, color, s = 1) {  // le texte tout prêt, gardé pour les images suivantes du jeu
    const k = text + '|' + color + '|' + s; let c = bmp.get(k); if (c) return c;
    c = document.createElement('canvas'); c.width = Math.max(1, layout(text).w * s); c.height = H * s; draw(c.getContext('2d'), text, 0, 0, color, s);
    if (bmp.size > 400) bmp.delete(bmp.keys().next().value);
    bmp.set(k, c); return c;
  }
  // comme fillText : (x, y) sur la ligne de base, aligné à gauche, au centre ou à droite
  function fill(g, text, x, y, color, s = 1, align = 'left') {
    const c = sprite(String(text), color, s), dx = align === 'center' ? -c.width / 2 : align === 'right' ? -c.width : 0;
    g.drawImage(c, Math.round(x + dx), Math.round(y - 9 * s));
  }
  const scale = size => Math.max(1, Math.round((size || 8) / 8));
  function art(rows, pal, s = 1) {  // un dessin en lignes de caractères, chaque caractère une couleur de la palette (« . » : transparent)
    const c = document.createElement('canvas'); c.width = Math.max(...rows.map(r => r.length)) * s; c.height = rows.length * s;
    const g = c.getContext('2d');
    rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const col = pal[r[x]]; if (col) { g.fillStyle = col; g.fillRect(x * s, y * s, s, s); } } });
    return c;
  }
  return { H, layout, draw, sprite, fill, scale, art };
})();

// les pièces de l'interface, pixel par pixel (K : contour, les autres lettres : la palette du jeu)
const PX_PANEL = ['..KKKKKKKKKKKK..', '.KAAAAAAAAAAAAK.', 'KALAAAAAAAAAALSK', 'KAAKKKKKKKKKKSSK', 'KAAKHHHHHHHHKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK',
  'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKKKKKKKKKKSSK', 'KALSSSSSSSSSSLSK', '.KSSSSSSSSSSSSK.', '..KKKKKKKKKKKK..'];
const PX_CARD = ['.KKKKKKKKKK.', 'KFFFFFFFFFFK', 'KFHHHHHHHHFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFSSSSSSSSFK', 'KFFFFFFFFFFK', '.KKKKKKKKKK.'];
const PX_BTN = ['.KKKKKKKKKK.', 'KWWWWWWWWWWK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KBBBBBBBBBBK', 'KKKKKKKKKKKK', 'KDDDDDDDDDDK', '.KKKKKKKKKK.'];
const PX_BTN_DOWN = ['............', '............', '.KKKKKKKKKK.', 'KBBBBBBBBBBK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KWWWWWWWWWWK', '.KKKKKKKKKK.'];
const PX_TRACK = ['.KKKKKKKKKK.', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KHHHHHHHHHHK', '.KKKKKKKKKK.'];
const PX_KNOB = ['.KKKKK.', 'KWWWWWK', 'KWAAABK', 'KWAAABK', 'KKKKKKK', 'KWAAABK', 'KWAAABK', 'KBBBBBK', 'KDDDDDK', '.KKKKK.'];
const PX_RAIL = ['KDDDDDDK', 'KDDDDDDK', 'KDDDDDDK', 'KDDHHDDK'];
const PX_ICONS = {
  play: ['kk......', 'kakk....', 'kaaakk..', 'kaaaaakk', 'kaaaaaak', 'kaaaaakk', 'kaaakk..', 'kakk....', 'kk......'],
  full: ['www...www', 'w.......w', 'w.......w', '.........', '....a....', '.........', 'w.......w', 'w.......w', 'www...www'],
  note: ['...aaaaaa', '...aaaaaa', '...a....a', '...a....a', '...a....a', '.aaa..aaa', 'aaaa.aaaa', 'aaaa.aaaa', '.aa...aa.'],
  star: ['....g....', '....g....', '...ggg...', 'ggggwgggg', '.ggwwwgg.', '..ggggg..', '..oo.oo..', '.oo...oo.', '.o.....o.'],
  crown: ['g...g...g', 'gg.ggg.gg', 'ggggggggg', 'grgggggrg', 'ggggggggg', 'ooooooooo'],
  folder: ['oooo.....', 'oggoooooo', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ooooooooo'],
  vol: ['....w....', '...ww..b.', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', '...ww..b.', '....w....'],
  clock: ['..wwwww..', '.w.....w.', 'w...a...w', 'w...a...w', 'w...aaa.w', 'w.......w', 'w.......w', '.w.....w.', '..wwwww..'],
  cursor: ['....a....', '..aaaaa..', '.a..a..a.', '.a.....a.', 'aaa.w.aaa', '.a.....a.', '.a..a..a.', '..aaaaa..', '....a....'],
  plus: ['...b...', '...b...', '...b...', 'bbbbbbb', '...b...', '...b...', '...b...'],
  down: ['wwwwwww', '.wwwww.', '..www..', '...w...'],
};

/* habille la page du jeu : root = son conteneur, T = sa palette, icons = [motif du texte, icône] pour les boutons et libellés */
function pxSkin(root, { T, icons = [], emblem, title }) {
  root.classList.add('pxk'); const s = 2, url = c => c.toDataURL();
  const btnPal = (M, W, B, D) => ({ K: T.k, W, M, B, D });
  const BN = btnPal(T.btn, T.btnHi, T.btnLo, T.k2), BH = btnPal(T.btnHov, T.btnHovHi, T.btnLo, T.k2);
  const BA = btnPal(T.acc, T.accL, T.accS, T.accD), BAH = btnPal(T.accL, '#ffffff', T.acc, T.accD);
  const img = { panel: PXK.art(PX_PANEL, { K: T.k, A: T.acc, S: T.accS, L: T.rivet, H: T.hl, D: T.fill }, s),
    card: PXK.art(PX_CARD, { K: T.k, F: T.line, H: T.hl, D: T.fill, S: T.k2 }, s), cardOn: PXK.art(PX_CARD, { K: T.k, F: T.acc, H: T.accS, D: T.fillOn, S: T.accD }, s),
    btn: PXK.art(PX_BTN, BN, s), btnH: PXK.art(PX_BTN, BH, s), btnD: PXK.art(PX_BTN_DOWN, BH, s),
    main: PXK.art(PX_BTN, BA, s), mainH: PXK.art(PX_BTN, BAH, s), mainD: PXK.art(PX_BTN_DOWN, BA, s),
    track: PXK.art(PX_TRACK, { K: T.k, D: T.k2, H: T.line }, s), knob: PXK.art(PX_KNOB, { K: T.k, W: T.accL, A: T.acc, B: T.accS, D: T.accD }, s),
    rail: PXK.art(PX_RAIL, { K: T.k, D: T.k2, H: T.line }, s), tile: PXK.art(T.tile, { x: T.bgDot, ':': T.bgDot2, '+': T.spark, '*': T.spark2 }, s) };
  const u = Object.fromEntries(Object.entries(img).map(([k, c]) => [k, url(c)]));
  const nine = (k, sl) => `border-style:solid;border-width:${sl * s}px;border-image:url(${u[k]}) ${sl * s} fill / ${sl * s}px stretch`;
  const IP = { k: T.k, w: T.text, a: T.acc, b: T.acc2, g: T.gold, o: T.orange, r: T.red, n: T.green, N: T.green2, m: T.muted, s: T.accS };
  const iconUrl = new Map(), icon = name => {
    let v = iconUrl.get(name); if (!v) { const c = PXK.art(PX_ICONS[name] || emblem, IP, s); v = { u: url(c), w: c.width, h: c.height }; iconUrl.set(name, v); }
    const b = document.createElement('b'); b.className = 'pxI'; b.setAttribute('aria-hidden', 'true'); b.style.cssText = `width:${v.w}px;height:${v.h}px;background-image:url(${v.u})`; return b;
  };
  const R = '.pxk.pxk';
  const css = document.createElement('style');
  css.textContent = `html,html body{background:${T.bg} url(${u.tile}) 0 0/${img.tile.width}px ${img.tile.height}px repeat!important}
::-webkit-scrollbar{width:16px;height:16px} ::-webkit-scrollbar-track{background:url(${u.rail}) 0 0/16px 8px repeat-y} ::-webkit-scrollbar-thumb{${nine('main', 4)}} ::-webkit-scrollbar-corner{background:none}
${R}{color:${T.text}}
${R} .px{box-shadow:none;background:none}
${R} .agHead{gap:18px;margin:0}
${R} .agHead .label{display:flex;align-items:center;gap:12px}
${R} .btn,${R} .tab{${nine('btn', 4)};height:auto;min-height:0;padding:0 6px 4px;margin:0;color:${T.text};font:12px/1 monospace;display:inline-flex;align-items:center;gap:6px;filter:none;text-shadow:none;letter-spacing:0;cursor:var(--cp,pointer)}
${R} .btn:hover,${R} .tab:hover{border-image-source:url(${u.btnH})}
${R} .btn:active,${R} .tab:active{border-image-source:url(${u.btnD});padding:4px 6px 0}
${R} .btn.main,${R} .tab.on{border-image-source:url(${u.main});color:${T.k}}
${R} .btn.main:hover,${R} .tab.on:hover{border-image-source:url(${u.mainH})}
${R} .btn.main:active,${R} .tab.on:active{border-image-source:url(${u.mainD})}
${R} .btn:focus-visible,${R} .tab:focus-visible{outline:2px dashed ${T.acc2};outline-offset:2px}
${R} .btn .pxV,${R} .tab .pxV{white-space:nowrap}
${R} .sysCard{${nine('card', 4)};padding:4px 6px;gap:8px;background:none}
${R} .sysCard.on{border-image-source:url(${u.cardOn})}
${R} .sysCard.on>b{color:${T.acc}}
${R} .sysCard>b{color:${T.text}}
${R} .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
${R} .gameBox,${R} .thBox{${nine('panel', 5)};box-shadow:none;background:none;padding:2px;gap:8px;grid-template-rows:auto auto}
${R} .gameBox canvas,${R} .thBox canvas{display:block;background:#05010b}
${R} .gameBox:fullscreen,${R} .thBox:fullscreen{border:0;padding:0;background:#000}
${R} .rhFs{position:static;opacity:1;justify-self:end;margin:0 6px 6px 0}
${R} .rhTabs{gap:8px;flex-wrap:wrap}
${R} .hint{color:${T.muted};line-height:24px}
${R} label{color:${T.muted};display:inline-flex;align-items:center;gap:8px}
${R} .rhDel{color:${T.red};top:6px;right:8px}
${R} input[type=range]{-webkit-appearance:none;appearance:none;background:none;height:20px;width:150px}
${R} input[type=range]::-webkit-slider-runnable-track{height:12px;${nine('track', 2)}}
${R} input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:20px;border:0;background:url(${u.knob}) 0 0/100% 100%;margin-top:-8px;cursor:var(--cp,pointer)}
${R} .pxSel{justify-content:space-between;gap:10px;max-width:100%;overflow:hidden}
${R} .rhImport .pxSel{flex:1;min-width:0}
.pxMenu{position:fixed;z-index:50;${nine('card', 4)};padding:2px;max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;color:${T.text}}
.pxMenu button{all:unset;padding:3px 8px;cursor:var(--cp,pointer);white-space:nowrap}
.pxMenu button:hover,.pxMenu button:focus-visible,.pxMenu button.on{background:${T.btnHov};color:${T.text}}
.pxMenu button.on{color:${T.acc}}
.pxT{position:relative;white-space:normal;font:12px/1 monospace;letter-spacing:0;text-transform:none}
.pxT i{display:inline-block;vertical-align:middle;background:currentColor;-webkit-mask:var(--m) 0 0/100% 100% no-repeat;mask:var(--m) 0 0/100% 100% no-repeat;image-rendering:pixelated}
.pxI{display:inline-block;vertical-align:middle;background:0 0/100% 100% no-repeat;image-rendering:pixelated;margin-right:6px}
.pxV>.pxI+.pxI{margin-left:-4px}
.pxSr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`;
  document.head.append(css);
  // un mot = une image (en masque : sa couleur suit celle du texte), une règle par mot pour ne pas répéter l'image
  const words = new Map(), sheet = document.head.appendChild(document.createElement('style')).sheet;
  const word = w => {
    let k = words.get(w);
    if (!k) { const c = PXK.sprite(w, '#fff', s); k = 'pw' + words.size; words.set(w, k); sheet.insertRule(`.${k}{--m:url(${c.toDataURL()});width:${c.width}px;height:${c.height}px}`, sheet.cssRules.length); }
    const i = document.createElement('i'); i.className = k; return i;
  };
  function render(vis, text, lead) {
    const parts = [], ic = lead && icons.find(([re]) => re.test(text.trim()));
    if (ic) parts.push(icon(ic[1]));
    for (const m of text.matchAll(/(★+)|(\s+)|([^\s★]+)/g)) {
      if (m[1]) for (const _ of m[1]) parts.push(icon('star'));
      else if (m[2]) parts.push(document.createTextNode(' '));
      else parts.push(word(m[3]));
    }
    vis.replaceChildren(...parts);
  }
  const lead = node => node.parentElement?.matches('button,label,.tab,.btn') && !node.previousSibling;
  function pixText(node) {  // le texte reste dans la page (lecteur d'écran, copier) ; on voit ses lettres en pixels
    const wrap = document.createElement('span'), sr = document.createElement('span'), vis = document.createElement('span');
    wrap.className = 'pxT'; sr.className = 'pxSr'; vis.className = 'pxV'; vis.setAttribute('aria-hidden', 'true');
    const first = lead(node); node.replaceWith(wrap); sr.append(node); wrap.append(sr, vis); render(vis, node.data, first);
  }
  function pxSelect(sel) {  // une liste déroulante en pixels ; la vraie reste cachée et garde sa valeur et ses événements
    sel.dataset.px = '1'; sel.style.display = 'none';
    const b = document.createElement('button'), lab = document.createElement('span'); b.type = 'button'; b.className = 'btn pxSel'; b.append(lab, icon('down')); sel.after(b);
    const sync = () => { const t = sel.selectedOptions[0]?.textContent || '—'; if (lab.dataset.t !== t) { lab.dataset.t = t; lab.textContent = t; } };
    const d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    Object.defineProperty(sel, 'value', { configurable: true, get() { return d.get.call(this); }, set(v) { d.set.call(this, v); sync(); } });
    new MutationObserver(sync).observe(sel, { childList: true, subtree: true, characterData: true, attributes: true });
    sel.addEventListener('change', sync);
    b.onclick = () => {
      document.querySelector('.pxMenu')?.remove();
      const m = document.createElement('div'), r = b.getBoundingClientRect(); m.className = 'pxMenu'; m.setAttribute('role', 'listbox');
      for (const o of sel.options) {
        const it = document.createElement('button'); it.type = 'button'; it.textContent = o.textContent; it.className = o.selected ? 'on' : ''; it.setAttribute('role', 'option');
        it.onclick = () => { sel.value = o.value; sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); close(); b.focus(); };
        m.append(it);
      }
      root.append(m);
      const below = innerHeight - r.bottom; m.style.minWidth = r.width + 'px'; m.style.left = Math.min(r.left, innerWidth - m.offsetWidth - 4) + 'px';
      m.style.top = (below > m.offsetHeight + 8 || below > r.top ? r.bottom + 2 : r.top - m.offsetHeight - 2) + 'px';
      const close = () => { m.remove(); removeEventListener('pointerdown', out, true); removeEventListener('keydown', key, true); removeEventListener('blur', close); };
      const out = e => { if (!m.contains(e.target) && e.target !== b && !b.contains(e.target)) close(); };
      const key = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); b.focus(); } };
      addEventListener('pointerdown', out, true); addEventListener('keydown', key, true); addEventListener('blur', close);
      (m.querySelector('.on') || m.firstChild)?.focus();
    };
    sync();
  }
  const SKIP = 'select,option,textarea,script,style,canvas,.pxT,[data-pxskip]';
  let queued = false;
  function pass() {
    queued = false;
    root.querySelectorAll('select.gSel:not([data-px])').forEach(pxSelect);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), todo = [];
    for (let n; (n = w.nextNode());) if (n.data.trim() && n.parentElement && !n.parentElement.closest(SKIP)) todo.push(n);
    todo.forEach(pixText);
  }
  new MutationObserver(ms => {
    for (const m of ms) if (m.type === 'characterData') { const wrap = m.target.parentNode?.closest?.('.pxT'); if (wrap) render(wrap.lastChild, m.target.data, false); }
    if (!queued) { queued = true; queueMicrotask(pass); }
  }).observe(root, { childList: true, subtree: true, characterData: true });
  // le titre : grosses lettres à contour, trois tons, et l'emblème du jeu
  const lab = root.querySelector('.agHead .label');
  if (lab) {
    const L = PXK.layout(title), c = document.createElement('canvas'), g = c.getContext('2d'), on = [];
    c.width = L.w + 3; c.height = PXK.H + 3;
    for (const [gl, ox] of L.items) for (const [x, y] of gl.px) on.push([ox + x + 1, y + 1]);
    g.fillStyle = T.k; for (const [x, y] of on) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [2, 2], [1, 2], [2, 1]]) g.fillRect(x + dx, y + dy, 1, 1);
    for (const [x, y] of on) { g.fillStyle = y <= 5 ? T.accL : y <= 7 ? T.acc : T.accS; g.fillRect(x, y, 1, 1); }
    const big = document.createElement('canvas'), z = 4; big.width = c.width * z; big.height = c.height * z;
    const bg = big.getContext('2d'); bg.imageSmoothingEnabled = false; bg.drawImage(c, 0, 0, big.width, big.height);
    const t = document.createElement('b'); t.className = 'pxI'; t.style.cssText = `width:${big.width}px;height:${big.height}px;background-image:url(${big.toDataURL()})`;
    const e = PXK.art(emblem, IP, 3), em = document.createElement('b'); em.className = 'pxI'; em.style.cssText = `width:${e.width}px;height:${e.height}px;background-image:url(${e.toDataURL()})`;
    const sr = document.createElement('span'); sr.className = 'pxSr'; sr.textContent = lab.textContent;
    lab.dataset.pxskip = '1'; lab.replaceChildren(em, t, sr);
  }
  pass();
}


export default async function (ctx) {
  const view = ctx.view;
  if (!ctx.host) { view.textContent = "Ce plugin doit être approuvé par NeoDex pour s'ouvrir."; return; }
  const host = ctx.host, { el, toast, sfx } = host;
  const folder = ctx.folder;
  host.addStyle(CSS);
  view.innerHTML = HTML;
  pxSkin(view.querySelector('.appWrap'), { title: 'BEFFROI', T: { k: '#0e080c', k2: '#1a1018', fill: '#24161c', fillOn: '#34202a', hl: '#3e2a30', line: '#6a5058', acc: '#ffc85a', accL: '#fff0c0', accS: '#c8882a', accD: '#4a3010',
  rivet: '#fff0e0', btn: '#3e2a30', btnHi: '#6a5058', btnLo: '#1a1018', btnHov: '#4e3640', btnHovHi: '#8a6a72', text: '#f8f0f0', muted: '#c8b0b8', acc2: '#7ac8ff', gold: '#ffd84a',
  orange: '#ff8a3a', red: '#ff4a3a', green: '#7ee07a', green2: '#2f8a3a', bg: '#120a0e', bgDot: '#24161c', bgDot2: '#1a1018', spark: '#5a3010', spark2: '#ffc85a',
  tile: ['................', '...:............', '................', '..........+.....', '................', '................', '.....:..........', '................',
    '................', '.............:..', '................', '..+.............', '................', '.........:......', '................', '................'] },
  emblem: ['.....kk.....', '....kggk....', '...kggggk...', '..kggggggk..', '..kggwgggk..', '..kggggggk..', '.kggggggggk.', 'kkkkkkkkkkkk', '.....kk.....', '....kook....', '.....kk.....'],
  icons: [[/^NOUVELLE/, 'play'], [/^RECORDS/, 'crown']] });
  const $ = id => view.querySelector('#' + id) || document.getElementById(id);
  const doc = async n => { try { return await folder.read(n); } catch { return null; } };
  const games = { best: {}, ...(await doc('games')) };
  let gamesTimer = null;
  const saveGames = () => { clearTimeout(gamesTimer); gamesTimer = setTimeout(() => { gamesTimer = null; folder.write('games', games).catch(() => {}); }, 500); };
  const best = (k, v) => { const b = games.best[k]; if (v > (b ?? 0)) {  // un score nul n'est jamais un record
    games.best[k] = v; saveGames(); return true; } return false; };
  const gstore = (k, init) => (games[k] ??= init);
function gameLoop(st, appKey, update, draw) {
  cancelAnimationFrame(st.raf);
  const STEP = 1000 / 60; let acc = 0, last = performance.now();
  const frame = t => {
    if (!view.classList.contains('on')) { st.raf = 0; if (st.mode === 'play') st.mode = 'pause'; return; }  // leaving the tab pauses the game
    st.raf = requestAnimationFrame(frame);
    acc += Math.min(200, t - last); last = t;
    while (acc >= STEP) { if (st.mode === 'play') update(); st.tick++; acc -= STEP; }
    draw();
  };
  st.raf = requestAnimationFrame(frame);
}
function gameText(g, w, lines, y0) {  // lignes centrées en police pixel, sur une bande sombre
  g.fillStyle = 'rgba(11,3,28,.72)'; g.fillRect(0, y0 - 14, w, lines.length * 14 + 14);
  lines.forEach(([text, color, size], i) => PXK.fill(g, text, w / 2, y0 + i * 14, color, PXK.scale(size), 'center'));
}
const px = (g, color, x, y, w = 1, h = 1) => { g.fillStyle = color; g.fillRect(Math.round(x), Math.round(y), w, h); };
function sprite(g, rows, x, y, pal) { rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c) px(g, c, x + i, y + j); } }); }
const seeded = s => () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const pxFont = (g, text, x, y, color, size = 8, align = 'left') => { const s = PXK.scale(size); PXK.fill(g, text, x + s, y + s, '#05010b', s, align); PXK.fill(g, text, x, y, color, s, align); };

/* ---------- Beffroi : on monte les étages d'un clocher en courant et en sautant ; plus on court vite, plus on saute haut.
   Les murs renvoient l'élan. Après le 5e étage, le clocher se met à défiler : il ne faut pas rester en bas. 32 px = 1 étage ---------- */
const BF = {W: 144, H: 192, WALL: 12, FL: 32, PW: 8, PH: 12, G: .22, AX: .2, VMAX: 3.2, J0: 4.3, JV: .8};
BF.L = BF.WALL; BF.R = BF.W - BF.WALL;
const bfs = gstore('beffroi', {games: 0, floors: 0, combos: 0});
let bf = null, bfac = null;
// le sonneur : un petit bonhomme en capuchon, de profil vers la droite (miroir pour la gauche)
const BF_PAL = {k: '#1a1018', h: '#7a3a2a', H: '#a85a3a', s: '#ffd0a8', e: '#1a1018', c: '#3a6ac8', C: '#24448a', b: '#5a3a2a', w: '#f0e8d8'};
const BF_ART = {
  idle: ['..kkkk..', '.khhhHk.', 'khhhhhHk', 'khhssssk', 'khsseske', '.ksssskk', '..kcck..', '.kccCck.', '.kcCCck.', '..kCCk..', '..kbkbk.', '..kk.kk.'],
  run1: ['..kkkk..', '.khhhHk.', 'khhhhhHk', 'khhssssk', 'khsseske', '.ksssskk', '..kcck..', '.kccCck.', 'kkcCCckk', '..kCCk..', '.kbk.kbk', '.kk...kk'],
  run2: ['........', '..kkkk..', '.khhhHk.', 'khhhhhHk', 'khhssssk', 'khsseske', '.ksssskk', '..kccck.', '.kcCCck.', '..kCCk..', '..kbbk..', '..kkkk..'],
  jump: ['..kkkk..', '.khhhHk.', 'khhhhhHk', 'khhssssk', 'khsseske', 'kksssskk', 'kcckcckk', '..kCCk..', '..kCCk..', '.kbk.kb.', '.kk..kk.', '........'],
};
const bfArt = (rows, flip) => { const c = el('canvas'); c.width = BF.PW; c.height = BF.PH; sprite(c.getContext('2d'), flip ? rows.map(r => [...r].reverse().join('')) : rows, 0, 0, BF_PAL); return c; };
const BF_SPR = Object.fromEntries(Object.entries(BF_ART).map(([k, rows]) => [k, [bfArt(rows, false), bfArt(rows, true)]]));
// trois matières d'étage, qui changent tous les 25 étages : bois, pierre, cuivre
const BF_MAT = [['#8a5a32', '#c8884a', '#4a2a18'], ['#6a6470', '#a8a0b0', '#34303a'], ['#a8682a', '#ffc85a', '#5a3010']];
// les murs du clocher : briques, et le fond : briques sombres percées de fenêtres en ogive (ciel étoilé)
const BF_BRICK = (() => { const c = el('canvas'); c.width = BF.WALL; c.height = 32; const g = c.getContext('2d');
  px(g, '#5a3a3a', 0, 0, BF.WALL, 32);
  for (let r = 0; r < 4; r++) { const y = r * 8, o = r % 2 ? 6 : 0; px(g, '#2a1a1e', 0, y + 7, BF.WALL, 1); for (let x = o; x < BF.WALL + 6; x += 12) { px(g, '#2a1a1e', x - 1, y, 1, 7); px(g, '#7a5048', x, y, 5, 1); } }
  return c; })();
const BF_BACK = (() => { const w = BF.W - 2 * BF.WALL, c = el('canvas'); c.width = w; c.height = 160; const g = c.getContext('2d');
  px(g, '#24161c', 0, 0, w, 160);
  for (let r = 0; r < 20; r++) { const y = r * 8, o = r % 2 ? 8 : 0; px(g, '#1a0e14', 0, y + 7, w, 1); for (let x = o; x < w; x += 16) px(g, '#1a0e14', x, y, 1, 7); }
  // une fenêtre en ogive, avec le ciel et deux étoiles
  const wx = 46, wy = 40;
  for (let y = 0; y < 44; y++) { const half = y < 12 ? Math.round(Math.sqrt(Math.max(0, 144 - (12 - y) ** 2)) * .85) : 10; px(g, '#4a2e30', wx + 14 - half - 2, wy + y, half * 2 + 4, 1); px(g, '#141838', wx + 14 - half, wy + y, half * 2, 1); }
  px(g, '#4a2e30', wx + 13, wy + 4, 2, 40); px(g, '#4a2e30', wx + 4, wy + 22, 20, 2);
  for (const [x, y] of [[wx + 7, wy + 10], [wx + 19, wy + 30], [wx + 9, wy + 34]]) px(g, '#f0e8d8', x, y);
  px(g, '#3a242a', wx + 2, wy + 44, 24, 3);
  return c; })();
const bfFloorY = n => -n * BF.FL;
// une nouvelle partie garde le même objet : la boucle du jeu (gameLoop) continue de tourner dessus
const renew = (old, o) => { if (!old) return o; for (const k of Object.keys(old)) if (k !== 'raf') delete old[k]; return Object.assign(old, o); };
function bfNew() {
  const g = bf?.g;
  bf = renew(bf, {g, mode: 'ready', tick: 0, seen: 0, x: BF.W / 2 - BF.PW / 2, y: 0, vx: 0, vy: 0, ground: 0, face: 0, keys: new Set(), floors: [], cam: -BF.H + 40, scroll: 0, top: 0,
    score: 0, combo: 0, comboN: 0, comboT: 0, last: 0, best: 0, pop: null, dead: 0, record: false, rnd: seeded(Date.now() % 1e9), jumpHeld: false, dust: []});
  bfGen(60); bfInfo();
}
// les étages : le 0 et les 5 premiers prennent toute la largeur ; ensuite des poutres de plus en plus courtes
function bfGen(upTo) {
  for (let n = bf.floors.length; n <= upTo; n++) {
    if (n < 5 || n % 50 === 0) { bf.floors.push({n, x: BF.L, w: BF.R - BF.L}); continue; }
    const w = Math.max(28, Math.round(80 - Math.min(n, 300) / 6 - bf.rnd() * 22)), x = BF.L + Math.round(bf.rnd() * (BF.R - BF.L - w));
    bf.floors.push({n, x, w});
  }
}
function bfBeep(f, d, type = 'square', slide = 0, vol = .04) { try { bfac ??= new AudioContext(); const o = bfac.createOscillator(), g = bfac.createGain(), t = bfac.currentTime; o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g).connect(bfac.destination); o.start(t); o.stop(t + d); } catch {} }
// une suite de sauts d'au moins 2 étages : un combo ; il se termine sur un petit saut ou après 3 s ; il rapporte (étages du combo)² si au moins 2 sauts
function bfComboEnd() {
  if (bf.comboN >= 2) { const pts = bf.combo * bf.combo; bf.score += pts; bfs.combos++; bf.pop = {text: 'COMBO ' + bf.combo + ' ! +' + pts, t: 90}; bfBeep(660, .1); setTimeout(() => bfBeep(990, .2), 90); }
  bf.combo = bf.comboN = 0; bf.comboT = 0;
}
function bfLand(f) {
  const gained = f.n - bf.last;
  if (gained >= 2) { bf.combo += gained; bf.comboN++; bf.comboT = 180; } else if (gained !== 0 || bf.comboT <= 0) bfComboEnd();
  bf.last = f.n; bf.ground = f;
  if (f.n > bf.best) { bf.score += (f.n - bf.best) * 10; bf.best = f.n; }
  for (let i = 0; i < 4; i++) bf.dust.push({x: bf.x + 2 + i * 2, y: bf.y, t: 10});
  bfBeep(gained >= 2 ? 520 : 300, .05, 'triangle');
}
function bfDie() {
  if (bf.mode !== 'play') return;
  bfComboEnd(); bf.mode = 'over'; bf.dead = 0; bf.keys.clear();
  bfs.games++; bfs.floors += bf.best; bf.record = best('beffroi', bf.score); saveGames(); bfInfo();
  bfBeep(400, .7, 'triangle', 60, .07);
}
function bfJump() {
  if (bf.mode !== 'play' || !bf.ground) return;
  bf.vy = -(BF.J0 + Math.abs(bf.vx) * BF.JV); bf.ground = null;
  bfBeep(220 + Math.abs(bf.vx) * 80, .12, 'square', 520 + Math.abs(bf.vx) * 120, .03);
}
function bfUpdate() {
  if (bf.mode === 'over') { bf.dead++; return; }
  if (bf.mode !== 'play') return;
  const k = bf.keys, on = (...n) => n.some(x => k.has(x)), dir = (on('ArrowRight', 'd') ? 1 : 0) - (on('ArrowLeft', 'q', 'a') ? 1 : 0);
  // la course : on accélère vers la touche, on freine au sol sans touche
  if (dir) { bf.vx = Math.max(-BF.VMAX, Math.min(BF.VMAX, bf.vx + dir * BF.AX)); bf.face = dir < 0 ? 1 : 0; }
  else if (bf.ground) bf.vx *= .82;
  if (Math.abs(bf.vx) < .05) bf.vx = 0;
  bf.x += bf.vx;
  if (bf.x < BF.L) { bf.x = BF.L; bf.vx = Math.abs(bf.vx) * .9; bf.face = 0; if (!bf.ground) bfBeep(160, .04, 'square', 0, .02); }  // le mur renvoie l'élan
  if (bf.x > BF.R - BF.PW) { bf.x = BF.R - BF.PW; bf.vx = -Math.abs(bf.vx) * .9; bf.face = 1; if (!bf.ground) bfBeep(160, .04, 'square', 0, .02); }
  if (on(' ', 'ArrowUp', 'z', 'w') && bf.ground) bfJump();
  // au sol : on tombe si on sort de la poutre ; en l'air : la gravité, et on se pose seulement en descendant (on traverse par en dessous)
  if (bf.ground && (bf.x + BF.PW - 2 < bf.ground.x || bf.x + 2 > bf.ground.x + bf.ground.w)) bf.ground = null;
  if (!bf.ground) {
    const prev = bf.y; bf.vy = Math.min(7, bf.vy + BF.G); bf.y += bf.vy;
    if (bf.vy > 0) for (const f of bf.floors) { const fy = bfFloorY(f.n); if (prev <= fy && bf.y >= fy && bf.x + BF.PW - 2 >= f.x && bf.x + 2 <= f.x + f.w) { bf.y = fy; bf.vy = 0; bfLand(f); break; } }
  }
  if (bf.comboT > 0 && --bf.comboT === 0) bfComboEnd();
  // la caméra suit vers le haut ; dès le 5e étage, le clocher défile tout seul, un peu plus vite toutes les 30 s
  if (bf.best >= 5) { bf.scroll++; bf.cam -= Math.min(1.7, .35 + Math.floor(bf.scroll / 1800) * .15); }
  bf.cam = Math.min(bf.cam, bf.y - BF.H * .45);
  bfGen(bf.best + 40);
  if (bf.pop && --bf.pop.t <= 0) bf.pop = null;
  for (const d of bf.dust) { d.t--; d.y -= .2; } bf.dust = bf.dust.filter(d => d.t > 0);
  if (bf.y - bf.cam > BF.H + 16) bfDie();
}
function bfDraw() {
  const g = bf.g, {W, H, WALL} = BF, cam = Math.round(bf.cam), sy = y => Math.round(y - cam);
  for (; bf.seen < bf.tick; bf.seen++) if (bf.mode === 'over') bfUpdate();
  g.imageSmoothingEnabled = false;
  const bo = ((Math.floor(-cam * .5) % 160) + 160) % 160;
  for (let y = bo - 160; y < H; y += 160) g.drawImage(BF_BACK, WALL, y);
  const wo = ((-cam % 32) + 32) % 32;
  for (let y = wo - 32; y < H; y += 32) { g.drawImage(BF_BRICK, 0, y); g.drawImage(BF_BRICK, W - WALL, y); }
  px(g, '#8a6058', WALL - 1, 0, 1, H); px(g, '#8a6058', W - WALL, 0, 1, H); px(g, '#120a0e', WALL, 0, 1, H); px(g, '#120a0e', W - WALL - 1, 0, 1, H);
  // les étages : une poutre (dessus clair, dessous sombre, chevilles), un panneau tous les 10
  for (const f of bf.floors) { const y = sy(bfFloorY(f.n)); if (y < -10 || y > H + 6) continue;
    const [m, hi, lo] = BF_MAT[Math.floor(f.n / 25) % 3];
    px(g, '#1a1018', f.x - 1, y - 1, f.w + 2, 7); px(g, m, f.x, y, f.w, 5); px(g, hi, f.x, y, f.w, 1); px(g, lo, f.x, y + 4, f.w, 1);
    for (let x = f.x + 3; x < f.x + f.w - 2; x += 10) px(g, lo, x, y + 2, 1, 1);
    if (f.n % 10 === 0 && f.n) { const t = String(f.n), sw = t.length * 7 + 6, sx = Math.round(f.x + f.w / 2 - sw / 2); px(g, '#1a1018', sx - 1, y + 5, sw + 2, 13); px(g, '#f0e8d8', sx, y + 6, sw, 11); PXK.fill(g, t, sx + sw / 2, y + 15, '#5a3a2a', PXK.scale(8), 'center'); } }
  // le sonneur
  const pose = !bf.ground ? 'jump' : Math.abs(bf.vx) > .3 ? ((bf.tick >> 3) % 2 ? 'run1' : 'run2') : 'idle';
  if (!(bf.mode === 'over' && bf.dead > 30)) g.drawImage(BF_SPR[pose][bf.face], Math.round(bf.x), sy(bf.y) - BF.PH);
  if (Math.abs(bf.vx) > 2.6 && bf.ground) for (let i = 1; i < 3; i++) px(g, '#c8b0b8', Math.round(bf.x) + (bf.vx > 0 ? -i * 3 : BF.PW + i * 3 - 1), sy(bf.y) - 3 - i, 2, 1);
  for (const d of bf.dust) px(g, d.t > 5 ? '#e8d8c8' : '#8a7080', d.x, sy(d.y) - 1);
  // le bandeau : étage, score, jauge d'élan, combo
  px(g, '#120a0e', 0, 0, W, 14);
  pxFont(g, 'Étage ' + bf.best, 4, 10, '#ffffff', 8); pxFont(g, String(bf.score), W - 4, 10, '#ffd84a', 8, 'right');
  const sp = Math.round(Math.abs(bf.vx) / BF.VMAX * 6); for (let i = 0; i < 6; i++) px(g, i < sp ? (i < 3 ? '#7ee07a' : i < 5 ? '#ffd84a' : '#ff8a3a') : '#3a2a32', 62 + i * 4, 5, 3, 4);
  if (bf.combo && bf.comboT) { pxFont(g, 'COMBO ' + bf.combo, W / 2, 28, '#ffd84a', 8, 'center'); px(g, '#3a2a32', W / 2 - 20, 31, 40, 2); px(g, '#ffd84a', W / 2 - 20, 31, Math.round(40 * bf.comboT / 180), 2); }
  if (bf.pop) pxFont(g, bf.pop.text, W / 2, 44 - Math.round((90 - bf.pop.t) / 6), '#ff8a3a', 8, 'center');
  if (bf.mode === 'play' && bf.best >= 5 && bf.y - cam > H - 40 && (bf.tick >> 3) % 2) pxFont(g, 'MONTE !', W / 2, H - 10, '#ff4a3a', 8, 'center');
  if (bf.mode === 'ready') gameText(g, W, [['BEFFROI', '#ffc85a', 16], ['← → : courir', '#ffffff'], ['Espace : sauter', '#ffffff'], ['Plus tu cours vite,', '#b8b0c8'], ['plus tu sautes haut', '#b8b0c8'], ['Record ' + (games.best.beffroi || 0), '#ffd84a']], 60);
  if (bf.mode === 'pause') gameText(g, W, [['PAUSE', '#ffffff', 12], ['Espace : reprendre', '#b8b0c8']], 90);
  if (bf.mode === 'over' && bf.dead > 40) gameText(g, W, [['TOMBÉ !', '#ff8a3a', 12], ['Étage ' + bf.best + ' · ' + bf.score + ' points', '#ffffff'], [bf.record ? 'NOUVEAU RECORD !' : 'Record ' + (games.best.beffroi || 0), '#ffd84a'], [bf.dead > 60 ? 'Espace : recommencer' : '', '#b8b0c8']], 80);
  if (bf.tick % 30 === 0) g.canvas.setAttribute('aria-label', 'Beffroi : ' + (bf.mode === 'play' ? 'étage ' + bf.best + ', ' + bf.score + ' points' : bf.mode === 'over' ? 'partie finie à l\'étage ' + bf.best : bf.mode === 'pause' ? 'pause' : 'prêt'));
}
function bfInfo() {
  $('bfStats').replaceChildren(...[['Meilleur score', games.best.beffroi || 0], ['Parties', bfs.games], ['Étages montés', bfs.floors], ['Combos', bfs.combos]].flatMap(([a, b]) => [el('span', '', a), el('b', '', String(b))]));
}
function bfStart() {
  if (bf.mode === 'ready' || bf.mode === 'pause') { bf.mode = 'play'; return true; }
  if (bf.mode === 'over' && bf.dead > 60) { bfNew(); bf.mode = 'play'; return true; }
  return false;
}
const BF_KEYS = ['ArrowUp', 'ArrowLeft', 'ArrowRight', 'z', 'q', 'd', 'w', 'a', ' '];
document.addEventListener('keydown', e => {
  if (!view.classList.contains('on') || !bf || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
  const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  if (BF_KEYS.includes(k) || k === 'Enter') { e.preventDefault(); if (bf.mode !== 'play') { if (!e.repeat && (k === ' ' || k === 'Enter' || bf.mode === 'ready')) bfStart(); if (k === ' ' || k === 'Enter') return; } if (k !== 'Enter') bf.keys.add(k); }
  if ((k === 'p' || k === 'Escape') && bf.mode === 'play') { bf.mode = 'pause'; bf.keys.clear(); }
});
document.addEventListener('keyup', e => { if (bf) bf.keys.delete(e.key.length === 1 ? e.key.toLowerCase() : e.key); });
// au doigt ou à la souris : appuyer à gauche / à droite fait courir, au milieu fait sauter
{ const cv = $('bfCanvas'), zone = e => { const r = cv.getBoundingClientRect(), x = (e.clientX - r.left) / r.width; return x < .35 ? 'ArrowLeft' : x > .65 ? 'ArrowRight' : ' '; };
  cv.onpointerdown = e => { e.preventDefault(); if (!bf || bfStart()) return; const z = zone(e); bf.ptr = z; bf.keys.add(z); cv.setPointerCapture(e.pointerId); };
  cv.onpointerup = cv.onpointercancel = () => { if (bf?.ptr) { bf.keys.delete(bf.ptr); bf.ptr = null; } }; }
$('bfNew').onclick = () => { bfNew(); $('bfNew').blur(); };
{  // vérification : un saut sur place passe un étage, un saut lancé à fond en passe au moins 3 ; on se pose sur une poutre en descendant, pas en montant
  const keep = bf; bf = null; bfNew();
  const h = v => (BF.J0 + v * BF.JV) ** 2 / (2 * BF.G);
  bf.mode = 'play'; bf.x = 60; bf.y = 0; bf.ground = bf.floors[0]; bf.cam = -150; bf.vx = 0; bfJump(); let n = 0, maxUp = 0; while (n++ < 200) { bfUpdate(); maxUp = Math.max(maxUp, -bf.y); if (bf.ground) break; }
  console.assert(h(0) > BF.FL + 4 && h(BF.VMAX) > 3 * BF.FL && bf.ground && bf.ground.n === 1 && maxUp > BF.FL, 'beffroi', {h0: h(0), hmax: h(BF.VMAX), land: bf.ground?.n, maxUp});
  bf = keep;
}
ctx.onOpen(() => {
  if (!bf || !bf.g) { bfNew(); bf.g = $('bfCanvas').getContext('2d'); }
  gameLoop(bf, 'beffroi', bfUpdate, bfDraw); bfInfo();
});
}
