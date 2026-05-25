import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useVisualizerStore } from '../../store/useVisualizerStore';
import { HeapAnimationFrame } from '../../types/algorithm';

/**
 * Heap as a binary tree.
 * Index i ⇒ children at 2i+1 and 2i+2.
 * The tree is rendered top-down. Each node carries a small badge with its
 * array index so the user can map between heap and array forms at a glance.
 *
 * Frame types it reacts to:
 *   heapify          → emphasize the subtree rooted at highlightedIndices[0]
 *   swap             → animate two indices in swapIndices
 *   insert / extract → highlight new/removed node
 *   compare-parent / compare-child → highlight the comparison pair
 *   complete         → all nodes shaded as "settled"
 */
export default function HeapVisualizer() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { frames, currentStep } = useVisualizerStore();

  useEffect(() => {
    const draw = () => {
      if (!svgRef.current || frames.length === 0) return;
      const frame = frames[currentStep] as HeapAnimationFrame;
      if (!frame || !Array.isArray(frame.heap)) return;

      const svg = d3.select(svgRef.current);
      svg.selectAll('*').remove();

      const container = svgRef.current.parentElement;
      if (!container) return;

      const width = container.clientWidth;
      const height = Math.max(container.clientHeight - 50, 220);
      svg.attr('width', width).attr('height', height + 50);

      const heap = frame.heap;
      if (heap.length === 0) {
        svg.append('text')
          .attr('x', width / 2).attr('y', height / 2)
          .attr('text-anchor', 'middle')
          .attr('fill', 'var(--ink-muted)')
          .attr('font-family', 'var(--font-body)')
          .attr('font-size', 13)
          .attr('font-style', 'italic')
          .text('Heap is empty');
        return;
      }

      // Compute (x, y) per index using a binary-tree level layout.
      const depth = Math.floor(Math.log2(heap.length)) + 1;
      const levelHeight = (height - 80) / Math.max(depth, 1);
      const positions: { x: number; y: number }[] = [];
      for (let i = 0; i < heap.length; i++) {
        const level = Math.floor(Math.log2(i + 1));
        const levelStart = (1 << level) - 1; // first index at this level
        const positionInLevel = i - levelStart;
        const nodesAtLevel = 1 << level;
        const slotWidth = width / (nodesAtLevel + 1);
        const x = slotWidth * (positionInLevel + 1);
        const y = 40 + level * levelHeight + levelHeight / 2;
        positions.push({ x, y });
      }

      const highlighted = new Set(frame.highlightedIndices || []);
      const settled = new Set(frame.settledIndices || []);
      const swapPair = frame.swapIndices ? new Set(frame.swapIndices) : new Set<number>();

      const g = svg.append('g');

      // Edges (parent → child)
      for (let i = 0; i < heap.length; i++) {
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        for (const child of [left, right]) {
          if (child >= heap.length) continue;
          const inSwap = swapPair.has(i) && swapPair.has(child);
          const compareEdge =
            (frame.type === 'compare-parent' || frame.type === 'compare-child') &&
            highlighted.has(i) && highlighted.has(child);

          g.append('line')
            .attr('x1', positions[i].x)
            .attr('y1', positions[i].y)
            .attr('x2', positions[child].x)
            .attr('y2', positions[child].y)
            .attr('stroke',
              inSwap        ? 'var(--accent-coral)' :
              compareEdge   ? 'var(--accent-yellow)' :
                              'var(--text-tertiary)'
            )
            .attr('stroke-width', inSwap || compareEdge ? 2.5 : 1.5)
            .attr('stroke-dasharray', inSwap ? '6 4' : null);
        }
      }

      // Nodes
      const nodeG = g.selectAll<SVGGElement, number>('.heap-node')
        .data(heap)
        .enter()
        .append('g')
        .attr('class', 'heap-node')
        .attr('transform', (_d, i) => `translate(${positions[i].x}, ${positions[i].y})`);

      const fillFor = (i: number): string => {
        if (swapPair.has(i))            return 'rgba(255, 107, 107, 0.22)';
        if (settled.has(i))             return 'rgba(0, 230, 118, 0.20)';
        if (highlighted.has(i))         return 'rgba(245, 200, 0, 0.22)';
        return 'var(--bg-elevated)';
      };
      const strokeFor = (i: number): string => {
        if (swapPair.has(i))            return 'var(--accent-coral)';
        if (settled.has(i))             return 'var(--accent-green)';
        if (highlighted.has(i))         return 'var(--accent-yellow)';
        return 'var(--accent-cyan)';
      };

      nodeG.append('circle')
        .attr('r', 22)
        .attr('fill', (_d, i) => fillFor(i))
        .attr('stroke', (_d, i) => strokeFor(i))
        .attr('stroke-width', (_d, i) => (highlighted.has(i) || swapPair.has(i) ? 3 : 2));

      // Value label
      nodeG.append('text')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('fill', 'var(--text-primary)')
        .attr('font-family', 'var(--font-mono)')
        .attr('font-size', 14)
        .attr('font-weight', 600)
        .text((d) => d);

      // Index badge (small square below-right of the node circle)
      const badge = nodeG.append('g')
        .attr('transform', 'translate(18, 18)');
      badge.append('rect')
        .attr('x', -10).attr('y', -8)
        .attr('width', 22).attr('height', 14)
        .attr('rx', 2)
        .attr('fill', 'var(--bg-darker)')
        .attr('stroke', 'var(--ink)')
        .attr('stroke-width', 1.5);
      badge.append('text')
        .attr('x', 1).attr('y', 0)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('fill', 'var(--accent-cyan)')
        .attr('font-family', 'var(--font-mono)')
        .attr('font-size', 9)
        .attr('font-weight', 700)
        .text((_d, i) => `[${i}]`);
    };

    draw();
    if (!svgRef.current?.parentElement) return;
    const ro = new ResizeObserver(() => draw());
    ro.observe(svgRef.current.parentElement);
    return () => ro.disconnect();
  }, [frames, currentStep]);

  return <svg ref={svgRef} preserveAspectRatio="xMidYMid meet" />;
}
