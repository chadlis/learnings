---
id: p07-04
series: chain
part: "07"
number: "04"
slug: kmeans
title: k-means — une descente alternée sur l'inertie
subtitle: non supervisé — deux gestes exacts qui s'alternent jusqu'à un optimum local
prereq: [p03-02, p04-04]
anki: [ml::kmeans, ml::lloyd, ml::kmeans-plus-plus]
bridges: [b01]
next: p08-01
status: stub
---

## Question de la chaîne
Que minimise k-means, pourquoi Lloyd converge à coup sûr mais pas vers le meilleur, pourquoi un centroïde ne se téléporte pas, et ce que l'initialisation change.

## Prérequis
- p03-02 : minimum, descente, optimum local.
- p04-04 : standardisation ; distance euclidienne dépend des unités.

## Hypothèses posées
- H1 : k fixé ; distance euclidienne ; clusters « ronds » de tailles comparables — c'est ce que l'inertie suppose.
- H2 : features standardisées (sinon la distance suit les unités).

## Exemple fil rouge
1D : x = {1, 2, 3, 10, 11, 12}, k = 2. Init μ = (1 ; 2). Affectation : 1 → μ₁ ; 2, 3, 10, 11, 12 → μ₂. Mise à jour : μ = (1 ; 7,6). Affectation : 1, 2, 3 → μ₁ (dist à 1 : 0, 1, 2 ; à 7,6 : 6,6, 5,6, 4,6) ; 10, 11, 12 → μ₂. Mise à jour : μ = (2 ; 11). Affectation inchangée ⇒ convergence. J = (1 + 0 + 1) + (1 + 0 + 1) = 4.
Init ratée en 2D : trois centroïdes dans le même amas de gauche, un amas à droite sans centroïde ⇒ Lloyd coupe l'amas de gauche en trois et donne l'amas de droite à un centroïde qui ne s'en approche que si des points lui sont affectés — il ne se téléporte pas : optimum local, J bien plus grand.
k-means++ : premier centroïde au hasard, les suivants tirés avec probabilité ∝ D(x)² (distance au plus proche centroïde déjà choisi) ⇒ les amas éloignés reçoivent un centroïde.

## Pas de la chaîne
1. **Le décor.** Pas d'étiquettes ; on veut k groupes. Il faut un critère : k-means en choisit un précis, et tout en découle.
2. **Le critère : l'inertie** [tronc]. J(c, μ) = Σᵢ ‖xᵢ − μ_{c(i)}‖² : somme des carrés des distances de chaque point à son centroïde. Deux inconnues : l'affectation c et les centroïdes μ. Au tableau : « k-means minimise la somme des carrés intra-cluster, donc il cherche à la fois qui va où et où sont les centres, donc le problème est combinatoire et on ne le résout pas exactement. »
3. **Lloyd = deux minimisations exactes alternées** [tronc]. μ fixés ⇒ le meilleur c affecte chaque point au centroïde le plus proche (exact). c fixé ⇒ le meilleur μ_j est la **moyenne** du cluster j (exact : la moyenne minimise Σ‖x − μ‖², p00-02). Chaque étape fait baisser ou stagner J ⇒ J décroît, borné par 0 ⇒ converge en un nombre fini d'étapes. Au tableau : « À centroïdes fixés l'affectation au plus proche est optimale, à affectation fixée la moyenne est optimale, donc chaque alternance fait baisser l'inertie, donc l'algorithme converge — vers un optimum local. »
4. **Local, pas global.** Deux gestes exacts n'impliquent pas un minimum global : le résultat dépend de l'initialisation. Un centroïde ne bouge que vers la moyenne des points qu'on lui affecte : s'il n'en a aucun près d'un amas, il n'ira jamais le chercher.
5. **Initialisation : k-means++.** Tirer les centroïdes avec probabilité ∝ D(x)² : les amas éloignés sont presque sûrement servis. Plus plusieurs redémarrages, garder le J minimal.
6. **Choisir k.** J décroît toujours avec k (k = n donne 0 : témoin, p04-01) ; coude sur J(k), silhouette, ou une contrainte métier. Il n'y a pas de k « vrai ».
7. **Ce que l'inertie suppose.** Clusters sphériques, de tailles et densités comparables, distance euclidienne pertinente (standardiser). Croissants, anneaux, tailles très inégales : k-means coupe au milieu. C'est aussi une quantification vectorielle (codebook = centroïdes ; VQ-VAE, product quantization).
8. **Où ça casse** [casse].

## Figures exigées
- **Figure 1 — SVG custom via `plot` (Lloyd animé 2D)** : 60 points en 3 amas ; boutons « affecter » / « mettre à jour » alternés, J en readout ; presets d'init : « k-means++ », « 3 centroïdes dans un amas », « aléatoire ». Légende : deux gestes, J qui descend, et une init ratée qui reste ratée.
- **Figure 2 — `plot` + `slider` k ∈ [1, 10]** : J(k) sur les mêmes points, meilleur de 10 redémarrages ; coude visible à k = 3. Légende : J décroît toujours ; le coude est une lecture, pas un théorème.
- **Figure 3 — `plot`** : deux croissants, k-means à k = 2 : frontière droite qui coupe les deux. Légende : l'inertie suppose des amas ronds.

## Où ça casse
- **Formes non convexes ou tailles inégales** : coupe au milieu ; DBSCAN, GMM (nommer).
- **Unités** : sans standardisation, la feature à grande échelle décide seule.
- **Outliers** : la moyenne les suit ; k-medoids (nommer).
- **k = n** : J = 0, le témoin rend tout k plus grand « meilleur » ; k n'est pas choisi par J seul.

## Résumé
1. Critère : inertie J = Σ‖x − μ_{c(x)}‖².
2. Lloyd : affecter au plus proche (exact à μ fixés), moyenne du cluster (exact à c fixés) ⇒ J décroît ⇒ converge.
3. Optimum local ; un centroïde ne se téléporte pas ; init par k-means++ (∝ D²), redémarrages.
4. k : J décroît toujours (témoin) ; coude, silhouette, métier.
5. Suppose : amas ronds, comparables, euclidien (standardiser).

**Phrase d'entretien** : « k-means minimise l'inertie en alternant deux minimisations exactes : affecter chaque point au centroïde le plus proche, puis remplacer chaque centroïde par la moyenne de ses points. L'inertie décroît à chaque étape, donc l'algorithme converge, mais vers un optimum local : un centroïde ne bouge que vers les points qu'on lui donne, d'où k-means++ qui tire les centroïdes initiaux loin les uns des autres et plusieurs redémarrages. L'inertie suppose des amas ronds et une distance euclidienne pertinente. »

## Chaîne verbalisée
1. Que minimise k-means ? → Σ‖x − μ_{c(x)}‖².
2. Pourquoi Lloyd converge ? → Deux étapes exactes, J décroît, borné.
3. Pourquoi pas vers le global ? → Optimum local ; un centroïde sans points près d'un amas n'y va jamais.
4. Que fait k-means++ ? → Tire les centroïdes ∝ D² ⇒ amas éloignés servis.
5. Pourquoi J ne choisit pas k ? → Décroît toujours (k = n ⇒ 0) ; témoin.

## Ce qui a cassé pour Salah
- S9 : k-means/VQ « déjà couvert » ; cette chaîne donne le « why » (deux minimisations exactes) et le pont b01 (descente alternée = même geste que GD et boosting).
- t07 (index) : « un centroïde ne se téléporte pas » en carte : pas 4, figure 1.

## Exclusions
Pas de GMM/EM au-delà du nom, pas de silhouette calculée, pas de mini-batch k-means.
