import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ResultCard } from '@/components/ResultCard';

describe('ResultCard', () => {
  it('should show correct result', () => {
    render(
      <ResultCard
        correct={true}
        explanation="Пояснение к ответу"
        onNext={vi.fn()}
      />
    );

    expect(screen.getByText('Правильно!')).toBeInTheDocument();
    expect(screen.getByText('Пояснение к ответу')).toBeInTheDocument();
  });

  it('should show incorrect result', () => {
    render(
      <ResultCard
        correct={false}
        explanation="Пояснение"
        onNext={vi.fn()}
      />
    );

    expect(screen.getByText('Неправильно')).toBeInTheDocument();
  });

  it('should call onNext when button clicked', () => {
    const onNext = vi.fn();
    render(
      <ResultCard
        correct={true}
        explanation="Пояснение"
        onNext={onNext}
      />
    );

    fireEvent.click(screen.getByText('Далее'));
    expect(onNext).toHaveBeenCalledOnce();
  });
});
