import React from 'react';
import { Header } from './components/Header';
import { GraphCanvas } from './components/Visualizer/GraphCanvas';
import { CodeEditorPanel } from './components/CodeViewer/CodeEditorPanel';
import { SidebarContainer } from './components/Sidebar/SidebarContainer';
import { ApiKeyModal } from './components/Modals/ApiKeyModal';
import { CodeInputModal } from './components/Modals/CodeInputModal';
import { useAppStore } from './store/useAppStore';

export const App: React.FC = () => {
  const { isLoading, error } = useAppStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', background: 'var(--bg-primary)' }}>
      {/* Top Navigation */}
      <Header />

      {/* Main Workspace split into Visualizer/Code and Right Sidebar */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        
        {/* Left Column: Visualizer Canvas + Code Editor Panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
          
          {/* Loading Indicator */}
          {isLoading && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(10, 13, 20, 0.75)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 600,
              zIndex: 80,
              gap: '10px'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: '3px solid #6366f1',
                borderTopColor: 'transparent',
                animation: 'spin 1s linear infinite'
              }} />
              Gemini 2.5 Flash Processing Graph & Execution Flow...
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.2)',
              borderBottom: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#f87171',
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>⚠️ {error}</span>
            </div>
          )}

          {/* Interactive Graph Canvas */}
          <GraphCanvas />

          {/* Side-by-side Code Viewer Panel */}
          <CodeEditorPanel />
        </div>

        {/* Right Sidebar: Guide Me, Flows, Security & Audits */}
        <SidebarContainer />
      </div>

      {/* Modals */}
      <ApiKeyModal />
      <CodeInputModal />
    </div>
  );
};

export default App;
