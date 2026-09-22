---
id: w02-01
series: walkthrough
part: "02"
number: "01"
slug: une-chaine-trois-exemples
title: Une chaîne, trois exemples (D4)
subtitle: fil B, de la vraisemblance à la pénalité — déroulé existant
prereq: [p02-01]
anki: [stats::vraisemblance, stats::regularisation]
bridges: []
next: p03-01
status: built
---
Existant : `sheets/walkthroughs/walkthrough-p02-01-une-chaine-trois-exemples.html` (ex-`walkthrough-d04-…`, 12 marches + synthèse). Spec de registre créé pendant l'installation de la refonte : le fichier était renommé par le prompt général (part 02, number 01, prereq `p02-01`, anki `stats::vraisemblance,stats::regularisation`) mais aucun spec ne le déclarait, donc ni l'index ni la carte ne le voyaient. Contenu inchangé.

## Questions pour la revue

- Le prompt général d'installation nommait `walkthrough-p02-01-…` sans prévoir de spec `w02-01` ; ce fichier comble le trou avec exactement les valeurs dictées. À confirmer : `next: p03-01` (le déroulé se termine sur la pénalité, la suite naturelle est le fil C) — c'est la seule valeur qui n'était pas donnée.

## Révision v2 (21/09/2026)

Delta rédigé par Claude en séance à la demande de Salah, dans le sillage de la révision v3 de p02-01 (voir `specs/p02-01-bruit-vraisemblance-loss.md`, « Révision v3 »). Contenu inchangé hors quatre retouches de texte, aucune marche ajoutée, aucun chiffre modifié, gabarit `nav.echelle` conservé :
- Ex. 1 pas 1 : « seul endroit où l'on suppose quelque chose » → « seul endroit où l'on suppose une loi sur les données ; l'indépendance, seconde hypothèse, n'autorise que le produit ». Écriture équivalente y_i | x_i ~ N(f(x_i ; β), σ²) ajoutée, avec la remarque « famille de position, f ne fait que translater, donc le bruit se sépare ».
- Ex. 2 pas 1 : « pas de ε à séparer : Bernoulli dont f règle la probabilité, dispersion p(1 − p) déduite ; cas général, l'exemple 1 était le cas particulier » ; application : y_i − p_i vaut −p_i ou 1 − p_i, loi dépendant de x_i.
- Note de marge « Deux hypothèses, pas plus » → « Deux lois supposées, pas plus … plus l'indépendance ».
- Synthèse, ligne 6, colonne Bernoulli : « log-loss (cross-entropy binaire) ».
- Version : meta `status=v2`, titre suffixé « · v2 ». Pas de footer dans ce gabarit, rien à y écrire.

## Révision v3 (22/09/2026)

Delta rédigé par Claude en séance à la demande de Salah : « ajoute un exemple de cas multiclass simple ». Un quatrième onglet, gabarit `nav.echelle` conservé, rail inchangé (mêmes pas 0–11), aucun chiffre des exemples 1–3 modifié.
- **Exemple 4 — trois classes, catégorielle (softmax)**, dimension zéro : y = (chat, chat, chat, chien, oiseau), n = (3, 1, 1), z = β ∈ ℝ³, p = softmax(β).
  - Pas 1 : y ~ Catégorielle(softmax(β)) ; Bernoulli = cas K = 2.
  - Pas 2 : p(yᵢ | β) = softmax(β)_{yᵢ} ; chiffré en β = (2, 0, −1) : (0,844 ; 0,114 ; 0,042).
  - Pas 3–5 : L = p_chat³ · p_chien · p_oiseau ; ℓ = 3β_chat + β_chien + β_oiseau − 5·LSE(β) ; NLL(2, 0, −1) = 3×0,170 + 2,17 + 3,17 = 5,85.
  - Pas 6 : rien à jeter → cross-entropy = −Σᵢ log p_{yᵢ} ; forme logits LSE(z) − z_y (`CrossEntropyLoss`) ; softmax à K = 2 = sigmoïde de la différence des logits.
  - Pas 7 [casse] : p̂ = n/5 = (0,6 ; 0,2 ; 0,2) unique, mais β̂ = log p̂ + c·(1,1,1) pour tout c — non identifiable, vallée plate venue du modèle (K logits pour K − 1 degrés de liberté) ; NLL = 4,75 sur toute la droite ; table de quatre représentants avec ‖β‖² (5,44 ; 2,41 ; 5,62 ; 0,80). Seconde casse en mini : classe jamais vue ⇒ p̂ₖ = 0 ⇒ β̂ₖ → −∞ (ex. 2).
  - Pas 8–9 : βₖ ~ N(0, τ²) → λ‖β‖².
  - Pas 10 : sur la droite, ‖β‖² parabole en c, minimum à Σβ = 0 → (0,732 ; −0,366 ; −0,366) ; vaut pour tout λ (la NLL ne dépend que des différences). Figure `fig-plate-softmax` : NLL plate le long de c, NLL + λ(0,80 + 3c²) pour λ ∈ {0 ; 0,05 ; 0,2 ; 0,5}, minimum en c = 0.
  - Pas 11 (numérique, descente de gradient) : λ = 0,01 → (0,724 ; −0,362 ; −0,362), p̂ = (0,597 ; 0,201 ; 0,201) ; λ = 0,1 → (0,660 ; −0,330 ; −0,330), p̂ = (0,574 ; 0,213 ; 0,213) ; λ = 1 → (0,353 ; −0,176 ; −0,176), p̂ = (0,459 ; 0,271 ; 0,271). Somme nulle à chaque λ ; p̂ glisse vers l'uniforme (lissage de Laplace, version continue).
- Synthèse : colonne « Ex. 4 — catégorielle » ; titre « Les quatre exemples côte à côte » ; colspan 2–5 passé à 4.
- Marge : « Deux façons de casser » mentionne l'ex. 4 ; note ajoutée « Sigmoïde = softmax à deux ».
- Porte : exercice ajouté, ex. 4 avec n = (3, 2, 0).
- En-tête : « rejouée telle quelle sur trois autres ».
- Version : meta `status=v3`, titre suffixé « · v3 ». Pas de footer dans ce gabarit.
- Rail : entrée Synthèse « quatre exemples côte à côte ». Table du pas 7 sans colonne softmax (identique sur chaque ligne, dite dans le texte) pour tenir à 390 px.

## Révision v4 (22/09/2026)

Delta rédigé par Salah (prompt « Révision des trois fiches du fil B », sections 0 et 3). Gabarit `nav.echelle` conservé ; chiffres des exemples 1–3 inchangés.
- **Numérotation** (0.1) : pas 7 « Nommer, s'arrêter » ajouté dans chaque onglet ; anciens 7–11 → 8–12 (ids `s7`–`s11` → `s8`–`s12`, nouveau `s7`) ; rail, synthèse, marge, porte et renvois internes mis à jour ; en-tête « 12 pas ».
- **Exemple 4 réécrit** (3.1) : une observation, z = (2, 0, −1), chat/chien/oiseau ↔ k = 1, 2, 3, pas 0 à 7 avec les briques 1.1 (a)→(f) — catégorielle/simplexe/K − 1, softmax rôle de σ (positive, somme 1), z = Wx et Ŵ, masse one-hot Π p_k^{y_k} = p₁ (a⁰ = 1), chiffré e² = 7,389, e⁰ = 1, e⁻¹ = 0,368, somme 8,757, p = (0,844 ; 0,114 ; 0,042), log en deux règles, ln 0,844 = −0,170, pièges softmax ≠ cross-entropy et signe, cross-entropy 0,170 / 3,17, contrôle 2,170 − z_c, ln explicite ; pas 8–12 en une ligne « identiques à l'exemple 2, avec λ‖W‖² ». La version v3 (dimension zéro, n = (3, 1, 1), direction plate β + c·1, figure `fig-plate-softmax`) est retirée — récupérable dans l'historique (commit 4f8f6be).
- Exemple 1 : valeurs propres calculées (tr = 70, det = 0, μ(μ − 70) = 0, contrôles somme/produit, vecteurs propres vérifiés) (3.3) ; σ̂² = RSS/(n − p), RSS/n biaisé (0.4) ; ‖β‖² développé, minimum en −b/(2a) = −0,4 (3.4) ; inverse 2×2 rappelée, produits intermédiaires 798 − 784, 420 − 392 (3.5) ; β̂ = (r/5)(1, 2) dérivé par vecteur propre de Xᵀy, r = 70/(70 + λ) à la place de s (3.6, 0.5), readout de la figure 1 « r = ».
- Exemple 2 : forme en logits dérivée (deux identités, un terme y = 1, un terme y = 0, paires ±1 et ±2), BCEWithLogitsLoss en une clause + p08-02 (3.7) ; ligne β = 1 calculée : 2·0,313 + 2·0,127 = 0,880 (3.8) ; pas 12 : condition Σ(p_i − y_i)x_i + 2λβ = 0 résolue par bissection (3.9) ; encadré MSE : « bornée » = argument de valeur, gradient = mécanisme, convexité en une ligne (3.10).
- Exemple 3 : ‖β‖₁ minimisée cas par cas (3.11) ; brique Laplace réduite (mécanisme en un chiffre, table 3 lignes, Huber + prix en une ligne, « ce qu'il faut savoir dire ») (3.12).
- Synthèse (3.13) : lignes 6 · jeter et 7 · nommer, 7b Bernoulli « toute la loi P(y = 1 | x) », colonne Ex. 4 (pas 1–7, « idem ex. 2 » pour 8–12).
- Version : meta status=v4, titre « · v4 ».
