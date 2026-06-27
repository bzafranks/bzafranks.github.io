/* =====================================================================
   AI Student Success Early Warning System — interactivity engine
   Loads AFTER the shared portfolio.js. Adds:
     • Dark mode  • Command palette (Ctrl/⌘+K) + FAB  • Notifications
     • Toasts + clipboard  • Count-up + gauges + bar lists + drill-downs
     • Explainable AI Risk Engine (risk level + factors + confidence +
       supports + monitoring; always "educator decides")
     • Report generator (student-success report drafts)
   NOTE: ALL data is FICTIONAL sample data; AI is simulated client-side.
   Recommendations are decision-support and require educator review.
   Nothing leaves the browser; storage is localStorage.
   ===================================================================== */
(function () {
  "use strict";
  var LS = { get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  var KEY = { theme: "ess:theme", hist: "ess:hist", stats: "ess:stats" };

  var TOOLS = [
    { name: "Executive Dashboard",   ico: "📊", url: "executive-dashboard.html", desc: "Whole-school overview", group: "Overview" },
    { name: "Student Risk Dashboard",ico: "🚦", url: "risk-dashboard.html",      desc: "Risk levels & trends", group: "Overview" },
    { name: "Student Profile",       ico: "🧑‍🎓", url: "student-profile.html",   desc: "Whole-child profile", group: "Overview" },
    { name: "AI Risk Engine",        ico: "✨", url: "ai-risk-engine.html",      desc: "Explainable risk analysis", group: "Intelligence" },
    { name: "MTSS Framework",        ico: "🪜", url: "mtss.html",                desc: "Tiers 1–3 & movement", group: "Support" },
    { name: "Intervention Planner",  ico: "🛠️", url: "interventions.html",       desc: "Plan, monitor, manage", group: "Support" },
    { name: "Attendance Analytics",  ico: "📅", url: "attendance.html",          desc: "Absenteeism & risk", group: "Analytics" },
    { name: "Academic Analytics",    ico: "🎓", url: "academics.html",           desc: "Growth, mastery, gaps", group: "Analytics" },
    { name: "Behavior Analytics",    ico: "🤝", url: "behavior.html",            desc: "Incidents, SEL", group: "Analytics" },
    { name: "Well-Being Dashboard",  ico: "💛", url: "wellbeing.html",           desc: "Belonging & wellness", group: "Analytics" },
    { name: "Family Engagement",     ico: "👨‍👩‍👧", url: "family-engagement.html", desc: "Contacts & support", group: "Support" },
    { name: "Reports",               ico: "📄", url: "reports.html",             desc: "Student & leadership reports", group: "Intelligence" },
    { name: "Settings",              ico: "⚙️", url: "settings.html",            desc: "Governance & privacy", group: "Intelligence" }
  ];

  document.addEventListener("DOMContentLoaded", function () {
    initTheme(); buildChrome(); initThemeToggle(); initNotifications();
    initCountUp(); initGauges(); initBarlists(); initDrilldowns(); initFilters();
    initRiskEngine(); initReportGen(); initStats(); renderRailActive();
  });

  function initTheme() { if (LS.get(KEY.theme, "light") === "dark") document.body.classList.add("ess-dark"); }
  function initThemeToggle() {
    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) { sync(b); b.addEventListener("click", function () { document.body.classList.toggle("ess-dark"); var d = document.body.classList.contains("ess-dark"); LS.set(KEY.theme, d ? "dark" : "light"); document.querySelectorAll("[data-theme-toggle]").forEach(sync); toast(d ? "🌙 Dark mode on" : "☀️ Light mode on", "info"); }); });
    function sync(b) { b.textContent = document.body.classList.contains("ess-dark") ? "☀️" : "🌙"; }
  }

  function buildChrome() {
    if (document.querySelector("[data-no-chrome]")) return;
    if (!document.querySelector(".toast-wrap")) { var tw = document.createElement("div"); tw.className = "toast-wrap"; document.body.appendChild(tw); }
    if (!document.querySelector(".fab")) { var f = document.createElement("button"); f.className = "fab"; f.type = "button"; f.title = "Command palette (Ctrl/⌘ + K)"; f.setAttribute("aria-label", "Command palette"); f.textContent = "✨"; f.addEventListener("click", openPalette); document.body.appendChild(f); }
    if (!document.querySelector(".cmdk")) { var ov = document.createElement("div"); ov.className = "cmdk"; ov.innerHTML = '<div class="cmdk-box" role="dialog" aria-label="Command palette"><input class="cmdk-input" type="text" placeholder="Jump to a dashboard, or ask the AI risk engine…" aria-label="Command search"><div class="cmdk-list"></div></div>'; document.body.appendChild(ov); ov.addEventListener("click", function (e) { if (e.target === ov) closePalette(); }); }
    bindPalette();
    document.addEventListener("keydown", function (e) { if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) { e.preventDefault(); openPalette(); } if (e.key === "Escape") { closePalette(); closeNotif(); } });
  }
  var palIndex = 0, palMatches = [];
  function paletteItems() { var inP = /ai-student-success/.test(location.pathname); var base = inP ? "" : "projects/ai-student-success/"; return TOOLS.map(function (t) { return { ico: t.ico, name: t.name, hint: t.desc, url: base + t.url }; }); }
  function bindPalette() {
    var input = document.querySelector(".cmdk-input"); if (!input) return;
    input.addEventListener("input", function () { renderPalette(input.value); });
    input.addEventListener("keydown", function (e) { if (e.key === "ArrowDown") { e.preventDefault(); palIndex = Math.min(palIndex + 1, palMatches.length - 1); hi(); } else if (e.key === "ArrowUp") { e.preventDefault(); palIndex = Math.max(palIndex - 1, 0); hi(); } else if (e.key === "Enter") { var m = palMatches[palIndex]; if (m) location.href = m.url; } });
    function hi() { var els = document.querySelectorAll(".cmdk-item"); els.forEach(function (el, i) { el.classList.toggle("active", i === palIndex); }); if (els[palIndex]) els[palIndex].scrollIntoView({ block: "nearest" }); }
  }
  function renderPalette(q) { var list = document.querySelector(".cmdk-list"); if (!list) return; q = (q || "").toLowerCase().trim(); var all = paletteItems(); palMatches = !q ? all : all.filter(function (a) { return (a.name + " " + a.hint).toLowerCase().indexOf(q) > -1; }); palIndex = 0; if (!palMatches.length) { list.innerHTML = '<div class="cmdk-empty">No match — try “risk”, “mtss”, or “attendance”.</div>'; return; } list.innerHTML = palMatches.map(function (a, i) { return '<a class="cmdk-item' + (i === 0 ? " active" : "") + '" href="' + a.url + '"><span class="ico">' + a.ico + '</span><span>' + a.name + '</span><small>' + a.hint + "</small></a>"; }).join(""); }
  function openPalette() { var ov = document.querySelector(".cmdk"); if (!ov) return; ov.classList.add("open"); renderPalette(""); var i = ov.querySelector(".cmdk-input"); if (i) { i.value = ""; i.focus(); } }
  function closePalette() { var ov = document.querySelector(".cmdk"); if (ov) ov.classList.remove("open"); }

  function initNotifications() { var wrap = document.querySelector("[data-notif]"); if (!wrap) return; var btn = wrap.querySelector(".notif-btn"), panel = wrap.querySelector(".notif-panel"); if (btn && panel) { btn.addEventListener("click", function (e) { e.stopPropagation(); panel.classList.toggle("open"); }); document.addEventListener("click", function () { panel.classList.remove("open"); }); panel.addEventListener("click", function (e) { e.stopPropagation(); }); } }
  function closeNotif() { var p = document.querySelector(".notif-panel"); if (p) p.classList.remove("open"); }

  function toast(msg, kind) { var w = document.querySelector(".toast-wrap"); if (!w) return; var t = document.createElement("div"); t.className = "toast " + (kind || ""); t.textContent = msg; w.appendChild(t); setTimeout(function () { t.style.opacity = "0"; t.style.transition = "opacity .3s"; setTimeout(function () { t.remove(); }, 320); }, 2400); }
  function copyText(text) { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { toast("📋 Copied", "ok"); }, function () { toast("Copy failed", ""); }); else toast("Clipboard unavailable", ""); }

  function getStats() { return LS.get(KEY.stats, { reports: 0, analyses: 0 }); }
  function bump(w) { var s = getStats(); s[w] = (s[w] || 0) + 1; LS.set(KEY.stats, s); paintStats(); }
  function paintStats() { var s = getStats(); document.querySelectorAll("[data-stat=reports]").forEach(function (e) { e.textContent = s.reports; }); document.querySelectorAll("[data-stat=analyses]").forEach(function (e) { e.textContent = s.analyses; }); }
  function initStats() { paintStats(); }

  function initCountUp() {
    var els = document.querySelectorAll("[data-count]"); if (!els.length) return;
    function go(el) { var t = parseFloat(el.getAttribute("data-count")), suf = el.getAttribute("data-suffix") || "", pre = el.getAttribute("data-prefix") || "", dur = 1100, start = null; function step(ts) { if (!start) start = ts; var p = Math.min((ts - start) / dur, 1); var v = t * (0.5 - Math.cos(p * Math.PI) / 2); el.textContent = pre + (t % 1 === 0 ? Math.round(v) : v.toFixed(1)) + suf; if (p < 1) requestAnimationFrame(step); } requestAnimationFrame(step); }
    obsRun(els, go);
  }
  function initGauges() {
    var els = document.querySelectorAll("[data-gauge]"); if (!els.length) return;
    function go(el) { var t = parseFloat(el.getAttribute("data-gauge")) || 0, dur = 1100, start = null, num = el.querySelector("[data-gauge-num]"); function step(ts) { if (!start) start = ts; var p = Math.min((ts - start) / dur, 1); var v = t * (0.5 - Math.cos(p * Math.PI) / 2); el.style.setProperty("--val", v.toFixed(1)); if (num) num.textContent = Math.round(v) + (el.getAttribute("data-gauge-suffix") || ""); if (p < 1) requestAnimationFrame(step); } requestAnimationFrame(step); }
    obsRun(els, go);
  }
  function initBarlists() {
    var fills = document.querySelectorAll(".barlist .fill[data-pct], .conf-bar .fill[data-pct]"); if (fills.length) obsRun(fills, function (el) { var p = el.getAttribute("data-pct"); el.style.width = "0%"; requestAnimationFrame(function () { el.style.transition = "width .9s ease"; el.style.width = p + "%"; }); });
    var bars = document.querySelectorAll(".barchart .bar[data-h]"); if (bars.length) obsRun(bars, function (el) { var h = el.getAttribute("data-h"); el.style.height = "0%"; requestAnimationFrame(function () { el.style.height = h + "%"; }); });
  }
  function obsRun(els, fn) { if ("IntersectionObserver" in window) { var o = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { fn(e.target); o.unobserve(e.target); } }); }, { threshold: 0.3 }); els.forEach(function (e) { o.observe(e); }); } else els.forEach(fn); }

  function initDrilldowns() { document.querySelectorAll(".drill-row").forEach(function (row) { row.addEventListener("click", function () { var p = row.nextElementSibling; if (p && p.classList.contains("drill-panel")) { row.classList.toggle("open"); p.classList.toggle("open"); } }); }); }
  function initFilters() { var s = document.querySelector("[data-filters]"); if (s) s.addEventListener("change", function () { toast("🔄 View updated for selected filters", "info"); }); var dl = document.querySelector("[data-download-report]"); if (dl) dl.addEventListener("click", function () { window.print(); }); }

  /* ===================== AI RISK ENGINE (explainable) ===================== */
  var ANSWERS = [
    { k: ["maya", "student a", "why is", "flagged", "this student"], title: "Risk analysis — Student A (Grade 8)",
      band: "High", conf: 82,
      factors: ["Attendance: 81% (chronic); 9 absences clustered Mon/Fri.", "Course performance: failing 2 of 6 courses (Math, Science).", "Assignment completion: 58% over 4 weeks (▼).", "Engagement: 2 recent disengagement flags from teachers."],
      supports: ["Tier 2 attendance check-in with a named adult mentor.", "Math/Science targeted small-group reteach 3×/week.", "Positive family outreach before absences accumulate.", "Weekly progress monitoring for 6 weeks."],
      monitor: "Weekly (attendance + grades + completion) for 6 weeks; review at the next MTSS meeting." },
    { k: ["which students", "highest risk", "most at risk", "priorit"], title: "Highest-priority students this week",
      band: "High", conf: 78,
      factors: ["12 students meet 2+ early-warning indicators; 4 meet all three (attendance, behavior, course performance).", "Risk is concentrated in Grade 8 and among students with no active intervention.", "Several have recent downward trends rather than chronic low performance — a key window to act."],
      supports: ["Convene the student-support team for the 4 highest-risk students this week.", "Assign a single case-manager per student.", "Open Tier 2 plans with explicit goals and review dates."],
      monitor: "Weekly progress checks; escalate to Tier 3 only with team review." },
    { k: ["attendance", "absent", "chronic"], title: "Attendance-risk pattern analysis",
      band: "Medium", conf: 74,
      factors: ["Chronic absenteeism is 16% school-wide, clustered Mon/Fri.", "Attendance correlates with course-failure risk in this sample (r ≈ 0.6).", "40% of flagged students' families have had no positive contact this term."],
      supports: ["Early-warning watchlist with named check-in adults.", "Positive, proactive family outreach.", "Analyze Mon/Fri patterns for scheduling/engagement causes."],
      monitor: "Weekly attendance review; 3-week trend check per flagged student." }
  ];
  function answerFor(q) { var l = q.toLowerCase(); for (var i = 0; i < ANSWERS.length; i++) for (var j = 0; j < ANSWERS[i].k.length; j++) if (l.indexOf(ANSWERS[i].k[j]) > -1) return ANSWERS[i]; return { title: "Explainable risk analysis", band: "Medium", conf: 70, factors: ["I'd combine attendance, assignment completion, assessment trends, behavior, and intervention history.", "Then weight recent downward trends more heavily than stable patterns.", "And check which indicators are most actionable now."], supports: ["Match support to the strongest contributing factor.", "Assign an owner + review date.", "Choose the least-intensive effective tier first."], monitor: "Set a 3–6 week monitoring window and re-evaluate with the team." }; }
  function renderAnswer(a) {
    return "<h4>" + a.title + "</h4><div class='r-top' style='display:flex;gap:.6rem;align-items:center;margin:.3rem 0;'><span class='risk-band " + a.band.toLowerCase() + "'>" + a.band + " risk</span><span class='muted' style='font-size:.85rem;'>Confidence: " + a.conf + "%</span></div>" +
      "<div class='conf-bar'><span class='fill' data-pct='" + a.conf + "' style='width:" + a.conf + "%'></span></div>" +
      "<p><b>Why (contributing factors):</b></p><ul>" + a.factors.map(function (f) { return "<li>" + f + "</li>"; }).join("") + "</ul>" +
      "<p><b>Recommended supports:</b></p><ul>" + a.supports.map(function (f) { return "<li>" + f + "</li>"; }).join("") + "</ul>" +
      "<p><b>Suggested monitoring:</b> " + a.monitor + "</p>" +
      "<p class='muted' style='font-size:.85rem;'><span class='ai-pill'>👤 Educator decides</span> AI analysis on fictional sample data — transparent decision-support, reviewed by educators before any action.</p>";
  }
  function initRiskEngine() {
    var log = document.querySelector("[data-ai-log]"); if (!log) return;
    var form = document.querySelector("[data-ai-form]"), input = form ? form.querySelector("input") : null;
    var hist = LS.get(KEY.hist, []);
    if (hist.length) hist.forEach(function (m) { add(m.who, m.html, true); });
    else add("coach", "I'm the explainable AI Risk Engine. Ask about a student or pattern — e.g., <i>“Why is Student A flagged?”</i> or <i>“Which students are highest risk?”</i> I show the contributing factors, a confidence level, and recommended supports. Educators make every decision.", true);
    if (form) form.addEventListener("submit", function (e) { e.preventDefault(); var q = input.value.trim(); if (!q) return; add("user", esc(q)); input.value = ""; respond(q); });
    document.querySelectorAll("[data-ai-suggest]").forEach(function (c) { c.addEventListener("click", function () { add("user", esc(c.textContent)); respond(c.textContent); }); });
    var clr = document.querySelector("[data-ai-clear]"); if (clr) clr.addEventListener("click", function () { LS.set(KEY.hist, []); log.innerHTML = ""; add("coach", "Cleared. Which student or pattern should I analyze?", true); });
    function respond(q) { var typing = add("coach", '<span class="chat-typing">✨ Analyzing indicators…</span>', false, true); setTimeout(function () { typing.remove(); var d = add("coach", renderAnswer(answerFor(q))); var bar = d.querySelector(".conf-bar .fill"); if (bar) { var w = bar.getAttribute("data-pct"); bar.style.width = "0%"; requestAnimationFrame(function () { bar.style.transition = "width .9s ease"; bar.style.width = w + "%"; }); } bump("analyses"); }, 820); }
    function add(who, html, instant, ret) { var d = document.createElement("div"); d.className = "chat-msg " + (who === "user" ? "user" : "coach"); d.innerHTML = '<span class="who">' + (who === "user" ? "You" : "AI Risk Engine") + "</span>" + html; log.appendChild(d); log.scrollTop = log.scrollHeight; if (!ret) save(); return d; }
    function save() { var msgs = Array.prototype.map.call(log.querySelectorAll(".chat-msg"), function (m) { return { who: m.classList.contains("user") ? "user" : "coach", html: m.innerHTML.replace(/^<span class="who">[^<]*<\/span>/, "") }; }).slice(-10); LS.set(KEY.hist, msgs); }
  }

  /* ===================== REPORT GENERATOR ===================== */
  var REPORTS = {
    "Student Success Report": ["Student Success Report", "summarizing the whole-child picture & plan"],
    "MTSS Report": ["MTSS Report", "summarizing tier placement, interventions & progress"],
    "Attendance Report": ["Attendance Report", "summarizing attendance & engagement"],
    "Behavior Report": ["Behavior Report", "summarizing behavior & SEL"],
    "Academic Progress Report": ["Academic Progress Report", "summarizing growth & mastery"],
    "Intervention Summary": ["Intervention Summary", "summarizing plans, fidelity & outcomes"],
    "Parent Meeting Summary": ["Parent Meeting Summary", "for a family conference"],
    "School Leadership Report": ["School Leadership Report", "for school leadership"],
    "District Summary": ["District Summary", "for district student-support services"]
  };
  function buildReport(type, d) {
    var meta = REPORTS[type] || REPORTS["Student Success Report"];
    var who = val(d, "scope", "Student A · Grade 8"), term = val(d, "term", "This Semester");
    return "<h3>" + meta[0] + "</h3><p class='muted'>" + esc(who) + " · " + esc(term) + " · " + meta[1] + "</p>" +
      "<h4>Summary</h4><p>The student shows strengths in collaboration and verbal reasoning, with emerging risk driven primarily by attendance and math performance. A Tier 2 plan is in place with weekly monitoring.</p>" +
      "<h4>Indicators</h4><ul><li>Attendance: 81% (chronic) — clustered Mon/Fri</li><li>Academics: failing Math & Science; ELA on track</li><li>Assignment completion: 58% (▼)</li><li>Behavior: no major incidents; 2 disengagement flags</li><li>Well-being: belonging 'amber' on last check-in</li></ul>" +
      "<h4>Supports In Place</h4><ul><li>Mentor check-in (Tier 2)</li><li>Math/Science small-group reteach</li><li>Positive family outreach</li></ul>" +
      "<h4>Progress & Next Steps</h4><p>Attendance up 4 points over 3 weeks; continue plan and review at the next MTSS meeting. Consider adding an executive-functioning support if completion stays below target.</p>" +
      "<p class='muted' style='font-size:.85rem;'><span class='ai-pill'>👤 Educator review</span> AI-drafted from fictional sample data — verify before sharing.</p>";
  }
  function initReportGen() {
    document.querySelectorAll("[data-generator='report']").forEach(function (form) {
      var out = document.querySelector("[data-output='report']") || form.parentElement.querySelector(".gen-output"); var last = null;
      form.addEventListener("submit", function (e) { e.preventDefault(); last = collect(form); run(last, out); });
      if (out) out.addEventListener("click", function (e) { var b = e.target.closest("[data-act]"); if (!b) return; var act = b.getAttribute("data-act"); var body = out.querySelector(".out-body"); if (act === "copy") copyText(body ? body.innerText : ""); else if (act === "print") window.print(); else if (act === "regen") run(last || collect(form), out); else if (act === "save") { if (!body || !body.innerText.trim()) { toast("Generate a report first", ""); return; } toast("💾 Saved to report history", "ok"); } });
    });
  }
  function run(data, out) { if (!out) return; var body = out.querySelector(".out-body"), bar = out.querySelector(".out-toolbar"); if (bar) bar.querySelectorAll("[data-act]").forEach(function (b) { b.disabled = true; }); if (body) body.innerHTML = '<div class="gen-loading"><div class="ai-pill">✨ Generating report…</div><div class="shimmer w90"></div><div class="shimmer"></div><div class="shimmer w70"></div><div class="shimmer w50"></div><div class="shimmer w90"></div></div>'; setTimeout(function () { var type = val(data, "type", "Student Success Report"); if (body) body.innerHTML = buildReport(type, data); if (bar) bar.querySelectorAll("[data-act]").forEach(function (b) { b.disabled = false; }); bump("reports"); toast("✨ Report draft ready — review before sharing", "ok"); }, 880); }
  function collect(form) { var d = {}; form.querySelectorAll("input[name],select[name],textarea[name]").forEach(function (f) { d[f.name] = f.value; }); return d; }

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function val(d, k, fb) { return d && d[k] ? d[k] : fb; }
  function renderRailActive() { var here = location.pathname.split("/").pop() || "executive-dashboard.html"; document.querySelectorAll(".rail-link").forEach(function (a) { if (a.getAttribute("href") === here) a.classList.add("active"); }); }
  window.ESS = { toast: toast, copy: copyText };
})();
