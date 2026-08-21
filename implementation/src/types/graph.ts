export type NodeType = 'function' | 'class' | 'module' | 'endpoint' | 'utility';
export type ComplexityLevel = 'low' | 'medium' | 'high';
export type EdgeType = 'sync' | 'async' | 'event' | 'dependency';

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  filePath: string;
  startLine: number;
  endLine: number;
  summary: string;
  complexity: ComplexityLevel;
  tags: string[];
  x?: number;
  y?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  type: EdgeType;
}

export interface CodebaseGraphResponse {
  repositoryName: string;
  overview: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
}
