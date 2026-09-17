---
id: c10
series: coding
part: "09"
number: "10"
slug: prefixes-deque-monotone
title: Préfixes et deque monotone
subtitle: signal → pattern → invariant → complexité
prereq: [c00, c01]
anki: [coding::*]
bridges: []
next: 
status: stub
---
Périmètre : sommes préfixes + dictionnaire (LC 560), deque monotone (LC 239), quand la fenêtre glissante ne s'applique pas. C'est la sheet du contre-signal de c01 : dès qu'il y a des négatifs avec une somme cible, la condition n'est plus monotone en la taille, l et r ne suffisent plus, et il faut d'autres invariants — une somme préfixe et un dictionnaire, ou une deque qui tient les candidats par ordre décroissant.
Format coding : signal dans l'énoncé → pattern → squelette de l'invariant/variant (TAP) → `trace` animée sur un exemple de 6 à 12 cases → complexité (composition) → « Où ça casse » (le contre-signal) → pièges Python → cartes « signal → pattern » liées. Jamais la solution complète en clair : le squelette et la trace, le code est à lui.
