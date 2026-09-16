---
id: p00-04
series: chain
part: "00"
number: "04"
slug: moyenne-lgn-tcl
title: Moyenne, loi des grands nombres, théorème central limite
subtitle: socle — pourquoi une moyenne se resserre en 1/√n et prend une forme de cloche
prereq: [p00-01, p00-02]
anki: [stats::tcl, stats::lgn, stats::se, stats::normale]
bridges: [b03, b04]
next: p01-01
status: ready
---

## Question de la chaîne
On moyenne n mesures. Que vaut le centre de la moyenne, sa largeur, sa forme, et à partir de quel n ?

## Prérequis
- p00-02 : E linéaire ; Var(aX) = a²Var(X) ; additivité des variances sous indépendance.
- p00-01 : Normale, 68 / 95 / 99,7.

## Hypothèses posées
- H1 : X₁, …, Xₙ **iid** de moyenne μ et de variance σ² **finie**.
- H2 : n est le nombre de termes moyennés (pas le nombre de « cas rares » dedans — voir casse).

## Exemple fil rouge
Dé : μ = 3,5, σ = 1,708. Moyenne de n dés : E = 3,5 ; SE = σ/√n : n = 1 → 1,708 ; 4 → 0,854 ; 25 → 0,342 ; 100 → 0,171. Diviser la largeur par 2 coûte 4× plus de dés.
Forme : n = 1, plate ; n = 2, triangle ; n = 4, déjà une cloche. À n = 100, X̄ ≈ N(3,5 ; 0,171²) : P(X̄ > 3,8) = P(Z > 1,76) = 0,039.
Chebyshev à n = 100 : P(|X̄ − 3,5| > 0,5) ≤ 2,917/(100·0,25) = 0,117 (borne large ; le TCL dit 0,003).
Loi asymétrique : Exponentielle(1) moyennée : n = 10, la cloche penche encore ; n = 100, elle est là.
Bernoulli rare p = 0,02, n = 100 : np = 2 ⇒ peigne asymétrique, pas de cloche — même à n = 100.

## Pas de la chaîne
1. **Le décor.** X̄ = (X₁ + … + Xₙ)/n est une fonction du tirage : c'est une variable aléatoire (colonne aléatoire de p01-01). Elle a un centre, une largeur, une forme.
2. **Centre : E[X̄] = μ.** Linéarité, sans hypothèse d'indépendance. Au tableau : « L'espérance est linéaire, donc celle de la somme est nμ, donc celle de la moyenne est μ, quelles que soient les dépendances. »
3. **Largeur : Var(X̄) = σ²/n** [tronc]. Deux règles de p00-02 : les variances s'ajoutent (indépendance) → nσ² ; diviser par n divise la variance par n² → σ²/n. SE = σ/√n. Au tableau : « Les n termes sont indépendants, donc leurs variances s'ajoutent en nσ², donc diviser par n divise par n², donc la largeur de la moyenne est σ sur racine de n. »
4. **Le 1/√n est lent.** ÷2 sur la largeur = ×4 sur n ; ÷10 = ×100. C'est le coût de toute précision statistique, et la raison pour laquelle « plus de données » a des rendements décroissants.
5. **LGN : X̄ → μ** [tronc]. Chebyshev : P(|X̄ − μ| > ε) ≤ σ²/(nε²) → 0. La moyenne converge ; **la somme, elle, s'écarte** (son écart-type σ√n croît). « Les tirages se compensent » est faux ; c'est la division par n qui fait converger. Au tableau : « La variance de la moyenne tend vers zéro, donc la probabilité d'un écart fixé tend vers zéro, donc la moyenne converge vers μ — et non parce que les écarts se compenseraient. »
6. **TCL : la forme devient normale** [tronc]. (X̄ − μ)/(σ/√n) → N(0, 1), **quelle que soit la loi** des Xᵢ, pourvu que σ² soit finie. Une somme de beaucoup de petits termes indépendants « oublie » la loi de départ. Vitesse : rapide si la loi est symétrique (dé : n = 4), lente si elle est asymétrique (exponentielle : n ≈ 100), très lente si un événement est rare (Bernoulli 0,02 : il faut np ≥ 10). Au tableau : « Chaque terme contribue peu et indépendamment, donc la forme de la somme ne dépend plus de la forme des termes, donc elle est normale, et d'autant plus vite que la loi est symétrique et sans queue. »
7. **Standardiser.** Z = (X̄ − μ)/(σ/√n) : 95 % dans ±1,96. C'est la brique de l'IC (p01-02) : X̄ ± 1,96σ/√n. Quand σ est inconnu, on le remplace (plug-in), et à petit n c'est Student (p01-03).
8. **Où ça casse** [casse].

## Figures exigées
- **Figure 1 — `repeat` + `slider` n ∈ {1, 2, 4, 10, 30, 100}** : draw = moyenne de n dés ; bins [1 ; 6 ; 50] fixes ; marque μ = 3,5 ; readouts écart-type mesuré vs σ/√n. Légende : l'axe ne bouge pas, la cloche se resserre en 1/√n et prend forme dès n = 4.
- **Figure 2 — `repeat` + `slider` n** : draw = moyenne de n Exponentielle(1) ; bins [0 ; 3 ; 60] ; marque μ = 1. Légende : loi asymétrique, la cloche met n ≈ 100 à devenir symétrique.
- **Figure 3 — `repeat` + `slider` n ∈ {20, 100, 500, 5 000}** : draw = moyenne de n Bernoulli(0,02) ; bins [0 ; 0,08 ; 40] ; marque 0,02. Légende : à n = 100, np = 2 : un peigne ; la cloche demande np ≥ 10, donc n ≥ 500. Ce qui compte est le nombre de succès, pas n.
- **Figure 4 — `plot` + bouton « nouveau chemin »** : deux courbes sur le même tirage de 1 000 dés : la moyenne cumulée (converge vers 3,5, bande ±2σ/√n dessinée) et la somme cumulée moins 3,5·n (s'écarte, bande ±2σ√n). Légende : la moyenne converge, la somme diverge ; « se compenser » n'existe pas.

## Où ça casse
- **Dépendance** : Var(X̄) devient ρσ² + (1 − ρ)σ²/n (b04) : avec ρ > 0, la largeur ne tend plus vers zéro. Lignes d'un même utilisateur, séries temporelles.
- **Variance infinie** (Cauchy, Pareto d'indice ≤ 2) : ni LGN utile ni TCL ; la moyenne de n Cauchy a la même loi qu'une seule.
- **Événements rares** : le TCL demande que chaque terme pèse peu ; avec p = 0,02 il faut np ≥ 10 — c'est le 28/30 de p01-01 vu d'ici.
- **« n ≥ 30 »** est un ordre de grandeur pour des lois symétriques, pas un théorème.

## Résumé
1. X̄ est une v.a. ; E[X̄] = μ sans condition.
2. Var(X̄) = σ²/n sous indépendance ; SE = σ/√n ; ÷2 sur la largeur = ×4 sur n.
3. LGN : X̄ → μ parce que sa variance → 0, pas par compensation ; la somme s'écarte.
4. TCL : forme normale quelle que soit la loi, à variance finie ; vitesse selon symétrie et rareté (np ≥ 10).
5. Z = (X̄ − μ)/(σ/√n), ±1,96 : la brique de l'IC.
6. Casse : dépendance (ρ), variance infinie, événements rares, « n ≥ 30 » pris pour une loi.

**Phrase d'entretien** : « La moyenne de n observations indépendantes est centrée sur μ, de largeur σ sur racine de n, et sa forme devient normale quelle que soit la loi de départ dès que chaque terme pèse peu — vite pour une loi symétrique, lentement pour une loi asymétrique, et pas avant dix succès pour un événement rare. Elle converge parce que sa variance tend vers zéro, pas parce que les tirages se compensent. »

## Chaîne verbalisée
1. D'où vient σ²/n ? → Additivité (indépendance) → nσ² ; division par n → 1/n².
2. Pourquoi X̄ converge, et la somme ? → Var(X̄) → 0 ; la somme a un écart-type σ√n qui croît.
3. Que dit le TCL, et sous quelle condition ? → Forme normale de (X̄ − μ)/(σ/√n), variance finie, indépendance.
4. À partir de quel n ? → Dépend de la loi : 4 pour un dé, ~100 pour une exponentielle, np ≥ 10 pour une Bernoulli rare.
5. Que devient σ²/n si les termes sont corrélés ? → ρσ² + (1 − ρ)σ²/n : ne tend plus vers 0.

## Ce qui a cassé pour Salah
- Q17 (TCL) réussie à la calibration : la chaîne ne redémontre rien, elle **montre** (figures 1–3) et fixe le vocabulaire des vitesses.
- 16/09 : « c'est la prévalence qui casse l'IC normal » corrigé en « le nombre de succès » — la figure 3 et la casse le disent depuis le TCL lui-même, pour que p01-01 ait un ancrage en amont.
- Pont b04 (variance d'une moyenne corrélée) : la casse en donne la formule sans la dériver ; c'est le pont qui la dérive.
- Bessel n'est pas ici (p01-03) ; ne pas l'introduire.

## Exclusions
Pas de démonstration du TCL, pas de Berry-Esseen, pas de convergence presque sûre vs en probabilité, pas de Bessel.
