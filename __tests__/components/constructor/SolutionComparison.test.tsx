import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SolutionComparison } from '@/components/constructor/SolutionComparison';
import type { Scenario } from '@/data/constructor/types';

const mockScenario: Scenario = {
  id: 'test-scenario',
  title: 'Test Scenario',
  description: 'A test scenario',
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
          question: 'Which database?',
          options: [
            {
              id: 'opt-pg',
              label: 'PostgreSQL',
              description: 'Relational DB',
              pros: ['ACID'],
              cons: ['Scaling'],
              bestWhen: 'Consistency needed',
              impact: { latency: 5, scalability: 4, consistency: 9, complexity: 5, cost: 6 },
            },
            {
              id: 'opt-mongo',
              label: 'MongoDB',
              description: 'Document DB',
              pros: ['Flexible'],
              cons: ['Consistency'],
              bestWhen: 'Flexible schema',
              impact: { latency: 7, scalability: 8, consistency: 4, complexity: 6, cost: 5 },
            },
          ],
        },
        {
          id: 'dec-2',
          category: 'cache',
          question: 'Caching approach?',
          options: [
            {
              id: 'opt-redis',
              label: 'Redis',
              description: 'In-memory cache',
              pros: ['Fast'],
              cons: ['Cost'],
              bestWhen: 'Hot data',
              impact: { latency: 9, scalability: 6, consistency: 3, complexity: 4, cost: 3 },
            },
            {
              id: 'opt-memcached',
              label: 'Memcached',
              description: 'Simple cache',
              pros: ['Simple'],
              cons: ['Limited'],
              bestWhen: 'Simple caching',
              impact: { latency: 8, scalability: 7, consistency: 3, complexity: 7, cost: 4 },
            },
          ],
        },
      ],
    },
  ],
  referenceSolution: {
    decisions: {
      'dec-1': ['opt-pg'],
      'dec-2': ['opt-redis'],
    },
    explanation: 'PostgreSQL provides strong consistency. Redis adds fast caching.',
    diagram: 'Client -> API -> PostgreSQL\n         -> Redis',
  },
};

describe('SolutionComparison', () => {
  it('should render user and reference selections side by side', () => {
    const selections = { 'dec-1': ['opt-pg'], 'dec-2': ['opt-memcached'] };

    render(<SolutionComparison scenario={mockScenario} selections={selections} />);

    expect(screen.getByText('Сравнение с эталоном')).toBeInTheDocument();
    expect(screen.getByText('Which database?')).toBeInTheDocument();
    expect(screen.getByText('Caching approach?')).toBeInTheDocument();
    expect(screen.getAllByText('PostgreSQL').length).toBeGreaterThanOrEqual(1);
  });

  it('should highlight matching decisions with green styling', () => {
    const selections = { 'dec-1': ['opt-pg'], 'dec-2': ['opt-redis'] };

    const { container } = render(
      <SolutionComparison scenario={mockScenario} selections={selections} />,
    );

    // Both decisions match the reference — look for green backgrounds
    const greenBoxes = container.querySelectorAll('.bg-green-50');
    expect(greenBoxes.length).toBe(2);
  });

  it('should highlight differing decisions with red styling', () => {
    const selections = { 'dec-1': ['opt-mongo'], 'dec-2': ['opt-memcached'] };

    const { container } = render(
      <SolutionComparison scenario={mockScenario} selections={selections} />,
    );

    // Both decisions differ from reference — look for red backgrounds
    const redBoxes = container.querySelectorAll('.bg-red-50');
    expect(redBoxes.length).toBe(2);
  });

  it('should render explanation and diagram', () => {
    const selections = { 'dec-1': ['opt-pg'], 'dec-2': ['opt-redis'] };

    render(<SolutionComparison scenario={mockScenario} selections={selections} />);

    expect(screen.getByText('Объяснение эталонного решения')).toBeInTheDocument();
    expect(screen.getByText('PostgreSQL provides strong consistency. Redis adds fast caching.')).toBeInTheDocument();
    expect(screen.getByText('Архитектурная диаграмма')).toBeInTheDocument();
  });
});
