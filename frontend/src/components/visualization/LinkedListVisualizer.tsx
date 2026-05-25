import { useVisualizerStore } from '../../store/useVisualizerStore';
import { LinkedListAnimationFrame } from '../../types/algorithm';

export default function LinkedListVisualizer() {
  const { frames, currentStep } = useVisualizerStore();
  const frame = frames[currentStep] as LinkedListAnimationFrame;

  if (!frame) {
    return (
      <div className="empty-state">
        <div className="icon">▭▭▭</div>
        <p>Click Play to start the demo</p>
      </div>
    );
  }

  // A frame is "doubly linked" if ANY node carries a defined `prev` field.
  // This keeps backward-compatibility: singly-linked generators (which never
  // set `prev`) render exactly as before with a one-way arrow only.
  const isDoubly = frame.nodes.some((n) => n.prev !== undefined);

  return (
    <div className="viz-hscroll">
      <div className="ll-container">
        <div className="ds-label" style={{ marginRight: '12px' }}>
          {isDoubly ? 'HEAD ⇄' : 'HEAD →'}
        </div>
        {frame.nodes.map((node, idx) => (
          <div key={idx} className="ll-node">
            <div
              className={`ll-node-box ${isDoubly ? 'doubly' : ''} ${
                idx === frame.highlightIndex ? 'highlight' : ''
              }`}
            >
              {isDoubly && (
                <div className="ll-prev" aria-label="prev pointer">
                  {node.prev !== null && node.prev !== undefined ? '●' : '∅'}
                </div>
              )}
              <div className="ll-data">{node.value}</div>
              <div className="ll-next" aria-label="next pointer">
                {node.next !== null && node.next !== undefined ? '●' : '∅'}
              </div>
            </div>
            {idx < frame.nodes.length - 1 && (
              <div className="ll-arrow-pair">
                <div className="ll-arrow forward">→</div>
                {isDoubly && <div className="ll-arrow backward">←</div>}
              </div>
            )}
          </div>
        ))}
        {frame.nodes.length > 0 && (
          <>
            <div className="ll-arrow-pair">
              <div className="ll-arrow forward">→</div>
              {isDoubly && <div className="ll-arrow backward muted">←</div>}
            </div>
            <div className="ll-null">NULL</div>
          </>
        )}
        {frame.nodes.length === 0 && <div className="ds-empty">Empty List</div>}
      </div>
    </div>
  );
}
