---
id: c09
series: coding
part: "09"
number: "09"
slug: dp-1d
title: DP 1D
subtitle: un sous-problème indexé par une position, une récurrence, un ordre de remplissage
prereq: [c00]
anki: [coding::dp, coding::kadane]
bridges: []
next: 
status: stub
---
## Format coding
Blocs, dans cet ordre : **Signal** (les mots de l'énoncé qui appellent le pattern) → **Pattern** (le geste en 3 lignes) → **TAP** : invariant (conteneur nommé, tranche exacte), variant (entier ≥ 0, strictement décroissant), conclusion qui ouvre par « donc » → **Trace** (`SL.trace` sur un exemple de 8 à 12 cases, une frame par itération, l'invariant affiché à chaque frame) → **Complexité** (hors boucle « + », par itération « × », espace en fonction de n ou de |Σ|) → **Pièges Python** → **Cartes « signal → pattern »**. Le **squelette** (structure de boucle et invariant) est donné ; **jamais le code complet** de la solution : Salah l'écrit.


## Signal
« nombre de façons », « minimum / maximum sur une séquence de choix », « peut-on atteindre », « sous-tableau de somme maximale », « escalier / cambrioleur / pièces », choix qui dépendent des positions précédentes.

## Pattern
Définir **dp[i] = réponse au problème restreint à [0, i]** (ou finissant en i — ancrage à droite, comme la fenêtre). Écrire la récurrence à partir du dernier choix. Remplir dans l'ordre des dépendances. Espace : si dp[i] ne dépend que de dp[i − 1], dp[i − 2] ⇒ deux variables, O(1). Kadane est une DP : best_end[i] = max(a[i], best_end[i − 1] + a[i]).

## TAP (cambrioleur, LC 198, [2, 7, 9, 3, 1])
Invariant (avant de traiter i) : dp[j] = butin maximal sur les maisons [0, j] pour tout j < i.
Variant : n − i.
Récurrence : dp[i] = max(dp[i − 1], dp[i − 2] + a[i]) — voler i (donc pas i − 1) ou non.
Conclusion : à la sortie i = n, donc dp[n − 1] = butin maximal sur toutes les maisons, donc c'est la réponse. Résultat 12.
Complexité : O(n) ; espace O(1) par roulement.

## Trace exigée
- `SL.trace` sur [2, 7, 9, 3, 1] : cases = dp remplies une par une (readout du choix « vole / passe »), `mark` = i, et les deux dépendances surlignées.
- Kadane sur [−2, 1, −3, 4, −1, 2, 1, −5, 4] : best_end et best en readout ; résultat 6.

## Complexité
O(n) temps ; espace O(n) si on garde le tableau (reconstruction du chemin), O(1) sinon.

## Pièges Python
- Définir dp « jusqu'à i » vs « finissant en i » : les deux sont valides mais la récurrence change ; choisir et le dire (Kadane est « finissant en i », la réponse est le max).
- Cas de base : dp[0], dp[1] avant la boucle ; n = 1.
- Roulement : mettre à jour dans le bon ordre (nouveau = f(a, b) ; a, b = b, nouveau).

## Cartes
« séquence de choix ⇒ dp[i] indexé par position » ; « récurrence depuis le dernier choix » ; « dépend de i−1, i−2 ⇒ O(1) espace » ; « Kadane = DP finissant en i ».

## Ce qui a cassé pour Salah
- Aucun drill DP enregistré ; le pont avec la fenêtre glissante (ancrage à droite, « finissant en i ») est la façon la plus courte d'installer le geste à partir de ce qu'il tient déjà.
