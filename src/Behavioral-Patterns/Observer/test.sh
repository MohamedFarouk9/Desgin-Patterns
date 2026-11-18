#!/bin/bash
# Observer Pattern Test Script

BASE_URL="http://localhost:3000"

echo "=== Observer Pattern Tests ==="
echo ""

# Test 1: Set Measurements
echo "--- Test 1: Set Measurements ---"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/observer/measurements" \
  -H "Content-Type: application/json" \
  -d '{"action":"set-measurements","temperature":25,"humidity":60,"pressure":1013}')
echo "Set measurements: $RESPONSE"

# Test 2: Subscribe Statistics
echo ""
echo "--- Test 2: Subscribe Statistics Observer ---"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/observer/measurements" \
  -H "Content-Type: application/json" \
  -d '{"action":"subscribe","observerType":"statistics"}')
echo "Subscribe statistics: $RESPONSE"

echo ""
echo "=== Observer Tests Complete ==="