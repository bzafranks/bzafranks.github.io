# PROJECT SPEC — Curriculum Innovation & Instructional Design Portfolio (monorepo)

> Portable rebuild/extend spec for the whole portfolio. Hand to any Claude/developer.

## 1. Summary
The umbrella **monorepo + shared design system** for Dr. Barbara Z. Franks' portfolio
(D.R.E.A.M. Education Solutions). Static site (HTML/CSS/JS, no deps, `localStorage`), hosted as a
**GitHub user site** at the repo `bzafranks.github.io` → root domain `https://bzafranks.github.io/`.
Every project shares ONE `design-system.css` + `portfolio.js`. Two pillars: **Instructional
Design** (gold) and **Instructional Leadership** (teal).

## 2. Brand
D.R.E.A.M. Education Solutions · Dr. Barbara Z. Franks, President & CEO ·
barbara.franks@mydreamedu.org · GitHub github.com/bzafranks. Subtitle: "Innovative Learning
Solutions for Schools, Districts, Ministries of Education, and EdTech Organizations."

## 3. Structure
```
index.html              portfolio home (hero+byline, pillars, project grid w/ filter+search, capabilities, roadmap, contact)
about.html              about Dr. Franks
design-system.html      living style guide
assets/css/design-system.css   single source of truth for ALL styling
assets/js/portfolio.js         shared components + homepage render/filter/search + ribbon injector
assets/js/projects-data.js     PROJECT REGISTRY (window.PORTFOLIO_PROJECTS[]) — add 1 entry = new project
assets/img/
templates/              project-template.html, lesson-template.html, case-study-template.html
projects/grade3/        Grade 3 Asynchronous Learning (re-skinned into the system)
projects/grade5/        Grade 5 Hybrid Learning (re-skinned)
STYLE_GUIDE.md, README.md, PROJECT_SPEC.md
```

## 4. Design system (see STYLE_GUIDE.md + design-system.html)
Palette navy #1f3a5f + gold #d9a441 (+ teal/plum/coral, semantic). Georgia headings / Segoe UI
body. Tokens in `:root`. Components: nav, hero(+byline), cards, project-card, tags, status-dot,
callouts, timeline, stats, tabs, accordion (.acc/.module), tables, lesson-block, video player,
quiz, flashcards, fitb, dnd, progress tracker, dashboard, ach-badge, reflection, annotation,
swatch/type-row (style-guide helpers). Legacy compat block maps Grade-3-era classes (.tint-*,
.badge.*, .module, .card-top-accent) onto the new palette so older markup stays on-brand.

## 5. Shared JS (portfolio.js) — init by data-attrs
nav/active-nav; `initPortfolioRibbon()` (reads `body[data-project][data-project-root]`, injects
`.pf-ribbon`); `initProjectGrid()` (renders/filters/searches from `PORTFOLIO_PROJECTS`); tabs;
quizzes; flashcards; fitb; dnd; progress (`dream:` prefix, fires `progresschange`); reflections
(`dreamrefl:`); annotation; video player (Web Speech, young female voice, captions, interaction
points, single-player); transcript downloads; print; dashboard (aggregates `dream:` progress +
awards `.ach-badge[data-threshold]`); fade-in.

## 6. Registry entry shape (assets/js/projects-data.js)
`{ id, title, subtitle, pillar:'id'|'il', grade, status:'done'|'progress'|'planned', url, icon,
tags:[], summary }`. Live cards link out only when status==='done' && url set.

## 7. Add a project (no redesign)
Copy templates into `projects/<id>/`; link shared CSS/JS; set `data-project`/`data-project-root`
on body; add a registry entry; include a consultant case study. See STYLE_GUIDE.md §10.

## 8. Roadmap projects (planned, in registry)
3 Grade 7 AI personalized (id) · 4 Bahamas competency-based (id) · 5 Bahamas UDL (id) ·
6 Bahamas data-driven instruction (il) · 7 Bahamas career & future skills (id) ·
8 Bahamas AI personalized (id). Grade 3 & 5 = done.

## 9. Deploy
User site: repo MUST be named `bzafranks.github.io`. `gh repo create bzafranks.github.io --public
--source . --remote origin --push`; Pages builds from main root automatically (also settable via
`gh api --method POST repos/bzafranks/bzafranks.github.io/pages -f "source[branch]=main" -f "source[path]=/"`).
`gh auth setup-git` already done so `git push` works. See [[reference-github-portfolio-account]].

## 10. Status & next
DONE: design system, homepage, about, living style guide, 3 templates, docs; Grade 3 & 5
migrated + re-skinned into the monorepo. NEXT: build roadmap projects 3–8 from the templates;
optionally retire/redirect the old standalone grade3/grade5 repos; add real LinkedIn/CV links.
The standalone repos `grade3-async-curriculum` and `grade5-ela-hybrid-curriculum` still exist and
serve their own URLs — the canonical versions now live in this monorepo under /projects/.
```
