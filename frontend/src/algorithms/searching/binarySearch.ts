import { AnimationFrame } from '../../types/algorithm';

export function generateBinarySearch(input: number[], target: number = 0): AnimationFrame[] {
  const arr = [...input].sort((a, b) => a - b);
  const frames: AnimationFrame[] = [];

  frames.push({
    type: 'highlight',
    indices: [],
    arrayState: [...arr],
    description: `Starting Binary Search for target = ${target} (array must be sorted)`,
    codeLineHighlight: 0,
  });

  let low = 0;
  let high = arr.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    // Highlight search window
    frames.push({
      type: 'search',
      indices: Array.from({ length: high - low + 1 }, (_, i) => low + i),
      arrayState: [...arr],
      description: `Search window: arr[${low}..${high}], mid = ${mid}`,
      codeLineHighlight: 3,
    });

    frames.push({
      type: 'compare',
      indices: [mid],
      arrayState: [...arr],
      description: `Compare arr[${mid}]=${arr[mid]} with target=${target}`,
      codeLineHighlight: 4,
    });

    if (arr[mid] === target) {
      frames.push({
        type: 'found',
        indices: [mid],
        arrayState: [...arr],
        description: `Found ${target} at index ${mid}!`,
        codeLineHighlight: 5,
      });
      return frames;
    } else if (arr[mid] < target) {
      frames.push({
        type: 'highlight',
        indices: [mid],
        arrayState: [...arr],
        description: `${arr[mid]} < ${target}, search right half`,
        codeLineHighlight: 7,
      });
      low = mid + 1;
    } else {
      frames.push({
        type: 'highlight',
        indices: [mid],
        arrayState: [...arr],
        description: `${arr[mid]} > ${target}, search left half`,
        codeLineHighlight: 9,
      });
      high = mid - 1;
    }
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
