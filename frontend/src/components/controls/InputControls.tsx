import { useState } from 'react';
import { useVisualizerStore } from '../../store/useVisualizerStore';
import { algorithmRegistry } from '../../utils/algorithmRegistry';

export default function InputControls() {
  const { inputArray, searchTarget, currentAlgorithm, setInputArray, setSearchTarget, generateFrames } = useVisualizerStore();
  const config = algorithmRegistry[currentAlgorithm];
  const [inputText, setInputText] = useState(inputArray.join(', '));
  const [targetText, setTargetText] = useState(String(searchTarget));

  const handleApply = () => {
    const parsed = inputText.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    if (parsed.length > 0) {
      setInputArray(parsed);
      if (config?.searchTarget !== undefined) {
        setSearchTarget(parseInt(targetText) || 0);
      }
      setTimeout(() => generateFrames(), 50);
    }
  };

  const handleRandom = () => {
    const size = Math.floor(Math.random() * 8) + 5;
    const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 95) + 5);
    setInputText(arr.join(', '));
    setInputArray(arr);
    setTimeout(() => generateFrames(), 50);
  };

  const isSearchAlgo = config?.searchTarget !== undefined;

  return (
    <div className="input-controls">
      <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, whiteSpace: 'nowrap' }}>
        Input:
      </label>
      <input
        className="input-field"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="e.g. 64, 34, 25, 12, 22"
        onKeyDown={(e) => e.key === 'Enter' && handleApply()}
      />
      {isSearchAlgo && (
        <>
          <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, whiteSpace: 'nowrap' }}>
            Target:
          </label>
          <input
            className="input-field"
            style={{ width: '60px', flex: 'none' }}
            value={targetText}
            onChange={(e) => setTargetText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleApply()}
          />
        </>
      )}
      <button className="btn btn-primary btn-sm" onClick={handleApply}>
        Apply
      </button>
      <button className="btn btn-secondary btn-sm" onClick={handleRandom}>
        🎲 Random
      </button>
    </div>
  );
}
