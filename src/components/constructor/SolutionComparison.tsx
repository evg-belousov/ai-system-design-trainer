'use client';

import type { Scenario } from '@/data/constructor/types';

function renderSimpleMarkdown(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-gray-800 dark:text-gray-200">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

interface SolutionComparisonProps {
  scenario: Scenario;
  selections: Record<string, string[]>;
}

export function SolutionComparison({ scenario, selections }: SolutionComparisonProps) {
  const ref = scenario.referenceSolution;
  const allDecisions = scenario.steps.flatMap(s => s.decisions);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-4">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Сравнение с эталоном</h3>

      <div className="space-y-3">
        {allDecisions.map(decision => {
          const userOpts = selections[decision.id] ?? [];
          const refOpts = ref.decisions[decision.id] ?? [];
          const userSet = new Set(userOpts);
          const refSet = new Set(refOpts);
          const isMatch = userOpts.length === refOpts.length && userOpts.every(o => refSet.has(o));

          return (
            <div
              key={decision.id}
              className={`rounded-lg p-3 text-xs ${
                isMatch
                  ? 'bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800'
              }`}
            >
              <div className="font-medium text-gray-900 dark:text-white mb-1">
                {decision.question}
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <span className="text-gray-500 dark:text-gray-400">Ваш выбор: </span>
                  <span className="text-gray-900 dark:text-white">
                    {userOpts.length > 0
                      ? decision.options.filter(o => userSet.has(o.id)).map(o => o.label).join(', ')
                      : '—'}
                  </span>
                </div>
                <div className="flex-1">
                  <span className="text-gray-500 dark:text-gray-400">Эталон: </span>
                  <span className="text-gray-900 dark:text-white">
                    {decision.options.filter(o => refSet.has(o.id)).map(o => o.label).join(', ')}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Объяснение эталонного решения</h4>
        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-2">
          {ref.explanation.split('\n\n').map((paragraph, i) => (
            <p key={i} className="whitespace-pre-line">{renderSimpleMarkdown(paragraph)}</p>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Архитектурная диаграмма</h4>
        <pre className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 rounded-lg p-3 overflow-x-auto">
          {ref.diagram}
        </pre>
      </div>
    </div>
  );
}
