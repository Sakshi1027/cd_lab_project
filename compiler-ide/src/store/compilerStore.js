import { create } from 'zustand';
import { MOCK_COMPILER_RESPONSES } from '../services/mock/mockCompiler';
import { MOCK_TOKENS_MAP } from '../services/mock/mockTokens';
import { MOCK_AST_MAP } from '../services/mock/mockAST';
import { compileCode } from '../services/compilerApi';

const DEFAULT_CODES = {
  "test.c": `int main() {
    float a, b, c;
    a = 10.0;
    b = a * 2.0;
    c = b + 5.0;
    return 0;
}`,
  "kernel_dot_product.c": `float dot_product() {
    float a_val = 1.5;
    float b_val = 2.0;
    float prod = a_val * b_val;
    float final_dot = prod + 10.0;
    return final_dot;
}`,
  "kernel_fir_filter.c": `float fir() {
    float input_val = 0.8;
    float coeff0 = 0.1;
    float coeff1 = 0.15;
    float coeff2 = 0.5;
    float tap0 = input_val * coeff0;
    float tap2 = input_val * coeff2;
    float acc = tap0 + tap2;
    float filtered_out = acc + 0.01;
    return filtered_out;
}`,
  "kernel_softmax.c": `float softmax() {
    float x1 = 1.0;
    float x2 = 0.5;
    float term1 = x1 * 1.0;
    float sum1 = term1 + 1.0;
    float exp1 = sum1 + 0.5;
    float term2 = x2 * 1.0;
    float sum2 = term2 + 1.0;
    float exp2 = sum2 + 0.5;
    float sum_exp = exp1 + exp2;
    float prob1 = exp1 / sum_exp;
    float prob2 = exp2 / sum_exp;
    return prob1;
}`,
  "kernel_sigmoid.c": `float sigmoid() {
    float x = 0.5;
    float weight = 2.0;
    float layer_out = x * weight;
    float term = layer_out * 0.25;
    float activated = term + 0.5;
    return activated;
}`,
  "kernel_polynomial.c": `float poly() {
    float x = 0.5;
    float x2 = x * x;
    float x3 = x2 * x;
    float term3 = x3 * 2.0;
    float term2 = x2 * 1.5;
    float term1 = x * 0.5;
    float acc2 = term3 - term2;
    float out = acc2 + 1.0;
    return out;
}`
};

export const useCompilerStore = create((set, get) => ({
  // Workspace files
  files: Object.keys(DEFAULT_CODES),
  activeFile: "test.c",
  code: DEFAULT_CODES["test.c"],
  demoMode: false, // Default to live integration mode so custom pasted code compiles
  
  // Compiler animation
  isRunning: false,
  compilingState: "idle", // idle | compiling | ast | optimizing | verifying
  statusMessage: "Compiler Ready",
  backendStatus: "Connected",
  toolchainStatus: "Active",
  activePhase: null,
  phaseStatus: {}, // { lexical: 'idle' | 'running' | 'done' | 'error' }

  // Metrics
  tokensCount: 0,
  errorMargin: "0.0",
  memorySaving: "0.0%",
  
  // Results
  tokens: [],
  ast: null,
  problems: [],
  outputs: {},
  
  // Bottom Panel states
  activeTab: "lexical",
  problemsPanelOpen: false,

  // Actions
  setCode: (code) => set({ code }),
  
  setActiveFile: (fileName) => set({
    activeFile: fileName,
    code: DEFAULT_CODES[fileName] || "",
    tokens: [],
    ast: null,
    problems: [],
    outputs: {},
    tokensCount: 0,
    errorMargin: "0.0",
    memorySaving: "0.0%"
  }),
  
  setDemoMode: (val) => set({ demoMode: val }),
  setActiveTab: (tabId) => set({ activeTab: tabId }),
  setProblemsPanelOpen: (val) => set({ problemsPanelOpen: val }),
  
  clearAll: () => set({
    tokens: [],
    ast: null,
    problems: [],
    outputs: {},
    phaseStatus: {},
    activePhase: null,
    isRunning: false,
    compilingState: "idle",
    statusMessage: "Compiler Ready",
    tokensCount: 0,
    errorMargin: "0.0",
    memorySaving: "0.0%"
  }),

  runCompiler: async () => {
    const { code, activeFile, demoMode } = get();
    set({ isRunning: true, compilingState: "compiling", statusMessage: "Compiling..." });
    
    // Clear old outputs
    set({ tokens: [], ast: null, problems: [], outputs: {}, phaseStatus: {} });

    const phases = ["lexical", "syntax", "semantic", "intermediate", "optimization", "codegen"];
    
    try {
      // Step-by-step visual animation for demo feedback
      for (let i = 0; i < phases.length; i++) {
        const phase = phases[i];
        set({ activePhase: phase });
        set(s => ({ phaseStatus: { ...s.phaseStatus, [phase]: "running" } }));
        
        if (phase === "lexical") set({ statusMessage: "Running Lexical Analysis..." });
        if (phase === "syntax") set({ statusMessage: "Generating AST Tree..." });
        if (phase === "semantic") set({ statusMessage: "Validating Semantic Bounds..." });
        if (phase === "intermediate") set({ statusMessage: "Extracting Data-Flow Graph..." });
        if (phase === "optimization") set({ statusMessage: "Propagating Precision Budgets..." });
        if (phase === "codegen") set({ statusMessage: "Rewriting Source to _Float16..." });
        
        await new Promise(r => setTimeout(r, 450)); // Presentation delay
        set(s => ({ phaseStatus: { ...s.phaseStatus, [phase]: "done" } }));
      }
      
      set({ compilingState: "verifying", statusMessage: "Verifying Dual-Precision..." });
      await new Promise(r => setTimeout(r, 400));

      if (demoMode) {
        // Safe presentation mode
        const mockData = MOCK_COMPILER_RESPONSES[activeFile] || MOCK_COMPILER_RESPONSES["test.c"];
        const mockToks = MOCK_TOKENS_MAP[activeFile] || MOCK_TOKENS_MAP["test.c"];
        const mockAST = MOCK_AST_MAP[activeFile] || MOCK_AST_MAP["test.c"];
        
        set({
          tokens: mockToks,
          ast: mockAST,
          problems: mockData.problems,
          outputs: mockData.outputs,
          tokensCount: mockData.tokensCount,
          errorMargin: mockData.errorMargin,
          memorySaving: mockData.memorySaving,
          statusMessage: mockData.problems.length ? "Compilation finished with warnings" : "Verification Passed"
        });
      } else {
        // Live integration with FastAPI backend
        const result = await compileCode(code, activeFile);
        
        if (result.success) {
          set({
            tokens: result.tokens || [],
            ast: result.ast || null,
            problems: result.errors || [],
            outputs: result.outputs || {},
            tokensCount: result.tokensCount || (result.tokens ? result.tokens.length : 0),
            errorMargin: result.errorMargin || "0.0",
            memorySaving: result.memorySaving || "0.0%",
            statusMessage: result.errors && result.errors.length ? "Compilation issues found" : "Verification Passed"
          });
        } else {
          throw new Error(result.message || "Compilation failed");
        }
      }
    } catch (err) {
      console.error(err);
      // Fail-safe logic: automatically fall back to mock data so slides/live demo never fail!
      const mockData = MOCK_COMPILER_RESPONSES[activeFile] || MOCK_COMPILER_RESPONSES["test.c"];
      const mockToks = MOCK_TOKENS_MAP[activeFile] || MOCK_TOKENS_MAP["test.c"];
      const mockAST = MOCK_AST_MAP[activeFile] || MOCK_AST_MAP["test.c"];
      
      set({
        tokens: mockToks,
        ast: mockAST,
        problems: [{ severity: "error", line: 1, message: "FastAPI server unreachable. Loading safe Offline Demo data." }],
        outputs: mockData.outputs,
        tokensCount: mockData.tokensCount,
        errorMargin: mockData.errorMargin,
        memorySaving: mockData.memorySaving,
        statusMessage: "Fallback Mode Active (Offline)"
      });
    } finally {
      set({ isRunning: false, activePhase: null, compilingState: "idle" });
    }
  }
}));
