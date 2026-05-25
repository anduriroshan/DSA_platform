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
  /**
   * Index of the next node, or `null` to indicate the tail.
   * Currently informational (the visualizer infers order from the array
   * position) but kept for parity with backend data.
   */
  next?: number | null;
  /**
   * Optional pointer-back index for doubly linked lists.
   * - `undefined`  → singly linked (no backward arrow rendered)
   * - `null`       → head of a doubly linked list (no prev)
   * - `number`     → index of the previous node
   *
   * Backward arrows render whenever ANY node in the frame has `prev` defined,
   * preserving full backward-compatibility for existing singly-linked generators.
   */
  prev?: number | null;
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

/* ───────────────────────────────────────────────────────────────
   Heap
   ─────────────────────────────────────────────────────────────── */

export interface HeapAnimationFrame {
  type:
    | 'heapify'
    | 'swap'
    | 'insert'
    | 'extract'
    | 'compare-parent'
    | 'compare-child'
    | 'highlight'
    | 'complete';
  /** Array-backed heap representation. Index i has children at 2i+1 and 2i+2. */
  heap: number[];
  /** Indices visually emphasized this frame (e.g., parent + child being compared). */
  highlightedIndices: number[];
  /** Indices that have already been "settled" (e.g., extracted/sorted region). */
  settledIndices?: number[];
  /** Pair of indices currently being swapped, if applicable. */
  swapIndices?: [number, number];
  description: string;
  codeLineHighlight: number;
}

/* ───────────────────────────────────────────────────────────────
   Graph
   ─────────────────────────────────────────────────────────────── */

export interface GraphNode {
  /** Stable identifier — strings or numbers both accepted. */
  id: string | number;
  /** Optional display label; falls back to `id`. */
  label?: string | number;
  /**
   * Optional fixed coordinates (0..1 normalized OR raw SVG units).
   * If omitted, the visualizer falls back to a deterministic circular layout.
   */
  x?: number;
  y?: number;
}

export interface GraphEdge {
  from: string | number;
  to: string | number;
  weight?: number;
  /**
   * Whether this specific edge is directed. Falls back to the frame-level
   * `directed` flag when undefined.
   */
  directed?: boolean;
}

export type GraphNodeState = 'unvisited' | 'visiting' | 'visited' | 'frontier';
export type GraphEdgeState = 'idle' | 'traversing' | 'in-tree' | 'relaxed';

export interface GraphAnimationFrame {
  type:
    | 'visit'
    | 'discover'
    | 'process-edge'
    | 'relax'
    | 'mark-shortest'
    | 'add-to-mst'
    | 'highlight'
    | 'complete';
  nodes: GraphNode[];
  edges: GraphEdge[];
  /** Default direction flag — individual edges can override via `edge.directed`. */
  directed?: boolean;
  /** Whether weight labels should be rendered. */
  weighted?: boolean;
  /** Per-node visual state keyed by node id. */
  nodeStates?: Record<string | number, GraphNodeState>;
  /** Per-edge state. Key format: `"${from}->${to}"`. Undefined → 'idle'. */
  edgeStates?: Record<string, GraphEdgeState>;
  /** Optional distance/cost labels keyed by node id (Dijkstra, BFS-level, etc.). */
  distances?: Record<string | number, number | string>;
  description: string;
  codeLineHighlight: number;
}

/* ───────────────────────────────────────────────────────────────
   DP Table
   ─────────────────────────────────────────────────────────────── */

export interface DPTableAnimationFrame {
  type:
    | 'compute-cell'
    | 'read-cell'
    | 'final-answer'
    | 'trace-back'
    | 'highlight'
    | 'complete';
  /** Full 2D grid state. Use `null` for "not yet computed" cells. */
  table: (number | string | null)[][];
  /** Cell currently being written. */
  computeCell?: [number, number];
  /** Cells whose values are being READ to compute the current cell. */
  readCells?: [number, number][];
  /** Cells on the traced-back optimal path. */
  tracePath?: [number, number][];
  /** Column headers — e.g., characters of string A. */
  colHeaders?: (string | number)[];
  /** Row headers — e.g., characters of string B. */
  rowHeaders?: (string | number)[];
  /** Optional title for the column-header axis (e.g., "A"). */
  colAxisLabel?: string;
  /** Optional title for the row-header axis (e.g., "B"). */
  rowAxisLabel?: string;
  description: string;
  codeLineHighlight: number;
}

export type VisualizerType =
  | 'array'
  | 'tree'
  | 'stack-queue'
  | 'linked-list'
  | 'heap'
  | 'graph'
  | 'dp-table';

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
  generate: (
    input: number[],
    target?: number
  ) =>
    | AnimationFrame[]
    | TreeAnimationFrame[]
    | DSAnimationFrame[]
    | LinkedListAnimationFrame[]
    | HeapAnimationFrame[]
    | GraphAnimationFrame[]
    | DPTableAnimationFrame[];
}
