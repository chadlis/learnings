---
id: c09
series: coding
part: "09"
number: "09"
slug: dp-1d
title: DP 1D — un sous-problème par position
subtitle: coding — la relation de récurrence est l'invariant ; l'ordre de remplissage et le roulement O(1) en sont les conséquences
prereq: [c00]
anki: [coding::dp, coding::kadane, coding::recurrence]
bridges: []
next: 
status: ready
---
## Signal
Une réponse optimale sur un **préfixe** qui se déduit des réponses sur des préfixes plus courts ; des **choix** (prendre / laisser, couper / continuer) ; le mot « nombre de façons », « maximum sur un sous-tableau », « escalier », « pièces ». Contre-signal : le sous-problème dépend de tout le futur (pas de récurrence sur un préfixe) ; état à deux dimensions (DP 2D, hors périmètre).

## Pattern
Définir **dp[i] = la réponse au sous-problème indexé par i** (préfixe [0:i], ou « se terminant en i ») ; écrire la **récurrence** dp[i] = combiner(dp[i−1], dp[i−2], …, données[i]) ; poser les **cas de base** ; remplir dans l'ordre des dépendances ; ne garder que ce que la récurrence lit (roulement, espace O(1)).

## Squelette (House Robber, LC 198)
```
a, b = 0, 0                      # a = dp[i−2], b = dp[i−1]
pour v dans nums :
    a, b = b, max(b, a + v)      # dp[i] = max(ne pas voler i, voler i)
retour b
```

## TAP
- **Invariant** : après le tour i, b = dp[i] = butin maximal sur nums[0:i+1] **exactement**, et a = dp[i−1]. La récurrence est l'invariant : voler i interdit i−1, donc dp[i] = max(dp[i−1], dp[i−2] + nums[i]).
- **Variant** : n − i.
- **Conclusion** : donc à la sortie b = dp[n−1], le butin maximal sur tout le tableau.
- **Complexité** : n tours O(1) ⇒ O(n) ; espace O(1) par roulement (O(n) si on garde le tableau, nécessaire seulement pour reconstruire les choix).

## Trace (figure 1)
nums = [2, 7, 9, 3, 1] : (i, v, dp[i]) = (0, 2, 2) · (1, 7, 7) · (2, 9, 11) · (3, 3, 11) · (4, 1, 12). Réponse 12 (2 + 9 + 1). `inv` = « b = butin max sur [0:i+1] ; a = sur [0:i] ».

## Les variantes, une ligne chacune
- **Kadane** (sous-tableau de somme max, LC 53) : cur = max(x, cur + x), best = max(best, cur) ; dp[i] = meilleure somme **se terminant en i** ; réponse = max sur i. Sur [−2, 1, −3, 4, −1, 2, 1, −5, 4] : 6.
- **Escalier** (LC 70) : dp[i] = dp[i−1] + dp[i−2] ; Fibonacci.
- **Pièces, minimum** (LC 322) : dp[m] = 1 + min(dp[m − c]) ; ordre par montant croissant ; +∞ si impossible.
- **Plus longue sous-suite croissante** (LC 300) : dp[i] = 1 + max(dp[j] : j < i, a[j] < a[i]) ; O(n²) ; la version O(n log n) (patience sorting) est une c03.
- **Reconstruire les choix** : garder dp entier et remonter depuis la fin.

## Figures exigées
- **Figure 1 — `SL.trace`** : arr = [2, 7, 9, 3, 1], 5 images, `ptr` = {i}, `mark` = les maisons volées dans la solution courante, `note` = « max(11, 2 + 9) = 11 », `inv`. Légende : dp[i] ne lit que dp[i−1] et dp[i−2] ; le reste peut être oublié.
- **Figure 2 — `SL.trace`** : Kadane sur [−2, 1, −3, 4, −1, 2, 1, −5, 4], 9 images, `note` = « cur = max(4, −2 + 4) = 4 : on repart », `win` = le sous-tableau courant, `inv` = « cur = meilleure somme finissant en i ». Légende : repartir quand le passé pèse.

## Où ça casse
Un dp[i] mal défini (« la réponse jusqu'à i » sans dire si i est inclus, ou « se terminant en i » vs « sur le préfixe ») rend la récurrence fausse sans que le code plante. Kadane sans le max final : dp[i] est « se terminant en i », la réponse est le max sur tous les i.

## Pièges Python
- Cas de base : dp[0] et dp[1] écrits à la main, ou le roulement initialisé à (0, 0) avec la première itération qui les produit.
- Roulement : `a, b = b, …` en une seule affectation, sinon a est écrasé avant d'être lu.
- Pièces : oublier +∞ pour les montants impossibles, ou itérer sur les montants dans le mauvais ordre.
- Kadane : initialiser best à 0 (faux si tout est négatif) ; initialiser à nums[0].

## Résumé
1. Signal : réponse sur un préfixe déduite des préfixes plus courts ; choix.
2. dp[i] défini **exactement** (préfixe ou « se terminant en i ») ; la récurrence est l'invariant.
3. Cas de base ; ordre des dépendances ; roulement O(1) si la récurrence ne lit que quelques termes.
4. Kadane = dp « se terminant en i » + max final ; escalier = Fibonacci ; pièces = min + ordre croissant.

**Phrase d'entretien** : « Je définis dp[i] exactement — sur le préfixe ou se terminant en i — j'écris la récurrence, qui est mon invariant, je pose les cas de base et je remplis dans l'ordre des dépendances. Si la récurrence ne lit que deux termes, je roule en O(1). Kadane, c'est dp "se terminant en i" avec un max final : on repart quand le passé pèse. »

## Chaîne verbalisée
1. Comment définis-tu dp[i], et pourquoi la précision compte ? → Préfixe [0:i+1] ou « se terminant en i », exactement ; sinon la récurrence est fausse.
2. Récurrence de House Robber et son invariant. → max(dp[i−1], dp[i−2] + v) ; b = butin max sur [0:i+1].
3. Quand roule-t-on en O(1) ? → La récurrence ne lit que quelques termes précédents ; pas si on reconstruit.
4. Kadane : que vaut dp[i], et d'où vient la réponse ? → Meilleure somme finissant en i ; max sur i.

## Ce qui a cassé pour Salah
- Famille t09 : « sous-problème indexé par position, récurrence, ordre de remplissage, roulement O(1), Kadane comme DP » ; la scorie à surveiller est la **définition** de dp[i] laissée vague — chaque variante la dit ici.
