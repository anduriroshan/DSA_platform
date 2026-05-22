import { DSAnimationFrame } from '../../types/algorithm';

export function generateQueueDemo(): DSAnimationFrame[] {
  const frames: DSAnimationFrame[] = [];
  const queue: number[] = [];

  function enqueue(val: number) {
    queue.push(val);
    frames.push({
      type: 'enqueue',
      items: [...queue],
      highlightIndex: queue.length - 1,
      description: `Enqueue ${val} at the rear`,
      codeLineHighlight: 2,
    });
  }

  function dequeue() {
    if (queue.length === 0) {
      frames.push({
        type: 'highlight',
        items: [...queue],
        highlightIndex: -1,
        description: 'Queue is empty! Cannot dequeue.',
        codeLineHighlight: 5,
      });
      return;
    }
    const val = queue[0];
    frames.push({
      type: 'highlight',
      items: [...queue],
      highlightIndex: 0,
      description: `About to dequeue ${val} from the front`,
      codeLineHighlight: 6,
    });
    queue.shift();
    frames.push({
      type: 'dequeue',
      items: [...queue],
      highlightIndex: 0,
      description: `Dequeued ${val}. Queue: [${queue.join(', ')}]`,
      codeLineHighlight: 7,
    });
  }

  // Demo sequence
  frames.push({
    type: 'highlight',
    items: [],
    highlightIndex: -1,
    description: 'Starting Queue Demo — FIFO (First In, First Out)',
    codeLineHighlight: 0,
  });

  enqueue(10);
  enqueue(20);
  enqueue(30);
  enqueue(40);

  frames.push({
    type: 'peek',
    items: [...queue],
    highlightIndex: 0,
    description: `Front element is ${queue[0]}`,
    codeLineHighlight: 9,
  });

  dequeue();
  dequeue();
  enqueue(50);
  enqueue(60);
  dequeue();

  frames.push({
    type: 'complete',
    items: [...queue],
    highlightIndex: -1,
    description: 'Queue demo complete!',
    codeLineHighlight: 10,
  });

  return frames;
}
