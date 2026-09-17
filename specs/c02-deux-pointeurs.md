---
id: c02
series: coding
part: "09"
number: "02"
slug: deux-pointeurs
title: Deux pointeurs — éliminer une classe à chaque pas
subtitle: coding — sur un tableau trié, chaque comparaison écarte tout un bloc de paires ; sans tri, on majore les deux facteurs
prereq: [c00]
anki: [coding::deux-pointeurs, coding::3sum, coding::elimination]
bridges: []
next: c03
status: built
---
## Signal
Tableau **trié** (ou triable sans perte) et une question sur des **paires** (somme cible, écart, produit) ; ou une quantité min(a[l], a[r]) × (r − l) où bouger le plus petit bord ne peut qu'aider (LC 11). Contre-signal : indices à renvoyer sur un tableau non trié (trier perd les indices : dict, c00) ; paires non monotones.

## Pattern
l = 0, r = n − 1, ils se **rapprochent**. À chaque pas, la comparaison en (l, r) décide lequel avance, et ce choix **élimine une classe entière** : si a[l] + a[r] > t, aucune paire (l', r) avec l' ≥ l ne convient (toutes ≥ a[l] + a[r]), donc r est fini. Le tri est ce qui rend l'élimination valide.

## Squelette (LC 167, somme cible sur trié)
```
l, r = 0, n − 1
tant que l < r :
    s = a[l] + a[r]
    si s == t : retour (l, r)
    si s > t : r −= 1          # r ne peut plus servir avec aucun l' ≥ l
    sinon : l += 1             # l ne peut plus servir avec aucun r' ≤ r
retour aucune
```

## TAP
- **Invariant** : si une paire de somme t existe, ses deux indices sont dans [l, r] ; les indices < l et > r ont été **éliminés** avec preuve (chaque pas retire un bord dont on a montré qu'aucun partenaire restant ne convient).
- **Variant** : r − l, entier ≥ 0, strictement décroissant.
- **Conclusion** : donc à l = r il ne reste aucune paire possible dans [l, r], donc l'invariant dit qu'aucune n'existe ; et un retour anticipé renvoie une paire vraie.
- **Complexité** : au plus n − 1 pas de O(1) ⇒ O(n) après tri (O(n log n) si le tri est à faire). Espace O(1).

## Trace (figure 1)
a = [1, 3, 4, 6, 8, 11], t = 10 : (l, r, s) = (0, 5, 12) · (0, 4, 9) · (1, 4, 11) · (1, 3, 9) · (2, 3, 10) ✓. `inv` à chaque image : « paire ⊂ [l, r] ; éliminés : … ».

## Extensions, une ligne chacune
- **3Sum** (LC 15) : trier, fixer i, deux pointeurs sur [i+1, n−1] pour −a[i] ; **doublons** par `while` (sauter les valeurs égales à la précédente pour i, l et r) — pas par set ; O(n²).
- **Container With Most Water** (LC 11), non trié : aire = min(h[l], h[r]) × (r − l) ; bouger le côté **le plus bas** : garder le plus bas ne peut qu'empirer (la largeur baisse, la hauteur est bornée par lui) — l'élimination sans tri se justifie en majorant les deux facteurs.
- **Trié + dédoublonner en place**, **fusion de deux triés** : mêmes deux pointeurs, autre invariant (« a[0:w) est le préfixe dédoublonné exact »).

## Figures exigées
- **Figure 1 — `SL.trace`** : arr = [1, 3, 4, 6, 8, 11], 5 images, `ptr` = {l, r}, `mark` = les indices éliminés (grisés), `note` = « s = 12 > 10 ⇒ r sort », `inv`. Légende : chaque pas grise un bloc entier de paires.
- **Figure 2 — `SL.trace`** : LC 11 sur h = [1, 8, 6, 2, 5, 4, 8, 3, 7], 8 images, `note` = aire courante et « bouge le plus bas » ; réponse 49. Légende : le plus bas est le seul qui peut faire mieux en bougeant.

## Où ça casse
Non trié avec somme cible : l'élimination est fausse (a[l'] peut être plus petit que a[l] pour l' > l). Le pattern rend une réponse, elle est fausse. Remède : dict (c00) ou trier en gardant les indices.

## Pièges Python
- Boucle `l <= r` sur une paire : l'élément apparié à lui-même.
- 3Sum : dédoublonner avec un set de triplets (O(n²) mémoire) au lieu de sauter les égaux.
- Oublier que trier détruit les indices d'origine (LC 1 demande les indices : dict).
- LC 11 : bouger le plus haut « pour voir » — c'est prouvable inutile, et ça coûte la correction.

## Résumé
1. Signal : trié + question sur des paires ; ou deux facteurs bornables (LC 11).
2. l et r se rapprochent ; chaque comparaison élimine une classe entière, avec preuve.
3. Invariant : la paire est dans [l, r] ; variant r − l ; O(n).
4. 3Sum = tri + i fixe + deux pointeurs, doublons par `while` ; LC 11 = bouger le plus bas.

**Phrase d'entretien** : « Trié et une question sur des paires, donc deux pointeurs qui se rapprochent : chaque comparaison élimine un bord et tout un bloc de paires avec lui, c'est le tri qui rend l'élimination valide. Le variant est r moins l, donc linéaire ; sans tri, il faut pouvoir majorer les deux facteurs, comme dans le container. »

## Chaîne verbalisée
1. Pourquoi peut-on abandonner r quand a[l] + a[r] > t ? → Toutes les paires (l', r), l' ≥ l, ont une somme ≥ ; trié.
2. Invariant et variant ? → Paire ⊂ [l, r] ; r − l.
3. 3Sum : comment gérer les doublons ? → `while` sur les valeurs égales, pour i, l et r.
4. LC 11 : lequel bouger et pourquoi ? → Le plus bas ; garder le plus bas majore l'aire future.

## Ce qui a cassé pour Salah
- Famille du fil rouge (LC 167 → 3Sum → LC 11) ; « élimination d'une classe » et « majorer les deux facteurs » sont les deux justifications qui doivent sortir à l'oral (learnings : coding patterns t09).

## Questions pour la revue
- **Tous les chiffres du spec ont été revérifiés par script, aucun n'était faux** :
  figure 1 (5 images, `(0,5,12) · (0,4,9) · (1,4,11) · (1,3,9) · (2,3,10)` ✓, paire
  unique (2, 3)), figure 2 (8 images, réponse 49 en (1, 8)), 3Sum sur
  `[-1,0,1,2,-1,-4]` → 2 triplets. Fuzz contre force brute : 0 désaccord sur
  20 000 (LC 167), 5 000 (3Sum), 20 000 (LC 11).
- **« Grisés » n'existe pas dans `SL.trace`.** Le spec demande `mark` = indices
  éliminés *grisés* ; la seule classe disponible est `.sl-cell.on`, au fond
  **ambré** (c01 s'en sert pour la fenêtre témoin). La sheet garde l'ambré et le
  nomme dans la légende (« le fond ambré marque les cases éliminées »). À
  trancher : ajouter une classe `.sl-cell.out` grisée à `sheetlib.js` — ce serait
  un correctif de rendu à propager, donc hors du périmètre d'une sheet.
- **Ajout non demandé par le spec** : le comptage 5 + 4 + 3 + 2 + 1 = 15 = C(6, 2)
  au pas 3, qui rend l'« élimination d'une classe » vérifiable à la main. À garder
  ou à couper si le tableau alourdit le pas.

**Arbitrage de revue 7, 17/09 — validé 17/09.** Le **tableau de comptage des classes**
du pas 3 (5 + 4 + 3 + 2 + 1 = 15 = C(6, 2)) est **gardé** : c'est lui qui rend
l'« élimination d'une classe » vérifiable à la main, donc il porte le tronc et
n'alourdit pas le pas. Le canal « grisé » manquant n'est plus un arbitrage de sheet :
`SL.trace` reçoit un troisième canal `dim` (revue 7, point 3) et la figure 1 s'en sert
pour les cases éliminées — l'ambré redevient ce qu'il est ailleurs dans la série.
