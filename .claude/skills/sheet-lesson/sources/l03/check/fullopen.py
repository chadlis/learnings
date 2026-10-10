import asyncio, sys, os
from playwright.async_api import async_playwright
from PIL import Image
page, out, scheme, width = os.path.abspath(sys.argv[1]), sys.argv[2], sys.argv[3], int(sys.argv[4])
step = 2400 if width > 500 else 1800
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': width, 'height': 900}, color_scheme=scheme, reduced_motion='reduce')
        await pg.goto('file://' + page); await pg.wait_for_timeout(400)
        await pg.evaluate("document.querySelectorAll('details').forEach(d=>d.open=true);document.querySelector('.ledge').style.display='none'")
        await pg.wait_for_timeout(300)
        H = await pg.evaluate("document.documentElement.scrollHeight"); k = 0
        for y in range(0, H, step):
            f = out + '/open%02d.png' % k
            await pg.screenshot(path=f, full_page=True, clip={'x': 0, 'y': y, 'width': width, 'height': min(step, H - y)})
            k += 1
        print(H, k); await b.close()
    return k
k = asyncio.run(main())
import time; time.sleep(1)
if width > 500:
    for i in range(k):
        f = out + '/open%02d.png' % i; im = Image.open(f); im.resize((im.size[0] * 6 // 10, im.size[1] * 6 // 10)).save(f)
