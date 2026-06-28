import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProgressState {
  completedConceptIds: string[];
  completedScenarioIds: string[];
  
  markConceptCompleted: (id: string) => void;
  markScenarioCompleted: (id: string) => void;
  resetProgress: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      completedConceptIds: [],
      completedScenarioIds: [],
      
      markConceptCompleted: (id: string) => set((state) => {
        if (!state.completedConceptIds.includes(id)) {
          return { completedConceptIds: [...state.completedConceptIds, id] };
        }
        return state;
      }),
      
      markScenarioCompleted: (id: string) => set((state) => {
        if (!state.completedScenarioIds.includes(id)) {
          return { completedScenarioIds: [...state.completedScenarioIds, id] };
        }
        return state;
      }),
      
      resetProgress: () => set({ completedConceptIds: [], completedScenarioIds: [] })
    }),
    {
      name: 'git-visualised-progress',
    }
  )
);
