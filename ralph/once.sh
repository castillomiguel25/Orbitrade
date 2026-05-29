#!/bin/bash

stream_text='select(.type == "assistant").message.content[]? | select(.type == "text").text // empty | gsub("\n"; "\r\n") | . + "\r\n\n"'

commits=$(git log -n 5 --format="%H%n%ad%n%B---" --date=short 2>/dev/null || echo "No commits found")

open_issues=""
for f in docs/issues/*.md; do
  [[ -f "$f" ]] || continue
  grep -q "^## Status: done" "$f" && continue
  open_issues="$open_issues
$(cat "$f")"
done
issues="${open_issues:-No open issues found}"

prompt=$(cat ralph/prompt.md)

tmpfile=$(mktemp)
trap "rm -f $tmpfile" EXIT

claude \
  --permission-mode bypassPermissions \
  --print \
  --output-format stream-json \
  --verbose \
  "Previous commits: $commits Issues: $issues $prompt" \
| grep --line-buffered '^{' \
| tee "$tmpfile" \
| jq --unbuffered -rj "$stream_text"
