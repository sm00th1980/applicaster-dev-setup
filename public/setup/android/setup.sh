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
