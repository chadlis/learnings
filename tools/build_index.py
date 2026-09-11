#!/usr/bin/env python3
"""Régénère index.html à partir des fiches présentes dans fiches/.

Python 3, bibliothèque standard uniquement. Idempotent : deux exécutions de
suite produisent exactement le même fichier. Ajouter une fiche ne demande
aucune édition manuelle de l'index — il suffit de déposer le fichier dans
fiches/semaine/ ou fiches/theme/ avec ses métadonnées et de relancer le script.

Métadonnées lues dans le <head> de chaque fiche :
    <title>…</title>                              titre affiché (version incluse)
    <meta name="fiche" content="serie=…;numero=…"> série et numéro
    <meta name="deck" content="01">                deck Anki (obligatoire)
    <meta name="sous-titre" content="…">           ligne secondaire (optionnel)
Le nombre de questions est le nombre de balises <details> du fichier.
"""

from __future__ import annotations

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

# Dossiers scannés : (chemin relatif, série par défaut, rang de tri, archive ?)
SOURCES = [
    ("fiches/semaine", "semaine", 0, False),
    ("fiches/theme", "thematique", 1, False),
    ("fiches/archives", "archive", 2, True),
]


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

    La version vit dans le <title> ; on retire seulement le suffixe de série.
    """
    return re.sub(r"\s+—\s+fiche\b.*$", "", title).strip()


def read_fiche(path: pathlib.Path, serie_default: str, rank: int, archive: bool) -> dict:
    text = path.read_text(encoding="utf-8")
    head = head_of(text)

    m = re.search(r"<title>(.*?)</title>", head, re.S | re.I)
    if not m:
        raise SystemExit(f"{path}: pas de <title>")
    title = html.unescape(m.group(1)).strip()

    champs = dict(
        p.split("=", 1)
        for p in (meta(head, "fiche") or "").split(";")
        if "=" in p
    )
    serie = champs.get("serie", serie_default)
    numero = champs.get("numero", "")
    if not numero:
        m = re.match(r"fiche-[st](\d+)", path.name)
        numero = m.group(1) if m else "00"

    deck = meta(head, "deck")
    if deck is None and not archive:
        print(f"  ! {path}: <meta name=\"deck\"> manquant", file=sys.stderr)

    return {
        "href": path.relative_to(ROOT).as_posix(),
        "title": short_title(title),
        "sous_titre": meta(head, "sous-titre"),
        "serie": serie,
        "numero": numero,
        "deck": deck,
        "questions": text.count("<details"),
        "rank": rank,
        "archive": archive,
        "badge": ("S" + numero.lstrip("0") if serie != "thematique" else numero),
    }


def collect() -> list[dict]:
    fiches = []
    for rel, serie, rank, archive in SOURCES:
        d = ROOT / rel
        if not d.is_dir():
            continue
        for p in sorted(d.glob("fiche-*.html")):
            fiches.append(read_fiche(p, serie, rank, archive))
    return fiches


# --------------------------------------------------------------------------
# rendu
# --------------------------------------------------------------------------

def esc(s: str) -> str:
    return html.escape(s, quote=False)


def item(f: dict, note: str) -> str:
    small = (
        "<small>%s</small>" % esc(f["sous_titre"]) if f["sous_titre"] else ""
    )
    return (
        '<a class="it" href="{href}"><span class="k">{k}</span>'
        '<span class="t">{t}{small}</span>'
        '<span class="n">{n}</span></a>'
    ).format(href=f["href"], k=esc(f["badge"]), t=esc(f["title"]), small=small, n=note)


def render_decks(fiches: list[dict]) -> str:
    vivantes = [f for f in fiches if not f["archive"]]
    out = []
    for deck, couleur, libelle in DECKS:
        groupe = sorted(
            (f for f in vivantes if f["deck"] == deck),
            key=lambda f: (f["rank"], f["numero"], f["href"]),
        )
        if not groupe:
            continue
        out.append(
            '<div style="--ac:var(--%s)"><h2>%s</h2>%s</div>'
            % (couleur, libelle, "".join(item(f, "%d q." % f["questions"]) for f in groupe))
        )

    orphelines = sorted(
        (f for f in vivantes if f["deck"] not in DECK_ORDER),
        key=lambda f: (f["rank"], f["numero"], f["href"]),
    )
    if orphelines:
        out.append(
            '<div style="--ac:var(--faint)"><h2>❓ à classer</h2>%s</div>'
            % "".join(item(f, "%d q." % f["questions"]) for f in orphelines)
        )
    return "".join(out)


def render_archives(fiches: list[dict]) -> str:
    archives = sorted(
        (f for f in fiches if f["archive"]),
        key=lambda f: (f["numero"], f["href"]),
    )
    if not archives:
        return ""
    return (
        '\n<h3>Archives</h3><div style="--ac:var(--faint)">%s</div>'
        % "".join(item(f, "ancien format") for f in archives)
    )


def render_timeline() -> str:
    p = ROOT / "timeline-formation.html"
    if not p.exists():
        return ""
    head = head_of(p.read_text(encoding="utf-8"))
    m = re.search(r"<title>(.*?)</title>", head, re.S | re.I)
    title = html.unescape(m.group(1)).strip() if m else "Timeline"
    version = re.search(r"\bv\d+\b", title)
    date = re.search(r"\b(\d{2}/\d{2})\b", title)
    note = " ".join(
        x for x in (version.group(0) if version else None,
                    "du " + date.group(1) if date else None) if x
    ) or "—"
    semaines = re.search(r"(\d+)\s+semaines", title)
    libelle = "Timeline de la formation"
    if semaines:
        libelle += " — %s semaines" % semaines.group(1)
    return (
        '\n<h3>Pilotage</h3><div style="--ac:var(--sky)">'
        '<a class="it" href="timeline-formation.html"><span class="k">⏱</span>'
        '<span class="t">%s</span><span class="n">%s</span></a></div>' % (libelle, note)
    )


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
footer{margin-top:36px;color:var(--faint);font-size:13px;border-top:1.5px solid var(--line);padding-top:12px;line-height:1.6}</style></head>
<body><h1>Formation ML/LLM — <span>fiches</span></h1><p class="sub">La timeline pour savoir où tu es ; puis les fiches rangées comme les decks Anki « swe » : chaque bloc couvre les cartes du deck correspondant. Ouvre, réponds à voix haute, note-toi.</p>{timeline}
<h3>Par deck Anki</h3>{decks}{archives}
<footer>Un fichier HTML autonome par entrée, ouvrable hors ligne. Convention : <code>/timeline-formation.html</code> · <code>/fiches/semaine/fiche-sNN-&lt;sujet&gt;.html</code> · <code>/fiches/theme/fiche-tNN-&lt;sujet&gt;.html</code> · <code>/fiches/archives/</code>. La version vit dans le titre, pas dans le nom. Index généré par <code>tools/build_index.py</code> — ne pas éditer à la main.</footer></body></html>
"""


def build() -> None:
    fiches = collect()
    # Le gabarit contient du CSS plein d'accolades : substitution littérale,
    # pas str.format().
    page = TEMPLATE
    for cle, valeur in (
        ("{timeline}", render_timeline()),
        ("{decks}", render_decks(fiches)),
        ("{archives}", render_archives(fiches)),
    ):
        page = page.replace(cle, valeur)
    cible = ROOT / "index.html"
    ancien = cible.read_text(encoding="utf-8") if cible.exists() else None
    if ancien != page:
        cible.write_text(page, encoding="utf-8")
        print("index.html régénéré (%d fiches)" % len(fiches))
    else:
        print("index.html déjà à jour (%d fiches)" % len(fiches))


if __name__ == "__main__":
    build()
