---
id: p00-01
series: chain
part: "00"
number: "01"
slug: lois-quand-laquelle
title: Lois usuelles — quelle situation déclenche quelle loi
subtitle: socle — une loi est une hypothèse sur le mécanisme, pas une formule à retenir
prereq: []
anki: [stats::lois, stats::binomiale, stats::poisson, stats::exponentielle, stats::normale]
bridges: []
next: p00-02
status: ready
---

## Question de la chaîne
Devant une situation (un mail, une heure de trafic, une attente, une moyenne de mesures), quelle loi poser, pourquoi celle-là, et à quel signe reconnaître qu'elle est fausse ?

## Prérequis
Aucune sheet. Vocabulaire minimal, rappelé en tête : variable aléatoire = un nombre qui dépend du tirage ; loi = la liste des valeurs possibles avec leur probabilité (discret) ou leur densité (continu, p00-02) ; E = valeur moyenne sur les tirages ; Var = dispersion (p00-02).

## Hypothèses posées
- H1 : une loi n'est jamais « vraie » : c'est une **hypothèse sur le mécanisme** qui produit les données. Chaque loi ci-dessous est nommée avec son mécanisme.
- H2 : les essais ou événements sont **indépendants** et de **même loi** (iid). C'est cette hypothèse qui fabrique Binomiale, Poisson, Exponentielle ; quand elle tombe, la loi tombe.

## Exemple fil rouge
Une boîte de support reçoit des mails. Chaque mail est un spam avec probabilité p = 0,3 (Bernoulli). Sur 10 mails : Binomiale(10 ; 0,3) : E = 3, Var = 2,1 ; P(au moins un spam) = 1 − 0,7¹⁰ = 0,972 ; P(exactement 3) = C(10,3)·0,3³·0,7⁷ = 120·0,027·0,0824 = 0,267.
Les spams arrivent au rythme de 4 par heure (Poisson λ = 4) : P(0 en une heure) = e⁻⁴ = 0,018 ; P(4) = e⁻⁴·4⁴/4! = 0,195 ; P(≥ 7) = 0,111. Vérification de la limite : Binomiale(1 000 ; 0,004) donne P(4) = 0,196.
Temps entre deux spams : Exponentielle de taux 4/h : E = 15 min ; P(T > 30 min) = e⁻² = 0,135 ; P(T > 15 min) = e⁻¹ = 0,368 ; médiane = ln 2 / 4 h = 10,4 min (plus courte que la moyenne : queue à droite).
Temps de réponse d'un agent : moyenne 12 min, écart-type 3 min, si c'est une somme de beaucoup de petits délais → Normale(12 ; 3²) : 95 % entre 6 et 18 min.

## Pas de la chaîne
1. **Le décor.** Quatre questions sur la même boîte mail : un mail est-il un spam ? combien de spams sur 10 mails ? combien en une heure ? combien de temps avant le prochain ? Quatre mécanismes, quatre lois.
2. **Bernoulli(p) — un essai oui/non** [tronc]. X ∈ {0, 1}, P(1) = p. E = p, Var = p(1 − p), maximale en p = ½ (l'incertitude maximale). Au tableau : « Un seul essai à deux issues, donc la loi n'a qu'un paramètre, donc tout se lit sur p : la moyenne est p et la variance p(1 − p). »
3. **Binomiale(n, p) — compter les succès de n essais iid** [tronc]. X = Σ Bernoulli. E = np, Var = np(1 − p) (additivité sous indépendance, p00-02). P(X = k) = C(n,k) pᵏ(1 − p)ⁿ⁻ᵏ : C(n,k) façons de placer les k succès, chacune de probabilité pᵏ(1 − p)ⁿ⁻ᵏ par indépendance. Au tableau : « n essais indépendants de même p, donc la somme de n Bernoulli, donc espérance np et variance np(1 − p), et la probabilité de k succès compte les placements. »
4. **Poisson(λ) — compter des événements rares dans un intervalle** [tronc]. Limite de Binomiale(n, λ/n) quand n → ∞ : beaucoup d'occasions, chacune improbable, en moyenne λ. P(k) = e⁻ᵡλᵏ/k!. **E = Var = λ** : c'est le test de la loi. Poisson **compte**. Au tableau : « Beaucoup d'occasions indépendantes chacune de petite probabilité, donc une Binomiale à n grand et p petit, donc à la limite une Poisson dont la moyenne et la variance sont toutes deux λ. »
5. **Exponentielle(λ) — chronométrer jusqu'au prochain événement.** Si les comptes sont Poisson(λ) par unité de temps, l'attente T jusqu'au prochain est Exponentielle : P(T > t) = e⁻ᵡᵗ, E = 1/λ. **Sans mémoire** : P(T > s + t | T > s) = P(T > t) — avoir déjà attendu ne rapproche pas. Exponentielle **chronomètre**. Au tableau : « Pas d'événement pendant t, c'est Poisson à zéro sur t, donc e⁻ᵡᵗ, donc l'attente est exponentielle, et comme cette probabilité ne dépend que de la durée, elle est sans mémoire. »
6. **Normale(μ, σ²) — une somme de beaucoup de petits effets.** Le TCL (p00-04) la fait apparaître dès qu'on additionne ou moyenne beaucoup de termes indépendants de variance finie, quelle que soit leur loi. Deux paramètres, 68 / 95 / 99,7 % à ±1, 2, 3 σ. Ce n'est pas la loi « par défaut » : c'est la loi des sommes.
7. **La table signal → loi** [tronc]. Un essai oui/non → Bernoulli · n essais iid, on compte → Binomiale · comptage d'événements rares dans un intervalle, taux → Poisson · attente jusqu'au prochain → Exponentielle · somme ou moyenne de beaucoup de termes → Normale · une probabilité inconnue sur [0, 1] → Beta (p02-03). Au tableau : « Je lis le mécanisme, donc je nomme la loi, donc j'hérite de sa moyenne, de sa variance et de son test. »
8. **Où ça casse** [casse].

## Figures exigées
- **Figure 1 — `plot` + `slider` n ∈ [1, 60] et p ∈ [0,01 ; 0,99]** : PMF de la Binomiale en barres (`P.dyn` rect), marques E = np (trait) et E ± √Var (segment). Readout E, Var, P(X ≥ 1). Légende : à p = ½ la loi est symétrique et la plus large ; à p petit elle s'écrase à gauche.
- **Figure 2 — `plot` + `slider` λ ∈ [0,5 ; 15] et `slider` n ∈ [10, 2 000]** : PMF Poisson(λ) (points reliés) et PMF Binomiale(n, λ/n) (barres) superposées ; readout de l'écart max. Légende : la Binomiale rejoint la Poisson quand n grandit à λ fixé ; E = Var = λ.
- **Figure 3 — `plot` + `slider` λ (taux/heure) et `slider` t** : densité exponentielle avec l'aire P(T > t) grisée ; readouts E = 1/λ, médiane, P(T > t). Bouton « déjà attendu 15 min » qui redessine la densité conditionnelle : identique, décalée. Légende : sans mémoire.
- **Figure 4 — `plot` + `slider` k ∈ [0,5 ; 3]** : densité normale(12 ; 3²) avec la bande μ ± kσ grisée ; readout de l'aire (68,3 / 95,4 / 99,7 à k = 1, 2, 3). Légende : la seule chose à retenir d'une normale.

## Où ça casse
- **Dépendance** : rafales de spams (un attaquant envoie par vagues) ⇒ les comptes ne sont plus Poisson : Var > E, **surdispersion**. C'est le diagnostic à regarder avant de poser Poisson. (Binomiale négative : nommer seulement.)
- **p qui varie** d'un essai à l'autre (mails de deux sources) ⇒ mélange ; la Binomiale sous-estime la variance.
- **Queues lourdes** : latences, revenus, tailles de fichiers ne sont pas normales (log-normale, Pareto) ; une moyenne ± 2σ y est un mensonge, la médiane et les quantiles disent vrai.
- **La normale « par défaut »** : sans mécanisme de somme, rien ne la justifie ; c'est le TCL qui la fabrique, et il demande n suffisant (p00-04).

## Résumé
1. Une loi = une hypothèse sur le mécanisme ; on la nomme par le mécanisme, pas par la forme de la courbe.
2. Bernoulli : un essai ; Binomiale : compter n essais iid (E = np, Var = np(1 − p)).
3. Poisson : compter des événements rares, E = Var = λ ; Exponentielle : chronométrer jusqu'au prochain, sans mémoire.
4. Normale : la loi des sommes (TCL), 68 / 95 / 99,7.
5. Test de chaque loi : Var vs E pour Poisson, mémoire pour l'exponentielle, symétrie et queues pour la normale.
6. Casse : dépendance (surdispersion), p variable, queues lourdes.

**Phrase d'entretien** : « Je pose une loi à partir du mécanisme : un essai binaire est Bernoulli, n essais indépendants comptés est Binomiale, un comptage d'événements rares par intervalle est Poisson avec variance égale à la moyenne, l'attente entre deux est exponentielle sans mémoire, et une somme de beaucoup de petits effets est normale par le TCL. Si la variance dépasse la moyenne sur un comptage, l'indépendance est fausse et Poisson aussi. »

## Chaîne verbalisée
1. Combien de spams sur 10 mails, et pourquoi cette loi ? → Binomiale(10 ; 0,3) : somme de 10 Bernoulli iid ; E = 3, Var = 2,1.
2. Combien en une heure, et quel est le test de la loi ? → Poisson(4) : occasions nombreuses et rares ; E = Var = λ.
3. Combien de temps avant le prochain, et quelle propriété ? → Exponentielle(4/h), E = 15 min, sans mémoire.
4. Pourquoi une somme de beaucoup de délais est normale ? → TCL : somme de termes indépendants de variance finie.
5. Var = 9 sur un comptage de moyenne 4 : que conclure ? → Surdispersion ⇒ dépendance ⇒ pas Poisson.

## Ce qui a cassé pour Salah
- Diagnostic S1 : probas sans intuition ni formalisation ; t01 a installé « Poisson compte / Expo chronomètre » et « E = Var = λ comme test ». Cette chaîne les reprend comme tronc (pas 4, 5) et les relie au mécanisme iid, qui est le vrai fil.
- L'indépendance ⇒ produit est la même hypothèse que celle du fil B (p02-01, pas 4) : le dire au pas 3 (C(n,k) pᵏ(1 − p)ⁿ⁻ᵏ vient du produit).
- Le TCL a été réussi à la calibration (Q17) : ne pas le redémontrer ici, pointer p00-04.

## Exclusions
Pas de fonction génératrice, pas de Gamma/Beta au-delà du nom, pas de binomiale négative au-delà du nom, pas de démonstration de la limite Binomiale → Poisson (la figure 2 la montre).
