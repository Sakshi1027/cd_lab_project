import React, { useRef, useEffect } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { useCompilerStore } from '../../store/compilerStore';
import ProblemsPanel from '../../components/compiler/ProblemsPanel';

const MONACO_OPTIONS = {
  theme: 'vs-dark',
  fontSize: 13,
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
  scrollbar: {
    vertical: 'visible',
    horizontal: 'visible',
    verticalScrollbarSize: 6,
    horizontalScrollbarSize: 6,
    useShadows: false
  }
};

export default function CenterPanel() {
  const { code, setCode, problems } = useCompilerStore();
  const editorRef = useRef(null);
  const monaco = useMonaco();

  function handleEditorDidMount(editor) {
    editorRef.current = editor;
  }

  // Handle diagnostic compilation underlines
  useEffect(() => {
    if (monaco && editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        const markers = problems.map(p => ({
          severity: p.severity === 'error' ? monaco.MarkerSeverity.Error : monaco.MarkerSeverity.Warning,
          startLineNumber: p.line || 1,
          startColumn: 1,
          endLineNumber: p.line || 1,
          endColumn: 120,
          message: p.message,
        }));
        monaco.editor.setModelMarkers(model, 'compiler', markers);
      }
    }
  }, [problems, monaco]);

  return (
    <div className="w-full h-full flex flex-col bg-bg-secondary select-none overflow-hidden">
      <div className="px-3 py-2 text-xs text-slate-400 border-b border-bg-border bg-bg-secondary font-semibold shrink-0">
        Active Source Code Workspace
      </div>
      
      <div className="flex-1 min-h-0 relative overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="c"
          value={code}
          onChange={(val) => setCode(val ?? '')}
          onMount={handleEditorDidMount}
          options={MONACO_OPTIONS}
          theme="vs-dark"
        />
      </div>

      {/* Problems Panel Drawer */}
      <ProblemsPanel />
    </div>
  );
}
