#!/usr/bin/env python3
"""Screenshot each figure of l10 in manipulated states (clicks and slider moves).

    python3 shots_states.py <page.html> <out_dir> [light|dark]
"""
import asyncio, os, sys
from playwright.async_api import async_playwright
page, out = os.path.abspath(sys.argv[1]), sys.argv[2]
scheme = sys.argv[3] if len(sys.argv) > 3 else 'light'
os.makedirs(out, exist_ok=True)

# (figure id, state name, actions) ; action = ('click', button text) | ('slider', index, value)
STATES = [
    ('v1', 'p050', [('slider', 0, 0.5)]),
    ('v1', 'p060', [('slider', 0, 0.6)]),
    ('fig1', 'twopoints', [('click', 'deux points, 0 et 20')]),
    ('fig1', 'expo_a5', [('click', 'exponentielle, moyenne 10'), ('slider', 0, 5)]),
    ('v2', 'die_k1', [('click', 'dé'), ('slider', 0, 1)]),
    ('v2', 'three_k3', [('click', 'trois points'), ('slider', 0, 3)]),
    ('v3', 'n16_100', [('click', 'n = 16'), ('click', '▶ 100 fois')]),
    ('v3', 'n1_300', [('click', 'n = 1'), ('click', '▶ 100 fois'), ('click', '▶ 100 fois'), ('click', '▶ 100 fois')]),
    ('fig2', 'rho', [('click', 'corrélées, ρ = 0,5')]),
    ('fig2', 'unequal', [('click', 'variances inégales')]),
    ('v4', 'normal300', [('click', '▶ 270 mesures de plus')]),
    ('v4', 'cauchy300', [('click', 'erreurs de Cauchy'), ('click', '▶ 270 mesures de plus')]),
    ('fig3', 'newpath', [('click', 'nouveau chemin')]),
    ('v5', 'n16000', [('click', 'n = 16 000')]),
    ('v6', 'rho09_n1000', [('slider', 0, 0.9), ('slider', 1, 9)]),
    ('v6', 'rho0_n100', [('slider', 0, 0), ('slider', 1, 6)]),
    ('v7', 'n5000', [('click', '▶ jusqu’à 5 000')]),
    ('v1', 'p070', [('slider', 0, 0.7)]),
    ('v2', 'normal_k35', [('slider', 0, 3.5)]),
    ('v6', 'rho095_n1', [('slider', 0, 0.95), ('slider', 1, 0)]),
    ('fig3', 'seed5', [('click', 'nouveau chemin'), ('click', 'nouveau chemin'), ('click', 'nouveau chemin'), ('click', 'nouveau chemin')]),
]

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        errs = []
        for fid, name, acts in STATES:
            pg = await b.new_page(viewport={'width': 1280, 'height': 900}, color_scheme=scheme, reduced_motion='reduce')
            pg.on('pageerror', lambda e: errs.append(str(e)))
            await pg.goto('file://' + page); await pg.wait_for_timeout(300)
            fig = await pg.query_selector('#' + fid)
            for a in acts:
                if a[0] == 'click':
                    await pg.locator('#' + fid).get_by_role('button', name=a[1], exact=True).click()
                else:
                    await pg.evaluate("([id,i,v])=>{const s=document.querySelectorAll('#'+id+' input[type=range]')[i];s.value=v;s.dispatchEvent(new Event('input'));}", [fid, a[1], a[2]])
                await pg.wait_for_timeout(150)
            await fig.screenshot(path=os.path.join(out, f'{fid}-{name}.png'))
            await pg.close()
        print('JS errors:', errs or 'none')
        await b.close()
asyncio.run(main())
