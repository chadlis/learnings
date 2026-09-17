---
id: b04
series: bridge
part: "B"
number: "04"
slug: variance-moyenne-correlee
title: La variance d'une moyenne corrélée
subtitle: pont — ρσ² + (1 − ρ)σ²/B : pourquoi « plus » ne suffit pas quand c'est corrélé
prereq: [p00-02, p00-04, p07-02, p06-02, p01-05]
anki: [ml::bagging, stats::variance, ml::validation, stats::bootstrap]
bridges: []
next: b05
status: reviewed
---
## Le mécanisme
B variables de même variance σ², corrélées deux à deux par ρ. Var de la moyenne = (1/B²)·[B·σ² + B(B − 1)·ρσ²] = σ²/B + (B − 1)ρσ²/B = **ρσ² + (1 − ρ)σ²/B**. Quand B → ∞, il reste ρσ² : un plancher que moyenner ne franchit pas. Dérivé une fois ici, utilisé partout.

## La table
| lieu | les B termes | ρ | le plancher | ce qu'on fait | où |
|---|---|---|---|---|---|
| Bagging / RF | B arbres sur des bootstraps | ρ entre arbres (forte si mêmes features dominent) | ρσ² : ajouter des arbres ne le baisse pas | m features par split pour baisser ρ | p07-02 |
| LOOCV | n estimations d'erreur | quasi 1 (modèles presque identiques) | la moyenne des n erreurs a une variance élevée | k-fold à k = 5–10 | p06-02 |
| SE d'une moyenne | n lignes | > 0 si même utilisateur, série temporelle | σ²/n est trop optimiste | grouper, bloc, effectif « effectif » | p00-04 casse ; p01-01 casse |
| Bootstrap | rééchantillons | dépendance entre lignes ignorée | SE_boot trop petit | bootstrap par bloc / par groupe | p01-05 casse |
| Moyenne d'ensembles de modèles | K modèles différents | plus faible si les modèles diffèrent | diversité = ρ bas | modèles hétérogènes | p07-02 |

## Figure exigée
- **Figure 1 — `plot` + `slider` ρ ∈ [0, 0,9]** : Var(moyenne)/σ² en fonction de B ∈ [1, 200] (axe x log) ; ligne horizontale ρ (le plancher) ; courbes pour ρ = 0 (tend vers 0) et la valeur du slider. Readout à B = 10, 100, ∞. Légende : à ρ = 0,5, cent arbres valent à peine mieux que dix.

## Ce qui casse partout de la même façon
- Compter B sans regarder ρ : « plus d'arbres », « plus de lignes », « plus de rééchantillons » sans effet dès que ρ domine.
- Estimer ρ est difficile ; on le baisse par construction (features aléatoires, blocs, groupes) plutôt que de le mesurer.

## Résumé
1. Var(moyenne de B corrélés) = ρσ² + (1 − ρ)σ²/B ; plancher ρσ².
2. Bagging : baisser ρ (m features) plutôt que monter B ; LOOCV : ρ ≈ 1 ⇒ k-fold ; SE et bootstrap : grouper.
3. Moyenner réduit la variance seulement de la part non corrélée.

**Phrase d'entretien** : « La variance d'une moyenne de B termes corrélés est ρσ² plus (1 − ρ)σ²/B : le second terme s'éteint avec B, le premier jamais. C'est pourquoi une forêt aléatoire tire des features au hasard pour baisser ρ, pourquoi la LOOCV a une variance élevée, et pourquoi le SE de lignes dépendantes est trop optimiste. »

## Chaîne verbalisée
1. Dérive Var(moyenne) pour B termes corrélés. → B variances + B(B − 1) covariances, sur B² ⇒ ρσ² + (1 − ρ)σ²/B.
2. Même argument, autre habit : pourquoi la forêt tire m features ? → Baisser ρ ; B ne suffit pas.
3. Pourquoi la LOOCV a une variance élevée ? → n modèles quasi identiques, ρ ≈ 1.
4. Que fait-on d'un SE sur des lignes d'un même utilisateur ? → Grouper ou bloquer ; σ²/n est faux.

## Ce qui a cassé pour Salah
- Le 37 % OOB (p01-05 pas 4, p07-02) et cette formule sont les deux endroits où le bootstrap et le bagging se rejoignent : le dire en une ligne.

## Questions pour la revue
- **Aucun chiffre du spec n'était faux.** Le seul nombre explicite — « à ρ = 0,5, cent
  arbres valent à peine mieux que dix » — est vérifié : 0,550 à B = 10 contre 0,505 à
  B = 100, plancher 0,500. Tous les chiffres de la sheet sont calculés par script.
- **Doublon de table avec b03.** `b03` pas 6 porte déjà une table ρ × B pour une forêt
  (ρ = 0,6 / 0,3 / 0,1 / 0, avec B = 10 / 100 / 500). `b04` pas 3 en donne une autre
  (ρ = 0,5 / 0,05, avec B = 10 / 100) pour ne pas la recopier, mais les deux décrivent
  le même objet avec des ρ différents. **Tranché en revue 4** : doublon assumé, les ponts
  se recoupent — b03 illustre le compromis, b04 le plancher.
- **Les ρ du pas 4 (0,4 en k-fold, 0,9 en LOOCV) sont des hypothèses de lecture**, repris
  tels quels de `b03` pas 5 pour que les deux sheets restent comparables. La sheet le dit
  deux fois (pas 4 et limite 2), mais un chiffre non mesuré reste un chiffre à surveiller.
  **Validé en revue 4.**
- **Ajout hors spec, validé en revue 4** : la borne ρ ≥ −1/(B − 1), quatrième limite du pas 6.
  Elle ferme la porte à « et si on rendait les termes anti-corrélés ? », une question que
  la formule appelle naturellement et que le spec ne traitait pas.
- **Taille du fil rouge du pas 5** : le spec ne fixait pas de dimensions pour le SE groupé.
  Choix retenu : 1 000 lignes = 50 utilisateurs × 20, ρ = 0,2, pour que la figure 2 tire
  exactement la même expérience que la table (effet de grappe 4,80, n_eff = 208, SE × 2,19).
  **Validé en revue 4.**

**Arbitrage de revue 4, 17/09 — validé 17/09.** Doublon de table avec b03 **assumé** — les ponts se recoupent, b03 porte le compromis et b04 le plancher. Borne ρ ≥ −1/(B − 1) **validée**. ρ du pas 4 et fil rouge du SE groupé **validés**. Statut `reviewed`.
