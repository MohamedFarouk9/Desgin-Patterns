#!/bin/bash
# Adapter Pattern Test Script

BASE_URL="http://localhost:3000"

echo "=== Adapter Pattern Tests ==="
echo ""

# Test 1: Process Payment Through Adapter
echo "--- Test 1: Process Payment Through Adapter ---"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/adapter/process" \
  -H "Content-Type: application/json" \
  -d '{"amount":99.99,"currency":"USD"}')
echo "Payment result: $RESPONSE"

# Test 2: Process Payment in EUR
echo ""
echo "--- Test 2: Process Payment in EUR ---"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/adapter/process" \
  -H "Content-Type: application/json" \
  -d '{"amount":149.50,"currency":"EUR"}')
echo "EUR payment result: $RESPONSE"

# Test 3: Process Payment in GBP
echo ""
echo "--- Test 3: Process Payment in GBP ---"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/adapter/process" \
  -H "Content-Type: application/json" \
  -d '{"amount":75.00,"currency":"GBP"}')
echo "GBP payment result: $RESPONSE"

# Test 4: Invalid Request
echo ""
echo "--- Test 4: Invalid Request (Missing Fields) ---"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/adapter/process" \
  -H "Content-Type: application/json" -d '{"amount":100}')
echo "Missing fields status: $STATUS (expected: 400)"

# Test 5: Multiple Calls (Unique Transaction IDs)
echo ""
echo "--- Test 5: Multiple Calls (Unique Transaction IDs) ---"
echo "Making 3 payment requests..."
for i in 1 2 3; do
  curl -s -X POST "$BASE_URL/api/adapter/process" \
    -H "Content-Type: application/json" \
    -d "{\"amount\":10,\"currency\":\"USD\"}"
  echo ""
done

echo ""
echo "=== Adapter Tests Complete ==="