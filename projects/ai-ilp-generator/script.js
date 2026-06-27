/* =====================================================================
   AI Individual Learning Plan Generator — interactivity engine
   Loads AFTER the shared portfolio.js. Adds:
     • Dark mode  • Command palette (Ctrl/⌘+K) + FAB  • Toasts + clipboard
     • Simulated AI generators (learning plan, goals, pathways,
       recommendations, supports, interventions, enrichment, career,
       parent comms, reports) — each with a rationale
     • Animated goal rings / progress bars / gauges / count-up
     • Drill-downs, library, autosave indicator
   NOTE: AI is simulated client-side; data is fictional. The AI is a
   PLANNING ASSISTANT — educators review, approve, and adapt all plans.
   ===================================================================== */
(function () {
  "use strict";
  var LS = { get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  var KEY = { theme: "ilp:theme", lib: "ilp:library", hist: "ilp:hist", stats: "ilp:stats" };

  var TOOLS = [
    { name: "Student Profile",        ico: "🧑‍🎓", url: "student-profile.html",   desc: "Whole-learner profile", group: "Learner" },
    { name: "Learning Plan Generator",ico: "✨", url: "learning-plan.html",       desc: "Generate a full ILP", group: "Plan" },
    { name: "Learning Goals",         ico: "🎯", url: "goals.html",               desc: "SMART goals & tracking", group: "Plan" },
    { name: "Learning Pathways",      ico: "🛤️", url: "pathways.html",            desc: "Personalized pathways", group: "Plan" },
    { name: "Strengths & Interests",  ico: "🌟", url: "strengths.html",           desc: "Learner inventory", group: "Learner" },
    { name: "Assessment Review",      ico: "📊", url: "assessment-review.html",   desc: "Evidence analysis", group: "Learner" },
    { name: "AI Recommendations",     ico: "💡", url: "ai-recommendations.html",  desc: "With rationale", group: "Plan" },
    { name: "Accommodations & Supports",ico: "🧩", url: "supports.html",          desc: "Instructional supports", group: "Support" },
    { name: "Intervention Planner",   ico: "🛠️", url: "interventions.html",       desc: "Plan & monitor", group: "Support" },
    { name: "Enrichment Planner",     ico: "🚀", url: "enrichment.html",          desc: "Advanced learning", group: "Support" },
    { name: "Career Connections",     ico: "🧭", url: "career-connections.html",  desc: "Interests → futures", group: "Support" },
    { name: "Parent Portal",          ico: "👨‍👩‍👧", url: "parent-portal.html",   desc: "Family view", group: "People" },
    { name: "Teacher Dashboard",      ico: "📋", url: "teacher-dashboard.html",   desc: "Class overview", group: "People" },
    { name: "Progress Monitoring",    ico: "📈", url: "progress.html",            desc: "Growth over time", group: "People" },
    { name: "Reports",                ico: "📄", url: "reports.html",             desc: "ILP & progress reports", group: "Deliver" },
    { name: "Settings",               ico: "⚙️", url: "settings.html",            desc: "Preferences & ethics", group: "Deliver" }
  ];

  document.addEventListener("DOMContentLoaded", function () {
    initTheme(); buildChrome(); initThemeToggle();
    initGenerators(); initWorkspace(); initLibrary(); initChipToggles();
    initRings(); initBars(); initGauges(); initCountUp(); initDrilldowns();
    initStats(); renderRailActive();
  });

  function initTheme() { if (LS.get(KEY.theme, "light") === "dark") document.body.classList.add("ilp-dark"); }
  function initThemeToggle() {
    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) { sync(b); b.addEventListener("click", function () { document.body.classList.toggle("ilp-dark"); var d = document.body.classList.contains("ilp-dark"); LS.set(KEY.theme, d ? "dark" : "light"); document.querySelectorAll("[data-theme-toggle]").forEach(sync); toast(d ? "🌙 Dark mode on" : "☀️ Light mode on", "info"); }); });
    function sync(b) { b.textContent = document.body.classList.contains("ilp-dark") ? "☀️" : "🌙"; }
  }

  function buildChrome() {
    if (document.querySelector("[data-no-chrome]")) return;
    if (!document.querySelector(".toast-wrap")) { var tw = document.createElement("div"); tw.className = "toast-wrap"; document.body.appendChild(tw); }
    if (!document.querySelector(".fab")) { var f = document.createElement("button"); f.className = "fab"; f.type = "button"; f.title = "Command palette (Ctrl/⌘ + K)"; f.setAttribute("aria-label", "Command palette"); f.textContent = "✨"; f.addEventListener("click", openPalette); document.body.appendChild(f); }
    if (!document.querySelector(".cmdk")) { var ov = document.createElement("div"); ov.className = "cmdk"; ov.innerHTML = '<div class="cmdk-box" role="dialog" aria-label="Command palette"><input class="cmdk-input" type="text" placeholder="Jump to a tool, or describe a learner need…" aria-label="Command search"><div class="cmdk-list"></div></div>'; document.body.appendChild(ov); ov.addEventListener("click", function (e) { if (e.target === ov) closePalette(); }); }
    bindPalette();
    document.addEventListener("keydown", function (e) { if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) { e.preventDefault(); openPalette(); } if (e.key === "Escape") closePalette(); });
  }
  var palIndex = 0, palMatches = [];
  function paletteItems() { var inP = /ai-ilp-generator/.test(location.pathname); var base = inP ? "" : "projects/ai-ilp-generator/"; return TOOLS.map(function (t) { return { ico: t.ico, name: t.name, hint: t.desc, url: base + t.url }; }); }
  function bindPalette() {
    var input = document.querySelector(".cmdk-input"); if (!input) return;
    input.addEventListener("input", function () { renderPalette(input.value); });
    input.addEventListener("keydown", function (e) { if (e.key === "ArrowDown") { e.preventDefault(); palIndex = Math.min(palIndex + 1, palMatches.length - 1); hi(); } else if (e.key === "ArrowUp") { e.preventDefault(); palIndex = Math.max(palIndex - 1, 0); hi(); } else if (e.key === "Enter") { var m = palMatches[palIndex]; if (m) location.href = m.url; } });
    function hi() { var els = document.querySelectorAll(".cmdk-item"); els.forEach(function (el, i) { el.classList.toggle("active", i === palIndex); }); if (els[palIndex]) els[palIndex].scrollIntoView({ block: "nearest" }); }
  }
  function renderPalette(q) { var list = document.querySelector(".cmdk-list"); if (!list) return; q = (q || "").toLowerCase().trim(); var all = paletteItems(); palMatches = !q ? all : all.filter(function (a) { return (a.name + " " + a.hint).toLowerCase().indexOf(q) > -1; }); palIndex = 0; if (!palMatches.length) { list.innerHTML = '<div class="cmdk-empty">No match — try “plan”, “goals”, or “career”.</div>'; return; } list.innerHTML = palMatches.map(function (a, i) { return '<a class="cmdk-item' + (i === 0 ? " active" : "") + '" href="' + a.url + '"><span class="ico">' + a.ico + '</span><span>' + a.name + '</span><small>' + a.hint + "</small></a>"; }).join(""); }
  function openPalette() { var ov = document.querySelector(".cmdk"); if (!ov) return; ov.classList.add("open"); renderPalette(""); var i = ov.querySelector(".cmdk-input"); if (i) { i.value = ""; i.focus(); } }
  function closePalette() { var ov = document.querySelector(".cmdk"); if (ov) ov.classList.remove("open"); }

  function toast(msg, kind) { var w = document.querySelector(".toast-wrap"); if (!w) return; var t = document.createElement("div"); t.className = "toast " + (kind || ""); t.textContent = msg; w.appendChild(t); setTimeout(function () { t.style.opacity = "0"; t.style.transition = "opacity .3s"; setTimeout(function () { t.remove(); }, 320); }, 2400); }
  function copyText(text) { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { toast("📋 Copied", "ok"); }, function () { toast("Copy failed", ""); }); else toast("Clipboard unavailable", ""); }

  function getStats() { return LS.get(KEY.stats, { generated: 0, plans: 0 }); }
  function bump(which) { var s = getStats(); s.generated += 1; if (which === "plan") s.plans += 1; LS.set(KEY.stats, s); paintStats(); }
  function paintStats() { var s = getStats(); document.querySelectorAll("[data-stat=generated]").forEach(function (e) { e.textContent = s.generated; }); document.querySelectorAll("[data-stat=plans]").forEach(function (e) { e.textContent = s.plans; }); }
  function initStats() { paintStats(); }

  function libGet() { return LS.get(KEY.lib, []); }
  function libAdd(it) { var l = libGet(); it.id = "p" + l.length; l.unshift(it); LS.set(KEY.lib, l); }
  function initLibrary() {
    var wrap = document.querySelector("[data-library]"); if (!wrap) return; paint();
    var s = document.querySelector("[data-library-search]"); if (s) s.addEventListener("input", function () { paint(s.value); });
    function paint(q) { q = (q || "").toLowerCase(); var items = libGet().filter(function (it) { return !q || (it.title + " " + (it.body || "")).toLowerCase().indexOf(q) > -1; });
      if (!items.length) { wrap.innerHTML = '<div class="out-empty" style="height:auto;padding:2rem;"><div><div class="big">🗂️</div><p>Nothing saved yet. Generate a plan or resource and press <b>Save</b>.</p></div></div>'; return; }
      var ic = { plan: "✨", goals: "🎯", pathway: "🛤️", rec: "💡", supports: "🧩", intervention: "🛠️", enrichment: "🚀", career: "🧭", parent: "👨‍👩‍👧", report: "📄", other: "📄" };
      wrap.innerHTML = items.map(function (it) { return '<div class="lib-item"><span class="l-ico">' + (ic[it.type] || "📄") + '</span><div class="l-body"><b>' + esc(it.title) + "</b><small>" + esc((it.body || "").slice(0, 90)) + "…</small></div><span class=\"l-tag\">" + esc(it.type) + "</span></div>"; }).join("");
    }
  }

  function initChipToggles() { document.querySelectorAll(".chip-toggle").forEach(function (c) { c.addEventListener("click", function () { if (c.hasAttribute("data-single")) c.parentElement.querySelectorAll(".chip-toggle").forEach(function (x) { x.classList.remove("on"); }); c.classList.toggle("on"); }); }); }
  function chipVal(form, group) { var on = form.querySelectorAll('.chip-set[data-group="' + group + '"] .chip-toggle.on'); return Array.prototype.map.call(on, function (c) { return c.textContent.trim(); }); }

  /* ---------- animations ---------- */
  function initRings() { var els = document.querySelectorAll(".ring[data-val]"); if (!els.length) return; obsRun(els, function (el) { var t = parseFloat(el.getAttribute("data-val")) || 0, dur = 1000, start = null, hole = el.querySelector(".hole"); function step(ts) { if (!start) start = ts; var p = Math.min((ts - start) / dur, 1); var v = t * (0.5 - Math.cos(p * Math.PI) / 2); el.style.setProperty("--val", v.toFixed(1)); if (hole && hole.hasAttribute("data-ring-num")) hole.textContent = Math.round(v) + "%"; if (p < 1) requestAnimationFrame(step); } requestAnimationFrame(step); }); }
  function initBars() { var fills = document.querySelectorAll(".prog-bar .fill[data-pct], .barlist .fill[data-pct]"); if (!fills.length) return; obsRun(fills, function (el) { var p = el.getAttribute("data-pct"); el.style.width = "0%"; requestAnimationFrame(function () { el.style.transition = "width .9s ease"; el.style.width = p + "%"; }); }); }
  function initGauges() { var els = document.querySelectorAll("[data-gauge]"); if (!els.length) return; obsRun(els, function (el) { var t = parseFloat(el.getAttribute("data-gauge")) || 0, dur = 1100, start = null, num = el.querySelector("[data-gauge-num]"); function step(ts) { if (!start) start = ts; var p = Math.min((ts - start) / dur, 1); var v = t * (0.5 - Math.cos(p * Math.PI) / 2); el.style.setProperty("--val", v.toFixed(1)); if (num) num.textContent = Math.round(v) + (el.getAttribute("data-gauge-suffix") || ""); if (p < 1) requestAnimationFrame(step); } requestAnimationFrame(step); }); }
  function initCountUp() { var els = document.querySelectorAll("[data-count]"); if (!els.length) return; obsRun(els, function (el) { var t = parseFloat(el.getAttribute("data-count")), suf = el.getAttribute("data-suffix") || "", pre = el.getAttribute("data-prefix") || "", dur = 1000, start = null; function step(ts) { if (!start) start = ts; var p = Math.min((ts - start) / dur, 1); var v = t * (0.5 - Math.cos(p * Math.PI) / 2); el.textContent = pre + (t % 1 === 0 ? Math.round(v) : v.toFixed(1)) + suf; if (p < 1) requestAnimationFrame(step); } requestAnimationFrame(step); }); }
  function obsRun(els, fn) { if ("IntersectionObserver" in window) { var o = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { fn(e.target); o.unobserve(e.target); } }); }, { threshold: 0.3 }); els.forEach(function (e) { o.observe(e); }); } else els.forEach(fn); }
  function initDrilldowns() { document.querySelectorAll(".drill-row").forEach(function (row) { row.addEventListener("click", function () { var p = row.nextElementSibling; if (p && p.classList.contains("drill-panel")) { row.classList.toggle("open"); p.classList.toggle("open"); } }); }); }

  /* ===================== GENERATORS ===================== */
  function initGenerators() {
    document.querySelectorAll("[data-generator]").forEach(function (form) {
      var type = form.getAttribute("data-generator");
      var out = document.querySelector('[data-output="' + type + '"]') || form.parentElement.querySelector(".gen-output"); var last = null;
      form.addEventListener("submit", function (e) { e.preventDefault(); last = collect(form); run(type, last, out); });
      if (out) out.addEventListener("click", function (e) { var b = e.target.closest("[data-act]"); if (!b) return; var act = b.getAttribute("data-act"); var body = out.querySelector(".out-body"); if (act === "copy") copyText(body ? body.innerText : ""); else if (act === "print") window.print(); else if (act === "regen") run(type, last || collect(form), out); else if (act === "save") { if (!body || !body.innerText.trim()) { toast("Generate something first", ""); return; } var title = (last && (last.student || last.area || last.topic)) || GEN[type].label; libAdd({ type: type, title: title + " — " + GEN[type].label, body: body.innerText }); toast("💾 Saved to library", "ok"); } });
    });
  }
  function collect(form) { var d = {}; form.querySelectorAll("input[name],select[name],textarea[name]").forEach(function (f) { d[f.name] = f.value; }); form.querySelectorAll(".chip-set[data-group]").forEach(function (cs) { d[cs.getAttribute("data-group")] = chipVal(form, cs.getAttribute("data-group")); }); return d; }
  function run(type, data, out) {
    if (!out || !GEN[type]) return; var body = out.querySelector(".out-body"), bar = out.querySelector(".out-toolbar");
    if (bar) bar.querySelectorAll("[data-act]").forEach(function (b) { b.disabled = true; });
    if (body) body.innerHTML = '<div class="gen-loading"><div class="ai-pill">✨ AI is drafting a plan…</div><div class="shimmer w90"></div><div class="shimmer"></div><div class="shimmer w70"></div><div class="shimmer w50"></div><div class="shimmer w90"></div><div class="shimmer w70"></div></div>';
    setTimeout(function () { if (body) body.innerHTML = GEN[type].build(data); if (bar) bar.querySelectorAll("[data-act]").forEach(function (b) { b.disabled = false; }); bump(type === "plan" ? "plan" : ""); toast("✨ Draft ready — review & approve before use", "ok"); }, 780);
  }

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function val(d, k, fb) { return d && d[k] ? d[k] : fb; }
  function list(a) { return "<ul>" + a.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</ul>"; }
  function why(t) { return '<p class="muted" style="border-left:2px solid var(--border);padding-left:.6rem;font-size:.86rem;"><b>Why this recommendation:</b> ' + t + "</p>"; }
  function review() { return '<p class="muted" style="margin-top:1rem;font-size:.85rem;"><span class="ai-pill">👤 Educator approves</span> AI is a planning assistant on fictional data — review, approve, and adapt before use.</p>'; }

  var GEN = {
    plan: { label: "Individual Learning Plan", build: function (d) {
      var s = val(d, "student", "Jordan M."), grade = val(d, "grade", "Grade 6");
      return "<h3>Individual Learning Plan — " + esc(s) + "</h3><p class='muted'>" + esc(grade) + " · draft for educator review &amp; approval</p>" +
        "<h4>Student Summary</h4><p>" + esc(s) + " is a curious, collaborative learner who thrives with hands-on tasks and choice. Reading is a strength; multi-step math and sustained writing are growth areas. Attendance is strong.</p>" +
        "<h4>Strengths</h4>" + list(["Verbal reasoning &amp; discussion", "Creativity and project work", "Peer collaboration"]) +
        "<h4>Growth Areas</h4>" + list(["Multi-step problem solving (math)", "Organizing extended writing", "Executive functioning / task initiation"]) +
        "<h4>Learning Goals (SMART)</h4>" + list(["Math: solve 2-step word problems with 80% accuracy by end of term.", "Writing: produce an organized 5-paragraph piece using a planning template.", "Engagement: self-start independent work within 3 minutes, 4/5 days."]) +
        "<h4>Recommended Instructional Strategies</h4>" + list(["Gradual release with worked examples + think-alouds.", "Graphic organizers for writing and multi-step problems.", "Choice-based tasks to leverage interests."]) +
        "<h4>Suggested Interventions</h4>" + list(["Tier 2 math small-group, 3×/week, 6 weeks.", "Executive-functioning check-in + visual schedule."]) +
        "<h4>Enrichment Opportunities</h4>" + list(["Project-based extension connected to robotics interest.", "Peer-mentoring role in discussions."]) +
        "<h4>Recommended Assessments</h4>" + list(["Curriculum-based math probes (weekly).", "Writing rubric checkpoints."]) +
        "<h4>Progress Monitoring</h4><p>Weekly data review for 6 weeks; family update at week 3; formal review at week 6.</p>" +
        "<h4>Teacher Review &amp; Approval</h4><p>☐ Reviewed · ☐ Adjusted · ☐ Approved by ____________ (date ____)</p>" + review();
    }},
    goals: { label: "SMART Goals", build: function (d) {
      var area = val(d, "area", "Mathematics");
      return "<h3>SMART Goals — " + esc(area) + "</h3>" +
        "<h4>Goal</h4><p>By the end of the term, the student will " + esc(area.toLowerCase()) + " target with 80% accuracy across 3 consecutive checks.</p>" +
        "<h4>SMART Breakdown</h4>" + list(["<b>Specific:</b> a clearly defined, observable skill.", "<b>Measurable:</b> 80% accuracy, 3 consecutive checks.", "<b>Achievable:</b> one step beyond current performance.", "<b>Relevant:</b> tied to grade-level standards &amp; interests.", "<b>Time-bound:</b> end of term, with weekly checkpoints."]) +
        "<h4>Progress Indicators</h4>" + list(["Weekly probe scores", "Work-sample quality", "Student self-rating"]) + why("Goals are written one step beyond the student's current data so success is reachable and motivating.") + review();
    }},
    pathway: { label: "Learning Pathway", build: function (d) {
      var p = val(d, "pathway", "On-Level Progression");
      return "<h3>Learning Pathway — " + esc(p) + "</h3>" +
        "<h4>Milestones</h4>" + list(["Milestone 1 (Weeks 1–3): foundational skills + diagnostic.", "Milestone 2 (Weeks 4–7): application &amp; guided projects.", "Milestone 3 (Weeks 8–10): synthesis &amp; transfer task."]) +
        "<h4>Estimated Timeline</h4><p>~10 weeks with flexible checkpoints; pace adjusts to progress data.</p>" +
        "<h4>Supports Along the Way</h4>" + list(["Choice menus", "Worked examples", "Peer collaboration"]) + why("This pathway matches the learner's readiness and interests, with milestones that make progress visible.") + review();
    }},
    rec: { label: "AI Recommendations", build: function (d) {
      var focus = val(d, "focus", "reading comprehension");
      return "<h3>AI Recommendations — " + esc(focus) + "</h3>" +
        '<div class="rec-card"><h4>📚 Instructional strategy</h4><p>Use reciprocal teaching (predict, question, clarify, summarize) in small groups.</p>' + why("The learner is verbally strong and benefits from structured discussion routines.") + "</div>" +
        '<div class="rec-card"><h4>🧰 Resource</h4><p>Leveled passages on high-interest topics (space, animals) with comprehension scaffolds.</p>' + why("Interest-based texts increase motivation and persistence.") + "</div>" +
        '<div class="rec-card"><h4>👥 Grouping</h4><p>Flexible small group with 2 peers at a similar instructional level.</p>' + why("Right-sized groups give more turns and targeted feedback.") + "</div>" +
        '<div class="rec-card"><h4>🏠 Family support</h4><p>10 minutes of shared reading + one "teach-back" question nightly.</p>' + why("Brief, specific home routines are sustainable and reinforce school learning.") + "</div>" + review();
    }},
    supports: { label: "Accommodations & Supports", build: function (d) {
      return "<h3>Accommodations &amp; Supports</h3>" +
        "<h4>Recommended Supports</h4>" + list(["Extended time on extended-response tasks", "Graphic organizers &amp; sentence frames", "Chunked assignments with check-ins", "Audio support / text-to-speech option", "Vocabulary scaffolds &amp; visuals", "Flexible, quiet workspace option"]) +
        why("Supports target task initiation, language load, and working memory — the learner's identified barriers.") +
        "<p class='muted' style='font-size:.85rem;'><b>Note:</b> Recommendations require educator review and must align with IEP/504 plans and school policy.</p>" + review();
    }},
    intervention: { label: "Intervention Plan", build: function (d) {
      var area = val(d, "area", "Math problem-solving");
      return "<h3>Intervention Plan — " + esc(area) + "</h3>" +
        "<h4>Area of Need</h4><p>" + esc(area) + "</p><h4>Goal</h4><p>80% accuracy on 2-step problems across 3 checks.</p>" +
        "<h4>Strategy</h4><p>Explicit modeling + worked examples + concrete-representational-abstract sequence.</p>" +
        "<h4>Logistics</h4>" + list(["Responsible staff: interventionist + classroom teacher", "Frequency: 3×/week, 30 min", "Duration: 6 weeks", "Progress monitoring: weekly probes", "Review: week 6 (continue / adjust / change tier)"]) +
        "<h4>Outcome Evaluation</h4><p>Compare baseline to weekly trend; decide next step with the team.</p>" + review();
    }},
    enrichment: { label: "Enrichment Plan", build: function (d) {
      return "<h3>Enrichment Plan</h3>" +
        "<h4>Opportunities</h4>" + list(["Independent inquiry project on a chosen topic", "Research with a real-world audience/product", "Academic competition or club", "Mentorship / leadership role", "Creative challenge or design task", "Community engagement project"]) +
        why("The learner is ready for greater depth and autonomy; open-ended challenge sustains motivation.") + review();
    }},
    career: { label: "Career Connections", build: function (d) {
      var interest = val(d, "interest", "STEM / building things");
      return "<h3>Career Connections — " + esc(interest) + "</h3>" +
        "<h4>Explore</h4>" + list(["Career exploration: engineering, design, skilled trades", "Industry pathways &amp; future-skills overview", "Relevant clubs (robotics, makerspace)"]) +
        "<h4>Experience</h4>" + list(["Volunteer / service tied to interest", "Project-based learning with authentic problems", "(Secondary) internship / technical-education pathway"]) +
        "<h4>Future Skills</h4>" + list(["Problem-solving, collaboration, digital literacy, entrepreneurship"]) + why("Connecting learning to the student's interests builds relevance and long-term motivation.") + review();
    }},
    parent: { label: "Family Update", build: function (d) {
      var s = val(d, "student", "your child");
      return "<h3>Family Update</h3><p>Dear Family,</p><p>Here's a snapshot of " + esc(s) + "'s learning plan and progress.</p>" +
        "<h4>Goals we're working on</h4>" + list(["Math: 2-step problem solving", "Writing: organized paragraphs", "Independence: starting work promptly"]) +
        "<h4>How it's going</h4><p>Steady progress in reading and engagement; math is improving with small-group support.</p>" +
        "<h4>How you can help at home</h4>" + list(["10 minutes of shared reading nightly", "Ask one \"teach-back\" question", "Celebrate effort and persistence"]) +
        "<p>With partnership,<br>[Teacher name]</p>" + why("Specific, brief home routines are easiest for families to sustain.") + review();
    }},
    report: { label: "Report", build: function (d) {
      var type = val(d, "type", "Individual Learning Plan"), s = val(d, "student", "Jordan M.");
      return "<h3>" + esc(type) + "</h3><p class='muted'>" + esc(s) + " · prepared for educator review</p>" +
        "<h4>Summary</h4><p>The plan targets math problem-solving and organized writing with Tier 2 support and interest-based enrichment. Reading and engagement are strengths.</p>" +
        "<h4>Goals &amp; Progress</h4>" + list(["Math: on track (▲ from baseline)", "Writing: developing", "Engagement: improving"]) +
        "<h4>Supports In Place</h4>" + list(["Small-group math", "Graphic organizers", "Family reading routine"]) +
        "<h4>Next Steps</h4><p>Continue plan; review at week 6 with the team and family.</p>" + review();
    }}
  };

  /* ===================== WORKSPACE (optional NL router on teacher dashboard) ===================== */
  function initWorkspace() {
    var log = document.querySelector("[data-ws-log]"); if (!log) return;
    var form = document.querySelector("[data-ws-form]"), input = form ? form.querySelector("input") : null;
    var hist = LS.get(KEY.hist, []);
    if (hist.length) hist.forEach(function (m) { add(m.who, m.html, true); });
    else add("coach", "Tell me about a learner and I'll draft a starting plan — e.g., <i>“Create a learning plan for a Grade 6 student strong in reading, struggling in math.”</i> You review, approve, and adapt.", true);
    if (form) form.addEventListener("submit", function (e) { e.preventDefault(); var q = input.value.trim(); if (!q) return; add("user", esc(q)); input.value = ""; route(q); });
    document.querySelectorAll("[data-ws-suggest]").forEach(function (c) { c.addEventListener("click", function () { add("user", esc(c.textContent)); route(c.textContent); }); });
    var clr = document.querySelector("[data-ws-clear]"); if (clr) clr.addEventListener("click", function () { LS.set(KEY.hist, []); log.innerHTML = ""; add("coach", "Cleared. Which learner should we plan for?", true); });
    function route(q) { var typing = add("coach", '<span class="chat-typing">✨ Drafting a plan…</span>', false, true); setTimeout(function () { typing.remove(); var prev = GEN.plan.build({}); add("coach", "Here's a starting Individual Learning Plan. Open the full generator to refine, then approve." + '<div class="card" style="margin-top:.7rem;padding:1rem;max-height:230px;overflow:hidden;position:relative;">' + prev + '<div style="position:absolute;left:0;right:0;bottom:0;height:50px;background:linear-gradient(transparent,var(--surface));"></div></div><div style="margin-top:.7rem;"><a class="btn small" href="learning-plan.html">Open Learning Plan Generator →</a></div>'); bump("plan"); }, 780); }
    function add(who, html, instant, ret) { var d = document.createElement("div"); d.className = "chat-msg " + (who === "user" ? "user" : "coach"); d.innerHTML = '<span class="who">' + (who === "user" ? "You" : "AI Planner") + "</span>" + html; log.appendChild(d); log.scrollTop = log.scrollHeight; if (!ret) save(); return d; }
    function save() { var msgs = Array.prototype.map.call(log.querySelectorAll(".chat-msg"), function (m) { return { who: m.classList.contains("user") ? "user" : "coach", html: m.innerHTML.replace(/^<span class="who">[^<]*<\/span>/, "") }; }).slice(-10); LS.set(KEY.hist, msgs); }
  }

  function renderRailActive() { var here = location.pathname.split("/").pop() || "learning-plan.html"; document.querySelectorAll(".rail-link").forEach(function (a) { if (a.getAttribute("href") === here) a.classList.add("active"); }); }
  window.ILP = { toast: toast, copy: copyText };
})();
