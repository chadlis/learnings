import asyncio, sys, os
from playwright.async_api import async_playwright
from PIL import Image
page, out, scheme, width = os.path.abspath(sys.argv[1]), sys.argv[2], sys.argv[3], int(sys.argv[4])
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={'width': width, 'height': 900}, color_scheme=scheme, reduced_motion='reduce')
        await pg.goto('file://' + page); await pg.wait_for_timeout(500)
        await pg.evaluate("document.querySelectorAll('details').forEach(d=>d.open=true);document.querySelectorAll('.verb .a').forEach(a=>a.classList.remove('hid'))")
        await pg.wait_for_timeout(300)
        await pg.screenshot(path=out + '.png', full_page=True)
        sw = await pg.evaluate("[document.documentElement.scrollWidth,document.documentElement.clientWidth]")
        print('scroll', sw)
        await b.close()
asyncio.run(main())
im = Image.open(out + '.png'); print(im.size)
h = 1700; n = 0
for y in range(0, im.height, h):
    im.crop((0, y, im.width, min(im.height, y + h))).save(f'{out}-{n:02d}.png'); n += 1
print(n, 'slices')
