import { GraphAnimationFrame } from '../../types/algorithm';
import { SAMPLE_GRAPH_NODES, SAMPLE_GRAPH_EDGES } from './graphBFS';

/**
 * Depth-First Search on the same sample graph used by BFS, so visual
 * comparison of frontier shape vs. recursion stack is meaningful.
 *
 * For an undirected graph we use the convention:
 *   - 'visiting' = currently on the recursion stack (gray area)
 *   - 'visited'  = fully processed (post-order)
 *   - tree edges = edges we recursed across
 */
function buildAdjacency(): Record<string, string[]> {
  const adj: Record<string, string[]> = {};
  for (const n of SAMPLE_GRAPH_NODES) adj[n.id as string] = [];
  for (const e of SAMPLE_GRAPH_EDGES) {
    adj[e.from as string].push(e.to as string);
    adj[e.to as string].push(e.from as string);
  }
  return adj;
}

function edgeKey(a: string, b: string): string {
  return `${a}->${b}`;
}

export function generateGraphDFS(_input?: number[]): GraphAnimationFrame[] {
  const frames: GraphAnimationFrame[] = [];
  const adj = buildAdjacency();
  const source = 'A';

  const nodeStates: Record<string, 'unvisited' | 'visiting' | 'visited' | 'frontier'> = {};
  const edgeStates: Record<string, 'idle' | 'traversing' | 'in-tree' | 'relaxed'> = {};
  const distances: Record<string, number | string> = {}; // discovery order
  let discoveryCounter = 0;

  for (const n of SAMPLE_GRAPH_NODES) {
    nodeStates[n.id as string] = 'unvisited';
    distances[n.id as string] = '∞';
  }

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

  emit('highlight', `Starting DFS from source ${source} — discovery order shown in distance labels`, 0);

  function dfs(u: string, parent: string | null) {
    nodeStates[u] = 'visiting';
    distances[u] = discoveryCounter++;
    emit(
      'visit',
      `Enter ${u} (discovery #${distances[u]}) — push onto recursion stack${parent ? `, came from ${parent}` : ''}`,
      2,
    );

    for (const v of adj[u]) {
      if (v === parent) continue; // skip the edge we came in on (undirected)
      const fwd = edgeKey(u, v);
      const rev = edgeKey(v, u);
      edgeStates[fwd] = 'traversing';
      edgeStates[rev] = 'traversing';
      emit('process-edge', `Examine edge ${u}—${v}`, 3);

      if (nodeStates[v] === 'unvisited') {
        edgeStates[fwd] = 'in-tree';
        edgeStates[rev] = 'in-tree';
        emit('discover', `${v} is unvisited — recurse into ${v}, marking edge ${u}—${v} as a DFS-tree edge`, 4);
        dfs(v, u);
        emit('visit', `Returned to ${u} from ${v} (backtrack)`, 6);
      } else {
        edgeStates[fwd] = 'idle';
        edgeStates[rev] = 'idle';
        emit('process-edge', `${v} already discovered — back edge, skip recursion`, 5);
      }
    }

    nodeStates[u] = 'visited';
    emit('visit', `Finish ${u} — pop from recursion stack, mark as fully visited`, 7);
  }

  dfs(source, null);

  emit(
    'complete',
    `DFS complete — discovery order: ` +
      SAMPLE_GRAPH_NODES.map(n => `${n.id}=${distances[n.id as string]}`).join(', '),
    8,
  );

  return frames;
}
