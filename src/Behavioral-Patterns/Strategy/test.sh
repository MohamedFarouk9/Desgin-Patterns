#!/bin/bash
# Strategy Pattern Test Script

BASE_URL="http://localhost:3000"

echo "=== Strategy Pattern Tests ==="
echo ""

# Test 1: Regular Pricing
echo "--- Test 1: Regular Pricing (No Discount) ---"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/strategy/calculate" \
  -H "Content-Type: application/json" \
  -d '{"strategy":"regular","basePrice":100}')
echo "Regular pricing: $RESPONSE"

# Test 2: Percentage Discount
echo ""
echo "--- Test 2: Percentage Discount (20% Off) ---"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/strategy/calculate" \
  -H "Content-Type: application/json" \
  -d '{"strategy":"percentage","basePrice":100,"params":{"discountPercentage":20}}')
echo "Percentage discount: $RESPONSE"

# Test 3: Fixed Discount
echo ""
echo "--- Test 3: Fixed Discount ($15 Off) ---"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/strategy/calculate" \
  -H "Content-Type: application/json" \
  -d '{"strategy":"fixed","basePrice":100,"params":{"discountAmount":15}}')
echo "Fixed discount: $RESPONSE"

# Test 4: Tiered Pricing
echo ""
echo "--- Test 4: Tiered Pricing (7 items = 10% off) ---"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/strategy/calculate" \
  -H "Content-Type: application/json" \
  -d '{"strategy":"tiered","basePrice":100,"params":{"tiers":[{"minQuantity":5,"discountPercentage":10},{"minQuantity":10,"discountPercentage":15}]},"context":{"quantity":7}}')
echo "Tiered pricing: $RESPONSE"

# Test 5: Get Available Strategies
echo ""
echo "--- Test 5: Get Available Strategies ---"
RESPONSE=$(curl -s -X GET "$BASE_URL/api/strategies")
echo "Strategies: $RESPONSE"

# Test 6: Invalid Strategy
echo ""
echo "--- Test 6: Invalid Strategy ---"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/strategy/calculate" \
  -H "Content-Type: application/json" -d '{"strategy":"invalid","basePrice":100}')
echo "Invalid strategy status: $STATUS (expected: 400)"

echo ""
echo "=== Strategy Tests Complete ==="