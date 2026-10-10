#!/usr/bin/env python3
"""Manipulated states of every l03 figure: python3 shots2.py <page.html> <out_dir> [light|dark] [motion]"""
import asyncio, os, sys
from playwright.async_api import async_playwright
page, out = os.path.abspath(sys.argv[1]), sys.argv[2]
scheme = sys.argv[3] if len(sys.argv) > 3 else 'light'
motion = 'no-preference' if len(sys.argv) > 4 else 'reduce'
os.makedirs(out, exist_ok=True)
JS_CLICK = "([id,label])=>{const b=[...document.querySelectorAll('#'+id+' button')].find(x=>x.textContent.replace(/\s/g,' ').trim()===label.replace(/\s/g,' '));if(!b)throw new Error('no button '+label+' in '+id);b.click();}"
JS_SLIDE = "([id,k,v])=>{const i=document.querySelectorAll('#'+id+' input[type=range]')[k];i.value=v;i.dispatchEvent(new Event('input'));}"
STATES = [
    ('v1', 'noire', [('c', 'sachant noire')]),
    ('v1', 'somme6', [('c', 'sachant somme = 6')]),
    ('v1', 'de5', [('c', 'sachant 2ᵉ dé = 5')]),
    ('fig1', 'zoom', [('c', 'zoomer sur B')]),
    ('fig1', 'move', [('c', 'revenir à Ω'), ('s', 0, 0.25), ('s', 1, 0.15)]),
    ('v2', 'avec', [('c', 'avec remise')]),
    ('v3', 'dep1', [('c', 'dépistage · 1 %')]),
    ('v3', 'dep10', [('c', 'dépistage · 10 %')]),
    ('v4', 'drogue2', [('c', 'drogue, spécificité 0,8')]),
    ('fig2', 'dep1', [('c', 'dépistage · 1 %')]),
    ('fig2', 'prev30', [('s', 0, -0.52)]),
    ('v5', 'drogue2', [('c', 'drogue, spécificité 0,8')]),
    ('fig3', 'lr1', [('s', 0, -1), ('s', 1, 1)]),
    ('fig3', 'lr9', [('s', 0, -1), ('s', 1, 9)]),
    ('fig4', 'k10', [('s', 0, 10), ('s', 1, 0.05)]),
    ('fig4', 'k10p8', [('s', 1, 0.8)]),
    ('v6', 'p1rappel', [('c', '1 %'), ('c', 'rappel')]),
    ('v6', 'neg', [('c', 'toujours −'), ('c', 'précision')]),
    ('v6', 'acc', [('c', 'toujours +'), ('c', 'accuracy')]),
    ('fig5', 'sp999', [('s', 0, 0.999)]),
    ('v7', 'noire', [('c', 'noire')]),
    ('v7', 'coeur', [('c', 'cœur')]),
    ('v8', 'serie_run', [('c', '▶ 1 000 systèmes')]),
    ('v8', 'par_cc', [('c', 'parallèle'), ('c', 'cause commune : non'), ('c', '▶ 20 000 systèmes')]),
    ('v8', 'par3', [('s', 0, 3)]),
    ('fig6', 'p2q2', [('s', 0, 0.2), ('s', 1, -2)]),
    ('fig6', 'p001', [('s', 0, 0.01), ('s', 1, -3)]),
    ('v9', 'abc', [('c', 'A ∩ B ∩ C')]),
    ('v9', 'cond', [('c', 'C sachant A ∩ B')]),
]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={'width': 1280, 'height': 900}, color_scheme=scheme, reduced_motion=motion)
        errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.on('console', lambda m: errs.append('console: ' + m.text) if m.type == 'error' else None)
        await pg.goto('file://' + page); await pg.wait_for_timeout(500)
        for fid, tag, acts in STATES:
            for a in acts:
                if a[0] == 'c':
                    await pg.evaluate(JS_CLICK, [fid, a[1].replace(' ', ' ') if False else a[1]])
                else:
                    await pg.evaluate(JS_SLIDE, [fid, a[1], a[2]])
                await pg.wait_for_timeout(150)
            await pg.wait_for_timeout(2600 if motion != 'reduce' else 300)
            await (await pg.query_selector('#' + fid)).screenshot(path=os.path.join(out, f'{fid}-{tag}.png'))
        print('JS errors:', errs or 'none')
        await b.close()
asyncio.run(main())
