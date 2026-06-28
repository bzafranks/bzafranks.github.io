/* =====================================================================
   Teaching Excellence & Instructional Leadership Framework — engine
   Loads AFTER the shared portfolio.js. Adds:
     • Dark mode  • Command palette (Ctrl/⌘+K) + FAB  • Toasts
     • Instructional-leadership self-assessment (6 domains → profile)
     • Competency / teaching-excellence explorer (expandable)
     • Observation / coaching / feedback generators + planner + journal
     • Gauges, bars, count-up, drill-downs
   Research-informed; classroom scenarios are illustrative.
   Storage is localStorage; nothing leaves the browser.
   ===================================================================== */
(function () {
  "use strict";
  var LS = { get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  var KEY = { theme: "tex:theme", assess: "tex:assess", plan: "tex:plan", journal: "tex:journal" };

  var DOMAINS = [
    { id: "vision", name: "Vision for Teaching & Learning", ico: "🔭" },
    { id: "coaching", name: "Instructional Coaching", ico: "🧑‍🏫" },
    { id: "curriculum", name: "Curriculum & Assessment", ico: "📐" },
    { id: "learning", name: "Professional Learning", ico: "📚" },
    { id: "data", name: "Data-Informed Improvement", ico: "📊" },
    { id: "culture", name: "Collaborative Instructional Culture", ico: "🤝" }
  ];

  var TOOLS = [
    { name: "Instructional Framework",  ico: "🧭", url: "framework.html",              desc: "Six leadership domains", group: "Framework" },
    { name: "Teaching Excellence Model",ico: "⭐", url: "teaching-excellence.html",     desc: "What great teaching looks like", group: "Framework" },
    { name: "Instructional Coaching",   ico: "🧑‍🏫", url: "instructional-coaching.html", desc: "The coaching cycle", group: "Coach" },
    { name: "Classroom Observation",    ico: "🔎", url: "classroom-observation.html",   desc: "Walkthroughs & rubrics", group: "Coach" },
    { name: "Feedback & Reflection",    ico: "💬", url: "feedback.html",                desc: "Growth-focused feedback", group: "Coach" },
    { name: "Professional Learning",    ico: "📚", url: "professional-learning.html",   desc: "PLCs, lesson study, PD", group: "Grow" },
    { name: "Curriculum & Assessment",  ico: "📐", url: "curriculum-assessment.html",   desc: "Alignment & data", group: "Grow" },
    { name: "Teaching Analytics",       ico: "📈", url: "analytics.html",               desc: "Teaching-quality analytics", group: "Insight" },
    { name: "Leadership Dashboard",     ico: "📊", url: "dashboard.html",               desc: "Instructional health", group: "Insight" },
    { name: "Resources",                ico: "📂", url: "resources.html",               desc: "Tools & templates", group: "Insight" }
  ];

  document.addEventListener("DOMContentLoaded", function () {
    initTheme(); buildChrome(); initThemeToggle();
    initAssessment(); initCompetencyExplorer(); initGenerators(); initPlanner(); initJournal();
    initGauges(); initBars(); initCountUp(); initDrilldowns(); renderRailActive();
  });

  function initTheme() { if (LS.get(KEY.theme, "light") === "dark") document.body.classList.add("tex-dark"); }
  function initThemeToggle() {
    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) { sync(b); b.addEventListener("click", function () { document.body.classList.toggle("tex-dark"); var d = document.body.classList.contains("tex-dark"); LS.set(KEY.theme, d ? "dark" : "light"); document.querySelectorAll("[data-theme-toggle]").forEach(sync); toast(d ? "🌙 Dark mode on" : "☀️ Light mode on", "info"); }); });
    function sync(b) { b.textContent = document.body.classList.contains("tex-dark") ? "☀️" : "🌙"; }
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
  function paletteItems() { var inP = /teaching-excellence/.test(location.pathname); var base = inP ? "" : "projects/teaching-excellence/"; return TOOLS.map(function (t) { return { ico: t.ico, name: t.name, hint: t.desc, url: base + t.url }; }); }
  function bindPalette() {
    var input = document.querySelector(".cmdk-input"); if (!input) return;
    input.addEventListener("input", function () { renderPalette(input.value); });
    input.addEventListener("keydown", function (e) { if (e.key === "ArrowDown") { e.preventDefault(); palIndex = Math.min(palIndex + 1, palMatches.length - 1); hi(); } else if (e.key === "ArrowUp") { e.preventDefault(); palIndex = Math.max(palIndex - 1, 0); hi(); } else if (e.key === "Enter") { var m = palMatches[palIndex]; if (m) location.href = m.url; } });
    function hi() { var els = document.querySelectorAll(".cmdk-item"); els.forEach(function (el, i) { el.classList.toggle("active", i === palIndex); }); if (els[palIndex]) els[palIndex].scrollIntoView({ block: "nearest" }); }
  }
  function renderPalette(q) { var list = document.querySelector(".cmdk-list"); if (!list) return; q = (q || "").toLowerCase().trim(); var all = paletteItems(); palMatches = !q ? all : all.filter(function (a) { return (a.name + " " + a.hint).toLowerCase().indexOf(q) > -1; }); palIndex = 0; if (!palMatches.length) { list.innerHTML = '<div class="cmdk-empty">No match — try “coaching”, “observation”, or “analytics”.</div>'; return; } list.innerHTML = palMatches.map(function (a, i) { return '<a class="cmdk-item' + (i === 0 ? " active" : "") + '" href="' + a.url + '"><span class="ico">' + a.ico + '</span><span>' + a.name + '</span><small>' + a.hint + "</small></a>"; }).join(""); }
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
  function initCompetencyExplorer() { document.querySelectorAll(".comp-card").forEach(function (c) { c.addEventListener("click", function () { var d = c.querySelector(".comp-detail"); if (d) d.classList.toggle("open"); }); }); }

  /* ===================== SELF-ASSESSMENT ===================== */
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
      root.querySelectorAll(".assess-item").forEach(function (item) { var dom = item.getAttribute("data-domain") || "vision"; var on = item.querySelector(".likert button.on"); if (on) { scores[dom] += parseInt(on.getAttribute("data-v") || on.textContent, 10) || 0; counts[dom] += 1; answered++; } });
      if (!answered) { toast("Answer the statements to see your profile", ""); return; }
      var pct = {}; DOMAINS.forEach(function (d) { pct[d.id] = counts[d.id] ? Math.round((scores[d.id] / (counts[d.id] * 5)) * 100) : 0; });
      var overall = Math.round(DOMAINS.reduce(function (s, d) { return s + pct[d.id]; }, 0) / DOMAINS.length);
      var data = { pct: pct, overall: overall }; LS.set(KEY.assess, data); render(data); if (out) out.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    function render(data) {
      if (!out) return;
      var ranked = DOMAINS.slice().sort(function (a, b) { return data.pct[b.id] - data.pct[a.id]; });
      var band = data.overall >= 80 ? { t: "Leading", c: "green" } : data.overall >= 65 ? { t: "Proficient", c: "blue" } : data.overall >= 50 ? { t: "Developing", c: "amber" } : { t: "Emerging", c: "red" };
      var bars = DOMAINS.map(function (d) { return '<div class="row"><span>' + d.ico + " " + d.name + '</span><span class="track"><span class="fill" data-pct="' + data.pct[d.id] + '" style="width:' + data.pct[d.id] + '%"></span></span><b>' + data.pct[d.id] + "%</b></div>"; }).join("");
      var growth = ranked.slice(-2).map(function (d) { return "<li>" + recFor(d.id) + "</li>"; }).join("");
      out.innerHTML =
        '<div class="assess-card"><h3>Your Instructional-Leadership Profile</h3><div style="display:flex;gap:1.6rem;flex-wrap:wrap;align-items:center;">' +
        '<div class="gauge" data-gauge="' + data.overall + '" data-gauge-suffix="%"><div class="hole"><b data-gauge-num>0%</b><small>Instructional-leadership index</small></div></div>' +
        '<div style="flex:1;min-width:240px;"><p><span class="tl-pill ' + band.c + '">' + band.t + '</span></p><div class="barlist">' + bars + "</div></div></div></div>" +
        '<div class="assess-card"><h3>🌟 Strengths</h3><ul>' + ranked.slice(0, 2).map(function (d) { return "<li><b>" + d.name + "</b> (" + data.pct[d.id] + "%)</li>"; }).join("") + "</ul></div>" +
        '<div class="assess-card"><h3>🎯 Highest-leverage growth</h3><ul>' + growth + '</ul><div class="btn-row" style="margin-top:.6rem;"><a class="btn" href="instructional-coaching.html">Plan a Coaching Cycle</a><button class="out-btn" data-assess-reset>Reset</button></div><p class="muted" style="font-size:.85rem;margin-top:.6rem;">A reflective self-diagnostic grounded in instructional-leadership research.</p></div>';
      out.classList.add("show");
      var r2 = out.querySelector("[data-assess-reset]"); if (r2) r2.addEventListener("click", function () { root.querySelectorAll(".likert button.on").forEach(function (b) { b.classList.remove("on"); }); out.classList.remove("show"); LS.set(KEY.assess, null); window.scrollTo({ top: 0, behavior: "smooth" }); });
      initGauges(); initBars();
    }
    function recFor(id) { return {
      vision: "Vision for Teaching & Learning: define and communicate a shared picture of excellent teaching.",
      coaching: "Instructional Coaching: run consistent coaching cycles with low-inference feedback.",
      curriculum: "Curriculum & Assessment: tighten standards alignment and use common assessments well.",
      learning: "Professional Learning: build PLCs, lesson study, and job-embedded learning.",
      data: "Data-Informed Improvement: lead structured data conversations and student-work analysis.",
      culture: "Collaborative Instructional Culture: grow trust, collaboration, and shared accountability."
    }[id]; }
  }

  /* ===================== GENERATORS (observation / coaching / feedback) ===================== */
  var GEN = {
    observation: { label: "Classroom Observation Summary", build: function (d) {
      var teacher = val(d, "teacher", "the teacher"), focus = val(d, "focus", "Student Engagement");
      return "<h3>Classroom Observation Summary</h3><p class='muted'>Focus: " + esc(focus) + " · For: " + esc(teacher) + "</p>" +
        "<h4>Evidence (low-inference)</h4><ul><li>Observable teacher and student actions, recorded without judgment.</li><li>Student work / talk referenced.</li></ul>" +
        "<h4>Strengths (Glow)</h4><ul><li>A specific, effective instructional move aligned to the focus.</li></ul>" +
        "<h4>Growth (Grow)</h4><ul><li>One high-leverage, actionable next step.</li></ul>" +
        "<h4>Reflective Questions</h4><ul><li>What evidence showed students were learning?</li><li>What will you adjust next lesson?</li></ul>" +
        "<h4>Coaching Next Step</h4><p>Agree on one focus + a follow-up date.</p>" +
        "<p class='muted' style='font-size:.85rem;'><span class='ai-pill'>Growth-focused</span> Designed for development, not evaluation. Illustrative template.</p>";
    }},
    coaching: { label: "Coaching Cycle Plan", build: function (d) {
      var goal = val(d, "goal", "increase student discourse"), teacher = val(d, "teacher", "the teacher");
      return "<h3>Instructional Coaching Cycle</h3><p class='muted'>Goal: " + esc(goal) + " · " + esc(teacher) + "</p>" +
        "<h4>1 · Pre-conference</h4><p>Clarify the goal, the look-fors, and what success will look like.</p>" +
        "<h4>2 · Observation</h4><p>Collect low-inference evidence focused on the goal.</p>" +
        "<h4>3 · Reflective Conversation</h4><p>Teacher reflects first; coach asks probing questions; name one bright spot + one focus.</p>" +
        "<h4>4 · Action Plan</h4><p>One concrete strategy, modeled/co-planned, with success criteria.</p>" +
        "<h4>5 · Progress Monitoring</h4><p>Bi-weekly check-ins; track evidence of the goal.</p>" +
        "<p class='muted' style='font-size:.85rem;'><span class='ai-pill'>Adult-learning aligned</span> Teacher-led reflection drives growth. Illustrative.</p>";
    }},
    feedback: { label: "Growth-Focused Feedback", build: function (d) {
      var area = val(d, "area", "questioning techniques");
      return "<h3>Growth-Focused Feedback</h3><p class='muted'>Focus: " + esc(area) + "</p>" +
        "<h4>🌟 Strength</h4><p>Name a specific, evidence-based strength to reinforce.</p>" +
        "<h4>🎯 One Next Step</h4><p>A single, high-leverage, actionable move (avoid overloading).</p>" +
        "<h4>🤔 Reflective Prompt</h4><p>A question that invites the teacher to think, not just comply.</p>" +
        "<h4>📅 Follow-Up</h4><p>Agree on a check-in to revisit the step together.</p>" +
        "<p class='muted' style='font-size:.85rem;'>Strength-based and specific. Illustrative.</p>";
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

  /* ===================== PLANNER + JOURNAL (saved) ===================== */
  function initPlanner() {
    var form = document.querySelector("[data-planner]"); if (!form) return;
    var saved = LS.get(KEY.plan, {}); form.querySelectorAll("input[name],textarea[name],select[name]").forEach(function (f) { if (saved[f.name] != null) f.value = saved[f.name]; });
    var note = form.querySelector("[data-plan-saved]");
    function save() { var d = {}; form.querySelectorAll("input[name],textarea[name],select[name]").forEach(function (f) { d[f.name] = f.value; }); LS.set(KEY.plan, d); if (note) { note.textContent = "✓ Saved locally"; setTimeout(function () { note.textContent = ""; }, 2000); } }
    form.addEventListener("submit", function (e) { e.preventDefault(); save(); toast("💾 Plan saved", "ok"); });
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

  function renderRailActive() { var here = location.pathname.split("/").pop() || "framework.html"; document.querySelectorAll(".rail-link").forEach(function (a) { if (a.getAttribute("href") === here) a.classList.add("active"); }); }
  window.TEX = { toast: toast, copy: copyText };
})();
