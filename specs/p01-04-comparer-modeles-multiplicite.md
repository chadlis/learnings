---
id: p01-04
series: chain
part: "01"
number: "04"
slug: comparer-modeles-multiplicite
title: Comparer deux modèles, et pourquoi le max ment
subtitle: fil A, cas 2 et 3 — appariement, McNemar, multiplicité, train/val/test
prereq: [p01-01, p01-02]
anki: [stats::inference, stats::comparaison, stats::multiplicite, ml::validation]
bridges: [b02, b03]
next: p01-05
status: reviewed
---

## Question de la chaîne
A fait 87,2 %, B fait 88,1 % sur le même test set de 1 000 lignes. B est-il meilleur ? Et si B est le meilleur de 40 configurations essayées sur ce test set ?

## Prérequis
- p01-01 : l'objet aléatoire est le test set ; SE d'une proportion.
- p01-02 : H₀ sur un paramètre, p-value.
- p00-02 : Var(X − Y) = Var(X) + Var(Y) − 2Cov(X, Y).

## Hypothèses posées
- H1 : A et B sont évalués sur le **même** tirage — leurs erreurs sont corrélées (les lignes faciles sont faciles pour les deux).
- H2 : lignes indépendantes.
- H3 (cas 3) : les 40 configurations ont la **même** accuracy vraie ; seule la chance les sépare. Hypothèse de travail pour voir le biais.

## Exemple fil rouge
n = 1 000. A : 872 justes ; B : 881 justes ; différence 0,009.
- Non apparié : SE_diff = √(0,872·0,128/1000 + 0,881·0,119/1000) = √(1,116e-4 + 1,048e-4) = 0,0147 ; z = 0,61 ; p ≈ 0,54.
- Apparié, désaccords : b = A juste / B faux = 30 ; c = A faux / B juste = 39 (c − b = 9 ✓). McNemar χ² = (c − b)²/(b + c) = 81/69 = 1,17 ; p ≈ 0,28.
- Mêmes totaux, moins de désaccords : b = 5, c = 14 : χ² = 81/19 = 4,26 ; p ≈ 0,039. Même différence, verdict différent.
- Cas 3 : 40 configs à accuracy vraie 0,87, n = 1 000 ; SE = 0,0106 ; E[max de 40 N(0,87, 0,0106²)] ≈ 0,87 + 2,16·0,0106 ≈ 0,893. Le gagnant affiche 2 points de plus qu'il ne vaut.

## Pas de la chaîne
1. **Le décor.** Un test set, deux modèles figés. Colonne aléatoire : le test set (pas « les prédictions »). Les deux accuracies descendent du même tirage.
2. **La différence est l'objet** [tronc]. On teste H₀ : π_A = π_B via D = p̂_B − p̂_A. Var(D) = Var(p̂_A) + Var(p̂_B) − 2Cov. Ignorer la covariance (test non apparié) surestime la variance. Au tableau : « Les deux modèles sont évalués sur les mêmes lignes, donc leurs erreurs sont corrélées positivement, donc la variance de la différence est plus petite que la somme des variances, donc le test non apparié manque de puissance. »
3. **Appariement : seuls les désaccords comptent.** Les lignes où A et B ont raison ensemble (ou tort ensemble) ne disent rien sur la différence. McNemar : sous H₀, les désaccords b et c sont équiprobables ; χ² = (c − b)²/(b + c). Au tableau : « Une ligne où les deux modèles sont d'accord ne contribue pas à la différence, donc l'information est dans les désaccords, donc on teste si les désaccords sont équilibrés. »
4. **Lecture.** 81/69 → n.s. ; 81/19 → significatif. Même écart de 9 lignes : ce qui décide est le nombre de désaccords, pas l'écart brut. Figure 1.
5. **Bootstrap apparié** (p01-05) : rééchantillonner les lignes, recalculer D, lire l'IC. Même idée sans formule.
6. **Le max ment** [tronc]. 40 configs à 0,87 vrai : la meilleure sur le test set affiche ≈ 0,893 (figure 2). Le score du gagnant est un max de 40 variables bruitées : biaisé vers le haut, d'autant plus que le SE est grand et que les configs sont nombreuses. Même mécanisme que le « témoin atteignable » : choisir le meilleur d'un ensemble ne peut que monter. Au tableau : « Le gagnant a été choisi parce qu'il était le plus haut, donc son score contient la chance qui l'a fait gagner, donc il surestime sa valeur vraie, donc un test set utilisé pour choisir ne mesure plus. »
7. **Remède : train / validation / test.** On choisit sur la validation, on mesure sur le test, ouvert une fois. Le biais du max est payé sur la validation, pas sur le chiffre rapporté.
8. **Où ça casse** [casse].

## Figures exigées
- **Figure 1 — `plot` + `slider` désaccords b + c ∈ [10, 200]**, c − b fixé à 9 : courbe de la p-value de McNemar en fonction de b + c ; ligne 0,05. Readout : b, c, χ², p. Légende : même différence, plus de désaccords ⇒ moins de puissance.
- **Figure 2 — `repeat`** : draw = max de 40 tirages Binomiale(1000, 0,87)/1000 ; bins [0,85 ; 0,92 ; 35] ; marque 0,87 (« valeur vraie de toutes les configs »). Second bouton ou second `repeat` : draw = une seule config. Les deux histogrammes se comparent : le max est décalé de ~2 SE. Légende : le gagnant est choisi sur le bruit.
- **Figure 3 — `slider` k configs ∈ [1, 200]** : E[max] ≈ 0,87 + SE·E[max de k N(0,1)] (tabuler 1:0 · 2:0,56 · 5:1,16 · 10:1,54 · 20:1,87 · 40:2,16 · 100:2,51 · 200:2,75) ; readout du biais en points d'accuracy.

## Où ça casse
- Pas le même test set ⇒ pas d'appariement ⇒ test non apparié, moins puissant mais valide.
- Lignes dépendantes (même utilisateur) ⇒ McNemar trop optimiste.
- Différence dans le bruit (z < 1) : ce n'est pas « A = B », c'est « on ne sait pas » ; il faut plus de lignes.
- Validation trop petite : le biais du max se reporte sur la validation, et le choix devient du bruit.

## Résumé
1. Objet aléatoire : le test set commun ; la différence est corrélée ⇒ apparier.
2. McNemar : seuls les désaccords portent l'information ; χ² = (c − b)²/(b + c).
3. Même écart, moins de désaccords ⇒ plus significatif.
4. Le max de k scores bruités est biaisé vers le haut de ≈ SE·E[max_k].
5. Train / validation / test : on choisit sur validation, on mesure sur test, une fois.

**Phrase d'entretien** : « Les deux modèles sont évalués sur le même tirage, donc j'apparie : seuls les désaccords comptent, McNemar ou bootstrap sur la différence. Et si B est le meilleur de quarante essais sur ce test set, son score est un maximum de variables bruitées, biaisé vers le haut d'environ deux erreurs-types : il faut une validation pour choisir et un test ouvert une seule fois pour mesurer. »

## Chaîne verbalisée
1. Quel est l'objet aléatoire quand on compare A et B ? → Le test set commun ; les erreurs sont corrélées.
2. Pourquoi apparier gagne de la puissance ? → Var(D) contient −2Cov ; les lignes d'accord ne comptent pas.
3. Que teste McNemar, avec quelle statistique ? → b = c sous H₀ ; (c − b)²/(b + c).
4. Pourquoi le meilleur de 40 configs surestime-t-il ? → Max de variables bruitées, biais ≈ 2 SE ; choisi sur la chance.
5. Quel protocole répare ? → Train/validation/test, test ouvert une fois.

## Ce qui a cassé pour Salah
- Q14.1 du 10/09 : « l'objet aléatoire = les prédictions » (faux : le test set) ; pas d'appariement spontané. Pas 1–3.
- Q14.2 : multiplicité non vue. Pas 6–7, figures 2–3.
- D3 (biais du max), première tentative du 11/09 : ~9 briques nouvelles d'un coup → « pas compris grand chose ». Cette chaîne ne redémontre pas la loi du max (Φᵏ) : elle la **montre** (figure 2) et renvoie à D3 pour la dérivation. Une brique par pas.
- Pont réussi à réutiliser : Q3 « témoin atteignable » (réussie) ⇒ nommer explicitement le lien au pas 6 et au pont b02.

## Exclusions
Pas de Bonferroni/FDR au-delà d'une phrase. Pas de tests sur AUC (DeLong). Pas de dérivation de Φᵏ (D3).

## Questions pour la revue

Tous les chiffres de l'exemple fil rouge ont été revérifiés par script : aucun n'était
faux, rien n'a été corrigé ci-dessus. Restent quatre points de décision.

1. **Figure 1, bornes du slider.** — validé 16/09 Le spec demande b + c ∈ [10, 200]. Avec c − b = 9
   bloqué, b + c doit être **impair** pour que b et c restent entiers : le slider court
   donc de 11 à 199 par pas de 2. Le franchissement du seuil de 5 % est à b + c ≈ 21.
2. **Figure 2, 0,893 contre la simulation.** — validé 16/09 L'approximation normale donne
   0,87 + 2,16 · 0,0106 = 0,8930. La simulation exacte (sommes de Bernoulli, comme dans
   p01-01) donne plutôt 0,8925 — la dissymétrie de la binomiale et la granularité de
   1/1000 rabotent une demi-dizaine de millièmes de point. Le 0,893 du spec est conservé
   dans le texte ; la figure affiche sa propre moyenne mesurée.
3. **Convention de signe, chaîne contre déroulé D2.** — validé 16/09
   Le spec pose D = p̂_B − p̂_A (positif ici, +0,009) ; D2 pose Dᵢ = Xᵢ − Yᵢ, donc
   d = p_A − p_B (négatif). Les noms b et c (A seul juste / B seul juste) coïncident, eux.
   **Tranché : les deux conventions coexistent et sont nommées.** Le pas 2 de la chaîne
   porte la phrase « D2 note la différence dans l'autre sens (A − B) ; ici D = B − A,
   positif = B meilleur » ; D2 reste inchangé — une fiche publiée ne se renomme pas pour
   des raisons de symétrie.
4. **Pas 5, bootstrap apparié sans chiffre.** — validé 16/09
   Le spec ne fixe aucun IC bootstrap pour le fil rouge n = 1 000, et la sheet ne l'invente
   pas. **Complété le 16/09, p01-05 étant écrite** : le pas 5 cite ses chiffres — médiane de
   dix latences, 1 000 rééchantillons, SE = 8,86 ms, IC percentile [119,5 ; 142,5] ms — en
   précisant que c'est l'exemple *médiane* et non la différence appariée à n = 1 000.
   Le fil rouge de cette chaîne reste sans IC bootstrap chiffré : il faudrait un spec pour
   l'y mettre.

## Révision v2
Le mot **procédure** reçoit sa définition fixe, reprise mot pour mot partout où il sert :

| FIXE | ce qui est vrai du monde, indépendamment des données, fixe et inconnu |
| ALÉATOIRE | ce qui dépend du tirage, changerait à chaque nouveau tirage |
| PROCÉDURE | la règle que l'expérimentateur applique au tirage, écrite d'avance, refaite à l'identique sur un autre tirage |

Exemples de procédures : « évaluer A et B sur le même test set et reporter la différence » ·
« garder la meilleure des k configs » · « s'arrêter dès que p < 0,05 » · « bootstrapper 1 000 fois ».

La procédure est fixe, son résultat est aléatoire parce qu'elle s'applique à un tirage ;
c'est la procédure qui fabrique l'estimateur.

Et la conséquence, écrite dans p01-04 pas 6 et dans b02 : « si la procédure regarde le
tirage pour décider — choisir, s'arrêter — elle change la loi de ce qu'elle produit ;
c'est le cas 3 ».

Porté par la sheet : la phrase du cas 3 est au pas 6, juste avant le « au tableau ».

**Revue 5, 17/09 — ajout validé.** Les **deux petits cas 3** sont consignés ici : « choisir
H₁ unilatérale après avoir vu le signe (double le taux de faux positifs) ; relever α après
avoir vu p — la procédure regarde le tirage pour décider ». Ils complètent le cas 3 « gros »
(le max de 40 configs) par deux gestes qui n'ont l'air de rien et relèvent du même mécanisme.
