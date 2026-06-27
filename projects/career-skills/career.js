/* =====================================================================
   Bahamas Career & Future Skills Academy — project interactivity
   Loads after shared portfolio.js. Adds:
     • Career-interest matcher (interest profile → suggested pathways)
     • Digital portfolio builder (artifacts saved to localStorage)
     • Micro-credential / badge claiming (saved to localStorage)
     • Future-skills self-assessment (mastery picker)
   All client-side for demonstration.
   ===================================================================== */
document.addEventListener("DOMContentLoaded", function () {
  initCareerMatcher();
  initPortfolioBuilder();
  initBadges();
  initSkillPicker();
});

/* ---------- Career-interest matcher ----------
   <div data-career-matcher> with [data-interest] toggle buttons + .match-out */
var PATHWAY_MATCH = {
  building: { label: "Hands-on / Building", paths: ["Construction & Skilled Trades", "Engineering & Manufacturing", "Marine & Blue Economy"] },
  helping: { label: "Helping people", paths: ["Health Sciences", "Education", "Hospitality & Tourism"] },
  tech: { label: "Technology", paths: ["Information Technology", "Artificial Intelligence", "Cybersecurity"] },
  creative: { label: "Creative", paths: ["Creative Media", "Hospitality & Tourism", "Business & Entrepreneurship"] },
  business: { label: "Business / Leading", paths: ["Business & Entrepreneurship", "Hospitality & Tourism", "Information Technology"] },
  nature: { label: "Nature / Outdoors", paths: ["Marine & Blue Economy", "Environmental Sustainability", "Construction & Skilled Trades"] }
};
function initCareerMatcher() {
  document.querySelectorAll("[data-career-matcher]").forEach(function (root) {
    var out = root.querySelector(".match-out");
    var chosen = {};
    root.querySelectorAll("[data-interest]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var k = btn.getAttribute("data-interest");
        chosen[k] = !chosen[k];
        btn.classList.toggle("selected", chosen[k]);
        render();
      });
    });
    function render() {
      var keys = Object.keys(chosen).filter(function (k) { return chosen[k]; });
      if (!keys.length) { out.innerHTML = '<p class="muted">Select one or more interests to see matched pathways.</p>'; return; }
      var score = {};
      keys.forEach(function (k) { PATHWAY_MATCH[k].paths.forEach(function (p, i) { score[p] = (score[p] || 0) + (3 - i); }); });
      var ranked = Object.keys(score).sort(function (a, b) { return score[b] - score[a]; }).slice(0, 4);
      out.innerHTML = '<div class="ai-pill" style="margin-bottom:0.6rem;">🤖 Suggested pathways</div>' +
        ranked.map(function (p) { return '<div class="rec"><span class="rec-ico">🧭</span><div class="rec-body"><b>' + p + '</b><div class="rec-why">Matches: ' + keys.map(function (k) { return PATHWAY_MATCH[k].label; }).join(", ") + '</div></div></div>'; }).join("") +
        '<p class="muted"><small><a href="career-pathways.html">Explore these pathways →</a></small></p>';
    }
    render();
  });
}

/* ---------- Digital portfolio builder ---------- */
function initPortfolioBuilder() {
  document.querySelectorAll("[data-portfolio]").forEach(function (root) {
    var key = "career-pf:" + root.getAttribute("data-portfolio");
    var typeEl = root.querySelector(".pf-type"), titleEl = root.querySelector(".pf-title"), noteEl = root.querySelector(".pf-note");
    var addBtn = root.querySelector("[data-add]"), list = root.querySelector(".pf-items");
    var items = [];
    try { items = JSON.parse(localStorage.getItem(key) || "[]"); } catch (e) { items = []; }
    function save() { try { localStorage.setItem(key, JSON.stringify(items)); } catch (e) {} }
    function esc(s) { return (s || "").replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
    function render() {
      list.innerHTML = "";
      if (!items.length) { list.innerHTML = '<p class="muted">No artifacts yet — add your first project, badge, or goal! 🚀</p>'; return; }
      items.forEach(function (it, i) {
        var card = document.createElement("div"); card.className = "card compact"; card.style.marginBottom = "0.7rem";
        card.innerHTML = '<span class="tag gold">' + esc(it.type) + '</span> <strong>' + esc(it.title) + '</strong><p class="muted" style="margin:0.4rem 0 0;">' + esc(it.note) + '</p>';
        var del = document.createElement("button"); del.className = "btn ghost small"; del.textContent = "Remove"; del.style.marginTop = "0.5rem";
        del.addEventListener("click", function () { items.splice(i, 1); save(); render(); });
        card.appendChild(del); list.appendChild(card);
      });
    }
    if (addBtn) addBtn.addEventListener("click", function () {
      var t = (titleEl.value || "").trim(); if (!t) { titleEl.focus(); return; }
      items.unshift({ type: typeEl ? typeEl.value : "Artifact", title: t, note: (noteEl.value || "").trim() }); save(); render();
      titleEl.value = ""; if (noteEl) noteEl.value = "";
    });
    render();
  });
}

/* ---------- Micro-credential / badge claiming ---------- */
function initBadges() {
  var KEY = "career-badges"; var earned = {};
  try { earned = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { earned = {}; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(earned)); } catch (e) {} }
  document.querySelectorAll(".ach-badge[data-badge-id]").forEach(function (b) { if (earned[b.getAttribute("data-badge-id")]) b.classList.add("earned"); });
  document.querySelectorAll("[data-badge]").forEach(function (btn) {
    var id = btn.getAttribute("data-badge"), target = document.querySelector(btn.getAttribute("data-badge-target"));
    function sync() { btn.textContent = earned[id] ? "✓ Earned" : "Claim credential"; btn.classList.toggle("secondary", !!earned[id]); }
    btn.addEventListener("click", function () { earned[id] = !earned[id]; save(); if (target) { target.classList.toggle("earned", !!earned[id]); if (earned[id]) target.classList.add("pop"); } sync(); });
    sync();
  });
}

/* ---------- Future-skills self-assessment (mastery picker) ---------- */
function initSkillPicker() {
  var LEVELS = ["Emerging", "Developing", "Proficient", "Advanced", "Expert"];
  document.querySelectorAll("[data-skill]").forEach(function (root) {
    var key = "career-skill:" + root.getAttribute("data-skill");
    var out = root.querySelector(".skill-out"); var saved = null;
    try { saved = localStorage.getItem(key); } catch (e) {}
    function show(lvl) {
      root.querySelectorAll("[data-level]").forEach(function (b) { b.classList.toggle("active", b.getAttribute("data-level") === String(lvl)); });
      if (out) { var pct = Math.round((Number(lvl) / 4) * 100); out.innerHTML = '<div class="progress-bar"><div class="progress-fill" style="width:' + pct + '%"></div></div><p style="margin:0.4rem 0 0;font-weight:700;">' + LEVELS[lvl] + '</p>'; }
    }
    root.querySelectorAll("[data-level]").forEach(function (b) { b.addEventListener("click", function () { var l = b.getAttribute("data-level"); try { localStorage.setItem(key, l); } catch (e) {} show(l); }); });
    if (saved !== null) show(saved);
  });
}
