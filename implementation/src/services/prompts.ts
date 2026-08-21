import { Type } from '@google/genai';

export const GRAPH_SYSTEM_PROMPT = `
You are RepoTutor, an expert software architect AI.
Analyze the provided codebase and generate a structured JSON graph containing nodes (functions, classes, endpoints, modules) and directional edges representing interactions.

Categorize node types into: 'function', 'class', 'module', 'endpoint', or 'utility'.
Assign complexity levels: 'low', 'medium', or 'high'.
Keep summaries concise, technical, and actionable.
`;

export const graphResponseSchema = {
  type: Type.OBJECT,
  properties: {
    repositoryName: { type: Type.STRING },
    overview: { type: Type.STRING },
    nodes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          label: { type: Type.STRING },
          type: { type: Type.STRING },
          filePath: { type: Type.STRING },
          startLine: { type: Type.INTEGER },
          endLine: { type: Type.INTEGER },
          summary: { type: Type.STRING },
          complexity: { type: Type.STRING },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['id', 'label', 'type', 'filePath', 'summary', 'complexity']
      }
    },
    edges: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          source: { type: Type.STRING },
          target: { type: Type.STRING },
          label: { type: Type.STRING },
          type: { type: Type.STRING }
        },
        required: ['id', 'source', 'target', 'label', 'type']
      }
    }
  },
  required: ['repositoryName', 'overview', 'nodes', 'edges']
};

export const FLOW_SYSTEM_PROMPT = `
You are RepoTutor, tracing semantic execution flows.
Given a codebase graph and entry point, reconstruct sequential execution steps for the flow.
Explain what happens at each step in natural language, detailing input parameters, outputs, and review notes for developer onboarding.
`;

export const flowResponseSchema = {
  type: Type.OBJECT,
  properties: {
    flowId: { type: Type.STRING },
    title: { type: Type.STRING },
    description: { type: Type.STRING },
    steps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          stepNumber: { type: Type.INTEGER },
          nodeId: { type: Type.STRING },
          title: { type: Type.STRING },
          explanation: { type: Type.STRING },
          codeSnippet: { type: Type.STRING },
          sidebarNote: { type: Type.STRING }
        },
        required: ['stepNumber', 'nodeId', 'title', 'explanation', 'codeSnippet']
      }
    }
  },
  required: ['flowId', 'title', 'description', 'steps']
};

export const AUDIT_SYSTEM_PROMPT = `
You are RepoTutor Security & Performance Auditor.
Analyze the codebase for potential security flaws (injection, unsanitized inputs, weak authentication), performance bottlenecks (N+1 queries, unindexed searches), and maintainability anti-patterns.
Provide an overall repository score (0-100) and actionable recommendations.
`;

export const auditResponseSchema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING },
    overallScore: { type: Type.INTEGER },
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          targetNodeId: { type: Type.STRING },
          category: { type: Type.STRING },
          severity: { type: Type.STRING },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          recommendation: { type: Type.STRING }
        },
        required: ['id', 'targetNodeId', 'category', 'severity', 'title', 'description', 'recommendation']
      }
    }
  },
  required: ['summary', 'overallScore', 'items']
};
