import { AnimationFrame } from '../../types/algorithm';

/**
 * NeetCode 150 — Contains Duplicate
 *
 * Optimal approach: single pass with a hash set. For each value, check
 * membership before inserting — O(n) time, O(n) extra space.
 *
 * Uses the real `input` array (no hardcoding needed — this problem is
 * naturally number-array-shaped).
 */
export function generateContainsDuplicate(input: number[]): AnimationFrame[] {
  const arr = [...input];
  const frames: AnimationFrame[] = [];
  const seen = new Set<number>();
  const firstIndex = new Map<number, number>();

  frames.push({
    type: 'highlight',
    indices: [],
    arrayState: [...arr],
    description: `Starting Contains Duplicate — checking [${arr.join(', ')}] for repeated values`,
    codeLineHighlight: 0,
  });

  frames.push({
    type: 'highlight',
    indices: [],
    arrayState: [...arr],
    description: 'Initialize an empty hash set: seen = {}',
    codeLineHighlight: 1,
  });

  for (let i = 0; i < arr.length; i++) {
    const num = arr[i];
    frames.push({
      type: 'compare',
      indices: [i],
      arrayState: [...arr],
      description: `Check nums[${i}]=${num} against seen = {${[...seen].join(', ')}}`,
      codeLineHighlight: 3,
    });

    if (seen.has(num)) {
      frames.push({
        type: 'found',
        indices: [firstIndex.get(num)!, i],
        arrayState: [...arr],
        description: `Duplicate found! nums[${i}]=${num} already seen at index ${firstIndex.get(num)} → return True`,
        codeLineHighlight: 4,
      });
      frames.push({
        type: 'complete',
        indices: [firstIndex.get(num)!, i],
        arrayState: [...arr],
        description: `Contains Duplicate = True (value ${num} repeats)`,
        codeLineHighlight: 4,
      });
      return frames;
    }

    seen.add(num);
    firstIndex.set(num, i);
    frames.push({
      type: 'set',
      indices: [i],
      arrayState: [...arr],
      description: `Not in seen — add nums[${i}]=${num}. seen = {${[...seen].join(', ')}}`,
      codeLineHighlight: 5,
    });
  }

  frames.push({
    type: 'complete',
    indices: Array.from({ length: arr.length }, (_, i) => i),
    arrayState: [...arr],
    description: 'No repeated values found → return False',
    codeLineHighlight: 6,
  });

  return frames;
}
