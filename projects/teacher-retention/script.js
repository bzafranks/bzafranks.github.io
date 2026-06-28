/* =====================================================================
   Teacher Retention & Workforce Excellence System — interactivity engine
   Loads AFTER the shared portfolio.js. Adds:
     • Dark mode  • Command palette (Ctrl/⌘+K) + FAB  • Toasts
     • Retention Leadership Pulse (self-assessment → profile + plan)
     • Retention-Risk Calculator (factors → risk band + recommendations)
     • Leadership Action Planner + reflection journal (saved locally)
     • Retention-plan / intervention generators + gauges/bars/drill
   Grounded in doctoral research on leadership behaviors influencing
   teacher retention. School data & scenarios are illustrative.
   Storage is localStorage; nothing leaves the browser.
   ===================================================================== */
(function () {
  "use strict";
  var LS = { get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  var KEY = { theme: "trw:theme", pulse: "trw:pulse", plan: "trw:plan", journal: "trw:journal" };

  var PILLARS = [
    { id: "leadership", name: "Transformational Leadership", ico: "🌟" },
    { id: "trust", name: "Trust & Psychological Safety", ico: "🛡️" },
    { id: "recognition", name: "Recognition & Engagement", ico: "🏅" },
    { id: "growth", name: "Professional Growth", ico: "📈" },
    { id: "voice", name: "Teacher Voice", ico: "🗣️" },
    { id: "workload", name: "Workload & Wellbeing", ico: "⚖️" }
  ];

  var TOOLS = [
    { name: "Retention Framework",     ico: "🧩", url: "framework.html",            desc: "Ten retention pillars", group: "Framework" },
    { name: "Dissertation Research",   ico: "🎓", url: "research.html",             desc: "The research base", group: "Framework" },
    { name: "Leadership Behaviors",    ico: "🤝", url: "leadership-behaviors.html", desc: "What leaders do", group: "Leadership" },
    { name: "Teacher Wellbeing",       ico: "💚", url: "teacher-wellbeing.html",    desc: "Balance & burnout", group: "Leadership" },
    { name: "Teacher Voice",           ico: "🗣️", url: "teacher-voice.html",        desc: "Shared decisions", group: "Leadership" },
    { name: "Recognition & Engagement",ico: "🏅", url: "recognition.html",          desc: "Celebrate & engage", group: "Leadership" },
    { name: "Professional Growth",     ico: "📈", url: "professional-growth.html",  desc: "Develop & advance", group: "Leadership" },
    { name: "Retention Analytics",     ico: "📊", url: "analytics.html",            desc: "People analytics", group: "Insight" },
    { name: "Early Warning Dashboard", ico: "🚨", url: "early-warning.html",        desc: "Predict & prevent", group: "Insight" },
    { name: "Action Planner",          ico: "🗺️", url: "action-planner.html",      desc: "90-day retention plan", group: "Act" },
    { name: "Resources",               ico: "📂", url: "resources.html",            desc: "Tools & templates", group: "Act" }
  ];

  document.addEventListener("DOMContentLoaded", function () {
    initTheme(); buildChrome(); initThemeToggle();
    initPulse(); initRiskCalc(); initPlanner(); initJournal();
    initGenerators(); initGauges(); initBars(); initCountUp(); initDrilldowns(); initPillarToggles();
    renderRailActive();
  });

  function initTheme() { if (LS.get(KEY.theme, "light") === "dark") document.body.classList.add("trw-dark"); }
  function initThemeToggle() {
    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) { sync(b); b.addEventListener("click", function () { document.body.classList.toggle("trw-dark"); var d = document.body.classList.contains("trw-dark"); LS.set(KEY.theme, d ? "dark" : "light"); document.querySelectorAll("[data-theme-toggle]").forEach(sync); toast(d ? "🌙 Dark mode on" : "☀️ Light mode on", "info"); }); });
    function sync(b) { b.textContent = document.body.classList.contains("trw-dark") ? "☀️" : "🌙"; }
  }

  function buildChrome() {
    if (document.querySelector("[data-no-chrome]")) return;
    if (!document.querySelector(".toast-wrap")) { var tw = document.createElement("div"); tw.className = "toast-wrap"; document.body.appendChild(tw); }
    if (!document.querySelector(".fab")) { var f = document.createElement("button"); f.className = "fab"; f.type = "button"; f.title = "Command palette (Ctrl/⌘ + K)"; f.setAttribute("aria-label", "Command palette"); f.textContent = "🧭"; f.addEventListener("click", openPalette); document.body.appendChild(f); }
    if (!document.querySelector(".cmdk")) { var ov = document.createElement("div"); ov.className = "cmdk"; ov.innerHTML = '<div class="cmdk-box" role="dialog" aria-label="Command palette"><input class="cmdk-input" type="text" placeholder="Jump to a tool…" aria-label="Command search"><div class="cmdk-list"></div></div>'; document.body.appendChild(ov); ov.addEventListener("click", function (e) { if (e.target === ov) closePalette(); }); }
    bindPalette();
    document.addEventListener("keydown", function (e) { if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) { e.preventDefault(); openPalette(); } if (e.key === "Escape") closePalette(); });
  }
  var palIndex = 0, palMatches = [];
  function paletteItems() { var inP = /teacher-retention/.test(location.pathname); var base = inP ? "" : "projects/teacher-retention/"; return TOOLS.map(function (t) { return { ico: t.ico, name: t.name, hint: t.desc, url: base + t.url }; }); }
  function bindPalette() {
    var input = document.querySelector(".cmdk-input"); if (!input) return;
    input.addEventListener("input", function () { renderPalette(input.value); });
    input.addEventListener("keydown", function (e) { if (e.key === "ArrowDown") { e.preventDefault(); palIndex = Math.min(palIndex + 1, palMatches.length - 1); hi(); } else if (e.key === "ArrowUp") { e.preventDefault(); palIndex = Math.max(palIndex - 1, 0); hi(); } else if (e.key === "Enter") { var m = palMatches[palIndex]; if (m) location.href = m.url; } });
    function hi() { var els = document.querySelectorAll(".cmdk-item"); els.forEach(function (el, i) { el.classList.toggle("active", i === palIndex); }); if (els[palIndex]) els[palIndex].scrollIntoView({ block: "nearest" }); }
  }
  function renderPalette(q) { var list = document.querySelector(".cmdk-list"); if (!list) return; q = (q || "").toLowerCase().trim(); var all = paletteItems(); palMatches = !q ? all : all.filter(function (a) { return (a.name + " " + a.hint).toLowerCase().indexOf(q) > -1; }); palIndex = 0; if (!palMatches.length) { list.innerHTML = '<div class="cmdk-empty">No match — try “research”, “voice”, or “early warning”.</div>'; return; } list.innerHTML = palMatches.map(function (a, i) { return '<a class="cmdk-item' + (i === 0 ? " active" : "") + '" href="' + a.url + '"><span class="ico">' + a.ico + '</span><span>' + a.name + '</span><small>' + a.hint + "</small></a>"; }).join(""); }
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
  function initPillarToggles() { document.querySelectorAll(".pillar-card[data-expand]").forEach(function (c) { c.addEventListener("click", function () { var l = c.querySelector(".p-link"); if (l) l.classList.toggle("open"); }); }); }

  /* ===================== RETENTION LEADERSHIP PULSE ===================== */
  function initPulse() {
    var root = document.querySelector("[data-assessment]"); if (!root) return;
    root.querySelectorAll(".likert").forEach(function (lk) { lk.querySelectorAll("button").forEach(function (b) { b.addEventListener("click", function () { lk.querySelectorAll("button").forEach(function (x) { x.classList.remove("on"); }); b.classList.add("on"); }); }); });
    var btn = root.querySelector("[data-assess-run]"), out = document.querySelector("[data-assess-result]");
    if (btn) btn.addEventListener("click", compute);
    var reset = root.querySelector("[data-assess-reset]"); if (reset) reset.addEventListener("click", function () { root.querySelectorAll(".likert button.on").forEach(function (b) { b.classList.remove("on"); }); if (out) out.classList.remove("show"); LS.set(KEY.pulse, null); toast("Pulse reset", "info"); });
    var saved = LS.get(KEY.pulse, null); if (saved && out) render(saved);

    function compute() {
      var scores = {}, counts = {}; PILLARS.forEach(function (d) { scores[d.id] = 0; counts[d.id] = 0; });
      var totalItems = root.querySelectorAll(".assess-item").length, answered = 0;
      root.querySelectorAll(".assess-item").forEach(function (item) { var dom = item.getAttribute("data-domain") || "leadership"; var on = item.querySelector(".likert button.on"); if (on) { scores[dom] += parseInt(on.getAttribute("data-v") || on.textContent, 10) || 0; counts[dom] += 1; answered++; } });
      if (!answered) { toast("Answer the statements to see your pulse", ""); return; }
      var pct = {}; PILLARS.forEach(function (d) { pct[d.id] = counts[d.id] ? Math.round((scores[d.id] / (counts[d.id] * 5)) * 100) : 0; });
      var overall = Math.round(PILLARS.reduce(function (s, d) { return s + pct[d.id]; }, 0) / PILLARS.length);
      var data = { pct: pct, overall: overall }; LS.set(KEY.pulse, data); render(data);
      if (out) out.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    function render(data) {
      if (!out) return;
      var ranked = PILLARS.slice().sort(function (a, b) { return data.pct[b.id] - data.pct[a.id]; });
      var band = data.overall >= 80 ? { t: "High-Retention Leadership", c: "green" } : data.overall >= 65 ? { t: "Strengthening", c: "gold" } : data.overall >= 50 ? { t: "Developing", c: "amber" } : { t: "At Risk — Prioritize", c: "red" };
      var bars = PILLARS.map(function (d) { return '<div class="row"><span>' + d.ico + " " + d.name + '</span><span class="track"><span class="fill" data-pct="' + data.pct[d.id] + '" style="width:' + data.pct[d.id] + '%"></span></span><b>' + data.pct[d.id] + "%</b></div>"; }).join("");
      var growth = ranked.slice(-2).map(function (d) { return "<li>" + recFor(d.id) + "</li>"; }).join("");
      out.innerHTML =
        '<div class="assess-card"><h3>Your Retention-Leadership Pulse</h3><div style="display:flex;gap:1.6rem;flex-wrap:wrap;align-items:center;">' +
        '<div class="gauge" data-gauge="' + data.overall + '" data-gauge-suffix="%"><div class="hole"><b data-gauge-num>0%</b><small>Retention-leadership index</small></div></div>' +
        '<div style="flex:1;min-width:240px;"><p><span class="tl-pill ' + band.c + '">' + band.t + '</span></p><div class="barlist">' + bars + "</div></div></div></div>" +
        '<div class="assess-card"><h3>🌟 Strengths to leverage</h3><ul>' + ranked.slice(0, 2).map(function (d) { return "<li><b>" + d.name + "</b> (" + data.pct[d.id] + "%)</li>"; }).join("") + "</ul></div>" +
        '<div class="assess-card"><h3>🎯 Highest-leverage moves for retention</h3><ul>' + growth + '</ul><div class="btn-row" style="margin-top:.6rem;"><a class="btn" href="action-planner.html">Build a 90-Day Plan</a><button class="out-btn" data-assess-reset>Reset</button></div>' +
        '<p class="illustrative" style="margin-top:.6rem;">Pillar weighting reflects doctoral research on leadership behaviors that influence teacher retention. A reflective tool.</p></div>';
      out.classList.add("show");
      var r2 = out.querySelector("[data-assess-reset]"); if (r2) r2.addEventListener("click", function () { root.querySelectorAll(".likert button.on").forEach(function (b) { b.classList.remove("on"); }); out.classList.remove("show"); LS.set(KEY.pulse, null); window.scrollTo({ top: 0, behavior: "smooth" }); });
      initGauges(); initBars();
    }
    function recFor(id) { return {
      leadership: "Transformational Leadership: model the vision, individualized support, and intellectual stimulation in weekly interactions.",
      trust: "Trust & Psychological Safety: make it safe to take risks and speak up — the foundation of staying.",
      recognition: "Recognition & Engagement: build authentic, frequent recognition into your leadership routine.",
      growth: "Professional Growth: give every teacher a visible growth pathway and coaching.",
      voice: "Teacher Voice: create real channels for shared decision-making and act on input.",
      workload: "Workload & Wellbeing: audit and reduce low-value tasks; protect time to prevent burnout."
    }[id]; }
  }

  /* ===================== RETENTION-RISK CALCULATOR ===================== */
  function initRiskCalc() {
    var root = document.querySelector("[data-riskcalc]"); if (!root) return;
    var btn = root.querySelector("[data-riskcalc-run]"), out = document.querySelector("[data-riskcalc-result]");
    if (btn) btn.addEventListener("click", function () {
      var factors = root.querySelectorAll("[data-factor]"); var total = 0, n = 0, weak = [];
      factors.forEach(function (f) { var v = parseInt(f.value, 10); if (!isNaN(v)) { total += v; n++; if (v <= 2) weak.push(f.getAttribute("data-factor")); } });
      if (!n) return;
      var score = Math.round((total / (n * 5)) * 100); // higher = healthier
      var band = score >= 75 ? { t: "Low risk", c: "low" } : score >= 55 ? { t: "Moderate risk", c: "med" } : { t: "Elevated risk", c: "high" };
      var recMap = { engagement: "Re-engage with a stay-conversation and a meaningful role.", recognition: "Add specific, timely recognition.", workload: "Reduce non-essential workload; protect planning time.", growth: "Offer a concrete growth/leadership opportunity.", voice: "Invite into a decision that affects them; act on it.", support: "Increase instructional & emotional support; check in weekly." };
      var recs = (weak.length ? weak : ["support"]).map(function (k) { return "<li>" + (recMap[k] || "Provide targeted support.") + "</li>"; }).join("");
      if (out) { out.innerHTML = '<div class="r-top" style="display:flex;gap:.6rem;align-items:center;margin-bottom:.4rem;"><b>Retention health: ' + score + '%</b> <span class="risk-band ' + band.c + '">' + band.t + '</span></div>' +
        '<p class="muted">Lower scores on individual factors flag where proactive, leadership-led intervention matters most.</p>' +
        '<p><b>Recommended proactive moves:</b></p><ul>' + recs + '</ul>' +
        '<p class="illustrative"><span class="ai-pill">Decision-support</span> A reflective, illustrative model — not a verdict on any individual. Pair with stay-conversations and professional judgment.</p>';
        out.classList.add("show"); }
      toast("Risk profile generated", "ok");
    });
  }

  /* ===================== ACTION PLANNER + JOURNAL (saved) ===================== */
  function initPlanner() {
    var form = document.querySelector("[data-planner]"); if (!form) return;
    var saved = LS.get(KEY.plan, {}); form.querySelectorAll("input[name],textarea[name],select[name]").forEach(function (f) { if (saved[f.name] != null) f.value = saved[f.name]; });
    var note = form.querySelector("[data-plan-saved]");
    function save() { var d = {}; form.querySelectorAll("input[name],textarea[name],select[name]").forEach(function (f) { d[f.name] = f.value; }); LS.set(KEY.plan, d); if (note) { note.textContent = "✓ Saved locally"; setTimeout(function () { note.textContent = ""; }, 2000); } }
    form.addEventListener("submit", function (e) { e.preventDefault(); save(); toast("💾 Retention action plan saved", "ok"); });
    form.querySelectorAll("input,textarea,select").forEach(function (f) { f.addEventListener("change", save); });
    var clr = form.querySelector("[data-plan-clear]"); if (clr) clr.addEventListener("click", function () { LS.set(KEY.plan, {}); form.reset(); toast("Plan cleared", "info"); });
  }
  function initJournal() {
    var box = document.querySelector("[data-journal]"); if (!box) return;
    var input = box.querySelector("textarea"), listEl = box.querySelector("[data-journal-list]"), add = box.querySelector("[data-journal-add]");
    function render() { var e = LS.get(KEY.journal, []); if (!listEl) return; listEl.innerHTML = e.length ? e.map(function (x, i) { return '<div class="lib-item"><span class="l-ico">🪞</span><div class="l-body"><b>Entry ' + (e.length - i) + "</b><small>" + esc(x) + "</small></div></div>"; }).join("") : '<p class="muted">No entries yet. Saved privately in this browser.</p>'; }
    if (add) add.addEventListener("click", function () { var v = (input.value || "").trim(); if (!v) { toast("Write a note first", ""); return; } var e = LS.get(KEY.journal, []); e.unshift(v); LS.set(KEY.journal, e); input.value = ""; render(); toast("🪞 Saved", "ok"); });
    var clr = box.querySelector("[data-journal-clear]"); if (clr) clr.addEventListener("click", function () { LS.set(KEY.journal, []); render(); toast("Journal cleared", "info"); });
    render();
  }

  /* ===================== GENERATORS ===================== */
  var GEN = {
    retention: { label: "90-Day Retention Plan", build: function (d) {
      var focus = val(d, "focus", "recognition & teacher voice"), school = val(d, "school", "our school");
      return "<h3>90-Day Teacher Retention Plan</h3><p class='muted'>" + esc(school) + " · focus: " + esc(focus) + "</p>" +
        "<h4>Days 1–30 — Listen &amp; Baseline</h4><ul><li>Run a staff pulse survey + stay-conversations with key teachers.</li><li>Review engagement, workload, and turnover signals.</li></ul>" +
        "<h4>Days 31–60 — Act on the Highest-Leverage Pillars</h4><ul><li>Launch an authentic recognition routine.</li><li>Open a teacher-voice channel and act visibly on one input.</li><li>Reduce one low-value workload demand.</li></ul>" +
        "<h4>Days 61–90 — Embed &amp; Measure</h4><ul><li>Coach &amp; grow: give each teacher a visible growth step.</li><li>Re-survey; compare engagement to baseline; celebrate wins.</li></ul>" +
        "<h4>Leadership Behaviors to Model</h4><ul><li>Trust, recognition, voice, support — the behaviors most linked to retention.</li></ul>" +
        "<p class='illustrative'><span class='ai-pill'>Research-informed</span> Reflects doctoral findings on leadership behaviors influencing teacher retention. Adapt to your context.</p>";
    }},
    intervention: { label: "Proactive Retention Intervention", build: function (d) {
      var signal = val(d, "signal", "declining engagement");
      return "<h3>Proactive Retention Intervention</h3><p class='muted'>Early signal: " + esc(signal) + "</p>" +
        "<h4>Step 1 — Connect</h4><p>Schedule a supportive stay-conversation; listen first.</p>" +
        "<h4>Step 2 — Diagnose with the teacher</h4><p>Which pillar is weakest — recognition, workload, growth, voice, support?</p>" +
        "<h4>Step 3 — Co-design support</h4><p>Agree on one meaningful, concrete change and a check-in date.</p>" +
        "<h4>Step 4 — Follow through</h4><p>Deliver the change; revisit in 2–3 weeks; document progress.</p>" +
        "<p class='illustrative'>Supportive, not surveillance. Illustrative template.</p>";
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
  window.TRW = { toast: toast, copy: copyText };
})();
