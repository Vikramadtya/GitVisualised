import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { scenarios } from '../data/scenarios';

export interface CommitNode {
  id: string;
  parents: string[];
  message: string;
  zone?: 'local' | 'remote';
}

export interface BranchRef {
  name: string;
  target: string;
}

export interface GraphState {
  commits: CommitNode[];
  branches: BranchRef[];
  HEAD: string; 
  stagingArea: string[];
  workingDirectory: string[];
  conflictedFiles?: string[];
}

interface ScenarioStore {
  graph: GraphState;
  activeScenarioIndex: number;
  activeStepIndex: number;
  isCompleted: boolean;
  
  // Actions
  submitCommand: (command: string) => { success: boolean, output: string, message?: string };
  nextScenario: () => void;
  resetScenario: () => void;
  setScenario: (scenarioId: string) => void;
}

export const useScenarioStore = create<ScenarioStore>()(
  persist(
    (set, get) => {
      const currentScenario = scenarios[0];
      
      return {
        graph: currentScenario.initialGraph,
        activeScenarioIndex: 0,
        activeStepIndex: 0,
        isCompleted: false,

        submitCommand: (command: string) => {
          const state = get();
          const scenario = scenarios[state.activeScenarioIndex];
          const step = scenario.steps[state.activeStepIndex];

          if (state.isCompleted) return { success: false, output: 'Scenario already completed.' };

          if (step.expectedCommandRegex.test(command.trim())) {
            // Success!
            const isLastStep = state.activeStepIndex === scenario.steps.length - 1;
            
            set({
              graph: step.resultingGraph,
              activeStepIndex: isLastStep ? state.activeStepIndex : state.activeStepIndex + 1,
              isCompleted: isLastStep
            });

            return { 
              success: true, 
              output: step.terminalOutput, 
              message: step.successMessage 
            };
          } else {
            // Fail
            return { 
              success: false, 
              output: `bash: command not found or incorrect syntax. Please review the instructions.` 
            };
          }
        },

        nextScenario: () => {
          const state = get();
          if (state.activeScenarioIndex < scenarios.length - 1) {
            const nextIdx = state.activeScenarioIndex + 1;
            set({
              activeScenarioIndex: nextIdx,
              activeStepIndex: 0,
              isCompleted: false,
              graph: scenarios[nextIdx].initialGraph
            });
          }
        },

        resetScenario: () => {
          const state = get();
          set({
            activeStepIndex: 0,
            isCompleted: false,
            graph: scenarios[state.activeScenarioIndex].initialGraph
          });
        },
        
        setScenario: (scenarioId: string) => {
          const index = scenarios.findIndex(s => s.id === scenarioId);
          if (index >= 0) {
            set({
              activeScenarioIndex: index,
              activeStepIndex: 0,
              isCompleted: false,
              graph: scenarios[index].initialGraph
            });
          }
        }
      };
    },
    {
      name: 'git-visualised-storage', // unique name for localStorage key
      partialize: (state) => ({
        activeScenarioIndex: state.activeScenarioIndex,
        activeStepIndex: state.activeStepIndex,
        isCompleted: state.isCompleted
      }),
      onRehydrateStorage: () => (state, error) => {
        if (state && !error) {
          const scenario = scenarios[state.activeScenarioIndex];
          if (scenario) {
            const targetGraph = state.activeStepIndex === 0 
              ? scenario.initialGraph 
              : (scenario.steps[state.activeStepIndex - 1]?.resultingGraph || scenario.initialGraph);
            // Since we can't easily call set() here without having access to it outside the create scope in this signature,
            // we can mutate the state directly during rehydration (Zustand v4 allows mutating in onRehydrateStorage callback 
            // since it's merged afterwards, wait no, mutating `state` here actually works because it is the Draft object if immer is used, but we are not using immer.)
            // Actually, the simplest way is to export the store and call setState in a separate useEffect, or just use `useScenarioStore.setState`.
            // But since we are INSIDE the create, we can just use `setTimeout` to update it.
            setTimeout(() => {
              useScenarioStore.setState({ graph: targetGraph });
            }, 0);
          }
        }
      }
    }
  )
);
