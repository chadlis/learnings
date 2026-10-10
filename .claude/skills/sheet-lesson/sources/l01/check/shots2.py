"""Manipulated states of every figure and vignette of l01."""
import asyncio, os, sys
from playwright.async_api import async_playwright
page, out = os.path.abspath(sys.argv[1]), sys.argv[2]
scheme = sys.argv[3] if len(sys.argv) > 3 else 'light'
os.makedirs(out, exist_ok=True)
async def slider(pg, sel, idx, val):
    await pg.evaluate("""([s,i,v])=>{const inp=document.querySelectorAll(s+' input[type=range]')[i];inp.value=v;inp.dispatchEvent(new Event('input'));}""", [sel, idx, val])
async def click(pg, sel, text):
    await pg.evaluate("""([s,t])=>{const b=[...document.querySelectorAll(s+' button')].find(x=>x.textContent.includes(t));if(!b)throw new Error('no button '+t);b.click();}""", [sel, text])
async def shot(pg, id_, name):
    await pg.wait_for_timeout(150)
    await (await pg.query_selector('#' + id_)).screenshot(path=os.path.join(out, name + '.png'))
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={'width': 1280, 'height': 900}, color_scheme=scheme, reduced_motion='reduce')
        errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.on('console', lambda m: errs.append('console: ' + m.text) if m.type == 'error' else None)
        await pg.goto('file://' + page); await pg.wait_for_timeout(400)
        await slider(pg, '#v1', 1, 10); await shot(pg, 'v1', 'v1-k10')
        await slider(pg, '#v1', 1, 7); await click(pg, '#v1', 'lancer'); await shot(pg, 'v1', 'v1-throw')
        await slider(pg, '#v1', 0, 0.9); await shot(pg, 'v1', 'v1-t09')
        await click(pg, '#v2', 'lancer 1'); await shot(pg, 'v2', 'v2-throw')
        await click(pg, '#v2', 'au moins un pile'); await click(pg, '#v2', 'lancer 1'); await shot(pg, 'v2', 'v2-coins')
        await slider(pg, '#fig1', 0, 0.5); await shot(pg, 'fig1', 'fig1-q05')
        await click(pg, '#v3', 'deux dés'); await click(pg, '#v3', 'hasard'); await shot(pg, 'v3', 'v3-dice')
        await click(pg, '#v3', '4 pièces'); await shot(pg, 'v3', 'v3-4')
        await click(pg, '#v4', 'avec remise'); await click(pg, '#v4', 'distribuer'); await shot(pg, 'v4', 'v4-avec')
        await click(pg, '#v4', 'sans remise'); await click(pg, '#v4', 'distribuer'); await shot(pg, 'v4', 'v4-sans')
        await click(pg, '#fig2', '365'); await shot(pg, 'fig2', 'fig2-365')
        await click(pg, '#fig2', 'un dé'); await slider(pg, '#fig2', 0, 7); await shot(pg, 'fig2', 'fig2-6')
        await click(pg, '#v5', 'distribution'); await click(pg, '#v5', 'suivante'); await shot(pg, 'v5', 'v5-dist')
        await click(pg, '#fig3', 'exactement'); await slider(pg, '#fig3', 0, 7); await shot(pg, 'fig3', 'fig3-ex7')
        await click(pg, '#v6', 'deux dés'); await click(pg, '#v6', 'suivant'); await shot(pg, 'v6', 'v6-dice')
        await click(pg, '#v7', 'boules'); await shot(pg, 'v7', 'v7-glaces')
        await click(pg, '#v7', 'podium'); await shot(pg, 'v7', 'v7-podium')
        await click(pg, '#fig4', 'sans ordre, avec'); await shot(pg, 'fig4', 'fig4-21')
        await click(pg, '#fig4', 'sans ordre ni'); await shot(pg, 'fig4', 'fig4-15')
        print('JS errors:', errs or 'none')
        await b.close()
asyncio.run(main())
