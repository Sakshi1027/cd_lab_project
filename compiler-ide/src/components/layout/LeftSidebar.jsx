import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderOpen, File, ChevronRight } from 'lucide-react';
import { useCompilerStore } from '../../store/compilerStore';
import PhaseList from '../compiler/PhaseList';
import MetricsCard from '../compiler/MetricsCard';

const FILE_ICONS = {
  'test.c': '🔬',
  'kernel_dot_product.c': '🔢',
  'kernel_fir_filter.c': '📡',
  'kernel_softmax.c': '🧠',
    'kernel_sigmoid.c': '⚡',
  'kernel_polynomial.c': '📐',
  'kernel_int_quantization.c': '📦',
    'kernel_double_demotion.c': '🎯',
  'kernel_int_extreme.c': '🚧',
  'kernel_double_extreme.c': '🔬',
};

export default function LeftSidebar() {
  const { files, activeFile, setActiveFile } = useCompilerStore();

  return (
    <div className="h-full flex flex-col overflow-hidden glass-panel">
      {/* Phase Progress */}
      <div className="flex-none px-3 pt-3">
        <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#4b5563' }}>
          Compiler Phases
        </div>
        <PhaseList />
      </div>

      <div className="my-2 mx-3 border-t border-white/5" />

      {/* File Explorer */}
      <div className="flex-none px-3">
        <div className="flex items-center gap-1.5 mb-2">
          <FolderOpen size={12} style={{ color: '#4b5563' }} />
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#4b5563' }}>
            Kernel Files
          </span>
        </div>
        <div className="space-y-0.5">
          {files.map((f) => (
            <motion.button
              key={f}
              whileHover={{ x: 2 }}
              onClick={() => setActiveFile(f)}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-all text-left"
              style={{ background: activeFile === f ? 'linear-gradient(90deg, rgba(139,92,246,0.15) 0%, transparent 100%)' : 'transparent', color: activeFile === f ? '#c084fc' : '#94a3b8', borderLeft: activeFile === f ? '2px solid #8b5cf6' : '2px solid transparent', textShadow: activeFile === f ? '0 0 10px rgba(139,92,246,0.5)' : 'none' }}
            >
              <span className="text-base leading-none">{FILE_ICONS[f] || '📄'}</span>
              <span className="truncate">{f}</span>
              {activeFile === f && (
                <ChevronRight size={10} className="ml-auto shrink-0" style={{ color: '#7C3AED' }} />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="my-2 mx-3 border-t border-white/5" />

      {/* Metrics */}
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#4b5563' }}>
          Precision Metrics
        </div>
        <MetricsCard />
      </div>
    </div>
  );
}
