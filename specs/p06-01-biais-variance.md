---
id: p06-01
series: chain
part: "06"
number: "01"
slug: biais-variance
title: Biais, variance, bruit — la décomposition
subtitle: évaluer — ce que « overfit » veut dire quand on refait le tirage
prereq: [p01-01, p00-02]
anki: [ml::biais-variance, ml::overfitting, ml::underfitting]
bridges: [b03]
next: p06-02
status: ready
---

## Question de la chaîne
Pourquoi l'erreur test se décompose en trois termes, lequel bouge quand on complexifie le modèle, et pourquoi les résidus d'entraînement ne sont pas le bruit.

## Prérequis
- p01-01 : l'objet aléatoire ; ici c'est le **dataset d'entraînement** qui est tiré.
- p00-02 : Var = E[X²] − E[X]².

## Hypothèses posées
- H1 : y = f(x) + ε, E[ε] = 0, Var(ε) = σ², ε indépendant de x et du dataset.
- H2 : le modèle f̂ est ajusté sur un dataset D tiré au hasard ; on regarde l'erreur en un x fixé, moyennée sur D et sur ε.

## Exemple fil rouge
f(x) = sin(2πx) sur [0, 1], σ = 0,3, n = 15 points, polynômes de degré d ajustés par OLS.
d = 1 : la droite rate la sinusoïde (biais fort), mais deux datasets donnent presque la même droite (variance faible).
d = 12 : passe par tous les points (résidus train ≈ 0), mais deux datasets donnent des courbes sans rapport (variance énorme).
d = 3–5 : erreur test minimale ≈ σ² + petit reste. Erreur test ≥ σ² = 0,09 toujours ; résidus train < 0,09 dès d = 6 : ils ne mesurent pas le bruit.
(Chiffres exacts par simulation dans la figure ; ne pas en inventer.)

## Pas de la chaîne
1. **Le décor.** Deux modèles, deux erreurs test. « Overfit » et « underfit » sont des mots ; la question est : qu'est-ce qui varie si on retire le dataset ?
2. **L'objet aléatoire est le dataset** [tronc]. f̂_D dépend de D ; en un x fixé, f̂_D(x) est une variable aléatoire (colonne aléatoire : D). Elle a un centre E_D[f̂_D(x)] et une largeur Var_D. Au tableau : « Le modèle est une fonction du dataset, donc sa prédiction en un point est aléatoire, donc elle a une espérance et une variance sur les tirages du dataset. »
3. **La décomposition** [tronc]. E[(y − f̂(x))²] = (f(x) − E[f̂(x)])² + Var(f̂(x)) + σ² = biais² + variance + bruit. Preuve en une ligne : ajouter et retrancher E[f̂], développer, les termes croisés sont nuls (ε indépendant, centré). Au tableau : « L'erreur se décompose autour de la prédiction moyenne, donc en un carré de biais, une variance sur les datasets, et le bruit irréductible, les termes croisés s'annulant par indépendance. »
4. **Le bruit est un plancher.** σ² ne dépend pas du modèle : aucune méthode ne descend en dessous en test. Les **résidus d'entraînement** ne l'estiment pas : un modèle flexible les rend nuls (d = 12), un modèle rigide les gonfle de biais. Seul un test propre (ou une CV) voit σ².
5. **Complexité : biais ↓, variance ↑** [tronc]. Plus de degrés de liberté ⇒ la prédiction moyenne colle à f (biais ↓) et chaque dataset tire le modèle à lui (variance ↑). Erreur test = somme ⇒ **U**. Train décroît toujours (témoin, p04-01) ; gap train/test ≈ variance. Au tableau : « Complexifier rapproche la prédiction moyenne de la vérité mais rend chaque ajustement plus dépendant du tirage, donc le biais baisse et la variance monte, donc leur somme passe par un minimum. »
6. **Lire un diagnostic.** Train haut, test haut et proche : biais (underfit) ⇒ modèle plus riche, features. Train bas, test haut : variance (overfit) ⇒ données, régularisation (p05-03), ensembles (p07-02), moins de degrés de liberté. Les deux leviers ne sont pas symétriques : la variance se paie en données, le biais en modèle.
7. **Où ça casse** [casse].

## Figures exigées
- **Figure 1 — `repeat` + `slider` degré d ∈ [0, 12]** : à chaque tirage, 15 points sont retirés (sin + N(0, 0,3²)), le polynôme ajusté est tracé en fin (30 courbes superposées maximum), la vraie f en trait ; readouts en x = 0,7 : moyenne des prédictions (→ biais), écart-type (→ variance). Légende : à d = 1 les courbes se superposent loin de f ; à d = 12 elles partent partout.
- **Figure 2 — `plot`** : biais², variance, σ², erreur test et erreur train en fonction de d (estimés par 200 tirages, calcul JS au chargement) ; U marqué. Légende : train descend toujours ; test remonte ; le plancher est σ².
- **Figure 3 — `plot` + `slider` n ∈ [10, 200]** : même courbe d'erreur test pour trois n ; le creux se déplace vers la droite. Légende : plus de données ⇒ moins de variance ⇒ on peut se payer un modèle plus riche.

## Où ça casse
- **Bruit non indépendant de x** (hétéroscédastique) : la décomposition tient point par point, mais σ² varie ; le plancher n'est pas uniforme.
- **Le test contaminé** (leakage, p06-02) : la variance et le biais mesurés sont faux ; le plancher paraît franchi.
- **Réseaux surparamétrés** : la courbe n'est pas toujours en U (double descente, nommer) ; la décomposition reste vraie, l'intuition « plus de paramètres = plus de variance » non.
- **Confondre variance du modèle et variance du bruit** : la première baisse avec n, la seconde jamais.

## Résumé
1. L'objet aléatoire est le dataset ; f̂(x) a un centre et une largeur.
2. Erreur test = biais² + variance + σ² (termes croisés nuls par indépendance).
3. σ² est un plancher ; les résidus train ne l'estiment pas.
4. Complexité : biais ↓, variance ↑ ⇒ U ; train décroît toujours ; gap ≈ variance.
5. Diagnostic : train ≈ test hauts ⇒ biais ; train ≪ test ⇒ variance ; leviers différents.

**Phrase d'entretien** : « Le modèle est une fonction du dataset, donc sa prédiction en un point est une variable aléatoire : l'erreur test se décompose en le carré de son biais, sa variance sur les tirages, et le bruit irréductible, qui est un plancher que les résidus d'entraînement ne mesurent pas. Complexifier fait baisser le biais et monter la variance, d'où la courbe en U ; l'écart train-test est le symptôme de la variance, et il se paie en données ou en régularisation. »

## Chaîne verbalisée
1. Qu'est-ce qui est aléatoire dans f̂(x) ? → Le dataset D.
2. Écris la décomposition et dis pourquoi les croisés s'annulent. → biais² + Var + σ² ; ε indépendant et centré.
3. Un modèle a des résidus train de 0,01, σ² = 0,09 : que dire ? → Overfit ; les résidus ne mesurent pas le bruit.
4. Que fait la complexité à chaque terme ? → Biais ↓, variance ↑, σ² fixe ⇒ U.
5. Train 0,10, test 0,12 vs train 0,01, test 0,30 : quel levier ? → Biais ⇒ modèle plus riche ; variance ⇒ données/régularisation.

## Ce qui a cassé pour Salah
- ML classique N2 au diagnostic : « mécanismes acquis, why verbalisé manquant » — ici le why est le pas 2 (l'objet aléatoire est le dataset), même geste que p01-01 : le dire explicitement.
- t06 (index) : « σ² plancher ≠ résidus », « U en complexité », « train + gap » en cartes ; la chaîne les relie par la décomposition.
- Pont b03 : six échelles du même trade-off ; ne pas les lister ici, pointer.

## Exclusions
Pas de double descente au-delà du nom, pas de décomposition pour la 0/1 loss, pas de learning curves détaillées.
