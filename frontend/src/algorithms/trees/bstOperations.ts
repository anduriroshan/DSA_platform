import { TreeAnimationFrame, TreeNode } from '../../types/algorithm';

function cloneTree(node: TreeNode | null): TreeNode | null {
  if (!node) return null;
  return {
    value: node.value,
    left: cloneTree(node.left || null) || undefined,
    right: cloneTree(node.right || null) || undefined,
  };
}

function insertBST(root: TreeNode | null, val: number): TreeNode {
  if (!root) return { value: val };
  if (val < root.value) {
    root.left = insertBST(root.left || null, val);
  } else if (val > root.value) {
    root.right = insertBST(root.right || null, val);
  }
  return root;
}

export function generateBSTInsert(values: number[]): TreeAnimationFrame[] {
  const frames: TreeAnimationFrame[] = [];
  let root: TreeNode | null = null;

  frames.push({
    type: 'insert',
    tree: null,
    highlightedNodes: [],
    visitedNodes: [],
    description: `Starting BST Insert with values: [${values.join(', ')}]`,
    codeLineHighlight: 0,
  });

  for (const val of values) {
    const path: number[] = [];
    // Trace the path
    let current = root;
    while (current) {
      path.push(current.value);
      if (val < current.value) {
        current = current.left || null;
      } else if (val > current.value) {
        current = current.right || null;
      } else {
        break;
      }
    }

    if (path.length > 0) {
      frames.push({
        type: 'compare',
        tree: cloneTree(root),
        highlightedNodes: path,
        visitedNodes: [],
        description: `Inserting ${val}: traverse path [${path.join(' → ')}]`,
        codeLineHighlight: 2,
      });
    }

    root = insertBST(root, val);

    frames.push({
      type: 'insert',
      tree: cloneTree(root),
      highlightedNodes: [val],
      visitedNodes: [],
      description: `Inserted ${val} into the BST`,
      codeLineHighlight: 3,
    });
  }

  frames.push({
    type: 'complete',
    tree: cloneTree(root),
    highlightedNodes: [],
    visitedNodes: values,
    description: 'BST construction complete!',
    codeLineHighlight: 5,
  });

  return frames;
}
