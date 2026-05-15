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

# Activate debugger - START

FILE_FOR_ACTIVATE_DEBUGGER="./packages/zapp-react-native-tvos-app/InteractionManager/index.tsx"

if [ -z "$FILE_FOR_ACTIVATE_DEBUGGER" ]; then
  echo "❌ Please provide a file path."
  echo "Usage: $0 path/to/file.js"
  exit 1
fi

if [ ! -f "$FILE_FOR_ACTIVATE_DEBUGGER" ]; then
  echo "❌ File not found: $FILE_FOR_ACTIVATE_DEBUGGER"
  exit 1
fi

# Replace the line in place (no backup)
sed -i '' 's/const IS_DEBUGGER_ENABLED = false;/const IS_DEBUGGER_ENABLED = true;/' "$FILE_FOR_ACTIVATE_DEBUGGER"

echo "✅ Activated debugger flag in $FILE_FOR_ACTIVATE_DEBUGGER"

# Activate debugger - END

# Patch MessageQueue - START

FILE_FOR_PATCH_MESSAGE_QUEUE="./node_modules/react-native/Libraries/BatchedBridge/MessageQueue.js"

if [ -z "$FILE_FOR_PATCH_MESSAGE_QUEUE" ]; then
  echo "❌ Please provide a file path."
  echo "Usage: $0 path/to/file.js"
  exit 1
fi

if [ ! -f "$FILE_FOR_PATCH_MESSAGE_QUEUE" ]; then
  echo "❌ File not found: $FILE_FOR_PATCH_MESSAGE_QUEUE"
  exit 1
fi

# Use sed to replace the entire method (single-line form)
# Replace the whole callNativeSyncHook method
sed -i '' '/callNativeSyncHook(/,/^  }/c\
  callNativeSyncHook(\
    moduleID: number,\
    methodID: number,\
    params: mixed[],\
    onFail: ?(...mixed[]) => void,\
    onSucc: ?(...mixed[]) => void,\
  ): mixed {\
    this.processCallbacks(moduleID, methodID, params, onFail, onSucc);\
    if(global.nativeCallSyncHook)\
      {\
        return global.nativeCallSyncHook(moduleID, methodID, params);\
      }\
  }' "$FILE_FOR_PATCH_MESSAGE_QUEUE"

echo "✅ Replaced callNativeSyncHook method in $FILE_FOR_PATCH_MESSAGE_QUEUE"

# Patch MessageQueue - END