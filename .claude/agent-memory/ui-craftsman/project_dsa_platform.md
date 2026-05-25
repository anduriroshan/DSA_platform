---
name: DSA Platform — Project Overview
description: Core facts about the DSA Visual Learning Platform being built — stack, structure, features, completeness, and planned roadmap.
type: project
---

The project is a full-stack, interactive DSA (Data Structures & Algorithms) visual learning platform at C:\Users\anduri.roshan\Downloads\DSA_platform.

**Why:** Built to help learners understand algorithms by watching them execute step-by-step in a real editor context, rather than reading static slides.

**Stack:**
- Frontend: React 19, TypeScript, Vite, Zustand (global state), Monaco Editor, D3.js, react-router-dom v7
- Backend: Python 3.11, FastAPI, SQLAlchemy (SQLite), Pydantic, Uvicorn
- No CSS framework — custom design system in a single index.css

**Structure:** `frontend/` and `backend/` at root. `knowledge/` holds 5 planning/architecture docs.

**12 algorithms implemented** across 4 categories: Sorting (Bubble/Selection/Insertion/Merge/Quick), Searching (Linear/Binary), Data Structures (Stack/Queue/Linked List), Trees (BST Insert, Inorder Traversal).

**4 visualizer types:** array (bar chart via D3 SVG), tree (D3 hierarchy), stack-queue (CSS boxes), linked-list (CSS node chain).

**Execution tracer (backend secret sauce):** User Python code is run in a sandboxed subprocess; sys.settrace() fires on every line, auto-extracting local arrays and integer pointer variables to build JSON frame arrays — no explicit SDK calls required. A DSA_SDK (dsa.track/compare/swap/complete) also available for explicit control.

**State machine (frontend):** Zustand store holds frames[], currentStep, isPlaying, speed. PlaybackControls drives setInterval at 600ms/speed. Monaco decorations highlight the active line from frame.codeLineHighlight.

**Current completeness:** Core feature loop fully working — visualize prebuilt demos, edit code in Monaco, run on backend, get animated trace back. DB seeded with 12 algorithms at startup.

**Planned next steps:** Graph algorithms (BFS/DFS/Dijkstra), dynamic programming grids, multi-language support (Java/C++/JS), pseudocode knowledge-base page, GCP/Docker deployment (Cloud Run + Cloud SQL/Postgres), user auth + gamification.

**How to apply:** When designing new UI for this project, respect the existing dark-theme design system (cyan/purple gradient accents, bg-primary #060a14), two-page routing (HomePage + VisualizerPage/:slug), and the sidebar-toggle pattern. All new visualizers should implement the frame-based playback contract (type, arrayState/nodes/tree, indices, description, codeLineHighlight).
