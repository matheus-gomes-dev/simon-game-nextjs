#!/bin/bash
# Workaround for Vitest URL-decoding %20 in directory names.
# Copies the project to a clean /tmp path and runs tests there.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
TMP_DIR="/tmp/simon-game-test"

# Clean and copy
rm -rf "$TMP_DIR"
cp -a "$PROJECT_DIR" "$TMP_DIR"

# Run vitest from the clean path, forwarding all arguments
cd "$TMP_DIR"
npx vitest "$@"
