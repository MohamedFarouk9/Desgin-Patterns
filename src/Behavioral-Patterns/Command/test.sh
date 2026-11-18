#!/bin/bash
# Command Pattern Test Script

BASE_URL="http://localhost:3000"

echo "=== Command Pattern Tests ==="
echo ""

# Test 1: Create User
echo "--- Test 1: Create User Alice ---"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/command/create" \
  -H "Content-Type: application/json" \
  -d '{"action":"create","name":"Alice"}')
echo "Create Alice: $RESPONSE"

# Test 2: Create Another User
echo ""
echo "--- Test 2: Create User Bob ---"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/command/create" \
  -H "Content-Type: application/json" \
  -d '{"action":"create","name":"Bob"}')
echo "Create Bob: $RESPONSE"

# Test 3: Delete User
echo ""
echo "--- Test 3: Delete User Alice ---"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/command/create" \
  -H "Content-Type: application/json" \
  -d '{"action":"delete","name":"Alice"}')
echo "Delete Alice: $RESPONSE"

# Test 4: Undo Last
echo ""
echo "--- Test 4: Undo Last Command ---"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/command/undo")
echo "Undo result: $RESPONSE"

# Test 5: Redo Last
echo ""
echo "--- Test 5: Redo Last Command ---"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/command/redo")
echo "Redo result: $RESPONSE"

# Test 6: Get History
echo ""
echo "--- Test 6: Get Command History ---"
RESPONSE=$(curl -s -X GET "$BASE_URL/api/command/history")
echo "History: $RESPONSE"

echo ""
echo "=== Command Tests Complete ==="