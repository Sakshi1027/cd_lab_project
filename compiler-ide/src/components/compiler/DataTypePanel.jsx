import React from 'react';
import { useCompilerStore } from '../../store/compilerStore';

export default function DataTypePanel() {
  const { datatypeAnalysis, isRunning } = useCompilerStore();

  if (isRunning) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 h-full text-slate-600 text-xs gap-3 select-none">
        <div className="w-5 h-5 border-2 border-accent-purple border-t-transparent rounded-full animate-spin" />
        <span>Analyzing Data Types...</span>
      </div>
    );
  }

  if (!datatypeAnalysis || !datatypeAnalysis.variables || datatypeAnalysis.variables.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center h-full text-slate-600 text-xs select-none">
        No datatype analysis data available. Run the compiler to generate it.
      </div>
    );
  }

  const { variables, stats } = datatypeAnalysis;

  // Helpers for simple bar charts
  const maxMem = Math.max(...Object.values(stats.memoryByType), 1);
  const maxCount = Math.max(...Object.values(stats.countsByType), 1);

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto bg-bg-secondary p-4 space-y-6 select-text text-slate-300 font-sans">
      
      {/* Dashboard Top Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 shrink-0">
        <div className="bg-bg-tertiary p-3 rounded-lg border border-bg-border flex flex-col justify-center items-center">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">Total Variables</span>
          <span className="text-2xl font-bold text-white">{stats.total}</span>
        </div>
        <div className="bg-bg-tertiary p-3 rounded-lg border border-bg-border flex flex-col justify-center items-center">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">Integer vs Float</span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-blue-400">{stats.integer}</span>
            <span className="text-xs text-slate-500">/</span>
            <span className="text-xl font-bold text-purple-400">{stats.floatingPoint}</span>
          </div>
        </div>
        <div className="bg-bg-tertiary p-3 rounded-lg border border-bg-border flex flex-col justify-center items-center">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">Signed vs Unsigned</span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-emerald-400">{stats.signed}</span>
            <span className="text-xs text-slate-500">/</span>
            <span className="text-xl font-bold text-amber-400">{stats.unsigned}</span>
          </div>
        </div>
        <div className="bg-bg-tertiary p-3 rounded-lg border border-bg-border flex flex-col justify-center items-center">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">Max Memory Type</span>
          <span className="text-lg font-bold text-white truncate w-full text-center">
             {Object.keys(stats.memoryByType).length ? Object.keys(stats.memoryByType).reduce((a, b) => stats.memoryByType[a] > stats.memoryByType[b] ? a : b) : "-"}
          </span>
        </div>
      </div>

      {/* Visualizations Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0">
        <div className="bg-bg-tertiary p-4 rounded-lg border border-bg-border">
          <h3 className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider border-b border-bg-border pb-2">Distribution of Data Types</h3>
          <div className="space-y-2">
            {Object.entries(stats.countsByType).map(([type, count]) => (
              <div key={type} className="flex items-center text-xs">
                <span className="w-24 truncate text-slate-300 font-mono text-[11px]">{type}</span>
                <div className="flex-1 h-3 bg-bg-secondary rounded-full overflow-hidden mx-3">
                  <div className="h-full bg-blue-500/80 rounded-full" style={{ width: `${(count / maxCount) * 100}%` }}></div>
                </div>
                <span className="w-6 text-right font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-bg-tertiary p-4 rounded-lg border border-bg-border">
          <h3 className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider border-b border-bg-border pb-2">Memory Consumption (Bytes)</h3>
          <div className="space-y-2">
            {Object.entries(stats.memoryByType).map(([type, mem]) => (
              <div key={type} className="flex items-center text-xs">
                <span className="w-24 truncate text-slate-300 font-mono text-[11px]">{type}</span>
                <div className="flex-1 h-3 bg-bg-secondary rounded-full overflow-hidden mx-3">
                  <div className="h-full bg-purple-500/80 rounded-full" style={{ width: `${(mem / maxMem) * 100}%` }}></div>
                </div>
                <span className="w-12 text-right font-semibold">{mem} B</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="flex-1 bg-bg-tertiary rounded-lg border border-bg-border flex flex-col min-h-0 overflow-hidden">
         <h3 className="text-xs font-semibold text-slate-400 p-3 bg-bg-secondary uppercase tracking-wider border-b border-bg-border m-0 shrink-0">Variables Table</h3>
         <div className="overflow-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 bg-bg-secondary z-10 shadow-sm border-b border-bg-border/50">
              <tr className="text-slate-400 font-medium">
                <th className="px-4 py-2 font-semibold">Variable Name</th>
                <th className="px-4 py-2 font-semibold">Type</th>
                <th className="px-4 py-2 font-semibold">Category</th>
                <th className="px-4 py-2 font-semibold">Bits</th>
                <th className="px-4 py-2 font-semibold">Memory</th>
                <th className="px-4 py-2 font-semibold">Range</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bg-border/30 font-mono text-[11px]">
              {variables.map((v, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-2 text-white font-semibold">{v.name}</td>
                  <td className="px-4 py-2 text-purple-400">{v.type}</td>
                  <td className="px-4 py-2 text-slate-400">{v.category}</td>
                  <td className="px-4 py-2 text-blue-400">{v.bitWidth}</td>
                  <td className="px-4 py-2 text-emerald-400">{v.memoryUsage}</td>
                  <td className="px-4 py-2 text-slate-500">{v.range}</td>
                </tr>
              ))}
            </tbody>
          </table>
         </div>
      </div>
      
    </div>
  );
}
