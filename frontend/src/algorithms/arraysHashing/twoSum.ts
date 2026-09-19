import { AnimationFrame } from '../../types/algorithm';

/**
 * NeetCode 150 — Two Sum
 *
 * Optimal approach: single-pass hash map storing value → index. For each
 * number, check whether its complement (target - num) was already seen
 * before inserting the current number. O(n) time, O(n) space.
 *
 * Uses the real `input` array and `target` — no hardcoding needed.
 */
export function generateTwoSum(input: number[], target: number): AnimationFrame[] {
  const arr = [...input];
  const frames: AnimationFrame[] = [];
  const seen = new Map<number, number>();

  frames.push({
    type: 'highlight',
    indices: [],
    arrayState: [...arr],
    description: `Starting Two Sum: nums=[${arr.join(', ')}], target=${target}`,
    codeLineHighlight: 0,
  });

  frames.push({
    type: 'highlight',
    indices: [],
    arrayState: [...arr],
    description: 'Initialize empty hash map: seen = {}',
    codeLineHighlight: 1,
  });

  for (let i = 0; i < arr.length; i++) {
    const num = arr[i];
    const complement = target - num;

    frames.push({
      type: 'compare',
      indices: [i],
      arrayState: [...arr],
      description: `complement = target - nums[${i}] = ${target} - ${num} = ${complement}`,
      codeLineHighlight: 3,
    });

    if (seen.has(complement)) {
      const j = seen.get(complement)!;
      frames.push({
        type: 'found',
        indices: [j, i],
        arrayState: [...arr],
        description: `${complement} is in seen (at index ${j})! nums[${j}]=${arr[j]} + nums[${i}]=${num} = ${target} → return [${j}, ${i}]`,
        codeLineHighlight: 5,
      });
      frames.push({
        type: 'complete',
        indices: [j, i],
        arrayState: [...arr],
        description: `Two Sum solved: indices [${j}, ${i}]`,
        codeLineHighlight: 5,
      });
      return frames;
    }

    seen.set(num, i);
    frames.push({
      type: 'set',
      indices: [i],
      arrayState: [...arr],
      description: `${complement} not in seen — record seen[${num}] = ${i}`,
      codeLineHighlight: 6,
    });
  }

  frames.push({
    type: 'not-found',
    indices: [],
    arrayState: [...arr],
    description: 'No pair sums to target → return [] (guaranteed not to happen per problem constraints)',
    codeLineHighlight: 7,
  });

  return frames;
}
