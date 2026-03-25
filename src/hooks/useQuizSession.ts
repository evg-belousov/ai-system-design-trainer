'use client';

import { useState, useCallback, useMemo } from 'react';
import type { Question } from '@/data/types';

type SessionState = 'active' | 'answered' | 'completed';

interface AnswerResult {
  correct: boolean;
  userAnswer: string | number;
}

interface Score {
  correct: number;
  total: number;
}

export function useQuizSession(questions: Question[]) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [state, setState] = useState<SessionState>(
    questions.length === 0 ? 'completed' : 'active'
  );
  const [lastResult, setLastResult] = useState<AnswerResult | null>(null);
  const [results, setResults] = useState<AnswerResult[]>([]);

  const currentQuestion = questions[currentIndex] ?? null;
  const totalQuestions = questions.length;

  const answerQuiz = useCallback((selectedIndex: number) => {
    if (state !== 'active' || !currentQuestion || currentQuestion.type !== 'quiz') return;

    const correct = selectedIndex === currentQuestion.correctIndex;
    const result: AnswerResult = { correct, userAnswer: selectedIndex };
    setLastResult(result);
    setResults(prev => [...prev, result]);
    setState('answered');
  }, [state, currentQuestion]);

  const answerOpen = useCallback((text: string) => {
    if (state !== 'active' || !currentQuestion || currentQuestion.type !== 'open') return;

    // Open questions are not auto-scored; mark as correct=false (evaluated externally)
    const result: AnswerResult = { correct: false, userAnswer: text };
    setLastResult(result);
    setResults(prev => [...prev, result]);
    setState('answered');
  }, [state, currentQuestion]);

  const next = useCallback(() => {
    if (state !== 'answered') return;

    const nextIndex = currentIndex + 1;
    if (nextIndex >= totalQuestions) {
      setState('completed');
    } else {
      setCurrentIndex(nextIndex);
      setLastResult(null);
      setState('active');
    }
  }, [state, currentIndex, totalQuestions]);

  const score = useMemo((): Score => {
    // Only count quiz questions for automatic scoring
    const quizResults = results.filter((_, i) => questions[i]?.type === 'quiz');
    return {
      correct: quizResults.filter(r => r.correct).length,
      total: quizResults.length,
    };
  }, [results, questions]);

  return {
    state,
    currentQuestion,
    currentIndex,
    totalQuestions,
    lastResult,
    score,
    answerQuiz,
    answerOpen,
    next,
  };
}
