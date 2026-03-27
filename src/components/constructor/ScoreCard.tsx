'use client';

interface ScoreCardProps {
  score: number;
  onReset: () => void;
}

export function ScoreCard({ score, onReset }: ScoreCardProps) {
  const color = score >= 75
    ? 'text-green-600 dark:text-green-400'
    : score >= 50
      ? 'text-yellow-600 dark:text-yellow-400'
      : 'text-red-600 dark:text-red-400';

  const bgRing = score >= 75
    ? 'border-green-500'
    : score >= 50
      ? 'border-yellow-500'
      : 'border-red-500';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 text-center">
      <div className={`w-24 h-24 rounded-full border-4 ${bgRing} flex items-center justify-center mx-auto mb-3`}>
        <span className={`text-3xl font-bold ${color}`}>{score}%</span>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {score >= 75
          ? 'Отличный результат! Ваше решение близко к эталону.'
          : score >= 50
            ? 'Хороший результат. Есть потенциал для улучшения.'
            : 'Есть над чем поработать. Изучите эталонное решение.'}
      </p>

      <button
        onClick={onReset}
        className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer"
      >
        Пройти заново
      </button>
    </div>
  );
}
