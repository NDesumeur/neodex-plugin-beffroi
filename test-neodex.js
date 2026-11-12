// lancé par le test « local » de NeoDex : part, court, saute et vérifie qu'on a gagné au moins un étage
// (avec NEO_SHOTS : garde des images du jeu, sans la teinte du thème)
module.exports = async ({ pj, sleep }) => {
  const key = (type, k) => pj(`document.dispatchEvent(new KeyboardEvent('${type}', {key: '${k}', bubbles: true})), 0`);
  const label = () => pj(`document.getElementById('bfCanvas').getAttribute('aria-label')`);
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('bfCanvas').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'beffroi-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  await shot('0-depart');
  await key('keydown', ' '); await key('keyup', ' ');  // partir
  await key('keydown', 'ArrowRight');
  for (let i = 0; i < (process.env.NEO_SHOTS ? 8 : 3); i++) {  // courir contre les murs et sauter
    await sleep(500); await key('keydown', ' '); await sleep(60); await key('keyup', ' ');
    if (i === 1) await shot('1-saut'); if (i === 5) await shot('2-haut');
  }
  await sleep(1200);
  const first = await label();
  if (process.env.NEO_SHOTS) { await key('keyup', 'ArrowRight'); await sleep(14000); await shot('3-fin'); }
  const n = +(/étage (\d+)/.exec(first) || [])[1];
  if (!(n >= 1)) throw new Error('pas d\'étage gagné : « ' + first + ' »');
  return first;
};
