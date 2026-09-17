#!/usr/bin/env python3
"""validate_sheet.py — vérifie qu'une sheet respecte le standard `sheet-chain` avant commit.

Usage : python3 tools/validate_sheet.py sheets/chains/chain-p03-01-xxx.html [--render]
Sortie : liste de FAIL / WARN, code retour 1 si un FAIL.
--render : ouvre la page dans chromium (playwright), remonte les erreurs JS, capture
           sheets/_render/<nom>.png en sombre et en clair (non versionné).
"""
import re, sys, os, subprocess, json

path = sys.argv[1]
render = '--render' in sys.argv
t = open(path, encoding='utf-8').read()
name = os.path.basename(path)
fails, warns = [], []
def fail(m): fails.append(m)
def warn(m): warns.append(m)

# ---- nommage et méta
# part : les chaînes et déroulés sont numérotés (00…09), les ponts vivent dans la partie « B ».
m = re.search(r'<meta name="sheet" content="series=(\w+);part=([0-9A-Z]+);number=(\d+);status=(v\d+)">', t)
if not m: fail('meta sheet manquante ou mal formée (series=…;part=…;number=…;status=v1)')
else:
    series, part, number, status = m.groups()
    expect = {'chain': f'chain-p{part}-{number}-', 'walkthrough': f'walkthrough-p{part}-{number}-',
              'bridge': f'bridge-{number}-', 'coding': f'coding-{number}-'}.get(series)
    if expect and not name.startswith(expect): fail(f'nom de fichier attendu commençant par {expect}, reçu {name}')
for meta in ('part', 'subtitle', 'prereq', 'anki'):
    if not re.search(rf'<meta name="{meta}" content="[^"]+">', t): fail(f'meta {meta} manquante')
if '{{' in t: fail('placeholder {{…}} non remplacé')

# ---- autonomie
ext = [u for u in re.findall(r'(?:src|href)="(https?://[^"]+)"', t)]
if ext: fail(f'ressource externe : {ext[:3]}')
if re.search(r'<(script|link)[^>]+(cdn|mathjax)', t, re.I): fail('CDN / MathJax interdit')
if 'localStorage' in t: fail('localStorage interdit (session seulement)')
if '../../assets/sheetlib.js' not in t: fail('sheetlib.js non chargé')

# ---- un seul <style> : un second bloc recopié du template ravale le :root du premier
#      et la page sort sans couleurs — invisible au rendu automatique, seul l'œil le voit.
nstyle = len(re.findall(r'<style\b', t))
if nstyle != 1: fail(f'{nstyle} balises <style> (il en faut exactement 1 — un doublon avale le bloc :root)')

# ---- structure de la chaîne
need = {'#prereq': 'id="prereq"', '#hyp': 'id="hyp"', '.chain': 'class="chain"', '#resume': 'id="resume"',
        '#verbal': 'id="verbal"', '#links': 'id="links"', '.phrase': 'class="phrase"'}
for k, v in need.items():
    if v not in t: fail(f'bloc manquant : {k}')
steps = re.findall(r'<div class="step" id="(s\d+)">', t)
if len(steps) < 4: fail(f'{len(steps)} pas seulement (min 4)')
if len(steps) > 14: warn(f'{len(steps)} pas : long, envisager de scinder')
if 'class="card casse"' not in t: fail('pas de bloc « Où ça casse »')
if 'class="tag tronc"' not in t: warn('aucun pas marqué tronc')
say = re.findall(r'<p class="say">«(.*?)»</p>', t, re.S)
if len(say) < len(steps) - 1: fail(f'{len(say)} formulations « au tableau » pour {len(steps)} pas')
for s in say[1:]:
    if ' donc ' not in s: fail(f'« au tableau » sans donc : {s.strip()[:60]}…')
    if 'parce que' in s: warn(f'« parce que » dans un au tableau (préférer donc) : {s.strip()[:60]}…')
figs = re.findall(r'<div class="fig" id="fig\d+">', t)
if not figs: fail('aucune figure')
if not re.search(r'SL\.(plot|repeat|descent|trace|plane)\(', t): fail('aucune figure construite avec sheetlib')
for f in re.findall(r'<div class="fig" id="(fig\d+)">(.*?)</div>\s*</div>', t, re.S):
    if 'class="cap"' not in f[1]: fail(f'{f[0]} sans légende .cap')
verb = re.findall(r'<li><div class="q">', t)
if not (4 <= len(verb) <= 6): fail(f'chaîne verbalisée : {len(verb)} maillons (attendu 4 à 6)')
resume = re.search(r'<div class="card resume">.*?<ol>(.*?)</ol>', t, re.S)
if resume and len(re.findall(r'<li>', resume.group(1))) > 7: fail('résumé > 7 lignes')
if len(re.findall(r'<details', t)): fail('<details> Q/A interdit dans une chaîne (c\'est le format archivé)')
if re.search(r'Encore|Difficile|Bien\s*`', t): fail('notation encore/difficile/bien interdite (Anki fait ça)')

# ---- densité de prose : un pas ne doit pas dépasser ~120 mots dans .rule (hors say)
for sid, body in re.findall(r'<div class="step" id="(s\d+)">(.*?)</div>\s*<div class="card apply">', t, re.S):
    txt = re.sub(r'<p class="say">.*?</p>', '', body, flags=re.S)
    words = len(re.sub(r'<[^>]+>', ' ', txt).split())
    if words > 170: warn(f'{sid} : {words} mots dans la règle (viser < 120)')

# ---- liens internes
for href in re.findall(r'href="((?:\.\./|\./)?[^"#:]+\.html)', t):
    p = os.path.normpath(os.path.join(os.path.dirname(path), href))
    if not os.path.exists(p): warn(f'lien interne vers un fichier absent (peut être une fiche à venir) : {href}')

# ---- rendu
if render:
    outdir = os.path.join(os.path.dirname(path), '..', '_render'); os.makedirs(outdir, exist_ok=True)
    script = f'''
import asyncio, json
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); errs = []
        for scheme in ('dark','light'):
            pg = await b.new_page(viewport={{'width':1280,'height':900}}, color_scheme=scheme)
            pg.on('pageerror', lambda e: errs.append(str(e)))
            pg.on('console', lambda m: errs.append(m.text) if m.type=='error' else None)
            await pg.goto('file://{os.path.abspath(path)}'); await pg.wait_for_timeout(600)
            await pg.screenshot(path='{outdir}/{name[:-5]}-'+scheme+'.png', full_page=True)
            over = await pg.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth")
            if over: errs.append('débordement horizontal en '+scheme)
        pg = await b.new_page(viewport={{'width':390,'height':844}}); await pg.goto('file://{os.path.abspath(path)}'); await pg.wait_for_timeout(300)
        over = await pg.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth+2")
        if over: errs.append('débordement horizontal mobile (390px)')
        await b.close(); print(json.dumps(errs))
asyncio.run(main())
'''
    try:
        out = subprocess.run([sys.executable, '-c', script], capture_output=True, text=True, timeout=120)
        errs = json.loads(out.stdout.strip().splitlines()[-1]) if out.stdout.strip() else ['rendu : pas de sortie', out.stderr[-300:]]
        for e in errs: fail(f'rendu : {e}')
    except Exception as e:
        warn(f'rendu impossible ({e}) — playwright absent ?')

for w in warns: print('WARN', w)
for f in fails: print('FAIL', f)
print(f'{name} : {len(fails)} FAIL, {len(warns)} WARN')
sys.exit(1 if fails else 0)
