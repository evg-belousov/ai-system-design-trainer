import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { OptionCard } from '@/components/constructor/OptionCard';
import type { Option } from '@/data/constructor/types';

const mockOption: Option = {
  id: 'opt-1',
  label: 'Redis Cache',
  description: 'In-memory cache for fast reads',
  pros: ['Low latency', 'Simple setup'],
  cons: ['Memory cost', 'Cache invalidation'],
  bestWhen: 'Read-heavy workloads with tolerance for stale data',
  impact: {
    latency: 3,
    scalability: 1,
    consistency: -2,
    complexity: -1,
    cost: -1,
  },
};

describe('OptionCard', () => {
  it('should render label and description', () => {
    render(<OptionCard option={mockOption} selected={false} onToggle={() => {}} />);

    expect(screen.getByText('Redis Cache')).toBeInTheDocument();
    expect(screen.getByText('In-memory cache for fast reads')).toBeInTheDocument();
  });

  it('should show pros, cons, and bestWhen on expand', () => {
    render(<OptionCard option={mockOption} selected={false} onToggle={() => {}} />);

    // Details hidden initially
    expect(screen.queryByText(/Low latency/)).not.toBeInTheDocument();

    // Click expand button
    fireEvent.click(screen.getByText('Подробнее'));

    expect(screen.getByText(/Low latency, Simple setup/)).toBeInTheDocument();
    expect(screen.getByText(/Memory cost, Cache invalidation/)).toBeInTheDocument();
    expect(screen.getByText(/Read-heavy workloads/)).toBeInTheDocument();
  });

  it('should apply selected styling', () => {
    render(<OptionCard option={mockOption} selected={true} onToggle={() => {}} />);

    expect(screen.getByText('Выбрано')).toBeInTheDocument();
  });

  it('should call onToggle when clicked', () => {
    const onToggle = vi.fn();
    render(<OptionCard option={mockOption} selected={false} onToggle={onToggle} />);

    fireEvent.click(screen.getByText('Redis Cache'));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('should render impact indicators via expand', () => {
    render(<OptionCard option={mockOption} selected={false} onToggle={() => {}} />);

    fireEvent.click(screen.getByText('Подробнее'));

    // Pros and cons are rendered as impact details
    expect(screen.getByText('Плюсы:')).toBeInTheDocument();
    expect(screen.getByText('Минусы:')).toBeInTheDocument();
    expect(screen.getByText('Лучше всего когда:')).toBeInTheDocument();
  });
});
