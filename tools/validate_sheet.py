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
m = re.search(r'<meta name="sheet" content="series=(\w+);part=([0-9A-Z]+);number=(\d+);status=(v\d+|redirect)">', t)
if not m: fail('meta sheet manquante ou mal formée (series=…;part=…;number=…;status=v1)')
else:
    series, part, number, status = m.groups()
    expect = {'chain': f'chain-p{part}-{number}-', 'walkthrough': f'walkthrough-p{part}-{number}-',
              'bridge': f'bridge-{number}-', 'coding': f'coding-{number}-',
              'lesson': f'lesson-{part}-{number}-'}.get(series)
    if expect and not name.startswith(expect): fail(f'nom de fichier attendu commençant par {expect}, reçu {name}')
# ---- page de redirection (10/10/2026) : une chaîne remplacée par des leçons garde son
#      URL (favoris, cache hors ligne, cartes Anki) et ne contient plus qu'une table
#      ancienne ancre → nouvelle section. Rien des autres branches ne la concerne.
red = re.search(r'<meta name="sheet" content="series=\w+;part=[0-9A-Z]+;number=\d+;status=redirect">', t)
if red:
    tab = re.search(r'<table class="redir">(.*?)</table>', t, re.S)
    rows = re.findall(r'<tr id="([^"]+)">(.*?)</tr>', tab.group(1), re.S) if tab else []
    if not rows: fail('redirection sans table d\'ancres (<table class="redir"> avec des <tr id="sN">)')
    if [r for r, _ in rows] != [f's{i}' for i in range(1, len(rows) + 1)]:
        fail(f'ancres de la table non consécutives : {", ".join(r for r, _ in rows)} (attendu s1…s{len(rows)})')
    for rid, body in rows:
        if not re.search(r'<td class="to"><a href="[^"#]+\.html#[^"]+">', body): fail(f'{rid} : pas de cible principale (td.to a)')
        for href in re.findall(r'href="([^"]+)"', body):
            p, _, frag = href.partition('#')
            target = os.path.normpath(os.path.join(os.path.dirname(path), p))
            if not os.path.exists(target): fail(f'{rid} : cible absente {href}'); continue
            if frag and not re.search(rf'\bid="{re.escape(frag)}"', open(target, encoding='utf-8').read()):
                fail(f'{rid} : ancre #{frag} absente de {p}')
    ext = re.findall(r'(?:src|href)="(https?://[^"]+)"', t) + re.findall(r'@import', t)
    if ext: fail(f'lien ou ressource externe : {ext[:3]}')
    if 'location.replace(' not in t: fail('pas de script qui suit l\'ancre (location.replace)')
    if '../../index.html' not in t: fail('pas de lien retour vers ../../index.html')
    if '<meta name="anki"' in t: fail('meta anki dans une redirection : les tags vivent dans les leçons, sinon anki/ancres.csv pointe ici')
    for w in warns: print('WARN', w)
    for f in fails: print('FAIL', f)
    print(f'{name} : {len(fails)} FAIL, {len(warns)} WARN (redirection, {len(rows)} ancres)')
    sys.exit(1 if fails else 0)

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

# ---- série `lesson` : le cours autoporteur du socle (décidé le 10/10/2026)
# Une leçon n'est pas une chaîne : prose courte permise, et quatre blocs dépliables
# par notion (exemples, preuve, code, où ça casse). Ce que le validateur garde des
# chaînes : figures sheetlib légendées, résumé ≤ 8, chaîne verbalisée 4–7, phrase.
def check_lesson():
    need = {'#prereq': 'id="prereq"', '.lecon': 'class="lecon"', '#resume': 'id="resume"',
            '#verbal': 'id="verbal"', '#links': 'id="links"', '.phrase': 'class="phrase"'}
    for k, v in need.items():
        if v not in t: fail(f'bloc manquant : {k}')
    ids = re.findall(r'<section class="notion[^"]*" id="([^"]+)">', t)
    expected = [f'n{i}' for i in range(1, len(ids) + 1)]
    if ids != expected:
        fail(f'ids des notions non consécutifs : {", ".join(ids)} (attendu n1…n{len(ids)}) — renuméroter, jamais suffixer')
    if len(ids) < 3: fail(f'{len(ids)} notions seulement (min 3)')
    if len(ids) > 14: warn(f'{len(ids)} notions : long, envisager de scinder la leçon')
    bodies = re.split(r'<section class="notion[^"]*" id="n\d+">', t)[1:]
    for nid, body in zip(ids, bodies):
        body = body.split('</section>')[0] if '</section>' in body else body
        has_o, has_c = 'class="tag outil"' in body, 'class="tag culture"' in body
        if has_o == has_c: fail(f'{nid} : exactement une étiquette attendue (tag outil ou tag culture)')
        for cls, what in (('class="idee"', "l'idée"), ('<details class="ex"', 'les exemples'),
                          ('<details class="casse"', 'le « où ça casse »'), ('class="garde"', 'le « ce qu\'on garde »')):
            if cls not in body: fail(f'{nid} : il manque {what} ({cls})')
        if 'class="formule"' not in body: warn(f'{nid} : pas de bloc formule')
        if 'class="src"' not in body: warn(f'{nid} : vidéo source non citée (p.src)')
        for c in re.findall(r'<details class="([^"]*)"', body):
            if c not in ('ex', 'preuve', 'code', 'casse', 'loin'):
                fail(f'{nid} : <details class="{c}"> inconnu (ex, preuve, code, casse, loin)')
        for code in re.findall(r'<details class="code">(.*?)</details>', body, re.S):
            if '<pre class="py">' not in code: fail(f'{nid} : bloc code sans <pre class="py">')
            if '<pre class="out">' not in code: warn(f'{nid} : bloc code sans sortie <pre class="out">')
        idee = re.search(r'<div class="idee">(.*?)</div>', body, re.S)
        if idee:
            words = len(re.sub(r'<[^>]+>', ' ', idee.group(1)).split())
            # 10/10/2026 : Salah accepte de dépasser 140 « de pas beaucoup »
            if words > 180: warn(f'{nid} : {words} mots dans l\'idée (viser ~140, toléré jusqu\'à 180)')
        # v2 de l08 (10/10/2026) : sous l'idée, une vignette qui montre les exemples qu'elle cite
        vis = body.split('<div class="fig vis"')
        if len(vis) < 2:
            warn(f'{nid} : pas de vignette « voir l\'idée » (div.fig.vis) sous l\'idée')
        else:
            if not idee or body.find('<div class="fig vis"') < body.find('<div class="idee">'):
                fail(f'{nid} : la vignette div.fig.vis doit suivre l\'idée')
            seg = re.split(r'<div class="formule"|<details', vis[1])[0]
            if 'class="cap"' not in seg: fail(f'{nid} : vignette div.fig.vis sans légende .cap')
    figs = re.findall(r'<div class="fig" id="fig\d+">', t)
    if not figs: fail('aucune figure')
    if not re.search(r'SL\.(plot|repeat|descent|trace|plane)\(', t): fail('aucune figure construite avec sheetlib')
    for f in re.findall(r'<div class="fig" id="(fig\d+)">(.*?)</div>\s*</div>', t, re.S):
        if 'class="cap"' not in f[1]: fail(f'{f[0]} sans légende .cap')
    verb = re.findall(r'<li><div class="q">', t)
    if not (4 <= len(verb) <= 7): fail(f'chaîne verbalisée : {len(verb)} maillons (attendu 4 à 7)')
    resume = re.search(r'<div class="card resume">.*?<ol>(.*?)</ol>', t, re.S)
    if resume and len(re.findall(r'<li>', resume.group(1))) > 8: fail('résumé > 8 lignes')
    if re.search(r'Encore|Difficile|Bien\s*`', t): fail('notation encore/difficile/bien interdite (Anki fait ça)')

if m and m.group(1) == 'lesson':
    check_lesson()
else:
    # ---- structure de la chaîne
    need = {'#prereq': 'id="prereq"', '#hyp': 'id="hyp"', '.chain': 'class="chain"', '#resume': 'id="resume"',
            '#verbal': 'id="verbal"', '#links': 'id="links"', '.phrase': 'class="phrase"'}
    for k, v in need.items():
        if v not in t: fail(f'bloc manquant : {k}')
    # Le numéro affiché vient d'un compteur CSS : un id suffixé (s4b) ou un trou dans la
    # suite décale les ancres par rapport à ce que le lecteur voit, et tout lien entrant ment.
    all_steps = re.findall(r'<div class="step" id="([^"]+)">', t)
    expected = [f's{i}' for i in range(1, len(all_steps) + 1)]
    if all_steps != expected:
        bad = [a for a, e in zip(all_steps, expected) if a != e] or all_steps[len(expected):]
        fail(f'ids des pas non consécutifs : {", ".join(all_steps)} (attendu s1…s{len(all_steps)}) '
             f'— renuméroter, jamais suffixer : {", ".join(bad[:3])}')
    steps = all_steps
    if len(steps) < 4: fail(f'{len(steps)} pas seulement (min 4)')
    if len(steps) > 14: warn(f'{len(steps)} pas : long, envisager de scinder')
    # Exigé pour toutes les séries, `coding` comprise (revue 6) : les pièges Python ne
    # remplacent pas le « Où ça casse ». Les pièges plantent ou changent la complexité ;
    # le contre-signal, lui, rend la réponse fausse sans erreur — c'est celui-là qui coûte.
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
    if not (4 <= len(verb) <= 7): fail(f'chaîne verbalisée : {len(verb)} maillons (attendu 4 à 7)')
    resume = re.search(r'<div class="card resume">.*?<ol>(.*?)</ol>', t, re.S)
    if resume and len(re.findall(r'<li>', resume.group(1))) > 8: fail('résumé > 8 lignes')
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
