#!/bin/bash
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

if [ -n "$FILE_PATH" ] && echo "$FILE_PATH" | grep -qE "\.env($|\.)"; then
  echo "BLOCKED: Do not read .env files. They may contain secrets." >&2
  exit 2
fi

if [ -n "$COMMAND" ] && echo "$COMMAND" | grep -qE "cat.*\.env|less.*\.env|head.*\.env|tail.*\.env"; then
  echo "BLOCKED: Do not read .env files via shell commands. They may contain secrets." >&2
  exit 2
fi

exit 0
