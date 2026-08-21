import { GraphNode, GraphEdge, CodebaseGraphResponse } from '../types/graph';

export interface ParseResult {
  nodes: GraphNode[];
  edges: GraphEdge[];
  overview: string;
}

export function parseSourceCode(code: string, fileName: string): ParseResult {
  const lines = code.split('\n');
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  // Match function declarations, arrow functions, classes, imports, and exports
  const funcRegex = /(?:export\s+)?(?:async\s+)?function\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)/g;
  const constFuncRegex = /(?:export\s+)?const\s+([a-zA-Z0-9_]+)\s*=\s*(?:async\s*)?\(([^)]*)\)\s*=>/g;
  const classRegex = /(?:export\s+)?class\s+([a-zA-Z0-9_]+)(?:\s+extends\s+([a-zA-Z0-9_]+))?/g;
  const endpointRegex = /(app|router)\.(get|post|put|delete|patch)\(['"]([^'"]+)['"],\s*(?:async\s*)?\(([^)]*)\)/g;

  let match: RegExpExecArray | null;

  // 1. Parse Functions
  while ((match = funcRegex.exec(code)) !== null) {
    const funcName = match[1];
    const params = match[2];
    const lineNum = code.substring(0, match.index).split('\n').length;
    nodes.push({
      id: `node-${funcName}`,
      label: `${funcName}(${params.slice(0, 20)}${params.length > 20 ? '...' : ''})`,
      type: 'function',
      filePath: fileName,
      startLine: lineNum,
      endLine: lineNum + 15,
      summary: `Function '${funcName}' taking parameters (${params}).`,
      complexity: params.split(',').length > 3 ? 'high' : 'medium',
      tags: ['function', 'async']
    });
  }

  // 2. Parse Const Arrow Functions
  while ((match = constFuncRegex.exec(code)) !== null) {
    const funcName = match[1];
    const params = match[2];
    const lineNum = code.substring(0, match.index).split('\n').length;
    nodes.push({
      id: `node-${funcName}`,
      label: `${funcName} = (${params.slice(0, 15)}...)`,
      type: 'function',
      filePath: fileName,
      startLine: lineNum,
      endLine: lineNum + 12,
      summary: `Arrow function '${funcName}' utility handler.`,
      complexity: 'low',
      tags: ['arrow-function']
    });
  }

  // 3. Parse Classes
  while ((match = classRegex.exec(code)) !== null) {
    const className = match[1];
    const parentClass = match[2];
    const lineNum = code.substring(0, match.index).split('\n').length;
    nodes.push({
      id: `node-${className}`,
      label: `class ${className}`,
      type: 'class',
      filePath: fileName,
      startLine: lineNum,
      endLine: lineNum + 40,
      summary: `Class definition for ${className}${parentClass ? ` extending ${parentClass}` : ''}.`,
      complexity: 'high',
      tags: ['class', parentClass ? 'inheritance' : 'standalone']
    });
  }

  // 4. Parse API Endpoints
  while ((match = endpointRegex.exec(code)) !== null) {
    const method = match[2].toUpperCase();
    const route = match[3];
    const lineNum = code.substring(0, match.index).split('\n').length;
    nodes.push({
      id: `endpoint-${method}-${route.replace(/[^a-zA-Z0-9]/g, '-')}`,
      label: `${method} ${route}`,
      type: 'endpoint',
      filePath: fileName,
      startLine: lineNum,
      endLine: lineNum + 20,
      summary: `HTTP API Endpoint handling ${method} requests on '${route}'.`,
      complexity: 'medium',
      tags: ['api', 'route', method.toLowerCase()]
    });
  }

  // If no nodes found, create fallback file module node
  if (nodes.length === 0) {
    nodes.push({
      id: `module-${fileName.replace(/[^a-zA-Z0-9]/g, '-')}`,
      label: fileName,
      type: 'module',
      filePath: fileName,
      startLine: 1,
      endLine: lines.length,
      summary: `Source file ${fileName} with ${lines.length} lines of code.`,
      complexity: lines.length > 200 ? 'high' : 'medium',
      tags: ['module']
    });
  }

  // Create sequential edges between nodes
  for (let i = 0; i < nodes.length - 1; i++) {
    edges.push({
      id: `edge-${i}`,
      source: nodes[i].id,
      target: nodes[i + 1].id,
      label: 'invokes / sequences to',
      type: 'sync'
    });
  }

  return {
    nodes,
    edges,
    overview: `Extracted ${nodes.length} structural components and ${edges.length} flow linkages from ${fileName}.`
  };
}
