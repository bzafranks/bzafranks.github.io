/* =====================================================================
   Bahamas Educational Intelligence Platform — interactivity
   Loads after shared portfolio.js. Adds:
     • Animated KPI count-up
     • AI executive-briefing generator (role-based)
     • AI insight / recommendation engine (explainable)
     • Dashboard filters + segmented role switchers
   All sample data is illustrative and runs client-side for demonstration.
   ===================================================================== */
document.addEventListener("DOMContentLoaded", function () {
  initCountUp();
  initBriefing();
  initInsightEngine();
  initFilters();
  initSegmented();
});

/* ---------- Animated KPI count-up ----------  <span class="m-num" data-count="82" data-suffix="%"></span> */
function initCountUp() {
  var els = document.querySelectorAll("[data-count]");
  if (!els.length) return;
  function run(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var dur = 900, start = null, from = 0;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var val = (from + (target - from) * (0.5 - Math.cos(p * Math.PI) / 2));
      el.textContent = (target % 1 === 0 ? Math.round(val) : val.toFixed(1)) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var obs = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { run(e.target); obs.unobserve(e.target); } });
    }, { threshold: 0.4 });
    els.forEach(function (el) { obs.observe(el); });
  } else els.forEach(run);
}

/* ---------- AI executive briefing ----------
   <div data-briefing>  with .segmented role buttons [data-role] and .brief-out */
var BRIEFINGS = {
  teacher: {
    title: "Teacher Briefing · Ms. Rolle, Grade 6",
    insights: ["Class mastery is 78% (▲4% this month).", "Inference (RL) is the weakest standard at 61%."],
    concerns: ["5 students are below 60% on inference and trending flat."],
    successes: ["Vocabulary mastery reached 90%; 3 students ready for enrichment."],
    actions: ["Run a small-group re-teach on inference using the provided strategy.", "Move 3 students to an enrichment task."],
    next: ["Re-assess the inference group on Friday."]
  },
  principal: {
    title: "Principal Briefing · Sunrise Primary",
    insights: ["School-wide achievement 74%; Grade 4 is the lowest cohort (66%).", "Curriculum pacing is 1 week behind in 2 of 6 classes."],
    concerns: ["Chronic absenteeism at 12% — concentrated in two classes.", "Math interventions show limited effect so far."],
    successes: ["Reading interventions improved the target group by 9 points."],
    actions: ["Target PD on math intervention fidelity.", "Launch an attendance outreach for flagged students."],
    next: ["Review pacing with Grade 4 team at the next data meeting."]
  },
  district: {
    title: "District Briefing · New Providence",
    insights: ["District achievement up 3%; 4 of 18 schools are below target.", "PD participation correlates with +6 pts assessment growth."],
    concerns: ["Two schools show declining attendance and achievement together."],
    successes: ["Intervention outcomes improved district-wide by 5 points."],
    actions: ["Allocate coaching to the 4 below-target schools.", "Scale the highest-impact PD."],
    next: ["Set quarterly improvement targets per school."]
  },
  ministry: {
    title: "Ministry Briefing · National Summary",
    insights: ["National curriculum coverage 82%; Family Islands lag central by 7 pts.", "Teacher shortages flagged in 3 districts affecting pacing."],
    concerns: ["Equity gap between high- and low-resource schools persists.", "National assessment readiness uneven across islands."],
    successes: ["Hybrid-continuity adoption reduced lost instructional days."],
    actions: ["Direct resources &amp; staffing support to the 3 flagged districts.", "Expand the continuity curriculum to lagging islands."],
    next: ["Commission an equity review for Q3."]
  }
};
function initBriefing() {
  document.querySelectorAll("[data-briefing]").forEach(function (root) {
    var out = root.querySelector(".brief-out");
    function gen(role) {
      var b = BRIEFINGS[role]; if (!b) return;
      out.innerHTML =
        '<div class="ai-pill" style="margin-bottom:0.7rem;">🤖 AI-generated executive briefing</div>' +
        '<h3 style="margin:0 0 0.6rem;">' + b.title + '</h3>' +
        sec("🔑 Key insights", b.insights) + sec("⚠️ Areas of concern", b.concerns) +
        sec("✅ Successes", b.successes) + sec("🎯 Recommended actions", b.actions) +
        sec("➡️ Priority next steps", b.next);
    }
    function sec(h, arr) { return "<p style='margin:0.6rem 0 0.2rem;font-weight:700;'>" + h + "</p><ul class='arrow-list'>" + arr.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul>"; }
    root.querySelectorAll("[data-role]").forEach(function (b) {
      b.addEventListener("click", function () {
        root.querySelectorAll("[data-role]").forEach(function (x) { x.classList.remove("active"); });
        b.classList.add("active"); gen(b.getAttribute("data-role"));
      });
    });
  });
}

/* ---------- AI insight engine (explainable) ----------
   <div data-insight-engine> with [data-signal] buttons + .insight-out */
var INSIGHTS = {
  intervention: { conf: 91, rec: "Flag 14 students for reading intervention", why: "Two consecutive benchmark scores below 60% on RL standards + declining engagement.", action: "Form 3 small groups; assign the inference re-teach pathway." },
  enrichment: { conf: 88, rec: "Advance 9 students to enrichment", why: "Mastery ≥ 90% on the last 3 assessments with high task completion.", action: "Assign independent investigations and peer-mentoring roles." },
  pd: { conf: 84, rec: "Target PD on formative assessment", why: "Schools with low formative-assessment use show the largest mastery gaps.", action: "Schedule a PD cycle; pair low- with high-implementation teachers." },
  attendance: { conf: 86, rec: "Open attendance outreach for 22 students", why: "Absence > 10% correlates with a 12-point achievement drop in this cohort.", action: "Trigger parent communication and a check-in plan." },
  resource: { conf: 79, rec: "Prioritize 4 schools for resource support", why: "Below-target achievement + staffing gaps + rising absenteeism cluster here.", action: "Allocate coaching and staffing; monitor monthly." }
};
function initInsightEngine() {
  document.querySelectorAll("[data-insight-engine]").forEach(function (root) {
    var out = root.querySelector(".insight-out");
    root.querySelectorAll("[data-signal]").forEach(function (b) {
      b.addEventListener("click", function () {
        root.querySelectorAll("[data-signal]").forEach(function (x) { x.classList.remove("active"); });
        b.classList.add("active");
        var d = INSIGHTS[b.getAttribute("data-signal")]; if (!d) return;
        out.innerHTML = '<div class="ai-pill" style="margin-bottom:0.6rem;">🤖 AI recommendation · confidence ' + d.conf + '%</div>' +
          '<h4 style="margin:0 0 0.4rem;">' + d.rec + '</h4>' +
          '<p><strong>Why (explainable AI):</strong> ' + d.why + '</p>' +
          '<p><strong>Suggested action:</strong> ' + d.action + '</p>' +
          '<p class="muted"><small>A human leader reviews and approves before any action is taken.</small></p>';
        out.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    });
  });
}

/* ---------- Filters ----------  buttons [data-filter] in [data-filter-group] toggle [data-tag] rows */
function initFilters() {
  document.querySelectorAll("[data-filter-group]").forEach(function (group) {
    var targetSel = group.getAttribute("data-filter-target");
    var items = document.querySelectorAll(targetSel);
    group.querySelectorAll("[data-filter]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        group.querySelectorAll("[data-filter]").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var f = btn.getAttribute("data-filter");
        items.forEach(function (it) { it.style.display = (f === "all" || (it.getAttribute("data-tag") || "").indexOf(f) !== -1) ? "" : "none"; });
      });
    });
  });
}

/* ---------- Segmented switchers (show/hide panels) ----------
   <div class="segmented" data-segmented> buttons [data-seg]; panels [data-seg-panel] */
function initSegmented() {
  document.querySelectorAll("[data-segmented]").forEach(function (seg) {
    var scope = seg.getAttribute("data-seg-scope") ? document.querySelector(seg.getAttribute("data-seg-scope")) : document;
    var panels = scope.querySelectorAll("[data-seg-panel]");
    seg.querySelectorAll("[data-seg]").forEach(function (btn, i) {
      btn.addEventListener("click", function () {
        seg.querySelectorAll("[data-seg]").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var key = btn.getAttribute("data-seg");
        panels.forEach(function (p) { p.style.display = p.getAttribute("data-seg-panel") === key ? "" : "none"; });
      });
      if (i === 0) btn.classList.add("active");
    });
    panels.forEach(function (p, i) { p.style.display = i === 0 ? "" : "none"; });
  });
}
