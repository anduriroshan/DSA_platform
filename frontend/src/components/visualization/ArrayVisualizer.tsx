import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useVisualizerStore } from '../../store/useVisualizerStore';
import { AnimationFrame } from '../../types/algorithm';

export default function ArrayVisualizer() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { frames, currentStep } = useVisualizerStore();

  useEffect(() => {
    if (!svgRef.current || frames.length === 0) return;

    const frame = frames[currentStep] as AnimationFrame;
    if (!frame || !frame.arrayState) return;

    const svg = d3.select(svgRef.current);
    const container = svgRef.current.parentElement;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight - 50;
    const arr = frame.arrayState;
    const maxVal = Math.max(...arr, 1);
    const barPadding = 4;
    const barWidth = Math.min(60, (width - 40) / arr.length - barPadding);
    const totalWidth = arr.length * (barWidth + barPadding);
    const startX = (width - totalWidth) / 2;

    svg.attr('width', width).attr('height', height + 50);

    // Determine bar colors based on frame type
    const getBarColor = (index: number): string => {
      if (frame.type === 'complete' || frame.type === 'found') {
        if (frame.indices.includes(index)) return 'var(--accent-green)';
      }
      if (frame.type === 'sorted' && frame.indices.includes(index)) return 'var(--accent-green)';
      if (frame.type === 'compare' && frame.indices.includes(index)) return 'var(--accent-amber)';
      if (frame.type === 'swap' && frame.indices.includes(index)) return 'var(--accent-red)';
      if (frame.type === 'pivot' && frame.indices.includes(index)) return 'var(--accent-purple)';
      if (frame.type === 'search' && frame.indices.includes(index)) return 'var(--accent-amber)';
      if (frame.type === 'highlight' && frame.indices.includes(index)) return 'var(--accent-blue)';
      if (frame.type === 'merge' && frame.indices.includes(index)) return 'var(--accent-pink)';
      if (frame.type === 'set' && frame.indices.includes(index)) return 'var(--accent-purple)';
      if (frame.type === 'min' && frame.indices.includes(index)) return 'var(--accent-purple)';
      if (frame.type === 'partition' && frame.indices.includes(index)) return 'var(--accent-blue)';
      if (frame.type === 'not-found') return 'var(--accent-red)';
      return 'var(--accent-cyan)';
    };

    // Bars
    const bars = svg.selectAll<SVGRectElement, number>('.bar').data(arr);

    bars.enter()
      .append('rect')
      .attr('class', 'bar')
      .merge(bars)
      .transition()
      .duration(250)
      .attr('x', (_: number, i: number) => startX + i * (barWidth + barPadding))
      .attr('y', (d: number) => height - (d / maxVal) * (height - 40))
      .attr('width', barWidth)
      .attr('height', (d: number) => (d / maxVal) * (height - 40))
      .attr('rx', 4)
      .attr('fill', (_: number, i: number) => getBarColor(i));

    bars.exit().remove();

    // Value labels on top of bars
    const labels = svg.selectAll<SVGTextElement, number>('.bar-label').data(arr);

    labels.enter()
      .append('text')
      .attr('class', 'bar-label')
      .merge(labels)
      .transition()
      .duration(250)
      .attr('x', (_: number, i: number) => startX + i * (barWidth + barPadding) + barWidth / 2)
      .attr('y', (d: number) => height - (d / maxVal) * (height - 40) - 8)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--text-secondary)')
      .attr('font-size', Math.min(12, barWidth * 0.35))
      .attr('font-family', 'var(--font-mono)')
      .attr('font-weight', '600')
      .text((d: number) => d);

    labels.exit().remove();

    // Index labels below bars
    const indices = svg.selectAll<SVGTextElement, number>('.index-label').data(arr);

    indices.enter()
      .append('text')
      .attr('class', 'index-label')
      .merge(indices)
      .transition()
      .duration(250)
      .attr('x', (_: number, i: number) => startX + i * (barWidth + barPadding) + barWidth / 2)
      .attr('y', height + 18)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--text-tertiary)')
      .attr('font-size', 10)
      .attr('font-family', 'var(--font-mono)')
      .text((_: number, i: number) => i);

    indices.exit().remove();

  }, [frames, currentStep]);

  return <svg ref={svgRef} />;
}
