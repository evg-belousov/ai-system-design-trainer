'use client';

import type { MetricKey } from '@/data/constructor/types';

const METRIC_LABELS: Record<MetricKey, string> = {
  latency: 'Latency',
  scalability: 'Scalability',
  consistency: 'Consistency',
  complexity: 'Simplicity',
  cost: 'Cost Efficiency',
};

const METRICS_ORDER: MetricKey[] = ['latency', 'scalability', 'consistency', 'complexity', 'cost'];

interface RadarChartProps {
  values: Record<MetricKey, number>;
  reference?: Record<MetricKey, number>;
  max?: number;
  size?: number;
}

export function RadarChart({ values, reference, max = 10, size = 240 }: RadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 30;
  const angleStep = (2 * Math.PI) / METRICS_ORDER.length;
  const startAngle = -Math.PI / 2;

  function getPoint(index: number, value: number): [number, number] {
    const angle = startAngle + index * angleStep;
    const r = (value / max) * radius;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  }

  function polygon(vals: Record<MetricKey, number>): string {
    return METRICS_ORDER.map((key, i) => getPoint(i, vals[key]).join(',')).join(' ');
  }

  const gridLevels = [2, 4, 6, 8, 10];

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="mx-auto"
      role="img"
      aria-label="Radar chart"
    >
      {/* Grid circles */}
      {gridLevels.map(level => (
        <polygon
          key={level}
          points={METRICS_ORDER.map((_, i) => getPoint(i, level).join(',')).join(' ')}
          fill="none"
          stroke="currentColor"
          className="text-gray-200 dark:text-gray-700"
          strokeWidth={level === max ? 1.5 : 0.5}
        />
      ))}

      {/* Axes */}
      {METRICS_ORDER.map((_, i) => {
        const [x, y] = getPoint(i, max);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke="currentColor"
            className="text-gray-200 dark:text-gray-700"
            strokeWidth={0.5}
          />
        );
      })}

      {/* Reference polygon */}
      {reference && (
        <polygon
          points={polygon(reference)}
          fill="rgba(59, 130, 246, 0.1)"
          stroke="rgb(59, 130, 246)"
          strokeWidth={1.5}
          strokeDasharray="4 2"
        />
      )}

      {/* Values polygon */}
      <polygon
        points={polygon(values)}
        fill="rgba(16, 185, 129, 0.2)"
        stroke="rgb(16, 185, 129)"
        strokeWidth={2}
      />

      {/* Value dots */}
      {METRICS_ORDER.map((key, i) => {
        const [x, y] = getPoint(i, values[key]);
        return <circle key={key} cx={x} cy={y} r={3} fill="rgb(16, 185, 129)" />;
      })}

      {/* Labels */}
      {METRICS_ORDER.map((key, i) => {
        const angle = startAngle + i * angleStep;
        const labelRadius = radius + 18;
        const lx = cx + labelRadius * Math.cos(angle);
        const ly = cy + labelRadius * Math.sin(angle);
        return (
          <text
            key={key}
            x={lx}
            y={ly}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-gray-600 dark:fill-gray-400 text-[10px]"
          >
            {METRIC_LABELS[key]}
          </text>
        );
      })}
    </svg>
  );
}
