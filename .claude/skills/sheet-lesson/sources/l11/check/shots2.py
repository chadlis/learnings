"""Interaction screenshots: each step = (figure id, list of actions, name). Actions: ('click', selector-text) or ('slider', index-in-fig, value)."""
import asyncio, os, sys, json
from playwright.async_api import async_playwright
page, out = os.path.abspath(sys.argv[1]), sys.argv[2]
scheme = sys.argv[3] if len(sys.argv) > 3 else 'light'
os.makedirs(out, exist_ok=True)
STEPS = [
  ('v1', [('slider', 0, 0)], 'v1-n1'), ('v1', [('slider', 0, 5)], 'v1-n100'), ('v1', [('slider', 0, 3), ('button', 'refaire')], 'v1-n10-refaire'),
  ('fig1', [('button', 'pièce'), ('slider', 0, 100)], 'f1-coin100'), ('fig1', [('button', 'dé'), ('slider', 0, 1)], 'f1-die1'), ('fig1', [('slider', 0, 30)], 'f1-die30'),
  ('v2', [('button', 'n = 100')], 'v2-100'), ('v2', [('button', 'n = 500')], 'v2-500'),
  ('fig2', [('slider', 0, 0)], 'f2-n1'), ('fig2', [('slider', 0, 1)], 'f2-n2'), ('fig2', [('slider', 0, 4)], 'f2-n30'), ('fig2', [('slider', 0, 5)], 'f2-n100'),
  ('fig3', [('slider', 0, 0)], 'f3-n20'), ('fig3', [('slider', 0, 2)], 'f3-n500'), ('fig3', [('slider', 0, 3)], 'f3-n5000'),
  ('v3', [('slider', 0, 1)], 'v3-n1'), ('v3', [('slider', 0, 10)], 'v3-n10'), ('v3', [('slider', 0, 100)], 'v3-n100'),
  ('v4', [('slider', 0, 3)], 'v4-cauchy1000'), ('v4', [('slider', 0, 0)], 'v4-cauchy1'), ('v4', [('button', 'recopié'), ('slider', 0, 3)], 'v4-copy1000'),
  ('v4', [('button', 'corrélées'), ('slider', 0, 3)], 'v4-rho1000'), ('v4', [('button', 'indépendants'), ('slider', 0, 3)], 'v4-iid1000'), ('v4', [('slider', 0, 0)], 'v4-iid1'),
  ('v5', [('button', 'nouveaux')], 'v5-new'),
  ('fig4', [('button', 'succès attendus')], 'f4-np'), ('fig4', [('button', 'Wilson')], 'f4-np-wilson'), ('fig4', [('button', 'prévalence')], 'f4-p-wilson'),
]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={'width': 1280, 'height': 900}, color_scheme=scheme, reduced_motion='reduce')
        errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file://' + page); await pg.wait_for_timeout(400)
        res = {}
        for fid, acts, name in STEPS:
            for a in acts:
                if a[0] == 'button':
                    await pg.evaluate("([f,t])=>{const b=[...document.querySelectorAll('#'+f+' button')].find(x=>x.textContent.includes(t));b.click();}", [fid, a[1]])
                else:
                    await pg.evaluate("([f,i,v])=>{const s=document.querySelectorAll('#'+f+' input[type=range]')[i];s.value=v;s.dispatchEvent(new Event('input'));}", [fid, a[1], a[2]])
                await pg.wait_for_timeout(150)
            await pg.wait_for_timeout(300)
            el = await pg.query_selector('#' + fid)
            await el.screenshot(path=os.path.join(out, name + '.png'))
            res[name] = await pg.evaluate("f=>[...document.querySelectorAll('#'+f+' .readouts div')].map(d=>d.textContent)", fid)
        print(json.dumps(res, ensure_ascii=False, indent=0))
        print('JS errors:', errs or 'none')
        await b.close()
asyncio.run(main())
