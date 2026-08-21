# RepoTutor: Architectural & Implementation Plan

## 1. Tech Stack & Dependencies

- **Frontend Core**: React 18+ with TypeScript (Vite bundler)
- **AI SDK**: `@google/genai` (Gemini 2.5 Flash with `responseSchema` structured JSON)
- **Icons & Visuals**: `lucide-react`
- **State Management & Persistence**: `zustand` with `localStorage` state sync
- **Styling**: Vanilla CSS / Scoped CSS modules (`globals.css`) with HSL dark mode, glassmorphism UI tokens, glowing node highlights, checkmark animations, and responsive flex/grid layouts.

---

## 2. Enforced Structured JSON Data Contracts

RepoTutor leverages Gemini 2.5 Flash with strict `responseSchema` definitions to guarantee structured JSON outputs across topology extraction, execution flow tracing, and quality audits:

```typescript
// 1. Core Architecture & Topology Nodes
export type NodeType = 'function' | 'class' | 'module' | 'endpoint' | 'utility';

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  filePath: string;
  startLine: number;
  endLine: number;
  description: string;
  complexity: 'low' | 'medium' | 'high';
  tags: string[];
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string; // e.g. "invokes", "imports", "publishes event"
  type: 'sync' | 'async' | 'event' | 'dependency';
}

export interface CodebaseTopologyResponse {
  summary: string;
  architectureType: string; // e.g. "Microservices", "REST API Controller", "Event Bus Pipeline"
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// 2. Execution Flow Step Trace
export interface ExecutionStep {
  step: number;
  fromNodeId: string;
  toNodeId: string;
  action: string;
  explanation: string;
  codeRef: string; // Relevant line snippet reference
  sidebarNote?: string;
}

export interface ExecutionFlowTrace {
  flowId: string;
  title: string;
  description: string;
  executionFlow: ExecutionStep[];
}

// 3. Security & Performance Audit Report
export interface AuditItem {
  id: string;
  targetNodeId: string;
  category: 'security' | 'performance' | 'maintainability';
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  recommendation: string;
  codeSnippetRef?: string;
}

export interface AuditReportResponse {
  summary: string;
  performanceScore: number; // 0 - 100 overall score
  bottlenecks: string[];
  securityFlags: AuditItem[];
}
```

---

## 3. Frontend Architecture & Dashboard Layout

Single-page dashboard layout organized for maximum developer productivity:

```
+---------------------------------------------------------------------------------------------------------+
| HEADER: App Logo | Preset Repo Selector | Parse Code | Guide Me Mode Toggle | Visited Counter | API Key  |
+-------------------------------------------------------------------+-------------------------------------+
| LEFT / TOP & BOTTOM PANELS                                        | RIGHT SIDEBAR PANEL                 |
|                                                                   |                                     |
| +---------------------------------------------------------------+ | +---------------------------------+ |
| | TOP: Dynamic SVG Topology Graph Canvas                        | | | TABS: Guide Me | Flows | Audit   | |
| | - Interactive nodes, glowing active selection ring            | | +---------------------------------+ |
| | - Visited tick mark badges (✓) synced to localStorage          | | | "GUIDE ME" WALKTHROUGH PANEL:   | |
| | - Zoom / Pan controls                                         | | | - Step-by-step timeline flow    | |
| +---------------------------------------------------------------+ | | - Natural language explanations | |
| | BOTTOM: Code Editor Panel                                     | | | - Sidebar review notes & tips   | |
| | - Line numbers & file tab indicator                           | | | - Step completion checkboxes    | |
| | - Line range highlights synced to active graph node           | | | - Progress percentage bar       | |
| +---------------------------------------------------------------+ | +---------------------------------+ |
+-------------------------------------------------------------------+-------------------------------------+
```

---

## 4. Fallback Strategy & Offline Resilience

To ensure the UI remains 100% interactive even if API calls throttle, network fails, or no API key is provided:
1. **Rich Pre-Loaded Demo Presets**: Includes pre-analyzed repositories (`Authentication & JWT Flow`, `E-Commerce Order Pipeline`) in `mockData.ts`.
2. **Client-Side AST Parser Fallback**: Built `astParser.ts` to extract structural definitions offline when custom code is submitted without an active Gemini API key.
3. **Graceful Error Toast & Retry**: Notifies developers of API throttles without breaking active UI graph states.

---

## 5. Persistent Progress & User Preferences

- **Visited Nodes (`visitedNodeIds`)**: Nodes explored by the developer display a prominent green tick mark badge (`✓`).
- **Guide Me Walkthrough Progress**: Completed steps update progress bar percentage.
- **LocalStorage Sync**: Auto-persists visited nodes, step completions, selected preset, and API keys across browser refreshes.
