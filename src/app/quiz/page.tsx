'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useMemo, Suspense } from 'react';
import { Header } from '@/components/Header';
import { getQuestionsByBlock, getQuestionsByTopic, getQuestionsByDifficulty, getTopics } from '@/lib/questions';
import type { Block, Difficulty } from '@/data/types';
import { useLang } from '@/components/LanguageProvider';
import { useT } from '@/i18n/useT';

function QuizSetup() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { lang } = useLang();
  const t = useT();
  const initialBlock = (searchParams.get('block') as Block) || 'sa';

  const [block, setBlock] = useState<Block>(initialBlock);
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');
  const [questionCount, setQuestionCount] = useState(10);

  const topics = useMemo(() => getTopics(block, lang), [block, lang]);

  const availableQuestions = useMemo(() => {
    let questions = selectedTopic === 'all'
      ? getQuestionsByBlock(block, lang)
      : getQuestionsByTopic(block, selectedTopic, lang);

    if (selectedDifficulty !== 'all') {
      questions = getQuestionsByDifficulty(questions, selectedDifficulty);
    }

    return questions;
  }, [block, selectedTopic, selectedDifficulty, lang]);

  const handleStart = () => {
    const shuffled = [...availableQuestions].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(questionCount, shuffled.length));
    const ids = selected.map(q => q.id).join(',');
    router.push(`/quiz/session?ids=${ids}`);
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">{t.quizSetup.title}</h1>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.quizSetup.block}</label>
          <div className="flex gap-3">
            <button
              className={`px-4 py-2 rounded-lg border ${block === 'sa' ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400'}`}
              onClick={() => { setBlock('sa'); setSelectedTopic('all'); }}
            >
              {t.home.blockSA}
            </button>
            <button
              className={`px-4 py-2 rounded-lg border ${block === 'sd' ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400'}`}
              onClick={() => { setBlock('sd'); setSelectedTopic('all'); }}
            >
              {t.home.blockSD}
            </button>
            <button
              className={`px-4 py-2 rounded-lg border ${block === 'ai' ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400'}`}
              onClick={() => { setBlock('ai'); setSelectedTopic('all'); }}
            >
              {t.home.blockAI}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.quizSetup.topic}</label>
          <select
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
          >
            <option value="all">{t.quizSetup.allTopics}</option>
            {topics.map(topic => (
              <option key={topic.id} value={topic.id}>{topic.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.quizSetup.difficulty}</label>
          <div className="flex gap-3">
            {(['all', 'junior', 'middle', 'senior'] as const).map(d => (
              <button
                key={d}
                className={`px-4 py-2 rounded-lg border ${selectedDifficulty === d ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400'}`}
                onClick={() => setSelectedDifficulty(d)}
              >
                {d === 'all' ? t.quizSetup.all : d}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t.quizSetup.questionCount(availableQuestions.length)}
          </label>
          <input
            type="range"
            min={1}
            max={Math.max(availableQuestions.length, 1)}
            value={Math.min(questionCount, availableQuestions.length)}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            className="w-full"
          />
          <span className="text-sm text-gray-500 dark:text-gray-400">{Math.min(questionCount, availableQuestions.length)}</span>
        </div>

        <button
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:bg-gray-300 dark:disabled:bg-gray-700"
          onClick={handleStart}
          disabled={availableQuestions.length === 0}
        >
          {t.startTraining}
        </button>
      </div>
    </main>
  );
}

export default function QuizPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <Suspense fallback={<LoadingFallback />}>
        <QuizSetup />
      </Suspense>
    </div>
  );
}

function LoadingFallback() {
  const t = useT();
  return <div className="max-w-2xl mx-auto px-4 py-8 text-gray-900 dark:text-white">{t.loading}</div>;
}
