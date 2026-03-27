import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MetricsPanel } from '@/components/constructor/MetricsPanel';
import type { MetricKey } from '@/data/constructor/types';

const baseMetrics: Record<MetricKey, number> = {
  latency: 8,
  scalability: 6,
  consistency: 7,
  complexity: 5,
  cost: 3,
};

describe('MetricsPanel', () => {
  it('should render all 5 metric labels', () => {
    render(<MetricsPanel metrics={baseMetrics} />);

    // Labels appear in both RadarChart and the bar list, so use getAllByText
    expect(screen.getAllByText('Latency').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Scalability').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Consistency').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Simplicity').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Cost Efficiency').length).toBeGreaterThanOrEqual(1);
  });

  it('should render RadarChart', () => {
    render(<MetricsPanel metrics={baseMetrics} />);

    const svg = screen.getByRole('img', { name: 'Radar chart' });
    expect(svg).toBeInTheDocument();
  });

  it('should update when metrics prop changes', () => {
    const { rerender } = render(<MetricsPanel metrics={baseMetrics} />);

    // Initial values displayed
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();

    const updatedMetrics: Record<MetricKey, number> = {
      latency: 2,
      scalability: 9,
      consistency: 4,
      complexity: 6,
      cost: 7,
    };

    rerender(<MetricsPanel metrics={updatedMetrics} />);

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
  });
});
