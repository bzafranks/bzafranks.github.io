/* =====================================================================
   National Leadership Excellence Initiative — platform interactivity engine
   Loads AFTER the shared portfolio.js. Adds:
     • Dark mode  • Command palette (Ctrl/⌘+K) + FAB  • Notifications
     • Toasts  • Count-up + gauges + bar animations + drill-downs
     • National Leadership System Readiness Assessment (6 domains → Index)
     • Policy / leadership brief generator
   ALL data is illustrative sample data. Storage is localStorage.
   ===================================================================== */
(function () {
  "use strict";
  var LS = { get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  var KEY = { theme: "nle:theme", assess: "nle:assess" };

  var DOMAINS = [
    { id: "standards",     name: "National Standards & Competencies", ico: "📐" },
    { id: "pipeline",      name: "Leadership Pipeline & Talent",       ico: "🔑" },
    { id: "academy",       name: "Preparation & Academy",             ico: "🎓" },
    { id: "certification", name: "Certification & Licensure",         ico: "📜" },
    { id: "succession",    name: "Succession & Continuity",           ico: "🔄" },
    { id: "governance",    name: "Governance & Policy",               ico: "🏛️" }
  ];

  var TOOLS = [
    { name: "National Dashboard",    ico: "📊", url: "dashboard.html",            desc: "System-wide overview",   group: "Overview" },
    { name: "National Strategy",     ico: "🧭", url: "strategy.html",            desc: "Vision & priorities",    group: "Strategy" },
    { name: "Leadership Standards",  ico: "📐", url: "leadership-standards.html", desc: "National competencies",  group: "Strategy" },
    { name: "Leadership Pipeline",   ico: "🔑", url: "pipeline.html",            desc: "Talent & pathways",      group: "Develop" },
    { name: "Leadership Academy",    ico: "🎓", url: "academy.html",             desc: "Preparation & PD",       group: "Develop" },
    { name: "Certification",         ico: "📜", url: "certification.html",       desc: "Licensure & credentials",group: "Develop" },
    { name: "Succession Planning",   ico: "🔄", url: "succession.html",          desc: "Continuity & readiness", group: "Develop" },
    { name: "Policy & Governance",   ico: "🏛️", url: "policy.html",              desc: "Policy & accountability",group: "Govern" },
    { name: "Implementation Roadmap",ico: "🗺️", url: "roadmap.html",             desc: "Five-phase rollout",     group: "Govern" },
    { name: "Resources",             ico: "📦", url: "resources.html",           desc: "Toolkits & reading",     group: "Govern" }
  ];

  document.addEventListener("DOMContentLoaded", function () {
    initTheme(); buildChrome(); initThemeToggle(); initNotifications();
    initAssessment(); initBriefGen();
    initGauges(); initBars(); initCountUp(); initDrilldowns(); initFilters(); renderRailActive();
  });

  function initTheme() { if (LS.get(KEY.theme, "light") === "dark") document.body.classList.add("nle-dark"); }
  function initThemeToggle() {
    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) { sync(b); b.addEventListener("click", function () { document.body.classList.toggle("nle-dark"); var d = document.body.classList.contains("nle-dark"); LS.set(KEY.theme, d ? "dark" : "light"); document.querySelectorAll("[data-theme-toggle]").forEach(sync); toast(d ? "🌙 Dark mode on" : "☀️ Light mode on", "info"); }); });
    function sync(b) { b.textContent = document.body.classList.contains("nle-dark") ? "☀️" : "🌙"; }
  }

  function buildChrome() {
    if (document.querySelector("[data-no-chrome]")) return;
    if (!document.querySelector(".toast-wrap")) { var tw = document.createElement("div"); tw.className = "toast-wrap"; document.body.appendChild(tw); }
    if (!document.querySelector(".fab")) { var f = document.createElement("button"); f.className = "fab"; f.type = "button"; f.title = "Command palette (Ctrl/⌘ + K)"; f.setAttribute("aria-label", "Command palette"); f.textContent = "🏛️"; f.addEventListener("click", openPalette); document.body.appendChild(f); }
    if (!document.querySelector(".cmdk")) { var ov = document.createElement("div"); ov.className = "cmdk"; ov.innerHTML = '<div class="cmdk-box" role="dialog" aria-label="Command palette"><input class="cmdk-input" type="text" placeholder="Jump to a section…" aria-label="Command search"><div class="cmdk-list"></div></div>'; document.body.appendChild(ov); ov.addEventListener("click", function (e) { if (e.target === ov) closePalette(); }); }
    bindPalette();
    document.addEventListener("keydown", function (e) { if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) { e.preventDefault(); openPalette(); } if (e.key === "Escape") { closePalette(); closeNotif(); } });
  }
  var palIndex = 0, palMatches = [];
  function paletteItems() { var inP = /national-leadership-excellence/.test(location.pathname); var base = inP ? "" : "projects/national-leadership-excellence/"; return TOOLS.map(function (t) { return { ico: t.ico, name: t.name, hint: t.desc, url: base + t.url }; }); }
  function bindPalette() {
    var input = document.querySelector(".cmdk-input"); if (!input) return;
    input.addEventListener("input", function () { renderPalette(input.value); });
    input.addEventListener("keydown", function (e) { if (e.key === "ArrowDown") { e.preventDefault(); palIndex = Math.min(palIndex + 1, palMatches.length - 1); hi(); } else if (e.key === "ArrowUp") { e.preventDefault(); palIndex = Math.max(palIndex - 1, 0); hi(); } else if (e.key === "Enter") { var m = palMatches[palIndex]; if (m) location.href = m.url; } });
    function hi() { var els = document.querySelectorAll(".cmdk-item"); els.forEach(function (el, i) { el.classList.toggle("active", i === palIndex); }); if (els[palIndex]) els[palIndex].scrollIntoView({ block: "nearest" }); }
  }
  function renderPalette(q) { var list = document.querySelector(".cmdk-list"); if (!list) return; q = (q || "").toLowerCase().trim(); var all = paletteItems(); palMatches = !q ? all : all.filter(function (a) { return (a.name + " " + a.hint).toLowerCase().indexOf(q) > -1; }); palIndex = 0; if (!palMatches.length) { list.innerHTML = '<div class="cmdk-empty">No match — try “pipeline”, “certification”, or “roadmap”.</div>'; return; } list.innerHTML = palMatches.map(function (a, i) { return '<a class="cmdk-item' + (i === 0 ? " active" : "") + '" href="' + a.url + '"><span class="ico">' + a.ico + '</span><span>' + a.name + '</span><small>' + a.hint + "</small></a>"; }).join(""); }
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

  /* ===================== NATIONAL READINESS ASSESSMENT ===================== */
  function initAssessment() {
    var root = document.querySelector("[data-assessment]"); if (!root) return;
    root.querySelectorAll(".likert").forEach(function (lk) { lk.querySelectorAll("button").forEach(function (b) { b.addEventListener("click", function () { lk.querySelectorAll("button").forEach(function (x) { x.classList.remove("on"); }); b.classList.add("on"); }); }); });
    var btn = root.querySelector("[data-assess-run]"), out = document.querySelector("[data-assess-result]");
    if (btn) btn.addEventListener("click", compute);
    var reset = root.querySelector("[data-assess-reset]"); if (reset) reset.addEventListener("click", function () { root.querySelectorAll(".likert button.on").forEach(function (b) { b.classList.remove("on"); }); if (out) out.classList.remove("show"); LS.set(KEY.assess, null); toast("Assessment reset", "info"); });
    var saved = LS.get(KEY.assess, null); if (saved && out) render(saved);
    function compute() {
      var scores = {}, counts = {}; DOMAINS.forEach(function (d) { scores[d.id] = 0; counts[d.id] = 0; });
      var answered = 0;
      root.querySelectorAll(".assess-item").forEach(function (item) { var dom = item.getAttribute("data-domain") || "standards"; var on = item.querySelector(".likert button.on"); if (on) { scores[dom] += parseInt(on.getAttribute("data-v") || on.textContent, 10) || 0; counts[dom] += 1; answered++; } });
      if (!answered) { toast("Rate the indicators to generate your National Readiness Index", ""); return; }
      var pct = {}; DOMAINS.forEach(function (d) { pct[d.id] = counts[d.id] ? Math.round((scores[d.id] / (counts[d.id] * 5)) * 100) : 0; });
      var overall = Math.round(DOMAINS.reduce(function (s, d) { return s + pct[d.id]; }, 0) / DOMAINS.length);
      var data = { pct: pct, overall: overall }; LS.set(KEY.assess, data); render(data); if (out) out.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    function render(data) {
      if (!out) return;
      var ranked = DOMAINS.slice().sort(function (a, b) { return data.pct[b.id] - data.pct[a.id]; });
      var stage = data.overall >= 85 ? "Leading" : data.overall >= 70 ? "Established" : data.overall >= 55 ? "Emerging" : "Foundational";
      var bars = DOMAINS.map(function (d) { return '<div class="row"><span>' + d.ico + " " + d.name + '</span><span class="track"><span class="fill" data-pct="' + data.pct[d.id] + '" style="width:' + data.pct[d.id] + '%"></span></span><b>' + data.pct[d.id] + "%</b></div>"; }).join("");
      out.innerHTML =
        '<div class="overall" style="margin-bottom:1.2rem;"><div><div class="big-score">' + data.overall + '</div><div style="color:#e9f1ec;">National Leadership System Readiness</div></div><div style="display:flex;flex-direction:column;gap:.5rem;"><span class="grade">' + stage + ' System</span><span style="color:#e9f1ec;font-size:.85rem;">across six system capacities</span></div></div>' +
        '<div class="assess-card"><h3>Capacity by System Dimension</h3><div class="barlist">' + bars + "</div></div>" +
        '<div class="assess-card"><h3>🌟 System strengths</h3><ul>' + ranked.slice(0, 2).map(function (d) { return "<li><b>" + d.name + "</b> (" + data.pct[d.id] + "%)</li>"; }).join("") + "</ul></div>" +
        '<div class="assess-card"><h3>🎯 National priorities</h3><ul>' + ranked.slice(-2).map(function (d) { return "<li><b>" + d.name + "</b> (" + data.pct[d.id] + "%) — " + actionFor(d.id) + "</li>"; }).join("") + '</ul><div class="btn-row" style="margin-top:.6rem;"><a class="btn" href="roadmap.html">See the Implementation Roadmap</a><a class="btn ghost" href="dashboard.html">Open the National Dashboard</a><button class="out-btn" data-assess-reset>Reset</button></div><p class="muted" style="font-size:.85rem;margin-top:.6rem;">A system-level diagnostic for ministry &amp; regional leaders. Stages &amp; benchmarks are illustrative.</p></div>';
      out.classList.add("show");
      var r2 = out.querySelector("[data-assess-reset]"); if (r2) r2.addEventListener("click", function () { root.querySelectorAll(".likert button.on").forEach(function (b) { b.classList.remove("on"); }); out.classList.remove("show"); LS.set(KEY.assess, null); window.scrollTo({ top: 0, behavior: "smooth" }); });
      initBars();
    }
    function actionFor(id) { return {
      standards: "adopt &amp; benchmark national leadership standards against international frameworks.",
      pipeline: "build a structured talent pipeline from teacher leadership upward.",
      academy: "establish a national leadership academy for preparation &amp; PD.",
      certification: "introduce competency-based certification &amp; licensure renewal.",
      succession: "create talent pools &amp; retirement forecasting to ensure continuity.",
      governance: "strengthen governance, funding &amp; accountability for leadership."
    }[id]; }
  }

  /* ===================== POLICY / LEADERSHIP BRIEF GENERATOR ===================== */
  var BRIEFS = {
    "National Leadership Strategy Brief": "a strategy brief for the Ministry of Education",
    "Cabinet / Minister Briefing": "a briefing for the Minister & Cabinet",
    "Development Partner Brief": "a brief for development partners (World Bank / UNESCO)",
    "Regional Implementation Brief": "an implementation brief for a regional authority",
    "Annual National Leadership Report": "an annual report on national leadership capacity",
    "Succession Outlook Brief": "a national leadership succession outlook"
  };
  function buildBrief(type, d) {
    var who = BRIEFS[type] || BRIEFS["National Leadership Strategy Brief"], nation = val(d, "nation", "the nation"), horizon = val(d, "horizon", "Five-year horizon");
    return "<h3>" + esc(type) + "</h3><p class='muted'>" + esc(nation) + " · " + esc(horizon) + " · prepared as " + who + "</p>" +
      "<h4>Purpose</h4><p>To strengthen educational leadership as the central lever for school improvement, teacher retention, and student outcomes across " + esc(nation) + ".</p>" +
      "<h4>System Snapshot (illustrative)</h4><ul><li>National Readiness Index: <b>72 — Established</b></li><li>Certified leaders: <b>78%</b></li><li>Succession readiness: <b>64%</b></li><li>Critical leadership vacancies: <b>↓ 9%</b></li></ul>" +
      "<h4>Strategic Priorities</h4><ul><li>Adopt &amp; benchmark national leadership standards.</li><li>Launch a national leadership academy &amp; pipeline.</li><li>Introduce competency-based certification &amp; licensure.</li><li>Build succession &amp; continuity systems region by region.</li></ul>" +
      "<h4>Governance &amp; Funding</h4><ul><li>A national leadership board with regional implementation units.</li><li>Multi-year funding tied to clear performance indicators.</li></ul>" +
      "<h4>Expected Impact</h4><p>Stronger leadership capacity is linked — in the leadership-and-retention research base — to higher teacher satisfaction, lower turnover, and improved school performance.</p>" +
      "<p class='muted' style='font-size:.85rem;'><span class='ai-pill'>👤 Policy draft</span> Generated from illustrative sample data — adapt to national context &amp; verify figures before distribution.</p>";
  }
  function initBriefGen() {
    document.querySelectorAll("[data-generator='brief']").forEach(function (form) {
      var out = document.querySelector("[data-output='brief']") || form.parentElement.querySelector(".gen-output"); var last = null;
      form.addEventListener("submit", function (e) { e.preventDefault(); last = collect(form); run(last, out); });
      if (out) out.addEventListener("click", function (e) { var b = e.target.closest("[data-act]"); if (!b) return; var act = b.getAttribute("data-act"); var body = out.querySelector(".out-body"); if (act === "copy") copyText(body ? body.innerText : ""); else if (act === "print") window.print(); else if (act === "regen") run(last || collect(form), out); });
    });
  }
  function collect(form) { var d = {}; form.querySelectorAll("input[name],select[name],textarea[name]").forEach(function (f) { d[f.name] = f.value; }); return d; }
  function run(data, out) { if (!out) return; var body = out.querySelector(".out-body"), bar = out.querySelector(".out-toolbar"); if (bar) bar.querySelectorAll("[data-act]").forEach(function (b) { b.disabled = true; }); if (body) body.innerHTML = '<p class="muted">✨ Drafting your brief…</p>'; setTimeout(function () { var type = val(data, "type", "National Leadership Strategy Brief"); if (body) body.innerHTML = buildBrief(type, data); if (bar) bar.querySelectorAll("[data-act]").forEach(function (b) { b.disabled = false; }); toast("Brief ready — review before distribution", "ok"); }, 600); }

  function renderRailActive() { var here = location.pathname.split("/").pop() || "dashboard.html"; document.querySelectorAll(".rail-link").forEach(function (a) { if (a.getAttribute("href") === here) a.classList.add("active"); }); }
  window.NLE = { toast: toast, copy: copyText };
})();
