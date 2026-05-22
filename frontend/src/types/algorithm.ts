export interface AnimationFrame {
  type: 'compare' | 'swap' | 'highlight' | 'set' | 'sorted' | 'pivot' | 'partition' | 'merge' | 'found' | 'not-found' | 'search' | 'complete' | 'push' | 'pop' | 'enqueue' | 'dequeue' | 'insert' | 'delete' | 'visit' | 'min';
  indices: number[];
  values?: number[];
  arrayState: number[];
  description: string;
  codeLineHighlight: number;
}

export interface TreeNode {
  value: number;
  left?: TreeNode;
  right?: TreeNode;
  x?: number;
  y?: number;
  highlighted?: boolean;
}

export interface LinkedListNode {
  value: number;
  next?: number | null;
  highlighted?: boolean;
}

export interface TreeAnimationFrame {
  type: 'insert' | 'search' | 'visit' | 'found' | 'not-found' | 'compare' | 'complete';
  tree: TreeNode | null;
  highlightedNodes: number[];
  visitedNodes: number[];
  description: string;
  codeLineHighlight: number;
}

export interface DSAnimationFrame {
  type: 'push' | 'pop' | 'enqueue' | 'dequeue' | 'peek' | 'insert' | 'delete' | 'traverse' | 'highlight' | 'complete';
  items: number[];
  highlightIndex: number;
  description: string;
  codeLineHighlight: number;
}

export interface LinkedListAnimationFrame {
  type: 'insert' | 'delete' | 'traverse' | 'highlight' | 'found' | 'complete';
  nodes: LinkedListNode[];
  highlightIndex: number;
  description: string;
  codeLineHighlight: number;
}

export type VisualizerType = 'array' | 'tree' | 'stack-queue' | 'linked-list';

export interface AlgorithmConfig {
  slug: string;
  name: string;
  category: string;
  visualizerType: VisualizerType;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  difficulty: 'easy' | 'medium' | 'hard';
  defaultInput: number[];
  searchTarget?: number;
  pseudocode: string[];
  generate: (input: number[], target?: number) => AnimationFrame[] | TreeAnimationFrame[] | DSAnimationFrame[] | LinkedListAnimationFrame[];
}
