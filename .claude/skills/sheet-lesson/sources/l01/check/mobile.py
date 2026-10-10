import asyncio, os, sys
from playwright.async_api import async_playwright
page, out = os.path.abspath(sys.argv[1]), sys.argv[2]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={'width': 390, 'height': 844}, color_scheme='dark', reduced_motion='reduce')
        await pg.goto('file://' + page); await pg.wait_for_timeout(400)
        for i in ['v1', 'v2', 'v4', 'v7', 'fig2']:
            await (await pg.query_selector('#' + i)).screenshot(path=os.path.join(out, 'm-' + i + '.png'))
        print(await pg.evaluate("[document.documentElement.scrollWidth,document.documentElement.clientWidth]"))
        await b.close()
asyncio.run(main())
