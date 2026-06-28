/* =====================================================================
   Accreditation Excellence Framework — interactivity engine
   Loads AFTER the shared portfolio.js. Adds:
     • Dark mode  • Command palette (Ctrl/⌘+K) + FAB  • Toasts
     • Accreditation Readiness diagnostic (8 areas → readiness score + gaps)
     • Interactive Evidence Tracker (add, status, persist, completion %)
     • Standards explorer + saved improvement planner + journal
     • Self-study / improvement-plan generators + gauges/bars/drill
   Research-informed (quality assurance, continuous improvement);
   standards & evidence are illustrative. Storage is localStorage.
   ===================================================================== */
(function () {
  "use strict";
  var LS = { get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  var KEY = { theme: "aef:theme", readiness: "aef:readiness", evidence: "aef:evidence", plan: "aef:plan", journal: "aef:journal" };

  var AREAS = [
    { id: "leadership", name: "Leadership Capacity", ico: "🧭" },
    { id: "teaching", name: "Teaching Quality", ico: "📚" },
    { id: "outcomes", name: "Student Outcomes", ico: "🎓" },
    { id: "governance", name: "Governance", ico: "⚖️" },
    { id: "planning", name: "Strategic Planning", ico: "🎯" },
    { id: "evidence", name: "Evidence Quality", ico: "🗂️" },
    { id: "improvement", name: "Continuous Improvement", ico: "🔄" },
    { id: "stakeholders", name: "Stakeholder Engagement", ico: "🤝" }
  ];

  var TOOLS = [
    { name: "Quality Assurance Framework", ico: "🧭", url: "framework.html",              desc: "Six quality domains", group: "Framework" },
    { name: "Accreditation Standards",     ico: "📋", url: "standards.html",              desc: "Explore & align", group: "Standards" },
    { name: "Readiness Assessment",        ico: "🩺", url: "readiness.html",              desc: "Score & gap analysis", group: "Diagnose" },
    { name: "Evidence Management",         ico: "🗂️", url: "evidence-management.html",    desc: "Repository & tracker", group: "Prepare" },
    { name: "Continuous Improvement",      ico: "🔄", url: "continuous-improvement.html", desc: "Reviews & cycles", group: "Prepare" },
    { name: "Compliance Dashboard",        ico: "📊", url: "compliance-dashboard.html",   desc: "Readiness at a glance", group: "Monitor" },
    { name: "Quality Analytics",           ico: "📈", url: "quality-analytics.html",      desc: "School Health Index", group: "Monitor" },
    { name: "Resources",                   ico: "📂", url: "resources.html",              desc: "Tools & templates", group: "Insight" }
  ];

  document.addEventListener("DOMContentLoaded", function () {
    initTheme(); buildChrome(); initThemeToggle();
    initReadiness(); initEvidence(); initStandardsExplorer(); initSavedForms(); initJournal(); initGenerators();
    initGauges(); initBars(); initCountUp(); initDrilldowns(); paintEvidenceStats(); renderRailActive();
  });

  function initTheme() { if (LS.get(KEY.theme, "light") === "dark") document.body.classList.add("aef-dark"); }
  function initThemeToggle() {
    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) { sync(b); b.addEventListener("click", function () { document.body.classList.toggle("aef-dark"); var d = document.body.classList.contains("aef-dark"); LS.set(KEY.theme, d ? "dark" : "light"); document.querySelectorAll("[data-theme-toggle]").forEach(sync); toast(d ? "🌙 Dark mode on" : "☀️ Light mode on", "info"); }); });
    function sync(b) { b.textContent = document.body.classList.contains("aef-dark") ? "☀️" : "🌙"; }
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
  function paletteItems() { var inP = /accreditation-excellence/.test(location.pathname); var base = inP ? "" : "projects/accreditation-excellence/"; return TOOLS.map(function (t) { return { ico: t.ico, name: t.name, hint: t.desc, url: base + t.url }; }); }
  function bindPalette() {
    var input = document.querySelector(".cmdk-input"); if (!input) return;
    input.addEventListener("input", function () { renderPalette(input.value); });
    input.addEventListener("keydown", function (e) { if (e.key === "ArrowDown") { e.preventDefault(); palIndex = Math.min(palIndex + 1, palMatches.length - 1); hi(); } else if (e.key === "ArrowUp") { e.preventDefault(); palIndex = Math.max(palIndex - 1, 0); hi(); } else if (e.key === "Enter") { var m = palMatches[palIndex]; if (m) location.href = m.url; } });
    function hi() { var els = document.querySelectorAll(".cmdk-item"); els.forEach(function (el, i) { el.classList.toggle("active", i === palIndex); }); if (els[palIndex]) els[palIndex].scrollIntoView({ block: "nearest" }); }
  }
  function renderPalette(q) { var list = document.querySelector(".cmdk-list"); if (!list) return; q = (q || "").toLowerCase().trim(); var all = paletteItems(); palMatches = !q ? all : all.filter(function (a) { return (a.name + " " + a.hint).toLowerCase().indexOf(q) > -1; }); palIndex = 0; if (!palMatches.length) { list.innerHTML = '<div class="cmdk-empty">No match — try “standards”, “evidence”, or “readiness”.</div>'; return; } list.innerHTML = palMatches.map(function (a, i) { return '<a class="cmdk-item' + (i === 0 ? " active" : "") + '" href="' + a.url + '"><span class="ico">' + a.ico + '</span><span>' + a.name + '</span><small>' + a.hint + "</small></a>"; }).join(""); }
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
  function initStandardsExplorer() { document.querySelectorAll(".comp-card").forEach(function (c) { c.addEventListener("click", function () { var d = c.querySelector(".comp-detail"); if (d) d.classList.toggle("open"); }); }); }

  /* ===================== READINESS DIAGNOSTIC ===================== */
  function initReadiness() {
    var root = document.querySelector("[data-assessment]"); if (!root) return;
    root.querySelectorAll(".likert").forEach(function (lk) { lk.querySelectorAll("button").forEach(function (b) { b.addEventListener("click", function () { lk.querySelectorAll("button").forEach(function (x) { x.classList.remove("on"); }); b.classList.add("on"); }); }); });
    var btn = root.querySelector("[data-assess-run]"), out = document.querySelector("[data-assess-result]");
    if (btn) btn.addEventListener("click", compute);
    var reset = root.querySelector("[data-assess-reset]"); if (reset) reset.addEventListener("click", function () { root.querySelectorAll(".likert button.on").forEach(function (b) { b.classList.remove("on"); }); if (out) out.classList.remove("show"); LS.set(KEY.readiness, null); toast("Assessment reset", "info"); });
    var saved = LS.get(KEY.readiness, null); if (saved && out) render(saved);
    function compute() {
      var scores = {}, counts = {}; AREAS.forEach(function (d) { scores[d.id] = 0; counts[d.id] = 0; });
      var answered = 0;
      root.querySelectorAll(".assess-item").forEach(function (item) { var dom = item.getAttribute("data-domain") || "leadership"; var on = item.querySelector(".likert button.on"); if (on) { scores[dom] += parseInt(on.getAttribute("data-v") || on.textContent, 10) || 0; counts[dom] += 1; answered++; } });
      if (!answered) { toast("Rate the indicators to generate your readiness score", ""); return; }
      var pct = {}; AREAS.forEach(function (d) { pct[d.id] = counts[d.id] ? Math.round((scores[d.id] / (counts[d.id] * 5)) * 100) : 0; });
      var overall = Math.round(AREAS.reduce(function (s, d) { return s + pct[d.id]; }, 0) / AREAS.length);
      var data = { pct: pct, overall: overall }; LS.set(KEY.readiness, data); render(data); if (out) out.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    function render(data) {
      if (!out) return;
      var ranked = AREAS.slice().sort(function (a, b) { return data.pct[b.id] - data.pct[a.id]; });
      var band = data.overall >= 85 ? { t: "Accreditation-Ready", c: "green" } : data.overall >= 70 ? { t: "Nearly Ready", c: "bronze" } : data.overall >= 55 ? { t: "Developing", c: "amber" } : { t: "Early Stage", c: "red" };
      var bars = AREAS.map(function (d) { return '<div class="row"><span>' + d.ico + " " + d.name + '</span><span class="track"><span class="fill" data-pct="' + data.pct[d.id] + '" style="width:' + data.pct[d.id] + '%"></span></span><b>' + data.pct[d.id] + "%</b></div>"; }).join("");
      var gaps = ranked.slice(-3).map(function (d) { return "<li><b>" + d.name + "</b> (" + data.pct[d.id] + "%) — prioritize evidence &amp; improvement here.</li>"; }).join("");
      out.innerHTML =
        '<div class="assess-card"><h3>Accreditation Readiness</h3><div style="display:flex;gap:1.6rem;flex-wrap:wrap;align-items:center;">' +
        '<div class="gauge" data-gauge="' + data.overall + '" data-gauge-suffix="%"><div class="hole"><b data-gauge-num>0%</b><small>Readiness</small></div></div>' +
        '<div style="flex:1;min-width:240px;"><p><span class="tl-pill ' + band.c + '">' + band.t + '</span></p><div class="barlist">' + bars + "</div></div></div></div>" +
        '<div class="assess-card"><h3>🌟 Strengths to evidence</h3><ul>' + ranked.slice(0, 2).map(function (d) { return "<li><b>" + d.name + "</b> (" + data.pct[d.id] + "%)</li>"; }).join("") + "</ul></div>" +
        '<div class="assess-card"><h3>🔍 Gap Analysis — priority areas</h3><ul>' + gaps + '</ul></div>' +
        '<div class="assess-card"><h3>🗺️ Improvement Roadmap</h3><ol><li>Address the lowest-scoring domains first; assign owners.</li><li>Collect &amp; align evidence in the <a href="evidence-management.html">Evidence Manager</a>.</li><li>Run continuous-improvement cycles; re-assess before the review.</li></ol><div class="btn-row" style="margin-top:.6rem;"><a class="btn" href="evidence-management.html">Open Evidence Manager</a><button class="out-btn" data-assess-reset>Reset</button></div><p class="muted" style="font-size:.85rem;margin-top:.6rem;">A reflective readiness diagnostic across eight accreditation areas. Accreditation = continuous improvement, not a one-time event.</p></div>';
      out.classList.add("show");
      var r2 = out.querySelector("[data-assess-reset]"); if (r2) r2.addEventListener("click", function () { root.querySelectorAll(".likert button.on").forEach(function (b) { b.classList.remove("on"); }); out.classList.remove("show"); LS.set(KEY.readiness, null); window.scrollTo({ top: 0, behavior: "smooth" }); });
      initGauges(); initBars();
    }
  }

  /* ===================== EVIDENCE TRACKER ===================== */
  function evGet() { return LS.get(KEY.evidence, []); }
  function initEvidence() {
    var box = document.querySelector("[data-evidence]"); if (!box) { paintEvidenceStats(); return; }
    var name = box.querySelector("[data-ev-name]"), std = box.querySelector("[data-ev-standard]"), status = box.querySelector("[data-ev-status]"), add = box.querySelector("[data-ev-add]"), listEl = box.querySelector("[data-ev-list]");
    function render() {
      var items = evGet(); if (!listEl) return;
      if (!items.length) { listEl.innerHTML = '<p class="muted">No evidence yet. Add an artifact above — your evidence log is saved privately in this browser.</p>'; return; }
      var cls = { Complete: "complete", "In progress": "progress", "Not started": "notstarted" }, pill = { Complete: "green", "In progress": "amber", "Not started": "red" };
      listEl.innerHTML = items.map(function (e, i) {
        return '<div class="ev-row ' + (cls[e.status] || "notstarted") + '"><span class="l-ico">📄</span><div class="e-body"><b>' + esc(e.name) + "</b><small>Standard: " + esc(e.standard || "—") + '</small></div><span class="tl-pill ' + (pill[e.status] || "red") + '">' + esc(e.status) + '</span><button class="e-del" data-del="' + i + '" aria-label="Remove">✕</button></div>';
      }).join("");
      listEl.querySelectorAll("[data-del]").forEach(function (b) { b.addEventListener("click", function () { var ev = evGet(); ev.splice(parseInt(b.getAttribute("data-del"), 10), 1); LS.set(KEY.evidence, ev); render(); paintEvidenceStats(); toast("Evidence removed", "info"); }); });
    }
    if (add) add.addEventListener("click", function () {
      var nm = (name && name.value || "").trim(); if (!nm) { toast("Name the evidence first", ""); return; }
      var ev = evGet(); ev.push({ name: nm, standard: std ? std.value : "", status: status ? status.value : "Not started" }); LS.set(KEY.evidence, ev);
      if (name) name.value = ""; render(); paintEvidenceStats(); toast("🗂️ Evidence added", "ok");
    });
    var clr = box.querySelector("[data-ev-clear]"); if (clr) clr.addEventListener("click", function () { LS.set(KEY.evidence, []); render(); paintEvidenceStats(); toast("Evidence log cleared", "info"); });
    render();
  }
  function paintEvidenceStats() {
    var items = evGet(), total = items.length, done = items.filter(function (e) { return e.status === "Complete"; }).length;
    var pct = total ? Math.round((done / total) * 100) : 0;
    document.querySelectorAll("[data-ev-total]").forEach(function (e) { e.textContent = total; });
    document.querySelectorAll("[data-ev-done]").forEach(function (e) { e.textContent = done; });
    document.querySelectorAll("[data-ev-pct]").forEach(function (e) { e.textContent = pct + "%"; });
    document.querySelectorAll("[data-ev-fill]").forEach(function (e) { e.style.width = pct + "%"; });
  }

  /* ===================== SAVED FORMS + JOURNAL ===================== */
  function savedForm(form, key, label) {
    var saved = LS.get(key, {}); form.querySelectorAll("input[name],textarea[name],select[name]").forEach(function (f) { if (saved[f.name] != null) f.value = saved[f.name]; });
    var note = form.querySelector("[data-plan-saved]");
    function save() { var d = {}; form.querySelectorAll("input[name],textarea[name],select[name]").forEach(function (f) { d[f.name] = f.value; }); LS.set(key, d); if (note) { note.textContent = "✓ Saved locally"; setTimeout(function () { note.textContent = ""; }, 2000); } }
    form.addEventListener("submit", function (e) { e.preventDefault(); save(); toast("💾 " + label + " saved", "ok"); });
    form.querySelectorAll("input,textarea,select").forEach(function (f) { f.addEventListener("change", save); });
    var clr = form.querySelector("[data-plan-clear]"); if (clr) clr.addEventListener("click", function () { LS.set(key, {}); form.reset(); toast(label + " cleared", "info"); });
  }
  function initSavedForms() { var pl = document.querySelector("[data-planner]"); if (pl) savedForm(pl, KEY.plan, "Improvement plan"); }
  function initJournal() {
    var box = document.querySelector("[data-journal]"); if (!box) return;
    var input = box.querySelector("textarea"), listEl = box.querySelector("[data-journal-list]"), add = box.querySelector("[data-journal-add]");
    function render() { var e = LS.get(KEY.journal, []); if (!listEl) return; listEl.innerHTML = e.length ? e.map(function (x, i) { return '<div class="lib-item"><span class="l-ico">🪞</span><div class="l-body"><b>Note ' + (e.length - i) + "</b><small>" + esc(x) + "</small></div></div>"; }).join("") : '<p class="muted">No entries yet. Saved privately in this browser.</p>'; }
    if (add) add.addEventListener("click", function () { var v = (input.value || "").trim(); if (!v) { toast("Write a note first", ""); return; } var e = LS.get(KEY.journal, []); e.unshift(v); LS.set(KEY.journal, e); input.value = ""; render(); toast("🪞 Saved", "ok"); });
    var clr = box.querySelector("[data-journal-clear]"); if (clr) clr.addEventListener("click", function () { LS.set(KEY.journal, []); render(); toast("Cleared", "info"); });
    render();
  }

  /* ===================== GENERATORS (self-study / improvement) ===================== */
  var GEN = {
    selfstudy: { label: "Self-Study Narrative", build: function (d) {
      var domain = val(d, "domain", "Leadership & Governance"), school = val(d, "school", "our school");
      return "<h3>Self-Study Narrative — " + esc(domain) + "</h3><p class='muted'>" + esc(school) + "</p>" +
        "<h4>Context</h4><p>A brief description of practice in this domain at " + esc(school) + ".</p>" +
        "<h4>Strengths (with evidence)</h4><ul><li>Practice + the artifact that demonstrates it.</li><li>Outcome data that confirms impact.</li></ul>" +
        "<h4>Areas for Growth</h4><ul><li>An honest gap + the improvement underway.</li></ul>" +
        "<h4>Alignment to Standards</h4><p>How this domain maps to the relevant accreditation indicators.</p>" +
        "<h4>Continuous Improvement</h4><p>The cycle (plan → act → monitor → reflect) used to improve this domain.</p>" +
        "<p class='muted' style='font-size:.85rem;'><span class='ai-pill'>Evidence-based</span> A self-study reflects honestly and links every claim to evidence. Illustrative template.</p>";
    }},
    improvement: { label: "Improvement Plan", build: function (d) {
      var priority = val(d, "priority", "strengthen evidence quality"), domain = val(d, "domain", "Continuous Improvement");
      return "<h3>Improvement Plan — " + esc(domain) + "</h3><p class='muted'>Priority: " + esc(priority) + "</p>" +
        "<h4>Goal</h4><p>A measurable goal tied to a standard and its indicators.</p>" +
        "<h4>Actions &amp; Owners</h4><ul><li>Q1 baseline · Q2–Q3 implement · Q4 evaluate (owner + date).</li></ul>" +
        "<h4>Evidence to Collect</h4><ul><li>Artifacts that will demonstrate progress &amp; impact.</li></ul>" +
        "<h4>Monitoring</h4><p>Quarterly review against indicators; adjust each cycle.</p>" +
        "<p class='muted' style='font-size:.85rem;'><span class='ai-pill'>Continuous improvement</span> Illustrative template.</p>";
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
  window.AEF = { toast: toast, copy: copyText };
})();
