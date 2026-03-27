'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { ScenarioCard } from '@/components/constructor/ScenarioCard';
import { useConstructorProgress } from '@/hooks/useConstructorProgress';
import { getScenarios } from '@/lib/constructor';

const scenarios = getScenarios();

export default function DesignPage() {
  const [difficulty, setDifficulty] = useState<'all' | 'middle' | 'senior'>('all');
  const { getProgress } = useConstructorProgress();

  const filtered = difficulty === 'all'
    ? scenarios
    : scenarios.filter(s => s.difficulty === difficulty);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            System Design Constructor
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Проектируйте реальные системы шаг за шагом, изучая trade-offs и лучшие практики
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          {(['all', 'middle', 'senior'] as const).map(level => (
            <button
              key={level}
              onClick={() => setDifficulty(level)}
              className={`px-4 py-1.5 text-sm rounded-full font-medium transition-colors cursor-pointer ${
                difficulty === level
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {level === 'all' ? 'Все' : level}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map(scenario => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              progress={getProgress(scenario.id)}
            />
          ))}
        </div>

        <div className="text-center mt-8 text-gray-400 text-sm">
          {scenarios.length} сценариев · Middle / Senior
        </div>
      </main>
    </div>
  );
}
