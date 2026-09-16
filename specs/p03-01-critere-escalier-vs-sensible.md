---
id: p03-01
series: chain
part: "03"
number: "01"
slug: critere-escalier-vs-sensible
title: Critère en escalier vs critère sensible
subtitle: fil C — un seul argument, quatre habits : split, loss, pénalité, marge
prereq: [p00-04, p02-01, p03-02]
anki: [ml::arbres, ml::logistique, stats::regularisation, dl::cross-entropy, ml::svm]
bridges: [b01, b06]
next: p03-02
status: built
---
Pilote, écrit dans le chat le 16/09/2026 : `sheets/chains/chain-p03-01-critere-escalier-vs-sensible.html`. **C'est le gold standard du format `chain`** — Claude Code le lit avant chaque production. Ce spec n'est pas à exécuter.

Résumé du contenu : tronc « un critère n'apprend que là où sa pente n'est pas nulle » ; exemples 400/400 (S1 vs S2) et 7/3 sans basculement ; quatre habits (Gini vs accuracy, log-loss vs 0/1, L1 vs L2, hinge/SVM en demi-chaîne) ; 4 figures (corde et courbe, losses vs marge, minimum pénalisé, marge SVM à supports exacts) ; casse (log-loss non bornée, séparation parfaite, Gini ≈ entropie, critère optimisé ≠ métrique rapportée).

Bilan du 16/09 intégré au pilote : vocabulaire tente / dôme, lecture de Gini en deux tirages, entropie = surprise moyenne, pas « surrogate » (entropie = log-loss du nœud, Gini = Brier, élagage au taux d'erreur), compensation −1/p × p(1−p) en deux étages et signe du gradient (pas 7), coude = mur des deux côtés (pas 8), cartes Anki du 16/09 listées.

À re-solliciter (revue du 18/09) : la réponse d'entretien Gini vs accuracy à voix haute (= maillon 1 de la chaîne verbalisée) ; nommer Wilson sans aide (p01-01) ; le signe du gradient en descente (pas 7, « Signe »).

Ce qui a cassé pour Salah (séance du 16/09) : argument produit une fois (Q8.1) jamais transféré ; Q11.1 Gini vs accuracy ; Q4.3 cross-entropy — d'où la table « le geste à transférer » et la chaîne verbalisée à cinq maillons.
