import { describe, it, expect } from 'vitest';
import type { Question } from '@/data/types';

const AI_TOPICS = [
  { file: 'ml-fundamentals', exportName: 'mlFundamentalsQuestions', label: 'Основы ML' },
  { file: 'neural-networks', exportName: 'neuralNetworksQuestions', label: 'Нейронные сети' },
  { file: 'transformers', exportName: 'transformersQuestions', label: 'Трансформеры' },
  { file: 'llm-fundamentals', exportName: 'llmFundamentalsQuestions', label: 'Основы LLM' },
  { file: 'llm-inference', exportName: 'llmInferenceQuestions', label: 'Инференс LLM' },
  { file: 'rag', exportName: 'ragQuestions', label: 'RAG' },
  { file: 'agents', exportName: 'agentsQuestions', label: 'AI-агенты' },
  { file: 'prompt-engineering', exportName: 'promptEngineeringQuestions', label: 'Промпт-инжиниринг' },
  { file: 'vector-databases', exportName: 'vectorDatabasesQuestions', label: 'Векторные БД' },
  { file: 'mlops', exportName: 'mlopsQuestions', label: 'MLOps' },
  { file: 'ai-safety', exportName: 'aiSafetyQuestions', label: 'Безопасность AI' },
  { file: 'evaluation', exportName: 'evaluationQuestions', label: 'Оценка моделей' },
];

async function loadQuestions(file: string, exportName: string): Promise<Question[]> {
  const mod = await import(`@/data/ai/${file}`);
  return mod[exportName];
}

describe('AI block questions', () => {
  for (const { file, exportName, label } of AI_TOPICS) {
    describe(`${label} (${file})`, () => {
      let questions: Question[];

      beforeAll(async () => {
        questions = await loadQuestions(file, exportName);
      });

      it('should have 8-10 questions', () => {
        expect(questions.length).toBeGreaterThanOrEqual(8);
        expect(questions.length).toBeLessThanOrEqual(10);
      });

      it('should have block "ai" for all questions', () => {
        expect(questions.every(q => q.block === 'ai')).toBe(true);
      });

      it(`should have topic "${file.replace(/-/g, '-')}" for all questions`, () => {
        const expectedTopic = file;
        expect(questions.every(q => q.topic === expectedTopic)).toBe(true);
      });

      it('should have IDs matching format ai-{topic}-{NNN}', () => {
        const pattern = new RegExp(`^ai-${file}-\\d{3}$`);
        for (const q of questions) {
          expect(q.id).toMatch(pattern);
        }
      });

      it('should have unique IDs', () => {
        const ids = questions.map(q => q.id);
        expect(new Set(ids).size).toBe(ids.length);
      });

      it('should cover all 3 difficulty levels', () => {
        const difficulties = new Set(questions.map(q => q.difficulty));
        expect(difficulties.has('junior')).toBe(true);
        expect(difficulties.has('middle')).toBe(true);
        expect(difficulties.has('senior')).toBe(true);
      });

      it(`should have consistent topicLabel "${label}"`, () => {
        expect(questions.every(q => q.topicLabel === label)).toBe(true);
      });

      it('quiz questions should have exactly 4 options with valid correctIndex', () => {
        const quizzes = questions.filter(q => q.type === 'quiz');
        for (const q of quizzes) {
          if (q.type === 'quiz') {
            expect(q.options).toHaveLength(4);
            expect(q.correctIndex).toBeGreaterThanOrEqual(0);
            expect(q.correctIndex).toBeLessThan(4);
          }
        }
      });

      it('open questions should have non-empty sampleAnswer', () => {
        const opens = questions.filter(q => q.type === 'open');
        for (const q of opens) {
          if (q.type === 'open') {
            expect(q.sampleAnswer.length).toBeGreaterThan(0);
          }
        }
      });

      it('all questions should have non-empty explanation', () => {
        for (const q of questions) {
          expect(q.explanation.length).toBeGreaterThan(0);
        }
      });

      it('should have a mix of quiz and open questions', () => {
        const types = new Set(questions.map(q => q.type));
        expect(types.has('quiz')).toBe(true);
        expect(types.has('open')).toBe(true);
      });
    });
  }

  describe('cross-file validation', () => {
    it('should have unique IDs across all AI topics', async () => {
      const allIds: string[] = [];
      for (const { file, exportName } of AI_TOPICS) {
        const questions = await loadQuestions(file, exportName);
        allIds.push(...questions.map(q => q.id));
      }
      expect(new Set(allIds).size).toBe(allIds.length);
    });

    it('should have 12 distinct topics', async () => {
      const topics = new Set<string>();
      for (const { file, exportName } of AI_TOPICS) {
        const questions = await loadQuestions(file, exportName);
        topics.add(questions[0].topic);
      }
      expect(topics.size).toBe(12);
    });
  });
});
