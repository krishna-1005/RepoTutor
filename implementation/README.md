# RepoTutor Implementation Directory

This directory contains the source code, React components, state management, and GenAI SDK integration for **RepoTutor**.

## Directory Layout (Planned)

```
implementation/
├── public/              # Static assets
├── src/
│   ├── components/      # React components (Visualizer, Sidebar, Audit, GuideMe)
│   ├── services/        # Gemini GenAI SDK integrations & prompt handlers
│   ├── store/           # Zustand / React Context state management & localStorage persistence
│   ├── types/           # TypeScript interfaces for JSON schemas and app state
│   ├── utils/           # AST parsers and helper utilities
│   ├── App.tsx          # Main Application component
│   └── index.css        # Global styles & design system tokens
├── index.html           # HTML template
├── package.json         # Project dependencies
└── vite.config.ts       # Vite build configuration
```
