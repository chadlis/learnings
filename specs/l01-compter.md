---
id: l01
series: lesson
part: "00"
number: "01"
slug: compter
title: Compter — la probabilité comme dénombrement
subtitle: socle — Brunton 01 à 03 : P = cas favorables sur cas possibles, les quatre façons de compter
prereq: []
anki: [stats::denombrement]
bridges: []
next: l02
status: built
---

## Question de la leçon
Quand toutes les issues ont la même chance, une probabilité est un rapport de deux comptes : comment compter sans énumérer, et quelle formule choisir selon que l'ordre compte et qu'on remet ou non ?

## Vidéos couvertes
01 Probability and Statistics: Overview · 02 Gentle Introduction to Probability: Counting Coin Flips and Dice · 03 Counting Probabilities with Combinatorics and the Factorial. Le début de 04 (Set Theory) sert de transition : Ω y est formalisé, ce que fait l02.

## Prérequis
Aucun. Le bloc prérequis dit ce qu'il faut d'arithmétique : fractions et pourcentages (11/36 ≈ 0,306), puissances (2¹⁰ = 1 024), lire un produit de facteurs. Le code utilise `itertools`, `math.comb`, `math.perm` et numpy ; il est facultatif.

## Notions

### n1 · Le cadre : déterministe mais imprévisible ; probabilité et statistique duales — CULTURE — Brunton 01 (et fin de 02)
- Idée : la pièce obéit à F = ma, mais elle est imprévisible « pour moi », avec l'information que j'ai ; c'est ce qui justifie un modèle probabiliste. Probabilité : le modèle est connu (θ = P(pile) = ½), les données ne le sont pas : P(7 piles sur 10) = 120/1024 = 0,117. Statistique : les données sont là (10 piles sur 10, la question de Brunton 02), le modèle ne l'est pas : la pièce est-elle honnête ? Problèmes duaux.
- Formule : les deux écritures. Fréquentiste : θ fixe et inconnu, p(x ; θ), on ne parle pas de « probabilité de θ ». Bayésien : θ est une variable aléatoire munie d'une loi a priori, p(x ∣ θ) est un vrai conditionnement et p(θ ∣ x) a un sens. La barre ∣ est réservée au conditionnement sur un événement ou une variable aléatoire. Exemple mixte (p02-01) : p(y ∣ x ; θ).
- Vignette v1 : le même nombre p(k ; θ) lu dans les deux sens. À gauche, θ fixé, barres de p(k ; θ) pour k = 0…10 ; à droite, k fixé, courbe θ ↦ p(k ; θ). Curseurs θ et k, bouton « lancer 10 pièces » qui tire une séquence avec le θ courant et pose son k. État initial θ = ½, k = 7 : 0,117 des deux côtés, la courbe culmine en θ = 0,7 (0,267). Avec k = 10, p(10 ; ½) = 1/1024 ≈ 0,001.
- Exemples : P(7 piles sur 10) = 120/1024 = 0,117 ; 10 piles sur 10 : p(10 piles ; ½) = 1/1024, qui n'est pas « la probabilité que la pièce soit honnête » ; les questions d'appel de Brunton 01 : trois dés de somme 13 = 21/216 = 0,097, nombre de mains de poker C(52, 5) = 2 598 960 ; ML : les poids d'un réseau sont un θ, l'apprentissage est un problème de statistique (Brunton 01).
- Pas de preuve, pas de code (plan : —).
- Où ça casse : écrire p(x ∣ θ) en fréquentiste (scorie de Salah) ; « 95 % sûr que le médicament marche » ; le hasard dépend de l'information (classifieur de Brunton qui prédirait la pièce en l'air ; désintégration radioactive, vraiment aléatoire).
- Brunton dit / c'est : (01) « la statistique, c'est P(θ ∣ données) », « je suis confiant à 95 % que ce médicament marche, ou ne marche pas » (dans un test d'hypothèse) → cadrage bayésien seulement ; en fréquentiste θ est fixe, on écrit p(x ; θ) et la vraisemblance L(θ ; x) ; un test au seuil de 5 % conclut à tort à un effet dans 5 % des essais quand le médicament ne fait rien : le 95 % porte sur la procédure (p01-02 pas 5). Il écrit aussi P(X = v ∣ θ) pour les données : en fréquentiste p(x ; θ). (01) TCL « la moyenne de variables de même loi devient normale » → il faut aussi l'indépendance et une variance finie (l11 n1).
- Ce qu'on garde (pas de carte) : probabilité, θ connu → données ; statistique, données → θ ; en fréquentiste θ est fixe et suit un point-virgule, la barre conditionne.

### n2 · P(A) = #A / #Ω quand les issues sont équiprobables — OUTIL — Brunton 02
- Idée : lister Ω, tout ce qui peut arriver, puis les cas de A. Deux pièces : Ω = {PP, PF, FP, FF}, au moins un pile 3/4, aucun pile 1/4. Deux dés : 6 × 6 = 36 couples, au moins un 5 : 11, P = 11/36 = 0,306, « un peu moins d'une chance sur trois ».
- Formule : P(A) = #A/#Ω. Hypothèses : Ω fini ; issues équiprobables (pièce honnête, dé équilibré, lancers indépendants, Brunton les énonce) ; A ⊆ Ω.
- Vignette v2 : grille de Ω (2 × 2 pour deux pièces, 6 × 6 pour deux dés), boutons d'événement (au moins un pile, aucun pile, au moins un 5, somme = 7), cases de A colorées, readout #A, #Ω, P ; bouton « lancer 1 000 fois » : un point par lancer dans sa case, chaque case en reçoit à peu près autant (c'est l'équiprobabilité), la fréquence de A approche le rapport.
- Figure 1 : l'hypothèse se voit. Cases de largeur P(D₁ = i) et de hauteur P(D₂ = j) ; curseur « P(5) sur chaque dé » de 1/6 à 0,5. Compter les cases donne toujours 11/36 ; l'aire de A vaut 1 − (1 − q)², 0,306 à q = 1/6 et 0,75 à q = 0,5.
- Exemples : deux pièces 3/4 et 1/4 ; deux dés au moins un 5 par énumération (11/36), par raisonnement (1/6 + 5/6 · 1/6, la méthode 3 de Brunton, qui anticipe la règle de multiplication de l03), par complément 1 − 25/36 (l02 n2) ; somme 7 : 6/36 = 1/6 ; trois dés somme 13 : 21/216.
- Code (c1) : énumération itertools (11 sur 36) et 100 000 lancers simulés (fréquence ≈ 0,306).
- Où ça casse : dé pipé (figure 1) ; paires non ordonnées comptées comme issues (6/21 = 0,286 au lieu de 11/36), même piège que d'Alembert (« Croix ou pile », 1754 : trois issues de probabilités 1/2, 1/4, 1/4 comptées égales, 2/3 au lieu de 3/4) ; Ω infini : aucune loi uniforme sur un Ω infini dénombrable, et sur un intervalle chaque issue a la probabilité 0 ; le rang du premier pile demande une loi discrète (l05 n2), l'attente d'un mail une densité (l05 n3) ; « au moins un » souvent plus simple par le complément.
- Ce qu'on garde : si les issues de Ω sont équiprobables, P(A) = #A/#Ω ; deux dés, au moins un 5 : 11/36.

### n3 · Principe multiplicatif et arbre de choix — OUTIL — Brunton 02 (arbre des deux dés), 03 (2¹⁰)
- Idée : l'arbre de Brunton : 6 branches pour le premier dé, chacune se divise en 6, 36 feuilles. Un choix en étapes : k₁ options, puis k₂ quel que soit le premier choix, donne k₁ × k₂ feuilles. 10 pièces : 2¹⁰ = 1 024.
- Formule : k₁ × k₂ × … × kᵣ. Hypothèses : le nombre d'options de chaque étape ne dépend pas des choix précédents (les options elles-mêmes peuvent en dépendre) ; chaque feuille est un résultat distinct, et chaque résultat a une seule feuille.
- Vignette v3 : l'arbre pour 1 à 4 pièces et pour deux dés, un chemin tiré au hasard surligné (PFP au départ), readout du nombre de feuilles.
- Exemples : 2, 3 pièces (4, 8) ; deux dés 36 ; plaque 4 lettres puis 2 chiffres : 26⁴ × 10² = 45 697 600 ; ML : grille d'hyperparamètres 4 taux × 3 tailles de batch × 5 profondeurs = 60 entraînements, un quatrième hyperparamètre à 5 valeurs : 300.
- Preuve : récurrence sur les étapes : chacune des k₁ branches porte un sous-arbre de k₂ × … × kᵣ feuilles.
- Où ça casse : nombre d'options qui dépend du chemin (second dé strictement plus grand que le premier : 5 + 4 + 3 + 2 + 1 + 0 = 15, pas 6 × 5) ; double comptage quand deux chemins donnent le même résultat (choisir « un premier puis un second » compte chaque paire deux fois, n5) ; 1 000 pièces : 2¹⁰⁰⁰ ≈ 10³⁰¹, on ne dessine plus, on multiplie.
- Ce qu'on garde : r étapes à kᵢ options quels que soient les choix précédents, deux suites de choix distinctes donnant deux résultats distincts : k₁ × k₂ × … × kᵣ résultats.

### n4 · Ordonné : avec remise nʳ, sans remise n!/(n − r)! — OUTIL — Brunton 03
- Idée : une séquence, l'ordre compte. Pièce : « une pièce neuve à chaque fois », avec remise : 2¹⁰. Cinq cartes distribuées du dessus du paquet : 52 × 51 × 50 × 49 × 48 = 311 875 200, le réservoir rétrécit : sans remise. Notation 52!/47!.
- Formule : nʳ (avec remise) ; n!/(n − r)! = n(n − 1)…(n − r + 1) (sans remise, r ≤ n). n! = n(n − 1)…2 · 1, 0! = 1. Hypothèses : n objets distincts, r tirages, l'ordre distingue les résultats.
- Vignette v4 : le paquet en grille 13 × 4 et cinq cases 52 · 51 · 50 · 49 · 48 ; « distribuer » tire cinq cartes (graine fixe), chaque carte sortie se vide dans le paquet ; « avec remise » la remet et les cinq cases valent 52. Readouts : 311 875 200 contre 52⁵ = 380 204 032, rapport 0,820.
- Figure 2 : rapport [n!/(n − r)!]/nʳ = P(r tirages avec remise tous différents) en fonction de r, boutons n = 6, 26, 52, 365, curseur r. Repères : n = 26, r = 4 : 358 800/456 976 = 0,785 (le devoir de Brunton) ; n = 365, r = 23 : 0,493 (les anniversaires de l02 n4).
- Exemples : 2¹⁰ = 1 024 ; 52!/47! = 311 875 200 ; 52⁵ = 380 204 032 ; plaques 45 697 600, sans répétition 26 × 25 × 24 × 23 × 10 × 9 = 32 292 000, P(4 lettres distinctes) = 0,785 ; podium de 8 coureurs : 336 ; 52! ≈ 8,07 × 10⁶⁷ ordres du paquet ; ML : séquences de L tokens sur un vocabulaire de V = 50 257 (GPT-2) : V³ ≈ 1,27 × 10¹⁴, V¹⁰²⁴ ≈ 10⁴⁸¹⁴.
- Preuve : principe multiplicatif avec n options à chaque étape, puis n, n − 1, …, n − r + 1 ; simplification de 52!/47!.
- Code (c2) : itertools.product et permutations pour n = 5, r = 3 (125, 60), math.perm(52, 5), et le piège np.prod(np.arange(1, 22)) qui déborde en int64 sans prévenir.
- Où ça casse : r > n sans remise : 0 ; objets identiques (anagrammes, l02 n7) ; débordement d'entiers ; avec remise ne veut pas dire « tirages indépendants » dans tous les modèles, ici si.
- Brunton dit / c'est : (03) lapsus oral « 52 × 51 × 50 × 48 × 49 × 48 » → 52 × 51 × 50 × 49 × 48, cinq facteurs.
- Ce qu'on garde : r tirages ordonnés parmi n objets distincts : nʳ avec remise, n!/(n − r)! sans remise.

### n5 · Non ordonné sans remise : C(n, r), diviser par r! — OUTIL — Brunton 03
- Idée : une main de poker {R, D, 2, 3, 7} = {R, 2, D, 7, 3}. Chaque main correspond à 5! = 120 séquences, donc 311 875 200/120 = 2 598 960 mains. « Ralentis et réfléchis à ça » (Brunton).
- Formule : C(n, r) = n!/(r!(n − r)!). Hypothèses : n objets distincts, r ≤ n, sans remise, ordre indifférent. Symétrie C(n, r) = C(n, n − r).
- Vignette v5 : 3 cartes parmi 5 (A, R, D, V, 10) : 60 séquences en grille 10 × 6 ; « rangées par main » met les 6 ordres d'une même main sur une ligne ; « ordre de distribution » les disperse ; « main suivante » surligne les 6 séquences d'une main. 60/6 = 10.
- Figure 3 : les 1 024 séquences de 10 lancers rangées par nombre de piles, barres C(10, k) = 1, 10, 45, 120, 210, 252, …; curseur k, boutons « au moins k » / « exactement k ». Au moins 5 : 638/1024 = 0,623 (Brunton 03) ; exactement 7 : 120/1024 = 0,117 (n1).
- Exemples : 3 parmi 5 = 10 ; poker 2 598 960 ; C(10, 7) = 120 ; au moins 5 piles sur 10 : 638/1024 = 0,623 ; carré : 13 × 48 = 624 mains, 1 sur 4 165 ; quinte flush (royale comprise) : 40 mains, 1,5 × 10⁻⁵ ; loto 6 parmi 49 : 13 983 816 ; ML : 5 variables explicatives (features) parmi 20 : 15 504 entraînements pour une recherche exhaustive, 2²⁰ = 1 048 576 toutes tailles confondues, donc jamais de recherche exhaustive ; la forêt aléatoire tire aussi m features parmi p à chaque nœud, mais pour décorréler ses arbres (p07-02).
- Preuve : les séquences se partagent en mains, chaque main en donne exactement r! (principe multiplicatif sur les ordres) ; donc n!/(n − r)! = C(n, r) × r!. Symétrie : garder r objets, c'est laisser les n − r autres.
- Code (c3) : énumérer les 2 598 960 mains, compter 624 carrés ; vérifier que chaque main de 3 parmi 5 donne 6 séquences.
- Brunton dit / c'est : (03) « pour chaque séquence, il y a r! mains équivalentes » → c'est l'inverse : chaque main correspond à r! séquences.
- Où ça casse : diviser par r! demande r objets distincts (avec remise, (5, 5) n'a qu'un ordre : n6, figure 4) ; mélanger un numérateur ordonné et un dénominateur non ordonné (erreur d'un facteur r!) ; C(n, r) = 0 si r > n.
- Ce qu'on garde : choisir r objets parmi n, sans ordre ni remise : C(n, r) = n!/(r!(n − r)!), car chaque main correspond à r! séquences.

### n6 · Non ordonné avec remise : C(n + r − 1, r), absent chez Brunton — CULTURE
- Idée : deux dés lancés ensemble sans les distinguer : 21 résultats, pas 18. Trois boules de glace parmi 4 parfums : chaque panier s'écrit avec 3 étoiles (les boules) et 3 barres (les séparations entre parfums) ; choisir les places des étoiles parmi 6 : C(6, 3) = 20.
- Formule : C(n + r − 1, r) = C(n + r − 1, n − 1). Hypothèses : n types distincts, r tirages avec remise, ordre indifférent (multi-ensembles).
- Vignette v6 : étoiles et barres, glaces (20 paniers) ou deux dés sans ordre (21) ; le panier courant en grand, avec les quantités par parfum, la liste complète en dessous ; « panier suivant ».
- Exemples : deux dés 21 = C(7, 2) ; glaces 20 ; trois dés sans ordre 56 = C(8, 3) ; jeu de dominos double-six : 28 = C(8, 2) ; ML : rééchantillons bootstrap distincts de 10 lignes : C(19, 10) = 92 378.
- Preuve : bijection panier ↔ suite de r étoiles et n − 1 barres ; une telle suite est fixée par les places des étoiles.
- Code (c4) : combinations_with_replacement (21) et 100 000 paires simulées : {5, 5} à 1/36, {1, 5} à 2/36.
- Où ça casse : ces issues ne sont pas équiprobables quand elles viennent de tirages indépendants : {5, 5} vaut 1/36, {1, 5} vaut 2/36 (elles le sont dans d'autres modèles, la statistique de Bose-Einstein) ; « au moins un 5 » sur les 21 paires : 6/21 = 0,286 au lieu de 11/36 = 0,306 (l'erreur de d'Alembert) ; bootstrap : le rééchantillon qui contient les 10 lignes une fois chacune a la probabilité 10!/10¹⁰ = 0,00036, celui qui répète 10 fois une ligne donnée 10⁻¹⁰.
- Brunton dit / c'est : (03) trois cas de dénombrement → il manque le quatrième, non ordonné avec remise, C(n + r − 1, r).
- Ce qu'on garde (pas de carte) : avec remise et sans ordre, C(n + r − 1, r) multi-ensembles (étoiles et barres), non équiprobables.

### n7 · Les quatre cas : quel signal donne quelle formule — OUTIL — Brunton 03
- Idée : les deux questions de Brunton sur la plaque : « l'ordre compte-t-il ? Clairement oui. » « Avec ou sans remise ? Réalistement avec. » Il en déduit la case, ordre et remise ; le calcul, un nʳ par bloc, est laissé en devoir : 26⁴ × 10² = 45 697 600. Deux questions, quatre réponses. Signaux : séquence, code, classement, plaque → l'ordre compte ; main, comité, sous-ensemble, panier → non ; on peut répéter → avec remise ; un objet sorti ne revient pas → sans.
- Formule : tableau 2 × 2 : nʳ · n!/(n − r)! · C(n + r − 1, r) · C(n, r). Hypothèses : n objets distincts, r tirages. Pour une probabilité : compter dans un modèle où les issues sont équiprobables.
- Vignette v7 : le tableau 2 × 2 en SVG, quatre cases avec formule et fonction itertools ; six scénarios (plaque, 10 pièces, podium, main de poker, 5 features parmi 20, 3 boules de glace) allument leur case, les deux réponses et le compte.
- Figure 4 : les quatre cas sur deux dés, dans la grille 6 × 6 : 36 (tout), 30 (hors diagonale), 15 (au-dessus de la diagonale), 21 (au-dessus et sur la diagonale) ; 30/2! = 15, mais 36/2! = 18 ≠ 21 : les 6 doubles n'ont qu'un ordre. En mode non ordonné avec remise, chaque case affiche sa probabilité (1/36 ou 2/36).
- Exemples : un scénario par case, rejoué (plaque, podium, poker, glaces) ; mot de passe de 8 caractères parmi 62 : 62⁸ ≈ 2,18 × 10¹⁴ ; loto 13 983 816 ; carré compté dans l'ordre : 74 880/311 875 200 = 624/2 598 960.
- Code (c5) : les quatre fonctions d'itertools sur deux dés (36, 30, 15, 21) contre les formules.
- Où ça casse : un problème peut mêler deux réservoirs (plaque : principe multiplicatif entre blocs) ; « l'ordre compte » se décide par la question, pas par les objets (« tu es l'arbitre », Brunton) ; numérateur et dénominateur dans le même modèle ; non ordonné avec remise non équiprobable ; objets identiques → multinomial (l02 n7).
- Ce qu'on garde : l'ordre compte-t-il ? remet-on ? oui-oui nʳ, oui-non n!/(n − r)!, non-non C(n, r), non-oui C(n + r − 1, r).

## Figures exigées
- Vignette v1 (n1) — deux `SL.plot` côte à côte (`.v-row`) : barres p(k ; θ) à θ fixé, courbe θ ↦ p(k ; θ) à k fixé ; curseurs θ, k ; bouton « lancer 10 pièces » (graine fixe, relance).
- Vignette v2 (n2) — `SL.plot` grille de Ω ; quatre boutons d'événement ; « lancer 1 000 fois » ; readouts #A, #Ω, P(A), fréquence.
- Figure 1 (n2) — `SL.plot` carré unité, cases d'aire P(D₁ = i) P(D₂ = j), curseur q = P(5) de 1/6 à 0,5 ; readouts compte, aire.
- Vignette v3 (n3) — `SL.plot` arbre, boutons 1 à 4 pièces et deux dés, « une séquence au hasard ».
- Vignette v4 (n4) — `SL.plot` paquet 13 × 4 et cinq cases, boutons sans / avec remise, « distribuer ».
- Figure 2 (n4) — `SL.plot` points P(tous différents) contre r, boutons n, curseur r.
- Vignette v5 (n5) — `SL.plot` grille 10 × 6 des séquences, animation de rangement, « main suivante ».
- Figure 3 (n5) — `SL.plot` barres C(10, k), curseur k, boutons au moins / exactement.
- Vignette v6 (n6) — `SL.plot` étoiles et barres, deux modes, « panier suivant ».
- Vignette v7 (n7) — `SL.plot` tableau 2 × 2, six scénarios.
- Figure 4 (n7) — `SL.plot` grille 6 × 6, quatre boutons de cas.

## Résumé
1. Probabilité : θ connu, on prédit les données ; statistique : les données sont là, on remonte à θ. En fréquentiste θ est fixe : p(x ; θ).
2. Issues équiprobables : P(A) = #A/#Ω. Deux dés, au moins un 5 : 11/36.
3. Principe multiplicatif : k₁ × k₂ × … × kᵣ, les feuilles de l'arbre.
4. Ordonné : nʳ avec remise, n!/(n − r)! sans remise.
5. Non ordonné sans remise : C(n, r) = n!/(r!(n − r)!), on divise par les r! ordres d'une main.
6. Non ordonné avec remise : C(n + r − 1, r), des issues qui ne sont pas équiprobables quand elles viennent de tirages indépendants.
7. Deux questions choisissent la formule : l'ordre compte-t-il ? remet-on ?

Phrase d'entretien : « Quand les issues sont équiprobables, une probabilité est un rapport de deux comptes. Pour compter r tirages parmi n, deux questions suffisent : l'ordre compte-t-il, remet-on ? On obtient nʳ, n!/(n − r)!, C(n, r) ou C(n + r − 1, r). Le piège : les résultats sans ordre avec remise ne sont pas équiprobables quand ils viennent de tirages indépendants, donc pour une probabilité on compte les séquences. »

## Chaîne verbalisée
1. Deux dés : probabilité d'au moins un 5 ? → 11/36 : 36 couples équiprobables, 11 contiennent un 5 (ou 1 − 25/36).
2. Combien de séquences de 10 lancers ? → 2¹⁰ = 1 024 : deux options à chacune des dix étapes.
3. Cinq cartes distribuées dans l'ordre, puis une main de poker ? → 52 × 51 × 50 × 49 × 48 = 311 875 200 ; divisé par 5! = 120 : 2 598 960.
4. Pourquoi divise-t-on par r! ? → Chaque main de r objets distincts correspond à exactement r! séquences.
5. Quelles deux questions choisissent la formule ? → L'ordre compte-t-il ? Remet-on ? → nʳ, n!/(n − r)!, C(n, r), C(n + r − 1, r).
6. Pourquoi 6/21 est-il faux pour « au moins un 5 » ? → Les 21 paires non ordonnées ne sont pas équiprobables : {5, 5} vaut 1/36, {1, 5} 2/36.
7. En fréquentiste, p(x ∣ θ) ou p(x ; θ) ? → p(x ; θ) : θ est fixe, pas une variable aléatoire ; la barre est pour le conditionnement.

## Ce qui a cassé pour Salah
- Barre bayésienne p(x ∣ θ) écrite en fréquentiste au lieu de p(x ; θ) (scorie récurrente). Adressé par n1 : la formule montre les deux écritures et quand chacune s'applique (θ fixe contre θ aléatoire), l'exemple mixte p(y ∣ x ; θ) de p02-01, la vignette v1 qui écrit p(k ; θ), le premier « où ça casse » de n1, et le maillon 7 de la chaîne verbalisée.

## Erreurs de Brunton couvertes
- 01 « la statistique, c'est P(θ ∣ données) » ; « confiant à 95 % que ce médicament marche, ou ne marche pas » → n1 (encadré).
- 01 TCL « la moyenne de variables de même loi devient normale » → n1 (encadré, renvoi l11 n1).
- 03 trois cas de dénombrement, le quatrième manque → n6 (encadré) et n7.
- 03 lapsus « 52 × 51 × 50 × 48 × 49 × 48 » → n4 (encadré).
- 03 inversion « pour chaque séquence, il y a r! mains équivalentes » → n5 (encadré).
- 01 P(X = v ∣ θ) pour la probabilité des données → n1 (premier encadré).

## Exclusions
Pas d'axiomes ni d'opérations sur les événements (l02 n1, n2), pas d'inclusion-exclusion (l02 n3), complément seulement cité (l02 n2), pas de loi binomiale (l04 n4 ; C(10, k)/2¹⁰ apparaît comme un compte), pas de triangle de Pascal (l02 n6), pas d'hypergéométrique (l02 n5), pas de coefficient multinomial (l02 n7, seulement cité pour les objets identiques), pas de probabilité conditionnelle ni d'indépendance formelle (l03), pas de formule de Stirling, pas de partitions d'un ensemble.

## Questions pour la revue
- Pile et face : Brunton compte des « heads » ; la leçon compte des piles (P) et des faces (F), comme l08 (« X = nombre de piles »). Les probabilités sont symétriques, rien ne change.
- n1 sans code ni preuve (plan : —). n6 et n7 ont un code alors que le plan n'en prévoit pas : c4 montre que les multi-ensembles ne sont pas équiprobables, ce qu'on ne voit pas sans simulation ; c5 aligne les quatre fonctions d'itertools sur les quatre cases, un repère utile en entretien. À retirer si jugés superflus.
- Encadré « Brunton, rectifié » ajouté en n4 pour un lapsus oral (absent du tableau d'errata du plan) : Salah regarde la vidéo et pourrait recopier le sixième facteur.
- L'erreur de d'Alembert (« Croix ou pile », Encyclopédie, 1754 : 2/3 pour au moins un pile en deux lancers) est citée comme exemple historique du piège des issues non équiprobables.
- Titre de n4 dans la page : « Tirer dans l'ordre, avec ou sans remise ». La table des matières lit le premier nœud texte du h3 et coupait l'exposant de nʳ ; les formules sont dans l'idée et le bloc formule.
- Ancres sortantes vérifiées le 10/10/2026 contre les leçons sœurs : l02 n1, n2, n4, n5, n7 ; l03 n2, n4 ; l04 n4 ; l05 n2, n3 ; l11 n1 (« L'énoncé exact ») existe désormais. Validateur : 0 FAIL, 0 WARN.
- Relecture en contexte frais (10/10/2026), appliquée :
  - n5 exemple 6 : la forêt aléatoire tire m features pour décorréler ses arbres, pas pour éviter la recherche exhaustive (p07-02).
  - n5 : encadré pour l'inversion orale de Brunton 03, « pour chaque séquence, r! mains » (citation vérifiée dans la transcription).
  - n1 premier encadré : citation exacte de Brunton (« confiant à 95 % … marche, ou ne marche pas », dans un test) ; la correction parle du test et renvoie à l'intervalle ; ajout de P(X = v ∣ θ), l'origine de la scorie de Salah. Une retouche à la formulation proposée : « conclut à tort à un effet » au lieu de « qu'il marche », car un test bilatéral au seuil de 5 % ne conclut à tort à un effet positif que dans 2,5 % des essais.
  - n3 « ce qu'on garde » : condition de bijection ajoutée, 37 mots (la version proposée en faisait 46 ; « les feuilles de l'arbre » retiré).
  - v1 : la séquence tirée s'efface quand on change k (testé : après un lancer à k = 7, k = 10 affiche « aucune séquence tirée »).
  - n2 « un Ω infini » : aucune loi uniforme sur un Ω infini dénombrable ; densité uniforme possible sur un intervalle, mais chaque issue y a la probabilité 0 ; renvois l05 n2 et n3.
  - v1 légende : « pour θ ≠ ½, … la loi binomiale de l04 ».
  - Résumé 6 et phrase d'entretien : « quand elles viennent de tirages indépendants ».
  - n7 idée : Brunton ne fait pas le calcul de la plaque, il le laisse en devoir.
  - Figure 2 : le trait rouge s'arrête à 0,92, sous la légende.
  - v6 : readout « van. van. choc. », sans collision avec le V du valet.
  - v3 : lettres des branches décalées de ±10 px.
  - Spec : « un quatrième hyperparamètre ».
  - Règles transversales : « variables explicatives (features) » au premier usage (n5) ; gras retiré de « déterministe » (n1) et de « quatre cas » (n7), les gras restants définissent le mot ; aucun <b> dans le corps des encadrés ; « ce qu'on garde » de n7 réduit à une idée (la règle sur les probabilités reste dans le bloc formule) ; v1 dit « le premier panneau / le second » ; la leçon n'emploie ni « jeu de test » ni « accuracy », et aucun chapeau.
  - Rejet : aucun.
