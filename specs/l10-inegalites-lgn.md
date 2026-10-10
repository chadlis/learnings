---
id: l10
series: lesson
part: "00"
number: "10"
slug: inegalites-lgn
title: Inégalités et loi des grands nombres
subtitle: socle — Brunton 33 à 35 : Markov, Chebyshev, Var(X̄) = σ²/n, la moyenne converge
prereq: [l08, l09]
anki: [stats::lgn, stats::se, stats::chebyshev]
bridges: [b04]
next: l11
status: built
---

## Question de la leçon
Que peut-on dire d'une loi avec sa seule moyenne, puis sa seule variance, et pourquoi la moyenne de n mesures se resserre-t-elle sur μ, à quelle vitesse et à quel prix ?

## Vidéos couvertes
33 Markov's Inequality in Probability: First-Order Estimates · 34 Chebyshev's Inequality in Probability: Second-Order Estimates · 35 The Law of Large Numbers. L'image des mesures répétées de la vitesse de la lumière vient des vidéos 01 et 36, où Brunton l'utilise pour la moyenne de 30 mesures.

## Prérequis
- l08 : `lesson-00-08-esperance-variance.html#n1` (centre de masse, la règle en équilibre), `#n3` (linéarité sans hypothèse), `#n6` (variance = inertie), `#n9` (Var(aX + b) = a² Var X).
- l09 : `lesson-00-09-covariance-correlation.html#n2` (Var d'une somme, le terme croisé, les deux rôles d'i.i.d.), `#n4` (corrélation).
- l04 : `lesson-00-04-variables-binomiale-normale.html#n1` (variable, réalisation, paramètre).

## Notions

### n1 · Markov : la bascule, et la borne atteinte — CULTURE — Brunton 33
- Idée : E[X] = 10, a = 20 ⇒ P(X ≥ 20) ≤ ½. La bascule de Brunton : une masse posée à droite de 20 doit être contrebalancée à gauche de 10, et le contrepoids ne peut pas descendre sous 0. Avec ½ en 20, le contrepoids est tout entier en 0 : la loi {0, 20} atteint la borne.
- Formule : X ≥ 0, a > 0 ⇒ P(X ≥ a) ≤ E[X]/a. Rôle de X ≥ 0 : pas de contrepoids négatif ; rôle de a > 0 : diviser, et la borne n'informe que pour a > E[X].
- Vignette v1 : règle en équilibre sur μ = 10, masse p en 20, contrepoids 1 − p en (10 − 20p)/(1 − p) : 6,67 à p = 0,25, 0 à p = 0,5 ; au-delà, contrepoids bloqué en 0 et la règle bascule.
- Figure 1 : P(X ≥ a) contre E[X]/a, trois lois de moyenne 10 sur [0, ∞) (exponentielle, uniforme sur [0, 20], deux points {0, 20}) ; curseur a.
- Exemples : Brunton 10/20 ; loi à deux points (égalité) ; exponentielle de moyenne 10 : e⁻² = 0,135 en a = 20 (borne 0,5), e⁻⁵ = 0,0067 en a = 50 (borne 0,2) ; a ≤ E[X] : borne ≥ 1 ; ML : perte ≥ 0 de moyenne 0,3 ⇒ au plus 30 % des exemples ont une perte ≥ 1.
- Preuve : la chaîne discrète de Brunton, l'endroit où X ≥ 0 sert (jeter les termes x < a), puis la version en une ligne a · 1{X ≥ a} ≤ X.
- Code : exponentielle de moyenne 10, deux points, et le contre-exemple {−30, 20}.
- Où ça casse : X peut être négative : {−30, 20} avec P(20) = 0,8 a pour moyenne 10 et P(X ≥ 20) = 0,8 > 0,5 ; borne vide pour a ≤ E[X] ; borne lâche pour les lois usuelles.
- Brunton dit / c'est : (33) Markov dessiné sur une normale ; « non négative, donc seulement des valeurs positives » → il faut X ≥ 0 (0 permis) et a > 0, et une loi à support positif.
- Ce qu'on garde (pas de carte) : pour X ≥ 0, P(X ≥ a) ≤ E[X]/a ; seule la moyenne sert ; la loi {0, a} atteint la borne.

### n2 · Chebyshev : au plus 1/k² au-delà de kσ — OUTIL, preuve CULTURE — Brunton 34
- Idée : Markov sur l'écart au carré. Une loi ne peut pas mettre beaucoup de masse loin de μ sans dépasser la variance σ² (l'inertie de l08 n6). k = 2 : au plus 25 % hors de μ ± 2σ, quelle que soit la loi ; la normale n'en met que 4,6 % ; la loi à trois points (1/(2k²) en μ ± kσ, le reste en μ) en met exactement 25 %.
- Formule : P(|X − μ| ≥ a) ≤ σ²/a² (a > 0) ; a = kσ : P(|X − μ| ≥ kσ) ≤ 1/k² ; au moins 75 % dans ±2σ, 88,9 % dans ±3σ. Hypothèse : σ² finie ; aucune hypothèse de forme ; k > 1 pour une borne utile.
- Vignette v2 : axe en unités de σ, curseur k, lois normale, dé, trois points ; part hors de ±kσ contre 1/k².
- Exemples : k = 2 : 25 % contre 4,55 % ; k = 3 : 11,1 % contre 0,27 % ; dé, a = 2,5 : borne 2,917/6,25 = 0,467, vrai 1/3 ; trois points : égalité ; ML : alerte de monitoring à ±3σ, jusqu'à 11 % de fausses alertes sans hypothèse de forme, 0,27 % sous normalité.
- Preuve : Y = (X − μ)² ≥ 0, b = a², élever au carré ne change pas l'événement (deux côtés ≥ 0), Markov sur Y, E[Y] = σ².
- Code : part hors de ±2σ pour normale, uniforme, exponentielle, dé, trois points.
- Où ça casse : borne large ; k ≤ 1 : rien ; variance infinie : rien ; σ estimé et non connu ; la borne porte sur les deux queues ensemble, une seule queue peut prendre jusqu'à 1/(1 + k²) = 20 % à k = 2 (Cantelli, loi à deux points vérifiée).
- Brunton dit / c'est : (34) applique Markov à Y = (X − μ)² sans dire que Y ≥ 0, la seule hypothèse de Markov.
- Ce qu'on garde : pour toute loi de variance finie, P(|X − μ| ≥ kσ) ≤ 1/k² : au plus 25 % au-delà de 2σ, contre 4,6 % pour une normale ; universelle, donc large.

### n3 · X̄ est une variable aléatoire : E[X̄] = μ, Var(X̄) = σ²/n — OUTIL, preuve OUTIL — Brunton 35
- Idée : trois objets. μ, le paramètre, un nombre fixe de la loi ; X̄, la procédure « jeter n dés et moyenner », une variable aléatoire ; x̄, le nombre obtenu ce jour-là, une réalisation. Trois fois quatre dés : 3,25 ; 4,5 ; 2,75, pour un même μ = 3,5. La loi de X̄ est le « pic » de Brunton, large pour n petit, de plus en plus étroit.
- Formule : X̄ = (1/n) Σ Xᵢ ; E[X̄] = μ (seule hypothèse : E[Xᵢ] = μ) ; Var(X̄) = σ²/n (indépendance : covariances nulles ; même loi : chaque variance σ²) ; écart-type σ/√n (n5).
- Vignette v3 : n dés lancés, chaque clic produit une réalisation x̄ posée en pastille ; μ = 3,5 fixe ; boutons n = 4 (trois réalisations initiales 3,25 ; 4,5 ; 2,75), n = 1, n = 16 ; écart-type des x̄ contre σ/√n (1,708 ; 0,854 ; 0,427).
- Figure 2 : matrice de covariance 6 × 6, Var(X̄) = somme des 36 cases / 36 (σ² = 1) : i.i.d. 6/36 = 0,167 ; indépendantes de variances (1, 1, 1, 1, 1, 4) : 9/36 = 0,25 ; même loi, ρ = 0,5 : 21/36 = 0,583 ; copies : 36/36 = 1.
- Exemples : n = 1 ; dé n = 4 : 3,5, 0,729, 0,854 ; un dé recopié quatre fois : E = 3,5, Var = 2,917 ; Bernoulli : X̄ = proportion, E = p, Var = p(1 − p)/n ; ML : l'accuracy est une moyenne d'indicatrices.
- Preuve (OUTIL) : E par linéarité ligne à ligne ; Var : Var(Σ) = Σ Var + Σ_{i≠j} Cov (l09 n2), puis chaque ligne nomme la moitié d'i.i.d. qui sert, puis Var(aY) = a² Var Y avec a = 1/n (l08 n9).
- Code : 100 000 répétitions de 4 dés, indépendants contre recopiés.
- Où ça casse : x̄ / X̄ / μ confondus ; Var(X) ne diminue pas, Var(X̄) oui ; dépendance (n6) ; lois différentes : Σ σᵢ²/n² ; σ² infinie (n4).
- Brunton dit / c'est : (35) « E[X̄] = μ puisque les X sont indépendants » → linéarité seule ; l'indépendance ne sert qu'à la variance.
- Ce qu'on garde : pour X̄ = (1/n) Σ Xᵢ, E[X̄] = μ par linéarité, sans hypothèse ; Var(X̄) = σ²/n parce que l'indépendance annule les covariances, que la même loi donne σ² à chaque terme, et que 1/n sort au carré.

### n4 · Loi des grands nombres : la moyenne converge, la somme s'écarte — OUTIL — Brunton 35 (image : 01, 36)
- Idée : 30 mesures de la vitesse de la lumière, chacune bruitée ; leur moyenne se rapproche de la vraie valeur. La moyenne converge parce que sa variance σ²/n tend vers 0 ; la somme Sₙ − nμ, elle, a un écart-type σ√n qui grandit : rien ne se compense, c'est la division par n qui écrase. 1 000 dés : 0,054 contre 54,0.
- Formule : P(|X̄ₙ − μ| ≥ ε) ≤ σ²/(nε²) → 0 pour tout ε > 0 (loi faible, convergence en probabilité). Hypothèses : σ² finie pour la preuve par Chebyshev (la LGN tient avec une espérance finie seulement, preuve hors leçon) ; indépendance (non-corrélation suffit) ; même μ.
- Vignette v4 : mesures simulées (bruit d'écart-type 100 km/s, choisi pour l'illustration) et leur moyenne courante, bande ±2σ/√n (36,5 km/s à n = 30, 11,5 à n = 300) ; bouton erreurs de Cauchy : la moyenne de n erreurs de Cauchy a la loi d'une seule, elle ne se pose jamais.
- Figure 3 (existante, p00-04 figure 2) : un chemin de 1 000 dés, moyenne cumulée dans ±2σ/√n, somme − 3,5n dans ±2σ√n.
- Exemples : n = 100 dés, ε = 0,5 : borne 0,117 contre 0,0036 exact (≥) ; 1 000 dés : 0,054 contre 54,0 ; pièce : n = 100, proportion 0,05, nombre de piles 5 ; n = 10 000 : 0,005 et 50 ; une fréquence est une moyenne d'indicatrices, elle converge vers la probabilité (le « à peu près » de l08 n1).
- Preuve : Chebyshev appliqué à X̄ (centre μ, variance σ²/n) ; Var(Sₙ − nμ) = nσ².
- Code : 2 000 chemins de 1 000 dés, écart-type de la moyenne et de la somme à n = 10, 100, 1 000 ; une moyenne de Cauchy.
- Où ça casse : Cauchy (la moyenne de n Cauchy a la loi d'une seule) ; dépendance : corrélation commune ρ > 0, plancher (n6) ; corrélation qui s'éteint avec l'écart (série stationnaire), convergence plus lente que σ/√n ; « les tirages se compensent » (erreur du joueur) ; la LGN ne dit pas à quelle vitesse ni quelle forme (n5, l11).
- Brunton dit / c'est : (35) « cette somme » converge vers une gaussienne « avec cette moyenne et l'écart-type » → Sₙ ne converge vers aucune loi (centre nμ et écart-type σ√n grandissent) ; c'est (Sₙ − nμ)/(σ√n) qui converge vers N(0, 1), et Sₙ ≈ N(nμ, nσ²) n'est qu'une approximation à n fixé (l11 n3) ; (34) annonce « le TCL » en décrivant la LGN ; (33) « additionner des lois de probabilité » → additionner des variables aléatoires i.i.d.
- Ce qu'on garde : pour des Xᵢ indépendantes de même moyenne μ et de variance σ² finie, P(|X̄ₙ − μ| ≥ ε) ≤ σ²/(nε²) → 0, parce que Var(X̄) → 0 et non par compensation : la somme s'écarte de nμ en σ√n.

### n5 · Erreur standard σ/√n : diviser la largeur par 2 coûte 4 fois plus de données — OUTIL — Brunton 35
- Idée : l'écart-type de X̄ s'appelle l'erreur standard (SE), pour le distinguer de σ, celui des mesures. La racine rend la précision chère. Accuracy p = 0,9 sur 1 000 exemples : SE = √(0,9 × 0,1/1 000) = 0,0095, ±1,86 point à 95 % ; ±0,93 point demande 4 000 exemples.
- Formule : SE = σ/√n ; SE(k²n) = SE(n)/k ; n requis pour un SE visé s : (σ/s)² ; proportion : √(p(1 − p)/n). Hypothèses : celles de n3 ; σ (ou p) inconnu en pratique, remplacé par une estimation (p01-01) ; le ±1,96 vient de la forme normale (l11).
- Vignette v5 : carré de cellules de 250 exemples (1, 4, 16, 64 : le côté double, l'aire quadruple) et intervalles ±1,96 SE : 3,72 ; 1,86 ; 0,93 ; 0,46 points.
- Exemples : dé 1,708 ; 0,854 ; 0,342 ; 0,171 (n = 1, 4, 25, 100) ; n requis : 12, 292, 1 167, 29 167 pour SE 0,5 ; 0,1 ; 0,05 ; 0,01 ; sondage p = ½, n = 1 000 : ±3,1 points ; accuracy.
- Code : SE simulé de l'accuracy sur 20 000 jeux de test, n = 1 000 et 4 000.
- Où ça casse : σ contre SE ; exemples de test dépendants (n6) ; σ estimé à petit n (Student, p01-03) ; p proche de 0 ou 1 (l11) ; rendements décroissants.
- Ce qu'on garde : SE = σ/√n, l'écart-type de X̄ et non des mesures : diviser l'incertitude par k demande k² fois plus de données.

### n6 · Moyenne de termes corrélés : ρσ² + (1 − ρ)σ²/n — OUTIL — Brunton 35 prolongé (l09)
- Idée : un instrument mal calibré ajoute la même erreur C à toutes les mesures : Xᵢ = μ + C + Eᵢ. Moyenner efface les Eᵢ, jamais C. Le chiffre d'abord : σ² = 1, ρ = 0,5, la moitié commune reste, l'autre se divise par n : 0,5 + 0,5/10 = 0,55, 0,505 à n = 100, plancher 0,5 ; puis la formule Var(X̄) = ρσ² + (1 − ρ)σ²/n.
- Formule : Var(X̄) = (1/n²)[nσ² + n(n − 1)ρσ²] = ρσ² + (1 − ρ)σ²/n → ρσ² ; n_eff = n/(1 + (n − 1)ρ) → 1/ρ. Hypothèses : même variance, même corrélation ρ pour toutes les paires (sinon ρ̄, exact) ; ρ ≥ −1/(n − 1).
- Vignette v6 : Var(X̄)/σ² contre n (échelle log, 1 à 1 000), courbe ρ = 0 et courbe ρ, plancher ; barre empilée part commune / part propre ; curseurs ρ et n.
- Exemples : ρ = 0 ; ρ = 1 ; σ² = 1, ρ = 0,5 : 0,55 ; 0,505 ; n_eff ≤ 2 ; dé, ρ = 0,05 : SE plafonne à 0,382, contre 0,017 à n = 10 000 sous indépendance (facteur 22,4), n_eff ≈ 20 ; 1 000 lignes = 50 utilisateurs × 20, ρ = 0,2 : n_eff = 208, SE × 2,19 (b04).
- Preuve : compter les cases de la matrice (n σ², n(n − 1) ρσ²) ; seconde preuve par le bruit commun.
- Code : la construction μ + C + Eᵢ, plancher simulé.
- Où ça casse : le centre ne bouge pas ; lignes d'un même utilisateur, séries temporelles, plis de validation croisée, arbres d'une forêt ; ρ négatif borné ; ρ rarement mesurable ; bootstrap de lignes.
- Ce qu'on garde : n termes de variance σ² et de corrélation ρ : Var(X̄) = ρσ² + (1 − ρ)σ²/n → ρσ² ; moyenner n'efface que la part non partagée, au plus 1/ρ termes indépendants.

### n7 · Monte Carlo : une espérance est une moyenne qu'on simule — CULTURE — Brunton 35
- Idée : Brunton : la LGN est « la base de l'échantillonnage Monte Carlo ». Pour calculer E[g(X)], tirer N valeurs et moyenner g. Fléchettes dans le carré unité : la part dans le quart de disque estime π/4 = 0,785 ; SE sur π à N = 1 000 : 0,052.
- Formule : E[g(X)] ≈ (1/N) Σ g(xᵢ), SE = σ_g/√N. Hypothèses : savoir tirer selon la loi de X ; Var(g(X)) finie ; tirages indépendants.
- Vignette v7 : fléchettes, estimation courante de π, bande ±2 SE.
- Exemples : π ; une probabilité est l'espérance d'une indicatrice (deux dés, somme ≥ 10 : 1/6) ; E[e^Z] = e^0,5 = 1,649 ≠ e^E[Z] = 1 ; ML : perte moyenne sur un jeu de test, gradient de mini-batch.
- Code : π à N = 10², 10⁴, 10⁶ ; E[e^Z].
- Où ça casse : 1/√N lent ; événement rare (p = 10⁻⁴, N = 10⁴ : un succès attendu, SE relatif 100 %) ; tirages dépendants (MCMC, n6) ; variance infinie.
- Ce qu'on garde (pas de carte) : une espérance est une moyenne qu'on peut simuler ; la LGN garantit la convergence, σ_g/√N en donne la vitesse, quelle que soit la dimension.

## Figures exigées
- v1 (n1) — `plot` : règle sur pivot en 10, masse p en 20, contrepoids calculé, bascule au-delà de p = 0,5 ; curseur p ; readouts masse, position du contrepoids, moyenne, borne.
- Figure 1 (n1) — `plot` : survie P(X ≥ a) de trois lois de moyenne 10 et hyperbole 10/a ; boutons de loi, curseur a ; readouts P(X ≥ a), borne, rapport.
- v2 (n2) — `plot` : loi standardisée (normale, dé, trois points), queues hors de ±kσ en rouge ; curseur k ; readouts part hors, borne 1/k².
- v3 (n3) — `plot` : dés lancés et pile des réalisations x̄ ; boutons n = 4, 1, 16, refaire, 100 fois ; readouts μ, dernière x̄, nombre, écart-type mesuré contre σ/√n.
- Figure 2 (n3) — `plot` : matrice de covariance 6 × 6, quatre boutons ; readouts diagonale, hors diagonale, Var(X̄), la moitié d'i.i.d. qui tombe.
- v4 (n4) — `plot` : mesures et moyenne courante, bande ±2σ/√n ; boutons erreurs normales / Cauchy, « 270 de plus », nouvelle série.
- Figure 3 (n4) — `plot` × 2 : moyenne cumulée et somme − 3,5n de 1 000 dés, bandes ±2σ/√n et ±2σ√n ; bouton nouveau chemin (graine fixe au départ).
- v5 (n5) — SVG + `plot` : carré de cellules et intervalles ±1,96 SE ; boutons n = 250, 1 000, 4 000, 16 000.
- v6 (n6) — `plot` + SVG : Var(X̄)/σ² contre log n, barre empilée ; curseurs ρ, n.
- v7 (n7) — `plot` × 2 : fléchettes et estimation de π contre N ; boutons + 100, 5 000, nouvelle graine.

## Résumé
1. Markov (X ≥ 0) : P(X ≥ a) ≤ E[X]/a ; atteinte par la loi {0, a}.
2. Chebyshev : P(|X − μ| ≥ kσ) ≤ 1/k², toute loi de variance finie : 25 % à 2σ, contre 4,6 % pour une normale.
3. X̄ est une variable aléatoire ; x̄ sa réalisation ; μ un nombre fixe.
4. E[X̄] = μ par linéarité seule ; Var(X̄) = σ²/n : indépendance → covariances nulles, même loi → chaque variance σ².
5. LGN : P(|X̄ − μ| ≥ ε) ≤ σ²/(nε²) → 0 ; la somme s'écarte en σ√n.
6. SE = σ/√n : ÷2 sur la largeur coûte ×4 sur n ; accuracy : √(p(1 − p)/n).
7. Termes de corrélation commune ρ : ρσ² + (1 − ρ)σ²/n → ρσ², au plus 1/ρ termes indépendants.
8. Monte Carlo : une espérance se simule par une moyenne, d'erreur σ_g/√N.

Phrase d'entretien : « La moyenne de n observations est une variable aléatoire, centrée sur μ par la seule linéarité, de variance σ²/n parce que l'indépendance annule les covariances et que la même loi donne σ² à chaque terme. Chebyshev transforme cette variance qui tend vers zéro en convergence : c'est la loi des grands nombres. L'erreur standard σ/√n coûte cher, diviser l'incertitude par deux demande quatre fois plus de données, et si les termes partagent une même corrélation ρ elle plafonne à σ√ρ. »

## Chaîne verbalisée
1. Pourquoi Markov exige-t-il X ≥ 0 ? → Sinon un contrepoids négatif équilibre n'importe quelle masse à droite : {−30, 20} avec P(20) = 0,8 a une moyenne de 10.
2. Chebyshev à 2σ : combien au plus, et pour une normale ? → 25 % ; 4,6 %.
3. μ, X̄, x̄ : lequel est aléatoire ? → X̄ ; x̄ est sa réalisation, μ un nombre fixe.
4. E[X̄] et Var(X̄), et quelle hypothèse sert à chaque ligne ? → μ par linéarité ; σ²/n : indépendance (covariances nulles), même loi (σ² partout), 1/n au carré.
5. Pourquoi la moyenne converge-t-elle, et que fait la somme ? → Var(X̄) → 0 et Chebyshev ; la somme s'écarte en σ√n.
6. SE d'1 point sur 1 000 exemples : combien pour ½ point ? → 4 000.
7. Moyenne de termes de corrélation ρ, n → ∞ ? → ρσ² ; au plus 1/ρ termes indépendants.

## Ce qui a cassé pour Salah
- 18/09 : i.i.d. traité comme une seule hypothèse. Adressé en n3 : la formule liste le rôle de chaque moitié, la preuve nomme à chaque ligne la moitié qui sert, la figure 2 retire une moitié à la fois (variances inégales : 0,25 au lieu de 0,167 ; corrélées : 0,583), et l'encadré Brunton (35) sépare linéarité et variance.
- 18/09 : la réalisation x̄ prise pour la variable X̄ et pour le paramètre μ. Adressé par l'idée de n3 (trois objets, trois fois quatre dés), la vignette v3 (μ fixe, chaque clic une réalisation) et le premier point de son « où ça casse », avec le lien vers l04 n1.
- Promesses de l08 tenues : le « à peu près » de l08 n1 (n4, exemple 4) ; la moyenne de Cauchy qui ne se stabilise pas (v4, bouton Cauchy, et code c4) ; « ce qui se réduit est la variance de X̄, pas celle de X » (n3 où ça casse, n5).

## Erreurs de Brunton couvertes
33 Markov illustré par une normale ; « non négative, donc positive » → n1 · 34 Markov appliqué à (X − μ)² sans dire que c'est ≥ 0 → n2 · 35 E[X̄] = μ « grâce à l'indépendance » → n3 · 35 « cette somme converge vers une gaussienne » ; 34 « TCL » pour la LGN ; 33 « additionner des lois » → n4.

## Exclusions
Pas de TCL ni de ±1,96 justifié (l11), pas de loi forte ni de convergence presque sûre, pas de preuve de la LGN sous espérance finie seule (Khintchine nommé, pas démontré), pas de Bessel (p01-03), pas de MCMC au-delà de son nom, pas de Cantelli au-delà d'une ligne.

## Questions pour la revue
- Chiffres recalculés (`WORK/l10/check/chk_all.py`, `chk_extra.py`). Un écart à p00-04 : la chaîne donne P(|X̄ − 3,5| > 0,5) = 0,0030 (inégalité stricte) ; la leçon écrit Chebyshev avec ≥, donc la valeur exacte citée est P(|X̄ − 3,5| ≥ 0,5) = 0,0036 (sommes 300 et 400 comprises) ; la borne 0,117 est la même, le facteur passe de 39 à 32.
- L'image de la vitesse de la lumière est dans Brunton 01 et 36, pas 35 ; elle illustre ici la LGN, comme le demandait le plan. Le bruit de 100 km/s des mesures simulées est un choix d'illustration, la légende le dit.
- n6 n'a pas de vidéo propre : la formule vient de l09 et du pont b04 ; p.src le dit (« Brunton 35, prolongé »). Le code de n6 n'était pas exigé par le plan (P seulement) : ajouté parce qu'il montre le plancher sur des tirages, ce que la formule seule ne fait pas voir.
- Correspondance des pas de p00-04 : s1 → n3 ; s2 → n3 ; s3 → n3 (et n5 pour le nom SE) ; s4 → n5 ; s5 → n4 ; s6, s7 → l11 ; s8 → n6 (dépendance), n4 (variance infinie, Cauchy), l11 (événements rares, « n ≥ 30 »).
- Choix visuels faits en autonomie : les graines des vignettes sont fixées pour que l'état initial soit typique (figure 3 : graine 1, somme − 3 500 = −56 ; v7 : 1 000 fléchettes au départ, estimation 3,164, à 0,4 SE ; v4 Cauchy : une série qui semble se poser puis saute vers −240 km/s). v3 passe des pastilles aux barres quand la pile dépasse 34 réalisations par classe. Les titres de vignette évitent les lettres grecques (la capitale de μ s'affiche « M »).
- Ajouts hors plan, tous vérifiés : la loi à trois points qui atteint Chebyshev, la ligne Cantelli (1/(1 + k²), loi ⅕ / ⅘ vérifiée en fractions), la perte d'entropie croisée pour Markov, l'alerte à 3σ pour Chebyshev, le sondage à ±3,1 points.
- Validateur final (`--render`) : 0 FAIL, 0 WARN, une fois `lesson-00-11-tcl.html` produite en parallèle (avant elle : 6 WARN de lien absent). 0 erreur JS, pas de débordement à 390 px.
- Relecture en contexte frais (10/10/2026), appliquée :
  - Figure 3, légende : « le chemin y est piégé » et « en bas ça ne revient pas se poser sur 0 » remplacés ; les deux bandes décrivent le même événement, 53 % seulement des chemins restent dans la bande de n = 4 à 1 000, 49 % recoupent 0 après n = 500, médiane |S − 3 500| = 36 à n = 1 000 (20 000 chemins, `check/chk_review.py`), et la graine 5 finit à −111.
  - Encadré Brunton de n4 : la citation suit la transcription (« avec cette moyenne et l'écart-type »), Sₙ ne converge vers aucune loi, la version standardisée converge, Sₙ ≈ N(nμ, nσ²) est une approximation à n fixé (lien l11 n3).
  - n4, « Dépendance » : restreint à une corrélation commune ρ > 0 ; une corrélation qui s'éteint (AR(1)) laisse converger X̄, plus lentement (n Var(X̄) = 3,04 et 2,99 contre (1 + φ)/(1 − φ) = 3 pour φ = 0,5) ; la phrase d'entretien et le résumé disent « une même corrélation ρ ».
  - n4, formule : « sans espérance rien ne converge » remplacé par le cas de Cauchy seul (la loi faible peut tenir sans espérance, condition de Feller : accepté comme théorème, non simulé) ; la légende de v4 ne dit plus « car pas d'espérance ».
  - Gardes de n3, n4, n5 recadrés et réduits à une idée, 40 mots au plus (en comptant X<sub>i</sub> comme un mot).
  - v1 : étiquette « il faudrait x = … » ancrée au bord gauche quand le contrepoids sort du cadre (p ≥ 0,67), avec halo.
  - v6 : axe des y monté à 1,12 pour que ρ ≥ 0,95 ne barre plus le titre d'axe.
  - v2 : « < 0,1 % » au lieu de « 0 % » pour la normale à k ≥ 3,5 (0,047 % et 0,0063 %, recalculés).
  - v5 : « points » au pluriel à partir de 2.
  - v7 : « reste dans la bande, qui se resserre ».
  - Figure 3 : étiquette 3,5 retirée de l'axe du haut ; v3 inchangée, ses graduations restant lisibles.
  - n3 : « i.i.d. (indépendantes et de même loi) » au premier usage ; n3 « où ça casse » sépare variance infinie (Pareto) et absence d'espérance (Cauchy).
  - n1 : « Brunton énonce l'inégalité, puis la fait sentir sur un exemple ».
  - n6 : le chiffre 0,5 + 0,5/10 = 0,55 vient avant la formule.
  - Langue : « Passé un certain stade », « Compter les cases utilisateur par utilisateur », « surveillance en production » ; gras décoratif retiré des idées (n1, n2, n4).
  - Règles transversales : « taux de bonnes réponses (accuracy) » et « jeu de test (test set) » au premier usage, « variables explicatives (features) » en n6 ; légendes de v6 et v7 en « second panneau » ; aucun chapeau combinant ; aucun <b> dans le corps des encadrés Brunton.
  - Rejet : aucun ; chaque chiffre proposé a été vérifié.
