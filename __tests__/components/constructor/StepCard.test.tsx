import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StepCard } from '@/components/constructor/StepCard';
import type { Step } from '@/data/constructor/types';

const makeStep = (overrides?: Partial<Step>): Step => ({
  id: 'step-1',
  title: 'Choose Database',
  description: 'Select the database engine for the system',
  decisions: [
    {
      id: 'dec-1',
      category: 'storage',
      question: 'Which database type?',
      options: [
        {
          id: 'opt-sql',
          label: 'PostgreSQL',
          description: 'Relational database',
          pros: ['ACID compliance'],
          cons: ['Scaling complexity'],
          bestWhen: 'Strong consistency needed',
          impact: { latency: 5, scalability: 4, consistency: 9, complexity: 5, cost: 6 },
        },
        {
          id: 'opt-nosql',
          label: 'MongoDB',
          description: 'Document database',
          pros: ['Flexible schema'],
          cons: ['Eventual consistency'],
          bestWhen: 'Schema changes frequently',
          impact: { latency: 7, scalability: 8, consistency: 4, complexity: 6, cost: 5 },
        },
      ],
    },
    {
      id: 'dec-2',
      category: 'caching',
      question: 'Caching strategy?',
      options: [
        {
          id: 'opt-redis',
          label: 'Redis',
          description: 'In-memory cache',
          pros: ['Fast'],
          cons: ['Cost'],
          bestWhen: 'Hot data access',
          impact: { latency: 9, scalability: 6, consistency: 3, complexity: 4, cost: 3 },
        },
      ],
    },
  ],
  ...overrides,
});

describe('StepCard', () => {
  it('should render step title', () => {
    render(
      <StepCard
        step={makeStep()}
        selections={{}}
        onSelect={() => {}}
        onDeselect={() => {}}
      />,
    );

    expect(screen.getByText('Choose Database')).toBeInTheDocument();
  });

  it('should render all decisions', () => {
    render(
      <StepCard
        step={makeStep()}
        selections={{}}
        onSelect={() => {}}
        onDeselect={() => {}}
      />,
    );

    expect(screen.getByText('Which database type?')).toBeInTheDocument();
    expect(screen.getByText('Caching strategy?')).toBeInTheDocument();
    expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
    expect(screen.getByText('MongoDB')).toBeInTheDocument();
    expect(screen.getByText('Redis')).toBeInTheDocument();
  });

  it('should show TipReveal when tip exists', () => {
    render(
      <StepCard
        step={makeStep({ tip: 'Consider read/write ratio' })}
        selections={{}}
        onSelect={() => {}}
        onDeselect={() => {}}
      />,
    );

    expect(screen.getByText('Показать подсказку')).toBeInTheDocument();
  });

  it('should not show TipReveal when no tip', () => {
    render(
      <StepCard
        step={makeStep({ tip: undefined })}
        selections={{}}
        onSelect={() => {}}
        onDeselect={() => {}}
      />,
    );

    expect(screen.queryByText('Показать подсказку')).not.toBeInTheDocument();
  });

  it('should show tip text on click', () => {
    render(
      <StepCard
        step={makeStep({ tip: 'Consider read/write ratio' })}
        selections={{}}
        onSelect={() => {}}
        onDeselect={() => {}}
      />,
    );

    // Tip is hidden by default
    expect(screen.queryByText('Consider read/write ratio')).not.toBeInTheDocument();

    // Click to reveal
    fireEvent.click(screen.getByText('Показать подсказку'));
    expect(screen.getByText('Consider read/write ratio')).toBeInTheDocument();
  });
});
