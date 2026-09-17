---
id: p07-02
series: chain
part: "07"
number: "02"
slug: bagging-rf
title: Bagging et forêt aléatoire — la variance seule
subtitle: arbres et ensembles — moyenner des arbres profonds réduit la variance, et tirer m features baisse ce que la moyenne ne peut pas baisser
prereq: [p07-01, p01-05, p00-02, p06-01]
anki: [ml::bagging, ml::random-forest, ml::oob, ml::variance-correlee]
bridges: [b04, b03, b02]
next: p07-03
status: reviewed
---

## Question de la chaîne
Pourquoi moyenner cent arbres profonds marche, pourquoi ça ne baisse pas le biais, pourquoi ajouter des arbres finit par ne plus rien changer, et à quoi sert de tirer m features par nœud.

## Prérequis
- p07-01 : un arbre profond = faible biais, forte variance, instable.
- p01-05 : bootstrap, avec remise, ≈ 37 % de lignes absentes.
- p00-02 : Var(X + Y) = Var(X) + Var(Y) + 2Cov ; b04 : ρσ² + (1 − ρ)σ²/B.
- p06-01 : biais/variance.

## Hypothèses posées
- H1 : les B arbres ont la **même** loi (mêmes hyperparamètres, tirages identiquement distribués) : même biais, même variance σ², corrélation ρ deux à deux.
- H2 : on moyenne (régression) ou on vote (classification) ; le biais de la moyenne est le biais d'un arbre.

## Exemple fil rouge
Un arbre profond : variance σ² (unité). Moyenne de B arbres corrélés à ρ : ρσ² + (1 − ρ)σ²/B.
- Bagging (mêmes features, ρ ≈ 0,5) : B = 10 → 0,55σ² ; B = 100 → 0,505σ² ; B = ∞ → 0,5σ². Passer de 10 à 100 arbres gagne 0,045.
- Forêt (m = √p features par nœud, ρ ≈ 0,1) : B = 10 → 0,19σ² ; B = 100 → 0,109σ² ; B = ∞ → 0,1σ². Le plancher a été divisé par 5.
- Bootstrap de n = 1 000 lignes : 632 lignes distinctes en moyenne, 368 absentes (1 − (1 − 1/n)ⁿ → 1 − e⁻¹ = 0,632). Chaque ligne est hors-sac pour ≈ 37 % des arbres : avec B = 100, ≈ 37 arbres pour la prédire sans l'avoir vue.

## Pas de la chaîne
1. **Le décor.** Un arbre profond a peu de biais et beaucoup de variance (p07-01). On ne peut pas baisser sa variance sans monter son biais — sauf en en faisant plusieurs.
2. **Moyenner réduit la variance, pas le biais** [tronc]. E[moyenne] = E[un arbre] : le biais ne bouge pas. Var(moyenne) = ρσ² + (1 − ρ)σ²/B (b04) : le second terme s'éteint avec B, le premier jamais. Au tableau : « La moyenne de B arbres a le même centre qu'un arbre, donc le biais est inchangé, donc tout le gain est en variance, et il est plafonné par la corrélation entre arbres. »
3. **D'où viennent des arbres différents : le bootstrap.** Chaque arbre est ajusté sur un rééchantillon avec remise (p01-05) : 63 % de lignes distinctes, doublons, absents. Deux arbres sur deux bootstraps diffèrent, mais pas tant : ils voient les mêmes features fortes et coupent souvent au même endroit ⇒ ρ élevé.
4. **Le plancher ρσ²** [tronc]. À ρ = 0,5, cent arbres ne font pas mieux que 0,5σ² ; mille non plus. Ajouter des arbres n'est jamais nuisible (pas de surapprentissage en B) mais devient inutile. Pour descendre, il faut baisser **ρ**. Au tableau : « Le terme en 1/B s'éteint, donc au-delà d'une centaine d'arbres il reste ρσ², donc le seul levier restant est la corrélation, donc il faut rendre les arbres différents autrement que par les lignes. »
5. **La forêt : tirer m features par nœud** [tronc]. À chaque nœud, seules m features tirées au hasard sont candidates (√p en classification, p/3 en régression, par défaut). Une feature dominante n'est plus toujours disponible : les arbres coupent sur des features différentes, ρ tombe (0,5 → 0,1 dans le fil rouge). Le prix : chaque arbre est un peu plus biaisé (il n'a pas toujours la meilleure coupure) — la variance perdue vaut plus que le biais gagné. Au tableau : « Restreindre les features candidates décorrèle les arbres, donc le plancher baisse, donc la moyenne descend plus bas, au prix d'un léger biais par arbre. »
6. **Out-of-bag : le test gratuit.** Chaque ligne est absente de ≈ 37 % des bootstraps : la prédire avec ces arbres-là seulement donne une erreur sur données non vues, sans validation séparée. Légèrement pessimiste (37 arbres au lieu de 100, b02), valide.
7. **Pourquoi des arbres profonds.** Le bagging ne baisse que la variance : il faut des composants à faible biais et forte variance. Des souches (profondeur 1) baggées restent biaisées — c'est le boosting qui les veut (p07-03). Arbres profonds pour bagging/forêt, arbres courts pour boosting.
8. **Importance des features.** Baisse d'impureté cumulée (biaisée vers les features à beaucoup de modalités, et « importance » ≠ causalité) ou permutation (plus honnête, sur OOB). Nommer, pas développer.
9. **Où ça casse** [casse].

## Figures exigées
- **Figure 1 — `plot` + `slider` ρ ∈ [0, 0,9]** : Var(moyenne)/σ² en fonction de B (axe log 1…1 000), plancher ρ en pointillé ; presets « bagging ρ = 0,5 » et « forêt ρ = 0,1 ». Légende : à 100 arbres on est au plancher ; la forêt baisse le plancher.
- **Figure 2 — `repeat`** : sur un nuage 1D bruité (n = 30), un tirage = **un nouveau jeu de 30 points** ; histogramme du haut = prédiction en x₀ d'un arbre profond ajusté dessus, histogramme du bas = moyenne de 25 arbres ajustés sur 25 bootstraps de ce même jeu. Même centre, largeurs très différentes. Légende : même biais, variance divisée — mais par 2, pas par 25.
- **Figure 3 — SVG custom via `plot`** : 20 lignes × 12 bootstraps en grille, case grisée si la ligne est absente du bootstrap ; readouts « part absente » (≈ 37 %) et « arbres OOB pour la ligne 7 ». Légende : le test gratuit.

## Où ça casse
- **ρ élevé malgré m** : une feature écrasante (fuite, p06-02) domine tous les arbres ; la forêt ne décorrèle plus.
- **Biais partagé** : mille arbres qui ne peuvent pas représenter une diagonale (p07-01) donnent une diagonale en escalier moyennée ; la moyenne ne crée pas de capacité.
- **Extrapolation** : la moyenne d'arbres reste dans le support des y vus.
- **B n'est pas un hyperparamètre à régler** : assez grand pour stabiliser (courbe OOB plate), c'est tout ; ce sont m et la profondeur qui se règlent.

## Résumé
1. Moyenner B arbres : biais inchangé, variance ρσ² + (1 − ρ)σ²/B.
2. Bootstrap fabrique des arbres différents (63 % de lignes distinctes) mais corrélés.
3. Plancher ρσ² : au-delà de ~100 arbres, plus de gain ; jamais de perte.
4. Forêt : m features par nœud ⇒ ρ baisse (0,5 → 0,1) ⇒ plancher divisé ; léger biais par arbre.
5. OOB : chaque ligne prédite par les ≈ 37 % d'arbres qui ne l'ont pas vue ; erreur test gratuite.
6. Arbres profonds pour la forêt, courts pour le boosting ; B se stabilise, m et profondeur se règlent.

**Phrase d'entretien** : « Le bagging moyenne des arbres profonds ajustés sur des bootstraps : le biais reste celui d'un arbre, la variance tombe à ρσ² plus (1 − ρ)σ² sur B. Au-delà d'une centaine d'arbres il ne reste que le plancher ρσ², donc la forêt aléatoire tire m features par nœud pour décorréler les arbres et baisser ce plancher. L'erreur out-of-bag, sur les 37 % d'arbres qui n'ont pas vu chaque ligne, est un test gratuit. »

## Chaîne verbalisée
1. Que fait le bagging au biais et à la variance ? → Biais inchangé ; variance ρσ² + (1 − ρ)σ²/B.
2. Pourquoi cent arbres et pas mille ? → Le 1/B s'éteint ; reste ρσ².
3. À quoi sert m dans une forêt ? → Décorréler les arbres, baisser ρ ; léger biais par arbre.
4. D'où vient le 37 % ? → (1 − 1/n)ⁿ → e⁻¹ ; lignes absentes d'un bootstrap.
5. Pourquoi des arbres profonds ici et courts en boosting ? → Bagging ne baisse que la variance ; boosting baisse le biais.
6. B se règle-t-il ? → Non : assez grand pour stabiliser ; m et profondeur, oui.

## Ce qui a cassé pour Salah
- Diagnostic : « vocabulaire bagging/boosting » manquant (N2) ; la chaîne fixe le vocabulaire sur la formule unique de b04, pas sur des slogans.
- Le 37 % apparaît en p01-05 (bootstrap) et ici (OOB) : une seule origine, dite au pas 3 et 6.
- b02 (OOB pessimiste) et b04 (la formule) : renvoyer, ne pas redériver.

## Questions pour la revue
- **Figure 2, ce qui est tiré.** Le spec écrivait « draw = prédiction d'un arbre ajusté sur un bootstrap ». Pris au pied de la lettre, le jeu est fixé et les B bootstraps sont alors **indépendants** : la variance se diviserait exactement par B, ρ = 0, et la figure démontrerait le contraire de la chaîne. Corrigé : un tirage régénère le jeu de 30 points (c'est bien le dataset qui est tiré, p06-01 pas 3), puis le bagging s'applique à ce jeu-là. Posé en H3 dans la sheet. Vérifié : ratio var(25)/var(1) = 0,50 et non 1/25 = 0,04, d'où ρ = 0,47 — cohérent avec le ρ ≈ 0,5 annoncé pour le bagging.
- **Figure 3, le 37 % à petit n.** La grille est 20 lignes × 12 arbres : (1 − 1/20)²⁰ = **35,8 %**, pas 36,8 %. L'écart est réel, pas un arrondi (la limite 1/e n'est atteinte qu'à grand n). La légende et le readout disent les deux nombres plutôt que d'écrire 37 % sur une figure qui produit 35,8 %.
- **Aucun chiffre du fil rouge n'était faux** : 0,55 / 0,505 / 0,5 · 0,19 / 0,109 / 0,1 · gain 0,045 · 632 distinctes / 368 absentes · 36,8 arbres OOB à B = 100 — tous reproduits.
- **Chiffres ajoutés, non demandés par le spec** (tous vérifiés en Python) : ρ empirique 0,47 du fil rouge ; recouvrement de deux bootstraps 40 % ; pessimisme OOB 0,1245 σ² contre 0,109 ; souche baggée −10 % d'EQM contre −51 % pour l'arbre profond ; MDI 94 % / 6 % entre deux features de bruit pur.

## Exclusions
Pas d'extra-trees, pas de proximity, pas d'importance par permutation détaillée, pas de preuve de ρσ² + (1 − ρ)σ²/B (b04).

**Arbitrage de revue 5, 17/09 — validé 17/09.** **Validé en l'état.** Les deux points
relevés à l'écriture tiennent : la figure 2 tire **un nouveau jeu de 30 points** par
répétition et non un bootstrap à jeu fixé — ainsi lue, la figure du spec démontrait
l'inverse de la chaîne (B bootstraps indépendants ⇒ ρ = 0) ; et la figure 3, à n = 20,
affiche **35,8 %** à côté du 36,8 % asymptotique plutôt que d'arrondir en silence.
Statut `reviewed`.
