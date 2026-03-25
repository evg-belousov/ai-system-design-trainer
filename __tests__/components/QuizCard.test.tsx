import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QuizCard } from '@/components/QuizCard';

describe('QuizCard', () => {
  it('should render question text', () => {
    render(
      <QuizCard
        questionNumber={1}
        totalQuestions={10}
        question="Какие типы связей в ER-моделях?"
        difficulty="middle"
        topicLabel="Нотации моделирования"
      />
    );

    expect(screen.getByText('Какие типы связей в ER-моделях?')).toBeInTheDocument();
  });

  it('should display question counter', () => {
    render(
      <QuizCard
        questionNumber={3}
        totalQuestions={10}
        question="Тест"
        difficulty="junior"
        topicLabel="Тема"
      />
    );

    expect(screen.getByText('3 / 10')).toBeInTheDocument();
  });

  it('should display difficulty badge', () => {
    render(
      <QuizCard
        questionNumber={1}
        totalQuestions={5}
        question="Тест"
        difficulty="senior"
        topicLabel="Тема"
      />
    );

    expect(screen.getByText('senior')).toBeInTheDocument();
  });

  it('should display topic label', () => {
    render(
      <QuizCard
        questionNumber={1}
        totalQuestions={5}
        question="Тест"
        difficulty="junior"
        topicLabel="Базы данных"
      />
    );

    expect(screen.getByText('Базы данных')).toBeInTheDocument();
  });
});
