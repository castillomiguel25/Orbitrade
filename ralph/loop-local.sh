#!/bin/bash
set -e

# Adapted ralph loop: reads issues from the local (gitignored) scratch tracker
# and uses the local prompt. Runs claude headless in this environment.

if [ -z "$1" ]; then
  echo "Usage: $0 <iterations> [max-budget-usd]"
  echo "  iterations      Max number of issues to attempt (e.g. 13)"
  echo "  max-budget-usd  Optional spend cap per iteration (e.g. 10.00)"
  exit 1
fi

ITERATIONS=$1
MAX_BUDGET=${2:-""}

ISSUES_DIR=".scratch/orbitrade-energy-transform/issues"
PROMPT_FILE="ralph/prompt-local.md"

stream_text='select(.type == "assistant").message.content[]? | select(.type == "text").text // empty | gsub("\n"; "\r\n") | . + "\r\n\n"'
final_result='select(.type == "result").result // empty'

budget_flag=""
if [ -n "$MAX_BUDGET" ]; then
  budget_flag="--max-budget-usd $MAX_BUDGET"
fi

for ((i=1; i<=ITERATIONS; i++)); do
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  Ralph (local) iteration $i / $ITERATIONS"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""

  tmpfile=$(mktemp)
  trap "rm -f $tmpfile" EXIT

  commits=$(git log -n 5 --format="%H%n%ad%n%B---" --date=short 2>/dev/null || echo "No commits found")

  # Only pass issues that haven't been marked done yet
  open_issues=""
  for f in "$ISSUES_DIR"/*.md; do
    [[ -f "$f" ]] || continue
    grep -q "^## Status: done" "$f" && continue
    open_issues="$open_issues
$(cat "$f")"
  done
  issues="${open_issues:-No open issues found}"

  prompt=$(cat "$PROMPT_FILE")

  claude \
    --permission-mode bypassPermissions \
    --print \
    --output-format stream-json \
    --verbose \
    $budget_flag \
    "Previous commits: $commits Issues: $issues $prompt" \
  | grep --line-buffered '^{' \
  | tee "$tmpfile" \
  | jq --unbuffered -rj "$stream_text"

  result=$(jq -r "$final_result" "$tmpfile")

  if [[ "$result" == *"<promise>NO MORE TASKS</promise>"* ]]; then
    echo ""
    echo "✓ Ralph complete after $i iteration(s). No more AFK tasks."
    exit 0
  fi
done

echo ""
echo "Ralph finished $ITERATIONS iteration(s)."
