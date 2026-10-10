"""Recapture what the review touched: v2 initial state of the three clouds, fig4 labels, v1 and fig2 axis names."""
import asyncio, os, sys
from playwright.async_api import async_playwright
page, out = os.path.abspath(sys.argv[1]), sys.argv[2]
os.makedirs(out, exist_ok=True)
CLICK = "([id,txt])=>{const b=[...document.querySelectorAll('#'+id+' button')].find(b=>b.textContent.includes(txt));b.click();}"
SLIDE = "([id,k,v])=>{const i=document.querySelectorAll('#'+id+' input[type=range]')[k];i.value=v;i.dispatchEvent(new Event('input'));}"
STEPS = [('v2', 'carre', [('c', 'carré')]), ('v2', 'disque', [('c', 'disque')]), ('v2', 'gauss', [('c', 'gaussien')]),
         ('fig4', 'r08', [('s', 0, 0.8)]), ('fig4', 'rm09', [('s', 0, -0.9)]), ('fig2', 'max', [('c', 'maximum')])]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': 1280, 'height': 1400}, color_scheme='light', reduced_motion='reduce')
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file://' + page); await pg.wait_for_timeout(400)
        for fid, tag, acts in STEPS:
            for a in acts:
                await (pg.evaluate(CLICK, [fid, a[1]]) if a[0] == 'c' else pg.evaluate(SLIDE, [fid, a[1], a[2]]))
            await pg.wait_for_timeout(120)
            await (await pg.query_selector('#' + fid)).screenshot(path=os.path.join(out, f'{fid}-{tag}.png'))
        print('JS errors:', errs or 'none'); await b.close()
asyncio.run(main())
