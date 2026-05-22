import { AnimationFrame } from '../../types/algorithm';

export function generateQuickSort(input: number[]): AnimationFrame[] {
  const arr = [...input];
  const frames: AnimationFrame[] = [];

  frames.push({
    type: 'highlight',
    indices: [],
    arrayState: [...arr],
    description: 'Starting Quick Sort',
    codeLineHighlight: 0,
  });

  function quickSort(low: number, high: number) {
    if (low < high) {
      const pi = partition(low, high);
      quickSort(low, pi - 1);
      quickSort(pi + 1, high);
    }
  }

  function partition(low: number, high: number): number {
    const pivot = arr[high];

    frames.push({
      type: 'pivot',
      indices: [high],
      arrayState: [...arr],
      description: `Choose pivot = arr[${high}] = ${pivot}`,
      codeLineHighlight: 4,
    });

    let i = low - 1;

    for (let j = low; j < high; j++) {
      frames.push({
        type: 'compare',
        indices: [j, high],
        arrayState: [...arr],
        description: `Compare arr[${j}]=${arr[j]} with pivot=${pivot}`,
        codeLineHighlight: 6,
      });

      if (arr[j] < pivot) {
        i++;
        if (i !== j) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
          frames.push({
            type: 'swap',
            indices: [i, j],
            arrayState: [...arr],
            description: `${arr[j]} < ${pivot}, swap arr[${i}] and arr[${j}]`,
            codeLineHighlight: 8,
          });
        }
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    frames.push({
      type: 'swap',
      indices: [i + 1, high],
      arrayState: [...arr],
      description: `Place pivot ${pivot} at its correct position ${i + 1}`,
      codeLineHighlight: 10,
    });

    frames.push({
      type: 'sorted',
      indices: [i + 1],
      arrayState: [...arr],
      description: `Pivot ${pivot} is now at its final sorted position`,
      codeLineHighlight: 11,
    });

    return i + 1;
  }

  quickSort(0, arr.length - 1);

  frames.push({
    type: 'complete',
    indices: Array.from({ length: arr.length }, (_, i) => i),
    arrayState: [...arr],
    description: 'Array is fully sorted!',
    codeLineHighlight: 12,
  });

  return frames;
}
