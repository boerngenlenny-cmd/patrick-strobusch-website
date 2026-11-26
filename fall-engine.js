/* =====================================================================
   SCHWARZE AKTE — Fall „Letzte Folge" — Engine (Krimi.Games-Prinzip)
   Datengetrieben (window.FALL), serverlos, localStorage. Läuft nur mit Daten.
   ===================================================================== */
(function () {
  var D = window.FALL;
  if (!D) return;

  function norm(s){ s=(s||'').toString().toUpperCase().replace(/Ä/g,'A').replace(/Ö/g,'O').replace(/Ü/g,'U').replace(/ß/g,'SS'); return s.replace(/[^A-Z0-9]/g,''); }
  function H(s){ s=norm(s); var h=5381; for(var i=0;i<s.length;i++) h=((h<<5)+h+s.charCodeAt(i))>>>0; return h>>>0; }

  var KEY='fall_letztefolge_v1';
  var S=load();
  function fresh(){ return { v:2, entered:false, opened:false, found:{}, cleared:{}, notes:'', sites:{}, flags:{}, solved:false }; }
  function load(){ try{ var o=JSON.parse(localStorage.getItem(KEY)); return (o&&o.v)?o:fresh(); }catch(e){ return fresh(); } }
  function save(){ try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){} }

  function el(t,c,h){ var e=document.createElement(t); if(c)e.className=c; if(h!=null)e.innerHTML=h; return e; }
  function toast(m){ var t=el('div','f-toast',m); document.body.appendChild(t); setTimeout(function(){ if(t.parentNode)t.remove(); },3600); }
  function ev(id){ for(var i=0;i<D.evidence.length;i++) if(D.evidence[i].id===id) return D.evidence[i]; return null; }
  function suspect(id){ for(var i=0;i<D.suspects.length;i++) if(D.suspects[i].id===id) return D.suspects[i]; return null; }
  function site(id){ for(var i=0;i<D.sites.length;i++) if(D.sites[i].id===id) return D.sites[i]; return null; }

  /* ---------- Audio ---------- */
  var AC=null,_bufs={};
  function actx(){ if(!AC){ try{ AC=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} } return AC; }
  function b64buf(b64){ var bin=atob(b64),n=bin.length,u=new Uint8Array(n); for(var i=0;i<n;i++)u[i]=bin.charCodeAt(i); return u.buffer; }
  function getBuf(name, cb){ if(_bufs[name]){ cb(_bufs[name]); return; } var c=actx(); if(!c||!window.FALL_AUDIO||!FALL_AUDIO[name]){ cb(null); return; } try{ c.decodeAudioData(b64buf(FALL_AUDIO[name]), function(b){ _bufs[name]=b; cb(b); }, function(){ cb(null); }); }catch(e){ cb(null); } }
  var _amb=null;
  function playAmb(name){ stopAmb(); getBuf(name,function(b){ if(!b)return; var c=actx(); var s=c.createBufferSource(); s.buffer=b; s.loop=true; var g=c.createGain(); g.gain.value=0.5; s.connect(g); g.connect(c.destination); s.start(); _amb=s; }); }
  function stopAmb(){ try{ if(_amb){ _amb.stop(); _amb=null; } }catch(e){} }
  function blip(f){ var c=actx(); if(!c)return; var o=c.createOscillator(),g=c.createGain(); o.frequency.value=f||440; o.type='square'; g.gain.value=0.03; o.connect(g); g.connect(c.destination); o.start(); g.gain.exponentialRampToValueAtTime(0.0001,c.currentTime+0.08); o.stop(c.currentTime+0.09); }

  /* ---------- Fortschritt ---------- */
  function fourCleared(){ return ['sven','kevin','tobias','jana'].every(function(id){ return S.cleared[id]; }); }
  function phaseNow(){ if(S.solved) return 5; if(fourCleared() && S.flags.decisive) return 4; if(Object.keys(S.cleared).length>=1) return 3; if(S.opened) return 2; return 1; }
  function canSolve(){ return fourCleared() && S.flags.decisive && S.found.ev_tracking; }

  function checkEliminations(){
    var newly=[];
    D.suspects.forEach(function(s){ if(s.clearEv && S.found[s.clearEv] && !S.cleared[s.id]){ S.cleared[s.id]=true; newly.push(s); } });
    if(newly.length){ save(); DK._just={}; newly.forEach(function(s){ DK._just[s.id]=true; toast('🚫 '+s.name+' ist entlastet.'); });
      if(DK.stage && DK.stage.querySelector('.f-cork')) renderCork();
      if(fourCleared()) setTimeout(function(){ toast('Nur noch zwei Verdächtige: Dr. Voss & Mara Sun. Finde den entscheidenden Beweis (Spektrum).'); }, 900);
      updateTop();
    }
  }

  function addEvidence(id, silent){ if(!S.found[id]){ S.found[id]=true; save(); if(!silent){ var e=ev(id); toast('📌 Beweis gesichert: '+(e?e.title:id)); } if(DK.grid) renderEvidence(); checkEliminations(); if(DK.top) updateTop(); } }

  /* =================================================================
     EINSTIEG (versteckt): redigierte Fußzeile + Archiv-Suche
     ================================================================= */
  function installEntry(){
    var cr=document.querySelector('.foot-cr');
    if(cr && !cr.querySelector('.f-redact')){ var sp=el('span','f-redact',D.entry.redactFooter); sp.title='…'; cr.appendChild(document.createTextNode(' ')); cr.appendChild(sp); }
    var akte=document.querySelector('#akte .wrap');
    if(akte && !akte.querySelector('.f-searchbtn')){
      var b=el('div','f-searchbtn','<span>⌕</span> Archiv durchsuchen');
      b.addEventListener('click', openTerminal);
      var lead=akte.querySelector('.lead');
      if(lead&&lead.parentNode) lead.parentNode.insertBefore(b, lead.nextSibling); else akte.appendChild(b);
    }
    var stamp=document.querySelector('.fcimg .stamp');
    if(stamp && !stamp.dataset.f){ stamp.dataset.f='1'; var o=stamp.innerHTML; setInterval(function(){ if(Math.random()<0.1){ stamp.innerHTML='AKTE&nbsp;OFFEN'; stamp.style.color='var(--crimson)'; setTimeout(function(){ stamp.innerHTML=o; stamp.style.color=''; },240);} },4600); }
    if(S.opened) addReenter();
  }
  function addReenter(){ if(document.querySelector('.f-reenter'))return; var b=el('div','f-searchbtn f-reenter','<span>🗂️</span> Fall weiter ermitteln'); b.style.marginLeft='10px'; b.addEventListener('click', openDesk); var h=document.querySelector('#akte .wrap .f-searchbtn'); if(h&&h.parentNode) h.parentNode.insertBefore(b,h.nextSibling); }

  function openTerminal(){
    if(document.querySelector('.f-term-wrap'))return; actx();
    var w=el('div','f-term-wrap');
    w.innerHTML='<div class="f-term"><div class="bar"><span>ARCHIV // TERMINAL</span><span class="x">schließen ✕</span></div><div class="body"><div class="out">> ARCHIV BEREIT.\n> Aktenzeichen oder Stichwort?<span class="f-cursor"></span></div><div class="inl"><span style="color:var(--f-amber)">></span><input placeholder="'+D.entry.terminalPlaceholder+'"><button class="go">SUCHEN</button></div></div></div>';
    document.body.appendChild(w);
    var out=w.querySelector('.out'), inp=w.querySelector('input');
    w.querySelector('.x').addEventListener('click',function(){ w.remove(); });
    function go(){ var q=inp.value.trim(); if(!q)return; blip(300);
      if(H(q)===D.hashes.entry){ out.innerHTML=''; typeLines(out,[D.entry.hitTitle].concat(D.entry.hitLines),function(){ var g=el('button','go',D.entry.button); g.style.marginTop='14px'; w.querySelector('.inl').style.display='none'; out.appendChild(g); g.addEventListener('click',function(){ w.remove(); S.entered=true; save(); openLetter(); }); }); }
      else { out.innerHTML='> '+q.toUpperCase()+'\n> '+D.entry.terminalDeny[Math.floor(Math.random()*D.entry.terminalDeny.length)]+'<span class="f-cursor"></span>'; inp.value=''; }
    }
    w.querySelector('.go').addEventListener('click',go); inp.addEventListener('keydown',function(e){ if(e.key==='Enter')go(); });
    setTimeout(function(){ try{inp.focus();}catch(e){} },50);
  }
  function typeLines(host,lines,done){ var i=0; (function nl(){ if(i>=lines.length){ done&&done(); return; } var p=el('div'); host.appendChild(p); var t=lines[i],j=0; (function ty(){ if(j<=t.length){ p.innerHTML=t.slice(0,j)+'<span class="f-cursor"></span>'; j++; setTimeout(ty,14); } else { p.innerHTML=t; i++; blip(240); setTimeout(nl,150); } })(); })(); }

  function openLetter(){
    var m=modal('f-letter'); actx();
    var body=D.letter.body.map(function(p){ return '<p>'+p+'</p>'; }).join('');
    m.querySelector('.f-doc').innerHTML='<div class="f-dh"><span>EINFÜHRUNG // FALLAKTE '+D.meta.caseNo+'</span><span class="cl">✕</span></div><div class="f-db">'+body+'<div class="from">— '+D.letter.from+'</div><button class="f-btn" style="margin-top:16px;width:100%" id="fopen">'+D.entry.button+'</button></div>';
    m.querySelector('.cl').addEventListener('click',function(){ m.remove(); });
    m.querySelector('#fopen').addEventListener('click',function(){ m.remove(); S.opened=true; save(); openDesk(); });
  }

  /* =================================================================
     ERMITTLUNGSTISCH
     ================================================================= */
  var DK={}; // dom refs
  function openDesk(){
    if(document.querySelector('.f-desk'))return; document.body.classList.add('f-noscroll'); actx();
    // Start-Beweise sichern
    D.evidence.forEach(function(e){ if(e.start) S.found[e.id]=true; }); save();
    var desk=el('div','f-desk');
    desk.innerHTML=
      '<div class="f-top">'+
        '<div class="f-title">SCHWARZE AKTE — <b>'+D.meta.title+'</b><span class="cn">Aktenzeichen '+D.meta.caseNo+' · Opfer: '+D.meta.victim+'</span></div>'+
        '<div class="f-tabs">'+
          '<div class="f-tab active" data-tab="cork">📌 Pinnwand</div>'+
          '<div class="f-tab" data-tab="ev">🗂️ Beweise</div>'+
          '<div class="f-tab" data-tab="note">📝 Notizen</div>'+
          '<div class="f-tab" data-act="online">🌐 Online</div>'+
          '<div class="f-tab" data-act="hint">💡 Hinweis</div>'+
          '<div class="f-tab solve" data-act="solve">🔒 Fall lösen</div>'+
          '<div class="f-tab x" data-act="close">✕</div>'+
        '</div>'+
        '<div class="f-phase">PHASE <span class="phn">1</span>/5</div>'+
      '</div><div class="f-stage"></div>';
    document.body.appendChild(desk);
    DK.desk=desk; DK.stage=desk.querySelector('.f-stage'); DK.top=desk.querySelector('.f-top');
    desk.querySelectorAll('.f-tab').forEach(function(t){ t.addEventListener('click',function(){
      if(t.dataset.tab){ desk.querySelectorAll('.f-tab[data-tab]').forEach(function(x){x.classList.remove('active');}); t.classList.add('active'); showTab(t.dataset.tab); }
      else act(t.dataset.act);
    }); });
    showTab('cork'); updateTop(); checkEliminations();
  }
  function closeDesk(){ if(DK.desk){ DK.desk.remove(); } DK={}; stopAmb(); document.body.classList.remove('f-noscroll'); addReenter(); }
  function updateTop(){ if(!DK.top)return; DK.top.querySelector('.phn').textContent=phaseNow(); var sv=DK.top.querySelector('.f-tab.solve'); if(canSolve()){ sv.removeAttribute('disabled'); sv.innerHTML='🔓 Fall lösen'; } else { sv.setAttribute('disabled','1'); sv.innerHTML='🔒 Fall lösen'; } }

  function act(a){ if(a==='close')return closeDesk(); if(a==='online')return openOnline(); if(a==='hint')return toast('💡 '+D.hints[Math.min(D.hints.length-1,phaseNow()-1)]); if(a==='solve'){ if(!canSolve()){ toast('Noch nicht genug: streich erst vier Verdächtige raus, kläre das Mittel (Paket) und finde den entscheidenden Hinweis (Spektrum).'); return; } openFinal(); } }

  function showTab(tab){ DK.stage.innerHTML=''; if(tab==='cork') renderCork(); else if(tab==='note') openNotes(); else renderEvidence(); }

  /* ---------- Pinnwand ---------- */
  function renderCork(){
    var cork=el('div','f-cork'); DK.stage.appendChild(cork); DK.grid=null;
    cork.innerHTML='<div class="hint">Sechs Menschen. Streich raus, wer nachweislich woanders war — bis nur noch zwei übrig sind.</div>'+
      '<div class="f-victim"><div class="v">✝ '+D.meta.victim+'</div><div class="s">tot aufgefunden — live im Stream, 22:14</div></div>';
    if(fourCleared()) cork.innerHTML+='<div class="f-remaining">⚠ Nur noch zwei Verdächtige — jetzt zählt der entscheidende Beweis.</div>';
    var wrap=el('div','f-cards'); cork.appendChild(wrap);
    var rots=[-3,2,-2,3,-1,2], just=DK._just||{};
    D.suspects.forEach(function(s,i){
      var cl=!!S.cleared[s.id], remaining=!cl, susp=fourCleared()&&remaining;
      var stCls=cl?'clear':(susp?'guilty':'open'), stTxt=cl?'entlastet':(susp?'VERDÄCHTIG':'offen');
      var c=el('div','f-card'+(cl?' clearx':'')+(just[s.id]?' just-clear':'')); c.style.setProperty('--rot',rots[i%6]+'deg');
      c.innerHTML='<div class="pin"></div><div class="st '+stCls+'">'+stTxt+'</div>'+
        '<div class="av" style="background:'+s.color+'">'+s.av+'</div>'+
        '<div class="nm">'+s.name+'</div><div class="ro">'+s.role+'</div><div class="mo">'+s.motiveHint+'</div>';
      c.addEventListener('click',function(){ openSuspect(s); });
      wrap.appendChild(c);
    });
    DK._just={};
  }
  function openSuspect(s){
    var cl=!!S.cleared[s.id];
    var m=modal(); m.querySelector('.f-doc').innerHTML='<div class="f-dh"><span>VERDÄCHTIGE:R</span><span class="cl">✕</span></div><div class="f-db">'+
      '<h4>'+s.name+'</h4><div class="ro" style="font-family:Space Mono;font-size:11px;color:var(--f-muted);text-transform:uppercase">'+s.role+'</div>'+
      '<p style="margin-top:8px">'+s.note+'</p><div class="f-claim">'+s.claim+'</div>'+
      (cl?'<div class="f-res clear">✓ '+s.clearText+'</div>'
         :'<div class="f-res guilty">Noch verdächtig. Finde einen Beweis, der diese Aussage widerlegt — oder den entscheidenden Hinweis.</div>')+
      '</div>';
    m.querySelector('.cl').addEventListener('click',function(){ m.remove(); });
  }

  /* ---------- Beweise ---------- */
  function renderEvidence(){
    var g=el('div','f-grid'); DK.stage.innerHTML=''; DK.stage.appendChild(g); DK.grid=g;
    D.evidence.forEach(function(e){
      var found=!!S.found[e.id];
      var c=el('div','f-ev'+(found?'':' locked'));
      c.innerHTML='<div class="ic">'+(found?e.icon:'❓')+'</div><div class="t">'+(found?e.title:'— noch nicht gefunden —')+'</div>';
      if(found) c.addEventListener('click',function(){ openEvidence(e); });
      g.appendChild(c);
    });
  }
  function openEvidence(e){
    if(e.spectrum) return openSpectrum(e);
    var m=modal(); var qrSite=D.qr[e.id];
    var body=e.html;
    if(e.cipher) body+=cipherUI();
    if(qrSite) body+='<div class="f-qr" data-site="'+qrSite+'">🔗 QR scannen → '+site(qrSite).title+'</div>';
    m.querySelector('.f-doc').innerHTML='<div class="f-dh"><span>BEWEIS</span><span class="cl">✕</span></div><div class="f-db">'+body+'</div>';
    m.querySelector('.cl').addEventListener('click',function(){ m.remove(); });
    var qr=m.querySelector('.f-qr'); if(qr) qr.addEventListener('click',function(){ m.remove(); openSite(qr.dataset.site); });
    if(e.cipher) wireCipher(m);
  }
  function cipherUI(){ return '<div class="f-cipher"><span class="ct">'+D.cipher.ciphertext+'</span><div class="out"></div></div>'+
      '<div class="f-shift">Verschiebung: <input type="range" min="0" max="25" value="0" class="sh"> <span class="shv">0</span></div>'+
      '<p class="muted">'+D.cipher.hint+'</p>'; }
  function wireCipher(m){ var sh=m.querySelector('.sh'), shv=m.querySelector('.shv'), out=m.querySelector('.f-cipher .out'), ct=D.cipher.ciphertext;
    function dec(k){ return ct.replace(/[A-Z0-9]/g,function(ch){ if(ch>='0'&&ch<='9'){ return String((( (ch.charCodeAt(0)-48) -k)%10+10)%10); } var x=(ch.charCodeAt(0)-65-k)%26; if(x<0)x+=26; return String.fromCharCode(65+x); }); }
    sh.addEventListener('input',function(){ var k=+sh.value; shv.textContent=k; out.textContent=dec(k); if(dec(k)===D.cipher.plain){ out.style.color='#7fe0a0'; if(!S.flags.cipher){ S.flags.cipher=true; save(); toast('Entschlüsselt: '+D.cipher.plain+' — gib das in die Paketverfolgung ein.'); } } else out.style.color=''; });
  }

  /* ---------- Alibi-Checker ---------- */
  function openAlibi(focusId){
    var m=modal('f-alibi'); render();
    function render(){
      var rows=D.suspects.map(function(s){ var st=S.alibi[s.id]; var b=st?('<span class="badge '+(st==='guilty'?'guilty':'clear')+'">'+(st==='guilty'?'VERDÄCHTIG':'entlastet')+'</span>'):'<span class="badge open">offen</span>';
        return '<div class="row" data-id="'+s.id+'"><span class="nm">'+s.name+'</span>'+b+'</div>'; }).join('');
      m.querySelector('.f-doc').innerHTML='<div class="f-dh"><span>ALIBI-ÜBERPRÜFUNG</span><span class="cl">✕</span></div><div class="f-db"><p class="muted">Ordne jeder Aussage den passenden Zeitstempel-Beweis zu. Fünf halten stand — einer nicht.</p><div class="rows">'+rows+'</div><div class="detail"></div></div>';
      m.querySelector('.cl').addEventListener('click',function(){ m.remove(); });
      m.querySelectorAll('.row').forEach(function(r){ r.addEventListener('click',function(){ detail(r.dataset.id); }); });
      if(focusId){ detail(focusId); focusId=null; }
    }
    function detail(id){
      var s=suspect(id), st=S.alibi[id], box=m.querySelector('.detail');
      if(st){ box.innerHTML='<div class="f-claim">'+s.claim+'</div><div class="f-res '+(st==='guilty'?'guilty':'clear')+'">'+(st==='guilty'?'⚠ ':'✓ ')+s.resultText+'</div>'; return; }
      var found=D.evidence.filter(function(e){ return S.found[e.id]; });
      var opts='<option value="">— Beweis wählen —</option>'+found.map(function(e){ return '<option value="'+e.id+'">'+e.title+'</option>'; }).join('');
      box.innerHTML='<div class="f-claim">'+s.claim+'</div><div class="f-check"><select>'+opts+'</select><button class="f-btn">Aussage prüfen</button><div class="res"></div></div>';
      var sel=box.querySelector('select'), res=box.querySelector('.res');
      box.querySelector('button').addEventListener('click',function(){ var v=sel.value; if(!v){ toast('Wähl einen Beweis.'); return; }
        if(v===s.alibiEv){ S.alibi[id]=s.result; save(); blip(s.result==='guilty'?200:600); res.className='res f-res '+(s.result==='guilty'?'guilty':'clear'); res.innerHTML=(s.result==='guilty'?'⚠ ':'✓ ')+s.resultText; if(DK.stage&&DK.stage.querySelector('.f-cork')) renderCork(); updateTop(); setTimeout(render,1400); if(alibisDone()) setTimeout(function(){ toast('Alle Alibis geprüft. Wer bleibt übrig?'); },1600); }
        else { res.className='res f-res guilty'; res.textContent='Dieser Beweis passt nicht zu dieser Aussage.'; blip(160); }
      });
    }
  }

  /* ---------- Online / Fake-Sites ---------- */
  function openOnline(){
    var m=modal(); var list=D.sites.map(function(s){ return '<div class="f-ev" data-site="'+s.id+'" style="text-align:left;display:flex;gap:10px;align-items:center"><span style="font-size:20px">'+(s.chrome.split(' ')[0])+'</span><span class="t" style="margin:0">'+s.title+'</span></div>'; }).join('');
    m.querySelector('.f-doc').innerHTML='<div class="f-dh"><span>ONLINE-RECHERCHE // LESEZEICHEN</span><span class="cl">✕</span></div><div class="f-db"><p class="muted">Bekannte Spuren im Netz. Öffne sie und sichere, was relevant ist.</p><div style="display:grid;grid-template-columns:1fr;gap:8px;margin-top:10px">'+list+'</div></div>';
    m.querySelector('.cl').addEventListener('click',function(){ m.remove(); });
    m.querySelectorAll('[data-site]').forEach(function(x){ x.addEventListener('click',function(){ m.remove(); openSite(x.dataset.site); }); });
  }
  function openSite(id){
    var s=site(id); if(!s)return; S.sites[id]=true; save();
    var w=el('div','f-browser'); var unlocked=!s.needInput || S.flags[id+'_ok'];
    var content=s.needInput && !unlocked ? s.htmlLocked : s.html;
    w.innerHTML='<div class="f-win"><div class="f-urlbar"><span class="dots"><i></i><i></i><i></i></span><span class="url">https://'+s.title+'</span><span class="cl">✕</span></div><div class="fw-body">'+content+
      (s.needInput && !unlocked ? '<div class="fw-in"><input placeholder="'+s.inputLabel+'"><button class="f-btn">OK</button></div>' : '')+
      '</div></div>';
    document.body.appendChild(w);
    w.querySelector('.cl').addEventListener('click',function(){ w.remove(); });
    // save-Buttons
    w.querySelectorAll('.fw-save').forEach(function(b){ if(S.found[b.dataset.ev]){ b.classList.add('done'); b.textContent='✓ gesichert'; } b.addEventListener('click',function(){ if(b.classList.contains('done'))return; addEvidence(b.dataset.ev); b.classList.add('done'); b.textContent='✓ gesichert'; }); });
    // restore (gelöschter Post)
    var rb=w.querySelector('.fw-restore'); if(rb) rb.addEventListener('click',function(){ addEvidence(rb.dataset.ev); rb.parentElement.innerHTML='„'+ (ev(rb.dataset.ev)? '' : '') +'" wiederhergestellt ✓ — als Beweis gesichert.'; });
    // audio
    w.querySelectorAll('.fw-audio').forEach(function(a){ a.addEventListener('click',function(){ playAudio(a.dataset.audio, w); }); });
    // input (tracking)
    var inb=w.querySelector('.fw-in'); if(inb){ var inp=inb.querySelector('input'); function go(){ if(H(inp.value)===D.hashes[s.inputHash]){ S.flags[id+'_ok']=true; save(); blip(600); w.remove(); openSite(id); } else { inp.style.borderColor='var(--f-crimson)'; blip(160); } } inb.querySelector('button').addEventListener('click',go); inp.addEventListener('keydown',function(e){ if(e.key==='Enter')go(); }); }
  }
  function playAudio(id, host){
    var a=D.audios[id]; if(!a)return; playAmb(a.amb);
    var box=host.querySelector('.f-player-active'); if(box) box.remove();
    var p=el('div','f-player f-player-active','<div class="eq"><i style="animation-delay:0s"></i><i style="animation-delay:.1s"></i><i style="animation-delay:.2s"></i><i style="animation-delay:.3s"></i><i style="animation-delay:.15s"></i></div><div class="tr"></div>');
    // nach dem angeklickten Element einfügen
    var target=host.querySelector('[data-audio="'+id+'"]'); target.parentNode.insertBefore(p, target.nextSibling);
    var tr=p.querySelector('.tr'), lines=a.lines, i=0;
    (function nl(){ if(i>=lines.length){ stopAmb(); p.querySelector('.eq').style.opacity='.3'; return; } var line=lines[i], j=0, span=el('div'); tr.appendChild(span); (function ty(){ if(j<=line.length){ span.textContent=line.slice(0,j); j++; setTimeout(ty,28); } else { i++; setTimeout(nl,500); } })(); })();
  }

  /* ---------- Spektrum-Analysator (entscheidender Hinweis) ---------- */
  function openSpectrum(e){
    var m=modal();
    m.querySelector('.f-doc').innerHTML='<div class="f-dh"><span>SPEKTRUM-ANALYSATOR</span><span class="cl">✕</span></div><div class="f-db">'+e.html+
      '<canvas class="f-spectro" width="520" height="150"></canvas>'+
      '<div class="f-specbtns"><button class="pl">▶ Abspielen &amp; analysieren</button></div>'+
      '<div style="font-family:Space Mono;font-size:12px;color:var(--f-amber);margin-top:12px">'+D.spectrumClue.ask+'</div>'+
      '<div class="f-ask" style="display:flex;gap:8px;margin-top:8px"><input placeholder="Code…"><button class="f-btn ck">Prüfen</button></div><div class="res f-res" style="margin-top:8px"></div></div>';
    m.querySelector('.cl').addEventListener('click',function(){ m.remove(); stopAmb(); });
    var cv=m.querySelector('.f-spectro');
    m.querySelector('.pl').addEventListener('click',function(){ playSpectro('spectro-mod', cv); });
    var inp=m.querySelector('.f-ask input'), res=m.querySelector('.res');
    function go(){ if(H(inp.value)===D.hashes.spectrum){ S.flags.decisive=true; save(); res.className='res f-res clear'; res.innerHTML='✓ '+D.spectrumClue.reveal; blip(600); updateTop(); toast('🧩 Entscheidender Hinweis gesichert.'); }
      else { res.className='res f-res guilty'; res.textContent='Das steht da nicht. Spiel die Aufnahme ab und schau ins Frequenzbild.'; blip(160); } }
    m.querySelector('.ck').addEventListener('click',go); inp.addEventListener('keydown',function(ev){ if(ev.key==='Enter')go(); });
  }
  function playSpectro(name, canvas){ getBuf(name,function(buf){ if(!buf){ toast('Audio nicht verfügbar.'); return; } var c=actx(); var src=c.createBufferSource(); src.buffer=buf; var an=c.createAnalyser(); an.fftSize=1024; src.connect(an); an.connect(c.destination); src.start();
    var ctx=canvas.getContext('2d'),W=canvas.width,Hh=canvas.height; ctx.fillStyle='#05060a'; ctx.fillRect(0,0,W,Hh); var data=new Uint8Array(an.frequencyBinCount); var f=0;
    (function draw(){ an.getByteFrequencyData(data); var img=ctx.getImageData(0,0,W,Hh); ctx.putImageData(img,-2,0); ctx.fillStyle='#05060a'; ctx.fillRect(W-2,0,2,Hh); var bins=an.frequencyBinCount;
      for(var y=0;y<Hh;y++){ var bi=Math.floor((1-y/Hh)*bins*0.5); var v=data[bi]/255; if(v>0.12){ ctx.fillStyle='rgba('+Math.floor(169*v+80)+','+Math.floor(112*v+40)+',255,'+v+')'; ctx.fillRect(W-2,y,2,1); } }
      if(f++<240) requestAnimationFrame(draw); })();
  }); }

  /* ---------- Notizblock ---------- */
  function openNotes(){
    var foundN=D.evidence.filter(function(e){return S.found[e.id];}).length;
    var status=D.suspects.map(function(s){ var cl=!!S.cleared[s.id], rem=!cl&&fourCleared(); return '<div class="f-scard '+(cl?'clear':(rem?'susp':''))+'"><div class="n">'+s.name+'</div><div class="b">'+(cl?'✓ entlastet':(rem?'⚠ verdächtig':'offen'))+'</div></div>'; }).join('');
    var w=el('div','f-note-wrap','<div class="f-status">'+status+'</div>'+
      '<h4>Ermittlungsstand — Phase '+phaseNow()+'/5 · '+foundN+'/'+D.evidence.length+' Beweise</h4>'+
      '<textarea class="f-notepad" placeholder="Deine Notizen (werden gespeichert): Wer war wann wo? Welcher Beweis widerlegt welches Alibi? Was sagt das Spektrum?"></textarea>'+
      '<div style="margin-top:12px;display:flex;gap:8px"><button class="f-btn" id="rst" style="background:#2a1114;color:#ff6b7d">Fall zurücksetzen</button></div>');
    DK.stage.appendChild(w);
    var ta=w.querySelector('.f-notepad'); ta.value=S.notes||''; ta.addEventListener('input',function(){ S.notes=ta.value; save(); });
    w.querySelector('#rst').addEventListener('click',function(){ if(confirm('Gesamten Fortschritt löschen?')){ S=fresh(); save(); closeDesk(); toast('Zurückgesetzt.'); } });
  }

  /* ---------- Finale: Anklage ---------- */
  function openFinal(){
    var m=modal('f-final');
    function opts(arr){ return arr.map(function(o){ return '<option value="'+o[0]+'">'+o[1]+'</option>'; }).join(''); }
    m.querySelector('.f-doc').innerHTML='<div class="f-dh"><span>FALL LÖSEN // ANKLAGE</span><span class="cl">✕</span></div><div class="f-db">'+
      '<h4>Deine Schlussfolgerung</h4><p class="muted">Nenne Täter:in, Motiv und Tatwerkzeug.</p>'+
      '<label>Täter:in</label><select id="fc"><option value="">— wählen —</option>'+opts(D.finalOptions.culprit)+'</select>'+
      '<label>Motiv</label><select id="fm"><option value="">— wählen —</option>'+opts(D.finalOptions.motive)+'</select>'+
      '<label>Tatwerkzeug</label><select id="fw"><option value="">— wählen —</option>'+opts(D.finalOptions.weapon)+'</select>'+
      '<button class="f-accuse" id="acc">Anklage einreichen</button><div class="res f-res" style="margin-top:12px"></div></div>';
    m.querySelector('.cl').addEventListener('click',function(){ m.remove(); });
    m.querySelector('#acc').addEventListener('click',function(){
      var c=m.querySelector('#fc').value, mo=m.querySelector('#fm').value, we=m.querySelector('#fw').value; var res=m.querySelector('.res');
      if(!c||!mo||!we){ res.className='res f-res guilty'; res.textContent='Bitte alle drei Felder wählen.'; return; }
      var cv=D.finalOptions.culpritVal[c]||c;
      if(H(cv+'|'+mo+'|'+we)===D.hashes.solution){ S.solved=true; save(); m.remove(); closeDesk(); reward(); }
      else { res.className='res f-res guilty'; res.textContent=D.reward.wrong; blip(160); }
    });
  }
  function reward(){
    document.body.classList.add('f-noscroll');
    var r=el('div','f-reward'); r.innerHTML='<div class="scr"><div class="rt">'+D.reward.title+'</div>'+D.reward.text.map(function(p){return '<p>'+p+'</p>';}).join('')+'<div class="note">'+D.reward.note+'</div><button class="cl">schließen</button></div>';
    document.body.appendChild(r);
    r.querySelector('.cl').addEventListener('click',function(){ r.remove(); document.body.classList.remove('f-noscroll'); });
    try{ document.dispatchEvent(new KeyboardEvent('keydown',{key:'c'})); }catch(e){}
  }

  /* ---------- modal helper ---------- */
  function modal(extra){ var m=el('div','f-modal'); var d=el('div','f-doc'+(extra?' '+extra:'')); m.appendChild(d); document.body.appendChild(m); m.addEventListener('click',function(e){ if(e.target===m) m.remove(); }); return m; }

  /* ---------- Boot ---------- */
  function boot(){ installEntry(); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
  window.FALLGAME={ open:openDesk, term:openTerminal, reset:function(){ S=fresh(); save(); }, state:function(){return S;},
    win:function(){ D.evidence.forEach(function(e){S.found[e.id]=true;}); D.suspects.forEach(function(s){ if(s.clearEv) S.cleared[s.id]=true; }); S.flags.decisive=true; save(); } };
})();
