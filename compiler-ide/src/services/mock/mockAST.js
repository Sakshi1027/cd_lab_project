export const MOCK_AST_MAP = {
  "test.c": {
    type: "Program", value: "", children: [
      { type: "Function", value: "main", children: [
        { type: "Declarations", value: "", children: [
          { type: "Var", value: "float a", children: [] },
          { type: "Var", value: "float b", children: [] },
          { type: "Var", value: "float c", children: [] }
        ]},
        { type: "Statements", value: "", children: [
          { type: "Assign", value: "a = 10.0", children: [] },
          { type: "Assign", value: "b = a * 2.0", children: [] },
          { type: "Assign", value: "c = b + 5.0", children: [] },
          { type: "Return", value: "0", children: [] }
        ]}
      ]}
    ]
  },
  "kernel_dot_product.c": {
    type: "Program", value: "", children: [
      { type: "Function", value: "dot_product", children: [
        { type: "Declarations", value: "", children: [
          { type: "Var", value: "float a_val", children: [] },
          { type: "Var", value: "float b_val", children: [] },
          { type: "Var", value: "float prod", children: [] },
          { type: "Var", value: "float final_dot", children: [] }
        ]},
        { type: "Statements", value: "", children: [
          { type: "Assign", value: "a_val = 1.5", children: [] },
          { type: "Assign", value: "b_val = 2.0", children: [] },
          { type: "Assign", value: "prod = a_val * b_val", children: [] },
          { type: "Assign", value: "final_dot = prod + 10.0", children: [] },
          { type: "Return", value: "final_dot", children: [] }
        ]}
      ]}
    ]
  },
  "kernel_fir_filter.c": {
    type: "Program", value: "", children: [
      { type: "Function", value: "fir", children: [
        { type: "Declarations", value: "", children: [
          { type: "Var", value: "float input_val", children: [] },
          { type: "Var", value: "float coeff0, coeff1, coeff2", children: [] },
          { type: "Var", value: "float tap0, tap2", children: [] },
          { type: "Var", value: "float acc, filtered_out", children: [] }
        ]},
        { type: "Statements", value: "", children: [
          { type: "Assign", value: "input_val = 0.8", children: [] },
          { type: "Assign", value: "coeff0 = 0.1", children: [] },
          { type: "Assign", value: "coeff1 = 0.15", children: [] },
          { type: "Assign", value: "coeff2 = 0.5", children: [] },
          { type: "Assign", value: "tap0 = input_val * coeff0", children: [] },
          { type: "Assign", value: "tap2 = input_val * coeff2", children: [] },
          { type: "Assign", value: "acc = tap0 + tap2", children: [] },
          { type: "Assign", value: "filtered_out = acc + 0.01", children: [] },
          { type: "Return", value: "filtered_out", children: [] }
        ]}
      ]}
    ]
  },
  "kernel_softmax.c": {
    type: "Program", value: "", children: [
      { type: "Function", value: "softmax", children: [
        { type: "Declarations", value: "", children: [
          { type: "Var", value: "float x1, x2", children: [] },
          { type: "Var", value: "float term1, sum1, exp1", children: [] },
          { type: "Var", value: "float term2, sum2, exp2", children: [] },
          { type: "Var", value: "float sum_exp, prob1, prob2", children: [] }
        ]},
        { type: "Statements", value: "", children: [
          { type: "Assign", value: "x1 = 1.0", children: [] },
          { type: "Assign", value: "x2 = 0.5", children: [] },
          { type: "Assign", value: "term1 = x1 * 1.0", children: [] },
          { type: "Assign", value: "sum1 = term1 + 1.0", children: [] },
          { type: "Assign", value: "exp1 = sum1 + 0.5", children: [] },
          { type: "Assign", value: "term2 = x2 * 1.0", children: [] },
          { type: "Assign", value: "sum2 = term2 + 1.0", children: [] },
          { type: "Assign", value: "exp2 = sum2 + 0.5", children: [] },
          { type: "Assign", value: "sum_exp = exp1 + exp2", children: [] },
          { type: "Assign", value: "prob1 = exp1 / sum_exp", children: [] },
          { type: "Assign", value: "prob2 = exp2 / sum_exp", children: [] },
          { type: "Return", value: "prob1", children: [] }
        ]}
      ]}
    ]
  },
  "kernel_sigmoid.c": {
    type: "Program", value: "", children: [
      { type: "Function", value: "sigmoid", children: [
        { type: "Declarations", value: "", children: [
          { type: "Var", value: "float x", children: [] },
          { type: "Var", value: "float weight", children: [] },
          { type: "Var", value: "float layer_out", children: [] },
          { type: "Var", value: "float term", children: [] },
          { type: "Var", value: "float activated", children: [] }
        ]},
        { type: "Statements", value: "", children: [
          { type: "Assign", value: "x = 0.5", children: [] },
          { type: "Assign", value: "weight = 2.0", children: [] },
          { type: "Assign", value: "layer_out = x * weight", children: [] },
          { type: "Assign", value: "term = layer_out * 0.25", children: [] },
          { type: "Assign", value: "activated = term + 0.5", children: [] },
          { type: "Return", value: "activated", children: [] }
        ]}
      ]}
    ]
  },
  "kernel_polynomial.c": {
    type: "Program", value: "", children: [
      { type: "Function", value: "poly", children: [
        { type: "Declarations", value: "", children: [
          { type: "Var", value: "float x, x2, x3", children: [] },
          { type: "Var", value: "float term3, term2, term1", children: [] },
          { type: "Var", value: "float acc2, out", children: [] }
        ]},
        { type: "Statements", value: "", children: [
          { type: "Assign", value: "x = 0.5", children: [] },
          { type: "Assign", value: "x2 = x * x", children: [] },
          { type: "Assign", value: "x3 = x2 * x", children: [] },
          { type: "Assign", value: "term3 = x3 * 2.0", children: [] },
          { type: "Assign", value: "term2 = x2 * 1.5", children: [] },
          { type: "Assign", value: "term1 = x * 0.5", children: [] },
          { type: "Assign", value: "acc2 = term3 - term2", children: [] },
          { type: "Assign", value: "out = acc2 + 1.0", children: [] },
          { type: "Return", value: "out", children: [] }
        ]}
      ]}
    ]
  }
};
