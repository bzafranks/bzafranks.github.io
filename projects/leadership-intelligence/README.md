# Leadership Intelligence

**Educational Leadership & School Improvement Suite · Leadership Project #10 (L10)**
An executive decision-intelligence platform for educational leadership — measuring leadership effectiveness, organizational health, school performance, teacher retention, and strategic execution through executive dashboards, scorecards, and predictive insights.

Part of the portfolio of **Dr. Barbara Z. Franks**, built on the shared portfolio design system.

🔗 **Live:** https://bzafranks.github.io/leadership-intelligence/

---

## What this is

Most education dashboards show *student* data. Leadership Intelligence is built for **leaders** — ministries, districts, boards, principals, and universities — unifying leadership, people, performance, and strategy analytics into one executive intelligence layer, with predictive views framed as **decision-support, not autopilot**.

A dedicated **Teacher Retention** module operationalizes Dr. Franks' doctoral research on *leadership behaviors influencing teacher retention*.

> All figures throughout the site are **illustrative sample data** created for demonstration. Predictive views are decision-support models designed to assist leaders, not replace professional judgment, and are not predictions about any individual.

## Pages (14)

| Page | Purpose |
|------|---------|
| `index.html` | Marketing landing — vision, research foundation, platform tour |
| `dashboard.html` | **Executive Dashboard** — effectiveness, health, retention, strategy, risk (centerpiece) |
| `leadership-scorecard.html` | Score 8 leadership domains → Leadership Performance Score + actions |
| `school-performance.html` | Academic, attendance, behavior, improvement dashboards |
| `people-analytics.html` | Engagement, satisfaction, pipeline & succession readiness |
| `teacher-retention.html` | Retention analytics + predictive turnover risk (doctoral research module) |
| `strategic-performance.html` | Goals, KPIs, balanced scorecard, milestones |
| `school-health.html` | Ten-domain School Health Index with heat map |
| `predictive-insights.html` | Forecasts & scenario planning (decision-support) |
| `reports.html` | Executive report generator + report library |
| `resources.html` | Rubrics, templates, governance & ethics guides, reading list |
| `case-study.html` | Consulting case study (fictional district) |
| `reflection.html` | First-person professional reflection |

## Architecture

- **Stack:** Vanilla HTML5/CSS3/JS — no frameworks, no build step. GitHub Pages.
- **Shared system:** `../../assets/css/design-system.css`, `../../assets/js/portfolio.js`.
- **Project files:** `style.css` (midnight-indigo `#243b6b` + amber-gold `#e0a13a`, app-shell, dark theme), `script.js` (scorecard engine, report generator, gauges, bar fills, count-ups, drill-downs, notifications, theme toggle).
- **App shell:** sticky `.app-rail` left nav + `.app-main`; `.app-bar` with notification center, export, and dark-mode toggle; command palette (Ctrl/⌘+K).
- **Persistence:** `localStorage` (`li:` prefix).

© Dr. Barbara Z. Franks · All data is illustrative sample data for demonstration.
