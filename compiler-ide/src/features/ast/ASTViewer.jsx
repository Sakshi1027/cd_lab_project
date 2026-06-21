import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { toPng } from 'html-to-image';
import 'reactflow/dist/style.css';
import { useCompilerStore } from '../../store/compilerStore';
import { astToFlow } from './astHelpers';

const STATUS_COLORS = {
  safe:       { bg: '#064E3B', border: '#10B981', text: '#34D399' }, // Emerald
  borderline: { bg: '#78350F', border: '#F59E0B', text: '#FBBF24' }, // Amber
  blocked:    { bg: '#881337', border: '#F43F5E', text: '#FB7185' }, // Rose
  neutral:    { bg: '#1F2937', border: '#374151', text: '#9CA3AF' }  // Slate
};

function ASTNode({ data }) {
  const status = data.status || 'neutral';
  const colors = STATUS_COLORS[status];
  
  return (
    <div 
      className={`relative group px-4 py-2 border-2 rounded text-center text-xs font-mono shadow-lg min-w-[130px] font-semibold transition-all duration-200 
                  hover:scale-110 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:z-50 cursor-pointer`} 
      style={{ 
        backgroundColor: colors.bg, 
        borderColor: colors.border,
        color: '#F8FAFC'
      }}
    >
      <div className="text-[10px] font-bold mb-0.5 uppercase tracking-wider" style={{ color: colors.text }}>
        {data.label}
      </div>
      {data.value && <div className="font-extrabold text-[12px] truncate max-w-[150px]">{data.value}</div>}
      
      {/* Error Budget Badge (visible on hover) */}
      {data.errorBudget && (
        <div className="absolute -top-3 -right-3 bg-slate-800 border border-slate-500 text-[9px] px-1.5 py-0.5 rounded text-sky-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md z-50">
          Budget: ±{data.errorBudget}
        </div>
      )}
    </div>
  );
}

const nodeTypes = { astNode: ASTNode };

export default function ASTViewer() {
  const { ast, isRunning } = useCompilerStore();
  const reactFlowWrapper = useRef(null);

  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    if (!ast) return { nodes: [], edges: [] };
    return astToFlow(ast);
  }, [ast]);

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [highlightedPath, setHighlightedPath] = useState(new Set());

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    setHighlightedPath(new Set());
  }, [initialNodes, initialEdges]);

  // Traces all upstream node IDs from a given starting node
  const getUpstreamNodes = useCallback((startNodeId, currentEdges) => {
    const upstream = new Set([startNodeId]);
    let added = true;
    while (added) {
      added = false;
      currentEdges.forEach(edge => {
        if (upstream.has(edge.target) && !upstream.has(edge.source)) {
          upstream.add(edge.source);
          added = true;
        }
      });
    }
    return upstream;
  }, []);

  const onNodeClick = useCallback((_, node) => {
    const upstream = getUpstreamNodes(node.id, initialEdges);
    setHighlightedPath(upstream);
    
    setNodes(nds => nds.map(n => ({
      ...n,
      style: { opacity: upstream.has(n.id) ? 1 : 0.2, transition: 'opacity 0.3s' }
    })));

    setEdges(eds => eds.map(e => ({
      ...e,
      animated: upstream.has(e.source) && upstream.has(e.target),
      style: { 
        ...e.style, 
        stroke: upstream.has(e.source) && upstream.has(e.target) ? '#A78BFA' : '#334155',
        strokeWidth: upstream.has(e.source) && upstream.has(e.target) ? 3 : 1,
        opacity: upstream.has(e.source) && upstream.has(e.target) ? 1 : 0.15
      },
      label: (upstream.has(e.source) && upstream.has(e.target) && (e.data?.errorBudget || node.data?.errorBudget)) ? `±${e.data?.errorBudget || node.data?.errorBudget}` : ''
    })));
  }, [initialEdges, getUpstreamNodes]);

  const onPaneClick = useCallback(() => {
    setHighlightedPath(new Set());
    setNodes(initialNodes.map(n => ({ ...n, style: { opacity: 1, transition: 'opacity 0.3s' } })));
    setEdges(initialEdges.map(e => ({ ...e, animated: true, style: { ...e.style, stroke: '#475569', strokeWidth: 1.5, opacity: 1 }, label: '' })));
  }, [initialNodes, initialEdges]);

  const onNodeMouseEnter = useCallback((_, node) => {
    if (highlightedPath.size > 0) return; // Don't override click highlights
    
    setEdges(eds => eds.map(e => {
      if (e.source === node.id || e.target === node.id) {
        const budget = node.data?.errorBudget || e.data?.errorBudget;
        return {
          ...e,
          label: budget ? `±${budget}` : 'dependency',
          style: { ...e.style, stroke: '#38BDF8', strokeWidth: 2.5, opacity: 1 }
        };
      }
      return { ...e, style: { ...e.style, opacity: 0.2 } };
    }));
  }, [highlightedPath]);

  const onNodeMouseLeave = useCallback(() => {
    if (highlightedPath.size > 0) return;
    setEdges(initialEdges.map(e => ({ ...e, label: '' })));
  }, [highlightedPath, initialEdges]);

  const downloadImage = useCallback(() => {
    if (reactFlowWrapper.current) {
      const viewport = reactFlowWrapper.current.querySelector('.react-flow__viewport');
      if (!viewport) return;
      toPng(reactFlowWrapper.current, { backgroundColor: '#0a0f1d' })
        .then((dataUrl) => {
          const a = document.createElement('a');
          a.setAttribute('download', 'live_dfg_export.png');
          a.setAttribute('href', dataUrl);
          a.click();
        })
        .catch(err => console.error("Failed to export image", err));
    }
  }, []);

  if (isRunning) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 text-xs gap-3">
        <div className="w-6 h-6 border-2 border-accent-purple border-t-transparent rounded-full animate-spin" />
        <span>Analyzing Syntax & Propagation...</span>
      </div>
    );
  }

  if (!ast) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 text-xs px-6 text-center">
        <span className="text-lg mb-2">🌳</span>
        <span>Run the compiler toolbar to generate and visualize the Data-Flow Graph.</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-bg-secondary relative overflow-hidden flex flex-col">
      <div className="px-3 py-2 text-xs text-slate-400 border-b border-bg-border bg-[#161F30] font-semibold shrink-0 select-none flex justify-between items-center z-10">
        <span>⚡ Live DFG & Precision Analysis</span>
        <button 
          onClick={downloadImage}
          className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] transition-colors shadow border border-indigo-400/30"
        >
          Export PNG
        </button>
      </div>
      <div className="flex-1 relative overflow-hidden bg-[#0a0f1d]" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onNodeMouseEnter={onNodeMouseEnter}
          onNodeMouseLeave={onNodeMouseLeave}
          fitView
          fitViewOptions={{ padding: 0.25 }}
          proOptions={{ hideAttribution: true }}
          minZoom={0.1}
          maxZoom={2}
        >
          <Background color="#1E2D45" gap={16} size={1} />
          <Controls className="bg-[#111827] border border-bg-border fill-slate-300 rounded shadow-lg" showInteractive={false} />
          <MiniMap 
            nodeColor={(n) => {
              if (n.data?.status === 'safe') return '#10B981';
              if (n.data?.status === 'borderline') return '#F59E0B';
              if (n.data?.status === 'blocked') return '#F43F5E';
              return '#374151';
            }}
            maskColor="rgba(10, 15, 29, 0.7)"
            style={{ 
              backgroundColor: '#111827', 
              border: '1px solid #1E2D45', 
              borderRadius: '4px',
              width: 120,
              height: 90
            }}
          />
        </ReactFlow>
      </div>
    </div>
  );
}
