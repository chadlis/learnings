---
id: b05
series: bridge
part: "B"
number: "05"
slug: escalier-vs-sensible
title: Escalier vs sensible
subtitle: pont — un critère n'apprend que là où sa pente n'est pas nulle — la table des habits, et où chacun est écrit
prereq: [p03-01]
anki: [ml::arbres, ml::logistique, stats::regularisation, ml::svm]
bridges: []
next: b06
status: ready
---
## Le mécanisme
Déjà écrit en entier dans p03-01 : ce pont est la **table d'entrée**, pas une répétition. Un critère n'informe l'apprentissage que par sa pente ; les fonctions en marches (accuracy, 0/1 loss) sont muettes presque partout ; les dômes et les bols (Gini, entropie, log-loss) transmettent chaque amélioration ; les pentes qui s'annulent quelque part (L2 en 0, hinge au-delà de la marge) expliquent un comportement précis.

## La table
| habit | ce qui bouge | escalier | sensible | ce que ça explique | où |
|---|---|---|---|---|---|
| Split d'arbre | p | accuracy (tente) | Gini, entropie (dôme) | CART ne coupe pas à l'accuracy ; surrogate | p03-01 pas 2–5 ; p07-01 |
| Loss de classification | β | 0/1 loss | log-loss | gradient (p − y)x, jamais nul ; séparation parfaite | p03-01 pas 7 ; p05-02 ; p02-01 |
| Pénalité | θ | L2 près de 0 | L1 | zéros exacts du Lasso, coude = mur | p03-01 pas 8 ; p02-02 pas 6 |
| SVM | marge | hinge au-delà de 1 | hinge en deçà | vecteurs de support | p03-01 pas 9 |
| Évaluation | seuil | accuracy, F1, rappel à un seuil | — | on **évalue** en marches, on n'**apprend** pas avec | p03-01 casse ; p06-03 |

## Figure exigée
- **Figure 1 — `plot` + `slider` x** : quatre courbes normalisées sur [0, 1] (une marche, un dôme, un bol, une hinge) avec la pente locale affichée en trait épais et en readout pour chacune. Légende : lis la pente, pas la valeur.

## Résumé
1. Pente nulle = pas de signal ; c'est l'argument unique.
2. Quatre habits, une casse : sensible transmet aussi le bruit.
3. On apprend avec un critère sensible, on évalue avec la métrique en marches.

**Phrase d'entretien** : celle de p03-01.

## Chaîne verbalisée
1. Même argument, autre habit : CART et l'accuracy. → Tente, gain nul sans basculement.
2. La 0/1 loss et β. → Gradient nul presque partout ; log-loss (p − y)x.
3. L1 et les zéros exacts. → Pente constante, coude = mur.
4. La hinge et les supports. → Nulle au-delà de la marge.

## Ce qui a cassé pour Salah
- L'argument produit une fois, jamais transféré (Q8.1 → Q11.1, Q4.3) : ce pont est la table de transfert. La réponse d'entretien Gini vs accuracy à voix haute reste à produire (bilan 16/09).
