export interface ExecutionStep {
  stepNumber: number;
  nodeId: string;
  title: string;
  explanation: string;
  codeSnippet: string;
  inputParams?: Record<string, string>;
  outputReturn?: string;
  sidebarNote?: string;
}

export interface ExecutionFlowTrace {
  flowId: string;
  title: string;
  description: string;
  steps: ExecutionStep[];
}
