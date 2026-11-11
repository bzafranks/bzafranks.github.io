# Public Sector AI Workforce Portfolio (`/public-sector-ai/`)

This is an executive portfolio section for public service AI workforce development and digital transformation, with the Bahamas Ministry of Innovation and National Development as its target audience. It is a separate addition to the main portfolio, and no existing page was changed.

Live URL once merged to `main`: <https://bzafranks.github.io/public-sector-ai/>

## What's here

| File | Purpose |
|---|---|
| `index.html` | Overview: hero, at-a-glance strip, why it matters, capability matrix, case study summaries, framework, module preview, 90-day pilot, engagement, profile and contact |
| `case-studies.html` | Four full case studies (documented work kept separate from proposed applications) |
| `learning-module.html` + `module.js` | Interactive sample module, about 6 minutes. A scripted simulation with no AI service, nothing stored |
| `sources.html` | Reference register: Ministry claims with source, date and status, plus the A–D evidence key |
| `psai.css` | Executive styling layer, scoped to `body.psai` and loaded after the shared design system |
| `Franks-Public-Sector-AI-Workforce-Capability-Portfolio-v1.0.pdf` | 7-page Letter PDF with selectable text and clickable links |
| `_src/content.mjs` | **The only file to edit for wording.** All copy, metrics, case studies, framework, pilot and sources |
| `_src/build.mjs` | Generates the four HTML pages and the PDF from `content.mjs` |
| `_src/pdf/print.css` | PDF layout |

The four HTML pages are **generated**, so don't edit them by hand. GitHub Pages does not publish folders that start with `_`, so `_src/` stays private.

## Updating content

1. Edit `public-sector-ai/_src/content.mjs`.
2. From the repo root, run:
   ```bash
   node public-sector-ai/_src/build.mjs          # HTML only, no install needed (Node 18+)
   node public-sector-ai/_src/build.mjs --pdf    # HTML + PDF
   ```
3. Preview with `python -m http.server 8000` at <http://localhost:8000/public-sector-ai/>.

When you release a new PDF, change `meta.version`, `meta.versionDate`, `meta.versionDateLong` and `meta.pdfFile` in `content.mjs` together, so the filename, cover and footers all match.

### One-time PDF setup
```bash
cd public-sector-ai/_src
npm install
npx playwright install chromium
```
The build fails if any PDF page overflows Letter size, so clipped pages can't ship unnoticed.

## Evidence rules (built into the content file)

Every claim is tagged with one of four categories: **A** verified professional achievement, **B** verified Ministry initiative, **C** proposed consulting capability, or **D** illustrative concept. All professional figures are verified against the 09.2026 CV. If you add a new figure before checking it, set `src: PENDING`: it then shows a small "to verify" tag on the page and in the PDF until you change `src` to the CV and rebuild. Run with `--strict` to make the build fail while any PENDING item remains, and use that before publishing.

## Deploying

GitHub Pages publishes `main` automatically. This work lives on a feature branch. Merging the pull request to `main` publishes it, so merge only when you're ready.

The section isn't linked from the main navigation yet, so it is reachable by URL only. To link it, add a link to `index.html` (for example, the "Ministry / System Leader" card) or to the site nav.
