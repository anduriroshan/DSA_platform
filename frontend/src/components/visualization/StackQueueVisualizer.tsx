import { useVisualizerStore } from '../../store/useVisualizerStore';
import { DSAnimationFrame } from '../../types/algorithm';
import { algorithmRegistry } from '../../utils/algorithmRegistry';

export default function StackQueueVisualizer() {
  const { frames, currentStep, currentAlgorithm } = useVisualizerStore();
  const frame = frames[currentStep] as DSAnimationFrame;
  const config = algorithmRegistry[currentAlgorithm];
  const isStack = config?.slug === 'stack';

  if (!frame) {
    return (
      <div className="empty-state">
        <div className="icon">📦</div>
        <p>Click Play to start the demo</p>
      </div>
    );
  }

  if (isStack) {
    return (
      <div className="ds-container">
        <div className="ds-label">← TOP</div>
        {[...frame.items].reverse().map((item, reverseIdx) => {
          const actualIdx = frame.items.length - 1 - reverseIdx;
          return (
            <div
              key={`${actualIdx}-${item}`}
              className={`ds-item ${actualIdx === frame.highlightIndex ? 'highlight' : ''}`}
            >
              {item}
            </div>
          );
        })}
        {frame.items.length === 0 && (
          <div style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>Empty Stack</div>
        )}
        <div className="ds-label">← BOTTOM</div>
      </div>
    );
  }

  // Queue: horizontal layout
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '8px' }}>
        <div className="ds-label">FRONT →</div>
        {frame.items.map((item, idx) => (
          <div
            key={`${idx}-${item}`}
            className={`ds-item ${idx === frame.highlightIndex ? 'highlight' : ''}`}
          >
            {item}
          </div>
        ))}
        {frame.items.length === 0 && (
          <div style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>Empty Queue</div>
        )}
        <div className="ds-label">← REAR</div>
      </div>
    </div>
  );
}
