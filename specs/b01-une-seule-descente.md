---
id: b01
series: bridge
part: "B"
number: "01"
slug: une-seule-descente
title: Une seule descente
subtitle: le même pas — mesurer ce qui manque, avancer un peu — sous quatre habits
prereq: [p03-02, p05-02, p07-03, p07-04, p08-01]
anki: [ml::optimisation, ml::boosting, ml::kmeans, dl::backprop]
bridges: []
next: 
status: ready
---
## Format bridge
Une seule figure (le mécanisme), puis une ligne par domaine : règle | où on l'a vue (lien vers le pas exact) | ce qui change. Résumé en 3 lignes, phrase d'entretien, chaîne verbalisée de 4 maillons « même argument, autre habit ». Pas de chaîne numérotée longue : le pont relie, il ne redémontre pas.


## Le mécanisme
Un objet à améliorer (un vecteur β, une fonction F, des centroïdes μ, des poids W), un critère L, et le geste : calculer **ce qui manque** localement (le gradient, ou le meilleur mouvement à l'autre variable fixée), avancer d'un pas, recommencer. Ce qui garantit la descente : chaque pas fait baisser L (pas assez petit, ou étape exacte). Ce qui n'est pas garanti : arriver au global (convexité ou non).

## Les habits
| habit | l'objet qui bouge | « ce qui manque » | le pas | où on l'a vu |
|---|---|---|---|---|
| GD sur β (OLS, logistique) | β ∈ ℝᵖ | ∇_β L = Σ(pᵢ − yᵢ)xᵢ | β ← β − η∇ | p03-02 pas 2–3, p05-02 pas 6 |
| Boosting | la fonction F | −∂L/∂F (résidu pour MSE, y − p pour log-loss), approximé par un arbre | F ← F + ν h | p07-03 pas 2–3 |
| Lloyd (k-means) | μ et c alternés | à μ fixés : le plus proche ; à c fixés : la moyenne | étapes exactes (η = 1) | p07-04 pas 3 |
| Backprop | W de chaque couche | ∂L/∂W = (gradient reçu) × (dérivée locale) | W ← W − η∇ | p08-01 pas 4–6 |

Ce qui change : la nature de l'objet (vecteur, fonction, partition) et la longueur du pas (η, ν, exact). Ce qui ne change pas : la descente est locale, monotone si le pas est assez petit, et s'arrête à un point stationnaire — global si le critère est convexe (OLS, logistique), local sinon (k-means, réseaux, boosting sur un espace d'arbres).

## Figure exigée
- **`plot` à quatre panneaux légers** (ou un seul panneau avec preset) : pour chaque habit, la valeur de L en fonction de l'itération sur un petit exemple (β sur les 3 points de p05-01 ; F sur le fil rouge de p07-03 ; J de Lloyd sur le 1D de p07-04 ; L du neurone de p08-01) ; les quatre courbes descendent de façon monotone ; `slider` pas pour les deux GD, qui les fait osciller/diverger — et pas Lloyd. Légende : même forme de courbe, quatre objets ; seul un pas exact ne peut pas diverger.

## Où le pont casse
- Lloyd et le boosting ne vivent pas dans un espace où « convexe » a le même sens : optimum local, init décisive (p07-04), overfit en continuant (p07-03).
- Le boosting fait un pas dans un espace de fonctions **approximé** par un arbre : la direction n'est le gradient qu'à l'erreur d'approximation près.

## Résumé
1. Mesurer ce qui manque localement, avancer d'un pas, recommencer : GD, boosting, Lloyd, backprop.
2. Pas assez petit (ou exact) ⇒ descente monotone ; convexe ⇒ global, sinon local.
3. Ce qui change entre les habits : l'objet et la longueur du pas ; pas le geste.

**Phrase d'entretien** : « Descente de gradient sur les paramètres, boosting sur une fonction, Lloyd sur une partition, backprop sur des couches : c'est le même geste — calculer ce qui manque localement, avancer un peu, recommencer — avec la même garantie, une descente monotone si le pas est assez petit, et la même limite, un optimum local hors convexité. »

## Chaîne verbalisée
1. Qu'est-ce qui joue le rôle du gradient en boosting ? → −∂L/∂F au modèle cumulé, approximé par un arbre.
2. Pourquoi Lloyd ne diverge jamais ? → Deux étapes exactes ; η = 1 sur un problème résolu exactement à chaque fois.
3. Pourquoi l'OLS n'a pas ce problème d'optimum local ? → Convexe ; ∇ = 0 linéaire ⇒ forme fermée.
4. Que partagent k-means et un réseau ? → Optimum local ; l'initialisation compte.
