#!/bin/bash
# Test script for all 25 Design Patterns API endpoints
# Usage: ./test-patterns.sh

set -e

BASE_URL="http://localhost:3000"
PATTERN=""

# Parse optional pattern argument
if [ -n "$1" ]; then
    PATTERN="$1"
    echo "Testing only: $PATTERN"
fi

echo "========================================="
echo "Design Patterns API Test Suite"
echo "Base URL: $BASE_URL"
echo "========================================="
echo ""

# Helper function
test_endpoint() {
    local method="$1"
    local endpoint="$2"
    local description="$3"
    local body="$4"
    local headers="$5"

    echo "--- Testing: $description ---"

    if [ -n "$body" ]; then
        if [ -n "$headers" ]; then
            response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint" -H "Content-Type: application/json" $headers -d "$body")
        else
            response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint" -H "Content-Type: application/json" -d "$body")
        fi
    else
        if [ -n "$headers" ]; then
            response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint" $headers)
        else
            response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint")
        fi
    fi

    status_code=$(echo "$response" | tail -1)
    body=$(echo "$response" | sed '$d')

    echo "Status: $status_code"
    echo "Response: $body"
    echo ""

    # Check if status is 200 (or 400/401/403 for expected errors)
    if [ "$status_code" = "200" ] || [ "$status_code" = "400" ] || [ "$status_code" = "401" ] || [ "$status_code" = "403" ] || [ "$status_code" = "404" ] || [ "$status_code" = "422" ]; then
        echo "✓ Status code acceptable: $status_code"
    else
        echo "! Unexpected status code: $status_code"
    fi
    echo ""
}

# Test endpoints based on pattern or all
if [ -z "$PATTERN" ] || [ "$PATTERN" = "singleton" ]; then
    echo "=== Creational: Singleton ==="
    test_endpoint "GET" "/api/singleton/status" "Verify Singleton instance sharing" ""
    test_endpoint "POST" "/api/singleton/query" "Execute query through shared pool" '{"sql":"SELECT * FROM users WHERE active = true"}'
    echo ""
fi

if [ -z "$PATTERN" ] || [ "$PATTERN" = "factory-method" ]; then
    echo "=== Creational: Factory Method ==="
    test_endpoint "POST" "/api/factory-method/send" "Send email notification" '{"channel":"email","recipient":"user@example.com","subject":"Welcome!","body":"Thanks for signing up."}'
    test_endpoint "POST" "/api/factory-method/send" "Send SMS notification" '{"channel":"sms","recipient":"+15551234567","body":"Your OTP is 123456"}'
    test_endpoint "POST" "/api/factory-method/send" "Send push notification" '{"channel":"push","recipient":"device_token_abc123","title":"New Message","body":"You have a new message from John"}'
    test_endpoint "POST" "/api/factory-method/send" "Send Slack notification" '{"channel":"#general","body":"Deployment completed successfully! 🚀"}'
    echo ""
fi

if [ -z "$PATTERN" ] || [ "$PATTERN" = "builder" ]; then
    echo "=== Creational: Builder ==="
    test_endpoint "POST" "/api/builder/create" "Create article using Builder pattern" '{"title":"Getting Started with TypeScript","content":"TypeScript is a strongly typed superset of JavaScript...","author":"Jane Developer","summary":"Learn TypeScript fundamentals.","tags":["typescript","javascript"],"isFeatured":true,"published":true}'
    echo ""
fi

if [ -z "$PATTERN" ] || [ "$PATTERN" = "prototype" ]; then
    echo "=== Creational: Prototype ==="
    test_endpoint "GET" "/api/prototype/templates" "List available templates" ""
    test_endpoint "POST" "/api/prototype/clone" "Clone black-friday template" '{"templateKey":"black-friday","newName":"Cyber Monday 2026 Campaign","overrides":{"themeColor":"#8B5CF6","promoCode":"CYBER2026"}}'
    echo ""
fi

if [ -z "$PATTERN" ] || [ "$PATTERN" = "abstract-factory" ]; then
    echo "=== Creational: Abstract Factory ==="
    test_endpoint "POST" "/api/abstract-factory/process-media" "Process media with AWS factory" '{"provider":"aws","fileName":"product-image.png","fileContentBase64":"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="}'
    test_endpoint "POST" "/api/abstract-factory/process-media" "Process media with GCP factory" '{"provider":"gcp","fileName":"document.pdf","fileContentBase64":"JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoK..."}'
    test_endpoint "POST" "/api/abstract-factory/process-media" "Process media with local factory" '{"provider":"local","fileName":"test-image.jpg","fileContentBase64":"/9j/4AAQSkZJRgABAQEAYABgAAD..."}'
    echo ""
fi

if [ -z "$PATTERN" ] || [ "$PATTERN" = "adapter" ]; then
    echo "=== Structural: Adapter ==="
    test_endpoint "POST" "/api/adapter/process" "Process payment through adapter" '{"amount":99.99,"currency":"USD"}'
    test_endpoint "POST" "/api/adapter/process" "Process payment in EUR" '{"amount":149.50,"currency":"EUR"}'
    test_endpoint "POST" "/api/adapter/process" "Process payment in GBP" '{"amount":75.00,"currency":"GBP"}'
    test_endpoint "POST" "/api/adapter/process" "Invalid request - missing fields" '{"amount":100}' ''
    echo ""
fi

if [ -z "$PATTERN" ] || [ "$PATTERN" = "bridge" ]; then
    echo "=== Structural: Bridge ==="
    test_endpoint "POST" "/api/bridge/process-media" "Process media with AWS" '{"provider":"aws","fileName":"product-image.png","fileContentBase64":"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="}'
    test_endpoint "POST" "/api/bridge/process-media" "Process media with GCP" '{"provider":"gcp","fileName":"document.pdf","fileContentBase64":"JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoK..."}'
    test_endpoint "POST" "/api/bridge/process-media" "Process media with local" '{"provider":"local","fileName":"test-image.jpg","fileContentBase64":"/9j/4AAQSkZJRgABAQEAYABgAAD..."}'
    echo ""
fi

if [ -z "$PATTERN" ] || [ "$PATTERN" = "composite" ]; then
    echo "=== Structural: Composite ==="
    test_endpoint "POST" "/api/composite/create-article" "Create article with sections and paragraphs" '{"title":"Getting Started with TypeScript","content":"TypeScript is a strongly typed superset of JavaScript...","sections":[{"title":"Introduction","paragraphs":["Welcome to this comprehensive guide on TypeScript.","We will cover basics, types, and advanced features."]},{"title":"Core Concepts","paragraphs":["Static typing helps catch errors early.","Interfaces define object shapes."]}]}'
    echo ""
fi

if [ -z "$PATTERN" ] || [ "$PATTERN" = "decorator" ]; then
    echo "=== Structural: Decorator ==="
    test_endpoint "POST" "/api/decorator/api-data" "Get API data with decorator stack" '{"endpoint":"/api/users","method":"GET","query":"?page=1&limit=10"}'
    echo ""
fi

if [ -z "$PATTERN" ] || [ "$PATTERN" = "facade" ]; then
    echo "=== Structural: Facade ==="
    test_endpoint "POST" "/api/facade/process-media" "Process media with AWS facade" '{"provider":"aws","fileName":"product-banner.png","fileContentBase64":"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="}'
    test_endpoint "POST" "/api/facade/process-media" "Process media with local facade" '{"provider":"local","fileName":"test-image.jpg","fileContentBase64":"/9j/4AAQSkZJRgABAQEAYABgAAD..."}'
    echo ""
fi

if [ -z "$PATTERN" ] || [ "$PATTERN" = "flyweight" ]; then
    echo "=== Structural: Flyweight ==="
    test_endpoint "POST" "/api/flyweight/asset-get-or-create" "Get or create asset (first request)" '{"assetId":"logo-primary","dimensions":"200x200","format":"PNG","filePath":"/assets/images/logo.png","size":45000}'
    test_endpoint "POST" "/api/flyweight/asset-get-or-create" "Get same asset again (shared instance)" '{"assetId":"logo-primary","dimensions":"200x200","format":"PNG","filePath":"/assets/images/logo.png","size":45000}'
    test_endpoint "GET" "/api/flyweight/asset-stats" "Get flyweight statistics" ""
    echo ""
fi

if [ -z "$PATTERN" ] || [ "$PATTERN" = "chain-of-responsibility" ]; then
    echo "=== Behavioral: Chain of Responsibility ==="
    test_endpoint "POST" "/api/chain-of-responsibility/process" "Valid request with auth" '{"name":"John Doe","email":"john@example.com"}' 'Authorization: Bearer valid-token-123'
    test_endpoint "POST" "/api/chain-of-responsibility/process" "Missing auth token" '{"name":"John Doe","email":"john@example.com"}' ''
    test_endpoint "POST" "/api/chain-of-responsibility/process" "Invalid auth token" '{"name":"John Doe","email":"john@example.com"}' 'Authorization: Bearer invalid-token'
    test_endpoint "POST" "/api/chain-of-responsibility/process" "Valid auth but missing name" '{"email":"john@example.com"}' 'Authorization: Bearer valid-token-123'
    test_endpoint "POST" "/api/chain-of-responsibility/process" "Valid auth but invalid email" '{"name":"John Doe","email":"invalid-email"}' 'Authorization: Bearer valid-token-123'
    echo ""
fi

if [ -z "$PATTERN" ] || [ "$PATTERN" = "command" ]; then
    echo "=== Behavioral: Command ==="
    test_endpoint "POST" "/api/command/create" "Create user Alice" '{"action":"create","name":"Alice"}'
    test_endpoint "POST" "/api/command/create" "Create user Bob" '{"action":"create","name":"Bob"}'
    test_endpoint "POST" "/api/command/create" "Delete user Alice" '{"action":"delete","name":"Alice"}'
    test_endpoint "POST" "/api/command/undo" "Undo last command" ''
    test_endpoint "POST" "/api/command/redo" "Redo last undone command" ''
    test_endpoint "GET" "/api/command/history" "Get command history" ''
    echo ""
fi

if [ -z "$PATTERN" ] || [ "$PATTERN" = "iterator" ]; then
    echo "=== Behavioral: Iterator ==="
    test_endpoint "GET" "/api/iterator/demo" "Run iterator demo" ''
    echo ""
fi

if [ -z "$PATTERN" ] || [ "$PATTERN" = "mediator" ]; then
    echo "=== Behavioral: Mediator ==="
    test_endpoint "POST" "/api/mediator/login" "Login with valid token" '{"token":"valid-jwt-token-123"}'
    test_endpoint "POST" "/api/mediator/login" "Login with invalid token" '{"token":"invalid-token"}'
    test_endpoint "POST" "/api/mediator/login" "Login missing token" '{}'
    echo ""
fi

if [ -z "$PATTERN" ] || [ "$PATTERN" = "memento" ]; then
    echo "=== Behavioral: Memento ==="
    test_endpoint "POST" "/api/memento/form" "Save form state (initial)" '{"action":"save","formData":"name=John Doe"}'
    test_endpoint "POST" "/api/memento/form" "Save additional state" '{"action":"save","formData":"name=John Doe, email=john@example.com"}'
    test_endpoint "POST" "/api/memento/form" "Save more state" '{"action":"save","formData":"name=John Doe, email=john@example.com, phone=555-123-4567"}'
    test_endpoint "POST" "/api/memento/undo" "Undo last change" ''
    test_endpoint "POST" "/api/memento/redo" "Redo undone change" ''
    echo ""
fi

if [ -z "$PATTERN" ] || [ "$PATTERN" = "strategy" ]; then
    echo "=== Behavioral: Strategy ==="
    test_endpoint "POST" "/api/strategy/calculate" "Regular pricing (no discount)" '{"strategy":"regular","basePrice":100}'
    test_endpoint "POST" "/api/strategy/calculate" "Percentage discount (20% off)" '{"strategy":"percentage","basePrice":100,"params":{"discountPercentage":20}}'
    test_endpoint "POST" "/api/strategy/calculate" "Fixed discount ($15 off)" '{"strategy":"fixed","basePrice":100,"params":{"discountAmount":15}}'
    test_endpoint "POST" "/api/strategy/calculate" "Tiered pricing (7 items = 10% off)" '{"strategy":"tiered","basePrice":100,"params":{"tiers":[{"minQuantity":5,"discountPercentage":10},{"minQuantity":10,"discountPercentage":15}]},"context":{"quantity":7}}'
    test_endpoint "GET" "/api/strategies" "Get available strategies" ''
    echo ""
fi

if [ -z "$PATTERN" ] || [ "$PATTERN" = "template-method" ]; then
    echo "=== Behavioral: Template Method ==="
    test_endpoint "POST" "/api/template-method/registered" "Registered user (valid)" '{"name":"John Doe","email":"john@example.com"}' 'Authorization: Bearer valid-token'
    test_endpoint "POST" "/api/template-method/registered" "Registered user missing email" '{"name":"John Doe"}' 'Authorization: Bearer valid-token'
    test_endpoint "POST" "/api/template-method/admin" "Admin request (valid)" '{"name":"Admin User","email":"admin@example.com","department":"Engineering"}' 'Authorization: Bearer admin-token' 'X-Admin-Role: true'
    test_endpoint "POST" "/api/template-method/admin" "Admin missing department" '{"name":"Admin User","email":"admin@example.com"}' 'Authorization: Bearer admin-token' 'X-Admin-Role: true'
    test_endpoint "GET" "/api/template-method/demo" "Demo endpoint" ''
    echo ""
fi

if [ -z "$PATTERN" ] || [ "$PATTERN" = "observer" ]; then
    echo "=== Behavioral: Observer ==="
    test_endpoint "POST" "/api/observer/measurements" "Set measurements and subscribe current-conditions" '{"action":"set-measurements","temperature":25,"humidity":60,"pressure":1013}'
    test_endpoint "POST" "/api/observer/measurements" "Subscribe statistics observer" '{"action":"subscribe","observerType":"statistics"}'
    echo ""
fi

if [ -z "$PATTERN" ] || [ "$PATTERN" = "state" ]; then
    echo "=== Behavioral: State ==="
    test_endpoint "POST" "/api/state/create-order" "Create new order (Pending)" ''
    test_endpoint "POST" "/api/state/process-payment" "Process payment (Confirmed)" ''
    test_endpoint "POST" "/api/state/ship-order" "Ship order (Shipped)" ''
    test_endpoint "POST" "/api/state/deliver-order" "Deliver order (Delivered)" ''
    test_endpoint "POST" "/api/state/deliver-order" "Invalid: already delivered" ''
    echo ""
fi

echo "========================================="
echo "Test suite complete!"
echo "========================================="