import asyncio, sys
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        m = await b.new_page(viewport={'width': 390, 'height': 844}, color_scheme='light')
        await m.goto('file://' + sys.argv[1]); await m.wait_for_timeout(500)
        await m.evaluate("document.querySelectorAll('details').forEach(d=>d.open=true)")
        for i, sel in enumerate(['#v1', '#v5', '#v6', '#v7', '#n3 details.preuve']):
            el = await m.query_selector(sel); await el.scroll_into_view_if_needed(); await m.wait_for_timeout(100)
            await el.screenshot(path=sys.argv[2] + f'/m390-{i}.png')
        print(await m.evaluate("[document.documentElement.scrollWidth,document.documentElement.clientWidth]"))
        await b.close()
asyncio.run(main())
