import { useVisualizerStore } from '../../store/useVisualizerStore';
import { algorithmRegistry } from '../../utils/algorithmRegistry';

export default function PseudoCode() {
  const { currentAlgorithm, currentStep, frames } = useVisualizerStore();
  const config = algorithmRegistry[currentAlgorithm];

  if (!config) return null;

  const frame = frames[currentStep];
  const activeLine = frame && 'codeLineHighlight' in frame ? frame.codeLineHighlight : -1;

  return (
    <div className="pseudocode-lines">
      {config.pseudocode.map((line, idx) => (
        <div
          key={idx}
          className={`pseudocode-line ${idx === activeLine ? 'active' : ''}`}
        >
          <span className="line-number">{idx + 1}</span>
          <span className="line-content">{line}</span>
        </div>
      ))}
    </div>
  );
}
