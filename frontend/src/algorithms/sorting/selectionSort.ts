import { AnimationFrame } from '../../types/algorithm';

export function generateSelectionSort(input: number[]): AnimationFrame[] {
  const arr = [...input];
  const frames: AnimationFrame[] = [];
  const n = arr.length;

  frames.push({
    type: 'highlight',
    indices: [],
    arrayState: [...arr],
    description: 'Starting Selection Sort',
    codeLineHighlight: 0,
  });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    frames.push({
      type: 'highlight',
      indices: [i],
      arrayState: [...arr],
      description: `Starting pass ${i + 1}: assume arr[${i}]=${arr[i]} is minimum`,
      codeLineHighlight: 2,
    });

    for (let j = i + 1; j < n; j++) {
      frames.push({
        type: 'compare',
        indices: [j, minIdx],
        arrayState: [...arr],
        description: `Compare arr[${j}]=${arr[j]} with current min arr[${minIdx}]=${arr[minIdx]}`,
        codeLineHighlight: 4,
      });

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        frames.push({
          type: 'min',
          indices: [minIdx],
          arrayState: [...arr],
          description: `New minimum found: arr[${minIdx}]=${arr[minIdx]}`,
          codeLineHighlight: 5,
        });
      }
    }

    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      frames.push({
        type: 'swap',
        indices: [i, minIdx],
        arrayState: [...arr],
        description: `Swap arr[${i}] with arr[${minIdx}]`,
        codeLineHighlight: 6,
      });
    }

    frames.push({
      type: 'sorted',
      indices: [i],
      arrayState: [...arr],
      description: `Position ${i} is now sorted`,
      codeLineHighlight: 7,
    });
  }

  frames.push({
    type: 'complete',
    indices: Array.from({ length: n }, (_, i) => i),
    arrayState: [...arr],
    description: 'Array is fully sorted!',
    codeLineHighlight: 8,
  });

  return frames;
}
