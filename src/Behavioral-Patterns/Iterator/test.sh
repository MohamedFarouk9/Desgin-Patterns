#!/bin/bash
# Iterator Pattern Test Script

BASE_URL="http://localhost:3000"

echo "=== Iterator Pattern Tests ==="
echo ""

# Test 1: Run Iterator Demo
echo "--- Test 1: Run Iterator Demo ---"
RESPONSE=$(curl -s -X GET "$BASE_URL/api/iterator/demo")
echo "Iterator demo: $RESPONSE"

echo ""
echo "=== Iterator Tests Complete ==="