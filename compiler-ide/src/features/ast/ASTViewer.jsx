import React, { useMemo } from 'react';
import ReactFlow, { Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';
import { useCompilerStore } from '../../store/compilerStore';
import { astToFlow } from './astHelpers';

const NODE_COLORS = {
  Program:      '#3B1F70',   // Root Purple-Blue
  FunctionDecl: '#1E3A8A',   // Deep Tech Blue
  Declarations: '#14532D',   // Deep Forest Green
  Declaration:  '#15803D',   // Rich Emerald Green
  Statements:   '#0F172A',   // Midnight Slate
  Assignment:   '#7C2D12',   // Warm Rust/Orange
  Return:       '#581C87',   // Vibrant Violet
  default:      '#1F2937'    // Neutral Gray
};

function ASTNode({ data }) {
  const bg = NODE_COLORS[data.label] || NODE_COLORS.default;
  return (
    <div 
      className="px-4 py-2 border border-bg-border rounded text-center text-xs font-mono shadow-lg text-slate-100 min-w-[130px] font-semibold transition-all duration-300 hover:scale-105" 
      style={{ backgroundColor: bg }}
    >
      <div className="text-[10px] text-slate-300 font-bold mb-0.5 uppercase tracking-wider">{data.label}</div>
      {data.value && <div className="text-accent-green font-extrabold text-[12px] truncate max-w-[150px]">{data.value}</div>}
    </div>
  );
}

const nodeTypes = { astNode: ASTNode };

export default function ASTViewer() {
  const { ast, isRunning } = useCompilerStore();

  const { nodes, edges } = useMemo(() => {
    if (!ast) return { nodes: [], edges: [] };
    return astToFlow(ast);
  }, [ast]);

  if (isRunning) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 text-xs gap-3">
        <div className="w-6 h-6 border-2 border-accent-purple border-t-transparent rounded-full animate-spin" />
        <span>Analyzing Syntax...</span>
      </div>
    );
  }

  if (!ast) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 text-xs px-6 text-center">
        <span className="text-lg mb-2">🌳</span>
        <span>Run the compiler toolbar to generate and visualize the Abstract Syntax Tree.</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-bg-secondary relative overflow-hidden flex flex-col">
      <div className="px-3 py-2 text-xs text-slate-400 border-b border-bg-border bg-[#161F30] font-semibold shrink-0 select-none">
        🌳 AST Syntax Tree Layout
      </div>
      <div className="flex-1 relative overflow-hidden bg-[#0a0f1d]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.25 }}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#1E2D45" gap={14} size={1} />
          <Controls className="bg-[#111827] border border-bg-border text-white rounded p-1 shadow-lg" />
        </ReactFlow>
      </div>
    </div>
  );
}
