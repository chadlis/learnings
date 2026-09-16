---
id: p08-02
series: chain
part: "08"
number: "02"
slug: flottants-lse
title: Flottants et log-sum-exp — raisonner en float32
subtitle: à écrire
prereq: []
anki: []
bridges: []
next: p08-03
status: stub
---
Périmètre : 53/24 bits, erreur relative, budget n·ε·max|somme|, jamais ==, money en entiers ; overflow → inf → nan (pas 0) ; LSE : soustraire le max ; log_softmax ≠ log(softmax). Figure : accumulation d'erreur animée. Cassé pour Salah : prédit 0 au lieu de nan (15/09) ; dtypes float64/float32 (16/09).
