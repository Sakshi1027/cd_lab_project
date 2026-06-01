# Design Document: Precision-Aware Type Demotion

## 1. Project Overview & Objective
Modern machine learning (ML) kernels and digital signal processing (DSP) workloads heavily rely on floating-point arithmetic. Traditionally, `float` (FP32) is used, which consumes significant memory bandwidth and power. The objective of this project is to build a compiler tool that automatically and safely demotes FP32 computations to FP16 (`_Float16`) without exceeding a user-defined mathematical error threshold.

## 2. Core Approach

Our design relies on a multi-pass Source-to-Source translation approach acting on the Abstract Syntax Tree (AST):

### 2.1 Lexical & Syntax Analysis
Instead of using fragile regular expressions to parse C code, we leverage the **LLVM/Clang C++ API**. Clang parses the raw source code into a robust, strictly-typed Abstract Syntax Tree (AST). This allows our tool to deeply understand the program's grammatical structure, scope blocks, and data types seamlessly.

### 2.2 Data-Flow Graph Extraction
Once the AST is built, we use Clang's `ASTMatchers` to isolate floating-point mathematical assignment statements (e.g., `x = a + b`). The tool extracts the Right-Hand Side (RHS) mathematical operations and builds an in-memory Data-Flow Graph (DFG). In this graph, nodes represent variables, and directed edges represent the flow of data and dependencies.

### 2.3 Backward Precision Propagation (Interval Arithmetic)
This is the mathematical core of the engine. Starting from the final output variable of a kernel (which holds the strict global error tolerance constraint, e.g., $E \le 0.05$), the algorithm performs a backward traversal of the DFG.
- It distributes the "Error Budget" to child nodes based on the severity of the mathematical operation (e.g., multiplications amplify error more than additions).
- If an intermediate variable's computed error budget is large enough to survive the quantization loss of FP16 format (i.e., greater than the FP16 machine epsilon), the variable is flagged as **SAFE**.
- If the budget is too small, the variable must remain in FP32.

### 2.4 Code Generation
A final pass uses the `clang::Rewriter` API. The tool maps the variables flagged as "SAFE" back to their original physical locations in the source code file and safely overwrites the `float` type keyword to `_Float16`. 

## 3. Alternatives Considered

### Alternative 1: Regular Expression (Regex) Rewriting
**Approach:** Write a Python script using regex to find `float x = ...` and replace it.
**Why it was rejected:** Regex cannot understand C++ scope rules, pointer aliasing, or invisible implicit casts. Replacing variables blindly with regex leads to compilation errors and unsafe program states. Using the LLVM AST guarantees syntactical and semantic correctness.

### Alternative 2: LLVM Intermediate Representation (IR) Pass
**Approach:** Write an LLVM compiler pass that runs during the optimization phase, modifying the LLVM IR bitcode directly.
**Why it was rejected:** While an LLVM IR pass is extremely fast, it modifies the low-level bitcode. Our goal was to build a **Source-to-Source** tool. Outputting C source code allows the developer to inspect, read, and understand exactly what the tool changed. LLVM IR is not human-readable. Therefore, Clang's AST Rewriter was chosen as the optimal middle-ground.
