---
id: b02
series: bridge
part: "B"
number: "02"
slug: temoin-atteignable
title: Le témoin atteignable
subtitle: majorer un minimum en exhibant un point : R², biais du max, tuning sur le test, k = n
prereq: [p04-01, p05-01, p01-04, p07-04]
anki: [algebre::temoin, ml::r2, stats::multiplicite]
bridges: []
next: 
status: ready
---
## Format bridge
Une seule figure (le mécanisme), puis une ligne par domaine : règle | où on l'a vue (lien vers le pas exact) | ce qui change. Résumé en 3 lignes, phrase d'entretien, chaîne verbalisée de 4 maillons « même argument, autre habit ». Pas de chaîne numérotée longue : le pont relie, il ne redémontre pas.


## Le mécanisme
min_{s ∈ S} f(s) ≤ f(s₀) pour tout s₀ ∈ S. Pour majorer un minimum, il suffit d'exhiber un élément de S. Conséquence systématique : **agrandir S ne peut que faire baisser le minimum** (l'ancien optimum reste atteignable). Symétrique pour un max : agrandir l'ensemble des candidats ne peut que faire monter le maximum — et si les candidats sont bruités, le max choisi contient la chance qui l'a fait gagner.

## Les habits
| habit | l'ensemble S | le témoin | conclusion | où on l'a vu |
|---|---|---|---|---|
| R² et une feature de plus | β ∈ ℝᵖ⁺¹ | (β̂_ancien, 0) | RSS_min ↓, R² ↑ toujours | p04-01 pas 7, p05-01 pas 6 |
| Biais du max | 40 configs bruitées | le vrai meilleur | E[max] > sa vraie valeur ; le gagnant surestime | p01-04 pas 6, D3 |
| Tuning sur le test | λ choisi sur le test | la meilleure valeur vue | l'erreur rapportée est un min sur des essais : biaisée | p01-04 pas 7, p05-03 pas 5 |
| k-means et k | partitions à k clusters | la partition à k − 1 raffinée | J(k) décroît toujours ; k = n ⇒ 0 | p07-04 pas 6 |
| Erreur train et complexité | modèles de degré d + 1 | le modèle de degré d | train décroît toujours | p06-01 pas 5 |

Ce qui change : l'ensemble et le critère. Ce qui ne change pas : un chiffre qui ne peut que s'améliorer quand on agrandit l'ensemble ne mesure pas la valeur de l'agrandissement ; il faut une mesure **hors** de l'ensemble (validation, test ouvert une fois, R² ajusté, critère hors échantillon).

## Figure exigée
- **`plot`** : une courbe f sur un ensemble S₁ (segment) et son minimum ; bouton « agrandir » qui étend S à S₂ ⊃ S₁ : le minimum ne peut que descendre, le point témoin (ancien min) marqué. Second panneau : `repeat` du max de k tirages N(0,1) avec `slider` k : E[max] monte (0 ; 0,56 ; 1,16 ; 1,54 ; 2,16 pour k = 1, 2, 5, 10, 40). Légende : deux faces du même fait.

## Où le pont casse
- Le témoin **majore** un min ; il ne le calcule pas et ne le minore pas.
- L'argument dit « ne peut que baisser » ; il ne dit pas de combien : R² monte de 10⁻⁵ avec du bruit, de 0,3 avec une vraie feature — c'est la mesure hors échantillon qui le dit.

## Résumé
1. min_S f ≤ f(s₀) : exhiber un point majore le minimum.
2. Agrandir l'ensemble ⇒ min ↓ (R², train, J(k)) ; max ↑ et biaisé si bruité (biais du max, tuning sur test).
3. Un chiffre qui ne peut que s'améliorer ne mesure rien : mesurer hors de l'ensemble.

**Phrase d'entretien** : « Un minimum sur un ensemble est majoré par n'importe quel point atteignable, donc agrandir l'ensemble ne peut que le faire baisser : c'est pourquoi R² monte avec toute feature, pourquoi l'erreur train décroît avec la complexité, et, côté maximum, pourquoi le meilleur de quarante essais sur un test set surestime sa valeur. Le remède est le même partout : mesurer sur ce que l'ensemble n'a pas vu. »

## Chaîne verbalisée
1. Pourquoi R² monte-t-il avec une feature de bruit ? → (β̂, 0) atteignable ⇒ RSS_min ne peut que baisser.
2. Même argument pour l'erreur train et la complexité ? → Le modèle plus simple est un cas particulier du plus riche.
3. Et pour le meilleur de 40 configs ? → Max de variables bruitées ; le gagnant contient sa chance.
4. Quel est le remède commun ? → Une mesure hors de l'ensemble de sélection.
