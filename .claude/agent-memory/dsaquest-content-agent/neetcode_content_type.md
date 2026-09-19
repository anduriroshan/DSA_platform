---
name: neetcode-content-type
description: NeetCode 150 interview problems are a distinct content type layered on the existing algorithm-registry mechanism — real code instead of pseudocode, phased rollout by NeetCode section
metadata:
  type: project
---

Starting 2026-09-19, DSAQuest is adding NeetCode 150 interview-style problems as a
**separate initiative from classic textbook algorithms**, but reusing the exact same
4-file mechanism (generator + registry entry + LearnTab theory + backend seed) —
no separate problems/submissions/test-case backend exists or is planned yet.

**Category convention:** each NeetCode section becomes its own registry category,
slug = kebab-case section name (e.g. `arrays-hashing` for "Array & Hashing"), display
label = `"{Section Name} (NeetCode 150)"`. The category is registered by the
ui-craftsman agent in `Sidebar.tsx` `CATEGORY_META`/`ITEM_ICON` in parallel with the
content agent's registry/generator work — no dependency between the two, both can run
concurrently. Folder convention: `frontend/src/algorithms/{camelCaseSectionName}/`
(e.g. `arraysHashing/`), one file per problem, camelCase filenames
(`containsDuplicate.ts`, `twoSum.ts`, etc.).

**One-off convention: real code instead of pseudocode.** For NeetCode-sourced
entries ONLY, the registry `pseudocode: string[]` field holds the actual optimal
solution as real, genuine code (Python-style used so far), line by line — NOT the
language-agnostic pseudocode used for classic algorithms (bubble-sort, BST, etc).
`codeLineHighlight` in every frame must index into these real code lines. Do NOT
retroactively change existing classic-algorithm entries to this style — this is
NeetCode-specific and was an explicit one-off instruction from the user. Backend
`sample_code_python` stays the same convention as always (idiomatic, traceable
Python) — no change there, it just happens to now closely mirror the registry
pseudocode field for these entries specifically.

**No dedicated Hash Table / Bucket visualizer exists yet** (same gap noted in
[[platform-snapshot-2026-05]]). For number-array-shaped problems, reuse
`visualizerType: 'array'` and represent hash-set/hash-map state through
`description` text + index highlighting on the real input array — this reads fine,
no new visualizer needed. See [[phase1-arrays-hashing-fidelity]] for exactly which
problems needed approximation vs. which were fully faithful, and use that judgment
call consistently for future NeetCode phases (Two Pointers, Sliding Window, Stack,
Binary Search, Linked List, Trees, Tries, Heap/Priority Queue, Backtracking, Graphs,
DP, Greedy, Intervals, Math/Geometry, Bit Manipulation — the remaining NeetCode 150
sections).

**Input pipeline is strictly `number[]`** — `useVisualizerStore.inputArray: number[]`
and `InputControls.tsx` only parses comma-separated integers. There is no string/2D
array input path today. For problems whose real input is fundamentally non-numeric
(two strings, a list of strings, a 2D board), the established precedent — already
used by `lcs`, `graph-bfs`, `graph-dfs` BEFORE this NeetCode phase — is to hardcode
the actual sample data as module-level constants inside the generator file and write
`generate: () => generateX()`, ignoring the registry's `input`/`target` args
entirely. TypeScript allows this (a zero-arg function satisfies a
`(input, target?) => Frame[]` type). Editing the "ARR" input box in the UI is then a
no-op for that algorithm — an already-accepted limitation, not a bug to fix.

**Verification method that worked well:** copy the new generator files + a snapshot
of `types/algorithm.ts` into an isolated scratch folder (mirroring the real relative
import depth, e.g. `scratch/algorithms/arraysHashing/*.ts` + `scratch/types/algorithm.ts`
so `../../types/algorithm` resolves), compile with
`frontend/node_modules/.bin/tsc.cmd --module commonjs --target es2019 --outDir ...`
run from a directory with NO `tsconfig.json` present (tsc errors with TS5112 if you
pass explicit file args from inside a dir that has one), then `node` the output and
assert on final-frame descriptions + that every `codeLineHighlight` falls inside
`[0, pseudocode.length)`. This caught real runtime behavior, not just type-checking —
worth reusing for future phases instead of relying on mental trace alone. Also:
statically extract `SEED_ALGORITHMS` from `backend/main.py` via Python's `ast` module
(`ast.literal_eval` on the list literal) rather than importing `main` directly — the
module pulls in FastAPI/SQLAlchemy which may not be installed/importable outside the
project's venv (its own venv shim was broken — pointed at a nonexistent base Python
install — so `ast`-based static extraction was the reliable path). Then `exec()` each
`sample_code_python` block to confirm it actually runs and prints the expected answer.

See also [[phase1-arrays-hashing-fidelity]], [[platform-snapshot-2026-05]],
[[sidebar-categories]].
