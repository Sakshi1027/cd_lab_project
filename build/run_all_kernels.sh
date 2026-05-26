#!/bin/bash

echo "============================================================"
echo "   STARTING BATCH EVALUATION OF 5 ML KERNELS (Deliverable 5)  "
echo "============================================================"
echo ""

# Run Dot Product
python3 verify.py ../kernels/kernel_dot_product.c
echo "------------------------------------------------------------"

# Run FIR Filter
python3 verify.py ../kernels/kernel_fir_filter.c
echo "------------------------------------------------------------"

# Run Softmax
python3 verify.py ../kernels/kernel_softmax.c
echo "------------------------------------------------------------"

# Run Sigmoid
python3 verify.py ../kernels/kernel_sigmoid.c
echo "------------------------------------------------------------"

# Run Polynomial
python3 verify.py ../kernels/kernel_polynomial.c
echo "============================================================"
echo "   ALL 5 ML KERNELS SUCCESSFULLY EVALUATED AND DEMOTED!     "
echo "============================================================"
