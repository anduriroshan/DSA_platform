import { useVisualizerStore } from '../../store/useVisualizerStore';
import { LinkedListAnimationFrame } from '../../types/algorithm';

export default function LinkedListVisualizer() {
  const { frames, currentStep } = useVisualizerStore();
  const frame = frames[currentStep] as LinkedListAnimationFrame;

  if (!frame) {
    return (
      <div className="empty-state">
        <div className="icon">🔗</div>
        <p>Click Play to start the demo</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '40px', overflowX: 'auto' }}>
      <div className="ll-container">
        <div className="ds-label" style={{ marginRight: '12px' }}>HEAD →</div>
        {frame.nodes.map((node, idx) => (
          <div key={idx} className="ll-node">
            <div className={`ll-node-box ${idx === frame.highlightIndex ? 'highlight' : ''}`}>
              <div className="ll-data">{node.value}</div>
              <div className="ll-next">{node.next !== null ? '●' : '∅'}</div>
            </div>
            {idx < frame.nodes.length - 1 && (
              <div className="ll-arrow">→</div>
            )}
          </div>
        ))}
        {frame.nodes.length > 0 && (
          <>
            <div className="ll-arrow">→</div>
            <div className="ll-null">NULL</div>
          </>
        )}
        {frame.nodes.length === 0 && (
          <div style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>Empty List</div>
        )}
      </div>
    </div>
  );
}
