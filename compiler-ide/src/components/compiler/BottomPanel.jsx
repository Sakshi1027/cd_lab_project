import React from 'react';
import { useCompilerStore } from '../../store/compilerStore';
import { motion } from 'framer-motion';

const TABS = [
  { id: 'lexical',      label: 'Lexical' },
  { id: 'syntax',       label: 'Syntax'  },
  { id: 'semantic',     label: 'Semantic' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'optimized',    label: 'Precision Analysis' },
  { id: 'generated',    label: 'Generated Code' },
  { id: 'llvm_ir',      label: 'LLVM IR' },
  { id: 'logs',         label: 'Logs & Verification' }
];

export default function BottomPanel() {
  const { outputs, activeTab, setActiveTab, isRunning, clearAll } = useCompilerStore();

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
        <button 
          onClick={clearAll}
          className="px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-white select-none transition-colors border-l border-bg-border/60 hover:bg-bg-tertiary"
        >
          Clear Output
        </button>
      </div>

      {/* Output screen */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-[11px] leading-relaxed ">
        {isRunning ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-600 text-xs gap-3 select-none">
            <div className="w-5 h-5 border-2 border-accent-purple border-t-transparent rounded-full animate-spin" />
            <span>Compiling Compiler Phase Outputs...</span>
          </div>
        ) : content ? (
          <pre className="whitespace-pre-wrap text-emerald-400 select-text selection:bg-accent-purple/30 font-mono">
            {content}
          </pre>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-600 text-xs select-none">
            No compiler logs compiled yet. Write code in the editor and click "Run Compiler" above.
          </div>
        )}
      </div>
    </div>
  );
}
