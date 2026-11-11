/* =====================================================================
   Listen: text-to-speech reader for every portfolio page
   ---------------------------------------------------------------------
   Loaded automatically by portfolio.js, so any page that includes
   portfolio.js gets a "Listen" button. Uses the browser's built-in
   Web Speech API: free, no account, no audio files, nothing sent to a
   server by this script. Hidden in browsers without speech support.

   • Reads the page's <main> section by section and highlights the part
     being read (and scrolls it into view).
   • Play / pause, previous / next section, stop, speed and voice.
     Speed and voice are remembered in this browser.
   • Select some text first and Play starts from there.
   • Keyboard: everything is a native button or select. Esc stops.
   • Add class="listen-skip" to any element to leave it out.
   • Any element with data-listen (e.g. a button) opens the player.
   ===================================================================== */
(function () {
  if (window.PortfolioListen) return;
  var synth = window.speechSynthesis;
  if (!synth || typeof window.SpeechSynthesisUtterance !== "function") return;

  var KEY = "dream-listen";
  var prefs = { rate: 1, voice: "" };
  try { prefs = Object.assign(prefs, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) {}
  function savePrefs() { try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch (e) {} }

  var SKIP = "script,style,noscript,template,svg,canvas,button,select,input,textarea,option," +
             "[aria-hidden='true'],[hidden],.listen-skip,.listen-ui,.a11y-bar,.skip-link,.visually-hidden,.sr-only";
  var EMOJI = null;
  try { EMOJI = new RegExp("[\\p{Extended_Pictographic}\\u{1F1E6}-\\u{1F1FF}\\uFE0F\\u200D]", "gu"); } catch (e) {}
  var MAX = 220; // Chrome stops long utterances after ~15s, so speak in short pieces.

  var chunks = [], idx = 0, playing = false, token = 0, current = null;
  var ui = null, launcher = null, els = {};

  /* ---------- Collect what to read ---------- */
  function isBlock(el) {
    var d = window.getComputedStyle(el).display;
    return d !== "inline" && d !== "contents"; // inline-block tags/badges count as their own part
  }
  function clean(t) {
    if (EMOJI) t = t.replace(EMOJI, " ");
    return t.replace(/\s+[·•|]\s+/g, ", ").replace(/[←→↑↓↺·•▶⏸]/g, " ").replace(/\s+/g, " ").replace(/\s+([.,;:!?])/g, "$1").replace(/([.!?])[.,]+/g, "$1").replace(/^[.,\s]+/, "").trim();
  }
  function split(text) {
    if (text.length <= MAX) return [text];
    var parts = text.match(/[^.!?;:]+[.!?;:]+["')\]]*\s*|[^.!?;:]+$/g) || [text], out = [], buf = "";
    parts.forEach(function (p) {
      if ((buf + p).length > MAX && buf) { out.push(buf.trim()); buf = ""; }
      while (p.length > MAX) { // very long sentence: break at a comma or space
        var cut = p.lastIndexOf(", ", MAX); if (cut < 60) cut = p.lastIndexOf(" ", MAX); if (cut < 60) cut = MAX;
        out.push(p.slice(0, cut + 1).trim()); p = p.slice(cut + 1);
      }
      buf += p;
    });
    if (buf.trim()) out.push(buf.trim());
    return out;
  }
  function collect() {
    var root = document.getElementById("main") || document.querySelector("main") || document.body;
    var blocks = [], texts = new Map();
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
      acceptNode: function (n) {
        if (n.nodeType === 1) return n.tagName === "BR" ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
        if (!n.nodeValue || !/\S/.test(n.nodeValue)) return NodeFilter.FILTER_REJECT;
        var p = n.parentElement;
        if (!p || p.closest(SKIP)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var n;
    while ((n = walker.nextNode())) {
      var b = n.parentElement || n.parentNode;
      while (b !== root && !isBlock(b)) b = b.parentElement;
      if (n.nodeType === 1) { if (texts.has(b)) texts.get(b).push(". "); continue; } // <br> = pause
      if (!b.getClientRects().length) continue; // not rendered (e.g. closed <details>)
      if (!texts.has(b)) { texts.set(b, []); blocks.push(b); }
      texts.get(b).push(n.nodeValue);
    }
    var out = [];
    blocks.forEach(function (b) {
      var t = clean(texts.get(b).join(""));
      if (!/[A-Za-z0-9]/.test(t)) return;
      // A heading or label without end punctuation gets a short pause.
      if (!/[.!?:;]$/.test(t)) t += ".";
      split(t).forEach(function (piece) { out.push({ el: b, text: piece }); });
    });
    return out;
  }

  /* ---------- Voices ---------- */
  function englishVoices() {
    var v = []; try { v = synth.getVoices() || []; } catch (e) {}
    var lang = (document.documentElement.lang || "en").slice(0, 2).toLowerCase();
    var mine = v.filter(function (x) { return (x.lang || "").slice(0, 2).toLowerCase() === lang; });
    return mine.length ? mine : v;
  }
  function bestVoice(list) {
    if (prefs.voice) for (var i = 0; i < list.length; i++) if (list[i].name === prefs.voice) return list[i];
    var rank = [/natural/i, /online/i, /premium|enhanced/i, /google/i, /samantha|aria|jenny|ava|allison|karen|serena|moira|daniel/i];
    for (var r = 0; r < rank.length; r++) for (var j = 0; j < list.length; j++) if (rank[r].test(list[j].name)) return list[j];
    for (var k = 0; k < list.length; k++) if (list[k]["default"]) return list[k];
    return list[0] || null;
  }
  function fillVoices() {
    if (!els.voice) return;
    var list = englishVoices(), chosen = bestVoice(list);
    els.voice.innerHTML = "";
    if (!list.length) { var o = document.createElement("option"); o.textContent = "Default voice"; o.value = ""; els.voice.appendChild(o); return; }
    list.forEach(function (v) {
      var o = document.createElement("option");
      o.value = v.name; o.textContent = v.name.replace(/^Microsoft |^Google /, "") + " (" + v.lang + ")";
      if (chosen && v.name === chosen.name) o.selected = true;
      els.voice.appendChild(o);
    });
  }

  /* ---------- Playback ---------- */
  function mark(el) {
    if (current && current !== el) current.classList.remove("listen-current");
    current = el;
    if (!el) return;
    el.classList.add("listen-current");
    var r = el.getBoundingClientRect(), h = window.innerHeight || 800;
    if (r.top < 80 || r.bottom > h - 120) {
      var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
    }
  }
  function status() {
    if (!els.status) return;
    var sections = 0, at = 0, last = null;
    chunks.forEach(function (c, i) { if (c.el !== last) { sections++; last = c.el; } if (i === idx) at = sections; });
    els.status.textContent = !chunks.length ? "Nothing to read on this page."
      : (playing ? "Reading " : (idx > 0 ? "Paused at " : "Ready: ")) + "part " + Math.max(1, at) + " of " + sections;
    els.play.textContent = playing ? "Pause" : (idx > 0 ? "Resume" : "Play");
    els.play.setAttribute("aria-label", playing ? "Pause reading" : (idx > 0 ? "Resume reading" : "Read this page aloud"));
    els.play.classList.toggle("is-playing", playing);
  }
  function speak() {
    var my = ++token;
    if (idx >= chunks.length) { stop(); return; }
    var c = chunks[idx];
    mark(c.el);
    var u = new SpeechSynthesisUtterance(c.text);
    u.lang = document.documentElement.lang || "en";
    u.rate = prefs.rate;
    var v = bestVoice(englishVoices()); if (v) u.voice = v;
    u.onend = function () { if (my !== token || !playing) return; idx++; speak(); };
    u.onerror = function (e) {
      if (my !== token) return;
      if (e && (e.error === "interrupted" || e.error === "canceled")) { if (playing) { playing = false; status(); } return; }
      idx++; if (playing) speak();
    };
    status();
    synth.speak(u);
  }
  function startIndexFromSelection() {
    try {
      var s = window.getSelection();
      if (!s || s.isCollapsed || !s.toString().trim()) return -1;
      var node = s.anchorNode && (s.anchorNode.nodeType === 1 ? s.anchorNode : s.anchorNode.parentElement);
      for (var i = 0; i < chunks.length; i++) if (chunks[i].el === node || chunks[i].el.contains(node) || (node && node.contains(chunks[i].el))) return i;
    } catch (e) {}
    return -1;
  }
  function play() {
    if (!chunks.length || idx >= chunks.length) { chunks = collect(); idx = 0; }
    var sel = startIndexFromSelection(); if (sel >= 0) idx = sel;
    if (!chunks.length) { status(); return; }
    synth.cancel(); // stop any other narration on the page (e.g. a video player)
    playing = true;
    setTimeout(speak, 60); // Safari needs a beat after cancel()
  }
  function pause() { playing = false; token++; synth.cancel(); status(); }
  function stop() { playing = false; token++; synth.cancel(); idx = 0; mark(null); chunks = []; status(); }
  function jump(dir) {
    if (!chunks.length) { chunks = collect(); idx = 0; }
    if (!chunks.length) return;
    var el = chunks[Math.min(idx, chunks.length - 1)].el, i = idx;
    if (dir > 0) { while (i < chunks.length && chunks[i].el === el) i++; }
    else {
      while (i > 0 && chunks[i - 1].el === el) i--;          // start of this part
      if (i > 0) { var prev = chunks[i - 1].el; i--; while (i > 0 && chunks[i - 1].el === prev) i--; }
    }
    idx = Math.max(0, Math.min(i, chunks.length - 1));
    if (playing) { token++; synth.cancel(); setTimeout(speak, 60); } else { mark(chunks[idx].el); status(); }
  }

  /* ---------- UI ---------- */
  function button(cls, text, label, fn) {
    var b = document.createElement("button");
    b.type = "button"; b.className = cls; b.textContent = text; b.setAttribute("aria-label", label); b.title = label;
    b.addEventListener("click", fn); return b;
  }
  function build() {
    launcher = button("listen-ui listen-launch", "Listen", "Listen to this page", open);
    launcher.insertAdjacentHTML("afterbegin", '<span class="listen-ico" aria-hidden="true"></span>');
    launcher.setAttribute("aria-expanded", "false");
    launcher.setAttribute("aria-controls", "listen-panel");

    ui = document.createElement("div");
    ui.id = "listen-panel"; ui.className = "listen-ui listen-panel"; ui.hidden = true;
    ui.setAttribute("role", "region"); ui.setAttribute("aria-label", "Listen to this page");

    var row = document.createElement("div"); row.className = "listen-row";
    els.prev = button("listen-btn", "‹ Back", "Previous part", function () { jump(-1); });
    els.play = button("listen-btn listen-play", "Play", "Read this page aloud", function () { playing ? pause() : play(); });
    els.next = button("listen-btn", "Next ›", "Next part", function () { jump(1); });
    els.stop = button("listen-btn", "Stop", "Stop and go back to the start", stop);
    els.close = button("listen-btn listen-close", "×", "Close the listen player", close);
    [els.prev, els.play, els.next, els.stop, els.close].forEach(function (b) { row.appendChild(b); });

    var opts = document.createElement("div"); opts.className = "listen-row listen-opts";
    var rl = document.createElement("label"); rl.textContent = "Speed ";
    els.rate = document.createElement("select");
    [0.8, 0.9, 1, 1.15, 1.3, 1.5].forEach(function (r) {
      var o = document.createElement("option"); o.value = r; o.textContent = r + "×"; if (r === Number(prefs.rate)) o.selected = true; els.rate.appendChild(o);
    });
    els.rate.addEventListener("change", function () { prefs.rate = Number(els.rate.value); savePrefs(); if (playing) { token++; synth.cancel(); setTimeout(speak, 60); } });
    rl.appendChild(els.rate);
    var vl = document.createElement("label"); vl.textContent = "Voice ";
    els.voice = document.createElement("select");
    els.voice.addEventListener("change", function () { prefs.voice = els.voice.value; savePrefs(); if (playing) { token++; synth.cancel(); setTimeout(speak, 60); } });
    vl.appendChild(els.voice);
    opts.appendChild(rl); opts.appendChild(vl);

    els.status = document.createElement("p");
    els.status.className = "listen-status"; els.status.setAttribute("aria-live", "polite");

    ui.appendChild(row); ui.appendChild(opts); ui.appendChild(els.status);
    ui.addEventListener("keydown", function (e) { if (e.key === "Escape") { stop(); close(); } });

    document.body.appendChild(launcher);
    document.body.appendChild(ui);
    fillVoices();
    if (typeof synth.addEventListener === "function") synth.addEventListener("voiceschanged", fillVoices);
    else synth.onvoiceschanged = fillVoices;

    document.addEventListener("click", function (e) {
      var t = e.target.closest && e.target.closest("[data-listen]");
      if (t && !t.closest(".listen-ui")) { e.preventDefault(); open(); play(); }
    });
    window.addEventListener("pagehide", function () { synth.cancel(); });
    status();
  }
  function open() {
    ui.hidden = false; launcher.hidden = true; launcher.setAttribute("aria-expanded", "true");
    fillVoices(); status(); els.play.focus();
  }
  function close() {
    stop(); ui.hidden = true; launcher.hidden = false; launcher.setAttribute("aria-expanded", "false"); launcher.focus();
  }

  window.PortfolioListen = {
    open: function () { if (ui) open(); },
    toggle: function () { if (!ui) return; if (ui.hidden) { open(); play(); } else if (playing) pause(); else play(); },
    play: function () { if (!ui) return; open(); play(); }, pause: pause, stop: stop
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
})();
