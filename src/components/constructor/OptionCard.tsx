'use client';

import { useState } from 'react';
import type { Option } from '@/data/constructor/types';

interface OptionCardProps {
  option: Option;
  selected: boolean;
  onToggle: () => void;
}

export function OptionCard({ option, selected, onToggle }: OptionCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`rounded-lg border-2 transition-colors cursor-pointer ${
        selected
          ? 'border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-600'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full text-left p-3 cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <span className={`font-medium text-sm ${selected ? 'text-green-700 dark:text-green-300' : 'text-gray-900 dark:text-white'}`}>
            {option.label}
          </span>
          {selected && (
            <span className="text-green-600 dark:text-green-400 text-xs font-medium">
              Выбрано
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{option.description}</p>
      </button>

      <div className="px-3 pb-2">
        <button
          onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
        >
          {expanded ? 'Скрыть детали' : 'Подробнее'}
        </button>

        {expanded && (
          <div className="mt-2 space-y-2 text-xs">
            <div>
              <span className="font-medium text-green-700 dark:text-green-400">Плюсы: </span>
              <span className="text-gray-600 dark:text-gray-400">{option.pros.join(', ')}</span>
            </div>
            <div>
              <span className="font-medium text-red-700 dark:text-red-400">Минусы: </span>
              <span className="text-gray-600 dark:text-gray-400">{option.cons.join(', ')}</span>
            </div>
            <div>
              <span className="font-medium text-blue-700 dark:text-blue-400">Лучше всего когда: </span>
              <span className="text-gray-600 dark:text-gray-400">{option.bestWhen}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
