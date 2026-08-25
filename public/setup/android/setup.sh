#!/bin/sh

# Disabling popups - START

FILE_FOR_DISABLE_POPUPS="./packages/quick-brick-core/App/index.tsx"

if [ -z "$FILE_FOR_DISABLE_POPUPS" ]; then
  echo "❌ Please provide a file path."
  echo "Usage: $0 path/to/file.js"
  exit 1
fi

if [ ! -f "$FILE_FOR_DISABLE_POPUPS" ]; then
  echo "❌ File not found: $FILE_FOR_DISABLE_POPUPS"
  exit 1
fi

# Temporary file
TMP_FILE_FOR_DISABLE_POPUPS=$(mktemp)

# Add new lines on top
cat <<'EOF' > "$TMP_FILE_FOR_DISABLE_POPUPS"
// Disable logs popups(RN68,RN77)
import { LogBox } from "react-native";
LogBox.ignoreAllLogs();

EOF

# Append original content
cat "$FILE_FOR_DISABLE_POPUPS" >> "$TMP_FILE_FOR_DISABLE_POPUPS"

# Replace original file
mv "$TMP_FILE_FOR_DISABLE_POPUPS" "$FILE_FOR_DISABLE_POPUPS"

echo "✅ Added LogBox ignore code to top of $FILE_FOR_DISABLE_POPUPS"

# Disabling popups - END

# Suppress empty-source throw in useInflatedUrl - START

FILE_FOR_SUPPRESS_INFLATED_URL_THROW="./packages/zapp-react-native-utils/reactHooks/feed/useInflatedUrl.ts"

if [ -z "$FILE_FOR_SUPPRESS_INFLATED_URL_THROW" ]; then
  echo "❌ Please provide a file path."
  echo "Usage: $0 path/to/file.js"
  exit 1
fi

if [ ! -f "$FILE_FOR_SUPPRESS_INFLATED_URL_THROW" ]; then
  echo "❌ File not found: $FILE_FOR_SUPPRESS_INFLATED_URL_THROW"
  exit 1
fi

if grep -Eq '^[[:space:]]+throw new Error\(' "$FILE_FOR_SUPPRESS_INFLATED_URL_THROW"; then
  # Comment out the 3-line throw so empty source + mapping does not crash in __DEV__
  perl -i -0pe 's/([ \t]*)throw new Error\(\n[ \t]*"getInflatedDataSourceUrl: source is empty while mapping is provided"\n[ \t]*\);/$1\/\/ throw new Error(\n$1\/\/   "getInflatedDataSourceUrl: source is empty while mapping is provided"\n$1\/\/ );/' "$FILE_FOR_SUPPRESS_INFLATED_URL_THROW"

  echo "✅ Suppressed empty-source throw in $FILE_FOR_SUPPRESS_INFLATED_URL_THROW"
else
  echo "✅ Empty-source throw already suppressed in $FILE_FOR_SUPPRESS_INFLATED_URL_THROW"
fi

# Suppress empty-source throw in useInflatedUrl - END
