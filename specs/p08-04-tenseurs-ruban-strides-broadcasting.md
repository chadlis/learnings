---
id: p08-04
series: chain
part: "08"
number: "04"
slug: tenseurs-ruban-strides-broadcasting
title: Tenseurs — ruban, strides, view vs copie, broadcasting
subtitle: un tenseur est une vue sur une mémoire typée, pas un objet mathématique
prereq: [p08-02]
anki: [python::numpy, dl::pytorch, dl::broadcasting, dl::strides]
bridges: []
next: c00
status: stub
---

## Question de la chaîne
Pourquoi `.view` échoue après `.transpose`, pourquoi `M / M.sum(1)` normalise les colonnes au lieu des lignes sans erreur, et comment prédire une shape sans exécuter ?

## Prérequis
- p08-02 : dtype et précision (un tenseur a un dtype ; les opérations mixtes promeuvent).

## Hypothèses posées
- H1 : un tenseur = **un ruban mémoire contigu et typé** + une grille (shape) + une recette pour s'y déplacer (strides). Deux tenseurs peuvent partager le même ruban.
- H2 : ordre C (row-major) : le dernier axe est le plus rapide en mémoire.

## Exemple fil rouge
`t = arange(24).reshape(2, 3, 4)` : ruban 0…23 ; shape (2, 3, 4) ; strides (12, 4, 1). t[1, 2, 3] est à l'offset 1·12 + 2·4 + 3·1 = 23.
`t.transpose(0, 1)` : shape (3, 2, 4), strides (4, 12, 1), **même ruban** ; non contigu ⇒ `.view(-1)` échoue, `.reshape(-1)` copie, `.contiguous()` réordonne.
`t[:, ::2]` : shape (2, 2, 4), strides (12, 8, 1) : vue, un pas sur deux.
`t.sum(1)` : (2, 4) — l'axe 1 est consommé ; `t.sum(1, keepdim=True)` : (2, 1, 4).
Broadcasting : (2, 3, 4) + (4,) ✓ ; + (3,) ✗ ; + (3, 1) ✓ → (2, 3, 4) ; (3, 1) + (1, 4) → (3, 4).
Le piège : M = [[1, 1, 2], [2, 2, 4], [3, 3, 6]], sommes de lignes (4, 8, 12). `M / M.sum(1)` : (3, 3) / (3,) aligne par la **droite** ⇒ divise la colonne j par la somme de la ligne j ⇒ [[0,25 ; 0,125 ; 0,167], …] : les lignes ne somment plus à 1, aucune erreur. `M / M.sum(1, keepdim=True)` : (3, 3) / (3, 1) ⇒ lignes normalisées.

## Pas de la chaîne
1. **Le décor.** Un tenseur n'est pas une matrice : c'est un ruban de nombres typés, plus deux listes d'entiers qui disent comment le lire. Tout le reste (reshape, transpose, slicing, broadcasting) est de l'arithmétique sur ces listes.
2. **Ruban + shape + strides** [tronc]. offset(i, j, k) = i·s₀ + j·s₁ + k·s₂. Contigu en ordre C ⇔ strides = (∏ shape[1:], ∏ shape[2:], …, 1). Au tableau : « L'adresse d'un élément est un produit scalaire des indices par les strides, donc changer les strides change la lecture sans toucher au ruban, donc transposer ou trancher ne copie rien. »
3. **View vs copie** [tronc]. `view` / `transpose` / slicing basique / `[:, None]` : nouvelles listes, même ruban — modifier l'un modifie l'autre. `reshape` = view si possible, copie sinon. `view` **refuse** si les strides ne permettent pas la nouvelle shape sans copie (tenseur non contigu) ; `.contiguous()` recopie en ordre C. Au tableau : « view exige que la nouvelle grille se lise sur le ruban existant avec des pas réguliers, donc après une transposition les pas ne sont plus réguliers, donc view échoue et reshape copie. »
4. **Un axe consommé** : `sum(axis=k)` supprime l'axe k ; `keepdim=True` le garde à taille 1, ce qui permet de rediviser. Prédire la shape : retirer (ou mettre à 1) l'axe nommé.
5. **Broadcasting = alignement par la droite** [tronc]. Comparer les shapes de droite à gauche ; deux dimensions sont compatibles si égales ou si l'une vaut 1 (elle est **étirée** sans copie : stride 0). Une shape plus courte est complétée par des 1 **à gauche**. Au tableau : « Les shapes s'alignent par la droite, donc une dimension de taille 1 s'étire, donc une shape courte est complétée à gauche, donc (3,) contre (3, 3) s'aligne sur les colonnes, pas sur les lignes. »
6. **Le piège silencieux.** `M / M.sum(1)` divise les colonnes. C'est le bug de makemore : les probabilités « somment à 1 » par colonne. Règle : réduire avec `keepdim=True` quand on va rediviser, ou écrire `[:, None]`. Vérifier par `assert torch.allclose(P.sum(1), torch.ones(n))`.
7. **Indexation avancée** : `C[X]` avec X entier de shape (n, m) donne (n, m, d) — un lookup, une copie ; `[:, None]` ajoute un axe. Masques booléens sélectionnent (copie).
8. **Où ça casse** [casse].

## Figures exigées
- **Figure 1 — SVG custom via `plot` (le ruban)** : 24 cases numérotées en ligne ; boutons `reshape(2,3,4)`, `transpose(0,1)`, `[:, ::2]`, `.contiguous()` qui redessinent la grille au-dessus du ruban avec des flèches case → cellule et les strides affichés ; `slider` (i, j, k) qui surligne la case et affiche offset = i·s₀ + j·s₁ + k·s₂. Légende : le ruban ne bouge jamais ; seules les listes changent, sauf `.contiguous()` qui recopie.
- **Figure 2 — SVG custom (broadcasting)** : deux shapes saisies par boutons presets ((3,3)/(3,), (3,3)/(3,1), (2,3,4)+(4,), (2,3,4)+(3,)) ; alignement par la droite dessiné colonne par colonne, ✓/✗, shape résultat. Légende : la règle en une ligne.
- **Figure 3 — `plot` (matrice M)** : M affichée, bouton `M / M.sum(1)` vs `M / M.sum(1, keepdim=True)` ; sommes de lignes et de colonnes affichées après division. Légende : le premier « marche », mais c'est faux.

## Où ça casse
- **Modification en place d'une vue** : `a = t[0]; a += 1` modifie t ; utile ou catastrophique.
- **`reshape` qui copie sans prévenir** dans une boucle : coût mémoire ×2.
- **Broadcasting qui produit une shape gigantesque** : (10⁴, 1) + (1, 10⁴) → (10⁴, 10⁴) = 100 M éléments, voulu ou non.
- **Un `sum` sur la mauvaise dimension** ne lève jamais d'erreur si les shapes restent compatibles : seuls des asserts sur les invariants (lignes qui somment à 1) le voient.

## Résumé
1. Tenseur = ruban typé + shape + strides ; adresse = indices · strides.
2. Transposer, trancher, view : nouvelles listes, même ruban ; `view` refuse le non-contigu, `reshape` copie, `.contiguous()` réordonne.
3. `sum(axis=k)` consomme l'axe ; `keepdim` le garde à 1 pour rediviser.
4. Broadcasting : alignement par la droite, 1 s'étire (stride 0), complétion à gauche.
5. `M / M.sum(1)` normalise les colonnes en silence ; `keepdim=True` ou `[:, None]` ; assert sur les sommes.
6. Casse : vues modifiées en place, copies cachées, shapes géantes, erreurs silencieuses.

**Phrase d'entretien** : « Un tenseur est une vue sur un ruban mémoire : une shape et des strides. Transposer ou trancher ne copie rien, c'est pourquoi view refuse ensuite une grille qui ne se lit plus à pas réguliers, et pourquoi reshape copie. Le broadcasting aligne les shapes par la droite et étire les 1 avec un stride nul ; c'est ce qui fait que diviser une matrice par ses sommes de lignes sans keepdim normalise les colonnes sans lever d'erreur. »

## Chaîne verbalisée
1. Où est t[1, 2, 3] dans arange(24).reshape(2,3,4) ? → Offset 12 + 8 + 3 = 23 ; strides (12, 4, 1).
2. Pourquoi `.view(-1)` échoue après `transpose` ? → Strides (4, 12, 1) non réguliers ; reshape copie.
3. Shape de `t.sum(1)` et avec keepdim ? → (2, 4) ; (2, 1, 4).
4. (3,3) / (3,) : que se passe-t-il ? → Alignement par la droite ⇒ colonnes divisées ; faux et silencieux.
5. Comment normaliser les lignes, et comment le vérifier ? → keepdim=True ou [:, None] ; assert sur P.sum(1).

## Ce qui a cassé pour Salah
- 16/09 : `view(-1, k)`, `keepdim`, `x[:, ::2]` — le constat est « tenseurs pensés comme objets mathématiques, pas comme vues sur une mémoire typée » : le pas 2 et la figure 1 installent le ruban avant toute opération.
- S9 (session PyTorch) : broadcasting/keepdim, `C[X]`, `view(-1)` déjà travaillés ; ici on fixe la règle prédictive (alignement par la droite) et le piège `M / M.sum(1)` avec ses chiffres.
- Convention : « axis consommé », « keepdim le garde à 1 » — vocabulaire à réutiliser en B1–B2.

## Exclusions
Pas d'`einsum`, pas de `gather`/`scatter`, pas de mémoire GPU/pinned, pas d'autograd (p08-01).
