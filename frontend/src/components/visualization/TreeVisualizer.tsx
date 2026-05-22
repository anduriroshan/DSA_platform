import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useVisualizerStore } from '../../store/useVisualizerStore';
import { TreeAnimationFrame, TreeNode } from '../../types/algorithm';

interface D3TreeNode {
  value: number;
  children?: D3TreeNode[];
}

function toD3Tree(node: TreeNode | null | undefined): D3TreeNode | null {
  if (!node) return null;
  const result: D3TreeNode = { value: node.value };
  const children: D3TreeNode[] = [];
  const leftChild = toD3Tree(node.left || null);
  const rightChild = toD3Tree(node.right || null);
  if (leftChild) children.push(leftChild);
  if (rightChild) children.push(rightChild);
  if (children.length > 0) result.children = children;
  return result;
}

export default function TreeVisualizer() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { frames, currentStep } = useVisualizerStore();

  useEffect(() => {
    if (!svgRef.current || frames.length === 0) return;

    const frame = frames[currentStep] as TreeAnimationFrame;
    if (!frame) return;

    const svg = d3.select(svgRef.current);
    const container = svgRef.current.parentElement;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight - 50;

    svg.attr('width', width).attr('height', height + 50);
    svg.selectAll('*').remove();

    if (!frame.tree) {
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('text-anchor', 'middle')
        .attr('fill', 'var(--text-tertiary)')
        .attr('font-size', 16)
        .text('Tree is empty');
      return;
    }

    const d3Data = toD3Tree(frame.tree);
    if (!d3Data) return;

    const root = d3.hierarchy(d3Data);
    const treeLayout = d3.tree<D3TreeNode>().size([width - 80, height - 80]);
    treeLayout(root);

    const g = svg.append('g').attr('transform', 'translate(40, 40)');

    // Links
    g.selectAll('.tree-link')
      .data(root.links())
      .enter()
      .append('line')
      .attr('class', 'tree-link')
      .attr('x1', (d: any) => d.source.x)
      .attr('y1', (d: any) => d.source.y)
      .attr('x2', (d: any) => d.target.x)
      .attr('y2', (d: any) => d.target.y)
      .attr('stroke', 'var(--text-tertiary)')
      .attr('stroke-width', 1.5);

    // Nodes
    const nodes = g.selectAll('.tree-node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', (d: any) => {
        let cls = 'tree-node';
        if (frame.highlightedNodes.includes(d.data.value)) cls += ' highlighted';
        if (frame.visitedNodes.includes(d.data.value)) cls += ' visited';
        return cls;
      })
      .attr('transform', (d: any) => `translate(${d.x}, ${d.y})`);

    nodes.append('circle')
      .attr('r', 22)
      .attr('fill', (d: any) => {
        if (frame.highlightedNodes.includes(d.data.value)) return 'rgba(245, 158, 11, 0.2)';
        if (frame.visitedNodes.includes(d.data.value)) return 'rgba(16, 185, 129, 0.2)';
        return 'var(--bg-elevated)';
      })
      .attr('stroke', (d: any) => {
        if (frame.highlightedNodes.includes(d.data.value)) return 'var(--accent-amber)';
        if (frame.visitedNodes.includes(d.data.value)) return 'var(--accent-green)';
        return 'var(--accent-cyan)';
      })
      .attr('stroke-width', (d: any) =>
        frame.highlightedNodes.includes(d.data.value) ? 3 : 2
      );

    nodes.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('fill', 'var(--text-primary)')
      .attr('font-family', 'var(--font-mono)')
      .attr('font-size', 14)
      .attr('font-weight', 600)
      .text((d: any) => d.data.value);

  }, [frames, currentStep]);

  return <svg ref={svgRef} />;
}
