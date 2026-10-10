"""Capture manipulated states of every figure and vignette of l06.

    python3 shots_states.py <page.html> <out_dir> [light|dark]
"""
import asyncio, os, sys
from playwright.async_api import async_playwright
page, out = os.path.abspath(sys.argv[1]), sys.argv[2]
scheme = sys.argv[3] if len(sys.argv) > 3 else 'light'
os.makedirs(out, exist_ok=True)

# (figure id, list of actions, file suffix); action = ('btn', i) or ('sl', i, value)
STATES = [
    ('v1', [('sl', 0, 0.5)], 'a05'), ('v1', [('sl', 0, 4)], 'a4'),
    ('fig1', [('btn', 1)], 'x2'), ('fig1', [('btn', 2)], 'sqrt'), ('fig1', [('btn', 3)], 'ln'),
    ('v2', [('btn', 1)], 'miroir'), ('v2', [('btn', 2)], 'C'),
    ('fig2', [('sl', 0, 2)], 'a2'), ('fig2', [('sl', 0, 0)], 'a0'), ('fig2', [('sl', 0, 0.5), ('sl', 1, -30)], 'a05bm30'),
    ('fig2', [('sl', 0, -2), ('sl', 1, 0)], 'am2b0'),
    ('v3', [('btn', 1)], 'x7'), ('v3', [('btn', 2)], '1025'),
    ('fig3', [('btn', 1)], 'exp'), ('fig3', [('btn', 2)], 'unif'),
    ('v4', [('btn', 1)], '384'), ('v4', [('btn', 2)], '001'), ('v4', [('sl', 0, 6)], '6'),
    ('fig4', [('sl', 0, 0.05)], '005'), ('fig4', [('sl', 0, 4)], '4'), ('fig4', [('btn', 0)], 'anim'),
]

async def act(pg, fid, a):
    if a[0] == 'btn':
        await pg.evaluate(f"document.querySelectorAll('#{fid} button')[{a[1]}].click()")
    else:
        await pg.evaluate(f"(()=>{{const s=document.querySelectorAll('#{fid} input[type=range]')[{a[1]}];s.value={a[2]};s.dispatchEvent(new Event('input'));}})()")

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); errs = []
        pg = await b.new_page(viewport={'width': 1280, 'height': 900}, color_scheme=scheme, reduced_motion='reduce')
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.on('console', lambda m: errs.append('console: ' + m.text) if m.type == 'error' else None)
        await pg.goto('file://' + page); await pg.wait_for_timeout(500)
        for fid, actions, suf in STATES:
            for a in actions:
                await act(pg, fid, a)
            await pg.wait_for_timeout(150)
            await (await pg.query_selector('#' + fid)).screenshot(path=os.path.join(out, f'{fid}-{suf}.png'))
            vals = await pg.evaluate(f"[...document.querySelectorAll('#{fid} .readouts div')].map(d=>d.textContent)")
            print(fid, suf, '|', ' | '.join(vals))
        print('JS errors:', errs or 'none')
        await b.close()
asyncio.run(main())
