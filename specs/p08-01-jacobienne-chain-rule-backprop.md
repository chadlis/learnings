---
id: p08-01
series: chain
part: "08"
number: "01"
slug: jacobienne-chain-rule-backprop
title: Jacobienne, chain rule, backprop — pourquoi on part de la sortie
subtitle: la porte d'entrée de B1 (micrograd) : une dérivée est une matrice, et l'ordre des produits décide du coût
prereq: [p04-01, p03-02]
anki: [analyse::gradient-jacobienne, analyse::chain-rule, dl::backprop, dl::vjp]
bridges: [b01]
next: p08-02
status: ready
---

## Question de la chaîne
Un réseau est une composition de fonctions. Comment obtenir le gradient de la loss par rapport à chaque poids, et pourquoi l'obtient-on en remontant depuis la sortie plutôt qu'en descendant depuis l'entrée ?

## Prérequis
- p04-01 : une matrice est une application linéaire ; produit matriciel = composition ; coût d'un produit (m×k)(k×n) = m·k·n.
- p03-02 : le gradient est la direction de plus forte pente ; on descend en −η∇.
- Dérivée d'une fonction R → R comme pente locale.

## Hypothèses posées
- H1 : chaque bloc est **dérivable** (ou presque partout : ReLU).
- H2 : la loss est un **scalaire** — c'est ce qui rend le passage arrière bon marché.
- H3 : les activations intermédiaires sont **gardées en mémoire** pendant l'aller (sinon pas de retour).

## Exemple fil rouge
Un neurone logistique, une observation : x = 2, w = 0,5, b = 0, y = 1.
Aller : z = wx + b = 1 ; p = σ(z) = 0,731 ; L = −log p = 0,313.
Retour : ∂L/∂p = −1/p = −1,368 ; ∂p/∂z = p(1 − p) = 0,197 ; ∂L/∂z = −1,368 × 0,197 = −0,269 = p − 1 ✓ ; ∂L/∂w = (p − 1)·x = −0,538 ; ∂L/∂b = −0,269.
Coût : trois couches de largeur m = 1 000 sur une entrée n = 1 000, loss scalaire. Produits J₃·J₂·J₁ avec J₃ ∈ R^{1×m}, J₂ ∈ R^{m×m}, J₁ ∈ R^{m×n}. De la sortie : (J₃J₂) coûte m² = 10⁶, puis (·)J₁ coûte mn = 10⁶ : 2·10⁶. De l'entrée : (J₂J₁) coûte m²n = 10⁹, puis J₃(·) coûte mn : 10⁹. Facteur 500.

## Pas de la chaîne
1. **Le décor.** L = loss(f₃(f₂(f₁(x ; θ₁) ; θ₂) ; θ₃)). On veut ∂L/∂θ pour chaque θ. Il y a des millions de θ et une seule L.
2. **Une dérivée est une matrice** [tronc]. Pour f : Rⁿ → Rᵐ, la jacobienne J ∈ R^{m×n} est l'application linéaire qui approxime f localement : f(x + δ) ≈ f(x) + Jδ. Ligne i = gradient de la sortie i. Cas scalaire m = 1 : J est une ligne, c'est ∇ᵀ. Au tableau : « Localement une fonction est linéaire, donc sa dérivée est une matrice, donc composer des fonctions revient à multiplier leurs matrices locales. »
3. **Chain rule = produit de jacobiennes** [tronc]. J_{f∘g}(x) = J_f(g(x)) · J_g(x). L'ordre est celui de la composition lue de droite à gauche ; chaque jacobienne est évaluée au point que l'aller a produit — d'où H3. Au tableau : « La composée de deux applications linéaires est leur produit, donc la jacobienne d'une composée est le produit des jacobiennes, chacune prise au point courant, donc il faut avoir gardé les points de l'aller. »
4. **Sur le neurone : chaque facteur a un sens.** ∂L/∂p = −1/p (le log punit les petites probabilités), ∂p/∂z = p(1 − p) (la sigmoïde écrase aux extrêmes), le produit vaut p − y (les deux se compensent, p03-01). Puis ∂z/∂w = x : le gradient d'un poids est « signal d'erreur × entrée ». Au tableau : « Le gradient d'un poids est le gradient de sa sortie fois son entrée, donc une entrée nulle n'apprend rien, donc un signal d'erreur nul n'apprend rien. »
5. **L'ordre des produits décide du coût** [tronc]. Avec une loss scalaire, J₃ est une ligne. Multiplier à partir de la sortie garde toujours une **ligne** : (ligne × matrice) = ligne, coût m² ou mn. Multiplier à partir de l'entrée forme d'abord une **matrice** m×n pleine, coût m²n. C'est le **VJP** (vecteur-jacobienne) : on ne construit jamais une jacobienne intermédiaire, on transporte un vecteur. Au tableau : « La loss est scalaire, donc la dernière jacobienne est une ligne, donc en partant d'elle chaque produit reste une ligne et coûte une matrice, donc partir de la sortie coûte m² là où partir de l'entrée coûte m²n. »
6. **Backprop = VJP couche par couche.** On note gₖ = ∂L/∂hₖ (le gradient arrivant sur la sortie de la couche k). Règle : gₖ₋₁ = gₖ · Jₖ ; et ∂L/∂θₖ = gₖ · ∂hₖ/∂θₖ. Chaque couche ne connaît que sa jacobienne locale ; c'est ce que micrograd implémente : chaque nœud reçoit `grad` et le pousse à ses enfants multiplié par sa dérivée locale. Au tableau : « Chaque nœud reçoit le gradient de sa sortie, le multiplie par sa dérivée locale et l'accumule sur ses entrées, donc l'ordre est topologique inverse, donc on part de la loss. »
7. **Accumulation.** Un nœud utilisé deux fois reçoit deux contributions : elles s'**ajoutent** (`grad +=`, pas `=`). Oublier le `+=` est le bug classique de micrograd. Même règle en formule : la chain rule sur un graphe est une somme sur les chemins.
8. **Le forward mode existe** : JVP, une colonne à la fois, coût proportionnel au nombre d'**entrées**. Rentable quand les entrées sont peu nombreuses et les sorties nombreuses ; c'est l'inverse d'un réseau (millions de θ, une loss).
9. **Où ça casse** [casse].

## Figures exigées
- **Figure 1 — SVG custom via `plot` (graphe de calcul)** : nœuds x, w, b → z → p → L, avec un bouton « aller » qui remplit les valeurs (1 ; 0,731 ; 0,313) et un bouton « retour » qui remplit les `grad` un nœud à la fois depuis L (1 → −1,368 → −0,269 → −0,538 / −0,269), flèches inversées en rouge, chaque flèche étiquetée par la dérivée locale (−1/p, p(1−p), x, 1). Légende : le gradient voyage à l'envers ; chaque flèche multiplie.
- **Figure 2 — `plot` + `slider` m ∈ [10, 2 000] et n ∈ [10, 2 000]** : coût des deux ordres de produit (échelle log), courbes m² + mn et m²n + mn ; readout du rapport. Légende : la ligne reste une ligne ; la matrice explose.
- **Figure 3 — `plot` + `slider` z ∈ [−6, 6]** : les trois courbes ∂L/∂p (−1/p, en fonction de z via p), ∂p/∂z = p(1 − p), et leur produit p − 1 ; readouts. Légende : la compensation de p03-01 vue comme un produit de jacobiennes.

## Où ça casse
- **Gradients qui s'évanouissent** : un produit de nombreux facteurs < 1 (sigmoïdes saturées, p(1 − p) ≤ ¼) tend vers 0 ; la couche 1 n'apprend plus. C'est le pas 3 lu sur 20 couches. Remèdes nommés : ReLU, init soignée, batchnorm, résiduels (B2).
- **Gradients qui explosent** : facteurs > 1 répétés ; clipping.
- **Mémoire** : H3 impose de garder toutes les activations ; c'est ce qui limite la taille de batch, et ce que le gradient checkpointing échange contre du calcul.
- **Non dérivable** : max, argmax, échantillonnage ⇒ pas de gradient ; on remplace (softmax, Gumbel) ou on contourne (REINFORCE, nommer).

## Résumé
1. Une dérivée est une matrice (jacobienne) : l'application linéaire locale.
2. Chain rule = produit des jacobiennes, chacune au point que l'aller a produit ⇒ garder les activations.
3. Loss scalaire ⇒ la dernière jacobienne est une ligne ⇒ partir de la sortie garde une ligne : m² au lieu de m²n (VJP).
4. Backprop : chaque nœud multiplie le gradient reçu par sa dérivée locale et l'accumule (`+=`) sur ses entrées, en ordre topologique inverse.
5. Gradient d'un poids = signal d'erreur × entrée.
6. Casse : produits de facteurs < 1 (évanouissement), > 1 (explosion), mémoire des activations, opérations non dérivables.

**Phrase d'entretien** : « La dérivée d'une composition est le produit des jacobiennes ; comme la loss est un scalaire, la dernière est une ligne, et en multipliant depuis la sortie je transporte une ligne au lieu de construire des matrices — coût quadratique au lieu de cubique. C'est le vecteur-jacobienne, et la backprop n'est que ça, couche par couche, avec accumulation quand un nœud sert deux fois. »

## Chaîne verbalisée
1. Qu'est-ce qu'une jacobienne, en une phrase ? → L'application linéaire qui approxime f localement ; m×n.
2. Que dit la chain rule pour f∘g ? → J_f(g(x))·J_g(x) ; produit dans l'ordre de la composition.
3. Pourquoi partir de la sortie ? → Loss scalaire ⇒ ligne ⇒ m² + mn contre m²n.
4. Que fait un nœud en backprop ? → grad_entrée += grad_sortie × dérivée locale.
5. Sur le neurone logistique, que vaut ∂L/∂w et pourquoi ? → (p − y)·x : −1/p et p(1 − p) se compensent, puis × entrée.
6. D'où vient l'évanouissement du gradient ? → Produit de facteurs < 1 sur beaucoup de couches.

## Ce qui a cassé pour Salah
- Diagnostic : DL à N2 ; t04 a installé « depuis la sortie, coût m² + mn vs m²n » et « J = application linéaire locale ». Cette chaîne les relie au neurone de p03-01 (compensation) et à micrograd (pas 6–7), qu'il va coder en B1 : le pas 7 (`+=`) est le bug qu'il rencontrera.
- Scorie récurrente : chain rule élidée dans les dérivations — le pas 4 écrit chaque facteur avec son sens.
- Ne pas confondre avec p03-02 (descente) : ici on calcule le gradient, là on l'utilise.

## Exclusions
Pas d'autodiff par traçage/graphe dynamique au-delà de « micrograd le fait », pas de hessienne, pas de détails d'implémentation PyTorch (autograd.Function).
