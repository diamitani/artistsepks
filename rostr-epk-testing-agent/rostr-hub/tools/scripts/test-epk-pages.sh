#!/usr/bin/env bash
# test-epk-pages.sh — Validates public EPK pages load correctly

set -euo pipefail

SITE_URL="${SITE_URL:-https://artistsepks.com}"
TIMEOUT="${TEST_TIMEOUT:-30000}"
PASSED=0
FAILED=0
TOTAL=0
SKIPPED=0

red() { echo -e "\033[31m$1\033[0m"; }
green() { echo -e "\033[32m$1\033[0m"; }

check_epk() {
  local test_name="$1"
  local slug="$2"
  local expected_content="${3:-}"

  TOTAL=$((TOTAL + 1))

  set +e
  http_code=$(curl -s -o /tmp/epk-test-body.txt -w "%{http_code}" --max-time 30 "${SITE_URL}/epk/${slug}" 2>&1)
  status=$?
  set -e

  if [ "$status" -ne 0 ]; then
    red "  ✗ ${test_name} — curl failed with exit code ${status}"
    FAILED=$((FAILED + 1))
    return 1
  fi

  if [ "$http_code" = "504" ] || [ "$http_code" = "000" ]; then
    red "  ✗ ${test_name} — HTTP ${http_code} (possible cold start)"
    # Retry once for cold starts
    sleep 5
    set +e
    http_code=$(curl -s -o /tmp/epk-test-body.txt -w "%{http_code}" --max-time 30 "${SITE_URL}/epk/${slug}" 2>&1)
    status=$?
    set -e
    if [ "$status" -ne 0 ] || [ "$http_code" != "200" ]; then
      FAILED=$((FAILED + 1))
      red "  ✗ ${test_name} — Still failing after retry. HTTP ${http_code}"
      return 1
    fi
    green "  ✓ ${test_name} (recovered from cold start)"
    PASSED=$((PASSED + 1))
    return 0
  fi

  if [ "$http_code" != "200" ]; then
    FAILED=$((FAILED + 1))
    red "  ✗ ${test_name} — Expected HTTP 200, got ${http_code}"
    return 1
  fi

  if [ -n "$expected_content" ]; then
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

echo "  EPK Page Tests"

# Core EPK pages
check_epk "GET /epk/luh-kel (Main EPK)" "luh-kel" "Luh Kel"
check_epk "GET /epk/luh-kel-booking (Booking Kit)" "luh-kel-booking" "Luh Kel"
check_epk "GET /epk/luh-kel-brand (Brand Kit)" "luh-kel-brand" "Luh Kel"

# Example artist EPKs
check_epk "GET /epk/solaris" "solaris"
check_epk "GET /epk/nova" "nova"
check_epk "GET /epk/the-velvetines" "the-velvetines"
check_epk "GET /epk/king-kai" "king-kai"

echo ""
echo "  Results: ${PASSED}/${TOTAL} passed, ${FAILED} failed, ${SKIPPED} skipped"
echo ""
echo "{\"passed\":${PASSED},\"failed\":${FAILED},\"total\":${TOTAL},\"skipped\":${SKIPPED}}"
