---
id: p05-02
series: chain
part: "05"
number: "02"
slug: logistique
title: Régression logistique — logit, odds ratio, effet marginal
subtitle: ISLR ch. 4 — un modèle linéaire sur les log-cotes, et ce que ça change à la lecture
prereq: [p02-01, p03-01, p05-01]
anki: [ml::logistique, ml::odds-ratio, ml::effet-marginal]
bridges: [b06]
next: p05-03
status: stub
---

## Question de la chaîne
Que modélise une logistique, pourquoi e^β n'est pas « la probabilité double », combien vaut l'effet d'une unité de x sur p, et pourquoi il n'y a pas de forme fermée.

## Prérequis
- p02-01 : log-loss = NLL Bernoulli.
- p03-01 : log-loss convexe, gradient (p − y)x.
- p05-01 : modèle linéaire, lecture d'un coefficient.

## Hypothèses posées
- H1 : **modèle** : log(p/(1 − p)) = β₀ + β₁x — le log-odds est affine en x. C'est l'hypothèse ; la probabilité, elle, n'est pas affine.
- H2 : Y | x ~ Bernoulli(p(x)), observations indépendantes.

## Exemple fil rouge
β₁ = 0,7 : e^0,7 = 2,01 ⇒ « une unité de x double la cote ». Table cote → p :
| p avant | cote | cote ×2 | p après | Δp |
| 0,50 | 1 | 2 | 0,667 | +16,7 pts |
| 0,02 | 0,0204 | 0,0408 | 0,039 | +1,9 pts (la proba « double » — presque) |
| 0,90 | 9 | 18 | 0,947 | +4,7 pts |
Effet marginal ∂p/∂x = β₁p(1 − p) : 0,7·0,25 = 0,175 (17,5 pts) en p = 0,5 ; 0,7·0,0196 = 0,014 (1,4 pt) en p = 0,02.
ISLR Default ~ balance : β̂₀ = −10,65, β̂₁ = 0,0055 ; balance 1 000 : z = −5,15, p = 0,0058 ; balance 2 000 : z = 0,35, p = 0,587. Par 100 $ : cote × e^0,55 = 1,73.

## Pas de la chaîne
1. **Le décor.** Y ∈ {0, 1}. Une droite sur p sort de [0, 1] et suppose un effet constant ; on veut un modèle linéaire qui respecte les bornes.
2. **Le modèle : log-odds affine** [tronc]. cote = p/(1 − p) ∈ ]0, ∞[ ; log cote ∈ ℝ ; on pose log cote = βᵀx. Inverse : p = σ(βᵀx) = 1/(1 + e^{−z}), image **ouverte** ]0, 1[ : jamais 0 ni 1. Au tableau : « La probabilité est bornée mais la log-cote ne l'est pas, donc on met la partie linéaire sur la log-cote, donc p est la sigmoïde d'une fonction linéaire en β, et reste strictement entre 0 et 1. »
3. **e^β est un rapport de cotes, pas de probabilités** [tronc]. +1 en x ⇒ log cote + β₁ ⇒ cote × e^{β₁}. Pour β₁ = 0,7 la cote double partout ; la probabilité passe de 0,50 à 0,667, de 0,02 à 0,039, de 0,90 à 0,947. « La proba double » n'est vrai qu'approximativement quand p est petit (cote ≈ p). Au tableau : « Le coefficient agit sur la log-cote, donc son exponentielle multiplie la cote, donc l'effet sur la probabilité dépend d'où l'on est : maximal au milieu, nul aux bords. »
4. **Effet marginal.** ∂p/∂x = β₁ p(1 − p) — la dérivée de la sigmoïde (chain rule : ∂σ/∂z · ∂z/∂x). 17,5 pts en p = 0,5, 1,4 pt en p = 0,02 pour le même β₁. On rapporte l'effet à une valeur de référence, ou la moyenne des effets.
5. **Seuil = décision, pas modèle.** Le modèle donne p ; prédire 1 si p > s est un choix de coût (p06-03). La frontière p = 0,5 ⇔ z = 0 est **linéaire** en x : la logistique sépare par un hyperplan.
6. **Pas de forme fermée** [tronc]. ∇NLL = Σ(pᵢ − yᵢ)xᵢ = 0 avec pᵢ = σ(βᵀxᵢ) : non linéaire en β ⇒ on itère (descente ou Newton/IRLS) ; convexe ⇒ le minimum trouvé est global (p03-02). Au tableau : « Annuler le gradient donne des équations où β est sous une sigmoïde, donc non linéaires, donc pas de forme fermée, donc on itère, et la convexité garantit l'arrivée. »
7. **Séparation parfaite** : NLL → 0 sans minimum, ‖β‖ → ∞ (p02-01) ; régulariser (p02-02). Signal : coefficients énormes, probabilités à 0,999.
8. **Où ça casse** [casse].

## Figures exigées
- **Figure 1 — `plot` + `slider` x** : sigmoïde p = σ(β₀ + 0,7x) ; tangente au point courant ; readouts p, cote, cote × 2, p après +1, Δp exact, pente β₁p(1 − p). Légende : la cote double partout, la probabilité non.
- **Figure 2 — SVG custom (table cote → p)** : `slider` p avant ; affichage cote, cote × e^β (β réglable), p après, Δp ; trois presets (0,5 / 0,02 / 0,9). Légende : le tableau contre « la proba double ».
- **Figure 3 — `plot`** : deux classes 2D et la frontière z = 0 (droite) ; `slider` seuil s qui déplace la frontière parallèlement. Légende : la frontière est linéaire ; le seuil la translate.

## Où ça casse
- **Lire e^β comme un rapport de probabilités** : faux sauf p petit (pas 3).
- **Rapporter un effet marginal sans dire à quel p** : 17,5 vs 1,4 pts pour le même β.
- **Séparation parfaite** : divergence ; régulariser.
- **Calibration** : les p d'une logistique sont souvent bien calibrées, mais pas après rééquilibrage des classes (p06-04).

## Résumé
1. Modèle : log-cote affine ; p = σ(z) ∈ ]0, 1[.
2. e^β multiplie la cote ; l'effet sur p dépend de p (max au milieu).
3. Effet marginal β p(1 − p) ; le rapporter à un p de référence.
4. Seuil = décision ; frontière z = 0 linéaire.
5. Pas de forme fermée (β sous la sigmoïde) ; convexe ⇒ itérer suffit.
6. Séparation parfaite ⇒ ‖β‖ → ∞ ⇒ régulariser.

**Phrase d'entretien** : « La logistique met la partie linéaire sur la log-cote, pas sur la probabilité : l'exponentielle d'un coefficient est un rapport de cotes, et l'effet sur la probabilité vaut bêta fois p fois un moins p, maximal au milieu et presque nul aux bords. Annuler le gradient donne des équations non linéaires en bêta, donc pas de forme fermée, mais la loss est convexe et une descente suffit ; sous séparation parfaite elle diverge et il faut régulariser. »

## Chaîne verbalisée
1. Sur quoi porte la partie linéaire ? → La log-cote ; p = σ(z), image ]0, 1[.
2. β₁ = 0,7 : que devient p = 0,02 après +1 en x ? → Cote 0,0204 → 0,0408 ⇒ p = 0,039 ; pas 0,04 exactement, et surtout pas « ×2 » en général.
3. Effet marginal en p = 0,5 et 0,02 ? → 17,5 pts ; 1,4 pt.
4. Pourquoi pas de forme fermée ? → Gradient Σ(σ(βᵀx) − y)x non linéaire en β.
5. Que fait la séparation parfaite ? → NLL → 0 sans minimum, ‖β‖ → ∞.

## Ce qui a cassé pour Salah
- Q4.2, **réapparue le 16/09** : « la probabilité double » — le pas 3, la table du fil rouge et la figure 2 sont écrits contre cette phrase ; l'odds ratio est su, c'est le passage cote → p qui manque.
- Effet marginal β p(1 − p) produit seul le 16/09 : pas 4, une brique.
- Learnings : loss positive, image ouverte ]0, 1[, « linéaire en β », « solution en forme fermée ». Chaque formulation apparaît telle quelle.
- Q4.3 (cross-entropy) : renvoyer à p08-03, ne pas redériver.

## Exclusions
Pas de multinomiale, pas d'IRLS détaillé, pas de test de Wald sur β (p01-03 par analogie), pas de calibration (p06-04).
