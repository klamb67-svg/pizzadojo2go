/* Pizza Dojo home page: the dojo door split.
   Tap a link → meatball man slams his peel → the screen cracks
   down the middle → the two halves slide apart → next page.
   Only runs on the home page; off for reduced-motion settings. */
(function () {
  'use strict';

  var scene = document.getElementById('door-scene');
  var doors = document.getElementById('doors');
  if (!scene || !doors) return;

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var SVGNS = 'http://www.w3.org/2000/svg';

  // Timing (ms). Impact lands 75% of the way through the slam.
  var SLAM = 420;
  var IMPACT = Math.round(SLAM * 0.75);
  var CRACK_HOLD = 260;
  var OPEN = 620;

  // Where the peel blade hits, as a fraction of meatball man's box.
  var IMPACT_FX = 0.9375;
  var IMPACT_FY = 0.985;

  var busy = false;
  var timers = [];

  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }

  function isHomePath(p) { return /\/(index(\.html?)?)?$/.test(p); }

  function stripHash(u) { return u.split('#')[0]; }

  function shouldSplit(a, e) {
    if (e.defaultPrevented || e.button !== 0) return false;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
    if (a.target && a.target !== '_self') return false;
    if (a.hasAttribute('download')) return false;
    var url;
    try { url = new URL(a.href, location.href); } catch (err) { return false; }
    if (url.origin !== location.origin) return false;
    if (isHomePath(url.pathname)) return false;
    if (stripHash(url.href) === stripHash(location.href)) return false; // same page, #, ?x
    return true;
  }

  // A jagged line from top to bottom that passes through the impact point.
  function crackPoints(cx, iy, h) {
    var up = [], down = [];
    var y = iy;
    while (y > 0) {
      y = Math.max(0, y - (35 + Math.random() * 45));
      up.push([cx + (Math.random() * 2 - 1) * 11, y]);
    }
    y = iy;
    while (y < h) {
      y = Math.min(h, y + (30 + Math.random() * 35));
      down.push([cx + (Math.random() * 2 - 1) * 9, y]);
    }
    return { up: up, down: down, impact: [cx, iy] };
  }

  function toPts(arr) {
    return arr.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ');
  }

  function makeHalf(side, clipPoly) {
    var half = document.createElement('div');
    half.className = 'door-half ' + side;
    half.style.clipPath = clipPoly;
    half.style.webkitClipPath = clipPoly;
    var copy = scene.cloneNode(true);
    copy.removeAttribute('id');
    copy.querySelectorAll('a').forEach(function (el) { el.tabIndex = -1; });
    half.appendChild(copy);
    return half;
  }

  function drawLine(svg, pts, ms, extraClass) {
    var line = document.createElementNS(SVGNS, 'polyline');
    line.setAttribute('points', toPts(pts));
    line.setAttribute('class', 'crack-line crack-fade' + (extraClass ? ' ' + extraClass : ''));
    svg.appendChild(line);
    var len = line.getTotalLength ? line.getTotalLength() : 2000;
    line.style.strokeDasharray = len;
    line.style.strokeDashoffset = len;
    line.getBoundingClientRect(); // lock in the start state
    line.style.transition = 'stroke-dashoffset ' + ms + 'ms ease-out, opacity 250ms ease';
    line.style.strokeDashoffset = 0;
  }

  function burst(svg, x, y) {
    for (var i = 0; i < 8; i++) {
      var c = document.createElementNS(SVGNS, 'circle');
      var ang = Math.PI + Math.random() * Math.PI; // spray upward and out
      var dist = 30 + Math.random() * 45;
      c.setAttribute('cx', x);
      c.setAttribute('cy', y);
      c.setAttribute('r', 5 + Math.random() * 7);
      c.setAttribute('class', 'dust');
      c.style.setProperty('--dx', (Math.cos(ang) * dist).toFixed(1) + 'px');
      c.style.setProperty('--dy', (Math.sin(ang) * dist * 0.6).toFixed(1) + 'px');
      svg.appendChild(c);
    }
  }

  function split(href, link) {
    busy = true;
    var w = window.innerWidth;
    var h = window.innerHeight;

    var man = scene.querySelector('.meatball-man').getBoundingClientRect();
    var ix = man.left + man.width * IMPACT_FX;
    var iy = Math.min(h - 4, man.top + man.height * IMPACT_FY);

    var crack = crackPoints(ix, iy, h);
    var topDown = crack.up.slice().reverse().concat([crack.impact], crack.down);
    var seam = topDown.map(function (p) { return p[0].toFixed(1) + 'px ' + p[1].toFixed(1) + 'px'; }).join(', ');

    var left = makeHalf('left', 'polygon(0px 0px, ' + seam + ', 0px ' + h + 'px)');
    var right = makeHalf('right', 'polygon(' + w + 'px 0px, ' + seam + ', ' + w + 'px ' + h + 'px)');

    var svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('class', 'crack-svg');
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);

    doors.innerHTML = '';
    doors.appendChild(left);
    doors.appendChild(right);
    doors.appendChild(svg);
    doors.style.setProperty('--slam-ms', SLAM + 'ms');
    doors.style.setProperty('--open-ms', OPEN + 'ms');
    doors.style.setProperty('--left-travel', -(ix + 40) + 'px');
    doors.style.setProperty('--right-travel', (w - ix + 40) + 'px');

    if (link && link.closest('.nav-menu')) {
      document.querySelectorAll('.nav-menu a.active').forEach(function (el) { el.classList.remove('active'); });
      link.classList.add('active');
    }

    root.classList.add('is-opening');
    doors.classList.add('is-slamming');

    later(function () {
      doors.classList.add('is-shaking');
      drawLine(svg, [crack.impact].concat(crack.up), 200);
      drawLine(svg, [crack.impact].concat(crack.down), 120);
      // two little forks off the impact point
      drawLine(svg, [crack.impact, [ix - 26, iy - 14], [ix - 44, iy - 6]], 120);
      drawLine(svg, [crack.impact, [ix + 24, iy - 18], [ix + 40, iy - 30]], 120);
      burst(svg, ix, iy);
    }, IMPACT);

    later(function () { doors.classList.add('is-open'); }, IMPACT + CRACK_HOLD);
    later(function () { window.location.href = href; }, IMPACT + CRACK_HOLD + OPEN);
    // If the next page never loads (bad signal, Stop button), close the door again.
    later(reset, IMPACT + CRACK_HOLD + OPEN + 5000);
  }

  function reset() {
    timers.forEach(clearTimeout);
    timers = [];
    busy = false;
    root.classList.remove('is-opening');
    doors.className = 'doors';
    doors.innerHTML = '';
    document.querySelectorAll('.nav-menu a.active').forEach(function (el) { el.classList.remove('active'); });
    var home = document.querySelector('.nav-menu a[href="index.html"]');
    if (home) home.classList.add('active');
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || !shouldSplit(a, e)) return;
    if (reduceMotion.matches) return; // plain navigation
    if (busy) return; // already opening: let a second tap navigate normally
    e.preventDefault();
    split(a.href, a);
  });

  // Coming back with the Back button: show the closed door again.
  window.addEventListener('pageshow', function (e) { if (e.persisted) reset(); });
  window.addEventListener('pagehide', function () { if (busy) reset(); });

  // Warm up what's behind the door so the reveal is instant.
  function warm() {
    if (navigator.connection && navigator.connection.saveData) return;
    var img = new Image();
    img.src = window.matchMedia('(max-width: 768px)').matches
      ? 'assets/images/MobileInsideBackground.webp'
      : 'assets/images/InsideBackground.webp';
    document.querySelectorAll('.nav-menu a[href$=".html"]').forEach(function (a) {
      if (isHomePath(new URL(a.href).pathname)) return;
      var l = document.createElement('link');
      l.rel = 'prefetch';
      l.href = a.getAttribute('href');
      document.head.appendChild(l);
    });
  }
  if ('requestIdleCallback' in window) requestIdleCallback(warm, { timeout: 2500 });
  else window.addEventListener('load', function () { setTimeout(warm, 600); });
})();
