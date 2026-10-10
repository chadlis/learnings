#!/usr/bin/env python3
"""Capture the vignettes touched by the v3 delta in their relevant states, and dump readouts.

    python3 states.py <page.html> <out_dir> [light|dark]
"""
import asyncio, os, sys, json
from playwright.async_api import async_playwright
page, out = os.path.abspath(sys.argv[1]), sys.argv[2]
scheme = sys.argv[3] if len(sys.argv) > 3 else 'light'
os.makedirs(out, exist_ok=True)

BTN = "(id,i)=>document.querySelectorAll('#'+id+' button')[i].click()"
SLD = "(sel,v)=>{const e=document.querySelector(sel);e.value=v;e.dispatchEvent(new Event('input'));}"
# (name, figure id, [js snippets])
STATES = [
    ('v2-une', 'v2', ["c(BTN)('v2ctl',0)"]),
    ('v2-deux', 'v2', ["c(BTN)('v2ctl',1)"]),
    ('v2-patri0', 'v2', ["c(BTN)('v2ctl',2)", "c(SLD)('#v2sl input',0)"]),
    ('v2-patri4', 'v2', ["c(BTN)('v2ctl',2)", "c(SLD)('#v2sl input',4)"]),
    ('v3-ind-launch', 'v3', ["c(BTN)('v3ctl',0)", "c(BTN)('v3ctl',3)"]),
    ('v3-yx-launch', 'v3', ["c(BTN)('v3ctl',1)", "c(BTN)('v3ctl',3)"]),
    ('v3-7mx-launch', 'v3', ["c(BTN)('v3ctl',2)", "c(BTN)('v3ctl',3)"]),
    ('v5-x2', 'v5', ["c(BTN)('v5ctl',0)"]),
    ('v5-2x1', 'v5', ["c(BTN)('v5ctl',1)"]),
    ('v5-c2', 'v5', ["c(BTN)('v5ctl',2)"]),
    ('v6-d025', 'v6', ["c(SLD)('#v6ctl input',0.25)"]),
    ('v6-d1', 'v6', ["c(SLD)('#v6ctl input',1)"]),
    ('v6-d2', 'v6', ["c(SLD)('#v6ctl input',2)"]),
    ('v7-Z-k1', 'v7', ["c(BTN)('v7ctl',1)", "c(SLD)('#v7sl input',1)"]),
    ('v7-Z-k3', 'v7', ["c(BTN)('v7ctl',1)", "c(SLD)('#v7sl input',3)"]),
    ('v7-13-k3', 'v7', ["c(BTN)('v7ctl',0)", "c(SLD)('#v7sl input',3)"]),
    ('v7-Z-k4', 'v7', ["c(BTN)('v7ctl',1)", "c(SLD)('#v7sl input',4)"]),
    ('v9-C', 'v9', ["c(BTN)('v9ctl',0)"]),
    ('v9-x18', 'v9', ["c(BTN)('v9ctl',2)"]),
    ('v9-F', 'v9', ["c(BTN)('v9ctl',3)"]),
    ('v10-init', 'v10', []),
    ('v10-1000', 'v10', ["document.querySelectorAll('#v10ctl button')[1].click()"]),
    ('v11-col', 'v11', ["c(BTN)('v11ctl',0)"]),
    ('v11-row', 'v11', ["c(BTN)('v11ctl',1)"]),
]

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        errs = []
        res = {}
        for vw in (1280, 390):
            pg = await b.new_page(viewport={'width': vw, 'height': 900}, color_scheme=scheme, reduced_motion='reduce')
            pg.on('pageerror', lambda e: errs.append(str(e)))
            await pg.goto('file://' + page); await pg.wait_for_timeout(400)
            await pg.evaluate("window.BTN=" + BTN + ";window.SLD=" + SLD + ";window.c=f=>f;")
            for name, fid, acts in STATES:
                print("state", name, flush=True)
                for a in acts:
                    await pg.evaluate(a); await pg.wait_for_timeout(60)
                await pg.wait_for_timeout(150)
                el = await pg.query_selector('#' + fid)
                await el.scroll_into_view_if_needed()
                await el.screenshot(path=os.path.join(out, f'{name}-{vw}.png'))
                ro = await pg.evaluate(f"[...document.querySelectorAll('#{fid}out > div')].map(d=>{{const b=d.querySelector('b');const lh=parseFloat(getComputedStyle(b).lineHeight)||20;return [d.childNodes[0].textContent,b.textContent,Math.round(b.getBoundingClientRect().height/lh)];}})")
                res[f'{name}-{vw}'] = ro
            if vw == 390:
                sw = await pg.evaluate("[document.documentElement.scrollWidth,document.documentElement.clientWidth]")
                print('390 scroll', sw)
                ticks = await pg.evaluate("[...document.querySelectorAll('#v6plot .sl-tick')].slice(0,3).map(t=>t.getBoundingClientRect().height.toFixed(1))")
                print('v6 tick heights at 390 px', ticks)
                wrap = await pg.evaluate("(()=>{const e=document.querySelector('#v6plot .v-row>div');return [e.clientWidth,e.scrollWidth];})()")
                print('v6 left panel [clientWidth, scrollWidth] at 390', wrap)
            await pg.close()
        for k, v in res.items():
            print(k, json.dumps(v, ensure_ascii=False))
        print('JS errors:', errs or 'none')
        await b.close()
asyncio.run(main())
