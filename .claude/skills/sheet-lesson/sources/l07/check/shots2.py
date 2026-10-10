"""Manipulated states of every figure and vignette (copy of kit/shots.py with interactions)."""
import asyncio, os, sys
from playwright.async_api import async_playwright
page, out = os.path.abspath(sys.argv[1]), sys.argv[2]
scheme = sys.argv[3] if len(sys.argv) > 3 else 'light'
os.makedirs(out, exist_ok=True)
JS_CLICK = "([id,txt])=>{const b=[...document.querySelectorAll('#'+id+' button')].find(b=>b.textContent.includes(txt));b.click();}"
JS_SLIDE = "([id,k,v])=>{const i=document.querySelectorAll('#'+id+' input[type=range]')[k];i.value=v;i.dispatchEvent(new Event('input'));}"
STEPS = [
    ('v1', 'a', [('c', 'X > Y'), ('c', 'lancer')]),
    ('fig1', 'a', [('c', 'corner'), ('c', '0,25')]),
    ('fig1', 'b', [('c', 'tout le terrain'), ('c', '0,5')]),
    ('v2', 'a', [('c', 'carré'), ('s', 0, 1.5)]),
    ('v2', 'b', [('c', 'disque'), ('s', 0, 1.5), ('c', '3 000')]),
    ('v2', 'c', [('c', 'gaussien'), ('s', 0, 0), ('c', '3 000')]),
    ('fig2', 'a', [('c', 'maximum')]),
    ('v3', 'a', [('s', 0, -1)]),
    ('v3', 'b', [('s', 0, 2.5)]),
    ('fig3', 'a', [('s', 0, 2)]),
    ('v4', 'a', [('c', 'mélanger')]),
    ('v4', 'b', [('c', 'anneau')]),
    ('v4', 'c', [('c', 'mélanger')]),
    ('fig4', 'a', [('s', 0, 0.8)]),
    ('fig4', 'b', [('s', 0, -0.9)]),
    ('v5', 'a', [('c', '10'), ('s', 0, 3)]),
    ('v5', 'b', [('c', '50'), ('s', 0, 1)]),
    ('v6', 'a', [('s', 0, 0)]),
    ('v6', 'b', [('c', '1 000'), ('s', 0, 2)]),
]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={'width': 1280, 'height': 1400}, color_scheme=scheme, reduced_motion='reduce')
        errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.on('console', lambda m: errs.append('console: ' + m.text) if m.type == 'error' else None)
        await pg.goto('file://' + page); await pg.wait_for_timeout(500)
        for fid, tag, acts in STEPS:
            for a in acts:
                if a[0] == 'c': await pg.evaluate(JS_CLICK, [fid, a[1]])
                else: await pg.evaluate(JS_SLIDE, [fid, a[1], a[2]])
            await pg.wait_for_timeout(150)
            await (await pg.query_selector('#' + fid)).screenshot(path=os.path.join(out, f'{fid}-{tag}.png'))
        print('JS errors:', errs or 'none')
        await b.close()
asyncio.run(main())
