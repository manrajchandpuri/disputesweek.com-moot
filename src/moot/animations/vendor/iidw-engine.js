/* eslint-disable */
/* Exported from the Claude Design canvas "IIDW Moot 2027 Visual Kit" on 28 October 2026. Kept as delivered so later exports can replace it whole. */
/* IIDW International Commercial Arbitration Moot 2027
   Visual engine. Plain JS and HTML canvas, no libraries. Exposes window.IIDW.
   Roles never mix. Dither = natural world. ASCII = machine. Gold line = human authority and law. */
(function (root) {
'use strict';
var PAL = { navy: '#0B2545', paper: '#FBFBFA', river: '#134074', riverLight: '#6E9BD1', gold: '#D4AF37', saffron: '#F08A1D' };
var RAMP = ' .·,’~=+*xoX#%@';
var RN = RAMP.length;
var FONT = '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif';
var BYTES = 44365;
var THEME = {
  navy:  { ground: PAL.navy,  land: PAL.paper, water: PAL.riverLight, ascii: PAL.paper, gold: PAL.gold },
  paper: { ground: PAL.paper, land: PAL.navy,  water: PAL.river,      ascii: PAL.navy,  gold: PAL.gold }
};
var now = function () { return performance.now(); };

/* ---------- utilities ---------- */
function rng(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function hash(a, b, c) { var h = Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453; return h - Math.floor(h); }
function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
function lerp(a, b, t) { return a + (b - a) * t; }
function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
function u32(hex) { var n = parseInt(hex.slice(1), 16); return ((255 << 24) | ((n & 255) << 16) | (n & 0xff00) | ((n >> 16) & 255)) >>> 0; }
function box(b, x, y, w, h) { return { x: b.x + b.w * x, y: b.y + b.h * y, w: b.w * w, h: b.h * h }; }
/* density styles. Land writes red, water writes blue, ASCII brightness writes grey */
function Ls(d) { return 'rgb(' + (clamp(d, 0, 1) * 255 | 0) + ',0,0)'; }
function Ws(d) { return 'rgb(0,0,' + (clamp(d, 0, 1) * 255 | 0) + ')'; }
function Gs(d) { var v = clamp(d, 0, 1) * 255 | 0; return 'rgb(' + v + ',' + v + ',' + v + ')'; }
function grad(g, x0, y0, x1, y1, f, a, b) { var r = g.createLinearGradient(x0, y0, x1, y1); r.addColorStop(0, f(a)); r.addColorStop(1, f(b)); return r; }
function poly(g, P) { g.beginPath(); g.moveTo(P[0][0], P[0][1]); for (var i = 1; i < P.length; i++) g.lineTo(P[i][0], P[i][1]); }

/* ---------- environment ---------- */
var env = { dpr: 1, phone: false, px: 2, cell: 10, forced: null };
function readEnv() {
  env.dpr = Math.min(root.devicePixelRatio || 1, 2);
  env.phone = !!(root.matchMedia && root.matchMedia('(max-width: 640px)').matches);
  var f = env.forced || {};
  env.px = f.px || (env.phone ? 3 : 2);
  env.cell = f.cell || (env.phone ? 7 : 10);
}
readEnv();

/* ---------- threshold matrices ---------- */
var BAYER = (function () {
  var m = [0], n, s, o, x, y, v, i;
  for (n = 1; n < 8; n *= 2) {
    s = n * 2; o = new Array(s * s);
    for (y = 0; y < n; y++) for (x = 0; x < n; x++) {
      v = m[y * n + x] * 4;
      o[y * s + x] = v; o[y * s + x + n] = v + 2; o[(y + n) * s + x] = v + 3; o[(y + n) * s + x + n] = v + 1;
    }
    m = o;
  }
  var f = new Float32Array(64); for (i = 0; i < 64; i++) f[i] = (m[i] + .5) / 64; return f;
})();
/* 32 by 32 blue noise by void filling. Each new rank lands in the largest empty region. Built once, lazily. */
var BLUE = null, BN = 32;
function blue() {
  if (BLUE) return BLUE;
  var N = BN * BN, E = new Float32Array(N), rank = new Float32Array(N), used = new Uint8Array(N), r = rng(7), K = [], i, j, k, dx, dy;
  for (i = 0; i < N; i++) E[i] = r() * 1e-4;
  for (dy = -7; dy <= 7; dy++) for (dx = -7; dx <= 7; dx++) K.push(dx, dy, Math.exp(-(dx * dx + dy * dy) / 4.5));
  for (k = 0; k < N; k++) {
    var best = 0, bv = 1e9;
    for (i = 0; i < N; i++) if (!used[i] && E[i] < bv) { bv = E[i]; best = i; }
    used[best] = 1; rank[best] = (k + .5) / N;
    var bx = best % BN, by = (best / BN) | 0;
    for (j = 0; j < K.length; j += 3) E[((by + K[j + 1] + BN) % BN) * BN + (bx + K[j] + BN) % BN] += K[j + 2];
  }
  return (BLUE = rank);
}

/* ---------- world painters (dither sources) ---------- */
function sky(g, b, o) {
  o = o || {}; var hz = o.hz || .45, top = o.top == null ? .04 : o.top, bot = o.bot == null ? .24 : o.bot;
  g.fillStyle = grad(g, 0, b.y, 0, b.y + b.h * hz, Ls, top, bot);
  g.fillRect(b.x - b.w * .2, b.y - b.h * .2, b.w * 1.4, b.h * (hz + .5));
  if (o.sun) { g.fillStyle = Ls(o.sun[3] || .5); g.beginPath(); g.arc(b.x + b.w * o.sun[0], b.y + b.h * o.sun[1], b.w * o.sun[2], 0, 7); g.fill(); }
  if (o.clouds) {
    var r = rng(o.clouds);
    for (var i = 0; i < 6; i++) {
      g.fillStyle = Ls(top + (bot - top) * .5 + .06 + r() * .06); g.beginPath();
      g.ellipse(b.x + b.w * (r() * 1.1 - .05), b.y + b.h * (.05 + r() * hz * .55), b.w * (.06 + r() * .12), b.h * (.008 + r() * .016), 0, 0, 7); g.fill();
    }
  }
}
function ridge(g, b, y, amp, seed, d0, d1) {
  var r = rng(seed), p0 = r() * 6, p1 = r() * 6, p2 = r() * 6, f = 1 + r(), x0 = b.x - b.w * .2, x1 = b.x + b.w * 1.2, st = b.w / 120;
  g.beginPath(); g.moveTo(x0, b.y + b.h * 1.3);
  for (var x = x0; x <= x1 + st; x += st) {
    var u = (x - b.x) / b.w;
    g.lineTo(x, b.y + b.h * (y - amp * (.55 * Math.sin(u * 3 * f + p0) + .3 * Math.sin(u * 7.7 * f + p1) + .15 * Math.sin(u * 19 + p2))));
  }
  g.lineTo(x1 + st, b.y + b.h * 1.3); g.closePath();
  g.fillStyle = grad(g, 0, b.y + b.h * (y - amp), 0, b.y + b.h, Ls, d0, d1 == null ? d0 : d1); g.fill();
}
function furrows(g, b, y0, n, d) {
  g.save(); g.strokeStyle = Ls(d);
  for (var i = 1; i <= n; i++) {
    var t = i / n, y = b.y + b.h * (y0 + (1.05 - y0) * t * t);
    g.lineWidth = 1 + t * 2.5; g.beginPath(); g.moveTo(b.x - b.w * .2, y + b.h * .02 * t);
    g.quadraticCurveTo(b.x + b.w * .5, y - b.h * .025, b.x + b.w * 1.2, y + b.h * .015); g.stroke();
  }
  g.restore();
}
/* river centreline. s runs 0 to 1, upstream to downstream */
function rp(s, b, o) {
  return {
    x: b.x + b.w * (o.x0 + (o.x1 - o.x0) * s) + Math.sin(s * o.f + o.p) * b.w * o.m * (.3 + s),
    y: b.y + b.h * (o.y0 + (o.y1 - o.y0) * Math.pow(s, o.k || 1.3)),
    w: b.w * (o.w0 + o.w1 * Math.pow(s, 1.6))
  };
}
function river(g, b, o, d0, d1, s0, s1) {
  s0 = s0 || 0; s1 = s1 == null ? 1 : s1;
  var n = 90, A = [], B = [], i;
  for (i = 0; i <= n; i++) {
    var s = s0 + (s1 - s0) * i / n, p = rp(s, b, o), q = rp(s + .003, b, o), dx = q.x - p.x, dy = q.y - p.y, m = Math.hypot(dx, dy) || 1;
    A.push([p.x - dy / m * p.w, p.y + dx / m * p.w]); B.push([p.x + dy / m * p.w, p.y - dx / m * p.w]);
  }
  poly(g, A.concat(B.reverse())); g.closePath();
  var a = rp(s0, b, o), z = rp(s1, b, o);
  g.fillStyle = grad(g, 0, a.y, 0, z.y, Ws, d0, d1); g.fill();
}
function border(g, b, x0, y0, x1, y1) {
  g.save(); g.strokeStyle = Ls(.08); g.lineWidth = Math.max(2, b.w * .0035);
  g.setLineDash([b.w * .012, b.w * .01]); g.beginPath();
  g.moveTo(b.x + b.w * x0, b.y + b.h * y0); g.lineTo(b.x + b.w * x1, b.y + b.h * y1); g.stroke(); g.restore();
}
function house(g, x, y, s, r) {
  var w = s * (1.2 + r() * .6), h = s * (.55 + r() * .4), rh = s * (.4 + r() * .25), e = s * .1, wn = Math.max(1, s * .17);
  g.fillStyle = Ls(.8); g.fillRect(x, y - h, w, h);
  g.fillStyle = Ls(.98); g.beginPath(); g.moveTo(x - e, y - h); g.lineTo(x + w * .5, y - h - rh); g.lineTo(x + w * .5, y - h); g.fill();
  g.fillStyle = Ls(.62); g.beginPath(); g.moveTo(x + w * .5, y - h - rh); g.lineTo(x + w + e, y - h); g.lineTo(x + w * .5, y - h); g.fill();
  g.fillStyle = Ls(.18); g.fillRect(x + w * .2, y - h * .62, wn, wn);
  if (w > s * 1.45) g.fillRect(x + w * .64, y - h * .62, wn, wn);
}
function town(g, cx, cy, s, seed, n, spread) {
  var r = rng(seed), hs = [], i;
  for (i = 0; i < n; i++) hs.push([cx + (r() - .5) * spread, cy + (r() - .5) * s * 1.6, s * (.7 + r() * .5)]);
  hs.sort(function (a, c) { return a[1] - c[1]; });
  for (i = 0; i < hs.length; i++) house(g, hs[i][0] - hs[i][2] * .7, hs[i][1], hs[i][2], r);
}
/* list entries are [s, side, size, count, spread] in fractions of the box width */
function townsAlong(g, b, o, list) {
  for (var i = 0; i < list.length; i++) {
    var t = list[i], p = rp(t[0], b, o), sp = b.w * t[4];
    town(g, p.x + t[1] * (p.w + b.w * .025 + sp * .5), p.y + b.h * .015, b.w * t[2], 31 + i * 7, t[3], sp);
  }
}
/* upstream reservoir held by a straight dam. o.out false skips the outflow channel */
function reservoir(g, b, o) {
  o = o || {};
  var X = function (u) { return b.x + b.w * u; }, Y = function (v) { return b.y + b.h * v; };
  g.fillStyle = grad(g, 0, Y(.38), 0, Y(.6), Ws, .3, .56);
  g.beginPath(); g.moveTo(X(.02), Y(.45)); g.bezierCurveTo(X(.3), Y(.36), X(.7), Y(.37), X(.98), Y(.44));
  g.lineTo(X(.9), Y(.64)); g.lineTo(X(.1), Y(.64)); g.closePath(); g.fill();
  g.fillStyle = Ls(o.sh || .58);
  g.beginPath(); g.moveTo(X(-.2), Y(.37)); g.quadraticCurveTo(X(.12), Y(.38), X(.25), Y(.6)); g.lineTo(X(.25), Y(1.2)); g.lineTo(X(-.2), Y(1.2)); g.fill();
  g.beginPath(); g.moveTo(X(1.2), Y(.37)); g.quadraticCurveTo(X(.88), Y(.38), X(.75), Y(.6)); g.lineTo(X(.75), Y(1.2)); g.lineTo(X(1.2), Y(1.2)); g.fill();
  g.fillStyle = grad(g, 0, Y(.7), 0, Y(1), Ls, .4, .6); g.fillRect(X(.24), Y(.7), b.w * .52, b.h * .5);
  var x0 = X(.24), x1 = X(.76), y0 = Y(.58), y1 = Y(.71), c = Math.max(1.5, b.h * .014), k;
  g.fillStyle = Ls(.84); g.fillRect(x0, y0, x1 - x0, y1 - y0);
  g.fillStyle = Ls(1); g.fillRect(x0 - b.w * .012, y0 - c, x1 - x0 + b.w * .024, c);
  g.fillStyle = Ls(.6); for (k = 1; k < 5; k++) g.fillRect(x0, y0 + (y1 - y0) * k / 5, x1 - x0, Math.max(1, b.h * .004));
  g.fillStyle = Ls(.16); for (k = 0; k < 3; k++) g.fillRect(X(.445 + k * .045), y1 - (y1 - y0) * .38, b.w * .022, (y1 - y0) * .38);
  if (o.out !== false) river(g, b, { x0: .5, y0: .71, x1: .62, y1: 1.12, f: 4, p: 0, m: .04, w0: .025, w1: .07 }, .45, .7);
}
/* modernist civic skyline, an evocation only */
var HAND = [[.42,1],[.58,1],[.6,.72],[.86,.56],[.88,.48],[.66,.5],[.72,.2],[.66,.17],[.58,.42],[.55,.04],[.48,.04],[.48,.4],[.38,.09],[.32,.12],[.41,.45],[.2,.24],[.14,.29],[.38,.6],[.4,.72]];
function hand(g, cx, top, s, d) {
  g.fillStyle = Ls(d || .94); g.beginPath();
  for (var i = 0; i < HAND.length; i++) { var x = cx + (HAND[i][0] - .5) * s, y = top - s + HAND[i][1] * s; i ? g.lineTo(x, y) : g.moveTo(x, y); }
  g.closePath(); g.fill();
}
function skylineBack(g, b) { sky(g, b, { hz: .78, top: .03, bot: .26, clouds: 5 }); ridge(g, b, .64, .05, 51, .16, .2); }
function skyline(g, b) {
  var X = function (u) { return b.x + b.w * u; }, Y = function (v) { return b.y + b.h * v; }, gy = Y(.78), i, r;
  g.fillStyle = grad(g, 0, gy, 0, Y(1), Ls, .5, .68); g.fillRect(X(-.2), gy, b.w * 1.4, b.h * .4);
  g.fillStyle = Ws(.52); g.fillRect(X(.06), gy + b.h * .05, b.w * .3, b.h * .045); g.fillRect(X(.5), gy + b.h * .09, b.w * .38, b.h * .06);
  /* parasol on piers with vaulted soffit */
  g.fillStyle = Ls(.84); g.fillRect(X(.02), Y(.5), b.w * .24, b.h * .03);
  g.beginPath(); g.moveTo(X(.02), Y(.53));
  for (i = 0; i < 5; i++) g.quadraticCurveTo(X(.02 + .048 * (i + .5)), Y(.585), X(.02 + .048 * (i + 1)), Y(.53));
  g.closePath(); g.fill();
  for (i = 0; i < 4; i++) g.fillRect(X(.045 + i * .062), Y(.55), Math.max(2, b.w * .012), gy - Y(.55));
  g.fillStyle = Ls(.58); g.fillRect(X(.06), Y(.63), b.w * .17, gy - Y(.63));
  g.fillStyle = Ls(.28); for (i = 0; i < 9; i++) g.fillRect(X(.066 + i * .018), Y(.645), Math.max(1, b.w * .006), gy - Y(.66));
  /* assembly block, trough portico, hyperboloid tower, tilted lantern */
  g.fillStyle = Ls(.72); g.fillRect(X(.34), Y(.6), b.w * .2, gy - Y(.6));
  g.fillStyle = Ls(.4); for (i = 0; i < 12; i++) g.fillRect(X(.346 + i * .016), Y(.62), Math.max(1, b.w * .005), gy - Y(.635));
  g.fillStyle = Ls(.92); g.beginPath(); g.moveTo(X(.32), Y(.55)); g.quadraticCurveTo(X(.44), Y(.62), X(.56), Y(.55));
  g.lineTo(X(.56), Y(.57)); g.quadraticCurveTo(X(.44), Y(.645), X(.32), Y(.57)); g.closePath(); g.fill();
  g.fillStyle = Ls(.8); g.beginPath(); g.moveTo(X(.39), Y(.6)); g.quadraticCurveTo(X(.415), Y(.47), X(.395), Y(.34));
  g.lineTo(X(.46), Y(.37)); g.quadraticCurveTo(X(.44), Y(.48), X(.47), Y(.6)); g.closePath(); g.fill();
  g.fillStyle = Ls(.9); g.beginPath(); g.moveTo(X(.48), Y(.6)); g.lineTo(X(.505), Y(.5)); g.lineTo(X(.535), Y(.6)); g.fill();
  /* long slab with loggias */
  g.fillStyle = Ls(.7); g.fillRect(X(.6), Y(.6), b.w * .38, gy - Y(.6));
  g.fillStyle = Ls(.3); for (r = 0; r < 4; r++) for (i = 0; i < 26; i++) g.fillRect(X(.605 + i * .0143), Y(.615 + r * .04), b.w * .008, b.h * .022);
  /* raised open hand on its mast */
  g.fillStyle = Ls(.86); g.fillRect(X(.566), Y(.4), Math.max(2, b.w * .004), gy - Y(.4));
  hand(g, X(.568), Y(.4), b.h * .2);
}

/* ---------- machine painters (ASCII sources write grey brightness) ---------- */
function dcentre(g, q, t, n) {
  n = n || 4; var X = function (u) { return q.x + q.w * u; }, Y = function (v) { return q.y + q.h * v; }, i, r, c;
  g.fillStyle = Gs(.24); g.fillRect(X(.06), Y(.34), q.w * .88, q.h * .66);
  g.fillStyle = Gs(.8); g.fillRect(X(.03), Y(.28), q.w * .94, q.h * .07);
  for (i = 0; i < n; i++) { g.fillStyle = Gs(.38); g.fillRect(X((i + .5) / n * .9 + .05) - q.w * .055, Y(.16), q.w * .11, q.h * .12); }
  var cols = Math.max(4, Math.round(q.w / 18));
  for (r = 0; r < 4; r++) for (c = 0; c < cols; c++) {
    g.fillStyle = Gs(hash(c, r, Math.floor(t / 500)) > .72 ? 1 : .56);
    g.fillRect(X(.1 + .8 * c / cols), Y(.42 + .11 * r), q.w * .8 / cols * .55, q.h * .05);
  }
  g.fillStyle = Gs(.46); g.fillRect(X(.06), Y(.9), q.w * .88, q.h * .02);
  g.fillStyle = Gs(.07); g.fillRect(X(.45), Y(.8), q.w * .1, q.h * .2);
}
/* a cooling fan. Rotation reads through glyph phase. + then * then x then * */
function fan(G, x, y, ph) {
  var c = G.c, O = [[1,0],[-1,0],[0,1],[0,-1]], D = [[1,1],[-1,-1],[1,-1],[-1,1]], i, L, ch;
  G.put(x, y, '+*x*'[ph]);
  L = ph === 0 ? O : ph === 2 ? D : O.concat(D); ch = ph % 2 ? '·' : 'o';
  for (i = 0; i < L.length; i++) G.put(x + L[i][0] * c, y + L[i][1] * c, ch);
}
function dcGlyphs(G, q, t, n) { n = n || 4; var ph = Math.floor(t / 110); for (var i = 0; i < n; i++) fan(G, q.x + q.w * ((i + .5) / n * .9 + .05), q.y + q.h * .22, (ph + i) % 4); }
function plen(P) { var L = [0]; for (var i = 1; i < P.length; i++) L.push(L[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1])); return L; }
function pat(P, L, u) {
  var d = u * L[L.length - 1];
  for (var i = 1; i < P.length; i++) if (L[i] >= d) { var f = (d - L[i - 1]) / ((L[i] - L[i - 1]) || 1); return [lerp(P[i - 1][0], P[i][0], f), lerp(P[i - 1][1], P[i][1], f)]; }
  return P[P.length - 1];
}
function pipeBody(g, P, S) { g.strokeStyle = Gs(.2); g.lineWidth = S.cell * 1.3; g.lineJoin = 'round'; g.lineCap = 'round'; poly(g, P); g.stroke(); }
/* data in motion along a path. Glyphs densify as water becomes data */
function stream(G, P, t, speed) {
  var L = plen(P), tot = L[L.length - 1], n = Math.max(4, tot / (G.c * 1.1)) | 0, i, u, q;
  for (i = 0; i < n; i++) {
    if (hash(i, 3, 9) > .74) continue;
    u = (i / n + t * speed / tot / 1000) % 1; q = pat(P, L, u);
    G.put(q[0], q[1], RAMP[Math.min(RN - 1, 3 + Math.floor(u * 36))]);
  }
}
function pickup(G, m, t) {
  var c = G.c;
  for (var i = 0; i < 14; i++) {
    var a = i * 2.39996, ph = (t / 1400 + hash(i, 1, 1)) % 1, r = (1 - ph) * c * 6;
    G.put(m[0] + Math.cos(a) * r * 1.6, m[1] + Math.abs(Math.sin(a)) * r * .45 + c * .5, RAMP[1 + Math.floor(ph * 4)]);
  }
}
function gaugeLevel(t) { return .56 + .1 * Math.sin(t / 1700) + .03 * Math.sin(t / 430); }
function gaugeA(g, q, S, lv) {
  g.fillStyle = Gs(.1); g.fillRect(q.x, q.y, q.w, q.h);
  var fy = q.y + q.h * (1 - lv);
  g.fillStyle = grad(g, 0, fy, 0, q.y + q.h, Gs, .72, 1); g.fillRect(q.x, fy, q.w, q.y + q.h - fy);
  g.strokeStyle = Gs(.55); g.lineWidth = S.cell * .7; g.strokeRect(q.x, q.y, q.w, q.h);
}
function gaugeGlyphs(G, q, lv, readout) {
  var c = G.c;
  for (var i = 0; i <= 4; i++) { var s = String(i * 25); G.text(q.x - c * (s.length + 1.5), q.y + q.h * (1 - i / 4), s); }
  if (readout) G.text(q.x + q.w + c * 1.5, q.y + q.h * (1 - lv), 'draw ' + Math.round(lv * 100));
}
function agent(g, b, t) {
  var cx = b.x + b.w * .5, cy = b.y + b.h * .5, r = Math.min(b.w, b.h) * .32;
  g.save(); g.translate(cx, cy); g.rotate(-.22); g.strokeStyle = Gs(.34); g.lineWidth = Math.max(1, r * .04);
  g.beginPath(); g.ellipse(0, 0, r * 1.65, r * .42, 0, 0, 7); g.stroke(); g.restore();
  var gr = g.createRadialGradient(cx - r * .35, cy - r * .4, r * .05, cx, cy, r);
  gr.addColorStop(0, Gs(1)); gr.addColorStop(.55, Gs(.55)); gr.addColorStop(1, Gs(.14));
  g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, r, 0, 7); g.fill();
  var sy = Math.sin(t / 900) * r * .8, rx = Math.sqrt(Math.max(0, r * r - sy * sy));
  g.strokeStyle = Gs(1); g.lineWidth = r * .06; g.beginPath(); g.ellipse(cx, cy + sy, rx, r * .1, 0, 0, 7); g.stroke();
  g.fillStyle = Gs(.02); g.beginPath(); g.arc(cx, cy, r * .24, 0, 7); g.fill();
  g.fillStyle = Gs(1); g.beginPath(); g.arc(cx + Math.sin(t / 1300) * r * .07, cy + Math.sin(t / 2100) * r * .03, r * .08, 0, 7); g.fill();
  g.save(); g.translate(cx, cy); g.rotate(-.22); g.strokeStyle = Gs(.62); g.lineWidth = Math.max(1, r * .04);
  g.beginPath(); g.ellipse(0, 0, r * 1.65, r * .42, 0, 0, Math.PI); g.stroke(); g.restore();
}
function agentGlyphs(G, b, t) {
  var cx = b.x + b.w * .5, cy = b.y + b.h * .5, r = Math.min(b.w, b.h) * .32, ca = Math.cos(-.22), sa = Math.sin(-.22), k, j;
  for (k = 0; k < 3; k++) for (j = 0; j < 3; j++) {
    var a = t / 1600 + k * 2.1 - j * .09, ex = Math.cos(a) * r * 1.65, ey = Math.sin(a) * r * .42, x = ex * ca - ey * sa, y = ex * sa + ey * ca;
    if (Math.sin(a) < 0 && x * x + y * y < r * r) continue;
    G.put(cx + x, cy + y, '@%o'[j]);
  }
}
var LOG = [
  ['031402', 'AGENT', 'plan accepted', 'batch 0412'],
  ['031405', 'INTAKE', 'valve 2 open', 'flow 4.1'],
  ['031409', 'COOL', 'fans 6 of 6', 'load 81'],
  ['031413', 'INTAKE', 'flow 5.8', 'target 7.0'],
  ['031418', 'AGENT', 'raise draw', 'request'],
  ['031421', 'ALERT', 'draw at contract cap', '']
].map(function (r) { return (r[0] + ' ' + (r[1] + '       ').slice(0, 7) + (r[2] + '                ').slice(0, Math.max(14, r[2].length + 1)) + ' ' + r[3]).replace(/\s+$/, ''); });
/* typed system log. The ALERT row is the single saffron moment */
function logGlyphs(G, q, t, S) {
  var c = G.c, cps = 38, i, tot = 0;
  for (i = 0; i < LOG.length; i++) tot += LOG[i].length;
  if (S.logT0 == null) S.logT0 = t;
  var T = t - S.logT0; if (T > tot / cps * 1000 + 3600) { S.logT0 = t; T = 0; }
  var n = T * cps / 1000, x0 = q.x + c, y0 = q.y + c;
  G.text(x0, y0, 'NODE 07  INTAKE LOG');
  for (i = 0; i < LOG.length; i++) {
    var L = LOG[i], k = Math.floor(clamp(n, 0, L.length)), y = y0 + c * 2 * (i + 1);
    if (k > 0) G.text(x0, y, L.slice(0, k), L.indexOf('ALERT') > 0 ? 1 : 0);
    if (n >= 0 && n < L.length && Math.floor(t / 380) % 2) G.put(x0 + k * c, y, '#');
    n -= L.length; if (n < 0) break;
  }
}

/* ---------- law painters (gold vector) ---------- */
function prep(c, P) {
  c.strokeStyle = P.gold; c.fillStyle = P.gold; c.lineWidth = P.w; c.lineCap = 'round'; c.lineJoin = 'round';
  c.setLineDash(P.dash || (P.reveal < 1 ? [P.reveal * 3000 + .01, 3000] : []));
}
function ln(c, a) { c.beginPath(); c.moveTo(a[0], a[1]); for (var i = 2; i < a.length; i += 2) c.lineTo(a[i], a[i + 1]); c.stroke(); }
function rr(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.lineTo(x + w, y + h); c.lineTo(x, y + h); c.arcTo(x, y, x + w, y, r); c.closePath(); c.stroke(); }
function operator(c, b, P, ground) {
  prep(c, P);
  var h = b.h, x = b.x + b.w / 2, y = b.y;
  c.beginPath(); c.arc(x, y + h * .085, h * .06, 0, 7); c.stroke();
  ln(c, [x, y + h * .145, x, y + h * .2]);
  ln(c, [x - h * .11, y + h * .2, x + h * .11, y + h * .2]);
  ln(c, [x - h * .11, y + h * .2, x - h * .085, y + h * .54, x + h * .085, y + h * .54, x + h * .11, y + h * .2]);
  ln(c, [x - h * .06, y + h * .54, x - h * .075, y + h * .99]);
  ln(c, [x + h * .06, y + h * .54, x + h * .08, y + h * .99]);
  ln(c, [x - h * .11, y + h * .2, x - h * .16, y + h * .38, x - h * .15, y + h * .53]);
  ln(c, [x + h * .11, y + h * .2, x + h * .21, y + h * .11, x + h * .245, y + h * .0]);
  ln(c, [x + h * .225, y - h * .01, x + h * .27, y + h * .01]);
  if (ground !== false) ln(c, [x - h * .24, y + h, x + h * .24, y + h]);
}
function tribunal(c, b, P) {
  prep(c, P);
  var X = function (u) { return b.x + b.w * u; }, Y = function (v) { return b.y + b.h * v; }, s = [[.27, .26], [.5, .14], [.73, .26]], i, w = b.w * .13, r = Math.min(w * .3, b.h * .06);
  for (i = 0; i < 3; i++) {
    var cx = X(s[i][0]);
    rr(c, cx - w / 2, Y(s[i][1]), w, Y(.56) - Y(s[i][1]), r);
    rr(c, cx - w * .34, Y(s[i][1]) + w * .16, w * .68, Y(.56) - Y(s[i][1]) - w * .16, r * .6);
  }
  ln(c, [X(.08), Y(.56), X(.92), Y(.56), X(.94), Y(.6), X(.06), Y(.6), X(.08), Y(.56)]);
  c.beginPath(); c.rect(X(.09), Y(.6), b.w * .82, b.h * .28); c.stroke();
  for (i = 0; i < 3; i++) { c.beginPath(); c.rect(X(.115 + i * .2733), Y(.64), b.w * .2233, b.h * .2); c.stroke(); }
  ln(c, [X(.03), Y(.92), X(.97), Y(.92)]);
  ln(c, [X(0), Y(.97), X(1), Y(.97)]);
}
/* the contractual limit, a gold ceiling across the machine gauge */
function gaugeGold(c, q, cap, P, label) {
  prep(c, P);
  var y = Math.round(q.y + q.h * (1 - cap)) + .5, a = q.x - q.w * .7, z = q.x + q.w * 1.7;
  ln(c, [a, y, z, y]); ln(c, [a, y - 4, a, y + 4]); ln(c, [z, y - 4, z, y + 4]);
  if (label !== false && P.reveal > .95) { c.setLineDash([]); c.font = '600 10px ' + FONT; c.textAlign = 'right'; c.textBaseline = 'bottom'; c.fillText('CONTRACT LIMIT', z, y - 5); }
}

/* ---------- layers and scenes ---------- */
function D(depth, draw, anim) { return { k: 'd', depth: depth, draw: draw, anim: !!anim }; }
function A(depth, draw, glyphs, live) { return { k: 'a', depth: depth, draw: draw, glyphs: glyphs, live: live !== false }; }
function G(depth, draw) { return { k: 'g', depth: depth, draw: draw }; }

var VO = { x0: -.04, y0: .47, x1: 1.06, y1: 1.06, f: 6.5, p: .4, m: .05, w0: .002, w1: .05 };
var TO = { x0: .08, y0: .42, x1: .84, y1: 1.08, f: 4.5, p: 1.2, m: .12, w0: .006, w1: .07 };
var IO = { x0: -.05, y0: .66, x1: 1.05, y1: .86, f: 3, p: 1, m: .02, w0: .06, w1: .03, k: 1 };
var FO = { x0: .1, y0: .46, x1: 1.04, y1: 1.06, f: 6, p: .2, m: .045, w0: .006, w1: .05 };
var CAP = .78;
function intakePts(b) { var p = rp(.28, b, IO); return [[p.x, p.y], [p.x, b.y + b.h * .36], [b.x + b.w * .6, b.y + b.h * .36], [b.x + b.w * .6, b.y + b.h * .2], [b.x + b.w * .86, b.y + b.h * .2]]; }
function filmPipe(b) { var p = rp(.3, b, FO); return [[p.x, p.y], [p.x, b.y + b.h * .53], [b.x + b.w * .33, b.y + b.h * .53], [b.x + b.w * .33, b.y + b.h * .5]]; }
var FDC = [.22, .3, .14, .2], FGA = [.935, .14, .022, .72];

var SCENES = {
  valley: { title: 'River valley', role: 'world', layers: [
    D(.02, function (g, b) { sky(g, b, { hz: .42, top: .04, bot: .24, sun: [.72, .31, .026, .52], clouds: 3 }); }),
    D(.12, function (g, b) { ridge(g, b, .36, .05, 11, .26, .32); }),
    D(.25, function (g, b) { ridge(g, b, .45, .06, 23, .38, .48); }),
    D(.45, function (g, b) { ridge(g, b, .56, .05, 37, .48, .62); furrows(g, b, .68, 8, .7); }),
    D(.6, function (g, b) { river(g, b, VO, .34, .68); border(g, b, .7, .38, .42, 1.04); })
  ] },
  towns: { title: 'Downstream towns', role: 'world', layers: [
    D(.02, function (g, b) { sky(g, b, { hz: .32, top: .04, bot: .2, clouds: 8 }); }),
    D(.15, function (g, b) { ridge(g, b, .3, .04, 61, .28, .34); }),
    D(.35, function (g, b) { ridge(g, b, .4, .05, 67, .44, .58); }),
    D(.6, function (g, b) { river(g, b, TO, .38, .7); townsAlong(g, b, TO, [[.22, -1, .012, 6, .08], [.3, 1, .014, 7, .1], [.52, -1, .019, 7, .13], [.62, 1, .021, 6, .12], [.84, 1, .028, 5, .15]]); })
  ] },
  reservoir: { title: 'Reservoir and dam', role: 'world', layers: [
    D(.02, function (g, b) { sky(g, b, { hz: .4, top: .04, bot: .22, clouds: 13 }); }),
    D(.12, function (g, b) { ridge(g, b, .33, .04, 71, .26, .3); }),
    D(.25, function (g, b) { ridge(g, b, .41, .05, 73, .36, .44); }),
    D(.5, function (g, b) { reservoir(g, b); })
  ] },
  skyline: { title: 'Civic skyline', role: 'world', layers: [
    D(.03, function (g, b) { skylineBack(g, b); }),
    D(.4, function (g, b) { skyline(g, b); })
  ] },
  datacentre: { title: 'Data centre', role: 'machine', layers: [
    D(.02, function (g, b) { sky(g, b, { hz: .55, top: .04, bot: .2 }); }),
    D(.15, function (g, b) { ridge(g, b, .52, .04, 81, .3, .36); }),
    D(.3, function (g, b) { ridge(g, b, .7, .02, 83, .44, .56); }),
    A(.3, function (g, b, t) { dcentre(g, box(b, .2, .26, .6, .6), t); }, function (G, b, t) { dcGlyphs(G, box(b, .2, .26, .6, .6), t); })
  ] },
  intake: { title: 'Intake pipe', role: 'machine', layers: [
    D(.02, function (g, b) { sky(g, b, { hz: .45, top: .04, bot: .22 }); }),
    D(.15, function (g, b) { ridge(g, b, .42, .04, 91, .3, .36); }),
    D(.35, function (g, b) { ridge(g, b, .55, .03, 93, .46, .6); }),
    D(.5, function (g, b) { river(g, b, IO, .45, .7); }),
    A(.5, function (g, b, t, S) { var P = intakePts(b), e = P[P.length - 1]; pipeBody(g, P, S); g.fillStyle = Gs(.62); g.fillRect(e[0] - S.cell, e[1] - S.cell * 2.5, S.cell * 5, S.cell * 5); },
      function (G, b, t) { var P = intakePts(b); stream(G, P, t, 90); pickup(G, P[0], t); })
  ] },
  agent: { title: 'Autonomous agent', role: 'machine', layers: [
    A(0, function (g, b, t) { agent(g, b, t); }, agentGlyphs)
  ] },
  logs: { title: 'System log', role: 'machine', layers: [
    A(0, null, function (G, b, t, S) { logGlyphs(G, box(b, .04, .06, .92, .9), t, S); })
  ] },
  gauge: { title: 'Gauge and contract limit', role: 'machine and law', layers: [
    A(0, function (g, b, t, S) { gaugeA(g, box(b, .46, .1, .08, .8), S, gaugeLevel(t)); }, function (G, b, t) { gaugeGlyphs(G, box(b, .46, .1, .08, .8), gaugeLevel(t), true); }),
    G(0, function (c, b, t, P) { gaugeGold(c, box(b, .46, .1, .08, .8), CAP, P); })
  ] },
  operator: { title: 'Human operator', role: 'law', layers: [
    G(0, function (c, b, t, P) { operator(c, box(b, .4, .12, .2, .78), P); })
  ] },
  tribunal: { title: 'Arbitral tribunal', role: 'law', layers: [
    G(0, function (c, b, t, P) { tribunal(c, box(b, .14, .08, .72, .84), P); })
  ] },
  machine: { title: 'Machine console', role: 'machine', layers: [
    A(0, function (g, b, t) { agent(g, box(b, .02, .06, .36, .88), t); }, function (G, b, t) { agentGlyphs(G, box(b, .02, .06, .36, .88), t); }),
    A(0, null, function (G, b, t, S) { logGlyphs(G, box(b, .4, .1, .58, .86), t, S); })
  ] },
  law: { title: 'Operator and tribunal', role: 'law', layers: [
    G(0, function (c, b, t, P) { operator(c, box(b, .06, .2, .14, .7), P); }),
    G(0, function (c, b, t, P) { tribunal(c, box(b, .28, .08, .66, .86), P); })
  ] },
  film: { title: 'Film frame', role: 'composite', layers: [
    D(.02, function (g, b) { sky(g, b, { hz: .4, top: .04, bot: .24, sun: [.62, .27, .018, .5], clouds: 9 }); }),
    D(.1, function (g, b) { ridge(g, b, .34, .045, 11, .24, .3); }),
    D(.22, function (g, b) { ridge(g, b, .42, .055, 23, .36, .46); }),
    D(.38, function (g, b) { ridge(g, b, .53, .05, 37, .46, .6); furrows(g, b, .66, 9, .68); }),
    D(.38, function (g, b) { reservoir(g, box(b, 0, .3, .2, .22), { sh: .44, out: false }); }),
    D(.5, function (g, b) { river(g, b, FO, .34, .7); border(g, b, .72, .36, .5, 1.04); townsAlong(g, b, FO, [[.58, 1, .011, 6, .06], [.67, -1, .013, 7, .07], [.8, 1, .017, 7, .08], [.9, -1, .021, 5, .08]]); }),
    A(.45, function (g, b, t) { dcentre(g, box(b, FDC[0], FDC[1], FDC[2], FDC[3]), t, 3); }, function (G, b, t) { dcGlyphs(G, box(b, FDC[0], FDC[1], FDC[2], FDC[3]), t, 3); }),
    A(.48, function (g, b, t, S) { pipeBody(g, filmPipe(b), S); }, function (G, b, t) { var P = filmPipe(b); stream(G, P, t, 60); pickup(G, P[0], t); }),
    A(0, function (g, b, t, S) { gaugeA(g, box(b, FGA[0], FGA[1], FGA[2], FGA[3]), S, gaugeLevel(t)); }, function (G, b, t) { gaugeGlyphs(G, box(b, FGA[0], FGA[1], FGA[2], FGA[3]), gaugeLevel(t)); }),
    G(0, function (c, b, t, P) { gaugeGold(c, box(b, FGA[0], FGA[1], FGA[2], FGA[3]), CAP, P); }),
    G(.8, function (c, b, t, P) { operator(c, box(b, .74, .5, .1, .42), P, false); })
  ] }
};

/* ---------- glyph atlas. Each glyph centred in a fixed square cell at weight 500 ---------- */
var ATL = {};
function atlas(cs, col) {
  cs = Math.max(4, Math.round(cs)); var k = cs + col, a = ATL[k];
  if (a) return a;
  var cv = document.createElement('canvas'); cv.width = cs * 96; cv.height = cs;
  return (ATL[k] = { cv: cv, x: cv.getContext('2d'), s: cs, m: {}, n: 0, col: col });
}
function glyph(a, ch) {
  var i = a.m[ch]; if (i != null) return i;
  i = a.m[ch] = Math.min(a.n++, 95);
  var x = a.x; x.fillStyle = a.col; x.font = '500 ' + Math.round(a.s * .9) + 'px ' + FONT; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.clearRect(i * a.s, 0, a.s, a.s); x.fillText(ch, i * a.s + a.s / 2, a.s * .55);
  return i;
}
function Grid(S) { this.S = S; this.ox = 0; this.oy = 0; }
Object.defineProperty(Grid.prototype, 'c', { get: function () { return env.cell; } });
Grid.prototype.put = function (x, y, ch, col) {
  var S = this.S, c = env.cell, cx = Math.floor((x + this.ox) / c), cy = Math.floor((y + this.oy) / c);
  if (cx < 0 || cy < 0 || cx >= S.cols || cy >= S.rows) return;
  var i = cy * S.cols + cx; S.ch[i] = ch; S.co[i] = col || 0;
};
Grid.prototype.text = function (x, y, s, col) { for (var k = 0; k < s.length; k++) if (s[k] !== ' ') this.put(x + k * env.cell, y, s[k], col); };

/* ---------- stage ---------- */
var stages = [], raf = 0, io = null, ro = null;
var STATS = { fps: 0, draws: 0, ms: 0, active: 0, total: 0, dpx: 0, cells: 0 }, ACC = { f: 0, w: 0, d: 0, px: 0, c: 0, t: 0 };
function off(S, L) { return { x: S.cam.x * L.depth * S.W * .035, y: S.cam.y * L.depth * S.H * .03 }; }
function mk() { return document.createElement('canvas'); }

function Stage(cv, o) {
  o = o || {};
  this.c = cv; this.x = cv.getContext('2d'); this.o = o;
  this.sc = typeof o.scene === 'string' ? SCENES[o.scene] : o.scene;
  if (!this.sc) throw new Error('IIDW unknown scene ' + o.scene);
  this.gname = o.ground === 'paper' ? 'paper' : 'navy'; this.th = THEME[this.gname];
  this.p = { bias: 0, noise: 0, drift: 2, offX: 0, offY: 0, matrix: 'auto', gamma: 1, gw: 1.5, reveal: 1, live: true };
  for (var k in (o.params || {})) this.p[k] = o.params[k];
  this.cam = { x: 0, y: 0, tx: 0, ty: 0 }; this.tw = []; this.vis = !io; this.ta = 0; this.ms = 0;
  var L = this.sc.layers;
  this.dL = L.filter(function (l) { return l.k === 'd'; }); this.aL = L.filter(function (l) { return l.k === 'a'; }); this.gL = L.filter(function (l) { return l.k === 'g'; });
  this.aLive = this.aL.some(function (l) { return l.live; }); this.dAnim = this.dL.some(function (l) { return l.anim; });
  this.G = new Grid(this); this.needSize = true; this.sNext = !!o.scramble; this.scrEnd = 0;
  if (this.dL.length) { this.ds = mk(); this.dx = this.ds.getContext('2d', { willReadFrequently: true }); this.lo = mk(); this.lx = this.lo.getContext('2d'); }
  if (this.aL.length) { this.as = mk(); this.ax = this.as.getContext('2d', { willReadFrequently: true }); this.acv = mk(); this.acx = this.acv.getContext('2d'); }
  stages.push(this); if (io) io.observe(cv); if (ro) ro.observe(cv);
  if (o.parallax) this._pointer();
  if (o.dissolve) this.dissolveIn(o.dissolve === true ? 1600 : o.dissolve);
  kick();
}
var SP = Stage.prototype;
SP.resize = function () {
  var W = this.c.clientWidth || 300, H = this.c.clientHeight || 150, d = env.dpr;
  this.W = W; this.H = H; this.c.width = Math.round(W * d); this.c.height = Math.round(H * d);
  if (this.dL.length) {
    var cw = Math.ceil(W / env.px), ch = Math.ceil(H / env.px);
    this.cw = cw; this.chh = ch; this.ds.width = this.lo.width = cw; this.ds.height = this.lo.height = ch;
    this.img = this.lx.createImageData(cw, ch); this.u = new Uint32Array(this.img.data.buffer); this.srcD = true;
  }
  if (this.aL.length) {
    var cols = Math.ceil(W / env.cell), rows = Math.ceil(H / env.cell), n = cols * rows;
    this.cols = cols; this.rows = rows; this.as.width = cols; this.as.height = rows;
    this.acv.width = this.c.width; this.acv.height = this.c.height;
    this.ch = new Array(n); this.co = new Uint8Array(n); this.scT = new Float32Array(n); this.srcA = true;
  }
  this.needSize = false; this.dirtyC = true;
};
SP.box = function () { return { x: 0, y: 0, w: this.W, h: this.H }; };
SP.renderD = function (t) {
  var g = this.dx, px = env.px, b = this.box();
  g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = '#000'; g.fillRect(0, 0, this.cw, this.chh);
  for (var i = 0; i < this.dL.length; i++) {
    var L = this.dL[i], f = off(this, L);
    g.save(); g.setTransform(1 / px, 0, 0, 1 / px, f.x / px, f.y / px); L.draw(g, b, t, this); g.restore();
  }
  var d = this.dd = g.getImageData(0, 0, this.cw, this.chh).data, w = false;
  for (i = 0; i < d.length && !w; i += 4) if (d[i + 2] > d[i]) w = true;
  this.hasW = w;
};
SP.ditherD = function (t) {
  var d = this.dd, u = this.u, cw = this.cw, ch = this.chh, p = this.p, B = BAYER, N = blue(), th = this.th,
    iL = u32(th.land), iW = u32(th.water), gr = u32(th.ground), bias = p.bias, nz = p.noise, ox = p.offX | 0, oy = p.offY | 0,
    wx = Math.floor(t * p.drift / 1000), wy = Math.floor(t * p.drift * .37 / 1000), mx = p.matrix,
    seed = (Math.random() * 4294967295) >>> 0 || 1, x, y, i = 0, j, r, bl, w, v, m;
  for (y = 0; y < ch; y++) for (x = 0; x < cw; x++, i++) {
    j = i << 2; r = d[j]; bl = d[j + 2]; w = bl > r; v = (w ? bl : r) / 255;
    if (mx === 'blue' || (mx === 'auto' && w)) m = w ? N[((y + wy) & 31) * 32 + ((x + wx) & 31)] : N[((y + oy) & 31) * 32 + ((x + ox) & 31)];
    else m = B[((y + oy) & 7) * 8 + ((x + ox) & 7)];
    if (nz > 0) { seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; v = v * (1 - nz) + ((seed >>> 0) / 4294967296) * nz; }
    u[i] = v - bias > m ? (w ? iW : iL) : gr;
  }
  this.lx.putImageData(this.img, 0, 0); ACC.px += cw * ch;
};
SP.renderA = function (t) {
  var g = this.ax, c = env.cell, cols = this.cols, rows = this.rows, n = cols * rows, b = this.box(), i, L, f;
  g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = '#000'; g.fillRect(0, 0, cols, rows);
  for (i = 0; i < this.aL.length; i++) {
    L = this.aL[i]; if (!L.draw) continue; f = off(this, L);
    g.save(); g.setTransform(1 / c, 0, 0, 1 / c, f.x / c, f.y / c); L.draw(g, b, t, this); g.restore();
  }
  var d = g.getImageData(0, 0, cols, rows).data, ch = this.ch, co = this.co, gm = this.p.gamma, v;
  for (i = 0; i < n; i++) { v = d[i << 2] / 255; if (gm !== 1) v = Math.pow(v, gm); ch[i] = RAMP[Math.round(v * (RN - 1))]; co[i] = 0; }
  for (i = 0; i < this.aL.length; i++) {
    L = this.aL[i]; if (!L.glyphs) continue; f = off(this, L);
    this.G.ox = f.x; this.G.oy = f.y; L.glyphs(this.G, b, t, this);
  }
  if (this.scrEnd > t) for (i = 0; i < n; i++) if (ch[i] !== ' ' && this.scT[i] > t) ch[i] = RAMP[3 + ((Math.random() * (RN - 3)) | 0)];
  var x = this.acx, cs = c * env.dpr, A0 = atlas(cs, this.th.ascii), A1 = atlas(cs, PAL.saffron), s, a, gi, px, py;
  x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, this.acv.width, this.acv.height); x.fillStyle = this.th.ground;
  for (i = 0; i < n; i++) {
    s = ch[i]; if (s === ' ') continue;
    px = Math.round((i % cols) * cs); py = Math.round(((i / cols) | 0) * cs);
    x.fillRect(px, py, A0.s, A0.s);
    a = co[i] ? A1 : A0; gi = glyph(a, s); x.drawImage(a.cv, gi * a.s, 0, a.s, a.s, px, py, a.s, a.s);
  }
  ACC.c += n;
};
SP.composite = function (t) {
  var x = this.x, d = env.dpr, i;
  x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.fillStyle = this.th.ground; x.fillRect(0, 0, this.c.width, this.c.height);
  if (this.dL.length) { x.imageSmoothingEnabled = false; var s = env.px * d; x.drawImage(this.lo, 0, 0, this.lo.width * s, this.lo.height * s); }
  if (this.aL.length) x.drawImage(this.acv, 0, 0);
  if (this.gL.length) {
    var P = { gold: this.th.gold, w: this.p.gw * (this.gname === 'paper' ? 1.25 : 1), reveal: this.p.reveal }, b = this.box();
    for (i = 0; i < this.gL.length; i++) { var f = off(this, this.gL[i]); x.save(); x.setTransform(d, 0, 0, d, f.x * d, f.y * d); this.gL[i].draw(x, b, t, P); x.restore(); }
  }
  ACC.d++;
};
SP.frame = function (t) {
  var w0 = now(), S = this, tw = false, comp;
  if (this.needSize) this.resize();
  if (this.o.onFrame) this.o.onFrame(t, this);
  if (this.tw.length) {
    tw = true;
    this.tw = this.tw.filter(function (z) { var f = clamp((t - z.t0) / z.ms, 0, 1); S.p[z.k] = lerp(z.a, z.b, ease(f)); if (f >= 1) { if (z.done) z.done(); return false; } return true; });
  }
  var cm = this.cam;
  if (this.o.autoCam && !this.ptr) { cm.tx = Math.sin(t / 5200) * .7; cm.ty = Math.sin(t / 7300) * .35; }
  if (Math.abs(cm.tx - cm.x) + Math.abs(cm.ty - cm.y) > .002) { cm.x += (cm.tx - cm.x) * .08; cm.y += (cm.ty - cm.y) * .08; this.srcD = this.srcA = true; this.dirtyC = true; }
  comp = this.dirtyC || tw;
  if (this.dL.length) {
    if (this.srcD || this.dAnim) { this.renderD(t); this.srcD = false; this.redD = true; }
    var wk = Math.floor(t * this.p.drift / 1000) + ',' + Math.floor(t * this.p.drift * .37 / 1000);
    if (this.redD || tw || this.p.noise > 0 || (this.hasW && wk !== this.wk)) { this.wk = wk; this.ditherD(t); this.redD = false; comp = true; }
  }
  if (this.aL.length && t - this.ta >= 33.3) {
    if (this.sNext) { this.scramble(t); this.sNext = false; }
    if (this.srcA || (this.p.live && this.aLive) || this.scrEnd > t - 40) { this.renderA(t); this.srcA = false; this.ta = t; comp = true; }
  }
  if (comp) { this.composite(t); this.dirtyC = false; }
  this.ms = now() - w0;
};
SP.set = function (k, v) {
  this.p[k] = v;
  if (k === 'gamma' || k === 'live') this.srcA = true; else if (k === 'gw' || k === 'reveal') this.dirtyC = true; else this.redD = true;
  this.dirtyC = true; kick(); return this;
};
SP.tween = function (k, to, ms, done) {
  this.tw = this.tw.filter(function (z) { return z.k !== k; });
  this.tw.push({ k: k, a: this.p[k], b: to, t0: now(), ms: ms || 1000, done: done }); kick(); return this;
};
SP.dissolveIn = function (ms) { this.p.noise = 1; this.redD = true; this.tween('noise', 0, ms || 1600); if (this.aL.length) this.sNext = true; if (this.gL.length) { this.p.reveal = 0; this.tween('reveal', 1, ms || 1600); } return this; };
SP.night = function (on, ms) { return this.tween('bias', on ? .42 : 0, ms || 2400); };
SP.drawOn = function (ms) { this.p.reveal = 0; return this.tween('reveal', 1, ms || 1800); };
SP.scramble = function (t) {
  t = t || now(); if (!this.scT) { this.sNext = true; return this; }
  for (var i = 0; i < this.scT.length; i++) this.scT[i] = t + 300 + Math.random() * 300;
  this.scrEnd = t + 600; kick(); return this;
};
SP.type = function () { this.logT0 = now(); kick(); return this; };
SP.setGround = function (g) { this.gname = g === 'paper' ? 'paper' : 'navy'; this.th = THEME[this.gname]; this.redD = this.srcA = this.dirtyC = true; kick(); return this; };
SP.setCam = function (x, y, ptr) { this.cam.tx = clamp(x, -1, 1); this.cam.ty = clamp(y, -1, 1); if (ptr) this.ptr = true; kick(); return this; };
SP.releaseCam = function () { this.ptr = false; this.cam.tx = 0; this.cam.ty = 0; kick(); return this; };
SP._pointer = function () {
  var S = this, c = this.c;
  this._pm = function (e) { var r = c.getBoundingClientRect(); S.setCam(((e.clientX - r.left) / r.width - .5) * 2, ((e.clientY - r.top) / r.height - .5) * 2, true); };
  this._pl = function () { S.releaseCam(); };
  c.addEventListener('pointermove', this._pm); c.addEventListener('pointerleave', this._pl);
};
SP.destroy = function () {
  var i = stages.indexOf(this); if (i >= 0) stages.splice(i, 1);
  if (io) io.unobserve(this.c); if (ro) ro.unobserve(this.c);
  if (this._pm) { this.c.removeEventListener('pointermove', this._pm); this.c.removeEventListener('pointerleave', this._pl); }
};

/* ---------- scheduler. One loop, paused offscreen and while the tab is hidden ---------- */
function find(el) { for (var i = 0; i < stages.length; i++) if (stages[i].c === el) return stages[i]; return null; }
function kick() { if (!raf && !document.hidden) raf = requestAnimationFrame(tick); }
function tick(t) {
  raf = 0; if (document.hidden) return;
  var w0 = now(), act = 0, i;
  for (i = 0; i < stages.length; i++) { if (!stages[i].vis) continue; act++; stages[i].frame(t); }
  ACC.f++; ACC.w += now() - w0;
  if (!ACC.t) ACC.t = t;
  if (t - ACC.t >= 500) {
    var k = 1000 / (t - ACC.t);
    STATS.fps = Math.round(ACC.f * k); STATS.draws = Math.round(ACC.d * k); STATS.ms = +(ACC.w / ACC.f).toFixed(2);
    STATS.dpx = Math.round(ACC.px * k); STATS.cells = Math.round(ACC.c * k);
    ACC.f = ACC.w = ACC.d = ACC.px = ACC.c = 0; ACC.t = t;
  }
  STATS.active = act; STATS.total = stages.length;
  if (act) raf = requestAnimationFrame(tick); else { STATS.fps = 0; ACC.t = 0; }
}
if (root.IntersectionObserver) io = new IntersectionObserver(function (es) {
  es.forEach(function (e) { var s = find(e.target); if (s) { s.vis = e.isIntersecting; if (s.vis) { s.dirtyC = true; s.ta = 0; kick(); } } });
}, { rootMargin: '48px' });
if (root.ResizeObserver) ro = new ResizeObserver(function (es) { es.forEach(function (e) { var s = find(e.target); if (s) { s.needSize = true; kick(); } }); });
document.addEventListener('visibilitychange', function () { if (document.hidden) { cancelAnimationFrame(raf); raf = 0; STATS.fps = 0; ACC.t = 0; } else kick(); });
root.addEventListener('resize', function () { var p = env.px, c = env.cell, d = env.dpr; readEnv(); if (p !== env.px || c !== env.cell || d !== env.dpr) { ATL = {}; stages.forEach(function (s) { s.needSize = true; }); kick(); } });
function refont() { ATL = {}; stages.forEach(function (s) { s.srcA = true; s.dirtyC = true; }); kick(); }
if (document.fonts) {
  if (document.fonts.load) document.fonts.load('500 20px "Plus Jakarta Sans"').then(refont, function () {});
  if (document.fonts.addEventListener) document.fonts.addEventListener('loadingdone', refont);
}

/* ---------- public API ---------- */
function setEnv(f) { env.forced = f || null; readEnv(); ATL = {}; stages.forEach(function (s) { s.needSize = true; }); kick(); }
function stage(cv, o) { return new Stage(cv, o); }
/* plain React adapter. Pass your React in, get a Stage component and a hook */
function react(React) {
  var h = React.createElement;
  function useStage(ref, o, deps) {
    var s = React.useRef(null);
    React.useEffect(function () { s.current = stage(ref.current, o); if (o.onReady) o.onReady(s.current); return function () { s.current.destroy(); s.current = null; }; }, deps || [o.scene, o.ground]);
    return s;
  }
  function StageC(props) {
    var ref = React.useRef(null);
    useStage(ref, props, [props.scene, props.ground]);
    var sc = SCENES[props.scene] || {};
    return h('canvas', { ref: ref, role: 'img', 'aria-label': props.label || sc.title, className: props.className, style: Object.assign({ display: 'block', width: '100%', aspectRatio: props.aspect || '2 / 1' }, props.style) });
  }
  return { Stage: StageC, useStage: useStage };
}

root.IIDW = {
  PAL: PAL, RAMP: RAMP, FONT: FONT, THEME: THEME, BAYER: BAYER, blue: blue, env: env, setEnv: setEnv,
  stage: stage, SCENES: SCENES, layer: { D: D, A: A, G: G }, LOG: LOG,
  paint: { sky: sky, ridge: ridge, furrows: furrows, river: river, rp: rp, border: border, house: house, town: town, townsAlong: townsAlong, reservoir: reservoir, skyline: skyline, skylineBack: skylineBack, hand: hand, Ls: Ls, Ws: Ws },
  machine: { dcentre: dcentre, dcGlyphs: dcGlyphs, fan: fan, stream: stream, pickup: pickup, pipeBody: pipeBody, gaugeA: gaugeA, gaugeGlyphs: gaugeGlyphs, gaugeLevel: gaugeLevel, agent: agent, agentGlyphs: agentGlyphs, logGlyphs: logGlyphs, Gs: Gs },
  law: { operator: operator, tribunal: tribunal, gaugeGold: gaugeGold, prep: prep },
  util: { rng: rng, hash: hash, box: box, clamp: clamp, lerp: lerp, ease: ease },
  stats: function () { return { fps: STATS.fps, draws: STATS.draws, ms: STATS.ms, active: STATS.active, total: STATS.total, dpx: STATS.dpx, cells: STATS.cells, dpr: env.dpr, px: env.px, cell: env.cell, phone: env.phone, bytes: BYTES }; },
  react: react, version: '1.0.0'
};
})(window);
