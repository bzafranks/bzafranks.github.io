/* =====================================================================
   Grade 7 AI-Powered Personalized Learning — project interactivity
   Loads AFTER the shared portfolio.js. Adds the AI-specific demos:
     • Simulated AI coaches (Socratic — never gives the answer)
     • AI recommendation engine demo
     • Adaptive exit ticket that routes to a learning path
     • Animated bar charts
   All simulated client-side for demonstration (no external AI calls).
   ===================================================================== */
document.addEventListener("DOMContentLoaded", function () {
  initCoaches();
  initRecommender();
  initAdaptive();
  animateBars();
});

/* ---------- Simulated AI coaches ----------
   <div class="chat" data-coach="tutor|writing|reading"> with
   <div class="chat-log"></div> and <div class="chat-suggest"></div> */
var COACH = {
  tutor: {
    name: "AI Learning Coach", bot: "🤖",
    intro: "Hi! I'm your AI Learning Coach. I won't just hand you answers — I'll help you think it through. What do you need?",
    qa: [
      ["I don't understand theme", "Great place to start! Think about the whole story: what lesson did the main character learn by the end? Try finishing this sentence — “The story shows that…” — and I'll help you sharpen it. 💡"],
      ["Give me a hint", "I'll nudge, not hand it over (the win should be yours!). Reread the paragraph and underline the moment the character makes a choice. What does that choice reveal about them? 🔎"],
      ["I'm frustrated", "I hear you — frustration usually means your brain is stretching. Let's shrink the step: tell me the part that DOES make sense, and we'll build out from there. You've got this. 🌱"],
      ["What should I review?", "Your last mastery check showed inference at 60%. Want two short practice passages to push it to green? I'll cheer you on the whole way. 📈"]
    ]
  },
  writing: {
    name: "AI Writing Coach", bot: "✍️",
    intro: "I'm your AI Writing Coach. I help you plan, revise, and grow as a writer — your words stay yours. Where are you in the process?",
    qa: [
      ["Help me plan an argument", "Let's build your blueprint. First, your claim: what's the ONE thing you want your reader to believe? Say it in a sentence, then we'll line up two reasons and the evidence for each. 🧱"],
      ["Improve this sentence", "Paste your sentence and I'll coach — not rewrite. Usually we look at: Is there a stronger verb? Can you cut a filler word? Does it say exactly what you mean? Which of those feels worth trying first? ✨"],
      ["Is my organization clear?", "Good writers check the skeleton. Does each paragraph have ONE main idea? Read just your first sentences in order — do they tell a logical story on their own? Tell me what you notice. 🗂️"],
      ["I finished — now what?", "Nice work! Before you call it done: read it out loud, fix anything that makes you stumble, then set one goal for next time (“next time I'll…”). What's your goal? 🎯"]
    ]
  },
  reading: {
    name: "AI Reading Coach", bot: "📖",
    intro: "I'm your AI Reading Coach. I help you dig into texts — vocabulary, inference, theme, and more. What are you working on?",
    qa: [
      ["What does this word mean?", "Let's use the text like a detective. Read the sentence before and after it — what clues hint at the meaning? Make a guess, then we'll check it together. 🔍"],
      ["Summarize this for me", "You'll remember it far better if you do it — I'll guide! Try “Somebody-Wanted-But-So-Then.” Who's the somebody, and what did they want? Start there. 📝"],
      ["Help me find the theme", "Theme = the big idea about life. What does the main character struggle with, and what do they learn? Put those together in one sentence and show me — I'll help you refine it. 💭"],
      ["Predict what happens next", "Smart readers predict with evidence. What just changed for the character, and what do you already know about how people react to that? Make your prediction and name your clue. 🔮"]
    ]
  }
};
function initCoaches() {
  document.querySelectorAll("[data-coach]").forEach(function (root) {
    var spec = COACH[root.getAttribute("data-coach")];
    if (!spec) return;
    var log = root.querySelector(".chat-log");
    var suggest = root.querySelector(".chat-suggest");
    add(log, "coach", spec.name, spec.intro);
    spec.qa.forEach(function (pair) {
      var chip = document.createElement("button");
      chip.type = "button"; chip.className = "chat-chip"; chip.textContent = pair[0];
      chip.addEventListener("click", function () {
        add(log, "user", "You", pair[0]);
        var typing = add(log, "coach", spec.name, "…thinking with you");
        typing.classList.add("chat-typing");
        log.scrollTop = log.scrollHeight;
        setTimeout(function () {
          typing.classList.remove("chat-typing");
          typing.querySelector(".msg-text").textContent = pair[1];
          log.scrollTop = log.scrollHeight;
        }, 750);
      });
      suggest.appendChild(chip);
    });
  });
  function add(log, who, label, text) {
    var m = document.createElement("div");
    m.className = "chat-msg " + who;
    m.innerHTML = '<span class="who"></span><span class="msg-text"></span>';
    m.querySelector(".who").textContent = label;
    m.querySelector(".msg-text").textContent = text;
    log.appendChild(m); log.scrollTop = log.scrollHeight;
    return m;
  }
}

/* ---------- AI recommendation engine demo ----------
   <div data-recommender> with .rec-output target */
var REC = {
  low:  { path: "Path A · Targeted Support", items: [["🎬","Re-watch the mini-lesson video","Rebuilds the core concept at your pace"],["🧩","Guided practice with hints","Scaffolds each step before you go solo"],["🗂️","Vocabulary pre-teach","Front-loads the words you'll need"]] },
  mid:  { path: "Path B · On-Grade Practice", items: [["📄","Targeted practice passage","Matched to the skill you're building"],["📝","Short adaptive quiz","Confirms you're ready to move on"],["💬","Peer discussion prompt","Deepens thinking by explaining to others"]] },
  high: { path: "Path C · Application", items: [["🛠️","Applied performance task","Use the skill in a new context"],["🪞","Self-check + reflection","Names what's working and the next stretch"],["📈","Optional challenge passage","A harder text to test mastery"]] },
  top:  { path: "Path D/E · Advanced & Creative", items: [["🔬","Independent analysis challenge","Compare two complex texts"],["🎨","Creative extension","Reimagine the text in a new medium"],["🧠","Mentor a peer","Teaching is the deepest mastery"]] }
};
function initRecommender() {
  document.querySelectorAll("[data-recommender]").forEach(function (root) {
    var out = root.querySelector(".rec-output");
    root.querySelectorAll("[data-score]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        root.querySelectorAll("[data-score]").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var r = REC[btn.getAttribute("data-score")];
        var html = '<div class="ai-pill" style="margin-bottom:0.8rem;">🤖 AI recommendation</div>' +
          '<h4 style="margin:0 0 0.6rem;">' + r.path + '</h4>';
        r.items.forEach(function (it) {
          html += '<div class="rec"><span class="rec-ico">' + it[0] + '</span><div class="rec-body"><b>' + it[1] + '</b><div class="rec-why">' + it[2] + '</div></div></div>';
        });
        out.innerHTML = html;
      });
    });
  });
}

/* ---------- Adaptive exit ticket ----------
   <div data-adaptive> contains .quiz-q (data-answer) blocks + .adaptive-result */
function initAdaptive() {
  document.querySelectorAll("[data-adaptive]").forEach(function (root) {
    var qs = root.querySelectorAll(".quiz-q");
    var result = root.querySelector(".adaptive-result");
    var total = qs.length, answered = 0, correct = 0;
    qs.forEach(function (q) {
      var ans = parseInt(q.getAttribute("data-answer"), 10);
      var opts = q.querySelectorAll(".quiz-option");
      var done = false;
      opts.forEach(function (opt, i) {
        opt.addEventListener("click", function () {
          if (done) return; done = true; answered++;
          if (i === ans) { opt.classList.add("correct"); correct++; } else { opt.classList.add("incorrect"); opts[ans].classList.add("correct"); }
          opts.forEach(function (o) { o.disabled = true; });
          if (answered === total) route();
        });
      });
    });
    function route() {
      var msg, path;
      if (correct <= 1) { path = "Path A · Targeted Support"; msg = "Let's strengthen the foundation first — your personalized path starts with a quick re-teach and guided practice. No worries; this is how mastery is built. 🌱"; }
      else if (correct === 2) { path = "Path B · On-Grade Practice"; msg = "You're on track! Your path continues with focused practice and a peer discussion to lock it in. 👍"; }
      else { path = "Path C/D · Application & Challenge"; msg = "Mastery achieved! 🎉 Your path unlocks an application task and an optional advanced challenge. Ready to stretch?"; }
      result.innerHTML = '<div class="callout note"><div class="ai-pill" style="margin-bottom:0.6rem;">🤖 Adaptive routing</div>' +
        '<h4 style="margin:0 0 0.3rem;">' + correct + " / " + total + " — " + path + '</h4><p style="margin:0;">' + msg + '</p></div>';
      result.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  });
}

/* ---------- Animate bar charts on view ---------- */
function animateBars() {
  document.querySelectorAll(".barchart .bar[data-h]").forEach(function (bar) {
    var h = bar.getAttribute("data-h");
    bar.style.height = "0%";
    requestAnimationFrame(function () { setTimeout(function () { bar.style.height = h + "%"; }, 120); });
  });
}
