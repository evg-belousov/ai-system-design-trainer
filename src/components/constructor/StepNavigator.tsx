'use client';

import type { Step } from '@/data/constructor/types';

interface StepNavigatorProps {
  steps: Step[];
  currentIndex: number;
  onGoToStep: (index: number) => void;
}

export function StepNavigator({ steps, currentIndex, onGoToStep }: StepNavigatorProps) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-2">
      {steps.map((step, i) => (
        <button
          key={step.id}
          onClick={() => onGoToStep(i)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
            i === currentIndex
              ? 'bg-blue-600 text-white'
              : i < currentIndex
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
            i === currentIndex
              ? 'bg-white/20'
              : i < currentIndex
                ? 'bg-green-500 text-white'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
          }`}>
            {i < currentIndex ? '✓' : i + 1}
          </span>
          <span className="hidden sm:inline">{step.title}</span>
        </button>
      ))}
    </div>
  );
}
