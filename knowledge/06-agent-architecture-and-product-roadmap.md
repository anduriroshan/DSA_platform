# Agent Architecture & Product Roadmap

This document defines every agent needed to build DSAQuest into a full learning platform, the features they power, the implementation phases, and the free/pro boundary. Written to be fed directly to any AI agent for context.

---

## Current State (as of 2026-05-23)

**What exists:**
- 12 algorithms with D3/SVG visualizations (array, tree, stack/queue, linked list)
- sys.settrace auto-visualization from plain Python code (key differentiator)
- Pseudocode synced with visualization playback
- Monaco code editor with sandboxed execution
- Zustand state management, React 19 + TypeScript + Vite frontend
- FastAPI + SQLite backend
- One UI agent built in Claude CLI

**What's missing:**
- No auth / user accounts
- No progress tracking or persistence
- No learning roadmap or structure
- No quizzes, games, or practice problems
- No AI-powered explanations
- No mobile responsiveness
- Homepage doesn't showcase the product well
- Viz panel is too small / layout priorities are wrong

---

## Agent Inventory

### Agent 1: UI Agent (EXISTS)
**Purpose:** Builds and modifies frontend React components, pages, layouts, and CSS.
**Tools:** File read/write, code generation, browser preview
**Owns:**
- All React component creation and modification
- CSS/design system changes
- New page scaffolding
- Responsive layout implementation
- Homepage redesign
- Visualizer page layout flip (viz-centered)

---

### Agent 2: Explainer Agent
**Purpose:** Real-time, context-aware explanations of what's happening at any visualization step.
**When users click "Why?" on any paused frame, this agent generates a plain-English explanation.**

**Input context it receives:**
- Algorithm slug (e.g., "bubble-sort")
- Current frame object: `{ type, arrayState, indices, description, codeLineHighlight }`
- Previous 2-3 frames (for continuity)
- The pseudocode with the active line highlighted
- User's skill level (beginner/intermediate from profile)

**Output:**
- 2-4 sentence explanation of what's happening and WHY
- Optional: "Did you know?" micro-insight (e.g., "This is why bubble sort is called 'bubble' - larger elements float to the end like bubbles")

**Implementation:**
- Backend endpoint: `POST /api/explain-step`
- Sends frame context + algorithm metadata to Claude API
- System prompt tailored for DSA teaching, concise explanations
- Cache responses for identical frame states (same algo + same arrayState + same indices = same explanation)
- Rate limit: 5/day free, unlimited pro

**Prompt template skeleton:**
```
You are a DSA tutor explaining algorithm steps to a student.
Algorithm: {algorithm_name}
Current step: Frame {step_number} of {total_frames}
Frame type: {frame_type}
Array state: {array_state}
Highlighted indices: {indices}
Active pseudocode line: "{pseudocode_line}"
Previous action: {prev_frame_description}

Explain what just happened in 2-3 sentences. Be specific about the values.
Use the student's name if available. Keep it conversational, not textbook-y.
```

---

### Agent 3: Code Mentor Agent
**Purpose:** Reviews user-written code, gives hints, debugs errors, suggests improvements. The "AI tutor in the code editor."

**Capabilities:**
1. **Code Review** - User submits their sorting implementation, agent checks correctness, style, edge cases
2. **Bug Detection** - When code execution fails or produces wrong output, explain the bug
3. **Progressive Hints** - For practice problems: Hint 1 (direction), Hint 2 (approach), Hint 3 (pseudocode), Hint 4 (partial solution)
4. **Complexity Analysis** - "Your code runs in O(n^2). Here's why... and here's how to optimize it."
5. **Code Comparison** - Compare user's code against optimal solution, explain differences

**Input context:**
- User's code (from Monaco editor)
- Algorithm slug
- Execution result (stdout, stderr, frames, exit_code)
- Expected output (for practice problems)
- Hint level requested (1-4)

**Implementation:**
- Backend endpoint: `POST /api/code-mentor`
- Actions: `review`, `debug`, `hint`, `analyze-complexity`, `compare`
- Claude API with code-focused system prompt
- Rate limit: 3 reviews/day free, unlimited pro

---

### Agent 4: Quiz Generator Agent
**Purpose:** Generates algorithm-specific quizzes, mini-games, and comprehension checks.

**Quiz types it generates:**
1. **Post-Algorithm MCQs** (3-5 per algorithm)
   - "After pass 2 of bubble sort on [5,3,8,1,9], what is the array state?"
   - "What is the worst-case time complexity of quick sort?"
   - "Which sorting algorithm is stable?"
2. **"Predict the Next Step"** - Show a frame, ask what happens next
3. **"Spot the Bug"** - Show broken code, identify the error
4. **"Guess the Output"** - Show code, predict the sorted result
5. **"Which is Faster?"** - Two algorithms, same input, predict winner
6. **"Match the Complexity"** - Match algorithms to their Big-O

**Implementation approach:**
- Pre-generate quiz banks per algorithm (not real-time, to avoid latency)
- Store in DB: `quiz` table with `algorithm_slug`, `type`, `question`, `options`, `correct_answer`, `explanation`
- Backend: `GET /api/quizzes/{slug}`, `POST /api/quizzes/{id}/submit`
- Agent runs offline/batch to populate quiz bank
- Can regenerate with different inputs for variety
- Track user scores in `user_quiz_results` table

**Bonus - Daily Challenge:**
- Cron job or scheduled agent picks "Algorithm of the Day"
- Generates a unique challenge with specific input
- Leaderboard for fastest/most accurate completion

---

### Agent 5: Viz Generator Agent (FUTURE - the agentic viz for leetcode problems)
**Purpose:** Given an arbitrary DSA problem, generates a React visualization component by composing from a primitive library.

**This is the big ambitious one. Build LAST, after the primitive library is mature.**

**Architecture (composition, not raw generation):**

Viz Primitive Library (build these first):
```
primitives/
  ArrayPrimitive.tsx      - Bar chart, color-coded elements, index labels
  MatrixPrimitive.tsx     - 2D grid with cell highlighting
  TreePrimitive.tsx       - Hierarchical node-edge layout (d3.tree)
  GraphPrimitive.tsx      - Force-directed or fixed graph layout
  LinkedListPrimitive.tsx - Horizontal/vertical node chain
  StackPrimitive.tsx      - Vertical LIFO block stack
  QueuePrimitive.tsx      - Horizontal FIFO block queue
  HeapPrimitive.tsx       - Tree + array dual view
  PointerOverlay.tsx      - Arrows, labels, annotations on any primitive
  VariableWatch.tsx       - Shows current variable values
  CallStackViz.tsx        - Recursion call stack visualization
```

**Agent workflow:**
1. Receive problem description + solution code
2. Analyze what data structures are used (AST parse or Claude analysis)
3. Select which primitives to compose
4. Generate a "viz config" JSON that maps code variables to primitive states
5. Frontend renderer reads config + frames to animate

**This way the agent outputs JSON configs, NOT raw React code. Much more reliable.**

**Example config output:**
```json
{
  "layout": "horizontal",
  "primitives": [
    { "type": "array", "binding": "nums", "label": "Input Array" },
    { "type": "variable-watch", "bindings": ["left", "right", "target"] },
    { "type": "array", "binding": "result", "label": "Output" }
  ],
  "frameMapping": {
    "compare": { "highlight": "yellow", "indices": ["left", "right"] },
    "found": { "highlight": "green", "indices": ["mid"] }
  }
}
```

**Implementation phases for this agent:**
- Phase A: Build the primitive component library (no AI needed)
- Phase B: Build the config-driven renderer
- Phase C: Build the agent that generates configs from problem descriptions
- Phase D: Integrate with a problem bank (leetcode-style)

---

### Agent 6: Content Author Agent
**Purpose:** Generates learning content for new algorithms as the library expands.

**What it produces per algorithm:**
- Description (1-2 sentences)
- "How it works" steps (4-6 bullet points)
- Pseudocode (language-agnostic, line-numbered)
- "When to use it" explanation
- Time/space complexity with brief justification
- Sample Python implementation
- Common pitfalls section
- Real-world applications

**Implementation:**
- Offline/batch agent - runs when adding new algorithms
- Output goes into DB seed data or JSON files
- Human review before publishing
- Backend endpoint for admin: `POST /api/admin/generate-content`
- Input: algorithm name, category, difficulty, optional reference links

**Expansion targets (in priority order):**
1. Graphs: BFS, DFS, Dijkstra, Bellman-Ford, Kruskal, Prim
2. Dynamic Programming: Fibonacci, Knapsack, LCS, Coin Change, Grid Traveler
3. Greedy: Activity Selection, Huffman Coding, Fractional Knapsack
4. Advanced DS: Heap, Hash Table, Trie, Segment Tree
5. Advanced: Topological Sort, Floyd-Warshall, Union-Find

---

### Agent 7: Curriculum Agent
**Purpose:** Personalizes learning paths based on user progress, quiz scores, and time spent.

**What it does:**
- Analyzes user's completed algorithms, quiz scores, code submissions
- Identifies weak areas ("You scored 2/5 on tree quizzes, strong on sorting")
- Suggests next algorithm to study
- Adjusts difficulty progression
- Sends nudges: "You haven't practiced in 3 days. Quick 5-min review of Binary Search?"

**Implementation:**
- Requires user auth + progress tracking (Phase 1 prerequisite)
- Backend service that runs periodically or on-demand
- `GET /api/curriculum/next` - returns personalized recommendation
- `GET /api/curriculum/summary` - returns progress dashboard data
- Simple rule-based initially, upgrade to AI-powered later
- Rules example: If quiz_score < 60% on topic X, recommend X's prerequisite

---

### Agent 8: Problem Curator Agent
**Purpose:** Creates and manages practice problems tied to specific algorithms.

**Problem format:**
```json
{
  "title": "Sort Colors (Dutch National Flag)",
  "difficulty": "medium",
  "algorithm_tags": ["sorting", "quick-sort"],
  "description": "Given an array of 0s, 1s, and 2s, sort in-place...",
  "examples": [
    { "input": "[2,0,2,1,1,0]", "output": "[0,0,1,1,2,2]" }
  ],
  "test_cases": [...],
  "hints": ["Think about partitioning", "Use three pointers", ...],
  "starter_code": "def sortColors(nums):\n    pass",
  "optimal_solution": "...",
  "viz_config": { ... }  // For Viz Generator Agent
}
```

**Implementation:**
- Batch agent that generates problems from templates
- Maps problems to algorithms: "After learning Quick Sort, try these 3 problems"
- Stores in DB: `problems` table
- Backend: `GET /api/problems?algorithm=quick-sort`, `POST /api/problems/{id}/submit`
- Judge: Run user code against test cases in sandbox, compare output
- Rate limit: 3 problems/day free, unlimited pro

---

## Implementation Phases

### Phase 0: UX Foundation (Week 1-2)
**No agents needed. Pure frontend/backend work.**

| Task | Owner | Priority |
|------|-------|----------|
| Default to dark mode | UI Agent | P0 |
| Flip visualizer layout (viz center, learn sidebar) | UI Agent | P0 |
| Homepage redesign: live demo in hero, "How it Works" section, footer | UI Agent | P0 |
| Algorithm navigation (prev/next buttons) | UI Agent | P0 |
| Make CODE editor a tab, not a FAB | UI Agent | P1 |
| Mobile responsive layout | UI Agent | P1 |
| SEO meta tags per algorithm page | UI Agent | P2 |
| Light theme color fix (better contrast) | UI Agent | P2 |

### Phase 1: Auth & Progress (Week 3-4)
**Foundation for everything else. No AI agents yet.**

| Task | Details |
|------|---------|
| User auth | Google OAuth via Firebase or Supabase (simplest for indie) |
| User profile | Name, email, avatar, skill level, join date |
| Progress tracking | `user_progress` table: algorithm_slug, completed, time_spent, last_visited |
| Learning roadmap UI | Visual path: Arrays > Sorting > Searching > DS > Trees > Graphs > DP |
| Streak tracking | Daily login streak, algorithms completed this week |
| XP system | Points for: completing viz (10xp), quiz (25xp), code challenge (50xp) |
| Database migration | SQLite -> PostgreSQL (for production) |

**DB schema additions:**
```sql
users (id, email, name, avatar_url, skill_level, xp, streak, plan, created_at)
user_progress (user_id, algorithm_slug, completed, quiz_score, time_spent_sec, last_visited)
user_sessions (user_id, login_at, duration_sec)
```

### Phase 2: Engagement Layer (Week 5-7)
**Quiz Generator Agent + Content Author Agent active.**

| Task | Agent | Details |
|------|-------|---------|
| Generate quiz bank | Quiz Generator Agent | 5 MCQs per algorithm x 12 = 60 questions |
| Build quiz UI | UI Agent | Post-algorithm quiz modal, score display, XP award |
| Mini-games UI | UI Agent | "Predict the Step", "Which is Faster?", "Spot the Bug" |
| Algorithm of the Day | Backend cron + UI | Featured algo with daily challenge |
| Shareable viz links | UI Agent + Backend | URL params encode algorithm + input + step |
| Comparison mode | UI Agent | Side-by-side viz of two algorithms |
| Speed Race game | UI Agent + Quiz Agent | Predict winner, watch race, earn XP |
| Expand algorithm library | Content Author Agent | Add 6-8 graph algorithms + content |
| Build graph visualizer | UI Agent | Force-directed D3 graph component |
| Leaderboard | UI Agent + Backend | Weekly/monthly top scorers |

### Phase 3: AI Layer (Week 8-10)
**Explainer Agent + Code Mentor Agent go live.**

| Task | Agent | Details |
|------|-------|---------|
| "Why?" button on viz | Explainer Agent | Contextual step explanations |
| Explain endpoint | Backend | POST /api/explain-step with caching |
| Code review feature | Code Mentor Agent | Review user code after submission |
| Progressive hints | Code Mentor Agent | 4-level hint system for stuck users |
| Bug detection | Code Mentor Agent | When execution fails, explain why |
| Complexity analyzer | Code Mentor Agent | Analyze user code's Big-O |
| Rate limiting | Backend | Free: 5 explains + 3 reviews/day, Pro: unlimited |
| Ad integration | UI Agent | AdSense/Carbon ads for free tier |
| Pro subscription | Backend + UI | Razorpay/Stripe integration, 50-90 INR/mo |

### Phase 4: Practice Platform (Week 11-14)
**Problem Curator Agent + expanded Viz Generator foundations.**

| Task | Agent | Details |
|------|-------|---------|
| Problem bank | Problem Curator Agent | 5 problems per algorithm = 60+ problems |
| Practice UI | UI Agent | Problem description, code editor, test runner, submit |
| Code judge | Backend | Run against test cases, pass/fail, time measurement |
| Problem-algorithm mapping | Problem Curator Agent | "After learning X, try these problems" |
| Viz primitive library | UI Agent | ArrayPrimitive, MatrixPrimitive, GraphPrimitive, etc. |
| Config-driven renderer | UI Agent + Backend | JSON config -> composed visualization |
| Certificates | UI Agent + Backend | PDF generation on category completion |
| DP visualizer | UI Agent | Matrix/table visualization for DP problems |

### Phase 5: Agentic Visualization (Week 15-20)
**Viz Generator Agent comes online.**

| Task | Agent | Details |
|------|-------|---------|
| Viz config generator | Viz Generator Agent | Analyze problem -> output primitive composition config |
| Problem -> viz pipeline | Backend | Problem submitted -> agent generates viz config -> render |
| Test with 20 common problems | Viz Generator Agent | Validate configs for two-sum, reverse-list, etc. |
| User-submitted problems | UI + Backend | Users paste problem, get auto-visualization |
| Curriculum personalization | Curriculum Agent | AI-powered "what to learn next" |

### Phase 6: Growth (Week 20+)
| Task | Details |
|------|---------|
| Multi-language support (Java, C++, JS) | Backend execution expansion |
| Cloud deployment (GCP Cloud Run) | Docker + PostgreSQL + Redis |
| Community features | Comments, discussions, solution sharing |
| Instructor mode | Teachers create custom problem sets for classes |
| API for embeds | Other sites embed DSAQuest visualizations |
| Mobile app (React Native or PWA) | Offline support, push notifications |

---

## Free vs Pro Feature Matrix

| Feature | Free | Pro (50-90 INR/mo) |
|---------|------|---------------------|
| All 30+ algorithm visualizations | Yes | Yes |
| All learning content & pseudocode | Yes | Yes |
| Code editor + execution | Yes | Yes |
| Trace Your Code (auto-viz) | Yes | Yes |
| Learning roadmap | Yes | Yes |
| Quizzes (post-algorithm) | Yes | Yes |
| Mini-games | Yes | Yes |
| Shareable links | Yes | Yes |
| AI "Explain This Step" | 5/day | Unlimited |
| AI Code Review | 3/day | Unlimited |
| AI Hints for problems | 3/day | Unlimited |
| Comparison Mode | 2/day | Unlimited |
| Practice Problems | 3/day | Unlimited |
| Ads | Banner + interstitial | None |
| Progress analytics | Basic (streak, XP) | Detailed (time, weak areas) |
| Certificates | No | Yes |
| Curriculum personalization | No | AI-powered path |
| Priority new features | No | Yes |
| Advanced algorithms (Graphs, DP) | View viz only | Full interactive + code |

**Principle:** Free users learn the same content. Pro removes friction (ads, limits) and adds AI-powered personalization. Never paywall knowledge.

---

## Agent Tech Stack

| Component | Technology |
|-----------|-----------|
| LLM | Claude API (claude-sonnet-4-6 for speed, claude-opus-4-6 for complex generation) |
| Agent framework | Claude Agent SDK or direct API calls |
| Caching | Redis for AI response caching (same frame = same explanation) |
| Rate limiting | Redis counters per user per day |
| Background jobs | Celery + Redis (quiz generation, content authoring, batch viz configs) |
| Auth | Firebase Auth or Supabase Auth (Google OAuth) |
| Payments | Razorpay (India-first, supports UPI, 50-90 INR) |
| Database | PostgreSQL (migrate from SQLite for production) |
| Hosting | GCP Cloud Run (backend) + Vercel/Cloudflare Pages (frontend) |
| CDN | Cloudflare (free tier sufficient initially) |

---

## Agent Communication Patterns

```
User interacts with frontend
        |
        v
  Frontend (React)
        |
        v
  Backend API (FastAPI)
        |
        +--- /api/explain-step    --> Explainer Agent --> Claude API
        +--- /api/code-mentor     --> Code Mentor Agent --> Claude API
        +--- /api/quizzes         --> Quiz DB (pre-generated by Quiz Agent)
        +--- /api/problems        --> Problem DB (pre-generated by Problem Agent)
        +--- /api/curriculum/next --> Curriculum Agent --> Claude API
        +--- /api/execute         --> Code Executor (sys.settrace, no AI)
        +--- /api/viz-config      --> Viz Generator Agent --> Claude API (future)
```

**Real-time agents** (called on user action): Explainer, Code Mentor, Curriculum
**Batch agents** (run offline to populate DB): Quiz Generator, Content Author, Problem Curator, Viz Generator

---

## Key Metrics to Track

| Metric | Why it matters |
|--------|---------------|
| DAU/MAU | User retention |
| Algorithms completed per user | Engagement depth |
| Quiz completion rate | Learning effectiveness |
| Code submissions per user | Active learning |
| AI explain clicks per session | Feature value |
| Free -> Pro conversion | Revenue |
| Session duration | Stickiness |
| Streak length distribution | Habit formation |
| Bounce rate from homepage | First impression quality |
| Shareable link clicks | Viral growth |

---

## Competitive Positioning

**DSAQuest is NOT another VisuAlgo or NeetCode. The pitch:**

> "The only DSA platform where you paste YOUR code and watch it execute step-by-step with AI explanations. Learn algorithms by seeing, doing, and understanding — not just reading."

**Three pillars:**
1. **See it** - Interactive visualizations with step-by-step playback
2. **Code it** - Write and trace your own implementations
3. **Understand it** - AI explains every step in plain English

**Against competitors:**
- vs VisuAlgo: "We let you run YOUR code, not just watch pre-built animations"
- vs NeetCode: "We show you HOW the algorithm works visually, not just the solution"
- vs LeetCode: "We teach you the algorithm before asking you to solve problems"
- vs AlgoExpert: "Same quality, 10x cheaper (50 INR vs $99), Indian-first"
