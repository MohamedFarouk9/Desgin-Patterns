#!/bin/bash
# Bridge Pattern Test Script

BASE_URL="http://localhost:3000"

echo "=== Bridge Pattern Tests ==="
echo ""

# Test 1: Process Media with AWS Storage
echo "--- Test 1: Process Media with AWS Storage ---"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/bridge/process-media" \
  -H "Content-Type: application/json" \
  -d '{"provider":"aws","fileName":"product-image.png","fileContentBase64":"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="}')
echo "AWS result: $RESPONSE"

# Test 2: Process Media with GCP Storage
echo ""
echo "--- Test 2: Process Media with GCP Storage ---"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/bridge/process-media" \
  -H "Content-Type: application/json" \
  -d '{"provider":"gcp","fileName":"document.pdf","fileContentBase64":"JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoK..."}')
echo "GCP result: $RESPONSE"

# Test 3: Process Media with Local Storage
echo ""
echo "--- Test 3: Process Media with Local Storage ---"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/bridge/process-media" \
  -H "Content-Type: application/json" \
  -d '{"provider":"local","fileName":"test-image.jpg","fileContentBase64":"/9j/4AAQSkZJRgABAQEAYABgAAD..."}')
echo "Local result: $RESPONSE"

# Test 4: Invalid Provider
echo ""
echo "--- Test 4: Invalid Provider ---"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/bridge/process-media" \
  -H "Content-Type: application/json" -d '{"provider":"invalid-provider","fileName":"test.txt"}')
echo "Invalid provider status: $STATUS (expected: 400)"

echo ""
echo "=== Bridge Tests Complete ==="