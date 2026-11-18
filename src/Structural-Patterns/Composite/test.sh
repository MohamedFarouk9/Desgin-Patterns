#!/bin/bash
# Composite Pattern Test Script

BASE_URL="http://localhost:3000"

echo "=== Composite Pattern Tests ==="
echo ""

# Test 1: Create Article with Composite Structure
echo "--- Test 1: Create Article with Composite Structure ---"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/composite/create-article" \
  -H "Content-Type: application/json" \
  -d '{"title":"Getting Started with TypeScript","content":"TypeScript is a strongly typed superset of JavaScript...","sections":[{"title":"Introduction","paragraphs":["Welcome to this comprehensive guide on TypeScript.","We will cover basics, types, and advanced features."]},{"title":"Core Concepts","paragraphs":["Static typing helps catch errors early.","Interfaces define object shapes."]}]}')
echo "Article result: $RESPONSE"

# Test 2: Simple Article (No Sections)
echo ""
echo "--- Test 2: Simple Article (No Sections) ---"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/composite/create-article" \
  -H "Content-Type: application/json" \
  -d '{"title":"Quick Update","content":"Just a short announcement post."}')
echo "Simple article result: $RESPONSE"

# Test 3: Invalid Request
echo ""
echo "--- Test 3: Invalid Request (Missing Title) ---"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/composite/create-article" \
  -H "Content-Type: application/json" -d '{"content":"Missing title"}')
echo "Missing title status: $STATUS (expected: 400)"

echo ""
echo "=== Composite Tests Complete ==="