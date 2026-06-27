# AI Individual Learning Plan Generator
### An AI-Powered Personalized Learning & Student-Success Planning Platform

Project #13 in the **Curriculum Innovation & Instructional Design Portfolio** of Dr. Barbara Z.
Franks, part of the **AI for Education Innovation Suite**. Built on the portfolio's shared design
system; deployed at **https://bzafranks.github.io/projects/ai-ilp-generator/**.

## 📘 Project Overview
A personalized-learning platform that helps educators generate **Individual Learning Plans (ILPs)**
from multiple sources of evidence — strengths, interests, assessments, attendance, and history — and
turns them into goals, pathways, supports, and family updates. The AI is a **planning assistant**:
educators review, approve, and adapt every recommendation.

## 🎓 Educational Challenge
Teachers know what students need but rarely have time to plan for every learner. Creating individual
plans by hand doesn't scale. This platform synthesizes evidence into a draft plan with clear rationale.

## 🧭 Personalized Learning Philosophy
Personalization at scale, with the educator in charge. Strengths and interests are illustrative
planning inputs (never fixed measures of ability), and every plan is a draft for educator approval.

## 🛡️ Responsible AI Principles
Human oversight · transparency · explainability (every recommendation shows *why*) · bias awareness ·
privacy & student-data protection · responsible personalization · equity · consent · educator review.

## ✨ Platform Features
- **Learning Plan Generator** — full ILP: summary, strengths, goals, strategies, interventions,
  enrichment, assessments, monitoring schedule, and a teacher review/approval section
- **Student Profile** — whole-learner view · **Strengths & Interests** · **Assessment Review**
- **Learning Goals** — SMART goals across 11 domains, visually tracked with progress rings
- **Learning Pathways** — foundational → gifted, with milestones and timelines
- **AI Recommendations** — strategies and resources, each with a rationale
- **Accommodations & Supports** · **Intervention Planner** · **Enrichment Planner**
- **Career Connections** — interests → pathways, experiences, and future skills
- **Parent Portal** — plain-language plan, progress rings, home activities, celebrations
- **Teacher Dashboard** — class overview + NL planning assistant
- **Progress Monitoring** · **Reports** · **Settings & Ethics**
- **Product UX:** command palette (Ctrl/⌘ + K), FAB, autosave, achievement badges, dark mode,
  and a built-in accessibility toolbar

## 🧩 Pages
`index` · `student-profile` · `learning-plan` · `goals` · `pathways` · `strengths` ·
`assessment-review` · `ai-recommendations` · `supports` · `interventions` · `enrichment` ·
`career-connections` · `parent-portal` · `teacher-dashboard` · `progress` · `reports` · `settings` ·
`case-study` · `reflection` (+ `style.css`, `script.js`, this README).

## 🛠️ Technology Stack
Shared portfolio **design-system.css** + **portfolio.js**, plus project-local **`style.css`** (warm
student-centered chrome: learner profiles, goal rings, pathways, achievement badges, recommendation
cards, dark mode) and **`script.js`** (engine: simulated AI plan/goal/pathway/recommendation/support/
intervention/enrichment/career/parent/report generators each with rationale, NL planning assistant,
animated rings/bars/gauges, library). Vanilla HTML5/CSS/JS, `localStorage`, no build step.
**All AI is simulated client-side; data is fictional. The AI is a planning assistant; educators approve.**

## ▶ Run Locally
Open this folder's `index.html`, or serve the repo root: `python -m http.server`.

## 🚀 Deployment
Part of the `bzafranks.github.io` user-site monorepo. Lives at `/projects/ai-ilp-generator/` and is
registered in `assets/js/projects-data.js`.

## 🔮 Future Roadmap
Voice coaching · adaptive learning recommendations · LMS integration · wearable integration · AI
tutoring · career forecasting · digital-portfolio integration · natural-language reports · mobile app.

## 💼 Portfolio Relevance
Demonstrates the ability to design **AI-powered personalized learning platforms**, create scalable
Individual Learning Plan systems, integrate learning analytics into planning, support MTSS &
differentiation, and apply responsible AI that strengthens — rather than replaces — educator judgment.

---
*© Dr. Barbara Z. Franks. A platform prototype for demonstration; all data is fictional and AI is
simulated. The AI is a planning assistant; educators review and approve all plans.*
