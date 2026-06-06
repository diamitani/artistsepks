#!/usr/bin/env bash
# test-profile-pages.sh — Validates public artist profile pages

set -euo pipefail

SITE_URL="${SITE_URL:-https://artistsepks.com}"
PASSED=0
FAILED=0
TOTAL=0

red() { echo -e "\033[31m$1\033[0m"; }
green() { echo -e "\033[32m$1\033[0m"; }

check_profile() {
  local test_name="$1"
  local username="$2"
  local expected_status="${3:-200}"
  local expected_content="${4:-}"

  TOTAL=$((TOTAL + 1))

  set +e
  http_code=$(curl -s -o /tmp/epk-test-body.txt -w "%{http_code}" --max-time 30 "${SITE_URL}/${username}" 2>&1)
  status=$?
  set -e

  if [ "$status" -ne 0 ] || [ "$http_code" != "$expected_status" ]; then
    FAILED=$((FAILED + 1))
    red "  ✗ ${test_name} — Expected HTTP ${expected_status}, got ${http_code}"
    return 1
  fi

  if [ -n "$expected_content" ] && [ "$http_code" = "200" ]; then
    if ! grep -q "$expected_content" /tmp/epk-test-body.txt 2>/dev/null; then
      FAILED=$((FAILED + 1))
      red "  ✗ ${test_name} — HTTP 200 OK, but missing content: '${expected_content}'"
      return 1
    fi
  fi

  PASSED=$((PASSED + 1))
  green "  ✓ ${test_name}"
  return 0
}

echo "  Profile Page Tests"

# Known profiles
check_profile "GET /luh-kel (known profile)" "luh-kel" 200 "Luh Kel"

# Edge cases — invalid format should 404
check_profile "GET /ab (too short, <3 chars)" "ab" 404
check_profile "GET /a-b (too short, <3 chars)" "a-b" 404
check_profile "GET /$$$invalid (special chars)" '$$$invalid' 404

# Unknown profile should 404 (not 500)
check_profile "GET /this-user-does-not-exist-12345 (unknown)" "this-user-does-not-exist-12345" 404

echo ""
echo "  Results: ${PASSED}/${TOTAL} passed, ${FAILED} failed"
echo ""
echo "{\"passed\":${PASSED},\"failed\":${FAILED},\"total\":${TOTAL},\"skipped\":0}"
