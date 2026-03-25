'use client';

import { useState, useCallback } from 'react';

const STORAGE_KEY = 'sdt-progress';

interface AnswerRecord {
  correct: boolean;
  answeredAt: string;
}

interface ProgressData {
  answers: Record<string, AnswerRecord>;
}

interface Stats {
  total: number;
  correct: number;
  percentage: number;
}

function loadProgress(): ProgressData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return { answers: {} };
}

function saveProgress(data: ProgressData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function useProgress() {
  const [data, setData] = useState<ProgressData>(loadProgress);

  const recordAnswer = useCallback((questionId: string, correct: boolean) => {
    setData(prev => {
      const next: ProgressData = {
        answers: {
          ...prev.answers,
          [questionId]: {
            correct,
            answeredAt: new Date().toISOString(),
          },
        },
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const getStats = useCallback((): Stats => {
    const entries = Object.values(data.answers);
    const total = entries.length;
    const correct = entries.filter(a => a.correct).length;
    return {
      total,
      correct,
      percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
    };
  }, [data]);

  const reset = useCallback(() => {
    const empty: ProgressData = { answers: {} };
    saveProgress(empty);
    setData(empty);
  }, []);

  return {
    answers: data.answers,
    recordAnswer,
    getStats,
    reset,
  };
}
