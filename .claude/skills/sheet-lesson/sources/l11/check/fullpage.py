import asyncio, os, sys
from playwright.async_api import async_playwright
from PIL import Image
page, out, scheme = os.path.abspath(sys.argv[1]), sys.argv[2], sys.argv[3]
width = int(sys.argv[4]) if len(sys.argv) > 4 else 1280
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={'width': width, 'height': 900}, color_scheme=scheme, reduced_motion='reduce')
        await pg.goto('file://' + page); await pg.wait_for_timeout(500)
        await pg.evaluate("document.querySelectorAll('details').forEach(d=>d.open=true);document.querySelectorAll('.verb .a').forEach(a=>a.classList.remove('hid'))")
        await pg.wait_for_timeout(300)
        await pg.screenshot(path=out + '.png', full_page=True)
        await b.close()
    im = Image.open(out + '.png'); H = im.height; step = 2600; k = 0
    for y in range(0, H, step):
        im.crop((0, y, im.width, min(H, y + step))).save(f'{out}-{k:02d}.png'); k += 1
    print(im.size, k, 'slices')
asyncio.run(main())
