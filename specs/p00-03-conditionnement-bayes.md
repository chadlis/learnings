---
id: p00-03
series: chain
part: "00"
number: "03"
slug: conditionnement-bayes
title: Conditionnement et Bayes — le base rate en effectifs
subtitle: socle — inverser un conditionnement sans se tromper de sens
prereq: [p00-02]
anki: [stats::bayes, stats::conditionnement, stats::base-rate, ml::metriques]
bridges: []
next: p00-04
status: ready
---

## Question de la chaîne
Un test détecte 90 % des cas et se trompe sur 5 % des sains. Il est positif : quelle est la probabilité d'être un cas ? Et pourquoi la réponse dépend d'un nombre que le test ne connaît pas ?

## Prérequis
- p00-02 : probabilité d'un événement, indépendance.

## Hypothèses posées
- H1 : sensibilité et spécificité sont des propriétés du **test**, stables d'une population à l'autre.
- H2 : la prévalence est une propriété de la **population** testée, et elle change selon qui on teste.
- H3 : un seul test, appliqué une fois (les répétitions du même test ne sont pas indépendantes).

## Exemple fil rouge
Prévalence 1 %, sensibilité P(+ | M) = 0,90, spécificité P(− | ¬M) = 0,95. Sur 100 000 personnes : 1 000 cas → 900 positifs (TP), 100 négatifs (FN) ; 99 000 sains → 4 950 positifs (FP), 94 050 négatifs (TN). Positifs au total : 5 850. P(M | +) = 900/5 850 = **0,154**.
Même test, prévalence 10 % : 9 000 TP, 4 500 FP ⇒ P(M | +) = 9 000/13 500 = 0,667.
En cotes : LR+ = 0,90/0,05 = 18 ; cote a priori 1:99 ; cote a posteriori 18:99 ⇒ 18/117 = 0,154.

## Pas de la chaîne
1. **Le décor.** Deux phrases qui se ressemblent : « 90 % des cas sont positifs » et « 90 % des positifs sont des cas ». La première est le test, la seconde est la question. Elles ne sont pas égales.
2. **Conditionner = restreindre l'univers** [tronc]. P(A | B) = P(A ∩ B)/P(B) : on ne regarde que le monde où B est arrivé, et on renormalise. Au tableau : « Sachant B, les seuls cas possibles sont ceux de B, donc la probabilité de A est la part de A dans B, donc P(A ∩ B) sur P(B). »
3. **Indépendance ⇔ le conditionnement ne change rien.** P(A | B) = P(A) ⇔ P(A ∩ B) = P(A)P(B). C'est l'hypothèse qui autorise le **produit** des probabilités (Binomiale, vraisemblance du fil B).
4. **Probabilités totales.** P(+) = P(+ | M)P(M) + P(+ | ¬M)P(¬M) = 0,9·0,01 + 0,05·0,99 = 0,009 + 0,0495 = 0,0585. Les positifs viennent de deux sources, et la seconde est la plus grosse. Au tableau : « Un positif est soit un cas détecté, soit un sain mal classé, donc P(+) additionne les deux voies pondérées par leur poids dans la population. »
5. **Bayes = inverser le conditionnement** [tronc]. P(M | +) = P(+ | M)P(M)/P(+) = 0,009/0,0585 = 0,154. Lecture : posterior ∝ vraisemblance × prior ; le dénominateur normalise. Au tableau : « P(M ∩ +) s'écrit dans les deux sens, donc P(M | +)P(+) = P(+ | M)P(M), donc on isole P(M | +) : la vraisemblance fois le prior, sur la probabilité totale du positif. »
6. **En effectifs, ça se voit** [tronc]. 100 000 personnes → 900 vrais positifs contre 4 950 faux : les 99 000 sains, même à 5 % d'erreur, produisent plus de positifs que les 1 000 cas à 90 % de détection. Le **base rate** décide. Au tableau : « Les sains sont 99 fois plus nombreux, donc même une petite erreur sur eux dépasse une grosse détection sur les cas, donc la majorité des positifs sont des faux, donc la prévalence commande la valeur du test. »
7. **Le même calcul en cotes.** Cote a posteriori = cote a priori × LR, avec LR+ = sensibilité/(1 − spécificité) = 18. 1:99 × 18 = 18:99. Un test se résume à son LR ; la population apporte la cote a priori. Séparer les deux est ce qui évite l'erreur.
8. **Traduction en métriques** (p06-03). Sensibilité = rappel = TPR ; spécificité = TNR ; 1 − spécificité = FPR ; P(M | +) = **précision** = VPP. La précision dépend de la prévalence ; le rappel et le FPR non. C'est pourquoi une précision ne se transporte pas d'une population à une autre.
9. **Où ça casse** [casse].

## Figures exigées
- **Figure 1 — SVG custom via `plot` (arbre d'effectifs)** : 100 000 → cas / sains → TP, FN, FP, TN en rectangles proportionnels (largeur = effectif, échelle log ou racine pour que TP reste visible), `slider` prévalence ∈ [0,1 % ; 50 %], sensibilité, spécificité ; readouts TP, FP, VPP. Légende : regarde le rapport TP/FP, pas les pourcentages.
- **Figure 2 — `plot` + `slider` spécificité ∈ [0,80 ; 0,999]** : VPP en fonction de la prévalence (axe x en log de 0,1 % à 50 %), à sensibilité 0,9 ; marques à 1 % et 10 %. Légende : à prévalence faible, seule la spécificité compte ; à 99,9 % la courbe décolle.
- **Figure 3 — `plot`** : échelle des cotes : cote a priori (point), × LR (flèche), cote a posteriori (point), avec conversion en probabilité en readout ; `slider` LR ∈ [1, 100]. Légende : le test est un multiplicateur, la population fixe le point de départ.

## Où ça casse
- **Prévalence importée** : un test étalonné sur des patients symptomatiques (prévalence 30 %) déployé en dépistage (1 %) voit sa VPP s'effondrer sans que sensibilité ni spécificité aient bougé. Même piège pour un modèle de fraude : précision en validation ≠ précision en production si la prévalence change.
- **Répéter le même test** n'est pas un second test indépendant : les erreurs sont corrélées (même mécanisme), le LR ne se multiplie pas.
- **Confondre les deux sens** : P(preuve | innocent) petit ≠ P(innocent | preuve) petit (sophisme du procureur). Même erreur que « p-value = P(H₀) » (p01-02).
- **Conditionner sur le mauvais événement** : P(M | +) demande de restreindre aux positifs, pas aux cas.

## Résumé
1. P(A | B) = P(A ∩ B)/P(B) : restreindre puis renormaliser.
2. Indépendance ⇔ conditionner ne change rien ⇔ produit.
3. P(+) additionne les deux voies : cas détectés + sains mal classés.
4. Bayes : P(M | +) = P(+ | M)P(M)/P(+) — posterior ∝ vraisemblance × prior.
5. En effectifs : 900 TP contre 4 950 FP à 1 % de prévalence ⇒ VPP 15 % ; le base rate décide.
6. Cotes : a posteriori = a priori × LR ; sensibilité = rappel, spécificité = 1 − FPR, VPP = précision (dépend de la prévalence).

**Phrase d'entretien** : « Sensibilité et spécificité appartiennent au test ; la probabilité d'être un cas sachant un positif appartient à la population, par Bayes. À 1 % de prévalence, les 99 % de sains produisent plus de faux positifs à 5 % d'erreur que les cas de vrais positifs à 90 % de détection : la précision tombe à 15 %. C'est pourquoi une précision ne se transporte pas d'une population à une autre, alors qu'un rappel et un FPR le font. »

## Chaîne verbalisée
1. Que signifie P(A | B), en un geste ? → Restreindre l'univers à B, renormaliser.
2. D'où vient P(+) = 0,0585 ? → Deux voies : 0,9·0,01 + 0,05·0,99.
3. Que vaut P(M | +) et pourquoi si bas ? → 0,154 : 4 950 faux positifs contre 900 vrais ; base rate.
4. Refais-le en cotes. → 1:99 × 18 = 18:99 ⇒ 0,154.
5. Quelle métrique dépend de la prévalence, laquelle non ? → Précision oui ; rappel et FPR non.

## Ce qui a cassé pour Salah
- Q5 (métriques en déséquilibre, 10/09 puis 16/09) : le mécanisme « pas de TN dans la précision » est exactement le pas 8 ; le relier ici pour qu'il ait deux points d'ancrage.
- p-value ≠ P(H₀) (p01-02) et sophisme du procureur : même erreur de sens ; nommer le lien dans la casse.
- L'indépendance comme licence du produit (fil B) : pas 3, une ligne.

## Exclusions
Pas de réseau bayésien, pas de conditionnement continu (densités conditionnelles) au-delà de la mention, pas de Beta (p02-03).
