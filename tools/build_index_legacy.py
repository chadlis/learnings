#!/usr/bin/env python3
"""Régénère index.html à partir des fiches présentes dans sheets/.

Python 3, bibliothèque standard uniquement. Idempotent : deux exécutions de
suite produisent exactement le même fichier. Ajouter une fiche ne demande
aucune édition manuelle de l'index — il suffit de déposer le fichier dans
sheets/weekly/, sheets/topics/ ou sheets/walkthroughs/ avec ses métadonnées et
de relancer le script.

Métadonnées lues dans le <head> de chaque fiche :
    <title>…</title>                               titre affiché (version incluse)
    <meta name="sheet" content="series=…;number=…"> série et numéro
    <meta name="deck" content="01">                deck Anki (obligatoire)
    <meta name="subtitle" content="…">             ligne secondaire (optionnel)
Le libellé de droite est calculé, jamais écrit à la main : le nombre de
balises <details> pour une fiche (« 28 q. »), le nombre de marches du rail
et de <figure> pour un déroulé (« 6 marches · 8 fig. »), qui ne pose pas de
questions.
"""

from __future__ import annotations

import hashlib
import html
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent

# Decks Anki : (valeur de <meta name="deck">, variable CSS de couleur, libellé).
# L'ordre de cette liste est l'ordre des sections de l'index.
DECKS = [
    ("00",    "yellow", "🎯 00 · 3 fils"),
    ("01",    "teal",   "🧮 01 · maths-stats"),
    ("02",    "violet", "📊 02 · ml classique"),
    ("03+07", "sky",    "🧪 03 · deep learning &nbsp;·&nbsp; 🐍 07 · python"),
    ("04+05", "coral",  "🤖 04 · llm engineering &nbsp;·&nbsp; 🏛️ 05 · system design"),
    ("06",    "mint",   "🧑🏻‍💻 06 · coding patterns"),
    ("08",    "amber",  "🌐 08 · web"),
]
DECK_ORDER = {d: i for i, (d, _, _) in enumerate(DECKS)}

# Dossiers scannés : (chemin, motif, série par défaut, rang de tri, archive ?)
# Le rang ordonne les entrées d'un même deck : les déroulés viennent après les
# fiches thématiques, parce qu'ils se lisent une fois la fiche connue.
SOURCES = [
    ("sheets/weekly", "sheet-*.html", "weekly", 0, False),
    ("sheets/topics", "sheet-*.html", "topic", 1, False),
    ("sheets/archive", "sheet-*.html", "archive", 2, True),
    ("sheets/walkthroughs", "walkthrough-*.html", "walkthrough", 3, False),
]

# Préfixe du badge de gauche, par série. Le vide laisse le numéro nu.
BADGES = {"topic": "", "walkthrough": "D", "weekly": "W"}


# --------------------------------------------------------------------------
# lecture des fiches
# --------------------------------------------------------------------------

def head_of(text: str) -> str:
    """Le <head> seul, pour ne pas confondre avec le corps de la fiche."""
    end = text.lower().find("</head>")
    return text[: end if end != -1 else 4000]


def meta(head: str, name: str) -> str | None:
    m = re.search(
        r'<meta\s+name="%s"\s+content="([^"]*)"' % re.escape(name), head, re.I
    )
    return m.group(1) if m else None


def short_title(title: str) -> str:
    """« Probabilités & lois — fiche thématique » → « Probabilités & lois ».

    La version vit dans le <title> ; on retire seulement le suffixe de série,
    « — fiche … » pour une fiche, « — déroulé » pour un déroulé.
    """
    return re.sub(r"\s+—\s+(fiche|déroulé)\b.*$", "", title).strip()


def count_steps(text: str) -> int:
    """Les marches d'un déroulé, comptées sur son rail de navigation.

    Le rail est la seule liste exhaustive des sections. Une marche s'y annonce
    soit « Marche 3 », soit par son seul numéro ; tout ce qui porte un nom
    (« Rappel », « La course », « Au tableau », « Synthèse ») est une étape
    hors-marche et n'est pas compté.
    """
    nav = re.search(r'<nav[^>]*class="echelle".*?</nav>', text, re.S | re.I)
    if not nav:
        return 0
    steps = 0
    for link in re.findall(r"<a\b[^>]*>(.*?)</a>", nav.group(0), re.S | re.I):
        label = re.sub(r"<small\b.*?</small>", "", link, flags=re.S | re.I)
        label = re.sub(r"<[^>]+>", "", label).strip()
        if re.fullmatch(r"(?:Marche\s+)?\d+", label):
            steps += 1
    return steps


def read_sheet(path: pathlib.Path, series_default: str, rank: int, archive: bool) -> dict:
    text = path.read_text(encoding="utf-8")
    head = head_of(text)

    m = re.search(r"<title>(.*?)</title>", head, re.S | re.I)
    if not m:
        raise SystemExit(f"{path}: pas de <title>")
    title = html.unescape(m.group(1)).strip()

    fields = dict(
        p.split("=", 1)
        for p in (meta(head, "sheet") or "").split(";")
        if "=" in p
    )
    series = fields.get("series", series_default)
    number = fields.get("number", "")
    if not number:
        m = re.match(r"(?:sheet|walkthrough)-[a-z](\d+)", path.name)
        number = m.group(1) if m else "00"

    prefix = BADGES.get(series, "W")

    deck = meta(head, "deck")
    if deck is None and not archive:
        print(f"  ! {path}: <meta name=\"deck\"> manquant", file=sys.stderr)

    return {
        "href": path.relative_to(ROOT).as_posix(),
        "title": short_title(title),
        "subtitle": meta(head, "subtitle"),
        "series": series,
        "number": number,
        "deck": deck,
        "questions": text.count("<details"),
        "figures": len(re.findall(r"<figure\b", text)),
        "steps": count_steps(text),
        "rank": rank,
        "archive": archive,
        "badge": prefix + number.lstrip("0") if prefix else number,
    }


def collect() -> list[dict]:
    sheets = []
    for rel, pattern, series, rank, archive in SOURCES:
        d = ROOT / rel
        if not d.is_dir():
            continue
        for p in sorted(d.glob(pattern)):
            sheets.append(read_sheet(p, series, rank, archive))
    return sheets


def sheet_files() -> list[pathlib.Path]:
    """Tous les fichiers scannés, quel que soit leur motif de nom."""
    out: list[pathlib.Path] = []
    for rel, pattern, *_ in SOURCES:
        out += (ROOT / rel).glob(pattern)
    return sorted(out)


# --------------------------------------------------------------------------
# rendu
# --------------------------------------------------------------------------

def esc(s: str) -> str:
    return html.escape(s, quote=False)


def note(f: dict) -> str:
    """Le libellé de droite. Un déroulé ne pose aucune question : on annonce la
    longueur de la montée et le nombre de figures à manipuler."""
    if f["series"] == "walkthrough":
        return "%d marches · %d fig." % (f["steps"], f["figures"])
    return "%d q." % f["questions"]


def item(f: dict, label: str) -> str:
    small = "<small>%s</small>" % esc(f["subtitle"]) if f["subtitle"] else ""
    return (
        '<a class="it" href="{href}"><span class="k">{k}</span>'
        '<span class="t">{t}{small}</span>'
        '<span class="n">{n}</span></a>'
    ).format(href=f["href"], k=esc(f["badge"]), t=esc(f["title"]), small=small, n=label)


def render_decks(sheets: list[dict]) -> str:
    live = [f for f in sheets if not f["archive"]]
    out = []
    for deck, color, label in DECKS:
        group = sorted(
            (f for f in live if f["deck"] == deck),
            key=lambda f: (f["rank"], f["number"], f["href"]),
        )
        if not group:
            continue
        out.append(
            '<div style="--ac:var(--%s)"><h2>%s</h2>%s</div>'
            % (color, label, "".join(item(f, note(f)) for f in group))
        )

    orphans = sorted(
        (f for f in live if f["deck"] not in DECK_ORDER),
        key=lambda f: (f["rank"], f["number"], f["href"]),
    )
    if orphans:
        out.append(
            '<div style="--ac:var(--faint)"><h2>❓ à classer</h2>%s</div>'
            % "".join(item(f, note(f)) for f in orphans)
        )
    return "".join(out)


def render_archive(sheets: list[dict]) -> str:
    archived = sorted(
        (f for f in sheets if f["archive"]),
        key=lambda f: (f["number"], f["href"]),
    )
    if not archived:
        return ""
    return (
        '\n<h3>Archives</h3><div style="--ac:var(--faint)">%s</div>'
        % "".join(item(f, "ancien format") for f in archived)
    )


def render_timeline() -> str:
    p = ROOT / "timeline.html"
    if not p.exists():
        return ""
    head = head_of(p.read_text(encoding="utf-8"))
    m = re.search(r"<title>(.*?)</title>", head, re.S | re.I)
    title = html.unescape(m.group(1)).strip() if m else "Timeline"
    version = re.search(r"\bv\d+\b", title)
    date = re.search(r"\b(\d{2}/\d{2})\b", title)
    label = " ".join(
        x for x in (version.group(0) if version else None,
                    "du " + date.group(1) if date else None) if x
    ) or "—"
    weeks = re.search(r"(\d+)\s+semaines", title)
    name = "Timeline de la formation"
    if weeks:
        name += " — %s semaines" % weeks.group(1)
    return (
        '\n<h3>Pilotage</h3><div style="--ac:var(--sky)">'
        '<a class="it" href="timeline.html"><span class="k">⏱</span>'
        '<span class="t">%s</span><span class="n">%s</span></a></div>' % (name, label)
    )



# --------------------------------------------------------------------------
# PWA : manifeste, service worker, icône — injectés dans chaque page
# --------------------------------------------------------------------------

PWA_START = "<!--pwa-->"
PWA_END = "<!--/pwa-->"


def pwa_block(prefix: str) -> str:
    """Le bloc <head> commun. `prefix` remonte jusqu'à la racine du site.

    Tout est en chemin relatif pour que les fiches restent ouvrables en file://.
    Le service worker n'est enregistré que sur http(s) : en file:// l'API
    n'existe pas, on ne tente rien et rien n'échoue.
    """
    p = prefix
    return (
        PWA_START
        + '<link rel="manifest" href="%smanifest.webmanifest">' % p
        + '<link rel="icon" type="image/svg+xml" href="%sicon.svg">' % p
        + '<link rel="apple-touch-icon" href="%sapple-touch-icon.png">' % p
        + '<meta name="theme-color" content="#20312C">'
        + '<meta name="mobile-web-app-capable" content="yes">'
        + '<meta name="apple-mobile-web-app-capable" content="yes">'
        + '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">'
        + '<meta name="apple-mobile-web-app-title" content="Fiches">'
        + "<script>if('serviceWorker' in navigator&&location.protocol.startsWith('http')){"
        + "window.addEventListener('load',function(){"
        + "navigator.serviceWorker.register('%ssw.js',{scope:'%s'}).catch(function(){});});}</script>" % (p, p or "./")
        + PWA_END
    )


def inject_pwa(path: pathlib.Path) -> bool:
    """Pose (ou remet à jour) le bloc PWA dans le <head>. Idempotent."""
    prefix = "../" * len(path.relative_to(ROOT).parent.parts)
    text = path.read_text(encoding="utf-8")
    block = pwa_block(prefix)

    if PWA_START in text:
        before, rest = text.split(PWA_START, 1)
        _, after = rest.split(PWA_END, 1)
        updated = before + block + after
    else:
        m = re.search(r"</head>", text, re.I)
        if not m:
            print(f"  ! {path}: pas de </head>, bloc PWA non injecté", file=sys.stderr)
            return False
        updated = text[: m.start()] + "\n" + block + "\n" + text[m.start():]

    if updated != text:
        path.write_text(updated, encoding="utf-8")
        return True
    return False


def site_files() -> list[pathlib.Path]:
    """Tout ce qui est servi, sw.js excepté (c'est lui qui porte la version)."""
    names = ["index.html", "timeline.html", "manifest.webmanifest",
             "icon.svg", "apple-touch-icon.png"]
    files = [ROOT / n for n in names if (ROOT / n).exists()]
    files += sheet_files()
    return files


def update_service_worker() -> None:
    """Réécrit la version du cache : 'sheets-v<n>-<empreinte>'.

    L'empreinte est celle du contenu servi ; le compteur <n> n'avance que
    lorsqu'elle change. Rejouer le script sans rien modifier ne touche donc
    pas à sw.js — le script reste idempotent.
    """
    sw = ROOT / "sw.js"
    if not sw.exists():
        return
    h = hashlib.sha256()
    for f in site_files():
        h.update(f.relative_to(ROOT).as_posix().encode())
        h.update(f.read_bytes())
    fingerprint = h.hexdigest()[:16]

    text = sw.read_text(encoding="utf-8")
    m = re.search(r"const CACHE = 'sheets-v(\d+)-([0-9a-f]+)';", text)
    if not m:
        print("  ! sw.js: ligne 'const CACHE' introuvable", file=sys.stderr)
        return
    if m.group(2) == fingerprint:
        return
    version = int(m.group(1)) + 1
    updated = text[: m.start()] + "const CACHE = 'sheets-v%d-%s';" % (version, fingerprint) + text[m.end():]
    sw.write_text(updated, encoding="utf-8")
    print("sw.js : cache sheets-v%d-%s" % (version, fingerprint))


# --------------------------------------------------------------------------
# gabarit : HTML/CSS repris tel quel de l'index d'origine
# --------------------------------------------------------------------------

TEMPLATE = """<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Fiches — formation ML/LLM</title>
<style>:root{--board:#20312C;--chalk:#EDE8DA;--muted:#C9C4B6;--faint:#8F9A93;--yellow:#F0D178;--mint:#B9E2C4;--sky:#A7CCEB;--teal:#9FE0D2;--violet:#C8B6F5;--coral:#F3A28F;--amber:#F0D178;--line:rgba(237,232,218,.18);--card:#F5F1E6;--cardink:#22302B}
*{box-sizing:border-box;margin:0;padding:0}body{background:var(--board);color:var(--chalk);font-family:"Avenir Next",Avenir,"Segoe UI",Roboto,sans-serif;padding:32px clamp(14px,4vw,48px) 60px;max-width:820px;margin:0 auto}
h1{font-family:Georgia,serif;font-weight:400;font-size:clamp(30px,5vw,44px);text-shadow:0 0 1px rgba(237,232,218,.55);line-height:1.1}h1 span{text-decoration:underline;text-decoration-color:var(--yellow);text-decoration-thickness:3px;text-underline-offset:7px}
p.sub{color:var(--muted);margin:16px 0 26px;max-width:60ch;line-height:1.55}
h2{font-family:Georgia,serif;font-weight:400;font-size:19px;margin:30px 0 10px;color:var(--chalk)}h2::before{content:"";display:inline-block;width:22px;height:2px;background:var(--ac,var(--yellow));vertical-align:middle;margin-right:10px}
h3{font:600 11.5px "Avenir Next",Avenir,"Segoe UI",sans-serif;letter-spacing:.08em;text-transform:uppercase;color:var(--faint);margin:36px 0 4px}
.it{display:grid;grid-template-columns:44px 1fr auto;gap:12px;align-items:center;background:var(--card);color:var(--cardink);text-decoration:none;padding:12px 16px;border-radius:3px;margin-bottom:8px;box-shadow:0 10px 20px -14px rgba(0,0,0,.6);border-left:4px solid var(--ac,var(--yellow))}
.it:hover{transform:translateY(-1px)}.it .k{font-family:Georgia,serif;font-size:20px;color:#4E5A55}.it .t{font-size:15.5px;font-weight:500}.it .t small{display:block;font-weight:400;font-size:12.5px;color:#4E5A55;margin-top:2px}.it .n{font-size:12.5px;color:#4E5A55;text-align:right}
footer{margin-top:36px;color:var(--faint);font-size:13px;border-top:1.5px solid var(--line);padding-top:12px;line-height:1.6}</style>
{pwa}</head>
<body><h1>Formation ML/LLM — <span>fiches</span></h1><p class="sub">La timeline pour savoir où tu es ; puis les fiches rangées comme les decks Anki « swe » : chaque bloc couvre les cartes du deck correspondant. Ouvre, réponds à voix haute, note-toi.</p>{timeline}
<h3>Par deck Anki</h3>{decks}{archives}
<footer>Un fichier HTML autonome par entrée, ouvrable hors ligne. Convention : <code>/timeline.html</code> · <code>/sheets/weekly/sheet-wNN-&lt;sujet&gt;.html</code> · <code>/sheets/topics/sheet-tNN-&lt;sujet&gt;.html</code> · <code>/sheets/walkthroughs/walkthrough-dNN-&lt;sujet&gt;.html</code> · <code>/sheets/archive/</code>. La version vit dans le titre, pas dans le nom. Index généré par <code>tools/build_index.py</code> — ne pas éditer à la main.</footer></body></html>
"""


def build() -> None:
    sheets = collect()

    # le bloc PWA est posé par le script, jamais à la main
    touched = [p for p in sheet_files() if inject_pwa(p)]
    for name in ("timeline.html",):
        if (ROOT / name).exists() and inject_pwa(ROOT / name):
            touched.append(ROOT / name)
    if touched:
        print("bloc PWA posé dans %d fichier(s)" % len(touched))

    # Le gabarit contient du CSS plein d'accolades : substitution littérale,
    # pas str.format().
    page = TEMPLATE
    for key, value in (
        ("{timeline}", render_timeline()),
        ("{decks}", render_decks(sheets)),
        ("{archives}", render_archive(sheets)),
        ("{pwa}", pwa_block("")),
    ):
        page = page.replace(key, value)
    target = ROOT / "index.html"
    previous = target.read_text(encoding="utf-8") if target.exists() else None
    if previous != page:
        target.write_text(page, encoding="utf-8")
        print("index.html régénéré (%d fiches)" % len(sheets))
    else:
        print("index.html déjà à jour (%d fiches)" % len(sheets))
    update_service_worker()


if __name__ == "__main__":
    build()
