#!/bin/sh
# Lance tools/test_ratings.mjs sur un serveur local puis en file://.
# playwright est une dépendance de développement : si elle est absente, on saute.
set -e
racine=$(cd "$(dirname "$0")/.." && pwd)

if [ -z "$PLAYWRIGHT_PATH" ]; then
  for c in "$racine/node_modules/playwright" $HOME/.npm/_npx/*/node_modules/playwright; do
    [ -d "$c" ] && PLAYWRIGHT_PATH="$c" && break
  done
fi
if [ -z "$PLAYWRIGHT_PATH" ] || [ ! -d "$PLAYWRIGHT_PATH" ]; then
  echo "playwright introuvable — test sauté (npx playwright install chromium)"
  exit 0
fi
export PLAYWRIGHT_PATH

port=8777
python3 -m http.server "$port" --bind 127.0.0.1 --directory "$racine" >/dev/null 2>&1 &
srv=$!
trap 'kill $srv 2>/dev/null || true' EXIT
sleep 1

node "$racine/tools/test_ratings.mjs" "http://127.0.0.1:$port"
echo
node "$racine/tools/test_ratings.mjs" "file://$racine"
