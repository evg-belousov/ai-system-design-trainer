'use client';

interface ResultCardProps {
  correct: boolean;
  explanation: string;
  onNext: () => void;
  aiFeedback?: string | null;
}

export function ResultCard({ correct, explanation, onNext, aiFeedback }: ResultCardProps) {
  return (
    <div className={`mt-6 p-6 rounded-lg border ${correct ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'}`}>
      <h3 className={`text-lg font-semibold mb-3 ${correct ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
        {correct ? 'Правильно!' : 'Неправильно'}
      </h3>
      <p className="text-gray-700 dark:text-gray-300 mb-4">{explanation}</p>

      {aiFeedback && (
        <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Оценка AI:</h4>
          <p className="text-gray-700 dark:text-gray-300">{aiFeedback}</p>
        </div>
      )}

      <button
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        onClick={onNext}
      >
        Далее
      </button>
    </div>
  );
}
