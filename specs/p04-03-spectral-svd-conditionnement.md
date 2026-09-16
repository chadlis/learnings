---
id: p04-03
series: chain
part: "04"
number: "03"
slug: spectral-svd-conditionnement
title: Spectral, SVD, conditionnement — rotation, étirement, rotation
subtitle: toute matrice est un étirement entre deux rotations ; le rapport des étirements mesure la difficulté
prereq: [p04-02]
anki: [algebre::spectral, algebre::svd, algebre::conditionnement, algebre::valeurs-singulieres]
bridges: [b06]
next: p04-04
status: ready
---

## Question de la chaîne
Pourquoi une matrice symétrique se diagonalise « proprement », que faire d'une matrice rectangulaire, et pourquoi le rapport σ_max/σ_min dit si un problème est bien posé ?

## Prérequis
- p04-02 : valeurs propres, PDP⁻¹, symétrique ⇒ orthogonal.
- p04-01 : rang, image, noyau.

## Hypothèses posées
- H1 : matrices réelles.
- H2 : pour la SVD, X est n×p quelconque, sans hypothèse de rang.

## Exemple fil rouge
C = [[1, 1], [1, 4]] (une covariance) : valeurs propres 4,30 et 0,697 (trace 5, det 3) ; directions (0,29 ; 0,96) et (−0,96 ; 0,29), orthogonales ; κ = 6,17.
X = [[1, 2], [2, 4], [3, 6]] (D4, rang 1) : XᵀX = [[14, 28], [28, 56]], valeurs propres 70 et 0 ; valeurs singulières σ₁ = √70 = 8,37, σ₂ = 0. Conditionnement infini ; +λI donne κ = (70 + λ)/λ = 71 à λ = 1.
X₂ = [[1, 0], [0, 1], [1, 1], [2, 1]] : σ = (2,80 ; 1,07), κ = 2,62 — bien conditionné. Ridge de w03-01 : κ = 71 ⇒ ~κ itérations de descente.

## Pas de la chaîne
1. **Le décor.** p04-02 diagonalise avec P⁻¹ ; quand A est symétrique, P⁻¹ = Pᵀ et tout devient géométrique. Quand A n'est pas carrée, il n'y a pas de valeurs propres : il faut autre chose.
2. **Théorème spectral** [tronc]. A = Aᵀ ⇒ A = QΛQᵀ avec Q orthogonale (colonnes orthonormées, Q⁻¹ = Qᵀ) et Λ réelle. Lecture : tourner (Qᵀ), étirer chaque axe (Λ), retourner (Q). Le carré unité devient une ellipse alignée sur les directions propres. Au tableau : « Symétrique, donc les directions propres sont orthogonales et les valeurs réelles, donc le changement de base est une rotation, donc A est une dilatation vue dans une base tournée — et retourner ne coûte qu'une transposée. »
3. **Formes quadratiques.** xᵀAx = Σ λᵢ(coordonnée i dans la base propre)². A définie positive ⇔ tous λᵢ > 0 ⇔ xᵀAx > 0 : un bol ; λ = 0 : une vallée plate (D4) ; λ < 0 : une selle. C'est la géométrie de la loss quadratique (p03-02).
4. **SVD : rectangulaire = rotation, étirement, rotation** [tronc]. Toute X (n×p) s'écrit X = UΣVᵀ : V orthogonale dans l'espace des entrées, Σ diagonale ≥ 0 (valeurs singulières), U orthogonale dans l'espace des sorties. Le cercle unité de Rᵖ devient une ellipse dans Rⁿ dont les demi-axes sont les σᵢ. Rang = nombre de σᵢ > 0. Au tableau : « Une matrice rectangulaire envoie une sphère sur une ellipse, donc il existe des axes d'entrée orthogonaux envoyés sur des axes de sortie orthogonaux, donc X est une rotation, un étirement, une rotation. »
5. **Lien avec XᵀX.** XᵀX = VΣ²Vᵀ : les valeurs propres de XᵀX sont les σᵢ², ses directions propres sont les V. Donc la SVD de X **est** la diagonalisation de la covariance (p04-04). Au tableau : « XᵀX vaut VΣ²Vᵀ, donc ses valeurs propres sont les carrés des valeurs singulières, donc diagonaliser la covariance et décomposer X sont le même calcul. »
6. **Conditionnement κ = σ_max/σ_min** [tronc]. Il mesure combien l'ellipse est allongée : combien une erreur relative sur b est amplifiée sur la solution de Ax = b, et combien de pas une descente de gradient demande (p03-02). κ = ∞ ⇔ singulier ; κ ≈ 10⁸ en float32 ⇔ aucun chiffre fiable. Au tableau : « La solution divise par les σ, donc la direction de σ_min amplifie les erreurs de 1/σ_min, donc le rapport σ_max/σ_min est le facteur d'amplification, donc c'est lui qui dit si le problème est bien posé. »
7. **Ne pas former XᵀX.** Former XᵀX **élève κ au carré** (Σ²) ; en flottant on perd deux fois plus de chiffres. On résout les moindres carrés par QR ou SVD de X directement ; `lstsq` le fait, `inv(X.T @ X) @ X.T @ y` est le mauvais réflexe. Au tableau : « Les valeurs singulières de XᵀX sont les carrés, donc son conditionnement est le carré, donc passer par XᵀX double la perte de précision. »
8. **Rang faible = compression.** Garder les k plus grands σ : X_k = U_kΣ_kV_kᵀ est la meilleure approximation de rang k (en norme de Frobenius). Images, embeddings, LoRA (ΔW = BA de rang r) : la même idée — l'information est dans quelques directions.
9. **Où ça casse** [casse].

## Figures exigées
- **Figure 1 — `plane`** : preset C = [[1, 1], [1, 4]] avec un bouton « décomposer » qui anime en trois temps : Qᵀ (rotation), Λ (étirement le long des axes), Q (rotation retour), avec le cercle unité qui devient l'ellipse ; directions propres en `fixed`. Légende : symétrique = ellipse alignée sur des axes orthogonaux.
- **Figure 2 — `plane`** : preset non symétrique (cisaillement [[1, 1], [0, 1]] ou [[2, 1], [0, 3]]) : même animation en Vᵀ, Σ, U ; le cercle devient une ellipse dont les axes ne sont pas les directions propres. Readout σ₁, σ₂, κ. Légende : rotation, étirement, rotation ; les axes d'entrée et de sortie diffèrent.
- **Figure 3 — `plot` + `slider` κ ∈ [1, 1 000] (log)** : ellipse de niveau xᵀAx = 1 pour A = diag(1, κ) dessinée en 2D (allongement), et à côté le nombre de pas de descente à η = 1/κ pour atteindre 1 % (≈ κ·ln 100/2) ; readouts. Légende : κ allonge l'ellipse et multiplie les pas.
- **Figure 4 — `plot` + `slider` λ ∈ [0, 20]** : κ(XᵀX + λI) = (70 + λ)/λ pour X de rang 1 ; ligne κ² pour « former XᵀX ». Légende : la pénalité ramène κ de l'infini à 71 ; former XᵀX le met au carré.

## Où ça casse
- **Petites valeurs singulières non nulles** : σ = 10⁻⁸ n'est pas 0 mais multiplie le bruit par 10⁸ ; le rang « numérique » se lit avec un seuil, pas avec det.
- **Échelles hétérogènes** : une feature en km et une en mm donnent κ énorme sans que le problème soit mal posé ; standardiser d'abord.
- **SVD complète en grande dimension** : O(np·min(n, p)) ; on tronque (SVD randomisée, power iteration sur les k premières).
- **Rang faible n'est pas gratuit** : LoRA suppose que l'adaptation vit dans quelques directions ; si c'est faux, r petit sous-apprend.

## Résumé
1. Symétrique : A = QΛQᵀ, Q rotation — tourner, étirer, retourner ; xᵀAx = Σλᵢ·(coord)² ⇒ bol si λ > 0.
2. Rectangulaire : X = UΣVᵀ — rotation, étirement (σ ≥ 0), rotation ; rang = nombre de σ > 0.
3. XᵀX = VΣ²Vᵀ : valeurs propres = σ² ; SVD de X = diagonalisation de la covariance.
4. κ = σ_max/σ_min : amplification des erreurs, nombre de pas de descente ; ∞ ⇔ singulier.
5. Ne pas former XᵀX : κ au carré ; QR/SVD/lstsq.
6. Tronquer la SVD = meilleure approximation de rang k (compression, LoRA).

**Phrase d'entretien** : « Une matrice symétrique est une dilatation vue dans une base orthonormée, et toute matrice rectangulaire est un étirement entre deux rotations — c'est la SVD, dont les valeurs singulières au carré sont les valeurs propres de XᵀX. Le rapport de la plus grande à la plus petite est le conditionnement : il dit combien une erreur est amplifiée et combien de pas une descente demande. Former XᵀX l'élève au carré, c'est pourquoi on résout par QR ou SVD. »

## Chaîne verbalisée
1. Que dit le théorème spectral, en trois gestes ? → Symétrique ⇒ QΛQᵀ : rotation, étirement, rotation inverse.
2. Que dit xᵀAx > 0 pour tout x ? → Tous les λ > 0 ; un bol.
3. Lis X = UΣVᵀ. → Rotation dans l'espace d'entrée, étirement par les σ, rotation dans l'espace de sortie.
4. Relie σ et les valeurs propres de XᵀX. → λ(XᵀX) = σ², mêmes directions V.
5. Que mesure κ et pourquoi ne pas former XᵀX ? → Amplification des erreurs et nombre de pas ; κ(XᵀX) = κ(X)².
6. Que vaut κ de la ridge de D4 à λ = 1 ? → 71.

## Ce qui a cassé pour Salah
- Scope acté le 10/09 : SDP et théorème spectral **exclus** du checkpoint ; ici on ne démontre pas le spectral, on l'énonce et on le montre (figure 1). Garder la chaîne au niveau « lecture géométrique + conditionnement », qui est ce qu'un entretien demande.
- t04 : « σᵢ = √λᵢ(AᵀA) ; ne pas former AᵀA » en Q/A — pas 5 et 7 lui donnent le mécanisme (Σ²).
- w03-01 (κ = 71, ~114 pas) est l'exemple chiffré ; y renvoyer au pas 6 plutôt que refaire la descente.

## Exclusions
Pas de démonstration du spectral ni de la SVD, pas de pseudo-inverse au-delà du nom, pas de SVD randomisée détaillée.
