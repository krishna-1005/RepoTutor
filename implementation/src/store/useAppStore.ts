import { create } from 'zustand';
import { AppState, SidebarTab } from '../types/state';
import { PRESET_REPOSITORIES } from '../services/mockData';
import { GeminiService } from '../services/geminiClient';
import { parseSourceCode } from '../services/astParser';

const LOCAL_STORAGE_KEY = 'repotutor_app_state_v1';

const geminiService = new GeminiService();

function loadSavedState() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn("Failed to load state from localStorage:", e);
  }
  return null;
}

function saveState(statePartial: Partial<AppState>) {
  try {
    const saved = loadSavedState() || {};
    const updated = {
      ...saved,
      apiKey: statePartial.apiKey !== undefined ? statePartial.apiKey : saved.apiKey,
      activeRepoId: statePartial.activeRepoId !== undefined ? statePartial.activeRepoId : saved.activeRepoId,
      visitedNodeIds: statePartial.visitedNodeIds !== undefined ? statePartial.visitedNodeIds : saved.visitedNodeIds,
      completedStepNumbers: statePartial.completedStepNumbers !== undefined ? statePartial.completedStepNumbers : saved.completedStepNumbers,
      isGuideMeMode: statePartial.isGuideMeMode !== undefined ? statePartial.isGuideMeMode : saved.isGuideMeMode,
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn("Failed to save state to localStorage:", e);
  }
}

const saved = loadSavedState() || {};
const initialPreset = PRESET_REPOSITORIES.find(r => r.id === (saved.activeRepoId || 'auth-flow')) || PRESET_REPOSITORIES[0];

export const useAppStore = create<AppState>((set, get) => {
  if (saved.apiKey) {
    geminiService.setApiKey(saved.apiKey);
  }

  return {
    apiKey: saved.apiKey || '',
    activeRepoId: initialPreset.id,
    graphData: initialPreset.graph,
    activeNodeId: initialPreset.graph.nodes[0]?.id || null,
    
    flows: initialPreset.flows,
    activeFlowId: initialPreset.flows[0]?.flowId || null,
    currentStepIndex: 0,
    
    isGuideMeMode: saved.isGuideMeMode !== undefined ? saved.isGuideMeMode : true,
    visitedNodeIds: Array.isArray(saved.visitedNodeIds) ? saved.visitedNodeIds : [initialPreset.graph.nodes[0]?.id || ''],
    completedStepNumbers: Array.isArray(saved.completedStepNumbers) ? saved.completedStepNumbers : [1],
    
    auditReport: initialPreset.audit,
    
    activeSidebarTab: 'guide-me',
    isApiKeyModalOpen: false,
    isCodeModalOpen: false,
    isLoading: false,
    error: null,
    
    activeCodeFile: initialPreset.fileName,
    activeCodeContent: initialPreset.codeContent,

    setApiKey: (key: string) => {
      geminiService.setApiKey(key);
      set({ apiKey: key });
      saveState({ apiKey: key });
    },

    setGraphData: (data) => {
      const firstNodeId = data.nodes[0]?.id || null;
      set({ 
        graphData: data, 
        activeNodeId: firstNodeId,
        visitedNodeIds: firstNodeId ? [firstNodeId] : []
      });
    },

    setActiveNodeId: (nodeId) => {
      if (!nodeId) return;
      const { visitedNodeIds, graphData } = get();
      const updatedVisited = visitedNodeIds.includes(nodeId)
        ? visitedNodeIds
        : [...visitedNodeIds, nodeId];

      const targetNode = graphData?.nodes.find(n => n.id === nodeId);
      set({ 
        activeNodeId: nodeId,
        visitedNodeIds: updatedVisited
      });

      saveState({ visitedNodeIds: updatedVisited });

      // If active flow contains this step, update step index
      const { flows, activeFlowId } = get();
      const currentFlow = flows.find(f => f.flowId === activeFlowId);
      if (currentFlow) {
        const stepIdx = currentFlow.steps.findIndex(s => s.nodeId === nodeId);
        if (stepIdx !== -1) {
          set({ currentStepIndex: stepIdx });
        }
      }
    },

    setActiveFlowId: (flowId) => {
      const { flows } = get();
      const targetFlow = flows.find(f => f.flowId === flowId);
      if (targetFlow && targetFlow.steps.length > 0) {
        const firstStepNodeId = targetFlow.steps[0].nodeId;
        get().setActiveNodeId(firstStepNodeId);
      }
      set({ activeFlowId: flowId, currentStepIndex: 0 });
    },

    setCurrentStepIndex: (index) => {
      const { flows, activeFlowId, completedStepNumbers } = get();
      const currentFlow = flows.find(f => f.flowId === activeFlowId);
      if (!currentFlow || index < 0 || index >= currentFlow.steps.length) return;

      const step = currentFlow.steps[index];
      const updatedCompleted = completedStepNumbers.includes(step.stepNumber)
        ? completedStepNumbers
        : [...completedStepNumbers, step.stepNumber];

      set({ currentStepIndex: index });
      get().setActiveNodeId(step.nodeId);
      
      set({ completedStepNumbers: updatedCompleted });
      saveState({ completedStepNumbers: updatedCompleted });
    },

    toggleGuideMeMode: () => {
      const newMode = !get().isGuideMeMode;
      set({ isGuideMeMode: newMode });
      saveState({ isGuideMeMode: newMode });
    },

    markNodeVisited: (nodeId) => {
      const { visitedNodeIds } = get();
      if (!visitedNodeIds.includes(nodeId)) {
        const updated = [...visitedNodeIds, nodeId];
        set({ visitedNodeIds: updated });
        saveState({ visitedNodeIds: updated });
      }
    },

    markStepCompleted: (stepNumber) => {
      const { completedStepNumbers } = get();
      if (!completedStepNumbers.includes(stepNumber)) {
        const updated = [...completedStepNumbers, stepNumber];
        set({ completedStepNumbers: updated });
        saveState({ completedStepNumbers: updated });
      }
    },

    resetProgress: () => {
      const { graphData } = get();
      const firstNodeId = graphData?.nodes[0]?.id || '';
      const updatedVisited = firstNodeId ? [firstNodeId] : [];
      set({
        visitedNodeIds: updatedVisited,
        completedStepNumbers: [1],
        currentStepIndex: 0
      });
      saveState({
        visitedNodeIds: updatedVisited,
        completedStepNumbers: [1]
      });
    },

    setActiveSidebarTab: (tab: SidebarTab) => set({ activeSidebarTab: tab }),
    setApiKeyModalOpen: (open: boolean) => set({ isApiKeyModalOpen: open }),
    setCodeModalOpen: (open: boolean) => set({ isCodeModalOpen: open }),
    
    setActiveCode: (filePath: string, content: string) => {
      set({ activeCodeFile: filePath, activeCodeContent: content });
    },

    setLoading: (loading: boolean) => set({ isLoading: loading }),
    setError: (error: string | null) => set({ error: error }),

    loadRepositoryPreset: (repoId: string) => {
      const preset = PRESET_REPOSITORIES.find(r => r.id === repoId);
      if (!preset) return;

      const firstNodeId = preset.graph.nodes[0]?.id || null;

      set({
        activeRepoId: preset.id,
        graphData: preset.graph,
        flows: preset.flows,
        activeFlowId: preset.flows[0]?.flowId || null,
        auditReport: preset.audit,
        activeCodeFile: preset.fileName,
        activeCodeContent: preset.codeContent,
        activeNodeId: firstNodeId,
        visitedNodeIds: firstNodeId ? [firstNodeId] : [],
        completedStepNumbers: [1],
        currentStepIndex: 0,
        error: null
      });

      saveState({
        activeRepoId: preset.id,
        visitedNodeIds: firstNodeId ? [firstNodeId] : [],
        completedStepNumbers: [1]
      });
    }
  };
});
