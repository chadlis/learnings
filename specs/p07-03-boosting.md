---
id: p07-03
series: chain
part: "07"
number: "03"
slug: boosting
title: Gradient boosting — une descente dans l'espace des fonctions
subtitle: arbres et ensembles — chaque arbre ajuste le gradient négatif de la loss au modèle cumulé ; ν est le pas
prereq: [p03-02, p07-01, p02-01, p03-01]
anki: [ml::boosting, ml::gradient-boosting, ml::learning-rate, ml::rf-vs-gb]
bridges: [b01, b03, b05]
next: p07-04
status: built
---

## Question de la chaîne
Qu'est-ce qu'un arbre de boosting ajuste exactement, pourquoi ce sont les résidus quand la loss est quadratique et autre chose sinon, ce que règlent ν, la profondeur et le nombre d'arbres, et quand préférer une forêt.

## Prérequis
- p03-02 : descente de gradient, pas η, convergence.
- p07-01 : arbres courts = biais fort ; arbres de régression = moyennes par feuille.
- p02-01 : la loss vient du bruit ; log-loss pour classer.
- p03-01 : gradient de la log-loss = p − y.

## Convention
Loss quadratique écrite **avec** le ½ : L = ½(y − F)², pour que le gradient négatif soit exactement le résidu y − F. Sans le ½ le pseudo-résidu vaut 2(y − F) et le facteur est absorbé par ν (arbitré en revue 4 ; même ligne dans b01).

## Hypothèses posées
- H1 : le modèle est une **somme** F_M(x) = F₀ + ν Σ_{m=1}^{M} h_m(x) de petits arbres, construite **séquentiellement** ; on n'y revient pas.
- H2 : chaque h_m est un arbre de régression court (profondeur 1–6), quelle que soit la tâche (classer ou régresser).
- H3 : la loss est dérivable en F (quadratique, log-loss, Huber…).

## Exemple fil rouge
Quatre points x = 1, 2, 3, 4 ; y = 1, 2, 3, 6. F₀ = ȳ = 3 ; résidus (−2, −1, 0, 3), RSS = 14.
Souche 1 (meilleure coupure des résidus : x ≤ 3) : h₁ = (−1, −1, −1, 3). ν = 0,1 : F₁ = (2,9 ; 2,9 ; 2,9 ; 3,3), résidus (−1,9 ; −0,9 ; 0,1 ; 2,7), RSS = 11,72. Chaque arbre corrige un dixième de ce qu'il voit.
Après 50 souches à ν = 0,1 : F = (1,08 ; 2,01 ; 2,99 ; 5,93), RSS = 0,012. À ν = 1 : RSS = 2,0 après 1 arbre, 0,52 après 3, 0,008 après 10 — et sur des données bruitées, le bruit aussi est absorbé.
Classification (log-loss) : le pseudo-résidu au point i est y_i − p_i (p03-01) : « de combien la probabilité est fausse ».

## Pas de la chaîne
1. **Le décor.** Le bagging moyenne des modèles indépendants et ne touche pas au biais. Le boosting construit un modèle **additif** où chaque terme corrige l'erreur du précédent : il attaque le biais.
2. **Le geste : ajuster le gradient négatif** [tronc]. À l'étape m, on calcule pour chaque point r_i = −∂L(y_i, F)/∂F évalué en F_{m−1}(x_i) : la direction dans laquelle bouger la prédiction de ce point ferait baisser la loss. On ajuste un arbre h_m sur ces r_i, et F_m = F_{m−1} + ν h_m. C'est une descente de gradient (p03-02) où **la variable est la fonction F** et le pas est ν (b01). Au tableau : « La loss est une fonction de la prédiction en chaque point, donc son gradient négatif dit dans quel sens corriger chaque point, donc un arbre qui l'ajuste est un pas de descente, donc le boosting descend la loss dans l'espace des fonctions. »
3. **Quadratique ⇒ résidus.** L = ½(y − F)² ⇒ −∂L/∂F = y − F : le gradient négatif **est** le résidu. C'est pourquoi on dit « chaque arbre ajuste les résidus du précédent » — vrai pour cette loss seulement, et parce que le ½ est là.
4. **Log-loss ⇒ y − p.** Pour classer, F est un logit, p = σ(F), −∂L/∂F = y − p (p03-01, pas 7). Le pseudo-résidu est un écart de **probabilité**, pas d'étiquette ; l'arbre est un arbre de régression sur ces écarts, même en classification. Autre loss (Huber, quantile) ⇒ autre pseudo-résidu ; le geste ne change pas. Au tableau : « La cible d'un arbre est le gradient de la loss, donc elle change avec la loss, donc en classification c'est y − p et non un label, donc on régresse toujours. »
5. **ν : le pas, et une régularisation** [tronc]. ν ∈ ]0, 1] : chaque arbre ne corrige qu'une fraction ν de ce qu'il voit. Petit ν + beaucoup d'arbres > grand ν + peu d'arbres : chaque pas s'appuie sur ce que les suivants pourront corriger, le modèle absorbe moins le bruit d'un seul arbre. Le fil rouge : ν = 1 mémorise en quelques arbres. Au tableau : « Un pas complet à chaque arbre suit le bruit du résidu courant, donc on prend un pas partiel et plus d'arbres, donc ν joue le rôle d'un taux d'apprentissage et d'une régularisation à la fois. »
6. **Profondeur = ordre des interactions.** Une souche ne modélise que des effets additifs par feature ; profondeur d permet des interactions à d variables. Typiquement 3–6 ; profond = variance (p07-01). Contrairement à la forêt, on veut des arbres **courts** : le biais est réduit par la somme, pas par l'arbre.
7. **M : arrêt anticipé.** La loss d'entraînement décroît toujours en M ; la validation fait un U (b02, p06-01) : on arrête au minimum (early stopping). Sous-échantillonnage des lignes (stochastic GB), shrinkage, régularisation des feuilles (XGBoost : λ sur les valeurs de feuille) : tous des boutons de variance sur un procédé qui, lui, attaque le biais.
8. **Forêt ou boosting** [tronc]. Forêt : parallèle, robuste (moyenne d'arbres profonds ; un label bruité est dilué), peu de réglage, plafond ρσ². Boosting : séquentiel, plus précis quand bien réglé, sensible aux labels bruités et aux outliers (la log-loss n'est pas bornée, p03-01 : un point faux reçoit des corrections à chaque étape — Huber en régression, arrêt anticipé), plus de boutons (ν, d, M). Au tableau : « La forêt moyenne et dilue le bruit, le boosting corrige et le poursuit, donc sur des labels propres le boosting gagne, sur des labels bruités la forêt est plus sûre. »
9. **Où ça casse** [casse].

## Figures exigées
- **Figure 1 — `plot` + bouton « arbre suivant » + `slider` ν** : les quatre points, F_m en marches, les résidus en segments ; readouts m, RSS ; à ν = 1 la RSS passe sous 0,01 en 10 arbres (0,52 après 3), à ν = 0,1 il en faut 50 pour descendre à 0,012. Légende : chaque arbre corrige une fraction ν du résidu.
- **Figure 2 — `plot`** : sur un jeu bruité (n = 40, sinusoïde + bruit), loss train et loss validation en fonction de M pour ν = 0,1 et ν = 1 ; minimum de validation marqué. Légende : ν petit décale le U vers la droite et le baisse.
- **Figure 3 — `repeat`** : jeu avec 10 % de labels bruités ; draw = erreur test d'une forêt vs d'un boosting (simulations précalculées ou mini-implémentation JS de souches) ; deux histogrammes. Légende : le boosting poursuit le bruit.

## Où ça casse
- **Labels bruités / outliers** : le boosting les corrige à chaque étape ; Huber, quantile, early stopping, ou forêt.
- **Trop profond + ν grand** : mémorisation rapide ; le nombre d'arbres n'y change rien.
- **Séquentiel** : pas de parallélisme entre arbres (au niveau des nœuds seulement) ; plus lent qu'une forêt à entraîner.
- **« Ajuste les résidus du précédent »** : faux hors loss quadratique ; le mot juste est « le gradient négatif de la loss au modèle cumulé ».

## Résumé
1. F_M = F₀ + ν Σ h_m : modèle additif séquentiel.
2. Chaque arbre ajuste r_i = −∂L/∂F au modèle cumulé : une descente de gradient dans l'espace des fonctions (b01).
3. Quadratique ⇒ résidus (avec le ½) ; log-loss ⇒ y − p ; toujours un arbre de régression.
4. ν = pas et régularisation : petit ν, beaucoup d'arbres.
5. Profondeur = ordre des interactions (3–6) ; arbres courts, le biais est réduit par la somme.
6. M par arrêt anticipé sur validation ; forêt si labels bruités, boosting si labels propres et réglage soigné.

**Phrase d'entretien** : « Le gradient boosting est une descente de gradient où la variable est la fonction : à chaque étape j'ajuste un petit arbre sur le gradient négatif de la loss au modèle cumulé — les résidus pour une loss quadratique, y moins p pour la log-loss — et j'ajoute une fraction ν de cet arbre. ν est à la fois le pas et la régularisation, la profondeur fixe l'ordre des interactions, le nombre d'arbres se choisit par arrêt anticipé. La forêt dilue le bruit, le boosting le poursuit : c'est le critère de choix. »

## Chaîne verbalisée
1. Que cible exactement le m-ième arbre ? → −∂L/∂F au modèle cumulé F_{m−1}, point par point.
2. Pourquoi « les résidus » ? → Loss quadratique avec ½ : y − F ; pas ailleurs.
3. Et en classification ? → y − p ; arbre de régression sur des écarts de probabilité.
4. Que fait ν ? → Pas de descente et régularisation ; petit ν + plus d'arbres.
5. Profondeur : arbres courts ou profonds ? → Courts (interactions d'ordre d) ; la somme réduit le biais.
6. Forêt ou boosting sur des labels bruités ? → Forêt : elle dilue ; le boosting poursuit.

## Ce qui a cassé pour Salah
- Q12.1 (10/09) : « boosting = gradient de la loss, pas résidus de l'arbre précédent » — le pas 2 pose la définition juste, le pas 3 dit **quand** « résidus » est vrai, la casse nomme la formulation fausse. C'est la chaîne entière qui répond à cette question.
- Convention du ½ arbitrée en revue 4 : la dire au pas 3, une ligne.
- Vocabulaire bagging/boosting (diagnostic N2) : pas 8, une table.

## Exclusions
Pas d'AdaBoost (poids exponentiels) au-delà du nom, pas de hessienne XGBoost (scope acté 10/09), pas de détails d'implémentation (histogrammes, LightGBM leaf-wise) au-delà d'une phrase.

## Questions pour la revue

- **Chiffre du spec corrigé (fil rouge et figure 1).** Le spec annonçait « à ν = 1 : RSS ≈ 0 en
  quelques arbres » et « la RSS tombe à 0 en 3 arbres ». Vérifié par script : sur les quatre points,
  souches gloutonnes, ν = 1 donne RSS = 2,0 après 1 arbre, **0,519 après 3**, 0,0081 après 10,
  3·10⁻⁵ après 20. Une souche ne pouvant produire que deux valeurs, quatre valeurs distinctes ne
  s'atteignent jamais en trois pas. Spec et sheet portent maintenant les chiffres exacts.
- **p07-02 absente de `prereq`.** La chaîne s'appuie trois fois sur son résultat (moyenner ne touche
  pas au biais ; arbres profonds là-bas, courts ici) et y renvoie par lien. La méta `prereq` a été
  laissée conforme au spec (p03-02, p07-01, p02-01, p03-01) et p07-02 figure dans la carte des
  prérequis et dans les ponts. Faut-il l'ajouter à la méta ?
- **Valeur de feuille : gradient pur ou recherche linéaire ?** La sheet pose h_m = arbre des moindres
  carrés sur les pseudo-résidus, ce qui est la lecture « descente de gradient » et ce que dit déjà b01.
  L'algorithme de Friedman ajoute une recherche linéaire par feuille (γ_j = Σr / Σ p(1−p) pour la
  log-loss). Ce n'est pas la hessienne XGBoost exclue du scope, mais ce n'est pas rien non plus :
  demi-ligne à ajouter au pas 4, ou à laisser dehors ?
- **Figure 3 : boosting volontairement non arrêté.** Pour que l'effet « le boosting poursuit le bruit »
  soit visible, la simulation tourne à ν = 0,3, M = 200, sans arrêt anticipé (forêt 8,9 %, boosting
  10,9 %, boosting pire dans 82 tirages sur 100). La légende le dit explicitement. Vaut-il mieux une
  troisième série « boosting arrêté au minimum de validation », au prix d'une figure plus lourde ?
