import { GraphAnimationFrame, GraphNode, GraphEdge } from '../../types/algorithm';

/**
 * Shared sample graph for both BFS and DFS so the two algorithms can be
 * compared on identical topology.
 *
 * Layout uses normalized 0..1 coordinates so the visualizer scales it
 * to whatever SVG viewport size it picks.
 *
 *           A(0)
 *          /    \
 *        B(1)   C(2)
 *        / \     \
 *      D(3) E(4)  F(5)
 *            \   /
 *             G(6)
 *               \
 *               H(7)
 */
export const SAMPLE_GRAPH_NODES: GraphNode[] = [
  { id: 'A', label: 'A', x: 0.5,  y: 0.08 },
  { id: 'B', label: 'B', x: 0.25, y: 0.30 },
  { id: 'C', label: 'C', x: 0.75, y: 0.30 },
  { id: 'D', label: 'D', x: 0.10, y: 0.55 },
  { id: 'E', label: 'E', x: 0.38, y: 0.55 },
  { id: 'F', label: 'F', x: 0.75, y: 0.55 },
  { id: 'G', label: 'G', x: 0.55, y: 0.78 },
  { id: 'H', label: 'H', x: 0.80, y: 0.92 },
];

// Undirected adjacency expressed as a list of edges (single direction; visualizer
// treats them undirected because the frame `directed: false`).
export const SAMPLE_GRAPH_EDGES: GraphEdge[] = [
  { from: 'A', to: 'B' },
  { from: 'A', to: 'C' },
  { from: 'B', to: 'D' },
  { from: 'B', to: 'E' },
  { from: 'C', to: 'F' },
  { from: 'E', to: 'G' },
  { from: 'F', to: 'G' },
  { from: 'G', to: 'H' },
];

/** Adjacency map derived from the undirected edge list. */
function buildAdjacency(): Record<string, string[]> {
  const adj: Record<string, string[]> = {};
  for (const n of SAMPLE_GRAPH_NODES) adj[n.id as string] = [];
  for (const e of SAMPLE_GRAPH_EDGES) {
    adj[e.from as string].push(e.to as string);
    adj[e.to as string].push(e.from as string);
  }
  return adj;
}

/** Key edges as `from->to` (and reverse since undirected). */
function edgeKey(a: string, b: string): string {
  return `${a}->${b}`;
}

export function generateGraphBFS(_input?: number[]): GraphAnimationFrame[] {
  const frames: GraphAnimationFrame[] = [];
  const adj = buildAdjacency();
  const source = 'A';

  // State containers
  const nodeStates: Record<string, 'unvisited' | 'visiting' | 'visited' | 'frontier'> = {};
  const edgeStates: Record<string, 'idle' | 'traversing' | 'in-tree' | 'relaxed'> = {};
  const distances: Record<string, number | string> = {};
  for (const n of SAMPLE_GRAPH_NODES) {
    nodeStates[n.id as string] = 'unvisited';
    distances[n.id as string] = '∞';
  }

  // Helper: emit a frame with a deep copy of mutable state.
  function emit(
    type: GraphAnimationFrame['type'],
    description: string,
    codeLineHighlight: number,
  ) {
    frames.push({
      type,
      nodes: SAMPLE_GRAPH_NODES,
      edges: SAMPLE_GRAPH_EDGES,
      directed: false,
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
      distances: { ...distances },
      description,
      codeLineHighlight,
    });
  }

  // Initial frame.
  emit('highlight', `Starting BFS from source ${source}`, 0);

  // ── Algorithm ──
  const queue: string[] = [source];
  distances[source] = 0;
  nodeStates[source] = 'frontier';
  emit('discover', `Enqueue source ${source}, set distance[${source}]=0`, 2);

  while (queue.length > 0) {
    const u = queue.shift()!;
    nodeStates[u] = 'visiting';
    emit('visit', `Dequeue ${u} (distance=${distances[u]}) — mark as visiting`, 4);

    for (const v of adj[u]) {
      // Show the edge being inspected.
      const fwd = edgeKey(u, v);
      const rev = edgeKey(v, u);
      edgeStates[fwd] = 'traversing';
      edgeStates[rev] = 'traversing';
      emit('process-edge', `Examine edge ${u}—${v}`, 5);

      if (nodeStates[v] === 'unvisited') {
        distances[v] = (distances[u] as number) + 1;
        nodeStates[v] = 'frontier';
        edgeStates[fwd] = 'in-tree';
        edgeStates[rev] = 'in-tree';
        queue.push(v);
        emit(
          'discover',
          `${v} is unvisited — enqueue, set distance[${v}]=${distances[v]}, mark edge ${u}—${v} as BFS-tree edge`,
          6,
        );
      } else {
        edgeStates[fwd] = 'idle';
        edgeStates[rev] = 'idle';
        emit('process-edge', `${v} already discovered — skip`, 7);
      }
    }

    nodeStates[u] = 'visited';
    emit('visit', `Done processing ${u} — mark as visited (final distance ${distances[u]})`, 8);
  }

  emit('complete', `BFS complete — distances from ${source}: ` +
    SAMPLE_GRAPH_NODES.map(n => `${n.id}=${distances[n.id as string]}`).join(', '), 9);

  return frames;
}
