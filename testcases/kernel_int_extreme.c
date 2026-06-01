#include <stdio.h>
#include <stdint.h>

int main() {
    int sum = 0;
    // The limit is extremely large (100 million)
    // This requires a 32-bit integer, so the compiler 
    // CANNOT demote 'sum' or 'i' to int8_t or int16_t safely.
    int limit = 100000000;
    
    for (int i = 0; i < limit; i++) {
        sum = sum + 2;
    }
    
    printf("Large Integer Sum: %d\n", sum);
    return 0;
}
