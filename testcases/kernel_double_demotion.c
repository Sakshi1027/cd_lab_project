#include <stdio.h>

int main() {
    double alpha = 0.5;
    double beta = 1.25;
    double gamma;
    
    // The compiler should detect double precision is unnecessary
    // here since the constants and bounds fit in float
    gamma = (alpha * 2.0) + beta;
    
    printf("Demoted Float Result: %f\n", (float)gamma);
    return 0;
}
