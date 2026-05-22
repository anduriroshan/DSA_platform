import { create } from 'zustand';
import { AnimationFrame, TreeAnimationFrame, DSAnimationFrame, LinkedListAnimationFrame, VisualizerType } from '../types/algorithm';
import { algorithmRegistry } from '../utils/algorithmRegistry';

type AnyFrame = AnimationFrame | TreeAnimationFrame | DSAnimationFrame | LinkedListAnimationFrame;

interface VisualizerState {
  // Algorithm
  currentAlgorithm: string;
  visualizerType: VisualizerType;

  // Frames
  frames: AnyFrame[];
  currentStep: number;

  // Playback
  isPlaying: boolean;
  speed: number; // multiplier: 0.25, 0.5, 1, 2, 4

  // Input
  inputArray: number[];
  searchTarget: number;

  // Output (compiler)
  output: string;
  outputType: 'success' | 'error' | 'idle';
  isRunning: boolean;

  // Actions
  loadAlgorithm: (slug: string) => void;
  generateFrames: () => void;
  setCurrentStep: (step: number) => void;
  stepForward: () => void;
  stepBackward: () => void;
  play: () => void;
  pause: () => void;
  reset: () => void;
  setSpeed: (speed: number) => void;
  setInputArray: (arr: number[]) => void;
  setSearchTarget: (target: number) => void;
  setOutput: (output: string, type: 'success' | 'error' | 'idle') => void;
  setIsRunning: (running: boolean) => void;
  setFrames: (frames: AnyFrame[]) => void;
}

export const useVisualizerStore = create<VisualizerState>((set, get) => ({
  currentAlgorithm: 'bubble-sort',
  visualizerType: 'array',
  frames: [],
  currentStep: 0,
  isPlaying: false,
  speed: 1,
  inputArray: [64, 34, 25, 12, 22, 11, 90],
  searchTarget: 70,
  output: '',
  outputType: 'idle',
  isRunning: false,

  loadAlgorithm: (slug: string) => {
    const config = algorithmRegistry[slug];
    if (!config) return;

    set({
      currentAlgorithm: slug,
      visualizerType: config.visualizerType,
      inputArray: [...config.defaultInput],
      searchTarget: config.searchTarget ?? 0,
      currentStep: 0,
      isPlaying: false,
      frames: [],
    });

    // Generate frames after loading
    setTimeout(() => get().generateFrames(), 0);
  },

  generateFrames: () => {
    const { currentAlgorithm, inputArray, searchTarget } = get();
    const config = algorithmRegistry[currentAlgorithm];
    if (!config) return;

    const frames = config.generate(inputArray, searchTarget);
    set({ frames, currentStep: 0, isPlaying: false });
  },

  setCurrentStep: (step: number) => {
    const { frames } = get();
    if (step >= 0 && step < frames.length) {
      set({ currentStep: step });
    }
  },

  stepForward: () => {
    const { currentStep, frames } = get();
    if (currentStep < frames.length - 1) {
      set({ currentStep: currentStep + 1 });
    } else {
      set({ isPlaying: false });
    }
  },

  stepBackward: () => {
    const { currentStep } = get();
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1 });
    }
  },

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),

  reset: () => {
    set({ currentStep: 0, isPlaying: false });
  },

  setSpeed: (speed: number) => set({ speed }),

  setInputArray: (arr: number[]) => {
    set({ inputArray: arr, currentStep: 0, isPlaying: false, frames: [] });
  },

  setSearchTarget: (target: number) => {
    set({ searchTarget: target });
  },

  setOutput: (output: string, type: 'success' | 'error' | 'idle') => {
    set({ output, outputType: type });
  },

  setIsRunning: (running: boolean) => set({ isRunning: running }),
  
  setFrames: (frames: AnyFrame[]) => {
    set({ frames, currentStep: 0, isPlaying: false });
  },
}));
