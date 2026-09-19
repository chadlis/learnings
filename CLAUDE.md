# Consignes pour Claude

Dépôt de fiches de révision de la formation ML/LLM. Le `README.md` décrit le
projet côté humain ; ce fichier décrit **quoi faire**, et notamment quoi faire
d'un fichier déposé dans `inbox/`.

## Autonomie

**Commit et push directs sur `main`, sans demander.** Pas de branche, pas de PR :
un `push` sur `main` déclenche le déploiement Cloudflare Pages. Seules limites :
jamais de `push --force`, jamais de réécriture d'historique déjà poussé.

Messages de commit **en français, sujet à l'impératif**, un commit par étape
logique. Le corps dit *pourquoi*, pas *quoi* — le diff dit déjà quoi.

## Les trois invariants

À ne casser sous aucun prétexte, ce sont eux qui font la valeur du dépôt :

1. **Un fichier HTML autonome par entrée.** Zéro CDN, zéro dépendance, zéro
   build step. Pas d'extraction de CSS ou de JS partagé, même si trois fichiers
   dupliquent les mêmes règles — c'est voulu. Le seul `http://` toléré est le
   namespace SVG `http://www.w3.org/2000/svg`.
2. **Tout s'ouvre en `file://`** aussi bien que sur le site publié. Tous les
   chemins sont relatifs.
3. **`index.html` est généré.** Ne jamais l'éditer à la main : modifier
   `tools/build_index.py` ou les métadonnées de la fiche, puis `make index`.
   Même chose pour la ligne `const CACHE` de `sw.js`.

## Les deux genres

Ils partagent le dépôt mais rien d'autre. Identifier le genre est la première
chose à faire devant un fichier à intégrer.

| | **fiche** | **déroulé** |
| --- | --- | --- |
| but | s'auto-tester à voix haute | lire une fois, lentement |
| signes | `<details>`, `class="q"`, onglets Labo/Parcours/Carte | rail des marches + figures à boutons — **deux gabarits**, voir ci-dessous |
| chemin | `sheets/topics/sheet-tNN-<sujet>.html`<br>`sheets/weekly/sheet-wNN-<sujet>.html` | `sheets/walkthroughs/walkthrough-dNN-<sujet>.html` |
| `<title>` | `<sujet> — fiche thématique` | `<sujet> — déroulé` |
| `series=` | `topic` / `weekly` | `walkthrough` |
| badge | `02` (topic) · `W2` (weekly) | `D2` |
| libellé de droite | `28 q.` (nombre de `<details>`) | `6 marches · 8 fig.` (liens « Marche » du rail, balises `<figure>`) |

Tout est calculé par `tools/build_index.py` à partir du fichier : ne jamais
écrire un de ces libellés à la main.

**Les déroulés ont deux gabarits, et un seul est encore ouvert.** Les quatre
anciens (D1–D4) sont en `nav.echelle` : rail des marches en `<nav>`, figures en
`<figure>` à boutons. Tout **nouveau** déroulé suit le standard « tableau noir
v5 », celui des chaînes et des ponts — `aside.side`, `div.fig`, `assets/sheetlib.js`
— parce que c'est ce que `tools/validate_sheet.py` impose, et le validateur fait
foi. `tools/test_walkthroughs.mjs` accepte les deux rails, donc les anciens ne
sont pas à migrer : ne jamais renommer ni refondre un déroulé publié pour
uniformiser. Le premier déroulé v5 est D5 (`walkthrough-p01-05`).

## Intégrer un fichier de `inbox/`

1. **Lire le fichier avant de le déplacer.** Le nom déposé ment souvent : se
   fier au `<title>` et au `<h1>`, jamais au nom de fichier. (Déjà arrivé :
   `deroule-biais-du-max.html` était en réalité le cas 1, l'intervalle.)
2. **Choisir le genre, la série, le numéro** — le premier libre dans la série.
   `<sujet>` en minuscules, sans accents, mots séparés par des tirets.
3. **Déplacer et renommer** vers `sheets/topics/`, `sheets/weekly/` ou
   `sheets/walkthroughs/`.
4. **Poser les métadonnées** dans le `<head>`, juste après le `viewport` :

   ```html
   <meta name="sheet" content="series=topic;number=02;status=v1">
   <meta name="deck" content="01">
   <meta name="subtitle" content="ligne secondaire, optionnelle">
   ```

   `deck` détermine la section de l'index : `00` 3 fils · `01` maths-stats ·
   `02` ml classique · `03+07` deep learning + python · `04+05` llm engineering
   + system design · `06` coding patterns · `08` web. Un `deck` inconnu envoie
   la fiche dans une section « à classer » : jamais perdue, mais visible.
5. **Harmoniser le `<title>`** selon le tableau ci-dessus. La précision perdue
   (« cas 2 », « v1 du 11/09 ») va dans `subtitle`, que l'index affiche.
6. **Câbler les liens**, en relatif : retour vers `../../index.html`, et liens
   vers les fiches sœurs quand le texte les mentionne déjà. Transformer une
   mention textuelle en vrai lien vaut mieux qu'ajouter un encadré.
7. **`make index`**, puis les vérifications ci-dessous, puis commit et push.
8. **Vider `inbox/`** : le fichier d'origine a été déplacé, pas copié.

## Réviser une sheet publiée

Une sheet publiée ne se réécrit pas, elle reçoit un **delta**. La procédure
ci-dessous est celle qui a tourné le 18/09/2026 sur cinq sheets ; elle est ici
pour que le dépôt n'en dépende plus d'un prompt de chat.

1. **Le delta s'écrit dans le chat, jamais ici.** Il arrive rédigé et se colle
   **tel quel** en fin de `specs/<id>-*.md`, sous un titre
   `## Révision vN (JJ/MM/AAAA)`, après `## Questions pour la revue`. Claude Code
   ne rédige jamais ce contenu — même règle que pour le corps d'un spec
   (`specs/README.md`). Un chiffre du delta qui se révèle faux à la vérification
   se corrige dans le spec **et** se note sous `## Questions pour la revue`.
2. **Statut `reviewed` ou `built` → `ready`**, puis `/sheet <id>`.
3. **Mode mise à jour** = un fichier existe déjà au chemin déduit du spec. Le
   **lire d'abord**, puis n'écrire que le delta : aucun pas existant n'est
   reformulé ni réorganisé, le CSS et le JS commun restent ceux du gold standard,
   intacts.
4. **Un pas inséré est renuméroté dans la suite `s1`…`sN`**, jamais suffixé en
   `s4b` — le numéro affiché vient d'un compteur CSS, et le validateur refuse une
   suite non consécutive. Renuméroter impose de reprendre **tous** les liens
   entrants, ancre *et* libellé « pas N » :

   ```sh
   grep -rn 'chain-<id>[^"]*#s' sheets/ specs/ anki/ map.html
   ```

   Puis `make anki`, qui régénère les ancres de `anki/ancres.csv`.
5. **Bump de version, aux trois endroits** : `<title>` suffixé « · vN », meta
   `sheet` en `status=vN`, footer « vN du JJ/MM/AAAA ». Le **nom de fichier ne
   change jamais** — l'URL, les favoris et le cache hors ligne en dépendent.
   L'index lit la version dans la meta, il n'y a rien à y écrire.
6. **Vérifier** : `validate_sheet.py <chemin> --render` jusqu'à 0 FAIL, chaque
   WARN lu, et les captures `sheets/_render/<nom>-{dark,light}.png` **regardées**
   — chevauchement, débordement, figure vide, curseur sans effet. Puis
   `make index` et `make links`.
7. **Statut du spec → `built`**, un commit par sheet :
   `feat(sheet): <id> révision vN — <trois mots>`, le corps disant ce que la
   re-mesure a montré et ce que le delta adresse.

## Vérifier avant de commiter

```sh
make index     # régénère index.html, le bloc PWA, la version du cache
make check     # échoue si index.html ou sw.js sont en retard
make test      # playwright headless : notes, service worker, déroulés

# une sheet (chain, walkthrough, bridge, coding) : structure + rendu sombre/clair
.venv/bin/python tools/validate_sheet.py sheets/coding/coding-01-fenetre-glissante.html --render
```

`--render` passe par le **playwright Python de `.venv/`**, pas par celui de `make
test` (qui est en Node, sous `~/.npm/_npx/`). Ce sont deux installations
distinctes ; `.venv/bin/python` est obligatoire, `python3` seul n'a pas le
module et le validateur se contente alors d'un `WARN rendu impossible` — un
0 FAIL qui n'a rien rendu. Le venv est auto-ignoré (`.venv/.gitignore`) ; le
reconstruire :

```sh
python3 -m venv .venv && .venv/bin/pip install playwright && .venv/bin/playwright install chromium
```

Et à l'œil :

- `grep -nE '(src|href)="https?://|@import' sheets/**/*.html` doit être vide.
- `git diff index.html` doit être **purement additif** : aucune entrée
  existante ne disparaît ni ne change de libellé. Le vérifier en comparant les
  entrées parsées, pas en lisant le diff — l'index tient sur une seule ligne.
- Pour un déroulé : chaque `<figure>` doit produire du SVG au clic. Les boutons
  sont créés en JS, un `grep '<button'` en trouve **zéro** — seul
  `tools/test_walkthroughs.mjs` les voit.
- Responsive : le rail `nav.echelle` s'efface sous 1100 px, et rien ne doit
  déborder à l'horizontale à 390 px (`tools/test_walkthroughs.mjs` le mesure).

`make test` saute silencieusement si playwright est absent. Il est là :
`PLAYWRIGHT_PATH=$(echo ~/.npm/_npx/*/node_modules/playwright)`.

## Pièges connus

- Le hook `pre-commit` (`make hooks`) relance `make index` et ajoute
  `index.html` / `sw.js` au commit en cours. Pour garder des commits propres
  quand ces deux fichiers sont déjà modifiés, commiter les étapes
  intermédiaires avec `--no-verify` et finir par un commit `chore: régénère
  l'index`.
- **Ne jamais renommer une fiche déjà publiée** pour des raisons esthétiques :
  l'URL, les favoris et le cache hors ligne en dépendent. La version vit dans
  le `<title>`, jamais dans le nom. Renommer ne se justifie que si le nom est
  faux.
- `sw.js` est cache-first sauf pour l'index : il n'y a **pas** de liste de
  précache à tenir à jour. Il suffit qu'un fichier entre dans
  `sheet_files()` pour qu'il compte dans l'empreinte du cache.
- Ajouter une série au builder demande de toucher `SOURCES` (chemin + motif de
  glob), `BADGES` et `note()` — et rien d'autre : les globs sont centralisés
  dans `sheet_files()`.
