import { AnimationFrame } from '../../types/algorithm';

export function generateCountingSort(input: number[]): AnimationFrame[] {
  const arr = [...input];
  const frames: AnimationFrame[] = [];
  const n = arr.length;

  frames.push({
    type: 'highlight',
    indices: [],
    arrayState: [...arr],
    description: 'Starting Counting Sort — non-comparison sort using key frequencies',
    codeLineHighlight: 0,
  });

  if (n === 0) {
    frames.push({
      type: 'complete',
      indices: [],
      arrayState: [...arr],
      description: 'Empty array — nothing to sort',
      codeLineHighlight: 9,
    });
    return frames;
  }

  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const range = max - min + 1;
  const count = new Array(range).fill(0);

  frames.push({
    type: 'highlight',
    indices: Array.from({ length: n }, (_, i) => i),
    arrayState: [...arr],
    description: `Determined range: min=${min}, max=${max}, count array of size ${range}`,
    codeLineHighlight: 1,
  });

  // Phase 1: build count array
  for (let i = 0; i < n; i++) {
    count[arr[i] - min]++;
    frames.push({
      type: 'compare',
      indices: [i],
      arrayState: [...arr],
      description: `Count value ${arr[i]}: count[${arr[i] - min}] = ${count[arr[i] - min]} (counts: [${count.join(', ')}])`,
      codeLineHighlight: 3,
    });
  }

  // Phase 2: cumulative count
  frames.push({
    type: 'highlight',
    indices: [],
    arrayState: [...arr],
    description: `Counts built. Now compute cumulative count: [${count.join(', ')}]`,
    codeLineHighlight: 4,
  });
  for (let i = 1; i < range; i++) {
    count[i] += count[i - 1];
    frames.push({
      type: 'highlight',
      indices: [],
      arrayState: [...arr],
      description: `Cumulative: count[${i}]=${count[i]} (so values ≤ ${i + min} occupy positions 0..${count[i] - 1})`,
      codeLineHighlight: 5,
    });
  }

  // Phase 3: place each element in output array (iterate right-to-left for stability)
  const output = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    const val = arr[i];
    const pos = count[val - min] - 1;
    output[pos] = val;
    count[val - min]--;
    frames.push({
      type: 'set',
      indices: [pos],
      values: [val],
      arrayState: [...output],
      description: `Place ${val} at output[${pos}] (stable: keeps original order for duplicates)`,
      codeLineHighlight: 7,
    });
  }

  // Copy output back
  for (let i = 0; i < n; i++) arr[i] = output[i];

  frames.push({
    type: 'complete',
    indices: Array.from({ length: n }, (_, i) => i),
    arrayState: [...arr],
    description: 'Counting Sort complete — array is fully sorted in O(n+k) time',
    codeLineHighlight: 8,
  });

  return frames;
}
