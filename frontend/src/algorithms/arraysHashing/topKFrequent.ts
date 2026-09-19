import { AnimationFrame } from '../../types/algorithm';

/**
 * NeetCode 150 — Top K Frequent Elements
 *
 * Optimal approach: bucket sort by frequency. Count occurrences, place each
 * distinct value into bucket[frequency], then scan buckets from highest
 * frequency to lowest, collecting values until k are gathered. O(n) time
 * (bounded by n+1 possible frequencies), beating an O(n log n) sort-based
 * approach.
 *
 * APPROXIMATED VISUALIZATION: bucket contents (lists-of-values per frequency)
 * don't map onto a single flat number[] the way a sort does. `arrayState`
 * stays the original `nums` array throughout; frame `indices` highlight
 * which original positions are being counted / bucketed / extracted, and
 * `description` carries the actual frequency-map and bucket state. Flagged
 * as a strong candidate for a dedicated Hash-Table/Bucket visualizer.
 *
 * Uses the real `input` array and `target` (repurposed as k) — no
 * hardcoding needed.
 */
export function generateTopKFrequent(input: number[], k: number): AnimationFrame[] {
  const nums = [...input];
  const n = nums.length;
  const frames: AnimationFrame[] = [];
  const safeK = Math.max(1, Math.min(k, n));

  frames.push({
    type: 'highlight',
    indices: [],
    arrayState: [...nums],
    description: `Starting Top-K Frequent: nums=[${nums.join(', ')}], k=${safeK}`,
    codeLineHighlight: 0,
  });

  frames.push({
    type: 'highlight',
    indices: [],
    arrayState: [...nums],
    description: 'Initialize empty frequency map: count = {}',
    codeLineHighlight: 1,
  });

  const count = new Map<number, number>();
  for (let i = 0; i < n; i++) {
    const num = nums[i];
    count.set(num, (count.get(num) ?? 0) + 1);
    frames.push({
      type: 'compare',
      indices: [i],
      arrayState: [...nums],
      description: `count[nums[${i}]=${num}] → ${count.get(num)} (running counts: {${[...count.entries()].map(([v, c]) => `${v}:${c}`).join(', ')}})`,
      codeLineHighlight: 3,
    });
  }

  frames.push({
    type: 'highlight',
    indices: [],
    arrayState: [...nums],
    description: `Allocate ${n + 1} buckets, indexed 0..${n} by frequency`,
    codeLineHighlight: 4,
  });

  const buckets: number[][] = Array.from({ length: n + 1 }, () => []);
  for (const [num, freq] of count.entries()) {
    buckets[freq].push(num);
    const positions = nums.reduce<number[]>((acc, v, idx) => (v === num ? [...acc, idx] : acc), []);
    frames.push({
      type: 'set',
      indices: positions,
      arrayState: [...nums],
      description: `Place value ${num} (frequency ${freq}) into bucket[${freq}]`,
      codeLineHighlight: 6,
    });
  }

  const result: number[] = [];
  const resultIndices: number[] = [];
  outer: for (let freq = buckets.length - 1; freq >= 1; freq--) {
    for (const num of buckets[freq]) {
      result.push(num);
      const positions = nums.reduce<number[]>((acc, v, idx) => (v === num ? [...acc, idx] : acc), []);
      resultIndices.push(...positions);
      frames.push({
        type: 'found',
        indices: [...resultIndices],
        arrayState: [...nums],
        description: `Scan bucket[${freq}] → take value ${num}. result=[${result.join(', ')}]`,
        codeLineHighlight: 10,
      });
      if (result.length === safeK) break outer;
    }
  }

  frames.push({
    type: 'complete',
    indices: [...resultIndices],
    arrayState: [...nums],
    description: `Top-${safeK} frequent elements: [${result.join(', ')}]`,
    codeLineHighlight: 12,
  });

  return frames;
}
