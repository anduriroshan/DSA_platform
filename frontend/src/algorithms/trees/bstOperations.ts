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

function buildBSTFromValues(values: number[]): TreeNode | null {
  let root: TreeNode | null = null;
  for (const v of values) {
    root = insertBST(root, v);
  }
  return root;
}

export function generateBSTSearch(values: number[], target: number = 0): TreeAnimationFrame[] {
  const root = buildBSTFromValues(values);
  const frames: TreeAnimationFrame[] = [];

  frames.push({
    type: 'search',
    tree: cloneTree(root),
    highlightedNodes: [],
    visitedNodes: [],
    description: `Starting BST Search for target = ${target}`,
    codeLineHighlight: 0,
  });

  const visited: number[] = [];
  let current = root;

  while (current) {
    frames.push({
      type: 'compare',
      tree: cloneTree(root),
      highlightedNodes: [current.value],
      visitedNodes: [...visited],
      description: `Compare ${target} with node ${current.value}`,
      codeLineHighlight: 2,
    });

    if (target === current.value) {
      visited.push(current.value);
      frames.push({
        type: 'found',
        tree: cloneTree(root),
        highlightedNodes: [current.value],
        visitedNodes: [...visited],
        description: `Found ${target} at node ${current.value}!`,
        codeLineHighlight: 3,
      });
      return frames;
    }

    visited.push(current.value);

    if (target < current.value) {
      frames.push({
        type: 'visit',
        tree: cloneTree(root),
        highlightedNodes: [current.value],
        visitedNodes: [...visited],
        description: `${target} < ${current.value}, go left`,
        codeLineHighlight: 5,
      });
      current = current.left || null;
    } else {
      frames.push({
        type: 'visit',
        tree: cloneTree(root),
        highlightedNodes: [current.value],
        visitedNodes: [...visited],
        description: `${target} > ${current.value}, go right`,
        codeLineHighlight: 7,
      });
      current = current.right || null;
    }
  }

  frames.push({
    type: 'not-found',
    tree: cloneTree(root),
    highlightedNodes: [],
    visitedNodes: [...visited],
    description: `${target} not found in the BST`,
    codeLineHighlight: 9,
  });

  return frames;
}

function findMinNode(node: TreeNode): TreeNode {
  let current = node;
  while (current.left) current = current.left;
  return current;
}

function deleteBST(root: TreeNode | null, val: number): TreeNode | null {
  if (!root) return null;
  if (val < root.value) {
    root.left = deleteBST(root.left || null, val) || undefined;
  } else if (val > root.value) {
    root.right = deleteBST(root.right || null, val) || undefined;
  } else {
    if (!root.left && !root.right) return null;
    if (!root.left) return root.right || null;
    if (!root.right) return root.left || null;
    const successor = findMinNode(root.right);
    root.value = successor.value;
    root.right = deleteBST(root.right, successor.value) || undefined;
  }
  return root;
}

export function generateBSTDelete(values: number[], target: number = 0): TreeAnimationFrame[] {
  let root = buildBSTFromValues(values);
  const frames: TreeAnimationFrame[] = [];

  frames.push({
    type: 'search',
    tree: cloneTree(root),
    highlightedNodes: [],
    visitedNodes: [],
    description: `Starting BST Delete for value = ${target}`,
    codeLineHighlight: 0,
  });

  // Trace the search path to the target
  const path: number[] = [];
  let current = root;
  while (current && current.value !== target) {
    path.push(current.value);
    frames.push({
      type: 'compare',
      tree: cloneTree(root),
      highlightedNodes: [current.value],
      visitedNodes: [...path],
      description: `Compare ${target} with ${current.value}, go ${target < current.value ? 'left' : 'right'}`,
      codeLineHighlight: 2,
    });
    current = target < current.value ? (current.left || null) : (current.right || null);
  }

  if (!current) {
    frames.push({
      type: 'not-found',
      tree: cloneTree(root),
      highlightedNodes: [],
      visitedNodes: [...path],
      description: `${target} not found — nothing to delete`,
      codeLineHighlight: 10,
    });
    return frames;
  }

  // Found the node
  frames.push({
    type: 'found',
    tree: cloneTree(root),
    highlightedNodes: [current.value],
    visitedNodes: [...path],
    description: `Found node ${target} — preparing to delete`,
    codeLineHighlight: 4,
  });

  const hasLeft = !!current.left;
  const hasRight = !!current.right;

  if (!hasLeft && !hasRight) {
    frames.push({
      type: 'compare',
      tree: cloneTree(root),
      highlightedNodes: [current.value],
      visitedNodes: [...path],
      description: `Case 1 (leaf): node ${target} has no children, remove directly`,
      codeLineHighlight: 5,
    });
  } else if (!hasLeft || !hasRight) {
    const child = (current.left || current.right)!.value;
    frames.push({
      type: 'compare',
      tree: cloneTree(root),
      highlightedNodes: [current.value, child],
      visitedNodes: [...path],
      description: `Case 2 (one child): replace node ${target} with its child ${child}`,
      codeLineHighlight: 6,
    });
  } else {
    const succ = findMinNode(current.right!);
    frames.push({
      type: 'compare',
      tree: cloneTree(root),
      highlightedNodes: [current.value, succ.value],
      visitedNodes: [...path],
      description: `Case 3 (two children): find in-order successor ${succ.value} (smallest in right subtree)`,
      codeLineHighlight: 7,
    });
    frames.push({
      type: 'visit',
      tree: cloneTree(root),
      highlightedNodes: [current.value, succ.value],
      visitedNodes: [...path],
      description: `Copy successor value ${succ.value} into node, then delete ${succ.value} from right subtree`,
      codeLineHighlight: 8,
    });
  }

  root = deleteBST(root, target);

  frames.push({
    type: 'complete',
    tree: cloneTree(root),
    highlightedNodes: [],
    visitedNodes: [...path],
    description: `Deleted ${target} — BST property maintained`,
    codeLineHighlight: 11,
  });

  return frames;
}
