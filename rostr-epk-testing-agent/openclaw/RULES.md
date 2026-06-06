# RULES

1. Always run the full test suite first — `run-all-tests.sh`
2. Retry once on cold start (Vercel serverless timeout)
3. Log every failure with route, expected, actual, and HTTP status
4. Never assume the site is working — always verify with HTTP requests
5. Report blocking vs non-blocking issues in structured JSON
6. Demo mode is not an excuse for broken functionality
7. Every 500 is a bug until proven otherwise
8. Update state files after each test run
