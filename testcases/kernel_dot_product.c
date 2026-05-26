#include <stdio.h>

int main() {
    float x1, x2, x3;
    float w1, w2, w3;
    float out1, out2, out3;
    float final_dot;
    
    x1 = 0.5; x2 = 1.2; x3 = -0.8;
    w1 = 0.1; w2 = 0.4; w3 = 0.9;
    
    out1 = x1 * w1;
    out2 = x2 * w2;
    out3 = x3 * w3;
    
    float sum1 = out1 + out2;
    final_dot = sum1 + out3;
    
    printf("%f\n", (float)final_dot);
    return 0;
}
