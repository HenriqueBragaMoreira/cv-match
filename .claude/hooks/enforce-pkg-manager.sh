#!/bin/bash
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command')

if echo "$COMMAND" | grep -qE "^(npm|yarn|bun|deno) "; then
  echo "BLOCKED: This project uses pnpm. Use 'pnpm' instead of npm/yarn/bun/deno." >&2
  exit 2
fi

if echo "$COMMAND" | grep -qE "^npx "; then
  echo "BLOCKED: This project uses pnpm. Use 'pnpm dlx' or 'pnpm exec' instead of npx." >&2
  exit 2
fi

exit 0
