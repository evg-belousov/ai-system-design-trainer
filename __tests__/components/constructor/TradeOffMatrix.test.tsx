import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TradeOffMatrix } from '@/components/constructor/TradeOffMatrix';
import type { MetricKey } from '@/data/constructor/types';

describe('TradeOffMatrix', () => {
  it('should render all 5 metrics', () => {
    const metrics: Record<MetricKey, number> = {
      latency: 8,
      scalability: 5,
      consistency: 3,
      complexity: 7,
      cost: 6,
    };

    render(<TradeOffMatrix metrics={metrics} />);

    expect(screen.getByText(/Latency/)).toBeInTheDocument();
    expect(screen.getByText(/Scalability/)).toBeInTheDocument();
    expect(screen.getByText(/Consistency/)).toBeInTheDocument();
    expect(screen.getByText(/Simplicity/)).toBeInTheDocument();
    expect(screen.getByText(/Cost Efficiency/)).toBeInTheDocument();
  });

  it('should show metrics >= 7 as strengths', () => {
    const metrics: Record<MetricKey, number> = {
      latency: 9,
      scalability: 8,
      consistency: 5,
      complexity: 3,
      cost: 2,
    };

    render(<TradeOffMatrix metrics={metrics} />);

    expect(screen.getByText('Сильные стороны')).toBeInTheDocument();
    expect(screen.getByText('Latency (9)')).toBeInTheDocument();
    expect(screen.getByText('Scalability (8)')).toBeInTheDocument();
  });

  it('should show metrics < 4 as weaknesses', () => {
    const metrics: Record<MetricKey, number> = {
      latency: 9,
      scalability: 8,
      consistency: 5,
      complexity: 3,
      cost: 2,
    };

    render(<TradeOffMatrix metrics={metrics} />);

    expect(screen.getByText('Слабые стороны')).toBeInTheDocument();
    expect(screen.getByText('Simplicity (3)')).toBeInTheDocument();
    expect(screen.getByText('Cost Efficiency (2)')).toBeInTheDocument();
  });
});
