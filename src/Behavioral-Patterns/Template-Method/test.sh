#!/bin/bash
# Template Method Pattern Test Script

BASE_URL="http://localhost:3000"

echo "=== Template Method Pattern Tests ==="
echo ""

# Test 1: Registered User
echo "--- Test 1: Registered User (Valid) ---"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/template-method/registered" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer valid-token" \
  -d '{"name":"John Doe","email":"john@example.com"}')
echo "Registered user: $RESPONSE"

# Test 2: Missing Email
echo ""
echo "--- Test 2: Registered User Missing Email ---"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/template-method/registered" \
  -H "Content-Type: application/json" -H "Authorization: Bearer valid-token" -d '{"name":"John Doe"}')
echo "Missing email status: $STATUS (expected: 400)"

# Test 3: Admin Valid
echo ""
echo "--- Test 3: Admin Request (Valid) ---"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/template-method/admin" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin-token" \
  -H "X-Admin-Role: true" \
  -d '{"name":"Admin User","email":"admin@example.com","department":"Engineering"}')
echo "Admin valid: $RESPONSE"

# Test 4: Missing Department
echo ""
echo "--- Test 4: Admin Missing Department ---"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/template-method/admin" \
  -H "Content-Type: application/json" -H "Authorization: Bearer admin-token" -H "X-Admin-Role: true" -d '{"name":"Admin User","email":"admin@example.com"}')
echo "Missing department status: $STATUS (expected: 422)"

# Test 5: Demo
echo ""
echo "--- Test 5: Demo Endpoint ---"
RESPONSE=$(curl -s -X GET "$BASE_URL/api/template-method/demo")
echo "Demo: $RESPONSE"

echo ""
echo "=== Template Method Tests Complete ==="