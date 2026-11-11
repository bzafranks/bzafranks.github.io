/* =====================================================================
   Sample learning module: deterministic, client-side only.
   Answers and feedback come from #module-data (generated from
   _src/content.mjs). Nothing is stored or transmitted.
   ===================================================================== */
(function () {
  "use strict";
  var root = document.querySelector("[data-module]");
  if (!root) return;
  var D = JSON.parse(document.getElementById("module-data").textContent);
  document.documentElement.classList.add("js");

  var steps = Array.prototype.slice.call(root.querySelectorAll(".m-step"));
  var bar = document.getElementById("m-bar");
  var label = document.getElementById("m-step-label");
  var cur = 0;
  // score[obj] = { right, total }
  var score = {};

  function show(i, focus) {
    cur = i;
    steps.forEach(function (s, j) { s.classList.toggle("on", j === i); });
    bar.style.width = ((i + 1) / steps.length * 100) + "%";
    label.textContent = "Step " + (i + 1) + " of " + steps.length + " · " + steps[i].getAttribute("data-name");
    if (focus) {
      var h = steps[i].querySelector("h2");
      if (h) h.focus();
      var top = root.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: top, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
  }

  function record(key, obj, right, total) { score[key] = { obj: obj, right: right, total: total }; }

  function fb(el, ok, text) {
    el.className = "m-fb " + (ok ? "ok" : "no");
    el.textContent = text;
  }
  function msg(step, text) { step.querySelector(".m-msg").textContent = text || ""; }
  function unlock(step) { var n = step.querySelector("[data-next]"); n.disabled = false; n.focus(); }

  var checks = {
    sort: function (step) {
      var sets = step.querySelectorAll("[data-sort]"), missing = 0, right = 0;
      sets.forEach(function (fs) { if (!fs.querySelector("input:checked")) missing++; });
      if (missing) return msg(step, "Choose an option for every task (" + missing + " left).");
      msg(step);
      D.sort.forEach(function (t) {
        var fs = step.querySelector('[data-sort="' + t.id + '"]');
        var chosen = fs.querySelector("input:checked");
        var ok = chosen.value === t.answer;
        if (ok) right++;
        fs.querySelectorAll(".m-opt").forEach(function (l) {
          var inp = l.querySelector("input");
          l.classList.toggle("is-right", inp.value === t.answer);
          l.classList.toggle("is-wrong", inp.checked && !ok);
        });
        fb(fs.querySelector(".m-fb"), ok, t.fb);
      });
      record("sort", "o1", right, D.sort.length);
      unlock(step);
    },
    draft: function (step) {
      var right = 0, anyChecked = step.querySelector(".m-sent input:checked");
      if (!anyChecked) return msg(step, "Select at least one sentence that needs correcting.");
      msg(step);
      D.draft.forEach(function (s) {
        var lab = step.querySelector('.m-sent[data-id="' + s.id + '"]');
        var sel = lab.querySelector("input").checked;
        var ok = sel === s.flaw;
        if (ok) right++;
        fb(lab.querySelector(".m-fb"), ok, s.fb);
      });
      record("draft", "o2", right, D.draft.length);
      unlock(step);
    },
    safe: function (step) {
      var fs = step.querySelector("[data-safe]");
      if (!fs.querySelector("input:checked")) return msg(step, "Select at least one option.");
      msg(step);
      var right = 0;
      fs.querySelectorAll(".m-opt").forEach(function (l, i) {
        var inp = l.querySelector("input"), should = D.safe[i];
        if (inp.checked === should) right++;
        l.classList.toggle("is-right", should);
        l.classList.toggle("is-wrong", inp.checked && !should);
      });
      fb(fs.querySelector(".m-fb"), right === D.safe.length, (right === D.safe.length ? "" : right + " of " + D.safe.length + " choices were right. ") + D.safeFb);
      record("safe", "o3", right, D.safe.length);
      unlock(step);
    },
    quiz: function (step) {
      var sets = step.querySelectorAll("[data-quiz]"), missing = 0;
      sets.forEach(function (fs) { if (!fs.querySelector("input:checked")) missing++; });
      if (missing) return msg(step, "Answer every question (" + missing + " left).");
      msg(step);
      var byObj = {};
      D.quiz.forEach(function (q, i) {
        var fs = step.querySelector('[data-quiz="' + i + '"]');
        var chosen = +fs.querySelector("input:checked").value;
        var ok = chosen === q.correct;
        byObj[q.obj] = byObj[q.obj] || [0, 0];
        byObj[q.obj][1]++; if (ok) byObj[q.obj][0]++;
        fs.querySelectorAll(".m-opt").forEach(function (l, j) {
          l.classList.toggle("is-right", j === q.correct);
          l.classList.toggle("is-wrong", j === chosen && !ok);
        });
        fb(fs.querySelector(".m-fb"), ok, q.fb);
      });
      Object.keys(byObj).forEach(function (o) { record("quiz-" + o, o, byObj[o][0], byObj[o][1]); });
      unlock(step);
    },
  };

  function results() {
    var per = {};
    D.objectives.forEach(function (o) { per[o.id] = [0, 0]; });
    Object.keys(score).forEach(function (k) { var s = score[k]; per[s.obj][0] += s.right; per[s.obj][1] += s.total; });
    var R = 0, T = 0, minPct = 100, weakest = null;
    var rows = D.objectives.map(function (o, i) {
      var p = per[o.id], pct = p[1] ? Math.round(p[0] / p[1] * 100) : 0;
      R += p[0]; T += p[1];
      if (pct < minPct) { minPct = pct; weakest = i + 1; }
      return '<li><div class="t"><span><strong>Objective ' + (i + 1) + ':</strong> ' + esc(o.text) + '</span><span>' + pct + "%</span></div>" +
        '<div class="trk" role="img" aria-label="Objective ' + (i + 1) + ": " + pct + ' percent"><div class="fill' + (pct < 60 ? " low" : "") + '" style="width:' + pct + '%"></div></div></li>';
    }).join("");
    var overall = T ? Math.round(R / T * 100) : 0;
    var met = overall >= 80 && minPct >= 60;
    var head = met
      ? '<div class="badge-x met"><span class="seal" aria-hidden="true">✓</span><div><h3>Competency demonstrated</h3><p>Overall ' + overall + "%. You applied responsible AI use across all three objectives. In a live programme, you would be ready for Level 3 role-specific pathways.</p></div></div>"
      : '<div class="badge-x dev"><span class="seal" aria-hidden="true">' + overall + '%</span><div><h3>Developing: not yet demonstrated</h3><p>Overall ' + overall + "%. Review Objective " + weakest + " and try again. In a live programme, you would get targeted practice and coaching here.</p></div></div>";
    document.getElementById("m-result").innerHTML = head + '<ul class="m-bars">' + rows + "</ul>";
  }

  function esc(s) { var d = document.createElement("div"); d.textContent = s; return d.innerHTML; }

  root.addEventListener("click", function (e) {
    var t = e.target.closest("button");
    if (!t) return;
    var step = t.closest(".m-step");
    if (t.hasAttribute("data-next")) {
      if (cur + 1 === steps.length - 1) results();
      show(cur + 1, true);
    } else if (t.hasAttribute("data-check")) {
      checks[t.getAttribute("data-check")](step);
    } else if (t.hasAttribute("data-restart")) {
      score = {};
      root.querySelectorAll("input").forEach(function (i) { i.checked = false; });
      root.querySelectorAll(".m-fb").forEach(function (f) { f.className = "m-fb"; f.textContent = ""; });
      root.querySelectorAll(".is-right,.is-wrong").forEach(function (l) { l.classList.remove("is-right", "is-wrong"); });
      root.querySelectorAll("[data-next]").forEach(function (b, i) { if (i > 0) b.disabled = true; });
      show(0, true);
    } else if (t.hasAttribute("data-print")) {
      window.print();
    }
  });

  show(0, false);
})();
