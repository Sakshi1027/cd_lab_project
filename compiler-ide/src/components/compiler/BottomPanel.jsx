import React from 'react';
import { useCompilerStore } from '../../store/compilerStore';

const TABS = [
  { id: 'lexical',      label: 'Lexical' },
  { id: 'syntax',       label: 'Syntax'  },
  { id: 'semantic',     label: 'Semantic' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'optimized',    label: 'Precision Analysis' },
  { id: 'generated',    label: 'Generated Code' },
  { id: 'logs',         label: 'Logs & Verification' }
];

export default function BottomPanel() {
  const { outputs, activeTab, setActiveTab, isRunning, clearAll } = useCompilerStore();

  const content = outputs[activeTab] || "";

  return (
    <div className="w-full h-full flex flex-col bg-bg-secondary select-text overflow-hidden">
      {/* Console Tab switcher */}
      <div className="flex items-center bg-[#161F30] border-b border-bg-border shrink-0 select-none overflow-x-auto">
        <div className="flex flex-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-accent-purple text-white bg-bg-tertiary/70'
                  : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-bg-tertiary/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button 
          onClick={clearAll}
          className="px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-white select-none transition-colors border-l border-bg-border/60 hover:bg-bg-tertiary"
        >
          Clear Output
        </button>
      </div>

      {/* Output screen */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-[11px] leading-relaxed bg-[#0d131f]">
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
