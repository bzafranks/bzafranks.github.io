// Render the AI-generated slide HTML (ai-raw/out-ws10a.md) to PNGs, unchanged.
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
const { chromium } = createRequire("/opt/node22/lib/node_modules/")("playwright");
const raw = readFileSync(new URL("./ai-raw/out-ws10a.md", import.meta.url), "utf8");
const slides = raw.split(/^===SLIDE===\s*$/m).map((s) => s.trim()).filter(Boolean);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
let i = 0;
for (const s of slides) { i++; await p.setContent(s, { waitUntil: "load" }); await p.screenshot({ path: new URL(`../img/ws10/slide-${i}.png`, import.meta.url).pathname, clip: { x: 0, y: 0, width: 1280, height: 720 } }); }
await b.close(); console.log("slides", slides.length);
