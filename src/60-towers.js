
const G = {
  B: null, t: 0, gold: 0, lives: 20, maxLives: 20, wave: 0, slain: 0, level: 0, run: 1,
  towers: [], mons: [], men: [], arrows: [], shells: [], stuck: [], hbars: [], phase: 'play',
};
const TOWER = {
  guard: { name: 'Kenny', short: 'Kenny', face: 'kenny', cost: [80, 90, 150], range: [3.4, 3.7, 4.0], n: [2, 3, 3], hp: [62, 90, 135], dmg: [7, 10, 15], rate: [7, 6, 5], air: false, ground: true, light: [55, 70, 90], desc: ['Kennys with wooden sticks', 'block and whack on the road.'] },
  archer: { name: 'Dzakes', short: 'Dzakes', face: 'dzakes', cost: [70, 90, 140], range: [6.2, 6.8, 7.4], dmg: [9, 11, 14], rate: [.85, .78, .7], n: [1, 2, 3], air: true, ground: true, light: [80, 105, 140], desc: ['Throws nuts. Fast and accurate.', 'Can hit flyers.'] },
  spire: { name: 'Mates', short: 'Mates', face: 'mates', cost: [110, 120, 180], range: [5.0, 5.6, 6.2], rate: [1.1, 1.0, .9], slow: [.4, .48, .56], slowT: [1.5, 1.6, 1.7], air: true, ground: true, light: [45, 60, 80], desc: ['Plays gamelan music.', 'Slows everyone in range.'] },
  coder: { name: 'Kouc', short: 'Kouc', face: 'kouc', cost: [60, 80, 120], range: [0, 0, 0], income: [0, 10, 50], every: [0, 10, 30], air: false, ground: false, light: [30, 40, 50], desc: ['Writes code. No effect at first.', 'Upgrade him to earn coins.'] },
  bombard: { name: 'Vojta', short: 'Vojta', face: 'vojta', cost: [120, 130, 190], range: [7.4, 8.0, 8.6], minRange: 2.3, dmg: [36, 60, 98], splash: [1.55, 1.8, 2.1], rate: [2.9, 2.7, 2.5], air: false, ground: true, light: [50, 62, 80], desc: ['Lobs sausages that burst.', 'Ground targets only.'] },
};
const TOWER_KINDS = ['guard', 'archer', 'spire', 'coder', 'bombard'];

function blueprint(kind, lvl) {
  const pieces = [], mounts = {};
  const piece = (id, order, fn) => {
    const S = new Soup(); fn(S); if (!S.verts) return; let minY = 1e9; for (let i = 1; i < S.P.length; i += 3) minY = Math.min(minY, S.P[i]);
    for (let i = 1; i < S.P.length; i += 3) S.P[i] -= minY; pieces.push({ id, order, y: minY, soup: S });
  };
  const w = COL.wood, wd = COL.woodD, wl = COL.woodL, st = COL.stone, sdk = COL.stoneD, sl = COL.stoneL, iron = COL.iron, rng = soupRng;
  const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  const brazier = (S, x, y, z, bs) => {
    for (let k = 0; k < 3; k++) { const a = k * TAU / 3 + .5; S.seg([x + Math.cos(a) * bs * .42, y, z + Math.sin(a) * bs * .42], [x + Math.cos(a) * bs * .2, y + bs * .5, z + Math.sin(a) * bs * .2], .028, .028, iron, { l: L_METAL, n: 4 }); }
    S.cyl(bs * .3, bs * .22, x, y + bs * .56, z, iron, { n: 8, l: L_METAL, rt: 1.5, rough: .6 });
    S.cyl(bs * .4, .04, x, y + bs * .68, z, COL.ember, { n: 8, emis: .55, jit: 0 });
  };
  if (kind === 'archer') {
    const bH = [.25, 1.0, 1.9][lvl], H = [2.0, 2.7, 3.35][lvl], W = [.75, .85, .93][lvl], bs = [.5, .62, .8][lvl];
    piece('base', 0, S => {
      if (lvl === 0) { S.box(1.6, .25, 1.6, 0, .125, 0, sdk, { l: L_MASON }); for (const [a, b] of corners) S.box(.3, .32, .3, a * .66, .16, b * .66, sl, { l: L_MASON }); }
      else {
        S.box(1.8, .3, 1.8, 0, .15, 0, sdk, { l: L_MASON });
        S.cyl(1.02, bH - .3, 0, .3 + (bH - .3) / 2, 0, st, { n: 4, l: L_MASON, rt: .9, r: [0, PI / 4, 0] });
        S.box(1.42, .14, 1.42, 0, bH - .04, 0, sl, { l: L_MASON });
        S.box(.3, .5, .06, 0, .56, .71, COL.black, { jit: 0 });
        if (lvl === 2) { for (const [a, b] of corners) for (let q = 0; q < 3; q++) S.box(.22, .2, .22, a * (.7 - q * .025), .5 + q * .5, b * (.7 - q * .025), sl, { l: L_MASON }); for (const sg of [-1, 1]) S.box(.06, .5, .12, sg * .7, 1.1, 0, COL.black, { jit: 0 }); }
      }
    });
    piece('posts', 1, S => {
      for (const [a, b] of corners) S.seg([a * .62, bH, b * .62], [a * (W - .1), H, b * (W - .1)], .085, .075, wd, { l: L_WOOD });
      const ym = (bH + H) / 2, r = lerp(.62, W - .1, .5);
      for (let k = 0; k < 4; k++) { const [a, b] = corners[k], [c, d] = corners[(k + 1) % 4]; S.seg([a * r, ym, b * r], [c * r, ym, d * r], .05, .05, w, { l: L_WOOD, n: 4 }); }
    });
    piece('brace', 2, S => {
      for (let k = 0; k < 4; k++) { const [a, b] = corners[k], [c, d] = corners[(k + 1) % 4]; S.seg([a * .62, bH + .1, b * .62], [c * (W - .12), H - .15, d * (W - .12)], .035, .035, w, { l: L_WOOD, n: 4 }); S.seg([c * .62, bH + .1, d * .62], [a * (W - .12), H - .15, b * (W - .12)], .035, .035, wl, { l: L_WOOD, n: 4 }); }
    });
    piece('deck', 3, S => {
      S.box(W * 2 + .16, .1, W * 2 + .16, 0, H + .05, 0, w, { l: L_WOOD }); for (const sg of [-1, 1]) S.box(W * 2 + .3, .09, .1, 0, H - .04, sg * (W - .1), wd, { l: L_WOOD });
      for (const sg of [-1, 1]) S.box(.1, .09, W * 2 + .3, sg * (W - .1), H - .04, 0, wd, { l: L_WOOD });
      if (lvl >= 1) for (const [a, b] of corners) S.seg([a * (W - .1), H - .55, b * (W - .1)], [a * (W + .06), H - .02, b * (W + .06)], .04, .04, wd, { l: L_WOOD, n: 4 });
    });
    piece('rail', 4, S => {
      const y0 = H + .1;
      for (let k = 0; k < 4; k++) {
        const ang = k * HPI, cs = Math.cos(ang), sn = Math.sin(ang);
        for (let j = 0; j < 5; j++) {
          if (k === 2 && (j === 1 || j === 2)) continue;
          const u = (j - 2) * W * .42, hh = (j & 1) ? .34 : .5, x = u * cs + (W + .02) * sn, z = -u * sn + (W + .02) * cs;
          S.box(W * .4, hh, .06, x, y0 + hh / 2, z, (j & 1) ? w : wl, { l: L_WOOD, r: [0, ang, 0] });
        }
      }
      for (const [a, b] of corners) S.box(.1, .66, .1, a * (W + .02), y0 + .33, b * (W + .02), wd, { l: L_WOOD });
      if (lvl >= 1) for (const u of lvl === 2 ? [-.5, 0, .5] : [-.35, .35]) { S.cyl(.2, .04, u, y0 + .22, W + .08, lvl === 2 ? COL.ironL : COL.clothB, { n: 8, r: [HPI, 0, 0], l: lvl === 2 ? L_METAL : L_WOOD }); S.sph(.05, u, y0 + .22, W + .11, COL.ironL, { l: L_METAL, w: 5, h: 3, smooth: false }); }
      if (lvl === 2) for (const sg of [-1, 1]) S.cyl(.2, .04, sg * (W + .08), y0 + .22, .1, COL.clothR, { n: 8, r: [0, 0, HPI], l: L_WOOD });
    });
    piece('ladder', 5, S => {
      for (const sg of [-1, 1]) S.seg([sg * .17, 0, -W - .5], [sg * .17, H + .15, -W - .06], .035, .035, wd, { l: L_WOOD, n: 4 });
      for (let y = .3; y < H; y += .34) { const u = y / (H + .15); S.box(.36, .04, .05, 0, y, lerp(-W - .5, -W - .06, u), wl, { l: L_WOOD }); }
    });
    const bx = -W + .34, bz = -W + .36, by = H + .1 + (lvl === 2 ? .35 : 0);
    piece('brazier', 6, S => { if (lvl === 2) S.cyl(.2, .38, bx, H + .29, bz, sdk, { n: 6, l: L_MASON }); brazier(S, bx, by, bz, bs); });
    if (lvl >= 1) piece('flag', 7, S => { S.seg([W - .08, H + .1, -W + .08], [W - .08, H + 1.75, -W + .08], .035, .025, wd, { l: L_WOOD, n: 4 }); const T = new Soup(); clothPanel(T, { x0: 0, x1: .62, yTop: 0, len: .36, z: 0, col: COL.clothR, rng, nx: 3, ny: 2, rag: 0, sway: 1.2 }); S.merge(T, { p: [W - .06, H + 1.7, -W + .08], ao: null }); });
    mounts.flame = [bx, by + bs * .7, bz]; mounts.flameSize = bs; mounts.top = H + 1.7;
    mounts.archers = [[[.12, H + .1, .28]], [[-.3, H + .1, .42], [.42, H + .1, .1]], [[-.35, H + .1, .5], [.5, H + .1, .3], [.25, H + .1, -.4]]][lvl];
  } else if (kind === 'bombard') {
    const Rr = [1.0, 1.08, 1.15][lvl], H = [1.1, 1.5, 1.9][lvl];
    piece('plinth', 0, S => { S.cyl(Rr + .22, .26, 0, .13, 0, sdk, { n: 10, l: L_MASON }); if (lvl === 2) S.cyl(Rr + .12, .2, 0, .36, 0, st, { n: 10, l: L_MASON }); });
    piece('drum', 1, S => {
      S.cyl(Rr, H, 0, H / 2, 0, st, { n: 10, l: L_MASON, rt: .93, jit: .03 });
      for (let c = 0; c < 2 + lvl; c++) S.cyl(Rr * (1 - .05 * (.5 + c) / (2 + lvl)) + .012, .16, 0, .35 + c * (H - .5) / (1.5 + lvl), 0, mixC(sdk, sl, rng()), { n: 10, l: L_MASON });
      S.box(.34, .55, .1, 0, .3, Rr * .97, COL.black, { jit: 0 });
    });
    if (lvl >= 1) piece('butt', 2, S => { for (let k = 0; k < 4; k++) { const a = k * HPI + PI / 4; S.box(.36, H * .8, .5, Math.cos(a) * (Rr + .06), H * .36, Math.sin(a) * (Rr + .06), sdk, { l: L_MASON, r: [0, -a + HPI, 0] }); S.box(.4, .12, .56, Math.cos(a) * (Rr + .06), H * .78, Math.sin(a) * (Rr + .06), sl, { l: L_MASON, r: [0, -a + HPI, 0] }); } });
    if (lvl >= 1) piece('bands', 3, S => { for (const y of lvl === 2 ? [H * .45, H * .8] : [H * .65]) S.cyl(Rr * .965 + .02, .07, 0, y, 0, iron, { n: 10, l: L_METAL, rough: .55 }); });
    piece('deck', 4, S => { S.cyl(Rr * .93 + .14, .16, 0, H + .02, 0, sl, { n: 10, l: L_MASON }); S.cyl(Rr * .8, .06, 0, H + .12, 0, w, { n: 10, l: L_WOOD }); });
    piece('rim', 5, S => { for (let k = 0; k < 10; k++) { if (k % 5 === 0) continue; const a = (k + .5) / 10 * TAU + HPI; S.box(.46, .34, .22, Math.cos(a) * Rr * .96, H + .27, Math.sin(a) * Rr * .96, lvl === 2 && (k & 1) ? iron : mixC(sdk, sl, rng()), { l: lvl === 2 && (k & 1) ? L_METAL : L_MASON, r: [0, -a + HPI, 0] }); } });
    piece('grill', 6, S => {
      const gx = -.42, gz = -.42, gy = H + .12, sk = C(0xa0442a);
      for (const [a, b] of corners) S.seg([gx + a * .17, gy, gz + b * .1], [gx + a * .2, gy + .42, gz + b * .13], .018, .018, iron, { l: L_METAL, n: 4 });
      S.box(.46, .1, .3, gx, gy + .46, gz, mulC(iron, .7), { l: L_METAL }); S.box(.4, .02, .24, gx, gy + .52, gz, COL.ember, { emis: .7, jit: 0 });
      for (let i = 0; i < 4; i++) { S.cyl(.03, .26, gx - .15 + i * .1, gy + .56, gz, sk, { n: 6, r: [HPI, 0, 0] }); }
      PROP.barrel(S, .45, H + .13, -.5, .75, rng);
    });
    const lx = -Rr * .78, lz = .2, lh = H + 1.25 + lvl * .12;
    piece('lantern', 7, S => {
      for (const sg of lvl === 2 ? [-1, 1] : [1]) {
        const x = lx * sg;
        S.seg([x, H + .1, lz], [x, lh, lz], .04, .035, iron, { l: L_METAL, n: 4 }); S.seg([x, lh, lz], [x - sg * -.0, lh, lz + .32], .03, .03, iron, { l: L_METAL, n: 4 });
        S.box(.2, .05, .2, x, lh - .08, lz + .32, iron, { l: L_METAL }); S.box(.16, .2, .16, x, lh - .22, lz + .32, COL.ember, { emis: .8, jit: 0 }); S.box(.2, .04, .2, x, lh - .34, lz + .32, iron, { l: L_METAL });
        for (const [a, b] of corners) S.box(.025, .22, .025, x + a * .09, lh - .22, lz + .32 + b * .09, iron, { l: L_METAL });
      }
    });
    mounts.flame = [lx, lh - .3, lz + .32]; mounts.flameSize = .26 + lvl * .05; mounts.flame2 = lvl === 2 ? [-lx, lh - .3, lz + .32] : null; mounts.top = H + 1.6;
    mounts.man = [.1, H + .14, .15];
  } else if (kind === 'spire') {
    const bronze = COL.bronze, red = C(0x8a2a1e), H = [2.1, 2.3, 2.5][lvl], P = .82, gold = mulC(COL.gold, .8);
    piece('plinth', 0, S => { S.box(1.9, .24, 1.9, 0, .12, 0, sdk, { l: L_MASON }); S.box(1.7, .08, 1.7, 0, .28, 0, w, { l: L_WOOD }); if (lvl >= 1) for (const [a, b] of corners) S.box(.24, .34, .24, a * .86, .17, b * .86, sl, { l: L_MASON }); });
    piece('posts', 1, S => { for (const [a, b] of corners) { S.seg([a * P, .3, b * P], [a * P, H, b * P], .07, .06, red, { l: L_WOOD, n: 6 }); S.cyl(.1, .08, a * P, H - .06, b * P, gold, { n: 6, l: L_METAL }); } });
    piece('roof', 2, S => {
      for (let k = 0; k < 4; k++) { const [a, b] = corners[k], [c, d] = corners[(k + 1) % 4]; S.seg([a * (P + .12), H, b * (P + .12)], [c * (P + .12), H, d * (P + .12)], .06, .06, red, { l: L_WOOD, n: 4 }); }
      for (const [a, b] of corners) S.cone(.08, [.25, .35, .45][lvl], a * P, H + .08 + [.25, .35, .45][lvl] / 2, b * P, gold, { n: 6, l: L_METAL });
      if (lvl >= 1) for (const sg of [-1, 1]) { const T = new Soup(); clothPanel(T, { x0: 0, x1: P * 2 - .2, yTop: 0, len: .22, z: 0, col: C(0xc89a2a), rng, nx: 4, ny: 2, rag: 0, sway: 1 }); S.merge(T, { p: [-P + .1, H - .03, sg * (P + .1)], ao: null }); }
    });
    piece('gongframe', 3, S => {
      const z = -.55; for (const sg of [-1, 1]) { S.seg([sg * .55, .3, z], [sg * .55, 1.75, z], .045, .04, wd, { l: L_WOOD, n: 4 }); S.box(.18, .1, .3, sg * .55, .35, z, wd, { l: L_WOOD }); }
      S.box(1.3, .09, .09, 0, 1.72, z, red, { l: L_WOOD }); for (const sg of [-1, 1]) S.cone(.06, .18, sg * .68, 1.8, z, gold, { n: 4, l: L_METAL });
      const gs = lvl === 2 ? [[-.27, .27], [.27, .22]] : [[0, .36]];
      for (const [gx, gr] of gs) { S.seg([gx, 1.68, z], [gx, 1.6 - gr * 2 + .2, z], .008, .008, COL.black, { n: 3, jit: 0 }); S.cyl(gr, .05, gx, 1.6 - gr, z, bronze, { n: 12, l: L_METAL, r: [HPI, 0, 0], rough: .35 }); S.sph(gr * .28, gx, 1.6 - gr, z + .04, gold, { l: L_METAL, w: 7, h: 4 }); }
    });
    piece('bonang', 4, S => {
      const z = .5, n = [4, 5, 6][lvl], len = n * .21;
      for (const sg of [-1, 1]) S.box(len + .1, .06, .06, 0, .62, z + sg * .1, wd, { l: L_WOOD });
      for (const [a, b] of corners) S.box(.06, .34, .06, a * (len / 2 + .02), .45, z + b * .1, wd, { l: L_WOOD });
      for (let r = 0; r < 2; r++) for (let i = 0; i < n; i++) { const x = -len / 2 + .105 + i * .21, zz = z + (r ? .1 : -.1); S.cyl(.075, .07, x, .68, zz, bronze, { n: 8, l: L_METAL, rough: .35 }); S.sph(.035, x, .73, zz, gold, { l: L_METAL, w: 6, h: 3 }); }
    });
    const lx = P - .05, lz = P - .05;
    piece('lantern', 5, S => { S.seg([lx, H - .05, lz], [lx, H - .35, lz], .01, .01, COL.black, { n: 3, jit: 0 }); S.box(.18, .22, .18, lx, H - .47, lz, COL.ember, { emis: .8, jit: 0 }); S.box(.22, .04, .22, lx, H - .34, lz, red, { l: L_WOOD }); });
    mounts.flame = [lx, H - .5, lz]; mounts.flameSize = .22 + lvl * .04; mounts.top = H + .6; mounts.man = [0, .32, 0]; mounts.gong = [0, 1.3, -.55];
  } else if (kind === 'coder') {
    const scr = C(0x50ff80), plast = C(0x2a2c30), H = .3;
    piece('floor', 0, S => { S.box(1.7, .2, 1.5, 0, .1, 0, sdk, { l: L_MASON }); S.box(1.3, .06, 1.1, 0, .23, 0, C(0x5a4636), { l: L_PLAIN }); });
    piece('desk', 1, S => { S.box(1.25, .06, .55, 0, H + .72, -.25, wl, { l: L_WOOD }); for (const [a, b] of corners) S.box(.06, .7, .06, a * .56, H + .36, -.25 + b * .22, wd, { l: L_WOOD }); });
    piece('chair', 2, S => { S.box(.4, .06, .4, 0, H + .45, .38, plast, {}); S.box(.4, .45, .06, 0, H + .7, .58, plast, {}); S.seg([0, H, .38], [0, H + .45, .38], .03, .03, iron, { l: L_METAL, n: 4 }); for (let k = 0; k < 5; k++) { const a2 = k * TAU / 5; S.seg([0, H + .03, .38], [Math.cos(a2) * .2, H + .03, .38 + Math.sin(a2) * .2], .015, .015, iron, { l: L_METAL, n: 3 }); } });
    piece('screens', 3, S => {
      const xs = [[0], [-.3, .3], [-.42, 0, .42]][lvl];
      for (const x of xs) { const ry = -x * .5; S.box(.4, .27, .03, x, H + 1.05, -.38, plast, { r: [0, ry, 0] }); S.box(.35, .22, .01, x - Math.sin(ry) * .02, H + 1.05, -.36, scr, { emis: .9, jit: 0, r: [0, ry, 0] }); S.box(.04, .2, .04, x, H + .85, -.4, plast, {}); S.box(.16, .02, .1, x, H + .76, -.4, plast, {}); }
      S.box(.42, .02, .13, 0, H + .76, -.12, plast, {}); S.cyl(.04, .09, .45, H + .8, -.1, C(0xd8d0c0), { n: 6 });
    });
    if (lvl >= 1) piece('rack', 4, S => { S.box(.4, 1.2, .4, -.6, H + .6, .2 - .45, plast, {}); for (let i = 0; i < 6; i++) S.box(.04, .02, .01, -.5, H + .2 + i * .17, .2 - .24, i % 2 ? C(0xff5030) : scr, { emis: .9, jit: 0 }); });
    if (lvl === 2) piece('plant', 5, S => { S.cyl(.1, .16, .6, H + .82, -.3, C(0xa05030), { n: 6 }); S.ico(.14, .6, H + 1.0, -.3, C(0x3a6a2a), { d: 1 }); });
    mounts.flame = null; mounts.lightAt = [0, H + 1.1, -.2]; mounts.lightCol = [.3, 1, .45]; mounts.top = 2.2; mounts.man = [0, H + .02, .2];
  } else {
    const W = [1.5, 1.7, 1.9][lvl], D = [1.3, 1.4, 1.5][lvl], wh = [1.05, 1.25, 1.5][lvl], stoneWalls = lvl === 2;
    piece('floor', 0, S => { S.box(W + .5, .16, D + .7, 0, .08, .1, sdk, { l: L_MASON }); S.box(.7, .1, .4, 0, .05, D / 2 + .55, st, { l: L_MASON }); });
    piece('walls', 1, S => {
      const wc = stoneWalls ? st : C(0x8f8468), wlay = stoneWalls ? L_MASON : L_PLAIN;
      if (lvl === 1) S.box(W + .04, .5, D + .04, 0, .41, 0, st, { l: L_MASON });
      S.box(W, wh, D, 0, .16 + wh / 2, 0, wc, { l: wlay, jit: .03 });
      if (!stoneWalls) { for (const [a, b] of corners) S.box(.12, wh + .04, .12, a * W / 2, .16 + wh / 2, b * D / 2, wd, { l: L_WOOD }); for (const sg of [-1, 1]) { S.box(W, .1, .08, 0, .16 + wh * .55, sg * D / 2, wd, { l: L_WOOD }); S.seg([sg * W * .5, .2, D / 2 + .01], [sg * W * .22, .16 + wh, D / 2 + .01], .04, .04, wd, { l: L_WOOD, n: 4 }); } S.box(.08, .1, D, W / 2, .16 + wh * .55, 0, wd, { l: L_WOOD }); S.box(.08, .1, D, -W / 2, .16 + wh * .55, 0, wd, { l: L_WOOD }); }
      S.box(.5, .82, .12, 0, .57, D / 2, COL.black, { jit: 0 }); S.box(.66, .1, .16, 0, 1.02, D / 2 + .02, wd, { l: L_WOOD }); for (const sg of [-1, 1]) S.box(.09, .86, .16, sg * .29, .59, D / 2 + .02, wd, { l: L_WOOD });
      S.box(.24, .24, .08, W * .32, .16 + wh * .62, D / 2 + .01, COL.black, { jit: 0 }); S.box(.08, .3, .3, W / 2 + .01, .16 + wh * .6, 0, COL.black, { jit: 0 });
    });
    piece('roof', 2, S => {
      const rl = lvl === 0 ? L_THATCH : L_SLATE, rc = lvl === 0 ? COL.thatch : COL.slate, y0 = .16 + wh, rh = [.75, .85, .9][lvl], sl2 = Math.atan2(rh, D / 2 + .2), len = Math.hypot(rh, D / 2 + .2) + .12;
      for (const sg of [-1, 1]) S.box(W + .36, .09, len, 0, y0 + rh / 2 - .02, sg * (D / 4 + .1), rc, { l: rl, r: [sg * sl2, 0, 0] });
      for (const sg of [-1, 1]) { const T = [[sg * W / 2, y0, -D / 2], [sg * W / 2, y0, D / 2], [sg * W / 2, y0 + rh, 0]]; const gc = stoneWalls ? st : C(0x8f8468); if (sg > 0) S.tri(T[0], T[2], T[1], gc, stoneWalls ? L_MASON : L_PLAIN, .95); else S.tri(T[0], T[1], T[2], gc, stoneWalls ? L_MASON : L_PLAIN, .95); }
      S.box(W + .44, .1, .14, 0, y0 + rh + .02, 0, wd, { l: L_WOOD });
      S.box(.26, .5, .26, -W * .3, y0 + rh * .7 + .1, -D * .2, sdk, { l: L_MASON });
    });
    piece('rack', 3, S => { const x = -W / 2 - .28; S.box(.06, .7, .06, x, .5, -.3, wd, { l: L_WOOD }); S.box(.06, .7, .06, x, .5, .3, wd, { l: L_WOOD }); S.box(.05, .05, .7, x, .78, 0, w, { l: L_WOOD }); for (const z of [-.2, 0, .2]) { S.seg([x + .06, .12, z], [x - .04, 1.5, z], .018, .018, wl, { l: L_WOOD, n: 4 }); S.cone(.035, .14, x - .045, 1.56, z, COL.steel, { n: 4, l: L_METAL }); } if (lvl >= 1) { S.cyl(.2, .04, W / 2 + .03, .75, -.25, COL.clothB, { n: 8, r: [0, 0, HPI], l: L_WOOD }); } });
    if (lvl === 2) piece('turret', 4, S => { const x = W / 2 - .2, z = -D / 2 + .2, th = 2.7; S.box(.8, th, .8, x, th / 2 + .16, z, st, { l: L_MASON }); S.box(.94, .16, .94, x, th + .2, z, sl, { l: L_MASON }); for (const [a, b] of corners) S.box(.24, .26, .24, x + a * .35, th + .4, z + b * .35, mixC(sdk, sl, rng()), { l: L_MASON }); S.box(.1, .4, .06, x, th * .7, z + .41, COL.black, { jit: 0 }); });
    const fx = W / 2 + .12, fz = D / 2 + .5, bs = [.34, .46, .6][lvl];
    piece('fire', 5, S => { if (lvl === 0) { S.seg([fx, 0, fz], [fx, 1.05, fz], .04, .035, wd, { l: L_WOOD, n: 4 }); S.cyl(.07, .12, fx, 1.1, fz, iron, { n: 6, l: L_METAL, rt: 1.4 }); } else brazier(S, fx, .08, fz, bs + .1); });
    piece('flag', 6, S => { const x = lvl === 2 ? W / 2 - .2 : -W / 2 + .1, z = lvl === 2 ? -D / 2 + .2 : -D / 2 + .1, y0 = lvl === 2 ? 3.1 : .2, y1 = lvl === 2 ? 4.5 : 2.9; S.seg([x, y0, z], [x, y1, z], .04, .028, wd, { l: L_WOOD, n: 4 }); const T = new Soup(); clothPanel(T, { x0: 0, x1: .7, yTop: 0, len: .46, z: 0, col: COL.clothB, col2: mulC(COL.gold, .6), rng, nx: 4, ny: 3, rag: .2, sway: 1.1 }); S.merge(T, { p: [x + .03, y1 - .06, z], ao: null }); });
    mounts.flame = lvl === 0 ? [fx, 1.2, fz] : [fx, .08 + (bs + .1) * .72, fz]; mounts.flameSize = bs; mounts.door = [0, 0, D / 2 + .45]; mounts.top = lvl === 2 ? 3.4 : 2.2;
  }
  pieces.sort((a, b) => a.order - b.order);
  return { pieces, mounts };
}

function scaffoldGeo(w, h) {
  const S = new Soup(), c = mulC(COL.woodL, .9), c2 = COL.wood;
  for (const [a, b] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) S.seg([a * w, 0, b * w], [a * w, h, b * w], .04, .035, c, { l: L_WOOD, n: 4 });
  for (let y = .9; y < h; y += 1.05) for (let k = 0; k < 4; k++) { const q = [[-1, -1], [1, -1], [1, 1], [-1, 1]], [a, b] = q[k], [cc, d] = q[(k + 1) % 4]; S.seg([a * w, y, b * w], [cc * w, y, d * w], .03, .03, c2, { l: L_WOOD, n: 4 }); if (k & 1) S.seg([a * w, y - .9, b * w], [cc * w, y, d * w], .022, .022, c, { l: L_WOOD, n: 3 }); }
  S.box(w * 1.2, .05, .34, 0, Math.min(h - .2, 1.95), w + .12, c2, { l: L_WOOD }); S.box(.34, .05, w * 1.2, -w - .12, Math.min(h - .25, .95), 0, c, { l: L_WOOD });
  return S.build();
}

let TOWER_STUN = false;
function findTarget(x, z, range, air, ground, minRange = 0) {
  if (G.phase !== 'play' || TOWER_STUN) return null;
  let best = null, bp = -1; const r2 = range * range, m2 = minRange * minRange;
  for (const m of G.mons) {
    if (m.dead || m.hp <= 0 || !m.vis) continue; if (m.fly ? !air : !ground) continue;
    const d = dist2(x, z, m.x, m.z); if (d > r2 || d < m2) continue;
    const sc = m.prog + (m.fly ? 2 : 0) + (m.def.boss ? -.0 : 0); if (sc > bp) { bp = sc; best = m; }
  }
  return best;
}
function aimPoint(m, dt, out) {
  if (m.fly) { out.x = m.x + m.vx * dt; out.y = m.y; out.z = m.z + m.vz * dt; return out; }
  const B = G.B, adv = m.blocked ? 0 : m.spdNow * dt, s2 = Math.min(B.L - .1, m.s + adv);
  pathAt(B, s2, out); out.x += -out.tz * m.lat; out.z += out.tx * m.lat; out.y += m.hitH; return out;
}

const _tv = new THREE.Vector3(), _tq = new THREE.Quaternion(), _tm = new THREE.Matrix4(), _tz = new THREE.Vector3(0, 0, 1), _ts = new THREE.Vector3(1, 1, 1), _ap = { x: 0, y: 0, z: 0, tx: 0, tz: 0 };

class Tower {
  constructor(pad, kind, idx) {
    this.pad = pad; this.kind = kind; this.idx = idx; this.lvl = 0; this.def = TOWER[kind];
    this.x = pad.x; this.y = pad.y; this.z = pad.z; this.yaw = pad.face; this.cs = Math.cos(this.yaw); this.sn = Math.sin(this.yaw);
    this.spent = this.def.cost[0]; this.state = 'build'; this.bt = 0; this.cool = rr(.2, .8); this.kills = 0; this.dealt = 0; this.alive = true; this.recent = 0;
    this.group = new THREE.Group(); this.group.position.set(this.x, this.y, this.z); this.group.rotation.y = this.yaw; R.scene.add(this.group);
    this.pieces = []; this.staticMesh = null; this.scaf = null; this.flame = null; this.flame2 = null; this.archers = []; this.men = []; this.respawn = 0;
    this.em = { x: this.x, y: this.y + 3, z: this.z, r: 1, g: .56, b: .26, I: 0, range: 13, on: 0, alive: true, seed: rnd() * 50, spot: kind !== 'spire', dx: this.sn, dz: this.cs, fl: 1, _spot: 0 };
    LT.emitters[idx] = this.em; pad.tower = this;
    this.gunYaw = 0; this.recoil = 0; this.charge = 0; this.spin = rnd() * 6; this.hover = 0; this.appear = 0;
    this.begin();
  }
  get range() { return this.def.range[this.lvl]; }
  w(l, out) { out.x = this.x + l[0] * this.cs + l[2] * this.sn; out.y = this.y + l[1]; out.z = this.z - l[0] * this.sn + l[2] * this.cs; return out; }
  begin() {
    const bp = blueprint(this.kind, this.lvl); this.bp = bp; this.mounts = bp.mounts; this.bt = 0; this.state = this.lvl ? 'upgrade' : 'build';
    this.clearModel(true);
    const n = bp.pieces.length, gap = Math.min(.2, 1.45 / n);
    bp.pieces.forEach((p, i) => {
      const mesh = new THREE.Mesh(p.soup.build(), MAT.world); mesh.castShadow = mesh.receiveShadow = true; mesh.visible = false; mesh.position.y = p.y + 2.4;
      this.group.add(mesh); this.pieces.push({ mesh, y: p.y, t0: .32 + i * gap, landed: false, soup: p.soup });
    });
    this.tEnd = .32 + n * gap + .3;
    this.scaf = new THREE.Mesh(scaffoldGeo(1.25, Math.min(4.4, bp.mounts.top + .3)), MAT.world); this.scaf.castShadow = true; this.scaf.scale.set(1, .01, 1); this.group.add(this.scaf);
    fxDust(this.x, this.y + .1, this.z, 7, 1.0, { speed: 1.6 });
    sfx('hammer', this.x, this.z, .8, .3);
  }
  clearModel(keepLights) {
    for (const p of this.pieces) { this.group.remove(p.mesh); p.mesh.geometry.dispose(); } this.pieces.length = 0;
    for (const k of ['staticMesh', 'scaf', 'carriage', 'crystal']) if (this[k]) { this.group.remove(this[k]); this[k].traverse(o => { if (o.geometry) o.geometry.dispose(); }); this[k] = null; }
    this.barrel = null; this.shards = null; this.ringG = null;
    removeFlame(this.flame); removeFlame(this.flame2); this.flame = this.flame2 = null; this.em.on = keepLights ? this.em.on * .4 : 0;
    this.archers.length = 0;
  }
  finish() {
    const M = new Soup(); for (const p of this.pieces) M.merge(p.soup, { p: [0, p.y, 0], ao: [0, 1.0, .72] });
    for (const p of this.pieces) { this.group.remove(p.mesh); p.mesh.geometry.dispose(); } this.pieces.length = 0;
    this.staticMesh = new THREE.Mesh(M.build(), MAT.world); this.staticMesh.castShadow = this.staticMesh.receiveShadow = true; this.group.add(this.staticMesh);
    if (this.scaf) { this.group.remove(this.scaf); this.scaf.geometry.dispose(); this.scaf = null; }
    const mt = this.mounts, lvl = this.lvl, d = this.def;
    if (mt.flame) { const p = this.w(mt.flame, {}); this.flame = addFlame({ x: p.x, y: p.y, z: p.z, size: mt.flameSize, on: 0, layers: mt.flameSize > .7 ? 2 : 1, glow: 1 }); this.em.x = p.x; this.em.y = p.y + .25; this.em.z = p.z; this.em.r = 1; this.em.g = .56; this.em.b = .26; }
    if (mt.flame2) { const p = this.w(mt.flame2, {}); this.flame2 = addFlame({ x: p.x, y: p.y, z: p.z, size: mt.flameSize, on: 0 }); }
    if (mt.lightAt) { const p = this.w(mt.lightAt, {}), lc = mt.lightCol || [.45, .72, 1]; this.em.x = p.x; this.em.y = p.y; this.em.z = p.z; this.em.r = lc[0]; this.em.g = lc[1]; this.em.b = lc[2]; }
    this.em.I = d.light[lvl]; this.em.range = this.kind === 'archer' ? 12 : 10.5;
    if (this.kind === 'archer') mt.archers.forEach((a, i) => this.archers.push({ l: a, yaw: this.yaw, draw: 0, cool: .4 + i * .3, e: { scale: .82, ph: 0, mv: 0, atk: -1, draw: 0, pitch: 0, tint: [1, .9, .7], x: 0, y: 0, z: 0, yaw: 0, flash: 0 } }));
    this.op = null; this.pulse = 0; this.gunYaw = this.yaw;
    if (mt.man) this.op = { l: mt.man, e: { scale: .9, ph: 0, mv: 0, atk: -1, x: 0, y: 0, z: 0, yaw: this.yaw, flash: 0, tint: this.kind === 'coder' ? [.35, .6, .3] : this.kind === 'spire' ? [.7, .6, .45] : [.5, .3, .25] } };
    if (this.kind === 'coder') this.commits = this.commits || 0;
    if (this.kind === 'guard') { this.respawn = .2; }
    this.state = 'active'; this.appear = 0;
    fxDust(this.x, this.y + .2, this.z, 10, 1.3, { speed: 2.2 });
    sfx('buildDone', this.x, this.z, 1);
    if (this.flame) fxEmbers(this.flame.x, this.flame.y, this.flame.z, 10, .2);
  }
  drawOp(yaw) {
    const o = this.op; if (!o) return null; const p = this.w(o.l, _ap), e = o.e;
    e.x = p.x; e.y = p.y - (1 - easeOut(this.appear)) * .5; e.z = p.z; e.scale = .9 * (.3 + .7 * this.appear); e.yaw = yaw;
    const M3 = rigHuman(KIT.foot, SPEC.foot, e); faceOnHead(this.def.face, M3, e.scale); return M3;
  }
  upgrade() { if (this.lvl >= 2 || this.state !== 'active') return false; this.lvl++; this.spent += this.def.cost[this.lvl]; for (const m of this.men) m.lvlUp = true; this.begin(); return true; }
  sell() {
    this.alive = false; this.em.alive = false; this.em.on = 0; LT.emitters[this.idx] = null; this.pad.tower = null;
    for (let i = 0; i < 14; i++) { _tm.compose(_tv.set(this.x + rr(-.7, .7), this.y + rr(.3, 2.4), this.z + rr(-.7, .7)), _tq.set(rr(-1, 1), rr(-1, 1), rr(-1, 1), 1).normalize(), _ts.set(1, 1, 1)); addDebris(this.kind === 'archer' || this.kind === 'guard' ? KIT.plank : KIT.rubble, _tm, null, rr(-2, 2), rr(1, 4), rr(-2, 2), rr(3, 9), rr(2, 3.5)); }
    fxDust(this.x, this.y + .4, this.z, 16, 1.6, { speed: 2.6 }); sfx('sell', this.x, this.z, 1);
    for (const m of this.men) m.leave = true;
    this.clearModel(false); R.scene.remove(this.group);
  }
  update(dt) {
    const d = this.def, lvl = this.lvl; this.recent = Math.max(0, this.recent - dt * .25);
    if (this.state !== 'active') {
      this.bt += dt; const bt = this.bt;
      if (this.scaf) this.scaf.scale.y = bt < this.tEnd - .25 ? easeOutBack(bt / .3) : Math.max(.01, 1 - (bt - (this.tEnd - .25)) / .25);
      for (const p of this.pieces) {
        const u = (bt - p.t0) / .24;
        if (u < 0) continue; p.mesh.visible = true;
        if (u < 1) p.mesh.position.y = p.y + (1 - u * u) * 2.2;
        else { p.mesh.position.y = p.y; const sq = clamp((u - 1) / .5, 0, 1); p.mesh.scale.y = 1 - .1 * Math.sin(sq * PI) * (1 - sq);
          if (!p.landed) { p.landed = true; fxDust(this.x + rr(-.5, .5), this.y + p.y + .1, this.z + rr(-.5, .5), 3, .55, { speed: 1.2, a: .4 }); sfx('hammer', this.x, this.z, .7, rnd()); } }
      }
      this.em.on = damp(this.em.on, 0, 4, dt);
      if (bt >= this.tEnd) this.finish();
      return;
    }
    this.appear = Math.min(1, this.appear + dt * 2.2);
    TOWER_STUN = this.stun > 0;
    if (TOWER_STUN) { this.stun -= dt; const k = Math.min(1, this.stun * 2); FX.add.push(this.x, this.y + 1.7, this.z, 4.2, 5.6, 0, 0, .2, .5, 1.2, .3 * k, 2, 0, 0, 0); if (rnd() < dt * 5) { const a = rnd() * TAU, h = rr(.6, 3); fxBolt([this.x + Math.cos(a) * .8, this.y + h, this.z + Math.sin(a) * .8], [this.x + Math.cos(a + 1.2) * .8, this.y + h + rr(-.5, .5), this.z + Math.sin(a + 1.2) * .8], .12, [.5, .85, 1.5], .03); } if (rnd() < dt * 18) fxPart(this.x + rr(-.7, .7), this.y + rr(.4, 3.2), this.z + rr(-.7, .7), 0, rr(-.5, .1), 0, rr(.4, .9), rr(.05, .08), .6, 1.1, 2.0, { drag: .5 }); }
    this.em.on = damp(this.em.on, TOWER_STUN ? .12 : 1, TOWER_STUN ? 8 : 3, dt);
    if (this.flame) this.flame.on = this.em.on; if (this.flame2) this.flame2.on = this.em.on;
    this.cool -= dt;
    if (this.kind === 'archer') this.updArcher(dt, d, lvl);
    else if (this.kind === 'bombard') this.updBombard(dt, d, lvl);
    else if (this.kind === 'spire') this.updSpire(dt, d, lvl);
    else if (this.kind === 'coder') this.updCoder(dt, d, lvl);
    else this.updGuard(dt, d, lvl);
    TOWER_STUN = false;
  }
  updArcher(dt, d, lvl) {
    const tgt = findTarget(this.x, this.z, d.range[lvl], true, true);
    for (const a of this.archers) {
      const p = this.w(a.l, _ap), e = a.e; e.x = p.x; e.y = p.y - (1 - easeOut(this.appear)) * .5; e.z = p.z; e.scale = .82 * (.3 + .7 * this.appear);
      a.cool -= dt; if (e.atk >= 0) { e.atk += dt / .4; if (e.atk >= 1) e.atk = -1; }
      if (tgt) {
        const T = clamp(Math.hypot(tgt.x - p.x, tgt.z - p.z) / 14, .22, .62), q = aimPoint(tgt, T, _ap2);
        a.yaw = angDamp(a.yaw, Math.atan2(q.x - p.x, q.z - p.z), 12, dt);
        if (a.cool <= 0) {
          a.cool = d.rate[lvl] * rr(.9, 1.12); e.atk = 0; a.fire = .2;
        }
        if (a.fire > 0) { a.fire -= dt; if (a.fire <= 0) { shootArrow(p.x + Math.sin(a.yaw) * .3, p.y + 1.2, p.z + Math.cos(a.yaw) * .3, tgt, d.dmg[lvl], this); sfx('bow', p.x, p.z, .45, rnd()); } }
      } else { a.yaw = angDamp(a.yaw, this.yaw + Math.sin(G.t * .5 + a.l[0] * 3) * .5, 2, dt); if (a.cool < .3) a.cool = .3; }
      e.yaw = a.yaw;
      const M3 = rigHuman(KIT.foot, SPEC.foot, e); faceOnHead('dzakes', M3, e.scale);
    }
  }
  updBombard(dt, d, lvl) {
    const tgt = findTarget(this.x, this.z, d.range[lvl], false, true, d.minRange), e = this.op.e;
    if (e.atk >= 0) { e.atk += dt / .55; if (e.atk >= 1) e.atk = -1; }
    if (tgt) {
      const dist = Math.hypot(tgt.x - this.x, tgt.z - this.z), T = clamp(dist / 7.2, .75, 1.45), q = aimPoint(tgt, T, _ap2);
      const want = Math.atan2(q.x - this.x, q.z - this.z); this.gunYaw = angDamp(this.gunYaw, want, 6, dt);
      if (Math.abs(angDiff(this.gunYaw, want)) < .2 && this.cool <= 0) { this.cool = d.rate[lvl] * rr(.95, 1.08); e.atk = 0; this.throwAt = .28; this.shot = { tgt, T, dist }; }
    } else this.gunYaw = angDamp(this.gunYaw, this.yaw + Math.sin(G.t * .3 + this.idx) * .7, 1.2, dt);
    if (this.throwAt > 0) {
      this.throwAt -= dt;
      if (this.throwAt <= 0 && this.shot) {
        const { tgt: m, T, dist } = this.shot; this.shot = null;
        if (!m.dead && m.hp > 0) {
          const q = aimPoint(m, T, _ap2), hp = this.w(this.op.l, _tv.set(0, 0, 0)), x0 = hp.x + Math.sin(this.gunYaw) * .3, y0 = hp.y + 1.5, z0 = hp.z + Math.cos(this.gunYaw) * .3;
          const gy = G.B.heightAt(q.x, q.z);
          G.shells.push({ x0, y0, z0, tx: q.x, ty: Math.max(gy, q.y - m.hitH) + .05, tz: q.z, t: 0, T, dmg: d.dmg[lvl], splash: d.splash[lvl], tower: this, x: x0, y: y0, z: z0, sm: 0, arc: 1.5 + dist * .2 });
          sfx('bow', this.x, this.z, .9, .1);
        }
      }
    }
    this.drawOp(this.gunYaw);
  }
  updSpire(dt, d, lvl) {
    const e = this.op.e, r = d.range[lvl];
    let any = false; for (const m of G.mons) if (!m.dead && m.hp > 0 && m.vis && dist2(this.x, this.z, m.x, m.z) < r * r) { any = true; break; }
    if (G.phase !== 'play' || TOWER_STUN) any = false;
    e.mallet = true; e.beat = (e.beat || 0) + dt * (any ? 14 : 3); e.weapon = KIT.item.stick; e.wScale = .5;
    this.pulse -= dt;
    if (any && this.pulse <= 0) {
      this.pulse = d.rate[lvl];
      for (const m of G.mons) { if (m.dead || m.hp <= 0 || !m.vis) continue; if (dist2(this.x, this.z, m.x, m.z) < r * r) slowMonster(m, d.slow[lvl], d.slowT[lvl]); }
      const gp = this.w(this.mounts.gong, _ap);
      fxTimed(4, this.x, this.y + .15, this.z, r * 2, r * 2, 1.4, 1.1, .4, .6, .22, { ground: true });
      FX.add.push(gp.x, gp.y, gp.z, 2.2, 2.2, 0, 0, 1.6, 1.2, .4, .5, 2, 0, 0, 0);
      for (let i = 0; i < 6; i++) { const a = rnd() * TAU; fxPart(gp.x, gp.y + .3, gp.z, Math.cos(a) * rr(.6, 1.6), rr(.8, 1.8), Math.sin(a) * rr(.6, 1.6), rr(.9, 1.5), rr(.07, .11), 2.4, 1.9, .5, { drag: 1.2, wob: 1.5 }); }
      lightFlash(gp.x, gp.y, gp.z, 0xffd070, 160, .25, 9);
      sfx('gamelan', this.x, this.z, 1, rnd()); this.recent += 6;
    }
    this.drawOp(this.yaw);
  }
  updCoder(dt, d, lvl) {
    const e = this.op.e; e.typing = G.t + this.idx;
    if (d.income[lvl] && G.phase === 'play') {
      this.payT = (this.payT || 0) + dt;
      if (this.payT >= d.every[lvl]) { this.payT -= d.every[lvl]; const p = this.w(this.mounts.lightAt, _ap); dropCoins(p.x, p.y + .3, p.z, d.income[lvl], lvl === 2 ? 6 : 3); sfx('coin', this.x, this.z, .8, rnd()); }
    }
    if (this.cool <= 0) { this.cool = rr(.9, 2.2); this.commits++; const p = this.w(this.mounts.lightAt, _ap); fxPart(p.x, p.y + .2, p.z, rr(-.2, .2), rr(.5, .9), rr(-.2, .2), rr(1.2, 2), .07, .4, 2.6, .9, { drag: .6 }); if (rnd() < .5) sfx('typing', this.x, this.z, .5, rnd()); }
    this.em.I = d.light[lvl] * (.85 + .15 * Math.sin(G.t * 9 + this.idx));
    this.drawOp(this.yaw + PI);
  }
  updGuard(dt, d, lvl) {
    for (let i = this.men.length - 1; i >= 0; i--) if (this.men[i].gone) this.men.splice(i, 1);
    if (this.men.length < d.n[lvl]) { this.respawn -= dt; if (this.respawn <= 0) { this.respawn = this.men.length === 0 && G.t < 4 ? .5 : d.rate[lvl]; spawnFootman(this); } }
  }
  dispose() { this.alive = false; this.em.alive = false; LT.emitters[this.idx] = null; this.clearModel(false); R.scene.remove(this.group); this.pad.tower = null; }
}
const _ap2 = { x: 0, y: 0, z: 0, tx: 0, tz: 0 }, _tv2 = new THREE.Vector3();

function shootArrow(x, y, z, m, dmg, tower) {
  const dist = Math.hypot(m.x - x, m.z - z), T = clamp(dist / 14, .22, .62), q = aimPoint(m, T, _ap2);
  G.arrows.push({ x0: x, y0: y, z0: z, tx: q.x, ty: q.y, tz: q.z, t: 0, T, m, dmg, tower, x, y, z, dx: 0, dy: 0, dz: 1, arc: .4 + dist * .09, alive: true, lI: 0, lCol: 0xff9040, lx: x, ly: y, lz: z, lseed: rnd() * 9, ember: 0 });
}
function arrowMatrix(x, y, z, dx, dy, dz) { _tq.setFromUnitVectors(_tz, _tv.set(dx, dy, dz).normalize()); return _tm.compose(_tv.set(x, y, z), _tq, _ts.set(1, 1, 1)); }
function updateProjectiles(dt) {
  const A = G.arrows, B = G.B;
  for (let i = A.length - 1; i >= 0; i--) {
    const a = A[i]; a.t += dt; const u = Math.min(1, a.t / a.T), m = a.m;
    if (m && !m.dead && m.hp > 0) { const q = aimPoint(m, Math.max(0, a.T - a.t), _ap2), k = Math.min(1, dt * 9); a.tx = lerp(a.tx, q.x, k); a.ty = lerp(a.ty, q.y, k); a.tz = lerp(a.tz, q.z, k); }
    const px = a.x, py = a.y, pz = a.z;
    a.x = lerp(a.x0, a.tx, u); a.z = lerp(a.z0, a.tz, u); a.y = lerp(a.y0, a.ty, u) + a.arc * 4 * u * (1 - u);
    const dx = a.x - px, dy = a.y - py, dz = a.z - pz, l = Math.hypot(dx, dy, dz) || 1; a.dx = dx / l; a.dy = dy / l; a.dz = dz / l;
    a.lx = a.x; a.ly = a.y; a.lz = a.z;
    _tm.compose(_tv.set(a.x, a.y, a.z), _tq.setFromAxisAngle(_tv2.set(1, .3, .2).normalize(), a.t * 22), _ts.set(1, 1, 1)); KIT.arrow.put(_tm, 0, null);
    if (u >= 1) {
      a.alive = false; swapRemove(A, i);
      if (m && !m.dead && m.hp > 0 && dist2(a.tx, a.tz, m.x, m.z) < 1.0) {
        fxSparks(a.x, a.y, a.z, 5, 3, 3, 1.5, .4, { size: .055, grav: 6 }); fxTimed(2, a.x, a.y, a.z, .9, .9, 1.6, .8, .25, .8, .12);
        sfx('arrowHit', a.x, a.z, .55, rnd()); hitMonster(m, a.dmg, 'arrow', a.dx, a.dz, a.tower);
      } else if (!m || !m.fly) {
        const gy = B.heightAt(a.x, a.z);
        G.stuck.push({ x: a.x, y: gy + .12, z: a.z, dx: a.dx, dy: Math.min(-.5, a.dy), dz: a.dz, life: 3.2 });
        fxSparks(a.x, gy + .1, a.z, 3, 2, 3, 1.5, .4, { size: .05 });
      }
    }
  }
  const St = G.stuck;
  for (let i = St.length - 1; i >= 0; i--) {
    const s = St[i]; s.life -= dt; if (s.life <= 0) { swapRemove(St, i); continue; }
    KIT.arrow.put(arrowMatrix(s.x, s.y - Math.max(0, .5 - s.life) * .5, s.z, s.dx, s.dy, s.dz), 0, null);
    if (false) { FX.add.push(s.x - s.dx * .25, s.y - s.dy * .25 + .04, s.z - s.dz * .25, .2, .2, 0, 0, 3, 1.4, .3, Math.min(1, (s.life - 1.4)), 0, 0, 0, 0); if (rnd() < dt * 5) fxPart(s.x, s.y + .1, s.z, rr(-.1, .1), rr(.4, .9), rr(-.1, .1), .6, .045, 2.4, 1, .2, { drag: .5, wob: 1 }); }
  }
  const Sh = G.shells;
  for (let i = Sh.length - 1; i >= 0; i--) {
    const s = Sh[i]; s.t += dt; const u = Math.min(1, s.t / s.T);
    s.x = lerp(s.x0, s.tx, u); s.z = lerp(s.z0, s.tz, u); s.y = lerp(s.y0, s.ty, u) + s.arc * 4 * u * (1 - u);
    _tm.compose(_tv.set(s.x, s.y, s.z), _tq.setFromAxisAngle(_tz, s.t * 9), _ts.set(1, 1, 1)); KIT.shell.put(_tm, 0, null);
    s.sm += dt * 8; while (s.sm > 1) { s.sm -= 1; fxSmoke(s.x, s.y, s.z, rr(-.1, .1), rr(0, .2), rr(-.1, .1), rr(.5, .9), .16, .3, .26, .25, .25, .32, { drag: 1 }); if (rnd() < .5) fxPart(s.x, s.y, s.z, rr(-.5, .5), rr(-.2, .5), rr(-.5, .5), .4, .05, 2.5, 1.1, .2, { grav: 2 }); }
    if (u >= 1) { swapRemove(Sh, i); explodeAt(s.tx, s.ty, s.tz, s.dmg, s.splash, s.tower); }
  }
}
function explodeAt(x, y, z, dmg, splash, tower) {
  const sc = splash / 1.7;
  fxExplosion(x, y, z, sc);
  FX.decals.add(G.B.heightAt, x, z, splash * 1.2, .016, .013, .011, .85, 45);
  sfx('explode', x, z, 1, clamp(sc - .6, 0, 1));
  for (const m of G.mons) {
    if (m.dead || m.hp <= 0 || m.fly || !m.vis) continue;
    const d = Math.hypot(m.x - x, m.z - z); if (d > splash + m.rad) continue;
    const k = lerp(1, .45, sat(d / splash)), l = d || 1;
    hitMonster(m, dmg * k, 'blast', (m.x - x) / l, (m.z - z) / l, tower);
  }
  for (let i = 0; i < 5; i++) { _tm.compose(_tv.set(x + rr(-.3, .3), y + .2, z + rr(-.3, .3)), _tq.set(rr(-1, 1), rr(-1, 1), rr(-1, 1), 1).normalize(), _ts.set(.6, .6, .6)); addDebris(KIT.rubble, _tm, [.5, .45, .4], rr(-3, 3), rr(3, 6), rr(-3, 3), rr(4, 10), rr(1.6, 2.6)); }
}
