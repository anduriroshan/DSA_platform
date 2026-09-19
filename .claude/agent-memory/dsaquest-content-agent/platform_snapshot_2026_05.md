---
name: platform-snapshot-2026-05
description: Snapshot of DSAQuest's implemented algorithms, visualizers, frame types, and registry structure as of 2026-05-24
metadata:
  type: project
---

Snapshot of DSAQuest at 2026-05-24 (post Tier 2 + Tier 3). **Updated 2026-09-19**
with Phase 1 of NeetCode 150 content — see the addendum at the bottom; the
original Tier 1-3 snapshot below is left intact for history.

**Implemented algorithms (28 total, all 4 files wired up) — as of 2026-05-24:**
- sorting (8): bubble-sort, selection-sort, insertion-sort, merge-sort, quick-sort, heap-sort, counting-sort, radix-sort
- searching (4): linear-search, binary-search, jump-search, interpolation-search
- data-structures (5): stack, queue, linked-list, doubly-linked-list, min-heap
- trees (7): bst-operations, bst-search, bst-delete, inorder-traversal, preorder-traversal, postorder-traversal, level-order-traversal
- graphs (2): graph-bfs, graph-dfs
- dynamic-programming (2): fibonacci-dp, lcs

**2026-09-19 addendum — now 37 algorithms total.** Added category
`arrays-hashing` (9 problems, NeetCode 150 "Array & Hashing" section, Phase 1 of
a new phased interview-problem initiative — see [[neetcode-content-type]] and
[[phase1-arrays-hashing-fidelity]] for the full convention and fidelity
breakdown): contains-duplicate, valid-anagram, two-sum, group-anagrams,
top-k-frequent-elements, product-of-array-except-self, valid-sudoku,
encode-and-decode-strings, longest-consecutive-sequence. This category's
registry `pseudocode` fields hold real solution code, not language-agnostic
pseudocode — a deliberate one-off convention, do not backport to Tier 1-3
entries. `valid-sudoku` is the first `dp-table`-visualizer use outside actual
DP (repurposed as a 9x9 grid highlighter) — confirms the DP table visualizer
generalizes to "any 2D grid with cell-level highlighting," worth remembering
for future grid-shaped problems (e.g. word search, island counting).

**Visualizers present (all UI-agent provided):** ArrayVisualizer, TreeVisualizer, StackQueueVisualizer, LinkedListVisualizer (now also renders doubly-linked when any node has `prev !== undefined`), HeapVisualizer, GraphVisualizer, DPTableVisualizer.

**Frame types in `types/algorithm.ts`:** AnimationFrame, TreeAnimationFrame, DSAnimationFrame, LinkedListAnimationFrame, HeapAnimationFrame, GraphAnimationFrame, DPTableAnimationFrame. VisualizerType union = `'array' | 'tree' | 'stack-queue' | 'linked-list' | 'heap' | 'graph' | 'dp-table'`.

**Sidebar category meta** now also includes `graphs` (icon ⌬) and `dynamic-programming` (icon ▦).

**Sample-graph convention:** `graphs/graphBFS.ts` exports `SAMPLE_GRAPH_NODES` + `SAMPLE_GRAPH_EDGES` (8 nodes A–H, normalized 0..1 coords). DFS reuses these so the two algorithms can be compared on identical topology. Future graph algorithms should reuse or extend this sample.

**Backend seed:** All 28 entries present in `backend/main.py` SEED_ALGORITHMS. **DB re-seed required** — `seed_database()` only seeds when table is empty. User must either delete `backend/dsa_platform.db` or manually insert the 6 new rows.

**Why:** Helps future-me skip rediscovery when planning additions.

**How to apply:** Tier 1–3 is done. Next batches (AVL, Red-Black, Dijkstra, knapsack, edit distance, etc.) can layer on top of the existing visualizers without UI-agent work, EXCEPT: Trie and Hash Table still need new visualizers.

See also [[backend-seed-location]], [[sidebar-categories]].
