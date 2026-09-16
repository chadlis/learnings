---
id: p01-01
series: chain
part: "01"
number: "01"
slug: objet-aleatoire
title: L'objet aléatoire — échantillon, estimateur, distribution d'échantillonnage, SE
subtitle: fil A — « qu'est-ce qui varierait si je refaisais l'expérience ? »
prereq: [p00-02, p00-04]
anki: [stats::estimation, stats::inference, stats::binomiale, stats::tcl]
bridges: [b03, b04]
next: p01-02
status: reviewed
---

## Question de la chaîne
Un chiffre sort d'une évaluation (87,2 % d'accuracy). Quel est l'objet aléatoire, quelle est sa distribution, et que vaut sa largeur ?

## Prérequis
- p00-02 : E, Var, Var(aX+b) = a²Var(X), additivité des variances sous indépendance.
- p00-04 : la moyenne de n v.a. iid a pour variance σ²/n ; TCL (forme normale quand n grand).
- Binomiale(n, p) : E = np, Var = np(1−p) (p00-01).

## Hypothèses posées
- H1 : le test set est un **tirage** iid dans la population d'usage. C'est cette hypothèse qui fabrique l'aléa.
- H2 : le modèle est **figé** ; il n'est pas réentraîné. La seule source de variation est le tirage du test set.
- H3 : les erreurs sont indépendantes d'une ligne à l'autre (une ligne = un individu).

## Exemple fil rouge
Test set n = 1 000, accuracy observée 872/1 000 = 0,872. Accuracy vraie (inconnue) π. Sous H1–H3 : X = nombre de bonnes réponses ~ Binomiale(1 000, π).
- Si π = 0,87 : E[p̂] = 0,87 ; Var(p̂) = 0,87·0,13/1 000 = 1,131·10⁻⁴ ; SE = 0,0106.
- Plug-in avec p̂ = 0,872 : SE = √(0,872·0,128/1 000) = 0,01056.
- Rappel (pour le pas 6b et la casse) : le rappel est une proportion **sur les positifs** : n = nombre de positifs, chaque positif est une Bernoulli(recall). 28 retrouvés sur 30 positifs : p̂ = 0,933 ; Wald 0,933 ± 1,96·√(0,933·0,067/30) = [0,844 ; 1,023] — dépasse 1, faux ; Wilson [0,787 ; 0,982].

## Pas de la chaîne
1. **Le décor.** Un chiffre, un test set, un modèle figé. Question unique : « qu'est-ce qui varierait si je refaisais l'expérience ? » — au tableau : « Le modèle est figé, donc ce qui varie est le test set, donc le chiffre en dépend, donc le chiffre est une variable aléatoire. »
2. **Les trois colonnes** [tronc]. FIXE (π, le modèle) · ALÉATOIRE (le test set, donc X, donc p̂) · PROCÉDURE (tirer un test set → compter → diviser). Une seule entrée dans la colonne aléatoire : le test set. Tout le reste en descend. Au tableau : « Le paramètre est fixe, l'échantillon est tiré, donc l'estimateur est une fonction de l'échantillon, donc c'est lui, et lui seul, qui a une distribution. »
3. **La distribution d'échantillonnage.** Refaire l'expérience 1, 50, 500 fois (figure 1). L'histogramme des p̂ est la distribution d'échantillonnage. Elle n'existe que dans le monde imaginaire des répétitions ; on n'en observe qu'un point.
4. **Son centre.** E[p̂] = E[X]/n = π : non biaisé. Au tableau : « X est une somme de n Bernoulli(π), donc E[X] = nπ, donc E[p̂] = π, donc en moyenne sur les tirages l'estimateur vise juste. »
5. **Sa largeur** [tronc]. Var(p̂) = Var(X)/n² = π(1−π)/n ; SE = √(π(1−π)/n). Le 1/n vient de l'indépendance (additivité des variances), le 1/n² de la division. Au tableau : « Les n Bernoulli sont indépendantes, donc leurs variances s'ajoutent en nπ(1−π), donc diviser par n divise la variance par n², donc la largeur décroît en 1/√n. »
6. **On ne connaît pas π.** SE est une formule en π ; on la calcule en p̂ : le **plug-in**. Légitime parce que p̂ est proche de π (consistance) et que SE varie lentement en p. 0,0106 vs 0,01056 : la différence est invisible. Au tableau : « SE dépend du paramètre inconnu, donc on y substitue l'estimateur, donc on obtient une estimation de SE, correcte au premier ordre. »
6b. **Le rappel est aussi une Bernoulli.** Recall = TP/(TP + FN) : une proportion sur les positifs réels, n = nombre de positifs, chaque positif réussi ou raté. Le même SE s'applique, avec ce n-là. Au tableau : « Le rappel conditionne sur les positifs, donc l'échantillon est l'ensemble des positifs, donc n est leur nombre et le SE est √(r(1 − r)/n_positifs). »
7. **La forme : TCL.** X somme de n v.a. iid ⇒ p̂ approximativement normale N(π, SE²) quand **le nombre de succès et le nombre d'échecs** sont tous deux grands (règle : ≥ 10). Ce n'est pas la prévalence qui casse l'IC normal, c'est min(k, n − k) petit. 28/30 : 2 échecs ⇒ Wald déborde au-delà de 1 ; **Wilson** (IC qui résout l'équation au lieu d'y brancher p̂) reste dans [0, 1] : [0,787 ; 0,982]. Figure 1 : l'histogramme devient une cloche ; figure 3 : il ne le devient pas.
8. **La procédure** [tronc]. Le SE est une propriété de la procédure « tirer → compter → diviser », pas du chiffre 0,872. Dire « l'accuracy est 0,872 ± 0,011 » = « la procédure qui a produit 0,872 a une dispersion de 0,011 sur des tirages répétés ». Au tableau : « Le chiffre en main est une réalisation, donc il n'a pas de variance, donc la variance appartient à la procédure qui l'a produit, donc c'est elle que décrit le SE. »
9. **Où ça casse** [casse]. Voir section.

## Figures exigées
- **Figure 1 — `repeat`** : draw = Binomiale(1000, 0,87)/1000 (somme de 1000 Bernoulli, ou approximation normale interdite ici : simuler vraiment). bins [0,83 ; 0,91 ; 40]. Marques : π = 0,87 (trait plein, « π, fixe ») et p̂ = 0,872 (« ce qu'on a vu »). Boutons tirer 1 / 50 / 500. Readout : n tirages, moyenne, écart-type (≈ 0,0106). Légende : l'écart-type de l'histogramme EST le SE ; un seul point observé.
- **Figure 2 — `repeat` + `slider` n** : même chose avec n ∈ {100, 1 000, 10 000}, mêmes bornes : la cloche se resserre en 1/√n. Readout : SE théorique vs mesuré.
- **Figure 3 — `repeat`** : rappel 28/30, draw = Binomiale(30, 0,933)/30 ; bins [0,7 ; 1,0 ; 15]. Histogramme collé au bord, asymétrique, pas une cloche ; marques p̂ et les deux IC (Wald en rouge, dépassant 1 ; Wilson en vert). Légende : 2 échecs seulement ⇒ pas de TCL ; Wald déborde, Wilson non. Ce n'est pas la prévalence qui casse, c'est le petit nombre d'échecs.

## Où ça casse
- **Dépendance** entre lignes (un même utilisateur sur 20 lignes) : la variance effective est plus grande que π(1−π)/n ; le SE est trop optimiste.
- **Peu de succès ou peu d'échecs** : min(k, n − k) < 10 ⇒ pas de TCL, Wald faux (déborde de [0,1]), Wilson ou exact. Le rappel d'une classe rare tombe là-dedans par son n (nombre de positifs), pas par la prévalence.
- **Test set non représentatif** (autre période, autre population) : le SE mesure la dispersion autour de π du test set, pas de la production. Le biais n'est pas dans le SE.

## Résumé
1. Le modèle est figé ; ce qui varie, c'est le test set ; donc le chiffre est aléatoire.
2. Trois colonnes : fixe (π) · aléatoire (test set → p̂) · procédure (tirer → compter → diviser).
3. Distribution d'échantillonnage : centre π (non biaisé), largeur SE = √(π(1−π)/n), forme normale si min(succès, échecs) ≥ 10.
4. On ne connaît pas π : plug-in de p̂ dans SE.
5. Le SE décrit la procédure, pas le chiffre en main.
6. Casse : dépendance, événements rares, test set non représentatif.

**Phrase d'entretien** : « Le modèle est figé, donc la seule chose aléatoire est le test set, donc l'accuracy observée est une variable aléatoire dont je décris la distribution : centrée sur l'accuracy vraie, de largeur √(π(1−π)/n) que j'estime par plug-in, à peu près normale dès que les succès et les échecs dépassent 10 chacun. Le SE est une propriété de la procédure d'évaluation, pas du chiffre. »

## Chaîne verbalisée
1. Qu'est-ce qui est aléatoire dans « accuracy = 87,2 % » ? → Le test set, donc X, donc p̂ ; π et le modèle sont fixes.
2. Quelle est la distribution de X ? → Binomiale(n, π) sous iid.
3. Que valent le centre et la largeur de p̂ ? → E = π ; SE = √(π(1−π)/n), par additivité des variances puis division par n.
4. On ne connaît pas π : que fait-on ? → Plug-in de p̂ ; correct au premier ordre.
5. Quand la forme normale tombe-t-elle, et que fait-on ? → Succès ou échecs < 10 ; Wald déborde ; Wilson.
6. Le rappel a-t-il un SE ? → Oui : Bernoulli sur les positifs, n = nombre de positifs.

## Ce qui a cassé pour Salah
- Sonde du 15/09 : le tronc est là (il nomme le test set avant toute formule, une seule entrée en colonne aléatoire, dérive SE et justifie le plug-in). Le mot **« procédure » n'avait aucun contenu** : le pas 8 existe pour ça, et la phrase d'entretien doit le contenir explicitement.
- Scories à ne pas reproduire dans la sheet : estimateur sans chapeau ; p(x|θ) au lieu de p(x;θ) ; « on ne connaît pas p, right ? » → le plug-in doit être un pas à part entière (pas 6), pas une remarque.
- Q17 du 10/09 (TCL) réussie.
- 16/09 : croyait que Wald ne s'applique pas au rappel (faux : Bernoulli sur les positifs, n = nb de positifs) → pas 6b. Note du 16/09 corrigée : ce n'est **pas la prévalence** qui casse l'IC normal mais le nombre de succès/échecs (28/30) → pas 7, figure 3, casse. Wilson non retrouvé sans aide → le nommer avec ses chiffres, sans dérivation, pour qu'il ressorte.

## Exclusions
Wilson : nom, principe en une ligne, chiffres 28/30 — pas la formule. Pas de Clopper-Pearson au-delà du nom. Pas de test d'hypothèse ici (p01-02). Pas de SE de White.

## Questions pour la revue

Corrections faites d'office en écrivant la sheet (à valider) :

1. **Critère du TCL, résumé (3) et phrase d'entretien.** — validé 16/09 Le spec disait « forme normale
   si n·π ≥ 10 » / « dès que n·π dépasse 10 » — c'est exactement l'erreur que le pas 7
   corrige (ce n'est pas la prévalence, c'est min(k, n − k)). Remplacé ici et dans la
   sheet par **min(succès, échecs) ≥ 10**. Avec n·π seul, 28/30 passerait le test
   (28 ≥ 10) alors que c'est le contre-exemple de la chaîne.
2. **Bornes de la figure 2.** — validé 16/09 Le spec demandait « mêmes bornes » que la figure 1
   ([0,83 ; 0,91]) ; à n = 100 le SE vaut 0,0336 et 20 % des tirages tomberaient hors
   cadre, empilés dans les bacs de bord. Bornes élargies à **[0,76 ; 0,98], 66 bacs**,
   identiques aux trois valeurs de n (c'est le point : l'axe ne bouge pas, la cloche se
   resserre). Effet secondaire : à n = 100 les valeurs k/100 ne tombent qu'un bac sur
   trois, l'histogramme est un peigne régulier sous une enveloppe en cloche.
3. **Bacs de la figure 3.** — validé 16/09 [0,7 ; 1,0 ; 15] donnait un peigne irrégulier (pas de
   support 1/30 ≈ 0,0333 contre des bacs de 0,02) et surtout coupait l'axe à 1,0, donc
   la borne haute de Wald (1,023) était hors du SVG — l'essentiel de la figure.
   Remplacé par **[0,70 ; 1,033 ; 10]** : un bac = une valeur possible de k/30, chaque
   barre s'arrête exactement sur sa valeur, l'axe va jusqu'à 1,033 et le dépassement de
   Wald est visible à droite du trait « borne 1 ».
4. **Chiffres vérifiés** — validé 16/09 (script Python, avant écriture) : Var = 1,131·10⁻⁴ et
   SE = 0,010635 en π = 0,87 ✓ ; SE = 0,010565 en plug-in ✓ ; SE(rappel) = 0,045542 ✓ ;
   Wilson 28/30 = [0,78676 ; 0,98152] → [0,787 ; 0,982] ✓. Une précision : Wald 28/30
   vaut [0,8441 ; **1,0226**] avec r = 28/30 exact (→ 1,023 comme l'annonce le spec),
   mais [0,8435 ; 1,0225] (→ 1,022) si on part du 0,933 arrondi écrit dans le spec. La
   sheet calcule tout à partir de 28/30 et affiche 1,023.
5. **Ajout non demandé** — validé 16/09 : une puce « Notation » dans le bloc des prérequis (chapeau de
   l'estimateur, p(x ; π) et non p(x | π)) — c'est la seule façon d'adresser la scorie
   du 15/09 sans la raconter. À retirer si le bloc prérequis doit rester strictement
   du rappel de contenu.
- **Wilson sur 872/1 000 corrigé après coup** — validé 16/09 : la sheet annonçait [0,851 ; 0,892], le calcul donne [0,84986 ; 0,89129] soit **[0,850 ; 0,891]** (z = 1,96, la borne basse de Wilson est sous celle de Wald, pas confondue avec elle). Corrigé dans la sheet. Repéré en écrivant w01-04, qui rejoue les mêmes chiffres.

**Arbitrage de revue, 16/09.** La puce « Notation » des prérequis est **conservée** : c'est la bonne façon d'adresser les scories (chapeau de l'estimateur, `p(x ; π)` en fréquentiste) — une règle posée une fois en tête, pas une correction répétée dans les pas. Les bornes des figures 2 ([0,76 ; 0,98], 66 bacs) et 3 ([0,70 ; 1,033 ; 10 bacs, alignés sur 1/30]) sont **validées telles quelles** : elles gardent l'axe fixe d'une valeur de n à l'autre et laissent voir la borne de Wald à 1,023, qui est l'objet même de la figure.

