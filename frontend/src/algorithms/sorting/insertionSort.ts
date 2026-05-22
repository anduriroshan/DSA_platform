import { AnimationFrame } from '../../types/algorithm';

export function generateInsertionSort(input: number[]): AnimationFrame[] {
  const arr = [...input];
  const frames: AnimationFrame[] = [];
  const n = arr.length;

  frames.push({
    type: 'highlight',
    indices: [],
    arrayState: [...arr],
    description: 'Starting Insertion Sort',
    codeLineHighlight: 0,
  });

  frames.push({
    type: 'sorted',
    indices: [0],
    arrayState: [...arr],
    description: 'First element is already sorted',
    codeLineHighlight: 1,
  });

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    frames.push({
      type: 'highlight',
      indices: [i],
      arrayState: [...arr],
      description: `Pick key = arr[${i}] = ${key}`,
      codeLineHighlight: 2,
    });

    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      frames.push({
        type: 'compare',
        indices: [j, j + 1],
        arrayState: [...arr],
        description: `Compare arr[${j}]=${arr[j]} with key=${key}. ${arr[j]} > ${key}, shift right`,
        codeLineHighlight: 4,
      });

      arr[j + 1] = arr[j];
      frames.push({
        type: 'set',
        indices: [j + 1],
        values: [arr[j]],
        arrayState: [...arr],
        description: `Shift arr[${j}]=${arr[j]} to position ${j + 1}`,
        codeLineHighlight: 5,
      });

      j--;
    }

    if (j >= 0) {
      frames.push({
        type: 'compare',
        indices: [j, j + 1],
        arrayState: [...arr],
        description: `arr[${j}]=${arr[j]} ≤ ${key}, stop shifting`,
        codeLineHighlight: 4,
      });
    }

    arr[j + 1] = key;
    frames.push({
      type: 'set',
      indices: [j + 1],
      values: [key],
      arrayState: [...arr],
      description: `Insert key=${key} at position ${j + 1}`,
      codeLineHighlight: 6,
    });
  }

  frames.push({
    type: 'complete',
    indices: Array.from({ length: n }, (_, i) => i),
    arrayState: [...arr],
    description: 'Array is fully sorted!',
    codeLineHighlight: 7,
  });

  return frames;
}
