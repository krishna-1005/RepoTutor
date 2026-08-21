export type AuditCategory = 'security' | 'performance' | 'maintainability';
export type AuditSeverity = 'info' | 'low' | 'medium' | 'high' | 'critical';

export interface AuditItem {
  id: string;
  targetNodeId: string;
  category: AuditCategory;
  severity: AuditSeverity;
  title: string;
  description: string;
  recommendation: string;
  codeSnippetRef?: string;
}

export interface AuditReportResponse {
  summary: string;
  overallScore: number;
  items: AuditItem[];
}
