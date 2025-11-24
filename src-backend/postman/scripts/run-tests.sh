#!/bin/bash

echo "========================================"
echo "   Job Seeker API Test Automation"
echo "========================================"
echo ""

# Check if Newman is installed
if ! command -v newman &> /dev/null; then
    echo "Error: Newman is not installed!"
    echo "Please install Newman globally: npm install -g newman"
    exit 1
fi

echo "Starting Newman test execution..."
echo ""

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Run the collection with environment
newman run "$SCRIPT_DIR/../collections/job-seeker-tests.json" \
    --environment "$SCRIPT_DIR/../environments/dev_env.json" \
    --reporters cli \
    --bail \
    --insecure \
    --timeout-request 10000 \
    --delay-request 500 \
    --color on

echo ""
echo "========================================"
echo "Test execution completed!"
echo "========================================"