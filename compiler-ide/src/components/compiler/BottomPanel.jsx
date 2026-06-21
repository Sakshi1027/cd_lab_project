import React from 'react';
import { useCompilerStore } from '../../store/compilerStore';
import { motion } from 'framer-motion';
import DataTypePanel from './DataTypePanel';

const TABS = [
  { id: 'datatypes',    label: 'Data Type Analysis' },
  { id: 'lexical',      label: 'Lexical' },
  { id: 'syntax',       label: 'Syntax'  },
  { id: 'semantic',     label: 'Semantic' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'optimized',    label: 'Precision Analysis' },
  { id: 'generated',    label: 'Generated Code' },
  { id: 'original_llvm_ir', label: 'Original LLVM IR' },
  { id: 'optimized_llvm_ir', label: 'Optimized LLVM IR' },
  { id: 'memory_report', label: 'Memory Report' },
  { id: 'logs',         label: 'Logs & Verification' }
];

const DELIVERABLES = {
  semantic: "Deliverable 1: Clang AST analysis pass tracing precision requirements through data-flow chains",
  intermediate: "Deliverable 2: Backward precision propagation engine given output tolerance, determine which intermediates can be demoted",
  optimized: "Deliverable 3: AST rewriter applying safe type demotions automatically",
  logs: "Deliverable 4: Dual-precision verification mode: compile both original and demoted versions, compare results at runtime\nDeliverable 5: Evaluation on 5 ML/signal-processing kernels showing performance gains vs. accuracy loss"
};

export default function BottomPanel() {
  const { outputs, activeTab, setActiveTab, isRunning } = useCompilerStore();

  const content = outputs[activeTab] || "";

  return (
    <div className="w-full h-full flex flex-col bg-bg-secondary select-text overflow-hidden">
      {/* Console Tab switcher */}
      <div className="flex items-center glass-panel border-b border-bg-border shrink-0 select-none overflow-x-auto">
        <div className="flex flex-1">
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative shrink-0 px-4 py-2.5 text-xs font-semibold transition-colors ${
                isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="bottom-tab-pill"
                  className="absolute inset-0 bg-white/10 border border-white/20 rounded-md shadow-[0_0_10px_rgba(139,92,246,0.2)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          )})}
        </div>
      </div>

      {/* Output screen */}
      {activeTab === 'datatypes' ? (
        <div className="flex-1 overflow-hidden min-h-0 relative">
          <DataTypePanel />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 font-mono text-[11px] leading-relaxed flex flex-col">
          {DELIVERABLES[activeTab] && (
          <div className="mb-4 p-3 bg-indigo-900/20 border border-indigo-500/30 rounded text-indigo-200 font-sans text-xs whitespace-pre-wrap shrink-0">
            <strong className="text-indigo-300 block mb-1">Assignment Deliverable:</strong>
            {DELIVERABLES[activeTab]}
          </div>
        )}
        {isRunning ? (
          <div className="flex flex-col items-center justify-center flex-1 text-slate-600 text-xs gap-3 select-none">
            <div className="w-5 h-5 border-2 border-accent-purple border-t-transparent rounded-full animate-spin" />
            <span>Compiling Compiler Phase Outputs...</span>
          </div>
        ) : content ? (
          <pre className="whitespace-pre-wrap text-emerald-400 select-text selection:bg-accent-purple/30 font-mono">
            {content}
          </pre>
        ) : (
          <div className="flex flex-1 items-center justify-center text-slate-600 text-xs select-none">
            No compiler logs compiled yet. Write code in the editor and click "Run Compiler" above.
          </div>
        )}
        </div>
      )}
    </div>
  );
}
