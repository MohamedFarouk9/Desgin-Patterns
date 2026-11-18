#!/bin/bash
# Memento Pattern Test Script

BASE_URL="http://localhost:3000"

echo "=== Memento Pattern Tests ==="
echo ""

# Test 1: Save Form State
echo "--- Test 1: Save Form State (Initial) ---"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/memento/form" \
  -H "Content-Type: application/json" \
  -d '{"action":"save","formData":"name=John Doe"}')
echo "First save: $RESPONSE"

# Test 2: Save Additional State
echo ""
echo "--- Test 2: Save Additional State ---"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/memento/form" \
  -H "Content-Type: application/json" \
  -d '{"action":"save","formData":"name=John Doe, email=john@example.com"}')
echo "Second save: $RESPONSE"

# Test 3: Save More State
echo ""
echo "--- Test 3: Save More State ---"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/memento/form" \
  -H "Content-Type: application/json" \
  -d '{"action":"save","formData":"name=John Doe, email=john@example.com, phone=555-123-4567"}')
echo "Third save: $RESPONSE"

# Test 4: Undo
echo ""
echo "--- Test 4: Undo Last Change ---"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/memento/undo")
echo "Undo result: $RESPONSE"

# Test 5: Redo
echo ""
echo "--- Test 5: Redo Undone Change ---"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/memento/redo")
echo "Redo result: $RESPONSE"

echo ""
echo "=== Memento Tests Complete ==="