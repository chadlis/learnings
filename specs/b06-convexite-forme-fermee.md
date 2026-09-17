---
id: b06
series: bridge
part: "B"
number: "06"
slug: convexite-forme-fermee
title: Convexité et forme fermée
subtitle: pont — quand annuler le gradient donne un système linéaire on résout ; sinon on itère, et la convexité dit si l'on arrive au bon endroit
prereq: [p03-02, p05-01, p02-02, p07-04, p05-02, p04-03]
anki: [ml::optimisation, ml::regression-lineaire, ml::ridge, ml::kmeans, algebre::conditionnement]
bridges: []
next: 
status: built
---
## Le mécanisme
Minimiser L revient à résoudre ∇L(θ) = 0. Si ce système est **linéaire en θ**, on le résout d'un coup (forme fermée) ; sinon on itère (p03-02). La **convexité** garantit que le point trouvé est le minimum global (stricte : unique). Le **conditionnement** dit combien d'itérations, et si la forme fermée est numériquement fiable.

## La table
| problème | ∇L = 0 | linéaire ? | on fait | convexe ? | où |
|---|---|---|---|---|---|
| Moyenne (min Σ(xᵢ − m)²) | Σ(xᵢ − m) = 0 | oui | m = x̄ | oui, stricte | p00-04 |
| OLS | XᵀXβ = Xᵀy | oui | β = (XᵀX)⁻¹Xᵀy — par QR/SVD, pas inv | oui ; stricte ssi XᵀX inversible | p05-01 ; p04-03 pas 7 |
| Ridge | (XᵀX + λI)β = Xᵀy | oui | forme fermée ; +λI rend inversible | stricte pour λ > 0 | p02-02 pas 5 ; p04-02 pas 7 |
| Centroïde (Lloyd, demi-pas) | Σ(xᵢ − μ) = 0 sur le cluster | oui | μ = moyenne du cluster | oui à affectation fixée ; **non** globalement | p07-04 |
| Logistique | Σ(σ(xᵢᵀβ) − yᵢ)xᵢ = 0 | non (σ) | itérer (GD, Newton) | oui : minimum global, pas de forme fermée | p05-02 ; p03-02 pas 4–5 |
| Lasso | sous-gradient, coude en 0 | non (signe) | itérer (coordinate descent, soft-threshold) | oui, non lisse | p02-02 pas 6 ; p03-01 pas 8 |
| Réseau | ∇ par backprop | non | itérer, minibatch | **non** : local | p08-01 ; p03-02 casse |

## Figure exigée
- **Figure 1 — `plot` à quatre panneaux (ou quatre boutons)** : L(θ) 1D pour un bol quadratique (forme fermée, minimum marqué par la formule), un bol non quadratique (log-loss : convexe, itérer), un V (|θ| : convexe non lisse, coude), une courbe à deux creux (non convexe : deux minima, la descente dépend du départ, deux trajectoires `descent` depuis deux θ₀). Légende : quatre formes, quatre stratégies.

## Ce qui casse partout de la même façon
- Forme fermée existante mais **mal conditionnée** (κ grand, p04-03) : la solution est exacte en théorie et fausse en flottant ; ridge ou QR.
- Forme fermée existante mais **chère** (p³ pour inverser) : à p grand on itère même l'OLS.
- Convexe mais non lisse (Lasso) : la descente de gradient ordinaire zigzague sur le coude ; méthodes proximales (nommer).
- Non convexe : la réponse « le point trouvé est-il le minimum ? » est « on ne sait pas » ; init et restarts (k-means++).

## Résumé
1. ∇L = 0 linéaire ⇒ résoudre (moyenne, OLS, ridge, centroïde) ; sinon itérer (logistique, Lasso, réseaux).
2. Convexe ⇒ le minimum trouvé est global ; stricte ⇒ unique ; +λI rend la ridge strictement convexe.
3. Le conditionnement décide de la vitesse des itérations et de la fiabilité de la forme fermée.

**Phrase d'entretien** : « J'annule le gradient : si le système est linéaire en θ, je résous — moyenne, OLS, ridge — de préférence par QR ou SVD ; sinon j'itère, et la convexité me dit si j'arrive au minimum global. La logistique est convexe sans forme fermée ; un réseau n'est ni l'un ni l'autre, et k-means n'est convexe qu'un demi-pas à la fois. »

## Chaîne verbalisée
1. Pourquoi l'OLS a une forme fermée et pas la logistique ? → ∇ = 0 linéaire en β pour l'un, σ non linéaire pour l'autre.
2. Même argument, autre habit : le demi-pas de Lloyd. → Centroïde = moyenne, forme fermée à affectation fixée ; non convexe globalement.
3. Que garantit la convexité, et que fait +λI ? → Minimum global ; strictement convexe, unique, inversible.
4. Forme fermée existante : pourquoi itérer quand même ? → κ grand (précision) ou p grand (coût p³).

## Ce qui a cassé pour Salah
- Vocabulaire : « solution en forme fermée », pas « système en forme fermée » (learnings).
- D4 / p02-02 : « la pénalité rend le minimum existant ou unique » — ce pont lui donne son nom général (stricte convexité) sans redémontrer.

## Questions pour la revue
- **Fausse alerte, refermée** : le renvoi `p03-01 pas 8` de la ligne « Lasso » est juste.
  `chain-p03-01` numérote ses pas par un compteur CSS (`.step .rule::before`) et contient
  un pas sans id numéroté (`s4b`, « Pourquoi c'est légitime : un surrogate ») : les ancres
  décalent d'un cran à partir de là, `#s7` s'affiche donc **pas 8**. Compter les ids donne
  un cran de moins que ce que le lecteur voit. Les liens de `bridge-05` étaient corrects.
  **Réglé en revue 4** : les ids de p03-01 sont passés en suite consécutive `s1`…`s10`, le
  décalage n'existe plus, et le validateur refuse désormais un id suffixé.
- Les autres renvois du spec ont été vérifiés un à un et sont justes : `p02-02 pas 5`
  (+λI translate), `p04-02 pas 7` (translater le spectre), `p04-03 pas 7` (ne pas former
  XᵀX), `p03-02 pas 4–5` (convexité / forme fermée ou itération), `p03-02 casse`, `p00-04`.
- Aucun nombre n'était donné par le spec ; le fil rouge de la sheet a été **construit** puis
  vérifié par script : x = (1,2,3,4), y = (2,3,5,4) → OLS (1,5 ; 0,8), RSS 1,80, ridge
  4/(5+λ), Lasso à zéro exact dès λ = |L′(0)| = 8 ; mêmes x avec y = (0,1,0,1) → logistique
  β̂ = (−2,2705 ; 0,9082), L = 2,34749, 3 pas de Newton contre 1 000 pas de gradient à
  η = 0,120 ; k-means sur {0,1,10,11,20,21}, k = 3 → SSE 1,5 ou 101 selon l'init ;
  Gram [[1, r],[r, 1]] avec r = 0,9999 → κ = 19 999, puis 199 à λ = 0,01 et 3,0 à λ = 1.
  **Validé en revue 4** : ce fil rouge est un choix de la sheet, pas du spec, et il est retenu.
- Le spec ne nomme pas de `next`. La sheet renvoie vers la carte ; **validé en revue 4** :
  b06 ferme la partie B, le renvoi vers la carte est le bon.
