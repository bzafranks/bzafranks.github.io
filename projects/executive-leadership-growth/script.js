/* =====================================================================
   Executive Leadership Growth System — platform interactivity engine
   Loads AFTER the shared portfolio.js. Adds:
     • Dark mode  • Command palette (Ctrl/⌘+K) + FAB  • Notifications
     • Toasts  • Count-up + gauges + bar animations + drill-downs
     • Leadership Self / 360° Assessment (6 domains → Leadership Index)
     • Executive coaching / growth-plan generator
     • Saved Growth Plan builder (localStorage)
     • Reflection journal (localStorage)
   ALL data is illustrative sample data. Storage is localStorage.
   ===================================================================== */
(function () {
  "use strict";
  var LS = { get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  var KEY = { theme: "elg:theme", assess: "elg:assess", plan: "elg:plan", journal: "elg:journal" };

  var DOMAINS = [
    { id: "visionary",     name: "Visionary Leadership",     ico: "🔭" },
    { id: "instructional", name: "Instructional Leadership",  ico: "📚" },
    { id: "people",        name: "People Leadership",         ico: "🤝" },
    { id: "strategic",     name: "Strategic Leadership",      ico: "🎯" },
    { id: "operational",   name: "Operational Leadership",    ico: "🏛️" },
    { id: "ethical",       name: "Ethical Leadership",        ico: "⚖️" }
  ];

  var TOOLS = [
    { name: "Performance Dashboard", ico: "📊", url: "dashboard.html",             desc: "Executive overview",     group: "Overview" },
    { name: "Evaluation Framework",  ico: "🧭", url: "evaluation-framework.html",  desc: "Six leadership domains", group: "Framework" },
    { name: "Leadership Standards",  ico: "📐", url: "leadership-standards.html",   desc: "Competency progression", group: "Framework" },
    { name: "360° Feedback",         ico: "🔄", url: "360-feedback.html",          desc: "Multi-source feedback",  group: "Growth" },
    { name: "Executive Coaching",    ico: "🎓", url: "executive-coaching.html",    desc: "Coaching & reflection",  group: "Growth" },
    { name: "Growth Plans",          ico: "🌱", url: "growth-plans.html",          desc: "Development planning",   group: "Growth" },
    { name: "Leadership Portfolio",  ico: "📁", url: "leadership-portfolio.html",  desc: "Evidence of leadership", group: "Growth" },
    { name: "Leadership Analytics",  ico: "📈", url: "analytics.html",             desc: "Growth & impact trends", group: "Intelligence" },
    { name: "Resources",             ico: "📦", url: "resources.html",             desc: "Tools & templates",      group: "Intelligence" }
  ];

  document.addEventListener("DOMContentLoaded", function () {
    initTheme(); buildChrome(); initThemeToggle(); initNotifications();
    initAssessment(); initPlanGen(); initPlanBuilder(); initJournal();
    initGauges(); initBars(); initCountUp(); initDrilldowns(); initFilters(); renderRailActive();
  });

  function initTheme() { if (LS.get(KEY.theme, "light") === "dark") document.body.classList.add("elg-dark"); }
  function initThemeToggle() {
    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) { sync(b); b.addEventListener("click", function () { document.body.classList.toggle("elg-dark"); var d = document.body.classList.contains("elg-dark"); LS.set(KEY.theme, d ? "dark" : "light"); document.querySelectorAll("[data-theme-toggle]").forEach(sync); toast(d ? "🌙 Dark mode on" : "☀️ Light mode on", "info"); }); });
    function sync(b) { b.textContent = document.body.classList.contains("elg-dark") ? "☀️" : "🌙"; }
  }

  function buildChrome() {
    if (document.querySelector("[data-no-chrome]")) return;
    if (!document.querySelector(".toast-wrap")) { var tw = document.createElement("div"); tw.className = "toast-wrap"; document.body.appendChild(tw); }
    if (!document.querySelector(".fab")) { var f = document.createElement("button"); f.className = "fab"; f.type = "button"; f.title = "Command palette (Ctrl/⌘ + K)"; f.setAttribute("aria-label", "Command palette"); f.textContent = "🎓"; f.addEventListener("click", openPalette); document.body.appendChild(f); }
    if (!document.querySelector(".cmdk")) { var ov = document.createElement("div"); ov.className = "cmdk"; ov.innerHTML = '<div class="cmdk-box" role="dialog" aria-label="Command palette"><input class="cmdk-input" type="text" placeholder="Jump to a tool…" aria-label="Command search"><div class="cmdk-list"></div></div>'; document.body.appendChild(ov); ov.addEventListener("click", function (e) { if (e.target === ov) closePalette(); }); }
    bindPalette();
    document.addEventListener("keydown", function (e) { if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) { e.preventDefault(); openPalette(); } if (e.key === "Escape") { closePalette(); closeNotif(); } });
  }
  var palIndex = 0, palMatches = [];
  function paletteItems() { var inP = /executive-leadership-growth/.test(location.pathname); var base = inP ? "" : "projects/executive-leadership-growth/"; return TOOLS.map(function (t) { return { ico: t.ico, name: t.name, hint: t.desc, url: base + t.url }; }); }
  function bindPalette() {
    var input = document.querySelector(".cmdk-input"); if (!input) return;
    input.addEventListener("input", function () { renderPalette(input.value); });
    input.addEventListener("keydown", function (e) { if (e.key === "ArrowDown") { e.preventDefault(); palIndex = Math.min(palIndex + 1, palMatches.length - 1); hi(); } else if (e.key === "ArrowUp") { e.preventDefault(); palIndex = Math.max(palIndex - 1, 0); hi(); } else if (e.key === "Enter") { var m = palMatches[palIndex]; if (m) location.href = m.url; } });
    function hi() { var els = document.querySelectorAll(".cmdk-item"); els.forEach(function (el, i) { el.classList.toggle("active", i === palIndex); }); if (els[palIndex]) els[palIndex].scrollIntoView({ block: "nearest" }); }
  }
  function renderPalette(q) { var list = document.querySelector(".cmdk-list"); if (!list) return; q = (q || "").toLowerCase().trim(); var all = paletteItems(); palMatches = !q ? all : all.filter(function (a) { return (a.name + " " + a.hint).toLowerCase().indexOf(q) > -1; }); palIndex = 0; if (!palMatches.length) { list.innerHTML = '<div class="cmdk-empty">No match — try “coaching”, “360”, or “growth”.</div>'; return; } list.innerHTML = palMatches.map(function (a, i) { return '<a class="cmdk-item' + (i === 0 ? " active" : "") + '" href="' + a.url + '"><span class="ico">' + a.ico + '</span><span>' + a.name + '</span><small>' + a.hint + "</small></a>"; }).join(""); }
  function openPalette() { var ov = document.querySelector(".cmdk"); if (!ov) return; ov.classList.add("open"); renderPalette(""); var i = ov.querySelector(".cmdk-input"); if (i) { i.value = ""; i.focus(); } }
  function closePalette() { var ov = document.querySelector(".cmdk"); if (ov) ov.classList.remove("open"); }

  function initNotifications() { var wrap = document.querySelector("[data-notif]"); if (!wrap) return; var btn = wrap.querySelector(".notif-btn"), panel = wrap.querySelector(".notif-panel"); if (btn && panel) { btn.addEventListener("click", function (e) { e.stopPropagation(); panel.classList.toggle("open"); }); document.addEventListener("click", function () { panel.classList.remove("open"); }); panel.addEventListener("click", function (e) { e.stopPropagation(); }); } }
  function closeNotif() { var p = document.querySelector(".notif-panel"); if (p) p.classList.remove("open"); }

  function toast(msg, kind) { var w = document.querySelector(".toast-wrap"); if (!w) return; var t = document.createElement("div"); t.className = "toast " + (kind || ""); t.textContent = msg; w.appendChild(t); setTimeout(function () { t.style.opacity = "0"; t.style.transition = "opacity .3s"; setTimeout(function () { t.remove(); }, 320); }, 2400); }
  function copyText(text) { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { toast("📋 Copied", "ok"); }, function () { toast("Copy failed", ""); }); else toast("Clipboard unavailable", ""); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function val(d, k, fb) { return d && d[k] ? d[k] : fb; }
  function now() { try { return new Date().toLocaleString(); } catch (e) { return ""; } }

  function obsRun(els, fn) { if (!els.length) return; if ("IntersectionObserver" in window) { var o = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { fn(e.target); o.unobserve(e.target); } }); }, { threshold: 0.3 }); els.forEach(function (e) { o.observe(e); }); } else els.forEach(fn); }
  function initGauges() { obsRun(document.querySelectorAll("[data-gauge]"), function (el) { var t = parseFloat(el.getAttribute("data-gauge")) || 0, dur = 1100, start = null, num = el.querySelector("[data-gauge-num]"); function step(ts) { if (!start) start = ts; var p = Math.min((ts - start) / dur, 1); var v = t * (0.5 - Math.cos(p * Math.PI) / 2); el.style.setProperty("--val", v.toFixed(1)); if (num) num.textContent = Math.round(v) + (el.getAttribute("data-gauge-suffix") || ""); if (p < 1) requestAnimationFrame(step); } requestAnimationFrame(step); }); }
  function initBars() { obsRun(document.querySelectorAll(".barlist .fill[data-pct]"), function (el) { var p = el.getAttribute("data-pct"); el.style.width = "0%"; requestAnimationFrame(function () { el.style.transition = "width .9s ease"; el.style.width = p + "%"; }); }); obsRun(document.querySelectorAll(".barchart .bar[data-h]"), function (el) { var h = el.getAttribute("data-h"); el.style.height = "0%"; requestAnimationFrame(function () { el.style.height = h + "%"; }); }); }
  function initCountUp() { obsRun(document.querySelectorAll("[data-count]"), function (el) { var t = parseFloat(el.getAttribute("data-count")), suf = el.getAttribute("data-suffix") || "", pre = el.getAttribute("data-prefix") || "", dur = 1000, start = null; function step(ts) { if (!start) start = ts; var p = Math.min((ts - start) / dur, 1); var v = t * (0.5 - Math.cos(p * Math.PI) / 2); el.textContent = pre + (t % 1 === 0 ? Math.round(v) : v.toFixed(1)) + suf; if (p < 1) requestAnimationFrame(step); } requestAnimationFrame(step); }); }
  function initDrilldowns() { document.querySelectorAll(".drill-row").forEach(function (row) { row.addEventListener("click", function () { var p = row.nextElementSibling; if (p && p.classList.contains("drill-panel")) { row.classList.toggle("open"); p.classList.toggle("open"); } }); }); }
  function initFilters() { var s = document.querySelector("[data-filters]"); if (s) s.addEventListener("change", function () { toast("🔄 View updated for selected filters", "info"); }); document.querySelectorAll("[data-download-report]").forEach(function (b) { b.addEventListener("click", function () { window.print(); }); }); }

  /* ===================== LEADERSHIP ASSESSMENT (self / 360) ===================== */
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
      root.querySelectorAll(".assess-item").forEach(function (item) { var dom = item.getAttribute("data-domain") || "visionary"; var on = item.querySelector(".likert button.on"); if (on) { scores[dom] += parseInt(on.getAttribute("data-v") || on.textContent, 10) || 0; counts[dom] += 1; answered++; } });
      if (!answered) { toast("Rate the indicators to generate your Leadership Performance Index", ""); return; }
      var pct = {}; DOMAINS.forEach(function (d) { pct[d.id] = counts[d.id] ? Math.round((scores[d.id] / (counts[d.id] * 5)) * 100) : 0; });
      var overall = Math.round(DOMAINS.reduce(function (s, d) { return s + pct[d.id]; }, 0) / DOMAINS.length);
      var data = { pct: pct, overall: overall }; LS.set(KEY.assess, data); render(data); if (out) out.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    function render(data) {
      if (!out) return;
      var ranked = DOMAINS.slice().sort(function (a, b) { return data.pct[b.id] - data.pct[a.id]; });
      var level = data.overall >= 90 ? "Distinguished" : data.overall >= 75 ? "Proficient" : data.overall >= 60 ? "Developing" : "Emerging";
      var bars = DOMAINS.map(function (d) { return '<div class="row"><span>' + d.ico + " " + d.name + '</span><span class="track"><span class="fill" data-pct="' + data.pct[d.id] + '" style="width:' + data.pct[d.id] + '%"></span></span><b>' + data.pct[d.id] + "%</b></div>"; }).join("");
      out.innerHTML =
        '<div class="overall" style="margin-bottom:1.2rem;"><div><div class="big-score">' + data.overall + '</div><div style="color:#f0e6d2;">Leadership Performance Index</div></div><div style="display:flex;flex-direction:column;gap:.5rem;"><span class="grade">' + level + '</span><span style="color:#f0e6d2;font-size:.85rem;">across six leadership domains</span></div></div>' +
        '<div class="assess-card"><h3>Strength by Leadership Domain</h3><div class="barlist">' + bars + "</div></div>" +
        '<div class="assess-card"><h3>🌟 Leadership strengths</h3><ul>' + ranked.slice(0, 2).map(function (d) { return "<li><b>" + d.name + "</b> (" + data.pct[d.id] + "%)</li>"; }).join("") + "</ul></div>" +
        '<div class="assess-card"><h3>🎯 Growth priorities &amp; coaching focus</h3><ul>' + ranked.slice(-2).map(function (d) { return "<li><b>" + d.name + "</b> (" + data.pct[d.id] + "%) — " + actionFor(d.id) + "</li>"; }).join("") + '</ul><div class="btn-row" style="margin-top:.6rem;"><a class="btn" href="growth-plans.html">Build a Growth Plan</a><a class="btn ghost" href="executive-coaching.html">Plan a Coaching Cycle</a><button class="out-btn" data-assess-reset>Reset</button></div><p class="muted" style="font-size:.85rem;margin-top:.6rem;">A reflective leadership self-evaluation. Levels &amp; benchmarks are illustrative.</p></div>';
      out.classList.add("show");
      var r2 = out.querySelector("[data-assess-reset]"); if (r2) r2.addEventListener("click", function () { root.querySelectorAll(".likert button.on").forEach(function (b) { b.classList.remove("on"); }); out.classList.remove("show"); LS.set(KEY.assess, null); window.scrollTo({ top: 0, behavior: "smooth" }); });
      initBars();
    }
    function actionFor(id) { return {
      visionary: "co-create &amp; communicate a compelling vision with measurable goals.",
      instructional: "increase instructional walkthroughs &amp; feedback cycles.",
      people: "deepen recognition, trust &amp; retention-focused leadership behaviors.",
      strategic: "align resources to a few high-leverage strategic priorities.",
      operational: "streamline systems &amp; protect time for instructional leadership.",
      ethical: "make values-based, transparent, equity-centered decisions visible."
    }[id]; }
  }

  /* ===================== COACHING / GROWTH-PLAN GENERATOR ===================== */
  var PLANS = {
    "90-Day Coaching Plan": "a focused 90-day executive coaching plan",
    "Annual Leadership Goals": "annual leadership goals for the year",
    "Executive Coaching Agenda": "an agenda for an executive coaching conversation",
    "Professional Growth Plan": "a personalized professional growth plan",
    "Leadership Development Plan": "a multi-cycle leadership development plan",
    "Succession Readiness Plan": "a leadership succession & readiness plan"
  };
  function buildPlan(type, d) {
    var who = PLANS[type] || PLANS["90-Day Coaching Plan"], leader = val(d, "leader", "A school leader"), focus = val(d, "focus", "Instructional Leadership"), goal = val(d, "goal", "strengthen instructional leadership and teacher support");
    return "<h3>" + esc(type) + "</h3><p class='muted'>" + esc(leader) + " · focus domain: " + esc(focus) + " · " + who + "</p>" +
      "<h4>Leadership Goal</h4><p>" + esc(goal) + ".</p>" +
      "<h4>Why It Matters</h4><p>Growth in <b>" + esc(focus) + "</b> is linked to stronger teacher satisfaction, healthier culture, and improved retention — a through-line from the leadership-and-retention research base.</p>" +
      "<h4>Milestones</h4><ul><li><b>Days 1–30:</b> Gather evidence (360° feedback, walkthroughs, self-reflection) &amp; name a precise focus.</li><li><b>Days 31–60:</b> Apply a high-leverage practice; meet with coach bi-weekly; journal reflections.</li><li><b>Days 61–90:</b> Collect impact evidence, review progress, set the next cycle.</li></ul>" +
      "<h4>Coaching Supports</h4><ul><li>Bi-weekly coaching conversations with a thinking partner.</li><li>Reflective journaling after key leadership moments.</li><li>A small set of measurable indicators of progress.</li></ul>" +
      "<h4>Evidence of Growth</h4><ul><li>360° feedback trend on the focus domain.</li><li>Artifacts in the leadership portfolio.</li><li>Teacher engagement &amp; retention signals.</li></ul>" +
      "<p class='muted' style='font-size:.85rem;'><span class='ai-pill'>👤 Coach's draft</span> A starting point for a coaching conversation — personalize with the leader.</p>";
  }
  function initPlanGen() {
    document.querySelectorAll("[data-generator='plan']").forEach(function (form) {
      var out = document.querySelector("[data-output='plan']") || form.parentElement.querySelector(".gen-output"); var last = null;
      form.addEventListener("submit", function (e) { e.preventDefault(); last = collect(form); run(last, out); });
      if (out) out.addEventListener("click", function (e) { var b = e.target.closest("[data-act]"); if (!b) return; var act = b.getAttribute("data-act"); var body = out.querySelector(".out-body"); if (act === "copy") copyText(body ? body.innerText : ""); else if (act === "print") window.print(); else if (act === "regen") run(last || collect(form), out); });
    });
  }
  function collect(form) { var d = {}; form.querySelectorAll("input[name],select[name],textarea[name]").forEach(function (f) { d[f.name] = f.value; }); return d; }
  function run(data, out) { if (!out) return; var body = out.querySelector(".out-body"), bar = out.querySelector(".out-toolbar"); if (bar) bar.querySelectorAll("[data-act]").forEach(function (b) { b.disabled = true; }); if (body) body.innerHTML = '<p class="muted">✨ Drafting your plan…</p>'; setTimeout(function () { var type = val(data, "type", "90-Day Coaching Plan"); if (body) body.innerHTML = buildPlan(type, data); if (bar) bar.querySelectorAll("[data-act]").forEach(function (b) { b.disabled = false; }); toast("Plan ready — personalize with the leader", "ok"); }, 600); }

  /* ===================== SAVED GROWTH-PLAN BUILDER ===================== */
  function initPlanBuilder() {
    var form = document.querySelector("[data-plan-form]"); var out = document.querySelector("[data-plan-saved]"); if (!form && !out) return;
    function render() {
      if (!out) return; var p = LS.get(KEY.plan, null);
      if (!p) { out.innerHTML = '<div class="out-empty"><div><div class="big">🌱</div><p class="muted">Your saved growth plan will appear here.</p></div></div>'; return; }
      out.innerHTML = '<div class="saved-card"><div class="s-meta">Saved ' + esc(p.when) + '</div><h4 style="margin:.1rem 0 .5rem;">' + esc(p.domain) + ' · ' + esc(p.horizon) + '</h4>' +
        '<p><b>Goal:</b> ' + esc(p.goal) + '</p>' + (p.actions ? '<p><b>Key actions:</b> ' + esc(p.actions) + '</p>' : '') + (p.evidence ? '<p><b>Evidence of success:</b> ' + esc(p.evidence) + '</p>' : '') +
        '<div class="btn-row" style="margin-top:.5rem;"><button class="out-btn" data-plan-clear>Clear plan</button><button class="out-btn" data-plan-print>🖨️ Print</button></div></div>';
      var c = out.querySelector("[data-plan-clear]"); if (c) c.addEventListener("click", clear);
      var pr = out.querySelector("[data-plan-print]"); if (pr) pr.addEventListener("click", function () { window.print(); });
    }
    function clear() { LS.set(KEY.plan, null); render(); toast("Growth plan cleared", "info"); }
    if (form) form.addEventListener("submit", function (e) { e.preventDefault(); var d = collect(form); if (!(d.goal || "").trim()) { toast("Add a leadership goal first", ""); return; } LS.set(KEY.plan, { domain: d.domain || "Instructional Leadership", horizon: d.horizon || "90 days", goal: d.goal, actions: d.actions || "", evidence: d.evidence || "", when: now() }); render(); toast("✅ Growth plan saved (this browser)", "ok"); });
    var clr = document.querySelector("[data-plan-clear-btn]"); if (clr) clr.addEventListener("click", clear);
    render();
  }

  /* ===================== REFLECTION JOURNAL ===================== */
  function initJournal() {
    var form = document.querySelector("[data-journal-form]"); var list = document.querySelector("[data-journal-list]"); if (!form && !list) return;
    function entries() { return LS.get(KEY.journal, []); }
    function render() {
      if (!list) return; var es = entries();
      if (!es.length) { list.innerHTML = '<p class="muted">No reflections yet. Capture a leadership moment, decision, or insight above — entries save in this browser.</p>'; return; }
      list.innerHTML = es.map(function (e, i) { return '<div class="jentry"><div class="j-when"><span>' + esc(e.prompt || "Reflection") + ' · ' + esc(e.when) + '</span><button class="j-del" data-jdel="' + i + '">Delete</button></div><p style="margin:.1rem 0 0;">' + esc(e.text) + '</p></div>'; }).join("");
    }
    if (list) list.addEventListener("click", function (e) { var b = e.target.closest("[data-jdel]"); if (!b) return; var i = parseInt(b.getAttribute("data-jdel"), 10); var es = entries(); es.splice(i, 1); LS.set(KEY.journal, es); render(); toast("Entry deleted", "info"); });
    if (form) form.addEventListener("submit", function (e) { e.preventDefault(); var d = collect(form); var txt = (d.entry || "").trim(); if (!txt) { toast("Write a reflection first", ""); return; } var es = entries(); es.unshift({ text: txt, prompt: d.prompt || "Reflection", when: now() }); LS.set(KEY.journal, es); form.reset(); render(); toast("📝 Reflection saved (this browser)", "ok"); });
    var clr = document.querySelector("[data-journal-clear]"); if (clr) clr.addEventListener("click", function () { LS.set(KEY.journal, []); render(); toast("Journal cleared", "info"); });
    render();
  }

  function renderRailActive() { var here = location.pathname.split("/").pop() || "dashboard.html"; document.querySelectorAll(".rail-link").forEach(function (a) { if (a.getAttribute("href") === here) a.classList.add("active"); }); }
  window.ELG = { toast: toast, copy: copyText };
})();
