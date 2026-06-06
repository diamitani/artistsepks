#!/usr/bin/env bash
# run-all-tests.sh — Orchestrator for EPK testing agent
# Runs all test suites and aggregates results into a JSON report

set -euo pipefail

SITE_URL="${SITE_URL:-https://artistsepks.com}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
STATE_DIR="$(cd "$SCRIPT_DIR/../../state" && pwd)"
TIMESTAMP="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
RUN_ID="${TIMESTAMP}"
REPORT_FILE="${STATE_DIR}/session.json"

SUITES=(
  "test-landing-page.sh"
  "test-epk-pages.sh"
  "test-profile-pages.sh"
  "test-api-endpoints.sh"
  "test-builder-flow.sh"
  "test-auth-flow.sh"
  "test-export-features.sh"
  "test-social-spotify.sh"
  "test-error-handling.sh"
)

echo "============================================"
echo "  ROSTR EPK Testing Agent — Full Test Run"
echo "  Site: ${SITE_URL}"
echo "  Run ID: ${RUN_ID}"
echo "============================================"
echo ""

# Pre-flight check: verify site is reachable
echo "  [Pre-flight] Checking ${SITE_URL}..."
set +e
SITE_CHECK=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "${SITE_URL}" 2>&1)
CURL_EXIT=$?
set -e
if [ "$CURL_EXIT" -ne 0 ] || [ "${SITE_CHECK}" = "000" ]; then
  echo "  ERROR: Cannot reach ${SITE_URL} (curl exit ${CURL_EXIT}, HTTP ${SITE_CHECK})"
  echo "  Make sure the site is running. Set SITE_URL to the correct URL."
  echo ""
  echo "{\"run_id\":\"${RUN_ID}\",\"site_url\":\"${SITE_URL}\",\"timestamp\":\"${TIMESTAMP}\",\"suites\":{},\"summary\":{\"passed\":0,\"failed\":0,\"total\":0,\"skipped\":0},\"cold_starts\":[],\"new_discoveries\":[],\"blocking\":true,\"error\":\"Site unreachable — is the server running?\"}"
  exit 1
fi
echo "  [Pre-flight] ${SITE_URL} is reachable (HTTP ${SITE_CHECK})"
echo ""

TOTAL_PASSED=0
TOTAL_FAILED=0
TOTAL_TESTS=0
TOTAL_SKIPPED=0
RESULTS="{}"
COLD_STARTS="[]"
NEW_DISCOVERIES="[]"
BLOCKING=false

for SUITE in "${SUITES[@]}"; do
  SUITE_PATH="${SCRIPT_DIR}/${SUITE}"
  SUITE_NAME="${SUITE%.sh}"

  if [ ! -f "$SUITE_PATH" ]; then
    echo "[SKIP] ${SUITE_NAME} — script not found"
    TOTAL_SKIPPED=$((TOTAL_SKIPPED + 1))
    continue
  fi

  echo "------------------------------------------------"
  echo "  Running: ${SUITE_NAME}"
  echo "------------------------------------------------"

  set +e
  SUITE_OUTPUT=$(SITE_URL="${SITE_URL}" TEST_TIMEOUT="${TEST_TIMEOUT:-30000}" bash "$SUITE_PATH" 2>&1)
  EXIT_CODE=$?
  set -e

  echo "${SUITE_OUTPUT}"

  SUITE_RESULT=$(echo "${SUITE_OUTPUT}" | grep -E '^\{' | tail -1)
  if [ -n "${SUITE_RESULT}" ]; then
    PASSED=$(echo "${SUITE_RESULT}" | jq -r '.passed // 0')
    FAILED=$(echo "${SUITE_RESULT}" | jq -r '.failed // 0')
    TOTAL=$(echo "${SUITE_RESULT}" | jq -r '.total // 0')
    SKIPPED=$(echo "${SUITE_RESULT}" | jq -r '.skipped // 0')

    TOTAL_PASSED=$((TOTAL_PASSED + PASSED))
    TOTAL_FAILED=$((TOTAL_FAILED + FAILED))
    TOTAL_TESTS=$((TOTAL_TESTS + TOTAL))
    TOTAL_SKIPPED=$((TOTAL_SKIPPED + SKIPPED))

    if [ "${FAILED}" -gt 0 ]; then
      BLOCKING=true
    fi

    RESULTS=$(echo "${RESULTS}" | jq \
      --arg suite "${SUITE_NAME}" \
      --argjson passed "${PASSED}" \
      --argjson failed "${FAILED}" \
      --argjson total "${TOTAL}" \
      --argjson skipped "${SKIPPED}" \
      --arg status "$([ "${FAILED}" -gt 0 ] && echo "fail" || echo "pass")" \
      '. + {($suite): {"status": $status, "tests": {"passed": $passed, "failed": $failed, "total": $total, "skipped": $skipped}}}')
  else
    echo "[WARN] No JSON result from ${SUITE_NAME}"
  fi

  echo ""
done

SUMMARY=$(cat <<SUMMARY
{
  "run_id": "${RUN_ID}",
  "site_url": "${SITE_URL}",
  "timestamp": "${TIMESTAMP}",
  "suites": ${RESULTS},
  "summary": {
    "passed": ${TOTAL_PASSED},
    "failed": ${TOTAL_FAILED},
    "total": ${TOTAL_TESTS},
    "skipped": ${TOTAL_SKIPPED}
  },
  "cold_starts": ${COLD_STARTS},
  "new_discoveries": ${NEW_DISCOVERIES},
  "blocking": ${BLOCKING},
  "started_at": "${TIMESTAMP}",
  "completed_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
SUMMARY
)

echo "${SUMMARY}" > "${REPORT_FILE}"

echo "============================================"
echo "  Summary: ${TOTAL_PASSED}/${TOTAL_TESTS} passed, ${TOTAL_FAILED} failed, ${TOTAL_SKIPPED} skipped"
if [ "${BLOCKING}" = true ]; then
  echo "  STATUS: BLOCKING ISSUES DETECTED"
  exit 1
else
  echo "  STATUS: All tests passed"
  echo "  ${TOTAL_PASSED}/${TOTAL_TESTS} ✓"
fi
echo "============================================"

echo "${SUMMARY}"
