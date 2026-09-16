---
id: p08-03
series: chain
part: "08"
number: "03"
slug: cross-entropy-entropie-kl
title: Cross-entropy, entropie, KL
subtitle: de −log p_y à la perplexité : ce que mesure la loss d'un modèle de langue
prereq: [p02-01, p08-02]
anki: [dl::cross-entropy, dl::entropie, dl::kl, dl::perplexite]
bridges: [b05]
next: p08-04
status: stub
---

## Question de la chaîne
Que mesure exactement la cross-entropy, pourquoi vaut-elle ln V au départ d'un modèle de langue, et que dit exp(loss) ?

## Prérequis
- p02-01 : la cross-entropy est la NLL d'une loi catégorielle paramétrée par softmax : −log p_y.
- p08-02 : log_softmax, LSE.

## Hypothèses posées
- H1 : p = vraie loi (souvent one-hot sur la classe observée), q = loi prédite (softmax des logits).
- H2 : logs en nats (ln) sauf mention ; en bits si log₂.

## Exemple fil rouge
Trois classes chat/chien/oiseau, logits (2 ; 0 ; −1) → q = (0,844 ; 0,114 ; 0,042). Vraie classe chat : CE = −ln 0,844 = 0,170. Vraie classe oiseau : CE = −ln 0,042 = 3,17.
Modèle de langue à V = 27 symboles, initialisé uniforme : CE = ln 27 = 3,30 ; exp(3,30) = 27 candidats équiprobables. Un modèle à loss 2,5 : exp(2,5) = 12,2 « candidats effectifs » par position.
p = (½ ; ½), q = (0,9 ; 0,1) : H(p) = ln 2 = 0,693 ; KL(p‖q) = ½ ln(0,5/0,9) + ½ ln(0,5/0,1) = 0,511 ; KL(q‖p) = 0,368 : asymétrique. CE(p, q) = 0,693 + 0,511 = 1,204.

## Pas de la chaîne
1. **Le décor.** Une loss qui vaut 3,30 au départ, 2,5 après entraînement : que veulent dire ces nombres ?
2. **Surprise** [tronc]. Observer un événement de probabilité q coûte −ln q : rare ⇒ grande surprise, certain ⇒ 0. C'est la NLL d'une observation (p02-01). Au tableau : « La vraisemblance d'une observation est q, donc sa NLL est −ln q, donc la surprise est le coût d'avoir donné probabilité q à ce qui est arrivé. »
3. **Entropie = surprise moyenne sous la vraie loi.** H(p) = −Σ pᵢ ln pᵢ : l'incertitude irréductible de p. Uniforme sur V : ln V (maximale). One-hot : 0.
4. **Cross-entropy = surprise moyenne quand on croit q et que p arrive** [tronc]. CE(p, q) = −Σ pᵢ ln qᵢ. Pour p one-hot : −ln q_y, la loss de classification. Au tableau : « On paie la surprise −ln q_i à la fréquence p_i, donc la loss est la moyenne sous p de la surprise sous q, donc pour une classe observée c'est −ln de la probabilité qu'on lui avait donnée. »
5. **CE = H + KL** [tronc]. CE(p, q) = H(p) + KL(p‖q), KL(p‖q) = Σ pᵢ ln(pᵢ/qᵢ) ≥ 0, nulle ssi q = p. H(p) ne dépend pas du modèle : minimiser la CE, c'est minimiser la KL, et le plancher est H(p) — le bruit des étiquettes. Au tableau : « La cross-entropy se sépare en l'entropie de la vraie loi plus l'écart KL, donc le modèle ne peut agir que sur la KL, donc la loss ne descend jamais sous l'entropie des données. »
6. **ln V au départ, et exp(loss)** [tronc]. Modèle uniforme : q = 1/V ⇒ CE = ln V (3,30 pour 27). exp(CE) = perplexité = nombre de candidats équiprobables auxquels le modèle hésite : 27 au départ, 12 à loss 2,5. C'est la lecture à donner d'une loss de LM. Au tableau : « À l'initialisation le modèle est uniforme, donc chaque surprise vaut ln V, donc la loss vaut ln V, donc son exponentielle compte les candidats entre lesquels il hésite. »
7. **KL est asymétrique.** KL(p‖q) punit q ≈ 0 là où p > 0 (couvrir) ; KL(q‖p) punit q > 0 là où p ≈ 0 (chercher un mode). Même paire, 0,511 contre 0,368. Le sens choisi est un choix de modélisation (VI, distillation, DPO en Phase 3).
8. **En pratique** : `F.cross_entropy(logits, y)` = log_softmax + NLL, en LSE stabilisée (p08-02) ; lui donner des probabilités est une erreur silencieuse. Label smoothing : p = (1 − ε) one-hot + ε/V ⇒ plancher H(p) > 0, logits bornés.
9. **Où ça casse** [casse].

## Figures exigées
- **Figure 1 — `plot` + `slider` q_y ∈ ]0, 1]** : −ln q ; readout ; marques 0,844 → 0,170 et 0,042 → 3,17. Légende : non bornée près de 0 (p03-01).
- **Figure 2 — `plot` + `slider` p₁ ∈ ]0, 1[ et q₁ ∈ ]0, 1[** (deux classes) : barres H(p), KL(p‖q), CE empilées ; readouts. Légende : CE = H + KL ; H ne bouge qu'avec p.
- **Figure 3 — `plot` + `slider` loss ∈ [0, 4]** : perplexité exp(loss), marque ln 27 ↦ 27 et 2,5 ↦ 12,2. Légende : lire une loss de LM en nombre de candidats.
- **Figure 4 — `plot`** : KL(p‖q) et KL(q‖p) en fonction de q₁ pour p = (½, ½) : deux courbes différentes, même zéro en ½. Légende : l'asymétrie.

## Où ça casse
- **Plancher confondu avec un bug** : la loss stagne à H(p) quand les étiquettes sont bruitées ; ce n'est pas un défaut d'optimisation.
- **Probabilités données à `cross_entropy`** : softmax de softmax, gradients écrasés, apprentissage lent et silencieux.
- **q_y = 0 exactement** : −ln 0 = inf ; LSE et label smoothing l'évitent.
- **Perplexité comparée entre tokenizers différents** : ln V dépend du vocabulaire ; comparer des loss par token de vocabulaires différents n'a pas de sens (Phase 2, tokenizer).

## Résumé
1. Surprise −ln q ; entropie = surprise moyenne sous p ; cross-entropy = surprise sous q, moyennée sous p.
2. Classification : CE = −ln q_y, la NLL catégorielle.
3. CE = H(p) + KL(p‖q) : le modèle n'agit que sur la KL ; plancher = H(p).
4. LM uniforme : loss = ln V ; exp(loss) = candidats effectifs (perplexité).
5. KL asymétrique : couvrir vs chercher un mode.
6. `cross_entropy` prend des logits ; label smoothing borne les logits.

**Phrase d'entretien** : « La cross-entropy est la surprise moyenne qu'on paie en croyant q quand p arrive ; pour une classe observée c'est moins log de la probabilité prédite. Elle vaut l'entropie des données plus la KL du modèle à la vraie loi, donc elle a un plancher que l'optimisation ne peut pas franchir. Sur un modèle de langue elle démarre à log V et son exponentielle compte les candidats entre lesquels le modèle hésite. »

## Chaîne verbalisée
1. Que vaut la CE pour la classe oiseau avec q = 0,042 ? → −ln 0,042 = 3,17.
2. Décompose CE(p, q). → H(p) + KL(p‖q) ; seul KL dépend du modèle.
3. Pourquoi ln 27 au départ ? → Uniforme ⇒ chaque surprise = ln V.
4. Que dit exp(2,5) = 12,2 ? → Le modèle hésite entre ~12 candidats équiprobables.
5. KL(p‖q) = KL(q‖p) ? → Non : 0,511 vs 0,368 ; couvrir vs chercher un mode.

## Ce qui a cassé pour Salah
- 16/09 : trou de mémoire cross-entropy ↔ MLE — le pas 2 répète le lien en une ligne et renvoie à p02-01 ; ne pas redériver.
- Exemple chat/chien/oiseau : le sien, gardé à l'identique.
- ln 27 et exp(loss) sont les deux chiffres que Karpathy fait sentir en B1–B2 (makemore) : les nommer ici pour qu'il les reconnaisse.

## Exclusions
Pas de codage/compression (Shannon), pas d'information mutuelle, pas de DPO au-delà de la mention, pas de dérivation du gradient p − y (D4, p03-01).
