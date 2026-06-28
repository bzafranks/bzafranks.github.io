# Executive Leadership Growth System

**Educational Leadership & School Improvement Suite · Leadership Project #12 (L12)**
A comprehensive framework for **evaluating, coaching, and developing exceptional educational leaders** — combining leadership standards, 360° feedback, executive coaching, professional growth plans, a leadership portfolio, and leadership analytics into one executive growth system.

Part of the portfolio of **Dr. Barbara Z. Franks**, built on the shared portfolio design system.

🔗 **Live:** https://bzafranks.github.io/projects/executive-leadership-growth/

---

## The Leadership Development Challenge

Educational leaders shape school performance, teacher retention, culture, and student success — yet most evaluation systems rate leaders once a year instead of developing them all year. This platform reframes leadership evaluation as an ongoing process of **executive coaching, reflection, professional growth, and organizational impact**.

## Framework philosophy

Growth over compliance. Six integrated leadership domains — **Visionary · Instructional · People · Strategic · Operational · Ethical** — each with standards, observable behaviors, evidence sources, growth indicators, and coaching strategies. A through-line to Dr. Franks' doctoral research connects leadership growth to teacher satisfaction, culture, and retention.

> All figures throughout the site are **illustrative sample data**. The self-assessment, growth-plan builder, and reflection journal save locally in the browser via `localStorage`.

## Pages (12)

| Page | Purpose |
|------|---------|
| `index.html` | Marketing landing — vision, research foundation, system tour |
| `dashboard.html` | **Performance Dashboard** — index, growth, coaching, impact (centerpiece) |
| `evaluation-framework.html` | Six leadership domains + Leadership Self-Assessment (`#assessment`) |
| `leadership-standards.html` | Emerging → Distinguished competency progression explorer |
| `360-feedback.html` | Multi-source feedback dashboard + source × domain heat map |
| `executive-coaching.html` | Coaching cycle + reflection journal |
| `growth-plans.html` | Coaching/growth-plan generator + saved growth-plan builder |
| `leadership-portfolio.html` | Digital portfolio of leadership evidence |
| `analytics.html` | Growth, coaching, and impact trends |
| `resources.html` | Rubrics, toolkits, templates, implementation guide, reading list |
| `case-study.html` | Consulting case study (fictional district) |
| `reflection.html` | First-person professional reflection |

## Key features

- **Leadership Self-Assessment** scoring six domains → a Leadership Performance Index (Emerging → Distinguished) with strengths, growth priorities, and coaching focus.
- **Coaching / growth-plan generator** producing 90-day coaching plans, annual goals, coaching agendas, development plans, and succession plans.
- **Saved growth-plan builder** and a **reflection journal**, both persisted in the browser.
- **360° feedback** dashboard, leadership analytics, heat maps, and an executive performance dashboard.

## Technology stack

Vanilla HTML5 / CSS3 / JavaScript — no frameworks, no build step. Shared `../../assets/css/design-system.css` + `../../assets/js/portfolio.js`; project `style.css` (bronze `#6b4226` + muted gold `#caa04a`, app-shell, dark theme) and `script.js` (assessment engine, plan generator, plan builder, journal, gauges, bars, count-ups, drill-downs, notifications, command palette, theme toggle). Persistence via `localStorage` (`elg:` prefix).

## How to run locally

Serve the repository root with any static server (e.g. `python -m http.server`) and open `/projects/executive-leadership-growth/`.

## GitHub Pages deployment

Committed to the `bzafranks.github.io` user-site repo; served at the live URL above under `/projects/`.

## Future roadmap

Coach-facing cohort views, configurable standards frameworks (e.g. PSEL/NELP mapping), exportable evidence binders, and longitudinal multi-cycle analytics.

## Portfolio relevance

Demonstrates the ability to design enterprise-scale executive leadership development systems that combine evaluation, coaching, reflection, analytics, and continuous professional learning — suitable for ministries, districts, universities, leadership academies, and consulting firms.

© Dr. Barbara Z. Franks · All data is illustrative sample data for demonstration.
