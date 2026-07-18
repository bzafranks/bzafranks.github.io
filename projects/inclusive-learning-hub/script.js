/* =====================================================================
   Inclusive Learning Hub — interactivity engine
   ---------------------------------------------------------------------
   Load order on every page: mock-data.js  →  ../../assets/js/portfolio.js
   (or ../../../assets/js/portfolio.js from role folders)  →  script.js

   CONVENTIONS FOR PAGE AUTHORS
   ----------------------------
   <body data-role="admin|teacher|parent|student|para|therapist"
         data-active="<nav-item-id>"
         data-project-root="../../../">   (root-relative path back to repo root;
                                            "../../" for index/demo/project-overview,
                                            "../../../" for role & shared subfolders)
     <header class="site-header">...</header>
     <main id="main">
       <div class="app-shell">
         <aside class="app-rail" id="appRail"></aside>   <!-- auto-filled -->
         <section class="app-main">
           <div class="app-bar">
             <div class="crumb">...</div>
             <div class="app-actions" id="hdrTools"></div>  <!-- auto-filled: search/notif/msgs/role-switch/help/theme -->
           </div>
           ...page content, using data-* hooks below...
         </section>
       </div>
     </main>

   Reusable hooks:
     [data-tabs] wrapping .tab-btns/.tab-btn[data-tab] + .tab-panel[data-tab-panel]
     [data-modal-open="id"] / <div class="modal-overlay" id="id">...
     [data-drawer-open="id"] / <div class="drawer-overlay" id="id">...
     [data-table] on .data-table-wrap — enables search input[data-table-search],
       select[data-table-filter="col"], th.sortable[data-col]
     [data-toast="ok|info|warn"] on a button -> shows toast with button's text
     [data-form-mock] on <form> -> preventDefault, toast "Saved" (or data-success-msg)
     [data-chart="bar|donut|heatmap|trend"] canvasless chart builders (see renderCharts)
     [data-schedule] weekly grid — see initSchedule()
   ===================================================================== */
(function () {
  "use strict";
  var D = window.ILH;

  var LS = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  var KEY = { theme: "ilh:theme", a11y: "ilh:a11y" };

  function root() { return document.body.getAttribute("data-project-root") || "../../"; }
  function base() { return root() + "projects/inclusive-learning-hub/"; }
  function qs(name) { var m = new RegExp("[?&]" + name + "=([^&]+)").exec(location.search); return m ? decodeURIComponent(m[1]) : null; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* ===================== NAV REGISTRY ===================== */
  var NAV = {
    admin: [
      { group: "", items: [{ id: "dashboard", label: "Dashboard", ico: "📊", url: "dashboard.html" }] },
      { group: "People", items: [
        { id: "students", label: "Students", ico: "🧑‍🎓", url: "students.html" },
        { id: "admissions", label: "Admissions", ico: "📝", url: "admissions.html" },
        { id: "staff", label: "Staff", ico: "🧑‍🏫", url: "staff.html" }
      ]},
      { group: "Instruction", items: [
        { id: "courses", label: "Courses", ico: "📚", url: "courses.html" },
        { id: "curriculum", label: "Curriculum", ico: "🗂️", url: "curriculum.html" },
        { id: "scheduling", label: "Scheduling", ico: "🗓️", url: base() + "shared/scheduling.html?view=room&id=Room%20214" },
        { id: "attendance", label: "Attendance", ico: "✅", url: "attendance.html" }
      ]},
      { group: "Student Support", items: [
        { id: "individual-plans", label: "Individual Plans", ico: "🧩", url: "individual-plans.html" },
        { id: "therapy-services", label: "Therapy Services", ico: "🩺", url: "therapy-services.html" },
        { id: "student-support", label: "Student Support", ico: "🤝", url: "student-support.html" }
      ]},
      { group: "Data", items: [
        { id: "assessments", label: "Assessments", ico: "🧪", url: "assessments.html" },
        { id: "reports", label: "Reports", ico: "📈", url: "reports.html" }
      ]},
      { group: "Operations", items: [
        { id: "communications", label: "Communications", ico: "✉️", url: "communications.html" },
        { id: "billing", label: "Billing", ico: "💳", url: "billing.html" },
        { id: "transportation", label: "Transportation", ico: "🚌", url: "transportation.html" },
        { id: "settings", label: "Settings", ico: "⚙️", url: "settings.html" }
      ]}
    ],
    teacher: [
      { group: "", items: [{ id: "dashboard", label: "Dashboard", ico: "📊", url: "dashboard.html" }] },
      { group: "Teach", items: [
        { id: "my-classes", label: "My Classes", ico: "🏫", url: "my-classes.html" },
        { id: "lesson-planner", label: "Lesson Planner", ico: "📝", url: "lesson-planner.html" },
        { id: "assignments", label: "Assignments", ico: "📋", url: "assignments.html" },
        { id: "assessments", label: "Assessments", ico: "🧪", url: "assessments.html" },
        { id: "gradebook", label: "Gradebook", ico: "🗒️", url: "gradebook.html" }
      ]},
      { group: "Support Every Learner", items: [
        { id: "students", label: "Students", ico: "🧑‍🎓", url: "students.html" },
        { id: "progress-monitoring", label: "Progress Monitoring", ico: "📈", url: "progress-monitoring.html" },
        { id: "accommodations", label: "Accommodations", ico: "🧩", url: "accommodations.html" }
      ]},
      { group: "", items: [
        { id: "resources", label: "Resources", ico: "🗂️", url: "resources.html" },
        { id: "messages", label: "Messages", ico: "✉️", url: "messages.html" },
        { id: "calendar", label: "Calendar", ico: "🗓️", url: base() + "shared/scheduling.html?view=teacher&id=T1" }
      ]}
    ],
    parent: [
      { group: "", items: [{ id: "overview", label: "Overview", ico: "🏠", url: "overview.html" }] },
      { group: "Jordan's Progress", items: [
        { id: "academic-progress", label: "Academic Progress", ico: "📈", url: "academic-progress.html" },
        { id: "assignments", label: "Assignments", ico: "📋", url: "assignments.html" },
        { id: "attendance", label: "Attendance", ico: "✅", url: "attendance.html" },
        { id: "goals", label: "Individual Goals", ico: "🎯", url: "goals.html" },
        { id: "therapy-services", label: "Therapy Services", ico: "🩺", url: "therapy-services.html" }
      ]},
      { group: "Connect", items: [
        { id: "schedule", label: "Schedule", ico: "🗓️", url: base() + "shared/scheduling.html?view=student&id=S01" },
        { id: "messages", label: "Messages", ico: "✉️", url: "messages.html" },
        { id: "reports", label: "Reports", ico: "📄", url: "reports.html" },
        { id: "forms", label: "Forms", ico: "🖊️", url: "forms.html" },
        { id: "payments", label: "Payments", ico: "💳", url: "payments.html" },
        { id: "resources", label: "Resources", ico: "🗂️", url: "resources.html" }
      ]}
    ],
    student: [
      { group: "", items: [{ id: "home", label: "Home", ico: "🏠", url: "home.html" }] },
      { group: "", items: [
        { id: "my-courses", label: "My Courses", ico: "📚", url: "my-courses.html" },
        { id: "assignments", label: "Assignments", ico: "📋", url: "assignments.html" },
        { id: "calendar", label: "Calendar", ico: "🗓️", url: base() + "shared/scheduling.html?view=student&id=S01" },
        { id: "goals", label: "Goals", ico: "🎯", url: "goals.html" },
        { id: "progress", label: "Progress", ico: "📈", url: "progress.html" },
        { id: "messages", label: "Messages", ico: "✉️", url: "messages.html" },
        { id: "resources", label: "Resources", ico: "🗂️", url: "resources.html" }
      ]}
    ],
    para: [
      { group: "", items: [{ id: "dashboard", label: "Dashboard", ico: "📊", url: "dashboard.html" }] },
      { group: "", items: [
        { id: "my-schedule", label: "My Schedule", ico: "🗓️", url: base() + "shared/scheduling.html?view=para&id=P1" },
        { id: "assigned-students", label: "Assigned Students", ico: "🧑‍🎓", url: "assigned-students.html" },
        { id: "support-tasks", label: "Support Tasks", ico: "✅", url: "support-tasks.html" },
        { id: "data-collection", label: "Data Collection", ico: "🧮", url: "data-collection.html" },
        { id: "notes", label: "Notes", ico: "🗒️", url: "notes.html" },
        { id: "messages", label: "Messages", ico: "✉️", url: "messages.html" },
        { id: "resources", label: "Resources", ico: "🗂️", url: "resources.html" }
      ]}
    ],
    therapist: [
      { group: "", items: [{ id: "dashboard", label: "Dashboard", ico: "📊", url: "dashboard.html" }] },
      { group: "Caseload", items: [
        { id: "caseload", label: "Caseload", ico: "🧑‍🎓", url: "caseload.html" },
        { id: "schedule", label: "Schedule", ico: "🗓️", url: base() + "shared/scheduling.html?view=therapist&id=TH1" },
        { id: "virtual-sessions", label: "Virtual Sessions", ico: "💻", url: "virtual-sessions.html" }
      ]},
      { group: "Clinical", items: [
        { id: "goals", label: "Goals", ico: "🎯", url: "goals.html" },
        { id: "session-notes", label: "Session Notes", ico: "🗒️", url: "session-notes.html" },
        { id: "service-minutes", label: "Service Minutes", ico: "⏱️", url: "service-minutes.html" }
      ]},
      { group: "", items: [
        { id: "reports", label: "Reports", ico: "📈", url: "reports.html" },
        { id: "messages", label: "Messages", ico: "✉️", url: "messages.html" },
        { id: "resources", label: "Resources", ico: "🗂️", url: "resources.html" }
      ]}
    ]
  };

  var ROLE_META = {
    admin: { label: "Administrator", ico: "🛠️", who: "Michael Torres", dash: "admin/dashboard.html" },
    teacher: { label: "Teacher", ico: "🍎", who: "Patricia Nguyen", dash: "teacher/dashboard.html" },
    parent: { label: "Parent", ico: "👪", who: "Maria Thompson", dash: "parent/overview.html" },
    student: { label: "Student", ico: "🎒", who: "Jordan Thompson", dash: "student/home.html" },
    para: { label: "Paraprofessional", ico: "🧑‍🏫", who: "Priya Patel", dash: "para/dashboard.html" },
    therapist: { label: "Therapist", ico: "🩺", who: "Emily Castillo", dash: "therapist/dashboard.html" }
  };

  /* ===================== BOOT ===================== */
  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    buildRail();
    buildHeaderTools();
    initThemeToggleBtns();
    initA11yToolbar();
    initTabs();
    initModalsDrawers();
    initToastButtons();
    initMockForms();
    initTables();
    initAccordSafety();
    renderCharts();
    initSchedule();
    initGoalRings();
    initStudyTimer();
    initTaskChecklist();
    initPromptScale();
    initRespondChooser();
    initAltFormatsModal();
  });

  /* ===================== THEME ===================== */
  function initTheme() {
    if (LS.get(KEY.theme, "light") === "dark") document.body.classList.add("ilh-dark");
  }
  function setDark(on) {
    document.body.classList.toggle("ilh-dark", on);
    LS.set(KEY.theme, on ? "dark" : "light");
    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) { b.textContent = on ? "☀️" : "🌙"; });
    document.querySelectorAll("[data-a11y='dark']").forEach(function (b) { b.classList.toggle("active", on); });
  }
  function initThemeToggleBtns() {
    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      btn.textContent = document.body.classList.contains("ilh-dark") ? "☀️" : "🌙";
      btn.addEventListener("click", function () { setDark(!document.body.classList.contains("ilh-dark")); });
    });
  }

  /* ===================== RAIL ===================== */
  function buildRail() {
    var rail = document.getElementById("appRail");
    if (!rail) return;
    var role = document.body.getAttribute("data-role");
    var active = document.body.getAttribute("data-active");
    var groups = NAV[role] || [];
    var meta = ROLE_META[role] || {};
    var html = '<div class="rail-brand"><span class="mark">' + (meta.ico || "🏫") + '</span><b>' + esc(meta.label || "Portal") + ' Portal<small>Inclusive Learning Hub</small></b></div>';
    groups.forEach(function (g) {
      if (g.group) html += '<div class="rail-group">' + esc(g.group) + "</div>";
      g.items.forEach(function (it) {
        html += '<a class="rail-link' + (it.id === active ? " active" : "") + '" href="' + it.url + '"><span class="ico">' + it.ico + "</span>" + esc(it.label) + "</a>";
      });
    });
    rail.innerHTML = html;

    var toggle = document.querySelector("[data-rail-toggle]");
    if (toggle) toggle.addEventListener("click", function () { rail.classList.toggle("open"); });
  }

  /* ===================== HEADER TOOLS ===================== */
  function buildHeaderTools() {
    var host = document.getElementById("hdrTools");
    if (!host) return;
    var role = document.body.getAttribute("data-role");
    var meta = ROLE_META[role] || { label: "Guest", who: "Guest User", ico: "👤" };

    host.innerHTML =
      '<div class="hdr-search">' +
        '<input type="search" id="globalSearch" placeholder="Search students, courses, pages…" aria-label="Global search" autocomplete="off">' +
        '<div class="search-results" id="searchResults"></div>' +
      '</div>' +
      '<button class="theme-toggle" type="button" data-theme-toggle aria-label="Toggle dark mode">🌙</button>' +
      '<div class="dropdown" id="ddNotif"><button class="icon-btn" aria-label="Notifications" title="Notifications">🔔<span class="dot"></span></button><div class="dropdown-panel"></div></div>' +
      '<div class="dropdown" id="ddMsgs"><button class="icon-btn" aria-label="Messages" title="Messages">💬<span class="dot"></span></button><div class="dropdown-panel"></div></div>' +
      '<button class="icon-btn" type="button" title="Help" aria-label="Help" onclick="ILH_UI.toast(\'Help center — this is a portfolio demo; live product would open guided help articles.\',\'info\')">❓</button>' +
      '<div class="dropdown role-switch" id="ddRole"><button type="button"><span class="role-avatar">' + meta.ico + '</span><span class="rs-label">' + esc(meta.who) + "<small>" + esc(meta.label) + "</small></span></button><div class=\"dropdown-panel\"></div></div>";

    initGlobalSearch();
    initDropdown("ddNotif", renderNotifDropdown());
    initDropdown("ddMsgs", renderMsgsDropdown());
    initDropdown("ddRole", renderRoleSwitchDropdown(role));

    var savedTheme = document.body.classList.contains("ilh-dark");
    host.querySelector("[data-theme-toggle]").textContent = savedTheme ? "☀️" : "🌙";
    host.querySelector("[data-theme-toggle]").addEventListener("click", function () { setDark(!document.body.classList.contains("ilh-dark")); });
  }

  function initDropdown(id, panelHtml) {
    var wrap = document.getElementById(id);
    if (!wrap) return;
    var btn = wrap.querySelector("button");
    var panel = wrap.querySelector(".dropdown-panel");
    panel.innerHTML = panelHtml;
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      document.querySelectorAll(".dropdown-panel.open").forEach(function (p) { if (p !== panel) p.classList.remove("open"); });
      panel.classList.toggle("open");
    });
    document.addEventListener("click", function (e) { if (!wrap.contains(e.target)) panel.classList.remove("open"); });
  }

  function renderNotifDropdown() {
    var ar = D.attentionRequired;
    var items = [];
    ar.expiringPlans.slice(0, 2).forEach(function (p) { items.push({ ico: "🧩", t: p.student + " — " + p.plan, s: "Expires " + p.expires }); });
    ar.missedTherapy.slice(0, 2).forEach(function (m) { items.push({ ico: "🩺", t: m.student, s: "Missed: " + m.missed }); });
    items.push({ ico: "✅", t: "Weekly attendance report ready", s: "Generated this morning" });
    var list = items.map(function (i) { return '<div class="dd-item"><span class="dd-ico">' + i.ico + '</span><div><b>' + esc(i.t) + "</b><small>" + esc(i.s) + "</small></div></div>"; }).join("");
    return '<div class="dropdown-head">Notifications <span class="count">' + items.length + ' new</span></div><div class="dropdown-list">' + list + '</div><div class="dropdown-foot"><a href="' + base() + 'admin/dashboard.html">View all in Dashboard →</a></div>';
  }
  function renderMsgsDropdown() {
    var list = D.messages.slice(0, 3).map(function (m) {
      return '<div class="dd-item"><span class="dd-ico">✉️</span><div><b>' + esc(m.from) + "</b><small>" + esc(m.subject) + "</small></div></div>";
    }).join("");
    return '<div class="dropdown-head">Messages <span class="count">' + D.messages.length + '</span></div><div class="dropdown-list">' + list + '</div><div class="dropdown-foot"><a href="#" onclick="ILH_UI.toast(\'Opening Messages…\',\'info\');return false;">Open Messages →</a></div>';
  }
  function renderRoleSwitchDropdown(current) {
    var html = "";
    Object.keys(ROLE_META).forEach(function (r) {
      var m = ROLE_META[r];
      html += '<a class="rs-item" href="' + base() + m.dash + '"><span class="ico">' + m.ico + "</span>" + esc(m.label) + (r === current ? " (current)" : "") + "</a>";
    });
    html += '<a class="rs-item" href="' + base() + 'demo.html"><span class="ico">🔁</span>Switch Role — Role Selector</a>';
    return '<div class="dropdown-head">Demo Role Switcher</div><div class="dropdown-list">' + html + "</div>";
  }

  /* ===================== GLOBAL SEARCH ===================== */
  function searchIndex() {
    var idx = [];
    D.students.forEach(function (s) { idx.push({ label: s.name, sub: "Grade " + s.grade + " · " + s.programme, url: base() + "shared/student-profile.html?id=" + s.id }); });
    D.courses.forEach(function (c) { idx.push({ label: c.title, sub: c.mode + " · " + (D.getTeacher(c.teacherId) || {}).name, url: base() + "shared/course.html?id=" + c.id }); });
    idx.push({ label: "Scheduling", sub: "Weekly calendar & conflicts", url: base() + "shared/scheduling.html" });
    idx.push({ label: "Project Overview", sub: "Product vision & roadmap", url: base() + "project-overview.html" });
    return idx;
  }
  function initGlobalSearch() {
    var input = document.getElementById("globalSearch");
    var box = document.getElementById("searchResults");
    if (!input || !box) return;
    var idx = searchIndex();
    input.addEventListener("input", function () {
      var q = input.value.trim().toLowerCase();
      if (!q) { box.classList.remove("open"); return; }
      var m = idx.filter(function (i) { return (i.label + " " + i.sub).toLowerCase().indexOf(q) > -1; }).slice(0, 8);
      box.innerHTML = m.length ? m.map(function (i) { return '<a class="sr-item" href="' + i.url + '">' + esc(i.label) + "<small>" + esc(i.sub) + "</small></a>"; }).join("") : '<div class="sr-empty">No matches for “' + esc(q) + '”</div>';
      box.classList.add("open");
    });
    document.addEventListener("click", function (e) { if (!box.contains(e.target) && e.target !== input) box.classList.remove("open"); });
  }

  /* ===================== TABS ===================== */
  function initTabs() {
    document.querySelectorAll("[data-tabs]").forEach(function (wrap) {
      var btns = wrap.querySelectorAll(".tab-btn");
      var panels = wrap.querySelectorAll(".tab-panel");
      btns.forEach(function (b) {
        b.addEventListener("click", function () {
          btns.forEach(function (x) { x.classList.remove("active"); });
          panels.forEach(function (p) { p.classList.remove("active"); });
          b.classList.add("active");
          var target = wrap.querySelector('.tab-panel[data-tab-panel="' + b.getAttribute("data-tab") + '"]');
          if (target) target.classList.add("active");
          if (history.replaceState) history.replaceState(null, "", "#" + b.getAttribute("data-tab"));
        });
      });
      var hashTab = location.hash.replace("#", "");
      var match = hashTab && wrap.querySelector('.tab-btn[data-tab="' + hashTab + '"]');
      if (match) match.click();
    });
  }

  /* ===================== MODALS / DRAWERS ===================== */
  function initModalsDrawers() {
    document.querySelectorAll("[data-modal-open]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var el = document.getElementById(btn.getAttribute("data-modal-open"));
        if (el) el.classList.add("open");
      });
    });
    document.querySelectorAll(".modal-overlay").forEach(function (ov) {
      ov.addEventListener("click", function (e) { if (e.target === ov) ov.classList.remove("open"); });
      ov.querySelectorAll("[data-modal-close]").forEach(function (b) { b.addEventListener("click", function () { ov.classList.remove("open"); }); });
    });
    document.querySelectorAll("[data-drawer-open]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var el = document.getElementById(btn.getAttribute("data-drawer-open"));
        if (el) { el.classList.add("open"); var ov = el.previousElementSibling; if (ov && ov.classList.contains("drawer-overlay")) ov.classList.add("open"); }
      });
    });
    document.querySelectorAll(".drawer-overlay").forEach(function (ov) {
      ov.addEventListener("click", function () { ov.classList.remove("open"); var d = ov.nextElementSibling; if (d) d.classList.remove("open"); });
    });
    document.querySelectorAll("[data-drawer-close]").forEach(function (b) {
      b.addEventListener("click", function () {
        var d = b.closest(".drawer"); if (d) d.classList.remove("open");
        var ov = d && d.previousElementSibling; if (ov) ov.classList.remove("open");
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        document.querySelectorAll(".modal-overlay.open").forEach(function (m) { m.classList.remove("open"); });
        document.querySelectorAll(".drawer.open").forEach(function (d) { d.classList.remove("open"); });
        document.querySelectorAll(".drawer-overlay.open").forEach(function (d) { d.classList.remove("open"); });
      }
    });
  }

  /* ===================== TOASTS ===================== */
  function toast(msg, kind) {
    var wrap = document.querySelector(".toast-wrap");
    if (!wrap) { wrap = document.createElement("div"); wrap.className = "toast-wrap"; document.body.appendChild(wrap); }
    var t = document.createElement("div");
    t.className = "toast" + (kind ? " " + kind : "");
    t.textContent = msg;
    wrap.appendChild(t);
    setTimeout(function () { t.style.opacity = "0"; t.style.transition = "opacity .3s"; setTimeout(function () { t.remove(); }, 300); }, 3200);
  }
  window.ILH_UI = { toast: toast };
  function initToastButtons() {
    document.querySelectorAll("[data-toast]").forEach(function (b) {
      b.addEventListener("click", function (e) {
        if (b.tagName === "A" && b.getAttribute("href") === "#") e.preventDefault();
        toast(b.getAttribute("data-toast-msg") || (b.textContent.trim() + " ✓"), b.getAttribute("data-toast"));
      });
    });
  }

  /* ===================== MOCK FORMS ===================== */
  function initMockForms() {
    document.querySelectorAll("[data-form-mock]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        toast(form.getAttribute("data-success-msg") || "Saved successfully ✓", "ok");
        if (form.getAttribute("data-reset-after") !== "false") form.reset();
        var out = form.getAttribute("data-append-to");
        if (out) appendMockRow(out, form);
      });
    });
  }
  function appendMockRow(targetSel, form) {
    var target = document.querySelector(targetSel);
    if (!target) return;
    var fd = new FormData(form);
    var parts = [];
    fd.forEach(function (v, k) { if (v) parts.push("<b>" + esc(k) + ":</b> " + esc(v)); });
    var row = document.createElement("div");
    row.className = "dd-item"; row.style.borderBottom = "1px solid var(--border)";
    row.innerHTML = '<span class="dd-ico">🆕</span><div>' + parts.join(" &nbsp;·&nbsp; ") + "</div>";
    target.prepend(row);
  }

  /* ===================== TABLES (search/filter/sort) ===================== */
  function initTables() {
    document.querySelectorAll("[data-table]").forEach(function (wrap) {
      var table = wrap.querySelector("table");
      var rows = Array.prototype.slice.call(table.querySelectorAll("tbody tr"));
      var searchInput = wrap.querySelector("[data-table-search]");
      var filters = wrap.querySelectorAll("[data-table-filter]");
      var countEl = wrap.querySelector("[data-table-count]");

      function apply() {
        var q = searchInput ? searchInput.value.trim().toLowerCase() : "";
        var active = {};
        filters.forEach(function (f) { if (f.value) active[f.getAttribute("data-table-filter")] = f.value; });
        var shown = 0;
        rows.forEach(function (r) {
          var text = r.textContent.toLowerCase();
          var ok = !q || text.indexOf(q) > -1;
          Object.keys(active).forEach(function (col) {
            if (r.getAttribute("data-" + col) !== active[col]) ok = false;
          });
          r.style.display = ok ? "" : "none";
          if (ok) shown++;
        });
        if (countEl) countEl.textContent = shown + " of " + rows.length;
      }
      if (searchInput) searchInput.addEventListener("input", apply);
      filters.forEach(function (f) { f.addEventListener("change", apply); });
      apply();

      table.querySelectorAll("th.sortable").forEach(function (th) {
        th.addEventListener("click", function () {
          var col = th.getAttribute("data-col");
          var asc = !th.classList.contains("sort-asc");
          table.querySelectorAll("th").forEach(function (x) { x.classList.remove("sort-asc", "sort-desc"); });
          th.classList.add(asc ? "sort-asc" : "sort-desc");
          rows.sort(function (a, b) {
            var av = a.getAttribute("data-" + col) || a.textContent;
            var bv = b.getAttribute("data-" + col) || b.textContent;
            var an = parseFloat(av), bn = parseFloat(bv);
            var cmp = (!isNaN(an) && !isNaN(bn)) ? an - bn : String(av).localeCompare(String(bv));
            return asc ? cmp : -cmp;
          });
          var tbody = table.querySelector("tbody");
          rows.forEach(function (r) { tbody.appendChild(r); });
        });
      });
    });
  }

  function initAccordSafety() { /* details.acc from shared design-system already works natively */ }

  /* ===================== CHARTS ===================== */
  function renderCharts() {
    document.querySelectorAll('[data-chart="bar"]').forEach(renderBar);
    document.querySelectorAll('[data-chart="donut"]').forEach(renderDonut);
    document.querySelectorAll('[data-chart="heatmap"]').forEach(renderHeatmap);
    document.querySelectorAll('[data-chart="trend"]').forEach(renderTrend);
  }
  function renderBar(el) {
    var data = JSON.parse(el.getAttribute("data-values"));
    var max = Math.max.apply(null, data.map(function (d) { return d.v; })) || 1;
    el.classList.add("barchart");
    el.innerHTML = data.map(function (d) {
      return '<div class="bar-col"><div class="bar" style="height:' + Math.round((d.v / max) * 100) + '%"><span class="bv">' + d.v + '</span></div><div class="bar-label">' + esc(d.label) + "</div></div>";
    }).join("");
  }
  function renderDonut(el) {
    var val = parseFloat(el.getAttribute("data-value"));
    var label = el.getAttribute("data-label") || (val + "%");
    el.classList.add("donut");
    el.style.setProperty("--val", val);
    el.innerHTML = '<div class="hole">' + esc(label) + "</div>";
  }
  function renderHeatmap(el) {
    var data = JSON.parse(el.getAttribute("data-values")); // [{label, level(0-4)}]
    var cols = el.getAttribute("data-cols") || 8;
    el.classList.add("heatmap");
    el.style.gridTemplateColumns = "repeat(" + cols + ", 1fr)";
    el.innerHTML = data.map(function (d) { return '<div class="hm-cell hm-' + d.level + '" title="' + esc(d.label) + '">' + esc(d.short || "") + "</div>"; }).join("");
  }
  function renderTrend(el) {
    var data = JSON.parse(el.getAttribute("data-values"));
    var max = Math.max.apply(null, data.map(function (d) { return d.v; })) || 1;
    var min = Math.min.apply(null, data.map(function (d) { return d.v; }));
    var w = 300, h = 60, pad = 4;
    var pts = data.map(function (d, i) {
      var x = pad + (i / (data.length - 1)) * (w - pad * 2);
      var y = h - pad - ((d.v - min) / (max - min || 1)) * (h - pad * 2);
      return [x, y];
    });
    var line = pts.map(function (p, i) { return (i ? "L" : "M") + p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" ");
    var area = line + " L" + pts[pts.length - 1][0] + "," + h + " L" + pts[0][0] + "," + h + " Z";
    el.innerHTML = '<svg class="trendline" viewBox="0 0 ' + w + " " + h + '" preserveAspectRatio="none"><path class="area" d="' + area + '"/><path class="line" d="' + line + '"/></svg>';
  }

  /* ===================== SCHEDULING ===================== */
  function initSchedule() {
    var host = document.querySelector("[data-schedule]");
    if (!host) return;
    var views = ["student", "teacher", "therapist", "para", "room"];
    var view = qs("view") || "teacher";
    var id = qs("id") || "T1";

    var toolbar = document.querySelector("[data-schedule-toolbar]");
    if (toolbar) {
      toolbar.innerHTML = views.map(function (v) {
        return '<button type="button" class="chip-filter' + (v === view ? " active" : "") + '" data-view="' + v + '">' + v.charAt(0).toUpperCase() + v.slice(1) + " Schedule</button>";
      }).join("");
      toolbar.querySelectorAll("button").forEach(function (b) {
        b.addEventListener("click", function () {
          var v = b.getAttribute("data-view");
          var defaultId = { student: "S01", teacher: "T1", therapist: "TH1", para: "P1", room: "Room 214" }[v];
          location.href = location.pathname + "?view=" + v + "&id=" + encodeURIComponent(defaultId);
        });
      });
    }

    renderScheduleGrid(host, view, id);
  }
  function eventMatches(e, view, id) {
    if (view === "student") return e.studentIds && e.studentIds.indexOf(id) > -1;
    if (view === "teacher") return e.type === "class" && e.who === (D.getTeacher(id) || {}).name;
    if (view === "therapist") return e.type === "therapy" && e.who === (D.getTherapist(id) || {}).name;
    if (view === "para") return e.type === "para" && e.who === (D.getPara(id) || {}).name;
    if (view === "room") return e.where === id;
    return false;
  }
  function toMinutes(t) {
    // "9:45" / "10:15" / "1:50" (school-day 12-hour shorthand, always AM/PM-unambiguous
    // within an 8:00-2:45 school day) -> minutes since midnight, with a 12-hour rollover
    // for the 1:xx/2:xx afternoon periods so they sort after the 11:xx/12:xx ones.
    var parts = String(t).split(":");
    var h = parseInt(parts[0], 10), m = parseInt(parts[1], 10) || 0;
    if (h < 8) h += 12; // 1:50 -> 13:50, 2:45 -> 14:45
    return h * 60 + m;
  }

  function renderScheduleGrid(host, view, id) {
    host.classList.add("schedule-grid");
    var days = D.scheduleDay, periods = D.schedulePeriods;
    var periodMins = periods.map(toMinutes);
    var events = D.scheduleEvents.filter(function (e) { return eventMatches(e, view, id); });

    var conflicts = [];
    days.forEach(function (day) {
      var dayEvents = events.filter(function (e) { return e.day === day; });
      for (var i = 0; i < dayEvents.length; i++) {
        for (var j = i + 1; j < dayEvents.length; j++) {
          var aStart = toMinutes(dayEvents[i].start), aEnd = toMinutes(dayEvents[i].end);
          var bStart = toMinutes(dayEvents[j].start), bEnd = toMinutes(dayEvents[j].end);
          if (aStart < bEnd && bStart < aEnd) conflicts.push([dayEvents[i], dayEvents[j]]);
        }
      }
    });

    var banner = document.querySelector("[data-schedule-conflict]");
    if (banner) {
      if (conflicts.length) {
        banner.style.display = "flex";
        banner.innerHTML = "⚠️ <div><b>Scheduling conflict detected:</b> " + conflicts.map(function (c) {
          return '"' + esc(c[0].title) + '" overlaps with "' + esc(c[1].title) + '" on ' + c[0].day + " at " + c[0].start + ". Reassign a room or adjust one session to resolve.";
        }).join(" ") + "</div>";
      } else { banner.style.display = "none"; }
    }

    // Bucket each event into the period row whose time range contains its start
    // (handles start times that fall between two fixed period slots, e.g. "10:15").
    function periodIndexFor(startMin) {
      var idx = 0;
      for (var i = 0; i < periodMins.length; i++) { if (startMin >= periodMins[i]) idx = i; }
      return idx;
    }

    var html = '<div class="sg-cell sg-head" style="background:transparent;border:none;"></div>';
    days.forEach(function (d) { html += '<div class="sg-cell sg-head">' + d + "</div>"; });
    periods.forEach(function (p, pIdx) {
      html += '<div class="sg-cell sg-time">' + p + "</div>";
      days.forEach(function (day) {
        var cellEvents = events.filter(function (e) { return e.day === day && periodIndexFor(toMinutes(e.start)) === pIdx; });
        html += '<div class="sg-cell">' + cellEvents.map(function (e) {
          var isConflict = conflicts.some(function (c) { return c[0].id === e.id || c[1].id === e.id; });
          return '<div class="sg-event type-' + e.type + (isConflict ? " conflict" : "") + '" title="' + esc(e.title) + '">' + esc(e.title) + "<small>" + e.start + "–" + e.end + " · " + esc(e.where) + (e.virtual ? " · 💻 Virtual" : "") + "</small></div>";
        }).join("") + "</div>";
      });
    });
    host.innerHTML = html;
  }

  /* ===================== GOAL PROGRESS RINGS ===================== */
  function initGoalRings() {
    document.querySelectorAll("[data-goal-ring]").forEach(function (el) {
      var v = parseFloat(el.getAttribute("data-goal-ring"));
      el.classList.add("donut");
      el.style.setProperty("--val", v);
      el.innerHTML = '<div class="hole">' + v + "%</div>";
    });
  }

  /* ===================== STUDY TIMER (student portal) ===================== */
  function initStudyTimer() {
    var ring = document.querySelector("[data-study-timer]");
    if (!ring) return;
    var display = document.querySelector("[data-study-timer-display]");
    var startBtn = document.querySelector("[data-study-timer-start]");
    var resetBtn = document.querySelector("[data-study-timer-reset]");
    var total = 25 * 60, remaining = total, timer = null;
    function render() {
      var m = Math.floor(remaining / 60), s = remaining % 60;
      if (display) display.textContent = (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
      ring.style.setProperty("--tval", Math.round(((total - remaining) / total) * 100));
    }
    render();
    if (startBtn) startBtn.addEventListener("click", function () {
      if (timer) { clearInterval(timer); timer = null; startBtn.textContent = "▶ Resume"; return; }
      startBtn.textContent = "⏸ Pause";
      timer = setInterval(function () {
        remaining--; render();
        if (remaining <= 0) { clearInterval(timer); timer = null; toast("⏰ Study session complete — nice focus!", "ok"); startBtn.textContent = "▶ Start"; }
      }, 1000);
    });
    if (resetBtn) resetBtn.addEventListener("click", function () { clearInterval(timer); timer = null; remaining = total; render(); if (startBtn) startBtn.textContent = "▶ Start"; });
  }

  /* ===================== TASK CHECKLIST ===================== */
  function initTaskChecklist() {
    document.querySelectorAll(".task-list input[type=checkbox]").forEach(function (cb) {
      cb.addEventListener("change", function () { cb.closest("li").classList.toggle("done", cb.checked); });
    });
  }

  /* ===================== PROMPT-LEVEL SCALE (para data entry) ===================== */
  function initPromptScale() {
    document.querySelectorAll(".prompt-scale").forEach(function (scale) {
      scale.querySelectorAll("button").forEach(function (b) {
        b.addEventListener("click", function () {
          scale.querySelectorAll("button").forEach(function (x) { x.classList.remove("sel"); });
          b.classList.add("sel");
          var hidden = scale.parentElement.querySelector("input[type=hidden]");
          if (hidden) hidden.value = b.textContent;
        });
      });
    });
  }

  /* ===================== "CHOOSE HOW TO RESPOND" ===================== */
  function initRespondChooser() {
    document.querySelectorAll(".respond-tile").forEach(function (tile) {
      tile.addEventListener("click", function () {
        tile.parentElement.querySelectorAll(".respond-tile").forEach(function (t) { t.classList.remove("sel"); });
        tile.classList.add("sel");
        var out = document.querySelector("[data-respond-out]");
        if (out) out.textContent = "Response mode selected: " + tile.querySelector(".rt-label").textContent + ". The submission area below now accepts this format.";
      });
    });
  }

  /* ===================== GENERATE ACCESSIBLE ALTERNATIVES (lesson planner) ===================== */
  function initAltFormatsModal() {
    var btn = document.querySelector("[data-generate-alts]");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var modal = document.getElementById("altFormatsModal");
      if (!modal) return;
      var body = modal.querySelector(".modal-body");
      body.innerHTML = '<div class="gen-loading"><div class="shimmer w90"></div><div class="shimmer w70"></div><div class="shimmer w50"></div></div>';
      modal.classList.add("open");
      setTimeout(function () {
        body.innerHTML =
          '<div class="tabs" data-tabs><div class="tab-btns">' +
            '<button class="tab-btn active" data-tab="simple">Simplified Text</button>' +
            '<button class="tab-btn" data-tab="audio">Audio</button>' +
            '<button class="tab-btn" data-tab="visual">Visual Supports</button>' +
            '<button class="tab-btn" data-tab="print">Printable</button>' +
            '<button class="tab-btn" data-tab="alt">Alt. Assessment</button></div>' +
          '<div class="tab-panel active" data-tab-panel="simple"><p>“A narrator tells the story. First-person means the narrator is a character in the story and uses ‘I.’ Third-person means the narrator is outside the story and uses ‘he,’ ‘she,’ or ‘they.’”</p><p class="muted">Shortened sentences, controlled vocabulary, one idea per line.</p></div>' +
          '<div class="tab-panel" data-tab-panel="audio"><div class="card compact"><button class="btn secondary small" type="button" data-tts-text="A narrator tells the story. First-person means the narrator is a character in the story and uses the word I. Third-person means the narrator is outside the story.">🔊 Play audio version</button><p class="muted" style="margin-top:.6rem;">Uses your browser\'s built-in text-to-speech.</p></div></div>' +
          '<div class="tab-panel" data-tab-panel="visual"><div class="dash-grid"><div class="metric"><div class="m-label">🙋 First-Person</div><div class="m-num" style="font-size:1.1rem;">“I walked home.”</div></div><div class="metric teal"><div class="m-label">🧍 Third-Person</div><div class="m-num" style="font-size:1.1rem;">“She walked home.”</div></div></div></div>' +
          '<div class="tab-panel" data-tab-panel="print"><p>A one-page black-and-white worksheet version with large print and extra writing space is ready to download.</p><button class="btn secondary small" type="button" data-toast="info" data-toast-msg="📄 Printable worksheet downloaded (simulated).">⬇ Download printable PDF</button></div>' +
          '<div class="tab-panel" data-tab-panel="alt"><p>Alternative assessment: instead of a written response, the student sorts 6 example sentences into “First-Person” and “Third-Person” bins.</p></div>' +
          "</div>";
        initTabs();
        initTTSButtons();
      }, 700);
    });
  }

  /* ===================== ACCESSIBILITY TOOLBAR ===================== */
  var A11Y_STATE_KEY = KEY.a11y;
  var A11Y_DEFAULT = { size: 0, contrast: false, dark: false, dyslexic: false, spacing: false, focus: false, reducedMotion: false };

  function initA11yToolbar() {
    if (!document.body.hasAttribute("data-ilh-a11y")) return;
    // Clone the default — LS.get() returns the fallback object BY REFERENCE when
    // nothing is stored yet, and state.x = ... below would otherwise mutate
    // A11Y_DEFAULT itself, silently breaking "Reset All" on every fresh visit.
    var state = LS.get(A11Y_STATE_KEY, Object.assign({}, A11Y_DEFAULT));

    var toggle = document.createElement("button");
    toggle.className = "ilh-a11y-toggle"; toggle.type = "button"; toggle.title = "Accessibility options"; toggle.setAttribute("aria-label", "Open accessibility toolbar");
    toggle.textContent = "♿";
    document.body.appendChild(toggle);

    var bar = document.createElement("div");
    bar.className = "ilh-a11y-bar"; bar.setAttribute("role", "toolbar"); bar.setAttribute("aria-label", "Accessibility toolbar");
    bar.style.display = "none";
    bar.innerHTML =
      '<div class="a11y-title">Accessibility</div>' +
      btnHtml("size+", "A+", "Increase Text") +
      btnHtml("size-", "A-", "Decrease Text") +
      btnHtml("contrast", "◐", "High Contrast") +
      btnHtml("dark", "🌙", "Dark Mode") +
      btnHtml("dyslexic", "Dx", "Dyslexia Font") +
      btnHtml("spacing", "≡", "Line Spacing") +
      btnHtml("focus", "▭", "Reading Focus") +
      btnHtml("reducedMotion", "⏸", "Reduce Motion") +
      btnHtml("tts", "🔊", "Read Aloud") +
      btnHtml("reset", "↺", "Reset All");
    document.body.appendChild(bar);

    toggle.addEventListener("click", function () { bar.style.display = bar.style.display === "none" ? "flex" : "none"; });

    function btnHtml(action, icon, label) {
      return '<button type="button" data-a11y="' + action + '"><span aria-hidden="true">' + icon + '</span><span class="al-label">' + label + "</span></button>";
    }

    function apply() {
      document.body.classList.remove("ilh-size-1", "ilh-size-2", "ilh-size-3");
      if (state.size > 0) document.body.classList.add("ilh-size-" + state.size);
      document.body.classList.toggle("a11y-contrast", state.contrast);
      document.body.classList.toggle("ilh-contrast", state.contrast);
      document.body.classList.toggle("ilh-dark", state.dark);
      document.body.classList.toggle("ilh-dyslexic", state.dyslexic);
      document.body.classList.toggle("ilh-spacing", state.spacing);
      document.body.classList.toggle("ilh-focus", state.focus);
      document.body.classList.toggle("ilh-reduced-motion", state.reducedMotion);
      toggleFocusMask(state.focus);
      bar.querySelectorAll("[data-a11y]").forEach(function (b) {
        var a = b.getAttribute("data-a11y");
        var on = (a === "contrast" && state.contrast) || (a === "dark" && state.dark) || (a === "dyslexic" && state.dyslexic) ||
          (a === "spacing" && state.spacing) || (a === "focus" && state.focus) || (a === "reducedMotion" && state.reducedMotion);
        b.classList.toggle("active", !!on);
      });
    }

    var focusEls = null;
    function toggleFocusMask(on) {
      if (on && !focusEls) {
        focusEls = [document.createElement("div"), document.createElement("div")];
        focusEls.forEach(function (d, i) {
          d.style.position = "fixed"; d.style.left = "0"; d.style.right = "0"; d.style.height = "38vh";
          d.style.background = "rgba(4,8,16,0.55)"; d.style.zIndex = "380"; d.style.pointerEvents = "none";
          d.style[i === 0 ? "top" : "bottom"] = "0";
          document.body.appendChild(d);
        });
        document.addEventListener("mousemove", moveFocus);
      } else if (!on && focusEls) {
        focusEls.forEach(function (d) { d.remove(); });
        focusEls = null;
        document.removeEventListener("mousemove", moveFocus);
      }
    }
    function moveFocus(e) {
      if (!focusEls) return;
      var bandTop = Math.max(0, e.clientY - 90);
      var bandBottom = Math.max(0, window.innerHeight - (e.clientY + 90));
      focusEls[0].style.height = bandTop + "px";
      focusEls[1].style.height = bandBottom + "px";
    }

    var speaking = false;
    function toggleTTS() {
      if (!("speechSynthesis" in window)) { toast("Text-to-speech isn't available in this browser.", "warn"); return; }
      if (speaking) { window.speechSynthesis.cancel(); speaking = false; toast("Read Aloud stopped.", "info"); return; }
      var main = document.getElementById("main") || document.body;
      var text = main.innerText.slice(0, 4000);
      var utter = new SpeechSynthesisUtterance(text);
      utter.rate = 0.98;
      utter.onend = function () { speaking = false; };
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
      speaking = true;
      toast("🔊 Reading page content aloud…", "info");
    }

    bar.addEventListener("click", function (e) {
      var b = e.target.closest("[data-a11y]");
      if (!b) return;
      var a = b.getAttribute("data-a11y");
      if (a === "size+") state.size = Math.min(3, state.size + 1);
      else if (a === "size-") state.size = Math.max(0, state.size - 1);
      else if (a === "contrast") state.contrast = !state.contrast;
      else if (a === "dark") { state.dark = !state.dark; setDark(state.dark); }
      else if (a === "dyslexic") state.dyslexic = !state.dyslexic;
      else if (a === "spacing") state.spacing = !state.spacing;
      else if (a === "focus") state.focus = !state.focus;
      else if (a === "reducedMotion") state.reducedMotion = !state.reducedMotion;
      else if (a === "tts") { toggleTTS(); return; }
      else if (a === "reset") { state = Object.assign({}, A11Y_DEFAULT); window.speechSynthesis && window.speechSynthesis.cancel(); speaking = false; setDark(false); toast("Accessibility preferences reset.", "info"); }
      LS.set(A11Y_STATE_KEY, state);
      apply();
    });

    apply();
  }

  function initTTSButtons() {
    document.querySelectorAll("[data-tts-text]").forEach(function (b) {
      if (b._ttsBound) return; b._ttsBound = true;
      b.addEventListener("click", function () {
        if (!("speechSynthesis" in window)) { toast("Text-to-speech isn't available in this browser.", "warn"); return; }
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(b.getAttribute("data-tts-text")));
        toast("🔊 Playing audio…", "info");
      });
    });
  }
  document.addEventListener("DOMContentLoaded", initTTSButtons);
})();
