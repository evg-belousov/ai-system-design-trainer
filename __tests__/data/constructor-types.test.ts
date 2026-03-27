import { describe, it, expect } from 'vitest';
import type {
  Scenario,
  Step,
  Decision,
  Option,
  Impact,
  ReferenceSolution,
  MetricKey,
} from '@/data/constructor/types';

describe('Constructor types', () => {
  it('should allow creating a valid Scenario', () => {
    const scenario: Scenario = {
      id: 'test-scenario',
      title: 'Test Scenario',
      description: 'A test scenario',
      difficulty: 'middle',
      steps: [],
      referenceSolution: {
        decisions: {},
        explanation: 'Test explanation',
        diagram: 'Test diagram',
      },
    };

    expect(scenario.id).toBe('test-scenario');
    expect(scenario.difficulty).toBe('middle');
  });

  it('should allow creating a Step with decisions', () => {
    const step: Step = {
      id: 'step-1',
      title: 'Requirements',
      description: 'Clarify requirements',
      decisions: [
        {
          id: 'dec-1',
          category: 'storage',
          question: 'Which database?',
          options: [],
        },
      ],
      tip: 'Think about read/write ratio',
    };

    expect(step.decisions).toHaveLength(1);
    expect(step.tip).toBeDefined();
  });

  it('should allow creating a Decision with multiSelect', () => {
    const decision: Decision = {
      id: 'dec-multi',
      category: 'caching',
      question: 'Which caching layers?',
      options: [],
      multiSelect: true,
    };

    expect(decision.multiSelect).toBe(true);
  });

  it('should allow creating an Option with impact', () => {
    const option: Option = {
      id: 'opt-redis',
      label: 'Redis',
      description: 'In-memory key-value store',
      pros: ['Sub-millisecond latency', 'Rich data structures'],
      cons: ['Memory-bound', 'Single-threaded per shard'],
      bestWhen: 'Need low-latency caching or session storage',
      impact: {
        latency: 2,
        scalability: 1,
        consistency: -1,
        complexity: 0,
        cost: -1,
      },
    };

    expect(option.pros).toHaveLength(2);
    expect(option.cons).toHaveLength(2);
    expect(option.impact.latency).toBe(2);
  });

  it('should allow creating a ReferenceSolution', () => {
    const ref: ReferenceSolution = {
      decisions: {
        'dec-1': ['opt-a', 'opt-b'],
        'dec-2': ['opt-c'],
      },
      explanation: 'Detailed explanation of why these choices work together',
      diagram: '[ Client ] → [ LB ] → [ App ] → [ DB ]',
    };

    expect(Object.keys(ref.decisions)).toHaveLength(2);
    expect(ref.decisions['dec-1']).toHaveLength(2);
  });

  it('should define all 5 metric keys', () => {
    const keys: MetricKey[] = ['latency', 'scalability', 'consistency', 'complexity', 'cost'];
    expect(keys).toHaveLength(5);
  });
});
