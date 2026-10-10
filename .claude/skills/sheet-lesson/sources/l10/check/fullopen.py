import asyncio, sys
from playwright.async_api import async_playwright
from PIL import Image
page, out, scheme = sys.argv[1], sys.argv[2], sys.argv[3]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={'width': 1280, 'height': 900}, color_scheme=scheme, reduced_motion='reduce')
        await pg.goto('file://' + page); await pg.wait_for_timeout(400)
        await pg.evaluate("document.querySelectorAll('details').forEach(d=>d.open=true)")
        await pg.wait_for_timeout(200)
        await pg.screenshot(path=out + '/full-' + scheme + '.png', full_page=True)
        await b.close()
asyncio.run(main())
im = Image.open(out + '/full-' + scheme + '.png'); h = im.size[1]; n = (h + 2199) // 2200
for i in range(n):
    im.crop((0, i * 2200, im.size[0], min(h, (i + 1) * 2200))).save(out + f'/full-{scheme}-{i}.png')
print(im.size, n)
