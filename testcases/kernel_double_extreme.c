#include <stdio.h>

int main() {
    // Extremely small perturbation that requires 64-bit (double) precision
    // to avoid underflow/catastrophic cancellation.
    double base_value = 1.0;
    double tiny_delta = 1.0e-15; 
    
    double result = base_value + tiny_delta;
    
    // The compiler must detect that demoting to 32-bit float
    // would completely wipe out 'tiny_delta' due to lack of mantissa bits.
    // Therefore, it MUST retain FP64.
    if (result > 1.0) {
        printf("Precision retained! Result: %.16f\n", result);
    } else {
        printf("Catastrophic cancellation occurred!\n");
    }
    
    return 0;
}
