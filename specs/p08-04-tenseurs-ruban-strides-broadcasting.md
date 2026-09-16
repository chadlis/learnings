---
id: p08-04
series: chain
part: "08"
number: "04"
slug: tenseurs-ruban-strides-broadcasting
title: Tenseurs — ruban, strides, vue vs copie, broadcasting
subtitle: un tenseur est une grille posée sur un ruban de mémoire, pas un objet mathématique
prereq: [p08-02]
anki: [python::tenseurs, python::broadcasting, python::strides, python::keepdim]
bridges: []
next: c00
status: ready
---

## Question de la chaîne
Pourquoi `reshape` est gratuit et `transpose` casse `view`, pourquoi `M / M.sum(1)` normalise les mauvaises lignes sans erreur, et comment lire une opération sur les axes sans se tromper ?

## Prérequis
- p08-02 : dtypes ; un tenseur a un dtype et une mémoire typée.

## Hypothèses posées
- H1 : la mémoire est un **ruban** unidimensionnel de cases typées ; la forme (shape) et les pas (strides) sont des **métadonnées** posées dessus.
- H2 : PyTorch et NumPy suivent les mêmes règles ici (strides en éléments pour PyTorch, en octets pour NumPy).
- H3 : ordre « row-major » (C) : le dernier axe est contigu.

## Exemple fil rouge
t = arange(24), reshape(2, 3, 4) : shape (2, 3, 4), strides (12, 4, 1) — avancer d'un cran sur l'axe 0 saute 12 cases, sur l'axe 1 quatre, sur l'axe 2 une. t[1, 2, 3] est à l'offset 1·12 + 2·4 + 3 = 23.
- t.transpose(0, 1) : shape (3, 2, 4), strides (4, 12, 1), **même ruban**, non contigu ⇒ `.view(-1)` échoue ; `.contiguous()` ou `.reshape(-1)` copie.
- t[:, ::2] : shape (2, 2, 4), strides (12, 8, 1) : une vue, stride doublé, zéro copie.
- t.sum(1) : (2, 4) — l'axe 1 est consommé. t.sum(1, keepdim=True) : (2, 1, 4).
- M 3×3, `M / M.sum(1)` : (3, 3) / (3,) aligne **par la droite** ⇒ divise chaque **colonne** j par la somme de la **ligne** j ; les lignes du résultat somment à (0,425 ; 1,25 ; 2,075) pour M = 1…9. Avec `keepdim=True` : (3, 3) / (3, 1) ⇒ chaque ligne divisée par sa somme ⇒ (1 ; 1 ; 1).
- Broadcasting : (2, 3, 4) + (4,) ok ; + (3,) **erreur** ; + (3, 1) ok ; + (2, 1, 4) ok.

## Pas de la chaîne
1. **Le décor.** Un tenseur (2, 3, 4) n'est pas un cube : c'est 24 cases à la suite, et une règle pour y naviguer.
2. **Le ruban et les strides** [tronc]. offset(i, j, k) = i·s₀ + j·s₁ + k·s₂. En row-major, s = (12, 4, 1) : le dernier axe est contigu. Au tableau : « La mémoire est un ruban, donc une position multi-indice est un offset linéaire, donc chaque axe a un pas, donc un tenseur est une forme plus des pas posés sur un ruban. »
3. **Vue = mêmes cases, autres métadonnées** [tronc]. `reshape` compatible, `view`, `transpose`, `[:, ::2]`, `[None]` changent shape/strides sans toucher le ruban : gratuit, et **modifier la vue modifie l'original**. `transpose` rend les strides non décroissants ⇒ non contigu ⇒ `view` refuse (il exige de pouvoir relire le ruban d'un trait) ; `.contiguous()` copie dans un nouveau ruban. Au tableau : « Changer la forme sans copier est possible tant que le ruban se relit dans l'ordre, donc transpose casse cet ordre, donc view refuse et reshape copie. »
4. **Un axe se consomme.** `sum(axis=k)`, `mean`, `max` retirent l'axe k ; le résultat a une dimension de moins. `keepdim=True` garde un axe de taille 1 à sa place — indispensable dès qu'on va rediviser (pas 6). Au tableau : « Réduire un axe le fait disparaître, donc le résultat ne s'aligne plus sur l'original à cet endroit, donc on garde un axe de taille 1 pour rediviser. »
5. **Broadcasting : aligner par la droite, étirer les 1** [tronc]. Deux formes sont compatibles si, alignées sur leur **dernier** axe, chaque paire est égale ou contient un 1 ; le 1 est étiré (stride 0, sans copie). (2, 3, 4) + (4,) : ok ; + (3,) : 4 ≠ 3, erreur ; + (3, 1) : ok. Au tableau : « L'alignement part de la droite, donc un vecteur de longueur 4 s'applique au dernier axe, donc pour viser un autre axe il faut placer des 1 explicites. »
6. **Le bug silencieux** [tronc]. `M / M.sum(1)` : (3, 3) / (3,) est **valide** et divise les colonnes par les sommes de lignes — aucune erreur, résultat faux. `M / M.sum(1, keepdim=True)` : (3, 3) / (3, 1), lignes normalisées. Un bug de broadcasting ne plante pas, il donne des probabilités qui ne somment pas à 1. Au tableau : « La somme sur les lignes a perdu son axe, donc elle s'aligne sur les colonnes, donc chaque colonne est divisée par la mauvaise somme, donc on garde l'axe. »
7. **Masques et indexation.** `t[mask]` (booléen, copie), `t[idx]` (indices, copie), `t[:, None]` (vue). Un masque booléen de forme (n,) sélectionne des lignes ; en 2D il aplatit. Les indices avancés copient toujours.
8. **Lire une opération sur les axes.** Méthode : écrire les formes, aligner par la droite, marquer les 1 et les axes consommés, vérifier la forme attendue **avant** de lancer. `einsum('bij,bjk->bik')` rend les axes nommés — la lecture devient explicite.
9. **Où ça casse** [casse].

## Figures exigées
- **Figure 1 — SVG custom via `plot` (le ruban)** : 24 cases numérotées en ligne ; boutons `reshape(2,3,4)`, `transpose(0,1)`, `[:, ::2]`, `reshape(6,4)` qui redessinent au-dessus la grille (indices i, j, k) avec des flèches vers les cases du ruban, et affichent shape, strides, contigu oui/non, vue/copie. Légende : le ruban ne bouge jamais ; seules les flèches changent — sauf `.contiguous()`, qui recopie.
- **Figure 2 — SVG custom (broadcasting)** : deux formes saisies par `slider` (dimensions 1–4 sur trois axes, 1 pour « absent ») alignées par la droite, avec ✓/✗ par paire et la forme résultat ou « erreur ». Presets : (2,3,4)+(4,), +(3,), +(3,1). Légende : la règle en une image.
- **Figure 3 — `plot` (tableau interactif)** : M = 1…9, bouton `M / M.sum(1)` vs `M / M.sum(1, keepdim=True)` ; la matrice résultat affichée avec les sommes de lignes en marge (0,425 / 1,25 / 2,075 vs 1 / 1 / 1), la ligne divisée surlignée. Légende : le bug qui ne plante pas.

## Où ça casse
- **Vue modifiée = original modifié** : `y = x.view(...)`, `y += 1` change x. Avantage (zéro copie) et piège (aliasing).
- **Copies cachées** : `reshape` sur non contigu, indexation avancée, `.T` suivi de `view`, `torch.cat` ; le coût mémoire double sans avertissement.
- **Réduction sans keepdim suivie d'une division** : pas 6 ; se produit chaque fois qu'on normalise (softmax maison, batchnorm maison).
- **Ordre des axes convention-dépendant** : (B, T, C) en PyTorch, (B, C, T) en convolution ; un `transpose` oublié passe sans erreur si les tailles coïncident (B = C).

## Résumé
1. Tenseur = forme + strides posés sur un ruban ; offset = Σ indice × stride ; dernier axe contigu.
2. Vue = mêmes cases (reshape compatible, view, transpose, slicing, None) ; copie = nouveau ruban (contiguous, indexation avancée, reshape non contigu).
3. `transpose` casse la contiguïté ⇒ `view` refuse.
4. Réduire consomme un axe ; `keepdim=True` le garde pour rediviser.
5. Broadcasting : aligner par la droite, chaque paire égale ou 1 ; le 1 s'étire sans copie.
6. `M / M.sum(1)` est valide et faux ; `keepdim=True` répare. Écrire les formes avant de lancer.

**Phrase d'entretien** : « Un tenseur est une forme et des pas posés sur un ruban de mémoire ; reshape, transpose et slicing ne déplacent rien, ils changent les pas, ce qui rend view gratuit et casse dès que le ruban ne se relit plus dans l'ordre. Le broadcasting aligne par la droite et étire les 1 sans copier ; c'est pourquoi une somme sans keepdim, divisée ensuite, normalise les colonnes au lieu des lignes sans lever d'erreur. »

## Chaîne verbalisée
1. Que sont les strides de arange(24).reshape(2,3,4), et l'offset de [1,2,3] ? → (12, 4, 1) ; 23.
2. Pourquoi `transpose` puis `view` échoue ? → Strides non décroissants, non contigu ; view exige de relire le ruban dans l'ordre.
3. `x[:, ::2]` : vue ou copie ? → Vue, stride doublé.
4. Règle du broadcasting en une phrase. → Aligner par la droite ; égal ou 1 ; le 1 s'étire.
5. Que fait `M / M.sum(1)` sur une 3×3 ? → Divise les colonnes par les sommes de lignes ; valide, faux ; keepdim.
6. `sum(1)` sur (2, 3, 4) : forme ? avec keepdim ? → (2, 4) ; (2, 1, 4).

## Ce qui a cassé pour Salah
- Remédiation torch du 16/09 : `view(-1, k)`, `keepdim`, `x[:, ::2]` — les tenseurs pensés comme objets mathématiques et non comme vues sur une mémoire typée. Toute la chaîne est construite sur le ruban (figure 1) pour cette raison ; les trois cas sont des pas dédiés (3, 4, 6).
- t08 avait le contenu (« ruban, strides, view jamais de copie, axis consommé, keepdim, alignement par la droite ») en Q/A : ici il devient un enchaînement avec le bug de makemore (pas 6, figure 3) comme point d'arrivée.
- B2 (makemore, bigrammes) fait exactement `P = N / N.sum(1, keepdim=True)` : arriver avec le pas 6 déjà en main.

## Exclusions
Pas de CUDA/streams, pas d'autograd ici (p08-01), pas d'einsum au-delà d'une ligne, pas de channels_last ni de layout mémoire GPU.
