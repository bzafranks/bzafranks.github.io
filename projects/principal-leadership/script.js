/* =====================================================================
   Principal Leadership Excellence Framework — interactivity engine
   Loads AFTER the shared portfolio.js. Adds:
     • Dark mode  • Command palette (Ctrl/⌘+K) + FAB  • Toasts
     • Leadership self-assessment diagnostic (6 domains → profile,
       readiness score, strengths/growth, recommendations) — saved
     • Development planner + reflection journal (saved to localStorage)
     • Competency explorer (expandable) + drill-downs + count-up + gauges
     • Simulated report/plan generators (development plan, observation)
   Examples & scenarios are illustrative; research-informed throughout.
   Storage is localStorage; nothing leaves the browser.
   ===================================================================== */
(function () {
  "use strict";
  var LS = { get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  var KEY = { theme: "ple:theme", assess: "ple:assessment", plan: "ple:plan", journal: "ple:journal", stats: "ple:stats" };

  var DOMAINS = [
    { id: "visionary", name: "Visionary Leadership", ico: "🔭" },
    { id: "instructional", name: "Instructional Leadership", ico: "📚" },
    { id: "people", name: "People Leadership", ico: "🤝" },
    { id: "organizational", name: "Organizational Leadership", ico: "🏛️" },
    { id: "community", name: "Community Leadership", ico: "🌍" },
    { id: "ethical", name: "Ethical Leadership", ico: "⚖️" }
  ];

  var TOOLS = [
    { name: "Leadership Framework",     ico: "🧭", url: "framework.html",                desc: "Six leadership domains", group: "Framework" },
    { name: "Competency Model",         ico: "🎯", url: "competencies.html",             desc: "Interactive matrix", group: "Framework" },
    { name: "Self-Assessment",          ico: "📝", url: "self-assessment.html",          desc: "Leadership diagnostic", group: "Develop" },
    { name: "Development Planner",       ico: "🗺️", url: "development.html",              desc: "Goals & 90-day plan", group: "Develop" },
    { name: "Instructional Leadership",  ico: "📚", url: "instructional-leadership.html", desc: "Walkthroughs & coaching", group: "Practice" },
    { name: "Teacher Development",       ico: "👩‍🏫", url: "teacher-development.html",     desc: "Build teacher capacity", group: "Practice" },
    { name: "School Culture",            ico: "🤝", url: "school-culture.html",           desc: "Trust & climate", group: "Practice" },
    { name: "Strategic Leadership",      ico: "📈", url: "strategic-leadership.html",     desc: "Vision → strategy", group: "Practice" },
    { name: "Leadership Observation",    ico: "🔎", url: "observation.html",              desc: "Principal observation", group: "Practice" },
    { name: "Leadership Dashboard",      ico: "📊", url: "dashboard.html",                desc: "Executive overview", group: "Insight" },
    { name: "Leadership Resources",      ico: "📂", url: "resources.html",                desc: "Tools & library", group: "Insight" }
  ];

  document.addEventListener("DOMContentLoaded", function () {
    initTheme(); buildChrome(); initThemeToggle();
    initAssessment(); initPlanner(); initJournal(); initCompetencyExplorer();
    initGenerators(); initGauges(); initBars(); initCountUp(); initDrilldowns();
    renderRailActive();
  });

  function initTheme() { if (LS.get(KEY.theme, "light") === "dark") document.body.classList.add("ple-dark"); }
  function initThemeToggle() {
    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) { sync(b); b.addEventListener("click", function () { document.body.classList.toggle("ple-dark"); var d = document.body.classList.contains("ple-dark"); LS.set(KEY.theme, d ? "dark" : "light"); document.querySelectorAll("[data-theme-toggle]").forEach(sync); toast(d ? "🌙 Dark mode on" : "☀️ Light mode on", "info"); }); });
    function sync(b) { b.textContent = document.body.classList.contains("ple-dark") ? "☀️" : "🌙"; }
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
  function paletteItems() { var inP = /principal-leadership/.test(location.pathname); var base = inP ? "" : "projects/principal-leadership/"; return TOOLS.map(function (t) { return { ico: t.ico, name: t.name, hint: t.desc, url: base + t.url }; }); }
  function bindPalette() {
    var input = document.querySelector(".cmdk-input"); if (!input) return;
    input.addEventListener("input", function () { renderPalette(input.value); });
    input.addEventListener("keydown", function (e) { if (e.key === "ArrowDown") { e.preventDefault(); palIndex = Math.min(palIndex + 1, palMatches.length - 1); hi(); } else if (e.key === "ArrowUp") { e.preventDefault(); palIndex = Math.max(palIndex - 1, 0); hi(); } else if (e.key === "Enter") { var m = palMatches[palIndex]; if (m) location.href = m.url; } });
    function hi() { var els = document.querySelectorAll(".cmdk-item"); els.forEach(function (el, i) { el.classList.toggle("active", i === palIndex); }); if (els[palIndex]) els[palIndex].scrollIntoView({ block: "nearest" }); }
  }
  function renderPalette(q) { var list = document.querySelector(".cmdk-list"); if (!list) return; q = (q || "").toLowerCase().trim(); var all = paletteItems(); palMatches = !q ? all : all.filter(function (a) { return (a.name + " " + a.hint).toLowerCase().indexOf(q) > -1; }); palIndex = 0; if (!palMatches.length) { list.innerHTML = '<div class="cmdk-empty">No match — try “assessment”, “culture”, or “observation”.</div>'; return; } list.innerHTML = palMatches.map(function (a, i) { return '<a class="cmdk-item' + (i === 0 ? " active" : "") + '" href="' + a.url + '"><span class="ico">' + a.ico + '</span><span>' + a.name + '</span><small>' + a.hint + "</small></a>"; }).join(""); }
  function openPalette() { var ov = document.querySelector(".cmdk"); if (!ov) return; ov.classList.add("open"); renderPalette(""); var i = ov.querySelector(".cmdk-input"); if (i) { i.value = ""; i.focus(); } }
  function closePalette() { var ov = document.querySelector(".cmdk"); if (ov) ov.classList.remove("open"); }

  function toast(msg, kind) { var w = document.querySelector(".toast-wrap"); if (!w) return; var t = document.createElement("div"); t.className = "toast " + (kind || ""); t.textContent = msg; w.appendChild(t); setTimeout(function () { t.style.opacity = "0"; t.style.transition = "opacity .3s"; setTimeout(function () { t.remove(); }, 320); }, 2400); }
  function copyText(text) { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { toast("📋 Copied", "ok"); }, function () { toast("Copy failed", ""); }); else toast("Clipboard unavailable", ""); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function val(d, k, fb) { return d && d[k] ? d[k] : fb; }

  /* ---------- animations ---------- */
  function obsRun(els, fn) { if (!els.length) return; if ("IntersectionObserver" in window) { var o = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { fn(e.target); o.unobserve(e.target); } }); }, { threshold: 0.3 }); els.forEach(function (e) { o.observe(e); }); } else els.forEach(fn); }
  function initGauges() { obsRun(document.querySelectorAll("[data-gauge]"), function (el) { var t = parseFloat(el.getAttribute("data-gauge")) || 0, dur = 1100, start = null, num = el.querySelector("[data-gauge-num]"); function step(ts) { if (!start) start = ts; var p = Math.min((ts - start) / dur, 1); var v = t * (0.5 - Math.cos(p * Math.PI) / 2); el.style.setProperty("--val", v.toFixed(1)); if (num) num.textContent = Math.round(v) + (el.getAttribute("data-gauge-suffix") || ""); if (p < 1) requestAnimationFrame(step); } requestAnimationFrame(step); }); }
  function initBars() { obsRun(document.querySelectorAll(".barlist .fill[data-pct]"), function (el) { var p = el.getAttribute("data-pct"); el.style.width = "0%"; requestAnimationFrame(function () { el.style.transition = "width .9s ease"; el.style.width = p + "%"; }); }); var bars = document.querySelectorAll(".barchart .bar[data-h]"); obsRun(bars, function (el) { var h = el.getAttribute("data-h"); el.style.height = "0%"; requestAnimationFrame(function () { el.style.height = h + "%"; }); }); }
  function initCountUp() { obsRun(document.querySelectorAll("[data-count]"), function (el) { var t = parseFloat(el.getAttribute("data-count")), suf = el.getAttribute("data-suffix") || "", pre = el.getAttribute("data-prefix") || "", dur = 1000, start = null; function step(ts) { if (!start) start = ts; var p = Math.min((ts - start) / dur, 1); var v = t * (0.5 - Math.cos(p * Math.PI) / 2); el.textContent = pre + (t % 1 === 0 ? Math.round(v) : v.toFixed(1)) + suf; if (p < 1) requestAnimationFrame(step); } requestAnimationFrame(step); }); }
  function initDrilldowns() { document.querySelectorAll(".drill-row").forEach(function (row) { row.addEventListener("click", function () { var p = row.nextElementSibling; if (p && p.classList.contains("drill-panel")) { row.classList.toggle("open"); p.classList.toggle("open"); } }); }); }

  /* ---------- Competency explorer ---------- */
  function initCompetencyExplorer() { document.querySelectorAll(".comp-card").forEach(function (c) { c.addEventListener("click", function () { var d = c.querySelector(".comp-detail"); if (d) d.classList.toggle("open"); }); }); }

  /* ===================== SELF-ASSESSMENT ===================== */
  function initAssessment() {
    var root = document.querySelector("[data-assessment]"); if (!root) return;
    // likert selection
    root.querySelectorAll(".likert").forEach(function (lk) { lk.querySelectorAll("button").forEach(function (b) { b.addEventListener("click", function () { lk.querySelectorAll("button").forEach(function (x) { x.classList.remove("on"); }); b.classList.add("on"); }); }); });
    var btn = root.querySelector("[data-assess-run]"); var out = document.querySelector("[data-assess-result]");
    if (btn) btn.addEventListener("click", function () { compute(); });
    var reset = root.querySelector("[data-assess-reset]"); if (reset) reset.addEventListener("click", function () { root.querySelectorAll(".likert button.on").forEach(function (b) { b.classList.remove("on"); }); if (out) out.classList.remove("show"); LS.set(KEY.assess, null); toast("Assessment reset", "info"); });
    // restore
    var saved = LS.get(KEY.assess, null); if (saved && out) render(saved);

    function compute() {
      var scores = {}, counts = {};
      DOMAINS.forEach(function (d) { scores[d.id] = 0; counts[d.id] = 0; });
      var missing = 0, totalItems = root.querySelectorAll(".assess-item").length;
      root.querySelectorAll(".assess-item").forEach(function (item) {
        var dom = item.getAttribute("data-domain") || "visionary";
        var on = item.querySelector(".likert button.on");
        if (on) { scores[dom] += parseInt(on.getAttribute("data-v") || on.textContent, 10) || 0; counts[dom] += 1; }
        else missing += 1;
      });
      if (missing > 0 && missing === totalItems) { toast("Answer the statements to see your profile", ""); return; }
      var pct = {}; DOMAINS.forEach(function (d) { pct[d.id] = counts[d.id] ? Math.round((scores[d.id] / (counts[d.id] * 5)) * 100) : 0; });
      var overall = Math.round(DOMAINS.reduce(function (s, d) { return s + pct[d.id]; }, 0) / DOMAINS.length);
      var data = { pct: pct, overall: overall };
      LS.set(KEY.assess, data); render(data);
      if (out) out.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    function render(data) {
      if (!out) return;
      var ranked = DOMAINS.slice().sort(function (a, b) { return data.pct[b.id] - data.pct[a.id]; });
      var band = data.overall >= 80 ? { t: "Leading", c: "green" } : data.overall >= 65 ? { t: "Developing — Advanced", c: "gold" } : data.overall >= 50 ? { t: "Developing", c: "amber" } : { t: "Emerging", c: "red" };
      var bars = DOMAINS.map(function (d) { return '<div class="row"><span>' + d.ico + " " + d.name + '</span><span class="track"><span class="fill" data-pct="' + data.pct[d.id] + '" style="width:' + data.pct[d.id] + '%"></span></span><b>' + data.pct[d.id] + "%</b></div>"; }).join("");
      var strengths = ranked.slice(0, 2).map(function (d) { return "<li><b>" + d.name + "</b> (" + data.pct[d.id] + "%) — a signature strength to leverage and share.</li>"; }).join("");
      var growth = ranked.slice(-2).map(function (d) { return "<li><b>" + d.name + "</b> (" + data.pct[d.id] + "%) — prioritize in your 90-day plan.</li>"; }).join("");
      var recs = ranked.slice(-2).map(function (d) { return "<li>" + recFor(d.id) + "</li>"; }).join("");
      out.innerHTML =
        '<div class="assess-card"><h3>Your Leadership Profile</h3>' +
        '<div style="display:flex;gap:1.6rem;flex-wrap:wrap;align-items:center;">' +
        '<div class="gauge" data-gauge="' + data.overall + '" data-gauge-suffix="%"><div class="hole"><b data-gauge-num>0%</b><small>Leadership readiness</small></div></div>' +
        '<div style="flex:1;min-width:240px;"><p><span class="tl-pill ' + band.c + '">' + band.t + '</span></p><div class="barlist">' + bars + "</div></div></div></div>" +
        '<div class="assess-card"><h3>🌟 Signature Strengths</h3><ul>' + strengths + "</ul></div>" +
        '<div class="assess-card"><h3>🎯 Growth Opportunities</h3><ul>' + growth + "</ul></div>" +
        '<div class="assess-card"><h3>📚 Recommended Professional Learning</h3><ul>' + recs + '</ul></div>' +
        '<div class="assess-card"><h3>🗺️ Personalized Action Plan</h3><p>Carry these priorities into the <a href="development.html">Development Planner</a> to build your 90-day plan, then re-assess in one term to measure growth.</p><div class="btn-row"><a class="btn" href="development.html">Open Development Planner</a><button class="out-btn" data-assess-reset>Reset assessment</button></div>' +
        '<p class="muted" style="font-size:.85rem;margin-top:.8rem;">This diagnostic is a reflective tool. Domain weighting reflects research on leadership behaviors that influence teacher retention and school performance.</p></div>';
      out.classList.add("show");
      // re-bind reset + animate
      var r2 = out.querySelector("[data-assess-reset]"); if (r2) r2.addEventListener("click", function () { root.querySelectorAll(".likert button.on").forEach(function (b) { b.classList.remove("on"); }); out.classList.remove("show"); LS.set(KEY.assess, null); window.scrollTo({ top: 0, behavior: "smooth" }); toast("Assessment reset", "info"); });
      initGauges(); initBars();
    }
    function recFor(id) {
      return {
        visionary: "Visionary Leadership: craft and communicate a shared vision; practice storytelling and a vision-to-action routine.",
        instructional: "Instructional Leadership: run weekly walkthroughs with low-inference feedback and a coaching cycle.",
        people: "People Leadership: strengthen recognition, trust, and teacher voice — the behaviors most tied to retention in the research.",
        organizational: "Organizational Leadership: streamline systems and distribute leadership to reduce overload.",
        community: "Community Leadership: build family & community partnerships and a proactive communication rhythm.",
        ethical: "Ethical Leadership: model integrity and equity; use a values-based decision protocol."
      }[id];
    }
  }

  /* ===================== DEVELOPMENT PLANNER (saved) ===================== */
  function initPlanner() {
    var form = document.querySelector("[data-planner]"); if (!form) return;
    var saved = LS.get(KEY.plan, {});
    form.querySelectorAll("input[name],textarea[name],select[name]").forEach(function (f) { if (saved[f.name] != null) f.value = saved[f.name]; });
    var note = form.querySelector("[data-plan-saved]");
    function save() { var d = {}; form.querySelectorAll("input[name],textarea[name],select[name]").forEach(function (f) { d[f.name] = f.value; }); LS.set(KEY.plan, d); if (note) { note.textContent = "✓ Saved locally"; setTimeout(function () { note.textContent = ""; }, 2000); } }
    form.addEventListener("submit", function (e) { e.preventDefault(); save(); toast("💾 Development plan saved", "ok"); });
    form.querySelectorAll("input,textarea,select").forEach(function (f) { f.addEventListener("change", save); });
    var clr = form.querySelector("[data-plan-clear]"); if (clr) clr.addEventListener("click", function () { LS.set(KEY.plan, {}); form.reset(); toast("Plan cleared", "info"); });
  }

  /* ===================== REFLECTION JOURNAL (saved) ===================== */
  function initJournal() {
    var box = document.querySelector("[data-journal]"); if (!box) return;
    var input = box.querySelector("textarea"), listEl = box.querySelector("[data-journal-list]"), add = box.querySelector("[data-journal-add]");
    function render() { var entries = LS.get(KEY.journal, []); if (!listEl) return; if (!entries.length) { listEl.innerHTML = '<p class="muted">No reflections yet. Your entries are saved privately in this browser.</p>'; return; } listEl.innerHTML = entries.map(function (e, i) { return '<div class="lib-item"><span class="l-ico">🪞</span><div class="l-body"><b>Entry ' + (entries.length - i) + "</b><small>" + esc(e) + "</small></div></div>"; }).join(""); }
    if (add) add.addEventListener("click", function () { var v = (input.value || "").trim(); if (!v) { toast("Write a reflection first", ""); return; } var e = LS.get(KEY.journal, []); e.unshift(v); LS.set(KEY.journal, e); input.value = ""; render(); toast("🪞 Reflection saved", "ok"); });
    var clr = box.querySelector("[data-journal-clear]"); if (clr) clr.addEventListener("click", function () { LS.set(KEY.journal, []); render(); toast("Journal cleared", "info"); });
    render();
  }

  /* ===================== GENERATORS (development plan / observation report) ===================== */
  var GEN = {
    devplan: { label: "Leadership Development Plan", build: function (d) {
      var goal = val(d, "goal", "strengthen instructional leadership"), domain = val(d, "domain", "Instructional Leadership");
      return "<h3>90-Day Leadership Development Plan</h3><p class='muted'>Focus domain: " + esc(domain) + "</p>" +
        "<h4>Annual Goal</h4><p>" + esc(goal) + ".</p>" +
        "<h4>90-Day Outcomes</h4><ul><li>Days 1–30: establish baseline (walkthrough data, staff pulse).</li><li>Days 31–60: implement one high-leverage routine; gather evidence.</li><li>Days 61–90: review impact, adjust, and plan next cycle.</li></ul>" +
        "<h4>Monthly Priorities</h4><ul><li>Month 1: model &amp; communicate the focus.</li><li>Month 2: coach &amp; support implementation.</li><li>Month 3: measure &amp; celebrate progress.</li></ul>" +
        "<h4>Professional Learning</h4><ul><li>One targeted reading + one peer observation.</li><li>A coaching conversation cadence (bi-weekly).</li></ul>" +
        "<h4>Progress Indicators</h4><ul><li>Leading: routine evidence collected weekly.</li><li>Lagging: staff engagement &amp; retention signals trend up.</li></ul>" +
        "<p class='muted' style='font-size:.85rem;'><span class='ai-pill'>Research-informed</span> Priorities reflect leadership behaviors linked to teacher retention &amp; school performance. A reflective planning tool.</p>";
    }},
    observation: { label: "Leadership Observation Summary", build: function (d) {
      var standard = val(d, "standard", "Instructional Leadership"), leader = val(d, "leader", "the school leader");
      return "<h3>Leadership Observation Summary</h3><p class='muted'>Standard: " + esc(standard) + " · For: " + esc(leader) + "</p>" +
        "<h4>Evidence (low-inference)</h4><ul><li>Observable actions and statements recorded without judgment.</li><li>Artifacts referenced (agendas, data, feedback notes).</li></ul>" +
        "<h4>Strengths (Glow)</h4><ul><li>Clear, specific leadership behavior aligned to the standard.</li></ul>" +
        "<h4>Growth Area (Grow)</h4><ul><li>One actionable, high-leverage next step.</li></ul>" +
        "<h4>Coaching Next Step</h4><p>A supportive, goal-focused conversation with a defined follow-up date.</p>" +
        "<p class='muted' style='font-size:.85rem;'><span class='ai-pill'>Growth-focused</span> Designed for development, not gotcha. Illustrative template.</p>";
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
  window.PLE = { toast: toast, copy: copyText };
})();
