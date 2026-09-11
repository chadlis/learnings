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

## check : vérifie que l'index committé est bien à jour (utile en CI)
check:
	@$(PYTHON) tools/build_index.py
	@git diff --quiet -- index.html sw.js || { \
		echo "index.html/sw.js ne sont pas à jour : lance 'make index' et committe."; exit 1; }
	@echo "index à jour."

.PHONY: index hooks check
