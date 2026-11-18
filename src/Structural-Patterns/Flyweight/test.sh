#!/bin/bash
# Flyweight Pattern Test Script

BASE_URL="http://localhost:3000"

echo "=== Flyweight Pattern Tests ==="
echo ""

# Test 1: Get or Create Asset (First Request)
echo "--- Test 1: Get or Create Asset (First Request) ---"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/flyweight/asset-get-or-create" \
  -H "Content-Type: application/json" \
  -d '{"assetId":"logo-primary","dimensions":"200x200","format":"PNG","filePath":"/assets/images/logo.png","size":45000}')
echo "First asset result: $RESPONSE"

# Test 2: Get Same Asset Again (Shared Instance)
echo ""
echo "--- Test 2: Get Same Asset Again (Shared Instance) ---"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/flyweight/asset-get-or-create" \
  -H "Content-Type: application/json" \
  -d '{"assetId":"logo-primary","dimensions":"200x200","format":"PNG","filePath":"/assets/images/logo.png","size":45000}')
echo "Second asset result: $RESPONSE"

# Test 3: Get Statistics
echo ""
echo "--- Test 3: Get Statistics ---"
RESPONSE=$(curl -s -X GET "$BASE_URL/api/flyweight/asset-stats")
echo "Stats result: $RESPONSE"

# Test 4: Request Multiple Different Assets
echo ""
echo "--- Test 4: Request Multiple Different Assets ---"
curl -s -X POST "$BASE_URL/api/flyweight/asset-get-or-create" \
  -H "Content-Type: application/json" \
  -d '{"assetId":"icon-home","dimensions":"24x24","format":"SVG","filePath":"/icons/home.svg","size":2048}' > /dev/null
curl -s -X POST "$BASE_URL/api/flyweight/asset-get-or-create" \
  -H "Content-Type: application/json" \
  -d '{"assetId":"font-roboto","dimensions":"variable","format":"WOFF2","filePath":"/fonts/roboto.woff2","size":150000}' > /dev/null

STATUS=$(curl -s -X GET "$BASE_URL/api/flyweight/asset-stats")
echo "Stats after multiple assets: $STATUS"
echo "Stats result: $RESPONSE"

echo ""
echo "=== Flyweight Tests Complete ==="