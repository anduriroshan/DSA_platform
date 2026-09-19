import { AnimationFrame } from '../../types/algorithm';

/**
 * NeetCode 150 — Product of Array Except Self
 *
 * Optimal approach: two linear passes, no division.
 *   Pass 1 (prefix): res[i] = product of everything to the LEFT of i.
 *   Pass 2 (suffix): res[i] *= product of everything to the RIGHT of i.
 * O(n) time, O(1) extra space (excluding the output array).
 *
 * Uses the real `input` array — no hardcoding needed. `arrayState` tracks
 * the `res` output array as it's built (mirrors how countingSort/mergeSort
 * visualize output construction).
 */
export function generateProductExceptSelf(input: number[]): AnimationFrame[] {
  const nums = [...input];
  const n = nums.length;
  const frames: AnimationFrame[] = [];

  frames.push({
    type: 'highlight',
    indices: [],
    arrayState: new Array(n).fill(1),
    description: `Starting Product Except Self: nums=[${nums.join(', ')}]`,
    codeLineHighlight: 0,
  });

  const res = new Array(n).fill(1);
  frames.push({
    type: 'highlight',
    indices: [],
    arrayState: [...res],
    description: `Initialize res = [${res.join(', ')}] (n ones)`,
    codeLineHighlight: 2,
  });

  // Pass 1: prefix products
  let prefix = 1;
  for (let i = 0; i < n; i++) {
    res[i] = prefix;
    frames.push({
      type: 'set',
      indices: [i],
      arrayState: [...res],
      description: `res[${i}] = prefix = ${prefix}; then prefix *= nums[${i}]=${nums[i]} → prefix=${prefix * nums[i]}`,
      codeLineHighlight: 5,
    });
    prefix *= nums[i];
  }

  // Pass 2: suffix products
  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    res[i] *= suffix;
    frames.push({
      type: 'set',
      indices: [i],
      arrayState: [...res],
      description: `res[${i}] *= suffix (${suffix}) → res[${i}]=${res[i]}; then suffix *= nums[${i}]=${nums[i]} → suffix=${suffix * nums[i]}`,
      codeLineHighlight: 9,
    });
    suffix *= nums[i];
  }

  frames.push({
    type: 'complete',
    indices: Array.from({ length: n }, (_, i) => i),
    arrayState: [...res],
    description: `Product Except Self complete: [${res.join(', ')}]`,
    codeLineHighlight: 11,
  });

  return frames;
}
