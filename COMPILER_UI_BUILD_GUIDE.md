# MiniLang Compiler IDE — Complete UI Build Guide

> A professional compiler visualization dashboard inspired by VS Code. Dark-themed, panel-based, interactive IDE with real-time compiler phase tracking.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Folder Structure](#3-folder-structure)
4. [Installation & Setup](#4-installation--setup)
5. [Layout Architecture](#5-layout-architecture)
6. [Component Breakdown](#6-component-breakdown)
7. [Color & Theme System](#7-color--theme-system)
8. [Monaco Editor Integration](#8-monaco-editor-integration)
9. [AST Visualizer (React Flow)](#9-ast-visualizer-react-flow)
10. [Bottom Output Panel (Tabs)](#10-bottom-output-panel-tabs)
11. [Compiler Phase Sidebar](#11-compiler-phase-sidebar)
12. [Backend API Integration](#12-backend-api-integration)
13. [Compiler Phase Animation](#13-compiler-phase-animation)
14. [Sample Code & Mock Data](#14-sample-code--mock-data)
15. [Deployment](#15-deployment)

---

## 1. Project Overview

Your compiler UI is a **4-panel IDE layout** that visualizes each stage of compilation:

```
┌──────────────┬──────────────────────┬──────────────┬──────────────┐
│  LEFT SIDEBAR│   CENTER: CODE EDITOR│ TOKEN TABLE  │  AST VIEWER  │
│              │                      │              │              │
│ Phase Status │   Monaco Editor      │ Token | Type │  Tree Nodes  │
│              │   (Syntax highlight) │ Line  | Lexe │  (React Flow)│
│ Source Files │                      │              │              │
├──────────────┴──────────────────────┴──────────────┴──────────────┤
│           BOTTOM OUTPUT PANEL (Tabbed)                             │
│  Lexical | Syntax | Semantic | Intermediate | Optimized | Generated│
└────────────────────────────────────────────────────────────────────┘
```

---

## 2. Tech Stack

| Component         | Tool                    | Why                                      |
|-------------------|-------------------------|------------------------------------------|
| Framework         | React 18 + Vite         | Fast dev, HMR, modern JSX                |
| Styling           | Tailwind CSS v3         | Dark theme utilities, rapid layout       |
| Code Editor       | Monaco Editor           | VS Code engine, syntax highlighting      |
| AST Graph         | React Flow              | Node-edge tree rendering                 |
| Animations        | Framer Motion           | Phase transitions, panel reveals         |
| State Management  | Zustand                 | Lightweight global state                 |
| API Calls         | Axios                   | REST calls to Python backend             |
| Terminal/Logs     | xterm.js                | Real terminal feel                       |
| Icons             | Lucide React            | Clean developer icons                    |
| Backend           | FastAPI (Python)        | Runs your compiler phases, returns JSON  |

---

## 3. Folder Structure

```
compiler-ide/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.jsx           # Root layout wrapper
│   │   │   ├── TopBar.jsx             # Toolbar: Run, Clear, Upload buttons
│   │   │   ├── LeftSidebar.jsx        # Phase list + source files
│   │   │   ├── CenterPanel.jsx        # Monaco editor wrapper
│   │   │   ├── TokenPanel.jsx         # Tokens table (right of editor)
│   │   │   ├── ASTPanel.jsx           # React Flow AST tree (far right)
│   │   │   └── BottomPanel.jsx        # Tabbed output panel
│   │   ├── compiler/
│   │   │   ├── PhaseList.jsx          # Phase status list with icons
│   │   │   ├── PhaseIndicator.jsx     # Individual phase badge
│   │   │   ├── TokenTable.jsx         # Token/Type/Lexeme table
│   │   │   ├── ASTViewer.jsx          # React Flow tree component
│   │   │   ├── OutputTabs.jsx         # Tab switcher for bottom panel
│   │   │   └── LogTerminal.jsx        # xterm.js terminal output
│   │   └── ui/
│   │       ├── Button.jsx
│   │       ├── Badge.jsx
│   │       └── Spinner.jsx
│   ├── store/
│   │   └── compilerStore.js           # Zustand global state
│   ├── hooks/
│   │   └── useCompiler.js             # API call + state update logic
│   ├── lib/
│   │   ├── api.js                     # Axios instance + endpoints
│   │   └── astHelpers.js              # Convert AST JSON → React Flow nodes
│   ├── styles/
│   │   └── globals.css                # Tailwind base + custom scrollbar
│   ├── App.jsx
│   └── main.jsx
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 4. Installation & Setup

### Step 1 — Create Project

```bash
npm create vite@latest compiler-ide -- --template react
cd compiler-ide
npm install
```

### Step 2 — Install All Dependencies

```bash
# Core UI
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Editor
npm install @monaco-editor/react

# Graph
npm install reactflow

# Animation
npm install framer-motion

# State
npm install zustand

# API
npm install axios

# Icons
npm install lucide-react

# Terminal
npm install xterm xterm-addon-fit
```

### Step 3 — Tailwind Config

In `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          primary:   "#0B1020",   // main dark background
          secondary: "#111827",   // panel background
          tertiary:  "#1A2235",   // hover / active
          border:    "#1E2D45",   // borders between panels
        },
        accent: {
          purple: "#7C3AED",
          blue:   "#3B82F6",
          green:  "#10B981",
          amber:  "#F59E0B",
          red:    "#EF4444",
        },
        token: {
          keyword:    "#7C3AED",   // purple
          identifier: "#34D399",   // green
          operator:   "#F59E0B",   // amber
          number:     "#60A5FA",   // blue
          symbol:     "#F472B6",   // pink
          string:     "#FB923C",   // orange
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
```

### Step 4 — Global CSS (`src/styles/globals.css`)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Import monospace font */
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;500;600&display=swap');

/* Thin dark scrollbar */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: #0B1020; }
::-webkit-scrollbar-thumb { background: #1E2D45; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #2D3F5A; }

body {
  background-color: #0B1020;
  color: #E2E8F0;
  font-family: 'Inter', sans-serif;
  overflow: hidden;
  height: 100vh;
}

/* Monaco editor overrides */
.monaco-editor .margin { background-color: #111827 !important; }
.monaco-editor, .monaco-editor-background { background-color: #111827 !important; }
```

---

## 5. Layout Architecture

### `src/App.jsx`

```jsx
import AppShell from './components/layout/AppShell';

export default function App() {
  return <AppShell />;
}
```

### `src/components/layout/AppShell.jsx`

```jsx
import TopBar from './TopBar';
import LeftSidebar from './LeftSidebar';
import CenterPanel from './CenterPanel';
import TokenPanel from './TokenPanel';
import ASTPanel from './ASTPanel';
import BottomPanel from './BottomPanel';

export default function AppShell() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-bg-primary">
      
      {/* TOP BAR */}
      <TopBar />

      {/* MAIN AREA */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* LEFT SIDEBAR — 220px fixed */}
        <LeftSidebar />

        {/* CENTER EDITOR */}
        <CenterPanel />

        {/* TOKEN TABLE — 280px */}
        <TokenPanel />

        {/* AST VIEWER — 280px */}
        <ASTPanel />
      </div>

      {/* BOTTOM PANEL — 220px fixed height */}
      <BottomPanel />

    </div>
  );
}
```

> **Panel widths:** Left = `w-56`, Center = `flex-1`, Token = `w-72`, AST = `w-72`, Bottom = `h-56`

---

## 6. Component Breakdown

### `TopBar.jsx`

```jsx
import { Play, X, Upload, Settings, Moon } from 'lucide-react';
import { useCompilerStore } from '../../store/compilerStore';
import { useCompiler } from '../../hooks/useCompiler';

export default function TopBar() {
  const { activeFile, isRunning } = useCompilerStore();
  const { runCompiler, clearOutput } = useCompiler();

  return (
    <div className="flex items-center justify-between h-12 px-4
                    bg-bg-secondary border-b border-bg-border shrink-0">
      
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded bg-accent-purple flex items-center justify-center">
          <span className="text-white text-xs font-bold">&lt;/&gt;</span>
        </div>
        <span className="text-white font-semibold text-sm">MiniLang Compiler</span>
      </div>

      {/* File Tab */}
      <div className="flex items-center gap-1 bg-bg-primary px-3 py-1 rounded text-sm text-slate-300">
        <span>{activeFile}</span>
        <span className="w-2 h-2 rounded-full bg-accent-green ml-2" />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={runCompiler}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-1.5 rounded
                     bg-accent-purple hover:bg-purple-700 text-white text-sm font-medium
                     transition-colors disabled:opacity-50"
        >
          <Play size={14} /> {isRunning ? 'Running...' : 'Run'}
        </button>
        <button onClick={clearOutput}
          className="px-3 py-1.5 rounded border border-bg-border
                     text-slate-400 hover:text-white text-sm transition-colors">
          <X size={14} className="inline mr-1" /> Clear
        </button>
        <button className="p-1.5 rounded text-slate-400 hover:text-white">
          <Upload size={16} />
        </button>
        <button className="p-1.5 rounded text-slate-400 hover:text-white">
          <Settings size={16} />
        </button>
        <button className="p-1.5 rounded text-slate-400 hover:text-white">
          <Moon size={16} />
        </button>
      </div>
    </div>
  );
}
```

---

### `LeftSidebar.jsx`

```jsx
import PhaseList from '../compiler/PhaseList';
import { FilePlus, Trash2 } from 'lucide-react';
import { useCompilerStore } from '../../store/compilerStore';

export default function LeftSidebar() {
  const { files, activeFile, setActiveFile } = useCompilerStore();

  return (
    <div className="w-56 shrink-0 flex flex-col bg-bg-secondary
                    border-r border-bg-border overflow-hidden">
      
      {/* Phase header */}
      <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-widest">
        Compiler Phases
      </div>

      <PhaseList />

      {/* Divider */}
      <div className="border-t border-bg-border my-1" />

      {/* Source Files */}
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
          Source Files
        </span>
        <button className="text-slate-500 hover:text-accent-green">
          <FilePlus size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
        {files.map(file => (
          <div
            key={file}
            onClick={() => setActiveFile(file)}
            className={`flex items-center justify-between px-2 py-1.5 rounded cursor-pointer text-sm
              ${activeFile === file
                ? 'bg-accent-purple/20 text-white'
                : 'text-slate-400 hover:bg-bg-tertiary hover:text-white'
              }`}
          >
            <span>📄 {file}</span>
            <Trash2 size={12} className="opacity-0 hover:opacity-100 text-red-400" />
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### `PhaseList.jsx`

```jsx
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Loader, Zap, Code2, Search, FileCode, Cpu, BarChart2 } from 'lucide-react';
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
  if (status === 'done')    return <CheckCircle size={14} className="text-accent-green" />;
  if (status === 'error')   return <AlertCircle size={14} className="text-accent-red"   />;
  if (status === 'running') return <Loader      size={14} className="text-accent-amber animate-spin" />;
  return null;
};

export default function PhaseList() {
  const { phaseStatus, activePhase } = useCompilerStore();

  return (
    <div className="px-2 space-y-0.5">
      {PHASES.map(({ id, label, icon: Icon }) => {
        const status = phaseStatus[id] ?? 'idle';
        return (
          <motion.div
            key={id}
            animate={{ backgroundColor: activePhase === id ? 'rgba(124,58,237,0.15)' : 'transparent' }}
            className="flex items-center gap-2 px-2 py-2 rounded cursor-pointer"
          >
            <Icon size={14} className={
              status === 'done'    ? 'text-accent-green' :
              status === 'running' ? 'text-accent-amber' :
              status === 'error'   ? 'text-accent-red'   : 'text-slate-500'
            } />
            <span className={`flex-1 text-xs ${
              status === 'idle' ? 'text-slate-500' : 'text-slate-200'
            }`}>{label}</span>
            {statusIcon(status)}
            {status === 'done' && (
              <span className="text-[10px] text-accent-green font-medium">Completed</span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
```

---

### `CenterPanel.jsx`

```jsx
import Editor from '@monaco-editor/react';
import { useCompilerStore } from '../../store/compilerStore';

const MONACO_OPTIONS = {
  theme: 'vs-dark',
  fontSize: 14,
  fontFamily: 'JetBrains Mono, Fira Code, monospace',
  fontLigatures: true,
  minimap: { enabled: false },
  lineNumbers: 'on',
  scrollBeyondLastLine: false,
  automaticLayout: true,
  wordWrap: 'on',
  padding: { top: 12 },
  renderLineHighlight: 'all',
  cursorBlinking: 'smooth',
  smoothScrolling: true,
};

export default function CenterPanel() {
  const { code, setCode } = useCompilerStore();

  return (
    <div className="flex flex-col flex-1 border-r border-bg-border overflow-hidden">
      <div className="px-3 py-2 text-xs text-slate-500 border-b border-bg-border bg-bg-secondary">
        Source Code
      </div>
      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage="c"
          value={code}
          onChange={(val) => setCode(val ?? '')}
          options={MONACO_OPTIONS}
          theme="vs-dark"
        />
      </div>
    </div>
  );
}
```

---

### `TokenPanel.jsx`

```jsx
import { useCompilerStore } from '../../store/compilerStore';

const TYPE_COLOR = {
  KEYWORD:    'text-purple-400',
  IDENTIFIER: 'text-green-400',
  OPERATOR:   'text-amber-400',
  NUMBER:     'text-blue-400',
  SYMBOL:     'text-pink-400',
  STRING:     'text-orange-400',
};

export default function TokenPanel() {
  const { tokens } = useCompilerStore();

  return (
    <div className="w-72 shrink-0 flex flex-col bg-bg-secondary border-r border-bg-border overflow-hidden">
      <div className="px-3 py-2 text-xs text-slate-500 border-b border-bg-border">
        Tokens
      </div>
      <div className="overflow-y-auto flex-1">
        <table className="w-full text-xs font-mono">
          <thead className="sticky top-0 bg-bg-secondary">
            <tr className="text-slate-500 border-b border-bg-border">
              <th className="px-2 py-2 text-left w-6">#</th>
              <th className="px-2 py-2 text-left">Token</th>
              <th className="px-2 py-2 text-left">Type</th>
              <th className="px-2 py-2 text-left">Lexeme</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((tok, i) => (
              <tr key={i} className="border-b border-bg-border/40 hover:bg-bg-tertiary">
                <td className="px-2 py-1.5 text-slate-600">{i + 1}</td>
                <td className="px-2 py-1.5 text-slate-300">{tok.value}</td>
                <td className={`px-2 py-1.5 font-semibold ${TYPE_COLOR[tok.type] ?? 'text-slate-400'}`}>
                  {tok.type}
                </td>
                <td className="px-2 py-1.5 text-slate-400">{tok.lexeme}</td>
              </tr>
            ))}
            {tokens.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-slate-600 py-8 text-xs">
                  Run compiler to see tokens
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

### `ASTPanel.jsx`

```jsx
import ASTViewer from '../compiler/ASTViewer';

export default function ASTPanel() {
  return (
    <div className="w-72 shrink-0 flex flex-col bg-bg-secondary overflow-hidden">
      <div className="px-3 py-2 text-xs text-slate-500 border-b border-bg-border">
        Abstract Syntax Tree (AST)
      </div>
      <div className="flex-1 overflow-hidden">
        <ASTViewer />
      </div>
    </div>
  );
}
```

---

## 7. Color & Theme System

```
Background layers (darkest → lightest):
  #0B1020  →  bg-primary     (page)
  #111827  →  bg-secondary   (panels)
  #1A2235  →  bg-tertiary    (hover states)
  #1E2D45  →  bg-border      (dividers)

Accent colors:
  #7C3AED  → Purple   (active phase, Run button)
  #10B981  → Green    (completed, identifiers)
  #3B82F6  → Blue     (numbers, info)
  #F59E0B  → Amber    (operators, running state)
  #EF4444  → Red      (errors)
  #F472B6  → Pink     (symbols)

Token type colors:
  KEYWORD     → purple-400
  IDENTIFIER  → green-400
  OPERATOR    → amber-400
  NUMBER      → blue-400
  SYMBOL      → pink-400
  STRING      → orange-400
```

---

## 8. Monaco Editor Integration

### Custom Language (optional — define grammar for your language)

```js
// src/lib/miniLangDefinition.js
export function registerMiniLang(monaco) {
  monaco.languages.register({ id: 'minilang' });

  monaco.languages.setMonarchTokensProvider('minilang', {
    keywords: ['int', 'float', 'if', 'else', 'while', 'return', 'void', 'main'],
    tokenizer: {
      root: [
        [/[a-zA-Z_]\w*/, {
          cases: {
            '@keywords': 'keyword',
            '@default': 'identifier',
          }
        }],
        [/\d+(\.\d+)?/, 'number'],
        [/[=+\-*/<>!&|]/, 'operator'],
        [/[{}()\[\];,]/, 'symbol'],
        [/".*?"/, 'string'],
        [/\/\/.*$/, 'comment'],
      ]
    }
  });

  monaco.editor.defineTheme('minilang-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword',    foreground: '7C3AED', fontStyle: 'bold' },
      { token: 'identifier', foreground: '34D399' },
      { token: 'number',     foreground: '60A5FA' },
      { token: 'operator',   foreground: 'F59E0B' },
      { token: 'symbol',     foreground: 'F472B6' },
      { token: 'string',     foreground: 'FB923C' },
      { token: 'comment',    foreground: '6B7280', fontStyle: 'italic' },
    ],
    colors: {
      'editor.background': '#111827',
      'editor.lineHighlightBackground': '#1A2235',
      'editorLineNumber.foreground': '#374151',
      'editorCursor.foreground': '#7C3AED',
    }
  });
}
```

Use in `CenterPanel.jsx`:

```jsx
import { registerMiniLang } from '../../lib/miniLangDefinition';

function handleEditorWillMount(monaco) {
  registerMiniLang(monaco);
}

// In your Editor component:
<Editor
  beforeMount={handleEditorWillMount}
  defaultLanguage="minilang"
  theme="minilang-dark"
  ...
/>
```

### Marking Errors in Editor

```jsx
// In useCompiler.js after getting errors from backend:
function markErrors(monaco, editor, errors) {
  const markers = errors.map(err => ({
    severity: monaco.MarkerSeverity.Error,
    startLineNumber: err.line,
    startColumn: err.column,
    endLineNumber: err.line,
    endColumn: err.column + err.length,
    message: err.message,
  }));
  monaco.editor.setModelMarkers(editor.getModel(), 'compiler', markers);
}
```

---

## 9. AST Visualizer (React Flow)

### `src/lib/astHelpers.js` — Convert JSON AST → React Flow nodes

```js
let nodeId = 0;

export function astToFlow(node, parentId = null, x = 400, y = 50, depth = 0) {
  const id = `node-${nodeId++}`;
  const nodes = [];
  const edges = [];

  nodes.push({
    id,
    type: 'astNode',
    position: { x, y },
    data: { label: node.type, value: node.value ?? '' },
  });

  if (parentId) {
    edges.push({
      id: `edge-${parentId}-${id}`,
      source: parentId,
      target: id,
      type: 'smoothstep',
      style: { stroke: '#374151', strokeWidth: 1.5 },
    });
  }

  const childCount = node.children?.length ?? 0;
  const spacing = Math.max(120, 200 / (depth + 1));

  (node.children ?? []).forEach((child, i) => {
    const childX = x + (i - (childCount - 1) / 2) * spacing;
    const childY = y + 90;
    const { nodes: cn, edges: ce } = astToFlow(child, id, childX, childY, depth + 1);
    nodes.push(...cn);
    edges.push(...ce);
  });

  return { nodes, edges };
}
```

### `ASTViewer.jsx`

```jsx
import ReactFlow, { Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';
import { useCompilerStore } from '../../store/compilerStore';
import { astToFlow } from '../../lib/astHelpers';
import { useMemo } from 'react';

const NODE_COLORS = {
  Program:    '#4C1D95',
  Function:   '#1E3A5F',
  Statements: '#1E3A5F',
  Declarations: '#1A3A2A',
  IfStatement: '#3B1F00',
  default:    '#1E293B',
};

function ASTNode({ data }) {
  const bg = NODE_COLORS[data.label] ?? NODE_COLORS.default;
  return (
    <div style={{
      background: bg,
      border: '1px solid #374151',
      borderRadius: 6,
      padding: '6px 10px',
      minWidth: 90,
      fontSize: 11,
      fontFamily: 'JetBrains Mono, monospace',
      color: '#E2E8F0',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 2 }}>{data.label}</div>
      {data.value && <div style={{ color: '#10B981', fontWeight: 600 }}>{data.value}</div>}
    </div>
  );
}

const nodeTypes = { astNode: ASTNode };

export default function ASTViewer() {
  const { ast } = useCompilerStore();

  const { nodes, edges } = useMemo(() => {
    if (!ast) return { nodes: [], edges: [] };
    return astToFlow(ast);
  }, [ast]);

  if (!ast) return (
    <div className="flex items-center justify-center h-full text-slate-600 text-xs">
      Run compiler to see AST
    </div>
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      fitView
      proOptions={{ hideAttribution: true }}
    >
      <Background color="#1E2D45" gap={20} size={1} />
      <Controls showInteractive={false} />
    </ReactFlow>
  );
}
```

---

## 10. Bottom Output Panel (Tabs)

### `BottomPanel.jsx`

```jsx
import { useState } from 'react';
import { useCompilerStore } from '../../store/compilerStore';

const TABS = [
  { id: 'lexical',      label: 'Lexical Analysis Output' },
  { id: 'syntax',       label: 'Syntax Analysis Output'  },
  { id: 'semantic',     label: 'Semantic Analysis Output' },
  { id: 'intermediate', label: 'Intermediate Code'        },
  { id: 'optimized',    label: 'Optimized Code'           },
  { id: 'generated',    label: 'Generated Code'           },
  { id: 'logs',         label: 'Logs'                     },
];

export default function BottomPanel() {
  const [activeTab, setActiveTab] = useState('lexical');
  const { outputs } = useCompilerStore();

  const content = outputs[activeTab] ?? '';

  return (
    <div className="h-52 shrink-0 flex flex-col bg-bg-secondary border-t border-bg-border">
      
      {/* Tab Bar */}
      <div className="flex items-center overflow-x-auto border-b border-bg-border">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 px-4 py-2 text-xs border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-accent-purple text-white bg-bg-tertiary'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
        <div className="flex-1" />
        <button className="px-3 py-2 text-xs text-slate-500 hover:text-white">
          Clear Output
        </button>
      </div>

      {/* Output Content */}
      <div className="flex-1 overflow-y-auto p-3 font-mono text-xs">
        {content ? (
          <pre className="whitespace-pre-wrap text-green-400">{content}</pre>
        ) : (
          <span className="text-slate-600">No output yet. Click Run to compile.</span>
        )}
      </div>
    </div>
  );
}
```

---

## 11. Compiler Phase Sidebar

### Zustand Store — `src/store/compilerStore.js`

```js
import { create } from 'zustand';

const PHASES = ['lexical', 'syntax', 'semantic', 'intermediate', 'optimization', 'codegen'];

const DEFAULT_CODE = `int main() {
    int a, b, c;
    a = 10;
    b = 20;
    c = a + b * 2;
    if (c > 30) {
        c = c - 5;
    } else {
        c = c + 5;
    }
    return c;
}`;

export const useCompilerStore = create((set, get) => ({
  // Editor
  code: DEFAULT_CODE,
  setCode: (code) => set({ code }),

  // Files
  files: ['example.min'],
  activeFile: 'example.min',
  setActiveFile: (f) => set({ activeFile: f }),

  // Compiler state
  isRunning: false,
  activePhase: null,
  phaseStatus: {},  // { lexical: 'done' | 'error' | 'running' | 'idle' }

  // Results
  tokens: [],
  ast: null,
  outputs: {},      // { lexical: 'text...', syntax: 'text...', ... }
  errors: [],

  // Actions
  setRunning: (v) => set({ isRunning: v }),
  setActivePhase: (p) => set({ activePhase: p }),
  setPhaseStatus: (phase, status) =>
    set(s => ({ phaseStatus: { ...s.phaseStatus, [phase]: status } })),
  setTokens: (tokens) => set({ tokens }),
  setAST: (ast) => set({ ast }),
  setOutput: (phase, text) =>
    set(s => ({ outputs: { ...s.outputs, [phase]: text } })),
  setErrors: (errors) => set({ errors }),

  clearAll: () => set({
    tokens: [], ast: null, outputs: {}, errors: [],
    phaseStatus: {}, activePhase: null, isRunning: false,
  }),
}));
```

---

## 12. Backend API Integration

### `src/lib/api.js`

```js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',   // your FastAPI server
  timeout: 30000,
});

export const compileCode = (code) =>
  api.post('/compile', { code }).then(r => r.data);

export const compilePhase = (code, phase) =>
  api.post(`/compile/${phase}`, { code }).then(r => r.data);
```

### `src/hooks/useCompiler.js`

```js
import { useCompilerStore } from '../store/compilerStore';
import { compileCode } from '../lib/api';

const PHASES = ['lexical', 'syntax', 'semantic', 'intermediate', 'optimization', 'codegen'];

export function useCompiler() {
  const store = useCompilerStore();

  const runCompiler = async () => {
    store.setRunning(true);
    store.clearAll();

    try {
      // Animate phases one by one
      for (const phase of PHASES) {
        store.setActivePhase(phase);
        store.setPhaseStatus(phase, 'running');
        await new Promise(r => setTimeout(r, 300)); // visual delay
      }

      const result = await compileCode(store.code);

      // Populate results
      store.setTokens(result.tokens ?? []);
      store.setAST(result.ast ?? null);
      store.setErrors(result.errors ?? []);

      PHASES.forEach(phase => {
        store.setPhaseStatus(phase, result.errors?.length ? 'error' : 'done');
        store.setOutput(phase, result.outputs?.[phase] ?? '');
      });

    } catch (err) {
      console.error('Compiler error:', err);
      store.setOutput('logs', `Error: ${err.message}`);
    } finally {
      store.setRunning(false);
      store.setActivePhase(null);
    }
  };

  const clearOutput = () => store.clearAll();

  return { runCompiler, clearOutput };
}
```

### FastAPI Backend (`backend/main.py`)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class CompileRequest(BaseModel):
    code: str

@app.post("/compile")
def compile_code(req: CompileRequest):
    # Call your existing compiler phases here
    # Replace these with actual calls to your compiler modules

    tokens = run_lexer(req.code)       # your lexer function
    ast    = run_parser(tokens)         # your parser function
    errors = run_semantic(ast)          # your semantic analyzer

    return {
        "tokens": tokens,
        "ast": ast_to_dict(ast),
        "errors": errors,
        "outputs": {
            "lexical":      format_lexical_output(tokens),
            "syntax":       format_syntax_output(ast),
            "semantic":     format_semantic_output(errors),
            "intermediate": run_ir_gen(ast),
            "optimization": run_optimizer(ast),
            "codegen":      run_codegen(ast),
            "logs":         f"Compiled successfully. {len(tokens)} tokens found.",
        }
    }

# Run with: uvicorn main:app --reload
```

### Expected JSON Response Format

```json
{
  "tokens": [
    { "value": "int",  "type": "KEYWORD",    "lexeme": "int",  "line": 1 },
    { "value": "main", "type": "IDENTIFIER", "lexeme": "main", "line": 1 },
    { "value": "(",    "type": "SYMBOL",     "lexeme": "(",    "line": 1 }
  ],
  "ast": {
    "type": "Program",
    "value": "",
    "children": [
      {
        "type": "Function",
        "value": "main",
        "children": [
          {
            "type": "Declarations",
            "value": "",
            "children": [
              { "type": "Var", "value": "a", "children": [] },
              { "type": "Var", "value": "b", "children": [] }
            ]
          }
        ]
      }
    ]
  },
  "errors": [],
  "outputs": {
    "lexical": "[SUCCESS] Lexical analysis completed.\nTotal Tokens: 45\nNo lexical errors found.",
    "syntax": "[SUCCESS] Syntax analysis completed.\nParse tree generated.",
    "intermediate": "t1 = b * 2\nt2 = a + t1\nc = t2",
    "optimized": "c = a + b * 2",
    "generated": "LOAD R1, a\nLOAD R2, b\nMUL R2, 2\nADD R1, R2\nSTORE c, R1",
    "logs": "Compilation successful. 0 errors, 0 warnings."
  }
}
```

---

## 13. Compiler Phase Animation

```jsx
// In PhaseList.jsx — animate active phase with a pulsing glow

import { motion } from 'framer-motion';

// Wrap each phase item:
<motion.div
  key={id}
  animate={{
    backgroundColor: activePhase === id
      ? 'rgba(124, 58, 237, 0.2)'
      : 'transparent',
    boxShadow: activePhase === id
      ? '0 0 12px rgba(124,58,237,0.3)'
      : 'none',
  }}
  transition={{ duration: 0.3 }}
  className="flex items-center gap-2 px-2 py-2 rounded"
>
  ...
</motion.div>

// In TopBar.jsx — Run button loading animation
<motion.button
  whileHover={{ scale: 1.03 }}
  whileTap={{ scale: 0.97 }}
  onClick={runCompiler}
  animate={isRunning ? { opacity: [1, 0.7, 1] } : {}}
  transition={{ repeat: Infinity, duration: 1 }}
>
  <Play size={14} /> {isRunning ? 'Compiling...' : 'Run'}
</motion.button>
```

---

## 14. Sample Code & Mock Data

Use this for testing before the backend is ready:

```js
// src/lib/mockData.js
export const MOCK_TOKENS = [
  { value: 'int',  type: 'KEYWORD',    lexeme: 'int'  },
  { value: 'main', type: 'IDENTIFIER', lexeme: 'main' },
  { value: '(',    type: 'SYMBOL',     lexeme: '('    },
  { value: ')',    type: 'SYMBOL',     lexeme: ')'    },
  { value: '{',    type: 'SYMBOL',     lexeme: '{'    },
  { value: 'int',  type: 'KEYWORD',    lexeme: 'int'  },
  { value: 'a',    type: 'IDENTIFIER', lexeme: 'a'    },
  { value: '=',    type: 'OPERATOR',   lexeme: '='    },
  { value: '10',   type: 'NUMBER',     lexeme: '10'   },
];

export const MOCK_AST = {
  type: 'Program', value: '', children: [
    { type: 'Function', value: 'main', children: [
      { type: 'Declarations', value: '', children: [
        { type: 'Var', value: 'a', children: [] },
        { type: 'Var', value: 'b', children: [] },
      ]},
      { type: 'Statements', value: '', children: [
        { type: 'Assign', value: 'a = 10', children: [] },
        { type: 'Assign', value: 'b = 20', children: [] },
        { type: 'IfStatement', value: '', children: [
          { type: 'Condition', value: 'c > 30', children: [] },
          { type: 'Then', value: '', children: [
            { type: 'Assign', value: 'c = c - 5', children: [] }
          ]},
          { type: 'Else', value: '', children: [
            { type: 'Assign', value: 'c = c + 5', children: [] }
          ]},
        ]},
        { type: 'Return', value: 'c', children: [] },
      ]},
    ]},
  ]
};
```

---

## 15. Deployment

### Dev Mode

```bash
# Terminal 1: Frontend
npm run dev
# Runs on http://localhost:5173

# Terminal 2: Backend
cd backend
uvicorn main:app --reload
# Runs on http://localhost:8000
```

### Production Build

```bash
npm run build
# Outputs to /dist folder
# Deploy to: Vercel, Netlify, or GitHub Pages
```

### Docker (optional)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

---

## Checklist Before Viva / Demo

- [ ] Monaco editor loads with syntax highlighting
- [ ] Run button triggers animation on each phase in sidebar
- [ ] Token table populates correctly from backend
- [ ] AST tree renders with React Flow
- [ ] All 7 bottom tabs show respective output
- [ ] Errors show red markers in editor
- [ ] Source file management works (add/delete)
- [ ] Backend connected and returning correct JSON format
- [ ] Responsive at 1280px+ width
- [ ] No console errors in browser dev tools

---

> Built with React + Tailwind + Monaco + React Flow + FastAPI
> Reference design: MiniLang Compiler IDE
