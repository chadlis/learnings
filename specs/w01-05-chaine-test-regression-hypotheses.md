---
id: w01-05
series: walkthrough
part: "01"
number: "05"
slug: chaine-test-regression-hypotheses
title: La chaîne du test en régression, hypothèse par hypothèse
subtitle: fil A — huit marches sur cinq points ; à chaque ligne, la règle et l'hypothèse qui servent, et rien de plus
prereq: [p01-03, p01-02, p01-01, p05-01]
anki: [stats::inference, stats::estimation, ml::regression-lineaire, stats::pvalue, stats::procedure]
bridges: [b02, b03]
next: p02-01
status: reviewed
---

## Pourquoi ce déroulé existe
Séance du 17/09 : la chaîne 1 → 8 a été tenue, mais en justifiant trop (la normalité invoquée là où seule E[ε] = 0 servait), en mélangeant deux règles dans une ligne, en laissant la colonne ALÉATOIRE sans ses estimateurs, et en glissant entre l'objet aléatoire et sa réalisation. Ce déroulé refait la chaîne avec un **registre d'hypothèses** : chaque ligne porte le nom de la règle et de l'hypothèse qu'elle consomme, et le registre final dit quelle hypothèse a servi à quoi. C'est l'exercice d'entretien tel quel : « quelle hypothèse casse quoi ».

## Format
Une colonne de marches, chaque marche = règle (R1…R5 nommées) + hypothèse consommée (H0–H4 nommées) + calcul sur le fil rouge. Un registre en bas. Un second exemple (deux modèles A/B) rejoue seulement les marches 1–3 pour les trois colonnes. `SL.stepper` sur les marches.

## Les règles et hypothèses, nommées une fois en tête
Règles (p00-02) : **R1** E[c] = c ; **R2** E linéaire, E[Σ aᵢXᵢ] = Σ aᵢE[Xᵢ] (aucune hypothèse) ; **R3** Var(c + X) = Var(X) ; **R4** Var(aX) = a²Var(X) ; **R5** Var(ΣXᵢ) = ΣVar(Xᵢ) **si indépendants**.
Hypothèses : **H0** modèle linéaire juste, y = β₀ + β₁x + ε, x fixés ; **H1** E[εᵢ] = 0 (à X aléatoire : E[ε | X] = 0, exogénéité) ; **H2** Var(εᵢ) = σ², la même pour tous ; **H3** εᵢ indépendants ; **H4** εᵢ gaussiens.

## Fil rouge
n = 5, x = (1, 2, 3, 4, 5), vrais β₀ = 1, β₁ = 2, σ = 1. Un tirage : ε = (1,4 ; −1,1 ; −0,2 ; −0,8 ; 1,5), y = (4,4 ; 3,9 ; 6,8 ; 8,2 ; 12,5). x̄ = 3, S_xx = 10, wᵢ = (xᵢ − 3)/10.
β̂₁ = 2,05, β̂₀ = 1,01. Résidus → RSS = 5,947 ; σ̂² = RSS/(n − 2) = 1,982 ; σ̂ = 1,41 ; SE = σ̂/√S_xx = 0,445 (vrai SE = 1/√10 = 0,316 : on ne le connaît pas, on l'estime). t = 2,05/0,445 = 4,60 ; ddl = 3 ; seuil bilatéral 5 % = 3,18 ; p = 0,019 ; IC95 = 2,05 ± 3,18·0,445 = [0,63 ; 3,47].

## Marches
1. **Les trois colonnes** (p01-01, définition de la revue 4). FIXE : β₀, β₁, σ², les xᵢ (posés fixes). ALÉATOIRE : les εᵢ, donc les yᵢ, donc **tout ce qu'on calcule dessus** : β̂₁, β̂₀, σ̂², SE, t, p, l'IC. PROCÉDURE : « tirer les ε, ajuster par OLS, calculer t, comparer au seuil, reporter ». Piège : la colonne ALÉATOIRE ne contient pas que la source de l'aléa ; elle contient les estimateurs. Au tableau : « Les ε sont tirés, donc les y le sont, donc toute fonction des y est aléatoire, donc les estimateurs sont dans la colonne aléatoire, pas seulement le tirage. »
2. **Aléatoire ≠ réalisé.** β̂₁ est une variable aléatoire ; 2,05 est **sa réalisation sur ce tirage**. Les nombres 2,05 ; 0,445 ; 4,60 ; 0,019 ne vont dans aucune colonne : ce sont des valeurs prises, pas des objets. Écrire β̂₁ = 2,05 est un raccourci ; la phrase juste est « sur ce tirage, β̂₁ vaut 2,05 ». Au tableau : « L'objet est la règle appliquée au tirage, le nombre est ce qu'elle a donné cette fois, donc les nombres n'ont ni espérance ni variance, donc ils ne sont dans aucune colonne. »
3. **β̂₁ est linéaire dans les bruits** (H0). β̂₁ = Σwᵢyᵢ = Σwᵢ(β₀ + β₁xᵢ + εᵢ) = β₁ + Σwᵢεᵢ, parce que Σwᵢ = 0 et Σwᵢxᵢ = 1. Une seule hypothèse consommée : le modèle est le bon (H0). Rien sur ε.
4. **Le centre : E[β̂₁] = β₁** — consomme **H1 seulement**. Ligne 1 : E[β̂₁] = E[β₁] + Σ E[wᵢεᵢ] (R2). Ligne 2 : = β₁ + Σ wᵢE[εᵢ] (R1 pour β₁, R2 pour sortir wᵢ fixe — deux règles, à nommer toutes les deux). Ligne 3 : = β₁ car E[εᵢ] = 0 (H1). **Ni la variance, ni la normalité, ni l'indépendance n'ont servi.** Casse : une variable omise corrélée à x (la saison) entre dans ε ⇒ E[ε | X] ≠ 0 ⇒ biais, que plus de données ne corrigent pas. Au tableau : « Les wᵢ sont fixes, donc E[β̂₁] = β₁ + ΣwᵢE[εᵢ] ; H1 annule la somme, donc β̂₁ est sans biais ; seule H1 a servi, donc une variable omise corrélée à x suffit à le biaiser. »
5. **La largeur : Var(β̂₁) = σ²/S_xx** — consomme **H2 et H3**. Ligne 1 : Var(β̂₁) = Var(Σwᵢεᵢ) (R3 : β₁ est fixe). Ligne 2 : = Σ Var(wᵢεᵢ) (R5, **H3** indépendance). Ligne 3 : = Σ wᵢ²Var(εᵢ) (R4). Ligne 4 : = σ² Σwᵢ² = σ²/S_xx (**H2** même variance). SE = σ/√S_xx = 0,316. Ce que le centre n'utilisait pas : H2 et H3. Toujours pas H4. Au tableau : « β₁ est fixe donc ne compte pas dans la variance ; les ε sont indépendants donc les variances s'ajoutent ; chacune vaut σ² donc il reste σ²Σwᵢ², c'est-à-dire σ² sur l'étalement des x. »
6. **σ inconnu : σ̂² = RSS/(n − 2)** (p01-03 pas 3). Les résidus vérifient deux contraintes (Σrᵢ = 0, Σrᵢxᵢ = 0), donc ils ont n − 2 degrés de liberté ; diviser par n sous-estimerait σ². Sur le tirage : 5,947/3 = 1,982, σ̂ = 1,41, SE estimé 0,445 — loin du vrai 0,316, parce que n = 5. Hypothèses consommées : H1–H3 (pour que E[σ̂²] = σ²). Correction de la séance : c'est bien n − 2, pas n.
7. **La forme : t = β̂₁/SE ~ Student(3) sous H₀ : β₁ = 0** — consomme **H4** (ou n grand via TCL). Numérateur normal (H4 : combinaison linéaire de gaussiennes ; sans H4, TCL à n grand), dénominateur estimé qui fluctue ⇒ Student, ddl = n − 2 = 3. **i.i.d. se sépare** : indépendance (H3) sert à R5 et au Student ; « identiquement distribué » sert à H2 (même σ²) ; ce sont deux hypothèses, pas une. Au tableau : « Le numérateur est normal par H4, le dénominateur est estimé donc fluctue, donc le quotient a des queues plus lourdes, donc Student à n − 2 degrés de liberté ; sans H4, la normale ne revient qu'à grand n par le TCL. »
8. **Décider : p-value, seuil, IC** (p01-02). t = 4,60 > 3,18 ⇒ rejet à 5 % ; p = 0,019 = P(|T₃| ≥ 4,60 | β₁ = 0). **Lien p ↔ seuil** : rejeter à α ⇔ p < α ⇔ |t| > t_α ⇔ 0 ∉ IC_{1−α} : quatre lectures d'un seul calcul. **Piège (b)** : p = 0,019 n'est pas P(β₁ = 0 | données) ni « 98 % de chances que β₁ ≠ 0 » — β₁ est en colonne FIXE. IC = [0,63 ; 3,47] : centré sur 2,05, largeur 3,18·0,445 ; contient 2 (le vrai), sans qu'on le sache. Au tableau : « Sous H₀ le centre est zéro et la largeur est SE, donc la p-value est l'aire au-delà de |t| ; rejeter à α, p < α, |t| > t_α et zéro hors de l'IC sont la même inégalité, donc quatre phrases pour un calcul, et aucune n'est une probabilité sur β₁. »

## Second exemple (marches 1–3 seulement)
Deux modèles A = 90 %, B = 91 % sur le même test set de n lignes. FIXE : p_A, p_B, D = p_B − p_A, et les modèles eux-mêmes (déjà entraînés). ALÉATOIRE : le test set, donc p̂_A, p̂_B, D̂ = p̂_B − p̂_A. PROCÉDURE : « tirer n lignes, évaluer A et B dessus, reporter D̂ et conclure ». Les nombres 90 % et 91 % : réalisations, aucune colonne. « Si je tirais un autre test set » : p̂_A, p̂_B, D̂ bougent ; p_A, p_B, D, les modèles ne bougent pas. Renvoi p01-04 pour la suite (appariement, D = B − A).

## Le registre des hypothèses (le résultat du déroulé)
| conclusion | consomme | ne consomme pas | ce qui la casse |
|---|---|---|---|
| β̂₁ = β₁ + Σwᵢεᵢ | H0 | tout le reste | modèle faux (non-linéarité) |
| E[β̂₁] = β₁ (sans biais) | H1 | H2, H3, H4 | variable omise corrélée à x |
| Var(β̂₁) = σ²/S_xx | H2, H3 | H1 (pour la valeur), H4 | hétéroscédasticité, dépendance |
| σ̂² = RSS/(n − 2) sans biais | H1, H2, H3 | H4 | idem |
| t ~ Student(n − 2) exactement | H4 | — | non-gaussien à petit n (à grand n : TCL) |
| p, seuil, IC | tout ce qui précède | — | multiplicité, procédure qui regarde le tirage (b02) |

## Figures exigées
- **Figure 1 — `stepper`** sur les huit marches ; chaque marche affiche en marge deux badges : « règle : R… » et « hypothèse : H… », les hypothèses non consommées grisées. Légende : lis les badges, c'est la réponse à « quelle hypothèse sert ici ».
- **Figure 2 — `repeat`** : draw = β̂₁ sur un nouveau tirage de ε (n = 5, σ = 1) ; bins [0,5 ; 3,5 ; 30] ; marques β₁ = 2 et « ce tirage : 2,05 » ; readout écart-type mesuré ≈ 0,316. Bouton « n = 50 » : la cloche se resserre. Légende : 2,05 est un point de cet histogramme ; l'histogramme est l'objet.
- **Figure 3 — `plot`** : le registre en grille interactive : cliquer une hypothèse (H1…H4) surligne les conclusions qui tombent avec elle. Légende : H1 casse le centre ; H2–H3 cassent la largeur ; H4 ne casse que la forme exacte.

## Petits cas 3 (à relier à p01-04 pas 6 et b02)
Deux procédures qui regardent le tirage pour décider, vues ce matin : choisir H₁ unilatérale **après** avoir vu le signe de β̂₁ (double le taux de faux positifs) ; relever α **après** avoir vu p. Même mécanisme que le biais du max : la procédure n'est plus écrite d'avance, donc la loi de ce qu'elle produit n'est plus celle qu'on croit.

## Chaîne verbalisée
1. Nomme les trois colonnes pour une régression, estimateurs compris. → FIXE β, σ², x ; ALÉATOIRE ε, y, β̂, σ̂², t, p ; PROCÉDURE tirer → OLS → t → seuil → reporter.
2. Où vont 2,05 et 0,019 ? → Nulle part : réalisations, pas objets.
3. Quelle hypothèse seule donne le non-biais, et qu'est-ce qui le casse ? → H1 (E[ε] = 0) ; variable omise corrélée à x.
4. Quelles hypothèses donnent σ²/S_xx, et pourquoi i.i.d. est deux hypothèses ? → H3 (indépendance, R5) et H2 (même σ²) ; l'une sert à additionner, l'autre à factoriser.
5. À quoi sert la normalité, et que fait-on sans ? → Au Student exact ; sans, TCL à grand n.
6. Écris les quatre lectures équivalentes d'un rejet à α. → p < α ⇔ |t| > t_α ⇔ 0 ∉ IC_{1−α} ⇔ rejet ; aucune n'est P(β₁ = 0 | données).

## Ce qui a cassé pour Salah (17/09)
- ALÉATOIRE sans les estimateurs (« le test set » seul) — marche 1, et le second exemple qui refait exactement la question de la séance.
- Normalité invoquée pour E[ε] = 0 (justification trop forte) — marche 4 ; le registre entier est construit contre ça.
- Deux règles (R1 + R2) dans une ligne sans les nommer — marche 4, lignes séparées.
- Glissement aléatoire/réalisé (β̂₁ « = 2,05 ») — marche 2.
- i.i.d. à séparer — marche 7.
- Piège (b) de la p-value, lien p ↔ seuil — marche 8.
- σ̂² = RSS/(n − 2), corrigé en séance — marche 6.
- « Fil B non acquis » : ce déroulé ne touche pas au fil B ; noter seulement au registre que « OLS = MLE » consomme H4 (p02-01).
- Cas 3 reporté : les deux « petits cas 3 » sont consignés ici et dans p01-04, pour que la séance des quatre marches les trouve.

## Exclusions
Pas de test F, pas de X aléatoires au-delà de l'exogénéité nommée, pas de SE robustes, pas de dérivation de E[σ̂²] = σ² (dire les deux contraintes, c'est tout).

## Questions pour la revue
- **Aucun chiffre du spec n'était faux.** Tous vérifiés par script : y, x̄ = 3, S_xx = 10, w, β̂₁ = 2,05, β̂₀ = 1,01, résidus (1,34 ; −1,21 ; −0,36 ; −1,01 ; 1,24), RSS = 5,947, σ̂² = 1,9823, σ̂ = 1,4080, SÊ = 0,44523, SE vrai = 0,31623, t = 4,6043, t_{0,975 ; 3} = 3,18245, p = 0,019264, IC = [0,6331 ; 3,4669]. Rien à corriger.
- **Format.** Le spec et le CLAUDE.md décrivent un déroulé avec rail `nav.echelle` et `<figure>` (format « papier » des déroulés p01-01…p02-01). La sheet suit le standard « tableau noir v5 » des déroulés produits par le skill (p01-04, p03-01) : `aside.side` + `div.fig` + `assets/sheetlib.js`, parce que `tools/validate_sheet.py` l'exige (`#prereq`, `#hyp`, `.chain`, `div.step id="sN"`, `card apply`, `card casse`, `div.fig id="figN"`, `#resume`, `#verbal`, `#links`, `.phrase`). `tools/test_walkthroughs.mjs` accepte les deux rails. **À trancher : mettre à jour le tableau « les deux genres » du CLAUDE.md, ou refaire passer les anciens déroulés au standard v5 ?**
- **Figure 1 du spec.** Le `stepper` sur les huit marches est livré comme `SL.stepper` sur `.chain` + deux badges (« règles » / « hypothèses », non consommées barrées) en marge de chaque marche — pas comme un `div.fig` : une figure doit produire du SVG au clic (`test_walkthroughs.mjs`), ce que le stepper ne fait pas. Les trois `div.fig` sont donc : les trois colonnes en action (nouveau tirage des ε), l'histogramme `repeat` de β̂₁ (figure 2 du spec), et la simulation « hypothèse cassée » (figure 3 du spec, promue de grille statique à simulation : les boutons surlignent les lignes du registre *et* redessinent l'histogramme).
- **Nuance sur H3, mesurée.** Avec des ε en AR(1) φ = 0,8, la dépendance **rétrécit** la loi de β̂₁ (écart-type 0,278 contre 0,316) pendant que la couverture de l'IC₉₅ tombe à 79 %. « H2–H3 cassent la largeur » est donc à lire « cassent l'égalité Var(β̂₁) = σ²/S_xx », pas « élargissent ». La figure 3 et sa légende le disent ; le registre garde la formulation du spec. Valeurs mesurées (200 000 tirages) : vrai 2,000/0,316/95,0 % · H1 2,500/0,353/82,8 % · H2 (σ = 2 ; 0,5 ; 0,5 ; 0,5 ; 2) 2,000/0,570/87,9 % · H3 2,000/0,279/79,1 % · H4 (Student(3) normalisée) 2,000/0,312/95,5 %.
- **Un `.card.large` ajouté** (`grid-column:1 / -1`) pour que le registre, à quatre colonnes, prenne toute la largeur du pas au lieu d'être serré dans la colonne de droite (405 px) et de défiler. Même geste que `.step .fig`.

**Arbitrage de revue 5, 17/09 — validé 17/09.** Aucun chiffre du spec n'était faux.
**Nuance H3 validée** : en AR(1) φ = 0,8 la dépendance **rétrécit** la loi de β̂₁ (0,279
contre 0,316) pendant que la couverture tombe à 79 % — « H2–H3 cassent la largeur » se lit
donc « cassent l'égalité Var = σ²/S_xx », **pas « élargissent »**. Classe `.card.large`
**validée**. Question de format **tranchée hors de ce spec** : le tableau « les deux genres »
du `CLAUDE.md` dit désormais que les déroulés neufs suivent le standard tableau noir v5
(celui qu'impose `validate_sheet.py`) et que seuls les quatre anciens, D1–D4, sont en
`nav.echelle`. Les deux « petits cas 3 » sont maintenant consignés **aussi** dans
`chain-p01-04` (pas 6) et dans `bridge-02` (lieu 4), comme le spec le demandait.
Statut `reviewed`.
