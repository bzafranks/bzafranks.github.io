/* =====================================================================
   AI School Leadership Dashboard — interactivity engine
   Loads AFTER the shared portfolio.js. Adds the enterprise behaviors:
     • Dark mode toggle (persists)  • Command palette (Ctrl/⌘+K) + FAB
     • Notification center  • Toasts + clipboard
     • KPI count-up + conic gauges + animated bar lists
     • Drill-down rows  • Filter re-render hooks
     • AI Executive Assistant (explainable NL responses)
     • Report generator (executive report drafts) + Resource saving
   NOTE: All data is realistic FICTIONAL sample data and all "AI" output
   is generated client-side for demonstration. Nothing leaves the browser.
   ===================================================================== */
(function () {
  "use strict";

  var LS = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  var KEY = { theme: "sld:theme", reports: "sld:reports", hist: "sld:hist", stats: "sld:stats" };

  var TOOLS = [
    { name: "Executive Dashboard",        ico: "📊", url: "executive-dashboard.html",    desc: "Whole-school command center", group: "Overview" },
    { name: "School Health Overview",     ico: "❤️", url: "school-health.html",          desc: "Operational snapshot", group: "Overview" },
    { name: "Instructional Leadership",   ico: "🧭", url: "instructional-leadership.html", desc: "Observations & coaching", group: "Instruction" },
    { name: "Curriculum Implementation",  ico: "📚", url: "curriculum.html",             desc: "Pacing & standards coverage", group: "Instruction" },
    { name: "Teacher Performance",        ico: "👩‍🏫", url: "teacher-performance.html",   desc: "Growth & coaching cycles", group: "Instruction" },
    { name: "Student Achievement",        ico: "🎓", url: "student-achievement.html",    desc: "Growth, mastery, gaps", group: "Students" },
    { name: "Attendance & Engagement",    ico: "📅", url: "attendance.html",             desc: "Absenteeism & risk", group: "Students" },
    { name: "Behavior & Climate",         ico: "🤝", url: "behavior.html",               desc: "Incidents, SEL, climate", group: "Students" },
    { name: "Staffing & Human Capital",   ico: "🧑‍💼", url: "staffing.html",             desc: "Vacancies & retention", group: "Operations" },
    { name: "Professional Development",   ico: "🌱", url: "professional-development.html", desc: "PD hours & pathways", group: "Operations" },
    { name: "School Improvement Plan",    ico: "🎯", url: "school-improvement.html",     desc: "Goals & milestones", group: "Operations" },
    { name: "AI Executive Assistant",     ico: "✨", url: "ai-assistant.html",           desc: "Ask leadership questions", group: "Intelligence" },
    { name: "Reports & Presentations",    ico: "📄", url: "reports.html",                desc: "Board-ready reports", group: "Intelligence" },
    { name: "Settings",                   ico: "⚙️", url: "settings.html",               desc: "Preferences & governance", group: "Intelligence" }
  ];

  document.addEventListener("DOMContentLoaded", function () {
    initTheme(); buildChrome(); initThemeToggle();
    initNotifications(); initCountUp(); initGauges(); initBarlists();
    initDrilldowns(); initFilters(); initAssistant(); initReportGen();
    initStats(); renderRailActive();
  });

  /* ===================== THEME ===================== */
  function initTheme() { if (LS.get(KEY.theme, "light") === "dark") document.body.classList.add("sld-dark"); }
  function initThemeToggle() {
    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      sync(btn);
      btn.addEventListener("click", function () {
        document.body.classList.toggle("sld-dark");
        var dark = document.body.classList.contains("sld-dark");
        LS.set(KEY.theme, dark ? "dark" : "light");
        document.querySelectorAll("[data-theme-toggle]").forEach(sync);
        toast(dark ? "🌙 Dark mode on" : "☀️ Light mode on", "info");
      });
    });
    function sync(b) { b.textContent = document.body.classList.contains("sld-dark") ? "☀️" : "🌙"; }
  }

  /* ===================== CHROME: palette + FAB + toasts ===================== */
  function buildChrome() {
    if (document.querySelector("[data-no-chrome]")) return;
    if (!document.querySelector(".toast-wrap")) { var tw = document.createElement("div"); tw.className = "toast-wrap"; document.body.appendChild(tw); }
    if (!document.querySelector(".fab")) {
      var fab = document.createElement("button");
      fab.className = "fab"; fab.type = "button"; fab.title = "Command palette (Ctrl/⌘ + K)"; fab.setAttribute("aria-label", "Command palette");
      fab.textContent = "✨"; fab.addEventListener("click", openPalette); document.body.appendChild(fab);
    }
    if (!document.querySelector(".cmdk")) {
      var ov = document.createElement("div"); ov.className = "cmdk"; ov.innerHTML =
        '<div class="cmdk-box" role="dialog" aria-label="Command palette"><input class="cmdk-input" type="text" placeholder="Jump to a dashboard, or ask the AI assistant…" aria-label="Command search"><div class="cmdk-list"></div></div>';
      document.body.appendChild(ov);
      ov.addEventListener("click", function (e) { if (e.target === ov) closePalette(); });
    }
    bindPalette();
    document.addEventListener("keydown", function (e) {
      if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) { e.preventDefault(); openPalette(); }
      if (e.key === "Escape") { closePalette(); closeNotif(); }
    });
  }
  var palIndex = 0, palMatches = [];
  function paletteItems() {
    var inProject = /ai-leadership-dashboard/.test(location.pathname);
    var base = inProject ? "" : "projects/ai-leadership-dashboard/";
    var items = TOOLS.map(function (t) { return { ico: t.ico, name: t.name, hint: t.desc, url: base + t.url }; });
    items.push({ ico: "✨", name: "Ask the AI Executive Assistant", hint: "Leadership Q&A", url: base + "ai-assistant.html" });
    return items;
  }
  function bindPalette() {
    var input = document.querySelector(".cmdk-input"); if (!input) return;
    input.addEventListener("input", function () { renderPalette(input.value); });
    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); palIndex = Math.min(palIndex + 1, palMatches.length - 1); hi(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); palIndex = Math.max(palIndex - 1, 0); hi(); }
      else if (e.key === "Enter") { var m = palMatches[palIndex]; if (m) location.href = m.url; }
    });
    function hi() { var els = document.querySelectorAll(".cmdk-item"); els.forEach(function (el, i) { el.classList.toggle("active", i === palIndex); }); if (els[palIndex]) els[palIndex].scrollIntoView({ block: "nearest" }); }
  }
  function renderPalette(q) {
    var list = document.querySelector(".cmdk-list"); if (!list) return;
    q = (q || "").toLowerCase().trim(); var all = paletteItems();
    palMatches = !q ? all : all.filter(function (a) { return (a.name + " " + a.hint).toLowerCase().indexOf(q) > -1; });
    palIndex = 0;
    if (!palMatches.length) { list.innerHTML = '<div class="cmdk-empty">No match — try “attendance”, “coaching”, or “report”.</div>'; return; }
    list.innerHTML = palMatches.map(function (a, i) { return '<a class="cmdk-item' + (i === 0 ? " active" : "") + '" href="' + a.url + '"><span class="ico">' + a.ico + '</span><span>' + a.name + '</span><small>' + a.hint + "</small></a>"; }).join("");
  }
  function openPalette() { var ov = document.querySelector(".cmdk"); if (!ov) return; ov.classList.add("open"); renderPalette(""); var i = ov.querySelector(".cmdk-input"); if (i) { i.value = ""; i.focus(); } }
  function closePalette() { var ov = document.querySelector(".cmdk"); if (ov) ov.classList.remove("open"); }

  /* ===================== NOTIFICATIONS ===================== */
  function initNotifications() {
    var wrap = document.querySelector("[data-notif]"); if (!wrap) return;
    var btn = wrap.querySelector(".notif-btn"), panel = wrap.querySelector(".notif-panel");
    if (btn && panel) {
      btn.addEventListener("click", function (e) { e.stopPropagation(); panel.classList.toggle("open"); });
      document.addEventListener("click", function () { panel.classList.remove("open"); });
      panel.addEventListener("click", function (e) { e.stopPropagation(); });
    }
  }
  function closeNotif() { var p = document.querySelector(".notif-panel"); if (p) p.classList.remove("open"); }

  /* ===================== TOAST + CLIPBOARD ===================== */
  function toast(msg, kind) {
    var w = document.querySelector(".toast-wrap"); if (!w) return;
    var t = document.createElement("div"); t.className = "toast " + (kind || ""); t.textContent = msg; w.appendChild(t);
    setTimeout(function () { t.style.opacity = "0"; t.style.transition = "opacity .3s"; setTimeout(function () { t.remove(); }, 320); }, 2400);
  }
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { toast("📋 Copied to clipboard", "ok"); }, function () { toast("Copy failed", ""); });
    else toast("Clipboard unavailable", "");
  }

  /* ===================== STATS ===================== */
  function getStats() { return LS.get(KEY.stats, { reports: 0, queries: 0 }); }
  function bumpStat(which) { var s = getStats(); s[which] = (s[which] || 0) + 1; LS.set(KEY.stats, s); paintStats(); }
  function paintStats() { var s = getStats(); document.querySelectorAll("[data-stat=reports]").forEach(function (e) { e.textContent = s.reports; }); document.querySelectorAll("[data-stat=queries]").forEach(function (e) { e.textContent = s.queries; }); }
  function initStats() { paintStats(); }

  /* ===================== COUNT-UP ===================== */
  function initCountUp() {
    var els = document.querySelectorAll("[data-count]"); if (!els.length) return;
    function go(el) {
      var target = parseFloat(el.getAttribute("data-count")), suf = el.getAttribute("data-suffix") || "", pre = el.getAttribute("data-prefix") || "", dur = 1100, start = null;
      function step(ts) { if (!start) start = ts; var p = Math.min((ts - start) / dur, 1); var v = target * (0.5 - Math.cos(p * Math.PI) / 2);
        el.textContent = pre + (target % 1 === 0 ? Math.round(v) : v.toFixed(1)) + suf; if (p < 1) requestAnimationFrame(step); }
      requestAnimationFrame(step);
    }
    obsRun(els, go);
  }

  /* ===================== GAUGES ===================== */
  function initGauges() {
    var els = document.querySelectorAll("[data-gauge]"); if (!els.length) return;
    function go(el) {
      var target = parseFloat(el.getAttribute("data-gauge")) || 0, dur = 1100, start = null;
      var numEl = el.querySelector("[data-gauge-num]");
      function step(ts) { if (!start) start = ts; var p = Math.min((ts - start) / dur, 1); var v = target * (0.5 - Math.cos(p * Math.PI) / 2);
        el.style.setProperty("--val", v.toFixed(1)); if (numEl) numEl.textContent = Math.round(v) + (el.getAttribute("data-gauge-suffix") || ""); if (p < 1) requestAnimationFrame(step); }
      requestAnimationFrame(step);
    }
    obsRun(els, go);
  }

  /* ===================== BAR LISTS ===================== */
  function initBarlists() {
    var fills = document.querySelectorAll(".barlist .fill[data-pct]"); if (!fills.length) return;
    obsRun(fills, function (el) { var p = el.getAttribute("data-pct"); el.style.width = "0%"; requestAnimationFrame(function () { el.style.transition = "width .9s ease"; el.style.width = p + "%"; }); });
    // also support generic .bar[data-h] from shared barchart
    var bars = document.querySelectorAll(".barchart .bar[data-h]");
    if (bars.length) obsRun(bars, function (el) { var h = el.getAttribute("data-h"); el.style.height = "0%"; requestAnimationFrame(function () { el.style.height = h + "%"; }); });
  }

  function obsRun(els, fn) {
    if ("IntersectionObserver" in window) {
      var o = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { fn(e.target); o.unobserve(e.target); } }); }, { threshold: 0.35 });
      els.forEach(function (e) { o.observe(e); });
    } else els.forEach(fn);
  }

  /* ===================== DRILL-DOWNS ===================== */
  function initDrilldowns() {
    document.querySelectorAll(".drill-row").forEach(function (row) {
      row.addEventListener("click", function () {
        var panel = row.nextElementSibling;
        if (panel && panel.classList.contains("drill-panel")) { row.classList.toggle("open"); panel.classList.toggle("open"); }
      });
    });
  }

  /* ===================== FILTERS (cosmetic re-render) ===================== */
  function initFilters() {
    var strip = document.querySelector("[data-filters]"); if (!strip) return;
    strip.addEventListener("change", function () { toast("🔄 View updated for selected filters", "info"); });
    var dl = document.querySelector("[data-download-report]");
    if (dl) dl.addEventListener("click", function () { window.print(); });
  }

  /* ===================== AI EXECUTIVE ASSISTANT ===================== */
  var ANSWERS = [
    { k: ["grade 8 math", "math scores", "math declin", "why are"], title: "Grade 8 mathematics decline — root-cause analysis",
      insight: "Grade 8 math proficiency fell 6 points (72% → 66%) since the fall benchmark, concentrated in two of five sections.",
      evidence: ["Pacing data shows the affected sections are 3 weeks behind on the ratios & proportions unit.", "Common formative assessment accuracy on proportional reasoning is 54% vs. 71% school-wide.", "The two sections share a first-year teacher who has had 1 coaching cycle this term."],
      actions: ["Prioritize a coaching cycle on proportional-reasoning instruction for the affected sections.", "Re-sequence pacing with a 1-week reteach block and a common re-assessment.", "Pair the first-year teacher with the department's strongest math mentor for 4 weeks."] },
    { k: ["coaching first", "which teachers", "coaching prior", "who should i coach"], title: "Coaching prioritization — highest leverage first",
      insight: "Three teachers offer the highest coaching ROI based on student-growth gaps, observation trends, and openness to support.",
      evidence: ["Two are early-career teachers whose classes are >1 unit behind pace.", "One veteran's engagement scores dropped from 'green' to 'amber' over two observation cycles.", "All three teach tested grade/subject combinations affecting school-wide indicators."],
      actions: ["Open coaching cycles with the two early-career teachers this week (instructional pacing + checks for understanding).", "Schedule a supportive, non-evaluative check-in with the veteran on engagement strategies.", "Re-observe in 3 weeks and compare engagement + formative data."] },
    { k: ["top three", "improvement prior", "priorities", "focus on"], title: "Top 3 school-improvement priorities",
      insight: "Triangulating achievement, attendance, and climate data, three priorities will move the most indicators at once.",
      evidence: ["Chronic absenteeism (18%) is the strongest predictor of the achievement gap in your data.", "Math proficiency trails ELA by 9 points and is trending down.", "Climate-survey 'sense of belonging' dipped in Grade 8, correlating with behavior referrals."],
      actions: ["1) Launch a tiered attendance initiative targeting chronically absent students.", "2) Stand up a math instructional-improvement cycle (pacing + reteach + coaching).", "3) Strengthen Grade 8 belonging via advisory + restorative practices."] },
    { k: ["attendance", "absentee", "this semester", "engagement trend"], title: "Attendance trends — this semester",
      insight: "Average daily attendance is 93.4% (▼0.8 vs. last semester); chronic absenteeism rose to 18%, concentrated in Grade 8 and Mondays/Fridays.",
      evidence: ["62 students are chronically absent; 70% have 3+ unexcused absences clustered on Mon/Fri.", "Attendance and course-failure risk correlate strongly (r ≈ 0.6) in your data.", "Families of 40% of chronically absent students have had no positive contact this term."],
      actions: ["Deploy an early-warning watchlist and assign each flagged student a check-in adult.", "Launch positive family outreach (calls/texts) before absences accumulate.", "Analyze Mon/Fri patterns for scheduling or engagement causes."] },
    { k: ["at-risk", "at risk", "identify student"], title: "At-risk students — early-warning summary",
      insight: "47 students meet 2+ early-warning indicators (attendance, behavior, course performance); 12 meet all three and need immediate support.",
      evidence: ["The 12 highest-risk students average 21% absence and 2+ failing courses.", "Eight have had a behavior referral in the last 30 days.", "Most are not yet receiving a coordinated, named intervention."],
      actions: ["Convene the student-support team for the 12 highest-risk students this week.", "Assign a single case-manager per student to coordinate supports.", "Set 3-week progress checks with attendance + grade + behavior data."] },
    { k: ["staffing", "vacanc", "hire", "retention"], title: "Staffing priorities — human-capital snapshot",
      insight: "Two vacancies (Math, SPED) and three teachers at elevated attrition risk threaten instructional continuity in tested areas.",
      evidence: ["Math vacancy is currently covered by a long-term sub, correlating with the Grade 8 math dip.", "Three flagged teachers cite workload and limited growth pathways in climate data.", "SPED vacancy raises caseload-compliance risk."],
      actions: ["Fast-track the Math and SPED hires; activate the substitute-to-mentor support plan.", "Offer the three at-risk teachers a stay-conversation + leadership-development pathway.", "Monitor caseload compliance weekly until SPED is filled."] }
  ];
  function answerFor(q) {
    var lower = q.toLowerCase();
    for (var i = 0; i < ANSWERS.length; i++) for (var j = 0; j < ANSWERS[i].k.length; j++) if (lower.indexOf(ANSWERS[i].k[j]) > -1) return ANSWERS[i];
    return { title: "Leadership analysis", insight: "Here's how I'd analyze that using your school's data sources.",
      evidence: ["I'd triangulate achievement, attendance, behavior, and observation data for relevant patterns.", "Then segment by grade, subgroup, and teacher to locate where the signal is strongest.", "Finally I'd check which factors are most actionable this term."],
      actions: ["Identify the 1–2 highest-leverage levers from the evidence.", "Assign an owner and a 3-week check-in.", "Re-measure and adjust."] };
  }
  function renderAnswer(a) {
    return "<h4>" + a.title + "</h4><div class='insight'><b>Insight:</b> " + a.insight + "</div>" +
      "<p><b>Why (evidence):</b></p><ul>" + a.evidence.map(function (e) { return "<li>" + e + "</li>"; }).join("") + "</ul>" +
      "<p><b>Recommended actions:</b></p><ul>" + a.actions.map(function (e) { return "<li>" + e + "</li>"; }).join("") + "</ul>" +
      "<p class='muted' style='font-size:.85rem;'><span class='ai-pill'>👤 You decide</span> AI-generated analysis on fictional sample data. Recommendations support — not replace — your professional judgment.</p>";
  }
  function initAssistant() {
    var log = document.querySelector("[data-ai-log]"); if (!log) return;
    var form = document.querySelector("[data-ai-form]"), input = form ? form.querySelector("input") : null;
    var hist = LS.get(KEY.hist, []);
    if (hist.length) hist.forEach(function (m) { add(m.who, m.html, true); });
    else add("coach", "I'm your AI Executive Assistant. Ask me a leadership question — for example, <i>“Why are Grade 8 math scores declining?”</i> or <i>“Which teachers should receive coaching first?”</i> I'll explain my reasoning and recommend actions; you make the call.", true);
    if (form) form.addEventListener("submit", function (e) { e.preventDefault(); var q = input.value.trim(); if (!q) return; add("user", esc(q)); input.value = ""; respond(q); });
    document.querySelectorAll("[data-ai-suggest]").forEach(function (c) { c.addEventListener("click", function () { add("user", esc(c.textContent)); respond(c.textContent); }); });
    var clr = document.querySelector("[data-ai-clear]"); if (clr) clr.addEventListener("click", function () { LS.set(KEY.hist, []); log.innerHTML = ""; add("coach", "Conversation cleared. What leadership question can I analyze?", true); });

    function respond(q) {
      var typing = add("coach", '<span class="chat-typing">✨ Analyzing your data…</span>', false, true);
      setTimeout(function () { typing.remove(); add("coach", renderAnswer(answerFor(q))); bumpStat("queries"); }, 850);
    }
    function add(who, html, instant, returnEl) {
      var d = document.createElement("div"); d.className = "chat-msg " + (who === "user" ? "user" : "coach");
      d.innerHTML = '<span class="who">' + (who === "user" ? "You" : "AI Assistant") + "</span>" + html;
      log.appendChild(d); log.scrollTop = log.scrollHeight;
      if (!returnEl) save(); return d;
    }
    function save() { var msgs = Array.prototype.map.call(log.querySelectorAll(".chat-msg"), function (m) { return { who: m.classList.contains("user") ? "user" : "coach", html: m.innerHTML.replace(/^<span class="who">[^<]*<\/span>/, "") }; }).slice(-10); LS.set(KEY.hist, msgs); }
  }

  /* ===================== REPORT GENERATOR ===================== */
  var REPORTS = {
    "Board Report": function (d) { return execReport("Board Report", d, "for the Board of Education"); },
    "Principal Report": function (d) { return execReport("Principal's Report", d, "for the principal's leadership review"); },
    "District Report": function (d) { return execReport("District Report", d, "for the district / superintendent"); },
    "School Improvement Report": function (d) { return execReport("School Improvement Report", d, "for the school-improvement team"); },
    "Attendance Report": function (d) { return execReport("Attendance Report", d, "summarizing attendance & engagement"); },
    "Assessment Report": function (d) { return execReport("Assessment Report", d, "summarizing achievement & growth"); }
  };
  function execReport(title, d, who) {
    var term = val(d, "term", "This Semester"), school = val(d, "school", "Sample K–12 School");
    return "<h3>" + title + "</h3><p class='muted'>" + esc(school) + " · " + esc(term) + " · prepared " + who + "</p>" +
      "<h4>Executive Summary</h4><p>Overall school-performance index is <b>82 (B+)</b>, up 3 points. Strengths: ELA growth and family engagement. Watch areas: Grade 8 mathematics and chronic absenteeism.</p>" +
      "<h4>Key Performance Indicators</h4><ul><li>Academic growth: <b>+4%</b> vs. prior term</li><li>Average daily attendance: <b>93.4%</b> (chronic absenteeism 18%)</li><li>Curriculum implementation fidelity: <b>87%</b></li><li>PD completion: <b>91%</b></li><li>Behavior referrals: <b>▼12%</b></li></ul>" +
      "<h4>Highlights</h4><ul><li>ELA proficiency reached 78% (▲5).</li><li>Family-engagement contacts up 22%.</li><li>Three coaching cycles closed with measurable gains.</li></ul>" +
      "<h4>Priorities & Recommendations</h4><ul><li>Math instructional-improvement cycle (pacing + reteach + coaching).</li><li>Tiered attendance initiative targeting chronically absent students.</li><li>Grade 8 belonging: advisory + restorative practices.</li></ul>" +
      "<h4>Next Steps</h4><p>Owners assigned; 3-week progress review scheduled. Detailed dashboards available on request.</p>" +
      "<p class='muted' style='font-size:.85rem;'><span class='ai-pill'>👤 Human review</span> AI-drafted from fictional sample data — verify figures before distribution.</p>";
  }
  function initReportGen() {
    document.querySelectorAll("[data-generator='report']").forEach(function (form) {
      var out = document.querySelector("[data-output='report']") || form.parentElement.querySelector(".gen-output");
      var last = null;
      form.addEventListener("submit", function (e) { e.preventDefault(); last = collect(form); run(last, out); });
      if (out) out.addEventListener("click", function (e) {
        var b = e.target.closest("[data-act]"); if (!b) return; var act = b.getAttribute("data-act"); var body = out.querySelector(".out-body");
        if (act === "copy") copyText(body ? body.innerText : "");
        else if (act === "print") window.print();
        else if (act === "regen") run(last || collect(form), out);
        else if (act === "save") { if (!body || !body.innerText.trim()) { toast("Generate a report first", ""); return; } var r = LS.get(KEY.reports, []); r.unshift({ title: (last && last.type) || "Report", when: val(last, "term", "") }); LS.set(KEY.reports, r); toast("💾 Saved to report history", "ok"); }
      });
    });
  }
  function run(data, out) {
    if (!out) return; var body = out.querySelector(".out-body"), bar = out.querySelector(".out-toolbar");
    if (bar) bar.querySelectorAll("[data-act]").forEach(function (b) { b.disabled = true; });
    if (body) body.innerHTML = '<div class="gen-loading"><div class="ai-pill">✨ Generating report…</div><div class="shimmer w90"></div><div class="shimmer"></div><div class="shimmer w70"></div><div class="shimmer w50"></div><div class="shimmer w90"></div><div class="shimmer w70"></div></div>';
    setTimeout(function () {
      var type = val(data, "type", "Board Report"); var fn = REPORTS[type] || REPORTS["Board Report"];
      if (body) body.innerHTML = fn(data);
      if (bar) bar.querySelectorAll("[data-act]").forEach(function (b) { b.disabled = false; });
      bumpStat("reports"); toast("✨ Report draft ready — review before sharing", "ok");
    }, 900);
  }
  function collect(form) { var d = {}; form.querySelectorAll("input[name],select[name],textarea[name]").forEach(function (f) { d[f.name] = f.value; }); return d; }

  /* ---- helpers ---- */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function val(d, k, fb) { return d && d[k] ? d[k] : fb; }

  /* ===================== RAIL ACTIVE ===================== */
  function renderRailActive() {
    var here = location.pathname.split("/").pop() || "executive-dashboard.html";
    document.querySelectorAll(".rail-link").forEach(function (a) { if (a.getAttribute("href") === here) a.classList.add("active"); });
  }

  window.SLD = { toast: toast, copy: copyText };
})();
