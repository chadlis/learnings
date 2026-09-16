---
id: p01-03
series: chain
part: "01"
number: "03"
slug: inference-regression
title: Inférence en régression — σ̂², t, Student, n − p
subtitle: fil A ↔ fil B — d'où viennent le SE d'une pente et la loi de t
prereq: [p01-01, p01-02, p05-01]
anki: [stats::inference, stats::estimation, ml::regression-lineaire, stats::bessel]
bridges: [b03, b04]
next: p01-04
status: ready
---

## Question de la chaîne
Le logiciel affiche pour la pente t = 17,67 et « Student à 198 degrés de liberté ». Refais toute la chaîne : d'où sortent SE, t, Student et 198 ?

## Prérequis
- p05-01 : modèle Y = β₀ + β₁X + ε, E[ε|x] = 0, Var(ε|x) = σ² ; β̂₁ = Ĉov/V̂ar.
- p01-01, p01-02 : distribution d'échantillonnage, IC, p-value.

## Hypothèses posées
- H1 : ε iid, E[ε|x] = 0, Var(ε|x) = σ² (homoscédastique).
- H2 : les x sont fixés (conditionnement) ; l'aléa vient de ε seul.
- H3 : ε gaussien — nécessaire pour que t soit exactement Student ; sans gaussien, asymptotiquement normal.

## Exemple fil rouge
ISLR Advertising, `sales ~ TV`, n = 200, p = 2 paramètres : β̂₁ = 0,0475, SE = 0,0027, t = 17,67, ddl = 198. σ̂ = RSE = 3,26.

## Pas de la chaîne
1. **Le décor.** Le nuage est un tirage : mêmes x, autres ε ⇒ autre nuage ⇒ autre β̂₁. Colonne aléatoire : ε (donc y, donc β̂₁).
2. **β̂₁ est linéaire dans les bruits** [tronc]. β̂₁ = β₁ + Σ wᵢεᵢ, wᵢ = (xᵢ − x̄)/Σ(xⱼ − x̄)². Au tableau : « β̂₁ est une combinaison linéaire des yᵢ, donc en injectant le modèle on obtient β₁ plus une combinaison des bruits, donc l'espérance est β₁ et la variance σ²Σwᵢ² = σ²/Σ(xᵢ − x̄)². »
3. **σ est inconnu : σ̂² = RSS/(n − p)**. Pourquoi n − p et pas n : les résidus ont été ajustés (p contraintes : Σrᵢ = 0, Σrᵢxᵢ = 0), ils sous-estiment σ ; diviser par n − p corrige exactement (E[σ̂²] = σ²). Même geste que Bessel (n − 1) pour la moyenne, où p = 1. Au tableau : « L'ajustement impose p équations linéaires aux résidus, donc ils ont n − p degrés de liberté, donc RSS/(n − p) est sans biais pour σ². »
4. **SE = σ̂/√Σ(xᵢ − x̄)²** — plug-in de σ̂. Sur le fil rouge : 0,0027.
5. **t = β̂₁/SE ~ Student(n − p) sous H₀** [tronc]. Si σ était connu, β̂₁/SE serait N(0,1). Comme SE est estimé (et fluctue), le quotient a des queues plus lourdes : Student(n − p). Quand n − p → ∞, Student → normale. Au tableau : « Le numérateur est normal, le dénominateur est une estimation de σ qui fluctue, donc le quotient a des queues plus lourdes qu'une normale, donc c'est un Student dont les degrés de liberté sont ceux de σ̂². »
6. **Lecture.** t = 17,67 : à 198 ddl le seuil à 5 % est 1,97 ; p ≈ 0. IC95 = 0,0475 ± 1,97·0,0027.
7. **Où ça casse** [casse].

## Figures exigées
- **Figure 1 — `repeat`** : vrai modèle y = 7 + 0,05x + ε, ε ~ N(0, 3,26²), x = les 200 budgets TV (ou uniformes 0–300) ; draw = β̂₁ sur un nouveau tirage de ε ; bins autour de 0,05 ; marque β₁ = 0,05. Readout : écart-type ≈ SE théorique 0,0027.
- **Figure 2 — `plot` + `slider` ddl ∈ [2, 200]** : densité normale et densité Student(ddl) superposées ; à petit ddl les queues sont visibles, à 198 les courbes se confondent. Readout : seuil bilatéral 5 % (2,57 à ddl 5, 1,97 à ddl 198).
- **Figure 3 — `plot`** : deux nuages simulés côte à côte (x concentrés / x étalés), même σ ; readout Var(β̂₁) : le SE de la pente dépend de l'étalement des x.

## Où ça casse
- **Hétéroscédasticité** : β̂₁ reste sans biais, SE et t sont faux (SE robustes — nommer seulement).
- **Dépendance des ε** (séries temporelles, mesures répétées) : SE trop petit.
- **Non-gaussien à petit n** : t n'est plus Student ; à grand n, TCL sauve la normale.
- **Extrapolation** : le SE décrit l'incertitude sur la pente, pas la validité du modèle hors du support des x.

## Résumé
1. L'aléa d'une régression est ε ; β̂₁ = β₁ + Σwᵢεᵢ.
2. Var(β̂₁) = σ²/Σ(xᵢ − x̄)² : bruit sur étalement des x.
3. σ̂² = RSS/(n − p) : les résidus ont n − p degrés de liberté.
4. t = β̂₁/SE ~ Student(n − p) parce que SE est estimé ; → normale quand n grand.
5. Homoscédasticité et indépendance conditionnent SE, pas le non-biais.

**Phrase d'entretien** : « La pente estimée est le vrai coefficient plus une combinaison linéaire des bruits, donc sa variance est σ² sur l'étalement des x ; σ est inconnu, estimé par RSS sur n moins p, ce qui donne au quotient une loi de Student à n moins p degrés de liberté, qui rejoint la normale dès que n est grand. »

## Chaîne verbalisée
1. Qu'est-ce qui est aléatoire dans un nuage de régression ? → ε, donc y, donc β̂₁.
2. Écris β̂₁ en fonction de β₁ et des bruits, conclus. → β₁ + Σwᵢεᵢ ; sans biais ; Var = σ²/Σ(x−x̄)².
3. Pourquoi RSS/(n − p) ? → p contraintes sur les résidus ; sans biais pour σ².
4. Pourquoi Student et pas normale ? → SE estimé, fluctue ; queues plus lourdes ; ddl = n − p.
5. Que casse l'hétéroscédasticité ? → SE (donc t, p, IC), pas le non-biais.

## Ce qui a cassé pour Salah
- 15/09 (revue Anki) : la chaîne H₀/H₁ → t → Student « n'est pas disponible » ; pont fil B → fil A rendu obligatoire. Cette sheet est ce pont : chaque pas est une brique, une seule nouveauté par pas.
- S7 : σ̂²/Bessel travaillé ; le n − p doit être relié explicitement à n − 1 (pas 3).
- Erreur récurrente : β̂₀ = ȳ − β̂₁x̄ (pas ȳ seul) — ne pas la reproduire dans les exemples.
- Scories : chapeaux sur les estimateurs ; ne pas écrire p(y|x,β).

## Exclusions
Pas de test F, pas de régression multiple au-delà de « p paramètres », pas de SE de White, pas de leverage.
