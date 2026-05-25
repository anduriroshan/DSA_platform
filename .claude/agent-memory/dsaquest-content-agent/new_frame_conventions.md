---
name: new-frame-conventions
description: Key conventions for heap, graph, dp-table, and doubly-linked frames as enforced by the UI agent's visualizers
metadata:
  type: project
---

Conventions the UI agent imposed on the new frame types — verified by working implementations in Tier 3.

**Heap (`HeapAnimationFrame`):**
- `heap: number[]` canonical array; children at 2i+1, 2i+2; parent at floor((i-1)/2).
- Pass the full heap state every frame.
- `highlightedIndices` = visual emphasis set (parent+child for compares, single idx for insert/extract).
- `swapIndices: [a, b]` triggers swap animation.
- `settledIndices` = green "done" tint for already-extracted suffix (heap sort).
- Frame types: `heapify`, `swap`, `insert`, `extract`, `compare-parent`, `compare-child`, `highlight`, `complete`.

**Graph (`GraphAnimationFrame`):**
- `nodes` and `edges` arrays REQUIRED every frame — visualizer retains no state.
- Fixed layout: set `x`/`y` on EVERY node of FIRST frame; values in `[0..1]` = normalized fractions. Mixing normalized + raw units → falls back to circular layout. Don't re-pass on later frames (the same array reference can be reused).
- `directed` is frame-level default; `edge.directed` overrides per edge.
- `edgeStates` keyed by `` `${from}->${to}` `` template literal (exact match required); since undirected graphs need both directions, write BOTH keys when updating an undirected edge.
- `distances` keyed by node id; pass string `'∞'` for unreached.
- Sample graph nodes/edges live in `algorithms/graphs/graphBFS.ts` (exported `SAMPLE_GRAPH_NODES`/`SAMPLE_GRAPH_EDGES`) — reuse for sibling graph algorithms so users can compare visually.

**DP Table (`DPTableAnimationFrame`):**
- `table: (number | string | null)[][]` — `null` = uncomputed (renders as `·`).
- `computeCell: [row, col]` = current write target (coral).
- `readCells: [[r,c], ...]` = cells being read (yellow).
- `tracePath: [[r,c], ...]` = traceback path (purple) — use with `type: 'trace-back'`.
- For `type: 'final-answer'`, set `computeCell` to the answer location (green tint).
- For LCS-style: `rowHeaders`/`colHeaders` should include the empty-prefix marker (e.g. `'∅'`) as the first element AND the actual chars/numbers — table is (m+1)×(n+1), so headers must be length m+1 / n+1.
- `rowAxisLabel`/`colAxisLabel` for small uppercase axis titles (e.g., `'A'`, `'B'`).
- Frame types: `compute-cell`, `read-cell`, `final-answer`, `trace-back`, `highlight`, `complete`.

**Doubly-linked (extends `LinkedListAnimationFrame` via `LinkedListNode.prev`):**
- ANY node with `prev` defined (null for head, idx for body) flips the WHOLE frame to doubly-linked rendering.
- Omit `prev` entirely (don't set it) to keep singly-linked.
- Best practice: write a `rewirePointers()` helper that sets both `next` and `prev` consistently after every structural mutation, then deep-copy with `nodes.map(n => ({ ...n }))` per frame.

**Why:** I wrote 6 generators against these and they rendered correctly first try with `tsc --noEmit` clean. Future generator additions should follow the same patterns instead of re-deriving them.

See also [[platform-snapshot-2026-05]].
