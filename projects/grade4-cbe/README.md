# Grade 4 Social Studies: Competency-Based Learning System

*Reimagining the Bahamas National Curriculum Through Mastery-Based Learning.*

Project #4 in the **Curriculum Innovation & Instructional Design Portfolio** of Dr. Barbara Z.
Franks. Built on the portfolio's shared design system; deployed at
**https://bzafranks.github.io/projects/grade4-cbe/**.

## 📘 Project Overview
Transforms the **official Bahamas Grade 4 Social Studies curriculum** into a competency-based
digital learning system. Students progress by **demonstrated mastery**, not seat-time — while
every learning outcome stays faithful to the Ministry's curriculum.

## 🎯 Educational Challenge
Traditional classrooms advance students by time, letting gaps accumulate. Competency-based
education ensures students master essential knowledge and skills before progressing — and gives
them feedback and chances to revise.

## 🧭 Competency-Based Philosophy
Organize learning around **demonstrated competency**: clear progressions, frequent feedback,
authentic performance assessment, digital portfolios, and badges as verified evidence.

## 🇧🇸 Alignment with the Bahamas National Curriculum
Source: **Bahamas Ministry of Education — Primary Social Studies Curriculum, Grades 4–6
(2022–2027).** The Grade 4 outcomes for all **5 strands** (History, Geography, Government,
Economics & Resources, Culture & Heritage) — **21 outcomes** with official codes (1.H, 2.GE,
3.GOV, 4.ER, 5.CH) — were extracted and **preserved verbatim**. Each strand maps to one
competency (C1–C5). See `framework.html` and the downloadable **Curriculum Alignment Map**
(`downloads/Grade4-SS-Curriculum-Alignment-Map.md`). **No curriculum expectations were changed.**

## ✨ Features
- **5 competencies** with knowledge, skills, dispositions, success criteria, evidence of mastery,
  and transfer tasks
- **5 mastery levels** (Beginning → Advanced Mastery) with behaviors, evidence, and feedback —
  plus an interactive self-tracker
- **5 fully built mastery lessons** (one per strand), each with an AI-generated instructional
  video, an interactive activity (timeline, map match, sort, symbol match, flashcards), a mastery
  check, and a claimable digital badge
- **Performance assessment system** + a shared 5-level rubric, self/peer assessment, and an
  **8-badge** digital badging system
- **Student dashboard** with a working **digital portfolio builder**, **teacher dashboard**
  (competency heatmap, gaps, interventions), and **parent dashboard**
- **Implementation guide** (Ministry-facing) and a consulting **case study** + **reflection**

## 🧩 Pages
`index` · `framework` · `competencies` · `progressions` · `units` · `lessons` · `assessment` ·
`student-dashboard` · `teacher-dashboard` · `parent-dashboard` · `implementation` · `case-study`
· `reflection` (+ `cbe.js`, alignment map, this README).

## 🛠️ Technology Stack
Shared portfolio **design-system.css** + **portfolio.js** (no per-project CSS — the brief's
"design system" requirement is met by the portfolio system). A small **`cbe.js`** adds the
portfolio builder, badge claiming, and mastery self-tracker. Vanilla HTML/CSS/JS, `localStorage`,
Web Speech API for video narration, GitHub Pages. Dashboards use illustrative sample data.

## ▶ Run Locally
Open this folder's `index.html`, or serve the repo root (`python -m http.server`) and navigate
from the portfolio home.

## 🚀 Deployment
Part of the `bzafranks.github.io` user-site monorepo — every push to `main` republishes. Lives at
`/projects/grade4-cbe/` and is registered in `assets/js/projects-data.js`.

## 🔮 Future Enhancements
Extract the document's deeper per-objective activities/assessments · build Grades 5–6 from the
same curriculum · teacher moderation + exportable mastery reports · offline-first packaging for
Family Island connectivity.

## 💼 Portfolio Relevance
Demonstrates the ability to modernize a national curriculum while preserving standards, design
competency-based systems and authentic assessment, and build scalable instructional models for
schools and ministries.

---
*Curriculum outcomes © Bahamas Ministry of Education (2022–2027), used for educational
demonstration with fidelity. System design © Dr. Barbara Z. Franks.*
