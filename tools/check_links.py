#!/usr/bin/env python3
"""check_links.py — vérifie tous les liens internes du dépôt.

Pour chaque `href` relatif d'un fichier HTML (sheets/, plus index.html, map.html
et timeline.html à la racine) : le fichier cible existe-t-il, et si le lien porte
une ancre, cette ancre existe-t-elle dans la cible ?

Un lien mort ne casse rien de visible — il rend une page, la mauvaise, ou rien du
tout, et c'est le lecteur qui s'en aperçoit trois semaines plus tard. Le validateur
de sheet ne regarde qu'une sheet à la fois : il ne peut pas savoir si la cible existe.

    python3 tools/check_links.py          # rapport, sort 1 si un lien est mort
    python3 tools/check_links.py -v       # liste aussi les liens vérifiés par fichier
"""
import os, re, sys, glob, collections

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HREF = re.compile(r'href="([^"]+)"')
# Les sheets construisent des liens en JS (`href="#${s.id}"`) : ce sont des gabarits,
# pas des liens. On ne scanne donc que le HTML, script et style retirés.
SCRIPT = re.compile(r'<(script|style)\b[^>]*>.*?</\1>', re.S | re.I)
# id="…" et name="…" : les deux façons de poser une ancre
ANCH = re.compile(r'\b(?:id|name)="([^"]+)"')
EXTERNAL = re.compile(r'^(?:https?:|mailto:|tel:|data:|javascript:)', re.I)


def pages():
    yield from sorted(glob.glob(os.path.join(ROOT, 'sheets', '*', '*.html')))
    for name in ('index.html', 'map.html', 'timeline.html'):
        p = os.path.join(ROOT, name)
        if os.path.exists(p):
            yield p


_anchors = {}


def anchors_of(path):
    """Les ancres d'un fichier, lues une seule fois."""
    if path not in _anchors:
        try:
            body = SCRIPT.sub('', open(path, encoding='utf-8').read())
            _anchors[path] = set(ANCH.findall(body))
        except OSError:
            _anchors[path] = set()
    return _anchors[path]


def main():
    verbose = '-v' in sys.argv
    checked = 0
    dead = []                      # (source, href, raison)
    per_file = collections.Counter()

    for src in pages():
        rel_src = os.path.relpath(src, ROOT)
        text = SCRIPT.sub('', open(src, encoding='utf-8').read())
        for href in HREF.findall(text):
            if EXTERNAL.match(href) or href == '#':
                continue
            checked += 1
            per_file[rel_src] += 1
            path, _, frag = href.partition('#')
            target = src if path == '' else os.path.normpath(
                os.path.join(os.path.dirname(src), path))
            if not os.path.exists(target):
                dead.append((rel_src, href, 'fichier absent'))
                continue
            # Une ancre ne se vérifie que dans du HTML qu'on sait lire.
            if frag and target.endswith('.html') and frag not in anchors_of(target):
                dead.append((rel_src, href, f'ancre #{frag} absente de '
                                            f'{os.path.relpath(target, ROOT)}'))

    if verbose:
        for f, n in sorted(per_file.items()):
            print(f'  {n:4d}  {f}')
    for src, href, why in dead:
        print(f'MORT  {src} → {href}  ({why})')
    print(f'{checked} liens internes vérifiés dans {len(per_file)} fichiers · '
          f'{len(dead)} mort{"s" if len(dead) > 1 else ""}')
    return 1 if dead else 0


if __name__ == '__main__':
    sys.exit(main())
