---
name: project-dsa-platform
description: Core facts about the DSA Visual Learning Platform — stack, structure, current scale, and division of labor with the content agent.
metadata:
  type: project
---

Full-stack, interactive DSA (Data Structures & Algorithms) visual learning platform at C:\Users\anduri.roshan\Downloads\DSA_platform. Two agents share this repo: **ui-craftsman** (this agent — components/CSS/store/pages) and **dsaquest-content-agent** (algorithm generators, registry entries, theory content, backend seed data). They run concurrently on non-overlapping files; see `.claude/agents/*.md` for the exact scope split.

**Why:** Built to help learners understand algorithms by watching them execute step-by-step in a real editor context, rather than reading static slides.

**Stack:** React 19 + TypeScript + Vite + Zustand + Monaco + D3.js + react-router-dom v7 (frontend); Python 3.11 + FastAPI + SQLAlchemy/SQLite (backend). No CSS framework — one hand-written `frontend/src/index.css`.

**Scale as of 2026-09-19:** 37 algorithms across 7 visualizer types: `array`, `tree`, `stack-queue`, `linked-list`, `heap`, `graph`, `dp-table` (verified via `grep -c "visualizerType:" algorithmRegistry.ts`). This number climbs whenever the content agent adds algorithms — re-verify with that grep rather than trusting a cached count if it matters to a task.

**Not-yet-built visualizer types** (content agent will bring a proposed frame shape when scheduled): Hash Table, Trie, Segment Tree. See `.claude/agent-memory/dsaquest-content-agent/new_frame_conventions.md` for the conventions already established for the 7 that exist.

**Theme system:** see [[theme_system_minecraft]] for the full day/night architecture — token strategy, motif approach, where state lives.

**Rename (2026-09-19):** product renamed DSAQuest → **Akgoflick** (K as the third letter — this spelling has flip-flopped more than once in one day, see [[brand-rename-algoflick]] and re-verify by grep before trusting any spelling you're handed, including this one). Logo mark redesign is resolved — see [[logo-mark-review]] for the chosen mark and the one remaining open item (favicon).

**How to apply:** When designing new UI, respect the pixel-art system (hard `Npx Npx 0 var(--ink)` shadows, no blur, `Press Start 2P` display font) and the day/night token split described in [[theme_system_minecraft]]. All visualizers are presentational, driven by `frames[currentStep]` from `useVisualizerStore` — no algorithm logic belongs in a `*Visualizer.tsx` file.
