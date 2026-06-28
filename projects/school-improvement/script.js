/* =====================================================================
   School Improvement Operating System — interactivity engine
   Loads AFTER the shared portfolio.js. Adds:
     • Dark mode  • Command palette (Ctrl/⌘+K) + FAB  • Toasts
     • School Diagnostic → School Health Index (scored, saved)
     • SWOT builder + strategic/action planners + reflection journal (saved)
     • Improvement-plan generator + gauges/bars/count-up/drill-downs
   Research-informed; school scenarios are illustrative.
   Storage is localStorage; nothing leaves the browser.
   ===================================================================== */
(function () {
  "use strict";
  var LS = { get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  var KEY = { theme: "sis:theme", diag: "sis:diagnostic", swot: "sis:swot", plan: "sis:plan", action: "sis:action", journal: "sis:journal" };

  var DOMAINS = [
    { id: "vision", name: "Vision & Strategic Direction", ico: "🧭" },
    { id: "teaching", name: "Teaching & Learning", ico: "📚" },
    { id: "people", name: "People & Leadership", ico: "🤝" },
    { id: "culture", name: "Culture & Community", ico: "🌍" },
    { id: "operations", name: "Operations & Resources", ico: "🏛️" },
    { id: "performance", name: "Performance & Accountability", ico: "📊" }
  ];

  var TOOLS = [
    { name: "Improvement Framework",  ico: "🧭", url: "framework.html",               desc: "Six improvement domains", group: "Framework" },
    { name: "School Diagnostic",      ico: "🩺", url: "school-diagnostic.html",        desc: "School Health Index", group: "Diagnose" },
    { name: "Strategic Planning",     ico: "🎯", url: "strategic-planning.html",       desc: "Vision → strategy", group: "Plan" },
    { name: "Action Planning",        ico: "🗺️", url: "action-planning.html",          desc: "Initiatives & owners", group: "Plan" },
    { name: "Data & Performance",     ico: "📈", url: "performance.html",              desc: "Performance dashboards", group: "Monitor" },
    { name: "Monitoring & Evaluation",ico: "🔎", url: "monitoring.html",               desc: "Reviews & evidence", group: "Monitor" },
    { name: "Continuous Improvement", ico: "🔄", url: "continuous-improvement.html",   desc: "The improvement cycle", group: "Monitor" },
    { name: "Leadership Dashboard",   ico: "📊", url: "dashboard.html",                desc: "Executive overview", group: "Insight" },
    { name: "Resources",              ico: "📂", url: "resources.html",                desc: "Tools & templates", group: "Insight" }
  ];

  document.addEventListener("DOMContentLoaded", function () {
    initTheme(); buildChrome(); initThemeToggle();
    initDiagnostic(); initSavedForms(); initJournal(); initGenerators();
    initGauges(); initBars(); initCountUp(); initDrilldowns(); renderRailActive();
  });

  function initTheme() { if (LS.get(KEY.theme, "light") === "dark") document.body.classList.add("sis-dark"); }
  function initThemeToggle() {
    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) { sync(b); b.addEventListener("click", function () { document.body.classList.toggle("sis-dark"); var d = document.body.classList.contains("sis-dark"); LS.set(KEY.theme, d ? "dark" : "light"); document.querySelectorAll("[data-theme-toggle]").forEach(sync); toast(d ? "🌙 Dark mode on" : "☀️ Light mode on", "info"); }); });
    function sync(b) { b.textContent = document.body.classList.contains("sis-dark") ? "☀️" : "🌙"; }
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
  function paletteItems() { var inP = /school-improvement/.test(location.pathname); var base = inP ? "" : "projects/school-improvement/"; return TOOLS.map(function (t) { return { ico: t.ico, name: t.name, hint: t.desc, url: base + t.url }; }); }
  function bindPalette() {
    var input = document.querySelector(".cmdk-input"); if (!input) return;
    input.addEventListener("input", function () { renderPalette(input.value); });
    input.addEventListener("keydown", function (e) { if (e.key === "ArrowDown") { e.preventDefault(); palIndex = Math.min(palIndex + 1, palMatches.length - 1); hi(); } else if (e.key === "ArrowUp") { e.preventDefault(); palIndex = Math.max(palIndex - 1, 0); hi(); } else if (e.key === "Enter") { var m = palMatches[palIndex]; if (m) location.href = m.url; } });
    function hi() { var els = document.querySelectorAll(".cmdk-item"); els.forEach(function (el, i) { el.classList.toggle("active", i === palIndex); }); if (els[palIndex]) els[palIndex].scrollIntoView({ block: "nearest" }); }
  }
  function renderPalette(q) { var list = document.querySelector(".cmdk-list"); if (!list) return; q = (q || "").toLowerCase().trim(); var all = paletteItems(); palMatches = !q ? all : all.filter(function (a) { return (a.name + " " + a.hint).toLowerCase().indexOf(q) > -1; }); palIndex = 0; if (!palMatches.length) { list.innerHTML = '<div class="cmdk-empty">No match — try “diagnostic”, “strategic”, or “monitoring”.</div>'; return; } list.innerHTML = palMatches.map(function (a, i) { return '<a class="cmdk-item' + (i === 0 ? " active" : "") + '" href="' + a.url + '"><span class="ico">' + a.ico + '</span><span>' + a.name + '</span><small>' + a.hint + "</small></a>"; }).join(""); }
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

  /* ===================== SCHOOL DIAGNOSTIC → HEALTH INDEX ===================== */
  function initDiagnostic() {
    var root = document.querySelector("[data-assessment]"); if (!root) return;
    root.querySelectorAll(".likert").forEach(function (lk) { lk.querySelectorAll("button").forEach(function (b) { b.addEventListener("click", function () { lk.querySelectorAll("button").forEach(function (x) { x.classList.remove("on"); }); b.classList.add("on"); }); }); });
    var btn = root.querySelector("[data-assess-run]"), out = document.querySelector("[data-assess-result]");
    if (btn) btn.addEventListener("click", compute);
    var reset = root.querySelector("[data-assess-reset]"); if (reset) reset.addEventListener("click", function () { root.querySelectorAll(".likert button.on").forEach(function (b) { b.classList.remove("on"); }); if (out) out.classList.remove("show"); LS.set(KEY.diag, null); toast("Diagnostic reset", "info"); });
    var saved = LS.get(KEY.diag, null); if (saved && out) render(saved);
    function compute() {
      var scores = {}, counts = {}; DOMAINS.forEach(function (d) { scores[d.id] = 0; counts[d.id] = 0; });
      var answered = 0;
      root.querySelectorAll(".assess-item").forEach(function (item) { var dom = item.getAttribute("data-domain") || "vision"; var on = item.querySelector(".likert button.on"); if (on) { scores[dom] += parseInt(on.getAttribute("data-v") || on.textContent, 10) || 0; counts[dom] += 1; answered++; } });
      if (!answered) { toast("Rate the indicators to generate your School Health Index", ""); return; }
      var pct = {}; DOMAINS.forEach(function (d) { pct[d.id] = counts[d.id] ? Math.round((scores[d.id] / (counts[d.id] * 5)) * 100) : 0; });
      var overall = Math.round(DOMAINS.reduce(function (s, d) { return s + pct[d.id]; }, 0) / DOMAINS.length);
      var data = { pct: pct, overall: overall }; LS.set(KEY.diag, data); render(data); if (out) out.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    function render(data) {
      if (!out) return;
      var ranked = DOMAINS.slice().sort(function (a, b) { return data.pct[b.id] - data.pct[a.id]; });
      var band = data.overall >= 85 ? { t: "Excellent", c: "green" } : data.overall >= 70 ? { t: "Effective", c: "gold" } : data.overall >= 55 ? { t: "Developing", c: "amber" } : { t: "Needs Improvement", c: "red" };
      var bars = DOMAINS.map(function (d) { var p = data.pct[d.id]; var pillC = p >= 70 ? "green" : p >= 55 ? "amber" : "red"; return '<div class="row"><span>' + d.ico + " " + d.name + '</span><span class="track"><span class="fill" data-pct="' + p + '" style="width:' + p + '%"></span></span><b>' + p + "%</b></div>"; }).join("");
      out.innerHTML =
        '<div class="assess-card"><h3>School Health Index</h3><div style="display:flex;gap:1.6rem;flex-wrap:wrap;align-items:center;">' +
        '<div class="gauge" data-gauge="' + data.overall + '" data-gauge-suffix="%"><div class="hole"><b data-gauge-num>0%</b><small>School Health Index</small></div></div>' +
        '<div style="flex:1;min-width:240px;"><p><span class="tl-pill ' + band.c + '">' + band.t + '</span></p><div class="barlist">' + bars + "</div></div></div></div>" +
        '<div class="assess-card"><h3>🌟 Strengths</h3><ul>' + ranked.slice(0, 2).map(function (d) { return "<li><b>" + d.name + "</b> (" + data.pct[d.id] + "%) — sustain and share.</li>"; }).join("") + "</ul></div>" +
        '<div class="assess-card"><h3>🎯 Priority improvement areas</h3><ul>' + ranked.slice(-2).map(function (d) { return "<li><b>" + d.name + "</b> (" + data.pct[d.id] + "%) — target in your strategic plan.</li>"; }).join("") + '</ul><div class="btn-row" style="margin-top:.6rem;"><a class="btn" href="strategic-planning.html">Build a Strategic Plan</a><button class="out-btn" data-assess-reset>Reset</button></div><p class="muted" style="font-size:.85rem;margin-top:.6rem;">A reflective diagnostic across the six improvement domains. Use it to focus your continuous-improvement cycle.</p></div>';
      out.classList.add("show");
      var r2 = out.querySelector("[data-assess-reset]"); if (r2) r2.addEventListener("click", function () { root.querySelectorAll(".likert button.on").forEach(function (b) { b.classList.remove("on"); }); out.classList.remove("show"); LS.set(KEY.diag, null); window.scrollTo({ top: 0, behavior: "smooth" }); });
      initGauges(); initBars();
    }
  }

  /* ===================== SAVED FORMS (SWOT / strategic plan / action plan) ===================== */
  function savedForm(form, key, label) {
    var saved = LS.get(key, {}); form.querySelectorAll("input[name],textarea[name],select[name]").forEach(function (f) { if (saved[f.name] != null) f.value = saved[f.name]; });
    var note = form.querySelector("[data-plan-saved]");
    function save() { var d = {}; form.querySelectorAll("input[name],textarea[name],select[name]").forEach(function (f) { d[f.name] = f.value; }); LS.set(key, d); if (note) { note.textContent = "✓ Saved locally"; setTimeout(function () { note.textContent = ""; }, 2000); } }
    form.addEventListener("submit", function (e) { e.preventDefault(); save(); toast("💾 " + label + " saved", "ok"); });
    form.querySelectorAll("input,textarea,select").forEach(function (f) { f.addEventListener("change", save); });
    var clr = form.querySelector("[data-plan-clear]"); if (clr) clr.addEventListener("click", function () { LS.set(key, {}); form.reset(); toast(label + " cleared", "info"); });
  }
  function initSavedForms() {
    var sw = document.querySelector("[data-swot]"); if (sw) savedForm(sw, KEY.swot, "SWOT analysis");
    var pl = document.querySelector("[data-planner]"); if (pl) savedForm(pl, KEY.plan, "Strategic plan");
    var ac = document.querySelector("[data-action]"); if (ac) savedForm(ac, KEY.action, "Action plan");
  }
  function initJournal() {
    var box = document.querySelector("[data-journal]"); if (!box) return;
    var input = box.querySelector("textarea"), listEl = box.querySelector("[data-journal-list]"), add = box.querySelector("[data-journal-add]");
    function render() { var e = LS.get(KEY.journal, []); if (!listEl) return; listEl.innerHTML = e.length ? e.map(function (x, i) { return '<div class="lib-item"><span class="l-ico">🪞</span><div class="l-body"><b>Note ' + (e.length - i) + "</b><small>" + esc(x) + "</small></div></div>"; }).join("") : '<p class="muted">No entries yet. Saved privately in this browser.</p>'; }
    if (add) add.addEventListener("click", function () { var v = (input.value || "").trim(); if (!v) { toast("Write a note first", ""); return; } var e = LS.get(KEY.journal, []); e.unshift(v); LS.set(KEY.journal, e); input.value = ""; render(); toast("🪞 Saved", "ok"); });
    var clr = box.querySelector("[data-journal-clear]"); if (clr) clr.addEventListener("click", function () { LS.set(KEY.journal, []); render(); toast("Cleared", "info"); });
    render();
  }

  /* ===================== GENERATORS (improvement plan / review) ===================== */
  var GEN = {
    improvement: { label: "School Improvement Plan", build: function (d) {
      var priority = val(d, "priority", "improve teaching & learning"), domain = val(d, "domain", "Teaching & Learning");
      return "<h3>School Improvement Plan — " + esc(domain) + "</h3><p class='muted'>Priority: " + esc(priority) + "</p>" +
        "<h4>SMART Goal</h4><p>By year-end, improve the target indicator from baseline to goal, measured by agreed evidence.</p>" +
        "<h4>Strategy (research-based)</h4><ul><li>One high-leverage strategy aligned to the priority.</li><li>Professional learning to build capacity.</li></ul>" +
        "<h4>Action Steps &amp; Owners</h4><ul><li>Q1: launch &amp; baseline (owner + date).</li><li>Q2–Q3: implement &amp; monitor (owner + date).</li><li>Q4: evaluate &amp; embed (owner + date).</li></ul>" +
        "<h4>Resources &amp; Risks</h4><ul><li>Resources allocated; risks identified with mitigations.</li></ul>" +
        "<h4>Monitoring (PDSA)</h4><p>Quarterly reviews; leading + lagging indicators; adjust each cycle.</p>" +
        "<h4>Success Indicators</h4><ul><li>Leading: implementation evidence.</li><li>Lagging: outcome improvement.</li></ul>" +
        "<p class='muted' style='font-size:.85rem;'><span class='ai-pill'>Continuous improvement</span> A living plan, not a compliance document. Illustrative template.</p>";
    }},
    review: { label: "Quarterly Review Summary", build: function (d) {
      var q = val(d, "quarter", "Q2"), focus = val(d, "focus", "the school improvement plan");
      return "<h3>Quarterly Review — " + esc(q) + "</h3><p class='muted'>Focus: " + esc(focus) + "</p>" +
        "<h4>Progress vs. Goals</h4><p>On track / watch / off track for each priority, with evidence.</p>" +
        "<h4>Implementation Fidelity</h4><p>Are actions happening as designed? What's getting in the way?</p>" +
        "<h4>What's Working / Not</h4><ul><li>Bright spots to scale.</li><li>Barriers to address.</li></ul>" +
        "<h4>Adjustments (Study → Act)</h4><p>Decisions for the next cycle, with owners and dates.</p>" +
        "<p class='muted' style='font-size:.85rem;'>Evidence-based, forward-looking. Illustrative template.</p>";
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
  window.SIS = { toast: toast, copy: copyText };
})();
