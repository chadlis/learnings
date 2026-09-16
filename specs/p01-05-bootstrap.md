---
id: p01-05
series: chain
part: "01"
number: "05"
slug: bootstrap
title: Bootstrap — la distribution d'échantillonnage quand il n'y a pas de formule
subtitle: fil A — rééchantillonner l'échantillon pour imiter la procédure
prereq: [p01-01]
anki: [stats::bootstrap, stats::inference]
bridges: [b04]
next: p02-01
status: built
---

## Question de la chaîne
Médiane de 10 latences, AUC, différence de F1 : aucune formule de SE. Comment obtenir la largeur ?

## Prérequis
- p01-01 : distribution d'échantillonnage = ce qu'on verrait sur des tirages répétés de la population ; SE = son écart-type.

## Hypothèses posées
- H1 : l'échantillon est représentatif de la population (iid) — on va le traiter **comme si c'était la population**.
- H2 : la statistique est « lisse » (moyenne, médiane, AUC, proportion) — pas un extrême (max, quantile 99,9 %).

## Exemple fil rouge
Latences (ms) : 120, 135, 98, 410, 140, 128, 122, 150, 131, 117. Médiane = 129,5. B = 1 000 rééchantillons avec remise de taille 10 → écart-type des médianes ≈ **8,86 ms** ; IC percentile 2,5–97,5 % = **[119,5 ; 142,5]** (l'intervalle [120 ; 140] est le 5–95 %). Valeurs obtenues par énumération exacte des 10^10 rééchantillons, pas par simulation. Contrôle sur la moyenne, qui a une formule : SE_boot = 27,20 ms contre s/√n = 28,67 ms, rapport √((n−1)/n).

## Pas de la chaîne
1. **Le décor.** On voudrait tirer 1 000 échantillons de la population et regarder la dispersion des médianes. On n'a qu'un échantillon.
2. **L'idée** [tronc] : l'échantillon est la meilleure image de la population qu'on ait ; tirer **dans l'échantillon, avec remise, n éléments** imite « tirer n éléments dans la population ». Au tableau : « La population est inconnue mais l'échantillon la représente, donc rééchantillonner l'échantillon avec remise imite le tirage dans la population, donc la dispersion des statistiques rééchantillonnées imite la distribution d'échantillonnage. »
3. **Le geste.** B fois : tirer n indices avec remise → calculer la statistique. SE_boot = écart-type des B valeurs. IC percentile : quantiles 2,5 % et 97,5 %.
4. **Pourquoi avec remise.** Sans remise on retrouve toujours le même échantillon. Avec remise, chaque rééchantillon oublie ≈ 37 % des lignes et en double d'autres (à n = 10 : 34,9 % exactement, la limite e⁻¹ = 36,8 % n'étant atteinte que vers n ≈ 100) — c'est la variabilité qu'on cherche (même 37 % que le OOB du bagging, p07-02).
5. **Apparié.** Pour comparer A et B : rééchantillonner les **lignes**, recalculer les deux scores sur les mêmes lignes, garder la différence. L'appariement est automatique.
6. **Où ça casse** [casse].

## Figures exigées
- **Figure 1 — `repeat`** : draw = médiane d'un rééchantillon avec remise des 10 latences ; bins [105 ; 160 ; 22] ; marque médiane observée 129,5. Readout écart-type = SE_boot. Boutons 1 / 50 / 1 000.
- **Figure 2 — `plot`** : un rééchantillon affiché comme 10 cases (valeurs) avec les doublons surlignés et les absents grisés ; bouton « nouveau rééchantillon ». Légende : ce qui change d'un rééchantillon à l'autre.

## Où ça casse
- **Dépendance** (séries, groupes) : rééchantillonner par bloc / par groupe, sinon SE trop petit.
- **Statistiques d'extrême** (max, quantile 99 %) : le bootstrap ne peut pas inventer des valeurs au-delà de l'échantillon.
- **n très petit** : l'échantillon représente mal la population ; le bootstrap hérite de cette erreur, il ne la corrige pas.
- **Ce n'est pas plus de données** : le bootstrap mesure la largeur, il ne réduit pas le biais.

## Résumé
1. Pas de formule ⇒ imiter la procédure : rééchantillonner l'échantillon avec remise, n éléments, B fois.
2. SE_boot = écart-type des statistiques ; IC percentile.
3. Avec remise = variabilité (37 % de lignes absentes par rééchantillon).
4. Comparer deux modèles : rééchantillonner les lignes, garder la différence (apparié).
5. Casse : dépendance, extrêmes, n minuscule ; ne réduit pas le biais.

**Phrase d'entretien** : « Quand je n'ai pas de formule pour l'erreur-type, je rééchantillonne mon test set avec remise et je recalcule la métrique un millier de fois : la dispersion obtenue imite la distribution d'échantillonnage. Pour comparer deux modèles je rééchantillonne les lignes et je garde la différence, ce qui apparie automatiquement. »

## Chaîne verbalisée
1. Que veut-on et qu'a-t-on ? → La dispersion sur des tirages de la population ; un seul échantillon.
2. Que fait le bootstrap et pourquoi c'est légitime ? → Rééchantillonner avec remise ; l'échantillon représente la population.
3. Pourquoi avec remise ? → Sinon aucun changement ; ≈ 37 % absents par tirage.
4. Comment comparer deux modèles ? → Mêmes lignes rééchantillonnées, différence des scores.
5. Quand ne pas lui faire confiance ? → Dépendance, extrêmes, n minuscule.

## Ce qui a cassé pour Salah
- D2 (11/09) : « bootstrap sur la différence » tenu. Cette sheet est courte : la nouveauté est le mécanisme « avec remise = imiter le tirage », pas la formule.
- Lier explicitement le 37 % au OOB (p07-02) : deux endroits où il le rencontre, une seule origine ((1 − 1/n)ⁿ → e⁻¹).

## Exclusions
Pas de bootstrap paramétrique, pas de BCa. Pas de bootstrap sur les résidus.

## Questions pour la revue
Corrections apportées au spec lors de l'écriture de la sheet (vérifiées par énumération exacte
des 10^10 rééchantillons possibles, script dans le scratchpad de la session) :

- **SE bootstrap de la médiane : 8,86 ms, pas ≈ 6 ms.** La latence à 410 ms écarte la distribution
  bien plus que le « 6 » annoncé. Corrigé dans « Exemple fil rouge ».
- **IC percentile 95 % = [119,5 ; 142,5], pas [120 ; 140].** [120 ; 140] est exactement
  l'intervalle **90 %** (q5 = 120, q95 = 140). Corrigé.
- **« ≈ 37 % » est une limite, pas la valeur à n = 10** : (1 − 1/10)¹⁰ = 34,9 %, soit 3,49 lignes
  absentes et 6,5 lignes distinctes. La sheet donne les deux et le tableau n = 10 / 100 / 1 000.
- À trancher : avec B = 1 000, le SE affiché par la figure 1 **sursaute** (jusqu'à ~12 ms) quand
  un rééchantillon tombe sur une médiane à 410 ms — environ 1 chance sur 6 800 par tirage, donc
  ~14 % des chargements de page. C'est assumé dans la légende comme illustration de la limite
  « statistiques d'extrême », mais si c'est jugé perturbant, il suffit de retirer le 410 du jeu
  (médiane à n = 9 : 128) — au prix de la belle illustration « la médiane ignore l'outlier, la
  moyenne non » du pas 1.
- Le pas 5 emprunte le fil rouge chiffré de p01-04 (b = 30, c = 39, n = 1 000) plutôt que
  d'inventer un second jeu : bootstrap apparié SE = 0,0082 contre formule appariée 0,0083, et
  0,0147 en cassant l'appariement (+ 77 %). À confirmer que cet emprunt est souhaité.
