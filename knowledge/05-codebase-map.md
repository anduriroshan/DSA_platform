# Codebase Map & Agent Handoff

This document is specifically written to orient any new developers or AI agents taking over the `dsa_platform` project. It details exactly where critical logic lives and the API contracts between the frontend and backend.

## 1. Directory Structure Overview

### Frontend (`/frontend`)
React + TypeScript + Vite application.

- `src/components/editor/`: 
  - `CodePanel.tsx`: Houses the Monaco editor. **Crucial:** It fetches the initial Python code from the backend and manages the `monacoRef` to inject CSS decorators (`.monaco-line-highlight`) that highlight the executing line.
  - `OutputConsole.tsx`: Displays stdout, stderr, and execution time.
- `src/components/visualization/`: Contains the D3/SVG components (`ArrayVisualizer.tsx`, `TreeVisualizer.tsx`, etc.). These are entirely declarative and render whatever state is inside `useVisualizerStore`.
- `src/store/useVisualizerStore.ts`: The central Zustand store. It holds the `frames` array returned from the backend execution, tracks the `currentStep`, and handles playback (play, pause, speed).
- `src/utils/algorithmRegistry.ts`: A static registry linking algorithm slugs (e.g., `binary-search`) to their visualizer type (e.g., `array`, `tree`).
- `src/index.css`: Contains the entire custom design system, including critical Monaco decorator overrides.

### Backend (`/backend`)
Python + FastAPI + SQLite application.

- `main.py`: App entry point. Defines the `lifespan` that seeds the SQLite DB with the initial 12 algorithms.
- `database.py`: SQLAlchemy engine setup.
- `models/`:
  - `database_models.py`: Defines the `Algorithm` SQLAlchemy table.
  - `schemas.py`: Pydantic models for the API.
- `routers/`:
  - `algorithms.py`: `GET /api/algorithms` lists all algorithms. `GET /api/algorithms/{slug}` returns full details, including `sample_code_python` which is fetched by the frontend editor.
  - `execute.py`: `POST /api/execute` endpoint. Takes the user's Python code and passes it to the executor.
- `services/`:
  - `code_executor.py`: **The most complex file in the project.** Handles subprocess execution, security sandboxing (blocking `os`, `sys`), and the `sys.settrace` auto-visualization heuristics.

## 2. API Contracts & The Execution Trace

When the frontend sends code to `/api/execute`, the backend runs it and returns a JSON response:
```json
{
  "stdout": "Hello World\n",
  "stderr": "",
  "exit_code": 0,
  "execution_time_ms": 12.5,
  "error": null,
  "frames": [ ... ]
}
```

### The `frames` Array
Each frame in the array represents a single line of executed code and the state of the variables at that exact millisecond.
```typescript
interface Frame {
  type: 'highlight' | 'compare' | 'swap' | 'complete'; // Determines color
  arrayState: number[]; // The array to render
  indices: number[]; // The indices to highlight or point to
  description: string; // Optional text
  codeLineHighlight: number; // The line number in the Monaco editor to highlight
}
```

## 3. Critical Quirks & "Magic" to be Aware Of

If you are modifying the platform, **do not break these behaviors**:

1. **The Heuristic Tracer (`code_executor.py`)**: 
   We do not use AST parsing. When the user's code runs, `sys.settrace()` pauses execution on every line. If the user didn't explicitly use the `dsa` SDK, the tracer scans `frame.f_locals` to find a `list` to act as `arrayState`, and finds `int` variables (like `i`, `low`, `mid`) to act as `indices`. This makes standard Python code visualize automatically.
2. **The `dsa` Builtin**:
   The execution script injects a `DSA_SDK` instance into Python's `builtins.dsa`. This allows users to write `dsa.track(arr)` or `dsa.swap(i, j)` in their code *without* importing anything. 
3. **No Pseudocode**:
   We removed the `pseudocode` property and the `PseudoCodePanel`. The layout is now 2 columns (Visualizer + Editor). The frontend editor pulls `sample_code_python` straight from the DB via `/api/algorithms/{slug}`.
