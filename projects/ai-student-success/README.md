# AI Student Success Early Warning System
### An AI-Powered Predictive Analytics & Intervention Platform for K–12 Education

Project #12 in the **Curriculum Innovation & Instructional Design Portfolio** of Dr. Barbara Z.
Franks, part of the **AI for Education Innovation Suite**. Built on the portfolio's shared design
system; deployed at **https://bzafranks.github.io/projects/ai-student-success/**.

## 📘 Project Overview
An enterprise **early-warning and intervention platform** that helps educators identify students who
may benefit from support *earlier*, coordinate MTSS interventions, and monitor progress — by bringing
attendance, academics, behavior, and well-being data together and layering **explainable, responsible
AI**. It supports educator decision-making; it never replaces professional judgment.

## 🎓 Educational Challenge
Schools collect rich data but store it in separate systems, so struggling students are often
identified only after failure. This platform integrates the evidence and surfaces patterns early.

## 🧭 Student Success Philosophy
**Identify earlier, intervene sooner, decide responsibly.** Every recommendation is transparent and
explainable; educators review and decide before any action.

## 🛡️ Responsible AI Principles
Human oversight · transparency · explainability · privacy & student-data protection · bias monitoring ·
data security · consent considerations · appropriate use of predictive analytics · safeguards against
over-reliance on AI.

## ✨ Platform Features
- **Executive Dashboard** — students needing attention, risk distribution, trends, AI briefing
- **Student Risk Dashboard** — risk by student/grade/class/subgroup, heat maps, drill-downs
- **Student Profile** — whole-child view (academics, attendance, behavior, well-being, history)
- **AI Risk Engine** — explainable risk level, contributing factors, confidence, supports, monitoring
- **MTSS Framework** — Tiers 1–3 placement, movement, and team recommendations
- **Intervention Planner** — assign, monitor, manage; progress monitoring + case management
- **Attendance / Academic / Behavior Analytics** — trends, heat maps, predictive bands
- **Well-Being Dashboard** — belonging, engagement, wellness (handled ethically & privately)
- **Family Engagement** — communication, outreach, contact log
- **Reports** — student-success, MTSS, attendance, leadership, district reports
- **Settings & Ethics** — responsible-AI framework, governance, implementation guide
- **Product UX:** command palette (Ctrl/⌘ + K), FAB, notification center, drill-downs, gauges,
  dark mode, and a built-in accessibility toolbar

## 🧩 Pages
`index` · `executive-dashboard` · `risk-dashboard` · `student-profile` · `ai-risk-engine` · `mtss` ·
`interventions` · `attendance` · `academics` · `behavior` · `wellbeing` · `family-engagement` ·
`reports` · `settings` · `case-study` · `reflection` (+ `style.css`, `script.js`, this README).

## 🛠️ Technology Stack
Shared portfolio **design-system.css** + **portfolio.js**, plus a project-local **`style.css`**
(student-success chrome: command center, risk cards, student profiles, MTSS tiers, traffic-light
indicators, gauges, drill-downs, notification center, dark mode) and **`script.js`** (engine:
explainable AI risk engine, report generator, animated gauges/KPIs/bars, drill-downs, command palette,
notifications). Vanilla HTML5/CSS/JS, inline SVG, `localStorage`, no build step.
**All data is fictional sample data; AI is simulated client-side and decision-support only.**

## ▶ Run Locally
Open this folder's `index.html`, or serve the repo root: `python -m http.server`.

## 🚀 Deployment
Part of the `bzafranks.github.io` user-site monorepo. Lives at `/projects/ai-student-success/` and is
registered in `assets/js/projects-data.js`.

## 🔮 Future Roadmap
Predictive graduation pathways · AI attendance assistant · natural-language reporting · voice
assistant · regional benchmarking · district analytics · mobile notifications · community-agency
referrals · API integrations.

## 💼 Portfolio Relevance
Demonstrates the ability to design **AI-powered student success platforms**, apply predictive
analytics responsibly, build MTSS/intervention management systems, translate data into action, develop
human-centered AI for schools, and support equity through early identification and coordinated support.

---
*© Dr. Barbara Z. Franks. A platform prototype for demonstration; all data is fictional and AI is
simulated. Recommendations are decision-support and require educator review.*
