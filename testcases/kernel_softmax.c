#include <stdio.h>

int main() {
    // using taylor series 1 + x + x^2/2 for e^x
    float x1, x2;
    float exp1, exp2, sum_exp;
    float prob1, prob2;

    x1 = 0.5;
    x2 = -0.2;

    float x1_sq = x1 * x1;
    float term1 = x1_sq * 0.5;
    float sum1 = x1 + 1.0;
    exp1 = sum1 + term1;

    float x2_sq = x2 * x2;
    float term2 = x2_sq * 0.5;
    float sum2 = x2 + 1.0;
    exp2 = sum2 + term2;

    sum_exp = exp1 + exp2;

    prob1 = exp1 / sum_exp;
    prob2 = exp2 / sum_exp;

    printf("%f\n", (float)prob1);
    return 0;
}
