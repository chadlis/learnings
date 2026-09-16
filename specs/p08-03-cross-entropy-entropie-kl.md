---
id: p08-03
series: chain
part: "08"
number: "03"
slug: cross-entropy-entropie-kl
title: Cross-entropy, entropie, KL — trois noms pour un −log p
subtitle: ce que vaut la loss au départ, ce que mesure exp(loss), et pourquoi CE = H + KL
prereq: [p02-01, p08-02]
anki: [dl::cross-entropy, stats::entropie, stats::kl, dl::perplexite]
bridges: [b05]
next: p08-04
status: built
---

## Question de la chaîne
Pourquoi la loss d'un modèle de langage vaut log V au départ, que mesure exp(loss), et en quoi la cross-entropy, l'entropie et la KL sont la même quantité regardée de trois endroits ?

## Prérequis
- p02-01 : cross-entropy = NLL d'une catégorielle = −log p_y ; le geste des six pas.
- p08-02 : log-sum-exp ; `F.cross_entropy` attend des logits.
- p00-02 : espérance comme moyenne pondérée.

## Hypothèses posées
- H1 : une prédiction est une **distribution q** sur V classes (softmax des logits).
- H2 : la « vérité » est aussi une distribution p — un one-hot en classification, une distribution pleine quand on compare deux modèles.
- H3 : logarithmes naturels pour les losses (nats), base 2 pour lire en bits ; le facteur ln 2 = 0,693 les relie.

## Exemple fil rouge
- Trois classes, vérité chat, logits z = (2 ; 0 ; −1) : q = (0,844 ; 0,114 ; 0,042) ; CE = −log 0,844 = 0,170. Vérité oiseau : CE = −log 0,042 = 3,17. Gradient par rapport aux logits : q − onehot = (−0,156 ; 0,114 ; 0,042) pour chat.
- Modèle qui ne sait rien sur V = 27 caractères : q uniforme, CE = ln 27 = **3,30** pour tout exemple. C'est la loss initiale attendue de makemore ; plus haut, l'init est mauvaise.
- exp(loss) : loss 2,5 ⇒ e²·⁵ = 12,2 : « le modèle hésite entre 12 candidats équiprobables ». Uniforme sur 27 ⇒ 27.
- p = (0,5 ; 0,25 ; 0,25) : H(p) = 1,5 bits. q uniforme : CE(p, q) = log₂ 3 = 1,585 bits ; KL(p ‖ q) = 0,085 bits. q = (0,7 ; 0,2 ; 0,1) : CE = 1,668 bits, KL = 0,168 bits. Dans les deux cas CE = H + KL.

## Pas de la chaîne
1. **Le décor.** Un classifieur ou un modèle de langage sort des logits ; on veut une loss, un chiffre lisible, et un moyen de comparer deux distributions.
2. **Surprise = −log p** [tronc]. Un événement de probabilité p porte une surprise −log p : nulle si certain, infinie si impossible, additive pour des indépendants (log du produit = somme). C'est l'unité de toute la chaîne. Au tableau : « La surprise doit être nulle pour le certain, croître quand p baisse et s'additionner sur des indépendants, donc c'est −log p, à la base près. »
3. **Cross-entropy = surprise moyenne de q sous p** [tronc]. CE(p, q) = −Σ pᵢ log qᵢ : on tire selon la vérité p, on paie la surprise que **q** assigne. Classification (p one-hot) : CE = −log q_y, la NLL de p02-01. Au tableau : « La vérité choisit la classe, le modèle en avait donné une probabilité, donc on paie moins log de cette probabilité, donc en moyenne sur la vérité c'est −Σ p log q. »
4. **Entropie = cross-entropy de p avec elle-même.** H(p) = −Σ pᵢ log pᵢ : la surprise minimale possible, celle d'un modèle qui connaît p. Uniforme sur V : H = log V, le maximum. One-hot : H = 0.
5. **KL = le supplément** [tronc]. KL(p ‖ q) = Σ pᵢ log(pᵢ/qᵢ) = CE(p, q) − H(p) ≥ 0, nulle ssi q = p. Minimiser la CE en q revient à minimiser la KL : H(p) est une constante que le modèle ne contrôle pas. Asymétrique : KL(p ‖ q) punit q ≈ 0 là où p > 0 (couvrir), KL(q ‖ p) punit q > 0 là où p ≈ 0 (se concentrer). Au tableau : « La cross-entropy est l'entropie plus un supplément, donc ce supplément est la KL, donc il est positif et nul seulement si q égale p, donc entraîner à la cross-entropy c'est réduire la KL vers la vérité. »
6. **Loss initiale = log V.** Un modèle sans information doit être uniforme : CE = log V (ln 27 = 3,30). Si la loss initiale est bien plus haute, les logits de départ sont trop grands (init trop confiante, mauvaise) ; on les réduit. C'est le contrôle de sanité de makemore.
7. **exp(loss) = nombre de candidats effectifs (perplexité).** Loss L nats ⇒ le modèle hésite comme entre e^L options équiprobables. 3,30 → 27 ; 2,5 → 12 ; 1 → 2,7. Lisible et comparable entre vocabulaires.
8. **Gradient et implémentation.** ∂CE/∂zᵢ = qᵢ − pᵢ : le softmax et le log se compensent (p03-01, p08-01). `F.cross_entropy(logits, targets)` = log_softmax + NLL en une opération stable (LSE, p08-02) ; lui passer des probabilités est un bug silencieux (double softmax, loss plate). Les labels sont des **indices**, pas des one-hot.
9. **Où ça casse** [casse].

## Figures exigées
- **Figure 1 — `plot` + `slider` q_y ∈ ]0, 1]** : −log q_y et (1 − q_y)² côte à côte ; readouts. Légende : la surprise n'est pas bornée ; une erreur confiante coûte sans limite.
- **Figure 2 — SVG custom via `plot` (deux histogrammes)** : p fixe (0,5 ; 0,25 ; 0,25), q réglable par deux `slider` (la troisième coordonnée se déduit) ; readouts H(p), CE(p, q), KL(p ‖ q), KL(q ‖ p) en bits ; bouton « q = p » qui met la KL à 0. Légende : CE = H + KL ; les deux KL diffèrent.
- **Figure 3 — `plot` + `slider` V ∈ [2, 50 000]** : loss initiale log V (échelle log en x) avec marques 27 (caractères), 50 257 (GPT-2) ; readout exp(loss) = V. Légende : le sanity check de l'init.
- **Figure 4 — `plot` + `slider` échelle des logits s ∈ [0, 5]** : logits (2 ; 0 ; −1) × s → softmax et CE pour vérité chat et pour vérité oiseau ; readouts. Légende : monter l'échelle rend confiant ; juste ou faux, la CE s'écarte de log V dans les deux sens.

## Où ça casse
- **Labels bruités** : la CE punit sans borne une vérité fausse ⇒ le modèle apprend le bruit ; label smoothing (p mélangé avec l'uniforme) borne la surprise.
- **Calibration** : minimiser la CE pousse vers des probabilités calibrées **sur la distribution d'entraînement** ; hors distribution, la confiance ne vaut rien (p06-04).
- **Comparer des perplexités** entre vocabulaires ou tokenizers différents n'a pas de sens : la perplexité par token dépend du découpage.
- **KL(p ‖ q) demande p > 0 ⇒ q > 0** : un q à zéro là où p ne l'est pas donne une KL infinie ; c'est ce qui rend le lissage nécessaire (p02-03).

## Résumé
1. Surprise = −log p : nulle si certain, additive, non bornée.
2. CE(p, q) = −Σ p log q : surprise de q payée sous p ; one-hot ⇒ −log q_y = NLL.
3. H(p) = CE(p, p) : le plancher ; uniforme ⇒ log V.
4. KL(p ‖ q) = CE − H ≥ 0 ; minimiser la CE = minimiser la KL ; asymétrique.
5. Loss initiale = log V (ln 27 = 3,30) ; exp(loss) = candidats effectifs.
6. ∂CE/∂z = q − p ; `F.cross_entropy` prend des logits et des indices.

**Phrase d'entretien** : « La cross-entropy est la surprise moyenne que le modèle assigne à la vérité, moins log de la probabilité de la bonne classe ; elle vaut l'entropie de la vérité plus la KL entre vérité et modèle, donc l'entraîner réduit cette KL. Un modèle uniforme paie log V — 3,3 nats pour 27 caractères, mon sanity check d'init — et exp de la loss se lit comme le nombre de candidats entre lesquels il hésite. Le gradient sur les logits est q moins p, et la fonction PyTorch attend des logits parce qu'elle fait le log-sum-exp elle-même. »

## Chaîne verbalisée
1. Définis la surprise et justifie −log. → Nulle si certain, croît quand p baisse, additive ⇒ −log p.
2. Écris CE(p, q) et le cas one-hot. → −Σ p log q ; −log q_y.
3. Relie CE, H et KL. → CE = H + KL ; KL ≥ 0, nulle ssi q = p ; H constante ⇒ minimiser CE = minimiser KL.
4. Que vaut la loss initiale sur 27 caractères, et que dit une loss plus haute ? → ln 27 = 3,30 ; init trop confiante.
5. Que mesure exp(loss) ? → Le nombre de candidats équiprobables entre lesquels le modèle hésite.
6. Pourquoi passer des logits à `F.cross_entropy` ? → log_softmax stable par LSE ; des probabilités feraient un double softmax.

## Ce qui a cassé pour Salah
- 16/09 : trou de mémoire sur cross-entropy ↔ MLE ; la chaîne repart de la surprise (pas 2) et retrouve la NLL de p02-01 au pas 3, sans redémontrer les six pas.
- Q4.3 (cross-entropy) : « le geste pour dériver la CE catégorielle » — pas 3 et pas 8 ; l'exemple chat/chien/oiseau est le sien (séance du 16/09).
- Anticipe B2 (makemore) : loss initiale log V et exp(loss) sont les deux contrôles que Karpathy fait à l'écran ; ici ils sont nommés d'avance pour que la vidéo confirme au lieu d'introduire.
- t07 avait la surprise ; t08 « F.cross_entropy attend des logits ». Réunis ici.

## Exclusions
Pas d'information mutuelle, pas de théorie du codage (Kraft, Huffman) au-delà d'une phrase, pas de label smoothing détaillé, pas de température au-delà de la figure 4.

## Questions pour la revue
- **Chiffres du fil rouge : tous vérifiés par script, aucun faux.** q = (0,8438 ; 0,1142 ; 0,0420) ;
  CE chat 0,1698 ; CE oiseau 3,1698 ; gradient chat (−0,1562 ; 0,1142 ; 0,0420) ; ln 27 = 3,2958 ;
  e^2,5 = 12,182 ; H(p) = 1,5 bit ; log₂ 3 = 1,58496 ; KL(p‖q_unif) = 0,08496 ; CE(p ; 0,7/0,2/0,1)
  = 1,66825 et KL = 0,16825 ; CE = H + KL exact dans les deux cas. Rien n'a été corrigé.
- **Figure 3, borne du curseur.** Le spec dit `V ∈ [2, 50 000]` mais demande une marque à 50 257.
  Le curseur va donc jusqu'à 50 257, pour que le repère GPT-2 soit atteignable. À confirmer.
- **Figure 4, ce qui est tracé.** Le spec demande « softmax et CE » dans la figure. La CE quand la
  vérité est oiseau atteint 15 nats à s = 5 et écraserait tout le reste sur le même axe : la figure
  trace les trois coordonnées du softmax et met les trois CE (chat, oiseau, moyenne sous vérité
  uniforme) dans les readouts. À confirmer.
- **Deux chiffres ajoutés, non demandés par le spec, vérifiés par script.** Double softmax de
  (2 ; 0 ; −1) : q' = (0,518 ; 0,250 ; 0,232), loss chat 0,658 au lieu de 0,170 (pas 8) ; label
  smoothing ε = 0,1 sur V = 3 : p = (0,933 ; 0,033 ; 0,033), surprise maximale 3,40 nats, plancher
  H(p) = 0,291 nat (pas 9).
