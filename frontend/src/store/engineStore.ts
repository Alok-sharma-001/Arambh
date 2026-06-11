import { create } from 'zustand';
import { ExecutionStep, generateMockExecution } from '../engine/VisualizationEngine';

interface EngineStore {
  steps: ExecutionStep[];
  currentStepIndex: number;
  isPlaying: boolean;
  speed: number;
  outputLog: string[];
  
  // Actions
  initialize: () => void;
  play: () => void;
  pause: () => void;
  stepNext: () => void;
  stepPrev: () => void;
  reset: () => void;
  setSpeed: (speed: number) => void;
}

export const useEngineStore = create<EngineStore>((set, get) => {
  let playInterval: ReturnType<typeof setInterval> | null = null;

  const stopPlayback = () => {
    if (playInterval) clearInterval(playInterval);
    set({ isPlaying: false });
  };

  const executeStepLogic = (step: ExecutionStep) => {
    if (step.type === 'PRINT' && step.output) {
      set((state) => ({ outputLog: [...state.outputLog, step.output!] }));
    }
    // If we step backward, we'd need to rebuild output log. Simplified for now.
  };

  return {
    steps: [],
    currentStepIndex: 0,
    isPlaying: false,
    speed: 1500, // ms per step
    outputLog: [],

    initialize: () => {
      set({ steps: generateMockExecution(), currentStepIndex: 0, outputLog: [], isPlaying: false });
    },

    play: () => {
      const { currentStepIndex, steps } = get();
      if (currentStepIndex >= steps.length - 1) return;
      
      set({ isPlaying: true });
      
      playInterval = setInterval(() => {
        const state = get();
        if (state.currentStepIndex >= state.steps.length - 1) {
          stopPlayback();
        } else {
          const nextIndex = state.currentStepIndex + 1;
          set({ currentStepIndex: nextIndex });
          executeStepLogic(state.steps[nextIndex]);
        }
      }, get().speed);
    },

    pause: () => {
      stopPlayback();
    },

    stepNext: () => {
      const { currentStepIndex, steps } = get();
      if (currentStepIndex < steps.length - 1) {
        const nextIndex = currentStepIndex + 1;
        set({ currentStepIndex: nextIndex });
        executeStepLogic(steps[nextIndex]);
      }
    },

    stepPrev: () => {
      const { currentStepIndex, steps } = get();
      if (currentStepIndex > 0) {
        // Simple rollback: clear output log and re-apply up to prev index
        const prevIndex = currentStepIndex - 1;
        const newOutputs = steps
          .slice(0, prevIndex + 1)
          .filter(s => s.type === 'PRINT' && s.output)
          .map(s => s.output!);
          
        set({ currentStepIndex: prevIndex, outputLog: newOutputs });
      }
    },

    reset: () => {
      stopPlayback();
      set({ currentStepIndex: 0, outputLog: [] });
    },

    setSpeed: (speed) => {
      set({ speed });
      if (get().isPlaying) {
        get().pause();
        get().play();
      }
    }
  };
});
