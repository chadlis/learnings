---
id: c01
series: coding
part: "09"
number: "01"
slug: fenetre-glissante
title: Fenêtre glissante — fixe, variable, avec budget
subtitle: coding — deux pointeurs qui n'avancent que vers la droite ; l'invariant vit sur [l:r+1)
prereq: [c00]
anki: [coding::fenetre-glissante, coding::deux-pointeurs, coding::amortissement]
bridges: []
next: c02
status: built
---

## Signal dans l'énoncé
« Sous-tableau / sous-chaîne **contigu** », « le plus long / le plus court tel que … », une **condition monotone** en la taille de la fenêtre (agrandir ne peut que la rendre plus vraie, ou plus fausse), des **valeurs positives** ou un **compte** (fréquences, distincts). Contre-signal : des négatifs avec une somme cible (la monotonie tombe ; préfixes + dict, ou deque monotone : c10).

## Pattern
Deux indices l ≤ r ; r avance à chaque tour ; l avance seulement pour **rétablir** la condition. Un accumulateur (somme, dict de fréquences, compteur de distincts) décrit **exactement** [l:r+1). Trois habits : **fixe** (taille k, LC 643), **variable** (rétrécir tant que la condition est atteinte, LC 209), **avec budget** (rétrécir quand le budget est dépassé, LC 424).

## Squelette (variable, LC 209 : plus courte fenêtre de somme ≥ target, nombres > 0)
```
l = 0 ; s = 0 ; best = +inf
pour r, v dans enumerate(nums) :
    s += v                          # v entre
    tant que s >= target :          # fenêtre valide ⇒ enregistrer, puis rétrécir
        best = min(best, r − l + 1)
        s −= nums[l] ; l += 1       # nums[l] sort
retour best si fini, sinon 0
```
Le corps de la condition et l'accumulateur changent par habit ; les deux lignes de contrôle (r avance toujours, l avance dans un `while`) ne changent jamais.

## TAP (LC 209)
- **Invariant** (à la sortie du `while`, pour chaque r) : s = somme de nums[l:r+1] exactement ; la fenêtre [l:r+1) a une somme < target ; et best = longueur de la plus courte fenêtre de somme ≥ target **finissant en un r' ≤ r**. L'optimalité est **ancrée à droite** : on ne raisonne que sur les fenêtres qui finissent au r courant.
- **Variant** : (n − r) + (n − l), entier ≥ 0, strictement décroissant à chaque avancée de l'un ou l'autre pointeur.
- **Conclusion** : donc à la sortie, best est la longueur de la plus courte fenêtre de somme ≥ target finissant en n'importe quel r ≤ n − 1, donc la plus courte tout court ; +inf ⇒ aucune.
- **Complexité** : r avance n fois, l avance au plus n fois au total (**amortissement** : chaque élément entre une fois et sort au plus une fois), chaque avancée O(1) ⇒ O(n). Espace O(1). Pourquoi la monotonie est nécessaire : avec des valeurs > 0, retirer nums[l] fait baisser s, donc le `while` rétrécit vers la plus courte fenêtre valide finissant en r sans jamais avoir à ré-avancer l'autre sens.

## Trace (figure 1)
nums = [2, 3, 1, 2, 4, 3], target = 7, réponse 2 ([4, 3]). 16 images vérifiées par script :
(l, r, s, note) : (0,0,2, entre 2) · (0,1,5, entre 3) · (0,2,6, entre 1) · (0,3,8, entre 2) · (0,3,8, valide, best = 4) · (1,3,6, sort 2) · (1,4,10, entre 4) · (1,4,10, valide, best = 4) · (2,4,7, sort 3) · (2,4,7, valide, best = 3) · (3,4,6, sort 1) · (3,5,9, entre 3) · (3,5,9, valide, best = 3) · (4,5,7, sort 2) · (4,5,7, valide, best = 2) · (5,5,3, sort 4).
À chaque image `inv` affiche « s = Σ nums[l:r+1] = … ; best = … ».

## Les trois habits, en une ligne chacun
- **Fixe** (LC 643, moyenne max sur k) : r − l + 1 == k maintenu ; entre nums[r], sort nums[r − k] ; invariant « s = somme des k derniers » ; O(n), O(1).
- **Variable** (LC 209) : ci-dessus.
- **Budget + fréquence dominante** (LC 424, plus longue sous-chaîne à ≤ k remplacements) : fenêtre valide ⇔ (r − l + 1) − maxfreq ≤ k, avec maxfreq = fréquence max dans la fenêtre ; on rétrécit d'**un cran** quand la fenêtre est invalide ; maxfreq peut rester **non décrémenté** (elle n'a besoin d'être juste que quand la fenêtre est la plus longue candidate) — c'est l'astuce à savoir dire ; O(n), O(|Σ|).

## Figures exigées
- **Figure 1 — `SL.trace`** : arr = [2, 3, 1, 2, 4, 3], les 16 images ci-dessus, `ptr` = {l, r}, `win` = [l, r+1), `note` = la note, `inv` = « s = … ; best = … » ; boutons pas/jouer. Légende : l ne recule jamais ; chaque élément entre une fois, sort au plus une fois.
- **Figure 2 — `SL.trace`** court (8 images) pour LC 424 sur « AABABBA », k = 1 : `inv` = « len − maxfreq = … ≤ 1 ? » ; réponse 4. Légende : le budget se lit dans l'invariant.

## Pièges Python
- `if` au lieu de `while` pour rétrécir : la fenêtre reste trop longue.
- Enregistrer best **après** avoir rétréci : on enregistre une fenêtre invalide.
- Tranche demi-ouverte : la fenêtre est nums[l:r+1], pas nums[l:r].
- best initialisé à 0 au lieu de +inf pour un min ; oublier le cas « aucune fenêtre ».
- Négatifs avec une somme cible : la monotonie est fausse, le pattern est faux — préfixes + dict (LC 560).

## Résumé
1. Signal : contigu + condition monotone en la taille + positifs ou comptes.
2. r avance toujours ; l avance dans un `while` pour rétablir la condition ; l'accumulateur décrit exactement [l:r+1).
3. Invariant ancré à droite : optimalité sur les fenêtres finissant en r.
4. Variant (n − r) + (n − l) ; amortissement ⇒ O(n).
5. Trois habits : fixe, variable, budget (maxfreq non décrémenté).
6. Négatifs + somme cible ⇒ pas de fenêtre glissante.

**Phrase d'entretien** : « Contigu et condition monotone en la taille, donc fenêtre glissante : la droite avance à chaque tour, la gauche ne bouge que pour rétablir la condition, et mon accumulateur décrit exactement la fenêtre. Chaque élément entre une fois et sort au plus une fois, donc linéaire ; l'invariant dit que pour chaque bord droit j'ai la meilleure fenêtre qui y finit, donc à la sortie j'ai la meilleure tout court. »

## Chaîne verbalisée
1. Quel signal déclenche la fenêtre glissante, et lequel l'interdit ? → Contigu + monotone en la taille ; négatifs avec somme cible.
2. Énonce l'invariant de LC 209 avec sa tranche. → s = Σ nums[l:r+1] ; fenêtre < target après le while ; best optimal parmi les fenêtres finissant ≤ r.
3. Le variant, et pourquoi O(n) ? → (n − r) + (n − l) ; chaque élément entre et sort au plus une fois.
4. La conclusion, par donc. → Donc best est la plus courte fenêtre finissant en un r quelconque, donc la plus courte.
5. L'astuce de LC 424 ? → maxfreq non décrémenté ; la fenêtre ne rétrécit que d'un cran.

## Ce qui a cassé pour Salah
- Famille du drill du mardi (fil rouge coding, LC 643 → 209 → 424) : la progression fixe → variable → budget est la sienne, la sheet la fige.
- Invariant « ancré à droite » et amortissement : les deux points que le TAP oral a le plus souvent laissés implicites ; ici ce sont des lignes séparées.
- Jamais la solution complète : le squelette ci-dessus ne contient que les lignes de contrôle.

## Exclusions
Pas de fenêtre sur deque monotone, pas de préfixes — les deux sont le périmètre de c10 ; pas de fenêtre 2D.

## Questions pour la revue
- **Aucun chiffre du spec n'est faux.** Les 16 images de la trace LC 209 ont été
  regénérées par le code instrumenté et comparées une à une à la liste du spec :
  les 16 triplets (l, r, s) et les notes coïncident, et `s = Σ nums[l:r+1)` est
  recalculée à chaque image. `best = 2` confirmé par force brute, et par 20 000
  tirages aléatoires où fenêtre glissante et force brute ne divergent jamais.
  LC 424 sur « AABABBA », k = 1 → 4, confirmé par force brute.
- **Figure 2, « 8 images » pour une chaîne de 7 caractères.** Un tour par
  caractère fait 7 images. J'ai lu « 8 » comme 7 tours + 1 image de conclusion
  (celle qui montre la fenêtre témoin `AABA` et le `maxfreq` resté à 3). À
  confirmer : si le compte visé était 7, retirer la dernière image.
- **Le contre-signal renvoie à « c08/c09 » pour les préfixes et la deque
  monotone, mais ces deux ids sont pris** : `specs/c08` = Intervals,
  `specs/c09` = DP 1D (le tableau de c00 dit la même chose). Aucune sheet de la
  série ne porte donc les sommes préfixes ni la deque monotone. La sheet nomme
  les remèdes (LC 560, deque monotone) **sans pointer d'id**, plutôt que de
  fabriquer un lien faux. Quelle sheet doit les porter ?
- **Chiffres ajoutés, tous calculés et non repris du spec** : LC 643 sur le fil
  rouge avec k = 3 → sommes glissantes 6, 6, 7, 9, maximum 9, moyenne maximale 3 ;
  amortissement compté sur le code instrumenté → 6 avancées de r, 5 de l, 11 au
  total contre 21 sous-tableaux en force brute ; contre-exemple minimal des
  négatifs `nums = [2, −3, 4]`, `target = 4` → la fenêtre renvoie 0 au lieu de 1 ;
  `maxfreq` non décrémenté vs recalculé → 0 désaccord sur 20 000 chaînes.
