import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useVisualizerStore } from '../store/useVisualizerStore';
import { algorithmRegistry } from '../utils/algorithmRegistry';
import PseudoCode from '../components/editor/PseudoCode';
import ArrayVisualizer from '../components/visualization/ArrayVisualizer';
import TreeVisualizer from '../components/visualization/TreeVisualizer';
import StackQueueVisualizer from '../components/visualization/StackQueueVisualizer';
import LinkedListVisualizer from '../components/visualization/LinkedListVisualizer';
import PlaybackControls from '../components/controls/PlaybackControls';
import InputControls from '../components/controls/InputControls';
import CodePanel from '../components/editor/CodePanel';

export default function VisualizerPage() {
  const { slug } = useParams<{ slug: string }>();
  const { loadAlgorithm, currentAlgorithm, visualizerType, frames, currentStep } = useVisualizerStore();
  const config = slug ? algorithmRegistry[slug] : null;

  useEffect(() => {
    if (slug && slug !== currentAlgorithm) {
      loadAlgorithm(slug);
    }
  }, [slug]);

  // Initialize frames on first load
  useEffect(() => {
    if (slug && frames.length === 0) {
      loadAlgorithm(slug);
    }
  }, []);

  if (!config) {
    return (
      <div className="empty-state">
        <div className="icon">🔍</div>
        <p>Algorithm not found. Select one from the sidebar.</p>
      </div>
    );
  }

  const currentFrame = frames[currentStep];

  const renderVisualizer = () => {
    switch (visualizerType) {
      case 'array':
        return <ArrayVisualizer />;
      case 'tree':
        return <TreeVisualizer />;
      case 'stack-queue':
        return <StackQueueVisualizer />;
      case 'linked-list':
        return <LinkedListVisualizer />;
      default:
        return <ArrayVisualizer />;
    }
  };

  return (
    <div className="visualizer-page">
      {/* Algorithm Info Bar */}
      <div className="algo-info-bar">
        <div className="algo-info-left">
          <h2>{config.name}</h2>
          <div className="complexity-badges">
            <span className="complexity-badge">⏱ {config.timeComplexity}</span>
            <span className="complexity-badge space">💾 {config.spaceComplexity}</span>
          </div>
        </div>
        <div className="algo-description">{config.description}</div>
      </div>

      {/* Input Controls */}
      <InputControls />

      {/* Three-Panel Layout */}
      <div className="visualizer-panels">


        {/* Center: Visualization */}
        <div className="panel visualization-panel">
          <div className="visualization-canvas">
            {renderVisualizer()}
            {currentFrame && (
              <div className="step-description">
                {('description' in currentFrame) ? currentFrame.description : ''}
              </div>
            )}
          </div>
        </div>

        {/* Right: Code Editor */}
        <div className="panel code-panel">
          <CodePanel />
        </div>
      </div>

      {/* Playback Controls */}
      <PlaybackControls />
    </div>
  );
}
