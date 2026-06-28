/* =====================================================================
   Leadership Intelligence — executive-BI interactivity engine
   Loads AFTER the shared portfolio.js. Adds:
     • Dark mode  • Command palette (Ctrl/⌘+K) + FAB  • Notifications
     • Toasts  • Count-up + gauges + bar animations + drill-downs
     • Leadership Scorecard (8 areas → Leadership Performance Score)
     • Executive report generator (board / district / ministry / leadership)
   ALL data is illustrative sample data; predictive views are decision-
   support models, not predictions of real individuals. Storage is localStorage.
   ===================================================================== */
(function () {
  "use strict";
  var LS = { get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  var KEY = { theme: "li:theme", scorecard: "li:scorecard" };

  var AREAS = [
    { id: "visionary", name: "Visionary Leadership", ico: "🔭" },
    { id: "instructional", name: "Instructional Leadership", ico: "📚" },
    { id: "people", name: "People Leadership", ico: "🤝" },
    { id: "operational", name: "Operational Leadership", ico: "🏛️" },
    { id: "strategic", name: "Strategic Leadership", ico: "🎯" },
    { id: "community", name: "Community Leadership", ico: "🌍" },
    { id: "innovation", name: "Innovation Leadership", ico: "💡" },
    { id: "ethical", name: "Ethical Leadership", ico: "⚖️" }
  ];

  var TOOLS = [
    { name: "Executive Dashboard",    ico: "📊", url: "dashboard.html",             desc: "Whole-organization view", group: "Overview" },
    { name: "Leadership Scorecard",   ico: "🧭", url: "leadership-scorecard.html",  desc: "Leadership performance", group: "Leadership" },
    { name: "School Performance",     ico: "🎓", url: "school-performance.html",    desc: "Academic & operational", group: "Performance" },
    { name: "People Analytics",       ico: "👥", url: "people-analytics.html",      desc: "Workforce intelligence", group: "Performance" },
    { name: "Teacher Retention",      ico: "💚", url: "teacher-retention.html",     desc: "Retention analytics", group: "Performance" },
    { name: "Strategic Performance",  ico: "📈", url: "strategic-performance.html", desc: "Goals & KPIs", group: "Performance" },
    { name: "School Health Index",    ico: "❤️", url: "school-health.html",         desc: "Organizational health", group: "Intelligence" },
    { name: "Predictive Insights",    ico: "🔮", url: "predictive-insights.html",   desc: "Forecasts & scenarios", group: "Intelligence" },
    { name: "Reports Center",         ico: "📄", url: "reports.html",               desc: "Executive reports", group: "Intelligence" },
    { name: "Resources",              ico: "📂", url: "resources.html",             desc: "Tools & templates", group: "Intelligence" }
  ];

  document.addEventListener("DOMContentLoaded", function () {
    initTheme(); buildChrome(); initThemeToggle(); initNotifications();
    initScorecard(); initReportGen(); initGauges(); initBars(); initCountUp(); initDrilldowns(); initFilters(); renderRailActive();
  });

  function initTheme() { if (LS.get(KEY.theme, "light") === "dark") document.body.classList.add("li-dark"); }
  function initThemeToggle() {
    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) { sync(b); b.addEventListener("click", function () { document.body.classList.toggle("li-dark"); var d = document.body.classList.contains("li-dark"); LS.set(KEY.theme, d ? "dark" : "light"); document.querySelectorAll("[data-theme-toggle]").forEach(sync); toast(d ? "🌙 Dark mode on" : "☀️ Light mode on", "info"); }); });
    function sync(b) { b.textContent = document.body.classList.contains("li-dark") ? "☀️" : "🌙"; }
  }

  function buildChrome() {
    if (document.querySelector("[data-no-chrome]")) return;
    if (!document.querySelector(".toast-wrap")) { var tw = document.createElement("div"); tw.className = "toast-wrap"; document.body.appendChild(tw); }
    if (!document.querySelector(".fab")) { var f = document.createElement("button"); f.className = "fab"; f.type = "button"; f.title = "Command palette (Ctrl/⌘ + K)"; f.setAttribute("aria-label", "Command palette"); f.textContent = "📊"; f.addEventListener("click", openPalette); document.body.appendChild(f); }
    if (!document.querySelector(".cmdk")) { var ov = document.createElement("div"); ov.className = "cmdk"; ov.innerHTML = '<div class="cmdk-box" role="dialog" aria-label="Command palette"><input class="cmdk-input" type="text" placeholder="Jump to a dashboard…" aria-label="Command search"><div class="cmdk-list"></div></div>'; document.body.appendChild(ov); ov.addEventListener("click", function (e) { if (e.target === ov) closePalette(); }); }
    bindPalette();
    document.addEventListener("keydown", function (e) { if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) { e.preventDefault(); openPalette(); } if (e.key === "Escape") { closePalette(); closeNotif(); } });
  }
  var palIndex = 0, palMatches = [];
  function paletteItems() { var inP = /leadership-intelligence/.test(location.pathname); var base = inP ? "" : "projects/leadership-intelligence/"; return TOOLS.map(function (t) { return { ico: t.ico, name: t.name, hint: t.desc, url: base + t.url }; }); }
  function bindPalette() {
    var input = document.querySelector(".cmdk-input"); if (!input) return;
    input.addEventListener("input", function () { renderPalette(input.value); });
    input.addEventListener("keydown", function (e) { if (e.key === "ArrowDown") { e.preventDefault(); palIndex = Math.min(palIndex + 1, palMatches.length - 1); hi(); } else if (e.key === "ArrowUp") { e.preventDefault(); palIndex = Math.max(palIndex - 1, 0); hi(); } else if (e.key === "Enter") { var m = palMatches[palIndex]; if (m) location.href = m.url; } });
    function hi() { var els = document.querySelectorAll(".cmdk-item"); els.forEach(function (el, i) { el.classList.toggle("active", i === palIndex); }); if (els[palIndex]) els[palIndex].scrollIntoView({ block: "nearest" }); }
  }
  function renderPalette(q) { var list = document.querySelector(".cmdk-list"); if (!list) return; q = (q || "").toLowerCase().trim(); var all = paletteItems(); palMatches = !q ? all : all.filter(function (a) { return (a.name + " " + a.hint).toLowerCase().indexOf(q) > -1; }); palIndex = 0; if (!palMatches.length) { list.innerHTML = '<div class="cmdk-empty">No match — try “scorecard”, “retention”, or “predictive”.</div>'; return; } list.innerHTML = palMatches.map(function (a, i) { return '<a class="cmdk-item' + (i === 0 ? " active" : "") + '" href="' + a.url + '"><span class="ico">' + a.ico + '</span><span>' + a.name + '</span><small>' + a.hint + "</small></a>"; }).join(""); }
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

  /* ===================== LEADERSHIP SCORECARD ===================== */
  function initScorecard() {
    var root = document.querySelector("[data-assessment]"); if (!root) return;
    root.querySelectorAll(".likert").forEach(function (lk) { lk.querySelectorAll("button").forEach(function (b) { b.addEventListener("click", function () { lk.querySelectorAll("button").forEach(function (x) { x.classList.remove("on"); }); b.classList.add("on"); }); }); });
    var btn = root.querySelector("[data-assess-run]"), out = document.querySelector("[data-assess-result]");
    if (btn) btn.addEventListener("click", compute);
    var reset = root.querySelector("[data-assess-reset]"); if (reset) reset.addEventListener("click", function () { root.querySelectorAll(".likert button.on").forEach(function (b) { b.classList.remove("on"); }); if (out) out.classList.remove("show"); LS.set(KEY.scorecard, null); toast("Scorecard reset", "info"); });
    var saved = LS.get(KEY.scorecard, null); if (saved && out) render(saved);
    function compute() {
      var scores = {}, counts = {}; AREAS.forEach(function (d) { scores[d.id] = 0; counts[d.id] = 0; });
      var answered = 0;
      root.querySelectorAll(".assess-item").forEach(function (item) { var dom = item.getAttribute("data-domain") || "visionary"; var on = item.querySelector(".likert button.on"); if (on) { scores[dom] += parseInt(on.getAttribute("data-v") || on.textContent, 10) || 0; counts[dom] += 1; answered++; } });
      if (!answered) { toast("Rate the indicators to generate your Leadership Performance Score", ""); return; }
      var pct = {}; AREAS.forEach(function (d) { pct[d.id] = counts[d.id] ? Math.round((scores[d.id] / (counts[d.id] * 5)) * 100) : 0; });
      var overall = Math.round(AREAS.reduce(function (s, d) { return s + pct[d.id]; }, 0) / AREAS.length);
      var data = { pct: pct, overall: overall }; LS.set(KEY.scorecard, data); render(data); if (out) out.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    function render(data) {
      if (!out) return;
      var ranked = AREAS.slice().sort(function (a, b) { return data.pct[b.id] - data.pct[a.id]; });
      var grade = data.overall >= 90 ? "A" : data.overall >= 80 ? "B+" : data.overall >= 70 ? "B" : data.overall >= 60 ? "C" : "Developing";
      var band = data.overall >= 80 ? "green" : data.overall >= 65 ? "indigo" : data.overall >= 50 ? "amber" : "red";
      var bars = AREAS.map(function (d) { return '<div class="row"><span>' + d.ico + " " + d.name + '</span><span class="track"><span class="fill" data-pct="' + data.pct[d.id] + '" style="width:' + data.pct[d.id] + '%"></span></span><b>' + data.pct[d.id] + "%</b></div>"; }).join("");
      out.innerHTML =
        '<div class="overall" style="margin-bottom:1.2rem;"><div><div class="big-score">' + data.overall + '</div><div style="color:#dbe3f5;">Leadership Performance Score</div></div><div style="display:flex;flex-direction:column;gap:.5rem;"><span class="grade">Grade ' + grade + '</span><span style="color:#cfe0f0;font-size:.85rem;">vs. benchmark 74 (illustrative)</span></div></div>' +
        '<div class="assess-card"><h3>Performance by Leadership Domain</h3><div class="barlist">' + bars + "</div></div>" +
        '<div class="assess-card"><h3>🌟 Leadership strengths</h3><ul>' + ranked.slice(0, 2).map(function (d) { return "<li><b>" + d.name + "</b> (" + data.pct[d.id] + "%)</li>"; }).join("") + "</ul></div>" +
        '<div class="assess-card"><h3>🎯 Recommended actions</h3><ul>' + ranked.slice(-2).map(function (d) { return "<li><b>" + d.name + "</b> (" + data.pct[d.id] + "%) — " + actionFor(d.id) + "</li>"; }).join("") + '</ul><div class="btn-row" style="margin-top:.6rem;"><a class="btn" href="dashboard.html">Back to Dashboard</a><button class="out-btn" data-assess-reset>Reset</button></div><p class="muted" style="font-size:.85rem;margin-top:.6rem;">A reflective leadership self-evaluation. Benchmark figures are illustrative.</p></div>';
      out.classList.add("show");
      var r2 = out.querySelector("[data-assess-reset]"); if (r2) r2.addEventListener("click", function () { root.querySelectorAll(".likert button.on").forEach(function (b) { b.classList.remove("on"); }); out.classList.remove("show"); LS.set(KEY.scorecard, null); window.scrollTo({ top: 0, behavior: "smooth" }); });
      initBars();
    }
    function actionFor(id) { return {
      visionary: "sharpen and communicate the vision with measurable goals.",
      instructional: "increase walkthroughs &amp; coaching cadence.",
      people: "strengthen recognition, voice &amp; retention practices.",
      operational: "streamline systems &amp; protect teacher time.",
      strategic: "align resources to a few high-leverage priorities.",
      community: "deepen family &amp; community engagement.",
      innovation: "create safe space to pilot &amp; scale ideas.",
      ethical: "make values-based, transparent decisions visible."
    }[id]; }
  }

  /* ===================== EXECUTIVE REPORT GENERATOR ===================== */
  var REPORTS = {
    "Board Report": "for the Board of Education",
    "Principal Report": "for the principal's leadership review",
    "District Report": "for the district / superintendent",
    "Ministry Report": "for the Ministry of Education",
    "School Improvement Report": "for the school-improvement team",
    "Leadership Performance Review": "summarizing leadership effectiveness",
    "Teacher Retention Report": "summarizing retention & workforce health",
    "Strategic Progress Report": "summarizing strategic goal progress"
  };
  function buildReport(type, d) {
    var who = REPORTS[type] || REPORTS["Board Report"], org = val(d, "org", "Sample School District"), term = val(d, "term", "This Year");
    return "<h3>" + esc(type) + "</h3><p class='muted'>" + esc(org) + " · " + esc(term) + " · prepared " + who + "</p>" +
      "<h4>Executive Summary</h4><p>Leadership Performance Index is <b>82 (B+)</b>, ▲3. Teacher retention is <b>88%</b> and engagement <b>▲5%</b>. Watch areas: Grade-8 math and chronic absenteeism. Strategic goals are <b>74%</b> on track.</p>" +
      "<h4>Key Indicators</h4><ul><li>School Health Index: <b>80</b> (▲4)</li><li>Teacher retention: <b>88%</b> (▲)</li><li>Teacher engagement: <b>84%</b></li><li>Student growth: <b>+4%</b></li><li>Strategic goals on track: <b>74%</b></li></ul>" +
      "<h4>Highlights</h4><ul><li>Recognition &amp; voice initiatives linked to engagement gains.</li><li>Three improvement initiatives met milestones.</li></ul>" +
      "<h4>Priorities &amp; Recommendations</h4><ul><li>Math instructional-improvement cycle.</li><li>Tiered attendance initiative.</li><li>Sustain retention-focused leadership behaviors.</li></ul>" +
      "<p class='muted' style='font-size:.85rem;'><span class='ai-pill'>👤 Human review</span> Generated from illustrative sample data — verify figures before distribution.</p>";
  }
  function initReportGen() {
    document.querySelectorAll("[data-generator='report']").forEach(function (form) {
      var out = document.querySelector("[data-output='report']") || form.parentElement.querySelector(".gen-output"); var last = null;
      form.addEventListener("submit", function (e) { e.preventDefault(); last = collect(form); run(last, out); });
      if (out) out.addEventListener("click", function (e) { var b = e.target.closest("[data-act]"); if (!b) return; var act = b.getAttribute("data-act"); var body = out.querySelector(".out-body"); if (act === "copy") copyText(body ? body.innerText : ""); else if (act === "print") window.print(); else if (act === "regen") run(last || collect(form), out); });
    });
  }
  function collect(form) { var d = {}; form.querySelectorAll("input[name],select[name],textarea[name]").forEach(function (f) { d[f.name] = f.value; }); return d; }
  function run(data, out) { if (!out) return; var body = out.querySelector(".out-body"), bar = out.querySelector(".out-toolbar"); if (bar) bar.querySelectorAll("[data-act]").forEach(function (b) { b.disabled = true; }); if (body) body.innerHTML = '<p class="muted">✨ Generating report…</p>'; setTimeout(function () { var type = val(data, "type", "Board Report"); if (body) body.innerHTML = buildReport(type, data); if (bar) bar.querySelectorAll("[data-act]").forEach(function (b) { b.disabled = false; }); toast("Report ready — review before sharing", "ok"); }, 600); }

  function renderRailActive() { var here = location.pathname.split("/").pop() || "dashboard.html"; document.querySelectorAll(".rail-link").forEach(function (a) { if (a.getAttribute("href") === here) a.classList.add("active"); }); }
  window.LI = { toast: toast, copy: copyText };
})();
