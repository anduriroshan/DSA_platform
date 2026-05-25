import { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { useVisualizerStore } from '../../store/useVisualizerStore';
import {
  GraphAnimationFrame,
  GraphEdge,
  GraphNode,
  GraphNodeState,
  GraphEdgeState,
} from '../../types/algorithm';

const edgeKey = (e: GraphEdge) => `${e.from}->${e.to}`;

/* ─── color/style maps ─────────────────────────────────────────── */
const NODE_FILL: Record<GraphNodeState, string> = {
  unvisited: 'var(--bg-elevated)',
  visiting:  'rgba(245, 200, 0, 0.25)',
  visited:   'rgba(0, 230, 118, 0.22)',
  frontier:  'rgba(102, 153, 255, 0.22)',
};
const NODE_STROKE: Record<GraphNodeState, string> = {
  unvisited: 'var(--accent-cyan)',
  visiting:  'var(--accent-yellow)',
  visited:   'var(--accent-green)',
  frontier:  'var(--accent-blue)',
};
const EDGE_STROKE: Record<GraphEdgeState, string> = {
  idle:       'var(--text-tertiary)',
  traversing: 'var(--accent-yellow)',
  'in-tree':  'var(--accent-purple)',
  relaxed:    'var(--accent-green)',
};
const EDGE_WIDTH: Record<GraphEdgeState, number> = {
  idle: 1.5, traversing: 3, 'in-tree': 3, relaxed: 2.5,
};

/**
 * GraphVisualizer
 *
 * Layout strategy:
 *  - If the FIRST frame's nodes all carry explicit `x`/`y`, those are
 *    treated as raw SVG coordinates and reused on every frame.
 *  - Otherwise we compute a stable deterministic circular layout based on
 *    the node ids in the first frame. Stable means nodes don't jump around
 *    when the frame changes — only colors / labels do.
 *
 * Edges respect a frame-level `directed` flag, overridden by per-edge.
 * Arrowheads are rendered for directed edges; weights are rendered when
 * `weighted` is true or any edge has a defined `weight`.
 */
export default function GraphVisualizer() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { frames, currentStep } = useVisualizerStore();

  // Build a stable layout once per "graph identity" (first frame's node list).
  const baseLayoutKey = useMemo(() => {
    const first = frames[0] as GraphAnimationFrame | undefined;
    return first?.nodes?.map((n) => n.id).join('|') ?? '';
  }, [frames]);

  useEffect(() => {
    const draw = () => {
      if (!svgRef.current || frames.length === 0) return;
      const frame = frames[currentStep] as GraphAnimationFrame;
      if (!frame || !Array.isArray(frame.nodes)) return;

      const svg = d3.select(svgRef.current);
      svg.selectAll('*').remove();

      const container = svgRef.current.parentElement;
      if (!container) return;
      const width = container.clientWidth;
      const height = Math.max(container.clientHeight - 50, 260);
      svg.attr('width', width).attr('height', height + 50);

      // Arrowhead marker (used for directed edges)
      const defs = svg.append('defs');
      (['idle', 'traversing', 'in-tree', 'relaxed'] as GraphEdgeState[]).forEach((state) => {
        defs.append('marker')
          .attr('id', `arrow-${state}`)
          .attr('viewBox', '0 -5 10 10')
          .attr('refX', 18)
          .attr('refY', 0)
          .attr('markerWidth', 6)
          .attr('markerHeight', 6)
          .attr('orient', 'auto')
          .append('path')
          .attr('d', 'M0,-5L10,0L0,5')
          .attr('fill', EDGE_STROKE[state]);
      });

      // Resolve positions for the CURRENT frame's nodes — but anchored to
      // the first-frame layout for stability.
      const padding = 50;
      const cx = width / 2;
      const cy = (height + 50) / 2;
      const radius = Math.min(width, height) / 2 - padding;

      const firstFrame = frames[0] as GraphAnimationFrame;
      const layoutNodes: GraphNode[] = firstFrame?.nodes ?? frame.nodes;
      const useFixed = layoutNodes.every((n) => typeof n.x === 'number' && typeof n.y === 'number');

      const layout = new Map<string | number, { x: number; y: number }>();
      if (useFixed) {
        // Normalize: if all coords lie in 0..1, treat as fractional.
        const xs = layoutNodes.map((n) => n.x!);
        const ys = layoutNodes.map((n) => n.y!);
        const fractional = xs.every((v) => v >= 0 && v <= 1) && ys.every((v) => v >= 0 && v <= 1);
        layoutNodes.forEach((n) => {
          const x = fractional ? padding + n.x! * (width - 2 * padding) : n.x!;
          const y = fractional ? padding + n.y! * (height - 2 * padding) : n.y!;
          layout.set(n.id, { x, y });
        });
      } else {
        const N = layoutNodes.length;
        layoutNodes.forEach((n, i) => {
          const angle = (i / Math.max(N, 1)) * Math.PI * 2 - Math.PI / 2;
          layout.set(n.id, {
            x: cx + Math.cos(angle) * radius,
            y: cy + Math.sin(angle) * radius,
          });
        });
      }

      // Fallback for nodes that appear only in later frames
      frame.nodes.forEach((n, i) => {
        if (!layout.has(n.id)) {
          const angle = (i / Math.max(frame.nodes.length, 1)) * Math.PI * 2;
          layout.set(n.id, { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius });
        }
      });

      const root = svg.append('g');

      /* ── Edges ───────────────────────────────────────────────── */
      const showWeights =
        frame.weighted === true ||
        frame.edges.some((e) => typeof e.weight === 'number');
      const frameDirected = frame.directed === true;

      frame.edges.forEach((e) => {
        const a = layout.get(e.from);
        const b = layout.get(e.to);
        if (!a || !b) return;
        const state: GraphEdgeState = frame.edgeStates?.[edgeKey(e)] ?? 'idle';
        const directed = e.directed ?? frameDirected;

        root.append('line')
          .attr('x1', a.x).attr('y1', a.y)
          .attr('x2', b.x).attr('y2', b.y)
          .attr('stroke', EDGE_STROKE[state])
          .attr('stroke-width', EDGE_WIDTH[state])
          .attr('stroke-linecap', 'round')
          .attr('marker-end', directed ? `url(#arrow-${state})` : null);

        if (showWeights && typeof e.weight === 'number') {
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2;
          const label = root.append('g').attr('transform', `translate(${mx}, ${my})`);
          const text = String(e.weight);
          const w = Math.max(18, text.length * 8 + 6);
          label.append('rect')
            .attr('x', -w / 2).attr('y', -8)
            .attr('width', w).attr('height', 16).attr('rx', 2)
            .attr('fill', 'var(--bg-darker)')
            .attr('stroke', 'var(--ink)').attr('stroke-width', 1);
          label.append('text')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'central')
            .attr('fill', 'var(--accent-cyan)')
            .attr('font-family', 'var(--font-mono)')
            .attr('font-size', 10)
            .attr('font-weight', 600)
            .text(text);
        }
      });

      /* ── Nodes ───────────────────────────────────────────────── */
      const nodeG = root.selectAll<SVGGElement, GraphNode>('.graph-node')
        .data(frame.nodes, (d) => String(d.id))
        .enter().append('g')
        .attr('class', 'graph-node')
        .attr('transform', (d) => {
          const p = layout.get(d.id)!;
          return `translate(${p.x}, ${p.y})`;
        });

      const stateOf = (d: GraphNode): GraphNodeState =>
        frame.nodeStates?.[d.id] ?? 'unvisited';

      nodeG.append('circle')
        .attr('r', 20)
        .attr('fill', (d) => NODE_FILL[stateOf(d)])
        .attr('stroke', (d) => NODE_STROKE[stateOf(d)])
        .attr('stroke-width', (d) => (stateOf(d) === 'visiting' ? 3 : 2));

      nodeG.append('text')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('fill', 'var(--text-primary)')
        .attr('font-family', 'var(--font-mono)')
        .attr('font-size', 13)
        .attr('font-weight', 600)
        .text((d) => String(d.label ?? d.id));

      // Distance badge (Dijkstra, BFS, etc.) — top-right of the node
      if (frame.distances) {
        nodeG.each(function (d) {
          const dist = frame.distances?.[d.id];
          if (dist === undefined || dist === null) return;
          const g = d3.select(this);
          const text = String(dist);
          const w = Math.max(20, text.length * 7 + 6);
          const badge = g.append('g').attr('transform', 'translate(18, -16)');
          badge.append('rect')
            .attr('x', -w / 2).attr('y', -8)
            .attr('width', w).attr('height', 14).attr('rx', 2)
            .attr('fill', 'var(--bg-darker)')
            .attr('stroke', 'var(--accent-cyan-dim)')
            .attr('stroke-width', 1);
          badge.append('text')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'central')
            .attr('fill', 'var(--accent-cyan)')
            .attr('font-family', 'var(--font-mono)')
            .attr('font-size', 9)
            .attr('font-weight', 700)
            .text(text);
        });
      }
    };

    draw();
    if (!svgRef.current?.parentElement) return;
    const ro = new ResizeObserver(() => draw());
    ro.observe(svgRef.current.parentElement);
    return () => ro.disconnect();
  }, [frames, currentStep, baseLayoutKey]);

  return <svg ref={svgRef} preserveAspectRatio="xMidYMid meet" />;
}
