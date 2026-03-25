import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useQuizSession } from '@/hooks/useQuizSession';
import type { QuizQuestion, OpenQuestion } from '@/data/types';

const mockQuizQuestion: QuizQuestion = {
  id: 'test-001',
  block: 'sa',
  topic: 'modeling',
  topicLabel: 'Нотации моделирования',
  difficulty: 'junior',
  type: 'quiz',
  question: 'Тестовый вопрос?',
  options: ['A', 'B', 'C', 'D'],
  correctIndex: 0,
  explanation: 'Правильный ответ — A.',
};

const mockOpenQuestion: OpenQuestion = {
  id: 'test-002',
  block: 'sa',
  topic: 'modeling',
  topicLabel: 'Нотации моделирования',
  difficulty: 'middle',
  type: 'open',
  question: 'Открытый вопрос?',
  sampleAnswer: 'Эталонный ответ.',
  explanation: 'Объяснение.',
};

const mockQuestions = [mockQuizQuestion, mockOpenQuestion];

describe('useQuizSession', () => {
  it('should start in ACTIVE state with first question', () => {
    const { result } = renderHook(() => useQuizSession(mockQuestions));

    expect(result.current.state).toBe('active');
    expect(result.current.currentQuestion).toEqual(mockQuizQuestion);
    expect(result.current.currentIndex).toBe(0);
    expect(result.current.totalQuestions).toBe(2);
  });

  it('should transition to ANSWERED after answering quiz', () => {
    const { result } = renderHook(() => useQuizSession(mockQuestions));

    act(() => {
      result.current.answerQuiz(0);
    });

    expect(result.current.state).toBe('answered');
    expect(result.current.lastResult?.correct).toBe(true);
  });

  it('should detect incorrect quiz answer', () => {
    const { result } = renderHook(() => useQuizSession(mockQuestions));

    act(() => {
      result.current.answerQuiz(2);
    });

    expect(result.current.state).toBe('answered');
    expect(result.current.lastResult?.correct).toBe(false);
  });

  it('should move to next question', () => {
    const { result } = renderHook(() => useQuizSession(mockQuestions));

    act(() => {
      result.current.answerQuiz(0);
    });

    act(() => {
      result.current.next();
    });

    expect(result.current.state).toBe('active');
    expect(result.current.currentQuestion).toEqual(mockOpenQuestion);
    expect(result.current.currentIndex).toBe(1);
  });

  it('should transition to COMPLETED after all questions', () => {
    const { result } = renderHook(() => useQuizSession(mockQuestions));

    // Answer first
    act(() => {
      result.current.answerQuiz(0);
    });
    act(() => {
      result.current.next();
    });

    // Answer second (open)
    act(() => {
      result.current.answerOpen('мой ответ');
    });
    act(() => {
      result.current.next();
    });

    expect(result.current.state).toBe('completed');
  });

  it('should track score', () => {
    const { result } = renderHook(() => useQuizSession(mockQuestions));

    act(() => {
      result.current.answerQuiz(0); // correct
    });
    act(() => {
      result.current.next();
    });
    act(() => {
      result.current.answerOpen('ответ');
    });
    act(() => {
      result.current.next();
    });

    expect(result.current.score.correct).toBe(1); // only quiz counted
    expect(result.current.score.total).toBe(1); // only quiz counted
  });

  it('should handle empty questions array', () => {
    const { result } = renderHook(() => useQuizSession([]));
    expect(result.current.state).toBe('completed');
  });
});
