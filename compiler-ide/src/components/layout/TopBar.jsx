import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Square, Trash2, Download, Zap, Wifi, WifiOff,
  CheckCircle2, AlertTriangle, Loader2, Code2, FlaskConical
} from 'lucide-react';
import { useCompilerStore } from '../../store/compilerStore';

function StatusBadge({ icon: Icon, label, color, pulse }) {
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${color} ${pulse ? 'animate-pulse-glow' : ''}`}>
      <Icon size={11} />
      <span>{label}</span>
    </div>
  );
}

export default function TopBar() {
  const {
    isRunning, runCompiler, clearAll, statusMessage,
    compilingState, demoMode, setDemoMode,
    outputs, problems, tokensCount
  } = useCompilerStore();

  function handleExport() {
    const data = {
      timestamp: new Date().toISOString(),
      tokensCount,
      problems,
      outputs
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'compiler-report.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  const isCompiling = compilingState !== 'idle';

  return (
    <header
      className="shrink-0 h-14 flex items-center gap-3 px-4 glass-panel z-10"
    >
      {/* Logo */}
      <div className="flex items-center gap-2 mr-2">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7C3AED, #2563eb)' }}>
          <Code2 size={14} color="white" />
        </div>
        <span className="text-sm font-semibold text-white tracking-tight">CompilerIDE</span>
      </div>

      <div className="w-px h-6 bg-slate-700 mx-1" />

      {/* Action Buttons */}
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={runCompiler}
        disabled={isRunning}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: isRunning ? '#374151' : 'linear-gradient(135deg, #8b5cf6, #3b82f6)', color: 'white', boxShadow: '0 4px 15px rgba(139,92,246,0.3)' }}
      >
        {isRunning
          ? <Loader2 size={12} className="animate-spin-slow" />
          : <Play size={12} fill="white" />
        }
        {isRunning ? 'Running...' : 'Run'}
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={clearAll}
        disabled={isRunning}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-40 glass-button text-slate-300"
      >
        <Trash2 size={12} />
        Clear
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={handleExport}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all glass-button text-slate-300"
      >
        <Download size={12} />
        Export
      </motion.button>

      <div className="w-px h-6 bg-slate-700 mx-1" />

      {/* Demo Mode Toggle */}
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setDemoMode(!demoMode)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
        style={{
          borderColor: demoMode ? '#7C3AED' : '#374151',
          background: demoMode ? 'rgba(124,58,237,0.15)' : 'transparent',
          color: demoMode ? '#c084fc' : '#94a3b8'
        }}
      >
        <FlaskConical size={12} />
        Demo Mode {demoMode ? 'ON' : 'OFF'}
      </motion.button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Status Message */}
      <AnimatePresence mode="wait">
        <motion.div
          key={statusMessage}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.2 }}
          className="text-xs font-medium px-2"
          style={{ color: isCompiling ? '#F59E0B' : '#22C55E' }}
        >
          {statusMessage}
        </motion.div>
      </AnimatePresence>

      <div className="w-px h-6 bg-slate-700 mx-1" />

      {/* Backend Status */}
      <StatusBadge
        icon={demoMode ? Zap : Wifi}
        label={demoMode ? 'Demo Mode' : 'Backend Connected'}
        color="border-emerald-800 text-emerald-400 bg-emerald-900/20"
        pulse={isCompiling}
      />

      {/* Toolchain Status */}
      <StatusBadge
        icon={isCompiling ? Loader2 : CheckCircle2}
        label={isCompiling ? 'Processing...' : 'Toolchain Active'}
        color={isCompiling
          ? 'border-amber-700 text-amber-400 bg-amber-900/20'
          : 'border-blue-800 text-blue-400 bg-blue-900/20'
        }
        pulse={isCompiling}
      />
    </header>
  );
}
