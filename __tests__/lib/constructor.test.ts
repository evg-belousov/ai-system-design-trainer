import { describe, it, expect } from 'vitest';
import {
  getScenarios,
  getScenarioById,
  getScenariosByDifficulty,
  calculateMetrics,
  calculateScore,
} from '@/lib/constructor';
import type { Scenario } from '@/data/constructor/types';

const miniScenario: Scenario = {
  id: 'test-mini',
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
          id: 'dec-1',
          category: 'storage',
          question: 'Pick a DB',
          options: [
            {
              id: 'opt-a',
              label: 'Option A',
              description: 'Desc A',
              pros: ['Fast'],
              cons: ['Expensive'],
              bestWhen: 'Need speed',
              impact: { latency: 2, scalability: 1, consistency: -1, complexity: 0, cost: -2 },
            },
            {
              id: 'opt-b',
              label: 'Option B',
              description: 'Desc B',
              pros: ['Cheap'],
              cons: ['Slow'],
              bestWhen: 'Budget limited',
              impact: { latency: -1, scalability: -1, consistency: 2, complexity: 1, cost: 2 },
            },
          ],
        },
        {
          id: 'dec-2',
          category: 'caching',
          question: 'Pick cache',
          multiSelect: true,
          options: [
            {
              id: 'opt-c',
              label: 'Option C',
              description: 'Desc C',
              pros: ['Simple'],
              cons: ['Limited'],
              bestWhen: 'Small scale',
              impact: { latency: 1, scalability: 0, consistency: 0, complexity: 1, cost: 1 },
            },
            {
              id: 'opt-d',
              label: 'Option D',
              description: 'Desc D',
              pros: ['Scalable'],
              cons: ['Complex'],
              bestWhen: 'Large scale',
              impact: { latency: 2, scalability: 2, consistency: -1, complexity: -2, cost: -1 },
            },
          ],
        },
      ],
    },
  ],
  referenceSolution: {
    decisions: {
      'dec-1': ['opt-a'],
      'dec-2': ['opt-c', 'opt-d'],
    },
    explanation: 'Test explanation',
    diagram: '[ A ] → [ B ]',
  },
};

describe('getScenarios', () => {
  it('returns all 8 scenarios', () => {
    const scenarios = getScenarios();
    expect(scenarios).toHaveLength(8);
  });

  it('each scenario matches Scenario type shape', () => {
    const scenarios = getScenarios();
    for (const s of scenarios) {
      expect(s).toHaveProperty('id');
      expect(s).toHaveProperty('title');
      expect(s).toHaveProperty('steps');
      expect(s).toHaveProperty('referenceSolution');
    }
  });
});

describe('getScenarioById', () => {
  it('returns scenario for valid id', () => {
    const s = getScenarioById('url-shortener');
    expect(s).toBeDefined();
    expect(s!.id).toBe('url-shortener');
  });

  it('returns undefined for unknown id', () => {
    expect(getScenarioById('nonexistent')).toBeUndefined();
  });
});

describe('getScenariosByDifficulty', () => {
  it('filters middle scenarios correctly', () => {
    const middle = getScenariosByDifficulty('middle');
    expect(middle.length).toBeGreaterThan(0);
    for (const s of middle) {
      expect(s.difficulty).toBe('middle');
    }
  });

  it('filters senior scenarios correctly', () => {
    const senior = getScenariosByDifficulty('senior');
    expect(senior.length).toBeGreaterThan(0);
    for (const s of senior) {
      expect(s.difficulty).toBe('senior');
    }
  });
});

describe('calculateMetrics', () => {
  it('returns base metrics (all 5) when no selections', () => {
    const metrics = calculateMetrics(miniScenario, {});
    expect(metrics.latency).toBe(5);
    expect(metrics.scalability).toBe(5);
    expect(metrics.consistency).toBe(5);
    expect(metrics.complexity).toBe(5);
    expect(metrics.cost).toBe(5);
  });

  it('applies single option impact correctly', () => {
    const metrics = calculateMetrics(miniScenario, { 'dec-1': ['opt-a'] });
    expect(metrics.latency).toBe(7);      // 5 + 2
    expect(metrics.scalability).toBe(6);   // 5 + 1
    expect(metrics.consistency).toBe(4);   // 5 - 1
    expect(metrics.complexity).toBe(5);    // 5 + 0
    expect(metrics.cost).toBe(3);          // 5 - 2
  });

  it('sums impacts from multiple selections across decisions', () => {
    const metrics = calculateMetrics(miniScenario, {
      'dec-1': ['opt-a'],
      'dec-2': ['opt-c'],
    });
    expect(metrics.latency).toBe(8);      // 5 + 2 + 1
    expect(metrics.scalability).toBe(6);   // 5 + 1 + 0
    expect(metrics.consistency).toBe(4);   // 5 - 1 + 0
    expect(metrics.complexity).toBe(6);    // 5 + 0 + 1
    expect(metrics.cost).toBe(4);          // 5 - 2 + 1
  });

  it('clamps metric values to [0, 10] range', () => {
    // opt-a gives latency +2, opt-c gives +1, opt-d gives +2 = 5+2+1+2 = 10 (capped)
    const metrics = calculateMetrics(miniScenario, {
      'dec-1': ['opt-a'],
      'dec-2': ['opt-c', 'opt-d'],
    });
    expect(metrics.latency).toBe(10);
    // cost: 5 - 2 + 1 - 1 = 3
    expect(metrics.cost).toBe(3);
  });

  it('recalculates from scratch — changing selection resets', () => {
    const metricsA = calculateMetrics(miniScenario, { 'dec-1': ['opt-a'] });
    const metricsB = calculateMetrics(miniScenario, { 'dec-1': ['opt-b'] });
    // Different selections give different results (not cumulative)
    expect(metricsA.latency).toBe(7);  // 5 + 2
    expect(metricsB.latency).toBe(4);  // 5 - 1
  });

  it('handles multiSelect: sums impacts of all selected options in one decision', () => {
    const metrics = calculateMetrics(miniScenario, {
      'dec-2': ['opt-c', 'opt-d'],
    });
    expect(metrics.latency).toBe(8);      // 5 + 1 + 2
    expect(metrics.scalability).toBe(7);   // 5 + 0 + 2
    expect(metrics.consistency).toBe(4);   // 5 + 0 - 1
    expect(metrics.complexity).toBe(4);    // 5 + 1 - 2
    expect(metrics.cost).toBe(5);          // 5 + 1 - 1
  });
});

describe('calculateScore', () => {
  it('returns 100 when selections match reference exactly', () => {
    const score = calculateScore(miniScenario, {
      'dec-1': ['opt-a'],
      'dec-2': ['opt-c', 'opt-d'],
    });
    expect(score).toBe(100);
  });

  it('returns 0 when no selections match reference', () => {
    const score = calculateScore(miniScenario, {
      'dec-1': ['opt-b'],
      'dec-2': [],
    });
    expect(score).toBe(0);
  });

  it('returns partial score for partial match', () => {
    const score = calculateScore(miniScenario, {
      'dec-1': ['opt-a'],   // match
      'dec-2': ['opt-c'],   // partial: 1 of 2
    });
    // dec-1: Jaccard = 1/1 = 1.0
    // dec-2: Jaccard = 1/2 = 0.5
    // avg = (1.0 + 0.5) / 2 = 0.75 → 75
    expect(score).toBe(75);
  });

  it('handles multiSelect decisions: Jaccard similarity', () => {
    const score = calculateScore(miniScenario, {
      'dec-1': ['opt-a'],
      'dec-2': ['opt-d'],  // 1 correct out of 2 ref
    });
    // dec-1: 1/1 = 1.0
    // dec-2: intersection={opt-d}, union={opt-c, opt-d} → 1/2 = 0.5
    // avg = 0.75 → 75
    expect(score).toBe(75);
  });

  it('averages across all decisions', () => {
    const score = calculateScore(miniScenario, {
      'dec-1': ['opt-b'],       // 0/1 = 0
      'dec-2': ['opt-c', 'opt-d'], // 2/2 = 1
    });
    // avg = (0 + 1) / 2 = 0.5 → 50
    expect(score).toBe(50);
  });
});
