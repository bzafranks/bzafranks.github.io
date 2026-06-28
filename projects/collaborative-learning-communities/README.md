# Collaborative Learning Communities

**Educational Leadership & School Improvement Suite · Leadership Project #11 (L11)**
A complete operating system for building thriving **Professional Learning Communities (PLCs)** — six PLC pillars, collaborative inquiry, lesson study, job-embedded professional learning, a shared knowledge library, a facilitator toolkit, and a community health dashboard.

Part of the portfolio of **Dr. Barbara Z. Franks**, built on the shared portfolio design system.

🔗 **Live:** https://bzafranks.github.io/projects/collaborative-learning-communities/

---

## What this is

The most powerful professional development happens *between colleagues, on purpose*. This platform gives schools the structures, protocols, and tools to make collaboration deliberate, equitable, and focused on student learning — turning meetings into momentum and individual brilliance into collective capacity.

A through-line to Dr. Franks' doctoral research on *leadership behaviors* connects to the trust and collaborative culture that PLCs depend on.

> All figures throughout the site are **illustrative sample data** created for demonstration. Interactive contributions (the idea wall) save locally in the browser via `localStorage`.

## The six PLC pillars

🎯 Shared Vision & Purpose · 🤝 Collaborative Culture & Trust · 🔍 Collective Inquiry · 📊 Focus on Learning & Results · 🪞 Reflective Practice · 🌱 Distributed Leadership

## Pages (12)

| Page | Purpose |
|------|---------|
| `index.html` | Marketing landing — vision, research foundation, platform tour |
| `dashboard.html` | **Community Dashboard** — health, participation, inquiry cycles, impact (centerpiece) |
| `framework.html` | The six pillars + scored PLC Health Assessment (`#assessment`) |
| `collaborative-inquiry.html` | The repeatable inquiry cycle + four critical questions |
| `meeting-hub.html` | Protocol/agenda generator + live idea wall + meeting timeline |
| `lesson-study.html` | The lesson-study cycle: plan, observe, refine |
| `professional-learning.html` | The case for job-embedded, team-driven PD |
| `knowledge-library.html` | A shared bank of effective practices & artifacts |
| `facilitator-toolkit.html` | Protocols, facilitation moves, troubleshooting |
| `resources.html` | Templates, playbooks, reading list |
| `case-study.html` | Consulting case study (fictional school) |
| `reflection.html` | First-person professional reflection |

## Architecture

- **Stack:** Vanilla HTML5/CSS3/JS — no frameworks, no build step. GitHub Pages.
- **Shared system:** `../../assets/css/design-system.css`, `../../assets/js/portfolio.js`.
- **Project files:** `style.css` (sage-teal `#3d7068` + warm coral `#e0764e`, app-shell, dark theme), `script.js` (PLC Health Assessment engine, protocol generator, live idea wall, gauges, bar fills, count-ups, drill-downs, notifications, theme toggle).
- **App shell:** sticky `.app-rail` left nav + `.app-main`; `.app-bar` with notification center, export, and dark-mode toggle; command palette (Ctrl/⌘+K).
- **Persistence:** `localStorage` (`clc:` prefix — theme, assessment, idea wall).

© Dr. Barbara Z. Franks · All data is illustrative sample data for demonstration.
