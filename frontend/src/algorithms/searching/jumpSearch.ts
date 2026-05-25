import { AnimationFrame } from '../../types/algorithm';

export function generateJumpSearch(input: number[], target: number = 0): AnimationFrame[] {
  const arr = [...input].sort((a, b) => a - b);
  const frames: AnimationFrame[] = [];
  const n = arr.length;
  const step = Math.max(1, Math.floor(Math.sqrt(n)));

  frames.push({
    type: 'highlight',
    indices: [],
    arrayState: [...arr],
    description: `Starting Jump Search for target=${target} (sorted array, jump size = √${n} = ${step})`,
    codeLineHighlight: 0,
  });

  let prev = 0;
  let curr = 0;

  // Phase 1: jump in blocks of size √n
  while (curr < n && arr[curr] < target) {
    frames.push({
      type: 'compare',
      indices: [curr],
      arrayState: [...arr],
      description: `Jump to index ${curr}: arr[${curr}]=${arr[curr]} < ${target}, jump again`,
      codeLineHighlight: 3,
    });
    prev = curr + 1;
    curr += step;
  }

  if (curr >= n) {
    frames.push({
      type: 'highlight',
      indices: [n - 1],
      arrayState: [...arr],
      description: `Jumped past end. Linear scan from index ${prev} to ${n - 1}`,
      codeLineHighlight: 5,
    });
    curr = n - 1;
  } else {
    frames.push({
      type: 'highlight',
      indices: [curr],
      arrayState: [...arr],
      description: `arr[${curr}]=${arr[curr]} ≥ ${target}. Linear scan from index ${prev} to ${curr}`,
      codeLineHighlight: 5,
    });
  }

  // Phase 2: linear scan within block
  for (let i = prev; i <= curr; i++) {
    frames.push({
      type: 'compare',
      indices: [i],
      arrayState: [...arr],
      description: `Linear scan: compare arr[${i}]=${arr[i]} with ${target}`,
      codeLineHighlight: 7,
    });
    if (arr[i] === target) {
      frames.push({
        type: 'found',
        indices: [i],
        arrayState: [...arr],
        description: `Found ${target} at index ${i}!`,
        codeLineHighlight: 8,
      });
      return frames;
    }
    if (arr[i] > target) break;
  }

  frames.push({
    type: 'not-found',
    indices: [],
    arrayState: [...arr],
    description: `${target} not found in the array`,
    codeLineHighlight: 10,
  });

  return frames;
}
