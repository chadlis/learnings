---
id: p04-02
series: chain
part: "04"
number: "02"
slug: valeurs-propres-iteration
title: Valeurs propres et itération — ce qui survit à Aᵏ
subtitle: algèbre — les directions qu'une action ne tourne pas, et pourquoi elles gagnent à la longue
prereq: [p04-01]
anki: [algebre::eigen, algebre::power-iteration, algebre::markov]
bridges: [b06]
next: p04-03
status: stub
---

## Question de la chaîne
Quelles directions une matrice se contente d'étirer, pourquoi la plus étirée finit par dominer quand on itère, et quel signal dans un énoncé appelle une valeur propre ?

## Prérequis
- p04-01 : Ax comme action ; noyau ; det.

## Hypothèses posées
- H1 : A carrée n×n (une action de ℝⁿ vers lui-même — sinon « propre » n'a pas de sens).
- H2 : A diagonalisable avec une valeur propre dominante strictement (|λ₁| > |λ₂|) pour la convergence de l'itération.

## Exemple fil rouge
A = [[2, 1], [0, 3]] : det(A − λI) = (2 − λ)(3 − λ) ⇒ λ = 2, 3. Vecteurs propres : v₁ = (1, 0) (A v₁ = 2v₁), v₂ = (1, 1) (A v₂ = (3, 3) = 3v₂).
Itération : w = (0, 1) = v₂ − v₁ ⇒ Aᵏw = 3ᵏv₂ − 2ᵏv₁ = 3ᵏ[v₂ − (2/3)ᵏv₁] : la direction tend vers v₂, à la vitesse (2/3)ᵏ. k = 10 : (2/3)¹⁰ = 0,017.
Markov : P = [[0,9 ; 0,5], [0,1 ; 0,5]] (colonnes = probabilités de transition). Valeurs propres 1 et 0,4 ; vecteur propre de 1 normalisé : π = (5/6 ; 1/6) : Pπ = π. Depuis n'importe quel état initial, Pᵏx → π à la vitesse 0,4ᵏ (0,4¹⁰ = 10⁻⁴).

## Pas de la chaîne
1. **Le décor.** Une action déforme le plan ; presque toutes les directions tournent. Y en a-t-il qui ne tournent pas ?
2. **Définition** [tronc]. Av = λv avec v ≠ 0 : la direction v est **conservée**, seulement étirée d'un facteur λ (retournée si λ < 0, écrasée si λ = 0). v ≠ 0 est essentiel : 0 est toujours envoyé sur 0. Au tableau : « Un vecteur propre est une direction que l'action ne tourne pas, donc l'image est proportionnelle au vecteur, donc Av = λv, et le facteur λ est la valeur propre. »
3. **Les trouver** : Av = λv ⇔ (A − λI)v = 0 ⇔ Ker(A − λI) ≠ {0} ⇔ det(A − λI) = 0 (p04-01, pas 4). C'est le noyau qui définit l'équation caractéristique, pas une formule tombée du ciel. Au tableau : « On cherche v non nul dans le noyau de A − λI, donc ce noyau doit être non trivial, donc le déterminant de A − λI doit s'annuler. »
4. **Diagonaliser = changer de base** [tronc]. Si les vᵢ forment une base, A = PDP⁻¹ : P⁻¹ exprime x dans la base propre, D étire chaque coordonnée par son λᵢ, P revient. Trois actions ; dans la base propre, A est un simple étirement par axe. Aᵏ = PDᵏP⁻¹ : itérer, c'est élever chaque λᵢ à la puissance k. Au tableau : « Dans la base des vecteurs propres l'action est diagonale, donc la puissance k de A est la puissance k de chaque valeur propre, donc la plus grande en module finit par dominer. »
5. **L'itération sélectionne la direction dominante** [tronc]. Aᵏw = Σ cᵢλᵢᵏvᵢ ≈ c₁λ₁ᵏv₁ ; la direction converge vers v₁ à la vitesse |λ₂/λ₁|ᵏ. Power iteration : normaliser à chaque pas. Fil rouge : (2/3)ᵏ. C'est PageRank, c'est la loi stationnaire d'une chaîne de Markov (λ₁ = 1, vitesse λ₂), c'est aussi pourquoi un gradient répété explose ou s'évanouit (p08-01).
6. **Le signal dans un énoncé** : « on applique la même transformation **encore et encore** », « **à long terme** », « état stable », « proportion limite », « matrice carrée qui itère » ⇒ vecteur propre dominant. Le nombre de composantes qui comptent = combien de λ sont proches de λ₁.
7. **Où ça casse** [casse].

## Figures exigées
- **Figure 1 — `plane` + `fixed` = directions propres** : A = [[2,1],[0,3]] ; presets « A », « A² », « A³ » (animés) ; les lignes de v₁ et v₂ restent fixes pendant que la grille se déforme. Légende : deux directions ne tournent pas ; tout le reste glisse vers v₂.
- **Figure 2 — `plot` + bouton « pas suivant »** : power iteration depuis w = (0, 1) : le vecteur normalisé Aᵏw/‖Aᵏw‖ dessiné à chaque k, l'angle avec v₂ en readout, et la courbe (2/3)ᵏ. Légende : convergence géométrique au rapport λ₂/λ₁.
- **Figure 3 — `plot` + `slider` k** : chaîne de Markov P, distribution Pᵏx depuis x = (0, 1) : deux barres qui convergent vers (5/6, 1/6) ; readout distance à π et 0,4ᵏ. Légende : λ₁ = 1 est la stationnaire, λ₂ = 0,4 la vitesse d'oubli de l'état initial.

## Où ça casse
- **Pas diagonalisable** (Jordan) ou **valeurs propres complexes** (rotation : aucune direction réelle conservée) — l'itération tourne au lieu de converger.
- **|λ₁| = |λ₂|** : pas de direction dominante ; Markov périodique ne converge pas.
- **Non carrée** : pas de valeur propre — c'est la SVD (p04-03).
- **Conditionnement** : λ_max/λ_min est ce qui rend une descente lente (p03-02) — même objet, autre usage.

## Résumé
1. Av = λv, v ≠ 0 : direction conservée, étirée par λ.
2. det(A − λI) = 0 vient du noyau non trivial de A − λI.
3. A = PDP⁻¹ : exprimer, étirer par axe, revenir ; Aᵏ = PDᵏP⁻¹.
4. Itérer sélectionne v₁ à la vitesse |λ₂/λ₁|ᵏ : power iteration, PageRank, Markov stationnaire.
5. Signal : « itération + long terme + matrice carrée » ⇒ valeur propre dominante.
6. Casse : complexes, |λ₁| = |λ₂|, non carrée, conditionnement.

**Phrase d'entretien** : « Un vecteur propre est une direction que l'action ne tourne pas ; on les trouve en demandant que A moins lambda I ait un noyau, donc un déterminant nul. Dans la base propre l'action est un étirement par axe, donc itérer élève chaque valeur propre à la puissance k, et la plus grande finit par dominer à la vitesse du rapport des deux premières : c'est PageRank, la loi stationnaire d'une chaîne de Markov, et l'explosion ou l'évanouissement d'un gradient répété. »

## Chaîne verbalisée
1. Définis vecteur propre, avec la condition qu'on oublie. → Av = λv, v ≠ 0.
2. D'où vient det(A − λI) = 0 ? → Ker(A − λI) ≠ {0} ⇔ det = 0.
3. Que fait PDP⁻¹, en trois gestes ? → Exprimer dans la base propre, étirer, revenir.
4. Pourquoi Aᵏw s'aligne sur v₁, et à quelle vitesse ? → Σ cᵢλᵢᵏvᵢ ; |λ₂/λ₁|ᵏ.
5. Quel signal appelle une valeur propre en entretien ? → Itération répétée d'une matrice carrée, long terme, état stable.

## Ce qui a cassé pour Salah
- t04 (index) : « signal itération + long terme + carrée » et « PDP⁻¹ en trois actions » déjà en cartes ; ici l'enchaînement noyau → det → base propre → itération est le contenu, pas les atomes.
- Le lien avec p03-02 (conditionnement) et p08-01 (gradient répété) doit être nommé en une ligne chacun : ce sont les deux endroits où il rencontrera λ_max/λ_min.

## Exclusions
Pas de Jordan, pas de théorème spectral (p04-03), pas de PageRank au-delà de la phrase, pas de calcul de valeurs propres 3×3.
