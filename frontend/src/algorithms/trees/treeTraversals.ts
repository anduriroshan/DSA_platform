import { TreeAnimationFrame, TreeNode } from '../../types/algorithm';

function cloneTree(node: TreeNode | null): TreeNode | null {
  if (!node) return null;
  return {
    value: node.value,
    left: cloneTree(node.left || null) || undefined,
    right: cloneTree(node.right || null) || undefined,
  };
}

function buildBST(values: number[]): TreeNode | null {
  let root: TreeNode | null = null;
  for (const val of values) {
    root = insertNode(root, val);
  }
  return root;
}

function insertNode(root: TreeNode | null, val: number): TreeNode {
  if (!root) return { value: val };
  if (val < root.value) root.left = insertNode(root.left || null, val);
  else if (val > root.value) root.right = insertNode(root.right || null, val);
  return root;
}

export function generateInorderTraversal(values: number[]): TreeAnimationFrame[] {
  const tree = buildBST(values);
  const frames: TreeAnimationFrame[] = [];
  const visited: number[] = [];

  frames.push({
    type: 'visit',
    tree: cloneTree(tree),
    highlightedNodes: [],
    visitedNodes: [],
    description: 'Starting Inorder Traversal (Left → Root → Right)',
    codeLineHighlight: 0,
  });

  function inorder(node: TreeNode | null) {
    if (!node) return;

    frames.push({
      type: 'compare',
      tree: cloneTree(tree),
      highlightedNodes: [node.value],
      visitedNodes: [...visited],
      description: `Go to left subtree of ${node.value}`,
      codeLineHighlight: 2,
    });

    inorder(node.left || null);

    visited.push(node.value);
    frames.push({
      type: 'visit',
      tree: cloneTree(tree),
      highlightedNodes: [node.value],
      visitedNodes: [...visited],
      description: `Visit node ${node.value}. Order so far: [${visited.join(', ')}]`,
      codeLineHighlight: 3,
    });

    inorder(node.right || null);
  }

  inorder(tree);

  frames.push({
    type: 'complete',
    tree: cloneTree(tree),
    highlightedNodes: [],
    visitedNodes: [...visited],
    description: `Inorder traversal complete: [${visited.join(', ')}]`,
    codeLineHighlight: 5,
  });

  return frames;
}

export function generatePreorderTraversal(values: number[]): TreeAnimationFrame[] {
  const tree = buildBST(values);
  const frames: TreeAnimationFrame[] = [];
  const visited: number[] = [];

  frames.push({
    type: 'visit',
    tree: cloneTree(tree),
    highlightedNodes: [],
    visitedNodes: [],
    description: 'Starting Preorder Traversal (Root → Left → Right)',
    codeLineHighlight: 0,
  });

  function preorder(node: TreeNode | null) {
    if (!node) return;

    visited.push(node.value);
    frames.push({
      type: 'visit',
      tree: cloneTree(tree),
      highlightedNodes: [node.value],
      visitedNodes: [...visited],
      description: `Visit node ${node.value}. Order so far: [${visited.join(', ')}]`,
      codeLineHighlight: 2,
    });

    preorder(node.left || null);
    preorder(node.right || null);
  }

  preorder(tree);

  frames.push({
    type: 'complete',
    tree: cloneTree(tree),
    highlightedNodes: [],
    visitedNodes: [...visited],
    description: `Preorder traversal complete: [${visited.join(', ')}]`,
    codeLineHighlight: 4,
  });

  return frames;
}
