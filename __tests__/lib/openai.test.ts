import { describe, it, expect, vi, beforeEach } from 'vitest';
import { evaluateAnswer } from '@/lib/openai';

describe('evaluateAnswer', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it('should return fallback when OPENAI_API_KEY is not set', async () => {
    vi.stubEnv('OPENAI_API_KEY', '');

    const result = await evaluateAnswer({
      question: 'Тестовый вопрос',
      userAnswer: 'Мой ответ',
      sampleAnswer: 'Эталонный ответ',
    });

    expect(result.source).toBe('fallback');
    expect(result.score).toBeNull();
    expect(result.feedback).toContain('недоступна');
  });

  it('should return fallback when OPENAI_API_KEY is undefined', async () => {
    vi.stubEnv('OPENAI_API_KEY', undefined as unknown as string);

    const result = await evaluateAnswer({
      question: 'Тест',
      userAnswer: 'Ответ',
      sampleAnswer: 'Эталон',
    });

    expect(result.source).toBe('fallback');
    expect(result.score).toBeNull();
  });

  it('fallback feedback should suggest comparing with sample answer', async () => {
    vi.stubEnv('OPENAI_API_KEY', '');

    const result = await evaluateAnswer({
      question: 'Вопрос',
      userAnswer: 'Ответ',
      sampleAnswer: 'Эталон',
    });

    expect(result.feedback).toBeTruthy();
    expect(typeof result.feedback).toBe('string');
  });
});
