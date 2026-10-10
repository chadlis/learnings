import asyncio, os, sys
from playwright.async_api import async_playwright
from PIL import Image
page, out, scheme = os.path.abspath(sys.argv[1]), sys.argv[2], sys.argv[3]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={'width': 1280, 'height': 900}, color_scheme=scheme, reduced_motion='reduce')
        await pg.goto('file://' + page); await pg.wait_for_timeout(400)
        await pg.evaluate("document.querySelectorAll('details').forEach(d=>d.open=true)")
        await pg.wait_for_timeout(200)
        await pg.screenshot(path=out, full_page=True)
        await b.close()
asyncio.run(main())
im = Image.open(out); W, H = im.size; print(W, H)
step = 2400; k = 0
for y in range(0, H, step):
    im.crop((0, y, W, min(H, y + step))).save(out.replace('.png', f'-{k:02d}.png')); k += 1
print(k, 'slices')
