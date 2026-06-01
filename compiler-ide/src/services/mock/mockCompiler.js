export const MOCK_COMPILER_RESPONSES = {
  "test.c": {
    success: true,
    tokensCount: 32,
    errorMargin: "0.0",
    memorySaving: "100.0%",
    estimatedSpeedup: "2.1x",
    problems: [],
    outputs: {
      lexical: "[SUCCESS] Lexical analysis completed.\nTotal Tokens: 32\nNo lexical errors found.\nKeywords: 3, Identifiers: 8, Numbers: 4, Operators: 5, Symbols: 12",
      syntax: "[SUCCESS] Syntax analysis completed.\nParse tree generated.\nParsed 1 function definition 'main' with 3 local float variable declarations.",
      semantic: "[SUCCESS] Semantic analysis completed.\nType checking: PASSED.\nScope check: 3 variables resolved correctly in 'main' block scope.",
      intermediate: "=== DELIVERABLE 1: AST Analysis & Data-Flow Extraction ===\nNode [c] (Type: float)\n  -> Math Operation: + 5.000000e+00\n  <- Depends on [b]\nNode [b] (Type: float)\n  -> Math Operation: * 2.000000e+00\n  <- Depends on [a]\nNode [a] (Type: float)",
      optimized: "=== DELIVERABLE 2: Backward Precision Propagation Engine ===\nVariable [c]\n  -> Error Budget: 5.000000e-02\n  -> STATUS: SAFE for FP16 Demotion! \n\nVariable [b]\n  -> Error Budget: 5.000000e-02\n  -> STATUS: SAFE for FP16 Demotion! \n\nVariable [a]\n  -> Error Budget: 2.500000e-02\n  -> STATUS: SAFE for FP16 Demotion!",
      generated: "int main() {\n    _Float16 a, b, c;  // <-- Automatically changed from float!\n    a = 10.0;\n    b = a * 2.0;\n    c = b + 5.0;\n    return 0;\n}",
      llvm_ir: "=== LLVM IR (Intermediate Representation) ===\n; ModuleID = \'test_kernel\'\ntarget datalayout = \"e-m:e-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128\"\n\n%struct.Node = type { ptr, i32 }\n\ndefine dso_local void @compute() #0 {\nentry:\n  %x.addr = alloca half, align 2\n  %y.addr = alloca half, align 2\n  store half 0xH3C00, ptr %x.addr, align 2\n  store half 0xH4000, ptr %y.addr, align 2\n  ret void\n}\n",
      logs: "=== DELIVERABLE 4 & 5: Dual-Precision Kernel Verification (../test.c) ===\n\n[1] Compiling Original FP32 Code...\n    Original FP32 Result: 25.0\n[2] Running Precision-Aware Demotion Tool...\n[3] Compiling Demoted FP16 Code...\n    Demoted FP16 Result: 25.0\n[4] Verifying Error Tolerance...\n    Absolute Error: 0.0\n\n✅ VERIFICATION PASSED: The absolute error (0.0) is within the allowable budget (0.05)."
    }
  },
  "kernel_dot_product.c": {
    success: true,
    tokensCount: 33,
    errorMargin: "0.0",
    memorySaving: "100.0%",
    estimatedSpeedup: "2.1x",
    problems: [],
    outputs: {
      lexical: "[SUCCESS] Lexical analysis completed.\nTotal Tokens: 33\nNo lexical errors found.\nKeywords: 5, Identifiers: 9, Numbers: 3, Operators: 5, Symbols: 11",
      syntax: "[SUCCESS] Syntax analysis completed.\nParse tree generated.\nParsed 1 function definition 'dot_product'.",
      semantic: "[SUCCESS] Semantic analysis completed.\nType checking: PASSED.\nNo undeclared variables accessed.",
      intermediate: "=== DELIVERABLE 1: AST Analysis & Data-Flow Extraction ===\nNode [final_dot] (Type: float)\n  -> Math Operation: + 1.000000e+01\n  <- Depends on [prod]\nNode [prod] (Type: float)\n  -> Math Operation: * 0.000000e+00\n  <- Depends on [a_val]\n  <- Depends on [b_val]\nNode [b_val] (Type: float)\nNode [a_val] (Type: float)",
      optimized: "=== DELIVERABLE 2: Backward Precision Propagation Engine ===\nVariable [final_dot]\n  -> Error Budget: 5.000000e-02\n  -> STATUS: SAFE for FP16 Demotion! \n\nVariable [prod]\n  -> Error Budget: 5.000000e-02\n  -> STATUS: SAFE for FP16 Demotion! \n\nVariable [b_val]\n  -> Error Budget: 5.000000e-02\n  -> STATUS: SAFE for FP16 Demotion! \n\nVariable [a_val]\n  -> Error Budget: 2.500000e-02\n  -> STATUS: SAFE for FP16 Demotion!",
      generated: "float dot_product() {\n    _Float16 a_val = 1.5;\n    _Float16 b_val = 2.0;\n    _Float16 prod = a_val * b_val;\n    _Float16 final_dot = prod + 10.0;\n    return final_dot;\n}",
      llvm_ir: "=== LLVM IR (Intermediate Representation) ===\n; ModuleID = \'test_kernel\'\ntarget datalayout = \"e-m:e-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128\"\n\n%struct.Node = type { ptr, i32 }\n\ndefine dso_local void @compute() #0 {\nentry:\n  %x.addr = alloca half, align 2\n  %y.addr = alloca half, align 2\n  store half 0xH3C00, ptr %x.addr, align 2\n  store half 0xH4000, ptr %y.addr, align 2\n  ret void\n}\n",
      logs: "=== DELIVERABLE 4 & 5: Dual-Precision Kernel Verification (../kernels/kernel_dot_product.c) ===\n\n[1] Compiling Original FP32 Code...\n    Original FP32 Result: 13.0\n[2] Running Precision-Aware Demotion Tool...\n[3] Compiling Demoted FP16 Code...\n    Demoted FP16 Result: 13.0\n[4] Verifying Error Tolerance...\n    Absolute Error: 0.0\n\n✅ VERIFICATION PASSED: The absolute error (0.0) is within the allowable budget (0.05)."
    }
  },
  "kernel_fir_filter.c": {
    success: true,
    tokensCount: 58,
    errorMargin: "0.0",
    memorySaving: "62.5%",
    estimatedSpeedup: "1.4x",
    problems: [
      { severity: "warning", line: 4, message: "Variable 'coeff1' is declared but never referenced inside equations" }
    ],
    outputs: {
      lexical: "[SUCCESS] Lexical analysis completed.\nTotal Tokens: 58\nNo lexical errors found.\nKeywords: 8, Identifiers: 15, Numbers: 7, Operators: 8, Symbols: 20",
      syntax: "[SUCCESS] Syntax analysis completed.\nParsed function 'fir' with 8 variable declarations.",
      semantic: "[WARNING] Semantic analysis completed with 1 warning.\nLine 4: Variable 'coeff1' is declared but never used.",
      intermediate: "=== DELIVERABLE 1: AST Analysis & Data-Flow Extraction ===\nNode [filtered_out] (Type: float)\n  -> Math Operation: + 1.000000e-02\n  <- Depends on [acc]\nNode [acc] (Type: float)\n  -> Math Operation: + 0.000000e+00\n  <- Depends on [tap0]\n  <- Depends on [tap2]\nNode [tap2] (Type: float)\n  -> Math Operation: * 0.000000e+00\n  <- Depends on [input_val]\n  <- Depends on [coeff2]\nNode [coeff2] (Type: float)\nNode [tap0] (Type: float)\n  -> Math Operation: * 0.000000e+00\n  <- Depends on [input_val]\n  <- Depends on [coeff0]\nNode [coeff0] (Type: float)\nNode [coeff1] (Type: float)\nNode [input_val] (Type: float)",
      optimized: "=== DELIVERABLE 2: Backward Precision Propagation Engine ===\nVariable [filtered_out]\n  -> Error Budget: 5.000000e-02\n  -> STATUS: SAFE for FP16 Demotion! \n\nVariable [acc]\n  -> Error Budget: 5.000000e-02\n  -> STATUS: SAFE for FP16 Demotion! \n\nVariable [tap2]\n  -> Error Budget: 5.000000e-02\n  -> STATUS: SAFE for FP16 Demotion! \n\nVariable [coeff2]\n  -> Error Budget: 5.000000e-02\n  -> STATUS: SAFE for FP16 Demotion! \n\nVariable [tap0]\n  -> Error Budget: 0.000000e+00\n  -> STATUS: MUST STAY FP32 (Error budget too strict)\n\nVariable [coeff0]\n  -> Error Budget: 0.000000e+00\n  -> STATUS: MUST STAY FP32 (Error budget too strict)\n\nVariable [coeff1]\n  -> Error Budget: 0.000000e+00\n  -> STATUS: MUST STAY FP32 (Error budget too strict)\n\nVariable [input_val]\n  -> Error Budget: 5.000000e-02\n  -> STATUS: SAFE for FP16 Demotion!",
      generated: "float fir() {\n    _Float16 input_val = 0.8;\n    float coeff0 = 0.1;\n    float coeff1 = 0.15;\n    _Float16 coeff2 = 0.5;\n    float tap0 = input_val * coeff0;\n    _Float16 tap2 = input_val * coeff2;\n    _Float16 acc = tap0 + tap2;\n    _Float16 filtered_out = acc + 0.01;\n    return filtered_out;\n}",
      llvm_ir: "=== LLVM IR (Intermediate Representation) ===\n; ModuleID = \'test_kernel\'\ntarget datalayout = \"e-m:e-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128\"\n\n%struct.Node = type { ptr, i32 }\n\ndefine dso_local void @compute() #0 {\nentry:\n  %x.addr = alloca half, align 2\n  %y.addr = alloca half, align 2\n  store half 0xH3C00, ptr %x.addr, align 2\n  store half 0xH4000, ptr %y.addr, align 2\n  ret void\n}\n",
      logs: "=== DELIVERABLE 4 & 5: Dual-Precision Kernel Verification (../kernels/kernel_fir_filter.c) ===\n\n[1] Compiling Original FP32 Code...\n    Original FP32 Result: 0.49\n[2] Running Precision-Aware Demotion Tool...\n[3] Compiling Demoted FP16 Code...\n    Demoted FP16 Result: 0.49\n[4] Verifying Error Tolerance...\n    Absolute Error: 0.0\n\n✅ VERIFICATION PASSED: The absolute error (0.0) is within the allowable budget (0.05)."
    }
  },
  "kernel_softmax.c": {
    success: true,
    tokensCount: 77,
    errorMargin: "0.000071",
    memorySaving: "72.7%",
    estimatedSpeedup: "1.7x",
    problems: [],
    outputs: {
      lexical: "[SUCCESS] Lexical analysis completed.\nTotal Tokens: 77\nNo lexical errors found.\nKeywords: 12, Identifiers: 15, Numbers: 6, Operators: 11, Symbols: 33",
      syntax: "[SUCCESS] Syntax analysis completed.\nParsed function 'softmax' containing numerical Taylor Series expansions.",
      semantic: "[SUCCESS] Semantic analysis completed.\nVariables correctly matched.",
      intermediate: "=== DELIVERABLE 1: AST Analysis & Data-Flow Extraction ===\nNode [prob1] (Type: float)\n  -> Math Operation: / 0.000000e+00\n  <- Depends on [exp1]\n  <- Depends on [sum_exp]\nNode [sum_exp] (Type: float)\n  -> Math Operation: + 0.000000e+00\n  <- Depends on [exp1]\n  <- Depends on [exp2]\nNode [term2] (Type: float)\nNode [sum2] (Type: float)\nNode [exp2] (Type: float)\n  -> Math Operation: + 0.000000e+00\n  <- Depends on [sum2]\n  <- Depends on [term2]\nNode [term1] (Type: float)\nNode [exp1] (Type: float)\n  -> Math Operation: + 0.000000e+00\n  <- Depends on [sum1]\n  <- Depends on [term1]\nNode [sum1] (Type: float)\nNode [x2] (Type: float)\nNode [prob2] (Type: float)\n  -> Math Operation: / 0.000000e+00\n  <- Depends on [exp2]\n  <- Depends on [sum_exp]\nNode [x1] (Type: float)",
      optimized: "=== DELIVERABLE 2: Backward Precision Propagation Engine ===\nVariable [prob1]\n  -> Error Budget: 5.000000e-02\n  -> STATUS: SAFE for FP16 Demotion! \n\nVariable [sum_exp]\n  -> Error Budget: 5.000000e-02\n  -> STATUS: SAFE for FP16 Demotion! \n\nVariable [term2]\n  -> Error Budget: 5.000000e-02\n  -> STATUS: SAFE for FP16 Demotion! \n\nVariable [sum2]\n  -> Error Budget: 5.000000e-02\n  -> STATUS: SAFE for FP16 Demotion! \n\nVariable [exp2]\n  -> Error Budget: 5.000000e-02\n  -> STATUS: SAFE for FP16 Demotion! \n\nVariable [term1]\n  -> Error Budget: 5.000000e-02\n  -> STATUS: SAFE for FP16 Demotion! \n\nVariable [exp1]\n  -> Error Budget: 5.000000e-02\n  -> STATUS: SAFE for FP16 Demotion! \n\nVariable [sum1]\n  -> Error Budget: 5.000000e-02\n  -> STATUS: SAFE for FP16 Demotion! \n\nVariable [x2]\n  -> Error Budget: 0.000000e+00\n  -> STATUS: MUST STAY FP32 (Error budget too strict)\n\nVariable [prob2]\n  -> Error Budget: 0.000000e+00\n  -> STATUS: MUST STAY FP32 (Error budget too strict)\n\nVariable [x1]\n  -> Error Budget: 0.000000e+00\n  -> STATUS: MUST STAY FP32 (Error budget too strict)",
      generated: "float softmax() {\n    float x1 = 1.0;\n    float x2 = 0.5;\n    _Float16 term1 = x1 * 1.0;\n    _Float16 sum1 = term1 + 1.0;\n    _Float16 exp1 = sum1 + 0.5;\n    _Float16 term2 = x2 * 1.0;\n    _Float16 sum2 = term2 + 1.0;\n    _Float16 exp2 = sum2 + 0.5;\n    _Float16 sum_exp = exp1 + exp2;\n    _Float16 prob1 = exp1 / sum_exp;\n    float prob2 = exp2 / sum_exp;\n    return prob1;\n}",
      llvm_ir: "=== LLVM IR (Intermediate Representation) ===\n; ModuleID = \'test_kernel\'\ntarget datalayout = \"e-m:e-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128\"\n\n%struct.Node = type { ptr, i32 }\n\ndefine dso_local void @compute() #0 {\nentry:\n  %x.addr = alloca half, align 2\n  %y.addr = alloca half, align 2\n  store half 0xH3C00, ptr %x.addr, align 2\n  store half 0xH4000, ptr %y.addr, align 2\n  ret void\n}\n",
      logs: "=== DELIVERABLE 4 & 5: Dual-Precision Kernel Verification (../kernels/kernel_softmax.c) ===\n\n[1] Compiling Original FP32 Code...\n    Original FP32 Result: 0.664622\n[2] Running Precision-Aware Demotion Tool...\n[3] Compiling Demoted FP16 Code...\n    Demoted FP16 Result: 0.664551\n[4] Verifying Error Tolerance...\n    Absolute Error: 7.100000000004325e-05\n\n✅ VERIFICATION PASSED: The absolute error (7.1e-05) is within the allowable budget (0.05)."
    }
  },
  "kernel_sigmoid.c": {
    success: true,
    tokensCount: 42,
    errorMargin: "0.000195",
    memorySaving: "40.0%",
    estimatedSpeedup: "1.2x",
    problems: [],
    outputs: {
      lexical: "[SUCCESS] Lexical analysis completed.\nTotal Tokens: 42\nNo lexical errors found.\nKeywords: 5, Identifiers: 10, Numbers: 3, Operators: 5, Symbols: 19",
      syntax: "[SUCCESS] Syntax analysis completed.\nParsed function 'sigmoid'.",
      semantic: "[SUCCESS] Semantic analysis completed.\nType boundaries verified.",
      intermediate: "=== DELIVERABLE 1: AST Analysis & Data-Flow Extraction ===\nNode [term] (Type: float)\nNode [activated] (Type: float)\n  -> Math Operation: + 5.000000e-01\n  <- Depends on [term]\nNode [layer_out] (Type: float)\n  -> Math Operation: * 0.000000e+00\n  <- Depends on [x]\n  <- Depends on [weight]\nNode [weight] (Type: float)\nNode [x] (Type: float)",
      optimized: "=== DELIVERABLE 2: Backward Precision Propagation Engine ===\nVariable [term]\n  -> Error Budget: 5.000000e-02\n  -> STATUS: SAFE for FP16 Demotion! \n\nVariable [activated]\n  -> Error Budget: 5.000000e-02\n  -> STATUS: SAFE for FP16 Demotion! \n\nVariable [layer_out]\n  -> Error Budget: 0.000000e+00\n  -> STATUS: MUST STAY FP32 (Error budget too strict)\n\nVariable [weight]\n  -> Error Budget: 0.000000e+00\n  -> STATUS: MUST STAY FP32 (Error budget too strict)\n\nVariable [x]\n  -> Error Budget: 0.000000e+00\n  -> STATUS: MUST STAY FP32 (Error budget too strict)",
      generated: "float sigmoid() {\n    float x = 0.5;\n    float weight = 2.0;\n    float layer_out = x * weight;\n    _Float16 term = layer_out * 0.25;\n    _Float16 activated = term + 0.5;\n    return activated;\n}",
      llvm_ir: "=== LLVM IR (Intermediate Representation) ===\n; ModuleID = \'test_kernel\'\ntarget datalayout = \"e-m:e-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128\"\n\n%struct.Node = type { ptr, i32 }\n\ndefine dso_local void @compute() #0 {\nentry:\n  %x.addr = alloca half, align 2\n  %y.addr = alloca half, align 2\n  store half 0xH3C00, ptr %x.addr, align 2\n  store half 0xH4000, ptr %y.addr, align 2\n  ret void\n}\n",
      logs: "=== DELIVERABLE 4 & 5: Dual-Precision Kernel Verification (../kernels/kernel_sigmoid.c) ===\n\n[1] Compiling Original FP32 Code...\n    Original FP32 Result: 0.8\n[2] Running Precision-Aware Demotion Tool...\n[3] Compiling Demoted FP16 Code...\n    Demoted FP16 Result: 0.799805\n[4] Verifying Error Tolerance...\n    Absolute Error: 0.000195\n\n✅ VERIFICATION PASSED: The absolute error (0.000195) is within the allowable budget (0.05)."
    }
  },
  "kernel_polynomial.c": {
    success: true,
    tokensCount: 65,
    errorMargin: "0.0",
    memorySaving: "25.0%",
    problems: [],
    outputs: {
      lexical: "[SUCCESS] Lexical analysis completed.\nTotal Tokens: 65\nNo lexical errors found.\nKeywords: 8, Identifiers: 16, Numbers: 5, Operators: 9, Symbols: 27",
      syntax: "[SUCCESS] Syntax analysis completed.\nParsed function 'poly'.",
      semantic: "[SUCCESS] Semantic checks resolved accurately.",
      intermediate: "=== DELIVERABLE 1: AST Analysis & Data-Flow Extraction ===\nNode [acc2] (Type: float)\nNode [out] (Type: float)\n  -> Math Operation: + 1.000000e+00\n  <- Depends on [acc2]\nNode [term1] (Type: float)\n  -> Math Operation: * 5.000000e-01\n  <- Depends on [x]\nNode [term3] (Type: float)\n  -> Math Operation: * 2.000000e+00\n  <- Depends on [x3]\nNode [term2] (Type: float)\n  -> Math Operation: * 1.500000e+00\n  <- Depends on [x2]\nNode [x3] (Type: float)\n  -> Math Operation: * 0.000000e+00\n  <- Depends on [x2]\n  <- Depends on [x]\nNode [x2] (Type: float)\n  -> Math Operation: * 0.000000e+00\n  <- Depends on [x]\n  <- Depends on [x]\nNode [x] (Type: float)",
      optimized: "=== DELIVERABLE 2: Backward Precision Propagation Engine ===\nVariable [acc2]\n  -> Error Budget: 5.000000e-02\n  -> STATUS: SAFE for FP16 Demotion! \n\nVariable [out]\n  -> Error Budget: 5.000000e-02\n  -> STATUS: SAFE for FP16 Demotion! \n\nVariable [term1]\n  -> Error Budget: 0.000000e+00\n  -> STATUS: MUST STAY FP32 (Error budget too strict)\n\nVariable [term3]\n  -> Error Budget: 0.000000e+00\n  -> STATUS: MUST STAY FP32 (Error budget too strict)\n\nVariable [term2]\n  -> Error Budget: 0.000000e+00\n  -> STATUS: MUST STAY FP32 (Error budget too strict)\n\nVariable [x3]\n  -> Error Budget: 0.000000e+00\n  -> STATUS: MUST STAY FP32 (Error budget too strict)\n\nVariable [x2]\n  -> Error Budget: 0.000000e+00\n  -> STATUS: MUST STAY FP32 (Error budget too strict)\n\nVariable [x]\n  -> Error Budget: 0.000000e+00\n  -> STATUS: MUST STAY FP32 (Error budget too strict)",
      generated: "float poly() {\n    float x = 0.5;\n    float x2 = x * x;\n    float x3 = x2 * x;\n    float term3 = x3 * 2.0;\n    float term2 = x2 * 1.5;\n    float term1 = x * 0.5;\n    _Float16 acc2 = term3 - term2;\n    _Float16 out = acc2 + 1.0;\n    return out;\n}",
      llvm_ir: "=== LLVM IR (Intermediate Representation) ===\n; ModuleID = \'test_kernel\'\ntarget datalayout = \"e-m:e-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128\"\n\n%struct.Node = type { ptr, i32 }\n\ndefine dso_local void @compute() #0 {\nentry:\n  %x.addr = alloca half, align 2\n  %y.addr = alloca half, align 2\n  store half 0xH3C00, ptr %x.addr, align 2\n  store half 0xH4000, ptr %y.addr, align 2\n  ret void\n}\n",
      logs: "=== DELIVERABLE 4 & 5: Dual-Precision Kernel Verification (../kernels/kernel_polynomial.c) ===\n\n[1] Compiling Original FP32 Code...\n    Original FP32 Result: 1.375\n[2] Running Precision-Aware Demotion Tool...\n[3] Compiling Demoted FP16 Code...\n    Demoted FP16 Result: 1.375\n[4] Verifying Error Tolerance...\n    Absolute Error: 0.0\n\n✅ VERIFICATION PASSED: The absolute error (0.0) is within the allowable budget (0.05)."
    }
  },
  "kernel_int_quantization.c": {
    tokensCount: 45,
    errorMargin: "0.0 (Exact)",
    memorySaving: "75.0%",
    estimatedSpeedup: "4.0x",
    problems: [],
    outputs: {
      lexical: "=== Lexical Analysis ===\nTokens extracted: 45\n[IDENTIFIER]  sum\n[IDENTIFIER]  limit",
      syntax: "=== Syntax Analysis ===\nFunction: main\nReturn type: int\nStatements: 3",
      semantic: "=== Semantic Analysis ===\nType checks: PASS\nLoop Bounds: Static (limit=100)",
      intermediate: "=== Intermediate Code ===\n; Integer bounds proven: sum ∈ [0, 50]\n; Data-flow edges approximated.",
      optimized: "=== Precision Analysis ===\nError Budget: N/A\nMemory Saving: 75.0% (int32 -> int8_t)\nSafe variables identified: 2",
      generated: "=== Generated Code ===\nint8_t sum = 0;\nint8_t limit = 100;",
      llvm_ir: "=== LLVM IR (Intermediate Representation) ===\n; ModuleID = 'kernel_int'\n%sum = alloca i8, align 1\n%limit = alloca i8, align 1",
      logs: "=== Dual-Precision Verification ===\n\n[1] Compiling Original INT32 Code...\n[2] Running Demotion Tool...\n[3] Compiling INT8 Code...\n✅ VERIFICATION PASSED: No overflow detected."
    }
  },
  "kernel_double_demotion.c": {
    tokensCount: 35,
    errorMargin: "0.0",
    memorySaving: "50.0%",
    estimatedSpeedup: "1.9x",
    problems: [],
    outputs: {
      lexical: "=== Lexical Analysis ===\nTokens extracted: 35\n[IDENTIFIER]  alpha\n[IDENTIFIER]  beta",
      syntax: "=== Syntax Analysis ===\nFunction: main\nReturn type: int\nStatements: 4",
      semantic: "=== Semantic Analysis ===\nType checks: PASS\nDowncast safety check: PASS",
      intermediate: "=== Intermediate Code ===\n; Value range proven fits in fp32",
      optimized: "=== Precision Analysis ===\nError Budget: 0.05\nMemory Saving: 50.0% (fp64 -> fp32)\nSafe variables identified: 3",
      generated: "=== Generated Code ===\nfloat alpha = 0.5f;\nfloat beta = 1.25f;",
      llvm_ir: "=== LLVM IR (Intermediate Representation) ===\n; ModuleID = 'kernel_double'\n%alpha = alloca float, align 4",
      logs: "=== Dual-Precision Verification ===\n\n[1] Compiling Original FP64 Code...\n[2] Running Demotion Tool...\n[3] Compiling FP32 Code...\n✅ VERIFICATION PASSED: The absolute error (0.0) is within the allowable budget."
    }
  },
  "kernel_int_extreme.c": {
    tokensCount: 42,
    errorMargin: "N/A",
    memorySaving: "0.0%",
    estimatedSpeedup: "1.0x",
    problems: [
      { severity: "warning", line: 6, message: "Loop bound (100000000) exceeds int16_t limits. Demotion blocked to prevent overflow." }
    ],
    outputs: {
      lexical: "=== Lexical Analysis ===\nTokens extracted: 42",
      syntax: "=== Syntax Analysis ===\nFunction: main\nReturn type: int",
      semantic: "=== Semantic Analysis ===\nType checks: PASS\nLoop Bounds: Static (limit=100000000)",
      intermediate: "=== Intermediate Code ===\n; Integer bounds proven: sum ∈ [0, 200000000]\n; Data-flow edges approximated.",
      optimized: "=== Precision Analysis ===\nError Budget: N/A\nMemory Saving: 0.0% (Demotion blocked)\nSafe variables identified: 0\n[WARNING] 'sum' requires minimum 28 bits.\n[WARNING] 'limit' requires minimum 27 bits.",
      generated: "=== Generated Code ===\nint32_t sum = 0;\nint32_t limit = 100000000;\n// Original types retained.",
      llvm_ir: "=== LLVM IR (Intermediate Representation) ===\n; ModuleID = 'kernel_int_extreme'\n%sum = alloca i32, align 4\n%limit = alloca i32, align 4",
      logs: "=== Dual-Precision Verification ===\n\n[1] Analyzing bounds...\n[2] bounds > 32767. Demotion to int16_t aborted.\n[3] Compiling Original INT32 Code...\n✅ VERIFICATION PASSED: No changes made. Code safely executes."
    }
  },
  "kernel_double_extreme.c": {
    tokensCount: 48,
    errorMargin: "1.0e-15",
    memorySaving: "0.0%",
    estimatedSpeedup: "1.0x",
    problems: [
      { severity: "warning", line: 6, message: "Delta (1.0e-15) falls below float32 machine epsilon. Forcing FP64 retention." }
    ],
    outputs: {
      lexical: "=== Lexical Analysis ===\nTokens extracted: 48",
      syntax: "=== Syntax Analysis ===\nFunction: main",
      semantic: "=== Semantic Analysis ===\nType checks: PASS\nDowncast safety check: FAIL (Underflow risk)",
      intermediate: "=== Intermediate Code ===\n; Value range analysis detects sub-epsilon delta addition.",
      optimized: "=== Precision Analysis ===\nError Budget: 0.05\nMemory Saving: 0.0% (Demotion blocked)\nSafe variables identified: 0\n[FATAL] Demoting 'tiny_delta' to FP32 causes catastrophic cancellation.",
      generated: "=== Generated Code ===\ndouble base_value = 1.0;\ndouble tiny_delta = 1.0e-15;\n// Original types retained.",
      llvm_ir: "=== LLVM IR (Intermediate Representation) ===\n; ModuleID = 'kernel_double_extreme'\n%base_value = alloca double, align 8\n%tiny_delta = alloca double, align 8",
      logs: "=== Dual-Precision Verification ===\n\n[1] Simulating FP32 Demotion...\n    Result would be: 1.0000000000000000\n[2] FP64 Result: 1.0000000000000011\n[3] Error exceeds acceptable loss! Aborting optimization.\n✅ VERIFICATION PASSED: Original FP64 code retained safely."
    }
  }
};
