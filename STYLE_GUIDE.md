# D.R.E.A.M. Education Solutions — Portfolio Style Guide

The contract every project follows so the portfolio reads as one premium platform.
This is the written companion to the living style guide at `design-system.html`.

---

## 1. Brand & Voice
- **Brand:** D.R.E.A.M. Education Solutions · **Owner:** Dr. Barbara Z. Franks, President & CEO.
- **Portfolio:** Curriculum Innovation & Instructional Design Portfolio.
- **Subtitle:** Innovative Learning Solutions for Schools, Districts, Ministries of Education, and EdTech Organizations.
- **Personality:** authoritative, modern, warm, evidence-based. Academic credibility (serif
  headings) + approachable clarity (sans body). Think Khan Academy / Coursera polish with a
  consultant's professionalism.
- **Two pillars (every project belongs to one):**
  - **Instructional Design** — accent **gold** (`--pillar-id`).
  - **Instructional Leadership** — accent **teal** (`--pillar-il`).

## 2. Design Tokens (defined in `assets/css/design-system.css :root`)
- **Color:** navy `#1f3a5f`, navy-dark `#162b46`, gold `#d9a441`, teal `#2f8f8a`, plum `#7b5ea7`,
  coral `#e07a5f`; success `#4c9a6e`, warning `#e0a32f`, info `#2f6f9f`, danger `#c2503b`;
  bg `#f6f8fb`, surface `#fff`, ink `#21303d`. Always use the variables, never hard-coded hex.
- **Type:** `--font-head` Georgia (headings), `--font-body` Segoe UI (body), `--font-code` mono.
- **Spacing scale:** `--s1`…`--s8` (8px base). **Radii:** `--radius-sm/–/–lg`. **Max width:** 1180px.

## 3. Layout
- Wrap content in `.container` (or `.container.narrow` for prose).
- Sections use `.section` / `.section-tight`; alternate backgrounds with `.section-alt` / `.section-warm` / `.section-navy`.
- Grids: `.grid.grid-2/3/4` (auto-fit, responsive).
- Section intros use `.section-head` with an `.eyebrow` label.

## 4. Components (use these — don't reinvent)
Buttons `.btn/.secondary/.ghost/.small` · cards `.card(.feature/.compact/.hoverable)` ·
project cards `.project-card` · tags `.tag(.gold/.teal/.plum/.leaf/.coral/.navy)` ·
status dots `.status-dot(.done/.progress/.planned)` · callouts `.callout(.tip/.note/.warn)` ·
`.timeline` · `.stat-row` · `.tabs[data-tabs]` · `.acc`/`details.acc` · `.table-wrap`+`table` ·
`.lesson-block(.gold/.teal/.plum/.coral/.leaf)` · video player `.video-player` ·
`[data-quiz]` · `[data-flashcards]` · `[data-fitb]` · `[data-dnd]` · `[data-progress]` ·
`[data-reflection]` · `[data-annotate]` · `[data-dashboard]` + `.ach-badge`.

If a genuinely new component is needed, **add it to the shared CSS** so every project gains it —
never fork the stylesheet.

## 5. Page chrome rules
- **Header:** `.site-header > nav.nav` with `.brand` (DR monogram + brand text) and `.nav-links`.
  Mark the current page link `.active` (auto-handled by `portfolio.js`).
- **Project pages:** set `<body data-project="Name" data-project-root="../../">`. `portfolio.js`
  injects the `.pf-ribbon` back-to-portfolio bar automatically.
- **Footer:** standard three-column `.site-footer > .footer-grid` (brand · this project · portfolio).

## 6. JavaScript
- One shared file: `assets/js/portfolio.js`. All components self-init from `data-*` attributes.
- `localStorage` prefixes: progress `dream:`, reflections `dreamrefl:`. Use **unique**
  `data-progress` / `data-reflection` IDs per page to avoid collisions.
- The homepage reads `assets/js/projects-data.js` (the registry) to render + filter + search cards.

## 7. Accessibility (non-negotiable)
WCAG-minded contrast · keyboard operable (flashcards, video, tabs) · captions always shown on
video · feedback uses color **and** text/icon · `prefers-reduced-motion` honored · print styles ·
a printable/offline fallback for every interactive task · skip link on every page.

## 8. Animation
Subtle only: card hover lift, `fade-up` on scroll (`data-fade`), gentle video transitions. No
autoplaying motion, parallax, or anything that competes with content.

## 9. Navigation Map
```
/ (Portfolio Home)
├── #projects  (filter: All · Completed · Instructional Design · Instructional Leadership · search)
├── #pillars   (Instructional Design · Instructional Leadership)
├── #roadmap   (8 projects)
├── #contact
├── about.html
├── design-system.html  (living style guide)
└── projects/
    ├── grade3/  → index · curriculum-overview · modules · assessments · case-study
    └── grade5/  → index · challenge · framework · units · lessons · teacher ·
                    students · assessment · implementation · reflection
        (every project page shows the auto-injected portfolio ribbon back to /)
```

## 10. Adding a Project (checklist)
1. `projects/<id>/` from the templates.
2. Shared CSS/JS links + `data-project` body attributes.
3. Internal project nav + standard footer.
4. One entry in `assets/js/projects-data.js` (`pillar`, `status`, `url`, `tags`, `summary`, `icon`).
5. Each project includes a consultant-style **case study** (see `templates/case-study-template.html`).
6. Run the accessibility checklist (§7) before publishing.

## 11. Scalability Principle
Nothing in an individual project should redefine global styles. The design system is the only
place visual decisions live, so adding the remaining roadmap projects never requires a redesign.
