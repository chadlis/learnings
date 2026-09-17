---
id: p07-03
series: chain
part: "07"
number: "03"
slug: boosting
title: Gradient boosting — une descente dans l'espace des fonctions
subtitle: à écrire
prereq: [p03-02, p07-01]
anki: []
bridges: []
next: p07-04
status: stub
---
Périmètre : F_M = F₀ + ν Σ h_m ; cible = gradient de la loss au modèle cumulé (résidus si MSE) ; arbres peu profonds = biais ; ν = régularisation ; RF vs GB. Figure : résidus qui s'effacent arbre après arbre. Cassé pour Salah : Q12.1 (gradient de la loss, pas résidus de l'arbre précédent).

## Convention
Ici le ½ est gardé pour que le pseudo-résidu soit le résidu ; le facteur est absorbé
par ν sinon. Tranché en revue 4 ; b01 pas 4 écrit déjà la loss du boosting avec le ½.
