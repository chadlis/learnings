---
id: p06-03
series: chain
part: "06"
number: "03"
slug: seuil-roc-pr
title: Seuil, matrice de confusion, ROC, PR
subtitle: à écrire
prereq: [p01-01]
anki: []
bridges: []
next: p06-04
status: stub
---
Périmètre : Baisser le seuil : TP↑ FP↑ FN↓ TN↓ ; -Rate = colonne des vrais ; AUC = P(s₊ > s₋) ; précision sans TN ⇒ sensible à la prévalence ; PR si rare. Figure : seuil glissant sur deux distributions de scores → ROC et PR tracées en direct. Exemple fil rouge : 100 000 transactions, 300 fraudes, TP 240, FN 60, FP 960 — accuracy 98,98 % **inférieure** au modèle trivial « jamais fraude » (99,7 %) ; recall 0,80, FPR 0,0096, précision 0,20. Cassé pour Salah : Q5 (mécanisme « pas de TN dans la précision », tenu le 16/09) ; recall oublié dans la liste des métriques ; unités à écrire.
