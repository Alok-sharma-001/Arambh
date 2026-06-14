import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { syncManager } from '../services/syncManager';

export interface KnowledgeGraph {
  variables: number;
  data_types: number;
  loops: number;
  functions: number;
  collections: number;
  oop: number;
  exceptions: number;
  files: number;
  modules: number;
  algorithms: number;
}

interface KnowledgeStore {
  graph: KnowledgeGraph;
  updateConcept: (concept: keyof KnowledgeGraph, amount: number) => void;
  setGraph: (graph: KnowledgeGraph) => void;
  hydrate: (serverGraph: Partial<KnowledgeGraph>) => void;
}

export const useKnowledgeStore = create<KnowledgeStore>()(
  persist(
    (set) => ({
      graph: {
        variables: 0,
        data_types: 0,
        loops: 0,
        functions: 0,
        collections: 0,
        oop: 0,
        exceptions: 0,
        files: 0,
        modules: 0,
        algorithms: 0,
      },
      hydrate: (serverGraph) => set((state) => ({
        graph: { ...state.graph, ...serverGraph }
      })),
      updateConcept: (concept, amount) => {
        set((state) => {
          const newValue = Math.min(100, Math.max(0, state.graph[concept] + amount));
          return {
            graph: {
              ...state.graph,
              [concept]: newValue
            }
          };
        });
        syncManager.performBackgroundSync();
      },
      setGraph: (graph) => {
        set({ graph });
        syncManager.performBackgroundSync();
      },
    }),
    {
      name: 'pyquest_knowledge_graph'
    }
  )
);
