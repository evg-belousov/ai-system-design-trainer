'use client';

import { useState } from 'react';
import type { MetricKey } from '@/data/constructor/types';
import { RadarChart } from './RadarChart';

const METRIC_INFO: {
  key: MetricKey;
  label: string;
  description: string;
  lowMeans: string;
  highMeans: string;
}[] = [
  {
    key: 'latency',
    label: 'Latency',
    description: 'Скорость отклика системы для пользователя',
    lowMeans: 'Высокие задержки, медленный отклик',
    highMeans: 'Быстрый отклик, низкие задержки',
  },
  {
    key: 'scalability',
    label: 'Scalability',
    description: 'Способность системы расти под нагрузкой',
    lowMeans: 'Сложно масштабировать, упрётся в потолок',
    highMeans: 'Легко добавлять мощности, горизонтальный рост',
  },
  {
    key: 'consistency',
    label: 'Consistency',
    description: 'Гарантии согласованности данных (CAP-теорема)',
    lowMeans: 'Eventual consistency, возможны рассинхроны',
    highMeans: 'Strong consistency, данные всегда актуальны',
  },
  {
    key: 'complexity',
    label: 'Simplicity',
    description: 'Простота реализации и поддержки',
    lowMeans: 'Сложная система, трудно поддерживать и дебажить',
    highMeans: 'Простое решение, легко понять и развивать',
  },
  {
    key: 'cost',
    label: 'Cost Efficiency',
    description: 'Стоимость инфраструктуры и операционных расходов',
    lowMeans: 'Дорого: много серверов, лицензий, трафика',
    highMeans: 'Экономичное решение, разумные расходы',
  },
];

interface MetricsPanelProps {
  metrics: Record<MetricKey, number>;
  reference?: Record<MetricKey, number>;
}

function getColor(value: number): string {
  if (value >= 7) return 'text-green-600 dark:text-green-400';
  if (value >= 4) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
}

function getBar(value: number): string {
  if (value >= 7) return 'bg-green-500';
  if (value >= 4) return 'bg-yellow-500';
  return 'bg-red-500';
}

export function MetricsPanel({ metrics, reference }: MetricsPanelProps) {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Метрики системы
        </h3>
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
        >
          {showHelp ? 'Скрыть' : 'Что это?'}
        </button>
      </div>

      {showHelp && (
        <div className="mb-3 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 rounded-lg p-2.5 space-y-1">
          <p>Каждый ваш выбор влияет на характеристики системы. Шкала от 0 до 10:</p>
          <p><span className="text-green-600 dark:text-green-400 font-medium">7–10</span> — сильная сторона вашей архитектуры</p>
          <p><span className="text-yellow-600 dark:text-yellow-400 font-medium">4–6</span> — приемлемо, но есть компромисс</p>
          <p><span className="text-red-600 dark:text-red-400 font-medium">0–3</span> — слабое место, потребует внимания</p>
          <p className="pt-1">В реальных системах невозможно получить 10 по всем метрикам — это и есть суть trade-offs. Например, выбор Cassandra повышает scalability, но снижает consistency.</p>
        </div>
      )}

      <RadarChart values={metrics} reference={reference} />

      <div className="mt-4 space-y-3">
        {METRIC_INFO.map(({ key, label, description, lowMeans, highMeans }) => (
          <div key={key} className="group relative">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600 dark:text-gray-400 w-28 font-medium cursor-help">{label}</span>
              <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${getBar(metrics[key])}`}
                  style={{ width: `${(metrics[key] / 10) * 100}%` }}
                />
              </div>
              <span className={`text-xs font-mono w-6 text-right ${getColor(metrics[key])}`}>
                {metrics[key]}
              </span>
            </div>
            <div className="invisible group-hover:visible absolute left-0 top-full z-10 mt-1 w-64 bg-gray-900 dark:bg-gray-700 text-white text-[10px] rounded-lg px-2.5 py-2 shadow-lg pointer-events-none">
              <p className="font-medium mb-0.5">{description}</p>
              <p><span className="text-red-300">0:</span> {lowMeans}</p>
              <p><span className="text-green-300">10:</span> {highMeans}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
