# Grade 7 ELA: AI-Powered Personalized Learning System

*A Personalized Learning Ecosystem that Adapts to Every Learner.*

Project #3 in the **Curriculum Innovation & Instructional Design Portfolio** of Dr. Barbara Z.
Franks. Built on the portfolio's shared design system and deployed within the monorepo at
**https://bzafranks.github.io/projects/grade7-ai/**.

## 📘 Project Overview
A flagship AI showcase: a Grade 7 English Language Arts learning ecosystem that uses AI to
personalize instruction, differentiate learning, give instant feedback, recommend next steps,
and surface analytics for teachers — **without replacing them**. It is designed to feel like a
premium AI learning platform, not an online textbook.

## 🎯 Educational Challenge
One teacher cannot personalize for thirty learners at different levels in real time. Thoughtful
instructional design + AI creates an adaptive experience that meets each student where they are
and gives teachers the insight (and time) to do what only they can do.

## 🤖 AI Learning Philosophy
AI **scaffolds thinking — it never gives answers**, and every recommendation is transparent and
**teacher-overridable**. AI augments professional judgment; it never replaces it. (See the
Implementation page for the full responsible-AI and data-privacy framework.)

## ✨ Key Features
- **AI Learning Framework** — a 10-part personalized learning loop + student journey
- **5 personalized paths (A–E)** with an interactive **AI recommendation engine** demo
- **6 standards-aligned units**; one **fully built adaptive lesson** with an AI-generated video,
  inline AI tutor, interactive practice, and an **adaptive exit ticket** that routes by mastery
- **Three interactive AI coaches** — Learning, Writing, Reading (Socratic, scripted demos)
- **Student dashboard** (mastery, goals, badges, recommendations, journal) and
  **teacher dashboard** (class overview, standards heatmap, intervention alerts, AI suggestions)
- **Learning analytics** (donuts, bar charts, heatmaps) + **parent portal** preview
- **Adaptive assessment system** with rubrics, self- and peer assessment
- **Implementation guide** with responsible-AI, privacy, and data-governance sections
- Consulting **case study** + first-person **reflection**

## 🧩 Pages
`index` · `framework` · `learning-paths` · `units` · `lessons` · `ai-coach` ·
`student-dashboard` · `teacher-dashboard` · `analytics` · `assessment` · `implementation` ·
`case-study` · `reflection` (+ `ai.js`, this README).

## 🛠️ Technology Stack
Shared portfolio **design-system.css** + **portfolio.js** (no per-project CSS — the brief's
"design system" requirement is met by the portfolio system). A small project script **`ai.js`**
adds the AI-specific demos: simulated Socratic coaches, the recommendation engine, the adaptive
exit ticket, and animated charts. Vanilla HTML/CSS/JS, `localStorage`, Web Speech API for video
narration, GitHub Pages. **All AI is simulated client-side for demonstration** — production would
use a district-approved LLM behind a Socratic system prompt with logging and safety filters.

## ▶ Run Locally
Open `../../index.html` (portfolio home) and navigate in, or open this folder's `index.html`
directly. (For the portfolio homepage project-grid, serve the repo root with
`python -m http.server` so it can read the registry.)

## 🚀 Deployment
Part of the `bzafranks.github.io` user-site monorepo — every push to `main` republishes. This
project lives at `/projects/grade7-ai/` and is registered in `assets/js/projects-data.js`.

## 🔮 Future Enhancements
Live LLM integration with safety + logging · reading-fluency speech analysis · bias-audited
early-warning models · cross-subject expansion · SCORM/xAPI grade passback.

## 💼 Portfolio Relevance
Demonstrates the ability to design AI-enhanced learning systems, build personalized digital
experiences, apply learning analytics, integrate AI responsibly into K–12, and lead curriculum
innovation and digital transformation — the work of a senior instructional designer, AI learning
architect, or Chief Academic Officer.

---
*Original content for demonstration. Standards reference the Common Core State Standards for
Grade 7 ELA. © Dr. Barbara Z. Franks.*
