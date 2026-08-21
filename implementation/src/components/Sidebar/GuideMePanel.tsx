import React from 'react';
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  BookOpen, 
  FileCode, 
  Info,
  ShieldAlert,
  Target
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const GuideMePanel: React.FC = () => {
  const { 
    flows, 
    activeFlowId, 
    currentStepIndex, 
    setCurrentStepIndex,
    completedStepNumbers,
    markStepCompleted,
    graphData,
    activeNodeId,
    setActiveNodeId,
    auditReport
  } = useAppStore();

  const currentFlow = flows.find(f => f.flowId === activeFlowId) || flows[0];

  if (!currentFlow || !currentFlow.steps.length) {
    return (
      <div style={{ padding: '24px', color: 'var(--text-muted)', textAlign: 'center' }}>
        No execution flows available for this repository.
      </div>
    );
  }

  const totalSteps = currentFlow.steps.length;
  const currentStep = currentFlow.steps[currentStepIndex] || currentFlow.steps[0];
  const targetNode = graphData?.nodes.find(n => n.id === currentStep.nodeId);
  const isCompleted = completedStepNumbers.includes(currentStep.stepNumber);
  const stepProgress = Math.round(((currentStepIndex + 1) / totalSteps) * 100);

  // Check if target node has linked audit vulnerabilities
  const nodeAuditItems = auditReport?.items.filter(i => i.targetNodeId === currentStep.nodeId) || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(6, 182, 212, 0.2))',
        border: '1px solid rgba(99, 102, 241, 0.4)',
        borderRadius: 'var(--radius-md)',
        padding: '16px',
        boxShadow: '0 4px 20px rgba(99, 102, 241, 0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="var(--accent-primary)" />
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>
              Guide Me Walkthrough
            </span>
          </div>
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--accent-secondary)',
            background: 'rgba(6, 182, 212, 0.15)',
            padding: '3px 9px',
            borderRadius: '12px',
            border: '1px solid rgba(6, 182, 212, 0.3)'
          }}>
            Step {currentStepIndex + 1} of {totalSteps}
          </span>
        </div>

        {/* Animated Progress Bar */}
        <div style={{
          height: '7px',
          background: 'rgba(255, 255, 255, 0.12)',
          borderRadius: '4px',
          overflow: 'hidden',
          marginBottom: '8px'
        }}>
          <div style={{
            height: '100%',
            width: `${stepProgress}%`,
            background: 'linear-gradient(90deg, #6366f1, #06b6d4)',
            transition: 'width 0.35s ease-out'
          }} />
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          Trace: <strong style={{ color: '#fff' }}>{currentFlow.title}</strong>
        </div>
      </div>

      {/* Step Navigation Controls */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          disabled={currentStepIndex === 0}
          onClick={() => setCurrentStepIndex(currentStepIndex - 1)}
          className="glass-button"
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            padding: '8px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: currentStepIndex === 0 ? 'not-allowed' : 'pointer',
            opacity: currentStepIndex === 0 ? 0.4 : 1
          }}
        >
          <ChevronLeft size={16} /> Prev
        </button>

        <button
          onClick={() => markStepCompleted(currentStep.stepNumber)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: isCompleted ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.2)',
            border: isCompleted ? '1px solid #10b981' : '1px solid #6366f1',
            color: isCompleted ? '#10b981' : '#a5b4fc',
            padding: '8px 14px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <Check size={14} /> {isCompleted ? 'Done ✓' : 'Mark Done'}
        </button>

        <button
          disabled={currentStepIndex === totalSteps - 1}
          onClick={() => setCurrentStepIndex(currentStepIndex + 1)}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            border: 'none',
            color: '#fff',
            padding: '8px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: currentStepIndex === totalSteps - 1 ? 'not-allowed' : 'pointer',
            opacity: currentStepIndex === totalSteps - 1 ? 0.4 : 1,
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)'
          }}
        >
          Next <ChevronRight size={16} />
        </button>
      </div>

      {/* Step Detail Content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        {/* Step Title & Node Focus Button */}
        <div className="glass-card" style={{ padding: '16px' }}>
          <h3 style={{ fontSize: '15px', color: '#fff', marginBottom: '10px' }}>
            {currentStep.title}
          </h3>

          {targetNode && (
            <button
              onClick={() => setActiveNodeId(targetNode.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(99, 102, 241, 0.18)',
                border: '1px solid rgba(99, 102, 241, 0.4)',
                color: '#a5b4fc',
                padding: '5px 12px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Target size={13} /> Focus Node: {targetNode.label}
            </button>
          )}
        </div>

        {/* Semantic Explanation Card */}
        <div className="glass-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: 'var(--accent-secondary)' }}>
            <BookOpen size={15} />
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Semantic Intent Explanation
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-main)', lineHeight: '1.65' }}>
            {currentStep.explanation}
          </p>
        </div>

        {/* Code Snippet Reference */}
        <div className="glass-card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', fontFamily: 'var(--font-mono)' }}>
            Snippet Reference
          </div>
          <pre style={{
            background: 'rgba(9, 13, 22, 0.9)',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '11px',
            color: '#38bdf8',
            overflowX: 'auto',
            border: '1px solid var(--border-subtle)'
          }}>
            {currentStep.codeSnippet}
          </pre>
        </div>

        {/* Sidebar Review Note */}
        {currentStep.sidebarNote && (
          <div className="glass-card" style={{ padding: '16px', borderLeft: '4px solid var(--accent-warning)', background: 'rgba(245, 158, 11, 0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-warning)', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
              <Info size={15} /> Senior Developer Review Note
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-main)', lineHeight: '1.55' }}>
              {currentStep.sidebarNote}
            </p>
          </div>
        )}

        {/* Linked Audit Vulnerability Warnings */}
        {nodeAuditItems.map(item => (
          <div key={item.id} className="glass-card" style={{ padding: '14px', borderLeft: '4px solid var(--accent-danger)', background: 'rgba(239, 68, 68, 0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-danger)', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
              <ShieldAlert size={15} /> Linked Audit Flag: {item.title}
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-main)', marginBottom: '6px' }}>
              {item.description}
            </p>
            <div style={{ fontSize: '11px', color: 'var(--accent-success)', fontWeight: 600 }}>
              Fix: {item.recommendation}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
