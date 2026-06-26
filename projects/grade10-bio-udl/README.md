# Grade 10 Biology: Universal Design for Learning Digital Learning System

*Making the Bahamas National Curriculum Accessible to Every Learner.*

Project #5 in the **Curriculum Innovation & Instructional Design Portfolio** of Dr. Barbara Z.
Franks. Built on the portfolio's shared design system; deployed at
**https://bzafranks.github.io/projects/grade10-bio-udl/**.

## 📘 Project Overview
Transforms the **official Bahamas Grade 10 Biology curriculum** into an inclusive digital system
using **Universal Design for Learning (UDL)** — removing barriers while preserving full academic
rigor and curriculum fidelity.

## 🎯 Educational Challenge
Students arrive with very different backgrounds, languages, executive-functioning skills,
accessibility needs, and prior knowledge. Traditional instruction assumes one pathway; UDL
provides multiple pathways so every learner can access the same rigorous Biology curriculum.

## 🧭 UDL Philosophy
Design for learner variability **from the start**, across three principles:
**Engagement** (the why), **Representation** (the what), and **Action & Expression** (the how).
Same outcomes; multiple routes.

## 🇧🇸 Alignment with the Bahamas National Curriculum
Source: **Bahamas Ministry of Education — Biology Curriculum, Grades 10–12 (2010)**, Grade 10
Scope of Work. **5 strands / 14 units** with learner outcomes **preserved verbatim**
(Environmental Biology; Cell Biology & Genetics; Nutrition & Food Supply; Plant Anatomy &
Physiology; Animal Anatomy & Physiology). See `curriculum.html` and the downloadable
**Curriculum Alignment Map** (`downloads/Grade10-Biology-Curriculum-Alignment-Map.md`).
**No curriculum expectations were changed.**

## ♿ Accessibility Features
A **live accessibility toolbar** (text scaling, high contrast, readable/dyslexia-friendly font,
read-aloud — persists across pages), plus captions, transcripts, keyboard navigation, alt
text/labels, glossary & simplified summaries, reduced-motion support, and printable fallbacks.
Built to WCAG- and UDL-aligned standards. See `accessibility.html`.

## ✨ Features
- The **3 UDL principles** with Biology-specific options (`udl-framework.html`)
- **5 strands / 14 units** preserved from the curriculum (`curriculum.html`, `units.html`)
- **5 fully built UDL lessons** (one per strand) with AI video, multiple learning pathways,
  interactives, choice of how to show mastery, and knowledge checks (`lessons.html`)
- **Virtual Laboratory** — a working **virtual microscope** and **enzyme-activity simulation**,
  plus a virtual field study and lab-safety module (`virtual-lab.html`)
- **Teacher Resource Center**, **Student Learning Hub**, **Assessment System**,
  **Implementation Guide**, consulting **Case Study**, and **Reflection**
- **Delivery modes:** synchronous + asynchronous, in school or virtually, with or without a teacher

## 🧩 Pages
`index` · `udl-framework` · `curriculum` · `units` · `lessons` · `virtual-lab` · `teacher` ·
`student` · `accessibility` · `assessment` · `implementation` · `case-study` · `reflection`
(+ `bio.js`, alignment map, this README).

## 🛠️ Technology Stack
Shared portfolio **design-system.css** + **portfolio.js** (which now includes the reusable
**accessibility toolbar** — enabled via `data-a11y-toolbar` on `<body>`). A small **`bio.js`**
powers the virtual microscope and enzyme simulation. Vanilla HTML/CSS/JS, `localStorage`, Web
Speech API for narration & read-aloud, GitHub Pages. Virtual labs/dashboards use illustrative
data for demonstration.

## ▶ Run Locally
Open this folder's `index.html`, or serve the repo root (`python -m http.server`).

## 🚀 Deployment
Part of the `bzafranks.github.io` user-site monorepo — every push to `main` republishes. Lives at
`/projects/grade10-bio-udl/` and is registered in `assets/js/projects-data.js`.

## 🔮 Future Enhancements
More virtual labs &amp; dissection alternatives · full multilingual narration/glossary · build
Grades 11–12 Biology from the same curriculum · usability testing with assistive-tech users.

## 💼 Portfolio Relevance
Demonstrates the ability to design inclusive curriculum aligned to national standards, apply UDL
at a system level, build accessible digital science with virtual labs, and support diverse
learners without compromising rigor.

---
*Curriculum outcomes © Bahamas Ministry of Education (2010), used for educational demonstration
with fidelity. System design © Dr. Barbara Z. Franks.*
