#!/bin/bash
# Decorator Pattern Test Script

BASE_URL="http://localhost:3000"

echo "=== Decorator Pattern Tests ==="
echo ""

# Test 1: Get API Data with Decorators
echo "--- Test 1: Get API Data with Decorators ---"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/decorator/api-data" \
  -H "Content-Type: application/json" \
  -d '{"endpoint":"/api/users","method":"GET","query":"?page=1&limit=10"}')
echo "API data result: $RESPONSE"

# Test 2: Second Request (Cache Hit)
echo ""
echo "--- Test 2: Second Request (Cache Hit) ---"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/decorator/api-data" \
  -H "Content-Type: application/json" \
  -d '{"endpoint":"/api/users","method":"GET","query":"?page=1&limit=10"}')
echo "Cached result: $RESPONSE"

# Test 3: Different Endpoint
echo ""
echo "--- Test 3: Different Endpoint ---"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/decorator/api-data" \
  -H "Content-Type: application/json" \
  -d '{"endpoint":"/api/products","method":"GET","query":"?category=electronics"}')
echo "Products result: $RESPONSE"

# Test 4: Invalid Request
echo ""
echo "--- Test 4: Invalid Request ---"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/decorator/api-data" \
  -H "Content-Type: application/json" -d '{"endpoint":"/api/test"}')
echo "Invalid endpoint status: $STATUS (expected: 400)"

echo ""
echo "=== Decorator Tests Complete ==="