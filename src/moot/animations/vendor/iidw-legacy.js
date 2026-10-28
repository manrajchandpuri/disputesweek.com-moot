/* eslint-disable */
/* Exported from the Claude Design canvas "IIDW Moot 2027 Visual Kit" on 28 October 2026. Kept as delivered so later exports can replace it whole. */
/* IIDW moot site. The CIAC legacy section that follows the hero.
   Requires iidw-engine.js. Exposes IIDW.legacy.rulebook (framework free canvas director) and IIDW.legacy.react(React). */
(function (root) {
'use strict';
var I = root.IIDW;
if (!I) { if (root.console) console.error('iidw-legacy.js needs iidw-engine.js loaded first'); return; }
var P = I.paint, U = I.util, clamp = U.clamp, ease = U.ease, hash = U.hash, RAMP = I.RAMP;
var DEFAULTS = {
  eyebrow: 'The CIAC legacy moot',
  heading: 'This moot begins a CIAC tradition, and it is the first moot ever argued under the CIAC (Arbitration Proceedings) Rules 2026.',
  paragraphs: [
    'The Chandigarh International Arbitration Centre was launched during the first edition of the India International Disputes Week, under the aegis of the High Court of Punjab and Haryana. This competition carries the Centre’s name forward as its legacy moot, and it will return with each edition of the week.',
    'Teams will argue an arbitration administered under the Centre’s own rules and seated in Chandigarh, so every memorandum and every oral round tests those rules in practice for the first time.'
  ],
  wordmark: 'Chandigarh International Arbitration Centre',
  logoAlt: 'Chandigarh International Arbitration Centre',
  pageTitle: ['CIAC ARBITRATION', 'PROCEEDINGS RULES 2026'],
  rules: ['Commencement', 'Joinder of additional parties', 'The emergency arbitrator', 'Interim measures', 'Constitution of the tribunal', 'The hearing'],
  sealText: 'Rules 2026, first edition',
  visualLabel: 'An animated rulebook listing the rule headings',
  timelineLabel: 'The legacy of the moot',
  timeline: [
    'The Centre opens during the first edition of the India International Disputes Week.',
    'The Centre’s Arbitration Proceedings Rules 2026 set the procedure for this moot.',
    'The first CIAC legacy moot reaches its oral rounds in Chandigarh in January 2027.',
    'The moot returns with every future edition of the week.'
  ]
};
function lin(a, b, t) { return clamp((t - a) / (b - a), 0, 1); }
function mq(q) { try { return !!(root.matchMedia && root.matchMedia(q).matches); } catch (e) { return false; } }
function splitSeal(s) { var i = s.indexOf(', '); return i > 0 ? [s.slice(0, i + 1), s.slice(i + 2)] : [s]; }

/* each character types in, then resolves through a short glyph scramble */
function typeLine(G, x, y, s, t0, cps, T, seed, max) {
  var c = G.c, n = Math.min(s.length, max || s.length), k, ta, ts;
  for (k = 0; k < n; k++) {
    ta = t0 + k / cps; if (T < ta) return;
    if (s[k] === ' ') continue;
    ts = ta + .3 + .3 * hash(k, seed, 1);
    G.put(x + k * c, y, T >= ts ? s[k] : RAMP[3 + Math.floor(hash(k, seed, Math.floor(T * 18)) * 12)]);
  }
}
function settleAt(t0, len, cps) { return t0 + Math.max(0, len - 1) / cps + .6; }

/* ---------- the rulebook director ---------- */
function rulebook(cv, o) {
  o = o || {};
  var d = { T: 0, started: false, done: false, last: null, fonts: false, reduced: !!o.reducedMotion || mq('(prefers-reduced-motion: reduce)'), L: null, key: '' };
  var data = {};
  function setData(x) {
    x = x || {};
    data.title = x.pageTitle && x.pageTitle.length ? x.pageTitle : DEFAULTS.pageTitle;
    data.rules = (x.rules && x.rules.length ? x.rules : DEFAULTS.rules).slice(0, 8);
    data.seal = splitSeal(x.sealText || DEFAULTS.sealText);
    var tEnd = 1, i;
    for (i = 0; i < data.title.length; i++) tEnd += data.title[i].length / 40;
    data.titleEnd = tEnd;
    data.h0 = Math.max(2, tEnd + .2);
    var last = 0;
    for (i = 0; i < data.rules.length; i++) last = Math.max(last, settleAt(data.h0 + i * .6, data.rules[i].length, 45));
    data.sealT = last; data.end = last + 1.6;
  }
  setData(o);

  function geom(S) {
    var W = S.W, H = S.H, c = I.env.cell;
    var w = Math.floor(Math.min(W * .76, H * .66) / c) * c, h = Math.floor(H * .86 / c) * c;
    var pg = { x: Math.round((W - w) / 2 / c) * c, y: Math.round((H - h) / 2 / c) * c, w: w, h: h };
    var left = pg.x + 2 * c, right = pg.x + pg.w - 2 * c, cols = Math.floor((right - left) / c);
    var r0 = Math.ceil(pg.y / c) + 2, rH = r0 + data.title.length + 3;
    var R = Math.max(8 * c, Math.ceil((data.seal[1] || data.seal[0]).length / 2 + 2) * c);
    var rowA = Math.round((pg.y + pg.h - 2 * c - R) / c) - 1, cy = (rowA + 1) * c, cx = right - R;
    var rLast = Math.floor((cy - R) / c) - 2, step = clamp(Math.floor((rLast - rH) / Math.max(1, data.rules.length)), 2, 6);
    return { c: c, pg: pg, left: left, right: right, cols: cols, r0: r0, rH: rH, step: step, R: R, cx: cx, cy: cy, rowA: rowA, ruleY: (r0 + data.title.length + .9) * c };
  }

  function glyphs(G) {
    var L = d.L; if (!L || !d.fonts || !d.started) return;
    var T = d.T, c = L.c, i, k, y;
    for (i = 0; i < data.title.length; i++) {
      var t0 = 1; for (k = 0; k < i; k++) t0 += data.title[k].length / 40;
      typeLine(G, L.left, (L.r0 + i + .5) * c, data.title[i].toUpperCase(), t0, 40, T, 90 + i, L.cols);
    }
    for (i = 0; i < data.rules.length; i++) {
      var s = data.rules[i], hs = data.h0 + i * .6, n = Math.min(s.length, L.cols - 2), st = settleAt(hs, n, 45), row = L.rH + i * L.step;
      y = (row + .5) * c;
      typeLine(G, L.left, y, s, hs, 45, T, i + 1, n);
      if (T >= st) {
        var lead = Math.floor((L.cols - n - 1) * lin(st, st + .35, T));
        for (k = 0; k < lead; k++) G.put(L.left + (n + 1 + k) * c, y, '·');
        if (L.step >= 3) { var bl = Math.floor(L.cols * (.62 + .3 * hash(i, 4, 4))); for (k = 0; k < bl; k++) G.put(L.left + k * c, y + c, '.'); }
        if (L.step >= 4) { var b2 = Math.floor(L.cols * (.3 + .3 * hash(i, 8, 8))); for (k = 0; k < b2; k++) G.put(L.left + k * c, y + 2 * c, '.'); }
      }
    }
    for (i = 0; i < data.seal.length; i++) {
      var w = data.seal[i];
      typeLine(G, Math.round((L.cx - w.length * c / 2) / c) * c, (L.rowA + i + .5) * c, w, data.sealT + i * .12, 40, T, 70 + i);
    }
  }
  function gold(cx, b, t, Pp) {
    var L = d.L; if (!L || !d.started) return;
    var T = d.T, pg = L.pg, f = Math.min(28, Math.round(pg.w * .07)), x0 = pg.x + .5, y0 = pg.y + .5, x1 = pg.x + pg.w - .5, y1 = pg.y + pg.h - .5;
    cx.save(); cx.strokeStyle = Pp.gold; cx.lineWidth = 1; cx.lineJoin = 'miter'; cx.lineCap = 'butt';
    var per = 2 * (pg.w + pg.h), rv = ease(lin(0, 1.3, T));
    if (rv > 0) {
      cx.setLineDash([rv * per + .01, per + 10]); cx.beginPath();
      cx.moveTo(x0, y1); cx.lineTo(x0, y0); cx.lineTo(x1 - f, y0); cx.lineTo(x1, y0 + f); cx.lineTo(x1, y1); cx.closePath(); cx.stroke();
      var fv = lin(1.1, 1.45, T);
      if (fv > 0) { cx.setLineDash([]); cx.globalAlpha = fv; cx.beginPath(); cx.moveTo(x1 - f, y0); cx.lineTo(x1 - f, y0 + f); cx.lineTo(x1, y0 + f); cx.stroke(); cx.globalAlpha = 1; }
    }
    var rr = ease(lin(data.titleEnd - .3, data.titleEnd + .2, T));
    if (rr > 0) { cx.setLineDash([]); var ry = Math.round(L.ruleY) + .5; cx.beginPath(); cx.moveTo(L.left, ry); cx.lineTo(L.left + (L.right - L.left) * rr, ry); cx.stroke(); }
    var sr = ease(lin(data.sealT + .2, data.sealT + 1.4, T));
    if (sr > 0) {
      var rads = [L.R, L.R - 5];
      for (var i = 0; i < 2; i++) { var r = rads[i], cl = Math.PI * 2 * r; cx.setLineDash([sr * cl + .01, cl + 10]); cx.beginPath(); cx.arc(L.cx, L.cy, r, -Math.PI / 2, Math.PI * 1.5); cx.stroke(); }
    }
    cx.restore();
  }
  function sky(g, b) {
    if (!d.started || !d.L) return;
    P.skylineBack(g, b); P.skyline(g, b);
    var pg = d.L.pg;
    g.globalCompositeOperation = 'multiply';
    g.fillStyle = 'rgb(150,150,150)'; g.fillRect(-20, -20, b.w + 40, b.h + 40);
    g.fillStyle = 'rgb(118,118,118)'; g.fillRect(pg.x, pg.y, pg.w, pg.h);
  }
  var scene = { title: 'Rulebook', role: 'composite', layers: [I.layer.D(.3, sky), I.layer.A(0, null, glyphs), I.layer.G(0, gold)] };

  function onFrame(t, S) {
    var L = geom(S), k = [L.pg.x, L.pg.y, L.pg.w, L.pg.h, L.c].join(',');
    d.L = L; if (k !== d.key) { d.key = k; S.srcD = true; S.srcA = true; S.dirtyC = true; }
    var dt = d.last == null ? 0 : Math.min(.1, (t - d.last) / 1000); d.last = t;
    if (d.started && !d.done) {
      d.T += dt; S.srcA = true; S.dirtyC = true;
      if (d.T >= data.end) finish();
    }
  }
  function finish() {
    d.started = true; d.done = true; d.T = data.end;
    S.p.live = false; S.p.noise = 0; S.tw = []; S.srcD = S.srcA = S.dirtyC = true;
    if (o.onDone) o.onDone();
  }
  var S = I.stage(cv, { scene: scene, ground: 'navy', params: { drift: 0, bias: .06, live: false }, onFrame: onFrame });
  var fontT = setTimeout(fontsOn, 2500);
  function fontsOn() { if (d.fonts) return; d.fonts = true; clearTimeout(fontT); S.srcA = S.dirtyC = true; }
  if (root.document && document.fonts && document.fonts.ready) document.fonts.ready.then(fontsOn, fontsOn); else fontsOn();
  if (d.reduced) finish();

  return {
    start: function () {
      if (d.started) return;
      if (d.reduced) { finish(); return; }
      d.started = true; d.T = 0; S.p.live = true; S.p.noise = 1; S.tween('noise', 0, 1400); S.srcD = true;
    },
    finish: finish,
    setData: function (x) { setData(x); S.srcA = S.dirtyC = true; if (d.done) d.T = data.end; },
    setReduced: function (r) { d.reduced = !!r || mq('(prefers-reduced-motion: reduce)'); if (d.reduced) finish(); },
    isReduced: function () { return d.reduced; },
    stage: S,
    destroy: function () { clearTimeout(fontT); S.destroy(); }
  };
}

/* ---------- styles shared by the canvas artboard and the React component ---------- */
var CSS = '.lg{background:#0B2545;color:#FBFBFA;font-family:"Plus Jakarta Sans",system-ui,sans-serif;padding:clamp(72px,9vw,136px) clamp(20px,6vw,104px) clamp(72px,8vw,128px)}' +
'.lg-in{max-width:1440px;margin:0 auto;display:flex;flex-direction:column;gap:clamp(56px,7vw,104px)}' +
'.lg-top{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:clamp(40px,5vw,96px);align-items:center}' +
'.lg-txt{display:flex;flex-direction:column;gap:22px;max-width:620px}' +
'.lg-eye{margin:0;font-size:13px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#D4AF37}' +
'.lg-h{margin:0;font-size:clamp(28px,2.6vw,44px);line-height:1.16;font-weight:700;letter-spacing:-.01em}' +
'.lg-p{margin:0;font-size:clamp(16px,1.1vw,18px);line-height:1.68;color:rgba(251,251,250,.86)}' +
'.lg-logo{display:flex;align-items:center;min-height:56px;margin-top:12px;padding-top:24px;border-top:1px solid rgba(251,251,250,.16)}' +
'.lg-logo img{display:block;height:52px;width:auto;max-width:100%}' +
'.lg-wm{margin:0;font-size:13px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:rgba(251,251,250,.9)}' +
'.lg-vis{width:100%;max-width:640px;justify-self:center}.lg-cv{display:block;width:100%;aspect-ratio:5/6}' +
'.lg-sr{position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}' +
'.lg-tl{position:relative}' +
'.lg-tl-line{position:absolute;left:0;right:0;top:6px;height:1.5px;background:#D4AF37;transform:scaleX(0);transform-origin:left center;transition:transform 1.8s cubic-bezier(.45,.1,.3,1)}' +
'.lg-tl[data-on="true"] .lg-tl-line{transform:scaleX(1)}' +
'.lg-tl-list{list-style:none;margin:0;padding:0;display:grid;grid-auto-flow:column;grid-auto-columns:minmax(0,1fr);gap:clamp(20px,3vw,56px)}' +
'.lg-tl-item{position:relative;padding-top:38px}' +
'.lg-tl-node{position:absolute;left:0;top:0;width:13px;height:13px;box-sizing:border-box;border-radius:50%;border:1.5px solid #D4AF37;background:#0B2545;opacity:0;transform:scale(.4);transition:opacity .4s ease,transform .4s ease,background-color .4s ease}' +
'.lg-tl[data-on="true"] .lg-tl-node{opacity:1;transform:none;background:#D4AF37}' +
'.lg-tl-text{margin:0;max-width:300px;font-size:16px;line-height:1.6;color:rgba(251,251,250,.86);opacity:0;transform:translateY(8px);transition:opacity .6s ease,transform .6s ease}' +
'.lg-tl[data-on="true"] .lg-tl-text{opacity:1;transform:none}' +
'.lg-tl-item:nth-child(2) .lg-tl-node{transition-delay:.45s}.lg-tl-item:nth-child(2) .lg-tl-text{transition-delay:.6s}' +
'.lg-tl-item:nth-child(3) .lg-tl-node{transition-delay:.9s}.lg-tl-item:nth-child(3) .lg-tl-text{transition-delay:1.05s}' +
'.lg-tl-item:nth-child(4) .lg-tl-node{transition-delay:1.35s}.lg-tl-item:nth-child(4) .lg-tl-text{transition-delay:1.5s}' +
'.lg-tl-item:nth-child(5) .lg-tl-node{transition-delay:1.6s}.lg-tl-item:nth-child(5) .lg-tl-text{transition-delay:1.75s}' +
'.lg-tl-item:nth-child(n+6) .lg-tl-node{transition-delay:1.8s}.lg-tl-item:nth-child(n+6) .lg-tl-text{transition-delay:1.95s}' +
'.lg[data-rm="true"] .lg-tl *,.lg[data-rm="true"] .lg-tl-line{transition:none!important}' +
'@media (prefers-reduced-motion:reduce){.lg-tl *,.lg-tl-line{transition:none!important}}' +
'@media (max-width:899px){.lg-top{grid-template-columns:minmax(0,1fr)}.lg-vis{max-width:560px}}' +
'@media (max-width:767px){.lg-cv{aspect-ratio:4/5}.lg-tl-list{grid-auto-flow:row;grid-auto-columns:auto;gap:28px}.lg-tl-item{padding:0 0 0 34px}' +
'.lg-tl-node{top:5px}.lg-tl-line{left:6px;right:auto;top:0;bottom:0;width:1.5px;height:auto;transform:scaleY(0);transform-origin:center top}.lg-tl[data-on="true"] .lg-tl-line{transform:scaleY(1)}}';

/* watch an element once, then call back. Under reduced motion the caller skips this */
function onceVisible(el, cb, threshold) {
  if (!el) return function () {};
  if (!root.IntersectionObserver) { cb(); return function () {}; }
  var io = new IntersectionObserver(function (es) { for (var i = 0; i < es.length; i++) if (es[i].isIntersecting) { io.disconnect(); cb(); return; } }, { threshold: threshold || .35 });
  io.observe(el);
  return function () { io.disconnect(); };
}

/* ---------- plain React component ---------- */
function react(React) {
  var h = React.createElement;
  function LegacySection(props) {
    var cvRef = React.useRef(null), tlRef = React.useRef(null), bookRef = React.useRef(null);
    var reduced = !!props.reducedMotion || mq('(prefers-reduced-motion: reduce)');
    var st = React.useState(reduced), tlOn = st[0], setTlOn = st[1];
    var x = function (k) { return props[k] != null && props[k] !== '' ? props[k] : DEFAULTS[k]; };
    React.useEffect(function () {
      var b = rulebook(cvRef.current, { reducedMotion: reduced, pageTitle: props.pageTitle, rules: props.rules, sealText: props.sealText });
      bookRef.current = b;
      var u1 = reduced ? function () {} : onceVisible(cvRef.current, function () { b.start(); }, .35);
      var u2 = reduced ? function () {} : onceVisible(tlRef.current, function () { setTlOn(true); }, .35);
      if (reduced) setTlOn(true);
      return function () { u1(); u2(); b.destroy(); bookRef.current = null; };
    }, [reduced]);
    React.useEffect(function () { if (bookRef.current) bookRef.current.setData({ pageTitle: props.pageTitle, rules: props.rules, sealText: props.sealText }); }, [props.pageTitle, props.rules, props.sealText]);
    var paras = x('paragraphs'), rules = x('rules'), tl = x('timeline'), title = x('pageTitle');
    /* LOGO SLOT. Pass the official CIAC SVG as props.logo (a node) or props.logoSrc (a URL). Never draw a substitute. */
    var logo = props.logo ? props.logo : props.logoSrc ? h('img', { src: props.logoSrc, alt: x('logoAlt') }) : h('p', { className: 'lg-wm' }, x('wordmark'));
    return h('section', { className: 'lg', 'aria-labelledby': 'lg-heading', 'data-rm': String(reduced) },
      h('style', null, CSS),
      h('div', { className: 'lg-in' },
        h('div', { className: 'lg-top' },
          h('div', { className: 'lg-txt' },
            h('p', { className: 'lg-eye' }, x('eyebrow')),
            h('h2', { className: 'lg-h', id: 'lg-heading' }, x('heading')),
            paras.map(function (p, i) { return h('p', { key: i, className: 'lg-p' }, p); }),
            h('div', { className: 'lg-logo', 'data-slot': 'ciac-logo' }, logo)
          ),
          h('div', { className: 'lg-vis' },
            h('canvas', { ref: cvRef, className: 'lg-cv', 'aria-hidden': 'true' }),
            h('div', { className: 'lg-sr' },
              h('p', null, x('visualLabel')),
              h('p', null, title.join(' ')),
              h('ul', null, rules.map(function (r, i) { return h('li', { key: i }, r); })),
              h('p', null, x('sealText')))
          )
        ),
        h('div', { className: 'lg-tl', ref: tlRef, 'data-on': String(tlOn) },
          h('div', { className: 'lg-tl-line', 'aria-hidden': 'true' }),
          h('ol', { className: 'lg-tl-list', 'aria-label': x('timelineLabel') },
            tl.map(function (s, i) { return h('li', { key: i, className: 'lg-tl-item' }, h('span', { className: 'lg-tl-node', 'aria-hidden': 'true' }), h('p', { className: 'lg-tl-text' }, s)); }))
        )
      )
    );
  }
  return { LegacySection: LegacySection };
}

I.legacy = { rulebook: rulebook, react: react, onceVisible: onceVisible, CSS: CSS, DEFAULTS: DEFAULTS };
})(window);
