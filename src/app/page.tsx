'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';
import { getAllQuestions, getTopics } from '@/lib/questions';
import { getScenarios } from '@/lib/constructor';
import { useLang } from '@/components/LanguageProvider';
import { useT } from '@/i18n/useT';

export default function HomePage() {
  const { lang } = useLang();
  const t = useT();

  const allQuestions = getAllQuestions(lang);
  const saTopics = getTopics('sa', lang);
  const sdTopics = getTopics('sd', lang);
  const aiTopics = getTopics('ai', lang);
  const saCount = allQuestions.filter(q => q.block === 'sa').length;
  const sdCount = allQuestions.filter(q => q.block === 'sd').length;
  const aiCount = allQuestions.filter(q => q.block === 'ai').length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t.home.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {t.home.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t.home.blockSA}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{t.home.questions(saCount)}</p>
            <ul className="space-y-2">
              {saTopics.map(topic => (
                <li key={topic.id} className="text-gray-700 dark:text-gray-300 text-sm">• {topic.label}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t.home.blockSD}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{t.home.questions(sdCount)}</p>
            <ul className="space-y-2">
              {sdTopics.map(topic => (
                <li key={topic.id} className="text-gray-700 dark:text-gray-300 text-sm">• {topic.label}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t.home.blockAI}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{t.home.questions(aiCount)}</p>
            <ul className="space-y-2">
              {aiTopics.map(topic => (
                <li key={topic.id} className="text-gray-700 dark:text-gray-300 text-sm">• {topic.label}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 mb-8">
          <Link
            href="/design"
            className="block bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-sm p-6 text-white hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            <h2 className="text-xl font-semibold mb-2">{t.home.constructorTitle}</h2>
            <p className="text-blue-100 text-sm mb-3">
              {t.home.constructorDesc}
            </p>
            <p className="text-blue-200 text-xs">
              {t.home.constructorScenarios(getScenarios(lang).length)}
            </p>
          </Link>
        </div>

        <div className="text-center text-gray-400 text-sm">
          {t.home.footer(allQuestions.length)}
        </div>
      </main>
    </div>
  );
}
