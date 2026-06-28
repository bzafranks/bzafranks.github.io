/* =====================================================================
   Educational Leadership Academy — interactivity engine
   Loads AFTER the shared portfolio.js. Adds:
     • Dark mode  • Command palette (Ctrl/⌘+K) + FAB  • Toasts
     • Branching leadership SIMULATIONS (decisions → feedback → outcome)
     • Course progress + certification badges (saved)
     • Professional portfolio + coaching planner + reflection journal (saved)
     • Pathway / competency explorers, gauges, bars, count-up, drill-downs
   Research-informed; courses & scenarios are illustrative.
   Storage is localStorage; nothing leaves the browser.
   ===================================================================== */
(function () {
  "use strict";
  var LS = { get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  var KEY = { theme: "ela:theme", courses: "ela:courses", badges: "ela:badges", portfolio: "ela:portfolio", coaching: "ela:coaching", journal: "ela:journal" };

  var TOOLS = [
    { name: "Leadership Pathways",   ico: "🛤️", url: "leadership-pathways.html", desc: "Structured journeys", group: "Learn" },
    { name: "Competency Framework",  ico: "🎯", url: "competencies.html",        desc: "8 leadership competencies", group: "Learn" },
    { name: "Learning Academy",      ico: "🏛️", url: "academy.html",            desc: "Digital learning hub", group: "Learn" },
    { name: "Leadership Courses",    ico: "📚", url: "courses.html",             desc: "Course catalog", group: "Learn" },
    { name: "Coaching & Mentoring",  ico: "🧑‍🏫", url: "coaching.html",          desc: "Executive coaching", group: "Grow" },
    { name: "Leadership Simulations",ico: "🎮", url: "simulations.html",         desc: "Branching scenarios", group: "Grow" },
    { name: "Certification Programs",ico: "🏅", url: "certifications.html",      desc: "Badges & pathways", group: "Grow" },
    { name: "Professional Portfolio",ico: "📁", url: "portfolio.html",           desc: "Your leadership story", group: "Grow" },
    { name: "Leadership Dashboard",  ico: "📊", url: "dashboard.html",           desc: "Learning analytics", group: "Insight" },
    { name: "Resources",             ico: "📂", url: "resources.html",           desc: "Library & tools", group: "Insight" }
  ];

  document.addEventListener("DOMContentLoaded", function () {
    initTheme(); buildChrome(); initThemeToggle();
    initSimulations(); initCourses(); initBadges(); initPortfolio(); initCoaching(); initJournal();
    initExplorers(); initGauges(); initBars(); initCountUp(); initDrilldowns(); paintProgress(); renderRailActive();
  });

  function initTheme() { if (LS.get(KEY.theme, "light") === "dark") document.body.classList.add("ela-dark"); }
  function initThemeToggle() {
    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) { sync(b); b.addEventListener("click", function () { document.body.classList.toggle("ela-dark"); var d = document.body.classList.contains("ela-dark"); LS.set(KEY.theme, d ? "dark" : "light"); document.querySelectorAll("[data-theme-toggle]").forEach(sync); toast(d ? "🌙 Dark mode on" : "☀️ Light mode on", "info"); }); });
    function sync(b) { b.textContent = document.body.classList.contains("ela-dark") ? "☀️" : "🌙"; }
  }

  function buildChrome() {
    if (document.querySelector("[data-no-chrome]")) return;
    if (!document.querySelector(".toast-wrap")) { var tw = document.createElement("div"); tw.className = "toast-wrap"; document.body.appendChild(tw); }
    if (!document.querySelector(".fab")) { var f = document.createElement("button"); f.className = "fab"; f.type = "button"; f.title = "Command palette (Ctrl/⌘ + K)"; f.setAttribute("aria-label", "Command palette"); f.textContent = "🎓"; f.addEventListener("click", openPalette); document.body.appendChild(f); }
    if (!document.querySelector(".cmdk")) { var ov = document.createElement("div"); ov.className = "cmdk"; ov.innerHTML = '<div class="cmdk-box" role="dialog" aria-label="Command palette"><input class="cmdk-input" type="text" placeholder="Jump to a tool…" aria-label="Command search"><div class="cmdk-list"></div></div>'; document.body.appendChild(ov); ov.addEventListener("click", function (e) { if (e.target === ov) closePalette(); }); }
    bindPalette();
    document.addEventListener("keydown", function (e) { if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) { e.preventDefault(); openPalette(); } if (e.key === "Escape") closePalette(); });
  }
  var palIndex = 0, palMatches = [];
  function paletteItems() { var inP = /leadership-academy/.test(location.pathname); var base = inP ? "" : "projects/leadership-academy/"; return TOOLS.map(function (t) { return { ico: t.ico, name: t.name, hint: t.desc, url: base + t.url }; }); }
  function bindPalette() {
    var input = document.querySelector(".cmdk-input"); if (!input) return;
    input.addEventListener("input", function () { renderPalette(input.value); });
    input.addEventListener("keydown", function (e) { if (e.key === "ArrowDown") { e.preventDefault(); palIndex = Math.min(palIndex + 1, palMatches.length - 1); hi(); } else if (e.key === "ArrowUp") { e.preventDefault(); palIndex = Math.max(palIndex - 1, 0); hi(); } else if (e.key === "Enter") { var m = palMatches[palIndex]; if (m) location.href = m.url; } });
    function hi() { var els = document.querySelectorAll(".cmdk-item"); els.forEach(function (el, i) { el.classList.toggle("active", i === palIndex); }); if (els[palIndex]) els[palIndex].scrollIntoView({ block: "nearest" }); }
  }
  function renderPalette(q) { var list = document.querySelector(".cmdk-list"); if (!list) return; q = (q || "").toLowerCase().trim(); var all = paletteItems(); palMatches = !q ? all : all.filter(function (a) { return (a.name + " " + a.hint).toLowerCase().indexOf(q) > -1; }); palIndex = 0; if (!palMatches.length) { list.innerHTML = '<div class="cmdk-empty">No match — try “courses”, “simulation”, or “certification”.</div>'; return; } list.innerHTML = palMatches.map(function (a, i) { return '<a class="cmdk-item' + (i === 0 ? " active" : "") + '" href="' + a.url + '"><span class="ico">' + a.ico + '</span><span>' + a.name + '</span><small>' + a.hint + "</small></a>"; }).join(""); }
  function openPalette() { var ov = document.querySelector(".cmdk"); if (!ov) return; ov.classList.add("open"); renderPalette(""); var i = ov.querySelector(".cmdk-input"); if (i) { i.value = ""; i.focus(); } }
  function closePalette() { var ov = document.querySelector(".cmdk"); if (ov) ov.classList.remove("open"); }

  function toast(msg, kind) { var w = document.querySelector(".toast-wrap"); if (!w) return; var t = document.createElement("div"); t.className = "toast " + (kind || ""); t.textContent = msg; w.appendChild(t); setTimeout(function () { t.style.opacity = "0"; t.style.transition = "opacity .3s"; setTimeout(function () { t.remove(); }, 320); }, 2600); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function obsRun(els, fn) { if (!els.length) return; if ("IntersectionObserver" in window) { var o = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { fn(e.target); o.unobserve(e.target); } }); }, { threshold: 0.3 }); els.forEach(function (e) { o.observe(e); }); } else els.forEach(fn); }
  function initGauges() { obsRun(document.querySelectorAll("[data-gauge]"), function (el) { var t = parseFloat(el.getAttribute("data-gauge")) || 0, dur = 1100, start = null, num = el.querySelector("[data-gauge-num]"); function step(ts) { if (!start) start = ts; var p = Math.min((ts - start) / dur, 1); var v = t * (0.5 - Math.cos(p * Math.PI) / 2); el.style.setProperty("--val", v.toFixed(1)); if (num) num.textContent = Math.round(v) + (el.getAttribute("data-gauge-suffix") || ""); if (p < 1) requestAnimationFrame(step); } requestAnimationFrame(step); }); }
  function initBars() { obsRun(document.querySelectorAll(".barlist .fill[data-pct]"), function (el) { var p = el.getAttribute("data-pct"); el.style.width = "0%"; requestAnimationFrame(function () { el.style.transition = "width .9s ease"; el.style.width = p + "%"; }); }); obsRun(document.querySelectorAll(".barchart .bar[data-h]"), function (el) { var h = el.getAttribute("data-h"); el.style.height = "0%"; requestAnimationFrame(function () { el.style.height = h + "%"; }); }); }
  function initCountUp() { obsRun(document.querySelectorAll("[data-count]"), function (el) { var t = parseFloat(el.getAttribute("data-count")), suf = el.getAttribute("data-suffix") || "", pre = el.getAttribute("data-prefix") || "", dur = 1000, start = null; function step(ts) { if (!start) start = ts; var p = Math.min((ts - start) / dur, 1); var v = t * (0.5 - Math.cos(p * Math.PI) / 2); el.textContent = pre + (t % 1 === 0 ? Math.round(v) : v.toFixed(1)) + suf; if (p < 1) requestAnimationFrame(step); } requestAnimationFrame(step); }); }
  function initDrilldowns() { document.querySelectorAll(".drill-row").forEach(function (row) { row.addEventListener("click", function () { var p = row.nextElementSibling; if (p && p.classList.contains("drill-panel")) { row.classList.toggle("open"); p.classList.toggle("open"); } }); }); }
  function initExplorers() {
    document.querySelectorAll(".comp-card").forEach(function (c) { c.addEventListener("click", function () { var d = c.querySelector(".comp-detail"); if (d) d.classList.toggle("open"); }); });
    document.querySelectorAll(".pathway-card[data-expand]").forEach(function (c) { c.addEventListener("click", function (e) { if (e.target.closest("a,button")) return; var d = c.querySelector(".p-detail"); if (d) d.classList.toggle("open"); }); });
  }

  /* ===================== BRANCHING SIMULATIONS ===================== */
  function initSimulations() {
    document.querySelectorAll("[data-sim]").forEach(function (sim) {
      var stages = sim.querySelectorAll(".sim-stage");
      var decisions = 0;
      showStage(sim.getAttribute("data-start") || (stages[0] && stages[0].getAttribute("data-step")));
      sim.addEventListener("click", function (e) {
        var opt = e.target.closest(".sim-opt");
        if (opt) {
          var stage = opt.closest(".sim-stage");
          var fb = stage.querySelector(".sim-feedback"); if (!fb) { fb = document.createElement("div"); fb.className = "sim-feedback"; stage.appendChild(fb); }
          decisions++;
          var goto = opt.getAttribute("data-goto"), note = opt.getAttribute("data-note") || "Consider the impact of that choice on trust and outcomes.";
          fb.innerHTML = "<p><b>Coaching note:</b> " + esc(note) + '</p><div style="margin-top:.5rem;"><button class="btn small" data-sim-continue="' + esc(goto || "") + '">Continue →</button></div>';
          fb.classList.add("show");
          stage.querySelectorAll(".sim-opt").forEach(function (o) { o.disabled = true; o.style.opacity = "0.55"; });
          fb.scrollIntoView({ behavior: "smooth", block: "nearest" });
          return;
        }
        var cont = e.target.closest("[data-sim-continue]");
        if (cont) { var target = cont.getAttribute("data-sim-continue"); if (target) showStage(target); return; }
        var rs = e.target.closest("[data-sim-restart]");
        if (rs) { decisions = 0; sim.querySelectorAll(".sim-feedback").forEach(function (f) { f.classList.remove("show"); f.innerHTML = ""; }); sim.querySelectorAll(".sim-opt").forEach(function (o) { o.disabled = false; o.style.opacity = ""; }); showStage(sim.getAttribute("data-start") || (stages[0] && stages[0].getAttribute("data-step"))); toast("Simulation restarted", "info"); }
      });
      function showStage(id) { stages.forEach(function (s) { s.hidden = s.getAttribute("data-step") !== id; }); var active = sim.querySelector('.sim-stage[data-step="' + id + '"]'); if (active) active.scrollIntoView({ behavior: "smooth", block: "nearest" }); }
    });
  }

  /* ===================== COURSE PROGRESS ===================== */
  function coursesGet() { return LS.get(KEY.courses, []); }
  function initCourses() {
    var done = coursesGet();
    document.querySelectorAll(".course-card").forEach(function (card) { var id = card.getAttribute("data-course"); if (id && done.indexOf(id) > -1) markDone(card, true); });
    document.querySelectorAll("[data-course-toggle]").forEach(function (btn) {
      var id = btn.getAttribute("data-course-toggle"); var card = btn.closest(".course-card");
      sync(btn, coursesGet().indexOf(id) > -1);
      btn.addEventListener("click", function () {
        var d = coursesGet(), i = d.indexOf(id);
        if (i > -1) { d.splice(i, 1); if (card) markDone(card, false); toast("Marked incomplete", "info"); }
        else { d.push(id); if (card) markDone(card, true); toast("✓ Course completed", "ok"); }
        LS.set(KEY.courses, d); sync(btn, i === -1); paintProgress();
      });
    });
    function sync(btn, on) { btn.textContent = on ? "✓ Completed" : "Mark complete"; btn.classList.toggle("tl-pill", false); }
    function markDone(card, on) { card.classList.toggle("done", on); var fill = card.querySelector(".course-prog .fill"); if (fill) fill.style.width = on ? "100%" : "0%"; }
  }

  /* ===================== CERTIFICATION BADGES ===================== */
  function initBadges() {
    var earned = LS.get(KEY.badges, []);
    document.querySelectorAll(".badge[data-badge]").forEach(function (b) { var id = b.getAttribute("data-badge"); if (earned.indexOf(id) > -1) b.classList.add("earned"), b.classList.remove("locked"); });
    document.querySelectorAll("[data-badge-claim]").forEach(function (btn) {
      var id = btn.getAttribute("data-badge-claim"), badge = btn.closest(".badge");
      btn.addEventListener("click", function () {
        var e = LS.get(KEY.badges, []); if (e.indexOf(id) === -1) { e.push(id); LS.set(KEY.badges, e); if (badge) { badge.classList.add("earned"); badge.classList.remove("locked"); } toast("🏅 Credential earned (demo)", "ok"); paintProgress(); }
        else toast("Already earned", "info");
      });
    });
  }

  function paintProgress() {
    var c = coursesGet().length, b = LS.get(KEY.badges, []).length;
    document.querySelectorAll("[data-courses-done]").forEach(function (e) { e.textContent = c; });
    document.querySelectorAll("[data-badges-earned]").forEach(function (e) { e.textContent = b; });
  }

  /* ===================== PORTFOLIO / COACHING (saved) ===================== */
  function savedForm(sel, key, label) {
    var form = document.querySelector(sel); if (!form) return;
    var saved = LS.get(key, {}); form.querySelectorAll("input[name],textarea[name],select[name]").forEach(function (f) { if (saved[f.name] != null) f.value = saved[f.name]; });
    var note = form.querySelector("[data-plan-saved]");
    function save() { var d = {}; form.querySelectorAll("input[name],textarea[name],select[name]").forEach(function (f) { d[f.name] = f.value; }); LS.set(key, d); if (note) { note.textContent = "✓ Saved locally"; setTimeout(function () { note.textContent = ""; }, 2000); } }
    form.addEventListener("submit", function (e) { e.preventDefault(); save(); toast("💾 " + label + " saved", "ok"); });
    form.querySelectorAll("input,textarea,select").forEach(function (f) { f.addEventListener("change", save); });
    var clr = form.querySelector("[data-plan-clear]"); if (clr) clr.addEventListener("click", function () { LS.set(key, {}); form.reset(); toast(label + " cleared", "info"); });
  }
  function initPortfolio() { savedForm("[data-portfolio]", KEY.portfolio, "Portfolio"); }
  function initCoaching() { savedForm("[data-coaching]", KEY.coaching, "Coaching plan"); }
  function initJournal() {
    var box = document.querySelector("[data-journal]"); if (!box) return;
    var input = box.querySelector("textarea"), listEl = box.querySelector("[data-journal-list]"), add = box.querySelector("[data-journal-add]");
    function render() { var e = LS.get(KEY.journal, []); if (!listEl) return; listEl.innerHTML = e.length ? e.map(function (x, i) { return '<div class="lib-item"><span class="l-ico">🪞</span><div class="l-body"><b>Entry ' + (e.length - i) + "</b><small>" + esc(x) + "</small></div></div>"; }).join("") : '<p class="muted">No entries yet. Saved privately in this browser.</p>'; }
    if (add) add.addEventListener("click", function () { var v = (input.value || "").trim(); if (!v) { toast("Write a reflection first", ""); return; } var e = LS.get(KEY.journal, []); e.unshift(v); LS.set(KEY.journal, e); input.value = ""; render(); toast("🪞 Saved", "ok"); });
    var clr = box.querySelector("[data-journal-clear]"); if (clr) clr.addEventListener("click", function () { LS.set(KEY.journal, []); render(); toast("Journal cleared", "info"); });
    render();
  }

  function renderRailActive() { var here = location.pathname.split("/").pop() || "academy.html"; document.querySelectorAll(".rail-link").forEach(function (a) { if (a.getAttribute("href") === here) a.classList.add("active"); }); }
  window.ELA = { toast: toast };
})();
