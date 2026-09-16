Produis la sheet décrite par le spec `$ARGUMENTS` avec le skill `sheet-chain`.

Déroulé, sans sauter d'étape :
1. Lis `specs/$ARGUMENTS` (accepte un id `p01-02` ou un nom de fichier). Statut `ready` obligatoire ; sinon arrête-toi et dis pourquoi.
2. Lis `.claude/skills/sheet-chain/SKILL.md`, le gold standard `sheets/chains/chain-p03-01-critere-escalier-vs-sensible.html`, `template.html`, `assets/sheetlib.js`.
3. Vérifie par un script Python chaque nombre de l'exemple fil rouge du spec. Si un chiffre du spec est faux, corrige-le dans le spec **et** note-le sous `## Questions pour la revue`.
4. Écris la sheet au chemin déduit du spec. Une seule sheet.
5. `python3 tools/validate_sheet.py <chemin> --render` jusqu'à 0 FAIL ; regarde les captures dark/light ; corrige ce qui se chevauche ou déborde.
6. `python3 tools/build_index.py`.
7. Passe le spec au statut `built`. Commit `feat(sheet): <id> <titre>`.
8. Réponds en 5 lignes : chemin, figures produites, ce que tu n'as pas pu adresser du bloc « Ce qui a cassé pour Salah », questions pour la revue.
