import subprocess
import os
import sys

def run_command(cmd):
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error running command: {cmd}\n{result.stderr}")
        sys.exit(1)
    return result.stdout.strip()

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 verify.py <path_to_c_file>")
        sys.exit(1)
        
    target_file = sys.argv[1]
    print(f"=== DELIVERABLE 4 & 5: Dual-Precision Kernel Verification ({target_file}) ===\n")
    
    # 1. Compile and run the ORIGINAL FP32 version
    print("[1] Compiling Original FP32 Code...")
    run_command(f"clang -O3 {target_file} -o original_bin")
    
    original_output = run_command("./original_bin")
    fp32_val = float(original_output)
    print(f"    Original FP32 Result: {fp32_val}")

    # 2. Run the compiler tool to generate the demoted FP16 version
    print("\n[2] Running Precision-Aware Demotion Tool...")
    tool_output = run_command(f"./tool {target_file} --")
    print(tool_output) # <--- This prints Deliverable 1, 2, and 3!
    
    # 3. Compile and run the DEMOTED FP16 version
    print("\n[3] Compiling Demoted FP16 Code...")
    run_command("clang -O3 test_demoted.c -o demoted_bin")
    
    demoted_output = run_command("./demoted_bin")
    fp16_val = float(demoted_output)
    print(f"    Demoted FP16 Result: {fp16_val}")

    # 4. Compare the results
    print("\n[4] Verifying Error Tolerance...")
    error_margin = abs(fp32_val - fp16_val)
    print(f"    Absolute Error: {error_margin}")
    
    TARGET_TOLERANCE = 0.05
    
    if error_margin <= TARGET_TOLERANCE:
        print(f"\n✅ VERIFICATION PASSED: The absolute error ({error_margin}) is within the allowable budget ({TARGET_TOLERANCE}).")
    else:
        print(f"\n❌ VERIFICATION FAILED: The error ({error_margin}) exceeded the budget ({TARGET_TOLERANCE})!")

if __name__ == "__main__":
    main()
