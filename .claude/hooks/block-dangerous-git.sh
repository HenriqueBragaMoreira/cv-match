#!/bin/bash
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command')

# Extract only the first line / actual command (ignore heredoc content)
FIRST_LINE=$(echo "$COMMAND" | head -1)

DANGEROUS_PATTERNS=(
  "^git push"
  "^git reset --hard"
  "^git clean -fd"
  "^git clean -f"
  "^git branch -D"
  "^git checkout \."
  "^git restore \."
  "push --force"
)

for pattern in "${DANGEROUS_PATTERNS[@]}"; do
  if echo "$FIRST_LINE" | grep -qE "$pattern"; then
    echo "BLOCKED: '$FIRST_LINE' matches dangerous pattern '$pattern'. Ask the user for confirmation first." >&2
    exit 2
  fi
done

exit 0
