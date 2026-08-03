/* osctrl.io — scroll reveal + cyberpunk animated background */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Scroll reveal ---------- */
  var revealSelector = [
    '.card', '.feature-row', '.section-head', 'pre.code', '.code-caption',
    '.diagram-box', 'table.spec', '.cta-band h2', '.cta-band p'
  ].join(', ');

  var els = Array.prototype.slice.call(document.querySelectorAll(revealSelector));
  els.forEach(function (el) { el.classList.add('reveal'); });

  if (reduced) {
    els.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var pending = els.slice();
    var ticking = false;

    var revealCheck = function () {
      ticking = false;
      var vh = window.innerHeight;
      var batch = 0;
      pending = pending.filter(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < vh - 40 && r.bottom > 0) {
          el.style.transitionDelay = Math.min(batch * 90, 450) + 'ms';
          el.classList.add('is-visible');
          batch++;
          return false;
        }
        return true;
      });
      if (!pending.length) {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      }
    };

    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      // setTimeout rather than requestAnimationFrame: rAF stalls in
      // hidden/embedded tabs, which would leave content unrevealed.
      setTimeout(revealCheck, 16);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    revealCheck();
  }

  /* ---------- Cyberpunk background ---------- */
  var canvas = document.createElement('canvas');
  canvas.id = 'cyber-bg';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);

  var scan = document.createElement('div');
  scan.id = 'cyber-scan';
  scan.setAttribute('aria-hidden', 'true');
  document.body.prepend(scan);

  if (reduced) return; // static dark background only

  var ctx = canvas.getContext('2d');
  var dpr = 1, W = 0, H = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  // Particles: osctrl signal teal + cyan + info blue, occasional amber node
  var COLORS = ['43,196,190', '95,227,223', '103,192,255'];
  var ACCENT = '251,191,36';
  var COUNT = Math.max(30, Math.min(90, Math.floor(window.innerWidth / 16)));
  var LINK_DIST = 140;

  var parts = [];
  for (var i = 0; i < COUNT; i++) {
    parts.push({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00045,
      vy: (Math.random() - 0.5) * 0.00045,
      r: 1 + Math.random() * 1.7,
      c: Math.random() < 0.06 ? ACCENT : COLORS[(Math.random() * COLORS.length) | 0],
      ph: Math.random() * Math.PI * 2
    });
  }

  var GRID = 90;
  var t = 0;
  var running = true;

  document.addEventListener('visibilitychange', function () {
    running = !document.hidden;
    if (running) requestAnimationFrame(frame);
  });

  function frame() {
    if (!running) return;
    t += 0.004;
    ctx.clearRect(0, 0, W, H);

    // Drifting neon grid
    var off = (t * 220) % GRID;
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(43,196,190,0.05)';
    ctx.beginPath();
    for (var gx = -GRID + off; gx < W + GRID; gx += GRID) {
      ctx.moveTo(gx, 0); ctx.lineTo(gx, H);
    }
    for (var gy = -GRID + off; gy < H + GRID; gy += GRID) {
      ctx.moveTo(0, gy); ctx.lineTo(W, gy);
    }
    ctx.stroke();

    // Slow neon pulse orbs
    var orbs = [
      { x: W * (0.18 + 0.04 * Math.sin(t * 0.9)), y: H * 0.22, r: 260, c: '43,196,190', a: 0.05 + 0.02 * Math.sin(t * 1.3) },
      { x: W * (0.82 + 0.04 * Math.cos(t * 0.7)), y: H * 0.7, r: 300, c: '95,227,223', a: 0.03 + 0.013 * Math.cos(t * 1.1) },
      { x: W * 0.55, y: H * (0.45 + 0.05 * Math.sin(t * 0.6)), r: 220, c: '103,192,255', a: 0.022 + 0.012 * Math.sin(t * 0.8 + 1) }
    ];
    orbs.forEach(function (o) {
      var g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
      g.addColorStop(0, 'rgba(' + o.c + ',' + o.a + ')');
      g.addColorStop(1, 'rgba(' + o.c + ',0)');
      ctx.fillStyle = g;
      ctx.fillRect(o.x - o.r, o.y - o.r, o.r * 2, o.r * 2);
    });

    // Particle network
    var px = [], py = [];
    for (var j = 0; j < COUNT; j++) {
      var p = parts[j];
      p.x += p.vx; p.y += p.vy;
      if (p.x < -0.02) p.x = 1.02; if (p.x > 1.02) p.x = -0.02;
      if (p.y < -0.02) p.y = 1.02; if (p.y > 1.02) p.y = -0.02;
      px[j] = p.x * W;
      py[j] = p.y * H;
    }

    for (var a = 0; a < COUNT; a++) {
      for (var b = a + 1; b < COUNT; b++) {
        var dx = px[a] - px[b], dy = py[a] - py[b];
        var d2 = dx * dx + dy * dy;
        if (d2 < LINK_DIST * LINK_DIST) {
          var alpha = (1 - Math.sqrt(d2) / LINK_DIST) * 0.16;
          ctx.strokeStyle = 'rgba(' + parts[a].c + ',' + alpha.toFixed(3) + ')';
          ctx.beginPath();
          ctx.moveTo(px[a], py[a]);
          ctx.lineTo(px[b], py[b]);
          ctx.stroke();
        }
      }
    }

    for (var k = 0; k < COUNT; k++) {
      var q = parts[k];
      var tw = 0.55 + 0.45 * Math.sin(t * 2.2 + q.ph);
      ctx.fillStyle = 'rgba(' + q.c + ',' + (0.5 * tw).toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(px[k], py[k], q.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();
