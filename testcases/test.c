#include <stdio.h>

int main() {
    float a, b, c;
    a = 10.0;
    b = a * 2.0;
    c = b + 5.0;
    
    // Print the final result so our verification script can read it
    printf("%f\n", (float)c);
    
    return 0;
}
