import { AnimationFrame } from '../../types/algorithm';

export function generateBubbleSort(input: number[]): AnimationFrame[] {
  const arr = [...input];
  const frames: AnimationFrame[] = [];
  const n = arr.length;

  frames.push({
    type: 'highlight',
    indices: [],
    arrayState: [...arr],
    description: 'Starting Bubble Sort',
    codeLineHighlight: 0,
  });

  for (let i = 0; i < n; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      // Compare
      frames.push({
        type: 'compare',
        indices: [j, j + 1],
        arrayState: [...arr],
        description: `Compare arr[${j}]=${arr[j]} with arr[${j + 1}]=${arr[j + 1]}`,
        codeLineHighlight: 3,
      });

      if (arr[j] > arr[j + 1]) {
        // Swap
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
        frames.push({
          type: 'swap',
          indices: [j, j + 1],
          arrayState: [...arr],
          description: `${arr[j + 1]} > ${arr[j]}, swap them`,
          codeLineHighlight: 4,
        });
      }
    }
    // Mark sorted
    frames.push({
      type: 'sorted',
      indices: [n - i - 1],
      arrayState: [...arr],
      description: `Element at position ${n - i - 1} is now sorted`,
      codeLineHighlight: 6,
    });
    if (!swapped) {
      break;
    }
  }

  // Mark all as sorted
  frames.push({
    type: 'complete',
    indices: Array.from({ length: n }, (_, i) => i),
    arrayState: [...arr],
    description: 'Array is fully sorted!',
    codeLineHighlight: 8,
  });

  return frames;
}
