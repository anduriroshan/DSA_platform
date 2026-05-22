# Next Steps & Future Enhancements

While the core execution and visualization engine is fully functional, there are several exciting paths for expanding the DSA Visual Learning Platform.

## 1. Expanding the Algorithm Library
- **Graph Algorithms:** Implement visualizers for BFS, DFS, Dijkstra's Algorithm, and A* Search. This will require building a new Node/Edge SVG visualizer component in React.
- **Dynamic Programming:** Visualizing matrices and grids to show state transitions in problems like Knapsack, Longest Common Subsequence, and Grid Traveler.

## 2. Multi-Language Support
Currently, the backend execution service (`code_executor.py`) only supports Python. 
- Expand the sandboxed environment to compile and execute **Java**, **C++**, and **JavaScript/TypeScript**.
- For languages like C++ or Java, `sys.settrace` won't work. We will need to inject debugging flags, use `gdb` automation, or rely strictly on the `dsa` SDK where the user explicitly yields state frames.

## 3. Pseudocode Documentation Revival
- We temporarily removed the Pseudocode panel from the main visualizer layout to prioritize the interactive Python editor.
- **Future Goal:** Build a dedicated "Algorithm Knowledge Base" page for each algorithm where users can read the detailed theory, see the pseudocode side-by-side with the Python implementation, and study the time/space complexity proofs before jumping into the interactive visualizer.

## 4. Cloud Deployment (GCP)
- Dockerize the frontend and backend applications.
- Set up a robust, scalable backend architecture on **Google Cloud Platform (GCP)** (e.g., Cloud Run) to securely handle arbitrary code execution from multiple concurrent users.
- Migrate the database from a local `.db` file (SQLite) to Cloud SQL (PostgreSQL).

## 5. User Accounts and Gamification
- Add user authentication (e.g., Firebase or JWT with FastAPI).
- Allow users to save their custom code solutions, track their progress, and earn badges for mastering different algorithmic categories.
