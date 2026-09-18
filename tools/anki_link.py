#!/usr/bin/env python3
"""anki_link.py — ajoute dans le champ Extra de chaque note Anki le lien vers la sheet du site, par tag.

Usage (Anki ouvert, AnkiConnect actif, fenêtre Browse FERMÉE) :
    python3 tools/anki_link.py            # applique
    python3 tools/anki_link.py --dry-run  # montre ce qui serait fait, n'écrit rien

Lit anki/ancres.csv (tag;id;titre;url;ancre). Pour chaque tag : trouve les notes,
et ajoute en fin du champ Extra (ou Back Extra) un bloc <p class="sheet-link"> par sheet,
sauf si l'URL y est déjà. Une note portant plusieurs tags reçoit plusieurs liens.
Idempotent : relancer n'ajoute rien.
"""
import csv, json, sys, urllib.request
from collections import defaultdict

ANKI = 'http://localhost:8765'
CSV = 'anki/ancres.csv'
DRY = '--dry-run' in sys.argv

def ac(action, **params):
    req = urllib.request.Request(ANKI, json.dumps({'action': action, 'version': 6, 'params': params}).encode(), {'Content-Type': 'application/json'})
    r = json.load(urllib.request.urlopen(req))
    if r.get('error'): raise RuntimeError(f"{action}: {r['error']}")
    return r['result']

# 1. liens par tag
links = defaultdict(list)
for row in csv.DictReader(open(CSV, encoding='utf-8'), delimiter=';'):
    links[row['tag']].append((row['id'], row['titre'], row['url']))

# 2. notes par tag → liens par note, dédoublonnés par sheet, au plus MAX_LINKS
MAX_LINKS = 3
RANK = {'p': 0, 'w': 1, 'b': 2, 'c': 3}          # chaînes, déroulés, ponts, coding
per_note = defaultdict(dict)   # note_id -> {sheet_id: (titre, url)}
for tag, lst in links.items():
    for nid in ac('findNotes', query=f'tag:{tag}'):
        for sid, titre, url in lst:
            if sid not in per_note[nid] or ('#' in url and '#' not in per_note[nid][sid][1]):
                per_note[nid][sid] = (titre, url)
for nid, d in per_note.items():
    keep = sorted(d, key=lambda s: (RANK.get(s[0], 9), s))[:MAX_LINKS]
    per_note[nid] = {s: d[s] for s in keep}
print(f'{len(links)} tags, {len(per_note)} notes concernées, max {MAX_LINKS} liens par note')

# 3. lecture + écriture
infos = {n['noteId']: n for n in ac('notesInfo', notes=list(per_note))}
done = skipped = 0
for nid, urls in per_note.items():
    info = infos.get(nid)
    if not info: continue
    field = 'Extra' if 'Extra' in info['fields'] else 'Back Extra' if 'Back Extra' in info['fields'] else None
    if field is None:
        print(f'  ! note {nid} ({info["modelName"]}) : pas de champ Extra, ignorée'); continue
    cur = info['fields'][field]['value']
    add = [f'<p class="sheet-link">📎 <a href="{url}">{sid} · {titre}</a></p>'
           for sid, (titre, url) in urls.items() if url.split('#')[0] not in cur]
    if not add:
        skipped += 1; continue
    new = cur + ''.join(add)
    if DRY:
        print(f'  {nid} [{field}] + {len(add)} lien(s) : ' + ', '.join(urls))
    else:
        ac('updateNoteFields', note={'id': nid, 'fields': {field: new}})
    done += 1
print(f'{"à écrire" if DRY else "écrites"} : {done} notes · déjà liées : {skipped}')
if not DRY:
    print('Vérifie une note au hasard dans Browse, puis synchronise.')
