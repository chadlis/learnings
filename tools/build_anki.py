#!/usr/bin/env python3
"""build_anki.py — génère anki/ancres.csv à partir des `<meta name="anki">` des sheets.

Une ligne par couple (tag, sheet) : un tag qui traverse quatre sheets a quatre
lignes. C'est le fichier qu'on ouvre tag par tag pour remplir le champ Extra des
cartes — d'où le tri par tag d'abord, et l'URL absolue plutôt que relative,
puisqu'elle est collée dans Anki et non dans le site.

L'ancre : si le tag nomme sans ambiguïté UN pas de la sheet — son mot-clé
apparaît dans le titre d'exactement un `<h3>` — la ligne pointe ce pas. Sinon
elle pointe la sheet : mieux vaut la bonne page que la mauvaise ancre.

    python3 tools/build_anki.py
"""
import os, re, csv, glob, html, unicodedata

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = 'https://learnings-ek5.pages.dev'
OUT = os.path.join(ROOT, 'anki', 'ancres.csv')

META = re.compile(r'<meta name="anki" content="([^"]*)"')
SHEET = re.compile(r'<meta name="sheet" content="([^"]*)"')
TITLE = re.compile(r'<title>(.*?)</title>', re.S)
STEP = re.compile(r'<div class="step" id="(s\d+)">(.*?)(?=<div class="step" id="|\Z)', re.S)
H3 = re.compile(r'<h3>(.*?)</h3>', re.S)
TAGS = re.compile(r'<[^>]+>')
# suffixes que le <title> porte par convention de série
SUFFIX = re.compile(r'\s*—\s*(chaîne|déroulé|pont|coding|fiche thématique)\s*$')


def fold(s):
    """Minuscules, sans accents, tirets et ponctuation ramenés à des espaces."""
    s = unicodedata.normalize('NFD', s.lower())
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return ' ' + re.sub(r'[^a-z0-9]+', ' ', s).strip() + ' '


def sheet_id(meta):
    """p03-01 / w01-04 / b04 / c05, comme dans specs/ — pas comme dans le nom du fichier."""
    d = dict(kv.split('=', 1) for kv in meta.split(';') if '=' in kv)
    series, part, number = d.get('series'), d.get('part'), d.get('number')
    if series == 'chain':       return f'p{part}-{number}'
    if series == 'walkthrough': return f'w{part}-{number}'
    if series == 'bridge':      return f'b{number}'
    if series == 'coding':      return f'c{number}'
    return f'{series}-{part}-{number}'


def main():
    rows = []
    unanchored = 0
    for path in sorted(glob.glob(os.path.join(ROOT, 'sheets', '*', '*.html'))):
        text = open(path, encoding='utf-8').read()
        m_anki, m_sheet = META.search(text), SHEET.search(text)
        if not (m_anki and m_sheet):
            continue                      # fiches archivées : autre genre, pas de tags
        sid = sheet_id(m_sheet.group(1))
        title = SUFFIX.sub('', html.unescape(TITLE.search(text).group(1)).strip())
        url = f'{SITE}/{os.path.relpath(path, ROOT)}'

        # titre de chaque pas, balises retirées
        steps = [(sid_, fold(TAGS.sub(' ', H3.search(body).group(1))))
                 for sid_, body in STEP.findall(text) if H3.search(body)]

        for tag in [t.strip() for t in m_anki.group(1).split(',') if t.strip()]:
            key = fold(tag.split('::')[-1])
            # un mot-clé trop court ferait feu sur n'importe quoi
            hits = [a for a, h in steps if len(key.strip()) >= 4 and key.strip() in h]
            anchor = hits[0] if len(hits) == 1 else ''
            unanchored += not anchor
            rows.append([tag, sid, title, url + (f'#{anchor}' if anchor else ''), anchor])

    rows.sort(key=lambda r: (r[0], r[1]))
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w', encoding='utf-8', newline='') as f:
        # lineterminator explicite : le défaut csv est \r\n, qui traverse mal un champ Anki
        w = csv.writer(f, delimiter=';', lineterminator='\n')
        w.writerow(['tag', 'id', 'titre', 'url', 'ancre'])
        w.writerows(rows)

    tags = {r[0] for r in rows}
    print(f'anki/ancres.csv : {len(rows)} lignes · {len(tags)} tags · '
          f'{len(rows) - unanchored} ancrées sur un pas, {unanchored} sur la sheet')


if __name__ == '__main__':
    main()
