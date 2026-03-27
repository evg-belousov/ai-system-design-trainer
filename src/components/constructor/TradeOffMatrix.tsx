'use client';

import type { MetricKey } from '@/data/constructor/types';

const METRIC_DETAILS: Record<MetricKey, { label: string; strongText: string; weakText: string }> = {
  latency: {
    label: 'Latency',
    strongText: 'Быстрый отклик — пользователи не ждут',
    weakText: 'Высокие задержки — пользователи будут уходить',
  },
  scalability: {
    label: 'Scalability',
    strongText: 'Система готова к росту нагрузки',
    weakText: 'При росте трафика система упрётся в потолок',
  },
  consistency: {
    label: 'Consistency',
    strongText: 'Данные всегда актуальны и согласованы',
    weakText: 'Возможны рассинхроны — пользователь может видеть устаревшие данные',
  },
  complexity: {
    label: 'Simplicity',
    strongText: 'Простая система — легко поддерживать и онбордить новых инженеров',
    weakText: 'Высокая сложность — долгий онбординг, сложный дебаг',
  },
  cost: {
    label: 'Cost Efficiency',
    strongText: 'Экономичное решение — разумные расходы на инфраструктуру',
    weakText: 'Дорогая инфраструктура — высокие расходы на серверы и сервисы',
  },
};

const METRIC_KEYS: MetricKey[] = ['latency', 'scalability', 'consistency', 'complexity', 'cost'];

interface TradeOffMatrixProps {
  metrics: Record<MetricKey, number>;
}

export function TradeOffMatrix({ metrics }: TradeOffMatrixProps) {
  const strengths = METRIC_KEYS.filter(k => metrics[k] >= 7);
  const neutral = METRIC_KEYS.filter(k => metrics[k] >= 4 && metrics[k] < 7);
  const weaknesses = METRIC_KEYS.filter(k => metrics[k] < 4);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Trade-off анализ</h3>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
        Каждое архитектурное решение — это компромисс. Нельзя оптимизировать всё одновременно. Ниже — что вы выиграли и чем пожертвовали.
      </p>

      <div className="space-y-4">
        {strengths.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-green-700 dark:text-green-400 mb-1.5">
              Вы выиграли
            </h4>
            <div className="space-y-1.5">
              {strengths.map(k => (
                <div key={k} className="flex items-start gap-2 bg-green-50 dark:bg-green-900/10 rounded-lg px-2.5 py-1.5">
                  <span className="text-xs font-medium text-green-700 dark:text-green-400 w-28 shrink-0">
                    {METRIC_DETAILS[k].label} ({metrics[k]})
                  </span>
                  <span className="text-xs text-green-600 dark:text-green-400/80">
                    {METRIC_DETAILS[k].strongText}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {neutral.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-yellow-700 dark:text-yellow-400 mb-1.5">
              Компромисс
            </h4>
            <div className="space-y-1.5">
              {neutral.map(k => (
                <div key={k} className="flex items-start gap-2 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg px-2.5 py-1.5">
                  <span className="text-xs font-medium text-yellow-700 dark:text-yellow-400 w-28 shrink-0">
                    {METRIC_DETAILS[k].label} ({metrics[k]})
                  </span>
                  <span className="text-xs text-yellow-600 dark:text-yellow-400/80">
                    Приемлемо, но при росте может потребовать доработки
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {weaknesses.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-red-700 dark:text-red-400 mb-1.5">
              Чем пожертвовали
            </h4>
            <div className="space-y-1.5">
              {weaknesses.map(k => (
                <div key={k} className="flex items-start gap-2 bg-red-50 dark:bg-red-900/10 rounded-lg px-2.5 py-1.5">
                  <span className="text-xs font-medium text-red-700 dark:text-red-400 w-28 shrink-0">
                    {METRIC_DETAILS[k].label} ({metrics[k]})
                  </span>
                  <span className="text-xs text-red-600 dark:text-red-400/80">
                    {METRIC_DETAILS[k].weakText}
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
