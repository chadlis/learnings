---
id: c03
series: coding
part: "09"
number: "03"
slug: binary-search
title: Binary search — le premier vrai
subtitle: coding — un espace monotone, un prédicat, deux bornes qui se referment ; chercher sur la réponse quand elle est monotone
prereq: [c00]
anki: [coding::binary-search, coding::monotone, coding::recherche-sur-reponse]
bridges: []
next: c04
status: built
---
## Signal
Un espace **ordonné** (tableau trié, entiers de 1 à n, un temps, une capacité) et un prédicat **monotone** dessus : faux…faux vrai…vrai. Y compris quand l'espace est **la réponse elle-même** : « la plus petite vitesse telle que Koko finisse en h heures » (LC 875), « la plus petite capacité qui expédie en d jours ». Contre-signal : prédicat non monotone (un seul minimum local n'est pas un premier vrai).

## Pattern
Chercher le **premier indice où le prédicat est vrai**. Deux bornes lo ≤ hi ; mid ; si P(mid) est vrai, la réponse est ≤ mid (hi = mid) ; sinon elle est > mid (lo = mid + 1). Toute la famille (élément exact, borne inférieure, borne supérieure, rotation, réponse) se ramène à « premier vrai » en choisissant P.

## Squelette
```
lo, hi = 0, n − 1                # la réponse est dans [lo, hi] (si elle existe)
tant que lo < hi :
    mid = lo + (hi − lo) // 2
    si P(mid) : hi = mid         # premier vrai ≤ mid
    sinon : lo = mid + 1         # premier vrai > mid
retour lo                        # vérifier P(lo) si l'existence n'est pas garantie
```

## TAP
- **Invariant** : P est faux sur [0, lo) et vrai sur (hi, n) ; le premier vrai, s'il existe, est dans [lo, hi]. Bornes **inclusives** des deux côtés — le choix est arbitraire mais il doit être tenu jusqu'au bout.
- **Variant** : hi − lo, entier ≥ 0, strictement décroissant : mid < hi donc hi = mid décroît ; mid ≥ lo donc lo = mid + 1 croît.
- **Conclusion** : donc à lo = hi, l'invariant dit que le premier vrai est lo, s'il existe ; P(lo) le confirme.
- **Complexité** : hi − lo divisé par 2 à chaque tour ⇒ ⌈log₂ n⌉ tours × coût de P. Sur la réponse : log₂(plage) × O(n) pour un P qui balaie les données.

## Trace (figure 1)
a = [1, 3, 5, 7, 9, 11], P(i) = a[i] ≥ 7 : (lo, hi, mid, P) = (0, 5, 2, faux) → lo = 3 · (3, 5, 4, vrai) → hi = 4 · (3, 4, 3, vrai) → hi = 3 · lo = hi = 3 ✓. `inv` : « faux sur [0, lo), vrai sur (hi, n) ».

## Les variantes, une ligne chacune
- **Élément exact** : premier vrai de a[i] ≥ t, puis a[lo] == t ?
- **Dernier faux** = premier vrai − 1 (borne supérieure).
- **Tableau tourné** : P(i) = a[i] ≤ a[n−1] ; premier vrai = le minimum.
- **Recherche sur la réponse** : espace [1, max], P(v) = « avec vitesse v, temps ≤ h » ; monotone parce qu'une vitesse plus grande ne peut pas prendre plus de temps.
- **Flottants** : boucle sur un nombre d'itérations (50) plutôt que sur lo < hi.

## Figures exigées
- **Figure 1 — `SL.trace`** : arr = [1, 3, 5, 7, 9, 11], 4 images, `ptr` = {lo, mid, hi}, `mark` = zone faux (grisée) et zone vrai (colorée), `inv`. Légende : les deux bornes sont inclusives et le restent.
- **Figure 2 — `SL.plot`** : LC 875, piles [3, 6, 7, 11], h = 8 : heures(v) en marches décroissantes pour v ∈ [1, 11], ligne h = 8, premier v vrai = 4 marqué ; `slider` h. Légende : la réponse est un premier vrai sur un axe qui n'est pas le tableau.

## Où ça casse
Prédicat non monotone (faux vrai faux) : la dichotomie converge vers n'importe quel bord, sans erreur. Vérifier la monotonie avant d'écrire ; sinon, balayage ou ternaire (unimodal).

## Pièges Python
- Mélanger inclusif et exclusif entre l'init et la mise à jour : boucle infinie ou hors-par-un.
- `lo = mid` au lieu de `mid + 1` : boucle infinie quand hi = lo + 1.
- `mid = (lo + hi) // 2` : correct en Python (entiers non bornés), à savoir dire faux en C/Java.
- Retourner lo sans vérifier P(lo) quand l'existence n'est pas garantie.

## Résumé
1. Signal : espace ordonné + prédicat monotone, y compris sur la réponse.
2. Tout se ramène à « premier vrai » ; invariant faux/[lo]…[hi]/vrai, bornes inclusives tenues.
3. Variant hi − lo ; log₂ n tours × coût de P.
4. `lo = mid + 1` et `hi = mid`, jamais `lo = mid`.

**Phrase d'entretien** : « Dès que le prédicat est monotone, je cherche le premier vrai : deux bornes inclusives, si le milieu est vrai la réponse est à gauche ou lui, sinon strictement à droite ; hi moins lo décroît, donc log n tours. Quand la question porte sur une valeur et pas sur un indice — une vitesse, une capacité — l'espace de recherche est la réponse, et le prédicat coûte un balayage. »

## Chaîne verbalisée
1. Quel signal, et lequel l'interdit ? → Ordonné + monotone ; faux-vrai-faux l'interdit.
2. Énonce l'invariant avec ses bornes. → Faux sur [0, lo), vrai sur (hi, n), premier vrai dans [lo, hi].
3. Pourquoi `lo = mid + 1` et pas `lo = mid` ? → Variant : mid peut valoir lo ; boucle infinie.
4. Recherche sur la réponse : que sont l'espace et P ? → [1, max] ; « faisable avec cette valeur », monotone.

## Ce qui a cassé pour Salah
- Bornes inclusives/exclusives et « premier vrai » : t09 les listait ; ici un seul squelette pour toute la famille, et la figure 2 pour la recherche sur la réponse.

## Questions pour la revue
Tous les chiffres du spec ont été revérifiés par script avant écriture : **aucun n'était
faux**. Trace de la figure 1 : (0, 5, 2, faux) → (3, 5, 4, vrai) → (3, 4, 3, vrai) → lo = hi = 3,
3 tours = ⌈log₂ 6⌉, confirmée ; invariant « faux sur [0, lo), vrai sur (hi, n) » confronté à une
force brute à chaque tour sur **200 000** espaces aléatoires, 0 désaccord. LC 875, piles
[3, 6, 7, 11] : heures(v) = 27, 15, 10, **8**, 8, 6, 5, 5, 5, 5, 4 pour v = 1…11, premier vrai
**4**, 4 tours = ⌈log₂ 11⌉, confirmés. Bornes inf/sup confrontées à `bisect` (100 000 tableaux)
et rotation confrontée à `min(a)` (100 000 rotations) : 0 désaccord. Restent quatre points :

1. **Le gain de LC 875 est nul sur le fil rouge du spec.** 4 tours × 4 piles = 16 divisions,
   contre 4 vitesses × 4 piles = 16 pour un balayage depuis 1 — exactement à égalité. La
   sheet le **dit** au pas 7 plutôt que de le taire, et donne l'échelle de l'énoncé réel
   (10⁴ piles, vitesses ≤ 10⁹ : 3 · 10⁵ contre 10¹³). À valider : est-ce le bon parti, ou
   faut-il un h plus petit dans la figure pour que le jouet gagne déjà ?
2. **`a[i] ≤ a[n−1]` pour le tableau tourné suppose des valeurs distinctes.** La ligne du
   spec ne le dit pas ; avec des doublons le prédicat n'est plus monotone (le cas
   [3, 3, 1, 3] est le classique). La vérification par script a donc été faite sur des
   valeurs distinctes, et la sheet pose la restriction explicitement au pas 6.
3. **La figure 1 n'a que deux canaux visuels, pas trois.** `SL.trace` offre `win` (cadre) et
   `mark` (fond) : la zone « encore possible » est le cadre vert, la zone connue **vraie**
   est le fond ambré, et la zone connue **fausse** est rendue par *absence* de marque, pas
   par un gris propre comme le demandait le spec. Ajouter un troisième canal voudrait dire
   toucher `assets/sheetlib.js`, ce que le skill réserve aux correctifs de rendu.
4. **La sheet fait 8 pas** là où le spec en suggérait 7 : « toute la famille est un choix de
   P » (pas 6) et « chercher sur la réponse » (pas 7) ont été séparés, parce que le second
   change l'espace et le coût de P, et pas seulement le prédicat.

**Arbitrage de revue 7, 17/09 — validé 17/09.** Les quatre points sont tranchés dans le
sens de la sheet. **8 pas validés** : séparer « choix de P » et « chercher sur la
réponse » est le bon découpage, le second change l'espace et le coût de P. La
restriction **valeurs distinctes** pour `a[i] ≤ a[n−1]` est **validée** et reste au
pas 6. La **nuance LC 875 validée** : dire au pas 7 que le jouet n'y gagne rien et
donner l'échelle réelle (3 · 10⁵ contre 10¹³) vaut mieux qu'un h truqué pour faire
gagner la dichotomie. Le troisième canal visuel manquant est réglé à la source : la
zone connue **fausse** passe par `dim` (revue 7, point 3), plus par absence de marque.
