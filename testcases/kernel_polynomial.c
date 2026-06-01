#include <stdio.h>

int main() {
    // y = 2.0*x^3 - 1.5*x^2 + 0.5*x + 1.0
    float x;
    float x2, x3;
    float term3, term2, term1;
    float out;

    x = 0.75;
    x2 = x * x;
    x3 = x2 * x;

    term3 = x3 * 2.0;
    term2 = x2 * -1.5;
    term1 = x * 0.5;

    float acc1 = term3 + term2;
    float acc2 = acc1 + term1;
    out = acc2 + 1.0;

    printf("%f\n", (float)out);
    return 0;
}
