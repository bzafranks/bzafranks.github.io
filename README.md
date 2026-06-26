# Curriculum Innovation & Instructional Design Portfolio

[![Live Site](https://img.shields.io/badge/▶_Live_Portfolio-Visit-1f3a5f?style=for-the-badge&logo=github)](https://bzafranks.github.io/)
&nbsp;
[![GitHub Pages](https://img.shields.io/badge/Hosted_on-GitHub_Pages-222?style=for-the-badge&logo=githubpages)](https://bzafranks.github.io/)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Design System](https://img.shields.io/badge/Shared-Design_System-d9a441?style=flat)

> **🔗 Live:** <https://bzafranks.github.io/>

**Innovative Learning Solutions for Schools, Districts, Ministries of Education, and EdTech Organizations.**

The professional portfolio of **Dr. Barbara Z. Franks**, President & CEO of **D.R.E.A.M.
Education Solutions** — a growing collection of complete instructional-design and instructional-
leadership solutions, all built on one shared design system so the whole portfolio feels like a
single premium educational platform.

---

## 🎯 What this repository is
This is the **monorepo and design-system home** for the entire portfolio:

- The **portfolio homepage** (`index.html`) that connects every project.
- The **shared design system** (`assets/css/design-system.css` + `assets/js/portfolio.js`) used by
  every page and every project — a single source of truth.
- A **living style guide** (`design-system.html`).
- Reusable **page templates** (`templates/`).
- All **projects** as subfolders under `projects/`.

## 🧱 Architecture
```
bzafranks.github.io/            ← root domain = portfolio home
├── index.html                  Portfolio homepage (projects, pillars, roadmap, contact)
├── about.html                  About Dr. Franks
├── design-system.html          Living style guide
├── assets/
│   ├── css/design-system.css   THE shared design system (single source of truth)
│   ├── js/portfolio.js         Shared components + homepage logic
│   ├── js/projects-data.js     Project registry — add 1 entry to publish a project
│   └── img/
├── templates/                  project / lesson / case-study starters
├── projects/
│   ├── grade3/                 Grade 3 Asynchronous Learning  (re-skinned)
│   └── grade5/                 Grade 5 Hybrid Learning         (re-skinned)
├── STYLE_GUIDE.md              Written design + contribution guidelines + nav map
├── PROJECT_SPEC.md             Portable rebuild spec
└── README.md
```

## 🎨 Design system (at a glance)
- **Palette:** premium academic **navy `#1f3a5f` + gold `#d9a441`**, with teal/plum/coral accents.
- **Type:** Georgia serif headings + Segoe UI sans body.
- **Two pillars:** Instructional Design (gold) and Instructional Leadership (teal).
- **Components:** nav, hero, cards, project cards, tags, callouts, timeline, stats, tabs,
  accordions, tables, AI video player, quiz, flashcards, drag-and-drop, fill-in-blank, progress
  trackers, dashboards, achievement badges, reflection, annotation — all in one CSS + JS pair.
- **Accessibility:** UDL-minded, keyboard support, captions, color-plus-text, print styles,
  reduced-motion.

## ➕ Adding a new project (no redesign required)
1. Copy `templates/project-template.html` (and `lesson-template.html`) into `projects/<your-project>/`.
2. Link the shared `../../assets/css/design-system.css` and `../../assets/js/portfolio.js`.
3. On `<body>`, set `data-project="Name"` and `data-project-root="../../"` (adds the back-to-portfolio ribbon).
4. Add **one entry** to `assets/js/projects-data.js` — it appears on the homepage automatically.

## ▶ Run locally
- Double-click `index.html`, **or** `python -m http.server 8000` then open `http://localhost:8000`.

## 🚀 Deployment (GitHub Pages — user site)
This repo is named `bzafranks.github.io`, so GitHub Pages serves it at the root domain
`https://bzafranks.github.io/`. Every `git push` to `main` republishes automatically.

## 🧩 Technology Stack
HTML5 · CSS3 (custom properties, Grid/Flexbox) · vanilla JavaScript · Web Speech API ·
`localStorage` · GitHub Pages. No frameworks, no build step, no dependencies.

## 🏫 How organizations could use this
Each project is a complete, adoptable learning system — ready to demo to ministries, districts,
schools, online schools, and EdTech/AI-education companies, or to embed in an LMS.

## 🔮 Future
Six more flagship projects are on the roadmap (Grade 7 AI personalization; Bahamian curriculum
projects for competency-based learning, UDL, data-driven instruction, career & future skills, and
AI). The design system is built to absorb them with zero redesign.

---
*All content is original and created for demonstration. Standards reference the Common Core State
Standards. © D.R.E.A.M. Education Solutions.*
