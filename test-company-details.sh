#!/bin/bash

# Company Details Debug Script
echo "🔍 Testing Company Details Feature..."
echo ""

# Get company ID from homepage
echo "1️⃣ Getting company list..."
COMPANY_ID=$(curl -s "http://localhost:5001/api/js/companies?limit=1" | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$COMPANY_ID" ]; then
    echo "❌ No companies found in database"
    exit 1
fi

echo "✅ Found company ID: $COMPANY_ID"
echo ""

# Test company detail API
echo "2️⃣ Testing company detail API..."
echo "GET /api/js/companies/$COMPANY_ID"
echo ""

RESPONSE=$(curl -s "http://localhost:5001/api/js/companies/$COMPANY_ID")
echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
echo ""

# Check if response has required fields
if echo "$RESPONSE" | grep -q "companyName"; then
    echo "✅ Company name found"
else
    echo "❌ Company name missing"
fi

if echo "$RESPONSE" | grep -q "jobs"; then
    echo "✅ Jobs data found"
else
    echo "⚠️  Jobs data missing (might be empty array)"
fi

echo ""
echo "3️⃣ Test URL:"
echo "Frontend: http://localhost:5173/companies/$COMPANY_ID"
echo ""

echo "4️⃣ All companies in database:"
curl -s "http://localhost:5001/api/js/companies?limit=100" | python3 -c "
import sys, json
data = json.load(sys.stdin)
companies = data.get('data', {}).get('data', [])
print(f'Total companies: {len(companies)}\n')
for i, company in enumerate(companies, 1):
    print(f'{i}. {company.get(\"companyName\", \"N/A\")}')
    print(f'   ID: {company.get(\"_id\")}')
    print(f'   Jobs: {company.get(\"totalJobs\", 0)}')
    print(f'   URL: http://localhost:5173/companies/{company.get(\"_id\")}')
    print()
" 2>/dev/null

echo ""
echo "✅ Debug script completed!"
