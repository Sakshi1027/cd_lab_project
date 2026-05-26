#!/bin/bash
# Run script for Precision-Aware Compiler IDE verification (HPE Evaluation)

echo "=== Precision-Aware Compiler Verification Suite ==="

# Check if verify.py exists
if [ ! -f "build/verify.py" ]; then
    echo "Error: verify.py not found in build directory. Please run ./build.sh first, or ensure verify.py is present."
    exit 1
fi

echo "Running Verification on all Test Cases..."
echo "========================================="

# Loop through all .c files in the testcases directory
for testcase in testcases/*.c; do
    echo "-----------------------------------------"
    echo "Evaluating Kernel: $testcase"
    python build/verify.py "$testcase"
    echo ""
done

echo "=== Verification Suite Complete ==="
