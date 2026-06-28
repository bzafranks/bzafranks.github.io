/* =====================================================================
   Strategic Planning Blueprint — interactivity engine
   Loads AFTER the shared portfolio.js. Adds:
     • Dark mode  • Command palette (Ctrl/⌘+K) + FAB  • Toasts
     • Vision builder + strategy generators
     • SWOT / PESTLE / strategic-plan / governance saved forms
     • Interactive KPI / Goal tracker (add, progress, persist)
     • Gauges, bars, count-up, drill-downs
   Research-informed (strategic management, balanced scorecard);
   strategic plans & data are illustrative. Storage is localStorage.
   ===================================================================== */
(function () {
  "use strict";
  var LS = { get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  var KEY = { theme: "spb:theme", vision: "spb:vision", swot: "spb:swot", pestle: "spb:pestle", plan: "spb:plan", gov: "spb:gov", goals: "spb:goals" };

  var TOOLS = [
    { name: "Planning Framework",      ico: "🧭", url: "framework.html",              desc: "Six planning stages", group: "Framework" },
    { name: "Vision Builder",          ico: "🌅", url: "vision.html",                 desc: "Vision, mission, values", group: "Define" },
    { name: "Environmental Analysis",  ico: "🔬", url: "environmental-analysis.html", desc: "SWOT, PESTLE, risk", group: "Discover" },
    { name: "Strategic Priorities",    ico: "🎯", url: "strategic-priorities.html",   desc: "Objectives & matrix", group: "Design" },
    { name: "Goal & KPI Manager",      ico: "📊", url: "goal-manager.html",           desc: "SMART goals, OKRs, KPIs", group: "Design" },
    { name: "Implementation Roadmap",  ico: "🗺️", url: "roadmap.html",                desc: "Initiatives & timeline", group: "Deploy" },
    { name: "Performance Dashboard",   ico: "📈", url: "dashboard.html",              desc: "Executive overview", group: "Measure" },
    { name: "Governance & Accountability", ico: "⚖️", url: "governance.html",         desc: "Boards, reviews, logs", group: "Measure" },
    { name: "Resources",               ico: "📂", url: "resources.html",              desc: "Tools & templates", group: "Insight" }
  ];

  document.addEventListener("DOMContentLoaded", function () {
    initTheme(); buildChrome(); initThemeToggle();
    initGenerators(); initSavedForms(); initGoalTracker();
    initGauges(); initBars(); initCountUp(); initDrilldowns(); renderRailActive();
  });

  function initTheme() { if (LS.get(KEY.theme, "light") === "dark") document.body.classList.add("spb-dark"); }
  function initThemeToggle() {
    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) { sync(b); b.addEventListener("click", function () { document.body.classList.toggle("spb-dark"); var d = document.body.classList.contains("spb-dark"); LS.set(KEY.theme, d ? "dark" : "light"); document.querySelectorAll("[data-theme-toggle]").forEach(sync); toast(d ? "🌙 Dark mode on" : "☀️ Light mode on", "info"); }); });
    function sync(b) { b.textContent = document.body.classList.contains("spb-dark") ? "☀️" : "🌙"; }
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
  function paletteItems() { var inP = /strategic-planning/.test(location.pathname); var base = inP ? "" : "projects/strategic-planning/"; return TOOLS.map(function (t) { return { ico: t.ico, name: t.name, hint: t.desc, url: base + t.url }; }); }
  function bindPalette() {
    var input = document.querySelector(".cmdk-input"); if (!input) return;
    input.addEventListener("input", function () { renderPalette(input.value); });
    input.addEventListener("keydown", function (e) { if (e.key === "ArrowDown") { e.preventDefault(); palIndex = Math.min(palIndex + 1, palMatches.length - 1); hi(); } else if (e.key === "ArrowUp") { e.preventDefault(); palIndex = Math.max(palIndex - 1, 0); hi(); } else if (e.key === "Enter") { var m = palMatches[palIndex]; if (m) location.href = m.url; } });
    function hi() { var els = document.querySelectorAll(".cmdk-item"); els.forEach(function (el, i) { el.classList.toggle("active", i === palIndex); }); if (els[palIndex]) els[palIndex].scrollIntoView({ block: "nearest" }); }
  }
  function renderPalette(q) { var list = document.querySelector(".cmdk-list"); if (!list) return; q = (q || "").toLowerCase().trim(); var all = paletteItems(); palMatches = !q ? all : all.filter(function (a) { return (a.name + " " + a.hint).toLowerCase().indexOf(q) > -1; }); palIndex = 0; if (!palMatches.length) { list.innerHTML = '<div class="cmdk-empty">No match — try “vision”, “SWOT”, or “KPI”.</div>'; return; } list.innerHTML = palMatches.map(function (a, i) { return '<a class="cmdk-item' + (i === 0 ? " active" : "") + '" href="' + a.url + '"><span class="ico">' + a.ico + '</span><span>' + a.name + '</span><small>' + a.hint + "</small></a>"; }).join(""); }
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

  /* ===================== GENERATORS (vision / strategy) ===================== */
  var GEN = {
    vision: { label: "Vision Statement", build: function (d) {
      var school = val(d, "school", "our school"), aspiration = val(d, "aspiration", "every learner thrives and leads"), values = val(d, "values", "excellence, equity, and belonging"), horizon = val(d, "horizon", "five years");
      return "<h4>Draft Vision Statement</h4>" +
        '<p class="vision-statement">' + esc(school) + " will be a school where " + esc(aspiration.toLowerCase()) + " — a community defined by " + esc(values.toLowerCase()) + ", preparing every student for a changing world within " + esc(horizon) + ".</p>" +
        "<h4>Companion Mission (draft)</h4><p>We achieve this vision by delivering excellent teaching, developing our people, engaging families and community, and improving continuously.</p>" +
        "<h4>Core Values (draft)</h4><p>" + esc(values) + ".</p>" +
        "<p class='muted' style='font-size:.85rem;'><span class='ai-pill'>Editable draft</span> A starting point to refine with your community. Illustrative.</p>";
    }},
    strategy: { label: "Strategic Initiative Brief", build: function (d) {
      var priority = val(d, "priority", "raise student achievement"), owner = val(d, "owner", "the leadership team");
      return "<h3>Strategic Initiative Brief</h3><p class='muted'>Priority: " + esc(priority) + " · Owner: " + esc(owner) + "</p>" +
        "<h4>Objective (SMART)</h4><p>A specific, measurable objective with a target and timeframe.</p>" +
        "<h4>Key Results / KPIs</h4><ul><li>Leading indicator (implementation).</li><li>Lagging indicator (outcome).</li></ul>" +
        "<h4>Initiatives &amp; Milestones</h4><ul><li>Q1 launch · Q2–Q3 implement · Q4 evaluate.</li></ul>" +
        "<h4>Resources &amp; Risks</h4><ul><li>Budget &amp; people aligned; risks mitigated.</li></ul>" +
        "<h4>Governance</h4><p>Quarterly review; board reporting; decision log.</p>" +
        "<p class='muted' style='font-size:.85rem;'><span class='ai-pill'>Balanced Scorecard aligned</span> Illustrative template.</p>";
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
  function run(type, data, out) { if (!out) return; var body = out.querySelector(".out-body"); if (body) body.innerHTML = '<p class="muted">✨ Drafting…</p>'; setTimeout(function () { if (body) body.innerHTML = GEN[type].build(data); toast("Draft ready — refine with your team", "ok"); }, 500); }

  /* ===================== SAVED FORMS ===================== */
  function savedForm(form, key, label) {
    var saved = LS.get(key, {}); form.querySelectorAll("input[name],textarea[name],select[name]").forEach(function (f) { if (saved[f.name] != null) f.value = saved[f.name]; });
    var note = form.querySelector("[data-plan-saved]");
    function save() { var d = {}; form.querySelectorAll("input[name],textarea[name],select[name]").forEach(function (f) { d[f.name] = f.value; }); LS.set(key, d); if (note) { note.textContent = "✓ Saved locally"; setTimeout(function () { note.textContent = ""; }, 2000); } }
    form.addEventListener("submit", function (e) { e.preventDefault(); save(); toast("💾 " + label + " saved", "ok"); });
    form.querySelectorAll("input,textarea,select").forEach(function (f) { f.addEventListener("change", save); });
    var clr = form.querySelector("[data-plan-clear]"); if (clr) clr.addEventListener("click", function () { LS.set(key, {}); form.reset(); toast(label + " cleared", "info"); });
  }
  function initSavedForms() {
    var v = document.querySelector("[data-vision-form]"); if (v) savedForm(v, KEY.vision, "Vision draft");
    var sw = document.querySelector("[data-swot]"); if (sw) savedForm(sw, KEY.swot, "SWOT analysis");
    var pe = document.querySelector("[data-pestle]"); if (pe) savedForm(pe, KEY.pestle, "PESTLE analysis");
    var pl = document.querySelector("[data-planner]"); if (pl) savedForm(pl, KEY.plan, "Strategic plan");
    var gv = document.querySelector("[data-governance]"); if (gv) savedForm(gv, KEY.gov, "Governance plan");
  }

  /* ===================== KPI / GOAL TRACKER (add, persist) ===================== */
  function initGoalTracker() {
    var box = document.querySelector("[data-goaltracker]"); if (!box) return;
    var name = box.querySelector("[data-goal-name]"), cur = box.querySelector("[data-goal-current]"), tgt = box.querySelector("[data-goal-target]"), add = box.querySelector("[data-goal-add]"), listEl = box.querySelector("[data-goal-list]");
    function get() { return LS.get(KEY.goals, []); }
    function render() {
      var goals = get(); if (!listEl) return;
      if (!goals.length) { listEl.innerHTML = '<p class="muted">No goals yet. Add a SMART goal or KPI above — your goals are saved privately in this browser.</p>'; return; }
      listEl.innerHTML = goals.map(function (g, i) {
        var pct = g.target ? Math.min(100, Math.round((g.current / g.target) * 100)) : 0;
        var band = pct >= 80 ? "green" : pct >= 50 ? "amber" : "red";
        return '<div class="goal-row"><div class="g-top"><b>' + esc(g.name) + '</b><span><span class="tl-pill ' + band + '">' + pct + '%</span> <button class="g-del" data-del="' + i + '" aria-label="Delete goal">✕</button></span></div>' +
          '<div class="muted" style="font-size:.82rem;">' + esc(String(g.current)) + " / " + esc(String(g.target)) + " " + esc(g.unit || "") + '</div>' +
          '<div class="g-track"><span class="g-fill" style="width:' + pct + '%"></span></div></div>';
      }).join("");
      listEl.querySelectorAll("[data-del]").forEach(function (b) { b.addEventListener("click", function () { var g = get(); g.splice(parseInt(b.getAttribute("data-del"), 10), 1); LS.set(KEY.goals, g); render(); toast("Goal removed", "info"); }); });
    }
    if (add) add.addEventListener("click", function () {
      var nm = (name && name.value || "").trim(); if (!nm) { toast("Name the goal first", ""); return; }
      var c = parseFloat(cur && cur.value) || 0, t = parseFloat(tgt && tgt.value) || 100;
      var g = get(); g.push({ name: nm, current: c, target: t, unit: (box.querySelector("[data-goal-unit]") ? box.querySelector("[data-goal-unit]").value : "") }); LS.set(KEY.goals, g);
      if (name) name.value = ""; if (cur) cur.value = ""; if (tgt) tgt.value = "";
      render(); toast("🎯 Goal added", "ok");
    });
    var clr = box.querySelector("[data-goal-clear]"); if (clr) clr.addEventListener("click", function () { LS.set(KEY.goals, []); render(); toast("All goals cleared", "info"); });
    render();
  }

  function renderRailActive() { var here = location.pathname.split("/").pop() || "framework.html"; document.querySelectorAll(".rail-link").forEach(function (a) { if (a.getAttribute("href") === here) a.classList.add("active"); }); }
  window.SPB = { toast: toast, copy: copyText };
})();
