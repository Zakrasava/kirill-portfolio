/* Портфолио v2: появление блоков, маршрут слева, счётчики, лайтбокс. Без зависимостей. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── появление секций ── */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); countUp(e.target); }
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
  document.querySelectorAll('[data-in]').forEach(function (el) { io.observe(el); });

  /* ── счётчики: <b data-count="13517" data-fmt="ru">0</b> ── */
  function fmt(n, kind) {
    if (kind === 'pct') return String(n).replace('.', ',') + ' %';
    var s = Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return s;
  }
  function countUp(root) {
    root.querySelectorAll('[data-count]').forEach(function (el) {
      if (el.dataset.done) return; el.dataset.done = '1';
      var to = parseFloat(el.dataset.count), pre = el.dataset.pre || '', suf = el.dataset.suf || '', kind = el.dataset.fmt || '';
      var dec = (String(el.dataset.count).split('.')[1] || '').length;
      if (reduce) { el.textContent = pre + (kind === 'pct' ? fmt(to, 'pct') : fmt(to)) + suf; return; }
      var t0 = null, dur = 1400;
      function step(t) {
        if (!t0) t0 = t; var k = Math.min(1, (t - t0) / dur); k = 1 - Math.pow(1 - k, 3);
        var v = to * k; if (dec) v = Math.round(v * Math.pow(10, dec)) / Math.pow(10, dec);
        el.textContent = pre + (kind === 'pct' ? v.toFixed(dec).replace('.', ',') + ' %' : fmt(v)) + suf;
        if (k < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  /* ── линии: длина штриха по реальной геометрии ── */
  document.querySelectorAll('path.draw, .chart .line, .ws .arrow path, .rail .ln-on').forEach(function (p) {
    try { var L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = reduce ? 0 : L; } catch (e) {}
  });

  /* ── маршрут слева: узлы = секции с data-stop ── */
  var rail = document.querySelector('.rail');
  var stops = Array.prototype.slice.call(document.querySelectorAll('[data-stop]'));
  if (rail && stops.length) {
    var tok = rail.querySelector('.tok'), lnOn = rail.querySelector('.ln-on');
    var nodes = stops.map(function (s, i) {
      var b = document.createElement('button'); b.className = 'st'; b.type = 'button';
      b.innerHTML = '<b>' + s.dataset.stop + '</b>'; b.setAttribute('aria-label', s.dataset.stop);
      b.addEventListener('click', function () { s.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); });
      rail.appendChild(b); return b;
    });
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('.top nav a[href^="#"]'));
    function place() {
      var h = window.innerHeight, top = 120, bottom = h - 120, span = bottom - top;
      nodes.forEach(function (b, i) { b.style.top = (top + span * i / (stops.length - 1)) + 'px'; });
      update();
    }
    function update() {
      var y = window.scrollY + window.innerHeight * 0.38, cur = 0;
      stops.forEach(function (s, i) { if (s.offsetTop <= y) cur = i; });
      var h = window.innerHeight, top = 120, bottom = h - 120, span = bottom - top;
      var next = stops[cur + 1], a = stops[cur].offsetTop, bEnd = next ? next.offsetTop : a + 1, frac = Math.max(0, Math.min(1, (y - a) / (bEnd - a)));
      var pos = top + span * (cur + (next ? frac : 0)) / (stops.length - 1);
      tok.style.top = pos + 'px';
      if (lnOn) { var L = parseFloat(lnOn.style.strokeDasharray) || 1; lnOn.style.strokeDashoffset = L * (1 - (pos / h)); }
      nodes.forEach(function (b, i) { b.classList.toggle('on', i < cur); b.classList.toggle('cur', i === cur); });
      var id = stops[cur].id;
      navLinks.forEach(function (l) { l.classList.toggle('cur', l.getAttribute('href') === '#' + id); });
    }
    window.addEventListener('resize', place); window.addEventListener('scroll', update, { passive: true }); place();
  }

  /* ── активный пункт навигации на странице модулей ── */
  var modnav = document.querySelector('.modnav');
  if (modnav) {
    var links = Array.prototype.slice.call(modnav.querySelectorAll('a')), mods = Array.prototype.slice.call(document.querySelectorAll('.mod[id]'));
    function upd() {
      var y = window.scrollY + 200, cur = mods[0];
      mods.forEach(function (m) { if (m.offsetTop <= y) cur = m; });
      links.forEach(function (l) { var on = l.getAttribute('href') === '#' + cur.id; l.classList.toggle('cur', on); if (on) l.scrollIntoView({ block: 'nearest', inline: 'nearest' }); });
    }
    window.addEventListener('scroll', upd, { passive: true }); upd();
  }

  /* ── лайтбокс ── */
  var lb = document.createElement('div'); lb.className = 'lb'; lb.innerHTML = '<img alt=""><span></span>'; document.body.appendChild(lb);
  var lbImg = lb.querySelector('img'), lbCap = lb.querySelector('span');
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (t.tagName === 'IMG' && t.closest('.shot')) { lbImg.src = t.src; lbImg.alt = t.alt; lbCap.textContent = t.alt; lb.classList.add('open'); document.body.style.overflow = 'hidden'; }
    else if (t === lb || t === lbImg) { lb.classList.remove('open'); document.body.style.overflow = ''; }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { lb.classList.remove('open'); document.body.style.overflow = ''; } });

  /* ── копировать ссылку ── */
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var url = location.origin + location.pathname;
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { var t = b.textContent; b.textContent = 'Скопировано'; setTimeout(function () { b.textContent = t; }, 1600); });
    });
  });
})();
