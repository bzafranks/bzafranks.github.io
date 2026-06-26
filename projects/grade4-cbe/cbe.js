/* =====================================================================
   Grade 4 Social Studies — Competency-Based Learning (project script)
   Loads after the shared portfolio.js. Adds CBE-specific interactivity:
     • Student portfolio builder (artifacts saved to localStorage)
     • Digital badge claiming (earned state saved to localStorage)
     • Mastery-level self-tracker
   All client-side for demonstration.
   ===================================================================== */
document.addEventListener("DOMContentLoaded", function () {
  initPortfolioBuilder();
  initBadges();
  initMasteryPicker();
});

/* ---------- Portfolio builder ----------
   <div data-portfolio="key">
     <select class="pf-type">…artifact types…</select>
     <input class="pf-title"> <textarea class="pf-note"></textarea>
     <button data-add>Add</button>
     <div class="pf-items"></div>
   </div> */
function initPortfolioBuilder() {
  document.querySelectorAll("[data-portfolio]").forEach(function (root) {
    var key = "cbe-pf:" + root.getAttribute("data-portfolio");
    var typeEl = root.querySelector(".pf-type");
    var titleEl = root.querySelector(".pf-title");
    var noteEl = root.querySelector(".pf-note");
    var addBtn = root.querySelector("[data-add]");
    var list = root.querySelector(".pf-items");
    var items = [];
    try { items = JSON.parse(localStorage.getItem(key) || "[]"); } catch (e) { items = []; }

    function save() { try { localStorage.setItem(key, JSON.stringify(items)); } catch (e) {} }
    function render() {
      list.innerHTML = "";
      if (!items.length) { list.innerHTML = '<p class="muted">No artifacts yet. Add your first piece of evidence above! 🎒</p>'; return; }
      items.forEach(function (it, i) {
        var card = document.createElement("div");
        card.className = "card compact";
        card.style.marginBottom = "0.7rem";
        card.innerHTML = '<span class="tag gold">' + esc(it.type) + '</span> <strong>' + esc(it.title) + '</strong>' +
          '<p class="muted" style="margin:0.4rem 0 0;">' + esc(it.note) + '</p>';
        var del = document.createElement("button");
        del.className = "btn ghost small"; del.textContent = "Remove"; del.style.marginTop = "0.5rem";
        del.addEventListener("click", function () { items.splice(i, 1); save(); render(); });
        card.appendChild(del);
        list.appendChild(card);
      });
    }
    if (addBtn) addBtn.addEventListener("click", function () {
      var title = (titleEl.value || "").trim();
      if (!title) { titleEl.focus(); return; }
      items.unshift({ type: typeEl ? typeEl.value : "Artifact", title: title, note: (noteEl.value || "").trim() });
      save(); render();
      titleEl.value = ""; if (noteEl) noteEl.value = "";
    });
    render();
  });
  function esc(s) { return (s || "").replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
}

/* ---------- Digital badges (claimable) ----------
   <button class="btn small" data-badge="map-reader" data-badge-target="#b-map">Claim</button>
   <div class="ach-badge" id="b-map" data-badge-id="map-reader">…</div> */
function initBadges() {
  var KEY = "cbe-badges";
  var earned = {};
  try { earned = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { earned = {}; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(earned)); } catch (e) {} }

  document.querySelectorAll(".ach-badge[data-badge-id]").forEach(function (b) {
    if (earned[b.getAttribute("data-badge-id")]) b.classList.add("earned");
  });
  document.querySelectorAll("[data-badge]").forEach(function (btn) {
    var id = btn.getAttribute("data-badge");
    var target = document.querySelector(btn.getAttribute("data-badge-target"));
    function sync() { btn.textContent = earned[id] ? "✓ Earned" : "Claim badge"; btn.classList.toggle("secondary", !!earned[id]); }
    btn.addEventListener("click", function () {
      earned[id] = !earned[id]; save();
      if (target) target.classList.toggle("earned", !!earned[id]);
      if (earned[id]) target && target.classList.add("pop");
      sync();
    });
    sync();
  });
}

/* ---------- Mastery-level self-tracker ----------
   <div data-mastery="key"> with buttons [data-level="0..4"] and .mastery-out */
function initMasteryPicker() {
  var LEVELS = ["Beginning", "Developing", "Approaching Mastery", "Mastery", "Advanced Mastery"];
  document.querySelectorAll("[data-mastery]").forEach(function (root) {
    var key = "cbe-mastery:" + root.getAttribute("data-mastery");
    var out = root.querySelector(".mastery-out");
    var saved = null;
    try { saved = localStorage.getItem(key); } catch (e) {}
    function show(lvl) {
      root.querySelectorAll("[data-level]").forEach(function (b) { b.classList.toggle("active", b.getAttribute("data-level") === String(lvl)); });
      if (out) { var pct = Math.round((Number(lvl) / 4) * 100); out.innerHTML = '<div class="progress-bar"><div class="progress-fill" style="width:' + pct + '%"></div></div><p style="margin:0.4rem 0 0;font-weight:700;">' + LEVELS[lvl] + '</p>'; }
    }
    root.querySelectorAll("[data-level]").forEach(function (b) {
      b.addEventListener("click", function () { var lvl = b.getAttribute("data-level"); try { localStorage.setItem(key, lvl); } catch (e) {} show(lvl); });
    });
    if (saved !== null) show(saved);
  });
}
