#include <stdio.h>
#include <stdint.h>

int main() {
    int sum = 0;
    int limit = 100;
    
    // The compiler should detect that 'i' and 'sum' are bounded
    // and can safely be demoted to int8_t
    for (int i = 0; i < limit; i++) {
        if (i < 50) {
            sum = sum + 1;
        }
    }
    
    printf("Quantized Integer Sum: %d\n", sum);
    return 0;
}
