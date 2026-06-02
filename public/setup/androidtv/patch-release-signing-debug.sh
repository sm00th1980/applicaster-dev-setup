#!/usr/bin/env bash
# Patch app/build.gradle: use debug keystore for release buildType.
#
# In buildTypes { release { ... } }, replaces:
#   signingConfig signingConfigs.release
# with:
#   signingConfig signingConfigs.debug
#
# If already in the desired state, exits 0 without modifying the file.
#
# Usage:
#   ./patch-release-signing-debug.sh
#   ./patch-release-signing-debug.sh /path/to/app/build.gradle
#   ./patch-release-signing-debug.sh --restore

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}" && pwd)"
DEFAULT_BUILD_GRADLE="${PROJECT_ROOT}/app/build.gradle"

RELEASE_SIGNING='signingConfig signingConfigs.release'
DEBUG_SIGNING='signingConfig signingConfigs.debug'

usage() {
  cat <<EOF
Usage: $(basename "$0") [OPTIONS] [BUILD_GRADLE]

Options:
  --restore   Revert release buildType to signingConfigs.release
  -h, --help  Show this help

Default BUILD_GRADLE: ${DEFAULT_BUILD_GRADLE}
EOF
}

get_release_signing_line() {
  awk '
    /buildTypes[[:space:]]*\{/ { in_build_types = 1 }
    in_build_types && /^[[:space:]]*release[[:space:]]*\{/ { in_release = 1 }
    in_release && /signingConfig signingConfigs\./ {
      gsub(/^[[:space:]]+|[[:space:]]+$/, "")
      print
      exit
    }
    in_release && /^[[:space:]]*\}/ { in_release = 0 }
  ' "$1"
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
  FROM="$DEBUG_SIGNING"
  TO="$RELEASE_SIGNING"
  ALREADY_MSG="Already using release signing in buildTypes/release"
else
  FROM="$RELEASE_SIGNING"
  TO="$DEBUG_SIGNING"
  ALREADY_MSG="Already patched: release uses signingConfigs.debug"
fi

current="$(get_release_signing_line "$build_gradle")"

if [[ "$current" == "$TO" ]]; then
  echo "$ALREADY_MSG"
  exit 0
fi

if [[ "$current" != "$FROM" ]]; then
  echo "Error: expected '${FROM}' in buildTypes/release, found: ${current:-<none>}" >&2
  exit 1
fi

tmp="$(mktemp)"
trap 'rm -f "$tmp"' EXIT

awk -v from="$FROM" -v to="$TO" '
  /buildTypes[[:space:]]*\{/ { in_build_types = 1 }
  in_build_types && /^[[:space:]]*release[[:space:]]*\{/ { in_release = 1 }
  in_release && index($0, from) { sub(from, to) }
  in_release && /^[[:space:]]*\}/ { in_release = 0 }
  { print }
' "$build_gradle" > "$tmp"

mv "$tmp" "$build_gradle"
trap - EXIT

echo "Updated: $build_gradle"
echo "  ${FROM} -> ${TO}  (inside buildTypes/release only)"
