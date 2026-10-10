---
id: l03
series: lesson
part: "00"
number: "03"
slug: conditionner-bayes-independance
title: Conditionner, Bayes, indépendance
subtitle: socle — Brunton 08 à 12 : zoomer sur B, probabilités totales, inverser un conditionnement, le produit
prereq: [l02]
anki: [stats::conditionnement, stats::bayes, stats::base-rate, stats::independance, ml::metriques]
bridges: []
next: l04
status: built
---

## Question de la leçon
Que devient la probabilité de A quand on apprend que B est arrivé, comment remonter d'un test à sa cause, et quand a-t-on le droit de multiplier des probabilités ?

## Vidéos couvertes
08 Conditional Probabilities · 09 The Law of Total Probability · 10 Bayes' Theorem with Example · 11 Bayes' Theorem Example – Drug Testing · 12 Independence in Probability.

## Prérequis
- l02 n1 : Ω, événements, intersection, union, complément, événements disjoints.
- l02 n2 : axiomes (P(Ω) = 1, additivité sur des disjoints), complément P(Aᶜ) = 1 − P(A).
- (l01 n2 implicite : P(A) = #A/#Ω quand les issues sont équiprobables, pour les cartes et les dés.)

## Notions

### n1 · P(A ∣ B) : zoomer sur B — OUTIL — Brunton 08
- Idée : savoir que B est arrivé, c'est jeter tout ce qui n'est pas B et renormaliser. Cartes : P(pique) = 1/4 ; B = « la carte est noire » ; sachant « noire », il ne reste que trèfle et pique : 1/2 ; sachant « rouge » : 0. Dés : premier dé = 3 sachant second dé = 5 : 1/6, rien ne change ; sachant somme = 6 : 1/5 (l'exercice que Brunton laisse).
- Formule : P(A ∣ B) = P(A ∩ B)/P(B), si P(B) > 0. Hypothèses : P(B) > 0 (on divise) ; P(· ∣ B) est une probabilité sur B (P(B ∣ B) = 1, additivité conservée). Notation : la barre est juste ici, B est un événement ; un paramètre fixe s'écrit p(x ; θ).
- Exemples : pique sachant noire 1/2, sachant rouge 0 ; dés 1/6 et 1/5 ; étude de Brunton (1 000 personnes, 500 malades dont 450 positifs, 500 témoins dont 100 faux positifs) : P(+) = 0,55, P(+ ∣ C) = 0,90, P(− ∣ sain) = 0,80, P(C ∣ +) = 450/550 = 0,818 dans cet échantillon à 50 % de malades seulement ; pique sachant trois = 1/4 (la paire d'ouverture de Brunton est indépendante).
- Figure 1 : Venn en rectangles, curseurs position et largeur de B ; même intersection, deux dénominateurs.
- Code : 200 000 lancers de deux dés ; conditionner = filtrer puis compter.
- Où ça casse : P(A ∣ B) ≠ P(B ∣ A) (« 90 % des cas sont positifs » contre « 90 % des positifs sont des cas » : 0,90 contre 0,154 dans le dépistage à 1 %, rapport 5,85) ; P(B) = 0 ; l'échantillon cas-témoins de Brunton fixe une prévalence artificielle de 50 % ; nommer la population du dénominateur avant de calculer.
- Brunton dit / c'est : (08) P(+ ∣ malade) = 90 % est « spécifique » → c'est la sensibilité ; la spécificité vaut 400/500 = 80 % (il le corrige en 11). P(B) > 0 non dit.
- Ce qu'on garde : pour P(B) > 0, P(A ∣ B) = P(A ∩ B)/P(B) : on ne garde que les issues de B et on renormalise par P(B), pour que B pèse 1.

### n2 · Loi de multiplication — OUTIL — Brunton 09
- Idée : « so trivial » : multiplier la définition par P(B). Une image utile (Brunton ne la dessine pas), l'arbre : la probabilité d'un chemin est le produit de ses branches. Deux piques de suite sans remise : 13/52 × 12/51 = 1/17 ≈ 0,0588 ; avec remise 1/16 = 0,0625.
- Formule : P(A ∩ B) = P(A ∣ B) P(B) = P(B ∣ A) P(A) ; pour n événements, P(A₁ ∩ … ∩ Aₙ) = P(A₁) P(A₂ ∣ A₁) … P(Aₙ ∣ A₁ ∩ … ∩ Aₙ₋₁). Hypothèse : les conditionnements utilisés sont définis.
- Exemples : deux piques 1/17 ; trois piques 11/850 = 0,0129 ; étude de Brunton P(C ∩ +) = 0,5 × 0,9 = 0,45 ; dépistage P(M ∩ +) = 0,01 × 0,9 = 0,009 ; arbre complet : 1/17, 13/68, 13/68, 19/34, somme 1, et P(second pique) = 1/4 ; ML : un modèle de langage autorégressif factorise P(w₁, …, wₙ) = Π P(wₜ ∣ w₁, …, wₜ₋₁).
- Preuve (culture) : multiplier la définition ; récurrence pour n événements.
- Où ça casse : le produit simple P(A)P(B) demande l'indépendance (n7) ; P(A ∩ B) n'est pas P(A ∣ B) ; on peut conditionner dans les deux sens, choisir celui qu'on sait mesurer.
- Ce qu'on garde : pour tous événements A et B, sans hypothèse d'indépendance, P(A ∩ B) = P(A ∣ B) P(B) = P(B ∣ A) P(A) : sur un arbre, un chemin vaut le produit de ses branches.

### n3 · Probabilités totales sur une partition — OUTIL — Brunton 09
- Idée : découper Ω en morceaux disjoints qui le recouvrent, mesurer A dans chaque morceau, pondérer par le poids du morceau. Carte rouge par les quatre couleurs : 1·¼ + 1·¼ + 0·¼ + 0·¼ = ½. La partition la plus fréquente : B et Bᶜ. Dépistage : P(+) = 0,9 × 0,01 + 0,05 × 0,99 = 0,0585, la seconde voie pèse 5,5 fois la première.
- Formule : P(A) = Σ P(A ∣ Bᵢ) P(Bᵢ) pour B₁…Bₙ disjoints, d'union Ω, de probabilités > 0. Rôles : disjoints → pas de double compte ; recouvrement → aucun morceau de A oublié ; P(Bᵢ) > 0 → conditionnelles définies.
- Exemples : carte rouge ½ ; dépistage 0,0585 ; cancer de Brunton 10 : 0,99 × 0,001 + 0,01 × 0,999 = 0,01098 ; drogue de Brunton 11 : 0,18 puis 0,27 ; ML : erreur 2 % sur la classe majoritaire (95 %), 30 % sur la minoritaire (5 %) → erreur globale 0,034, pas la moyenne non pondérée 0,16.
- Preuve : A = ∪ (A ∩ Bᵢ) disjoints, axiome 3, loi de multiplication.
- Où ça casse : morceaux qui se recouvrent (rouge et cœur) ; morceau oublié ; moyenne non pondérée des conditionnelles.
- Brunton dit / c'est : (09) « c'est une autre façon de dire que quelque chose doit arriver » → c'est le recouvrement ∪ Bᵢ = Ω qui sert ; la formule décompose A sur la partition.
- Ce qu'on garde : si B₁…Bₙ partitionnent Ω, P(A) = Σ P(A ∣ Bᵢ) P(Bᵢ) : la moyenne des probabilités conditionnelles de A, pondérée par le poids de chaque morceau.

### n4 · Bayes à trois niveaux ; a priori, vraisemblance, a posteriori — OUTIL — Brunton 10
- Idée : problème inverse ; on mesure le test, on veut la cause. Cancer de Brunton : test « fiable à 99 % », prévalence 0,1 % ; sur 100 000 personnes, 100 malades dont 99 positifs, 99 900 sains dont 999 positifs ; P(malade ∣ +) = 99/1 098 = 9,0 %.
- Formule : P(B ∣ A) = P(A ∣ B) P(B)/P(A) ; dénominateur par n3 (forme moyenne, B et Bᶜ) ; forme avancée sur une partition Bⱼ. Noms : l'a priori (prior) P(B), la vraisemblance (likelihood) P(A ∣ B) (Brunton dit « update »), la normalisation P(A) (évidence), l'a posteriori (posterior) P(B ∣ A). Hypothèses : P(A) > 0 ; partition pour la forme avancée.
- Figure 2 : effectifs (portée de p00-03, figure 1), présélections Brunton 10, Brunton 11 (deux réglages), dépistage 1 %, consultation 10 % ; curseurs prévalence (log), sensibilité, spécificité.
- Exemples : cancer 11/122 = 0,0902 ; drogue 90/90 : 0,5 ; drogue 90/80 : 1/3 ; dépistage 0,9/0,95 : 2/13 = 0,154 à 1 %, 2/3 à 10 % ; test de 08 (0,9/0,8) à 1 % : 0,0435 ; filtre anti-spam : P(spam) = 0,2, « gratuit » dans 40 % des spams et 2 % des autres → 5/6 = 0,833.
- Preuve : l'intersection écrite dans les deux sens, diviser par P(A), développer P(A) par n3.
- Code : un million de personnes, prévalence 0,001, test à 99 % ; filtrer les positifs.
- Où ça casse : oublier l'a priori (réponse 99 %) ; sophisme du procureur et p-value ≠ P(H₀) (p01-02) ; prior tiré d'un échantillon cas-témoins.
- Brunton dit / c'est : (10) P(A ∣ B) « l'update » → vraisemblance ; « fiable à 99 % » suppose sensibilité = spécificité = 0,99 ; prévalence annoncée 0,001 % puis corrigée en 0,1 % ; « 91 % du temps, c'est un faux positif » → 91 % des positifs, environ 1 % des tests.
- Ce qu'on garde : pour P(A) > 0, P(B ∣ A) = P(A ∣ B) P(B)/P(A) : l'a posteriori est proportionnel à vraisemblance × a priori. Test à 99 % (sensibilité = spécificité = 0,99), maladie à 0,1 % : 9 % de malades parmi les positifs.

### n5 · En effectifs et en cotes ; deux tests successifs — OUTIL — Brunton 10, 11
- Idée : après un positif à 9 %, Brunton (10) conseille un second test, plus précis. Que vaut un second positif si ce test a les mêmes taux et des erreurs indépendantes du premier ? Effectifs : 10 000 000 personnes → 9 900 contre 99 900 après un positif, 9 801 contre 999 après deux (90,75 %). Cotes : 1:999 × 99 = 99:999, × 99 encore → 9 801:999 ; « l'a posteriori d'une expérience devient l'a priori de la suivante » (Brunton 10, la pièce).
- Formule : cote(B) = P(B)/P(Bᶜ) ; cote(B ∣ A) = cote(B) × LR, LR = P(A ∣ B)/P(A ∣ Bᶜ) ; LR⁺ = sens/(1 − spéc), LR⁻ = (1 − sens)/spéc ; p = cote/(1 + cote). Deux tests : produit des LR si les tests sont indépendants sachant l'état (et non indépendants tout court : ils dépendent tous deux de la maladie). Indépendance sachant l'état : P(T₁⁺ ∩ T₂⁺ ∣ B) = P(T₁⁺ ∣ B) P(T₂⁺ ∣ B), et de même sachant Bᶜ, la notion 7 appliquée à P(· ∣ B). Repères d'usage : LR > 10 déplace fortement la cote, entre 2 et 5 un peu, LR = 1 pas du tout.
- Figure 3 : échelle des cotes (portée de p00-03, figure 3), curseurs prévalence et LR⁺.
- Figure 4 : doubler (ou multiplier par k) la cote — kp/(1 + (k − 1)p) contre kp, curseurs k et p.
- Exemples : cancer 1:999 → 99:999 → 9 801:999 ; drogue 90/90 : 1:9 → 1:1 → 9:1 (0,5 puis 0,9) ; drogue 90/80 : LR 4,5, 1:9 → 1:2 → 9:4 (1/3 puis 0,692) ; dépistage 1:99 × 18 = 18:99 → 0,154 ; LR⁻ = 2/19 = 0,105, cote 1:940,5, P(M ∣ −) = 0,00106 : un négatif exclut presque la maladie (0,1 %), un positif ne l'établit pas (15 %), bien que son LR (18) soit plus fort que celui du négatif (1/0,105 = 9,5) ; spam : 1:4 × 20 × 6 = 30:1 → 30/31 = 0,968.
- Table cote → p (ce qui a cassé) : p = 0,01 → 0,0198 (× 1,98) ; 0,05 → 0,0952 ; 0,1 → 0,182 (× 1,82) ; 0,2 → 0,333 ; 1/3 → 0,5 ; 0,5 → 0,667 (× 1,33) ; 0,9 → 0,947 (× 1,05).
- Code : deux tests indépendants sachant l'état contre un second test qui répète l'erreur du premier.
- Où ça casse : refaire le même test (erreurs corrélées) ; « la cote double, donc p double » ; cote 1 contre 9 = 10 %, pas 11 % ; logistique : e^β multiplie une cote (p05-02).
- Ce qu'on garde : cote a posteriori = cote a priori × LR, avec LR⁺ = sensibilité/(1 − spécificité) pour un test positif ; deux tests indépendants sachant l'état multiplient leurs LR. (Le doublement de la cote reste en exemples, figure 4, casse et chaîne verbalisée.)

### n6 · Sensibilité, spécificité, précision ; la précision dépend de la prévalence — OUTIL — Brunton 11
- Idée : Brunton 11 nomme enfin les deux taux du test : sensibilité P(+ ∣ usager) = 0,9, spécificité P(− ∣ non-usager) = 0,8. Un test toujours positif a 100 % de sensibilité et n'apprend rien ; un classifieur qui ne prédit jamais l'événement rare a 99,9 % d'accuracy. Pour le test du dépistage (0,9 et 0,95) : précision 0,667 à 10 % de prévalence, 0,154 à 1 %.
- Formule : sensibilité = rappel = TPR = TP/(TP + FN) ; spécificité = TNR = TN/(TN + FP) ; FPR = 1 − spécificité ; précision = VPP = TP/(TP + FP) = sens·π/(sens·π + (1 − spéc)(1 − π)) ; accuracy = π·sens + (1 − π)·spéc. Hypothèses : sensibilité et spécificité propres au test (idéalisation), π propre à la population.
- Figure 5 : VPP selon la prévalence (portée de p00-03, figure 2), curseur spécificité.
- Exemples : tableau 1 % / 10 % (rappel 0,900 / 0,900 ; FPR 0,050 / 0,050 ; précision 0,154 / 0,667 ; F1 0,263 / 0,766 ; VPN 0,999 / 0,988 ; accuracy 0,9495 / 0,945) ; toujours négatif : 0,99 d'accuracy à 1 % ; bascule VPP = 50 % à 1/19 = 5,26 % ; ML : modèle de fraude rappel 0,9, FPR 0,05 → précision 0,947 sur un jeu équilibré, 0,154 en production à 1 %.
- Code : même classifieur sur trois prévalences ; rappel et FPR stables, précision qui tombe.
- Où ça casse : prévalence importée (30 % → 1 % : 0,885 → 0,154) ; sensibilité 1 ne compense pas la prévalence (1 000 vrais positifs contre 4 950 faux à 1 %, précision 0,168 au mieux) ; taux de bonnes réponses (accuracy) en déséquilibre ; ROC insensible, PR sensible (p06-03) ; rééchantillonnage 50/50 (p06-04).
- Brunton dit / c'est : (08) contre (11) : 90 % appelé « spécifique » puis, correctement, sensibilité ; (11) spécificité « à peu près combien de faux positifs » → c'est le taux de vrais négatifs, les faux positifs sont 1 − spécificité ; « 10 % » appelé rare.
- Ce qu'on garde : pour un même test, la précision P(M ∣ +) dépend de la prévalence, parce que son dénominateur mélange malades et sains : 0,667 à 10 %, 0,154 à 1 %. Le rappel et le FPR, lus dans une seule ligne, n'en dépendent pas.

### n7 · Indépendance ; disjoint n'est pas indépendant — OUTIL — Brunton 12
- Idée : savoir B ne change rien sur A. Grille 4 × 13 de Brunton : les piques sont une ligne, les dames une colonne ; leur intersection est une case ; restreint aux piques, 1 chance sur 13 d'avoir une dame, comme avant. Pique et cœur, eux, sont disjoints : savoir « cœur » rend « pique » impossible.
- Formule : A et B indépendants ⇔ P(A ∩ B) = P(A) P(B) ⇔ (si P(B) > 0) P(A ∣ B) = P(A). Symétrique, valable même si P(B) = 0. Conséquence : Aᶜ et B indépendants aussi.
- Exemples : dame de pique 1/52 ; pique et trois 1/4 ; pique et figure 3/52 = 1/4 × 3/13 ; pique et noire 1/4 ≠ 1/8 ; pique et cœur 0 ≠ 1/16 ; dés : premier = 3 et somme = 6 : 1/36 ≠ 5/216 ; premier = 3 et somme = 7 : 1/36 = 1/6 × 1/6, indépendants.
- Preuve : équivalence des deux définitions ; complément (Aᶜ et B, puis A et Bᶜ par symétrie, Aᶜ et Bᶜ en l'appliquant deux fois) ; disjoint ⇒ dépendant.
- Code : énumération exacte (fractions) des 36 issues.
- Où ça casse : disjoint ≠ indépendant ; l'indépendance dépend de P, pas des ensembles ; Cov = 0 n'est pas l'indépendance (l09 n3) ; hypothèse à justifier physiquement.
- Brunton dit / c'est : (12) ne dit pas que disjoint n'est pas indépendant ; « IID = identical independently distributed » → indépendantes et de même loi.
- Ce qu'on garde : A et B sont indépendants si P(A ∩ B) = P(A) P(B), ce qui revient à P(A ∣ B) = P(A) quand P(B) > 0 : savoir B ne change rien sur A. (Disjoint ≠ indépendant reste en idée, casse et chaîne verbalisée.)

### n8 · Systèmes en série et en parallèle ; cause commune — OUTIL — Brunton 12
- Idée : guirlande de Noël (série) : une panne suffit ; P(panne) = 1 − (1 − p)ⁿ, n = 10, p = 0,05 → 0,401. Parallèle : il faut que tout tombe : pⁿ = 9,8 × 10⁻¹⁴. Trois disques à 1 % → 10⁻⁶ ; la foudre ou le parasurtenseur casse l'hypothèse.
- Formule : série 1 − Π(1 − pᵢ) ; parallèle Π pᵢ ; hypothèse : pannes mutuellement indépendantes (n9) ; cause commune de probabilité q : P(panne parallèle) = q + (1 − q) pⁿ ≥ q.
- Figure 6 : P(panne) selon n en échelle log, série, parallèle, parallèle avec cause commune.
- Exemples : Brunton n = 10 ; disques 10⁻⁶ et 1,001 × 10⁻³ avec q = 10⁻³ ; 100 composants à 1 % en série → 0,634 ; ML : agent à 10 étapes réussies chacune à 95 % → 0,599.
- Code : quatre millions de paires de disques, avec et sans surtension (bruit d'échantillonnage dit en commentaire).
- Où ça casse : cause commune ; p différents ; ensemble de modèles aux erreurs corrélées ; compter « exactement une panne, deux pannes… » double-compte, passer par le complément (l02 n2, n4).
- Brunton dit / c'est : (12) pⁿ et (1 − p)ⁿ utilisés sans dire qu'il faut l'indépendance mutuelle des n pannes.
- Ce qu'on garde : pour n composants de panne p, aux pannes mutuellement indépendantes : série 1 − (1 − p)ⁿ, parallèle pⁿ. Une cause commune de probabilité q fixe à la parallèle un plancher q.

### n9 · Indépendance deux à deux contre mutuelle — CULTURE — Brunton 12 (non traité)
- Contenu : deux pièces, A = première face, B = seconde face, C = les deux pièces sont pareilles ; chaque paire est indépendante (1/4 = 1/2 × 1/2) mais P(A ∩ B ∩ C) = 1/4 ≠ 1/8 : A et B ensemble décident C. Mutuelle : le produit pour toute sous-famille, 2ⁿ − n − 1 conditions (4 pour trois événements). Le produit triple seul ne suffit pas non plus (dés : premier ∈ {1, 2, 3}, premier ∈ {3, 4, 5}, somme = 9 : 1/36 = 1/2 × 1/2 × 1/9 mais P(A ∩ B) = 1/6 ≠ 1/4).
- Code : énumération des deux exemples.
- Où ça casse : pⁿ des systèmes, binomiale, Naive Bayes (indépendance conditionnelle de tous les mots sachant la classe).
- Ce qu'on garde (pas de carte) : deux à deux ne suffit pas ; l'indépendance de n événements demande le produit pour toute sous-famille, et c'est elle que supposent pⁿ et la binomiale ; Naive Bayes la suppose sachant la classe.

## Figures exigées
Vignettes « voir l'idée » (une par notion, sous l'idée) :
- v1 (n1) — grille d'issues (52 cartes en 4 × 13, ou 36 couples de dés) ; boutons Ω, sachant noire, sachant rouge, sachant 2ᵉ dé = 5, sachant somme = 6 ; les cases de B se rangent en bande sous la grille (le nouvel univers), A ∩ B en couleur ; readouts #(A ∩ B), #B, P(A ∣ B).
- v2 (n2) — arbre à deux niveaux des deux cartes, boutons sans remise / avec remise ; quatre feuilles, produits des branches, somme 1 ; chemin pique-pique surligné : 1/17 contre 1/16.
- v3 (n3) — Ω en bandes verticales de largeur P(Bᵢ), A en hauteur P(A ∣ Bᵢ) ; boutons cartes rouges, dépistage 1 %, dépistage 10 % ; readouts des aires et de leur somme.
- v4 (n4) — les positifs, un carré par personne, en deux vagues (malades détectés puis sains mal classés) ; boutons cancer (100 000 personnes : 99 contre 999), drogue 90/90 (1 000 : 90 contre 90), drogue 90/80 (1 000 : 90 contre 180).
- v5 (n5) — trois barres normalisées (avant le test, après un positif, après deux) : part des malades 0,1 % → 9,0 % → 90,75 % pour le cancer, avec les effectifs sur 10 000 000 et les cotes ; boutons cancer, drogue 90/90, drogue 90/80 ; bouton « ▶ un test de plus ».
- v6 (n6) — tableau 2 × 2 sur 10 000 personnes ; boutons de prévalence 1 %, 10 %, 50 % et les deux tests absurdes (toujours +, toujours −) ; boutons de métrique qui surlignent les cases du numérateur et du dénominateur ; readouts rappel, spécificité, précision, accuracy.
- v7 (n7) — grille 4 × 13 ; A = pique fixé, B au choix : dame, trois, figure, noire, cœur ; cases hors B estompées ; readouts P(A ∩ B), P(A)P(B), P(A ∣ B), verdict.
- v8 (n8) — schéma de n composants en série ou en parallèle, curseur n de 1 à 10, p = 0,05, option cause commune 1 ‰ ; bouton « ▶ 1 000 systèmes », 20 000 quand la cause commune est active (1 000 tirages n'en montrent aucune une fois sur trois) ; readouts exact contre fréquence observée.
- v9 (n9) — les quatre issues de deux pièces ; boutons A ∩ B, A ∩ C, B ∩ C, A ∩ B ∩ C ; readouts probabilité contre produit.

Figures sous la formule :
- Figure 1 (n1) — `plot` : Ω carré, A et B rectangles ; curseurs position et largeur de B ; readouts P(A ∩ B), P(A ∣ B), P(B ∣ A).
- Figure 2 (n4) — `plot` : effectifs, barre de la population en racine carrée, barres des positifs et négatifs en linéaire ; curseurs prévalence (log 0,1 % à 50 %), sensibilité, spécificité ; présélections.
- Figure 3 (n5) — `plot` : échelle des cotes en log, flèche × LR ; curseurs prévalence et LR⁺.
- Figure 4 (n5) — `plot` : probabilité après multiplication de la cote par k, kp/(1 + (k − 1)p), contre la fausse intuition kp ; curseurs k (1 à 10, 2 au départ) et p.
- Figure 5 (n6) — `plot` : VPP en fonction de la prévalence (log), sensibilité 0,9, curseur spécificité ; repères 1 % et 10 %.
- Figure 6 (n8) — `plot` : log₁₀ P(panne) en fonction de n, série, parallèle, parallèle avec cause commune q ; curseur q.

## Résumé
1. P(A ∣ B) = P(A ∩ B)/P(B) : on se restreint à B et on renormalise ; P(A ∣ B) ≠ P(B ∣ A).
2. P(A ∩ B) = P(A ∣ B) P(B), toujours ; un chemin d'arbre vaut le produit de ses branches.
3. Probabilités totales : P(A) = Σ P(A ∣ Bᵢ) P(Bᵢ) sur une partition.
4. Bayes : a posteriori = vraisemblance × a priori / normalisation ; test à 99 %, maladie à 0,1 % → 9 %.
5. En cotes : a posteriori = a priori × LR ; deux tests indépendants sachant l'état multiplient leurs LR ; doubler une cote ne double pas p.
6. Rappel et FPR ne dépendent pas de la prévalence, la précision si.
7. Indépendance ⇔ P(A ∩ B) = P(A) P(B) ; disjoint n'est pas indépendant.
8. Série 1 − (1 − p)ⁿ, parallèle pⁿ, sous indépendance mutuelle ; une cause commune fixe le plancher.

Phrase d'entretien : « Conditionner, c'est se restreindre à B et renormaliser, donc P(A ∣ B) et P(B ∣ A) ont le même numérateur et deux dénominateurs. Bayes passe de l'un à l'autre avec l'a priori : un test à 99 % sur une maladie à 0,1 % ne donne que 9 % de malades parmi les positifs. C'est pour ça qu'une précision dépend de la prévalence alors que le rappel et le taux de faux positifs n'en dépendent pas. Et multiplier des probabilités demande l'indépendance, qui n'a rien à voir avec être disjoint. »

## Chaîne verbalisée
1. Que veut dire P(A ∣ B), en un geste ? → Se restreindre aux issues de B et renormaliser : P(A ∩ B)/P(B).
2. Test à 99 %, maladie à 0,1 % : que vaut P(malade ∣ +), en effectifs ? → Sur 100 000 : 99 vrais positifs contre 999 faux, 9 %.
3. Refais-le en cotes, puis avec un second test indépendant. → 1:999 × 99 = 99:999 ; × 99 = 9 801:999, 90,75 %.
4. La cote double : la probabilité double-t-elle ? → Seulement si p est petit : 0,5 → 0,667, 0,01 → 0,0198.
5. Quelle métrique dépend de la prévalence ? → La précision : son dénominateur TP + FP mélange malades et sains ; rappel et FPR restent dans une ligne.
6. Deux événements disjoints sont-ils indépendants ? → Jamais quand leurs probabilités sont non nulles : P(A ∩ B) = 0 < P(A)P(B).
7. Dix composants à 5 % de panne : série ou parallèle, et sous quelle hypothèse ? → Série 0,401, parallèle 10⁻¹³, sous indépendance mutuelle ; une cause commune de probabilité q fixe un plancher : la parallèle ne descend jamais sous q.

## Ce qui a cassé pour Salah
- « La probabilité double » quand la cote double (vu en logistique) : faux sauf pour p petit. Adressé en n5 : table cote → p dans les exemples, figure 4 (p′ contre 2p), maillon 4 de la chaîne verbalisée, et lien vers p05-02.
- La précision qui dépend de la prévalence, à savoir expliquer en entretien : n6 (vignette v6 qui surligne les cases du dénominateur, figure 5, tableau 1 % / 10 %), phrase d'entretien, maillon 5.
- Barre bayésienne p(x | θ) en fréquentiste (Problème 4 du plan) : n1, formule, la barre est juste pour un événement, un paramètre s'écrit p(x ; θ) ; rappel en n4 pour la vraisemblance.
- L'indépendance comme licence du produit (fil B) : n7 et n9.

## Erreurs de Brunton couvertes
08 P(+ ∣ malade) appelée « spécifique » → n1 (et n6) · 08 P(B) > 0 non dit → n1 · 09 « quelque chose doit arriver » → n3 · 10 P(A ∣ B) appelé « update » → n4 · 10 « fiable à 99 % » sans dire sensibilité = spécificité → n4 · 10 prévalence 0,001 % corrigée en 0,1 % → n4 · 10 « 91 % du temps, c'est un faux positif » → n4 · 11 spécificité « combien de faux positifs » → n6 · 12 disjoint contre indépendant non dit → n7 · 12 IID mal développé → n7 · 12 indépendance mutuelle non dite pour n composants → n8 et n9.

## Exclusions
Pas de densités conditionnelles ni de Bayes pour les densités (l07 n3, n5), pas de prior sur un paramètre ni de loi Beta (p02-03), pas de réseau bayésien, pas de paradoxe de Simpson au-delà de la moyenne non pondérée, pas de covariance (l09).

## Correspondance avec la chaîne p00-03 (pour la redirection)
s1 → n1 · s2 → n1 · s3 → n7 · s4 → n3 · s5 → n4 · s6 → n4 · s7 → n5 · s8 → n6 · s9 → n6.

## Questions pour la revue
- Chiffres recalculés en fractions exactes (`WORK/l03/check/numbers.py`) : tous ceux de p00-03 sont confirmés ; l'accuracy à 1 % vaut exactement 0,9495 (p00-03 écrivait 0,950), la leçon écrit 0,9495.
- Ajouts non présents chez Brunton, à valider : test de 08 à 1 % (0,0435), filtre anti-spam (0,833 puis 0,968), erreur globale pondérée 0,034, agent à dix étapes 0,599, cause commune 1,001 × 10⁻³, contre-exemple du produit triple sans indépendance deux à deux.
- Arrondi : après deux tests du cancer, P = 9 801/10 800 = 0,9075 exactement. Le digest écrit 0,907 ; la leçon écrit 0,9075 et 90,75 % pour éviter l'arrondi ambigu.
- Relecture en contexte frais (10/10/2026), appliquée :
  - Chaîne verbalisée, maillon 7 : « borne la parallèle à q » devient « fixe un plancher : la parallèle ne descend jamais sous q ».
  - n5, exemple 4 : le négatif exclut presque la maladie (0,1 %), le positif ne l'établit pas (15 %) bien que son LR (18) dépasse celui du négatif (9,5) ; chiffres vérifiés (`check/numbers3.py`).
  - n5, formule : l'indépendance sachant l'état est définie, P(T₁⁺ ∩ T₂⁺ ∣ B) = P(T₁⁺ ∣ B) P(T₂⁺ ∣ B), comme la notion 7 appliquée à P(· ∣ B).
  - n5, idée et titre de v5 : Brunton conseille un second test, plus précis, et non de refaire le même ; le titre devient « dépister, puis un second test ».
  - n5, idée : l'image de Brunton (10) est ajoutée, mot pour mot sur ce qu'il dit : « l'a posteriori d'une expérience devient l'a priori de la suivante » (la relecture proposait « du premier test… du second », que Brunton ne dit pas : écart volontaire).
  - n9, garde : Naive Bayes suppose l'indépendance mutuelle sachant la classe, séparé de pⁿ et de la binomiale.
  - Figure 3, légende : 99:999 ≈ 1:10,1, la valeur que la figure affiche.
  - Figure 2, légende : « choisis consultation · 10 %, puis baisse la prévalence », le curseur étant au minimum au départ.
  - v8 : 20 000 systèmes tirés quand la cause commune est active (P(0 panne sur 1 000) = 0,368 vérifié) ; légende alignée.
  - p00-03 non perdu : tag `ml::metriques` ajouté (meta, frontmatter, aside, cartes liées, notion 6) ; repères de LR en n5 ; « sensibilité 1 : 1 000 vrais positifs contre 4 950 faux, précision 0,168 au mieux » en n6, vérifié.
  - Figure 5 : étiquettes 1 % et 10 % décalées à droite du pointillé ; figure 6 : la courbe qui sort par le bas est coupée au bord, plus de faux palier ; figure 3 : étiquette du LR éloignée de la flèche (aucun chevauchement constaté à LR = 9, décalage appliqué quand même) ; readouts raccourcis en v2 et v7.
  - v7, légende du cœur : P(A ∩ B) = 0 au lieu de P(A)P(B) = 1/16, et P(A ∣ B) = 0.
  - n2, idée : « Une image utile : l'arbre », Brunton n'en dessinant pas.
  - n3, Brunton rectifié : « C'est imprécis » au lieu de « C'est plus précis ».
  - n1, idée : B est nommé ; n6, idée : le passage au test du dépistage (0,9 et 0,95) est dit.
  - Langue : VPP, VPN, TPR, TNR, FPR développés une fois ; « taux de bonnes réponses (accuracy) » au premier usage ; « l'a priori (prior) » et « l'a posteriori (posterior) » partout, titre de n4 compris ; « ne vaut pas pour la population » en n1.
  - v4, légende : effectifs de la leçon distingués de Brunton (« Brunton 10 ; ici sur 100 000 »).
  - n7, preuve : A et Bᶜ par symétrie, Aᶜ et Bᶜ en l'appliquant deux fois.
  - n4, garde : « test à 99 % (sensibilité = spécificité = 0,99) ».
  - Code : c1 donne une valeur exacte par ligne ; c5 passe à 4 000 000 personnes et c8 à 4 000 000 de systèmes, le bruit d'échantillonnage étant dit en commentaire.
  - Règles transversales : gras décoratif retiré des idées (seuls restent les termes définis) ; aucun <b> dans le corps des encadrés Brunton ; « ce qu'on garde » des notions OUTIL réduits à une idée avec son cadre, moins de 40 mots ; la correction « 91 % des positifs » quitte le « où ça casse » de n4 pour l'encadré Brunton ; légende de v5 sans « à gauche, à droite ».
  - Rejet : aucun. Une seule correction modifiée (l'image de la pièce, ci-dessus).
- Le plan place la figure des effectifs en n4 et l'échelle des cotes en n5 ; le pas 6 de p00-03 (effectifs) est donc rattaché à n4. La notion n5 parle aussi d'effectifs, par la vignette des deux tests successifs.
