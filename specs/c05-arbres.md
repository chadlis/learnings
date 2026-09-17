---
id: c05
series: coding
part: "09"
number: "05"
slug: arbres
title: Arbres — récursion, parcours, bornes
subtitle: coding — la récursion porte l'invariant ; l'ordre du parcours est le seul choix ; un BST se valide par des bornes, pas par les enfants
prereq: [c00]
anki: [coding::arbres, coding::dfs, coding::bfs, coding::bst]
bridges: []
next: c06
status: reviewed
---
## Signal
Une structure **hiérarchique** sans cycle : chaque nœud a des enfants, un seul parent. Questions : hauteur, diamètre, chemin, somme, validité BST, niveaux. Contre-signal : un graphe avec cycles (c06 : il faut un ensemble de vus).

## Pattern
- **DFS récursif** : f(nœud) = combiner(f(gauche), f(droit), valeur). L'invariant est **le contrat de f** : « f(n) renvoie X pour le sous-arbre de n ». Trois ordres selon quand on traite le nœud : pré (nœud, puis enfants : copier, sérialiser), in (gauche, nœud, droit : BST trié), post (enfants, puis nœud : hauteur, diamètre, libérer).
- **BFS par niveaux** : file, et **la taille de la file au début du niveau** dit combien de nœuds ce niveau contient.
- **BST par bornes** : valid(n, lo, hi) : lo < n.val < hi, et les enfants avec des bornes resserrées — jamais « gauche < nœud < droit » seulement.

## Squelette (hauteur, post-ordre)
```
def h(n) :
    si n est None : retour 0
    retour 1 + max(h(n.gauche), h(n.droit))
```

## TAP (hauteur)
- **Invariant (contrat)** : h(n) = nombre de nœuds sur le plus long chemin de n à une feuille de son sous-arbre ; vrai pour None (0), préservé par la combinaison (1 + max).
- **Variant** : la taille du sous-arbre, entier ≥ 0, strictement décroissante à chaque appel récursif.
- **Conclusion** : donc h(racine) est la hauteur de l'arbre.
- **Complexité** : chaque nœud visité une fois, O(1) par visite ⇒ O(n) ; espace = **profondeur de la pile** = O(h), O(log n) si équilibré, O(n) sinon.

## Trace (figure 1)
Arbre [4, 2, 6, 1, 3, 5, 7] (ordre par niveaux). In-ordre visite 1, 2, 3, 4, 5, 6, 7 (trié : c'est le test du BST). Post-ordre calcule h : feuilles 1, puis 2 et 6 à 2, racine à 3. `inv` = « pile = chemin racine → courant ; valeur renvoyée = contrat du sous-arbre ».

## Les variantes, une ligne chacune
- **Diamètre** : post-ordre qui renvoie la hauteur et met à jour un maximum global h_g + h_d — deux quantités, une seule remontée.
- **BST valide** : valid(n, −∞, +∞) ; gauche dans (lo, n.val), droit dans (n.val, hi). Le contre-exemple à connaître : [5, 1, 6, ∅, ∅, 4, 7] passe le test local et échoue aux bornes (4 < 5 sous le droit).
- **Niveaux (BFS)** : `for _ in range(len(q))` à chaque niveau ; profondeur minimale = premier niveau avec une feuille.
- **Chemin somme cible** : pré-ordre avec le reste ; feuille ⇔ les deux enfants None.

## Figures exigées
- **Figure 1 — SVG custom via `plot` (arbre à 7 nœuds)** : boutons pré / in / post qui numérotent les nœuds dans l'ordre de visite (animé), et « hauteur » qui remonte les valeurs feuille → racine ; `inv` affiché : « pile = [4, 2, 1] ». Légende : le seul choix est quand on traite le nœud.
- **Figure 2 — même SVG, BST [5, 1, 6, ∅, ∅, 4, 7]** : bouton « test local » (vert partout) puis « bornes » (le 4 devient rouge avec ses bornes (5, 6)). Légende : les enfants ne suffisent pas, les bornes se propagent.

## Où ça casse
Valider un BST en comparant seulement chaque nœud à ses enfants : accepte des arbres faux, sans erreur. Les bornes viennent de **tous** les ancêtres.

## Pièges Python
- RecursionError vers 1 000 niveaux : arbre dégénéré (liste) ⇒ itératif avec pile explicite, ou `sys.setrecursionlimit` en le disant.
- Feuille = « pas d'enfant » : un nœud à un seul enfant n'est pas une feuille.
- BFS par niveaux sans capturer `len(q)` avant la boucle du niveau.
- Variable globale pour le diamètre : `nonlocal` ou un objet, sinon le max ne remonte pas.

## Résumé
1. Récursion = contrat ; l'invariant est ce que f(n) promet sur le sous-arbre.
2. Pré / in / post : quand on traite le nœud ; in-ordre d'un BST est trié.
3. Variant = taille du sous-arbre ; O(n) temps, O(h) pile.
4. BFS par niveaux : taille de la file au début du niveau.
5. BST : bornes propagées, jamais les seuls enfants.

**Phrase d'entretien** : « Sur un arbre, la récursion porte l'invariant : je dis ce que la fonction promet sur un sous-arbre, je vérifie que c'est vrai pour l'arbre vide et préservé par la combinaison. Le seul choix est quand je traite le nœud — pré, in, post — et pour un BST je valide par des bornes venues de tous les ancêtres, jamais par les seuls enfants. Espace : la profondeur de la pile, O(n) si l'arbre dégénère. »

## Chaîne verbalisée
1. Quel est l'invariant d'une fonction récursive sur un arbre ? → Son contrat sur le sous-arbre ; vrai sur None, préservé par la combinaison.
2. Quel ordre pour la hauteur, pour un BST trié, pour sérialiser ? → Post, in, pré.
3. Pourquoi « gauche < nœud < droit » ne valide pas un BST ? → Bornes de tous les ancêtres ; contre-exemple avec 4 sous 6.
4. Complexité espace d'un DFS récursif ? → O(h) : O(log n) équilibré, O(n) dégénéré.
5. Comment BFS sait où finit un niveau ? → len(q) capturé au début du niveau.

## Ce qui a cassé pour Salah
- Famille t09 : « DFS récursif pré/in/post, BFS par niveaux, hauteur/diamètre, BST invariant de bornes » ; le contre-exemple du BST est celui qui doit sortir sans hésiter.

## Questions pour la revue

*Revue 7, 17/09 — **validé 17/09**, les cinq points. Arbitrage en fin de fiche.*
- **Aucun chiffre du spec n'était faux.** Tout a été revérifié par script avant écriture :
  pré `4, 2, 1, 3, 6, 5, 7` · in `1 … 7` · post `1, 3, 2, 5, 7, 6, 4` ; hauteurs remontées
  `1, 1, 2, 1, 1, 2, 3` ; `pile = [4, 2, 1]` au 3ᵉ pas du pré-ordre ; diamètre 4 arêtes
  (chemin 1 – 2 – 4 – 6 – 5) ; B passe le test local, échoue aux bornes, le 4 recevant
  bien **(5, 6)** ; in-ordre de B `1, 5, 4, 6, 7`, pas trié.
- **Trois figures au lieu de deux.** Les deux du spec y sont (fig. 1 = les trois ordres +
  la hauteur ; fig. 3 = test local contre bornes). Une **figure 2** s'est intercalée : un
  `SL.trace` de 7 cases sur le BFS par niveaux, parce que la série `coding` attend un
  ruban de trace et que « `k = len(q)` capturé » est un des cinq points du résumé sans
  quoi il restait sans image. La « figure 2 » du spec est donc la **figure 3** de la sheet.
- **Chiffres mesurés ajoutés** (pas dans le spec, à valider) : sur 200 000 arbres tirés au
  hasard (0 à 7 nœuds, valeurs dans 1…7), **67 015** passent le test local et **3 183**
  d'entre eux ne sont pas des BST, soit **4,75 %** — c'est ce qui justifie « le bug ne se
  révèle pas à l'essai ». Et le seuil de `RecursionError` : une chaîne de **998** nœuds
  avec `sys.getrecursionlimit() = 1000` (997 passe). Enfin le piège « feuille = un enfant
  `None` » sur un chemin de somme cible : **16,8 %** de désaccords sur 200 000 tirages.
- **Convention du diamètre**, posée en H4 : hauteur **en nœuds** (feuille = 1), diamètre
  **en arêtes** (4 sur A). Les deux conventions circulent ; si tu préfères l'autre, c'est
  H4 et le pas 3 à changer.
- **Liens sortants non repris.** `c03` et `c04` pointent encore vers `map.html#c04` /
  `map.html#c05` dans leur pied de page alors que les sheets existent. C'est la convention
  du dépôt (ne pas rouvrir une sheet publiée) — à confirmer, sinon c'est un `sed` de deux
  lignes par sheet.

**Arbitrage de revue 7, 17/09 — validé 17/09.** Les **chiffres mesurés sont gardés** :
4,75 % d'arbres acceptés à tort par le test local (3 183 / 67 015 sur 200 000 tirages)
et le seuil de `RecursionError` à **998** nœuds — ce sont eux qui justifient « le bug ne
se révèle pas à l'essai ». La **convention H4 est validée** : hauteur **en nœuds**,
diamètre **en arêtes**. Les trois figures sont **maintenues** dans l'ordre de la sheet.
Les liens `map.html#…` de c03 et c04 sont recâblés vers les sheets réelles (revue 7,
point 5) : la règle « ne pas rouvrir une sheet publiée » vise le renommage et la refonte,
pas la réparation d'un lien dont la cible vient d'exister.
