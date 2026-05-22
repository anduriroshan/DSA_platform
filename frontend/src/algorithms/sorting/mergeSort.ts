import { AnimationFrame } from '../../types/algorithm';

export function generateMergeSort(input: number[]): AnimationFrame[] {
  const arr = [...input];
  const frames: AnimationFrame[] = [];

  frames.push({
    type: 'highlight',
    indices: [],
    arrayState: [...arr],
    description: 'Starting Merge Sort',
    codeLineHighlight: 0,
  });

  function mergeSort(start: number, end: number) {
    if (start >= end) return;

    const mid = Math.floor((start + end) / 2);

    frames.push({
      type: 'partition',
      indices: Array.from({ length: end - start + 1 }, (_, i) => start + i),
      arrayState: [...arr],
      description: `Divide: arr[${start}..${end}] into arr[${start}..${mid}] and arr[${mid + 1}..${end}]`,
      codeLineHighlight: 2,
    });

    mergeSort(start, mid);
    mergeSort(mid + 1, end);
    merge(start, mid, end);
  }

  function merge(start: number, mid: number, end: number) {
    const left = arr.slice(start, mid + 1);
    const right = arr.slice(mid + 1, end + 1);

    frames.push({
      type: 'highlight',
      indices: Array.from({ length: end - start + 1 }, (_, i) => start + i),
      arrayState: [...arr],
      description: `Merge: [${left}] and [${right}]`,
      codeLineHighlight: 5,
    });

    let i = 0, j = 0, k = start;

    while (i < left.length && j < right.length) {
      frames.push({
        type: 'compare',
        indices: [start + i, mid + 1 + j],
        arrayState: [...arr],
        description: `Compare ${left[i]} with ${right[j]}`,
        codeLineHighlight: 7,
      });

      if (left[i] <= right[j]) {
        arr[k] = left[i];
        frames.push({
          type: 'merge',
          indices: [k],
          values: [left[i]],
          arrayState: [...arr],
          description: `Place ${left[i]} at position ${k}`,
          codeLineHighlight: 8,
        });
        i++;
      } else {
        arr[k] = right[j];
        frames.push({
          type: 'merge',
          indices: [k],
          values: [right[j]],
          arrayState: [...arr],
          description: `Place ${right[j]} at position ${k}`,
          codeLineHighlight: 10,
        });
        j++;
      }
      k++;
    }

    while (i < left.length) {
      arr[k] = left[i];
      frames.push({
        type: 'merge',
        indices: [k],
        values: [left[i]],
        arrayState: [...arr],
        description: `Place remaining ${left[i]} at position ${k}`,
        codeLineHighlight: 12,
      });
      i++;
      k++;
    }

    while (j < right.length) {
      arr[k] = right[j];
      frames.push({
        type: 'merge',
        indices: [k],
        values: [right[j]],
        arrayState: [...arr],
        description: `Place remaining ${right[j]} at position ${k}`,
        codeLineHighlight: 12,
      });
      j++;
      k++;
    }
  }

  mergeSort(0, arr.length - 1);

  frames.push({
    type: 'complete',
    indices: Array.from({ length: arr.length }, (_, i) => i),
    arrayState: [...arr],
    description: 'Array is fully sorted!',
    codeLineHighlight: 13,
  });

  return frames;
}
