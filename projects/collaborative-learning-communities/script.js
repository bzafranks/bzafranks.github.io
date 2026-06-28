/* =====================================================================
   Collaborative Learning Communities — PLC platform interactivity engine
   Loads AFTER the shared portfolio.js. Adds:
     • Dark mode  • Command palette (Ctrl/⌘+K) + FAB  • Notifications
     • Toasts  • Count-up + gauges + bar animations + drill-downs
     • PLC Health Assessment (6 pillars → Community Health Score)
     • Protocol / meeting-agenda generator
     • Live collaborative idea wall (localStorage, vote + add)
   ALL data is illustrative sample data. Storage is localStorage.
   ===================================================================== */
(function () {
  "use strict";
  var LS = { get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  var KEY = { theme: "clc:theme", assess: "clc:assess", ideas: "clc:ideas" };

  var PILLARS = [
    { id: "vision",        name: "Shared Vision & Purpose",        ico: "🎯" },
    { id: "culture",       name: "Collaborative Culture & Trust",  ico: "🤝" },
    { id: "inquiry",       name: "Collective Inquiry",             ico: "🔍" },
    { id: "results",       name: "Focus on Learning & Results",    ico: "📊" },
    { id: "reflection",    name: "Reflective Practice",            ico: "🪞" },
    { id: "leadership",    name: "Distributed Leadership",         ico: "🌱" }
  ];

  var TOOLS = [
    { name: "Community Dashboard",   ico: "📊", url: "dashboard.html",             desc: "Whole-community view",   group: "Overview" },
    { name: "PLC Framework",         ico: "🧭", url: "framework.html",             desc: "Six PLC pillars",        group: "Framework" },
    { name: "Collaborative Inquiry", ico: "🔍", url: "collaborative-inquiry.html", desc: "The inquiry cycle",      group: "Framework" },
    { name: "Meeting Hub",           ico: "🗓️", url: "meeting-hub.html",           desc: "Agendas, norms, minutes",group: "Practice" },
    { name: "Lesson Study",          ico: "📚", url: "lesson-study.html",          desc: "Plan, observe, refine",  group: "Practice" },
    { name: "Professional Learning", ico: "🎓", url: "professional-learning.html", desc: "Job-embedded PD",        group: "Practice" },
    { name: "Knowledge Library",     ico: "📂", url: "knowledge-library.html",     desc: "Shared practice bank",   group: "Knowledge" },
    { name: "Facilitator Toolkit",   ico: "🧰", url: "facilitator-toolkit.html",   desc: "Protocols & moves",      group: "Knowledge" },
    { name: "Resources",             ico: "📦", url: "resources.html",             desc: "Templates & reading",    group: "Knowledge" }
  ];

  document.addEventListener("DOMContentLoaded", function () {
    initTheme(); buildChrome(); initThemeToggle(); initNotifications();
    initAssessment(); initProtocolGen(); initIdeaWall();
    initGauges(); initBars(); initCountUp(); initDrilldowns(); initFilters(); renderRailActive();
  });

  function initTheme() { if (LS.get(KEY.theme, "light") === "dark") document.body.classList.add("clc-dark"); }
  function initThemeToggle() {
    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) { sync(b); b.addEventListener("click", function () { document.body.classList.toggle("clc-dark"); var d = document.body.classList.contains("clc-dark"); LS.set(KEY.theme, d ? "dark" : "light"); document.querySelectorAll("[data-theme-toggle]").forEach(sync); toast(d ? "🌙 Dark mode on" : "☀️ Light mode on", "info"); }); });
    function sync(b) { b.textContent = document.body.classList.contains("clc-dark") ? "☀️" : "🌙"; }
  }

  function buildChrome() {
    if (document.querySelector("[data-no-chrome]")) return;
    if (!document.querySelector(".toast-wrap")) { var tw = document.createElement("div"); tw.className = "toast-wrap"; document.body.appendChild(tw); }
    if (!document.querySelector(".fab")) { var f = document.createElement("button"); f.className = "fab"; f.type = "button"; f.title = "Command palette (Ctrl/⌘ + K)"; f.setAttribute("aria-label", "Command palette"); f.textContent = "🤝"; f.addEventListener("click", openPalette); document.body.appendChild(f); }
    if (!document.querySelector(".cmdk")) { var ov = document.createElement("div"); ov.className = "cmdk"; ov.innerHTML = '<div class="cmdk-box" role="dialog" aria-label="Command palette"><input class="cmdk-input" type="text" placeholder="Jump to a tool…" aria-label="Command search"><div class="cmdk-list"></div></div>'; document.body.appendChild(ov); ov.addEventListener("click", function (e) { if (e.target === ov) closePalette(); }); }
    bindPalette();
    document.addEventListener("keydown", function (e) { if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) { e.preventDefault(); openPalette(); } if (e.key === "Escape") { closePalette(); closeNotif(); } });
  }
  var palIndex = 0, palMatches = [];
  function paletteItems() { var inP = /collaborative-learning-communities/.test(location.pathname); var base = inP ? "" : "projects/collaborative-learning-communities/"; return TOOLS.map(function (t) { return { ico: t.ico, name: t.name, hint: t.desc, url: base + t.url }; }); }
  function bindPalette() {
    var input = document.querySelector(".cmdk-input"); if (!input) return;
    input.addEventListener("input", function () { renderPalette(input.value); });
    input.addEventListener("keydown", function (e) { if (e.key === "ArrowDown") { e.preventDefault(); palIndex = Math.min(palIndex + 1, palMatches.length - 1); hi(); } else if (e.key === "ArrowUp") { e.preventDefault(); palIndex = Math.max(palIndex - 1, 0); hi(); } else if (e.key === "Enter") { var m = palMatches[palIndex]; if (m) location.href = m.url; } });
    function hi() { var els = document.querySelectorAll(".cmdk-item"); els.forEach(function (el, i) { el.classList.toggle("active", i === palIndex); }); if (els[palIndex]) els[palIndex].scrollIntoView({ block: "nearest" }); }
  }
  function renderPalette(q) { var list = document.querySelector(".cmdk-list"); if (!list) return; q = (q || "").toLowerCase().trim(); var all = paletteItems(); palMatches = !q ? all : all.filter(function (a) { return (a.name + " " + a.hint).toLowerCase().indexOf(q) > -1; }); palIndex = 0; if (!palMatches.length) { list.innerHTML = '<div class="cmdk-empty">No match — try “meeting”, “inquiry”, or “lesson study”.</div>'; return; } list.innerHTML = palMatches.map(function (a, i) { return '<a class="cmdk-item' + (i === 0 ? " active" : "") + '" href="' + a.url + '"><span class="ico">' + a.ico + '</span><span>' + a.name + '</span><small>' + a.hint + "</small></a>"; }).join(""); }
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

  /* ===================== PLC HEALTH ASSESSMENT ===================== */
  function initAssessment() {
    var root = document.querySelector("[data-assessment]"); if (!root) return;
    root.querySelectorAll(".likert").forEach(function (lk) { lk.querySelectorAll("button").forEach(function (b) { b.addEventListener("click", function () { lk.querySelectorAll("button").forEach(function (x) { x.classList.remove("on"); }); b.classList.add("on"); }); }); });
    var btn = root.querySelector("[data-assess-run]"), out = document.querySelector("[data-assess-result]");
    if (btn) btn.addEventListener("click", compute);
    var reset = root.querySelector("[data-assess-reset]"); if (reset) reset.addEventListener("click", function () { root.querySelectorAll(".likert button.on").forEach(function (b) { b.classList.remove("on"); }); if (out) out.classList.remove("show"); LS.set(KEY.assess, null); toast("Assessment reset", "info"); });
    var saved = LS.get(KEY.assess, null); if (saved && out) render(saved);
    function compute() {
      var scores = {}, counts = {}; PILLARS.forEach(function (d) { scores[d.id] = 0; counts[d.id] = 0; });
      var answered = 0;
      root.querySelectorAll(".assess-item").forEach(function (item) { var dom = item.getAttribute("data-domain") || "vision"; var on = item.querySelector(".likert button.on"); if (on) { scores[dom] += parseInt(on.getAttribute("data-v") || on.textContent, 10) || 0; counts[dom] += 1; answered++; } });
      if (!answered) { toast("Rate the indicators to generate your Community Health Score", ""); return; }
      var pct = {}; PILLARS.forEach(function (d) { pct[d.id] = counts[d.id] ? Math.round((scores[d.id] / (counts[d.id] * 5)) * 100) : 0; });
      var overall = Math.round(PILLARS.reduce(function (s, d) { return s + pct[d.id]; }, 0) / PILLARS.length);
      var data = { pct: pct, overall: overall }; LS.set(KEY.assess, data); render(data); if (out) out.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    function render(data) {
      if (!out) return;
      var ranked = PILLARS.slice().sort(function (a, b) { return data.pct[b.id] - data.pct[a.id]; });
      var stage = data.overall >= 85 ? "Sustaining" : data.overall >= 70 ? "Developing" : data.overall >= 55 ? "Emerging" : "Forming";
      var bars = PILLARS.map(function (d) { return '<div class="row"><span>' + d.ico + " " + d.name + '</span><span class="track"><span class="fill" data-pct="' + data.pct[d.id] + '" style="width:' + data.pct[d.id] + '%"></span></span><b>' + data.pct[d.id] + "%</b></div>"; }).join("");
      out.innerHTML =
        '<div class="overall" style="margin-bottom:1.2rem;"><div><div class="big-score">' + data.overall + '</div><div style="color:#dceee9;">Community Health Score</div></div><div style="display:flex;flex-direction:column;gap:.5rem;"><span class="grade">' + stage + ' PLC</span><span style="color:#dceee9;font-size:.85rem;">across six PLC pillars</span></div></div>' +
        '<div class="assess-card"><h3>Strength by PLC Pillar</h3><div class="barlist">' + bars + "</div></div>" +
        '<div class="assess-card"><h3>🌟 Where your community is strong</h3><ul>' + ranked.slice(0, 2).map(function (d) { return "<li><b>" + d.name + "</b> (" + data.pct[d.id] + "%)</li>"; }).join("") + "</ul></div>" +
        '<div class="assess-card"><h3>🎯 Next steps to deepen practice</h3><ul>' + ranked.slice(-2).map(function (d) { return "<li><b>" + d.name + "</b> (" + data.pct[d.id] + "%) — " + actionFor(d.id) + "</li>"; }).join("") + '</ul><div class="btn-row" style="margin-top:.6rem;"><a class="btn" href="dashboard.html">Open Community Dashboard</a><button class="out-btn" data-assess-reset>Reset</button></div><p class="muted" style="font-size:.85rem;margin-top:.6rem;">A reflective team self-evaluation, best completed together. Stages are illustrative.</p></div>';
      out.classList.add("show");
      var r2 = out.querySelector("[data-assess-reset]"); if (r2) r2.addEventListener("click", function () { root.querySelectorAll(".likert button.on").forEach(function (b) { b.classList.remove("on"); }); out.classList.remove("show"); LS.set(KEY.assess, null); window.scrollTo({ top: 0, behavior: "smooth" }); });
      initBars();
    }
    function actionFor(id) { return {
      vision: "co-write a short shared mission &amp; SMART goals every member can name.",
      culture: "establish team norms &amp; invest in trust-building protocols.",
      inquiry: "adopt a recurring data-inquiry cycle around common assessments.",
      results: "agree on a few common formative measures and review them together.",
      reflection: "build short structured reflection into the end of every meeting.",
      leadership: "rotate facilitation and distribute leadership roles across the team."
    }[id]; }
  }

  /* ===================== PROTOCOL / AGENDA GENERATOR ===================== */
  var PROTOCOLS = {
    "PLC Meeting Agenda": { mins: 50, steps: ["Connection &amp; norms review (5 min)", "Review SMART goal &amp; data since last meeting (10 min)", "Collaborative inquiry: what is the student-learning question? (15 min)", "Decide next instructional action &amp; who owns it (10 min)", "Reflection &amp; commitments (5 min)", "Confirm next meeting &amp; roles (5 min)"] },
    "Norms & Commitments": { mins: 30, steps: ["Brainstorm: what helps us work well together? (8 min)", "Cluster into 4–6 draft norms (7 min)", "Pressure-test each norm: is it observable? (7 min)", "Agree on how we'll hold each other accountable (5 min)", "Record norms &amp; revisit date (3 min)"] },
    "Data Inquiry Protocol": { mins: 45, steps: ["Predict: what do we expect the data to show? (5 min)", "Observe: describe the data without judgment (10 min)", "Infer: what might explain these results? (10 min)", "Identify a focus student group &amp; skill (8 min)", "Plan a targeted instructional response (8 min)", "Set a date to check impact (4 min)"] },
    "Lesson Study Plan": { mins: 60, steps: ["Agree on the research question &amp; learning goal (10 min)", "Co-design the research lesson (20 min)", "Decide what observers will look for (10 min)", "Assign roles: teacher, observers, scribe (5 min)", "Plan the post-lesson debrief (10 min)", "Schedule the lesson &amp; debrief (5 min)"] },
    "Collaborative Inquiry Cycle": { mins: 50, steps: ["Frame the problem of practice (10 min)", "Gather evidence &amp; student work (10 min)", "Analyze together: what does the evidence say? (12 min)", "Choose a high-leverage change to test (10 min)", "Plan how to measure impact (5 min)", "Reflect &amp; set next cycle (3 min)"] },
    "Peer Observation Protocol": { mins: 40, steps: ["Pre-brief: host shares focus &amp; what to watch for (8 min)", "Low-inference observation (15 min)", "Observers organize evidence privately (5 min)", "Warm &amp; cool feedback to the host (8 min)", "Host reflects &amp; names a next step (4 min)"] },
    "Consultancy Protocol": { mins: 45, steps: ["Presenter frames a dilemma &amp; focus question (8 min)", "Clarifying questions (5 min)", "Probing questions (7 min)", "Group discusses while presenter listens (15 min)", "Presenter responds &amp; names takeaways (7 min)", "Debrief the process (3 min)"] },
    "Reflection Protocol": { mins: 25, steps: ["Individual quiet reflection on a prompt (5 min)", "Pairs share one insight &amp; one wondering (8 min)", "Whole-team patterns &amp; surprises (7 min)", "Each member names one commitment (5 min)"] }
  };
  function buildProtocol(type, d) {
    var p = PROTOCOLS[type] || PROTOCOLS["PLC Meeting Agenda"], team = val(d, "team", "Our PLC Team"), focus = val(d, "focus", "improving student learning");
    var steps = p.steps.map(function (s, i) { return "<li><b>" + (i + 1) + ".</b> " + s + "</li>"; }).join("");
    return "<h3>" + esc(type) + "</h3><p class='muted'>" + esc(team) + " · focus: " + esc(focus) + " · ~" + p.mins + " minutes</p>" +
      "<h4>Purpose</h4><p>A structured protocol to keep the team focused, equitable, and centered on " + esc(focus) + ". Appoint a facilitator and a timekeeper before you begin.</p>" +
      "<h4>Steps &amp; Timing</h4><ol style='list-style:none;padding-left:0;line-height:1.9;'>" + steps + "</ol>" +
      "<h4>Roles</h4><ul><li><b>Facilitator</b> — keeps time &amp; protects the protocol.</li><li><b>Recorder</b> — captures decisions &amp; next steps.</li><li><b>Process checker</b> — watches norms &amp; participation.</li></ul>" +
      "<h4>Close</h4><p>End by confirming <b>who does what by when</b>, and one sentence of reflection from each member.</p>" +
      "<p class='muted' style='font-size:.85rem;'><span class='ai-pill'>🤝 Facilitator's draft</span> Adapt timings to your team — protocols serve the work, not the other way around.</p>";
  }
  function initProtocolGen() {
    document.querySelectorAll("[data-generator='protocol']").forEach(function (form) {
      var out = document.querySelector("[data-output='protocol']") || form.parentElement.querySelector(".gen-output"); var last = null;
      form.addEventListener("submit", function (e) { e.preventDefault(); last = collect(form); run(last, out); });
      if (out) out.addEventListener("click", function (e) { var b = e.target.closest("[data-act]"); if (!b) return; var act = b.getAttribute("data-act"); var body = out.querySelector(".out-body"); if (act === "copy") copyText(body ? body.innerText : ""); else if (act === "print") window.print(); else if (act === "regen") run(last || collect(form), out); });
    });
  }
  function collect(form) { var d = {}; form.querySelectorAll("input[name],select[name],textarea[name]").forEach(function (f) { d[f.name] = f.value; }); return d; }
  function run(data, out) { if (!out) return; var body = out.querySelector(".out-body"), bar = out.querySelector(".out-toolbar"); if (bar) bar.querySelectorAll("[data-act]").forEach(function (b) { b.disabled = true; }); if (body) body.innerHTML = '<p class="muted">✨ Building your protocol…</p>'; setTimeout(function () { var type = val(data, "type", "PLC Meeting Agenda"); if (body) body.innerHTML = buildProtocol(type, data); if (bar) bar.querySelectorAll("[data-act]").forEach(function (b) { b.disabled = false; }); toast("Protocol ready", "ok"); }, 600); }

  /* ===================== LIVE COLLABORATIVE IDEA WALL ===================== */
  var SEED_IDEAS = [
    { txt: "Common formative assessment for fractions — share &amp; compare results next week.", who: "Grade 4 Math PLC", tag: "Inquiry", votes: 12 },
    { txt: "Try a 5-minute reflection protocol at the end of every meeting.", who: "Literacy Team", tag: "Reflection", votes: 9 },
    { txt: "Rotate meeting facilitation so leadership is shared.", who: "Science Department", tag: "Leadership", votes: 7 }
  ];
  function initIdeaWall() {
    var wall = document.querySelector("[data-idea-wall]"); if (!wall) return;
    var form = document.querySelector("[data-idea-form]");
    var ideas = LS.get(KEY.ideas, null); if (!ideas) { ideas = SEED_IDEAS.slice(); LS.set(KEY.ideas, ideas); }
    function save() { LS.set(KEY.ideas, ideas); }
    function paint() {
      var sorted = ideas.slice().sort(function (a, b) { return b.votes - a.votes; });
      wall.innerHTML = sorted.map(function (it) {
        var i = ideas.indexOf(it);
        return '<div class="idea-card"><div class="i-meta"><span class="chip">' + esc(it.tag) + '</span><span>' + esc(it.who) + '</span></div><p style="margin:.2rem 0 .6rem;">' + it.txt + '</p><button class="i-vote" type="button" data-vote="' + i + '">👍 <b>' + it.votes + '</b></button></div>';
      }).join("");
    }
    wall.addEventListener("click", function (e) { var b = e.target.closest("[data-vote]"); if (!b) return; var i = parseInt(b.getAttribute("data-vote"), 10); if (ideas[i]) { ideas[i].votes++; save(); paint(); toast("👍 Thanks for boosting an idea", "ok"); } });
    if (form) form.addEventListener("submit", function (e) {
      e.preventDefault(); var d = collect(form); var txt = (d.idea || "").trim(); if (!txt) { toast("Add a short idea first", ""); return; }
      ideas.push({ txt: esc(txt), who: esc((d.who || "A team member").trim()), tag: d.tag || "Idea", votes: 1 }); save(); paint(); form.reset(); toast("✨ Idea added to the wall", "ok");
    });
    var clear = document.querySelector("[data-idea-clear]"); if (clear) clear.addEventListener("click", function () { ideas = SEED_IDEAS.slice(); save(); paint(); toast("Idea wall reset to samples", "info"); });
    paint();
  }

  function renderRailActive() { var here = location.pathname.split("/").pop() || "dashboard.html"; document.querySelectorAll(".rail-link").forEach(function (a) { if (a.getAttribute("href") === here) a.classList.add("active"); }); }
  window.CLC = { toast: toast, copy: copyText };
})();
