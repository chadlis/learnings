#!/usr/bin/env python3
"""build_index.py — génère index.html (par partie, ordre de dépendance) et map.html (carte des prérequis).

Sources : specs/*.md (frontmatter : id, series, part, number, slug, title, subtitle, prereq, next, status)
          sheets/**/*.html (existence ⇒ lien ; sinon « à venir »)
          sheets/archive/*.html (anciennes fiches thématiques, listées en annexe)
Remplace l'ancien build_index.py (index par deck Anki). Ne pas éditer index.html / map.html à la main.

Le graphe des prérequis (E, sa réduction transitive R, amont/aval de chaque
nœud) est calculé ici une fois pour toutes par `graph()` ; tools/test_graph.py
le vérifie. Une spec déclare tout ce qu'elle suppose, c'est la carte qui réduit.
"""
import os, re, glob, html, datetime, hashlib

ROOT = os.path.dirname(os.path.abspath(__file__)) + '/..'
# (code, titre, couleur, phrase de tenue). La phrase est la chaîne du fil
# compressée en une ligne : l'index la rend floutée, elle se révèle au tap.
# Phrase vide ⇒ rien n'est rendu (les parties encore vides des phases 2 à 4).
PARTS = [
    ('00', '0 · Socle probabiliste', 'teal',
     "Une loi est une hypothèse sur le mécanisme ; une densité s'évalue, elle ne se lit pas."),
    ('01', "1 · L'objet aléatoire (fil A)", 'sky',
     "Qu'est-ce qui varierait si je refaisais l'expérience ? Le 95 % porte sur la procédure."),
    ('02', '2 · Le bruit décide (fil B)', 'violet',
     "Une loss est une hypothèse de bruit, une pénalité un prior, +λI translate le spectre."),
    ('03', '3 · Critère et descente (fil C, optim)', 'yellow',
     "Un critère n'apprend que là où sa pente n'est pas nulle : l'escalier ne voit rien dans une marche."),
    ('04', '4 · Matrice = action', 'mint',
     "Ax est un geste, pas un tableau : un étirement entre deux rotations, et les directions fixes gouvernent."),
    ('05', '5 · Modèles linéaires', 'sky',
     "Une hypothèse sur y sachant x : des carrés parce que gaussien, une log-cote parce que Bernoulli."),
    ('06', '6 · Évaluer', 'coral',
     "Le tirage est le dataset entier ; l'erreur se coupe en trois ; un seuil fait la décision."),
    ('07', '7 · Arbres, ensembles, k-means', 'violet',
     "Un arbre coupe où l'impureté baisse ; moyenner réduit la variance ; boosting ajuste le gradient de la loss."),
    ('08', '8 · Calcul, numérique, tenseurs', 'teal',
     "Une dérivée est une matrice, un tenseur un ruban de mémoire, CE = H + KL."),
    ('09', '9 · Coding', 'mint',
     "Signal → pattern → invariant → complexité ; jamais le code d'abord, toujours la preuve."),
    ('B', 'Ponts', 'amber',
     "Le même mécanisme dans plusieurs domaines : −η·gradient partout, biais-variance à sept échelles."),
    ('10', 'Phase 2 · micrograd', 'faint', ''), ('11', 'Phase 2 · makemore', 'faint', ''),
    ('12', 'Phase 2 · transformer', 'faint', ''), ('13', 'Phase 2 · tokenizer', 'faint', ''),
    ('14', 'Phase 2 · mech interp', 'faint', ''),
    ('20', 'Phase 3 · evals', 'faint', ''), ('21', 'Phase 3 · fine-tuning', 'faint', ''),
    ('22', 'Phase 3 · inference', 'faint', ''),
    ('30', 'Phase 4 · system design', 'faint', ''),
]
# Colonnes de la carte : parties 0–9 + ponts. Les déroulés n'y figurent pas
# (ils sont listés sous leur chaîne dans l'index), les squelettes -00 non plus.
MAP_PARTS = ('00', '01', '02', '03', '04', '05', '06', '07', '08', '09', 'B')
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

def load_specs():
    """Les specs, avec `href` (chemin déduit) et `exists` (la sheet est écrite)."""
    specs = [fm(p) for p in sorted(glob.glob(f'{ROOT}/specs/*.md')) if not p.endswith('README.md')]
    for s in specs:
        p = out_path(s); s['href'] = p; s['exists'] = os.path.exists(f'{ROOT}/{p}')
        if not s['exists'] and s['series'] == 'walkthrough':  # anciens noms dNN
            old = glob.glob(f"{ROOT}/sheets/walkthroughs/walkthrough-d{s['number']}-*.html")
            if old: s['href'] = os.path.relpath(old[0], ROOT); s['exists'] = True
    return specs

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
# Propre à index.html : la carte partage la constante CSS et n'a pas de phrase
# de tenue — lui servir ces règles ferait bouger map.html pour rien.
# Floutage repris des sheets (`.verb .a.hid`), repli sans flou si l'on demande
# moins d'animation : un flou plein écran n'est pas confortable pour tout le monde.
CSS_INDEX = """
p.tenue{color:var(--muted);font-size:15px;line-height:1.45;margin:-2px 0 14px;max-width:72ch;cursor:pointer;user-select:none;-webkit-user-select:none}
p.tenue.hid{filter:blur(6px)}
@media(prefers-reduced-motion:reduce){p.tenue.hid{filter:none;opacity:.35}}
"""
# Propre à map.html : la liste (hubs, cartes compactes) et le repli du dessin.
# La page n'a pas de largeur minimale ; seul le SVG, dans le <details>, garde
# ses 1600 px (règle `.map svg` de la constante partagée) et défile à l'intérieur.
CSS_MAP = """
p.why{color:var(--muted);font-size:14.5px;line-height:1.5;margin:-4px 0 12px;max-width:62ch}
ol.hubs{list-style:none;margin-bottom:8px}ol.hubs li{display:grid;grid-template-columns:auto 1fr;gap:0 10px;align-items:baseline;padding:7px 0;border-bottom:1px solid var(--line);font-size:15px;line-height:1.35}
ol.hubs .k{font-family:Georgia,serif;color:var(--yellow)}ol.hubs a{text-decoration:none}ol.hubs a:hover{text-decoration:underline}ol.hubs .n{grid-column:2;color:var(--faint);font-size:12.5px}
.node{background:var(--card);color:var(--cardink);border-left:4px solid var(--ac,var(--yellow));border-radius:3px;padding:10px 14px;margin-bottom:8px;box-shadow:0 10px 20px -14px rgba(0,0,0,.6);scroll-margin-top:16px}
.node .hd{display:flex;gap:10px;align-items:baseline;flex-wrap:wrap}.node .k{font-family:Georgia,serif;font-size:17px;color:#4E5A55}.node .t{font-size:15px;font-weight:500;text-decoration:none}a.t:hover{text-decoration:underline}
.node.todo{opacity:.55;background:transparent;color:var(--muted);border-left-style:dashed;box-shadow:none}.node.todo .k{color:var(--faint)}
.node .dep{font-size:12.5px;color:#4E5A55;margin-top:4px;line-height:1.55}.node.todo .dep{color:var(--faint)}.node .dep b{font-weight:600;margin-right:4px}.node .dep a{text-decoration:none}.node .dep a:hover{text-decoration:underline}
.node:target{outline:2px solid var(--ac,var(--yellow));outline-offset:2px}
details.draw{margin-top:36px}details.draw summary{cursor:pointer;color:var(--muted);font-size:14px}
@media(min-width:900px){details.draw{width:min(1500px,calc(100vw - 2*clamp(14px,4vw,48px)));position:relative;left:50%;transform:translateX(-50%)}}
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

# ---------- graphe des prérequis
def map_nodes(specs):
    """Les nœuds de la carte : chaînes, ponts et coding des parties 0–9 + B, sans squelette -00."""
    return [s for s in specs if s['part'] in MAP_PARTS and s['series'] in ('chain', 'bridge', 'coding') and not s['id'].endswith('-00')]

def closure(edges):
    """Fermeture transitive : nœud → ensemble des nœuds atteignables par ≥ 1 arête."""
    succ = {}
    for a, b in edges: succ.setdefault(a, set()).add(b)
    out = {}
    for a in set(x for e in edges for x in e):
        seen, stack = set(), list(succ.get(a, ()))
        while stack:
            x = stack.pop()
            if x in seen: continue
            seen.add(x); stack.extend(succ.get(x, ()))
        out[a] = seen
    return out

def reduce_edges(E):
    """Réduction transitive de E, dans l'ordre trié des arêtes.

    a→b est retirée si b reste atteignable depuis a sans elle (un chemin
    a→…→b de longueur ≥ 2). Le test se fait sur le graphe déjà réduit, arête
    après arête, ce qui garantit une fermeture transitive identique à celle de
    E même quand les specs forment un cycle (p03-02 ↔ p08-01 se supposent
    l'une l'autre) — sur un DAG c'est la réduction transitive habituelle.
    """
    R = set(E)
    for e in sorted(E):
        rest = R - {e}
        if e[1] in closure(rest).get(e[0], ()): R = rest
    return sorted(R)

def graph(specs):
    """E, R et, pour chaque nœud, amont/aval directs (dans R) et transitifs (dans E)."""
    nodes = map_nodes(specs)
    ids = {s['id'] for s in nodes}
    E = sorted((p, s['id']) for s in nodes for p in (s.get('prereq') or []) if p in ids)
    R = reduce_edges(E)
    down_t = closure(E)
    up_t = {}
    for a, reach in down_t.items():
        for b in reach: up_t.setdefault(b, set()).add(a)
    g = {'nodes': nodes, 'E': E, 'R': R, 'up': {}, 'down': {}, 'up_t': {}, 'down_t': {}, 'ndesc': {}}
    for s in nodes:
        i = s['id']
        g['up'][i] = [a for a, b in R if b == i]
        g['down'][i] = [b for a, b in R if a == i]
        g['down_t'][i] = sorted(down_t.get(i, set()) - {i})
        g['up_t'][i] = sorted(up_t.get(i, set()) - {i})
        g['ndesc'][i] = len(g['down_t'][i])
    return g

def short_title(t, limit=48):
    """Titre tronqué au premier tiret « — » ou « – », sinon à `limit` caractères + « … »."""
    m = re.split(r'\s+[—–]\s+', t, maxsplit=1)
    if len(m) == 2: return m[0]
    if len(t) <= limit: return t
    cut = t[:limit]
    return cut[:cut.rfind(' ')].rstrip() + '…' if ' ' in cut else cut + '…'

# ---------- index.html
def build_index(specs, today):
    out = [f'<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Fiches — formation ML/LLM</title><style>{CSS}{CSS_INDEX}</style>{PWA}</head><body>',
           '<h1>Formation ML/LLM — <span>fiches</span></h1>',
           '<p class="sub">Rangées par dépendance, pas par deck : chaque chaîne suppose les précédentes. Une chaîne = hypothèses → mécanisme → où ça casse → résumé ; un déroulé = la même chaîne sur des exemples chiffrés ; un pont = un mécanisme vu dans plusieurs domaines. Anki teste l\'atome ; ici on relit l\'enchaînement.</p>',
           '<div class="nav"><a href="map.html">Carte des prérequis</a> · <a href="timeline.html">Timeline</a></div>']
    for part, title, ac, tenue in PARTS:
        items = [s for s in specs if s['part'] == part and not s['id'].endswith('-00')]
        if not items and part not in ('10','11','12','13','14','20','21','22','30'): continue
        say = f'<p class="tenue hid">{html.escape(tenue)}</p>' if tenue else ''
        out.append(f'<div style="--ac:var(--{ac})"><h2>{html.escape(title)}</h2>{say}')
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
    out.append(f'<footer>Un HTML par entrée, <code>assets/sheetlib.js</code> partagé, ouvrable hors ligne. Convention : <code>sheets/chains/chain-pPP-NN-&lt;slug&gt;.html</code> · <code>sheets/walkthroughs/walkthrough-pPP-NN-…</code> · <code>sheets/bridges/bridge-NN-…</code> · <code>sheets/coding/coding-NN-…</code> · <code>sheets/archive/</code>. Index et carte générés par <code>tools/build_index.py</code> le {today} — ne pas éditer à la main.</footer>'
               '<script>document.addEventListener("click",function(e){'
               'var t=e.target&&e.target.closest?e.target.closest(".tenue"):null;'
               'if(t)t.classList.toggle("hid");});</script>'
               '</body></html>')
    open(f'{ROOT}/index.html', 'w', encoding='utf-8').write('\n'.join(out))

# ---------- map.html : la carte en liste (hubs, puis partie par partie), le dessin replié dessous
def ref(s):
    """Lien interne vers la carte d'un nœud : « pPP-NN · titre court »."""
    return f'<a href="#{s["id"]}">{html.escape(s["id"])} · {html.escape(short_title(s["title"]))}</a>'

def build_map(specs, g, today):
    cols = [p for p in PARTS if p[0] in MAP_PARTS]
    byid = {s['id']: s for s in g['nodes']}
    out = [f'<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Carte des prérequis — fiches</title><style>{CSS}{CSS_MAP}</style>{PWA}</head><body>',
           '<h1>Carte des <span>prérequis</span></h1>',
           '<p class="sub">Chaque chaîne dit ce qu\'elle suppose et ce qu\'elle débloque — prérequis directs seulement : ce qu\'une chaîne suppose déjà à travers une autre n\'est pas répété. Grisé = pas encore écrit. Le dessin complet est replié en bas, pour grand écran.</p>',
           '<div class="nav"><a href="index.html">← Index</a></div>']
    # Hubs : les 8 nœuds au plus grand nombre de descendants transitifs.
    hubs = sorted(g['nodes'], key=lambda s: (-g['ndesc'][s['id']], -len(g['down'][s['id']]), s['id']))[:8]
    out.append('<div style="--ac:var(--yellow)"><h2>Ce dont tout dépend</h2>'
               '<p class="why">Une chaîne d\'ici qui s\'effondre en entraîne d\'autres ; une feuille n\'entraîne rien. C\'est l\'ordre de révision, pas l\'ordre de lecture.</p><ol class="hubs">')
    for s in hubs:
        i = s['id']; href = s['href'] if s['exists'] else f'#{i}'
        out.append(f'<li><span class="k">{html.escape(i)}</span><a href="{href}">{html.escape(short_title(s["title"]))}</a>'
                   f'<span class="n">requis directement par {len(g["down"][i])} · {g["ndesc"][i]} descendant{"s" if g["ndesc"][i] > 1 else ""}</span></li>')
    out.append('</ol></div>')
    # Partie par partie : une carte compacte par nœud, avec ses prérequis et successeurs directs dans R.
    for part, title, ac, _tenue in cols:
        items = sorted((s for s in g['nodes'] if s['part'] == part), key=lambda s: s['number'])
        if not items: continue
        out.append(f'<div style="--ac:var(--{ac})"><h2>{html.escape(title)}</h2>')
        for s in items:
            i = s['id']
            t = f'<a class="t" href="{s["href"]}">{html.escape(s["title"])}</a>' if s['exists'] else f'<span class="t">{html.escape(s["title"])} <small>· à venir</small></span>'
            up = ', '.join(ref(byid[p]) for p in g['up'][i]) or 'socle'
            card = f'<div class="node{"" if s["exists"] else " todo"}" id="{i}"><div class="hd"><span class="k">{html.escape(i)}</span>{t}</div><div class="dep pre"><b>← suppose</b> {up}</div>'
            if g['down'][i]: card += f'<div class="dep post"><b>→ débloque</b> {", ".join(ref(byid[n]) for n in g["down"][i])}</div>'
            out.append(card + '</div>')
        out.append('</div>')
    # Le dessin : colonnes = parties 0–9 + ponts, ligne = numéro ; arêtes = prereq (colonne source ≤ colonne cible).
    colw, rowh, x0, y0, bw, bh = 200, 58, 20, 56, 182, 42
    pos, svg = {}, []
    for ci, (part, title, ac, _tenue) in enumerate(cols):
        items = sorted((s for s in g['nodes'] if s['part'] == part), key=lambda s: s['number'])
        x = x0 + ci * colw
        svg.append(f'<text class="part" x="{x}" y="{y0 - 22}">{html.escape(title.split("·")[0].strip() if part != "B" else "PONTS")}</text>')
        for ri, s in enumerate(items):
            y = y0 + ri * rowh; pos[s['id']] = (x, y)
            cls = ('' if s['exists'] else 'todo ') + ('bridge' if s['series'] == 'bridge' else '')
            label = s['title'][:27] + ('…' if len(s['title']) > 27 else '')
            node = f'<g data-id="{s["id"]}" class="{cls}" style="--ac:var(--{ac})"><rect x="{x}" y="{y}" width="{bw}" height="{bh}" rx="3"/><text x="{x + 8}" y="{y + 16}" style="font-weight:600">{html.escape(s["id"])}</text><text x="{x + 8}" y="{y + 32}" style="font-size:11.5px">{html.escape(label)}</text></g>'
            svg.append(f'<a href="{s["href"]}">{node}</a>' if s['exists'] else node)
    edges = []
    for a, b in g['E']:
        if pos[a][0] <= pos[b][0]:
            (xa, ya), (xb, yb) = pos[a], pos[b]
            edges.append(f'<path class="edge" d="M{xa + bw} {ya + bh / 2} C{xa + bw + 40} {ya + bh / 2},{xb - 40} {yb + bh / 2},{xb} {yb + bh / 2}"/>')
    H = y0 + rowh * max([len([s for s in g['nodes'] if s['part'] == p[0]]) for p in cols] + [1]) + 30
    W = x0 + colw * len(cols)
    out += ['<details class="draw"><summary>Voir le dessin (grand écran)</summary>',
            f'<div class="map"><svg viewBox="0 0 {W} {H}" xmlns="http://www.w3.org/2000/svg"><defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="rgba(237,232,218,.5)"/></marker></defs>',
            *edges, *svg, '</svg></div></details>',
            f'<footer>Générée par <code>tools/build_index.py</code> le {today}. Les ancres <code>#pNN-MM</code> de cette page sont les cibles des liens « prérequis » des sheets.</footer></body></html>']
    open(f'{ROOT}/map.html', 'w', encoding='utf-8').write('\n'.join(out))
    return len(edges)

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
    t = open(sw, encoding='utf-8').read()
    m = re.search(r"const CACHE = 'sheets-v(\d+)-([0-9a-f]+)';", t)
    if not m:
        print("  ! sw.js : ligne 'const CACHE' introuvable"); return
    h = hashlib.sha256()
    for f in site_files():
        h.update(os.path.relpath(f, ROOT).replace(os.sep, '/').encode())
        h.update(open(f, 'rb').read())
    # La logique du service worker compte dans l'empreinte : corriger sw.js doit
    # purger les caches déjà posés, sinon la correction n'atteint jamais le
    # navigateur qui garde l'ancienne entrée. Sa propre ligne `const CACHE` est
    # retirée du calcul — sans quoi l'empreinte dépendrait d'elle-même et
    # `make index` ne serait plus idempotent.
    h.update(b'sw.js')
    h.update((t[:m.start()] + t[m.end():]).encode())
    fp = h.hexdigest()[:16]
    if m.group(2) == fp: return
    v = int(m.group(1)) + 1
    open(sw, 'w', encoding='utf-8').write(t[:m.start()] + f"const CACHE = 'sheets-v{v}-{fp}';" + t[m.end():])
    print(f'sw.js : cache sheets-v{v}-{fp}')

def main():
    specs = load_specs()
    today = datetime.date.today().strftime('%d/%m/%Y')
    g = graph(specs)
    build_index(specs, today)
    drawn = build_map(specs, g, today)
    update_service_worker()
    print(f'index.html : {len(specs)} specs, {sum(s["exists"] for s in specs)} sheets existantes · '
          f'map.html : {len(g["nodes"])} nœuds, {len(g["E"])} arêtes prereq, {len(g["R"])} après réduction, {drawn} tracées')

if __name__ == '__main__':
    main()
