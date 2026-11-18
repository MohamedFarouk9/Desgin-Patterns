#!/bin/bash
# Singleton Pattern Test Script
# Usage: .\test.sh (run from within the pattern directory or with base URL)

BASE_URL="http://localhost:3000"

echo "=== Singleton Pattern Tests ==="
echo ""

# Test 1: Verify Singleton Instance Sharing
echo "--- Test 1: Verify Singleton Instance Sharing ---"
echo "Checking that two GET calls return same instance..."
STATUS1=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/api/singleton/status")
STATUS2=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/api/singleton/status")
echo "First call status: $STATUS1"
echo "Second call status: $STATUS2"

# Test 2: Execute Query on Shared Pool
echo ""
echo "--- Test 2: Execute Query on Shared Pool ---"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/singleton/query" \
  -H "Content-Type: application/json" \
  -d '{"sql":"SELECT * FROM users WHERE active = true"}')
echo "Query result: $RESPONSE"

# Test 3: Invalid Request
echo ""
echo "--- Test 3: Invalid Request ---"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/singleton/query")
echo "Missing SQL status: $STATUS"

echo ""
echo "=== Singleton Tests Complete ==="