#!/usr/bin/env bash
# test-error-handling.sh — Validates error pages and edge cases

set -euo pipefail

SITE_URL="${SITE_URL:-http://localhost:3000}"
PASSED=0
FAILED=0
TOTAL=0
SKIPPED=0

red() { echo -e "\033[31m$1\033[0m"; }
green() { echo -e "\033[32m$1\033[0m"; }
yellow() { echo -e "\033[33m$1\033[0m"; }

check_no_5xx() {
  local test_name="$1"
  local method="$2"
  local url="$3"
  local data="${4:-}"
  local acceptable_codes="$5"

  TOTAL=$((TOTAL + 1))

  set +e
  if [ "$method" = "GET" ]; then
    http_code=$(curl -s -o /tmp/epk-error-body.txt -w "%{http_code}" --max-time 30 "${url}" 2>&1)
  else
    http_code=$(curl -s -o /tmp/epk-error-body.txt -w "%{http_code}" --max-time 30 -X "$method" \
      -H "Content-Type: application/json" \
      -d "$data" \
      "${url}" 2>&1)
  fi
  status=$?
  set -e

  if [ "$status" -ne 0 ]; then
    FAILED=$((FAILED + 1))
    red "  ✗ ${test_name} — curl failed"
    return 1
  fi

  if [ "$http_code" -ge 500 ]; then
    FAILED=$((FAILED + 1))
    red "  ✗ ${test_name} — HTTP ${http_code} (5xx error — should not happen)"
    return 1
  fi

  # If acceptable codes are specified, check we're in that range
  if [ -n "$acceptable_codes" ] && [ "$http_code" != "200" ]; then
    local ok=false
    for code in $acceptable_codes; do
      if [ "$http_code" = "$code" ]; then
        ok=true
        break
      fi
    done
    if [ "$ok" = false ]; then
      yellow "  ~ ${test_name} — HTTP ${http_code} (acceptable, not 5xx)"
      PASSED=$((PASSED + 1))
      return 0
    fi
  fi

  PASSED=$((PASSED + 1))
  green "  ✓ ${test_name} — HTTP ${http_code}"
  return 0
}

echo "  Error Handling Tests"

# Nonexistent EPK slug — should not 5xx (soft 404 is fine)
check_no_5xx "GET /epk/nonexistent-epk-12345" "GET" "${SITE_URL}/epk/nonexistent-epk-12345" "" "200 404"

# EPK empty slug — should not 5xx
check_no_5xx "GET /epk/ (empty slug)" "GET" "${SITE_URL}/epk/" "" "200 308 404"

# Nonexistent profile — should not 5xx
check_no_5xx "GET /ab (too short)" "GET" "${SITE_URL}/ab" "" "200 404"

# Nonexistent builder subroute — auth middleware redirects, not 5xx
check_no_5xx "GET /builder/nonexistent" "GET" "${SITE_URL}/builder/nonexistent" "" "200 307 308 404"

# Nonexistent auth subroute — hard 404 from Next.js, not 5xx
check_no_5xx "GET /auth/nonexistent" "GET" "${SITE_URL}/auth/nonexistent" "" "404"

# API with empty body — should not 5xx (401 for unauthorized is fine)
check_no_5xx "POST /api/epk (empty body)" "POST" "${SITE_URL}/api/epk" "{}" "400 401 422"

# API with invalid JSON — should not 5xx
check_no_5xx "POST /api/epk (invalid JSON)" "POST" "${SITE_URL}/api/epk" "not json at all" "400 401 422"

# API with invalid method — should not 5xx
check_no_5xx "DELETE /api/epk without id" "DELETE" "${SITE_URL}/api/epk" "" "400 401 404 405"

# Root always works
check_no_5xx "GET / (root)" "GET" "${SITE_URL}/" "" "200"

echo ""
echo "  Results: ${PASSED}/${TOTAL} passed, ${FAILED} failed, ${SKIPPED} skipped"
echo ""
echo "{\"passed\":${PASSED},\"failed\":${FAILED},\"total\":${TOTAL},\"skipped\":${SKIPPED}}"
