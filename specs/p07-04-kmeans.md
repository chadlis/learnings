---
id: p07-04
series: chain
part: "07"
number: "04"
slug: kmeans
title: k-means — une descente alternée sur l'inertie
subtitle: arbres et ensembles — Lloyd alterne deux minimisations exactes et converge vers un optimum local ; l'initialisation décide
prereq: [p03-02, p00-02, p04-04]
anki: [ml::kmeans, ml::lloyd, ml::kmeans-plus-plus, ml::inertie]
bridges: [b01, b06]
next: p08-01
status: ready
---

## Question de la chaîne
Que minimise k-means, pourquoi Lloyd converge toujours mais pas vers le bon endroit, ce qu'un centroïde ne peut pas faire, et comment choisir k et l'initialisation.

## Prérequis
- p03-02 : descente, optimum local, non-convexité.
- p00-02 : la moyenne minimise Σ(x − m)².
- p04-04 : standardiser ; la distance euclidienne porte les unités.

## Hypothèses posées
- H1 : distance **euclidienne** ; les clusters sont implicitement **sphériques, de tailles comparables** — c'est ce que la distance euclidienne récompense.
- H2 : k est donné.
- H3 : features standardisées, sinon la feature à grande échelle décide seule.

## Exemple fil rouge
Six points sur une droite : 1, 2, 3, 10, 11, 12 ; k = 2.
- Init μ = (1 ; 2). Affectation : {1} et {2, 3, 10, 11, 12} (10 est à 8 de 2 et à 9 de 1). Mise à jour : μ = (1 ; 7,6). Affectation : {1, 2, 3} (3 est à 2 de 1, à 4,6 de 7,6) et {10, 11, 12}. Mise à jour : μ = (2 ; 11). Affectation inchangée : convergé. J = (1 + 0 + 1) + (1 + 0 + 1) = 4.
- Init « ratée » en 2D : trois centroïdes tirés dans le même amas alors qu'il y a trois amas ; Lloyd les répartit dans l'amas et laisse deux amas fusionnés sous un seul centroïde, avec J deux à trois fois plus grand que l'optimum. Un centroïde ne traverse pas une zone vide : il ne bouge que vers la moyenne des points qui lui sont affectés.
- k-means++ : premier centroïde au hasard, les suivants tirés avec probabilité ∝ distance² au plus proche centroïde déjà choisi ; garantie O(log k)-optimale en espérance (nommer).

## Pas de la chaîne
1. **Le décor.** n points, k centroïdes à placer. Le critère : l'inertie J = Σ_i ‖x_i − μ_{c(i)}‖², la somme des carrés des distances de chaque point à son centroïde.
2. **Deux inconnues, deux minimisations exactes** [tronc]. J dépend des affectations c et des centroïdes μ. À μ fixés, minimiser J en c : affecter chaque point au centroïde le plus proche (forme fermée, point par point). À c fixées, minimiser J en μ : chaque centroïde = moyenne de ses points (p00-02 : la moyenne minimise les carrés ; b06). Au tableau : « À centroïdes fixés le meilleur cluster d'un point est le plus proche, et à clusters fixés le meilleur centroïde est la moyenne, donc chaque demi-pas est un minimum exact, donc Lloyd alterne deux formes fermées. »
3. **Lloyd = descente alternée** [tronc]. Répéter affecter / recentrer. Chaque demi-pas ne fait pas monter J (il minimise J sur une variable, l'autre fixée) ; J est bornée par 0 ⇒ **convergence garantie**, en un nombre fini d'itérations (les affectations sont en nombre fini). Au tableau : « Chaque demi-pas fait baisser ou stagner J, et J ne descend pas sous zéro, donc la suite converge, et comme les affectations sont finies elle s'arrête. »
4. **Mais vers un optimum local.** J n'est pas convexe en (c, μ) (b06) : l'endroit où Lloyd s'arrête dépend du départ. Un centroïde ne se **téléporte** pas : il va vers la moyenne des points qu'il a, jamais vers une zone vide. Trois centroïdes dans un amas restent dans cet amas. Au tableau : « Un centroïde ne bouge que vers la moyenne de ses points, donc il ne traverse jamais une zone vide, donc une mauvaise initialisation piège Lloyd dans un minimum local. »
5. **Initialiser : k-means++ et redémarrages.** Tirer les centroïdes loin les uns des autres (∝ d²) puis Lloyd ; lancer n_init fois et garder le plus petit J. C'est le défaut de scikit-learn, et c'est ce qui rend k-means utilisable.
6. **Choisir k.** J décroît toujours en k (témoin, b02 : k + 1 centroïdes peuvent reproduire k) ⇒ pas de minimum. Coude de J(k), silhouette, ou k dicté par l'usage (nombre de segments qu'on peut traiter). Aucune de ces méthodes n'est une preuve : k est un choix.
7. **Ce que la distance suppose.** Euclidienne ⇒ clusters ronds, de variance comparable, séparables par des plans médiateurs (cellules de Voronoï). Deux anneaux concentriques, des amas allongés, des tailles très différentes : k-means les coupe faux sans erreur. Standardiser (H3) ; sinon la feature en centaines décide (p04-04). Pour d'autres formes : DBSCAN, mélanges gaussiens (nommer).
8. **k-means comme quantification.** Remplacer chaque point par son centroïde = compression avec perte (codebook de k vecteurs) ; c'est la quantification vectorielle des index de recherche (IVF, product quantization) — le même algorithme, un autre nom.
9. **Où ça casse** [casse].

## Figures exigées
- **Figure 1 — `plot` + bouton « demi-pas »** : les six points 1D avec deux centroïdes, init (1 ; 2) ; chaque clic fait un demi-pas (affecter, puis recentrer), readouts affectations, μ, J. Légende : J ne monte jamais ; convergé en deux tours.
- **Figure 2 — SVG custom via `plot` (Lloyd 2D animé)** : trois amas gaussiens de 30 points, boutons « init au hasard », « init ratée (trois dans un amas) », « k-means++ », puis « jouer » : affectations colorées, centroïdes qui se déplacent, J en readout ; l'init ratée converge avec deux amas fusionnés. Légende : un centroïde ne traverse pas le vide.
- **Figure 3 — `plot` + bouton « n_init = 10 »** : J final de 10 lancers Lloyd depuis des inits aléatoires (points), le minimum marqué ; à côté J(k) pour k = 1…8 (coude). Légende : J décroît toujours en k ; le coude est une lecture, pas une preuve.

## Où ça casse
- **Formes non sphériques, tailles inégales** : coupe en plans médiateurs, faux sans erreur.
- **Échelles** : sans standardisation, une feature décide.
- **Outliers** : la moyenne est tirée (p05-01) ; k-medoids (nommer).
- **Cluster vide** : un centroïde sans point ne peut plus bouger ; réinitialiser.
- **k** : choisi, pas trouvé ; J ne le donne pas.

## Résumé
1. J = Σ‖x − μ_{c(x)}‖² ; deux inconnues, deux minimisations exactes (plus proche / moyenne).
2. Lloyd alterne ; J ne monte jamais et est bornée ⇒ converge, en temps fini.
3. Non convexe ⇒ optimum local ; un centroïde ne traverse pas le vide ⇒ l'init décide.
4. k-means++ (tirages ∝ d²) + redémarrages, garder le plus petit J.
5. k : J décroît toujours (témoin) ; coude, silhouette, usage — un choix.
6. Euclidienne ⇒ sphères de tailles comparables ; standardiser ; quantification vectorielle = même algorithme.

**Phrase d'entretien** : « k-means minimise l'inertie en alternant deux minimisations exactes : affecter au centroïde le plus proche, recentrer sur la moyenne. Chaque demi-pas fait baisser une quantité bornée, donc ça converge — mais vers un optimum local, parce qu'un centroïde ne bouge que vers la moyenne de ses points et ne traverse jamais une zone vide. D'où k-means++ et des redémarrages ; et k reste un choix, puisque l'inertie décroît toujours avec lui. »

## Chaîne verbalisée
1. Que minimise k-means ? → L'inertie J, somme des carrés des distances aux centroïdes.
2. Pourquoi chaque demi-pas de Lloyd est-il exact ? → Plus proche à μ fixés ; moyenne à c fixées (la moyenne minimise les carrés).
3. Pourquoi ça converge ? → J ne monte jamais et est ≥ 0 ; affectations finies.
4. Pourquoi pas vers l'optimum global ? → Non convexe ; un centroïde ne traverse pas le vide.
5. Que fait k-means++ ? → Centroïdes initiaux tirés ∝ d² au plus proche ; loin les uns des autres.
6. Pourquoi J ne donne-t-il pas k ? → Il décroît toujours en k (témoin) ; coude ou silhouette, un choix.

## Ce qui a cassé pour Salah
- t07 : « un centroïde ne se téléporte pas », « Lloyd = deux optima exacts alternés » en Q/A ; ici c'est la figure 2 (init ratée) qui fait sentir le local.
- b01 (descente alternée) et b06 (demi-pas en forme fermée) : renvoyer.
- Lien avec IVF/quantification (t10, archivé) : pas 8, une ligne, pour que la Phase 3 (retrieval) trouve son ancrage.

## Exclusions
Pas de mélanges gaussiens/EM au-delà du nom, pas de preuve de k-means++, pas de silhouette détaillée, pas de DBSCAN.
