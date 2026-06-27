/* =====================================================================
   Bahamas National AI Strategy for Education — interactivity
   Loads after shared portfolio.js. Adds:
     • Animated KPI count-up
     • AI maturity model (self-assessment across dimensions)
     • Scenario-planning tool (investment level -> projected outcomes)
     • Interactive roadmap phase switcher
   All client-side for demonstration.
   ===================================================================== */
document.addEventListener("DOMContentLoaded", function () {
  initCountUp();
  initMaturity();
  initScenario();
  initPhases();
});

/* ---------- KPI count-up ---------- */
function initCountUp() {
  var els = document.querySelectorAll("[data-count]");
  if (!els.length) return;
  function run(el) {
    var target = parseFloat(el.getAttribute("data-count")), suffix = el.getAttribute("data-suffix") || "";
    var dur = 900, start = null;
    function step(ts) { if (!start) start = ts; var p = Math.min((ts - start) / dur, 1);
      var v = target * (0.5 - Math.cos(p * Math.PI) / 2);
      el.textContent = (target % 1 === 0 ? Math.round(v) : v.toFixed(1)) + suffix;
      if (p < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var obs = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { run(e.target); obs.unobserve(e.target); } }); }, { threshold: 0.4 });
    els.forEach(function (el) { obs.observe(el); });
  } else els.forEach(run);
}

/* ---------- AI maturity model ----------
   <div data-maturity> with rows [data-dim] each having [data-level] buttons,
   plus an overall .maturity-out. Levels 0..4. */
var MATURITY = ["Initial", "Emerging", "Developing", "Advanced", "Leading"];
function initMaturity() {
  document.querySelectorAll("[data-maturity]").forEach(function (root) {
    var out = root.querySelector(".maturity-out");
    var dims = root.querySelectorAll("[data-dim]");
    var state = {};
    dims.forEach(function (row) {
      var dim = row.getAttribute("data-dim");
      row.querySelectorAll("[data-level]").forEach(function (b) {
        b.addEventListener("click", function () {
          row.querySelectorAll("[data-level]").forEach(function (x) { x.classList.remove("active"); });
          b.classList.add("active"); state[dim] = parseInt(b.getAttribute("data-level"), 10); update();
        });
      });
    });
    function update() {
      var keys = Object.keys(state); if (!keys.length || !out) return;
      var avg = keys.reduce(function (s, k) { return s + state[k]; }, 0) / keys.length;
      var lvl = Math.round(avg), pct = Math.round((avg / 4) * 100);
      out.innerHTML = '<div class="progress-bar"><div class="progress-fill" style="width:' + pct + '%"></div></div>' +
        '<p style="margin:0.4rem 0 0;font-weight:700;">Overall maturity: ' + MATURITY[lvl] + ' (' + pct + '%)</p>' +
        '<p class="muted" style="margin:0.2rem 0 0;"><small>' + keys.length + ' of ' + dims.length + ' dimensions rated.</small></p>';
    }
  });
}

/* ---------- Scenario planning ----------
   <div data-scenario> with [data-scenario-opt] buttons + .scenario-out */
var SCENARIOS = {
  baseline: { label: "Baseline (no national strategy)", reach: "Fragmented, school-by-school AI use", equity: "Digital divide widens", risk: "High (no governance)", outcome: "Uneven gains; trust erodes" },
  foundational: { label: "Foundational investment", reach: "Pilot schools + core PD + policy", equity: "Begins to close on pilot islands", risk: "Managed (governance in place)", outcome: "Proof points; readiness built" },
  transformative: { label: "Transformative investment", reach: "National platforms + every teacher trained", equity: "Family-Island access prioritized", risk: "Actively governed &amp; audited", outcome: "System-wide, equitable, sustained impact" }
};
function initScenario() {
  document.querySelectorAll("[data-scenario]").forEach(function (root) {
    var out = root.querySelector(".scenario-out");
    root.querySelectorAll("[data-scenario-opt]").forEach(function (b) {
      b.addEventListener("click", function () {
        root.querySelectorAll("[data-scenario-opt]").forEach(function (x) { x.classList.remove("active"); });
        b.classList.add("active");
        var s = SCENARIOS[b.getAttribute("data-scenario-opt")]; if (!s) return;
        out.innerHTML = '<div class="ai-pill" style="margin-bottom:0.6rem;">📊 Projected scenario</div><h4 style="margin:0 0 0.5rem;">' + s.label + '</h4>' +
          '<div class="report-row"><span><strong>Reach</strong></span><span class="muted">' + s.reach + '</span></div>' +
          '<div class="report-row"><span><strong>Equity</strong></span><span class="muted">' + s.equity + '</span></div>' +
          '<div class="report-row"><span><strong>Risk</strong></span><span class="muted">' + s.risk + '</span></div>' +
          '<div class="report-row"><span><strong>Outcome</strong></span><span class="muted">' + s.outcome + '</span></div>';
      });
    });
  });
}

/* ---------- Interactive roadmap phases ----------
   <div data-phases> with .segmented [data-phase] buttons + [data-phase-panel] panels */
function initPhases() {
  document.querySelectorAll("[data-phases]").forEach(function (root) {
    var panels = root.querySelectorAll("[data-phase-panel]");
    var btns = root.querySelectorAll("[data-phase]");
    btns.forEach(function (btn, i) {
      btn.addEventListener("click", function () {
        btns.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var key = btn.getAttribute("data-phase");
        panels.forEach(function (p) { p.style.display = p.getAttribute("data-phase-panel") === key ? "" : "none"; });
      });
      if (i === 0) btn.classList.add("active");
    });
    panels.forEach(function (p, i) { p.style.display = i === 0 ? "" : "none"; });
  });
}
