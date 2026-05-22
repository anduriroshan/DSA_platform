import { useEffect, useRef } from 'react';
import { useVisualizerStore } from '../../store/useVisualizerStore';

export default function PlaybackControls() {
  const {
    isPlaying, speed, currentStep, frames,
    play, pause, stepForward, stepBackward, reset, setSpeed
  } = useVisualizerStore();

  const intervalRef = useRef<number | null>(null);

  // Auto-advance when playing
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = window.setInterval(() => {
        stepForward();
      }, 600 / speed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, speed]);

  // Stop when reaching end
  useEffect(() => {
    if (currentStep >= frames.length - 1 && isPlaying) {
      pause();
    }
  }, [currentStep, frames.length]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.key) {
        case ' ':
          e.preventDefault();
          isPlaying ? pause() : play();
          break;
        case 'ArrowRight':
          e.preventDefault();
          stepForward();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          stepBackward();
          break;
        case 'r':
          e.preventDefault();
          reset();
          break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isPlaying]);

  const progress = frames.length > 0 ? (currentStep / (frames.length - 1)) * 100 : 0;

  const speedOptions = [0.25, 0.5, 1, 2, 4];
  const speedIdx = speedOptions.indexOf(speed);

  return (
    <div className="playback-controls">
      <button className="playback-btn" onClick={reset} title="Reset (R)">
        ⏮
      </button>
      <button className="playback-btn" onClick={stepBackward} title="Step Back (←)">
        ⏪
      </button>
      <button
        className="playback-btn primary"
        onClick={() => isPlaying ? pause() : play()}
        title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
      >
        {isPlaying ? '⏸' : '▶'}
      </button>
      <button className="playback-btn" onClick={stepForward} title="Step Forward (→)">
        ⏩
      </button>

      <div className="progress-bar-container">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>

      <span className="step-counter">
        {currentStep + 1} / {frames.length}
      </span>

      <div className="speed-control">
        <label>Speed</label>
        <input
          type="range"
          className="speed-slider"
          min={0}
          max={speedOptions.length - 1}
          step={1}
          value={speedIdx >= 0 ? speedIdx : 2}
          onChange={(e) => setSpeed(speedOptions[parseInt(e.target.value)])}
        />
        <span className="speed-value">{speed}x</span>
      </div>
    </div>
  );
}
