import React from 'react';
import { Sparkles, Route, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { SidebarTab } from '../../types/state';
import { GuideMePanel } from './GuideMePanel';
import { FlowTracerPanel } from './FlowTracerPanel';
import { AuditPanel } from './AuditPanel';

export const SidebarContainer: React.FC = () => {
  const { activeSidebarTab, setActiveSidebarTab, isGuideMeMode, auditReport } = useAppStore();

  const tabs: { id: SidebarTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { 
      id: 'guide-me', 
      label: 'Guide Me', 
      icon: <Sparkles size={15} />, 
      badge: isGuideMeMode ? 'ACTIVE' : undefined 
    },
    { 
      id: 'flows', 
      label: 'Flows', 
      icon: <Route size={15} /> 
    },
    { 
      id: 'audit', 
      label: 'Security & Audit', 
      icon: <ShieldCheck size={15} />,
      badge: auditReport?.items.length ? `${auditReport.items.length}` : undefined
    }
  ];

  return (
    <div style={{
      width: '380px',
      background: 'rgba(12, 16, 26, 0.95)',
      backdropFilter: 'blur(16px)',
      borderLeft: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      zIndex: 90
    }}>
      {/* Top Tab Bar */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(10, 13, 20, 0.6)'
      }}>
        {tabs.map(tab => {
          const isActive = activeSidebarTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSidebarTab(tab.id)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '14px 8px',
                background: isActive ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                border: 'none',
                borderBottom: isActive ? '2px solid #6366f1' : '2px solid transparent',
                color: isActive ? '#fff' : 'var(--text-muted)',
                fontSize: '12px',
                fontWeight: isActive ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {tab.icon}
              {tab.label}
              {tab.badge && (
                <span style={{
                  fontSize: '9px',
                  background: tab.id === 'guide-me' ? '#6366f1' : 'rgba(239, 68, 68, 0.2)',
                  color: tab.id === 'guide-me' ? '#fff' : '#ef4444',
                  padding: '1px 5px',
                  borderRadius: '10px',
                  fontWeight: 700
                }}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panel Content */}
      <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
        {activeSidebarTab === 'guide-me' && <GuideMePanel />}
        {activeSidebarTab === 'flows' && <FlowTracerPanel />}
        {activeSidebarTab === 'audit' && <AuditPanel />}
      </div>
    </div>
  );
};
