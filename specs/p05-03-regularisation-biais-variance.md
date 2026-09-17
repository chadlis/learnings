---
id: p05-03
series: chain
part: "05"
number: "03"
slug: regularisation-biais-variance
title: Régularisation vue en biais-variance — le chemin de λ
subtitle: modèles linéaires — rétrécir les coefficients échange un biais contre de la variance ; λ se lit sur une courbe en U
prereq: [p02-02, p06-01, p06-02, p03-01]
anki: [ml::ridge, ml::lasso, ml::regularisation, ml::biais-variance]
bridges: [b03, b05]
next: p06-01
status: reviewed
---

## Question de la chaîne
Le fil B dit d'où vient λ‖β‖² (un prior) et ce qu'il fournit (existence, unicité). Cette chaîne dit ce qu'il **coûte et rapporte** en erreur de prédiction, et comment choisir λ sans prior.

## Prérequis
- p02-02 : ridge = prior gaussien, lasso = Laplace ; +λI ; L1 tranche sur un coin.
- p06-01 : erreur = biais² + variance + σ².
- p06-02 : λ par CV, preprocessing dans le pli.
- p03-01 : L1 zéros exacts (pente constante).

## Hypothèses posées
- H1 : modèle linéaire (p05-01) avec p colonnes, éventuellement p > n ou colinéaires.
- H2 : colonnes **standardisées** (moyenne 0, écart-type 1) : sinon λ pénalise les unités.
- H3 : intercept non pénalisé.

## Exemple fil rouge
Cas orthonormé (XᵀX = I, une coordonnée) : β̂_OLS ~ N(β, σ²) ; ridge β̂_λ = β̂_OLS/(1 + λ).
- Biais = −λβ/(1 + λ) ; Var = σ²/(1 + λ)². MSE(λ) = (λ/(1 + λ))²β² + σ²/(1 + λ)².
- β = 1, σ² = 0,5 : MSE(0) = 0,5 (OLS) ; MSE(0,25) = 0,36 ; MSE(0,5) = **0,333** (minimum) ; MSE(1) = 0,375. Le λ optimal vaut σ²/β² — le λ = σ²/τ² du fil B avec τ² = β², le prior qui « connaît » l'ordre de grandeur de β.
- Lasso, même cas : β̂_λ = signe(β̂)·max(0, |β̂| − λ/2) (convention du site) : zéro exact si |β̂| ≤ λ/2.
- ISLR Credit (qualitatif) : ridge sur 10 prédicteurs, chemin de λ = 10⁻² à 10⁴ : les coefficients de `income`, `limit`, `rating` (colinéaires) se compensent à λ petit et se lissent ensemble ; à λ grand tout tend vers 0.

## Pas de la chaîne
1. **Le décor.** Sans pénalité, β̂_OLS est sans biais, mais sa variance peut être énorme (colinéarité, p proche de n) : sans biais et inutilisable.
2. **Ridge rétrécit** [tronc]. Dans le cas orthonormé, β̂_λ = β̂_OLS/(1 + λ) : chaque coefficient est divisé par 1 + λ. En général (XᵀX + λI)⁻¹Xᵀy rétrécit chaque direction propre par λᵢ/(λᵢ + λ) : fort là où les données informent peu (petit λᵢ), faible là où elles informent beaucoup (p02-02, p04-02). Au tableau : « La ridge divise chaque direction propre par sa valeur propre plus λ, donc elle rétrécit surtout les directions où les données sont plates, donc elle tue la variance là où elle est la plus grande. »
3. **Le prix : un biais** [tronc]. E[β̂_λ] = β/(1 + λ) ≠ β. Biais² = (λ/(1 + λ))²β², croît avec λ ; Var = σ²/(1 + λ)², décroît avec λ. MSE en U ; minimum à λ = σ²/β². Au tableau : « Rétrécir tire vers zéro, donc introduit un biais qui croît avec λ, et divise la variance, qui décroît avec λ, donc l'erreur totale a un minimum strictement positif en λ dès que la variance n'est pas nulle. »
4. **Il existe toujours un λ > 0 qui bat l'OLS** en MSE (théorème de Hoerl-Kennard, nommer) : la dérivée du MSE en λ = 0 est −2σ² < 0. L'OLS n'est optimal que parmi les estimateurs **sans biais** ; on n'a jamais demandé ça.
5. **Lasso : rétrécit et sélectionne.** Soft-threshold : les petits coefficients deviennent exactement 0 (p02-02 pas 6, p03-01 pas 8). Même compromis biais-variance, plus une **sélection** : modèle plus lisible, mais parmi des colonnes corrélées le lasso en garde une arbitrairement (instabilité) ; ridge les partage. Elastic net : les deux.
6. **Le chemin de λ.** Tracer β̂_λ pour λ de 0 à ∞ : ridge, courbes lisses vers 0 ; lasso, courbes linéaires par morceaux qui s'annulent une à une. La lecture du chemin dit quelles variables comptent à quelle force de pénalité. Figure 1.
7. **Choisir λ** [tronc]. On ne connaît ni σ² ni τ² : CV sur une grille log-espacée (10⁻³ à 10³), standardisation refaite dans chaque pli (p06-02), et « one-standard-error rule » : le λ le plus grand dont l'erreur CV reste à moins d'un SE du minimum (plus simple, même performance). Au tableau : « Le λ optimal dépend de quantités inconnues, donc on le choisit sur des données non vues, donc par CV, sur une grille en log parce que l'effet de λ est multiplicatif. »
8. **Régulariser n'est pas « éviter l'overfitting ».** C'est la conséquence ; le mécanisme est l'échange biais contre variance, rendu possible parce que rétrécir vers 0 est une bonne direction quand les vrais coefficients sont modérés (le prior). Dire la conséquence sans le mécanisme, en entretien, ne passe pas (p02-02).
9. **Où ça casse** [casse].

## Figures exigées
- **Figure 1 — `plot` + `slider` λ ∈ [0, 3]** : biais², variance et MSE du cas orthonormé (β = 1, σ² = 0,5) en fonction de λ ; le minimum marqué à 0,5 ; `slider` σ² qui déplace le minimum (λ* = σ²/β²). Légende : plus de bruit, plus de pénalité.
- **Figure 2 — `plot` (chemins de λ)** : sur un jeu synthétique de **6 colonnes = 2 fortes (β = 1,5) + 2 copies bruitées de ces fortes (β = 0, corrélées à 0,93 et 0,95) + 2 nulles**, les chemins ridge et lasso en fonction de log λ, côte à côte ; readout du nombre de coefficients non nuls et de la paire x₂/x₄. Légende : ridge lisse tout, lasso éteint un à un ; **chaque forte et sa copie se partagent le signal (ridge) ou se le disputent (lasso)**.
- **Figure 3 — `plot`** : erreur CV en fonction de log λ sur le même jeu (simulation 5-fold en JS), avec le minimum et la barre « 1 SE », λ_1SE marqué. Légende : choisir le plus simple dans la marge du bruit.

## Où ça casse
- **Non standardisé** : λ pénalise les unités ; une colonne en centimes est écrasée, une en millions non.
- **Intercept pénalisé** : biais sur le niveau moyen sans raison.
- **λ choisi sur le test** : biais du max (b02) ; CV, puis test une fois.
- **Vrais coefficients grands et peu nombreux** avec ridge : elle les rétrécit aussi ; lasso ou elastic net.
- **Lasso avec p > n** : sélectionne au plus n variables ; corrélées ⇒ choix instable.

## Résumé
1. OLS : sans biais, variance possiblement énorme ; ce n'est pas un optimum en MSE.
2. Ridge divise chaque direction propre par λᵢ/(λᵢ + λ) : biais croissant, variance décroissante ⇒ U ; λ* = σ²/β² dans le cas simple.
3. Il existe toujours un λ > 0 qui bat l'OLS.
4. Lasso : soft-threshold, sélection, instable sur les corrélées ; elastic net.
5. λ par CV en grille log, standardisation dans le pli, règle 1 SE.
6. Mécanisme : biais contre variance ; « éviter l'overfitting » est la conséquence.

**Phrase d'entretien** : « La régularisation échange un biais contre de la variance : la ridge rétrécit chaque direction propre en proportion de ce que les données y disent, la variance tombe plus vite que le biais ne monte, et il existe toujours un λ positif qui bat les moindres carrés. Le lasso fait la même chose avec des zéros exacts. λ se choisit par validation croisée sur une grille en log, standardisation refaite dans chaque pli, et je prends le plus grand λ à un écart-type du minimum. »

## Chaîne verbalisée
1. Que fait la ridge à β̂_OLS dans le cas orthonormé ? → Divise par 1 + λ.
2. Quel est le prix, quel est le gain ? → Biais (λ/(1 + λ))²β² ; variance σ²/(1 + λ)² ; U, minimum à σ²/β².
3. Pourquoi un λ > 0 bat toujours l'OLS ? → Dérivée du MSE en 0 négative ; l'OLS n'est optimal que sans biais.
4. Ridge vs lasso sur deux colonnes corrélées ? → Ridge partage ; lasso en garde une, instable.
5. Comment choisir λ ? → CV, grille log, standardisation dans le pli, règle 1 SE.
6. Pourquoi « régulariser pour éviter l'overfitting » ne suffit pas ? → C'est la conséquence ; le mécanisme est biais contre variance via un prior de coefficients modérés.

## Ce qui a cassé pour Salah
- p02-02 a le **pourquoi** (prior, existence, unicité) ; cette chaîne a le **combien** (biais, variance, U). Ne pas répéter p02-02 : y renvoyer aux pas 2 et 5.
- Q16 (Ridge = gaussien, Lasso = Laplace) et Q8.1 (gradient L1) acquises ; le pas 5 les réutilise.
- ISLR ch. 6 (subset selection) : exclu au-delà d'une phrase, l'entretien demande ridge/lasso, pas best subset.

## Exclusions
Pas de best subset / forward stepwise au-delà d'une phrase, pas de dérivation générale de la variance de ridge (le cas orthonormé suffit), pas de group lasso.

## Questions pour la revue

Construction de la sheet du 17/09. Tous les chiffres du bloc « Exemple fil rouge »
ont été revérifiés par script (minimisation numérique du MSE sur 300 001 points,
argmin du critère L1 sur 400 001 points) : **aucun n'est faux**. MSE(0) = 0,500 ;
MSE(0,25) = 0,360 ; MSE(0,5) = 0,333 (minimum, atteint exactement en σ²/β²) ;
MSE(1) = 0,375 ; dérivée du MSE en λ = 0 égale à −2σ² ; seuillage doux
max(0, |β̂| − λ/2) conforme à la convention du dépôt. Rien n'a été corrigé.

Trois points restent à trancher :

1. **Figure 2, composition du jeu.** — validé 17/09 Le spec demandait « 6 colonnes
   (2 fortes, 2 faibles, 2 nulles, 2 corrélées) » — quatre rôles pour six colonnes.
   **Lecture retenue en revue 5 : les deux colonnes corrélées sont des copies bruitées
   des deux fortes, et les « faibles » sont retirées** — 6 colonnes = 2 fortes +
   2 copies corrélées aux fortes + 2 nulles. La première lecture (« les fortes *sont*
   les corrélées », plus 2 faibles) ne correspondait pas : **le jeu a été refait**.
   Jeu actuel : n = 50, β = (1,5 ; 1,5 ; 0 ; 0 ; 0 ; 0), σ = 1,5, x₃ ≈ x₁ (corr. 0,93)
   et x₄ ≈ x₂ (corr. 0,95). Il sert la chaîne mieux que le précédent : le spectre a
   **deux** directions plates (3,2 et 2,4), une par paire, et l'OLS y montre que la
   somme d'une paire est trois fois mieux déterminée que ses deux moitiés (SE 0,22
   contre 0,63).

2. **ISLR Credit remplacé.** Le spec donne l'exemple Credit en *qualitatif*
   (« les coefficients de income, limit, rating se compensent »). Une sheet ne
   pouvant pas embarquer le jeu Credit, j'ai construit un jeu synthétique qui
   produit exactement le phénomène décrit — OLS donne 0,735 et 2,663 pour deux
   vrais coefficients égaux à 1,5, somme bien estimée (3,40 pour 3,00),
   répartition du bruit pur — et tous les chiffres de la sheet en sortent.
   Credit n'est plus mentionné.

3. **Grille de λ de la figure 3.** — validé 17/09 L'affichage reste celui de la **zone
   utile**, et la légende le dit désormais en clair : « la grille de recherche va de 10⁻³
   à 10³ ; la figure zoome sur la zone où l'erreur bouge ». Une seule correction forcée
   par le nouveau jeu : λ₁SE vaut maintenant **50,1** (log 1,70), qui tombait hors du
   cadre 10⁻¹–10^1,6 — la bande ocre du λ retenu était invisible. Le cadre va donc
   jusqu'à **10^1,8**, le minimum de ce qu'il faut pour voir ce que la figure prétend
   montrer.

2b. **Les chiffres de CV du spec étaient faux, et la sheet aussi.** — corrigé 17/09
   La table de CV avait été calculée en Python avec des plis **contigus** et **sans**
   restandardiser dans le pli, là où la figure fait l'inverse (plis entrelacés,
   standardisation refaite dans chaque pli, comme p06-02 l'exige). La table annonçait
   donc des nombres que la figure ne montrait pas. Table et figure sont maintenant
   lues **du même code** : λ_min = 7,94 (err 2,981, SE 0,610), seuil 3,590,
   λ₁SE = 50,1 (err 3,514) en ridge ; 15,9 / 2,822 / 0,767 / 3,588 / 50,1 / 3,410 en lasso.

**Arbitrage de revue 5, 17/09 — validé 17/09.** Composition du jeu **tranchée** :
2 fortes, 2 copies bruitées de ces fortes, 2 nulles ; les « faibles » sont retirées.
La figure 2 **a été refaite** (données, libellés de colonnes, légende, readouts sur la
paire x₂/x₄) parce qu'elle ne correspondait pas à cette lecture. ISLR *Credit* remplacé
par un jeu synthétique **validé**. Grille de λ : affichage de la zone utile **validé**,
mention de la grille 10⁻³–10³ ajoutée en légende. Statut `reviewed`.
