#!/bin/bash
# Chain of Responsibility Pattern Test Script

BASE_URL="http://localhost:3000"

echo "=== Chain of Responsibility Pattern Tests ==="
echo ""

# Test 1: Valid Request
echo "--- Test 1: Valid Request (Passes All Handlers) ---"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/chain-of-responsibility/process" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer valid-token-123" \
  -d '{"name":"John Doe","email":"john@example.com"}')
echo "Valid request result: $RESPONSE"

# Test 2: Missing Auth Token
echo ""
echo "--- Test 2: Missing Auth Token ---"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/chain-of-responsibility/process" \
  -H "Content-Type: application/json" -d '{"name":"John Doe","email":"john@example.com"}')
echo "Missing auth status: $STATUS (expected: 401)"

# Test 3: Invalid Auth Token
echo ""
echo "--- Test 3: Invalid Auth Token ---"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/chain-of-responsibility/process" \
  -H "Content-Type: application/json" -H "Authorization: Bearer invalid-token" \
  -d '{"name":"John Doe","email":"john@example.com"}')
echo "Invalid token status: $STATUS (expected: 401)"

# Test 4: Valid Auth but Missing Name
echo ""
echo "--- Test 4: Valid Auth but Missing Name ---"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/chain-of-responsibility/process" \
  -H "Content-Type: application/json" -H "Authorization: Bearer valid-token-123" \
  -d '{"email":"john@example.com"}')
echo "Missing name status: $STATUS (expected: 400)"

# Test 5: Valid Auth but Invalid Email
echo ""
echo "--- Test 5: Valid Auth but Invalid Email ---"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/chain-of-responsibility/process" \
  -H "Content-Type: application/json" -H "Authorization: Bearer valid-token-123" \
  -d '{"name":"John Doe","email":"invalid-email"}')
echo "Invalid email status: $STATUS (expected: 400)"

echo ""
echo "=== Chain of Responsibility Tests Complete ==="