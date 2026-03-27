import Link from 'next/link';
import type { Scenario } from '@/data/constructor/types';

interface ScenarioCardProps {
  scenario: Scenario;
  progress?: { score: number | null; completedAt: string | null } | null;
}

export function ScenarioCard({ scenario, progress }: ScenarioCardProps) {
  return (
    <Link
      href={`/design/session?id=${scenario.id}`}
      className="block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {scenario.title}
        </h3>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
          scenario.difficulty === 'senior'
            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
        }`}>
          {scenario.difficulty}
        </span>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
        {scenario.description}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {scenario.steps.length} шагов · {scenario.steps.reduce((sum, s) => sum + s.decisions.length, 0)} решений
        </span>

        {progress?.completedAt && (
          <span className="text-xs font-medium text-green-600 dark:text-green-400">
            {progress.score !== null ? `${progress.score}%` : 'Пройден'}
          </span>
        )}
      </div>
    </Link>
  );
}
