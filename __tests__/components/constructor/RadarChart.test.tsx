import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RadarChart } from '@/components/constructor/RadarChart';
import type { MetricKey } from '@/data/constructor/types';

const baseValues: Record<MetricKey, number> = {
  latency: 8,
  scalability: 6,
  consistency: 7,
  complexity: 5,
  cost: 4,
};

const referenceValues: Record<MetricKey, number> = {
  latency: 9,
  scalability: 8,
  consistency: 6,
  complexity: 7,
  cost: 5,
};

describe('RadarChart', () => {
  it('should render SVG element', () => {
    render(<RadarChart values={baseValues} />);

    const svg = screen.getByRole('img', { name: 'Radar chart' });
    expect(svg).toBeInTheDocument();
    expect(svg.tagName).toBe('svg');
  });

  it('should render 5 axis labels', () => {
    render(<RadarChart values={baseValues} />);

    expect(screen.getByText('Latency')).toBeInTheDocument();
    expect(screen.getByText('Scalability')).toBeInTheDocument();
    expect(screen.getByText('Consistency')).toBeInTheDocument();
    expect(screen.getByText('Simplicity')).toBeInTheDocument();
    expect(screen.getByText('Cost Efficiency')).toBeInTheDocument();
  });

  it('should render polygon for values', () => {
    const { container } = render(<RadarChart values={baseValues} />);

    // Grid polygons (5) + values polygon (1) = 6
    const polygons = container.querySelectorAll('polygon');
    expect(polygons.length).toBeGreaterThanOrEqual(6);

    // The values polygon has green stroke
    const valuesPolygon = Array.from(polygons).find(
      p => p.getAttribute('stroke') === 'rgb(16, 185, 129)',
    );
    expect(valuesPolygon).toBeDefined();
  });

  it('should render reference polygon when provided', () => {
    const { container } = render(
      <RadarChart values={baseValues} reference={referenceValues} />,
    );

    // Grid polygons (5) + reference (1) + values (1) = 7
    const polygons = container.querySelectorAll('polygon');
    expect(polygons.length).toBeGreaterThanOrEqual(7);

    // The reference polygon has blue stroke and dashed line
    const refPolygon = Array.from(polygons).find(
      p => p.getAttribute('stroke') === 'rgb(59, 130, 246)',
    );
    expect(refPolygon).toBeDefined();
    expect(refPolygon?.getAttribute('stroke-dasharray')).toBe('4 2');
  });
});
