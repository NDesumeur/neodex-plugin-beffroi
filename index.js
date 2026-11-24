// Beffroi : on monte les étages d'un clocher en courant et en sautant, plus haut quand on court vite, avant que le clocher ne nous rattrape.
// Jeu NeoDex en pixel art dessiné à la main (police bitmap, cadres et boutons en pixels). Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Beffroi</span><span class="hint">← → ou QD pour courir · Espace ou ↑ pour sauter (garde la touche pour monter plus haut) · P : pause · manette</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="bfCanvas" width="240" height="320" role="img" aria-label="Beffroi"></canvas></div>
    <div class="gSide">
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="bfStats"></div></div>
      <div class="row"><button class="btn main" id="bfNew">NOUVELLE PARTIE</button><button class="btn" id="bfFs">PLEIN ÉCRAN</button></div>
      <div class="hint">Plus tu cours vite, plus tu sautes haut : la jauge en haut montre ta vitesse. Garde la touche de saut pour monter plus haut, lâche-la pour un petit saut. Les murs te renvoient sans freiner. Les cloches te relancent vers le haut, les notes rapportent des points, les oiseaux coupent ton élan. Certaines poutres bougent, cassent ou glissent. Dès le 5e étage, après un compte à rebours, le clocher défile tout seul, de plus en plus vite : s'il te rattrape, c'est perdu. Enchaîne les sauts de 2 étages ou plus pour un combo : il rapporte le carré des étages gagnés, et les gros combos sont annoncés en grand (BIEN, SUPER, GÉNIAL… jusqu'à LÉGENDAIRE).</div><div class="hint">Trois personnages, à choisir avec ← → avant de partir : le sonneur, équilibré ; la funambule (record de 30 étages), qui file vite mais saute un peu moins haut ; l'acrobate (record de 60), qui peut sauter une seconde fois en l'air.</div>
      <div class="sysCard"><b>SUCCÈS</b><div class="gStats" id="bfAch"></div></div>
    </div></div>
</div>`;
const CSS = `.gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:0 0 auto;position:relative}
.gameBox canvas{height:min(800px,max(300px,calc(100vh - 210px)));width:auto;aspect-ratio:240/320;image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none}
.gSide{display:flex;flex-direction:column;gap:14px;flex:1;min-width:250px;max-width:420px}
.gSide .sysCard{display:flex;flex-direction:column}
.gStats{display:grid;grid-template-columns:1fr auto;gap:4px 14px}
.gStats b{text-align:right}
.gameBox:fullscreen{padding:0;display:grid;place-items:center}
.gameBox:fullscreen canvas{height:100vh;width:auto}
@media(max-width:620px){.gameBox canvas{height:auto;width:100%}}`;
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

/* ---------- Beffroi : on monte les étages d'un clocher en courant et en sautant ; plus on court vite, plus on saute haut, et plus longtemps
   on garde la touche, plus le saut monte. Les murs renvoient l'élan. Le clocher change en montant (caves, charpente, cloches, horloge,
   vitraux, sommet) ; cloches pour rebondir, oiseaux qui gênent, poutres qui bougent, cassent ou glissent, notes à ramasser.
   Après le 5e étage et un compte à rebours, le clocher se met à défiler : il ne faut pas rester en bas. 48 px = 1 étage ---------- */
const BF = {W: 240, H: 320, WALL: 16, FL: 48, PW: 12, PH: 18, G: .33, AX: .3, VMAX: 4.8, J0: 6.45, JV: .8, VY: 10.5, BELL: 1.45};
BF.L = BF.WALL; BF.R = BF.W - BF.WALL;
const bfs = gstore('beffroi', {games: 0, floors: 0, combos: 0}); bfs.notes ??= 0; bfs.bells ??= 0; bfs.top ??= 0; bfs.ch ??= 0; bfs.ach ??= {}; bfs.bestCombo ??= 0;
// les personnages : course (ax), vitesse max, saut, second saut en l'air ; ils s'ouvrent avec le record d'étages
const BF_CH = [
  {name: 'Le sonneur', what: 'équilibré', open: 0, ax: 1, vmax: 1, j0: 1, pal: {hood: '#7a3a2a', hoodL: '#a85a3a', tunic: '#3a6ac8', sleeve: '#24448a', belt: '#e0b040'}},
  {name: 'La funambule', what: 'file vite, saute un peu moins haut', open: 30, ax: 1.35, vmax: 1.08, j0: .93, pal: {hood: '#b02a4a', hoodL: '#e8607a', tunic: '#e8e0f0', sleeve: '#9a90b8', belt: '#3a6ac8'}},
  {name: 'L’acrobate', what: 'un second saut en l’air', open: 60, ax: .9, vmax: .95, j0: .97, dbl: true, pal: {hood: '#2a6a3a', hoodL: '#4aa85a', tunic: '#e8b830', sleeve: '#a87a10', belt: '#c83a3a'}},
];
const bfChOk = i => bfs.top >= BF_CH[i].open;
// les mots des combos, du plus petit au plus grand (le dernier atteint est annoncé)
const BF_PRAISE = [[4, 'BIEN !'], [7, 'SUPER !'], [12, 'GÉNIAL !'], [20, 'FORMIDABLE !'], [30, 'INCROYABLE !'], [45, 'FABULEUX !'], [70, 'EXTRAORDINAIRE !'], [100, 'LÉGENDAIRE !']];
const BF_ACH = [['murs', 'Sans les murs', '100 étages sans toucher un mur'], ['combo', 'Grand combo', 'un combo de 50 étages'], ['cloches', 'Carillon', '10 cloches dans une partie'],
  ['notes', 'Mélomane', '30 notes dans une partie'], ['sommet', 'Le sommet', 'atteindre l’étage 100'], ['oiseaux', 'Ciel dégagé', '80 étages sans toucher un oiseau']];
function bfAch(id) {  // un succès débloqué : bandeau, petite fanfare
  if (bfs.ach[id]) return; const a = BF_ACH.find(x => x[0] === id); bfs.ach = {...bfs.ach, [id]: 1}; saveGames(); bfInfo();
  if (bf) bf.achBan = {text: 'SUCCÈS : ' + a[1], t: 160}; [784, 988, 1175, 1568].forEach((f, i) => setTimeout(() => bfBeep(f, .14, 'triangle', 0, .05), i * 80));
}
let bf = null, bfac = null;
const bfHash = (a, b = 0) => { let h = Math.imul(a + 374761393, 668265263) ^ Math.imul(b + 1274126177, 2246822519); h = Math.imul(h ^ h >>> 13, 1274126177); return (h ^ h >>> 16) >>> 0; };
const bfMix = (a, b, k) => { const p = h => [1, 3, 5].map(i => parseInt(h.substr(i, 2), 16)), x = p(a), y = p(b); return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * k).toString(16).padStart(2, '0')).join(''); };
// les zones du clocher, de la cave au sommet à ciel ouvert (mat : matière des poutres)
const BF_Z = [
  {from: 0, name: 'LES CAVES', bg: '#2a2420', br: '#1a1612', hl: '#3a322a', wall: '#5a5048', wl: '#7a6e62', wd: '#2a241e', mat: 1},
  {from: 10, name: 'LA CHARPENTE', bg: '#3a2618', br: '#24160c', hl: '#4a321e', wall: '#6a4a32', wl: '#8a6a4a', wd: '#3a2414', mat: 0},
  {from: 25, name: 'LA SALLE DES CLOCHES', bg: '#2a1a20', br: '#1a0e14', hl: '#3a242a', wall: '#5a3a3a', wl: '#8a6058', wd: '#2a1a1e', mat: 0},
  {from: 50, name: "L'HORLOGE", bg: '#1c1c2a', br: '#12121c', hl: '#2a2a3a', wall: '#4a4a5a', wl: '#6a6a80', wd: '#24242e', mat: 2},
  {from: 75, name: 'LES VITRAUX', bg: '#201a30', br: '#140e20', hl: '#2e2640', wall: '#5a5070', wl: '#7a7090', wd: '#2a2438', mat: 1},
  {from: 100, name: 'LE SOMMET', bg: '#2a3a6a', br: '#2a3a6a', hl: '#2a3a6a', wall: '#8a8090', wl: '#b0a8b8', wd: '#3a3440', mat: 1, sky: true},
];
const bfZi = n => { let i = 0; while (i + 1 < BF_Z.length && n >= BF_Z[i + 1].from) i++; return i; };
const BF_MAT = [['#8a5a32', '#c8884a', '#4a2a18'], ['#6a6470', '#a8a0b0', '#34303a'], ['#a8682a', '#ffc85a', '#5a3010']];
const bfFloorY = n => -n * BF.FL;
// le fond d'un étage (la largeur entre les murs, la hauteur d'un étage) et le mur, dessinés une fois par zone
const bfTiles = {};
function bfTile(zi) {
  if (bfTiles[zi]) return bfTiles[zi];
  const z = BF_Z[zi], w = BF.R - BF.L, mk = (cw) => { const c = el('canvas'); c.width = cw; c.height = BF.FL; return c; }, back = mk(w), wall = mk(BF.WALL), g = back.getContext('2d'), q = wall.getContext('2d');
  px(g, z.bg, 0, 0, w, BF.FL);
  if (!z.sky) for (let r = 0; r < 6; r++) { const y = r * 8, o = r % 2 ? 8 : 0; px(g, z.br, 0, y + 7, w, 1); px(g, z.hl, 0, y, w, 1); for (let x = o; x < w; x += 16) px(g, z.br, x, y, 1, 7); }
  if (zi === 1) for (let k = 0; k < BF.FL; k++) { px(g, '#24160c', 30 + k - 1, k, 8, 1); px(g, '#5a3a22', 30 + k, k, 6, 1); px(g, '#24160c', w - 38 - k, k, 8, 1); px(g, '#5a3a22', w - 37 - k, k, 6, 1); }
  if (zi === 2) for (const x of [26, w - 28]) { px(g, '#6a4a32', x, 0, 2, BF.FL); for (let y = 2; y < BF.FL; y += 4) px(g, '#8a6a4a', x, y, 1, 2); }
  px(q, z.wall, 0, 0, BF.WALL, BF.FL);
  for (let r = 0; r < 6; r++) { const y = r * 8, o = r % 2 ? 8 : 0; px(q, z.wd, 0, y + 7, BF.WALL, 1); for (let x = o; x < BF.WALL + 8; x += 16) { px(q, z.wd, x - 1, y, 1, 7); px(q, z.wl, x, y, 7, 1); } }
  return bfTiles[zi] = {back, wall};
}
// une nouvelle partie garde le même objet : la boucle du jeu (gameLoop) continue de tourner dessus
const renew = (old, o) => { if (!old) return o; for (const k of Object.keys(old)) if (k !== 'raf') delete old[k]; return Object.assign(old, o); };
function bfNew() {
  const g = bf?.g, hc = bf?.hc;
  bf = renew(bf, {g, hc, mode: 'ready', tick: 0, seen: 0, x: BF.W / 2 - BF.PW / 2, y: 0, vx: 0, vy: 0, ground: 0, face: 0, keys: new Set(), floors: [], bells: [], notes: [], birds: [], cam: -BF.H + 60, scroll: 0,
    score: 0, combo: 0, comboN: 0, comboT: 0, last: 0, best: 0, pop: null, banner: null, dead: 0, record: false, rnd: seeded(Date.now() % 1e9), dust: [], trail: [],
    coy: 0, buf: 0, jPrev: false, rising: false, hurt: 0, spin: 0, count: 0, started: false, birdT: 300, zi: 0, got: 0, rang: 0,
    ch: BF_CH[bfChOk(bfs.ch) ? bfs.ch : 0], dbl: false, ann: null, achBan: null, wallFrom: 0, birdFrom: 0, flash: 0});
  bf.ground = null; bfGen(60); bf.ground = bf.floors[0]; bfInfo();
}
// les étages : le 0, les 5 premiers, chaque début de zone et tous les 50 prennent toute la largeur ; ensuite des poutres de plus en plus courtes,
// dès le 12e certaines bougent, cassent ou glissent (à partir de l'horloge) ; des cloches (surtout dans la salle des cloches) et des notes
function bfGen(upTo) {
  for (let n = bf.floors.length; n <= upTo; n++) {
    const R = bf.rnd, zi = bfZi(n);
    if (n < 5 || n % 50 === 0 || BF_Z.some(z => z.from === n)) { bf.floors.push({n, x: BF.L, w: BF.R - BF.L, ox: BF.L, type: '', amp: 0}); continue; }
    const w = Math.max(42, Math.round(120 - Math.min(n, 300) / 4 - R() * 33)), r = R();
    let type = '';
    if (n >= 12) { const pm = Math.min(.25, .06 + (n - 12) / 200), pb = Math.min(.2, .04 + (n - 12) / 250); type = r < pm ? 'move' : r < pm + pb ? 'break' : zi >= 3 && r < pm + pb + .2 ? 'slip' : ''; }
    const amp = type === 'move' ? Math.max(0, Math.min(40, (BF.R - BF.L - w) / 2 - 2)) : 0, ox = BF.L + amp + Math.round(R() * (BF.R - BF.L - w - 2 * amp));
    bf.floors.push({n, x: ox, w, ox, type, amp, sp: .02 + R() * .02, ph: R() * 6.28});
    if (n >= 8 && R() < (zi === 2 ? .4 : .08)) bf.bells.push({x: BF.L + 16 + Math.round(R() * (BF.R - BF.L - 32)), y: bfFloorY(n) - 36, cd: 0, sw: 0, n});
    if (n >= 3 && R() < .3) bf.notes.push({x: ox + w / 2, y: bfFloorY(n) - 16, got: false, n});
  }
}
function bfBeep(f, d, type = 'square', slide = 0, vol = .04) { try { bfac ??= new AudioContext(); const o = bfac.createOscillator(), g = bfac.createGain(), t = bfac.currentTime; o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g).connect(bfac.destination); o.start(t); o.stop(t + d); } catch {} }
// une suite de sauts d'au moins 2 étages : un combo ; il se termine sur un petit saut ou après 3 s ; il rapporte (étages du combo)² si au moins 2 sauts
function bfComboEnd() {
  if (bf.comboN >= 2) {
    const pts = bf.combo * bf.combo, tier = BF_PRAISE.filter(([m]) => bf.combo >= m).length; bf.score += pts; bfs.combos++; bfs.bestCombo = Math.max(bfs.bestCombo, bf.combo);
    bf.ann = {word: tier ? BF_PRAISE[tier - 1][1] : 'COMBO !', combo: bf.combo, jumps: bf.comboN, pts, tier, t: 130}; bf.flash = tier >= 3 ? 10 : 0;
    const cx = bf.x + 6, cy = bf.y - 20; for (let i = 0; i < 8 + tier * 6; i++) { const a = i / (8 + tier * 6) * 6.28; bf.dust.push({x: cx + Math.cos(a) * 6, y: cy + Math.sin(a) * 6, vx: Math.cos(a) * (1.5 + tier * .3), vy: Math.sin(a) * (1.5 + tier * .3), t: 26 + tier * 3, c: ['#ffd84a', '#ff8a3a', '#7ee07a', '#8ad8ff', '#ff6ad8'][i % 5]}); }
    [523, 659, 784, 1047, 1319, 1568, 2093, 2637, 3136].slice(0, 2 + tier).forEach((f, i) => setTimeout(() => bfBeep(f, .14, i % 2 ? 'triangle' : 'square', 0, .04), i * 70));
    if (bf.combo >= 50) bfAch('combo');
  }
  bf.combo = bf.comboN = 0; bf.comboT = 0;
}
function bfLand(f) {
  const gained = f.n - bf.last;
  if (gained >= 2) { bf.combo += gained; bf.comboN++; bf.comboT = 180; } else if (gained !== 0 || bf.comboT <= 0) bfComboEnd();
  bf.last = f.n; bf.ground = f; bf.spin = 0; bf.rising = false; bf.dbl = false;
  if (gained >= 4) bf.pop = {text: gained + ' ÉTAGES !', t: 70};
  if (f.type === 'break' && !f.br) f.br = 36;
  if (f.n > bf.best) {
    bf.score += (f.n - bf.best) * 10; bf.best = f.n;
    const zi = bfZi(f.n); if (zi > bf.zi) { bf.zi = zi; bf.banner = {text: BF_Z[zi].name, t: 150}; bfBeep(523, .15, 'triangle'); setTimeout(() => bfBeep(784, .3, 'triangle'), 120); }
    if (f.n >= 5 && !bf.started) { bf.started = true; bf.count = 180; }
    if (bf.best - bf.wallFrom >= 100) bfAch('murs'); if (bf.best - bf.birdFrom >= 80) bfAch('oiseaux'); if (bf.best >= 100) bfAch('sommet');
  }
  for (let i = 0; i < 5; i++) bf.dust.push({x: bf.x + 1 + i * 2.5, y: bf.y, t: 12, c: '#e8d8c8'});
  bfBeep(gained >= 2 ? 520 : 300, .05, 'triangle');
}
function bfDie() {
  if (bf.mode !== 'play') return;
  bfComboEnd(); bf.mode = 'over'; bf.dead = 0; bf.keys.clear();
  bfs.games++; bfs.floors += bf.best; bfs.top = Math.max(bfs.top, bf.best); bf.record = best('beffroi', bf.score); saveGames(); bfInfo();
  bfBeep(400, .7, 'triangle', 60, .07);
}
function bfJump() {
  if (bf.mode !== 'play' || !(bf.ground || bf.coy > 0)) return;
  bf.vy = -(BF.J0 * bf.ch.j0 + Math.abs(bf.vx) * BF.JV); bf.ground = null; bf.coy = 0; bf.buf = 0; bf.rising = true;
  bf.spin = Math.abs(bf.vx) > BF.VMAX * bf.ch.vmax * .92 ? 1 : 0;  // à pleine vitesse : un salto
  bfBeep(220 + Math.abs(bf.vx) * 55, .12, 'square', 520 + Math.abs(bf.vx) * 80, .03);
}
function bfUpdate() {
  if (bf.mode === 'over') { bf.dead++; return; }
  if (bf.mode !== 'play') return;
  const k = bf.keys, on = (...n) => n.some(x => k.has(x)), pad = bf.pad || {};
  const dir = Math.max(-1, Math.min(1, (on('ArrowRight', 'd') ? 1 : 0) - (on('ArrowLeft', 'q', 'a') ? 1 : 0) + (pad.x || 0))), jk = on(' ', 'ArrowUp', 'z', 'w') || !!pad.j;
  // les poutres qui bougent emportent le sonneur ; celles qui cassent tombent
  for (const f of bf.floors) {
    if (f.type === 'move') { const nx = f.ox + Math.sin(bf.tick * f.sp + f.ph) * f.amp; if (bf.ground === f) bf.x += nx - f.x; f.x = nx; }
    if (f.br > 0 && --f.br === 0) { f.gone = 1; if (bf.ground === f) { bf.ground = null; bf.coy = 6; } bfBeep(120, .25, 'sawtooth', 50, .04); }
    if (f.gone) f.gone += .3 + f.gone * .05;
  }
  // la course : on accélère vers la touche, on freine au sol sans touche (presque pas sur une poutre qui glisse)
  const vmax = BF.VMAX * bf.ch.vmax;
  if (dir) { bf.vx = Math.max(-vmax, Math.min(vmax, bf.vx + dir * BF.AX * bf.ch.ax)); bf.face = dir < 0 ? 1 : 0; }
  else if (bf.ground) bf.vx *= bf.ground.type === 'slip' ? .985 : .82;
  if (Math.abs(bf.vx) < .05) bf.vx = 0;
  bf.x += bf.vx;
  if (bf.x < BF.L) { bf.x = BF.L; bf.vx = Math.abs(bf.vx) * .9; bf.face = 0; bf.wallFrom = bf.best; if (!bf.ground) bfBeep(160, .04, 'square', 0, .02); }  // le mur renvoie l'élan
  if (bf.x > BF.R - BF.PW) { bf.x = BF.R - BF.PW; bf.vx = -Math.abs(bf.vx) * .9; bf.face = 1; bf.wallFrom = bf.best; if (!bf.ground) bfBeep(160, .04, 'square', 0, .02); }
  // le saut : gardé en mémoire un instant si on appuie trop tôt, possible encore un instant après avoir quitté une poutre ; lâcher la touche le raccourcit
  const press = jk && !bf.jPrev; if (press) bf.buf = 8; bf.jPrev = jk;
  if (press && bf.ch.dbl && !bf.ground && bf.coy <= 0 && !bf.dbl) { bf.dbl = true; bf.buf = 0; bf.vy = -BF.J0 * .78; bf.rising = true; bf.spin = 1; bfBeep(700, .1, 'square', 1100, .03); for (let i = 0; i < 5; i++) bf.dust.push({x: bf.x + i * 3, y: bf.y, t: 12, c: '#ffffff'}); }  // l'acrobate : un second saut
  if ((bf.buf > 0 || (jk && bf.ground)) && (bf.ground || bf.coy > 0)) bfJump();
  if (bf.buf > 0) bf.buf--;
  if (bf.rising && !jk && bf.vy < -2) { bf.vy *= .5; bf.rising = false; }
  // au sol : on tombe si on sort de la poutre ; en l'air : la gravité, et on se pose seulement en descendant (on traverse par en dessous)
  if (bf.ground && (bf.x + BF.PW - 3 < bf.ground.x || bf.x + 3 > bf.ground.x + bf.ground.w)) { bf.ground = null; bf.coy = 6; }
  if (!bf.ground) {
    if (bf.coy > 0) bf.coy--;
    const prev = bf.y; bf.vy = Math.min(BF.VY, bf.vy + BF.G); bf.y += bf.vy; if (bf.vy >= 0) bf.rising = false;
    if (bf.vy > 0) for (const f of bf.floors) { if (f.gone) continue; const fy = bfFloorY(f.n); if (prev <= fy && bf.y >= fy && bf.x + BF.PW - 3 >= f.x && bf.x + 3 <= f.x + f.w) { bf.y = fy; bf.vy = 0; bfLand(f); break; } }
  }
  if (bf.spin) bf.spin++;
  // les cloches : on rebondit dessus en l'air ; les notes : on les ramasse
  const hx = bf.x + BF.PW / 2, hy = bf.y - BF.PH / 2;
  for (const b of bf.bells) {
    if (b.cd) b.cd--; b.sw *= .985;
    if (!bf.ground && !b.cd && Math.abs(hx - b.x) < 12 && hy > b.y - 6 && hy < b.y + 26) {
      b.cd = 40; b.sw = bf.vx >= 0 ? .5 : -.5; bf.vy = -BF.J0 * BF.BELL; bf.rising = false; bf.spin = 1; bfs.bells++; bf.rang++; bf.score += 15; if (bf.rang >= 10) bfAch('cloches');
      bf.pop = {text: 'DONG ! +15', t: 60}; bfBeep(660, .9, 'triangle', 0, .06); bfBeep(990, .6, 'sine', 0, .03);
    }
  }
  for (const nt of bf.notes) if (!nt.got && Math.abs(hx - nt.x) < 11 && Math.abs(hy - nt.y) < 15) {
    nt.got = true; bf.got++; bfs.notes++; bf.score += 25; if (bf.got >= 30) bfAch('notes'); bfBeep([523, 587, 659, 784, 880, 1047][bf.got % 6], .18, 'triangle', 0, .05);
    for (let i = 0; i < 6; i++) bf.dust.push({x: nt.x - 4 + i * 2, y: nt.y + 4 - (i % 3) * 3, t: 16, c: '#ffd84a'});
  }
  // les oiseaux (pigeons en bas, chauves-souris plus haut) traversent le clocher : les toucher coupe l'élan et le combo
  if (bf.started && bf.best >= 8 && --bf.birdT <= 0) {
    const R = bf.rnd, d = R() < .5 ? 1 : -1; bf.birdT = Math.max(150, 420 - bf.best * 2) + R() * 200;
    bf.birds.push({x: d > 0 ? -14 : BF.W + 14, y: bf.cam + 70 + R() * (BF.H - 170), vx: d * (1 + R() * .8 + Math.min(1, bf.best / 120)), ph: R() * 6, bat: bfZi(bf.best) >= 3});
  }
  for (const b of bf.birds) {
    b.x += b.vx; b.y += Math.sin(bf.tick / 12 + b.ph) * .5;
    if (!bf.hurt && Math.abs(b.x - hx) < 10 && Math.abs(b.y - hy) < 12) {
      bf.hurt = 50; bf.vx = Math.sign(b.vx) * 3; if (bf.vy < 0) bf.vy *= .3; bf.rising = false; bf.spin = 0; bf.birdFrom = bf.best; bfComboEnd(); bfBeep(300, .2, 'sawtooth', 120, .04);
      for (let i = 0; i < 6; i++) bf.dust.push({x: b.x - 6 + i * 2, y: b.y - 3 + (i % 2) * 6, t: 22, c: b.bat ? '#5a3a6a' : '#e0dee8'});
    }
  }
  bf.birds = bf.birds.filter(b => b.x > -30 && b.x < BF.W + 30);
  if (bf.hurt) bf.hurt--;
  if (bf.comboT > 0 && --bf.comboT === 0) bfComboEnd();
  // la caméra suit vers le haut ; dès le 5e étage et un compte à rebours, le clocher défile tout seul, un peu plus vite toutes les 30 s
  if (bf.count > 0 && --bf.count === 0) { bf.pop = {text: 'LE CLOCHER MONTE !', t: 90}; bfBeep(330, .4, 'square', 660, .04); }
  if (bf.started && !bf.count) { bf.scroll++; bf.cam -= Math.min(2.55, .52 + Math.floor(bf.scroll / 1800) * .22); }
  bf.cam = Math.min(bf.cam, bf.y - BF.H * .45);
  bfGen(bf.best + 40);
  if (bf.pop && --bf.pop.t <= 0) bf.pop = null;
  if (bf.banner && --bf.banner.t <= 0) bf.banner = null;
  bf.trail.unshift([bf.x, bf.y]); bf.trail.length = Math.min(bf.trail.length, 8);
  for (const d of bf.dust) { d.t--; if (d.vx != null) { d.x += d.vx; d.y += d.vy; d.vx *= .94; d.vy = d.vy * .94 + .05; } else d.y -= .3; } bf.dust = bf.dust.filter(d => d.t > 0);
  if (bf.ann && --bf.ann.t <= 0) bf.ann = null; if (bf.achBan && --bf.achBan.t <= 0) bf.achBan = null; if (bf.flash) bf.flash--;
  if (bf.y - bf.cam > BF.H + 24) bfDie();
}
/* ---------- le dessin ---------- */
function bfHero(g, x, y, face, st, t) {  // le sonneur, dessiné par morceaux (contour d'abord) : st = idle | run | up | down
  const C = (bf?.ch || BF_CH[0]).pal, parts = [], P = (dx, dy, w, h, c) => parts.push([face ? 12 - dx - w : dx, dy, w, h, c]), Q = (dx, dy, w, h, c) => px(g, c, x + (face ? 12 - dx - w : dx), y - 18 + dy, w, h);
  const ph = st === 'run' ? Math.sin(t / 3.2) : 0, air = st === 'up' || st === 'down', bob = st === 'run' ? Math.abs(Math.round(ph)) : st === 'idle' ? (t >> 5) % 2 : 0, l = Math.round(ph * 2);
  if (air) P(3, 12, 3, st === 'up' ? 4 : 5, '#3a2418'); else P(4 - l, 13, 2, 5, '#3a2418');
  P(st === 'up' ? 2 : 3 - l, st === 'up' ? 4 : 8 + bob, 2, 4, C.sleeve);
  P(3, 7 + bob, 6, 6, C.tunic);
  P(st === 'idle' ? 0 : -1, 2 + bob + (st === 'up' ? 1 : st === 'down' ? -1 : 0), 3, 3, C.hood);
  P(2, bob, 8, 7, C.hood);
  if (air) P(7, st === 'up' ? 13 : 12, 3, 4, '#5a3a2a'); else P(6 + l, 13, 2, 5, '#5a3a2a');
  P(st === 'up' ? 8 : 6 + l, st === 'up' ? 3 : 8 + bob, 2, 4, C.tunic);
  for (const [dx, dy, w, h] of parts) px(g, '#1a1018', x + dx - 1, y - 18 + dy - 1, w + 2, h + 2);
  for (const [dx, dy, w, h, c] of parts) px(g, c, x + dx, y - 18 + dy, w, h);
  Q(3, bob, 6, 1, C.hoodL); Q(2, 1 + bob, 1, 5, C.hoodL); Q(5, 3 + bob, 4, 3, '#ffd0a8'); Q(7, 4 + bob, 1, 1, '#1a1018'); Q(8, 5 + bob, 1, 1, '#f09a8a');
  Q(3, 10 + bob, 6, 1, C.belt); Q(8, 7 + bob, 1, 6, C.sleeve);
  if (st === 'up') Q(8, 2, 2, 1, '#ffd0a8'); else if (!air) Q(6 + l, 12 + bob, 2, 1, '#ffd0a8');
}
function bfBell(g, cx, top, ang, t) {  // une cloche de bronze qui se balance au bout de sa corde
  px(g, '#3a2414', cx - 1, top - 40, 3, 40); px(g, '#8a6a4a', cx, top - 40, 1, 40);
  g.save(); g.translate(cx, top); g.rotate(ang);
  px(g, '#1a1018', -4, -1, 8, 4); px(g, '#6a4a2a', -3, 0, 6, 2);
  for (let y = 2; y < 18; y++) { const hw = Math.round(y < 5 ? 2 + y * .8 : y < 14 ? 6 + (y - 5) * .25 : 8 + (y - 14) * .9); px(g, '#1a1018', -hw - 1, y, hw * 2 + 2, 1); px(g, '#c88a30', -hw, y, hw * 2, 1); px(g, '#ffe08a', -hw + 1, y, 2, 1); px(g, '#8a5a20', hw - 2, y, 2, 1); }
  px(g, '#1a1018', -10, 18, 20, 2); px(g, '#a87028', -9, 18, 18, 1); px(g, '#ffd060', -6, 12, 12, 1);
  const cl = Math.round(-ang * 8); px(g, '#1a1018', cl - 2, 18, 4, 4); px(g, '#5a3010', cl - 1, 19, 2, 2);
  g.restore();
}
const BF_NOTE = ['....##.', '....#.#', '....#..#', '....#..', '....#..', '.####..', '#####..', '.###...'];
function bfGear(g, cx, cy, r, a, col, dark) {  // une roue dentée qui tourne
  for (let k = 0; k < 12; k++) { const an = a + k / 12 * Math.PI * 2; px(g, dark, cx + Math.cos(an) * (r + 1) - 2, cy + Math.sin(an) * (r + 1) - 2, 4, 4); }
  for (let dy = -r; dy <= r; dy++) { const hw = Math.round(Math.sqrt(r * r - dy * dy)); px(g, col, cx - hw, cy + dy, hw * 2, 1); }
  for (let dy = -r + 4; dy <= r - 4; dy++) { const hw = Math.round(Math.sqrt((r - 4) ** 2 - dy * dy)); px(g, dark, cx - hw, cy + dy, hw * 2, 1); }
  for (let k = 0; k < 4; k++) { const an = a + k * Math.PI / 2; for (let s = 0; s < r - 3; s++) px(g, col, cx + Math.cos(an) * s - 1, cy + Math.sin(an) * s - 1, 2, 2); }
  px(g, dark, cx - 3, cy - 3, 6, 6); px(g, col, cx - 1, cy - 1, 2, 2);
}
// ce qui décore un étage selon sa zone (n : l'étage, y0 : le haut de sa bande à l'écran)
function bfDeco(g, n, zi, y0, t) {
  const h = bfHash(n, 7), L = BF.L, w = BF.R - BF.L, z = BF_Z[zi];
  if (n <= 4 && n >= 0) { const tips = ['← → : COURIR', 'ESPACE : SAUTER', 'GARDE ESPACE : PLUS HAUT', 'COURS VITE : SAUT PLUS HAUT', "LES MURS RENVOIENT L'ÉLAN"]; PXK.fill(g, tips[n], BF.W / 2, y0 + 26, '#8a7078', 1, 'center'); return; }
  if (zi === 0) {
    if (h % 3 === 0) { const x = L + 20 + h % (w - 40), y = y0 + 14, f = (t >> 3) + n & 3;
      g.fillStyle = 'rgba(255,170,80,.07)'; g.fillRect(x - 16, y - 12, 34, 30); g.fillRect(x - 9, y - 6, 20, 18);
      px(g, '#1a1018', x - 1, y + 2, 4, 8); px(g, '#6a4a2a', x, y + 3, 2, 7); px(g, '#3a3030', x - 2, y + 9, 6, 2);
      px(g, '#ff4a3a', x - 1, y - 2 + (f & 1), 4, 5); px(g, '#ff8a3a', x, y - 4 + (f >> 1), 2, 5); px(g, '#ffd84a', x, y, 2, 2); }
    else if (h % 5 === 1) { const x = L + 30 + h % (w - 70); px(g, '#1a1018', x - 1, y0 + 9, 22, 16); px(g, '#141838', x, y0 + 10, 20, 14); for (let k = 0; k < 4; k++) px(g, '#4a4040', x + 2 + k * 5, y0 + 10, 2, 14); px(g, '#f0e8d8', x + 5 + h % 9, y0 + 14, 1, 1); }
  } else if (zi === 1) {
    if (h % 4 === 0) { const x = L + 40 + h % (w - 80), sw = Math.round(Math.sin(t / 40 + n) * 2);
      px(g, '#3a3030', x, y0, 1, 12); g.fillStyle = 'rgba(255,200,110,.08)'; g.fillRect(x - 14 + sw, y0 + 6, 30, 26);
      px(g, '#1a1018', x - 4 + sw, y0 + 11, 10, 12); px(g, '#4a3a2a', x - 3 + sw, y0 + 12, 8, 10); px(g, '#ffd84a', x - 2 + sw, y0 + 14, 6, 6); px(g, '#fff0c0', x + sw, y0 + 16, 2, 2); }
  } else if (zi === 2) {
    if (h % 3 === 0) { const x = L + 30 + h % (w - 60); g.save(); g.translate(x, y0 + 6); g.rotate(Math.sin(t / 70 + n) * .12); g.globalAlpha = .45;
      for (let y = 0; y < 26; y++) { const hw = Math.round(y < 6 ? 3 + y * 1.2 : 10 + (y - 6) * .3); px(g, z.hl, -hw, y, hw * 2, 1); } g.globalAlpha = 1; g.restore(); }
  } else if (zi === 3) {
    if (n % 10 === 5) { const cx = BF.W / 2, cy = y0 + 22, R = 18;
      for (let dy = -R - 2; dy <= R + 2; dy++) { const hw = Math.round(Math.sqrt((R + 2) ** 2 - dy * dy)); px(g, '#1a1018', cx - hw, cy + dy, hw * 2, 1); }
      for (let dy = -R; dy <= R; dy++) { const hw = Math.round(Math.sqrt(R * R - dy * dy)); px(g, '#e8dcc0', cx - hw, cy + dy, hw * 2, 1); }
      for (let k = 0; k < 12; k++) { const an = k / 12 * Math.PI * 2; px(g, '#3a3030', cx + Math.cos(an) * (R - 3) - 1, cy + Math.sin(an) * (R - 3) - 1, 2, 2); }
      for (const [len, sp] of [[14, 30], [9, 360]]) { const an = t / sp - Math.PI / 2; for (let s = 0; s < len; s++) px(g, '#1a1018', cx + Math.cos(an) * s, cy + Math.sin(an) * s, 2, 2); } }
    else if (h % 2 === 0) bfGear(g, L + 24 + h % (w - 48), y0 + 24, 12 + h % 7, (h % 3 ? 1 : -1) * t / 90, z.hl, z.br);
  } else if (zi === 4) {
    if (h % 2 === 0) { const x = L + 24 + h % (w - 60), cols = ['#c83a4a', '#3a6ac8', '#e0b040', '#3a9a5a', '#8a4ac8'];
      g.fillStyle = 'rgba(255,220,170,.05)'; g.beginPath(); g.moveTo(x, y0 + 8); g.lineTo(x + 28, y0 + 8); g.lineTo(x + 70, y0 + 48); g.lineTo(x + 30, y0 + 48); g.fill();
      for (let y = 0; y < 34; y++) { const half = y < 10 ? Math.round(Math.sqrt(Math.max(0, 100 - (10 - y) ** 2)) * 1.2) : 12; px(g, '#1a1018', x + 14 - half - 2, y0 + 6 + y, half * 2 + 4, 1);
        for (let xx = -half; xx < half; xx++) px(g, (xx + 100) % 6 === 0 || y % 7 === 0 ? '#2a2030' : cols[(bfHash(n, (xx + 20 >> 2) + (y >> 3) * 10) % 5)], x + 14 + xx, y0 + 6 + y); } }
  } else {
    const r = seeded(n * 31 + 7); for (let k = 0; k < 7; k++) { const sx = L + r() * w, sy = y0 + r() * BF.FL, tw = (k + (t >> 4) + n) % 9; px(g, tw ? 'rgba(255,255,255,.7)' : '#ffffff', sx, sy, tw ? 1 : 2, tw ? 1 : 2); }
    if (n === 112) { for (let dy = -10; dy <= 10; dy++) { const hw = Math.round(Math.sqrt(100 - dy * dy)); px(g, '#f0ecd8', BF.W - 70 - hw, y0 + 24 + dy, hw * 2, 1); } px(g, '#d0c8b0', BF.W - 74, y0 + 20, 4, 3); px(g, '#d0c8b0', BF.W - 66, y0 + 28, 3, 3); }
    if (h % 3 === 0) { const cx = ((h % w) + t * .1) % (w + 60) + L - 30 | 0; g.fillStyle = 'rgba(200,210,240,.22)'; g.fillRect(cx, y0 + 30, 40, 5); g.fillRect(cx + 8, y0 + 26, 22, 4); }
  }
}
function bfDraw() {
  const g = bf.g, {W, H, L, R, FL} = BF, cam = Math.round(bf.cam), sy = y => Math.round(y - cam), t = bf.tick;
  bfPad();
  for (; bf.seen < bf.tick; bf.seen++) if (bf.mode === 'over') bfUpdate();
  g.imageSmoothingEnabled = false;
  // les étages de fond, bande par bande, chacun dans sa zone ; sous l'étage 0, la terre
  const nLo = Math.floor(-(cam + H) / FL), nHi = Math.floor(-cam / FL);
  for (let n = nLo; n <= nHi; n++) {
    const y0 = sy(bfFloorY(n + 1));
    if (n < 0) { px(g, '#1a1410', 0, y0, W, FL); for (let k = 0; k < 14; k++) px(g, '#2a2018', (bfHash(n, k) % W), y0 + bfHash(k, n) % FL, 3, 2); continue; }
    const zi = bfZi(n), T = bfTile(zi);
    if (BF_Z[zi].sky) px(g, bfMix('#3a4a8a', '#0a0a24', Math.min(1, (n - 100) / 60)), L, y0, R - L, FL); else g.drawImage(T.back, L, y0);
    bfDeco(g, n, zi, y0, t);
    g.drawImage(T.wall, 0, y0); g.drawImage(T.wall, R, y0);
  }
  px(g, '#00000040', L - 1, 0, 1, H); px(g, '#120a0e', L, 0, 1, H); px(g, '#120a0e', R - 1, 0, 1, H); px(g, '#ffffff18', R, 0, 1, H);
  // les poutres : dessus clair, dessous sombre, chevilles ; fissures, roues ou éclat selon la sorte ; un panneau tous les 10
  for (const f of bf.floors) {
    let y = sy(bfFloorY(f.n)); if (y < -10 || y > H + 10) continue;
    const [m, hi, lo] = BF_MAT[BF_Z[bfZi(f.n)].mat], x = Math.round(f.x) + (f.br > 0 ? (t >> 1) % 2 * 2 - 1 : 0);
    if (f.gone) { y += Math.round(f.gone); g.globalAlpha = Math.max(0, 1 - f.gone / 60); }
    px(g, '#1a1018', x - 1, y - 1, f.w + 2, 9); px(g, m, x, y, f.w, 7); px(g, hi, x, y, f.w, 1); px(g, lo, x, y + 6, f.w, 1);
    for (let xx = x + 4; xx < x + f.w - 3; xx += 12) px(g, lo, xx, y + 3, 1, 1);
    if (f.type === 'break') for (let k = 0; k < f.w / 14; k++) { const cx = x + 6 + k * 14 + bfHash(f.n, k) % 6; px(g, '#1a1018', cx, y + 1, 1, 3); px(g, '#1a1018', cx + 1, y + 3, 1, 3); }
    if (f.type === 'move') { for (const cx of [x + 3, x + f.w - 7]) { px(g, '#1a1018', cx, y + 6, 5, 4); px(g, '#c8c0d0', cx + 1, y + 7, 3, 2); } px(g, '#3a3030', x + f.w / 2, y - FL + 8, 1, FL - 9); }
    if (f.type === 'slip') { px(g, '#ffffff', x + 3 + (t >> 2) % Math.max(1, f.w - 8), y + 1, 4, 1); px(g, '#fff0c0', x, y + 1, f.w, 1); }
    if (f.n % 10 === 0 && f.n) { const s = String(f.n), sw = s.length * 7 + 8, sx = Math.round(x + f.w / 2 - sw / 2); px(g, '#1a1018', sx - 1, y + 7, sw + 2, 14); px(g, '#f0e8d8', sx, y + 8, sw, 12); PXK.fill(g, s, sx + sw / 2, y + 17, '#5a3a2a', 1, 'center'); }
    g.globalAlpha = 1;
  }
  for (const b of bf.bells) { const y = sy(b.y); if (y > -30 && y < H + 30) bfBell(g, b.x, y, Math.sin(t / 8) * b.sw + Math.sin(t / 60 + b.n) * .05, t); }
  for (const nt of bf.notes) { const y = sy(nt.y) + Math.round(Math.sin(t / 15 + nt.n) * 2); if (!nt.got && y > -20 && y < H + 20) sprite(g, BF_NOTE, nt.x - 4, y - 4, {'#': (t >> 4) % 2 ? '#ffd84a' : '#ffe890', '.': null}); }
  // le sonneur, sa traînée quand il court vite, son salto à pleine vitesse ; il clignote après un oiseau
  const st = !bf.ground ? (bf.vy < 0 ? 'up' : 'down') : Math.abs(bf.vx) > .3 ? 'run' : 'idle', hc = bf.hc, hg = hc.getContext('2d');
  hg.clearRect(0, 0, hc.width, hc.height); bfHero(hg, 6, 24, bf.face, st, t);
  if (!(bf.mode === 'over' && bf.dead > 30) && !(bf.hurt && (t >> 2) % 2)) {
    if (Math.abs(bf.vx) > 3.8) bf.trail.forEach(([tx, ty], i) => { if (i % 2 && i > 1) { g.globalAlpha = .3 - i * .03; g.drawImage(hc, Math.round(tx) - 6, sy(ty) - 24); } });
    g.globalAlpha = 1;
    const x = Math.round(bf.x), y = sy(bf.y);
    if (bf.spin && bf.spin < 34) { g.save(); g.translate(x + 6, y - 9); g.rotate((bf.face ? -1 : 1) * bf.spin / 34 * Math.PI * 2); g.drawImage(hc, -12, -15); g.restore(); }
    else g.drawImage(hc, x - 6, y - 24);
  }
  if (Math.abs(bf.vx) > 3.8 && bf.ground) for (let i = 1; i < 4; i++) px(g, '#c8b0b8', Math.round(bf.x) + (bf.vx > 0 ? -i * 4 : BF.PW + i * 4 - 2), sy(bf.y) - 3 - i, 3, 1);
  for (const b of bf.birds) {
    const x = Math.round(b.x), y = sy(b.y), up = (t >> 3) % 2, d = b.vx > 0, body = b.bat ? '#3a2a4a' : '#9a98a8', wing = b.bat ? '#5a3a6a' : '#c8c6d0';
    px(g, '#1a1018', x - 6, y - 3, 12, 6); px(g, body, x - 5, y - 2, 10, 4); px(g, '#1a1018', x + (d ? 3 : -7), y - 5, 5, 5); px(g, body, x + (d ? 4 : -6), y - 4, 3, 3);
    px(g, b.bat ? '#ff4a3a' : '#1a1018', x + (d ? 5 : -5), y - 3, 1, 1); if (!b.bat) px(g, '#e0a040', x + (d ? 7 : -8), y - 3, 2, 1); else { px(g, body, x + (d ? 4 : -6), y - 6, 1, 2); px(g, body, x + (d ? 6 : -4), y - 6, 1, 2); }
    px(g, '#1a1018', x - 3, up ? y - 8 : y, 6, up ? 7 : 6); px(g, wing, x - 2, up ? y - 7 : y + 1, 4, up ? 5 : 4);
  }
  for (const d of bf.dust) px(g, d.t > 6 ? d.c : '#8a7080', d.x, sy(d.y) - 1, 2, 2);
  // le danger en bas quand le clocher défile et qu'on traîne
  if (bf.mode === 'play' && bf.started && !bf.count && bf.y - cam > H - 90) { g.fillStyle = 'rgba(255,60,40,' + ((.12 + .08 * Math.sin(t / 5)) * Math.min(1, (bf.y - cam - H + 90) / 60)).toFixed(3) + ')'; g.fillRect(0, H - 40, W, 40); }
  // le bandeau : étage, jauge d'élan, score, notes, combo
  px(g, '#120a0e', 0, 0, W, 20); px(g, '#3e2a30', 0, 20, W, 1);
  pxFont(g, 'Étage ' + bf.best, 5, 14, '#ffffff', 8); pxFont(g, String(bf.score), W - 5, 14, '#ffd84a', 8, 'right');
  const sp = Math.round(Math.abs(bf.vx) / (BF.VMAX * bf.ch.vmax) * 8); for (let i = 0; i < 8; i++) px(g, i < sp ? (i < 4 ? '#7ee07a' : i < 7 ? '#ffd84a' : '#ff8a3a') : '#3a2a32', 86 + i * 6, 7, 5, 6);
  if (bf.got) { sprite(g, BF_NOTE, W - 30, 25, {'#': '#ffd84a', '.': null}); pxFont(g, String(bf.got), W - 32, 34, '#ffd84a', 8, 'right'); }
  if (bf.flash) { g.fillStyle = 'rgba(255,240,200,' + (bf.flash / 40).toFixed(2) + ')'; g.fillRect(0, 21, W, H - 21); }
  if (bf.ann) {  // l'annonce du combo : le mot jaillit en grand, puis se pose ; couleurs qui tournent pour les plus gros
    const A = bf.ann, age = 130 - A.t, big = A.tier >= 4 ? 24 : 16, sz = age < 4 ? big + 16 : age < 8 ? big + 8 : big, rb = ['#ffd84a', '#ff8a3a', '#ff6ad8', '#8ad8ff', '#7ee07a'];
    const col = A.tier >= 3 ? rb[(age >> 2) % 5] : A.tier ? '#ffd84a' : '#ffe8a0', y = 104 - Math.max(0, 8 - age) * 3;
    g.globalAlpha = Math.min(1, A.t / 25); pxFont(g, A.word, W / 2, y, col, sz, 'center');
    pxFont(g, A.combo + ' étages · ' + A.jumps + ' sauts', W / 2, y + 20, '#ffffff', 8, 'center'); pxFont(g, '+' + A.pts, W / 2, y + 34, '#ffd84a', 8, 'center'); g.globalAlpha = 1;
  }
  if (bf.achBan) { const a = Math.min(1, bf.achBan.t / 20); g.globalAlpha = a; px(g, '#120a0e', 10, H - 58, W - 20, 18); px(g, '#7ee07a', 10, H - 58, W - 20, 1); pxFont(g, bf.achBan.text, W / 2, H - 45, '#7ee07a', 8, 'center'); g.globalAlpha = 1; }
  if (bf.combo && bf.comboT) { pxFont(g, 'COMBO ' + bf.combo, W / 2, 40, bf.combo >= 12 ? '#ff8a3a' : '#ffd84a', bf.combo >= 12 ? 16 : 8, 'center'); px(g, '#3a2a32', W / 2 - 30, 46, 60, 2); px(g, '#ffd84a', W / 2 - 30, 46, Math.round(60 * bf.comboT / 180), 2); }
  if (bf.pop) pxFont(g, bf.pop.text, W / 2, 62 - Math.round((90 - Math.min(90, bf.pop.t)) / 6), '#ff8a3a', 8, 'center');
  if (bf.banner) { const a = Math.min(1, bf.banner.t / 20, (150 - bf.banner.t) / 15); g.globalAlpha = a; gameText(g, W, [[bf.banner.text, '#ffc85a', 8]], 110); g.globalAlpha = 1; }
  if (bf.count) pxFont(g, String(Math.ceil(bf.count / 60)), W / 2, 150, '#ffd84a', 24, 'center');
  if (bf.mode === 'play' && bf.started && !bf.count && bf.y - cam > H - 60 && (t >> 3) % 2) pxFont(g, 'MONTE !', W / 2, H - 14, '#ff4a3a', 16, 'center');
  if (bf.mode === 'ready') { const ci = BF_CH.indexOf(bf.ch); gameText(g, W, [['BEFFROI', '#ffc85a', 24], ['', '#ffffff'], ['← → : courir · Espace : sauter', '#ffffff'], ['Plus tu cours vite, plus tu sautes haut', '#b8b0c8'], ['', '#ffffff'], ['< ' + bf.ch.name + ' >', '#7ee07a'], [bf.ch.what, '#b8b0c8'],
    [(ci + 1) + ' / ' + BF_CH.length + (BF_CH.some((c, i) => !bfChOk(i)) ? '   prochain : record ' + BF_CH.find((c, i) => !bfChOk(i)).open : ''), '#8a7a99'], ['← → : personnage · Espace : partir', '#ffd84a'], ['Record ' + (games.best.beffroi || 0), '#ffd84a']], 80);
    hg.clearRect(0, 0, hc.width, hc.height); bfHero(hg, 6, 24, 0, 'idle', t); g.drawImage(hc, W / 2 - 24, 214, 48, 60); }
  if (bf.mode === 'pause') gameText(g, W, [['PAUSE', '#ffffff', 16], ['Espace : reprendre', '#b8b0c8']], 140);
  if (bf.mode === 'over' && bf.dead > 40) gameText(g, W, [['TOMBÉ !', '#ff8a3a', 16], ['', '#ffffff'], ['Étage ' + bf.best + ' · ' + bf.score + ' points', '#ffffff'], [bf.got + ' notes · ' + bf.rang + ' cloches', '#b8b0c8'], [bf.record ? 'NOUVEAU RECORD !' : 'Record ' + (games.best.beffroi || 0), '#ffd84a'], [bf.dead > 60 ? 'Espace : recommencer' : '', '#b8b0c8']], 120);
  if (t % 30 === 0) g.canvas.setAttribute('aria-label', 'Beffroi : ' + (bf.mode === 'play' ? 'étage ' + bf.best + ', ' + bf.score + ' points' : bf.mode === 'over' ? 'partie finie à l\'étage ' + bf.best : bf.mode === 'pause' ? 'pause' : 'prêt'));
}
// la manette : stick ou croix pour courir, A, B ou haut pour sauter, Start pour partir ou mettre en pause
function bfPad() {
  const p = navigator.getGamepads ? [...navigator.getGamepads()].find(Boolean) : null, b = i => !!p?.buttons[i]?.pressed;
  const x = p ? (Math.abs(p.axes[0]) > .35 ? Math.sign(p.axes[0]) : (b(15) ? 1 : 0) - (b(14) ? 1 : 0)) : 0, j = b(0) || b(1) || b(12), s = b(9), prev = bf.pad || {};
  bf.pad = {x, j, s};
  if (!view.classList.contains('on')) return;
  if (bf.mode !== 'play' && ((j && !prev.j) || (s && !prev.s))) bfStart();
  else if (bf.mode === 'play' && s && !prev.s) { bf.mode = 'pause'; bf.keys.clear(); }
}
function bfInfo() {
  $('bfStats').replaceChildren(...[['Meilleur score', games.best.beffroi || 0], ['Plus haut étage', bfs.top], ['Parties', bfs.games], ['Étages montés', bfs.floors], ['Combos', bfs.combos], ['Plus gros combo', bfs.bestCombo + ' étages'], ['Notes', bfs.notes], ['Cloches sonnées', bfs.bells]].flatMap(([a, b]) => [el('span', '', a), el('b', '', String(b))]));
  $('bfAch').replaceChildren(...BF_ACH.flatMap(([id, n, what]) => [el('span', '', (bfs.ach[id] ? '✓ ' : '· ') + n), el('b', '', what)]));
}
function bfPick(d) {  // le personnage suivant parmi ceux qui sont ouverts
  let i = BF_CH.indexOf(bf.ch); for (let k = 0; k < BF_CH.length; k++) { i = (i + d + BF_CH.length) % BF_CH.length; if (bfChOk(i)) break; }
  bf.ch = BF_CH[i]; bfs.ch = i; saveGames(); bfBeep(500 + i * 120, .06, 'triangle');
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
  if (bf.mode === 'ready' && ['ArrowLeft', 'ArrowRight', 'q', 'a', 'd'].includes(k)) { e.preventDefault(); if (!e.repeat) bfPick(k === 'ArrowLeft' || k === 'q' || k === 'a' ? -1 : 1); return; }
  if (BF_KEYS.includes(k) || k === 'Enter') { e.preventDefault(); if (bf.mode !== 'play') { if (!e.repeat && (k === ' ' || k === 'Enter' || bf.mode === 'ready')) bfStart(); if (k === ' ' || k === 'Enter') return; } if (k !== 'Enter') bf.keys.add(k); }
  if ((k === 'p' || k === 'Escape') && bf.mode === 'play') { bf.mode = 'pause'; bf.keys.clear(); }
});
document.addEventListener('keyup', e => { if (bf) bf.keys.delete(e.key.length === 1 ? e.key.toLowerCase() : e.key); });
// au doigt ou à la souris : appuyer à gauche / à droite fait courir, au milieu fait sauter
{ const cv = $('bfCanvas'), zone = e => { const r = cv.getBoundingClientRect(), x = (e.clientX - r.left) / r.width; return x < .35 ? 'ArrowLeft' : x > .65 ? 'ArrowRight' : ' '; };
  cv.onpointerdown = e => { e.preventDefault(); if (!bf || bfStart()) return; const z = zone(e); bf.ptr = z; bf.keys.add(z); try { cv.setPointerCapture(e.pointerId); } catch {} };
  cv.onpointerup = cv.onpointercancel = () => { if (bf?.ptr) { bf.keys.delete(bf.ptr); bf.ptr = null; } }; }
$('bfNew').onclick = () => { bfNew(); $('bfNew').blur(); };
$('bfFs').onclick = () => { $('bfCanvas').parentElement.requestFullscreen?.().catch(() => {}); $('bfFs').blur(); };
{  // vérification : un saut sur place passe un étage, un saut lancé à fond au moins 3 ; on se pose en descendant ; lâcher la touche raccourcit le saut ;
   // on peut encore sauter juste après avoir quitté une poutre ; une cloche relance vers le haut
  const keep = bf, kch = bfs.ch, kach = bfs.ach, kbc = bfs.bestCombo, kcb = bfs.combos, kbeep = bfBeep; bfBeep = () => {}; setTimeout(() => { bfBeep = kbeep; }, 1500); bfs.ch = 0; bf = null; bfNew();
  const h = v => (BF.J0 + v * BF.JV) ** 2 / (2 * BF.G);
  const jump = hold => { bfNew(); bf.mode = 'play'; bf.x = 60; bf.y = 0; bf.ground = bf.floors[0]; bf.cam = -250; bf.vx = 0; bf.keys.add(' '); bfUpdate(); if (!hold) bf.keys.clear(); let n = 0, up = 0; while (n++ < 200) { bfUpdate(); up = Math.max(up, -bf.y); if (bf.ground) break; } bf.keys.clear(); return {up, land: bf.ground?.n}; };
  const full = jump(true), tap = jump(false);
  bfNew(); bf.mode = 'play'; bf.ground = null; bf.coy = 3; bf.y = -5; bf.vy = 0; bf.keys.add(' '); bfUpdate(); const coyote = bf.vy < 0; bf.keys.clear();
  bfNew(); bf.mode = 'play'; bf.ground = null; bf.y = -100; bf.vy = 2; bf.x = 100; bf.bells = [{x: 106, y: -112, cd: 0, sw: 0, n: 2}]; bfUpdate(); const bell = bf.vy < -BF.J0;
  bfNew(); bf.mode = 'play'; bf.ch = BF_CH[2]; bf.ground = null; bf.coy = 0; bf.y = -60; bf.vy = 3; bf.jPrev = false; bf.keys.add(' '); bfUpdate(); const dbl = bf.vy < 0 && bf.dbl; bf.keys.clear(); bf.jPrev = false; bf.vy = 3; bf.keys.add(' '); bfUpdate(); const once = bf.vy > 0; bf.keys.clear();
  bfNew(); bf.mode = 'play'; bf.combo = 33; bf.comboN = 4; bfComboEnd(); const word = bf.ann?.word === 'INCROYABLE !' && bf.ann.pts === 1089; bfs.ach = {}; bf.combo = 52; bf.comboN = 3; bfComboEnd(); const ach = !!bfs.ach.combo && bf.ann.word === 'FABULEUX !';
  bfs.ch = kch; bfs.ach = kach; bfs.bestCombo = kbc; bfs.combos = kcb;
  const ok = h(0) > BF.FL + 4 && h(BF.VMAX) > 3 * BF.FL && full.land === 1 && full.up > BF.FL && tap.up < full.up - 10 && coyote && bell && dbl && once && word && ach;
  console.assert(ok, 'beffroi', {h0: h(0), hmax: h(BF.VMAX), full, tap, coyote, bell});
  view.dataset.selfcheck = ok ? 'ok' : JSON.stringify({full, tap, coyote, bell, dbl, once, word, ach});
  bf = keep;
}
ctx.onOpen(() => {
  if (!bf || !bf.g) { bfNew(); bf.g = $('bfCanvas').getContext('2d'); bf.hc = el('canvas'); bf.hc.width = 24; bf.hc.height = 30; }
  $('bfCanvas').__bf = {st: () => bf, s: () => bfs, gen: bfGen, upd: bfUpdate, comboEnd: bfComboEnd, pick: bfPick,
    warp: n => { bfGen(n + 40); const f = bf.floors[n]; bf.mode = 'play'; bf.x = f.x + f.w / 2 - 6; bf.y = bfFloorY(n); bf.vy = 0; bf.vx = 0; bf.ground = f; bf.last = n; bf.best = Math.max(bf.best, n); bf.cam = bf.y - BF.H * .55; bf.zi = bfZi(n); bf.started = n >= 5; bf.count = 0; return 0; }};
  gameLoop(bf, 'beffroi', bfUpdate, bfDraw); bfInfo();
});
}
