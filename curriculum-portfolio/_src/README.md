# Curriculum portfolio source

The pages in `/curriculum-portfolio/` are generated. Edit the fragments here, then rebuild.

```
node curriculum-portfolio/_src/build.mjs          # HTML only
node curriculum-portfolio/_src/build.mjs --pdf    # HTML, PDFs, student handout and packets
```

`--pdf` needs Playwright (Chromium) and `python3` with `pypdf`.

| Folder or file | What it holds |
|---|---|
| `pages/` | One HTML fragment per page. The first line is `<!--meta {...} -->` with `title`, `desc`, and optional `nav`, `pdf`, `script`. |
| `partials/` | Pieces pulled in with `{{INCLUDE:name}}`: passages, AI drafts, prompts, the print proof. |
| `handouts/` | Standalone print layouts, printed to `downloads/` with backgrounds off. |
| `samples.mjs` | Work-sample cards, evidence labels and pathways. |
| `packets.json` | Which page PDFs merge into each selection packet. |
| `texts/` | Plain-text sources of the original passages; `make_texts.py` renders them to partials. |
| `readability.py` | The Flesch–Kincaid estimate quoted on text pages. |
| `ai-raw/` | The prompts and unedited AI outputs reviewed in WS7 and WS10, kept as the record. |

Fragment tokens: `{{DISCLOSURE}}`, `{{LABEL:rep|sim|ai|ill|new}}`, `{{CARDS:ws1,ws2}}`, `{{PATHWAYS}}`, `{{NEXT:ws2}}`, `{{INCLUDE:name}}`.

Folders starting with `_` are not published by GitHub Pages.
