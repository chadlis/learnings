---
id: l06
series: lesson
part: "00"
number: "06"
slug: fonctions-standardisation
title: Fonctions d'une variable aléatoire
subtitle: socle — Brunton 23 à 25 : de CDF à CDF, aX + b, standardisation, χ²
prereq: [l04, l05]
anki: [stats::standardisation, stats::chi2]
bridges: []
next: l07
status: built
---

## Question de la leçon
Si X a une loi connue et Y = g(X), quelle est la loi de Y, et comment ramène-t-on toute normale à la normale centrée réduite pour calculer une probabilité ?

## Vidéos couvertes
23 Functions of a Random Variable · 24 Rescaling the Normal Distribution to Mean Zero and Variance One · 25 The Chi-Squared Distribution: The Square of the Normal Distribution.

## Prérequis
- l04 : densité et fonction de répartition (`lesson-00-04-variables-binomiale-normale.html#n2`) ; normale centrée réduite et Φ (`…#n6`).
- l05 : loi exponentielle, densité λe^(−λt), répartition 1 − e^(−λt) (`lesson-00-05-poisson-exponentielle-attentes.html#n3`).
- Calcul : dérivée d'une fonction composée (règle de la chaîne), dérivée de √y.

## Notions

### n1 · De CDF à CDF, puis dériver : pourquoi la densité ne se transporte pas — OUTIL — Brunton 23
- Idée : Brunton pose Y = g(X) (°F → °C, X², énergie cinétique ½mV²) et avertit avant toute formule : on ne peut pas « brancher » la densité de X dans g. Exemple chiffré : X uniforme sur [0, 1], Y = 2X ; recopier la densité (hauteur 1 sur [0, 2]) donne une aire de 2 ; la vraie densité vaut ½. Raison : une densité est un taux de probabilité par unité de longueur ; si g étire, la même probabilité s'étale sur une largeur plus grande. Une fonction de répartition, elle, est la probabilité d'un événement, et un événement sur Y se réécrit en événement sur X : elle se transporte.
- Formule : méthode F_Y(y) = P(g(X) ≤ y) → événement sur X → F_X(…) → f_Y = F_Y′. Pour g strictement monotone et dérivable : f_Y(y) = f_X(g⁻¹(y)) · |(g⁻¹)′(y)|. Hypothèses et rôle : X à densité (P(X = x) = 0, ≤ ou < indifférent) ; g monotone → l'événement est une demi-droite ; g dérivable → la règle de la chaîne fait sortir l'étirement local ; la valeur absolue couvre g décroissante ; g non monotone → plusieurs morceaux (n4). En discret, les masses se transportent telles quelles (l08#n5).
- Exemples : uniforme × 2 (aire 2 si on recopie, hauteur ½) ; spams Exp(4/h) en minutes : f(0) = 4 par heure = 4/60 = 0,0667 par minute, P(M ≤ 6 min) = P(T ≤ 0,1 h) = 1 − e^(−0,4) = 0,330 dans les deux unités ; −ln U pour U uniforme : P(−ln U ≤ y) = P(U ≥ e^(−y)) = 1 − e^(−y), une Exp(1) (c'est ainsi qu'on simule une exponentielle) ; l'exercice de Brunton, φ(x)² : aire 1/(2√π) = 0,282 ; la formule appliquée à −ln U (f_Y = e^(−y)) et à x² sur [0, 1] (f_Y = 1/(2√y), la densité de la figure 1).
- Preuve (CULTURE) : g croissante puis décroissante, la règle de la chaîne nommée à chaque ligne ; la conservation f_Y |dy| = f_X |dx|.
- Code : uniforme × 2 (hauteurs ≈ 0,5), −ln U comparé à 1 − e^(−y) en trois points, et l'aire de la densité recopiée.
- Où ça casse : brancher la densité dans g (φ², aire 0,282) ; oublier le facteur |(g⁻¹)′| (aire a) ; g non monotone ; une valeur de densité dépend de l'unité, une probabilité non (scorie « densité évaluée contre intégrée ») ; ML : comparer des log-vraisemblances d'un modèle sur y et d'un modèle sur log y exige le terme −Σ log yᵢ ; les normalizing flows ajoutent log |det J|.
- Brunton dit / c'est : (23, et 13, 16) « cumulative density function » → fonction de répartition (cumulative distribution function) : une probabilité, pas une densité, et c'est pour ça qu'elle se transporte.
- Ce qu'on garde : X à densité, g strictement monotone sur les valeurs de X, Y = g(X) : f_Y(y) = f_X(g⁻¹(y)) · |(g⁻¹)′(y)| ; on l'obtient en dérivant F_Y(y) = P(g(X) ≤ y), jamais en recopiant la densité.

### n2 · Y = aX + b : nouvelle moyenne, nouvel écart-type, le cas a < 0 — OUTIL — Brunton 23 (et 24)
- Idée : °C → °F, a = 9/5, b = 32. X ~ N(15, 5²) en °C ; Y ~ N(59, 9²) en °F. P(Y ≤ 68) = P(X ≤ 20) = Φ(1) = 0,841. Pic 0,0798 par °C → 0,0443 par °F (÷ 1,8). Brunton suppose a > 0 « sans que ça compte beaucoup » : avec Y = 20 − X (degrés manquants pour atteindre 20 °C), a = −1, « Y ≤ 0 » devient « X ≥ 20 » : 0,159 ; sans retourner l'inégalité on trouverait 0,841.
- Formules : f_Y(y) = f_X((y − b)/a)/|a| (a ≠ 0) ; a > 0 : F_Y(y) = F_X((y − b)/a) ; a < 0 : F_Y(y) = 1 − F_X((y − b)/a) ; E[Y] = aμ + b, σ_Y = |a|σ, Var(Y) = a²σ² (l08#n9) ; X ~ N(μ, σ²) ⇒ aX + b ~ N(aμ + b, a²σ²). a = 0 : Y = b constante, plus de densité. N(μ, σ²) : le second paramètre est la variance.
- Exemples : °C → °F ; Y = 20 − X ~ N(5, 5²) ; Y = −X (miroir) ; heures → minutes (a = 60) ; a = 0.
- Preuve (CULTURE) : a > 0 puis a < 0 (l'inégalité se retourne, P(X = x) = 0, chaîne : −1/a = 1/|a|) ; la normale : (y − b)/a − μ = (y − (aμ + b))/a, donc l'exposant devient −(y − (aμ + b))²/(2a²σ²).
- Code : °C → °F simulé (moyenne, écart-type, P(Y ≤ 68)) ; 20 − X : P(Y ≤ 0) simulé contre 1 − F_X(20) et contre F_X(20).
- Où ça casse : écart-type aσ négatif ; 1/a au lieu de 1/|a| → densité négative, aire −1 ; inégalité non retournée ; a = 0 ; seule une transformation affine garde la famille normale (e^X est log-normale, l08#n2) ; une exponentielle décalée n'est plus une exponentielle.
- Brunton dit / c'est : (23) « l'écart-type est a²σ² » et « le signe de a compte peu » → a²σ² est la variance ; l'écart-type est |a|σ ; avec a < 0 l'inégalité se retourne et la densité se divise par |a|. En 24, il corrige en « a fois σ », sans la valeur absolue.
- Ce qu'on garde : Y = aX + b, a ≠ 0 : f_Y(y) = f_X((y − b)/a)/|a| ; si a < 0, l'inégalité se retourne, F_Y(y) = 1 − F_X((y − b)/a). (Moyenne, écart-type et normalité restent dans le résumé.)

### n3 · Standardisation Z = (X − μ)/σ ; intervalles par Φ — OUTIL — Brunton 24
- Idée : les tables (et le code Fortran des années 70) ne donnent Φ que pour N(0, 1). Z = (X − μ)/σ, soit a = 1/σ, b = −μ/σ dans n2 : moyenne 0, écart-type 1. Centrer, puis réduire. Les événements se correspondent, donc les probabilités aussi : ±σ autour de μ ↔ ±1 autour de 0 (68,3 %). Avec X ~ N(15, 5²) : P(10 < X < 25) = Φ(2) − Φ(−1) = 0,9772 − 0,1587 ≈ 0,819 ; le « P(X < 7) » que cite Brunton sans paramètres : z = −1,6, Φ(−1,6) = 0,0548.
- Formule : Z = (X − μ)/σ ; E[Z] = 0, σ_Z = 1 pour toute loi de variance finie ; Z ~ N(0, 1) seulement si X est normale ; P(c < X < d) = Φ((d − μ)/σ) − Φ((c − μ)/σ). Bornes notées c, d (Brunton réutilise a et b). En pratique μ̂, σ̂ estimés (sur le train) ; à petit n, (X̄ − μ)/(S/√n) suit une Student (p01-03).
- Exemples : ±σ, ±2σ, ±3σ (68,3 ; 95,4 ; 99,7 %) ; P(10 < X < 25) ; P(X < 7) ; les 400 pièces de Brunton 16 (sans correction Φ(3) − Φ(−1) = 0,840 ; exact 0,852 avec la correction de continuité, l04#n7) ; ML : distances de k-means avec taille en cm et revenu en k€ ou en € (AC = 10 ou 10 000), standardisées (AB = 1, AC = 0,5).
- Code : P(10 < X < 25) par Φ et par simulation ; une exponentielle standardisée : moyenne 0, écart-type 1, P(Z > 2) = 0,050 contre 0,023 ; z-score de deux features.
- Où ça casse : standardiser ne rend pas normal (exponentielle : P(Z > 2) = e^(−3) = 0,0498 contre 0,0228, P(Z < −1) = 0 contre 0,159 ; uniforme : |Z| ≤ 1,73) ; scipy et numpy prennent σ, pas σ² (`scale`) ; standardiser avec les statistiques du test = fuite (p06-02) ; μ̂ et σ̂ estimés : Student à petit n ; arbres insensibles (seul l'ordre compte).
- Brunton dit / c'est : (24) Φ est « la fonction d'erreur » → Φ(z) = ½[1 + erf(z/√2)] ; erf(0) = 0, Φ(0) = ½. Et N(μ, σ) contre N(μ, σ²) : on écrit N(μ, σ²).
- Ce qu'on garde : X ~ N(μ, σ²) : P(c < X < d) = Φ((d − μ)/σ) − Φ((c − μ)/σ), parce que Z = (X − μ)/σ suit N(0, 1), ce qui n'est vrai que si X est normale.

### n4 · Le χ² à un degré de liberté : Y = X² — CULTURE (OUTIL aux tests) — Brunton 25
- Idée : X ~ N(0, 1), Y = X². « Y ≤ y » veut dire « −√y ≤ X ≤ √y » : les deux queues de X se replient sur un seul côté. P(Y ≤ 1) = P(|X| ≤ 1) = 0,683 ; P(Y ≤ 3,84) = P(|X| ≤ 1,96) = 0,95. Près de 0, le carré écrase : la bande |X| ≤ 0,1 (8 % de la masse) tombe dans [0 ; 0,01], densité moyenne 7,97 : la densité diverge en 0.
- Formule : F_Y(y) = Φ(√y) − Φ(−√y) = 2Φ(√y) − 1 (y > 0), F_Y = 0 pour y ≤ 0 ; f_Y(y) = φ(√y)/√y = e^(−y/2)/√(2πy) ; E[Y] = 1, Var(Y) = 2. Hypothèses : X centrée réduite exactement (sinon standardiser, n3) ; g non monotone, deux antécédents ±√y ; somme de k carrés indépendants → χ²_k, moyenne k, variance 2k ; χ²₁ = Gamma(½, taux ½) (l05#n7).
- Exemples : y = 1 → 0,683 ; y = 3,84 → 0,95 (3,84 ≈ 1,96², le quantile 97,5 % de la normale) ; y = 0,01 → 0,0797 ; f_Y(0,5) = 0,439, f_Y(2) = 0,104 ; E[Y] = Var X = 1 ; ML : NLL gaussienne = ½ Σ (rᵢ/σ)² + constante, somme de carrés d'erreurs normalisées.
- Preuve (CULTURE) : la dérivation complète, chaîne et parité de φ nommées ; E[X⁴] = 3 donné.
- Code : P(Y ≤ 1), P(Y ≤ 3,84), moyenne, variance, densité empirique contre la formule en 0,5 et 2 ; P(Y ≤ 0,01) ; somme de k = 5 carrés.
- Où ça casse : carré de la densité (aire 0,282) ; une seule branche (aire ½) ; densité infinie ≠ probabilité infinie ; X non centrée réduite ; « les erreurs au carré suivent une normale » (Brunton) : ce sont les erreurs standardisées qui sont ≈ N(0, 1) ; indépendance nécessaire ; degrés de liberté qui baissent quand on estime des paramètres (aux tests).
- Brunton dit / c'est : (25) « les pentes en ±√y sont égales et opposées » → égales (φ paire) ; le signe vient de la dérivée intérieure −1/(2√y), qui annule le moins devant Φ(−√y) ; les deux termes s'ajoutent ; le résultat final est juste. Et la normale centrée réduite s'écrit e^(−x²/2)/√(2π), pas e^(−x²/σ²).
- Ce qu'on garde (pas de carte ici, carte aux tests) : si X ~ N(0, 1), X² suit un χ² à 1 degré de liberté : P(X² ≤ y) = P(|X| ≤ √y) ; moyenne 1, variance 2 ; 3,84 ≈ 1,96² ; une somme de k carrés indépendants donne χ²_k.

## Figures exigées
Vignettes « voir l'idée », sous chaque idée :
- v1 (n1) — `plot` ×2 : en haut X uniforme sur [0, 1] et la bande [0,2 ; 0,3] ; en bas Y = aX, la vraie densité (hauteur 1/a), la densité recopiée en pointillé rouge, la bande devenue [0,2a ; 0,3a]. Curseur a ∈ [0,5 ; 4], départ a = 2. Readouts : aire recopiée (= a), hauteur vraie 1/a, aire vraie 1, probabilité de la bande 0,1.
- v2 (n2) — `plot` : densité de X ~ N(15, 5²) en gris, densité de Y = aX + b en violet, l'événement « X ≤ 20 » et son image ombrés. Boutons °F (1,8 ; 32) · 20 − X (−1 ; 20) · °C ; transition animée (a passe par 0 vers le miroir). Readouts : moyenne, écart-type, pic, l'événement image, 0,841.
- v3 (n3) — `plot` ×2 alignés : N(15, 5²) en °C et N(0, 1) en z, graduations alignées (μ ↔ 0, σ ↔ 1), même intervalle ombré. Boutons 10 à 20 °C (68,3 %) · X < 7 °C (5,48 %) · 10 à 25 °C (81,9 %).
- v4 (n4) — `plot` ×2 : φ avec la bande ±√y, densité du χ²₁ avec [0, y] ; curseur y ∈ [0,01 ; 6] et boutons y = 1 · 3,84 · 0,01. Readouts √y, probabilité, densité moyenne sur [0, y] = P/y (7,97 à 0,01 ; 0,683 à 1 ; 0,247 à 3,84), f_Y(y). Les boutons se relâchent quand on bouge le curseur.

Figures sous la formule :
- Figure 1 (n1) — `plot` ×2 côte à côte, même axe vertical : y = g(x) et dix tranches de probabilité 0,1, puis la densité de Y couchée, dix rectangles d'aire 0,1 et la densité exacte. Boutons g = 2x · x² · √x · −ln x. Readouts : f_Y exacte, tranche la plus haute (0,5 ; 10 ; 1,95 ; 0,949) et où elle tombe, aire de chaque tranche. Les hauteurs hors cadre (10 et 3,3 pour x²) sont écrites.
- Figure 2 (n2) — `plot` : X = attente Exp de moyenne 15 min, densité de aX + b, moyenne et ±σ (segment au-dessus du pic maximal 0,133), et pour a < 0 la courbe « 1/a » négative en pointillé. Curseurs a ∈ [−2 ; 2] (pas 0,5), b ∈ [−30 ; 30]. Départ a = −1, b = 30.
- Figure 3 (n3) — `plot` : densité de Z standardisée contre φ ; boutons normale · exponentielle · uniforme ; queue Z > 2 ombrée et étiquetée (0,0228 ; 0,0498 ; 0) ; readouts P(Z > 2) et P(|Z| < 1), vraies et selon Φ.
- Figure 4 (n4) — `plot` : Φ, les points en ±√y, deux tangentes de même pente φ(√y), l'écart F_Y(y) ; flèches de longueur proportionnelle à la vitesse 1/(2√y) ; curseur y et bouton « élargir la bande » ; readouts pente, vitesse ±1/(2√y), contribution de chaque bout, f_Y(y).

## Résumé
1. Une densité est un taux par unité : elle ne se recopie pas ; une fonction de répartition, probabilité d'un événement, se transporte.
2. Méthode : F_Y(y) = P(g(X) ≤ y), réécrire en événement sur X, dériver (règle de la chaîne).
3. g monotone : f_Y(y) = f_X(g⁻¹(y)) · |(g⁻¹)′(y)| ; la densité se divise par l'étirement.
4. Y = aX + b : f_Y(y) = f_X((y − b)/a)/|a|, moyenne aμ + b, écart-type |a|σ ; a < 0 retourne l'inégalité.
5. Une normale reste normale : aX + b ~ N(aμ + b, a²σ²).
6. Z = (X − μ)/σ : moyenne 0 et écart-type 1 toujours, N(0, 1) seulement si X est normale ; P(c < X < d) = Φ((d − μ)/σ) − Φ((c − μ)/σ).
7. X ~ N(0, 1) ⇒ X² ~ χ²₁ : P(X² ≤ y) = 2Φ(√y) − 1, moyenne 1, variance 2, densité infinie en 0.

Phrase d'entretien : « Pour la loi d'une fonction d'une variable aléatoire, je ne transforme pas la densité : je passe par la fonction de répartition, P(g(X) ≤ y), que je réécris comme un événement sur X, puis je dérive. Pour une transformation affine, la densité se divise par |a| ; standardiser en est le cas a = 1/σ, et ça ne rend normale qu'une variable déjà normale. »

## Chaîne verbalisée
1. Pourquoi ne peut-on pas remplacer x par g⁻¹(y) dans la densité ? → Une densité est un taux par unité ; si g étire, la même probabilité s'étale : il faut diviser par l'étirement. Uniforme × 2 recopiée : aire 2.
2. La méthode pour la loi de Y = g(X) ? → F_Y(y) = P(g(X) ≤ y), événement sur X, F_X, dériver par la règle de la chaîne.
3. Densité de aX + b, et ce qui change si a < 0 ? → f_X((y − b)/a)/|a| ; F_Y(y) = 1 − F_X((y − b)/a) ; écart-type |a|σ.
4. X ~ N(15, 5²) : P(10 < X < 25) ? → Φ(2) − Φ(−1) = 0,9772 − 0,1587 ≈ 0,819.
5. Standardiser une feature exponentielle la rend-elle normale ? → Non : moyenne 0, écart-type 1, même forme ; P(Z > 2) = 0,050 et non 0,023.
6. Loi de X² pour X ~ N(0, 1) ? → 2Φ(√y) − 1 : deux antécédents ±√y ; densité e^(−y/2)/√(2πy), moyenne 1 ; 3,84 ≈ 1,96².

## Ce qui a cassé pour Salah
- Scorie persistante : règle de la chaîne élidée dans les dérivations. Adressé : chaque preuve (n1, n2, n4) nomme la règle de la chaîne en marge, la formule de n1 dit d'où sort le facteur, et l'erreur de Brunton en n4 est elle-même une dérivée intérieure oubliée (figure 4).
- Scorie : densité évaluée contre intégrée (15/09). Adressé en n1 (idée, exemples, « où ça casse ») : la valeur d'une densité dépend de l'unité (4 par heure = 0,0667 par minute), une probabilité non.
- Scorie : estimateur sans chapeau. Adressé en n3 : μ̂, σ̂ estimés sur le train, la standardisation pratique n'est pas la standardisation exacte.
- Barre bayésienne : la leçon écrit N(μ, σ²) et f_X, aucune barre de conditionnement pour un paramètre.

## Erreurs de Brunton couvertes
23 « l'écart-type est a²σ² », « le signe de a compte peu » → n2 · 25 « pentes égales et opposées » → n4 (et figure 4) · 13, 16, 23 « cumulative density function » → n1 · 24 Φ appelé fonction d'erreur, N(μ, σ) contre N(μ, σ²), a et b pour deux choses → n3 · 25 e^(−x²/σ²) et « les erreurs au carré suivent une normale » → n4.

## Exclusions
Pas de jacobien en dimension 2 (l07#n6), pas de dérivation de χ²_k (fonction génératrice, l12), pas de test du χ² ni de Student (parties 1), pas de χ² décentré, pas de loi de ½mV² (Brunton l'annonce pour la vidéo 32 : l08#n10 ne calcule que son espérance).

## Questions pour la revue
- **Écarts au plan, aucun sur les notions** : quatre notions, dans l'ordre et avec les étiquettes du plan. Visuel de n1 dédoublé : la vignette v1 montre la densité étirée (le visuel du plan), la figure 1 ajoute la formule de g monotone par tranches de probabilité 0,1. Visuel de n2 : la vignette v2 reprend °C → °F sur la normale ; la figure 2 met les curseurs a et b sur une loi **asymétrique** (l'attente des spams, Exp de moyenne 15 min), parce qu'une normale retournée ne se distingue pas d'une normale décalée : le cas a < 0 ne se voit que sur une loi asymétrique. Ajout pour n4 : la figure 4 (tangentes de Φ en ±√y), qui montre l'erreur de Brunton plutôt que de la décrire. Ajout pour n3 : la figure 3 (« standardiser ne rend pas normal »), contre-exemple jugé indispensable pour l'usage ML du z-score.
- **Chiffres arrondis écrits avec ≈** : 0,9772 − 0,1587 donne 0,8185 posé à quatre décimales, alors que Φ(2) − Φ(−1) = 0,81859 ; la leçon écrit « ≈ 0,819 » pour qu'aucune soustraction affichée ne soit fausse (même règle que p00-02). De même 1,96² = 3,8416 : « 3,84 ≈ 1,96² ».
- **Exemple des degrés manquants (Y = 20 − X)** : inventé pour le cas a < 0, Brunton n'en donne pas. Les σ de 10 cm et 20 k€ de l'exemple k-means sont posés (« disons »), pas mesurés.
- **Brunton 24 sans erreur de calcul** : l'encadré de n3 porte sur Φ appelé « fonction d'erreur » et sur N(μ, σ) contre N(μ, σ²), deux points du digest, pas de la table d'errata.
- **Anki** : le frontmatter ne donne que `stats::standardisation` et `stats::chi2` ; les notions 1 et 2 (méthode CDF, aX + b) sont rattachées à `stats::standardisation` faute d'un tag « changement de variable ». À trancher.
- **Relecture en contexte frais (10/10/2026), appliquée :**
  - légende de v3 : « cinq fois plus, puisqu'une unité de z couvre 5 °C » remplace « l'unité est cinq fois plus courte », qui contredisait n1 ;
  - 400 pièces (n3) : 0,840 est la normale sans correction, l'exact 0,852 demande la correction de continuité (vérifié : binomiale 0,8520, Φ(3) − Φ(−1) = 0,8400) ;
  - formule de n1 : « g strictement monotone sur l'ensemble des valeurs de X (x² l'est sur [0, 1], pas sur ℝ) », et la casse de n1 précise « X des deux signes » ;
  - exemples de n1 : la formule est appliquée à −ln U et à x² sur [0, 1] (f_Y = 1/(2√y), P([0 ; 0,01]) = 0,1), avec l'inversion F⁻¹(u) = −ln(1 − u) ;
  - v4 : readout « densité moyenne sur [0, y] » (7,97 ; 0,683 ; 0,247, vérifiés) et légende finie par la densité moyenne 7,97 ;
  - formule de n3 : la boucle avec l04 notion 6 est fermée en tête des puces, et l'item 1 des exemples y renvoie ;
  - dernière puce de n3 et sa casse : hypothèses i.i.d. normales et Student à n − 1 degrés de liberté dites, sans symboles X̄ et S non définis ;
  - « ce qu'on garde » de n1, n2, n3 : une idée, cadre dit, 29 à 37 mots ; moyenne, écart-type et normalité de aX + b restent au résumé ;
  - corrections de Brunton sorties du texte courant : « Si. » (idée n2), « tantôt l'un, tantôt l'autre » (formule n2), l'exposant esquissé (preuve n2, désormais dans l'encadré, « e to the minus whatever… »), les erreurs au carré (casse n4), « Brunton hésite » (formule n1), les bornes a et b (formule n3, désormais dans l'encadré) ;
  - encadré de n4 : sa première ligne était juste (« minus and minus. So plus »), c'est son doute (« I think this should be a minus ») qui introduit l'erreur ;
  - encadré de n1 : « dit souvent », puisqu'il dit aussi cumulative distribution function en 23 ;
  - casse de n3, arbres : « les mêmes partitions, seule la valeur du seuil change » ;
  - idée de n3 : « quand les ordinateurs étaient lents » et « sans unité » ;
  - légende de la figure 3 : Exp de taux 1 (μ = σ = 1, toute exponentielle donne la même Z), et la queue est étiquetée et plus contrastée ;
  - formule de n2 : μ = E[X], σ l'écart-type de X ;
  - prérequis : le sigle CDF est introduit ;
  - langue : « c'est elle qui sert aux tests », « entassée », gras décoratif retiré (chapeau, idées de n1, n2, n4), « variables explicatives (features) », « perte (loss) », « jeu de test (test set) » au premier usage ;
  - code c3 ramené à 19 lignes (scipy pour Φ, z-scores en euros seulement) ; figure 2 : segment ±σ au-dessus du pic maximal et légende « moyenne » en bas ; figure 4 : flèches proportionnelles à la vitesse 1/(2√y), légende complétée ; v4 : boutons relâchés au curseur ; chapeaux en `span.hat` partout (règle e) ; légende de la figure 1 en « premier panneau, second ».
- **Rejeté : une fenêtre w = 0,05 pour c4.** Vérifié par script avec la même graine : l'écart à y = 2 reste (0,1012 contre 0,1038, 0,1014 avec w = 0,02) ; c'est du bruit d'échantillonnage. Le code affiche désormais ± deux erreurs-types (0,101 ± 0,004 ; 0,437 ± 0,009), qui couvrent la valeur exacte, et c4 tient en 20 lignes.
- **Idées entre 150 et 170 mots** (compte du validateur, formules comprises), sous la tolérance de 180.
- **Chaîne p00-02** : son pas 4 (transformation affine) est couvert par n2 ici et par l08#n9 pour la variance ; son pas 7 (masse contre densité) par l04#n2, la dépendance à l'unité par n1 ici.
