---
name: phase1-arrays-hashing-fidelity
description: Which of the 9 NeetCode Arrays & Hashing problems got fully faithful visualizations vs. approximated ones, and why — precedent for judging future NeetCode phases
metadata:
  type: project
---

Phase 1 of NeetCode 150 content (`arrays-hashing` category, 9 problems, added
2026-09-19) — fidelity breakdown for future reference when the same
array/hash-map-shaped tension comes up in later phases.

**Fully faithful (real algorithm, real input wired through, meaningful `array`/
`dp-table` visualization):**
- `contains-duplicate` — real `number[]` input, hash-set seen-check per index.
- `two-sum` — real `number[]` input + real `target`, hash-map value→index.
- `product-of-array-except-self` — real `number[]` input, arrayState = the `res`
  output array evolving through prefix then suffix passes (mirrors how
  countingSort/mergeSort already visualize output construction).
- `longest-consecutive-sequence` — real `number[]` input, arrayState = original
  array, indices highlight sequence-candidate positions as they're discovered.
- `valid-anagram` — strings hardcoded (see [[neetcode-content-type]]), but the
  **arrayState IS a real, meaningful number array**: the 26-slot letter-frequency
  count array, incremented for `s` and decremented for `t`. This is a genuinely
  faithful representation of the actual algorithm's core data structure, not a
  approximation — reuse this "frequency array as arrayState" trick for any future
  problem whose real state is a fixed-size count array (anagram/palindrome/
  character-frequency family problems).
- `valid-sudoku` — reused `dp-table` visualizer as a 9x9 grid highlighter
  (`computeCell`/`readCells` mark the cell + conflicting cell). Board is
  hardcoded to the classic LeetCode invalid example (two 8's collide in box 0)
  so the short-circuit conflict path is demonstrated, not just the happy path.

**Approximated (per explicit user instruction — don't block on new visualizer,
flag for follow-up):**
- `group-anagrams` — `arrayState` is a parallel `groupId[]` array (one slot per
  input string, -1 until assigned, then the id of its anagram group). Reasonable
  approximation but not a literal hash-table/bucket rendering.
- `top-k-frequent-elements` — real `number[]` input + real `target` (repurposed
  as k) IS wired through correctly and the real bucket-sort algorithm runs, but
  the bucket contents (lists-of-values per frequency slot) aren't representable
  as a single flat number[], so `arrayState` stays the constant original array
  and bucket state is narrated only in `description` text, with `indices`
  pointing back to original array positions for each value placed/extracted.
- `encode-and-decode-strings` — least array-shaped of the nine. `arrayState` is
  just the (unchanging) per-string length array as a numeric anchor; all real
  content (the encoded string, the parsing) lives in `description` text only.

**Recommendation for ui-craftsman follow-up (already surfaced to the user):** of
the three approximated ones, `group-anagrams` and `top-k-frequent-elements` would
benefit most from a real Hash-Table/Bucket visualizer (both have genuine grouped/
bucketed structure worth rendering natively); `encode-and-decode-strings` is a
narrower, one-off serialization problem — a dedicated visualizer for it alone is
probably not worth the investment relative to the other backlog items (Trie,
Segment Tree, plain Hash Table).

See also [[neetcode-content-type]].
