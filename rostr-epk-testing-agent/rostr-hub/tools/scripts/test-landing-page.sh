#!/usr/bin/env bash
# test-landing-page.sh — Validates the marketing landing page loads correctly

set -euo pipefail

SITE_URL="${SITE_URL:-https://artistsepks.vercel.app}"
TIMEOUT="${TEST_TIMEOUT:-30000}"
PASSED=0
FAILED=0
TOTAL=0

red() { echo -e "\033[31m$1\033[0m"; }
green() { echo -e "\033[32m$1\033[0m"; }

check_status() {
  local test_name="$1"
  local url="$2"
  local expected_status="${3:-200}"
  local expected_content="${4:-}"

  TOTAL=$((TOTAL + 1))

  set +e
  response=$(curl -s -o /tmp/epk-test-body.txt -w "%{http_code}" --max-time 30 "$url" 2>&1)
  status=$?
  http_code="$response"
  set -e

  if [ "$status" -ne 0 ] || [ "$http_code" != "$expected_status" ]; then
    FAILED=$((FAILED + 1))
    red "  ✗ ${test_name} — Expected HTTP ${expected_status}, got ${http_code}"
    return 1
  fi

  if [ -n "$expected_content" ]; then
    if ! grep -q "$expected_content" /tmp/epk-test-body.txt 2>/dev/null; then
      FAILED=$((FAILED + 1))
      red "  ✗ ${test_name} — HTTP ${http_code} OK, but missing content: '${expected_content}'"
      return 1
    fi
  fi

  PASSED=$((PASSED + 1))
  green "  ✓ ${test_name}"
  return 0
}

echo "  Landing Page Tests"

check_status "GET / returns 200" "${SITE_URL}/" 200 "ArtistEPKs"
check_status "GET / contains features section" "${SITE_URL}/" 200 "Features"
check_status "GET / contains templates section" "${SITE_URL}/" 200 "Templates"
check_status "GET / contains pricing section" "${SITE_URL}/" 200 "Pricing"
check_status "GET / contains FAQ" "${SITE_URL}/" 200 "FAQ"
check_status "GET / contains CTA" "${SITE_URL}/" 200 "Build"

echo ""
echo "  Results: ${PASSED}/${TOTAL} passed, ${FAILED} failed"
echo ""
echo "{\"passed\":${PASSED},\"failed\":${FAILED},\"total\":${TOTAL},\"skipped\":0}"
