import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuizOptions } from '@/components/QuizOptions';

const options = ['Вариант A', 'Вариант B', 'Вариант C', 'Вариант D'];

describe('QuizOptions', () => {
  it('should render all options', () => {
    render(<QuizOptions options={options} onSelect={vi.fn()} disabled={false} />);

    for (const opt of options) {
      expect(screen.getByText(opt)).toBeInTheDocument();
    }
  });

  it('should call onSelect with correct index', () => {
    const onSelect = vi.fn();
    render(<QuizOptions options={options} onSelect={onSelect} disabled={false} />);

    fireEvent.click(screen.getByText('Вариант C'));
    expect(onSelect).toHaveBeenCalledWith(2);
  });

  it('should not call onSelect when disabled', () => {
    const onSelect = vi.fn();
    render(<QuizOptions options={options} onSelect={onSelect} disabled={true} />);

    fireEvent.click(screen.getByText('Вариант A'));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('should highlight correct answer when showing result', () => {
    render(
      <QuizOptions
        options={options}
        onSelect={vi.fn()}
        disabled={true}
        correctIndex={1}
        selectedIndex={2}
      />
    );

    const correctBtn = screen.getByText('Вариант B').closest('button');
    expect(correctBtn?.className).toContain('correct');
  });
});
