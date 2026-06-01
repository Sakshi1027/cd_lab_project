#include <stdio.h>

int main() {
    float input_val;
    float coeff0, coeff1, coeff2;
    float tap0, tap1, tap2;
    float filtered_out;

    input_val = 1.0;
    coeff0 = 0.25; coeff1 = 0.5; coeff2 = 0.25;

    tap0 = input_val * coeff0;
    tap1 = input_val * coeff1;
    tap2 = input_val * coeff2;

    float acc = tap0 + tap1;
    filtered_out = acc + tap2;

    printf("%f\n", (float)filtered_out);
    return 0;
}
