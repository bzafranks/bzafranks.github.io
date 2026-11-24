/* WS9 online module: quick checks, branching scenario, knowledge check,
   saved reflections (this browser only) and a downloadable plan. */
(function () {
  "use strict";
  var KEY = "cp-ws9-";
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(KEY + k); localStorage.setItem(KEY + k, v); } catch (e) { return null; } }

  /* Saved text fields */
  document.querySelectorAll("[data-save]").forEach(function (el) {
    var k = el.getAttribute("data-save");
    var v = store(k); if (v) el.value = v;
    el.addEventListener("input", function () { store(k, el.value); });
  });

  /* Progress chips: mark a step done once the reader scrolls past it */
  var chips = {};
  document.querySelectorAll(".m-progress a[data-step]").forEach(function (a) { chips[a.getAttribute("data-step")] = a; });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting && chips[en.target.id]) chips[en.target.id].classList.add("done"); });
    }, { rootMargin: "0px 0px -60% 0px" });
    Object.keys(chips).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* Quick check in lesson 2 */
  document.querySelectorAll("[data-quick]").forEach(function (g) {
    var right = g.getAttribute("data-quick"), fb = g.querySelector("[data-fb]");
    var msg = {
      evidence: "Yes. It is a count of what was seen, with no judgment attached.",
      effect: "Not quite. Effect connects the behavior to student learning. This sentence only reports what was seen, so it is Evidence.",
      question: "Not quite. There is no question here. It reports what was seen, so it is Evidence."
    };
    g.querySelectorAll(".m-choice").forEach(function (b) {
      b.addEventListener("click", function () {
        g.querySelectorAll(".m-choice").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        var v = b.getAttribute("data-v");
        fb.hidden = false; fb.className = "m-feedback " + (v === right ? "good" : "weak"); fb.textContent = msg[v];
      });
    });
  });

  /* Branching scenario: three decision points */
  var S = {
    start: {
      say: "You sit down with Ms. Rolle after school. How do you open?",
      opts: [
        { t: "\"I'd like to focus on one part today: independent reading. What did you notice about it?\"", next: "d2", q: "good", fb: "Strong opening. One focus, and the first thinking belongs to Ms. Rolle." },
        { t: "\"Overall it was a good lesson, but there are a few things to fix.\"", next: "d2b", q: "weak", fb: "This opens with a verdict and signals a list. Ms. Rolle is likely to wait for the bad news instead of thinking." },
        { t: "\"I noticed a lot of things. Let me go through my notes.\"", next: "d2b", q: "weak", fb: "This sets up a monologue. You will do the talking, and the plan will be yours, not hers." }
      ]
    },
    d2: {
      say: "Ms. Rolle says: \"I think it went fine. I got a lot done with my group.\" What do you say next?",
      opts: [
        { t: "\"You did. While you were with the group, I watched the back table. The three students there read for about four minutes, then spent the rest of the time drawing and sharpening pencils.\"", next: "d3", q: "good", fb: "Evidence, stated plainly and acknowledged alongside what went well. It is specific enough to think about." },
        { t: "\"The back table was off task.\"", next: "d3b", q: "weak", fb: "\"Off task\" is a judgment, and it is vague. Ms. Rolle may disagree or feel criticized. Describe what you saw instead." },
        { t: "\"Good. Do you have any questions for me?\"", next: "end-miss", q: "weak", fb: "This ends the conversation before the most important point. The back table loses about fifteen minutes of reading again next week." }
      ]
    },
    d2b: {
      say: "Ms. Rolle looks a little tense and says: \"Okay. What do I need to fix?\" You can still recover. What do you say?",
      opts: [
        { t: "\"Let me back up. I want to look at just one thing with you: independent reading. While you were with your group, the three students at the back table read for about four minutes, then stopped.\"", next: "d3", q: "good", fb: "Good recovery. You narrowed to one focus and moved to evidence." },
        { t: "\"First, the back table. Second, your transitions. Third, the read-aloud pacing.\"", next: "end-miss", q: "weak", fb: "A list. Ms. Rolle will leave with three items and probably act on none." }
      ]
    },
    d3: {
      say: "Ms. Rolle frowns: \"I didn't notice that. I was so focused on my group.\" What do you do?",
      opts: [
        { t: "Ask: \"That makes sense, your group needed you. What could help the back table keep reading while you're with a group?\" Then wait.", next: "end-good", q: "good", fb: "A real question, then silence. Ms. Rolle does the problem-solving, so the plan is hers." },
        { t: "Say: \"You should look up every five minutes and check the room.\"", next: "end-ok", q: "weak", fb: "It is a reasonable fix, but it is yours. Ms. Rolle may agree politely and not do it. Ask first; offer an idea only if she is stuck." },
        { t: "Say: \"It's fine, it happens to everyone,\" and move on.", next: "end-miss", q: "weak", fb: "Reassurance matters, but moving on means nothing changes for those three students." }
      ]
    },
    d3b: {
      say: "Ms. Rolle says: \"They're usually fine. I don't think they were off task.\" What do you do?",
      opts: [
        { t: "\"You may be right that it's usually fine. Today I watched them from about ten minutes in. They read for around four minutes, then put the books down. What do you make of that?\"", next: "end-good", q: "good", fb: "You replaced the judgment with evidence and a question. The disagreement turns into thinking." },
        { t: "\"Trust me, they were.\"", next: "end-miss", q: "weak", fb: "Now it is a disagreement about your opinion. Evidence would have avoided this." }
      ]
    },
    "end-good": { end: true, say: "Ms. Rolle suggests giving the back table a short reading goal and a sticky note to record one question about their book, which she will check when her group ends. You agree to visit during Thursday's independent reading. This is the shape of a conversation that changes practice: one focus, evidence, her idea, and a date." },
    "end-ok": { end: true, say: "Ms. Rolle agrees to look up every five minutes. It may help, but it is your plan, not hers. Next time, ask before you suggest." },
    "end-miss": { end: true, say: "The conversation ends without a specific next step. The back table's reading time is likely to be lost again next week. Try the scenario again and look for the moves that keep Ms. Rolle thinking." }
  };
  var box = document.getElementById("scenario");
  function render(id, trail) {
    var n = S[id]; box.innerHTML = "";
    trail.forEach(function (t) {
      var p = document.createElement("div"); p.className = "m-feedback " + t.q;
      p.innerHTML = "<strong>You chose:</strong> " + t.t + "<br>" + t.fb; box.appendChild(p);
    });
    var say = document.createElement("p"); say.className = "m-dialog"; say.innerHTML = "<strong>" + (n.end ? "Outcome: " : "") + "</strong>" + n.say;
    box.appendChild(say);
    if (n.end) { var f = box.querySelector(".m-dialog"); if (f) f.setAttribute("tabindex", "-1"), f.focus({ preventScroll: true }); return; }
    n.opts.forEach(function (o) {
      var b = document.createElement("button"); b.type = "button"; b.className = "m-choice"; b.textContent = o.t;
      b.addEventListener("click", function () { render(o.next, trail.concat([o])); var c = box.querySelector(".m-choice, .m-dialog"); if (c && c.focus) c.focus({ preventScroll: true }); });
      box.appendChild(b);
    });
  }
  if (box) {
    render("start", []);
    var rs = document.getElementById("scenario-reset"); if (rs) rs.addEventListener("click", function () { render("start", []); });
  }

  /* Knowledge check */
  var KEYS = { k1: "b", k2: "c", k3: "a", k4: "b", k5: "c" };
  var WHY = {
    k1: "One focus plus a question invites the teacher to think first.",
    k2: "A timed observation is evidence. \"Slow\" and \"bored\" are judgments.",
    k3: "One focus per conversation. Five items become a list nobody acts on.",
    k4: "Silence is thinking time. Answering your own question takes the thinking away.",
    k5: "Specific action, a time, and a way to check it."
  };
  var kc = document.getElementById("kc");
  if (kc) kc.addEventListener("submit", function (e) {
    e.preventDefault();
    var score = 0, out = [];
    Object.keys(KEYS).forEach(function (k, i) {
      var c = kc.querySelector("input[name=" + k + "]:checked");
      var ok = c && c.value === KEYS[k]; if (ok) score++;
      out.push("<li>" + (ok ? "Correct" : (c ? "Not yet" : "No answer")) + ": " + WHY[k] + "</li>");
    });
    document.getElementById("kc-result").innerHTML = "<div class=\"m-feedback " + (score >= 4 ? "good" : "weak") + "\"><p><strong>" + score + " of 5 correct.</strong> " + (score >= 4 ? "You're ready for the live session." : "Review Lesson 2, then try again.") + "</p><ol>" + out.join("") + "</ol></div>";
  });

  /* Download plan */
  var dl = document.getElementById("plan-download");
  if (dl) dl.addEventListener("click", function () {
    function v(id) { var el = document.getElementById(id); return el ? el.value : ""; }
    var txt = "FEEDBACK CONVERSATION PLAN\n\nFocus: " + v("p-focus") + "\n\n1. Evidence: " + v("p-ev") + "\n\n2. Effect: " + v("p-eff") + "\n\n3. Question: " + v("p-q") + "\n\n4. Next step and check-in: " + v("p-next") + "\n";
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([txt], { type: "text/plain" }));
    a.download = "feedback-conversation-plan.txt"; document.body.appendChild(a); a.click(); a.remove();
  });
})();
