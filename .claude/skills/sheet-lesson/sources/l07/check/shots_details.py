"""Open every <details> and screenshot each notion's blocks, plus the end sections."""
import asyncio, os, sys
from playwright.async_api import async_playwright
page, out = os.path.abspath(sys.argv[1]), sys.argv[2]
os.makedirs(out, exist_ok=True)
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={'width': 1280, 'height': 1000}, color_scheme='light', reduced_motion='reduce')
        await pg.goto('file://' + page); await pg.wait_for_timeout(400)
        await pg.evaluate("document.querySelector('.ledge')&&(document.querySelector('.ledge').style.display='none');document.querySelectorAll('details').forEach(d=>d.open=true)")
        n = await pg.evaluate("document.querySelectorAll('details').length")
        for i in range(n):
            el = (await pg.query_selector_all('details'))[i]
            await el.screenshot(path=os.path.join(out, f'd{i:02d}.png'))
        for sel in ('#resume', '#verbal', '#links', 'footer'):
            await (await pg.query_selector(sel)).screenshot(path=os.path.join(out, sel.strip('#') + '.png'))
        print(n, 'details')
        await b.close()
asyncio.run(main())
