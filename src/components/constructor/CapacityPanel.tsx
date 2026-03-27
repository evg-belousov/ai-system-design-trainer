'use client';

import { useState, useRef, useEffect } from 'react';
import type { CapacityEstimate } from '@/data/constructor/types';

interface CapacityPanelProps {
  estimates: CapacityEstimate[];
}

export function CapacityPanel({ estimates }: CapacityPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const [changedLabels, setChangedLabels] = useState<Set<string>>(new Set());
  const prevEstimates = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    const changed = new Set<string>();
    const currentMap = new Map(estimates.map(e => [e.label, e.value]));

    for (const est of estimates) {
      const prev = prevEstimates.current.get(est.label);
      if (prev !== undefined && prev !== est.value) {
        changed.add(est.label);
      }
    }
    // Also detect new labels that weren't in previous
    for (const est of estimates) {
      if (!prevEstimates.current.has(est.label)) {
        changed.add(est.label);
      }
    }

    prevEstimates.current = currentMap;

    if (changed.size > 0) {
      setChangedLabels(changed);
      const timer = setTimeout(() => setChangedLabels(new Set()), 1500);
      return () => clearTimeout(timer);
    }
  }, [estimates]);

  if (estimates.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Capacity Estimation
        </h3>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Выберите параметры системы — расчёты появятся автоматически
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Capacity Estimation
        </h3>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
        >
          {expanded ? 'Скрыть расчёты' : 'Показать расчёты'}
        </button>
      </div>

      <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-2">
        Цифры пересчитываются при каждом выборе технологии
      </p>

      <div className="grid grid-cols-2 gap-2">
        {estimates.map((est, i) => {
          const isChanged = changedLabels.has(est.label);
          return (
            <div
              key={est.label}
              className={`rounded-lg px-2.5 py-2 transition-colors duration-300 ${
                isChanged
                  ? 'bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-300 dark:ring-blue-700'
                  : 'bg-gray-50 dark:bg-gray-900'
              }`}
            >
              <div className="text-[10px] text-gray-400 dark:text-gray-500">{est.label}</div>
              <div className={`text-sm font-semibold transition-colors duration-300 ${
                isChanged
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-900 dark:text-white'
              }`}>
                {est.value}
              </div>
              {expanded && (
                <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 border-t border-gray-200 dark:border-gray-700 pt-1">
                  {est.formula}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
