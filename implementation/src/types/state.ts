import { CodebaseGraphResponse, GraphNode } from './graph';
import { ExecutionFlowTrace } from './execution';
import { AuditReportResponse } from './audit';

export type SidebarTab = 'guide-me' | 'flows' | 'audit';

export interface AppState {
  // Config & API Key
  apiKey: string;
  setApiKey: (key: string) => void;
  
  // Active Repository & Graph
  activeRepoId: string;
  graphData: CodebaseGraphResponse | null;
  activeNodeId: string | null;
  
  // Execution Traces
  flows: ExecutionFlowTrace[];
  activeFlowId: string | null;
  currentStepIndex: number;
  
  // Guide Me & Visited Progress State (Persisted)
  isGuideMeMode: boolean;
  visitedNodeIds: string[];
  completedStepNumbers: number[];
  
  // Audit Data
  auditReport: AuditReportResponse | null;
  
  // UI Panels & Modals
  activeSidebarTab: SidebarTab;
  isApiKeyModalOpen: boolean;
  isCodeModalOpen: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Code Editor State
  activeCodeFile: string;
  activeCodeContent: string;
  
  // Actions
  setGraphData: (data: CodebaseGraphResponse) => void;
  setActiveNodeId: (nodeId: string | null) => void;
  setActiveFlowId: (flowId: string) => void;
  setCurrentStepIndex: (index: number) => void;
  toggleGuideMeMode: () => void;
  markNodeVisited: (nodeId: string) => void;
  markStepCompleted: (stepNumber: number) => void;
  resetProgress: () => void;
  setActiveSidebarTab: (tab: SidebarTab) => void;
  setApiKeyModalOpen: (open: boolean) => void;
  setCodeModalOpen: (open: boolean) => void;
  loadRepositoryPreset: (repoId: string) => void;
  setActiveCode: (filePath: string, content: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}
