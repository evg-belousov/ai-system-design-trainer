'use client';

import { useState, useCallback, useMemo } from 'react';
import type { Scenario, Step, MetricKey } from '@/data/constructor/types';
import { calculateMetrics, calculateScore } from '@/lib/constructor';

export interface ConstructorSessionState {
  currentStepIndex: number;
  selections: Record<string, string[]>;
  completed: boolean;
}

export interface UseConstructorSessionReturn {
  state: ConstructorSessionState;
  currentStep: Step;
  metrics: Record<MetricKey, number>;
  selectOption: (decisionId: string, optionId: string) => void;
  deselectOption: (decisionId: string, optionId: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
  finish: () => void;
  reset: () => void;
  score: number | null;
}

export function useConstructorSession(scenario: Scenario): UseConstructorSessionReturn {
  const [state, setState] = useState<ConstructorSessionState>({
    currentStepIndex: 0,
    selections: {},
    completed: false,
  });

  const [score, setScore] = useState<number | null>(null);

  const currentStep = scenario.steps[state.currentStepIndex];

  const metrics = useMemo(
    () => calculateMetrics(scenario, state.selections),
    [scenario, state.selections],
  );

  const isMultiSelect = useCallback(
    (decisionId: string): boolean => {
      for (const step of scenario.steps) {
        for (const d of step.decisions) {
          if (d.id === decisionId) return d.multiSelect ?? false;
        }
      }
      return false;
    },
    [scenario],
  );

  const selectOption = useCallback(
    (decisionId: string, optionId: string) => {
      setState(prev => {
        const current = prev.selections[decisionId] ?? [];
        let updated: string[];

        if (isMultiSelect(decisionId)) {
          if (current.includes(optionId)) return prev;
          updated = [...current, optionId];
        } else {
          updated = [optionId];
        }

        return {
          ...prev,
          selections: { ...prev.selections, [decisionId]: updated },
        };
      });
    },
    [isMultiSelect],
  );

  const deselectOption = useCallback(
    (decisionId: string, optionId: string) => {
      setState(prev => {
        const current = prev.selections[decisionId] ?? [];
        if (isMultiSelect(decisionId)) {
          return {
            ...prev,
            selections: {
              ...prev.selections,
              [decisionId]: current.filter(id => id !== optionId),
            },
          };
        }
        return {
          ...prev,
          selections: { ...prev.selections, [decisionId]: [] },
        };
      });
    },
    [isMultiSelect],
  );

  const nextStep = useCallback(() => {
    setState(prev => {
      if (prev.currentStepIndex >= scenario.steps.length - 1) return prev;
      return { ...prev, currentStepIndex: prev.currentStepIndex + 1 };
    });
  }, [scenario.steps.length]);

  const prevStep = useCallback(() => {
    setState(prev => {
      if (prev.currentStepIndex <= 0) return prev;
      return { ...prev, currentStepIndex: prev.currentStepIndex - 1 };
    });
  }, []);

  const goToStep = useCallback(
    (index: number) => {
      setState(prev => {
        if (index < 0 || index >= scenario.steps.length) return prev;
        return { ...prev, currentStepIndex: index };
      });
    },
    [scenario.steps.length],
  );

  const finish = useCallback(() => {
    const finalScore = calculateScore(scenario, state.selections);
    setScore(finalScore);
    setState(prev => ({ ...prev, completed: true }));
  }, [scenario, state.selections]);

  const reset = useCallback(() => {
    setState({
      currentStepIndex: 0,
      selections: {},
      completed: false,
    });
    setScore(null);
  }, []);

  return {
    state,
    currentStep,
    metrics,
    selectOption,
    deselectOption,
    nextStep,
    prevStep,
    goToStep,
    finish,
    reset,
    score,
  };
}
