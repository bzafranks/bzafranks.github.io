/* =====================================================================
   Educational Leadership Consulting Playbook — CAPSTONE platform engine
   Loads AFTER the shared portfolio.js. Adds:
     • Dark mode  • Command palette (Ctrl/⌘+K) + FAB  • Notifications
     • Toasts  • Count-up + gauges + bar animations + drill-downs
     • Transformation Readiness diagnostic (6 dimensions → Readiness Index)
     • Interactive maturity model matrix
     • Transformation blueprint generator
   ALL data is illustrative sample data. Storage is localStorage.
   ===================================================================== */
(function () {
  "use strict";
  var LS = { get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  var KEY = { theme: "clp:theme", assess: "clp:assess" };

  var DIMENSIONS = [
    { id: "leadership",  name: "Leadership Capacity",            ico: "👤" },
    { id: "culture",     name: "Culture & Climate",              ico: "🤝" },
    { id: "instruction", name: "Instructional Quality",          ico: "📚" },
    { id: "strategy",    name: "Strategy & Improvement",         ico: "🎯" },
    { id: "talent",      name: "Talent & Retention",             ico: "💚" },
    { id: "innovation",  name: "Innovation & Future-Readiness",  ico: "🚀" }
  ];

  var TOOLS = [
    { name: "Transformation Dashboard", ico: "📊", url: "dashboard.html",             desc: "Engagement overview",     group: "Overview" },
    { name: "Consulting Methodology",   ico: "🧭", url: "methodology.html",           desc: "Six-phase lifecycle",     group: "Methodology" },
    { name: "Discovery & Diagnostic",   ico: "🔍", url: "diagnostic.html",            desc: "Organizational assessment",group: "Methodology" },
    { name: "Transformation Blueprint", ico: "🗺️", url: "blueprint.html",             desc: "Strategy & roadmap",      group: "Methodology" },
    { name: "Implementation Services",  ico: "🛠️", url: "implementation.html",        desc: "Consulting offerings",    group: "Services" },
    { name: "Leadership Solutions",     ico: "🧩", url: "leadership-solutions.html",  desc: "The integrated suite",    group: "Services" },
    { name: "Consulting Toolkit",       ico: "🧰", url: "toolkit.html",               desc: "Templates & instruments", group: "Services" },
    { name: "Client Success Stories",   ico: "🏆", url: "case-studies.html",          desc: "Engagement case studies", group: "Evidence" },
    { name: "Resources",                ico: "📦", url: "resources.html",             desc: "Implementation guide",    group: "Evidence" }
  ];

  document.addEventListener("DOMContentLoaded", function () {
    initTheme(); buildChrome(); initThemeToggle(); initNotifications();
    initAssessment(); initBlueprintGen(); initMaturity();
    initGauges(); initBars(); initCountUp(); initDrilldowns(); initFilters(); renderRailActive();
  });

  function initTheme() { if (LS.get(KEY.theme, "light") === "dark") document.body.classList.add("clp-dark"); }
  function initThemeToggle() {
    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) { sync(b); b.addEventListener("click", function () { document.body.classList.toggle("clp-dark"); var d = document.body.classList.contains("clp-dark"); LS.set(KEY.theme, d ? "dark" : "light"); document.querySelectorAll("[data-theme-toggle]").forEach(sync); toast(d ? "🌙 Dark mode on" : "☀️ Light mode on", "info"); }); });
    function sync(b) { b.textContent = document.body.classList.contains("clp-dark") ? "☀️" : "🌙"; }
  }

  function buildChrome() {
    if (document.querySelector("[data-no-chrome]")) return;
    if (!document.querySelector(".toast-wrap")) { var tw = document.createElement("div"); tw.className = "toast-wrap"; document.body.appendChild(tw); }
    if (!document.querySelector(".fab")) { var f = document.createElement("button"); f.className = "fab"; f.type = "button"; f.title = "Command palette (Ctrl/⌘ + K)"; f.setAttribute("aria-label", "Command palette"); f.textContent = "💼"; f.addEventListener("click", openPalette); document.body.appendChild(f); }
    if (!document.querySelector(".cmdk")) { var ov = document.createElement("div"); ov.className = "cmdk"; ov.innerHTML = '<div class="cmdk-box" role="dialog" aria-label="Command palette"><input class="cmdk-input" type="text" placeholder="Jump to a tool…" aria-label="Command search"><div class="cmdk-list"></div></div>'; document.body.appendChild(ov); ov.addEventListener("click", function (e) { if (e.target === ov) closePalette(); }); }
    bindPalette();
    document.addEventListener("keydown", function (e) { if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) { e.preventDefault(); openPalette(); } if (e.key === "Escape") { closePalette(); closeNotif(); } });
  }
  var palIndex = 0, palMatches = [];
  function paletteItems() { var inP = /leadership-consulting-playbook/.test(location.pathname); var base = inP ? "" : "projects/leadership-consulting-playbook/"; return TOOLS.map(function (t) { return { ico: t.ico, name: t.name, hint: t.desc, url: base + t.url }; }); }
  function bindPalette() {
    var input = document.querySelector(".cmdk-input"); if (!input) return;
    input.addEventListener("input", function () { renderPalette(input.value); });
    input.addEventListener("keydown", function (e) { if (e.key === "ArrowDown") { e.preventDefault(); palIndex = Math.min(palIndex + 1, palMatches.length - 1); hi(); } else if (e.key === "ArrowUp") { e.preventDefault(); palIndex = Math.max(palIndex - 1, 0); hi(); } else if (e.key === "Enter") { var m = palMatches[palIndex]; if (m) location.href = m.url; } });
    function hi() { var els = document.querySelectorAll(".cmdk-item"); els.forEach(function (el, i) { el.classList.toggle("active", i === palIndex); }); if (els[palIndex]) els[palIndex].scrollIntoView({ block: "nearest" }); }
  }
  function renderPalette(q) { var list = document.querySelector(".cmdk-list"); if (!list) return; q = (q || "").toLowerCase().trim(); var all = paletteItems(); palMatches = !q ? all : all.filter(function (a) { return (a.name + " " + a.hint).toLowerCase().indexOf(q) > -1; }); palIndex = 0; if (!palMatches.length) { list.innerHTML = '<div class="cmdk-empty">No match — try “diagnostic”, “blueprint”, or “toolkit”.</div>'; return; } list.innerHTML = palMatches.map(function (a, i) { return '<a class="cmdk-item' + (i === 0 ? " active" : "") + '" href="' + a.url + '"><span class="ico">' + a.ico + '</span><span>' + a.name + '</span><small>' + a.hint + "</small></a>"; }).join(""); }
  function openPalette() { var ov = document.querySelector(".cmdk"); if (!ov) return; ov.classList.add("open"); renderPalette(""); var i = ov.querySelector(".cmdk-input"); if (i) { i.value = ""; i.focus(); } }
  function closePalette() { var ov = document.querySelector(".cmdk"); if (ov) ov.classList.remove("open"); }

  function initNotifications() { var wrap = document.querySelector("[data-notif]"); if (!wrap) return; var btn = wrap.querySelector(".notif-btn"), panel = wrap.querySelector(".notif-panel"); if (btn && panel) { btn.addEventListener("click", function (e) { e.stopPropagation(); panel.classList.toggle("open"); }); document.addEventListener("click", function () { panel.classList.remove("open"); }); panel.addEventListener("click", function (e) { e.stopPropagation(); }); } }
  function closeNotif() { var p = document.querySelector(".notif-panel"); if (p) p.classList.remove("open"); }

  function toast(msg, kind) { var w = document.querySelector(".toast-wrap"); if (!w) return; var t = document.createElement("div"); t.className = "toast " + (kind || ""); t.textContent = msg; w.appendChild(t); setTimeout(function () { t.style.opacity = "0"; t.style.transition = "opacity .3s"; setTimeout(function () { t.remove(); }, 320); }, 2400); }
  function copyText(text) { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { toast("📋 Copied", "ok"); }, function () { toast("Copy failed", ""); }); else toast("Clipboard unavailable", ""); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function val(d, k, fb) { return d && d[k] ? d[k] : fb; }

  function obsRun(els, fn) { if (!els.length) return; if ("IntersectionObserver" in window) { var o = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { fn(e.target); o.unobserve(e.target); } }); }, { threshold: 0.3 }); els.forEach(function (e) { o.observe(e); }); } else els.forEach(fn); }
  function initGauges() { obsRun(document.querySelectorAll("[data-gauge]"), function (el) { var t = parseFloat(el.getAttribute("data-gauge")) || 0, dur = 1100, start = null, num = el.querySelector("[data-gauge-num]"); function step(ts) { if (!start) start = ts; var p = Math.min((ts - start) / dur, 1); var v = t * (0.5 - Math.cos(p * Math.PI) / 2); el.style.setProperty("--val", v.toFixed(1)); if (num) num.textContent = Math.round(v) + (el.getAttribute("data-gauge-suffix") || ""); if (p < 1) requestAnimationFrame(step); } requestAnimationFrame(step); }); }
  function initBars() { obsRun(document.querySelectorAll(".barlist .fill[data-pct]"), function (el) { var p = el.getAttribute("data-pct"); el.style.width = "0%"; requestAnimationFrame(function () { el.style.transition = "width .9s ease"; el.style.width = p + "%"; }); }); obsRun(document.querySelectorAll(".barchart .bar[data-h]"), function (el) { var h = el.getAttribute("data-h"); el.style.height = "0%"; requestAnimationFrame(function () { el.style.height = h + "%"; }); }); }
  function initCountUp() { obsRun(document.querySelectorAll("[data-count]"), function (el) { var t = parseFloat(el.getAttribute("data-count")), suf = el.getAttribute("data-suffix") || "", pre = el.getAttribute("data-prefix") || "", dur = 1000, start = null; function step(ts) { if (!start) start = ts; var p = Math.min((ts - start) / dur, 1); var v = t * (0.5 - Math.cos(p * Math.PI) / 2); el.textContent = pre + (t % 1 === 0 ? Math.round(v) : v.toFixed(1)) + suf; if (p < 1) requestAnimationFrame(step); } requestAnimationFrame(step); }); }
  function initDrilldowns() { document.querySelectorAll(".drill-row").forEach(function (row) { row.addEventListener("click", function () { var p = row.nextElementSibling; if (p && p.classList.contains("drill-panel")) { row.classList.toggle("open"); p.classList.toggle("open"); } }); }); }
  function initFilters() { var s = document.querySelector("[data-filters]"); if (s) s.addEventListener("change", function () { toast("🔄 View updated for selected filters", "info"); }); document.querySelectorAll("[data-download-report]").forEach(function (b) { b.addEventListener("click", function () { window.print(); }); }); }

  /* ===================== INTERACTIVE MATURITY MODEL ===================== */
  function initMaturity() {
    document.querySelectorAll("[data-maturity]").forEach(function (m) {
      m.querySelectorAll(".matrix-row").forEach(function (row) {
        var cells = row.querySelectorAll(".matrix-cell");
        cells.forEach(function (c) { c.addEventListener("click", function () { cells.forEach(function (x) { x.classList.remove("sel"); }); c.classList.add("sel"); summarize(m); }); });
      });
    });
    function summarize(m) {
      var out = m.querySelector("[data-maturity-out]"); if (!out) return;
      var rows = m.querySelectorAll(".matrix-row"), total = 0, n = 0;
      rows.forEach(function (r) { var sel = r.querySelector(".matrix-cell.sel"); if (sel) { total += parseInt(sel.getAttribute("data-lvl") || "0", 10); n++; } });
      if (!n) { out.textContent = ""; return; }
      var avg = total / n, stage = avg >= 3.5 ? "Transforming" : avg >= 2.5 ? "Advancing" : avg >= 1.5 ? "Developing" : "Initiating";
      out.innerHTML = '<div class="research"><span class="tag">Current Maturity</span><p style="margin:.3rem 0 0;">Across the dimensions you selected, this organization is at the <b>' + stage + '</b> stage (avg level ' + avg.toFixed(1) + ' of 4). ' + (n < rows.length ? '<span class="muted">Select all rows for a complete profile.</span>' : 'Use the <a href="blueprint.html">Transformation Blueprint</a> to plan the next stage.') + '</p></div>';
    }
  }

  /* ===================== TRANSFORMATION READINESS DIAGNOSTIC ===================== */
  function initAssessment() {
    var root = document.querySelector("[data-assessment]"); if (!root) return;
    root.querySelectorAll(".likert").forEach(function (lk) { lk.querySelectorAll("button").forEach(function (b) { b.addEventListener("click", function () { lk.querySelectorAll("button").forEach(function (x) { x.classList.remove("on"); }); b.classList.add("on"); }); }); });
    var btn = root.querySelector("[data-assess-run]"), out = document.querySelector("[data-assess-result]");
    if (btn) btn.addEventListener("click", compute);
    var reset = root.querySelector("[data-assess-reset]"); if (reset) reset.addEventListener("click", function () { root.querySelectorAll(".likert button.on").forEach(function (b) { b.classList.remove("on"); }); if (out) out.classList.remove("show"); LS.set(KEY.assess, null); toast("Diagnostic reset", "info"); });
    var saved = LS.get(KEY.assess, null); if (saved && out) render(saved);
    function compute() {
      var scores = {}, counts = {}; DIMENSIONS.forEach(function (d) { scores[d.id] = 0; counts[d.id] = 0; });
      var answered = 0;
      root.querySelectorAll(".assess-item").forEach(function (item) { var dom = item.getAttribute("data-domain") || "leadership"; var on = item.querySelector(".likert button.on"); if (on) { scores[dom] += parseInt(on.getAttribute("data-v") || on.textContent, 10) || 0; counts[dom] += 1; answered++; } });
      if (!answered) { toast("Rate the indicators to generate your Transformation Readiness Index", ""); return; }
      var pct = {}; DIMENSIONS.forEach(function (d) { pct[d.id] = counts[d.id] ? Math.round((scores[d.id] / (counts[d.id] * 5)) * 100) : 0; });
      var overall = Math.round(DIMENSIONS.reduce(function (s, d) { return s + pct[d.id]; }, 0) / DIMENSIONS.length);
      var data = { pct: pct, overall: overall }; LS.set(KEY.assess, data); render(data); if (out) out.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    function render(data) {
      if (!out) return;
      var ranked = DIMENSIONS.slice().sort(function (a, b) { return data.pct[b.id] - data.pct[a.id]; });
      var stage = data.overall >= 85 ? "Transforming" : data.overall >= 70 ? "Advancing" : data.overall >= 55 ? "Developing" : "Initiating";
      var bars = DIMENSIONS.map(function (d) { return '<div class="row"><span>' + d.ico + " " + d.name + '</span><span class="track"><span class="fill" data-pct="' + data.pct[d.id] + '" style="width:' + data.pct[d.id] + '%"></span></span><b>' + data.pct[d.id] + "%</b></div>"; }).join("");
      out.innerHTML =
        '<div class="overall" style="margin-bottom:1.2rem;"><div><div class="big-score">' + data.overall + '</div><div style="color:#d8f0eb;">Transformation Readiness Index</div></div><div style="display:flex;flex-direction:column;gap:.5rem;"><span class="grade">' + stage + ' stage</span><span style="color:#d8f0eb;font-size:.85rem;">across six transformation dimensions</span></div></div>' +
        '<div class="assess-card"><h3>Readiness by Dimension</h3><div class="barlist">' + bars + "</div></div>" +
        '<div class="assess-card"><h3>🌟 Transformation strengths</h3><ul>' + ranked.slice(0, 2).map(function (d) { return "<li><b>" + d.name + "</b> (" + data.pct[d.id] + "%) — a foundation to build from.</li>"; }).join("") + "</ul></div>" +
        '<div class="assess-card"><h3>🎯 Priority focus areas &amp; recommended frameworks</h3><ul>' + ranked.slice(-3).map(function (d) { return "<li><b>" + d.name + "</b> (" + data.pct[d.id] + "%) — " + recFor(d.id) + "</li>"; }).join("") + '</ul><div class="btn-row" style="margin-top:.6rem;"><a class="btn" href="blueprint.html">Build a Transformation Blueprint</a><a class="btn ghost" href="leadership-solutions.html">See Matching Solutions</a><button class="out-btn" data-assess-reset>Reset</button></div><p class="muted" style="font-size:.85rem;margin-top:.6rem;">An executive transformation diagnostic. Stages &amp; benchmarks are illustrative.</p></div>';
      out.classList.add("show");
      var r2 = out.querySelector("[data-assess-reset]"); if (r2) r2.addEventListener("click", function () { root.querySelectorAll(".likert button.on").forEach(function (b) { b.classList.remove("on"); }); out.classList.remove("show"); LS.set(KEY.assess, null); window.scrollTo({ top: 0, behavior: "smooth" }); });
      initBars();
    }
    function recFor(id) { return {
      leadership: "deploy the <a href='../principal-leadership/index.html'>Principal Leadership</a> &amp; <a href='../executive-leadership-growth/index.html'>Executive Leadership Growth</a> frameworks.",
      culture: "deploy <a href='../culture-by-design/index.html'>Culture by Design</a> &amp; <a href='../collaborative-learning-communities/index.html'>Collaborative Learning Communities</a>.",
      instruction: "deploy the <a href='../teaching-excellence/index.html'>Teaching Excellence</a> framework.",
      strategy: "deploy the <a href='../strategic-planning/index.html'>Strategic Planning Blueprint</a> &amp; <a href='../school-improvement/index.html'>School Improvement OS</a>.",
      talent: "deploy the <a href='../teacher-retention/index.html'>Teacher Retention</a> system.",
      innovation: "advance innovation &amp; future-readiness with the AI Suite &amp; change-leadership frameworks."
    }[id]; }
  }

  /* ===================== TRANSFORMATION BLUEPRINT GENERATOR ===================== */
  var BLUEPRINTS = {
    "School Transformation Blueprint": "a single-school transformation blueprint",
    "District Transformation Blueprint": "a district-wide transformation blueprint",
    "System / Ministry Transformation Blueprint": "a system / ministry transformation blueprint",
    "School Turnaround Plan": "a rapid school-turnaround plan",
    "Strategic Improvement Plan": "a multi-year strategic improvement plan",
    "100-Day Launch Plan": "a 100-day transformation launch plan"
  };
  function buildBlueprint(type, d) {
    var who = BLUEPRINTS[type] || BLUEPRINTS["School Transformation Blueprint"], client = val(d, "client", "the organization"), priority = val(d, "priority", "Leadership Capacity");
    return "<h3>" + esc(type) + "</h3><p class='muted'>" + esc(client) + " · lead priority: " + esc(priority) + " · " + who + "</p>" +
      "<h4>Phase 1 — Discover &amp; Diagnose</h4><p>Run the leadership audit, culture &amp; instructional review, and the Transformation Readiness diagnostic; produce an executive transformation report for " + esc(client) + ".</p>" +
      "<h4>Phase 2 — Design</h4><ul><li>Co-create vision &amp; strategic priorities anchored on <b>" + esc(priority) + "</b>.</li><li>Select the matching Leadership Suite frameworks.</li><li>Define a transformation roadmap with milestones &amp; success metrics.</li></ul>" +
      "<h4>Phase 3 — Develop</h4><ul><li>Build leadership capacity (coaching, academy, PLCs).</li><li>Strengthen culture, instruction &amp; retention in parallel workstreams.</li></ul>" +
      "<h4>Phase 4 — Deliver</h4><ul><li>Implement with short improvement cycles &amp; a live transformation dashboard.</li><li>Govern with clear roles, cadence &amp; accountability.</li></ul>" +
      "<h4>Phase 5 — Sustain</h4><ul><li>Embed continuous improvement, distributed leadership &amp; succession.</li><li>Review impact against the readiness index annually.</li></ul>" +
      "<h4>Expected Impact</h4><p>Integrated transformation is linked — in the leadership-and-retention research base — to stronger leadership, higher teacher retention, and improved school performance.</p>" +
      "<p class='muted' style='font-size:.85rem;'><span class='ai-pill'>👤 Consultant's draft</span> Generated from illustrative sample inputs — co-design with the client &amp; verify before use.</p>";
  }
  function initBlueprintGen() {
    document.querySelectorAll("[data-generator='blueprint']").forEach(function (form) {
      var out = document.querySelector("[data-output='blueprint']") || form.parentElement.querySelector(".gen-output"); var last = null;
      form.addEventListener("submit", function (e) { e.preventDefault(); last = collect(form); run(last, out); });
      if (out) out.addEventListener("click", function (e) { var b = e.target.closest("[data-act]"); if (!b) return; var act = b.getAttribute("data-act"); var body = out.querySelector(".out-body"); if (act === "copy") copyText(body ? body.innerText : ""); else if (act === "print") window.print(); else if (act === "regen") run(last || collect(form), out); });
    });
  }
  function collect(form) { var d = {}; form.querySelectorAll("input[name],select[name],textarea[name]").forEach(function (f) { d[f.name] = f.value; }); return d; }
  function run(data, out) { if (!out) return; var body = out.querySelector(".out-body"), bar = out.querySelector(".out-toolbar"); if (bar) bar.querySelectorAll("[data-act]").forEach(function (b) { b.disabled = true; }); if (body) body.innerHTML = '<p class="muted">✨ Drafting your blueprint…</p>'; setTimeout(function () { var type = val(data, "type", "School Transformation Blueprint"); if (body) body.innerHTML = buildBlueprint(type, data); if (bar) bar.querySelectorAll("[data-act]").forEach(function (b) { b.disabled = false; }); toast("Blueprint ready — co-design with the client", "ok"); }, 600); }

  function renderRailActive() { var here = location.pathname.split("/").pop() || "dashboard.html"; document.querySelectorAll(".rail-link").forEach(function (a) { if (a.getAttribute("href") === here) a.classList.add("active"); }); }
  window.CLP = { toast: toast, copy: copyText };
})();
