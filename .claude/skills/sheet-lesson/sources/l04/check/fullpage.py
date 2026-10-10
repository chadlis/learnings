"""Full-page captures with every <details> open: desktop dark/light and 390 px; sliced for reading."""
import asyncio, os, sys
from playwright.async_api import async_playwright
from PIL import Image
page, out = os.path.abspath(sys.argv[1]), sys.argv[2]
os.makedirs(out, exist_ok=True)
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for name, vw, scheme in (('dark', 1280, 'dark'), ('light', 1280, 'light'), ('m390', 390, 'light')):
            pg = await b.new_page(viewport={'width': vw, 'height': 900}, color_scheme=scheme, reduced_motion='reduce')
            await pg.goto('file://' + page); await pg.wait_for_timeout(500)
            await pg.evaluate("document.querySelectorAll('details').forEach(d=>d.open=true)")
            await pg.wait_for_timeout(200)
            sw = await pg.evaluate("[document.documentElement.scrollWidth,document.documentElement.clientWidth]")
            print(name, 'scroll/client', sw)
            f = os.path.join(out, f'full-{name}.png'); await pg.screenshot(path=f, full_page=True)
            im = Image.open(f); H = 2600 if vw > 400 else 2400
            for i in range(0, im.height, H):
                im.crop((0, i, im.width, min(im.height, i + H))).save(os.path.join(out, f'full-{name}-{i // H:02d}.png'))
            print(name, im.size)
        await b.close()
asyncio.run(main())
