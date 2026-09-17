---
id: p06-01
series: chain
part: "06"
number: "01"
slug: biais-variance
title: Biais, variance, bruit — la décomposition
subtitle: évaluer — le tirage est le dataset entier, et l'erreur se coupe en trois
prereq: [p01-01, p00-02]
anki: [ml::biais-variance, ml::overfitting, ml::validation]
bridges: [b03, b02]
next: p06-02
status: ready
---

## Question de la chaîne
Un modèle appris sur un jeu de données se serait-il trompé pareil sur un autre jeu tiré de la même population ? Quelle part de son erreur vient de sa rigidité, de sa sensibilité au tirage, et du bruit qu'aucun modèle ne peut enlever ?

## Prérequis
- p01-01 : les trois colonnes ; ici la colonne aléatoire contient **le dataset d'entraînement entier**.
- p00-02 : E[(X − c)²] = Var(X) + (E[X] − c)².

## Hypothèses posées
- H1 : y = f(x) + ε, E[ε] = 0, Var(ε) = σ² ; f inconnue, fixe.
- H2 : on répète l'expérience : tirer un dataset D de taille n, apprendre f̂_D, prédire en un x fixé. f̂_D(x) est une variable aléatoire **de D**.
- H3 : erreur quadratique ; la décomposition exacte est pour elle (pour la log-loss, l'idée tient, pas la formule).

## Exemple fil rouge
f(x) = x sur [0, 1], σ = 0,5, n = 10 points sur une grille. Trois apprenants, erreur en un x fixé, moyennée sur la grille (simulation, 20 000 tirages) :
- **Constante** ŷ = ȳ : biais² ≈ 0,10 (elle ne peut pas suivre la pente), variance = σ²/n = 0,025. Total ≈ 0,125 + σ².
- **Droite** (OLS) : biais² ≈ 0, variance ≈ σ²·2/n = 0,05 (deux paramètres). Total ≈ 0,05 + σ².
- **Plus proche voisin** (interpolation) : biais² ≈ 0, variance ≈ σ² = 0,25 (on recopie un bruit). Total ≈ 0,25 + σ².
Plancher commun : σ² = 0,25, irréductible. La droite gagne parce que f est une droite ; si f était une sinusoïde, la droite aurait un biais et le voisin un avantage.

## Pas de la chaîne
1. **Le décor.** On n'a qu'un dataset ; on aimerait savoir ce que le modèle aurait fait sur un autre. Même question que p01-01, objet aléatoire différent : le dataset entier, pas une ligne.
2. **Le tirage est le dataset** [tronc]. Colonnes : FIXE f, x, σ² · ALÉATOIRE D → f̂_D → f̂_D(x) · PROCÉDURE tirer D → ajuster → prédire. Au tableau : « Le modèle appris dépend du dataset, donc sa prédiction en x est une variable aléatoire du tirage, donc elle a un centre et une largeur, et on peut les nommer. »
3. **La décomposition** [tronc]. E_D,ε[(y − f̂_D(x))²] = (E_D[f̂_D(x)] − f(x))² + Var_D(f̂_D(x)) + σ² = **biais² + variance + bruit**. Deux lignes : ajouter et retrancher E[f̂], développer, les termes croisés s'annulent. Au tableau : « L'écart au vrai se coupe en écart du centre au vrai plus écart au centre, donc l'erreur moyenne est le biais au carré plus la variance, plus le bruit qui ne dépend d'aucun modèle. »
4. **Biais = rigidité.** Un modèle qui ne peut pas représenter f (constante sur une pente, droite sur une courbe) a un centre faux quel que soit n. Le biais ne baisse pas avec plus de données ; il baisse avec plus de flexibilité.
5. **Variance = sensibilité au tirage.** Un modèle qui peut tout représenter suit le bruit du dataset : le voisin recopie ε. La variance baisse avec n et monte avec la flexibilité. Au tableau : « Plus le modèle est souple, plus il épouse le tirage, donc plus sa prédiction change d'un dataset à l'autre, donc plus sa variance est grande. »
6. **Le U** [tronc]. Flexibilité croissante : biais² décroît, variance croît, la somme passe par un minimum. Erreur train : décroît toujours (témoin, b02). Erreur test : le U. Le **gap** train/test grandit avec la flexibilité ; c'est le symptôme, pas la cause. Au tableau : « Le biais baisse et la variance monte avec la flexibilité, donc leur somme a un minimum, donc il existe une bonne flexibilité et elle ne se lit que sur des données non vues. »
7. **Le plancher σ² ne se voit pas.** Les résidus d'un modèle souple sont **plus petits** que σ (il a absorbé du bruit) ; ceux d'un modèle rigide plus grands. σ² est une propriété du problème, pas une lecture des résidus. Sur le fil rouge : σ² = 0,25 est la moitié de l'erreur totale du meilleur modèle.
8. **Où ça casse** [casse].

## Figures exigées
- **Figure 1 — `repeat` + boutons « constante / droite / voisin »** : draw = prédiction en x = 0,37 sur un dataset retiré (n = 10, σ = 0,5) ; bins [−0,5 ; 1,3 ; 36] ; marque f(0,37) = 0,37 ; readouts biais² et variance mesurés. Légende : trois histogrammes, trois centres/largeurs ; le voisin est centré mais large.
- **Figure 2 — `plot` + `slider` degré ∈ [0, 9]** : sur un dataset fixe (n = 12, f sinusoïde, σ = 0,3), le polynôme ajusté ; bouton « nouveau dataset » qui retire les points et réajuste ; à côté, les courbes biais², variance, total en fonction du degré (précalculées par simulation JS de 500 tirages). Légende : à degré 9 la courbe change du tout au tout d'un tirage à l'autre.
- **Figure 3 — `plot`** : erreur train et erreur test en fonction du degré, sur le même jeu ; le gap surligné. Légende : train descend toujours ; test fait le U.

## Où ça casse
- **Un seul dataset** : on n'observe ni biais ni variance, seulement leur somme via un jeu de validation (p06-02). Les deux ne se séparent qu'en simulation ou en rééchantillonnant.
- **Hors erreur quadratique** : la décomposition exacte n'existe pas pour la log-loss ou la 0/1 ; l'intuition (rigide vs souple) reste.
- **Régime moderne** : réseaux très surparamétrés qui interpolent et généralisent quand même (double descente, nommer) ; le U reste vrai à taille de données fixée et flexibilité modérée.
- **Bruit hétérogène** : σ² dépend de x ; le plancher n'est pas uniforme.

## Résumé
1. Le tirage est le dataset entier ; f̂_D(x) est une v.a. de D.
2. Erreur = biais² + variance + σ² ; σ² irréductible et invisible dans les résidus.
3. Biais = rigidité (ne baisse pas avec n) ; variance = sensibilité au tirage (baisse avec n, monte avec la flexibilité).
4. Le U : la bonne flexibilité ne se lit que sur des données non vues ; le gap train/test est le symptôme.
5. Fil rouge : constante 0,125, droite 0,05, voisin 0,25 — plus σ² = 0,25.

**Phrase d'entretien** : « Si je retirais le dataset, le modèle appris changerait : sa prédiction en un point a un centre et une largeur. L'écart du centre au vrai est le biais, la largeur est la variance, et il reste le bruit qu'aucun modèle n'enlève. Un modèle rigide a du biais, un modèle souple a de la variance ; leur somme passe par un minimum qui ne se lit que sur des données non vues, parce que l'erreur d'entraînement, elle, ne fait que descendre. »

## Chaîne verbalisée
1. Quel est l'objet aléatoire ? → Le dataset d'entraînement entier, donc f̂_D, donc f̂_D(x).
2. Écris la décomposition et dis d'où elle vient. → biais² + variance + σ² ; ajouter/retrancher E[f̂], termes croisés nuls.
3. Que fait plus de données ? plus de flexibilité ? → n : baisse la variance, pas le biais ; flexibilité : baisse le biais, monte la variance.
4. Pourquoi l'erreur train ne fait pas le U ? → Témoin : le modèle souple contient le rigide.
5. Peut-on lire σ² dans les résidus ? → Non : un modèle souple les rend plus petits que σ.

## Ce qui a cassé pour Salah
- Q10 (10/09) : « biais-variance ; la variance ↔ plus de données » — la colonne aléatoire doit dire **le dataset**, en clair, pas « les données » ; pas 2 et figure 1 (on voit le tirage changer la prédiction).
- « Le plancher σ² ≠ résidus » (t06) : pas 7.
- Lien b02 : l'erreur train qui descend toujours est un témoin ; ne pas redémontrer.

## Exclusions
Pas de double descente au-delà du nom, pas de décomposition pour la log-loss, pas de formule de la variance de kNN au-delà de σ²/k.
