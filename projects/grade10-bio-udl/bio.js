/* =====================================================================
   Grade 10 Biology · UDL — virtual lab interactivity
   Loads after shared portfolio.js. Adds:
     • Virtual microscope (low/high power + clickable structures)
     • Enzyme-activity temperature simulation (hypothesis testing)
   All client-side for demonstration; aligned to official Grade 10 units.
   ===================================================================== */
document.addEventListener("DOMContentLoaded", function () {
  initMicroscope();
  initEnzymeSim();
});

/* ---------- Virtual microscope ----------
   <div class="microscope" data-microscope>
     <div class="scope-view"><span class="scope-cell">🦠</span></div>
     <div class="scope-controls">…power buttons [data-power]…</div>
     <p class="scope-readout"></p>
     <div class="scope-parts">…[data-power][data-desc] buttons…</div>
   </div> */
function initMicroscope() {
  document.querySelectorAll("[data-microscope]").forEach(function (root) {
    var cell = root.querySelector(".scope-cell");
    var readout = root.querySelector(".scope-readout");
    var powerBtns = root.querySelectorAll("[data-power]:not(.scope-part)");
    var parts = root.querySelectorAll(".scope-part");
    var power = 1;
    function setPower(p) {
      power = p;
      powerBtns.forEach(function (b) { b.classList.toggle("active", b.getAttribute("data-power") === String(p)); });
      if (cell) cell.style.transform = "scale(" + (p === 2 ? 1.7 : 1.05) + ")";
      parts.forEach(function (pt) { pt.disabled = parseInt(pt.getAttribute("data-power"), 10) > power; });
      if (readout) readout.textContent = power === 2
        ? "🔬 High power (×400): fine organelles are now visible. Click a structure to examine it."
        : "🔬 Low power (×100): large structures are visible. Switch to high power to see organelles.";
    }
    powerBtns.forEach(function (b) { b.addEventListener("click", function () { setPower(parseInt(b.getAttribute("data-power"), 10)); }); });
    parts.forEach(function (pt) {
      pt.addEventListener("click", function () {
        if (pt.disabled) return;
        if (readout) readout.innerHTML = "<strong>" + pt.textContent + ":</strong> " + (pt.getAttribute("data-desc") || "");
        if (cell && pt.getAttribute("data-emoji")) cell.textContent = pt.getAttribute("data-emoji");
      });
    });
    setPower(1);
  });
}

/* ---------- Enzyme-activity temperature simulation ----------
   <div data-enzyme-sim> with .enz-temp, input[range], .sim-bar-fill, .enz-rate */
function initEnzymeSim() {
  document.querySelectorAll("[data-enzyme-sim]").forEach(function (root) {
    var slider = root.querySelector('input[type="range"]');
    var tempOut = root.querySelector(".enz-temp");
    var fill = root.querySelector(".sim-bar-fill");
    var rateOut = root.querySelector(".enz-rate");
    if (!slider) return;
    function rateFor(t) {
      // peaks at ~37°C (human body temp); denatures (irreversibly) above ~50°C
      if (t > 50) return 0;
      if (t <= 37) return Math.round((t / 37) * 100);
      return Math.round(100 * (1 - (t - 37) / 13)); // 37→50 falls to 0
    }
    function label(t, r) {
      if (t > 50) return "🔴 Denatured — the enzyme's shape is destroyed and it no longer works.";
      if (t >= 35 && t <= 40) return "🟢 Optimum temperature — fastest reaction (~37°C, body temp).";
      if (t < 35) return "🔵 Too cool — molecules move slowly, so the reaction is slow.";
      return "🟠 Above optimum — the enzyme is starting to denature.";
    }
    function update() {
      var t = parseInt(slider.value, 10), r = rateFor(t);
      if (tempOut) tempOut.textContent = t;
      if (fill) { fill.style.width = r + "%"; fill.style.background = t > 50 ? "var(--coral)" : "linear-gradient(90deg, var(--teal), var(--gold))"; }
      if (rateOut) rateOut.innerHTML = "Reaction rate: <strong>" + r + "%</strong> — " + label(t, r);
    }
    slider.addEventListener("input", update);
    update();
  });
}
