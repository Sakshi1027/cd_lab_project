#!/bin/bash
# Build script for Precision-Aware Compiler IDE (HPE Evaluation)

echo "=== Building Compiler Engine ==="

# Create build directory
mkdir -p build
cd build

# Generate build files using CMake
echo "Running CMake Configuration..."
cmake -G Ninja ..

# Compile using Ninja
echo "Compiling C++ Tool (This may take a few minutes if first time)..."
cmake --build .

echo "Build successful! Tool binary is located in the 'build' directory."
echo "You can now run the evaluation using ./run.sh"
