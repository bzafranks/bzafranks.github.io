/* =====================================================================
   AI Curriculum Authoring Studio — interactivity engine
   Loads AFTER the shared portfolio.js. Adds the authoring-studio behaviors:
     • Dark mode  • Command palette (Ctrl/⌘+K) + FAB  • Toasts + clipboard
     • Simulated AI generators (curriculum, scope&sequence, unit, lesson,
       assessment, rubric, resources, video storyboard, interactive)
     • Curriculum workspace NL router + drag-and-drop builder tree
     • Resource/Project library + autosave indicator + analytics count-up
   NOTE: All "AI" output is generated client-side from templates for
   demonstration. Sample curriculum data is illustrative. Nothing leaves
   the browser; storage is localStorage.
   ===================================================================== */
(function () {
  "use strict";

  var LS = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  var KEY = { theme: "acs:theme", lib: "acs:library", hist: "acs:hist", stats: "acs:stats" };

  var TOOLS = [
    { name: "Curriculum Workspace",      ico: "🗂️", url: "workspace.html",           desc: "Projects & drafts", group: "Workspace" },
    { name: "Curriculum Builder",        ico: "🏗️", url: "curriculum-builder.html",  desc: "Courses → units → lessons", group: "Design" },
    { name: "Scope & Sequence",          ico: "🗓️", url: "scope-sequence.html",      desc: "Maps & pacing", group: "Design" },
    { name: "Standards Alignment",       ico: "🎯", url: "standards.html",           desc: "Map, crosswalk, gaps", group: "Design" },
    { name: "Unit Planner",              ico: "📦", url: "units.html",               desc: "Full instructional units", group: "Author" },
    { name: "Lesson Builder",            ico: "📝", url: "lessons.html",             desc: "Complete lessons", group: "Author" },
    { name: "Assessment Studio",         ico: "🧪", url: "assessment.html",          desc: "All assessment types", group: "Author" },
    { name: "Rubric Generator",          ico: "📊", url: "rubrics.html",             desc: "Analytic & holistic", group: "Author" },
    { name: "Interactive Learning",      ico: "🎮", url: "interactive-builder.html", desc: "HTML learning activities", group: "Author" },
    { name: "AI Video Studio",           ico: "🎬", url: "video-studio.html",        desc: "Scripts & storyboards", group: "Author" },
    { name: "Resource Generator",        ico: "📄", url: "resources.html",           desc: "Guides & workbooks", group: "Author" },
    { name: "Publishing Center",         ico: "🚀", url: "publishing.html",          desc: "Export everywhere", group: "Deliver" },
    { name: "Collaboration Hub",         ico: "👥", url: "collaboration.html",       desc: "Review & approval", group: "Deliver" },
    { name: "Template Library",          ico: "🧩", url: "templates.html",           desc: "Pedagogy templates", group: "Deliver" },
    { name: "Analytics",                 ico: "📈", url: "analytics.html",           desc: "Coverage & productivity", group: "Deliver" },
    { name: "Settings",                  ico: "⚙️", url: "settings.html",            desc: "Preferences & governance", group: "Deliver" }
  ];

  document.addEventListener("DOMContentLoaded", function () {
    initTheme(); buildChrome(); initThemeToggle();
    initGenerators(); initWorkspace(); initBuilderTree();
    initLibrary(); initChipToggles(); initEditor(); initWizard();
    initCountUp(); initStats(); renderRailActive();
  });

  /* ===================== THEME ===================== */
  function initTheme() { if (LS.get(KEY.theme, "light") === "dark") document.body.classList.add("acs-dark"); }
  function initThemeToggle() {
    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      sync(btn);
      btn.addEventListener("click", function () {
        document.body.classList.toggle("acs-dark"); var d = document.body.classList.contains("acs-dark");
        LS.set(KEY.theme, d ? "dark" : "light"); document.querySelectorAll("[data-theme-toggle]").forEach(sync);
        toast(d ? "🌙 Dark mode on" : "☀️ Light mode on", "info");
      });
    });
    function sync(b) { b.textContent = document.body.classList.contains("acs-dark") ? "☀️" : "🌙"; }
  }

  /* ===================== CHROME ===================== */
  function buildChrome() {
    if (document.querySelector("[data-no-chrome]")) return;
    if (!document.querySelector(".toast-wrap")) { var tw = document.createElement("div"); tw.className = "toast-wrap"; document.body.appendChild(tw); }
    if (!document.querySelector(".fab")) {
      var fab = document.createElement("button"); fab.className = "fab"; fab.type = "button"; fab.title = "Command palette (Ctrl/⌘ + K)"; fab.setAttribute("aria-label", "Command palette"); fab.textContent = "✨";
      fab.addEventListener("click", openPalette); document.body.appendChild(fab);
    }
    if (!document.querySelector(".cmdk")) {
      var ov = document.createElement("div"); ov.className = "cmdk"; ov.innerHTML = '<div class="cmdk-box" role="dialog" aria-label="Command palette"><input class="cmdk-input" type="text" placeholder="Jump to a tool, or describe what to author…" aria-label="Command search"><div class="cmdk-list"></div></div>';
      document.body.appendChild(ov); ov.addEventListener("click", function (e) { if (e.target === ov) closePalette(); });
    }
    bindPalette();
    document.addEventListener("keydown", function (e) {
      if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) { e.preventDefault(); openPalette(); }
      if (e.key === "Escape") closePalette();
    });
  }
  var palIndex = 0, palMatches = [];
  function paletteItems() {
    var inProject = /ai-curriculum-studio/.test(location.pathname);
    var base = inProject ? "" : "projects/ai-curriculum-studio/";
    return TOOLS.map(function (t) { return { ico: t.ico, name: t.name, hint: t.desc, url: base + t.url }; });
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
    if (!palMatches.length) { list.innerHTML = '<div class="cmdk-empty">No match — try “unit”, “assessment”, or “publish”.</div>'; return; }
    list.innerHTML = palMatches.map(function (a, i) { return '<a class="cmdk-item' + (i === 0 ? " active" : "") + '" href="' + a.url + '"><span class="ico">' + a.ico + '</span><span>' + a.name + '</span><small>' + a.hint + "</small></a>"; }).join("");
  }
  function openPalette() { var ov = document.querySelector(".cmdk"); if (!ov) return; ov.classList.add("open"); renderPalette(""); var i = ov.querySelector(".cmdk-input"); if (i) { i.value = ""; i.focus(); } }
  function closePalette() { var ov = document.querySelector(".cmdk"); if (ov) ov.classList.remove("open"); }

  /* ===================== TOAST + CLIPBOARD ===================== */
  function toast(msg, kind) {
    var w = document.querySelector(".toast-wrap"); if (!w) return;
    var t = document.createElement("div"); t.className = "toast " + (kind || ""); t.textContent = msg; w.appendChild(t);
    setTimeout(function () { t.style.opacity = "0"; t.style.transition = "opacity .3s"; setTimeout(function () { t.remove(); }, 320); }, 2400);
  }
  function copyText(text) { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { toast("📋 Copied", "ok"); }, function () { toast("Copy failed", ""); }); else toast("Clipboard unavailable", ""); }

  /* ===================== STATS ===================== */
  function getStats() { return LS.get(KEY.stats, { generated: 0, minutes: 0 }); }
  function bump(min) { var s = getStats(); s.generated += 1; s.minutes += (min || 25); LS.set(KEY.stats, s); paintStats(); }
  function paintStats() { var s = getStats(); document.querySelectorAll("[data-stat=generated]").forEach(function (e) { e.textContent = s.generated; }); document.querySelectorAll("[data-stat=minutes]").forEach(function (e) { e.textContent = s.minutes; }); document.querySelectorAll("[data-stat=hours]").forEach(function (e) { e.textContent = (s.minutes / 60).toFixed(1); }); }
  function initStats() { paintStats(); }

  /* ===================== LIBRARY ===================== */
  function libGet() { return LS.get(KEY.lib, []); }
  function libAdd(item) { var l = libGet(); item.id = "a" + l.length; l.unshift(item); LS.set(KEY.lib, l); }
  function initLibrary() {
    var wrap = document.querySelector("[data-library]"); if (!wrap) return;
    paint(); var s = document.querySelector("[data-library-search]"); if (s) s.addEventListener("input", function () { paint(s.value); });
    function paint(q) {
      q = (q || "").toLowerCase();
      var items = libGet().filter(function (it) { return !q || (it.title + " " + (it.body || "")).toLowerCase().indexOf(q) > -1; });
      if (!items.length) { wrap.innerHTML = '<div class="out-empty" style="height:auto;padding:2rem;"><div><div class="big">🗂️</div><p>Nothing saved yet. Generate curriculum with any studio tool and press <b>Save</b>.</p></div></div>'; return; }
      var ic = { curriculum: "🏗️", unit: "📦", lesson: "📝", assessment: "🧪", rubric: "📊", resource: "📄", video: "🎬", scope: "🗓️", interactive: "🎮", other: "📄" };
      wrap.innerHTML = items.map(function (it) { return '<div class="lib-item"><span class="l-ico">' + (ic[it.type] || "📄") + '</span><div class="l-body"><b>' + esc(it.title) + "</b><small>" + esc((it.body || "").slice(0, 90)) + "…</small></div><span class=\"l-tag\">" + esc(it.type) + "</span></div>"; }).join("");
    }
  }

  /* ===================== CHIP TOGGLES ===================== */
  function initChipToggles() {
    document.querySelectorAll(".chip-toggle").forEach(function (c) { c.addEventListener("click", function () { if (c.hasAttribute("data-single")) c.parentElement.querySelectorAll(".chip-toggle").forEach(function (x) { x.classList.remove("on"); }); c.classList.toggle("on"); }); });
  }
  function chipVal(form, group) { var on = form.querySelectorAll('.chip-set[data-group="' + group + '"] .chip-toggle.on'); return Array.prototype.map.call(on, function (c) { return c.textContent.trim(); }); }

  /* ===================== EDITOR (rich-text mock) ===================== */
  function initEditor() {
    document.querySelectorAll(".editor-toolbar button[data-cmd]").forEach(function (b) {
      b.addEventListener("click", function () { try { document.execCommand(b.getAttribute("data-cmd"), false, null); } catch (e) {} var a = b.closest(".editor-wrap"); var area = a && a.querySelector(".editor-area"); if (area) area.focus(); });
    });
  }

  /* ===================== PUBLISHING WIZARD ===================== */
  function initWizard() {
    var steps = document.querySelectorAll(".wizard .wizard-step"); if (!steps.length) return;
    var nextBtns = document.querySelectorAll("[data-wizard-next]");
    var cur = 0; paint();
    nextBtns.forEach(function (b) { b.addEventListener("click", function () { if (cur < steps.length - 1) { cur++; paint(); } else toast("🚀 Curriculum published (demo)", "ok"); }); });
    document.querySelectorAll(".export-opt").forEach(function (o) { o.addEventListener("click", function () { toast("📦 Prepared export: " + o.getAttribute("data-fmt") + " (demo)", "ok"); }); });
    function paint() { steps.forEach(function (s, i) { s.classList.toggle("active", i === cur); s.classList.toggle("done", i < cur); }); }
  }

  /* ===================== BUILDER TREE (drag-and-drop) ===================== */
  function initBuilderTree() {
    var tree = document.querySelector("[data-builder-tree]"); if (!tree) return;
    var dragging = null;
    tree.querySelectorAll(".tree-node").forEach(function (n) {
      n.setAttribute("draggable", "true");
      n.addEventListener("dragstart", function () { dragging = n; n.classList.add("dragging"); });
      n.addEventListener("dragend", function () { n.classList.remove("dragging"); dragging = null; toast("✔ Curriculum reordered", "ok"); });
    });
    tree.addEventListener("dragover", function (e) {
      e.preventDefault(); if (!dragging) return;
      var after = getAfter(tree, e.clientY);
      if (after == null) tree.appendChild(dragging); else tree.insertBefore(dragging, after);
    });
    function getAfter(container, y) {
      var els = Array.prototype.slice.call(container.querySelectorAll(".tree-node:not(.dragging)"));
      return els.reduce(function (closest, child) { var box = child.getBoundingClientRect(); var offset = y - box.top - box.height / 2; if (offset < 0 && offset > closest.offset) return { offset: offset, element: child }; return closest; }, { offset: -Infinity }).element;
    }
  }

  /* ===================== GENERATORS ===================== */
  function initGenerators() {
    document.querySelectorAll("[data-generator]").forEach(function (form) {
      var type = form.getAttribute("data-generator");
      var out = document.querySelector('[data-output="' + type + '"]') || form.parentElement.querySelector(".gen-output");
      var last = null;
      form.addEventListener("submit", function (e) { e.preventDefault(); last = collect(form); run(type, last, out); });
      if (out) out.addEventListener("click", function (e) {
        var b = e.target.closest("[data-act]"); if (!b) return; var act = b.getAttribute("data-act"); var body = out.querySelector(".out-body");
        if (act === "copy") copyText(body ? body.innerText : "");
        else if (act === "print") window.print();
        else if (act === "regen") run(type, last || collect(form), out);
        else if (act === "save") { if (!body || !body.innerText.trim()) { toast("Generate something first", ""); return; } var title = (last && (last.topic || last.title || last.subject)) || GEN[type].label; libAdd({ type: type, title: title + " — " + GEN[type].label, body: body.innerText }); toast("💾 Saved to library", "ok"); }
      });
    });
  }
  function collect(form) {
    var d = {}; form.querySelectorAll("input[name],select[name],textarea[name]").forEach(function (f) { d[f.name] = f.value; });
    form.querySelectorAll(".chip-set[data-group]").forEach(function (cs) { d[cs.getAttribute("data-group")] = chipVal(form, cs.getAttribute("data-group")); });
    return d;
  }
  function run(type, data, out) {
    if (!out || !GEN[type]) return; var body = out.querySelector(".out-body"), bar = out.querySelector(".out-toolbar");
    if (bar) bar.querySelectorAll("[data-act]").forEach(function (b) { b.disabled = true; });
    if (body) body.innerHTML = '<div class="gen-loading"><div class="ai-pill">✨ AI is authoring…</div><div class="shimmer w90"></div><div class="shimmer"></div><div class="shimmer w70"></div><div class="shimmer w50"></div><div class="shimmer w90"></div><div class="shimmer w70"></div></div>';
    setTimeout(function () { if (body) body.innerHTML = GEN[type].build(data); if (bar) bar.querySelectorAll("[data-act]").forEach(function (b) { b.disabled = false; }); bump(GEN[type].mins); toast("✨ Draft ready — review before publishing", "ok"); }, 760);
  }

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function val(d, k, fb) { return d && d[k] ? d[k] : fb; }
  function list(a) { return "<ul>" + a.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</ul>"; }
  function review() { return '<p class="muted" style="margin-top:1rem;font-size:.85rem;"><span class="ai-pill">👤 Human review</span> AI draft — review for accuracy, standards fit, and pedagogy before publishing.</p>'; }

  var GEN = {
    curriculum: { label: "Curriculum Outline", mins: 60, build: function (d) {
      var subj = val(d, "subject", "ELA"), grade = val(d, "grade", "Grade 5"), n = parseInt(val(d, "units", "6"), 10) || 6;
      var out = "<h3>" + esc(subj) + " — " + esc(grade) + " Curriculum</h3><p class='muted'>" + n + " units · vertically and horizontally aligned</p>";
      for (var i = 1; i <= n; i++) out += "<h4>Unit " + i + "</h4><p>Big idea, 2–4 anchor standards, essential question, performance task, and 8–12 lessons. Builds on Unit " + (i - 1 || "readiness") + " and prepares Unit " + (i + 1) + ".</p>";
      return out + "<h4>Alignment Notes</h4>" + list(["Vertical: spirals key concepts across units.", "Horizontal: connects to science/social-studies themes.", "Assessment: diagnostic → formative → summative per unit."]) + review();
    }},
    scope: { label: "Scope & Sequence", mins: 45, build: function (d) {
      var subj = val(d, "subject", "ELA"), grade = val(d, "grade", "Grade 5");
      return "<h3>Scope &amp; Sequence — " + esc(subj) + " " + esc(grade) + "</h3>" +
        "<h4>Quarter 1</h4>" + list(["Units 1–2 · foundational concepts", "Diagnostic + 2 formative checkpoints"]) +
        "<h4>Quarter 2</h4>" + list(["Units 3–4 · application & analysis", "Mid-year benchmark"]) +
        "<h4>Quarter 3</h4>" + list(["Unit 5 · synthesis", "Performance task"]) +
        "<h4>Quarter 4</h4>" + list(["Unit 6 · transfer & review", "Summative assessment"]) +
        "<h4>Pacing</h4><p>~36 instructional weeks; each unit 5–7 weeks with built-in reteach/flex days.</p>" + review();
    }},
    unit: { label: "Unit Plan", mins: 50, build: function (d) {
      var topic = val(d, "topic", "Informational Reading"), grade = val(d, "grade", "Grade 5");
      return "<h3>" + esc(topic) + " — Unit Plan</h3><p class='muted'>" + esc(grade) + "</p>" +
        "<h4>Big Idea</h4><p>Readers use text structure and evidence to build understanding.</p>" +
        "<h4>Essential Questions</h4>" + list(["How do authors organize information?", "How do we know what a text really says?"]) +
        "<h4>Learning Objectives</h4>" + list(["Determine main idea & key details.", "Analyze text structure.", "Cite evidence to support inferences."]) +
        "<h4>Success Criteria</h4>" + list(["I can state the main idea and support it with evidence.", "I can identify and explain text structure."]) +
        "<h4>Vocabulary</h4><p>main idea, key detail, text structure, cause/effect, compare/contrast, evidence.</p>" +
        "<h4>Performance Task</h4><p>Compare two texts on one topic and write an evidence-based synthesis.</p>" +
        "<h4>Learning Activities</h4>" + list(["Close reading + annotation", "Structure sorts", "Evidence chains", "Jigsaw discussions"]) +
        "<h4>Assessment Plan</h4><p>Diagnostic → 3 formative checks → summative synthesis.</p>" +
        "<h4>Technology · Differentiation · Parent Support · Reflection · Teacher Notes</h4><p>Built-in supports for each, with UDL options and home-connection ideas.</p>" + review();
    }},
    lesson: { label: "Lesson", mins: 35, build: function (d) {
      var topic = val(d, "topic", "Text Structure"), grade = val(d, "grade", "Grade 5"), mins = val(d, "duration", "45");
      return "<h3>" + esc(topic) + "</h3><p class='muted'>" + esc(grade) + " · " + esc(mins) + " min</p>" +
        "<h4>Hook</h4><p>Quick provocation tied to " + esc(topic.toLowerCase()) + ".</p>" +
        "<h4>Mini-Lesson (I do)</h4><p>Model the skill with a think-aloud.</p>" +
        "<h4>Guided Practice (We do)</h4><p>Work a shared example together.</p>" +
        "<h4>Independent / Collaborative Practice (You do)</h4><p>Apply to a new text; confer with groups.</p>" +
        "<h4>Differentiation</h4>" + list(["Support: frames & reduced text", "Core: grade-level task", "Extension: cross-text synthesis"]) +
        "<h4>Assessment · Exit Ticket</h4><p>One question that checks the objective directly.</p>" +
        "<h4>Homework · Reflection · Teacher Guide · Student Notes</h4><p>Included with downloadable resources.</p>" + review();
    }},
    assessment: { label: "Assessment", mins: 40, build: function (d) {
      var topic = val(d, "topic", "Ecosystems"), n = parseInt(val(d, "count", "5"), 10) || 5;
      var blooms = ["Remember", "Understand", "Apply", "Analyze", "Evaluate", "Create"], dok = ["DOK1", "DOK2", "DOK2", "DOK3", "DOK3", "DOK4"];
      var out = "<h3>" + esc(topic) + " — Assessment</h3><p class='muted'>" + n + " items · keys + standards + Bloom's + DOK</p><ol>", key = [];
      for (var i = 0; i < n; i++) { var b = blooms[i % 6], k = dok[i % 6];
        if (i % 3 === 2) { out += "<li><b>[" + b + " · " + k + "]</b> Constructed response: explain with evidence.</li>"; key.push((i + 1) + ". 2-pt rubric"); }
        else { out += "<li><b>[" + b + " · " + k + "]</b> MC: A · <b>B (correct)</b> · C · D</li>"; key.push((i + 1) + ". B"); } }
      return out + "</ol><h4>Answer Key</h4>" + list(key) + "<h4>Difficulty Analysis</h4><p>Balanced DOK 1–3 with one extended item; passage-based.</p>" + review();
    }},
    rubric: { label: "Rubric", mins: 25, build: function (d) {
      var task = val(d, "task", "Argumentative Essay"), style = val(d, "style", "Analytic");
      var crit = (d.criteria && d.criteria.length) ? d.criteria : ["Claim", "Evidence", "Organization", "Conventions"];
      var out = "<h3>" + esc(task) + " — " + esc(style) + " Rubric</h3>";
      if (style === "Holistic") out += list(["4 Exceeds — sophisticated control", "3 Meets — clear & effective", "2 Approaching — developing", "1 Beginning — limited"]);
      else { out += '<div class="table-wrap"><table><thead><tr><th>Criterion</th><th>4</th><th>3</th><th>2</th><th>1</th></tr></thead><tbody>'; crit.forEach(function (c) { out += "<tr><td><b>" + esc(c) + "</b></td><td>Exceeds</td><td>Meets</td><td>Approaching</td><td>Beginning</td></tr>"; }); out += "</tbody></table></div>"; }
      return out + "<h4>Scoring</h4><p>Total " + (crit.length * 4) + " pts; convert to standards level or %.</p>" + review();
    }},
    resource: { label: "Resource", mins: 20, build: function (d) {
      var kind = val(d, "kind", "Teacher Guide"), topic = val(d, "topic", "the unit");
      return "<h3>" + esc(kind) + "</h3><p class='muted'>For " + esc(topic) + "</p>" +
        "<h4>Contents</h4>" + list(["Overview & objectives", "Step-by-step facilitation", "Key vocabulary & visuals", "Differentiation & UDL supports", "Answer keys / exemplars", "Family connection"]) +
        "<h4>Format</h4><p>Print-ready and digital; accessible structure with headings and alt-text guidance.</p>" + review();
    }},
    video: { label: "Video Storyboard", mins: 45, build: function (d) {
      var topic = val(d, "topic", "Main Idea"), grade = val(d, "grade", "Grade 5");
      return "<h3>AI Video Studio — " + esc(topic) + "</h3><p class='muted'>" + esc(grade) + " · script + storyboard + production workflow</p>" +
        "<h4>Narration Script (excerpt)</h4><p>\"Today we'll learn how to find the main idea. The main idea is what a text is mostly about…\"</p>" +
        "<h4>Storyboard</h4>" + list(["Scene 1 — Hook (0:00–0:20): title + question", "Scene 2 — Teach (0:20–1:30): annotated example", "Scene 3 — Practice (1:30–2:20): guided try", "Scene 4 — Recap (2:20–2:45): summary + check"]) +
        "<h4>Image Prompts</h4>" + list(["Friendly classroom illustration, flat style", "Annotated paragraph close-up", "Student thinking with thought bubble"]) +
        "<h4>Production Workflow</h4><p>Slides in <b>Gamma/Canva</b> → avatar/voice in <b>Synthesia/HeyGen</b> → captions + transcript → review gate → publish. Voice: warm, mid-pace. Captions + transcript included.</p>" + review();
    }},
    interactive: { label: "Interactive Activity", mins: 40, build: function (d) {
      var kind = val(d, "kind", "Drag-and-Drop Matching"), topic = val(d, "topic", "vocabulary");
      return "<h3>Interactive: " + esc(kind) + "</h3><p class='muted'>Topic: " + esc(topic) + " · HTML/CSS/JS module</p>" +
        "<h4>Activity Design</h4>" + list(["Clear directions + example", "Immediate, specific feedback", "Self-check + progress save", "Keyboard-accessible, printable fallback"]) +
        "<h4>Generated Component (spec)</h4><p>A self-contained module using the portfolio's data-attribute components (e.g., <code>data-dnd</code>, <code>data-quiz</code>, <code>data-flashcards</code>) so it runs on any device with no dependencies.</p>" +
        "<h4>Preview</h4><p>Embeddable in any LMS; works offline after load.</p>" + review();
    }}
  };

  /* ===================== WORKSPACE (NL router) ===================== */
  function initWorkspace() {
    var log = document.querySelector("[data-ws-log]"); if (!log) return;
    var form = document.querySelector("[data-ws-form]"), input = form ? form.querySelector("input") : null;
    var hist = LS.get(KEY.hist, []);
    if (hist.length) hist.forEach(function (m) { add(m.who, m.html, true); });
    else add("coach", "Welcome to your Curriculum Studio. Tell me what to author — e.g., <i>“Build a Grade 5 ELA unit on informational reading”</i> or <i>“Generate a scope & sequence for Grade 7 math.”</i> I'll draft it; you refine and publish.", true);
    if (form) form.addEventListener("submit", function (e) { e.preventDefault(); var q = input.value.trim(); if (!q) return; add("user", esc(q)); input.value = ""; route(q); });
    document.querySelectorAll("[data-ws-suggest]").forEach(function (c) { c.addEventListener("click", function () { add("user", esc(c.textContent)); route(c.textContent); }); });
    var clr = document.querySelector("[data-ws-clear]"); if (clr) clr.addEventListener("click", function () { LS.set(KEY.hist, []); log.innerHTML = ""; add("coach", "Workspace cleared. What should we author next?", true); });

    function route(q) {
      var typing = add("coach", '<span class="chat-typing">✨ Drafting…</span>', false, true);
      setTimeout(function () { typing.remove(); var m = pick(q.toLowerCase()); var prev = GEN[m.gen] ? GEN[m.gen].build({ topic: topicFrom(q) }) : ""; add("coach", "Here's a starting <b>" + m.name + "</b>. Open the full tool to refine and publish." + (prev ? '<div class="card" style="margin-top:.7rem;padding:1rem;max-height:230px;overflow:hidden;position:relative;">' + prev + '<div style="position:absolute;left:0;right:0;bottom:0;height:50px;background:linear-gradient(transparent,var(--surface));"></div></div>' : "") + '<div style="margin-top:.7rem;"><a class="btn small" href="' + m.url + '">Open ' + m.name + " →</a></div>"); bump(GEN[m.gen] ? GEN[m.gen].mins : 25); }, 780);
    }
    function pick(lower) {
      var rules = [
        { k: ["scope", "sequence", "pacing", "map"], id: "scope-sequence.html", n: "Scope & Sequence Designer", g: "scope" },
        { k: ["unit"], id: "units.html", n: "Unit Planner", g: "unit" },
        { k: ["lesson"], id: "lessons.html", n: "Lesson Builder", g: "lesson" },
        { k: ["assess", "quiz", "test", "exit ticket"], id: "assessment.html", n: "Assessment Studio", g: "assessment" },
        { k: ["rubric"], id: "rubrics.html", n: "Rubric Generator", g: "rubric" },
        { k: ["video", "storyboard", "script"], id: "video-studio.html", n: "AI Video Studio", g: "video" },
        { k: ["interactive", "game", "drag", "flashcard"], id: "interactive-builder.html", n: "Interactive Learning Builder", g: "interactive" },
        { k: ["resource", "guide", "workbook", "organizer"], id: "resources.html", n: "Resource Generator", g: "resource" },
        { k: ["standard", "align", "crosswalk"], id: "standards.html", n: "Standards Alignment Studio", g: "" },
        { k: ["curriculum", "course", "program", "build"], id: "curriculum-builder.html", n: "Curriculum Builder", g: "curriculum" }
      ];
      for (var i = 0; i < rules.length; i++) for (var j = 0; j < rules[i].k.length; j++) if (lower.indexOf(rules[i].k[j]) > -1) return { url: rules[i].id, name: rules[i].n, gen: rules[i].g };
      return { url: "curriculum-builder.html", name: "Curriculum Builder", gen: "curriculum" };
    }
    function topicFrom(q) { var m = q.toLowerCase().match(/(?:on|about|for)\s+([a-z0-9 ,'-]{3,40})/); return m ? m[1].replace(/\b(grade \d+)\b/g, "").trim() : ""; }
    function add(who, html, instant, ret) { var d = document.createElement("div"); d.className = "chat-msg " + (who === "user" ? "user" : "coach"); d.innerHTML = '<span class="who">' + (who === "user" ? "You" : "AI Studio") + "</span>" + html; log.appendChild(d); log.scrollTop = log.scrollHeight; if (!ret) save(); return d; }
    function save() { var msgs = Array.prototype.map.call(log.querySelectorAll(".chat-msg"), function (m) { return { who: m.classList.contains("user") ? "user" : "coach", html: m.innerHTML.replace(/^<span class="who">[^<]*<\/span>/, "") }; }).slice(-10); LS.set(KEY.hist, msgs); }
  }

  /* ===================== COUNT-UP ===================== */
  function initCountUp() {
    var els = document.querySelectorAll("[data-count]"); if (!els.length) return;
    function go(el) { var t = parseFloat(el.getAttribute("data-count")), suf = el.getAttribute("data-suffix") || "", pre = el.getAttribute("data-prefix") || "", dur = 1000, start = null;
      function step(ts) { if (!start) start = ts; var p = Math.min((ts - start) / dur, 1); var v = t * (0.5 - Math.cos(p * Math.PI) / 2); el.textContent = pre + (t % 1 === 0 ? Math.round(v) : v.toFixed(1)) + suf; if (p < 1) requestAnimationFrame(step); } requestAnimationFrame(step); }
    if ("IntersectionObserver" in window) { var o = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { go(e.target); o.unobserve(e.target); } }); }, { threshold: 0.4 }); els.forEach(function (e) { o.observe(e); }); } else els.forEach(go);
  }

  /* ===================== RAIL ACTIVE ===================== */
  function renderRailActive() { var here = location.pathname.split("/").pop() || "workspace.html"; document.querySelectorAll(".rail-link").forEach(function (a) { if (a.getAttribute("href") === here) a.classList.add("active"); }); }

  window.ACS = { toast: toast, copy: copyText };
})();
