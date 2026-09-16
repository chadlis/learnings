---
id: p01-02
series: chain
part: "01"
number: "02"
slug: ic-test-procedure
title: IC et test — centre, largeur, p-value, et sur quoi porte le 95 %
subtitle: fil A, cas 1 — l'intervalle porte sur la procédure
prereq: [p01-01]
anki: [stats::inference, stats::ic, stats::pvalue, stats::h0]
bridges: [b03]
next: p01-03
status: built
---

## Question de la chaîne
Le logiciel affiche β̂₁ = 1,4, SE = 0,62, p = 0,024, IC95 = [0,18 ; 2,62]. Que signifie chaque nombre, et surtout que ne signifie-t-il pas ?

## Prérequis
- p01-01 : trois colonnes, distribution d'échantillonnage, SE.
- Normale : 95 % dans μ ± 1,96σ (p00-01).

## Hypothèses posées
- H1 : β̂₁ ~ N(β₁, SE²) — la forme normale est acquise (n grand, p01-03 dira d'où vient le Student).
- H2 : le SE est connu (ou estimé, sans changer le raisonnement).
- H3 : une seule hypothèse testée, un seul échantillon (la multiplicité est p01-04).

## Exemple fil rouge
β̂₁ = 1,4, SE = 0,62. Sous H₀ : β₁ = 0, z = 1,4/0,62 = 2,26 ; p bilatérale = 2·(1 − Φ(2,26)) = 2·0,0119 = 0,024. IC95 = 1,4 ± 1,96·0,62 = [0,185 ; 2,615].
(Les chiffres de la calibration du 10/09 — SE = 0,22 avec p = 0,03 — étaient incohérents : z = 6,4 donnerait p ≈ 10⁻¹⁰. Corrigé ici.)

## Pas de la chaîne
1. **Le décor.** Deux objets : β₁ (fixe, inconnu, colonne FIXE) et β̂₁ (aléatoire, colonne ALÉATOIRE, distribution N(β₁, SE²)).
2. **H₀ porte sur le paramètre** [tronc]. H₀ : β₁ = 0 — jamais « β̂₁ = 0 ». Sous H₀ la distribution de β̂₁ est N(0, SE²) : c'est la seule chose que H₀ change (le centre). Au tableau : « H₀ fixe le paramètre, donc elle fixe le centre de la distribution de l'estimateur, donc on peut calculer où tomberait β̂₁ si H₀ était vraie. »
3. **La p-value.** P(|β̂₁| ≥ 1,4 | β₁ = 0) = 0,024 : la probabilité, sous H₀, d'observer au moins aussi extrême. C'est une probabilité sur β̂₁ (aléatoire), conditionnelle à H₀. Figure 1.
4. **L'IC est centré sur β̂₁, pas sur H₀** [tronc]. IC = β̂₁ ± 1,96·SE. Il utilise la largeur (SE) de la distribution, pas son centre — le centre est inconnu. Au tableau : « On ne connaît pas β₁, donc on ne peut pas centrer sur lui, donc on centre sur ce qu'on a, β̂₁, avec la largeur que donne SE. »
5. **Sur quoi porte le 95 %** [tronc]. Sur la **procédure** « tirer un échantillon → calculer β̂₁ ± 1,96·SE » : elle produit un intervalle qui contient β₁ dans 95 % des tirages. L'intervalle en main contient β₁ ou non ; on ne sait pas lequel. Figure 2. Au tableau : « β₁ est fixe, donc il n'a pas de probabilité d'être dans un intervalle, donc le 95 % ne peut porter que sur les intervalles, donc sur la procédure qui les produit sur des tirages répétés. »
6. **Dualité.** 0 ∉ IC95 ⟺ p < 0,05 : même calcul lu dans les deux sens (distance β̂₁ − 0 comparée à 1,96·SE).
7. **Où ça casse** [casse].

## Figures exigées
- **Figure 1 — `plot` + `slider` β̂₁** : densité N(0, 0,62²) ; deux zones grisées au-delà de ±β̂₁ (dessiner en `dyn` un polygone sous la courbe) ; readout p-value. Légende : l'aire est la p-value ; déplacer β̂₁ la fait varier ; H₀ n'a pas bougé.
- **Figure 2 — `plot` + bouton « tirer 50 échantillons »** : vrai β₁ = 1,0 (trait vertical) ; 50 lignes horizontales empilées = 50 IC simulés (β̂ ~ N(1, 0,62²)), colorées vert si l'intervalle contient β₁, rouge sinon ; readout « couverture : 47/50 ». Rejouer plusieurs fois : la couverture oscille autour de 95 %, l'intervalle en main est l'une de ces lignes. Légende : le 95 % est la proportion de lignes vertes sur des tirages répétés, pas une propriété de la ligne qu'on a.

## Où ça casse
- « **97 % de chances que β₁ ≠ 0** » : faux, β₁ n'est pas aléatoire ; la p-value est P(données | H₀), pas P(H₀ | données) — pour ça il faut un prior (fil B).
- « **95 % des échantillons donnent β̂₁ dans [0,18 ; 2,62]** » : faux, l'intervalle bouge avec chaque échantillon ; c'est la proportion d'intervalles contenant β₁ qui vaut 95 %.
- **Multiplicité** : 20 hypothèses testées ⇒ une p < 0,05 attendue sous H₀ partout (p01-04).
- **Significatif ≠ important** : avec n énorme, β̂₁ = 0,001 est significatif. Lire l'IC, pas seulement p.

## Résumé
1. H₀ porte sur le paramètre (β₁ = 0), jamais sur l'estimateur.
2. p-value = P(au moins aussi extrême | H₀) : une probabilité sur β̂₁.
3. IC = β̂₁ ± 1,96·SE : centré sur l'estimateur, largeur donnée par SE.
4. Le 95 % porte sur la procédure (proportion d'intervalles couvrant β₁ sur des tirages répétés).
5. 0 ∉ IC ⟺ p < 0,05.
6. Ni « probabilité que β₁ ≠ 0 », ni « 95 % des β̂ tombent dans cet IC ».

**Phrase d'entretien** : « L'hypothèse nulle porte sur la pente vraie ; sous cette hypothèse l'estimateur est centré en zéro avec la largeur SE, et la p-value est la probabilité d'observer au moins aussi loin de zéro. L'intervalle, lui, est centré sur l'estimateur, et le 95 % décrit la procédure : sur des tirages répétés, 95 % des intervalles qu'elle produit contiennent la vraie pente. »

## Chaîne verbalisée
1. Sur quoi porte H₀ ? → Sur β₁ (fixe), jamais sur β̂₁.
2. Que vaut la p-value ici et que dit-elle ? → 0,024 = P(|β̂₁| ≥ 1,4 | β₁ = 0).
3. Sur quoi l'IC est-il centré, et pourquoi ? → Sur β̂₁ : on ne connaît pas β₁ ; la largeur vient de SE.
4. Sur quoi porte le 95 % ? → Sur la procédure : 95 % des intervalles produits sur des tirages répétés contiennent β₁.
5. Pourquoi « 97 % de chances que β₁ ≠ 0 » est faux ? → β₁ n'est pas aléatoire ; p = P(données | H₀).

## Ce qui a cassé pour Salah
- Q1 du 10/09 : première affirmation corrigée juste ; seconde relue comme « sous H₀, 95 % des β̂₁ tombent dans [0,96 ; 1,84] » — deux erreurs en une : l'IC lu comme centré sur H₀, et le 95 % attaché aux β̂ au lieu des intervalles. Les pas 4 et 5 et la figure 2 existent pour ça.
- ISLR ch. 3 : H₀ posée sur l'estimateur et non sur le paramètre — pas 2.
- « Centre vs largeur » : la distinction doit être visible dans la figure 1 (H₀ fixe le centre, SE la largeur).
- D1 (walkthrough cas 1) a été tenu le 11/09 : cette chaîne est la version courte ; renvoyer vers D1 pour le déroulé complet.

## Exclusions
Pas de Student ici (p01-03). Pas de puissance/β-risk au-delà d'une mention. Pas de correction de Bonferroni (p01-04).

## Questions pour la revue
- **IC arrondi corrigé.** Le spec annonçait `[0,19 ; 2,61]` en tête et dans « Où ça
  casse », incompatible avec son propre calcul : 1,4 ± 1,96·0,62 = [0,1848 ; 2,6152],
  soit **[0,18 ; 2,62]** à deux décimales (et [0,185 ; 2,615] à trois). Corrigé
  partout dans le spec et dans la sheet, qui affiche les deux arrondis.
- **Couverture simulée.** Vérifié par simulation (20 000 répétitions de 50 tirages,
  β₁ = 1, SE = 0,62 connu) : couverture moyenne 47,51/50 = 95,0 %, écart-type du
  compte 1,54. Le « 47/50 » du spec est un tirage plausible mais **48 est le mode**
  (P(48) ≈ 0,26, P(47) ≈ 0,22). La figure 2 affiche le compte réel de chaque tirage
  et la légende dit « autour de 47 ou 48 » plutôt qu'une valeur fixe.
- **Les autres chiffres du fil rouge sont exacts** : z = 1,4/0,62 = 2,2581 → 2,26 ;
  1 − Φ(2,26) = 0,0119 ; p = 0,0239 → 0,024. Seuil de bascule β̂₁ = 1,96·0,62 = 1,215
  (p = 0,050 exactement), 1 − 0,95²⁰ = 0,6415.
- **À trancher à la revue** : la sheet mentionne le mot « Student » une fois, dans H1,
  pour dire que la forme normale est supposée ici et justifiée en p01-03 (le spec le
  fait aussi). Si l'exclusion « pas de Student ici » doit être stricte, retirer la
  demi-phrase de H1.
