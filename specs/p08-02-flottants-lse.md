---
id: p08-02
series: chain
part: "08"
number: "02"
slug: flottants-lse
title: Flottants et log-sum-exp — raisonner en float32
subtitle: numérique — ce qui arrive vraiment à un nombre dans une machine
prereq: [p08-03]
anki: [python::flottants, dl::numerique, dl::log-sum-exp]
bridges: []
next: p08-03
status: ready
---

## Question de la chaîne
Pourquoi 0,1 + 0,2 ≠ 0,3, pourquoi une somme de 10 millions de 0,1 vaut 1 087 937, pourquoi exp(1000) donne nan et non 0, et comment on calcule un softmax sans exploser ?

## Prérequis
Aucune sheet. Rappel : un flottant = signe × mantisse × 2^exposant, à nombre de bits fixé.

## Hypothèses posées
- H1 : float32 (24 bits de mantisse, ε = 1,19·10⁻⁷, max 3,4·10³⁸) sauf mention ; float64 (53 bits, ε = 2,2·10⁻¹⁶).
- H2 : chaque opération arrondit son résultat exact au flottant le plus proche : erreur relative ≤ ε **par opération**.

## Exemple fil rouge
- 0,1 n'est pas représentable en binaire (développement infini) ; 0,1 + 0,2 == 0,3 est faux en float64, vrai en float32 (deux arrondis qui tombent d'accord par hasard) : `==` sur des flottants n'est jamais un test.
- 10⁸ + 1 = 10⁸ en float32 : au-delà de 2²⁴ = 16 777 216, l'espacement entre flottants dépasse 1.
- Σ de 10⁷ fois 0,1 en float32, accumulée séquentiellement : **1 087 937** au lieu de 1 000 000 (+8,8 %). En sommation par paires (`np.sum`) : 1 000 000,1.
- exp(89) = inf en float32 (ln 3,4·10³⁸ = 88,7) ; exp(1000) = inf ; inf/inf = **nan**, inf − inf = nan. Un overflow ne donne pas 0 : il donne inf, puis nan à la première opération indéterminée.
- softmax(1000 ; 0) naïf : exp(1000)/(exp(1000) + 1) = inf/inf = nan. Avec le max soustrait : exp(0)/(exp(0) + exp(−1000)) = 1.
- log(softmax) naïf pour un logit très négatif : log(0) = −inf ; log_softmax = z − LSE(z) reste fini.

## Pas de la chaîne
1. **Le décor.** Les maths disent 0,1 + 0,2 = 0,3 et exp(1000) = 1,97·10⁴³⁴. La machine dit autre chose, et la loss d'un modèle passe par des millions de ces opérations.
2. **Un flottant est une grille non uniforme** [tronc]. 24 bits de mantisse : entre 1 et 2, 2²³ valeurs (pas 1,2·10⁻⁷) ; entre 2²⁴ et 2²⁵, pas de 2. L'erreur d'un arrondi est **relative** (≤ ε), pas absolue. Au tableau : « La mantisse a un nombre fixe de bits, donc la précision est relative à l'ordre de grandeur, donc autour de 10⁸ l'espacement dépasse 1, donc 10⁸ + 1 = 10⁸. »
3. **Jamais `==`.** Deux calculs mathématiquement égaux prennent des chemins d'arrondi différents. Tester |a − b| ≤ tol·max(|a|, |b|) (`np.isclose`, `torch.allclose`). L'argent se compte en centimes entiers.
4. **L'accumulation** [tronc]. Somme séquentielle de n termes : chaque addition arrondit relativement à la somme partielle courante ⇒ erreur totale ≲ n·ε·max|somme partielle|. n = 10⁷, ε = 1,2·10⁻⁷ : borne ~1,2 × la somme — et l'erreur réelle est 8,8 %. Ajouter 0,1 à 10⁶ en float32 (pas 0,06) perd déjà la moitié du terme. Remède : sommer par paires, ou accumuler en float64 (ce que fait `torch.sum` sur les réductions). Au tableau : « Chaque addition arrondit relativement à l'accumulateur, donc quand il est grand chaque petit terme est tronqué, donc l'erreur croît avec n fois l'accumulateur, donc on somme par paires ou en double précision. »
5. **Overflow → inf → nan, pas 0** [tronc]. Dépassement du max ⇒ inf ; inf est absorbant ; inf/inf, inf − inf, 0·inf ⇒ nan ; nan contamine tout. Un `loss = nan` à l'itération 300 est presque toujours un exp d'un logit ou d'un log(0). Au tableau : « Le flottant a un maximum, donc au-delà c'est inf, donc toute soustraction ou division d'infinis devient nan, donc la loss devient nan et non zéro. »
6. **Log-sum-exp** [tronc]. LSE(z) = log Σ exp(zᵢ) = m + log Σ exp(zᵢ − m) avec m = max zᵢ : identité exacte, et chaque exp(zᵢ − m) ∈ ]0, 1], sans overflow ; le terme du max vaut exactement 1, donc la somme ≥ 1 et le log est fini. softmax = exp(z − m)/Σ exp(z − m) ; log_softmax = z − LSE(z). Au tableau : « Soustraire le max ne change pas le softmax, donc tous les exposants sont ≤ 0, donc aucune exponentielle ne déborde, donc le log de la somme reste fini. »
7. **log_softmax ≠ log(softmax).** Le second passe par un 0 puis log(0) = −inf pour un logit très négatif ; le premier reste z − LSE. `F.cross_entropy` attend des **logits** et fait LSE dedans ; lui donner des probabilités softmaxées calcule un softmax de softmax.
8. **Où ça casse** [casse].

## Figures exigées
- **Figure 1 — `plot` + `slider` n ∈ [10³, 10⁷] (log)** : somme séquentielle de n × 0,1 en float32 simulée en JS (Math.fround à chaque addition) vs valeur exacte n/10 ; readout erreur relative. Légende : au-delà de ~10⁶ l'accumulateur ne voit plus le terme.
- **Figure 2 — `plot`** : espacement entre flottants float32 en fonction de la valeur (axe log-log), marques 1 (1,2·10⁻⁷), 10⁶ (0,06), 2²⁴ (1), 10⁸ (8). Légende : précision relative, pas absolue.
- **Figure 3 — `plot` + `slider` logit z₁ ∈ [0, 1 000]** (z₂ = 0) : softmax naïf (exp(z₁)/(exp(z₁) + 1) en float32 simulé → inf/inf → « nan » affiché en rouge dès z₁ > 88,7) et softmax stabilisé (toujours fini). Readouts. Légende : l'identité LSE ne change rien aux maths et tout au calcul.

## Où ça casse
- **float16/bfloat16** : ε = 10⁻³ / 8·10⁻³ et max 65 504 pour float16 ⇒ overflow bien plus tôt ; mixed precision garde les accumulations en float32.
- **Soustraction de proches** (annulation catastrophique) : E[X²] − E[X]² pour une variance perd tous les bits significatifs ; utiliser Welford ou centrer d'abord.
- **`torch.float64` par défaut sur CPU numpy vs float32 en torch** : un assert `==` entre les deux tombe.
- **Le max soustrait sur la mauvaise dimension** (broadcasting, p08-04) : LSE calculé par colonne au lieu de par ligne — silencieux.

## Résumé
1. Flottant = grille à précision relative ε ; erreur ≤ ε par opération.
2. Jamais `==` ; tolérance relative ; argent en entiers.
3. Somme séquentielle : erreur ~ n·ε·accumulateur ⇒ paires ou float64 (10⁷ × 0,1 = 1 087 937 en séquentiel).
4. Overflow ⇒ inf ⇒ nan, jamais 0 ; nan contamine.
5. LSE = m + log Σ exp(z − m) : exact, sans overflow ; log_softmax = z − LSE ; `cross_entropy` attend des logits.
6. Casse : float16, annulation, dtypes mélangés, mauvais axe.

**Phrase d'entretien** : « Un flottant a une précision relative, pas absolue : chaque opération arrondit à ε près de la valeur courante, donc une somme séquentielle de dix millions de termes dérive de plusieurs pourcents et dix puissance huit plus un vaut dix puissance huit. Un dépassement donne inf puis nan, jamais zéro ; c'est pourquoi le softmax se calcule en soustrayant le max, identité exacte qui borne toutes les exponentielles par un, et pourquoi la cross-entropy prend des logits. »

## Chaîne verbalisée
1. Pourquoi 10⁸ + 1 = 10⁸ en float32 ? → 24 bits de mantisse : au-delà de 2²⁴ l'espacement dépasse 1.
2. Que devient une somme séquentielle de 10⁷ × 0,1 ? → ~1 088 000 : erreur ~ n·ε·accumulateur ; sommer par paires.
3. exp(1000) en float32, puis exp(1000)/exp(1000) ? → inf, puis nan — pas 0.
4. Écris LSE stabilisé et dis pourquoi c'est exact. → m + log Σ exp(z − m) ; factoriser exp(m).
5. Pourquoi log_softmax ≠ log(softmax) ? → log(0) = −inf ; z − LSE reste fini ; cross_entropy attend des logits.

## Ce qui a cassé pour Salah
- 15/09 : a prédit **0** au lieu de nan pour un overflow — pas 5 et figure 3 sont écrits contre cette réponse précise.
- 16/09 : dtypes float64/float32 et « raisonner en maths et pas en float32 » — pas 2 à 4 ; la figure 1 simule réellement les arrondis float32 (Math.fround), pas une formule.
- Ne pas confondre avec p08-03 : ici la mécanique, là le sens de la cross-entropy.

## Exclusions
Pas de norme IEEE 754 au-delà de mantisse/exposant, pas de dénormalisés, pas de Kahan (nommer paires seulement).
