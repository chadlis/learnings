import asyncio, os, sys
from playwright.async_api import async_playwright
page, out = os.path.abspath(sys.argv[1]), sys.argv[2]; os.makedirs(out, exist_ok=True)
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': 1280, 'height': 900}, reduced_motion='reduce')
        await pg.goto('file://' + page); await pg.wait_for_timeout(400)
        async def click(f, i): await pg.evaluate(f"document.querySelectorAll('#{f} button.tb')[{i}].click()"); await pg.wait_for_timeout(120)
        async def shot(f, n): await (await pg.query_selector('#' + f)).screenshot(path=f'{out}/{n}.png')
        await click('v1', 0); await click('v1', 4); await click('v1', 4); await shot('v1', 'r-v1-23')
        await click('v1', 4); await shot('v1', 'r-v1-32')
        await shot('v2', 'r-v2'); await click('fig1', 1); await shot('fig1', 'r-f1-diff')
        await shot('v5', 'r-v5'); await shot('fig3', 'r-f3'); await shot('v6', 'r-v6')
        await b.close()
asyncio.run(main())
