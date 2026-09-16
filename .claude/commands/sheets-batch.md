Produis en série toutes les sheets dont le spec est `ready` dans la partie `$ARGUMENTS` (ex. `01`, `02`, `03`, `B`, `09`), une par sous-agent à contexte frais, dans l'ordre des numéros.

Pour chaque spec `ready` de la partie :
- lance un sous-agent avec l'instruction exacte de `/sheet <id>` (il lit lui-même le skill, le gold standard, le template, la lib) ;
- attends son commit ;
- vérifie toi-même `python3 tools/validate_sheet.py <chemin>` (sans --render) avant de passer au suivant ;
- si un sous-agent échoue deux fois, note l'id et continue.

À la fin : `python3 tools/build_index.py`, un commit `chore(index): partie $ARGUMENTS`, puis un tableau id · chemin · FAIL/WARN · questions pour la revue. Ne produis jamais une sheet dont le spec est `stub`.

**Le statut d'un spec ne se change jamais de `stub` à `ready` par Claude Code ; seul Salah le fait en déposant un spec complet.** Un stub sauté se note dans le rapport, il ne se remplit pas.
