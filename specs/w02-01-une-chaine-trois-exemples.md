---
id: w02-01
series: walkthrough
part: "02"
number: "01"
slug: une-chaine-trois-exemples
title: Une chaîne, trois exemples (D4)
subtitle: fil B, de la vraisemblance à la pénalité — déroulé existant
prereq: [p02-01]
anki: [stats::vraisemblance, stats::regularisation]
bridges: []
next: p03-01
status: built
---
Existant : `sheets/walkthroughs/walkthrough-p02-01-une-chaine-trois-exemples.html` (ex-`walkthrough-d04-…`, 12 marches + synthèse). Spec de registre créé pendant l'installation de la refonte : le fichier était renommé par le prompt général (part 02, number 01, prereq `p02-01`, anki `stats::vraisemblance,stats::regularisation`) mais aucun spec ne le déclarait, donc ni l'index ni la carte ne le voyaient. Contenu inchangé.

## Questions pour la revue

- Le prompt général d'installation nommait `walkthrough-p02-01-…` sans prévoir de spec `w02-01` ; ce fichier comble le trou avec exactement les valeurs dictées. À confirmer : `next: p03-01` (le déroulé se termine sur la pénalité, la suite naturelle est le fil C) — c'est la seule valeur qui n'était pas donnée.

## Révision v2 (21/09/2026)

Delta rédigé par Claude en séance à la demande de Salah, dans le sillage de la révision v3 de p02-01 (voir `specs/p02-01-bruit-vraisemblance-loss.md`, « Révision v3 »). Contenu inchangé hors quatre retouches de texte, aucune marche ajoutée, aucun chiffre modifié, gabarit `nav.echelle` conservé :
- Ex. 1 pas 1 : « seul endroit où l'on suppose quelque chose » → « seul endroit où l'on suppose une loi sur les données ; l'indépendance, seconde hypothèse, n'autorise que le produit ». Écriture équivalente y_i | x_i ~ N(f(x_i ; β), σ²) ajoutée, avec la remarque « famille de position, f ne fait que translater, donc le bruit se sépare ».
- Ex. 2 pas 1 : « pas de ε à séparer : Bernoulli dont f règle la probabilité, dispersion p(1 − p) déduite ; cas général, l'exemple 1 était le cas particulier » ; application : y_i − p_i vaut −p_i ou 1 − p_i, loi dépendant de x_i.
- Note de marge « Deux hypothèses, pas plus » → « Deux lois supposées, pas plus … plus l'indépendance ».
- Synthèse, ligne 6, colonne Bernoulli : « log-loss (cross-entropy binaire) ».
- Version : meta `status=v2`, titre suffixé « · v2 ». Pas de footer dans ce gabarit, rien à y écrire.
