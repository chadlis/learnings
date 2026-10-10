"""Capture manipulated states of every figure/vignette of l04."""
import asyncio, os, sys
from playwright.async_api import async_playwright
page, out = os.path.abspath(sys.argv[1]), sys.argv[2]
os.makedirs(out, exist_ok=True)
JS_SLIDER = """([sel, i, v]) => { const inp = document.querySelectorAll(sel + ' input[type=range]')[i];
  inp.value = v; inp.dispatchEvent(new Event('input')); }"""
JS_BTN = """([sel, txt]) => { const b = [...document.querySelectorAll(sel + ' button')].find(x => x.textContent.trim() === txt);
  if (!b) throw new Error('no button ' + txt + ' in ' + sel); b.click(); }"""
STATES = [
  ('v1', 'a', [('btn', '#v1', 'regrouper par X'), ('btn', '#v1', '▶ lancer quatre pièces'), ('btn', '#v1', '▶ lancer quatre pièces')]),
  ('v2', 'a', [('btn', '#v2', '1 cm'), ('btn', '#v2', 'probabilité ÷ largeur')]),
  ('v2', 'b', [('btn', '#v2', '2 cm'), ('btn', '#v2', 'probabilité de chaque classe')]),
  ('fig1', 'a', [('btn', '#fig1', 'en centimètres'), ('sl', '#fig1', 0, 1.74), ('sl', '#fig1', 1, 1.76)]),
  ('v3', 'a', [('sl', '#v3', 0, 0.7), ('btn', '#v3', '↻ nouveau masque')]),
  ('v4', 'a', [('sl', '#v4', 0, 0.5)]),
  ('fig2', 'a', [('btn', '#fig2', 'douze dés')]),
  ('fig2', 'b', [('btn', '#fig2', 'cent dés'), ('sl', '#fig2', 1, 0.03)]),
  ('v5', 'a', [('btn', '#v5', 'n = 5')]),
  ('v5', 'b', [('btn', '#v5', 'n = 30, p = 0,02')]),
  ('fig3', 'a', [('btn', '#fig3', 'lecture centrée réduite'), ('sl', '#fig3', 0, 200), ('sl', '#fig3', 1, 0.05)]),
  ('fig3', 'b', [('btn', '#fig3', 'lecture en k'), ('sl', '#fig3', 0, 30), ('sl', '#fig3', 1, 0.02)]),
  ('v6', 'a', [('btn', '#v6', '4. la bande'), ('sl', '#v6', 0, 1.96)]),
  ('v6', 'b', [('btn', '#v6', '3. symétrie'), ('sl', '#v6', 0, 2)]),
  ('fig4', 'a', [('sl', '#fig4', 0, 2), ('sl', '#fig4', 1, 20)]),
  ('v7', 'a', [('btn', '#v7', 'aire de 190 à 230')]),
  ('v7', 'b', [('btn', '#v7', 'aire de 189,5 à 230,5')]),
]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); errs = []
        pg = await b.new_page(viewport={'width': 1280, 'height': 900}, color_scheme='light', reduced_motion='reduce')
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.on('console', lambda m: errs.append('console: ' + m.text) if m.type == 'error' else None)
        await pg.goto('file://' + page); await pg.wait_for_timeout(400)
        for fid, tag, acts in STATES:
            for a in acts:
                if a[0] == 'btn': await pg.evaluate(JS_BTN, [a[1], a[2]])
                else: await pg.evaluate(JS_SLIDER, [a[1], a[2], a[3]])
            await pg.wait_for_timeout(150)
            await (await pg.query_selector('#' + fid)).screenshot(path=os.path.join(out, f'{fid}-{tag}.png'))
        print('JS errors:', errs or 'none'); await b.close()
asyncio.run(main())
