import { useEffect, useRef, useCallback } from 'react';
import { useVisualizerStore } from '../../store/useVisualizerStore';
import ArrayVisualizer from './ArrayVisualizer';
import TreeVisualizer from './TreeVisualizer';
import StackQueueVisualizer from './StackQueueVisualizer';
import LinkedListVisualizer from './LinkedListVisualizer';
import HeapVisualizer from './HeapVisualizer';
import GraphVisualizer from './GraphVisualizer';
import DPTableVisualizer from './DPTableVisualizer';
import PlaybackControls from '../controls/PlaybackControls';
import InputControls from '../controls/InputControls';

export default function VizPanel() {
  const {
    visualizerType,
    frames,
    currentStep,
    vizFullscreen,
    toggleVizFullscreen,
    vizPanelWidth,
    setVizPanelWidth,
  } = useVisualizerStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'f' || e.key === 'F') { e.preventDefault(); toggleVizFullscreen(); }
      if (e.key === 'Escape' && vizFullscreen) toggleVizFullscreen();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [vizFullscreen, toggleVizFullscreen]);

  const resizingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (vizFullscreen) return;
    resizingRef.current = true;
    startXRef.current = e.clientX;
    startWidthRef.current = vizPanelWidth;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [vizPanelWidth, vizFullscreen]);
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!resizingRef.current) return;
    const dx = startXRef.current - e.clientX;
    setVizPanelWidth(startWidthRef.current + dx);
  }, [setVizPanelWidth]);
  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!resizingRef.current) return;
    resizingRef.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  const renderVisualizer = () => {
    switch (visualizerType) {
      case 'array': return <ArrayVisualizer />;
      case 'tree': return <TreeVisualizer />;
      case 'stack-queue': return <StackQueueVisualizer />;
      case 'linked-list': return <LinkedListVisualizer />;
      case 'heap': return <HeapVisualizer />;
      case 'graph': return <GraphVisualizer />;
      case 'dp-table': return <DPTableVisualizer />;
      default: return <ArrayVisualizer />;
    }
  };

  const currentFrame = frames[currentStep];
  const stepText = frames.length > 0 ? `${currentStep + 1}/${frames.length}` : '0/0';

  const widthStyle = vizFullscreen ? undefined : { width: vizPanelWidth };

  return (
    <aside
      className={`viz-panel ${vizFullscreen ? 'fullscreen' : ''}`}
      style={widthStyle}
      aria-label="Visualizer panel"
    >
      {!vizFullscreen && (
        <div
          className="viz-resize-handle"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          title="Drag to resize"
        />
      )}

      <div className="viz-panel-header">
        <span className="viz-step-chip">STEP {stepText}</span>
        <div className="viz-panel-spacer" />
        <button
          className="viz-icon-btn"
          onClick={toggleVizFullscreen}
          title={vizFullscreen ? 'Exit fullscreen (Esc)' : 'Fullscreen (F)'}
          aria-label={vizFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        >
          {vizFullscreen ? '✕' : '⛶'}
        </button>
      </div>

      <InputControls />

      {currentFrame && 'description' in currentFrame && currentFrame.description && (
        <div key={currentStep} className="step-description">
          {currentFrame.description}
        </div>
      )}

      <div className="visualization-canvas">
        {renderVisualizer()}
      </div>

      <PlaybackControls />
    </aside>
  );
}
