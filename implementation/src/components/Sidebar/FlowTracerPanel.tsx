import React from 'react';
import { Play, Sparkles, Route } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const FlowTracerPanel: React.FC = () => {
  const { flows, activeFlowId, setActiveFlowId, graphData, activeNodeId } = useAppStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '14px' }}>
      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
        Traced Execution Pathways ({flows.length})
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' }}>
        {flows.map(flow => {
          const isActive = flow.flowId === activeFlowId;
          return (
            <div
              key={flow.flowId}
              onClick={() => setActiveFlowId(flow.flowId)}
              className="glass-card"
              style={{
                padding: '14px',
                cursor: 'pointer',
                border: isActive ? '1px solid #6366f1' : '1px solid var(--border-subtle)',
                background: isActive ? 'rgba(99, 102, 241, 0.12)' : 'rgba(30, 41, 59, 0.4)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Route size={16} color={isActive ? '#818cf8' : 'var(--text-muted)'} />
                  <span style={{ fontSize: '14px', fontWeight: 600, color: isActive ? '#fff' : 'var(--text-main)' }}>
                    {flow.title}
                  </span>
                </div>
                <span style={{
                  fontSize: '10px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  color: 'var(--text-dim)'
                }}>
                  {flow.steps.length} steps
                </span>
              </div>

              <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                {flow.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
