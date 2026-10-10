#!/usr/bin/env python3
"""Screenshot every figure and vignette of a lesson, report JS errors and horizontal overflow.

    python3 shots.py <page.html> <out_dir> [light|dark]

Writes <out_dir>/<id>.png for each .fig (figures and .fig.vis vignettes) in their initial state,
and <out_dir>/m390.png (top of page at 390 px). Prints JS errors and [scrollWidth, clientWidth] at 390 px.
To check an interaction, copy this file and add clicks / slider moves before the element screenshots
(slider: set input.value then dispatch an 'input' event).
"""
import asyncio, os, sys
from playwright.async_api import async_playwright
page, out = os.path.abspath(sys.argv[1]), sys.argv[2]
scheme = sys.argv[3] if len(sys.argv) > 3 else 'light'
os.makedirs(out, exist_ok=True)
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={'width': 1280, 'height': 900}, color_scheme=scheme, reduced_motion='reduce')
        errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.on('console', lambda m: errs.append('console: ' + m.text) if m.type == 'error' else None)
        await pg.goto('file://' + page); await pg.wait_for_timeout(500)
        ids = await pg.evaluate("[...document.querySelectorAll('.fig')].map(e=>e.id)")
        for i in ids:
            await (await pg.query_selector('#' + i)).screenshot(path=os.path.join(out, i + '.png'))
        m = await b.new_page(viewport={'width': 390, 'height': 900}, color_scheme=scheme)
        await m.goto('file://' + page); await m.wait_for_timeout(500)
        await m.evaluate("document.querySelectorAll('details').forEach(d=>d.open=true)")
        sw = await m.evaluate("[document.documentElement.scrollWidth,document.documentElement.clientWidth]")
        await m.screenshot(path=os.path.join(out, 'm390.png'))
        print('figures:', ids); print('JS errors:', errs or 'none'); print('390 px [scrollWidth, clientWidth]:', sw)
        await b.close()
asyncio.run(main())
