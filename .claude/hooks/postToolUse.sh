#!/bin/bash

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')

if [[ "$TOOL_NAME" != "Edit" && "$TOOL_NAME" != "Write" ]]; then
  exit 0
fi

FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

case "$FILE_PATH" in
  *.ts | *.json | *.md)
    echo "[nest-blog-api Hook] File edited: $(basename "$FILE_PATH"). Consider running npm run lint and npm run build before final delivery." >&2
    ;;
esac

exit 0
