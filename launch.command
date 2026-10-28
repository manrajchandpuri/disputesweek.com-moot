#!/bin/zsh
# Double-click in Finder to preview the IIDW Moot 2027 pages at /moot.
# The folder name contains a colon, which breaks npx and npm's .bin links,
# so Vite is started through node directly.

cd "${0:A:h}" || exit 1

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is not installed. Install it from https://nodejs.org and run this file again."
  read -k 1 "?Press any key to close."
  exit 1
fi

if [[ ! -d node_modules/vite ]]; then
  echo "Installing dependencies for the first time..."
  npm install --no-audit --no-fund || { read -k 1 "?Install failed. Press any key to close."; exit 1; }
fi

echo "Starting the moot preview. Press Control-C to stop it."
OPEN_FLAG=(--open /moot)
[[ -n "$MOOT_NO_OPEN" ]] && OPEN_FLAG=()
exec node node_modules/vite/bin/vite.js --config preview/vite.config.js "${OPEN_FLAG[@]}"
