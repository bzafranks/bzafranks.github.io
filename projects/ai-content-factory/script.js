/* =====================================================================
   AI Educational Content Factory — interactivity engine
   Loads AFTER the shared portfolio.js. Adds:
     • Dark mode  • Command palette (Ctrl/⌘+K) + FAB  • Toasts + clipboard
     • The CONTENT FACTORY: one prompt → a complete instructional package
     • Per-asset generators (lesson, assessment, video, interactive,
       presentation, workbook, teacher guide, parent resources)
     • Workflow automation (animated production pipeline)
     • Publishing/LMS export wizard, library, analytics, admin
   NOTE: All "AI" output is generated client-side from templates for
   demonstration; sample content is illustrative. Human editorial review
   is required. Nothing leaves the browser; storage is localStorage.
   ===================================================================== */
(function () {
  "use strict";
  var LS = { get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  var KEY = { theme: "cf:theme", lib: "cf:library", hist: "cf:hist", stats: "cf:stats" };

  var TOOLS = [
    { name: "Content Factory",        ico: "🏭", url: "content-factory.html",       desc: "One prompt → full package", group: "Produce" },
    { name: "Content Wizard",         ico: "🪄", url: "wizard.html",                desc: "Guided creation", group: "Produce" },
    { name: "Lesson Generator",       ico: "📝", url: "lesson-generator.html",      desc: "Complete lessons", group: "Generators" },
    { name: "Assessment Factory",     ico: "🧪", url: "assessment-factory.html",    desc: "All assessment types", group: "Generators" },
    { name: "AI Video Studio",        ico: "🎬", url: "video-studio.html",          desc: "Scripts & storyboards", group: "Generators" },
    { name: "Interactive Generator",  ico: "🎮", url: "interactive-generator.html", desc: "HTML learning activities", group: "Generators" },
    { name: "Presentation Generator", ico: "📊", url: "presentation-generator.html",desc: "Slide decks", group: "Generators" },
    { name: "Workbook Generator",     ico: "📚", url: "workbook-generator.html",    desc: "Student workbooks", group: "Generators" },
    { name: "Teacher Guide Generator",ico: "🧑‍🏫", url: "teacher-guide.html",       desc: "Facilitator guides", group: "Generators" },
    { name: "Parent Resources",       ico: "👨‍👩‍👧", url: "parent-resources.html",  desc: "Family materials", group: "Generators" },
    { name: "LMS Package Builder",    ico: "📦", url: "lms-builder.html",           desc: "Export to any LMS", group: "Deliver" },
    { name: "Publishing Center",      ico: "🚀", url: "publishing.html",            desc: "Publish anywhere", group: "Deliver" },
    { name: "Content Library",        ico: "🗂️", url: "library.html",              desc: "Everything you've made", group: "Deliver" },
    { name: "Workflow Automation",    ico: "⚙️", url: "workflow.html",             desc: "Pipelines", group: "Operate" },
    { name: "Analytics",              ico: "📈", url: "analytics.html",             desc: "Production metrics", group: "Operate" },
    { name: "Enterprise Admin",       ico: "🏢", url: "admin.html",                desc: "Teams & approvals", group: "Operate" },
    { name: "Settings",               ico: "⚙️", url: "settings.html",             desc: "Governance & QA", group: "Operate" }
  ];

  document.addEventListener("DOMContentLoaded", function () {
    initTheme(); buildChrome(); initThemeToggle();
    initGenerators(); initWorkspace(); initLibrary(); initChipToggles();
    initWizard(); initWorkflow(); initCountUp(); initDrilldowns(); initBars();
    initStats(); renderRailActive();
  });

  function initTheme() { if (LS.get(KEY.theme, "light") === "dark") document.body.classList.add("cf-dark"); }
  function initThemeToggle() {
    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) { sync(b); b.addEventListener("click", function () { document.body.classList.toggle("cf-dark"); var d = document.body.classList.contains("cf-dark"); LS.set(KEY.theme, d ? "dark" : "light"); document.querySelectorAll("[data-theme-toggle]").forEach(sync); toast(d ? "🌙 Dark mode on" : "☀️ Light mode on", "info"); }); });
    function sync(b) { b.textContent = document.body.classList.contains("cf-dark") ? "☀️" : "🌙"; }
  }

  function buildChrome() {
    if (document.querySelector("[data-no-chrome]")) return;
    if (!document.querySelector(".toast-wrap")) { var tw = document.createElement("div"); tw.className = "toast-wrap"; document.body.appendChild(tw); }
    if (!document.querySelector(".fab")) { var f = document.createElement("button"); f.className = "fab"; f.type = "button"; f.title = "Command palette (Ctrl/⌘ + K)"; f.setAttribute("aria-label", "Command palette"); f.textContent = "✨"; f.addEventListener("click", openPalette); document.body.appendChild(f); }
    if (!document.querySelector(".cmdk")) { var ov = document.createElement("div"); ov.className = "cmdk"; ov.innerHTML = '<div class="cmdk-box" role="dialog" aria-label="Command palette"><input class="cmdk-input" type="text" placeholder="Jump to a tool, or describe content to produce…" aria-label="Command search"><div class="cmdk-list"></div></div>'; document.body.appendChild(ov); ov.addEventListener("click", function (e) { if (e.target === ov) closePalette(); }); }
    bindPalette();
    document.addEventListener("keydown", function (e) { if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) { e.preventDefault(); openPalette(); } if (e.key === "Escape") closePalette(); });
  }
  var palIndex = 0, palMatches = [];
  function paletteItems() { var inP = /ai-content-factory/.test(location.pathname); var base = inP ? "" : "projects/ai-content-factory/"; return TOOLS.map(function (t) { return { ico: t.ico, name: t.name, hint: t.desc, url: base + t.url }; }); }
  function bindPalette() {
    var input = document.querySelector(".cmdk-input"); if (!input) return;
    input.addEventListener("input", function () { renderPalette(input.value); });
    input.addEventListener("keydown", function (e) { if (e.key === "ArrowDown") { e.preventDefault(); palIndex = Math.min(palIndex + 1, palMatches.length - 1); hi(); } else if (e.key === "ArrowUp") { e.preventDefault(); palIndex = Math.max(palIndex - 1, 0); hi(); } else if (e.key === "Enter") { var m = palMatches[palIndex]; if (m) location.href = m.url; } });
    function hi() { var els = document.querySelectorAll(".cmdk-item"); els.forEach(function (el, i) { el.classList.toggle("active", i === palIndex); }); if (els[palIndex]) els[palIndex].scrollIntoView({ block: "nearest" }); }
  }
  function renderPalette(q) { var list = document.querySelector(".cmdk-list"); if (!list) return; q = (q || "").toLowerCase().trim(); var all = paletteItems(); palMatches = !q ? all : all.filter(function (a) { return (a.name + " " + a.hint).toLowerCase().indexOf(q) > -1; }); palIndex = 0; if (!palMatches.length) { list.innerHTML = '<div class="cmdk-empty">No match — try “lesson”, “video”, or “publish”.</div>'; return; } list.innerHTML = palMatches.map(function (a, i) { return '<a class="cmdk-item' + (i === 0 ? " active" : "") + '" href="' + a.url + '"><span class="ico">' + a.ico + '</span><span>' + a.name + '</span><small>' + a.hint + "</small></a>"; }).join(""); }
  function openPalette() { var ov = document.querySelector(".cmdk"); if (!ov) return; ov.classList.add("open"); renderPalette(""); var i = ov.querySelector(".cmdk-input"); if (i) { i.value = ""; i.focus(); } }
  function closePalette() { var ov = document.querySelector(".cmdk"); if (ov) ov.classList.remove("open"); }

  function toast(msg, kind) { var w = document.querySelector(".toast-wrap"); if (!w) return; var t = document.createElement("div"); t.className = "toast " + (kind || ""); t.textContent = msg; w.appendChild(t); setTimeout(function () { t.style.opacity = "0"; t.style.transition = "opacity .3s"; setTimeout(function () { t.remove(); }, 320); }, 2400); }
  function copyText(text) { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { toast("📋 Copied", "ok"); }, function () { toast("Copy failed", ""); }); else toast("Clipboard unavailable", ""); }

  function getStats() { return LS.get(KEY.stats, { generated: 0, assets: 0, minutes: 0 }); }
  function bump(assets, min) { var s = getStats(); s.generated += 1; s.assets += (assets || 1); s.minutes += (min || 30); LS.set(KEY.stats, s); paintStats(); }
  function paintStats() { var s = getStats(); document.querySelectorAll("[data-stat=generated]").forEach(function (e) { e.textContent = s.generated; }); document.querySelectorAll("[data-stat=assets]").forEach(function (e) { e.textContent = s.assets; }); document.querySelectorAll("[data-stat=minutes]").forEach(function (e) { e.textContent = s.minutes; }); document.querySelectorAll("[data-stat=hours]").forEach(function (e) { e.textContent = (s.minutes / 60).toFixed(1); }); }
  function initStats() { paintStats(); }

  function libGet() { return LS.get(KEY.lib, []); }
  function libAdd(it) { var l = libGet(); it.id = "c" + l.length; l.unshift(it); LS.set(KEY.lib, l); }
  function initLibrary() {
    var wrap = document.querySelector("[data-library]"); if (!wrap) return; paint();
    var s = document.querySelector("[data-library-search]"); if (s) s.addEventListener("input", function () { paint(s.value); });
    function paint(q) { q = (q || "").toLowerCase(); var items = libGet().filter(function (it) { return !q || (it.title + " " + (it.body || "")).toLowerCase().indexOf(q) > -1; });
      if (!items.length) { wrap.innerHTML = '<div class="out-empty" style="height:auto;padding:2rem;"><div><div class="big">🗂️</div><p>Nothing produced yet. Use the Content Factory or a generator and press <b>Save</b>.</p></div></div>'; return; }
      var ic = { package: "🏭", lesson: "📝", assessment: "🧪", video: "🎬", interactive: "🎮", presentation: "📊", workbook: "📚", teacherguide: "🧑‍🏫", parent: "👨‍👩‍👧", other: "📄" };
      wrap.innerHTML = items.map(function (it) { return '<div class="lib-item"><span class="l-ico">' + (ic[it.type] || "📄") + '</span><div class="l-body"><b>' + esc(it.title) + "</b><small>" + esc((it.body || "").slice(0, 90)) + "…</small></div><span class=\"l-tag\">" + esc(it.type) + "</span></div>"; }).join("");
    }
  }

  function initChipToggles() { document.querySelectorAll(".chip-toggle").forEach(function (c) { c.addEventListener("click", function () { if (c.hasAttribute("data-single")) c.parentElement.querySelectorAll(".chip-toggle").forEach(function (x) { x.classList.remove("on"); }); c.classList.toggle("on"); }); }); }
  function chipVal(form, group) { var on = form.querySelectorAll('.chip-set[data-group="' + group + '"] .chip-toggle.on'); return Array.prototype.map.call(on, function (c) { return c.textContent.trim(); }); }

  function initCountUp() { var els = document.querySelectorAll("[data-count]"); if (!els.length) return; obsRun(els, function (el) { var t = parseFloat(el.getAttribute("data-count")), suf = el.getAttribute("data-suffix") || "", pre = el.getAttribute("data-prefix") || "", dur = 1000, start = null; function step(ts) { if (!start) start = ts; var p = Math.min((ts - start) / dur, 1); var v = t * (0.5 - Math.cos(p * Math.PI) / 2); el.textContent = pre + (t % 1 === 0 ? Math.round(v) : v.toFixed(1)) + suf; if (p < 1) requestAnimationFrame(step); } requestAnimationFrame(step); }); }
  function initBars() { var fills = document.querySelectorAll(".barlist .fill[data-pct]"); if (fills.length) obsRun(fills, function (el) { var p = el.getAttribute("data-pct"); el.style.width = "0%"; requestAnimationFrame(function () { el.style.transition = "width .9s ease"; el.style.width = p + "%"; }); }); var bars = document.querySelectorAll(".barchart .bar[data-h]"); if (bars.length) obsRun(bars, function (el) { var h = el.getAttribute("data-h"); el.style.height = "0%"; requestAnimationFrame(function () { el.style.height = h + "%"; }); }); }
  function obsRun(els, fn) { if ("IntersectionObserver" in window) { var o = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { fn(e.target); o.unobserve(e.target); } }); }, { threshold: 0.3 }); els.forEach(function (e) { o.observe(e); }); } else els.forEach(fn); }
  function initDrilldowns() { document.querySelectorAll(".drill-row").forEach(function (row) { row.addEventListener("click", function () { var p = row.nextElementSibling; if (p && p.classList.contains("drill-panel")) { row.classList.toggle("open"); p.classList.toggle("open"); } }); }); }

  /* ---------- Wizard ---------- */
  function initWizard() {
    var steps = document.querySelectorAll(".wizard .wizard-step"); if (!steps.length) return;
    var cur = 0; paint();
    document.querySelectorAll("[data-wizard-next]").forEach(function (b) { b.addEventListener("click", function () { if (cur < steps.length - 1) { cur++; paint(); } else toast("🚀 Package published (demo)", "ok"); }); });
    document.querySelectorAll(".export-opt").forEach(function (o) { o.addEventListener("click", function () { toast("📦 Prepared export: " + o.getAttribute("data-fmt") + " (demo)", "ok"); }); });
    function paint() { steps.forEach(function (s, i) { s.classList.toggle("active", i === cur); s.classList.toggle("done", i < cur); }); }
  }

  /* ---------- Workflow automation (animated pipeline) ---------- */
  function initWorkflow() {
    var run = document.querySelector("[data-run-workflow]"); if (!run) return;
    var steps = document.querySelectorAll(".pipeline .pipe-step");
    run.addEventListener("click", function () {
      steps.forEach(function (s) { s.classList.remove("done", "run"); var st = s.querySelector(".p-state"); if (st) st.textContent = "Queued"; });
      var i = 0;
      (function next() {
        if (i >= steps.length) { toast("✅ Workflow complete — full package produced (demo)", "ok"); bump(steps.length, steps.length * 20); var out = document.querySelector("[data-workflow-output]"); if (out) out.innerHTML = packageGrid(); return; }
        var s = steps[i]; s.classList.add("run"); var st = s.querySelector(".p-state"); if (st) st.textContent = "Running…";
        setTimeout(function () { s.classList.remove("run"); s.classList.add("done"); if (st) st.textContent = "Done"; i++; next(); }, 420);
      })();
    });
  }

  /* ===================== GENERATORS ===================== */
  function initGenerators() {
    document.querySelectorAll("[data-generator]").forEach(function (form) {
      var type = form.getAttribute("data-generator");
      var out = document.querySelector('[data-output="' + type + '"]') || form.parentElement.querySelector(".gen-output"); var last = null;
      form.addEventListener("submit", function (e) { e.preventDefault(); last = collect(form); run(type, last, out); });
      if (out) out.addEventListener("click", function (e) { var b = e.target.closest("[data-act]"); if (!b) return; var act = b.getAttribute("data-act"); var body = out.querySelector(".out-body"); if (act === "copy") copyText(body ? body.innerText : ""); else if (act === "print") window.print(); else if (act === "regen") run(type, last || collect(form), out); else if (act === "save") { if (!body || !body.innerText.trim()) { toast("Generate something first", ""); return; } var title = (last && (last.topic || last.title || last.subject)) || GEN[type].label; libAdd({ type: type, title: title + " — " + GEN[type].label, body: body.innerText }); toast("💾 Saved to Content Library", "ok"); } });
    });
  }
  function collect(form) { var d = {}; form.querySelectorAll("input[name],select[name],textarea[name]").forEach(function (f) { d[f.name] = f.value; }); form.querySelectorAll(".chip-set[data-group]").forEach(function (cs) { d[cs.getAttribute("data-group")] = chipVal(form, cs.getAttribute("data-group")); }); return d; }
  function run(type, data, out) {
    if (!out || !GEN[type]) return; var body = out.querySelector(".out-body"), bar = out.querySelector(".out-toolbar");
    if (bar) bar.querySelectorAll("[data-act]").forEach(function (b) { b.disabled = true; });
    var loadingMsg = type === "package" ? "✨ Producing your complete package…" : "✨ AI is producing content…";
    if (body) body.innerHTML = '<div class="gen-loading"><div class="ai-pill">' + loadingMsg + '</div><div class="shimmer w90"></div><div class="shimmer"></div><div class="shimmer w70"></div><div class="shimmer w50"></div><div class="shimmer w90"></div><div class="shimmer w70"></div></div>';
    var delay = type === "package" ? 1100 : 760;
    setTimeout(function () { if (body) body.innerHTML = GEN[type].build(data); if (bar) bar.querySelectorAll("[data-act]").forEach(function (b) { b.disabled = false; }); bump(GEN[type].assets || 1, GEN[type].mins || 30); toast(type === "package" ? "✨ Full package produced — review before publishing" : "✨ Draft ready — review before publishing", "ok"); }, delay);
  }

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function val(d, k, fb) { return d && d[k] ? d[k] : fb; }
  function list(a) { return "<ul>" + a.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</ul>"; }
  function review() { return '<p class="muted" style="margin-top:1rem;font-size:.85rem;"><span class="ai-pill">👤 Editorial review</span> AI draft on illustrative content — human editorial &amp; pedagogical review required before publishing.</p>'; }
  var PKG = [
    { i: "📝", n: "Lesson Plan" }, { i: "📚", n: "Student Workbook" }, { i: "📊", n: "Slide Deck" }, { i: "🎬", n: "Video (script + storyboard)" },
    { i: "🧪", n: "Assessment + Answer Key" }, { i: "📋", n: "Rubric" }, { i: "🎯", n: "Quiz / Kahoot-style game" }, { i: "🎮", n: "Interactive HTML activity" },
    { i: "🧑‍🏫", n: "Teacher Guide" }, { i: "🧑‍🎓", n: "Student Guide" }, { i: "👨‍👩‍👧", n: "Parent Guide" }, { i: "📦", n: "LMS Package (SCORM)" }, { i: "🚀", n: "Publishing Files" }
  ];
  function packageGrid() { return '<div class="package-grid">' + PKG.map(function (p) { return '<div class="pkg-item"><span class="pk-ico">' + p.i + '</span><div><b>' + p.n + '</b><small>✓ Generated</small></div></div>'; }).join("") + "</div>"; }

  var GEN = {
    package: { label: "Complete Instructional Package", assets: 13, mins: 260, build: function (d) {
      var subj = val(d, "subject", "Mathematics"), grade = val(d, "grade", "Grade 5"), topic = val(d, "topic", "Fractions"), model = val(d, "model", "Gradual Release"), lang = val(d, "language", "English"), fmt = val(d, "format", "Full digital + printable");
      return "<h3>Complete Package — " + esc(topic) + "</h3><p class='muted'>" + esc(grade) + " · " + esc(subj) + " · " + esc(model) + " · " + esc(lang) + " · " + esc(fmt) + "</p>" +
        "<p>From a single prompt, the factory produced a complete, standards-aligned instructional ecosystem:</p>" + packageGrid() +
        "<h4>What's inside</h4>" + list(["<b>Lesson plan</b> with objectives, success criteria, gradual-release flow, and exit ticket.", "<b>Student workbook</b> with practice, graphic organizers, and a study guide.", "<b>Slide deck</b> + presenter notes.", "<b>Video</b> narration script, storyboard, and image prompts.", "<b>Assessment</b> (MC + constructed response) with answer key, Bloom's &amp; DOK alignment.", "<b>Rubric</b> and a quiz/game set.", "<b>Interactive HTML activity</b> (dependency-free).", "<b>Teacher, student, and parent guides.</b>", "<b>LMS package</b> (SCORM) + publishing files."]) +
        "<h4>Standards &amp; Quality</h4>" + list(["Aligned to grade-level standards", "Accessibility-checked (alt text, reading level, captions)", "Consistent branding across every asset"]) + review();
    }},
    lesson: { label: "Lesson", assets: 1, mins: 35, build: function (d) {
      var topic = val(d, "topic", "Fractions"), grade = val(d, "grade", "Grade 5");
      return "<h3>" + esc(topic) + " — Lesson</h3><p class='muted'>" + esc(grade) + "</p>" +
        "<h4>Objective &amp; Success Criteria</h4><p>Students will " + esc(topic.toLowerCase()) + " with evidence; I can explain my reasoning.</p>" +
        "<h4>Flow</h4>" + list(["Hook", "Mini-lesson (I do)", "Guided practice (we do)", "Independent / collaborative (you do)", "Differentiation", "Assessment &amp; exit ticket"]) +
        "<h4>Also included</h4><p>Homework, reflection, teacher notes, student notes, interactive activity.</p>" + review();
    }},
    assessment: { label: "Assessment", assets: 1, mins: 40, build: function (d) {
      var topic = val(d, "topic", "Fractions"), n = parseInt(val(d, "count", "5"), 10) || 5; var b = ["Remember", "Understand", "Apply", "Analyze", "Evaluate", "Create"], dk = ["DOK1", "DOK2", "DOK2", "DOK3", "DOK3", "DOK4"], out = "<h3>" + esc(topic) + " — Assessment</h3><ol>", key = [];
      for (var i = 0; i < n; i++) { if (i % 3 === 2) { out += "<li><b>[" + b[i % 6] + " · " + dk[i % 6] + "]</b> Constructed response with evidence.</li>"; key.push((i + 1) + ". 2-pt rubric"); } else { out += "<li><b>[" + b[i % 6] + " · " + dk[i % 6] + "]</b> MC: A · <b>B</b> · C · D</li>"; key.push((i + 1) + ". B"); } }
      return out + "</ol><h4>Answer Key</h4>" + list(key) + "<h4>Reports</h4><p>Standards alignment, Bloom's &amp; DOK distribution, difficulty analysis.</p>" + review();
    }},
    video: { label: "Video", assets: 1, mins: 45, build: function (d) {
      var topic = val(d, "topic", "Fractions"); return "<h3>AI Video — " + esc(topic) + "</h3>" +
        "<h4>Narration Script (excerpt)</h4><p>\"Today we'll explore " + esc(topic.toLowerCase()) + "…\"</p>" +
        "<h4>Storyboard</h4>" + list(["Hook (0:00–0:20)", "Teach (0:20–1:30)", "Practice (1:30–2:20)", "Recap (2:20–2:45)"]) +
        "<h4>Production</h4><p>Slides (Gamma/Canva) → avatar/voice (Synthesia/HeyGen) → captions + transcript → review → publish. Includes presenter notes, image prompts, voice recommendation, reflection questions, student activities, and a teacher guide.</p>" + review();
    }},
    interactive: { label: "Interactive Activity", assets: 1, mins: 40, build: function (d) {
      var kind = val(d, "kind", "Drag-and-Drop"), topic = val(d, "topic", "Fractions"); return "<h3>Interactive: " + esc(kind) + "</h3><p class='muted'>Topic: " + esc(topic) + " · production-ready HTML/CSS/JS</p>" +
        list(["Clear directions + example", "Immediate feedback + self-check", "Progress tracking", "Keyboard-accessible; printable fallback"]) + "<p>Generated as a self-contained module using dependency-free components — runs on any device and embeds in any LMS.</p>" + review();
    }},
    presentation: { label: "Presentation", assets: 1, mins: 30, build: function (d) {
      var topic = val(d, "topic", "Fractions"); return "<h3>Presentation — " + esc(topic) + "</h3>" + list(["Title + objectives", "Hook slide", "Concept slides with visuals", "Worked examples", "Practice prompts", "Recap + exit question"]) + "<h4>Variants</h4><p>Teacher presentation, student presentation, conference deck, and visual infographic. Exportable to PowerPoint / Google Slides.</p>" + review();
    }},
    workbook: { label: "Workbook", assets: 1, mins: 35, build: function (d) {
      var topic = val(d, "topic", "Fractions"); return "<h3>Student Workbook — " + esc(topic) + "</h3>" + list(["Practice pages", "Graphic organizers", "Vocabulary activities", "Reflection pages", "Interactive journal prompts", "Study guide", "Extension &amp; review activities"]) + "<p>Printable PDF version included.</p>" + review();
    }},
    teacherguide: { label: "Teacher Guide", assets: 1, mins: 25, build: function (d) {
      var topic = val(d, "topic", "the lesson"); return "<h3>Teacher Guide — " + esc(topic) + "</h3>" + list(["Lesson notes &amp; facilitation", "Implementation tips", "Timing guide", "Differentiation", "Common misconceptions", "Question prompts", "Assessment guide", "Technology integration", "Substitute-teacher guide"]) + review();
    }},
    parent: { label: "Parent Resources", assets: 1, mins: 18, build: function (d) {
      var topic = val(d, "topic", "this unit"); return "<h3>Parent Resources — " + esc(topic) + "</h3>" + list(["Parent guide", "Home activities", "Conversation starters", "Weekly newsletter", "Homework help", "Progress support tips", "Family learning activities", "Reading list"]) + "<p>Plain-language and translation-ready.</p>" + review();
    }}
  };

  /* ===================== WORKSPACE / FACTORY NL ROUTER ===================== */
  function initWorkspace() {
    var log = document.querySelector("[data-ws-log]"); if (!log) return;
    var form = document.querySelector("[data-ws-form]"), input = form ? form.querySelector("input") : null;
    var hist = LS.get(KEY.hist, []);
    if (hist.length) hist.forEach(function (m) { add(m.who, m.html, true); });
    else add("coach", "Welcome to the Content Factory. Describe what you need and I'll produce a complete package — e.g., <i>“Grade 5 fractions unit”</i>. You review and publish.", true);
    if (form) form.addEventListener("submit", function (e) { e.preventDefault(); var q = input.value.trim(); if (!q) return; add("user", esc(q)); input.value = ""; route(q); });
    document.querySelectorAll("[data-ws-suggest]").forEach(function (c) { c.addEventListener("click", function () { add("user", esc(c.textContent)); route(c.textContent); }); });
    var clr = document.querySelector("[data-ws-clear]"); if (clr) clr.addEventListener("click", function () { LS.set(KEY.hist, []); log.innerHTML = ""; add("coach", "Cleared. What should the factory produce next?", true); });
    function route(q) { var typing = add("coach", '<span class="chat-typing">✨ Producing a complete package…</span>', false, true); setTimeout(function () { typing.remove(); add("coach", "Here's your complete instructional package — 13 aligned assets from one prompt:" + '<div class="card" style="margin-top:.7rem;padding:1rem;">' + packageGrid() + '</div><div style="margin-top:.7rem;"><a class="btn small" href="content-factory.html">Open the Content Factory →</a></div>'); bump(13, 260); }, 1000); }
    function add(who, html, instant, ret) { var d = document.createElement("div"); d.className = "chat-msg " + (who === "user" ? "user" : "coach"); d.innerHTML = '<span class="who">' + (who === "user" ? "You" : "AI Factory") + "</span>" + html; log.appendChild(d); log.scrollTop = log.scrollHeight; if (!ret) save(); return d; }
    function save() { var msgs = Array.prototype.map.call(log.querySelectorAll(".chat-msg"), function (m) { return { who: m.classList.contains("user") ? "user" : "coach", html: m.innerHTML.replace(/^<span class="who">[^<]*<\/span>/, "") }; }).slice(-8); LS.set(KEY.hist, msgs); }
  }

  function renderRailActive() { var here = location.pathname.split("/").pop() || "content-factory.html"; document.querySelectorAll(".rail-link").forEach(function (a) { if (a.getAttribute("href") === here) a.classList.add("active"); }); }
  window.CF = { toast: toast, copy: copyText };
})();
