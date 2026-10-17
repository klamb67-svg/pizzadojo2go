/* Pizza Dojo home page: fireflies drifting around the dojo. */
(function () {
  'use strict';
  // Tell the CSS how tall the nav bar is, so the sign never hides under it.
  var nav = document.querySelector('.nav-menu');
  function setNavH() {
    var bottom = nav ? nav.getBoundingClientRect().bottom : 0;
    var bar = document.getElementById('dojo-escape');   // Instagram "open in browser" bar
    if (bar) bottom += bar.offsetHeight;
    document.documentElement.style.setProperty('--nav-h', bottom + 'px');
  }
  setNavH();
  window.addEventListener('resize', setNavH);
  window.addEventListener('dojo:chrome-resize', setNavH);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(setNavH);

  var box = document.querySelector('#door-scene .fireflies');
  if (!box) return;

  function rand(a, b) { return a + Math.random() * (b - a); }
  function drift() { return rand(-2.5, 2.5).toFixed(2) + 'vmax'; }

  // Mostly in the trees on both sides, plus a few over the steps
  // so phones (which only show the middle) get some too.
  var spots = [];
  for (var i = 0; i < 14; i++) {
    var left = Math.random() < 0.5;
    spots.push([left ? rand(2, 24) : rand(76, 98), rand(22, 78)]);
  }
  for (var j = 0; j < 6; j++) spots.push([rand(37, 63), rand(70, 95)]);

  spots.forEach(function (p) {
    var f = document.createElement('span');
    f.className = 'firefly';
    f.style.setProperty('--x', p[0].toFixed(2) + '%');
    f.style.setProperty('--y', p[1].toFixed(2) + '%');
    f.style.setProperty('--dur', rand(7, 13).toFixed(1) + 's');
    f.style.setProperty('--blink', rand(2.5, 5).toFixed(1) + 's');
    f.style.setProperty('--delay', (-rand(0, 10)).toFixed(1) + 's');
    ['1', '2', '3'].forEach(function (k) {
      f.style.setProperty('--dx' + k, drift());
      f.style.setProperty('--dy' + k, drift());
    });
    box.appendChild(f);
  });

  // Loose neon wires: about every 20s (17-23s), the I or the J sputters.
  var loose = document.querySelectorAll('#door-scene .neon-loose');
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)');
  function sputter() {
    if (!calm.matches && loose.length && !document.hidden &&
        !document.documentElement.classList.contains('is-opening')) {
      var tube = loose[Math.floor(Math.random() * loose.length)];
      // build a random sputter: 2-5 quick off/on flicks
      var frames = [{ opacity: 1, offset: 0 }];
      var flicks = 2 + Math.floor(Math.random() * 4);
      var total = 0, steps = [];
      for (var i = 0; i < flicks; i++) {
        var off = 40 + Math.random() * 120, on = 80 + Math.random() * 240;
        steps.push([total, Math.random() * 0.25], [total + off, 1]);
        total += off + on;
      }
      steps.forEach(function (st) { frames.push({ opacity: st[1], offset: Math.min(0.999, st[0] / total) }); });
      frames.push({ opacity: 1, offset: 1 });
      frames.sort(function (x, y) { return x.offset - y.offset; });
      frames.forEach(function (f) { f.easing = 'steps(1, end)'; });  // hard on/off, like a real tube
      if (tube.animate) tube.animate(frames, { duration: total });
    }
    setTimeout(sputter, 17000 + Math.random() * 6000);
  }
  setTimeout(sputter, 8000 + Math.random() * 6000);
})();
