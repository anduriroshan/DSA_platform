import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useVisualizerStore } from '../../store/useVisualizerStore';
import { AnimationFrame } from '../../types/algorithm';

export default function ArrayVisualizer() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { frames, currentStep } = useVisualizerStore();

  useEffect(() => {
    const draw = () => {
      if (!svgRef.current || frames.length === 0) return;

      const frame = frames[currentStep] as AnimationFrame;
      if (!frame || !frame.arrayState) return;

      const svg = d3.select(svgRef.current);
      const container = svgRef.current.parentElement;
      if (!container) return;

      const width  = Math.max(container.clientWidth - 24, 200);
      const height = Math.max(container.clientHeight - 60, 140);
      const arr = frame.arrayState;
      const maxVal = Math.max(...arr, 1);
      const barPadding = 4;
      const barWidth = Math.max(8, Math.min(48, (width - 20) / arr.length - barPadding));
      const totalWidth = arr.length * (barWidth + barPadding);
      const startX = (width - totalWidth) / 2;

      svg
        .attr('width', width)
        .attr('height', height + 40)
        .attr('viewBox', `0 0 ${width} ${height + 40}`);

      const getBarColor = (index: number): string => {
        if (frame.type === 'complete' || frame.type === 'found') {
          if (frame.indices.includes(index)) return 'var(--accent-green)';
        }
        if (frame.type === 'sorted' && frame.indices.includes(index))   return 'var(--accent-green)';
        if (frame.type === 'compare' && frame.indices.includes(index))  return 'var(--accent-yellow)';
        if (frame.type === 'swap' && frame.indices.includes(index))     return 'var(--accent-coral)';
        if (frame.type === 'pivot' && frame.indices.includes(index))    return 'var(--accent-purple)';
        if (frame.type === 'search' && frame.indices.includes(index))   return 'var(--accent-yellow)';
        if (frame.type === 'highlight' && frame.indices.includes(index))return 'var(--accent-blue)';
        if (frame.type === 'merge' && frame.indices.includes(index))    return 'var(--accent-blue)';
        if (frame.type === 'set' && frame.indices.includes(index))      return 'var(--accent-purple)';
        if (frame.type === 'min' && frame.indices.includes(index))      return 'var(--accent-purple)';
        if (frame.type === 'partition' && frame.indices.includes(index))return 'var(--accent-blue)';
        if (frame.type === 'not-found')                                 return 'var(--accent-coral)';
        return 'var(--bar-default)';
      };

      const bars = svg.selectAll<SVGRectElement, number>('.bar').data(arr);
      bars.enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('stroke', 'var(--ink)')
        .attr('stroke-width', 2)
        .merge(bars)
        .transition()
        .duration(220)
        .attr('x', (_: number, i: number) => startX + i * (barWidth + barPadding))
        .attr('y', (d: number) => height - (d / maxVal) * (height - 40))
        .attr('width', barWidth)
        .attr('height', (d: number) => (d / maxVal) * (height - 40))
        .attr('rx', 0)
        .attr('fill', (_: number, i: number) => getBarColor(i));
      bars.exit().remove();

      const labels = svg.selectAll<SVGTextElement, number>('.bar-label').data(arr);
      labels.enter()
        .append('text')
        .attr('class', 'bar-label')
        .merge(labels)
        .transition()
        .duration(220)
        .attr('x', (_: number, i: number) => startX + i * (barWidth + barPadding) + barWidth / 2)
        .attr('y', (d: number) => height - (d / maxVal) * (height - 40) - 6)
        .attr('text-anchor', 'middle')
        .attr('fill', 'var(--text)')
        .attr('font-size', Math.min(11, barWidth * 0.4))
        .attr('font-family', 'var(--font-code)')
        .attr('font-weight', '600')
        .text((d: number) => d);
      labels.exit().remove();

      const indices = svg.selectAll<SVGTextElement, number>('.index-label').data(arr);
      indices.enter()
        .append('text')
        .attr('class', 'index-label')
        .merge(indices)
        .transition()
        .duration(220)
        .attr('x', (_: number, i: number) => startX + i * (barWidth + barPadding) + barWidth / 2)
        .attr('y', height + 14)
        .attr('text-anchor', 'middle')
        .attr('fill', 'var(--ink-light)')
        .attr('font-size', 9)
        .attr('font-family', 'var(--font-code)')
        .text((_: number, i: number) => i);
      indices.exit().remove();
    };

    draw();

    if (!svgRef.current?.parentElement) return;
    const ro = new ResizeObserver(() => draw());
    ro.observe(svgRef.current.parentElement);
    return () => ro.disconnect();
  }, [frames, currentStep]);

  return <svg ref={svgRef} preserveAspectRatio="xMidYMid meet" />;
}
