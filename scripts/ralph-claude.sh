#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <iterations>"
  exit 1
fi

for ((i=1; i<=$1; i++)); do
  tmpfile=$(mktemp)
  claude --permission-mode bypassPermissions -p "@docs/PRD.md @scripts/progress.txt \
  1. Find the highest-priority task and implement it. \
  2. Run your tests and type checks. \
  3. Update the PRD with what was done. \
  4. Append your progress to progress.txt. \
  5. Commit your changes using /commit-work skill. \
  ONLY WORK ON A SINGLE ITEM. \
  If every item across all docs/PRD.md is closed, output <promise>COMPLETED ALL TASKS IN THE PRD</promise>." | tee "$tmpfile"
  result=$(cat "$tmpfile")
  rm "$tmpfile"

  if [[ "$result" == *"<promise>COMPLETE</promise>"* ]]; then
    echo "All requirements complete after $i iterations."
    exit 0
  fi
done