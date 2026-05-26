import React from 'react';
import { useCompilerStore } from '../../store/compilerStore';

const TYPE_COLORS = {
  KEYWORD:    'text-purple-400 border-purple-500/20 bg-purple-500/5',
  IDENTIFIER: 'text-green-400 border-green-500/20 bg-green-500/5',
  OPERATOR:   'text-amber-400 border-amber-500/20 bg-amber-500/5',
  NUMBER:     'text-blue-400 border-blue-500/20 bg-blue-500/5',
  SYMBOL:     'text-pink-400 border-pink-500/20 bg-pink-500/5',
  STRING:     'text-orange-400 border-orange-500/20 bg-orange-500/5',
};

export default function TokenPanel() {
  const { tokens, isRunning } = useCompilerStore();

  return (
    <div className="w-full h-full flex flex-col bg-bg-secondary overflow-hidden">
      <div className="px-3 py-2 text-xs text-slate-400 border-b border-bg-border bg-bg-secondary select-none font-semibold shrink-0">
        Lexer Symbols Table
      </div>
      
      {isRunning ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs gap-3">
          <div className="w-6 h-6 border-2 border-accent-amber border-t-transparent rounded-full animate-spin" />
          <span>Tokenizing Source...</span>
        </div>
      ) : (
        <div className="overflow-y-auto flex-1">
          <table className="w-full text-xs font-mono select-text border-collapse">
            <thead className="sticky top-0 bg-[#161F30] z-10 border-b border-bg-border">
              <tr className="text-slate-400 text-[10px] uppercase tracking-wider">
                <th className="px-3 py-2 text-left w-10">#</th>
                <th className="px-2 py-2 text-left">Token</th>
                <th className="px-2 py-2 text-left">Type</th>
                <th className="px-3 py-2 text-center w-12">Line</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((tok, i) => (
                <tr key={i} className="border-b border-bg-border/30 hover:bg-bg-tertiary/40">
                  <td className="px-3 py-1.5 text-slate-500 text-[10px]">{i + 1}</td>
                  <td className="px-2 py-1.5 text-slate-100 font-bold font-mono">{tok.value}</td>
                  <td className="px-2 py-1.5">
                    <span className={`px-1.5 py-0.5 rounded border text-[10px] font-bold ${TYPE_COLORS[tok.type] || 'text-slate-400 border-slate-500/20 bg-slate-500/5'}`}>
                      {tok.type}
                    </span>
                  </td>
                  <td className="px-3 py-1.5 text-slate-400 text-center">{tok.line}</td>
                </tr>
              ))}
              {tokens.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-slate-600 py-16 text-xs select-none">
                    No tokens parsed. Click Run to execute lexer.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
