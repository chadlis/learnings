---
id: p02-01
series: chain
part: "02"
number: "01"
slug: bruit-vraisemblance-loss
title: Du bruit à la loss — le geste en six pas
subtitle: fil B — hypothèse de bruit → densité → produit → log → négatif → jeter
prereq: [p00-02, p00-03]
anki: [stats::vraisemblance, stats::mle, ml::regression-lineaire, ml::logistique, dl::cross-entropy]
bridges: [b05, b06]
next: p02-02
status: built
---

## Question de la chaîne
D'où viennent la MSE, la log-loss, la MAE et la cross-entropy ? Réponse : d'une seule hypothèse, celle du bruit, et d'un geste mécanique en six pas.

## Prérequis
- p00-02 : masse vs densité ; on **évalue** la densité en un point, on ne l'intègre pas.
- p00-03 : indépendance ⇒ la probabilité jointe est un produit.
- log croissant ⇒ même argmax ; log(ab) = log a + log b.

## Hypothèses posées
- H1 : on modélise **y sachant x**, jamais x.
- H2 : observations **indépendantes** conditionnellement à x et θ (c'est ce qui autorise le produit).
- H3 : θ est un **paramètre fixe** (cadre fréquentiste, notation p(y | x ; θ)). Le prior arrive en p02-02.

## Exemple fil rouge
Trois exemples, tous minuscules, calculés à la main :
- **Régression**, x = (1, 2, 3), y = (1, 2, 3), modèle f = βx, bruit N(0, σ²) → RSS(β) = 14 − 28β + 14β² = 14(1 − β)² ; β̂ = 1.
- **Classification**, x = (−2, −1, 1, 2), y = (0, 0, 1, 1), p = σ(βx), bruit Bernoulli → NLL(β) = 2 log(1 + e⁻ᵝ) + 2 log(1 + e⁻²ᵝ) ; décroît vers 0 sans minimum (séparation parfaite).
- **Trois classes** (chat/chien/oiseau), un exemple avec logits z = (2, 0, −1), vraie classe chat : softmax = (0,844 ; 0,114 ; 0,042) ; NLL = −log 0,844 = 0,170. Vraie classe oiseau : NLL = −log 0,042 = 3,17.
- Pièce PPP (3 succès) : L(p) = p³, argmax p̂ = 1.

## Pas de la chaîne
1. **Le décor.** Un modèle f(x ; θ), des données. On veut θ. Il faut un critère ; la seule hypothèse qu'on va poser est celle du bruit.
2. **Hypothèse sur le bruit** [tronc]. yᵢ = f(xᵢ ; θ) + εᵢ avec une loi pour ε ; ou directement yᵢ ~ Loi(f(xᵢ ; θ)). C'est **le seul endroit où l'on suppose**. Au tableau : « La loss n'est pas choisie, elle sera déduite, donc tout ce qu'on suppose est ici : la loi du bruit. »
3. **Densité d'une observation.** p(yᵢ | xᵢ ; θ) : on injecte εᵢ = yᵢ − f(xᵢ ; θ) dans la densité du bruit. Gaussien : (1/(σ√2π)) exp(−(yᵢ − f)²/(2σ²)). Bernoulli : pᵢʸⁱ(1 − pᵢ)¹⁻ʸⁱ. Catégoriel : p_{yᵢ} = softmax(z)_{yᵢ}. Le 2 sous σ² fait partie de la gaussienne.
4. **Produit.** Indépendance ⇒ L(θ) = Π p(yᵢ | xᵢ ; θ). Fonction de θ à données fixées : vraisemblance. Pas une loi sur θ (∫L dθ ≠ 1).
5. **Log.** ℓ(θ) = Σ log p(yᵢ | xᵢ ; θ). Même argmax ; le produit devient une somme (dérivable terme à terme, pas d'underflow). Gaussien : −n log(σ√2π) − Σ(yᵢ − f)²/(2σ²) — le n devant la constante, un par observation.
6. **Négatif.** NLL = −ℓ. Maximiser une vraisemblance = minimiser une loss. C'est le signe qui fabrique la loss.
7. **Jeter** [tronc]. L'argmin ignore une constante additive et un facteur positif. Ce qui reste porte un nom : gaussien → **MSE** (σ² jeté) ; Bernoulli → **log-loss** (rien à jeter) ; Laplace → **MAE** ; catégoriel → **cross-entropy** = −log p_{y}. Au tableau : « La constante ne dépend pas de θ, donc elle ne déplace pas l'argmin, donc on la jette, donc ce qui reste est la loss, et sa forme est la forme de l'exposant de la densité. »
8. **Ce que chaque loss estime.** MSE → moyenne conditionnelle ; MAE → médiane conditionnelle ; log-loss / cross-entropy → probabilité conditionnelle. Changer de bruit change la **cible**, pas seulement la robustesse.
9. **Le geste, en arrière.** Devant une loss inconnue : quel exposant, donc quelle densité, donc quel bruit ? MSE ⇒ gaussien ; |·| ⇒ Laplace ; −log p ⇒ Bernoulli/catégoriel. Savoir dire « la MAE suppose des queues exponentielles et estime la médiane ».
10. **Où ça casse** [casse].

## Figures exigées
- **Figure 1 — `plot` + `slider` résidu r ∈ [−4, 4]** : trois densités du bruit (gaussienne, Laplace, et — en pointillé — leur −log) ; un point mobile sur r ; readout : densité et −log densité sous chaque loi. Légende : la loss est le −log de la densité ; carré pour gaussien, valeur absolue pour Laplace.
- **Figure 2 — `plot`** : L(p) = p³ sur [0,1] (PPP) et log L ; marque p̂ = 1. Légende : le MLE ne croit que l'observé ; le log garde l'argmax.
- **Figure 3 — `plot` + `slider` p ∈ ]0,1[** : −log p (y = 1) et −log(1 − p) (y = 0) ; readout ; ligne pointillée de la MSE (1 − p)² pour comparaison. Légende : la log-loss n'est pas bornée, la MSE l'est ; une erreur confiante coûte sans limite.
- **Figure 4 — `plot` + `slider` β ∈ [0, 10]** : NLL(β) de l'exemple 2 ; readout ; décroît vers 0 sans l'atteindre. Légende : pas de minimum — la pénalité (p02-02) le fera exister.

## Où ça casse
- **Produit interdit** : dépendance (séries, mesures répétées) ⇒ la vraisemblance jointe ne se factorise pas.
- **Le MLE ne croit que le vu** : PPP ⇒ p̂ = 1, un mot jamais vu ⇒ probabilité 0 ⇒ toute phrase impossible. Remède : prior (p02-02).
- **Pas de minimum** : séparation parfaite ⇒ ‖β‖ → ∞ (figure 4).
- **σ a disparu** au pas 7 : si on veut une barre d'erreur sur β̂, il faut le récupérer (σ̂² = RSS/n) — retour fil A (p01-03).

## Résumé
1. Une seule hypothèse : la loi du bruit.
2. Six pas mécaniques : densité → produit (indépendance) → log → négatif → jeter → nom de la loss.
3. Gaussien → MSE ; Laplace → MAE ; Bernoulli → log-loss ; catégoriel → cross-entropy = −log p_y.
4. La loss estime : moyenne / médiane / probabilité selon le bruit.
5. Le geste marche en arrière : de la loss vers le bruit qu'elle suppose.
6. Casse : dépendance, MLE ne croit que le vu, séparation parfaite, σ jeté.

**Phrase d'entretien** : « Je ne choisis pas la MSE, elle tombe d'un bruit gaussien : je pose la loi du bruit, j'écris la densité de chaque observation, le produit par indépendance, le log, le signe moins, je jette les constantes, et il reste la somme des carrés. Le même geste avec Bernoulli donne la log-loss, avec une catégorielle la cross-entropy, avec Laplace la MAE — et chacune estime une cible différente. »

## Chaîne verbalisée
1. Quelle est la seule hypothèse de la chaîne ? → La loi du bruit (et l'indépendance qui autorise le produit).
2. Déroule les six pas sur un bruit gaussien. → densité → produit → log → négatif → jeter σ² et constante → MSE.
3. Que jette-t-on avec Bernoulli ? → Rien : pas de paramètre de dispersion séparé ; la log-loss est la NLL telle quelle.
4. La cross-entropy à trois classes, c'est quoi ? → −log de la probabilité softmax de la vraie classe : NLL d'une catégorielle.
5. Que casse la séparation parfaite ? → La NLL n'a pas de minimum, ‖β‖ → ∞.
6. Que suppose la MAE et qu'estime-t-elle ? → Bruit de Laplace ; la médiane conditionnelle.

## Ce qui a cassé pour Salah
- 15/09 : n'a pas reconnu la cross-entropy comme **point d'arrêt** (a continué à calculer) — le pas 7 doit dire explicitement « ici on s'arrête, ça a un nom ».
- 15/09 : manquaient le 2 sous σ² (pas 3) et le n devant la constante (pas 5). Les écrire en clair, avec la remarque.
- 16/09 matin : trou de mémoire sur le lien cross-entropy ↔ MLE ; la recette en quatre pas (loi paramétrée → proba d'une obs → produit → argmax) a été redonnée. Le pas 3 catégoriel + figure 3 sont la réponse ; l'exemple chat/chien/oiseau est le sien.
- 15/09 : prédit 0 au lieu de nan pour un overflow float32 — hors périmètre ici, pointer vers p08-02.
- Scories : p(y|x,β) au lieu de p(y|x;β) ; densité intégrée au lieu d'évaluée.
- D4 existe (déroulé complet, trois onglets) : cette chaîne est la version « règles », D4 la version « calculs ». Se référencer mutuellement.

## Exclusions
Pas de prior ici (p02-02). Pas de Huber au-delà du nom. Pas de KL (p08-03).

## Questions pour la revue
- **Chiffres du spec : tous vérifiés, aucun faux.** Script de contrôle : RSS(β) = 14 − 28β + 14β² = 14(1 − β)², β̂ = 1 ; NLL(β) = 2 log(1 + e⁻ᵝ) + 2 log(1 + e⁻²ᵝ) (identique au calcul point par point), NLL(0) = 4 log 2 = 2,773, décroissante, pente toujours < 0 ; softmax(2, 0, −1) = (0,8438 ; 0,1142 ; 0,0420), −log 0,844 = 0,1698, −log 0,042 = 3,1698 ; L(p) = p³, argmax 1 ; MSE ↔ moyenne et MAE ↔ médiane vérifiés sur y = (1, 2, 3, 4, 20) (moyenne 6, médiane 3, argmin uniques). Rien à corriger dans le spec.
- **Écart assumé sur la figure 1.** Le spec demandait un seul `plot` portant les densités *et* leurs −log. Sur un seul cadre les densités (≤ 0,5) sont écrasées contre l'axe face aux −log (jusqu'à 8,9). La figure est donc en **deux panneaux superposés** partageant le même curseur `r` : densité en haut, −log en pointillé en bas. À valider.
- **Curseur ajouté à la figure 2** (le spec n'en demandait pas) : il donne L(p) et log L(p) en lecture directe et rend visible que l'argmax ne bouge pas.
- **Où placer le pointeur p08-02** (overflow float32, 0 au lieu de nan). Il est au pas 5, dans la remarque sur le sous-débordement — pas dans « où ça casse », puisque le spec le déclare hors périmètre. À confirmer.
- **Somme ou moyenne ?** La sheet écrit la cross-entropy en somme (−Σ log p_yᵢ), conformément au geste du MLE ; les frameworks moyennent par défaut. Faut-il le dire ici, ou est-ce le sujet d'une autre sheet ?
- **`ml::regression-lineaire`** est repris tel quel du frontmatter ; vérifier que le tag existe bien sous cette forme dans Anki (les autres tags de la liste sont déjà utilisés par p01-03 et p03-01).
