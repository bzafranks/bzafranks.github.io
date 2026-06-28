/* =====================================================================
   Culture by Design — interactivity engine
   Loads AFTER the shared portfolio.js. Adds:
     • Dark mode  • Command palette (Ctrl/⌘+K) + FAB  • Toasts
     • Culture Health Assessment (9 dimensions → Culture Health Score)
     • Recognition feed + Teacher-Voice feed (add, persist)
     • Leadership action planner + reflection journal (saved)
     • Culture-action generator + gauges/bars/drill
   Grounded in doctoral research on leadership behaviors influencing teacher
   retention (trust, communication, recognition, voice, psychological safety).
   Culture surveys & scenarios are illustrative. Storage is localStorage.
   ===================================================================== */
(function () {
  "use strict";
  var LS = { get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  var KEY = { theme: "cbd:theme", culture: "cbd:culture", recognition: "cbd:recognition", voice: "cbd:voice", plan: "cbd:plan", journal: "cbd:journal" };

  var DIMS = [
    { id: "trust", name: "Trust", ico: "🤝" },
    { id: "communication", name: "Communication", ico: "💬" },
    { id: "collaboration", name: "Collaboration", ico: "👥" },
    { id: "leadership", name: "Leadership Effectiveness", ico: "🧭" },
    { id: "engagement", name: "Teacher Engagement", ico: "🔥" },
    { id: "belonging", name: "Belonging", ico: "💗" },
    { id: "safety", name: "Psychological Safety", ico: "🛡️" },
    { id: "innovation", name: "Innovation Culture", ico: "💡" },
    { id: "growth", name: "Professional Growth", ico: "📈" }
  ];

  var TOOLS = [
    { name: "Culture Framework",       ico: "🧭", url: "framework.html",          desc: "Six culture domains", group: "Framework" },
    { name: "Culture Assessment",      ico: "🩺", url: "culture-assessment.html", desc: "Culture Health Score", group: "Diagnose" },
    { name: "Trust & Safety",          ico: "🛡️", url: "trust.html",              desc: "Build relational trust", group: "Build" },
    { name: "Teacher Voice",           ico: "🗣️", url: "teacher-voice.html",      desc: "Shared decisions", group: "Build" },
    { name: "Recognition & Belonging", ico: "🏅", url: "recognition.html",        desc: "Celebrate & include", group: "Build" },
    { name: "Collaboration & Community",ico: "👥", url: "collaboration.html",     desc: "PLCs & partnerships", group: "Build" },
    { name: "Culture Analytics",       ico: "📊", url: "analytics.html",          desc: "Culture dashboards", group: "Insight" },
    { name: "Leadership Action Planner",ico: "🗺️", url: "action-planner.html",   desc: "90-day culture plan", group: "Act" },
    { name: "Resources",               ico: "📂", url: "resources.html",          desc: "Tools & templates", group: "Insight" }
  ];

  document.addEventListener("DOMContentLoaded", function () {
    initTheme(); buildChrome(); initThemeToggle();
    initAssessment(); initFeeds(); initSavedForms(); initJournal(); initGenerators();
    initGauges(); initBars(); initCountUp(); initDrilldowns(); renderRailActive();
  });

  function initTheme() { if (LS.get(KEY.theme, "light") === "dark") document.body.classList.add("cbd-dark"); }
  function initThemeToggle() {
    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) { sync(b); b.addEventListener("click", function () { document.body.classList.toggle("cbd-dark"); var d = document.body.classList.contains("cbd-dark"); LS.set(KEY.theme, d ? "dark" : "light"); document.querySelectorAll("[data-theme-toggle]").forEach(sync); toast(d ? "🌙 Dark mode on" : "☀️ Light mode on", "info"); }); });
    function sync(b) { b.textContent = document.body.classList.contains("cbd-dark") ? "☀️" : "🌙"; }
  }

  function buildChrome() {
    if (document.querySelector("[data-no-chrome]")) return;
    if (!document.querySelector(".toast-wrap")) { var tw = document.createElement("div"); tw.className = "toast-wrap"; document.body.appendChild(tw); }
    if (!document.querySelector(".fab")) { var f = document.createElement("button"); f.className = "fab"; f.type = "button"; f.title = "Command palette (Ctrl/⌘ + K)"; f.setAttribute("aria-label", "Command palette"); f.textContent = "💗"; f.addEventListener("click", openPalette); document.body.appendChild(f); }
    if (!document.querySelector(".cmdk")) { var ov = document.createElement("div"); ov.className = "cmdk"; ov.innerHTML = '<div class="cmdk-box" role="dialog" aria-label="Command palette"><input class="cmdk-input" type="text" placeholder="Jump to a tool…" aria-label="Command search"><div class="cmdk-list"></div></div>'; document.body.appendChild(ov); ov.addEventListener("click", function (e) { if (e.target === ov) closePalette(); }); }
    bindPalette();
    document.addEventListener("keydown", function (e) { if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) { e.preventDefault(); openPalette(); } if (e.key === "Escape") closePalette(); });
  }
  var palIndex = 0, palMatches = [];
  function paletteItems() { var inP = /culture-by-design/.test(location.pathname); var base = inP ? "" : "projects/culture-by-design/"; return TOOLS.map(function (t) { return { ico: t.ico, name: t.name, hint: t.desc, url: base + t.url }; }); }
  function bindPalette() {
    var input = document.querySelector(".cmdk-input"); if (!input) return;
    input.addEventListener("input", function () { renderPalette(input.value); });
    input.addEventListener("keydown", function (e) { if (e.key === "ArrowDown") { e.preventDefault(); palIndex = Math.min(palIndex + 1, palMatches.length - 1); hi(); } else if (e.key === "ArrowUp") { e.preventDefault(); palIndex = Math.max(palIndex - 1, 0); hi(); } else if (e.key === "Enter") { var m = palMatches[palIndex]; if (m) location.href = m.url; } });
    function hi() { var els = document.querySelectorAll(".cmdk-item"); els.forEach(function (el, i) { el.classList.toggle("active", i === palIndex); }); if (els[palIndex]) els[palIndex].scrollIntoView({ block: "nearest" }); }
  }
  function renderPalette(q) { var list = document.querySelector(".cmdk-list"); if (!list) return; q = (q || "").toLowerCase().trim(); var all = paletteItems(); palMatches = !q ? all : all.filter(function (a) { return (a.name + " " + a.hint).toLowerCase().indexOf(q) > -1; }); palIndex = 0; if (!palMatches.length) { list.innerHTML = '<div class="cmdk-empty">No match — try “trust”, “recognition”, or “voice”.</div>'; return; } list.innerHTML = palMatches.map(function (a, i) { return '<a class="cmdk-item' + (i === 0 ? " active" : "") + '" href="' + a.url + '"><span class="ico">' + a.ico + '</span><span>' + a.name + '</span><small>' + a.hint + "</small></a>"; }).join(""); }
  function openPalette() { var ov = document.querySelector(".cmdk"); if (!ov) return; ov.classList.add("open"); renderPalette(""); var i = ov.querySelector(".cmdk-input"); if (i) { i.value = ""; i.focus(); } }
  function closePalette() { var ov = document.querySelector(".cmdk"); if (ov) ov.classList.remove("open"); }

  function toast(msg, kind) { var w = document.querySelector(".toast-wrap"); if (!w) return; var t = document.createElement("div"); t.className = "toast " + (kind || ""); t.textContent = msg; w.appendChild(t); setTimeout(function () { t.style.opacity = "0"; t.style.transition = "opacity .3s"; setTimeout(function () { t.remove(); }, 320); }, 2400); }
  function copyText(text) { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { toast("📋 Copied", "ok"); }, function () { toast("Copy failed", ""); }); else toast("Clipboard unavailable", ""); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function val(d, k, fb) { return d && d[k] ? d[k] : fb; }

  function obsRun(els, fn) { if (!els.length) return; if ("IntersectionObserver" in window) { var o = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { fn(e.target); o.unobserve(e.target); } }); }, { threshold: 0.3 }); els.forEach(function (e) { o.observe(e); }); } else els.forEach(fn); }
  function initGauges() { obsRun(document.querySelectorAll("[data-gauge]"), function (el) { var t = parseFloat(el.getAttribute("data-gauge")) || 0, dur = 1100, start = null, num = el.querySelector("[data-gauge-num]"); function step(ts) { if (!start) start = ts; var p = Math.min((ts - start) / dur, 1); var v = t * (0.5 - Math.cos(p * Math.PI) / 2); el.style.setProperty("--val", v.toFixed(1)); if (num) num.textContent = Math.round(v) + (el.getAttribute("data-gauge-suffix") || ""); if (p < 1) requestAnimationFrame(step); } requestAnimationFrame(step); }); }
  function initBars() { obsRun(document.querySelectorAll(".barlist .fill[data-pct]"), function (el) { var p = el.getAttribute("data-pct"); el.style.width = "0%"; requestAnimationFrame(function () { el.style.transition = "width .9s ease"; el.style.width = p + "%"; }); }); obsRun(document.querySelectorAll(".barchart .bar[data-h]"), function (el) { var h = el.getAttribute("data-h"); el.style.height = "0%"; requestAnimationFrame(function () { el.style.height = h + "%"; }); }); }
  function initCountUp() { obsRun(document.querySelectorAll("[data-count]"), function (el) { var t = parseFloat(el.getAttribute("data-count")), suf = el.getAttribute("data-suffix") || "", pre = el.getAttribute("data-prefix") || "", dur = 1000, start = null; function step(ts) { if (!start) start = ts; var p = Math.min((ts - start) / dur, 1); var v = t * (0.5 - Math.cos(p * Math.PI) / 2); el.textContent = pre + (t % 1 === 0 ? Math.round(v) : v.toFixed(1)) + suf; if (p < 1) requestAnimationFrame(step); } requestAnimationFrame(step); }); }
  function initDrilldowns() { document.querySelectorAll(".drill-row").forEach(function (row) { row.addEventListener("click", function () { var p = row.nextElementSibling; if (p && p.classList.contains("drill-panel")) { row.classList.toggle("open"); p.classList.toggle("open"); } }); }); }

  /* ===================== CULTURE HEALTH ASSESSMENT ===================== */
  function initAssessment() {
    var root = document.querySelector("[data-assessment]"); if (!root) return;
    root.querySelectorAll(".likert").forEach(function (lk) { lk.querySelectorAll("button").forEach(function (b) { b.addEventListener("click", function () { lk.querySelectorAll("button").forEach(function (x) { x.classList.remove("on"); }); b.classList.add("on"); }); }); });
    var btn = root.querySelector("[data-assess-run]"), out = document.querySelector("[data-assess-result]");
    if (btn) btn.addEventListener("click", compute);
    var reset = root.querySelector("[data-assess-reset]"); if (reset) reset.addEventListener("click", function () { root.querySelectorAll(".likert button.on").forEach(function (b) { b.classList.remove("on"); }); if (out) out.classList.remove("show"); LS.set(KEY.culture, null); toast("Assessment reset", "info"); });
    var saved = LS.get(KEY.culture, null); if (saved && out) render(saved);
    function compute() {
      var scores = {}, counts = {}; DIMS.forEach(function (d) { scores[d.id] = 0; counts[d.id] = 0; });
      var answered = 0;
      root.querySelectorAll(".assess-item").forEach(function (item) { var dom = item.getAttribute("data-domain") || "trust"; var on = item.querySelector(".likert button.on"); if (on) { scores[dom] += parseInt(on.getAttribute("data-v") || on.textContent, 10) || 0; counts[dom] += 1; answered++; } });
      if (!answered) { toast("Rate the statements to generate your Culture Health Score", ""); return; }
      var pct = {}; DIMS.forEach(function (d) { pct[d.id] = counts[d.id] ? Math.round((scores[d.id] / (counts[d.id] * 5)) * 100) : 0; });
      var overall = Math.round(DIMS.reduce(function (s, d) { return s + pct[d.id]; }, 0) / DIMS.length);
      var data = { pct: pct, overall: overall }; LS.set(KEY.culture, data); render(data); if (out) out.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    function render(data) {
      if (!out) return;
      var ranked = DIMS.slice().sort(function (a, b) { return data.pct[b.id] - data.pct[a.id]; });
      var band = data.overall >= 80 ? { t: "Thriving Culture", c: "green" } : data.overall >= 65 ? { t: "Healthy — Strengthen", c: "rose" } : data.overall >= 50 ? { t: "Developing", c: "amber" } : { t: "At Risk — Prioritize", c: "red" };
      var bars = DIMS.map(function (d) { return '<div class="row"><span>' + d.ico + " " + d.name + '</span><span class="track"><span class="fill" data-pct="' + data.pct[d.id] + '" style="width:' + data.pct[d.id] + '%"></span></span><b>' + data.pct[d.id] + "%</b></div>"; }).join("");
      out.innerHTML =
        '<div class="assess-card"><h3>Culture Health Score</h3><div style="display:flex;gap:1.6rem;flex-wrap:wrap;align-items:center;">' +
        '<div class="gauge" data-gauge="' + data.overall + '" data-gauge-suffix="%"><div class="hole"><b data-gauge-num>0%</b><small>Culture Health</small></div></div>' +
        '<div style="flex:1;min-width:240px;"><p><span class="tl-pill ' + band.c + '">' + band.t + '</span></p><div class="barlist">' + bars + "</div></div></div></div>" +
        '<div class="assess-card"><h3>🌟 Cultural strengths</h3><ul>' + ranked.slice(0, 2).map(function (d) { return "<li><b>" + d.name + "</b> (" + data.pct[d.id] + "%) — celebrate &amp; build on this.</li>"; }).join("") + "</ul></div>" +
        '<div class="assess-card"><h3>🎯 Growth opportunities &amp; leadership actions</h3><ul>' + ranked.slice(-3).map(function (d) { return "<li><b>" + d.name + "</b> (" + data.pct[d.id] + "%) — " + actionFor(d.id) + "</li>"; }).join("") + '</ul><div class="btn-row" style="margin-top:.6rem;"><a class="btn" href="action-planner.html">Build a 90-Day Culture Plan</a><button class="out-btn" data-assess-reset>Reset</button></div><p class="muted" style="font-size:.85rem;margin-top:.6rem;">Dimension weighting reflects doctoral research on leadership behaviors — trust, communication, recognition, voice, psychological safety — that shape culture and retention.</p></div>';
      out.classList.add("show");
      var r2 = out.querySelector("[data-assess-reset]"); if (r2) r2.addEventListener("click", function () { root.querySelectorAll(".likert button.on").forEach(function (b) { b.classList.remove("on"); }); out.classList.remove("show"); LS.set(KEY.culture, null); window.scrollTo({ top: 0, behavior: "smooth" }); });
      initGauges(); initBars();
    }
    function actionFor(id) { return {
      trust: "build relational trust through consistency &amp; follow-through.",
      communication: "increase transparent, two-way communication.",
      collaboration: "protect time for PLCs &amp; shared planning.",
      leadership: "make leadership visible, supportive, and present.",
      engagement: "connect daily work to purpose; reduce friction.",
      belonging: "ensure every staff member feels seen and included.",
      safety: "make it safe to take risks and speak up.",
      innovation: "create safe space to try, learn, and iterate.",
      growth: "give every educator a visible growth pathway."
    }[id]; }
  }

  /* ===================== FEEDS (recognition / teacher voice) ===================== */
  function feedTracker(sel, key, icon, voice) {
    var box = document.querySelector(sel); if (!box) return;
    var who = box.querySelector("[data-feed-who]"), msg = box.querySelector("[data-feed-msg]"), add = box.querySelector("[data-feed-add]"), listEl = box.querySelector("[data-feed-list]");
    function get() { return LS.get(key, []); }
    function render() {
      var items = get(); if (!listEl) return;
      if (!items.length) { listEl.innerHTML = '<p class="muted">Nothing yet — add the first entry above. Saved privately in this browser.</p>'; return; }
      listEl.innerHTML = items.map(function (e, i) {
        return '<div class="feed-item' + (voice ? " voice" : "") + '"><span class="f-ico">' + icon + '</span><div class="f-body"><b>' + esc(e.who || (voice ? "Idea" : "Recognition")) + "</b><small>" + esc(e.msg) + "</small></div><button class=\"f-del\" data-del=\"" + i + "\" aria-label=\"Remove\">✕</button></div>";
      }).join("");
      listEl.querySelectorAll("[data-del]").forEach(function (b) { b.addEventListener("click", function () { var it = get(); it.splice(parseInt(b.getAttribute("data-del"), 10), 1); LS.set(key, it); render(); }); });
    }
    if (add) add.addEventListener("click", function () { var m = (msg && msg.value || "").trim(); if (!m) { toast("Write something first", ""); return; } var it = get(); it.unshift({ who: who ? who.value.trim() : "", msg: m }); LS.set(key, it); if (who) who.value = ""; if (msg) msg.value = ""; render(); toast(voice ? "🗣️ Idea shared" : "🏅 Recognition posted", "ok"); });
    var clr = box.querySelector("[data-feed-clear]"); if (clr) clr.addEventListener("click", function () { LS.set(key, []); render(); toast("Cleared", "info"); });
    render();
  }
  function initFeeds() { feedTracker("[data-recognition]", KEY.recognition, "🏅", false); feedTracker("[data-voice]", KEY.voice, "💡", true); }

  /* ===================== SAVED PLANNER + JOURNAL ===================== */
  function initSavedForms() {
    var form = document.querySelector("[data-planner]"); if (!form) return;
    var saved = LS.get(KEY.plan, {}); form.querySelectorAll("input[name],textarea[name],select[name]").forEach(function (f) { if (saved[f.name] != null) f.value = saved[f.name]; });
    var note = form.querySelector("[data-plan-saved]");
    function save() { var d = {}; form.querySelectorAll("input[name],textarea[name],select[name]").forEach(function (f) { d[f.name] = f.value; }); LS.set(KEY.plan, d); if (note) { note.textContent = "✓ Saved locally"; setTimeout(function () { note.textContent = ""; }, 2000); } }
    form.addEventListener("submit", function (e) { e.preventDefault(); save(); toast("💾 Culture plan saved", "ok"); });
    form.querySelectorAll("input,textarea,select").forEach(function (f) { f.addEventListener("change", save); });
    var clr = form.querySelector("[data-plan-clear]"); if (clr) clr.addEventListener("click", function () { LS.set(KEY.plan, {}); form.reset(); toast("Plan cleared", "info"); });
  }
  function initJournal() {
    var box = document.querySelector("[data-journal]"); if (!box) return;
    var input = box.querySelector("textarea"), listEl = box.querySelector("[data-journal-list]"), add = box.querySelector("[data-journal-add]");
    function render() { var e = LS.get(KEY.journal, []); if (!listEl) return; listEl.innerHTML = e.length ? e.map(function (x, i) { return '<div class="lib-item"><span class="l-ico">🪞</span><div class="l-body"><b>Note ' + (e.length - i) + "</b><small>" + esc(x) + "</small></div></div>"; }).join("") : '<p class="muted">No entries yet. Saved privately in this browser.</p>'; }
    if (add) add.addEventListener("click", function () { var v = (input.value || "").trim(); if (!v) { toast("Write a note first", ""); return; } var e = LS.get(KEY.journal, []); e.unshift(v); LS.set(KEY.journal, e); input.value = ""; render(); toast("🪞 Saved", "ok"); });
    var clr = box.querySelector("[data-journal-clear]"); if (clr) clr.addEventListener("click", function () { LS.set(KEY.journal, []); render(); toast("Cleared", "info"); });
    render();
  }

  /* ===================== GENERATOR (culture action) ===================== */
  var GEN = {
    culture: { label: "Culture Action Plan", build: function (d) {
      var focus = val(d, "focus", "build trust & psychological safety"), domain = val(d, "domain", "Trust & Relationships");
      return "<h3>90-Day Culture Action Plan</h3><p class='muted'>Focus domain: " + esc(domain) + " · " + esc(focus) + "</p>" +
        "<h4>Days 1–30 — Listen &amp; Model</h4><ul><li>Culture pulse survey + listening sessions.</li><li>Model the behavior you want to see (visibility, transparency).</li></ul>" +
        "<h4>Days 31–60 — Act on the Highest-Leverage Domain</h4><ul><li>Launch an authentic recognition routine.</li><li>Open a teacher-voice channel and act visibly on one input.</li><li>Protect time for collaboration.</li></ul>" +
        "<h4>Days 61–90 — Embed &amp; Celebrate</h4><ul><li>Build the practice into routines &amp; meetings.</li><li>Re-survey; share progress; celebrate wins.</li></ul>" +
        "<h4>Leadership behaviors to model</h4><ul><li>Trust, communication, recognition, voice, psychological safety — the behaviors most tied to culture &amp; retention.</li></ul>" +
        "<p class='muted' style='font-size:.85rem;'><span class='ai-pill'>Research-informed</span> Reflects doctoral findings on leadership behaviors that shape culture &amp; teacher retention. Adapt to your context.</p>";
    }}
  };
  function initGenerators() {
    document.querySelectorAll("[data-generator]").forEach(function (form) {
      var type = form.getAttribute("data-generator"); if (!GEN[type]) return;
      var out = document.querySelector('[data-output="' + type + '"]') || form.parentElement.querySelector(".gen-output"); var last = null;
      form.addEventListener("submit", function (e) { e.preventDefault(); last = collect(form); run(type, last, out); });
      if (out) out.addEventListener("click", function (e) { var b = e.target.closest("[data-act]"); if (!b) return; var act = b.getAttribute("data-act"); var body = out.querySelector(".out-body"); if (act === "copy") copyText(body ? body.innerText : ""); else if (act === "print") window.print(); else if (act === "regen") run(type, last || collect(form), out); });
    });
  }
  function collect(form) { var d = {}; form.querySelectorAll("input[name],select[name],textarea[name]").forEach(function (f) { d[f.name] = f.value; }); return d; }
  function run(type, data, out) { if (!out) return; var body = out.querySelector(".out-body"); if (body) body.innerHTML = '<p class="muted">✨ Drafting…</p>'; setTimeout(function () { if (body) body.innerHTML = GEN[type].build(data); toast("Draft ready — adapt to your context", "ok"); }, 500); }

  function renderRailActive() { var here = location.pathname.split("/").pop() || "framework.html"; document.querySelectorAll(".rail-link").forEach(function (a) { if (a.getAttribute("href") === here) a.classList.add("active"); }); }
  window.CBD = { toast: toast, copy: copyText };
})();
