"""Capture manipulated states of every figure and print the readouts of each state."""
import asyncio, os, sys
from playwright.async_api import async_playwright
page, out = os.path.abspath(sys.argv[1]), sys.argv[2]
scheme = sys.argv[3] if len(sys.argv) > 3 else 'light'
os.makedirs(out, exist_ok=True)
async def click(pg, fig, i):
    await pg.evaluate(f"document.querySelectorAll('#{fig} button.tb')[{i}].click()"); await pg.wait_for_timeout(150)
async def slide(pg, fig, i, v):
    await pg.evaluate(f"(()=>{{const s=document.querySelectorAll('#{fig} input[type=range]')[{i}];s.value={v};s.dispatchEvent(new Event('input'))}})()"); await pg.wait_for_timeout(100)
async def shot(pg, fig, name):
    await (await pg.query_selector('#' + fig)).screenshot(path=os.path.join(out, name + '.png'))
    txt = await pg.evaluate(f"[...document.querySelectorAll('#{fig} .readouts > div, #{fig} .sl-readout')].map(d=>d.innerText.replace(/\\n/g,' = ')).join(' | ')")
    print(name, '::', txt)
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={'width': 1280, 'height': 900}, color_scheme=scheme, reduced_motion='reduce')
        errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file://' + page); await pg.wait_for_timeout(500)
        for k, nm in enumerate(['four', 'tilted', 'wide', 'round']):
            await click(pg, 'v1', k); await shot(pg, 'v1', f'v1-{nm}')
        await click(pg, 'v1', 4); await click(pg, 'v1', 4); await shot(pg, 'v1', 'v1-round-next2')
        await click(pg, 'v1', 0); await click(pg, 'v1', 4); await shot(pg, 'v1', 'v1-four-next')
        await shot(pg, 'v2', 'v2-init')
        await click(pg, 'v2', 2); await click(pg, 'v2', 6); await shot(pg, 'v2', 'v2-more')
        for k, nm in enumerate(['iid', 'diff', 'corr', 'same']):
            await click(pg, 'fig1', k); await shot(pg, 'fig1', f'f1-{nm}-6')
        await slide(pg, 'fig1', 0, 2)
        for k, nm in enumerate(['iid', 'diff', 'corr', 'same']):
            await click(pg, 'fig1', k); await shot(pg, 'fig1', f'f1-{nm}-2')
        for k, nm in enumerate(['brunton', 'parabola', 'circle', 'half']):
            await click(pg, 'v3', k); await shot(pg, 'v3', f'v3-{nm}')
        for k, nm in enumerate(['feet', 'inches', 'yinches', 'shift', 'flip']):
            await click(pg, 'v4', k); await shot(pg, 'v4', f'v4-{nm}')
        await shot(pg, 'fig2', 'f2-init')
        await slide(pg, 'fig2', 0, 1); await shot(pg, 'fig2', 'f2-rho1')
        await slide(pg, 'fig2', 0, 0); await shot(pg, 'fig2', 'f2-rho0')
        await slide(pg, 'fig2', 0, -0.8); await shot(pg, 'fig2', 'f2-rhom08')
        await slide(pg, 'fig2', 0, 0.6); await slide(pg, 'fig2', 1, 2); await shot(pg, 'fig2', 'f2-rho06-sy2')
        for k, nm in enumerate(['circle', 'aligned', 'rotated']):
            await click(pg, 'v5', k); await pg.wait_for_timeout(200); await shot(pg, 'v5', f'v5-{nm}')
        await click(pg, 'v5', 3); await pg.wait_for_timeout(300); await shot(pg, 'v5', 'v5-rotated-600')
        await shot(pg, 'fig3', 'f3-init')
        await slide(pg, 'fig3', 2, 0); await shot(pg, 'fig3', 'f3-theta0')
        await slide(pg, 'fig3', 2, 90); await shot(pg, 'fig3', 'f3-theta90')
        await slide(pg, 'fig3', 2, -30); await shot(pg, 'fig3', 'f3-thetam30')
        await slide(pg, 'fig3', 1, 2); await shot(pg, 'fig3', 'f3-circle')
        await slide(pg, 'fig3', 0, 2.5); await slide(pg, 'fig3', 1, 0.5); await slide(pg, 'fig3', 2, 45); await shot(pg, 'fig3', 'f3-extreme')
        await shot(pg, 'v6', 'v6-init')
        await click(pg, 'v6', 0); await pg.wait_for_timeout(400); await shot(pg, 'v6', 'v6-redo')
        print('JS errors:', errs or 'none')
        await b.close()
asyncio.run(main())
