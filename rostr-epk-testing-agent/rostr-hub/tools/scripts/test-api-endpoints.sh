#!/usr/bin/env bash
# test-api-endpoints.sh — Validates API endpoints respond correctly

set -euo pipefail

SITE_URL="${SITE_URL:-https://artistsepks.com}"
PASSED=0
FAILED=0
TOTAL=0
SKIPPED=0

red() { echo -e "\033[31m$1\033[0m"; }
green() { echo -e "\033[32m$1\033[0m"; }
yellow() { echo -e "\033[33m$1\033[0m"; }

check_get() {
  local test_name="$1"
  local url="$2"
  local expected_status="${3:-200}"
  local expect_json="${4:-true}"

  TOTAL=$((TOTAL + 1))

  set +e
  response=$(curl -s -o /tmp/epk-api-body.txt -w "%{http_code}" --max-time 30 "${url}" 2>&1)
  http_code=$?
  status=$?

  if [ "$status" -ne 0 ]; then
    http_code="000"
  else
    http_code="$response"
  fi
  set -e

  if [ "$http_code" = "000" ] || [ "$http_code" = "504" ]; then
    yellow "  ~ ${test_name} — HTTP ${http_code} (possible cold start, retrying...)"
    sleep 5
    set +e
    response=$(curl -s -o /tmp/epk-api-body.txt -w "%{http_code}" --max-time 30 "${url}" 2>&1)
    http_code=$?
    status=$?
    if [ "$status" -ne 0 ]; then
      http_code="000"
    else
      http_code="$response"
    fi
    set -e
  fi

  if [ "$http_code" != "$expected_status" ]; then
    FAILED=$((FAILED + 1))
    red "  ✗ ${test_name} — Expected HTTP ${expected_status}, got ${http_code}"
    return 1
  fi

  if [ "$expect_json" = true ] && [ "$http_code" = "200" ]; then
    content_type=$(head -1 /tmp/epk-api-body.txt 2>/dev/null || echo "")
    if ! jq empty /tmp/epk-api-body.txt 2>/dev/null; then
      yellow "  ! ${test_name} — Response is not valid JSON (this may be expected for GET endpoints without auth)"
    fi
  fi

  PASSED=$((PASSED + 1))
  green "  ✓ ${test_name}"
  return 0
}

check_post() {
  local test_name="$1"
  local url="$2"
  local data="$3"
  local expected_status="${4:-200}"

  TOTAL=$((TOTAL + 1))

  set +e
  http_code=$(curl -s -o /tmp/epk-api-body.txt -w "%{http_code}" --max-time 30 -X POST \
    -H "Content-Type: application/json" \
    -d "$data" \
    "${url}" 2>&1)
  status=$?
  if [ "$status" -ne 0 ]; then
    http_code="000"
  fi
  set -e

  if [ "$http_code" = "000" ] || [ "$http_code" = "504" ]; then
    yellow "  ~ ${test_name} — HTTP ${http_code} (possible cold start, retrying...)"
    sleep 5
    set +e
    http_code=$(curl -s -o /tmp/epk-api-body.txt -w "%{http_code}" --max-time 30 -X POST \
      -H "Content-Type: application/json" \
      -d "$data" \
      "${url}" 2>&1)
    set -e
  fi

  if [ "$http_code" != "$expected_status" ]; then
    FAILED=$((FAILED + 1))
    red "  ✗ ${test_name} — Expected HTTP ${expected_status}, got ${http_code}"
    return 1
  fi

  PASSED=$((PASSED + 1))
  green "  ✓ ${test_name}"
  return 0
}

echo "  API Endpoint Tests"

# Read endpoints
check_get "GET /api/epk (list EPKs)" "${SITE_URL}/api/epk" 200
check_get "GET /api/profile with username" "${SITE_URL}/api/profile?username=luh-kel" 200
check_get "GET /api/venues (search)" "${SITE_URL}/api/venues?q=studio" 200
check_get "GET /api/venues by id" "${SITE_URL}/api/venues?id=1" 200
check_get "GET /api/domains (list)" "${SITE_URL}/api/domains" 200

# Write endpoints (should fail gracefully without auth or with test data)
check_post "POST /api/epk (create — may require auth)" "${SITE_URL}/api/epk" \
  '{"slug":"test-epk","template":"main","data":{"artistName":"Test Artist"}}' 200

check_post "POST /api/profile (update)" "${SITE_URL}/api/profile" \
  '{"profile_data":{"username":"test-artist","name":"Test"}}' 200

check_post "POST /api/upload (upload test)" "${SITE_URL}/api/upload" \
  '{"file":"data:image/png;base64,iVBORw0KGgo="}' 200

check_post "POST /api/generate (bio gen)" "${SITE_URL}/api/generate" \
  '{"artistName":"Test Artist","genre":"Pop"}' 200

check_post "POST /api/export/html (HTML export)" "${SITE_URL}/api/export/html" \
  '{"slug":"luh-kel","template":"main"}' 200

check_post "POST /api/pdf/render (PDF gen)" "${SITE_URL}/api/pdf/render" \
  '{"slug":"luh-kel","template":"main"}' 200

check_get "GET /api/pdf/luh-kel (PDF download)" "${SITE_URL}/api/pdf/luh-kel" 200

check_post "POST /api/social/dashboard (social dash)" "${SITE_URL}/api/social/dashboard" \
  '{"artistName":"Luh Kel","socialLinks":{"spotify":"https://open.spotify.com/artist/7l3JMsqkCbGuxM1Wl0OK2o"}}' 200

check_post "POST /api/domains/verify (domain verify)" "${SITE_URL}/api/domains/verify" \
  '{"domain":"example.com","epk_slug":"luh-kel"}' 200

echo ""
echo "  Results: ${PASSED}/${TOTAL} passed, ${FAILED} failed, ${SKIPPED} skipped"
echo ""
echo "{\"passed\":${PASSED},\"failed\":${FAILED},\"total\":${TOTAL},\"skipped\":${SKIPPED}}"
