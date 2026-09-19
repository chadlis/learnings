# Fiches ML/LLM — aucune dépendance, aucun build : juste la régénération de l'index.
PYTHON ?= python3

.DEFAULT_GOAL := index

## index : régénère index.html (et la version du cache du service worker)
index:
	@$(PYTHON) tools/build_index.py

## hooks : installe le hook pre-commit qui lance `make index` avant chaque commit
hooks:
	@git config core.hooksPath .githooks
	@echo "core.hooksPath = .githooks"

## test : graphe des prérequis (python), puis notes, service worker et déroulés dans un Chromium headless (playwright)
test:
	@$(PYTHON) tools/test_graph.py
	@sh tools/run_tests.sh

## anki : régénère anki/ancres.csv (tag → sheet → ancre, à coller dans le champ Extra)
anki:
	@$(PYTHON) tools/build_anki.py

## links : vérifie que tout href interne pointe sur un fichier et une ancre qui existent
links:
	@$(PYTHON) tools/check_links.py

## check : vérifie que l'index committé est bien à jour (utile en CI)
check:
	@$(PYTHON) tools/build_index.py
	@git diff --quiet -- index.html sw.js || { \
		echo "index.html/sw.js ne sont pas à jour : lance 'make index' et committe."; exit 1; }
	@echo "index à jour."

.PHONY: index hooks test anki links check
