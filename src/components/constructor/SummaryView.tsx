'use client';

import type { Scenario, MetricKey } from '@/data/constructor/types';
import { calculateMetrics } from '@/lib/constructor';
import { ScoreCard } from './ScoreCard';
import { TradeOffMatrix } from './TradeOffMatrix';
import { SolutionComparison } from './SolutionComparison';
import { MetricsPanel } from './MetricsPanel';

interface SummaryViewProps {
  scenario: Scenario;
  selections: Record<string, string[]>;
  score: number;
  onReset: () => void;
}

export function SummaryView({ scenario, selections, score, onReset }: SummaryViewProps) {
  const userMetrics = calculateMetrics(scenario, selections);
  const refMetrics = calculateMetrics(scenario, scenario.referenceSolution.decisions);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Результаты</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <ScoreCard score={score} onReset={onReset} />
        <MetricsPanel metrics={userMetrics} reference={refMetrics} />
      </div>

      <TradeOffMatrix metrics={userMetrics} />
      <SolutionComparison scenario={scenario} selections={selections} />
    </div>
  );
}
