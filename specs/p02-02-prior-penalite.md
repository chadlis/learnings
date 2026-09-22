---
id: p02-02
series: chain
part: "02"
number: "02"
slug: prior-penalite
title: Du prior à la pénalité — ce que la régularisation fournit
subtitle: fil B — MAP, λ = σ²/τ², +λI translate, L1 tranche ailleurs
prereq: [p02-01, p04-02]
anki: [stats::map, stats::regularisation, ml::ridge, ml::lasso, algebre::eigen]
bridges: [b05, b06, b03]
next: p02-03
status: built
---

## Question de la chaîne
D'où sort λ‖β‖² ? Que fournit-il que les données ne fournissaient pas ? Et pourquoi L1 met des zéros exacts ?

## Prérequis
- p02-01 : NLL, le geste des six pas.
- p04-02 : valeurs propres ; (A + λI)v = (μ + λ)v.
- p00-03 : Bayes, posterior ∝ vraisemblance × prior.

## Hypothèses posées
- H1 : **deuxième et dernière hypothèse** de tout le fil B : une loi sur β **avant** les données (le prior). Gaussien N(0, τ²) ou Laplace(0, τ).
- H2 : le bruit est celui de p02-01 (σ² connu ou jeté).
- H3 : on cherche l'argmax du posterior (MAP), pas le posterior entier (p02-03).

## Exemple fil rouge
Régression colinéaire de D4 : x₁ = (1, 2, 3), x₂ = (2, 4, 6), y = (1, 2, 3), f = β₁x₁ + β₂x₂.
- XᵀX = [[14, 28], [28, 56]], valeurs propres 0 et 70, Xᵀy = (14, 28). Rang 1 : toute la droite s = β₁ + 2β₂ = 1 a RSS = 0.
- Ridge λ = 1 : (XᵀX + I) = [[15, 28], [28, 57]], det = 71, β̂ = (14/71 ; 28/71) = (0,197 ; 0,394). Valeurs propres 1 et 71.
- Sur la droite (1 + 2t, −t) : ‖β‖² = 5t² + 4t + 1, min en t = −0,4 → (0,2 ; 0,4). ‖β‖₁ = |1 + 2t| + |t|, min en t = −0,5 → (0 ; 0,5).
- Classification séparable de p02-01 : λβ² rend la NLL coercive ; λ = 0,01 → β̂ = 3,41 ; 0,1 → 1,85 ; 1 → 0,71.

## Pas de la chaîne
1. **Le décor.** Les données ne suffisent pas : une droite entière de solutions (colinéarité), ou aucune (séparation). Il manque un critère.
2. **Prior sur β** [tronc]. β ~ N(0, τ²) : « les coefficients sont modérés, centrés sur zéro ». Bayes : p(β | D) ∝ L(β) p(β). Au tableau : « Le prior est une hypothèse sur le monde, donc il est discutable et remplaçable, donc il n'est pas un artifice. »
3. **−log prior → pénalité.** Même geste que les pas 4–6 de p02-01, appliqué à β : −log p(β) = ‖β‖²/(2τ²) + cste. MAP = argmin [RSS/(2σ²) + ‖β‖²/(2τ²)] = argmin [RSS + λ‖β‖²], **λ = σ²/τ²**. C'est Ridge, et λ a un sens : bruit fort ou prior étroit ⇒ on croit le prior. Au tableau : « Le MAP minimise la NLL plus le moins log prior, donc un prior gaussien ajoute un terme quadratique, donc c'est L2 avec λ = σ²/τ². »
4. **Ce que la pénalité fournit** [tronc] : l'existence et l'unicité. Colinéarité : RSS constant sur la droite, λ‖β‖² ne l'est pas ⇒ un seul point (0,2 ; 0,4). Séparation : NLL → 0, λβ² → ∞ ⇒ la somme remonte, un minimum existe. Au tableau : « Là où les données ne tranchent pas, la pénalité tranche, donc elle rend la solution unique ou existante, donc l'amélioration en test est une conséquence, pas le mécanisme. »
5. **+λI translate, n'annule pas** [tronc]. (XᵀX + λI)v = (μ + λ)v : chaque valeur propre monte de λ ; 0 devient λ, 70 devient 70 + λ. Toutes > 0 ⇒ inversible. Rien n'est annulé. Au tableau : « Ajouter λI ajoute λ à chaque valeur propre, donc la valeur propre nulle devient λ, donc la matrice devient inversible, donc la forme fermée existe à nouveau. »
6. **L1 tranche ailleurs.** Prior de Laplace ⇒ −log p(β) ∝ ‖β‖₁ ⇒ Lasso. Sur la même droite, le minimum de ‖β‖₁ est en (0 ; 0,5) : une coordonnée exactement nulle. Géométrie : la boule L1 a des coins sur les axes ; la boule L2 est ronde. Pente : L1 constante jusqu'à 0, L2 s'évanouit (p03-01).
7. **λ en pratique.** On ne connaît ni σ² ni τ² ⇒ λ par validation croisée ; l'interprétation bayésienne est une lecture, l'équivalence des formules est un fait.
8. **Où ça casse** [casse].

## Figures exigées
- **Figure 1 — SVG custom via `plot`** : plan (β₁, β₂) ∈ [−1, 2]² ; la droite des solutions s = 1 (trait) ; boule L2 (cercle) et boule L1 (losange) de rayon réglé par un `slider` ; marquer le point de contact avec la droite : (0,2 ; 0,4) pour le cercle, (0 ; 0,5) pour le losange. Légende : la pénalité choisit le point de la droite le plus proche de l'origine au sens de sa norme ; L1 touche sur un axe.
- **Figure 2 — `plot` + `slider` λ ∈ [0, 5]** : les deux valeurs propres de XᵀX + λI en fonction de λ (deux droites de pente 1, partant de 0 et 70 — axe y en log ou coupé) ; readout « plus petite valeur propre = λ ». Légende : translation, pas annulation.
- **Figure 3 — `plot` + `slider` λ** : NLL(β) de la classification séparable + λβ² ; minimum marqué ; readout β̂. Légende : la pénalité fait exister le minimum.

## Où ça casse
- **Prior faux** : L2 sur des coefficients vraiment sparse répartit sur des features inutiles ; L1 sur des effets diffus en éteint à tort. Le critère ajouté doit correspondre à ce qu'on croit du monde.
- **Échelle** : ‖β‖² dépend des unités ; standardiser avant de pénaliser, sinon λ pénalise les features à petite échelle.
- **Intercept** : ne se pénalise pas (il n'a pas de raison d'être proche de 0).
- **« Régulariser pour éviter l'overfitting »** : conséquence, pas mécanisme ; dire ça en entretien sans le mécanisme est ce qui coûte.

## Résumé
1. Deux hypothèses dans tout le fil B : le bruit (p02-01) et le prior (ici).
2. MAP = NLL + (−log prior) ; gaussien → λ‖β‖², λ = σ²/τ² ; Laplace → λ‖β‖₁.
3. La pénalité fournit existence et unicité : elle tranche là où les données ne tranchent pas.
4. +λI translate le spectre de λ ; rien n'est annulé.
5. L1 tranche sur un coin : zéros exacts ; L2 tranche au plus près : jamais zéro.
6. λ par CV ; standardiser ; pas l'intercept.

**Phrase d'entretien** : « La pénalité L2 est le moins log d'un prior gaussien sur les coefficients, avec λ égal au rapport variance du bruit sur variance du prior. Ce qu'elle fournit, c'est l'existence et l'unicité : sous colinéarité elle choisit le point de norme minimale, et +λI translate chaque valeur propre de λ sans rien annuler. Un prior de Laplace donne L1, qui tranche sur un coin de sa boule et met des coefficients exactement à zéro. »

## Chaîne verbalisée
1. D'où sort λ‖β‖² ? → −log d'un prior N(0, τ²) ; MAP ; λ = σ²/τ².
2. Que fournit la pénalité sous colinéarité ? → L'unicité : RSS constant sur la droite, la norme non.
3. Que fait +λI aux valeurs propres ? → Les translate de λ ; 0 → λ ; inversible.
4. Pourquoi L1 met des zéros exacts ? → Coin de la boule sur un axe ; pente constante jusqu'à 0.
5. Que fournit la pénalité sous séparation parfaite ? → L'existence : la NLL seule n'a pas de minimum.

## Ce qui a cassé pour Salah
- 15/09 : « +λI **annule** » au lieu de « translate » — le pas 5 est écrit contre cette erreur, avec la figure 2.
- 15/09 : le raisonnement p > n (rang, valeur propre nulle) non récupérable juste après l'avoir prouvé — le pas 4 doit rester à une brique : « droite de solutions ⇒ pas d'unicité ⇒ la pénalité choisit ».
- Q16.2 (10/09) réussie : Ridge = gaussien, Lasso = Laplace ; Q8.1 réussie : gradient L1 constant. Ne pas redémontrer, réutiliser.
- Q16.3 : petit n → p02-03.
- « On régularise pour éviter l'overfitting » : phrase fausse tentante, à nommer comme telle (D4 le fait).

## Exclusions
Pas d'Elastic Net au-delà d'une ligne. Pas de chemin de régularisation complet (p05-03). Pas de dérivation de la variance de Ridge.

## Questions pour la revue
- **Tous les chiffres du spec ont été vérifiés par script et sont justes** — validé 16/09 : XᵀX = [[14,28],[28,56]] (v.p. 0 et 70), Xᵀy = (14,28) ; ridge λ = 1 → det 71, β̂ = (14/71 ; 28/71) = (0,197 ; 0,394), v.p. 1 et 71 ; min ‖β‖² en t = −0,4 → (0,2 ; 0,4) ; min ‖β‖₁ en t = −0,5 → (0 ; 0,5) ; séparable λ = 0,01 / 0,1 / 1 → β̂ = 3,4114 / 1,8472 / 0,7148, soit 3,41 / 1,85 / 0,71. Aucune correction apportée au spec.
- **Constante de λ pour le prior de Laplace** — validé 16/09 : le spec ne la donne pas. La sheet écrit λ = 2σ²/τ, obtenu en multipliant RSS/(2σ²) + ‖β‖₁/τ par 2σ². À confirmer : c'est la convention qui garde le même facteur 2σ² que pour le cas gaussien.
- **Conventions de λ entre p02-02 et p03-01** — validé 16/09, tranché en revue 2 : les deux fiches écrivent désormais l'objectif `L + λ·pen`, loss **sans ½** et pénalité **sans ½**. p03-01 (pas 7) : L(θ) = (θ−1)², θ̂ = 1/(1+λ) en L2 et max(0, 1−λ/2) en L1. p02-02 (pas 6) : b/(1+λ) en L2 et signe(b)·max(0, |b|−λ/2) en L1. Le zéro exact tombe au même endroit dans les deux, λ = 2|b| : λ = 2 chez p03-01 (b = 1), λ = 1,6 ici (b = 0,8). Plus d'écart de facteur 2.
- **Ordre des figures** — validé 16/09 : les figures exigées 1 (plan/boules) et 3 (NLL séparable + λβ²) appartiennent toutes deux au pas 4 (« unicité » et « existence »), et la figure 2 (valeurs propres) au pas 5. La sheet les numérote donc dans l'ordre de lecture : Figure 1 = plan, Figure 2 = NLL séparable, Figure 3 = valeurs propres. Contenu identique au spec, seul l'indice d'affichage change.
- **Liens en attente (9 WARN au validateur)** — validé 16/09 : `bridge-03`, `bridge-05`, `bridge-06` et `chain-p02-03` ne sont pas encore écrits. Les cibles sont posées, elles se résoudront à l'écriture de ces fiches.

**Arbitrage de revue, 16/09.** λ = 2σ²/τ pour le prior de Laplace est **confirmé** : même facteur 2σ² que le cas gaussien, donc les deux pénalités se lisent sur la même échelle. Ordre des figures **validé** (ordre de lecture, pas ordre du spec).

**Arbitrage de revue 2, 16/09.** Le bloc « zéro exact en forme fermée » (pas 6) passe à la convention du site — validé 16/09 : critère `(β − b)² + λ·pen(β)`, loss **sans ½**, `pen = β²` et non `½β²`. Résultat L2 **inchangé** : `β̂ = b/(1+λ)`. Résultat L1 : `β̂ = signe(b)·max(0, |b| − λ/2)`, vérifié par script contre une minimisation numérique. Les chiffres affichés suivent, avec b = 0,8 : λ = 0,5 → 0,533 / 0,550 ; λ = 1 → 0,400 / 0,300 ; λ = 1,6 → 0,308 / **0**. Le seuil du zéro exact est λ = 2|b| — **même seuil que p03-01, pas 7, avec b = 1** (λ = 2 = |L′(0)|), et la sheet le dit en toutes lettres.

Ce qui **ne change pas** : le point de contact (0 ; 0,5) de la figure 1 et du tableau des priors. Il sort d'un argument de **norme minimale sur la droite des solutions** — quel point du sous-espace RSS = 0 la boule L1 touche en premier — pas d'un seuillage en λ. Aucune figure ni aucun readout n'affichait le seuil L1 : la figure 2 chiffre la pénalité λβ², déjà sans ½. Statut **reviewed**.

- **Chiffres du delta : tous revérifiés, un seul arrondi corrigé** — 19/09 corr(x₁, x₂) = 0,99761 ; XᵀX = [[55 ; 110,6], [110,6 ; 222,6]], μ = 0,038334 et 277,5617, conditionnement 7 240,6 ; v_min = (−0,8955 ; 0,4450), rapport −2,012 ; OLS β̂ = (−0,5974 ; 0,7989), β̂₁ + 2β̂₂ = 1,00038 ; RSS = 0,011992, σ̂² = 0,0039973 ; écarts-types 0,3229 et 0,00380, rapport 85,1 = √7 240,6 ; ridge λ = 1 → μ 1,0383 et 278,60, conditionnement 268,3, β̂ = (0,1699 ; 0,4158) ; table λ = 0 / 0,1 / 1 / 10 conforme. Séparation : λ = 10⁻⁶ → β̂ = 11,383 ; prior noyé : 0,98592 / 0,99857 / 0,999857. **Seule correction** : le delta écrit « β̂₁ + 2β̂₂ reste entre 0,988 et 1,012 » ; les bornes exactes du leave-one-out sont **0,9879** (sans le 4ᵉ point) et **1,0121** (sans le 5ᵉ). La sheet écrit 0,988 et 1,012.
- **SL.plane ne sait pas dessiner cette figure** — 19/09 Le delta exige `SL.plane` pour l'ellipse de confiance. `SL.plane` est le visualiseur d'application linéaire (grille + carré unité sous une matrice 2×2) : il n'expose ni ellipse, ni nuage de points, ni readouts. La figure 4 est donc faite en `SL.plot`, avec l'ellipse tracée par `P.seg` dans la couche `dyn` — donc sans SVG custom hors `SL.plot`, comme la contrainte l'exige. À confirmer.
- **σ²(XᵀX + λI)⁻¹ est lue comme la covariance du posterior** — 19/09 Les demi-axes de la figure valent σ̂/√(μₖ + λ), ce que le delta prescrit. C'est **exactement** la covariance du posterior gaussien avec λ = σ²/τ² — cohérent avec le cadre MAP de cette chaîne. Ce n'est pas la variance d'échantillonnage de l'estimateur ridge, qui est en sandwich, σ²μₖ/(μₖ + λ)². Les deux coïncident en λ = 0. Faut-il le dire dans la sheet, ou est-ce le sujet de p02-03 ?
- **7e maillon verbalisé et 8e ligne de résumé** — 19/09 Le delta les demande explicitement ; `tools/validate_sheet.py` bornait à 4–6 et ≤ 7. Bornes portées à 4–7 et ≤ 8 dans un commit d'outillage séparé, sans retirer ni reformuler aucun maillon existant. À confirmer en revue.

## Révision v2 (18/09/2026)

### Pas ajouté — « Quand rien n'est nul : le mal conditionné » [tronc]
Placement : après « +λI translate, n'annule pas », avant « L1 tranche ailleurs ». Les pas suivants sont renumérotés.

Règle. À r = 0,99, XᵀX est **inversible** : aucune valeur propre n'est nulle, la solution est unique. Ce qui casse n'est pas l'existence, c'est la variance :
Var(β̂) = σ²(XᵀX)⁻¹ = σ² Σₖ vₖvₖᵀ / μₖ
La variance de β̂ le long du vecteur propre vₖ vaut σ²/μₖ. Une petite valeur propre ne supprime pas la solution, elle la rend **instable** dans sa direction. +λI la relève de λ : la variance dans cette direction retombe à σ²/(μₖ + λ).

Exemple fil rouge de ce pas (distinct du jeu colinéaire exact) : x₁ = (1, 2, 3, 4, 5), x₂ = (2,2 ; 3,8 ; 6,2 ; 7,8 ; 10,2), corrélation 0,9976 ; y = (1,2 ; 1,8 ; 3,2 ; 3,9 ; 5,1) ; modèle f = β₁x₁ + β₂x₂, sans intercept.

Application chiffrée :
- XᵀX = [[55 ; 110,6], [110,6 ; 222,6]] · valeurs propres **0,038** et **277,6** · conditionnement **7 240**.
- v_min = (−0,896 ; 0,445) ∝ (−2 ; 1) — la direction « échanger β₁ contre β₂ » ; v_max ∝ (1 ; 2), la direction où les données parlent.
- OLS : β̂ = (**−0,597** ; **0,799**) — signes opposés — alors que la combinaison stable β̂₁ + 2β̂₂ vaut 1,000.
- σ̂² = RSS/(n − p) = 0,0120/3 = 0,0040. Écart-type de β̂ le long de v_min : √(0,0040/0,038) = **0,32** ; le long de v_max : **0,0038**. Rapport 85 = √7 240.
- Retirer un seul point : β̂₁ va de −0,45 (sans le 2ᵉ) à −0,97 (sans le 4ᵉ) ; β̂₁ + 2β̂₂ reste entre 0,988 et 1,012.
- Ridge λ = 1 : valeurs propres 1,04 et 278,6, conditionnement **268** ; β̂ = (0,17 ; 0,42), tout près du point de norme minimale (0,2 ; 0,4) du pas « ce que la pénalité fournit ».

| λ | μ_min + λ | conditionnement | β̂ |
| --- | --- | --- | --- |
| 0 | 0,038 | 7 240 | (−0,60 ; 0,80) |
| 0,1 | 0,138 | 2 007 | (−0,02 ; 0,51) |
| 1 | 1,04 | 268 | (0,17 ; 0,42) |
| 10 | 10,0 | 29 | (0,19 ; 0,39) |

Au tableau : « Aucune valeur propre n'est nulle, donc la solution est unique, donc ce qui casse n'est pas l'existence mais la variance : σ²/μ_min explose le long de v_min, donc deux coefficients de signes opposés qui se compensent, donc quelques lignes en moins les font basculer ; +λI relève μ_min de λ, donc la variance dans cette direction redescend. »

Distinction à écrire en clair, une phrase : colinéarité **exacte** ⇒ valeur propre nulle ⇒ pas d'unicité (pas 1 et 4) ; colinéarité **presque** exacte ⇒ valeur propre minuscule ⇒ unicité mais variance explosive (ce pas). Même remède, deux mécanismes.

### Figure exigée
SL.plane : le plan (β₁, β₂). Ellipse de confiance de β̂ (axes v_min / v_max, demi-axes ∝ 1/√(μₖ + λ)), les cinq β̂ leave-one-out en points à λ = 0, le point de norme minimale (0,2 ; 0,4) en repère. Curseur λ ∈ [0 ; 10] (échelle log). Readouts : μ_min + λ, conditionnement, écart-type le long de v_min, β̂. Légende : « À λ = 0 l'ellipse est une aiguille le long de (−2 ; 1) et les cinq points s'y étalent ; monte λ : l'aiguille se referme, le centre glisse vers (0,2 ; 0,4). »

### Pas « ce que la pénalité fournit » — application à compléter (séparation)
Après le tableau λ → β̂ (3,41 ; 1,85 ; 0,71), ajouter la ligne λ = 10⁻⁶ → 11,4 et la lecture : **β̂ sous séparation n'est pas une estimation.** Les données disent « le plus grand possible » ; le chiffre est entièrement fixé par λ. Ne jamais l'interpréter — ni lui, ni son odds ratio, ni son signe comparé à un autre coefficient.

### Pas « λ en pratique » — paragraphe ajouté : le prior est noyé là où les données parlent
XᵀX croît avec n ; λI ne bouge pas. Jeu colinéaire exact répliqué k fois (n = 3k) : XᵀX = k·[[14, 28], [28, 56]], valeurs propres 0 et 70k. Facteur de rétrécissement dans la direction des données : 70k/(70k + λ).

| n | facteur à λ = 1 |
| --- | --- |
| 3 | 0,986 |
| 30 | 0,9986 |
| 300 | 0,99986 |

Dans la direction plate, la valeur propre reste 0 → λ quel que soit n : le prior y est la seule voix, pour toujours. Au tableau : « XᵀX croît avec n et λI ne bouge pas, donc là où les données parlent le prior est noyé quand n grandit, donc là où elles se taisent il reste la seule voix, donc λ se règle en fonction de n et jamais dans l'absolu. » Renvoi p02-03 pour le posterior entier.

### Où ça casse — limite ajoutée
**Séparation sans bug.** Deux cas réels, sans leakage : une modalité rare d'une variable catégorielle à haute cardinalité (user_id, merchant_id one-hot) où tous les exemples portent le même label — quasi-séparation ; et p > n (texte, bag-of-words), où un hyperplan séparateur existe presque toujours. Signature : un coefficient qui grimpe avec les itérations, une loss qui ne se stabilise jamais. C'est pourquoi une logistique non régularisée n'est jamais utilisée sur du texte.

### Résumé — lignes ajoutées
7. À 0,99 rien n'est nul : unicité, mais Var(β̂) = σ² Σ vₖvₖᵀ/μₖ explose le long de v_min ; +λI la fait redescendre.
8. β̂ sous séparation est le prior qui parle ; et quand n grandit, le prior est noyé là où les données parlent, seule voix là où elles se taisent.

### Chaîne verbalisée — maillons ajoutés (6e, 7e)
« Corrélation 0,99 entre deux features : qu'est-ce qui casse, exactement ? » → « Pas l'existence : XᵀX est inversible. La variance le long de v_min, σ²/μ_min — coefficients de signes opposés, instables à dix lignes près. +λI relève μ_min. »
« Que vaut β̂ = 6 obtenu sous séparation avec λ = 0,1 ? » → « Rien : c'est λ qui parle. Change λ, il change. On ne l'interprète pas. »

### Ce qui a cassé pour Salah — 18/09 (re-mesure, Q2 et Q6, non acquis)
- Q2 : à r = 0,99, XᵀX déclarée « matrice de covariance, non inversible, noyau non nul » — faux, et le lien avec l'instabilité décrite (coefficients énormes de signes opposés, bascule quand on retire 10 lignes) n'a pas été fait. Le pas ajouté est écrit contre cette réponse. « +λI la rend positive et inversible » a été donné comme résultat, sans le mécanisme de translation du spectre (pas 5 existant, à produire).
- Q2, dernier volet (n : 500 → 5 millions) : non répondu. Le paragraphe « prior noyé » est la réponse.
- Q6 : « le coefficient grimpe sans limite » donné comme mécanisme (c'est le symptôme) ; la séparation parfaite non nommée, « le MLE n'existe pas » non dit ; β̂ = 6 non lu comme le prior qui parle ; « situations réelles » confondues avec la colinéarité de Q2. La limite ajoutée et la lecture ajoutée au pas 4 sont la réponse.
- Le 15/09 avait déjà noté « +λI annule » ; le 18/09 confirme que le pas 5 n'est pas encore produit de mémoire.

### Exclusions — inchangées, plus : pas de VIF, pas de SE robustes, pas d'Elastic Net au-delà de la mention existante.

## Révision v3 (22/09/2026)

Delta rédigé par Salah en séance (correction de fond, pas de refonte : chiffres, figures, ordre des sections et convention « loss sans ½, pénalité pesée par λ seul » inchangés).
1. **Prior vs MAP** — tableau « deux priors, deux croyances ». L'ancienne cellule N(0, τ²) (« aucun n'est exactement nul ») attribuait au prior une propriété de l'estimateur MAP : toute loi continue donne P(β = 0) = 0, Laplace comprise. Cellule N(0, τ²) → « modérés, centrés sur zéro : les grands sont très improbables (queue en e^{−β²}) » ; cellule Laplace complétée « (densité en pointe en 0, queues plus lourdes) » ; note sous le tableau : aucun des deux priors ne met de masse en 0 ; zéro exact = propriété du MAP sous Laplace (pente de |β| constante jusqu'à 0, cf. « L1 tranche ailleurs » #s7 et p03-01 habit 3) ; sous gaussien le MAP rétrécit sans annuler (pente de β² nulle en 0) ; moyenne a posteriori jamais exactement nulle sous aucun des deux.
2. **Décor, jeu séparable** : « strictement décroissante : β̂ n'existe pas » → « strictement décroissante et bornée inférieurement par 0 sans l'atteindre : le MLE β̂ n'existe pas » (le paramètre existe, c'est l'estimateur qui manque). Chapeaux vérifiés : présents dans le HTML (`span.hat`), c'est l'extraction texte qui les perd.
3. **Résumé, point 5** : « jamais zéro — sauf si l'estimation non pénalisée l'est déjà (β̂ = b/(1 + λ) ne s'annule que si b = 0) ».
4. **Pas 3, d'où sort la norme** (demande de Salah devant l'écran) : paragraphe + équation sous « −log p(β) = ‖β‖²/(2τ²) + cste » — p coordonnées indépendantes N(0, τ²) ⇒ produit ⇒ −log = somme Σ_j β_j²/(2τ²) + p log √(2πτ²) ; Σ_j β_j² est ‖β‖² par définition (carré : gaussienne ; somme : indépendance) ; Laplace ⇒ ‖β‖₁/τ ; prior N(0, Σ) corrélé ⇒ βᵀΣ⁻¹β, plus la norme simple.
- Version : titre « · v3 », meta `status=v3`, footer « v3 du 22/09/2026 ».

## Révision v4 (22/09/2026)

Delta rédigé par Salah (prompt « Révision des trois fiches du fil B », section 2 ; 2.1–2.3 et 2.5 déjà en v3). Chiffres et figures inchangés.
- 2.2 : « le MLE β̂ n'existe pas (le paramètre existe, c'est l'estimateur qui manque) », renvoi à p02-01 #s6 (pas 5) pour la dérivation de NLL(β).
- 2.4 décor colinéaire : Xᵀy comme second membre des équations normales (∇RSS = −2Xᵀ(y − Xβ)), (x₁·y, x₂·y) = (14, 28) ; valeurs propres = directions de l'espace des coefficients, μ = 70 le long de (1, 2), μ = 0 le long de (2, −1) avec Xv = 2x₁ − x₂ = 0 et XᵀX(2, −1) = 0 ; contre-idée « features identiques ⇒ κ = 1 » écartée (κ = 1 ⇔ XᵀX = cI).
- 2.6 pas 5 : forme fermée dérivée en cinq lignes (critère, gradient, λβ = λIβ, (XᵀX + λI)β = Xᵀy, inversible car μ_k + λ > 0) ; pourquoi (XᵀX)⁻¹Xᵀy échoue à λ = 0 (v envoyé sur 0 ⇒ aucune inverse ne peut choisir ; le système a des solutions, la formule n'a plus de sens).
- 2.7 : κ = μ_max/μ_min défini avant la table du pas 5 ; thermomètre de « +λI relève μ_min » ; rapport, pas raideur — la stabilité de β̂ est fixée par μ_min ; renvoi « partie optimisation ».
- 2.8 : table λ / μ_min + λ / κ / β̂ du pas 6 supprimée (doublon de la figure 4).
- 0.2 : « marches 8 à 11 » → « 9 à 12 » (×2) ; « pas 1 de p02-01 » → « pas 0 ».
- Version : titre · v4, meta status=v4, footer v4 du 22/09/2026.
