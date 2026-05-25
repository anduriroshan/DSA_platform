import { useEffect, useMemo, useRef } from 'react';
import { useVisualizerStore } from '../../store/useVisualizerStore';

const MARKER_TYPES = new Set(['pivot', 'sorted', 'found', 'complete', 'not-found']);

export default function PlaybackControls() {
  const {
    isPlaying, speed, currentStep, frames,
    play, pause, stepForward, stepBackward, reset, setSpeed, setCurrentStep,
  } = useVisualizerStore();

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = window.setInterval(() => stepForward(), 600 / speed);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, speed]);

  useEffect(() => {
    if (currentStep >= frames.length - 1 && isPlaying) pause();
  }, [currentStep, frames.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.key) {
        case ' ':         e.preventDefault(); isPlaying ? pause() : play(); break;
        case 'ArrowRight':e.preventDefault(); stepForward(); break;
        case 'ArrowLeft': e.preventDefault(); stepBackward(); break;
        case 'r': case 'R': e.preventDefault(); reset(); break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isPlaying]);

  const progress = frames.length > 1 ? (currentStep / (frames.length - 1)) * 100 : 0;
  const speedOptions = [0.25, 0.5, 1, 2, 4];
  const speedIdx = speedOptions.indexOf(speed);

  // Compute key-frame markers (positions in % along the timeline)
  const markers = useMemo(() => {
    if (frames.length < 2) return [];
    return frames
      .map((f, i) => ({ i, type: (f as any).type as string }))
      .filter(f => MARKER_TYPES.has(f.type))
      .map(f => ({ left: (f.i / (frames.length - 1)) * 100, type: f.type, i: f.i }));
  }, [frames]);

  const onProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const target = Math.round(ratio * (frames.length - 1));
    setCurrentStep(Math.max(0, Math.min(frames.length - 1, target)));
  };

  const lastFrame = Math.max(0, frames.length - 1);
  const onProgressKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (frames.length < 2) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); setCurrentStep(Math.min(lastFrame, currentStep + 1)); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); setCurrentStep(Math.max(0, currentStep - 1)); }
    if (e.key === 'Home')       { e.preventDefault(); setCurrentStep(0); }
    if (e.key === 'End')        { e.preventDefault(); setCurrentStep(lastFrame); }
  };

  return (
    <div className="playback-controls">
      <button className="playback-btn" onClick={reset} title="Reset (R)" aria-label="Reset to first frame">⏮</button>
      <button className="playback-btn" onClick={stepBackward} title="Step Back (←)" aria-label="Step back one frame">◀</button>
      <button
        className="playback-btn primary"
        onClick={() => isPlaying ? pause() : play()}
        title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
        aria-label={isPlaying ? 'Pause playback' : 'Start playback'}
        aria-pressed={isPlaying}
      >
        {isPlaying ? '⏸' : '▶'}
      </button>
      <button className="playback-btn" onClick={stepForward} title="Step Forward (→)" aria-label="Step forward one frame">▶</button>

      <div
        className="progress-bar-container"
        onClick={onProgressClick}
        onKeyDown={onProgressKey}
        role="slider"
        tabIndex={0}
        aria-label="Playback progress"
        aria-valuemin={0}
        aria-valuemax={lastFrame}
        aria-valuenow={currentStep}
        aria-valuetext={`Frame ${currentStep + 1} of ${frames.length}`}
      >
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        {markers.map((m, idx) => (
          <span
            key={idx}
            className={`progress-marker m-${m.type}`}
            style={{ left: `${m.left}%` }}
            title={`Frame ${m.i + 1}: ${m.type}`}
          />
        ))}
      </div>

      <div className="speed-control">
        <input
          type="range"
          className="speed-slider"
          min={0}
          max={speedOptions.length - 1}
          step={1}
          value={speedIdx >= 0 ? speedIdx : 2}
          onChange={(e) => setSpeed(speedOptions[parseInt(e.target.value)])}
          aria-label="Playback speed"
          aria-valuetext={`${speed}x`}
        />
        <span className="speed-value">{speed}x</span>
      </div>
    </div>
  );
}
