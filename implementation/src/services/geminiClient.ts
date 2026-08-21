import { GoogleGenAI } from '@google/genai';
import { 
  GRAPH_SYSTEM_PROMPT, 
  graphResponseSchema,
  FLOW_SYSTEM_PROMPT,
  flowResponseSchema,
  AUDIT_SYSTEM_PROMPT,
  auditResponseSchema
} from './prompts';
import { CodebaseGraphResponse } from '../types/graph';
import { ExecutionFlowTrace } from '../types/execution';
import { AuditReportResponse } from '../types/audit';

export class GeminiService {
  private ai: GoogleGenAI | null = null;

  constructor(apiKey?: string) {
    if (apiKey) {
      this.ai = new GoogleGenAI({ apiKey });
    }
  }

  public setApiKey(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  public isConfigured(): boolean {
    return this.ai !== null;
  }

  public async generateCodebaseGraph(codeContent: string, fileName: string): Promise<CodebaseGraphResponse> {
    if (!this.ai) {
      throw new Error("Gemini API key is not configured. Please set your API key in the header.");
    }

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `Analyze file "${fileName}" and construct the full graph:\n\n${codeContent}` }] }
        ],
        config: {
          systemInstruction: GRAPH_SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          responseSchema: graphResponseSchema,
          temperature: 0.2
        }
      });

      const text = response.text;
      if (!text) throw new Error("Empty response received from Gemini API.");
      return JSON.parse(text) as CodebaseGraphResponse;
    } catch (err: any) {
      console.error("Gemini Graph Generation Error:", err);
      throw new Error(`Failed to generate codebase graph: ${err.message || err}`);
    }
  }

  public async generateExecutionFlow(graph: CodebaseGraphResponse, entryNodeId: string): Promise<ExecutionFlowTrace> {
    if (!this.ai) {
      throw new Error("Gemini API key is not configured.");
    }

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { 
            role: 'user', 
            parts: [{ text: `Codebase Graph Context:\n${JSON.stringify(graph)}\n\nTrace execution pathway starting at node: "${entryNodeId}".` }] 
          }
        ],
        config: {
          systemInstruction: FLOW_SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          responseSchema: flowResponseSchema,
          temperature: 0.2
        }
      });

      const text = response.text;
      if (!text) throw new Error("Empty response received from Gemini API.");
      return JSON.parse(text) as ExecutionFlowTrace;
    } catch (err: any) {
      console.error("Gemini Flow Trace Error:", err);
      throw new Error(`Failed to trace execution flow: ${err.message || err}`);
    }
  }

  public async generateAuditReport(graph: CodebaseGraphResponse, codeContent: string): Promise<AuditReportResponse> {
    if (!this.ai) {
      throw new Error("Gemini API key is not configured.");
    }

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { 
            role: 'user', 
            parts: [{ text: `Codebase Graph:\n${JSON.stringify(graph)}\n\nSource Code:\n${codeContent}` }] 
          }
        ],
        config: {
          systemInstruction: AUDIT_SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          responseSchema: auditResponseSchema,
          temperature: 0.2
        }
      });

      const text = response.text;
      if (!text) throw new Error("Empty response received from Gemini API.");
      return JSON.parse(text) as AuditReportResponse;
    } catch (err: any) {
      console.error("Gemini Audit Error:", err);
      throw new Error(`Failed to generate audit report: ${err.message || err}`);
    }
  }
}
