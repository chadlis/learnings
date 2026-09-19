#!/usr/bin/env python3
"""test_graph.py — vérifie le graphe des prérequis calculé par build_index.py et sa mise en page dans map.html.

    python3 tools/test_graph.py      # sort 1 au premier échec

Ce que la carte promet, et que rien d'autre ne vérifie :
- R est bien une réduction de E : len(E) − len(R) arêtes retirées, toutes
  transitivement redondantes, et la fermeture transitive de R égale celle de E ;
- REDONDANTES est le nombre attendu sur l'état actuel des specs — s'il bouge,
  c'est qu'une spec a changé de prereq, et le chiffre se met à jour ici, à la main ;
- map.html liste chaque nœud une fois, et le total des « ← suppose » égale len(R).
"""
import os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build_index as b

REDONDANTES = 35
fails = []
def check(cond, msg):
    if not cond: fails.append(msg)

specs = b.load_specs()
g = b.graph(specs)
E, R = g['E'], g['R']
ids = {s['id'] for s in g['nodes']}

check(len(set(E)) == len(E), 'E contient des doublons')
check(set(R) <= set(E), 'R n\'est pas inclus dans E')
check(len(R) == len(E) - REDONDANTES, f'len(R) = {len(R)}, attendu len(E) − {REDONDANTES} = {len(E) - REDONDANTES}')
check(b.closure(R) == b.closure(E), 'la fermeture transitive de R diffère de celle de E')
for a, bb in set(E) - set(R):
    check(bb in b.closure(R).get(a, ()), f'{a}→{bb} retirée sans chemin de remplacement')
for s in g['nodes']:
    i = s['id']
    check(set(g['up_t'][i]) == {a for a in ids if i in b.closure(E).get(a, ())} - {i}, f'amont transitif faux pour {i}')
    check(g['ndesc'][i] == len(g['down_t'][i]), f'ndesc faux pour {i}')

page = open(os.path.join(b.ROOT, 'map.html'), encoding='utf-8').read()
body = re.sub(r'<(script|style)\b[^>]*>.*?</\1>', '', page, flags=re.S)
cards = re.findall(r'<div class="node[^"]*" id="([^"]+)"', body)
check(sorted(cards) == sorted(ids), f'{len(cards)} cartes dans map.html pour {len(ids)} nœuds : '
      f'manquent {sorted(ids - set(cards))}, en trop {sorted(set(cards) - ids)}')
check(len(cards) == len(set(cards)), 'un nœud apparaît deux fois dans la liste')
sup = sum(len(re.findall(r'<a ', m)) for m in re.findall(r'<div class="dep pre">(.*?)</div>', body))
check(sup == len(R), f'{sup} liens « ← suppose » pour {len(R)} arêtes de R')
post = sum(len(re.findall(r'<a ', m)) for m in re.findall(r'<div class="dep post">(.*?)</div>', body))
check(post == len(R), f'{post} liens « → débloque » pour {len(R)} arêtes de R')
check(len(re.findall(r'<g data-id="', body)) == len(ids), 'le dessin n\'a pas un <g> par nœud')

for f in fails: print('FAIL', f)
print(f'graphe : {len(ids)} nœuds, {len(E)} arêtes, {len(R)} après réduction ({len(E) - len(R)} retirées) · '
      f'{"OK" if not fails else str(len(fails)) + " échec(s)"}')
sys.exit(1 if fails else 0)
