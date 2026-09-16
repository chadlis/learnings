---
id: b06
series: bridge
part: "B"
number: "06"
slug: convexite-forme-fermee
title: Convexité et forme fermée
subtitle: quand annuler le gradient se résout, quand on itère, et ce qui décide de la vitesse
prereq: [p03-02, p05-01, p05-02, p02-02, p04-03]
anki: [ml::optimisation, ml::ols, ml::logistique, algebre::conditionnement]
bridges: []
next: 
status: stub
---
## Format bridge
Une seule figure (le mécanisme), puis une ligne par domaine : règle | où on l'a vue (lien vers le pas exact) | ce qui change. Résumé en 3 lignes, phrase d'entretien, chaîne verbalisée de 4 maillons « même argument, autre habit ». Pas de chaîne numérotée longue : le pont relie, il ne redémontre pas.


## Le mécanisme
Trois questions sur un critère L(θ) : (1) ∇L = 0 est-il **linéaire** en θ ? oui ⇒ forme fermée (une résolution) ; non ⇒ itérer. (2) L est-il **convexe** ? oui ⇒ tout point stationnaire est le minimum global, unique si strictement ; non ⇒ local. (3) Quel est le **conditionnement** κ de la courbure ? il décide de la vitesse (∼κ itérations) et de la stabilité (η < 2/λ_max).

## Les habits
| problème | ∇L = 0 linéaire ? | convexe ? | forme fermée | où |
|---|---|---|---|---|
| OLS | oui : (XᵀX)β = Xᵀy | oui (strict si XᵀX inversible) | (XᵀX)⁻¹Xᵀy — sur X, pas XᵀX | p05-01 pas 3, p04-03 pas 6 |
| ridge | oui : (XᵀX + λI)β = Xᵀy | strictement (λ > 0 translate le spectre) | oui, toujours | p02-02 pas 5 |
| logistique | non : Σ(σ(βᵀx) − y)x = 0 | oui | non ⇒ GD / Newton ; global garanti | p05-02 pas 6, p03-02 pas 4 |
| moyenne, centroïde | oui | oui | ȳ ; moyenne du cluster | p00-02, p07-04 pas 3 |
| k-means (c et μ ensemble) | — | non (combinatoire) | non ⇒ alternance, local | p07-04 pas 4 |
| réseau | non | non | non ⇒ SGD, local | p03-02 casse |

Ce qui change : la forme de ∇L. Ce qui ne change pas : « forme fermée » veut dire système linéaire en θ, et « convexe » veut dire qu'itérer suffit. La vallée allongée (κ) est la même chose que le conditionnement de X (σ_max/σ_min) et que λ_max/λ_min de la hessienne.

## Figure exigée
- **`plot` à trois panneaux** : L(β) pour OLS (bol quadratique, minimum exact marqué), logistique (bol non quadratique, descente tracée), et un critère non convexe (deux creux, deux descentes depuis deux inits) ; `slider` κ sur le premier qui l'allonge et ralentit la descente tracée. Légende : résoudre, itérer, espérer.

## Où le pont casse
- Forme fermée existante mais **coûteuse** : (XᵀX)⁻¹ en O(p³) ; à p grand on itère quand même (p03-02 casse).
- Convexe mais **mal conditionné** : converge, en κ itérations ; préconditionner (standardiser).
- Convexe mais **sans minimum** : logistique séparable (‖β‖ → ∞) ; ridge le crée (p02-02 pas 4).

## Résumé
1. ∇L = 0 linéaire ⇒ forme fermée (OLS, ridge, moyenne) ; sinon itérer (logistique, réseaux).
2. Convexe ⇒ le point trouvé est le global ; strict ⇒ unique ; sinon local (k-means, réseaux).
3. κ décide de la vitesse et du pas ; +λI le répare ; standardiser le préconditionne.

**Phrase d'entretien** : « Devant un critère je pose trois questions : annuler le gradient donne-t-il un système linéaire — alors je résous, comme pour les moindres carrés ou ridge ; le critère est-il convexe — alors une descente arrive au global, comme pour la logistique ; et quel est son conditionnement — qui fixe le pas et le nombre d'itérations. Un réseau ou k-means échoue à la deuxième question, d'où les optima locaux et le rôle de l'initialisation. »

## Chaîne verbalisée
1. Pourquoi l'OLS a une forme fermée et pas la logistique ? → ∇ linéaire en β vs β sous une sigmoïde.
2. Que garantit la convexité à la logistique ? → Minimum global par descente ; unique si strict.
3. Que fait +λI aux trois questions ? → Linéaire toujours, strictement convexe, κ réduit.
4. Où k-means et un réseau tombent-ils ? → Non convexe ⇒ local ⇒ init.
