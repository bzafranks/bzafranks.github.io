"""Render _src/texts/t-*.txt to partials/text-*.html (first paragraph = title) and print stats."""
import html, glob, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from readability import fk
here = os.path.dirname(os.path.abspath(__file__))
for f in sorted(glob.glob(os.path.join(here, 'texts', 't-*.txt'))):
    paras = [p.strip() for p in open(f).read().strip().split('\n\n') if p.strip()]
    title, body = paras[0], paras[1:]
    W, S, g = fk('\n\n'.join(body))
    name = os.path.basename(f)[2:-4]
    out = f'<div class="c-passage"><h4>{html.escape(title)}</h4><p class="byline">Original text by Barbara Zá Franks · {W} words</p>'
    out += ''.join(f'<p><span class="pn">{i}</span>{html.escape(p)}</p>' for i, p in enumerate(body, 1)) + '</div>'
    open(os.path.join(here, 'partials', f'text-{name}.html'), 'w').write(out)
    print(f'{name:14} {W:4} words  FK {g}')
