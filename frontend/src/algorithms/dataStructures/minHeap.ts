import { HeapAnimationFrame } from '../../types/algorithm';

/**
 * Min-Heap (priority queue) demo.
 *
 * The heap is stored in a flat array: index i has children at 2i+1 and 2i+2,
 * parent at floor((i-1)/2). We use it to demonstrate three operations:
 *   1. heapify (build heap from raw input via sift-down)
 *   2. insert  (append + sift-up)
 *   3. extract-min (swap root with last, shrink, sift-down)
 */
export function generateMinHeap(input: number[]): HeapAnimationFrame[] {
  const frames: HeapAnimationFrame[] = [];
  const heap: number[] = [...input];

  frames.push({
    type: 'highlight',
    heap: [...heap],
    highlightedIndices: [],
    description: 'Starting Min-Heap demo — input array will first be heapified, then we insert and extract',
    codeLineHighlight: 0,
  });

  // ── Phase 1: build min-heap via sift-down from n/2-1 down to 0 ──
  function siftDown(size: number, i: number) {
    while (true) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let smallest = i;

      if (left < size) {
        frames.push({
          type: 'compare-child',
          heap: [...heap],
          highlightedIndices: [smallest, left],
          description: `Compare parent heap[${smallest}]=${heap[smallest]} with left child heap[${left}]=${heap[left]}`,
          codeLineHighlight: 4,
        });
        if (heap[left] < heap[smallest]) smallest = left;
      }
      if (right < size) {
        frames.push({
          type: 'compare-child',
          heap: [...heap],
          highlightedIndices: [smallest, right],
          description: `Compare current smallest heap[${smallest}]=${heap[smallest]} with right child heap[${right}]=${heap[right]}`,
          codeLineHighlight: 5,
        });
        if (heap[right] < heap[smallest]) smallest = right;
      }
      if (smallest === i) return;

      frames.push({
        type: 'swap',
        heap: [...heap],
        highlightedIndices: [i, smallest],
        swapIndices: [i, smallest],
        description: `Swap heap[${i}]=${heap[i]} with smaller child heap[${smallest}]=${heap[smallest]} to restore min-heap property`,
        codeLineHighlight: 6,
      });
      [heap[i], heap[smallest]] = [heap[smallest], heap[i]];
      frames.push({
        type: 'heapify',
        heap: [...heap],
        highlightedIndices: [smallest],
        description: `After swap: heap[${i}]=${heap[i]}, heap[${smallest}]=${heap[smallest]}. Continue sifting down from index ${smallest}.`,
        codeLineHighlight: 6,
      });
      i = smallest;
    }
  }

  frames.push({
    type: 'highlight',
    heap: [...heap],
    highlightedIndices: heap.map((_, idx) => idx),
    description: `Phase 1: Build min-heap by sifting down from index ${Math.floor(heap.length / 2) - 1} to 0`,
    codeLineHighlight: 2,
  });

  for (let i = Math.floor(heap.length / 2) - 1; i >= 0; i--) {
    frames.push({
      type: 'heapify',
      heap: [...heap],
      highlightedIndices: [i],
      description: `Heapify subtree rooted at index ${i} (value ${heap[i]})`,
      codeLineHighlight: 3,
    });
    siftDown(heap.length, i);
  }

  frames.push({
    type: 'highlight',
    heap: [...heap],
    highlightedIndices: [0],
    description: `Min-heap built — heap[0]=${heap[0]} is now the minimum element`,
    codeLineHighlight: 7,
  });

  // ── Phase 2: insert via sift-up ──
  function siftUp(i: number) {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      frames.push({
        type: 'compare-parent',
        heap: [...heap],
        highlightedIndices: [i, parent],
        description: `Compare new node heap[${i}]=${heap[i]} with parent heap[${parent}]=${heap[parent]}`,
        codeLineHighlight: 9,
      });
      if (heap[i] >= heap[parent]) return;

      frames.push({
        type: 'swap',
        heap: [...heap],
        highlightedIndices: [i, parent],
        swapIndices: [i, parent],
        description: `Heap-order violated: swap heap[${i}]=${heap[i]} with parent heap[${parent}]=${heap[parent]}`,
        codeLineHighlight: 10,
      });
      [heap[i], heap[parent]] = [heap[parent], heap[i]];
      i = parent;
    }
  }

  const valuesToInsert = [2, 1];
  for (const v of valuesToInsert) {
    heap.push(v);
    frames.push({
      type: 'insert',
      heap: [...heap],
      highlightedIndices: [heap.length - 1],
      description: `Insert ${v}: append at index ${heap.length - 1}, then sift up to restore min-heap property`,
      codeLineHighlight: 8,
    });
    siftUp(heap.length - 1);
    frames.push({
      type: 'highlight',
      heap: [...heap],
      highlightedIndices: [0],
      description: `Insertion of ${v} done — new minimum is heap[0]=${heap[0]}`,
      codeLineHighlight: 11,
    });
  }

  // ── Phase 3: extract-min twice ──
  const settled: number[] = [];
  for (let k = 0; k < 2; k++) {
    if (heap.length === 0) break;
    const last = heap.length - 1;
    frames.push({
      type: 'extract',
      heap: [...heap],
      highlightedIndices: [0, last],
      description: `Extract-min: take root heap[0]=${heap[0]}, replace with heap[${last}]=${heap[last]}, then shrink and sift down`,
      codeLineHighlight: 12,
    });
    [heap[0], heap[last]] = [heap[last], heap[0]];
    const extracted = heap.pop()!;
    settled.unshift(extracted); // visually, extracted values land "outside"
    frames.push({
      type: 'heapify',
      heap: [...heap],
      highlightedIndices: heap.length > 0 ? [0] : [],
      settledIndices: settled.map((_, i) => heap.length + i), // off the end, kept for tint info
      description: `Removed ${extracted}. Sift the new root heap[0]=${heap[0] ?? '∅'} down to restore the heap.`,
      codeLineHighlight: 13,
    });
    if (heap.length > 0) siftDown(heap.length, 0);
  }

  frames.push({
    type: 'complete',
    heap: [...heap],
    highlightedIndices: heap.map((_, i) => i),
    description: 'Min-Heap demo complete — heap-order property holds at every parent/child pair',
    codeLineHighlight: 14,
  });

  return frames;
}
