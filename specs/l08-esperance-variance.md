---
id: l08
series: lesson
part: "00"
number: "08"
slug: esperance-variance
title: Espérance et variance — résumer une loi en deux nombres
subtitle: socle — Brunton 28 à 32 et 43 : centre de masse, linéarité sans hypothèse, inertie autour du centre
prereq: [l04, l05, l07]
anki: [stats::esperance, stats::mediane, stats::lotus, stats::variance, stats::moments]
bridges: [b04]
next: l09
status: built
---

## Question de la leçon
Où une loi est-elle centrée, à quel point s'étale-t-elle, et que deviennent ces deux nombres quand on additionne, multiplie ou transforme des variables ?

## Vidéos couvertes
28 The Expected Value (Mean) of a Probability Distribution · 29 Properties of the Expected Value · 30 Variance and Standard Deviation · 31 Example of Computing the Expectation and Variance of an Exponential Distribution · 32 Two Examples of Expected Values of Functions (°C/°F, gaz) · 43 The Tail Sum Formula.

## Prérequis
- l04 : variable aléatoire, loi discrète (PMF), densité (PDF), CDF. Tant que l04 n'existe pas : `map.html#l04`.
- l05 : loi exponentielle, densité λe^(−λt), survie e^(−λt).
- l07 : loi jointe, marginaliser = sommer sur l'autre variable ; indépendance = la jointe se factorise.

## Notions

### n1 · L'espérance est le centre de masse — OUTIL — Brunton 28
- Idée : « si on tire beaucoup de valeurs, quelle moyenne attend-on ? » ; on pose les probabilités comme des masses sur une règle, E[X] est le point d'équilibre.
- Formule : E[X] = Σ x·P(X = x) (discret) ; E[X] = ∫ x f(x) dx (continu). Hypothèse : la somme ou l'intégrale converge.
- Exemples : pièce Bernoulli(p) → p ; dé → 3,5 (valeur impossible à tirer) ; 100 pièces → 50 (Brunton) ; uniforme sur [0, 1] → ½.
- Code : moyenne de 100 000 lancers de dé ≈ 3,5.
- Où ça casse : E[X] n'est pas forcément une valeur possible ; elle peut ne pas exister (Cauchy) ; **E[X] est un nombre fixe, propriété de la loi, alors que la moyenne d'un échantillon est une réalisation de la variable X̄** (l10).
- Brunton dit / c'est : « le premier moment, comme le moment d'inertie » → E[X] est le centre de masse ; le moment d'inertie correspond à la variance (n6).
- Ce qu'on garde : X discrète : E[X] = Σ x P(X = x), le point d'équilibre de la loi ; un nombre, pas une variable aléatoire.

### n2 · Moyenne, médiane, mode — OUTIL — Brunton 28
- Idée : trois centres ; l'espérance n'est pas la valeur probable ; la médiane est robuste, la moyenne sensible aux valeurs extrêmes.
- Formules : médiane m telle que F(m) = ½ (cas général : P(X ≤ m) ≥ ½ et P(X ≥ m) ≥ ½) ; mode = argmax de la PMF ou de la densité.
- Exemples : dé → les trois valent 3,5 sauf le mode (toutes les faces) ; loi bimodale en ±1 : moyenne 0 jamais tirée ; exponentielle(λ) : médiane ln 2/λ < moyenne 1/λ ; patrimoine américain selon Brunton : médiane ≈ 200 k$, moyenne ≈ 1 M$ (facteur 5).
- Figure 2 (log-normale, curseur σ).
- Code : log-normale, moyenne contre médiane, et l'effet d'un milliardaire ajouté à 100 000 ménages.
- Où ça casse : médiane non unique (loi à trou, discret) ; « la moyenne est représentative » faux en queue lourde.
- Ce qu'on garde : résumer X par un nombre c : la moyenne minimise l'erreur quadratique E[(X − c)²], la médiane l'erreur absolue E[|X − c|] ; c'est pourquoi une valeur extrême tire la moyenne et laisse la médiane presque en place.

### n3 · L'espérance est linéaire, sans aucune hypothèse — OUTIL — Brunton 29
- Formule : E[aX + bY + c] = aE[X] + bE[Y] + c, pour toutes X, Y, même dépendantes.
- Preuve (discrète) : écrire E[X + Y] sur la loi jointe, distribuer, sortir x de la somme en y, reconnaître la marginale. **L'indépendance n'apparaît nulle part.**
- Exemples : deux dés → E[somme] = 7 ; X = Y (dépendance totale) → E[2X] = 7 aussi ; 100 pièces → 100 × ½ = 50 sans Pascal ; paires d'anniversaires partagés parmi 23 personnes : C(23, 2)/365 = 253/365 = 0,693.
- Code : deux variables fortement dépendantes, E[X + Y] = E[X] + E[Y] quand même.
- Où ça casse : E[g(X)] ≠ g(E[X]) en général (E[X²] ≠ E[X]²) ; E[XY] ≠ E[X]E[Y] sans hypothèse (n4).
- Brunton dit / c'est : (vidéo 35) « E[X̄] = μ parce que les X sont indépendants » → la linéarité n'en a pas besoin.
- Ce qu'on garde : l'espérance d'une somme est la somme des espérances, toujours.

### n4 · L'espérance d'un produit, seulement sous indépendance — OUTIL — Brunton 29
- Formule : X, Y indépendantes ⇒ E[XY] = E[X]E[Y] ; plus généralement E[g(X)h(Y)] = E[g(X)]E[h(Y)].
- Preuve (discrète, celle de Brunton) : la jointe se factorise, donc la double somme se coupe en produit de deux sommes. Contraste avec n3 : là on sommait une variable, ici on factorise.
- Exemples : deux dés indépendants → 12,25 ; X = Y → E[X²] = 91/6 = 15,17 ≠ 12,25 ; X uniforme sur {−1, 0, 1}, Y = X² → E[XY] = 0 = E[X]E[Y] alors que Y dépend entièrement de X.
- Code : les trois cas.
- Où ça casse : la réciproque est fausse ; l'écart E[XY] − E[X]E[Y] s'appelle la covariance (l09).
- Brunton dit / c'est : « si X et Y sont dépendants, E[XY] diffère de E[X]E[Y] » → pas forcément.
- Ce qu'on garde : E[XY] = E[X]E[Y] demande l'indépendance (ou au moins une covariance nulle), la linéarité ne demande rien.

### n5 · L'espérance d'une fonction (LOTUS) — OUTIL — Brunton 29
- Idée : pour E[g(X)], pas besoin de la loi de g(X) : on repondère les valeurs g(x) par les probabilités de X.
- Formule : E[g(X)] = Σ g(x) P(X = x) ; ∫ g(x) f(x) dx.
- Preuve (discrète) : regrouper les x par valeur de y = g(x).
- Exemples : E[X²] du dé = 91/6 ; gain g(x) = 2x + 1 → 8 ; E[(X − 3,5)²] = 35/12.
- Code : LOTUS contre loi de g(X) construite à la main.
- Où ça casse : E[g(X)] ≠ g(E[X]) : 15,17 contre 12,25 pour le carré ; l'écart est exactement la variance (n6).
- Ce qu'on garde : X discrète : E[g(X)] = Σ g(x) P(X = x), sans chercher la loi de g(X).

### n6 · La variance est l'inertie autour du centre — OUTIL — Brunton 30
- Idée : l'écart moyen au centre, au carré ; physique : moment d'inertie autour du centre de masse, la distance compte au carré.
- Formules : Var(X) = E[(X − μ)²] = E[X²] − E[X]² ; écart-type σ = √Var, dans l'unité de X.
- Preuve : développer le carré, linéarité, E[μ] = μ. Et Var ≥ 0 (espérance d'un carré), donc E[X²] ≥ E[X]².
- Exemples : constante → 0 ; X ∈ {1, 3} → 1 ; Y ∈ {0, 4} → 4 (distance ×2, variance ×4) ; Bernoulli(p) → p(1 − p), maximale à ½ ; dé → 35/12 = 2,917, σ = 1,708 ; Z = 0 (0,9) ou 10 (0,1) → μ = 1, Var = 9, la valeur rare fait 90 % de la variance.
- Figure 3 (barres des écarts au carré pondérés, quatre lois).
- Code : np.var contre la formule.
- Où ça casse : unité au carré ; une valeur lointaine domine ; 68 % dans ±1σ n'est vrai que pour la normale ; variance infinie possible (Pareto) ; **la variance n'est pas linéaire : Var(2X) = 4 Var X** (n9).
- Brunton dit / c'est : « les moments identifient la loi » → pas toujours.
- Ce qu'on garde : Var(X) = E[(X − μ)²] = E[X²] − μ², avec μ = E[X].

### n7 · Moments bruts, centrés, asymétrie, kurtosis — CULTURE — Brunton 28, 30, 37
- Contenu : séance du 10/10. Moment brut E[X^k] (autour de 0), centré E[(X − μ)^k] (autour de μ) ; ordre 1 position, 2 étalement, 3 asymétrie (puissance impaire, les côtés se compensent), 4 queues ; standardisés par σ³, σ⁴. Var = brut₂ − brut₁² (même forme que Huygens). Tableau X ∈ {1, 3} / Z : 2 / 1 ; 1 / 9 ; 0 / 2,67 ; 1 / 8,11. Normale : kurtosis 3 (excès 0). La kurtosis mesure les queues, pas l'aplatissement (Westfall 2014). ML : Adam (moments 1 et 2 bruts du gradient), activations à queues lourdes et quantization (LLM.int8).
- Code : scipy.stats.skew et kurtosis sur Z ; piège : `kurtosis` renvoie l'excès par défaut (fisher=True).
- Brunton dit / c'est : (37) « E[X³] est l'asymétrie » → moments centrés réduits.
- Ce qu'on garde (pas de carte) : ordre 3 = côté de la queue, ordre 4 = poids des queues.

### n8 · L'exponentielle : espérance, variance, médiane — OUTIL — Brunton 31
- Formules : E[T] = 1/λ, E[T²] = 2/λ², Var = 1/λ², σ = 1/λ, médiane ln 2/λ ≈ 0,69/λ.
- Preuve : deux intégrations par parties (Brunton fait la première, la seconde est donnée ici) ; médiane par 1 − e^(−λm) = ½.
- Exemples : λ = 2 → 0,5 ; 0,25 ; 0,347 ; ampoule de durée moyenne 100 h → médiane 69,3 h ; spams à 4 par heure → attente moyenne 15 min, médiane 10,4 min.
- Figure 4 (densité, curseur λ, moyenne et médiane marquées).
- Code : simulation.
- Où ça casse : bornes d'intégration 0 à ∞, pas −∞ ; σ = moyenne n'est pas la cause de l'absence de mémoire (question posée par Brunton).
- Ce qu'on garde : exponentielle(λ) : moyenne = écart-type = 1/λ, médiane ln 2/λ.

### n9 · Changer d'unité : Var(aX + b) = a² Var(X) — OUTIL — Brunton 32 (et 30 pour Var(2X))
- Idée : décaler ne change pas les écarts ; multiplier par a multiplie les écarts par a et leurs carrés par a².
- Formules : E[aX + b] = aE[X] + b ; Var(aX + b) = a² Var(X) ; écart-type |a|σ.
- Preuve : Brunton 32, une ligne.
- Exemples : °C → °F (a = 9/5, b = 32) : variance × 3,24, écart-type × 1,8 ; gain G = 2X + 1 sur un dé : E = 8, Var = 11,67 ; Var(5) = 0 ; Var(−X) = Var(X).
- Figure 5 (curseurs a, b sur le dé).
- Code.
- Où ça casse : **la variance n'est pas linéaire** : Var(2X) = 4 Var X ≠ 2 Var X ; ce n'est pas Var(X + Y) (l09) ; a < 0 : écart-type |a|σ.
- Brunton dit / c'est : (23) « l'écart-type de aX + b est a²σ² » → c'est la variance.
- Ce qu'on garde : a et b constantes : Var(aX + b) = a² Var X ; b disparaît, a sort au carré.

### n10 · L'énergie cinétique d'un gaz — CULTURE — Brunton 32
- Contenu : vitesse d'une molécule = vecteur (Vx, Vy, Vz) à composantes indépendantes N(0, σ²) ; E[½ m |V|²] = ½ m (E[Vx²] + E[Vy²] + E[Vz²]) = (3/2) m σ², par linéarité seule, sans l'intégrale de Maxwell. Avec σ² = kT/m : (3/2) kT.
- Code : simulation, m = 2, σ = 1,3 → 5,07.
- Brunton dit / c'est : « c'est la température » → proportionnelle : (3/2) kT.
- Ce qu'on garde (pas de carte) : la linéarité évite des intégrales entières.

### n11 · La formule de la somme des queues — CULTURE — Brunton 43
- Formule : X à valeurs dans {0, 1, 2, …} ⇒ E[X] = Σ_{k ≥ 1} P(X ≥ k).
- Preuve : le triangle de Brunton (k P(X = k) = k copies de P(X = k), lues par lignes).
- Exemples : dé → (6 + 5 + 4 + 3 + 2 + 1)/6 = 3,5 ; géométrique(p) → Σ q^(k − 1) = 1/p, donc 6 lancers en moyenne pour un 6.
- Figure 6 (escalier P(X ≥ k), dé ou géométrique).
- Code.
- Brunton dit / c'est : P(X ≥ k) = 1 − F(k) → 1 − F(k − 1).
- Ce qu'on garde (pas de carte) : une espérance est la somme des probabilités de survie.

## Figures exigées
- Figure 1 (n1) — `plot` : loi d'un dé pipé en barres, curseur « poids du 6 » de 1/6 à 0,9, triangle d'appui sous E[X] ; readouts E[X] et P(6).
- Figure 2 (n2) — `plot` : densité log-normale de médiane 1, curseur σ ∈ [0,1 ; 2], mode, médiane et moyenne en traits ; readout moyenne/médiane ; légende : à σ = 1,79 la moyenne vaut 5 fois la médiane, le rapport du patrimoine américain cité par Brunton.
- Figure 3 (n6) — `plot` : boutons dé · {1, 3} · {0, 4} · Z ; en haut la loi, en bas les contributions p·(x − μ)² ; readouts Var, σ, part de la plus grosse contribution.
- Figure 4 (n8) — `plot` : densité exponentielle, curseur λ, moyenne et médiane ; readouts.
- Figure 5 (n9) — `plot` : loi de aX + b pour un dé, curseurs a ∈ [−3 ; 3], b ∈ [−5 ; 5] ; readouts E, Var, σ.
- Figure 6 (n11) — `plot` : escalier des P(X ≥ k), boutons dé · géométrique(1/6) ; readout de la somme.

## Résumé
1. E[X] = Σ x P(X = x) : le centre de masse, un nombre fixe de la loi.
2. Médiane robuste, moyenne sensible aux extrêmes ; pour les lois usuelles asymétriques à droite, mode < médiane < moyenne.
3. E est linéaire sans aucune hypothèse.
4. E[XY] = E[X]E[Y] demande l'indépendance ; la réciproque est fausse.
5. E[g(X)] = Σ g(x) P(X = x), et E[g(X)] ≠ g(E[X]).
6. Var(X) = E[(X − μ)²] = E[X²] − μ² : l'inertie autour du centre ; une valeur lointaine domine.
7. Var(aX + b) = a² Var X : la variance n'est pas linéaire.
8. Exponentielle : moyenne = écart-type = 1/λ, médiane ln 2/λ.

Phrase d'entretien : « L'espérance est le centre de masse de la loi ; elle est linéaire sans aucune hypothèse, mais l'espérance d'un produit ne se factorise que sous indépendance. La variance est l'inertie autour de ce centre, E[X²] − E[X]² ; elle n'est pas linéaire : un facteur a sort au carré et une constante disparaît. »

## Chaîne verbalisée
1. E[X] et la moyenne de dix lancers : lequel est aléatoire ? → La moyenne des lancers, réalisation x̄ de X̄ ; E[X] est un nombre fixe.
2. Que vaut E[X + Y], et sous quelle hypothèse ? → E[X] + E[Y], sans hypothèse.
3. Quand a-t-on E[XY] = E[X]E[Y] ? → Sous indépendance ; la réciproque est fausse (Y = X² sur {−1, 0, 1}).
4. Définis la variance, puis donne sa forme de calcul. → La moyenne des carrés des écarts à μ ; E[X²] − μ².
5. Que valent Var(2X) et Var(X + 5) ? → 4 Var X ; Var X.
6. Pourquoi le terme croisé de Var(aX + bY) n'est-il pas 2ab E[XY] ? → Avec X = Y = 1, Var = 0 mais 2ab E[XY] = 2ab ; c'est 2ab Cov(X, Y).
7. Pourquoi Z = 0 ou 10 (probabilités 0,9 et 0,1) a-t-elle une variance de 9 ? → μ = 1 ; 0,9·1 + 0,1·81 : la valeur rare fait 90 %.

## Ce qui a cassé pour Salah
- 09/10 : Var(aX + bY) écrite avec 2ab E[XY] au lieu de 2ab Cov(X, Y). Adressé ici par n4 (E[XY] n'est pas un écart à l'indépendance, la covariance l'est) et le contre-exemple des constantes, puis traité complètement en l09.
- 09/10 : « l'indépendance sert la linéarité de la variance ». Adressé par n3 (la linéarité est celle de E, sans hypothèse) et n9 (la variance n'est pas linéaire).
- 09/10 : définition de la variance oubliée. Adressé par n6, construite depuis l'image physique et un exemple avant la formule.
- 18/09 : la réalisation prise pour la variable. Adressé dans le « où ça casse » de n1 (E[X] est un nombre ; x̄ est une réalisation de X̄).
- 10/10 : moments, asymétrie, kurtosis demandés en fiche, sans cartes : n7, CULTURE.

## Erreurs de Brunton couvertes
28 E « comme le moment d'inertie » → n1 et n6 · 28, 30, 37 les moments identifient toujours la loi → n6 · 29 dépendance ⇒ E[XY] ≠ E[X]E[Y] → n4 · 35 E[X̄] = μ par indépendance → n3 · 37 E[X³] = asymétrie → n7 · 23 écart-type a²σ² → n9 · 32 « c'est la température » → n10 · 43 P(X ≥ k) = 1 − F(k) → n11.

## Exclusions
Pas de covariance au-delà de son nom (l09), pas de fonction génératrice (l12), pas de Markov ni de Chebyshev (l10), pas de théorie de la mesure, pas d'intégrale de Maxwell (remplacée par la linéarité en n10).

## Questions pour la revue
- Relecture en contexte frais (10/10/2026) avant publication, appliquée : facteur λ⁴ (et non λ²) sur la variance quand on passe λ à numpy ; « mode < médiane < moyenne » ramené à une règle des lois usuelles ; σ = moyenne présenté comme conséquence de l'absence de mémoire, non comme coïncidence ; convergence absolue de l'espérance ; médiane du dé = tout [3, 4] ; contre-exemple des constantes pour 2ab E[XY] ajouté en n9 ; additivité contre linéarité dite en une phrase ; exemple chiffré avant la formule de la variance ; σ de la log-normale nommé (écart-type de ln X) ; échelle commune pour la figure 3.
- L'idée de n6 fait 179 mots (le validateur vise 140) : l'exemple chiffré {1, 3} / {0, 4} y a été ajouté exprès, avant la formule. Tranché le 10/10 : on garde, dépasser 140 « de pas beaucoup » est accepté ; le validateur tolère jusqu'à 180.

## Révision v2 (10/10/2026)

Demande de Salah, après lecture de la v1 : « pour L8, ce serait bien que la partie intuition soit aussi avec visuel ou animation quand c'est possible, comme là pour voir les exemples donnés. La partie idée on garde, pas grave si ça dépasse de pas beaucoup 140. »

Delta : sous chaque `div.idee`, une vignette `div.fig.vis` « Voir l'idée » qui montre les exemples que l'idée cite. Aucun texte d'idée, de formule, de figure ou de bloc dépliable n'est modifié ; les figures 1 à 6 restent à leur place, sous la formule.

- v1 (n1) — règle à trois masses (0,5 en 1, 0,3 en 2, 0,2 en 6) qui penche autour d'un doigt c ; équilibre en 2,3 ; bouton « tirer 1 000 valeurs », le doigt suit la moyenne des tirages.
- v2 (n2) — un point par individu : une bosse, deux bosses (moyenne dans le trou, mode double), patrimoine avec 0 à 4 grosses fortunes (moyenne 1,13 → 3 ; médiane 1 → 1,11).
- v3 (n3) — loi de X + Y pour deux dés indépendants, Y = X, Y = 7 − X : la forme change, le point d'équilibre reste en 7 ; 300 couples tirés.
- v4 (n4) — grille 6 × 6 des produits x · y pondérés : E[XY] = 12,25 ; 15,17 ; 9,33.
- v5 (n5) — six masses de ⅙ transportées de x à g(x) pour x², 2x + 1, (x − 3,5)² ; masses fusionnées ; E[g(X)] contre g(E[X]).
- v6 (n6) — carrés des écarts pour deux masses en 2 ± d, et bâton qui tourne (vitesse ∝ d, énergie ∝ d²).
- v7 (n7) — contributions p · (x − μ)ᵏ pour {1, 3} et Z, curseur k de 1 à 4 ; part de la valeur 10 : 50, 90, 98,8, 99,9 %.
- v8 (n8) — huit heures de spams à 4 par heure : arrivées, attentes en pastilles, moyenne contre médiane, part des attentes sous la moyenne (63 % en théorie).
- v9 (n9) — 10, 15, 20 °C : + 32 fait glisser les carrés, × 1,8 multiplie leurs aires par 3,24 ; variance 16,67 → 54 en °F.
- v10 (n10) — nuage (Vx, Vy) de molécules σ = 1,3 et moyennes de Vx², Vy², Vz², |V|² empilées vers σ² = 1,69 et 3σ² = 5,07.
- v11 (n11) — le triangle de Brunton animé : 21 cases lues par colonnes puis par lignes.

Vérifié : chaque chiffre des légendes recalculé (script), chaque vignette manipulée et capturée, 0 erreur JS, pas de débordement à 390 px. Le validateur exige désormais la vignette (WARN si absente, FAIL si elle précède l'idée ou n'a pas de légende) et tolère une idée jusqu'à 180 mots.

## Révision v3 (10/10/2026)

Relecture en contexte frais de la v2 publiée. Source canonique de la page désormais : `KIT/l08-example/` (`head.html`, `parts/*.html`, `js/10-figures.js`, `js/20-vignettes.js`, `code/`), assemblée par `KIT/build.py`. Chaque chiffre ci-dessous est recalculé par script ; aucune correction n'a été rejetée.

- v7 (n7) : la légende disait la barre de gauche négative « aux k impairs » et le « côté lourd » gagnant sur Z, faux à k = 1 (le moment centré d'ordre 1 est nul sur toute loi) et ambigu (le côté de masse 0,9 perd), avec 99 % pour les 98,8 % affichés ; elle distingue maintenant k = 1 de k = 3 (−0,9 + 72,9 = 72), et l'idée parle d'un côté qui « porte des écarts plus longs ».
- v5 (n5) : « g(E[X]) ne tombe sur E[g(X)] que pour g affine » est faux en général ((x − 3,5)³ sur le dé : E[g(X)] = 0 = g(3,5)) ; l'énoncé est restreint aux trois g affichées, avec Jensen pour le carré, et la légende nomme les faces qui arrivent deux à deux au même point (1 et 6 en 6,25 ; 2 et 5 en 2,25 ; 3 et 4 en 0,25).
- v2 (n2), deux bosses : la médiane tombe aussi dans le trou et sa ligne bleue était cachée sous la rouge ; la légende dit que toute valeur entre 2,95 et 7,05 coupe les 24 points en deux, les tirets bleus sont tracés par-dessus la moyenne, et l'étiquette « l'individu du milieu » devient « coupe les individus en deux » (deux individus du milieu quand n est pair).
- v2 (n2), patrimoine : à la largeur de pile 0,5, le readout « mode ≈ 1 » égale la médiane alors que la garde disait mode < médiane ; la légende le dit et renvoie à la figure 2.
- v10 (n10) : la vignette « l'énergie » trace E[|V|²] → 3σ² = 5,07 ; la légende précise qu'avec m = 2, ½ m |V|² = |V|², donc la dernière barre est aussi l'énergie moyenne (3/2) m σ² = 5,07.
- n9, où ça casse : le contre-exemple des constantes (l'erreur de Salah du 09/10) écrivait Var(X + Y) = 0 ; il écrit maintenant Var(aX + bY) = Var(a + b) = 0.
- Liens : les renvois vers `map.html#lNN` pointent vers les notions des leçons, ancres vérifiées dans les cibles : l04 `#n2` ; l05 `#n3` (prérequis), `#n4` (n8), `#n2` (n11) ; l06 `#n1` ; l07 `#n2` et `#n4` ; l09 `#n1` (n4), `#n2` (n3, n6, n9), la page pour la suite ; l10 `#n4` (LGN) et `#n3` (X̄) ; l12 `#n1`, où l12 énonce « finie près de 0, elle identifie la loi » et montre les sœurs de la log-normale. Le lien de la barre de navigation vers la carte reste.
- v3 (n3) : « rejoint 7 » ne collait pas au premier lancer (graine 5 : 6,87 en indépendant, 6,78 pour Y = X ; écart maximal 0,49 sur les graines 5 à 44) ; la légende dit « à quelques dixièmes de 7, et exactement sur 7 pour Y = 7 − X ».
- v9 (n9) : « allonge chaque côté de 1,8 » devient « multiplie chaque côté par 1,8, donc chaque aire par 1,8² = 3,24 », et les trois journées sont dites équiprobables (⅓), ce que suppose la variance 16,67.
- v6 (n6) : à d = 0,25, les masses de rayon 9 sur une orbite de rayon 11 cachaient les flèches ; leur rayon vaut min(9 ; 0,4 R). À 390 px, le panneau gauche défile (largeur minimale 440 px) au lieu de réduire ses graduations à 7 px.
- Readouts trop longs : v10 et v11 mettent le détail de la somme dans le label et gardent une valeur courte (8,89 ; 21/6 ; 3,5). Même défaut, même correction, étendus à v9 (« 16,67 × 3,24 = 54 » sur deux lignes à 1 280 px) et v3 (« six barres paires » → « 6 barres paires »).
- n8, où ça casse : le 1,414 supposait ln T ~ N(0, ln 2) sans le dire ; c'est écrit, moyenne et écart-type valent √2 = 1,414.
- Règles transversales : gras décoratif retiré des idées de n1, n3, n6 et n9 (en n6, le gras passe sur le mot défini, « variance ») ; aucun `<b>` hors étiquette dans les encadrés Brunton ; « jeu de test (test set) » au premier usage (n6) ; « ce qu'on garde » des notions OUTIL : n2 ramené à une idée (ce que minimise chaque centre, d'où la robustesse de la médiane ; l'ordre mode < médiane < moyenne reste dans « où ça casse » et le résumé), cadre ajouté à n1 et n5 (X discrète), n6 (μ = E[X]) et n9 (a et b constantes), toutes sous 40 mots.
- Spec : numéros des figures de n8, n9, n11 corrigés (4, 5, 6, comme sur la page, et non 5, 6, 7) ; le code de n2 ajoute le milliardaire à 100 000 ménages, pas 1 000.

Vérifié : `validate_sheet.py --render` 0 FAIL, 0 WARN ; 0 erreur JS ; pas de débordement à 390 px ; vignettes v2, v3, v5, v6, v7, v9, v10, v11 capturées dans leurs états concernés à 1 280 et 390 px, et toutes les figures dans leur état initial en clair et en sombre.
