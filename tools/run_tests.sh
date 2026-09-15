#!/bin/sh
# Lance les tests (notes, service worker, déroulés) sur un serveur local
# puis en file://.
# playwright est une dépendance de développement : si elle est absente, on saute.
set -e
root=$(cd "$(dirname "$0")/.." && pwd)

if [ -z "$PLAYWRIGHT_PATH" ]; then
  for c in "$root/node_modules/playwright" $HOME/.npm/_npx/*/node_modules/playwright; do
    [ -d "$c" ] && PLAYWRIGHT_PATH="$c" && break
  done
fi
if [ -z "$PLAYWRIGHT_PATH" ] || [ ! -d "$PLAYWRIGHT_PATH" ]; then
  echo "playwright introuvable — test sauté (npx playwright install chromium)"
  exit 0
fi
export PLAYWRIGHT_PATH

port=8777
python3 -m http.server "$port" --bind 127.0.0.1 --directory "$root" >/dev/null 2>&1 &
srv=$!
trap 'kill $srv 2>/dev/null || true' EXIT
sleep 1

node "$root/tools/test_ratings.mjs" "http://127.0.0.1:$port"
echo
node "$root/tools/test_pwa.mjs" "http://127.0.0.1:$port"
echo
node "$root/tools/test_ratings.mjs" "file://$root"

echo
node "$root/tools/test_walkthroughs.mjs" "http://127.0.0.1:$port"
echo
node "$root/tools/test_walkthroughs.mjs" "file://$root"
