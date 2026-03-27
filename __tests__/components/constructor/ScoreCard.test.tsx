import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ScoreCard } from '@/components/constructor/ScoreCard';

describe('ScoreCard', () => {
  it('should render score as percentage', () => {
    render(<ScoreCard score={85} onReset={() => {}} />);

    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  it('should render reset button', () => {
    render(<ScoreCard score={50} onReset={() => {}} />);

    expect(screen.getByText('Пройти заново')).toBeInTheDocument();
  });

  it('should call onReset when reset button is clicked', () => {
    const onReset = vi.fn();
    render(<ScoreCard score={50} onReset={onReset} />);

    fireEvent.click(screen.getByText('Пройти заново'));
    expect(onReset).toHaveBeenCalledTimes(1);
  });
});
