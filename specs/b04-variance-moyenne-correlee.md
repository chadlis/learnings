---
id: b04
series: bridge
part: "B"
number: "04"
slug: variance-moyenne-correlee
title: La variance d'une moyenne corrélée
subtitle: ρσ² + (1 − ρ)σ²/n — bagging, LOOCV, lignes dépendantes, bootstrap par bloc
prereq: [p00-02, p00-04, p07-02, p06-02, p01-01]
anki: [stats::variance-moyenne, ml::bagging, ml::loocv]
bridges: []
next: 
status: stub
---
## Format bridge
Une seule figure (le mécanisme), puis une ligne par domaine : règle | où on l'a vue (lien vers le pas exact) | ce qui change. Résumé en 3 lignes, phrase d'entretien, chaîne verbalisée de 4 maillons « même argument, autre habit ». Pas de chaîne numérotée longue : le pont relie, il ne redémontre pas.


## Le mécanisme
X₁, …, Xₙ de même variance σ², corrélés deux à deux avec ρ. Var(X̄) = (1/n²)[nσ² + n(n − 1)ρσ²] = ρσ² + (1 − ρ)σ²/n. Le second terme s'éteint en 1/n ; le premier reste : **moyenner des choses corrélées ne peut pas descendre sous ρσ²**. Dérivation en trois lignes depuis Var(X + Y) = Var X + Var Y + 2Cov (p00-02, pas 5) ; c'est le seul endroit du site où elle est faite.

## Les habits
| habit | les Xᵢ | ρ vient de | conséquence | où on l'a vu |
|---|---|---|---|---|
| bagging / RF | B arbres | mêmes données bootstrap | plafond ρσ² ; RF baisse ρ par m features | p07-02 pas 3–4 |
| LOOCV | n erreurs de plis | modèles partageant n − 2 lignes | la moyenne garde une variance ≈ ρσ² | p06-02 pas 4 |
| SE d'une moyenne sur lignes dépendantes | n observations | même utilisateur, même jour | σ²/n sous-estime ; SE trop optimiste | p01-01 casse, p00-04 casse |
| bootstrap par bloc | rééchantillons | dépendance temporelle | rééchantillonner des blocs pour garder ρ | p01-05 casse |

Ce qui change : d'où vient la corrélation (données partagées, proximité temporelle, groupe). Ce qui ne change pas : la formule, et le fait que « plus » (de modèles, de lignes, de plis) ne sert plus quand le terme en 1/n est déjà petit devant ρσ².

## Figure exigée
- **`plot` + `slider` ρ ∈ [0, 1]** : Var(X̄)/σ² en fonction de n (axe log 1…10⁴), asymptote ρ ; presets « ρ = 0 (iid) », « 0,2 (RF) », « 0,6 (bagging) », « 0,9 (LOOCV) ». Second panneau `repeat` : moyenne de 50 tirages corrélés (X_i = √ρ·Z + √(1 − ρ)·ε_i) vs iid, deux histogrammes ; readout écart-type mesuré vs formule. Légende : le plancher se voit.

## Où le pont casse
- ρ doit être **la même** pour toutes les paires (échangeabilité) ; sinon c'est une moyenne des covariances, la conclusion tient qualitativement.
- Corrélation négative : la moyenne peut descendre **sous** σ²/n (variance réduite par antithèse) — rare en pratique.

## Résumé
1. Var(X̄) = ρσ² + (1 − ρ)σ²/n.
2. Bagging plafonne, LOOCV reste large, les SE sur lignes dépendantes mentent : même formule.
3. Le levier est ρ (décorréler : RF, blocs, groupes), pas n.

**Phrase d'entretien** : « La variance d'une moyenne de termes corrélés vaut rho sigma carré plus un moins rho sur n : le terme en un sur n disparaît, pas l'autre. C'est pourquoi le bagging plafonne et la random forest décorrèle, pourquoi la validation leave-one-out garde une grande variance, et pourquoi l'erreur-type d'une moyenne sur des lignes d'un même utilisateur est trop optimiste. »

## Chaîne verbalisée
1. Dérive Var(X̄) pour des termes corrélés. → nσ² + n(n − 1)ρσ² sur n².
2. Pourquoi B = 1 000 arbres ne bat pas 200 ? → Terme 1/B négligeable ; reste ρσ².
3. Pourquoi LOOCV est large ? → ρ ≈ 1 entre modèles.
4. Que faire de lignes dépendantes ? → Réduire ρ : grouper, bloquer, ou compter n_effectif.
