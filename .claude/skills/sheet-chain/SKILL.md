---
name: sheet-chain
description: Produit une sheet de révision du site learnings (chain, walkthrough, bridge ou coding) à partir d'un spec `specs/<id>-*.md` au statut `ready`, dans le standard « tableau noir » — un HTML par sheet, zéro CDN, animations via assets/sheetlib.js, chaîne numérotée règle → application, figures interactives, « où ça casse », résumé, phrase d'entretien, chaîne verbalisée, tags Anki. À utiliser pour toute création ou mise à jour de sheet dans ce dépôt ; jamais sans spec.
---

# sheet-chain

Une sheet est une **chaîne d'enchaînements** que Salah relit de temps en temps, pas un cours et pas un jeu de questions (Anki fait ça). Elle doit être autoporteuse : ce qu'elle suppose est nommé en tête avec un lien, ce qu'elle pose comme hypothèse est marqué, ce qui casse est dit.

## Étape 0 — lire, toujours, dans cet ordre

1. `specs/<id>-<slug>.md` — le spec. **Statut `ready` obligatoire.** `stub` ⇒ s'arrêter et le dire ; **la sheet existe déjà** au chemin déduit ⇒ c'est une mise à jour, lire la sheet existante d'abord et suivre « Réviser une sheet publiée » dans `CLAUDE.md`.
2. `sheets/chains/chain-p03-01-critere-escalier-vs-sensible.html` — le **gold standard**. Repartir de son CSS et de son JS commun tels quels.
3. `.claude/skills/sheet-chain/template.html` — le squelette avec les placeholders `{{…}}`.
4. `assets/sheetlib.js` — les primitives (`SL.plot`, `SL.slider`, `SL.repeat`, `SL.descent`, `SL.trace`, `SL.plane`, `SL.stepper`). Composer avec elles ; n'écrire du SVG custom que si aucune primitive ne convient, et alors à l'intérieur d'un `SL.plot` (`P.dyn`, `P.sx/sy`).

## Ce que la sheet contient, dans cet ordre

| bloc | règle |
|---|---|
| `header.top` | fil d'Ariane `Fiches › Carte › Partie NN › chaîne MM`, `h1` avec un ou deux mots soulignés, bouton thème |
| `p.sub` | 2–4 lignes : la question, l'idée en gras, l'exemple fil rouge |
| `aside.side` | toc (généré), prérequis (liens vers l'ancre exacte), tags Anki, ponts |
| `#prereq` | 3–5 puces : objet, rappel d'une phrase, lien |
| `#hyp` | H1… numérotées, mot-clé en gras, marquées « supposé » implicitement par la couleur |
| `.chain` | pas numérotés `div.step` : `.rule` (titre, 2–5 lignes, `div.eq`, `p.say`) + `.card.apply` (le calcul chiffré) ; `.fig` en pleine largeur quand une intuition se joue ; tags `tronc` / `casse` |
| dernier pas | « Où ça casse », `card.casse`, 2–4 limites avec le mécanisme |
| `#resume` | ≤ 8 lignes numérotées + `div.phrase` (la phrase d'entretien) |
| `#verbal` | 4–7 maillons question → réponse d'une ligne, réponses floutées (`.a.hid`) |
| `#links` | ponts (titre + en quoi c'est le même mécanisme) et tags Anki commentés |
| `footer` | id, version, date, prérequis, suite |

Les pas portent les ids `s1`…`sN`, consécutifs : le numéro affiché vient d'un compteur CSS, donc **un pas inséré après coup est renuméroté, jamais suffixé** (`s4b` décale les ancres par rapport à ce que le lecteur voit et fait mentir tout lien entrant). Renuméroter impose de reprendre les liens entrants : `grep -rn 'chain-<id>[^"]*#s' sheets/`. Le validateur refuse une suite non consécutive.

Séries : `chain` (ci-dessus) · `walkthrough` (une seule colonne de marches règle | calcul, onglets si plusieurs exemples, `SL.stepper`) · `bridge` (une figure du mécanisme, une ligne par domaine avec lien vers le pas exact) · `coding` (signal → pattern → invariant/variant → `SL.trace` → complexité → pièges ; jamais la solution complète).

### Série `coding`

**Taille de la trace** : **6 à 12 cases** par défaut. Le fil rouge du spec prime —
c'est lui qui traverse toute la sheet, et une trace sur d'autres chiffres que le
texte casse le fil. En dessous de 6 cases, seulement si l'exemple est canonique
(Two Sum sur `[2, 7, 11, 15]` : le raccourcir ou le rallonger le rendrait moins
reconnaissable qu'il n'est court).

**« Où ça casse » reste exigé**, en plus des pièges Python — le validateur le
refuse absent, pour `coding` comme pour les autres séries. Les deux blocs ne
disent pas la même chose : les pièges Python sont des erreurs qui *plantent* ou
qui changent la complexité, le « Où ça casse » est le **contre-signal**, le cas
qui rend la réponse fausse **sans erreur** — la fenêtre glissante sur des
négatifs renvoie un nombre, poliment, et il est faux. Court : deux ou trois
lignes de règle, le mécanisme, un contre-exemple minimal chiffré. c01 est le
format de référence (pas « Où ça casse » = les négatifs ; `card.casse` = les
pièges Python).

## Règles d'écriture

- **Pas de prose.** Une règle tient en 2–5 lignes ; si elle en demande plus, c'est deux pas. Le validateur avertit au-delà de ~120 mots par règle.
- **Chaque pas a son application chiffrée**, avec les chiffres du spec, vérifiés par un script Python avant écriture (matrices, probabilités, sommes). Ne jamais arrondir un résultat qu'on n'a pas calculé.
- **« Au tableau »** (`p.say`) : prémisse, `donc`, `donc`, résultat nommé. Jamais « parce que ». Le mot `donc` en clair, entouré d'espaces (la dictée découpe dessus). Conclure sur le résultat, pas sur le déroulement.
- **Figures** : une par intuition, pas une par pas. Chaque figure a un `.lbl`, un `.cap` qui dit quoi manipuler et quoi voir, des readouts. Tout ce qui est dessiné porte une classe (`sl-c1..5`, `hollow`, `chord`, `gain`, `slope`), jamais un `fill` inline. Nombres formatés en français (`SL.fmt`).
- **Convention de régularisation** : l'objectif s'écrit `L(θ) + λ·pen(θ)`, loss **sans** facteur ½.
  Un ½ devant la loss ou devant la pénalité déplace tous les seuils en λ d'un facteur 2 sans changer
  le mécanisme, mais rend les chiffres de deux sheets incomparables. Avec `L(θ) = (θ − 1)²` : L2 donne
  θ̂ = 1/(1 + λ), L1 donne θ̂ = max(0, 1 − λ/2), et le zéro exact arrive à λ = |L′(0)| = 2.
- **Hypothèses avant calcul ; scories interdites** : estimateur sans chapeau, `p(x|θ)` en fréquentiste (écrire `p(x ; θ)`), densité intégrée au lieu d'évaluée, chain rule élidée.
- **Ce qui a cassé pour Salah** (section du spec) : chaque item doit être adressé explicitement par un pas, une figure ou une limite. Ne pas l'écrire dans la sheet comme un journal (« le 15/09 tu as… ») : l'adresser, sans le raconter.
- **Scope** : ce que le spec exclut n'apparaît pas, même en note. Pas de contenu périssable, pas de tableaux de référence.
- Maths en HTML/CSS (`.m`, `.up`, `sup`, `sub`, `.hat`, `.eq`) et Unicode. Zéro MathJax, zéro CDN, zéro police externe, zéro `localStorage`.
- Liens : relatifs, vers des fichiers du dépôt. Un prérequis vers une sheet pas encore écrite pointe vers `map.html#<id>`.

## Chemin de sortie et méta

`sheets/<chains|walkthroughs|bridges|coding>/<series>-<id>-<slug>.html` (walkthrough : `walkthrough-pPP-NN-<slug>`). Méta obligatoires : `sheet` (`series=…;part=…;number=…;status=v1`), `part`, `subtitle`, `prereq` (ids), `anki` (tags). L'index et la carte les lisent.

## Vérification (obligatoire avant tout commit)

```
.venv/bin/python tools/validate_sheet.py sheets/…/fichier.html --render
```
`.venv/bin/python`, pas `python3` : le playwright de `--render` vit dans le venv,
et `python3` seul dégrade le rendu en `WARN rendu impossible` — un 0 FAIL qui n'a
rien regardé. 0 FAIL exigé ; lire chaque WARN. Puis ouvrir les captures `sheets/_render/<nom>-dark.png` et `-light.png` et **regarder** : labels qui se chevauchent, texte qui déborde d'un SVG, figure vide, slider sans effet. Corriger, revalider. Puis `python3 tools/build_index.py`.

Commit : `feat(sheet): <id> <titre>` ; mettre le spec au statut `built`. Un spec = une sheet = un commit.

## Ce que ce skill ne fait pas

Il n'invente pas de spec, il ne fusionne pas deux specs, il ne touche pas aux sheets de `archive/`.

Le gold standard, `template.html` et `assets/sheetlib.js` se modifient **uniquement pour un correctif de rendu** (bug d'affichage, débordement, cas dégénéré), jamais pour le contenu ni l'esthétique ; tout correctif est propagé aux sheets existantes et vérifié au rendu.

**Ne pas invoquer le skill `frontend-design` (ou tout skill de design) pour une sheet** : le CSS et la mise en page viennent du gold standard, sans variation. Une sheet qui « a son propre style » est une sheet cassée — c'est l'uniformité qui rend la relecture rapide.

Une question de contenu (chiffre douteux, pas manquant, contradiction avec une autre sheet) s'écrit dans le commit et dans `specs/<id>.md` sous `## Questions pour la revue`, elle ne se résout pas par une invention.
