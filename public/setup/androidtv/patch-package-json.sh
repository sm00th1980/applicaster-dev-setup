#!/usr/bin/env bash
set -euo pipefail

# 1) Create android folder
mkdir -p android

# 2) Update build:hermes:android in package.json
PACKAGE_JSON="${1:-package.json}"

if [[ ! -f "$PACKAGE_JSON" ]]; then
  echo "Error: $PACKAGE_JSON not found" >&2
  exit 1
fi

# macOS sed needs '' after -i; GNU sed does not
if sed --version >/dev/null 2>&1; then
  SED_INPLACE=(sed -i)
else
  SED_INPLACE=(sed -i '')
fi

"${SED_INPLACE[@]}" \
  's|"build:hermes:android": "node_modules/react-native/sdks/hermesc/osx-bin/hermesc --emit-binary --out android/main.hbc android/main.jsbundle"|"build:hermes:android": "node_modules/react-native/sdks/hermesc/osx-bin/hermesc --emit-binary --out android/main.hbc development-app/android/main.jsbundle"|' \
  "$PACKAGE_JSON"

echo "Created android/ and updated $PACKAGE_JSON"