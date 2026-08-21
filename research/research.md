# RepoTutor: Code Comprehension & Semantic Flow Tracing Research

## 1. Executive Summary

Software developers spend up to 70% of their time reading, navigating, and building mental models of existing codebases rather than writing new logic. Traditional developer tools rely primarily on static AST parsers or regex search utilities that map syntax but fail to capture **semantic execution lifecycles** and **business logic flow**.

**RepoTutor** bridges this gap by combining client-side structural AST parsing with **Gemini 2.5 Flash** (via `@google/genai`). By using Gemini's large context windows and strict `responseSchema` JSON output enforcement, RepoTutor transforms static source code into interactive component topologies, step-by-step execution timelines, and automated security audit scorecards.

---

## 2. Developer Pain Points: Manual Execution Lifecycle Tracing

In modern full-stack and backend architectures, tracing how data flows from an initial user request or API endpoint to database mutations, external services, and async events presents major bottlenecks:

1. **Context-Switching Drag**: Developers must manually step through dozens of files, functions, and import chains, constantly losing place in the overall execution lifecycle.
2. **Dynamic & Implicit Contracts**: Async event emitters, middleware chains, dependency injection, and promises obscure call hierarchies that static inspection cannot easily uncover.
3. **Documentation Drift**: Architecture diagrams and README files drift out of sync with production code, forcing engineers to reconstruct mental models from scratch.
4. **Onboarding Friction**: New team members spend weeks reading code line-by-line before feeling confident making non-trivial modifications.

---

## 3. Technical Gap: Static AST Parsers vs. Semantic LLM Flow Tracing

```
Raw Code Input ──► AST Parser (Syntax Nodes) ──► Gemini 2.5 Flash ──► Enforced JSON Schema ──► Dynamic React Visualizer
```

### 3.1 Limitations of Static AST Parsers
Static Abstract Syntax Tree (AST) parsers (such as Babel, Tree-Sitter, or ESTree) analyze code at the grammatical token level:
- **Scope Restriction**: Confined to syntax nodes within isolated files or explicit imports.
- **Semantic Blindspot**: Cannot explain *intent*, infer dynamic variable payloads, or synthesize high-level business logic.
- **Static Call Graphs**: Fail when execution pathways depend on runtime conditions, dynamic callbacks, or async message queues.

### 3.2 Advantages of Semantic LLM Flow Tracing (Gemini 2.5 Flash)
Gemini 2.5 Flash combines structural context with semantic AI reasoning:
- **Global Context Window**: Evaluates multi-file interactions and end-to-end execution pathways simultaneously.
- **Natural Language Walkthroughs**: Translates complex control flows into human-understandable, step-by-step explanations.
- **Guaranteed JSON Output**: Uses `@google/genai` SDK with explicit `responseSchema` to output valid node arrays, edge topologies, execution steps, and audit items.
- **Low Latency & High Speed**: Gemini 2.5 Flash delivers sub-second response times ideal for real-time web UI exploration.

### 3.3 Comparative Technical Matrix

| Feature / Dimension | Traditional Static AST Parsers | RepoTutor (Gemini 2.5 Flash + React) |
| :--- | :--- | :--- |
| **Analysis Depth** | Syntax & AST Token Hierarchy | **Semantic Intent & Runtime Execution Lifecycle** |
| **Cross-File Data Flow** | Explicit import/export resolution | **End-to-End Dynamic Call Pathways** |
| **Explanations** | None (Raw code reading required) | **Step-by-Step Natural Language Explanations** |
| **Data Schema Output** | AST Object Tree | **Enforced JSON Contracts** (Graph, Flow, Audits) |
| **Interactive Walkthrough**| Static file trees | **"Guide Me" Mode** with step completion tracking |
| **Progress Tracking** | None | **Visited Node Tick Marks (`✓`)** saved in `localStorage` |

---

## 4. Key Feature Requirements for RepoTutor

### 4.1 Input Ingestion & Multi-Language Support
- Ingest raw source code snippets or directory files (JavaScript, TypeScript, Python, Go, Java).
- Client-side AST pre-parsing fallback for offline operation when API keys are unconfigured.

### 4.2 Pre-Loaded Demo Presets
- Provide instant, rich sample repositories (`Authentication & JWT Flow`, `E-Commerce Order Pipeline`, `Payment Gateway`) so developers can explore RepoTutor out-of-the-box without setup friction.

### 4.3 Interactive Topology Canvas Cards
- Render node-link topology graphs in SVG/Canvas with node category badges (`endpoint`, `function`, `class`, `utility`), line number indicators, and glowing active selection rings.
- Display visual **tick mark badges (`✓`)** on nodes visited by the developer.

### 4.4 Execution Flow Timelines & "Guide Me" Mode
- Offer an interactive, step-by-step walkthrough panel ("Guide Me" mode) with natural language explanations, review notes, progress percentage bar, and next/previous controls.
- Synchronize active flow step with graph node focus and side-by-side code editor line range highlighting.

### 4.5 Automated Security & Performance Audits
- Compute a repository Security & Quality Index score (0–100).
- Categorize security risks, performance bottlenecks, and maintainability anti-patterns with severity badges (`critical`, `high`, `medium`, `info`) linked directly to graph nodes.

### 4.6 Persistent User Progress (`localStorage`)
- Automatically persist visited node IDs (`visitedNodeIds`), completed step numbers, active repository preset, and API key configurations across browser sessions.

---

## 5. Conclusion & Action Plan

RepoTutor bridges the technical gap between static syntax parsing and developer comprehension by delivering semantic flow tracing powered by Gemini 2.5 Flash. The documented requirements serve as the foundation for the implemented React web visualizer.
