import React, { useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Box, 
  Code, 
  Globe, 
  Wrench,
  ShieldAlert,
  Check
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { NodeType } from '../../types/graph';

export const GraphCanvas: React.FC = () => {
  const { 
    graphData, 
    activeNodeId, 
    setActiveNodeId, 
    visitedNodeIds,
    auditReport 
  } = useAppStore();

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  if (!graphData || !graphData.nodes.length) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-muted)',
        flexDirection: 'column',
        gap: '14px',
        background: 'var(--bg-primary)'
      }}>
        <Box size={44} color="var(--accent-primary)" />
        <p style={{ fontSize: '14px', fontWeight: 600 }}>No codebase graph loaded.</p>
      </div>
    );
  }

  // Calculate 2D Topology Node Layout Coordinates
  const nodesWithPositions = graphData.nodes.map((node, idx) => {
    const colWidth = 240;
    const rowHeight = 160;
    const cols = 3;
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const x = 140 + col * colWidth + (row % 2 === 1 ? 40 : 0);
    const y = 100 + row * rowHeight;
    return { ...node, x, y };
  });

  const nodeMap = new Map(nodesWithPositions.map(n => [n.id, n]));

  // Canvas Pan & Zoom Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target !== e.currentTarget && (e.target as HTMLElement).tagName !== 'svg') return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const getTypeIcon = (type: NodeType) => {
    switch (type) {
      case 'endpoint': return <Globe size={13} color="#06b6d4" />;
      case 'function': return <Code size={13} color="#818cf8" />;
      case 'class': return <Box size={13} color="#c084fc" />;
      case 'utility': return <Wrench size={13} color="#fbbf24" />;
      default: return <Code size={13} color="#9ca3af" />;
    }
  };

  const getTypeBadgeStyle = (type: NodeType) => {
    switch (type) {
      case 'endpoint': return { bg: 'rgba(6, 182, 212, 0.15)', text: '#06b6d4', border: 'rgba(6, 182, 212, 0.35)' };
      case 'function': return { bg: 'rgba(99, 102, 241, 0.15)', text: '#818cf8', border: 'rgba(99, 102, 241, 0.35)' };
      case 'class': return { bg: 'rgba(168, 85, 247, 0.15)', text: '#c084fc', border: 'rgba(168, 85, 247, 0.35)' };
      case 'utility': return { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.35)' };
      default: return { bg: 'rgba(148, 163, 184, 0.15)', text: '#94a3b8', border: 'rgba(148, 163, 184, 0.35)' };
    }
  };

  return (
    <div 
      className="canvas-grid"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{
        flex: 1,
        position: 'relative',
        background: 'radial-gradient(circle at 50% 50%, #0d111a 0%, #07090e 100%)',
        overflow: 'hidden',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none'
      }}
    >
      {/* Topology Header Info Overlay */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: 'rgba(13, 17, 26, 0.85)',
        backdropFilter: 'blur(16px)',
        padding: '8px 16px',
        borderRadius: '12px',
        border: '1px solid var(--border-subtle)',
        zIndex: 50
      }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>
          {graphData.repositoryName}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {graphData.nodes.length} Components • {graphData.edges.length} Call Flows
        </div>
      </div>

      {/* Floating Canvas Controls */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        display: 'flex',
        gap: '6px',
        background: 'rgba(13, 17, 26, 0.85)',
        backdropFilter: 'blur(16px)',
        padding: '6px',
        borderRadius: '12px',
        border: '1px solid var(--border-medium)',
        zIndex: 50,
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
      }}>
        <button 
          onClick={() => setZoom(z => Math.min(z + 0.15, 2))}
          style={{ background: 'none', border: 'none', color: '#fff', padding: '6px', cursor: 'pointer' }}
          title="Zoom In"
        >
          <ZoomIn size={16} />
        </button>
        <button 
          onClick={() => setZoom(z => Math.max(z - 0.15, 0.5))}
          style={{ background: 'none', border: 'none', color: '#fff', padding: '6px', cursor: 'pointer' }}
          title="Zoom Out"
        >
          <ZoomOut size={16} />
        </button>
        <button 
          onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
          style={{ background: 'none', border: 'none', color: '#fff', padding: '6px', cursor: 'pointer' }}
          title="Reset View"
        >
          <Maximize2 size={16} />
        </button>
      </div>

      {/* Main SVG Render Layer */}
      <svg 
        style={{
          width: '100%',
          height: '100%',
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
          transition: isDragging ? 'none' : 'transform 0.1s ease-out'
        }}
      >
        <defs>
          <marker 
            id="arrowhead-glow" 
            markerWidth="12" 
            markerHeight="8" 
            refX="10" 
            refY="4" 
            orient="auto"
          >
            <polygon points="0 0, 12 4, 0 8" fill="#6366f1" />
          </marker>
        </defs>

        {/* Render Sleek Curved Call Flow Edges */}
        {graphData.edges.map(edge => {
          const sourceNode = nodeMap.get(edge.source);
          const targetNode = nodeMap.get(edge.target);
          if (!sourceNode || !targetNode) return null;

          const startX = (sourceNode.x || 0) + 100;
          const startY = (sourceNode.y || 0) + 35;
          const endX = (targetNode.x || 0) + 100;
          const endY = (targetNode.y || 0) + 35;

          // Bezier control curves
          const dx = endX - startX;
          const dy = endY - startY;
          const cx1 = startX + dx * 0.5;
          const cy1 = startY;
          const cx2 = startX + dx * 0.5;
          const cy2 = endY;

          const midX = (startX + endX) / 2;
          const midY = (startY + endY) / 2;

          const pathD = `M ${startX} ${startY} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${endX} ${endY}`;

          return (
            <g key={edge.id}>
              <path
                d={pathD}
                fill="none"
                stroke="rgba(99, 102, 241, 0.45)"
                strokeWidth="2.5"
                strokeDasharray={edge.type === 'async' ? '6,6' : 'none'}
                markerEnd="url(#arrowhead-glow)"
                className="graph-edge-path"
              />
              <rect
                x={midX - 50}
                y={midY - 11}
                width="100"
                height="22"
                rx="6"
                fill="rgba(13, 17, 26, 0.95)"
                stroke="rgba(99, 102, 241, 0.3)"
              />
              <text
                x={midX}
                y={midY + 4}
                fill="#a5b4fc"
                fontSize="10"
                textAnchor="middle"
                fontWeight="600"
                fontFamily="var(--font-sans)"
              >
                {edge.label.length > 16 ? edge.label.substring(0, 16) + '...' : edge.label}
              </text>
            </g>
          );
        })}

        {/* Render Senior Developer Topology Node Cards */}
        {nodesWithPositions.map(node => {
          const isActive = node.id === activeNodeId;
          const isVisited = visitedNodeIds.includes(node.id);
          const badge = getTypeBadgeStyle(node.type);
          const hasAuditIssue = auditReport?.items.some(i => i.targetNodeId === node.id);

          return (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              onClick={(e) => {
                e.stopPropagation();
                setActiveNodeId(node.id);
              }}
              style={{ cursor: 'pointer' }}
            >
              {/* Card Container Shell */}
              <rect
                width="200"
                height="70"
                rx="14"
                fill={isActive ? 'rgba(20, 27, 45, 0.95)' : 'rgba(13, 17, 26, 0.88)'}
                stroke={isActive ? '#6366f1' : isVisited ? 'rgba(16, 185, 129, 0.6)' : 'rgba(255, 255, 255, 0.12)'}
                strokeWidth={isActive ? '2.5' : '1.5'}
                filter={isActive ? 'drop-shadow(0 0 20px rgba(99, 102, 241, 0.6))' : 'drop-shadow(0 4px 15px rgba(0,0,0,0.4))'}
              />

              {/* Visited Checkmark Tick Badge (User Requirement) */}
              {isVisited && (
                <g transform="translate(182, -8)">
                  <circle r="11" fill="#10b981" />
                  <path d="M-4 -1 L-1 3 L4 -3" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                </g>
              )}

              {/* Security Vulnerability Alert Badge */}
              {hasAuditIssue && (
                <g transform="translate(-6, -6)">
                  <circle r="11" fill="#ef4444" />
                  <text x="0" y="4" fill="#fff" fontSize="11" fontWeight="bold" textAnchor="middle">!</text>
                </g>
              )}

              {/* Card Body */}
              <foreignObject x="12" y="10" width="176" height="52">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {/* Top Row: Type Pill + Line Numbers */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{
                      background: badge.bg,
                      color: badge.text,
                      border: `1px solid ${badge.border}`,
                      fontSize: '9px',
                      padding: '2px 7px',
                      borderRadius: '5px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      letterSpacing: '0.04em'
                    }}>
                      {getTypeIcon(node.type)}
                      {node.type}
                    </span>
                    
                    <span style={{ fontSize: '10px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                      L{node.startLine}-L{node.endLine}
                    </span>
                  </div>

                  {/* Node Label Title */}
                  <div style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: isActive ? '#ffffff' : '#f1f5f9',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontFamily: 'var(--font-heading)'
                  }}>
                    {node.label}
                  </div>
                </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
