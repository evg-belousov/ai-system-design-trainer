import { Header } from '@/components/Header';
import { getAllQuestions, getTopics } from '@/lib/questions';

export default function HomePage() {
  const allQuestions = getAllQuestions();
  const saTopics = getTopics('sa');
  const sdTopics = getTopics('sd');
  const aiTopics = getTopics('ai');
  const saCount = allQuestions.filter(q => q.block === 'sa').length;
  const sdCount = allQuestions.filter(q => q.block === 'sd').length;
  const aiCount = allQuestions.filter(q => q.block === 'ai').length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Подготовка к собеседованию
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Senior / Lead System Analyst
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Системный Анализ</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{saCount} вопросов</p>
            <ul className="space-y-2">
              {saTopics.map(t => (
                <li key={t.id} className="text-gray-700 dark:text-gray-300 text-sm">• {t.label}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">System Design</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{sdCount} вопросов</p>
            <ul className="space-y-2">
              {sdTopics.map(t => (
                <li key={t.id} className="text-gray-700 dark:text-gray-300 text-sm">• {t.label}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">AI / ML</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{aiCount} вопросов</p>
            <ul className="space-y-2">
              {aiTopics.map(t => (
                <li key={t.id} className="text-gray-700 dark:text-gray-300 text-sm">• {t.label}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-center text-gray-400 text-sm">
          Всего {allQuestions.length} вопросов · Quiz + открытые вопросы · Junior / Middle / Senior
        </div>
      </main>
    </div>
  );
}
