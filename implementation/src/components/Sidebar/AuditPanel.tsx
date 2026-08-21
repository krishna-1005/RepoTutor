import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Info, Zap } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { AuditSeverity } from '../../types/audit';

export const AuditPanel: React.FC = () => {
  const { auditReport, setActiveNodeId, graphData } = useAppStore();

  if (!auditReport) {
    return (
      <div style={{ padding: '24px', color: 'var(--text-muted)', textAlign: 'center' }}>
        No audit report generated for this codebase.
      </div>
    );
  }

  const scoreColor = auditReport.overallScore >= 80 ? '#10b981' : auditReport.overallScore >= 60 ? '#f59e0b' : '#ef4444';

  const getSeverityBadge = (severity: AuditSeverity) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return { bg: 'rgba(239, 68, 68, 0.18)', text: '#ef4444', border: 'rgba(239, 68, 68, 0.4)' };
      case 'medium':
        return { bg: 'rgba(245, 158, 11, 0.18)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.4)' };
      default:
        return { bg: 'rgba(6, 182, 212, 0.18)', text: '#06b6d4', border: 'rgba(6, 182, 212, 0.4)' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px', overflowY: 'auto' }}>
      {/* Score Gauge Card */}
      <div className="glass-card" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '18px' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          border: `4px solid ${scoreColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          fontWeight: 800,
          color: '#fff',
          boxShadow: `0 0 20px ${scoreColor}50`,
          background: 'rgba(10, 13, 20, 0.6)',
          flexShrink: 0
        }}>
          {auditReport.overallScore}
        </div>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>
            Security & Quality Index
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.4' }}>
            {auditReport.summary}
          </p>
        </div>
      </div>

      {/* Audit Items List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {auditReport.items.map(item => {
          const badge = getSeverityBadge(item.severity);
          const targetNode = graphData?.nodes.find(n => n.id === item.targetNodeId);

          return (
            <div key={item.id} className="glass-card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{
                  background: badge.bg,
                  color: badge.text,
                  border: `1px solid ${badge.border}`,
                  fontSize: '10px',
                  fontWeight: 800,
                  padding: '3px 9px',
                  borderRadius: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}>
                  {item.severity} • {item.category}
                </span>

                {targetNode && (
                  <button
                    onClick={() => setActiveNodeId(targetNode.id)}
                    style={{
                      background: 'rgba(99, 102, 241, 0.15)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      color: '#a5b4fc',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 9px',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Focus Node →
                  </button>
                )}
              </div>

              <h4 style={{ fontSize: '14px', color: '#fff', marginBottom: '6px' }}>
                {item.title}
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '10px' }}>
                {item.description}
              </p>

              <div style={{
                background: 'rgba(10, 13, 20, 0.8)',
                padding: '10px 12px',
                borderRadius: '8px',
                fontSize: '11px',
                color: 'var(--accent-success)',
                borderLeft: '3px solid var(--accent-success)',
                fontWeight: 500
              }}>
                <strong style={{ color: '#fff' }}>Recommendation:</strong> {item.recommendation}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
