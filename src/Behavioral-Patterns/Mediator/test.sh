#!/bin/bash
# Mediator Pattern Test Script

BASE_URL="http://localhost:3000"

echo "=== Mediator Pattern Tests ==="
echo ""

# Test 1: Login with Valid Token
echo "--- Test 1: Login with Valid Token ---"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/mediator/login" \
  -H "Content-Type: application/json" \
  -d '{"token":"valid-jwt-token-123"}')
echo "Valid login: $RESPONSE"

# Test 2: Login with Invalid Token
echo ""
echo "--- Test 2: Login with Invalid Token ---"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/mediator/login" \
  -H "Content-Type: application/json" -d '{"token":"invalid-token"}')
echo "Invalid token status: $STATUS (expected: 401)"

# Test 3: Login Missing Token
echo ""
echo "--- Test 3: Login Missing Token ---"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/mediator/login" \
  -H "Content-Type: application/json" -d '{}')
echo "Missing token status: $STATUS (expected: 400)"

echo ""
echo "=== Mediator Tests Complete ==="