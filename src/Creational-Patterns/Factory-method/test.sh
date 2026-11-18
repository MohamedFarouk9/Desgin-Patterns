#!/bin/bash
# Factory Method Pattern Test Script

BASE_URL="http://localhost:3000"

echo "=== Factory Method Pattern Tests ==="
echo ""

# Test 1: Send Email Notification
echo "--- Test 1: Send Email Notification ---"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/factory-method/send" \
  -H "Content-Type: application/json" \
  -d '{"channel":"email","recipient":"user@example.com","subject":"Welcome!","body":"Thanks for signing up."}')
echo "Email result: $RESPONSE"

# Test 2: Send SMS Notification
echo ""
echo "--- Test 2: Send SMS Notification ---"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/factory-method/send" \
  -H "Content-Type: application/json" \
  -d '{"channel":"sms","recipient":"+15551234567","body":"Your OTP is 123456"}')
echo "SMS result: $RESPONSE"

# Test 3: Send Push Notification
echo ""
echo "--- Test 3: Send Push Notification ---"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/factory-method/send" \
  -H "Content-Type: application/json" \
  -d '{"channel":"push","recipient":"device_token_abc123","title":"New Message","body":"You have a new message from John"}')
echo "Push result: $RESPONSE"

# Test 4: Send Slack Notification
echo ""
echo "--- Test 4: Send Slack Notification ---"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/factory-method/send" \
  -H "Content-Type: application/json" \
  -d '{"channel":"#general","body":"Deployment completed successfully! 🚀"}')
echo "Slack result: $RESPONSE"

# Test 5: Invalid Channel
echo ""
echo "--- Test 5: Invalid Channel ---"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/factory-method/send" \
  -H "Content-Type: application/json" -d '{"channel":"invalid","recipient":"test@test.com"}')
echo "Invalid channel status: $STATUS (expected: 400)"

echo ""
echo "=== Factory Method Tests Complete ==="