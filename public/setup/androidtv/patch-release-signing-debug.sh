#!/usr/bin/env bash
# Patch app/build.gradle: use debug keystore for release buildType.
#
# In buildTypes { release { ... } }, replaces:
#   signingConfig signingConfigs.release
# with:
#   signingConfig signingConfigs.debug
#
# Usage:
#   ./scripts/patch-release-signing-debug.sh
#   ./scripts/patch-release-signing-debug.sh /path/to/app/build.gradle
#   ./scripts/patch-release-signing-debug.sh --restore

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
DEFAULT_BUILD_GRADLE="${PROJECT_ROOT}/app/build.gradle"

FROM='signingConfig signingConfigs.release'
TO='signingConfig signingConfigs.debug'

usage() {
  cat <<EOF
Usage: $(basename "$0") [OPTIONS] [BUILD_GRADLE]

Options:
  --restore   Revert release buildType to signingConfigs.release
  -h, --help  Show this help

Default BUILD_GRADLE: ${DEFAULT_BUILD_GRADLE}
EOF
}

restore=false
build_gradle=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --restore)
      restore=true
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    -*)
      echo "Unknown option: $1" >&2
      usage >&2
      exit 1
      ;;
    *)
      build_gradle="$1"
      shift
      ;;
  esac
done

build_gradle="${build_gradle:-$DEFAULT_BUILD_GRADLE}"

if [[ ! -f "$build_gradle" ]]; then
  echo "Error: file not found: $build_gradle" >&2
  exit 1
fi

if [[ "$restore" == true ]]; then
  FROM='signingConfig signingConfigs.debug'
  TO='signingConfig signingConfigs.release'
fi

tmp="$(mktemp)"
trap 'rm -f "$tmp"' EXIT

awk -v from="$FROM" -v to="$TO" '
  /buildTypes[[:space:]]*\{/ { in_build_types = 1 }
  in_build_types && /^[[:space:]]*release[[:space:]]*\{/ { in_release = 1 }
  in_release && index($0, from) {
    sub(from, to)
    changed = 1
  }
  in_release && /^[[:space:]]*\}/ { in_release = 0 }
  { print }
  END {
    if (!changed) {
      print "patch-release-signing-debug: no change in release buildType (already patched or pattern missing)" > "/dev/stderr"
      exit 2
    }
  }
' "$build_gradle" > "$tmp"

mv "$tmp" "$build_gradle"
trap - EXIT

echo "Updated: $build_gradle"
echo "  ${FROM} -> ${TO}  (inside buildTypes/release only)"
