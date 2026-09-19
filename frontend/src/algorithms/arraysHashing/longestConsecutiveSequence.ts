import { AnimationFrame } from '../../types/algorithm';

/**
 * NeetCode 150 — Longest Consecutive Sequence
 *
 * Optimal approach: put every value in a hash set, then only START counting
 * a sequence from a value `n` whose predecessor `n-1` is NOT in the set —
 * that guarantees each sequence is counted exactly once from its start,
 * giving O(n) total work instead of O(n log n) sorting.
 *
 * Uses the real `input` array — no hardcoding needed.
 */
export function generateLongestConsecutiveSequence(input: number[]): AnimationFrame[] {
  const nums = [...input];
  const n = nums.length;
  const frames: AnimationFrame[] = [];
  const numSet = new Set(nums);

  frames.push({
    type: 'highlight',
    indices: [],
    arrayState: [...nums],
    description: `Starting Longest Consecutive Sequence: nums=[${nums.join(', ')}]`,
    codeLineHighlight: 0,
  });

  frames.push({
    type: 'highlight',
    indices: Array.from({ length: n }, (_, i) => i),
    arrayState: [...nums],
    description: `Build hash set: numSet = {${[...numSet].join(', ')}}`,
    codeLineHighlight: 1,
  });

  let longest = 0;
  let bestStart = 0;
  let bestLength = 0;
  const startedFrom = new Set<number>();

  for (let i = 0; i < n; i++) {
    const num = nums[i];
    if (startedFrom.has(num)) continue; // duplicate value, already evaluated as a candidate
    startedFrom.add(num);

    const hasPredecessor = numSet.has(num - 1);
    frames.push({
      type: 'compare',
      indices: [i],
      arrayState: [...nums],
      description: hasPredecessor
        ? `nums[${i}]=${num}: ${num - 1} IS in numSet → not a sequence start, skip`
        : `nums[${i}]=${num}: ${num - 1} is NOT in numSet → potential sequence start`,
      codeLineHighlight: 4,
    });

    if (hasPredecessor) continue;

    let length = 1;
    const seqPositions = [i];
    while (numSet.has(num + length)) {
      const nextVal = num + length;
      const posInArray = nums.indexOf(nextVal);
      if (posInArray !== -1) seqPositions.push(posInArray);
      length++;
      frames.push({
        type: 'search',
        indices: [...seqPositions],
        arrayState: [...nums],
        description: `Extend from ${num}: is ${nextVal} in numSet? Yes → running length = ${length}`,
        codeLineHighlight: 7,
      });
    }
    frames.push({
      type: 'search',
      indices: [...seqPositions],
      arrayState: [...nums],
      description: `Extend from ${num}: is ${num + length} in numSet? No → sequence [${num}..${num + length - 1}] has length ${length}`,
      codeLineHighlight: 6,
    });

    const prevLongest = longest;
    if (length > longest) {
      longest = length;
      bestStart = num;
      bestLength = length;
    }
    frames.push({
      type: 'found',
      indices: [...seqPositions],
      arrayState: [...nums],
      description: `longest = max(${prevLongest}, ${length}) = ${longest}`,
      codeLineHighlight: 8,
    });
  }

  const bestPositions: number[] = [];
  for (let v = bestStart; v < bestStart + bestLength; v++) {
    const pos = nums.indexOf(v);
    if (pos !== -1) bestPositions.push(pos);
  }

  frames.push({
    type: 'complete',
    indices: bestPositions,
    arrayState: [...nums],
    description: `Longest consecutive sequence: ${bestStart}..${bestStart + bestLength - 1} → length ${longest}`,
    codeLineHighlight: 9,
  });

  return frames;
}
