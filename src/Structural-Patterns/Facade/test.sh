#!/bin/bash
# Facade Pattern Test Script

BASE_URL="http://localhost:3000"

echo "=== Facade Pattern Tests ==="
echo ""

# Test 1: Process Media with AWS (Default)
echo "--- Test 1: Process Media with AWS ---"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/facade/process-media" \
  -H "Content-Type: application/json" \
  -d '{"provider":"aws","fileName":"product-banner.png","fileContentBase64":"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="}')
echo "AWS facade result: $RESPONSE"

# Test 2: Process Media with GCP
echo ""
echo "--- Test 2: Process Media with GCP ---"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/facade/process-media" \
  -H "Content-Type: application/json" \
  -d '{"provider":"gcp","fileName":"document.pdf","fileContentBase64":"JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoK..."}')
echo "GCP facade result: $RESPONSE"

# Test 3: Process Media with Local
echo ""
echo "--- Test 3: Process Media with Local ---"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/facade/process-media" \
  -H "Content-Type: application/json" \
  -d '{"provider":"local","fileName":"test-image.jpg","fileContentBase64":"/9j/4AAQSkZJRgABAQEAYABgAAD..."}')
echo "Local facade result: $RESPONSE"

# Test 4: Invalid Provider
echo ""
echo "--- Test 4: Invalid Provider ---"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/facade/process-media" \
  -H "Content-Type: application/json" -d '{"provider":"invalid-provider","fileName":"test.txt"}')
echo "Invalid provider status: $STATUS (expected: 400)"

# Test 5: Missing File Name
echo ""
echo "--- Test 5: Missing File Name (Auto-generated) ---"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/facade/process-media" \
  -H "Content-Type: application/json" \
  -d '{"provider":"local","fileContentBase64":"SGVsbG8gV29ybGQ="}')
echo "Auto-name result: $RESPONSE"

echo ""
echo "=== Facade Tests Complete ==="