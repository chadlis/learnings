---
id: b05
series: bridge
part: "B"
number: "05"
slug: escalier-vs-sensible
title: Escalier vs sensible
subtitle: pointeur — le pont est déjà écrit : p03-01. Cette page en garde la table et les liens
prereq: [p03-01]
anki: [ml::arbres, ml::logistique, stats::regularisation, ml::svm]
bridges: []
next: 
status: stub
---
## Format bridge
Une seule figure (le mécanisme), puis une ligne par domaine : règle | où on l'a vue (lien vers le pas exact) | ce qui change. Résumé en 3 lignes, phrase d'entretien, chaîne verbalisée de 4 maillons « même argument, autre habit ». Pas de chaîne numérotée longue : le pont relie, il ne redémontre pas.


## Le mécanisme
Un critère n'informe l'apprentissage que par sa pente ; pente nulle = pas de signal. Fonctions en marches (accuracy, 0/1 loss) : muettes presque partout. Dômes / bols (Gini, entropie, log-loss) : chaque écart se voit. Zones plates de L2 près de 0 et de la hinge au-delà de la marge : ce qui explique les zéros du Lasso et les vecteurs de support.

## Les habits
| habit | ce qui bouge | en escalier | sensible | où |
|---|---|---|---|---|
| split d'arbre | p | accuracy (tente) | Gini, entropie (dôme) | p03-01 pas 2–4, p07-01 pas 2 |
| loss de classification | β | 0/1 | log-loss (gradient p − y) | p03-01 pas 7, p05-02 pas 6 |
| pénalité | θ | L2 près de 0 | L1 (coude = mur des deux côtés) | p03-01 pas 8, p02-02 pas 6 |
| SVM | marge | hinge au-delà de 1 | hinge en deçà | p03-01 pas 9 |
| évaluation | seuil | métriques à seuil (on mesure) | — | p06-03 |

## Figure exigée
- **Aucune nouvelle** : reprendre la figure 1 de p03-01 en miniature (import du même JS) et pointer.

## Résumé
1. Pente nulle = pas de signal.
2. Escalier pour évaluer, dôme/bol pour apprendre.
3. Les zones plates expliquent Lasso et vecteurs de support.

**Phrase d'entretien** : celle de p03-01.

## Chaîne verbalisée
Les cinq maillons de p03-01 ; cette page renvoie sans les dupliquer.
