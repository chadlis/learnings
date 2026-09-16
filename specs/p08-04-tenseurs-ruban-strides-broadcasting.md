---
id: p08-04
series: chain
part: "08"
number: "04"
slug: tenseurs-ruban-strides-broadcasting
title: Tenseurs — ruban, strides, view vs copie, broadcasting
subtitle: à écrire
prereq: []
anki: []
bridges: []
next: c00
status: stub
---
Périmètre : Mémoire = ruban, shape = grille ; strides ; view jamais de copie ; axis=k consommé ; keepdims ; alignement par la droite ; masques. Figure : ruban de 24 cases redécoupé en direct par reshape/transpose. Cassé pour Salah : view(-1,k), keepdim, x[:, ::2] (16/09) — les tenseurs comme vues sur une mémoire typée, pas comme objets mathématiques.
