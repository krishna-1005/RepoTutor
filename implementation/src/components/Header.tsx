import React from 'react';
import { 
  Sparkles, 
  Key, 
  Code2, 
  Compass, 
  RotateCcw, 
  CheckCircle2, 
  Layers,
  Activity,
  Cpu
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { PRESET_REPOSITORIES } from '../services/mockData';

export const Header: React.FC = () => {
  const { 
    apiKey, 
    activeRepoId, 
    loadRepositoryPreset, 
    isGuideMeMode, 
    toggleGuideMeMode,
    visitedNodeIds,
    graphData,
    resetProgress,
    setApiKeyModalOpen,
    setCodeModalOpen
  } = useAppStore();

  const totalNodes = graphData?.nodes.length || 0;
  const visitedCount = visitedNodeIds.length;
  const progressPercent = totalNodes > 0 ? Math.round((visitedCount / totalNodes) * 100) : 0;

  return (
    <header style={{
      height: '64px',
      background: 'rgba(7, 9, 14, 0.92)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      zIndex: 100,
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.4)'
    }}>
      {/* Brand & Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <Compass size={22} color="#fff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '19px', fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.03em' }}>
              RepoTutor
            </h1>
            <span style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(6, 182, 212, 0.25))',
              color: '#a5b4fc',
              fontSize: '11px',
              padding: '2px 9px',
              borderRadius: '20px',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Cpu size={11} color="#38bdf8" /> Gemini 2.5 Flash
            </span>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>
            Interactive Codebase Visualizer & Semantic Flow Tracer
          </span>
        </div>
      </div>

      {/* Preset Repository Picker & Code Input */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          background: 'rgba(20, 27, 45, 0.8)', 
          padding: '5px 12px', 
          borderRadius: '10px', 
          border: '1px solid var(--border-medium)',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)'
        }}>
          <Layers size={15} color="var(--accent-secondary)" />
          <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>
            Preset:
          </span>
          <select 
            value={activeRepoId}
            onChange={(e) => loadRepositoryPreset(e.target.value)}
            style={{
              background: 'transparent',
              color: 'var(--text-main)',
              border: 'none',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none',
              fontFamily: 'var(--font-sans)'
            }}
          >
            {PRESET_REPOSITORIES.map(repo => (
              <option key={repo.id} value={repo.id} style={{ background: '#0d111a', color: '#fff' }}>
                {repo.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setCodeModalOpen(true)}
          className="glass-button"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '7px 14px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <Code2 size={15} color="var(--accent-secondary)" />
          Parse Custom Code
        </button>
      </div>

      {/* Mode Controls, Visited Stats & API Key */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Visited Progress Tracker */}
        <div 
          title="Visited nodes tracking synced with localStorage"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            padding: '5px 14px',
            borderRadius: '20px',
            boxShadow: '0 0 15px rgba(16, 185, 129, 0.15)'
          }}
        >
          <CheckCircle2 size={15} color="var(--accent-success)" />
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-success)' }}>
            Visited {visitedCount}/{totalNodes} ({progressPercent}%)
          </span>
          <button
            onClick={resetProgress}
            title="Reset Visited Progress"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: 0,
              marginLeft: '4px',
              transition: 'transform 0.2s'
            }}
          >
            <RotateCcw size={13} />
          </button>
        </div>

        {/* Guide Me Mode Toggle */}
        <button
          onClick={toggleGuideMeMode}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            background: isGuideMeMode ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'rgba(255, 255, 255, 0.05)',
            color: '#fff',
            border: isGuideMeMode ? 'none' : '1px solid var(--border-medium)',
            padding: '7px 16px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: isGuideMeMode ? '0 0 20px rgba(99, 102, 241, 0.5)' : 'none',
            transition: 'all 0.2s'
          }}
        >
          <Sparkles size={15} />
          {isGuideMeMode ? 'Guide Me: Active' : 'Guide Me: Off'}
        </button>

        {/* API Key Status Pill */}
        <button
          onClick={() => setApiKeyModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            background: apiKey ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: apiKey ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)',
            color: apiKey ? 'var(--accent-success)' : '#f87171',
            padding: '7px 14px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <Key size={14} />
          {apiKey ? 'API Key Active' : 'Set Gemini Key'}
        </button>
      </div>
    </header>
  );
};
