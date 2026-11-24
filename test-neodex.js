// lancé par le test « local » de NeoDex : vérification interne, une vraie montée au clavier, le compte à rebours, chaque zone du clocher en capture,
// une cloche, une note, un oiseau, une poutre qui casse, une poutre qui bouge, la chute, la mise en page et le plein écran
module.exports = async ({ pj, sleep }) => {
  const B = `document.getElementById('bfCanvas').__bf`;
  const key = (type, k) => pj(`document.dispatchEvent(new KeyboardEvent('${type}', {key: '${k}', bubbles: true})), 0`);
  const S = expr => pj(`(() => { const b = ${B}.st(), s = ${B}.s(); return ${expr}; })()`);
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('bfCanvas').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'beffroi-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  const sc = await pj(`document.querySelector('[data-selfcheck]')?.dataset.selfcheck`); if (sc !== 'ok') throw new Error('vérification interne : ' + sc);
  await sleep(500); await shot('0-depart');
  await key('keydown', ' '); await key('keyup', ' '); await key('keydown', 'ArrowRight');
  for (let i = 0; i < 12 && await S('b.best') < 3; i++) { await sleep(450); await key('keydown', ' '); await sleep(250); await key('keyup', ' '); if (i === 2) await shot('1-saut'); }
  await key('keyup', 'ArrowRight');
  const climbed = await S('b.best'); if (climbed < 2) throw new Error('la montée au clavier ne marche pas : étage ' + climbed);
  await S(`${B}.warp(4)`); await S(`(() => { const f = b.floors[5]; b.started = false; b.x = f.x + f.w / 2 - 6; b.y = -5 * 48 - 3; b.ground = null; b.vy = 1; return 0; })()`); await sleep(300); await shot('1-compte'); if (!(await S('b.count') > 0)) throw new Error('pas de compte à rebours au 5e étage');
  for (const [n, name] of [[13, 'charpente'], [31, 'cloches'], [55, 'horloge'], [80, 'vitraux'], [112, 'sommet']]) { await S(`${B}.warp(${n})`); await sleep(500); await shot('2-' + name); }
  // une cloche : on se place juste dessous, en l'air
  const bells0 = await S('s.bells');
  await S(`(() => { const c = b.bells.find(c => c.n >= 30); b.x = c.x - 6; b.y = c.y + 22; b.ground = null; b.vy = 1; b.cam = b.y - 200; return 0; })()`); await sleep(200); await shot('3-cloche');
  if (!(await S('s.bells') > bells0)) throw new Error('la cloche ne fait pas rebondir');
  await S(`(() => { const nt = b.notes.find(n => !n.got && n.n > 20); b.x = nt.x - 6; b.y = nt.y + 9; b.ground = null; b.vy = 0; b.cam = b.y - 200; return 0; })()`); await sleep(150);
  if (!(await S('b.got') >= 1)) throw new Error('la note ne se ramasse pas');
  await S(`${B}.warp(40)`); await S(`(b.birds.push({x: b.x + 6, y: b.y - 9, vx: 1, ph: 0, bat: false}), 0)`); await sleep(150);
  if (!(await S('b.hurt') > 0)) throw new Error('l\'oiseau ne gêne pas');
  const br = await S(`b.floors.findIndex(f => f.type === 'break' && f.n > 20)`); await S(`${B}.warp(${br})`); await S(`(b.ground = null, b.y -= 3, 0)`); await sleep(1200);
  if (!(await S(`!!b.floors[${br}].gone`))) throw new Error('la poutre fissurée ne casse pas');
  const mv = await S(`b.floors.findIndex(f => f.type === 'move' && f.amp > 4)`), x0 = await S(`b.floors[${mv}].x`); await sleep(500);
  if (Math.abs(await S(`b.floors[${mv}].x`) - x0) < .5) throw new Error('la poutre mobile ne bouge pas');
  await S(`(b.y = b.cam + 400, 0)`); await sleep(1500); await shot('4-fin');
  if (await S('b.mode') !== 'over' || await S('s.games') < 1) throw new Error('la chute ne finit pas la partie');
  // 1.2.0 : choisir un personnage, l'annonce d'un gros combo, l'acrobate et son second saut
  await pj(`document.getElementById('bfNew').click(), 0`); await S('(s.top = 70, 0)'); await sleep(200); await key('keydown', 'ArrowRight'); await key('keyup', 'ArrowRight'); await sleep(300);
  const ch = await S('b.ch.name'); if (ch !== 'La funambule') throw new Error('← → devait changer de personnage : ' + ch); await shot('5-personnage');
  await key('keydown', 'ArrowRight'); await key('keyup', 'ArrowRight'); await key('keydown', ' '); await key('keyup', ' '); await sleep(200);
  await S(`${B}.warp(30)`); await S(`(() => { b.combo = 34; b.comboN = 5; ${B}.comboEnd(); return 0; })()`); await sleep(250); await shot('6-combo');
  const ann = await S('b.ann && b.ann.word'); if (ann !== 'INCROYABLE !') throw new Error('le gros combo devait être annoncé : ' + ann);
  const dbl = await S(`(() => { b.ann = null; b.ground = null; b.coy = 0; b.y -= 20; b.vy = 2; return b.ch.dbl ? 1 : 0; })()`); await key('keydown', ' '); await sleep(60); await key('keyup', ' ');
  if (!dbl || !(await S('b.dbl'))) throw new Error('l’acrobate devait sauter une seconde fois en l’air');
  await sleep(200); await shot('7-acrobate');
  const lay = await pj(`(() => { const c = document.getElementById('bfCanvas').getBoundingClientRect(), s = document.querySelector('.gSide').getBoundingClientRect(); return { beside: s.left >= c.right - 1, fits: document.documentElement.scrollWidth <= innerWidth + 1, w: innerWidth }; })()`);
  if (!lay.fits || (lay.w >= 700 && !lay.beside)) throw new Error('mise en page : ' + JSON.stringify(lay));
  await pj(`document.getElementById('bfFs').click(), 0`); await sleep(700);
  const fs = await pj(`(() => { const c = document.getElementById('bfCanvas'); return document.fullscreenElement === c.parentElement && Math.abs(c.getBoundingClientRect().height - innerHeight) < 3; })()`);
  await pj(`document.fullscreenElement && document.exitFullscreen(), 0`); await sleep(300);
  if (!fs) throw new Error('le plein écran ne remplit pas la hauteur');
  { // la zone de jeu tient dans la fenêtre, quelle que soit sa taille
    const L = await pj(`(() => { const c = [...document.querySelectorAll('.gameBox canvas')].filter(c => c.offsetWidth).sort((a, b) => b.offsetWidth - a.offsetWidth)[0], r = c.getBoundingClientRect(); let s = 0; for (let e = c.parentElement; e; e = e.parentElement) s += e.scrollTop; return { top: Math.round(r.top + s), bottom: Math.round(r.bottom + s), h: Math.round(r.height), w: Math.round(r.width), wh: innerHeight, ww: innerWidth, sw: document.documentElement.scrollWidth }; })()`);
    if (process.env.NEO_FIT_LOG) console.log('FIT', JSON.stringify(L));
    if (L.bottom > L.wh + 1 || L.sw > L.ww + 1) throw new Error('la zone de jeu dépasse la fenêtre : ' + JSON.stringify(L));
  }
  return 'montée au clavier : étage ' + climbed + ' · personnages · annonce des combos · second saut · cloche, note, oiseau, poutres · fenêtre ' + lay.w + ' px';
};
