/* =====================================================================
   SCHWARZE AKTE — Fall „LETZTE FOLGE"  (Krimi.Games-Prinzip, v2)
   Gestaffelte Entlastung: 4 Verdächtige fallen nacheinander weg,
   2 bleiben (Voss & Mara). Der entscheidende Hinweis (Spektrogramm
   „MOD07") überführt Mara. Story<->Technik getrennt. Lösung als Hash.
   ===================================================================== */
window.FALL = {
  version: 2,
  hashes: {
    entry: 1078280478,        // "NACHTCAST"
    tracking: 3290905179,     // "NX4471"
    spectrum: 228382860,      // "MOD07"
    solution: 4129134655      // "MARA|OBSESSION|ZOLPIDEM"
  },

  meta: { title:"LETZTE FOLGE", caseNo:"SA-2026-013", victim:"Milo Ferber" },

  entry: {
    redactFooter: "Ein Fall ist nie wirklich geschlossen. Frag das Archiv nach dem, der live starb.",
    terminalPlaceholder: "Aktenzeichen oder Stichwort…",
    terminalDeny: ["KEIN EINTRAG.","AKTE VERSIEGELT.","NICHTS GEFUNDEN.","ZUGRIFF VERWEIGERT."],
    hitTitle: "AKTE SA-2026-013 // NACHTCAST",
    hitLines: [
      "> UNGELÖSTER FALL GEFUNDEN.",
      "> OPFER: MILO FERBER (29) — STREAMER „NACHTCAST\"",
      "> STATUS: OFFEN. DIE POLIZEI SAGT: UNFALL.",
      "> ICH SAGE: NEIN. — P.",
      "> Willst du den Fall mit mir öffnen?"
    ],
    button: "FALLAKTE ÖFFNEN"
  },

  letter: {
    from: "Patrick — Schwarze Akte",
    body: [
      "Hey. Normalerweise lösen wir alte Fälle. Dieser ist frisch — und offiziell gar keiner.",
      "Milo Ferber, 29, True-Crime-Streamer („NACHTCAST\"). Er bricht am 14. während seines Livestreams um <b>22:14</b> zusammen. Tot. Die Polizei: Überarbeitung, Unfall. Akte zu.",
      "Sechs Menschen waren an dem Abend wichtig in seinem Leben. Ich habe alles zusammengetragen: Berichte, Chats, Belege, seine Kanäle.",
      "<b>Dein Job:</b> Sichte alles. Prüfe jedes Alibi gegen harte Zeitstempel. Streich raus, wer nachweislich woanders war. Wenn nur noch zwei übrig sind, brauchst du <b>den einen entscheidenden Beweis</b>.",
      "Mach dir Notizen. Nimm dir Zeit. — P."
    ]
  },

  /* ---------------- VERDÄCHTIGE ----------------
     clearEv = Beweis, dessen Fund die Person entlastet (staffelt die Elimination).
     Voss & Mara haben keinen -> bleiben als letzte zwei übrig. */
  suspects: [
    { id:"sven",  name:"Sven Ferber", role:"Entfremdeter Vater", av:"SF", color:"#9a948a",
      note:"Seit Jahren kein Kontakt zu Milo.", motiveHint:"Alte Wut?",
      claim:"„Ich war im Ausland. Boarding-Pass hab ich noch.\"",
      clearEv:"ev_boarding", clearText:"Boarding-Pass + Einreisestempel: an dem Abend nachweislich im Ausland, Rückflug erst am Folgetag. Raus." },
    { id:"kevin", name:"Kevin „KROW\" Roth", role:"Ex-Mit-Podcaster", av:"KR", color:"#a970ff",
      note:"Zerstritten, ging im Streit.", motiveHint:"Neid / Kanal?",
      claim:"„Ich war auf der CreatorCon in Berlin. Frag wen du willst.\"",
      clearEv:"ev_selfie", clearText:"Event-Selfie mit EXIF 21:37, GPS Berlin — 480 km entfernt. Raus." },
    { id:"tobias",name:"Tobias Hein", role:"Sponsor & Gläubiger", av:"TH", color:"#7fe0a0",
      note:"Milo schuldete ihm 40.000 €.", motiveHint:"Schulden?",
      claim:"„Geschäftsessen im Bella. Rechnung hab ich.\"",
      clearEv:"ev_receipt", clearText:"Kreditkartenbeleg „Ristorante Bella\", 21:50, Weststadt. Raus." },
    { id:"jana",  name:"Jana Ferber", role:"Schwester & Managerin", av:"JF", color:"#e0243f",
      note:"Verwaltete Milos Geld & Verträge.", motiveHint:"Geld / Erbe?",
      claim:"„Ich war zu Hause und hab den Stream geschaut.\"",
      clearEv:"ev_smarthome", clearText:"Smart-Home-Log: durchgehend zu Hause 21:00–23:00. Und die Police wurde umgeschrieben — sie erbt nichts. Raus." },
    { id:"voss",  name:"Dr. Lena Voss", role:"Ex-Freundin, Ärztin", av:"LV", color:"#f0a340",
      note:"Ärztin — beruflich Zugang zu Zolpidem.", motiveHint:"Eifersucht + Mittel!",
      claim:"„Ich hatte Nachtschicht. Die ganze Nacht.\"",
      clearEv:null, clearText:"" },
    { id:"mara",  name:"Mara Sun", role:"Superfan & Discord-Mod", av:"MS", color:"#ff3b57",
      note:"Als Mod besaß sie einen Studioschlüssel.", motiveHint:"Obsession?",
      claim:"„Ich war die ganze Zeit im Discord-Voice. Durchgehend.\"",
      clearEv:null, clearText:"" }
  ],

  // Wenn nur noch diese übrig sind, wird der entscheidende Hinweis gebraucht:
  finalTwo: ["voss","mara"],

  /* ---------------- BEWEISE ---------------- */
  evidence: [
    /* --- Kontext (liegt auf dem Tisch) --- */
    { id:"ev_letter_patrick", start:true, phase:1, icon:"✉️", title:"Notiz von Milo an Patrick",
      html:"<div class='letter'><div class='lh'><span class='lh-logo'>NC</span><div><b>Milo Ferber</b><small>NACHTCAST</small></div></div>"+
        "<p>Patrick,</p><p>ich glaub, mich verfolgt jemand. Eine aus dem Chat. Sie stand heute vor dem Studio. Falls mir was passiert: es war kein Unfall.</p><p class='sig'>— Milo, zwei Tage vorher</p></div>" },
    { id:"ev_obduktion", start:true, phase:1, icon:"🧾", title:"Obduktionsbericht",
      html:"<div class='report'><div class='lh'><span class='lh-logo' style='background:#3a4150'>RM</span><div><b>Institut für Rechtsmedizin</b><small>Kurzbefund · vertraulich</small></div></div>"+
        "<p>Verstorbener: <b>Milo Ferber, 29</b>. Todeszeit <b>22:17</b>.</p><p>Ursache: zentraler Atemstillstand durch eine <b>Überdosis Zolpidem</b> (Schlafmittel), oral, ca. 30 Min. vor Todeseintritt. <b>Keine</b> Gewaltspuren.</p><p class='muted'>→ Aufnahme also gegen 21:45.</p></div>" },
    { id:"ev_tatort", start:true, phase:1, icon:"📷", title:"Tatortfoto — Studio",
      html:"<div class='photo'><div class='photo-scene'>🎙️<span class='can'>VOLTAGE</span></div><div class='photo-cap'>Studio · umgekippte Energydrink-Dose „VOLTAGE\" vor dem Mikro · sonst keine Unordnung</div></div>" },
    { id:"ev_labor", start:true, phase:1, icon:"🧪", title:"Laborbericht — Dose",
      html:"<div class='report'><div class='lh'><span class='lh-logo' style='background:#3a4150'>LB</span><div><b>Toxikologie-Labor</b><small>Analyse #A-2210</small></div></div><p>Probe: Energydrink-Dose „VOLTAGE\" (Tatort).</p><p>Ergebnis: <b>Zolpidem-Rückstände</b> nachgewiesen. Das Getränk war das Vehikel.</p></div>" },
    { id:"ev_vod", start:true, phase:1, icon:"🎬", title:"Stream-VOD-Protokoll",
      html:"<div class='report'><div class='lh'><span class='lh-logo' style='background:#7a44e0'>▶</span><div><b>NACHTCAST — Live-VOD</b><small>Auszug Ereignis-Log</small></div></div>"+
        "<ul class='timeline'><li><b>21:00</b> Stream-Start</li><li class='hot'><b>20:50</b> Chat: Milo blockt „mara.loves.nacht\" — „Hausverbot.\"</li><li><b>21:44</b> Milo trinkt aus der VOLTAGE-Dose</li><li class='hot'><b>22:14</b> Milo sackt zusammen — Stream bricht ab</li></ul></div>" },
    { id:"ev_chiffre", start:true, phase:1, icon:"🔡", title:"STRENG VERTRAULICH (verschlüsselt)", cipher:true,
      html:"<div class='report'><div class='lh'><span class='lh-logo' style='background:#e0243f'>!</span><div><b>Abgefangene Notiz</b><small>Cäsar-Verschlüsselung</small></div></div><p>Entschlüssle die <b>Sendungsnummer</b> und gib sie in die Paketverfolgung ein.</p></div>" },

    /* --- Verdächtigen-Entlastung (gestaffelt, über Recherche/Rätsel) --- */
    { id:"ev_boarding", phase:2, icon:"✈️", title:"Boarding-Pass (S. Ferber)", from:"site_reise",
      html:"<div class='boarding'><div class='bp-top'><span>BOARDING PASS</span><span>SKY-AIR</span></div><div class='bp-row'><div><small>PASSAGIER</small><b>FERBER / SVEN</b></div><div><small>FLUG</small><b>SK 441</b></div></div><div class='bp-row'><div><small>VON</small><b>MUC</b></div><div><small>NACH</small><b>Ausland</b></div><div><small>RÜCK</small><b>Folgetag</b></div></div><div class='bp-strip'></div></div>" },
    { id:"ev_bahnticket", phase:2, icon:"🎫", title:"ICE-Ticket (K. Roth)", from:"site_reise",
      html:"<div class='ticket'><div class='tk-hd'>DB · FERNVERKEHR</div><p>München Hbf → Berlin Hbf · Tattag · Abfahrt 15:02 · Wagen 7, Sitz 24A</p><p class='muted'>Reisender: K. Roth</p></div>" },
    { id:"ev_selfie", phase:2, icon:"🤳", title:"Event-Selfie (K. Roth)", from:"site_social", micro:true,
      html:"<div class='photo'><div class='photo-scene'>🎟️<span class='can'>CreatorCon</span></div><div class='photo-cap'>„Endlich in Berlin! #CreatorCon\"</div></div>"+
        "<div class='exif'><b>📎 Datei-Metadaten (EXIF):</b><br>Aufnahme: <b>21:37</b> · GPS: <b>52.52, 13.40 (Berlin)</b> · Gerät: Pixel</div>" },
    { id:"ev_receipt", phase:2, icon:"🧾", title:"Kreditkartenbeleg (T. Hein)", from:"site_bank",
      html:"<div class='receipt'><div class='r-c'>RISTORANTE BELLA</div><div class='r-c muted'>Weststadt · Tisch 4</div><div class='r-line'></div><div class='r-row'><span>2× Menü</span><span>64,00</span></div><div class='r-row'><span>Wein</span><span>24,40</span></div><div class='r-line'></div><div class='r-row'><b>SUMME</b><b>88,40 €</b></div><div class='r-c' style='margin-top:8px'>VISA •••• 4021 · <b>21:50</b></div></div>" },
    { id:"ev_smarthome", phase:2, icon:"🏠", title:"Smart-Home-Log (J. Ferber)", from:"site_smarthome",
      html:"<div class='report'><div class='lh'><span class='lh-logo' style='background:#1f6b3a'>⌂</span><div><b>HomeHub</b><small>Wohnung J. Ferber</small></div></div><ul class='timeline'><li>20:58 TV an</li><li>21:20 Bewegung Wohnzimmer</li><li>22:14 Bewegung Wohnzimmer</li><li>23:10 TV aus</li></ul><p>Wohnungstür: nicht geöffnet 21:00–23:00.</p></div>" },
    { id:"ev_insurance", phase:2, icon:"📄", title:"Lebensversicherung", from:"site_bank",
      html:"<div class='letter'><div class='lh'><span class='lh-logo' style='background:#2b6cff'>V</span><div><b>Vita Assekuranz AG</b><small>Police #77-1905</small></div></div><p>Sehr geehrte Frau Ferber,</p><p>Ihre Änderung wurde vorgemerkt: Begünstigte:r im Todesfall von M. Ferber ab dem 02.: <s>Jana Ferber</s> → <b>„Tierheim Nord e.V.\"</b>.</p><p class='sig'>Vita Assekuranz</p></div>" },

    /* --- Chats (WhatsApp) --- */
    { id:"ev_wa_jana", start:true, phase:1, icon:"💬", title:"Chat: Milo ↔ Jana",
      html:"<div class='wa'><div class='wa-hd'><span class='wa-av' style='background:#e0243f'>JF</span> Jana (Schwester)</div><div class='wa-body'>"+
        "<div class='wa-day'>Tattag</div>"+
        "<div class='wa-msg in'>Ich hab die Versicherung umschreiben lassen wie du wolltest. Bist du sicher?? <span class='wa-t'>18:02</span></div>"+
        "<div class='wa-msg out'>Ja. Ich will das sauber. Danke Schwesterherz ❤ <span class='wa-t'>18:04 ✓✓</span></div>"+
        "<div class='wa-msg in'>Schau heut deinen Stream vom Sofa aus 🍕 <span class='wa-t'>20:57</span></div></div></div>" },
    { id:"ev_wa_mara", start:true, phase:1, icon:"💬", title:"Chat: Milo ↔ „mara.loves.nacht\"",
      html:"<div class='wa'><div class='wa-hd'><span class='wa-av' style='background:#ff3b57'>MS</span> mara.loves.nacht</div><div class='wa-body'>"+
        "<div class='wa-msg in'>warum antwortest du nicht 😔 <span class='wa-t'>17:10</span></div>"+
        "<div class='wa-msg in'>ich weiß dass du mich siehst. wir gehören zusammen. <span class='wa-t'>17:11</span></div>"+
        "<div class='wa-msg out'>Mara, hör auf. Das ist nicht gesund. <span class='wa-t'>19:40 ✓✓</span></div>"+
        "<div class='wa-msg in'>du wirst es bereuen. die letzte folge wird WIRKLICH die letzte. <span class='wa-t'>19:12</span></div>"+
        "<div class='wa-msg out'>Ich ruf die Polizei. <span class='wa-t'>19:45 ✓</span></div></div></div>" },

    /* --- Digitale Belege --- */
    { id:"ev_dienstplan", phase:3, icon:"🏥", title:"Klinik-Dienstplan (Dr. Voss)", from:"site_klinik",
      html:"<div class='report'><div class='lh'><span class='lh-logo' style='background:#101a22'>+</span><div><b>Klinikum — Schichtportal</b></div></div><table class='tab'><tr><th>Name</th><th>Check-in</th><th>Check-out</th></tr><tr><td>Dr. L. Voss</td><td>20:00</td><td>06:04</td></tr></table><p class='muted'>Sie hatte Zugang zum Mittel — aber war sie am Tatort?</p></div>" },
    { id:"ev_discordlog", phase:3, icon:"🎙️", title:"Discord-Voice-Log (M. Sun)", from:"site_discord",
      html:"<div class='report'><div class='lh'><span class='lh-logo' style='background:#5865f2'>#</span><div><b>Voice-Channel „Mod-Lounge\"</b></div></div><ul class='timeline'><li>20:10 mara.loves.nacht <span class='ok'>verbunden</span></li><li class='hot'>21:38 <span class='bad'>getrennt</span></li><li class='hot'>22:02 <span class='ok'>wieder verbunden</span></li></ul><p class='bad'>Lücke: 21:38–22:02 (24 Min.) — „durchgehend online\"?</p></div>" },
    { id:"ev_modroster", phase:3, icon:"🗝️", title:"Mod-Schlüsselliste", from:"site_discord",
      html:"<div class='report'><div class='lh'><span class='lh-logo' style='background:#5865f2'>#</span><div><b>Studio — Mod-Schlüsselkarten</b></div></div><table class='tab'><tr><th>Karte</th><th>Inhaber:in</th></tr><tr><td>MOD #05</td><td>KROW</td></tr><tr><td><b>MOD #07</b></td><td><b>mara.loves.nacht (Mara Sun)</b></td></tr></table></div>" },
    { id:"ev_tuerlog", phase:3, icon:"🚪", title:"Studio-Türlog", from:"site_tuerlog",
      html:"<div class='report'><div class='lh'><span class='lh-logo' style='background:#1a1410'>🚪</span><div><b>Zutrittssystem — Studio</b></div></div><table class='tab'><tr><th>Zeit</th><th>Karte</th></tr><tr class='hot'><td><b>21:41</b></td><td><b>MOD #07</b></td></tr><tr><td>22:05</td><td>Tür geschlossen</td></tr></table><p class='muted'>Wem gehört Karte #07?</p></div>" },
    { id:"ev_tracking", phase:3, icon:"📦", title:"Paketverfolgung", from:"site_tracking",
      html:"<div class='report'><div class='lh'><span class='lh-logo' style='background:#101a1a'>📦</span><div><b>Sendung NX-4471</b></div></div><p>Absender: „SchlafGut Versand\" · Inhalt: <b>Zolpidem 10mg</b></p><p>Empfängerin: <b>M. Sun</b>, zugestellt <b>Vortag der Tat</b>.</p></div>" },
    { id:"ev_chatblock", phase:3, icon:"🔨", title:"Chat-Bann (20:50)", from:"site_nachtcast",
      html:"<div class='wa'><div class='wa-hd'><span class='wa-av' style='background:#7a44e0'>▶</span> NACHTCAST-Livechat</div><div class='wa-body'>"+
        "<div class='wa-msg in'>warum antwortest du nicht?? ich weiß wo du bist <span class='wa-t'>20:50</span></div>"+
        "<div class='wa-msg out'>Mara, das reicht. Du bekommst Hausverbot. <span class='wa-t'>20:50</span></div>"+
        "<div class='wa-sys'>mara.loves.nacht wurde gebannt 🔨</div></div></div>" },
    { id:"ev_deletedpost", phase:3, icon:"🗑️", title:"Gelöschter Post (@mara.loves.nacht)", from:"site_social",
      html:"<div class='wa'><div class='wa-hd'><span class='wa-av' style='background:#ff3b57'>MS</span> wiederhergestellter Beitrag</div><div class='wa-body'><div class='wa-msg in'>Wenn ich ihn nicht haben kann, dann soll die letzte Folge <b>wirklich</b> die letzte sein. 🖤 <span class='wa-t'>19:12 · gelöscht 19:22</span></div></div></div>" },

    /* --- Der entscheidende Hinweis: Spektrogramm --- */
    { id:"ev_spectrum", phase:4, icon:"📈", title:"Studio-Aufnahme (verrauscht)", from:"site_polizei", spectrum:true,
      html:"<div class='report'><div class='lh'><span class='lh-logo' style='background:#12161a'>♒</span><div><b>Asservat: Sprachassistent-Mitschnitt</b><small>letzte 4 Sekunden vor dem Zusammenbruch</small></div></div><p>Vorwärts nur Rauschen. Aber im <b>Frequenzbild</b> steckt etwas. Öffne den Spektrum-Analysator.</p></div>" },

    /* --- Flavor / Red Herring --- */
    { id:"ev_lotto", start:true, phase:1, icon:"🎰", title:"Lottoschein (im Studio)",
      html:"<div class='report'><div class='lh'><span class='lh-logo' style='background:#1f6b3a'>€</span><div><b>SuperLotto</b><small>gefunden im Studio-Müll</small></div></div><p>Ein alter Schein von Tobias. Wirkt verdächtig — führt aber ins Leere. <span class='muted'>(Red Herring)</span></p></div>" }
  ],

  cipher: { shift:7, ciphertext:"UE1148", plain:"NX4471", hint:"Cäsar-Verschiebung: 7 (Buchstaben und Ziffern)." },

  /* ---------------- FAKE-WEBSITES ---------------- */
  sites: [
    { id:"site_nachtcast", title:"nachtcast.stream", chrome:"🔴 LIVE-ARCHIV",
      html:"<div class='fw'><div class='fw-hd' style='background:#1a1020'><b>NACHTCAST</b> — Milo Ferber</div><p>Letzte Folge: „Der Fall, der zu nah war\" (unvollendet).</p><div class='fw-chat'><div><b>mara.loves.nacht</b> 20:50 — „ich weiß wo du bist\"</div><div><b>Milo</b> 20:50 — „Hausverbot.\" <span class='ban'>[gebannt]</span></div></div><button class='fw-save' data-ev='ev_chatblock'>📌 Chat-Bann sichern</button></div>" },
    { id:"site_social", title:"blip.social/@mara.loves.nacht", chrome:"👤 Profil",
      html:"<div class='fw'><div class='fw-hd' style='background:#1a1020'>@mara.loves.nacht — „Milos größter Fan 🖤\"</div><div class='fw-post'>„3. Reihe beim Meetup 😍 er hat mich ANGESCHAUT\"</div><div class='fw-post'>Foto: CreatorCon-Selfie eines anderen Users? (Kevin)</div><button class='fw-save' data-ev='ev_selfie'>📌 (Kevin) Selfie-Metadaten sichern</button><div class='fw-post deleted'>🗑️ 1 gelöschter Beitrag <button class='fw-restore' data-ev='ev_deletedpost'>wiederherstellen</button></div></div>" },
    { id:"site_klinik", title:"klinikum-portal.de/dienst", chrome:"🔒 Mitarbeiterportal",
      html:"<div class='fw'><div class='fw-hd' style='background:#101a22'>Klinikum — Schichtportal</div><table class='fw-tab'><tr><th>Name</th><th>ein</th><th>aus</th></tr><tr><td>Dr. L. Voss</td><td>20:00</td><td>06:04</td></tr></table><button class='fw-save' data-ev='ev_dienstplan'>📌 Dienstplan sichern</button></div>" },
    { id:"site_smarthome", title:"homehub.app/aktivität", chrome:"🏠 HomeHub",
      html:"<div class='fw'><div class='fw-hd' style='background:#101a14'>HomeHub — Wohnung J. Ferber</div><ul><li>20:58 TV an</li><li>22:14 Bewegung Wohnzimmer</li><li>23:10 TV aus</li></ul><button class='fw-save' data-ev='ev_smarthome'>📌 Log sichern</button></div>" },
    { id:"site_discord", title:"discord · Mod-Lounge", chrome:"🎙️ Voice-Log",
      html:"<div class='fw'><div class='fw-hd' style='background:#151826'>Mod-Lounge — Log & Schlüssel</div><ul><li>21:38 mara.loves.nacht <span class='bad'>getrennt</span></li><li>22:02 <span class='ok'>wieder verbunden</span></li></ul><button class='fw-save' data-ev='ev_discordlog'>📌 Voice-Log sichern</button><table class='fw-tab'><tr><th>Karte</th><th>Mod</th></tr><tr><td>MOD #07</td><td>mara.loves.nacht</td></tr></table><button class='fw-save' data-ev='ev_modroster'>📌 Schlüsselliste sichern</button></div>" },
    { id:"site_tuerlog", title:"studio-access.io/log", chrome:"🚪 Zutrittssystem",
      html:"<div class='fw'><div class='fw-hd' style='background:#1a1410'>Studio — Zutrittsprotokoll</div><table class='fw-tab'><tr><th>Zeit</th><th>Karte</th></tr><tr><td><b>21:41</b></td><td><b>MOD #07</b></td></tr></table><button class='fw-save' data-ev='ev_tuerlog'>📌 Türlog sichern</button></div>" },
    { id:"site_reise", title:"meine-reisen.de/tickets", chrome:"✈️ Reise-Account",
      html:"<div class='fw'><div class='fw-hd' style='background:#101820'>Gespeicherte Tickets</div><p>Zwei Belege in der Fallablage:</p><button class='fw-save' data-ev='ev_boarding'>📌 Boarding-Pass (Sven) sichern</button><button class='fw-save' data-ev='ev_bahnticket'>📌 ICE-Ticket (Kevin) sichern</button></div>" },
    { id:"site_bank", title:"kontoauszug.online", chrome:"💳 Belege",
      html:"<div class='fw'><div class='fw-hd' style='background:#12161a'>Belege & Verträge</div><button class='fw-save' data-ev='ev_receipt'>📌 Kreditkartenbeleg (Tobias) sichern</button><button class='fw-save' data-ev='ev_insurance'>📌 Versicherungsbrief (Jana) sichern</button></div>" },
    { id:"site_tracking", title:"paket-tracking.de", chrome:"📦 Sendungsverfolgung",
      needInput:true, inputHash:"tracking", inputLabel:"Sendungsnummer eingeben:",
      htmlLocked:"<div class='fw'><div class='fw-hd' style='background:#101a1a'>Sendungsverfolgung</div><p>Gib eine Sendungsnummer ein. (Sie steckt in der verschlüsselten Notiz.)</p></div>",
      html:"<div class='fw'><div class='fw-hd' style='background:#101a1a'>Sendung <b>NX-4471</b></div><p>Inhalt: <b>Zolpidem 10mg</b> · Empfängerin: <b>M. Sun</b> · zugestellt Vortag.</p><button class='fw-save' data-ev='ev_tracking'>📌 Sendung sichern</button></div>" },
    { id:"site_polizei", title:"polizei-db.intern", chrome:"🔒 Polizei-Datenbank",
      html:"<div class='fw'><div class='fw-hd' style='background:#12161a'>Asservate: Audio & Aufnahmen</div><div class='fw-audio' data-audio='vm_milo'>▶ Voicemail — Milo an Patrick</div><div class='fw-audio' data-audio='int_mara'>▶ Verhör — Mara Sun</div><div class='fw-audio' data-audio='int_voss'>▶ Verhör — Dr. Voss</div><button class='fw-save' data-ev='ev_spectrum'>📌 Studio-Aufnahme (verrauscht) sichern</button></div>" }
  ],
  qr: { ev_vod:"site_nachtcast", ev_chiffre:"site_tracking" },

  audios: {
    vm_milo: { title:"Voicemail — Milo an Patrick", amb:"rec-beep",
      lines:["… Patrick, ich bin's. Diese Mara, der Superfan…","Sie hat als Mod einen Studioschlüssel. Sie stand heute vor der Tür.","Wenn mir was passiert — sie war's."] },
    int_mara: { title:"Verhör — Mara Sun", amb:"rec-room",
      lines:["„Ich war im Voice. Die ganze Zeit.\"","„Einen Schlüssel? … hab ich als Mod, ja. War aber nicht da.\"","„Er hätte mich nicht blocken sollen.\""] },
    int_voss: { title:"Verhör — Dr. Voss", amb:"rec-room",
      lines:["„Ja, ich verschreibe Zolpidem. Und?\"","„Ich war in der Klinik. Prüfen Sie das Badge-System.\"","„Ich hätte Milo nie wehgetan.\""] }
  },

  /* Entscheidender Hinweis */
  spectrumClue: { ask:"Welcher Code steht im Frequenzbild?", answer:"MOD07",
    reveal:"MOD07 — das ist Maras Schlüsselkarte. Voss war laut Dienstplan in der Klinik; Mara war mit Karte #07 um 21:41 im Studio. Damit fällt Voss raus." },

  finalOptions: {
    culprit: [["sven","Sven Ferber"],["kevin","Kevin Roth"],["tobias","Tobias Hein"],["jana","Jana Ferber"],["voss","Dr. Voss"],["mara","Mara Sun"]],
    culpritVal: { sven:"SVEN",kevin:"KEVIN",tobias:"TOBIAS",jana:"JANA",voss:"VOSS",mara:"MARA" },
    motive: [["GELD","Geld / Erbe"],["NEID","Neid auf den Kanal"],["EIFERSUCHT","Eifersucht"],["SCHULDEN","Schulden"],["OBSESSION","Obsession / Zurückweisung"]],
    weapon: [["MESSER","Messer"],["ZOLPIDEM","Schlafmittel (Zolpidem) im Drink"],["STROMSCHLAG","Stromschlag"],["GIFT","Rattengift"],["ERWUERGT","Erwürgt"]]
  },

  reward: {
    title:"FALL GELÖST",
    text:[
      "Mara Sun. Der Fan, der keiner mehr war.",
      "Als Milo sie live blockte, kippte ihre Obsession. Mit ihrer Mod-Karte #07 kam sie um 21:41 ins Studio, während sie im Discord „durchgehend online\" wirkte — die 24-Minuten-Lücke verriet sie. Das Zolpidem hatte sie am Vortag bestellt und in seine VOLTAGE-Dose gekippt. Um 22:14 fiel er vor laufender Kamera.",
      "Dr. Voss hatte das Mittel und ein Motiv — aber ein Alibi. Genau deshalb war sie die perfekte falsche Fährte.",
      "Danke, dass ihr diesen Fall mit mir zu Ende gebracht habt. — Patrick"
    ],
    note:"[ Platzhalter: hier kommt dein echtes Auflösungs-Video / deine Sprachnachricht rein. ]",
    wrong:"Die Indizien tragen diese Anklage nicht. Wer war um 21:41 nachweislich im Studio — und wer nur fast?"
  },

  hints: [
    "Sichte alles. Öffne jedes Dokument. „QR\"-Buttons und „🌐 Online\" führen zu weiteren Belegen.",
    "Streich raus, wer nachweislich woanders war: Boarding-Pass, Selfie-Metadaten (Lupe!), Kreditkartenbeleg, Smart-Home-Log.",
    "Wenn nur noch zwei übrig sind: Beide hatten ein Motiv. Aber nur eine war um 21:41 im Studio.",
    "Öffne die verrauschte Studio-Aufnahme im Spektrum-Analysator. Der Code dort nennt die Schlüsselkarte.",
    "MOD #07 gehört Mara. Voss war in der Klinik. Der Rest ist Beweis."
  ]
};
