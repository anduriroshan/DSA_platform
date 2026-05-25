import { AnimationFrame } from '../../types/algorithm';

export function generateHeapSort(input: number[]): AnimationFrame[] {
  const arr = [...input];
  const frames: AnimationFrame[] = [];
  const n = arr.length;

  frames.push({
    type: 'highlight',
    indices: [],
    arrayState: [...arr],
    description: 'Starting Heap Sort — array is treated as a binary heap with root at index 0',
    codeLineHighlight: 0,
  });

  function heapify(size: number, i: number) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < size) {
      frames.push({
        type: 'compare',
        indices: [largest, left],
        arrayState: [...arr],
        description: `Compare parent arr[${largest}]=${arr[largest]} with left child arr[${left}]=${arr[left]}`,
        codeLineHighlight: 4,
      });
      if (arr[left] > arr[largest]) largest = left;
    }

    if (right < size) {
      frames.push({
        type: 'compare',
        indices: [largest, right],
        arrayState: [...arr],
        description: `Compare current largest arr[${largest}]=${arr[largest]} with right child arr[${right}]=${arr[right]}`,
        codeLineHighlight: 5,
      });
      if (arr[right] > arr[largest]) largest = right;
    }

    if (largest !== i) {
      frames.push({
        type: 'swap',
        indices: [i, largest],
        arrayState: [...arr],
        description: `Swap arr[${i}]=${arr[i]} with arr[${largest}]=${arr[largest]} to restore max-heap property`,
        codeLineHighlight: 6,
      });
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      frames.push({
        type: 'set',
        indices: [i, largest],
        arrayState: [...arr],
        description: `After swap: arr[${i}]=${arr[i]}, arr[${largest}]=${arr[largest]}`,
        codeLineHighlight: 6,
      });
      heapify(size, largest);
    }
  }

  // Build max-heap
  frames.push({
    type: 'highlight',
    indices: Array.from({ length: n }, (_, i) => i),
    arrayState: [...arr],
    description: `Phase 1: Build max-heap by heapifying from index ${Math.floor(n / 2) - 1} down to 0`,
    codeLineHighlight: 2,
  });

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    frames.push({
      type: 'highlight',
      indices: [i],
      arrayState: [...arr],
      description: `Heapify subtree rooted at index ${i} (value ${arr[i]})`,
      codeLineHighlight: 3,
    });
    heapify(n, i);
  }

  frames.push({
    type: 'highlight',
    indices: [0],
    arrayState: [...arr],
    description: `Max-heap built: arr[0]=${arr[0]} is now the largest element`,
    codeLineHighlight: 7,
  });

  // Extract elements one by one
  for (let i = n - 1; i > 0; i--) {
    frames.push({
      type: 'swap',
      indices: [0, i],
      arrayState: [...arr],
      description: `Phase 2: Swap root arr[0]=${arr[0]} with arr[${i}]=${arr[i]} — largest goes to end`,
      codeLineHighlight: 9,
    });
    [arr[0], arr[i]] = [arr[i], arr[0]];
    frames.push({
      type: 'sorted',
      indices: [i],
      arrayState: [...arr],
      description: `Position ${i} is now sorted with value ${arr[i]}`,
      codeLineHighlight: 9,
    });
    heapify(i, 0);
  }

  frames.push({
    type: 'sorted',
    indices: [0],
    arrayState: [...arr],
    description: `Position 0 is sorted with value ${arr[0]}`,
    codeLineHighlight: 10,
  });

  frames.push({
    type: 'complete',
    indices: Array.from({ length: n }, (_, i) => i),
    arrayState: [...arr],
    description: 'Heap Sort complete — array is fully sorted',
    codeLineHighlight: 10,
  });

  return frames;
}
