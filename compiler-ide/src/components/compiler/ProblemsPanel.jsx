import React from 'react';
import { AlertCircle, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { useCompilerStore } from '../../store/compilerStore';

export default function ProblemsPanel() {
  const { problems, problemsPanelOpen, setProblemsPanelOpen } = useCompilerStore();

  return (
    <div className="border-t border-bg-border bg-bg-secondary select-none shrink-0 flex flex-col">
      <div 
        onClick={() => setProblemsPanelOpen(!problemsPanelOpen)}
        className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-bg-tertiary/50 border-b border-bg-border/50 bg-[#161F30]"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Compiler Diagnostics</span>
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
            problems.length > 0 ? "bg-accent-red text-white animate-pulse" : "bg-bg-border text-slate-400"
          }`}>
            {problems.length}
          </span>
        </div>
        <div>
          {problemsPanelOpen ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronUp size={14} className="text-slate-400" />}
        </div>
      </div>
      
      {problemsPanelOpen && (
        <div className="max-h-32 min-h-20 overflow-y-auto p-2 bg-[#0d131f] select-text">
          {problems.map((p, i) => (
            <div key={i} className={`flex items-start gap-2.5 p-1.5 rounded border mb-1.5 text-xs font-mono ${
              p.severity === 'error' 
                ? 'border-accent-red/20 bg-accent-red/5 text-red-300' 
                : 'border-accent-amber/20 bg-accent-amber/5 text-amber-300'
            }`}>
              <div className="mt-0.5 shrink-0">
                {p.severity === 'error' 
                  ? <AlertCircle size={13} className="text-accent-red" /> 
                  : <AlertTriangle size={13} className="text-accent-amber" />}
              </div>
              <div className="flex-1">
                <span className="font-bold mr-1">Line {p.line}:</span>
                <span>{p.message}</span>
              </div>
            </div>
          ))}
          {problems.length === 0 && (
            <div className="flex items-center justify-center py-6 text-slate-600 text-xs">
              No diagnostic issues reported. Compiler status: healthy.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
