import { LinkedListAnimationFrame, LinkedListNode } from '../../types/algorithm';

export function generateLinkedListDemo(): LinkedListAnimationFrame[] {
  const frames: LinkedListAnimationFrame[] = [];
  let nodes: LinkedListNode[] = [];

  function insertAtEnd(val: number) {
    nodes.push({ value: val, next: null, highlighted: false });
    // Update next pointers
    for (let i = 0; i < nodes.length - 1; i++) {
      nodes[i].next = i + 1;
    }
    nodes[nodes.length - 1].next = null;

    frames.push({
      type: 'insert',
      nodes: JSON.parse(JSON.stringify(nodes)),
      highlightIndex: nodes.length - 1,
      description: `Insert ${val} at the end`,
      codeLineHighlight: 3,
    });
  }

  function deleteNode(val: number) {
    const idx = nodes.findIndex(n => n.value === val);
    if (idx === -1) return;

    // Traverse to find
    for (let i = 0; i <= idx; i++) {
      frames.push({
        type: 'traverse',
        nodes: JSON.parse(JSON.stringify(nodes)),
        highlightIndex: i,
        description: `Traverse: visiting node with value ${nodes[i].value}${nodes[i].value === val ? ' — Found!' : ''}`,
        codeLineHighlight: 6,
      });
    }

    frames.push({
      type: 'highlight',
      nodes: JSON.parse(JSON.stringify(nodes)),
      highlightIndex: idx,
      description: `About to delete node with value ${val}`,
      codeLineHighlight: 7,
    });

    nodes.splice(idx, 1);
    // Update next pointers
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].next = i < nodes.length - 1 ? i + 1 : null;
    }

    frames.push({
      type: 'delete',
      nodes: JSON.parse(JSON.stringify(nodes)),
      highlightIndex: -1,
      description: `Deleted node ${val}. Updated pointers.`,
      codeLineHighlight: 8,
    });
  }

  // Demo sequence
  frames.push({
    type: 'highlight',
    nodes: [],
    highlightIndex: -1,
    description: 'Starting Linked List Demo',
    codeLineHighlight: 0,
  });

  insertAtEnd(10);
  insertAtEnd(20);
  insertAtEnd(30);
  insertAtEnd(40);
  insertAtEnd(50);

  // Traverse all
  for (let i = 0; i < nodes.length; i++) {
    frames.push({
      type: 'traverse',
      nodes: JSON.parse(JSON.stringify(nodes)),
      highlightIndex: i,
      description: `Traverse: node[${i}] = ${nodes[i].value}`,
      codeLineHighlight: 10,
    });
  }

  deleteNode(30);
  deleteNode(10);
  insertAtEnd(60);

  frames.push({
    type: 'complete',
    nodes: JSON.parse(JSON.stringify(nodes)),
    highlightIndex: -1,
    description: 'Linked List demo complete!',
    codeLineHighlight: 11,
  });

  return frames;
}
