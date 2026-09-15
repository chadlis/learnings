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
| signes | `<details>`, `class="q"`, onglets Labo/Parcours/Carte | `nav.echelle` (rail des marches), `<figure>` à boutons |
| chemin | `sheets/topics/sheet-tNN-<sujet>.html`<br>`sheets/weekly/sheet-wNN-<sujet>.html` | `sheets/walkthroughs/walkthrough-dNN-<sujet>.html` |
| `<title>` | `<sujet> — fiche thématique` | `<sujet> — déroulé` |
| `series=` | `topic` / `weekly` | `walkthrough` |
| badge | `02` (topic) · `W2` (weekly) | `D2` |
| libellé de droite | `28 q.` (nombre de `<details>`) | `6 marches · 8 fig.` (liens « Marche » du rail, balises `<figure>`) |

Tout est calculé par `tools/build_index.py` à partir du fichier : ne jamais
écrire un de ces libellés à la main.

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

## Vérifier avant de commiter

```sh
make index     # régénère index.html, le bloc PWA, la version du cache
make check     # échoue si index.html ou sw.js sont en retard
make test      # playwright headless : notes, service worker, déroulés
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
