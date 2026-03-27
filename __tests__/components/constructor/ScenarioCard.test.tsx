import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScenarioCard } from '@/components/constructor/ScenarioCard';
import type { Scenario } from '@/data/constructor/types';

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

const mockScenario: Scenario = {
  id: 'url-shortener',
  title: 'URL Shortener',
  description: 'Design a URL shortening service like bit.ly',
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
          question: 'Database?',
          options: [],
        },
        {
          id: 'dec-2',
          category: 'api',
          question: 'API style?',
          options: [],
        },
      ],
    },
  ],
  referenceSolution: {
    decisions: {},
    explanation: 'Reference explanation',
    diagram: 'diagram-text',
  },
};

describe('ScenarioCard', () => {
  it('should render title and description', () => {
    render(<ScenarioCard scenario={mockScenario} />);

    expect(screen.getByText('URL Shortener')).toBeInTheDocument();
    expect(screen.getByText('Design a URL shortening service like bit.ly')).toBeInTheDocument();
  });

  it('should render difficulty badge', () => {
    render(<ScenarioCard scenario={mockScenario} />);

    expect(screen.getByText('middle')).toBeInTheDocument();
  });

  it('should render completed badge with score', () => {
    render(
      <ScenarioCard
        scenario={mockScenario}
        progress={{ score: 85, completedAt: '2025-01-15' }}
      />,
    );

    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  it('should render link to session page', () => {
    render(<ScenarioCard scenario={mockScenario} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/design/session?id=url-shortener');
  });

  it('should not render completed badge without progress', () => {
    render(<ScenarioCard scenario={mockScenario} />);

    expect(screen.queryByText('Пройден')).not.toBeInTheDocument();
    expect(screen.queryByText(/%$/)).not.toBeInTheDocument();
  });
});
