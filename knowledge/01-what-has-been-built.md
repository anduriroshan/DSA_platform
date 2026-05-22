# What Has Been Built

The DSA Visual Learning Platform is an interactive, web-based tool designed to help users learn and understand Data Structures and Algorithms through live execution traces and visualizations. 

## Key Features

### 1. Interactive Algorithm Visualizations
We have implemented a fully custom visualization engine that dynamically renders arrays, trees, and linked lists. The platform currently supports 12 distinct algorithms spanning:
- **Sorting**: Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort
- **Searching**: Linear Search, Binary Search
- **Data Structures**: Stack, Queue, Linked List, BST Operations, Tree Traversals

### 2. Code Editor with Live Execution Tracer
Instead of relying on hardcoded pseudocode or static animations, the platform features a real Python compiler interface:
- **Monaco Editor**: Integrated VS Code-like editor for writing custom Python solutions.
- **Sandboxed Execution**: Code is securely sent to the FastAPI backend, where a subprocess runs it in an isolated environment.
- **Magical Auto-Visualization**: Using Python's `sys.settrace`, the backend inspects the executing code line-by-line. It automatically extracts local variables (finding arrays and index pointers) to magically drive the frontend visualizations without requiring explicit SDK calls from the user!

### 3. State & Playback Controls
Using `Zustand` for state management, the frontend synchronizes the execution trace with the UI:
- Users can Play, Pause, Step Forward, and Step Backward through their code.
- Playback speed is dynamically adjustable (1x to 4x).
- A blue arrow tracks the currently executing line directly inside the Monaco editor.

### 4. Modern, Premium UI
The entire application is styled from scratch without relying on generic component libraries like Tailwind:
- Beautiful dark mode with glassmorphism effects.
- Dynamic layouts that adjust between a split-pane editor and visualizer view.
- Smooth transitions and hover states for a highly responsive feel.
