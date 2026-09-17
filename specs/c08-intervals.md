---
id: c08
series: coding
part: "09"
number: "08"
slug: intervals
title: Intervals — trier par début, garder le dernier fusionné
subtitle: coding — après tri, un seul intervalle en cours suffit ; l'invariant porte sur la liste fusionnée
prereq: [c00]
anki: [coding::intervals, coding::balayage, coding::tri]
bridges: []
next: c09
status: built
---
## Signal
Des **segments** [début, fin] (réunions, réservations, plages), des questions de fusion, de chevauchement, de nombre de salles, de couverture. Contre-signal : segments sur un cercle ou en 2D (autre chose).

## Pattern
**Trier par début.** Ensuite un balayage gauche → droite ne compare chaque intervalle qu'au **dernier fusionné** : s'il commence avant la fin du dernier, il le prolonge (fin = max) ; sinon il en ouvre un nouveau. Le tri est ce qui rend « le dernier suffit » vrai.

## Squelette (merge, LC 56)
```
trier intervals par début
merged = []
pour (s, e) dans intervals :
    si merged et s <= merged[−1].fin : merged[−1].fin = max(merged[−1].fin, e)
    sinon : merged.append([s, e])
retour merged
```

## TAP
- **Invariant** : après avoir traité intervals[0:i), merged est **exactement** la fusion de ces i intervalles : disjoints, triés, et merged[−1] est celui qui finit le plus tard parmi eux (parce que les débuts sont croissants, tout chevauchement futur ne peut concerner que le dernier).
- **Variant** : n − i.
- **Conclusion** : donc à la sortie, merged est exactement la fusion de tous les intervalles.
- **Complexité** : tri O(n log n) + balayage O(n) ⇒ O(n log n) ; espace O(n) pour la sortie (O(1) en plus).

## Trace (figure 1)
intervals = [[1,3],[2,6],[8,10],[9,12],[15,18]] (déjà triés) : merged = [[1,3]] · [[1,6]] (2 ≤ 3, fin = max(3, 6)) · [[1,6],[8,10]] (8 > 6) · [[1,6],[8,12]] (9 ≤ 10) · [[1,6],[8,12],[15,18]]. `inv` = « merged = fusion exacte de [0:i) ; disjoints ; le dernier finit le plus tard ».

## Les variantes, une ligne chacune
- **Insérer un intervalle** (LC 57) : trois phases : avant (fin < nouveau.début), chevauchement (fusion en un seul), après.
- **Salles de réunion** (LC 253) : trier les débuts et les fins séparément, deux pointeurs ; ou min-heap des fins (c07) ; le maximum de réunions simultanées.
- **Intervalles non chevauchants à retirer** (LC 435) : trier par **fin**, glouton : garder celui qui finit le plus tôt.
- **Balayage d'événements** : +1 à chaque début, −1 à chaque fin, trier les événements (fin avant début à égalité), le maximum du compteur.

## Figures exigées
- **Figure 1 — SVG custom via `plot` (ligne de temps)** : les cinq intervalles en barres sur un axe 0–20, bouton « suivant » qui fusionne (la barre fusionnée s'allonge, la nouvelle s'ajoute), `inv` en texte. Légende : on ne compare qu'au dernier ; c'est le tri qui l'autorise.
- **Figure 2 — même SVG, LC 253** : réunions [[0,30],[5,10],[15,20]], compteur d'événements +1/−1 balayé ; maximum 2. Légende : trier débuts et fins séparément.

## Où ça casse
Sans tri, ou trié par fin pour la fusion : un intervalle peut chevaucher un fusionné **antérieur** au dernier ; le balayage rend une réponse fausse sans erreur. Pour LC 435 c'est l'inverse : trier par **fin**. Savoir dire lequel et pourquoi.

## Pièges Python
- `s < merged[-1][1]` au lieu de `<=` : [1,3] et [3,5] se touchent, à fusionner ou non selon l'énoncé — le lire.
- Muter les intervalles d'entrée en croyant travailler sur une copie.
- Événements à égalité de temps : fin avant début (une salle libérée est réutilisable) ou l'inverse selon l'énoncé.
- `sorted(intervals)` trie par début puis fin : suffisant pour merge, à dire.

## Résumé
1. Signal : segments, fusion, chevauchement, salles.
2. Trier par début ; comparer au dernier fusionné seulement ; fin = max.
3. Invariant : merged = fusion exacte de [0:i), disjoints, dernier finit le plus tard ; O(n log n).
4. Salles : débuts/fins séparés ou heap des fins ; retrait minimal : trier par fin.

**Phrase d'entretien** : « Je trie par début ; à partir de là chaque intervalle ne peut chevaucher que le dernier fusionné, donc un balayage suffit : je prolonge ou j'ouvre. L'invariant est que la liste fusionnée est exactement la fusion des intervalles traités, disjoints, le dernier finissant le plus tard. Pour compter des salles, je balaie les débuts et les fins ; pour retirer le minimum, je trie par fin et je garde ce qui finit le plus tôt. »

## Chaîne verbalisée
1. Pourquoi trier par début suffit à ne comparer qu'au dernier ? → Débuts croissants ⇒ tout chevauchement futur touche le dernier.
2. Invariant ? → merged = fusion exacte de [0:i), disjoints, dernier finit le plus tard.
3. Salles de réunion : deux méthodes. → Débuts/fins triés séparément ; heap des fins.
4. Quand trier par fin ? → Retrait minimal d'intervalles chevauchants (glouton par fin la plus tôt).

## Ce qui a cassé pour Salah
- Famille t09 : « trier par début, fusion, invariant "le dernier fusionné", balayage » — le point à dire est **pourquoi** le dernier suffit (le tri), pas seulement qu'il suffit.

## Questions pour la revue
- **Aucun chiffre du spec n'était faux** : la trace de la figure 1, le max de 2 salles
  de LC 253 et la conclusion `[[1,6],[8,12],[15,18]]` sont tous vérifiés par script
  (dont 200 000 tirages croisés fusion / union point par point, 0 désaccord, et
  100 000 tirages compteur d'événements / min-heap des fins, 0 désaccord).
- **Le fil rouge ne distingue pas les deux tris.** Sur `[[1,3],[2,6],[8,10],[9,12],[15,18]]`,
  trier par **fin** donne la *même* sortie que trier par début. Le « Où ça casse » a donc
  besoin d'un exemple à lui : la sheet utilise `[[1,10],[2,3],[4,5]]` (par début → `[[1,10]]`,
  par fin → `[[2,3],[4,10]]`). À confirmer que c'est bien le contre-exemple à mémoriser,
  ou faut-il changer le fil rouge pour qu'il porte les deux rôles ?
- **LC 57 : le spec ne donne pas de chiffres.** La sheet insère `[4,9]` dans la sortie
  fusionnée du fil rouge `[[1,6],[8,12],[15,18]]` → `[[1,12],[15,18]]`, ce qui réutilise
  le fil rouge au lieu d'ouvrir un second exemple. À valider.
- **Le tri domine en théorie, à peine en pratique.** À n = 10⁶ : tri 1,20 s contre 0,81 s
  pour le balayage, alors que les comparaisons disent 15× (`sorted()` est en C, la boucle
  en Python). La sheet le dit explicitement ; à trancher si cette nuance mérite d'y rester
  ou si elle brouille le message asymptotique attendu en entretien.
