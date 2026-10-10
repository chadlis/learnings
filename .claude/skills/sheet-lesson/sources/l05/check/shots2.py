import asyncio, os, sys
from playwright.async_api import async_playwright
page, out = os.path.abspath(sys.argv[1]), sys.argv[2]
scheme = sys.argv[3] if len(sys.argv) > 3 else 'light'
os.makedirs(out, exist_ok=True)
JS_SLIDER = """([sel,i,v])=>{const e=document.querySelectorAll(sel+' input[type=range]')[i];e.value=v;e.dispatchEvent(new Event('input'));}"""
JS_BTN = """([sel,i])=>{document.querySelectorAll(sel+' button')[i].click();}"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={'width': 1280, 'height': 900}, color_scheme=scheme, reduced_motion='reduce')
        errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.on('console', lambda m: errs.append('console: ' + m.text) if m.type == 'error' else None)
        await pg.goto('file://' + page); await pg.wait_for_timeout(400)
        async def shot(i, name):
            await (await pg.query_selector('#' + i)).screenshot(path=os.path.join(out, name + '.png'))
        S = lambda sel, i, v: pg.evaluate(JS_SLIDER, [sel, i, v])
        B = lambda sel, i: pg.evaluate(JS_BTN, [sel, i])
        await B('#v1ctl', 1); await shot('v1', 'v1-b')
        for _ in range(5): await B('#v2ctl', 0)
        await shot('v2', 'v2-b')
        await S('#f1ctl', 1, 20); await shot('fig1', 'fig1-b')
        await S('#f1ctl', 0, 15); await shot('fig1', 'fig1-c')
        await B('#f2ctl', 2); await S('#f2sl', 0, 3); await shot('fig2', 'fig2-b')
        await B('#v3ctl', 1); await S('#v3sl', 0, 365); await shot('v3', 'v3-b')
        await B('#v3ctl', 2); await pg.wait_for_timeout(200); await shot('v3', 'v3-c')
        await S('#f3ctl', 2, 90); await shot('fig3', 'fig3-b')
        await B('#v4ctl', 1); await shot('v4', 'v4-b')
        await S('#v4sl', 0, 1500); await shot('v4', 'v4-c')
        await B('#f4btn', 0); await shot('fig4', 'fig4-b')
        await S('#v5sl', 0, 3000); await shot('v5', 'v5-b')
        await B('#v5ctl', 1); await shot('v5', 'v5-c')
        await S('#v6sl', 0, 2); await shot('v6', 'v6-b')
        await B('#v6ctl', 0); await S('#v6sl', 0, 0.25); await shot('v6', 'v6-c')
        await S('#f5ctl', 0, 1); await shot('fig5', 'fig5-b')
        await B('#v7ctl', 1); await shot('v7', 'v7-b')
        await B('#v7ctl', 2); await pg.wait_for_timeout(200); await shot('v7', 'v7-c')
        await S('#f6ctl', 0, 1); await shot('fig6', 'fig6-b')
        print('JS errors:', errs or 'none')
        await b.close()
asyncio.run(main())
