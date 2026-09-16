---
id: p08-02
series: chain
part: "08"
number: "02"
slug: flottants-lse
title: Flottants et log-sum-exp — raisonner en float32, pas en mathématiques
subtitle: ce qui arrive vraiment quand on additionne, compare, exponentie
prereq: []
anki: [python::flottants, dl::log-sum-exp, dl::softmax-stabilite, python::dtypes]
bridges: []
next: p08-03
status: ready
---

## Question de la chaîne
Pourquoi 0,1 + 0,2 ≠ 0,3, pourquoi exp(1 000) donne nan et pas 0, et pourquoi tout code de softmax soustrait le max ?

## Prérequis
Aucune sheet. Notation scientifique : x = ±m × 2ᵉ.

## Hypothèses posées
- H1 : un flottant a une **mantisse finie** : 24 bits (float32, ≈ 7 chiffres décimaux) ou 53 bits (float64, ≈ 16). L'erreur est **relative** : ε₃₂ = 2⁻²³ ≈ 1,2·10⁻⁷, ε₆₄ = 2⁻⁵² ≈ 2,2·10⁻¹⁶.
- H2 : les valeurs spéciales existent et se propagent : inf, −inf, nan ; nan ≠ nan.
- H3 : PyTorch calcule en **float32 par défaut** ; NumPy et Python en float64. Un même code ne donne pas le même résultat dans les deux.

## Exemple fil rouge
- 0,1 + 0,2 = 0,30000000000000004 en float64 : 0,1 n'est pas représentable en base 2 (développement infini), comme 1/3 en base 10.
- Accumuler 0,1 un million de fois en float32 séquentiellement : **100 958,34** au lieu de 100 000 (+1 %) ; la somme par paires de NumPy donne 100 000,0. Le budget d'erreur d'une somme séquentielle est ≈ n·ε·max|somme partielle|.
- exp(88,7) = 3,3·10³⁸ (limite float32) ; exp(89) = **inf** ; inf/inf = **nan**. Softmax naïf de (1 000 ; 0) : (nan ; 0). Avec le max soustrait : exp(0)/(exp(0) + exp(−1 000)) = 1 exactement.
- Log-sum-exp de (1 000 ; 0) : 1 000 + log(1 + e⁻¹⁰⁰⁰) = 1 000.
- Comparaison : `0.1 + 0.2 == 0.3` est False ; `abs(a − b) < 1e-9·max(1, |a|, |b|)` est le test.
- Argent : 19,99 × 3 en flottant ≠ 59,97 exactement ; on compte en centimes entiers.

## Pas de la chaîne
1. **Le décor.** Les nombres d'un programme ne sont pas des réels : ce sont des fractions binaires à mantisse finie. Tout ce qui suit découle de « mantisse finie ».
2. **L'erreur est relative, pas absolue** [tronc]. Un flottant représente x à ε près **en proportion** : les grands nombres ont des trous plus larges (float32 ne distingue pas 16 777 216 et 16 777 217). Au tableau : « La mantisse a un nombre fixe de bits, donc l'écart entre deux flottants consécutifs est proportionnel à leur taille, donc l'erreur est relative, donc les grands nombres sont mesurés à la louche. »
3. **Additionner un petit à un grand perd le petit.** 10⁸ + 1 = 10⁸ en float32. C'est pourquoi une somme séquentielle de petits termes dérive : chaque ajout est arrondi à l'échelle de l'accumulateur. Remèdes : sommer par paires, sommer en float64, Kahan (nommer). Au tableau : « L'accumulateur grandit, donc sa résolution baisse, donc chaque terme ajouté est de plus en plus arrondi, donc l'erreur totale croît en n·ε·max. »
4. **Jamais `==` sur des flottants.** Deux calculs mathématiquement égaux passent par des arrondis différents. Comparer à une tolérance relative ; pour l'argent, des entiers (centimes) ou Decimal.
5. **Débordement : inf, puis nan** [tronc]. Au-delà de 3,4·10³⁸ (float32) un nombre devient inf, pas 0 et pas une erreur. Les opérations sur inf produisent inf ou nan (inf − inf, inf/inf, 0·inf). Un nan **contamine** tout ce qu'il touche et une loss nan à l'itération 340 vient d'un inf à l'itération 339. Au tableau : « Dépasser le maximum donne inf, donc une division d'inf par inf donne nan, donc un nan en sortie est la trace d'un inf en amont, et on remonte le calcul pour le trouver. »
6. **Log-sum-exp : soustraire le max** [tronc]. log Σ exp(zᵢ) = m + log Σ exp(zᵢ − m) avec m = max zᵢ : identité exacte, et tous les exposants sont ≤ 0 donc aucune exp ne déborde ; le plus grand terme vaut exactement 1. Softmax stable : exp(zᵢ − m)/Σ exp(zⱼ − m). Au tableau : « Multiplier numérateur et dénominateur par e⁻ᵐ ne change pas le quotient, donc on peut décaler tous les logits par leur max, donc plus aucune exp ne dépasse 1, donc plus de inf. »
7. **Composer log et softmax est un piège.** log(softmax(z)) calcule une probabilité minuscule puis son log : underflow à 0, log(0) = −inf. `log_softmax(z)` = z − LSE(z) directement : exact et stable. C'est pourquoi `F.cross_entropy` prend des **logits** et fait le LSE lui-même (p08-03).
8. **dtypes : float32 en PyTorch, float64 ailleurs.** Un tenseur créé depuis une liste Python est float32 ; depuis NumPy, float64 ; les mélanger promeut ou lève une erreur. bfloat16 : 8 bits de mantisse (≈ 3 chiffres), même exposant que float32 : on y entraîne des réseaux parce que le gradient tolère le bruit, pas parce que c'est précis.
9. **Où ça casse** [casse].

## Figures exigées
- **Figure 1 — `plot` + bouton « accumuler »** : somme séquentielle de 0,1 en float32 simulée en JS avec `Math.fround` à chaque étape, tracée contre la somme exacte n·0,1 sur n ∈ [0, 10⁶] (échelle log en x) ; readout de l'erreur relative. Légende : la dérive commence quand l'accumulateur dépasse ~10⁵.
- **Figure 2 — `plot` + `slider` z ∈ [0, 120]** : exp(z) en float32 (`Math.fround`) et le seuil 88,72 ; readout exp(z) → inf au-delà ; second readout softmax naïf de (z ; 0) vs stable. Légende : inf puis nan ; le max soustrait ramène tout ≤ 1.
- **Figure 3 — `plot`** : espacement entre flottants consécutifs (ulp) en float32 en fonction de x sur [1, 10⁸], échelle log-log ; marque 16 777 216 où ulp = 2. Légende : l'erreur est relative.

## Où ça casse
- **float64 ne « règle » pas le problème**, il le repousse de 9 ordres de grandeur ; une somme de 10⁹ termes en float64 dérive aussi.
- **bfloat16 en inférence** : des logits proches se confondent (résolution 10⁻²) ; les métriques de classement (top-k) peuvent changer d'un dtype à l'autre.
- **Tolérance fixe** (`abs(a − b) < 1e-6`) : trop lâche pour des petits nombres, trop stricte pour des grands ; il faut une tolérance relative.
- **Un `nan` silencieux** : PyTorch ne lève pas d'erreur ; `torch.isfinite(loss)` à chaque pas coûte rien et sauve des heures.

## Résumé
1. Mantisse finie ⇒ erreur **relative** (ε₃₂ ≈ 10⁻⁷, ε₆₄ ≈ 10⁻¹⁶) ⇒ les grands nombres sont grossiers.
2. Somme séquentielle : erreur ≈ n·ε·max ; sommer par paires ou en float64.
3. Jamais `==` ; tolérance relative ; argent en entiers.
4. Dépasser le max donne inf, pas 0 ; inf/inf = nan ; un nan en aval vient d'un inf en amont.
5. LSE : soustraire le max — identité exacte, plus de débordement ; `log_softmax` = z − LSE(z), jamais log(softmax).
6. PyTorch float32 par défaut ; bfloat16 pour l'entraînement parce que le gradient tolère le bruit.

**Phrase d'entretien** : « Un flottant a une mantisse finie, donc son erreur est relative et les grands nombres sont mesurés grossièrement ; une somme séquentielle dérive en n fois epsilon fois l'échelle. Dépasser le maximum donne inf, pas zéro, et inf sur inf donne nan : un nan est la trace d'un inf en amont. Le log-sum-exp soustrait le max, identité exacte qui ramène toutes les exponentielles sous 1 — c'est pourquoi la cross-entropy prend des logits. »

## Chaîne verbalisée
1. Pourquoi 0,1 + 0,2 ≠ 0,3 ? → 0,1 a un développement binaire infini ; mantisse finie ; arrondi.
2. Pourquoi la somme séquentielle de 0,1 dérive-t-elle, et de combien ? → Arrondi à l'échelle de l'accumulateur ; ≈ n·ε·max ; +1 % à 10⁶ en float32.
3. Que donne exp(1 000) en float32, puis exp(1 000)/exp(1 000) ? → inf ; nan.
4. Pourquoi soustraire le max dans un softmax ? → Identité exacte ; toutes les exp ≤ 1 ; plus de inf.
5. Pourquoi `F.cross_entropy` veut des logits ? → Elle fait log_softmax = z − LSE(z) ; log(softmax) underflow à −inf.

## Ce qui a cassé pour Salah
- 15/09 : a prédit **0** au lieu de **nan** pour un overflow — le pas 5 est écrit contre ça, avec la chaîne inf → nan explicite et la figure 2.
- 16/09 (remédiation torch) : dtypes float32/float64 confondus ; « raisonner en maths et pas en float32 » — pas 8 et H3.
- Le lien avec p02-01 / p08-03 : la cross-entropy attend des logits, pas des probabilités (pas 7).

## Exclusions
Pas d'IEEE 754 au-delà de mantisse/exposant, pas de dénormalisés, pas de Kahan détaillé, pas de mixed precision (loss scaling) au-delà d'une mention.
