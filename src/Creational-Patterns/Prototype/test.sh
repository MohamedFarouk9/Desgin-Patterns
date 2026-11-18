#!/bin/bash
# Prototype Pattern Test Script

BASE_URL="http://localhost:3000"

echo "=== Prototype Pattern Tests ==="
echo ""

# Test 1: List Available Templates
echo "--- Test 1: List Available Templates ---"
RESPONSE=$(curl -s -X GET "$BASE_URL/api/prototype/templates")
echo "Templates: $RESPONSE"

# Test 2: Clone Black Friday Template
echo ""
echo "--- Test 2: Clone Black Friday Template ---"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/prototype/clone" \
  -H "Content-Type: application/json" \
  -d '{"templateKey":"black-friday","newName":"Cyber Monday 2026 Campaign","overrides":{"themeColor":"#8B5CF6","promoCode":"CYBER2026"}}')
echo "Clone result: $RESPONSE"

# Test 3: Clone Summer Sale Template
echo ""
echo "--- Test 3: Clone Summer Sale Template ---"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/prototype/clone" \
  -H "Content-Type: application/json" \
  -d '{"templateKey":"summer-sale","newName":"End of Season Clearance","overrides":{"themeColor":"#F97316"}}')
echo "Summer sale result: $RESPONSE"

# Test 4: Verify Deep Clone Independence
echo ""
echo "--- Test 4: Verify Deep Clone Independence ---"
echo "Cloning from same template twice should create independent clones..."
RESPONSE1=$(curl -s -X POST "$BASE_URL/api/prototype/clone" \
  -H "Content-Type: application/json" \
  -d '{"templateKey":"black-friday","newName":"Test Clone 1"}')
RESPONSE2=$(curl -s -X POST "$BASE_URL/api/prototype/clone" \
  -H "Content-Type: application/json" \
  -d '{"templateKey":"black-friday","newName":"Test Clone 2"}')
echo "Clone 1: $RESPONSE1"
echo "Clone 2: $RESPONSE2"

# Test 5: Invalid Template Key
echo ""
echo "--- Test 5: Invalid Template Key ---"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/prototype/clone" \
  -H "Content-Type: application/json" -d '{"templateKey":"non-existent","newName":"Test"}')
echo "Invalid key status: $STATUS (expected: 404)"

echo ""
echo "=== Prototype Tests Complete ==="