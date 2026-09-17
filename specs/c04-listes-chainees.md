---
id: c04
series: coding
part: "09"
number: "04"
slug: listes-chainees
title: Listes chaînées — pointeurs qui se suivent
subtitle: coding — lent/rapide, inversion en place, tête factice : trois invariants sur des flèches
prereq: [c00]
anki: [coding::listes-chainees, coding::lent-rapide, coding::dummy-head]
bridges: []
next: c05
status: built
---
## Signal
Une structure à **accès séquentiel** (pas d'indice, pas de longueur connue), des opérations « au milieu » ou « à l'envers » demandées **en place**, en O(1) mémoire. Contre-signal : accès aléatoire fréquent (tableau).

## Pattern (trois habits)
- **Lent / rapide** : deux pointeurs, l'un avance de 1, l'autre de 2. Milieu (quand rapide atteint la fin, lent est au milieu), k-ième depuis la fin (décalage de k), **détection de cycle** (Floyd : ils se rencontrent ssi cycle).
- **Inversion en place** : trois pointeurs prev, cur, nxt ; on retourne une flèche à la fois.
- **Tête factice** (dummy) : un nœud sentinelle avant la tête pour que « supprimer la tête » et « insérer avant la tête » ne soient plus des cas spéciaux.

## Squelette (inversion)
```
prev, cur = None, head
tant que cur :
    nxt = cur.next            # sauver avant de casser
    cur.next = prev           # retourner la flèche
    prev, cur = cur, nxt      # avancer
retour prev
```

## TAP (inversion)
- **Invariant** : la liste qui part de prev est **exactement** l'inversion de l'ancien préfixe [tête, cur) ; la liste qui part de cur est exactement l'ancien suffixe [cur, fin), intact.
- **Variant** : longueur du suffixe depuis cur, entier ≥ 0, strictement décroissant.
- **Conclusion** : donc quand cur = None, le suffixe est vide, donc prev est l'inversion de toute la liste.
- **Complexité** : n tours O(1) ⇒ O(n) temps, O(1) espace.

## Trace (figure 1)
Liste 1 → 2 → 3 → 4, 5 images : (prev, cur) = (∅, 1) · (1, 2) [1 → ∅] · (2, 3) [2 → 1 → ∅] · (3, 4) · (4, ∅) ; `inv` = « prev = inversion de [tête, cur) ; cur = suffixe intact ».

## Les deux autres habits, TAP en une ligne
- **Milieu** : invariant « rapide a parcouru 2× ce que lent a parcouru » ⇒ à l'arrêt de rapide, lent est au milieu (préciser lequel des deux milieux pour n pair : `while fast and fast.next` donne le second).
- **Cycle** : s'il y a un cycle, l'écart rapide − lent croît de 1 par tour modulo la longueur du cycle, donc atteint 0 ⇒ rencontre ; sans cycle, rapide atteint None. O(n), O(1) — contre O(n) mémoire avec un set de vus.

## Figures exigées
- **Figure 1 — `SL.trace`** : arr = [1, 2, 3, 4], 5 images, `ptr` = {prev, cur, nxt}, `note` = « flèche retournée : 2 → 1 », `mark` = nœuds déjà inversés, `inv`. Légende : une flèche à la fois, jamais deux.
- **Figure 2 — `SL.trace`** : liste de 6 nœuds, `ptr` = {lent, rapide}, 4 images jusqu'à l'arrêt de rapide ; puis même liste avec cycle 6 → 3 : 5 images jusqu'à la rencontre (départ + 4 tours). Légende : l'écart croît de 1 par tour ; modulo la longueur du cycle, il atteint 0.

## Où ça casse
Inverser en écrasant `cur.next` avant d'avoir sauvé `nxt` : le suffixe est perdu, sans erreur immédiate (la boucle finit, la liste est tronquée). Le variant l'attrape : si nxt n'est pas sauvé, le suffixe ne décroît pas proprement.

## Pièges Python
- `while fast.next` sans `fast and` : `None.next` sur une liste vide ou de longueur **paire** (rapide atterrit sur `None`) ; une longueur impaire passe sans rien dire.
- Oublier la sentinelle et gérer « supprimer la tête » à part : doubler le code, doubler les bugs.
- Retourner `head` au lieu de `prev` après inversion.
- Boucler avec un set de vus pour le cycle : correct, O(n) mémoire ; à savoir dire pourquoi Floyd fait O(1).

## Résumé
1. Signal : séquentiel, en place, O(1) mémoire.
2. Lent/rapide : milieu, k-ième depuis la fin, cycle (écart +1 par tour modulo la longueur).
3. Inversion : prev/cur/nxt, sauver avant de casser ; invariant « prev = inversion du préfixe, cur = suffixe intact ».
4. Tête factice : plus de cas spécial sur la tête.

**Phrase d'entretien** : « Sur une liste chaînée je n'ai que des flèches, donc trois habits : deux pointeurs à vitesses différentes pour le milieu ou un cycle, trois pointeurs pour inverser en place en retournant une flèche à la fois, et une tête factice pour que la tête ne soit plus un cas spécial. L'invariant de l'inversion, c'est que prev porte l'inversion exacte du préfixe et cur le suffixe intact. »

## Chaîne verbalisée
1. Invariant de l'inversion ? → prev = inversion de [tête, cur) ; cur = suffixe intact.
2. Pourquoi sauver nxt d'abord ? → cur.next est écrasé ; sans nxt le suffixe est perdu.
3. Pourquoi lent/rapide se rencontrent dans un cycle ? → Écart +1 par tour modulo la longueur ⇒ 0.
4. À quoi sert la tête factice ? → Supprimer/insérer en tête sans cas spécial.

## Ce qui a cassé pour Salah
- Famille listée en t09 (lent/rapide, inversion, dummy, cycle) ; l'invariant de l'inversion est celui qui doit être dit avec ses deux tranches.

## Questions pour la revue
- **Deux chiffres du spec corrigés après vérification par script** (le script est dans la
  trace de construction, pas versionné) :
  - *Figure 2, partie cycle* : le spec annonçait **6 images** jusqu'à la rencontre. Sur la
    liste `1 → … → 6` refermée par `6 → 3`, Floyd se rencontre au **4ᵉ** tour (nœud de
    valeur 5), soit **5 images** en comptant l'image de départ. Corrigé à 5, et la sheet
    trace bien 5 images.
  - *Pièges Python* : le spec disait que `while fast.next` sans `fast and` plante « sur une
    liste vide ou de longueur **impaire** ». C'est l'inverse : mesuré, ça lève
    `AttributeError` pour n = 2, 4, 6 et **passe** pour n = 1, 3, 5 — donc un test sur une
    liste impaire ne voit rien. Corrigé en « paire », et la sheet insiste sur ce point
    précis (c'est ce qui rend le piège vicieux).
- **Écart mesuré, à valider** : la sheet chiffre le coût mémoire du set de vus par
  `sys.getsizeof(set(range(10**6)))` = 33 554 648 octets ≈ **32 Mo**. C'est la table du set
  seule, hors objets nœuds (qui existent déjà). Si tu préfères une formulation plus prudente
  (« ~32 Mo de table, plus la surcharge »), c'est le pas 5 et le 4ᵉ piège Python.
- **Figure 2 tient en une seule `.fig` à deux rubans** (A : milieu · B : cycle), comme le
  demande le spec — une seule `.cap` pour les deux. Si tu les veux en deux figures
  numérotées, ça se scinde sans toucher au texte.
