/* =====================================================================
   Leading Change — interactivity engine
   Loads AFTER the shared portfolio.js. Adds:
     • Dark mode  • Command palette (Ctrl/⌘+K) + FAB  • Toasts
     • Change Readiness diagnostic (8 dimensions → readiness score)
     • Roadmap / communication planners + reflection journal (saved)
     • Change-action & communication generators + gauges/bars/drill
   Research-informed (Kotter, ADKAR, transformational leadership);
   transformation scenarios are illustrative. Storage is localStorage.
   ===================================================================== */
(function () {
  "use strict";
  var LS = { get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  var KEY = { theme: "lcg:theme", readiness: "lcg:readiness", plan: "lcg:plan", comm: "lcg:comm", journal: "lcg:journal" };

  var DIMS = [
    { id: "leadership", name: "Leadership Readiness", ico: "🧭" },
    { id: "staff", name: "Staff Readiness", ico: "👥" },
    { id: "culture", name: "School Culture", ico: "🌍" },
    { id: "comm", name: "Communication", ico: "💬" },
    { id: "capacity", name: "Capacity for Change", ico: "🛠️" },
    { id: "resources", name: "Resource Availability", ico: "📦" },
    { id: "trust", name: "Organizational Trust", ico: "🤝" },
    { id: "innovation", name: "Innovation Mindset", ico: "💡" }
  ];

  var TOOLS = [
    { name: "Change Framework",        ico: "🧭", url: "change-framework.html", desc: "Six phases of transformation", group: "Framework" },
    { name: "Readiness Assessment",    ico: "🩺", url: "readiness.html",        desc: "Are you ready to change?", group: "Diagnose" },
    { name: "Transformation Roadmap",  ico: "🗺️", url: "roadmap.html",          desc: "Plan the journey", group: "Plan" },
    { name: "Stakeholder Engagement",  ico: "👥", url: "stakeholders.html",     desc: "Map & engage", group: "Plan" },
    { name: "Communication Strategy",  ico: "💬", url: "communication.html",    desc: "Message the change", group: "Plan" },
    { name: "Implementation Toolkit",  ico: "🧰", url: "implementation.html",   desc: "Plans, checklists, trackers", group: "Implement" },
    { name: "Culture & Sustainability",ico: "🌱", url: "culture.html",          desc: "Embed & sustain", group: "Implement" },
    { name: "Leadership Dashboard",    ico: "📊", url: "dashboard.html",        desc: "Transformation overview", group: "Insight" },
    { name: "Resources",               ico: "📂", url: "resources.html",        desc: "Tools & templates", group: "Insight" }
  ];

  document.addEventListener("DOMContentLoaded", function () {
    initTheme(); buildChrome(); initThemeToggle();
    initReadiness(); initSavedForms(); initJournal(); initGenerators();
    initGauges(); initBars(); initCountUp(); initDrilldowns(); renderRailActive();
  });

  function initTheme() { if (LS.get(KEY.theme, "light") === "dark") document.body.classList.add("lcg-dark"); }
  function initThemeToggle() {
    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) { sync(b); b.addEventListener("click", function () { document.body.classList.toggle("lcg-dark"); var d = document.body.classList.contains("lcg-dark"); LS.set(KEY.theme, d ? "dark" : "light"); document.querySelectorAll("[data-theme-toggle]").forEach(sync); toast(d ? "🌙 Dark mode on" : "☀️ Light mode on", "info"); }); });
    function sync(b) { b.textContent = document.body.classList.contains("lcg-dark") ? "☀️" : "🌙"; }
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
  function paletteItems() { var inP = /leading-change/.test(location.pathname); var base = inP ? "" : "projects/leading-change/"; return TOOLS.map(function (t) { return { ico: t.ico, name: t.name, hint: t.desc, url: base + t.url }; }); }
  function bindPalette() {
    var input = document.querySelector(".cmdk-input"); if (!input) return;
    input.addEventListener("input", function () { renderPalette(input.value); });
    input.addEventListener("keydown", function (e) { if (e.key === "ArrowDown") { e.preventDefault(); palIndex = Math.min(palIndex + 1, palMatches.length - 1); hi(); } else if (e.key === "ArrowUp") { e.preventDefault(); palIndex = Math.max(palIndex - 1, 0); hi(); } else if (e.key === "Enter") { var m = palMatches[palIndex]; if (m) location.href = m.url; } });
    function hi() { var els = document.querySelectorAll(".cmdk-item"); els.forEach(function (el, i) { el.classList.toggle("active", i === palIndex); }); if (els[palIndex]) els[palIndex].scrollIntoView({ block: "nearest" }); }
  }
  function renderPalette(q) { var list = document.querySelector(".cmdk-list"); if (!list) return; q = (q || "").toLowerCase().trim(); var all = paletteItems(); palMatches = !q ? all : all.filter(function (a) { return (a.name + " " + a.hint).toLowerCase().indexOf(q) > -1; }); palIndex = 0; if (!palMatches.length) { list.innerHTML = '<div class="cmdk-empty">No match — try “readiness”, “stakeholders”, or “roadmap”.</div>'; return; } list.innerHTML = palMatches.map(function (a, i) { return '<a class="cmdk-item' + (i === 0 ? " active" : "") + '" href="' + a.url + '"><span class="ico">' + a.ico + '</span><span>' + a.name + '</span><small>' + a.hint + "</small></a>"; }).join(""); }
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

  /* ===================== CHANGE READINESS DIAGNOSTIC ===================== */
  function initReadiness() {
    var root = document.querySelector("[data-assessment]"); if (!root) return;
    root.querySelectorAll(".likert").forEach(function (lk) { lk.querySelectorAll("button").forEach(function (b) { b.addEventListener("click", function () { lk.querySelectorAll("button").forEach(function (x) { x.classList.remove("on"); }); b.classList.add("on"); }); }); });
    var btn = root.querySelector("[data-assess-run]"), out = document.querySelector("[data-assess-result]");
    if (btn) btn.addEventListener("click", compute);
    var reset = root.querySelector("[data-assess-reset]"); if (reset) reset.addEventListener("click", function () { root.querySelectorAll(".likert button.on").forEach(function (b) { b.classList.remove("on"); }); if (out) out.classList.remove("show"); LS.set(KEY.readiness, null); toast("Assessment reset", "info"); });
    var saved = LS.get(KEY.readiness, null); if (saved && out) render(saved);
    function compute() {
      var scores = {}, counts = {}; DIMS.forEach(function (d) { scores[d.id] = 0; counts[d.id] = 0; });
      var answered = 0;
      root.querySelectorAll(".assess-item").forEach(function (item) { var dom = item.getAttribute("data-domain") || "leadership"; var on = item.querySelector(".likert button.on"); if (on) { scores[dom] += parseInt(on.getAttribute("data-v") || on.textContent, 10) || 0; counts[dom] += 1; answered++; } });
      if (!answered) { toast("Rate the statements to generate your readiness score", ""); return; }
      var pct = {}; DIMS.forEach(function (d) { pct[d.id] = counts[d.id] ? Math.round((scores[d.id] / (counts[d.id] * 5)) * 100) : 0; });
      var overall = Math.round(DIMS.reduce(function (s, d) { return s + pct[d.id]; }, 0) / DIMS.length);
      var data = { pct: pct, overall: overall }; LS.set(KEY.readiness, data); render(data); if (out) out.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    function render(data) {
      if (!out) return;
      var ranked = DIMS.slice().sort(function (a, b) { return data.pct[b.id] - data.pct[a.id]; });
      var band = data.overall >= 80 ? { t: "Ready to Lead Change", c: "green" } : data.overall >= 65 ? { t: "Mostly Ready — Prepare", c: "teal" } : data.overall >= 50 ? { t: "Build Readiness First", c: "amber" } : { t: "High Risk — Lay Groundwork", c: "red" };
      var bars = DIMS.map(function (d) { return '<div class="row"><span>' + d.ico + " " + d.name + '</span><span class="track"><span class="fill" data-pct="' + data.pct[d.id] + '" style="width:' + data.pct[d.id] + '%"></span></span><b>' + data.pct[d.id] + "%</b></div>"; }).join("");
      out.innerHTML =
        '<div class="assess-card"><h3>Change Readiness Score</h3><div style="display:flex;gap:1.6rem;flex-wrap:wrap;align-items:center;">' +
        '<div class="gauge" data-gauge="' + data.overall + '" data-gauge-suffix="%"><div class="hole"><b data-gauge-num>0%</b><small>Readiness</small></div></div>' +
        '<div style="flex:1;min-width:240px;"><p><span class="tl-pill ' + band.c + '">' + band.t + '</span></p><div class="barlist">' + bars + "</div></div></div></div>" +
        '<div class="assess-card"><h3>🌟 Readiness strengths</h3><ul>' + ranked.slice(0, 2).map(function (d) { return "<li><b>" + d.name + "</b> (" + data.pct[d.id] + "%) — leverage this to build momentum.</li>"; }).join("") + "</ul></div>" +
        '<div class="assess-card"><h3>⚠️ Risks to address first</h3><ul>' + ranked.slice(-2).map(function (d) { return "<li><b>" + d.name + "</b> (" + data.pct[d.id] + "%) — " + riskFor(d.id) + "</li>"; }).join("") + '</ul></div>' +
        '<div class="assess-card"><h3>🎯 Recommended leadership actions</h3><ul>' + ranked.slice(-3).map(function (d) { return "<li>" + actionFor(d.id) + "</li>"; }).join("") + '</ul><div class="btn-row" style="margin-top:.6rem;"><a class="btn" href="roadmap.html">Build the Roadmap</a><button class="out-btn" data-assess-reset>Reset</button></div><p class="muted" style="font-size:.85rem;margin-top:.6rem;">Grounded in Kotter &amp; ADKAR change research. A reflective diagnostic — lead people, not just programs.</p></div>';
      out.classList.add("show");
      var r2 = out.querySelector("[data-assess-reset]"); if (r2) r2.addEventListener("click", function () { root.querySelectorAll(".likert button.on").forEach(function (b) { b.classList.remove("on"); }); out.classList.remove("show"); LS.set(KEY.readiness, null); window.scrollTo({ top: 0, behavior: "smooth" }); });
      initGauges(); initBars();
    }
    function riskFor(id) { return { leadership: "without a guiding coalition, change stalls.", staff: "low buy-in breeds quiet resistance.", culture: "culture will eat the strategy if unaddressed.", comm: "unclear messaging creates confusion & rumor.", capacity: "people need time, skills, and support.", resources: "under-resourced change erodes trust.", trust: "low trust makes every step harder.", innovation: "a fixed mindset resists new practice." }[id]; }
    function actionFor(id) { return { leadership: "Build a guiding coalition and a shared, urgent vision.", staff: "Engage staff early; create quick wins and ownership.", culture: "Name and shape the culture; model the change.", comm: "Communicate the why often, through many channels.", capacity: "Invest in professional learning and protected time.", resources: "Align resources to the change before launch.", trust: "Build trust with transparency and follow-through.", innovation: "Create safe space to try, learn, and iterate." }[id]; }
  }

  /* ===================== SAVED FORMS (roadmap / communication) ===================== */
  function savedForm(form, key, label) {
    var saved = LS.get(key, {}); form.querySelectorAll("input[name],textarea[name],select[name]").forEach(function (f) { if (saved[f.name] != null) f.value = saved[f.name]; });
    var note = form.querySelector("[data-plan-saved]");
    function save() { var d = {}; form.querySelectorAll("input[name],textarea[name],select[name]").forEach(function (f) { d[f.name] = f.value; }); LS.set(key, d); if (note) { note.textContent = "✓ Saved locally"; setTimeout(function () { note.textContent = ""; }, 2000); } }
    form.addEventListener("submit", function (e) { e.preventDefault(); save(); toast("💾 " + label + " saved", "ok"); });
    form.querySelectorAll("input,textarea,select").forEach(function (f) { f.addEventListener("change", save); });
    var clr = form.querySelector("[data-plan-clear]"); if (clr) clr.addEventListener("click", function () { LS.set(key, {}); form.reset(); toast(label + " cleared", "info"); });
  }
  function initSavedForms() {
    var pl = document.querySelector("[data-planner]"); if (pl) savedForm(pl, KEY.plan, "Transformation roadmap");
    var cm = document.querySelector("[data-comm]"); if (cm) savedForm(cm, KEY.comm, "Communication plan");
  }
  function initJournal() {
    var box = document.querySelector("[data-journal]"); if (!box) return;
    var input = box.querySelector("textarea"), listEl = box.querySelector("[data-journal-list]"), add = box.querySelector("[data-journal-add]");
    function render() { var e = LS.get(KEY.journal, []); if (!listEl) return; listEl.innerHTML = e.length ? e.map(function (x, i) { return '<div class="lib-item"><span class="l-ico">🪞</span><div class="l-body"><b>Note ' + (e.length - i) + "</b><small>" + esc(x) + "</small></div></div>"; }).join("") : '<p class="muted">No entries yet. Saved privately in this browser.</p>'; }
    if (add) add.addEventListener("click", function () { var v = (input.value || "").trim(); if (!v) { toast("Write a note first", ""); return; } var e = LS.get(KEY.journal, []); e.unshift(v); LS.set(KEY.journal, e); input.value = ""; render(); toast("🪞 Saved", "ok"); });
    var clr = box.querySelector("[data-journal-clear]"); if (clr) clr.addEventListener("click", function () { LS.set(KEY.journal, []); render(); toast("Cleared", "info"); });
    render();
  }

  /* ===================== GENERATORS (change plan / communication) ===================== */
  var GEN = {
    changeplan: { label: "Change Action Plan", build: function (d) {
      var change = val(d, "change", "a school-wide instructional shift"), phase = val(d, "phase", "Create the Vision");
      return "<h3>Change Action Plan</h3><p class='muted'>Change: " + esc(change) + " · Phase: " + esc(phase) + "</p>" +
        "<h4>Why now (urgency &amp; vision)</h4><p>Make the case for change and paint a clear picture of success.</p>" +
        "<h4>Guiding Coalition</h4><ul><li>Who leads, who influences, who must be on board.</li></ul>" +
        "<h4>Key Actions</h4><ul><li>Short-term wins to build momentum.</li><li>Professional learning to build capacity.</li><li>Remove barriers &amp; align resources.</li></ul>" +
        "<h4>Stakeholders &amp; Communication</h4><p>Map stakeholders; communicate the why through multiple channels.</p>" +
        "<h4>Monitor &amp; Adapt</h4><p>Track leading indicators; adjust; celebrate progress.</p>" +
        "<h4>Sustain</h4><p>Embed in culture, systems, and leadership succession.</p>" +
        "<p class='muted' style='font-size:.85rem;'><span class='ai-pill'>Kotter + ADKAR</span> Lead people through change, not just programs. Illustrative template.</p>";
    }},
    commsg: { label: "Change Communication", build: function (d) {
      var aud = val(d, "audience", "Staff"), kind = val(d, "kind", "Launch message");
      return "<h3>" + esc(kind) + " — for " + esc(aud) + "</h3>" +
        "<h4>The Why</h4><p>Lead with purpose: why this change, why now, and what it means for " + esc(aud.toLowerCase()) + ".</p>" +
        "<h4>The What</h4><p>What is changing, what is not, and the timeline.</p>" +
        "<h4>The How &amp; Support</h4><p>How we'll get there together, and the support available.</p>" +
        "<h4>The Ask &amp; Next Step</h4><p>A clear, doable next step + how to give feedback.</p>" +
        "<p class='muted' style='font-size:.85rem;'>Clear, empathetic, two-way. Illustrative template.</p>";
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

  function renderRailActive() { var here = location.pathname.split("/").pop() || "change-framework.html"; document.querySelectorAll(".rail-link").forEach(function (a) { if (a.getAttribute("href") === here) a.classList.add("active"); }); }
  window.LCG = { toast: toast, copy: copyText };
})();
