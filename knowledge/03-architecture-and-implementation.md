# Architecture and Technical Implementation

The DSA Visual Learning Platform is designed with a modern tech stack and an innovative approach to code execution and visualization. 

## 1. Frontend Architecture

**Tech Stack:** React, TypeScript, Vite, Zustand, Monaco Editor

- **Component Driven:** The UI is split into logical React components (`VisualizerPage`, `CodePanel`, `PlaybackControls`, `ArrayVisualizer`, etc.).
- **State Management:** `Zustand` provides a global store (`useVisualizerStore`) that holds the current algorithm data, execution frames, playback state (speed, current step), and editor code.
- **Dynamic Layout:** The application originally used a 3-panel layout (Pseudocode, Visualizer, Editor) but was dynamically simplified to a 2-panel layout to prioritize real Python code over pseudocode.
- **Visualizer Engine:** Currently, the visualizers render SVG elements based on the data provided in the `frames` array. D3.js is available in the dependencies but the current implementation uses declarative React SVG for performance and simplicity.

## 2. Backend Architecture

**Tech Stack:** Python, FastAPI, SQLite, SQLAlchemy

- **API Layer:** FastAPI provides robust endpoints (`/api/algorithms` and `/api/execute`).
- **Database:** SQLite stores algorithm metadata, descriptions, complexities, and crucially, the **starter Python code**.
- **Execution Sandbox:** User code is never executed in the main FastAPI thread. It is written to a temporary file, wrapped with security guards (blocking imports like `os`, `sys`, `subprocess`), and executed in a dedicated subprocess with a strict timeout.

## 3. The "Magical" Execution Tracer (The Secret Sauce)

The most complex and innovative part of this platform is how it translates arbitrary user Python code into a step-by-step UI visualization.

Instead of parsing the code into an Abstract Syntax Tree (AST), the backend leverages Python's built-in debugging hook: `sys.settrace()`.

### How it Works:
1. When the user hits "Run", the backend wraps their code in a custom execution script.
2. The script attaches a `trace_lines` function via `sys.settrace()`. This function fires *every time* the Python interpreter executes a line of code.
3. At each step, the tracer captures:
   - The current **Line Number** (`frame.f_lineno`).
   - The local variables (`frame.f_locals`).
4. **Intelligent Heuristics**: If the user hasn't explicitly used the `dsa` SDK, the tracer scans `locals()` to find the most prominent list of numbers. It assumes this is the array to visualize. It then scans for integers and treats them as visualization "pointers" (e.g., `i`, `j`, `low`, `high`, `mid`).
5. This trace data is compiled into a JSON array of "Frames" and sent back to the frontend.
6. The frontend's `CodePanel` reads the Line Number from the frame and uses the Monaco Editor API (`editor.deltaDecorations`) to inject a blue arrow and highlight the exact line of code as the visualizer plays back the state!
