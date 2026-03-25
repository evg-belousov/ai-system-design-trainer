import { describe, it, expect } from 'vitest';
import { getAllQuestions, getQuestionsByBlock, getQuestionsByTopic, getQuestionsByDifficulty, getTopics } from '@/lib/questions';

describe('questions library', () => {
  it('should return all questions', () => {
    const all = getAllQuestions();
    expect(all.length).toBeGreaterThan(0);
  });

  it('should filter by block "sa"', () => {
    const sa = getQuestionsByBlock('sa');
    expect(sa.length).toBeGreaterThan(0);
    expect(sa.every(q => q.block === 'sa')).toBe(true);
  });

  it('should filter by block "sd"', () => {
    const sd = getQuestionsByBlock('sd');
    expect(sd.length).toBeGreaterThan(0);
    expect(sd.every(q => q.block === 'sd')).toBe(true);
  });

  it('should filter by block "ai"', () => {
    const ai = getQuestionsByBlock('ai');
    expect(ai.length).toBeGreaterThan(0);
    expect(ai.every(q => q.block === 'ai')).toBe(true);
  });

  it('should return 12 AI topics', () => {
    const topics = getTopics('ai');
    expect(topics).toHaveLength(12);
  });

  it('should filter AI questions by topic "rag"', () => {
    const rag = getQuestionsByTopic('ai', 'rag');
    expect(rag.length).toBeGreaterThan(0);
    expect(rag.every(q => q.topic === 'rag' && q.block === 'ai')).toBe(true);
  });

  it('should filter by topic', () => {
    const modeling = getQuestionsByTopic('sa', 'modeling');
    expect(modeling.length).toBeGreaterThan(0);
    expect(modeling.every(q => q.topic === 'modeling' && q.block === 'sa')).toBe(true);
  });

  it('should filter by difficulty', () => {
    const all = getAllQuestions();
    const junior = getQuestionsByDifficulty(all, 'junior');
    expect(junior.every(q => q.difficulty === 'junior')).toBe(true);
  });

  it('should return topics list with labels', () => {
    const topics = getTopics('sa');
    expect(topics.length).toBeGreaterThan(0);
    expect(topics[0]).toHaveProperty('id');
    expect(topics[0]).toHaveProperty('label');
  });

  it('should have unique IDs across all questions', () => {
    const all = getAllQuestions();
    const ids = all.map(q => q.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('quiz questions should have correctIndex within options range', () => {
    const all = getAllQuestions();
    const quizzes = all.filter(q => q.type === 'quiz');
    for (const q of quizzes) {
      if (q.type === 'quiz') {
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThan(q.options.length);
      }
    }
  });
});
