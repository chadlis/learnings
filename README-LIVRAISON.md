# Livraison du 16/09/2026 — refonte du site des fiches

Contenu du zip, à déposer à la racine de `chadlis/learnings` :

| chemin | rôle |
|---|---|
| `CLAUDE-CODE-PROMPT.md` | le prompt général, mode autonome (installation + toutes les parties `ready`, aucune question) |
| `.claude/skills/sheet-chain/` | le skill : SKILL.md, template.html, assets/sheetlib.js |
| `.claude/commands/` | `/sheet <id>`, `/sheets-batch <partie>`, `/sheets-all` |
| `assets/sheetlib.js` | primitives d'animation partagées (plot, slider, repeat, descent, trace, plane, stepper) |
| `tools/validate_sheet.py` | gate mécanique + rendu playwright (dark/light/mobile, erreurs JS) |
| `tools/build_index.py` | génère index.html et map.html depuis specs/ — remplace l'ancien |
| `specs/` | 63 specs : 9 `ready` (parties 1–3 + 2 déroulés), 4 `built` (pilote + D1–D3), 50 `stub` (squelette, à écrire dans le chat) |
| `sheets/chains/chain-p03-01-…html` | le pilote fil C, gold standard |
| `index.html`, `map.html` | exemple de sortie de build_index.py (seront régénérés) |

Ordre : installation (§ du prompt), puis `/sheets-batch 01`, revue dans le chat, `02`, `03`…
