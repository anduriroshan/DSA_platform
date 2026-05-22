import { DSAnimationFrame } from '../../types/algorithm';

export function generateStackDemo(): DSAnimationFrame[] {
  const frames: DSAnimationFrame[] = [];
  const stack: number[] = [];

  function push(val: number) {
    stack.push(val);
    frames.push({
      type: 'push',
      items: [...stack],
      highlightIndex: stack.length - 1,
      description: `Push ${val} onto the stack`,
      codeLineHighlight: 2,
    });
  }

  function pop() {
    if (stack.length === 0) {
      frames.push({
        type: 'highlight',
        items: [...stack],
        highlightIndex: -1,
        description: 'Stack is empty! Cannot pop.',
        codeLineHighlight: 5,
      });
      return;
    }
    const val = stack[stack.length - 1];
    frames.push({
      type: 'highlight',
      items: [...stack],
      highlightIndex: stack.length - 1,
      description: `About to pop ${val} from the top`,
      codeLineHighlight: 6,
    });
    stack.pop();
    frames.push({
      type: 'pop',
      items: [...stack],
      highlightIndex: stack.length - 1,
      description: `Popped ${val}. Stack: [${stack.join(', ')}]`,
      codeLineHighlight: 7,
    });
  }

  // Demo sequence
  frames.push({
    type: 'highlight',
    items: [],
    highlightIndex: -1,
    description: 'Starting Stack Demo — LIFO (Last In, First Out)',
    codeLineHighlight: 0,
  });

  push(10);
  push(20);
  push(30);
  push(40);

  frames.push({
    type: 'peek',
    items: [...stack],
    highlightIndex: stack.length - 1,
    description: `Peek: top element is ${stack[stack.length - 1]}`,
    codeLineHighlight: 9,
  });

  pop();
  pop();
  push(50);
  pop();
  pop();
  pop();

  frames.push({
    type: 'complete',
    items: [...stack],
    highlightIndex: -1,
    description: 'Stack demo complete!',
    codeLineHighlight: 10,
  });

  return frames;
}
