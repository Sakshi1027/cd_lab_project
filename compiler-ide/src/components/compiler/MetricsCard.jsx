import React from 'react';
import { Hash, Activity, HardDrive, AlertTriangle } from 'lucide-react';
import { useCompilerStore } from '../../store/compilerStore';

export default function MetricsCard() {
  const { tokensCount, errorMargin, memorySaving, problems } = useCompilerStore();

  const metrics = [
    {
      title: "Tokens Parsed",
      value: tokensCount || "-",
      icon: Hash,
      color: "text-accent-blue bg-accent-blue/10 border-accent-blue/20"
    },
    {
      title: "Absolute Error",
      value: errorMargin || "-",
      icon: Activity,
      color: "text-accent-amber bg-accent-amber/10 border-accent-amber/20"
    },
    {
      title: "Memory Saving",
      value: memorySaving || "-",
      icon: HardDrive,
      color: "text-accent-green bg-accent-green/10 border-accent-green/20"
    },
    {
      title: "Active Problems",
      value: problems.length,
      icon: AlertTriangle,
      color: problems.length > 0 
        ? "text-accent-red bg-accent-red/10 border-accent-red/20 animate-pulse" 
        : "text-slate-400 bg-slate-400/10 border-slate-400/20"
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-2 p-2 border-b border-bg-border bg-bg-secondary shrink-0">
      {metrics.map((m, i) => (
        <div key={i} className={`flex items-center gap-2 p-2 border rounded shadow-sm ${m.color}`}>
          <div className="p-1 rounded bg-bg-primary shrink-0">
            <m.icon size={14} />
          </div>
          <div className="overflow-hidden">
            <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold truncate">{m.title}</div>
            <div className="text-xs font-mono font-bold leading-none mt-0.5">{m.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
