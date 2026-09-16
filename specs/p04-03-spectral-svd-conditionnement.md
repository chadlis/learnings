---
id: p04-03
series: chain
part: "04"
number: "03"
slug: spectral-svd-conditionnement
title: Spectral, SVD, conditionnement
subtitle: algèbre — symétrique ⇒ base orthogonale ; rectangulaire ⇒ rotation, étirement, rotation
prereq: [p04-02]
anki: [algebre::spectral, algebre::svd, algebre::conditionnement]
bridges: [b06]
next: p04-04
status: stub
---

## Question de la chaîne
Pourquoi une matrice symétrique se diagonalise dans une base orthogonale, comment une matrice rectangulaire se décompose en rotation-étirement-rotation, et pourquoi on ne forme jamais AᵀA.

## Prérequis
- p04-02 : valeurs propres, PDP⁻¹.

## Hypothèses posées
- H1 : matrices réelles.
- H2 : S symétrique (S = Sᵀ) pour le théorème spectral ; A quelconque m×n pour la SVD.

## Exemple fil rouge
S = [[2, 1], [1, 2]] : λ = 3 (v = (1, 1)/√2) et 1 (v = (1, −1)/√2) : orthogonaux, P orthogonale (Pᵀ = P⁻¹), S = PDPᵀ.
A = [[3, 0], [4, 5]] : AᵀA = [[25, 20], [20, 25]], valeurs propres 45 et 5 ⇒ σ₁ = √45 = 6,71, σ₂ = √5 = 2,24 ; κ(A) = σ₁/σ₂ = 3 ; κ(AᵀA) = 45/5 = 9 = κ². det A = 15 = σ₁σ₂.
Covariance (1 1 ; 1 4) : symétrique définie positive ⇒ spectrale ⇒ PCA (p04-04).

## Pas de la chaîne
1. **Le décor.** p04-02 diagonalise avec une base quelconque, P⁻¹ coûte cher et déforme. Deux cas rendent tout propre : S symétrique, ou n'importe quelle A si on accepte deux bases au lieu d'une.
2. **Théorème spectral** [tronc]. S = Sᵀ ⇒ valeurs propres réelles et vecteurs propres **orthogonaux** ⇒ S = PDPᵀ avec P orthogonale. Pourquoi orthogonaux : si Sv = λv et Sw = μw, λ⟨v, w⟩ = ⟨Sv, w⟩ = ⟨v, Sw⟩ = μ⟨v, w⟩, donc (λ − μ)⟨v, w⟩ = 0. Au tableau : « La symétrie fait passer S d'un côté à l'autre du produit scalaire, donc deux vecteurs propres de valeurs différentes sont orthogonaux, donc la base propre est orthonormée, donc l'inverse de P est sa transposée. »
3. **Définie positive.** xᵀSx > 0 pour tout x ≠ 0 ⇔ toutes les λ > 0. Covariances, XᵀX, hessiennes de fonctions convexes : ce sont les matrices qu'on rencontre, et elles sont toutes symétriques (semi-)définies positives.
4. **SVD = rotation, étirement, rotation** [tronc]. A = UΣVᵀ : V orthogonale (base d'entrée), Σ diagonale ≥ 0 (les σᵢ), U orthogonale (base de sortie). Toute matrice, même rectangulaire, même de rang déficient. Les σᵢ² sont les valeurs propres de AᵀA (et de AAᵀ) ; V leurs vecteurs propres. Au tableau : « AᵀA est symétrique semi-définie positive, donc spectrale avec des λ ≥ 0, donc en posant σ = √λ et u = Av/σ on obtient deux bases orthonormées reliées par un étirement, donc A tourne, étire, tourne. »
5. **Conditionnement** [tronc]. κ(A) = σ_max/σ_min : rapport d'étirement extrême. Grand κ ⇒ une petite perturbation d'entrée dans la direction faible devient une grande perturbation de solution ; c'est la vallée allongée de p03-02 (κ = λ_max/λ_min de la hessienne). Au tableau : « La direction la plus étirée et la moins étirée diffèrent d'un facteur κ, donc l'inverse amplifie le bruit dans la direction faible par κ, donc κ mesure la sensibilité de la résolution aux erreurs. »
6. **Ne jamais former AᵀA** [tronc]. κ(AᵀA) = κ(A)² : résoudre les équations normales XᵀXβ = Xᵀy met les erreurs au carré. Sur le fil rouge, 3 devient 9 ; sur des données réelles, 10⁴ devient 10⁸ et float32 ne suit plus (ε = 10⁻⁷). Les solveurs (lstsq, QR, SVD) travaillent sur X directement. Au tableau : « Les valeurs singulières de AᵀA sont les carrés de celles de A, donc leur rapport est le carré du conditionnement, donc former AᵀA carre l'amplification des erreurs. »
7. **Ridge en base SVD.** β̂_ridge = V diag(σᵢ/(σᵢ² + λ)) Uᵀy : chaque direction est multipliée par σᵢ/(σᵢ² + λ) ; les directions à petit σ (celles qui amplifient le bruit) sont écrasées, les grandes presque intactes. C'est le mécanisme de p02-02 vu en coordonnées. Troncature à k valeurs = meilleure approximation de rang k (nommer).
8. **Où ça casse** [casse].

## Figures exigées
- **Figure 1 — `plane` en trois étapes animées** : A = [[3,0],[4,5]] appliquée à un cercle unité comme Vᵀ (rotation), puis Σ (étirement en ellipse d'axes 6,71 et 2,24), puis U (rotation) ; bouton « d'un coup » pour comparer. Légende : l'ellipse image a pour demi-axes les σ ; κ est leur rapport.
- **Figure 2 — `plot` + `slider` κ ∈ [1, 100]** : perturbation relative de la solution de Ax = b en fonction d'une perturbation relative de b de 1 % (droite de pente κ) ; readout. Légende : l'erreur est amplifiée au plus par κ, et par κ² si on passe par AᵀA.
- **Figure 3 — `plot` + `slider` λ** : facteurs σᵢ/(σᵢ² + λ) pour σ ∈ {6,71 ; 2,24 ; 0,3} (une petite valeur ajoutée pour l'effet) en fonction de λ. Légende : ridge éteint d'abord les directions faibles.

## Où ça casse
- **σ_min = 0** : κ = ∞, rang déficient, pas d'inverse ; ridge le répare (p02-02).
- **Standardisation** : les σ dépendent des unités ; une feature en cm et une en km fabriquent un κ artificiel (p03-02, préconditionnement).
- **Spectral appliqué à une non-symétrique** : les vecteurs propres ne sont pas orthogonaux, P⁻¹ ≠ Pᵀ ; c'est la SVD qu'il faut.
- **Troncature SVD** ≠ sélection de features : les directions sont des combinaisons de toutes les colonnes.

## Résumé
1. Symétrique ⇒ base propre orthonormée, S = PDPᵀ ; définie positive ⇔ λ > 0.
2. SVD : A = UΣVᵀ, toute matrice ; σᵢ² = valeurs propres de AᵀA ; rotation, étirement, rotation.
3. κ = σ_max/σ_min : amplification des erreurs ; c'est la vallée allongée de la descente.
4. Ne jamais former AᵀA : κ² ; solveurs sur X.
5. Ridge en base SVD : facteur σᵢ/(σᵢ² + λ), éteint les directions faibles.

**Phrase d'entretien** : « Une matrice symétrique se diagonalise dans une base orthonormée parce que la symétrie rend deux vecteurs propres de valeurs différentes orthogonaux. Une matrice quelconque se décompose en rotation, étirement, rotation : c'est la SVD, dont les valeurs singulières sont les racines des valeurs propres de A transposée A. Leur rapport, le conditionnement, mesure l'amplification des erreurs ; former A transposée A l'élève au carré, donc on résout sur A directement. »

## Chaîne verbalisée
1. Pourquoi les vecteurs propres d'une symétrique sont orthogonaux ? → λ⟨v,w⟩ = ⟨Sv,w⟩ = ⟨v,Sw⟩ = μ⟨v,w⟩.
2. Que sont U, Σ, V dans A = UΣVᵀ ? → Base de sortie, étirements, base d'entrée ; σ² = v.p. de AᵀA.
3. Que mesure κ et où l'a-t-on déjà vu ? → σ_max/σ_min ; amplification des erreurs ; vallée allongée de p03-02.
4. Pourquoi ne pas résoudre les équations normales ? → κ(AᵀA) = κ² ; float32 ne suit plus.
5. Que fait ridge à chaque direction singulière ? → Multiplie par σ/(σ² + λ) ; éteint les petites.

## Ce qui a cassé pour Salah
- Scope acté le 10/09 : **pas de démonstration du théorème spectral** — le pas 2 en donne l'argument en une ligne (orthogonalité), pas la preuve d'existence. SDP au-delà de « λ > 0 » exclu.
- Karpathy B3 (attention) et la PCA (p04-04) sont les deux usages qu'il rencontrera ; le pont avec ridge (pas 7) relie p02-02 à quelque chose de visible.

## Exclusions
Pas de preuve du théorème spectral, pas de pseudo-inverse en détail, pas d'Eckart-Young au-delà du nom, pas d'algorithme de calcul de la SVD.
