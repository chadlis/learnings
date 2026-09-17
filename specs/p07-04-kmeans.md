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
status: reviewed
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
- Init « ratée » en 2D (vérifiée) : trois amas gaussiens de 30 points, écart-type 0,6, centrés en (1 ; 1), (2,4 ; 3,6), (6,4 ; 1,4). Trois centroïdes tirés dans l'amas de droite. Au premier recentrage, **deux y restent** (16 et 14 points) et **le troisième hérite des 60 points des deux amas de gauche** et va se poser à leur barycentre : il ne les séparera plus jamais. J = 165,30 contre J* = 65,18, soit **2,54 fois** l'optimum, en 7 itérations. Le mécanisme exact : un centroïde ne va qu'à la moyenne des points qui lui sont affectés, donc **rien ne l'attire vers un amas qu'il n'a pas** — les deux qui se partagent l'amas de droite ont chacun leurs points et n'ont aucune raison de venir aider.
- k-means++ : premier centroïde au hasard, les suivants tirés avec probabilité ∝ distance² au plus proche centroïde déjà choisi ; garantie O(log k)-optimale en espérance (nommer).

## Pas de la chaîne
1. **Le décor.** n points, k centroïdes à placer. Le critère : l'inertie J = Σ_i ‖x_i − μ_{c(i)}‖², la somme des carrés des distances de chaque point à son centroïde.
2. **Deux inconnues, deux minimisations exactes** [tronc]. J dépend des affectations c et des centroïdes μ. À μ fixés, minimiser J en c : affecter chaque point au centroïde le plus proche (forme fermée, point par point). À c fixées, minimiser J en μ : chaque centroïde = moyenne de ses points (p00-02 : la moyenne minimise les carrés ; b06). Au tableau : « À centroïdes fixés le meilleur cluster d'un point est le plus proche, et à clusters fixés le meilleur centroïde est la moyenne, donc chaque demi-pas est un minimum exact, donc Lloyd alterne deux formes fermées. »
3. **Lloyd = descente alternée** [tronc]. Répéter affecter / recentrer. Chaque demi-pas ne fait pas monter J (il minimise J sur une variable, l'autre fixée) ; J est bornée par 0 ⇒ **convergence garantie**, en un nombre fini d'itérations (les affectations sont en nombre fini). Au tableau : « Chaque demi-pas fait baisser ou stagner J, et J ne descend pas sous zéro, donc la suite converge, et comme les affectations sont finies elle s'arrête. »
4. **Mais vers un optimum local.** J n'est pas convexe en (c, μ) (b06) : l'endroit où Lloyd s'arrête dépend du départ. Un centroïde **atterrit dans l'enveloppe convexe des points qui lui sont affectés** — il va à leur moyenne — et **il ne reçoit que les points plus proches de lui que des autres centroïdes**, donc une init dans un seul amas y reste. (Il *peut* traverser une zone vide : dans la figure 2, celui qui s'échappe saute de x ≈ 5,25 à x ≈ 1,64 par-dessus le trou, parce que ses points ont changé.) Au tableau : « Un centroïde va à la moyenne des points qui lui sont affectés et ne reçoit que ceux plus proches de lui que des autres, donc rien ne l'attire vers un amas qu'il n'a pas, donc une mauvaise initialisation piège Lloyd dans un minimum local. »
5. **Initialiser : k-means++ et redémarrages.** Tirer les centroïdes loin les uns des autres (∝ d²) puis Lloyd ; lancer n_init fois et garder le plus petit J. C'est le défaut de scikit-learn, et c'est ce qui rend k-means utilisable.
6. **Choisir k.** J décroît toujours en k (témoin, b02 : k + 1 centroïdes peuvent reproduire k) ⇒ pas de minimum. Coude de J(k), silhouette, ou k dicté par l'usage (nombre de segments qu'on peut traiter). Aucune de ces méthodes n'est une preuve : k est un choix.
7. **Ce que la distance suppose.** Euclidienne ⇒ clusters ronds, de variance comparable, séparables par des plans médiateurs (cellules de Voronoï). Deux anneaux concentriques, des amas allongés, des tailles très différentes : k-means les coupe faux sans erreur. Standardiser (H3) ; sinon la feature en centaines décide (p04-04). Pour d'autres formes : DBSCAN, mélanges gaussiens (nommer).
8. **k-means comme quantification.** Remplacer chaque point par son centroïde = compression avec perte (codebook de k vecteurs) ; c'est la quantification vectorielle des index de recherche (IVF, product quantization) — le même algorithme, un autre nom.
9. **Où ça casse** [casse].

## Figures exigées
- **Figure 1 — `plot` + bouton « demi-pas »** : les six points 1D avec deux centroïdes, init (1 ; 2) ; chaque clic fait un demi-pas (affecter, puis recentrer), readouts affectations, μ, J. Légende : J ne monte jamais ; convergé en deux tours.
- **Figure 2 — SVG custom via `plot` (Lloyd 2D animé)** : trois amas gaussiens de 30 points, boutons « init au hasard », « init ratée (trois dans un amas) », « k-means++ », puis « jouer » : affectations colorées, centroïdes qui se déplacent, J en readout ; l'init ratée converge avec deux amas fusionnés. Légende : un centroïde atterrit dans l'enveloppe convexe des points qui lui sont affectés, et **aucun des trois ne reste vide** (16 · 14 · 60).
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
3. Non convexe ⇒ optimum local ; un centroïde n'atterrit que dans l'enveloppe de ses propres points et ne reçoit que les plus proches ⇒ l'init décide.
4. k-means++ (tirages ∝ d²) + redémarrages, garder le plus petit J.
5. k : J décroît toujours (témoin) ; coude, silhouette, usage — un choix.
6. Euclidienne ⇒ sphères de tailles comparables ; standardiser ; quantification vectorielle = même algorithme.

**Phrase d'entretien** : « k-means minimise l'inertie en alternant deux minimisations exactes : affecter au centroïde le plus proche, recentrer sur la moyenne. Chaque demi-pas fait baisser une quantité bornée, donc ça converge — mais vers un optimum local, parce qu'un centroïde ne va qu'à la moyenne des points qui lui sont affectés : rien ne l'attire vers un amas qu'il n'a pas. D'où k-means++ et des redémarrages ; et k reste un choix, puisque l'inertie décroît toujours avec lui. »

## Chaîne verbalisée
1. Que minimise k-means ? → L'inertie J, somme des carrés des distances aux centroïdes.
2. Pourquoi chaque demi-pas de Lloyd est-il exact ? → Plus proche à μ fixés ; moyenne à c fixées (la moyenne minimise les carrés).
3. Pourquoi ça converge ? → J ne monte jamais et est ≥ 0 ; affectations finies.
4. Pourquoi pas vers l'optimum global ? → Non convexe ; rien n'attire un centroïde vers un amas qu'il n'a pas, donc deux centroïdes coincés dans le même amas y restent.
5. Que fait k-means++ ? → Centroïdes initiaux tirés ∝ d² au plus proche ; loin les uns des autres.
6. Pourquoi J ne donne-t-il pas k ? → Il décroît toujours en k (témoin) ; coude ou silhouette, un choix.

## Ce qui a cassé pour Salah
- t07 : « un centroïde ne se téléporte pas » (formule courte à corriger — voir Questions pour la revue), « Lloyd = deux optima exacts alternés » en Q/A ; ici c'est la figure 2 (init ratée) qui fait sentir le local.
- b01 (descente alternée) et b06 (demi-pas en forme fermée) : renvoyer.
- Lien avec IVF/quantification (t10, archivé) : pas 8, une ligne, pour que la Phase 3 (retrieval) trouve son ancrage.

## Exclusions
Pas de mélanges gaussiens/EM au-delà du nom, pas de preuve de k-means++, pas de silhouette détaillée, pas de DBSCAN.

## Questions pour la revue

Aucun chiffre du spec ne s'est révélé faux : le fil rouge 1D est exact
(J = 246 → 89,2 → 41,68 → 4 ; 10 est bien à 8 de 2 et à 9 de 1), et le « J deux à
trois fois plus grand » de l'init ratée se mesure à 2,54. Trois points à trancher :

1. **« Un centroïde ne traverse jamais une zone vide » est une formule fausse**, et
   la figure 2 la contredit à l'écran : le centroïde qui s'échappe saute bel et bien
   de x ≈ 5,25 à x ≈ 1,64 en coupant à travers le trou entre les amas. Ce qui est
   vrai, c'est qu'il atterrit toujours dans l'enveloppe convexe des points **qui lui
   sont affectés** — donc que rien ne l'attire vers un amas qu'il n'a pas. La sheet
   et le spec (pas 4, phrase d'entretien, chaîne verbalisée) ont été réécrits en ce
   sens. — validé 17/09 La phrase de remplacement est fixée : « un centroïde atterrit
   dans l'enveloppe convexe des points qui lui sont affectés », complétée du mécanisme
   « il ne reçoit que les points plus proches de lui que des autres centroïdes, donc une
   init dans un seul amas y reste ».
2. **Le fil rouge 1D ne piège jamais Lloyd** : les 15 initialisations possibles à
   partir de deux des six points convergent toutes vers J = 4, qui est l'optimum
   global. Le pas 4 repose donc entièrement sur l'exemple 2D ; la sheet le dit
   explicitement plutôt que de laisser croire que le fil rouge illustre le piège.
   — validé 17/09 Assumé : c'est la figure 2 (2D) qui porte le piège.
3. **Précision sur l'init ratée** (corrigée ci-dessus) : avec trois centroïdes dans
   un même amas, Lloyd n'en garde pas trois dans cet amas — c'est impossible, le
   plus à gauche récupère tout le reste dès la première affectation. Il en reste
   deux dans l'amas de droite, et le troisième couvre seul les deux amas fusionnés.
   — corrigé 17/09 **Ce point avait été mal formulé, et la revue 5 en a hérité.**
   « Il en reste deux » parlait des centroïdes restés *dans l'amas de droite*, pas du
   nombre de centroïdes non vides. Vérification faite en rejouant le code de la figure :
   les tailles finales sont **16 · 14 · 60** et **aucun centroïde n'est vide**. La
   consigne de revue « dire dans la légende que le troisième reste vide » aurait donc
   écrit un fait faux : la légende dit ce qui se passe réellement — les trois gardent
   des points, et c'est précisément pour ça que Lloyd s'arrête sans rien signaler.

**Arbitrage de revue 5, 17/09 — validé 17/09.** « Un centroïde ne traverse pas le vide »
**remplacé** partout (spec et sheet) par « un centroïde atterrit dans l'enveloppe convexe
des points qui lui sont affectés », plus la phrase mécanique « il ne reçoit que les points
plus proches de lui que des autres centroïdes, donc une init dans un seul amas y reste ».
Fil rouge 1D non piégeant **assumé** : la figure 2 porte le piège. **Réserve sur un point
de la consigne** : la légende ne peut pas dire « le troisième reste vide » — c'est faux,
les tailles finales sont 16 · 14 · 60 et aucun centroïde n'est vide (rejoué depuis le code
de la figure). La légende dit ce qui arrive vraiment. Statut `reviewed`.
