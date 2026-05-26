import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Loader2, Search, FileCode, Code2, BarChart2, Zap, Cpu } from 'lucide-react';
import { useCompilerStore } from '../../store/compilerStore';

const PHASES = [
  { id: 'lexical',      label: '1. Lexical Analysis',    icon: Search     },
  { id: 'syntax',       label: '2. Syntax Analysis',     icon: FileCode   },
  { id: 'semantic',     label: '3. Semantic Analysis',   icon: Code2      },
  { id: 'intermediate', label: '4. Intermediate Code',   icon: BarChart2  },
  { id: 'optimization', label: '5. Optimization',        icon: Zap        },
  { id: 'codegen',      label: '6. Code Generation',     icon: Cpu        },
];

const statusIcon = (status) => {
  if (status === 'done')    return <CheckCircle2 size={13} className="text-accent-green" />;
  if (status === 'error')   return <AlertCircle size={13} className="text-accent-red"   />;
  if (status === 'running') return <Loader2      size={13} className="text-accent-amber animate-spin" />;
  return <div className="w-3 h-3 rounded-full border border-slate-600 shrink-0" />;
};

export default function PhaseList() {
  const { phaseStatus, activePhase } = useCompilerStore();

  return (
    <div className="px-2 py-2 space-y-1 overflow-y-auto">
      {PHASES.map(({ id, label, icon: Icon }) => {
        const status = phaseStatus[id] ?? 'idle';
        const isActive = activePhase === id;
        
        return (
          <motion.div
            key={id}
            animate={{ 
              backgroundColor: isActive ? 'rgba(124,58,237,0.15)' : 'transparent',
              boxShadow: isActive ? '0 0 8px rgba(124,58,237,0.2)' : 'none'
            }}
            transition={{ duration: 0.2 }}
            className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded border border-transparent transition-colors ${
              isActive ? 'border-accent-purple/30' : ''
            }`}
          >
            <Icon size={14} className={
              status === 'done'    ? 'text-accent-green' :
              status === 'running' ? 'text-accent-amber' :
              status === 'error'   ? 'text-accent-red'   : 'text-slate-500'
            } />
            
            <span className={`flex-1 text-xs select-none ${
              status === 'idle' ? 'text-slate-500 font-normal' : 'text-slate-200 font-medium'
            }`}>{label}</span>
            
            <div className="shrink-0 flex items-center justify-center">
              {statusIcon(status)}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
