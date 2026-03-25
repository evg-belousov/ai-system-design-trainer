'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo, useState, useEffect, useCallback, Suspense } from 'react';
import { Header } from '@/components/Header';
import { QuizCard } from '@/components/QuizCard';
import { QuizOptions } from '@/components/QuizOptions';
import { OpenAnswer } from '@/components/OpenAnswer';
import { ResultCard } from '@/components/ResultCard';
import { ProgressBar } from '@/components/ProgressBar';
import { Timer } from '@/components/Timer';
import { useQuizSession } from '@/hooks/useQuizSession';
import { useProgress } from '@/hooks/useProgress';
import { useTimer } from '@/hooks/useTimer';
import { getAllQuestions } from '@/lib/questions';
import Link from 'next/link';

function QuizSession() {
  const searchParams = useSearchParams();
  const ids = searchParams.get('ids')?.split(',') ?? [];

  const allQuestions = getAllQuestions();
  const questions = useMemo(
    () => ids.map(id => allQuestions.find(q => q.id === id)).filter(Boolean) as typeof allQuestions,
    [ids, allQuestions]
  );

  const session = useQuizSession(questions);
  const progress = useProgress();
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const handleTimeExpire = useCallback(() => {
    if (session.state !== 'active' || !session.currentQuestion) return;
    const q = session.currentQuestion;
    if (q.type === 'quiz') {
      session.answerQuiz(-1);
      progress.recordAnswer(q.id, false);
    } else {
      session.answerOpen('');
      progress.recordAnswer(q.id, false);
    }
  }, [session, progress]);

  const timer = useTimer(60, handleTimeExpire);

  // Start timer when question becomes active, pause when answered
  useEffect(() => {
    if (session.state === 'active' && questions.length > 0) {
      const seconds = session.currentQuestion?.type === 'open' ? 180 : 60;
      timer.reset(seconds);
      timer.start();
    } else if (session.state === 'answered') {
      timer.pause();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.currentIndex, session.state]);

  const handleQuizAnswer = (selectedIndex: number) => {
    session.answerQuiz(selectedIndex);
    if (session.currentQuestion?.type === 'quiz') {
      const correct = selectedIndex === session.currentQuestion.correctIndex;
      progress.recordAnswer(session.currentQuestion.id, correct);
    }
  };

  const handleOpenAnswer = async (text: string) => {
    session.answerOpen(text);
    const q = session.currentQuestion;
    if (q?.type === 'open') {
      progress.recordAnswer(q.id, false); // Open questions not auto-scored
      setAiLoading(true);
      try {
        const apiKey = typeof window !== 'undefined' ? localStorage.getItem('openai-api-key') : null;
        const res = await fetch('/api/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: q.question,
            userAnswer: text,
            sampleAnswer: q.sampleAnswer,
            ...(apiKey && { apiKey }),
          }),
        });
        const data = await res.json();
        setAiFeedback(data.feedback);
      } catch {
        setAiFeedback(null);
      } finally {
        setAiLoading(false);
      }
    }
  };

  const handleNext = () => {
    setAiFeedback(null);
    session.next();
  };

  if (questions.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-4">Вопросы не найдены.</p>
        <Link href="/quiz" className="text-blue-600 hover:underline">Назад к настройкам</Link>
      </main>
    );
  }

  if (session.state === 'completed') {
    return (
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Тренировка завершена!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Quiz-вопросы: {session.score.correct} / {session.score.total} правильных
          </p>
          {session.score.total > 0 && (
            <p className="text-3xl font-bold text-blue-600 mb-6">
              {Math.round((session.score.correct / session.score.total) * 100)}%
            </p>
          )}
          <div className="flex gap-4 justify-center">
            <Link
              href="/quiz"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Новая тренировка
            </Link>
            <Link
              href="/"
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:border-blue-400"
            >
              На главную
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const q = session.currentQuestion!;

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex-1">
          <ProgressBar current={session.currentIndex} total={session.totalQuestions} />
        </div>
        <Timer timeLeft={timer.timeLeft} isExpired={timer.isExpired} />
      </div>

      <QuizCard
        questionNumber={session.currentIndex + 1}
        totalQuestions={session.totalQuestions}
        question={q.question}
        difficulty={q.difficulty}
        topicLabel={q.topicLabel}
      >
        {q.type === 'quiz' && (
          <QuizOptions
            options={q.options}
            onSelect={handleQuizAnswer}
            disabled={session.state === 'answered'}
            correctIndex={session.state === 'answered' ? q.correctIndex : undefined}
            selectedIndex={session.state === 'answered' && session.lastResult ? session.lastResult.userAnswer as number : undefined}
          />
        )}

        {q.type === 'open' && session.state === 'active' && (
          <OpenAnswer onSubmit={handleOpenAnswer} disabled={false} />
        )}

        {session.state === 'answered' && (
          <>
            {aiLoading && (
              <div className="mt-4 text-gray-500 text-sm">Оценка AI...</div>
            )}
            <ResultCard
              correct={session.lastResult?.correct ?? false}
              explanation={q.explanation}
              onNext={handleNext}
              aiFeedback={aiFeedback}
            />
          </>
        )}
      </QuizCard>
    </main>
  );
}

export default function QuizSessionPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <Suspense fallback={<div className="max-w-2xl mx-auto px-4 py-8 text-gray-900 dark:text-white">Загрузка...</div>}>
        <QuizSession />
      </Suspense>
    </div>
  );
}
