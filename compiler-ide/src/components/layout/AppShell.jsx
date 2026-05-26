import React from 'react';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import TopBar from './TopBar';
import LeftSidebar from './LeftSidebar';
import CenterPanel from '../../features/editor/CenterPanel';
import ASTViewer from '../../features/ast/ASTViewer';
import BottomPanel from '../compiler/BottomPanel';
import TokenPanel from '../compiler/TokenPanel';

export default function AppShell() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden" style={{ background: '#0B1020' }}>
      {/* Top Command Toolbar */}
      <TopBar />

      {/* Main workspace */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <PanelGroup id="main-horizontal-layout-v2" direction="horizontal" className="h-full">

          {/* Left Sidebar */}
          <Panel defaultSize={18} minSize={14} maxSize={28}>
            <LeftSidebar />
          </Panel>

          <PanelResizeHandle />

          {/* Center Column: Editor + Bottom Panel */}
          <Panel defaultSize={52} minSize={30}>
            <PanelGroup id="center-vertical-layout-v2" direction="vertical" className="h-full">
              {/* Bottom Output Tabs */}
              <Panel defaultSize={35} minSize={15} maxSize={45}>
                <BottomPanel />
              </Panel>

              <PanelResizeHandle className="h-1 bg-bg-border hover:bg-accent-purple/50 transition-colors" />

              {/* Monaco Editor */}
              <Panel defaultSize={65} minSize={55}>
                <CenterPanel />
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle />

          {/* Right Column: AST Viewer + Token Panel */}
          <Panel defaultSize={30} minSize={20} maxSize={45}>
            <PanelGroup id="right-vertical-layout-v2" direction="vertical" className="h-full">
              {/* AST Viewer */}
              <Panel defaultSize={60} minSize={30}>
                <ASTViewer />
              </Panel>

              <PanelResizeHandle />

              {/* Token Panel */}
              <Panel defaultSize={40} minSize={20}>
                <TokenPanel />
              </Panel>
            </PanelGroup>
          </Panel>

        </PanelGroup>
      </div>
    </div>
  );
}
