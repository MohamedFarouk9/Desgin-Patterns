#!/bin/bash
# Builder Pattern Test Script

BASE_URL="http://localhost:3000"

echo "=== Builder Pattern Tests ==="
echo ""

# Test 1: Create Article Using Builder
echo "--- Test 1: Create Article Using Builder ---"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/builder/create" \
  -H "Content-Type: application/json" \
  -d '{"title":"Getting Started with TypeScript","content":"TypeScript is a strongly typed superset of JavaScript...","author":"Jane Developer","summary":"Learn TypeScript fundamentals.","tags":["typescript","javascript"],"isFeatured":true,"published":true}')
echo "Article result: $RESPONSE"

# Test 2: Create Breaking News Post (Director Recipe)
echo ""
echo "--- Test 2: Create Breaking News Post ---"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/builder/create" \
  -H "Content-Type: application/json" \
  -d '{"title":"Major Framework Release Announced","content":"The team behind React has just announced version 19...","author":"Tech News Team","featuredImage":"https://cdn.example.com/react19-banner.png","published":true}')
echo "Breaking news result: $RESPONSE"

# Test 3: Create SEO-Optimized Post
echo ""
echo "--- Test 3: Create SEO-Optimized Post ---"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/builder/create" \
  -H "Content-Type: application/json" \
  -d '{"title":"Complete Guide to Design Patterns","content":"Design patterns are reusable solutions to common problems...","author":"Senior Architect","summary":"Master all 23 GoF design patterns with real-world examples.","tags":["design-patterns","architecture"],"seo":{"keywords":["design patterns","gof"]},"published":true}')
echo "SEO result: $RESPONSE"

# Test 4: Validation Error
echo ""
echo "--- Test 4: Validation Error (Missing Content) ---"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/builder/create" \
  -H "Content-Type: application/json" -d '{"title":"Incomplete Article"}')
echo "Missing content status: $STATUS (expected: 400)"

echo ""
echo "=== Builder Tests Complete ==="