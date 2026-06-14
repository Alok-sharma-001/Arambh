import { create } from 'zustand';
import { ExecutionStep } from '../engine/VisualizationEngine';
import { useProgressionStore } from './progressionStore';
import { useToastStore } from './toastStore';
import { XP_REWARDS } from '../services/progressionService';

interface EngineStore {
  steps: ExecutionStep[];
  currentStepIndex: number;
  isPlaying: boolean;
  executionMode: 'PLAY' | 'SLOW' | 'STEP';
  outputLog: string[];
  
  // Actions
  initialize: () => void;
  play: () => void;
  pause: () => void;
  stepNext: () => void;
  stepPrev: () => void;
  reset: () => void;
  setExecutionMode: (mode: 'PLAY' | 'SLOW' | 'STEP') => void;
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
      
      // Award XP when execution successfully reaches print
      useProgressionStore.getState().gainXP('CODE_EXECUTION', 'Code Execution');
      useToastStore.getState().addToast({
        type: 'xp',
        title: 'Execution Successful',
        xpAmount: XP_REWARDS.CODE_EXECUTION
      });
    }
    // If we step backward, we'd need to rebuild output log. Simplified for now.
  };

  return {
    steps: [],
    currentStepIndex: 0,
    isPlaying: false,
    executionMode: 'PLAY', // ms per step
    outputLog: [],

    initialize: () => {
      set({ currentStepIndex: 0, outputLog: [], isPlaying: false });
    },

    play: () => {
      const { currentStepIndex, steps, executionMode } = get();
      if (currentStepIndex >= steps.length - 1) return;
      
      if (executionMode === 'STEP') {
        // Step mode doesn't auto-play. We just let the user use stepNext
        return;
      }
      
      set({ isPlaying: true });
      const intervalMs = executionMode === 'PLAY' ? 1500 : 3000;
      
      playInterval = setInterval(() => {
        const state = get();
        if (state.currentStepIndex >= state.steps.length - 1) {
          stopPlayback();
        } else {
          const nextIndex = state.currentStepIndex + 1;
          set({ currentStepIndex: nextIndex });
          executeStepLogic(state.steps[nextIndex]);
        }
      }, intervalMs);
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

    setExecutionMode: (mode) => {
      set({ executionMode: mode });
      if (get().isPlaying && mode !== 'STEP') {
        get().pause();
        get().play();
      } else if (mode === 'STEP') {
        get().pause();
      }
    }
  };
});
