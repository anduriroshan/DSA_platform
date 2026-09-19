---
name: sidebar-categories
description: Sidebar.tsx CATEGORY_META now covers 6 categories; new categories beyond these need UI agent
metadata:
  type: project
---

`frontend/src/components/layout/Sidebar.tsx` `CATEGORY_META` map now contains entries for: `sorting`, `searching`, `data-structures`, `trees`, `graphs` (icon ⌬), `dynamic-programming` (icon ▦), and — as of 2026-09-19 — `arrays-hashing` (label "Arrays & Hashing (NeetCode 150)"), added by the ui-craftsman agent in parallel with the content agent's Phase 1 NeetCode registry work (see [[neetcode-content-type]]).

Category display order in the sidebar follows first-seen insertion order in `algorithmRegistry` (built via `getAlgorithmsByCategory()` → `Object.values(algorithmRegistry)` → `Object.entries()`), NOT a hardcoded order in Sidebar.tsx. `arrays-hashing` was appended as a whole block at the very end of `algorithmRegistry.ts`, so it renders after `dynamic-programming` in the sidebar.

**Why:** Sidebar will only render a section with proper icon/label if the category key exists in CATEGORY_META; otherwise it shows the raw kebab-case key.

**How to apply:** When introducing yet another category (e.g., a new NeetCode section like `two-pointers` or `sliding-window`, or a non-NeetCode category like `system-design`), hand off to the UI agent with the exact category slug and a suggested icon+label pair — same pattern used for `arrays-hashing`. Do not silently add a new category to the registry without flagging this. Placement within `algorithmRegistry.ts` (not just CATEGORY_META) determines sidebar order, so append new phases as a contiguous block where you want them to appear.

See also [[platform-snapshot-2026-05]], [[neetcode-content-type]].
