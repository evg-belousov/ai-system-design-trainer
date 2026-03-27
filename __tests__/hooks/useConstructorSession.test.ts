import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useConstructorSession } from '@/hooks/useConstructorSession';
import type { Scenario } from '@/data/constructor/types';

const mockScenario: Scenario = {
  id: 'test',
  title: 'Test',
  description: 'Test scenario',
  difficulty: 'middle',
  steps: [
    {
      id: 'step-1',
      title: 'Step 1',
      description: 'First step',
      decisions: [
        {
          id: 'dec-single',
          category: 'storage',
          question: 'Pick DB',
          options: [
            {
              id: 'opt-a',
              label: 'A',
              description: 'A',
              pros: ['Fast'],
              cons: ['Costly'],
              bestWhen: 'Speed',
              impact: { latency: 2, scalability: 0, consistency: 0, complexity: 0, cost: -1 },
            },
            {
              id: 'opt-b',
              label: 'B',
              description: 'B',
              pros: ['Cheap'],
              cons: ['Slow'],
              bestWhen: 'Budget',
              impact: { latency: -1, scalability: 0, consistency: 1, complexity: 0, cost: 1 },
            },
          ],
        },
        {
          id: 'dec-multi',
          category: 'caching',
          question: 'Pick caches',
          multiSelect: true,
          options: [
            {
              id: 'opt-c',
              label: 'C',
              description: 'C',
              pros: ['Simple'],
              cons: ['Small'],
              bestWhen: 'Low traffic',
              impact: { latency: 1, scalability: 0, consistency: 0, complexity: 0, cost: 0 },
            },
            {
              id: 'opt-d',
              label: 'D',
              description: 'D',
              pros: ['Powerful'],
              cons: ['Hard'],
              bestWhen: 'High traffic',
              impact: { latency: 1, scalability: 2, consistency: -1, complexity: -1, cost: -1 },
            },
          ],
        },
      ],
    },
    {
      id: 'step-2',
      title: 'Step 2',
      description: 'Second step',
      decisions: [
        {
          id: 'dec-3',
          category: 'api',
          question: 'Pick protocol',
          options: [
            {
              id: 'opt-e',
              label: 'E',
              description: 'E',
              pros: ['Standard'],
              cons: ['Verbose'],
              bestWhen: 'Public APIs',
              impact: { latency: 0, scalability: 0, consistency: 0, complexity: 1, cost: 0 },
            },
          ],
        },
      ],
    },
  ],
  referenceSolution: {
    decisions: {
      'dec-single': ['opt-a'],
      'dec-multi': ['opt-c', 'opt-d'],
      'dec-3': ['opt-e'],
    },
    explanation: 'Test',
    diagram: 'A → B',
  },
};

describe('useConstructorSession', () => {
  describe('initialization', () => {
    it('starts at step 0 with empty selections', () => {
      const { result } = renderHook(() => useConstructorSession(mockScenario));
      expect(result.current.state.currentStepIndex).toBe(0);
      expect(result.current.state.selections).toEqual({});
    });

    it('sets completed to false', () => {
      const { result } = renderHook(() => useConstructorSession(mockScenario));
      expect(result.current.state.completed).toBe(false);
    });

    it('currentStep returns the first step', () => {
      const { result } = renderHook(() => useConstructorSession(mockScenario));
      expect(result.current.currentStep.id).toBe('step-1');
    });

    it('metrics start at base values', () => {
      const { result } = renderHook(() => useConstructorSession(mockScenario));
      expect(result.current.metrics.latency).toBe(5);
      expect(result.current.metrics.scalability).toBe(5);
      expect(result.current.metrics.consistency).toBe(5);
      expect(result.current.metrics.complexity).toBe(5);
      expect(result.current.metrics.cost).toBe(5);
    });
  });

  describe('option selection', () => {
    it('selectOption adds option to selections for decision', () => {
      const { result } = renderHook(() => useConstructorSession(mockScenario));
      act(() => result.current.selectOption('dec-single', 'opt-a'));
      expect(result.current.state.selections['dec-single']).toEqual(['opt-a']);
    });

    it('selectOption replaces option for single-select decision', () => {
      const { result } = renderHook(() => useConstructorSession(mockScenario));
      act(() => result.current.selectOption('dec-single', 'opt-a'));
      act(() => result.current.selectOption('dec-single', 'opt-b'));
      expect(result.current.state.selections['dec-single']).toEqual(['opt-b']);
    });

    it('selectOption adds option for multiSelect decision', () => {
      const { result } = renderHook(() => useConstructorSession(mockScenario));
      act(() => result.current.selectOption('dec-multi', 'opt-c'));
      act(() => result.current.selectOption('dec-multi', 'opt-d'));
      expect(result.current.state.selections['dec-multi']).toEqual(['opt-c', 'opt-d']);
    });

    it('deselectOption removes option from multiSelect decision', () => {
      const { result } = renderHook(() => useConstructorSession(mockScenario));
      act(() => result.current.selectOption('dec-multi', 'opt-c'));
      act(() => result.current.selectOption('dec-multi', 'opt-d'));
      act(() => result.current.deselectOption('dec-multi', 'opt-c'));
      expect(result.current.state.selections['dec-multi']).toEqual(['opt-d']);
    });

    it('deselectOption clears single-select decision', () => {
      const { result } = renderHook(() => useConstructorSession(mockScenario));
      act(() => result.current.selectOption('dec-single', 'opt-a'));
      act(() => result.current.deselectOption('dec-single', 'opt-a'));
      expect(result.current.state.selections['dec-single']).toEqual([]);
    });

    it('metrics update after selection change', () => {
      const { result } = renderHook(() => useConstructorSession(mockScenario));
      act(() => result.current.selectOption('dec-single', 'opt-a'));
      expect(result.current.metrics.latency).toBe(7); // 5 + 2
    });
  });

  describe('navigation', () => {
    it('nextStep increments currentStepIndex', () => {
      const { result } = renderHook(() => useConstructorSession(mockScenario));
      act(() => result.current.nextStep());
      expect(result.current.state.currentStepIndex).toBe(1);
    });

    it('nextStep does nothing on last step', () => {
      const { result } = renderHook(() => useConstructorSession(mockScenario));
      act(() => result.current.nextStep());
      act(() => result.current.nextStep());
      expect(result.current.state.currentStepIndex).toBe(1);
    });

    it('prevStep decrements currentStepIndex', () => {
      const { result } = renderHook(() => useConstructorSession(mockScenario));
      act(() => result.current.nextStep());
      act(() => result.current.prevStep());
      expect(result.current.state.currentStepIndex).toBe(0);
    });

    it('prevStep does nothing on step 0', () => {
      const { result } = renderHook(() => useConstructorSession(mockScenario));
      act(() => result.current.prevStep());
      expect(result.current.state.currentStepIndex).toBe(0);
    });

    it('goToStep navigates to any valid step', () => {
      const { result } = renderHook(() => useConstructorSession(mockScenario));
      act(() => result.current.goToStep(1));
      expect(result.current.state.currentStepIndex).toBe(1);
    });

    it('goToStep does not navigate beyond valid range', () => {
      const { result } = renderHook(() => useConstructorSession(mockScenario));
      act(() => result.current.goToStep(99));
      expect(result.current.state.currentStepIndex).toBe(0);
    });
  });

  describe('completion', () => {
    it('finish sets completed to true', () => {
      const { result } = renderHook(() => useConstructorSession(mockScenario));
      act(() => result.current.finish());
      expect(result.current.state.completed).toBe(true);
    });

    it('finish calculates score', () => {
      const { result } = renderHook(() => useConstructorSession(mockScenario));
      act(() => result.current.selectOption('dec-single', 'opt-a'));
      act(() => result.current.selectOption('dec-multi', 'opt-c'));
      act(() => result.current.selectOption('dec-multi', 'opt-d'));
      act(() => result.current.selectOption('dec-3', 'opt-e'));
      act(() => result.current.finish());
      expect(result.current.score).toBe(100);
    });

    it('reset clears all state to initial', () => {
      const { result } = renderHook(() => useConstructorSession(mockScenario));
      act(() => result.current.selectOption('dec-single', 'opt-a'));
      act(() => result.current.nextStep());
      act(() => result.current.finish());
      act(() => result.current.reset());
      expect(result.current.state.currentStepIndex).toBe(0);
      expect(result.current.state.selections).toEqual({});
      expect(result.current.state.completed).toBe(false);
      expect(result.current.score).toBeNull();
    });
  });

  describe('back navigation recalculation', () => {
    it('changing selection on previous step recalculates metrics from scratch', () => {
      const { result } = renderHook(() => useConstructorSession(mockScenario));
      act(() => result.current.selectOption('dec-single', 'opt-a'));
      expect(result.current.metrics.latency).toBe(7); // 5 + 2
      act(() => result.current.selectOption('dec-single', 'opt-b'));
      expect(result.current.metrics.latency).toBe(4); // 5 - 1 (recalculated, not cumulative)
    });

    it('selections on later steps are preserved when going back', () => {
      const { result } = renderHook(() => useConstructorSession(mockScenario));
      act(() => result.current.selectOption('dec-single', 'opt-a'));
      act(() => result.current.nextStep());
      act(() => result.current.selectOption('dec-3', 'opt-e'));
      act(() => result.current.prevStep());
      expect(result.current.state.selections['dec-3']).toEqual(['opt-e']);
    });
  });
});
