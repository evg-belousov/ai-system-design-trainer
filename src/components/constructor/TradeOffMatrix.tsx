'use client';

import type { MetricKey } from '@/data/constructor/types';
import { useT } from '@/i18n/useT';

const METRIC_KEYS: MetricKey[] = ['latency', 'scalability', 'consistency', 'complexity', 'cost'];

interface TradeOffMatrixProps {
  metrics: Record<MetricKey, number>;
}

export function TradeOffMatrix({ metrics }: TradeOffMatrixProps) {
  const t = useT();
  const strengths = METRIC_KEYS.filter(k => metrics[k] >= 7);
  const neutral = METRIC_KEYS.filter(k => metrics[k] >= 4 && metrics[k] < 7);
  const weaknesses = METRIC_KEYS.filter(k => metrics[k] < 4);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{t.tradeoff.title}</h3>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
        {t.tradeoff.intro}
      </p>

      <div className="space-y-4">
        {strengths.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-green-700 dark:text-green-400 mb-1.5">
              {t.tradeoff.won}
            </h4>
            <div className="space-y-1.5">
              {strengths.map(k => (
                <div key={k} className="flex items-start gap-2 bg-green-50 dark:bg-green-900/10 rounded-lg px-2.5 py-1.5">
                  <span className="text-xs font-medium text-green-700 dark:text-green-400 w-28 shrink-0">
                    {t.metrics[k].label} ({metrics[k]})
                  </span>
                  <span className="text-xs text-green-600 dark:text-green-400/80">
                    {t.metrics[k].strong}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {neutral.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-yellow-700 dark:text-yellow-400 mb-1.5">
              {t.tradeoff.compromise}
            </h4>
            <div className="space-y-1.5">
              {neutral.map(k => (
                <div key={k} className="flex items-start gap-2 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg px-2.5 py-1.5">
                  <span className="text-xs font-medium text-yellow-700 dark:text-yellow-400 w-28 shrink-0">
                    {t.metrics[k].label} ({metrics[k]})
                  </span>
                  <span className="text-xs text-yellow-600 dark:text-yellow-400/80">
                    {t.tradeoff.neutralText}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {weaknesses.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-red-700 dark:text-red-400 mb-1.5">
              {t.tradeoff.sacrificed}
            </h4>
            <div className="space-y-1.5">
              {weaknesses.map(k => (
                <div key={k} className="flex items-start gap-2 bg-red-50 dark:bg-red-900/10 rounded-lg px-2.5 py-1.5">
                  <span className="text-xs font-medium text-red-700 dark:text-red-400 w-28 shrink-0">
                    {t.metrics[k].label} ({metrics[k]})
                  </span>
                  <span className="text-xs text-red-600 dark:text-red-400/80">
                    {t.metrics[k].weak}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
