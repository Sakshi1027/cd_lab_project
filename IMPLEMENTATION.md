# Implementation Details: LLVM/Clang Engine

This document details the specific systems programming and LLVM API technologies used to implement the compiler backend.

## 1. The Clang Tooling Infrastructure
The core engine is built using C++17 and the `LibTooling` API provided by LLVM/Clang. `LibTooling` is specifically designed for writing standalone refactoring tools. 

We utilize a `FrontendAction` to hook into the compiler's parsing phase, providing us direct access to the AST immediately after the preprocessor and lexer have finished execution.

## 2. AST Matching
Finding specific mathematical operations in a massive C program can be computationally expensive. We implemented `ASTMatchers`, a domain-specific language within Clang that allows us to query the AST powerfully and declaratively.

```cpp
// Example Conceptual Matcher
StatementMatcher MathAssignmentMatcher = binaryOperator(
    hasOperatorName("="),
    hasLHS(declRefExpr(to(varDecl(hasType(asString("float")))))),
    hasRHS(expr().bind("rhs_math_expr"))
).bind("assignment");
```
By binding these nodes, our `MatchCallback` function is automatically triggered only when a valid floating-point assignment occurs, completely bypassing irrelevant nodes like strings, loops, or integers.

## 3. The Clang Rewriter API
Modifying source code safely requires tracking exact line and column numbers. We utilize the `clang::Rewriter` class, which manages a buffer of the original source file.

When a variable is mathematically proven safe for demotion via our Interval Arithmetic engine, we extract its `SourceLocation` (the exact byte offset in the source file where the variable is declared).

```cpp
// Example Replacement Logic
SourceLocation typeStartLoc = varDecl->getTypeSpecStartLoc();
SourceLocation typeEndLoc = varDecl->getTypeSpecEndLoc();

// Replace "float" with "_Float16"
rewriter.ReplaceText(SourceRange(typeStartLoc, typeEndLoc), "_Float16");
```
This ensures we only modify the specific variable type and do not accidentally overwrite variables with similar names.

## 4. Verification Script (Python)
Because floating-point errors are highly dependent on the underlying hardware architecture, static analysis alone is not enough. We implemented a dynamic verification pipeline using a Python `subprocess` script (`verify.py`).

The script orchestrates the following:
1. Compiles the original, un-demoted C code natively using `gcc -O3`.
2. Executes the binary and records the high-precision output.
3. Invokes our C++ Clang tool to generate the `_Float16` demoted C code.
4. Compiles the new demoted code.
5. Executes the new binary and records the output.
6. Calculates the absolute error: `abs(baseline_output - optimized_output)`.
7. Asserts that the absolute error remains below the user-defined acceptable threshold.
