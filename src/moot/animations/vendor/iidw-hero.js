/* eslint-disable */
/* Exported from the Claude Design canvas "IIDW Moot 2027 Visual Kit" on 28 October 2026. Kept as delivered so later exports can replace it whole. */
/* IIDW moot site opening hero. A sixteen second film in five beats, then a resting title frame.
   Requires iidw-engine.js. Exposes IIDW.hero.film (framework free director) and IIDW.hero.react(React) for a plain React component. */
(function (root) {
'use strict';
var I = root.IIDW;
if (!I) { if (root.console) console.error('iidw-hero.js needs iidw-engine.js loaded first'); return; }
var P = I.paint, M = I.machine, LW = I.law, U = I.util, clamp = U.clamp, ease = U.ease, hash = U.hash, box = U.box, RAMP = I.RAMP;
var BEATS = [[1.2, 4], [4, 7], [7, 9.5], [9.5, 12], [12, 14.5]], END = 16.6, TITLE_AT = 16, KEY = 'iidw-moot-hero-seen', MQ_NARROW = '(max-width: 767px)';
var PRESENTER = 'Chandigarh International Arbitration Centre and India International Disputes Week present';
var DEFAULTS = {
  captions: [
    'A river crosses a border and supplies every town that lies downstream.',
    'A data centre upstream promises to draw no more than a fixed volume each day and to leave the reservoir under human control.',
    'An overnight update changes how the system measures its own limit, and no engineer signs the change.',
    'The system asks the reservoir to hold back its release, and the interface records an approval three minutes later without a human name.',
    'The river falls below the agreed standard, and the downstream authority spends heavily to keep water flowing to its towns.'
  ],
  eyebrow: 'The CIAC legacy moot',
  headline: 'When an autonomous system acts on a shared river, a tribunal must decide who answers for it.',
  lead: 'This is the first moot argued under the CIAC (Arbitration Proceedings) Rules 2026, with oral rounds in Chandigarh in January 2027.',
  primaryCta: { label: 'Notify me when registration opens', href: '#register' },
  secondaryCta: { label: 'Read about the competition', href: '#competition' }
};
var TRANSCRIPT = 'Short film, about sixteen seconds. A gold line draws across a dark screen. A dithered river valley resolves, with towns downstream. ' +
  'A data centre assembles upstream in characters and begins to draw water through an intake. A gold limit line and a gold operator figure stand beside the reservoir. ' +
  'Night falls. A log reads Limit mode changed at 0214 hrs, then Approver not recorded, and the gold limit breaks into dots. ' +
  'A pulse runs from the data centre to the reservoir, a counter climbs to 180, the word Accepted appears and the operator field stays empty. ' +
  'The river thins and its flow falls below a threshold of 80, marked by one orange alert. The valley dissolves into a modernist civic skyline with a raised open hand, and three tribunal seats rise.';

function lin(a, b, t) { return clamp((t - a) / (b - a), 0, 1); }
function sm(a, b, t) { t = lin(a, b, t); return t * t * (3 - 2 * t); }
function mq(q) { try { return !!(root.matchMedia && root.matchMedia(q).matches); } catch (e) { return false; } }
function store(v) { try { if (v === undefined) return root.sessionStorage.getItem(KEY); root.sessionStorage.setItem(KEY, v); } catch (e) { return null; } }
function plen(Q) { var L = [0]; for (var i = 1; i < Q.length; i++) L.push(L[i - 1] + Math.hypot(Q[i][0] - Q[i - 1][0], Q[i][1] - Q[i - 1][1])); return L; }
function pat(Q, L, u) {
  var d = u * L[L.length - 1];
  for (var i = 1; i < Q.length; i++) if (L[i] >= d) { var f = (d - L[i - 1]) / ((L[i] - L[i - 1]) || 1); return [Q[i - 1][0] + (Q[i][0] - Q[i - 1][0]) * f, Q[i - 1][1] + (Q[i][1] - Q[i - 1][1]) * f]; }
  return Q[Q.length - 1];
}

/* 5 by 7 block letters for the counter and the stamp, one cell per bit */
var BF = {
  '0': '01110100011001110101110011000101110', '1': '00100011000010000100001000010001110', '2': '01110100010000100110010001000011111',
  '3': '11110000010000101110000010000111110', '4': '00010001100101010010111110001000010', '5': '11111100001111000001000011000101110',
  '6': '00110010001000011110100011000101110', '7': '11111000010001000100010000100001000', '8': '01110100011000101110100011000101110',
  '9': '01110100011000101111000010001001100', 'A': '01110100011000111111100011000110001', 'C': '01111100001000010000100001000001111',
  'E': '11111100001000011110100001000011111', 'P': '11110100011000111110100001000010000', 'T': '11111001000010000100001000010000100',
  'D': '11110100011000110001100011000111110'
};
function blockW(s, k) { return (s.length * 6 - 1) * k; }
function block(G, x, y, s, k, ch) {
  var c = G.c, i, r, q, a, b, bm;
  for (i = 0; i < s.length; i++) {
    bm = BF[s[i]]; if (!bm) continue;
    for (r = 0; r < 7; r++) for (q = 0; q < 5; q++) if (bm[r * 5 + q] === '1')
      for (a = 0; a < k; a++) for (b = 0; b < k; b++) G.put(x + ((i * 6 + q) * k + b) * c, y + (r * k + a) * c, ch);
  }
}

var FO = { x0: .1, y0: .46, x1: 1.04, y1: 1.06, f: 6, p: .2, m: .045, w0: .006, w1: .05 };
var CITYR = { x0: -.15, y0: .87, x1: 1.15, y1: .96, f: 3, p: .5, m: .02, w0: .011, w1: .008, k: 1 };
var TOWNS = [[.58, 1, .011, 6, .06], [.67, -1, .013, 7, .07], [.8, 1, .017, 7, .08], [.9, -1, .021, 5, .08]];
var LOG = ['Limit mode changed at 0214 hrs', 'Approver not recorded'];
function flowV(u) { return 100 - 40 * sm(.15, .85, u) + 2.5 * Math.sin(u * 19); }
var UC = (function () { for (var u = 0; u <= 1; u += .002) if (flowV(u) <= 80) return u; return .5; })();
var TC = 12.2 + UC * 1.8;

/* ---------- the director ---------- */
function film(cv, o) {
  o = o || {};
  var F = { T: 0, ms: 0, fonts: false, narrow: !!o.narrow, scene: 'valley', dv: false, push: 0, towns: 0, rw: 1, rd: 1, bar: 1, mask: 0, seats: 0, bias: 0, noise: 0, cb: null, sb: null, focus: [0, 0], W: 0, H: 0 };
  var d = { mode: 'film', playing: true, T: 0, prev: 0, last: null, ui: '', done: false, reduced: !!o.reducedMotion || mq('(prefers-reduced-motion: reduce)'), S: null, dirty: true };

  function layout(S) {
    var W = S.W, H = S.H, vw = Math.max(W, H * 1.6), x = clamp(W * .5 - vw * .3, W - vw, 0);
    F.W = W; F.H = H; F.cb = { x: x, y: 0, w: vw, h: H }; F.focus = [x + vw * .3, H * .45];
    if (F.narrow) { var sw = Math.max(W, H * 1.25); F.sb = { x: (W - sw) / 2, y: 0, w: sw, h: H }; }
    else F.sb = { x: W * .3, y: 0, w: W * .7, h: H };
  }
  function sc(dep) { return 1 + F.push * (.03 + .1 * dep); }
  function tp(x, y, dep) { var s = sc(dep); return [F.focus[0] + (x - F.focus[0]) * s, F.focus[1] + (y - F.focus[1]) * s]; }
  function tb(q, dep) { var a = tp(q.x, q.y, dep), s = sc(dep); return { x: a[0], y: a[1], w: q.w * s, h: q.h * s }; }
  function dcBox() { return tb(box(F.cb, .22, .3, .14, .2), .5); }
  function gaugeBox() { return tb(box(F.cb, .385, .24, .012, .26), .5); }
  function opBox() { return tb(box(F.cb, .155, .36, .045, .16), .5); }
  function resPt() { return tp(F.cb.x + F.cb.w * .1, F.H * .39, .5); }
  function pipePts() {
    var p = P.rp(.3, F.cb, FO), a = tp(p.x, p.y, .5), q = dcBox(), y = q.y + q.h + F.H * .03, x = q.x + q.w * .8;
    return [a, [a[0], y], [x, y], [x, q.y + q.h]];
  }
  function chartR() { var W = F.W, H = F.H; return F.narrow ? { x: W * .1, y: H * .15, w: W * .8, h: H * .2 } : { x: W * .55, y: H * .15, w: W * .34, h: H * .2 }; }
  function vy(R, v) { return R.y + (110 - v) / 50 * R.h; }
  function level(T) { var b = .55 + .04 * Math.sin(T * 1.3); return T < 9.5 ? b : Math.min(.97, b + .42 * ease(lin(9.8, 11.2, T))); }
  function fanT(T) { var x = T - 4.6; return x <= 0 ? 0 : x < 1 ? x * x * 500 : (x - .5) * 1000; }
  function asciiOn() { return F.fonts && F.scene === 'valley' && F.T >= 4 && F.T < 14.95; }

  function compute(T) {
    F.T = T; F.ms = T * 1000; F.dv = T >= 1.2; F.scene = T >= 15.2 ? 'city' : 'valley';
    F.push = .9 * ease(lin(1.2, 14.5, T)); F.towns = sm(2.4, 3.8, T);
    F.rw = 1 - .62 * sm(12, 13.6, T); F.rd = 1 - .35 * sm(12, 13.6, T);
    var b = T < 2.2 ? .55 * (1 - sm(1.2, 2.2, T)) : .32 * sm(7, 9.5, T), n = T < 1.2 ? 0 : T < 2.8 ? 1 - sm(1.2, 2.8, T) : 0;
    if (T >= 14.5) { b = T < 15.2 ? .32 - .12 * lin(14.5, 15.2, T) : .2 - .06 * sm(15.2, 16.2, T); n = T < 15.2 ? sm(14.5, 15.2, T) : 1 - sm(15.2, 16.1, T); }
    F.bias = b; F.noise = n;
    F.bar = 1 - ease(lin(15.8, 16.6, T)); F.mask = F.narrow ? 0 : sm(15.5, 16.4, T); F.seats = ease(lin(15.6, 16.5, T));
  }

  /* layers. Dither for the world, ASCII for the machine, gold for people and the law */
  var D = I.layer.D, A = I.layer.A, G = I.layer.G;
  function dl(dep, fn, city) {
    return D(dep, function (g, b) {
      if (!F.dv || (F.scene === 'city') !== !!city) return;
      if (!city) { var s = sc(dep), fx = F.focus[0], fy = F.focus[1]; g.translate(fx, fy); g.scale(s, s); g.translate(-fx, -fy); }
      fn(g, city ? F.sb : F.cb, b);
    });
  }
  function adraw(g, b, t, S) {
    if (!asciiOn()) return;
    var T = F.T, q = dcBox(), a = sm(4, 4.5, T);
    g.save(); g.beginPath(); g.rect(q.x - q.w * .1, q.y + q.h * (1 - a) - 2, q.w * 1.2, q.h * a + 4); g.clip(); M.dcentre(g, q, F.ms, 3); g.restore();
    if (T >= 5) M.pipeBody(g, pipePts(), S);
    if (T >= 5.2) M.gaugeA(g, gaugeBox(), S, level(T));
  }
  function aglyph(G, b, t, S) {
    if (!asciiOn()) return;
    var T = F.T, c = G.c, q = dcBox(), gq = gaugeBox(), i, k, u, Q, L, x, y;
    if (T >= 4.6) M.dcGlyphs(G, q, fanT(T), 3);
    if (T >= 5.2) {
      Q = pipePts(); L = plen(Q);
      var tot = L[L.length - 1], n = Math.max(4, tot / (c * 1.1)) | 0, head = lin(5.2, 6.6, T);
      for (i = 0; i < n; i++) {
        if (hash(i, 3, 9) > .74) continue;
        u = (i / n + (T - 5.2) * 60 / tot) % 1; if (u > head) continue;
        var p = pat(Q, L, u); G.put(p[0], p[1], RAMP[Math.min(14, 3 + Math.floor(u * 36))]);
      }
      M.pickup(G, Q[0], F.ms);
    }
    /* overnight log */
    if (T >= 7.4 && T < 12.1) {
      var lx = F.narrow ? q.x : gq.x + gq.w + F.cb.w * .016, ly = F.narrow ? q.y + q.h + c * 4 : F.H * .2, nch = (T - 7.4) * 38, cur = null;
      for (i = 0; i < LOG.length; i++) {
        var s = LOG[i], kk = Math.floor(clamp(nch, 0, s.length));
        if (kk > 0) G.text(lx, ly + i * c * 2, s.slice(0, kk));
        if (nch >= 0 && nch < s.length) cur = [lx + kk * c, ly + i * c * 2];
        nch -= s.length + 9; if (nch < 0) { if (!cur && nch > -9) cur = [lx + s.length * c, ly + i * c * 2]; break; }
      }
      if (cur && T < 9.5 && Math.floor(T * 2.6) % 2 === 0) G.put(cur[0], cur[1], '#');
    }
    /* the gold ceiling, broken into dotted glyphs */
    if (T >= 8.8 && T < 14.6) {
      var cy = gq.y + gq.h * (1 - .78), x0 = q.x, x1 = gq.x + gq.w + F.cb.w * .01, fall = lin(8.8, 10, T);
      for (k = 0, x = x0; x <= x1; x += c, k++) {
        if (hash(k, 5, 5) < .3 * fall) continue;
        G.put(x, cy + fall * c * 3 * hash(k, 2, 2), hash(k, 7, 1) > .5 ? '·' : '.');
      }
    }
    /* a pulse from the data centre to the reservoir */
    if (T >= 9.5 && T < 10.8) {
      var r = resPt(), s0 = [q.x + q.w * .1, q.y + q.h * .75], cx = (s0[0] + r[0]) / 2, cyy = Math.min(s0[1], r[1]) - F.H * .06, PP = [];
      for (i = 0; i <= 14; i++) { u = i / 14; PP.push([(1 - u) * (1 - u) * s0[0] + 2 * u * (1 - u) * cx + u * u * r[0], (1 - u) * (1 - u) * s0[1] + 2 * u * (1 - u) * cyy + u * u * r[1]]); }
      L = plen(PP); var hd = ease(lin(9.55, 10.6, T));
      for (k = 0; k < 7; k++) { u = hd - k * .035; if (u < 0 || u > 1) continue; var pp = pat(PP, L, u); G.put(pp[0], pp[1], '@%#Xox*'[k]); }
    }
    /* block counter */
    if (T >= 9.7 && T < 12.25) {
      var big = F.W >= 1100 && F.H >= 700 ? 2 : 1, val = Math.round(180 * ease(lin(9.8, 11.2, T))), str = ('00' + val).slice(-3), w = blockW(str, big) * c;
      block(G, clamp(q.x + q.w / 2 - w / 2, c, F.W - w - c), Math.max(c * 2, q.y - (7 * big + 3) * c), str, big, '#');
    }
    /* the stamp and the empty operator field */
    if (T >= 11.1 && T < 12.3) {
      var rp = resPt(), sw = blockW('ACCEPTED', 1) * c, sx = clamp(rp[0] - sw / 2, c, Math.max(c, F.W - sw - c)), sy = rp[1] - c * 3.5;
      block(G, sx, sy, 'ACCEPTED', 1, T < 11.22 ? '@' : '#');
      if (T >= 11.4) {
        G.text(sx, sy + c * 9, 'operator');
        for (k = 0; k < 12; k++) G.put(sx + (10 + k) * c, sy + c * 9, '·');
        if (Math.floor(T * 2.5) % 2 === 0) G.put(sx + c * 10, sy + c * 9, '#');
      }
    }
    /* falling flow line and the single saffron alert */
    if (T >= 12.2 && T < 14.6) {
      var R = chartR(), cols = Math.floor(R.w / c), hh = lin(12.2, 14, T), last = null;
      for (k = 0; k <= cols * hh; k++) { u = k / cols; last = [R.x + k * c, vy(R, flowV(u))]; G.put(last[0], last[1], 'o'); }
      if (last) G.put(last[0], last[1], '@');
      if (T >= TC && T < TC + .6) {
        var px = R.x + Math.round(UC * cols) * c, py = vy(R, 80), rr = 1 + Math.floor(lin(TC, TC + .6, T) * 3), dirs = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]];
        G.put(px, py, '@', 1);
        for (k = 0; k < 8; k++) G.put(px + dirs[k][0] * rr * c, py + dirs[k][1] * rr * c, '·', 1);
      }
    }
  }
  function gold(c, b, t, Pp) {
    var T = F.T, W = b.w, H = b.h;
    c.save(); c.lineCap = 'round'; c.lineJoin = 'round'; c.strokeStyle = Pp.gold; c.fillStyle = Pp.gold;
    if (T < 1.85) {
      var hl = ease(lin(.05, .9, T)) * W * .42, al = 1 - lin(1.2, 1.8, T), y = Math.round(H / 2) + .5;
      if (hl > 0 && al > 0) { c.globalAlpha = al; c.lineWidth = 1; c.beginPath(); c.moveTo(W / 2 - hl, y); c.lineTo(W / 2 + hl, y); c.stroke(); c.globalAlpha = 1; }
    }
    if (F.scene === 'valley' && T >= 5.6 && T < 14.9) {
      var ga = 1 - lin(14.5, 14.9, T);
      if (T < 8.85) {
        var q = dcBox(), gq = gaugeBox(), cy = gq.y + gq.h * (1 - .78), x0 = q.x, x1 = gq.x + gq.w + F.cb.w * .01, rv = ease(lin(5.6, 6.4, T)), amp = sm(7.9, 8.7, T) * 7, gap = sm(8.45, 8.8, T);
        c.globalAlpha = ga; c.lineWidth = Pp.w;
        c.setLineDash(gap > 0 ? [Math.max(1, 14 * (1 - gap)), 4 + 22 * gap] : rv < 1 ? [rv * 3000 + .01, 3000] : []);
        c.beginPath();
        for (var x = x0; x <= x1 + 1; x += 3) { var yy = cy + Math.sin(x * .07 + T * 11) * amp * Math.sin((x - x0) / (x1 - x0 + 1) * Math.PI); x === x0 ? c.moveTo(x, yy) : c.lineTo(x, yy); }
        c.stroke(); c.setLineDash([]);
      }
      var out = sm(11.2, 12, T);
      c.globalAlpha = ga * (1 - .55 * out);
      LW.operator(c, opBox(), { gold: Pp.gold, w: Pp.w * (1 - .5 * out), reveal: ease(lin(5.8, 6.6, T)), dash: out > .02 ? [2.5, 1 + 3 * out] : null }, false);
      c.globalAlpha = 1;
    }
    if (F.scene === 'valley' && T >= 12.2 && T < 14.9) {
      var R = chartR(), ty = Math.round(vy(R, 80)) + .5, rv2 = ease(lin(12.2, 12.8, T));
      c.globalAlpha = 1 - lin(14.5, 14.9, T); c.save(); c.beginPath(); c.rect(R.x - 4, 0, (R.w + 8) * rv2, H); c.clip();
      c.setLineDash([7, 6]); c.lineWidth = Pp.w; c.beginPath(); c.moveTo(R.x, ty); c.lineTo(R.x + R.w, ty); c.stroke(); c.restore();
      if (F.fonts && rv2 > .2) { c.font = '600 12px ' + I.FONT; c.textAlign = 'right'; c.textBaseline = 'middle'; c.fillText('80', R.x - 8, ty); }
      c.globalAlpha = 1;
    }
    if (F.scene === 'city' && F.seats > 0) {
      var tq = F.narrow ? box(F.sb, .14, .56, .72, .4) : box(F.sb, .4, .58, .5, .38);
      c.save(); c.translate(0, (1 - F.seats) * H * .1); LW.tribunal(c, tq, { gold: Pp.gold, w: Pp.w * 1.1, reveal: F.seats }); c.restore();
    }
    if (F.bar > 0) { var bh = Math.round(H * .075 * F.bar); c.setLineDash([]); c.globalAlpha = 1; c.fillStyle = '#000'; c.fillRect(-2, -2, W + 4, bh + 2); c.fillRect(-2, H - bh, W + 4, bh + 2); }
    c.restore();
  }
  var scene = { title: 'Opening film', role: 'composite', layers: [
    dl(.02, function (g, cb) { P.sky(g, cb, { hz: .4, top: .04, bot: .24, clouds: 9 }); }),
    dl(.1, function (g, cb) { P.ridge(g, cb, .34, .045, 11, .24, .3); }),
    dl(.22, function (g, cb) { P.ridge(g, cb, .42, .055, 23, .36, .46); }),
    dl(.38, function (g, cb) { P.ridge(g, cb, .53, .05, 37, .46, .6); P.furrows(g, cb, .66, 9, .68); P.reservoir(g, box(cb, 0, .3, .2, .22), { sh: .44, out: false }); }),
    dl(.5, function (g, cb) {
      P.river(g, cb, { x0: FO.x0, y0: FO.y0, x1: FO.x1, y1: FO.y1, f: FO.f, p: FO.p, m: FO.m, w0: FO.w0 * F.rw, w1: FO.w1 * F.rw }, .34 * F.rd, .7 * F.rd);
      P.border(g, cb, .72, .36, .5, 1.04);
      if (F.towns > 0) { g.globalAlpha = F.towns; P.townsAlong(g, cb, FO, TOWNS); g.globalAlpha = 1; }
    }),
    dl(.03, function (g, sb, b) { P.sky(g, b, { hz: .78, top: .03, bot: .26, clouds: 5 }); P.ridge(g, sb, .64, .05, 51, .16, .2); }, true),
    dl(.4, function (g, sb) { P.skyline(g, sb); }, true),
    dl(.5, function (g, sb) { P.river(g, sb, CITYR, .46, .62); }, true),
    D(0, function (g, b) {
      if (!F.dv || F.mask <= 0) return;
      var m = (1 - F.mask) * 255 | 0, k = 'rgb(' + m + ',' + m + ',' + m + ')', gr = g.createLinearGradient(0, 0, b.w * .56, 0);
      gr.addColorStop(0, k); gr.addColorStop(.38, k); gr.addColorStop(1, '#fff');
      g.globalCompositeOperation = 'multiply'; g.fillStyle = gr; g.fillRect(-20, -20, b.w + 40, b.h + 40);
    }),
    A(0, adraw, aglyph),
    G(.6, gold)
  ] };

  function uiState() {
    var T = d.T, beat = -1, prog = [], i, b;
    for (i = 0; i < 5; i++) { b = BEATS[i]; prog.push(d.mode === 'rest' ? 1 : Math.round(lin(b[0], b[1], T) * 20) / 20); if (T >= b[0] && T < b[1]) beat = i; }
    if (d.mode === 'rest' || T >= 14.5) beat = 5;
    var cap = d.mode === 'film' && beat >= 0 && beat < 5 && T >= BEATS[beat][0] + .15 && T < BEATS[beat][1] - .25 ? beat : -1;
    return { fonts: F.fonts, mode: d.mode, playing: d.playing, beat: beat, cap: cap, presenter: d.mode === 'film' && T >= .12 && T < 1.35, title: d.mode === 'rest' || T >= TITLE_AT, prog: prog, reduced: d.reduced };
  }
  function emit() { var u = uiState(), k = JSON.stringify(u); if (k !== d.ui) { d.ui = k; if (o.onUi) o.onUi(u); } }
  function events(a, b, S) { if ((a < 4 && b >= 4 && b < 4.8) || (a < 14.5 && b >= 14.5 && b < 14.9)) S.scramble(); }
  function onFrame(t, S) {
    if (!F.cb || S.W !== F.W || S.H !== F.H) { layout(S); d.dirty = true; if (d.mode === 'rest') S.srcD = true; }
    var dt = d.last == null ? 0 : Math.min(.1, (t - d.last) / 1000); d.last = t;
    if (d.mode === 'film') {
      if (d.playing) d.T += dt;
      if (d.T >= END) { finish(); return; }
      events(d.prev, d.T, S); d.prev = d.T;
      if (d.playing || d.dirty) {
        compute(d.T); S.p.bias = F.bias; S.p.noise = F.noise; S.srcD = true; S.srcA = true; S.dirtyC = true; d.dirty = false;
      }
      S.p.drift = d.playing ? 2 : 0;
    }
    emit();
  }
  function rest(complete) {
    d.mode = 'rest'; d.playing = false; d.T = END; compute(END);
    var S = d.S;
    if (S) { S.p.bias = F.bias; S.p.noise = 0; S.p.drift = d.reduced ? 0 : 1.2; S.p.live = false; S.scrEnd = 0; S.srcD = S.srcA = S.dirtyC = true; S.releaseCam(); }
    store('1'); emit();
    if (complete && !d.done) { d.done = true; if (o.onComplete) o.onComplete(); }
  }
  function finish() { rest(true); }
  function toFilm(T) {
    var S = d.S; d.mode = 'film'; d.T = T; d.prev = T - .001; d.dirty = true;
    S.p.live = true; S.p.drift = 2; S.releaseCam(); emit();
  }

  var S = d.S = I.stage(cv, { scene: scene, ground: 'navy', params: { drift: 2, live: true }, onFrame: onFrame });
  if (d.reduced || store() === '1') rest(false);
  var fontT = setTimeout(fontsOn, 2500);
  function fontsOn() { if (F.fonts) return; F.fonts = true; clearTimeout(fontT); S.srcA = S.dirtyC = true; d.dirty = true; emit(); }
  if (root.document && document.fonts && document.fonts.ready) document.fonts.ready.then(fontsOn, fontsOn); else fontsOn();

  return {
    play: function () { if (d.mode === 'film') { d.playing = true; emit(); } },
    pause: function () { if (d.mode === 'film') { d.playing = false; emit(); } },
    toggle: function () { if (d.mode === 'film') { d.playing = !d.playing; d.dirty = true; emit(); } },
    replay: function () { if (d.reduced) return; d.done = false; d.playing = true; toFilm(0); },
    skip: function () { if (d.mode === 'film') rest(true); },
    seek: function (i) { if (d.reduced) return; i = clamp(i | 0, 0, 4); toFilm(BEATS[i][0]); },
    setPointer: function (nx, ny) { if (d.mode === 'rest' && !d.reduced) S.setCam(nx * .6, ny * .4, true); },
    leave: function () { S.releaseCam(); },
    setNarrow: function (n) { F.narrow = !!n; F.cb = null; if (d.mode === 'rest') { compute(END); S.srcD = true; } },
    setReduced: function (r) { d.reduced = !!r || mq('(prefers-reduced-motion: reduce)'); if (d.reduced) rest(false); },
    state: function () { return uiState(); },
    stage: S,
    destroy: function () { clearTimeout(fontT); S.destroy(); }
  };
}

/* ---------- styles shared by the canvas artboard and the React component ---------- */
var CSS = '.ih{position:relative;width:100%;height:calc(100vh - 64px);min-height:640px;background:#0B2545;color:#FBFBFA;overflow:hidden;font-family:"Plus Jakarta Sans",system-ui,sans-serif}' +
'.ih-film{position:absolute;inset:0}.ih-cv{position:absolute;inset:0;width:100%;height:100%;display:block}' +
'.ih[data-fonts="false"] .ih-g{opacity:0!important}' +
'.ih-pre{position:absolute;left:50%;top:calc(50% + 22px);transform:translateX(-50%);width:min(92%,760px);margin:0;text-align:center;font-size:15px;line-height:1.5;font-weight:500;letter-spacing:.04em;opacity:0;transition:opacity .45s ease}.ih-pre[data-on="true"]{opacity:.92}' +
'.ih-caps{position:absolute;left:clamp(24px,5vw,88px);bottom:calc(7.5% + 28px);width:min(640px,46vw);height:0}' +
'.ih-cap{position:absolute;left:0;bottom:0;width:100%;margin:0;font-size:22px;line-height:1.45;font-weight:500;opacity:0;transition:opacity .6s ease}.ih-cap[data-on="true"]{opacity:1}' +
'.ih-ctl{position:absolute;right:clamp(12px,3.5vw,64px);bottom:calc(7.5% + 18px);display:flex;flex-wrap:wrap;align-items:center;justify-content:flex-end;gap:2px;transition:opacity .6s ease}' +
'.ih-tick{width:36px;height:44px;padding:0;border:0;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center}' +
'.ih-tick span{display:block;width:28px;height:2px;background:rgba(251,251,250,.3);position:relative;overflow:hidden}.ih-tick i{position:absolute;left:0;top:0;bottom:0;background:#FBFBFA}' +
'.ih-btn{min-height:44px;padding:0 12px;border:0;background:transparent;color:rgba(251,251,250,.82);font:600 13px/1 "Plus Jakarta Sans",system-ui,sans-serif;letter-spacing:.02em;cursor:pointer}.ih-btn:hover{color:#FBFBFA}' +
'.ih button:focus-visible,.ih a:focus-visible{outline:2px solid #6E9BD1;outline-offset:2px}' +
'.ih-title{position:absolute;left:clamp(24px,6vw,104px);top:50%;width:min(600px,40vw);display:flex;flex-direction:column;gap:20px;opacity:0;transform:translateY(calc(-50% + 14px));transition:opacity .9s cubic-bezier(.2,.6,.2,1),transform .9s cubic-bezier(.2,.6,.2,1);pointer-events:none}' +
'.ih-title[data-on="true"]{opacity:1;transform:translateY(-50%);pointer-events:auto}' +
'.ih-eye{margin:0;font-size:13px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#D4AF37}' +
'.ih-h{margin:0;font-size:clamp(30px,3.1vw,52px);line-height:1.12;font-weight:700;letter-spacing:-.01em}' +
'.ih-lead{margin:0;max-width:540px;font-size:clamp(16px,1.15vw,19px);line-height:1.6;color:rgba(251,251,250,.86)}' +
'.ih-ctas{display:flex;flex-wrap:wrap;gap:12px;padding-top:6px}' +
'.ih-c1,.ih-c2{display:inline-flex;align-items:center;min-height:48px;padding:0 22px;font-size:15px;font-weight:700;text-decoration:none;border-radius:2px}' +
'.ih-c1{background:#D4AF37;color:#0B2545}.ih-c1:hover{background:#DDBD52;color:#0B2545}' +
'.ih-c2{color:#FBFBFA;box-shadow:inset 0 0 0 1.5px rgba(251,251,250,.72)}.ih-c2:hover{color:#FBFBFA;box-shadow:inset 0 0 0 1.5px #FBFBFA}' +
'.ih-sr{position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}' +
'@media (max-width:767px){.ih{height:auto;display:flex;flex-direction:column}.ih-film{position:relative;flex:none;height:clamp(300px,52vh,460px)}' +
'.ih-caps{left:20px;right:20px;width:auto;bottom:calc(7.5% + 14px)}.ih-cap{font-size:18px}' +
'.ih-ctl{position:static;padding:4px 8px 0}.ih-title,.ih-title[data-on="true"]{position:static;width:auto;transform:none;opacity:1;pointer-events:auto;padding:12px 24px 48px}}';

/* ---------- plain React component ---------- */
var INIT_UI = { fonts: false, mode: 'film', playing: true, beat: -1, cap: -1, presenter: false, title: false, prog: [0, 0, 0, 0, 0], reduced: false };
function react(React) {
  var h = React.createElement;
  function MootHero(props) {
    var cvRef = React.useRef(null), filmRef = React.useRef(null), doneRef = React.useRef(props.onComplete);
    doneRef.current = props.onComplete;
    var st = React.useState(null), ui = st[0] || INIT_UI, setUi = st[1];
    React.useEffect(function () {
      var m = root.matchMedia ? root.matchMedia(MQ_NARROW) : null;
      var f = film(cvRef.current, { reducedMotion: !!props.reducedMotion, narrow: !!(m && m.matches), onUi: setUi, onComplete: function () { if (doneRef.current) doneRef.current(); } });
      filmRef.current = f;
      var on = function () { f.setNarrow(m.matches); };
      if (m) { if (m.addEventListener) m.addEventListener('change', on); else m.addListener(on); }
      return function () { if (m) { if (m.removeEventListener) m.removeEventListener('change', on); else m.removeListener(on); } f.destroy(); filmRef.current = null; };
    }, []);
    React.useEffect(function () { if (filmRef.current) filmRef.current.setReduced(!!props.reducedMotion); }, [props.reducedMotion]);
    var F = function () { return filmRef.current; };
    var caps = (props.captions && props.captions.length ? props.captions : DEFAULTS.captions).slice(0, 5);
    var p1 = props.primaryCta || DEFAULTS.primaryCta, p2 = props.secondaryCta || DEFAULTS.secondaryCta;
    var move = function (e) { var r = e.currentTarget.getBoundingClientRect(), f = F(); if (f) f.setPointer((e.clientX - r.left) / r.width * 2 - 1, (e.clientY - r.top) / r.height * 2 - 1); };
    return h('section', { className: 'ih', 'aria-label': 'Opening film', 'data-fonts': String(ui.fonts), 'data-mode': ui.mode },
      h('style', null, CSS),
      h('div', { className: 'ih-film', onPointerMove: move, onPointerLeave: function () { var f = F(); if (f) f.leave(); } },
        h('canvas', { ref: cvRef, className: 'ih-cv', 'aria-hidden': 'true' }),
        h('p', { className: 'ih-sr' }, TRANSCRIPT),
        h('p', { className: 'ih-pre ih-g', 'data-on': String(ui.presenter) }, PRESENTER),
        h('div', { className: 'ih-caps ih-g' }, caps.map(function (c, i) { return h('p', { key: i, className: 'ih-cap', 'data-on': String(ui.cap === i) }, c); }))
      ),
      ui.reduced ? null : h('div', { className: 'ih-ctl ih-g', role: 'group', 'aria-label': 'Film controls' },
        [0, 1, 2, 3, 4].map(function (i) {
          return h('button', { key: i, type: 'button', className: 'ih-tick', 'aria-label': 'Go to beat ' + (i + 1), 'aria-current': ui.beat === i ? 'step' : undefined, onClick: function () { var f = F(); if (f) f.seek(i); } },
            h('span', null, h('i', { style: { width: Math.round(ui.prog[i] * 100) + '%' } })));
        }),
        ui.mode === 'film' ? h('button', { type: 'button', className: 'ih-btn', onClick: function () { var f = F(); if (f) f.toggle(); } }, ui.playing ? 'Pause' : 'Play') : null,
        h('button', { type: 'button', className: 'ih-btn', onClick: function () { var f = F(); if (f) f.replay(); } }, 'Replay'),
        ui.mode === 'film' ? h('button', { type: 'button', className: 'ih-btn', onClick: function () { var f = F(); if (f) f.skip(); } }, 'Skip the film') : null
      ),
      h('div', { className: 'ih-title ih-g', 'data-on': String(ui.title), onFocus: function () { var f = F(); if (f && ui.mode === 'film') f.skip(); } },
        h('p', { className: 'ih-eye' }, props.eyebrow || DEFAULTS.eyebrow),
        h('h1', { className: 'ih-h' }, props.headline || DEFAULTS.headline),
        h('p', { className: 'ih-lead' }, props.lead || DEFAULTS.lead),
        h('div', { className: 'ih-ctas' },
          h('a', { className: 'ih-c1', href: p1.href || '#' }, p1.label),
          h('a', { className: 'ih-c2', href: p2.href || '#' }, p2.label))
      )
    );
  }
  return { MootHero: MootHero };
}

I.hero = { film: film, react: react, CSS: CSS, DEFAULTS: DEFAULTS, PRESENTER: PRESENTER, TRANSCRIPT: TRANSCRIPT, BEATS: BEATS, END: END };
})(window);
