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
};

export default function LeftSidebar() {
  const { files, activeFile, setActiveFile } = useCompilerStore();

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: '#0f1929', borderRight: '1px solid #1f2f4a' }}>
      {/* Phase Progress */}
      <div className="flex-none px-3 pt-3">
        <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#4b5563' }}>
          Compiler Phases
        </div>
        <PhaseList />
      </div>

      <div className="my-2 mx-3 border-t" style={{ borderColor: '#1f2f4a' }} />

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
              style={{
                background: activeFile === f ? 'rgba(124,58,237,0.15)' : 'transparent',
                color: activeFile === f ? '#c084fc' : '#64748b',
                borderLeft: activeFile === f ? '2px solid #7C3AED' : '2px solid transparent'
              }}
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

      <div className="my-2 mx-3 border-t" style={{ borderColor: '#1f2f4a' }} />

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
