import React from 'react';
import { FileCode, CheckCircle2, Terminal } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const CodeEditorPanel: React.FC = () => {
  const { 
    activeCodeFile, 
    activeCodeContent, 
    graphData, 
    activeNodeId,
    visitedNodeIds 
  } = useAppStore();

  const activeNode = graphData?.nodes.find(n => n.id === activeNodeId);
  const isNodeVisited = activeNodeId ? visitedNodeIds.includes(activeNodeId) : false;

  const lines = activeCodeContent.split('\n');

  return (
    <div style={{
      height: '320px',
      background: '#090d16',
      borderTop: '1px solid var(--border-medium)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Code Reader Header Bar */}
      <div style={{
        height: '40px',
        background: 'rgba(13, 17, 26, 0.95)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FileCode size={15} color="var(--accent-secondary)" />
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>
              {activeCodeFile}
            </span>
          </div>

          {activeNode && (
            <span style={{
              background: 'rgba(99, 102, 241, 0.18)',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              color: '#a5b4fc',
              fontSize: '11px',
              padding: '3px 10px',
              borderRadius: '6px',
              fontWeight: 600,
              fontFamily: 'var(--font-sans)'
            }}>
              Focused: {activeNode.label} (Lines {activeNode.startLine}–{activeNode.endLine})
            </span>
          )}
        </div>

        {isNodeVisited && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            color: 'var(--accent-success)',
            fontSize: '12px',
            fontWeight: 700,
            background: 'rgba(16, 185, 129, 0.1)',
            padding: '2px 10px',
            borderRadius: '12px',
            border: '1px solid rgba(16, 185, 129, 0.3)'
          }}>
            <CheckCircle2 size={13} /> Visited Node
          </div>
        )}
      </div>

      {/* Code Viewer Container */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        fontFamily: 'var(--font-mono)',
        fontSize: '12px',
        lineHeight: '1.65',
        color: '#cbd5e1',
        padding: '10px 0'
      }}>
        {lines.map((lineText, idx) => {
          const lineNum = idx + 1;
          const isHighlighted = activeNode 
            ? (lineNum >= activeNode.startLine && lineNum <= activeNode.endLine)
            : false;

          return (
            <div 
              key={lineNum}
              style={{
                display: 'flex',
                background: isHighlighted ? 'rgba(99, 102, 241, 0.18)' : 'transparent',
                borderLeft: isHighlighted ? '4px solid #6366f1' : '4px solid transparent',
                paddingRight: '20px'
              }}
            >
              {/* Line Number Column */}
              <span style={{
                width: '50px',
                textAlign: 'right',
                paddingRight: '16px',
                color: isHighlighted ? '#a5b4fc' : '#475569',
                userSelect: 'none',
                flexShrink: 0,
                fontWeight: isHighlighted ? 700 : 400
              }}>
                {lineNum}
              </span>

              {/* Code Line String */}
              <span style={{
                whiteSpace: 'pre',
                color: isHighlighted ? '#ffffff' : '#cbd5e1',
                fontWeight: isHighlighted ? 600 : 400
              }}>
                {lineText}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
