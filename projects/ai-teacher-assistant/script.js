/* =====================================================================
   AI Teacher Assistant Platform — interactivity engine
   Loads AFTER the shared portfolio.js. Adds the SaaS product behaviors:
     • Dark mode toggle (persists)
     • Command palette (Ctrl/⌘+K) + floating action button
     • Toast notifications + clipboard helper
     • Simulated AI generators (lesson, assessment, rubric, etc.)
     • Workspace natural-language router + conversation history
     • Resource Library (save/search) + Prompt Library favorites
     • Teacher dashboard count-up + "time saved" stats
   NOTE: All "AI" output is generated client-side from templates for
   demonstration. No data leaves the browser; storage is localStorage.
   ===================================================================== */
(function () {
  "use strict";

  /* ---------------- storage helpers ---------------- */
  var LS = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  var KEY = { theme: "ats:theme", lib: "ats:library", favs: "ats:favs", hist: "ats:history", stats: "ats:stats" };

  /* ---------------- tool registry (used by rail, palette, workspace) ---------------- */
  var TOOLS = [
    { id: "workspace",   name: "AI Workspace",            ico: "✨", url: "workspace.html",            desc: "Ask for anything", group: "Workspace" },
    { id: "lesson",      name: "Lesson Planner",          ico: "📝", url: "lesson-planner.html",        desc: "Daily, weekly, unit plans", group: "Plan & Create" },
    { id: "assessment",  name: "Assessment Generator",    ico: "🧪", url: "assessment-generator.html",  desc: "Quizzes, tests, exit tickets", group: "Plan & Create" },
    { id: "rubric",      name: "Rubric Builder",          ico: "📊", url: "rubric-builder.html",        desc: "Analytic & holistic rubrics", group: "Plan & Create" },
    { id: "diff",        name: "Differentiation",         ico: "🧩", url: "differentiation.html",       desc: "Adapt for every learner", group: "Plan & Create" },
    { id: "comm",        name: "Parent Communication",    ico: "✉️", url: "communication.html",         desc: "Newsletters & emails", group: "Communicate" },
    { id: "feedback",    name: "Student Feedback",        ico: "💬", url: "feedback.html",              desc: "Personalized feedback", group: "Communicate" },
    { id: "behavior",    name: "Behavior Documentation",  ico: "📋", url: "behavior.html",              desc: "Incidents & PBIS notes", group: "Communicate" },
    { id: "classroom",   name: "Classroom Management",    ico: "🪑", url: "classroom.html",             desc: "Seating, groups, routines", group: "Manage" },
    { id: "dashboard",   name: "Teacher Dashboard",       ico: "📈", url: "teacher-dashboard.html",     desc: "Your week at a glance", group: "Manage" },
    { id: "pd",          name: "PD Coach",                ico: "🎓", url: "pd-coach.html",              desc: "Grow your practice", group: "Grow" },
    { id: "prompts",     name: "Prompt Library",          ico: "📚", url: "prompt-library.html",        desc: "200+ teacher prompts", group: "Grow" },
    { id: "resources",   name: "Resource Library",        ico: "🗂️", url: "resource-library.html",      desc: "Everything you've saved", group: "Grow" },
    { id: "settings",    name: "Settings",                ico: "⚙️", url: "settings.html",              desc: "Preferences & integrations", group: "Grow" }
  ];

  function root() { var b = document.body; return b.getAttribute("data-project-root") || "./"; }

  /* ---------------- DOM ready ---------------- */
  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    buildChrome();        // palette + FAB + toast container
    initThemeToggle();
    initGenerators();
    initWorkspace();
    initFavorites();
    initLibrary();
    initStats();
    initCountUp();
    initChipToggles();
    renderRailActive();
  });

  /* ===================== THEME ===================== */
  function initTheme() {
    var saved = LS.get(KEY.theme, "light");
    if (saved === "dark") document.body.classList.add("ats-dark");
  }
  function initThemeToggle() {
    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      sync(btn);
      btn.addEventListener("click", function () {
        document.body.classList.toggle("ats-dark");
        var dark = document.body.classList.contains("ats-dark");
        LS.set(KEY.theme, dark ? "dark" : "light");
        document.querySelectorAll("[data-theme-toggle]").forEach(sync);
        toast(dark ? "🌙 Dark mode on" : "☀️ Light mode on", "info");
      });
    });
    function sync(btn) { btn.textContent = document.body.classList.contains("ats-dark") ? "☀️" : "🌙"; }
  }

  /* ===================== CHROME: palette + FAB + toasts ===================== */
  function buildChrome() {
    if (document.querySelector("[data-no-chrome]")) return;
    // toast container
    if (!document.querySelector(".toast-wrap")) {
      var tw = document.createElement("div"); tw.className = "toast-wrap"; document.body.appendChild(tw);
    }
    // FAB
    if (!document.querySelector(".fab")) {
      var fab = document.createElement("button");
      fab.className = "fab"; fab.type = "button"; fab.title = "Quick actions (Ctrl/⌘ + K)"; fab.setAttribute("aria-label", "Quick actions");
      fab.textContent = "✨";
      fab.addEventListener("click", openPalette);
      document.body.appendChild(fab);
    }
    // palette
    if (!document.querySelector(".cmdk")) {
      var ov = document.createElement("div"); ov.className = "cmdk"; ov.innerHTML =
        '<div class="cmdk-box" role="dialog" aria-label="Command palette">' +
        '<input class="cmdk-input" type="text" placeholder="Search tools, or type what you need…" aria-label="Command search">' +
        '<div class="cmdk-list"></div></div>';
      document.body.appendChild(ov);
      ov.addEventListener("click", function (e) { if (e.target === ov) closePalette(); });
    }
    bindPalette();
    document.addEventListener("keydown", function (e) {
      if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) { e.preventDefault(); openPalette(); }
      if (e.key === "Escape") closePalette();
    });
  }

  var palIndex = 0, palMatches = [];
  function paletteItems() {
    var r = root();
    var actions = TOOLS.map(function (t) { return { ico: t.ico, name: t.name, hint: t.desc, url: r + "projects/ai-teacher-assistant/" + t.url, local: t.url }; });
    // when already inside the project, use relative links
    var inProject = /ai-teacher-assistant/.test(location.pathname);
    if (inProject) actions = TOOLS.map(function (t) { return { ico: t.ico, name: t.name, hint: t.desc, url: t.url }; });
    return actions;
  }
  function bindPalette() {
    var input = document.querySelector(".cmdk-input");
    if (!input) return;
    input.addEventListener("input", function () { renderPalette(input.value); });
    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); palIndex = Math.min(palIndex + 1, palMatches.length - 1); hi(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); palIndex = Math.max(palIndex - 1, 0); hi(); }
      else if (e.key === "Enter") { var m = palMatches[palIndex]; if (m) location.href = m.url; }
    });
    function hi() {
      var items = document.querySelectorAll(".cmdk-item");
      items.forEach(function (el, i) { el.classList.toggle("active", i === palIndex); });
      if (items[palIndex]) items[palIndex].scrollIntoView({ block: "nearest" });
    }
  }
  function renderPalette(q) {
    var list = document.querySelector(".cmdk-list"); if (!list) return;
    q = (q || "").toLowerCase().trim();
    var all = paletteItems();
    palMatches = !q ? all : all.filter(function (a) { return (a.name + " " + a.hint).toLowerCase().indexOf(q) > -1; });
    palIndex = 0;
    if (!palMatches.length) { list.innerHTML = '<div class="cmdk-empty">No tools match — try “lesson”, “rubric”, or “parent email”.</div>'; return; }
    list.innerHTML = palMatches.map(function (a, i) {
      return '<a class="cmdk-item' + (i === 0 ? " active" : "") + '" href="' + a.url + '"><span class="ico">' + a.ico + '</span><span>' + a.name + '</span><small>' + a.hint + "</small></a>";
    }).join("");
  }
  function openPalette() {
    var ov = document.querySelector(".cmdk"); if (!ov) return;
    ov.classList.add("open"); renderPalette(""); var i = ov.querySelector(".cmdk-input"); if (i) { i.value = ""; i.focus(); }
  }
  function closePalette() { var ov = document.querySelector(".cmdk"); if (ov) ov.classList.remove("open"); }

  /* ===================== TOAST + CLIPBOARD ===================== */
  function toast(msg, kind) {
    var w = document.querySelector(".toast-wrap"); if (!w) return;
    var t = document.createElement("div"); t.className = "toast " + (kind || ""); t.textContent = msg;
    w.appendChild(t);
    setTimeout(function () { t.style.opacity = "0"; t.style.transition = "opacity .3s"; setTimeout(function () { t.remove(); }, 320); }, 2400);
  }
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { toast("📋 Copied to clipboard", "ok"); }, function () { toast("Copy failed", ""); });
    } else { toast("Clipboard unavailable", ""); }
  }

  /* ===================== STATS (time saved) ===================== */
  function getStats() { return LS.get(KEY.stats, { generations: 0, minutes: 0 }); }
  function bumpStats(minutes) {
    var s = getStats(); s.generations += 1; s.minutes += (minutes || 12); LS.set(KEY.stats, s); paintStats(); return s;
  }
  function paintStats() {
    var s = getStats();
    document.querySelectorAll("[data-stat=generations]").forEach(function (el) { el.textContent = s.generations; });
    document.querySelectorAll("[data-stat=minutes]").forEach(function (el) { el.textContent = s.minutes; });
    document.querySelectorAll("[data-stat=hours]").forEach(function (el) { el.textContent = (s.minutes / 60).toFixed(1); });
  }
  function initStats() { paintStats(); }

  /* ===================== RESOURCE LIBRARY ===================== */
  function libGet() { return LS.get(KEY.lib, []); }
  function libAdd(item) {
    var lib = libGet();
    item.id = "r" + lib.length + "_" + item.title.replace(/\W+/g, "").slice(0, 8);
    lib.unshift(item); LS.set(KEY.lib, lib); return item;
  }
  function initLibrary() {
    var wrap = document.querySelector("[data-library]"); if (!wrap) return;
    paintLibrary();
    var search = document.querySelector("[data-library-search]");
    if (search) search.addEventListener("input", function () { paintLibrary(search.value, currentFilter); });
    document.querySelectorAll("[data-library-filter] button").forEach(function (b) {
      b.addEventListener("click", function () {
        document.querySelectorAll("[data-library-filter] button").forEach(function (x) { x.classList.remove("active"); });
        b.classList.add("active"); currentFilter = b.getAttribute("data-filter");
        paintLibrary(search ? search.value : "", currentFilter);
      });
    });
  }
  var currentFilter = "all";
  function paintLibrary(q, filter) {
    var wrap = document.querySelector("[data-library]"); if (!wrap) return;
    q = (q || "").toLowerCase(); filter = filter || "all";
    var items = libGet().filter(function (it) {
      var okQ = !q || (it.title + " " + (it.body || "")).toLowerCase().indexOf(q) > -1;
      var okF = filter === "all" || it.type === filter;
      return okQ && okF;
    });
    if (!items.length) {
      wrap.innerHTML = '<div class="out-empty" style="height:auto;padding:2rem;"><div><div class="big">🗂️</div><p>Nothing saved yet. Generate something with any AI tool and press <b>Save to Library</b>.</p></div></div>';
      return;
    }
    var icons = { lesson: "📝", assessment: "🧪", rubric: "📊", diff: "🧩", comm: "✉️", feedback: "💬", behavior: "📋", classroom: "🪑", pd: "🎓", other: "📄" };
    wrap.innerHTML = items.map(function (it) {
      return '<div class="lib-item"><span class="l-ico">' + (icons[it.type] || "📄") + '</span>' +
        '<div class="l-body"><b>' + esc(it.title) + "</b><small>" + esc((it.body || "").slice(0, 90)) + "…</small></div>" +
        '<span class="l-tag">' + esc(it.type) + "</span></div>";
    }).join("");
  }

  /* ===================== PROMPT FAVORITES ===================== */
  function favGet() { return LS.get(KEY.favs, []); }
  function initFavorites() {
    var favs = favGet();
    document.querySelectorAll("[data-fav]").forEach(function (btn) {
      var id = btn.getAttribute("data-fav");
      if (favs.indexOf(id) > -1) btn.classList.add("on");
      btn.addEventListener("click", function () {
        var f = favGet(), i = f.indexOf(id);
        if (i > -1) { f.splice(i, 1); btn.classList.remove("on"); toast("Removed from favorites", ""); }
        else { f.push(id); btn.classList.add("on"); toast("⭐ Added to favorites", "ok"); }
        LS.set(KEY.favs, f);
      });
    });
    // copy-prompt buttons
    document.querySelectorAll("[data-copy-prompt]").forEach(function (btn) {
      btn.addEventListener("click", function () { copyText(btn.getAttribute("data-copy-prompt")); });
    });
  }

  /* ===================== CHIP TOGGLES ===================== */
  function initChipToggles() {
    document.querySelectorAll(".chip-toggle").forEach(function (c) {
      c.addEventListener("click", function () {
        if (c.hasAttribute("data-single")) {
          var set = c.parentElement.querySelectorAll(".chip-toggle");
          set.forEach(function (x) { x.classList.remove("on"); });
        }
        c.classList.toggle("on");
      });
    });
  }
  function chipVal(formEl, group) {
    var on = formEl.querySelectorAll('.chip-set[data-group="' + group + '"] .chip-toggle.on');
    return Array.prototype.map.call(on, function (c) { return c.textContent.trim(); });
  }

  /* ===================== RAIL ACTIVE ===================== */
  function renderRailActive() {
    var here = location.pathname.split("/").pop() || "workspace.html";
    document.querySelectorAll(".rail-link").forEach(function (a) {
      if (a.getAttribute("href") === here) a.classList.add("active");
    });
  }

  /* ===================== GENERATORS ===================== */
  function initGenerators() {
    document.querySelectorAll("[data-generator]").forEach(function (form) {
      var type = form.getAttribute("data-generator");
      var out = document.querySelector('[data-output="' + type + '"]') || form.parentElement.querySelector(".gen-output");
      var lastData = null;
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        lastData = collect(form);
        run(type, lastData, out);
      });
      // toolbar buttons (delegated)
      if (out) out.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-act]"); if (!btn) return;
        var act = btn.getAttribute("data-act");
        var body = out.querySelector(".out-body");
        if (act === "copy") copyText(body ? body.innerText : "");
        else if (act === "regen") run(type, lastData || collect(form), out);
        else if (act === "save") {
          if (!body || !body.innerText.trim()) { toast("Generate something first", ""); return; }
          var title = (lastData && (lastData.topic || lastData.subject || lastData.title)) || GEN[type].label;
          libAdd({ type: type, title: title + " — " + GEN[type].label, body: body.innerText });
          toast("💾 Saved to Resource Library", "ok");
        }
      });
    });
  }
  function collect(form) {
    var data = {};
    form.querySelectorAll("input[name], select[name], textarea[name]").forEach(function (f) { data[f.name] = f.value; });
    form.querySelectorAll(".chip-set[data-group]").forEach(function (cs) {
      data[cs.getAttribute("data-group")] = chipVal(form, cs.getAttribute("data-group"));
    });
    return data;
  }
  function run(type, data, out) {
    if (!out) return;
    var body = out.querySelector(".out-body");
    var bar = out.querySelector(".out-toolbar");
    if (bar) bar.querySelectorAll("[data-act]").forEach(function (b) { b.disabled = true; });
    if (body) body.innerHTML = '<div class="gen-loading"><div class="ai-pill">✨ AI is drafting…</div>' +
      '<div class="shimmer w90"></div><div class="shimmer"></div><div class="shimmer w70"></div><div class="shimmer w50"></div><div class="shimmer w90"></div><div class="shimmer w70"></div></div>';
    var delay = 650 + Math.min((JSON.stringify(data).length || 30) * 3, 700);
    setTimeout(function () {
      if (body) body.innerHTML = GEN[type].build(data);
      if (bar) bar.querySelectorAll("[data-act]").forEach(function (b) { b.disabled = false; });
      bumpStats(GEN[type].mins);
      toast("✨ Draft ready — review & edit before use", "ok");
    }, delay);
  }

  /* ---- small content helpers ---- */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function pick(arr, i) { return arr[i % arr.length]; }
  function val(d, k, fb) { return d && d[k] ? d[k] : fb; }
  function list(items) { return "<ul>" + items.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</ul>"; }
  function reviewNote() { return '<p class="muted" style="margin-top:1rem;font-size:.85rem;"><span class="ai-pill">👤 Human-in-the-loop</span> AI draft — review for accuracy, standards fit, and your students before using.</p>'; }

  /* ---- the generator templates ---- */
  var GEN = {
    lesson: { label: "Lesson Plan", mins: 35, build: function (d) {
      var subj = val(d, "subject", "ELA"), grade = val(d, "grade", "Grade 5"), topic = val(d, "topic", "Main Idea & Supporting Details"), mins = val(d, "duration", "45");
      var obj = d.objective || ("Students will identify and explain " + topic.toLowerCase() + " using evidence from a grade-level text.");
      return "<h3>" + esc(topic) + "</h3><p class='muted'>" + esc(grade) + " · " + esc(subj) + " · " + esc(mins) + " min</p>" +
        "<h4>Learning Objective</h4><p>" + esc(obj) + "</p>" +
        "<h4>Essential Question</h4><p>How does " + esc(topic.toLowerCase()) + " help us understand what we read and learn?</p>" +
        "<h4>Success Criteria</h4>" + list(["I can define " + esc(topic.toLowerCase()) + " in my own words.", "I can find evidence that supports my thinking.", "I can explain my reasoning to a partner."]) +
        "<h4>Bell Ringer (5 min)</h4><p>Quick-write: students respond to a hook prompt connected to " + esc(topic.toLowerCase()) + ".</p>" +
        "<h4>Hook / Engagement (5 min)</h4><p>Show a short, relevant clip or image; students turn-and-talk about what they notice and wonder.</p>" +
        "<h4>Mini-Lesson — I Do (10 min)</h4><p>Model the skill with a think-aloud, annotating a shared text and naming each move.</p>" +
        "<h4>Guided Practice — We Do (10 min)</h4><p>Class works a second example together; teacher releases responsibility gradually.</p>" +
        "<h4>Independent Practice — You Do (10 min)</h4><p>Students apply the skill to a new passage; teacher confers with small groups.</p>" +
        "<h4>Closure (5 min)</h4><p>Students summarize their learning and rate confidence (fist-to-five).</p>" +
        "<h4>Exit Ticket</h4><p>One question that checks the objective directly; use results to plan tomorrow.</p>" +
        "<h4>Differentiation</h4>" + list(["<b>Support:</b> sentence frames, partner reading, reduced text.", "<b>Core:</b> grade-level passage with guiding questions.", "<b>Extension:</b> compare two texts and justify with evidence."]) +
        "<h4>Materials</h4><p>Shared text, annotation tools, exit-ticket slip, anchor chart.</p>" + reviewNote();
    }},
    assessment: { label: "Assessment", mins: 40, build: function (d) {
      var topic = val(d, "topic", "Ecosystems"), grade = val(d, "grade", "Grade 6"), n = parseInt(val(d, "count", "5"), 10) || 5;
      var types = (d.types && d.types.length) ? d.types : ["Multiple choice"];
      var out = "<h3>" + esc(topic) + " — Assessment</h3><p class='muted'>" + esc(grade) + " · " + esc(types.join(", ")) + " · aligned to grade-level standards</p>";
      var dok = ["DOK 1 · Recall", "DOK 2 · Skill/Concept", "DOK 2 · Skill/Concept", "DOK 3 · Strategic Thinking", "DOK 3 · Strategic Thinking", "DOK 4 · Extended"];
      var blooms = ["Remember", "Understand", "Apply", "Analyze", "Evaluate", "Create"];
      var key = [];
      out += "<ol>";
      for (var i = 0; i < n; i++) {
        var b = pick(blooms, i), dk = pick(dok, i);
        if (i % 3 === 2) { // short answer / constructed
          out += "<li><b>[" + b + " · " + dk + "]</b> Explain, using evidence, one way " + esc(topic.toLowerCase()) + " connects to a real-world example.<br><i>Scoring:</i> 2 pts — clear claim + relevant evidence.</li>";
          key.push((i + 1) + ". Constructed response — see 2-pt scoring guide.");
        } else {
          out += "<li><b>[" + b + " · " + dk + "]</b> Which statement about " + esc(topic.toLowerCase()) + " is most accurate?" +
            "<br>A) distractor &nbsp; B) <b>correct</b> &nbsp; C) distractor &nbsp; D) distractor</li>";
          key.push((i + 1) + ". B");
        }
      }
      out += "</ol><h4>Answer Key</h4>" + list(key) +
        "<h4>Standards & Rigor</h4>" + list(["Bloom's range: Remember → " + (n >= 4 ? "Evaluate/Create" : "Apply"), "DOK 1–3 balanced for the grade", "Items are passage/context-based, not decontextualized recall"]) + reviewNote();
      return out;
    }},
    rubric: { label: "Rubric", mins: 30, build: function (d) {
      var task = val(d, "task", "Argumentative Essay"), style = val(d, "style", "Analytic");
      var crit = (d.criteria && d.criteria.length) ? d.criteria : ["Claim & Focus", "Evidence & Support", "Organization", "Conventions"];
      var levels = ["4 — Exceeds", "3 — Meets", "2 — Approaching", "1 — Beginning"];
      var out = "<h3>" + esc(task) + " — " + esc(style) + " Rubric</h3>";
      if (style === "Holistic") {
        out += list(levels.map(function (lv) { return "<b>" + lv + ":</b> Overall description of work at this level across all criteria."; }));
      } else {
        out += '<div class="table-wrap"><table><thead><tr><th>Criterion</th><th>4 Exceeds</th><th>3 Meets</th><th>2 Approaching</th><th>1 Beginning</th></tr></thead><tbody>';
        crit.forEach(function (c) {
          out += "<tr><td><b>" + esc(c) + "</b></td><td>Sophisticated, consistent control.</td><td>Clear and effective.</td><td>Developing; some gaps.</td><td>Limited; needs support.</td></tr>";
        });
        out += "</tbody></table></div>";
      }
      out += "<h4>Scoring</h4><p>Total possible: " + (crit.length * 4) + " points. Convert to standards-based level or percentage as needed.</p>" + reviewNote();
      return out;
    }},
    diff: { label: "Differentiation", mins: 28, build: function (d) {
      var act = val(d, "activity", "a reading response on the day's text");
      var tiers = (d.learners && d.learners.length) ? d.learners : ["Below grade level", "On grade level", "Advanced", "ELL", "Students with disabilities"];
      var map = {
        "Below grade level": ["Pre-teach key vocabulary with visuals.", "Chunk the task; provide a partially completed model.", "Offer sentence starters and a word bank."],
        "On grade level": ["Provide the core task with a clear checklist.", "Add one guiding question to deepen thinking.", "Use a peer check-in midway."],
        "Advanced": ["Add an extension that requires synthesis across sources.", "Ask for a counterargument or alternative solution.", "Invite a student-created assessment item."],
        "ELL": ["Pair visuals with text; allow native-language brainstorming.", "Provide a bilingual glossary and sentence frames.", "Reduce language load while keeping rigor."],
        "Students with disabilities": ["Offer choice of response mode (type, speak, draw).", "Provide extended time and chunked directions.", "Align supports to IEP/504 accommodations."],
        "Gifted learners": ["Compact the task; move to open-ended inquiry.", "Offer a real-world audience or product.", "Encourage self-directed goal-setting."]
      };
      var out = "<h3>Differentiated Plan</h3><p class='muted'>Base activity: " + esc(act) + "</p>";
      tiers.forEach(function (t) { out += "<h4>" + esc(t) + "</h4>" + list(map[t] || ["Targeted scaffold.", "Flexible grouping.", "Check for understanding."]); });
      out += "<h4>Flexible Grouping</h4><p>Rotate small groups by readiness for this skill; regroup tomorrow based on the exit ticket.</p>" + reviewNote();
      return out;
    }},
    comm: { label: "Parent Message", mins: 18, build: function (d) {
      var kind = val(d, "kind", "Weekly Newsletter"), student = val(d, "student", "your child"), tone = val(d, "tone", "Warm & professional"), topic = val(d, "topic", "this week's learning");
      var subjectLine = { "Weekly Newsletter": "This Week in Our Classroom", "Positive Note": "A Quick Celebration about " + student, "Academic Concern": "Checking In About " + student + "'s Progress", "Behavior Update": "A Note About " + student + "'s Day", "Conference Invitation": "Invitation: Let's Connect About " + student }[kind] || kind;
      var bodyMap = {
        "Weekly Newsletter": "<p>Dear Families,</p><p>Here's a snapshot of " + esc(topic) + ". We focused on key skills, practiced together, and reflected on our growth.</p><p><b>You can help at home by:</b> asking your child to teach you one thing they learned, and reading together for 15 minutes.</p>",
        "Positive Note": "<p>Dear Family,</p><p>I wanted to share something wonderful: " + esc(student) + " showed real strength in " + esc(topic) + " this week — persistence, kindness, and pride in their work. Thank you for your support at home.</p>",
        "Academic Concern": "<p>Dear Family,</p><p>I'm reaching out with care about " + esc(student) + "'s progress in " + esc(topic) + ". I've noticed some areas we can strengthen together, and I'm confident in a clear plan: targeted practice in class plus a few supports at home.</p><p>Could we find a time to talk this week?</p>",
        "Behavior Update": "<p>Dear Family,</p><p>I want to keep you informed about " + esc(student) + "'s day. Here are the facts, the support I provided, and our restorative next step. My goal is partnership, not punishment.</p>",
        "Conference Invitation": "<p>Dear Family,</p><p>I'd love to connect about " + esc(student) + "'s growth in " + esc(topic) + ". Please let me know a time that works — I'm happy to meet in person, by phone, or online.</p>"
      };
      return "<h3>" + esc(kind) + "</h3><p class='muted'>Tone: " + esc(tone) + "</p>" +
        "<p><b>Subject:</b> " + esc(subjectLine) + "</p>" + (bodyMap[kind] || bodyMap["Weekly Newsletter"]) +
        "<p>Warm regards,<br>[Your name]</p>" +
        "<h4>Translation-ready</h4><p class='muted'>Keep sentences short and concrete for easy translation and accessibility.</p>" + reviewNote();
    }},
    feedback: { label: "Student Feedback", mins: 15, build: function (d) {
      var area = val(d, "area", "Writing"), level = val(d, "level", "Meets expectations"), name = val(d, "student", "Student");
      return "<h3>Feedback — " + esc(area) + "</h3><p class='muted'>For: " + esc(name) + " · Level: " + esc(level) + "</p>" +
        "<h4>🌟 Strengths (Glow)</h4>" + list(["You clearly showed effort and growth in " + esc(area.toLowerCase()) + ".", "Your ideas are developing — I can see your thinking."]) +
        "<h4>🎯 Next Steps (Grow)</h4>" + list(["Focus next on one specific, actionable skill.", "Try the strategy we practiced; I'll check in with you."]) +
        "<h4>💪 Growth-Mindset Note</h4><p>You're not there <i>yet</i> — and that's exactly where learning happens. Keep going; I'm proud of your progress.</p>" + reviewNote();
    }},
    behavior: { label: "Behavior Documentation", mins: 20, build: function (d) {
      var kind = val(d, "kind", "Incident Report"), student = val(d, "student", "Student"), summary = val(d, "summary", "a classroom disruption during independent work");
      return "<h3>" + esc(kind) + "</h3><p class='muted'>Student: " + esc(student) + " · Date: [auto] · Objective, factual record</p>" +
        "<h4>What happened (facts only)</h4><p>" + esc(summary) + ". Description avoids labels or judgment and records observable behavior.</p>" +
        "<h4>Antecedent</h4><p>What occurred immediately before (context, trigger).</p>" +
        "<h4>Response & Support</h4>" + list(["De-escalation / proximity used.", "Student given a reset and choice.", "Restorative conversation scheduled."]) +
        "<h4>Restorative Next Step</h4><p>Repair-focused conversation: name impact, make it right, plan for next time.</p>" +
        "<h4>Family Summary (shareable)</h4><p>Neutral, partnership-oriented summary suitable to send home.</p>" + reviewNote();
    }},
    classroom: { label: "Classroom Plan", mins: 16, build: function (d) {
      var need = val(d, "need", "Grouping Suggestions"), size = val(d, "size", "24");
      var map = {
        "Seating Chart": "<p>Generate a seating arrangement that balances focus and collaboration for " + esc(size) + " students.</p>" + list(["Front-load students who benefit from proximity.", "Mix readiness within table groups.", "Keep clear sightlines and traffic paths."]),
        "Grouping Suggestions": "<p>Flexible groups of 3–4 for " + esc(size) + " students, balanced by readiness and collaboration skills.</p>" + list(["6 heterogeneous groups with defined roles.", "Rotate roles weekly (facilitator, recorder, reporter, checker).", "Plan a quick regroup based on today's exit ticket."]),
        "Class Routines": list(["Entry routine: bell ringer posted, materials ready.", "Transition signal with a 10-second countdown.", "Exit routine: clean, reflect, line up by group."]),
        "Icebreakers": list(["Two Truths & a Goal.", "Find Someone Who… (academic version).", "Appointment clock partners for the week."]),
        "Morning Meeting": list(["Greeting (30s partner share).", "Share (connect to today's learning).", "Activity (team-builder).", "Message (the day's purpose)."])
      };
      return "<h3>" + esc(need) + "</h3>" + (map[need] || map["Grouping Suggestions"]) +
        "<h4>Norms</h4><p>Co-create 3–5 positively framed norms with students; revisit weekly.</p>" + reviewNote();
    }},
    pd: { label: "PD Plan", mins: 22, build: function (d) {
      var goal = val(d, "goal", "increase student discourse"), area = val(d, "area", "Engagement");
      return "<h3>Coaching Plan — " + esc(area) + "</h3><p class='muted'>Goal: " + esc(goal) + "</p>" +
        "<h4>Recommended Strategies</h4>" + list(["Try one high-leverage move (e.g., Think-Pair-Share, cold call with wait time).", "Use a discussion protocol to distribute participation.", "Track talk-time for one week as a baseline."]) +
        "<h4>Suggested Resources</h4>" + list(["Reading: a short practitioner article on " + esc(area.toLowerCase()) + ".", "Video: a model lesson clip.", "Micro-course: a 30-minute self-paced module."]) +
        "<h4>Reflection Prompts</h4>" + list(["What did students do and say?", "What will I adjust next time?", "What evidence shows impact?"]) +
        "<h4>PLC Discussion</h4><p>Bring a student-work sample tied to " + esc(goal) + " to your next PLC.</p>" + reviewNote();
    }}
  };

  /* ===================== WORKSPACE (natural-language router) ===================== */
  function initWorkspace() {
    var log = document.querySelector("[data-ws-log]"); if (!log) return;
    var form = document.querySelector("[data-ws-form]");
    var input = form ? form.querySelector("input") : null;
    // restore history
    var hist = LS.get(KEY.hist, []);
    if (hist.length) hist.forEach(function (m) { addMsg(m.who, m.text, true); });
    else addMsg("coach", "Hi! I'm your AI teaching assistant. Tell me what you need — for example, <i>“Create tomorrow's lesson on fractions”</i> or <i>“Write a positive note to a parent.”</i> I'll draft it; you stay the decision-maker.", true);

    if (form) form.addEventListener("submit", function (e) {
      e.preventDefault();
      var q = input.value.trim(); if (!q) return;
      addMsg("user", esc(q)); input.value = "";
      route(q);
    });
    document.querySelectorAll("[data-ws-suggest]").forEach(function (chip) {
      chip.addEventListener("click", function () { addMsg("user", esc(chip.textContent)); route(chip.textContent); });
    });

    function route(q) {
      var lower = q.toLowerCase();
      var typing = addMsg("coach", '<span class="chat-typing">✨ Thinking…</span>', false, true);
      setTimeout(function () {
        typing.remove();
        var match = pickTool(lower);
        var reply = "Here's a starting draft for <b>" + match.name + "</b>. Open the full tool to refine inputs, then save it to your Resource Library.";
        var preview = previewFor(match.id, lower);
        addMsg("coach", reply + preview + '<div style="margin-top:.7rem;"><a class="btn small" href="' + match.url + '">Open ' + match.name + " →</a></div>");
        bumpStats(GEN[match.genKey] ? GEN[match.genKey].mins : 12);
      }, 750);
    }
    function pickTool(lower) {
      var rules = [
        { k: ["lesson", "plan", "teach tomorrow", "unit"], id: "lesson", gen: "lesson" },
        { k: ["quiz", "test", "assessment", "exit ticket", "questions"], id: "assessment", gen: "assessment" },
        { k: ["rubric", "scoring", "grade scale"], id: "rubric", gen: "rubric" },
        { k: ["different", "adapt", "scaffold", "ell", "iep"], id: "diff", gen: "diff" },
        { k: ["parent", "email", "newsletter", "family", "message"], id: "comm", gen: "comm" },
        { k: ["feedback", "comment", "glow", "grow"], id: "feedback", gen: "feedback" },
        { k: ["behavior", "incident", "referral", "restorative"], id: "behavior", gen: "behavior" },
        { k: ["seat", "group", "routine", "icebreaker", "transition"], id: "classroom", gen: "classroom" },
        { k: ["coach", "pd", "professional", "strategy", "grow my"], id: "pd", gen: "pd" }
      ];
      for (var i = 0; i < rules.length; i++) {
        for (var j = 0; j < rules[i].k.length; j++) if (lower.indexOf(rules[i].k[j]) > -1) {
          var t = TOOLS.filter(function (x) { return x.id === rules[i].id; })[0]; t.genKey = rules[i].gen; return t;
        }
      }
      var ws = TOOLS[1]; ws.genKey = "lesson"; return ws;
    }
    function previewFor(id, lower) {
      try {
        var key = { lesson: "lesson", assessment: "assessment", rubric: "rubric", diff: "diff", comm: "comm", feedback: "feedback", behavior: "behavior", classroom: "classroom", pd: "pd" }[id];
        if (!key || !GEN[key]) return "";
        var html = GEN[key].build({ topic: extractTopic(lower) });
        // show first ~2 sections only as a preview
        return '<div class="card" style="margin-top:.7rem;padding:1rem;max-height:230px;overflow:hidden;position:relative;">' + html + '<div style="position:absolute;left:0;right:0;bottom:0;height:50px;background:linear-gradient(transparent,var(--surface));"></div></div>';
      } catch (e) { return ""; }
    }
    function extractTopic(lower) {
      var m = lower.match(/(?:on|about|for)\s+([a-z0-9 ,'-]{3,40})/);
      return m ? m[1].replace(/\b(tomorrow|today|grade \d+)\b/g, "").trim() : "";
    }
    function addMsg(who, html, instant, returnEl) {
      var div = document.createElement("div");
      div.className = "chat-msg " + (who === "user" ? "user" : "coach");
      div.innerHTML = '<span class="who">' + (who === "user" ? "You" : "AI Assistant") + "</span>" + html;
      log.appendChild(div); log.scrollTop = log.scrollHeight;
      if (!instant && who !== "user" && !returnEl) saveHist();
      if (who === "user") saveHist();
      return div;
    }
    function saveHist() {
      var msgs = Array.prototype.map.call(log.querySelectorAll(".chat-msg"), function (m) {
        return { who: m.classList.contains("user") ? "user" : "coach", text: m.innerHTML.replace(/^<span class="who">[^<]*<\/span>/, "") };
      }).slice(-12);
      LS.set(KEY.hist, msgs);
    }
    var clearBtn = document.querySelector("[data-ws-clear]");
    if (clearBtn) clearBtn.addEventListener("click", function () { LS.set(KEY.hist, []); log.innerHTML = ""; addMsg("coach", "Conversation cleared. What would you like to create?", true); });
  }

  /* ===================== COUNT-UP (dashboard) ===================== */
  function initCountUp() {
    var els = document.querySelectorAll("[data-count]"); if (!els.length) return;
    function go(el) {
      var target = parseFloat(el.getAttribute("data-count")), suf = el.getAttribute("data-suffix") || "", dur = 1000, start = null;
      function step(ts) { if (!start) start = ts; var p = Math.min((ts - start) / dur, 1);
        var v = target * (0.5 - Math.cos(p * Math.PI) / 2);
        el.textContent = (target % 1 === 0 ? Math.round(v) : v.toFixed(1)) + suf; if (p < 1) requestAnimationFrame(step); }
      requestAnimationFrame(step);
    }
    if ("IntersectionObserver" in window) {
      var o = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { go(e.target); o.unobserve(e.target); } }); }, { threshold: 0.4 });
      els.forEach(function (e) { o.observe(e); });
    } else els.forEach(go);
  }

  /* expose a tiny API for inline use if needed */
  window.ATS = { toast: toast, copy: copyText };
})();
