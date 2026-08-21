# RepoTutor: Interactive Codebase Visualizer & Semantic Flow Tracer

## 1. Problem Statement

Modern software engineering teams face significant friction when onboarding developers onto complex or legacy codebases. As repositories grow in size, modularity, and dependency depth, understanding the underlying execution pathways and architectural intent becomes a major bottleneck:

- **High Onboarding Friction**: New team members spend days or weeks stepping through debuggers, reading stale documentation, or manually tracing function calls to build a mental model of the system.
- **Cognitive Overload**: Sifting through thousands of lines of code across disparate microservices, helper utilities, and abstract interfaces strains developer comprehension.
- **Documentation Staleness**: Architecture diagrams and README files drift out of sync with actual code implementations over time, rendering static documentation unreliable.
- **Hidden Dependencies & Execution Flow**: Complex control flows—such as async event chains, middleware pipelines, dynamic dispatch, and implicit API contracts—are difficult to grasp through static code reading alone.

---

## 2. Market Gap Analysis

Traditional developer tools rely primarily on static Abstract Syntax Tree (AST) analyzers, raw regex search tools, or basic graph visualization utilities. While helpful, these solutions fall short in capture-of-intent and high-level reasoning.

| Feature / Metric | Static AST & Traditional Analysis | Semantic Flow Tracing (RepoTutor + Gemini 2.5 Flash) |
| :--- | :--- | :--- |
| **Analysis Level** | Structural (syntax, imports, AST nodes) | **Semantic & Behavioral** (intent, business logic flow, runtime path analysis) |
| **Context Window** | File-local or isolated call hierarchies | **Global Repository Context** (multi-file relationships, end-to-end data flow) |
| **Explanation Capability**| None (requires human inspection) | **Natural Language Explanations** tailored to developer experience level |
| **Execution Path Tracing**| Rigid static call graphs (misses dynamic flow) | **Dynamic Semantic Flow Tracing** (reconstructs realistic runtime pathways) |
| **Adaptability** | Hardcoded language grammar rules | **Multi-language support** out of the box via Gemini GenAI models |
| **Audit & Insights** | Basic linter rules / complexity metrics | **Contextual Security & Performance Audits** linked directly to flow nodes |

By combining structural AST parsing with Gemini 2.5 Flash's large context windows and rapid reasoning, **RepoTutor** bridges the gap between raw code structures and human intuition.

---

## 3. Target Users & Value Proposition

### Target Users
1. **Software Engineers & Team Leads**: Accelerate feature development by rapidly mapping dependencies before refactoring or extending code.
2. **Newly Onboarded Developers**: Cut onboarding time from weeks to days by visually exploring execution paths with interactive walkthroughs.
3. **Open-Source Contributors**: Quickly understand repository entry points, data flows, and contribution guidelines without extensive maintainer intervention.
4. **Security & QA Engineers**: Map data pipelines to audit sanitization checkpoints, unhandled exceptions, and potential vulnerability vectors.

### Value Proposition
- **Visual & Interactive Exploration**: Transform complex linear source code into dynamic visual graphs and step-by-step execution flows.
- **Guided Learning Paths**: Embedded "Guide Me" mode offers structured, step-by-step walkthroughs with progress saved directly to local storage.
- **Actionable AI Security & Performance Audits**: Instant semantic feedback highlighting bottleneck hotspots and potential security risks directly on the visual graph nodes.

---

For complete in-depth analysis, comparative benchmarks, and core requirements, see the detailed research findings document: **[research.md](file:///d:/goo/research/research.md)**.

