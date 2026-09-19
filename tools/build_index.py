#!/usr/bin/env python3
"""build_index.py — génère index.html (par partie, ordre de dépendance) et map.html (carte des prérequis).

Sources : specs/*.md (frontmatter : id, series, part, number, slug, title, subtitle, prereq, next, status)
          sheets/**/*.html (existence ⇒ lien ; sinon « à venir »)
          sheets/archive/*.html (anciennes fiches thématiques, listées en annexe)
Remplace l'ancien build_index.py (index par deck Anki). Ne pas éditer index.html / map.html à la main.
"""
import os, re, glob, html, datetime, hashlib

ROOT = os.path.dirname(os.path.abspath(__file__)) + '/..'
PARTS = [
    ('00', '0 · Socle probabiliste', 'teal'), ('01', '1 · L\'objet aléatoire (fil A)', 'sky'),
    ('02', '2 · Le bruit décide (fil B)', 'violet'), ('03', '3 · Critère et descente (fil C, optim)', 'yellow'),
    ('04', '4 · Matrice = action', 'mint'), ('05', '5 · Modèles linéaires', 'sky'),
    ('06', '6 · Évaluer', 'coral'), ('07', '7 · Arbres, ensembles, k-means', 'violet'),
    ('08', '8 · Calcul, numérique, tenseurs', 'teal'), ('09', '9 · Coding', 'mint'),
    ('B', 'Ponts', 'amber'),
    ('10', 'Phase 2 · micrograd', 'faint'), ('11', 'Phase 2 · makemore', 'faint'), ('12', 'Phase 2 · transformer', 'faint'),
    ('13', 'Phase 2 · tokenizer', 'faint'), ('14', 'Phase 2 · mech interp', 'faint'),
    ('20', 'Phase 3 · evals', 'faint'), ('21', 'Phase 3 · fine-tuning', 'faint'), ('22', 'Phase 3 · inference', 'faint'),
    ('30', 'Phase 4 · system design', 'faint'),
]
DIR = {'chain': 'chains', 'walkthrough': 'walkthroughs', 'bridge': 'bridges', 'coding': 'coding'}
LABEL = {'chain': 'chaîne', 'walkthrough': 'déroulé', 'bridge': 'pont', 'coding': 'coding'}

def fm(path):
    t = open(path, encoding='utf-8').read()
    m = re.match(r'---\n(.*?)\n---', t, re.S)
    d = {}
    for line in m.group(1).splitlines():
        k, _, v = line.partition(':'); v = v.strip().strip('"')
        if v.startswith('['): v = [x.strip().strip('"') for x in v[1:-1].split(',') if x.strip()]
        d[k.strip()] = v
    return d

def out_path(s):
    if s['series'] == 'chain': name = f"chain-{s['id']}-{s['slug']}.html"
    elif s['series'] == 'walkthrough': name = f"walkthrough-{s['id'][1:]}-{s['slug']}.html".replace('walkthrough-0', 'walkthrough-p0', 1)
    elif s['series'] == 'bridge': name = f"bridge-{s['number']}-{s['slug']}.html"
    else: name = f"coding-{s['number']}-{s['slug']}.html"
    return f"sheets/{DIR[s['series']]}/{name}"

specs = [fm(p) for p in sorted(glob.glob(f'{ROOT}/specs/*.md')) if not p.endswith('README.md')]
for s in specs:
    p = out_path(s); s['href'] = p; s['exists'] = os.path.exists(f'{ROOT}/{p}')
    if not s['exists'] and s['series'] == 'walkthrough':  # anciens noms dNN
        old = glob.glob(f"{ROOT}/sheets/walkthroughs/walkthrough-d{s['number']}-*.html")
        if old: s['href'] = os.path.relpath(old[0], ROOT); s['exists'] = True
byid = {s['id']: s for s in specs}

def version(href):
    """Version publiée d'une sheet, lue dans sa meta `sheet` (…;status=vN).

    C'est le fichier qui fait foi, pas le spec : une sheet révisée porte sa
    version dans son `<title>`, son footer et cette meta, et l'index doit dire
    la même chose. Repli sur v1 si la meta manque ou n'a pas de status.
    """
    try:
        t = open(f'{ROOT}/{href}', encoding='utf-8').read(4096)
    except OSError:
        return 'v1'
    m = re.search(r'<meta name="sheet" content="[^"]*status=(v\d+)', t)
    return m.group(1) if m else 'v1'


def item(s):
    cls = 'it' + ('' if s['exists'] else ' todo')
    k = {'chain': s['number'], 'walkthrough': 'D' + s['number'], 'bridge': 'P' + s['number'], 'coding': 'C' + s['number']}[s['series']]
    sub = html.escape(s.get('subtitle', ''))
    n = version(s['href']) if s['exists'] else ('spec prêt' if s['status'] == 'ready' else 'à venir')
    inner = f'<span class="k">{k}</span><span class="t">{html.escape(s["title"])}<small>{LABEL[s["series"]]} · {sub}</small></span><span class="n">{n}</span>'
    return f'<a class="{cls}" href="{s["href"]}">{inner}</a>' if s['exists'] else f'<div class="{cls}">{inner}</div>'

CSS = """:root{--board:#20312C;--chalk:#EDE8DA;--muted:#C9C4B6;--faint:#8F9A93;--yellow:#F0D178;--mint:#B9E2C4;--sky:#A7CCEB;--teal:#9FE0D2;--violet:#C8B6F5;--coral:#F3A28F;--amber:#F0D178;--line:rgba(237,232,218,.18);--card:#F5F1E6;--cardink:#22302B}
*{box-sizing:border-box;margin:0;padding:0}body{background:var(--board);color:var(--chalk);font-family:"Avenir Next",Avenir,"Segoe UI",Roboto,sans-serif;padding:32px clamp(14px,4vw,48px) 60px;max-width:860px;margin:0 auto}
h1{font-family:Georgia,serif;font-weight:400;font-size:clamp(30px,5vw,44px);text-shadow:0 0 1px rgba(237,232,218,.55);line-height:1.1}h1 span{text-decoration:underline;text-decoration-color:var(--yellow);text-decoration-thickness:3px;text-underline-offset:7px}
p.sub{color:var(--muted);margin:16px 0 26px;max-width:62ch;line-height:1.55}a{color:inherit}
h2{font-family:Georgia,serif;font-weight:400;font-size:19px;margin:30px 0 10px;color:var(--chalk)}h2::before{content:"";display:inline-block;width:22px;height:2px;background:var(--ac,var(--yellow));vertical-align:middle;margin-right:10px}
h3{font:600 11.5px "Avenir Next",Avenir,"Segoe UI",sans-serif;letter-spacing:.08em;text-transform:uppercase;color:var(--faint);margin:36px 0 4px}
.it{display:grid;grid-template-columns:44px 1fr auto;gap:12px;align-items:center;background:var(--card);color:var(--cardink);text-decoration:none;padding:12px 16px;border-radius:3px;margin-bottom:8px;box-shadow:0 10px 20px -14px rgba(0,0,0,.6);border-left:4px solid var(--ac,var(--yellow))}
a.it:hover{transform:translateY(-1px)}.it .k{font-family:Georgia,serif;font-size:20px;color:#4E5A55}.it .t{font-size:15.5px;font-weight:500}.it .t small{display:block;font-weight:400;font-size:12.5px;color:#4E5A55;margin-top:2px}.it .n{font-size:12.5px;color:#4E5A55;text-align:right}
.it.todo{opacity:.45;background:transparent;color:var(--muted);border-left-style:dashed;box-shadow:none}.it.todo .k,.it.todo .t small,.it.todo .n{color:var(--faint)}
.nav{display:flex;gap:14px;margin:8px 0 0;font-size:14px}.nav a{color:var(--muted)}
footer{margin-top:36px;color:var(--faint);font-size:13px;border-top:1.5px solid var(--line);padding-top:12px;line-height:1.6}
.map{overflow-x:auto;margin-top:18px}.map svg{min-width:1600px;width:100%;height:auto}body.wide{max-width:1500px}
.map text{font:12px "Avenir Next",Avenir,"Segoe UI",sans-serif;fill:var(--chalk)}.map .todo text{fill:var(--faint)}.map .part{font:600 11px sans-serif;letter-spacing:.08em;fill:var(--faint)}
.map rect{fill:#1A2925;stroke:var(--ac,var(--yellow));stroke-width:1.5}.map .todo rect{stroke-dasharray:4 3;opacity:.6}.map .edge{fill:none;stroke:rgba(237,232,218,.35);stroke-width:1.2;marker-end:url(#ah)}.map .bridge rect{stroke:var(--amber)}
"""
# Bloc PWA : index.html et map.html sont à la racine, donc tous les chemins sont
# nus. Le service worker ne s'enregistre que sur http(s) — en file:// l'API
# n'existe pas, on ne tente rien et rien n'échoue.
PWA = ('<link rel="manifest" href="manifest.webmanifest">'
       '<link rel="icon" type="image/svg+xml" href="icone-fiches.svg">'
       '<link rel="apple-touch-icon" href="apple-touch-icon.png">'
       '<meta name="theme-color" content="#20312C">'
       '<meta name="mobile-web-app-capable" content="yes">'
       '<meta name="apple-mobile-web-app-capable" content="yes">'
       '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">'
       '<meta name="apple-mobile-web-app-title" content="Fiches">'
       "<script>if('serviceWorker' in navigator&&location.protocol.startsWith('http')){"
       "window.addEventListener('load',function(){"
       "navigator.serviceWorker.register('sw.js',{scope:'./'}).catch(function(){});});}</script>")
today = datetime.date.today().strftime('%d/%m/%Y')

# ---------- index.html
out = [f'<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Fiches — formation ML/LLM</title><style>{CSS}</style>{PWA}</head><body>',
       '<h1>Formation ML/LLM — <span>fiches</span></h1>',
       '<p class="sub">Rangées par dépendance, pas par deck : chaque chaîne suppose les précédentes. Une chaîne = hypothèses → mécanisme → où ça casse → résumé ; un déroulé = la même chaîne sur des exemples chiffrés ; un pont = un mécanisme vu dans plusieurs domaines. Anki teste l\'atome ; ici on relit l\'enchaînement.</p>',
       '<div class="nav"><a href="map.html">Carte des prérequis</a> · <a href="timeline.html">Timeline</a></div>']
for part, title, ac in PARTS:
    items = [s for s in specs if s['part'] == part and not s['id'].endswith('-00')]
    if not items and part not in ('10','11','12','13','14','20','21','22','30'): continue
    out.append(f'<div style="--ac:var(--{ac})"><h2>{html.escape(title)}</h2>')
    if not items: out.append('<div class="it todo"><span class="k">·</span><span class="t">partie vide<small>la sheet du bloc arrive avec la revue du vendredi</small></span><span class="n">Phase à venir</span></div>')
    order = {'chain': 0, 'walkthrough': 1, 'bridge': 0, 'coding': 0}
    for s in sorted(items, key=lambda s: (order[s['series']], s['number'])): out.append(item(s))
    out.append('</div>')
arch = sorted(glob.glob(f'{ROOT}/sheets/archive/*.html'))
if arch:
    out.append('<h3>Archive — fiches thématiques Q/A (11/09/2026), remplacées par Anki</h3><div style="--ac:var(--faint)">')
    for a in arch:
        t = re.search(r'<title>(.*?)</title>', open(a, encoding='utf-8').read()); t = html.unescape(t.group(1)) if t else os.path.basename(a)
        out.append(f'<a class="it" href="sheets/archive/{os.path.basename(a)}" style="opacity:.7"><span class="k">A</span><span class="t">{html.escape(t)}</span><span class="n">archive</span></a>')
    out.append('</div>')
out.append(f'<footer>Un HTML par entrée, <code>assets/sheetlib.js</code> partagé, ouvrable hors ligne. Convention : <code>sheets/chains/chain-pPP-NN-&lt;slug&gt;.html</code> · <code>sheets/walkthroughs/walkthrough-pPP-NN-…</code> · <code>sheets/bridges/bridge-NN-…</code> · <code>sheets/coding/coding-NN-…</code> · <code>sheets/archive/</code>. Index et carte générés par <code>tools/build_index.py</code> le {today} — ne pas éditer à la main.</footer></body></html>')
open(f'{ROOT}/index.html', 'w', encoding='utf-8').write('\n'.join(out))

# ---------- map.html : colonnes = parties 0–9 + ponts ; arêtes = prereq
cols = [p for p in PARTS if p[0] in ('00','01','02','03','04','05','06','07','08','09','B')]
colw, rowh, x0, y0, bw, bh = 200, 58, 20, 56, 182, 42
pos = {}
svg = []
for ci, (part, title, ac) in enumerate(cols):
    items = [s for s in specs if s['part'] == part and s['series'] in ('chain', 'bridge', 'coding') and not s['id'].endswith('-00')]
    items.sort(key=lambda s: s['number'])
    x = x0 + ci * colw
    svg.append(f'<text class="part" x="{x}" y="{y0 - 22}">{html.escape(title.split("·")[0].strip() if part != "B" else "PONTS")}</text>')
    for ri, s in enumerate(items):
        y = y0 + ri * rowh; pos[s['id']] = (x, y)
        cls = ('' if s['exists'] else 'todo ') + ('bridge' if s['series'] == 'bridge' else '')
        label = s['title'][:27] + ('…' if len(s['title']) > 27 else '')
        node = f'<g id="{s["id"]}" class="{cls}" style="--ac:var(--{ac})"><rect x="{x}" y="{y}" width="{bw}" height="{bh}" rx="3"/><text x="{x + 8}" y="{y + 16}" style="font-weight:600">{html.escape(s["id"])}</text><text x="{x + 8}" y="{y + 32}" style="font-size:11.5px">{html.escape(label)}</text></g>'
        svg.append(f'<a href="{s["href"]}">{node}</a>' if s['exists'] else node)
edges = []
for s in specs:
    if s['id'] not in pos: continue
    for p in (s.get('prereq') or []):
        if p in pos and pos[p][0] <= pos[s['id']][0]:
            (xa, ya), (xb, yb) = pos[p], pos[s['id']]
            edges.append(f'<path class="edge" d="M{xa + bw} {ya + bh / 2} C{xa + bw + 40} {ya + bh / 2},{xb - 40} {yb + bh / 2},{xb} {yb + bh / 2}"/>')
H = y0 + rowh * max([len([s for s in specs if s['part'] == p[0] and not s['id'].endswith('-00')]) for p in cols] + [1]) + 30
W = x0 + colw * len(cols)
mapout = [f'<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Carte des prérequis — fiches</title><style>{CSS}</style>{PWA}</head><body>',
          '<script>document.body.className="wide"</script><h1>Carte des <span>prérequis</span></h1>', '<p class="sub">Une flèche = « suppose acquis ». Pointillé = pas encore écrit. Clique une chaîne existante pour l\'ouvrir ; les déroulés sont listés sous chaque chaîne dans l\'index.</p>',
          '<div class="nav"><a href="index.html">← Index</a></div>',
          f'<div class="map"><svg viewBox="0 0 {W} {H}" xmlns="http://www.w3.org/2000/svg"><defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="rgba(237,232,218,.5)"/></marker></defs>',
          *edges, *svg, '</svg></div>',
          f'<footer>Générée par <code>tools/build_index.py</code> le {today}. Les ancres <code>#pNN-MM</code> de cette page sont les cibles des liens « prérequis » des sheets.</footer></body></html>']
open(f'{ROOT}/map.html', 'w', encoding='utf-8').write('\n'.join(mapout))

# ---------- sw.js : version du cache = empreinte de ce qui est servi
# Le compteur n'avance que si l'empreinte change : rejouer le script sans rien
# modifier ne touche pas sw.js (le script reste idempotent, `make check` passe).
def site_files():
    names = ['index.html', 'map.html', 'timeline.html', 'manifest.webmanifest',
             'assets/sheetlib.js', 'icon.svg', 'icone-fiches.svg', 'apple-touch-icon.png']
    files = [f'{ROOT}/{n}' for n in names if os.path.exists(f'{ROOT}/{n}')]
    return sorted(files) + sorted(glob.glob(f'{ROOT}/sheets/*/*.html'))

def update_service_worker():
    sw = f'{ROOT}/sw.js'
    if not os.path.exists(sw): return
    h = hashlib.sha256()
    for f in site_files():
        h.update(os.path.relpath(f, ROOT).replace(os.sep, '/').encode())
        h.update(open(f, 'rb').read())
    fp = h.hexdigest()[:16]
    t = open(sw, encoding='utf-8').read()
    m = re.search(r"const CACHE = 'sheets-v(\d+)-([0-9a-f]+)';", t)
    if not m:
        print("  ! sw.js : ligne 'const CACHE' introuvable"); return
    if m.group(2) == fp: return
    v = int(m.group(1)) + 1
    open(sw, 'w', encoding='utf-8').write(t[:m.start()] + f"const CACHE = 'sheets-v{v}-{fp}';" + t[m.end():])
    print(f'sw.js : cache sheets-v{v}-{fp}')

update_service_worker()
print(f'index.html : {len(specs)} specs, {sum(s["exists"] for s in specs)} sheets existantes · map.html : {len(pos)} nœuds, {len(edges)} arêtes')
