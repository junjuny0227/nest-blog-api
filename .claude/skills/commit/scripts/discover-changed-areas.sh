#!/usr/bin/env bash

set -euo pipefail

MODE="${1:-auto}"

case "$MODE" in
  staged)
    FILES=$(git diff --staged --name-only --diff-filter=ACMRD)
    ;;
  unstaged)
    FILES=$(git diff --name-only --diff-filter=ACMRD)
    ;;
  auto)
    FILES=$(git diff --staged --name-only --diff-filter=ACMRD)
    if [ -z "$FILES" ]; then
      FILES=$(git diff --name-only --diff-filter=ACMRD)
    fi
    ;;
  *)
    echo "Usage: $0 [auto|staged|unstaged]" >&2
    exit 1
    ;;
esac

if [ -z "$FILES" ]; then
  echo "none"
  exit 0
fi

printf '%s\n' "$FILES" | awk '
  /^src\/common\// { print "common"; next }
  /^src\/config\// { print "config"; next }
  /^src\/[^\/]+\// { match($0, /^src\/([^\/]+)\//, arr); print arr[1]; next }
  /^test\// { print "test"; next }
  /^\.claude\// { print "harness"; next }
  /^\.github\// { print "ci"; next }
  /^(README|CLAUDE|docs\/)/ { print "docs"; next }
  /^(package\.json|package-lock\.json|tsconfig|eslint|nest-cli|\.prettier|\.editorconfig)/ { print "config"; next }
  { print "global" }
' | sort -u
