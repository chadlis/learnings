"""Full page, all details open, dark theme; sliced into chunks."""
import asyncio, os, sys
from playwright.async_api import async_playwright
from PIL import Image
page, out, scheme = os.path.abspath(sys.argv[1]), sys.argv[2], sys.argv[3]
os.makedirs(out, exist_ok=True)
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={'width': 1280, 'height': 900}, color_scheme=scheme, reduced_motion='reduce')
        await pg.goto('file://' + page); await pg.wait_for_timeout(400)
        await pg.evaluate("document.querySelectorAll('details').forEach(d=>d.open=true);document.querySelector('.ledge').style.display='none'")
        await pg.wait_for_timeout(200)
        f = os.path.join(out, f'full-{scheme}.png'); await pg.screenshot(path=f, full_page=True)
        await b.close()
    im = Image.open(f); H = im.size[1]; step = 2200; k = 0
    for y in range(0, H, step):
        im.crop((0, y, im.size[0], min(H, y + step))).save(os.path.join(out, f'{scheme}-{k:02d}.png')); k += 1
    print(H, k, 'slices')
asyncio.run(main())
