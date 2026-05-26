#include <stdio.h>

int main() {
    // sigmoid(x) = 1 / (1 + e^-x)
    // using polynomial approximation 0.5 + 0.25*x for small x
    float x;
    float weight;
    float layer_out;
    float activated;

    x = 1.5;
    weight = 0.8;
    layer_out = x * weight;
    
    float term = layer_out * 0.25;
    activated = term + 0.5;

    printf("%f\n", (float)activated);
    return 0;
}
