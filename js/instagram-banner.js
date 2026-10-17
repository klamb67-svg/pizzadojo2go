/**
 * Instagram / Facebook in-app browser escape (2026)
 *
 * Tapping our link inside Instagram opens a cramped built-in browser.
 * 1. Once per visit we try to jump straight to the phone's real browser:
 *      iPhone + Instagram: instagram://extbrowser/?url=...   (verified working Sep 2026;
 *                          the older x-safari-https:// trick was blocked by Instagram)
 *      Android:            intent://...;package=com.android.chrome  (hands off to Chrome)
 * 2. If we're still here, a comic-style bar under the nav offers a one-tap
 *    "Open in browser" button, plus the manual "••• → Open in external browser" tip.
 */
(function () {
  'use strict';

  var ua = navigator.userAgent || '';
  var isInstagram = /Instagram/i.test(ua);
  var isFacebook = /FBAN|FBAV|FB_IAB/i.test(ua);
  if (!isInstagram && !isFacebook) return;

  var isIOS = /iPad|iPhone|iPod/.test(ua);
  var isAndroid = /Android/i.test(ua);
  var here = location.href;

  function escapeUrl() {
    if (isAndroid) {
      return 'intent://' + here.replace(/^https?:\/\//, '') +
        '#Intent;scheme=' + location.protocol.replace(':', '') +
        ';package=com.android.chrome;S.browser_fallback_url=' + encodeURIComponent(here) + ';end';
    }
    if (isIOS && isInstagram) return 'instagram://extbrowser/?url=' + encodeURIComponent(here);
    return null; // Facebook on iPhone: no reliable trick, show the manual tip
  }

  function storageGet(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  function storageSet(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }

  // ---- 1. automatic jump, once per visit ----
  var target = escapeUrl();
  if (target && !storageGet('dojo-escape-tried')) {
    storageSet('dojo-escape-tried', '1');
    var meta = document.createElement('meta');   // declarative redirect works best on page load
    meta.httpEquiv = 'refresh';
    meta.content = '0;url=' + target;
    (document.head || document.documentElement).appendChild(meta);
  }

  // ---- 2. the fallback bar ----
  var css = '' +
    '#dojo-escape{position:fixed;left:0;right:0;z-index:1001;display:flex;align-items:center;justify-content:center;gap:.6rem;' +
    'padding:.45rem .7rem;background:#ffd54a radial-gradient(rgba(29,18,11,.16) 1.1px,transparent 1.5px) 0 0/7px 7px;' +
    'border-bottom:3px solid #1d120b;box-shadow:0 3px 0 rgba(29,18,11,.5);font-family:Bangers,cursive;letter-spacing:.04em;color:#1d120b;}' +
    '#dojo-escape p{margin:0;font-size:1rem;line-height:1.1;text-align:left}' +
    '#dojo-escape small{display:block;font-family:"Varela Round",sans-serif;letter-spacing:0;font-size:.72rem;margin-top:2px}' +
    '#dojo-escape .go{flex:none;font:inherit;font-size:1rem;color:#1d120b;background:#fffaf0;border:2.5px solid #1d120b;' +
    'border-radius:9px;box-shadow:3px 3px 0 #1d120b;padding:.3rem .7rem .2rem;cursor:pointer;-webkit-tap-highlight-color:transparent}' +
    '#dojo-escape .go:active{transform:translate(3px,3px);box-shadow:0 0 0 #1d120b}' +
    '#dojo-escape .x{flex:none;font:700 1.4rem/1 "Varela Round",sans-serif;background:none;border:0;color:#1d120b;padding:.1rem .3rem;cursor:pointer}';

  function showBar() {
    if (storageGet('dojo-escape-dismissed')) return;
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var nav = document.querySelector('.nav-menu');
    var bar = document.createElement('div');
    bar.id = 'dojo-escape';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Open in your browser');
    bar.innerHTML =
      '<p>Get the full Dojo experience!' +
      '<small>' + (target ? 'Opens in your phone\'s browser' : 'Tap ••• up top, then "Open in external browser"') + '</small></p>' +
      (target ? '<button class="go" type="button">Open in browser</button>' : '') +
      '<button class="x" type="button" aria-label="Close">&times;</button>';
    document.body.appendChild(bar);

    var isHome = document.body.classList.contains('home');
    var basePad = parseFloat(getComputedStyle(document.body).paddingTop) || 0;
    function place() {
      bar.style.top = (nav ? nav.getBoundingClientRect().bottom : 0) + 'px';
      if (!isHome) document.body.style.paddingTop = (basePad + bar.offsetHeight) + 'px'; // push inner-page content below the bar
      // let the home page keep its sign clear of nav + this bar
      document.documentElement.style.setProperty('--escape-h', bar.offsetHeight + 'px');
      window.dispatchEvent(new Event('dojo:chrome-resize'));
    }
    place();
    window.addEventListener('resize', place);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);

    var go = bar.querySelector('.go');
    if (go) go.addEventListener('click', function () {
      location.href = target; // must run right inside the tap
      setTimeout(function () {
        var s = bar.querySelector('small');
        if (s && document.visibilityState === 'visible') s.textContent = 'Still here? Tap ••• up top, then "Open in external browser"';
      }, 1500);
    });
    bar.querySelector('.x').addEventListener('click', function () {
      storageSet('dojo-escape-dismissed', '1');
      bar.remove();
      document.body.style.paddingTop = '';
      document.documentElement.style.removeProperty('--escape-h');
      window.dispatchEvent(new Event('dojo:chrome-resize'));
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', showBar);
  else showBar();
})();
