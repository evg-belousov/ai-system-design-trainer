'use client';

import type { Difficulty } from '@/data/types';

interface QuizCardProps {
  questionNumber: number;
  totalQuestions: number;
  question: string;
  difficulty: Difficulty;
  topicLabel: string;
  children?: React.ReactNode;
}

const difficultyColors: Record<Difficulty, string> = {
  junior: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
  middle: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
  senior: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
};

export function QuizCard({ questionNumber, totalQuestions, question, difficulty, topicLabel, children }: QuizCardProps) {
  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500 dark:text-gray-400">{questionNumber} / {totalQuestions}</span>
        <div className="flex gap-2">
          <span className="text-sm px-2 py-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">{topicLabel}</span>
          <span className={`text-sm px-2 py-1 rounded ${difficultyColors[difficulty]}`}>{difficulty}</span>
        </div>
      </div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">{question}</h2>
      {children}
    </div>
  );
}
