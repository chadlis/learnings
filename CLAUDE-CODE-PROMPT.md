# Prompt général — refonte du site des fiches (learnings) — mode autonome

Lancement : à la racine du dépôt, après avoir déposé le contenu du zip,
```
claude --dangerously-skip-permissions
```
(sans ce flag Claude Code demande confirmation à chaque écriture ; le flag est acceptable ici : dépôt de fiches, sur une branche, rien de destructif).
Puis coller tout ce qui suit la ligne `---`. Aucune question ne sera posée ; le résultat arrive sur la branche `refonte-sheets`, poussée.

---

Tu travailles en **autonomie complète** dans le dépôt des fiches de révision de Salah (formation ML/LLM). Tu ne poses aucune question : chaque décision est déjà prise ci-dessous, et ce qui n'est pas déterminé se note dans un spec sous `## Questions pour la revue`, jamais dans une question à l'utilisateur. Tu ne t'arrêtes qu'à la fin, avec un rapport.

Le site est refondu : les anciennes fiches Q/A (`sheets/topics/sheet-tNN-*.html`) sont archivées, remplacées par des **chaînes** (`sheets/chains/`), des **déroulés** (`sheets/walkthroughs/`), des **ponts** (`sheets/bridges/`) et des sheets **coding** (`sheets/coding/`), rangées par dépendance dans `index.html` et `map.html`, générés par `tools/build_index.py` depuis `specs/`.

Règles absolues :
- Tu ne rédiges **jamais** une sheet sans spec au statut `ready`. Un spec `stub` n'est pas une invitation à inventer : tu le sautes et tu le listes dans le rapport final.
- **Le statut d'un spec ne se change jamais de `stub` à `ready` par Claude Code ; seul Salah le fait en déposant un spec complet.**
- **Claude Code n'écrit jamais le corps d'un spec** (question, hypothèses, fil rouge, pas, figures). Il ne modifie un spec que pour : corriger un chiffre vérifié par script, ajouter « ## Questions pour la revue », changer le statut `ready` → `built` ou → `reviewed` sur instruction.
- Standard = skill `.claude/skills/sheet-chain/` + gold standard `sheets/chains/chain-p03-01-critere-escalier-vs-sensible.html`. Tu ne touches pas à `sheets/archive/`. Le gold standard, `template.html` et `assets/sheetlib.js` se modifient **uniquement pour un correctif de rendu** (bug d'affichage, débordement, cas dégénéré), jamais pour le contenu ni l'esthétique ; tout correctif est propagé aux sheets existantes et vérifié au rendu.
- Une sheet = un commit. `python3 tools/validate_sheet.py <chemin> --render` à 0 FAIL avant commit, captures regardées.
- Zéro CDN, zéro police externe, zéro MathJax, zéro localStorage.
- Si `playwright` manque : `pip install playwright && playwright install chromium`. Si ça échoue, valide sans `--render` et note-le dans le rapport.

## Phase 1 — installation (une fois)

1. `git checkout -b refonte-sheets` (si la branche existe, `git checkout refonte-sheets`).
2. Si `tools/build_index_legacy.py` n'existe pas et que git montre `tools/build_index.py` comme modifié : `git show HEAD:tools/build_index.py > tools/build_index_legacy.py`.
3. `git mv sheets/topics/*.html sheets/archive/` ; ne modifie pas ces fichiers.
4. Renomme les déroulés : `walkthrough-d01-*` → `walkthrough-p01-01-*`, `d02` → `p01-02`, `d03` → `p01-03`, `d04` → `walkthrough-p02-01-une-chaine-trois-exemples.html`. Dans chacun, ajoute les meta `sheet` (`series=walkthrough;part=PP;number=NN;status=v1`), `part`, `subtitle`, `prereq`, `anki` (valeurs : specs `w01-01`, `w01-02`, `w01-03` ; pour d04 : part 02, number 01, prereq `p02-01`, anki `stats::vraisemblance,stats::regularisation`), corrige les liens internes entre eux et vers `index.html`. Contenu inchangé. Dans `chain-p03-01-*.html`, remplace le lien vers `walkthrough-d04-…` par le nouveau nom.
5. `sw.js` : si une liste de fichiers y est en dur, ajoute `assets/sheetlib.js`, `map.html`, les nouveaux chemins, retire les anciens.
6. `python3 tools/build_index.py` ; commit `chore(site): squelette de la refonte — archive Q/A, déroulés renommés, index par dépendance` ; `git push -u origin refonte-sheets`.

## Phase 2 — production, en autonomie — **TERMINÉE pour la Phase 1 de la formation**

> **État au 18/09/2026.** Les onze parties de la Phase 1 sont produites : `01`,
> `02`, `03`, `08`, `06`, `05`, `07`, `04`, `00`, `09`, `B` — **56 sheets**, tous
> les specs `ready` consommés. Sur les 56 specs correspondants, **44 sont
> `reviewed`** et **12 encore `built`**, en attente d'une revue : les quatre de
> `00`, les quatre de `08`, et `w01-01`, `w01-02`, `w01-03`, `w02-01`. Un seul
> spec de Phase 1 n'a jamais été `ready` : `c10` (préfixes et deque monotone),
> toujours `stub`.
>
> **La suite ne passe plus par cette phase.** On ne relance pas une production en
> lot : les phases 2 à 4 se remplissent **une sheet par bloc, à la revue du
> vendredi, via `/sheet <id>`** — un spec écrit dans le chat, un `/sheet`, un
> commit. Ce qui suit reste la procédure de référence pour ce `/sheet`, et
> servirait telle quelle si une partie entière redevenait un jour à produire.

Ordre des parties : `01`, `02`, `03`, `08`, `06`, `05`, `07`, `04`, `00`, `09`, `B`. Pour chaque partie, dans l'ordre des numéros, pour chaque spec `ready` :
- lance un **sous-agent à contexte frais** avec l'instruction de `.claude/commands/sheet.md` pour cet id (il lit lui-même skill, gold standard, template, lib, spec) ;
- à son retour, exécute toi-même `python3 tools/validate_sheet.py <chemin>` ; si FAIL, relance le sous-agent une fois avec la sortie du validateur ; si second échec, note l'id et continue ;
- vérifie que le spec est passé `built` et que le commit existe.
Après chaque partie : `python3 tools/build_index.py`, commit `chore(index): partie NN`, `git push`.
Si un spec `ready` te paraît incomplet, produis ce qui est déterminé et note le reste sous `## Questions pour la revue` dans le spec. N'invente pas, ne fusionne pas deux specs, ne réécris pas le gold standard.

## Phase 3 — rapport (le seul moment où tu t'adresses à Salah)

Un tableau : id · statut (built / échec ×2 / stub sauté) · chemin · FAIL/WARN · questions pour la revue. Puis l'URL Pages de la branche (ou la commande pour créer la preview). Puis, en 5 lignes, ce qui manque pour que le site soit complet : la liste des stubs, par partie.

## Après la Phase 2 — le régime courant

Un bloc de formation se termine le vendredi ; sa revue produit un spec, et ce
spec produit une sheet. Rien n'est lancé en lot.

1. Salah écrit le spec dans le chat et le dépose en `ready` dans `specs/`.
2. `/sheet <id>` dans Claude Code : la sheet, la validation au rendu, l'index,
   le commit. Le spec passe `built`.
3. La revue suivante tranche les questions ouvertes et passe le spec `reviewed`.

Les stubs restants, dans l'ordre où ils viendront : `c10` (Phase 1), puis
`p10` micrograd, `p11` makemore, `p12` transformer, `p13` tokenizer, `p14` mech
interp (Phase 2), `p20` evals, `p21` fine-tuning, `p22` inference (Phase 3),
`p30` system design (Phase 4).
