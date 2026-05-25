import { LinkedListAnimationFrame, LinkedListNode } from '../../types/algorithm';

/**
 * Doubly Linked List demo generator.
 *
 * Every emitted frame sets `prev` on every node:
 *   - `null` for the head
 *   - prior index for body/tail nodes
 *
 * The presence of any `prev !== undefined` switches the visualizer into
 * doubly-linked rendering (backward arrows). We never emit `undefined`.
 */
export function generateDoublyLinkedListDemo(): LinkedListAnimationFrame[] {
  const frames: LinkedListAnimationFrame[] = [];
  const nodes: LinkedListNode[] = [];

  function rewirePointers() {
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].prev = i === 0 ? null : i - 1;
      nodes[i].next = i === nodes.length - 1 ? null : i + 1;
    }
  }

  function snapshot(): LinkedListNode[] {
    // Deep copy so each frame is independent.
    return nodes.map(n => ({ ...n }));
  }

  function insertAtHead(val: number) {
    nodes.unshift({ value: val, next: null, prev: null });
    rewirePointers();
    frames.push({
      type: 'insert',
      nodes: snapshot(),
      highlightIndex: 0,
      description: `Insert ${val} at head — new node's prev = null, next = old head; old head's prev = new node`,
      codeLineHighlight: 3,
    });
  }

  function insertAtTail(val: number) {
    nodes.push({ value: val, next: null, prev: null });
    rewirePointers();
    frames.push({
      type: 'insert',
      nodes: snapshot(),
      highlightIndex: nodes.length - 1,
      description: `Insert ${val} at tail — new node's prev = old tail, next = null`,
      codeLineHighlight: 5,
    });
  }

  function insertAtPosition(val: number, pos: number) {
    const clamped = Math.max(0, Math.min(pos, nodes.length));
    // Walk forward to visualize the traversal.
    for (let i = 0; i < clamped && i < nodes.length; i++) {
      frames.push({
        type: 'traverse',
        nodes: snapshot(),
        highlightIndex: i,
        description: `Walking to position ${clamped}: visit node[${i}]=${nodes[i].value}`,
        codeLineHighlight: 7,
      });
    }
    nodes.splice(clamped, 0, { value: val, next: null, prev: null });
    rewirePointers();
    frames.push({
      type: 'insert',
      nodes: snapshot(),
      highlightIndex: clamped,
      description: `Insert ${val} at position ${clamped} — rewire prev/next of both neighbors`,
      codeLineHighlight: 8,
    });
  }

  function deleteByValue(val: number) {
    const idx = nodes.findIndex(n => n.value === val);
    if (idx === -1) {
      frames.push({
        type: 'highlight',
        nodes: snapshot(),
        highlightIndex: -1,
        description: `Delete ${val}: value not found, list unchanged`,
        codeLineHighlight: 10,
      });
      return;
    }
    // Visualize the forward search.
    for (let i = 0; i <= idx; i++) {
      frames.push({
        type: 'traverse',
        nodes: snapshot(),
        highlightIndex: i,
        description: `Searching for ${val}: visit node[${i}]=${nodes[i].value}${nodes[i].value === val ? ' — Found!' : ''}`,
        codeLineHighlight: 10,
      });
    }
    frames.push({
      type: 'highlight',
      nodes: snapshot(),
      highlightIndex: idx,
      description: `About to delete node[${idx}]=${val} — splice it out by rewiring prev.next and next.prev`,
      codeLineHighlight: 11,
    });
    nodes.splice(idx, 1);
    rewirePointers();
    frames.push({
      type: 'delete',
      nodes: snapshot(),
      highlightIndex: -1,
      description: `Deleted ${val}. Doubly-linked invariant restored on both directions.`,
      codeLineHighlight: 12,
    });
  }

  function traverseForward() {
    for (let i = 0; i < nodes.length; i++) {
      frames.push({
        type: 'traverse',
        nodes: snapshot(),
        highlightIndex: i,
        description: `Forward traversal: node[${i}] = ${nodes[i].value}`,
        codeLineHighlight: 13,
      });
    }
  }

  function traverseBackward() {
    for (let i = nodes.length - 1; i >= 0; i--) {
      frames.push({
        type: 'traverse',
        nodes: snapshot(),
        highlightIndex: i,
        description: `Backward traversal (only possible with prev pointer): node[${i}] = ${nodes[i].value}`,
        codeLineHighlight: 14,
      });
    }
  }

  // ── Demo sequence ──
  frames.push({
    type: 'highlight',
    nodes: [],
    highlightIndex: -1,
    description: 'Starting Doubly Linked List Demo',
    codeLineHighlight: 0,
  });

  insertAtTail(20);
  insertAtTail(30);
  insertAtTail(40);
  insertAtHead(10);
  insertAtPosition(25, 2); // becomes [10, 20, 25, 30, 40]
  traverseForward();
  traverseBackward();
  deleteByValue(25);
  deleteByValue(10);
  insertAtTail(50);

  frames.push({
    type: 'complete',
    nodes: nodes.map(n => ({ ...n })),
    highlightIndex: -1,
    description: 'Doubly Linked List demo complete!',
    codeLineHighlight: 15,
  });

  return frames;
}
