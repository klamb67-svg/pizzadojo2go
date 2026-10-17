/* Pizza Dojo gallery: newest bakes first, grouped by month.
   Reads assets/images/gallery-web/gallery-data.json (made by scripts/build-gallery.py),
   shows small previews in a comic-panel grid, and opens a swipeable full-screen viewer. */
(function () {
  'use strict';

  var DATA = 'assets/images/gallery-web/gallery-data.json';
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'];
  var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  var box = document.getElementById('gallery');
  var countEl = document.getElementById('galleryCount');
  var viewer = document.getElementById('viewer');
  var vImg = document.getElementById('viewerImg');
  var vCap = document.getElementById('viewerCaption');
  var vPrev = document.getElementById('viewerPrev');
  var vNext = document.getElementById('viewerNext');
  var vClose = document.getElementById('viewerClose');

  var photos = [];
  var current = -1;
  var pushedState = false;

  function parseDate(s) {           // "2025-01-31T19:31:53" as local time
    var p = s.split(/[-T:]/).map(Number);
    return new Date(p[0], p[1] - 1, p[2], p[3] || 0, p[4] || 0, p[5] || 0);
  }
  function niceDate(d) {
    return DAYS[d.getDay()] + ', ' + MONTHS[d.getMonth()].slice(0, 3) + ' ' + d.getDate() + ', ' + d.getFullYear();
  }

  // ---------- grid ----------
  function render() {
    box.innerHTML = '';
    var frag = document.createDocumentFragment();
    var section = null, grid = null, label = null, key = '', inMonth = 0;

    photos.forEach(function (p, i) {
      var d = p.date;
      var k = d.getFullYear() + '-' + d.getMonth();
      if (k !== key) {
        if (label) label.querySelector('small').textContent = inMonth + (inMonth === 1 ? ' bake' : ' bakes');
        key = k; inMonth = 0;
        section = document.createElement('section');
        section.className = 'g-month';
        label = document.createElement('h2');
        label.className = 'g-month-label';
        label.innerHTML = MONTHS[d.getMonth()] + ' ' + d.getFullYear() + ' <small></small>';
        grid = document.createElement('div');
        grid.className = 'g-grid';
        section.appendChild(label);
        section.appendChild(grid);
        frag.appendChild(section);
      }
      inMonth++;

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'g-item';
      btn._ar = p.w / p.h;
      btn.setAttribute('aria-label', 'Photo ' + (i + 1) + ' of ' + photos.length + ', ' + niceDate(d));
      btn.dataset.i = i;

      var img = document.createElement('img');
      img.alt = '';
      img.decoding = 'async';
      img.loading = i < 12 ? 'eager' : 'lazy';      // first screen right away, rest as you scroll
      if (i < 4 && 'fetchPriority' in img) img.fetchPriority = 'high';
      img.width = Math.round(400 * p.w / p.h);
      img.height = 400;
      img.addEventListener('load', function () { img.classList.add('is-loaded'); });
      img.addEventListener('error', function () { img.classList.add('is-loaded'); img.alt = 'Photo unavailable'; });
      img.src = p.t;
      if (img.complete) img.classList.add('is-loaded');
      btn.appendChild(img);
      grid.appendChild(btn);
    });
    if (label) label.querySelector('small').textContent = inMonth + (inMonth === 1 ? ' bake' : ' bakes');

    box.appendChild(frag);
    countEl.textContent = photos.length + ' bakes and counting';
    layout();
  }

  // Justified rows (like Google Photos): fill each row edge to edge,
  // every photo keeps its real shape, the last row stays at normal height.
  function layout() {
    var grids = Array.prototype.slice.call(box.querySelectorAll('.g-grid'));
    var sizes = grids.map(function (g) {     // read everything first (one reflow), then write
      return { W: g.clientWidth - 1, gap: parseFloat(getComputedStyle(g).columnGap) || 12 };
    });
    grids.forEach(function (grid, gi) {
      var W = sizes[gi].W;                     // 1px slack so rounding never wraps a row
      if (W <= 0) return;
      var gap = sizes[gi].gap;
      var target = W < 520 ? 118 : W < 900 ? 170 : 210;
      var items = Array.prototype.slice.call(grid.children);
      var row = [], sumAr = 0;
      function setRow(h) {
        row.forEach(function (it) {
          it.style.width = (it._ar * h).toFixed(2) + 'px';
          it.style.height = h.toFixed(2) + 'px';
        });
        row = []; sumAr = 0;
      }
      items.forEach(function (it) {
        row.push(it); sumAr += it._ar;
        var gaps = gap * (row.length - 1);
        if (sumAr * target + gaps >= W) {
          setRow((W - gaps) / sumAr);
        }
      });
      if (row.length) setRow(target);          // last row: normal height, left aligned
    });
  }
  // re-fit when the width really changes (scrollbar appearing, rotation, window resize)
  var resizeTimer, lastW = 0;
  function relayoutSoon() {
    var w = box.clientWidth;
    if (w === lastW) return;
    lastW = w;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layout, 80);
  }
  if ('ResizeObserver' in window) new ResizeObserver(relayoutSoon).observe(box);
  else window.addEventListener('resize', relayoutSoon);

  box.addEventListener('click', function (e) {
    var btn = e.target.closest('.g-item');
    if (btn) open(Number(btn.dataset.i));
  });

  // ---------- viewer ----------
  function preload(i) {
    if (i >= 0 && i < photos.length) { var im = new Image(); im.src = photos[i].l; }
  }

  function show(i, dir) {
    if (i < 0 || i >= photos.length) return;
    current = i;
    var p = photos[i];
    // show the small preview instantly, swap in the sharp version when it arrives
    vImg.src = p.t;
    var big = new Image();
    big.onload = function () { if (current === i) vImg.src = p.l; };
    big.src = p.l;
    vImg.style.transform = dir ? 'translateX(' + (dir * 40) + 'px)' : 'none';
    vImg.style.opacity = '0.4';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { vImg.style.transform = 'none'; vImg.style.opacity = '1'; });
    });
    vCap.innerHTML = niceDate(p.date) + '<span>' + (i + 1) + ' / ' + photos.length + '</span>';
    vImg.alt = 'Pizza Dojo bake from ' + niceDate(p.date);
    var last = photos.length - 1;
    if ((i === 0 && document.activeElement === vPrev) || (i === last && document.activeElement === vNext)) vClose.focus();
    vPrev.disabled = i === 0;
    vNext.disabled = i === last;
    preload(i + 1); preload(i - 1);
  }

  function open(i) {
    show(i, 0);
    if (typeof viewer.showModal === 'function') viewer.showModal();
    else viewer.setAttribute('open', '');
    document.body.style.overflow = 'hidden';
    // phone Back button closes the viewer instead of leaving the page
    if (!pushedState) { history.pushState({ dojoViewer: true }, ''); pushedState = true; }
  }

  var ignorePop = false;
  function closeViewer() {
    if (viewer.open) viewer.close();          // 'close' event below does the cleanup
    else cleanup();
  }
  function cleanup() {
    document.body.style.overflow = '';
    if (pushedState) {                        // remove the history entry we added on open
      pushedState = false;
      ignorePop = true;
      history.back();
    }
    var btn = box.querySelector('.g-item[data-i="' + current + '"]');
    if (btn) btn.focus({ preventScroll: true });
  }
  viewer.addEventListener('close', cleanup);

  vPrev.addEventListener('click', function () { show(current - 1, -1); });
  vNext.addEventListener('click', function () { show(current + 1, 1); });
  vClose.addEventListener('click', closeViewer);   // Esc closes natively and fires 'close'
  viewer.addEventListener('click', function (e) {          // tap the dark area to close
    if (e.target === viewer || e.target.classList.contains('g-stage')) closeViewer();
  });
  window.addEventListener('popstate', function () {
    if (ignorePop) { ignorePop = false; return; }  // that was our own history.back()
    if (viewer.open) { pushedState = false; viewer.close(); } // phone Back button
  });
  document.addEventListener('keydown', function (e) {
    if (!viewer.open) return;
    if (e.key === 'ArrowLeft') show(current - 1, -1);
    if (e.key === 'ArrowRight') show(current + 1, 1);
  });

  // swipe left/right on phones
  var sx = null, sy = 0;
  viewer.addEventListener('touchstart', function (e) {
    if (e.touches.length === 1) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }
  }, { passive: true });
  viewer.addEventListener('touchend', function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    sx = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) show(current + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  }, { passive: true });

  // ---------- load ----------
  fetch(DATA)
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (data) {
      photos = data.photos.map(function (p) { p.date = parseDate(p.d); return p; });
      render();
    })
    .catch(function () {
      box.innerHTML = '<p class="g-status">The gallery didn\'t load. Please refresh the page.</p>';
    });
})();
