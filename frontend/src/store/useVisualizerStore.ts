import { create } from 'zustand';
import {
  AnimationFrame,
  TreeAnimationFrame,
  DSAnimationFrame,
  LinkedListAnimationFrame,
  HeapAnimationFrame,
  GraphAnimationFrame,
  DPTableAnimationFrame,
  VisualizerType,
} from '../types/algorithm';
import { algorithmRegistry } from '../utils/algorithmRegistry';

type AnyFrame =
  | AnimationFrame
  | TreeAnimationFrame
  | DSAnimationFrame
  | LinkedListAnimationFrame
  | HeapAnimationFrame
  | GraphAnimationFrame
  | DPTableAnimationFrame;

const VIZ_PANEL_KEY        = 'dsaq.vizPanelOpen';
const VIZ_PANEL_WIDTH_KEY  = 'dsaq.vizPanelWidth';
const EDITOR_OPEN_KEY      = 'dsaq.codeEditorOpen';

const MIN_VIZ_WIDTH = 280;
const MAX_VIZ_WIDTH = 720;
const DEFAULT_VIZ_WIDTH = 360;

const readVizPanelOpen = (): boolean => {
  try {
    const v = localStorage.getItem(VIZ_PANEL_KEY);
    return v === null ? true : v === '1';
  } catch { return true; }
};
const readVizPanelWidth = (): number => {
  try {
    const v = localStorage.getItem(VIZ_PANEL_WIDTH_KEY);
    const n = v ? parseInt(v, 10) : DEFAULT_VIZ_WIDTH;
    if (isNaN(n)) return DEFAULT_VIZ_WIDTH;
    return Math.max(MIN_VIZ_WIDTH, Math.min(MAX_VIZ_WIDTH, n));
  } catch { return DEFAULT_VIZ_WIDTH; }
};
const readCodeEditorOpen = (): boolean => {
  try { return localStorage.getItem(EDITOR_OPEN_KEY) === '1'; } catch { return false; }
};

interface VisualizerState {
  currentAlgorithm: string;
  visualizerType: VisualizerType;
  frames: AnyFrame[];
  currentStep: number;
  isPlaying: boolean;
  speed: number;
  inputArray: number[];
  searchTarget: number;
  output: string;
  outputType: 'success' | 'error' | 'idle';
  isRunning: boolean;

  vizPanelOpen: boolean;
  vizFullscreen: boolean;
  vizPanelWidth: number;
  userInteracted: boolean;
  codeEditorOpen: boolean;

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
  toggleVizPanel: () => void;
  setVizPanelOpen: (open: boolean) => void;
  toggleVizFullscreen: () => void;
  setVizPanelWidth: (w: number) => void;
  markUserInteracted: () => void;
  toggleCodeEditor: () => void;
  setCodeEditorOpen: (open: boolean) => void;
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

  vizPanelOpen: readVizPanelOpen(),
  vizFullscreen: false,
  vizPanelWidth: readVizPanelWidth(),
  userInteracted: false,
  codeEditorOpen: readCodeEditorOpen(),

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
      userInteracted: false,
    });
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
    if (step >= 0 && step < frames.length) set({ currentStep: step });
  },

  stepForward: () => {
    const { currentStep, frames } = get();
    if (currentStep < frames.length - 1) set({ currentStep: currentStep + 1, userInteracted: true });
    else set({ isPlaying: false });
  },
  stepBackward: () => {
    const { currentStep } = get();
    if (currentStep > 0) set({ currentStep: currentStep - 1, userInteracted: true });
  },

  play:  () => set({ isPlaying: true,  userInteracted: true }),
  pause: () => set({ isPlaying: false, userInteracted: true }),
  reset: () => set({ currentStep: 0, isPlaying: false, userInteracted: true }),

  setSpeed: (speed: number) => set({ speed }),

  setInputArray: (arr: number[]) => set({ inputArray: arr, currentStep: 0, isPlaying: false, frames: [] }),
  setSearchTarget: (target: number) => set({ searchTarget: target }),
  setOutput: (output, type) => set({ output, outputType: type }),
  setIsRunning: (running: boolean) => set({ isRunning: running }),
  setFrames: (frames: AnyFrame[]) => set({ frames, currentStep: 0, isPlaying: false }),

  toggleVizPanel: () => {
    const next = !get().vizPanelOpen;
    set({ vizPanelOpen: next });
    try { localStorage.setItem(VIZ_PANEL_KEY, next ? '1' : '0'); } catch {}
  },
  setVizPanelOpen: (open: boolean) => {
    set({ vizPanelOpen: open });
    try { localStorage.setItem(VIZ_PANEL_KEY, open ? '1' : '0'); } catch {}
  },
  toggleVizFullscreen: () => set({ vizFullscreen: !get().vizFullscreen }),
  setVizPanelWidth: (w: number) => {
    const clamped = Math.max(MIN_VIZ_WIDTH, Math.min(MAX_VIZ_WIDTH, w));
    set({ vizPanelWidth: clamped });
    try { localStorage.setItem(VIZ_PANEL_WIDTH_KEY, String(clamped)); } catch {}
  },
  markUserInteracted: () => { if (!get().userInteracted) set({ userInteracted: true }); },

  toggleCodeEditor: () => {
    const next = !get().codeEditorOpen;
    set({ codeEditorOpen: next });
    try { localStorage.setItem(EDITOR_OPEN_KEY, next ? '1' : '0'); } catch {}
  },
  setCodeEditorOpen: (open: boolean) => {
    set({ codeEditorOpen: open });
    try { localStorage.setItem(EDITOR_OPEN_KEY, open ? '1' : '0'); } catch {}
  },
}));
