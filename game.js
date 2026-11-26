/* =====================================================================
   PÄTRICK JUMP  —  versteckter Easter-Egg-Doodle-Jumper
   Trigger: tippe irgendwo auf der Seite  a-k-t-e
   Thema: Schwarze Akte (True Crime) + Twitch thepaetrick
   Sammle echte Twitch-Clips · Skins · Chat-Trolle · Raid/Hype-Train
   ===================================================================== */
(function () {
  var AMBER = '#f0a340', AMBER2 = '#ffcf87', CRIMSON = '#e0243f', PURPLE = '#a970ff',
      BONE = '#efe6d6', INK = '#0c0f12';

  /* -------- Konfetti-Regen bei Taste "c" (Feier bei Voll-Sammlung) -------- */
  document.addEventListener('keydown', function (e) {
    if (!e.key || e.key.toLowerCase() !== 'c') return;
    var el = document.activeElement, tag = (el && el.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select' || (el && el.isContentEditable)) return;
    var colors = [AMBER, CRIMSON, BONE, PURPLE], count = 170;
    var container = document.createElement('div');
    container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999999;overflow:hidden';
    document.body.appendChild(container);
    for (var i = 0; i < count; i++) {
      var piece = document.createElement('div'), size = Math.random() * 9 + 5;
      piece.style.cssText = 'position:absolute;width:' + size + 'px;height:' + size + 'px;background:' +
        colors[Math.floor(Math.random() * colors.length)] + ';left:' + (Math.random() * 100) + 'vw;top:-20px;opacity:1;border-radius:' + (Math.random() > 0.5 ? '50%' : '2px') + ';box-shadow:0 0 8px rgba(240,163,64,.4)';
      container.appendChild(piece);
      var duration = Math.random() * 2 + 2, drift = (Math.random() - 0.5) * 220, rot = Math.random() * 720 - 360;
      piece.animate([{ transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
        { transform: 'translate(' + drift + 'px, 100vh) rotate(' + rot + 'deg)', opacity: 0.9 }],
        { duration: duration * 1000, easing: 'cubic-bezier(0.25,0.46,0.45,0.94)', fill: 'forwards' });
      (function (p, d) { setTimeout(function () { if (p.parentNode) p.parentNode.removeChild(p); }, d * 1000 + 100); })(piece, duration);
    }
    setTimeout(function () { if (container.parentNode) container.parentNode.removeChild(container); }, 4600);
  });

  /* --------------------------- Das Spiel --------------------------- */
  var TRIGGER = 'akte';

  // Echte Twitch-Clips von thepaetrick — das sind die Sammel-Objekte
  var CLIPS = [
    { id: 'mops',  name: 'Teilzeitmops 🐕',            url: 'https://www.twitch.tv/thepaetrick/clip/AnnoyingStylishPeafowlAllenHuhu-X9rdP58S30uJeJ8A' },
    { id: 'crash', name: 'Thecrashtrick',                        url: 'https://www.twitch.tv/thepaetrick/clip/SuspiciousSilkyRaccoonTriHard-QtOCbQGVmSqOnvh4' },
    { id: 'dreht', name: 'Patrick dreht durch',                  url: 'https://www.twitch.tv/thepaetrick/clip/SlipperyExcitedStrawberrySSSsss-n60Pm9sGIAEua0Wc' },
    { id: 'hair',  name: 'Bad Hairday bei Patrick',              url: 'https://www.twitch.tv/thepaetrick/clip/HotBravePanKAPOW-IBXeH7pnQr5B1tad' },
    { id: 'vodka', name: 'Vodka Workout',                        url: 'https://www.twitch.tv/thepaetrick/clip/SarcasticFilthyOysterCoolCat-kok-Ft8QXV493snl' },
    { id: 'jump',  name: 'Wieder Jumpscare',                     url: 'https://www.twitch.tv/thepaetrick/clip/GlutenFreeTriangularDelicataKreygasm-8RqQFhBZ6JR4dxHb' },
    { id: 'zitat', name: 'Zitat-Ende: Gänsehaut',           url: 'https://www.twitch.tv/thepaetrick/clip/HilariousCaringPelicanMau5-RNZ3eEoFbyB_VY2c' },
    { id: 'ki',    name: 'Nicht durch KI ersetzbar!',            url: 'https://www.twitch.tv/thepaetrick/clip/SmokyCulturedAlmondHassanChop-lss28JKEyGNtCehz' }
  ];

  var SKINS = [
    { id: 'patrick', name: 'Patrick' },
    { id: 'anne',    name: 'Anne' },
    { id: 'akte',    name: 'Schwarze Akte' },
    { id: 'mystery', name: 'Unbekannt' }
  ];

  var GR = 1500, JUMP = -640, TRAMP = -1180, SPRING = -900, HSPEED = 340;
  var buffer = '', G = null;

  document.addEventListener('keydown', function (e) {
    var el = document.activeElement, tag = (el && el.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select' || (el && el.isContentEditable)) return;
    if (e.key === 'Escape') { close(); return; }
    if (e.key && e.key.length === 1) {
      buffer = (buffer + e.key.toLowerCase()).slice(-TRIGGER.length);
      if (buffer === TRIGGER) { buffer = ''; G ? close() : open(); }
    }
  });

  function loadLB() { try { return JSON.parse(localStorage.getItem('pj_lb') || '[]') || []; } catch (e) { return []; } }
  function saveLB(l) { try { localStorage.setItem('pj_lb', JSON.stringify(l.slice(0, 20))); } catch (e) {} }
  function esc(s) { return String(s).replace(/[<>&"]/g, function (c) { return { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]; }); }

  function injectStyles() {
    if (document.getElementById('pj-styles')) return;
    var s = document.createElement('style'); s.id = 'pj-styles';
    s.textContent =
      '@keyframes pj-in{from{transform:translateY(-50%) translateX(120%);opacity:0}to{transform:translateY(-50%) translateX(0);opacity:1}}' +
      '@keyframes pj-glow{0%,100%{box-shadow:0 0 0 2px rgba(240,163,64,.10) inset,0 30px 70px rgba(0,0,0,.6)}50%{box-shadow:0 0 0 2px rgba(240,163,64,.22) inset,0 30px 80px rgba(224,36,63,.18)}}' +
      '.pj-phone{position:fixed;right:22px;top:50%;transform:translateY(-50%);width:min(330px,92vw);height:min(680px,94vh);background:#050607;border-radius:42px;padding:12px;z-index:999990;font-family:Oswald,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;animation:pj-in .4s cubic-bezier(.2,.8,.2,1) both,pj-glow 4s ease-in-out infinite 1s;box-sizing:border-box;border:1px solid rgba(240,163,64,.14)}' +
      '.pj-notch{position:absolute;top:16px;left:50%;transform:translateX(-50%);width:120px;height:22px;background:#050607;border-radius:0 0 14px 14px;z-index:3}' +
      '.pj-notch:after{content:"";position:absolute;top:8px;left:50%;transform:translateX(-50%);width:44px;height:5px;background:#1c1f24;border-radius:3px}' +
      '.pj-screen{position:relative;width:100%;height:100%;background:#0a0e10;border-radius:31px;overflow:hidden;display:flex;flex-direction:column}' +
      '.pj-head{height:54px;background:linear-gradient(90deg,' + CRIMSON + ',#8f1526 55%,#171013);color:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 14px 0 18px;flex:0 0 auto;z-index:2;border-bottom:1px solid rgba(240,163,64,.25)}' +
      '.pj-title{font-family:Anton,Oswald,sans-serif;font-weight:400;font-size:18px;letter-spacing:1.5px;text-transform:uppercase}' +
      '.pj-title b{color:' + AMBER + '}' +
      '.pj-hud{display:flex;align-items:center;gap:9px;font-size:15px;font-weight:700}' +
      '.pj-lives{display:flex;gap:4px}.pj-life{width:9px;height:9px;border-radius:50%;background:' + AMBER + ';box-shadow:0 0 6px ' + AMBER + ';transition:opacity .2s,transform .2s}.pj-life.off{opacity:.22;box-shadow:none;transform:scale(.8)}' +
      '.pj-x{cursor:pointer;font-size:20px;line-height:1;width:30px;height:30px;display:flex;align-items:center;justify-content:center;border-radius:50%;background:rgba(0,0,0,.28);user-select:none;transition:.15s}.pj-x:hover{background:rgba(0,0,0,.55);transform:scale(1.08)}' +
      '.pj-canvas{flex:1 1 auto;display:block;width:100%;touch-action:none;background:transparent}' +
      '.pj-ctrls{flex:0 0 auto;display:flex;gap:8px;padding:9px 12px 14px}' +
      '.pj-btn{flex:1;height:50px;border:1px solid rgba(255,255,255,.06);border-radius:15px;background:#161b20;color:#fff;font-size:23px;font-weight:800;cursor:pointer;user-select:none;-webkit-tap-highlight-color:transparent;transition:transform .05s,background .1s}.pj-btn:active{transform:scale(.94)}' +
      '.pj-btn.shoot{flex:0 0 36%;background:linear-gradient(180deg,' + PURPLE + ',#7a44e0);border-color:transparent}.pj-btn.shoot:active{filter:brightness(1.25)}' +
      '.pj-overlay{position:absolute;inset:0;background:radial-gradient(120% 90% at 50% 0%,rgba(224,36,63,.14),transparent 55%),linear-gradient(180deg,rgba(8,11,13,.96),rgba(8,11,13,.99));display:flex;flex-direction:column;z-index:5;color:#fff}' +
      '.pj-oscroll{width:100%;height:100%;overflow-y:auto;padding:24px 20px 22px;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;gap:11px;text-align:center}' +
      '.pj-logo{font-family:"Space Mono",monospace;font-size:12px;font-weight:700;letter-spacing:4px;color:' + AMBER + ';text-transform:uppercase}' +
      '.pj-tagline{font-size:11px;letter-spacing:2px;color:#7d8595;text-transform:uppercase;margin-top:-6px}' +
      '.pj-h2{font-family:Anton,Oswald,sans-serif;font-weight:400;font-size:40px;letter-spacing:1px;margin:6px 0 0;text-transform:uppercase;line-height:.9}' +
      '.pj-h2 b{color:' + AMBER + '}' +
      '.pj-p{font-size:13px;line-height:1.6;color:#aeb6c6;max-width:250px}' +
      '.pj-p b{color:' + BONE + '}' +
      '.pj-skinlbl{font-family:"Space Mono",monospace;font-size:11px;letter-spacing:2px;color:' + AMBER + ';text-transform:uppercase;margin-top:4px}' +
      '.pj-skins{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}' +
      '.pj-skin{width:66px;border:1px solid #232b38;background:#10151b;border-radius:14px;padding:7px 4px 6px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:3px;transition:.2s;color:#8a93a6}' +
      '.pj-skin canvas{width:44px;height:44px}' +
      '.pj-skin span{font-size:9.5px;font-weight:700;letter-spacing:.3px}' +
      '.pj-skin.active{border-color:' + AMBER + ';background:#1a130a;color:' + BONE + ';box-shadow:0 0 16px rgba(240,163,64,.25)}' +
      '.pj-play{margin-top:10px;border:none;border-radius:999px;background:linear-gradient(135deg,' + AMBER2 + ',' + AMBER + ');color:#170c02;font-family:Oswald,sans-serif;font-size:16px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:14px 34px;cursor:pointer;box-shadow:0 8px 26px rgba(240,163,64,.4)}.pj-play:active{transform:scale(.97)}' +
      '.pj-score-big{font-family:Anton,sans-serif;font-size:46px;color:#fff;margin:2px 0;text-shadow:0 0 22px rgba(240,163,64,.5)}' +
      '.pj-hi{font-size:12px;color:#8a93a6;font-weight:600}' +
      '.pj-sec{width:100%;text-align:left;font-family:"Space Mono",monospace;font-size:12px;font-weight:700;color:' + AMBER + ';letter-spacing:1px;margin-top:10px;text-transform:uppercase}' +
      '.pj-save{display:flex;gap:7px;width:100%;margin-top:2px}' +
      '.pj-name{flex:1;min-width:0;border:1px solid #2a3242;background:#11161d;color:#fff;border-radius:12px;padding:11px 12px;font-size:13px;font-weight:600;outline:none;font-family:Oswald,sans-serif}' +
      '.pj-name:focus{border-color:' + AMBER + '}' +
      '.pj-savebtn{border:none;border-radius:12px;background:' + AMBER + ';color:#170c02;font-size:13px;font-weight:700;padding:0 16px;cursor:pointer}.pj-savebtn:disabled{opacity:.4;cursor:default}' +
      '.pj-lb{width:100%;display:flex;flex-direction:column;gap:5px}' +
      '.pj-lbrow{display:flex;align-items:center;gap:9px;background:#11161d;border-radius:11px;padding:8px 11px;font-size:13px;font-weight:600}' +
      '.pj-lbrow.me{background:#1c130a;box-shadow:0 0 0 1px ' + AMBER + ' inset}' +
      '.pj-rank{width:22px;font-weight:800;color:#8a93a6;flex:0 0 auto}' +
      '.pj-lbrow.g1 .pj-rank{color:#ffd23f}.pj-lbrow.g2 .pj-rank{color:#c8d0e0}.pj-lbrow.g3 .pj-rank{color:#e0975a}' +
      '.pj-lbn{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:left}' +
      '.pj-lbs{font-weight:800;color:' + AMBER + '}' +
      '.pj-collection{width:100%;display:flex;flex-direction:column;gap:6px}' +
      '.pj-row{display:flex;align-items:center;gap:9px;background:#11161d;border:1px solid #1e2634;border-radius:12px;padding:9px 11px;font-size:12.5px;font-weight:600;color:#fff;text-decoration:none}' +
      '.pj-row.locked{opacity:.4}.pj-row.link{cursor:pointer;transition:.15s}.pj-row.link:active{background:#1a2230}.pj-row.link:hover{border-color:' + PURPLE + '}' +
      '.pj-dot{width:26px;height:26px;border-radius:8px;flex:0 0 auto;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,' + PURPLE + ',#7a44e0);color:#fff;font-size:12px}' +
      '.pj-row.locked .pj-dot{background:#1e2634;color:#5c6478}' +
      '.pj-nm{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:left}' +
      '.pj-tag{font-size:10px;font-weight:700;padding:3px 8px;border-radius:999px;background:#2a1147;color:#c9a6ff;white-space:nowrap}.pj-tag.soon{background:#171d28;color:#5c6478}' +
      '.pj-hidden{display:none!important}';
    document.head.appendChild(s);
  }

  function open() {
    injectStyles();
    var _L = document.querySelector('.pj-launcher'); if (_L) _L.style.display = 'none';
    var phone = document.createElement('div'); phone.className = 'pj-phone';
    phone.innerHTML =
      '<div class="pj-notch"></div><div class="pj-screen">' +
        '<div class="pj-head"><span class="pj-title">PÄTRICK<b> JUMP</b></span>' +
          '<div class="pj-hud"><span class="pj-pts">0</span><span class="pj-lives"></span><span class="pj-x" title="Schließen">&times;</span></div></div>' +
        '<canvas class="pj-canvas"></canvas>' +
        '<div class="pj-ctrls"><button class="pj-btn pj-left">&#8592;</button><button class="pj-btn shoot pj-shoot">🔨</button><button class="pj-btn pj-right">&#8594;</button></div>' +
        '<div class="pj-overlay pj-start"><div class="pj-oscroll">' +
          '<div class="pj-logo">Schwarze Akte</div><div class="pj-tagline">True Crime &middot; Twitch</div>' +
          '<h1 class="pj-h2">Pätrick<b> Jump</b></h1>' +
          '<p class="pj-p">Klettere Akte für Akte nach oben und sammle Patricks beste <b>Twitch-Clips</b>. Weiche den <b>Chat-Trollen</b> aus – oder verpass ihnen mit dem <b>Timeout-Hammer</b> einen Ban. Schnapp dir <b>Raid</b>, <b>Hype-Train</b> &amp; <b>Follow-Boost</b>.<br><br>&#8592; &#8594; bewegen &middot; Leertaste / 🔨 bannen</p>' +
          '<div class="pj-skinlbl">Wähle deinen Skin</div>' +
          '<div class="pj-skins"></div>' +
          '<button class="pj-play pj-startbtn">&#9654; Akte öffnen</button>' +
        '</div></div>' +
        '<div class="pj-overlay pj-over pj-hidden"><div class="pj-oscroll">' +
          '<div class="pj-logo">Akte geschlossen</div>' +
          '<div class="pj-score-big">0</div><div class="pj-hi">Rekord: 0</div>' +
          '<div class="pj-save"><input class="pj-name" type="text" maxlength="14" placeholder="Dein Name fürs Ranking"><button class="pj-savebtn">Eintragen</button></div>' +
          '<div class="pj-sec">🏆 Bestenliste</div><div class="pj-lb"></div>' +
          '<div class="pj-sec">Gesammelte Clips – antippen zum Ansehen</div><div class="pj-collection"></div>' +
          '<button class="pj-play pj-restart">&#8635; Nochmal</button>' +
        '</div></div>' +
      '</div>';
    document.body.appendChild(phone);

    var canvas = phone.querySelector('.pj-canvas'), ctx = canvas.getContext('2d');
    var startOv = phone.querySelector('.pj-start'), overOv = phone.querySelector('.pj-over');
    var hi = 0; try { hi = parseInt(localStorage.getItem('pj_hi') || '0', 10) || 0; } catch (e) {}
    var skin = 'patrick'; try { skin = localStorage.getItem('pj_skin') || 'patrick'; } catch (e) {}

    G = { phone: phone, canvas: canvas, ctx: ctx, raf: 0, running: false, last: 0, W: 0, H: 0, dpr: 1,
          hero: null, plats: [], tokens: [], enemies: [], powers: [], shots: [], parts: [], bg: [],
          topY: 0, climb: 0, bonus: 0, lives: 3, keyL: false, keyR: false, dragX: null,
          boost: null, springJumps: 0, squash: 0, invuln: 0, shootCd: 0, hi: hi, skin: skin,
          collected: {}, toast: null, celebrated: false, saved: false, t: 0,
          ptsEl: phone.querySelector('.pj-pts'), livesEl: phone.querySelector('.pj-lives') };

    // Skin-Auswahl mit Live-Vorschau
    var skinBox = startOv.querySelector('.pj-skins');
    SKINS.forEach(function (sk) {
      var b = document.createElement('div'); b.className = 'pj-skin' + (sk.id === G.skin ? ' active' : ''); b.dataset.skin = sk.id;
      b.innerHTML = '<canvas width="44" height="44"></canvas><span>' + sk.name + '</span>';
      skinBox.appendChild(b);
      var pc = b.querySelector('canvas'), pctx = pc.getContext('2d');
      pctx.save(); pctx.translate(22, 24); drawSkin(pctx, sk.id, 15, 1, 0, 0); pctx.restore();
      b.addEventListener('click', function () {
        G.skin = sk.id; try { localStorage.setItem('pj_skin', sk.id); } catch (e) {}
        skinBox.querySelectorAll('.pj-skin').forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active');
      });
    });

    function fit() {
      var r = canvas.getBoundingClientRect(); G.dpr = Math.max(1, window.devicePixelRatio || 1);
      G.W = r.width; G.H = r.height; canvas.width = Math.round(r.width * G.dpr); canvas.height = Math.round(r.height * G.dpr);
      ctx.setTransform(G.dpr, 0, 0, G.dpr, 0, 0);
    }
    setTimeout(fit, 30); G.onResize = fit; window.addEventListener('resize', fit);

    G.onKeyDown = function (e) { if (!G || !G.running) return;
      if (e.key === 'ArrowLeft') { G.keyL = true; e.preventDefault(); }
      else if (e.key === 'ArrowRight') { G.keyR = true; e.preventDefault(); }
      else if (e.key === ' ' || e.key === 'ArrowUp') { shoot(); e.preventDefault(); } };
    G.onKeyUp = function (e) { if (!G) return; if (e.key === 'ArrowLeft') G.keyL = false; if (e.key === 'ArrowRight') G.keyR = false; };
    window.addEventListener('keydown', G.onKeyDown); window.addEventListener('keyup', G.onKeyUp);

    function hold(el, set) { var on = function (ev) { ev.preventDefault(); set(true); }, off = function () { set(false); };
      el.addEventListener('pointerdown', on); el.addEventListener('pointerup', off); el.addEventListener('pointerleave', off); el.addEventListener('pointercancel', off); }
    hold(phone.querySelector('.pj-left'), function (v) { G.keyL = v; });
    hold(phone.querySelector('.pj-right'), function (v) { G.keyR = v; });
    phone.querySelector('.pj-shoot').addEventListener('pointerdown', function (e) { e.preventDefault(); shoot(); });

    function localX(cx) { var r = canvas.getBoundingClientRect(); return cx - r.left; }
    canvas.addEventListener('pointerdown', function (e) { G.dragX = localX(e.clientX); });
    canvas.addEventListener('pointermove', function (e) { if (G.dragX !== null) G.dragX = localX(e.clientX); });
    window.addEventListener('pointerup', function () { if (G) G.dragX = null; });

    phone.querySelector('.pj-x').addEventListener('click', close);
    startOv.querySelector('.pj-startbtn').addEventListener('click', function () { startOv.classList.add('pj-hidden'); reset(); run(); });
    overOv.querySelector('.pj-restart').addEventListener('click', function () { overOv.classList.add('pj-hidden'); reset(); run(); });

    var nameInput = overOv.querySelector('.pj-name'), saveBtn = overOv.querySelector('.pj-savebtn');
    saveBtn.addEventListener('click', function () {
      if (G.saved) return; var nm = (nameInput.value || '').trim().slice(0, 14) || 'Anonym';
      try { localStorage.setItem('pj_lastname', nm); } catch (e) {}
      var lb = loadLB(); var entry = { name: nm, score: score(), ts: Date.now() };
      lb.push(entry); lb.sort(function (a, b) { return b.score - a.score; }); saveLB(lb);
      G.saved = true; saveBtn.disabled = true; nameInput.disabled = true; renderLB(entry.ts);
    });

    function renderLB(myTs) {
      var box = overOv.querySelector('.pj-lb'); var lb = loadLB(); box.innerHTML = '';
      if (!lb.length) { box.innerHTML = '<div class="pj-lbrow"><span class="pj-lbn" style="color:#8a93a6">Noch keine Einträge – sei die/der Erste!</span></div>'; return; }
      lb.slice(0, 8).forEach(function (e2, i) {
        var g = i < 3 ? ' g' + (i + 1) : '', me = (myTs && e2.ts === myTs) ? ' me' : '';
        var row = document.createElement('div'); row.className = 'pj-lbrow' + g + me;
        row.innerHTML = '<span class="pj-rank">' + (i + 1) + '</span><span class="pj-lbn">' + esc(e2.name) + '</span><span class="pj-lbs">' + e2.score + '</span>';
        box.appendChild(row);
      });
    }

    function score() { return Math.floor(G.climb / 10) + G.bonus; }
    function collectedCount() { var n = 0; for (var k in G.collected) if (G.collected[k]) n++; return n; }
    function hud() {
      G.ptsEl.textContent = score();
      var h = ''; for (var i = 0; i < 3; i++) h += '<span class="pj-life' + (i < G.lives ? '' : ' off') + '"></span>';
      G.livesEl.innerHTML = h;
    }
    function toast(txt) { G.toast = { txt: txt, t: 1.6 }; }

    function burst(x, y, color, n) { for (var i = 0; i < n; i++) { var a = Math.random() * 6.283, sp = 40 + Math.random() * 160;
      G.parts.push({ x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 40, life: .5 + Math.random() * .4, max: .9, col: color, r: 2 + Math.random() * 3 }); } }

    function shoot() {
      if (!G.running || G.shootCd > 0) return; G.shootCd = 0.26;
      G.shots.push({ x: G.hero.x, y: G.hero.y - G.hero.r, vy: -780 });
      burst(G.hero.x, G.hero.y - G.hero.r, PURPLE, 3);
    }

    function generateUp() {
      G.topY = G.plats.reduce(function (m, p) { return Math.min(m, p.y); }, G.H);
      var diff = Math.min(1, G.climb / 9000);
      while (G.topY > -14) {
        var gap = 62 + Math.random() * (48 + diff * 20), ny = G.topY - gap, nx = 8 + Math.random() * (G.W - 66);
        var moving = Math.random() < (0.18 + diff * 0.22);
        var p = { x: nx, y: ny, w: 54, h: 13, vx: moving ? (Math.random() < .5 ? -1 : 1) * (34 + Math.random() * 40 + diff * 30) : 0, tramp: false, ta: 0 };
        G.plats.push(p); G.topY = ny;
        var roll = Math.random();
        if (roll < 0.012) { spawnPower(nx + 27, ny - 30, 'rocket'); }
        else if (roll < 0.05) { spawnPower(nx + 27, ny - 30, 'jetpack'); }
        else if (roll < 0.10) { spawnPower(nx + 27, ny - 28, 'spring'); }
        else if (roll < 0.18) { p.tramp = true; }
        else if (roll < 0.44) { var it = CLIPS[Math.floor(Math.random() * CLIPS.length)]; G.tokens.push({ x: nx + 27, y: ny - 30, r: 15, item: it, ph: Math.random() * 6 }); }

        var isRocketActive = G.boost && G.boost.type === 'rocket';
        if (!isRocketActive && Math.random() < (0.09 + diff * 0.15) && ny < G.H - 160) {
          G.enemies.push({ x: 24 + Math.random() * (G.W - 48), y: ny - 40, r: 17, vx: (Math.random() < .5 ? -1 : 1) * (18 + Math.random() * 26), ph: Math.random() * 6 });
        }
      }
    }
    function spawnPower(x, y, type) { G.powers.push({ x: x, y: y, type: type, r: type === 'rocket' ? 15 : 13, ph: Math.random() * 6 }); }

    function reset() {
      fit(); G.plats = []; G.tokens = []; G.enemies = []; G.powers = []; G.shots = []; G.parts = [];
      G.climb = 0; G.bonus = 0; G.lives = 3; G.boost = null; G.springJumps = 0; G.squash = 0;
      G.invuln = 0; G.shootCd = 0; G.collected = {}; G.toast = null; G.celebrated = false; G.saved = false; G.t = 0;
      // Start wie bei Doodle Jump: Held ruht direkt auf der garantierten Start-Plattform
      // (mittig, unbeweglich, kein Tramp) und springt von dort deterministisch hoch.
      var startPlat = { x: G.W / 2 - 34, y: G.H - 56, w: 68, h: 13, vx: 0, tramp: false, ta: 0 };
      G.plats.push(startPlat);
      G.hero = { x: G.W / 2, y: startPlat.y - 16 - 2, r: 16, vy: 0, dir: 1 };
      G.topY = G.H - 56;
      G.bg = []; for (var i = 0; i < 8; i++) G.bg.push({ x: Math.random() * G.W, y: Math.random() * G.H, s: 16 + Math.random() * 26, v: 5 + Math.random() * 11, k: Math.floor(Math.random() * 4), a: .05 + Math.random() * .05, rot: (Math.random() - .5) * .5 });
      generateUp();
      var saveBtn2 = overOv.querySelector('.pj-savebtn'), ni = overOv.querySelector('.pj-name');
      saveBtn2.disabled = false; ni.disabled = false; try { ni.value = localStorage.getItem('pj_lastname') || ''; } catch (e) {}
      hud();
    }

    function run() { if (G.running) return; G.running = true; G.last = performance.now(); G.raf = requestAnimationFrame(loop); }
    function loop(t) { if (!G || !G.running) return; var dt = Math.min(0.033, (t - G.last) / 1000); G.last = t; G.t += dt; update(dt); draw(); G.raf = requestAnimationFrame(loop); }

    function scrollWorld(delta) {
      var i;
      for (i = 0; i < G.plats.length; i++) G.plats[i].y += delta;
      for (i = 0; i < G.tokens.length; i++) G.tokens[i].y += delta;
      for (i = 0; i < G.enemies.length; i++) G.enemies[i].y += delta;
      for (i = 0; i < G.powers.length; i++) G.powers[i].y += delta;
      for (i = 0; i < G.shots.length; i++) G.shots[i].y += delta;
      for (i = 0; i < G.parts.length; i++) G.parts[i].y += delta;
      G.climb += delta;
    }

    function update(dt) {
      var h = G.hero, i;
      if (G.shootCd > 0) G.shootCd -= dt;
      if (G.invuln > 0) G.invuln -= dt;

      for (i = 0; i < G.plats.length; i++) { var pp = G.plats[i]; if (pp.vx) { pp.x += pp.vx * dt; if (pp.x < 4) { pp.x = 4; pp.vx *= -1; } if (pp.x + pp.w > G.W - 4) { pp.x = G.W - 4 - pp.w; pp.vx *= -1; } } if (pp.ta > 0) pp.ta -= dt; }
      for (i = 0; i < G.enemies.length; i++) { var en = G.enemies[i]; en.x += en.vx * dt; if (en.x < en.r) { en.x = en.r; en.vx *= -1; } if (en.x > G.W - en.r) { en.x = G.W - en.r; en.vx *= -1; } }

      var mv = 0;
      if (G.dragX !== null) { var d = G.dragX - h.x; h.x += d * Math.min(1, dt * 16); if (Math.abs(d) > 1) h.dir = d > 0 ? 1 : -1; }
      else { mv = (G.keyR ? 1 : 0) - (G.keyL ? 1 : 0); h.x += mv * HSPEED * dt; if (mv) h.dir = mv; }
      if (h.x < -h.r) h.x = G.W + h.r; if (h.x > G.W + h.r) h.x = -h.r;

      if (G.boost) {
        h.vy = G.boost.vy; G.boost.t -= dt;
        if (Math.random() < 0.9) G.parts.push({ x: h.x + (Math.random() - .5) * 10, y: h.y + h.r, vx: (Math.random() - .5) * 60, vy: 120 + Math.random() * 120, life: .4, max: .4, col: Math.random() < .5 ? AMBER : CRIMSON, r: 2 + Math.random() * 3 });
        if (G.boost.t <= 0) G.boost = null;
      } else { h.vy += GR * dt; }
      h.y += h.vy * dt;

      if (!G.boost && h.vy > 0) {
        for (i = 0; i < G.plats.length; i++) {
          var p = G.plats[i], foot = h.y + h.r;
          if (foot >= p.y && foot <= p.y + p.h + 16 && h.x >= p.x - h.r && h.x <= p.x + p.w + h.r) {
            if (p.tramp) { h.vy = TRAMP; p.ta = 0.3; toast('Hype-Trampolin!'); burst(h.x, p.y, AMBER, 8); }
            else if (G.springJumps > 0) { h.vy = SPRING; G.springJumps--; }
            else { h.vy = JUMP; }
            h.y = p.y - h.r; G.squash = 1; break;
          }
        }
      }

      var TH = G.H * 0.42;
      if (h.y < TH) { var delta = TH - h.y; h.y = TH; scrollWorld(delta); }

      for (i = G.powers.length - 1; i >= 0; i--) { var pw = G.powers[i], px = pw.x - h.x, py = pw.y - h.y;
        if (px * px + py * py <= (pw.r + h.r) * (pw.r + h.r)) {
          if (pw.type === 'rocket') { G.boost = { vy: -1500, t: 2.6, type: 'rocket' }; G.enemies = []; G.bonus += 30; toast('RAID – du gehst viral!'); }
          else if (pw.type === 'jetpack') { G.boost = { vy: -820, t: 1.3 }; G.bonus += 20; toast('Hype-Train – volle Reichweite!'); }
          else { G.springJumps = 5; G.bonus += 15; toast('Follow-Boost aktiv!'); }
          burst(pw.x, pw.y, AMBER, 12); G.powers.splice(i, 1);
        } }

      for (i = G.tokens.length - 1; i >= 0; i--) { var tk = G.tokens[i], tx = tk.x - h.x, ty = tk.y - h.y;
        if (tx * tx + ty * ty <= (tk.r + h.r) * (tk.r + h.r)) {
          if (!G.collected[tk.item.id]) { G.collected[tk.item.id] = true; G.bonus += 50; toast('Clip: ' + tk.item.name);
            if (collectedCount() === CLIPS.length && !G.celebrated) { G.celebrated = true; toast('Alle Clips gesammelt! 🎉'); try { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'c' })); } catch (e) {} } }
          else G.bonus += 5;
          burst(tk.x, tk.y, PURPLE, 9); G.tokens.splice(i, 1); hud();
        } }

      for (i = G.shots.length - 1; i >= 0; i--) { var sh = G.shots[i]; sh.y += sh.vy * dt; var hit = false;
        for (var j = G.enemies.length - 1; j >= 0; j--) { var e3 = G.enemies[j], ex = e3.x - sh.x, ey = e3.y - sh.y;
          if (ex * ex + ey * ey <= (e3.r + 5) * (e3.r + 5)) { burst(e3.x, e3.y, PURPLE, 14); G.enemies.splice(j, 1); G.bonus += 100; toast('Gebannt! 🔨'); hit = true; break; } }
        if (hit || sh.y < -20) G.shots.splice(i, 1); }

      for (i = G.enemies.length - 1; i >= 0; i--) { var em = G.enemies[i], dx2 = em.x - h.x, dy2 = em.y - h.y, dist2 = dx2 * dx2 + dy2 * dy2, rr2 = (em.r + h.r * 0.8);
        if (dist2 <= rr2 * rr2) {
          if (G.boost) { burst(em.x, em.y, PURPLE, 14); G.enemies.splice(i, 1); G.bonus += 60; }
          else if (h.vy > 0 && h.y < em.y - 2) { burst(em.x, em.y, PURPLE, 14); G.enemies.splice(i, 1); h.vy = JUMP * 0.95; G.squash = 1; G.bonus += 100; toast('Troll geplättet!'); }
          else if (G.invuln <= 0) { G.lives--; G.invuln = 1.3; h.vy = JUMP * 0.7; G.squash = 1; hud(); burst(h.x, h.y, CRIMSON, 10); if (G.lives <= 0) { gameOver(); return; } toast('Aua – ein Hater!'); }
        } }

      G.plats = G.plats.filter(function (p2) { return p2.y < G.H + 26; });
      G.tokens = G.tokens.filter(function (p2) { return p2.y < G.H + 34; });
      G.enemies = G.enemies.filter(function (p2) { return p2.y < G.H + 40; });
      G.powers = G.powers.filter(function (p2) { return p2.y < G.H + 40; });
      generateUp();

      for (i = G.parts.length - 1; i >= 0; i--) { var pa = G.parts[i]; pa.life -= dt; pa.vy += 300 * dt; pa.x += pa.vx * dt; pa.y += pa.vy * dt; if (pa.life <= 0) G.parts.splice(i, 1); }
      for (i = 0; i < G.bg.length; i++) { var b2 = G.bg[i]; b2.y += b2.v * dt; if (b2.y - b2.s > G.H) { b2.y = -b2.s; b2.x = Math.random() * G.W; } }

      if (G.squash > 0) G.squash = Math.max(0, G.squash - dt * 5);
      if (h.y - h.r > G.H) { gameOver(); return; }
      if (G.toast) { G.toast.t -= dt; if (G.toast.t <= 0) G.toast = null; }
      hud();
    }

    function gameOver() {
      G.running = false; cancelAnimationFrame(G.raf);
      var sc = score(); if (sc > G.hi) { G.hi = sc; try { localStorage.setItem('pj_hi', String(G.hi)); } catch (e) {} }
      overOv.querySelector('.pj-score-big').textContent = sc;
      overOv.querySelector('.pj-hi').textContent = 'Rekord: ' + G.hi + '  ·  ' + collectedCount() + '/' + CLIPS.length + ' Clips';
      renderLB(null);
      var box = overOv.querySelector('.pj-collection'); box.innerHTML = '';
      CLIPS.forEach(function (it) {
        var got = !!G.collected[it.id];
        var row = document.createElement(got ? 'a' : 'div');
        row.className = 'pj-row' + (got ? ' link' : ' locked');
        if (got) { row.href = it.url; row.target = '_blank'; row.rel = 'noopener'; }
        var tag = got ? '<span class="pj-tag">▶ Clip ansehen</span>' : '<span class="pj-tag soon">???</span>';
        row.innerHTML = '<span class="pj-dot">' + (got ? '▶' : '🔒') + '</span><span class="pj-nm">' + (got ? esc(it.name) : 'Noch nicht gesammelt') + '</span>' + tag;
        box.appendChild(row);
      });
      overOv.classList.remove('pj-hidden');
      var ni2 = overOv.querySelector('.pj-name'); if (!G.saved) setTimeout(function () { try { ni2.focus(); } catch (e) {} }, 60);
    }

    /* ------------------------ Zeichnen ------------------------ */
    function rr(c, x, y, w, hh, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + hh, r); c.arcTo(x + w, y + hh, x, y + hh, r); c.arcTo(x, y + hh, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }

    // Universeller Skin-Zeichner (auch für Vorschau). Zentriert bei 0,0.
    function drawSkin(c, id, r, dir, t, springs) {
      var ex = dir * 3;
      // Federn unter den Füßen
      if (springs > 0) { c.strokeStyle = AMBER; c.lineWidth = 2.5; for (var k = -1; k <= 1; k += 2) { c.beginPath(); c.moveTo(k * 7, r - 2); c.lineTo(k * 7, r + 6); c.stroke(); } }

      if (id === 'patrick') {
        // Körper (Amber-Verlauf)
        var gp = c.createRadialGradient(-r * .3, -r * .3, r * .2, 0, 0, r);
        gp.addColorStop(0, AMBER2); gp.addColorStop(1, '#d9822b');
        c.beginPath(); c.arc(0, 0, r, 0, 6.283); c.fillStyle = gp; c.fill();
        // Füße
        c.fillStyle = '#2a2016'; c.fillRect(-9, r - 4, 6, 7); c.fillRect(3, r - 4, 6, 7);
        // runde Brille
        c.strokeStyle = '#1c1c1c'; c.lineWidth = 2;
        c.beginPath(); c.arc(-5 + ex * .4, -3, 5.4, 0, 6.283); c.arc(5 + ex * .4, -3, 5.4, 0, 6.283); c.stroke();
        c.beginPath(); c.moveTo(-0.2 + ex * .4, -3); c.lineTo(0.2 + ex * .4, -3); c.stroke();
        // Augen
        c.fillStyle = '#fff'; c.beginPath(); c.arc(-5 + ex * .4, -3, 3.4, 0, 6.283); c.arc(5 + ex * .4, -3, 3.4, 0, 6.283); c.fill();
        c.fillStyle = '#111'; c.beginPath(); c.arc(-5 + ex, -3, 1.7, 0, 6.283); c.arc(5 + ex, -3, 1.7, 0, 6.283); c.fill();
        // schwarze Cap + Schirm
        c.fillStyle = '#141414'; c.beginPath(); c.arc(0, -r * .35, r * .96, Math.PI, 0); c.closePath(); c.fill();
        c.beginPath(); c.ellipse(dir * r * .55, -r * .42, r * .62, r * .2, 0, Math.PI, 0); c.fill();
        c.fillStyle = AMBER; c.beginPath(); c.arc(0, -r * .78, 1.8, 0, 6.283); c.fill(); // Knopf
        // Bart-Andeutung + Lächeln
        c.strokeStyle = '#3a2a1c'; c.lineWidth = 1.8; c.beginPath(); c.arc(0, r * .18, 4.5, .2, Math.PI - .2); c.stroke();
      } else if (id === 'anne') {
        // Haare hinten
        c.fillStyle = '#5b3a22'; c.beginPath(); c.arc(0, 0, r * 1.06, 0, 6.283); c.fill();
        // Gesicht
        var ga = c.createRadialGradient(-r * .3, -r * .3, r * .2, 0, 0, r);
        ga.addColorStop(0, '#ffe0c4'); ga.addColorStop(1, '#eaba90');
        c.beginPath(); c.arc(0, r * .05, r * .82, 0, 6.283); c.fillStyle = ga; c.fill();
        // Haarsträhnen seitlich
        c.fillStyle = '#5b3a22';
        c.beginPath(); c.moveTo(-r * .8, -r * .2); c.quadraticCurveTo(-r * 1.1, r * .5, -r * .55, r * .9); c.quadraticCurveTo(-r * .7, r * .2, -r * .55, -r * .2); c.fill();
        c.beginPath(); c.moveTo(r * .8, -r * .2); c.quadraticCurveTo(r * 1.1, r * .5, r * .55, r * .9); c.quadraticCurveTo(r * .7, r * .2, r * .55, -r * .2); c.fill();
        // Pony
        c.beginPath(); c.arc(0, -r * .15, r * .82, Math.PI + .3, -.3); c.fill();
        // Füße
        c.fillStyle = '#20242c'; c.fillRect(-8, r - 3, 6, 7); c.fillRect(2, r - 3, 6, 7);
        // Augen + Lächeln
        c.fillStyle = '#fff'; c.beginPath(); c.arc(-4.5 + ex * .4, -1, 3.2, 0, 6.283); c.arc(4.5 + ex * .4, -1, 3.2, 0, 6.283); c.fill();
        c.fillStyle = '#3a2417'; c.beginPath(); c.arc(-4.5 + ex, -1, 1.6, 0, 6.283); c.arc(4.5 + ex, -1, 1.6, 0, 6.283); c.fill();
        c.strokeStyle = '#b5606a'; c.lineWidth = 1.6; c.beginPath(); c.arc(0, r * .28, 3.8, .25, Math.PI - .25); c.stroke();
      } else if (id === 'akte') {
        // schwarze Akte-Mappe
        c.save();
        c.shadowColor = 'rgba(224,36,63,.4)'; c.shadowBlur = 8;
        rr(c, -r * .92, -r * .82, r * 1.84, r * 1.72, 5); c.fillStyle = '#141619'; c.fill();
        c.shadowBlur = 0;
        c.lineWidth = 1.6; c.strokeStyle = AMBER; c.stroke();
        // Reiter oben
        rr(c, -r * .5, -r, r * .8, r * .3, 3); c.fillStyle = CRIMSON; c.fill();
        // rotes Aktenband
        c.fillStyle = CRIMSON; c.fillRect(-r * .92, -r * .1, r * 1.84, r * .34);
        // Titel
        c.fillStyle = BONE; c.font = '900 ' + (r * .5) + 'px Anton, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('AKTE', 0, r * .07);
        // glühende Augen
        c.fillStyle = AMBER; c.shadowColor = AMBER; c.shadowBlur = 6;
        c.beginPath(); c.arc(-r * .38 + ex * .4, -r * .42, 2.1, 0, 6.283); c.arc(r * .38 + ex * .4, -r * .42, 2.1, 0, 6.283); c.fill();
        c.shadowBlur = 0; c.restore();
        // Füße
        c.fillStyle = '#0c0d0f'; c.fillRect(-8, r - 3, 6, 6); c.fillRect(2, r - 3, 6, 6);
      } else { // mystery
        var gm = c.createRadialGradient(-r * .3, -r * .3, r * .2, 0, 0, r);
        gm.addColorStop(0, '#2a323b'); gm.addColorStop(1, '#12161b');
        c.beginPath(); c.arc(0, 0, r, 0, 6.283); c.fillStyle = gm; c.fill();
        c.lineWidth = 1.6; c.strokeStyle = AMBER; c.globalAlpha = .8; c.stroke(); c.globalAlpha = 1;
        // Scan-Linie
        var sy = ((Math.sin(t * 2) + 1) / 2) * r * 1.6 - r * .8;
        c.save(); c.beginPath(); c.arc(0, 0, r, 0, 6.283); c.clip();
        var lg = c.createLinearGradient(0, sy - 4, 0, sy + 4); lg.addColorStop(0, 'rgba(240,163,64,0)'); lg.addColorStop(.5, 'rgba(255,191,107,.7)'); lg.addColorStop(1, 'rgba(240,163,64,0)');
        c.fillStyle = lg; c.fillRect(-r, sy - 4, r * 2, 8); c.restore();
        // Fragezeichen
        c.fillStyle = AMBER; c.font = '900 ' + (r * 1.15) + 'px Anton, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('?', 0, r * .08);
      }
    }

    function drawHero(c, h) {
      var stretch = Math.max(-0.22, Math.min(0.22, -h.vy / 2600));
      var sy = 1 + stretch - G.squash * 0.4, sx = 1 - stretch + G.squash * 0.38;
      c.save(); c.translate(h.x, h.y); c.scale(sx, sy);
      if (G.invuln > 0 && Math.floor(G.t * 12) % 2 === 0) c.globalAlpha = 0.45;
      drawSkin(c, G.skin, h.r, h.dir, G.t, G.springJumps);
      c.restore();
    }

    function drawEnemy(c, e2) {
      var bob = Math.sin(G.t * 4 + e2.ph) * 3;
      c.save(); c.translate(e2.x, e2.y + bob);
      // Hörner (Troll)
      c.strokeStyle = AMBER; c.lineWidth = 2; c.beginPath(); c.moveTo(-6, -e2.r); c.lineTo(-10, -e2.r - 8); c.moveTo(6, -e2.r); c.lineTo(10, -e2.r - 8); c.stroke();
      c.fillStyle = AMBER; c.beginPath(); c.arc(-10, -e2.r - 9, 2.3, 0, 6.283); c.arc(10, -e2.r - 9, 2.3, 0, 6.283); c.fill();
      // Körper (dunkler Chat-Troll)
      rr(c, -e2.r, -e2.r + 3, e2.r * 2, e2.r * 2 - 2, 8); c.fillStyle = '#242a33'; c.fill();
      c.lineWidth = 1.4; c.strokeStyle = '#3a4150'; c.stroke();
      // wütende Augen
      c.fillStyle = CRIMSON; c.shadowColor = 'rgba(224,36,63,.6)'; c.shadowBlur = 6;
      c.beginPath(); c.arc(-6, -1, 4, 0, 6.283); c.arc(6, -1, 4, 0, 6.283); c.fill(); c.shadowBlur = 0;
      c.fillStyle = '#fff'; c.beginPath(); c.arc(-6, -1, 1.6, 0, 6.283); c.arc(6, -1, 1.6, 0, 6.283); c.fill();
      // Zornfalten
      c.strokeStyle = CRIMSON; c.lineWidth = 1.6; c.beginPath(); c.moveTo(-9, -7); c.lineTo(-3, -4); c.moveTo(9, -7); c.lineTo(3, -4); c.stroke();
      // grummeliger Mund
      c.strokeStyle = '#0d0f12'; c.lineWidth = 2; c.beginPath(); c.moveTo(-6, 9); c.lineTo(0, 6.5); c.lineTo(6, 9); c.stroke();
      c.restore();
    }

    function drawPower(c, pw) {
      var pulse = 1 + Math.sin(G.t * 6 + pw.ph) * 0.08; c.save(); c.translate(pw.x, pw.y); c.scale(pulse, pulse);
      c.shadowColor = 'rgba(240,163,64,.6)'; c.shadowBlur = 12;
      if (pw.type === 'rocket') { // RAID
        c.fillStyle = '#fff'; c.beginPath(); c.moveTo(0, -pw.r); c.quadraticCurveTo(pw.r * 0.8, -pw.r * 0.2, pw.r * 0.55, pw.r * 0.6); c.lineTo(-pw.r * 0.55, pw.r * 0.6); c.quadraticCurveTo(-pw.r * 0.8, -pw.r * 0.2, 0, -pw.r); c.closePath(); c.fill();
        c.fillStyle = PURPLE; c.beginPath(); c.moveTo(-pw.r * 0.55, pw.r * 0.6); c.lineTo(-pw.r, pw.r); c.lineTo(-pw.r * 0.2, pw.r * 0.6); c.closePath(); c.fill();
        c.beginPath(); c.moveTo(pw.r * 0.55, pw.r * 0.6); c.lineTo(pw.r, pw.r); c.lineTo(pw.r * 0.2, pw.r * 0.6); c.closePath(); c.fill();
        c.fillStyle = AMBER; c.beginPath(); c.arc(0, -pw.r * 0.15, 3, 0, 6.283); c.fill();
      } else if (pw.type === 'jetpack') { // Hype-Train
        c.fillStyle = '#e8e8ee'; rr(c, -pw.r * 0.7, -pw.r, pw.r * 1.4, pw.r * 1.7, 4); c.fill();
        c.fillStyle = PURPLE; rr(c, -pw.r * 0.35, -pw.r * 0.7, pw.r * 0.7, pw.r * 1.1, 2); c.fill();
        c.fillStyle = AMBER; c.beginPath(); c.moveTo(-pw.r * 0.5, pw.r * 0.7); c.lineTo(0, pw.r * 1.3); c.lineTo(pw.r * 0.5, pw.r * 0.7); c.closePath(); c.fill();
      } else { // Follow-Boost (Feder)
        c.fillStyle = AMBER; rr(c, -pw.r, -pw.r * 0.2, pw.r * 2, pw.r * 0.9, 4); c.fill();
        c.strokeStyle = CRIMSON; c.lineWidth = 2.4; c.beginPath();
        for (var q = 0; q <= 8; q++) { var yy = pw.r * 0.7 + q * 2; c.lineTo((q % 2 ? pw.r * 0.6 : -pw.r * 0.6), yy); } c.stroke();
      }
      c.shadowBlur = 0; c.restore();
    }

    function drawBgItem(c, b) {
      c.save(); c.translate(b.x, b.y); c.rotate(b.rot); c.globalAlpha = b.a; var s = b.s;
      if (b.k === 0) { // Beweisfoto mit Pin
        c.fillStyle = '#e8e2d4'; c.fillRect(-s * .5, -s * .5, s, s * .9);
        c.fillStyle = '#2a2f36'; c.fillRect(-s * .4, -s * .4, s * .8, s * .55);
        c.globalAlpha = b.a * 2; c.fillStyle = CRIMSON; c.beginPath(); c.arc(0, -s * .5, s * .1, 0, 6.283); c.fill();
      } else if (b.k === 1) { // Fragezeichen
        c.fillStyle = AMBER; c.font = '900 ' + s + 'px Anton, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('?', 0, 0);
      } else if (b.k === 2) { // Lupe
        c.strokeStyle = BONE; c.lineWidth = s * .12; c.beginPath(); c.arc(-s * .12, -s * .12, s * .32, 0, 6.283); c.stroke();
        c.beginPath(); c.moveTo(s * .12, s * .12); c.lineTo(s * .45, s * .45); c.stroke();
      } else { // Fingerabdruck
        c.strokeStyle = AMBER; c.lineWidth = 1.2;
        for (var q = 1; q <= 3; q++) { c.beginPath(); c.arc(0, 0, s * .12 * q, .3, Math.PI - .3); c.stroke(); }
      }
      c.restore();
    }

    function draw() {
      var c = G.ctx, i;
      // Hintergrund: dunkles Ermittler-Zimmer
      var g = c.createLinearGradient(0, 0, 0, G.H); g.addColorStop(0, '#0a1013'); g.addColorStop(.5, '#0c0f13'); g.addColorStop(1, '#140d0d');
      c.fillStyle = g; c.fillRect(0, 0, G.W, G.H);
      // schwebende Akten-Deko
      for (i = 0; i < G.bg.length; i++) drawBgItem(c, G.bg[i]);
      c.globalAlpha = 1;
      // Wasserzeichen
      c.save(); c.globalAlpha = 0.045; c.fillStyle = BONE; c.font = '400 26px Anton, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.translate(G.W / 2, G.H / 2); c.rotate(-0.32); c.fillText('SCHWARZE AKTE', 0, 0); c.restore();

      // Plattformen
      for (i = 0; i < G.plats.length; i++) { var p = G.plats[i]; var comp = p.ta > 0 ? p.ta / 0.3 : 0;
        rr(c, p.x, p.y + comp * 4, p.w, p.h, 6); c.fillStyle = p.vx ? '#7a44e0' : '#232a33'; c.fill();
        c.fillStyle = AMBER; rr(c, p.x + 3, p.y + comp * 4, p.w - 6, 3.5, 2); c.fill();
        if (p.tramp) { c.strokeStyle = AMBER; c.lineWidth = 3; c.beginPath(); c.moveTo(p.x + 6, p.y - 2); c.quadraticCurveTo(p.x + p.w / 2, p.y - 12 + comp * 8, p.x + p.w - 6, p.y - 2); c.stroke(); } }

      for (i = 0; i < G.powers.length; i++) drawPower(c, G.powers[i]);

      // Clips (Sammel-Token) als Twitch-Clip-Karten
      for (i = 0; i < G.tokens.length; i++) { var tk = G.tokens[i], bob = Math.sin(G.t * 3 + tk.ph) * 2;
        c.save(); c.translate(tk.x, tk.y + bob);
        c.shadowColor = 'rgba(169,112,255,.6)'; c.shadowBlur = 10;
        var gg = c.createLinearGradient(0, -tk.r, 0, tk.r); gg.addColorStop(0, '#b98bff'); gg.addColorStop(1, '#7a44e0');
        c.beginPath(); c.arc(0, 0, tk.r, 0, 6.283); c.fillStyle = gg; c.fill(); c.shadowBlur = 0;
        c.lineWidth = 2; c.strokeStyle = '#d9c4ff'; c.stroke();
        // Play-Dreieck
        c.fillStyle = '#fff'; c.beginPath(); c.moveTo(-tk.r * .28, -tk.r * .42); c.lineTo(tk.r * .5, 0); c.lineTo(-tk.r * .28, tk.r * .42); c.closePath(); c.fill();
        // REC-Punkt
        c.fillStyle = CRIMSON; c.beginPath(); c.arc(tk.r * .55, -tk.r * .55, 2.4, 0, 6.283); c.fill();
        c.restore(); }

      for (i = 0; i < G.enemies.length; i++) drawEnemy(c, G.enemies[i]);

      // Schüsse (Timeout-Hammer / Ban-Bolt)
      for (i = 0; i < G.shots.length; i++) { var sh = G.shots[i]; var lg = c.createLinearGradient(sh.x, sh.y, sh.x, sh.y + 16);
        lg.addColorStop(0, PURPLE); lg.addColorStop(1, 'rgba(169,112,255,0)'); c.fillStyle = lg; c.fillRect(sh.x - 2, sh.y, 4, 16);
        c.fillStyle = '#fff'; c.beginPath(); c.arc(sh.x, sh.y, 3.4, 0, 6.283); c.fill(); }

      for (i = 0; i < G.parts.length; i++) { var pa = G.parts[i]; c.globalAlpha = Math.max(0, pa.life / pa.max); c.fillStyle = pa.col; c.beginPath(); c.arc(pa.x, pa.y, pa.r, 0, 6.283); c.fill(); }
      c.globalAlpha = 1;

      drawHero(c, G.hero);

      // Boost-Label
      if (G.boost) { c.fillStyle = '#fff'; c.font = '700 13px Oswald, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'top';
        c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 5; c.fillText(G.boost.type === 'rocket' ? '🚀 RAID' : 'HYPE-TRAIN', G.W / 2, 8); c.shadowBlur = 0; }
      // Toast
      if (G.toast) { c.globalAlpha = Math.min(1, G.toast.t * 1.4); c.fillStyle = BONE; c.font = '700 13px Oswald, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'top';
        c.shadowColor = 'rgba(0,0,0,.7)'; c.shadowBlur = 6; c.fillText(G.toast.txt, G.W / 2, 26); c.shadowBlur = 0; c.globalAlpha = 1; }

      // Vignette
      var vg = c.createRadialGradient(G.W / 2, G.H / 2, G.H * .35, G.W / 2, G.H / 2, G.H * .72);
      vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.45)'); c.fillStyle = vg; c.fillRect(0, 0, G.W, G.H);
    }

    // drawSkin für Vorschau-Canvas verfügbar machen
    open._drawSkin = drawSkin;
  }

  function close() {
    if (!G) return; G.running = false; cancelAnimationFrame(G.raf);
    window.removeEventListener('resize', G.onResize);
    window.removeEventListener('keydown', G.onKeyDown); window.removeEventListener('keyup', G.onKeyUp);
    if (G.phone && G.phone.parentNode) G.phone.parentNode.removeChild(G.phone);
    G = null;
    var _L = document.querySelector('.pj-launcher'); if (_L) _L.style.display = '';
  }

  /* ---- Schwebender Start-Button (Seitenleiste, scrollt mit) ---- */
  function launcherStyles() {
    if (document.getElementById('pj-launcher-styles')) return;
    var s = document.createElement('style'); s.id = 'pj-launcher-styles';
    s.textContent =
      '.pj-launcher{position:fixed;right:20px;bottom:20px;z-index:99980;width:62px;height:62px;border-radius:16px;cursor:pointer;' +
      'background:linear-gradient(135deg,#1a1206,#0c0a08);border:1px solid rgba(240,163,64,.4);' +
      'box-shadow:0 14px 30px -8px rgba(0,0,0,.6),0 0 22px rgba(240,163,64,.18);display:flex;align-items:center;justify-content:center;' +
      'transition:transform .25s cubic-bezier(.2,.8,.2,1),box-shadow .25s;animation:pjLpulse 3s ease-in-out infinite}' +
      '.pj-launcher:hover{transform:translateY(-4px) scale(1.06)}' +
      '.pj-launcher .pjl-ic{font-size:30px;filter:drop-shadow(0 2px 4px rgba(0,0,0,.5))}' +
      '.pj-launcher .pjl-badge{position:absolute;top:-8px;left:-8px;font-family:"Space Mono",monospace;font-size:8px;letter-spacing:.5px;text-transform:uppercase;background:#e0243f;color:#fff;padding:2px 6px;border-radius:20px;box-shadow:0 2px 6px rgba(0,0,0,.4)}' +
      '.pj-launcher .pjl-tip{position:absolute;right:74px;white-space:nowrap;font-family:"Space Mono",monospace;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#efe6d6;background:rgba(8,9,11,.9);border:1px solid rgba(240,163,64,.3);padding:7px 11px;border-radius:20px;opacity:0;transform:translateX(6px);transition:.25s;pointer-events:none}' +
      '.pj-launcher:hover .pjl-tip{opacity:1;transform:none}' +
      '@keyframes pjLpulse{0%,100%{box-shadow:0 14px 30px -8px rgba(0,0,0,.6),0 0 18px rgba(240,163,64,.16)}50%{box-shadow:0 14px 30px -8px rgba(0,0,0,.6),0 0 28px rgba(240,163,64,.34)}}' +
      '@media(max-width:600px){.pj-launcher{width:54px;height:54px;right:14px;bottom:14px}.pj-launcher .pjl-ic{font-size:26px}.pj-launcher .pjl-tip{display:none}}';
    document.head.appendChild(s);
  }
  function makeLauncher() {
    if (document.querySelector('.pj-launcher')) return;
    launcherStyles();
    var b = document.createElement('div'); b.className = 'pj-launcher'; b.setAttribute('aria-label', 'Pätrick Jump spielen');
    b.innerHTML = '<span class="pjl-badge">Spiel</span><span class="pjl-ic">🕹️</span><span class="pjl-tip">Pätrick Jump</span>';
    b.addEventListener('click', function () { if (!G) open(); });
    document.body.appendChild(b);
    if (G) b.style.display = 'none';
  }

  // Global verfügbar machen, damit ein sichtbarer Button das Spiel öffnen kann
  window.PaetrickJump = {
    open: function () { if (!G) open(); },
    close: close,
    toggle: function () { G ? close() : open(); }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', makeLauncher);
  else makeLauncher();
})();
